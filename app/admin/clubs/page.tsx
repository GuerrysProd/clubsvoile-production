'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './clubs.module.css';

interface Club {
  id: string;
  name: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  review_count: number;
  activities: string[];
  schedule_open: string;
}

export default function AdminClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(search.toLowerCase()) ||
    club.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>⚙️ Admin Dashboard</h1>
        <div className={styles.headerRight}>
          <span>Total clubs: {clubs.length}</span>
          <button onClick={logout} className={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Rechercher un club..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className={styles.loading}>Chargement...</div>
      ) : (
        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Ville</th>
                <th>Téléphone</th>
                <th>Email</th>
                <th>Site Web</th>
                <th>Activités</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClubs.map(club => (
                <tr key={club.id}>
                  <td className={styles.name}>{club.name}</td>
                  <td>{club.city}</td>
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
                  <td>{club.activities.join(', ') || '-'}</td>
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
