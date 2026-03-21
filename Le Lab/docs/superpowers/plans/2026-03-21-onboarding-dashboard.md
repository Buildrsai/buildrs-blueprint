# Onboarding + Dashboard LIGHT — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implémenter le pré-onboarding (7 questions → welcome screen → Supabase) et refondre le dashboard + layout en thème LIGHT.

**Architecture:** Route `/onboarding` standalone avec layout minimal, état local des 7 étapes sauvegardé en une requête Supabase à la fin. `AppLayout` vérifie `profiles.onboarding_completed` et redirige si nécessaire. Dashboard/sidebar/header passent en thème LIGHT (fond `#F8F9FC`, cartes blanches).

**Tech Stack:** Vite 6, React 19, TypeScript strict, Tailwind CSS, Supabase JS v2, React Router v7, Zod (déjà installé), Lucide React

---

## Fichiers — Vue d'ensemble

| Fichier | Action | Rôle |
|---------|--------|------|
| `supabase/migrations/20260321000000_create_profiles.sql` | Créer | Table profiles + trigger + RLS |
| `src/hooks/use-profile.ts` | Créer | Fetch + upsert profil Supabase |
| `src/app/(auth)/onboarding-page.tsx` | Créer | Page principale onboarding (7 steps + welcome) |
| `src/components/onboarding/onboarding-step.tsx` | Créer | Composant question avec radio cards |
| `src/components/onboarding/welcome-screen.tsx` | Créer | Écran de bienvenue personnalisé |
| `src/App.tsx` | Modifier | Ajout route `/onboarding` |
| `src/components/layout/app-layout.tsx` | Modifier | LIGHT + guard onboarding |
| `src/components/layout/app-sidebar.tsx` | Modifier | Thème LIGHT |
| `src/components/layout/app-header.tsx` | Modifier | Thème LIGHT |
| `src/app/(auth)/dashboard-page.tsx` | Modifier | LIGHT + greeting |
| `src/components/ui/progress-phases.tsx` | Modifier | Couleur empty LIGHT |

---

## Chunk 1 : Migration Supabase

### Task 1 : Table `profiles`

**Files:**
- Create: `supabase/migrations/20260321000000_create_profiles.sql`

- [ ] **Step 1 : Créer le fichier de migration**

```sql
-- supabase/migrations/20260321000000_create_profiles.sql

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  onboarding_completed boolean not null default false,
  onboarding_data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Auto-création à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);
```

- [ ] **Step 2 : Appliquer la migration**

```bash
npx supabase db push
```

Résultat attendu : `Applying migration 20260321000000_create_profiles.sql... done`

Si tu n'as pas Supabase CLI, applique le SQL directement dans le SQL editor du dashboard Supabase (projet `eblbedfbwsgysdjkxzxb`).

- [ ] **Step 3 : Vérifier dans Supabase dashboard**

Va dans Table Editor → vérifie que la table `profiles` existe avec les colonnes :
`id`, `onboarding_completed`, `onboarding_data`, `created_at`, `updated_at`

- [ ] **Step 4 : Créer un profil pour l'utilisateur existant (si connecté)**

Dans le SQL Editor Supabase, exécute :
```sql
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;
```

- [ ] **Step 5 : Commit**

```bash
git add supabase/migrations/20260321000000_create_profiles.sql
git commit -m "feat(db): create profiles table with onboarding fields"
```

---

## Chunk 2 : Hook useProfile

### Task 2 : `useProfile` hook

**Files:**
- Create: `src/hooks/use-profile.ts`

- [ ] **Step 1 : Créer le hook**

```typescript
// src/hooks/use-profile.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './use-auth'

interface Profile {
  id: string
  onboarding_completed: boolean
  onboarding_data: Record<string, string> | null
}

interface ProfileState {
  profile: Profile | null
  loading: boolean
  error: string | null
}

function useProfile() {
  const { user } = useAuth()
  const [state, setState] = useState<ProfileState>({
    profile: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!user) {
      setState({ profile: null, loading: false, error: null })
      return
    }

    supabase
      .from('profiles')
      .select('id, onboarding_completed, onboarding_data')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error && error.code !== 'PGRST116') {
          // PGRST116 = no rows found (profil pas encore créé)
          setState({ profile: null, loading: false, error: error.message })
        } else {
          setState({ profile: data as Profile | null, loading: false, error: null })
        }
      })
  }, [user?.id])

  const completeOnboarding = async (onboardingData: Record<string, string>) => {
    if (!user) return { error: new Error('Non connecté') }
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        onboarding_data: onboardingData,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .select('id, onboarding_completed, onboarding_data')
      .single()

    if (!error && data) {
      setState(prev => ({ ...prev, profile: data as Profile }))
    }
    return { error }
  }

  return { ...state, completeOnboarding }
}

export { useProfile }
export type { Profile }
```

