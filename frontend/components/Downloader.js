import { useState, useRef, useEffect, useMemo } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const PLATFORMS = [
  { name: 'YouTube', bg: '#FF0000', icon: 'yt' },
  { name: 'TikTok', bg: '#000', icon: 'tt' },
  { name: 'Instagram', bg: 'linear-gradient(135deg,#f58529,#dd2a7b,#8134af,#515bd4)', icon: 'ig' },
  { name: 'Facebook', bg: '#1877F2', icon: 'f', round: true },
];

function formatDuration(sec) {
  if (!sec) return null;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}:${String(s).padStart(2, '0')}`;
}

function heightOf(option) {
  const m = /^v(\d+)$/.exec(option.id);
  return m ? Number(m[1]) : 0;
}

/** Short, safe slug from the video title, capped at a handful of words so it
 * never turns into a giant string. */
function slugify(title) {
  const words = (title || 'video')
    .replace(/[\\/:*?"<>|]+/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 5)
    .join(' ');
  return words.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') || 'video';
}

/** Builds a filename from the video title, with the site name at the end. */
function buildFileName(title, ext) {
  return `${slugify(title)}-clip-converters.com.${ext}`;
}

function buildThumbFileName(title, ext) {
  return `${slugify(title)}-thumbnail-clip-converters.com.${ext}`;
}

/** Saves a blob via a hidden link so no navigation ever happens. */
function downloadBlob(blob, name) {
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
}

function csvEscape(v) {
  const s = String(v ?? '');
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(media) {
  const rows = [
    ['Field', 'Value'],
    ['Title', media.title || ''],
    ['Uploader', media.uploader || ''],
    ['Source', media.source || ''],
    ['Duration (seconds)', media.duration || ''],
    ['Resolution', media.resolution || ''],
    ['View Count', media.viewCount || ''],
    ['Upload Date', media.uploadDate || ''],
    ['Description', media.description || ''],
    ['Tags', (media.tags || []).join('; ')],
  ];
  return rows.map((r) => r.map(csvEscape).join(',')).join('\r\n');
}

/** Human-readable language name from a BCP-47-ish code (falls back to the
 * raw code if Intl doesn't recognize it). */
function langName(code) {
  try {
    const base = code.split('-')[0];
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(base) || code;
  } catch {
    return code;
  }
}

/** Fetches the finished file as a blob and saves it via a hidden link, so the
 * browser never navigates away to the (cross-origin) API domain. */
async function triggerDownload(jobId, name) {
  try {
    const res = await fetch(`${API}/api/file/${jobId}`);
    if (!res.ok) throw new Error('download failed');
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = name || 'download';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  } catch {
    // fall back to a direct navigation if the blob fetch fails for any reason
    window.location.href = `${API}/api/file/${jobId}`;
  }
}

const DownloadIcon = ({ className }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 4v11m0 0l4-4m-4 4l-4-4M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M4 10.5l3.5 3.5L16 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

function PlatformBadge({ p }) {
  return (
    <span className="platform-chip">
      <span className={`platform-icon ${p.round ? 'platform-icon-round' : ''}`} style={{ background: p.bg }} aria-hidden="true">
        {p.icon === 'f' && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M15 8.5h2.5V5.2C17 5.1 15.9 5 14.6 5 11.9 5 10 6.7 10 9.7v2.6H7v3.7h3V22h3.8v-6h3.1l.5-3.7h-3.6V10c0-1.1.3-1.5 1.2-1.5z" /></svg>
        )}
        {p.icon === 'ig' && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1" fill="#fff" stroke="none" /></svg>
        )}
        {p.icon === 'tt' && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M16.5 3c.4 2 1.7 3.5 3.9 3.8v2.7c-1.4 0-2.7-.4-3.9-1.2v6.6c0 3.3-2.4 5.6-5.5 5.6-3 0-5.5-2.4-5.5-5.5 0-3 2.5-5.5 5.6-5.5.3 0 .7 0 1 .1v2.8a2.8 2.8 0 1 0 1.9 2.6V3h2.5z" /></svg>
        )}
        {p.icon === 'x' && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M18.9 3H22l-7.4 8.4L23 21h-6.8l-5.3-6.5L4.7 21H1.6l7.9-9L1 3h7l4.8 6 6.1-6z" /></svg>
        )}
        {p.icon === 'p' && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C6.5 2 3 5.7 3 10.1c0 2.6 1.4 4.9 3.6 5.8.1-.4.3-1.4.4-1.8 0 0 .3-1.1.3-1.1s-.4-.8-.4-2c0-1.9 1.1-3.3 2.5-3.3 1.2 0 1.7.9 1.7 1.9 0 1.2-.7 3-1.1 4.6-.3 1.4.7 2.5 2 2.5 2.4 0 4.1-3.1 4.1-6.7 0-2.8-1.9-4.9-5.3-4.9-3.9 0-6.3 2.9-6.3 6.1 0 1.1.4 2.3 1 2.9.1.1.1.2.1.3-.1.3-.2 1.1-.3 1.3 0 .1-.1.2-.3.1-1.2-.5-2-2.4-2-3.9 0-3.2 2.3-6.1 6.7-6.1 3.5 0 6.3 2.5 6.3 5.9 0 3.5-2.2 6.4-5.3 6.4-1 0-2-.5-2.3-1.2 0 0-.5 2-.6 2.4-.2.8-.9 1.9-1.3 2.5.9.3 1.9.4 3 .4 5.5 0 9.9-3.7 9.9-10.1C21 5.7 17.5 2 12 2z" /></svg>
        )}
        {p.icon === 'yt' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M9 6.5v11l10-5.5-10-5.5z" /></svg>
        )}
      </span>
      {p.name}
    </span>
  );
}
export default function Downloader() {
  const [url, setUrl] = useState('');
  const [fetching, setFetching] = useState(false);
  const [media, setMedia] = useState(null);
  const [tab, setTab] = useState('video'); // 'video' | 'audio'
  const [activeId, setActiveId] = useState(null); // option id currently downloading
  const [doneId, setDoneId] = useState(null); // option id that just finished (shown green briefly)
  const [job, setJob] = useState(null); // { status, progress, stage, name }
  const [notice, setNotice] = useState(null); // { type, text }
  const [copiedKey, setCopiedKey] = useState(null); // which copy button just flashed "Copied"
  const [thumbBusy, setThumbBusy] = useState(false);
  const poller = useRef(null);
  const resultRef = useRef(null);

  useEffect(() => () => clearInterval(poller.current), []);

  useEffect(() => {
    if (media && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [media]);

  const videoOptions = useMemo(() => {
    const list = media?.options?.filter((o) => o.kind === 'video') || [];
    return [...list].sort((a, b) => heightOf(b) - heightOf(a));
  }, [media]);
  const audioOptions = useMemo(() => media?.options?.filter((o) => o.kind === 'audio') || [], [media]);
  const subtitleOptions = media?.subtitleOptions || [];
  const rows = tab === 'video' ? videoOptions : tab === 'audio' ? audioOptions : subtitleOptions;

  function reset() {
    clearInterval(poller.current);
    setMedia(null);
    setTab('video');
    setActiveId(null);
    setJob(null);
    setNotice(null);
  }

  async function fetchFormats(e) {
    e?.preventDefault();
    const link = url.trim();
    if (!link) return;

    reset();
    setFetching(true);

    try {
      const res = await fetch(`${API}/api/formats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: link }),
      });
      const data = await res.json();

      if (!res.ok) {
        setNotice({ type: 'error', text: data.error || 'That link could not be read.' });
        return;
      }
      setMedia(data);
      setTab(data.options?.some((o) => o.kind === 'video') ? 'video' : 'audio');
    } catch {
      setNotice({ type: 'error', text: 'Could not reach the server. Check your connection and try again.' });
    } finally {
      setFetching(false);
    }
  }

  async function startDownload(option) {
    setNotice(null);
    setDoneId(null);
    setActiveId(option.id);
    setJob({ status: 'queued', progress: 0, stage: 'Starting' });

    try {
      const res = await fetch(`${API}/api/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), optionId: option.id }),
      });
      const data = await res.json();

      if (!res.ok) {
        setJob(null);
        setActiveId(null);
        setNotice({ type: 'error', text: data.error || 'The download could not be started.' });
        return;
      }
      pollJob(data.jobId, option);
    } catch {
      setJob(null);
      setActiveId(null);
      setNotice({ type: 'error', text: 'Could not reach the server. Try again.' });
    }
  }

  function pollJob(jobId, option) {
    clearInterval(poller.current);
    poller.current = setInterval(async () => {
      try {
        const res = await fetch(`${API}/api/status/${jobId}`);
        const data = await res.json();

        if (!res.ok) {
          clearInterval(poller.current);
          setJob(null);
          setActiveId(null);
          setNotice({ type: 'error', text: data.error || 'This download expired.' });
          return;
        }

        setJob(data);

        if (data.status === 'done') {
          clearInterval(poller.current);
          await triggerDownload(jobId, buildFileName(media?.title, option.ext));
          setActiveId(null);
          setDoneId(option.id);
          setTimeout(() => setDoneId((id) => (id === option.id ? null : id)), 30000);
        }
        if (data.status === 'error') {
          clearInterval(poller.current);
          setJob(null);
          setActiveId(null);
          setNotice({ type: 'error', text: data.error || 'Processing failed.' });
        }
      } catch {
        // transient network blip — keep polling
      }
    }, 1200);
  }

  const busy = job && job.status !== 'done' && job.status !== 'error';

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text.trim());
    } catch {
      // clipboard access denied — user can paste manually
    }
  }

  async function copyField(key, text) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 2000);
    } catch {
      // clipboard access denied — button just won't flash "Copied"
    }
  }

  async function downloadThumbnail() {
    if (!media?.thumbnail || thumbBusy) return;
    setThumbBusy(true);
    try {
      const res = await fetch(`${API}/api/thumbnail?url=${encodeURIComponent(media.thumbnail)}&name=${encodeURIComponent(media.title || 'thumbnail')}`);
      if (!res.ok) throw new Error('thumbnail failed');
      const blob = await res.blob();
      const ext = blob.type.includes('png') ? 'png' : blob.type.includes('webp') ? 'webp' : 'jpg';
      downloadBlob(blob, buildThumbFileName(media.title, ext));
    } catch {
      setNotice({ type: 'error', text: 'Could not download the thumbnail. Try again.' });
    } finally {
      setThumbBusy(false);
    }
  }

  function exportMetadata(format) {
    if (!media) return;
    if (format === 'json') {
      const data = {
        title: media.title,
        description: media.description,
        tags: media.tags,
        uploader: media.uploader,
        source: media.source,
        duration: media.duration,
        resolution: media.resolution,
        viewCount: media.viewCount,
        uploadDate: media.uploadDate,
        chapters: media.chapters,
      };
      downloadBlob(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), buildFileName(media.title, 'json'));
    } else {
      downloadBlob(new Blob([toCsv(media)], { type: 'text/csv' }), buildFileName(media.title, 'csv'));
    }
  }

  return (
    <>
      <form className="grab-form grab-form-clipfy" onSubmit={fetchFormats}>
        <div className="field field-pill field-clipfy">
          <svg className="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9.5 14.5l5-5M8 11l-1.5 1.5a3.5 3.5 0 0 0 5 5L13 16M16 13l1.5-1.5a3.5 3.5 0 0 0-5-5L11 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            type="text"
            inputMode="url"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
            placeholder="Paste your video or media URL here…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-label="Video link"
          />
          {url && (
            <button type="button" className="clear" onClick={() => { setUrl(''); reset(); }} aria-label="Clear link">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          )}
          <button type="submit" className="btn btn-primary inline get-clip-btn" disabled={fetching || !url.trim()}>
            {fetching ? (
              <span className="spin" />
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            )}
            {fetching ? 'Reading' : 'Get Clip'}
          </button>
        </div>
      </form>

      <div id="platforms" className="platforms-row">
        {PLATFORMS.map((p) => (
          <PlatformBadge p={p} key={p.name} />
        ))}
        <span className="platforms-divider" aria-hidden="true" />
        <span className="platforms-more">1000+</span>
      </div>

      {notice && <div className={`notice ${notice.type}`}>{notice.text}</div>}

      {media && (
        <div className="result" ref={resultRef}>
          <div className="result-status">
            <span className="status-check" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M4 10.5l3.5 3.5L16 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="status-sub">Ready to download</p>
          </div>

          <div className="result-body">
            {media.thumbnail && (
              <span className="thumb-card thumb-lg">
                <img src={media.thumbnail} alt="" loading="lazy" />
                <span className="play-overlay" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M9 7l9 5-9 5V7z" /></svg>
                </span>
                {media.duration && <span className="duration-badge">{formatDuration(media.duration)}</span>}
                <button
                  type="button"
                  className="thumb-dl-btn"
                  onClick={downloadThumbnail}
                  disabled={thumbBusy}
                  aria-label="Download HD thumbnail"
                  title="Download HD thumbnail"
                >
                  {thumbBusy ? <span className="spin spin-sm" /> : <DownloadIcon />}
                </button>
              </span>
            )}

            <div className="result-info">
              <p className="result-title">{media.title}</p>
              <div className="meta-row">
                {media.duration && (
                  <span className="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                    {formatDuration(media.duration)}
                  </span>
                )}
                {media.resolution && (
                  <span className="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M8 21h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                    {media.resolution}
                  </span>
                )}
                {media.uploader && (
                  <span className="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" /><path d="M5 20c1.2-3.5 4-5 7-5s5.8 1.5 7 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                    {media.uploader}
                  </span>
                )}
              </div>

              <div className="copy-row">
                <button type="button" className="copy-chip" onClick={() => copyField('title', media.title)}>
                  {copiedKey === 'title' ? <CheckIcon /> : <CopyIcon />} {copiedKey === 'title' ? 'Copied' : 'Copy title'}
                </button>
                {media.description && (
                  <button type="button" className="copy-chip" onClick={() => copyField('description', media.description)}>
                    {copiedKey === 'description' ? <CheckIcon /> : <CopyIcon />} {copiedKey === 'description' ? 'Copied' : 'Copy description'}
                  </button>
                )}
                {media.tags?.length > 0 && (
                  <button type="button" className="copy-chip" onClick={() => copyField('tags', media.tags.join(', '))}>
                    {copiedKey === 'tags' ? <CheckIcon /> : <CopyIcon />} {copiedKey === 'tags' ? 'Copied' : 'Copy tags'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {media.chapters?.length > 0 && (
            <details className="chapters">
              <summary>Chapters ({media.chapters.length})</summary>
              <div className="chapters-list">
                {media.chapters.map((c, i) => (
                  <div className="chapter-row" key={i}>
                    <span className="chapter-time">{formatDuration(c.start)}</span>
                    <span className="chapter-title">{c.title}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="copy-chip"
                onClick={() => copyField('chapters', media.chapters.map((c) => `${formatDuration(c.start)} ${c.title}`).join('\n'))}
              >
                {copiedKey === 'chapters' ? <CheckIcon /> : <CopyIcon />} {copiedKey === 'chapters' ? 'Copied' : 'Copy chapters'}
              </button>
            </details>
          )}

          <div className="export-row">
            <span className="export-label">Export details:</span>
            <button type="button" className="export-chip" onClick={() => exportMetadata('json')}>JSON</button>
            <button type="button" className="export-chip" onClick={() => exportMetadata('csv')}>CSV</button>
          </div>

          <div className="fmt-tabs">
            <button type="button" className={`fmt-tab ${tab === 'video' ? 'on' : ''}`} onClick={() => setTab('video')} disabled={!videoOptions.length}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" /><path d="M10 9l5 3-5 3V9z" fill="currentColor" /></svg>
              Video
            </button>
            <button type="button" className={`fmt-tab ${tab === 'audio' ? 'on' : ''}`} onClick={() => setTab('audio')} disabled={!audioOptions.length}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M9 18V6l10-2v12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.7" /><circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1.7" /></svg>
              Audio
            </button>
            {subtitleOptions.length > 0 && (
              <button type="button" className={`fmt-tab ${tab === 'subtitles' ? 'on' : ''}`} onClick={() => setTab('subtitles')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" /><path d="M7 14h3M13 14h4M7 10h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
                Subtitles
              </button>
            )}
          </div>

          <div className="res-table">
            <div className={`res-row res-row-head ${tab === 'subtitles' ? 'res-row-sub' : ''}`}>
              {tab === 'subtitles' ? (
                <>
                  <div className="res-label">Language</div>
                  <div />
                </>
              ) : (
                <>
                  <div className="res-label">Quality</div>
                  <div className="res-dim">Resolution</div>
                  <div className="res-fmt">Format</div>
                  <div className="res-size">Size</div>
                  <div />
                </>
              )}
            </div>
            {rows.map((o) => {
              const isActive = activeId === o.id && busy;
              const isDone = doneId === o.id;
              const isSub = o.kind === 'subtitle';
              return (
                <div className={`res-row ${isSub ? 'res-row-sub' : ''}`} key={o.id}>
                  <div className="res-label">
                    <span className="res-main">{isSub ? langName(o.lang) : o.label}</span>
                    <span className="res-sub">{o.note}</span>
                  </div>
                  {!isSub && (
                    <>
                      <div className="res-dim">{o.resolution || '—'}</div>
                      <div className="res-fmt">{o.ext.toUpperCase()}</div>
                      <div className="res-size">{o.size || '—'}</div>
                    </>
                  )}
                  <button
                    className={`res-dl-btn ${isDone ? 'res-dl-btn-done' : ''}`}
                    onClick={() => startDownload(o)}
                    disabled={isActive}
                  >
                    {isActive && <span className="dl-fill" />}
                    <span className="dl-label">
                      {isActive ? (
                        <><DownloadIcon className="dl-icon-blink" /> Downloading…</>
                      ) : isDone ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M4 10.5l3.5 3.5L16 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          Downloaded
                        </>
                      ) : (
                        <><DownloadIcon /> Download</>
                      )}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
