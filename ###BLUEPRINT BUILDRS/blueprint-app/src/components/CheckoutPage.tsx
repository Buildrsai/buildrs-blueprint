import { useState, useEffect, useRef } from "react"
import { Lock, Check, Flame, ChevronLeft, ChevronDown } from "lucide-react"
import { trackEvent } from '../lib/pixel'
import { loadStripe } from "@stripe/stripe-js"
import { BuildrsIcon, ClaudeIcon, WhatsAppIcon } from "./ui/icons"
import { RobotJarvis } from "./ui/agent-robots"

const SUPABASE_FUNCTIONS_URL = 'https://ihgbbgwhgmosfjaknvlf.supabase.co/functions/v1'

// ─── Props ────────────────────────────────────────────────────────────────────

interface CheckoutPageProps {
  hasOrderBump: boolean
  setHasOrderBump: (v: boolean) => void
  hasAgentsBump: boolean
  setHasAgentsBump: (v: boolean) => void
  hasAcquisitionBump: boolean
  setHasAcquisitionBump: (v: boolean) => void
  funnelSource: 'blueprint' | 'claude'
  onPay: () => void
  onBack: () => void
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MAIN_FEATURES = [
  "Le système en 7 étapes — de l'idée au Micro-SaaS IA monétisé",
  "3 stratégies de départ",
  "Le Générateur d'Idées avec fiches produit prêtes",
  "Le Validateur — score ton idée avant de builder",
  "50+ prompts testés à copier-coller",
  "3 modèles de monétisation avec guide",
  "Checklist de progression",
  "Le Dashboard Buildrs",
  "Accès à la communauté Buildrs",
  "Accès à vie + mises à jour futures",
]

const MAIN_BONUSES = [
  { text: "Jarvis IA — ton copilote intelligent qui te guide à chaque étape en temps réel", value: "valeur 97€", isJarvis: true },
  { text: "Toolbox Pro — les meilleurs outils IA du marché pour créer ton Micro-SaaS IA", value: "valeur 47€", isJarvis: false },
  { text: "WhatsApp Buildrs — accès privé à Alfred & Jarvis via le canal WhatsApp Buildrs", value: "valeur 47€", isJarvis: false },
]

const CLAUDE_OS_FEATURES = [
  "L'arsenal complet Claude AI + Code + Cowork",
  "22 plugins, 70+ skills, tous les MCP configurés",
  "5 générateurs (CLAUDE.md, Skills, MCP, Prompts, Team Agents)",
  "Spécialisé Micro-SaaS IA, apps et produits digitaux",
  "Guide d'installation pas à pas — opérationnel en 15 minutes",
]

const ACQUISITION_FEATURES = [
  "La méthode pour atteindre 100 clients payants",
  "Les 5 canaux d'acquisition qui marchent pour un Micro-SaaS IA",
  "Les templates de lancement (emails, posts, ads)",
  "Le guide de pricing optimisé pour maximiser le MRR",
]

// ─── BumpCard ─────────────────────────────────────────────────────────────────

interface BumpCardProps {
  checked: boolean
  onToggle: () => void
  name: string
  strikeprice: string
  addprice: string
  title: string
  description: string
  detailOpen: boolean
  onToggleDetail: () => void
  features: string[]
  accentColor: string
  icon?: React.ReactNode
}

function BumpCard({ checked, onToggle, name, strikeprice, addprice, title, description, detailOpen, onToggleDetail, features, accentColor, icon }: BumpCardProps) {
  return (
    <div className={`rounded-2xl border-2 transition-all overflow-hidden ${checked ? 'border-foreground bg-card' : 'border-border bg-card'}`}>
      <button onClick={onToggle} className="w-full text-left p-6 cursor-pointer hover:bg-secondary/20 transition-colors">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${checked ? 'border-foreground bg-foreground' : 'border-border bg-background'}`}>
            {checked && <Check size={11} strokeWidth={3} className="text-background" />}
          </div>
          <div className="flex-1 text-left">
            <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1.5">
              <span className="rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">
                Oui — ajouter
              </span>
              {icon && <span className="flex items-center">{icon}</span>}
              <span className="text-[14px] font-bold text-foreground">{name}</span>
              <span className="text-[13px] font-medium text-muted-foreground/50 line-through">{strikeprice}</span>
              <span className="text-[14px] font-bold text-foreground">{addprice}</span>
            </div>
            <p className="mb-2 text-[14px] font-bold text-foreground leading-[1.3]">{title}</p>
            <p className="text-[13px] text-muted-foreground leading-[1.55]">{description}</p>
          </div>
        </div>
      </button>

      <div className="px-6 pb-4">
        <button
          onClick={onToggleDetail}
          className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5"
        >
          {detailOpen ? 'Réduire' : 'Voir le détail'}
          <ChevronDown size={13} strokeWidth={2} className="transition-transform duration-200" style={{ transform: detailOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </button>
      </div>

      {detailOpen && (
        <div className="border-t border-border px-6 pb-6 pt-5">
          <ul className="flex flex-col gap-[10px]">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <Check size={13} strokeWidth={2} className="mt-[2px] shrink-0 text-foreground" />
                <span className="text-muted-foreground text-[13px]">{f}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={onToggleDetail}
            className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown size={13} strokeWidth={2} style={{ transform: 'rotate(180deg)' }} />
            Réduire
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CheckoutPage({
  hasOrderBump, setHasOrderBump,
  hasAgentsBump: _hasAgentsBump, setHasAgentsBump: _setHasAgentsBump,
  hasAcquisitionBump, setHasAcquisitionBump,
  funnelSource, onBack,
}: CheckoutPageProps) {
  const isClaudeFunnel = funnelSource === 'claude'
  const [dark, setDark] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showStripe, setShowStripe] = useState(false)
  const [stripeReady, setStripeReady] = useState(false)
  const [offerOpen, setOfferOpen] = useState(false)
  const [claudeOSOpen, setClaudeOSOpen] = useState(false)
  const [acquisitionOpen, setAcquisitionOpen] = useState(false)
  const checkoutRef = useRef<{ destroy: () => void } | null>(null)
  const mountRef = useRef<HTMLDivElement>(null)

  const basePrice = isClaudeFunnel ? 47 : 27
  const claudeOSPrice = isClaudeFunnel ? 27 : 37
  const acquisitionPrice = 27
  const total = basePrice
    + (hasOrderBump ? claudeOSPrice : 0)
    + (!isClaudeFunnel && hasAcquisitionBump ? acquisitionPrice : 0)

  useEffect(() => {
    return () => { checkoutRef.current?.destroy() }
  }, [])

  const handlePay = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: funnelSource,
          has_order_bump: hasOrderBump,
          has_acquisition_bump: isClaudeFunnel ? false : hasAcquisitionBump,
          origin: window.location.origin,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.clientSecret) throw new Error(data.error ?? 'Erreur de connexion à Stripe')
      const stripe = await loadStripe(data.publishableKey)
      if (!stripe) throw new Error('Stripe non disponible')
      checkoutRef.current?.destroy()
      const checkout = await stripe.initEmbeddedCheckout({ clientSecret: data.clientSecret })
      trackEvent('InitiateCheckout', { value: total, currency: 'EUR', num_items: 1 })
      setStripeReady(false)
      setShowStripe(true)
      setTimeout(() => {
        if (mountRef.current) {
          checkout.mount(mountRef.current)
          checkoutRef.current = checkout
          // Laisse Stripe rendre son iframe (~600ms) avant de cacher le spinner
          setTimeout(() => setStripeReady(true), 700)
        }
      }, 50)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleCloseStripe = () => {
    checkoutRef.current?.destroy()
    checkoutRef.current = null
    setShowStripe(false)
    setStripeReady(false)
  }

  const toggleTheme = () => {
    setDark((prev) => {
      document.documentElement.classList.toggle('dark', !prev)
      return !prev
    })
  }

  return (
    <div className="min-h-screen bg-background">

      {/* NAV */}
      <nav className="border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[60px] max-w-[1000px] items-center justify-between px-6">
          <button onClick={onBack} className="flex items-center gap-2 no-underline hover:opacity-70 transition-opacity" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <BuildrsIcon color="currentColor" className="h-6 w-6 text-foreground" />
            <span className="text-[15px] font-bold tracking-tight text-foreground" style={{ letterSpacing: '-0.03em' }}>Buildrs</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <Lock className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="hidden sm:inline">Paiement sécurisé</span>
            </div>
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-transparent text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              {dark
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              }
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <div className="mx-auto max-w-[1000px] px-6 py-8">

        {/* Badge + Titre */}
        <div className="mb-8 text-center">
          <div className="mb-3 flex justify-center">
            <span className="rounded-full border border-border bg-secondary px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
              Offre de lancement · 200 places
            </span>
          </div>
          <h1 className="text-foreground" style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            Rejoins Buildrs Aujourd'hui
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* ── LEFT ── */}
          <div className="flex flex-col gap-5">

            {/* Blueprint card — neon border */}
            <div className="bump-neon relative" style={{ borderRadius: 20 }}>
              <div className="bump-inner text-left" style={{ borderRadius: 18 }}>

                {/* Toujours visible */}
                <div className="p-6 sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
                      Builders Blueprint
                    </p>
                    <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold flex-shrink-0" style={{ background: "hsl(var(--foreground))", color: "hsl(var(--background))" }}>
                      <Flame size={12} strokeWidth={1.5} />
                      Offre de lancement
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-[14px] font-medium text-muted-foreground/50 line-through">297€</span>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-[16px] font-semibold text-muted-foreground">€</span>
                        <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }} className="text-foreground">{basePrice}</span>
                      </div>
                      <span className="text-[12px] text-muted-foreground">· paiement unique</span>
                    </div>
                    <button
                      onClick={() => setOfferOpen(o => !o)}
                      className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 border border-border rounded-lg px-3 py-1.5"
                    >
                      {offerOpen ? 'Réduire' : 'Voir le détail'}
                      <ChevronDown size={13} strokeWidth={2} className="transition-transform duration-200" style={{ transform: offerOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                    </button>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">Bonus réclamés</span>
                      <span className="text-[11px] font-bold text-foreground tabular-nums">110 / 200</span>
                    </div>
                    <div className="h-[3px] rounded-full bg-border overflow-hidden">
                      <div className="h-full rounded-full bg-foreground" style={{ width: "55%" }} />
                    </div>
                  </div>
                </div>

                {/* Détail expandable */}
                {offerOpen && (
                  <div className="border-t border-border px-6 sm:px-8 pb-8 pt-6">
                    <ul className="mb-6 flex flex-col gap-[10px]">
                      {MAIN_FEATURES.map((f) => {
                        const dashIdx = f.indexOf(' — ')
                        return (
                          <li key={f} className="flex items-start gap-2.5">
                            <Check size={13} strokeWidth={2} className="mt-[2px] shrink-0 text-foreground" />
                            {dashIdx !== -1
                              ? <span className="text-muted-foreground text-[13px]"><span className="font-bold text-foreground">{f.slice(0, dashIdx)}</span> — {f.slice(dashIdx + 3)}</span>
                              : <span className="font-bold text-foreground text-[13px]">{f}</span>
                            }
                          </li>
                        )
                      })}
                    </ul>

                    <div className="border-t border-border pt-3 text-right">
                      <div className="text-[11px] text-muted-foreground/50 line-through">Valeur totale : 1 583€</div>
                      <div className="text-[12px] font-bold text-foreground">Ton prix aujourd'hui : {basePrice}€</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* OB 1 — Claude OS */}
            <BumpCard
              checked={hasOrderBump}
              onToggle={() => setHasOrderBump(!hasOrderBump)}
              name="Claude OS"
              strikeprice="97€"
              addprice={`+${claudeOSPrice}€`}
              title="Le même setup qu'on utilise pour générer +35K€/mois. Installe une fois, crée à l'infini."
              description='"Sans Claude OS tu peux builder. Avec, tu builds comme un pro."'
              detailOpen={claudeOSOpen}
              onToggleDetail={() => setClaudeOSOpen(o => !o)}
              features={CLAUDE_OS_FEATURES}
              accentColor="#a78bfa"
              icon={<ClaudeIcon size={16} className="text-foreground" />}
            />

            {/* OB 2 — Blueprint 100 Clients */}
            {!isClaudeFunnel && (
              <BumpCard
                checked={hasAcquisitionBump}
                onToggle={() => setHasAcquisitionBump(!hasAcquisitionBump)}
                name="Blueprint 100 Premiers Clients"
                strikeprice="197€"
                addprice="+27€"
                title="Ton Micro-SaaS IA est live. Maintenant il faut des clients."
                description="La méthode complète pour atteindre 100 clients payants — canaux, templates et guide de pricing inclus."
                detailOpen={acquisitionOpen}
                onToggleDetail={() => setAcquisitionOpen(o => !o)}
                features={ACQUISITION_FEATURES}
                accentColor="#60a5fa"
              />
            )}
          </div>

          {/* ── RIGHT — sticky summary ── */}
          <div className="lg:sticky lg:top-6 flex flex-col gap-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground mb-5">Récapitulatif</p>

              <div className="flex flex-col gap-2.5 mb-5">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-muted-foreground">Builders Blueprint</span>
                  <span className="font-semibold text-foreground">{basePrice}€</span>
                </div>
                {hasOrderBump && (
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-muted-foreground">Claude OS</span>
                    <span className="font-semibold text-foreground">+{claudeOSPrice}€</span>
                  </div>
                )}
                {!isClaudeFunnel && hasAcquisitionBump && (
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-muted-foreground">Blueprint 100 Clients</span>
                    <span className="font-semibold text-foreground">+{acquisitionPrice}€</span>
                  </div>
                )}
                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <span className="text-[14px] font-bold text-foreground">Total</span>
                  <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }} className="text-foreground">{total}€</span>
                </div>
              </div>

              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5 text-[11px] text-muted-foreground/60">
                  <span>110/200 places réclamées</span>
                  <span>Ensuite 297€</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                  <div className="h-full rounded-full bg-foreground/70" style={{ width: "55%" }} />
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-400">
                  {error}
                </div>
              )}

              <a
                href="#"
                onClick={(e) => { e.preventDefault(); handlePay() }}
                className="cta-rainbow relative flex w-full items-center justify-center gap-2 rounded-[10px] bg-foreground py-3.5 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 no-underline"
                style={{ opacity: loading ? 0.7 : 1, pointerEvents: loading ? 'none' : 'auto' }}
              >
                {loading ? 'Connexion...' : `Accéder au Blueprint — ${total}€ →`}
              </a>
              <p className="mt-3 text-center text-[12px] text-muted-foreground/60">
                Satisfait ou remboursé 30 jours · zéro condition
              </p>
              <p className="mt-3 text-center text-[12px] text-muted-foreground/60">
                Paiement sécurisé par Stripe · Accès immédiat · Aucun abonnement
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── STRIPE OVERLAY ── */}
      {showStripe && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-background/90 backdrop-blur-sm">
          <div className="mx-auto max-w-[560px] px-4 py-12">
            <div className="rounded-2xl border border-border bg-background overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <span className="text-[14px] font-semibold text-foreground">Paiement sécurisé</span>
                <button onClick={handleCloseStripe} className="text-muted-foreground hover:text-foreground transition-colors text-xl leading-none cursor-pointer" style={{ background: 'none', border: 'none', padding: 4 }}>×</button>
              </div>
              {/* Spinner pendant le chargement de Stripe */}
              {!stripeReady && (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
                  <span className="text-[13px] text-muted-foreground">Connexion sécurisée en cours…</span>
                </div>
              )}
              <div ref={mountRef} className={stripeReady ? '' : 'hidden'} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
