import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import '../home.css';
import CvNav from '../components/CvNav';
import CvFooter from '../components/CvFooter';
import { getGeoIndex } from '@/lib/clubsData';
import { getSeoContent } from '@/lib/seoContent';
import { ACTIVITIES, activityLabel } from '@/lib/activities';
import { slugify } from '@/lib/slug';
import ClubsMap from '../components/ClubsMap';
import JsonLd from '../components/JsonLd';
import Faq from '../components/Faq';
import { pageMeta, breadcrumbLd, itemListLd } from '@/lib/seo';

type Params = { a: string };

// ISR : chaque page est mise en cache et régénérée au plus toutes les heures.
// Évite une requête Supabase à chaque hit de crawler sur les ~3000 pages.
export const revalidate = 3600;

// slug d'activité -> libellé affiché (pour le maillage région↔activité).
const ACTIVITY_NAME_BY_SLUG = new Map(
  ACTIVITIES.map((a) => [slugify(a.key), activityLabel(slugify(a.key), a.key)] as const)
);

async function getPageData(params: Params) {
  const index = await getGeoIndex();

  const region = index.regions.get(params.a);
  if (region) return { type: 'region' as const, region };

  const activity = index.activities.get(params.a);
  if (activity) return { type: 'activity' as const, activity };

  // Activité canonique mais qu'aucun club n'a encore renseignée : on
  // affiche tout de même la page (vide) plutôt qu'un 404.
  const known = ACTIVITIES.find((act) => slugify(act.key) === params.a);
  if (known) return { type: 'activity' as const, activity: { name: activityLabel(params.a, known.key), cities: new Map() } };

  return null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const data = await getPageData(params);
  if (!data) return {};

  const seo = await getSeoContent(`/${params.a}`);

  if (data.type === 'region') {
    return pageMeta({
      title: seo?.meta_title || `Clubs de voile en ${data.region.name} | ClubsVoile.fr`,
      description:
        seo?.meta_description ||
        `Annuaire des clubs de voile en ${data.region.name}. Trouvez votre club par département et par ville.`,
      path: `/${params.a}`,
    });
  }

  return pageMeta({
    title: seo?.meta_title || `${data.activity.name} : où pratiquer en France | ClubsVoile.fr`,
    description:
      seo?.meta_description ||
      `Découvrez les clubs proposant le ${data.activity.name} en France, ville par ville.`,
    path: `/${params.a}`,
  });
}

export default async function Page({ params }: { params: Params }) {
  const data = await getPageData(params);
  if (!data) notFound();

  if (data.type === 'region') {
    const { region } = data;
    const departments = Array.from(region.departments.entries()).sort((a, b) => a[1].name.localeCompare(b[1].name));
    const seo = await getSeoContent(`/${params.a}`);

    // Maillage région -> activité : activités réellement pratiquées dans la région.
    const actCount = new Map<string, number>();
    for (const [, dept] of region.departments)
      for (const [, city] of dept.cities)
        for (const club of city.clubs)
          for (const act of club.activities) {
            const s = slugify(act);
            if (ACTIVITY_NAME_BY_SLUG.has(s)) actCount.set(s, (actCount.get(s) || 0) + 1);
          }
    const regionActivities = Array.from(actCount.entries())
      .map(([slug, count]) => ({ slug, count, name: ACTIVITY_NAME_BY_SLUG.get(slug)! }))
      .sort((a, b) => b.count - a.count);

    const ld: object[] = [
      breadcrumbLd([
        { name: 'Accueil', path: '/' },
        { name: region.name, path: `/${params.a}` },
      ]),
      itemListLd(departments.map(([deptSlug, d]) => ({ name: d.name, path: `/${params.a}/${deptSlug}` }))),
    ];
    if (seo?.faq?.length) {
      ld.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: seo.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      });
    }

    return (
      <div className="cv">
        <JsonLd data={ld} />
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

        {seo?.intro_html && (
          <section className="block seo-block">
            <div className="wrap">
              <div className="seo-content" dangerouslySetInnerHTML={{ __html: seo.intro_html }} />
            </div>
          </section>
        )}

        <section className="block">
          <div className="wrap">
            <div className="sec-eyebrow">Par département</div>
            <h2 className="sec-title">Les clubs de voile en {region.name}, département par département.</h2>
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

        {regionActivities.length > 0 && (
          <section className="block">
            <div className="wrap">
              <div className="sec-eyebrow">Par activité</div>
              <h2 className="sec-title">Les activités nautiques pratiquées en {region.name}.</h2>
              <p className="sec-intro">Choisissez une discipline pour découvrir où la pratiquer partout en France.</p>
              <div className="geo-grid">
                {regionActivities.map((a) => (
                  <Link key={a.slug} href={`/${a.slug}`} className="geo-card">
                    <span className="name">{a.name}</span>
                    <span className="count">{a.count} club{a.count > 1 ? 's' : ''}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <Faq items={seo?.faq} />

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

  // Maillage activité -> région : régions où cette activité est proposée.
  const index = await getGeoIndex();
  const regionCount = new Map<string, number>();
  for (const [, c] of activity.cities)
    for (const club of c.clubs) {
      const rSlug = club.path.split('/')[1];
      if (rSlug && rSlug !== 'france') regionCount.set(rSlug, (regionCount.get(rSlug) || 0) + 1);
    }
  const activityRegions = Array.from(regionCount.entries())
    .map(([slug, count]) => ({ slug, count, name: index.regions.get(slug)?.name || slug }))
    .sort((a, b) => b.count - a.count);

  const activityLd = [
    breadcrumbLd([
      { name: 'Accueil', path: '/' },
      { name: activity.name, path: `/${params.a}` },
    ]),
    itemListLd(cities.map(([citySlug, c]) => ({ name: c.name, path: `/${params.a}/${citySlug}` }))),
  ];

  return (
    <div className="cv">
      <JsonLd data={activityLd} />
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
                      {club.reviewCount ? ` (${club.reviewCount} avis Google)` : ''}
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

      {cities.length > 0 && (
        <section className="block">
          <div className="wrap">
            <div className="sec-eyebrow">Par ville</div>
            <h2 className="sec-title">Où pratiquer le {activity.name} ?</h2>
            <p className="sec-intro">Choisissez une ville pour voir les clubs qui proposent le {activity.name}.</p>
            <div className="geo-grid">
              {cities.map(([citySlug, c]) => (
                <Link key={citySlug} href={`/${params.a}/${citySlug}`} className="geo-card">
                  <span className="name">{activity.name} à {c.name}</span>
                  <span className="count">{c.clubs.length} club{c.clubs.length > 1 ? 's' : ''}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {activityRegions.length > 0 && (
        <section className="block">
          <div className="wrap">
            <div className="sec-eyebrow">Par région</div>
            <h2 className="sec-title">Le {activity.name}, région par région.</h2>
            <p className="sec-intro">Explorez les clubs et écoles qui proposent le {activity.name} dans chaque région.</p>
            <div className="geo-grid">
              {activityRegions.map((r) => (
                <Link key={r.slug} href={`/${r.slug}`} className="geo-card">
                  <span className="name">{r.name}</span>
                  <span className="count">{r.count} club{r.count > 1 ? 's' : ''}</span>
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
            <p className="lede">Aucun club ne propose encore cette activité pour le moment. <Link href="/contact">Contactez-nous</Link> pour référencer le vôtre gratuitement et être le premier !</p>
          )}
        </div>
      </section>

      <CvFooter />
    </div>
  );
}
