# Projects CRUD + Phase 1 Lab Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Brancher les vraies données Supabase pour les projets et implémenter la génération Phase 1 avec Claude en streaming via Edge Function.

**Architecture:** Un ProjectContext (React) tourne dans AppLayout — il fetch le projet courant via `useProject(id)` et le fournit à la sidebar et aux pages enfants via Context, sans double requête. Les pages Project et Phase consomment via `useProjectContext()`. La génération Claude passe par une Edge Function Supabase qui streame en `text/plain` ; le client lit via `ReadableStream` et affiche progressivement.

**Tech Stack:** Vite 6 + React 19 + TypeScript strict, Supabase JS v2, React Router v7, Anthropic SDK (Deno), Supabase Edge Functions.

**Contexte important :**
- `projects` table : id, user_id, name, description, idea_data (jsonb), current_phase, status, created_at, updated_at — **pas de colonne score ni completed_phases** (les phases sont dans `project_phases`)
- `project_phases` table : id, project_id, phase_number, status ('locked'|'active'|'completed'), generated_content (jsonb), steps_completed, completed_at
- `niche` du formulaire → stocké dans `idea_data: { niche }`
- Score phase 1 → extrait de `project_phases[phase_number=1].generated_content.score`
- Pattern Edge Functions : `import Anthropic from 'npm:@anthropic-ai/sdk@0.39.0'`, CORS via `_shared/cors.ts`
- `AppLayout` a déjà `const { id } = useParams()` et passe `currentProjectId={id}` à AppSidebar

---

## Chunk 1 : Hooks + Project Context

### Task 1 : `useProjects` hook

**Files:**
- Create: `src/hooks/use-projects.ts`

- [ ] **Step 1 : Créer le fichier**

```typescript
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './use-auth'

interface PhaseInfo {
  phase_number: number
  status: string
  generated_content: Record<string, unknown>
}

interface ProjectWithPhases {
  id: string
  name: string
  description: string | null
  current_phase: number
  status: string
  idea_data: Record<string, string>
  created_at: string
  updated_at: string
  project_phases: PhaseInfo[]
}

interface ProjectsState {
  projects: ProjectWithPhases[]
  loading: boolean
  error: string | null
}

function useProjects() {
  const { user, loading: authLoading } = useAuth()
  const [state, setState] = useState<ProjectsState>({
    projects: [],
    loading: true,
    error: null,
  })

  const fetchProjects = useCallback(async () => {
    if (!user) return
    setState(prev => ({ ...prev, loading: true, error: null }))
    const { data, error } = await supabase
      .from('projects')
      .select('*, project_phases(phase_number, status, generated_content)')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      setState({ projects: [], loading: false, error: error.message })
    } else {
      setState({ projects: (data as ProjectWithPhases[]) ?? [], loading: false, error: null })
    }
  }, [user])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setState({ projects: [], loading: false, error: null })
      return
    }
    fetchProjects()
  }, [user?.id, authLoading, fetchProjects])

  return { ...state, refetch: fetchProjects }
}

export { useProjects }
export type { ProjectWithPhases, PhaseInfo }
```

- [ ] **Step 2 : Vérifier le build**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab" && npm run build 2>&1 | tail -5
```
Expected: `✓ built in`

- [ ] **Step 3 : Commit**

```bash
git add src/hooks/use-projects.ts
git commit -m "feat(hooks): ajouter useProjects avec project_phases embedded"
```

---

### Task 2 : `useProject` hook

**Files:**
- Create: `src/hooks/use-project.ts`

- [ ] **Step 1 : Créer le fichier**

```typescript
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface Phase {
  id: string
  phase_number: number
  status: string
  generated_content: Record<string, unknown>
  steps_completed: unknown[]
  completed_at: string | null
}

interface Project {
  id: string
  name: string
  description: string | null
  current_phase: number
  status: string
  idea_data: Record<string, string>
  created_at: string
  updated_at: string
}

