import { useState } from 'react'
import { Search, Heart, X, TrendingUp, Clock, ChevronDown, DollarSign } from 'lucide-react'
import { useMarketplaceIdeas, type SaasIdea } from '../../hooks/useMarketplaceIdeas'

// ── Helpers ──────────────────────────────────────────────────────────────────

const LOGO_COLORS = [
  '#f97316','#3b82f6','#8b5cf6','#ec4899','#14b8a6',
  '#22c55e','#eab308','#ef4444','#06b6d4','#a78bfa',
]

const DIFF_LABEL: Record<number, string> = { 1:'Facile', 2:'Facile', 3:'Moyen', 4:'Avancé', 5:'Expert' }

function buildTime(d: number)   { return ['~1j','~2j','~3-4j','~5-7j','~2sem'][d-1] ?? '~2j' }
function competitors(d: number) { return [3,5,8,12,20][d-1] ?? 5 }
function daysToFirst(d: number) { return ['7j','14j','21j','30j','45j'][d-1] ?? '14j' }
function marketSize(max: number) {
  if (max >= 50000) return '$5B+'
  if (max >= 20000) return '$2B+'
  if (max >= 10000) return '$1.5B+'
  if (max >= 5000)  return '$500M+'
  return '$100M+'
}
function formatMRR(max: number) {
  return max >= 1000 ? `€${Math.round(max/1000)}k+` : `€${max}`
}

// ── Card ─────────────────────────────────────────────────────────────────────

