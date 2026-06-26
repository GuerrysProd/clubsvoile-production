'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import './home.css';
import CvNav from './components/CvNav';
import CvFooter from './components/CvFooter';
import ActivityIcons from './components/ActivityIcons';
import { ACTIVITIES } from '@/lib/activities';
import { slugify } from '@/lib/slug';
import FranceRegionMap, { type GeoRegion } from './components/FranceRegionMap';

/* ----------------------------- DONNÉES ----------------------------- */
const SUPPORTS = ACTIVITIES.map((a) => ({ k: a.key, ic: a.icon, d: a.description, trend: a.trend }));

const GEO: Record<string, Record<string, string[]>> = {
  'Hauts-de-France': { Nord: ['Dunkerque', 'Gravelines'], 'Pas-de-Calais': ['Calais', 'Boulogne-sur-Mer', 'Le Touquet'] },
  Normandie: { 'Seine-Maritime': ['Le Havre', 'Dieppe', 'Fécamp'], Calvados: ['Deauville', 'Ouistreham', 'Honfleur'], Manche: ['Cherbourg', 'Granville'] },
  Bretagne: { 'Ille-et-Vilaine': ['Saint-Malo', 'Dinard'], "Côtes-d'Armor": ['Paimpol', 'Perros-Guirec'], Finistère: ['Brest', 'Concarneau', 'Douarnenez'], Morbihan: ['Lorient', 'Vannes', 'Quiberon', 'Carnac'] },
  'Pays de la Loire': { 'Loire-Atlantique': ['La Baule', 'Pornic', 'Saint-Nazaire'], Vendée: ["Les Sables-d'Olonne", 'Saint-Gilles-Croix-de-Vie', 'Noirmoutier'] },
  'Nouvelle-Aquitaine': { 'Charente-Maritime': ['La Rochelle', 'Royan', 'Île de Ré'], Gironde: ['Arcachon', 'Lacanau'], Landes: ['Hossegor', 'Capbreton'], 'Pyrénées-Atlantiques': ['Biarritz', 'Saint-Jean-de-Luz', 'Hendaye'] },
  Occitanie: { Hérault: ['Sète', 'Agde', 'Palavas-les-Flots'], Aude: ['Gruissan', 'Port-la-Nouvelle'], 'Pyrénées-Orientales': ['Canet-en-Roussillon', 'Argelès-sur-Mer', 'Collioure'], Gard: ['Le Grau-du-Roi'] },
  "Provence-Alpes-Côte d'Azur": { 'Bouches-du-Rhône': ['Marseille', 'Cassis', 'La Ciotat'], Var: ['Toulon', 'Hyères', 'Saint-Tropez', 'Fréjus'], 'Alpes-Maritimes': ['Nice', 'Antibes', 'Cannes', 'Menton'] },
  Corse: { 'Corse-du-Sud': ['Ajaccio', 'Porto-Vecchio', 'Bonifacio'], 'Haute-Corse': ['Bastia', 'Calvi', 'Saint-Florent'] },
};

const CENTERS: Record<string, [number, number]> = {
  'Hauts-de-France': [50.9, 1.9], Normandie: [49.5, -0.5], Bretagne: [48.2, -3.5], 'Pays de la Loire': [47, -2],
  'Nouvelle-Aquitaine': [45, -1.1], Occitanie: [43.2, 3.2], "Provence-Alpes-Côte d'Azur": [43.3, 6.2], Corse: [42.1, 9.1],
};

type GeoClub = {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  activities: string[];
  rating?: number;
  reviewCount?: number;
  scheduleOpen?: string;
  path?: string;
};

const DAYS_FR: Record<string, string> = {
  Monday: 'Lundi', Tuesday: 'Mardi', Wednesday: 'Mercredi', Thursday: 'Jeudi',
  Friday: 'Vendredi', Saturday: 'Samedi', Sunday: 'Dimanche',
};
const TODAY_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];

function todayHours(raw?: string) {
  if (!raw) return null;
  const part = raw.split('|').find((p) => p.trim().startsWith(TODAY_EN));
  if (!part) return null;
  const hours = part.split(':').slice(1).join(':').trim();
  return hours || null;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c));
}

