// app/components/SearchBar.tsx
'use client';

import { useState, useCallback } from 'react';
import { SearchFilters } from '@/lib/types';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  regions: string[];
  cities: string[];
  activities: string[];
  onSearch: (filters: SearchFilters) => void;
}

export default function SearchBar({ regions, cities, activities, onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');

  const handleSearch = useCallback(() => {
    onSearch({
      searchTerm,
      region: selectedRegion || undefined,
      city: selectedCity || undefined,
      activity: selectedActivity || undefined,
    });
  }, [searchTerm, selectedRegion, selectedCity, selectedActivity, onSearch]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedRegion('');
    setSelectedCity('');
    setSelectedActivity('');
    onSearch({});
  };

  return (
    <div className={styles.searchContainer}>
      <h2 className={styles.title}>Trouver un club de voile</h2>
      
      <div className={styles.grid}>
        <div className={styles.searchInput}>
          <input
            type="text"
            placeholder="Nom, ville ou club..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch();
            }}
            className={styles.input}
          />
        </div>

        <select
          value={selectedRegion}
          onChange={(e) => {
            setSelectedRegion(e.target.value);
            handleSearch();
          }}
          className={styles.select}
        >
          <option value="">Toutes les régions</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>

        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            handleSearch();
          }}
          className={styles.select}
          disabled={cities.length === 0}
        >
          <option value="">Toutes les villes</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select
          value={selectedActivity}
          onChange={(e) => {
            setSelectedActivity(e.target.value);
            handleSearch();
          }}
          className={styles.select}
        >
          <option value="">Toutes les activités</option>
          {activities.map((activity) => (
            <option key={activity} value={activity}>
              {activity}
            </option>
          ))}
        </select>

        <button onClick={handleReset} className={styles.resetBtn}>
          Réinitialiser
        </button>
      </div>
    </div>
  );
}
