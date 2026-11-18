/** Official "Get it on Google Play" badge linking to the Android app.
 * Google's brand rules: use the official badge unchanged, at a legible size,
 * and only to link to content on Google Play. The link is the plain store URL
 * (no campaign parameters). */
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.clipconverters.app';

export default function PlayBadge({ className = '' }) {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`play-badge ${className}`}
      aria-label="Get Clip Converter on Google Play"
    >
      <img
        src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
        alt="Get it on Google Play"
        width="180"
        height="53"
        loading="lazy"
      />
    </a>
  );
}
