'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '../home.css';
import CvNav from '../components/CvNav';
import CvFooter from '../components/CvFooter';
import type { Club } from '@/lib/types';

const RATING_OPTIONS = [0, 4, 4.5];

function SearchPageInner() {
  const searchParams = useSearchParams();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [region, setRegion] = useState(searchParams.get('region') || '');
  const [city, setCity] = useState(searchParams.get('ville') || '');
  const [activity, setActivity] = useState(searchParams.get('support') || '');
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    fetch('/api/clubs')
      .then((res) => res.json())
      .then((data) => setClubs(data.clubs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const regions = useMemo(
    () => Array.from(new Set(clubs.map((c) => c.region).filter(Boolean))).sort(),
    [clubs]
  );

  const activities = useMemo(
    () => Array.from(new Set(clubs.flatMap((c) => c.activities || []))).sort(),
    [clubs]
  );

  const filteredClubs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return clubs.filter((c) => {
      if (term && !c.name.toLowerCase().includes(term) && !c.city?.toLowerCase().includes(term)) return false;
      if (region && c.region !== region) return false;
      if (city && !c.city?.toLowerCase().includes(city.toLowerCase())) return false;
      if (activity && !c.activities?.includes(activity)) return false;
      if (minRating && (c.rating || 0) < minRating) return false;
      return true;
    });
  }, [clubs, searchTerm, region, city, activity, minRating]);

  const handleReset = () => {
    setSearchTerm('');
    setRegion('');
    setCity('');
    setActivity('');
    setMinRating(0);
  };

  return (
    <div className="cv">
      <CvNav />

      <header className="search-hero">
        <div className="wrap">
          <span className="eyebrow">Annuaire ClubsVoile</span>
          <h1>Recherchez votre <em>club de voile</em></h1>
          <p className="lede">{clubs.length.toLocaleString('fr-FR')} clubs référencés à travers la France. Filtrez par région, activité ou note pour trouver le vôtre.</p>
        </div>
      </header>

      <section className="block search-block">
        <div className="wrap search-layout">
          <aside className="sim search-filters">
            <div className="sim-head">Filtrer <span className="badge">{filteredClubs.length.toLocaleString('fr-FR')} résultats</span></div>
            <p className="sim-sub">Affinez votre recherche pour trouver le club parfait.</p>

            <div className="field">
              <label>Recherche</label>
              <input
                type="text"
                placeholder="Nom du club ou ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Région</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="">Toutes les régions</option>
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Activité</label>
              <select value={activity} onChange={(e) => setActivity(e.target.value)}>
                <option value="">Toutes les activités</option>
                {activities.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Note minimum</label>
              <div className="ratings">
                {RATING_OPTIONS.map((r) => (
                  <button
                    key={r}
                    className={'ratechip' + (minRating === r ? ' active' : '')}
                    onClick={() => setMinRating(r)}
                  >
                    {r === 0 ? 'Toutes' : `★ ${r}+`}
                  </button>
                ))}
              </div>
            </div>

            <button className="sim-go" onClick={handleReset}>Réinitialiser</button>
          </aside>

          <div className="search-results">
            {loading ? (
              <div className="search-loading">Chargement des clubs...</div>
            ) : filteredClubs.length === 0 ? (
              <div className="no-results">Aucun club ne correspond à votre recherche.</div>
            ) : (
              <>
                <div className="search-count">
                  {filteredClubs.length.toLocaleString('fr-FR')} club{filteredClubs.length !== 1 ? 's' : ''} trouvé{filteredClubs.length !== 1 ? 's' : ''}
                </div>
                <div className="search-grid">
                  {filteredClubs.map((club) => (
                    <Link key={club.id} href={`/club/${club.id}`} className="result-card">
                      {!!club.rating && <span className="result-rate">★ {club.rating}</span>}
                      <h3>{club.name}</h3>
                      <div className="card-loc">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-6.3-7-11a7 7 0 0114 0c0 4.7-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
                        {[club.city, club.region].filter(Boolean).join(', ')}
                      </div>
                      <div className="card-acts">
                        {(club.activities || []).slice(0, 4).map((a) => (
                          <span key={a} className="pill">{a}</span>
                        ))}
                      </div>
                      {club.description && <p className="result-desc">{club.description}</p>}
                      {(club.phone || club.website) && (
                        <div className="result-foot">{club.phone || club.website}</div>
                      )}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <CvFooter />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="cv"><div className="search-loading">Chargement...</div></div>}>
      <SearchPageInner />
    </Suspense>
  );
}
