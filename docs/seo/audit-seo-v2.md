# Audit SEO complet — ClubsVoile.fr — V2

> Périmètre : audit entreprise (technique, sémantique, on-page, schema, CWV, E-E-A-T,
> concurrence, priorisation) **après** réalisation des phases 1 + 2 + gains rapides + moyen terme.
> Référence keywords : voir [`mots-cles-cibles.md`](./mots-cles-cibles.md).
> Stack : Next.js 14 (App Router, ISR) + Supabase, hébergé Hostinger, ~1 865 pages.

---

## A. Synthèse exécutive

**État global : solide sur la technique, sous-exploité sur la stratégie de contenu.**

Le site a réglé l'essentiel de sa dette technique (ISR, schema, CWV 95–100/100, FAQ, next/image,
maillage, pages légales). La V1 visait « 100 % SEO technique » — **c'est atteint**. Le plafond de
verre est désormais **éditorial et stratégique** : le site ne possède pas encore les pages qui
captent la demande la plus forte révélée par Semrush (têtes « école/club/stage de voile »,
intention « près de moi », et couverture activité×ville sur les villes à volume).

| Domaine | Note V1 (est.) | Note V2 | Tendance |
|---|---|---|---|
| Technique / crawl / indexation | 6/10 | **9/10** | ▲ |
| Core Web Vitals | 5/10 | **9,5/10** | ▲ |
| Données structurées (schema) | 4/10 | **8,5/10** | ▲ |
| On-page (title/H/maillage) | 5/10 | **8/10** | ▲ |
| Sémantique / couverture d'intention | 4/10 | **6/10** | ▲ légère |
| E-E-A-T | 3/10 | **6,5/10** | ▲ |
| **Couverture de la demande (keyword→page)** | 3/10 | **4/10** | ⚠️ retard |
| Conversion / monétisation | 2/10 | **3/10** | ⚠️ à faire |

---

## B. Ce qui est FAIT (rappel, ne pas refaire)

