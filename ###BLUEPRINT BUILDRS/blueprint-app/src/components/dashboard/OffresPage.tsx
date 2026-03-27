import { useState, useEffect, useRef } from 'react'
import {
  Video, MessageCircle, Zap, Shield, Trophy, Rocket,
  Users, Check, ChevronLeft, Package, Clock, AlertCircle, Wrench,
} from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

const SUPABASE_FUNCTIONS_URL = 'https://ihgbbgwhgmosfjaknvlf.supabase.co/functions/v1'

interface Props { navigate: (hash: string) => void }

const sprintItems = [
  { icon: Clock,         text: 'Call de cadrage 30 min — idée validée, périmètre défini' },
  { icon: Rocket,        text: 'MVP fonctionnel avec 1 feature core, livré en 72h' },
  { icon: Shield,        text: 'Auth, BDD Supabase, déploiement Vercel — tout configuré' },
  { icon: Package,       text: 'Architecture propre, maintenable, prête à évoluer' },
  { icon: Zap,           text: 'Code source GitHub + documentation technique complète' },
]

const cohortItems = [
  { icon: Video,         text: '4 sessions live par semaine avec Alfred' },
  { icon: Rocket,        text: 'On construit TON projet ensemble — de l\'idée au lancement en direct' },
  { icon: Wrench,        text: 'Paramétrage en live de tout ton Claude — intégration des outils' },
  { icon: Zap,           text: 'Toutes les ressources, agents IA et connaissances Buildrs à disposition' },
  { icon: MessageCircle, text: 'WhatsApp privé — accès direct à Alfred pendant 60 jours' },
  { icon: Shield,        text: 'Retours en temps réel · accompagnement illimité' },
  { icon: Trophy,        text: '1 000€/mois garantis dans les 90 jours ou remboursé' },
]

