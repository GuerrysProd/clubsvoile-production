import Link from 'next/link';
import type { Metadata } from 'next';
import '../home.css';
import CvNav from '../components/CvNav';
import CvFooter from '../components/CvFooter';
import ContactForm from '../components/ContactForm';
import JsonLd from '../components/JsonLd';
import { pageMeta, breadcrumbLd, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Référencer votre club de voile — gratuit | ClubsVoile.fr',
  description:
    'Vous gérez un club de voile ? Gagnez en visibilité gratuitement sur l’annuaire n°1 de la voile en France. Contactez-nous pour référencer votre club.',
  path: '/contact',
});

const BENEFITS = [
  {
    title: '100% gratuit',
    text: 'Le référencement et la mise en avant de votre club ne vous coûtent rien.',
    icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  },
  {
    title: 'Visible sur Google',
    text: 'Une fiche optimisée pour le SEO qui vous amène de nouveaux pratiquants.',
    icon: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>,
  },
  {
    title: "L'annuaire n°1 de la voile",
    text: 'Rejoignez plus de 1 200 clubs déjà référencés sur tout le littoral français.',
    icon: <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3" />,
  },
  {
    title: 'Votre vitrine, à jour',
    text: 'Activités, horaires, photos et contact : tout est réuni sur une seule fiche.',
    icon: <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 9h18" /></>,
  },
];

export default function ContactPage() {
  return (
    <div className="cv">
      <JsonLd
        data={[
          breadcrumbLd([
            { name: 'Accueil', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact — ClubsVoile.fr',
            url: `${SITE_URL}/contact`,
            description:
              'Contactez ClubsVoile.fr pour référencer gratuitement votre club de voile ou pour toute question.',
            mainEntity: {
              '@type': 'Organization',
              name: 'ClubsVoile.fr',
              url: SITE_URL,
              email: 'contact@clubsvoile.fr',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer support',
                email: 'contact@clubsvoile.fr',
                areaServed: 'FR',
                availableLanguage: 'French',
              },
            },
          },
        ]}
      />
      <CvNav />

      <header className="search-hero">
        <div className="wrap">
          <nav className="breadcrumb">
            <Link href="/">Accueil</Link>
            <span>/</span>
            <span>Contact</span>
          </nav>
          <span className="eyebrow">Gérants de club</span>
          <h1>Faites entrer votre club <em>dans le port.</em></h1>
          <p className="lede">
            Chaque jour, des passionnés cherchent où naviguer. Offrez-leur un cap vers chez vous —
            référencez votre club sur l&apos;annuaire n°1 de la voile, gratuitement.
          </p>
        </div>
      </header>

      <section className="block">
        <div className="wrap">
          <div className="contact-layout">
            <div className="contact-pitch">
              <div className="sec-eyebrow">Pourquoi nous rejoindre</div>
              <h2 className="sec-title">Plus de visibilité, zéro budget.</h2>
              <ul className="contact-benefits">
                {BENEFITS.map((b) => (
                  <li key={b.title} className="contact-benefit">
                    <span className="bic">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{b.icon}</svg>
                    </span>
                    <div>
                      <h3>{b.title}</h3>
                      <p>{b.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      <CvFooter />
    </div>
  );
}
