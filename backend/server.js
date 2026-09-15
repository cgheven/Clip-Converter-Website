require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 14);

/* ------------------------------------------------------------------ config */
const CFG = {
  port: Number(process.env.PORT || 4000),
  origins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',').map((s) => s.trim()),
  downloadDir: path.resolve(process.env.DOWNLOAD_DIR || './downloads'),
  fileTtlMin: Number(process.env.FILE_TTL_MINUTES || 20),
  cleanupEveryMin: Number(process.env.CLEANUP_INTERVAL_MINUTES || 5),
  maxJobs: Number(process.env.MAX_CONCURRENT_JOBS || 2),
  jobTimeoutMin: Number(process.env.JOB_TIMEOUT_MINUTES || 15),
  cacheMin: Number(process.env.FORMATS_CACHE_MINUTES || 30),
  ytdlp: process.env.YTDLP_PATH || 'yt-dlp',
  ffmpeg: process.env.FFMPEG_PATH || 'ffmpeg',
  cookies: process.env.COOKIES_FILE || null,
};

if (!fs.existsSync(CFG.downloadDir)) fs.mkdirSync(CFG.downloadDir, { recursive: true });

/* --------------------------------------------------------------- app setup */
const app = express();
app.set('trust proxy', 1); // behind nginx
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
app.use(express.json({ limit: '16kb' }));
app.use(
  cors({
    origin: (origin, cb) =>
      !origin || CFG.origins.includes(origin) ? cb(null, true) : cb(new Error('Blocked by CORS')),
    exposedHeaders: ['Content-Disposition'],
  })
);

const limit = (max) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Wait a few minutes and try again.' },
  });

/* --------------------------------------------------------------- utilities */
const cookieArgs = () => (CFG.cookies ? ['--cookies', CFG.cookies] : []);

function isValidUrl(str) {
  try {
    const u = new URL(str);
    return (u.protocol === 'http:' || u.protocol === 'https:') && !!u.hostname;
  } catch {
    return false;
  }
}

