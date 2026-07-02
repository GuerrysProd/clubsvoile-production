import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import '../../home.css';
import CvNav from '../../components/CvNav';
import CvFooter from '../../components/CvFooter';
import JsonLd from '../../components/JsonLd';
import { pageMeta, breadcrumbLd, itemListLd, SITE_NAME } from '@/lib/seo';
import {
  getBlogCategory,
  getBlogCategories,
  getBlogPosts,
  readingMinutes,
  formatBlogDate,
  blogPostPath,
} from '@/lib/blog';

export const revalidate = 600;

type Params = { cluster: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const cat = await getBlogCategory(params.cluster);
  if (!cat) return {};
  return pageMeta({
    title: cat.meta_title || `${cat.title || cat.name} | ${SITE_NAME}`,
    description: cat.meta_description || cat.description || `Articles ${cat.name} sur ClubsVoile.fr.`,
    path: `/blog/${cat.slug}`,
  });
}

export default async function BlogClusterPage({ params }: { params: Params }) {
  const cat = await getBlogCategory(params.cluster);
  if (!cat) notFound();

  const [posts, allCats] = await Promise.all([
    getBlogPosts({ categoryId: cat.id, featuredFirst: true }),
    getBlogCategories(),
  ]);
  const otherCats = allCats.filter((c) => c.id !== cat.id);

  const ld: object[] = [
    breadcrumbLd([
      { name: 'Accueil', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: cat.name, path: `/blog/${cat.slug}` },
    ]),
  ];
  if (posts.length) ld.push(itemListLd(posts.map((p) => ({ name: p.title, path: blogPostPath(p, cat.slug) }))));

  return (
    <div className="cv">
      <JsonLd data={ld} />
      <CvNav />

      {/* ============ HERO ============ */}
      <header className={'cap-geo-hero a-' + (cat.accent || 'teal')}>
        <div className="cap-wrap cap-geo-hero-in">
          <div>
            <nav className="cap-bc">
              <Link href="/">Accueil</Link><span>›</span>
              <Link href="/blog">Blog</Link><span>›</span>
              <span className="cur">{cat.name}</span>
            </nav>
            <div className="cap-geo-badge">Cluster</div>
            <h1>{cat.title || cat.name}</h1>
            <p className="lede">{cat.description}</p>
          </div>
        </div>
      </header>

      {/* ============ INTRO ÉDITORIALE (pilier) ============ */}
      {cat.intro_html && (
        <section className="block seo-block">
          <div className="cap-wrap">
            <div className="seo-content blog-prose" dangerouslySetInnerHTML={{ __html: cat.intro_html }} />
          </div>
        </section>
      )}

      {/* ============ ARTICLES DU CLUSTER ============ */}
      <section className="cap-wrap cap-sec">
        <div className="cap-mono">— {posts.length} article{posts.length > 1 ? 's' : ''}</div>
        <h2 className="cap-h2" style={{ marginBottom: 26 }}>Dans ce cluster</h2>
        {posts.length > 0 ? (
          <div className="cap-bgrid">
            {posts.map((p) => (
              <Link key={p.id} href={blogPostPath(p, cat.slug)} className="cap-bpost">
                <div className="cap-bpost-img">
                  {p.cover_image && <img src={p.cover_image} alt={p.cover_alt || p.title} loading="lazy" />}
                </div>
                <div className="cap-bpost-body">
                  <h3>{p.title}</h3>
                  {p.excerpt && <p>{p.excerpt}</p>}
                  <div className="cap-bpost-meta">
                    <span>{formatBlogDate(p.published_at)}</span><span>·</span>
                    <span>{readingMinutes(p)} min</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="lede">Les premiers articles de ce cluster arrivent bientôt.</p>
        )}
      </section>

      {/* ============ MAILLAGE : autres clusters + annuaire ============ */}
      <section className="cap-wrap cap-sec">
        <div className="cap-links-grid">
          {otherCats.length > 0 && (
            <div>
              <div className="cap-links-h">Autres thématiques</div>
              <div className="cap-links-tags">
                {otherCats.map((c) => (
                  <Link key={c.id} href={`/blog/${c.slug}`} className="cap-links-tag">{c.name}</Link>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="cap-links-h">Passer à la pratique</div>
            <div className="cap-links-tags">
              <Link href="/stage-de-voile" className="cap-links-tag">Stage de voile</Link>
              <Link href="/ecole-de-voile" className="cap-links-tag">École de voile</Link>
              <Link href="/club-de-voile" className="cap-links-tag">Club de voile</Link>
              <Link href="/activites" className="cap-links-tag">Toutes les activités</Link>
            </div>
          </div>
        </div>
      </section>

      <CvFooter />
    </div>
  );
}
