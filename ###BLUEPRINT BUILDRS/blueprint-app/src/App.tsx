import { useState, useEffect, lazy, Suspense } from 'react'
import './index.css'
import { trackEvent } from './lib/pixel'
import { BLUEPRINT_PRICE } from './lib/pricing'
import { BouncingDots } from './components/ui/bouncing-dots'
import { Check } from 'lucide-react'

declare function fbq(event: string, name: string, params?: Record<string, unknown>): void

// ── Eager imports (primary route — must render immediately) ──────────────────
import { LandingPage } from './components/LandingPage'

// Hooks (lightweight — auth state needed before any route renders)
import { useAuth } from './hooks/useAuth'
import { useOnboarding } from './hooks/useOnboarding'

// ── Ads preview (dev only — lazy) ────────────────────────────────────────────
const AdsPreviewPage  = lazy(() => import('./components/ads/AdsPreviewPage').then(m => ({ default: m.AdsPreviewPage })))
const AdFullscreenA   = lazy(() => import('./components/ads/AdsPreviewPage').then(m => ({ default: m.AdFullscreenA })))
const AdFullscreenB   = lazy(() => import('./components/ads/AdsPreviewPage').then(m => ({ default: m.AdFullscreenB })))
const AdFullscreenC   = lazy(() => import('./components/ads/AdsPreviewPage').then(m => ({ default: m.AdFullscreenC })))
const AdFullscreenD   = lazy(() => import('./components/ads/AdsPreviewPage').then(m => ({ default: m.AdFullscreenD })))
const AdFullscreenE   = lazy(() => import('./components/ads/AdsPreviewPage').then(m => ({ default: m.AdFullscreenE })))

// ── Instagram posts ──────────────────────────────────────────────────────────
const SaasMatchPage        = lazy(() => import('./components/saas-match/SaasMatchPage').then(m => ({ default: m.SaasMatchPage })))
const SaasMatchResultsPage = lazy(() => import('./components/saas-match/SaasMatchResultsPage').then(m => ({ default: m.SaasMatchResultsPage })))

const PlombIAProposalPage = lazy(() => import('./components/PlombIAProposalPage').then(m => ({ default: m.PlombIAProposalPage })))
const BuildrsGroupPage    = lazy(() => import('./components/BuildrsGroupPage').then(m => ({ default: m.BuildrsGroupPage })))
const InstaPreviewPage = lazy(() => import('./components/instagram/InstaPreviewPage').then(m => ({ default: m.InstaPreviewPage })))
const InstaFullP1S1 = lazy(() => import('./components/instagram/InstaPreviewPage').then(m => ({ default: m.InstaFullP1S1 })))
const InstaFullP1S2 = lazy(() => import('./components/instagram/InstaPreviewPage').then(m => ({ default: m.InstaFullP1S2 })))
const InstaFullP1S3 = lazy(() => import('./components/instagram/InstaPreviewPage').then(m => ({ default: m.InstaFullP1S3 })))
const InstaFullP2S1 = lazy(() => import('./components/instagram/InstaPreviewPage').then(m => ({ default: m.InstaFullP2S1 })))
const InstaFullP2S2 = lazy(() => import('./components/instagram/InstaPreviewPage').then(m => ({ default: m.InstaFullP2S2 })))
const InstaFullP2S3 = lazy(() => import('./components/instagram/InstaPreviewPage').then(m => ({ default: m.InstaFullP2S3 })))
const InstaFullP2S4 = lazy(() => import('./components/instagram/InstaPreviewPage').then(m => ({ default: m.InstaFullP2S4 })))
const InstaFullP2S5 = lazy(() => import('./components/instagram/InstaPreviewPage').then(m => ({ default: m.InstaFullP2S5 })))
const InstaFullP2S6 = lazy(() => import('./components/instagram/InstaPreviewPage').then(m => ({ default: m.InstaFullP2S6 })))
const InstaFullP2S7 = lazy(() => import('./components/instagram/InstaPreviewPage').then(m => ({ default: m.InstaFullP2S7 })))
const InstaFullP3S1 = lazy(() => import('./components/instagram/InstaPreviewPage').then(m => ({ default: m.InstaFullP3S1 })))
const InstaFullP3S2 = lazy(() => import('./components/instagram/InstaPreviewPage').then(m => ({ default: m.InstaFullP3S2 })))
const InstaFullP3S3 = lazy(() => import('./components/instagram/InstaPreviewPage').then(m => ({ default: m.InstaFullP3S3 })))
const InstaFullP3S4 = lazy(() => import('./components/instagram/InstaPreviewPage').then(m => ({ default: m.InstaFullP3S4 })))

