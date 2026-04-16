// blueprint-app/src/components/saas-match/SaasMatchResultsPage.tsx
import { useEffect, useState, useRef } from 'react'
import { Share2, Clock, TrendingUp, Zap } from 'lucide-react'
import { BuildrsIcon } from '../ui/icons'
import type { IdeaResult } from '../../types/generator'

// ── Score count-up ────────────────────────────────────────────────────────────
function useCountUp(target: number, delay = 300) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0
      const duration = 1100
      const step = target / (duration / 16)
      const timer = setInterval(() => {
        start += step
        if (start >= target) { setCount(target); clearInterval(timer) }
        else setCount(Math.floor(start))
      }, 16)
      return () => clearInterval(timer)
    }, delay)
    return () => clearTimeout(timeout)
  }, [target, delay])
  return count
}

// ── Score ring SVG ─────────────────────────────────────────────────────────────
function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 42
  const circ = 2 * Math.PI * r
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setProgress(score / 100), 350)
    return () => clearTimeout(t)
  }, [score])
  return (
    <svg width="108" height="108" viewBox="0 0 108 108" className="shrink-0">
      {/* Track */}
      <circle cx="54" cy="54" r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="5" />
      {/* Progress */}
      <circle
        cx="54" cy="54" r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - progress)}
        transform="rotate(-90 54 54)"
        style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.4,0,0.2,1) 0.35s' }}
      />
    </svg>
  )
}

function scoreColor(s: number) {
  if (s >= 70) return '#10B981'
  if (s >= 50) return '#F59E0B'
  return '#EF4444'
}

function scoreLabel(s: number) {
  if (s >= 80) return 'Excellent match'
  if (s >= 70) return 'Très bon match'
  if (s >= 50) return 'Bon match'
  return 'Match potentiel'
}

interface Props {
  navigate: (hash: string) => void
}