// Sélection éditoriale « À l'affiche » (ordre conservé).
const FEATURED_IDS = [
  '1faeecf6-3254-4f73-9a61-4962189a0709', // Club la Pelle — Marseille
  'a0d89e7a-a301-47bc-ab96-acebf9f47889', // Yacht Club de Toulon
  'ed884b45-40b7-46e0-8e96-20de8670ea87', // Centre Nautique de Brest
  '258fa8ba-0d39-4035-8508-d07e7b6d45a8', // Cannes Jeunesse — Base du Mourre Rouge
  'b045ab42-2b9b-4bc7-9d0c-a6d11c7b2f9e', // Ecole de Voile Courseulles-sur-Mer
  'e8d04a71-5ad7-4b3c-b3e9-a9bd4365c25b', // eFoil Sanguinet
];

function getInitials(name: string) {
  return (name || '')
    .replace(/[^A-Za-zÀ-ÿ ]/g, ' ')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');
}

/* ----------------------------- COMPOSANT ----------------------------- */
export default function HomePage() {
  const [sup, setSup] = useState('');
  const [region, setRegion] = useState('');
  const [dep, setDep] = useState('');
  const [city, setCity] = useState('');
  const [count, setCount] = useState(0);
  const [clubs, setClubs] = useState<GeoClub[]>([]);
  const [geoRegions, setGeoRegions] = useState<GeoRegion[]>([]);
  const [geoActivities, setGeoActivities] = useState<{ slug: string; name: string; clubs: number }[]>([]);

  const mapRef = useRef<any>(null);
  const clusterRef = useRef<any>(null);
  const readyRef = useRef(false);
  const clubsRef = useRef<GeoClub[]>([]);

  useEffect(() => {
    fetch('/api/clubs')
      .then(res => res.json())
      .then(data => {
        const geo: GeoClub[] = (data.clubs || [])
          .filter((c: any) => typeof c.latitude === 'number' && typeof c.longitude === 'number')
          .map((c: any) => ({
            id: c.id,
            name: c.name,
            city: c.city,
            lat: c.latitude,
            lng: c.longitude,
            activities: c.activities || [],
            rating: c.rating,
            reviewCount: c.reviewCount,
            scheduleOpen: c.scheduleOpen,
            path: c.path,
          }));
        clubsRef.current = geo;
        setClubs(geo);
        if (readyRef.current) renderMarkers(sup);

        const tgt = data.total || geo.length;
        let cur = 0;
        const t = setInterval(() => { cur += Math.max(1, Math.ceil(tgt / 34)); if (cur >= tgt) { cur = tgt; clearInterval(t); } setCount(cur); }, 22);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch('/api/geo')
      .then((res) => res.json())
      .then((data) => {
        setGeoRegions(data.regions || []);
        setGeoActivities(data.activities || []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const target = document.getElementById('cv-map');
    if (!target) return;

    let cancelled = false;
    let started = false;

    const addCss = (href: string) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; document.head.appendChild(l);
    };

    const loadScript = (src: string) => new Promise<void>((res) => {
      const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
      if (existing) {
        if (existing.dataset.loaded) return res();
        existing.addEventListener('load', () => res());
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => { s.dataset.loaded = '1'; res(); };
      document.body.appendChild(s);
    });

    // Charge Leaflet + initialise la carte uniquement quand la section
    // approche du viewport (lazy-load → LCP/INP de l'accueil préservés).
    const initMap = async () => {
      if (started) return;
      started = true;
      addCss('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css');
      addCss('https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.min.css');
      addCss('https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.Default.min.css');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/leaflet.markercluster.min.js');
      if (cancelled) return;
      const L = (window as any).L;
      if (!L || mapRef.current) return;
      const map = L.map('cv-map', { scrollWheelZoom: false }).setView([46.6, 2.2], 5.4);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '© OpenStreetMap © CARTO', subdomains: 'abcd', maxZoom: 19 }).addTo(map);
      const cluster = L.markerClusterGroup({
        maxClusterRadius: 55, showCoverageOnHover: false,
        iconCreateFunction: (c: any) => L.divIcon({ html: '<div>' + c.getChildCount() + '</div>', className: 'marker-cluster marker-cluster-cv', iconSize: [40, 40] }),
      });
      map.addLayer(cluster);
      map.on('click', () => map.scrollWheelZoom.enable());
      mapRef.current = map; clusterRef.current = cluster; readyRef.current = true;
      renderMarkers('');
    };

    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); initMap(); }
    }, { rootMargin: '300px' });
    io.observe(target);

    return () => { cancelled = true; io.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderMarkers = (filter: string) => {
    const L = (window as any).L;
    const cluster = clusterRef.current;
    if (!L || !cluster) return;
    cluster.clearLayers();
    const dot = L.divIcon({ html: '<div style="width:14px;height:14px;background:#FF5436;border:2.5px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>', className: '', iconSize: [14, 14] });
    clubsRef.current.forEach((c) => {
      if (filter && !c.activities.includes(filter)) return;

      const rateHtml = c.rating
        ? '<span class="pop-rate">★ ' + c.rating.toFixed(1)
          + (c.reviewCount ? ' <span class="pop-reviews">(' + c.reviewCount + ' avis Google)</span>' : '') + '</span>'
        : '';

      const hours = todayHours(c.scheduleOpen);
      const hoursHtml = hours ? '<span class="pop-hours">' + "Aujourd'hui : " + hours + '</span>' : '';

      const actsHtml = c.activities.length
        ? '<span class="pop-acts">' + c.activities.join(' · ') + '</span>'
        : '';

      const href = c.path || ('/club/' + c.id);
      const html = '<div class="cv-pop">'
        + '<a class="pop-name" href="' + href + '">' + escapeHtml(c.name) + '</a>'
        + rateHtml + actsHtml + hoursHtml
        + '<a class="pop-cta" href="' + href + '">Voir la fiche du club →</a>'
        + '</div>';

      L.marker([c.lat, c.lng], { icon: dot }).bindPopup(html).addTo(cluster);
    });
  };

  useEffect(() => { if (readyRef.current) renderMarkers(sup); /* eslint-disable-next-line */ }, [sup]);

  const visibleCount = sup ? clubs.filter(c => c.activities.includes(sup)).length : clubs.length;

  // Sélection éditoriale « À l'affiche » (par identifiant), avec données à jour.
  const featured = useMemo(() => {
    const byId = new Map(clubs.map((c) => [c.id, c]));
    return FEATURED_IDS.map((id) => byId.get(id)).filter(Boolean) as GeoClub[];
  }, [clubs]);

  // Compteurs réels par activité (pour les cartes « Explorez par activité »).
  const topActs = useMemo(() => {
    const cnt = new Map(geoActivities.map((a) => [a.slug, a.clubs]));
    return SUPPORTS
      .map((s) => ({ ...s, slug: slugify(s.k), count: cnt.get(slugify(s.k)) || 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [geoActivities]);

  const topRegions = useMemo(
    () => [...geoRegions].sort((a, b) => b.clubs - a.clubs).slice(0, 6),
    [geoRegions]
  );

  const chooseRegion = (r: string) => {
    setRegion(r); setDep(''); setCity('');
    if (r && mapRef.current && CENTERS[r]) mapRef.current.flyTo(CENTERS[r], 8, { duration: 1.1 });
  };
  const voirLesClubs = () => {
    const clean = (s?: string) => (s || '').replace(/^\d{4,5}\s+/, '').trim().toLowerCase();
    const cityClubs = city ? clubs.filter((c) => clean(c.city) === city.toLowerCase()) : [];
    let target = '';

    if (sup && city) {
      // Activité × ville : seulement si un club de cette ville propose l'activité.
      const m = cityClubs.find((c) => (c.activities || []).includes(sup) && c.path);
      if (m?.path) target = `/${slugify(sup)}/${m.path.split('/')[3]}`;
    } else if (city) {
      // Page ville (dérivée du chemin d'un club de la ville).
      const m = cityClubs.find((c) => c.path);
      if (m?.path) target = m.path.split('/').slice(0, 4).join('/');
    } else if (sup && !region && !dep) {
      target = `/${slugify(sup)}`; // page activité nationale
    } else if (region && !dep) {
      const rslug = slugify(region);
      if (clubs.some((c) => c.path?.split('/')[1] === rslug)) target = `/${rslug}`;
    }

    if (target) {
      window.location.href = target;
      return;
    }

    // Fallback : moteur de recherche filtré.
    const p = new URLSearchParams();
    if (sup) p.set('support', sup);
    if (region) p.set('region', region);
    if (dep) p.set('departement', dep);
    if (city) p.set('ville', city);
    const qs = p.toString();
    window.location.href = '/search' + (qs ? '?' + qs : '');
  };

  return (
    <div className="cv">
      <ActivityIcons />

      <CvNav />

      {/* ============ HERO ============ */}
      <section className="cap-wrap cap-hero">
        <div className="cap-hero-copy">
          <div className="cap-pill"><span className="dot" />{count > 0 ? count.toLocaleString('fr-FR') : '1 800'}+ clubs vérifiés partout en France</div>
          <h1>Trouvez le club de voile <span className="accent">qui vous ressemble.</span></h1>
          <p className="cap-lede">Stages, locations, écoles et bases nautiques — comparez, lisez les avis et réservez près de chez vous. De l&apos;Optimist au wingfoil.</p>

          <div className="cap-search">
            <label className="cap-search-field">
              <span className="cap-search-label">ACTIVITÉ</span>
              <select value={sup} onChange={(e) => setSup(e.target.value)}>
                <option value="">Toutes les activités</option>
                {SUPPORTS.map((s) => <option key={s.k}>{s.k}</option>)}
              </select>
            </label>
            <div className="cap-search-sep" />
            <label className="cap-search-field">
              <span className="cap-search-label">OÙ ?</span>
              <select value={region} onChange={(e) => chooseRegion(e.target.value)}>
                <option value="">Toute la France</option>
                {Object.keys(GEO).map((r) => <option key={r}>{r}</option>)}
              </select>
            </label>
            <button className="cap-search-btn" onClick={voirLesClubs}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
              Rechercher
            </button>
          </div>
          <div className="cap-popular">Populaire : <Link href="/stage-de-voile">Stage de voile</Link> · <Link href="/catamaran">Catamaran</Link> · <Link href="/wingfoil">Wingfoil</Link></div>

          <div className="cap-trust">
            <div className="cap-avatars">
              <span className="cap-av cap-av-1" /><span className="cap-av cap-av-2" /><span className="cap-av cap-av-3" /><span className="cap-av cap-av-4">+1k</span>
            </div>
            <div>
              <div className="cap-stars"><span className="s">★★★★★</span> 4,8/5</div>
              <div className="cap-trust-sub">12 000 avis Google vérifiés</div>
            </div>
          </div>
        </div>

        <div className="cap-hero-map">
          <div className="cap-map-pill">● Carte interactive</div>
          <div id="cv-map" />
          <div className="cap-map-cap">// {visibleCount.toLocaleString('fr-FR')} clubs · cliquez un marqueur</div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="cap-wrap">
        <div className="cap-stats">
          <div className="cap-stat"><div className="cap-stat-n">{count > 0 ? count.toLocaleString('fr-FR') : '1 800'}<span>+</span></div><div className="cap-stat-l">clubs &amp; bases nautiques</div></div>
          <div className="cap-stat"><div className="cap-stat-n">13</div><div className="cap-stat-l">régions, 96 départements</div></div>
          <div className="cap-stat"><div className="cap-stat-n">{SUPPORTS.length}<span>+</span></div><div className="cap-stat-l">activités nautiques</div></div>
          <div className="cap-stat"><div className="cap-stat-n">12 000</div><div className="cap-stat-l">avis Google vérifiés</div></div>
        </div>
      </section>

      {/* ============ ACTIVITÉS ============ */}
      <section className="cap-wrap cap-sec" id="supports">
        <div className="cap-sec-head">
          <div>
            <div className="cap-mono">— Explorez par activité</div>
            <h2 className="cap-h2">Quelle sera votre <span className="accent accent-coral">prochaine sortie&nbsp;?</span></h2>
          </div>
          <Link href="/activites" className="cap-pill-outline">Les {SUPPORTS.length}+ activités →</Link>
        </div>
        <div className="cap-act-grid">
          {topActs.map((a) => (
            <Link key={a.slug} href={`/${a.slug}`} className="cap-act-card">
              <span className="cap-act-ic"><svg className="ic"><use href={'#' + a.ic} /></svg></span>
              <div><h3>{a.k}</h3><div className="n">{a.count > 0 ? `${a.count} clubs` : 'À découvrir'}</div></div>
            </Link>
          ))}
          <Link href="/activites" className="cap-act-card cap-act-card--all">
            <span className="cap-act-ic"><svg className="ic"><use href="#ic-all" /></svg></span>
            <div><h3>Toutes les activités</h3><div className="n">{SUPPORTS.length}+ disciplines →</div></div>
          </Link>
        </div>
      </section>

      {/* ============ RÉGIONS ============ */}
      <section className="cap-regions" id="regions">
        <div className="cap-wrap cap-regions-in">
          <div>
            <div className="cap-mono">— La voile près de chez vous</div>
            <h2 className="cap-h2">Naviguez par <span className="accent">région.</span></h2>
            <p>De la Bretagne à la Côte d&apos;Azur, chaque littoral a ses clubs, ses spots et ses spécialités. Cliquez sur une région pour explorer.</p>
            <div className="cap-chips">
              {topRegions.map((r) => (
                <Link key={r.slug} href={`/${r.slug}`} className="cap-chip">{r.name}<span className="c">{r.clubs}</span></Link>
              ))}
              {geoRegions.length > 6 && <Link href="/#regions" className="cap-chip cap-chip--more">+ {geoRegions.length - 6} régions →</Link>}
            </div>
          </div>
          <div className="cap-regions-map">
            {geoRegions.length > 0 && <FranceRegionMap regions={geoRegions} />}
          </div>
        </div>
      </section>

      {/* ============ CLUBS À L'AFFICHE ============ */}
      <section className="cap-wrap cap-sec">
        <div className="cap-sec-head">
          <div>
            <div className="cap-mono">— Clubs à l&apos;affiche</div>
            <h2 className="cap-h2">Des bases nautiques <span className="accent accent-coral">d&apos;exception.</span></h2>
          </div>
          <Link href="/search" className="cap-pill-outline">Tous les clubs →</Link>
        </div>
        <div className="cap-club-grid">
          {featured.map((c) => (
            <Link key={c.id} href={c.path || ('/club/' + c.id)} className="cap-club-card">
              <div className="cap-club-head">
                <span className="cap-club-badge">Coup de cœur</span>
                <span className="cap-club-logo">{getInitials(c.name)}</span>
              </div>
              <div className="cap-club-body">
                <div className="top">
                  <h3>{c.name}</h3>
                  {!!c.rating && <span className="cap-club-rate"><span className="star">★</span>{c.rating.toFixed(1)}</span>}
                </div>
                <div className="cap-club-loc">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-7-5.5-7-11a7 7 0 0114 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
                  {(c.city || '').replace(/^\d{4,5}\s+/, '')}
                </div>
                <div className="cap-club-tags">
                  {(c.activities || []).filter((a) => a !== 'En cours de traitement').slice(0, 3).map((a) => <span key={a} className="cap-club-tag">{a}</span>)}
                </div>
                <div className="cap-club-foot">
                  <span className="meta">{c.reviewCount ? `${c.reviewCount.toLocaleString('fr-FR')} avis Google` : 'Fiche club'}</span>
                  <span className="go">Voir le club →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ COMMENT ÇA MARCHE ============ */}
      <section className="cap-how">
        <div className="cap-wrap cap-how-in">
          <div className="cap-how-head">
            <div className="cap-mono">— Comment ça marche</div>
            <h2>Embarquez en <span className="accent">trois temps.</span></h2>
          </div>
          <div className="cap-how-grid">
            <div className="cap-how-card">
              <div className="cap-how-num">01</div>
              <div className="cap-how-ic"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg></div>
              <h3>Cherchez</h3>
              <p>Activité, lieu, niveau, âge. Filtrez parmi {count > 0 ? count.toLocaleString('fr-FR') : '1 800'} clubs et trouvez celui qui colle à votre projet.</p>
            </div>
            <div className="cap-how-card">
              <div className="cap-how-num">02</div>
              <div className="cap-how-ic"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 18V9M10 18V4M16 18v-6M22 18H2" /></svg></div>
              <h3>Comparez</h3>
              <p>Avis Google, photos, activités, horaires. Tout est réuni sur une fiche claire, sans jargon.</p>
            </div>
            <div className="cap-how-card">
              <div className="cap-how-num">03</div>
              <div className="cap-how-ic cap-how-ic--coral"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg></div>
              <h3>Contactez</h3>
              <p>Téléphone, mail ou site du club, en un clic. Itinéraire et infos pratiques inclus.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PILIERS ============ */}
      <section className="cap-wrap cap-sec">
        <div className="cap-pillars">
          <Link href="/stage-de-voile" className="cap-pillar p1"><div><div className="path">/stage-de-voile</div><h3>Stage de voile</h3><p>Vacances, week-ends, perfectionnement →</p></div></Link>
          <Link href="/ecole-de-voile" className="cap-pillar p2"><div><div className="path">/ecole-de-voile</div><h3>École de voile</h3><p>Apprendre à barrer, du débutant au confirmé →</p></div></Link>
          <Link href="/club-de-voile" className="cap-pillar p3"><div><div className="path">/club-de-voile</div><h3>Club de voile</h3><p>Adhésion, licence, vie associative →</p></div></Link>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="cap-wrap cap-cta">
        <div className="cap-cta-in">
          <div>
            <h2>Vous gérez un club&nbsp;? <span className="accent">Référencez-le gratuitement.</span></h2>
            <p>Des milliers de passionnés cherchent leur prochain club. Rejoignez l&apos;annuaire n°1 de la voile — c&apos;est gratuit.</p>
          </div>
          <Link href="/contact" className="cap-cta-btn">Ajouter mon club →</Link>
        </div>
      </section>

      <CvFooter />
    </div>
  );
}