function humanSize(bytes) {
  if (!bytes) return null;
  const mb = bytes / 1048576;
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(0)} MB`;
}

function run(cmd, args, { timeoutMs = 45000, onStderr } = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args);
    let out = '';
    let err = '';
    const timer = setTimeout(() => {
      proc.kill('SIGKILL');
      reject(new Error('TIMEOUT'));
    }, timeoutMs);

    proc.stdout.on('data', (d) => (out += d));
    proc.stderr.on('data', (d) => {
      const s = d.toString();
      err += s;
      if (onStderr) onStderr(s);
    });
    proc.on('error', (e) => {
      clearTimeout(timer);
      reject(e);
    });
    proc.on('close', (code) => {
      clearTimeout(timer);
      code === 0 ? resolve(out) : reject(new Error(err.slice(-400) || `exit ${code}`));
    });
  });
}

/** yt-dlp gives upload_date as "YYYYMMDD" — turn it into "YYYY-MM-DD". */
function formatUploadDate(raw) {
  if (!raw || raw.length !== 8) return null;
  return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
}

/** The source's native resolution, e.g. "3840x2160", for display purposes. */
function nativeResolution(info) {
  const formats = info.formats || [];
  const best = formats
    .filter((f) => f.height && f.width)
    .sort((a, b) => b.height - a.height)[0];
  if (best) return `${best.width}x${best.height}`;
  if (info.width && info.height) return `${info.width}x${info.height}`;
  return null;
}

/** filesize if yt-dlp reported it, else an estimate from bitrate * duration. */
function estimateSize(fmt, durationSec) {
  if (!fmt) return 0;
  if (fmt.filesize) return fmt.filesize;
  if (fmt.filesize_approx) return fmt.filesize_approx;
  if (fmt.tbr && durationSec) return Math.round((fmt.tbr * 1000 * durationSec) / 8);
  return 0;
}

/** Resolves a format's size from metadata only — no network probe. A HEAD
 * request per format was tried here for byte-exact sizes, but it added a
 * real round-trip (up to the timeout) to every first-time lookup, which
 * made "Get Clip" noticeably slower than the accuracy gain was worth.
 * bestSizeSource() already gets most of the benefit for free by preferring
 * a same-height sibling's real filesize over the bitrate guess. */
async function resolveSize(fmt, durationSec) {
  return estimateSize(fmt, durationSec);
}

/** Picks the best format to size a quality option from: one with a real,
 * server-reported `filesize`/`filesize_approx` beats one we'd only be able
 * to size via the `tbr * duration` estimate. `tbr` is an *average* bitrate,
 * so it wildly overshoots the true size for low-motion content (a mostly-
 * static "lyric video" over one image compresses far below its quality
 * tier's average) — preferring a same-height sibling's real filesize, even
 * if it's a different codec than the one we'll actually play/download,
 * keeps the shown estimate honest. */
function bestSizeSource(candidates, sortKey) {
  const withRealSize = candidates.filter((f) => f.filesize || f.filesize_approx);
  const pool = withRealSize.length ? withRealSize : candidates;
  return pool.sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0))[0];
}

const AUDIO_FORMATS = [
  { ext: 'mp3', label: 'MP3' },
  { ext: 'm4a', label: 'M4A' },
  { ext: 'wav', label: 'WAV' },
  { ext: 'flac', label: 'FLAC' },
];

/** Turn yt-dlp's raw format list into a short, human-friendly set of choices.
 * Sizes are resolved in parallel (one HEAD probe per format that lacks a
 * real filesize) so the added latency is roughly one round-trip, not one
 * per quality option. */
async function buildOptions(info) {
  const formats = info.formats || [];
  const duration = info.duration || 0;
  const heights = [...new Set(formats.filter((f) => f.height).map((f) => f.height))].sort((a, b) => b - a);

  const wanted = [2160, 1440, 1080, 720, 480, 360];
  const options = [];

  const audioCandidates = formats.filter((f) => f.vcodec === 'none' && f.acodec !== 'none');
  const bestAudio = bestSizeSource(audioCandidates, 'abr');

  const heightPicks = wanted
    .filter((h) => heights.includes(h))
    .map((h) => {
      const atHeight = formats.filter((f) => f.height === h);
      // Prefer H.264/AAC at this height — plays everywhere without extra codecs;
      // AV1/VP9 (yt-dlp's usual default) needs an extra Windows codec pack to play.
      const h264 = atHeight
        .filter((f) => (f.vcodec || '').startsWith('avc1'))
        .sort((a, b) => (b.tbr || 0) - (a.tbr || 0))[0];
      const sample = h264 || atHeight.sort((a, b) => (b.tbr || 0) - (a.tbr || 0))[0];
      return { h, sample, sizeSource: bestSizeSource(atHeight, 'tbr') };
    });

  const [aSize, ...vSizes] = await Promise.all([
    resolveSize(bestAudio, duration),
    ...heightPicks.map(({ sizeSource }) => resolveSize(sizeSource, duration)),
  ]);

  heightPicks.forEach(({ h, sample }, i) => {
    options.push({
      id: `v${h}`,
      kind: 'video',
      label: `${h}p`,
      note: h >= 2160 ? '4K' : h >= 1440 ? 'Quad HD' : h >= 1080 ? 'Full HD' : h >= 720 ? 'HD' : 'Standard',
      ext: 'mp4',
      resolution: sample?.width && sample?.height ? `${sample.width}x${sample.height}` : null,
      size: humanSize(vSizes[i] + aSize),
      selector: `bestvideo[height<=${h}][vcodec^=avc1]+bestaudio[acodec^=mp4a]/bestvideo[height<=${h}]+bestaudio/best[height<=${h}]`,
    });
  });

  // Fallback when no heights were reported (some sites give a single stream)
  if (!options.length) {
    options.push({
      id: 'vbest',
      kind: 'video',
      label: 'Best available',
      note: 'Highest quality',
      ext: 'mp4',
      size: humanSize(info.filesize_approx),
      selector: 'bestvideo[vcodec^=avc1]+bestaudio[acodec^=mp4a]/best',
    });
  }

  for (const af of AUDIO_FORMATS) {
    options.push({
      id: `audio-${af.ext}`,
      kind: 'audio',
      label: `Audio (${af.label})`,
      note: af.label,
      ext: af.ext,
      size: humanSize(aSize),
      selector: 'bestaudio/best',
    });
  }

  return options;
}

/** Picks the direct CDN URL for a subtitle track's VTT format out of
 * yt-dlp's per-language format list (each language maps to an array of
 * {ext, url} entries — json3/srv1/srv2/srv3/ttml/srt/vtt). Fetching this
 * URL directly (see /api/transcript) skips spawning yt-dlp entirely —
 * confirmed locally: the same content a full yt-dlp run would write comes
 * back from a plain HTTP GET to this URL, no extraction step needed. */
function pickVttUrl(tracks) {
  if (!Array.isArray(tracks)) return null;
  const vtt = tracks.find((t) => t.ext === 'vtt');
  return (vtt || tracks[0])?.url || null;
}

/** Language codes with a subtitle track (manual first, capped auto-captions after). */
// YouTube's automatic_captions dict lists 100+ translate targets in roughly
// alphabetical order, so capping to 20 without reordering surfaces mostly
// obscure codes ('aa' Afar, 'ab' Abkhazian, ...) ahead of languages people
// actually pick — and some of those obscure auto-translate targets don't
// reliably produce real captions when fetched. Put commonly-used languages
// first so both the visible list and the auto-selected default favor ones
// that actually work.
const PRIORITY_LANGS = [
  'en', 'en-US', 'en-GB', 'hi', 'es', 'es-419', 'pt', 'pt-BR', 'fr', 'ar',
  'ru', 'de', 'ja', 'ko', 'zh-Hans', 'zh-Hant', 'bn', 'ur', 'id', 'tr', 'it', 'vi',
];
function sortLangsByPriority(langs) {
  return [...langs].sort((a, b) => {
    const ai = PRIORITY_LANGS.indexOf(a);
    const bi = PRIORITY_LANGS.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

function buildSubtitleOptions(info) {
  const manual = info.subtitles || {};
  const auto = sortLangsByPriority(Object.keys(info.automatic_captions || {})).slice(0, 20);
  const options = [];

  for (const lang of Object.keys(manual)) {
    options.push({ id: `sub-${lang}`, kind: 'subtitle', lang, auto: false, label: lang, note: 'Subtitle', ext: 'vtt', url: pickVttUrl(manual[lang]) });
  }
  for (const lang of auto) {
    if (manual[lang]) continue;
    options.push({ id: `sub-auto-${lang}`, kind: 'subtitle', lang, auto: true, label: lang, note: 'Auto-generated', ext: 'vtt', url: pickVttUrl(info.automatic_captions[lang]) });
  }
  return options;
}

/** Converts a downloaded .vtt subtitle file into a clean, accurate
 * transcript — both a flat string (for copy/download) and a list of
 * timestamped paragraphs (for a readable display, like a real transcript
 * viewer instead of one giant unbroken block of text).
 *
 * The cleaning is more than stripping timestamp lines: YouTube's
 * auto-generated captions use a "rolling" 2-line format — each cue repeats
 * the previous cue's last line on top and adds one new line below it (for
 * the scrolling-caption effect on the video player). Verified against a
 * real auto-caption file: naively joining every cue's lines repeats every
 * sentence 2-3 times. Detected via the inline `<00:00:01.234>` word-timing
 * tags auto-captions carry (manual, creator-written captions never have
 * these) — for those, every cue's lines are genuine new text and are
 * joined as-is instead. */
function vttToSegments(vtt) {
  const isRolling = /<\d{2}:\d{2}:\d{2}\.\d{3}>/.test(vtt);

  const lines = vtt.split(/\r?\n/);
  const cues = []; // { start, lines }
  let current = null;

  for (const line of lines) {
    if (line.includes('-->')) {
      const m = line.match(/(\d{2}):(\d{2}):(\d{2})\.(\d{3})/);
      const start = m ? Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) + Number(m[4]) / 1000 : 0;
      current = { start, lines: [] };
      cues.push(current);
      continue;
    }
    const t = line.trim();
    if (!t || /^(WEBVTT|Kind:|Language:|NOTE|STYLE)/.test(t)) continue;
    if (current) current.lines.push(t);
  }

  const clean = []; // { start, text }
  let prevLast = '';
  for (const cue of cues) {
    const cleanLines = cue.lines
      .map((l) => l.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    if (!cleanLines.length) continue;

    if (isRolling) {
      const last = cleanLines[cleanLines.length - 1];
      if (last === prevLast) continue; // repeated top line of the next roll
      clean.push({ start: cue.start, text: last });
      prevLast = last;
    } else {
      clean.push({ start: cue.start, text: cleanLines.join(' ') });
    }
  }

  // Group consecutive lines into ~30s paragraphs, each labeled with its
  // start time — reads like an actual transcript instead of one wall of text.
  const PARAGRAPH_SECONDS = 30;
  const segments = [];
  for (const line of clean) {
    const lastSeg = segments[segments.length - 1];
    if (!lastSeg || line.start - lastSeg.start >= PARAGRAPH_SECONDS) {
      segments.push({ start: line.start, text: line.text });
    } else {
      lastSeg.text += ` ${line.text}`;
    }
  }

  const text = clean.map((l) => l.text).join(' ').replace(/\s+/g, ' ').trim();
  return { text, segments };
}

/** A handful of distinct thumbnail resolutions (largest first), deduped —
 * yt-dlp's `thumbnails` array often repeats the same image at several URLs. */
function buildThumbnailOptions(info) {
  const list = Array.isArray(info.thumbnails)
    ? info.thumbnails.filter((t) => t.url && t.width && t.height)
    : [];
  const sorted = [...list].sort((a, b) => b.width * b.height - a.width * a.height);
  const seen = new Set();
  const options = [];

  for (const t of sorted) {
    const key = `${t.width}x${t.height}`;
    if (seen.has(key)) continue;
    seen.add(key);
    options.push({
      id: `thumb-${key}`,
      kind: 'thumbnail',
      url: t.url,
      label: `${t.width}×${t.height}`,
      note: t.width >= 1280 ? 'HD' : 'Image',
    });
    if (options.length >= 4) break;
  }

  if (!options.length && info.thumbnail) {
    options.push({ id: 'thumb-default', kind: 'thumbnail', url: info.thumbnail, label: 'Thumbnail', note: 'Image' });
  }
  return options;
}

/* ------------------------------------------------------------ formats cache */
const cache = new Map();
function cacheGet(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expires) {
    cache.delete(key);
    return null;
  }
  return hit.value;
}
function cacheSet(key, value) {
  if (cache.size > 500) cache.delete(cache.keys().next().value);
  cache.set(key, { value, expires: Date.now() + CFG.cacheMin * 60 * 1000 });
}

/* -------------------------------------------------------------- job manager */
const jobs = new Map(); // jobId -> { status, progress, stage, file, name, error, createdAt }
let active = 0;
const pending = [];

function pump() {
  while (active < CFG.maxJobs && pending.length) {
    const task = pending.shift();
    active++;
    task().finally(() => {
      active--;
      pump();
    });
  }
}

function enqueue(task) {
  pending.push(task);
  pump();
}

function startJob(url, option, trim) {
  const jobId = nanoid();
  jobs.set(jobId, {
    status: 'queued',
    progress: 0,
    stage: 'Waiting in queue',
    createdAt: Date.now(),
  });

  enqueue(async () => {
    const job = jobs.get(jobId);
    if (!job) return;
    job.status = 'running';
    job.stage = 'Starting';

    const template = path.join(CFG.downloadDir, `${jobId}.%(ext)s`);
    const isSubtitle = option.kind === 'subtitle';
    const args = [
      url,
      '-o', template,
      '--no-playlist',
      '--no-warnings',
      '--newline',
      '--ffmpeg-location', CFG.ffmpeg,
      ...cookieArgs(),
    ];

    if (isSubtitle) {
      args.push(
        '--skip-download',
        '--write-subs',
        '--sub-langs', option.lang,
        option.auto ? '--write-auto-subs' : '--no-write-auto-subs'
      );
    } else {
      args.push('-f', option.selector, '--print', 'after_move:filepath');
      if (option.kind === 'audio') {
        args.push('--extract-audio', '--audio-format', option.ext, '--audio-quality', '0');
      } else {
        args.push('--merge-output-format', 'mp4');
      }
      // Download only the requested range instead of the whole video/audio.
      if (trim) {
        args.push('--download-sections', `*${trim.start}-${trim.end}`);
        // For video we skip --force-keyframes-at-cuts: it forces a slow
        // re-encode for a frame-perfect cut, and the default keyframe-snapped
        // cut (accurate to roughly a second) is already correct and fast.
        // For audio it's required, not just cosmetic — without it, the
        // ExtractAudio postprocessor (mp3/m4a/wav/flac conversion) keeps the
        // clip's original absolute timestamps and pads the start with
        // silence to compensate, so a "3s-8s" trim comes out as an ~8s file
        // (silence + audio) instead of a clean 5s one. Verified locally.
        if (option.kind === 'audio') args.push('--force-keyframes-at-cuts');
      }
    }

    try {
      let stdout = '';
      await new Promise((resolve, reject) => {
        const proc = spawn(CFG.ytdlp, args);
        const timer = setTimeout(() => {
          proc.kill('SIGKILL');
          reject(new Error('This download took too long and was stopped.'));
        }, CFG.jobTimeoutMin * 60 * 1000);

        proc.stdout.on('data', (d) => {
          const text = d.toString();
          stdout += text;
          const m = text.match(/\[download\]\s+([\d.]+)%/);
          if (m) {
            job.progress = Math.min(97, parseFloat(m[1]));
            job.stage = 'Downloading';
          }
          if (text.includes('[Merger]') || text.includes('[ExtractAudio]')) {
            job.stage = option.kind === 'audio' ? 'Converting audio' : 'Merging video and audio';
            job.progress = 98;
          }
        });

        let errBuf = '';
        proc.stderr.on('data', (d) => (errBuf += d.toString()));
        proc.on('error', (e) => {
          clearTimeout(timer);
          reject(e);
        });
        proc.on('close', (code) => {
          clearTimeout(timer);
          code === 0 ? resolve() : reject(new Error(errBuf.slice(-300) || 'Download failed'));
        });
      });

      let filepath;
      if (isSubtitle) {
        // Subtitle-only runs don't reliably print an after_move hook — find the file we wrote instead.
        const match = fs.readdirSync(CFG.downloadDir).find((f) => f.startsWith(`${jobId}.`));
        filepath = match ? path.join(CFG.downloadDir, match) : null;
      } else {
        filepath = stdout.trim().split('\n').filter(Boolean).pop();
      }
      if (!filepath || !fs.existsSync(filepath)) {
        throw new Error(isSubtitle ? '__NO_SUBS__' : 'The processed file could not be found.');
      }

      job.file = filepath;
      job.name = path.basename(filepath);
      job.progress = 100;
      job.stage = 'Ready';
      job.status = 'done';
    } catch (e) {
      console.error('[download raw error]:', e.message);
      job.status = 'error';
      job.stage = 'Failed';
      job.error = e.message === '__NO_SUBS__'
        ? "Subtitles in this language aren't actually available for this video. Try a different language."
        : friendlyError(e.message);
    }
  });

  return jobId;
}

function friendlyError(raw = '') {
  const s = raw.toLowerCase();
  if (s.includes('private') || s.includes('login') || s.includes('cookies'))
    return 'This content is private or needs a login, so it cannot be fetched.';
  if (s.includes('unsupported url') || s.includes('no video'))
    return 'That link is not supported. Try a direct link to a single video or post.';
  if (s.includes('unavailable') || s.includes('removed'))
    return 'This video is unavailable or has been removed.';
  if (s.includes('timeout') || s.includes('too long'))
    return 'This took too long to process. Try a shorter video or a lower quality.';
  if (s.includes('geo') || s.includes('country'))
    return 'This video is blocked in the server region.';
  if (s.includes('429') || s.includes('too many requests'))
    return "YouTube is rate-limiting requests right now. Wait a minute and try again.";
  if (s.includes('subtitle') || s.includes('caption'))
    return "That subtitle language isn't available for this video right now. Try a different language.";
  return 'Something went wrong while processing this link. Try again or pick a different quality.';
}

/* ------------------------------------------------------------------ routes */
app.get('/health', (req, res) =>
  res.json({ ok: true, active, queued: pending.length, jobs: jobs.size, uptime: process.uptime() })
);

app.post('/api/formats', limit(Number(process.env.FORMATS_RATE_LIMIT || 40)), async (req, res) => {
  const url = (req.body?.url || '').trim();
  if (!isValidUrl(url)) return res.status(400).json({ error: 'Enter a full link starting with http or https.' });

  const cached = cacheGet(url);
  if (cached) return res.json({ ...cached, cached: true });

  try {
    const raw = await run(CFG.ytdlp, ['-J', '--no-playlist', '--no-warnings', url, ...cookieArgs()], {
      timeoutMs: 45000,
    });
    const info = JSON.parse(raw);

    const payload = {
      title: info.title || 'Untitled',
      thumbnail: info.thumbnail || null,
      duration: info.duration || null,
      uploader: info.uploader || info.channel || null,
      source: info.extractor_key || null,
      resolution: nativeResolution(info),
      description: info.description || null,
      tags: Array.isArray(info.tags) ? info.tags.slice(0, 40) : [],
      viewCount: info.view_count || null,
      uploadDate: formatUploadDate(info.upload_date),
      chapters: Array.isArray(info.chapters)
        ? info.chapters.map((c) => ({ title: c.title || 'Untitled', start: c.start_time || 0 }))
        : [],
      subtitleOptions: buildSubtitleOptions(info),
      thumbnailOptions: buildThumbnailOptions(info),
      options: await buildOptions(info),
    };

    cacheSet(url, payload);
    res.json(payload);
  } catch (e) {
    res.status(422).json({ error: friendlyError(e.message) });
  }
});

/** Preset selectors for playlist/batch entries — downloading those without
 * this would mean a full /api/formats call per video, which is exactly the
 * kind of extra latency every other batch this project has avoided. */
const DOWNLOAD_PRESETS = {
  best_video: { kind: 'video', selector: 'bv*+ba/b', ext: 'mp4' },
  best_audio_mp3: { kind: 'audio', selector: 'bestaudio/best', ext: 'mp3' },
};

app.post('/api/playlist', limit(Number(process.env.FORMATS_RATE_LIMIT || 40)), async (req, res) => {
  const url = (req.body?.url || '').trim();
  if (!isValidUrl(url)) return res.status(400).json({ error: 'Enter a full link starting with http or https.' });

  const cacheKey = `playlist:${url}`;
  const cached = cacheGet(cacheKey);
  if (cached) return res.json({ ...cached, cached: true });

  try {
    const raw = await run(CFG.ytdlp, ['-J', '--flat-playlist', '--no-warnings', url, ...cookieArgs()], {
      timeoutMs: 60000,
    });
    const info = JSON.parse(raw);
    if (info._type !== 'playlist' || !Array.isArray(info.entries)) {
      return res.status(400).json({ error: 'That link is not a playlist or channel.' });
    }

    const entries = info.entries.slice(0, 100).map((e) => ({
      id: e.id,
      url: e.url || `https://www.youtube.com/watch?v=${e.id}`,
      title: e.title || 'Untitled',
      thumbnail: Array.isArray(e.thumbnails) ? e.thumbnails.at(-1)?.url || null : null,
      duration: e.duration || null,
    }));

    const payload = { title: info.title || 'Playlist', entries };
    cacheSet(cacheKey, payload);
    res.json(payload);
  } catch (e) {
    res.status(422).json({ error: friendlyError(e.message) });
  }
});

