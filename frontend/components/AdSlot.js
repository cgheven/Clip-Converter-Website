import { useEffect, useRef } from 'react';

/** One manually-placed AdSense unit. Renders nothing if no slot id is given
 * yet, so this is safe to drop into a layout before the real ad unit exists
 * in the AdSense dashboard. Keep placements to a few fixed, predictable
 * spots (never inside/near functional UI like the URL field or download
 * buttons) — that's what Auto Ads got wrong by injecting anywhere on the
 * page, including on top of the search bar. */
export default function AdSlot({ slot, format = 'auto', className = '' }) {
  const ref = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // adsbygoogle.js not loaded yet (e.g. ad blocker) — leave the empty slot
    }
  }, [slot]);

  if (!slot) return null;

  return (
    <div className={`ad-slot ${className}`} ref={ref}>
      <span className="ad-slot-label">Advertisement</span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3534006675523302"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