- [ ] **Step 2 : Vérifier que le build passe**

```bash
npm run build
```

Résultat attendu : `✓ built in X.XXs` sans erreurs TypeScript.

- [ ] **Step 3 : Commit**

```bash
git add src/hooks/use-profile.ts
git commit -m "feat(hooks): add useProfile with Supabase profiles table"
```

---

## Chunk 3 : Composants Onboarding

### Task 3 : `OnboardingStep` — composant question

**Files:**
- Create: `src/components/onboarding/onboarding-step.tsx`

- [ ] **Step 1 : Créer le dossier et le composant**

```bash
mkdir -p src/components/onboarding
```

```tsx
// src/components/onboarding/onboarding-step.tsx
import { useState } from 'react'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface OnboardingStepProps {
  step: number
  total: number
  question: string
  options: string[]
  hasOther?: boolean
  value: string
  onChange: (val: string) => void
  onNext: () => void
  onBack?: () => void
}

function OnboardingStep({
  step,
  total,
  question,
  options,
  hasOther = false,
  value,
  onChange,
  onNext,
  onBack,
}: OnboardingStepProps) {
  const [otherText, setOtherText] = useState('')
  const isOtherSelected = value === '__other__'
  const canProceed = value !== '' && (!isOtherSelected || otherText.trim() !== '')

  const handleNext = () => {
    if (isOtherSelected) {
      onChange(otherText.trim())
    }
    onNext()
  }

  return (
    <div className="w-full max-w-[540px] flex flex-col gap-8">
      {/* Counter */}
      <p className="text-xs text-[#B2BBC5] text-center tracking-wide uppercase">
        {step + 1} / {total}
      </p>

      {/* Question */}
      <h2
        className="text-[#121317] text-center"
        style={{
          fontSize: 'clamp(22px, 4vw, 32px)',
          fontWeight: 400,
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
        }}
      >
        {question}
      </h2>

      {/* Options */}
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              'w-full text-left px-5 py-4 rounded-xl border text-sm transition-all duration-150',
              value === opt
                ? 'bg-white border-[#3279F9] ring-1 ring-[#3279F9]/20 text-[#121317]'
                : 'bg-white border-[#E6EAF0] text-[#45474D] hover:border-[#B2BBC5]'
            )}
          >
            {opt}
          </button>
        ))}

        {hasOther && (
          <div>
            <button
              onClick={() => onChange('__other__')}
              className={cn(
                'w-full text-left px-5 py-4 rounded-xl border text-sm transition-all duration-150',
                isOtherSelected
                  ? 'bg-white border-[#3279F9] ring-1 ring-[#3279F9]/20 text-[#121317]'
                  : 'bg-white border-[#E6EAF0] text-[#45474D] hover:border-[#B2BBC5]'
              )}
            >
              Autre…
            </button>
            {isOtherSelected && (
              <input
                autoFocus
                className="mt-2 w-full px-4 py-3 rounded-xl border border-[#3279F9] bg-white
                  text-sm text-[#121317] placeholder:text-[#B2BBC5]
                  focus:outline-none focus:ring-2 focus:ring-[#3279F9]/20"
                placeholder="Décris ton profil en quelques mots…"
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && canProceed && handleNext()}
              />
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-[#B2BBC5] hover:text-[#45474D] transition-colors"
          >
            <ArrowLeft size={14} />
            Retour
          </button>
        )}
        <div className="flex-1" />
        <Button
          variant="primary"
          size="lg"
          disabled={!canProceed}
          onClick={handleNext}
          className="gap-2"
        >
          Suivant
          <ArrowRight size={15} />
        </Button>
      </div>
    </div>
  )
}

export { OnboardingStep }
```

### Task 4 : `WelcomeScreen` — écran de bienvenue

**Files:**
- Create: `src/components/onboarding/welcome-screen.tsx`

- [ ] **Step 1 : Créer le composant**

