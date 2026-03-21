-- ── Table projects ────────────────────────────────────────────────────────
create table if not exists public.projects (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  name            text not null,
  description     text,
  status          text not null default 'active'
                    check (status in ('active', 'completed', 'paused')),
  current_phase   integer not null default 1
                    check (current_phase between 1 and 8),
  idea_data       jsonb not null default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Index pour les requêtes par user
create index projects_user_id_idx on public.projects(user_id);

-- RLS
alter table public.projects enable row level security;

create policy "projects: accès propriétaire"
  on public.projects for all
  using (user_id = auth.uid());

-- Trigger updated_at automatique
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_updated_at
  before update on public.projects
  for each row execute procedure public.handle_updated_at();
