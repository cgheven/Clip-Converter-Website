import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout title="About" description="What Clip Converter is, how it works and what it does not do.">
      <section className="section">
        <div className="shell prose">
          <h1 style={{ marginBottom: 8 }}>About Clip Converter</h1>

          <p>
            Clip Converter is a free tool for saving publicly accessible videos, audio, thumbnails and
            transcripts from supported websites. It is available on the web and as an Android app.
          </p>

          <h3>What you can do</h3>
          <ul>
            <li>Download video in the quality the source provides, up to 4K where available.</li>
            <li>Save audio as MP3, M4A, WAV or FLAC, and trim video or audio to a section.</li>
            <li>Read, copy and download transcripts and subtitles, including timestamps.</li>
            <li>Download thumbnails, and process playlists and several links at once.</li>
            <li>See a video&apos;s title, description, upload date, views, tags and chapters.</li>
          </ul>

          <h3>How it works</h3>
          <p>
            When you paste a link, our server reads the video&apos;s public information and prepares the
            file you asked for. It uses the open-source <a href="https://github.com/yt-dlp/yt-dlp" rel="noopener noreferrer" target="_blank">yt-dlp</a>{' '}
            project to do this. The file is kept on our server only until you download it, and is deleted
            automatically 20 minutes after it was created.
          </p>

          <h3>What we do not do</h3>
          <ul>
            <li>We do not publish, share or sell the content you download.</li>
            <li>We do not require an account, and we do not keep a history of the links you paste.</li>
            <li>We do not claim any rights in the videos, audio or images you download.</li>
          </ul>

          <h3>Your responsibility</h3>
          <p>
            You are responsible for what you download and how you use it. Save only content you created,
            content you own, content in the public domain, or content you have permission to save. Read our{' '}
            <a href="/terms">Terms of use</a> and <a href="/privacy">Privacy Policy</a> for the full details.
          </p>

          <h3>Contact</h3>
          <p>
            Questions, support and rights concerns can be sent through our <a href="/contact">Contact page</a>.
          </p>
        </div>
      </section>
    </Layout>
  );
}
