import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import AdSlot from '../components/AdSlot';
import { TOOL_PAGES, TOOL_BY_SLUG } from '../data/tool-pages';
import { TOOL_ARTICLES } from '../data/tool-articles';

const SITE = 'https://clip-converters.com';

function ToolCta({ label }) {
  return (
    <Link href="/" className="btn btn-primary inline-btn article-cta-btn">
      {label}
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

/** Article pages: long-form copy about one feature or platform, written for
 * readers and search engines. The tool itself lives on the homepage — these
 * pages explain it and link there. */
export default function ToolPage({ slug }) {
  const page = TOOL_BY_SLUG[slug];
  const article = TOOL_ARTICLES[slug];
  const url = `${SITE}/${page.slug}`;
  const related = page.related.map((s) => TOOL_BY_SLUG[s]).filter(Boolean);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: page.h1,
      description: page.description,
      mainEntityOfPage: url,
      author: { '@type': 'Organization', name: 'Clip Converter', url: SITE },
      publisher: { '@type': 'Organization', name: 'Clip Converter', url: SITE },
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

      <article className="shell shell-narrow article">
        <header className="article-head">
          <nav className="article-crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>{page.navLabel}</span>
          </nav>
          <h1>{page.h1}</h1>
          <p className="article-lead">{page.lead}</p>
          <ToolCta label={`Open the ${page.navLabel}`} />
        </header>

        <div className="article-body">
          <h2>{article.introHeading}</h2>
          {article.intro.map((p) => <p key={p}>{p}</p>)}

          <h2>How to use the {page.navLabel}</h2>
          <ol className="article-steps">
            {page.steps.map((s) => (
              <li key={s.title}>
                <strong>{s.title}.</strong> {s.text}
              </li>
            ))}
          </ol>

          <h2>Key features</h2>
          <ul>
            {page.features.map((f) => (
              <li key={f.title}>
                <strong>{f.title}.</strong> {f.text}
              </li>
            ))}
          </ul>

          <AdSlot slot={process.env.NEXT_PUBLIC_AD_SLOT_RESULT} />

          {article.sections.map((sec) => (
            <section key={sec.heading}>
              <h2>{sec.heading}</h2>
              {sec.paragraphs?.map((p) => <p key={p}>{p}</p>)}
              {sec.list && (
                <ul>
                  {sec.list.map((li) => <li key={li}>{li}</li>)}
                </ul>
              )}
            </section>
          ))}

          <h2>{page.specs.heading}</h2>
          <dl className="tool-specs">
            {page.specs.rows.map(([k, v]) => (
              <div className="tool-spec-row" key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <h2>Frequently asked questions</h2>
          {page.faqs.map((f) => (
            <div className="article-faq" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <aside className="article-cta">
            <h2>Ready to try it?</h2>
            <p>It is free, works in your browser, and needs no account.</p>
            <ToolCta label={`Open the ${page.navLabel}`} />
          </aside>

          <h2>Related guides</h2>
          <ul className="article-related">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/${r.slug}`}>{r.navLabel}</Link> — {r.lead}
              </li>
            ))}
          </ul>
        </div>
      </article>

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
