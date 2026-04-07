// blueprint-app/src/components/dashboard/MarketplacePage.tsx
import { useState } from 'react'
import { Search, RefreshCw, ChevronDown, Star } from 'lucide-react'
import { useSources, type SourceFilters } from '../../hooks/useSources'
import { SourceCard } from './SourceCard'
import { supabase } from '../../lib/supabase'

const CATEGORIES = [
  { value: '', label: 'Toutes' },
  { value: 'scheduling', label: 'Booking' },
  { value: 'crm', label: 'CRM' },
  { value: 'invoicing', label: 'Facturation' },
  { value: 'education', label: 'Education' },
  { value: 'productivity', label: 'Productivite' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'design', label: 'Design' },
  { value: 'devtools', label: 'Dev Tools' },
  { value: 'hr', label: 'RH' },
  { value: 'pos', label: 'POS' },
  { value: 'other', label: 'Autre' },
]

interface Props {
  userId: string | undefined
  navigate: (hash: string) => void
  isAdmin?: boolean
}

export function MarketplacePage({ userId, navigate, isAdmin = false }: Props) {
  const {
    sources, loading, total, filters, setFilters,
    loadMore, hasMore, favoriteIds, addFavorite, removeFavorite,
  } = useSources(userId)

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
            {total} SaaS &middot; Modeles clonables analyses par IA
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
            placeholder="Rechercher un SaaS..."
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
            onChange={e => setFilters({ sortBy: e.target.value as SourceFilters['sortBy'] })}
          >
            <option value="build_score">Score</option>
            <option value="created_at">Recents</option>
            <option value="name">Nom</option>
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>

        {/* Featured toggle */}
        <button
          onClick={() => setFilters({ featuredOnly: !filters.featuredOnly })}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
            filters.featuredOnly
              ? 'border-foreground bg-foreground text-background'
              : 'border-border hover:bg-secondary'
          }`}
        >
          <Star size={12} strokeWidth={1.5} />
          Featured
        </button>
      </div>

      {/* Grille */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-border rounded-xl p-5 h-72 animate-pulse bg-secondary/30" />
          ))}
        </div>
      ) : sources.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">Aucun SaaS trouve</p>
          <p className="text-sm mt-1">Modifie les filtres ou reviens plus tard.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map((source) => (
            <SourceCard
              key={source.id}
              source={source}
              saved={favoriteIds.has(source.id)}
              onSave={() => favoriteIds.has(source.id)
                ? removeFavorite(source.id)
                : addFavorite(source.id)
              }
              onOpen={() => navigate(`#/dashboard/marketplace/${source.slug}`)}
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
