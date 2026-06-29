import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import '../../../home.css';
import CvNav from '../../../components/CvNav';
import CvFooter from '../../../components/CvFooter';
import JsonLd from '../../../components/JsonLd';
import Faq from '../../../components/Faq';
import { getGeoIndex } from '@/lib/clubsData';
import { getSeoContent } from '@/lib/seoContent';
import { ACTIVITIES } from '@/lib/activities';
import { slugify } from '@/lib/slug';
import { pageMeta, breadcrumbLd, itemListLd } from '@/lib/seo';
import { supabase } from '@/lib/supabase';

type Params = { a: string; b: string; c: string };

// ISR : pages mises en cache, régénérées au plus toutes les heures (crawl sécurisé).
export const revalidate = 3600;

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

  const siblingCities = Array.from(department.cities.entries())
    .filter(([slug]) => slug !== params.c)
    .map(([slug, c]) => ({ slug, name: c.name }))
    .sort((x, y) => x.name.localeCompare(y.name))
    .slice(0, 4);

  const rated = city.clubs.filter((c) => !!c.rating);
  const avgRating = rated.length
    ? Math.round((rated.reduce((s, c) => s + (c.rating || 0), 0) / rated.length) * 10) / 10
    : null;

  // Coordonnées + photos réelles des clubs de la ville : bbox de la carte
  // calculée sur les points réels, et vignette de chaque carte résultat tirée
  // de la vraie première photo Google du club.
  const ids = city.clubs.map((c) => c.id);
  let coords: { latitude: number; longitude: number }[] = [];
  const photoById = new Map<string, string>();
  if (ids.length) {
    const { data } = await supabase.from('clubs').select('id, latitude, longitude, photos').in('id', ids);
    coords = (data || []).filter((c) => typeof c.latitude === 'number' && typeof c.longitude === 'number') as {
      latitude: number;
      longitude: number;
    }[];
    for (const c of data || []) {
      const p = (c.photos || [])[0];
      if (typeof p === 'string' && (p.startsWith('http') || p.startsWith('/api/photo'))) photoById.set(c.id, p);
    }
  }

  return { region, department, city, cityActivities, siblingCities, avgRating, coords, photoById };
}

