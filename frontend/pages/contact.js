import Layout from '../components/Layout';

const EMAIL = 'support@cgheven.com';

function mail(subject) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export default function Contact() {
  return (
    <Layout title="Contact" description="How to contact Clip Converter support.">
      <section className="section">
        <div className="shell prose">
          <h1 style={{ marginBottom: 8 }}>Contact</h1>
          <p style={{ marginTop: 0, opacity: 0.7 }}>Last updated: 6 November 2026</p>

          <p>
            For questions, problems with a download, billing help, or privacy requests, email{' '}
            <a href={mail('Clip Converter support')}>{EMAIL}</a>. Messages are read by a person,
            and we reply by email.
          </p>

          <h3>Before you write</h3>
          <ul>
            <li>Say whether you are using the website or the Android app, and your device or browser.</li>
            <li>Include the link you tried. Do not include passwords or payment card details.</li>
            <li>Describe what happened, including any error message shown on screen.</li>
          </ul>

          <h3>What to write about</h3>
          <ul>
            <li>
              <a href={mail('Download problem')}>Download problem</a>: a link that will not process,
              or a file that will not save.
            </li>
            <li>
              <a href={mail('Premium subscription')}>Premium subscription</a>: subscriptions are managed by
              Google Play. You can cancel there at any time. Refunds follow Google Play&apos;s policy.
            </li>
            <li>
              <a href={mail('Privacy request')}>Privacy request</a>: questions about the data described in
              our <a href="/privacy">Privacy Policy</a>.
            </li>
            <li>
              <a href={mail('Copyright or rights concern')}>Copyright or rights concern</a>: tell us the link
              concerned and your details. We do not publish content, and files are deleted automatically
              within 20 minutes. You can also raise the matter with the platform hosting the video.
            </li>
          </ul>

          <h3>Business and press</h3>
          <p>
            Partnership, advertising and press enquiries:{' '}
            <a href={mail('Business enquiry')}>{EMAIL}</a>.
          </p>
        </div>
      </section>
    </Layout>
  );
}
