// blueprint-app/src/components/saas-match/SaasMatchResultsPage.tsx
import { useEffect, useState } from 'react'
import { Share2, Clock, TrendingUp } from 'lucide-react'
import { BuildrsIcon } from '../ui/icons'
import type { IdeaResult } from '../../types/generator'

function scoreColor(s: number) {
  if (s >= 70) return '#10B981'
  if (s >= 50) return '#F59E0B'
  return '#EF4444'
}

interface Props {
  navigate: (hash: string) => void
}

export function SaasMatchResultsPage({ navigate }: Props) {
  const [ideas, setIdeas] = useState<IdeaResult[]>([])

  useEffect(() => {
    const raw = sessionStorage.getItem('saas_match_results')
    if (!raw) { navigate('#/saas-match'); return }
    try { setIdeas(JSON.parse(raw) as IdeaResult[]) }
    catch { navigate('#/saas-match') }
  }, [navigate])

  if (!ideas.length) return null

  const main = ideas[0]
  const others = ideas.slice(1)

  function handleShare() {
    const text = `Mon SaaS IA match : ${main.title} — Score ${main.build_score}/100\nTrouvé en 2 min avec @BuildrsHQ\nhttps://saas-match.buildrs.fr`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function handleCTA() {
    navigate('#/checkout')
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-5 py-8 space-y-6">

        {/* Header nav */}
        <div className="flex items-center justify-between pb-5 border-b border-border">
          <BuildrsIcon color="hsl(var(--foreground))" size={20} />
          <button
            onClick={() => navigate('#/saas-match')}
            className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Recommencer
          </button>
        </div>

        {/* Match header */}
        <div className="space-y-2">
          <span
            className="inline-flex text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(124,58,237,0.08)', color: '#7C3AED', border: '1px solid rgba(124,58,237,0.2)' }}
          >
            Recommandé pour toi
          </span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            Ton SaaS IA Match
          </p>
          <h1
            className="text-2xl font-black text-foreground leading-tight"
            style={{ letterSpacing: '-0.04em' }}
          >
            {main.title}
          </h1>
        </div>

        {/* Score */}
        <div className="flex items-center gap-4">
          <span
            className="text-5xl font-black font-mono leading-none"
            style={{ color: scoreColor(main.build_score), letterSpacing: '-0.05em' }}
          >
            {main.build_score}
          </span>
          <div>
            <p className="text-sm font-bold text-foreground">Score de compatibilité</p>
            <p className="text-[11px] text-muted-foreground">Basé sur ton profil · Reddit · Product Hunt</p>
          </div>
        </div>

        {/* Grid stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Niche', value: main.target_niche },
            { label: 'Faisabilité', value: main.estimated_build_time },
            { label: 'MRR potentiel', value: main.pricing_suggestion, green: true },
            { label: 'Buildabilité', value: `${main.buildability_score}/100`, green: main.buildability_score >= 70 },
          ].map(({ label, value, green }) => (
            <div
              key={label}
              className="border border-border rounded-xl p-3 bg-secondary/50"
            >
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-1">{label}</p>
              <p
                className="text-sm font-bold leading-tight"
                style={{ color: green ? '#10B981' : 'hsl(var(--foreground))' }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Problem */}
        <div className="border border-border rounded-xl p-4 bg-card">
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-2">Problème résolu</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{main.problem_solved}</p>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
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
        <div className="border-t border-border" />

        {/* Other ideas */}
        {others.length > 0 && (
          <div className="space-y-2">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">
              2 autres idées pour toi
            </p>
            {others.map((idea, i) => (
              <div
                key={i}
                className="flex items-center gap-3 border border-border rounded-xl p-3 bg-card"
              >
                <span
                  className="text-lg font-black font-mono shrink-0"
                  style={{ color: scoreColor(idea.build_score), letterSpacing: '-0.04em', minWidth: 36 }}
                >
                  {idea.build_score}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{idea.title}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{idea.target_niche}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Viral share */}
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 border border-border rounded-xl py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all"
        >
          <Share2 size={14} strokeWidth={1.5} />
          Partager mon score sur X/Twitter
        </button>

      </div>

      {/* Sticky CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 px-5 py-4"
        style={{ background: 'hsl(var(--background) / 0.95)', backdropFilter: 'blur(8px)', borderTop: '1px solid hsl(var(--border))' }}
      >
        <div className="max-w-lg mx-auto space-y-1.5">
          <div className="cta-rainbow relative">
            <button
              onClick={handleCTA}
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
