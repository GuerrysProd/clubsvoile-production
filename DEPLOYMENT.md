# 🚀 Guide de déploiement ClubsVoile.fr

## Option 1 : Vercel (Gratuit - Recommandé)

Vercel est l'hébergeur officiel de Next.js, et c'est gratuit pour les petits projets.

### Étapes

1. **Crée un compte GitHub** (si tu n'en as pas)
   - https://github.com/signup

2. **Pousse ton code sur GitHub**
   ```bash
   # Dans le dossier du projet
   git init
   git add .
   git commit -m "Initial commit - ClubsVoile MVP"
   git branch -M main
   git remote add origin https://github.com/TON_USERNAME/clubsvoile.git
   git push -u origin main
   ```

3. **Crée un compte Vercel**
   - https://vercel.com/signup
   - Connecte ton compte GitHub

4. **Deploy le projet**
   - Clique sur "New Project"
   - Sélectionne ton repo `clubsvoile`
   - Vercel détecte automatiquement Next.js
   - Clique sur "Deploy"

5. **Relie ton domaine**
   - Accède à Settings > Domains
   - Ajoute `clubsvoile.fr`
   - Suis les instructions pour pointer ton domaine

**Durée** : 5 min  
**Coût** : Gratuit (jusqu'à 100k requêtes/mois)

---

## Option 2 : Netlify (Gratuit)

### Étapes rapides

```bash
# 1. Installe Netlify CLI
npm install -g netlify-cli

# 2. Build le projet
npm run build

# 3. Déploie
netlify deploy --prod
```

---

## Option 3 : Self-hosting (OVH, Hostinger, etc.)

Si tu préfères héberger sur un serveur :

```bash
# 1. Build en production
npm run build

# 2. Démarre le serveur
npm start

# 3. Utilise PM2 pour garder l'app active
npm install -g pm2
pm2 start "npm start" --name clubsvoile
```

---

## Après le déploiement

### ✅ Checklist

- [ ] Le site est accessible via `clubsvoile.fr`
- [ ] Les pages se chargent en < 2 secondes
- [ ] La recherche fonctionne
- [ ] Les fiches clubs s'affichent correctement
- [ ] Le design est responsive sur mobile

### 🔍 SEO basique (importante pour le ranking)

Ajoute ces éléments dans `/app/layout.tsx` :

```typescript
export const metadata: Metadata = {
  title: 'ClubsVoile.fr - Annuaire national des clubs de voile',
  description: 'Trouvez le club de voile parfait près de chez vous...',
  keywords: 'club de voile, voile France, écoles de voile, catamaran',
  openGraph: {
    title: 'ClubsVoile.fr',
    description: 'Annuaire des clubs de voile',
    url: 'https://clubsvoile.fr',
    type: 'website',
  },
};
```

### 📊 Analytics

Ajoute Google Analytics pour tracker tes visiteurs :

```typescript
// app/layout.tsx
<Script src="https://www.googletagmanager.com/gtag/js?id=GA_ID" />
<Script>
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_ID');
  `}
</Script>
```

---

## Monitoring & Maintenance

### Logs en temps réel (Vercel)
```bash
vercel logs
```

### Mises à jour
```bash
npm update
npm audit fix
```

---

**Besoin d'aide ?** Ouvre la console Vercel et regarde les logs en cas d'erreur.