export function SaasMatchResultsPage({ navigate }: Props) {
  const [ideas, setIdeas] = useState<IdeaResult[]>([])
  const [visible, setVisible] = useState(false)
  const mountedRef = useRef(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('saas_match_results')
    if (!raw) { navigate('#/saas-match'); return }
    try {
      setIdeas(JSON.parse(raw) as IdeaResult[])
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
    } catch { navigate('#/saas-match') }
    mountedRef.current = true
  }, [navigate])

  const displayScore = useCountUp(ideas[0]?.build_score ?? 0, 400)

  if (!ideas.length) return null

  const main = ideas[0]
  const others = ideas.slice(1)
  const color = scoreColor(main.build_score)

  function handleShare() {
    const text = `Mon SaaS IA match : ${main.title} — Score ${main.build_score}/100\nTrouvé en 2 min avec @BuildrsHQ\nhttps://saas-match.buildrs.fr`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }

  // Staggered fade-in helper
  const fadeIn = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(12px)',
    transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
  })

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="max-w-lg mx-auto px-5 py-8 space-y-7">

        {/* Nav */}
        <div className="flex items-center justify-between pb-5 border-b border-border" style={fadeIn(0)}>
          <BuildrsIcon color="hsl(var(--foreground))" size={20} />
          <button
            onClick={() => navigate('#/saas-match')}
            className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Recommencer
          </button>
        </div>

        {/* Score hero — the emotional moment */}
        <div
          className="relative overflow-hidden rounded-2xl border border-border p-5"
          style={{
            ...fadeIn(80),
            background: `linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--secondary)/0.5) 100%)`,
          }}
        >
          {/* Subtle color glow behind score */}
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none"
            style={{ background: color, opacity: 0.07 }}
          />

          <div className="flex items-center gap-5">
            {/* Ring + number */}
            <div className="relative shrink-0">
              <ScoreRing score={main.build_score} color={color} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="font-black font-mono leading-none"
                  style={{ fontSize: 28, color, letterSpacing: '-0.04em' }}
                >
                  {displayScore}
                </span>
                <span className="text-[8px] font-bold text-muted-foreground/50 uppercase tracking-wider">/100</span>
              </div>
            </div>

            <div className="space-y-1.5 min-w-0">
              <span
                className="inline-flex text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
              >
                {scoreLabel(main.build_score)}
              </span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                Ton SaaS IA Match
              </p>
              <h1
                className="font-black text-foreground leading-tight"
                style={{ fontSize: 'clamp(15px, 3.5vw, 20px)', letterSpacing: '-0.03em' }}
              >
                {main.title}
              </h1>
              <p className="text-[10px] text-muted-foreground/60">
                Basé sur ton profil · Reddit · Product Hunt
              </p>
            </div>
          </div>
        </div>

        {/* Grid stats */}
        <div className="grid grid-cols-2 gap-2.5" style={fadeIn(160)}>
          {[
            { label: 'Niche', value: main.target_niche, accent: false },
            { label: 'Build time', value: main.estimated_build_time, accent: false },
            { label: 'MRR potentiel', value: main.pricing_suggestion, accent: true },
            { label: 'Buildabilité', value: `${main.buildability_score}/100`, accent: main.buildability_score >= 70 },
          ].map(({ label, value, accent }) => (
            <div
              key={label}
              className="rounded-xl p-3.5 border"
              style={{
                background: accent ? `${color}08` : 'hsl(var(--secondary)/0.5)',
                borderColor: accent ? `${color}25` : 'hsl(var(--border))',
              }}
            >
              <p className="text-[9px] font-bold uppercase tracking-widest mb-1"
                style={{ color: accent ? color : 'hsl(var(--muted-foreground)/0.5)' }}
              >
                {label}
              </p>
              <p className="text-sm font-bold leading-tight"
                style={{ color: accent ? color : 'hsl(var(--foreground))' }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Problem card */}
        <div className="rounded-xl p-4 border border-border bg-card" style={fadeIn(240)}>
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-2">Problème résolu</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{main.problem_solved}</p>
        </div>

        {/* Why now */}
        {main.why_now && (
          <div
            className="flex items-start gap-3 rounded-xl p-3.5"
            style={{ ...fadeIn(300), background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}
          >
            <Zap size={14} strokeWidth={1.5} className="shrink-0 mt-0.5" style={{ color: '#7C3AED' }} />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#7C3AED' }}>Pourquoi maintenant</p>
              <p className="text-xs text-muted-foreground">{main.why_now}</p>
            </div>
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-5 text-[11px] text-muted-foreground" style={fadeIn(340)}>
          <span className="flex items-center gap-1.5">
            <Clock size={12} strokeWidth={1.5} />
            {main.estimated_build_time}
          </span>
          <span className="flex items-center gap-1.5">
            <TrendingUp size={12} strokeWidth={1.5} />
            {main.acquisition_channel}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-border" style={fadeIn(380)} />

        {/* Other ideas */}
        {others.length > 0 && (
          <div className="space-y-2" style={fadeIn(420)}>
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
              2 autres idées pour toi
            </p>
            {others.map((idea, i) => {
              const c = scoreColor(idea.build_score)
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl p-3 border border-border bg-card"
                  style={fadeIn(460 + i * 60)}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${c}12` }}
                  >
                    <span
                      className="text-base font-black font-mono"
                      style={{ color: c, letterSpacing: '-0.04em' }}
                    >
                      {idea.build_score}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{idea.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{idea.target_niche}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Viral share */}
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 border border-border rounded-xl py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all"
          style={fadeIn(580)}
        >
          <Share2 size={14} strokeWidth={1.5} />
          Partager mon score sur X/Twitter
        </button>

      </div>

      {/* Sticky CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 px-5 py-4"
        style={{
          background: 'hsl(var(--background) / 0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid hsl(var(--border))',
        }}
      >
        <div className="max-w-lg mx-auto space-y-1.5">
          <div className="cta-rainbow relative">
            <button
              onClick={() => navigate('#/checkout')}
              className="relative w-full bg-foreground text-background rounded-xl py-4 text-sm font-bold hover:opacity-90 transition-opacity z-10"
            >
              Lancer ce SaaS IA avec le Blueprint — 27€ →
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground/60 text-center">
            6 modules · Prompts exacts · Stack complet · Accès à vie
          </p>
        </div>
      </div>

    </div>
  )
}
