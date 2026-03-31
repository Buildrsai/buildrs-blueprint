import { useState, useEffect, useRef } from "react"
import {
  Video, MessageCircle, Zap, Shield, Trophy, Rocket,
  Users, Check, ChevronLeft, Gift, AlertCircle, Package, Clock,
} from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { BuildrsLogo, BuildrsIcon } from "./ui/icons"
import { trackEvent } from "../lib/pixel"

const SUPABASE_FUNCTIONS_URL = "https://ihgbbgwhgmosfjaknvlf.supabase.co/functions/v1"

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props { onDecline: () => void }

// ─── Data ─────────────────────────────────────────────────────────────────────
const sprintItems = [
  { icon: Clock,         text: "Call de cadrage 30 min — idée validée, périmètre défini" },
  { icon: Rocket,        text: "MVP fonctionnel avec 1 feature core, livré en 72h" },
  { icon: Shield,        text: "Auth, BDD Supabase, déploiement Vercel — tout configuré" },
  { icon: Package,       text: "Architecture propre, maintenable, prête à évoluer" },
  { icon: Zap,           text: "Code source GitHub + documentation technique complète" },
]

const cohortItems = [
  { icon: Video,         text: "4 sessions live par semaine avec Alfred" },
  { icon: Rocket,        text: "On construit TON projet ensemble — de l'idée au lancement en direct" },
  { icon: Zap,           text: "Toutes les ressources, agents IA et connaissances Buildrs à disposition" },
  { icon: MessageCircle, text: "WhatsApp privé — accès direct à Alfred pendant 60 jours" },
  { icon: Shield,        text: "Retours en temps réel · accompagnement illimité" },
  { icon: Trophy,        text: "1 000€/mois garantis dans les 90 jours ou remboursé" },
]

// ─── Countdown ────────────────────────────────────────────────────────────────
function useCountdown(target: Date) {
  const get = (t: Date) => {
    const diff = Math.max(0, t.getTime() - Date.now())
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    }
  }
  const [t, setT] = useState(() => get(target))
  useEffect(() => {
    const id = setInterval(() => setT(get(target)), 1000)
    return () => clearInterval(id)
  }, [target])
  return t
}

