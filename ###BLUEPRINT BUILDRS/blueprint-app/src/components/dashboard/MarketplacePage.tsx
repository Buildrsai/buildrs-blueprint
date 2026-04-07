// blueprint-app/src/components/dashboard/MarketplacePage.tsx
import { useState } from 'react'
import { Search, Bookmark, BookmarkCheck, RefreshCw, TrendingUp, Zap, DollarSign, ChevronDown } from 'lucide-react'
import { useOpportunities, type SaasOpportunity, type OpportunityFilters } from '../../hooks/useOpportunities'
import { supabase } from '../../lib/supabase'

// ── Helpers ──────────────────────────────────────────────────────────────────

const SOURCE_COLORS: Record<string, string> = {
  product_hunt: '#ff6154',
  reddit: '#ff4500',
  acquire: '#22c55e',
  indie_hackers: '#0fa',
  g2_capterra: '#3b82f6',
  manual_curated: '#8b5cf6',
  generator_live: '#f59e0b',
}

const SOURCE_LABELS: Record<string, string> = {
  product_hunt: 'PH',
  reddit: 'Reddit',
  acquire: 'Acquire',
  indie_hackers: 'IH',
  g2_capterra: 'G2',
  manual_curated: 'Buildrs',
  generator_live: 'Live',
}

const CATEGORIES = [
  { value: '', label: 'Toutes' },
  { value: 'crm', label: 'CRM' },
  { value: 'invoicing', label: 'Facturation' },
  { value: 'scheduling', label: 'Booking' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'productivity', label: 'Productivite' },
  { value: 'hr', label: 'RH' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Sante' },
  { value: 'other', label: 'Autre' },
]

function scoreColor(score: number): string {
  if (score >= 70) return '#22c55e'
  if (score >= 40) return '#eab308'
  return '#ef4444'
}

function ScoreMiniBar({ label, value, Icon }: { label: string; value: number; Icon: typeof TrendingUp }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={11} className="shrink-0" style={{ color: scoreColor(value) }} strokeWidth={1.5} />
      <span className="text-[10px] text-muted-foreground w-16 shrink-0">{label}</span>
      <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, background: scoreColor(value) }}
        />
      </div>
      <span className="text-[10px] font-mono text-muted-foreground w-6 text-right">{value}</span>
    </div>
  )
}

