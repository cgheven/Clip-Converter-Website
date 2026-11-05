/* Boots the real server.js against a fake extractor service (EXTRACTOR_SERVICE_URL),
 * so routes, rate limits and the app YouTube block run unmodified. */
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { sign, verify, isYouTubeUrl } = require('../appAuth');

const KEY = 'test-secret-key';
const INSTALL_A = 'install-aaaa-1111';
const INSTALL_B = 'install-bbbb-2222';

const FALLBACK = 'ERROR: [TikTok] 1: Unable to extract webpage video data; please report this issue on  https://github.com/yt-dlp/yt-dlp/issues?q= , filling out the appropriate issue template. Confirm you are on the latest version using yt-dlp -U';

function fakeInfo(key) {
  return {
    extractor_key: key,
    title: `${key} clip`,
    duration: 10,
    thumbnail: 'https://cdn.example.com/t.jpg',
    formats: [{ format_id: 'h264', height: 720, width: 1280, vcodec: 'avc1', acodec: 'mp4a', url: 'https://cdn.example.com/v.mp4', protocol: 'https', filesize: 1000 }],
    thumbnails: [{ url: 'https://cdn.example.com/t.jpg', width: 1280, height: 720 }],
  };
}

function startExtractor() {
  const server = http.createServer((req, res) => {
    // HLS subtitle playlist + segments (TED-style), fetched by /api/transcript.
    if (req.method === 'GET' && req.url.startsWith('/subs/')) {
      const NL = String.fromCharCode(10);
      if (req.url === "/subs/en.m3u8") return res.end(["#EXTM3U", "#EXT-X-TARGETDURATION:30", "#EXTINF:30,", "en.vtt?segment=0", "#EXTINF:30,", "en.vtt?segment=1", "#EXT-X-ENDLIST", ""].join(NL));
      const head = ["WEBVTT", "X-TIMESTAMP-MAP=MPEGTS:900000,LOCAL:00:00:00.000", ""];
      const boundary = ["00:00:29.000 --> 00:00:31.000", "Across the boundary.", ""];
      const seg = req.url.endsWith("segment=0")
        ? [...head, "00:00:01.000 --> 00:00:03.000", "Good morning.", "", ...boundary]
        : [...head, ...boundary, "00:00:40.000 --> 00:00:42.000", "Thank you.", ""];
      return res.end(seg.join(NL));
    }
    let body = '';
    req.on('data', (d) => (body += d));
    req.on('end', () => {
      const { url } = JSON.parse(body || '{}');
      res.setHeader('Content-Type', 'application/json');
      if (url.includes('broken')) return res.writeHead(422).end(JSON.stringify({ error: FALLBACK }));
      if (url.includes('youtube') || url.includes('embeds-yt')) return res.end(JSON.stringify(fakeInfo('Youtube')));
      if (url.includes('hls-subs')) {
        const subUrl = `http://127.0.0.1:${server.address().port}/subs/en.m3u8`;
        return res.end(JSON.stringify({ ...fakeInfo('TedTalk'), subtitles: { en: [{ ext: 'm3u8', url: subUrl }] } }));
      }
      res.end(JSON.stringify(fakeInfo('TikTok')));
    });
  });
  return new Promise((r) => server.listen(0, '127.0.0.1', () => r(server)));
}

function freePort() {
  return new Promise((r) => {
    const s = http.createServer().listen(0, '127.0.0.1', () => {
      const { port } = s.address();
      s.close(() => r(port));
    });
  });
}

let extractor;
let api;
let base;

test.before(async () => {
  extractor = await startExtractor();
  const port = await freePort();
  base = `http://127.0.0.1:${port}`;
  const downloadDir = fs.mkdtempSync(path.join(os.tmpdir(), 'clip-test-'));
  api = spawn(process.execPath, [path.join(__dirname, '..', 'server.js')], {
    cwd: path.join(__dirname, '..'),
    env: {
      ...process.env,
      PORT: String(port),
      APP_API_KEYS: `old-rotated-key,${KEY}`,
      EXTRACTOR_SERVICE_URL: `http://127.0.0.1:${extractor.address().port}`,
      DOWNLOAD_DIR: downloadDir,
      FORMATS_RATE_LIMIT: '3',
      APP_FORMATS_RATE_LIMIT: '3',
      APP_IP_FORMATS_RATE_LIMIT: '5',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  await new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('server did not start')), 10000);
    api.stdout.on('data', (d) => d.toString().includes('API listening') && (clearTimeout(t), resolve()));
    api.on('exit', (c) => reject(new Error(`server exited ${c}`)));
  });
});

