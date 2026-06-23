import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import '../../../home.css';
import CvNav from '../../../components/CvNav';
import CvFooter from '../../../components/CvFooter';
import JsonLd from '../../../components/JsonLd';
import { getGeoIndex } from '@/lib/clubsData';
import { getSeoContent } from '@/lib/seoContent';
import { ACTIVITIES } from '@/lib/activities';
import { slugify } from '@/lib/slug';
import { pageMeta, breadcrumbLd, itemListLd } from '@/lib/seo';

type Params = { a: string; b: string; c: string };

async function getCityData(params: Params) {
  const index = await getGeoIndex();
  const region = index.regions.get(params.a);
  if (!region) return null;
  const department = region.departments.get(params.b);
  if (!department) return null;
  const city = department.cities.get(params.c);
  if (!city) return null;

  const cityActivities = ACTIVITIES
    .map((act) => ({ name: act.key, slug: slugify(act.key) }))
    .filter((act) => index.activities.get(act.slug)?.cities.has(params.c));

  return { region, department, city, cityActivities };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const data = await getCityData(params);
  if (!data) return {};

  const path = `/${params.a}/${params.b}/${params.c}`;
  const seo = await getSeoContent(path);

  return pageMeta({
    title: seo?.meta_title || `Clubs de voile à ${data.city.name} | ClubsVoile.fr`,
    description:
      seo?.meta_description ||
      `Trouvez votre club de voile à ${data.city.name} (${data.department.name}, ${data.region.name}). ${data.city.clubs.length} club${data.city.clubs.length > 1 ? 's' : ''} référencé${data.city.clubs.length > 1 ? 's' : ''}.`,
    path,
  });
}

export default async function CityPage({ params }: { params: Params }) {
  const data = await getCityData(params);
  if (!data) notFound();

  const { region, department, city, cityActivities } = data;
  const path = `/${params.a}/${params.b}/${params.c}`;
  const seo = await getSeoContent(path);

  const cityLd: object[] = [
    breadcrumbLd([
      { name: 'Accueil', path: '/' },
      { name: region.name, path: `/${params.a}` },
      { name: department.name, path: `/${params.a}/${params.b}` },
      { name: city.name, path },
    ]),
    itemListLd(city.clubs.map((c) => ({ name: c.name, path: c.path }))),
  ];
  if (seo?.faq?.length) {
    cityLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: seo.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  return (
    <div className="cv">
      <JsonLd data={cityLd} />
      <CvNav />

      <header className="search-hero">
        <div className="wrap">
          <nav className="breadcrumb">
            <Link href="/">Accueil</Link>
            <span>/</span>
            <Link href={`/${params.a}`}>{region.name}</Link>
            <span>/</span>
            <Link href={`/${params.a}/${params.b}`}>{department.name}</Link>
          </nav>
          <span className="eyebrow">Annuaire ClubsVoile</span>
          <h1>Clubs de voile à <em>{city.name}</em></h1>
          <p className="lede">{city.clubs.length.toLocaleString('fr-FR')} club{city.clubs.length > 1 ? 's' : ''} de voile référencé{city.clubs.length > 1 ? 's' : ''} à {city.name}.</p>
        </div>
      </header>

      {seo?.intro_html && (
        <section className="block seo-block">
          <div className="wrap">
            <div className="seo-content" dangerouslySetInnerHTML={{ __html: seo.intro_html }} />
          </div>
        </section>
      )}

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

      {cityActivities.length > 0 && (
        <section className="block">
          <div className="wrap">
            <div className="sec-eyebrow">Par activité</div>
            <h2 className="sec-title">Pratiquer à {city.name}</h2>
            <div className="geo-grid">
              {cityActivities.map((act) => (
                <Link key={act.slug} href={`/${act.slug}/${params.c}`} className="geo-card">
                  <span className="name">{act.name} à {city.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CvFooter />
    </div>
  );
}