app.post('/api/download', limit(Number(process.env.DOWNLOAD_RATE_LIMIT || 12)), async (req, res) => {
  const url = (req.body?.url || '').trim();
  const optionId = req.body?.optionId;
  const preset = req.body?.preset;
  if (!isValidUrl(url)) return res.status(400).json({ error: 'Enter a full link starting with http or https.' });

  // Playlist/batch entries download via a preset instead of a real optionId
  // looked up from a cached /api/formats response.
  if (!optionId && preset) {
    const presetOption = DOWNLOAD_PRESETS[preset];
    if (!presetOption) return res.status(400).json({ error: 'Unknown quality preset.' });
    if (pending.length > 25) return res.status(503).json({ error: 'The server is busy. Try again in a minute.' });
    const jobId = startJob(url, presetOption, null);
    return res.json({ jobId });
  }

  if (!optionId) return res.status(400).json({ error: 'Choose a quality first.' });
  if (pending.length > 25) return res.status(503).json({ error: 'The server is busy. Try again in a minute.' });

  // Optional trim range — only meaningful for video/audio, validated below
  // once we know the option's kind.
  let trim = null;
  const { trimStart, trimEnd } = req.body || {};
  if (trimStart != null || trimEnd != null) {
    const start = Number(trimStart);
    const end = Number(trimEnd);
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) {
      return res.status(400).json({ error: 'Invalid trim range.' });
    }
    trim = { start, end };
  }

  const findOption = (payload, id) =>
    payload?.options?.find((o) => o.id === id) || payload?.subtitleOptions?.find((o) => o.id === id);

  const cached = cacheGet(url);
  let option = findOption(cached, optionId);

  // Rebuild the selector if the cache expired between the two calls
  if (!option) {
    try {
      const raw = await run(CFG.ytdlp, ['-J', '--no-playlist', '--no-warnings', url, ...cookieArgs()]);
      const info = JSON.parse(raw);
      const payload = {
        title: info.title,
        thumbnail: info.thumbnail,
        duration: info.duration,
        uploader: info.uploader,
        options: await buildOptions(info),
        subtitleOptions: buildSubtitleOptions(info),
      };
      cacheSet(url, payload);
      option = findOption(payload, optionId);
    } catch (e) {
      return res.status(422).json({ error: friendlyError(e.message) });
    }
  }

  if (!option) return res.status(400).json({ error: 'That quality is no longer available. Fetch the link again.' });

  // Trimming a subtitle file or a single thumbnail image doesn't mean
  // anything — only apply it to video/audio.
  const applyTrim = trim && (option.kind === 'video' || option.kind === 'audio') ? trim : null;

  const jobId = startJob(url, option, applyTrim);
  res.json({ jobId });
});

