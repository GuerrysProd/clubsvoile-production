import { FR_DEPARTMENTS } from './france-departments';
import { slugify } from './slug';
import { ACTIVITIES, activityLabel } from './activities';

export interface GeoClubInput {
  id: string;
  name: string;
  city?: string | null;
  region?: string | null;
  department?: string | null;
  zipCode?: string | null;
  zip_code?: string | null;
  activities?: string[] | null;
  rating?: number | null;
  reviewCount?: number | null;
  review_count?: number | null;
}

export interface ClubGeo {
  regionName: string;
  regionSlug: string;
  departmentName: string;
  departmentSlug: string;
  cityName: string;
  citySlug: string;
}

export function cleanCityName(city?: string | null): string {
  return (city || '').replace(/^\d{4,5}\s+/, '').trim();
}

export function getDeptCodeFromZip(zip?: string | null): string | null {
  if (!zip) return null;
  const z = zip.trim();
  if (/^97\d{3}$/.test(z) || /^98\d{3}$/.test(z)) return z.slice(0, 3);
  if (/^20\d{3}$/.test(z)) return z < '20200' ? '2A' : '2B';
  if (/^\d{5}$/.test(z)) return z.slice(0, 2);
  return null;
}

export function getClubGeo(club: GeoClubInput): ClubGeo {
  const zip = club.zipCode ?? club.zip_code ?? null;
  const deptCode = getDeptCodeFromZip(zip) || (club.department ? club.department.trim() : null);
  const deptInfo = deptCode ? FR_DEPARTMENTS[deptCode] : undefined;

  const regionName = deptInfo?.region || (club.region && club.region !== 'France' ? club.region : 'France');
  const departmentName = deptInfo?.name || (club.department || 'France');
  const cityName = cleanCityName(club.city) || regionName;

  return {
    regionName,
    regionSlug: slugify(regionName),
    departmentName,
    departmentSlug: slugify(departmentName),
    cityName,
    citySlug: slugify(cityName),
  };
}

/**
 * Slug par club, en gérant les doublons (deux clubs au même nom dans la
 * même ville) avec un suffixe -2, -3, ...
 */
export function buildClubSlugs(clubs: GeoClubInput[]): Map<string, string> {
  const result = new Map<string, string>();
  const seen = new Map<string, number>();

  for (const club of clubs) {
    const geo = getClubGeo(club);
    const base = slugify(club.name) || 'club';
    const key = `${geo.regionSlug}/${geo.departmentSlug}/${geo.citySlug}/${base}`;
    const count = (seen.get(key) || 0) + 1;
    seen.set(key, count);
    const slug = count === 1 ? base : `${base}-${count}`;
    result.set(club.id, slug);
  }

  return result;
}

export function buildClubPath(club: GeoClubInput, slug: string): string {
  const geo = getClubGeo(club);
  return `/${geo.regionSlug}/${geo.departmentSlug}/${geo.citySlug}/${slug}`;
}

export interface ClubLite {
  id: string;
  name: string;
  citySlug: string;
  cityName: string;
  path: string;
  rating?: number | null;
  reviewCount?: number | null;
  activities: string[];
}

export interface CityEntry {
  name: string;
  clubs: ClubLite[];
}

export interface DepartmentEntry {
  name: string;
  cities: Map<string, CityEntry>;
}

export interface RegionEntry {
  name: string;
  departments: Map<string, DepartmentEntry>;
}

export interface ActivityCityEntry {
  name: string;
  clubs: ClubLite[];
}

export interface ActivityEntry {
  name: string;
  cities: Map<string, ActivityCityEntry>;
}

export interface GeoIndex {
  regions: Map<string, RegionEntry>;
  activities: Map<string, ActivityEntry>;
  clubPaths: Map<string, string>;
  pathToClubId: Map<string, string>;
}

export function buildGeoIndex(clubs: GeoClubInput[]): GeoIndex {
  const slugs = buildClubSlugs(clubs);
  const regions: GeoIndex['regions'] = new Map();
  const activities: GeoIndex['activities'] = new Map();
  const clubPaths: GeoIndex['clubPaths'] = new Map();
  const pathToClubId: GeoIndex['pathToClubId'] = new Map();

  const activityNameBySlug = new Map(ACTIVITIES.map((a) => [slugify(a.key), activityLabel(slugify(a.key), a.key)]));

  for (const club of clubs) {
    const geo = getClubGeo(club);
    const slug = slugs.get(club.id)!;
    const path = `/${geo.regionSlug}/${geo.departmentSlug}/${geo.citySlug}/${slug}`;

    clubPaths.set(club.id, path);
    pathToClubId.set(path, club.id);

    const lite: ClubLite = {
      id: club.id,
      name: club.name,
      citySlug: geo.citySlug,
      cityName: geo.cityName,
      path,
      rating: club.rating,
      reviewCount: club.reviewCount ?? club.review_count,
      activities: club.activities || [],
    };

    let region = regions.get(geo.regionSlug);
    if (!region) {
      region = { name: geo.regionName, departments: new Map() };
      regions.set(geo.regionSlug, region);
    }

    let department = region.departments.get(geo.departmentSlug);
    if (!department) {
      department = { name: geo.departmentName, cities: new Map() };
      region.departments.set(geo.departmentSlug, department);
    }

    let city = department.cities.get(geo.citySlug);
    if (!city) {
      city = { name: geo.cityName, clubs: [] };
      department.cities.set(geo.citySlug, city);
    }
    city.clubs.push(lite);

    for (const activityKey of club.activities || []) {
      const activitySlug = slugify(activityKey);
      if (!activityNameBySlug.has(activitySlug)) continue;

      let activity = activities.get(activitySlug);
      if (!activity) {
        activity = { name: activityNameBySlug.get(activitySlug)!, cities: new Map() };
        activities.set(activitySlug, activity);
      }

      let actCity = activity.cities.get(geo.citySlug);
      if (!actCity) {
        actCity = { name: geo.cityName, clubs: [] };
        activity.cities.set(geo.citySlug, actCity);
      }
      actCity.clubs.push(lite);
    }
  }

  return { regions, activities, clubPaths, pathToClubId };
}
