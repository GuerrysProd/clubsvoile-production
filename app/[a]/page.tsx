import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import '../home.css';
import CvNav from '../components/CvNav';
import CvFooter from '../components/CvFooter';
import { getGeoIndex } from '@/lib/clubsData';
import { ACTIVITIES } from '@/lib/activities';
import { slugify } from '@/lib/slug';
import ClubsMap from '../components/ClubsMap';

type Params = { a: string };

async function getPageData(params: Params) {
  const index = await getGeoIndex();

  const region = index.regions.get(params.a);
  if (region) return { type: 'region' as const, region };

  const activity = index.activities.get(params.a);
  if (activity) return { type: 'activity' as const, activity };

  // Activité canonique mais qu'aucun club n'a encore renseignée : on
  // affiche tout de même la page (vide) plutôt qu'un 404.
  const known = ACTIVITIES.find((act) => slugify(act.key) === params.a);
  if (known) return { type: 'activity' as const, activity: { name: known.key, cities: new Map() } };

  return null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const data = await getPageData(params);
  if (!data) return {};

  if (data.type === 'region') {
    return {
      title: `Clubs de voile en ${data.region.name} | ClubsVoile.fr`,
      description: `Annuaire des clubs de voile en ${data.region.name}. Trouvez votre club par département et par ville.`,
    };
  }

  return {
    title: `${data.activity.name} : où pratiquer en France | ClubsVoile.fr`,
    description: `Découvrez les clubs proposant le ${data.activity.name} en France, ville par ville.`,
  };
}

export default async function Page({ params }: { params: Params }) {
  const data = await getPageData(params);
  if (!data) notFound();

  if (data.type === 'region') {
    const { region } = data;
    const departments = Array.from(region.departments.entries()).sort((a, b) => a[1].name.localeCompare(b[1].name));

    return (
      <div className="cv">
        <CvNav />

        <header className="search-hero">
          <div className="wrap">
            <nav className="breadcrumb">
              <Link href="/">Accueil</Link>
            </nav>
            <span className="eyebrow">Annuaire ClubsVoile</span>
            <h1>Clubs de voile en <em>{region.name}</em></h1>
            <p className="lede">Découvrez les clubs de voile par département en {region.name}.</p>
          </div>
        </header>

        <section className="block">
          <div className="wrap">
            <div className="geo-grid">
              {departments.map(([deptSlug, department]) => {
                const count = Array.from(department.cities.values()).reduce((sum, c) => sum + c.clubs.length, 0);
                return (
                  <Link key={deptSlug} href={`/${params.a}/${deptSlug}`} className="geo-card">
                    <span className="name">{department.name}</span>
                    <span className="count">{count} club{count > 1 ? 's' : ''}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <CvFooter />
      </div>
    );
  }

  const { activity } = data;
  const cities = Array.from(activity.cities.entries()).sort((a, b) => a[1].name.localeCompare(b[1].name));
  const featured = Array.from(activity.cities.values())
    .flatMap((c) => c.clubs)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviewCount || 0) - (a.reviewCount || 0))
    .slice(0, 6);

  return (
    <div className="cv">
      <CvNav />

      <header className="search-hero">
        <div className="wrap">
          <nav className="breadcrumb">
            <Link href="/">Accueil</Link>
          </nav>
          <span className="eyebrow">Annuaire ClubsVoile</span>
          <h1>{activity.name} : <em>où pratiquer en France</em></h1>
          <p className="lede">Découvrez les villes où pratiquer le {activity.name}.</p>
        </div>
      </header>

      {featured.length > 0 && (
        <section className="block">
          <div className="wrap">
            <div className="sec-eyebrow">À l&apos;affiche</div>
            <h2 className="sec-title">Des clubs à découvrir pour le {activity.name}.</h2>
            <div className="search-grid">
              {featured.map((club) => (
                <Link key={club.id} href={club.path} className="result-card">
                  {!!club.rating && (
                    <span className="result-rate">
                      ★ {club.rating}
                      {club.reviewCount ? ` (${club.reviewCount} avis)` : ''}
                    </span>
                  )}
                  <h3>{club.name}</h3>
                  <div className="card-loc">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-6.3-7-11a7 7 0 0114 0c0 4.7-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
                    {club.cityName}
                  </div>
                  <div className="card-acts">
                    {club.activities.slice(0, 4).map((a: string) => (
                      <span key={a} className="pill">{a}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="block map-block">
        <div className="wrap">
          <div className="sec-eyebrow">La carte vivante</div>
          <h2 className="sec-title">{activity.name}, partout en France.</h2>
          <p className="sec-intro">Cliquez sur un marqueur pour découvrir le club et accéder à sa fiche.</p>
          {cities.length > 0 ? (
            <ClubsMap activity={activity.name} />
          ) : (
            <p className="lede">Aucun club ne propose encore cette activité pour le moment. <Link href="/admin/login">Inscrivez votre club</Link> pour être le premier référencé !</p>
          )}
        </div>
      </section>

      <CvFooter />
    </div>
  );
}
