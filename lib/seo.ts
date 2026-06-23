import type { Metadata } from 'next';

export const SITE_URL = 'https://clubsvoile.fr';
export const SITE_NAME = 'ClubsVoile.fr';

/**
 * Construit les métadonnées d'une page (title, description, canonical,
 * OpenGraph, Twitter) de façon homogène sur tout le site.
 * `path` est le chemin absolu de la page (sert de canonical + og:url).
 */
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const { title, description, path } = opts;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      siteName: SITE_NAME,
      url: path,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

type Crumb = { name: string; path: string };

/** JSON-LD BreadcrumbList à partir d'un fil d'ariane. */
export function breadcrumbLd(items: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}

/** JSON-LD ItemList (listes de clubs / zones), bon pour les pages d'annuaire. */
export function itemListLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: `${SITE_URL}${it.path}`,
    })),
  };
}
