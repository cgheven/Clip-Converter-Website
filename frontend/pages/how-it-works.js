import Layout from '../components/Layout';
import Link from 'next/link';

export default function HowItWorks() {
  return (
    <Layout
      title="How it works"
      description="What happens between pasting a link and getting your file."
    >
      <section className="section">
        <div className="shell prose">
          <h1 style={{ marginBottom: 16 }}>How it works</h1>
          <p>
            Clip Converter does not store a library of videos. Every download is fetched live from the
            original platform at the moment you ask for it.
          </p>

          <h3>When you paste a link</h3>
          <p>
            The link is sent to our server, which asks the source platform what versions of that
            video exist. That answer comes back as a list of resolutions and bitrates. We group them
            into the handful of choices you actually care about instead of showing you forty
            near-identical entries.
          </p>
          <p>
            Results are remembered for half an hour, so pasting the same link again returns
            instantly.
          </p>

          <h3>When you choose a quality</h3>
          <p>
            Most platforms store video and audio as separate streams, especially above 720p. Our
            server downloads both and merges them into a single MP4 before handing it to you. That
            merge is why a large file takes longer than a small one, and why the progress bar pauses
            near the end.
          </p>
          <p>
            If you pick audio only, the audio stream is extracted and converted to MP3 instead.
          </p>

          <h3>When the file is ready</h3>
          <p>
            Your browser starts saving it immediately. The copy on our server is deleted after
            twenty minutes, whether you downloaded it or not.
          </p>

          <h3>Why there is sometimes a queue</h3>
          <p>
            Merging video is genuinely demanding work, so only a small number of downloads run at
            once. This keeps every download fast rather than letting a dozen slow jobs crawl
            together. If you land in the queue, your position is shown while you wait.
          </p>

          <h3>What can go wrong</h3>
          <ul>
            <li>
              <strong>Private or login-only content</strong> cannot be fetched. This covers private
              Instagram accounts, restricted Facebook posts, and members-only videos.
            </li>
            <li>
              <strong>Removed or region-blocked videos</strong> fail for the same reason they fail in
              your browser.
            </li>
            <li>
              <strong>Very long videos</strong> can hit the processing limit. Choosing a lower
              resolution usually gets them through.
            </li>
          </ul>

          <p style={{ marginTop: 32 }}>
            <Link href="/faq">Common questions</Link> · <Link href="/">Back to the downloader</Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}
