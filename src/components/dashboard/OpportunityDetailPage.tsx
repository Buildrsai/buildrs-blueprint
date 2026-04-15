// blueprint-app/src/components/dashboard/OpportunityDetailPage.tsx
import { useState, useEffect } from 'react'
import { ArrowLeft, ExternalLink, Bookmark, BookmarkCheck, TrendingUp, Zap, DollarSign } from 'lucide-react'
import { useOpportunityBySlug } from '../../hooks/useOpportunities'
import { BrandIcons } from '../ui/icons'
import { supabase } from '../../lib/supabase'

// Map stack string -> BrandIcon
function StackBadge({ name }: { name: string }) {
  const lower = name.toLowerCase()
  const iconKey = Object.keys(BrandIcons).find(k => lower.includes(k)) as keyof typeof BrandIcons | undefined
  const IconComponent = iconKey ? BrandIcons[iconKey] : null

  return (
    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary/50 text-[12px] font-medium">
      {IconComponent && <IconComponent width={14} height={14} />}
      {name}
    </span>
  )
}

function ScoreBar({ label, value, explanation, Icon }: {
  label: string
  value: number
  explanation?: string | null
  Icon: typeof TrendingUp
}) {
  const color = value >= 70 ? '#22c55e' : value >= 40 ? '#eab308' : '#ef4444'
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <Icon size={13} strokeWidth={1.5} style={{ color }} />
          {label}
        </div>
        <span className="text-[13px] font-mono font-semibold" style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-border overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      {explanation && (
        <p className="text-[11px] text-muted-foreground/60 leading-relaxed">{explanation}</p>
      )}
    </div>
  )
}

interface Props {
  slug: string
  userId: string | undefined
  navigate: (hash: string) => void
}