/** Fetches one caption track's direct CDN URL and returns the cleaned
 * {text, segments} plus the raw {vtt} (the actual subtitle file content,
 * for the Subtitles tab's download). Retries once on a transient network
 * error (not a real 404/etc — no point retrying that). Throws '__NO_SUBS__'
 * when the URL responds but the content is empty after cleaning — the
 * signal that this specific auto-translate language doesn't really exist
 * for this video even though YouTube listed it as a target. */
async function fetchCaption(captionUrl) {
  let upstream;
  try {
    upstream = await fetch(captionUrl);
    if (!upstream.ok) throw new Error(`upstream ${upstream.status}`);
  } catch (firstErr) {
    if (firstErr.message.startsWith('upstream')) throw firstErr;
    await new Promise((r) => setTimeout(r, 700));
    upstream = await fetch(captionUrl);
    if (!upstream.ok) throw new Error(`upstream ${upstream.status}`);
  }
  const vtt = await upstream.text();
  const { text, segments } = vttToSegments(vtt);
  if (!text) throw new Error('__NO_SUBS__');
  return { vtt, text, segments };
}

/** Looks up (or rebuilds, if the /api/formats cache expired) this video's
 * subtitle options — shared by /api/transcript and /api/caption-langs so
 * neither has to duplicate the "no cache, re-run yt-dlp" fallback. */
