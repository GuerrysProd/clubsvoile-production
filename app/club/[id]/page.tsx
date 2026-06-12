'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './club.module.css';

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
  photos: string[];
  schedule_open: string;
  latitude: number;
  longitude: number;
}

export default function ClubDetail() {
  const params = useParams();
  const id = params.id as string;
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    fetch(`/api/clubs/${id}`)
      .then(r => r.json())
      .then(data => {
        setClub(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className={styles.loading}>Chargement...</div>;
  if (!club) return <div className={styles.notFound}>Club non trouvé</div>;

  return (
    <div className={styles.container}>
      <Link href="/search" className={styles.backBtn}>← Retour</Link>
      
      <div className={styles.header}>
        <h1>{club.name}</h1>
        <div className={styles.rating}>
          ⭐ {club.rating} ({club.review_count} avis)
        </div>
      </div>

      {club.photos && club.photos.length > 0 && (
        <div className={styles.gallery}>
          {club.photos.slice(0, 3).map((photo, i) => (
            <img key={i} src={photo} alt={`${club.name} ${i}`} />
          ))}
        </div>
      )}

      <div className={styles.info}>
        <h2>Informations</h2>
        <p><strong>Adresse :</strong> {club.address}, {club.city}</p>
        <p><strong>Téléphone :</strong> {club.phone || 'Non disponible'}</p>
        <p><strong>Email :</strong> {club.email || 'Non disponible'}</p>
        <p><strong>Site web :</strong> {club.website ? <a href={club.website} target="_blank">{club.website}</a> : 'Non disponible'}</p>
        <p><strong>Horaires :</strong> {club.schedule_open}</p>
      </div>

      <div className={styles.activities}>
        <h2>Activités</h2>
        <div className={styles.tags}>
          {club.activities && club.activities.map((activity, i) => (
            <span key={i} className={styles.tag}>{activity}</span>
          ))}
        </div>
      </div>

      <div className={styles.description}>
        <h2>Description</h2>
        <p>{club.description}</p>
      </div>

      <div className={styles.map}>
        <h2>Localisation</h2>
        <p>Latitude: {club.latitude}, Longitude: {club.longitude}</p>
      </div>
    </div>
  );
}
