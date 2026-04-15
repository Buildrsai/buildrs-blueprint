import { useState, useEffect, useRef } from "react"
import { Check, ChevronLeft, Shield } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { BuildrsLogo } from "./ui/icons"
import { trackEvent } from "../lib/pixel"
import {
  RobotValidator,
  RobotPlanner,
  RobotDesigner,
  RobotArchitect,
  RobotBuilder,
  RobotLauncher,
} from "./ui/agent-robots"

function RobotJarvis({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="0" width="2" height="3" fill="#818cf8"/>
      <rect x="15" y="0" width="2" height="3" fill="#818cf8"/>
      <rect x="5" y="2" width="2" height="2" fill="#818cf8"/>
      <rect x="17" y="2" width="2" height="2" fill="#818cf8"/>
      <rect x="3" y="4" width="18" height="12" rx="2" fill="#6366f1"/>
      <rect x="6" y="7" width="4" height="4" rx="1" fill="#c7d2fe"/>
      <rect x="14" y="7" width="4" height="4" rx="1" fill="#c7d2fe"/>
      <rect x="7" y="8" width="2" height="2" fill="#312e81"/>
      <rect x="15" y="8" width="2" height="2" fill="#312e81"/>
      <rect x="9" y="13" width="6" height="2" rx="1" fill="#4338ca"/>
      <rect x="5" y="17" width="4" height="4" rx="1" fill="#4338ca"/>
      <rect x="15" y="17" width="4" height="4" rx="1" fill="#4338ca"/>
      <rect x="4" y="20" width="3" height="2" rx="1" fill="#4338ca"/>
      <rect x="17" y="20" width="3" height="2" rx="1" fill="#4338ca"/>
    </svg>
  )
}

const SUPABASE_FUNCTIONS_URL = "https://ihgbbgwhgmosfjaknvlf.supabase.co/functions/v1"

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props { onDecline: () => void }

// ─── Agents data ─────────────────────────────────────────────────────────────
const AGENTS = [
  {
    Robot: RobotJarvis,
    name: "Jarvis",
    color: "#6366f1",
    unlimited: true,
    desc: "Ton copilote principal. Coordonne tous les agents, oriente ta stratégie et répond à toutes tes questions en temps réel.",
  },
  {
    Robot: RobotValidator,
    name: "Validator",
    color: "#22c55e",
    unlimited: true,
    desc: "Trouve une idée rentable ou valide la tienne — scanne la concurrence et te donne un score /100. Sans limite.",
  },
  {
    Robot: RobotPlanner,
    name: "Planner",
    color: "#3b82f6",
    unlimited: false,
    desc: "Génère ton cahier des charges complet — features, parcours utilisateur, priorités. En 15 minutes.",
  },
  {
    Robot: RobotDesigner,
    name: "Designer",
    color: "#f43f5e",
    unlimited: false,
    desc: "Crée ton identité visuelle — palette, typo, design system, maquettes. Sans ouvrir Figma.",
  },
  {
    Robot: RobotArchitect,
    name: "Architect",
    color: "#f97316",
    unlimited: false,
    desc: "Conçoit ta BDD, ton auth, tes API, ta sécurité. Produit ton CLAUDE.md prêt à builder.",
  },
]

