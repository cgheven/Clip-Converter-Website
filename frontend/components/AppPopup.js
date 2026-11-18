import { useEffect, useState } from 'react';
import PlayBadge from './PlayBadge';

/** App promotion modal shown to all visitors after a short delay.
 * Desktop shows the approved design image, with transparent click areas over
 * the close button, the Google Play badge and "Not now". Mobile shows the phone
 * artwork with live text, because the full image is too small to read on a phone.
 * "Not now", ×, a click outside or Escape hides it for 3 days. Storage can be
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
        <h2 id="ap-title" className="ap-sr-only">Clip Converter for Android</h2>

        {/* Desktop and tablet: approved design image with click areas on top */}
        <div className="ap-art">
          <img
            src="/app-promo/card.png"
            alt="Clip Converter for Android. Save videos and audio to your phone."
            width="747"
            height="522"
            draggable="false"
          />
          <button type="button" className="ap-hot ap-hot-close" onClick={close} aria-label="Close" />
          <div className="ap-hot ap-hot-badge" onClick={rememberDismissal}>
            <PlayBadge />
          </div>
          <button type="button" className="ap-hot ap-hot-later" onClick={close} aria-label="Not now" />
        </div>

        {/* Mobile: phone artwork and live text */}
        <div className="ap-mobile">
          <button type="button" className="ap-close" onClick={close} aria-label="Close">
            ×
          </button>
          <img className="ap-phone-img" src="/app-promo/phone.png" alt="" aria-hidden="true" width="300" height="470" />
          <p className="ap-m-title">
            Clip Converter <span>for Android</span>
          </p>
          <p className="ap-m-sub">Save videos and audio to your phone.</p>
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
