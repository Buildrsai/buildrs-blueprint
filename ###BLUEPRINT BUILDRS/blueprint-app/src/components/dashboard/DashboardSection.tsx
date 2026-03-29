/**
 * DashboardSection — lazy-loaded component that owns the dashboard routing,
 * useProgress (→ curriculum.ts ~173KB), and useJournal hooks.
 *
 * By isolating these here, the main bundle (LP visitors) never loads curriculum.ts.
 */
import { lazy, Suspense } from 'react'
import { BouncingDots } from '../ui/bouncing-dots'
import type { User } from '@supabase/supabase-js'
import { useProgress } from '../../hooks/useProgress'
import { useJournal } from '../../hooks/useJournal'

// All page components — lazy so each route only loads what it needs
const DashboardLayout    = lazy(() => import('./DashboardLayout').then(m => ({ default: m.DashboardLayout })))
const ModulePage         = lazy(() => import('./ModulePage').then(m => ({ default: m.ModulePage })))
const LessonPage         = lazy(() => import('./LessonPage').then(m => ({ default: m.LessonPage })))
const QuizPage           = lazy(() => import('./QuizPage').then(m => ({ default: m.QuizPage })))
const JournalPage        = lazy(() => import('./JournalPage').then(m => ({ default: m.JournalPage })))
const BibliothequePage   = lazy(() => import('./BibliothequePage').then(m => ({ default: m.BibliothequePage })))
const ChecklistPage      = lazy(() => import('./ChecklistPage').then(m => ({ default: m.ChecklistPage })))
const ProjectPage        = lazy(() => import('./ProjectPage').then(m => ({ default: m.ProjectPage })))
const ToolsPage          = lazy(() => import('./ToolsPage').then(m => ({ default: m.ToolsPage })))
const GeneratorHubPage   = lazy(() => import('./GeneratorHubPage').then(m => ({ default: m.GeneratorHubPage })))
const GeneratorIdeas     = lazy(() => import('./GeneratorIdeas').then(m => ({ default: m.GeneratorIdeas })))
const GeneratorValidate  = lazy(() => import('./GeneratorValidate').then(m => ({ default: m.GeneratorValidate })))
const GeneratorMRR       = lazy(() => import('./GeneratorMRR').then(m => ({ default: m.GeneratorMRR })))
const SettingsPage       = lazy(() => import('./SettingsPage').then(m => ({ default: m.SettingsPage })))
const AutopilotPage      = lazy(() => import('./AutopilotPage').then(m => ({ default: m.AutopilotPage })))
const OffresPage         = lazy(() => import('./OffresPage').then(m => ({ default: m.OffresPage })))

interface DashboardRoute {
  type: string
  moduleId?: string
  lessonId?: string
}

interface Props {
  route: DashboardRoute
  user: User
  navigate: (hash: string) => void
  isDark: boolean
  onToggleDark: () => void
  onSignOut: () => void
}

export function DashboardSection({ route, user, navigate, isDark, onToggleDark, onSignOut }: Props) {
  const { markComplete, isCompleted, moduleProgress, globalPercent } = useProgress(user.id)
  const { entries } = useJournal(user.id)

  const currentPath = window.location.hash

  const layoutProps = {
    currentPath,
    title: getTitle(route),
    navigate,
    isDark,
    onToggleDark,
    globalPercent: globalPercent(),
    moduleProgress,
    journalCount: entries.length,
    userEmail: user.email,
    userFirstName: user.user_metadata?.first_name,
    userAvatarUrl: user.user_metadata?.avatar_url,
    onSignOut,
  }

  const LazyFallback = (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <BouncingDots dots={3} />
    </div>
  )

  const W = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={LazyFallback}>{children}</Suspense>
  )

  if (route.type === 'autopilot' || route.type === 'dashboard') {
    return (
      <W>
        <DashboardLayout {...layoutProps}>
          <AutopilotPage
            navigate={navigate}
            userId={user.id}
            userFirstName={user.user_metadata?.first_name}
            moduleProgress={moduleProgress}
          />
        </DashboardLayout>
      </W>
    )
  }

  if (route.type === 'module' && route.moduleId) {
    return (
      <W><DashboardLayout {...layoutProps}>
        <ModulePage moduleId={route.moduleId} navigate={navigate} isCompleted={isCompleted} />
      </DashboardLayout></W>
    )
  }

  if (route.type === 'lesson' && route.moduleId && route.lessonId) {
    return (
      <W><DashboardLayout {...layoutProps}>
        <LessonPage moduleId={route.moduleId} lessonId={route.lessonId} navigate={navigate} isCompleted={isCompleted} markComplete={markComplete} />
      </DashboardLayout></W>
    )
  }

  if (route.type === 'quiz' && route.moduleId) {
    return (
      <W><DashboardLayout {...layoutProps}>
        <QuizPage moduleId={route.moduleId} navigate={navigate} />
      </DashboardLayout></W>
    )
  }

  if (route.type === 'journal') return (<W><DashboardLayout {...layoutProps}><JournalPage navigate={navigate} /></DashboardLayout></W>)
  if (route.type === 'library') return (<W><DashboardLayout {...layoutProps}><BibliothequePage navigate={navigate} /></DashboardLayout></W>)
  if (route.type === 'checklist') return (<W><DashboardLayout {...layoutProps}><ChecklistPage navigate={navigate} userId={user.id} /></DashboardLayout></W>)
  if (route.type === 'project' || route.type === 'ideas') return (<W><DashboardLayout {...layoutProps}><ProjectPage navigate={navigate} userId={user.id} /></DashboardLayout></W>)
  if (route.type === 'tools') return (<W><DashboardLayout {...layoutProps}><ToolsPage navigate={navigate} /></DashboardLayout></W>)
  if (route.type === 'gen-hub') return (<W><DashboardLayout {...layoutProps}><GeneratorHubPage navigate={navigate} /></DashboardLayout></W>)
  if (route.type === 'gen-ideas') return (<W><DashboardLayout {...layoutProps}><GeneratorIdeas navigate={navigate} /></DashboardLayout></W>)
  if (route.type === 'gen-validate') return (<W><DashboardLayout {...layoutProps}><GeneratorValidate navigate={navigate} userId={user.id} /></DashboardLayout></W>)
  if (route.type === 'gen-mrr') return (<W><DashboardLayout {...layoutProps}><GeneratorMRR navigate={navigate} /></DashboardLayout></W>)
  if (route.type === 'settings') return (<W><DashboardLayout {...layoutProps}><SettingsPage user={user} /></DashboardLayout></W>)
  if (route.type === 'offers') return (<W><DashboardLayout {...layoutProps}><OffresPage navigate={navigate} /></DashboardLayout></W>)

  return null
}

function getTitle(route: DashboardRoute): string {
  const titles: Record<string, string> = {
    dashboard: 'Mon parcours', autopilot: 'Jarvis IA',
    module: `Module ${route.moduleId ?? ''}`, lesson: 'Leçon', quiz: 'Quiz',
    journal: 'Journal de bord', library: 'Bibliothèque', checklist: 'Checklist',
    project: 'Mes Projets', tools: 'Outils', 'gen-hub': 'Plugins IA',
    'gen-ideas': 'NicheFinder', 'gen-validate': 'MarketPulse',
    'gen-mrr': 'FlipCalc', settings: 'Paramètres', offers: 'Nos Offres',
  }
  return titles[route.type] ?? 'Dashboard'
}
