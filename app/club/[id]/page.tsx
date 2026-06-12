'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import MapSimple from '@/app/components/MapSimple';
import styles from './page.module.css';

interface Club {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
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

export default function ClubPage() {
  const params = useParams();
  const id = params.id as string;
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClub();
  }, [id]);

  async function fetchClub() {
    try {
      const res = await fetch(`/api/clubs/${id}`);
      if (!res.ok) throw new Error('Club not found');
      const data = await res.json();
      setClub(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className={styles.loading}>Chargement...</div>;
  if (!club) return <div className={styles.error}>Club non trouvé</div>;

  return (
    <main className={styles.container}>
      <Link href="/search" className={styles.backBtn}>← Retour à la recherche</Link>

      <div className={styles.header}>
        <h1>{club.name}</h1>
        <div className={styles.rating}>⭐ {club.rating} ({club.review_count} avis)</div>
      </div>

      <div className={styles.content}>
        <section className={styles.infoBox}>
          <h2>📍 Informations</h2>
          <p><strong>Adresse :</strong> {club.address || 'Non disponible'}</p>
          <p><strong>Téléphone :</strong> {club.phone || 'Non disponible'}</p>
          <p><strong>Email :</strong> {club.email || 'Non disponible'}</p>
          <p><strong>Site web :</strong> {club.website ? <a href={club.website} target="_blank" rel="noopener">Visiter</a> : 'Non disponible'}</p>
          <p><strong>Horaires :</strong> {club.schedule_open || 'Non disponibles'}</p>
        </section>

        <section className={styles.infoBox}>
          <h2>🎯 Activités</h2>
          <div className={styles.activities}>
            {club.activities?.map(activity => (
              <span key={activity} className={styles.activity}>{activity}</span>
            ))}
          </div>
        </section>

        <section className={styles.infoBox}>
          <h2>📝 Description</h2>
          <p>{club.description}</p>
        </section>

        <section className={styles.infoBox}>
          <h2>🗺️ Localisation</h2>
          <MapSimple clubs={[club]} />
        </section>
      </div>
    </main>
  );
}
