"""Warm yt-dlp extraction service.

The Node backend used to spawn a brand-new `yt-dlp` subprocess for every
single /api/formats[/quick] call — each one pays Python interpreter startup
plus yt-dlp loading its ~1700 extractors from scratch, before any network
request to the actual video platform even happens. Measured on the VPS:
this overhead was a real chunk of the 2-4s "Reading..." wait, on every
platform, not just YouTube.

This service imports yt-dlp once at process start and keeps running —
every request after the first one skips that startup cost entirely and
goes straight to the network-bound extraction. The Node backend calls this
over HTTP instead of spawning a subprocess, with a subprocess fallback if
this service is ever unreachable (see callExtractorService() in server.js).

Run with: uvicorn extractor_service:app --host 127.0.0.1 --port 4500
"""

import json
import os
import time
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, Response
from fastapi.responses import JSONResponse
import yt_dlp

# This runs as its own process (started separately from the Node backend,
# e.g. via pm2), so it never sees Node's dotenv-loaded environment — it has
# to read backend/.env itself, or COOKIES_FILE/POT_PROVIDER_URL silently
# come back None here even though they're set correctly for the Node side.
# Confirmed live: this was exactly why YouTube extraction through the warm
# service hit the bot wall even after cookies+PO token were fixed elsewhere.
BACKEND_DIR = Path(__file__).resolve().parent
load_dotenv(BACKEND_DIR / '.env')

app = FastAPI()

# Resolved to an absolute path against this file's directory — a relative
# `./cookies.txt` in .env would otherwise depend on whatever cwd the process
# manager happened to launch this service from, which is exactly the kind
# of silent mismatch that caused the bot wall even after cookies were set.
_cookies_raw = os.environ.get('COOKIES_FILE') or None
COOKIES_FILE = str((BACKEND_DIR / _cookies_raw).resolve()) if _cookies_raw else None
POT_PROVIDER_URL = os.environ.get('POT_PROVIDER_URL') or None

print(f'[extractor-service] startup — COOKIES_FILE={COOKIES_FILE!r} (exists={Path(COOKIES_FILE).exists() if COOKIES_FILE else None}) POT_PROVIDER_URL={POT_PROVIDER_URL!r}', flush=True)


def build_argv(url: str, quick: bool, flat_playlist: bool) -> list:
    """Same argv shape as the Node side's subprocess calls (server.js), so
    yt-dlp's own CLI parser builds the opts dict — rather than handing
    YoutubeDL a hand-built opts dict directly. Verified live: a hand-built
    `extractor_args` dict was silently not applied (yt-dlp queried its
    default client list instead of the one requested), while this approach
    — reusing the exact parser that the already-confirmed-working CLI
    command goes through — produces the correct, working opts every time. """
    argv = ['--no-warnings']
    argv += ['--flat-playlist'] if flat_playlist else ['--no-playlist']
    if COOKIES_FILE:
        argv += ['--cookies', COOKIES_FILE]
    argv += ['--extractor-args', f'youtube:player_client={"web" if quick else "web,android,ios"}']
    if POT_PROVIDER_URL:
        argv += ['--extractor-args', f'youtubepot-bgutilhttp:base_url={POT_PROVIDER_URL}']
    argv.append(url)
    return argv


@app.get('/ping')
async def ping():
    return {'ok': True, 'uptime': time.time()}


@app.post('/extract')
async def extract(payload: dict):
    url = (payload or {}).get('url', '').strip()
    quick = bool((payload or {}).get('quick', False))
    flat_playlist = bool((payload or {}).get('flatPlaylist', False))
    if not url:
        return JSONResponse({'error': 'missing url'}, status_code=400)

    t0 = time.time()
    try:
        _, _, urls, ydl_opts = yt_dlp.parse_options(build_argv(url, quick, flat_playlist))
        ydl_opts['quiet'] = True
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            raw_info = ydl.extract_info(urls[0], download=False)
            if raw_info is None:
                raise RuntimeError('extract_info() returned None — ydl_opts: ' + json.dumps({k: v for k, v in ydl_opts.items() if k in ('skip_download', 'simulate', 'extract_flat', 'noplaylist')}))
            info = ydl.sanitize_info(raw_info)
        # FastAPI's default return-value encoder (jsonable_encoder) choked
        # silently on a real YouTube info dict — the request logged as
        # successful here, but the client received a bare `null` body with
        # no error surfaced anywhere. json.dumps() is the exact same
        # serializer yt-dlp's own `-J` CLI flag uses on this same
        # sanitize_info() output, so it's proven to handle it; returning a
        # raw Response with it bypasses FastAPI's encoder entirely. Any
        # serialization problem now raises here, inside the try block,
        # instead of vanishing after the fact.
        body = json.dumps(info)
        print(f'[extractor-service] {"quick" if quick else "full"} {int((time.time() - t0) * 1000)}ms — {url}', flush=True)
        return Response(content=body, media_type='application/json')
    except Exception as e:
        print(f'[extractor-service] FAILED after {int((time.time() - t0) * 1000)}ms — {url} — {e}', flush=True)
        return JSONResponse({'error': str(e)}, status_code=422)
