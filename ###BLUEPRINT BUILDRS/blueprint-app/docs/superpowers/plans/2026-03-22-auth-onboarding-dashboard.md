# Auth + Onboarding + Dashboard — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter l'authentification (email + Google + GitHub), l'onboarding 4 étapes et le dashboard produit complet à `blueprint-app/` en étendant le hash-router existant.

**Architecture:** Extension du hash-router existant dans `App.tsx`. Supabase Auth pour session/OAuth. Hooks React dédiés pour auth, progression et journal. Composants dashboard indépendants par route.

**Tech Stack:** React 19 + TypeScript + Vite + Tailwind v3 + Supabase Auth + Lucide React + Geist (déjà chargé via CDN)

---

## Workflow de build obligatoire

```bash
# JAMAIS npm run dev — le chemin ### casse Vite
cd "/Users/alfredorsini/CLAUDE/###BLUEPRINT BUILDRS/blueprint-app"
npx vite build && pkill -f "serve dist" 2>/dev/null; npx serve dist --listen 4000 &
open http://localhost:4000
```

---

## Fichiers à créer / modifier

```
src/
  lib/
    supabase.ts              NEW  — client Supabase singleton
  hooks/
    useAuth.ts               NEW  — session, signIn, signUp, signOut, OAuth
    useOnboarding.ts         NEW  — charger/sauvegarder user_profiles
    useProgress.ts           NEW  — lesson_progress + % global
    useJournal.ts            NEW  — CRUD journal_entries
  data/
    curriculum.ts            NEW  — structure modules/leçons/quiz (contenu statique)
  components/
    auth/
      SignupPage.tsx          NEW  — inscription email + Google + GitHub
      SigninPage.tsx          NEW  — connexion
    onboarding/
      OnboardingPage.tsx      NEW  — flow 4 étapes
    dashboard/
      DashboardLayout.tsx     NEW  — sidebar + header, wrapper protégé
      DashboardHome.tsx       NEW  — hub modules (page d'accueil dashboard)
      ModulePage.tsx          NEW  — sommaire leçons d'un module
      LessonPage.tsx          NEW  — lecture pleine page
      QuizPage.tsx            NEW  — quiz fin de module
      JournalPage.tsx         NEW  — journal de bord
      Sidebar.tsx             NEW  — sidebar fixe (logo, nav, next level)
      Header.tsx              NEW  — header 52px (titre actif + avatar)
  App.tsx                    MODIFY  — nouvelles routes + auth guard
  index.css                  MODIFY  — classes dark mode si manquantes
```

---

## Chunk 1 : Supabase + hooks

### Task 1 : Installer Supabase et créer le client

**Files:**
- Create: `src/lib/supabase.ts`
- Modify: `package.json` (via npm install)

- [ ] **Step 1 : Installer @supabase/supabase-js**

```bash
cd "/Users/alfredorsini/CLAUDE/###BLUEPRINT BUILDRS/blueprint-app"
npm install @supabase/supabase-js
```

Expected: package.json mis à jour, node_modules contient `@supabase/supabase-js`

- [ ] **Step 2 : Créer `.env.local`**

Créer `/Users/alfredorsini/CLAUDE/###BLUEPRINT BUILDRS/blueprint-app/.env.local` :

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

> ⚠️ Remplacer avec les vraies valeurs depuis Supabase Dashboard → Settings → API

- [ ] **Step 3 : Créer `src/lib/supabase.ts`**

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars. Check .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

- [ ] **Step 4 : Vérifier le build**

```bash
cd "/Users/alfredorsini/CLAUDE/###BLUEPRINT BUILDRS/blueprint-app"
npx vite build 2>&1 | tail -10
```

Expected: `dist/` généré sans erreur TypeScript

- [ ] **Step 5 : Commit**

```bash
git add src/lib/supabase.ts package.json package-lock.json
git commit -m "feat: add supabase client"
```

---

### Task 2 : Créer les tables Supabase

> Ces SQL sont à exécuter dans Supabase Dashboard → SQL Editor

- [ ] **Step 1 : Créer les 4 tables**

```sql
-- user_profiles : données onboarding
create table if not exists user_profiles (
  id uuid references auth.users on delete cascade primary key,
  strategie text check (strategie in ('problem','copy','discover')),
  objectif  text check (objectif in ('mrr','flip','client')),
  niveau    text check (niveau in ('beginner','tools','launched')),
  onboarding_completed boolean default false,
  created_at timestamptz default now()
);

-- lesson_progress
create table if not exists lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  module_id text not null,
  lesson_id text not null,
  completed boolean default false,
  completed_at timestamptz,
  unique(user_id, module_id, lesson_id)
);

-- quiz_results
create table if not exists quiz_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  module_id text not null,
  score integer not null,
  passed boolean not null,
  taken_at timestamptz default now()
);

-- journal_entries
create table if not exists journal_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  content text not null,
  module_tag text,
  created_at timestamptz default now()
);
```

- [ ] **Step 2 : Activer RLS sur toutes les tables**

```sql
alter table user_profiles enable row level security;
alter table lesson_progress enable row level security;
alter table quiz_results enable row level security;
alter table journal_entries enable row level security;

-- Policies : chaque user voit et modifie uniquement ses propres données
create policy "users own profile" on user_profiles
  for all using (auth.uid() = id);

create policy "users own progress" on lesson_progress
  for all using (auth.uid() = user_id);

create policy "users own quiz" on quiz_results
  for all using (auth.uid() = user_id);

create policy "users own journal" on journal_entries
  for all using (auth.uid() = user_id);
```

- [ ] **Step 3 : Configurer OAuth dans Supabase**

Dans Supabase Dashboard → Authentication → Providers :
- Activer **Google** : ajouter Client ID + Client Secret (depuis console.cloud.google.com)
- Activer **GitHub** : ajouter Client ID + Client Secret (depuis github.com/settings/developers)
- Callback URL à utiliser : `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

> Pour le dev local, ajouter aussi `http://localhost:4000` dans "Redirect URLs" (Supabase → Auth → URL Configuration)

---

### Task 3 : Hook `useAuth`

**Files:**
- Create: `src/hooks/useAuth.ts`

- [ ] **Step 1 : Créer `src/hooks/useAuth.ts`**

```typescript
import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
}

interface AuthActions {
  signUpEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signInEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signInGoogle: () => Promise<void>
  signInGitHub: () => Promise<void>
  signOut: () => Promise<void>
}

export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Écouter les changements d'état
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUpEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    return { error: error?.message ?? null }
  }

  const signInEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  const signInGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/#/dashboard` }
    })
  }

  const signInGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/#/dashboard` }
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.hash = '/'
  }

  return { user, session, loading, signUpEmail, signInEmail, signInGoogle, signInGitHub, signOut }
}
```

- [ ] **Step 2 : Build de vérification**

```bash
cd "/Users/alfredorsini/CLAUDE/###BLUEPRINT BUILDRS/blueprint-app"
npx vite build 2>&1 | grep -E 'error|warning|✓'
```

Expected: pas d'erreur TypeScript

- [ ] **Step 3 : Commit**

```bash
git add src/hooks/useAuth.ts
git commit -m "feat: useAuth hook — email + google + github"
```

---

### Task 4 : Hook `useOnboarding`

**Files:**
- Create: `src/hooks/useOnboarding.ts`

- [ ] **Step 1 : Créer `src/hooks/useOnboarding.ts`**

```typescript
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface OnboardingData {
  strategie: 'problem' | 'copy' | 'discover' | null
  objectif: 'mrr' | 'flip' | 'client' | null
  niveau: 'beginner' | 'tools' | 'launched' | null
  onboarding_completed: boolean
}

