// blueprint-app/src/components/ui/SaasLogo.tsx
import { useState } from 'react'

const SIZE_MAP = { sm: 40, md: 48, lg: 64 }

function hashColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 45%, 55%)`
}

interface SaasLogoProps {
  logoUrl: string | null
  name: string
  domain?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

type FallbackLevel = 'logo' | 'favicon' | 'initials'

export function SaasLogo({ logoUrl, name, domain, size = 'md', className = '' }: SaasLogoProps) {
  const px = SIZE_MAP[size]
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('')

  const faviconUrl = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
    : null

  const initialLevel: FallbackLevel = logoUrl ? 'logo' : (faviconUrl ? 'favicon' : 'initials')
  const [level, setLevel] = useState<FallbackLevel>(initialLevel)

  if (level === 'logo' && logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        width={px}
        height={px}
        className={`rounded-lg object-contain bg-white ${className}`}
        style={{ width: px, height: px, minWidth: px }}
        onError={() => {
          if (faviconUrl) setLevel('favicon')
          else setLevel('initials')
        }}
      />
    )
  }

  if (level === 'favicon' && faviconUrl) {
    return (
      <img
        src={faviconUrl}
        alt={name}
        width={px}
        height={px}
        className={`rounded-lg object-contain bg-white ${className}`}
        style={{ width: px, height: px, minWidth: px }}
        onError={() => setLevel('initials')}
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
