import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface Props {
  onClose: () => void
  children: ReactNode
  maxWidth?: number
}

export function Modal({ onClose, children, maxWidth = 480 }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full rounded-2xl border border-border bg-background shadow-2xl overflow-y-auto"
        style={{ maxWidth, maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={18} strokeWidth={1.5} />
        </button>
        {children}
      </div>
    </div>
  )
}
