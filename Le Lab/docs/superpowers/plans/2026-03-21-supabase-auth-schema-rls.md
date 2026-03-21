# Supabase — Auth + Schéma DB + RLS

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mettre en place la fondation backend complète de Buildrs Lab — Supabase CLI, schéma de base de données, RLS, et auth connectée au frontend (email/password, magic link, OAuth Google/GitHub/Apple).

**Architecture:** Supabase CLI avec migrations versionnées dans `supabase/migrations/`. Le frontend utilise le client Supabase déjà initialisé dans `src/lib/supabase.ts`. Un hook `useAuth` centralise l'état d'authentification. L'`AppLayout` protège toutes les routes authentifiées.

**Tech Stack:** Supabase CLI, @supabase/supabase-js (déjà installé), React Router v7, TypeScript strict.

---

## Fichiers impactés

| Action | Fichier | Responsabilité |
|--------|---------|----------------|
| Créer | `supabase/migrations/20260321000001_profiles.sql` | Table profiles + trigger auth |
| Créer | `supabase/migrations/20260321000002_projects.sql` | Table projects + RLS |
| Créer | `supabase/migrations/20260321000003_phases.sql` | Table project_phases + RLS |
| Créer | `supabase/migrations/20260321000004_finder.sql` | Table finder_searches + RLS |
| Créer | `supabase/migrations/20260321000005_build_kits.sql` | Table project_build_kits + RLS |
| Créer | `supabase/seed.sql` | Données de test |
| Modifier | `src/lib/supabase.ts` | Ajout types DB + helper getSession |
| Créer | `src/types/database.ts` | Types TypeScript générés du schéma |
| Créer | `src/hooks/use-auth.ts` | Hook useAuth (user, session, loading, signOut) |
| Modifier | `src/app/(public)/login-page.tsx` | Connexion Supabase (email/password + magic link + OAuth) |
| Modifier | `src/app/(public)/signup-page.tsx` | Inscription Supabase (email/password + OAuth) |
| Créer | `src/app/(public)/auth-callback-page.tsx` | Gestion callback OAuth |
| Modifier | `src/components/layout/app-layout.tsx` | Protection routes (redirect → /login si non connecté) |
| Modifier | `src/App.tsx` | Ajout route /auth/callback |

---

## Chunk 1 : Supabase CLI + initialisation projet

### Task 1 : Installer Supabase CLI et initialiser le projet local

**Files:**
- Créer: `supabase/config.toml` (généré par CLI)

- [ ] **Step 1 : Installer Supabase CLI (macOS)**

```bash
brew install supabase/tap/supabase
```

Vérifier :
```bash
supabase --version
```
Résultat attendu : `supabase version X.X.X`

- [ ] **Step 2 : Initialiser Supabase dans le projet**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab"
supabase init
```

Résultat attendu : dossier `supabase/` créé avec `config.toml`.

- [ ] **Step 3 : Créer le projet sur supabase.com**

**Action manuelle requise :**
1. Aller sur https://supabase.com/dashboard
2. Cliquer "New project"
3. Nom : `buildrs-lab`
4. Choisir région : `West EU (Ireland)` ou la plus proche
5. Générer un mot de passe fort (le sauvegarder)
6. Attendre que le projet soit prêt (~2 min)
7. Aller dans Settings → API
8. Copier `Project URL` et `anon public key`

- [ ] **Step 4 : Créer `.env.local` avec les variables**

```bash
cat > "/Users/alfredorsini/CLAUDE/Le Lab/.env.local" << 'EOF'
VITE_SUPABASE_URL=https://VOTRE_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=VOTRE_ANON_KEY
EOF
```

Remplacer les valeurs par celles copiées à l'étape précédente.

- [ ] **Step 5 : Lier le projet local au projet distant**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab"
supabase link --project-ref VOTRE_PROJECT_ID
```

Résultat attendu : `Linked to project buildrs-lab`

