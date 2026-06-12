export interface ActivityOption {
  key: string;
  icon: string;
  description: string;
  trend?: boolean;
}

// Liste canonique des supports/activités - utilisée pour la carte et le
// filtre de la page d'accueil, le filtre de recherche, et les cases à
// cocher de l'admin. Garder ces 3 usages synchronisés sur cette source.
export const ACTIVITIES: ActivityOption[] = [
  { key: 'Moussaillon', icon: 'ic-moussaillon', description: 'Les tout-petits à l’eau' },
  { key: 'Optimist', icon: 'ic-opti', description: 'Le premier bateau' },
  { key: 'Dériveur', icon: 'ic-deriveur', description: "L'école de la voile" },
  { key: 'Catamaran', icon: 'ic-cata', description: 'Vitesse à deux coques' },
  { key: 'Planche à voile / WindSurf', icon: 'ic-windsurf', description: 'Le grand classique' },
  { key: 'WingFoil', icon: 'ic-wing', description: 'La glisse qui monte', trend: true },
  { key: 'WindFoil', icon: 'ic-windfoil', description: 'Voile et hydrofoil', trend: true },
  { key: 'KiteSurf', icon: 'ic-kite', description: 'Traction et sauts' },
  { key: 'KiteFoil', icon: 'ic-kitefoil', description: 'Kite sur foil', trend: true },
  { key: 'E-Foil', icon: 'ic-efoil', description: 'Vol électrique', trend: true },
  { key: 'Surf', icon: 'ic-surf', description: 'Glisse sur les vagues' },
  { key: 'Kayak', icon: 'ic-kayak', description: 'Balade ou sport' },
  { key: 'Paddle', icon: 'ic-paddle', description: 'Balade au calme' },
  { key: 'Habitable/Croisière', icon: 'ic-croisiere', description: 'Le large en habitable' },
];

export const ACTIVITY_LABELS = ACTIVITIES.map((a) => a.key);
