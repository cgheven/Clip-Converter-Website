/** @type {import('next').NextConfig} */
module.exports = {
  // Lets a verification build run beside a live `next dev` without sharing .next
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
};
