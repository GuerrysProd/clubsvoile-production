-- Table de contenu éditorial SEO généré (Phase 2).
-- À exécuter dans Supabase → SQL Editor.
-- Une ligne par page, clé = chemin (ex: "/catamaran/toulon").

create table if not exists public.seo_content (
  path             text primary key,
  page_type        text,                       -- activity_city | city | department | region | activity
  meta_title       text,
  meta_description text,
  intro_html       text,                        -- bloc éditorial (liens internes + externes)
  faq              jsonb,                        -- [{ "q": "...", "a": "..." }]
  status           text not null default 'published',
  updated_at       timestamptz not null default now()
);

create index if not exists seo_content_page_type_idx on public.seo_content (page_type);

-- Lecture publique (le site lit ce contenu via la clé anon).
alter table public.seo_content enable row level security;

drop policy if exists "seo_content public read" on public.seo_content;
create policy "seo_content public read"
  on public.seo_content for select
  using (status = 'published');
