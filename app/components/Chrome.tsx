'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../layout.module.css';

export default function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const useCvChrome = !pathname.startsWith('/admin');

  return (
    <>
      {!useCvChrome && <Header />}
      {children}
      {!useCvChrome && <Footer />}
    </>
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
          <p>L&apos;annuaire national des clubs de voile en France</p>
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