**Phase 1 — Technique**
- ISR partout (`revalidate` sur API + pages géo) → fin des 503 Hostinger, TTFB ~1 ms.
- `robots.ts` (disallow `/admin`, `/api`), `sitemap.ts` avec **lastmod réel** par page.
- `/search` en `noindex, follow` (budget de crawl).
- next/font (Bricolage + Inter, plus d'@import bloquant), favicon, 404 brandée.

**Phase 2 — Contenu programmatique**
- ~1 865 pages géo + activité×ville générées (N8N + Claude Haiku → `seo_content`).
- Contenu éditorial départements + régions (14/14 régions).
- Meta title/description + intro_html + FAQ par page.

**Gains rapides + Moyen terme**
- FAQ affichées visuellement (accordéon) + JSON-LD `FAQPage`.
- Schema : `Organization` (logo, email, sameAs IG/FB/LinkedIn, ContactPoint), `WebSite`+SearchAction,
  `BreadcrumbList`, `ItemList`, `SportsActivityLocation`, `ContactPage`.
- Avis Google affichés en attribution honnête (retrait de `AggregateRating` non first-party).
- Clubs « à l'affiche » réels, alt d'images descriptifs, migration **next/image** (hero, cartes, fiches).
- Pages légales (À propos, Mentions légales, Confidentialité) + formulaire contact (SMTP + backup Supabase).
- CWV terrain : 99/100, 98, 95, 99, 100, 99 — LCP ~785 ms, TBT 0, CLS 0.
- **Anti-cannibalisation** activité×ville : bloc « Aller plus loin » (hub-and-spoke) déjà en place
  dans `app/[a]/[b]/page.tsx`.

---

## C. Diagnostic par domaine + correctifs

### C1. Couverture de la demande — **CRITIQUE (plus gros levier)**

**Problème.** Les 3 têtes commerciales que le nom du site mérite n'ont **pas de page dédiée** :
`école de voile` (1900), `club de voile` (1000), `stage de voile` (720, KD20). Et l'intention
« près de moi » (cumul > 9 000 rech./mois sur kayak+paddle) n'a **aucune** page.

**Impact SEO.** On laisse partir ~6 000–10 000 recherches mensuelles à forte intention vers des
concurrents, sur des requêtes où un annuaire est la meilleure réponse possible.

**Correctifs (gravité : Élevé→Critique)**
1. **Pages-piliers `/ecole-de-voile`, `/stage-de-voile`, `/club-de-voile`** : H1 exact, intro
   éditoriale, liste des villes/régions avec clubs proposant cours/stages, FAQ, maillage descendant
   vers `/[activite]/[ville]`. (`stage de voile` KD20 = cible la plus accessible.)
2. **Feature « près de chez moi »** : page `/pres-de-chez-moi` (géoloc navigateur → redirige vers la
   ville la plus proche couverte) + bloc « clubs autour de {ville} » sur chaque page ville. Sert
   `paddle/kayak autour de moi` (1600+1300) et renforce le maillage.
3. **Sur les piliers d'activité `/[activite]`** : ajouter une section « Apprendre / prendre des
   cours » et « stages » pour capter `cours de paddle` (320), `stage wingfoil` (260, KD12),
   `stage kitesurf` (590).

### C2. Sémantique / intention — **Moyen**

**Problème.** Le vocabulaire interne (`Planche à voile / WindSurf`, `E-Foil`, `Habitable/Croisière`)
ne matche pas toujours la requête réelle (`planche à voile`, `efoil`, `catamaran`). Risque de
slugs/titres décalés de la demande.
**Correctif.** Vérifier que chaque pilier activité expose dans le `<title>`/H1/contenu le terme
**tel que cherché** (mapping dans `mots-cles-cibles.md` §2). Gérer les synonymes (windsurf↔planche
à voile, SUP↔paddle, e-foil↔efoil) en co-occurrence dans le corps de texte.
**Attention intention mixte** : `kayak`/`catamaran` ont une grosse part location/excursion/matériel
— cadrer le contenu sur « club, cours, pratique encadrée » pour ne pas diluer la pertinence.

### C3. Technique / crawl — **Faible (presque rien à faire)**

- ✅ ISR, robots, sitemap lastmod, canonicals, HTTPS, pas de 503.
- ⚠️ **À vérifier** : (a) toutes les nouvelles pages-piliers entrent dans `sitemap.ts` ; (b) le
  programme N8N continue de générer le contenu pour les **nouvelles villes Tier 1** (Paris, Lyon,
  Annecy, Cassis, La Rochelle…) — sinon pages potentiellement minces ; (c) `unstable_cache`/`.next`
  staleness connu (jusqu'à 1 h ou redeploy) → ne pas paniquer sur une page « vide » fraîchement créée.
- ⚠️ **Pages activité×ville sans club réel** = pages minces. Règle : si 0 club, `noindex` ou ne pas
  générer (déjà le cas via `notFound()` sur combinaisons absentes — à reconfirmer).

### C4. Core Web Vitals — **Faible (maintien)**

- ✅ Scores 95–100, CLS 0, TBT 0, LCP ~785 ms.
- ⚠️ `next.config.js` a `images: { unoptimized: true }` (volontaire : Hostinger + photos club
  externes arbitraires). Conséquence : pas de WebP/AVIF auto. **Si** migration future vers un host
  avec optimizer (Vercel/CDN image), activer l'optimisation → gain LCP sur fiches à grosses photos.
  Sinon : garder `sizes`/`priority` propres (déjà fait) et viser des photos sources raisonnables.

### C5. Données structurées — **Faible**

- ✅ Organization, WebSite, Breadcrumb, ItemList, FAQPage, ContactPage, SportsActivityLocation.
- 🔧 **Ajouts à valeur** : sur fiche club, enrichir `SportsActivityLocation`/`LocalBusiness` avec
  `openingHoursSpecification` (les horaires existent déjà en data), `geo` (lat/lng présents),
  `telephone`, `priceRange` si dispo. → éligibilité résultats enrichis « local ».
- 🔧 Pages-piliers : `CollectionPage` + `ItemList` des villes/clubs.

### C6. E-E-A-T — **Moyen**

- ✅ Éditeur identifié (Projec'toi / EI Thibault Guerry / SIRET), mentions légales, contact, sameAs.
- 🔧 **Manque** : signaux d'expertise éditoriale (page « méthodologie / comment on référence les
  clubs », date de mise à jour visible sur les pages contenu, éventuellement auteur). Renforce la
  confiance sur les pages-piliers commerciales.

### C7. Maillage interne — **Faible→Moyen**

- ✅ Hub-and-spoke activité×ville (« Aller plus loin »), breadcrumbs, ItemList.
- 🔧 **Manque le maillage région↔activité** (le dernier item « moyen terme » non fait) : depuis une
  page région/département, lier « {activité} en {région} » / top activités locales ; et lier les
  piliers d'activité depuis le footer/nav. Boucle le silo thématique.

### C8. Conversion / Monétisation — **À construire (gravité business : Élevé)**

- Aujourd'hui le site informe mais ne capte pas de valeur explicite.
- Leviers : (a) CTA « Référencer mon club » déjà présent → en faire une **offre payante** (mise en
  avant, badge, fiche premium) ; (b) affiliation matériel/assurance/cours sur les piliers à fort
  trafic info (kayak/paddle) ; (c) lead-gen vers clubs partenaires sur l'intention « cours/stage ».

---

## D. Analyse concurrentielle (synthèse)

Sur les SERP des requêtes cibles, les features observées (colonne SERP Features Semrush) montrent :
**Local pack** sur `club de voile`, `centre nautique`, `kitesurf`, `catamaran` → la **fiche Google
Business** des clubs domine le local ; un annuaire gagne sur l'**agrégation** (« les X clubs de voile
à {ville} ») et la longue traîne activité×ville que les clubs individuels ne couvrent pas.
**People Also Ask** quasi systématique → la stratégie FAQ (déjà en place) est la bonne ; l'étendre.
Concurrents-types : sites institutionnels (FFVoile, ligues), portails tourisme régionaux, et les
fiches clubs elles-mêmes. **Gap exploitable** : aucune de ces sources ne fait de page
*activité×ville* systématique ni de « près de moi » — c'est notre différenciation.

---

## E. Plan d'action priorisé V2

### 🟢 Gains rapides (1–2 j, fort ROI)
1. Page-pilier **`/stage-de-voile`** (KD20, intention commerciale, nom du site) — *le meilleur ratio effort/gain*.
2. Pages-piliers **`/ecole-de-voile`** et **`/club-de-voile`** (réutiliser le template pilier).
3. Enrichir le schema fiche club : `openingHoursSpecification`, `geo`, `telephone` (data déjà présente).
4. Maillage **région↔activité** (clôt le « moyen terme ») + liens piliers dans le footer.
5. Vérifier mapping **slug/title activité = terme cherché** (planche à voile, efoil, paddle, catamaran).

### 🟡 Moyen terme (1–3 sem.)
6. **Feature « près de chez moi »** (`/pres-de-chez-moi` géoloc + bloc « clubs autour de {ville} »).
7. **Couverture villes Tier 1** : s'assurer que paddle/kayak/catamaran ont des clubs + contenu N8N
   sur Paris, Lyon, Annecy, Cassis, La Rochelle, Bordeaux, Montpellier, Marseille, Nice, Nantes.
8. Sections « cours / stages » sur les piliers d'activité (capte `cours de paddle`, `stage kitesurf/wingfoil`).
9. Signaux E-E-A-T : date de MAJ visible, page méthodologie de référencement.

### 🔴 Long terme / stratégique
10. Acquisition de clubs sur les **villes/activités à volume mais base mince** (paddle/kayak inland :
    Paris, Lyon, Annecy) — *c'est ce qui débloque les pages activité×ville les plus rentables*.
11. Blog automatisé (Phase 3) : guides « où faire du {activité} à {ville} », saisonnalité.
12. Collecte d'avis first-party (réactive `AggregateRating` légitimement → étoiles en SERP).
13. Si scaling : host avec image optimizer (WebP/AVIF) pour les fiches riches en photos.

### 💰 Opportunités revenus / trafic
- **Trafic** : kayak (823k) + paddle (74k) + « près de moi » (>9k) = le plus gros gisement, aujourd'hui
  quasi non capté. Priorité piliers + couverture ville.
- **Revenu** : fiche club premium (offre « Référencer mon club »), affiliation matériel/cours sur les
  piliers info à fort volume, lead-gen cours/stages.

---

## F. Risques & garde-fous

- **Pages minces** : ne générer/ indexer une page activité×ville **que** si ≥1 club réel (sinon `noindex`).
- **Cannibalisation** : conserver la distinction d'intention ville-hub vs activité×ville (déjà en place) ;
  l'étendre aux nouveaux piliers (un pilier national ne doit pas concurrencer les pages ville).
- **Intention mixte** (kayak/catamaran location vs club) : cadrer le contenu, sinon CTR/pertinence faibles.
- **« centre nautique »** : ne pas investir cet axe (intention piscine), malgré le volume affiché.