```tsx
// src/components/onboarding/welcome-screen.tsx
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

interface WelcomeScreenProps {
  answers: Record<string, string>
  onStart: () => void
  loading?: boolean
}

function getTimeline(temps: string): string {
  if (temps.startsWith('20h')) return '1-2 semaines'
  if (temps.startsWith('10')) return '2-3 semaines'
  if (temps.startsWith('5')) return '3-5 semaines'
  return '5-8 semaines'
}

function getRevenueLabel(revenu: string): string {
  if (revenu.startsWith('10 000')) return '10 000€+/mois'
  if (revenu.startsWith('3 000')) return '3 000-10 000€/mois'
  if (revenu.startsWith('1 000')) return '1 000-3 000€/mois'
  return '500-1 000€/mois'
}

function WelcomeScreen({ answers, onStart, loading = false }: WelcomeScreenProps) {
  const { user } = useAuth()
  const firstName = user?.email?.split('@')[0] ?? 'toi'
  const timeline = getTimeline(answers.temps ?? '')
  const revenue = getRevenueLabel(answers.revenu ?? '')

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[480px] flex flex-col gap-8 text-center">
        <div className="flex flex-col gap-3">
          <p className="text-xs text-[#B2BBC5] uppercase tracking-wide">Le Lab est prêt</p>
          <h1
            className="text-[#121317]"
            style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: 450,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Bienvenue dans le Lab,
            <br />
            <span className="text-[#3279F9]">{firstName}.</span>
          </h1>
        </div>

        <div className="bg-white border border-[#E6EAF0] rounded-2xl p-6 text-left flex flex-col gap-3">
          <p className="text-sm text-[#45474D] leading-relaxed">
            Ton profil :{' '}
            <span className="text-[#121317] font-medium">{answers.profil ?? '—'}</span>
          </p>
          <p className="text-sm text-[#45474D] leading-relaxed">
            Objectif revenu :{' '}
            <span className="text-[#121317] font-medium">{revenue}</span>
          </p>
          <p className="text-sm text-[#45474D] leading-relaxed">
            Estimation : ton premier SaaS peut être en ligne dans{' '}
            <span className="text-[#121317] font-medium">{timeline}</span> à ton rythme.
          </p>
        </div>

        <p className="text-sm text-[#B2BBC5] leading-relaxed">
          Le Lab va s'adapter à toi. Chaque étape sera calibrée à ton niveau et à ton temps disponible.
        </p>

        <Button variant="primary" size="lg" onClick={onStart} loading={loading} fullWidth>
          Commencer l'aventure →
        </Button>
      </div>
    </div>
  )
}

export { WelcomeScreen }
```

### Task 5 : `OnboardingPage` — page principale

**Files:**
- Create: `src/app/(auth)/onboarding-page.tsx`

- [ ] **Step 1 : Créer la page**

