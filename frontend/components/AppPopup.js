import { useEffect, useState } from 'react';
import PlayBadge from './PlayBadge';
import { PLAY_STORE_URL } from './PlayBadge';

/** App download prompt for all visitors. Mobile: bottom sheet. Desktop: a card
 * in the bottom-right corner. Shown after a short delay. Closing
 * it ("Not now", the × button or Escape) hides it for 3 days. Storage can be
 * blocked, so every read and write is wrapped and the popup still works without it. */
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
        <div className="app-sheet-grip" aria-hidden="true" />
        <button type="button" className="app-sheet-x" onClick={close} aria-label="Close">
          ×
        </button>

        <p className="app-sheet-eyebrow">Free Android app</p>
        <h2 id="app-sheet-title">Get Clip Converter on your phone</h2>
        <ul className="app-sheet-points">
          <li>Save videos, audio and transcripts to your Downloads</li>
          <li>Downloads keep running in the background</li>
          <li>Free: 5 downloads a day, Premium removes the limit and ads</li>
        </ul>

        <a className="app-sheet-cta" href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" onClick={rememberDismissal}>
          Open in Google Play
        </a>
        <div className="app-sheet-badge">
          <PlayBadge />
        </div>
        <button type="button" className="app-sheet-later" onClick={close}>
          Not now
        </button>
      </div>
    </div>
  );
}
