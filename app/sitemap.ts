import type { MetadataRoute } from 'next';
import { getGeoIndex } from '@/lib/clubsData';
import { ACTIVITIES } from '@/lib/activities';
import { slugify } from '@/lib/slug';
import { SITE_URL } from '@/lib/seo';

// Régénéré côté serveur ; mis en cache via la revalidation de getGeoIndex.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const index = await getGeoIndex();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  const add = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'weekly',
  ) => entries.push({ url: `${SITE_URL}${path}`, lastModified: now, changeFrequency, priority });

  // Pages statiques
  add('/', 1.0, 'daily');
  add('/activites', 0.7, 'monthly');
  add('/contact', 0.5, 'yearly');
  add('/a-propos', 0.4, 'yearly');
  add('/mentions-legales', 0.2, 'yearly');
  add('/confidentialite', 0.2, 'yearly');

  // Pages activité (national)
  for (const a of ACTIVITIES) add(`/${slugify(a.key)}`, 0.8, 'weekly');

  // Régions → départements → villes → fiches club
  for (const [regionSlug, region] of index.regions) {
    add(`/${regionSlug}`, 0.7);
    for (const [deptSlug, dept] of region.departments) {
      add(`/${regionSlug}/${deptSlug}`, 0.6);
      for (const [citySlug, city] of dept.cities) {
        add(`/${regionSlug}/${deptSlug}/${citySlug}`, 0.6);
        for (const club of city.clubs) add(club.path, 0.7, 'monthly');
      }
    }
  }

  // Pages activité × ville
  for (const [activitySlug, activity] of index.activities) {
    for (const citySlug of activity.cities.keys()) {
      add(`/${activitySlug}/${citySlug}`, 0.6);
    }
  }

  return entries;
}
