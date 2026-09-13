import Layout from '../components/Layout';

export default function Terms() {
  return (
    <Layout title="Terms" description="The rules for using Clip Converter.">
      <section className="section">
        <div className="shell prose">
          <h1 style={{ marginBottom: 16 }}>Terms of use</h1>

          <h3>What this service is</h3>
          <p>
            Clip Converter fetches a publicly accessible video at your request and converts it into a file
            you can save. It does not host, store or distribute any content of its own.
          </p>

          <h3>Your responsibility</h3>
          <p>
            You may use this tool for content you created, content you own, content in the public
            domain, or content you have permission to save. Downloading copyrighted material
            without permission may breach the source platform&apos;s terms of service and the
            copyright law where you live. That responsibility is yours, not ours.
          </p>

          <h3>Fair use of the service</h3>
          <ul>
            <li>Do not automate requests or attempt to bypass rate limits.</li>
            <li>Do not use the service to redistribute content commercially.</li>
            <li>Do not attempt to access private or restricted content you are not entitled to.</li>
          </ul>
          <p>Access may be limited or blocked if the service is abused.</p>

          <h3>No guarantees</h3>
          <p>
            The service is provided as is. Source platforms change how they work without notice,
            which can break downloads temporarily. We do not guarantee availability, speed, or that
            any particular link will work.
          </p>

          <h3>Takedowns</h3>
          <p>
            We do not host content, so there is nothing to remove on our side. Rights concerns
            should be raised with the platform hosting the original video.
          </p>
        </div>
      </section>
    </Layout>
  );
}
