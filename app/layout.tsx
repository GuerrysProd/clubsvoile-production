// app/layout.tsx
import type { Metadata } from 'next';
import { Space_Grotesk, Newsreader, Inter } from 'next/font/google';
import './globals.css';
import Chrome from './components/Chrome';
import JsonLd from './components/JsonLd';
import { SITE_URL, SITE_NAME } from '@/lib/seo';

// Polices auto-hébergées (pas de requête bloquante vers Google Fonts,
// font-display: swap + preload automatiques). Système « Cap » :
// Space Grotesk (titres/UI, caractère sportif), Newsreader italic (accents
// éditoriaux premium), Inter (texte courant).
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const serif = Newsreader({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-serif', display: 'swap', adjustFontFallback: false });
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

const DESCRIPTION =
  'Découvrez 1200+ clubs de voile en France. Recherche par région, activité et localisation. Carte interactive, notes Google et contact direct.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'ClubsVoile.fr - Annuaire National des Clubs de Voile',
  description: DESCRIPTION,
  keywords: 'club voile, école voile, voile France, dériveur, catamaran, navigation',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: SITE_NAME,
    url: '/',
    title: 'ClubsVoile.fr - Annuaire National des Clubs de Voile',
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClubsVoile.fr - Annuaire National des Clubs de Voile',
    description: DESCRIPTION,
  },
};

const siteLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: DESCRIPTION,
    logo: `${SITE_URL}/icon.svg`,
    email: 'contact@clubsvoile.fr',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'contact@clubsvoile.fr',
      areaServed: 'FR',
      availableLanguage: 'French',
    },
    sameAs: [
      'https://www.instagram.com/clubsvoile/',
      'https://www.facebook.com/profile.php?id=61591121471285',
      'https://www.linkedin.com/company/130524313',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${display.variable} ${serif.variable} ${body.variable}`}>
      <body>
        <JsonLd data={siteLd} />
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
