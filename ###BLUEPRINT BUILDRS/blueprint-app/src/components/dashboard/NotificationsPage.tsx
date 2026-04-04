import { Bell } from 'lucide-react'
import { useNotifications } from '../../hooks/useNotifications'

interface Props {
  userId: string | undefined
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

export function NotificationsPage({ userId, navigate }: Props) {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications(userId)

  const handleClick = (id: string, link?: string | null) => {
    markRead(id)
    if (link) navigate(link)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight" style={{ letterSpacing: '-0.03em' }}>
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead()}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Tout marquer lu
          </button>
        )}
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <Bell size={32} strokeWidth={1} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">Aucune notification</p>
          <p className="text-xs text-muted-foreground">Tu es a jour !</p>
        </div>
      ) : (
        <div className="flex flex-col gap-0 border border-border rounded-xl overflow-hidden">
          {notifications.map((notif, i) => (
            <button
              key={notif.id}
              onClick={() => handleClick(notif.id, notif.link)}
              className={`flex items-start gap-3 w-full text-left px-4 py-4 transition-colors hover:bg-secondary/40 ${
                !notif.is_read ? 'bg-secondary/20' : ''
              } ${i > 0 ? 'border-t border-border/50' : ''}`}
            >
              {/* Unread dot */}
              <div className="mt-1.5 flex-shrink-0 w-2">
                {!notif.is_read && (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#4d96ff' }} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{notif.title}</p>
                  <span className="text-[10px] text-muted-foreground/50 flex-shrink-0 mt-0.5">{timeAgo(notif.created_at)}</span>
                </div>
                {notif.message && (
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.message}</p>
                )}
                {notif.link && (
                  <p className="text-[10px] text-muted-foreground/50 mt-1">Voir →</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