- [ ] **Step 6 : Commit**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab"
git add supabase/
git commit -m "chore(supabase): initialisation CLI et config"
```

---

## Chunk 2 : Migrations — Schéma de base de données

### Task 2 : Migration `profiles` — table + trigger

**Files:**
- Créer: `supabase/migrations/20260321000001_profiles.sql`

- [ ] **Step 1 : Créer la migration**

```bash
mkdir -p "/Users/alfredorsini/CLAUDE/Le Lab/supabase/migrations"
```

Créer `supabase/migrations/20260321000001_profiles.sql` :

```sql
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
```

- [ ] **Step 2 : Appliquer la migration**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab"
supabase db push
```

Résultat attendu : `Applying migration 20260321000001_profiles.sql... done`

- [ ] **Step 3 : Vérifier dans le dashboard**

Aller sur https://supabase.com/dashboard → Table Editor → vérifier que la table `profiles` existe.

### Task 3 : Migration `projects`

**Files:**
- Créer: `supabase/migrations/20260321000002_projects.sql`

- [ ] **Step 1 : Créer la migration**

Créer `supabase/migrations/20260321000002_projects.sql` :

```sql
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
```

- [ ] **Step 2 : Appliquer**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab"
supabase db push
```

### Task 4 : Migration `project_phases`

**Files:**
- Créer: `supabase/migrations/20260321000003_phases.sql`

- [ ] **Step 1 : Créer la migration**

Créer `supabase/migrations/20260321000003_phases.sql` :

```sql
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
```

- [ ] **Step 2 : Appliquer**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab"
supabase db push
```

### Task 5 : Migrations `finder_searches` et `project_build_kits`

**Files:**
- Créer: `supabase/migrations/20260321000004_finder.sql`
- Créer: `supabase/migrations/20260321000005_build_kits.sql`

- [ ] **Step 1 : Créer la migration finder**

Créer `supabase/migrations/20260321000004_finder.sql` :

```sql
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
```

- [ ] **Step 2 : Créer la migration build_kits**

Créer `supabase/migrations/20260321000005_build_kits.sql` :

```sql
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
```

- [ ] **Step 3 : Appliquer les deux migrations**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab"
supabase db push
```

Résultat attendu : les 5 migrations appliquées, 5 tables visibles dans le dashboard.

- [ ] **Step 4 : Créer seed.sql**

Créer `supabase/seed.sql` :

```sql
-- Seed de développement — NE PAS utiliser en production
-- À appliquer manuellement via : supabase db reset (réinitialise + applique seed)

-- Note : le trigger handle_new_user crée le profil automatiquement
-- quand on crée un user via l'API Auth. Ce seed ne peut pas créer
-- de user directement dans auth.users sans passer par l'API.
-- Utiliser le dashboard Supabase → Authentication → Add user pour créer
-- un user de test, puis observer le profil créé automatiquement.

select 'Seed prêt — crée un user de test via le dashboard Supabase Auth' as message;
```

- [ ] **Step 5 : Commit**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab"
git add supabase/
git commit -m "feat(supabase): migrations schéma complet (profiles, projects, phases, finder, build_kits) + RLS"
```

---

## Chunk 3 : Types TypeScript + client Supabase

### Task 6 : Générer les types TypeScript depuis le schéma

**Files:**
- Créer: `src/types/database.ts`
- Modifier: `src/lib/supabase.ts`

- [ ] **Step 1 : Générer les types depuis Supabase**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab"
supabase gen types typescript --linked > src/types/database.ts
```

Vérifier que le fichier contient les types pour `profiles`, `projects`, `project_phases`, `finder_searches`, `project_build_kits`.

- [ ] **Step 2 : Mettre à jour `src/lib/supabase.ts`**

Remplacer le contenu complet :

```ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Buildrs] Variables Supabase manquantes.\n' +
    'Copie .env.example → .env.local et remplis VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.'
  )
}

export const supabase = createClient<Database>(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-key'
)

/** Récupère la session active, ou null si non connecté */
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export type { User, Session } from '@supabase/supabase-js'
```

- [ ] **Step 3 : Vérifier TypeScript**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab" && npx tsc --noEmit
```

Résultat attendu : aucune erreur.

- [ ] **Step 4 : Commit**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab"
git add src/types/database.ts src/lib/supabase.ts
git commit -m "feat(supabase): types TypeScript générés + client typé Database"
```

---

## Chunk 4 : Hook useAuth

### Task 7 : Créer `src/hooks/use-auth.ts`

**Files:**
- Créer: `src/hooks/use-auth.ts`

- [ ] **Step 1 : Créer le hook**

```ts
import { useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
}

