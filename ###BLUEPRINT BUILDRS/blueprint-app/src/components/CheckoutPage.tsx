import { useState, useEffect, useRef } from "react"

import { Shield, Lock, Check, Flame, ChevronLeft, Star, Zap, Gift } from "lucide-react"
import { trackEvent } from '../lib/pixel'
import { loadStripe } from "@stripe/stripe-js"
import { BuildrsIcon, BrandIcons } from "./ui/icons"

// ─── Types ────────────────────────────────────────────────────────────────────

const SUPABASE_FUNCTIONS_URL = 'https://ihgbbgwhgmosfjaknvlf.supabase.co/functions/v1'

interface CheckoutPageProps {
  hasOrderBump: boolean
  setHasOrderBump: (v: boolean) => void
  onPay: () => void
  onBack: () => void
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const blueprintFeatures = [
  "6 modules complets — de l'idée au produit monétisé",
  "Dashboard interactif + prompts + outils + générateurs",
  "Accès à vie · Mises à jour incluses",
]

const blueprintBonuses = [
  "3 générateurs IA (idées, validation, MRR)",
  "Accès canal WhatsApp premium — 7 jours",
]

const claudePackFeatures = [
  "Paramétrage complet de Claude (system prompt, mémoire, contexte projet)",
  "Tous les prompts spécialisés par étape du Blueprint",
  "Les Skills — des agents IA spécialisés à brancher (design, dev, archi, copy)",
  "Les fichiers mémoire projet pour que Claude ne reparte jamais de zéro",
  "Guide Claude Code + VS Code (opérationnel en 15 min)",
  "Claude Cowork, Dispatch et Code expliqués simplement",
  "Workflows et repos GitHub prêts à l'emploi — des sous-agents qui travaillent pour ton projet en parallèle",
]

const communitySaaS = [
  {
    name: "ResumeAI",
    desc: "Générateur de CV optimisé par IA — 3 abonnés payants en 48h",
    mrr: "147€/mois",
  },
  {
    name: "ScriptForge",
    desc: "Générateur de scripts vidéo pour créateurs — lancé en 5 jours",
    mrr: "289€/mois",
  },
  {
    name: "LeadPulse",
    desc: "Outil d'enrichissement de leads B2B alimenté par Claude",
    mrr: "612€/mois",
  },
]

// ─── Countdown ────────────────────────────────────────────────────────────────

function useCountdown(target: Date) {
  function getRemaining(t: Date) {
    const diff = Math.max(0, t.getTime() - Date.now())
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    }
  }
  const [time, setTime] = useState(() => getRemaining(target))
  useEffect(() => {
    const id = setInterval(() => setTime(getRemaining(target)), 1000)
    return () => clearInterval(id)
  }, [target])
  return time
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CheckoutPage({ hasOrderBump, setHasOrderBump, onBack }: CheckoutPageProps) {
  const [dark, setDark] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showStripe, setShowStripe] = useState(false)
  const checkoutRef = useRef<{ destroy: () => void } | null>(null)
  const mountRef = useRef<HTMLDivElement>(null)

  const lotteryDeadline = new Date('2026-04-14T23:59:59')
  const { d, h, m, s } = useCountdown(lotteryDeadline)

  const basePrice = 27
  const bumpPrice = 37
  const total = hasOrderBump ? basePrice + bumpPrice : basePrice

