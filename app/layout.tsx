// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Chrome from './components/Chrome';
import JsonLd from './components/JsonLd';
import { SITE_URL, SITE_NAME } from '@/lib/seo';

const DESCRIPTION =
  'Découvrez 1200+ clubs de voile en France. Recherche par région, activité et localisation. Carte interactive, avis certifiés et contact direct.';

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
    <html lang="fr">
      <body>
        <JsonLd data={siteLd} />
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
