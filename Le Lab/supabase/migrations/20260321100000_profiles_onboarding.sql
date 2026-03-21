-- ── Ajout des champs onboarding à la table profiles ──────────────────────────
alter table public.profiles
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists onboarding_data      jsonb,
  add column if not exists updated_at           timestamptz not null default now();

-- Trigger updated_at
create or replace function public.handle_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_profiles_updated_at();

-- Policy INSERT (pour upsert côté client si le profil n'existe pas encore)
create policy "profiles: insertion propriétaire"
  on public.profiles for insert
  with check (id = auth.uid());
