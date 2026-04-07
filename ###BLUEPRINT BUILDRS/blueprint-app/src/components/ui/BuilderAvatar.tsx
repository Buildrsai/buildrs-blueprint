// BuilderAvatar — pixel art avatar based on builder level
// Try to load /avatars/avatar-{level}.png, fallback to inline SVG

export type BuilderLevel = 'explorer' | 'builder' | 'launcher' | 'scaler'

interface AvatarConfig {
  src: string
  name: string
  color: string
  bgColor: string
}

export const AVATAR_CONFIGS: Record<BuilderLevel, AvatarConfig> = {
  explorer: {
    src: '/avatars/avatar-scout.png',
    name: 'Scout',
    color: '#60a5fa',
    bgColor: 'rgba(96,165,250,0.15)',
  },
  builder: {
    src: '/avatars/avatar-forger.png',
    name: 'Forger',
    color: '#4ade80',
    bgColor: 'rgba(74,222,128,0.15)',
  },
  launcher: {
    src: '/avatars/avatar-rocket.png',
    name: 'Rocket',
    color: '#a78bfa',
    bgColor: 'rgba(167,139,250,0.15)',
  },
  scaler: {
    src: '/avatars/avatar-legend.png',
    name: 'Legend',
    color: '#fbbf24',
    bgColor: 'rgba(251,191,36,0.15)',
  },
}

export function getAvatarConfig(level: string): AvatarConfig {
  return AVATAR_CONFIGS[level as BuilderLevel] ?? AVATAR_CONFIGS.explorer
}

// ── Fallback SVG pixel art (used when PNG not found) ──────────────────────────

function ScoutSVG({ color }: { color: string }) {
  const c = color
  const d = '#0d1117'
  // 8x8 grid, cell = 4px → 32x32
  const pixels: [number, number, string][] = [
    // Hat
    [2,0,c],[3,0,c],[4,0,c],[5,0,c],
    [1,1,c],[2,1,c],[3,1,c],[4,1,c],[5,1,c],[6,1,c],
    // Face
    [1,2,c],[2,2,c],[3,2,c],[4,2,c],[5,2,c],[6,2,c],
    [1,3,c],[2,3,d],[3,3,c],[4,3,c],[5,3,d],[6,3,c],
    [1,4,c],[2,4,c],[3,4,c],[4,4,c],[5,4,c],[6,4,c],
    [2,5,c],[3,5,d],[4,5,d],[5,5,c],
    // Body
    [1,6,c],[2,6,c],[3,6,c],[4,6,c],[5,6,c],[6,6,c],
    [0,7,c],[1,7,c],[3,7,c],[4,7,c],[6,7,c],[7,7,c],
  ]
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" shapeRendering="crispEdges">
      {pixels.map(([x, y, fill], i) => (
        <rect key={i} x={x * 4} y={y * 4} width={4} height={4} fill={fill} />
      ))}
    </svg>
  )
}

function ForgerSVG({ color }: { color: string }) {
  const c = color
  const d = '#0d1117'
  const a = '#fbbf24'
  const pixels: [number, number, string][] = [
    // Hammer head
    [5,0,a],[6,0,a],[7,0,a],
    [5,1,a],[6,1,a],[7,1,a],
    // Handle
    [6,2,a],[6,3,a],
    // Body/helmet
    [1,1,c],[2,1,c],[3,1,c],[4,1,c],
    [1,2,c],[2,2,c],[3,2,c],[4,2,c],
    [0,3,c],[1,3,c],[2,3,d],[3,3,d],[4,3,c],[5,3,c],
    [0,4,c],[1,4,c],[2,4,c],[3,4,c],[4,4,c],[5,4,c],
    [1,5,c],[2,5,d],[3,5,d],[4,5,c],
    // Body
    [0,6,c],[1,6,c],[2,6,c],[3,6,c],[4,6,c],[5,6,c],
    [0,7,c],[1,7,c],[4,7,c],[5,7,c],
  ]
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" shapeRendering="crispEdges">
      {pixels.map(([x, y, fill], i) => (
        <rect key={i} x={x * 4} y={y * 4} width={4} height={4} fill={fill} />
      ))}
    </svg>
  )
}