test.after(() => {
  api?.kill();
  extractor?.close();
});

function appHeaders(method, p, installId = INSTALL_A, ts = Math.floor(Date.now() / 1000)) {
  return {
    'X-Clip-Install': installId,
    'X-Clip-Ts': String(ts),
    'X-Clip-Sig': sign(KEY, { ts: String(ts), method, path: p, installId }),
  };
}

async function post(p, body, headers = {}) {
  const res = await fetch(base + p, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
  return { status: res.status, headers: res.headers, body: await res.json() };
}

test('verify(): accepts rotated keys, rejects tampering and skew', () => {
  const ts = '1000';
  const sig = sign(KEY, { ts, method: 'POST', path: '/api/formats', installId: INSTALL_A });
  assert.deepEqual(verify(['other', KEY], { ts, sig, method: 'POST', path: '/api/formats', installId: INSTALL_A }, 1000), { ok: true });
  assert.equal(verify([KEY], { ts, sig, method: 'POST', path: '/api/download', installId: INSTALL_A }, 1000).reason, 'bad_signature');
  assert.equal(verify([KEY], { ts, sig, method: 'POST', path: '/api/formats', installId: INSTALL_B }, 1000).reason, 'bad_signature');
  assert.equal(verify([KEY], { ts, sig, method: 'POST', path: '/api/formats', installId: INSTALL_A }, 2000).reason, 'clock_skew');
  assert.equal(verify([KEY], { ts, sig, method: 'POST', path: '/api/formats', installId: 'x' }, 1000).reason, 'bad_install_id');
});

test('isYouTubeUrl covers youtube hosts but not lookalikes', () => {
  for (const u of ['https://youtu.be/x', 'https://m.youtube.com/watch?v=x', 'https://music.youtube.com/x', 'https://i.ytimg.com/vi/x/hq.jpg', 'https://www.youtube-nocookie.com/embed/x'])
    assert.ok(isYouTubeUrl(u), u);
  for (const u of ['https://notyoutube.com/x', 'https://www.tiktok.com/@a/video/1'])
    assert.ok(!isYouTubeUrl(u), u);
});

test('TikTok generic failure is not reported as a YouTube block (website path)', async () => {
  const r = await post('/api/formats', { url: 'https://www.tiktok.com/@a/video/broken' });
  assert.equal(r.status, 422);
  assert.doesNotMatch(r.body.error, /youtube/i);
});

test('app traffic: YouTube URL refused before extraction', async () => {
  const r = await post('/api/formats', { url: 'https://youtu.be/abc' }, appHeaders('POST', '/api/formats'));
  assert.equal(r.status, 400);
  assert.equal(r.body.code, 'unsupported_site');
});

test('app traffic: page that resolves to a YouTube extractor is refused', async () => {
  const r = await post('/api/download', { url: 'https://blog.example.com/embeds-yt', optionId: 'v720' }, appHeaders('POST', '/api/download'));
  assert.equal(r.status, 400);
  assert.equal(r.body.code, 'unsupported_site');
});

test('app traffic: YouTube refused on transcript and thumbnail endpoints too', async () => {
  const t = await post('/api/transcript', { url: 'https://www.youtube.com/watch?v=x', optionId: 'sub-en' }, appHeaders('POST', '/api/transcript'));
  assert.equal(t.status, 400);
  const res = await fetch(`${base}/api/thumbnail?url=${encodeURIComponent('https://i.ytimg.com/vi/x/hq.jpg')}`, { headers: appHeaders('GET', '/api/thumbnail') });
  assert.equal(res.status, 400);
});

test('web traffic: YouTube still served (website unchanged)', async () => {
  const r = await post('/api/caption-langs', { url: 'https://www.youtube.com/watch?v=web' });
  assert.equal(r.status, 200);
});

test('bad signature → 401; stale clock → 401 with server time for correction', async () => {
  const bad = await post('/api/caption-langs', { url: 'https://www.tiktok.com/@a/video/1' }, { ...appHeaders('POST', '/api/caption-langs'), 'X-Clip-Sig': 'f'.repeat(64) });
  assert.equal(bad.status, 401);
  const stale = await post('/api/caption-langs', { url: 'https://www.tiktok.com/@a/video/1' }, appHeaders('POST', '/api/caption-langs', INSTALL_A, 1000));
  assert.equal(stale.status, 401);
  assert.equal(stale.body.code, 'clock_skew');
  assert.ok(Number(stale.headers.get('x-clip-server-time')) > 1000);
});

test('rate limits: app installs get their own buckets, with a per-IP ceiling', async () => {
  const q = (headers) => post('/api/formats/quick', { url: 'https://www.tiktok.com/@a/video/1' }, headers);
  const app = (id) => appHeaders('POST', '/api/formats/quick', id);

  // Web caller on this IP burns its 3.
  for (let i = 0; i < 3; i++) assert.equal((await q()).status, 200);
  assert.equal((await q()).status, 429, 'web limit unchanged');

  // Same IP, app install A: unaffected by the web bucket; own limit of 3.
  for (let i = 0; i < 3; i++) assert.equal((await q(app(INSTALL_A))).status, 200, `A #${i}`);
  assert.equal((await q(app(INSTALL_A))).status, 429, 'per-install limit');

  // Install B behind the same NAT IP is not blocked by A...
  assert.equal((await q(app(INSTALL_B))).status, 200);
  // ...until the per-IP app ceiling (5) is reached: A used 3 (+1 rejected), B 1.
  assert.equal((await q(app('install-cccc-3333'))).status, 429, 'per-IP app ceiling');
});

test('transcript: HLS (.m3u8) subtitle playlists are fetched and merged, not reported as unavailable', async () => {
  const id = 'install-hls-3333';
  const r = await post('/api/transcript', { url: 'https://www.ted.com/talks/hls-subs', optionId: 'sub-en' }, appHeaders('POST', '/api/transcript', id));
  assert.equal(r.status, 200, JSON.stringify(r.body));
  assert.equal(r.body.text.match(/Across the boundary/g).length, 1, 'cue duplicated across segments must appear once');
  assert.match(r.body.text, /Good morning./);
  assert.match(r.body.text, /Thank you./);
  assert.doesNotMatch(r.body.text, /X-TIMESTAMP-MAP|#EXT/);
});

/* ---------------------------------------------- /app/* (APP_AUTH_ARCHITECTURE.md) */
test('/app/*: unsigned requests are refused (fail closed), signed ones served', async () => {
  const id = 'install-app-route-1';
  const unsigned = await post('/app/caption-langs', { url: 'https://www.tiktok.com/@a/video/1' });
  assert.equal(unsigned.status, 401);
  assert.equal(unsigned.body.code, 'missing_signature');
  for (const p of ['/app/status/abc', '/app/file/abc', `/app/thumbnail?url=${encodeURIComponent('https://cdn.example.com/t.jpg')}`]) {
    assert.equal((await fetch(base + p)).status, 401, p);
  }

  const signed = await post('/app/caption-langs', { url: 'https://www.tiktok.com/@a/video/1' }, appHeaders('POST', '/app/caption-langs', id));
  assert.equal(signed.status, 200, JSON.stringify(signed.body));

  // A signature minted for /api/* can't be replayed against /app/* (path is signed).
  const replay = await post('/app/caption-langs', { url: 'https://www.tiktok.com/@a/video/1' }, appHeaders('POST', '/api/caption-langs', id));
  assert.equal(replay.status, 401);
});

test('/app/*: full flow formats → download → status, same in-process queue as /api/*', async () => {
  const id = 'install-app-route-2';
  const f = await post('/app/formats', { url: 'https://www.tiktok.com/@a/video/app-flow' }, appHeaders('POST', '/app/formats', id));
  assert.equal(f.status, 200, JSON.stringify(f.body));
  assert.ok(f.body.options.length > 0);

  const d = await post('/app/download', { url: 'https://www.tiktok.com/@a/video/app-flow', optionId: f.body.options[0].id }, appHeaders('POST', '/app/download', id));
  assert.equal(d.status, 200, JSON.stringify(d.body));
  assert.ok(d.body.jobId);

  const statusPath = `/app/status/${d.body.jobId}`;
  const s = await fetch(base + statusPath, { headers: appHeaders('GET', statusPath, id) });
  assert.equal(s.status, 200);
  assert.ok(['queued', 'running', 'done', 'error'].includes((await s.json()).status));
  // The job lives in the shared queue: the public route sees it too.
  assert.equal((await fetch(`${base}/api/status/${d.body.jobId}`)).status, 200);
});

test('/app/*: YouTube still refused', async () => {
  const r = await post('/app/formats', { url: 'https://youtu.be/abc' }, appHeaders('POST', '/app/formats', 'install-app-route-3'));
  assert.equal(r.status, 400);
  assert.equal(r.body.code, 'unsupported_site');
});
