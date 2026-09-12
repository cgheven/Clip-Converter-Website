import Layout from '../components/Layout';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Layout title="Page not found">
      <div className="shell center-block">
        <h1>That page does not exist</h1>
        <p>The link may be out of date, or the address may have a typo.</p>
        <Link href="/" className="btn btn-primary inline-btn" style={{ display: 'inline-block' }}>
          Back to the downloader
        </Link>
      </div>
    </Layout>
  );
}
