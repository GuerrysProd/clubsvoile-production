'use client';

import { useEffect, useState } from 'react';
import ClubCard from '@/app/components/ClubCard';
import SearchBar from '@/app/components/SearchBar';
import styles from './search.module.css';

import type { Club } from '@/lib/types';

export default function SearchPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClubs();
  }, []);

  async function fetchClubs() {
    try {
      const res = await fetch('/api/clubs');
      const data = await res.json();
      setClubs(data.clubs || []);
      setFilteredClubs(data.clubs || []);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (filters: any) => {
    let filtered = clubs;

    if (filters.city) {
      filtered = filtered.filter(c =>
        c.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.region) {
      filtered = filtered.filter(c => c.region === filters.region);
    }

    if (filters.activity) {
      filtered = filtered.filter(c =>
        c.activities.includes(filters.activity)
      );
    }

    setFilteredClubs(filtered);
  };

  return (
    <div className={styles.container}>
      <h1>🔍 Recherchez votre club</h1>
      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <div className={styles.loading}>Chargement des clubs...</div>
      ) : (
        <>
          <div className={styles.resultCount}>
            {filteredClubs.length} club{filteredClubs.length !== 1 ? 's' : ''} trouvé{filteredClubs.length !== 1 ? 's' : ''}
          </div>
          <div className={styles.grid}>
            {filteredClubs.map(club => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
