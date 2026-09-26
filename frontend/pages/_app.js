import Script from 'next/script';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { initAnalytics, trackPageview } from '../lib/analytics';
import '../styles/globals.css';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
// Approved AdSense publisher ID for this site.
const ADSENSE_CLIENT = 'ca-pub-3534006675523302';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    initAnalytics();
    // gtag('config') below already sends the first GA page view, so this
    // one only goes to PostHog.
    trackPageview(undefined, { skipGa: true });
  }, []);

  // Pages Router navigates client-side between pages: without this every
  // visit would look like a single-page session in both tools.
  useEffect(() => {
    const onRouteChange = (url) => trackPageview(url);
    router.events.on('routeChangeComplete', onRouteChange);
    return () => router.events.off('routeChangeComplete', onRouteChange);
  }, [router.events]);

  return (
    <>
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              // gtag sends the first page view itself; client-side route
              // changes are sent from lib/analytics.js (see trackPageview).
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <Component {...pageProps} />
    </>
  );
}
