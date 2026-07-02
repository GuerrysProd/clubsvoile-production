import { cache } from 'react';
import { supabase } from './supabase';

// ───────────────────────────────────────────────────────────────────────────
// Couche données du blog (modèle « topic cluster » SEO).
//
//   blog_categories  = les CLUSTERS (pages-piliers thématiques)
//   blog_posts       = les ARTICLES, rattachés à un cluster (category_id)
//
// URL : /blog  →  /blog/{cluster}  →  /blog/{cluster}/{slug}
//
// Toutes les lectures sont résilientes : si la table n'existe pas encore
// (migration non jouée) ou en cas d'erreur, on renvoie vide plutôt que de
// casser le site. L'écriture se fait côté n8n avec la clé service_role.
// ───────────────────────────────────────────────────────────────────────────

export const DEFAULT_AUTHOR = 'L’équipe ClubsVoile.fr';

export type BlogAccent = 'teal' | 'coral' | 'ink';

export interface BlogCategory {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  tagline: string | null;
  description: string | null;
  intro_html: string | null;
  meta_title: string | null;
  meta_description: string | null;
  accent: BlogAccent | null;
  icon: string | null;
  sort_order: number | null;
  updated_at: string | null;
}

export interface BlogPost {
  id: string;
  slug: string;
  category_id: string | null;
  title: string;
  excerpt: string | null;
  content_html: string | null;
  cover_image: string | null;
  cover_alt: string | null;
  author: string | null;
  meta_title: string | null;
  meta_description: string | null;
  tags: string[] | null;
  faq: { q: string; a: string }[] | null;
  reading_minutes: number | null;
  featured: boolean | null;
  status: string | null;
  published_at: string | null;
  updated_at: string | null;
  category?: BlogCategory | null;
}

const CATEGORY_COLS =
  'id, slug, name, title, tagline, description, intro_html, meta_title, meta_description, accent, icon, sort_order, updated_at';
const POST_LIST_COLS =
  'id, slug, category_id, title, excerpt, cover_image, cover_alt, author, tags, reading_minutes, featured, published_at, updated_at';
const POST_FULL_COLS =
  'id, slug, category_id, title, excerpt, content_html, cover_image, cover_alt, author, meta_title, meta_description, tags, faq, reading_minutes, featured, status, published_at, updated_at';

/** Estime un temps de lecture (≈200 mots/min) à partir d'un contenu HTML. */
export function readingMinutes(post: Pick<BlogPost, 'reading_minutes' | 'content_html' | 'excerpt'>): number {
  if (post.reading_minutes && post.reading_minutes > 0) return post.reading_minutes;
  const text = (post.content_html || post.excerpt || '').replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Date FR longue : « 12 mars 2026 ». */
export function formatBlogDate(iso?: string | null): string {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
  } catch {
    return '';
  }
}

/** Chemin canonique d'un article (a besoin du slug de son cluster). */
export function blogPostPath(post: Pick<BlogPost, 'slug'>, categorySlug: string): string {
  return `/blog/${categorySlug}/${post.slug}`;
}

/** Tous les clusters, triés (sort_order puis nom). */
export const getBlogCategories = cache(async (): Promise<BlogCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_categories')
      .select(CATEGORY_COLS)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });
    if (error) return [];
    return (data as BlogCategory[]) || [];
  } catch {
    return [];
  }
});

/** Un cluster par slug. */
export const getBlogCategory = cache(async (slug: string): Promise<BlogCategory | null> => {
  try {
    const { data, error } = await supabase.from('blog_categories').select(CATEGORY_COLS).eq('slug', slug).maybeSingle();
    if (error) return null;
    return (data as BlogCategory) || null;
  } catch {
    return null;
  }
});

/** Compte d'articles publiés par category_id (pour les compteurs des hubs). */
export const getPublishedCountByCategory = cache(async (): Promise<Map<string, number>> => {
  const counts = new Map<string, number>();
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('category_id')
      .eq('status', 'published');
    if (error || !data) return counts;
    for (const row of data as { category_id: string | null }[]) {
      if (row.category_id) counts.set(row.category_id, (counts.get(row.category_id) || 0) + 1);
    }
    return counts;
  } catch {
    return counts;
  }
});

/** Liste d'articles publiés (filtrable par cluster), du plus récent au plus ancien. */
export const getBlogPosts = cache(
  async (opts: { categoryId?: string; limit?: number; excludeId?: string; featuredFirst?: boolean } = {}): Promise<BlogPost[]> => {
    try {
      let q = supabase.from('blog_posts').select(POST_LIST_COLS).eq('status', 'published');
      if (opts.categoryId) q = q.eq('category_id', opts.categoryId);
      if (opts.excludeId) q = q.neq('id', opts.excludeId);
      if (opts.featuredFirst) q = q.order('featured', { ascending: false });
      q = q.order('published_at', { ascending: false, nullsFirst: false });
      if (opts.limit) q = q.limit(opts.limit);
      const { data, error } = await q;
      if (error) return [];
      return (data as BlogPost[]) || [];
    } catch {
      return [];
    }
  }
);

/** Un article publié par slug, avec son cluster joint. */
export const getBlogPost = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`${POST_FULL_COLS}, category:blog_categories(${CATEGORY_COLS})`)
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    if (error) return null;
    return (data as unknown as BlogPost) || null;
  } catch {
    return null;
  }
});

/** Tous les articles publiés (light) pour le sitemap, avec slug de cluster. */
export async function getAllBlogPostsForSitemap(): Promise<
  { slug: string; categorySlug: string; updated_at: string | null }[]
> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, category:blog_categories(slug)')
      .eq('status', 'published');
    if (error || !data) return [];
    return (data as unknown as { slug: string; updated_at: string | null; category: { slug: string } | null }[])
      .filter((p) => p.category?.slug)
      .map((p) => ({ slug: p.slug, categorySlug: p.category!.slug, updated_at: p.updated_at }));
  } catch {
    return [];
  }
}