function bboxMapUrl(coords: { latitude: number; longitude: number }[], pad = 0.04) {
  if (!coords.length) return null;
  const lats = coords.map((c) => c.latitude);
  const lngs = coords.map((c) => c.longitude);
  const minLat = Math.min(...lats) - pad;
  const maxLat = Math.max(...lats) + pad;
  const minLng = Math.min(...lngs) - pad;
  const maxLng = Math.max(...lngs) + pad;
  const marker = coords[0];
  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng},${minLat},${maxLng},${maxLat}&layer=mapnik&marker=${marker.latitude},${marker.longitude}`;
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

  const { region, department, city, cityActivities, siblingCities, avgRating, coords, photoById } = data;
  const path = `/${params.a}/${params.b}/${params.c}`;
  const seo = await getSeoContent(path);
  const mapUrl = bboxMapUrl(coords);

  const sortedClubs = [...city.clubs].sort((x, y) => (y.rating || 0) - (x.rating || 0));

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

      {/* ============ HERO GÉO ============ */}
      <header className="cap-geo-hero">
        <div className="cap-wrap cap-geo-hero-in">
          <div>
            <nav className="cap-bc">
              <Link href="/">Accueil</Link><span>›</span>
              <Link href={`/${params.a}`}>{region.name}</Link><span>›</span>
              <Link href={`/${params.a}/${params.b}`}>{department.name}</Link><span>›</span>
              <span className="cur">{city.name}</span>
            </nav>
            <div className="cap-geo-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-5.5-7-11a7 7 0 0114 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
              {department.name}
            </div>
            <h1>Clubs de voile à <span className="accent">{city.name}</span></h1>
            <p className="lede">{seo?.meta_description || `${city.clubs.length} club${city.clubs.length > 1 ? 's' : ''} et base${city.clubs.length > 1 ? 's' : ''} nautique${city.clubs.length > 1 ? 's' : ''} référencé${city.clubs.length > 1 ? 's' : ''} à ${city.name}. Comparez les activités, les avis et les coordonnées pour trouver votre club.`}</p>
            <div className="cap-geo-stats">
              <div className="cap-geo-stat"><div className="cap-geo-stat-n">{city.clubs.length}</div><div className="cap-geo-stat-l">club{city.clubs.length > 1 ? 's' : ''}</div></div>
              {avgRating && (
                <div className="cap-geo-stat"><div className="cap-geo-stat-n">★ {avgRating}</div><div className="cap-geo-stat-l">note moyenne</div></div>
              )}
              <div className="cap-geo-stat"><div className="cap-geo-stat-n">{cityActivities.length}</div><div className="cap-geo-stat-l">activité{cityActivities.length > 1 ? 's' : ''}</div></div>
            </div>
          </div>
          {mapUrl && (
            <div className="cap-geo-minimap">
              <iframe src={mapUrl} title={`Carte des clubs à ${city.name}`} loading="lazy" />
              <span className="cap-geo-minimap-badge">{city.clubs.length} club{city.clubs.length > 1 ? 's' : ''} sur la carte</span>
            </div>
          )}
        </div>
      </header>

      {/* ============ FILTER BAR ============ */}
      {cityActivities.length > 0 && (
        <div className="cap-filterbar">
          <div className="cap-wrap cap-filterbar-in">
            <span className="cap-fchip active">Toutes</span>
            {cityActivities.map((a) => (
              <Link key={a.slug} href={`/${a.slug}/${params.c}`} className="cap-fchip">{a.name}</Link>
            ))}
          </div>
        </div>
      )}

      {/* ============ RÉSULTATS ============ */}
      <div className="cap-wrap cap-city-layout cap-city-layout--full">
        <div>
          <div className="cap-city-count"><strong>{city.clubs.length} club{city.clubs.length > 1 ? 's' : ''}</strong> à {city.name} et alentours</div>
          <div className="cap-result-list">
            {sortedClubs.map((club, i) => (
              <Link key={club.id} href={club.path} className="cap-result">
                <div className="cap-result-img">
                  {photoById.get(club.id) && (
                    <Image src={photoById.get(club.id)!} alt={`${club.name}, club de voile à ${city.name}`} fill sizes="200px" style={{ objectFit: 'cover' }} />
                  )}
                  {i === 0 && <span className="cap-result-badge">Coup de cœur</span>}
                </div>
                <div className="cap-result-body">
                  <div className="cap-result-top">
                    <h3>{club.name}</h3>
                  </div>
                  <div className="cap-result-meta">
                    {!!club.rating && <span className="rate">★ {club.rating}</span>}
                    {!!club.reviewCount && <span>({club.reviewCount.toLocaleString('fr-FR')} avis)</span>}
                    <span>· {city.name}</span>
                  </div>
                  <div className="cap-result-acts">
                    <div className="cap-result-tags">
                      {(club.activities || []).slice(0, 3).map((a) => <span key={a} className="cap-result-tag">{a}</span>)}
                    </div>
                    <span className="cap-result-go">Voir la fiche →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {seo?.intro_html && (
        <section className="block seo-block">
          <div className="cap-wrap">
            <div className="seo-content" dangerouslySetInnerHTML={{ __html: seo.intro_html }} />

            <div className="cap-links-grid">
              {siblingCities.length > 0 && (
                <div>
                  <div className="cap-links-h">Villes voisines</div>
                  <div className="cap-links-tags">
                    {siblingCities.map((c) => (
                      <Link key={c.slug} href={`/${params.a}/${params.b}/${c.slug}`} className="cap-links-tag">{c.name}</Link>
                    ))}
                  </div>
                </div>
              )}
              {cityActivities.length > 0 && (
                <div>
                  <div className="cap-links-h">Activités à {city.name}</div>
                  <div className="cap-links-tags">
                    {cityActivities.slice(0, 6).map((a) => (
                      <Link key={a.slug} href={`/${a.slug}/${params.c}`} className="cap-links-tag">{a.name}</Link>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <div className="cap-links-h">Explorer plus loin</div>
                <div className="cap-links-tags">
                  <Link href={`/${params.a}/${params.b}`} className="cap-links-tag">{department.name}</Link>
                  <Link href={`/${params.a}`} className="cap-links-tag">{region.name}</Link>
                  <Link href="/stage-de-voile" className="cap-links-tag">Stage de voile</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Faq items={seo?.faq} />

      <CvFooter />
    </div>
  );
}
