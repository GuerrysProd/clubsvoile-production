'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type GeoRegion = { slug: string; name: string; departments: number; clubs: number };
type GeoActivity = { slug: string; name: string; cities: number; clubs: number };

export default function CvFooter() {
  const [regions, setRegions] = useState<GeoRegion[]>([]);
  const [activities, setActivities] = useState<GeoActivity[]>([]);

  useEffect(() => {
    fetch('/api/geo')
      .then((res) => res.json())
      .then((data) => {
        setRegions(data.regions || []);
        setActivities(data.activities || []);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-top">
          <div>
            <div className="foot-logo"><span className="dot" />ClubsVoile.fr</div>
            <p style={{ marginTop: 12, maxWidth: 260 }}>L&apos;annuaire des clubs de voile français. De l&apos;Optimist à la croisière.</p>
          </div>
          <div className="foot-cols">
            <div className="foot-col"><h4>Explorer</h4><Link href="/#supports">Supports</Link><Link href="/activites">Toutes les activités</Link><Link href="/#regions">La carte des régions</Link><Link href="/search">Tous les clubs</Link></div>
            <div className="foot-col"><h4>Clubs</h4><Link href="/admin/login">Inscrire un club</Link><Link href="/admin/login">Connexion</Link></div>
            <div className="foot-col"><h4>Contact</h4><a href="mailto:contact@clubsvoile.fr">contact@clubsvoile.fr</a></div>
            {regions.length > 0 && (
              <div className="foot-col">
                <h4>Régions</h4>
                {regions.map((r) => (
                  <Link key={r.slug} href={`/${r.slug}`}>Club de voile en {r.name}</Link>
                ))}
              </div>
            )}
            {activities.length > 0 && (
              <div className="foot-col">
                <h4>Activités</h4>
                {activities.map((a) => (
                  <Link key={a.slug} href={`/${a.slug}`}>{a.name}</Link>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="foot-bottom">© 2026 ClubsVoile.fr — Tous droits réservés.</div>
      </div>
    </footer>
  );
}
