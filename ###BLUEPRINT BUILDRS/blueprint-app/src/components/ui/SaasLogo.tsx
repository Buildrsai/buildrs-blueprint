// blueprint-app/src/components/ui/SaasLogo.tsx

const SIZE_MAP = { sm: 32, md: 48, lg: 64 }

function hashColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 45%, 55%)`
}

interface SaasLogoProps {
  logoUrl: string | null
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SaasLogo({ logoUrl, name, size = 'md', className = '' }: SaasLogoProps) {
  const px = SIZE_MAP[size]
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        width={px}
        height={px}
        className={`rounded-lg object-contain bg-white ${className}`}
        style={{ width: px, height: px, minWidth: px }}
        onError={e => {
          const img = e.currentTarget
          img.style.display = 'none'
          const fallback = img.nextElementSibling as HTMLElement | null
          if (fallback) fallback.style.display = 'flex'
        }}
      />
    )
  }

  return (
    <div
      className={`rounded-lg flex items-center justify-center font-bold text-white shrink-0 ${className}`}
      style={{
        width: px,
        height: px,
        minWidth: px,
        background: hashColor(name),
        fontSize: px * 0.35,
      }}
    >
      {initials || name[0]?.toUpperCase()}
    </div>
  )
}
