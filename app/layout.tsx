// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Chrome from './components/Chrome';

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
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
