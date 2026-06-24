'use client';

import { useEffect, useRef, useState } from 'react';
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

const FEAT = [
  { n: 'Société des Régates de Saint-Malo', loc: 'Saint-Malo, Bretagne', r: '4.8', tag: 'Intra-muros', acts: ['Catamaran', 'Optimist', 'Croisière'], img: 'https://images.unsplash.com/photo-1502209877429-2c1f55a44f6d?w=600&q=70&auto=format&fit=crop' },
  { n: 'Yacht Club de Hyères', loc: 'Hyères, PACA', r: '4.7', tag: "Presqu'île de Giens", acts: ['Wingfoil', 'Kitesurf', 'Planche à voile'], img: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=600&q=70&auto=format&fit=crop' },
  { n: 'Centre Nautique de La Rochelle', loc: 'La Rochelle, N.-Aquitaine', r: '4.9', tag: 'Les Minimes', acts: ['Croisière', 'Catamaran', 'Paddle'], img: 'https://images.unsplash.com/photo-1543242594-c8bae8b9e708?w=600&q=70&auto=format&fit=crop' },
  { n: 'Hossegor Glisse', loc: 'Hossegor, Landes', r: '4.8', tag: 'Spot de glisse', acts: ['Wingfoil', 'eFoil', 'Kitesurf'], img: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=600&q=70&auto=format&fit=crop' },
  { n: 'Cercle Nautique de Sète', loc: 'Sète, Occitanie', r: '4.6', tag: 'Étang de Thau', acts: ['Kitesurf', 'Wingfoil', 'Planche à voile'], img: 'https://images.unsplash.com/photo-1566024287286-457247b70310?w=600&q=70&auto=format&fit=crop' },
  { n: 'Yacht Club de Cannes', loc: "Cannes, Côte d'Azur", r: '4.7', tag: 'Baie de Cannes', acts: ['Catamaran', 'Croisière', 'Wingfoil'], img: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=600&q=70&auto=format&fit=crop' },
];

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
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '© OpenStreetMap © CARTO', subdomains: 'abcd', maxZoom: 19 }).addTo(map);
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

      <header className="hero">
        <svg className="contours" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g fill="none" stroke="#1B4368" strokeWidth="1.5">
            <path d="M-50 120 C 200 60, 420 180, 650 110 S 1050 40, 1280 140" />
            <path d="M-50 200 C 220 150, 440 260, 680 190 S 1060 130, 1280 220" />
            <path d="M-50 300 C 240 250, 470 360, 700 290 S 1080 230, 1280 320" />
            <path d="M-50 410 C 250 360, 480 470, 720 400 S 1090 340, 1280 430" stroke="#FF5436" strokeOpacity=".4" />
            <path d="M-50 520 C 260 470, 500 580, 740 510 S 1100 450, 1280 540" />
            <path d="M-50 630 C 270 580, 520 690, 760 620 S 1110 560, 1280 650" />
          </g>
        </svg>
        <div className="wrap hero-in">
          <div className="hero-copy">
            <span className="eyebrow">1 200+ clubs · tous les littoraux</span>
            <h1>Votre prochain club<br />de voile,<br /><em>partout en France.</em></h1>
            <p className="lede">De l&apos;Optimist au wingfoil, de la Manche à la Corse. Choisissez votre support, votre coin de côte, et embarquez.</p>
            <div className="hero-stats">
              <div><div className="n">{count.toLocaleString('fr-FR')}</div><div className="l">Clubs référencés</div></div>
              <div><div className="n">{SUPPORTS.length}</div><div className="l">Supports</div></div>
              <div><div className="n">26</div><div className="l">Départements côtiers</div></div>
            </div>
          </div>

          <div className="sim">
            <div className="sim-head">Trouvez votre club <span className="badge">Simulateur</span></div>
            <p className="sim-sub">Affinez en quelques clics. On vous emmène au bon endroit.</p>
            <div className="field">
              <label>Support</label>
              <select value={sup} onChange={(e) => setSup(e.target.value)}>
                <option value="">Tous les supports</option>
                {SUPPORTS.map(s => <option key={s.k}>{s.k}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Région</label>
              <select value={region} onChange={(e) => chooseRegion(e.target.value)}>
                <option value="">Toutes les régions</option>
                {Object.keys(GEO).map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Département</label>
                <select value={dep} disabled={!region} onChange={(e) => { setDep(e.target.value); setCity(''); }}>
                  <option value="">{region ? 'Tous les départements' : '—'}</option>
                  {region && Object.keys(GEO[region]).map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Ville</label>
                <select value={city} disabled={!dep} onChange={(e) => setCity(e.target.value)}>
                  <option value="">{dep ? 'Toutes les villes' : '—'}</option>
                  {region && dep && GEO[region][dep].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <button className="sim-go" onClick={voirLesClubs}>
              Voir les clubs
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </div>
        </div>
      </header>

      <section className="block supports" id="supports">
        <div className="wrap">
          <div className="sec-eyebrow">Choisissez votre support</div>
          <h2 className="sec-title">Ce que vous voulez naviguer décide de tout.</h2>
          <p className="sec-intro">Les nouvelles glisses ou les grands classiques — cliquez sur un support pour voir les clubs qui le proposent sur la carte.</p>
          <div className="sup-grid">
            {SUPPORTS.map(s => (
              <Link key={s.k} href={`/${slugify(s.k)}`} className={'sup' + (sup === s.k ? ' active' : '')}>
                {s.trend && <span className="trend">Tendance</span>}
                <svg className="ic"><use href={'#' + s.ic} /></svg>
                <h3>{s.k}</h3><p>{s.d}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <svg className="wave" viewBox="0 0 1200 46" preserveAspectRatio="none" aria-hidden="true"><path d="M0 46 V20 C 200 0 400 40 600 24 S 1000 0 1200 22 V46 Z" /></svg>

      <section className="block map-block" id="carte">
        <div className="wrap">
          <div className="sec-eyebrow">La carte vivante</div>
          <h2 className="sec-title">Tous les clubs, d&apos;un seul regard.</h2>
          <p className="sec-intro">Dézoomez et les clubs se regroupent par zone. Filtrez par support pour ne voir que ce qui vous intéresse.</p>
          <div className="filterbar">
            <button className={'fchip' + (sup === '' ? ' active' : '')} onClick={() => setSup('')}>
              <svg className="ic"><use href="#ic-all" /></svg>Tous
            </button>
            {SUPPORTS.map(s => (
              <button key={s.k} className={'fchip' + (sup === s.k ? ' active' : '')} onClick={() => setSup(s.k)}>
                <svg className="ic"><use href={'#' + s.ic} /></svg>{s.k}
              </button>
            ))}
          </div>
          <div className="map-shell">
            <div id="cv-map" />
            <div className="map-meta"><span className="chip">{visibleCount}</span><b>{sup ? 'clubs · ' + sup : 'clubs affichés'}</b></div>
          </div>
        </div>
      </section>

      <svg className="wave" viewBox="0 0 1200 46" preserveAspectRatio="none" aria-hidden="true"><path d="M0 46 V20 C 200 0 400 40 600 24 S 1000 0 1200 22 V46 Z" /></svg>

      <section className="block regions" id="regions">
        <div className="wrap">
          <div className="sec-eyebrow">Par région</div>
          <h2 className="sec-title">Explorez la voile, région par région.</h2>
          <p className="sec-intro">Cliquez sur une région pour découvrir ses départements, puis ses villes et tous les clubs qui s&apos;y trouvent.</p>
          {geoRegions.length > 0 && <FranceRegionMap regions={geoRegions} />}
        </div>
      </section>

      <svg className="wave" viewBox="0 0 1200 46" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0 V26 C 200 46 400 6 600 22 S 1000 46 1200 24 V0 Z" /></svg>

      <section className="block steps">
        <div className="wrap">
          <div className="sec-eyebrow">Comment ça marche</div>
          <h2 className="sec-title">Du choix du support à l&apos;eau, en quatre temps.</h2>
          <div className="steps-grid">
            <div className="step"><div className="num">01</div><h3>Choisissez</h3><p>Votre support et votre coin de littoral, du Nord à la Corse.</p></div>
            <div className="step"><div className="num">02</div><h3>Comparez</h3><p>Notes, activités, horaires et contacts réunis sur une seule fiche.</p></div>
            <div className="step"><div className="num">03</div><h3>Contactez</h3><p>Téléphone, mail ou site du club, en un clic.</p></div>
            <div className="step"><div className="num">04</div><h3>Naviguez</h3><p>Réservez votre stage ou votre séance, et prenez le large.</p></div>
          </div>
        </div>
      </section>

      <section className="block clubs" id="clubs">
        <div className="wrap">
          <div className="sec-eyebrow">À l&apos;affiche</div>
          <h2 className="sec-title">Quelques clubs qui valent le détour.</h2>
          <div className="cards">
            {FEAT.map(c => (
              <article key={c.n} className="card">
                <div className="card-img">
                  <img src={c.img} alt="" loading="lazy" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
                  <span className="card-tag">{c.tag}</span><span className="card-rate">★ {c.r}</span>
                </div>
                <div className="card-body">
                  <h3>{c.n}</h3>
                  <div className="card-loc">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-6.3-7-11a7 7 0 0114 0c0 4.7-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
                    {c.loc}
                  </div>
                  <div className="card-acts">{c.acts.map(a => <span key={a} className="pill">{a}</span>)}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="block cta-wrap">
        <div className="wrap">
          <div className="strip">
            <svg className="cstripwave" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="none" stroke="#fff" strokeWidth="2"><path d="M-50 80 C 250 30 450 130 750 70 S 1150 20 1280 90" /><path d="M-50 170 C 250 120 450 220 750 160 S 1150 110 1280 180" /><path d="M-50 250 C 250 200 450 300 750 240 S 1150 190 1280 260" /></g></svg>
            <div>
              <h2>Vous gérez un club&nbsp;? Gagnez en visibilité, gratuitement.</h2>
              <p>Des milliers de passionnés cherchent leur prochain club. Référencez le vôtre sur l&apos;annuaire n°1 de la voile — c&apos;est gratuit. Parlons-en.</p>
            </div>
            <a href="/contact" className="strip-btn">Contactez-nous →</a>
          </div>
        </div>
      </section>

      <CvFooter />
    </div>
  );
}
