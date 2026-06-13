import { NextResponse } from 'next/server';
import { getGeoIndex } from '@/lib/clubsData';
import { ACTIVITIES } from '@/lib/activities';
import { slugify } from '@/lib/slug';

export async function GET() {
  const index = await getGeoIndex();

  const regions = Array.from(index.regions.entries())
    .map(([slug, region]) => {
      const clubCount = Array.from(region.departments.values()).reduce(
        (sum, dept) => sum + Array.from(dept.cities.values()).reduce((s, c) => s + c.clubs.length, 0),
        0
      );
      return { slug, name: region.name, departments: region.departments.size, clubs: clubCount };
    })
    .filter((r) => r.slug !== 'france')
    .sort((a, b) => a.name.localeCompare(b.name));

  // Toutes les activités de la liste canonique, avec leurs compteurs réels
  // (0 si aucun club ne la propose encore) — pour que le footer et la page
  // /activites listent toujours l'ensemble des activités.
  const activities = ACTIVITIES
    .map((a) => {
      const slug = slugify(a.key);
      const entry = index.activities.get(slug);
      const clubCount = entry ? Array.from(entry.cities.values()).reduce((sum, c) => sum + c.clubs.length, 0) : 0;
      return { slug, name: a.key, cities: entry?.cities.size || 0, clubs: clubCount };
    })
    .sort((a, b) => b.clubs - a.clubs);

  return NextResponse.json({ regions, activities });
}
