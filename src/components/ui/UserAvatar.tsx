// UserAvatar — photo utilisateur ou bulle initiale

interface Props {
  avatarUrl?: string | null
  firstName?: string | null
  email?: string | null
  size?: number
}

const BUBBLE_COLORS = [
  '#4d96ff', '#8b5cf6', '#22c55e', '#f59e0b',
  '#ec4899', '#06b6d4', '#f97316', '#a78bfa',
]

function bubbleColor(str?: string | null): string {
  if (!str) return BUBBLE_COLORS[0]
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return BUBBLE_COLORS[Math.abs(hash) % BUBBLE_COLORS.length]
}

function initials(firstName?: string | null, email?: string | null): string {
  if (firstName) return firstName.slice(0, 1).toUpperCase()
  if (email)     return email.slice(0, 1).toUpperCase()
  return '?'
}

export function UserAvatar({ avatarUrl, firstName, email, size = 32 }: Props) {
  const color = bubbleColor(firstName || email)

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={firstName || 'Avatar'}
        style={{
          width: size, height: size, borderRadius: '50%',
          objectFit: 'cover', flexShrink: 0, display: 'block',
        }}
        onError={e => {
          // fallback to initials on broken image
          const el = e.currentTarget
          el.style.display = 'none'
          const sib = el.nextElementSibling as HTMLElement | null
          if (sib) sib.style.display = 'flex'
        }}
      />
    )
  }

  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        background: `${color}22`, border: `1.5px solid ${color}50`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: Math.round(size * 0.4), fontWeight: 700,
        color, letterSpacing: '-0.01em', userSelect: 'none',
      }}
    >
      {initials(firstName, email)}
    </div>
  )
}

// ── Wrapper with fallback bubble (used after broken img) ──────────────────────
export function UserAvatarWithFallback({ avatarUrl, firstName, email, size = 32 }: Props) {
  const color = bubbleColor(firstName || email)
  const ini   = initials(firstName, email)

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt={firstName || 'Avatar'}
          style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
          onError={e => {
            const el = e.currentTarget
            el.style.display = 'none'
            const sib = el.nextElementSibling as HTMLElement | null
            if (sib) sib.style.display = 'flex'
          }}
        />
      )}
      <div
        style={{
          width: size, height: size, borderRadius: '50%',
          background: `${color}22`, border: `1.5px solid ${color}50`,
          display: avatarUrl ? 'none' : 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: Math.round(size * 0.4), fontWeight: 700,
          color, letterSpacing: '-0.01em', userSelect: 'none',
        }}
      >
        {ini}
      </div>
    </div>
  )
}
