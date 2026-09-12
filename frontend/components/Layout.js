import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/#platforms', label: 'Supported sites' },
  { href: '/faq', label: 'FAQ' },
];

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const isDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDark(isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle dark mode">
      {dark ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8L6 18M18 6l1.8-1.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

function Mark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect width="22" height="22" rx="6" fill="#2B59FF" />
      <path
        d="M11 5.5v8m0 0 3-3m-3 3-3-3M6.5 16h9"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Layout({ children, title, description }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [router.asPath]);

  const pageTitle = title ? `${title} — ClipGrab` : 'ClipGrab — Save any video in the quality you want';
  const desc =
    description ||
    'Paste a link from YouTube, Instagram, Facebook, Pinterest or X, choose a resolution, and save the file.';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2B59FF" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      <header className="site-head">
        <div className="shell head-inner">
          <Link href="/" className="logo">
            <Mark />
            ClipGrab
          </Link>

          <nav className="nav-links">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={router.pathname === n.href ? 'active' : ''}>
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="head-actions">
            <ThemeToggle />

            <button
              className={`burger ${open ? 'open' : ''}`}
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {open && (
          <nav className="mobile-nav shell">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href}>
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main>{children}</main>

      <footer className="site-foot">
        <div className="shell foot-inner">
          <div>
            <div className="foot-links">
              <Link href="/how-it-works">How it works</Link>
              <Link href="/faq">FAQ</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
            <p className="foot-note" style={{ marginTop: 14 }}>
              Only save content you own or have permission to use. ClipGrab does not host or store
              any video.
            </p>
          </div>
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} ClipGrab</p>
        </div>
      </footer>
    </>
  );
}
