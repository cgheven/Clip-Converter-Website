import { useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

const ITEMS = [
  {
    q: 'Which sites are supported?',
    a: 'YouTube, Instagram, Facebook, Pinterest and X are the ones we test against. The underlying extractor supports well over a thousand sites, so most public video pages work even if they are not listed.',
  },
  {
    q: 'Do I need an account?',
    a: 'No. There is no sign up, no email and no login.',
  },
  {
    q: 'Why do some links fail?',
    a: 'The most common reason is that the content is private or needs a login. Instagram in particular restricts a lot of content to signed-in users. Removed, age-restricted and region-blocked videos will also fail.',
  },
  {
    q: 'Where is the file stored?',
    a: 'Temporarily on our server while it is being prepared, then deleted twenty minutes later. We do not keep a copy, and we do not keep a record of what you downloaded.',
  },
  {
    q: 'Why is 1080p slower than 360p?',
    a: 'Above 720p most platforms serve video and audio as separate streams. They have to be downloaded and then merged into one file, which takes real processing time. Smaller files skip most of that work.',
  },
  {
    q: 'Is there a file size or length limit?',
    a: 'There is a processing time limit rather than a hard size limit. Very long videos at maximum quality may hit it. Picking a lower resolution almost always gets them through.',
  },
  {
    q: 'Can I download a whole playlist or channel?',
    a: 'Not currently. Each request handles one video. Paste the link to the individual video rather than the playlist page.',
  },
  {
    q: 'Is this legal?',
    a: 'Downloading content you created, own, or have permission to use is generally fine. Saving copyrighted material you do not have rights to may breach the platform\u2019s terms of service or copyright law where you live. You are responsible for what you download.',
  },
];

function Item({ q, a, open, onToggle }) {
  return (
    <div className="faq-item">
      <button className="faq-q" onClick={onToggle} aria-expanded={open}>
        {q}
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className="faq-a">
          <p>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <Layout title="FAQ" description="Answers to the questions people ask most about ClipGrab.">
      <section className="section">
        <div className="shell prose">
          <h1 style={{ marginBottom: 24 }}>Questions</h1>
          <div>
            {ITEMS.map((item, i) => (
              <Item
                key={item.q}
                {...item}
                open={open === i}
                onToggle={() => setOpen(open === i ? -1 : i)}
              />
            ))}
          </div>
          <p style={{ marginTop: 32 }}>
            Still stuck? <Link href="/how-it-works">See how the process works</Link>.
          </p>
        </div>
      </section>
    </Layout>
  );
}
