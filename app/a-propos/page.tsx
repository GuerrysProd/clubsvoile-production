import Link from 'next/link';
import type { Metadata } from 'next';
import '../home.css';
import CvNav from '../components/CvNav';
import CvFooter from '../components/CvFooter';
import JsonLd from '../components/JsonLd';
import { pageMeta, breadcrumbLd } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'À propos de ClubsVoile.fr | L’annuaire de la voile',
  description:
    'ClubsVoile.fr, l’annuaire national des clubs de voile en France : notre mission, comment fonctionne l’annuaire et comment référencer votre club gratuitement.',
  path: '/a-propos',
});

export default function AProposPage() {
  return (
    <div className="cv">
      <JsonLd data={breadcrumbLd([{ name: 'Accueil', path: '/' }, { name: 'À propos', path: '/a-propos' }])} />
      <CvNav />

      <header className="search-hero">
        <div className="wrap">
          <nav className="breadcrumb">
            <Link href="/">Accueil</Link>
            <span>/</span>
            <span>À propos</span>
          </nav>
          <span className="eyebrow">À propos</span>
          <h1>L’annuaire qui réunit <em>toute la voile française.</em></h1>
          <p className="lede">De l’Optimist à la croisière, du Nord à la Corse : ClubsVoile.fr aide chaque passionné à trouver le bon club, près de chez lui.</p>
        </div>
      </header>

      <section className="block">
        <div className="wrap">
          <div className="seo-content">
            <h2>Notre mission</h2>
            <p>
              ClubsVoile.fr recense les clubs de voile, écoles de voile et bases nautiques de toute la France pour
              répondre à une question simple : <strong>où apprendre et pratiquer la voile près de chez moi&nbsp;?</strong>
              Notre objectif est d’offrir l’annuaire le plus complet et le plus clair du nautisme français, afin de
              rapprocher les pratiquants — débutants comme confirmés — des structures qui les accueilleront.
            </p>

            <h2>Comment fonctionne l’annuaire</h2>
            <p>
              Vous pouvez explorer les clubs <Link href="/#regions">par région</Link>, <Link href="/activites">par activité</Link>
              (catamaran, dériveur, planche à voile, wingfoil, kitesurf, paddle, char à voile…) ou directement depuis la
              <Link href="/#carte"> carte interactive</Link>. Chaque club dispose d’une fiche détaillée : activités proposées,
              localisation, horaires et coordonnées de contact.
            </p>
            <p>
              Les notes affichées sur les fiches proviennent des avis publics <strong>Google</strong> et sont indiquées comme
              telles, par souci de transparence. ClubsVoile.fr ne collecte pas d’avis pour le moment.
            </p>

            <h2>Vous gérez un club&nbsp;?</h2>
            <p>
              Le référencement est <strong>100&nbsp;% gratuit</strong>. Gagnez en visibilité auprès de milliers de passionnés qui
              cherchent leur prochain club : <Link href="/contact">contactez-nous</Link> pour référencer le vôtre ou mettre à jour
              votre fiche.
            </p>

            <h2>Nous contacter</h2>
            <p>
              Une question, une correction, un partenariat&nbsp;? Écrivez-nous à
              {' '}<a href="mailto:contact@clubsvoile.fr">contact@clubsvoile.fr</a> ou via notre
              {' '}<Link href="/contact">page de contact</Link>.
            </p>
          </div>
        </div>
      </section>

      <CvFooter />
    </div>
  );
}
