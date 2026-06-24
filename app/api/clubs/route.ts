import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { buildClubSlugs, buildClubPath } from '@/lib/geo';

// ISR : la liste des clubs est mise en cache et régénérée au plus toutes
// les 5 min. Évite de recharger ~1300 clubs depuis Supabase + recalculer les
// slugs à chaque visite (cause des 503 et d'un TTFB élevé). Les mises à jour
// d'activités/description apparaissent avec un délai max de 5 min.
export const revalidate = 300;

export async function GET() {
  try {
    const PAGE_SIZE = 1000;
    const data: any[] = [];
    let total = 0;

    for (let from = 0; from < 1300; from += PAGE_SIZE) {
      const { data: page, count, error } = await supabase
        .from('clubs')
        .select(`
          id,
          name,
          city,
          region,
          department,
          address,
          zip_code,
          phone,
          email,
          website,
          google_maps_url,
          logo_url,
          description,
          activities,
          latitude,
          longitude,
          rating,
          review_count,
          schedule_open
        `, { count: 'exact' })
        .range(from, from + PAGE_SIZE - 1);

      if (error) throw error;

      data.push(...(page || []));
      total = count || 0;
      if (!page || page.length < PAGE_SIZE || data.length >= total) break;
    }

    const slugs = buildClubSlugs(data);

    const clubs = data.map((c) => ({
      id: c.id,
      name: c.name,
      city: c.city,
      region: c.region,
      department: c.department,
      address: c.address,
      zipCode: c.zip_code,
      phone: c.phone,
      email: c.email,
      website: c.website,
      googleMapsUrl: c.google_maps_url,
      logo: c.logo_url,
      description: c.description,
      activities: c.activities || [],
      latitude: c.latitude,
      longitude: c.longitude,
      rating: c.rating,
      reviewCount: c.review_count,
      scheduleOpen: c.schedule_open,
      path: buildClubPath(c, slugs.get(c.id)!),
    }));

    return NextResponse.json({ clubs, total });
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return NextResponse.json({ clubs: [], total: 0 }, { status: 500 });
  }
}