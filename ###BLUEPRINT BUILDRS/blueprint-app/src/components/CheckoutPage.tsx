import { useState, useEffect, useRef } from "react"

import { Shield, Lock, Check, Flame, ChevronLeft, Star, Zap, ArrowUp, ChevronDown } from "lucide-react"
import { trackEvent } from '../lib/pixel'
import { loadStripe } from "@stripe/stripe-js"
import { BuildrsIcon, BrandIcons, ClaudeIcon } from "./ui/icons"

// ─── Types ────────────────────────────────────────────────────────────────────

const SUPABASE_FUNCTIONS_URL = 'https://ihgbbgwhgmosfjaknvlf.supabase.co/functions/v1'

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

// Détail complet identique LP (expanded)
const blueprintFeaturesLP = [
  "Le Dashboard Buildrs — ton espace projet, tes outils et ta progression au même endroit",
  "7 modules opérationnels — de l'idée au MVP monétisé, étape par étape",
  "50+ prompts testés à copier-coller — les instructions exactes à donner à l'IA",
  "Configuration guidée du stack complet — chaque outil installé pas à pas, zéro galère",
  "Checklist de progression — tu ne seras jamais perdu, tu sais exactement quoi faire ensuite",
  "3 stratégies de départ : copier un SaaS qui marche, résoudre un problème réel, ou explorer les opportunités",
  "3 modèles de monétisation : abonnement mensuel, revente du SaaS, ou prestation client",
  "Accès à vie + toutes les mises à jour futures",
]

const blueprintBonusesLP = [
  "Jarvis IA — ton copilote intelligent qui te guide à chaque étape en temps réel",
  "Agent Validator — valide ton idée SaaS avant de coder · score /100 + analyse concurrence",
  "Toolbox Pro — les meilleurs outils IA du marché expliqués, testés, avec les prompts et configs prêts à l'emploi",
  "WhatsApp Buildrs — accès privé à Alfred & Jarvis via le canal WhatsApp Buildrs",
]

const claudePackFeatures = [
  "L'environnement Claude exact utilisé chez Buildrs — prêt à l'emploi en un téléchargement",
  "Mémoire projet et contexte pré-configurés — ton IA ne repart jamais de zéro",
  "Guide Claude Code opérationnel en 15 min — tu es prêt à construire immédiatement",
]

const acquisitionFeatures = [
  "Les 5 canaux d'acquisition qui marchent en 2026 pour les micro-SaaS",
  "Templates de DM, emails et posts prêts à copier-coller",
  "Séquence de lancement J-7 à J+30 — jour par jour",
  "Les communautés exactes où trouver ta cible (Reddit, Indie Hackers, Product Hunt, Discord)",
]

