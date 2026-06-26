import Link from 'next/link';
import '../home.css';
import CvNav from './CvNav';
import CvFooter from './CvFooter';
import JsonLd from './JsonLd';
import { getGeoIndex } from '@/lib/clubsData';
import { getSeoContent } from '@/lib/seoContent';
import { ACTIVITIES, activityLabel } from '@/lib/activities';
import { slugify } from '@/lib/slug';
import { breadcrumbLd, itemListLd } from '@/lib/seo';
import type { PillarConfig } from '@/lib/pillars';

const TOP_CITIES = 24;

const BENEFIT_ICONS: Record<PillarConfig['benefits'][number]['icon'], JSX.Element> = {
  progress: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h7l-1 8 10-12h-7z" /></svg>
  ),
  diploma: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
  ),
  ages: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20c0-3 2.5-5 6-5s6 2 6 5" /><path d="M16 14c2.5 0 5 1.5 5 5" /></svg>
  ),
};

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
  const totalClubs = regions.reduce((s, r) => s + r.clubs, 0);

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

      {/* ============ HERO ============ */}
      <section className="cap-wrap cap-pp-hero">
        <div>
          <div className="cap-pill"><span className="dot" />{config.eyebrow.toUpperCase()}</div>
          <h1>{config.h1}, <span className="accent">{config.h1Em}</span></h1>
          <p className="lede">{config.lede}</p>
          <div className="cap-pp-cta-row">
            <Link href="/search" className="primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
              Trouver un club
            </Link>
            <a href="#par-activite" className="ghost">Voir le maillage ↓</a>
          </div>
        </div>
        <div className="cap-pp-photo">
          <div className="cap-pp-photo-badge">
            <div className="l">{config.photoBadge.label}</div>
            <div className="v">{config.photoBadge.value}</div>
          </div>
        </div>
      </section>

      {/* ============ BÉNÉFICES ============ */}
      <section className="cap-wrap">
        <div className="cap-pp-benefits">
          {config.benefits.map((b) => (
            <div key={b.title} className="cap-pp-benefit">
              <div className="cap-pp-benefit-ic">{BENEFIT_ICONS[b.icon]}</div>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ INTRO ÉDITORIALE ============ */}
      <section className="block seo-block">
        <div className="cap-wrap">
          <div className="seo-content" dangerouslySetInnerHTML={{ __html: seo?.intro_html || config.introHtml }} />
        </div>
      </section>

      {/* ============ PROFILS ============ */}
      <section className="cap-wrap cap-sec">
        <div className="cap-mono">— À chacun son profil</div>
        <h2 className="cap-h2" style={{ marginBottom: 26 }}>Qui pratique <span className="accent accent-coral">la voile&nbsp;?</span></h2>
        <div className="cap-pp-profiles">
          {config.profiles.map((p, i) => (
            <div key={p.title} className={'cap-pp-profile' + (i === 0 ? ' is-first' : '')}>
              <div className="tag">{p.tag}</div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ MAILLAGE ============ */}
      <div id="par-activite" />
      {activities.length > 0 && (
        <section className="cap-wrap cap-sec">
          <div className="cap-mono">— Par activité</div>
          <h2 className="cap-h2" style={{ marginBottom: 26 }}>{config.activitiesTitle}</h2>
          <div className="geo-grid">
            {activities.map((a) => (
              <Link key={a.slug} href={`/${a.slug}`} className="geo-card">
                <span className="name">{a.name}</span>
                <span className="count">{a.clubs} club{a.clubs > 1 ? 's' : ''}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {regions.length > 0 && (
        <section className="cap-wrap cap-sec">
          <div className="cap-mono">— Par région</div>
          <h2 className="cap-h2" style={{ marginBottom: 26 }}>{config.regionsTitle}</h2>
          <div className="geo-grid">
            {regions.map((r) => (
              <Link key={r.slug} href={`/${r.slug}`} className="geo-card">
                <span className="name">{r.name}</span>
                <span className="count">{r.clubs} club{r.clubs > 1 ? 's' : ''}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {topCities.length > 0 && (
        <section className="cap-wrap cap-sec">
          <div className="cap-mono">— Par ville</div>
          <h2 className="cap-h2" style={{ marginBottom: 26 }}>{config.citiesTitle}</h2>
          <div className="geo-grid">
            {topCities.map((c) => (
              <Link key={c.path} href={c.path} className="geo-card">
                <span className="name">{c.name}</span>
                <span className="count">{c.clubs} club{c.clubs > 1 ? 's' : ''}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ============ FAQ (split sticky) ============ */}
      {faq?.length > 0 && (
        <section className="cap-wrap cap-sec cap-pp-faq">
          <div className="cap-pp-faq-side">
            <div className="cap-mono">— Questions fréquentes</div>
            <h2>On vous dit <span className="accent">tout.</span></h2>
            <p>Une autre question&nbsp;? Contactez-nous, on répond sous 24&nbsp;h.</p>
            <Link href="/contact">Nous contacter →</Link>
          </div>
          <div className="faq-list">
            {faq.map((f, i) => (
              <details className="faq-item" key={i}>
                <summary>{f.q}</summary>
                <p dangerouslySetInnerHTML={{ __html: f.a }} />
              </details>
            ))}
          </div>
        </section>
      )}

      {/* ============ CTA ============ */}
      <section className="cap-wrap" style={{ marginTop: 64, marginBottom: 16 }}>
        <div className="cap-pp-cta">
          <h2>Trouvez votre club <span className="accent">en quelques clics.</span></h2>
          <p>{totalClubs > 0 ? `${totalClubs.toLocaleString('fr-FR')} clubs référencés` : 'Des clubs référencés'} partout en France, avec leurs avis Google et leurs coordonnées.</p>
          <Link href="/search" className="cap-pp-cta-btn">Démarrer ma recherche →</Link>
        </div>
      </section>

      <CvFooter />
    </div>
  );
}
