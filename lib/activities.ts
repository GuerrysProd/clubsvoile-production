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
  { key: 'Moussaillon', icon: 'ic-moussaillon', description: 'Les tout-petits à l’eau', image: '/activites/moussaillon.jpg', ageRange: '4-7 ans' },
  { key: 'Optimist', icon: 'ic-opti', description: 'Le premier bateau', image: '/activites/optimist.jpg', ageRange: '7-12 ans' },
  { key: 'Dériveur', icon: 'ic-deriveur', description: "L'école de la voile", image: '/activites/deriveur.jpg', ageRange: '10-16 ans' },
  { key: 'Catamaran', icon: 'ic-cata', description: 'Vitesse à deux coques', image: '/activites/catamaran.jpg', ageRange: '12 ans et +' },
  { key: 'Planche à voile / WindSurf', icon: 'ic-windsurf', description: 'Le grand classique', image: '/activites/planche-a-voile-windsurf.jpg', ageRange: '10 ans et +' },
  { key: 'WingFoil', icon: 'ic-wing', description: 'La glisse qui monte', trend: true, image: '/activites/wingfoil.jpg', ageRange: '14 ans et +' },
  { key: 'WindFoil', icon: 'ic-windfoil', description: 'Voile et hydrofoil', trend: true, image: '/activites/windfoil.jpg', ageRange: '16 ans et +' },
  { key: 'KiteSurf', icon: 'ic-kite', description: 'Traction et sauts', image: '/activites/kitesurf.jpg', ageRange: '12 ans et +' },
  { key: 'KiteFoil', icon: 'ic-kitefoil', description: 'Kite sur foil', trend: true, image: '/activites/kitefoil.jpg', ageRange: '14 ans et +' },
  { key: 'E-Foil', icon: 'ic-efoil', description: 'Vol électrique', trend: true, image: '/activites/e-foil.jpg', ageRange: '16 ans et +' },
  { key: 'Surf', icon: 'ic-surf', description: 'Glisse sur les vagues', image: '/activites/surf.jpg', ageRange: '8 ans et +' },
  { key: 'Kayak', icon: 'ic-kayak', description: 'Balade ou sport', image: '/activites/kayak.jpg', ageRange: '6 ans et +' },
  { key: 'Paddle', icon: 'ic-paddle', description: 'Balade au calme', image: '/activites/paddle.jpg', ageRange: '8 ans et +' },
  { key: 'Habitable/Croisière', icon: 'ic-croisiere', description: 'Le large en habitable', image: '/activites/habitable-croisiere.jpg', ageRange: 'Adultes' },
  { key: 'Char à voile', icon: 'ic-chararvoile', description: 'La vitesse sur le sable', image: '/activites/char-a-voile.jpg', ageRange: '10 ans et +' },
];

export const ACTIVITY_LABELS = ACTIVITIES.map((a) => a.key);

// Libellé d'affichage des pages-piliers d'activité (title / H1 / fil d'Ariane),
// aligné sur le terme réellement recherché (données Semrush). Le slug, lui,
// reste dérivé de `key` et DOIT matcher les valeurs stockées dans
// `clubs.activities` — on ne modifie donc QUE l'affichage, jamais l'URL ni la
// correspondance en base. Slugs concernés : `slugify(key)`.
const ACTIVITY_LABEL_OVERRIDE: Record<string, string> = {
  'planche-a-voile-windsurf': 'Planche à voile', // recherché « planche à voile » (2 900/mois)
};

/** Libellé d'affichage d'une activité à partir de son slug (défaut : sa clé). */
export function activityLabel(slug: string, fallbackKey: string): string {
  return ACTIVITY_LABEL_OVERRIDE[slug] || fallbackKey;
}