export function OpportunityDetailPage({ slug, userId, navigate }: Props) {
  const { opportunity: opp, loading } = useOpportunityBySlug(slug)

  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (!userId || !opp?.id) return
    supabase
      .from('user_saved_opportunities')
      .select('id')
      .eq('user_id', userId)
      .eq('opportunity_id', opp.id)
      .maybeSingle()
      .then(({ data }) => setIsSaved(!!data))
  }, [userId, opp?.id])

  const handleSave = async () => {
    if (!userId || !opp?.id) return
    if (isSaved) {
      await supabase.from('user_saved_opportunities').delete()
        .eq('user_id', userId).eq('opportunity_id', opp.id)
      setIsSaved(false)
    } else {
      await supabase.from('user_saved_opportunities').insert({ user_id: userId, opportunity_id: opp.id })
      setIsSaved(true)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <div className="h-8 w-48 rounded-lg animate-pulse bg-secondary/30" />
        <div className="h-48 rounded-xl animate-pulse bg-secondary/30" />
        <div className="h-32 rounded-xl animate-pulse bg-secondary/30" />
      </div>
    )
  }

  if (!opp) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-muted-foreground">
        <p className="text-lg font-medium">Opportunite introuvable</p>
        <button
          onClick={() => navigate('#/dashboard/marketplace')}
          className="mt-4 text-sm underline hover:text-foreground transition-colors"
        >
          Retour a la Marketplace
        </button>
      </div>
    )
  }

  const SOURCE_COLORS_MAP: Record<string, string> = {
    product_hunt: '#ff6154',
    reddit: '#ff4500',
    acquire: '#22c55e',
    hacker_news: '#ff6600',
    manual_curated: '#8b5cf6',
    generator_live: '#f59e0b',
  }
  const SOURCE_LABELS_MAP: Record<string, string> = {
    product_hunt: 'Product Hunt',
    reddit: 'Reddit',
    acquire: 'Acquire.com',
    hacker_news: 'Hacker News',
    manual_curated: 'Buildrs Curated',
    generator_live: 'Buildrs Live',
  }
  const srcColor = SOURCE_COLORS_MAP[opp.source] ?? '#8b5cf6'
  const srcLabel = SOURCE_LABELS_MAP[opp.source] ?? opp.source

  const launchProject = () => {
    sessionStorage.setItem('marketplace_context', JSON.stringify({
      name: opp.name,
      problem: opp.problem_solved,
      stack: opp.recommended_stack,
      features: opp.mvp_features,
      niche: opp.niche_suggestions,
      pricing: opp.pricing_suggestion,
      source_slug: opp.slug,
    }))
    navigate('#/dashboard/claude-os/generer')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      {/* Back */}
      <button
        onClick={() => navigate('#/dashboard/marketplace')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={14} strokeWidth={1.5} />
        Marketplace
      </button>

      {/* Section 1: Header */}
      <div className="border border-border rounded-xl p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                style={{ background: `${srcColor}20`, color: srcColor }}
              >
                {srcLabel}
              </span>
              <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground/50">
                {opp.category}
              </span>
            </div>
            <h1 className="text-2xl font-black text-foreground" style={{ letterSpacing: '-0.03em' }}>
              {opp.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{opp.tagline}</p>
          </div>

          {/* Build Score */}
          <div className="text-center flex-shrink-0">
            <div
              className="text-5xl font-black font-mono"
              style={{ color: opp.build_score >= 70 ? '#22c55e' : opp.build_score >= 40 ? '#eab308' : '#ef4444', letterSpacing: '-0.03em' }}
            >
              {opp.build_score}
            </div>
            <div className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground/60 mt-0.5">
              Build Score
            </div>
          </div>
        </div>

        {/* Score bars */}
        <div className="space-y-3 pt-2 border-t border-border">
          <ScoreBar label="Traction" value={opp.traction_score} explanation={opp.traction_explanation} Icon={TrendingUp} />
          <ScoreBar label="Cloneabilite" value={opp.cloneability_score} explanation={opp.cloneability_explanation} Icon={Zap} />
          <ScoreBar label="Monetisation" value={opp.monetization_score} explanation={opp.monetization_explanation} Icon={DollarSign} />
        </div>
      </div>

      {/* Source d'inspiration */}
      {(opp.source_url || opp.website_url || opp.mrr_estimated) && (
        <div className="border border-border rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Source d'inspiration</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
              style={{ background: `${srcColor}20`, color: srcColor }}
            >
              {srcLabel}
            </span>
            {opp.source_url && (
              <a
                href={opp.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink size={12} strokeWidth={1.5} />
                Voir sur {srcLabel}
              </a>
            )}
            {opp.website_url && (
              <a
                href={opp.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink size={12} strokeWidth={1.5} />
                Site original
              </a>
            )}
          </div>
          <div className="flex items-center gap-4 flex-wrap text-[12px]">
            {opp.mrr_estimated && (
              <span>
                MRR <span className="font-mono font-semibold" style={{ color: '#22c55e' }}>${opp.mrr_estimated.toLocaleString()}</span>
                {opp.mrr_confidence && <span className="text-muted-foreground/50 ml-1">(confiance {opp.mrr_confidence}/10)</span>}
              </span>
            )}
          </div>
          {opp.differentiation_angle && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1">Pourquoi on peut faire mieux</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{opp.differentiation_angle}</p>
            </div>
          )}
        </div>
      )}

      {/* Section 2: Analyse */}
      <div className="border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Analyse</h2>

        {opp.problem_solved && (
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1">Probleme resolu</div>
            <p className="text-sm text-foreground leading-relaxed">{opp.problem_solved}</p>
          </div>
        )}

        {opp.why_reproducible && (
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1">Pourquoi reproductible</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{opp.why_reproducible}</p>
          </div>
        )}

        {opp.differentiation_angle && (
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1">Angle de differenciation</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{opp.differentiation_angle}</p>
          </div>
        )}

        {opp.pain_points && opp.pain_points.length > 0 && (
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">Frustrations utilisateurs</div>
            <ul className="space-y-1">
              {opp.pain_points.map((p, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-muted-foreground/30 mt-1">—</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Section 3: Blueprint */}
      <div className="border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Blueprint</h2>

        {opp.mvp_features && opp.mvp_features.length > 0 && (
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">Features MVP</div>
            <ol className="space-y-2">
              {opp.mvp_features.map((f, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground/50 mt-0.5 w-4 shrink-0">{i + 1}.</span>
                  {f}
                </li>
              ))}
            </ol>
          </div>
        )}

        {opp.recommended_stack && opp.recommended_stack.length > 0 && (
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">Stack recommandee</div>
            <div className="flex flex-wrap gap-2">
              {opp.recommended_stack.map((s, i) => <StackBadge key={i} name={s} />)}
            </div>
          </div>
        )}

        {opp.pricing_suggestion && (
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1">Pricing suggere</div>
            <p className="text-sm text-foreground">{opp.pricing_suggestion}</p>
          </div>
        )}

        {opp.acquisition_channels && opp.acquisition_channels.length > 0 && (
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">Canaux d'acquisition</div>
            <div className="flex flex-wrap gap-2">
              {opp.acquisition_channels.map((c, i) => (
                <span key={i} className="text-[12px] px-3 py-1 rounded-full bg-secondary border border-border text-muted-foreground">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {opp.niche_suggestions && opp.niche_suggestions.length > 0 && (
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">Niches possibles</div>
            <div className="flex flex-wrap gap-2">
              {opp.niche_suggestions.map((n, i) => (
                <span key={i} className="text-[12px] px-3 py-1 rounded-full bg-secondary border border-border text-muted-foreground">
                  {n}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section 4: Actions */}
      <div className="border border-border rounded-xl p-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={launchProject}
          className="cta-rainbow relative flex-1 bg-foreground text-background rounded-xl px-6 py-3 text-sm font-semibold text-center hover:opacity-90 transition-opacity"
        >
          Lancer ce projet
        </button>

        {userId && (
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
          >
            {isSaved
              ? <><BookmarkCheck size={15} strokeWidth={1.5} /> Sauvegarde</>
              : <><Bookmark size={15} strokeWidth={1.5} /> Sauvegarder</>
            }
          </button>
        )}
      </div>

    </div>
  )
}
