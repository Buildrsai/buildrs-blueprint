import { useState, useEffect, useRef } from "react"
import { Shield, Lock, Check, Flame, ChevronLeft, ChevronDown } from "lucide-react"
import { trackEvent } from '../lib/pixel'
import { loadStripe } from "@stripe/stripe-js"
import { BuildrsIcon, BrandIcons, ClaudeIcon } from "./ui/icons"

const SUPABASE_FUNCTIONS_URL = 'https://ihgbbgwhgmosfjaknvlf.supabase.co/functions/v1'

// ─── Props ────────────────────────────────────────────────────────────────────

interface ClaudeCheckoutPageProps {
  hasCoworkBump:    boolean
  setHasCoworkBump: (v: boolean) => void
  hasBlueprintBump:    boolean
  setHasBlueprintBump: (v: boolean) => void
  onBack: () => void
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const claudeByBuildrsFeatures: { text: string; value: string }[] = [
  { text: "7 blocs opérationnels — de la configuration à l'usage avancé, étape par étape", value: "valeur 497€" },
  { text: "43 briques de contenu — exercices pratiques, templates et prompts prêts à l'emploi", value: "valeur 197€" },
  { text: "L'environnement Claude exact utilisé chez Buildrs — prêt en 15 minutes", value: "valeur 147€" },
  { text: "Mémoire projet et contexte pré-configurés — ton IA ne repart jamais de zéro", value: "valeur 97€" },
  { text: "Guide Claude Code complet — du premier prompt au MVP déployé", value: "valeur 147€" },
  { text: "Sub-agents spécialisés configurés — chacun expert dans son domaine", value: "valeur 97€" },
  { text: "Accès à vie + toutes les mises à jour futures", value: "valeur 57€" },
]

const coworkFeatures: string[] = [
  "6 blocs, 47 briques sur le mode coworking avancé avec Claude",
  "Comment piloter des sessions de travail profondes avec contexte maintenu",
  "Itérations rapides, feedback loops et revues de code en temps réel",
  "Architecture de prompts avancés — sessions multi-étapes sans perdre le fil",
  "Playbooks prêts à l'emploi pour chaque type de tâche (design, architecture, dev, copy)",
  "Intégration Claude dans ta stack — terminaux, éditeurs, pipelines CI/CD",
]

const blueprintFeatures: string[] = [
  "7 modules opérationnels — de l'idée au MVP monétisé, étape par étape",
  "3 stratégies de départ : copier un SaaS qui marche, résoudre un problème réel, ou explorer les opportunités",
  "50+ prompts testés à copier-coller — les instructions exactes à donner à l'IA",
  "Checklist de progression — tu sais exactement quoi faire ensuite",
  "Configuration guidée du stack complet — chaque outil installé pas à pas",
  "3 modèles de monétisation : abonnement mensuel, revente du SaaS, ou prestation client",
  "Le Dashboard Buildrs — ton espace projet, tes outils et ta progression au même endroit",
  "Accès à vie + toutes les mises à jour futures",
]

const socialProof = [
  {
    name: "Lucas",
    role: "Freelance → Builder",
    text: "En une semaine j'avais mon Claude configuré comme Alfred. La différence de productivité est hallucinante.",
  },
  {
    name: "Marine",
    role: "Designer → Fondatrice",
    text: "Les sub-agents changent tout. J'ai un agent pour le design, un pour le code, un pour le copy. Mon équipe IA.",
  },
  {
    name: "Théo",
    role: "Étudiant → Builder",
    text: "Claude Code + le guide = mon premier SaaS déployé en 4 jours. Je n'aurais pas su par où commencer sans ça.",
  },
]

// ─── Mockups ──────────────────────────────────────────────────────────────────

function CoworkMockup() {
  const messages = [
    { role: 'user',  text: 'Analyse ce composant et propose 3 améliorations de perf.' },
    { role: 'agent', text: 'Analyse en cours — lazy loading, memo, bundle split. Rapport dans 10s.' },
    { role: 'user',  text: 'Implémente la #2 directement.' },
    { role: 'agent', text: 'Fait. +40% de vitesse de rendu. PR générée.' },
  ]
  return (
    <div style={{ borderRadius: 10, background: '#0d0d10', border: '1px solid #1e2030', overflow: 'hidden', fontFamily: 'Geist, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 12px', borderBottom: '1px solid #1e2030', background: '#0a0a0d' }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444' }} />
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#eab308' }} />
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
        <span style={{ marginLeft: 8, fontSize: 10, color: '#3d405e', fontFamily: 'Geist Mono, monospace' }}>Claude Cowork — Session active</span>
      </div>
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%',
              padding: '6px 10px',
              borderRadius: m.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
              background: m.role === 'user' ? '#1a1a2e' : '#0f1118',
              border: `1px solid ${m.role === 'user' ? '#2a2a4a' : '#1e2030'}`,
              fontSize: 10,
              color: m.role === 'user' ? '#9399b2' : '#e8e9f0',
              lineHeight: 1.5,
            }}>
              {m.role === 'agent' && (
                <span style={{ fontSize: 8, fontWeight: 700, color: '#e8682a', marginRight: 4, fontFamily: 'Geist Mono, monospace' }}>Claude</span>
              )}
              {m.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BlueprintMockup() {
  const modules = [
    { num: '01', label: 'Trouver & Valider',   done: true },
    { num: '02', label: 'Préparer & Designer', done: true },
    { num: '03', label: 'L\'Architecture',     done: false, active: true },
    { num: '04', label: 'Construire',           done: false },
    { num: '05', label: 'Déployer',             done: false },
  ]
  return (
    <div style={{ borderRadius: 10, background: '#0d0d10', border: '1px solid #1e2030', overflow: 'hidden', fontFamily: 'Geist, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 12px', borderBottom: '1px solid #1e2030', background: '#0a0a0d' }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444' }} />
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#eab308' }} />
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} />
        <span style={{ marginLeft: 8, fontSize: 10, color: '#3d405e', fontFamily: 'Geist Mono, monospace' }}>Buildrs Blueprint — Parcours</span>
      </div>
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {modules.map(m => (
          <div key={m.num} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 8px',
            borderRadius: 6,
            background: m.active ? '#1a1a2e' : 'transparent',
            border: `1px solid ${m.active ? '#2a2a4a' : 'transparent'}`,
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: m.done ? '#22c55e' : m.active ? '#4d96ff' : '#1e2030',
              fontSize: 8, fontWeight: 700, color: m.done || m.active ? '#fff' : '#3d405e',
            }}>
              {m.done ? '✓' : m.num}
            </div>
            <span style={{ fontSize: 10, color: m.active ? '#e8e9f0' : m.done ? '#6b7280' : '#4a4d6a', fontWeight: m.active ? 600 : 400 }}>
              {m.label}
            </span>
            {m.active && (
              <span style={{ marginLeft: 'auto', fontSize: 8, fontWeight: 700, color: '#4d96ff', fontFamily: 'Geist Mono, monospace', background: 'rgba(77,150,255,0.12)', border: '1px solid rgba(77,150,255,0.3)', borderRadius: 3, padding: '1px 4px' }}>
                EN COURS
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── BumpCard ─────────────────────────────────────────────────────────────────

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

function BumpCard({ checked, onToggle, name, strikeprice, addprice, socialProof: sp, title, description, detailOpen, onToggleDetail, features, mockup, accentColor, icon, colorBadge }: BumpCardProps) {
  return (
    <div className={`rounded-2xl border-2 transition-all overflow-hidden ${checked ? 'border-foreground bg-card' : 'border-border bg-card'}`}>

      {/* ── Header cliquable ── */}
      <button onClick={onToggle} className="w-full text-left p-6 cursor-pointer hover:bg-secondary/20 transition-colors">
        <div className="flex items-start gap-4">
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
            <div className="mb-3">
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: `${accentColor}14`, color: accentColor, border: `1px solid ${accentColor}30` }}
              >
                {sp}
              </span>
            </div>
            <p className="mb-2 text-[14px] font-bold text-foreground leading-[1.3]">{title}</p>
            <p className="text-[13px] text-muted-foreground leading-[1.55]">{description}</p>
          </div>
        </div>
      </button>

      {/* ── Mockup ── */}
      <div className="px-6 pb-4">{mockup}</div>

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

const LAUNCH_END = new Date('2026-05-01T23:59:59')

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

export function ClaudeCheckoutPage({ hasCoworkBump, setHasCoworkBump, hasBlueprintBump, setHasBlueprintBump, onBack }: ClaudeCheckoutPageProps) {
  const [dark, setDark] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showStripe, setShowStripe] = useState(false)
  const [offerOpen, setOfferOpen] = useState(false)
  const [coworkOpen, setCoworkOpen] = useState(false)
  const [blueprintOpen, setBlueprintOpen] = useState(false)
  const checkoutRef = useRef<{ destroy: () => void } | null>(null)
  const mountRef = useRef<HTMLDivElement>(null)

  const countdown = useCountdown(LAUNCH_END)

  const basePrice      = 47
  const coworkPrice    = 37
  const blueprintPrice = 27
  const total = basePrice + (hasCoworkBump ? coworkPrice : 0) + (hasBlueprintBump ? blueprintPrice : 0)

  useEffect(() => {
    return () => { checkoutRef.current?.destroy() }
  }, [])

  const handlePay = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-claude-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          has_cowork_bump:    hasCoworkBump,
          has_blueprint_bump: hasBlueprintBump,
          origin:             window.location.origin,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.clientSecret) throw new Error(data.error ?? 'Erreur de connexion à Stripe')

      const stripe = await loadStripe(data.publishableKey)
      if (!stripe) throw new Error('Stripe non disponible')

      checkoutRef.current?.destroy()

      const checkout = await stripe.initEmbeddedCheckout({ clientSecret: data.clientSecret })

      trackEvent('InitiateCheckout', { value: total, currency: 'EUR', num_items: 1 })
      setShowStripe(true)
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
          <a href="#/claude" onClick={(e) => { e.preventDefault(); onBack() }} className="flex items-center gap-2 no-underline">
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
          <p className="mb-2 flex items-center justify-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
            <ClaudeIcon size={13} />
            Claude By Buildrs
          </p>
          <h1 className="text-foreground" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.1 }}>
            Finalise ta commande
          </h1>
          <p className="mx-auto mt-3 max-w-[520px] text-[15px] leading-[1.65] text-muted-foreground">
            L'environnement Claude exact pour construire des SaaS et des apps rentables.
          </p>
          <p className="mx-auto mt-2 text-[13px] text-muted-foreground/60">
            Un seul paiement · Accès à vie
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* LEFT — Product + Order Bumps */}
          <div className="flex flex-col gap-5">

            {/* ── Produit principal ── */}
            <div className="bump-neon relative" style={{ borderRadius: 20 }}>
              <div className="bump-inner text-left" style={{ borderRadius: 18 }}>

                {/* Bandeau toujours visible */}
                <div className="p-6 sm:p-7">
                  {/* Row 1 */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <p className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
                      <ClaudeIcon size={14} />
                      Claude By Buildrs
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
                      <span className="text-[14px] font-medium text-muted-foreground/50 line-through">97€</span>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-[16px] font-semibold text-muted-foreground">€</span>
                        <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }} className="text-foreground">47</span>
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

                  {/* Row 3 : barre bonus */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">Accès réclamés</span>
                      <span className="text-[11px] font-bold text-foreground tabular-nums">74 / 150</span>
                    </div>
                    <div className="h-[3px] rounded-full bg-border overflow-hidden">
                      <div className="h-full rounded-full bg-foreground" style={{ width: '49%' }} />
                    </div>
                  </div>
                </div>

                {/* Détail expandable */}
                {offerOpen && (
                  <div className="border-t border-border px-6 sm:px-8 pb-8 pt-6">
                    <ul className="mb-4 flex flex-col gap-[10px]">
                      {claudeByBuildrsFeatures.map((f) => {
                        const dashIdx = f.text.indexOf(' — ')
                        const content = dashIdx !== -1
                          ? <span className="text-muted-foreground text-[13px]"><span className="font-bold text-foreground">{f.text.slice(0, dashIdx)}</span> — {f.text.slice(dashIdx + 3)}</span>
                          : <span className="font-bold text-foreground text-[13px]">{f.text}</span>
                        return (
                          <li key={f.text} className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2.5 flex-1 min-w-0">
                              <Check size={13} strokeWidth={2} className="mt-[2px] shrink-0 text-foreground" />
                              {content}
                            </div>
                            <span className="ml-2 shrink-0 text-[11px] text-muted-foreground/40">({f.value})</span>
                          </li>
                        )
                      })}
                    </ul>
                    <div className="mb-4 border-t border-border pt-3 text-right">
                      <div className="text-[11px] text-muted-foreground/50 line-through">Valeur totale : 1 239€</div>
                      <div className="text-[12px] font-bold text-foreground">Ton prix aujourd'hui : 47€</div>
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

            {/* ── ORDER BUMP 1 — Claude Cowork ── */}
            <BumpCard
              checked={hasCoworkBump}
              onToggle={() => setHasCoworkBump(!hasCoworkBump)}
              name="Claude Cowork"
              strikeprice="97€"
              addprice="+37€"
              socialProof="8/10 ajoutent cet upgrade"
              title="Utilise Claude comme un vrai coworker — pas juste un chatbot."
              description="6 blocs, 47 briques sur le mode coworking avancé. Sessions profondes, itérations rapides, feedback loops, playbooks métier. Claude devient ton équipier, pas un outil ponctuel."
              detailOpen={coworkOpen}
              onToggleDetail={() => setCoworkOpen(o => !o)}
              features={coworkFeatures}
              mockup={<CoworkMockup />}
              accentColor="#e8682a"
              icon={<ClaudeIcon size={16} />}
              colorBadge={{ text: 'COWORK MODE', color: '#e8682a' }}
            />

            {/* ── ORDER BUMP 2 — Blueprint ── */}
            <BumpCard
              checked={hasBlueprintBump}
              onToggle={() => setHasBlueprintBump(!hasBlueprintBump)}
              name="Blueprint SaaS"
              strikeprice="297€"
              addprice="+27€"
              socialProof="7/10 ajoutent le Blueprint"
              title="Tu as la machine. Voici le plan de bataille pour monétiser."
              description="7 modules pour construire ton premier SaaS rentable avec Claude. De l'idée au premier client payant — prompts, checklist, templates. L'étape d'après naturelle."
              detailOpen={blueprintOpen}
              onToggleDetail={() => setBlueprintOpen(o => !o)}
              features={blueprintFeatures}
              mockup={<BlueprintMockup />}
              accentColor="#4d96ff"
            />

          </div>

          {/* RIGHT — Summary + CTA */}
          <div className="lg:sticky lg:top-6 flex flex-col gap-4">

            {showStripe ? (
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
                      <span className="flex items-center gap-1"><ClaudeIcon size={12} />Claude By Buildrs</span>
                      <span className="font-medium text-foreground">{basePrice}€</span>
                    </div>
                    {hasCoworkBump && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Claude Cowork</span>
                        <span className="font-medium text-foreground">+{coworkPrice}€</span>
                      </div>
                    )}
                    {hasBlueprintBump && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Blueprint SaaS</span>
                        <span className="font-medium text-foreground">+{blueprintPrice}€</span>
                      </div>
                    )}
                    <hr className="border-border my-1" />
                    <div className="flex items-end justify-between">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="text-[22px] font-extrabold text-foreground" style={{ letterSpacing: '-0.02em' }}>{total}€</span>
                    </div>
                  </div>

                  {/* Compte à rebours */}
                  <div className="mt-4 rounded-xl border border-border bg-background/50 px-4 py-3 text-center">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
                      Offre de lancement expire dans
                    </p>
                    <p className="text-[20px] font-extrabold text-foreground tabular-nums" style={{ letterSpacing: '-0.02em', fontFamily: 'Geist Mono, monospace' }}>
                      {String(countdown.d).padStart(2,'0')}j {String(countdown.h).padStart(2,'0')}:{String(countdown.m).padStart(2,'0')}:{String(countdown.s).padStart(2,'0')}
                    </p>
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

      {/* PRE-FOOTER */}
      <div className="relative overflow-hidden border-t border-border bg-background py-20 px-6 text-center">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(232,104,42,0.06) 0%, transparent 70%)' }} />
        <div className="relative mx-auto max-w-[640px]">
          <p className="mb-3 flex items-center justify-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
            <ClaudeIcon size={13} />
            Claude By Buildrs
          </p>
          <h2 className="mb-5 text-foreground" style={{ fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            Prêt à installer l'environnement Claude<br className="hidden sm:inline" /> qui génère +25{"\u00a0"}000€/mois ?
          </h2>
          <p className="mb-8 mx-auto max-w-[440px] text-[15px] leading-[1.65] text-muted-foreground">
            L'environnement exact. Pas une formation généraliste.
          </p>
          <button
            onClick={handlePay}
            disabled={loading}
            className="cta-rainbow relative inline-flex items-center rounded-xl bg-foreground px-10 py-4 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 cursor-pointer disabled:opacity-60"
          >
            Payer — {total}€ →
          </button>

          <div className="mt-6 flex items-center justify-center gap-6">
            {socialProof.map((p) => (
              <div key={p.name} className="text-left max-w-[180px]">
                <p className="text-[11px] font-bold text-foreground">{p.name}</p>
                <p className="text-[10px] text-muted-foreground/60">{p.role}</p>
                <p className="mt-1 text-[11px] leading-[1.5] text-muted-foreground">"{p.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
