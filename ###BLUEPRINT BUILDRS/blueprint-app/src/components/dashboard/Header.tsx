import { useState, useRef, useEffect } from 'react'
import { LogOut, Settings } from 'lucide-react'

interface Props {
  title: string
  userEmail: string | undefined
  userFirstName?: string | undefined
  userAvatarUrl?: string | undefined
  onSignOut: () => void
  navigate: (hash: string) => void
}

export function Header({ title, userEmail, userFirstName, userAvatarUrl, onSignOut, navigate }: Props) {
  const displayName = userFirstName || userEmail?.split('@')[0] || ''
  const initial = displayName?.[0]?.toUpperCase() ?? 'U'
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="h-[52px] border-b border-border flex items-center justify-between px-6 flex-shrink-0 bg-background">
      <span
        className="text-[13px] font-semibold text-foreground"
        style={{ letterSpacing: '-0.01em' }}
      >
        {title}
      </span>

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2.5 hover:opacity-70 transition-opacity"
        >
          <span className="text-[12px] text-muted-foreground hidden sm:block tracking-[-0.01em]">
            {displayName}
          </span>
          <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center overflow-hidden">
            {userAvatarUrl
              ? <img src={userAvatarUrl} alt="" className="w-full h-full object-cover" />
              : <span className="text-[11px] font-bold text-background">{initial}</span>
            }
          </div>
        </button>

        {open && (
          <div
            className="absolute right-0 top-10 w-48 rounded-xl border border-border shadow-lg z-50 overflow-hidden bg-background"
          >
            <div className="px-4 py-3 border-b border-border">
              {userFirstName && <p className="text-[12px] font-semibold text-foreground">{userFirstName}</p>}
              <p className="text-[11px] text-muted-foreground truncate">{userEmail}</p>
            </div>
            <button
              onClick={() => { setOpen(false); navigate('#/dashboard/settings') }}
              className="flex items-center gap-2.5 w-full px-4 py-3 text-[12px] font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <Settings size={13} strokeWidth={1.5} />
              Paramètres
            </button>
            <button
              onClick={() => { setOpen(false); onSignOut() }}
              className="flex items-center gap-2.5 w-full px-4 py-3 text-[12px] font-medium text-foreground hover:bg-secondary transition-colors border-t border-border"
            >
              <LogOut size={13} strokeWidth={1.5} />
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
