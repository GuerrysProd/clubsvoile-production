import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import '../../../../home.css';
import CvNav from '../../../../components/CvNav';
import CvFooter from '../../../../components/CvFooter';
import ClubDetailView from '../../../../components/ClubDetailView';
import { supabase } from '@/lib/supabase';
import { getGeoIndex } from '@/lib/clubsData';
import { getClubGeo } from '@/lib/geo';
import { slugify } from '@/lib/slug';

type Params = { a: string; b: string; c: string; d: string };

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

  return {
    title: `${club.name} — Club de voile à ${club.city || location} | ClubsVoile.fr`,
    description:
      club.description ||
      `${club.name}, club de voile à ${location}.${activities ? ` Activités : ${activities}.` : ''}`,
  };
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

  return (
    <div className="cv">
      <CvNav />
      <ClubDetailView club={club} breadcrumb={breadcrumb} activityLinks={activityLinks} />
      <CvFooter />
    </div>
  );
}
