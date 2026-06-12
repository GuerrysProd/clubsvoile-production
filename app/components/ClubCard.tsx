// app/components/ClubCard.tsx
'use client';

import Link from 'next/link';
import { Club } from '@/lib/types';
import styles from './ClubCard.module.css';

interface ClubCardProps {
  club: Club;
}

export default function ClubCard({ club }: ClubCardProps) {
  return (
    <Link href={`/club/${club.id}`}>
      <article className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.name}>{club.name}</h3>
          <span className={styles.location}>
            {club.city}, {club.department}
          </span>
        </div>

        <p className={styles.description}>
          {club.description || 'Club de voile affilié FFV'}
        </p>

        <div className={styles.activities}>
          {club.activities.slice(0, 3).map((activity) => (
            <span key={activity} className={styles.badge}>
              {activity}
            </span>
          ))}
          {club.activities.length > 3 && (
            <span className={styles.badge}>+{club.activities.length - 3}</span>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.meta}>
            {club.phone && (
              <span className={styles.info}>📞 {club.phone}</span>
            )}
            {club.region && (
              <span className={styles.region}>{club.region}</span>
            )}
          </div>
          <span className={styles.arrow}>→</span>
        </div>
      </article>
    </Link>
  );
}
