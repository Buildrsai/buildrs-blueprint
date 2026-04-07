import { useState, useEffect, useRef } from "react"
import { Check, ChevronLeft, Shield } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { BuildrsLogo } from "./ui/icons"
import { trackEvent } from "../lib/pixel"

const SUPABASE_FUNCTIONS_URL = "https://ihgbbgwhgmosfjaknvlf.supabase.co/functions/v1"

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props { onDecline: () => void }

// ─── Data ─────────────────────────────────────────────────────────────────────
const BLUEPRINT_FEATURES = [
  "7 modules opérationnels — de l'idée au MVP monétisé, étape par étape",
  "3 stratégies de départ : copier un SaaS qui marche, résoudre un problème réel, ou explorer",
  "50+ prompts testés à copier-coller — les instructions exactes à donner à l'IA",
  "Checklist de progression interactive — tu sais toujours quoi faire ensuite",
  "Configuration guidée du stack complet — chaque outil installé pas à pas",
  "3 modèles de monétisation : abonnement, revente du SaaS, prestation client",
  "Le Dashboard Buildrs — ton espace projet, outils et progression au même endroit",
  "Accès à vie + toutes les mises à jour futures",
]

// ─── Component ────────────────────────────────────────────────────────────────
export function ClaudeDownsellPage({ onDecline }: Props) {
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [showStripe, setShowStripe] = useState(false)
  const checkoutRef = useRef<{ destroy: () => void } | null>(null)
  const mountRef    = useRef<HTMLDivElement>(null)

  // Lire le prior_session_id depuis l'URL (passé en param si disponible)
  const hashParams = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.hash.split('?')[1] ?? '' : ''
  )
  const priorSessionId = hashParams.get('session_id') ?? undefined

  useEffect(() => () => { checkoutRef.current?.destroy() }, [])

  const handlePay = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-claude-downsell`, {
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
      trackEvent('InitiateCheckout', { value: 27, currency: 'EUR', num_items: 1 })
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

  return (
    <div className="dark">
    <div className="min-h-screen bg-background">

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-border bg-background/85 backdrop-blur-xl px-6 py-4">
        <div className="mx-auto flex max-w-[680px] items-center justify-between">
          <BuildrsLogo color="hsl(var(--foreground))" iconSize={22} fontSize={15} fontWeight={700} />
          <span className="rounded-full border border-border bg-card px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Offre spéciale
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
              <span className="text-[14px] font-bold text-foreground">Buildrs Blueprint — 27€</span>
            </div>
            <div ref={mountRef} />
          </div>
        ) : (
          <>
            {/* ── BADGE ── */}
            <div className="mb-7 flex justify-center">
              <span className="rounded-full border border-border bg-muted px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                Une dernière chose avant de partir
              </span>
            </div>

            {/* ── TITRE ── */}
            <div className="mb-10 text-center">
              <h1
                className="mb-4 text-foreground"
                style={{ fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.08 }}
              >
                Tu as Claude.<br />
                Voici quoi construire avec.
              </h1>
              <p className="mx-auto max-w-[500px] text-[15px] leading-[1.75] text-muted-foreground">
                Buildrs Blueprint — le système complet pour passer de l'idée au MVP monétisé en 72h. 7 modules, 50+ prompts, le stack complet.
              </p>
            </div>

            {/* ── BLOC BLUEPRINT ── */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden mb-5">

              {/* Header */}
              <div className="px-7 pt-7 pb-5 border-b border-border">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em]"
                    style={{ background: 'rgba(77,150,255,0.12)', border: '1px solid rgba(77,150,255,0.3)', color: '#4d96ff' }}>
                    Buildrs Blueprint
                  </span>
                  <span className="rounded-full border border-border bg-muted px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                    7 modules
                  </span>
                  <span className="rounded-full border border-border bg-muted px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                    Accès à vie
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="px-7 py-6">
                <ul className="flex flex-col gap-[10px]">
                  {BLUEPRINT_FEATURES.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check size={14} strokeWidth={2} className="mt-[2px] shrink-0 text-foreground" />
                      <span className="text-[13px] leading-[1.6] text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prix + CTA */}
              <div className="px-7 pb-7">
                <div className="mb-1 flex items-baseline gap-3">
                  <span className="text-[16px] font-medium text-muted-foreground/40 line-through">297€</span>
                  <span className="text-foreground" style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>
                    27€
                  </span>
                  <span className="text-[13px] text-muted-foreground">· une fois</span>
                </div>
                <p className="mb-6 text-[12px] text-muted-foreground/60">
                  Le complément naturel à Claude By Buildrs.
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
                  ) : "Ajouter le Blueprint — 27€ →"}
                </button>

                {error && <p className="mt-2 text-center text-[12px] text-red-500">{error}</p>}

                {/* Garantie */}
                <div className="mt-4 flex items-center justify-center gap-2 text-[12px] text-muted-foreground">
                  <Shield size={13} strokeWidth={1.5} className="shrink-0" />
                  Satisfait ou remboursé 30 jours — sans condition.
                </div>
              </div>
            </div>

            {/* ── DECLINE ── */}
            <div className="text-center">
              <button
                onClick={onDecline}
                className="text-[13px] text-muted-foreground/50 underline underline-offset-4 hover:text-muted-foreground transition-colors cursor-pointer"
              >
                Non merci, accéder directement à mon dashboard →
              </button>
            </div>
          </>
        )}

      </main>

    </div>
    </div>
  )
}
