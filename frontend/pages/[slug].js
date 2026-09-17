import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import AdSlot from '../components/AdSlot';
import { DownloaderProvider, DownloaderForm, DownloaderResult } from '../components/Downloader';
import { TOOL_PAGES, TOOL_BY_SLUG } from '../data/tool-pages';

const SITE = 'https://clip-converters.com';

const ICONS = {
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" />,
  shield: (
    <>
      <path d="M12 2l8 3v6c0 5-3.4 8.9-8 11-4.6-2.1-8-6-8-11V5l8-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8.5 12.2l2.3 2.3 4.7-4.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  device: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M11 18.5h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  quality: (
    <>
      <rect x="3" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 21h8M7.5 13V9m0 2h3m0-2v4M13.5 9v4h1.2a2 2 0 0 0 0-4h-1.2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  play: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 9l5 3-5 3V9z" fill="currentColor" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V6l10-2v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1.8" />
    </>
  ),
  lang: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  file: (
    <>
      <path d="M6 3h8l4 4v14H6V3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12h6M9 16h6M14 3v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="6" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 7.5L20 19M8 16.5L20 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  list: <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8.5" cy="10" r="1.6" fill="currentColor" />
      <path d="M4 17l5-5 4 4 3-3 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
};

const TONES = ['blue', 'green', 'purple', 'pink'];

function Icon({ name }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {ICONS[name] || ICONS.bolt}
    </svg>
  );
}

export default function ToolPage({ slug }) {
  const page = TOOL_BY_SLUG[slug];
  const url = `${SITE}/${page.slug}`;
  const related = page.related.map((s) => TOOL_BY_SLUG[s]).filter(Boolean);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: `${page.h1} — Clip Converter`,
      url,
      description: page.description,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires a modern web browser',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: page.navLabel, item: url },
      ],
    },
  ];

  return (
    <Layout title={page.title} description={page.description}>
      <Head>
        <link rel="canonical" href={url} />
        <meta property="og:url" content={url} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      {/* key: a fresh provider per tool page, so a result from one tool never
          lingers when the visitor follows a "related tool" link to another. */}
      <DownloaderProvider key={page.slug} preferredTab={page.preferredTab} startMulti={!!page.startMulti}>
        <section className="hero hero-clipfy tool-hero">
          <div className="hero-decor" aria-hidden="true">
            <div className="hero-blob hero-blob-a" />
            <div className="hero-blob hero-blob-b" />
          </div>

          <div className="shell shell-narrow hero-content">
            <nav className="tool-crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span>{page.navLabel}</span>
            </nav>
            <h1 className="tool-h1">{page.h1}</h1>
            <p className="tool-lead">{page.lead}</p>
            <DownloaderForm />
          </div>
        </section>

        <div className="shell shell-narrow result-wrap">
          <DownloaderResult />
        </div>
      </DownloaderProvider>

      <div className="shell shell-narrow">
        <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_RESULT} />
      </div>

      <section className="section tool-section">
        <div className="shell">
          <h2 className="tool-h2">How to use the {page.navLabel}</h2>
          <ol className="tool-steps">
            {page.steps.map((s, i) => (
              <li className="tool-step" key={s.title}>
                <span className="tool-step-num">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section tool-section">
        <div className="shell">
          <h2 className="tool-h2">Why use this {page.group === 'platform' ? 'downloader' : 'tool'}</h2>
          <div className="features-grid tool-features">
            {page.features.map((f, i) => (
              <div className="feature-card" key={f.title}>
                <span className={`feature-icon feature-icon-${TONES[i % TONES.length]}`}>
                  <Icon name={f.icon} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section tool-section">
        <div className="shell shell-narrow">
          <h2 className="tool-h2">{page.specs.heading}</h2>
          <dl className="tool-specs">
            {page.specs.rows.map(([k, v]) => (
              <div className="tool-spec-row" key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section tool-section">
        <div className="shell shell-narrow">
          <h2 className="tool-h2">Frequently asked questions</h2>
          <div className="tool-faq">
            {page.faqs.map((f, i) => (
              <details className="tool-faq-item" key={f.q} open={i === 0}>
                <summary>
                  {f.q}
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section tool-section">
        <div className="shell">
          <h2 className="tool-h2">Related tools</h2>
          <div className="tool-related">
            {related.map((r) => (
              <Link className="tool-related-card" href={`/${r.slug}`} key={r.slug}>
                <strong>{r.navLabel}</strong>
                <span>{r.lead}</span>
              </Link>
            ))}
          </div>
          <p className="tool-all-link">
            <Link href="/#tools">See all tools</Link> · <Link href="/supported-sites">Supported sites</Link>
          </p>
        </div>
      </section>

      <div className="shell">
        <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_FOOTER} format="autorelaxed" />
      </div>
    </Layout>
  );
}

export function getStaticPaths() {
  return { paths: TOOL_PAGES.map((p) => ({ params: { slug: p.slug } })), fallback: false };
}

export function getStaticProps({ params }) {
  return { props: { slug: params.slug } };
}
