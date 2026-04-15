import { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, Lock, CheckCircle, Circle } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { PRODUCTS_CATALOG } from '../../../data/products-catalog'
import type { AccessContext } from '../../../hooks/useAccess'
import { PurchaseModal } from '../PurchaseModal'

interface Brick {
  id: string
  title: string
  sort_order: number
}

interface Bloc {
  id: string
  title: string
  description: string | null
  sort_order: number
  total_bricks: number
  bricks: Brick[]
}

interface Props {
  slug: string
  navigate: (hash: string) => void
  access: AccessContext
  isBrickCompleted: (id: string) => boolean
  markBrickComplete: (id: string) => Promise<void>
}

export function ProductPage({ slug, navigate, access, isBrickCompleted, markBrickComplete }: Props) {
  const [blocs, setBlocs]       = useState<Bloc[]>([])
  const [loading, setLoading]   = useState(true)
  const [openBloc, setOpenBloc] = useState<string | null>(null)
  const [buyModal, setBuyModal] = useState(false)
  const [userId, setUserId]     = useState<string | null>(null)

  const product  = PRODUCTS_CATALOG.find(p => p.slug === slug)
  const unlocked = access.hasProduct(slug)

  useEffect(() => {
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)

      const { data: blocsData } = await supabase
        .from('content_blocs')
        .select('id, title, description, sort_order, total_bricks')
        .eq('product_slug', slug)
        .order('sort_order')

      if (!blocsData) { setLoading(false); return }

      const blocsWithBricks = await Promise.all(
        blocsData.map(async bloc => {
          const { data: bricksData } = await supabase
            .from('content_bricks')
            .select('id, title, sort_order')
            .eq('bloc_id', bloc.id)
            .order('sort_order')
          return { ...bloc, bricks: bricksData ?? [] }
        })
      )
      setBlocs(blocsWithBricks)
      if (blocsWithBricks.length > 0) setOpenBloc(blocsWithBricks[0].id)
      setLoading(false)
    })()
  }, [slug])

  // Progress
  const allBrickIds = blocs.flatMap(b => b.bricks.map(br => br.id))
  const doneBricks  = allBrickIds.filter(id => isBrickCompleted(id)).length

  if (!product) return null

  const Icon = product.icon

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Header */}
      <button
        onClick={() => navigate('#/dashboard/produits')}
        className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronRight size={12} strokeWidth={1.5} style={{ transform: 'rotate(180deg)' }} />
        Nos produits
      </button>

      <div className="flex items-start gap-4 mb-6">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}
        >
          <Icon size={20} strokeWidth={1.5} className="text-foreground" />
        </div>
        <div className="flex-1">
          <h1 className="text-[22px] font-extrabold text-foreground tracking-tight mb-0.5">{product.name}</h1>
          <p className="text-[13px] text-muted-foreground">{product.description}</p>
        </div>
      </div>

      {/* Progress bar (if content exists) */}
      {allBrickIds.length > 0 && (
        <div className="mb-6 p-4 rounded-xl border border-border" style={{ background: 'hsl(var(--secondary)/0.4)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold text-muted-foreground">Progression</span>
            <span className="text-[12px] font-extrabold text-foreground tabular-nums">
              {doneBricks}/{allBrickIds.length} briques
            </span>
          </div>
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full bg-foreground transition-all duration-500"
              style={{ width: `${allBrickIds.length > 0 ? Math.round((doneBricks / allBrickIds.length) * 100) : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Lock overlay if not owned */}
      {!unlocked && (
        <div className="mb-6 p-5 rounded-2xl border border-border text-center"
          style={{ background: 'hsl(var(--secondary)/0.4)' }}>
          <Lock size={24} strokeWidth={1.5} className="text-muted-foreground mx-auto mb-3" />
          <h3 className="text-[15px] font-bold text-foreground mb-1">Contenu non débloqué</h3>
          <p className="text-[12px] text-muted-foreground mb-4">
            Débloque {product.name} pour accéder à l'intégralité du contenu.
          </p>
          <button
            onClick={() => userId && setBuyModal(true)}
            className="rounded-xl px-6 py-2.5 text-[13px] font-bold transition-all duration-150"
            style={{ background: 'hsl(var(--foreground))', color: 'hsl(var(--background))' }}
          >
            Débloquer — {(product.priceCents / 100)}€
          </button>
        </div>
      )}

      {/* Content — blocs + bricks */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: 'hsl(var(--secondary))' }} />
          ))}
        </div>
      ) : blocs.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-[13px] text-muted-foreground">Contenu en cours de préparation…</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {blocs.map((bloc, idx) => {
            const brickIds   = bloc.bricks.map(b => b.id)
            const blocDone   = brickIds.filter(id => isBrickCompleted(id)).length
            const isOpen     = openBloc === bloc.id
            const allDone    = brickIds.length > 0 && blocDone === brickIds.length
            return (
              <div key={bloc.id} className="rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setOpenBloc(isOpen ? null : bloc.id)}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 transition-colors hover:bg-secondary/40"
                  style={{ background: isOpen ? 'hsl(var(--secondary)/0.5)' : 'hsl(var(--background))' }}
                >
                  <span className="text-[10px] font-bold text-muted-foreground/50 w-5 tabular-nums text-center">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[13px] font-semibold text-foreground flex-1 truncate">{bloc.title}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {brickIds.length > 0 && (
                      <span className="text-[10px] font-bold tabular-nums" style={{ color: allDone ? '#22c55e' : 'hsl(var(--muted-foreground))' }}>
                        {blocDone}/{brickIds.length}
                      </span>
                    )}
                    <ChevronDown
                      size={13}
                      strokeWidth={1.5}
                      className="text-muted-foreground transition-transform duration-200"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-border">
                    {bloc.bricks.length === 0 ? (
                      <div className="px-4 py-3">
                        <p className="text-[12px] text-muted-foreground italic">Aucune brique dans ce bloc.</p>
                      </div>
                    ) : (
                      bloc.bricks.map(brick => {
                        const done = isBrickCompleted(brick.id)
                        return (
                          <button
                            key={brick.id}
                            onClick={() => unlocked && navigate(`#/dashboard/produit/${slug}/brick/${brick.id}`)}
                            disabled={!unlocked}
                            className={`flex items-center gap-3 w-full text-left px-4 py-3 border-b border-border/50 last:border-0 transition-colors ${unlocked ? 'hover:bg-secondary/30' : 'opacity-50 cursor-default'}`}
                          >
                            {done
                              ? <CheckCircle size={14} strokeWidth={1.5} style={{ color: '#22c55e', flexShrink: 0 }} />
                              : <Circle size={14} strokeWidth={1.5} className="text-muted-foreground/40 flex-shrink-0" />
                            }
                            <span className={`text-[12px] font-medium flex-1 ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                              {brick.title}
                            </span>
                            {unlocked && <ChevronRight size={12} strokeWidth={1.5} className="text-muted-foreground/40 flex-shrink-0" />}
                          </button>
                        )
                      })
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {buyModal && userId && (
        <PurchaseModal
          productSlug={slug}
          userId={userId}
          access={access}
          onClose={() => setBuyModal(false)}
        />
      )}
    </div>
  )
}
