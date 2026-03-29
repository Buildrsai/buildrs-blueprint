import { useState, useEffect, lazy, Suspense } from 'react'
import './index.css'
import { trackEvent } from './lib/pixel'
import { BouncingDots } from './components/ui/bouncing-dots'

declare function fbq(event: string, name: string, params?: Record<string, unknown>): void

// ── Eager imports (primary route — must render immediately) ──────────────────
import { LandingPage } from './components/LandingPage'

// Hooks (lightweight — auth state needed before any route renders)
import { useAuth } from './hooks/useAuth'
import { useOnboarding } from './hooks/useOnboarding'

// ── Lazy imports (split into separate chunks — not needed on LP) ─────────────
const CheckoutPage        = lazy(() => import('./components/CheckoutPage').then(m => ({ default: m.CheckoutPage })))
const UpsellCohortPage    = lazy(() => import('./components/UpsellCohortPage').then(m => ({ default: m.UpsellCohortPage })))
const CohorteCheckoutPage = lazy(() => import('./components/CohorteCheckoutPage').then(m => ({ default: m.CohorteCheckoutPage })))
const SignupPage           = lazy(() => import('./components/auth/SignupPage').then(m => ({ default: m.SignupPage })))
const SigninPage           = lazy(() => import('./components/auth/SigninPage').then(m => ({ default: m.SigninPage })))
const OnboardingPage      = lazy(() => import('./components/onboarding/OnboardingPage').then(m => ({ default: m.OnboardingPage })))
const DashboardSection    = lazy(() => import('./components/dashboard/DashboardSection').then(m => ({ default: m.DashboardSection })))

// Legal pages (rarely visited — lazy)
const MentionsLegales  = lazy(() => import('./components/legal/MentionsLegales').then(m => ({ default: m.MentionsLegales })))
const CGV              = lazy(() => import('./components/legal/CGV').then(m => ({ default: m.CGV })))
const Confidentialite  = lazy(() => import('./components/legal/Confidentialite').then(m => ({ default: m.Confidentialite })))
const Cookies          = lazy(() => import('./components/legal/Cookies').then(m => ({ default: m.Cookies })))

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
    | 'agents'
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
  if (h === 'dashboard/agents') return { type: 'agents' }

  const quizMatch = h.match(/^dashboard\/quiz\/([^/]+)$/)
  if (quizMatch) return { type: 'quiz', moduleId: quizMatch[1] }

  const lessonMatch = h.match(/^dashboard\/module\/([^/]+)\/lesson\/([^/]+)$/)
  if (lessonMatch) return { type: 'lesson', moduleId: lessonMatch[1], lessonId: lessonMatch[2] }

  const moduleMatch = h.match(/^dashboard\/module\/([^/]+)$/)
  if (moduleMatch) return { type: 'module', moduleId: moduleMatch[1] }

  return { type: 'landing' }
}