async function getSubtitleOptions(url) {
  const cached = cacheGet(url)?.subtitleOptions;
  if (cached) return cached;
  const raw = await run(CFG.ytdlp, ['-J', '--no-playlist', '--no-warnings', url, ...cookieArgs()], { timeoutMs: 45000 });
  return buildSubtitleOptions(JSON.parse(raw));
}

app.post('/api/transcript', limit(Number(process.env.FORMATS_RATE_LIMIT || 40)), async (req, res) => {
  const url = (req.body?.url || '').trim();
  const optionId = (req.body?.optionId || '').trim();
  if (!isValidUrl(url)) return res.status(400).json({ error: 'Enter a full link starting with http or https.' });
  if (!optionId) return res.status(400).json({ error: 'Choose a language first.' });

  const cacheKey = `transcript:${url}:${optionId}`;
  const cached = cacheGet(cacheKey);
  if (cached) return res.json({ ...cached, cached: true });

  // The subtitle track's direct CDN URL is already sitting in the cached
  // /api/formats response for this video (buildSubtitleOptions puts it
  // there) — reuse it instead of spawning a second yt-dlp process. This is
  // the actual fix for transcript fetches getting rate-limited far more
  // than a plain download: running yt-dlp again re-triggers its full
  // extraction step, which is what YouTube's throttling targets, whereas
  // this is just one HTTP GET — confirmed locally by fetching the URL
  // directly with no yt-dlp involved and getting the same captions back.
  let subtitleOptions;
  try {
    subtitleOptions = await getSubtitleOptions(url);
  } catch (e) {
    return res.status(422).json({ error: friendlyError(e.message) });
  }

  const option = subtitleOptions.find((o) => o.id === optionId);
  if (!option || !option.url) {
    return res.status(422).json({ error: "Subtitles in this language aren't actually available for this video. Try a different language." });
  }

  try {
    const payload = await fetchCaption(option.url);
    cacheSet(cacheKey, payload);
    res.json(payload);
  } catch (e) {
    console.error('[transcript fetch error]:', e.message);
    const message = e.message === '__NO_SUBS__' || e.message.startsWith('upstream')
      ? "This auto-translated language isn't actually available for this video. Try a different language."
      : 'Could not reach the server. Try again.';
    res.status(422).json({ error: message });
  }
});

