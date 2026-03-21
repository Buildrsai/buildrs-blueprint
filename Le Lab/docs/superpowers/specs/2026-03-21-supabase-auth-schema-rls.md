# Supabase — Auth + Schéma DB + RLS

**Date :** 2026-03-21
**Statut :** Approuvé
**Sous-projet :** 1/5 — Fondation backend
**Dépendances :** Aucune (premier sous-projet)
**Bloque :** Finder (2/5), Stripe (3/5), Lab Phases (4/5)

---

## Contexte

Fondation backend de Buildrs Lab. Tout le reste en dépend. On part de zéro — pas de projet Supabase existant. Approche : Supabase CLI avec fichiers de migration versionnés dans le repo.

---

## Section 1 — Auth

**5 méthodes de connexion :**
- Email + password (signup/login classique)
- Magic link (email avec lien, sans mot de passe)
- OAuth Google
- OAuth GitHub
- OAuth Apple

**Mécanique :**
- Providers OAuth configurés dans le dashboard Supabase
- Callbacks gérés automatiquement par Supabase (`/auth/callback`)
- Côté frontend : `supabase.auth.signInWithOAuth({ provider })` par bouton
- Un `profiles` row créé automatiquement via trigger Postgres sur `auth.users` à chaque inscription

**Hook frontend :** `src/hooks/use-auth.ts`
- Expose `{ user, session, loading, signOut }`
- Utilise `supabase.auth.onAuthStateChange`
- Utilisé dans `AppLayout` pour protéger les routes authentifiées

---

## Section 2 — Schéma de base de données

### Table `profiles`
Créée automatiquement via trigger sur `auth.users`.

```sql
create table profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text,
  full_name       text,
  avatar_url      text,
  plan            text not null default 'free' check (plan in ('free', 'lab', 'pro')),
  stripe_customer_id      text,
  stripe_subscription_id  text,
  created_at      timestamptz default now()
);
```

**Trigger :** à chaque INSERT sur `auth.users`, crée automatiquement un row dans `profiles`.

### Table `projects`

```sql
create table projects (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references profiles(id) on delete cascade,
  name            text not null,
  description     text,
  status          text not null default 'active' check (status in ('active', 'completed', 'paused')),
  current_phase   integer not null default 1 check (current_phase between 1 and 8),
  idea_data       jsonb default '{}',
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
```

**Contrainte plan :** vérifiée au niveau applicatif (pas en DB) — plan `lab` = 1 projet max, plan `pro` = illimité.

### Table `project_phases`

```sql
create table project_phases (
  id                uuid primary key default gen_random_uuid(),
  project_id        uuid not null references projects(id) on delete cascade,
  phase_number      integer not null check (phase_number between 1 and 8),
  status            text not null default 'locked' check (status in ('locked', 'active', 'completed')),
  steps_completed   jsonb default '[]',
  generated_content jsonb default '{}',
  completed_at      timestamptz,
  unique(project_id, phase_number)
);
```

### Table `finder_searches`

```sql
create table finder_searches (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references profiles(id) on delete set null,
  mode        text not null check (mode in ('find', 'validate', 'copy')),
  input       text not null,
  result      jsonb default '{}',
  score       integer check (score between 0 and 100),
  created_at  timestamptz default now()
);
```

**Note :** `user_id` nullable — les recherches anonymes (sans login) sont autorisées.

### Table `project_build_kits`

```sql
create table project_build_kits (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references projects(id) on delete cascade,
  claude_md     text,
  mcp_json      text,
  prompts       jsonb default '{}',
  generated_at  timestamptz default now(),
  unique(project_id)
);
```

---

## Section 3 — RLS (Row Level Security)

RLS activé sur toutes les tables. Rôle unique : `authenticated`.

### `profiles`
```sql
-- Un utilisateur ne voit et modifie que son propre profil
create policy "profiles_select" on profiles for select using (id = auth.uid());
create policy "profiles_update" on profiles for update using (id = auth.uid());
```

### `projects`
```sql
create policy "projects_all" on projects for all using (user_id = auth.uid());
```

### `project_phases`
```sql
-- Via join sur projects pour vérifier l'ownership
create policy "phases_all" on project_phases for all using (
  project_id in (select id from projects where user_id = auth.uid())
);
```

### `finder_searches`
```sql
-- Lecture/écriture sur ses propres recherches + insertion anonyme
create policy "finder_select" on finder_searches for select using (user_id = auth.uid());
create policy "finder_insert" on finder_searches for insert with check (
  user_id = auth.uid() or user_id is null
);
```

### `project_build_kits`
```sql
create policy "kits_all" on project_build_kits for all using (
  project_id in (select id from projects where user_id = auth.uid())
);
```

---

## Section 4 — Structure projet Supabase CLI

```
supabase/
├── config.toml
├── migrations/
│   ├── 20260321000001_profiles.sql
│   ├── 20260321000002_projects.sql
│   ├── 20260321000003_phases.sql
│   ├── 20260321000004_finder.sql
│   └── 20260321000005_build_kits.sql
└── seed.sql
```

**Fichiers frontend touchés :**
- `src/lib/supabase.ts` — ajout helper `getSession()`
- `src/hooks/use-auth.ts` — nouveau hook (création)
- `src/app/(public)/login-page.tsx` — connexion Supabase Auth
- `src/app/(public)/signup-page.tsx` — inscription Supabase Auth
- `src/components/layout/app-layout.tsx` — protection routes avec `useAuth`

---

## Variables d'environnement requises

```bash
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Configurées dans `.env.local` (déjà dans `.gitignore`).

---

## Ordre d'implémentation

1. Installer Supabase CLI + initialiser le projet local
2. Créer le projet sur supabase.com
3. Configurer les providers OAuth (Google, GitHub, Apple) dans le dashboard
4. Écrire et appliquer les migrations (dans l'ordre)
5. Créer le trigger `profiles` + les policies RLS
6. Écrire `seed.sql` pour les données de test
7. Mettre à jour `src/lib/supabase.ts`
8. Créer `src/hooks/use-auth.ts`
9. Connecter `login-page.tsx` et `signup-page.tsx`
10. Protéger les routes dans `app-layout.tsx`

---

## Critères de succès

- [ ] `supabase db push` sans erreur
- [ ] Inscription email/password crée un profil automatiquement
- [ ] Magic link fonctionne (email reçu, connexion réussie)
- [ ] OAuth Google, GitHub, Apple redirigent correctement
- [ ] RLS vérifié : un user ne peut pas lire les données d'un autre
- [ ] Routes `/dashboard`, `/project/*` redirigent vers `/login` si non connecté
- [ ] `useAuth()` retourne le bon user partout dans l'app
