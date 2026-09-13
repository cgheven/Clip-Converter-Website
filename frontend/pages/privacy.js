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
            <li>No advertising or third-party tracking scripts.</li>
          </ul>

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
