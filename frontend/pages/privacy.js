import Layout from '../components/Layout';

export default function Privacy() {
  return (
    <Layout title="Privacy" description="What Clip Converter collects on the website and in the Android app, and what it does not.">
      <section className="section">
        <div className="shell prose">
          <h1 style={{ marginBottom: 8 }}>Privacy Policy</h1>
          <p style={{ marginTop: 0, opacity: 0.7 }}>Last updated: 6 November 2026</p>
          <p>
            Short version: we keep as little as possible. This page covers the Clip Converter
            website and the Clip Converter Android app.
          </p>

          <h3>Contents</h3>
          <ul>
            <li><a href="#website">1. Website</a></li>
            <li><a href="#app">2. Android app</a></li>
            <li><a href="#retention">3. How long data is kept</a></li>
            <li><a href="#third-parties">4. Third parties</a></li>
            <li><a href="#rights">5. Your choices and rights</a></li>
            <li><a href="#children">6. Children</a></li>
            <li><a href="#contact">7. Contact</a></li>
          </ul>

          <h3 id="website">1. Website</h3>

          <h4>What we do not collect</h4>
          <ul>
            <li>No accounts, so no names, emails or passwords.</li>
            <li>No history of the links you paste.</li>
            <li>The links themselves are never sent to any analytics tool.</li>
          </ul>

          <h4>Measurement</h4>
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

          <h4>Advertising</h4>
          <p>
            Ads on this site are served by Google AdSense, which sets its own cookies and may
            use them to personalise what you see. You can control that at{' '}
            <a href="https://myadcenter.google.com" rel="noopener noreferrer" target="_blank">
              Google My Ad Center
            </a>.
          </p>

          <h4>Cookies and similar technologies</h4>
          <p>
            The website uses cookies and similar browser storage. Some are needed for the site to work,
            and others are used for measurement and advertising. You can block or delete them in your
            browser settings. Blocking them will not stop the download tool from working, but it may
            affect how ads and measurement behave.
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr><th>Name (example)</th><th>Set by</th><th>Purpose</th></tr>
              </thead>
              <tbody>
                <tr><td><code>_ga</code>, <code>_ga_&lt;ID&gt;</code></td><td>Google Analytics</td><td>Counts visits and tells sessions apart</td></tr>
                <tr><td><code>ph_&lt;key&gt;_posthog</code></td><td>PostHog (browser storage)</td><td>Counts visits and actions. Off when Do Not Track is on</td></tr>
                <tr><td><code>IDE</code>, <code>__gads</code>, <code>__gpi</code></td><td>Google AdSense and DoubleClick</td><td>Ad delivery, frequency capping and, where allowed, personalised ads</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            This list shows the main examples and may change as the providers update their services.
          </p>

          <h2 id="app" style={{ marginTop: 40 }}>2. Android app</h2>
          <p>
            The Clip Converter Android app lets you download videos, audio, thumbnails and
            transcripts. This section explains what the app does with your data.
          </p>

          <h4>What the app does not require</h4>
          <ul>
            <li>No account or sign-in.</li>
            <li>No name, email, phone number, contacts, location or storage access.</li>
          </ul>

          <h4>Install ID</h4>
          <p>
            On first launch the app creates a random identifier that is stored only on your
            device. It is sent with each request to our server so that we can apply the free
            daily limit and rate limits per install. It is not linked to your name or email, and
            clearing the app&apos;s data or reinstalling creates a new one.
          </p>

          <h4>Links and downloads</h4>
          <p>
            When you paste a link, the app sends it to our server, which contacts the platform
            hosting the video and prepares the file or transcript for you. Links are not stored in
            a database. Finished files are saved to your device&apos;s Downloads through Android&apos;s
            media storage, and the copy on our server is deleted automatically (see section 3).
          </p>

          <h4>Daily usage</h4>
          <p>
            The app keeps a count of downloads you have made today on your device, so the free
            daily limit can be enforced. This count is not sent anywhere except as part of the
            request that starts a download.
          </p>

          <h4>Purchases</h4>
          <p>
            Premium subscriptions are handled entirely by Google Play Billing. We never see or
            store your card or payment details. Google tells us only whether your subscription is
            active and when it renews, so we can turn Premium features on or off.
          </p>

          <h4>Notifications</h4>
          <p>
            The app can ask for permission to show notifications so that you can see download
            progress and completion. You can decline, and downloads still work. You can change
            this at any time in Android Settings.
          </p>

          <h4>Advertising in the free version</h4>
          <p>
            The free version of the app may show ads served by Google AdMob. AdMob can use your
            device&apos;s advertising ID to show relevant ads. You can reset or limit this in your
            device&apos;s Settings &rarr; Google &rarr; Ads. Google&apos;s policy is at{' '}
            <a href="https://policies.google.com/technologies/ads" rel="noopener noreferrer" target="_blank">
              policies.google.com/technologies/ads
            </a>.
          </p>

          <h4>Server logs</h4>
          <p>
            The server that handles app requests uses your IP address for rate limits and may keep
            standard server logs for a short time, in the same way as the website.
          </p>

          <h3 id="retention">3. How long data is kept</h3>
          <ul>
            <li>Pasted links are held in server memory for up to 30 minutes so that repeat lookups are fast. They are not written to a database.</li>
            <li>Processed files on our server are deleted automatically 20 minutes after they are created, whether or not you downloaded them.</li>
            <li>Install IDs, daily usage counts and purchase status are kept on your device, or, for subscription status, as provided by Google Play.</li>
            <li>Standard server logs are kept only for a short period.</li>
          </ul>

          <h3 id="third-parties">4. Third parties and international transfers</h3>
          <ul>
            <li><strong>Google Analytics, PostHog</strong> (website): usage measurement, described in section 1.</li>
            <li><strong>Google AdSense</strong> (website) and <strong>Google AdMob</strong> (app, if ads are shown): advertising, described above.</li>
            <li><strong>Google Play</strong> (app): purchases and subscriptions.</li>
            <li><strong>The video platform</strong> hosting the link you paste: when we process a link, that platform sees a request from our server, not from you.</li>
          </ul>
          <h4>Where data is processed</h4>
          <p>
            Google Analytics, Google AdSense, AdMob and Google Play are operated by Google, and PostHog
            is operated by PostHog, Inc. These providers can process data in the United States and in
            other countries where they operate. Where personal data leaves the EU, UK or Switzerland,
            the providers rely on their own transfer safeguards, such as the EU-US Data Privacy
            Framework or standard contractual clauses, as described in their privacy documentation.
          </p>

          <h3 id="rights">5. Your choices and rights</h3>
          <h4>Legal basis (EU, UK and similar regions)</h4>
          <ul>
            <li><strong>Consent</strong> for analytics and for personalised advertising (cookies and advertising ID). You can withdraw consent at any time through the controls described above.</li>
            <li><strong>Legitimate interest</strong> for rate limiting, abuse prevention and keeping the service secure, which need the IP address and install ID.</li>
            <li><strong>Contract</strong> for processing a link you paste, and for checking and managing a Premium subscription.</li>
          </ul>
          <ul>
            <li><strong>Ads:</strong> You can change ad personalisation at Google My Ad Center, and reset or limit the advertising ID in your Android settings.</li>
            <li><strong>Analytics:</strong> Turn on Do Not Track in your browser to switch off PostHog. You can also block Google Analytics with a browser extension.</li>
            <li><strong>Deleting app data:</strong> Uninstalling the app, or clearing its storage in Android Settings, deletes the install ID, daily usage count and downloads list stored on your device. Downloaded files saved to your Downloads folder stay until you delete them.</li>
            <li><strong>Server data:</strong> We do not keep a record linked to your name. Processed files are deleted automatically after 20 minutes, and nothing is stored in a database. Because we cannot identify you from the install ID alone, we usually cannot find data tied to it. If you have a specific request, contact us with a description of it and the approximate dates you used the app.</li>
            <li><strong>Other requests:</strong> If you are in a region with data protection laws, such as the EU, UK or California, you can ask us what personal data we hold about you, ask us to correct or delete it, or object to how it is used. Send these requests through the <a href="/contact">Contact page</a>.</li>
          </ul>

          <h3 id="children">6. Children</h3>
          <p>
            Clip Converter is not directed at children under 13, and we do not knowingly collect personal
            information from them. If you believe a child has given us personal information, contact us
            and we will delete it.
          </p>

          <h3 id="contact">7. Contact</h3>
          <p>
            Questions about this policy can be sent through our <a href="/contact">Contact page</a>. We will
            update this page when the app or the website starts collecting something new, and the
            date at the top will change.
          </p>
        </div>
      </section>
    </Layout>
  );
}