  // Cleanup embedded checkout on unmount
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
        body: JSON.stringify({ has_order_bump: hasOrderBump }),
      })
      const data = await res.json()
      if (!res.ok || !data.clientSecret) throw new Error(data.error ?? 'Erreur de connexion à Stripe')

      const stripe = await loadStripe(data.publishableKey)
      if (!stripe) throw new Error('Stripe non disponible')

      // Destroy previous instance if any
      checkoutRef.current?.destroy()

      const checkout = await stripe.initEmbeddedCheckout({
        clientSecret: data.clientSecret,
      })

      trackEvent('InitiateCheckout', { value: total, currency: 'EUR', num_items: 1 })
      setShowStripe(true)
      // Wait for DOM to render the mount point
      setTimeout(() => {
        if (mountRef.current) {
          checkout.mount(mountRef.current)
          checkoutRef.current = checkout
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
          <a href="#/" onClick={(e) => { e.preventDefault(); onBack() }} className="flex items-center gap-2 no-underline">
            <BuildrsIcon color="currentColor" className="h-6 w-6 text-foreground" />
            <span className="text-[15px] font-bold tracking-tight text-foreground" style={{ letterSpacing: '-0.03em' }}>Buildrs</span>
          </a>
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

      {/* BACK */}
      <div className="mx-auto max-w-[1000px] px-6 pt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
          Retour
        </button>
      </div>

      {/* MAIN */}
      <div className="mx-auto max-w-[1000px] px-6 py-10">

        {/* Header */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Finalise ta commande</p>
          <h1 className="text-foreground" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.1 }}>
            Accède au Buildrs Blueprint
          </h1>
          <p className="mx-auto mt-3 max-w-[420px] text-[15px] leading-[1.65] text-muted-foreground">
            Un seul paiement. Accès à vie. Ton premier produit en 72h.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* LEFT — Product + Order Bump */}
          <div className="flex flex-col gap-5">

            {/* Blueprint card — même contenu que la LP */}
            <div className="bump-neon relative" style={{ borderRadius: 20 }}>
              <div className="bump-inner p-8 text-left" style={{ borderRadius: 18 }}>

                {/* Header row */}
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Buildrs Blueprint</p>
                  <span
                    className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold"
                    style={{ background: "hsl(var(--foreground))", color: "hsl(var(--background))" }}
                  >
                    <Flame size={12} strokeWidth={1.5} />
                    Offre de lancement
                  </span>
                </div>

                {/* Price */}
                <div className="mb-1 flex items-baseline gap-2">
                  <span className="text-[18px] font-medium text-muted-foreground/50 line-through">297€</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[22px] font-semibold text-muted-foreground">€</span>
                    <span style={{ fontSize: 64, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }} className="text-foreground">27</span>
                  </div>
                </div>
                <p className="mb-7 text-[14px] text-muted-foreground">Paiement unique · Accès à vie</p>

                <hr className="mb-7 border-border" />

                {/* Features */}
                <ul className="mb-6 flex flex-col gap-[10px] text-[14px] text-muted-foreground">
                  {blueprintFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check size={15} strokeWidth={2} className="mt-[1px] shrink-0 text-foreground" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Bonuses */}
                <div className="rounded-xl border border-dashed border-border bg-muted px-4 py-4">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">Bonus inclus</p>
                  <ul className="flex flex-col gap-[10px]">
                    {blueprintBonuses.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-[14px] text-foreground font-medium">
                        <Zap size={14} strokeWidth={1.5} className="mt-[2px] shrink-0 text-foreground" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-foreground/70">
                  <Flame size={12} strokeWidth={1.5} />
                  Offre de lancement — 82/100 places prises · Ensuite 297€
                </p>
              </div>
            </div>

            {/* Order Bump */}
            <button
              onClick={() => setHasOrderBump(!hasOrderBump)}
              className={`w-full text-left rounded-2xl border-2 p-6 transition-all cursor-pointer ${
                hasOrderBump
                  ? 'border-foreground bg-card'
                  : 'border-border bg-card hover:border-foreground/30'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                  hasOrderBump ? 'border-foreground bg-foreground' : 'border-border bg-background'
                }`}>
                  {hasOrderBump && <Check size={11} strokeWidth={3} className="text-background" />}
                </div>

                <div className="flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">
                      Oui — ajouter
                    </span>
                    <span className="text-[14px] font-bold text-foreground">Module Claude — +37€</span>
                    <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      Fais de Claude une machine de production
                    </span>
                  </div>

                  <p className="mb-3 text-[13px] text-muted-foreground leading-[1.55]">
                    Un environnement Claude pré-configuré pour créer des SaaS et des apps. Un téléchargement, tout est prêt.
                  </p>

                  <ul className="flex flex-col gap-2">
                    {claudePackFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                        <Check size={12} strokeWidth={2} className="mt-[2px] shrink-0 text-foreground" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </button>

          </div>

          {/* RIGHT — Summary + CTA or inline Stripe */}
          <div className="lg:sticky lg:top-6 flex flex-col gap-4">

            {showStripe ? (
              /* ── Inline Stripe Embedded Checkout ── */
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                  <button
                    onClick={handleCloseStripe}
                    className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                    Modifier ma commande
                  </button>
                  <span className="text-[13px] font-semibold text-foreground">{total}€</span>
                </div>
                <div ref={mountRef} />
              </div>
            ) : (
              <>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.09em] text-muted-foreground">Récapitulatif</p>

                  <div className="flex flex-col gap-2.5 text-[13px]">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Buildrs Blueprint</span>
                      <span className="font-medium text-foreground">27€</span>
                    </div>
                    {hasOrderBump && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Module Claude</span>
                        <span className="font-medium text-foreground">+37€</span>
                      </div>
                    )}
                    <hr className="border-border my-1" />
                    <div className="flex items-end justify-between">
                      <span className="font-bold text-foreground">Total</span>
                      <div className="text-right">
                        <span className="text-[22px] font-extrabold text-foreground" style={{ letterSpacing: '-0.02em' }}>{total}€</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handlePay}
                    disabled={loading}
                    className="cta-rainbow relative mt-5 flex w-full items-center justify-center rounded-[10px] bg-foreground py-4 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                        Chargement…
                      </span>
                    ) : (
                      `Payer — ${total}€ →`
                    )}
                  </button>

                  {error && (
                    <p className="mt-2 text-center text-[12px] text-red-500">{error}</p>
                  )}

                  <p className="mt-3 text-center text-[11px] text-muted-foreground/50">
                    Paiement sécurisé par Stripe · Accès immédiat · Aucun abonnement
                  </p>
                </div>

                {/* Trust */}
                <div className="flex flex-col gap-2">
                  {[
                    { icon: Shield, text: 'Paiement sécurisé Stripe' },
                    { icon: Lock,   text: 'SSL 256-bit' },
                    { icon: Check,  text: 'Satisfait ou remboursé 30j' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-[12px] text-muted-foreground">
                      <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                      {text}
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                    <BrandIcons.stripe className="h-3.5 w-3.5 shrink-0" />
                    Visa / Mastercard / AMEX
                  </div>
                </div>

                {/* Social proof — SaaS lancés par la communauté */}
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60 px-1">
                    SaaS IA lancés par la communauté
                  </p>
                  {communitySaaS.map((s) => (
                    <div key={s.name} className="rounded-xl border border-border bg-card px-4 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-bold text-foreground">{s.name}</span>
                        <span className="text-[11px] font-semibold text-foreground/70">{s.mrr}</span>
                      </div>
                      <p className="text-[12px] text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        </div>

        {/* ─── LOTTERY BLOCK ─────────────────────────────────────────────────── */}
        <div className="relative mx-auto mt-14 max-w-[1000px] overflow-hidden rounded-3xl" style={{ background: 'hsl(var(--card))' }}>

          {/* Purple glow top */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.6) 40%, rgba(168,85,247,0.6) 60%, transparent 100%)' }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-40"
            style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 0%, rgba(168,85,247,0.12) 0%, transparent 100%)' }}
          />

          <div className="relative px-8 py-10 sm:px-12 sm:py-12">

            {/* Top row */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1" style={{ borderColor: 'rgba(168,85,247,0.35)', background: 'rgba(168,85,247,0.08)' }}>
                  <Gift size={12} strokeWidth={1.5} style={{ color: 'rgba(168,85,247,0.9)' }} />
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(168,85,247,0.9)' }}>Tirage au sort</span>
                </div>
                <h3 className="text-foreground" style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                  Gagne l'un des 2 lots<br />avant le 14 avril
                </h3>
                <p className="mt-2 text-[14px] text-muted-foreground">Participation automatique à l'achat — aucune démarche.</p>
              </div>

              {/* Countdown */}
              <div className="shrink-0">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">Temps restant</p>
                <div className="flex items-end gap-1.5">
                  {([
                    { label: 'J',  val: d },
                    { label: 'H',  val: h },
                    { label: 'M',  val: m },
                    { label: 'S',  val: s },
                  ] as const).map(({ label, val }, i) => (
                    <div key={label} className="flex items-end gap-1.5">
                      <div className="text-center">
                        <div
                          className="rounded-xl border border-border bg-background font-mono font-extrabold text-foreground flex items-center justify-center"
                          style={{ fontSize: 'clamp(18px, 3vw, 26px)', letterSpacing: '-0.02em', width: 52, height: 52 }}
                        >
                          {String(val).padStart(2, '0')}
                        </div>
                        <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/40">{label}</p>
                      </div>
                      {i < 3 && <span className="text-[18px] font-bold text-muted-foreground/25 pb-5">:</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Lots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Lot 1 */}
              <div className="relative overflow-hidden rounded-2xl border border-border bg-background p-6">
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{ background: 'radial-gradient(ellipse 80% 60% at 0% 0%, rgba(168,85,247,0.06) 0%, transparent 70%)' }}
                />
                <div className="relative">
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-extrabold"
                      style={{ background: 'rgba(168,85,247,0.12)', color: 'rgba(168,85,247,0.9)' }}
                    >1</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">Lot 1</span>
                  </div>
                  <p className="text-[16px] font-extrabold text-foreground leading-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
                    Micro-SaaS clé en main
                  </p>
                  <p className="text-[13px] leading-[1.6] text-muted-foreground">
                    Construit et lancé par Buildrs — jusqu'à <span className="font-semibold text-foreground">1 000€ MRR</span> garanti au démarrage.
                  </p>
                </div>
              </div>

              {/* Lot 2 */}
              <div className="relative overflow-hidden rounded-2xl border border-border bg-background p-6">
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{ background: 'radial-gradient(ellipse 80% 60% at 0% 0%, rgba(168,85,247,0.06) 0%, transparent 70%)' }}
                />
                <div className="relative">
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-extrabold"
                      style={{ background: 'rgba(168,85,247,0.12)', color: 'rgba(168,85,247,0.9)' }}
                    >2</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">Lot 2</span>
                  </div>
                  <p className="text-[16px] font-extrabold text-foreground leading-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
                    1 an de coaching avec Alfred
                  </p>
                  <p className="text-[13px] leading-[1.6] text-muted-foreground">
                    Accompagnement direct avec <span className="font-semibold text-foreground">Alfred Orsini</span> pendant 12 mois complets.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Purple glow bottom line */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.3) 50%, transparent 100%)' }}
          />
        </div>

        {/* Bottom note */}
        <p className="mt-8 text-center text-[12px] text-muted-foreground/50 flex items-center justify-center gap-1.5">
          <Flame size={12} strokeWidth={1.5} className="text-foreground/40" />
          Offre de lancement · Places limitées
        </p>

      </div>


    </div>
  )
}
