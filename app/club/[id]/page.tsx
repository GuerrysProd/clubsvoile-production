import { notFound, permanentRedirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { buildClubPath, buildClubSlugs } from '@/lib/geo';
import { getAllClubsForGeo } from '@/lib/clubsData';

export default async function ClubRedirectPage({ params }: { params: { id: string } }) {
  const { data: club, error } = await supabase
    .from('clubs')
    .select('id, name, city, region, department, zip_code')
    .eq('id', params.id)
    .single();

  if (error || !club) notFound();

  const allClubs = await getAllClubsForGeo();
  const slugs = buildClubSlugs(allClubs);
  const slug = slugs.get(club.id);
  if (!slug) notFound();

  permanentRedirect(buildClubPath(club, slug));
}
