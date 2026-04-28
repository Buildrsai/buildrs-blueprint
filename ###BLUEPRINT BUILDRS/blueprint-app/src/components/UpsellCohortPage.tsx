import { useState, useRef, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Check, Shield, Lock, Zap, Target, Workflow, ArrowLeft, Clock, Video, Globe } from "lucide-react"
import { BuildrsLogo, BuildrsIcon } from "./ui/icons"
import { trackEvent } from "../lib/pixel"
import { BLUEPRINT_PRICE, CLAUDE_OS_BUMP_PRICE, ACQUISITION_BUMP_PRICE } from "../lib/pricing"

const SUPABASE_FUNCTIONS_URL = "https://ihgbbgwhgmosfjaknvlf.supabase.co/functions/v1"

interface Props { onDecline: () => void }

// ─── Confetti ─────────────────────────────────────────────────────────────────
function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    const COLORS = ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#cc5de8", "#f97316", "#22c55e", "#a78bfa"]
    const particles = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 120,
      vx: (Math.random() - 0.5) * 4,
      vy: 3 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      w: 7 + Math.random() * 8,
      h: 4 + Math.random() * 5,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.12,
    }))

    let alive = true
    const tick = () => {
      if (!alive) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let any = false
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.rot += p.rotV
        p.vy += 0.04
        if (p.y < canvas.height + 30) any = true
        const alpha = Math.max(0, 1 - p.y / (canvas.height * 1.1))
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      }
      if (any) requestAnimationFrame(tick)
      else { canvas.style.opacity = "0" }
    }
    requestAnimationFrame(tick)
    return () => { alive = false }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 100, transition: "opacity 0.5s" }}
    />
  )
}