export function useOnboarding(userId: string | undefined) {
  const [data, setData] = useState<OnboardingData>({
    strategie: null, objectif: null, niveau: null, onboarding_completed: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    supabase
      .from('user_profiles')
      .select('strategie, objectif, niveau, onboarding_completed')
      .eq('id', userId)
      .single()
      .then(({ data: row }) => {
        if (row) setData(row as OnboardingData)
        setLoading(false)
      })
  }, [userId])

  const save = async (updates: Partial<OnboardingData>) => {
    if (!userId) return
    const merged = { ...data, ...updates }
    await supabase
      .from('user_profiles')
      .upsert({ id: userId, ...merged })
    setData(merged)
  }

  const complete = async () => {
    await save({ onboarding_completed: true })
  }

  return { data, loading, save, complete }
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/hooks/useOnboarding.ts
git commit -m "feat: useOnboarding hook"
```

---

### Task 5 : Hooks `useProgress` et `useJournal`

**Files:**
- Create: `src/hooks/useProgress.ts`
- Create: `src/hooks/useJournal.ts`
- Create: `src/data/curriculum.ts`

- [ ] **Step 1 : Créer `src/data/curriculum.ts`**

```typescript
export interface Lesson {
  id: string        // ex: "0.1"
  title: string
  duration: string  // ex: "3 min"
  body: string[]    // paragraphes
  prompts?: { label: string; content: string }[]
  checklist?: string[]
}

export interface Module {
  id: string        // ex: "00"
  title: string
  description: string
  icon: string      // nom icône Lucide
  lessons: Lesson[]
  quizQuestions?: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export const CURRICULUM: Module[] = [
  {
    id: '00',
    title: 'Fondations',
    description: 'Comprendre pourquoi tu es au bon endroit, au bon moment.',
    icon: 'Layers',
    lessons: [
      {
        id: '0.1',
        title: 'Bienvenue dans Buildrs Blueprint',
        duration: '3 min',
        body: [
          "Tu viens de prendre la meilleure décision de ta semaine. Dans les 72 prochaines heures, tu vas construire quelque chose de concret — un produit digital qui peut te rapporter tes premiers euros.",
          "Ce dashboard est ton système opérationnel. Chaque module = une étape. Chaque leçon = une action concrète à réaliser. Pas de théorie inutile, pas de blabla. On va droit au but."
        ],
        checklist: [
          "Lire ce module en entier",
          "Choisir ta stratégie de départ (Module 1)",
          "Rejoindre la communauté Buildrs"
        ]
      },
      {
        id: '0.2',
        title: 'Pourquoi les micro-SaaS en 2026',
        duration: '5 min',
        body: [
          "Un micro-SaaS = un petit logiciel en ligne que des gens paient chaque mois pour résoudre un problème précis. Pas besoin d'une équipe, pas besoin d'un bureau, pas besoin d'investisseurs.",
          "Ce qui change en 2026 : l'IA permet à une seule personne de construire ce qui nécessitait 5 développeurs il y a 3 ans. Tu es armé comme Tony Stark avec un ordinateur portable."
        ],
        prompts: [
          {
            label: 'Prompt Claude',
            content: '"Donne-moi 5 exemples de micro-SaaS B2B qui font entre 1 000 et 10 000€/mois de MRR, lancés par une seule personne, avec des outils IA. Pour chacun : le problème résolu, la cible, le prix mensuel, et pourquoi ça marche."'
          }
        ]
      },
      {
        id: '0.3',
        title: "C'est quoi le vibe coding ?",
        duration: '4 min',
        body: [
          "Le vibe coding, c'est une nouvelle façon de construire des produits : tu décris ce que tu veux en français (ou en anglais), et l'IA le construit pour toi.",
          "Tu n'as pas besoin de savoir programmer. Tu dois juste savoir diriger. Penser comme un chef de projet, pas comme un développeur."
        ]
      },
      {
        id: '0.4',
        title: "C'est quoi un product builder ?",
        duration: '3 min',
        body: [
          "Un product builder, c'est quelqu'un qui sait transformer une idée en produit fonctionnel — sans forcément coder lui-même.",
          "C'est la compétence la plus recherchée en 2026. Les entreprises tech cherchent des profils qui comprennent le produit ET les outils IA."
        ]
      },
      {
        id: '0.5',
        title: 'Glossaire',
        duration: '5 min',
        body: [
          "Voici les termes que tu vas croiser dans ce blueprint. Une définition simple, en une ligne."
        ]
      },
      {
        id: '0.6',
        title: 'Les 3 stratégies de départ',
        duration: '8 min',
        body: [
          "Stratégie A — Tu as un problème. Tu construis la solution. Stratégie B — Tu copies un SaaS qui marche et tu l'adaptes au marché français. Stratégie C — Tu utilises les outils du Module 1 pour découvrir les opportunités."
        ]
      },
      {
        id: '0.7',
        title: 'Les 3 modèles de monétisation',
        duration: '5 min',
        body: [
          "MRR : tu gardes le produit, tu le développes, tu construis une rente mensuelle. Flip : tu construis et tu revends sur Flippa ou Acquire.com. Commande client : tu construis pour des clients (2 000–10 000€/projet)."
        ]
      }
    ],
    quizQuestions: [
      {
        id: 'q00-1',
        question: "Qu'est-ce qu'un micro-SaaS ?",
        options: ["Un grand logiciel enterprise", "Un petit logiciel en ligne à abonnement mensuel", "Une application mobile gratuite", "Un site e-commerce"],
        correctIndex: 1,
        explanation: "Un micro-SaaS est un petit logiciel en ligne que des gens paient chaque mois pour résoudre un problème précis."
      },
      {
        id: 'q00-2',
        question: "Le vibe coding, c'est quoi ?",
        options: ["Coder en musique", "Construire un produit en décrivant ce qu'on veut à l'IA", "Un langage de programmation", "Un style de design"],
        correctIndex: 1,
        explanation: "Le vibe coding = tu décris, l'IA construit. Tu diriges, tu n'as pas besoin de savoir programmer."
      },
      {
        id: 'q00-3',
        question: "Quelle est la stratégie B ?",
        options: ["Créer une idée originale", "Copier un SaaS qui marche et l'adapter au marché français", "Trouver des clients et leur construire un outil", "Lancer une communauté payante"],
        correctIndex: 1,
        explanation: "Stratégie B = repérer un SaaS qui fonctionne (souvent US), copier le modèle économique, adapter au marché français."
      }
    ]
  },
  {
    id: '01',
    title: 'Trouver & Valider',
    description: "L'idée qui va devenir ton produit.",
    icon: 'Search',
    lessons: [
      {
        id: '1.1',
        title: 'Trouver ton idée',
        duration: '6 min',
        body: [
          "90% des gens qui veulent lancer un SaaS restent bloqués ici. Pas parce qu'il n'y a pas d'idées — mais parce qu'ils cherchent au mauvais endroit.",
          "La méthode Buildrs : cherche un problème récurrent que des gens paient déjà pour résoudre d'une manière moins bonne que ce que tu pourrais faire."
        ],
        prompts: [
          {
            label: 'Prompt Claude',
            content: '"Tu es un expert en micro-SaaS B2B. Génère 10 idées de micro-SaaS dans [ta niche] qui résolvent un problème réel, ont un potentiel MRR de 500-5000€/mois et sont constructibles en moins de 72h avec Lovable. Format : nom, problème, cible, prix mensuel, pourquoi ça marcherait."'
          }
        ],
        checklist: [
          "Copier le prompt dans Claude et remplacer [ta niche]",
          "Lire les 10 idées générées",
          "En sélectionner 3 qui t'intéressent"
        ]
      },
      {
        id: '1.2',
        title: 'Valider avant de construire',
        duration: '7 min',
        body: [
          "90% des MVP échouent parce qu'ils résolvent un problème imaginaire. Avant d'écrire une seule ligne de code, vérifie que ton idée vaut le coup.",
          "Les 3 questions clés : Des gens paient déjà pour ça ? Tu peux l'expliquer en une phrase ? C'est buildable en 72h ?"
        ],
        prompts: [
          {
            label: 'Prompt validation',
            content: '"Analyse cette idée de micro-SaaS : [ton idée]. Évalue : 1) la taille du marché, 2) la concurrence existante, 3) les risques principaux, 4) si c\'est buildable en 72h avec Lovable + Supabase. Sois direct et honnête."'
          }
        ]
      },
      {
        id: '1.3',
        title: 'Le brief produit',
        duration: '5 min',
        body: [
          "Avant de construire, écris ton brief produit. C'est le document de référence que tu donneras à Claude pour générer ton app."
        ],
        prompts: [
          {
            label: 'Prompt brief produit',
            content: '"Génère un brief produit complet pour ce micro-SaaS : [ton idée]. Inclus : nom du produit, problème résolu en 1 phrase, cible principale, feature core (une seule), fonctionnalités V1 (max 5), modèle de prix, et le prompt complet pour lancer le build sur Lovable."'
          }
        ]
      }
    ],
    quizQuestions: [
      {
        id: 'q01-1',
        question: "Pourquoi la plupart des MVP échouent ?",
        options: ["Mauvais design", "Ils résolvent un problème imaginaire", "Trop chers à construire", "Manque de marketing"],
        correctIndex: 1,
        explanation: "90% des MVP échouent parce qu'ils résolvent un problème que personne ne ressent vraiment — ou que personne ne paierait pour résoudre."
      }
    ]
  }
  // Modules 02-06 : structure identique, contenu à compléter
]

export const getTotalLessons = () =>
  CURRICULUM.reduce((acc, m) => acc + m.lessons.length, 0)

export const getModule = (id: string) =>
  CURRICULUM.find(m => m.id === id)

export const getLesson = (moduleId: string, lessonId: string) =>
  getModule(moduleId)?.lessons.find(l => l.id === lessonId)
```

- [ ] **Step 2 : Créer `src/hooks/useProgress.ts`**

```typescript
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getTotalLessons } from '../data/curriculum'

interface ProgressRow {
  module_id: string
  lesson_id: string
  completed: boolean
}

export function useProgress(userId: string | undefined) {
  const [progress, setProgress] = useState<ProgressRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!userId) { setLoading(false); return }
    const { data } = await supabase
      .from('lesson_progress')
      .select('module_id, lesson_id, completed')
      .eq('user_id', userId)
    setProgress(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { load() }, [load])

  const markComplete = async (moduleId: string, lessonId: string) => {
    if (!userId) return
    await supabase.from('lesson_progress').upsert({
      user_id: userId,
      module_id: moduleId,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString()
    })
    await load()
  }

  const isCompleted = (moduleId: string, lessonId: string) =>
    progress.some(p => p.module_id === moduleId && p.lesson_id === lessonId && p.completed)

  const moduleProgress = (moduleId: string, totalLessons: number) => {
    const done = progress.filter(p => p.module_id === moduleId && p.completed).length
    return totalLessons > 0 ? Math.round((done / totalLessons) * 100) : 0
  }

  const globalPercent = () => {
    const total = getTotalLessons()
    const done = progress.filter(p => p.completed).length
    return total > 0 ? Math.round((done / total) * 100) : 0
  }

  return { progress, loading, markComplete, isCompleted, moduleProgress, globalPercent }
}
```

- [ ] **Step 3 : Créer `src/hooks/useJournal.ts`**

```typescript
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface JournalEntry {
  id: string
  content: string
  module_tag: string | null
  created_at: string
}

