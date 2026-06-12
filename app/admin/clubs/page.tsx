'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './clubs.module.css';

interface Club {
  id: string;
  name: string;
  city: string;
  region: string;
  department: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  review_count: number;
  activities: string[];
  schedule_open: string;
}

type SortKey = 'name' | 'city' | 'region' | 'department' | 'rating';
type SortDir = 'asc' | 'desc';

export default function AdminClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [department, setDepartment] = useState('');
  const [city, setCity] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await fetch('/api/admin/clubs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) router.push('/admin/login');
        return;
      }

      const data = await response.json();
      setClubs(data.clubs || []);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteClub = async (id: string) => {
    if (!confirm('Supprimer ce club ?')) return;

    try {
      const response = await fetch(`/api/admin/clubs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        setClubs(clubs.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('Error deleting club:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const regions = useMemo(
    () => Array.from(new Set(clubs.map(c => c.region).filter(Boolean))).sort(),
    [clubs]
  );

  const departments = useMemo(
    () => Array.from(new Set(
      clubs.filter(c => !region || c.region === region).map(c => c.department).filter(Boolean)
    )).sort(),
    [clubs, region]
  );

  const cities = useMemo(
    () => Array.from(new Set(
      clubs
        .filter(c => (!region || c.region === region) && (!department || c.department === department))
        .map(c => c.city)
        .filter(Boolean)
    )).sort(),
    [clubs, region, department]
  );

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortArrow = (key: SortKey) => (sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '');

  const filteredClubs = useMemo(() => {
    const term = search.toLowerCase();
    const result = clubs.filter(club => {
      if (term && !club.name.toLowerCase().includes(term) && !club.city?.toLowerCase().includes(term)) return false;
      if (region && club.region !== region) return false;
      if (department && club.department !== department) return false;
      if (city && club.city !== city) return false;
      return true;
    });

    result.sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      let cmp: number;
      if (typeof av === 'number' || typeof bv === 'number') {
        cmp = (Number(av) || 0) - (Number(bv) || 0);
      } else {
        cmp = String(av).localeCompare(String(bv), 'fr');
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [clubs, search, region, department, city, sortKey, sortDir]);

  const handleRegionChange = (value: string) => {
    setRegion(value);
    setDepartment('');
    setCity('');
  };

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
    setCity('');
  };

  const resetFilters = () => {
    setSearch('');
    setRegion('');
    setDepartment('');
    setCity('');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>⚙️ Admin Dashboard</h1>
        <div className={styles.headerRight}>
          <span>Total clubs: {clubs.length} — Affichés: {filteredClubs.length}</span>
          <button onClick={logout} className={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Rechercher un club ou une ville..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <select value={region} onChange={(e) => handleRegionChange(e.target.value)}>
          <option value="">Toutes les régions</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        <select value={department} onChange={(e) => handleDepartmentChange(e.target.value)} disabled={!departments.length}>
          <option value="">Tous les départements</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select value={city} onChange={(e) => setCity(e.target.value)} disabled={!cities.length}>
          <option value="">Toutes les villes</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <button onClick={resetFilters} className={styles.resetBtn}>Réinitialiser</button>
      </div>

      {loading ? (
        <div className={styles.loading}>Chargement...</div>
      ) : (
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th onClick={() => toggleSort('name')} className={styles.sortable}>Nom{sortArrow('name')}</th>
                <th onClick={() => toggleSort('city')} className={styles.sortable}>Ville{sortArrow('city')}</th>
                <th onClick={() => toggleSort('region')} className={styles.sortable}>Région{sortArrow('region')}</th>
                <th onClick={() => toggleSort('department')} className={styles.sortable}>Département{sortArrow('department')}</th>
                <th>Téléphone</th>
                <th>Email</th>
                <th>Site Web</th>
                <th>Activités</th>
                <th onClick={() => toggleSort('rating')} className={styles.sortable}>Note{sortArrow('rating')}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClubs.map(club => (
                <tr key={club.id}>
                  <td className={styles.name}>{club.name}</td>
                  <td>{club.city}</td>
                  <td>{club.region || '-'}</td>
                  <td>{club.department || '-'}</td>
                  <td>{club.phone || '-'}</td>
                  <td>{club.email || '-'}</td>
                  <td>
                    {club.website ? (
                      <a href={club.website} target="_blank" rel="noopener">
                        Link
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{club.activities?.join(', ') || '-'}</td>
                  <td>⭐ {club.rating}</td>
                  <td className={styles.actions}>
                    <button
                      onClick={() => router.push(`/admin/clubs/${club.id}`)}
                      className={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteClub(club.id)}
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