function RocketSVG({ color }: { color: string }) {
  const c = color
  const d = '#0d1117'
  const f = '#ef4444'
  const pixels: [number, number, string][] = [
    // Nose
    [3,0,c],[4,0,c],
    [2,1,c],[3,1,c],[4,1,c],[5,1,c],
    // Body
    [1,2,c],[2,2,c],[3,2,d],[4,2,d],[5,2,c],[6,2,c],
    [1,3,c],[2,3,c],[3,3,d],[4,3,d],[5,3,c],[6,3,c],
    [1,4,c],[2,4,c],[3,4,c],[4,4,c],[5,4,c],[6,4,c],
    // Wings
    [0,5,c],[1,5,c],[2,5,c],[3,5,c],[4,5,c],[5,5,c],[6,5,c],[7,5,c],
    // Flame
    [2,6,c],[3,6,f],[4,6,f],[5,6,c],
    [3,7,f],[4,7,f],
  ]
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" shapeRendering="crispEdges">
      {pixels.map(([x, y, fill], i) => (
        <rect key={i} x={x * 4} y={y * 4} width={4} height={4} fill={fill} />
      ))}
    </svg>
  )
}

function LegendSVG({ color }: { color: string }) {
  const c = color
  const d = '#0d1117'
  const w = '#ffffff'
  const pixels: [number, number, string][] = [
    // Crown points
    [0,0,c],[3,0,c],[7,0,c],
    [0,1,c],[1,1,c],[3,1,c],[4,1,c],[6,1,c],[7,1,c],
    [0,2,c],[1,2,c],[2,2,c],[3,2,c],[4,2,c],[5,2,c],[6,2,c],[7,2,c],
    // Crown base
    [0,3,c],[1,3,w],[2,3,c],[3,3,w],[4,3,c],[5,3,w],[6,3,c],[7,3,c],
    [0,4,c],[1,4,c],[2,4,c],[3,4,c],[4,4,c],[5,4,c],[6,4,c],[7,4,c],
    // Face
    [1,5,c],[2,5,c],[3,5,d],[4,5,d],[5,5,c],[6,5,c],
    [1,6,c],[2,6,c],[3,6,c],[4,6,c],[5,6,c],[6,6,c],
    [2,7,c],[3,7,d],[4,7,d],[5,7,c],
  ]
  return (
    <svg viewBox="0 0 32 32" width="100%" height="100%" shapeRendering="crispEdges">
      {pixels.map(([x, y, fill], i) => (
        <rect key={i} x={x * 4} y={y * 4} width={4} height={4} fill={fill} />
      ))}
    </svg>
  )
}

const FALLBACK_SVGS: Record<BuilderLevel, React.ComponentType<{ color: string }>> = {
  explorer: ScoutSVG,
  builder: ForgerSVG,
  launcher: RocketSVG,
  scaler: LegendSVG,
}

// ── BuilderAvatar component ────────────────────────────────────────────────────

interface AvatarProps {
  level?: string
  size?: number
  showBorder?: boolean
}

export function BuilderAvatar({ level = 'explorer', size = 40, showBorder = true }: AvatarProps) {
  const cfg = getAvatarConfig(level)
  const FallbackSVG = FALLBACK_SVGS[level as BuilderLevel] ?? ScoutSVG
  const imgSize = Math.round(size * 0.72)

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        overflow: 'hidden',
        background: cfg.bgColor,
        border: showBorder ? `2px solid ${cfg.color}` : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={cfg.src}
        alt={cfg.name}
        width={imgSize}
        height={imgSize}
        style={{ imageRendering: 'pixelated', display: 'block' }}
        onError={e => {
          // Hide broken img, show SVG fallback via sibling
          ;(e.currentTarget as HTMLImageElement).style.display = 'none'
          const sib = e.currentTarget.nextElementSibling as HTMLElement | null
          if (sib) sib.style.display = 'block'
        }}
      />
      <div style={{ width: imgSize, height: imgSize, display: 'none' }}>
        <FallbackSVG color={cfg.color} />
      </div>
    </div>
  )
}
