import Link from 'next/link';
import '../home.css';
import CvNav from './CvNav';
import CvFooter from './CvFooter';
import JsonLd from './JsonLd';
import Faq from './Faq';
import { getGeoIndex } from '@/lib/clubsData';
import { getSeoContent } from '@/lib/seoContent';
import { ACTIVITIES, activityLabel } from '@/lib/activities';
import { slugify } from '@/lib/slug';
import { breadcrumbLd, itemListLd } from '@/lib/seo';
import type { PillarConfig } from '@/lib/pillars';

const TOP_CITIES = 24;

export default async function PillarPage({ config }: { config: PillarConfig }) {
  const index = await getGeoIndex();
  const seo = await getSeoContent(`/${config.slug}`);

  // Activités réellement proposées (compteur national), pour le maillage descendant.
  const activities = ACTIVITIES.map((a) => {
    const slug = slugify(a.key);
    const entry = index.activities.get(slug);
    const clubs = entry ? Array.from(entry.cities.values()).reduce((s, c) => s + c.clubs.length, 0) : 0;
    return { slug, name: activityLabel(slug, a.key), clubs };
  })
    .filter((a) => a.clubs > 0)
    .sort((a, b) => b.clubs - a.clubs);

  // Régions avec leur nombre de clubs.
  const regions = Array.from(index.regions.entries())
    .filter(([s]) => s !== 'france')
    .map(([slug, r]) => ({
      slug,
      name: r.name,
      clubs: Array.from(r.departments.values()).reduce(
        (sum, d) => sum + Array.from(d.cities.values()).reduce((s, c) => s + c.clubs.length, 0),
        0
      ),
    }))
    .sort((a, b) => b.clubs - a.clubs);

  // Top villes par nombre de clubs (le chemin du hub ville est dérivé d'un club).
  const cityAgg = new Map<string, { name: string; clubs: number; path: string }>();
  for (const [, region] of index.regions)
    for (const [, dept] of region.departments)
      for (const [, city] of dept.cities) {
        if (!city.clubs.length) continue;
        const hubPath = city.clubs[0].path.split('/').slice(0, 4).join('/');
        const prev = cityAgg.get(hubPath);
        cityAgg.set(hubPath, { name: city.name, clubs: (prev?.clubs || 0) + city.clubs.length, path: hubPath });
      }
  const topCities = Array.from(cityAgg.values())
    .sort((a, b) => b.clubs - a.clubs)
    .slice(0, TOP_CITIES);

  const faq = seo?.faq?.length ? seo.faq : config.faq;

  const ld: object[] = [
    breadcrumbLd([
      { name: 'Accueil', path: '/' },
      { name: config.h1, path: `/${config.slug}` },
    ]),
    itemListLd(regions.map((r) => ({ name: r.name, path: `/${r.slug}` }))),
  ];
  if (faq?.length) {
    ld.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
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
          <span className="eyebrow">{config.eyebrow}</span>
          <h1>{config.h1} <em>{config.h1Em}</em></h1>
          <p className="lede">{config.lede}</p>
        </div>
      </header>

      <section className="block seo-block">
        <div className="wrap">
          <div className="seo-content" dangerouslySetInnerHTML={{ __html: seo?.intro_html || config.introHtml }} />
        </div>
      </section>

      {activities.length > 0 && (
        <section className="block">
          <div className="wrap">
            <div className="sec-eyebrow">Par activité</div>
            <h2 className="sec-title">{config.activitiesTitle}</h2>
            <div className="geo-grid">
              {activities.map((a) => (
                <Link key={a.slug} href={`/${a.slug}`} className="geo-card">
                  <span className="name">{a.name}</span>
                  <span className="count">{a.clubs} club{a.clubs > 1 ? 's' : ''}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {regions.length > 0 && (
        <section className="block">
          <div className="wrap">
            <div className="sec-eyebrow">Par région</div>
            <h2 className="sec-title">{config.regionsTitle}</h2>
            <div className="geo-grid">
              {regions.map((r) => (
                <Link key={r.slug} href={`/${r.slug}`} className="geo-card">
                  <span className="name">{r.name}</span>
                  <span className="count">{r.clubs} club{r.clubs > 1 ? 's' : ''}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {topCities.length > 0 && (
        <section className="block">
          <div className="wrap">
            <div className="sec-eyebrow">Par ville</div>
            <h2 className="sec-title">{config.citiesTitle}</h2>
            <div className="geo-grid">
              {topCities.map((c) => (
                <Link key={c.path} href={c.path} className="geo-card">
                  <span className="name">{c.name}</span>
                  <span className="count">{c.clubs} club{c.clubs > 1 ? 's' : ''}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Faq items={faq} />

      <CvFooter />
    </div>
  );
}
