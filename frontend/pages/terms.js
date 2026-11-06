import Layout from '../components/Layout';

export default function Terms() {
  return (
    <Layout title="Terms" description="The rules for using Clip Converter.">
      <section className="section">
        <div className="shell prose">
          <h1 style={{ marginBottom: 8 }}>Terms of use</h1>
          <p style={{ marginTop: 0, opacity: 0.7 }}>Last updated: 6 November 2026</p>

          <h3>What this service is</h3>
          <p>
            Clip Converter fetches a publicly accessible video at your request and converts it into a file
            you can save. We do not publish, share or distribute any content, and we do not own the
            content you download. A processed file is kept on our server only until you download it,
            and is deleted automatically 20 minutes after it is created.
          </p>
          <p>
            These terms apply to the Clip Converter website and to the Clip Converter Android app.
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

          <h3>Takedowns and rights concerns</h3>
          <p>
            Clip Converter does not publish content, and files are deleted automatically within 20
            minutes. If you believe a request on our service infringes your rights, contact us at{' '}
            <a href="mailto:support@cgheven.com?subject=Copyright%20or%20rights%20concern">support@cgheven.com</a>{' '}
            with the link concerned and your details, and we will
            respond. You can also raise the matter with the platform that hosts the original video.
          </p>

          <h3>Clip Converter Android app and Premium</h3>
          <ul>
            <li>The free version of the app has a daily download limit and may show ads.</li>
            <li>Premium is a paid subscription that removes ads and the daily limit.</li>
            <li>Subscriptions are bought and managed through Google Play. The price, billing period and any free trial are shown before you confirm a purchase. Subscriptions renew automatically at the end of each period unless you cancel. You can cancel at any time in the Google Play subscriptions settings, and the cancellation takes effect at the end of the current period.</li>
            <li>Refunds are handled by Google Play under its refund policy. We cannot issue refunds for purchases made through Google Play.</li>
            <li>The same fair-use rules above apply to the app.</li>
          </ul>

          <h3>Ads and third-party content</h3>
          <p>
            The website shows ads from Google AdSense, and the free version of the Android app may show
            ads from Google AdMob. We do not control the ads or the sites they link to. Ads are not an
            endorsement of the advertiser. Videos, images and transcripts belong to their creators and
            to the platforms that host them.
          </p>

          <h3>Age requirement</h3>
          <p>
            You must be old enough to form a binding contract where you live to use Premium. If you are
            under that age, ask a parent or guardian to buy or manage any subscription for you.
          </p>

          <h3>Limitation of liability</h3>
          <p>
            To the extent the law allows, Clip Converter is not liable for any loss, damage or
            consequence from using the service, including lost data, interrupted downloads, or any
            claim made by a third party about content you save. Nothing in these terms limits any right
            you have that cannot be limited by law.
          </p>

          <h3>Changes to these terms</h3>
          <p>
            We may update these terms. The date at the top shows when they last changed. Continuing to
            use the service after a change means you accept the updated terms.
          </p>
        </div>
      </section>
    </Layout>
  );
}
