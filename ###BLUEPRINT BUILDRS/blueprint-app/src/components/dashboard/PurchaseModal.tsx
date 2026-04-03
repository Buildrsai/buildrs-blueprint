import { useState, useEffect } from 'react'
import { Lock } from 'lucide-react'
import { Modal } from '../ui/Modal'

const V3_UNLOCK = new Date('2026-04-07T00:00:00+02:00').getTime()

function computeCountdown(): string {
  const diff = V3_UNLOCK - Date.now()
  if (diff <= 0) return 'Bientôt disponible'
  const days  = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const mins  = Math.floor((diff % 3_600_000) / 60_000)
  const secs  = Math.floor((diff % 60_000) / 1_000)
  if (days > 0) return `${days}j ${hours}h ${String(mins).padStart(2,'0')}min`
  if (hours > 0) return `${hours}h ${String(mins).padStart(2,'0')}min ${String(secs).padStart(2,'0')}s`
  return `${mins}min ${String(secs).padStart(2,'0')}s`
}

interface Props {
  productSlug: string
  userId: string
  access: unknown
  onClose: () => void
}

export function PurchaseModal({ onClose }: Props) {
  const [countdown, setCountdown] = useState(computeCountdown)

  useEffect(() => {
    const id = setInterval(() => setCountdown(computeCountdown()), 1_000)
    return () => clearInterval(id)
  }, [])

  return (
    <Modal onClose={onClose} maxWidth={420}>
      <div className="p-8 flex flex-col items-center text-center">

        {/* Lock icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}
        >
          <Lock size={22} strokeWidth={1.5} style={{ color: '#8b5cf6' }} />
        </div>

        {/* Label */}
        <p className="text-[9.5px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#8b5cf6' }}>
          Disponible avec la V3
        </p>

        <h2 className="text-[20px] font-extrabold text-foreground tracking-tight mb-2" style={{ letterSpacing: '-0.03em' }}>
          Ouverture le 7 avril
        </h2>

        <p className="text-[13px] text-muted-foreground leading-relaxed mb-7 max-w-[300px]">
          Cette fonctionnalité sera débloquée avec la mise à jour V3 du dashboard Buildrs.
        </p>

        {/* Countdown */}
        <div
          className="w-full rounded-xl px-5 py-4 mb-6"
          style={{ background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}
        >
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-1">
            Ouverture dans
          </p>
          <p className="text-[22px] font-extrabold text-foreground tabular-nums" style={{ letterSpacing: '-0.03em' }}>
            {countdown}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-xl py-3 text-[13px] font-semibold border border-border hover:border-foreground/20 transition-colors"
          style={{ background: 'transparent', color: 'hsl(var(--foreground))' }}
        >
          Fermer
        </button>
      </div>
    </Modal>
  )
}
