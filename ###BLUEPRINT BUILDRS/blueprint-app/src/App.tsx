import { useState, useEffect } from 'react'
import './index.css'
import { trackEvent } from './lib/pixel'
import { phCapture, phIdentify, phPageview, phReset } from './lib/posthog'

declare function fbq(event: string, name: string, params?: Record<string, unknown>): void

// Legal pages
import { MentionsLegales } from './components/legal/MentionsLegales'
import { CGV } from './components/legal/CGV'
import { Confidentialite } from './components/legal/Confidentialite'
import { Cookies } from './components/legal/Cookies'

// Landing funnel pages
import { LandingPage } from './components/LandingPage'
import { CheckoutPage } from './components/CheckoutPage'
import { UpsellCohortPage } from './components/UpsellCohortPage'
import { CohorteCheckoutPage } from './components/CohorteCheckoutPage'

// Auth pages
import { SignupPage } from './components/auth/SignupPage'
import { SigninPage } from './components/auth/SigninPage'

// Onboarding
import { OnboardingPage } from './components/onboarding/OnboardingPage'

// Dashboard
import { DashboardLayout } from './components/dashboard/DashboardLayout'
import { ModulePage } from './components/dashboard/ModulePage'
import { LessonPage } from './components/dashboard/LessonPage'
import { QuizPage } from './components/dashboard/QuizPage'
import { JournalPage } from './components/dashboard/JournalPage'
import { BibliothequePage } from './components/dashboard/BibliothequePage'
import { IdeasPage } from './components/dashboard/IdeasPage'
import { ChecklistPage } from './components/dashboard/ChecklistPage'
import { ProjectPage } from './components/dashboard/ProjectPage'
import { ToolsPage } from './components/dashboard/ToolsPage'
import { GeneratorHubPage } from './components/dashboard/GeneratorHubPage'
import { GeneratorIdeas } from './components/dashboard/GeneratorIdeas'
import { GeneratorValidate } from './components/dashboard/GeneratorValidate'
import { GeneratorMRR } from './components/dashboard/GeneratorMRR'
import { SettingsPage } from './components/dashboard/SettingsPage'
import { AutopilotPage } from './components/dashboard/AutopilotPage'
import { OffresPage } from './components/dashboard/OffresPage'

// Hooks
import { useAuth } from './hooks/useAuth'
import { useOnboarding } from './hooks/useOnboarding'
import { useProgress } from './hooks/useProgress'
import { useJournal } from './hooks/useJournal'

// Curriculum
import { CURRICULUM } from './data/curriculum'

// ---------------------------------------------------------------------------
// Confirmation page — fires Meta Pixel Purchase on mount
// ---------------------------------------------------------------------------

