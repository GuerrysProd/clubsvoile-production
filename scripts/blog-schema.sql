-- ============================================================================
-- ClubsVoile.fr — Schéma BLOG (modèle « topic cluster » SEO)
-- À exécuter UNE FOIS dans Supabase → SQL Editor.
--
--   blog_categories = les CLUSTERS (pages-piliers thématiques)
--   blog_posts      = les ARTICLES rattachés à un cluster
--
-- Lecture publique (anon) : uniquement le contenu publié.
-- Écriture : réservée à la clé service_role (utilisée par n8n) — l'anon ne
-- peut rien écrire. Voir scripts/blog-n8n-guide.md.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── Trigger updated_at ──────────────────────────────────────────────────────
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ── CLUSTERS ────────────────────────────────────────────────────────────────
create table if not exists blog_categories (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  name             text not null,                 -- libellé court (chip, nav)
  title            text,                          -- H1 / titre hero du hub
  tagline          text,                          -- sous-titre court
  description      text,                          -- lede + fallback meta description
  intro_html       text,                          -- contenu éditorial du hub (pilier)
  meta_title       text,
  meta_description text,
  accent           text default 'teal'            -- 'teal' | 'coral' | 'ink' (déco)
                     check (accent in ('teal','coral','ink')),
  icon             text,
  sort_order       int  default 0,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ── ARTICLES ────────────────────────────────────────────────────────────────
create table if not exists blog_posts (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  category_id      uuid references blog_categories(id) on delete set null,
  title            text not null,
  excerpt          text,                          -- résumé (carte + fallback meta)
  content_html     text,                          -- corps de l'article (HTML sémantique)
  cover_image      text,                          -- URL image de couverture
  cover_alt        text,
  author           text default 'L''équipe ClubsVoile.fr',
  meta_title       text,
  meta_description text,
  tags             text[] default '{}',
  faq              jsonb,                          -- [{ "q": "...", "a": "..." }]
  reading_minutes  int,                            -- sinon calculé auto
  featured         boolean default false,
  status           text default 'draft'            -- 'draft' | 'published'
                     check (status in ('draft','published')),
  published_at     timestamptz,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create index if not exists blog_posts_category_idx   on blog_posts(category_id);
create index if not exists blog_posts_status_pub_idx  on blog_posts(status, published_at desc);

drop trigger if exists trg_blog_categories_updated on blog_categories;
create trigger trg_blog_categories_updated before update on blog_categories
  for each row execute function set_updated_at();
drop trigger if exists trg_blog_posts_updated on blog_posts;
create trigger trg_blog_posts_updated before update on blog_posts
  for each row execute function set_updated_at();

-- ── RLS : lecture publique du contenu publié seulement ──────────────────────
alter table blog_categories enable row level security;
alter table blog_posts      enable row level security;

drop policy if exists "blog_categories read" on blog_categories;
create policy "blog_categories read" on blog_categories
  for select using (true);

drop policy if exists "blog_posts read published" on blog_posts;
create policy "blog_posts read published" on blog_posts
  for select using (status = 'published');
-- (Aucune policy insert/update/delete : seul service_role écrit, et il
--  contourne la RLS. n8n DOIT utiliser la clé service_role.)

-- ============================================================================
-- SEED — 3 clusters + 4 articles d'exemple (supprimables une fois n8n branché)
-- ============================================================================
insert into blog_categories (slug, name, title, tagline, description, intro_html, meta_title, meta_description, accent, sort_order)
values
('apprendre-la-voile', 'Apprendre la voile',
 'Apprendre la voile', 'Débuter, progresser, se perfectionner',
 'Tous nos guides pour se lancer dans la voile : choisir son support, comprendre les niveaux, préparer son premier stage et progresser en sécurité.',
 '<p>La voile s’apprend à tout âge. Que vous cherchiez une première initiation pour votre enfant, un stage de vacances ou un parcours pour viser l’autonomie, ce cluster réunit nos guides pour <strong>débuter et progresser sereinement</strong>. On y aborde le choix du support, le déroulé d’un stage, les niveaux fédéraux et les bons réflexes de sécurité.</p>',
 'Apprendre la voile : guides débutant & progression | ClubsVoile.fr',
 'Guides pour apprendre la voile : premier stage, choix du support, niveaux et progression. Trouvez ensuite un club près de chez vous.',
 'teal', 1),
('materiel-et-supports', 'Matériel & supports',
 'Matériel & supports', 'Optimist, dériveur, catamaran, planche, foil…',
 'Comprendre chaque support de glisse et de voile pour bien choisir : à qui il s’adresse, ce qu’on y apprend et comment débuter.',
 '<p>Optimist, dériveur, catamaran, planche à voile, wingfoil… chaque support a sa logique, son public et sa courbe d’apprentissage. Ce cluster décortique les <strong>supports de la voile et de la glisse</strong> pour vous aider à choisir celui qui vous correspond.</p>',
 'Matériel & supports de voile : bien choisir | ClubsVoile.fr',
 'Optimist, dériveur, catamaran, planche, wingfoil : guides pour comprendre et choisir votre support de voile.',
 'coral', 2),
('vie-de-club', 'Vie de club',
 'Vie de club', 'Licence, adhésion, régates, vie associative',
 'Tout ce qu’il faut savoir sur la vie en club : licence FFVoile, adhésion, assurance, compétitions et bénévolat.',
 '<p>Rejoindre un club de voile, c’est bien plus que louer un bateau. Licence, adhésion, assurance, régates, bénévolat : ce cluster explique le <strong>fonctionnement de la vie associative nautique</strong> et comment en profiter pleinement.</p>',
 'Vie de club de voile : licence, adhésion, régates | ClubsVoile.fr',
 'Licence FFVoile, adhésion, assurance et compétitions : comprendre la vie d’un club de voile.',
 'ink', 3)
on conflict (slug) do nothing;

insert into blog_posts (slug, category_id, title, excerpt, content_html, cover_image, cover_alt, meta_title, meta_description, tags, reading_minutes, featured, status, published_at)
values
('comment-choisir-premier-stage-de-voile',
 (select id from blog_categories where slug='apprendre-la-voile'),
 'Comment choisir son premier stage de voile ?',
 'Durée, support, niveau, âge, budget : les 5 critères pour choisir un stage de voile qui vous correspond, et bien démarrer.',
 '<h2>Pourquoi commencer par un stage</h2><p>Un stage encadré reste la meilleure porte d’entrée vers la voile : matériel fourni, moniteur diplômé et progression structurée. En une semaine, on passe des premières manœuvres à une navigation autonome sur petit support.</p><h2>Les 5 critères à regarder</h2><h3>1. Le support</h3><p>Optimist pour les enfants, dériveur ou catamaran pour les ados et adultes, planche pour les amateurs de glisse. Le support conditionne l’expérience.</p><h3>2. Le niveau</h3><p>Débutant, intermédiaire ou perfectionnement : vérifiez que le stage cible votre niveau réel pour ne pas vous ennuyer ni être dépassé.</p><h3>3. La durée</h3><p>Un stage « vacances » dure en général 5 demi-journées. C’est le bon format pour acquérir des bases solides.</p><h3>4. L’âge</h3><p>La plupart des écoles accueillent dès 4 ans en « jardin des mers ». Respectez les tranches d’âge indiquées par le club.</p><h3>5. L’encadrement</h3><p>Privilégiez les structures labellisées <strong>École Française de Voile</strong> : c’est un gage de sécurité et de qualité pédagogique.</p><h2>Et après le stage ?</h2><p>Beaucoup de clubs proposent une adhésion à l’année pour continuer à naviguer. C’est souvent le moment de passer du stage au club.</p>',
 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=1200&q=72&auto=format&fit=crop',
 'Stagiaires en voile sur la plage avec leur moniteur',
 'Comment choisir son premier stage de voile ? Le guide | ClubsVoile.fr',
 'Durée, support, niveau, âge, encadrement : 5 critères pour choisir un stage de voile adapté et bien débuter.',
 array['stage','débutant','enfant'], 4, true, 'published', now() - interval '2 days'),

('optimist-ou-deriveur-pour-debuter',
 (select id from blog_categories where slug='materiel-et-supports'),
 'Optimist ou dériveur : quel support pour débuter ?',
 'Deux grands classiques de l’apprentissage. On compare l’Optimist et le dériveur double pour vous aider à choisir selon l’âge et l’objectif.',
 '<h2>L’Optimist, l’école des enfants</h2><p>Petit, stable et insubmersible, l’Optimist est le support roi des 7-12 ans. L’enfant y est seul à bord : il développe vite son autonomie et le sens de la barre.</p><h2>Le dériveur, pour apprendre à deux</h2><p>Le dériveur double permet de naviguer en équipage, idéal pour les ados et adultes. On y apprend la coordination barreur/équipier et des allures plus engagées.</p><h2>Comment choisir ?</h2><ul><li><strong>Enfant seul, 7-12 ans :</strong> Optimist.</li><li><strong>Ado ou adulte débutant :</strong> dériveur double.</li><li><strong>Envie de sensations :</strong> catamaran, après les bases.</li></ul><p>Dans tous les cas, un club proche de chez vous saura vous orienter vers le bon support.</p>',
 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1200&q=72&auto=format&fit=crop',
 'Flotte d’Optimists et de dériveurs sur l’eau',
 'Optimist ou dériveur pour débuter la voile ? | ClubsVoile.fr',
 'Optimist ou dériveur double : comparatif des deux supports d’apprentissage de la voile selon l’âge et l’objectif.',
 array['optimist','dériveur','support'], 3, false, 'published', now() - interval '5 days'),

('comprendre-la-licence-ffvoile',
 (select id from blog_categories where slug='vie-de-club'),
 'Comprendre la licence FFVoile',
 'À quoi sert la licence, que couvre-t-elle, combien coûte-t-elle ? Le point sur la licence de la Fédération Française de Voile.',
 '<h2>Qu’est-ce que la licence FFVoile ?</h2><p>La licence est votre passeport pour pratiquer en club affilié. Elle inclut une <strong>assurance responsabilité civile</strong> et l’accès aux activités et compétitions fédérales.</p><h2>Les types de licence</h2><p>Licence annuelle (Club), licence temporaire (pour un stage), licence compétition : à choisir selon votre pratique.</p><h2>Combien ça coûte ?</h2><p>Le tarif fédéral est complété par la cotisation du club. Comptez généralement de quelques dizaines d’euros à l’année pour la part licence.</p><h2>Comment l’obtenir ?</h2><p>Votre club s’en charge au moment de l’adhésion : un certificat médical ou un questionnaire de santé peut être demandé.</p>',
 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=1200&q=72&auto=format&fit=crop',
 'Voiliers de club en régate',
 'Licence FFVoile : à quoi sert-elle ? | ClubsVoile.fr',
 'Licence FFVoile : rôle, types, prix et démarche. Tout comprendre avant d’adhérer à un club de voile.',
 array['licence','ffvoile','club'], 3, false, 'published', now() - interval '9 days'),

('a-quel-age-commencer-la-voile',
 (select id from blog_categories where slug='apprendre-la-voile'),
 'À quel âge commencer la voile ?',
 'Du jardin des mers à 4 ans aux premières régates ado : à chaque âge son support et son approche.',
 '<h2>Dès 4 ans : le jardin des mers</h2><p>Activités ludiques au bord de l’eau, premières sensations sur supports collectifs : l’objectif est avant tout de prendre du plaisir et d’apprivoiser le milieu marin.</p><h2>7-12 ans : l’Optimist</h2><p>L’âge idéal pour devenir autonome à la barre sur un petit bateau adapté.</p><h2>Dès 12 ans : catamaran, planche, foil</h2><p>Place aux supports plus engagés et aux sensations de vitesse, encadrés par des moniteurs.</p><h2>Et les adultes ?</h2><p>Il n’est jamais trop tard : la majorité des écoles proposent des stages adultes débutants toute l’année.</p>',
 'https://images.unsplash.com/photo-1543242594-c8bae8b9e708?w=1200&q=72&auto=format&fit=crop',
 'Enfants en initiation voile',
 'À quel âge commencer la voile ? | ClubsVoile.fr',
 'Jardin des mers, Optimist, catamaran : à quel âge débuter la voile selon le support. Guide par tranche d’âge.',
 array['âge','enfant','débutant'], 3, false, 'published', now() - interval '14 days')
on conflict (slug) do nothing;