/** Which of this video's subtitle languages actually have real, fetchable
 * captions — not just ones YouTube listed as auto-translate targets. Manual
 * (creator-uploaded) tracks are always genuine, so they're returned as-is.
 * Auto-translate targets are checked in parallel (cheap: they're the same
 * single-GET fetchCaption() used to display one), and any that come back
 * good get cached under the same key /api/transcript checks — so picking
 * a language the user already sees listed here is instant, not a second
 * fetch. This is what keeps a video's language dropdown free of entries
 * that would otherwise error out when clicked, per the actual limitation
 * behind that: some of YouTube's 100+ advertised auto-translate targets
 * don't reliably produce real captions when fetched. */
app.post('/api/caption-langs', limit(Number(process.env.FORMATS_RATE_LIMIT || 40)), async (req, res) => {
  const url = (req.body?.url || '').trim();
  if (!isValidUrl(url)) return res.status(400).json({ error: 'Enter a full link starting with http or https.' });

  const cacheKey = `caption-langs:${url}`;
  const cached = cacheGet(cacheKey);
  if (cached) return res.json({ ...cached, cached: true });

  let subtitleOptions;
  try {
    subtitleOptions = await getSubtitleOptions(url);
  } catch (e) {
    return res.status(422).json({ error: friendlyError(e.message) });
  }

  const manual = subtitleOptions.filter((o) => !o.auto && o.url);
  // Already priority-sorted (buildSubtitleOptions) — capping the checked
  // pool to the most-likely-useful dozen keeps this fast; checking all 20
  // in parallel measured ~11s locally (bounded by the slowest one to fail),
  // 12 keeps the wait shorter without dropping languages people actually pick.
  const autoCandidates = subtitleOptions.filter((o) => o.auto && o.url).slice(0, 12);

  const checked = await Promise.all(
    autoCandidates.map(async (o) => {
      try {
        const payload = await fetchCaption(o.url);
        cacheSet(`transcript:${url}:${o.id}`, payload); // pre-warm — picking it next is instant
        return o;
      } catch {
        return null;
      }
    })
  );

  const options = [...manual, ...checked.filter(Boolean)];
  const payload = { options };
  cacheSet(cacheKey, payload);
  res.json(payload);
});

