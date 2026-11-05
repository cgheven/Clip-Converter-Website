/** Android-app identification (BUILD_BRIEF.md, "Day 2 follow-up" §2).
 *
 * The app signs every API request with a secret baked into the build:
 *   X-Clip-Install: <random per-install id, 8-64 chars [A-Za-z0-9-]>
 *   X-Clip-Ts:      <unix seconds>
 *   X-Clip-Sig:     hex(HMAC-SHA256(secret, `${ts}\n${METHOD}\n${path}\n${installId}`))
 * `path` is the request path without the query string.
 *
 * A signature (not the raw key) goes over the wire, so a captured request is
 * only replayable for MAX_SKEW_SEC. Accepted v1 limitation: the secret itself
 * can be pulled out of the APK, and anyone holding it can mint valid headers.
 * That only buys app-traffic rate headroom, and app traffic is *more*
 * restricted than web traffic (no YouTube), so it's not worth protecting harder.
 *
 * One mechanism, two uses:
 *  1. Rate limits: app traffic is counted per install, with a per-IP ceiling,
 *     in buckets separate from the web's per-IP limits. Users sharing a
 *     carrier NAT IP no longer drain each other's allowance, and direct
 *     (unsigned) API callers keep exactly the old limits.
 *  2. YouTube: refused for app traffic (see isYouTubeUrl / isYouTubeExtractor).
 */
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

const MAX_SKEW_SEC = 300;
const INSTALL_ID_RE = /^[A-Za-z0-9-]{8,64}$/;

function parseKeys(raw) {
  return (raw || '').split(',').map((s) => s.trim()).filter(Boolean);
}

function sign(secret, { ts, method, path, installId }) {
  return crypto.createHmac('sha256', secret).update(`${ts}\n${method.toUpperCase()}\n${path}\n${installId}`).digest('hex');
}

function safeEqualHex(a, b) {
  const ab = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

/** Returns { ok: true } | { ok: false, reason } for a request carrying app headers. */
function verify(keys, { ts, sig, method, path, installId }, nowSec = Math.floor(Date.now() / 1000)) {
  if (!INSTALL_ID_RE.test(installId || '')) return { ok: false, reason: 'bad_install_id' };
  const tsNum = Number(ts);
  if (!Number.isInteger(tsNum)) return { ok: false, reason: 'bad_signature' };
  if (Math.abs(nowSec - tsNum) > MAX_SKEW_SEC) return { ok: false, reason: 'clock_skew' };
  if (!/^[0-9a-f]{64}$/.test(sig || '')) return { ok: false, reason: 'bad_signature' };
  const match = keys.some((k) => safeEqualHex(sign(k, { ts: String(tsNum), method, path, installId }), sig));
  return match ? { ok: true } : { ok: false, reason: 'bad_signature' };
}

/** Express middleware: sets req.isApp / req.installId.
 *  - No app headers → web traffic, untouched.
 *  - App headers that don't verify → 401. Never silently downgraded to web
 *    traffic, or a broken signer would quietly lose the YouTube block.
 *  - APP_API_KEYS unset → app identification is off; everything is web traffic. */
function identifyApp(keys) {
  if (!keys.length) {
    console.warn('[appAuth] APP_API_KEYS not set — Android app traffic is treated as web traffic (no YouTube block, no separate rate limits).');
  }
  return (req, res, next) => {
    req.isApp = false;
    const sig = req.get('X-Clip-Sig');
    const ts = req.get('X-Clip-Ts');
    const installId = req.get('X-Clip-Install');
    if (!keys.length || (!sig && !ts && !installId)) return next();

    const result = verify(keys, { ts, sig, method: req.method, path: req.path, installId });
    if (!result.ok) {
      // The app uses X-Clip-Server-Time to correct a wrong device clock and retry once.
      res.set('X-Clip-Server-Time', String(Math.floor(Date.now() / 1000)));
      res.set('X-Clip-Auth', result.reason);
      return res.status(401).json({ error: 'Could not verify this app. Update the app and try again.', code: result.reason });
    }
    req.isApp = true;
    req.installId = installId;
    next();
  };
}

const WINDOW_MS = 15 * 60 * 1000;
const RATE_MESSAGE = { error: 'Too many requests. Wait a few minutes and try again.' };

function limiter(max, { skip, keyGenerator }) {
  return rateLimit({
    windowMs: WINDOW_MS,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: RATE_MESSAGE,
    skip,
    ...(keyGenerator ? { keyGenerator } : {}),
  });
}

/** Per-route rate limiting. Each call builds fresh stores, preserving the
 * existing behaviour of every route having its own window.
 *  - web:  `webMax` per IP (unchanged from before: 40 lookups / 12 downloads).
 *  - app:  `appInstallMax` per install AND `appIpMax` per IP across all app
 *          installs on that IP. The IP ceiling bounds anyone who rotates
 *          install ids with an extracted key; it's sized for a busy carrier NAT. */
function makeLimiter({ webMax, appInstallMax, appIpMax }) {
  const web = limiter(webMax, { skip: (req) => req.isApp });
  const appInstall = limiter(appInstallMax, { skip: (req) => !req.isApp, keyGenerator: (req) => `install:${req.installId}` });
  const appIp = limiter(appIpMax, { skip: (req) => !req.isApp, keyGenerator: (req) => `appip:${req.ip}` });
  return [web, appIp, appInstall];
}

/* ------------------------------------------------------- YouTube exclusion */
const YOUTUBE_HOSTS = ['youtube.com', 'youtu.be', 'youtube-nocookie.com', 'youtubekids.com', 'googlevideo.com', 'ytimg.com', 'ggpht.com'];

function isYouTubeUrl(str) {
  let host;
  try {
    host = new URL(str).hostname.toLowerCase().replace(/\.$/, '');
  } catch {
    return false;
  }
  return YOUTUBE_HOSTS.some((d) => host === d || host.endsWith(`.${d}`));
}

/** yt-dlp extractor keys: "Youtube", "YoutubeTab", "YoutubeClip", ... — catches a
 * non-YouTube page that merely embeds a YouTube video. */
function isYouTubeExtractor(key) {
  return typeof key === 'string' && /^youtube/i.test(key);
}

const APP_UNSUPPORTED = { error: "This site isn't supported in the app.", code: 'unsupported_site' };

module.exports = {
  MAX_SKEW_SEC,
  parseKeys,
  sign,
  verify,
  identifyApp,
  makeLimiter,
  isYouTubeUrl,
  isYouTubeExtractor,
  APP_UNSUPPORTED,
};
