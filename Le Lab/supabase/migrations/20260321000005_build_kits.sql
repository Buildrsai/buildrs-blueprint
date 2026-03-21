-- ── Table project_build_kits ──────────────────────────────────────────────
create table if not exists public.project_build_kits (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects(id) on delete cascade,
  claude_md     text,
  mcp_json      text,
  prompts       jsonb not null default '{}',
  generated_at  timestamptz not null default now(),
  unique(project_id)
);

create index kits_project_id_idx on public.project_build_kits(project_id);

-- RLS : via join sur projects
alter table public.project_build_kits enable row level security;

create policy "kits: accès propriétaire"
  on public.project_build_kits for all
  using (
    project_id in (
      select id from public.projects where user_id = auth.uid()
    )
  );
