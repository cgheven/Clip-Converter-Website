import { createContext, useContext, useState, useRef, useEffect, useMemo } from 'react';

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

/** "3:05" / "1:03:05" -> seconds. Returns null if it doesn't parse. */
function parseTimeToSeconds(text) {
  const parts = String(text || '').split(':').map((p) => p.trim());
  if (!parts.length || parts.some((p) => p === '' || Number.isNaN(Number(p)))) return null;
  const nums = parts.map(Number);
  if (nums.length === 1) return nums[0];
  if (nums.length === 2) return nums[0] * 60 + nums[1];
  if (nums.length === 3) return nums[0] * 3600 + nums[1] * 60 + nums[2];
  return null;
}

/** seconds -> "3:05" */
function secondsToTimeText(sec) {
  const total = Math.max(0, Math.round(sec));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** First `n` words of a description, with a flag saying whether it was cut. */
function truncateWords(text, n) {
  const words = (text || '').trim().split(/\s+/);
  if (words.length <= n) return { short: text || '', truncated: false };
  return { short: `${words.slice(0, n).join(' ')}…`, truncated: true };
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
function buildFileName(title, ext, opts) {
  const suffix = opts?.trimmed ? '-trim' : '';
  return `${slugify(title)}${suffix}-clip-converters.com.${ext}`;
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

/** Loose check for "this link points at many videos, not one" — a playlist
 * or a channel's videos/streams/shorts feed. Only decides which endpoint to
 * call; a false negative just falls through to the normal single-video flow. */
const PLAYLIST_URL_RE = /[?&]list=|\/playlist(?:[/?]|$)|\/channel\/|\/@[\w.-]+(?:\/(videos|streams|shorts))?\/?$|\/c\/[\w.-]+\/videos/i;

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

/** Hands the file off to Chrome's own download manager — a plain `<a download>`
 * click, not a fetch+blob. This is what makes it behave like a normal site:
 * it shows up immediately in Chrome's downloads with real progress, instead
 * of silently loading in page memory first and "finishing" all at once. The
 * `download` attribute (backed by the server's Content-Disposition header)
 * is what stops this from navigating the tab to the API domain. */
function triggerDownload(jobId, name) {
  const a = document.createElement('a');
  a.href = `${API}/api/file/${jobId}?name=${encodeURIComponent(name || 'download')}`;
  a.download = name || 'download';
  document.body.appendChild(a);
  a.click();
  a.remove();
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

const ExportIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 15V4m0 0L8 8m4-4l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/** The download button used by every row (video/audio/subtitle/thumbnail
 * options, and playlist/batch entries) — one place for the queued/progress/
 * done states instead of duplicating this JSX per list. */
function DownloadButton({ isActive, isQueued, isDone, hasRealProgress, progressPct, queuePosition, onClick }) {
  return (
    <button className={`res-dl-btn ${isDone ? 'res-dl-btn-done' : ''}`} onClick={onClick} disabled={isActive}>
      {isActive && !isQueued && (
        hasRealProgress
          ? <span className="dl-fill-real" style={{ width: `${progressPct}%` }} />
          : <span className="dl-fill" />
      )}
      <span className="dl-label">
        {isQueued ? (
          <><DownloadIcon className="dl-icon-blink" /> Queued{queuePosition ? ` #${queuePosition}` : ''}</>
        ) : isActive ? (
          <><DownloadIcon className="dl-icon-blink" /> {hasRealProgress ? `${Math.round(progressPct)}%` : 'Preparing…'}</>
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
  );
}

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

/* ------------------------------------------------------------------------
 * All Downloader state/logic lives here, shared via context between
 * <DownloaderForm> (search field + platform badges — belongs inside the
 * hero banner) and <DownloaderResult> (notice + result card — rendered as
 * a separate section below). They used to be one component and one chunk
 * of markup; splitting them is what stops the result card's height (which
 * changes a lot switching Video/Audio/Subtitles/Thumbnail tabs) from ever
 * affecting the hero banner's decorative floating icons above it — those
 * icons are positioned by percentage relative to the banner only now.
 * ---------------------------------------------------------------------- */
const DownloaderCtx = createContext(null);

function useDownloaderCtx() {
  const ctx = useContext(DownloaderCtx);
  if (!ctx) throw new Error('Downloader components must be rendered inside <DownloaderProvider>');
  return ctx;
}

export function DownloaderProvider({ children }) {
  const [url, setUrl] = useState('');
  const [fetching, setFetching] = useState(false);
  const [media, setMedia] = useState(null);
  const [tab, setTab] = useState('video'); // 'video' | 'audio' | 'subtitles' | 'thumbnail'
  // Per-option download state, so several rows (across tabs) can be
  // in flight at once for the multi-select batch download — was a single
  // activeId/doneId/job before, which only supported one at a time.
  const [jobsByOption, setJobsByOption] = useState({}); // { [optionId]: { status, progress, queuePosition } }
  const [notice, setNotice] = useState(null); // { type, text }
  const [copiedKey, setCopiedKey] = useState(null); // which copy button just flashed "Copied"
  const [thumbActiveId, setThumbActiveId] = useState(null); // thumbnail option id currently downloading
  const [thumbDoneId, setThumbDoneId] = useState(null); // thumbnail option id that just finished
  const [descOpen, setDescOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set()); // option ids checked for batch download
  const [trimEnabled, setTrimEnabled] = useState(false);
  const [trimStartText, setTrimStartText] = useState('0:00');
  const [trimEndText, setTrimEndText] = useState('0:00');
  const [playlist, setPlaylist] = useState(null); // { title, entries: [{id,url,title,thumbnail,duration}] } | null
  const [multiMode, setMultiMode] = useState(false); // "paste multiple links" textarea instead of the single-line field
  const [playlistPreset, setPlaylistPreset] = useState('best_video'); // quality applied to every playlist/batch entry
  const pollersRef = useRef({}); // { [jobId]: intervalId }
  const resultRef = useRef(null);
  const exportRef = useRef(null);

  useEffect(() => () => Object.values(pollersRef.current).forEach(clearInterval), []);

  useEffect(() => {
    if ((media || playlist) && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [media, playlist]);

  // Default the trim range to the full video whenever a new one loads —
  // trim itself stays off (trimEnabled starts false) until the user opts in.
  useEffect(() => {
    if (media?.duration) {
      setTrimStartText('0:00');
      setTrimEndText(secondsToTimeText(media.duration));
    }
  }, [media]);

  useEffect(() => {
    if (!exportOpen) return;
    function onDocClick(e) {
      if (exportRef.current && !exportRef.current.contains(e.target)) setExportOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [exportOpen]);

  useEffect(() => {
    if (!descOpen) return;
    function onKey(e) {
      if (e.key === 'Escape') setDescOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [descOpen]);

  const videoOptions = useMemo(() => {
    const list = media?.options?.filter((o) => o.kind === 'video') || [];
    return [...list].sort((a, b) => heightOf(b) - heightOf(a));
  }, [media]);
  const audioOptions = useMemo(() => media?.options?.filter((o) => o.kind === 'audio') || [], [media]);
  const subtitleOptions = media?.subtitleOptions || [];
  const thumbnailOptions = media?.thumbnailOptions || [];
  const rows =
    tab === 'video' ? videoOptions :
    tab === 'audio' ? audioOptions :
    tab === 'subtitles' ? subtitleOptions :
    thumbnailOptions;

  function reset() {
    Object.values(pollersRef.current).forEach(clearInterval);
    pollersRef.current = {};
    setMedia(null);
    setPlaylist(null);
    setTab('video');
    setJobsByOption({});
    setNotice(null);
    setSelectedIds(new Set());
    setTrimEnabled(false);
  }

  function updateOptionJob(optionId, patch) {
    setJobsByOption((prev) => ({ ...prev, [optionId]: { ...prev[optionId], ...patch } }));
  }

  function clearOptionJob(optionId) {
    setJobsByOption((prev) => {
      const next = { ...prev };
      delete next[optionId];
      return next;
    });
  }

  const trimStartSec = parseTimeToSeconds(trimStartText);
  const trimEndSec = parseTimeToSeconds(trimEndText);
  const trimValid =
    trimStartSec != null && trimEndSec != null && trimStartSec >= 0 && trimEndSec > trimStartSec &&
    (!media?.duration || trimEndSec <= media.duration + 1);

  async function fetchFormats(e) {
    e?.preventDefault();
    const raw = url.trim();
    if (!raw) return;

    reset();
    setFetching(true);

    try {
      if (multiMode) {
        // Several different links pasted at once — look each one up
        // individually (there's no single "batch" endpoint for unrelated
        // URLs) and only keep the lightweight fields the entries list needs.
        const links = raw.split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 25);
        if (!links.length) return;

        const results = await Promise.all(links.map(async (link) => {
          try {
            const res = await fetch(`${API}/api/formats`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: link }),
            });
            const data = await res.json();
            if (!res.ok) return null;
            return { id: link, url: link, title: data.title, thumbnail: data.thumbnail, duration: data.duration };
          } catch {
            return null;
          }
        }));

        const entries = results.filter(Boolean);
        if (!entries.length) {
          setNotice({ type: 'error', text: "None of those links could be read." });
          return;
        }
        setPlaylist({ title: `${entries.length} link${entries.length === 1 ? '' : 's'}`, entries });
        return;
      }

      if (PLAYLIST_URL_RE.test(raw)) {
        const res = await fetch(`${API}/api/playlist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: raw }),
        });
        const data = await res.json();
        if (!res.ok) {
          setNotice({ type: 'error', text: data.error || 'That playlist could not be read.' });
          return;
        }
        setPlaylist(data);
        return;
      }

      const res = await fetch(`${API}/api/formats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: raw }),
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
    updateOptionJob(option.id, { status: 'queued', progress: 0 });

    const trimForThis = trimEnabled && trimValid && (option.kind === 'video' || option.kind === 'audio');

    try {
      const body = { url: url.trim(), optionId: option.id };
      if (trimForThis) {
        body.trimStart = trimStartSec;
        body.trimEnd = trimEndSec;
      }
      const res = await fetch(`${API}/api/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        updateOptionJob(option.id, { status: 'error' });
        setNotice({ type: 'error', text: data.error || 'The download could not be started.' });
        return;
      }
      pollJob(data.jobId, option, trimForThis);
    } catch {
      updateOptionJob(option.id, { status: 'error' });
      setNotice({ type: 'error', text: 'Could not reach the server. Try again.' });
    }
  }

  function pollJob(jobId, option, trimmed) {
    clearInterval(pollersRef.current[jobId]);
    pollersRef.current[jobId] = setInterval(async () => {
      try {
        const res = await fetch(`${API}/api/status/${jobId}`);
        const data = await res.json();

        if (!res.ok) {
          clearInterval(pollersRef.current[jobId]);
          delete pollersRef.current[jobId];
          updateOptionJob(option.id, { status: 'error' });
          setNotice({ type: 'error', text: data.error || 'This download expired.' });
          return;
        }

        updateOptionJob(option.id, { status: data.status, progress: data.progress, queuePosition: data.queuePosition });

        if (data.status === 'done') {
          clearInterval(pollersRef.current[jobId]);
          delete pollersRef.current[jobId];
          // option.title is set for playlist/batch entries (each has its
          // own source video); single-video options fall back to media.title.
          triggerDownload(jobId, buildFileName(option.title ?? media?.title, option.ext, { trimmed }));
          setTimeout(() => clearOptionJob(option.id), 30000);
        }
        if (data.status === 'error') {
          clearInterval(pollersRef.current[jobId]);
          delete pollersRef.current[jobId];
          updateOptionJob(option.id, { status: 'error' });
          setNotice({ type: 'error', text: data.error || 'Processing failed.' });
        }
      } catch {
        // transient network blip — keep polling
      }
    }, 1200);
  }

  /** Downloads one playlist/batch entry — unlike startDownload(), each entry
   * has its own source URL (not the shared `url` field state), and no
   * cached /api/formats optionId, so it always goes through the preset path. */
  function startEntryDownload(entry) {
    setNotice(null);
    updateOptionJob(entry.id, { status: 'queued', progress: 0 });
    const ext = playlistPreset === 'best_audio_mp3' ? 'mp3' : 'mp4';

    (async () => {
      try {
        const res = await fetch(`${API}/api/download`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: entry.url, preset: playlistPreset }),
        });
        const data = await res.json();

        if (!res.ok) {
          updateOptionJob(entry.id, { status: 'error' });
          setNotice({ type: 'error', text: data.error || 'The download could not be started.' });
          return;
        }
        pollJob(data.jobId, { id: entry.id, ext, title: entry.title }, false);
      } catch {
        updateOptionJob(entry.id, { status: 'error' });
        setNotice({ type: 'error', text: 'Could not reach the server. Try again.' });
      }
    })();
  }

  function toggleSelected(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function clearSelected() {
    setSelectedIds(new Set());
  }

  function downloadSelected() {
    if (playlist) {
      for (const id of selectedIds) {
        const entry = playlist.entries.find((e) => e.id === id);
        if (entry) startEntryDownload(entry);
      }
    } else {
      const allOptions = [...videoOptions, ...audioOptions, ...subtitleOptions, ...thumbnailOptions];
      for (const id of selectedIds) {
        const option = allOptions.find((o) => o.id === id);
        if (!option) continue;
        if (option.kind === 'thumbnail') downloadThumbnailOption(option);
        else startDownload(option);
      }
    }
    setSelectedIds(new Set());
  }

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

  function downloadThumbnailOption(option) {
    if (thumbActiveId) return;
    setNotice(null);
    setThumbDoneId(null);
    setThumbActiveId(option.id);

    const a = document.createElement('a');
    a.href = `${API}/api/thumbnail?url=${encodeURIComponent(option.url)}&name=${encodeURIComponent(slugify(media?.title))}`;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    a.remove();

    setThumbActiveId(null);
    setThumbDoneId(option.id);
    setTimeout(() => setThumbDoneId((id) => (id === option.id ? null : id)), 30000);
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

  const value = {
    url, setUrl, fetching, media, tab, setTab, jobsByOption, notice, copiedKey,
    thumbActiveId, thumbDoneId, descOpen, setDescOpen, exportOpen, setExportOpen,
    resultRef, exportRef, videoOptions, audioOptions, subtitleOptions, thumbnailOptions, rows,
    selectedIds, toggleSelected, clearSelected, downloadSelected,
    trimEnabled, setTrimEnabled, trimStartText, setTrimStartText, trimEndText, setTrimEndText, trimValid,
    playlist, multiMode, setMultiMode, playlistPreset, setPlaylistPreset, startEntryDownload,
    reset, fetchFormats, startDownload, downloadThumbnailOption, exportMetadata, copyField, pasteFromClipboard,
  };

  return <DownloaderCtx.Provider value={value}>{children}</DownloaderCtx.Provider>;
}

/** Search field + platform badges — lives inside the hero banner. */
export function DownloaderForm() {
  const { url, setUrl, fetching, fetchFormats, reset, multiMode, setMultiMode } = useDownloaderCtx();

  return (
    <>
      <form className="grab-form grab-form-clipfy" onSubmit={fetchFormats}>
        {multiMode ? (
          <div className="multi-field">
            <textarea
              rows={4}
              placeholder={'Paste several video links, one per line…'}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-label="Multiple video links"
            />
            <button type="submit" className="btn btn-primary get-clip-btn" disabled={fetching || !url.trim()}>
              {fetching ? <span className="spin" /> : <DownloadIcon />}
              {fetching ? 'Reading' : 'Get Links'}
            </button>
          </div>
        ) : (
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
              placeholder="Paste your video, playlist or channel URL…"
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
        )}
        <button
          type="button"
          className="multi-toggle"
          onClick={() => { setMultiMode((m) => !m); setUrl(''); reset(); }}
        >
          {multiMode ? '← Back to a single link' : 'Paste multiple links instead'}
        </button>
      </form>

      <div id="platforms" className="platforms-row">
        {PLATFORMS.map((p) => (
          <PlatformBadge p={p} key={p.name} />
        ))}
        <span className="platforms-divider" aria-hidden="true" />
        <span className="platforms-more">1000+</span>
      </div>
    </>
  );
}

/** Notice + result card + description modal — rendered as its own section
 * below the hero banner, so its (very variable) height never touches the
 * banner's decorative layer above it. */
export function DownloaderResult() {
  const {
    media, notice, tab, setTab, jobsByOption, copiedKey, thumbActiveId, thumbDoneId,
    descOpen, setDescOpen, exportOpen, setExportOpen, resultRef, exportRef,
    videoOptions, audioOptions, subtitleOptions, thumbnailOptions, rows,
    selectedIds, toggleSelected, clearSelected, downloadSelected,
    trimEnabled, setTrimEnabled, trimStartText, setTrimStartText, trimEndText, setTrimEndText, trimValid,
    playlist, playlistPreset, setPlaylistPreset, startEntryDownload,
    startDownload, downloadThumbnailOption, exportMetadata, copyField,
  } = useDownloaderCtx();

  return (
    <>
      {notice && <div className={`notice ${notice.type}`}>{notice.text}</div>}

      {media && (
        <div className="result" ref={resultRef}>
          <div className="result-body">
            {media.thumbnail && (
              <span className="thumb-card thumb-lg">
                <img src={media.thumbnail} alt="" loading="lazy" />
                <span className="play-overlay" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M9 7l9 5-9 5V7z" /></svg>
                </span>
                {media.duration && <span className="duration-badge">{formatDuration(media.duration)}</span>}
              </span>
            )}

            <div className="result-info">
              <div className="title-row">
                <p className="result-title">{media.title}</p>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => copyField('title', media.title)}
                  aria-label="Copy title"
                  title="Copy title"
                >
                  {copiedKey === 'title' ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
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

              {media.description && (() => {
                const { short, truncated } = truncateWords(media.description, 6);
                return (
                  <p className="desc-snippet">
                    {short}{' '}
                    {truncated && (
                      <button type="button" className="desc-more" onClick={() => setDescOpen(true)}>more</button>
                    )}
                    <button
                      type="button"
                      className="icon-btn icon-btn-inline"
                      onClick={() => copyField('description', media.description)}
                      aria-label="Copy description"
                      title="Copy description"
                    >
                      {copiedKey === 'description' ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </p>
                );
              })()}

              {media.tags?.length > 0 && (
                <div className="copy-row">
                  <button type="button" className="copy-chip" onClick={() => copyField('tags', media.tags.join(', '))}>
                    {copiedKey === 'tags' ? <CheckIcon /> : <CopyIcon />} {copiedKey === 'tags' ? 'Copied' : 'Copy tags'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {media.chapters?.length > 0 && (
            <details className="chapters">
              <summary>Chapters ({media.chapters.length})</summary>
              <p className="chapters-hint">Timestamps the creator marked to jump to different parts of the video.</p>
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

          <div className="fmt-tabs">
            <div className="fmt-tabs-list">
              <button type="button" className={`fmt-tab ${tab === 'video' ? 'on' : ''}`} onClick={() => setTab('video')} disabled={!videoOptions.length}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" /><path d="M10 9l5 3-5 3V9z" fill="currentColor" /></svg>
                Video
              </button>
              <button type="button" className={`fmt-tab ${tab === 'audio' ? 'on' : ''}`} onClick={() => setTab('audio')} disabled={!audioOptions.length}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M9 18V6l10-2v12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.7" /><circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1.7" /></svg>
                Audio
              </button>
              {thumbnailOptions.length > 0 && (
                <button type="button" className={`fmt-tab ${tab === 'thumbnail' ? 'on' : ''}`} onClick={() => setTab('thumbnail')}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.7" /><circle cx="8.5" cy="10" r="1.6" fill="currentColor" /><path d="M4 16l4.5-4.5a1.5 1.5 0 0 1 2.1 0L15 16m2-3l1-1a1.5 1.5 0 0 1 2.1 0L21 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Thumbnail
                </button>
              )}
              {subtitleOptions.length > 0 && (
                <button type="button" className={`fmt-tab ${tab === 'subtitles' ? 'on' : ''}`} onClick={() => setTab('subtitles')}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" /><path d="M7 14h3M13 14h4M7 10h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
                  Subtitles
                </button>
              )}
            </div>

            <div className="export-dropdown" ref={exportRef}>
              <button type="button" className="export-trigger" onClick={() => setExportOpen((o) => !o)}>
                <ExportIcon /> Export
                <svg className={`chev ${exportOpen ? 'chev-open' : ''}`} width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              {exportOpen && (
                <div className="export-menu">
                  <button type="button" onClick={() => { exportMetadata('json'); setExportOpen(false); }}>Export as JSON</button>
                  <button type="button" onClick={() => { exportMetadata('csv'); setExportOpen(false); }}>Export as CSV</button>
                </div>
              )}
            </div>
          </div>

          {(tab === 'video' || tab === 'audio') && (
            <div className="trim-panel">
              <label className="trim-toggle">
                <input type="checkbox" checked={trimEnabled} onChange={(e) => setTrimEnabled(e.target.checked)} />
                Trim this download
              </label>
              {trimEnabled && (
                <div className="trim-fields">
                  <label className="trim-field">
                    Start
                    <input
                      type="text"
                      inputMode="numeric"
                      value={trimStartText}
                      onChange={(e) => setTrimStartText(e.target.value)}
                      placeholder="0:00"
                      className={!trimValid ? 'trim-input-error' : ''}
                    />
                  </label>
                  <span className="trim-sep">–</span>
                  <label className="trim-field">
                    End
                    <input
                      type="text"
                      inputMode="numeric"
                      value={trimEndText}
                      onChange={(e) => setTrimEndText(e.target.value)}
                      placeholder="mm:ss"
                      className={!trimValid ? 'trim-input-error' : ''}
                    />
                  </label>
                  {!trimValid && (
                    <span className="trim-error">
                      Enter a valid range (mm:ss), end after start{media.duration ? `, within ${formatDuration(media.duration)}` : ''}.
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {selectedIds.size > 0 && (
            <div className="batch-bar">
              <span className="batch-count">{selectedIds.size} selected</span>
              <div className="batch-actions">
                <button type="button" className="batch-clear" onClick={clearSelected}>Clear</button>
                <button type="button" className="batch-dl-btn" onClick={downloadSelected}>
                  <DownloadIcon /> Download {selectedIds.size} selected
                </button>
              </div>
            </div>
          )}

          <div className="res-table">
            <div className="res-row-wrap">
              <span className="res-check-spacer" aria-hidden="true" />
              <div className={`res-row res-row-head ${tab === 'subtitles' || tab === 'thumbnail' ? 'res-row-sub' : ''}`}>
                {tab === 'subtitles' ? (
                  <>
                    <div className="res-label">Language</div>
                    <div />
                  </>
                ) : tab === 'thumbnail' ? (
                  <>
                    <div className="res-label">Resolution</div>
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
            </div>
            {rows.map((o) => {
              const isSub = o.kind === 'subtitle';
              const isThumb = o.kind === 'thumbnail';
              const isCompact = isSub || isThumb;
              const jobState = jobsByOption[o.id];
              const isActive = isThumb ? thumbActiveId === o.id : jobState && jobState.status !== 'done' && jobState.status !== 'error';
              const isQueued = isActive && jobState?.status === 'queued';
              const isDone = isThumb ? thumbDoneId === o.id : jobState?.status === 'done';
              // Video/audio jobs report a real % from yt-dlp's own download
              // progress — show an actual filling bar for those. Subtitles
              // (and the instant thumbnail handoff) have no real number to
              // show, so they keep the indeterminate sweep animation.
              const hasRealProgress = isActive && !isQueued && !isSub && !isThumb;
              const progressPct = hasRealProgress ? Math.max(0, Math.min(100, jobState?.progress ?? 0)) : 0;
              return (
                <div className="res-row-wrap" key={o.id}>
                  <input
                    type="checkbox"
                    className="res-check"
                    checked={selectedIds.has(o.id)}
                    onChange={() => toggleSelected(o.id)}
                    aria-label={`Select ${isSub ? langName(o.lang) : o.label}`}
                  />
                  <div className={`res-row ${isCompact ? 'res-row-sub' : ''}`}>
                    {isThumb ? (
                      <div className="res-label res-label-thumb">
                        <img className="res-thumb-mini" src={o.url} alt="" loading="lazy" />
                        <span className="res-text">
                          <span className="res-main">{o.label}</span>
                          <span className="res-sub">{o.note}</span>
                        </span>
                      </div>
                    ) : (
                      <div className="res-label">
                        <span className="res-main">{isSub ? langName(o.lang) : o.label}</span>
                        <span className="res-sub">{o.note}</span>
                      </div>
                    )}
                    {!isCompact && (
                      <>
                        <div className="res-dim">{o.resolution || '—'}</div>
                        <div className="res-fmt">{o.ext.toUpperCase()}</div>
                        <div className="res-size">{o.size || '—'}</div>
                      </>
                    )}
                    <DownloadButton
                      isActive={isActive}
                      isQueued={isQueued}
                      isDone={isDone}
                      hasRealProgress={hasRealProgress}
                      progressPct={progressPct}
                      queuePosition={jobState?.queuePosition}
                      onClick={() => (isThumb ? downloadThumbnailOption(o) : startDownload(o))}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {playlist && (
        <div className="result" ref={resultRef}>
          <div className="playlist-head">
            <p className="result-title">{playlist.title}</p>
            <span className="meta-item">{playlist.entries.length} video{playlist.entries.length === 1 ? '' : 's'}</span>
          </div>

          <div className="trim-panel">
            <label className="preset-label">
              Quality for all downloads
              <select
                className="preset-select"
                value={playlistPreset}
                onChange={(e) => setPlaylistPreset(e.target.value)}
              >
                <option value="best_video">Best Video (MP4)</option>
                <option value="best_audio_mp3">Best Audio (MP3)</option>
              </select>
            </label>
          </div>

          {selectedIds.size > 0 && (
            <div className="batch-bar">
              <span className="batch-count">{selectedIds.size} selected</span>
              <div className="batch-actions">
                <button type="button" className="batch-clear" onClick={clearSelected}>Clear</button>
                <button type="button" className="batch-dl-btn" onClick={downloadSelected}>
                  <DownloadIcon /> Download {selectedIds.size} selected
                </button>
              </div>
            </div>
          )}

          <div className="res-table">
            {playlist.entries.map((entry) => {
              const jobState = jobsByOption[entry.id];
              const isActive = jobState && jobState.status !== 'done' && jobState.status !== 'error';
              const isQueued = isActive && jobState?.status === 'queued';
              const isDone = jobState?.status === 'done';
              const hasRealProgress = isActive && !isQueued;
              const progressPct = hasRealProgress ? Math.max(0, Math.min(100, jobState?.progress ?? 0)) : 0;
              return (
                <div className="res-row-wrap" key={entry.id}>
                  <input
                    type="checkbox"
                    className="res-check"
                    checked={selectedIds.has(entry.id)}
                    onChange={() => toggleSelected(entry.id)}
                    aria-label={`Select ${entry.title}`}
                  />
                  <div className="res-row res-row-sub">
                    <div className="res-label res-label-thumb">
                      {entry.thumbnail && <img className="res-thumb-mini" src={entry.thumbnail} alt="" loading="lazy" />}
                      <span className="res-text">
                        <span className="res-main">{entry.title}</span>
                        {entry.duration != null && <span className="res-sub">{formatDuration(entry.duration)}</span>}
                      </span>
                    </div>
                    <DownloadButton
                      isActive={isActive}
                      isQueued={isQueued}
                      isDone={isDone}
                      hasRealProgress={hasRealProgress}
                      progressPct={progressPct}
                      queuePosition={jobState?.queuePosition}
                      onClick={() => startEntryDownload(entry)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {descOpen && media && (
        <div className="modal-overlay" onClick={() => setDescOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Description</h3>
              <button type="button" className="modal-close" onClick={() => setDescOpen(false)} aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>
            <p className="modal-body">{media.description}</p>
            <button type="button" className="copy-chip" onClick={() => copyField('description', media.description)}>
              {copiedKey === 'description' ? <CheckIcon /> : <CopyIcon />} {copiedKey === 'description' ? 'Copied' : 'Copy description'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
