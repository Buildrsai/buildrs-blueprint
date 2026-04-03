/**
 * DashboardSection — lazy-loaded component that owns the dashboard routing,
 * useProgress (→ curriculum.ts ~173KB), and useJournal hooks.
 *
 * By isolating these here, the main bundle (LP visitors) never loads curriculum.ts.
 */
import { lazy, Suspense, useEffect } from 'react'
import { BouncingDots } from '../ui/bouncing-dots'
import type { User } from '@supabase/supabase-js'
import { useProgress } from '../../hooks/useProgress'
import { useJournal } from '../../hooks/useJournal'
import { usePurchases } from '../../hooks/usePurchases'
import { useAccess } from '../../hooks/useAccess'
import { useContentProgress } from '../../hooks/useContentProgress'
import { useProfile } from '../../hooks/useProfile'
import { getModule } from '../../data/curriculum'
import { CLAUDE_CURRICULUM } from '../../data/claude-curriculum'

// Seuls les modules avec du vrai contenu (pas de stubs "Contenu a venir")
const CLAUDE_AI_IDS     = ['claude-1','claude-2','claude-3','claude-4','claude-7']
const CLAUDE_CODE_IDS   = ['claude-5']
const CLAUDE_COWORK_IDS = ['claude-6']
const CLAUDE_AI_MODULES     = CLAUDE_CURRICULUM.filter(m => CLAUDE_AI_IDS.includes(m.id))
const CLAUDE_CODE_MODULES   = CLAUDE_CURRICULUM.filter(m => CLAUDE_CODE_IDS.includes(m.id))
const CLAUDE_COWORK_MODULES = CLAUDE_CURRICULUM.filter(m => CLAUDE_COWORK_IDS.includes(m.id))
import { supabase } from '../../lib/supabase'

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
const SettingsPage       = lazy(() => import('./SettingsPage').then(m => ({ default: m.SettingsPage })))
const AutopilotPage      = lazy(() => import('./AutopilotPage').then(m => ({ default: m.AutopilotPage })))
const OffresPage         = lazy(() => import('./OffresPage').then(m => ({ default: m.OffresPage })))
const AgentsPage         = lazy(() => import('./AgentsPage').then(m => ({ default: m.AgentsPage })))
const AgentChatPage      = lazy(() => import('./AgentChatPage').then(m => ({ default: m.AgentChatPage })))
const ClaudeEnvPage      = lazy(() => import('./claude/ClaudeEnvPage').then(m => ({ default: m.ClaudeEnvPage })))
const ClaudeModulePage   = lazy(() => import('./claude/ClaudeModulePage').then(m => ({ default: m.ClaudeModulePage })))
const ClaudeLessonPage   = lazy(() => import('./claude/ClaudeLessonPage').then(m => ({ default: m.ClaudeLessonPage })))
const HomePage           = lazy(() => import('./HomePage').then(m => ({ default: m.HomePage })))
const KanbanPage         = lazy(() => import('./KanbanPage').then(m => ({ default: m.KanbanPage })))
const MarketplaceIdeasPage = lazy(() => import('./MarketplaceIdeasPage').then(m => ({ default: m.MarketplaceIdeasPage })))
const IdeaDetailPage     = lazy(() => import('./IdeaDetailPage').then(m => ({ default: m.IdeaDetailPage })))