function ConfirmationPage({ onNavigate }: { onNavigate: () => void }) {
  useEffect(() => {
    const isOrderBump = window.location.hash.includes('bump=1')
    trackEvent('Purchase', { value: isOrderBump ? 64 : 27, currency: 'EUR', num_items: 1 })
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8 text-center">
      <div className="max-w-lg">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid #22c55e' }}
        >
          <span className="text-2xl font-bold" style={{ color: '#22c55e' }}>✓</span>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Buildrs Blueprint
        </p>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-3">
          Bienvenue chez Buildrs.
        </h1>
        <p className="text-muted-foreground text-sm mb-2 leading-relaxed">
          Ton accès est prêt.
        </p>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          Crée ton compte pour accéder à ton dashboard<br />et démarrer ton parcours maintenant.
        </p>
        <button
          onClick={onNavigate}
          className="bg-foreground text-background rounded-xl px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Créer mon compte →
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Hash parser
// ---------------------------------------------------------------------------
interface ParsedRoute {
  type:
    | 'landing'
    | 'checkout'
    | 'upsell-cohort'
    | 'confirmation'
    | 'signup'
    | 'signin'
    | 'onboarding'
    | 'dashboard'
    | 'module'
    | 'lesson'
    | 'quiz'
    | 'journal'
    | 'library'
    | 'ideas'
    | 'checklist'
    | 'project'
    | 'tools'
    | 'gen-hub'
    | 'gen-ideas'
    | 'gen-validate'
    | 'gen-mrr'
    | 'checkout-cohorte'
    | 'settings'
    | 'autopilot'
    | 'offers'
    | 'legal-mentions'
    | 'legal-cgv'
    | 'legal-confidentialite'
    | 'legal-cookies'
  moduleId?: string
  lessonId?: string
}

function parseHash(hash: string): ParsedRoute {
  const h = hash.replace(/^#\/?/, '')
  if (!h || h === 'landing' || h === '/') return { type: 'landing' }
  if (h === 'legal/mentions') return { type: 'legal-mentions' }
  if (h === 'legal/cgv') return { type: 'legal-cgv' }
  if (h === 'legal/confidentialite') return { type: 'legal-confidentialite' }
  if (h === 'legal/cookies') return { type: 'legal-cookies' }
  if (h === 'checkout') return { type: 'checkout' }
  if (h === 'upsell-cohort' || h.startsWith('upsell-cohort?')) return { type: 'upsell-cohort' }
  if (h === 'confirmation' || h.startsWith('confirmation?')) return { type: 'confirmation' }
  if (h === 'signup') return { type: 'signup' }
  if (h === 'signin') return { type: 'signin' }
  if (h === 'onboarding') return { type: 'onboarding' }
  if (h === 'dashboard') return { type: 'dashboard' }
  if (h === 'dashboard/journal') return { type: 'journal' }
  if (h === 'dashboard/library') return { type: 'library' }
  if (h === 'dashboard/ideas') return { type: 'ideas' }
  if (h === 'dashboard/checklist') return { type: 'checklist' }
  if (h === 'dashboard/project') return { type: 'project' }
  if (h === 'dashboard/tools') return { type: 'tools' }
  if (h === 'dashboard/generator') return { type: 'gen-hub' }
  if (h === 'dashboard/generator/ideas') return { type: 'gen-ideas' }
  if (h === 'dashboard/generator/validate') return { type: 'gen-validate' }
  if (h === 'dashboard/generator/mrr') return { type: 'gen-mrr' }
  if (h === 'checkout-cohorte') return { type: 'checkout-cohorte' }
  if (h === 'dashboard/settings') return { type: 'settings' }
  if (h === 'dashboard/autopilot') return { type: 'autopilot' }
  if (h === 'dashboard/offers') return { type: 'offers' }

  // /dashboard/quiz/:moduleId
  const quizMatch = h.match(/^dashboard\/quiz\/([^/]+)$/)
  if (quizMatch) return { type: 'quiz', moduleId: quizMatch[1] }

  // /dashboard/module/:moduleId/lesson/:lessonId
  const lessonMatch = h.match(/^dashboard\/module\/([^/]+)\/lesson\/([^/]+)$/)
  if (lessonMatch) return { type: 'lesson', moduleId: lessonMatch[1], lessonId: lessonMatch[2] }

  // /dashboard/module/:moduleId
  const moduleMatch = h.match(/^dashboard\/module\/([^/]+)$/)
  if (moduleMatch) return { type: 'module', moduleId: moduleMatch[1] }

  return { type: 'landing' }
}

// ---------------------------------------------------------------------------
// Title helper
// ---------------------------------------------------------------------------
function getTitle(route: ParsedRoute): string {
  if (route.type === 'dashboard') return 'Mon parcours'
  if (route.type === 'module') {
    const mod = CURRICULUM.find(m => m.id === route.moduleId)
    return mod ? `Module ${mod.id} — ${mod.title}` : 'Module'
  }
  if (route.type === 'lesson') {
    const mod = CURRICULUM.find(m => m.id === route.moduleId)
    const lesson = mod?.lessons.find(l => l.id === route.lessonId)
    return lesson?.title ?? 'Leçon'
  }
  if (route.type === 'quiz') return 'Quiz'
  if (route.type === 'journal') return 'Journal de bord'
  if (route.type === 'library') return 'Bibliothèque'
  if (route.type === 'ideas') return 'Mes Idées'
  if (route.type === 'checklist') return 'Checklist'
  if (route.type === 'project') return 'Mes Projets'
  if (route.type === 'tools') return 'Outils'
  if (route.type === 'gen-hub') return 'Outils IA'
  if (route.type === 'gen-ideas') return 'Générateur — Idées'
  if (route.type === 'gen-validate') return 'Validation de SaaS'
  if (route.type === 'gen-mrr') return 'Calculateur MRR'
  if (route.type === 'settings') return 'Paramètres'
  if (route.type === 'autopilot') return 'Autopilot IA'
  if (route.type === 'offers') return 'Nos Offres'
  return 'Dashboard'
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
function App() {
  const [route, setRoute] = useState<ParsedRoute>(parseHash(window.location.hash))
  const [isDark, setIsDark] = useState(true)
  const [hasOrderBump, setHasOrderBump] = useState(false)

  // Handle Supabase auth redirects (OAuth code, email confirmation token_hash)
  // These arrive as query params on the root URL (no hash), redirect to signup
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const hasAuthParams = params.has('code') || params.has('token_hash') || params.has('access_token')
    if (hasAuthParams && !window.location.hash) {
      // Clean the URL and send to signup — Supabase JS handles the session automatically
      window.history.replaceState({}, '', window.location.pathname)
      window.location.hash = '/signup'
    }
  }, [])

  // Auth + data hooks (single source of truth)
  const { user, loading: authLoading, signOut } = useAuth()
  const { data: onboarding, loading: onboardingLoading, save: saveOnboarding, complete: completeOnboarding } = useOnboarding(user?.id)
  const { markComplete, isCompleted, moduleProgress, globalPercent } = useProgress(user?.id)
  const { entries } = useJournal(user?.id)

  // Hash routing
  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHash(window.location.hash))
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (hash: string) => {
    window.location.hash = hash.replace(/^#/, '')
    window.scrollTo(0, 0)
  }

  // PostHog — identify user on auth
  useEffect(() => {
    if (user) {
      phIdentify(user.id, {
        email: user.email,
        first_name: user.user_metadata?.first_name,
        created_at: user.created_at,
      })
    } else {
      phReset()
    }
  }, [user?.id])

  // Meta Pixel + PostHog — fire events on route change
  useEffect(() => {
    phPageview(route.type)
    if (route.type === 'landing') {
      trackEvent('ViewContent', { content_name: 'Buildrs Blueprint', currency: 'EUR', value: 27 })
      phCapture('landing_viewed')
    }
    if (route.type === 'checkout') phCapture('checkout_started')
    if (route.type === 'upsell-cohort') phCapture('upsell_viewed')
    if (route.type === 'confirmation') phCapture('purchase_confirmed')
    if (route.type === 'signup') phCapture('signup_page_viewed')
    if (route.type === 'onboarding') phCapture('onboarding_started')
    if (route.type === 'dashboard') phCapture('dashboard_visited')
    // Purchase is fired in ConfirmationPage on mount (has access to bump flag)
  }, [route.type])

  // Apply dark class on mount + on change
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  // Dark mode sync
  const handleToggleDark = () => {
    setIsDark(prev => !prev)
  }

  // ---------------------------------------------------------------------------
  // Legal routes (public — no auth required)
  // ---------------------------------------------------------------------------
  if (route.type === 'legal-mentions') return <MentionsLegales />
  if (route.type === 'legal-cgv') return <CGV />
  if (route.type === 'legal-confidentialite') return <Confidentialite />
  if (route.type === 'legal-cookies') return <Cookies />

  // Loading state
  if (authLoading || onboardingLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Landing funnel routes (no auth required)
  // ---------------------------------------------------------------------------
  if (route.type === 'landing') {
    return <LandingPage onCTAClick={() => navigate('#/checkout')} />
  }
  if (route.type === 'checkout') {
    return (
      <CheckoutPage
        hasOrderBump={hasOrderBump}
        setHasOrderBump={setHasOrderBump}
        onPay={() => navigate('#/upsell-cohort')}
        onBack={() => navigate('#/landing')}
      />
    )
  }
  if (route.type === 'checkout-cohorte') {
    return <CohorteCheckoutPage onBack={() => navigate('#/dashboard')} />
  }
  if (route.type === 'upsell-cohort') {
    return (
      <UpsellCohortPage
        onDecline={() => navigate('#/confirmation')}
      />
    )
  }
  if (route.type === 'confirmation') {
    return <ConfirmationPage onNavigate={() => navigate('#/signup')} />
  }

  // ---------------------------------------------------------------------------
  // Auth routes
  // ---------------------------------------------------------------------------
  if (route.type === 'signup') {
    if (user) {
      // Already logged in — go to dashboard or onboarding
      navigate(onboarding.onboarding_completed ? '#/dashboard' : '#/onboarding')
      return null
    }
    return (
      <SignupPage
        onSwitchToSignin={() => navigate('#/signin')}
        onSuccess={() => navigate('#/onboarding')}
      />
    )
  }
  if (route.type === 'signin') {
    if (user) {
      navigate(onboarding.onboarding_completed ? '#/dashboard' : '#/onboarding')
      return null
    }
    return (
      <SigninPage
        onSwitchToSignup={() => navigate('#/signup')}
        onSuccess={() => navigate(onboarding.onboarding_completed ? '#/dashboard' : '#/onboarding')}
      />
    )
  }

  // ---------------------------------------------------------------------------
  // Onboarding
  // ---------------------------------------------------------------------------
  if (route.type === 'onboarding') {
    if (!user) { navigate('#/signup'); return null }
    if (onboarding.onboarding_completed) { navigate('#/dashboard'); return null }
    return (
      <OnboardingPage
        userId={user.id}
        onComplete={() => navigate('#/dashboard')}
        onSignOut={signOut}
        save={saveOnboarding}
        complete={completeOnboarding}
      />
    )
  }

  // ---------------------------------------------------------------------------
  // Dashboard routes — all require auth + onboarding
  // ---------------------------------------------------------------------------
  const isDashboardRoute = ['dashboard', 'module', 'lesson', 'quiz', 'journal', 'library', 'ideas', 'checklist', 'project', 'tools', 'gen-hub', 'gen-ideas', 'gen-validate', 'gen-mrr', 'settings', 'autopilot', 'offers'].includes(route.type)

  if (isDashboardRoute) {
    if (!user) { navigate('#/signin'); return null }
    if (!onboarding.onboarding_completed) { navigate('#/onboarding'); return null }

    const title = getTitle(route)
    const currentPath = window.location.hash

    const layoutProps = {
      currentPath,
      title,
      navigate,
      isDark,
      onToggleDark: handleToggleDark,
      globalPercent: globalPercent(),
      moduleProgress,
      journalCount: entries.length,
      userEmail: user?.email,
      userFirstName: user?.user_metadata?.first_name,
      userAvatarUrl: user?.user_metadata?.avatar_url,
      onSignOut: signOut,
    }

    if (route.type === 'autopilot' || route.type === 'dashboard') {
      return (
        <DashboardLayout {...layoutProps}>
          <AutopilotPage
            navigate={navigate}
            userId={user?.id}
            userFirstName={user?.user_metadata?.first_name}
            moduleProgress={moduleProgress}
          />
        </DashboardLayout>
      )
    }

    if (route.type === 'module' && route.moduleId) {
      return (
        <DashboardLayout {...layoutProps}>
          <ModulePage
            moduleId={route.moduleId}
            navigate={navigate}
            isCompleted={isCompleted}
          />
        </DashboardLayout>
      )
    }

    if (route.type === 'lesson' && route.moduleId && route.lessonId) {
      return (
        <DashboardLayout {...layoutProps}>
          <LessonPage
            moduleId={route.moduleId}
            lessonId={route.lessonId}
            navigate={navigate}
            isCompleted={isCompleted}
            markComplete={markComplete}
          />
        </DashboardLayout>
      )
    }

    if (route.type === 'quiz' && route.moduleId) {
      return (
        <DashboardLayout {...layoutProps}>
          <QuizPage
            moduleId={route.moduleId}
            navigate={navigate}
          />
        </DashboardLayout>
      )
    }

    if (route.type === 'journal') {
      return (
        <DashboardLayout {...layoutProps}>
          <JournalPage navigate={navigate} />
        </DashboardLayout>
      )
    }

    if (route.type === 'library') {
      return (
        <DashboardLayout {...layoutProps}>
          <BibliothequePage navigate={navigate} />
        </DashboardLayout>
      )
    }

    if (route.type === 'ideas') {
      return (
        <DashboardLayout {...layoutProps}>
          <IdeasPage navigate={navigate} userId={user?.id} />
        </DashboardLayout>
      )
    }

    if (route.type === 'checklist') {
      return (
        <DashboardLayout {...layoutProps}>
          <ChecklistPage navigate={navigate} userId={user?.id} />
        </DashboardLayout>
      )
    }

    if (route.type === 'project') {
      return (
        <DashboardLayout {...layoutProps}>
          <ProjectPage navigate={navigate} userId={user?.id} />
        </DashboardLayout>
      )
    }

    if (route.type === 'tools') {
      return (
        <DashboardLayout {...layoutProps}>
          <ToolsPage navigate={navigate} />
        </DashboardLayout>
      )
    }

    if (route.type === 'gen-hub') {
      return (
        <DashboardLayout {...layoutProps}>
          <GeneratorHubPage navigate={navigate} />
        </DashboardLayout>
      )
    }

    if (route.type === 'gen-ideas') {
      return (
        <DashboardLayout {...layoutProps}>
          <GeneratorIdeas navigate={navigate} />
        </DashboardLayout>
      )
    }

    if (route.type === 'gen-validate') {
      return (
        <DashboardLayout {...layoutProps}>
          <GeneratorValidate navigate={navigate} />
        </DashboardLayout>
      )
    }

    if (route.type === 'gen-mrr') {
      return (
        <DashboardLayout {...layoutProps}>
          <GeneratorMRR navigate={navigate} />
        </DashboardLayout>
      )
    }

    if (route.type === 'settings') {
      return (
        <DashboardLayout {...layoutProps}>
          <SettingsPage user={user ?? null} />
        </DashboardLayout>
      )
    }

    if (route.type === 'offers') {
      return (
        <DashboardLayout {...layoutProps}>
          <OffresPage navigate={navigate} />
        </DashboardLayout>
      )
    }
  }

  // Fallback — should not happen
  return <LandingPage onCTAClick={() => navigate('#/checkout')} />
}

export default App
