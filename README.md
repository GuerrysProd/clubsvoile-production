# 🔥 ClubsVoile Premium - Version Complète

Annuaire national des clubs de voile avec scraping Google Places, Supabase et design sportif.

## ✨ Fonctionnalités

- ✅ Landing page spectaculaire (design sportif/aventure)
- ✅ Page de recherche avec filtres avancés
- ✅ Moteur de recherche premium (région, activité, note)
- ✅ Carte interactive Leaflet (voir les clubs)
- ✅ Scraper Google Places API (récupère 1200+ clubs)
- ✅ Intégration Supabase (base de données)
- ✅ Système d'authentification (clubs)
- ✅ Avis certifiés (rating)
- ✅ Responsive design (mobile/desktop)

## 🚀 Quickstart

### 1. Cloner/Extraire le projet
```bash
cd clubsvoile-premium
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement
```bash
# Copie le fichier d'exemple
cp .env.local.example .env.local

# Remplis avec tes vraies clés :
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
```

### 4. Lancer le serveur
```bash
npm run dev
# Ouvre http://localhost:3000
```

## 📊 Scraper Google Places

### Lancer le scraper manuellement

```bash
curl -X POST http://localhost:3000/api/scrape-clubs \
  -H "Authorization: Bearer YOUR_SCRAPER_SECRET"
```

Le scraper va :
1. Chercher les clubs sur Google Places (20+ requêtes par région)
2. Récupérer les informations (nom, adresse, tél, email, rating, etc.)
3. Sauvegarder dans Supabase
4. Dédupliquer par `google_place_id`

**Résultat** : 1200+ clubs en base de données ! 🎉

### Auto-sync (planifier)

Ajoute une tâche cron (Vercel/GitHub Actions) pour scraper automatiquement chaque semaine.

## 🗂️ Structure du projet

```
clubsvoile-premium/
├── app/
│   ├── api/
│   │   ├── scrape-clubs/route.ts    (scraper Google Places)
│   │   └── clubs/route.ts           (fetch clubs avec filtres)
│   ├── components/
│   │   └── Map.tsx                  (carte Leaflet)
│   ├── search/
│   │   ├── page.tsx                 (page recherche)
│   │   └── search.module.css
│   ├── globals.css                  (styles globaux)
│   ├── layout.tsx                   (header + footer)
│   ├── layout.module.css
│   ├── page.tsx                     (landing page)
│   └── page.module.css
├── lib/
│   ├── supabase.ts                  (config Supabase)
│   ├── auth.ts                      (authentification)
│   ├── googlePlacesScraper.ts       (scraper Google)
│   └── types.ts                     (types TypeScript)
├── public/                          (images/assets)
├── .env.local                       (secrets - NE PAS PUSH)
├── .env.local.example               (template)
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## 🔐 Variables d'environnement

```
NEXT_PUBLIC_SUPABASE_URL=https://clubsvoile-db.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=AIzaSy...
NEXTAUTH_SECRET=random-string
NEXTAUTH_URL=http://localhost:3000
SCRAPER_SECRET=your-secret
```

⚠️ **IMPORTANT** : Ajoute `.env.local` à `.gitignore` !

## 📲 Pages principales

| Route | Description |
|-------|------------|
| `/` | Landing page (hero + stats) |
| `/search` | Recherche avec filtres + carte |
| `/club/[id]` | Détail d'un club (à créer) |
| `/club/register` | Inscription club (à créer) |
| `/api/clubs` | API pour récupérer clubs |
| `/api/scrape-clubs` | Scraper Google Places |

## 🔗 Intégrations

### Supabase
- Base de données PostgreSQL
- Tables : clubs, users, reviews
- Authentification JWT
- Real-time updates

### Google Places API
- Text search pour trouver les clubs
- Récupère : nom, adresse, tél, website, photos, rating
- 300 requêtes/jour gratuites

### Leaflet
- Carte interactive
- Marqueurs avec clustering
- Popups au clic

## 🚀 Déploiement

### Vercel (recommandé)
```bash
# Push sur GitHub
git push

# Vercel détecte automatiquement
# Redéploie à chaque push
```

### Hostinger
```bash
npm run build
npm start
```

## 📈 Améliorations futures

- [ ] Page détail club complète
- [ ] Système d'avis (reviews)
- [ ] Dashboard club (éditer profil)
- [ ] Paiement premium (Stripe)
- [ ] Admin dashboard
- [ ] Blog/Articles SEO
- [ ] Notifications email
- [ ] App mobile (React Native)

## 💬 Support

Pour des questions :
- 📧 contact@clubsvoile.fr
- 🐛 Issues sur GitHub

## 📝 License

Propriétaire - ClubsVoile 2026

---

**Bon démarrage ! 🚤⛵**
