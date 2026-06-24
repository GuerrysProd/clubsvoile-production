import Link from 'next/link';
import type { Metadata } from 'next';
import '../home.css';
import CvNav from '../components/CvNav';
import CvFooter from '../components/CvFooter';
import JsonLd from '../components/JsonLd';
import { pageMeta, breadcrumbLd } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Mentions légales | ClubsVoile.fr',
  description: 'Mentions légales du site ClubsVoile.fr : éditeur, directeur de la publication, hébergeur et propriété intellectuelle.',
  path: '/mentions-legales',
});

export default function MentionsLegalesPage() {
  return (
    <div className="cv">
      <JsonLd data={breadcrumbLd([{ name: 'Accueil', path: '/' }, { name: 'Mentions légales', path: '/mentions-legales' }])} />
      <CvNav />

      <header className="search-hero">
        <div className="wrap">
          <nav className="breadcrumb">
            <Link href="/">Accueil</Link>
            <span>/</span>
            <span>Mentions légales</span>
          </nav>
          <span className="eyebrow">Informations légales</span>
          <h1>Mentions <em>légales</em></h1>
          <p className="lede">Conformément à la loi n°2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique.</p>
        </div>
      </header>

      <section className="block">
        <div className="wrap">
          <div className="seo-content">
            <h2>Éditeur du site</h2>
            <p>
              Le site <strong>ClubsVoile.fr</strong> est édité par&nbsp;:
            </p>
            <ul>
              <li>Nom commercial : <strong>Projec’toi</strong></li>
              <li>Statut juridique : <strong>Entreprise individuelle (EI) — Thibault Guerry</strong></li>
              <li>Adresse : <strong>28 rue Lavoisier, 83100 Toulon</strong></li>
              <li>SIRET : <strong>878 679 463 00017</strong></li>
              <li>Email : <a href="mailto:contact@clubsvoile.fr">contact@clubsvoile.fr</a></li>
            </ul>

            <h2>Directeur de la publication</h2>
            <p><strong>Thibault Guerry</strong></p>

            <h2>Hébergeur</h2>
            <p>
              Le site est hébergé par <strong>Hostinger International Ltd</strong><br />
              61 Lordou Vironos Street, 6023 Larnaca, Chypre<br />
              <a href="https://www.hostinger.fr" target="_blank" rel="noopener noreferrer">www.hostinger.fr</a>
            </p>

            <h2>Propriété intellectuelle</h2>
            <p>
              La structure générale du site, les textes éditoriaux et les éléments graphiques de ClubsVoile.fr sont protégés
              par le droit d’auteur. Toute reproduction non autorisée est interdite. Les noms, logos et marques des clubs
              référencés restent la propriété de leurs titulaires respectifs. Les notes et avis affichés proviennent des
              fiches publiques <strong>Google</strong> et demeurent la propriété de Google et de leurs auteurs.
            </p>

            <h2>Responsabilité</h2>
            <p>
              ClubsVoile.fr est un annuaire informatif. Les informations sur les clubs (activités, horaires, coordonnées)
              sont fournies à titre indicatif et peuvent évoluer. Malgré nos efforts, des inexactitudes peuvent subsister&nbsp;;
              pour toute correction, contactez-nous à <a href="mailto:contact@clubsvoile.fr">contact@clubsvoile.fr</a>.
            </p>

            <h2>Données personnelles</h2>
            <p>
              Le traitement de vos données personnelles est détaillé dans notre
              {' '}<Link href="/confidentialite">politique de confidentialité</Link>.
            </p>
          </div>
        </div>
      </section>

      <CvFooter />
    </div>
  );
}
