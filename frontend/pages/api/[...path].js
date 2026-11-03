// Server-side proxy. The browser calls /api/* on this site; we forward the
// request to the backend and attach the secret key. The key is read from
// server-only env vars (BACKEND_URL, BACKEND_API_KEY) and never reaches the
// browser bundle.

export const config = {
  api: {
    bodyParser: true,
    // File downloads can be large; don't let Next.js cap or warn on the body.
    responseLimit: false,
  },
};

// Headers that must not be copied from the backend response to ours.
// content-encoding: fetch already decompressed the body, so the header would lie.
const SKIP_RESPONSE_HEADERS = new Set([
  'connection',
  'keep-alive',
  'transfer-encoding',
  'content-length',
  'content-encoding',
]);

export default async function handler(req, res) {
  const base = process.env.BACKEND_URL;
  const key = process.env.BACKEND_API_KEY;
  if (!base || !key) {
    return res.status(500).json({ error: 'Server is not configured' });
  }

  // req.url keeps the path and query string, e.g. /api/formats?x=1
  const target = `${base.replace(/\/+$/, '')}${req.url}`;

  const headers = { 'x-api-key': key };
  if (req.headers['content-type']) headers['content-type'] = req.headers['content-type'];

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  let body;
  if (hasBody && req.body !== undefined && req.body !== null) {
    body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  let upstream;
  try {
    upstream = await fetch(target, { method: req.method, headers, body });
  } catch (err) {
    return res.status(502).json({ error: 'Backend is unreachable right now' });
  }

  res.status(upstream.status);
  upstream.headers.forEach((value, name) => {
    if (!SKIP_RESPONSE_HEADERS.has(name)) res.setHeader(name, value);
  });

  if (!upstream.body) return res.end();

  // Stream the body through instead of buffering the whole file in memory.
  const reader = upstream.body.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
  } finally {
    res.end();
  }
}
