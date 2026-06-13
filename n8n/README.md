# Workflow n8n — Enrichissement des clubs

`enrichir-clubs-activites.json` : pour chaque club **ayant un site web mais sans activités**,
récupère le contenu du site, demande à **Claude Haiku 4.5** d'en déduire les activités
(parmi la liste canonique de 15) et de rédiger une **description SEO** (axée sur « voile »,
mentionnant les activités liées à la ville, ex. « Catamaran à Toulon »), puis met à jour
`activities` et `description` dans Supabase.

## Étapes du workflow

1. **Déclenchement manuel**
2. **Récupérer les clubs (Supabase)** — GET REST `clubs` (site renseigné)
3. **Filtrer sans activités** — ne garde que les clubs au tableau `activities` vide
4. **Récupérer le site du club** — fetch du HTML (tolère les sites injoignables)
5. **Préparer la requête Claude** — nettoie le HTML → texte (max 6000 car.) + construit le prompt
6. **Claude Haiku — extraction** — appel `messages` avec sortie structurée (JSON Schema)
7. **Construire la mise à jour** — parse + valide les activités contre la liste canonique
8. **Mettre à jour le club (Supabase)** — PATCH `activities` + `description`

## Mise en route

1. Dans n8n : **Workflows → Import from File** → choisir `enrichir-clubs-activites.json`.
2. Remplacer les **placeholders** (recherche/remplacement dans les nœuds) :

   | Placeholder | Où | Remplacer par |
   |---|---|---|
   | `YOUR_PROJECT.supabase.co` | nœuds Supabase (GET + PATCH) | l'URL de ton projet Supabase |
   | `YOUR_SUPABASE_KEY` | nœud GET | la clé `anon` (lecture suffit) |
   | `YOUR_SUPABASE_SERVICE_ROLE_KEY` | nœud PATCH | la clé **service_role** (écriture) |
   | `YOUR_ANTHROPIC_API_KEY` | nœud Claude | ta clé API Anthropic |

   > 🔒 **Mieux** : plutôt que coller les clés en clair, crée des **Credentials n8n**
   > (Header Auth) et référence-les dans les nœuds HTTP. Ne committe jamais le JSON
   > rempli avec les clés dans git.

3. L'écriture (PATCH) nécessite une clé Supabase autorisée en écriture sur `clubs`
   (la clé `service_role`, ou une policy RLS adaptée). La clé `anon` seule sera
   probablement bloquée.
4. **Exécuter** (bouton « Test workflow »).

## Conseils

- **Mode itération** : n8n traite chaque club **un à la fois** (pas de boucle explicite).
  Le GET Supabase retourne un tableau → chaque item est une exécution sépaée.
- **Tester d'abord en petit** : limite le GET à `limit=5` pour tester sur 5 clubs avant de lancer
  sur les 1200+.
- **Limites de débit** : si tu rencontres des `429` (Anthropic rate limit) ou des timeouts,
  ajoute un nœud **Wait** (1–2 secondes) entre le nœud « Claude Haiku » et « Construire la mise à jour »
  pour étaler les appels.
- **Coût** : Haiku 4.5 ≈ 1 $/1M tokens en entrée. ~6000 caractères de site ≈ 2–3k tokens
  par club, donc quelques centimes pour quelques centaines de clubs.
- La description écrase l'ancienne valeur de `description` (qui contenait des bouts
  d'adresse) — c'est l'objectif.
- **Erreurs HTTP** : les sites injoignables (404, timeout, etc.) sont tolérés et sautés
  (`onError: continueRegularOutput`).
