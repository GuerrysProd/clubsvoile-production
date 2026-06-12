// app/search/page.tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from './search.module.css';

// Import map dynamiquement pour éviter les erreurs SSR
const MapComponent = dynamic(() => import('@/app/components/Map'), {
  ssr: false,
  loading: () => <div className={styles.mapLoading}>Chargement de la carte...</div>,
});

interface Club {
  id: string;
  name: string;
  city: string;
  region: string;
  rating: number;
  activities: string[];
  phone: string;
  latitude: number;
  longitude: number;
  description: string;
}

const REGIONS = [
  'PACA',
  'Bretagne',
  'Normandie',
  'Pays de la Loire',
  'Nouvelle-Aquitaine',
  'Corse',
];

const ACTIVITIES = [
  'Voilier',
  'Dériveur',
  'Catamaran',
  'Planche à voile',
  'Wingfoil',
  'Stand-up paddle',
  'Croisière',
];

export default function SearchPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Filtres
  const [filters, setFilters] = useState({
    search: '',
    region: '',
    activity: '',
    minRating: 0,
  });

  useEffect(() => {
    fetchClubs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [clubs, filters]);

  async function fetchClubs() {
    try {
      setLoading(true);
      const res = await fetch('/api/clubs?limit=200');
      const data = await res.json();
      setClubs(data.clubs || []);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...clubs];

    if (filters.search) {
      filtered = filtered.filter(
        (club) =>
          club.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          club.city.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.region) {
      filtered = filtered.filter((club) => club.region === filters.region);
    }

    if (filters.activity) {
      filtered = filtered.filter((club) =>
        club.activities.includes(filters.activity)
      );
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter((club) => club.rating >= filters.minRating);
    }

    setFilteredClubs(filtered);
  }

  return (
    <main className={styles.searchPage}>
      {/* SEARCH HEADER */}
      <div className={styles.searchHeader}>
        <h1>Trouvez votre club parfait</h1>
        <p>{filteredClubs.length} club(s) trouvé(s)</p>
      </div>

      {/* FILTERS & CONTENT */}
      <div className={styles.container}>
        {/* SIDEBAR FILTERS */}
        <aside className={styles.sidebar}>
          <div className={styles.filterSection}>
            <label htmlFor="search">Rechercher</label>
            <input
              id="search"
              type="text"
              placeholder="Nom du club ou ville..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className={styles.input}
            />
          </div>

          <div className={styles.filterSection}>
            <label htmlFor="region">Région</label>
            <select
              id="region"
              value={filters.region}
              onChange={(e) =>
                setFilters({ ...filters, region: e.target.value })
              }
              className={styles.select}
            >
              <option value="">Toutes les régions</option>
              {REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterSection}>
            <label htmlFor="activity">Activité</label>
            <select
              id="activity"
              value={filters.activity}
              onChange={(e) =>
                setFilters({ ...filters, activity: e.target.value })
              }
              className={styles.select}
            >
              <option value="">Toutes les activités</option>
              {ACTIVITIES.map((activity) => (
                <option key={activity} value={activity}>
                  {activity}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterSection}>
            <label htmlFor="rating">Note minimale</label>
            <div className={styles.ratingFilter}>
              {[0, 3, 4, 4.5].map((rating) => (
                <button
                  key={rating}
                  className={`${styles.ratingBtn} ${
                    filters.minRating === rating ? styles.active : ''
                  }`}
                  onClick={() =>
                    setFilters({ ...filters, minRating: rating })
                  }
                >
                  {rating === 0 ? 'Tous' : `${rating}+ ⭐`}
                </button>
              ))}
            </div>
          </div>

          <button
            className={styles.resetBtn}
            onClick={() =>
              setFilters({ search: '', region: '', activity: '', minRating: 0 })
            }
          >
            Réinitialiser
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <div className={styles.mainContent}>
          {/* VIEW TOGGLE */}
          <div className={styles.viewToggle}>
            <button
              className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
            >
              📋 Grille
            </button>
            <button
              className={`${styles.toggleBtn} ${viewMode === 'map' ? styles.active : ''}`}
              onClick={() => setViewMode('map')}
            >
              🗺️ Carte
            </button>
          </div>

          {/* CLUBS GRID OR MAP */}
          {loading ? (
            <div className={styles.loading}>Chargement des clubs...</div>
          ) : viewMode === 'grid' ? (
            <div className={styles.clubsGrid}>
              {filteredClubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
              {filteredClubs.length === 0 && (
                <div className={styles.noResults}>
                  Aucun club ne correspond à votre recherche
                </div>
              )}
            </div>
          ) : (
            <MapComponent clubs={filteredClubs} />
          )}
        </div>
      </div>
    </main>
  );
}

function ClubCard({ club }: { club: Club }) {
  return (
    <a href={`/club/${club.id}`} className={styles.clubCard}>
      <div className={styles.clubHeader}>
        <h3>{club.name}</h3>
        <div className={styles.rating}>
          ⭐ {club.rating.toFixed(1)}
        </div>
      </div>
      <p className={styles.location}>
        📍 {club.city} • {club.region}
      </p>
      <div className={styles.activities}>
        {club.activities.slice(0, 3).map((activity) => (
          <span key={activity} className={styles.activityTag}>
            {activity}
          </span>
        ))}
        {club.activities.length > 3 && (
          <span className={styles.activityTag}>
            +{club.activities.length - 3}
          </span>
        )}
      </div>
      <p className={styles.description}>{club.description}</p>
      <div className={styles.footer}>
        📞 {club.phone || 'Non disponible'}
      </div>
    </a>
  );
}