// ─── Component ────────────────────────────────────────────────────────────────
export function UpsellCohortPage({ onDecline }: Props) {
  const [selected, setSelected]     = useState<"sprint" | "cohort" | null>(null)
  const [cohortMode, setCohortMode] = useState<"once" | "three">("once")
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [showStripe, setShowStripe] = useState(false)
  const checkoutRef = useRef<{ destroy: () => void } | null>(null)
  const mountRef    = useRef<HTMLDivElement>(null)

  const [deadline] = useState(() => new Date(Date.now() + 48 * 60 * 60 * 1000))
  const { d, h, m, s } = useCountdown(deadline)

  useEffect(() => () => { checkoutRef.current?.destroy() }, [])

  // Fire Purchase event when arriving here from Stripe (return_url = #/upsell-cohort)
  useEffect(() => {
    const hash = window.location.hash
    if (!hash.includes('session_id=')) return
    const isClaude       = hash.includes('source=claude')
    const hasBump        = hash.includes('bump=1')
    const hasAcquisition = hash.includes('acquisition=1')
    const value = isClaude
      ? 47 + (hasBump ? 27 : 0)
      : 27 + (hasBump ? 37 : 0) + (hasAcquisition ? 27 : 0)
    trackEvent('Purchase', { value, currency: 'EUR', num_items: 1 })
  }, [])

  const cohortPrice      = cohortMode === "once" ? 1497 : 499
  const cohortPriceLabel = cohortMode === "once" ? "1 497€" : "3 × 499€"

  const handlePay = async (type: "sprint" | "cohort") => {
    setLoading(true); setError(null)
    const endpoint = type === "sprint" ? "create-sprint-checkout" : "create-cohort-checkout"
    try {
      const res  = await fetch(`${SUPABASE_FUNCTIONS_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_mode: type === "cohort" ? cohortMode : "once" }),
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
    checkoutRef.current?.destroy(); checkoutRef.current = null
    setShowStripe(false); setSelected(null)
  }

  return (
    <div className="dark">
    <div className="min-h-screen bg-background">

      {/* ── BANDEAU CONFIRMATION PAIEMENT ───────────────────────────────────── */}
      <div className="banner-gradient-border">
        <div className="banner-gradient-inner px-6 py-3">
          <div className="flex items-center justify-center gap-2.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="check-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4d96ff" />
                  <stop offset="50%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#ffd93d" />
                </linearGradient>
              </defs>
              <path d="M20 6 9 17l-5-5" stroke="url(#check-grad)" />
            </svg>
            <p className="text-[13px] font-semibold text-white">
              Félicitations et bienvenu chez Buildrs — ton paiement est confirmé. L'aventure démarre maintenant.
            </p>
          </div>
        </div>
      </div>

      {/* ── BANDEAU TOP ─────────────────────────────────────────────────────── */}
      <div
        className="w-full px-6 py-2.5 text-center text-[12px] font-semibold"
        style={{ background: "hsl(var(--foreground))", color: "hsl(var(--background))" }}
      >
        Avant d'accéder à ton dashboard — une offre exclusive visible uniquement sur cette page.
      </div>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-border bg-background/85 backdrop-blur-xl px-6 py-4">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between">
          <BuildrsLogo color="hsl(var(--foreground))" iconSize={22} fontSize={15} fontWeight={700} />
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-border bg-card px-3.5 py-1.5 text-[13px] font-bold text-foreground">
              Offre exclusive · Une seule fois
            </span>
            <span className="hidden sm:block rounded-full border border-border bg-muted px-3 py-1 text-[11px] font-semibold text-muted-foreground">
              Étape 2 / 2
            </span>
          </div>
        </div>
      </header>

      {/* ── MAIN ───────────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-[1100px] px-6 py-16 sm:py-20">

        {/* Stripe embed (remplace tout quand actif) */}
        {showStripe ? (
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
                {selected === "sprint" ? "Sprint — 497€" : `Cohorte — ${cohortPriceLabel}`}
              </span>
            </div>
            <div ref={mountRef} />
          </div>
        ) : (
          <>
            {/* ── INTRO ──────────────────────────────────────────────────────── */}
            <div className="mb-14 text-center">
              <div className="mb-5 inline-flex">
                <span className="rounded-full border border-border bg-muted px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                  Offre exclusive · Uniquement sur cette page
                </span>
              </div>
              <h1
                className="mb-4 text-foreground"
                style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.06 }}
              >
                Tu as le plan. Maintenant,<br />choisis ta vitesse.
              </h1>
              <p className="mx-auto max-w-[540px] text-[16px] leading-[1.7] text-muted-foreground">
                Tu as le Blueprint. Maintenant, choisis comment tu veux aller plus loin.
              </p>
            </div>

            {/* ── BLOC CRÉDIBILITÉ ────────────────────────────────────────────── */}
            <div className="mx-auto mb-10 max-w-[720px] rounded-2xl border border-border bg-card px-7 py-6">
              <div className="mb-4">
                <BuildrsIcon color="hsl(var(--foreground))" size={28} />
              </div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/50">
                Qui est Buildrs
              </p>
              <p className="mb-4 text-[18px] font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
                L'écosystème qui fabrique les buildrs de demain.
              </p>
              <p className="text-[14px] leading-[1.75] text-muted-foreground">
                On conçoit des SaaS, des apps et des{" "}
                <span className="font-semibold text-foreground">solutions agentiques</span>{" "}
                pour des entreprises — en orchestrant des agents IA avec Claude comme moteur exclusif.{" "}
                <span className="font-semibold text-foreground">+35K€/mois de revenus récurrents</span>{" "}
                sur nos propres produits, construits en vibecoding. On ouvre ce système pour former la nouvelle vague de builders qui veulent faire de l'IA un{" "}
                <span className="font-semibold text-foreground">levier de revenus et de liberté</span>.{" "}
                Accessible à tous ceux qui sont déterminés.
              </p>
            </div>

            {/* ── 2 CARTES ────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

              {/* ── SPRINT ──────────────────────────────────────────────────── */}
              <div
                className={`relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-colors ${
                  selected === "sprint" ? "border-foreground" : "border-border hover:border-foreground/30"
                }`}
              >
                <div className="flex flex-col flex-1 p-7">

                  {/* Badge */}
                  <div className="mb-5 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-border bg-muted px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      Sprint
                    </span>
                    <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em]"
                      style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "rgba(34,197,94,0.9)" }}>
                      Livré en 72h
                    </span>
                    <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em]"
                      style={{ background: "rgba(255,215,0,0.12)", border: "1px solid rgba(255,215,0,0.35)", color: "#fbbf24" }}>
                      Le plus choisi
                    </span>
                  </div>

                  {/* Titre */}
                  <h2
                    className="mb-2 text-foreground"
                    style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.1 }}
                  >
                    On te livre ton MVP.<br />En 72 heures.
                  </h2>
                  <p className="mb-7 text-[14px] leading-[1.7] text-muted-foreground">
                    Tu nous donnes ton idée — ou on t'en trouve une. On te livre un MVP complet, fonctionnel, déployé, avec la landing page et les créas Meta Ads. Prêt à lancer.
                  </p>

                  {/* Features */}
                  <ul className="mb-5 flex flex-col gap-3">
                    {sprintItems.map(({ icon: Icon, text }) => (
                      <li key={text} className="flex items-start gap-3 text-[13px] text-muted-foreground">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-border bg-muted" style={{ marginTop: 1 }}>
                          <Icon size={11} strokeWidth={1.5} className="text-foreground" />
                        </div>
                        {text}
                      </li>
                    ))}
                  </ul>

                  {/* Scope note */}
                  <div className="mb-6 rounded-lg border border-border bg-muted/40 px-4 py-3">
                    <p className="text-[11px] leading-[1.6] text-muted-foreground">
                      <span className="font-semibold text-foreground">Notre périmètre : le produit.</span>{" "}
                      On livre un MVP fonctionnel, documenté et déployé — prêt à être mis sur le marché. Acquisition, marketing et stratégie de croissance restent entre tes mains.
                    </p>
                  </div>

                  {/* Prix */}
                  <div className="mt-auto">
                    <div className="mb-4 flex items-baseline gap-2">
                      <span className="text-[15px] font-medium text-muted-foreground/40 line-through">997€</span>
                      <span className="text-foreground" style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>
                        497€
                      </span>
                      <span className="text-[13px] text-muted-foreground">une fois</span>
                    </div>

                    {error && selected === "sprint" && (
                      <p className="mb-2 text-[12px] text-red-500">{error}</p>
                    )}

                    <button
                      onClick={() => { setSelected("sprint"); handlePay("sprint") }}
                      disabled={loading && selected === "sprint"}
                      className="w-full rounded-[10px] border border-foreground bg-background py-3.5 text-[14px] font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading && selected === "sprint" ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Chargement…
                        </span>
                      ) : "Je veux mon MVP en 72h →"}
                    </button>
                    <div className="mt-3 flex items-center justify-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      <p className="text-[11px] font-medium" style={{ color: "#22c55e" }}>
                        Remboursé si pas livré dans les 72h
                      </p>
                    </div>
                    <p className="mt-1 text-center text-[11px] text-muted-foreground/40">Paiement unique · Accès immédiat</p>
                  </div>
                </div>
              </div>

              {/* ── COHORTE ─────────────────────────────────────────────────── */}
              <div
                className={`relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-colors ${
                  selected === "cohort" ? "border-foreground" : "border-border hover:border-foreground/30"
                }`}
              >
                {/* Bande lumineuse violet */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.6) 40%, rgba(168,85,247,0.6) 60%, transparent 100%)" }}
                />
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-28"
                  style={{ background: "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(168,85,247,0.08) 0%, transparent 100%)" }}
                />

                <div className="relative flex flex-col flex-1 p-7">

                  {/* Badge */}
                  <div className="mb-5 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-border bg-muted px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      Cohorte
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em]"
                      style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)", color: "rgba(168,85,247,0.9)" }}>
                      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                      7 / 12 places
                    </span>
                  </div>

                  {/* Titre */}
                  <h2
                    className="mb-2 text-foreground"
                    style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.1 }}
                  >
                    On fait tout ensemble.<br />60 jours.
                  </h2>
                  <p className="mb-7 text-[14px] leading-[1.7] text-muted-foreground">
                    On construit ton produit ensemble, de l'idée au lancement. Jusqu'à tes premiers revenus.
                  </p>

                  {/* Features */}
                  <ul className="mb-6 flex flex-col gap-3">
                    {cohortItems.map(({ icon: Icon, text }) => (
                      <li key={text} className="flex items-start gap-3 text-[13px] text-muted-foreground">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-border bg-muted" style={{ marginTop: 1 }}>
                          <Icon size={11} strokeWidth={1.5} className="text-foreground" />
                        </div>
                        {text}
                      </li>
                    ))}
                  </ul>

                  {/* Bloc garantie compact */}
                  <div className="mb-6 rounded-xl border border-border bg-background/50 px-4 py-3">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle size={13} strokeWidth={1.5} className="mt-[2px] shrink-0 text-foreground" />
                      <p className="text-[12px] leading-[1.6] text-muted-foreground">
                        <span className="font-semibold text-foreground">Garantie résultat :</span> 1 000€/mois dans les 90 jours suivant le lancement. Sinon, remboursement intégral.
                      </p>
                    </div>
                  </div>

                  {/* Bonus Weekend */}
                  <div className="mb-6 flex items-center justify-between rounded-xl border border-dashed border-border px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Gift size={12} strokeWidth={1.5} className="text-foreground" />
                      <span className="text-[12px] font-medium text-muted-foreground">Weekend Build Together inclus</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground/40 line-through">+597€</span>
                      <span className="rounded-full bg-foreground px-2 py-0.5 text-[9px] font-bold text-background">INCLUS</span>
                    </div>
                  </div>

                  {/* Prix + toggle */}
                  <div className="mt-auto">
                    {/* Toggle */}
                    <div className="mb-4 flex gap-2">
                      {(["once", "three"] as const).map((mo) => (
                        <button
                          key={mo}
                          onClick={() => setCohortMode(mo)}
                          className={`flex-1 rounded-xl border py-2.5 text-[12px] font-semibold transition-colors cursor-pointer ${
                            cohortMode === mo
                              ? "border-foreground bg-foreground text-background"
                              : "border-border bg-background text-foreground hover:bg-secondary"
                          }`}
                        >
                          {mo === "once" ? "Paiement unique" : "3× sans frais"}
                          <br />
                          <span className="text-[10px] font-normal opacity-70">
                            {mo === "once" ? "1 497€" : "3 × 499€"}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Prix affiché */}
                    <div className="mb-4 flex items-baseline gap-2">
                      <span className="text-[15px] font-medium text-muted-foreground/40 line-through">
                        {cohortMode === "once" ? "2 497€" : "3 × 997€"}
                      </span>
                      <span className="text-foreground" style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>
                        {cohortMode === "once" ? "1 497€" : "499€"}
                      </span>
                      {cohortMode === "three" && <span className="text-[13px] text-muted-foreground">/ mois</span>}
                    </div>

                    {error && selected === "cohort" && (
                      <p className="mb-2 text-[12px] text-red-500">{error}</p>
                    )}

                    <button
                      onClick={() => { setSelected("cohort"); handlePay("cohort") }}
                      disabled={loading && selected === "cohort"}
                      className="cta-rainbow relative w-full rounded-[10px] bg-foreground py-3.5 text-[14px] font-semibold text-background transition-opacity hover:opacity-85 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading && selected === "cohort" ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Chargement…
                        </span>
                      ) : `Rejoindre la cohorte — ${cohortPriceLabel} →`}
                    </button>
                    <p className="mt-2 text-center text-[11px] text-muted-foreground/50">
                      Paiement sécurisé par Stripe · 12 places max
                    </p>
                  </div>
                </div>

                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.3) 50%, transparent 100%)" }}
                />
              </div>
            </div>

            {/* ── COUNTDOWN ─────────────────────────────────────────────────── */}
            <div className="mx-auto mb-8 max-w-[480px] rounded-2xl border border-border bg-card px-5 py-4">
              <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
                Cette offre se termine dans
              </p>
              <div className="flex items-end justify-center gap-1.5">
                {([{ label: "J", val: d }, { label: "H", val: h }, { label: "M", val: m }, { label: "S", val: s }] as const).map(({ label, val }, i) => (
                  <div key={label} className="flex items-end gap-1.5">
                    <div className="text-center">
                      <div
                        className="flex items-center justify-center rounded-xl border border-border bg-background font-mono font-extrabold text-foreground"
                        style={{ fontSize: "clamp(16px, 3vw, 24px)", letterSpacing: "-0.02em", width: 46, height: 46 }}
                      >
                        {String(val).padStart(2, "0")}
                      </div>
                      <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/40">{label}</p>
                    </div>
                    {i < 3 && <span className="pb-5 text-[16px] font-bold text-muted-foreground/25">:</span>}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-center text-[11px] text-muted-foreground/40">
                Après ce délai, les tarifs reprennent leurs prix d'origine
              </p>
            </div>

            {/* ── DECLINE ──────────────────────────────────────────────────── */}
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
