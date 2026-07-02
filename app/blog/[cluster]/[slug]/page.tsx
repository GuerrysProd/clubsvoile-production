import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import '../../../home.css';
import CvNav from '../../../components/CvNav';
import CvFooter from '../../../components/CvFooter';
import JsonLd from '../../../components/JsonLd';
import { pageMeta, breadcrumbLd, SITE_URL, SITE_NAME } from '@/lib/seo';
import {
  getBlogPost,
  getBlogPosts,
  readingMinutes,
  formatBlogDate,
  blogPostPath,
  DEFAULT_AUTHOR,
} from '@/lib/blog';

export const revalidate = 600;

type Params = { cluster: string; slug: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  if (!post || !post.category) return {};
  const meta = pageMeta({
    title: post.meta_title || `${post.title} | ${SITE_NAME}`,
    description: post.meta_description || post.excerpt || `${post.title} — ${SITE_NAME}`,
    path: blogPostPath(post, post.category.slug),
  });
  // OpenGraph « article » + image de couverture.
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: 'article',
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
      authors: [post.author || DEFAULT_AUTHOR],
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
  };
}

export default async function BlogArticlePage({ params }: { params: Params }) {
  const post = await getBlogPost(params.slug);
  if (!post || !post.category) notFound();

  const cat = post.category;
  // Si l'URL ne reflète pas le bon cluster, on redirige vers le canonique (308).
  if (cat.slug !== params.cluster) redirect(blogPostPath(post, cat.slug));

  const related = (await getBlogPosts({ categoryId: cat.id, excludeId: post.id, limit: 3 }));
  const minutes = readingMinutes(post);
  const path = blogPostPath(post, cat.slug);

  const ld: object[] = [
    breadcrumbLd([
      { name: 'Accueil', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: cat.name, path: `/blog/${cat.slug}` },
      { name: post.title, path },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.meta_description || post.excerpt || undefined,
      image: post.cover_image ? [post.cover_image] : undefined,
      datePublished: post.published_at || undefined,
      dateModified: post.updated_at || post.published_at || undefined,
      author: { '@type': 'Organization', name: post.author || DEFAULT_AUTHOR, url: SITE_URL },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.png` },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${path}` },
      articleSection: cat.name,
      keywords: (post.tags || []).join(', ') || undefined,
    },
  ];
  if (post.faq?.length) {
    ld.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  return (
    <div className="cv">
      <JsonLd data={ld} />
      <CvNav />

      <article className="cap-wrap cap-article">
        {/* ============ EN-TÊTE ============ */}
        <nav className="cap-bc">
          <Link href="/">Accueil</Link><span>›</span>
          <Link href="/blog">Blog</Link><span>›</span>
          <Link href={`/blog/${cat.slug}`}>{cat.name}</Link><span>›</span>
          <span className="cur">{post.title}</span>
        </nav>

        <header className="cap-article-head">
          <Link href={`/blog/${cat.slug}`} className={'cap-article-cat a-' + (cat.accent || 'teal')}>{cat.name}</Link>
          <h1>{post.title}</h1>
          {post.excerpt && <p className="cap-article-lede">{post.excerpt}</p>}
          <div className="cap-article-meta">
            <span>{post.author || DEFAULT_AUTHOR}</span><span>·</span>
            {post.published_at && <><span>{formatBlogDate(post.published_at)}</span><span>·</span></>}
            <span>{minutes} min de lecture</span>
          </div>
        </header>

        {post.cover_image && (
          <div className="cap-article-cover">
            <img src={post.cover_image} alt={post.cover_alt || post.title} />
          </div>
        )}

        {/* ============ CORPS + SIDEBAR ============ */}
        <div className="cap-article-layout">
          <div className="blog-prose" dangerouslySetInnerHTML={{ __html: post.content_html || '' }} />

          <aside className="cap-article-side">
            <div className="cap-article-side-card">
              <div className="cap-mono">— Sur le même thème</div>
              <Link href={`/blog/${cat.slug}`} className="cap-article-side-cat">{cat.name} →</Link>
              {(post.tags?.length ?? 0) > 0 && (
                <div className="cap-article-tags">
                  {post.tags!.map((t) => <span key={t} className="cap-links-tag">#{t}</span>)}
                </div>
              )}
            </div>
            <div className="cap-article-side-cta">
              <strong>Envie de vous lancer&nbsp;?</strong>
              <p>Trouvez un club de voile près de chez vous.</p>
              <Link href="/search">Trouver un club →</Link>
            </div>
          </aside>
        </div>

        {/* ============ FAQ ============ */}
        {post.faq?.length ? (
          <section className="cap-sec cap-article-faq">
            <div className="cap-mono">— Questions fréquentes</div>
            <h2 className="cap-h2" style={{ marginBottom: 22 }}>Bon à savoir</h2>
            <div className="faq-list">
              {post.faq.map((f, i) => (
                <details className="faq-item" key={i}>
                  <summary>{f.q}</summary>
                  <p dangerouslySetInnerHTML={{ __html: f.a }} />
                </details>
              ))}
            </div>
          </section>
        ) : null}
      </article>

      {/* ============ ARTICLES LIÉS ============ */}
      {related.length > 0 && (
        <section className="cap-wrap cap-sec">
          <div className="cap-mono">— À lire aussi</div>
          <h2 className="cap-h2" style={{ marginBottom: 26 }}>Dans le même cluster</h2>
          <div className="cap-bgrid">
            {related.map((p) => (
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
        </section>
      )}

      <CvFooter />
    </div>
  );
}
