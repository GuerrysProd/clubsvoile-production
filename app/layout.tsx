// app/layout.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: 'ClubsVoile.fr - Annuaire National des Clubs de Voile',
  description: 'Découvrez 1200+ clubs de voile en France. Recherche par région, activité et localisation. Carte interactive, avis certifiés et contact direct.',
  keywords: 'club voile, école voile, voile France, dériveur, catamaran, navigation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link href="/" className={styles.logo}>
          ⛵ ClubsVoile
        </Link>
        <nav className={styles.nav}>
          <Link href="/">Accueil</Link>
          <Link href="/search">Explorer</Link>
          <Link href="mailto:contact@clubsvoile.fr">Contact</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerColumn}>
          <h4>ClubsVoile.fr</h4>
          <p>L'annuaire national des clubs de voile en France</p>
        </div>
        <div className={styles.footerColumn}>
          <h4>Navigation</h4>
          <ul>
            <li><Link href="/">Accueil</Link></li>
            <li><Link href="/search">Explorer les clubs</Link></li>
            <li><Link href="/club/register">Inscrire mon club</Link></li>
          </ul>
        </div>
        <div className={styles.footerColumn}>
          <h4>Contact</h4>
          <p>📧 contact@clubsvoile.fr</p>
          <p>🌐 www.clubsvoile.fr</p>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; 2026 ClubsVoile. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