// ---------------------------------------------------------------------------
// Spinner fallback
// ---------------------------------------------------------------------------
const SpinnerFallback = (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <BouncingDots dots={3} />
  </div>
)

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
function App() {
  const [route, setRoute] = useState<ParsedRoute>(parseHash(window.location.hash))
  const [isDark, setIsDark] = useState(true)
  const [hasOrderBump, setHasOrderBump] = useState(false)

  // Handle Supabase auth redirects (OAuth code, email confirmation token_hash)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const hasAuthParams = params.has('code') || params.has('token_hash') || params.has('access_token')
    if (hasAuthParams && !window.location.hash) {
      window.history.replaceState({}, '', window.location.pathname)
      window.location.hash = '/signup'
    }
  }, [])

  // Auth + onboarding (lightweight — needed before routing)
  const { user, loading: authLoading, signOut } = useAuth()
  const { data: onboarding, loading: onboardingLoading, save: saveOnboarding, complete: completeOnboarding } = useOnboarding(user?.id)

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

  // Meta Pixel — deferred to avoid blocking critical path
  useEffect(() => {
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback
      ?? ((cb: () => void) => setTimeout(cb, 3000))
    if (route.type === 'landing') {
      idle(() => trackEvent('ViewContent', { content_name: 'Buildrs Blueprint', currency: 'EUR', value: 27 }))
    }
  }, [route.type])

  // Apply dark class on mount + on change
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const handleToggleDark = () => setIsDark(prev => !prev)

  // ---------------------------------------------------------------------------
  // Legal routes (lazy — public, rarely visited)
  // ---------------------------------------------------------------------------
  if (route.type === 'legal-mentions') return <Suspense fallback={SpinnerFallback}><MentionsLegales /></Suspense>
  if (route.type === 'legal-cgv') return <Suspense fallback={SpinnerFallback}><CGV /></Suspense>
  if (route.type === 'legal-confidentialite') return <Suspense fallback={SpinnerFallback}><Confidentialite /></Suspense>
  if (route.type === 'legal-cookies') return <Suspense fallback={SpinnerFallback}><Cookies /></Suspense>

  // Auth loading state
  if (authLoading || onboardingLoading) return SpinnerFallback

  // ---------------------------------------------------------------------------
  // Landing (eager — primary route)
  // ---------------------------------------------------------------------------
  if (route.type === 'landing') {
    return <LandingPage onCTAClick={() => navigate('#/checkout')} />
  }

  // ---------------------------------------------------------------------------
  // Funnel routes (lazy)
  // ---------------------------------------------------------------------------
  if (route.type === 'checkout') {
    return (
      <Suspense fallback={SpinnerFallback}>
        <CheckoutPage
          hasOrderBump={hasOrderBump}
          setHasOrderBump={setHasOrderBump}
          onPay={() => navigate('#/upsell-cohort')}
          onBack={() => navigate('#/landing')}
        />
      </Suspense>
    )
  }
  if (route.type === 'checkout-cohorte') {
    return <Suspense fallback={SpinnerFallback}><CohorteCheckoutPage onBack={() => navigate('#/dashboard')} /></Suspense>
  }
  if (route.type === 'upsell-cohort') {
    return <Suspense fallback={SpinnerFallback}><UpsellCohortPage onDecline={() => navigate('#/confirmation')} /></Suspense>
  }
  if (route.type === 'confirmation') {
    return <ConfirmationPage onNavigate={() => navigate('#/signup')} />
  }

  // ---------------------------------------------------------------------------
  // Auth routes (lazy)
  // ---------------------------------------------------------------------------
  if (route.type === 'signup') {
    if (user) {
      navigate(onboarding.onboarding_completed ? '#/dashboard' : '#/onboarding')
      return null
    }
    return (
      <Suspense fallback={SpinnerFallback}>
        <SignupPage
          onSwitchToSignin={() => navigate('#/signin')}
          onSuccess={() => navigate('#/onboarding')}
        />
      </Suspense>
    )
  }
  if (route.type === 'signin') {
    if (user) {
      navigate(onboarding.onboarding_completed ? '#/dashboard' : '#/onboarding')
      return null
    }
    return (
      <Suspense fallback={SpinnerFallback}>
        <SigninPage
          onSwitchToSignup={() => navigate('#/signup')}
          onSuccess={() => navigate(onboarding.onboarding_completed ? '#/dashboard' : '#/onboarding')}
        />
      </Suspense>
    )
  }

  // ---------------------------------------------------------------------------
  // Onboarding (lazy)
  // ---------------------------------------------------------------------------
  if (route.type === 'onboarding') {
    if (!user) { navigate('#/signup'); return null }
    if (onboarding.onboarding_completed) { navigate('#/dashboard'); return null }
    return (
      <Suspense fallback={SpinnerFallback}>
        <OnboardingPage
          userId={user.id}
          onComplete={() => navigate('#/dashboard')}
          onSignOut={signOut}
          save={saveOnboarding}
          complete={completeOnboarding}
        />
      </Suspense>
    )
  }

  // ---------------------------------------------------------------------------
  // Dashboard routes — lazy via DashboardSection (isolates curriculum + hooks)
  // ---------------------------------------------------------------------------
  const isDashboardRoute = ['dashboard', 'module', 'lesson', 'quiz', 'journal', 'library', 'ideas', 'checklist', 'project', 'tools', 'gen-hub', 'gen-ideas', 'gen-validate', 'gen-mrr', 'settings', 'autopilot', 'offers', 'agents'].includes(route.type)

  if (isDashboardRoute) {
    if (!user) { navigate('#/signin'); return null }
    if (!onboarding.onboarding_completed) { navigate('#/onboarding'); return null }

    return (
      <Suspense fallback={SpinnerFallback}>
        <DashboardSection
          route={route}
          user={user}
          navigate={navigate}
          isDark={isDark}
          onToggleDark={handleToggleDark}
          onSignOut={signOut}
        />
      </Suspense>
    )
  }

  // Fallback
  return <LandingPage onCTAClick={() => navigate('#/checkout')} />
}

export default App
