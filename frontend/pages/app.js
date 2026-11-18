import Layout from '../components/Layout';
import PlayBadge, { PLAY_STORE_URL } from '../components/PlayBadge';

export default function App() {
  return (
    <Layout
      title="Android App"
      description="Download the Clip Converter Android app from Google Play. Save videos, audio, thumbnails and transcripts on your phone."
    >
      <section className="section">
        <div className="shell prose">
          <h1 style={{ marginBottom: 8 }}>Clip Converter for Android</h1>
          <p style={{ marginTop: 0 }}>
            Save videos, audio, thumbnails and transcripts straight to your phone. Paste a link in the
            app, pick what you want, and the file is saved to your Downloads through Android&apos;s media
            storage.
          </p>

          <p>
            <PlayBadge />
          </p>

          <p>
            <a className="btn" href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer">
              Open in Google Play
            </a>
          </p>

          <h3>What the app does</h3>
          <ul>
            <li>Download video (MP4) in the quality the source provides.</li>
            <li>Save audio, and download transcripts and subtitles.</li>
            <li>Download thumbnails.</li>
            <li>Show progress in notifications, and keep downloading in the background.</li>
            <li>Share the saved file from the Downloads screen.</li>
          </ul>

          <h3>Free and Premium</h3>
          <ul>
            <li>The free version allows 5 downloads per day and shows ads.</li>
            <li>Premium removes ads and the daily limit. It is a subscription managed by Google Play.</li>
          </ul>

          <h3>Requirements</h3>
          <ul>
            <li>Android 10 or newer.</li>
            <li>An internet connection.</li>
          </ul>

          <h3>Things to know</h3>
          <ul>
            <li>
              YouTube links are not supported in the Android app. Use the website for YouTube, or use the
              app for TikTok, Instagram, Facebook and the other supported sites.
            </li>
            <li>
              The app uses the same server as the website. Files on the server are deleted automatically
              20 minutes after they are created.
            </li>
            <li>
              Save only content you created, own, or have permission to use. See our{' '}
              <a href="/terms">Terms of use</a> and <a href="/privacy">Privacy Policy</a>, which also cover
              the app.
            </li>
          </ul>

          <h3>Install steps</h3>
          <ol>
            <li>Tap the badge above or the button, which open the app&apos;s page in Google Play.</li>
            <li>Tap Install and wait for the download to finish.</li>
            <li>Open Clip Converter, paste a link, and choose what to download.</li>
          </ol>
        </div>
      </section>
    </Layout>
  );
}
