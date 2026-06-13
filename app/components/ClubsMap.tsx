'use client';

import { useEffect, useRef, useState } from 'react';

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

// Carte Leaflet des clubs proposant une activité donnée — reprend le
// fonctionnement de la carte de la page d'accueil, filtrée sur une seule
// activité (sans chips de filtre).
export default function ClubsMap({ activity }: { activity: string }) {
  const [count, setCount] = useState(0);
  const mapRef = useRef<any>(null);
  const clusterRef = useRef<any>(null);
  const clubsRef = useRef<GeoClub[]>([]);

  useEffect(() => {
    let cancelled = false;

    const addCss = (href: string) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; document.head.appendChild(l);
    };
    addCss('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css');
    addCss('https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.min.css');
    addCss('https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.Default.min.css');

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

    (async () => {
      const [, clubsRes] = await Promise.all([
        (async () => {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js');
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/leaflet.markercluster.min.js');
        })(),
        fetch('/api/clubs').then((res) => res.json()).catch(() => ({ clubs: [] })),
      ]);
      if (cancelled) return;

      const geo: GeoClub[] = (clubsRes.clubs || [])
        .filter((c: any) => typeof c.latitude === 'number' && typeof c.longitude === 'number' && (c.activities || []).includes(activity))
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
      setCount(geo.length);

      const L = (window as any).L;
      if (!L || mapRef.current) return;

      const map = L.map('cv-act-map', { scrollWheelZoom: false }).setView([46.6, 2.2], 5.4);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '© OpenStreetMap © CARTO', subdomains: 'abcd', maxZoom: 19 }).addTo(map);
      const cluster = L.markerClusterGroup({
        maxClusterRadius: 55, showCoverageOnHover: false,
        iconCreateFunction: (c: any) => L.divIcon({ html: '<div>' + c.getChildCount() + '</div>', className: 'marker-cluster marker-cluster-cv', iconSize: [40, 40] }),
      });
      map.addLayer(cluster);
      map.on('click', () => map.scrollWheelZoom.enable());
      mapRef.current = map; clusterRef.current = cluster;

      const dot = L.divIcon({ html: '<div style="width:14px;height:14px;background:#FF5436;border:2.5px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>', className: '', iconSize: [14, 14] });
      geo.forEach((c) => {
        const rateHtml = c.rating
          ? '<span class="pop-rate">★ ' + c.rating.toFixed(1)
            + (c.reviewCount ? ' <span class="pop-reviews">(' + c.reviewCount + ' avis)</span>' : '') + '</span>'
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

      if (geo.length > 0) {
        const bounds = L.latLngBounds(geo.map((c) => [c.lat, c.lng]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
      }
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity]);

  return (
    <div className="map-shell">
      <div id="cv-act-map" />
      <div className="map-meta"><span className="chip">{count}</span><b>club{count > 1 ? 's' : ''} · {activity}</b></div>
    </div>
  );
}