```tsx
// src/app/(auth)/onboarding-page.tsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { OnboardingStep } from '@/components/onboarding/onboarding-step'
import { WelcomeScreen } from '@/components/onboarding/welcome-screen'
import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/use-profile'

const QUESTIONS = [
  {
    key: 'profil',
    question: 'Comment tu te définirais ?',
    options: [
      'Entrepreneur / freelance',
      'Salarié qui veut lancer un side-project',
      'Étudiant / en reconversion',
      'Créateur de contenu / coach',
    ],
    hasOther: true,
  },
  {
    key: 'objectif',
    question: "Qu'est-ce que tu veux accomplir avec le Lab ?",
    options: [
      'Créer mon premier SaaS / app',
      "Transformer une idée que j'ai déjà en produit",
      'Apprendre le VibeCoding et Claude Code',
      'Générer un revenu récurrent (MRR)',
    ],
  },
  {
    key: 'niveau',
    question: 'Quel est ton rapport avec le code ?',
    options: [
      "Je n'ai jamais codé de ma vie",
      "J'ai fait un peu de HTML/CSS ou WordPress",
      'Je connais les bases (un peu de JS ou Python)',
      'Je suis développeur',
    ],
  },
  {
    key: 'budget',
    question: 'Quel budget mensuel tu peux consacrer aux outils ?',
    options: [
      "0-20€ (juste l'abo Claude Pro)",
      '20-50€',
      '50-100€',
      '100€+',
    ],
  },
  {
    key: 'idee',
    question: 'Tu as déjà une idée de produit ?',
    options: [
      "Oui, j'ai une idée précise",
      "J'ai quelques pistes mais rien de clair",
      "Non, je pars de zéro — aide-moi à trouver",
    ],
  },
  {
    key: 'revenu',
    question: 'Combien tu voudrais générer par mois avec ton SaaS ?',
    options: [
      '500-1 000€ (revenu complémentaire)',
      '1 000-3 000€ (revenu significatif)',
      '3 000-10 000€ (revenu principal)',
      '10 000€+ (business à scale)',
    ],
  },
  {
    key: 'temps',
    question: "Combien d'heures par semaine tu peux consacrer au Lab ?",
    options: [
      '2-5h (side-project)',
      '5-10h (engagement sérieux)',
      '10-20h (full focus)',
      '20h+ (temps plein)',
    ],
  },
] as const

function OnboardingPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { completeOnboarding } = useProfile()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  // Rediriger vers /login si non connecté
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, authLoading, navigate])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC]">
        <div className="w-5 h-5 rounded-full border-2 border-[#3279F9] border-t-transparent animate-spin" />
      </div>
    )
  }

  const isWelcome = step === QUESTIONS.length
  const q = QUESTIONS[step as 0]

  const handleAnswer = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  const handleNext = () => {
    setStep(s => s + 1)
  }

  const handleComplete = async () => {
    setSaving(true)
    await completeOnboarding(answers)
    setSaving(false)
    navigate('/dashboard', { replace: true })
  }

  // Barre de progression (0 à 100%)
  const progressPct = isWelcome ? 100 : ((step + 1) / QUESTIONS.length) * 100

  const header = (
    <div className="h-14 flex items-center px-6 border-b border-[#E6EAF0] bg-white flex-shrink-0">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-[#121317] flex items-center justify-center">
          <span className="text-white font-bold text-xs">B</span>
        </div>
        <span className="font-semibold text-[#121317] text-sm">Buildrs</span>
      </Link>
    </div>
  )

  if (isWelcome) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col">
        {header}
        <WelcomeScreen answers={answers} onStart={handleComplete} loading={saving} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col">
      {header}

      {/* Progress bar */}
      <div className="h-0.5 bg-[#E6EAF0] flex-shrink-0">
        <div
          className="h-full bg-[#3279F9] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Contenu */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <OnboardingStep
          step={step}
          total={QUESTIONS.length}
          question={QUESTIONS[step].question}
          options={[...QUESTIONS[step].options]}
          hasOther={'hasOther' in QUESTIONS[step] && QUESTIONS[step].hasOther}
          value={answers[QUESTIONS[step].key] ?? ''}
          onChange={(val) => handleAnswer(QUESTIONS[step].key, val)}
          onNext={handleNext}
          onBack={step > 0 ? () => setStep(s => s - 1) : undefined}
        />
      </div>
    </div>
  )
}

export { OnboardingPage }
```

### Task 6 : Ajouter `/onboarding` dans le router

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1 : Ajouter l'import**

Dans `src/App.tsx`, ajouter l'import :
```typescript
import { OnboardingPage } from '@/app/(auth)/onboarding-page'
```

- [ ] **Step 2 : Ajouter la route**

La route `/onboarding` doit être HORS du bloc AppLayout (pas de sidebar). Ajouter une troisième entrée de router, AVANT le bloc AppLayout :

```typescript
// ── Onboarding (standalone, authentifié) ─────────────────────────
{
  path: '/onboarding',
  element: <OnboardingPage />,
},
```

Le fichier `src/App.tsx` final ressemble à :
```typescript
const router = createBrowserRouter([
  // Pages publiques
  {
    element: <PublicLayout />,
    children: [ /* ... */ ],
  },

  // Onboarding standalone
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },

  // Pages authentifiées avec layout
  {
    element: <AppLayout />,
    children: [ /* ... */ ],
  },
])
```

- [ ] **Step 3 : Vérifier le build**

```bash
npm run build
```

- [ ] **Step 4 : Commit**

```bash
git add src/components/onboarding/ src/app/(auth)/onboarding-page.tsx src/App.tsx
git commit -m "feat(onboarding): 7-question flow with Supabase persistence"
```

---

## Chunk 4 : AppLayout LIGHT + guard onboarding

### Task 7 : Mettre à jour `AppLayout`

**Files:**
- Modify: `src/components/layout/app-layout.tsx`

- [ ] **Step 1 : Réécrire le fichier**