interface ProjectState {
  project: Project | null
  phases: Phase[]
  loading: boolean
  error: string | null
}

function useProject(id: string | undefined) {
  const [state, setState] = useState<ProjectState>({
    project: null,
    phases: [],
    loading: !!id, // true only if id is provided
    error: null,
  })

  const fetchProject = useCallback(async () => {
    if (!id) {
      setState({ project: null, phases: [], loading: false, error: null })
      return
    }
    setState(prev => ({ ...prev, loading: true, error: null }))
    const { data, error } = await supabase
      .from('projects')
      .select('*, project_phases(*)')
      .eq('id', id)
      .single()

    if (error) {
      setState({ project: null, phases: [], loading: false, error: error.message })
    } else if (data) {
      const { project_phases, ...project } = data as Project & { project_phases: Phase[] }
      setState({
        project,
        phases: project_phases ?? [],
        loading: false,
        error: null,
      })
    }
  }, [id])

  useEffect(() => {
    fetchProject()
  }, [fetchProject])

  return { ...state, refetch: fetchProject }
}

export { useProject }
export type { Project, Phase }
```

- [ ] **Step 2 : Vérifier le build**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab" && npm run build 2>&1 | tail -5
```

- [ ] **Step 3 : Commit**

```bash
git add src/hooks/use-project.ts
git commit -m "feat(hooks): ajouter useProject avec phases"
```

---

### Task 3 : ProjectContext

**Files:**
- Create: `src/contexts/project-context.tsx`

- [ ] **Step 1 : Créer le fichier**

```typescript
import { createContext, useContext, ReactNode } from 'react'
import type { Project, Phase } from '@/hooks/use-project'

interface ProjectContextValue {
  project: Project | null
  phases: Phase[]
  loading: boolean
  error: string | null
  refetch: () => void
}

const ProjectContext = createContext<ProjectContextValue>({
  project: null,
  phases: [],
  loading: false,
  error: null,
  refetch: () => {},
})

function useProjectContext() {
  return useContext(ProjectContext)
}

export { ProjectContext, useProjectContext }
export type { ProjectContextValue }
```

- [ ] **Step 2 : Vérifier le build**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab" && npm run build 2>&1 | tail -5
```

- [ ] **Step 3 : Commit**

```bash
git add src/contexts/project-context.tsx
git commit -m "feat(context): ajouter ProjectContext"
```

---

## Chunk 2 : Wiring des pages

### Task 4 : AppLayout — fetch projet + context + sidebar props

**Files:**
- Modify: `src/components/layout/app-layout.tsx`

Le but : quand `id` est défini (routes `/project/:id` et `/project/:id/phase/:phase`), AppLayout fetche le projet et :
1. Passe `currentPhase` + `completedPhases` à AppSidebar
2. Fournit le projet via ProjectContext aux pages enfants

- [ ] **Step 1 : Réécrire app-layout.tsx**

```typescript
import { useEffect } from 'react'
import { Outlet, useParams, useNavigate } from 'react-router'
import { AppSidebar } from './app-sidebar'
import { AppHeader } from './app-header'
import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/use-profile'
import { useProject } from '@/hooks/use-project'
import { ProjectContext } from '@/contexts/project-context'

