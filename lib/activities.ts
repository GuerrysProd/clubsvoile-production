export interface ActivityOption {
  key: string;
  icon: string;
  description: string;
  trend?: boolean;
  image?: string;
  ageRange?: string;
}

// Liste canonique des supports/activités - utilisée pour la carte et le
// filtre de la page d'accueil, le filtre de recherche, les cases à cocher
// de l'admin, et la page /activites. Garder ces usages synchronisés sur
// cette source.
export const ACTIVITIES: ActivityOption[] = [
  { key: 'Moussaillon', icon: 'ic-moussaillon', description: 'Les tout-petits à l’eau', image: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=70&auto=format&fit=crop', ageRange: '4-7 ans' },
  { key: 'Optimist', icon: 'ic-opti', description: 'Le premier bateau', image: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=70&auto=format&fit=crop', ageRange: '7-12 ans' },
  { key: 'Dériveur', icon: 'ic-deriveur', description: "L'école de la voile", image: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&q=70&auto=format&fit=crop', ageRange: '10-16 ans' },
  { key: 'Catamaran', icon: 'ic-cata', description: 'Vitesse à deux coques', image: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&q=70&auto=format&fit=crop', ageRange: '12 ans et +' },
  { key: 'Planche à voile / WindSurf', icon: 'ic-windsurf', description: 'Le grand classique', image: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=70&auto=format&fit=crop', ageRange: '10 ans et +' },
  { key: 'WingFoil', icon: 'ic-wing', description: 'La glisse qui monte', trend: true, image: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&q=70&auto=format&fit=crop', ageRange: '14 ans et +' },
  { key: 'WindFoil', icon: 'ic-windfoil', description: 'Voile et hydrofoil', trend: true, image: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&q=70&auto=format&fit=crop', ageRange: '16 ans et +' },
  { key: 'KiteSurf', icon: 'ic-kite', description: 'Traction et sauts', image: 'https://images.unsplash.com/photo-1566024287286-457247b70310?w=800&q=70&auto=format&fit=crop', ageRange: '12 ans et +' },
  { key: 'KiteFoil', icon: 'ic-kitefoil', description: 'Kite sur foil', trend: true, image: 'https://images.unsplash.com/photo-1566024287286-457247b70310?w=800&q=70&auto=format&fit=crop', ageRange: '14 ans et +' },
  { key: 'E-Foil', icon: 'ic-efoil', description: 'Vol électrique', trend: true, image: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&q=70&auto=format&fit=crop', ageRange: '16 ans et +' },
  { key: 'Surf', icon: 'ic-surf', description: 'Glisse sur les vagues', image: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&q=70&auto=format&fit=crop', ageRange: '8 ans et +' },
  { key: 'Kayak', icon: 'ic-kayak', description: 'Balade ou sport', image: 'https://images.unsplash.com/photo-1543242594-c8bae8b9e708?w=800&q=70&auto=format&fit=crop', ageRange: '6 ans et +' },
  { key: 'Paddle', icon: 'ic-paddle', description: 'Balade au calme', image: 'https://images.unsplash.com/photo-1543242594-c8bae8b9e708?w=800&q=70&auto=format&fit=crop', ageRange: '8 ans et +' },
  { key: 'Habitable/Croisière', icon: 'ic-croisiere', description: 'Le large en habitable', image: 'https://images.unsplash.com/photo-1543242594-c8bae8b9e708?w=800&q=70&auto=format&fit=crop', ageRange: 'Adultes' },
  { key: 'Char à voile', icon: 'ic-chararvoile', description: 'La vitesse sur le sable', image: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800&q=70&auto=format&fit=crop', ageRange: '10 ans et +' },
];

export const ACTIVITY_LABELS = ACTIVITIES.map((a) => a.key);
