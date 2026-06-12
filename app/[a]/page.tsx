import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import '../home.css';
import CvNav from '../components/CvNav';
import CvFooter from '../components/CvFooter';
import { getGeoIndex } from '@/lib/clubsData';

type Params = { a: string };

async function getPageData(params: Params) {
  const index = await getGeoIndex();

  const region = index.regions.get(params.a);
  if (region) return { type: 'region' as const, region };

  const activity = index.activities.get(params.a);
  if (activity) return { type: 'activity' as const, activity };

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

  return (
    <div className="cv">
      <CvNav />

      <header className="search-hero">
        <div className="wrap">
          <span className="eyebrow">Annuaire ClubsVoile</span>
          <h1>{activity.name} : <em>où pratiquer en France</em></h1>
          <p className="lede">Découvrez les villes où pratiquer le {activity.name}.</p>
        </div>
      </header>

      <section className="block">
        <div className="wrap">
          <div className="geo-grid">
            {cities.map(([citySlug, city]) => (
              <Link key={citySlug} href={`/${params.a}/${citySlug}`} className="geo-card">
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
