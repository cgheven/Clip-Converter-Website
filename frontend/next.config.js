/** @type {import('next').NextConfig} */

// PostHog ingestion, proxied through our own domain. A large share of this
// site's visitors run an ad blocker, and every blocker list carries
// *.posthog.com — without this rewrite the analytics would silently
// under-count exactly the users who matter most (the ones AdSense can't
// monetise either). NEXT_PUBLIC_POSTHOG_HOST must stay "/ingest" for this
// to be used; set it to the direct host to bypass the proxy.
const PH_ASSETS = process.env.POSTHOG_ASSET_HOST || 'https://us-assets.i.posthog.com';
const PH_INGEST = process.env.POSTHOG_INGEST_HOST || 'https://us.i.posthog.com';

module.exports = {
  // Lets a verification build run beside a live `next dev` without sharing .next
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Needed so the proxied ingest requests keep their original Host handling.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      { source: '/ingest/static/:path*', destination: `${PH_ASSETS}/static/:path*` },
      { source: '/ingest/:path*', destination: `${PH_INGEST}/:path*` },
      { source: '/ingest/decide', destination: `${PH_INGEST}/decide` },
    ];
  },
};
