import { cache } from 'react';
import { supabase } from './supabase';

export interface SeoContent {
  path: string;
  page_type?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  intro_html?: string | null;
  faq?: { q: string; a: string }[] | null;
}

/**
 * Lit le contenu SEO éditorial d'une page (table `seo_content`).
 * Renvoie null si absent ou si la table n'existe pas encore — les pages
 * retombent alors sur leurs templates par défaut.
 * Mis en cache par requête via React.cache (appelé en metadata + body).
 */
export const getSeoContent = cache(async (path: string): Promise<SeoContent | null> => {
  try {
    const { data, error } = await supabase
      .from('seo_content')
      .select('path, page_type, meta_title, meta_description, intro_html, faq')
      .eq('path', path)
      .eq('status', 'published')
      .maybeSingle();
    if (error) return null;
    return (data as SeoContent) || null;
  } catch {
    return null;
  }
});
