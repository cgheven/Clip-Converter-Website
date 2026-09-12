import Layout from '../components/Layout';
import Downloader from '../components/Downloader';

export default function Home() {
  return (
    <Layout>
      <section className="hero hero-simple">
        <div className="shell shell-narrow">
          <p className="hero-tag"># Online Video Download Helper #</p>
          <Downloader />
        </div>
      </section>
    </Layout>
  );
}
