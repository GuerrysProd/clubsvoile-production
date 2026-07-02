-- ============================================================================
-- ClubsVoile.fr — File d'attente de SUJETS pour l'automatisation n8n
-- À exécuter UNE FOIS dans Supabase → SQL Editor (après blog-schema.sql).
--
-- Tu remplis cette table depuis ta recherche de mots-clés (Semrush) ;
-- le workflow n8n pioche les lignes `pending` une par une, génère l'article
-- via Claude, l'insère dans blog_posts, puis passe la ligne à `done`.
--
-- RLS activée sans policy => seul le service_role (n8n) y accède. L'anon n'a
-- aucun accès (la file d'attente n'a pas à être publique).
-- ============================================================================

create extension if not exists "pgcrypto";

create table if not exists blog_topics (
  id            uuid primary key default gen_random_uuid(),
  keyword       text not null,                 -- mot-clé / requête cible (= cœur du slug)
  cluster_slug  text not null,                 -- slug d'un blog_categories existant
  title_hint    text,                          -- angle ou titre suggéré (optionnel)
  search_intent text default 'informationnelle', -- informationnelle | comparative | transactionnelle
  cover_image   text,                          -- URL image de couverture (optionnel)
  priority      int  default 0,                -- plus haut = traité en premier
  status        text default 'pending'
                  check (status in ('pending','processing','done','error')),
  post_id       uuid references blog_posts(id) on delete set null,
  error_message text,
  notes         text,                          -- consignes libres passées au rédacteur
  generated_at  timestamptz,
  created_at    timestamptz default now()
);

create index if not exists blog_topics_queue_idx on blog_topics(status, priority desc, created_at);

alter table blog_topics enable row level security;
-- (aucune policy : seul service_role lit/écrit)

-- ── Exemples (supprimables) — remplis plutôt depuis ta recherche Semrush ──
insert into blog_topics (keyword, cluster_slug, title_hint, search_intent, priority) values
('prix stage de voile enfant', 'apprendre-la-voile', 'Combien coûte un stage de voile pour enfant ?', 'informationnelle', 10),
('apprendre le catamaran',      'materiel-et-supports', 'Débuter le catamaran : par où commencer ?', 'informationnelle', 8),
('assurance licence ffvoile',   'vie-de-club', 'Que couvre l’assurance de la licence FFVoile ?', 'informationnelle', 5)
on conflict do nothing;
