import { TOOL_PAGES } from '../data/tool-pages';

const SITE = 'https://clip-converters.com';

const STATIC = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/supported-sites', changefreq: 'weekly', priority: '0.8' },
  { path: '/how-it-works', changefreq: 'monthly', priority: '0.6' },
  { path: '/faq', changefreq: 'monthly', priority: '0.6' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
];

/** Generated rather than a static file so a tool page added to
 * data/tool-pages.js is in the sitemap without anyone remembering to. */
export async function getServerSideProps({ res }) {
  const urls = [
    ...STATIC,
    ...TOOL_PAGES.map((p) => ({ path: `/${p.slug}`, changefreq: 'weekly', priority: '0.9' })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `  <url><loc>${SITE}${u.path}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`)
  .join('\n')}
</urlset>`;
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(xml);
  res.end();
  return { props: {} };
}

export default function Sitemap() {
  return null;
}