export function useJournal(userId: string | undefined) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!userId) { setLoading(false); return }
    const { data } = await supabase
      .from('journal_entries')
      .select('id, content, module_tag, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setEntries(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { load() }, [load])

  const addEntry = async (content: string, moduleTag?: string) => {
    if (!userId || !content.trim()) return
    await supabase.from('journal_entries').insert({
      user_id: userId,
      content: content.trim(),
      module_tag: moduleTag ?? null
    })
    await load()
  }

  const deleteEntry = async (id: string) => {
    await supabase.from('journal_entries').delete().eq('id', id)
    await load()
  }

  return { entries, loading, addEntry, deleteEntry }
}
```

- [ ] **Step 4 : Build de vérification**

```bash
cd "/Users/alfredorsini/CLAUDE/###BLUEPRINT BUILDRS/blueprint-app"
npx vite build 2>&1 | grep -E 'error|✓'
```

- [ ] **Step 5 : Commit**

```bash
git add src/data/curriculum.ts src/hooks/useProgress.ts src/hooks/useJournal.ts
git commit -m "feat: curriculum data + progress + journal hooks"
```

---

## Chunk 2 : Auth Pages

### Task 6 : SignupPage

**Files:**
- Create: `src/components/auth/SignupPage.tsx`

- [ ] **Step 1 : Créer `src/components/auth/SignupPage.tsx`**

```tsx
import { useState } from 'react'
import { Github } from 'lucide-react'
import { BuildrsIcon } from '../ui/icons'
import { useAuth } from '../../hooks/useAuth'

// SVG Google icon inline
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

interface Props {
  onSwitchToSignin: () => void
  onSuccess: () => void
}

export function SignupPage({ onSwitchToSignin, onSuccess }: Props) {
  const { signUpEmail, signInGoogle, signInGitHub } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return }
    if (password.length < 8) { setError("Minimum 8 caractères."); return }
    setLoading(true)
    const { error } = await signUpEmail(email, password)
    setLoading(false)
    if (error) { setError(error); return }
    onSuccess()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <BuildrsIcon color="hsl(var(--foreground))" size={24} />
          <span className="font-extrabold text-lg tracking-tight text-foreground" style={{ letterSpacing: '-0.04em' }}>Buildrs</span>
        </div>

        <h1 className="text-3xl font-extrabold text-foreground text-center mb-1" style={{ letterSpacing: '-0.03em' }}>
          Crée ton accès Blueprint
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-8">
          Tu as accès à vie. 2 minutes pour configurer.
        </p>

        {/* OAuth buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={signInGoogle}
            className="flex items-center justify-center gap-3 w-full border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <GoogleIcon />
            Continuer avec Google
          </button>
          <button
            onClick={signInGitHub}
            className="flex items-center justify-center gap-3 w-full border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <Github size={18} strokeWidth={1.5} />
            Continuer avec GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Email</label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="toi@exemple.com"
              className="w-full border border-border rounded-lg px-4 py-2.5 bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Mot de passe</label>
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Minimum 8 caractères"
              className="w-full border border-border rounded-lg px-4 py-2.5 bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Confirmer le mot de passe</label>
            <input
              type="password" required value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="Répète ton mot de passe"
              className="w-full border border-border rounded-lg px-4 py-2.5 bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit" disabled={loading}
            className="cta-rainbow relative bg-foreground text-background rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-50 mt-1"
          >
            {loading ? 'Création...' : 'Créer mon compte →'}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Déjà un compte ?{' '}
          <button onClick={onSwitchToSignin} className="text-foreground font-medium underline underline-offset-2">
            Se connecter
          </button>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2 : Créer `src/components/auth/SigninPage.tsx`**

```tsx
import { useState } from 'react'
import { Github } from 'lucide-react'
import { BuildrsIcon } from '../ui/icons'
import { useAuth } from '../../hooks/useAuth'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

interface Props {
  onSwitchToSignup: () => void
  onSuccess: () => void
}

export function SigninPage({ onSwitchToSignup, onSuccess }: Props) {
  const { signInEmail, signInGoogle, signInGitHub } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signInEmail(email, password)
    setLoading(false)
    if (error) { setError(error); return }
    onSuccess()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <BuildrsIcon color="hsl(var(--foreground))" size={24} />
          <span className="font-extrabold text-lg tracking-tight text-foreground" style={{ letterSpacing: '-0.04em' }}>Buildrs</span>
        </div>

        <h1 className="text-3xl font-extrabold text-foreground text-center mb-1" style={{ letterSpacing: '-0.03em' }}>
          Content de te revoir
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-8">
          Connecte-toi pour accéder à ton Blueprint.
        </p>

        <div className="flex flex-col gap-3 mb-6">
          <button onClick={signInGoogle} className="flex items-center justify-center gap-3 w-full border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            <GoogleIcon />Continuer avec Google
          </button>
          <button onClick={signInGitHub} className="flex items-center justify-center gap-3 w-full border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            <Github size={18} strokeWidth={1.5} />Continuer avec GitHub
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="toi@exemple.com"
              className="w-full border border-border rounded-lg px-4 py-2.5 bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Mot de passe</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Ton mot de passe"
              className="w-full border border-border rounded-lg px-4 py-2.5 bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20" />
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

          <button type="submit" disabled={loading}
            className="bg-foreground text-background rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-50 mt-1 hover:opacity-90 transition-opacity">
            {loading ? 'Connexion...' : 'Se connecter →'}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Pas encore de compte ?{' '}
          <button onClick={onSwitchToSignup} className="text-foreground font-medium underline underline-offset-2">Créer mon accès</button>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 3 : Build de vérification**

```bash
cd "/Users/alfredorsini/CLAUDE/###BLUEPRINT BUILDRS/blueprint-app"
npx vite build 2>&1 | grep -E 'error|✓'
```

- [ ] **Step 4 : Commit**

```bash
git add src/components/auth/
git commit -m "feat: SignupPage + SigninPage (email + Google + GitHub)"
```

---

## Chunk 3 : Onboarding

### Task 7 : OnboardingPage

**Files:**
- Create: `src/components/onboarding/OnboardingPage.tsx`

- [ ] **Step 1 : Créer `src/components/onboarding/OnboardingPage.tsx`**

```tsx
import { useState } from 'react'
import { useOnboarding, OnboardingData } from '../../hooks/useOnboarding'

const STEPS = [
  {
    id: 1,
    title: 'Tu viens de faire le premier pas.',
    subtitle: 'Voici ce qui t\'attend dans les 72 prochaines heures.',
    type: 'welcome' as const
  },
  {
    id: 2,
    title: 'Ta stratégie de départ',
    subtitle: 'Comment veux-tu trouver ton idée ?',
    type: 'choice' as const,
    field: 'strategie' as keyof OnboardingData,
    options: [
      { value: 'problem', label: "J'ai un problème à résoudre", desc: 'Je crée ma propre solution à partir d\'un problème que je connais' },
      { value: 'copy', label: 'Je veux copier un SaaS qui marche', desc: 'J\'adapte un SaaS existant au marché français' },
      { value: 'discover', label: 'Je n\'ai aucune idée', desc: 'Je veux découvrir les opportunités avec les outils du Module 1' }
    ]
  },
  {
    id: 3,
    title: 'Ton objectif de monétisation',
    subtitle: 'Que veux-tu faire avec ton produit ?',
    type: 'choice' as const,
    field: 'objectif' as keyof OnboardingData,
    options: [
      { value: 'mrr', label: 'MRR — Revenus récurrents', desc: 'Je garde le produit et construis une rente mensuelle' },
      { value: 'flip', label: 'Flip — Construire et revendre', desc: 'Je construis rapidement et je revends sur Flippa / Acquire.com' },
      { value: 'client', label: 'Commande client', desc: 'Je construis des apps pour des clients (2 000–10 000€/projet)' }
    ]
  },
  {
    id: 4,
    title: 'Ton niveau actuel',
    subtitle: 'Pour qu\'on adapte tes recommandations.',
    type: 'choice' as const,
    field: 'niveau' as keyof OnboardingData,
    options: [
      { value: 'beginner', label: 'Complet débutant', desc: 'Je n\'ai jamais utilisé d\'outils IA pour construire quoi que ce soit' },
      { value: 'tools', label: 'J\'ai déjà touché à des outils IA', desc: 'ChatGPT, Midjourney, ou des outils no-code' },
      { value: 'launched', label: 'J\'ai déjà lancé un projet', desc: 'J\'ai déjà sorti quelque chose, même si ça n\'a pas marché' }
    ]
  }
]

interface Props {
  userId: string
  onComplete: () => void
}

export function OnboardingPage({ userId, onComplete }: Props) {
  const { save, complete } = useOnboarding(userId)
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState<Partial<OnboardingData>>({})
  const [loading, setLoading] = useState(false)

  const currentStep = STEPS[step]

  const handleSelect = (field: keyof OnboardingData, value: string) => {
    setSelections(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      setLoading(true)
      await save(selections)
      await complete()
      setLoading(false)
      onComplete()
    }
  }

  const canProceed = () => {
    if (currentStep.type === 'welcome') return true
    const field = currentStep.field!
    return !!selections[field]
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      {/* Step indicator */}
      <div className="flex gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s.id} className={`h-1.5 rounded-full transition-all duration-300 ${
            i <= step ? 'bg-foreground' : 'bg-border'
          } ${i === step ? 'w-8' : 'w-4'}`} />
        ))}
      </div>

      <div className="w-full max-w-lg">
        {/* Welcome screen */}
        {currentStep.type === 'welcome' && (
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-foreground mb-4" style={{ letterSpacing: '-0.03em' }}>
              Tu viens de faire<br />le premier pas.
            </h1>
            <p className="text-muted-foreground mb-8">
              Voici ce qui t'attend dans les 72 prochaines heures.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { n: '6', label: 'modules' },
                { n: '30+', label: 'leçons' },
                { n: '72h', label: 'pour lancer' }
              ].map(item => (
                <div key={item.n} className="border border-border rounded-xl p-4 text-center">
                  <div className="text-2xl font-extrabold text-foreground mb-1" style={{ letterSpacing: '-0.03em' }}>{item.n}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Choice screen */}
        {currentStep.type === 'choice' && (
          <div>
            <h1 className="text-3xl font-extrabold text-foreground mb-2 text-center" style={{ letterSpacing: '-0.03em' }}>
              {currentStep.title}
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-8">{currentStep.subtitle}</p>
            <div className="flex flex-col gap-3">
              {currentStep.options!.map(opt => {
                const selected = selections[currentStep.field!] === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(currentStep.field!, opt.value)}
                    className={`text-left w-full rounded-xl border-2 px-5 py-4 transition-all duration-150 ${
                      selected
                        ? 'bg-foreground border-foreground text-background'
                        : 'bg-background border-border text-foreground hover:border-foreground/30'
                    }`}
                  >
                    <div className="font-semibold text-sm mb-0.5">{opt.label}</div>
                    <div className={`text-xs ${selected ? 'opacity-70' : 'text-muted-foreground'}`}>{opt.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleNext}
          disabled={!canProceed() || loading}
          className="mt-8 w-full bg-foreground text-background rounded-xl py-3 text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          {loading ? 'Sauvegarde...' : step === STEPS.length - 1 ? 'Accéder à mon Blueprint →' : 'Continuer →'}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/components/onboarding/
git commit -m "feat: OnboardingPage 4 étapes"
```

