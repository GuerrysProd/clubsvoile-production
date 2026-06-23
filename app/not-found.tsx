import Link from 'next/link';
import './home.css';
import CvNav from './components/CvNav';
import CvFooter from './components/CvFooter';

export default function NotFound() {
  return (
    <div className="cv">
      <CvNav />

      <header className="hero nf-hero">
        <svg className="contours" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g fill="none" stroke="#1B4368" strokeWidth="1.5">
            <path d="M-50 140 C 200 80, 420 200, 650 130 S 1050 60, 1280 160" />
            <path d="M-50 260 C 240 210, 470 320, 700 250 S 1080 190, 1280 280" stroke="#FF5436" strokeOpacity=".35" />
            <path d="M-50 400 C 250 350, 480 460, 720 390 S 1090 330, 1280 420" />
            <path d="M-50 540 C 270 490, 520 600, 760 530 S 1110 470, 1280 560" />
          </g>
        </svg>

        <div className="wrap nf-in">
          <span className="eyebrow">Erreur 404 · Homme à la mer</span>

          <div className="nf-404" aria-label="404">
            <span aria-hidden="true">4</span>
            <svg className="nf-buoy-rope" viewBox="0 0 100 100" role="img" aria-label="bouée de sauvetage">
              <circle cx="50" cy="50" r="44" fill="#FF5436" />
              <circle cx="50" cy="50" r="23" fill="#0B1E33" />
              <rect x="42" y="4" width="16" height="22" rx="3" fill="#fff" />
              <rect x="42" y="74" width="16" height="22" rx="3" fill="#fff" />
              <rect x="4" y="42" width="22" height="16" rx="3" fill="#fff" />
              <rect x="74" y="42" width="22" height="16" rx="3" fill="#fff" />
            </svg>
            <span aria-hidden="true">4</span>
          </div>

          <h1>Vous avez perdu le cap.</h1>
          <p className="lede">
            La page que vous cherchez a largué les amarres : elle n&apos;existe plus, a changé de port,
            ou n&apos;a jamais pris la mer. Pas de panique — on vous ramène en eaux connues.
          </p>

          <div className="nf-cta">
            <Link href="/" className="sim-go as-link">
              Cap sur l&apos;accueil
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
            <Link href="/search" className="nf-outline">Explorer les clubs</Link>
          </div>

          <div className="nf-links">
            <span>Ou mettez le cap sur</span>
            <Link href="/activites">les activités</Link>
            <span>·</span>
            <Link href="/#regions">les régions</Link>
          </div>
        </div>
      </header>

      <CvFooter />
    </div>
  );
}
