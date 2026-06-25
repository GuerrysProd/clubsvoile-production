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

const SCHEDULE_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** Convertit une heure ("7:00 PM", "10:30 AM", "21:00", "9") en "HH:MM" 24h, ou null. */
function parseClock(t: string): string | null {
  const m = t.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = m[2] || '00';
  const ap = m[3] ? m[3].toUpperCase() : null;
  if (ap === 'AM' && h === 12) h = 0;
  else if (ap === 'PM' && h !== 12) h += 12;
  if (h > 23 || parseInt(min, 10) > 59) return null;
  return `${String(h).padStart(2, '0')}:${min}`;
}

/**
 * Convertit le champ `schedule_open` (format Google Places, ex.
 * "Monday:10:30 AM – 7:00 PM|Tuesday:9:00 AM – 12:00 PM, 2:00 PM – 6:00 PM|...")
 * en tableau JSON-LD `OpeningHoursSpecification` (schema.org/LocalBusiness).
 * Gère le 12h AM/PM comme le 24h, les plages multiples, et ignore les jours
 * fermés. Le champ stocke les jours en anglais.
 */
export function openingHoursLd(raw?: string | null) {
  if (!raw) return [];
  const specs: { '@type': 'OpeningHoursSpecification'; dayOfWeek: string; opens: string; closes: string }[] = [];
  for (const part of raw.split('|')) {
    const idx = part.indexOf(':');
    if (idx === -1) continue;
    const day = part.slice(0, idx).trim();
    if (!SCHEDULE_DAYS.includes(day)) continue;
    const hours = part.slice(idx + 1).replace(/[\u00a0\u202f\u2009]/g, ' ').trim();
    if (/closed|fermé|ferme/i.test(hours)) continue;
    if (/24\s*h(ours|eures|eures sur 24)?|24\/7/i.test(hours)) {
      specs.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: day, opens: '00:00', closes: '23:59' });
      continue;
    }
    for (const range of hours.split(',')) {
      const ends = range.split(/\s*[-–—]\s*|\s+to\s+|\s+à\s+/i);
      if (ends.length !== 2) continue;
      const opens = parseClock(ends[0]);
      const closes = parseClock(ends[1]);
      if (!opens || !closes) continue;
      specs.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: day, opens, closes });
    }
  }
  return specs;
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