// ─── Calendar mockup (repris de ClaudeIntegratorPage) ────────────────────────
function CalendarMockup() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const monthNames = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]
  const days = ["DIM","LUN","MAR","MER","JEU","VEN","SAM"]
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayDate = today.getDate()
  const isAvailable = (d: number) => {
    if (d <= todayDate) return false
    const dow = new Date(year, month, d).getDay()
    return dow !== 0 && dow !== 6
  }
  const selectedDay = (() => {
    for (let d = todayDate + 1; d <= daysInMonth; d++) if (isAvailable(d)) return d
    return todayDate + 1
  })()
  const selectedDowLabel = days[new Date(year, month, selectedDay).getDay()]
  const slots = ["09:00","09:20","09:40","10:00","10:20","10:40","11:00","11:20","11:40","12:00"]
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: "#0d0e12", border: "0.5px solid rgba(255,255,255,0.09)", fontFamily: "Geist, sans-serif" }}>
      <div className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)", background: "#0a0b0e" }}>
        <div style={{ width:7, height:7, borderRadius:"50%", background:"#ef4444" }} />
        <div style={{ width:7, height:7, borderRadius:"50%", background:"#eab308" }} />
        <div style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e" }} />
        <div className="flex items-center gap-2 ml-3">
          <BuildrsIcon color="#5b6078" size={12} />
          <span className="text-[10px] font-semibold"
            style={{ color:"#5b6078", fontFamily:"Geist Mono, monospace" }}>
            Team Buildrs — Choisir ta date
          </span>
        </div>
      </div>
      <div className="flex" style={{ minHeight:260 }}>
        <div className="px-4 py-4 shrink-0" style={{ width:140, borderRight:"0.5px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-1.5 mb-3">
            <BuildrsIcon color="#4d96ff" size={14} />
            <span className="text-[10px] font-bold" style={{ color:"#e2e8f0" }}>Team Buildrs</span>
          </div>
          <p className="text-[12px] font-bold mb-3 leading-tight" style={{ color:"#e2e8f0", letterSpacing:"-0.02em" }}>
            Session Claude Integrator
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Clock size={10} strokeWidth={1.5} style={{ color:"#5b6078" }} />
              <span className="text-[10px]" style={{ color:"#5b6078" }}>45 min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Video size={10} strokeWidth={1.5} style={{ color:"#5b6078" }} />
              <span className="text-[10px]" style={{ color:"#5b6078" }}>Cal Video</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe size={10} strokeWidth={1.5} style={{ color:"#5b6078" }} />
              <span className="text-[10px]" style={{ color:"#5b6078" }}>Europe/Paris</span>
            </div>
          </div>
        </div>
        <div className="flex-1 px-4 py-4" style={{ borderRight:"0.5px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-bold" style={{ color:"#e2e8f0" }}>
              {monthNames[month]} <span style={{ color:"#5b6078" }}>{year}</span>
            </span>
            <div className="flex items-center gap-1">
              <button className="w-5 h-5 rounded flex items-center justify-center text-[10px]" style={{ color:"#5b6078" }}>‹</button>
              <button className="w-5 h-5 rounded flex items-center justify-center text-[10px]" style={{ color:"#5b6078" }}>›</button>
            </div>
          </div>
          <div className="grid grid-cols-7 mb-1">
            {days.map(d => (
              <div key={d} className="text-center text-[8px] font-bold py-1" style={{ color:"#3d4466" }}>{d}</div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-0.5 mb-0.5">
              {week.map((d, di) => {
                if (!d) return <div key={di} />
                const avail = isAvailable(d)
                const selected = d === selectedDay
                const past = d <= todayDate
                return (
                  <div key={di} className="aspect-square flex items-center justify-center rounded-md text-[10px] font-semibold"
                    style={{
                      background: selected ? "#e2e8f0" : avail ? "rgba(77,150,255,0.12)" : "transparent",
                      color: selected ? "#080909" : avail ? "#4d96ff" : past ? "#2a2d3a" : "#3d4466",
                      border: selected ? "none" : avail ? "0.5px solid rgba(77,150,255,0.25)" : "none",
                    }}>
                    {d}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div className="px-3 py-4 overflow-y-auto" style={{ width:110 }}>
          <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color:"#5b6078" }}>
            {selectedDowLabel} {selectedDay}
          </p>
          <div className="space-y-1.5">
            {slots.map((slot, i) => (
              <div key={slot} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-semibold"
                style={{
                  background: i === 0 ? "rgba(77,150,255,0.15)" : "rgba(255,255,255,0.03)",
                  border: `0.5px solid ${i === 0 ? "rgba(77,150,255,0.35)" : "rgba(255,255,255,0.06)"}`,
                  color: i === 0 ? "#4d96ff" : "#5b6078",
                }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background:"#22c55e" }} />
                {slot}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-4 py-2.5 text-center" style={{ borderTop:"0.5px solid rgba(255,255,255,0.06)", background:"#0a0b0e" }}>
        <p className="text-[9px]" style={{ color:"#3d4466" }}>
          Accès au calendrier immédiatement après paiement · Créneaux disponibles dès demain
        </p>
      </div>
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const BENEFITS = [
  {
    Icon: Zap, color: "#4d96ff",
    title: "Setup complet Claude AI + Code + Cowork",
    desc: "On configure tout sur ta machine. Connecteurs, paramètres, extensions, MCP servers, skills, CLAUDE.md. Tu repars avec un environnement qui fonctionne.",
  },
  {
    Icon: Target, color: "#22c55e",
    title: "Ton CLAUDE.md de projet créé",
    desc: "On analyse ton projet et on crée le CLAUDE.md parfait pour ton cas. Pas un template — ton contexte précis, prêt à builder.",
  },
  {
    Icon: Workflow, color: "#8b5cf6",
    title: "3 workflows Cowork personnalisés",
    desc: "On configure 3 workflows Cowork adaptés à ton business. Analyse de marché, contenu, prospection... Tu choisis, on paramètre ensemble.",
  },
]

const INCLUDES = [
  "Claude AI + Claude Code + Cowork — installé et configuré",
  "Tous les connecteurs, MCP, skills branchés",
  "Ton CLAUDE.md de projet créé",
  "3 workflows Cowork personnalisés",
  "Analyse de ton projet et recommandations",
  "Enregistrement de la session (tu gardes tout)",
]

// ─── Component ────────────────────────────────────────────────────────────────
export function UpsellCohortPage({ onDecline }: Props) {
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [showStripe, setShowStripe] = useState(false)
  const [stripeReady, setStripeReady] = useState(false)
  const checkoutRef = useRef<{ destroy: () => void } | null>(null)
  const mountRef    = useRef<HTMLDivElement>(null)

  const isClaude = typeof window !== "undefined" && window.location.hash.includes("source=claude")

  // Purchase tracking
  useEffect(() => {
    const hash = window.location.hash
    if (!hash.includes("session_id=")) return
    const hasBump        = hash.includes("bump=1")
    const hasAcquisition = hash.includes("acquisition=1")
    const value = isClaude
      ? 47 + (hasBump ? 27 : 0)
      : BLUEPRINT_PRICE + (hasBump ? CLAUDE_OS_BUMP_PRICE : 0) + (hasAcquisition ? ACQUISITION_BUMP_PRICE : 0)
    trackEvent("Purchase", { value, currency: "EUR", num_items: 1 })
  }, [])

  useEffect(() => () => { checkoutRef.current?.destroy() }, [])

  const handlePay = async () => {
    setLoading(true)
    setError(null)
    try {
      const hashParams = new URLSearchParams(window.location.hash.split("?")[1] ?? "")
      const priorSessionId = hashParams.get("session_id") ?? undefined

      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-integrator-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin: window.location.origin, prior_session_id: priorSessionId }),
      })
      const data = await res.json()
      if (!res.ok || !data.clientSecret) throw new Error(data.error ?? "Erreur Stripe")
      const stripe = await loadStripe(data.publishableKey)
      if (!stripe) throw new Error("Stripe indisponible")
      checkoutRef.current?.destroy()
      const checkout = await stripe.initEmbeddedCheckout({ clientSecret: data.clientSecret })
      setStripeReady(false)
      setShowStripe(true)
      setTimeout(() => {
        if (mountRef.current) {
          checkout.mount(mountRef.current)
          checkoutRef.current = checkout
          setTimeout(() => setStripeReady(true), 700)
        }
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
    setStripeReady(false)
  }

  return (
    <div className="dark">
    <div className="min-h-screen bg-background" style={{ fontFamily: "Geist, sans-serif" }}>

      {/* Confetti */}
      <Confetti />

      {/* ── BANDEAU CONFIRMATION ──────────────────────────────────────────────── */}
      <div style={{ background: "rgba(34,197,94,0.08)", borderBottom: "1px solid rgba(34,197,94,0.2)" }}>
        <div className="px-6 py-3 text-center">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" stroke="#22c55e" />
              </svg>
              <p className="text-[13px] font-semibold" style={{ color: "#22c55e" }}>
                Paiement confirmé — ton accès Blueprint est prêt.
              </p>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Avant d'accéder à ton dashboard — une offre exclusive, visible une seule fois.
            </p>
          </div>
        </div>
      </div>

      {/* ── HEADER ───────────────────────────────────────────────────────────── */}
      <header className="border-b border-border bg-background/85 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 h-14">
          <BuildrsLogo color="hsl(var(--foreground))" iconSize={20} fontSize={15} fontWeight={700} />
          <span className="rounded-full border border-border bg-card px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Étape 2 / 2
          </span>
        </div>
      </header>

      {/* ── MAIN ─────────────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-6 py-10">

        {/* Stripe overlay */}
        {showStripe && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <button onClick={handleCloseStripe}
                className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <ArrowLeft size={14} strokeWidth={1.5} />
                Retour
              </button>
              <span className="text-[14px] font-bold text-foreground">Claude Integrator — 197€</span>
            </div>
            {!stripeReady && (
              <div className="flex flex-col items-center justify-center gap-3 py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
                <span className="text-[13px] text-muted-foreground">Connexion sécurisée en cours…</span>
              </div>
            )}
            <div ref={mountRef} className={stripeReady ? "" : "hidden"} />
          </div>
        )}

        {!showStripe && (
          <>
            {/* ── BADGE GRADIENT ── */}
            <div className="flex justify-center mb-7">
              <div className="relative rounded-full p-[1.5px]"
                style={{ background: "conic-gradient(from 0deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #cc5de8, #ff6b6b)" }}>
                <div className="rounded-full bg-background px-5 py-2 flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)" }}>
                    <Check size={11} strokeWidth={2.5} style={{ color: "#22c55e" }} />
                  </div>
                  <span className="text-[13px] font-bold text-foreground">Merci&nbsp;! Ton accès Blueprint est confirmé.</span>
                </div>
              </div>
            </div>

            {/* ── HEADER COPY ── */}
            <div className="text-center mb-12">
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60 mb-4">
                Avant de commencer — une offre unique réservée aux nouveaux membres
              </p>
              <h1 className="text-foreground mb-5"
                style={{ fontSize: "clamp(26px, 4.5vw, 48px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.08 }}>
                ON INSTALLE TOUT TON<br />ENVIRONNEMENT CLAUDE<br />EN 45 MIN DE VISIO
              </h1>
              <p className="mx-auto max-w-[500px] text-[15px] leading-[1.75] text-muted-foreground">
                En <strong className="text-foreground">45 minutes avec un membre de l'équipe</strong>, on fait ce qui te prendrait des jours seul — et tu repars avec un setup professionnel, testé, prêt à builder.
              </p>
            </div>

            {/* ── 2 COLONNES ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

              {/* ── LEFT ── */}
              <div>
                {/* Benefits */}
                <div className="space-y-3 mb-8">
                  {BENEFITS.map(({ Icon, color, title, desc }) => (
                    <div key={title} className="rounded-xl border border-border bg-card p-4 flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${color}14`, border: `1px solid ${color}30` }}>
                        <Icon size={16} strokeWidth={1.5} style={{ color }} />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-foreground mb-1">{title}</p>
                        <p className="text-[12px] leading-relaxed text-muted-foreground">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calendar */}
                <div className="mb-8">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-3">
                    Choisis ta date — dès demain
                  </p>
                  <CalendarMockup />
                </div>

                {/* Team */}
                <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
                  <img src="/Alfred_opt.jpg" alt="Équipe Buildrs"
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                    style={{ border: "2px solid rgba(77,150,255,0.3)" }} />
                  <div>
                    <p className="text-[13px] font-bold text-foreground">L'équipe Buildrs — en visio</p>
                    <p className="text-[11px] text-muted-foreground">Fondateur Buildrs · +25k€/mois de MRR · 200+ builders accompagnés</p>
                  </div>
                </div>
              </div>

              {/* ── RIGHT — Carte ── */}
              <div>
                <div className="bump-neon">
                <div className="bump-inner">

                  {/* Price header */}
                  <div className="px-7 pt-7 pb-5 border-b border-border">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em]"
                        style={{ background: "rgba(77,150,255,0.12)", border: "1px solid rgba(77,150,255,0.3)", color: "#4d96ff" }}>
                        Claude Integrator
                      </span>
                      <span className="rounded-full border border-border bg-muted px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                        45 min
                      </span>
                      <span className="rounded-full border border-border bg-muted px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                        En visio
                      </span>
                    </div>
                    <div className="flex items-end gap-3 mb-1">
                      <span className="text-foreground" style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>197€</span>
                      <span className="text-[16px] line-through text-muted-foreground/40 mb-1">397€</span>
                    </div>
                    <p className="text-[12px] text-muted-foreground">Session unique · Accès immédiat au calendrier</p>
                  </div>

                  {/* Includes */}
                  <div className="px-7 py-5 border-b border-border">
                    <div className="space-y-2.5">
                      {INCLUDES.map(item => (
                        <div key={item} className="flex items-start gap-2.5">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                            style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)" }}>
                            <Check size={9} strokeWidth={2.5} style={{ color: "#22c55e" }} />
                          </div>
                          <span className="text-[12px] text-muted-foreground leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="px-7 py-6">
                    {error && (
                      <div className="mb-4 px-4 py-3 rounded-xl text-[12px]"
                        style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
                        {error}
                      </div>
                    )}

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
                      ) : "Ajouter la session — 197€ →"}
                    </button>

                    <div className="flex items-center justify-center gap-5 mt-4">
                      {[
                        { Icon: Shield, label: "Satisfait ou remboursé 30j" },
                        { Icon: Lock,   label: "Paiement sécurisé" },
                      ].map(({ Icon, label }) => (
                        <div key={label} className="flex items-center gap-1.5">
                          <Icon size={11} strokeWidth={1.5} className="text-muted-foreground/40" />
                          <span className="text-[10px] text-muted-foreground/40">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
                </div>
              </div>
            </div>

            {/* ── DECLINE ── */}
            <div className="mt-10 text-center">
              <button
                onClick={onDecline}
                className="text-[13px] text-muted-foreground/50 underline underline-offset-4 hover:text-muted-foreground transition-colors cursor-pointer"
              >
                Non merci, je préfère configurer seul →
              </button>
            </div>
          </>
        )}

      </main>

    </div>
    </div>
  )
}