/**
 * Hook centralisant l'état d'authentification Supabase.
 * Souscrit aux changements de session en temps réel.
 *
 * Usage :
 *   const { user, loading, signOut } = useAuth()
 */
function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  })

  useEffect(() => {
    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({ user: session?.user ?? null, session, loading: false })
    })

    // Écouter les changements d'auth (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState({ user: session?.user ?? null, session, loading: false })
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { ...state, signOut }
}

export { useAuth }
```

- [ ] **Step 2 : Vérifier TypeScript**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab" && npx tsc --noEmit
```

- [ ] **Step 3 : Commit**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab"
git add src/hooks/use-auth.ts
git commit -m "feat(auth): hook useAuth avec onAuthStateChange Supabase"
```

---

## Chunk 5 : Pages login + signup connectées

### Task 8 : Connecter `login-page.tsx` à Supabase Auth

**Files:**
- Modifier: `src/app/(public)/login-page.tsx`

- [ ] **Step 1 : Réécrire `login-page.tsx`**

```tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'
import { Chrome, Github, Apple, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' })
  const [errors, setErrors] = useState<Partial<LoginForm & { global: string }>>({})
  const [loading, setLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)

  // Email + mot de passe
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = loginSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Partial<LoginForm> = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof LoginForm
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) {
      setErrors({ global: 'Email ou mot de passe incorrect.' })
      setLoading(false)
      return
    }

    navigate('/dashboard')
  }

  // Magic link
  const handleMagicLink = async () => {
    const emailResult = z.string().email().safeParse(form.email)
    if (!emailResult.success) {
      setErrors({ email: 'Entre ton email pour recevoir le lien.' })
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email: form.email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) {
      setErrors({ global: error.message })
      return
    }
    setMagicSent(true)
  }

  // OAuth
  const handleOAuth = async (provider: 'google' | 'github' | 'apple') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  if (magicSent) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-[#F8F9FC] px-6">
        <div className="text-center flex flex-col gap-3 max-w-sm">
          <Mail size={32} className="text-[#3279F9] mx-auto" strokeWidth={1.5} />
          <h2 className="text-[#121317] font-medium text-xl">Vérifie ta boite mail</h2>
          <p className="text-sm text-[#45474D]">
            On t'a envoyé un lien de connexion à <strong>{form.email}</strong>.
            Clique dessus pour te connecter.
          </p>
          <button
            onClick={() => setMagicSent(false)}
            className="text-sm text-[#3279F9] hover:text-[#1A73E8] mt-2"
          >
            Retour
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-[#F8F9FC] px-6 py-12">
      <div className="w-full max-w-[400px] flex flex-col gap-8">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#121317] flex items-center justify-center mb-1">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <h1
            className="text-[#121317]"
            style={{ fontSize: '1.5rem', fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            Bon retour
          </h1>
          <p className="text-sm text-[#45474D]">Connecte-toi à ton espace Buildrs Lab</p>
        </div>

        {/* OAuth */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleOAuth('google')}
            className="flex items-center justify-center gap-3 w-full h-10 rounded-full border border-[#E6EAF0] bg-white text-sm font-medium text-[#121317] hover:bg-[#F8F9FC] transition-colors"
          >
            <Chrome size={16} strokeWidth={1.5} />
            Continuer avec Google
          </button>
          <button
            onClick={() => handleOAuth('github')}
            className="flex items-center justify-center gap-3 w-full h-10 rounded-full border border-[#E6EAF0] bg-white text-sm font-medium text-[#121317] hover:bg-[#F8F9FC] transition-colors"
          >
            <Github size={16} strokeWidth={1.5} />
            Continuer avec GitHub
          </button>
          <button
            onClick={() => handleOAuth('apple')}
            className="flex items-center justify-center gap-3 w-full h-10 rounded-full border border-[#E6EAF0] bg-white text-sm font-medium text-[#121317] hover:bg-[#F8F9FC] transition-colors"
          >
            <Apple size={16} strokeWidth={1.5} />
            Continuer avec Apple
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#E6EAF0]" />
          <span className="text-xs text-[#B2BBC5]">ou par email</span>
          <div className="flex-1 h-px bg-[#E6EAF0]" />
        </div>

        <Card variant="white" padding="lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {errors.global && (
              <p className="text-sm text-[#EF4444] text-center">{errors.global}</p>
            )}
            <Input
              mode="light"
              label="Email"
              type="email"
              placeholder="ton@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              autoComplete="email"
            />
            <div className="flex flex-col gap-1.5">
              <Input
                mode="light"
                label="Mot de passe"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={handleMagicLink}
                className="text-xs text-[#3279F9] hover:text-[#1A73E8] self-end transition-colors"
              >
                Connexion par lien magique
              </button>
            </div>

            <Button type="submit" variant="primary" fullWidth loading={loading}>
              Se connecter
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-[#45474D]">
          Pas encore de compte ?{' '}
          <Link to="/signup" className="text-[#3279F9] hover:text-[#1A73E8] font-medium transition-colors">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}

export { LoginPage }
```

- [ ] **Step 2 : Vérifier TypeScript**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab" && npx tsc --noEmit
```

### Task 9 : Connecter `signup-page.tsx` à Supabase Auth

**Files:**
- Modifier: `src/app/(public)/signup-page.tsx`

- [ ] **Step 1 : Réécrire `signup-page.tsx`**

```tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'
import { Check, Chrome, Github, Apple } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'

const signupSchema = z.object({
  name: z.string().min(2, 'Ton prénom doit faire au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  password: z
    .string()
    .min(8, 'Au moins 8 caractères')
    .regex(/[A-Z]/, 'Au moins une majuscule')
    .regex(/[0-9]/, 'Au moins un chiffre'),
})

type SignupForm = z.infer<typeof signupSchema>

const BENEFITS = [
  'Buildrs Finder gratuit et illimité',
  'Accès au Lab dès le paiement',
  'Annule quand tu veux',
]

function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<SignupForm>({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState<Partial<SignupForm & { global: string }>>({})
  const [loading, setLoading] = useState(false)
  const [confirmSent, setConfirmSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = signupSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Partial<SignupForm> = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof SignupForm
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (error) {
      setErrors({ global: error.message })
      return
    }

    // Supabase envoie un email de confirmation
    setConfirmSent(true)
  }

  const handleOAuth = async (provider: 'google' | 'github' | 'apple') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  if (confirmSent) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-[#F8F9FC] px-6">
        <div className="text-center flex flex-col gap-3 max-w-sm">
          <Check size={32} className="text-[#22C55E] mx-auto" strokeWidth={1.5} />
          <h2 className="text-[#121317] font-medium text-xl">Vérifie ta boite mail</h2>
          <p className="text-sm text-[#45474D]">
            On t'a envoyé un lien de confirmation à <strong>{form.email}</strong>.
            Clique dessus pour activer ton compte.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-[#F8F9FC] px-6 py-12">
      <div className="w-full max-w-[400px] flex flex-col gap-7">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#121317] flex items-center justify-center mb-1">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <h1
            className="text-[#121317]"
            style={{ fontSize: '1.5rem', fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            Crée ton compte
          </h1>
          <p className="text-sm text-[#45474D]">Gratuit. Aucune carte requise pour commencer.</p>
        </div>

        <ul className="flex flex-col gap-2">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-2.5">
              <Check size={13} className="text-[#22C55E] flex-shrink-0" strokeWidth={2.5} />
              <span className="text-sm text-[#45474D]">{b}</span>
            </li>
          ))}
        </ul>

        {/* OAuth */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleOAuth('google')}
            className="flex items-center justify-center gap-3 w-full h-10 rounded-full border border-[#E6EAF0] bg-white text-sm font-medium text-[#121317] hover:bg-[#F8F9FC] transition-colors"
          >
            <Chrome size={16} strokeWidth={1.5} />
            Continuer avec Google
          </button>
          <button
            onClick={() => handleOAuth('github')}
            className="flex items-center justify-center gap-3 w-full h-10 rounded-full border border-[#E6EAF0] bg-white text-sm font-medium text-[#121317] hover:bg-[#F8F9FC] transition-colors"
          >
            <Github size={16} strokeWidth={1.5} />
            Continuer avec GitHub
          </button>
          <button
            onClick={() => handleOAuth('apple')}
            className="flex items-center justify-center gap-3 w-full h-10 rounded-full border border-[#E6EAF0] bg-white text-sm font-medium text-[#121317] hover:bg-[#F8F9FC] transition-colors"
          >
            <Apple size={16} strokeWidth={1.5} />
            Continuer avec Apple
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#E6EAF0]" />
          <span className="text-xs text-[#B2BBC5]">ou par email</span>
          <div className="flex-1 h-px bg-[#E6EAF0]" />
        </div>

        <Card variant="white" padding="lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {errors.global && (
              <p className="text-sm text-[#EF4444] text-center">{errors.global}</p>
            )}
            <Input
              mode="light"
              label="Prénom"
              type="text"
              placeholder="Tony"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
              autoComplete="given-name"
            />
            <Input
              mode="light"
              label="Email"
              type="email"
              placeholder="tony@stark.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              mode="light"
              label="Mot de passe"
              type="password"
              placeholder="Au moins 8 caractères"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
              hint="8 caractères minimum, une majuscule, un chiffre"
              autoComplete="new-password"
            />

            <Button type="submit" variant="primary" fullWidth loading={loading}>
              Créer mon compte
            </Button>

            <p className="text-xs text-center text-[#B2BBC5]">
              En créant un compte, tu acceptes nos{' '}
              <Link to="#" className="text-[#45474D] hover:text-[#121317] underline">CGV</Link>{' '}
              et notre{' '}
              <Link to="#" className="text-[#45474D] hover:text-[#121317] underline">politique de confidentialité</Link>.
            </p>
          </form>
        </Card>

        <p className="text-center text-sm text-[#45474D]">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-[#3279F9] hover:text-[#1A73E8] font-medium transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}

export { SignupPage }
```

- [ ] **Step 2 : Vérifier TypeScript**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab" && npx tsc --noEmit
```

- [ ] **Step 3 : Commit**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab"
git add "src/app/(public)/login-page.tsx" "src/app/(public)/signup-page.tsx"
git commit -m "feat(auth): login + signup connectés à Supabase (email/password, magic link, OAuth)"
```

---

## Chunk 6 : Callback OAuth + protection routes

### Task 10 : Page callback OAuth

**Files:**
- Créer: `src/app/(public)/auth-callback-page.tsx`
- Modifier: `src/App.tsx`

- [ ] **Step 1 : Créer la page callback**

```tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '@/lib/supabase'

/**
 * Page de redirection après OAuth ou magic link.
 * Supabase redirige vers /auth/callback avec le token dans l'URL.
 * On échange le token contre une session, puis on redirige vers /dashboard.
 */
function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    })
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-[#3279F9] border-t-transparent animate-spin" />
        <p className="text-sm text-[#45474D]">Connexion en cours…</p>
      </div>
    </div>
  )
}

export { AuthCallbackPage }
```

- [ ] **Step 2 : Ajouter la route dans `src/App.tsx`**

Importer la page et ajouter la route dans le groupe public :

```tsx
// Ajouter l'import
import { AuthCallbackPage } from '@/app/(public)/auth-callback-page'

// Ajouter dans le tableau children du groupe public :
{ path: '/auth/callback', element: <AuthCallbackPage /> },
```

### Task 11 : Protéger les routes authentifiées dans `app-layout.tsx`

**Files:**
- Modifier: `src/components/layout/app-layout.tsx`

- [ ] **Step 1 : Mettre à jour `app-layout.tsx`**

```tsx
import { useEffect } from 'react'
import { Outlet, useParams, useNavigate } from 'react-router'
import { AppSidebar } from './app-sidebar'
import { AppHeader } from './app-header'
import { useAuth } from '@/hooks/use-auth'

function AppLayout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, loading, navigate])

  // Pendant la vérification de session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000000]">
        <div className="w-5 h-5 rounded-full border-2 border-[#3279F9] border-t-transparent animate-spin" />
      </div>
    )
  }

  // Non connecté — sera redirigé par le useEffect
  if (!user) return null

  return (
    <div className="min-h-screen flex bg-[#050508] dark">
      <AppSidebar currentProjectId={id} />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export { AppLayout }
```

- [ ] **Step 2 : Vérifier TypeScript**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab" && npx tsc --noEmit
```

- [ ] **Step 3 : Build de production**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab" && npm run build
```

Résultat attendu : build sans erreurs.

- [ ] **Step 4 : Commit final**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab"
git add "src/app/(public)/auth-callback-page.tsx" src/App.tsx src/components/layout/app-layout.tsx
git commit -m "feat(auth): callback OAuth + protection routes AppLayout avec useAuth"
```

---

## Chunk 7 : Configuration OAuth dans le dashboard Supabase

### Task 12 : Activer les providers OAuth

**Action manuelle — à faire dans le dashboard Supabase**

- [ ] **Step 1 : Configurer Google OAuth**

1. Aller sur https://console.cloud.google.com
2. Créer un projet ou utiliser un existant
3. APIs & Services → Credentials → Create OAuth 2.0 Client ID
4. Type : Web application
5. Authorized redirect URI : `https://VOTRE_PROJECT_ID.supabase.co/auth/v1/callback`
6. Copier Client ID et Client Secret
7. Dans Supabase Dashboard → Authentication → Providers → Google → Enable + coller les clés

- [ ] **Step 2 : Configurer GitHub OAuth**

1. Aller sur https://github.com/settings/developers
2. New OAuth App
3. Homepage URL : `http://localhost:5173` (dev) ou ton domaine
4. Callback URL : `https://VOTRE_PROJECT_ID.supabase.co/auth/v1/callback`
5. Copier Client ID et Client Secret
6. Dans Supabase → Authentication → Providers → GitHub → Enable + clés

- [ ] **Step 3 : Configurer Apple OAuth**

1. Nécessite un compte Apple Developer (99$/an)
2. Identifiers → App IDs → créer un App ID avec Sign in with Apple activé
3. Keys → créer une clé avec Sign in with Apple
4. Dans Supabase → Authentication → Providers → Apple → Enable + coller les infos

- [ ] **Step 4 : Ajouter l'URL de redirection dans Supabase**

Supabase Dashboard → Authentication → URL Configuration :
- Site URL : `http://localhost:5173`
- Redirect URLs : `http://localhost:5173/auth/callback`

---

## Chunk 8 : Recette finale

### Task 13 : Vérification complète

- [ ] **Step 1 : Test inscription email/password**

1. Lancer `npm run dev`
2. Aller sur http://localhost:5173/signup
3. Créer un compte avec email + mot de passe
4. Vérifier l'email de confirmation reçu
5. Cliquer le lien → doit rediriger vers `/auth/callback` → `/dashboard`
6. Vérifier dans Supabase Dashboard → Authentication → Users : user créé
7. Vérifier dans Table Editor → profiles : row créé automatiquement par le trigger

- [ ] **Step 2 : Test connexion email/password**

1. Aller sur http://localhost:5173/login
2. Se connecter avec le compte créé
3. Doit rediriger vers `/dashboard`

- [ ] **Step 3 : Test magic link**

1. Aller sur `/login`
2. Entrer l'email, cliquer "Connexion par lien magique"
3. Email reçu avec le lien
4. Cliquer → connexion réussie

- [ ] **Step 4 : Test protection routes**

1. Se déconnecter (pas encore de bouton — tester via Supabase Dashboard → Auth → Users → Sign out)
2. Aller directement sur http://localhost:5173/dashboard
3. Doit rediriger vers `/login`

- [ ] **Step 5 : Test RLS**

Dans Supabase Dashboard → SQL Editor :
```sql
-- Vérifier qu'un user ne peut pas lire les projets d'un autre
-- (le dashboard bypasse RLS car il utilise le service role)
-- Test visuel : créer 2 users, vérifier que chaque user ne voit que ses données
select * from public.profiles;
select * from public.projects;
```

- [ ] **Step 6 : Commit de clôture**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab"
git add -A
git commit -m "chore(auth): recette finale Supabase Auth + schéma + RLS"
```
