'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './edit.module.css';
import { ACTIVITY_LABELS } from '@/lib/activities';

interface Club {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  zip_code: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  review_count: number;
  activities: string[];
  schedule_open: string;
  latitude: number;
  longitude: number;
}

const ACTIVITY_OPTIONS = ACTIVITY_LABELS;

export default function EditClub() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchClub();
  }, [id]);

  const fetchClub = async () => {
    try {
      const response = await fetch(`/api/admin/clubs/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) router.push('/admin/login');
        return;
      }

      const data = await response.json();
      setClub(data);
    } catch (error) {
      console.error('Error fetching club:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setClub(prev => prev ? { ...prev, [field]: value } : null);
  };

  const toggleActivity = (activity: string) => {
    if (!club) return;
    const activities = club.activities.includes(activity)
      ? club.activities.filter(a => a !== activity)
      : [...club.activities, activity];
    handleChange('activities', activities);
  };

  const handleSave = async () => {
    if (!club) return;
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/clubs/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(club),
      });

      if (response.ok) {
        alert('Club sauvegardé !');
        router.push('/admin/clubs');
      } else {
        alert('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving club:', error);
      alert('Erreur: ' + String(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.loading}>Chargement...</div>;
  if (!club) return <div className={styles.loading}>Club non trouvé</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/admin/clubs" className={styles.backBtn}>← Retour</Link>
        <h1>✏️ Éditer: {club.name}</h1>
      </div>

      <div className={styles.form}>
        <div className={styles.group}>
          <label>Nom du club</label>
          <input
            type="text"
            value={club.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.group}>
            <label>Adresse</label>
            <input
              type="text"
              value={club.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
          <div className={styles.group}>
            <label>Ville</label>
            <input
              type="text"
              value={club.city}
              onChange={(e) => handleChange('city', e.target.value)}
            />
          </div>
          <div className={styles.group}>
            <label>Code Postal</label>
            <input
              type="text"
              value={club.zip_code}
              onChange={(e) => handleChange('zip_code', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.group}>
            <label>Téléphone</label>
            <input
              type="text"
              value={club.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
          <div className={styles.group}>
            <label>Email</label>
            <input
              type="email"
              value={club.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.group}>
          <label>Site Web</label>
          <input
            type="url"
            value={club.website}
            onChange={(e) => handleChange('website', e.target.value)}
          />
        </div>

        <div className={styles.group}>
          <label>Horaires</label>
          <textarea
            value={club.schedule_open}
            onChange={(e) => handleChange('schedule_open', e.target.value)}
            rows={3}
          />
        </div>

        <div className={styles.group}>
          <label>Activités</label>
          <div className={styles.activities}>
            {ACTIVITY_OPTIONS.map(activity => (
              <label key={activity} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={club.activities.includes(activity)}
                  onChange={() => toggleActivity(activity)}
                />
                {activity}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.group}>
            <label>Note Google</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={club.rating}
              onChange={(e) => handleChange('rating', parseFloat(e.target.value))}
            />
          </div>
          <div className={styles.group}>
            <label>Nombre d'avis</label>
            <input
              type="number"
              value={club.review_count}
              onChange={(e) => handleChange('review_count', parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={handleSave} disabled={saving} className={styles.saveBtn}>
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
          <Link href="/admin/clubs" className={styles.cancelBtn}>Annuler</Link>
        </div>
      </div>
    </div>
  );
}
