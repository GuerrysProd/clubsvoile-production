import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import '../../home.css';
import CvNav from '../../components/CvNav';
import CvFooter from '../../components/CvFooter';
import { getGeoIndex } from '@/lib/clubsData';

type Params = { a: string; b: string };

async function getPageData(params: Params) {
  const index = await getGeoIndex();

  const region = index.regions.get(params.a);
  if (region) {
    const department = region.departments.get(params.b);
    if (department) return { type: 'department' as const, region, department };
  }

  const activity = index.activities.get(params.a);
  if (activity) {
    const city = activity.cities.get(params.b);
    if (city) return { type: 'activity-city' as const, activity, city };
  }

  return null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const data = await getPageData(params);
  if (!data) return {};

  if (data.type === 'department') {
    return {
      title: `Clubs de voile en ${data.department.name} | ClubsVoile.fr`,
      description: `Annuaire des clubs de voile en ${data.department.name} (${data.region.name}). Trouvez votre club par ville.`,
    };
  }

  return {
    title: `${data.activity.name} à ${data.city.name} | ClubsVoile.fr`,
    description: `Pratiquez le ${data.activity.name} à ${data.city.name}. ${data.city.clubs.length} club${data.city.clubs.length > 1 ? 's' : ''} proposant cette activité.`,
  };
}

export default async function Page({ params }: { params: Params }) {
  const data = await getPageData(params);
  if (!data) notFound();

  if (data.type === 'department') {
    const { region, department } = data;
    const cities = Array.from(department.cities.entries()).sort((a, b) => a[1].name.localeCompare(b[1].name));

    return (
      <div className="cv">
        <CvNav />

        <header className="search-hero">
          <div className="wrap">
            <nav className="breadcrumb">
              <Link href="/">Accueil</Link>
              <span>/</span>
              <Link href={`/${params.a}`}>{region.name}</Link>
            </nav>
            <span className="eyebrow">Annuaire ClubsVoile</span>
            <h1>Clubs de voile en <em>{department.name}</em></h1>
            <p className="lede">Découvrez les clubs de voile par ville en {department.name}.</p>
          </div>
        </header>

        <section className="block">
          <div className="wrap">
            <div className="geo-grid">
              {cities.map(([citySlug, city]) => (
                <Link key={citySlug} href={`/${params.a}/${params.b}/${citySlug}`} className="geo-card">
                  <span className="name">{city.name}</span>
                  <span className="count">{city.clubs.length} club{city.clubs.length > 1 ? 's' : ''}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <CvFooter />
      </div>
    );
  }

  const { activity, city } = data;
  const cityPath = city.clubs[0]?.path.split('/').slice(0, -1).join('/');

  return (
    <div className="cv">
      <CvNav />

      <header className="search-hero">
        <div className="wrap">
          <nav className="breadcrumb">
            <Link href="/">Accueil</Link>
            <span>/</span>
            <Link href={`/${params.a}`}>{activity.name} en France</Link>
            {cityPath && (
              <>
                <span>/</span>
                <Link href={cityPath}>Clubs de voile à {city.name}</Link>
              </>
            )}
          </nav>
          <span className="eyebrow">Annuaire ClubsVoile</span>
          <h1>{activity.name} à <em>{city.name}</em></h1>
          <p className="lede">{city.clubs.length.toLocaleString('fr-FR')} club{city.clubs.length > 1 ? 's' : ''} proposant le {activity.name} à {city.name}.</p>
        </div>
      </header>

      <section className="block">
        <div className="wrap">
          <div className="search-grid">
            {city.clubs.map((club) => (
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
                  {city.name}
                </div>
                <div className="card-acts">
                  {(club.activities || []).slice(0, 4).map((a) => (
                    <span key={a} className="pill">{a}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CvFooter />
    </div>
  );
}
