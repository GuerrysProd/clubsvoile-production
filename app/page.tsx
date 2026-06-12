// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  const [stats, setStats] = useState({
    clubsCount: 0,
    regionsCount: 0,
    activitiesCount: 0,
  });

  useEffect(() => {
    // Fetch stats from API
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch('/api/clubs?limit=1');
      const data = await res.json();
      setStats({
        clubsCount: data.total || 0,
        regionsCount: 18,
        activitiesCount: 8,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }

  return (
    <main className={styles.main}>
      {/* HERO SECTION - Sportif & Aventure */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Découvrez les meilleurs clubs de voile en France
            </h1>
            <p className={styles.heroSubtitle}>
              Plus de {stats.clubsCount}+ clubs, {stats.regionsCount} régions, une seule plateforme.
              Trouvez votre prochain spot et embarquez pour l'aventure ! 🌊
            </p>
            <div className={styles.heroCTA}>
              <Link href="/search" className={`${styles.btn} ${styles.btnPrimary}`}>
                Explorez les clubs →
              </Link>
              <Link href="#how-it-works" className={`${styles.btn} ${styles.btnSecondary}`}>
                Découvrez comment ça marche
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroAnimation}>
              <svg
                width="300"
                height="300"
                viewBox="0 0 300 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Sailboat animation */}
                <circle cx="150" cy="150" r="140" stroke="#00d4ff" strokeWidth="2" opacity="0.2" />
                <path
                  d="M 150 80 L 120 200 L 180 200 Z"
                  fill="#00d4ff"
                  opacity="0.8"
                  className={styles.sailAnimation}
                />
                <circle cx="150" cy="200" r="15" fill="#0066cc" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className={styles.stats}>
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{stats.clubsCount}+</div>
            <div className={styles.statLabel}>Clubs actifs</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{stats.regionsCount}</div>
            <div className={styles.statLabel}>Régions en France</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{stats.activitiesCount}</div>
            <div className={styles.statLabel}>Types d'activités</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.howItWorks} id="how-it-works">
        <h2>Comment ça marche ? 🎯</h2>
        <div className={styles.stepsGrid}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Cherchez</h3>
            <p>Recherchez un club par ville, région ou activité</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Découvrez</h3>
            <p>Consultez les infos, avis et photos des clubs</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Contactez</h3>
            <p>Appelez ou écrivez directement pour plus d'infos</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <h3>Naviguez ! 🌊</h3>
            <p>Embarquez et profitez de votre nouveau club</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Vous gérez un club de voile ?</h2>
          <p>Rejoignez ClubsVoile et améliorez votre visibilité auprès de milliers de passionnés</p>
          <div className={styles.ctaButtons}>
            <Link href="/club/register" className={`${styles.btn} ${styles.btnPrimary}`}>
              Inscrire mon club
            </Link>
            <Link href="mailto:contact@clubsvoile.fr" className={`${styles.btn} ${styles.btnSecondary}`}>
              Questions ?
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.features}>
        <h2>Pourquoi ClubsVoile ? ⚡</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🗺️</div>
            <h3>Carte interactive</h3>
            <p>Visualisez les clubs sur la map en temps réel</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>⭐</div>
            <h3>Avis certifiés</h3>
            <p>Lisez les avis d'autres navigateurs comme vous</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📱</div>
            <h3>Mobile-friendly</h3>
            <p>Accédez à ClubsVoile partout, sur tous les appareils</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🚀</div>
            <h3>Données à jour</h3>
            <p>Infos fraîches mise à jour chaque semaine</p>
          </div>
        </div>
      </section>
    </main>
  );
}