// ─── Cal.com widget ───────────────────────────────────────────────────────────
function CalWidget() {
  const embedId = 'cal-offers-embed'
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const w = window as any
    ;(function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) {
        a.q.push(ar)
      }
      const d = C.document
      C.Cal = C.Cal || function (...args: any[]) {
        const cal = C.Cal
        if (!cal.loaded) {
          cal.ns = {}; cal.q = cal.q || []
          d.head.appendChild(d.createElement('script')).src = A
          cal.loaded = true
        }
        if (args[0] === L) {
          const api: any = function (...a: any[]) { p(api, a) }
          const ns = args[1]
          api.q = api.q || []
          if (typeof ns === 'string') { cal.ns[ns] = cal.ns[ns] || api; p(cal.ns[ns], args) }
          else p(cal, args)
          return
        }
        p(cal, args)
      }
    })(w, 'https://app.cal.com/embed/embed.js', 'init')

    const Cal = w.Cal
    Cal('init', 'secret', { origin: 'https://app.cal.com' })
    Cal.ns.secret('inline', {
      elementOrSelector: `#${embedId}`,
      config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true' },
      calLink: 'team-buildrs/secret',
    })
    Cal.ns.secret('ui', {
      cssVarsPerTheme: {
        light: { 'cal-brand': '#09090b' },
        dark:  { 'cal-brand': '#fafafa' },
      },
      hideEventTypeDetails: false,
      layout: 'month_view',
    })
  }, [])

  return (
    <div className="mt-14 border-t border-border pt-12">
      <div className="text-center mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-2">
          Une question ? Un doute ?
        </p>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
          Parlons-en directement.
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Réserve un appel gratuit — 20 min pour identifier ce qui te convient.
        </p>
      </div>
      <div id={embedId} style={{ width: '100%', height: '600px' }} />
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export function OffresPage({ navigate: _navigate }: Props) {
  const [selected, setSelected]     = useState<'sprint' | 'cohort' | null>(null)
  const [cohortMode, setCohortMode] = useState<'once' | 'three'>('once')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [showStripe, setShowStripe] = useState(false)
  const checkoutRef = useRef<{ destroy: () => void } | null>(null)
  const mountRef    = useRef<HTMLDivElement>(null)

  useEffect(() => () => { checkoutRef.current?.destroy() }, [])

  const cohortPriceLabel = cohortMode === 'once' ? '1 497€' : '3 × 499€'

  const handlePay = async (type: 'sprint' | 'cohort') => {
    setLoading(true); setError(null)
    const endpoint = type === 'sprint' ? 'create-sprint-checkout' : 'create-cohort-checkout'
    try {
      const res  = await fetch(`${SUPABASE_FUNCTIONS_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_mode: type === 'cohort' ? cohortMode : 'once' }),
      })
      const data = await res.json()
      if (!res.ok || !data.clientSecret) throw new Error(data.error ?? 'Erreur Stripe')
      const stripe = await loadStripe(data.publishableKey)
      if (!stripe) throw new Error('Stripe indisponible')
      checkoutRef.current?.destroy()
      const checkout = await stripe.initEmbeddedCheckout({ clientSecret: data.clientSecret })
      setShowStripe(true)
      setTimeout(() => {
        if (mountRef.current) { checkout.mount(mountRef.current); checkoutRef.current = checkout }
      }, 50)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleCloseStripe = () => {
    checkoutRef.current?.destroy(); checkoutRef.current = null
    setShowStripe(false); setSelected(null)
  }

  return (
    <div className="max-w-[1000px] mx-auto px-5 py-10">

      {/* Stripe overlay */}
      {showStripe && (
        <div className="max-w-[600px] mx-auto overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <button
              onClick={handleCloseStripe}
              className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} strokeWidth={1.5} />
              Retour
            </button>
            <span className="text-[14px] font-bold text-foreground">
              {selected === 'sprint' ? 'Sprint — 497€' : `Cohorte — ${cohortPriceLabel}`}
            </span>
          </div>
          <div ref={mountRef} />
        </div>
      )}

      {!showStripe && (
        <>
          {/* Header */}
          <div className="mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-3">
              Accélérer
            </p>
            <h1
              className="text-foreground mb-3"
              style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}
            >
              Tu as le plan.<br />Choisis ta vitesse.
            </h1>
            <p className="text-sm text-muted-foreground max-w-[480px] leading-relaxed">
              Le Blueprint te donne tout le savoir-faire. Ces deux offres t'amènent le coup de main pour aller plus vite et plus loin.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

            {/* ── SPRINT ── */}
            <div
              className={`relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-colors ${
                selected === 'sprint' ? 'border-foreground' : 'border-border hover:border-foreground/30'
              }`}
            >
              <div className="flex flex-col flex-1 p-6">

                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-border bg-muted px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                    Sprint
                  </span>
                  <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em]"
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: 'rgba(34,197,94,0.9)' }}>
                    Livré en 72h
                  </span>
                  <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em]"
                    style={{ background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.35)', color: '#fbbf24' }}>
                    Le plus choisi
                  </span>
                </div>

                <h2
                  className="mb-2 text-foreground"
                  style={{ fontSize: 'clamp(20px, 2.5vw, 26px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.1 }}
                >
                  On te livre ton MVP.<br />En 72 heures.
                </h2>
                <p className="mb-6 text-[13px] leading-[1.7] text-muted-foreground">
                  Tu nous donnes ton idée — ou on t'en trouve une. On te livre un MVP complet, fonctionnel, déployé, avec la landing page et les créas Meta Ads.
                </p>

                <ul className="mb-5 flex flex-col gap-2.5">
                  {sprintItems.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-start gap-3 text-[12px] text-muted-foreground">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-border bg-muted" style={{ marginTop: 1 }}>
                        <Icon size={10} strokeWidth={1.5} className="text-foreground" />
                      </div>
                      {text}
                    </li>
                  ))}
                </ul>

                <div className="mb-6 rounded-lg border border-border bg-muted/40 px-4 py-3">
                  <p className="text-[11px] leading-[1.6] text-muted-foreground">
                    <span className="font-semibold text-foreground">Notre périmètre : le produit.</span>{' '}
                    MVP fonctionnel, documenté et déployé — prêt au marché. Acquisition et marketing restent entre tes mains.
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="mb-4 flex items-baseline gap-2">
                    <span className="text-[14px] font-medium text-muted-foreground/40 line-through">997€</span>
                    <span className="text-foreground" style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>
                      497€
                    </span>
                    <span className="text-[12px] text-muted-foreground">une fois</span>
                  </div>

                  {error && selected === 'sprint' && (
                    <p className="mb-2 text-[12px] text-red-500">{error}</p>
                  )}

                  <button
                    onClick={() => { setSelected('sprint'); handlePay('sprint') }}
                    disabled={loading && selected === 'sprint'}
                    className="w-full rounded-[10px] border border-foreground bg-background py-3 text-[13px] font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading && selected === 'sprint' ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Chargement…
                      </span>
                    ) : 'Je veux mon MVP en 72h →'}
                  </button>

                  <div className="mt-2.5 flex items-center justify-center gap-1.5">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span className="text-[10px] text-muted-foreground">Paiement sécurisé · Stripe</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── COHORTE ── */}
            <div
              className={`relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-colors ${
                selected === 'cohort' ? 'border-foreground' : 'border-border hover:border-foreground/30'
              }`}
            >
                <div className="flex flex-col flex-1 p-6">

                  <div className="mb-5 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-border bg-muted px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      Cohorte
                    </span>
                    <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em]"
                      style={{ background: 'rgba(77,150,255,0.12)', border: '1px solid rgba(77,150,255,0.3)', color: '#4d96ff' }}>
                      60 jours
                    </span>
                  </div>

                  <h2
                    className="mb-2 text-foreground"
                    style={{ fontSize: 'clamp(20px, 2.5vw, 26px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.1 }}
                  >
                    On construit ensemble.<br />Pendant 60 jours.
                  </h2>
                  <p className="mb-6 text-[13px] leading-[1.7] text-muted-foreground">
                    12 places max. Accès direct à Alfred, 4 sessions live par semaine, WhatsApp privé. Ton SaaS lancé et monétisé — garanti.
                  </p>

                  <ul className="mb-5 flex flex-col gap-2.5">
                    {cohortItems.map(({ icon: Icon, text }) => (
                      <li key={text} className="flex items-start gap-3 text-[12px] text-muted-foreground">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-border bg-muted" style={{ marginTop: 1 }}>
                          <Icon size={10} strokeWidth={1.5} className="text-foreground" />
                        </div>
                        {text}
                      </li>
                    ))}
                  </ul>

                  {/* Garantie */}
                  <div className="mb-5 rounded-xl border border-border bg-background/50 px-4 py-3">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle size={13} strokeWidth={1.5} className="mt-[2px] shrink-0 text-foreground" />
                      <p className="text-[12px] leading-[1.6] text-muted-foreground">
                        <span className="font-semibold text-foreground">Garantie résultat :</span> 1 000€/mois dans les 90 jours suivant le lancement. Sinon, remboursement intégral.
                      </p>
                    </div>
                  </div>

                  {/* Payment toggle */}
                  <div className="mb-6 flex gap-2">
                    <button
                      onClick={() => setCohortMode('once')}
                      className={`flex-1 rounded-lg border py-2 text-[11px] font-semibold transition-colors cursor-pointer ${
                        cohortMode === 'once'
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border text-muted-foreground hover:border-foreground/40'
                      }`}
                    >
                      Paiement unique<br />
                      <span className="font-extrabold text-[14px]">1 497€</span>
                    </button>
                    <button
                      onClick={() => setCohortMode('three')}
                      className={`flex-1 rounded-lg border py-2 text-[11px] font-semibold transition-colors cursor-pointer ${
                        cohortMode === 'three'
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border text-muted-foreground hover:border-foreground/40'
                      }`}
                    >
                      3 fois sans frais<br />
                      <span className="font-extrabold text-[14px]">3 × 499€</span>
                    </button>
                  </div>

                  <div className="mt-auto">
                    <div className="mb-4 flex items-baseline gap-2">
                      <span className="text-[14px] font-medium text-muted-foreground/40 line-through">
                        {cohortMode === 'once' ? '2 497€' : '3 × 997€'}
                      </span>
                      <span className="text-foreground" style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>
                        {cohortMode === 'once' ? '1 497€' : '499€'}
                      </span>
                      <span className="text-[12px] text-muted-foreground">
                        {cohortMode === 'once' ? 'une fois' : '× 3 mois'}
                      </span>
                    </div>

                    {error && selected === 'cohort' && (
                      <p className="mb-2 text-[12px] text-red-500">{error}</p>
                    )}

                    <button
                      onClick={() => { setSelected('cohort'); handlePay('cohort') }}
                      disabled={loading && selected === 'cohort'}
                      className="cta-rainbow w-full rounded-[10px] py-3 text-[13px] font-semibold transition-opacity hover:opacity-90 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ background: 'hsl(var(--foreground))', color: 'hsl(var(--background))' }}
                    >
                      {loading && selected === 'cohort' ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Chargement…
                        </span>
                      ) : 'Rejoindre la Cohorte →'}
                    </button>

                    <div className="mt-2.5 flex items-center justify-center gap-1.5">
                      <Users size={10} strokeWidth={1.5} className="text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">12 places max · Prochaine session en cours</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          {/* Cal.com */}
          <CalWidget />
        </>
      )}
    </div>
  )
}
