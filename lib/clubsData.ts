import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { supabase } from './supabase';
import { buildGeoIndex, type GeoClubInput } from './geo';

const PAGE_SIZE = 1000;

async function fetchAllClubsForGeo(): Promise<GeoClubInput[]> {
  const clubs: GeoClubInput[] = [];
  let total = 0;
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, count, error } = await supabase
      .from('clubs')
      .select('id, name, city, region, department, zip_code, activities, rating, review_count', { count: 'exact' })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw error;

    clubs.push(...(data || []));
    total = count || 0;
    if (!data || data.length < PAGE_SIZE || clubs.length >= total) break;
  }
  return clubs;
}

// Cache cross-requêtes (les résultats sont sérialisables en JSON).
export const getAllClubsForGeo = unstable_cache(fetchAllClubsForGeo, ['clubs-for-geo'], {
  revalidate: 1800,
});

// L'index contient des Map (non sérialisables) : on le reconstruit à
// chaque requête à partir de la liste mise en cache ci-dessus, en ne le
// calculant qu'une fois par requête grâce à React.cache.
export const getGeoIndex = cache(async () => buildGeoIndex(await getAllClubsForGeo()));
