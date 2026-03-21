-- ── Table finder_searches ─────────────────────────────────────────────────
create table if not exists public.finder_searches (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete set null,
  mode        text not null check (mode in ('find', 'validate', 'copy')),
  input       text not null,
  result      jsonb not null default '{}',
  score       integer check (score between 0 and 100),
  created_at  timestamptz not null default now()
);

create index finder_user_id_idx on public.finder_searches(user_id);

-- RLS : lecture sur ses propres recherches, insertion anonyme autorisée
alter table public.finder_searches enable row level security;

create policy "finder: lecture propriétaire"
  on public.finder_searches for select
  using (user_id = auth.uid());

create policy "finder: insertion libre (connecté ou anonyme)"
  on public.finder_searches for insert
  with check (user_id = auth.uid() or user_id is null);
