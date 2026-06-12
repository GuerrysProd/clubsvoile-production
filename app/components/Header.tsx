// app/components/Header.tsx
'use client';

import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className={styles.boussole}>
            <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1"/>
            <path d="M16 4L20 14H12L16 4Z" fill="currentColor"/>
            <path d="M16 28L12 18H20L16 28Z" fill="currentColor" opacity="0.5"/>
          </svg>
          <span>ClubsVoile</span>
        </Link>
        
        <nav className={styles.nav}>
          <Link href="/">Accueil</Link>
          <Link href="/clubs">Clubs</Link>
          <a href="mailto:contact@clubsvoile.fr">Contact</a>
        </nav>
      </div>
    </header>
  );
}
