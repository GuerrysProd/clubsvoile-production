# Prompt à coller dans Claude pour la refonte design de ClubsVoile.fr

---

## Contexte

Je gère **ClubsVoile.fr**, l'annuaire français des clubs de voile et activités nautiques (Optimist, catamaran, planche à voile, wingfoil, kitesurf, kayak, paddle, char à voile, etc.). Le site recense plus de 1 800 pages (clubs, villes, régions, activités) et vise à devenir LA référence pour trouver un club de voile en France.

**Stack technique** : Next.js 14 (App Router), rendu serveur (SSR/ISR), CSS classique (pas de Tailwind), Supabase en base de données. Le design doit donc être livrable en **HTML/CSS sémantique** (classes simples, pas de framework JS de composants), facilement intégrable dans des composants React existants.

## Identité de marque actuelle (à respecter ou à challenger explicitement)

- **Nom** : ClubsVoile.fr
- **Logo** : concept « Le repère » — un pin de carte corail contenant un voilier blanc stylisé (symbolise à la fois l'annuaire/la localisation et la voile).
- **Palette actuelle** :
  - Marine profond `#0B1E33` (fond principal, header, footer)
  - Bleu marine clair `#11304F` / `#1B4368` (dégradés, cartes)
  - Corail `#FF5436` / corail foncé `#E0381C` (accent, CTA, logo)
  - Crème `#F5F0E6` (fond des sections claires)
  - Écume `#EAF2F3` (fonds secondaires clairs)
  - Blanc `#FFFFFF`
  - Teal `#0E5C5C` (couleur secondaire peu utilisée actuellement)
- **Typographies actuelles** : Bricolage Grotesque (titres, display, assez géométrique/contemporaine) + Inter (texte courant).
- **Ton actuel** : un mélange « carnet de bord nautique » et produit web moderne — chaleureux (crème, corail) mais professionnel (marine profond, grilles nettes).

## Ce qui existe déjà (pages et composants à habiller)

1. **Page d'accueil** : hero sombre avec simulateur de recherche (sélection activité + ville), stats, grille des supports/activités (cartes avec icône), carte de France interactive des régions, carte Leaflet des clubs, clubs "à l'affiche", témoignages/avis Google.
2. **Pages géographiques** : région → département → ville → fiche club (fil d'Ariane, grille de cartes "geo-card", grille de résultats clubs "result-card").
3. **Pages activité** (ex. /paddle, /catamaran) et **activité × ville** (ex. /paddle/marseille) : hero, clubs à l'affiche, liste des villes, carte.
4. **Pages-piliers commerciales** (nouvelles) : /stage-de-voile, /ecole-de-voile, /club-de-voile — hero + contenu éditorial + FAQ accordéon + maillage par activité/région/ville.
5. **Fiche club** : hero avec photo de couverture, logo rond, galerie photo, infos pratiques (adresse, téléphone, horaires, site web), carte de localisation, bouton d'itinéraire.
6. **Page recherche** (/search) avec filtres.
7. **Navigation** : header avec burger mobile, footer en 5 colonnes (Explorer, Apprendre, Clubs, Contact, Régions/Activités) + bandeau légal.
8. **Pages légales, contact** (formulaire avec champs adresse/téléphone/message).

## Contraintes SEO non négociables (ne PAS casser)

- Le design doit garder une **hiérarchie de titres claire** (un seul H1 par page, H2/H3 structurés) — ne pas remplacer le H1 par un logo/visuel sans texte.
- Les pages doivent rester **lisibles sans JavaScript** (contenu dans le HTML, pas de lazy-render du texte principal).
- Garder des **temps de chargement très rapides** : le site obtient actuellement 95-100/100 en Core Web Vitals (LCP ~785ms, CLS 0). Éviter les animations lourdes, les polices custom non optimisées, les images non dimensionnées.
- Les call-to-action principaux (recherche, "voir le club", "référencer mon club") doivent rester évidents et accessibles au clavier.
- Le design doit bien fonctionner avec du **contenu généré par IA de longueur variable** (intros éditoriales de 200-500 mots, FAQ de 3-6 questions) — pas seulement avec du contenu "parfait" choisi à la main.

## Ce que je vous demande

Je veux une **proposition de refonte (ou d'évolution) du design visuel** de ClubsVoile.fr. Vous pouvez :
1. Soit **affiner/moderniser le système actuel** (marine + corail + crème, Bricolage Grotesque + Inter) si vous pensez qu'il est pertinent.
2. Soit **proposer une direction artistique différente** si vous identifiez un problème de fond dans l'identité actuelle (par exemple : pas assez différenciant, pas assez "nautique", trop générique parmi les sites d'annuaires).

Dans les deux cas, livrez :

### 1. Direction artistique
- Palette de couleurs précise (codes hex), avec justification de chaque couleur et son usage (fond, accent, texte, état hover/actif).
- Typographies (avec alternatives gratuites/Google Fonts si possible, pour rester économique), échelle de tailles (H1 à corps de texte), poids.
- Système d'espacement et de rayons de bordure (coins arrondis ou non, intensité).
- Traitement des photos (clubs, mer, bateaux) : filtres, overlays, ratios.
- Traitement des icônes (style des pictos d'activités : Optimist, catamaran, etc.).

### 2. Maquettes des pages clés (en HTML/CSS autonome, sans dépendance JS)
- Page d'accueil complète (hero + simulateur + grille activités + carte régions).
- Une page géographique (liste de clubs dans une ville).
- Une fiche club détaillée.
- Une page-pilier éditoriale (type /stage-de-voile) avec section FAQ.
- Le header et le footer.

### 3. Composants UI réutilisables
- Carte "activité" (icône + nom + nombre de clubs).
- Carte "club" dans une grille de résultats (note Google, ville, pills d'activités).
- Carte "geo" (région/département/ville avec compteur).
- Accordéon FAQ.
- Formulaire de recherche/simulateur.
- Boutons (primaire, secondaire, outline), badges/pills.

### 4. Justification UX/conversion
Pour chaque choix de design important, expliquez en une phrase l'objectif : lisibilité, confiance (E-E-A-T), taux de clic, conversion vers la fiche club ou le formulaire de contact.

## Format de livraison souhaité

- Code HTML/CSS directement intégrable (classes CSS nommées de façon cohérente, idéalement avec des variables CSS `:root` pour les couleurs/typo, comme le système actuel).
- Pas de framework CSS (pas de Tailwind, pas de Bootstrap) — CSS vanilla ou variables CSS uniquement, pour matcher l'architecture actuelle (`app/home.css`).
- Si vous proposez des illustrations/icônes, donnez-les en SVG inline ou décrivez précisément comment les obtenir (banque d'icônes gratuite, génération).

## Contexte concurrentiel (pour situer le niveau visé)

Le marché des annuaires nautiques en France est encore peu structuré visuellement — beaucoup de sites concurrents sont basiques (templates génériques) ou très orientés "marketplace de réservation" sans réel travail d'identité de marque. ClubsVoile.fr a l'opportunité de devenir la référence visuelle du secteur, avec un univers fort qui inspire confiance et donne envie de pratiquer.
