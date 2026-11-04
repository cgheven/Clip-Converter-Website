// Ads are served only on the real production domain(s). Other hosts (Vercel
// preview/deployment URLs, localhost) are not approved in AdSense, so ads are
// neither loaded nor rendered there.
const ADS_HOSTS = ['clip-converters.com', 'www.clip-converters.com'];

export function isAdsHost() {
  if (typeof window === 'undefined') return false;
  return ADS_HOSTS.includes(window.location.hostname);
}
