# Automatisation n8n — Génération d'articles de blog SEO

Workflow prêt à importer : [`scripts/n8n-blog-seo-workflow.json`](./n8n-blog-seo-workflow.json)

Il pioche un sujet dans la file d'attente `blog_topics`, génère un article 100 % SEO
avec **Claude (`claude-opus-4-8`)** en sortie structurée, l'insère dans `blog_posts`
(donc publié sur le site via l'ISR), puis marque le sujet comme `done`.

```
Schedule ─▶ Get next topic ─▶ Pick topic ─▶ Get category ─▶ Resolve category
        ─▶ Build Claude request ─▶ Generate article (Claude) ─▶ Build post row
        ─▶ Insert post ─▶ Mark topic done
```

---

## 0. Recherche préliminaire — OUI, à faire (rapide)

L'automatisation **rédige** très bien, mais elle ne **choisit pas** quoi cibler.
Avant de lancer, fais une recherche de mots-clés légère (tu as Semrush) :

1. Garde **3 à 6 clusters** (= `blog_categories`, déjà créés).
2. Pour chaque cluster, liste **5 à 15 mots-clés** avec volume + intention.
3. Mets-les dans `blog_topics` (1 ligne = 1 article). Le `keyword` = la requête cible.

C'est la seule partie « humaine ». Le reste tourne tout seul.

---

## 1. Prérequis SQL (à jouer une fois dans Supabase)

1. [`scripts/blog-schema.sql`](./blog-schema.sql) — déjà fait ✅ (tables blog).
2. [`scripts/blog-topics-schema.sql`](./blog-topics-schema.sql) — **la file d'attente** `blog_topics`.

---

## 2. Variables d'environnement n8n

Le workflow lit 3 variables d'environnement (n8n self-hosted : dans le `.env` / docker-compose) :

| Variable | Valeur |
|---|---|
| `SUPABASE_URL` | `https://<projet>.supabase.co` (sans slash final) |
| `SUPABASE_SERVICE_ROLE_KEY` | la clé **service_role** (Supabase → Settings → API) |
| `ANTHROPIC_API_KEY` | ta clé API Anthropic (console.anthropic.com) |

> ⚠️ **n8n Cloud** bloque `$env` par défaut. Dans ce cas, remplace dans chaque nœud
> HTTP les `{{$env.X}}` par des **credentials n8n** : une « Header Auth » pour
> Anthropic (`x-api-key`), et pour Supabase mets les 2 en-têtes (`apikey` +
> `Authorization: Bearer …`) en paramètres d'en-tête. La clé service_role doit
> rester côté serveur — jamais exposée publiquement.

---

## 3. Importer & lancer

1. n8n → **Workflows → Import from File** → `n8n-blog-seo-workflow.json`.
2. Ajoute quelques lignes dans `blog_topics` (ou garde les exemples du SQL).
3. Clique **Execute Workflow** (test manuel) → un article doit apparaître sur
   `/blog/{cluster}/{slug}` (revalidation ISR ≤ 10 min ; en local, redémarre le dev).
4. Quand ça te convient, **Active** le workflow → il tourne tous les jours à 8 h
   (1 article/jour). Modifie le nœud *Schedule* pour changer la cadence.

> Pour **publier en brouillon** (relire avant mise en ligne), édite le nœud
> *Build post row* : remplace `status: 'published'` par `status: 'draft'`. Tu
> passeras la ligne `blog_posts.status` à `published` à la main quand l'article te convient.

---

## 4. Ce que fait l'appel Claude (déjà configuré)

- **Modèle** : `claude-opus-4-8`, endpoint `POST https://api.anthropic.com/v1/messages`.
- **Sortie structurée fiable** : outil `save_article` + `tool_choice: {type:'tool'}` +
  `strict:true` → Claude renvoie un JSON validé (title, slug, excerpt, content_html,
  meta_title, meta_description, cover_alt, tags, faq, reading_minutes).
- **Prompt SEO** intégré (system) : HTML sémantique (h2/h3/p/ul/strong), **maillage
  interne obligatoire** vers l'annuaire (/stage-de-voile, activités, etc.), méta
  calibrées, FAQ, E-E-A-T (interdit d'inventer prix/avis/chiffres).
- Pas de `temperature`/`thinking` (non supportés sur Opus 4.8).

> Si l'appel renvoie un **400** mentionnant `strict`, retire `strict: true` du nœud
> *Build Claude request* (le `tool_choice` forcé suffit à garantir le JSON).
> Pour réduire le coût en volume, remplace `claude-opus-4-8` par `claude-sonnet-4-6`
> dans ce même nœud (qualité un cran en dessous, ~5× moins cher).

---

## 5. Remplir `blog_topics` (le seul travail récurrent)

| Colonne | Oblig. | Rôle |
|---|:--:|---|
| `keyword` | ✅ | requête cible (= cœur du slug et de l'article) |
| `cluster_slug` | ✅ | slug d'un `blog_categories` existant |
| `title_hint` | | angle/titre suggéré (sinon Claude choisit) |
| `search_intent` | | `informationnelle` / `comparative` / `transactionnelle` |
| `cover_image` | | URL d'image de couverture (sinon dégradé) |
| `priority` | | plus haut = traité en premier |
| `notes` | | consignes libres passées au rédacteur |

Le workflow ne touche qu'aux lignes `status='pending'` et les passe à `done`
(avec le `post_id` créé). En cas d'échec d'un nœud, n8n stoppe l'exécution : tu peux
configurer un *Error Workflow* n8n, ou ajouter un nœud PATCH `status='error'` sur la
sortie d'erreur des nœuds Claude/Insert.

---

## 6. Idées d'extensions (optionnelles)

- **Image de couverture auto** : ajoute un nœud HTTP Unsplash (API) entre *Resolve
  category* et *Build Claude request*, et passe l'URL dans `cover_image`.
- **Lot quotidien** : enlève le `limit=1` dans *Get next topic* et boucle (SplitInBatches)
  pour générer N articles par run.
- **Anti-doublon** : avant l'insert, un GET `blog_posts?slug=eq.{{slug}}` pour éviter
  de republier un slug existant.