const CommunityPage      = lazy(() => import('./CommunityPage').then(m => ({ default: m.CommunityPage })))
const MembersPage        = lazy(() => import('./MembersPage').then(m => ({ default: m.MembersPage })))
const TemplatesPage      = lazy(() => import('./TemplatesPage').then(m => ({ default: m.TemplatesPage })))
const CollaboratorsPage  = lazy(() => import('./CollaboratorsPage').then(m => ({ default: m.CollaboratorsPage })))
const NotificationsPage  = lazy(() => import('./NotificationsPage').then(m => ({ default: m.NotificationsPage })))

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
  const { purchases } = usePurchases(user.id)
  const access = useAccess(user, purchases)
  const { rows: contentRows, isBrickCompleted, markBrickComplete } = useContentProgress(user.id)
  const { profile, addXP } = useProfile(user.id)

  // XP-wrapped completion helpers
  const markCompleteWithXP = async (moduleId: string, lessonId: string) => {
    await markComplete(moduleId, lessonId)
    void addXP('bloc_complete')
  }
  const markBrickCompleteWithXP = async (id: string) => {
    await markBrickComplete(id)
    void addXP('brick_complete')
  }

  const { hasPack, hasClaudeCodeOb, hasClaudeCoworkOb } = access

  // Réconciliation legacy : si l'user a acheté le Pack Agents avant de s'inscrire,
  // la table `purchases` le contient — on met à jour user_metadata une fois
  useEffect(() => {
    if (hasPack) return
    const email = user.email
    if (!email) return
    ;(async () => {
      const { data } = await supabase
        .from('purchases')
        .select('id')
        .eq('email', email)
        .eq('product', 'agents_pack')
        .eq('applied', false)
        .limit(1)
        .maybeSingle()
      if (!data) return
      // Met à jour user_metadata + marque comme appliqué
      await supabase.auth.updateUser({ data: { has_agents_pack: true } })
      await supabase.from('purchases').update({ applied: true }).eq('id', data.id)
      // Recharge la session pour que hasPack soit true immédiatement
      await supabase.auth.refreshSession()
      window.location.reload()
    })()
  }, [user.id])

  // Réconciliation user_purchases : sync les metadata legacy vers la nouvelle table
  useEffect(() => {
    const meta = user.user_metadata ?? {}
    ;(async () => {
      const legacyMap: { flag: boolean; slug: string }[] = [
        { flag: !!meta.has_agents_pack,      slug: 'agents-ia'   },
        { flag: !!meta.has_claude_code_ob,   slug: 'claude-code' },
        { flag: !!meta.has_claude_cowork_ob, slug: 'claude-cowork' },
      ]
      for (const { flag, slug } of legacyMap) {
        if (!flag) continue
        // Vérifie si déjà dans user_purchases
        const { data } = await supabase
          .from('user_purchases')
          .select('id')
          .eq('user_id', user.id)
          .eq('product_slug', slug)
          .maybeSingle()
        if (data) continue
        // Insert si absent
        await supabase.from('user_purchases').insert({
          user_id:      user.id,
          product_slug: slug,
        })
      }
      // Blueprint inclus pour tout user authentifié
      const { data: bp } = await supabase
        .from('user_purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_slug', 'blueprint')
        .maybeSingle()
      if (!bp) {
        await supabase.from('user_purchases').insert({ user_id: user.id, product_slug: 'blueprint' })
      }
    })()
  }, [user.id])

  const mod01 = getModule('01')
  const module01Complete = mod01 ? moduleProgress('01', mod01.lessons.length) === 100 : false

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
    userId: user.id,
    onSignOut,
    hasPack,
    access,
    contentRows,
    profile,
  }

  const LazyFallback = (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <BouncingDots dots={3} />
    </div>
  )

  const W = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={LazyFallback}>{children}</Suspense>
  )

  if (route.type === 'home') {
    return (
      <W>
        <DashboardLayout {...layoutProps}>
          <HomePage
            navigate={navigate}
            userId={user.id}
            userFirstName={user.user_metadata?.first_name}
            globalPercent={globalPercent()}
            moduleProgress={moduleProgress}
            hasPack={hasPack}
            access={access}
            profile={profile}
          />
        </DashboardLayout>
      </W>
    )
  }

  if (route.type === 'autopilot' || route.type === 'dashboard') {
    return (
      <W>
        <DashboardLayout {...layoutProps}>
          <AutopilotPage
            navigate={navigate}
            userId={user.id}
            userFirstName={user.user_metadata?.first_name}
            moduleProgress={moduleProgress}
            hasPack={hasPack}
          />
        </DashboardLayout>
      </W>
    )
  }

  if (route.type === 'module' && route.moduleId) {
    return (
      <W><DashboardLayout {...layoutProps}>
        <ModulePage moduleId={route.moduleId} navigate={navigate} isCompleted={isCompleted} hasPack={hasPack} />
      </DashboardLayout></W>
    )
  }

  if (route.type === 'lesson' && route.moduleId && route.lessonId) {
    return (
      <W><DashboardLayout {...layoutProps}>
        <LessonPage moduleId={route.moduleId} lessonId={route.lessonId} navigate={navigate} isCompleted={isCompleted} markComplete={markCompleteWithXP} hasPack={hasPack} module01Complete={module01Complete} />
      </DashboardLayout></W>
    )
  }

  if (route.type === 'quiz' && route.moduleId) {
    return (
      <W><DashboardLayout {...layoutProps}>
        <QuizPage moduleId={route.moduleId} navigate={navigate} hasPack={hasPack} module01Complete={module01Complete} />
      </DashboardLayout></W>
    )
  }

  if (route.type === 'journal') return (<W><DashboardLayout {...layoutProps}><JournalPage navigate={navigate} /></DashboardLayout></W>)
  if (route.type === 'library') return (<W><DashboardLayout {...layoutProps}><BibliothequePage navigate={navigate} /></DashboardLayout></W>)
  if (route.type === 'checklist') return (<W><DashboardLayout {...layoutProps}><ChecklistPage navigate={navigate} userId={user.id} /></DashboardLayout></W>)
  if (route.type === 'project' || route.type === 'ideas') return (<W><DashboardLayout {...layoutProps}><ProjectPage navigate={navigate} userId={user.id} /></DashboardLayout></W>)
  if (route.type === 'tools') return (<W><DashboardLayout {...layoutProps}><ToolsPage navigate={navigate} /></DashboardLayout></W>)
  if (route.type === 'settings') return (<W><DashboardLayout {...layoutProps}><SettingsPage user={user} /></DashboardLayout></W>)
  if (route.type === 'offers') return (<W><DashboardLayout {...layoutProps}><OffresPage navigate={navigate} hasPack={hasPack} /></DashboardLayout></W>)
  if (route.type === 'agents') return (<W><DashboardLayout {...layoutProps}><AgentsPage navigate={navigate} hasPack={hasPack} /></DashboardLayout></W>)
  if (route.type === 'agent-chat' && route.moduleId) return (<W><DashboardLayout {...layoutProps}><AgentChatPage agentId={route.moduleId} navigate={navigate} userId={user.id} hasPack={hasPack} /></DashboardLayout></W>)

  // Claude — pages modules et lecons
  if (route.type === 'claude-module' && route.moduleId) {
    const parentRoute = CLAUDE_CODE_IDS.includes(route.moduleId) ? '#/dashboard/claude/code'
      : CLAUDE_COWORK_IDS.includes(route.moduleId) ? '#/dashboard/claude/cowork'
      : '#/dashboard/claude/ai'
    return (<W><DashboardLayout {...layoutProps}><ClaudeModulePage modId={route.moduleId} navigate={navigate} isCompleted={isCompleted} moduleProgress={moduleProgress} parentRoute={parentRoute} /></DashboardLayout></W>)
  }
  if (route.type === 'claude-lesson' && route.moduleId && route.lessonId) {
    const parentRoute = CLAUDE_CODE_IDS.includes(route.moduleId) ? '#/dashboard/claude/code'
      : CLAUDE_COWORK_IDS.includes(route.moduleId) ? '#/dashboard/claude/cowork'
      : '#/dashboard/claude/ai'
    return (<W><DashboardLayout {...layoutProps}><ClaudeLessonPage modId={route.moduleId} lessonId={route.lessonId} navigate={navigate} isCompleted={isCompleted} markComplete={markCompleteWithXP} hasClaudeCodeOb={hasClaudeCodeOb} hasClaudeCoworkOb={hasClaudeCoworkOb} parentRoute={parentRoute} /></DashboardLayout></W>)
  }

  // V2 routes
  if (route.type === 'kanban') return (<W><DashboardLayout {...layoutProps}><KanbanPage userId={user.id} navigate={navigate} hasPack={hasPack} onMilestoneDone={() => void addXP('milestone_done')} /></DashboardLayout></W>)
  if (route.type === 'marketplace') return (<W><DashboardLayout {...layoutProps}><MarketplaceIdeasPage userId={user.id} navigate={navigate} /></DashboardLayout></W>)
  if (route.type === 'idea-detail' && route.moduleId) return (<W><DashboardLayout {...layoutProps}><IdeaDetailPage slug={route.moduleId} userId={user.id} navigate={navigate} /></DashboardLayout></W>)

  if (route.type === 'community') return (<W><DashboardLayout {...layoutProps}><CommunityPage userId={user.id} navigate={navigate} onPost={() => void addXP('community_post')} /></DashboardLayout></W>)
  if (route.type === 'members') return (<W><DashboardLayout {...layoutProps}><MembersPage navigate={navigate} /></DashboardLayout></W>)
  if (route.type === 'templates') return (<W><DashboardLayout {...layoutProps}><TemplatesPage navigate={navigate} /></DashboardLayout></W>)
  if (route.type === 'collaborators') return (<W><DashboardLayout {...layoutProps}><CollaboratorsPage userId={user.id} navigate={navigate} /></DashboardLayout></W>)
  if (route.type === 'notifications') return (<W><DashboardLayout {...layoutProps}><NotificationsPage userId={user.id} navigate={navigate} /></DashboardLayout></W>)

  // Environnement Claude — 3 pages dédiées
  if (route.type === 'claude-ai') return (
    <W><DashboardLayout {...layoutProps}>
      <ClaudeEnvPage
        config={{ title: 'Claude AI', subtitle: 'Configurer Claude comme un outil de création de SaaS IA de pointe.', accentColor: '#cc5de8', leftTitle: 'Configurer mon environnement Claude', modules: CLAUDE_AI_MODULES }}
        navigate={navigate} isCompleted={isCompleted} moduleProgress={moduleProgress} isUnlocked={hasClaudeCodeOb}
      />
    </DashboardLayout></W>
  )
  if (route.type === 'claude-code') return (
    <W><DashboardLayout {...layoutProps}>
      <ClaudeEnvPage
        config={{ title: 'Claude Code', subtitle: 'Installer et configurer Claude Code pour builder des produits en mode pro.', accentColor: '#4d96ff', leftTitle: 'Configurer mon environnement Claude Code', modules: CLAUDE_CODE_MODULES }}
        navigate={navigate} isCompleted={isCompleted} moduleProgress={moduleProgress} isUnlocked={hasClaudeCodeOb}
      />
    </DashboardLayout></W>
  )
  if (route.type === 'claude-cowork') return (
    <W><DashboardLayout {...layoutProps}>
      <ClaudeEnvPage
        config={{ title: 'Claude Cowork', subtitle: 'Installer mes 5 workflows autonomes pour faire tourner Claude en pilote auto.', accentColor: '#14b8a6', leftTitle: 'Configurer mes agents Cowork autonomes', modules: CLAUDE_COWORK_MODULES }}
        navigate={navigate} isCompleted={isCompleted} moduleProgress={moduleProgress} isUnlocked={hasClaudeCoworkOb}
      />
    </DashboardLayout></W>
  )

  return null
}

function getTitle(route: DashboardRoute): string {
  const titles: Record<string, string> = {
    home: 'Accueil', dashboard: 'Mon parcours', autopilot: 'Jarvis IA',
    module: `Module ${route.moduleId ?? ''}`, lesson: 'Leçon', quiz: 'Quiz',
    journal: 'Journal de bord', library: 'Bibliothèque', checklist: 'Checklist',
    project: 'Mes Projets', tools: 'Outils',
    settings: 'Paramètres', offers: 'Nos Offres', agents: 'Mes agents IA',
    'agent-chat': 'Agent IA',
    'claude-module': 'Claude 360°',
    'claude-lesson': 'Claude 360°',
    'kanban': 'Mon Pipeline', 'marketplace': 'Idees SaaS',
    'idea-detail': 'Idee SaaS',
    'community': 'Communaute', 'members': 'Membres',
    'templates': 'Templates',
    'collaborators': 'Collaborateurs',
    'notifications': 'Notifications',
    'claude-ai': 'Claude AI', 'claude-code': 'Claude Code', 'claude-cowork': 'Claude Cowork',
  }
  return titles[route.type] ?? 'Dashboard'
}