app.get('/api/thumbnail', limit(Number(process.env.FORMATS_RATE_LIMIT || 40)), async (req, res) => {
  const src = (req.query.url || '').toString();
  const name = (req.query.name || 'thumbnail').toString().replace(/[^\w-]+/g, '-').slice(0, 80);
  if (!isValidUrl(src)) return res.status(400).json({ error: 'Invalid thumbnail URL.' });

  try {
    const upstream = await fetch(src);
    if (!upstream.ok) throw new Error(`upstream ${upstream.status}`);
    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
    res.set('Content-Type', contentType);
    res.set('Content-Disposition', `attachment; filename="${name}-thumbnail-clip-converters.com.${ext}"`);
    const buf = Buffer.from(await upstream.arrayBuffer());
    res.send(buf);
  } catch {
    res.status(502).json({ error: 'Could not fetch the thumbnail. Try again.' });
  }
});

app.get('/api/status/:jobId', (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) return res.status(404).json({ error: 'This download has expired. Start it again.' });
  res.json({
    status: job.status,
    progress: Math.round(job.progress),
    stage: job.stage,
    name: job.name || null,
    error: job.error || null,
    queuePosition: job.status === 'queued' ? pending.length : 0,
  });
});

app.get('/api/file/:jobId', (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job || job.status !== 'done' || !job.file || !fs.existsSync(job.file)) {
    return res.status(404).json({ error: 'This file has expired. Start the download again.' });
  }
  // A friendly, branded filename comes from the client (?name=...); fall
  // back to the internal jobId-based name if it's missing or looks unsafe.
  const requested = (req.query.name || '').toString();
  const downloadName = /^[\w.\- ]{1,150}$/.test(requested) ? requested : job.name;
  res.download(job.file, downloadName, (err) => {
    if (err) console.error('[file] send error:', err.message);
  });
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

/* ----------------------------------------------------------------- cleanup */
setInterval(() => {
  const cutoff = Date.now() - CFG.fileTtlMin * 60 * 1000;

  for (const [id, job] of jobs) {
    if (job.createdAt < cutoff) {
      if (job.file && fs.existsSync(job.file)) fs.unlink(job.file, () => {});
      jobs.delete(id);
    }
  }

  fs.readdir(CFG.downloadDir, (err, files) => {
    if (err) return;
    files.forEach((f) => {
      const p = path.join(CFG.downloadDir, f);
      fs.stat(p, (e, st) => {
        if (!e && st.mtimeMs < cutoff) fs.unlink(p, () => {});
      });
    });
  });
}, CFG.cleanupEveryMin * 60 * 1000);

app.listen(CFG.port, () => {
  console.log(`API listening on :${CFG.port}`);
  console.log(`Storage: ${CFG.downloadDir} | Concurrency: ${CFG.maxJobs} | TTL: ${CFG.fileTtlMin}m`);
});
