import type { Metadata } from 'next';

// La page /search produit des URLs paramétrées (?support=&region=&ville=) :
// contenu mince/dupliqué → on la met en noindex,follow. Les pages
// d'atterrissage SEO sont les /{activité}, /{région}, /{activité}/{ville}.
export const metadata: Metadata = {
  title: 'Rechercher un club de voile | ClubsVoile.fr',
  description: 'Filtrez les clubs de voile par activité, région et ville pour trouver le club idéal.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/search' },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