---

## Chunk 4 : Dashboard Shell

### Task 8 : Sidebar + Header

**Files:**
- Create: `src/components/dashboard/Sidebar.tsx`
- Create: `src/components/dashboard/Header.tsx`

- [ ] **Step 1 : Créer `src/components/dashboard/Sidebar.tsx`**

```tsx
import { BookOpen, CheckSquare, BookMarked, Lightbulb, Layers, Search, Palette, Building2, Hammer, Rocket, DollarSign } from 'lucide-react'
import { BuildrsIcon } from '../ui/icons'
import { CURRICULUM } from '../../data/curriculum'

const MODULE_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  '00': Layers, '01': Search, '02': Palette, '03': Building2, '04': Hammer, '05': Rocket, '06': DollarSign
}

interface Props {
  currentPath: string
  navigate: (hash: string) => void
  globalPercent: number
  moduleProgress: (id: string, total: number) => number
  journalCount: number
  isDark: boolean
  onToggleDark: () => void
}

export function Sidebar({ currentPath, navigate, globalPercent, moduleProgress, journalCount, isDark, onToggleDark }: Props) {
  return (
    <div className="w-[236px] border-r border-border bg-secondary/30 flex flex-col flex-shrink-0 overflow-y-auto">

      {/* Logo + dark toggle */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        <button onClick={() => navigate('#/dashboard')} className="flex items-center gap-2">
          <BuildrsIcon color={isDark ? '#fafafa' : '#09090b'} size={20} />
          <span className="font-extrabold text-sm text-foreground" style={{ letterSpacing: '-0.04em' }}>Buildrs</span>
        </button>
        <button
          onClick={onToggleDark}
          className="w-8 h-4.5 rounded-full relative transition-colors"
          style={{ background: isDark ? '#09090b' : '#e4e4e7', width: 32, height: 18 }}
          title="Toggle dark mode"
        >
          <div className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-foreground transition-all duration-200 ${isDark ? 'left-[16px]' : 'left-[2px]'}`} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Progression</span>
          <span className="text-xs font-extrabold text-foreground" style={{ letterSpacing: '-0.02em' }}>{globalPercent}%</span>
        </div>
        <div className="h-1.5 bg-border rounded-full">
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${globalPercent}%`, background: 'linear-gradient(90deg, #4d96ff, #cc5de8)' }}
          />
        </div>
      </div>

      {/* PARCOURS */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-2">Parcours</p>
        <div className="flex flex-col gap-0.5">
          {CURRICULUM.map(mod => {
            const Icon = MODULE_ICONS[mod.id] ?? Layers
            const active = currentPath.startsWith(`#/dashboard/module/${mod.id}`)
            const pct = moduleProgress(mod.id, mod.lessons.length)
            const done = pct === 100
            const inProgress = pct > 0 && pct < 100
            return (
              <button
                key={mod.id}
                onClick={() => navigate(`#/dashboard/module/${mod.id}`)}
                className={`flex items-center gap-2.5 w-full text-left px-2.5 py-2 rounded-lg transition-colors ${
                  active ? 'bg-foreground text-background' : 'hover:bg-secondary text-foreground'
                } ${!done && !inProgress && mod.id !== '00' ? 'opacity-40' : ''}`}
              >
                <Icon size={14} strokeWidth={1.5} />
                <span className="text-[11px] font-medium flex-1 truncate">
                  <span className={`font-bold mr-1.5 ${active ? 'opacity-50' : 'text-muted-foreground'}`}>{mod.id}</span>
                  {mod.title}
                </span>
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  done ? 'bg-[#22c55e]' : inProgress ? 'bg-[#eab308]' : 'bg-border'
                }`} />
              </button>
            )
          })}
        </div>
      </div>

      {/* OUTILS */}
      <div className="px-4 pt-3 pb-2 mt-1">
        <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-2">Outils</p>
        <div className="flex flex-col gap-0.5">
          {[
            { icon: Lightbulb, label: 'Mes Idées', hash: '#/dashboard/ideas' },
            { icon: BookOpen, label: 'Bibliothèque', hash: '#/dashboard/library' },
            { icon: CheckSquare, label: 'Checklist', hash: '#/dashboard/checklist' },
            { icon: BookMarked, label: 'Journal de bord', hash: '#/dashboard/journal', badge: journalCount }
          ].map(({ icon: Icon, label, hash, badge }) => (
            <button
              key={hash}
              onClick={() => navigate(hash)}
              className={`flex items-center gap-2.5 w-full text-left px-2.5 py-2 rounded-lg transition-colors ${
                currentPath === hash ? 'bg-foreground text-background' : 'hover:bg-secondary text-foreground'
              }`}
            >
              <Icon size={14} strokeWidth={1.5} />
              <span className="text-[11px] font-medium flex-1">{label}</span>
              {badge !== undefined && badge > 0 && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#4d96ff] text-white">{badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Next Level */}
      <div className="mt-auto p-4">
        <div className="bg-foreground rounded-xl p-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.07em] text-background opacity-50 mb-1">Next Level</p>
          <p className="text-[11px] font-semibold text-background mb-1">Débloquer les Super Pouvoirs →</p>
          <p className="text-[10px] text-background opacity-50">Templates · Lab · Cohorte</p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2 : Créer `src/components/dashboard/Header.tsx`**

```tsx
interface Props {
  title: string
  userEmail: string | undefined
}

