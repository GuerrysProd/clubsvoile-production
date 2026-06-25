import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import '../../../../home.css';
import CvNav from '../../../../components/CvNav';
import CvFooter from '../../../../components/CvFooter';
import ClubDetailView from '../../../../components/ClubDetailView';
import JsonLd from '../../../../components/JsonLd';
import { supabase } from '@/lib/supabase';
import { getGeoIndex } from '@/lib/clubsData';
import { getClubGeo } from '@/lib/geo';
import { slugify } from '@/lib/slug';
import { pageMeta, breadcrumbLd, openingHoursLd, SITE_URL } from '@/lib/seo';

type Params = { a: string; b: string; c: string; d: string };

// ISR : fiche club mise en cache, régénérée au plus toutes les heures (crawl sécurisé).
export const revalidate = 3600;

async function getClub(params: Params) {
  const path = `/${params.a}/${params.b}/${params.c}/${params.d}`;
  const index = await getGeoIndex();
  const clubId = index.pathToClubId.get(path);
  if (!clubId) return null;

  const { data, error } = await supabase.from('clubs').select('*').eq('id', clubId).single();
  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const club = await getClub(params);
  if (!club) return {};

  const location = [club.city, club.region].filter(Boolean).join(', ');
  const activities = (club.activities || []).slice(0, 3).join(', ');

  return pageMeta({
    title: `${club.name} — Club de voile à ${club.city || location} | ClubsVoile.fr`,
    description:
      club.description ||
      `${club.name}, club de voile à ${location}.${activities ? ` Activités : ${activities}.` : ''}`,
    path: `/${params.a}/${params.b}/${params.c}/${params.d}`,
  });
}

export default async function ClubDetailPage({ params }: { params: Params }) {
  const club = await getClub(params);
  if (!club) notFound();

  const geo = getClubGeo(club);

  const index = await getGeoIndex();
  const activityLinks: Record<string, string> = {};
  for (const activityName of club.activities || []) {
    const activitySlug = slugify(activityName);
    if (index.activities.get(activitySlug)?.cities.has(geo.citySlug)) {
      activityLinks[activityName] = `/${activitySlug}/${geo.citySlug}`;
    }
  }

  const breadcrumb = (
    <nav className="breadcrumb">
      <Link href="/">Accueil</Link>
      <span>/</span>
      <Link href={`/${params.a}`}>{geo.regionName}</Link>
      <span>/</span>
      <Link href={`/${params.a}/${params.b}`}>{geo.departmentName}</Link>
      <span>/</span>
      <Link href={`/${params.a}/${params.b}/${params.c}`}>{geo.cityName}</Link>
    </nav>
  );

  const path = `/${params.a}/${params.b}/${params.c}/${params.d}`;
  const openingHours = openingHoursLd(club.schedule_open);
  const businessLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: club.name,
    url: `${SITE_URL}${path}`,
    ...(club.description ? { description: club.description } : {}),
    ...(club.logo_url || (club.photos && club.photos[0])
      ? { image: club.logo_url || club.photos[0] }
      : {}),
    ...(club.phone ? { telephone: club.phone } : {}),
    ...(club.email ? { email: club.email } : {}),
    ...(club.website ? { sameAs: [club.website] } : {}),
    address: {
      '@type': 'PostalAddress',
      ...(club.address ? { streetAddress: club.address } : {}),
      addressLocality: geo.cityName,
      ...(club.zip_code ? { postalCode: club.zip_code } : {}),
      addressRegion: geo.regionName,
      addressCountry: 'FR',
    },
    ...(typeof club.latitude === 'number' && typeof club.longitude === 'number'
      ? { geo: { '@type': 'GeoCoordinates', latitude: club.latitude, longitude: club.longitude } }
      : {}),
    ...(openingHours.length ? { openingHoursSpecification: openingHours } : {}),
    // Pas d'AggregateRating : les notes proviennent des fiches Google (avis
    // tiers, non collectés par le site). Le baliser violerait les consignes
    // Google sur les rich results (risque d'action manuelle). À réactiver le
    // jour où le site collecte ses propres avis first-party.
  };

  const crumbLd = breadcrumbLd([
    { name: 'Accueil', path: '/' },
    { name: geo.regionName, path: `/${params.a}` },
    { name: geo.departmentName, path: `/${params.a}/${params.b}` },
    { name: geo.cityName, path: `/${params.a}/${params.b}/${params.c}` },
    { name: club.name, path },
  ]);

  return (
    <div className="cv">
      <JsonLd data={[businessLd, crumbLd]} />
      <CvNav />
      <ClubDetailView club={club} breadcrumb={breadcrumb} activityLinks={activityLinks} />
      <CvFooter />
    </div>
  );
}