```tsx
// src/components/layout/app-layout.tsx
import { useEffect } from 'react'
import { Outlet, useParams, useNavigate } from 'react-router'
import { AppSidebar } from './app-sidebar'
import { AppHeader } from './app-header'
import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/use-profile'

/**
 * Layout LIGHT — dashboard et pages authentifiées.
 * Fond #F8F9FC, sidebar blanche, header blanc.
 * Redirections :
 *   - non connecté → /login
 *   - onboarding non complété → /onboarding
 */
function AppLayout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useProfile()

  // Redirection : non connecté
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, authLoading, navigate])

  // Redirection : onboarding non complété
  useEffect(() => {
    if (!authLoading && !profileLoading && user) {
      // profile null = pas encore créé (edge case) → onboarding
      if (!profile || !profile.onboarding_completed) {
        navigate('/onboarding', { replace: true })
      }
    }
  }, [user, authLoading, profile, profileLoading, navigate])

  const loading = authLoading || (!!user && profileLoading)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC]">
        <div className="w-5 h-5 rounded-full border-2 border-[#3279F9] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex bg-[#F8F9FC]">
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

- [ ] **Step 2 : Vérifier le build**

```bash
npm run build
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/layout/app-layout.tsx
git commit -m "feat(layout): AppLayout LIGHT + onboarding guard"
```

---

## Chunk 5 : Sidebar + Header LIGHT

### Task 8 : `AppSidebar` en thème LIGHT

**Files:**
- Modify: `src/components/layout/app-sidebar.tsx`

- [ ] **Step 1 : Réécrire le fichier**

Remplacer TOUTES les couleurs dark par des équivalents light :
- `bg-[#121317]` → `bg-white`
- `border-[#212226]` → `border-[#E6EAF0]`
- `bg-[#18191D]` (active) → `bg-[#F0F1F5]`
- `text-white` → `text-[#121317]`
- `text-[#B2BBC5]` (nav inactive) → `text-[#45474D]`
- `hover:text-white hover:bg-[#18191D]/60` → `hover:text-[#121317] hover:bg-[#F0F1F5]`
- Phase dot empty `bg-[#212226]` → `bg-[#E6EAF0]`
- Nouveau projet btn : fond `#F8F9FC`, border `#E6EAF0`, hover border `#B2BBC5`

```tsx
// src/components/layout/app-sidebar.tsx
import { Link, useLocation } from 'react-router'
import { LayoutDashboard, Settings, Users, ChevronRight, FolderPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PHASE_NAMES } from '@/lib/utils'

interface AppSidebarProps {
  currentProjectId?: string
  currentPhase?: number
  completedPhases?: number[]
}

const PHASE_ICONS = ['💡', '🏗️', '🎨', '🔧', '⚙️', '🔨', '🚀', '📣']

function AppSidebar({ currentProjectId, currentPhase, completedPhases = [] }: AppSidebarProps) {
  const { pathname } = useLocation()

  const mainNav = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Mes projets' },
    { href: '/club', icon: Users, label: 'Buildrs Club' },
    { href: '/settings', icon: Settings, label: 'Paramètres' },
  ]

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-[#E6EAF0] flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-[#E6EAF0]">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#121317] flex items-center justify-center">
            <span className="text-white font-bold text-xs">B</span>
          </div>
          <span className="font-semibold text-[#121317] text-sm">Buildrs</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col p-3 gap-5 overflow-y-auto">
        {/* Navigation principale */}
        <nav className="flex flex-col gap-0.5">
          {mainNav.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm',
                'transition-all duration-150',
                pathname === href
                  ? 'bg-[#F0F1F5] text-[#121317]'
                  : 'text-[#45474D] hover:text-[#121317] hover:bg-[#F0F1F5]'
              )}
            >
              <Icon size={15} strokeWidth={1.5} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Phases du projet courant */}
        {currentProjectId && (
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#B2BBC5] px-3">
              Phases
            </p>
            <nav className="flex flex-col gap-0.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((phase) => {
                const isCompleted = completedPhases.includes(phase)
                const isCurrent = phase === currentPhase
                const isLocked = phase > (currentPhase ?? 1) && !isCompleted
                const href = `/project/${currentProjectId}/phase/${phase}`

                return (
                  <Link
                    key={phase}
                    to={isLocked ? '#' : href}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs',
                      'transition-all duration-150',
                      isCurrent && 'bg-[#F0F1F5] border border-[#3279F9]/30 text-[#121317]',
                      isCompleted && !isCurrent && 'text-[#45474D] hover:text-[#121317] hover:bg-[#F0F1F5]',
                      isLocked && 'opacity-30 cursor-not-allowed text-[#B2BBC5]',
                      !isCurrent && !isLocked && 'text-[#45474D] hover:text-[#121317] hover:bg-[#F0F1F5]'
                    )}
                  >
                    <span
                      className={cn(
                        'w-1 h-1 rounded-full flex-shrink-0',
                        isCompleted ? 'bg-[#3279F9]' : isCurrent ? 'bg-[#3279F9]' : 'bg-[#E6EAF0]'
                      )}
                    />
                    <span className="flex-1 truncate">
                      {PHASE_ICONS[phase - 1]} {PHASE_NAMES[phase]}
                    </span>
                    {isCurrent && <ChevronRight size={10} className="text-[#3279F9] flex-shrink-0" />}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Nouveau projet */}
      <div className="p-3 border-t border-[#E6EAF0]">
        <Link
          to="/project/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl
            bg-[#F8F9FC] border border-[#E6EAF0] text-[#45474D] text-xs font-medium
            hover:border-[#B2BBC5] hover:text-[#121317] transition-all duration-150"
        >
          <FolderPlus size={13} />
          Nouveau projet
        </Link>
      </div>
    </aside>
  )
}

export { AppSidebar }
```

### Task 9 : `AppHeader` en thème LIGHT

**Files:**
- Modify: `src/components/layout/app-header.tsx`

- [ ] **Step 1 : Réécrire le fichier**

```tsx
// src/components/layout/app-header.tsx
import { Link } from 'react-router'
import { Bell, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AppHeaderProps {
  title?: string
  className?: string
}

function AppHeader({ title, className }: AppHeaderProps) {
  return (
    <header
      className={cn(
        'h-14 flex items-center justify-between px-6',
        'border-b border-[#E6EAF0] bg-white flex-shrink-0',
        className
      )}
    >
      <div>
        {title && (
          <h1 className="text-sm font-medium text-[#121317]">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg
            text-[#B2BBC5] hover:text-[#45474D] hover:bg-[#F0F1F5]
            transition-all duration-150"
          aria-label="Notifications"
        >
          <Bell size={15} strokeWidth={1.5} />
        </button>

        <Link
          to="/settings"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full
            text-[#45474D] hover:text-[#121317] hover:bg-[#F0F1F5]
            transition-all duration-150"
        >
          <div className="w-5 h-5 rounded-full bg-[#EFF2F7] border border-[#E6EAF0]
            flex items-center justify-center">
            <span className="text-[#3279F9] text-[10px] font-bold">A</span>
          </div>
          <span className="text-xs hidden md:block">Mon compte</span>
          <ChevronDown size={11} />
        </Link>
      </div>
    </header>
  )
}

export { AppHeader }
```

- [ ] **Step 2 : Commit sidebar + header**

```bash
git add src/components/layout/app-sidebar.tsx src/components/layout/app-header.tsx
git commit -m "feat(layout): sidebar + header thème LIGHT"
```

---

## Chunk 6 : Dashboard LIGHT

### Task 10 : `ProgressPhases` — couleur empty LIGHT

**Files:**
- Modify: `src/components/ui/progress-phases.tsx`

- [ ] **Step 1 : Changer la couleur du segment vide**

Dans `src/components/ui/progress-phases.tsx`, remplacer :
```typescript
isLocked && 'bg-[#212226]'
```
par :
```typescript
isLocked && 'bg-[#E6EAF0]'
```

Et dans le label :
```typescript
<span className="text-[12.5px] text-[#B2BBC5]">
```
reste inchangé (convient au fond light).

### Task 11 : `DashboardPage` en thème LIGHT

**Files:**
- Modify: `src/app/(auth)/dashboard-page.tsx`

- [ ] **Step 1 : Réécrire le fichier**

```tsx
// src/app/(auth)/dashboard-page.tsx
import { Link } from 'react-router'
import { Plus, ArrowRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProgressPhases } from '@/components/ui/progress-phases'
import { ScoreBadge } from '@/components/ui/score-badge'
import { PHASE_NAMES } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

const DEMO_PROJECTS = [
  {
    id: '1',
    name: 'TaskFlow Pro',
    description: 'Outil de gestion de tâches pour freelances',
    current_phase: 3,
    completed_phases: [1, 2],
    score: 82,
    updated_at: 'Il y a 2 heures',
  },
  {
    id: '2',
    name: 'MediSync',
    description: 'Agenda intelligent pour para-médicaux',
    current_phase: 1,
    completed_phases: [],
    score: 71,
    updated_at: 'Hier',
  },
]

function DashboardPage() {
  const { user } = useAuth()
  // Prénom = partie avant le @ de l'email, capitalisée
  const firstName = user?.email
    ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1)
    : 'toi'

  return (
    <div className="max-w-[960px] mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-[#121317]"
            style={{ fontSize: '1.4rem', fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            Bonjour, {firstName} 👋
          </h1>
          <p className="text-sm text-[#45474D] mt-1">
            {DEMO_PROJECTS.length} projet{DEMO_PROJECTS.length > 1 ? 's' : ''} en cours
          </p>
        </div>
        <Link to="/project/new">
          <Button variant="primary" size="sm" className="gap-1.5">
            <Plus size={14} />
            Nouveau
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {DEMO_PROJECTS.map((project) => (
          <Link key={project.id} to={`/project/${project.id}`}>
            <Card variant="white" padding="lg" hover className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h2
                      className="text-[#121317] truncate"
                      style={{ fontSize: '0.95rem', fontWeight: 500, letterSpacing: '-0.01em' }}
                    >
                      {project.name}
                    </h2>
                    {project.score > 0 && <ScoreBadge score={project.score} size="sm" />}
                  </div>
                  <p className="text-sm text-[#45474D] truncate">{project.description}</p>
                </div>
                <ArrowRight size={15} className="text-[#B2BBC5] flex-shrink-0 mt-0.5" />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#B2BBC5]">
                    Phase {project.current_phase} — {PHASE_NAMES[project.current_phase]}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#B2BBC5]">
                    <Clock size={11} />
                    {project.updated_at}
                  </div>
                </div>
                <ProgressPhases
                  currentPhase={project.current_phase}
                  completedPhases={project.completed_phases}
                />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {DEMO_PROJECTS.length === 0 && (
        <Card variant="white" padding="lg" className="flex flex-col items-center gap-4 text-center py-16">
          <p className="text-4xl">💡</p>
          <div>
            <h2
              className="text-[#121317]"
              style={{ fontWeight: 500, letterSpacing: '-0.01em' }}
            >
              Aucun projet pour l'instant
            </h2>
            <p className="text-sm text-[#45474D] mt-1">
              Crée ton premier projet et commence le Lab.
            </p>
          </div>
          <Link to="/project/new">
            <Button variant="primary">Créer mon premier projet →</Button>
          </Link>
        </Card>
      )}
    </div>
  )
}

export { DashboardPage }
```

- [ ] **Step 2 : Vérifier le build complet**

```bash
npm run build
```

Résultat attendu : `✓ built in X.XXs` sans erreurs TypeScript.

- [ ] **Step 3 : Tester visuellement avec le dev server**

```bash
npm run dev
```

Checklist :
- [ ] `/onboarding` : fond blanc, logo Buildrs, progress bar bleue
- [ ] 7 questions s'enchaînent, "Suivant" désactivé tant qu'aucune option n'est sélectionnée
- [ ] Q1 : option "Autre…" affiche un input
- [ ] Welcome screen : prénom, profil, revenue, timeline
- [ ] "Commencer l'aventure" → upsert Supabase → redirect `/dashboard`
- [ ] `/dashboard` : fond clair, sidebar blanche, header blanc, "Bonjour, [prénom]"
- [ ] Rechargement de `/dashboard` sans onboarding complété → redirect `/onboarding`

- [ ] **Step 4 : Commit final**

```bash
git add src/components/ui/progress-phases.tsx src/app/(auth)/dashboard-page.tsx
git commit -m "feat(dashboard): thème LIGHT + greeting utilisateur"
```

---

## Récap des commits

1. `feat(db): create profiles table with onboarding fields`
2. `feat(hooks): add useProfile with Supabase profiles table`
3. `feat(onboarding): 7-question flow with Supabase persistence`
4. `feat(layout): AppLayout LIGHT + onboarding guard`
5. `feat(layout): sidebar + header thème LIGHT`
6. `feat(dashboard): thème LIGHT + greeting utilisateur`
