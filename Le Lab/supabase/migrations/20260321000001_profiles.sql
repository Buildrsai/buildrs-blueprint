-- ── Table profiles ────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id                      uuid primary key references auth.users(id) on delete cascade,
  email                   text,
  full_name               text,
  avatar_url              text,
  plan                    text not null default 'free'
                            check (plan in ('free', 'lab', 'pro')),
  stripe_customer_id      text,
  stripe_subscription_id  text,
  created_at              timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;

create policy "profiles: lecture propriétaire"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles: modification propriétaire"
  on public.profiles for update
  using (id = auth.uid());

-- ── Trigger : créer un profil automatiquement à l'inscription ─────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
