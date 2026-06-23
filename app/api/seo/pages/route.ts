import { NextResponse } from 'next/server';
import { getGeoIndex } from '@/lib/clubsData';
import { supabase } from '@/lib/supabase';
import { ACTIVITIES } from '@/lib/activities';
import { slugify } from '@/lib/slug';

export const dynamic = 'force-dynamic';
// Jamais de cache : la liste des pages "manquantes" doit toujours refléter
// l'état réel de seo_content, sinon le workflow régénère des pages déjà faites.
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// Liens externes d'autorité proposés à Claude (il choisit les pertinents,
// il n'invente pas d'URL). Évite les liens cassés/hallucinés.
const EXTERNAL_LINKS = [
  { label: 'Fédération Française de Voile', url: 'https://www.ffvoile.fr/' },
  { label: 'Météo marine (Météo-France)', url: 'https://meteofrance.com/meteo-marine' },
];

type Ctx = { name: string; path: string };

/**
 * Alimente le workflow N8N de génération de contenu SEO.
 * GET /api/seo/pages?types=activity_city,city&onlyMissing=true&limit=500
 * Renvoie pour chaque page le contexte de liens internes + externes.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const types = (searchParams.get('types') || 'activity_city,city').split(',');
  const onlyMissing = searchParams.get('onlyMissing') !== 'false';
  const limit = Math.min(Number(searchParams.get('limit')) || 1000, 5000);

  const index = await getGeoIndex();

  // Pages déjà générées → à exclure si onlyMissing.
  // Pagination obligatoire : Supabase plafonne à 1000 lignes par requête.
  const done = new Set<string>();
  if (onlyMissing) {
    const PAGE = 1000;
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await supabase
        .from('seo_content')
        .select('path')
        .range(from, from + PAGE - 1);
      if (error || !data || data.length === 0) break;
      for (const r of data) done.add(r.path);
      if (data.length < PAGE) break;
    }
  }

  // Région/département pour une ville donnée (déduits du chemin d'un club).
  const cityGeoFromClubPath = (p: string) => {
    const [, regionSlug, deptSlug, citySlug] = p.split('/');
    return { regionSlug, deptSlug, citySlug };
  };

  // Index : pour chaque ville, les activités qui y sont proposées.
  const activitiesByCity = new Map<string, Ctx[]>();
  for (const [activitySlug, activity] of index.activities) {
    for (const [citySlug, city] of activity.cities) {
      const arr = activitiesByCity.get(citySlug) || [];
      arr.push({ name: `${activity.name} à ${city.name}`, path: `/${activitySlug}/${citySlug}` });
      activitiesByCity.set(citySlug, arr);
    }
  }

  const pages: any[] = [];

  // --- Pages activité × ville ---
  if (types.includes('activity_city')) {
    for (const [activitySlug, activity] of index.activities) {
      for (const [citySlug, city] of activity.cities) {
        const path = `/${activitySlug}/${citySlug}`;
        if (done.has(path)) continue;
        const sample = city.clubs[0]?.path;
        const geo = sample ? cityGeoFromClubPath(sample) : null;
        pages.push({
          path,
          page_type: 'activity_city',
          activity: activity.name,
          city: city.name,
          clubsCount: city.clubs.length,
          clubs: city.clubs.slice(0, 12).map((c) => ({ name: c.name, path: c.path })),
          internalLinks: {
            cityPage: geo ? { name: `Clubs de voile à ${city.name}`, path: `/${geo.regionSlug}/${geo.deptSlug}/${citySlug}` } : null,
            activityNational: { name: `${activity.name} en France`, path: `/${activitySlug}` },
            relatedActivities: (activitiesByCity.get(citySlug) || []).filter((a) => a.path !== path).slice(0, 6),
          },
          externalLinks: EXTERNAL_LINKS,
        });
        if (pages.length >= limit) return NextResponse.json({ count: pages.length, pages });
      }
    }
  }

  // --- Pages ville ---
  if (types.includes('city')) {
    for (const [regionSlug, region] of index.regions) {
      for (const [deptSlug, dept] of region.departments) {
        for (const [citySlug, city] of dept.cities) {
          const path = `/${regionSlug}/${deptSlug}/${citySlug}`;
          if (done.has(path)) continue;
          const siblings = Array.from(dept.cities.entries())
            .filter(([s]) => s !== citySlug)
            .slice(0, 6)
            .map(([s, c]) => ({ name: c.name, path: `/${regionSlug}/${deptSlug}/${s}` }));
          pages.push({
            path,
            page_type: 'city',
            city: city.name,
            department: dept.name,
            region: region.name,
            clubsCount: city.clubs.length,
            clubs: city.clubs.slice(0, 12).map((c) => ({ name: c.name, path: c.path })),
            internalLinks: {
              departmentPage: { name: `Clubs de voile en ${dept.name}`, path: `/${regionSlug}/${deptSlug}` },
              regionPage: { name: `Clubs de voile en ${region.name}`, path: `/${regionSlug}` },
              activitiesHere: (activitiesByCity.get(citySlug) || []).slice(0, 8),
              nearbyCities: siblings,
            },
            externalLinks: EXTERNAL_LINKS,
          });
          if (pages.length >= limit) return NextResponse.json({ count: pages.length, pages });
        }
      }
    }
  }

  // --- Pages département ---
  if (types.includes('department')) {
    for (const [regionSlug, region] of index.regions) {
      for (const [deptSlug, dept] of region.departments) {
        const path = `/${regionSlug}/${deptSlug}`;
        if (done.has(path)) continue;
        const cities = Array.from(dept.cities.entries());
        const clubsCount = cities.reduce((s, [, c]) => s + c.clubs.length, 0);
        pages.push({
          path,
          page_type: 'department',
          department: dept.name,
          region: region.name,
          clubsCount,
          internalLinks: {
            regionPage: { name: `Clubs de voile en ${region.name}`, path: `/${regionSlug}` },
            cities: cities.slice(0, 14).map(([s, c]) => ({ name: `Clubs de voile à ${c.name}`, path: `/${regionSlug}/${deptSlug}/${s}` })),
          },
          externalLinks: EXTERNAL_LINKS,
        });
        if (pages.length >= limit) return NextResponse.json({ count: pages.length, pages });
      }
    }
  }

  // --- Pages région ---
  if (types.includes('region')) {
    for (const [regionSlug, region] of index.regions) {
      const path = `/${regionSlug}`;
      if (done.has(path)) continue;
      const depts = Array.from(region.departments.entries());
      let clubsCount = 0;
      for (const [, d] of depts) for (const [, c] of d.cities) clubsCount += c.clubs.length;
      pages.push({
        path,
        page_type: 'region',
        region: region.name,
        clubsCount,
        internalLinks: {
          departments: depts.map(([s, d]) => ({ name: `Clubs de voile en ${d.name}`, path: `/${regionSlug}/${s}` })),
        },
        externalLinks: EXTERNAL_LINKS,
      });
      if (pages.length >= limit) return NextResponse.json({ count: pages.length, pages });
    }
  }

  return NextResponse.json({ count: pages.length, pages });
}
