import { useState, useEffect, useRef } from "react"

import { Shield, Lock, Check, Flame, ChevronLeft, Star, Zap, ArrowUp, ChevronDown } from "lucide-react"
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

// Détail complet identique LP (expanded)
const blueprintFeaturesLP = [
  "Le Dashboard Buildrs — ton QG de lancement, tout au même endroit",
  "Jarvis IA — ton copilote intelligent qui te guide en temps réel",
  "7 modules opérationnels — de l'idée au MVP monétisé, étape par étape",
  "50+ prompts testés à copier-coller — les instructions exactes à donner à Claude",
  "Configuration guidée du stack complet — chaque outil installé pas à pas, zéro galère",
  "Checklist de progression interactive — tu sais toujours exactement où tu en es",
  "3 stratégies de départ : copier un SaaS qui marche, résoudre un problème réel, ou explorer les opportunités",
  "3 modèles de monétisation : revenus récurrents (MRR), revente de SaaS, ou commande client",
  "Accès à vie + toutes les mises à jour futures",
]

const blueprintBonusesLP = [
  "NicheFinder™ — génère des idées de micro-SaaS rentables en quelques clics",
  "MarketPulse™ — analyse et valide ta niche · score tes concurrents avant de construire",
  "FlipCalc™ — projette ton MRR (revenus mensuels) et ton prix de revente",
  "Toolbox Pro — les meilleurs outils IA du vibecoder avec guide de config inclus",
  "Blueprint Acquisition — le guide pour trouver tes 100 premiers utilisateurs",
  "Accès WhatsApp Buildrs — le groupe privé en accès direct",
]

const claudePackFeatures = [
  "L'environnement Claude exact utilisé chez Buildrs — prêt à l'emploi en un téléchargement",
  "System prompts, mémoire projet et contexte pré-configurés — Claude ne repart jamais de zéro",
  "Les Skills (sous-agents spécialisés) : design, dev, archi, copy, debug — chacun expert dans son domaine",
  "Connecteurs MCP : Supabase, GitHub, Stripe, Vercel, Figma — Claude accède directement à tes outils",
  "Workflows multi-agents : des sous-agents qui travaillent en parallèle sur ton projet",
  "Guide Claude Code + VS Code opérationnel en 15 min",
]

const socialProof = [
  {
    name: "Hugo",
    role: "Étudiant → Builder",
    text: "J'ai lancé un SaaS de prise de RDV pour les coiffeurs pendant mes cours. 300€/mois. Mes potes n'y croient toujours pas.",
  },
  {
    name: "Thomas",
    role: "Consultant → Fondateur SaaS",
    text: "Avec les prompts du module 4, j'avais une base complète en quelques heures. 23 clients payants aujourd'hui.",
  },
  {
    name: "Romain",
    role: "Freelance → Product Builder",
    text: "En 72h j'avais un outil fonctionnel en ligne. Pas parfait, mais live. Et ça change tout.",
  },
]

// ─── Countdown ────────────────────────────────────────────────────────────────