function timeAgo(isoDate: string | null): string {
  if (!isoDate) return 'jamais'
  const diff = Date.now() - new Date(isoDate).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return "moins d'1h"
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}j`
}

// ── OpportunityCard ───────────────────────────────────────────────────────────

function OpportunityCard({
  opp, saved, onSave, onOpen,
}: {
  opp: SaasOpportunity
  saved: boolean
  onSave: () => void
  onOpen: () => void
}) {
  const srcColor = SOURCE_COLORS[opp.source] ?? '#8b5cf6'
  const srcLabel = SOURCE_LABELS[opp.source] ?? opp.source

  return (
    <div
      className="border border-border rounded-xl p-5 flex flex-col gap-4 cursor-pointer hover:border-foreground/20 transition-colors bg-card"
      onClick={onOpen}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
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
        <button
          className="text-muted-foreground hover:text-foreground transition-colors"
          onClick={e => { e.stopPropagation(); onSave() }}
        >
          {saved
            ? <BookmarkCheck size={16} strokeWidth={1.5} className="text-foreground" />
            : <Bookmark size={16} strokeWidth={1.5} />
          }
        </button>
      </div>

      {/* Titre + tagline */}
      <div>
        <h3 className="font-bold text-foreground text-[15px] leading-tight mb-1" style={{ letterSpacing: '-0.02em' }}>
          {opp.name}
        </h3>
        <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">
          {opp.tagline}
        </p>
      </div>

      {/* Build Score block */}
      <div className="border border-border rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
            Build Score
          </span>
          <span
            className="text-2xl font-black font-mono"
            style={{ color: scoreColor(opp.build_score), letterSpacing: '-0.03em' }}
          >
            {opp.build_score}
          </span>
        </div>
        <ScoreMiniBar label="Traction" value={opp.traction_score} Icon={TrendingUp} />
        <ScoreMiniBar label="Cloneabilite" value={opp.cloneability_score} Icon={Zap} />
        <ScoreMiniBar label="Monetisation" value={opp.monetization_score} Icon={DollarSign} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px]">
        <div className="text-muted-foreground">
          {opp.mrr_estimated
            ? <span>MRR ~<span className="font-mono font-semibold text-foreground">${opp.mrr_estimated.toLocaleString()}</span></span>
            : <span className="text-muted-foreground/40">MRR inconnu</span>
          }
        </div>
        {opp.differentiation_angle && (
          <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground truncate max-w-[130px]">
            {opp.differentiation_angle.slice(0, 35)}
          </span>
        )}
      </div>
    </div>
  )
}

// ── MarketplacePage ───────────────────────────────────────────────────────────

interface Props {
  userId: string | undefined
  navigate: (hash: string) => void
  isAdmin?: boolean
}

export function MarketplacePage({ userId, navigate, isAdmin = false }: Props) {
  const {
    opportunities, loading, total, filters, setFilters,
    loadMore, hasMore, savedIds, saveOpportunity, unsaveOpportunity, lastUpdated,
  } = useOpportunities(userId)

  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) return
      const supaUrl = import.meta.env.VITE_SUPABASE_URL as string
      await fetch(`${supaUrl}/functions/v1/scanner-status?action=run`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      setTimeout(() => window.location.reload(), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground" style={{ letterSpacing: '-0.04em' }}>
            Marketplace
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {total} opportunite{total !== 1 ? 's' : ''} &middot; Mis a jour il y a {timeAgo(lastUpdated)}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} strokeWidth={1.5} className={refreshing ? 'animate-spin' : ''} />
            Refresh Scanner
          </button>
        )}
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
            value={filters.search ?? ''}
            onChange={e => setFilters({ search: e.target.value })}
          />
        </div>

        {/* Categorie */}
        <div className="relative">
          <select
            className="appearance-none pl-3 pr-8 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer"
            value={filters.category ?? ''}
            onChange={e => setFilters({ category: e.target.value || null })}
          >
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>

        {/* Source */}
        <div className="relative">
          <select
            className="appearance-none pl-3 pr-8 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer"
            value={filters.source ?? ''}
            onChange={e => setFilters({ source: e.target.value || null })}
          >
            <option value="">Toutes sources</option>
            <option value="product_hunt">Product Hunt</option>
            <option value="reddit">Reddit</option>
            <option value="acquire">Acquire</option>
            <option value="manual_curated">Buildrs</option>
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>

        {/* Score min */}
        <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-background text-sm">
          <span className="text-muted-foreground text-xs">Score min</span>
          <input
            type="range" min={0} max={90} step={10}
            value={filters.buildScoreMin ?? 0}
            onChange={e => setFilters({ buildScoreMin: Number(e.target.value) })}
            className="w-20 accent-foreground"
          />
          <span className="font-mono text-xs w-6">{filters.buildScoreMin ?? 0}</span>
        </div>

        {/* Tri */}
        <div className="relative">
          <select
            className="appearance-none pl-3 pr-8 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none cursor-pointer"
            value={filters.sortBy ?? 'build_score'}
            onChange={e => setFilters({ sortBy: e.target.value as OpportunityFilters['sortBy'] })}
          >
            <option value="build_score">Score</option>
            <option value="created_at">Recents</option>
            <option value="traction_score">Traction</option>
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Grille */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-border rounded-xl p-5 h-64 animate-pulse bg-secondary/30" />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">Aucune opportunite trouvee</p>
          <p className="text-sm mt-1">Modifie les filtres ou reviens apres le prochain scan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opp={opp}
              saved={savedIds.has(opp.id)}
              onSave={() => savedIds.has(opp.id)
                ? unsaveOpportunity(opp.id)
                : saveOpportunity(opp.id)
              }
              onOpen={() => navigate(`#/dashboard/marketplace/${opp.slug}`)}
            />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            className="px-6 py-3 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
          >
            Charger plus
          </button>
        </div>
      )}
    </div>
  )
}
