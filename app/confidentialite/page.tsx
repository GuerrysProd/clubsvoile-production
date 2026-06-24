import Link from 'next/link';
import type { Metadata } from 'next';
import '../home.css';
import CvNav from '../components/CvNav';
import CvFooter from '../components/CvFooter';
import JsonLd from '../components/JsonLd';
import { pageMeta, breadcrumbLd } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Politique de confidentialité | ClubsVoile.fr',
  description: 'Comment ClubsVoile.fr collecte, utilise et protège vos données personnelles, conformément au RGPD.',
  path: '/confidentialite',
});

export default function ConfidentialitePage() {
  return (
    <div className="cv">
      <JsonLd data={breadcrumbLd([{ name: 'Accueil', path: '/' }, { name: 'Confidentialité', path: '/confidentialite' }])} />
      <CvNav />

      <header className="search-hero">
        <div className="wrap">
          <nav className="breadcrumb">
            <Link href="/">Accueil</Link>
            <span>/</span>
            <span>Confidentialité</span>
          </nav>
          <span className="eyebrow">Vos données</span>
          <h1>Politique de <em>confidentialité</em></h1>
          <p className="lede">ClubsVoile.fr respecte votre vie privée et traite vos données conformément au RGPD.</p>
        </div>
      </header>

      <section className="block">
        <div className="wrap">
          <div className="seo-content">
            <h2>Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données est l’éditeur de ClubsVoile.fr&nbsp;:
              <strong> Projec’toi (entreprise individuelle Thibault Guerry), 28 rue Lavoisier, 83100 Toulon</strong>. Contact&nbsp;:
              {' '}<a href="mailto:contact@clubsvoile.fr">contact@clubsvoile.fr</a>.
            </p>

            <h2>Données collectées</h2>
            <p>
              Nous collectons uniquement les données que vous nous transmettez via notre
              {' '}<Link href="/contact">formulaire de contact</Link>&nbsp;: <strong>nom du club, votre nom, adresse email,
              téléphone (facultatif) et le contenu de votre message</strong>. Le site ne crée pas de compte utilisateur public
              et ne collecte pas de données sensibles.
            </p>

            <h2>Finalités et base légale</h2>
            <ul>
              <li>Répondre à vos demandes de contact et de référencement de club (base légale&nbsp;: votre consentement / l’intérêt légitime à traiter votre demande).</li>
            </ul>

            <h2>Conservation des données</h2>
            <p>
              Les demandes de contact sont conservées pendant <strong>3 ans</strong> à compter du dernier
              échange, puis supprimées ou anonymisées.
            </p>

            <h2>Destinataires et sous-traitants</h2>
            <p>Vos données peuvent être traitées par nos prestataires techniques&nbsp;:</p>
            <ul>
              <li><strong>Supabase</strong> — hébergement de la base de données (stockage des messages de contact).</li>
              <li><strong>Hostinger</strong> — hébergement du site et acheminement des emails.</li>
              <li><strong>CARTO / OpenStreetMap</strong> — affichage de la carte interactive (votre adresse IP peut être traitée lors du chargement des fonds de carte).</li>
            </ul>
            <p>Nous ne vendons ni ne louons vos données personnelles à des tiers.</p>

            <h2>Cookies et traceurs</h2>
            <p>
              ClubsVoile.fr n’utilise pas de cookies publicitaires ni de traceurs de suivi à des fins marketing. Seules des
              ressources techniques nécessaires au fonctionnement du site (carte, polices auto-hébergées) sont chargées.
            </p>

            <h2>Vos droits</h2>
            <p>
              Conformément au RGPD, vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation et
              d’opposition au traitement de vos données. Pour exercer ces droits, écrivez-nous à
              {' '}<a href="mailto:contact@clubsvoile.fr">contact@clubsvoile.fr</a>. Vous pouvez également introduire une
              réclamation auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.
            </p>
          </div>
        </div>
      </section>

      <CvFooter />
    </div>
  );
}
