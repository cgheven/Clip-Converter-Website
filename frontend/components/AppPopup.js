import { useEffect, useState } from 'react';
import PlayBadge from './PlayBadge';

/** App promotion modal shown to all visitors after a short delay. "Not now",
 * the × button, a click outside, or Escape hides it for 3 days. Storage can be
 * blocked, so every read and write is wrapped and the modal still works without it. */
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
    // Storage unavailable: the modal may show again on a later visit.
  }
}

function PhoneArt() {
  return (
    <div className="ap-phone-wrap" aria-hidden="true">
      <div className="ap-phone">
        <div className="ap-phone-screen">
          <div className="ap-phone-notch" />
          <div className="ap-phone-logo">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="#fff">
              <path d="M8 5.5v13l11-6.5-11-6.5z" />
            </svg>
          </div>
          <div className="ap-phone-name">Clip Converter</div>
          <div className="ap-phone-wave" />
        </div>
      </div>
    </div>
  );
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
    <div className="ap-backdrop" onClick={close}>
      <div
        className="ap-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ap-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="ap-close" onClick={close} aria-label="Close">
          ×
        </button>

        <PhoneArt />

        <div className="ap-content">
          <h2 id="ap-title">
            Clip Converter
            <br />
            for <span>Android</span>
          </h2>
          <p className="ap-sub">Save videos and audio to your phone.</p>

          <ul className="ap-chips">
            <li>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
              </svg>
              <span>Fast &amp; Easy</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span>Safe &amp; Secure</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
              </svg>
              <span>High Quality</span>
            </li>
          </ul>

          <div className="ap-badge" onClick={rememberDismissal}>
            <PlayBadge />
          </div>

          <button type="button" className="ap-later" onClick={close}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
