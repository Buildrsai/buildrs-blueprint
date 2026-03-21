-- ── Table project_phases ──────────────────────────────────────────────────
create table if not exists public.project_phases (
  id                uuid primary key default gen_random_uuid(),
  project_id        uuid not null references public.projects(id) on delete cascade,
  phase_number      integer not null check (phase_number between 1 and 8),
  status            text not null default 'locked'
                      check (status in ('locked', 'active', 'completed')),
  steps_completed   jsonb not null default '[]',
  generated_content jsonb not null default '{}',
  completed_at      timestamptz,
  unique(project_id, phase_number)
);

create index phases_project_id_idx on public.project_phases(project_id);

-- RLS : via join sur projects pour vérifier l'ownership
alter table public.project_phases enable row level security;

create policy "phases: accès propriétaire"
  on public.project_phases for all
  using (
    project_id in (
      select id from public.projects where user_id = auth.uid()
    )
  );
