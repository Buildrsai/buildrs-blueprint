-- Recrée la table purchases avec la bonne structure
drop table if exists public.purchases cascade;

create table public.purchases (
  id                uuid        primary key default gen_random_uuid(),
  email             text        not null,
  product           text        not null,
  stripe_session_id text,
  purchased_at      timestamptz not null default now(),
  applied           boolean     not null default false
);

create index purchases_email_idx on public.purchases (email);

alter table public.purchases enable row level security;

create policy "service role full access" on public.purchases
  using (true)
  with check (true);

create policy "user read own purchases" on public.purchases
  for select
  using (email = (select email from auth.users where id = auth.uid()));
