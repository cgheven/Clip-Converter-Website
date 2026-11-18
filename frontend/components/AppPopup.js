import { useEffect, useState } from 'react';
import PlayBadge from './PlayBadge';

/** Compact app prompt for all visitors. One message, one action (the official
 * Google Play badge). Shown after a short delay. "Not now", the × button,
 * tapping outside or Escape hides it for 3 days. Storage can be blocked, so
 * every read and write is wrapped and the popup still works without it. */
const STORAGE_KEY = 'cc_app_popup_dismissed_at';
const HIDE_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
const SHOW_DELAY_MS = 4000;

function wasRecentlyDismissed() {
  try {
    const at = Number(window.localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(at) && at > 0 && Date.now() - at < HIDE_MS;
  } catch {
    return false;
  }
}

function rememberDismissal() {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // Storage unavailable: the popup may show again on a later visit.
  }
}

export default function AppPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (wasRecentlyDismissed()) return undefined;
    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    rememberDismissal();
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="app-sheet-backdrop" onClick={close}>
      <div
        className="app-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-sheet-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="app-sheet-x" onClick={close} aria-label="Close">
          ×
        </button>
        <h2 id="app-sheet-title">Clip Converter for Android</h2>
        <p>Save videos and audio to your phone.</p>
        <div className="app-sheet-badge" onClick={rememberDismissal}>
          <PlayBadge />
        </div>
        <button type="button" className="app-sheet-later" onClick={close}>
          Not now
        </button>
      </div>
    </div>
  );
}
