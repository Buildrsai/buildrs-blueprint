import { useState } from 'react'
import { Package, Lock, ChevronRight, CheckCircle } from 'lucide-react'
import { PRODUCTS_CATALOG, formatPrice } from '../../data/products-catalog'
import type { AccessContext } from '../../hooks/useAccess'
import { PurchaseModal } from './PurchaseModal'
import { supabase } from '../../lib/supabase'

interface Props {
  navigate: (hash: string) => void
  access: AccessContext
}

const SECTION_ORDER = [
  {
    key:   'construire' as const,
    label: 'Construire',
    slugs: ['blueprint'],
  },
  {
    key:   'claude' as const,
    label: 'Environnement Claude',
    slugs: ['claude-buildrs', 'claude-code', 'claude-cowork'],
  },
  {
    key:   'extra' as const,
    label: 'Aller plus loin',
    slugs: ['agents-ia', 'sprint', 'cohorte'],
  },
]

export function MarketplacePage({ navigate, access }: Props) {
  const [buySlug, setBuySlug] = useState<string | null>(null)
  const [userId, setUserId]   = useState<string | null>(null)

  const handleUnlock = async (slug: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserId(user.id)
    setBuySlug(slug)
  }

  // Pack complet: 2+ Claude produits non achetés
  const claudeLocked = ['claude-code', 'claude-cowork'].filter(s => !access.hasProduct(s))
  const showPackBanner = claudeLocked.length >= 2
  const packProducts   = PRODUCTS_CATALOG.filter(p => claudeLocked.includes(p.slug))
  const packTotal      = packProducts.reduce((s, p) => s + p.priceCents, 0)
  const packDiscount   = Math.round(packTotal * 0.85)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl border border-border flex items-center justify-center"
          style={{ background: 'hsl(var(--secondary))' }}>
          <Package size={16} strokeWidth={1.5} className="text-foreground" />
        </div>
        <div>
          <h1 className="text-[22px] font-extrabold text-foreground tracking-tight">Nos produits</h1>
          <p className="text-[12px] text-muted-foreground">Chaque produit débloque un nouvel environnement de travail.</p>
        </div>
      </div>

      {/* Pack Complet Banner */}
      {showPackBanner && (
        <div
          className="mb-8 rounded-2xl border border-border p-5 relative overflow-hidden"
          style={{ background: 'hsl(var(--secondary)/0.5)' }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Meilleure valeur
          </p>
          <h2 className="text-[17px] font-extrabold text-foreground mb-1 tracking-tight">
            Pack Complet Environnement Claude
          </h2>
          <p className="text-[12px] text-muted-foreground mb-4">
            {packProducts.map(p => p.shortName).join(' + ')} — tout en un, -15%
          </p>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[22px] font-extrabold text-foreground">{formatPrice(packDiscount)}</span>
            <span className="text-[14px] text-muted-foreground line-through">{formatPrice(packTotal)}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' }}>
              -15%
            </span>
          </div>
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {packProducts.map(p => (
              <span key={p.slug} className="text-[11px] px-2.5 py-1 rounded-lg border border-border text-muted-foreground">
                {p.shortName}
              </span>
            ))}
          </div>
          <button
            onClick={() => handleUnlock(claudeLocked[0])}
            className="w-full rounded-xl py-3 text-[14px] font-bold transition-all duration-150"
            style={{ background: 'hsl(var(--foreground))', color: 'hsl(var(--background))' }}
          >
            Débloquer le pack — {formatPrice(packDiscount)}
          </button>
        </div>
      )}

      {/* Sections */}
      {SECTION_ORDER.map(section => (
        <div key={section.key} className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60 mb-3">
            {section.label}
          </p>
          <div className="flex flex-col gap-3">
            {section.slugs.map(slug => {
              const product = PRODUCTS_CATALOG.find(p => p.slug === slug)
              if (!product) return null
              const owned   = access.hasProduct(slug)
              const premium = slug === 'sprint' || slug === 'cohorte'
              const Icon    = product.icon

              return (
                <div
                  key={slug}
                  className="rounded-xl border p-4 transition-all duration-150"
                  style={{
                    border: owned
                      ? '1px solid rgba(34,197,94,0.3)'
                      : '1px solid hsl(var(--border))',
                    background: owned
                      ? 'rgba(34,197,94,0.04)'
                      : 'hsl(var(--background))',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: owned ? 'rgba(34,197,94,0.12)' : 'hsl(var(--secondary))',
                        border: '1px solid hsl(var(--border))',
                      }}
                    >
                      <Icon size={16} strokeWidth={1.5} style={{ color: owned ? '#22c55e' : 'hsl(var(--foreground))' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-[14px] font-bold text-foreground tracking-tight">{product.name}</h3>
                        {owned && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' }}>
                            ACHETÉ
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-muted-foreground mb-3 leading-relaxed">{product.description}</p>

                      {owned ? (
                        <div className="flex items-center gap-3">
                          {product.totalBricks > 0 && (
                            <div className="flex-1">
                              <div className="h-1.5 rounded-full bg-border overflow-hidden">
                                <div className="h-full rounded-full bg-foreground/30 transition-all" style={{ width: '0%' }} />
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-1">
                                0/{product.totalBricks} briques complétées
                              </p>
                            </div>
                          )}
                          {!premium && slug !== 'agents-ia' && (
                            <button
                              onClick={() => navigate(`#/dashboard/produit/${slug}`)}
                              className="flex items-center gap-1 text-[12px] font-semibold text-foreground hover:opacity-75 transition-opacity flex-shrink-0"
                            >
                              Ouvrir <ChevronRight size={13} strokeWidth={1.5} />
                            </button>
                          )}
                          {slug === 'agents-ia' && (
                            <button
                              onClick={() => navigate('#/dashboard/agents')}
                              className="flex items-center gap-1 text-[12px] font-semibold text-foreground hover:opacity-75 transition-opacity flex-shrink-0"
                            >
                              Ouvrir <ChevronRight size={13} strokeWidth={1.5} />
                            </button>
                          )}
                        </div>
                      ) : premium ? (
                        <button
                          onClick={() => navigate('#/dashboard/offers')}
                          className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Découvrir <ChevronRight size={13} strokeWidth={1.5} />
                        </button>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Lock size={12} strokeWidth={1.5} />
                            <span className="text-[12px] font-semibold">{formatPrice(product.priceCents)}</span>
                          </div>
                          <button
                            onClick={() => handleUnlock(slug)}
                            className="text-[12px] font-bold px-4 py-1.5 rounded-lg transition-all duration-150"
                            style={{ background: 'hsl(var(--foreground))', color: 'hsl(var(--background))' }}
                          >
                            Débloquer →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Modal d'achat */}
      {buySlug && userId && (
        <PurchaseModal
          productSlug={buySlug}
          userId={userId}
          access={access}
          onClose={() => setBuySlug(null)}
        />
      )}
    </div>
  )
}
