// blueprint-app/src/components/dashboard/SourceDetailPage.tsx
import { useState, useEffect } from 'react'
import { ArrowLeft, ExternalLink, Bookmark, BookmarkCheck, TrendingUp, Zap, DollarSign, Clock, Layers, Target } from 'lucide-react'
import { useSourceBySlug } from '../../hooks/useSources'
import { SaasLogo } from '../ui/SaasLogo'
import { BrandIcons } from '../ui/icons'
import { supabase } from '../../lib/supabase'

// Reusable helpers
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

function scoreColor(score: number) {
  return score >= 70 ? '#22c55e' : score >= 40 ? '#eab308' : '#ef4444'
}

function formatRevenue(mrr: number | null, arr: number | null, source: string | null): string | null {
  if (mrr) return `MRR $${mrr >= 1000 ? `${(mrr / 1000).toFixed(0)}k` : mrr}${source ? ` (${source})` : ''}`
  if (arr) return `ARR $${arr >= 1000000 ? `${(arr / 1000000).toFixed(1)}M` : arr >= 1000 ? `${(arr / 1000).toFixed(0)}k` : arr}${source ? ` (${source})` : ''}`
  return null
}

interface Props {
  slug: string
  userId: string | undefined
  navigate: (hash: string) => void
}

export function SourceDetailPage({ slug, userId, navigate }: Props) {
  const { source, loading } = useSourceBySlug(slug)
  const opp = source?.opportunity ?? null

  const [isSaved, setIsSaved] = useState(false)
  const [launching, setLaunching] = useState(false)

  useEffect(() => {
    if (!userId || !source?.id) return
    supabase
      .from('user_favorites')
      .select('source_id')
      .eq('user_id', userId)
      .eq('source_id', source.id)
      .maybeSingle()
      .then(({ data }) => setIsSaved(!!data))
  }, [userId, source?.id])

  const handleSave = async () => {
    if (!userId || !source?.id) return
    if (isSaved) {
      await supabase.from('user_favorites').delete().eq('user_id', userId).eq('source_id', source.id)
      setIsSaved(false)
    } else {
      await supabase.from('user_favorites').insert({ user_id: userId, source_id: source.id })
      setIsSaved(true)
    }
  }

  const launchProject = async () => {
    if (!userId || !opp) return
    setLaunching(true)
    try {
      await supabase.from('user_projects').insert({
        user_id: userId,
        opportunity_id: opp.id,
        status: 'planning',
        notes: {},
      })
    } catch (_) { /* already exists or error — continue anyway */ }
    sessionStorage.setItem('generator_context', JSON.stringify({
      source: {
        name: source?.name,
        domain: source?.domain ?? null,
        tagline: source?.tagline ?? null,
        category: source?.category,
        logo_url: source?.logo_url ?? null,
        opportunity_title: opp.opportunity_title,
        target_niche: opp.target_niche,
        build_score: opp.build_score,
        opportunity_id: opp.id,
      },
    }))
    navigate('#/dashboard/generator')
    setLaunching(false)
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

  if (!source) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-muted-foreground">
        <p className="text-lg font-medium">SaaS introuvable</p>
        <button
          onClick={() => navigate('#/dashboard/marketplace')}
          className="mt-4 text-sm underline hover:text-foreground transition-colors"
        >
          Retour a la Marketplace
        </button>
      </div>
    )
  }

  const revenue = formatRevenue(source.mrr_reported, source.arr_reported, source.mrr_source)
  const externalLinks = Object.entries(source.source_urls ?? {}).filter(([, v]) => v)

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

      {/* ── Section 1 : Le SaaS ────────────────────────────────────────── */}
      <div className="border border-border rounded-xl p-6 space-y-5">

        {/* Header SaaS */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="shrink-0 rounded-xl border border-border bg-white overflow-hidden flex items-center justify-center"
              style={{ width: 80, height: 80, padding: 8 }}
            >
              <SaasLogo logoUrl={source.logo_url} name={source.name} domain={source.domain} size="lg" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-foreground" style={{ letterSpacing: '-0.03em' }}>
                  {source.name}
                </h1>
                {source.is_featured && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-foreground text-background uppercase tracking-wide">
                    Featured
                  </span>
                )}
                {source.is_verified && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground uppercase tracking-wide">
                    Verifie
                  </span>
                )}
              </div>
              {source.tagline && (
                <p className="text-muted-foreground text-sm mt-0.5">{source.tagline}</p>
              )}
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50">
                  {source.category}{source.subcategory ? ` / ${source.subcategory}` : ''}
                </span>
                {source.domain && (
                  <a
                    href={`https://${source.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                    onClick={e => e.stopPropagation()}
                  >
                    {source.domain}
                    <ExternalLink size={10} strokeWidth={1.5} />
                  </a>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            {isSaved
              ? <BookmarkCheck size={18} strokeWidth={1.5} className="text-foreground" />
              : <Bookmark size={18} strokeWidth={1.5} />
            }
          </button>
        </div>

        {/* Description */}
        {source.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{source.description}</p>
        )}

        {/* Screenshot */}
        {source.screenshot_url && (
          <img
            src={source.screenshot_url}
            alt={`${source.name} screenshot`}
            className="rounded-lg w-full aspect-video object-cover border border-border"
          />
        )}

        {/* Meta grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {revenue && (
            <div className="border border-border rounded-lg p-3 space-y-0.5">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground/50 font-medium">Revenus</p>
              <p className="text-sm font-semibold text-foreground font-mono">{revenue}</p>
            </div>
          )}
          {source.pricing_model && (
            <div className="border border-border rounded-lg p-3 space-y-0.5">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground/50 font-medium">Modele</p>
              <p className="text-sm font-medium text-foreground capitalize">{source.pricing_model.replace('_', ' ')}</p>
            </div>
          )}
          {source.founder_names && (
            <div className="border border-border rounded-lg p-3 space-y-0.5">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground/50 font-medium">Fondateurs</p>
              <p className="text-sm font-medium text-foreground">{source.founder_names}</p>
            </div>
          )}
          {source.founded_year && (
            <div className="border border-border rounded-lg p-3 space-y-0.5">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground/50 font-medium">Fondee en</p>
              <p className="text-sm font-semibold text-foreground font-mono">{source.founded_year}</p>
            </div>
          )}
          {source.employee_count_range && (
            <div className="border border-border rounded-lg p-3 space-y-0.5">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground/50 font-medium">Equipe</p>
              <p className="text-sm font-medium text-foreground">{source.employee_count_range}</p>
            </div>
          )}
        </div>

        {/* Tech stack */}
        {source.tech_stack.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-medium mb-2">Stack technique</p>
            <div className="flex flex-wrap gap-2">
              {source.tech_stack.map(t => <StackBadge key={t} name={t} />)}
            </div>
          </div>
        )}

        {/* External links */}
        {externalLinks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {externalLinks.map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary/50 text-[12px] font-medium hover:border-foreground/30 transition-colors"
              >
                {key.replace(/_/g, ' ')}
                <ExternalLink size={10} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* ── Section 2 : Opportunite Buildrs ───────────────────────────── */}
      {opp && (
        <div className="border border-border rounded-xl p-6 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-1">
                Opportunite Buildrs
              </p>
              <h2 className="text-xl font-black text-foreground" style={{ letterSpacing: '-0.03em' }}>
                {opp.opportunity_title}
              </h2>
              {opp.target_niche && (
                <p className="text-sm text-muted-foreground mt-1">{opp.target_niche}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground/50 mb-0.5">Build Score</p>
              <span
                className="text-4xl font-black font-mono"
                style={{ color: scoreColor(opp.build_score), letterSpacing: '-0.04em' }}
              >
                {opp.build_score}
              </span>
            </div>
          </div>

          {opp.problem_solved && (
            <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-border pl-3">
              {opp.problem_solved}
            </p>
          )}

          {/* Scores */}
          <div className="space-y-3">
            <ScoreBar label="Traction" value={opp.traction_score} explanation={opp.traction_explanation} Icon={TrendingUp} />
            <ScoreBar label="Cloneabilite" value={opp.cloneability_score} explanation={opp.cloneability_explanation} Icon={Zap} />
            <ScoreBar label="Monetisation" value={opp.monetization_score} explanation={opp.monetization_explanation} Icon={DollarSign} />
          </div>

          {/* Why reproducible */}
          {opp.why_reproducible && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-medium mb-1.5">
                Pourquoi c'est reproductible
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">{opp.why_reproducible}</p>
            </div>
          )}

          {/* Differentiation */}
          {opp.differentiation_angle && (
            <div className="border border-border rounded-lg p-4 bg-secondary/30">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50 font-medium mb-1.5">
                <Target size={11} strokeWidth={1.5} />
                Angle de differenciation
              </div>
              <p className="text-sm font-medium text-foreground">{opp.differentiation_angle}</p>
            </div>
          )}

          {/* Build time */}
          {opp.estimated_build_time && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={14} strokeWidth={1.5} />
              Temps de build estimé : <span className="font-semibold text-foreground">{opp.estimated_build_time}</span>
            </div>
          )}
        </div>
      )}

      {/* ── Section 3 : Blueprint ─────────────────────────────────────── */}
      {opp && (
        <div className="border border-border rounded-xl p-6 space-y-5">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Layers size={16} strokeWidth={1.5} />
            Blueprint
          </h3>

          {/* MVP Features */}
          {opp.mvp_features.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-medium mb-2">
                Features MVP
              </p>
              <ul className="space-y-1.5">
                {opp.mvp_features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-foreground font-mono text-[10px] mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommended stack */}
          {opp.recommended_stack.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-medium mb-2">
                Stack recommande
              </p>
              <div className="flex flex-wrap gap-2">
                {opp.recommended_stack.map(t => <StackBadge key={t} name={t} />)}
              </div>
            </div>
          )}

          {/* Pricing */}
          {opp.pricing_suggestion && (
            <div className="border border-border rounded-lg p-4">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-medium mb-1">
                Suggestion de prix
              </p>
              <p className="text-base font-semibold text-foreground">{opp.pricing_suggestion}</p>
            </div>
          )}

          {/* Acquisition */}
          {opp.acquisition_channels.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-medium mb-2">
                Canaux d'acquisition
              </p>
              <div className="flex flex-wrap gap-2">
                {opp.acquisition_channels.map((c, i) => (
                  <span key={i} className="text-[12px] font-medium px-3 py-1.5 rounded-lg border border-border bg-secondary/50">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Niche suggestions */}
          {opp.niche_suggestions.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-medium mb-2">
                Niches suggerees
              </p>
              <div className="flex flex-wrap gap-2">
                {opp.niche_suggestions.map((n, i) => (
                  <span key={i} className="text-[12px] font-medium px-3 py-1.5 rounded-full border border-border bg-secondary/50">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Section 4 : Actions ───────────────────────────────────────── */}
      {opp && (
        <div className="border border-border rounded-xl p-6 space-y-4">
          <button
            onClick={launchProject}
            disabled={launching || !userId}
            className="cta-rainbow relative w-full bg-foreground text-background rounded-xl px-6 py-4 text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {launching ? 'Lancement...' : 'Lancer ce projet →'}
          </button>
          <p className="text-[11px] text-muted-foreground/50 text-center">
            Demarre un projet Blueprint avec cette opportunite comme point de depart
          </p>
        </div>
      )}

    </div>
  )
}
