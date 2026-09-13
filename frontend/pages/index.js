import Layout from '../components/Layout';
import Downloader from '../components/Downloader';

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill="currentColor" /></svg>
    ),
    tone: 'blue',
    title: 'Fast Conversion',
    text: 'Get your clip ready in seconds.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2l8 3v6c0 5-3.4 8.9-8 11-4.6-2.1-8-6-8-11V5l8-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M8.5 12.2l2.3 2.3 4.7-4.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
    ),
    tone: 'green',
    title: 'Secure & Safe',
    text: 'Your links and data are always protected.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="6" y="2" width="12" height="20" rx="2.5" stroke="currentColor" strokeWidth="1.8" /><path d="M11 18.5h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
    ),
    tone: 'purple',
    title: 'Works on Any Device',
    text: 'Convert from your computer, tablet or mobile.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.8" /><circle cx="8.7" cy="10" r="1" fill="currentColor" /><circle cx="15.3" cy="10" r="1" fill="currentColor" /><path d="M8 14.5c1 1.3 2.4 2 4 2s3-.7 4-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
    ),
    tone: 'pink',
    title: 'No Signup Required',
    text: "Just paste, convert and download. That's it.",
  },
];

export default function Home() {
  return (
    <Layout>
      <section className="hero hero-clipfy">
        <div className="hero-decor" aria-hidden="true">
          <div className="hero-blob hero-blob-a" />
          <div className="hero-blob hero-blob-b" />

          <span className="float-badge float-yt">
            <svg className="float-icon-up-a" width="40" height="40" viewBox="0 0 24 24" fill="#fff"><path d="M9.5 7v10l8.5-5-8.5-5z" /></svg>
          </span>
          <span className="float-badge float-tt">
            <svg className="float-icon-up-b" width="34" height="34" viewBox="0 0 24 24" fill="#fff"><path d="M16.5 3c.4 2 1.7 3.5 3.9 3.8v2.7c-1.4 0-2.7-.4-3.9-1.2v6.6c0 3.3-2.4 5.6-5.5 5.6-3 0-5.5-2.4-5.5-5.5 0-3 2.5-5.5 5.6-5.5.3 0 .7 0 1 .1v2.8a2.8 2.8 0 1 0 1.9 2.6V3h2.5z" /></svg>
          </span>
          <svg className="float-arrow" width="46" height="58" viewBox="0 0 46 58" fill="none">
            <path d="M6 3c2 18 10 33 34 42M28 40l11 5 2-12" stroke="var(--brand)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="float-badge float-ig">
            <svg className="float-icon-up-c" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6"><rect x="3.5" y="3.5" width="17" height="17" rx="5.5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.3" cy="6.7" r="1.1" fill="#fff" stroke="none" /></svg>
          </span>
          <span className="float-thumb">
            <span className="float-thumb-play">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1a1a2e"><path d="M9 7l9 5-9 5V7z" /></svg>
            </span>
            <span className="float-thumb-badge">02:45</span>
          </span>
        </div>

        <div className="shell shell-narrow hero-content">
          <h1 className="hero-h1">
            Convert &amp; Download
            <br />
            <span className="grad grad-a">Any Clip.</span>
          </h1>
          <Downloader />
        </div>
      </section>

      <section className="section features-section">
        <div className="shell">
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div className="feature-card" key={f.title}>
                <span className={`feature-icon feature-icon-${f.tone}`}>{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
