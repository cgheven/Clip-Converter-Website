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

import os
import time

from fastapi import FastAPI
from fastapi.responses import JSONResponse
import yt_dlp

app = FastAPI()

COOKIES_FILE = os.environ.get('COOKIES_FILE') or None
POT_PROVIDER_URL = os.environ.get('POT_PROVIDER_URL') or None


def build_extractor_args(quick: bool) -> dict:
    args = {
        'youtube': {'player_client': ['web'] if quick else ['web', 'android', 'ios']},
    }
    if POT_PROVIDER_URL:
        args['youtubepot-bgutilhttp'] = {'base_url': [POT_PROVIDER_URL]}
    return args


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

    opts = {
        'quiet': True,
        'no_warnings': True,
        'noplaylist': not flat_playlist,
        'extract_flat': 'in_playlist' if flat_playlist else False,
        'skip_download': True,
        'extractor_args': build_extractor_args(quick),
    }
    if COOKIES_FILE:
        opts['cookiefile'] = COOKIES_FILE

    t0 = time.time()
    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.sanitize_info(ydl.extract_info(url, download=False))
        print(f'[extractor-service] {"quick" if quick else "full"} {int((time.time() - t0) * 1000)}ms — {url}', flush=True)
        return info
    except Exception as e:
        print(f'[extractor-service] FAILED after {int((time.time() - t0) * 1000)}ms — {url} — {e}', flush=True)
        return JSONResponse({'error': str(e)}, status_code=422)
