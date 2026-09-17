import { useMemo, useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import sites from '../data/supported-sites.json';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
    <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/** First-letter key for grouping — digits/symbols bucket under "#". */
function letterOf(name) {
  const c = name.trim()[0]?.toUpperCase() || '#';
  return /[A-Z]/.test(c) ? c : '#';
}

export default function SupportedSites() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sites;
    return sites.filter((s) => s.name.toLowerCase().includes(q) || s.note.toLowerCase().includes(q));
  }, [query]);

  const groups = useMemo(() => {
    const map = new Map();
    for (const s of filtered) {
      const letter = letterOf(s.name);
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter).push(s);
    }
    return [...map.entries()].sort(([a], [b]) => (a === '#' ? 1 : b === '#' ? -1 : a.localeCompare(b)));
  }, [filtered]);

  return (
    <Layout
      title="Supported Sites"
      description={`Clip Converter works with YouTube, Instagram, TikTok, Facebook, Pinterest and ${sites.length}+ other sites. Search the full list of supported platforms.`}
    >
      <Head>
        <link rel="canonical" href="https://clip-converters.com/supported-sites" />
      </Head>

      <section className="section sites-hero">
        <div className="shell shell-narrow" style={{ textAlign: 'center' }}>
          <h1>{sites.length}+ Supported Sites</h1>
          <p className="sites-intro">
            Paste a link from any of these platforms and Clip Converter will fetch it — no app, no signup.
            Can&rsquo;t find a site below? Try the link anyway; most public video pages work even when
            they&rsquo;re not explicitly listed.
          </p>

          <div className="field field-pill sites-search">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search supported sites…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search supported sites"
            />
            {query && (
              <button type="button" className="clear" onClick={() => setQuery('')} aria-label="Clear search">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
          <p className="sites-count">
            {filtered.length === sites.length ? `Showing all ${sites.length} sites` : `${filtered.length} of ${sites.length} sites match "${query}"`}
          </p>
        </div>
      </section>

      <section className="section sites-all">
        <div className="shell">
          {groups.length > 0 && (
            <nav className="sites-alpha-nav" aria-label="Jump to letter">
              {groups.map(([letter]) => (
                <a key={letter} href={`#letter-${letter}`}>
                  {letter}
                </a>
              ))}
            </nav>
          )}

          {groups.length === 0 && <p className="sites-empty">No site matches &ldquo;{query}&rdquo; — try the link anyway, it may still work.</p>}

          {groups.map(([letter, list]) => (
            <div key={letter} id={`letter-${letter}`} className="sites-group">
              <h2 className="sites-section-title">{letter}</h2>
              <div className="sites-grid">
                {list.map((s) => (
                  <span className="site-chip" key={s.name} title={s.note || undefined}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
