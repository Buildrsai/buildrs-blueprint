import { useState, useRef, useEffect } from 'react'
import { LogOut, Settings, Bell } from 'lucide-react'
import { useNotifications } from '../../hooks/useNotifications'
import { UserAvatarWithFallback } from '../ui/UserAvatar'

interface Props {
  title: string
  userEmail: string | undefined
  userFirstName?: string | undefined
  userAvatarUrl?: string | undefined
  userLevel?: string
  userId?: string
  onSignOut: () => void
  navigate: (hash: string) => void
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'maintenant'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}j`
}

export function Header({ title, userEmail, userFirstName, userAvatarUrl, userLevel: _userLevel, userId, onSignOut, navigate }: Props) {
  const displayName  = userFirstName || userEmail?.split('@')[0] || ''
  const [userOpen, setUserOpen]   = useState(false)
  const [bellOpen, setBellOpen]   = useState(false)
  const userRef = useRef<HTMLDivElement>(null)
  const bellRef = useRef<HTMLDivElement>(null)

  const { notifications, unreadCount, markRead, markAllRead } = useNotifications(userId)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false)
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleBellOpen = () => {
    setBellOpen(o => !o)
    setUserOpen(false)
  }

  const handleNotifClick = (id: string, link?: string) => {
    markRead(id)
    setBellOpen(false)
    if (link) navigate(link)
  }

  return (
    <div className="h-[52px] border-b border-border flex items-center justify-between px-6 flex-shrink-0 bg-background">
      <span className="text-[13px] font-semibold text-foreground" style={{ letterSpacing: '-0.01em' }}>
        {title}
      </span>

      <div className="flex items-center gap-3">

        {/* ── Bell ── */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={handleBellOpen}
            className="relative p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          >
            <Bell size={15} strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] rounded-full flex items-center justify-center text-[8px] font-bold text-background"
                style={{ background: '#ef4444', padding: '0 3px' }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 top-10 w-80 rounded-xl border border-border shadow-xl z-50 bg-background overflow-hidden">
              {/* Bell header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <p className="text-[12px] font-bold text-foreground">Notifications</p>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllRead()}
                    className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Tout marquer lu
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <Bell size={20} strokeWidth={1} className="text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-[12px] text-muted-foreground">Aucune notification</p>
                  </div>
                ) : (
                  notifications.slice(0, 15).map(notif => (
                    <button
                      key={notif.id}
                      onClick={() => handleNotifClick(notif.id, notif.link ?? undefined)}
                      className={`flex items-start gap-3 w-full text-left px-4 py-3 border-b border-border/50 transition-colors hover:bg-secondary/40 ${!notif.is_read ? 'bg-secondary/20' : ''}`}
                    >
                      {/* Unread dot */}
                      <div className="mt-1.5 flex-shrink-0">
                        {!notif.is_read
                          ? <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#4d96ff' }} />
                          : <div className="w-1.5 h-1.5 rounded-full bg-transparent" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-foreground truncate">{notif.title}</p>
                        {notif.message && (
                          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                        )}
                        <p className="text-[10px] text-muted-foreground/50 mt-1">{timeAgo(notif.created_at)}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="px-4 py-2.5 border-t border-border">
                  <button
                    onClick={() => { setBellOpen(false); navigate('#/dashboard/notifications') }}
                    className="text-[11px] text-muted-foreground hover:text-foreground transition-colors w-full text-center"
                  >
                    Voir toutes les notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── User menu ── */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setUserOpen(o => !o); setBellOpen(false) }}
            className="flex items-center gap-2.5 hover:opacity-70 transition-opacity"
          >
            <span className="text-[12px] text-muted-foreground hidden sm:block tracking-[-0.01em]">
              {displayName}
            </span>
            <UserAvatarWithFallback avatarUrl={userAvatarUrl} firstName={userFirstName} email={userEmail} size={28} />
          </button>

          {userOpen && (
            <div className="absolute right-0 top-10 w-48 rounded-xl border border-border shadow-lg z-50 overflow-hidden bg-background">
              <div className="px-4 py-3 border-b border-border">
                {userFirstName && <p className="text-[12px] font-semibold text-foreground">{userFirstName}</p>}
                <p className="text-[11px] text-muted-foreground truncate">{userEmail}</p>
              </div>
              <button
                onClick={() => { setUserOpen(false); navigate('#/dashboard/settings') }}
                className="flex items-center gap-2.5 w-full px-4 py-3 text-[12px] font-medium text-foreground hover:bg-secondary transition-colors"
              >
                <Settings size={13} strokeWidth={1.5} />
                Parametres
              </button>
              <button
                onClick={() => { setUserOpen(false); onSignOut() }}
                className="flex items-center gap-2.5 w-full px-4 py-3 text-[12px] font-medium text-foreground hover:bg-secondary transition-colors border-t border-border"
              >
                <LogOut size={13} strokeWidth={1.5} />
                Se deconnecter
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
