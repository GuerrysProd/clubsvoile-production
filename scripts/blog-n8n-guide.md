# Blog ClubsVoile.fr — Guide d'intégration n8n

Le blog suit un modèle **topic cluster** (SEO) :

```
/blog                      → hub : liste les clusters + derniers articles
/blog/{cluster}            → page-pilier d'un cluster (intro + ses articles)
/blog/{cluster}/{slug}     → article
```

Deux tables Supabase : **`blog_categories`** (= clusters) et **`blog_posts`** (= articles).
Schéma à jouer une fois : [`scripts/blog-schema.sql`](./blog-schema.sql) (SQL Editor Supabase).

---

## 1. Authentification n8n → Supabase

Les tables sont en **RLS** : l'anon ne peut que **lire** le contenu publié.
Pour **écrire**, n8n doit utiliser la clé **`service_role`** (Supabase → Settings → API).

- Node **Supabase** (credential = service_role), ou
- Node **HTTP Request** vers `https://<projet>.supabase.co/rest/v1/blog_posts`
  avec en-têtes `apikey` + `Authorization: Bearer <service_role>` et `Prefer: return=representation`.

> ⚠️ La clé `service_role` contourne la RLS : à garder uniquement côté serveur n8n, jamais exposée au client.

---

## 2. Créer / mettre à jour un CLUSTER (`blog_categories`)

| Colonne            | Oblig. | Détail SEO |
|--------------------|:------:|-----------|
| `slug`             | ✅ | segment d'URL, kebab-case, **stable** (ex. `apprendre-la-voile`) |
| `name`             | ✅ | libellé court (chip, nav) |
| `title`            |    | H1 du hub (défaut = `name`) |
| `tagline`          |    | sous-titre court |
| `description`      |    | lede + **fallback meta description** |
| `intro_html`       |    | **contenu éditorial du pilier** (HTML), clé pour l'autorité thématique |
| `meta_title`       |    | balise `<title>` (≤ 60 car.) |
| `meta_description` |    | meta description (≤ 155 car.) |
| `accent`           |    | `teal` \| `coral` \| `ink` (couleur déco) |
| `sort_order`       |    | ordre d'affichage |

Crée **3–6 clusters** stables. Ce sont tes piliers : n'en change pas les slugs.

---

## 3. Créer un ARTICLE (`blog_posts`)

| Colonne            | Oblig. | Détail SEO |
|--------------------|:------:|-----------|
| `slug`             | ✅ | segment d'URL **unique globalement**, kebab-case, descriptif (= requête cible) |
| `category_id`      | ✅ | UUID du cluster (résoudre via `slug` du cluster, voir §4) |
| `title`            | ✅ | H1 / titre de l'article |
| `excerpt`          | ✅ | résumé 1–2 phrases (carte + fallback meta) |
| `content_html`     | ✅ | corps en **HTML sémantique** (voir §5) |
| `cover_image`      | ✅ | URL image de couverture (paysage ~16:8) |
| `cover_alt`        | ✅ | texte alternatif descriptif |
| `meta_title`       |    | `<title>` (défaut = `title`) |
| `meta_description` |    | meta description (défaut = `excerpt`) |
| `tags`             |    | `text[]`, ex. `["stage","débutant"]` |
| `faq`              |    | `jsonb` `[{"q":"…","a":"…"}]` → génère le **FAQPage** schema.org |
| `reading_minutes`  |    | sinon calculé auto (~200 mots/min) |
| `featured`         |    | `true` = mis en avant |
| `status`           | ✅ | **`published`** pour être visible (sinon `draft`) |
| `published_at`     | ✅ | date ISO de publication (sert au tri + `datePublished`) |

> Un article n'apparaît **que** si `status = 'published'`. Pense à `published_at`.

---

## 4. Résoudre `category_id` depuis le slug du cluster

Avant d'insérer l'article, récupère l'UUID du cluster :

```
GET /rest/v1/blog_categories?slug=eq.apprendre-la-voile&select=id
```

Puis insère l'article avec ce `category_id`. (En n8n : un node « get category » → mappe `id`.)

---

## 5. Format de `content_html`

HTML **propre et sémantique**, sans `<h1>` (le H1 = le `title`). Utilise `<h2>`/`<h3>`
pour la structure (bon pour les extraits enrichis et le sommaire), `<p>`, `<ul>`/`<ol>`,
`<strong>`, `<a>`, `<blockquote>`. La typographie est gérée par la classe `.blog-prose`.

```html
<h2>Sous-titre principal</h2>
<p>Paragraphe… avec un <a href="/stage-de-voile">lien interne</a>.</p>
<h3>Point précis</h3>
<ul><li>élément</li><li>élément</li></ul>
```

**Maillage interne (important SEO)** : dans `content_html`, ajoute des liens vers
l'annuaire — pages-piliers (`/stage-de-voile`, `/ecole-de-voile`, `/club-de-voile`),
activités (`/catamaran`, `/wingfoil`…) et villes (`/{region}/{dept}/{ville}`) — pour
relier le blog au cœur de l'annuaire.

---

## 6. Ce qui est déjà automatique (rien à faire côté n8n)

- `<title>`, meta description, **canonical**, OpenGraph `article` (image, date, auteur)
- JSON-LD **BlogPosting** (headline, image, dates, author, publisher) + **BreadcrumbList** + **FAQPage**
- Sommaire visuel, temps de lecture, date FR, fil d'Ariane
- **Articles liés** (même cluster) et maillage cluster ↔ annuaire
- Ajout automatique au **sitemap.xml** (`/blog`, clusters, articles)
- Revalidation ISR toutes les 10 min (un nouvel article apparaît sans redéploiement)

---

## 7. Checklist SEO par article

- [ ] `slug` = la requête cible, court et stable
- [ ] `title` unique et accrocheur (≤ ~60 car.)
- [ ] `meta_description` ≤ 155 car., incitative
- [ ] `excerpt` clair (sert de résumé et de fallback meta)
- [ ] `cover_image` + `cover_alt` renseignés
- [ ] `content_html` structuré en `<h2>/<h3>` + ≥ 2 liens internes vers l'annuaire
- [ ] `faq` rempli quand pertinent (gagne le rich result FAQ)
- [ ] `tags`, `category_id`, `published_at`, `status = published`
