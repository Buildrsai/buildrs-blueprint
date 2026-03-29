-- Ajout des colonnes pour stocker les données générées par phase
-- structure_data: Phase 2 (pages, features, data model, monétisation)
-- branding_data: Phase 3 (identité visuelle, palette, typo)
-- build_kit_data: Phase 4 (CLAUDE.md, prompts, MCP config)

alter table public.projects
  add column if not exists structure_data jsonb not null default '{}',
  add column if not exists branding_data jsonb not null default '{}',
  add column if not exists build_kit_data jsonb not null default '{}';
