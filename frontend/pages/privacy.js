import Layout from '../components/Layout';

export default function Privacy() {
  return (
    <Layout title="Privacy" description="What Clip Converter collects and what it does not.">
      <section className="section">
        <div className="shell prose">
          <h1 style={{ marginBottom: 16 }}>Privacy</h1>
          <p>Short version: we keep as little as possible.</p>

          <h3>What we do not collect</h3>
          <ul>
            <li>No accounts, so no names, emails or passwords.</li>
            <li>No history of the links you paste.</li>
            <li>The links themselves are never sent to any analytics tool.</li>
          </ul>

          <h3>Measurement</h3>
          <p>
            We use Google Analytics and PostHog to count visits and to see which parts of the
            site work and which break. These record the page you are on, your approximate
            location from your IP address, your browser and device type, and the actions you
            take here &mdash; for example that a link was submitted, which quality was chosen,
            and whether the download finished or failed.
          </p>
          <p>
            What is deliberately left out: the link you paste, the title of the video, and
            anything else you type. Where an event needs to say which site a link came from, we
            send only the platform name, such as &ldquo;youtube&rdquo;. Neither tool is given an
            account or email, because there are none, so the data is not tied to a named person.
            If your browser sends a Do Not Track signal, PostHog is switched off for you.
          </p>

          <h3>Advertising</h3>
          <p>
            Ads on this site are served by Google AdSense, which sets its own cookies and may
            use them to personalise what you see. You can control that at{' '}
            <a href="https://myadcenter.google.com" rel="noopener noreferrer" target="_blank">
              Google My Ad Center
            </a>.
          </p>

          <h3>What passes through the server</h3>
          <p>
            To prepare a download we need the link you paste. It is held in memory while your
            request is processed and for up to thirty minutes afterwards so that repeat lookups are
            fast. It is not written to a database.
          </p>
          <p>
            Your IP address is used to apply rate limits, which is what stops one person from
            overwhelming the service. Standard server logs may record it briefly for the same
            reason.
          </p>

          <h3>Files</h3>
          <p>
            A processed file sits on the server only until you download it, and is deleted
            automatically twenty minutes after it was created either way.
          </p>

          <h3>Third parties</h3>
          <p>
            When you paste a link, our server contacts the platform hosting that video. That
            platform sees a request from our server, not from you.
          </p>
        </div>
      </section>
    </Layout>
  );
}