// ── Lazy imports (split into separate chunks — not needed on LP) ─────────────
const CheckoutPage        = lazy(() => import('./components/CheckoutPage').then(m => ({ default: m.CheckoutPage })))
const ClaudeLandingPage   = lazy(() => import('./components/ClaudeLandingPage').then(m => ({ default: m.ClaudeLandingPage })))
const UpsellCohortPage    = lazy(() => import('./components/UpsellCohortPage').then(m => ({ default: m.UpsellCohortPage })))
const CohorteCheckoutPage = lazy(() => import('./components/CohorteCheckoutPage').then(m => ({ default: m.CohorteCheckoutPage })))
const ClaudeCheckoutPage  = lazy(() => import('./components/ClaudeCheckoutPage').then(m => ({ default: m.ClaudeCheckoutPage })))
const ClaudeOTOPage           = lazy(() => import('./components/ClaudeOTOPage').then(m => ({ default: m.ClaudeOTOPage })))
const ClaudeIntegratorPage    = lazy(() => import('./components/ClaudeIntegratorPage').then(m => ({ default: m.ClaudeIntegratorPage })))
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
    // Purchase déjà tracké dans UpsellCohortPage pour le funnel Blueprint (source=blueprint)
    // Pour les achats Cohorte, on reçoit source=cohort dans les hash params
    const hash = window.location.hash
    const params = new URLSearchParams(hash.split('?')[1] || '')
    if (params.get('source') === 'cohort' && params.get('session_id')) {
      const price = Number(params.get('price')) || 1497
      trackEvent('Purchase', { value: price, currency: 'EUR', num_items: 1 })
    }
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
// Merci Integrator page — fires Meta Pixel Purchase on mount
// ---------------------------------------------------------------------------

