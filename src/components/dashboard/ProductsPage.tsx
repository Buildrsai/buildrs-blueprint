import { CheckCircle2, Lock, ArrowRight, Zap } from 'lucide-react'
import { PRODUCTS_CATALOG } from '../../data/products-catalog'
import { usePackDeal } from '../../hooks/usePackDeal'
import type { AccessContext } from '../../hooks/useAccess'

interface Props {
  userId: string
  navigate: (hash: string) => void
  access: AccessContext | undefined
}

const CATEGORY_LABELS: Record<string, string> = {
  construire: 'Formation',
  claude: 'Environnement Claude',
  agents: 'Agents IA',
  coaching: 'Coaching',
}

export function ProductsPage({ navigate, access }: Props) {
  const packDeal = usePackDeal(access)

  const categories = ['construire', 'claude', 'agents', 'coaching'] as const

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight" style={{ letterSpacing: '-0.03em' }}>
          Nos Produits
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tout ce qu'il faut pour lancer ton SaaS — de la formation aux agents IA.
        </p>
      </div>

      {/* Pack deal banner */}
      {packDeal && packDeal.count >= 2 && (
        <div className="relative rounded-xl overflow-hidden mb-6" style={{ padding: 2 }}>
          <div className="absolute" style={{
            inset: -40,
            background: 'conic-gradient(#4d96ff, #8b5cf6, #f43f5e, #f97316, #4d96ff)',
            animation: 'cohorte-spin 4s linear infinite',
          }} />
          <div className="relative rounded-[10px] p-4 flex items-center justify-between gap-4" style={{ background: 'hsl(var(--background))' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(77,150,255,0.1)' }}>
                <Zap size={14} strokeWidth={1.5} style={{ color: '#4d96ff' }} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Pack Deal -15%</p>
                <p className="text-xs text-muted-foreground">
                  Prends tout ensemble et economise {packDeal.savingsEur}EUR
                  <span className="ml-2 line-through text-muted-foreground/50">{packDeal.totalEur}EUR</span>
                  <span className="ml-1 font-bold text-foreground">{packDeal.discountedEur}EUR</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('#/dashboard/offers')}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity flex-shrink-0"
            >
              Voir l'offre
              <ArrowRight size={12} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}

      {/* Products by category */}
      {categories.map(cat => {
        const products = PRODUCTS_CATALOG.filter(p => p.category === cat)
        if (products.length === 0) return null
        return (
          <div key={cat} className="mb-6">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 mb-3">
              {CATEGORY_LABELS[cat] ?? cat}
            </p>
            <div className="flex flex-col gap-3">
              {products.map(product => {
                const owned = access?.hasProduct(product.slug) ?? false
                return (
                  <div
                    key={product.slug}
                    className="border rounded-xl p-4 flex items-center gap-4 transition-colors"
                    style={{ borderColor: owned ? 'rgba(34,197,94,0.3)' : 'hsl(var(--border))' }}
                  >
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                      style={{ background: owned ? 'rgba(34,197,94,0.1)' : 'hsl(var(--secondary))', border: `1px solid ${owned ? 'rgba(34,197,94,0.2)' : 'hsl(var(--border))'}` }}
                    >
                      {owned
                        ? <CheckCircle2 size={16} strokeWidth={1.5} style={{ color: '#22c55e' }} />
                        : <Lock size={16} strokeWidth={1.5} className="text-muted-foreground/50" />
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
                        {owned && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                            style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
                            ACHETE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{product.description}</p>
                      {owned && product.category !== 'coaching' && (
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
                            <div className="h-full rounded-full bg-foreground/30" style={{ width: '20%' }} />
                          </div>
                          <span className="text-[9px] text-muted-foreground/60">En cours</span>
                        </div>
                      )}
                    </div>

                    {/* Action */}
                    {owned ? (
                      <button
                        onClick={() => {
                          if (product.category === 'claude') navigate('#/dashboard/claude')
                          else if (product.category === 'agents') navigate('#/dashboard/agents')
                          else navigate('#/dashboard/module/00')
                        }}
                        className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                      >
                        Ouvrir
                        <ArrowRight size={11} strokeWidth={1.5} />
                      </button>
                    ) : (
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-foreground">{product.price}EUR</p>
                        <button
                          onClick={() => navigate('#/dashboard/offers')}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-0.5"
                        >
                          Debloquer
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Coaching CTA */}
      <div className="border border-border rounded-xl p-5 mt-4">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground mb-2">Sprint & Cohorte</p>
        <p className="text-sm text-foreground font-medium mb-1">On construit avec toi</p>
        <p className="text-xs text-muted-foreground mb-3">
          Sprint 72h avec Alfred et son equipe, ou Cohorte 60 jours en groupe avec garantie resultats.
        </p>
        <button
          onClick={() => navigate('#/dashboard/offers')}
          className="flex items-center gap-1.5 text-xs font-semibold text-foreground hover:opacity-70 transition-opacity"
        >
          Decouvrir les offres
          <ArrowRight size={12} strokeWidth={1.5} />
        </button>
      </div>

    </div>
  )
}