const agentsPackFeatures = [
  "Jarvis — chef d'orchestre IA · coordonne tous tes agents sur ton projet",
  "Validator — trouve et valide ton prochain SaaS IA · score /100 + analyse marché",
  "Planner — ta stratégie produit + cahier des charges généré en 15 minutes",
  "Designer — ton identité visuelle sans ouvrir Figma",
  "Architect — ta base de données, ton auth et ton CLAUDE.md prêts à coder",
  "Builder — tes prompts Claude Code organisés phase par phase",
  "Launcher — landing page, séquence emails et ads Meta en autopilote",
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

// ─── Bump sub-components ──────────────────────────────────────────────────────

function ClaudeMockup() {
  const sidebarItems = ['Profil', 'Général', 'Compte', 'Connecteurs', 'Claude Code']
  const activeItem = 'Claude Code'
  return (
    <div style={{ borderRadius: 10, background: '#0d0d10', border: '1px solid #1e2030', overflow: 'hidden', fontFamily: 'Geist, sans-serif' }}>
      {/* Title bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 12px', borderBottom: '1px solid #1e2030', background: '#0a0a0d' }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444' }} />
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#eab308' }} />
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
        <span style={{ marginLeft: 8, fontSize: 10, color: '#3d405e', fontFamily: 'Geist Mono, monospace' }}>Claude — Paramètres</span>
      </div>
      <div style={{ display: 'flex', height: 148 }}>
        {/* Sidebar */}
        <div style={{ width: 100, borderRight: '1px solid #1e2030', padding: '10px 0', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {sidebarItems.map(item => (
              <div key={item} style={{
                padding: '5px 10px', fontSize: 10,
                color: item === activeItem ? '#fff' : '#4a4d6a',
                background: item === activeItem ? '#1a1a2e' : 'transparent',
                fontWeight: item === activeItem ? 600 : 400,
                borderLeft: item === activeItem ? '2px solid #e8682a' : '2px solid transparent',
                cursor: 'default',
              }}>{item}</div>
            ))}
          </div>
          <div style={{ padding: '8px 10px', borderTop: '1px solid #1e2030' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg, #e8682a, #cc5de8)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: '#fff' }}>A</span>
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 8, fontWeight: 600, color: '#9399b2', margin: 0 }}>Alfred Orsini</p>
                <p style={{ fontSize: 7, color: '#3d405e', margin: 0 }}>Buildrs Group</p>
              </div>
            </div>
          </div>
        </div>
        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 16px' }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#e8682a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(232,104,42,0.35)' }}>
            <ClaudeIcon size={26} style={{ color: '#fff' }} />
          </div>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#e8e9f0', letterSpacing: '-0.02em', margin: 0 }}>claude.ai</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
            {[
              { label: 'Mémoire projet', val: 'active', color: '#22c55e' },
              { label: 'Skills chargés', val: '12', color: '#4d96ff' },
              { label: 'Sub-agents', val: '3', color: '#cc5de8' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 9, color: '#4a4d6a', fontFamily: 'Geist Mono, monospace' }}>{label}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color, fontFamily: 'Geist Mono, monospace' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AcquisitionMockup() {
  const steps = [
    { tag: 'J-7',  label: 'Ciblage',         sub: 'Reddit · IH · Discord',     color: '#4d96ff' },
    { tag: 'J1',   label: 'DMs + posts',      sub: 'LinkedIn · X · forums',     color: '#4d96ff' },
    { tag: 'J7',   label: 'Product Hunt',     sub: 'launch day',                color: '#cc5de8' },
    { tag: 'J14',  label: 'Séquence email',   sub: 'onboarding → conversion',   color: '#f97316' },
    { tag: 'J30',  label: '100 users',        sub: 'objectif',                  color: '#22c55e' },
  ]
  return (
    <div style={{ borderRadius: 10, background: '#0d0d10', border: '1px solid #1e2030', padding: '14px 16px', fontFamily: 'Geist, sans-serif' }}>
      <p style={{ fontSize: 9, fontWeight: 700, color: '#3d405e', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Geist Mono, monospace', margin: '0 0 10px' }}>Plan acquisition J-7→J+30</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0 }}>
        {steps.map(({ tag, label, sub, color }, i) => (
          <div key={tag} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, width: '100%' }}>
            {/* Timeline line + dot */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}80`, marginTop: 2 }} />
              {i < steps.length - 1 && (
                <div style={{ width: 1, height: 20, background: `linear-gradient(to bottom, ${color}60, ${steps[i+1].color}40)`, marginTop: 2 }} />
              )}
            </div>
            {/* Content */}
            <div style={{ flex: 1, paddingBottom: i < steps.length - 1 ? 8 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 8, fontWeight: 700, color, fontFamily: 'Geist Mono, monospace', background: `${color}18`, border: `1px solid ${color}30`, borderRadius: 3, padding: '1px 4px' }}>{tag}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#9399b2' }}>{label}</span>
              </div>
              <p style={{ fontSize: 9, color: '#3d405e', margin: '2px 0 0', fontFamily: 'Geist Mono, monospace' }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface BumpCardProps {
  checked: boolean
  onToggle: () => void
  name: string
  strikeprice: string
  addprice: string
  socialProof: string
  title: string
  description: string
  detailOpen: boolean
  onToggleDetail: () => void
  features: string[]
  mockup: React.ReactNode
  accentColor: string
  icon?: React.ReactNode
  colorBadge?: { text: string; color: string }
}

function BumpCard({ checked, onToggle, name, strikeprice, addprice, socialProof, title, description, detailOpen, onToggleDetail, features, mockup, accentColor, icon, colorBadge }: BumpCardProps) {
  return (
    <div className={`rounded-2xl border-2 transition-all overflow-hidden ${checked ? 'border-foreground bg-card' : 'border-border bg-card'}`}>

      {/* ── Header cliquable ── */}
      <button onClick={onToggle} className="w-full text-left p-6 cursor-pointer hover:bg-secondary/20 transition-colors">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${checked ? 'border-foreground bg-foreground' : 'border-border bg-background'}`}>
            {checked && <Check size={11} strokeWidth={3} className="text-background" />}
          </div>

          <div className="flex-1 text-left">
            {/* Badges row */}
            <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1.5">
              <span className="rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">
                Oui — ajouter
              </span>
              {icon && <span className="flex items-center">{icon}</span>}
              <span className="text-[14px] font-bold text-foreground">{name}</span>
              {colorBadge && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{ background: `${colorBadge.color}18`, color: colorBadge.color, border: `1px solid ${colorBadge.color}40` }}
                >
                  {colorBadge.text}
                </span>
              )}
              <span className="text-[13px] font-medium text-muted-foreground/50 line-through">{strikeprice}</span>
              <span className="text-[14px] font-bold text-foreground">{addprice}</span>
            </div>

            {/* Social proof badge */}
            <div className="mb-3">
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: `${accentColor}14`, color: accentColor, border: `1px solid ${accentColor}30` }}
              >
                {socialProof}
              </span>
            </div>

            {/* Title */}
            <p className="mb-2 text-[14px] font-bold text-foreground leading-[1.3]">{title}</p>

            {/* Description */}
            <p className="text-[13px] text-muted-foreground leading-[1.55]">{description}</p>
          </div>
        </div>
      </button>

      {/* ── Mockup ── */}
      <div className="px-6 pb-4">
        {mockup}
      </div>

      {/* ── Toggle détail ── */}
      <div className="px-6 pb-4">
        <button
          onClick={onToggleDetail}
          className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5"
        >
          {detailOpen ? 'Réduire' : 'Voir le détail'}
          <ChevronDown size={13} strokeWidth={2} className="transition-transform duration-200" style={{ transform: detailOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </button>
      </div>

      {/* ── Détail expandable ── */}
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

export function CheckoutPage({ hasOrderBump, setHasOrderBump, hasAgentsBump: _hasAgentsBump, setHasAgentsBump: _setHasAgentsBump, hasAcquisitionBump, setHasAcquisitionBump, funnelSource, onBack }: CheckoutPageProps) {
  const isClaudeFunnel = funnelSource === 'claude'
  const [dark, setDark] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showStripe, setShowStripe] = useState(false)
  const [offerOpen, setOfferOpen] = useState(false)
  const [claudeOpen, setClaudeOpen] = useState(false)
  const [acquisitionOpen, setAcquisitionOpen] = useState(false)
  const checkoutRef = useRef<{ destroy: () => void } | null>(null)
  const mountRef = useRef<HTMLDivElement>(null)

  const basePrice = isClaudeFunnel ? 47 : 27
  const bumpPrice = isClaudeFunnel ? 27 : 37
  const acquisitionPrice = 27
  const total = isClaudeFunnel
    ? basePrice + (hasOrderBump ? bumpPrice : 0)
    : basePrice + (hasOrderBump ? bumpPrice : 0) + (hasAcquisitionBump ? acquisitionPrice : 0)

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
            {isClaudeFunnel
              ? "L'environnement Claude exact pour construire des SaaS et des apps rentables."
              : "Le système guidé pour créer et monétiser ton premier SaaS IA en autopilote."}
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
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <p className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
                      {isClaudeFunnel && <ClaudeIcon size={14} />}
                      {isClaudeFunnel ? 'Claude Buildrs' : 'Buildrs Blueprint'}
                    </p>
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
                      <span className="text-[14px] font-medium text-muted-foreground/50 line-through">
                        {isClaudeFunnel ? '97€' : '297€'}
                      </span>
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

            {/* ─── ORDER BUMP — adapté au funnel ──────────────────────────────── */}
            {isClaudeFunnel ? (
              <BumpCard
                checked={hasOrderBump}
                onToggle={() => setHasOrderBump(!hasOrderBump)}
                name="Blueprint SaaS"
                strikeprice="297€"
                addprice="+27€"
                socialProof="8/10 ajoutent cet upgrade"
                title="Tu as la machine de guerre. Voici le plan de bataille."
                description="7 modules pour construire ton premier SaaS rentable avec Claude. De l'idée au premier client payant — prompts, checklist, templates."
                detailOpen={claudeOpen}
                onToggleDetail={() => setClaudeOpen(o => !o)}
                features={blueprintFeaturesLP}
                mockup={<ClaudeMockup />}
                accentColor="#4d96ff"
              />
            ) : (
              <>
                <BumpCard
                  checked={hasOrderBump}
                  onToggle={() => setHasOrderBump(!hasOrderBump)}
                  name="Claude 360°"
                  strikeprice="97€"
                  addprice="+37€"
                  socialProof="9/10 ajoutent cet upgrade"
                  title="Configure ton Claude comme un pro en 15 minutes"
                  description="L'environnement Claude exact utilisé chez Buildrs. Skills, MCP, sub-agents, mémoire projet — prêt à l'emploi."
                  detailOpen={claudeOpen}
                  onToggleDetail={() => setClaudeOpen(o => !o)}
                  features={claudePackFeatures}
                  mockup={<ClaudeMockup />}
                  accentColor="#cc5de8"
                  icon={<ClaudeIcon size={16} />}
                  colorBadge={{ text: 'PLUG & PLAY', color: '#8b5cf6' }}
                />
                <BumpCard
                  checked={hasAcquisitionBump}
                  onToggle={() => setHasAcquisitionBump(!hasAcquisitionBump)}
                  name="Blueprint Acquisition"
                  strikeprice="97€"
                  addprice="+27€"
                  socialProof="8/10 ajoutent cet upgrade"
                  title="Tes 100 premiers clients"
                  description="Tu vas construire ton SaaS. Mais sans clients c'est un hobby. Ce module te donne le plan exact pour trouver tes 100 premiers utilisateurs — les canaux, les messages, les templates, les séquences. Avant même d'avoir fini de construire."
                  detailOpen={acquisitionOpen}
                  onToggleDetail={() => setAcquisitionOpen(o => !o)}
                  features={acquisitionFeatures}
                  mockup={<AcquisitionMockup />}
                  accentColor="#22c55e"
                />
              </>
            )}

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
                      <span>{isClaudeFunnel ? 'Claude Buildrs' : 'Buildrs Blueprint'}</span>
                      <span className="font-medium text-foreground">{basePrice}€</span>
                    </div>
                    {hasOrderBump && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>{isClaudeFunnel ? 'Blueprint SaaS' : 'Claude 360°'}</span>
                        <span className="font-medium text-foreground">+{bumpPrice}€</span>
                      </div>
                    )}
                    {!isClaudeFunnel && hasAcquisitionBump && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Blueprint Acquisition</span>
                        <span className="font-medium text-foreground">+27€</span>
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
            {isClaudeFunnel ? (
              <span className="flex items-center justify-center gap-1.5">
                <ClaudeIcon size={13} />
                Buildrs Claude
              </span>
            ) : 'Buildrs Blueprint'}
          </p>
          <h2
            className="mb-5 text-foreground"
            style={{ fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}
          >
            {isClaudeFunnel
              ? <>Prêt à installer l'environnement Claude<br className="hidden sm:inline" /> qui génère +25{"\u00a0"}000€/mois ?</>
              : <>Prêt à créer un SaaS 100% autonome<br className="hidden sm:inline" /> qui te rapporte même quand tu dors ?</>
            }
          </h2>
          <p className="mb-8 text-[15px] leading-[1.65] text-muted-foreground">
            {isClaudeFunnel
              ? "Le setup complet — Skills, MCP, CLAUDE.md, sub-agents. Opérationnel en une journée."
              : "Rejoins les builders qui ont déjà lancé leur produit — sans coder, sans budget, sans expérience."
            }
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cta-white-ring inline-flex items-center gap-2.5 rounded-[10px] bg-foreground px-8 py-4 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 cursor-pointer"
          >
            <ArrowUp size={16} strokeWidth={2} />
            {isClaudeFunnel ? "Voir l'offre — 47€ →" : "Voir l'offre — 27€ →"}
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
