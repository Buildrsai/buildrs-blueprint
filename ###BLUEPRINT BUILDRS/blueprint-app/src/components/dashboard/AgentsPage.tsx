import { useState, useRef, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Lock, ArrowRight, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { AGENTS_CONFIG, type AgentSlug } from '../../lib/agents/config'

const ROW1: AgentSlug[] = ['jarvis', 'planner', 'designer', 'db-architect']
const ROW2: AgentSlug[] = ['builder', 'connector', 'launcher']

interface Props {
  navigate: (hash: string) => void
  hasPack: boolean
}

export function AgentsPage({ navigate, hasPack }: Props) {
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const mountRef    = useRef<HTMLDivElement>(null)
  const checkoutRef = useRef<{ destroy: () => void } | null>(null)

  useEffect(() => () => { checkoutRef.current?.destroy() }, [])

  const handleUnlock = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fnError } = await supabase.functions.invoke('create-agents-checkout', {
        body: { from_dashboard: true },
      })
      if (fnError || !data?.clientSecret) throw new Error(data?.error ?? fnError?.message ?? 'Erreur Stripe')
      const stripe = await loadStripe(data.publishableKey)
      if (!stripe) throw new Error('Stripe indisponible')
      checkoutRef.current?.destroy()
      const checkout = await stripe.initEmbeddedCheckout({ clientSecret: data.clientSecret })
      setShowCheckout(true)
      setTimeout(() => {
        if (mountRef.current) {
          checkout.mount(mountRef.current)
          checkoutRef.current = checkout
        }
      }, 50)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleCloseCheckout = () => {
    checkoutRef.current?.destroy()
    checkoutRef.current = null
    setShowCheckout(false)
  }

  const handleCardClick = (slug: AgentSlug) => {
    if (!hasPack) return
    navigate(`#/dashboard/agents/${slug}`)
  }

  if (showCheckout) {
    return (
      <div className="max-w-[600px] mx-auto px-5 py-10">
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <button
              onClick={handleCloseCheckout}
              className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} strokeWidth={1.5} />
              Annuler
            </button>
            <span className="text-[13px] font-semibold">Pack Agents IA — 197€</span>
            <div className="w-16" />
          </div>
          <div ref={mountRef} />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-10">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
          Pack Agents IA
        </p>
        <h1
          className="text-3xl font-extrabold text-foreground tracking-tight mb-3"
          style={{ letterSpacing: '-0.04em' }}
        >
          Tes 7 agents spécialisés.
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
          Chaque agent couvre une phase du build. Tu leur donnes un input, ils te livrent un output concret — prêt à implémenter dans Claude Code.
        </p>
      </div>

      {/* Unlock CTA */}
      {!hasPack && (
        <div className="mb-8 rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Lock size={13} strokeWidth={1.5} className="text-muted-foreground" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Accès verrouillé
              </span>
            </div>
            <p className="text-sm font-semibold text-foreground">Débloquer les 7 agents pour 197€</p>
            <p className="text-xs text-muted-foreground mt-0.5">Accès à vie · Tarif lancement</p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              onClick={handleUnlock}
              disabled={loading}
              className="bg-foreground text-background rounded-xl px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center gap-2"
            >
              {loading ? 'Chargement...' : (
                <>Débloquer — 197€ <ArrowRight size={14} strokeWidth={1.5} /></>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Row 1 — 4 agents */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {ROW1.map((slug) => (
          <AgentCard key={slug} slug={slug} hasPack={hasPack} onClick={handleCardClick} />
        ))}
      </div>

      {/* Row 2 — 3 agents centered */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:w-3/4 lg:mx-auto">
        {ROW2.map((slug) => (
          <AgentCard key={slug} slug={slug} hasPack={hasPack} onClick={handleCardClick} />
        ))}
      </div>
    </div>
  )
}

function AgentCard({
  slug,
  hasPack,
  onClick,
}: {
  slug: AgentSlug
  hasPack: boolean
  onClick: (slug: AgentSlug) => void
}) {
  const cfg = AGENTS_CONFIG[slug]

  return (
    <div
      onClick={() => onClick(slug)}
      className={[
        'group relative rounded-2xl border border-border bg-card p-5 flex flex-col gap-3 transition-all duration-150',
        hasPack
          ? 'cursor-pointer hover:border-foreground/20'
          : 'opacity-60 cursor-not-allowed select-none',
      ].join(' ')}
    >
      {/* Logo */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bgAccentColor}`}>
        <img
          src={cfg.logoPath}
          alt={cfg.name}
          width={22}
          height={22}
          className="object-contain"
        />
      </div>

      {/* Phase */}
      <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        {cfg.phase}
      </span>

      {/* Name + role */}
      <div>
        <p className="text-base font-bold text-foreground tracking-tight">{cfg.name}</p>
        <p className="text-xs text-muted-foreground font-medium">{cfg.role}</p>
      </div>

      {/* Promise */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
        {cfg.promiseShort}
      </p>

      {/* Footer icon */}
      <div className="mt-auto self-end">
        {hasPack ? (
          <ArrowRight
            size={14}
            strokeWidth={1.5}
            className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all"
          />
        ) : (
          <Lock size={12} strokeWidth={1.5} className="text-muted-foreground" />
        )}
      </div>
    </div>
  )
}
