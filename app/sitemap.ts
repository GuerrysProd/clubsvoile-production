import type { MetadataRoute } from 'next';
import { getGeoIndex } from '@/lib/clubsData';
import { supabase } from '@/lib/supabase';
import { ACTIVITIES } from '@/lib/activities';
import { slugify } from '@/lib/slug';
import { SITE_URL } from '@/lib/seo';

export const revalidate = 3600;

type Freq = MetadataRoute.Sitemap[number]['changeFrequency'];

// Charge une map clé → date de mise à jour (paginée : Supabase plafonne à 1000).
async function fetchUpdatedMap(table: string, keyCol: string): Promise<Map<string, Date>> {
  const map = new Map<string, Date>();
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase.from(table).select(`${keyCol}, updated_at`).range(from, from + PAGE - 1);
    if (error || !data || data.length === 0) break;
    for (const r of data as unknown as Record<string, string>[]) {
      if (r[keyCol] && r.updated_at) map.set(r[keyCol], new Date(r.updated_at));
    }
    if (data.length < PAGE) break;
  }
  return map;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const index = await getGeoIndex();
  const now = new Date();
  const [seoUpdated, clubUpdated] = await Promise.all([
    fetchUpdatedMap('seo_content', 'path'),
    fetchUpdatedMap('clubs', 'id'),
  ]);

  const entries: MetadataRoute.Sitemap = [];
  const add = (path: string, priority: number, lastModified: Date = now, changeFrequency: Freq = 'weekly') =>
    entries.push({ url: `${SITE_URL}${path}`, lastModified, changeFrequency, priority });

  // Pages statiques (date de build)
  add('/', 1.0, now, 'daily');
  add('/activites', 0.7, now, 'monthly');
  // Pages-piliers (têtes de requête commerciales)
  for (const p of ['/club-de-voile', '/ecole-de-voile', '/stage-de-voile']) {
    add(p, 0.8, seoUpdated.get(p) ?? now, 'weekly');
  }
  add('/contact', 0.5, now, 'yearly');
  add('/a-propos', 0.4, now, 'yearly');
  add('/mentions-legales', 0.2, now, 'yearly');
  add('/confidentialite', 0.2, now, 'yearly');

  // Pages activité (national)
  for (const a of ACTIVITIES) {
    const p = `/${slugify(a.key)}`;
    add(p, 0.8, seoUpdated.get(p) ?? now, 'weekly');
  }

  // Régions → départements → villes → fiches club
  for (const [regionSlug, region] of index.regions) {
    add(`/${regionSlug}`, 0.7, seoUpdated.get(`/${regionSlug}`) ?? now);
    for (const [deptSlug, dept] of region.departments) {
      const deptPath = `/${regionSlug}/${deptSlug}`;
      add(deptPath, 0.6, seoUpdated.get(deptPath) ?? now);
      for (const [citySlug, city] of dept.cities) {
        const cityPath = `/${regionSlug}/${deptSlug}/${citySlug}`;
        add(cityPath, 0.6, seoUpdated.get(cityPath) ?? now);
        for (const club of city.clubs) add(club.path, 0.7, clubUpdated.get(club.id) ?? now, 'monthly');
      }
    }
  }

  // Pages activité × ville
  for (const [activitySlug, activity] of index.activities) {
    for (const citySlug of activity.cities.keys()) {
      const p = `/${activitySlug}/${citySlug}`;
      add(p, 0.6, seoUpdated.get(p) ?? now);
    }
  }

  return entries;
}