export function Header({ title, userEmail }: Props) {
  const initial = userEmail?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="h-[52px] border-b border-border flex items-center justify-between px-5 flex-shrink-0">
      <span className="text-sm font-semibold text-foreground">{title}</span>
      <div className="flex items-center gap-2.5">
        <span className="text-xs text-muted-foreground">{userEmail?.split('@')[0]}</span>
        <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center">
          <span className="text-[11px] font-bold text-background">{initial}</span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/dashboard/Sidebar.tsx src/components/dashboard/Header.tsx
git commit -m "feat: dashboard Sidebar + Header"
```

---

### Task 9 : DashboardLayout + DashboardHome

**Files:**
- Create: `src/components/dashboard/DashboardLayout.tsx`
- Create: `src/components/dashboard/DashboardHome.tsx`

- [ ] **Step 1 : Créer `src/components/dashboard/DashboardLayout.tsx`**

```tsx
import { ReactNode, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useProgress } from '../../hooks/useProgress'
import { useJournal } from '../../hooks/useJournal'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface Props {
  children: ReactNode
  currentPath: string
  title: string
  navigate: (hash: string) => void
  isDark: boolean
  onToggleDark: () => void
}

export function DashboardLayout({ children, currentPath, title, navigate, isDark, onToggleDark }: Props) {
  const { user, loading } = useAuth()
  const { globalPercent, moduleProgress } = useProgress(user?.id)
  const { entries } = useJournal(user?.id)

  useEffect(() => {
    if (!loading && !user) {
      navigate('#/signin')
    }
  }, [user, loading, navigate])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        currentPath={currentPath}
        navigate={navigate}
        globalPercent={globalPercent()}
        moduleProgress={moduleProgress}
        journalCount={entries.length}
        isDark={isDark}
        onToggleDark={onToggleDark}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} userEmail={user.email} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 2 : Créer `src/components/dashboard/DashboardHome.tsx`**

```tsx
import { Layers, Search, Palette, Building2, Hammer, Rocket, DollarSign, Lock } from 'lucide-react'
import { CURRICULUM } from '../../data/curriculum'

const MODULE_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  '00': Layers, '01': Search, '02': Palette, '03': Building2, '04': Hammer, '05': Rocket, '06': DollarSign
}

interface Props {
  navigate: (hash: string) => void
  moduleProgress: (id: string, total: number) => number
}

export function DashboardHome({ navigate, moduleProgress }: Props) {
  return (
    <div className="p-7">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Ton parcours</p>
        <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>Blueprint Buildrs</h1>
        <p className="text-sm text-muted-foreground mt-1">6 modules · 72h pour lancer ton premier produit monétisé</p>
      </div>

      <div className="flex flex-col gap-3">
        {CURRICULUM.map((mod, i) => {
          const Icon = MODULE_ICONS[mod.id] ?? Layers
          const pct = moduleProgress(mod.id, mod.lessons.length)
          const done = pct === 100
          const inProgress = pct > 0 && pct < 100
          const locked = i > 1 && pct === 0 && moduleProgress(CURRICULUM[i-1].id, CURRICULUM[i-1].lessons.length) < 80

          return (
            <button
              key={mod.id}
              onClick={() => !locked && navigate(`#/dashboard/module/${mod.id}`)}
              className={`group flex items-center gap-4 w-full text-left border rounded-xl px-5 py-4 transition-all duration-150 ${
                locked
                  ? 'border-border opacity-40 cursor-not-allowed'
                  : done
                    ? 'border-[#22c55e]/30 bg-[#22c55e]/5 hover:border-[#22c55e]/50'
                    : inProgress
                      ? 'border-foreground/30 bg-secondary hover:border-foreground'
                      : 'border-border hover:border-foreground/30'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                done ? 'bg-[#22c55e] text-white' : 'bg-secondary text-foreground'
              }`}>
                {locked ? <Lock size={16} strokeWidth={1.5} /> : <Icon size={16} strokeWidth={1.5} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold text-muted-foreground">Module {mod.id}</span>
                  {done && <span className="text-[10px] font-semibold text-[#22c55e] bg-[#22c55e]/10 px-1.5 py-0.5 rounded-full">Terminé</span>}
                  {inProgress && <span className="text-[10px] font-semibold text-[#eab308] bg-[#eab308]/10 px-1.5 py-0.5 rounded-full">En cours</span>}
                </div>
                <p className="text-sm font-bold text-foreground">{mod.title}</p>
                <p className="text-xs text-muted-foreground truncate">{mod.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold text-foreground">{mod.lessons.length} leçons</p>
                {pct > 0 && <p className="text-[10px] text-muted-foreground">{pct}%</p>}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/dashboard/DashboardLayout.tsx src/components/dashboard/DashboardHome.tsx
git commit -m "feat: DashboardLayout + DashboardHome"
```

---

## Chunk 5 : Module + Lesson Pages

### Task 10 : ModulePage + LessonPage

**Files:**
- Create: `src/components/dashboard/ModulePage.tsx`
- Create: `src/components/dashboard/LessonPage.tsx`

- [ ] **Step 1 : Créer `src/components/dashboard/ModulePage.tsx`**

```tsx
import { ChevronRight, Check, HelpCircle, Lock } from 'lucide-react'
import { getModule } from '../../data/curriculum'

interface Props {
  moduleId: string
  navigate: (hash: string) => void
  isCompleted: (moduleId: string, lessonId: string) => boolean
}

export function ModulePage({ moduleId, navigate, isCompleted }: Props) {
  const mod = getModule(moduleId)
  if (!mod) return <div className="p-7 text-muted-foreground">Module introuvable.</div>

  const completedCount = mod.lessons.filter(l => isCompleted(moduleId, l.id)).length
  const pct = Math.round((completedCount / mod.lessons.length) * 100)

  return (
    <div className="p-7 max-w-2xl">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Module {moduleId} · {mod.lessons.length} leçons</p>
        <h1 className="text-3xl font-extrabold text-foreground mb-2" style={{ letterSpacing: '-0.03em' }}>{mod.title}</h1>
        <p className="text-sm text-muted-foreground mb-4">{mod.description}</p>
        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-border rounded-full">
            <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #4d96ff, #22c55e)' }} />
          </div>
          <span className="text-xs font-bold text-muted-foreground">{completedCount}/{mod.lessons.length}</span>
        </div>
      </div>

      {/* Lesson list */}
      <div className="flex flex-col gap-2">
        {mod.lessons.map((lesson, i) => {
          const done = isCompleted(moduleId, lesson.id)
          const prevDone = i === 0 || isCompleted(moduleId, mod.lessons[i - 1].id)
          const locked = !prevDone && !done

          return (
            <button
              key={lesson.id}
              onClick={() => !locked && navigate(`#/dashboard/module/${moduleId}/lesson/${lesson.id}`)}
              className={`group flex items-center gap-3 w-full text-left rounded-xl border px-4 py-3.5 transition-all duration-150 ${
                done
                  ? 'bg-foreground border-foreground text-background'
                  : locked
                    ? 'border-border opacity-40 cursor-not-allowed'
                    : 'bg-background border-border hover:border-foreground/40'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px] flex-shrink-0 ${
                done ? 'bg-white/20 text-background' : 'bg-secondary text-foreground'
              }`}>
                {lesson.id}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${done ? 'text-background' : 'text-foreground'}`}>{lesson.title}</p>
                <p className={`text-xs ${done ? 'text-background/60' : 'text-muted-foreground'}`}>{lesson.duration}</p>
              </div>
              {done
                ? <span className="text-[10px] font-semibold text-[#22c55e] bg-[#22c55e]/20 px-2 py-0.5 rounded-full flex items-center gap-1"><Check size={10} strokeWidth={3} />Fait</span>
                : locked
                  ? <Lock size={14} strokeWidth={1.5} className="text-muted-foreground" />
                  : <ChevronRight size={14} strokeWidth={1.5} className="text-muted-foreground" />
              }
            </button>
          )
        })}

        {/* Quiz */}
        {mod.quizQuestions && mod.quizQuestions.length > 0 && (
          <button
            onClick={() => navigate(`#/dashboard/quiz/${moduleId}`)}
            className="flex items-center gap-3 w-full text-left rounded-xl border-2 border-dashed border-[#cc5de8]/40 px-4 py-3.5 hover:border-[#cc5de8]/70 transition-colors mt-1"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#cc5de8]/10 flex-shrink-0">
              <HelpCircle size={16} strokeWidth={1.5} className="text-[#cc5de8]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Quiz de fin de module</p>
              <p className="text-xs text-muted-foreground">{mod.quizQuestions.length} questions · Valider le module</p>
            </div>
            <ChevronRight size={14} strokeWidth={1.5} className="text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2 : Créer `src/components/dashboard/LessonPage.tsx`**

```tsx
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Check, Copy } from 'lucide-react'
import { getLesson, getModule } from '../../data/curriculum'

interface Props {
  moduleId: string
  lessonId: string
  navigate: (hash: string) => void
  isCompleted: (moduleId: string, lessonId: string) => boolean
  markComplete: (moduleId: string, lessonId: string) => Promise<void>
}

export function LessonPage({ moduleId, lessonId, navigate, isCompleted, markComplete }: Props) {
  const lesson = getLesson(moduleId, lessonId)
  const mod = getModule(moduleId)
  const [copied, setCopied] = useState<string | null>(null)
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())
  const [completing, setCompleting] = useState(false)

  if (!lesson || !mod) return <div className="p-7 text-muted-foreground">Leçon introuvable.</div>

  const done = isCompleted(moduleId, lessonId)
  const lessonIndex = mod.lessons.findIndex(l => l.id === lessonId)
  const prevLesson = mod.lessons[lessonIndex - 1]
  const nextLesson = mod.lessons[lessonIndex + 1]

  const copyPrompt = async (content: string, idx: number) => {
    await navigator.clipboard.writeText(content)
    setCopied(`${idx}`)
    setTimeout(() => setCopied(null), 2000)
  }

  const toggleCheck = (i: number) => {
    setCheckedItems(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const handleComplete = async () => {
    setCompleting(true)
    await markComplete(moduleId, lessonId)
    setCompleting(false)
    if (nextLesson) {
      navigate(`#/dashboard/module/${moduleId}/lesson/${nextLesson.id}`)
    } else {
      navigate(`#/dashboard/module/${moduleId}`)
    }
  }

  return (
    <div className="flex h-full">
      {/* Icon-only mini sidebar */}
      <div className="w-14 border-r border-border flex flex-col items-center pt-5 gap-3 flex-shrink-0">
        {mod.lessons.map((l, i) => {
          const lDone = isCompleted(moduleId, l.id)
          const lCurrent = l.id === lessonId
          return (
            <button
              key={l.id}
              onClick={() => navigate(`#/dashboard/module/${moduleId}/lesson/${l.id}`)}
              title={l.title}
              className={`w-2 h-2 rounded-full transition-all ${
                lCurrent ? 'w-3 h-3 bg-foreground' : lDone ? 'bg-[#22c55e]' : 'bg-border hover:bg-muted-foreground'
              }`}
            />
          )
        })}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-8 py-7 max-w-2xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-xs text-muted-foreground">
          <button onClick={() => navigate(`#/dashboard/module/${moduleId}`)} className="hover:text-foreground transition-colors">
            Module {moduleId}
          </button>
          <ChevronRight size={12} strokeWidth={2} />
          <span className="text-foreground font-medium">{lesson.title}</span>
          <span className="ml-auto">{lesson.duration} · Leçon {lessonIndex + 1} sur {mod.lessons.length}</span>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-border rounded-full mb-6">
          <div
            className="h-0.5 rounded-full transition-all"
            style={{
              width: `${((lessonIndex + (done ? 1 : 0)) / mod.lessons.length) * 100}%`,
              background: 'linear-gradient(90deg, #4d96ff, #22c55e)'
            }}
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-extrabold text-foreground mb-5" style={{ letterSpacing: '-0.03em' }}>
          {lesson.title}
        </h1>

        {/* Body */}
        {lesson.body.map((para, i) => (
          <p key={i} className="text-sm text-[#3f3f46] leading-relaxed mb-4">{para}</p>
        ))}

        {/* Prompts */}
        {lesson.prompts?.map((prompt, i) => (
          <div key={i} className="bg-foreground rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground" style={{ color: '#71717a' }}>
                {prompt.label}
              </span>
              <button
                onClick={() => copyPrompt(prompt.content, i)}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-[#4d96ff] hover:text-blue-400 transition-colors"
              >
                {copied === `${i}` ? <Check size={11} strokeWidth={2.5} /> : <Copy size={11} strokeWidth={2.5} />}
                {copied === `${i}` ? 'Copié !' : 'Copier'}
              </button>
            </div>
            <p className="font-mono text-[11px] text-[#e4e4e7] leading-relaxed">{prompt.content}</p>
          </div>
        ))}

        {/* Checklist */}
        {lesson.checklist && lesson.checklist.length > 0 && (
          <div className="bg-secondary rounded-xl p-4 mb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">À faire</p>
            <div className="flex flex-col gap-2.5">
              {lesson.checklist.map((item, i) => {
                const checked = checkedItems.has(i)
                return (
                  <button key={i} onClick={() => toggleCheck(i)} className="flex items-center gap-3 text-left w-full">
                    <div className={`w-4 h-4 rounded-[4px] flex items-center justify-center flex-shrink-0 transition-colors ${
                      checked ? 'bg-[#22c55e]' : 'border-2 border-border bg-background'
                    }`}>
                      {checked && <Check size={9} strokeWidth={3} className="text-white" />}
                    </div>
                    <span className={`text-xs transition-all ${checked ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {item}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-2">
          {prevLesson ? (
            <button
              onClick={() => navigate(`#/dashboard/module/${moduleId}/lesson/${prevLesson.id}`)}
              className="flex items-center gap-1.5 border border-border rounded-xl px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
            >
              <ChevronLeft size={14} strokeWidth={1.5} /> Précédent
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={done ? () => nextLesson && navigate(`#/dashboard/module/${moduleId}/lesson/${nextLesson.id}`) : handleComplete}
            disabled={completing}
            className="flex-1 bg-foreground text-background rounded-xl py-2.5 text-xs font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {completing ? 'Sauvegarde...' : done ? 'Suivant →' : 'Marquer terminé & continuer →'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/dashboard/ModulePage.tsx src/components/dashboard/LessonPage.tsx
git commit -m "feat: ModulePage + LessonPage"
```

---

## Chunk 6 : Quiz + Journal + App Router

### Task 11 : QuizPage

**Files:**
- Create: `src/components/dashboard/QuizPage.tsx`

- [ ] **Step 1 : Créer `src/components/dashboard/QuizPage.tsx`**

```tsx
import { useState } from 'react'
import { Check, X, ChevronRight } from 'lucide-react'
import { getModule } from '../../data/curriculum'
import { supabase } from '../../lib/supabase'

interface Props {
  moduleId: string
  userId: string
  navigate: (hash: string) => void
}

export function QuizPage({ moduleId, userId, navigate }: Props) {
  const mod = getModule(moduleId)
  const questions = mod?.quizQuestions ?? []
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [showResult, setShowResult] = useState(false)
  const [saving, setSaving] = useState(false)

  if (!mod || questions.length === 0) {
    return (
      <div className="p-7 text-center">
        <p className="text-muted-foreground">Pas de quiz pour ce module.</p>
        <button onClick={() => navigate(`#/dashboard/module/${moduleId}`)} className="mt-4 text-sm font-medium underline">Retour</button>
      </div>
    )
  }

  const q = questions[current]
  const allAnswers = [...answers, ...(selected !== null ? [selected === q.correctIndex] : [])]
  const score = Math.round((allAnswers.filter(Boolean).length / questions.length) * 100)
  const passed = score >= 80

  const handleSelect = (i: number) => {
    if (selected !== null) return
    setSelected(i)
  }

  const handleNext = async () => {
    const newAnswers = [...answers, selected === q.correctIndex]
    setAnswers(newAnswers)

    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
    } else {
      // Save result
      setSaving(true)
      const finalScore = Math.round((newAnswers.filter(Boolean).length / questions.length) * 100)
      await supabase.from('quiz_results').insert({
        user_id: userId,
        module_id: moduleId,
        score: finalScore,
        passed: finalScore >= 80
      })
      setSaving(false)
      setShowResult(true)
    }
  }

  if (showResult) {
    return (
      <div className="p-7 max-w-lg mx-auto text-center">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${passed ? 'bg-[#22c55e]/10' : 'bg-red-50'}`}>
          {passed
            ? <Check size={28} strokeWidth={2} className="text-[#22c55e]" />
            : <X size={28} strokeWidth={2} className="text-red-500" />
          }
        </div>
        <h2 className="text-2xl font-extrabold text-foreground mb-2" style={{ letterSpacing: '-0.03em' }}>
          {passed ? 'Module validé !' : 'Pas tout à fait...'}
        </h2>
        <p className="text-4xl font-extrabold mb-2" style={{ color: passed ? '#22c55e' : '#ef4444', letterSpacing: '-0.03em' }}>{score}%</p>
        <p className="text-sm text-muted-foreground mb-8">
          {passed ? `Tu maîtrises le module ${mod.title}. Continue !` : 'Relis le module et réessaie.'}
        </p>
        {passed && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6" style={{ background: '#cc5de820', color: '#cc5de8' }}>
            Module {moduleId} validé
          </div>
        )}
        <div className="flex flex-col gap-3">
          {passed && (
            <button
              onClick={() => navigate(`#/dashboard`)}
              className="w-full bg-foreground text-background rounded-xl py-3 text-sm font-semibold"
            >
              Passer au module suivant →
            </button>
          )}
          <button
            onClick={() => navigate(`#/dashboard/module/${moduleId}`)}
            className="w-full border border-border rounded-xl py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Retour au module
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-7 max-w-lg">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 h-1 bg-border rounded-full">
          <div className="h-1 rounded-full bg-[#cc5de8] transition-all" style={{ width: `${((current) / questions.length) * 100}%` }} />
        </div>
        <span className="text-xs text-muted-foreground">{current + 1}/{questions.length}</span>
      </div>

      <h2 className="text-lg font-extrabold text-foreground mb-6" style={{ letterSpacing: '-0.02em' }}>{q.question}</h2>

      <div className="flex flex-col gap-2.5 mb-6">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correctIndex
          const isSelected = i === selected
          let cls = 'border-border text-foreground hover:border-foreground/30'
          if (selected !== null) {
            if (isCorrect) cls = 'border-[#22c55e] bg-[#22c55e]/5 text-foreground'
            else if (isSelected) cls = 'border-red-300 bg-red-50 text-red-700'
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`flex items-center gap-3 w-full text-left border-2 rounded-xl px-4 py-3 transition-all text-sm ${cls}`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selected !== null && isCorrect ? 'border-[#22c55e] bg-[#22c55e]' :
                selected !== null && isSelected ? 'border-red-400 bg-red-400' :
                isSelected ? 'border-foreground bg-foreground' : 'border-border'
              }`}>
                {selected !== null && isCorrect && <Check size={10} strokeWidth={3} className="text-white" />}
                {selected !== null && isSelected && !isCorrect && <X size={10} strokeWidth={3} className="text-white" />}
              </div>
              {opt}
            </button>
          )
        })}
      </div>

      {selected !== null && (
        <div className={`rounded-xl p-3 mb-5 text-xs ${selected === q.correctIndex ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-red-50 text-red-600'}`}>
          <strong>{selected === q.correctIndex ? '✓ Correct !' : '✗ Pas tout à fait.'}</strong> {q.explanation}
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={selected === null || saving}
        className="w-full bg-foreground text-background rounded-xl py-3 text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2"
      >
        {saving ? 'Sauvegarde...' : current < questions.length - 1 ? 'Question suivante' : 'Voir les résultats'}
        {!saving && <ChevronRight size={14} strokeWidth={2} />}
      </button>
    </div>
  )
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/components/dashboard/QuizPage.tsx
git commit -m "feat: QuizPage avec score + sauvegarde Supabase"
```

---

### Task 12 : JournalPage

**Files:**
- Create: `src/components/dashboard/JournalPage.tsx`

- [ ] **Step 1 : Créer `src/components/dashboard/JournalPage.tsx`**

```tsx
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useJournal } from '../../hooks/useJournal'
import { CURRICULUM } from '../../data/curriculum'

interface Props {
  userId: string
}

export function JournalPage({ userId }: Props) {
  const { entries, loading, addEntry, deleteEntry } = useJournal(userId)
  const [text, setText] = useState('')
  const [tag, setTag] = useState('')
  const [saving, setSaving] = useState(false)

  const handleAdd = async () => {
    if (!text.trim()) return
    setSaving(true)
    await addEntry(text, tag || undefined)
    setText('')
    setTag('')
    setSaving(false)
  }

  return (
    <div className="p-7 max-w-2xl">
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Outil</p>
        <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>Journal de bord</h1>
        <p className="text-sm text-muted-foreground mt-1">Note tes avancées, tes blocages, tes idées.</p>
      </div>

      {/* New entry */}
      <div className="border border-[#4d96ff]/30 rounded-xl p-4 mb-6 bg-[#4d96ff]/5">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Ce que j'ai fait aujourd'hui, ce qui me bloque, mon prochain step..."
          rows={4}
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none leading-relaxed"
        />
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#4d96ff]/20">
          <select
            value={tag}
            onChange={e => setTag(e.target.value)}
            className="flex-1 text-xs border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none"
          >
            <option value="">Sans tag module</option>
            {CURRICULUM.map(m => (
              <option key={m.id} value={m.id}>Module {m.id} — {m.title}</option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            disabled={!text.trim() || saving}
            className="flex items-center gap-2 bg-[#4d96ff] text-white rounded-lg px-4 py-2 text-xs font-semibold disabled:opacity-40 hover:bg-blue-500 transition-colors"
          >
            <Plus size={12} strokeWidth={2.5} />
            {saving ? 'Sauvegarde...' : 'Ajouter'}
          </button>
        </div>
      </div>

      {/* Entries */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">Ton journal est vide pour l'instant.</p>
          <p className="text-xs mt-1">Note ta première avancée ci-dessus.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map(entry => (
            <div key={entry.id} className="border border-border rounded-xl p-4 group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(entry.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  {entry.module_tag && (
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                      Module {entry.module_tag}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500"
                >
                  <Trash2 size={13} strokeWidth={1.5} />
                </button>
              </div>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{entry.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/components/dashboard/JournalPage.tsx
git commit -m "feat: JournalPage"
```

---

### Task 13 : Mettre à jour App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1 : Remplacer `src/App.tsx`**

```tsx
import { useState, useEffect } from 'react'
import './index.css'
import { LandingPage } from './components/LandingPage'
import { CheckoutPage } from './components/CheckoutPage'
import { Upsell1Page } from './components/Upsell1Page'
import { Upsell2Page } from './components/Upsell2Page'
import { SignupPage } from './components/auth/SignupPage'
import { SigninPage } from './components/auth/SigninPage'
import { OnboardingPage } from './components/onboarding/OnboardingPage'
import { DashboardLayout } from './components/dashboard/DashboardLayout'
import { DashboardHome } from './components/dashboard/DashboardHome'
import { ModulePage } from './components/dashboard/ModulePage'
import { LessonPage } from './components/dashboard/LessonPage'
import { QuizPage } from './components/dashboard/QuizPage'
import { JournalPage } from './components/dashboard/JournalPage'
import { useAuth } from './hooks/useAuth'
import { useProgress } from './hooks/useProgress'

type Route =
  | 'landing' | 'checkout' | 'upsell-1' | 'upsell-2' | 'confirmation'
  | 'signup' | 'signin' | 'onboarding'
  | 'dashboard' | 'dashboard-module' | 'dashboard-lesson' | 'dashboard-quiz' | 'dashboard-journal'

function parseHash(hash: string): { route: Route; params: Record<string, string> } {
  const h = hash.replace(/^#\//, '')
  if (!h || h === '') return { route: 'landing', params: {} }
  if (h === 'checkout') return { route: 'checkout', params: {} }
  if (h === 'upsell-1') return { route: 'upsell-1', params: {} }
  if (h === 'upsell-2') return { route: 'upsell-2', params: {} }
  if (h === 'confirmation') return { route: 'confirmation', params: {} }
  if (h === 'signup') return { route: 'signup', params: {} }
  if (h === 'signin') return { route: 'signin', params: {} }
  if (h === 'onboarding') return { route: 'onboarding', params: {} }
  if (h === 'dashboard') return { route: 'dashboard', params: {} }
  if (h === 'dashboard/journal') return { route: 'dashboard-journal', params: {} }

  const moduleMatch = h.match(/^dashboard\/module\/([^/]+)$/)
  if (moduleMatch) return { route: 'dashboard-module', params: { moduleId: moduleMatch[1] } }

  const lessonMatch = h.match(/^dashboard\/module\/([^/]+)\/lesson\/([^/]+)$/)
  if (lessonMatch) return { route: 'dashboard-lesson', params: { moduleId: lessonMatch[1], lessonId: lessonMatch[2] } }

  const quizMatch = h.match(/^dashboard\/quiz\/([^/]+)$/)
  if (quizMatch) return { route: 'dashboard-quiz', params: { moduleId: quizMatch[1] } }

  return { route: 'landing', params: {} }
}

function getPageTitle(route: Route, params: Record<string, string>): string {
  if (route === 'dashboard') return 'Blueprint'
  if (route === 'dashboard-module') return `Module ${params.moduleId}`
  if (route === 'dashboard-lesson') return `Leçon ${params.lessonId}`
  if (route === 'dashboard-quiz') return `Quiz — Module ${params.moduleId}`
  if (route === 'dashboard-journal') return 'Journal de bord'
  return 'Blueprint'
}

function App() {
  const [hash, setHash] = useState(window.location.hash || '#/')
  const [hasOrderBump, setHasOrderBump] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  const { user } = useAuth()
  const { isCompleted, markComplete, moduleProgress } = useProgress(user?.id)

  const { route, params } = parseHash(hash)

  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash || '#/')
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const navigate = (to: string) => {
    window.location.hash = to.startsWith('#') ? to.slice(1) : to
  }

  // Funnel routes
  if (route === 'landing') return <LandingPage onCTAClick={() => navigate('#/checkout')} />
  if (route === 'checkout') return <CheckoutPage hasOrderBump={hasOrderBump} setHasOrderBump={setHasOrderBump} onPay={() => navigate('#/upsell-1')} />
  if (route === 'upsell-1') return <Upsell1Page hasOrderBump={hasOrderBump} onAccept={() => navigate('#/upsell-2')} onDecline={() => navigate('#/signup')} />
  if (route === 'upsell-2') return <Upsell2Page onAccept={() => navigate('#/signup')} onDecline={() => navigate('#/signup')} />

  // Auth routes
  if (route === 'signup') return <SignupPage onSwitchToSignin={() => navigate('#/signin')} onSuccess={() => navigate('#/onboarding')} />
  if (route === 'signin') return <SigninPage onSwitchToSignup={() => navigate('#/signup')} onSuccess={() => navigate('#/dashboard')} />
  if (route === 'onboarding' && user) return <OnboardingPage userId={user.id} onComplete={() => navigate('#/dashboard')} />

  // Dashboard routes
  const isDashRoute = ['dashboard', 'dashboard-module', 'dashboard-lesson', 'dashboard-quiz', 'dashboard-journal'].includes(route)

  if (isDashRoute) {
    return (
      <DashboardLayout
        currentPath={hash}
        title={getPageTitle(route, params)}
        navigate={navigate}
        isDark={isDark}
        onToggleDark={() => setIsDark(d => !d)}
      >
        {route === 'dashboard' && <DashboardHome navigate={navigate} moduleProgress={moduleProgress} />}
        {route === 'dashboard-module' && <ModulePage moduleId={params.moduleId} navigate={navigate} isCompleted={isCompleted} />}
        {route === 'dashboard-lesson' && (
          <LessonPage
            moduleId={params.moduleId}
            lessonId={params.lessonId}
            navigate={navigate}
            isCompleted={isCompleted}
            markComplete={markComplete}
          />
        )}
        {route === 'dashboard-quiz' && user && <QuizPage moduleId={params.moduleId} userId={user.id} navigate={navigate} />}
        {route === 'dashboard-journal' && user && <JournalPage userId={user.id} />}
      </DashboardLayout>
    )
  }

  return <LandingPage onCTAClick={() => navigate('#/checkout')} />
}

export default App
```

- [ ] **Step 2 : Build complet**

```bash
cd "/Users/alfredorsini/CLAUDE/###BLUEPRINT BUILDRS/blueprint-app"
npx vite build 2>&1
```

Expected: `dist/` généré sans erreur TypeScript. Si erreur : corriger avant de continuer.

- [ ] **Step 3 : Vérifier dans le navigateur**

```bash
pkill -f "serve dist" 2>/dev/null
npx serve dist --listen 4000 &
sleep 1
open http://localhost:4000
```

Tester :
- `http://localhost:4000/#/signup` → page signup visible
- `http://localhost:4000/#/signin` → page signin visible
- `http://localhost:4000/` → landing page

- [ ] **Step 4 : Commit final**

```bash
git add src/App.tsx
git commit -m "feat: wire all routes — funnel + auth + onboarding + dashboard"
```

---

## Chunk 7 : Vérification finale + dark mode CSS

### Task 14 : Vérifier dark mode et polish

**Files:**
- Modify: `src/index.css` (vérification du `.dark` selector)

- [ ] **Step 1 : Vérifier que `.dark` est bien dans `index.css`**

```bash
grep -n '\.dark' "/Users/alfredorsini/CLAUDE/###BLUEPRINT BUILDRS/blueprint-app/src/index.css" | head -10
```

Si absent, ajouter dans `src/index.css` après `:root` :
```css
.dark {
  --background: 240 10% 4%;
  --foreground: 0 0% 98%;
  --card: 240 10% 6%;
  --card-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 240 10% 4%;
  --secondary: 240 4% 10%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 4% 10%;
  --muted-foreground: 240 5% 65%;
  --accent: 240 4% 10%;
  --accent-foreground: 0 0% 98%;
  --border: 240 4% 16%;
  --input: 240 4% 16%;
  --ring: 240 5% 84%;
}
```

- [ ] **Step 2 : Build final**

```bash
cd "/Users/alfredorsini/CLAUDE/###BLUEPRINT BUILDRS/blueprint-app"
npx vite build && echo "BUILD OK"
```

- [ ] **Step 3 : Test e2e manuel**

Tester le flux complet dans le navigateur :
1. `/#/signup` — créer un compte email (ou Google/GitHub)
2. Redirect auto → `/#/onboarding` — valider les 4 étapes
3. Redirect auto → `/#/dashboard` — voir la liste des modules
4. Cliquer Module 00 → liste des leçons
5. Cliquer leçon 0.1 → mode lecture, copier un prompt, cocher checklist, marquer terminé
6. Cliquer Quiz de fin de module → répondre aux questions
7. Cliquer Journal de bord → écrire une entrée
8. Toggle dark mode → vérifier le switch

- [ ] **Step 4 : Commit final**

```bash
git add -A
git commit -m "feat: dark mode CSS + dashboard complet — auth, onboarding, modules, leçons, quiz, journal"
```

---

## Résumé des fichiers créés

| Fichier | Rôle |
|---------|------|
| `src/lib/supabase.ts` | Client Supabase singleton |
| `src/hooks/useAuth.ts` | Session + OAuth |
| `src/hooks/useOnboarding.ts` | Profil utilisateur |
| `src/hooks/useProgress.ts` | Progression leçons |
| `src/hooks/useJournal.ts` | CRUD journal |
| `src/data/curriculum.ts` | Structure modules/leçons/quiz |
| `src/components/auth/SignupPage.tsx` | Inscription |
| `src/components/auth/SigninPage.tsx` | Connexion |
| `src/components/onboarding/OnboardingPage.tsx` | Flow 4 étapes |
| `src/components/dashboard/DashboardLayout.tsx` | Shell protégé |
| `src/components/dashboard/Sidebar.tsx` | Navigation |
| `src/components/dashboard/Header.tsx` | Barre supérieure |
| `src/components/dashboard/DashboardHome.tsx` | Hub modules |
| `src/components/dashboard/ModulePage.tsx` | Sommaire leçons |
| `src/components/dashboard/LessonPage.tsx` | Lecture pleine page |
| `src/components/dashboard/QuizPage.tsx` | Quiz interactif |
| `src/components/dashboard/JournalPage.tsx` | Journal de bord |
| `src/App.tsx` | Router (modifié) |