const LAUNCH_END = new Date('2026-04-01T23:59:59')

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
  const [offerOpen, setOfferOpen] = useState(false)
  const [claudeOpen, setClaudeOpen] = useState(false)
  const checkoutRef = useRef<{ destroy: () => void } | null>(null)
  const mountRef = useRef<HTMLDivElement>(null)

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
            Rejoins Buildrs
          </h1>
          <p className="mx-auto mt-3 max-w-[520px] text-[15px] leading-[1.65] text-muted-foreground">
            Le système guidé pour créer et monétiser ton premier SaaS IA en autopilote.
          </p>
          <p className="mx-auto mt-2 text-[13px] text-muted-foreground/60">
            Un seul paiement · Accès à vie
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* LEFT — Product + Order Bump */}
          <div className="flex flex-col gap-5">

            {/* Blueprint card */}
            <div className="bump-neon relative" style={{ borderRadius: 20 }}>
              <div className="bump-inner text-left" style={{ borderRadius: 18 }}>

                {/* ── BANDEAU TOUJOURS VISIBLE ── */}
                <div className="p-6 sm:p-7">
                  {/* Row 1 : label + badge */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Buildrs Blueprint</p>
                    <span
                      className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold flex-shrink-0"
                      style={{ background: "hsl(var(--foreground))", color: "hsl(var(--background))" }}
                    >
                      <Flame size={12} strokeWidth={1.5} />
                      Offre de lancement
                    </span>
                  </div>

                  {/* Row 2 : prix + toggle */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-[14px] font-medium text-muted-foreground/50 line-through">297€</span>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-[16px] font-semibold text-muted-foreground">€</span>
                        <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }} className="text-foreground">27</span>
                      </div>
                      <span className="text-[12px] text-muted-foreground">· paiement unique</span>
                    </div>
                    <button
                      onClick={() => setOfferOpen(o => !o)}
                      className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 border border-border rounded-lg px-3 py-1.5"
                    >
                      {offerOpen ? 'Réduire' : 'Voir le détail'}
                      <ChevronDown
                        size={13}
                        strokeWidth={2}
                        className="transition-transform duration-200"
                        style={{ transform: offerOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                    </button>
                  </div>

                  {/* Row 3 : barre bonus */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">Bonus réclamés</span>
                      <span className="text-[11px] font-bold text-foreground tabular-nums">76 / 200</span>
                    </div>
                    <div className="h-[3px] rounded-full bg-border overflow-hidden">
                      <div className="h-full rounded-full bg-foreground" style={{ width: '38%' }} />
                    </div>
                  </div>
                </div>

                {/* ── DÉTAIL COMPLET LP — expandable ── */}
                {offerOpen && (
                  <div className="border-t border-border px-6 sm:px-8 pb-8 pt-6">
                    <ul className="mb-6 flex flex-col gap-[10px]">
                      {blueprintFeaturesLP.map((f) => {
                        const isJarvis = f.startsWith('Jarvis IA')
                        const dashIdx = f.indexOf(' — ')
                        const colonIdx = f.indexOf(' : ')
                        let content: React.ReactNode
                        if (isJarvis) {
                          const desc = dashIdx !== -1 ? f.slice(dashIdx + 3) : null
                          content = (
                            <span className="text-muted-foreground text-[14px]">
                              <span className="font-bold" style={{ background: 'linear-gradient(90deg, #cc5de8, #4d96ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Jarvis IA</span>
                              {desc && <> — {desc}</>}
                            </span>
                          )
                        } else if (dashIdx !== -1) {
                          content = <span className="text-muted-foreground text-[14px]"><span className="font-bold text-foreground">{f.slice(0, dashIdx)}</span> — {f.slice(dashIdx + 3)}</span>
                        } else if (colonIdx !== -1) {
                          content = <span className="text-muted-foreground text-[14px]"><span className="font-bold text-foreground">{f.slice(0, colonIdx)}</span> : {f.slice(colonIdx + 3)}</span>
                        } else {
                          content = <span className="font-bold text-foreground text-[14px]">{f}</span>
                        }
                        return (
                          <li key={f} className="flex items-start gap-2.5">
                            <Check size={15} strokeWidth={2} className="mt-[2px] shrink-0 text-foreground" />
                            {content}
                          </li>
                        )
                      })}
                    </ul>

                    <div className="rounded-xl border border-dashed border-border bg-muted px-4 py-4">
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">Bonus inclus pour les 200 premiers</p>
                      <ul className="flex flex-col gap-[10px]">
                        {blueprintBonusesLP.map((b) => {
                          const dashIdx = b.indexOf(' — ')
                          const name = dashIdx !== -1 ? b.slice(0, dashIdx) : b
                          const desc = dashIdx !== -1 ? b.slice(dashIdx + 3) : null
                          return (
                            <li key={b} className="flex items-start gap-2.5 text-[14px]">
                              <Zap size={14} strokeWidth={1.5} className="mt-[2px] shrink-0 text-foreground" />
                              <span className="text-muted-foreground">
                                <span className="font-bold text-foreground">{name}</span>
                                {desc && <> — {desc}</>}
                              </span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>

                    <button
                      onClick={() => setOfferOpen(false)}
                      className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronDown size={13} strokeWidth={2} style={{ transform: 'rotate(180deg)' }} />
                      Réduire
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* Order Bump — Claude 360° */}
            <div className={`rounded-2xl border-2 transition-all overflow-hidden ${
              hasOrderBump ? 'border-foreground bg-card' : 'border-border bg-card'
            }`}>

              {/* ── BANDEAU : checkbox + titre + prix + 1ère feature ── */}
              <button
                onClick={() => setHasOrderBump(!hasOrderBump)}
                className="w-full text-left p-6 cursor-pointer hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    hasOrderBump ? 'border-foreground bg-foreground' : 'border-border bg-background'
                  }`}>
                    {hasOrderBump && <Check size={11} strokeWidth={3} className="text-background" />}
                  </div>

                  <div className="flex-1 text-left">
                    {/* Title + prix */}
                    <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">
                        Oui — ajouter
                      </span>
                      <span className="text-[14px] font-bold text-foreground">Claude 360°</span>
                      <span className="text-[13px] font-medium text-muted-foreground/50 line-through">97€</span>
                      <span className="text-[14px] font-bold text-foreground">+37€</span>
                    </div>

                    <p className="mb-3 text-[13px] text-muted-foreground leading-[1.55]">
                      Le setup exact qu'on utilise chez Buildrs pour construire des SaaS. Sous-agents, connecteurs MCP, mémoire projet — tout est inclus.
                    </p>

                  </div>
                </div>
              </button>

              {/* ── TOGGLE "Voir le détail" ── */}
              <div className="px-6 pb-4">
                <button
                  onClick={() => setClaudeOpen(o => !o)}
                  className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5"
                >
                  {claudeOpen ? 'Réduire' : 'Voir le détail'}
                  <ChevronDown
                    size={13}
                    strokeWidth={2}
                    className="transition-transform duration-200"
                    style={{ transform: claudeOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>
              </div>

              {/* ── DÉTAIL COMPLET — expandable ── */}
              {claudeOpen && (
                <div className="border-t border-border px-6 pb-6 pt-5">
                  <ul className="flex flex-col gap-[10px]">
                    {claudePackFeatures.map((f, i) => {
                      const dashIdx = f.indexOf(' — ')
                      const colonIdx = f.indexOf(' : ')
                      let content: React.ReactNode
                      if (dashIdx !== -1) {
                        content = <span className="text-muted-foreground text-[13px]"><span className="font-bold text-foreground">{f.slice(0, dashIdx)}</span> — {f.slice(dashIdx + 3)}</span>
                      } else if (colonIdx !== -1) {
                        content = <span className="text-muted-foreground text-[13px]"><span className="font-bold text-foreground">{f.slice(0, colonIdx)}</span> : {f.slice(colonIdx + 3)}</span>
                      } else {
                        content = <span className="font-bold text-foreground text-[13px]">{f}</span>
                      }
                      return (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check size={13} strokeWidth={2} className="mt-[2px] shrink-0 text-foreground" />
                          {content}
                        </li>
                      )
                    })}
                  </ul>
                  <button
                    onClick={() => setClaudeOpen(false)}
                    className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronDown size={13} strokeWidth={2} style={{ transform: 'rotate(180deg)' }} />
                    Réduire
                  </button>
                </div>
              )}

            </div>

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
                        <span>Claude 360°</span>
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

              </>
            )}

          </div>
        </div>

      </div>

      {/* ─── PRE-FOOTER CTA ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-t border-border bg-background py-20 px-6 text-center">
        {/* Subtle radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(160,160,255,0.06) 0%, transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-[640px]">
          <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
            Buildrs Blueprint
          </p>
          <h2
            className="mb-5 text-foreground"
            style={{ fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}
          >
            Prêt à créer un SaaS 100% autonome<br className="hidden sm:inline" /> qui te rapporte même quand tu dors ?
          </h2>
          <p className="mb-8 text-[15px] leading-[1.65] text-muted-foreground">
            Rejoins les builders qui ont déjà lancé leur produit — sans coder, sans budget, sans expérience.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cta-white-ring inline-flex items-center gap-2.5 rounded-[10px] bg-foreground px-8 py-4 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 cursor-pointer"
          >
            <ArrowUp size={16} strokeWidth={2} />
            Voir l'offre — 27€ →
          </button>
          <p className="mt-4 text-[12px] text-muted-foreground/50">
            Paiement sécurisé · Accès immédiat · Satisfait ou remboursé 30j
          </p>
        </div>
      </div>

      {/* ─── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-[1000px] px-6 py-10 flex flex-col items-center gap-5">
          <div className="rounded-full bg-foreground p-3">
            <BuildrsIcon color="hsl(var(--background))" className="h-6 w-6" />
          </div>
          <p className="text-[13px] text-muted-foreground">© {new Date().getFullYear()} Buildrs Group. Tous droits réservés.</p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5">
            {[
              { label: "CGV",             hash: "#/legal/cgv" },
              { label: "Mentions légales",hash: "#/legal/mentions" },
              { label: "Confidentialité", hash: "#/legal/confidentialite" },
              { label: "Cookies",         hash: "#/legal/cookies" },
            ].map(({ label, hash }) => (
              <a key={label} href={hash} className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors">{label}</a>
            ))}
          </div>
          <p className="max-w-[560px] text-center text-[11px] leading-relaxed text-muted-foreground/40">
            Ce site n'est pas affilié à Facebook™, Instagram™ ou Meta Platforms, Inc. Les résultats peuvent varier selon les individus et dépendent de nombreux facteurs. Ce site ne garantit aucun résultat spécifique.
          </p>
        </div>
      </footer>

    </div>
  )
}