function AppLayout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const projectData = useProject(id) // no-op when id is undefined

  // Redirection : non connecté
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, authLoading, navigate])

  // Redirection : onboarding non complété
  useEffect(() => {
    if (!authLoading && !profileLoading && user) {
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

  const completedPhaseNumbers = projectData.phases
    .filter(p => p.status === 'completed')
    .map(p => p.phase_number)

  return (
    <ProjectContext.Provider value={projectData}>
      <div className="min-h-screen flex bg-[#F8F9FC]">
        <AppSidebar
          currentProjectId={id}
          currentPhase={projectData.project?.current_phase}
          completedPhases={completedPhaseNumbers}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </ProjectContext.Provider>
  )
}

export { AppLayout }
```

- [ ] **Step 2 : Vérifier le build**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab" && npm run build 2>&1 | tail -5
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/layout/app-layout.tsx
git commit -m "feat(layout): brancher ProjectContext et sidebar props depuis useProject"
```

---

### Task 5 : ProjectNewPage — vrai insert Supabase

**Files:**
- Modify: `src/app/(auth)/project-new-page.tsx`

- [ ] **Step 1 : Réécrire project-new-page.tsx**

```typescript
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'

const projectSchema = z.object({
  name: z.string().min(2, 'Le nom doit faire au moins 2 caractères'),
  description: z.string().min(10, 'Décris ton projet en quelques mots'),
  niche: z.string().min(3, 'Précise la niche ou le secteur'),
})

type ProjectForm = z.infer<typeof projectSchema>

function ProjectNewPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState<ProjectForm>({ name: '', description: '', niche: '' })
  const [errors, setErrors] = useState<Partial<ProjectForm>>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = projectSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Partial<ProjectForm> = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ProjectForm
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setServerError(null)
    setLoading(true)

    // Créer le projet
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: user!.id,
        name: form.name,
        description: form.description,
        idea_data: { niche: form.niche },
      })
      .select('id')
      .single()

    if (projectError || !project) {
      setServerError('Erreur lors de la création. Réessaie.')
      setLoading(false)
      return
    }

    // Créer la phase 1 comme active
    await supabase.from('project_phases').insert({
      project_id: project.id,
      phase_number: 1,
      status: 'active',
    })

    navigate(`/project/${project.id}`, { replace: true })
  }

  return (
    <div className="max-w-[560px] mx-auto flex flex-col gap-8">
      <div>
        <h1
          className="text-[#121317]"
          style={{ fontSize: '1.4rem', fontWeight: 500, letterSpacing: '-0.02em' }}
        >
          Nouveau projet
        </h1>
        <p className="text-sm text-[#45474D] mt-1">
          Quelques infos pour personnaliser ton Lab. 30 secondes.
        </p>
      </div>

      <Card variant="white" padding="lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Nom du projet"
            type="text"
            placeholder="Ex: TaskFlow Pro, MediSync, BriefAI…"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            hint="Tu pourras le changer plus tard"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[12.5px] font-medium text-[#45474D] tracking-[0.011em]">
              Description courte
            </label>
            <textarea
              className="bg-white border border-[#E6EAF0] text-[#121317] rounded-[10px]
                px-4 py-3 text-sm resize-none min-h-[96px]
                focus:outline-none focus:ring-2 focus:ring-[#3279F9]/40
                placeholder:text-[#B2BBC5]
                hover:border-[#E1E6EC] transition-all duration-200"
              placeholder="Ex: Un outil de gestion de tâches pour les freelances qui jonglent entre plusieurs clients…"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            {errors.description && (
              <p className="text-xs text-[#EF4444]">{errors.description}</p>
            )}
          </div>

          <Input
            label="Niche / Secteur"
            type="text"
            placeholder="Ex: freelances, para-médicaux, restauration, RH…"
            value={form.niche}
            onChange={(e) => setForm({ ...form, niche: e.target.value })}
            error={errors.niche}
            hint="Qui sont tes clients cibles ?"
          />

          {serverError && (
            <p className="text-sm text-[#EF4444]">{serverError}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            className="gap-2 mt-1"
          >
            Lancer la Phase 1
            <ArrowRight size={15} />
          </Button>
        </form>
      </Card>

      <p className="text-xs text-center text-[#B2BBC5]">
        Le Lab analysera ton idée et te guidera étape par étape.
      </p>
    </div>
  )
}

export { ProjectNewPage }
```

- [ ] **Step 2 : Vérifier le build**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab" && npm run build 2>&1 | tail -5
```

- [ ] **Step 3 : Commit**

```bash
git add src/app/\(auth\)/project-new-page.tsx
git commit -m "feat(project): brancher la création réelle sur Supabase"
```

---

### Task 6 : DashboardPage — vraies données

**Files:**
- Modify: `src/app/(auth)/dashboard-page.tsx`

Helper pour afficher le temps relatif :
```typescript
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return 'À l'instant'
  if (h < 24) return `Il y a ${h}h`
  const d = Math.floor(h / 24)
  if (d === 1) return 'Hier'
  return `Il y a ${d} jours`
}
```

Helper pour le score depuis les phases :
```typescript
function getScore(phases: PhaseInfo[]): number {
  const phase1 = phases.find(p => p.phase_number === 1 && p.status === 'completed')
  return (phase1?.generated_content?.score as number) ?? 0
}
```

- [ ] **Step 1 : Réécrire dashboard-page.tsx**

```typescript
import { Link } from 'react-router'
import { Plus, ArrowRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ProgressPhases } from '@/components/ui/progress-phases'
import { ScoreBadge } from '@/components/ui/score-badge'
import { PHASE_NAMES } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { useProjects } from '@/hooks/use-projects'
import type { PhaseInfo } from '@/hooks/use-projects'

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return "À l'instant"
  if (h < 24) return `Il y a ${h}h`
  const d = Math.floor(h / 24)
  if (d === 1) return 'Hier'
  return `Il y a ${d} jours`
}

