import { useEffect, useState } from 'react';
import PlayBadge from './PlayBadge';

/** Shows a one-time prompt to download the Android app. If the visitor closes
 * it, it stays hidden for 3 days. Storage is per browser and may be blocked,
 * so every read and write is wrapped and the popup still works without it. */
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
    // Storage unavailable (private mode, blocked): popup may show again later.
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
    <div className="app-popup" role="dialog" aria-modal="false" aria-labelledby="app-popup-title">
      <button type="button" className="app-popup-x" onClick={close} aria-label="Close">
        ×
      </button>
      <div className="app-popup-body">
        <h2 id="app-popup-title">Get Clip Converter for Android</h2>
        <p>Save videos, audio and transcripts straight to your phone. Free to start.</p>
        <PlayBadge />
        <button type="button" className="app-popup-later" onClick={close}>
          Not now
        </button>
      </div>
    </div>
  );
}
