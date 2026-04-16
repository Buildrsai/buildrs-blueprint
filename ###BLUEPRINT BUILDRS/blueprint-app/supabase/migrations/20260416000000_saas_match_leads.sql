-- blueprint-app/supabase/migrations/20260416000000_saas_match_leads.sql

create table if not exists public.saas_match_leads (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  answers      jsonb not null default '{}',
  results_json jsonb not null default '{}',
  converted    boolean not null default false,
  created_at   timestamptz not null default now()
);

-- Index pour les lookups par email (séquence email n8n)
create index if not exists saas_match_leads_email_idx
  on public.saas_match_leads (email);

-- RLS : insert public (anon peut insérer), lecture/update service_role uniquement
alter table public.saas_match_leads enable row level security;

create policy "anon can insert leads"
  on public.saas_match_leads
  for insert
  to anon, authenticated
  with check (true);

-- Pas de select/update policy publique — seul le service_role (n8n) peut lire
