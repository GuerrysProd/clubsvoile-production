import Link from 'next/link';
import type { Metadata } from 'next';
import '../home.css';
import CvNav from '../components/CvNav';
import CvFooter from '../components/CvFooter';
import JsonLd from '../components/JsonLd';
import { pageMeta, breadcrumbLd, itemListLd, SITE_URL, SITE_NAME } from '@/lib/seo';
import {
  getBlogCategories,
  getBlogPosts,
  getPublishedCountByCategory,
  readingMinutes,
  formatBlogDate,
  blogPostPath,
  type BlogCategory,
} from '@/lib/blog';

export const revalidate = 600;

const TITLE = 'Le blog de la voile';
const DESC =
  'Guides, conseils et repères pour apprendre la voile, choisir son support et profiter de la vie de club. Par l’équipe de ClubsVoile.fr.';

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({ title: `${TITLE} | ${SITE_NAME}`, description: DESC, path: '/blog' });
}

function PostCard({ post, categorySlug, categoryName }: { post: any; categorySlug: string; categoryName?: string }) {
  return (
    <Link href={blogPostPath(post, categorySlug)} className="cap-bpost">
      <div className="cap-bpost-img">
        {post.cover_image && <img src={post.cover_image} alt={post.cover_alt || post.title} loading="lazy" />}
        {categoryName && <span className="cap-bpost-cat">{categoryName}</span>}
      </div>
      <div className="cap-bpost-body">
        <h3>{post.title}</h3>
        {post.excerpt && <p>{post.excerpt}</p>}
        <div className="cap-bpost-meta">
          <span>{formatBlogDate(post.published_at)}</span>
          <span>·</span>
          <span>{readingMinutes(post)} min de lecture</span>
        </div>
      </div>
    </Link>
  );
}

export default async function BlogIndexPage() {
  const [categories, latest, counts] = await Promise.all([
    getBlogCategories(),
    getBlogPosts({ limit: 6, featuredFirst: true }),
    getPublishedCountByCategory(),
  ]);
  const catBySlug = new Map(categories.map((c) => [c.id, c]));

  const ld: object[] = [
    breadcrumbLd([
      { name: 'Accueil', path: '/' },
      { name: 'Blog', path: '/blog' },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: `${TITLE} — ${SITE_NAME}`,
      url: `${SITE_URL}/blog`,
      description: DESC,
    },
  ];
  if (categories.length) ld.push(itemListLd(categories.map((c) => ({ name: c.name, path: `/blog/${c.slug}` }))));

  return (
    <div className="cv">
      <JsonLd data={ld} />
      <CvNav />

      {/* ============ HERO ============ */}
      <section className="cap-wrap cap-pp-hero">
        <div>
          <div className="cap-pill"><span className="dot" />LE JOURNAL</div>
          <h1>Le blog de <span className="accent">la voile.</span></h1>
          <p className="lede">{DESC}</p>
        </div>
      </section>

      {/* ============ CLUSTERS ============ */}
      {categories.length > 0 && (
        <section className="cap-wrap cap-sec">
          <div className="cap-mono">— Les thématiques</div>
          <h2 className="cap-h2" style={{ marginBottom: 26 }}>Explorez par <span className="accent accent-coral">cluster.</span></h2>
          <div className="cap-bclusters">
            {categories.map((c: BlogCategory) => (
              <Link key={c.id} href={`/blog/${c.slug}`} className={'cap-bcluster a-' + (c.accent || 'teal')}>
                <div className="cap-bcluster-top">
                  <span className="cap-bcluster-count">{counts.get(c.id) || 0} article{(counts.get(c.id) || 0) > 1 ? 's' : ''}</span>
                </div>
                <h3>{c.name}</h3>
                {c.tagline && <p>{c.tagline}</p>}
                <span className="cap-bcluster-go">Voir le cluster →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ============ DERNIERS ARTICLES ============ */}
      {latest.length > 0 ? (
        <section className="cap-wrap cap-sec">
          <div className="cap-mono">— À lire</div>
          <h2 className="cap-h2" style={{ marginBottom: 26 }}>Les derniers <span className="accent">articles.</span></h2>
          <div className="cap-bgrid">
            {latest.map((p) => (
              <PostCard key={p.id} post={p} categorySlug={catBySlug.get(p.category_id || '')?.slug || ''} categoryName={catBySlug.get(p.category_id || '')?.name} />
            ))}
          </div>
        </section>
      ) : (
        <section className="cap-wrap cap-sec">
          <p className="lede">Les premiers articles arrivent très bientôt. Revenez vite&nbsp;!</p>
        </section>
      )}

      {/* ============ CTA ============ */}
      <section className="cap-wrap" style={{ marginTop: 56, marginBottom: 16 }}>
        <div className="cap-pp-cta">
          <h2>Prêt à passer à l’eau&nbsp;? <span className="accent">Trouvez votre club.</span></h2>
          <p>Des clubs et bases nautiques partout en France, avec leurs avis Google et leurs coordonnées.</p>
          <Link href="/search" className="cap-pp-cta-btn">Trouver un club →</Link>
        </div>
      </section>

      <CvFooter />
    </div>
  );
}