// ─── Timer hook (15 min) ──────────────────────────────────────────────────────
function useTimer15() {
  const [end] = useState(() => Date.now() + 15 * 60 * 1000)
  const get = () => {
    const diff = Math.max(0, end - Date.now())
    return {
      m: Math.floor(diff / 60000),
      s: Math.floor((diff % 60000) / 1000),
      expired: diff === 0,
    }
  }
  const [t, setT] = useState(get)
  useEffect(() => {
    const id = setInterval(() => setT(get()), 1000)
    return () => clearInterval(id)
  })
  return t
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ClaudeOTOPage({ onDecline }: Props) {
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [showStripe, setShowStripe] = useState(false)
  const checkoutRef = useRef<{ destroy: () => void } | null>(null)
  const mountRef    = useRef<HTMLDivElement>(null)
  const { m, s, expired } = useTimer15()

  // Lire les params depuis l'URL (cowork, blueprint, session_id)
  const hashParams = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.hash.split('?')[1] ?? '' : ''
  )
  const priorSessionId = hashParams.get('session_id') ?? undefined

  // Fire Purchase event on mount (arrival from Stripe return_url)
  useEffect(() => {
    if (!priorSessionId) return
    const cowork    = hashParams.get('cowork') === '1'
    const blueprint = hashParams.get('blueprint') === '1'
    const value = 47 + (cowork ? 37 : 0) + (blueprint ? 27 : 0)
    trackEvent('Purchase', { value, currency: 'EUR', num_items: 1 })
  }, [])

  useEffect(() => () => { checkoutRef.current?.destroy() }, [])

  const displayPrice = expired ? 197 : 147

  const handlePay = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-claude-oto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prior_session_id: priorSessionId,
          origin:           window.location.origin,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.clientSecret) throw new Error(data.error ?? "Erreur Stripe")
      const stripe = await loadStripe(data.publishableKey)
      if (!stripe) throw new Error("Stripe indisponible")
      checkoutRef.current?.destroy()
      const checkout = await stripe.initEmbeddedCheckout({ clientSecret: data.clientSecret })
      setShowStripe(true)
      setTimeout(() => {
        if (mountRef.current) { checkout.mount(mountRef.current); checkoutRef.current = checkout }
      }, 50)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const handleCloseStripe = () => {
    checkoutRef.current?.destroy()
    checkoutRef.current = null
    setShowStripe(false)
  }

  const handleDecline = () => { onDecline() }

  return (
    <div className="min-h-screen bg-background">

      {/* ── BANDEAU CONFIRMATION ─────────────────────────────────────────────── */}
      <div style={{ background: 'rgba(34,197,94,0.08)', borderBottom: '1px solid rgba(34,197,94,0.2)' }}>
        <div className="px-6 py-3 text-center">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" stroke="#22c55e" />
              </svg>
              <p className="text-[13px] font-semibold" style={{ color: '#22c55e' }}>
                Félicitations — ton paiement est confirmé. Ton accès est prêt.
              </p>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Avant d'accéder à ton dashboard — une offre exclusive, visible une seule fois.
            </p>
          </div>
        </div>
      </div>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-border bg-background/85 backdrop-blur-xl px-6 py-4">
        <div className="mx-auto flex max-w-[680px] items-center justify-between">
          <BuildrsLogo color="hsl(var(--foreground))" iconSize={22} fontSize={15} fontWeight={700} />
          <span className="rounded-full border border-border bg-card px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Étape 2 / 2
          </span>
        </div>
      </header>

      {/* ── MAIN ───────────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-[680px] px-6 py-14">

        {showStripe ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <button
                onClick={handleCloseStripe}
                className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} strokeWidth={1.5} />
                Retour
              </button>
              <span className="text-[14px] font-bold text-foreground">Pack Agents — {displayPrice}€</span>
            </div>
            <div ref={mountRef} />
          </div>
        ) : (
          <>
            {/* ── BADGE ── */}
            <div className="mb-7 flex justify-center">
              <span className="rounded-full border border-border bg-muted px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                Offre exclusive · Uniquement sur cette page
              </span>
            </div>

            {/* ── TITRE ── */}
            <div className="mb-10 text-center">
              <h1
                className="mb-4 text-foreground"
                style={{ fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.08 }}
              >
                Tu as la machine. Voici l'équipe qui construit avec toi.
              </h1>
              <p className="mx-auto max-w-[520px] text-[15px] leading-[1.75] text-muted-foreground">
                5 agents IA spécialisés qui produisent tes livrables à chaque étape. Ton cahier des charges, ton design, ton architecture, ton code — en quelques minutes au lieu de quelques jours.
              </p>
            </div>

            {/* ── BLOC PACK AGENTS ── */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden mb-5">

              {/* Header */}
              <div className="px-7 pt-7 pb-5 border-b border-border">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em]"
                    style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}>
                    Pack Agents IA
                  </span>
                  <span className="rounded-full border border-border bg-muted px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                    5 agents
                  </span>
                  <span className="rounded-full border border-border bg-muted px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                    Accès à vie
                  </span>
                </div>
              </div>

              {/* Liste agents */}
              <div className="divide-y divide-border">
                {AGENTS.map(({ Robot, name, color, unlimited, desc }) => (
                  <div key={name} className="flex items-start gap-4 px-7 py-5 hover:bg-secondary/20 transition-colors">
                    <div className="shrink-0 mt-0.5">
                      <Robot size={40} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        <p className="text-[14px] font-bold" style={{ color }}>{name}</p>
                        {unlimited && (
                          <span className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                            style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }}>
                            Illimité
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] leading-[1.6] text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Prix + CTA */}
              <div className="px-7 pb-7">
                <div className="mb-1 flex items-baseline gap-3">
                  {!expired && (
                    <span className="text-[16px] font-medium text-muted-foreground/40 line-through">197€</span>
                  )}
                  <span className="text-foreground" style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>
                    {displayPrice}€
                  </span>
                  <span className="text-[13px] text-muted-foreground">· une fois</span>
                </div>
                <p className="mb-6 text-[12px] text-muted-foreground/60">
                  {expired
                    ? "L'offre à 147€ a expiré — tarif standard 197€."
                    : "Soit 29€ par agent. Un freelance te coûterait 500€ par livrable."}
                </p>

                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="cta-rainbow relative w-full rounded-[10px] bg-foreground py-4 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Chargement…
                    </span>
                  ) : `Ajouter le Pack Agents — ${displayPrice}€ →`}
                </button>

                {error && <p className="mt-2 text-center text-[12px] text-red-500">{error}</p>}

                {/* Garantie */}
                <div className="mt-4 flex items-center justify-center gap-2 text-[12px] text-muted-foreground">
                  <Shield size={13} strokeWidth={1.5} className="shrink-0" />
                  Satisfait ou remboursé 30 jours — sans condition.
                </div>

                {/* Timer */}
                <div className="mt-5 rounded-xl border border-border bg-background/50 px-5 py-3 text-center">
                  {expired ? (
                    <p className="text-[12px] font-semibold text-muted-foreground">
                      L'offre à 147€ a expiré.
                    </p>
                  ) : (
                    <>
                      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
                        Cette offre expire dans
                      </p>
                      <p className="text-[22px] font-extrabold text-foreground tabular-nums" style={{ letterSpacing: '-0.02em', fontFamily: 'Geist Mono, monospace' }}>
                        {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ── DECLINE ── */}
            <div className="text-center">
              <button
                onClick={handleDecline}
                className="text-[13px] text-muted-foreground/50 underline underline-offset-4 hover:text-muted-foreground transition-colors cursor-pointer"
              >
                Non merci, accéder directement à mon dashboard →
              </button>
            </div>
          </>
        )}

      </main>

    </div>
  )
}
