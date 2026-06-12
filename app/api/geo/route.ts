import { NextResponse } from 'next/server';
import { getGeoIndex } from '@/lib/clubsData';

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

  const activities = Array.from(index.activities.entries())
    .map(([slug, activity]) => {
      const clubCount = Array.from(activity.cities.values()).reduce((sum, c) => sum + c.clubs.length, 0);
      return { slug, name: activity.name, cities: activity.cities.size, clubs: clubCount };
    })
    .sort((a, b) => b.clubs - a.clubs);

  return NextResponse.json({ regions, activities });
}