function MerciIntegratorPage({ onNavigate }: { onNavigate: () => void }) {
  useEffect(() => {
    const hash = window.location.hash
    const params = new URLSearchParams(hash.split('?')[1] || '')
    if (params.get('session_id')) {
      trackEvent('Purchase', { value: 197, currency: 'EUR', num_items: 1 })
    }
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8 text-center">
      <div className="max-w-lg">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid #22c55e' }}>
          <Check style={{ color: '#22c55e', width: 28, height: 28 }} />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Claude Integrator</p>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-3" style={{ letterSpacing: '-0.04em' }}>
          Session réservée.
        </h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          Alfred te contacte dans les 24h pour fixer le créneau.<br />
          Vérifie tes emails (et tes spams).
        </p>
        <button onClick={onNavigate}
          className="bg-foreground text-background rounded-xl px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity">
          Retourner sur Claude OS →
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
    | 'claude-landing'
    | 'checkout'
    | 'upsell-cohort'
    | 'confirmation'
    | 'signup'
    | 'signin'
    | 'onboarding'
    | 'home'
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
    | 'checkout-cohorte'
    | 'settings'
    | 'autopilot'
    | 'offers'
    | 'agents'
    | 'agent-run'
    // 'agent-chat' removed 2026-04-17 (legacy 6-agents system). The hash is
    // intercepted in parseHash and redirected to '/dashboard/agents'.
    // TODO 2026-05-01 : delete the redirect block once logs confirm zero hits.
    | 'claude-os'
    | 'kanban'
    | 'marketplace'
    | 'opportunity-detail'
    | 'validator'
    | 'revenue-calculator'
    | 'generator'
    | 'generateur-ia'
    | 'acquisition-bonus'

    | 'community'
    | 'members'
    | 'templates'
    | 'collaborators'
    | 'legal-mentions'
    | 'legal-cgv'
    | 'legal-confidentialite'
    | 'legal-cookies'
    | 'claude-checkout'
    | 'merci-claude'
    | 'claude-integrator'
    | 'merci-integrator'
    | 'ads-preview'
    | 'ads-full-a'
    | 'ads-full-b'
    | 'ads-full-c'
    | 'ads-full-d'
    | 'ads-full-e'
    | 'insta-preview'
    | 'insta-p1s1' | 'insta-p1s2' | 'insta-p1s3'
    | 'insta-p2s1' | 'insta-p2s2' | 'insta-p2s3' | 'insta-p2s4' | 'insta-p2s5' | 'insta-p2s6' | 'insta-p2s7'
    | 'insta-p3s1' | 'insta-p3s2' | 'insta-p3s3' | 'insta-p3s4'
    | 'plombia-proposal'
    | 'group'
    | 'saas-match'
    | 'saas-match-results'
  moduleId?: string   // also used as productSlug for 'produit'/'brick'
  lessonId?: string   // also used as brickId for 'brick'
}

function parseHash(hash: string): ParsedRoute {
  const h = hash.replace(/^#\/?/, '')
  if (!h || h === 'landing' || h === '/') return { type: 'landing' }
  if (h === 'plombia') return { type: 'plombia-proposal' }
  if (h === 'group')   return { type: 'group' }
  if (h === 'saas-match') return { type: 'saas-match' }
  if (h === 'saas-match-results') return { type: 'saas-match-results' }
  if (h === 'claude') return { type: 'claude-landing' }
  if (h === 'legal/mentions') return { type: 'legal-mentions' }
  if (h === 'legal/cgv') return { type: 'legal-cgv' }
  if (h === 'legal/confidentialite') return { type: 'legal-confidentialite' }
  if (h === 'legal/cookies') return { type: 'legal-cookies' }
  if (h === 'checkout') return { type: 'checkout' }
  if (h === 'claude-checkout') return { type: 'claude-checkout' }
  if (h === 'merci-claude' || h.startsWith('merci-claude?')) return { type: 'merci-claude' }
  if (h === 'claude-integrator') return { type: 'claude-integrator' }
  if (h === 'merci-integrator' || h.startsWith('merci-integrator?')) return { type: 'merci-integrator' }
  if (h === 'ads-preview') return { type: 'ads-preview' }
  if (h === 'ads-full-a')  return { type: 'ads-full-a' }
  if (h === 'ads-full-b')  return { type: 'ads-full-b' }
  if (h === 'ads-full-c')  return { type: 'ads-full-c' }
  if (h === 'ads-full-d')  return { type: 'ads-full-d' }
  if (h === 'ads-full-e')  return { type: 'ads-full-e' }
  if (h === 'insta-preview') return { type: 'insta-preview' }
  if (h === 'insta-p1s1') return { type: 'insta-p1s1' }
  if (h === 'insta-p1s2') return { type: 'insta-p1s2' }
  if (h === 'insta-p1s3') return { type: 'insta-p1s3' }
  if (h === 'insta-p2s1') return { type: 'insta-p2s1' }
  if (h === 'insta-p2s2') return { type: 'insta-p2s2' }
  if (h === 'insta-p2s3') return { type: 'insta-p2s3' }
  if (h === 'insta-p2s4') return { type: 'insta-p2s4' }
  if (h === 'insta-p2s5') return { type: 'insta-p2s5' }
  if (h === 'insta-p2s6') return { type: 'insta-p2s6' }
  if (h === 'insta-p2s7') return { type: 'insta-p2s7' }
  if (h === 'insta-p3s1') return { type: 'insta-p3s1' }
  if (h === 'insta-p3s2') return { type: 'insta-p3s2' }
  if (h === 'insta-p3s3') return { type: 'insta-p3s3' }
  if (h === 'insta-p3s4') return { type: 'insta-p3s4' }
  if (h === 'upsell-cohort' || h.startsWith('upsell-cohort?')) return { type: 'upsell-cohort' }
  if (h === 'confirmation' || h.startsWith('confirmation?')) return { type: 'confirmation' }
  if (h === 'signup') return { type: 'signup' }
  if (h === 'signin') return { type: 'signin' }
  if (h === 'onboarding') return { type: 'onboarding' }
  if (h === 'dashboard') return { type: 'home' }
  if (h === 'dashboard/journal') return { type: 'journal' }
  if (h === 'dashboard/library') return { type: 'library' }
  if (h === 'dashboard/ideas') return { type: 'ideas' }
  if (h === 'dashboard/checklist') return { type: 'checklist' }
  if (h === 'dashboard/project') return { type: 'project' }
  if (h === 'dashboard/tools') return { type: 'tools' }
  if (h === 'checkout-cohorte') return { type: 'checkout-cohorte' }
  if (h === 'dashboard/settings') return { type: 'settings' }
  if (h === 'dashboard/autopilot') return { type: 'autopilot' }
  if (h === 'dashboard/offers') return { type: 'offers' }
  if (h === 'dashboard/agents')        return { type: 'agents' }
  const agentRunMatch = h.match(/^dashboard\/agents\/([^/]+)$/)
  if (agentRunMatch) return { type: 'agent-run', moduleId: agentRunMatch[1] }
  if (h === 'dashboard/kanban')        return { type: 'kanban' }
  if (h === 'dashboard/generateur-ia') return { type: 'generateur-ia' }
  if (h === 'dashboard/marketplace')   return { type: 'marketplace' }
  if (h === 'dashboard/validator')             return { type: 'validator' }
  if (h === 'dashboard/generator/validate')    return { type: 'validator' }
  if (h === 'dashboard/revenue-calculator')    return { type: 'revenue-calculator' }
  if (h === 'dashboard/generator/mrr')         return { type: 'revenue-calculator' }
  if (h === 'dashboard/generator')             return { type: 'generator' }
  if (h === 'dashboard/generator/ideas')       return { type: 'generator' }

  const acquisitionBonusMatch = h.match(/^dashboard\/acquisition-bonus(\/.*)?$/)
  if (acquisitionBonusMatch) return { type: 'acquisition-bonus', moduleId: acquisitionBonusMatch[1]?.replace(/^\//, '') || '' }

  if (h === 'dashboard/community')     return { type: 'community' }
  if (h === 'dashboard/members')       return { type: 'members' }
  if (h === 'dashboard/templates')     return { type: 'templates' }
  if (h === 'dashboard/products')      return { type: 'offers' }
  if (h === 'dashboard/collaborators') return { type: 'collaborators' }
  if (h === 'dashboard/notifications') return { type: 'notifications' }
  const marketplaceIdeaMatch = h.match(/^dashboard\/marketplace\/([^/]+)$/)
  if (marketplaceIdeaMatch) return { type: 'opportunity-detail', moduleId: marketplaceIdeaMatch[1] }
  // Legacy redirect: the old 6-agents chat hashes (#/dashboard/agent-chat/:id
  // and #/dashboard/agent/:id) are rewritten to the new agents gallery.
  // Archived 2026-04-17 (Phase 0 cleanup). TODO 2026-05-01 : remove this block
  // once logs confirm zero hits on these paths.
  const legacyAgentChatMatch = h.match(/^dashboard\/agent(?:-chat)?\/([^/]+)$/)
  if (legacyAgentChatMatch) {
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '#/dashboard/agents')
    }
    return { type: 'agents' }
  }

  const claudeOsMatch = h.match(/^dashboard\/claude-os(\/.*)?$/)
  if (claudeOsMatch) return { type: 'claude-os', moduleId: claudeOsMatch[1]?.replace(/^\//, '') || '' }

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
const isClaudeDomain    = window.location.hostname === 'claude.buildrs.fr'
const isSaasMatchDomain = window.location.hostname === 'saas-match.buildrs.fr'

function App() {
  // On claude.buildrs.fr with no hash → redirect to #/claude automatically
  if (isClaudeDomain && !window.location.hash) {
    window.location.hash = '/claude'
  }
  // On saas-match.buildrs.fr with no hash → redirect to #/saas-match automatically
  if (isSaasMatchDomain && !window.location.hash) {
    window.location.hash = '/saas-match'
  }

  const [route, setRoute] = useState<ParsedRoute>(parseHash(window.location.hash))
  const [isDark, setIsDark] = useState(false)
  const [hasOrderBump, setHasOrderBump] = useState(false)
  const [hasAgentsBump, setHasAgentsBump] = useState(false)
  const [hasAcquisitionBump, setHasAcquisitionBump] = useState(false)
  const [funnelSource, setFunnelSource] = useState<'blueprint' | 'claude'>(isClaudeDomain ? 'claude' : 'blueprint')
  // LP2 — Claude funnel checkout bumps
  const [hasCoworkBump, setHasCoworkBump] = useState(false)
  const [hasBlueprintBump, setHasBlueprintBump] = useState(false)

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
      // GA4 — track route changes in SPA
      const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
      if (gtag) {
        gtag('event', 'page_view', {
          page_location: window.location.href,
          page_path: window.location.hash || '/',
        })
      }
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
      idle(() => trackEvent('ViewContent', { content_name: 'Buildrs Blueprint', currency: 'EUR', value: BLUEPRINT_PRICE }))
    }
  }, [route.type])

  // Apply dark class on mount + on change
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const handleToggleDark = () => setIsDark(prev => !prev)

  // Persist funnelSource for analytics at signup
  useEffect(() => {
    sessionStorage.setItem('funnelSource', funnelSource)
  }, [funnelSource])

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
    return <LandingPage onCTAClick={() => { setFunnelSource('blueprint'); navigate('#/checkout') }} />
  }

  if (route.type === 'claude-landing') {
    return (
      <Suspense fallback={SpinnerFallback}>
        <ClaudeLandingPage onCTAClick={() => { setFunnelSource('claude'); navigate('#/claude-checkout') }} />
      </Suspense>
    )
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
          hasAgentsBump={hasAgentsBump}
          setHasAgentsBump={setHasAgentsBump}
          hasAcquisitionBump={hasAcquisitionBump}
          setHasAcquisitionBump={setHasAcquisitionBump}
          funnelSource={funnelSource}
          onPay={() => navigate('#/upsell-cohort')}
          onBack={() => navigate(funnelSource === 'claude' ? '#/claude' : '#/landing')}
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

  // ── LP2 — Claude funnel ────────────────────────────────────────────────────
  if (route.type === 'claude-checkout') {
    return (
      <Suspense fallback={SpinnerFallback}>
        <ClaudeCheckoutPage
          hasCoworkBump={hasCoworkBump}
          setHasCoworkBump={setHasCoworkBump}
          hasBlueprintBump={hasBlueprintBump}
          setHasBlueprintBump={setHasBlueprintBump}
          onBack={() => navigate('#/claude')}
        />
      </Suspense>
    )
  }
  if (route.type === 'merci-claude') {
    return (
      <Suspense fallback={SpinnerFallback}>
        <ClaudeOTOPage onDecline={() => navigate('#/signup?welcome=lp2')} />
      </Suspense>
    )
  }
  if (route.type === 'claude-integrator') {
    return (
      <Suspense fallback={SpinnerFallback}>
        <ClaudeIntegratorPage onBack={() => window.history.back()} />
      </Suspense>
    )
  }
  if (route.type === 'merci-integrator') {
    return (
      <MerciIntegratorPage onNavigate={() => navigate('#/dashboard/claude-os')} />
    )
  }

  // ---------------------------------------------------------------------------
  // Auth routes (lazy)
  // ---------------------------------------------------------------------------
  if (route.type === 'signup') {
    if (user) {
      navigate(onboarding.onboarding_completed ? '#/dashboard' : '#/onboarding')
      return null
    }
    // Tracker les achats dont le return_url pointe vers /signup
    // (downsell Blueprint palier courant, OTO Agents 147€) — une seule fois par session
    const signupHashParams = new URLSearchParams(window.location.hash.split('?')[1] || '')
    if (signupHashParams.get('purchased') === 'downsell'
      && !sessionStorage.getItem('tracked_downsell')) {
      sessionStorage.setItem('tracked_downsell', '1')
      trackEvent('Purchase', { value: BLUEPRINT_PRICE, currency: 'EUR', num_items: 1 })
    }
    if (signupHashParams.get('oto') === 'success'
      && !sessionStorage.getItem('tracked_oto')) {
      sessionStorage.setItem('tracked_oto', '1')
      trackEvent('Purchase', { value: 147, currency: 'EUR', num_items: 1 })
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
          userFirstName={user.user_metadata?.first_name}
          onComplete={() => navigate('#/dashboard/autopilot')}
          onSignOut={signOut}
          save={saveOnboarding}
          complete={completeOnboarding}
          navigate={navigate}
        />
      </Suspense>
    )
  }

  // ---------------------------------------------------------------------------
  // Dashboard routes — lazy via DashboardSection (isolates curriculum + hooks)
  // ---------------------------------------------------------------------------
  const isDashboardRoute = [
    'home', 'dashboard', 'module', 'lesson', 'quiz', 'journal', 'library', 'ideas',
    'checklist', 'project', 'tools', 'settings', 'autopilot', 'offers', 'agents', 'agent-run',
    'claude-os',
    'kanban', 'marketplace', 'opportunity-detail', 'validator', 'revenue-calculator', 'generator', 'generateur-ia', 'acquisition-bonus',
    'community', 'members', 'templates', 'collaborators', 'notifications',
  ].includes(route.type)

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

  // ── SaaS Match funnel (public) ───────────────────────────────────────────────
  if (route.type === 'saas-match') {
    return (
      <Suspense fallback={SpinnerFallback}>
        <SaasMatchPage
          onResults={(_results, _answers) => navigate('#/saas-match-results')}
        />
      </Suspense>
    )
  }
  if (route.type === 'saas-match-results') {
    return (
      <Suspense fallback={SpinnerFallback}>
        <SaasMatchResultsPage navigate={navigate} />
      </Suspense>
    )
  }

  // ── Proposal pages ─────────────────────────────────────────────────────────
  if (route.type === 'plombia-proposal') return <Suspense fallback={SpinnerFallback}><PlombIAProposalPage /></Suspense>
  if (route.type === 'group')            return <Suspense fallback={SpinnerFallback}><BuildrsGroupPage /></Suspense>

  // ── Ads preview routes (dev only) ───────────────────────────────────────────
  if (route.type === 'ads-preview') return <Suspense fallback={SpinnerFallback}><AdsPreviewPage /></Suspense>
  if (route.type === 'ads-full-a')  return <Suspense fallback={SpinnerFallback}><AdFullscreenA /></Suspense>
  if (route.type === 'ads-full-b')  return <Suspense fallback={SpinnerFallback}><AdFullscreenB /></Suspense>
  if (route.type === 'ads-full-c')  return <Suspense fallback={SpinnerFallback}><AdFullscreenC /></Suspense>
  if (route.type === 'ads-full-d')  return <Suspense fallback={SpinnerFallback}><AdFullscreenD /></Suspense>
  if (route.type === 'ads-full-e')  return <Suspense fallback={SpinnerFallback}><AdFullscreenE /></Suspense>

  // ── Instagram routes ─────────────────────────────────────────────────────────
  if (route.type === 'insta-preview') return <Suspense fallback={SpinnerFallback}><InstaPreviewPage /></Suspense>
  if (route.type === 'insta-p1s1') return <Suspense fallback={SpinnerFallback}><InstaFullP1S1 /></Suspense>
  if (route.type === 'insta-p1s2') return <Suspense fallback={SpinnerFallback}><InstaFullP1S2 /></Suspense>
  if (route.type === 'insta-p1s3') return <Suspense fallback={SpinnerFallback}><InstaFullP1S3 /></Suspense>
  if (route.type === 'insta-p2s1') return <Suspense fallback={SpinnerFallback}><InstaFullP2S1 /></Suspense>
  if (route.type === 'insta-p2s2') return <Suspense fallback={SpinnerFallback}><InstaFullP2S2 /></Suspense>
  if (route.type === 'insta-p2s3') return <Suspense fallback={SpinnerFallback}><InstaFullP2S3 /></Suspense>
  if (route.type === 'insta-p2s4') return <Suspense fallback={SpinnerFallback}><InstaFullP2S4 /></Suspense>
  if (route.type === 'insta-p2s5') return <Suspense fallback={SpinnerFallback}><InstaFullP2S5 /></Suspense>
  if (route.type === 'insta-p2s6') return <Suspense fallback={SpinnerFallback}><InstaFullP2S6 /></Suspense>
  if (route.type === 'insta-p2s7') return <Suspense fallback={SpinnerFallback}><InstaFullP2S7 /></Suspense>
  if (route.type === 'insta-p3s1') return <Suspense fallback={SpinnerFallback}><InstaFullP3S1 /></Suspense>
  if (route.type === 'insta-p3s2') return <Suspense fallback={SpinnerFallback}><InstaFullP3S2 /></Suspense>
  if (route.type === 'insta-p3s3') return <Suspense fallback={SpinnerFallback}><InstaFullP3S3 /></Suspense>
  if (route.type === 'insta-p3s4') return <Suspense fallback={SpinnerFallback}><InstaFullP3S4 /></Suspense>

  // Fallback
  return <LandingPage onCTAClick={() => navigate('#/checkout')} />
}

export default App