function getScore(phases: PhaseInfo[]): number {
  const phase1 = phases.find(p => p.phase_number === 1 && p.status === 'completed')
  return (phase1?.generated_content?.score as number) ?? 0
}

function DashboardPage() {
  const { user } = useAuth()
  const { projects, loading, error } = useProjects()

  const rawName = user?.email?.split('@')[0] ?? 'toi'
  const firstName = rawName.charAt(0).toUpperCase() + rawName.slice(1)

  if (loading) {
    return (
      <div className="max-w-[960px] mx-auto flex flex-col gap-8">
        <div className="h-10 w-48 bg-[#F0F1F5] rounded-xl animate-pulse" />
        <div className="flex flex-col gap-3">
          {[1, 2].map(i => (
            <div key={i} className="h-32 bg-[#F0F1F5] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-[960px] mx-auto">
        <p className="text-sm text-[#EF4444]">Erreur : {error}</p>
      </div>
    )
  }

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
            {projects.length} projet{projects.length > 1 ? 's' : ''} en cours
          </p>
        </div>
        <Link to="/project/new">
          <Button variant="primary" size="sm" className="gap-1.5">
            <Plus size={14} />
            Nouveau
          </Button>
        </Link>
      </div>

      {projects.length > 0 && (
        <div className="flex flex-col gap-3">
          {projects.map((project) => {
            const completedPhases = project.project_phases
              .filter(p => p.status === 'completed')
              .map(p => p.phase_number)
            const score = getScore(project.project_phases)

            return (
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
                        {score > 0 && <ScoreBadge score={score} size="sm" />}
                      </div>
                      <p className="text-sm text-[#45474D] truncate">
                        {project.description ?? project.idea_data?.niche ?? '—'}
                      </p>
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
                        {relativeTime(project.updated_at)}
                      </div>
                    </div>
                    <ProgressPhases
                      currentPhase={project.current_phase}
                      completedPhases={completedPhases}
                    />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}

      {projects.length === 0 && (
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

- [ ] **Step 2 : Vérifier le build**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab" && npm run build 2>&1 | tail -5
```

- [ ] **Step 3 : Commit**

```bash
git add src/app/\(auth\)/dashboard-page.tsx
git commit -m "feat(dashboard): brancher useProjects — vraies données Supabase"
```

---

### Task 7 : ProjectPage — vrai projet via context

**Files:**
- Modify: `src/app/(auth)/project-page.tsx`

- [ ] **Step 1 : Réécrire project-page.tsx**

```typescript
import { useParams, Link } from 'react-router'
import { ArrowRight, Lock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScoreBadge } from '@/components/ui/score-badge'
import { ProgressPhases } from '@/components/ui/progress-phases'
import { PHASE_NAMES } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useProjectContext } from '@/contexts/project-context'

const PHASE_ICONS = ['💡', '🏗️', '🎨', '🔧', '⚙️', '🔨', '🚀', '📣']
const PHASE_DESCRIPTIONS = [
  'Valide ton idée avec de vraies données marché et un score /100.',
  'Structure ton produit : pages, features MVP, modèle de données, monétisation.',
  'Génère ton branding complet : nom, couleurs, typo, style visuel.',
  'Crée ton kit Claude Code : CLAUDE.md, .mcp.json, Skills, prompts.',
  "Guide d'installation pas-à-pas : Node.js, Claude Code, Skills, MCP.",
  'Séquence de prompts testés à copier dans Claude Code.',
  'Déploie sur Vercel, configure Stripe, connecte ton domaine.',
  'Checklist de lancement, templates Product Hunt, Reddit, LinkedIn.',
]

function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const { project, phases, loading, error } = useProjectContext()

  if (loading) {
    return (
      <div className="max-w-[860px] mx-auto flex flex-col gap-8">
        <div className="h-10 w-64 bg-[#F0F1F5] rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-28 bg-[#F0F1F5] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#45474D]">Projet introuvable.</p>
      </div>
    )
  }

  const completedPhases = phases
    .filter(p => p.status === 'completed')
    .map(p => p.phase_number)

  const phase1 = phases.find(p => p.phase_number === 1 && p.status === 'completed')
  const score = (phase1?.generated_content?.score as number) ?? 0

  return (
    <div className="max-w-[860px] mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <h1
            className="text-[#121317]"
            style={{ fontSize: '1.4rem', fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            {project.name}
          </h1>
          {score > 0 && <ScoreBadge score={score} />}
        </div>
        <p className="text-sm text-[#45474D]">
          {project.description ?? project.idea_data?.niche ?? '—'}
        </p>
        <ProgressPhases
          currentPhase={project.current_phase}
          completedPhases={completedPhases}
          showLabels
        />
      </div>

      {/* Grille 8 phases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((phase) => {
          const isCompleted = completedPhases.includes(phase)
          const isCurrent = phase === project.current_phase
          const isLocked = phase > project.current_phase && !isCompleted

          return (
            <Link
              key={phase}
              to={isLocked ? '#' : `/project/${id}/phase/${phase}`}
              className={cn(isLocked && 'cursor-not-allowed pointer-events-none')}
            >
              <Card
                variant="white"
                padding="md"
                hover={!isLocked}
                className={cn(
                  'flex gap-4 h-full',
                  isCurrent && 'border-[#3279F9] shadow-[0_0_0_1px_#3279F9,0_0_16px_rgba(50,121,249,0.12)]'
                )}
              >
                <span className={cn('text-xl flex-shrink-0 mt-0.5', isLocked && 'opacity-25')}>
                  {PHASE_ICONS[phase - 1]}
                </span>

                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-[#B2BBC5] font-medium">Phase {phase}</span>
                    {isCompleted && <Badge variant="success">✓</Badge>}
                    {isCurrent && <Badge variant="accent">En cours</Badge>}
                    {isLocked && <Lock size={10} className="text-[#B2BBC5]" />}
                  </div>

                  <p className={cn(
                    'text-sm font-medium leading-tight',
                    isLocked ? 'text-[#B2BBC5]' : 'text-[#121317]'
                  )}>
                    {PHASE_NAMES[phase]}
                  </p>

                  <p className={cn(
                    'text-xs leading-relaxed',
                    isLocked ? 'text-[#E6EAF0]' : 'text-[#45474D]'
                  )}>
                    {PHASE_DESCRIPTIONS[phase - 1]}
                  </p>

                  {!isLocked && (
                    <div className="flex items-center gap-1 mt-1 text-[#3279F9] text-xs">
                      {isCurrent ? 'Continuer' : 'Revoir'}
                      <ArrowRight size={11} />
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export { ProjectPage }
```

- [ ] **Step 2 : Build + commit**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab" && npm run build 2>&1 | tail -5
git add src/app/\(auth\)/project-page.tsx
git commit -m "feat(project): brancher useProjectContext — vraies données"
```

---

## Chunk 3 : Phase 1 Claude Streaming

### Task 8 : Prompt Phase 1 partagé

**Files:**
- Create: `supabase/functions/_shared/prompts.ts`

- [ ] **Step 1 : Créer le fichier**

```typescript
export const PHASE_PROMPTS: Record<number, string> = {
  1: `Tu es un expert en validation de micro-SaaS et en stratégie marché.
Tu dois analyser l'idée de projet fournie et produire un rapport de validation complet.

Utilise web_search pour trouver des données réelles sur :
- Les concurrents directs et indirects (trouve des vrais noms, des vrais prix)
- La taille du marché et sa croissance
- Les tendances récentes (forums, Product Hunt, G2, Capterra, Reddit)

Structure ta réponse en markdown avec EXACTEMENT ce format :

## Score de validation : [CHIFFRE]/100

## Résumé exécutif
[3-4 phrases. Résume l'opportunité en termes business, pas techniques.]

## Analyse marché

### Opportunité
[Taille estimée du marché, croissance annuelle, tendances actuelles avec sources]

### Concurrents identifiés
| Concurrent | Prix | Force principale | Faiblesse principale |
|---|---|---|---|
[Minimum 3 vrais concurrents trouvés via web_search]

### Fenêtre de différenciation
[En quoi ce projet peut se distinguer concrètement des solutions existantes]

## Recommandations

### Positionnement prix
[Fourchette recommandée basée sur les concurrents trouvés, avec justification]

### MVP prioritaire
[Les 3 features absolument nécessaires pour un premier lancement]

### Risques principaux
[Les 2-3 risques à surveiller impérativement]

## Verdict

### [GO ✓ | À AFFINER ⚠️ | PIVOT ✗]
[Justification en 2-3 phrases directes. Tutoie l'utilisateur.]

---
Score ≥ 75 → GO, Score 45-74 → À AFFINER, Score < 45 → PIVOT`,
}
```

- [ ] **Step 2 : Commit**

```bash
git add supabase/functions/_shared/prompts.ts
git commit -m "feat(functions): ajouter prompt Phase 1 validation"
```

---

### Task 9 : Edge Function `generate-phase`

**Files:**
- Create: `supabase/functions/generate-phase/index.ts`

La fonction :
1. Vérifie l'auth (JWT)
2. Reçoit `{ projectId, phaseNumber }`
3. Fetche le projet pour construire le message utilisateur
4. Streame la réponse Claude en `text/plain`
5. Après le stream, sauvegarde dans `project_phases` et met à jour `projects.current_phase`

- [ ] **Step 1 : Créer le fichier**

```typescript
import Anthropic from 'npm:@anthropic-ai/sdk@0.39.0'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { PHASE_PROMPTS } from '../_shared/prompts.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Auth
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Body
    const { projectId, phaseNumber } = await req.json()
    if (!projectId || !phaseNumber) {
      return new Response(JSON.stringify({ error: 'projectId et phaseNumber requis' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const systemPrompt = PHASE_PROMPTS[phaseNumber as number]
    if (!systemPrompt) {
      return new Response(JSON.stringify({ error: `Phase ${phaseNumber} non supportée` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Fetch projet (RLS vérifie l'ownership automatiquement)
    const { data: project, error: projectError } = await supabaseUser
      .from('projects')
      .select('name, description, idea_data')
      .eq('id', projectId)
      .single()

    if (projectError || !project) {
      return new Response(JSON.stringify({ error: 'Projet introuvable' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const userMessage = [
      `Projet : ${project.name}`,
      project.description ? `Description : ${project.description}` : null,
      (project.idea_data as Record<string, string>)?.niche
        ? `Niche / secteur cible : ${(project.idea_data as Record<string, string>).niche}`
        : null,
    ].filter(Boolean).join('\n')

    // Streaming Claude
    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! })
    const stream = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      stream: true,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Construire un ReadableStream qui envoie les chunks au client et accumule le texte
    let fullText = ''
    const body = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const chunk = event.delta.text
              fullText += chunk
              controller.enqueue(new TextEncoder().encode(chunk))
            }
          }
        } catch (err) {
          controller.error(err)
          return
        }

        // Extraire le score depuis le texte généré
        const scoreMatch = fullText.match(/Score de validation\s*:\s*(\d+)\/100/)
        const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0

        // Sauvegarder dans project_phases
        await supabaseAdmin.from('project_phases').upsert({
          project_id: projectId,
          phase_number: phaseNumber,
          status: 'completed',
          generated_content: { text: fullText, score },
          completed_at: new Date().toISOString(),
        }, { onConflict: 'project_id,phase_number' })

        // Mettre à jour current_phase du projet si nécessaire
        await supabaseAdmin
          .from('projects')
          .update({ current_phase: Math.min(phaseNumber + 1, 8) })
          .eq('id', projectId)
          .lt('current_phase', phaseNumber + 1)

        controller.close()
      },
    })

    return new Response(body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue'
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
```

- [ ] **Step 2 : Déployer la Edge Function**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab"
npx supabase functions deploy generate-phase --no-verify-jwt
```

Note : `--no-verify-jwt` n'est pas nécessaire ici puisqu'on vérifie manuellement, mais le flag `--no-verify-jwt` peut être omis si le JWT est géré automatiquement par Supabase.

En fait, garder la vérification JWT automatique (ne PAS passer `--no-verify-jwt`) :
```bash
npx supabase functions deploy generate-phase
```

- [ ] **Step 3 : Commit**

```bash
git add supabase/functions/generate-phase/index.ts
git commit -m "feat(functions): ajouter generate-phase avec streaming Claude"
```

---

### Task 10 : PhasePage — streaming UI

**Files:**
- Modify: `src/app/(auth)/phase-page.tsx`

La page lit le flux via `fetch()` + `ReadableStream`. Si `generated_content.text` existe déjà (phase déjà générée), on l'affiche directement sans regénérer.

Le Supabase URL et anon key sont dans `import.meta.env.VITE_SUPABASE_URL` et `import.meta.env.VITE_SUPABASE_ANON_KEY`. Le session token s'obtient via `supabase.auth.getSession()`.

- [ ] **Step 1 : Réécrire phase-page.tsx**

```typescript
import { useState, useRef } from 'react'
import { useParams, Link } from 'react-router'
import { RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PHASE_NAMES } from '@/lib/utils'
import { useProjectContext } from '@/contexts/project-context'
import { supabase } from '@/lib/supabase'

const PHASE_ICONS = ['💡', '🏗️', '🎨', '🔧', '⚙️', '🔨', '🚀', '📣']

function PhasePage() {
  const { id, phase } = useParams<{ id: string; phase: string }>()
  const phaseNumber = parseInt(phase ?? '1', 10)
  const phaseName = PHASE_NAMES[phaseNumber] ?? 'Phase inconnue'

  const { phases, refetch } = useProjectContext()
  const existingPhase = phases.find(p => p.phase_number === phaseNumber)
  const existingText = (existingPhase?.generated_content?.text as string) ?? null

  const [streaming, setStreaming] = useState(false)
  const [content, setContent] = useState<string | null>(existingText)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const handleGenerate = async () => {
    if (!id) return
    setStreaming(true)
    setContent('')
    setError(null)

    abortRef.current = new AbortController()

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Non authentifié')

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-phase`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ projectId: id, phaseNumber }),
          signal: abortRef.current.signal,
        }
      )

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error ?? 'Erreur serveur')
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setContent(accumulated)
      }

      // Rafraîchir le context pour mettre à jour les phases
      refetch()
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message)
      }
    } finally {
      setStreaming(false)
    }
  }

  const isCompleted = existingPhase?.status === 'completed'

  return (
    <div className="max-w-[760px] mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <span className="text-3xl">{PHASE_ICONS[phaseNumber - 1]}</span>
        <div>
          <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#B2BBC5]">
            Phase {phaseNumber}
          </p>
          <h1
            className="text-[#121317]"
            style={{ fontSize: '1.4rem', fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            {phaseName}
          </h1>
        </div>
        <Badge variant={isCompleted ? 'success' : 'accent'} className="ml-auto">
          {isCompleted ? '✓ Complété' : 'En cours'}
        </Badge>
      </div>

      {/* Zone contenu */}
      <Card variant="white" padding="lg" className="flex flex-col gap-5">
        {!content && !streaming && (
          <div className="flex flex-col gap-1.5">
            <h2 className="text-sm font-medium text-[#121317]">Prêt à commencer ?</h2>
            <p className="text-sm text-[#45474D] leading-relaxed">
              Le Lab va analyser ton projet avec de vraies données marché et générer
              un rapport de validation complet avec un score /100.
              La génération prend environ 30 secondes.
            </p>
          </div>
        )}

        {/* Contenu streamé ou existant */}
        {(content || streaming) && (
          <div className="flex flex-col gap-2">
            <div
              className="rounded-xl border border-[#E6EAF0] bg-[#F8F9FC] p-6 min-h-[200px]
                text-sm text-[#121317] leading-relaxed whitespace-pre-wrap font-mono"
            >
              {content || ''}
              {streaming && (
                <span className="inline-block w-1.5 h-4 bg-[#3279F9] ml-0.5 animate-pulse" />
              )}
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-[#EF4444]">{error}</p>
        )}

        <div className="flex items-center gap-3">
          {!content && !streaming && (
            <Button variant="primary" size="md" onClick={handleGenerate} className="gap-2">
              Générer avec le Lab →
            </Button>
          )}
          {content && !streaming && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGenerate}
              className="gap-1.5 text-[#45474D]"
            >
              <RefreshCw size={13} />
              Regénérer
            </Button>
          )}
          {streaming && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => abortRef.current?.abort()}
              className="text-[#EF4444]"
            >
              Arrêter
            </Button>
          )}
        </div>
      </Card>

      {/* Navigation phases */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E6EAF0]">
        <Link to={`/project/${id}`} className="text-xs text-[#B2BBC5] hover:text-[#45474D]">
          ← Retour au projet
        </Link>
        <div className="flex gap-3">
          {phaseNumber > 1 && (
            <Link to={`/project/${id}/phase/${phaseNumber - 1}`}>
              <Button variant="ghost" size="sm" className="text-[#45474D]">
                ← Précédente
              </Button>
            </Link>
          )}
          {phaseNumber < 8 && isCompleted && (
            <Link to={`/project/${id}/phase/${phaseNumber + 1}`}>
              <Button variant="secondary" size="sm">
                Suivante →
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export { PhasePage }
```

- [ ] **Step 2 : Vérifier le build**

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab" && npm run build 2>&1 | tail -5
```

- [ ] **Step 3 : Commit final**

```bash
git add src/app/\(auth\)/phase-page.tsx
git commit -m "feat(phase): streaming Claude Phase 1 avec sauvegarde Supabase"
```

---

## Vérification finale

- [ ] Créer un vrai projet via `/project/new` — naviguer vers la page projet
- [ ] Le dashboard affiche le vrai projet avec la bonne phase
- [ ] La sidebar montre Phase 1 comme active
- [ ] Cliquer Phase 1 → PhasePage → cliquer "Générer" → voir le texte streamer
- [ ] Rafraîchir la page → le contenu généré est réaffiché sans regénérer
- [ ] `npm run build` passe sans erreur TypeScript

```bash
cd "/Users/alfredorsini/CLAUDE/Le Lab" && npm run build 2>&1 | tail -3
```
