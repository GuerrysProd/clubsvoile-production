-- Demandes du formulaire de contact (filet de sécurité : chaque demande est
-- stockée même si l'email échoue). À exécuter dans Supabase → SQL Editor.

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  club       text not null,
  name       text not null,
  email      text not null,
  phone      text,
  message    text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Insertion publique (le site écrit via la clé anon). Pas de lecture publique :
-- les demandes ne sont visibles que via le dashboard / la clé service_role.
drop policy if exists "contact_messages public insert" on public.contact_messages;
create policy "contact_messages public insert"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);