function IdeaCard({ idea, idx, saved, onSave, onPass, onOpen }: {
  idea: SaasIdea
  idx: number
  saved: boolean
  onSave: () => void
  onPass: () => void
  onOpen: () => void
}) {
  const color    = LOGO_COLORS[idx % LOGO_COLORS.length]
  const initials = idea.title.slice(0, 2).toUpperCase()
  const category = (idea.tags[0] ?? 'SaaS IA').toUpperCase()
  const trending = idx < 4 || idx % 4 === 0
  const date     = new Date(idea.created_at).toLocaleDateString('fr-FR', { day:'numeric', month:'short' })
  const compCount = competitors(idea.difficulty)

  return (
    <div className="flex border border-border rounded-xl overflow-hidden transition-colors hover:border-foreground/20 bg-card">

      {/* ── Main ── */}
      <div className="flex-1 min-w-0 p-5">

        {/* Top meta */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50">
            {category}
          </span>
          {trending && (
            <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{ background:'rgba(77,150,255,0.12)', color:'#4d96ff' }}>
              <TrendingUp size={8} strokeWidth={2} /> Trending
            </span>
          )}
          <span className="ml-auto text-[10px] text-muted-foreground/35">{date}</span>
        </div>

        {/* Logo + title + desc */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-[13px] font-black text-white"
            style={{ background: color }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground text-[15px] leading-tight mb-1" style={{ letterSpacing:'-0.02em' }}>
              {idea.title}
            </h3>
            <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">
              {idea.target_audience ?? ''}
            </p>
          </div>
        </div>

        {/* Metrics row */}
        <div className="flex items-center gap-5 mb-4 text-[12px]">
          <span className="flex items-center gap-1 font-bold tabular-nums" style={{ color:'#22c55e' }}>
            <DollarSign size={11} strokeWidth={2.5} />
            {formatMRR(idea.mrr_max)} /mo
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="text-[15px] leading-none font-light">∞</span>
            {DIFF_LABEL[idea.difficulty]}
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Clock size={11} strokeWidth={1.5} />
            {buildTime(idea.difficulty)}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-3" />

        {/* Bottom: competitor dots + stats + CTA */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Competitor avatar dots */}
          <div className="flex -space-x-1.5">
            {Array.from({ length: Math.min(compCount, 4) }).map((_, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border-2 flex-shrink-0"
                style={{
                  background: LOGO_COLORS[(idx + i + 2) % LOGO_COLORS.length],
                  borderColor: 'hsl(var(--card))',
                }}
              />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">{compCount} concurrents</span>
          <span className="text-muted-foreground/30 text-[10px]">·</span>
          <span className="text-[10px] text-muted-foreground">{daysToFirst(idea.difficulty)} 1er €</span>
          <span className="text-muted-foreground/30 text-[10px]">·</span>
          <span className="text-[10px] text-muted-foreground">{marketSize(idea.mrr_max)}</span>

          {/* CTA */}
          <button
            onClick={onOpen}
            className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold px-3.5 py-1.5 rounded-lg transition-opacity hover:opacity-85"
            style={{ background:'#4d96ff', color:'white' }}
          >
            Voir le plan →
          </button>
        </div>
      </div>

      {/* ── Right action panel ── */}
      <div className="flex flex-col w-[72px] flex-shrink-0 border-l border-border">

        {/* Interested */}
        <button
          onClick={e => { e.stopPropagation(); onSave() }}
          className="flex-1 flex flex-col items-center justify-center gap-1.5 transition-all hover:opacity-80"
          style={saved ? { background:'rgba(77,150,255,0.1)' } : {}}
        >
          <Heart
            size={18} strokeWidth={1.5}
            fill={saved ? '#4d96ff' : 'none'}
            style={{ color: saved ? '#4d96ff' : 'hsl(var(--muted-foreground))' }}
          />
          <span className="text-[9px] font-bold leading-tight text-center" style={{ color: saved ? '#4d96ff' : 'hsl(var(--muted-foreground))' }}>
            Intéressé
          </span>
        </button>

        <div className="border-t border-border" />

        {/* Pass */}
        <button
          onClick={e => { e.stopPropagation(); onPass() }}
          className="flex-1 flex flex-col items-center justify-center gap-1.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
        >
          <X size={15} strokeWidth={1.5} />
          <span className="text-[9px] font-bold">Passer</span>
        </button>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  userId: string | undefined
  navigate: (hash: string) => void
}

export function MarketplaceIdeasPage({ userId, navigate }: Props) {
  const { ideas, loading, filters, setFilters, saveIdea, unsaveIdea, savedIds } = useMarketplaceIdeas(userId)
  const [search, setSearch]     = useState('')
  const [showSaved, setShowSaved] = useState(false)
  const [passed, setPassed]     = useState<Set<string>>(new Set())
  const [catOpen, setCatOpen]   = useState(false)
  const [sortBy, setSortBy]     = useState<'newest' | 'revenue'>('newest')

  const allTags = [...new Set(ideas.flatMap(i => i.tags))]

  const filtered = ideas
    .filter(idea => {
      if (passed.has(idea.id)) return false
      if (showSaved && !savedIds.has(idea.id)) return false
      if (search) {
        const q = search.toLowerCase()
        return idea.title.toLowerCase().includes(q) || (idea.target_audience ?? '').toLowerCase().includes(q)
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'revenue') return b.mrr_max - a.mrr_max
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-5 h-5 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      {/* ── Hero ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight" style={{ letterSpacing: '-0.03em' }}>
          Idées SaaS
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Parcours les opportunités sélectionnées, sauvegarde celles qui t'inspirent.
        </p>
      </div>

      {/* ── Search ── */}
      <div className="flex items-center gap-2.5 border border-border rounded-2xl px-4 py-3 bg-secondary/20 mb-5">
        <Search size={14} strokeWidth={1.5} className="text-muted-foreground flex-shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par nom, cible, stack..."
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
        />
      </div>

      {/* ── Filter pills ── */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">

        {/* Categories */}
        <div className="relative">
          <button
            onClick={() => setCatOpen(o => !o)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border text-[12px] font-medium text-foreground hover:bg-secondary transition-colors"
          >
            Catégories <ChevronDown size={10} strokeWidth={2} style={{ transform: catOpen ? 'rotate(180deg)' : 'none', transition:'transform 150ms' }} />
          </button>
          {catOpen && (
            <div className="absolute top-full left-0 mt-1.5 bg-background border border-border rounded-xl shadow-xl z-30 min-w-[160px] py-1 overflow-hidden">
              <button
                onClick={() => { setFilters(f => ({ ...f, tag: null })); setCatOpen(false) }}
                className="w-full text-left px-4 py-2 text-[12px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                Toutes
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => { setFilters(f => ({ ...f, tag })); setCatOpen(false) }}
                  className="w-full text-left px-4 py-2 text-[12px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors capitalize"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort */}
        <button
          onClick={() => setSortBy(s => s === 'newest' ? 'revenue' : 'newest')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-border text-[12px] font-medium text-foreground hover:bg-secondary transition-colors"
        >
          {sortBy === 'newest' ? 'Plus récent' : 'Revenu'} <ChevronDown size={10} strokeWidth={2} />
        </button>

        {/* Interested */}
        <button
          onClick={() => setShowSaved(s => !s)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[12px] font-medium transition-colors"
          style={showSaved
            ? { borderColor:'rgba(77,150,255,0.4)', background:'rgba(77,150,255,0.1)', color:'#4d96ff' }
            : { borderColor:'hsl(var(--border))', color:'hsl(var(--foreground))' }
          }
        >
          <Heart size={11} strokeWidth={2} fill={showSaved ? '#4d96ff' : 'none'} />
          Intéressé
          {savedIds.size > 0 && (
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ background:'#4d96ff', color:'white' }}>
              {savedIds.size}
            </span>
          )}
        </button>

        {/* Count */}
        <span className="ml-auto text-[11px] text-muted-foreground/50">
          {filtered.length} idée{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── List ── */}
      <div className="flex flex-col gap-3">
        {filtered.map((idea, i) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            idx={i}
            saved={savedIds.has(idea.id)}
            onSave={() => savedIds.has(idea.id) ? unsaveIdea(idea.id) : saveIdea(idea.id)}
            onPass={() => setPassed(prev => new Set([...prev, idea.id]))}
            onOpen={() => navigate(`#/dashboard/marketplace/${idea.slug}`)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm">Aucune idée ne correspond à ta recherche.</p>
          {showSaved && (
            <button
              onClick={() => setShowSaved(false)}
              className="mt-2 text-xs underline text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              Voir toutes les idées
            </button>
          )}
          {passed.size > 0 && (
            <button
              onClick={() => setPassed(new Set())}
              className="mt-2 block mx-auto text-xs underline text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              Réafficher les idées passées ({passed.size})
            </button>
          )}
        </div>
      )}

    </div>
  )
}
