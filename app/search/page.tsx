'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './search.module.css';
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
    <div className={styles.searchPage}>
      <div className={styles.searchHeader}>
        <h1>🔍 Recherchez votre club</h1>
        <p>{clubs.length.toLocaleString('fr-FR')} clubs référencés à travers la France</p>
      </div>

      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.filterSection}>
            <label>Recherche</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Nom du club ou ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.filterSection}>
            <label>Région</label>
            <select className={styles.select} value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">Toutes les régions</option>
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterSection}>
            <label>Activité</label>
            <select className={styles.select} value={activity} onChange={(e) => setActivity(e.target.value)}>
              <option value="">Toutes les activités</option>
              {activities.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterSection}>
            <label>Note minimum</label>
            <div className={styles.ratingFilter}>
              {RATING_OPTIONS.map((r) => (
                <button
                  key={r}
                  className={`${styles.ratingBtn} ${minRating === r ? styles.active : ''}`}
                  onClick={() => setMinRating(r)}
                >
                  {r === 0 ? 'Toutes les notes' : `★ ${r}+`}
                </button>
              ))}
            </div>
          </div>

          <button className={styles.resetBtn} onClick={handleReset}>Réinitialiser</button>
        </aside>

        <div className={styles.mainContent}>
          {loading ? (
            <div className={styles.loading}>Chargement des clubs...</div>
          ) : filteredClubs.length === 0 ? (
            <div className={styles.noResults}>Aucun club ne correspond à votre recherche.</div>
          ) : (
            <>
              <div className={styles.resultCount}>
                {filteredClubs.length.toLocaleString('fr-FR')} club{filteredClubs.length !== 1 ? 's' : ''} trouvé{filteredClubs.length !== 1 ? 's' : ''}
              </div>
              <div className={styles.clubsGrid}>
                {filteredClubs.map((club) => (
                  <Link key={club.id} href={`/club/${club.id}`} className={styles.clubCard}>
                    <div className={styles.clubHeader}>
                      <h3>{club.name}</h3>
                      {!!club.rating && <span className={styles.rating}>★ {club.rating}</span>}
                    </div>
                    <p className={styles.location}>{[club.city, club.region].filter(Boolean).join(', ')}</p>
                    <div className={styles.activities}>
                      {(club.activities || []).slice(0, 4).map((a) => (
                        <span key={a} className={styles.activityTag}>{a}</span>
                      ))}
                    </div>
                    {club.description && <p className={styles.description}>{club.description}</p>}
                    {(club.phone || club.website) && (
                      <div className={styles.footer}>{club.phone || club.website}</div>
                    )}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>Chargement...</div>}>
      <SearchPageInner />
    </Suspense>
  );
}
