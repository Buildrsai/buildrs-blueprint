import { useEffect, useRef } from 'react'
import { LEVELS, getLevelFromXP, getLevelInfo } from '../../data/levels'
import type { BuildrsLevel } from '../../data/levels'

// ── Types ──────────────────────────────────────────────────────────────────

export type AvatarId =
  | 'scout' | 'dreamer' | 'spark'
  | 'hacker' | 'forger' | 'ninja'
  | 'rocket' | 'phantom' | 'viper'
  | 'crown' | 'phoenix' | 'legend'

export const AVATAR_BY_LEVEL: Record<BuildrsLevel, AvatarId[]> = {
  explorer: ['scout', 'dreamer', 'spark'],
  builder:  ['hacker', 'forger', 'ninja'],
  launcher: ['rocket', 'phantom', 'viper'],
  scaler:   ['crown', 'phoenix', 'legend'],
}

export const AVATAR_LABEL: Record<AvatarId, string> = {
  scout: 'Scout', dreamer: 'Dreamer', spark: 'Spark',
  hacker: 'Hacker', forger: 'Forger', ninja: 'Ninja',
  rocket: 'Rocket', phantom: 'Phantom', viper: 'Viper',
  crown: 'Crown', phoenix: 'Phoenix', legend: 'Legend',
}

const LEVEL_ORDER: BuildrsLevel[] = ['explorer', 'builder', 'launcher', 'scaler']

/** All avatars unlocked up to (and including) the user's current level */
export function getAvailableAvatars(level: BuildrsLevel): AvatarId[] {
  const idx = LEVEL_ORDER.indexOf(level)
  return LEVEL_ORDER.slice(0, idx + 1).flatMap(l => AVATAR_BY_LEVEL[l])
}

/** Deterministic avatar derived from userId × level — no DB column needed */
export function deriveAvatar(userId: string, level: BuildrsLevel): AvatarId {
  const pool = AVATAR_BY_LEVEL[level]
  let hash = 5381
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) + hash) ^ userId.charCodeAt(i)
  }
  return pool[Math.abs(hash) % pool.length]
}

// ── Canvas helpers ─────────────────────────────────────────────────────────

const f = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: string) => {
  ctx.fillStyle = c
  ctx.fillRect(x, y, w, h)
}

const SK = '#f5c99a'  // skin
const DK = '#111827'  // dark pupils

// ── 12 Avatar draw functions — 12×12 canvas ────────────────────────────────

// SCOUT — blue, simple, classic warrior
function drawScout(ctx: CanvasRenderingContext2D) {
  const [B, H, P] = ['#4d96ff', '#1d4ed8', '#1e3a8a']
  f(ctx, 3, 0, 6, 2, H)
  f(ctx, 3, 2, 6, 3, SK)
  f(ctx, 4, 3, 1, 1, DK);  f(ctx, 7, 3, 1, 1, DK)
  f(ctx, 2, 5, 8, 3, B)
  f(ctx, 3, 8, 6, 1, P)
  f(ctx, 3, 9, 2, 3, P);   f(ctx, 7, 9, 2, 3, P)
}

// DREAMER — violet, twin antennae, dreamy purple eyes
function drawDreamer(ctx: CanvasRenderingContext2D) {
  const [B, H, P, A] = ['#7c3aed', '#4c1d95', '#3730a3', '#c4b5fd']
  f(ctx, 4, 1, 1, 1, A);   f(ctx, 7, 1, 1, 1, A)  // antenna stems
  f(ctx, 4, 0, 1, 1, '#e9d5ff'); f(ctx, 7, 0, 1, 1, '#e9d5ff')  // tips
  f(ctx, 3, 1, 6, 1, H)
  f(ctx, 3, 2, 6, 3, SK)
  f(ctx, 4, 3, 1, 1, '#7c3aed'); f(ctx, 7, 3, 1, 1, '#7c3aed')
  f(ctx, 5, 4, 2, 1, A)  // sparkle
  f(ctx, 2, 5, 8, 3, B)
  f(ctx, 3, 8, 6, 1, P);  f(ctx, 3, 9, 2, 3, P);  f(ctx, 7, 9, 2, 3, P)
}

// SPARK — blue body, golden lightning bolt on head
function drawSpark(ctx: CanvasRenderingContext2D) {
  const [B, H, P, G] = ['#3b82f6', '#1e40af', '#1e3a8a', '#fbbf24']
  f(ctx, 5, 0, 2, 1, G)      // lightning tip
  f(ctx, 4, 1, 3, 1, G)      // lightning mid
  f(ctx, 3, 1, 1, 1, H);  f(ctx, 8, 1, 1, 1, H)
  f(ctx, 3, 2, 6, 3, SK)
  f(ctx, 4, 3, 1, 1, DK);  f(ctx, 7, 3, 1, 1, DK)
  f(ctx, 2, 5, 8, 3, B)
  f(ctx, 4, 6, 4, 1, G)      // gold stripe
  f(ctx, 3, 8, 6, 1, P);  f(ctx, 3, 9, 2, 3, P);  f(ctx, 7, 9, 2, 3, P)
}

// HACKER — dark green, glowing green eyes, code symbols
function drawHacker(ctx: CanvasRenderingContext2D) {
  const [B, H, P, G] = ['#166534', '#14532d', '#052e16', '#4ade80']
  f(ctx, 3, 0, 6, 2, H)
  f(ctx, 3, 2, 6, 3, SK)
  f(ctx, 4, 3, 1, 1, G);  f(ctx, 7, 3, 1, 1, G)   // glowing eyes
  f(ctx, 2, 5, 8, 3, B)
  f(ctx, 4, 6, 1, 1, '#86efac');  f(ctx, 7, 6, 1, 1, '#86efac')  // <> code
  f(ctx, 3, 8, 6, 1, P);  f(ctx, 3, 9, 2, 3, P);  f(ctx, 7, 9, 2, 3, P)
}

// FORGER — green body, gray construction helmet, hammer
function drawForger(ctx: CanvasRenderingContext2D) {
  const [B, H, P, T] = ['#16a34a', '#14532d', '#052e16', '#6b7280']
  f(ctx, 2, 0, 8, 2, H)       // helmet
  f(ctx, 9, 0, 2, 1, T);  f(ctx, 10, 0, 1, 2, T)   // hammer
  f(ctx, 3, 2, 6, 3, SK)
  f(ctx, 4, 3, 1, 1, '#15803d');  f(ctx, 7, 3, 1, 1, '#15803d')
  f(ctx, 2, 5, 8, 3, B)
  f(ctx, 3, 8, 6, 1, T)       // tool belt
  f(ctx, 3, 9, 2, 3, P);  f(ctx, 7, 9, 2, 3, P)
}

// NINJA — dark, black mask covering lower face, cyan glowing eyes
function drawNinja(ctx: CanvasRenderingContext2D) {
  const [B, H, P, M, G] = ['#14532d', '#111827', '#052e16', '#111827', '#4ade80']
  f(ctx, 3, 0, 6, 2, H)
  f(ctx, 3, 2, 6, 2, SK)       // forehead only
  f(ctx, 4, 3, 1, 1, G);  f(ctx, 7, 3, 1, 1, G)    // eyes glow through mask
  f(ctx, 3, 3, 1, 1, M);  f(ctx, 8, 3, 1, 1, M)    // mask sides
  f(ctx, 3, 4, 6, 1, M)         // mask lower face
  f(ctx, 2, 5, 8, 3, B)
  f(ctx, 3, 8, 6, 1, P);  f(ctx, 3, 9, 2, 3, P);  f(ctx, 7, 9, 2, 3, P)
}

// ROCKET — purple body, orange+yellow flame hair
function drawRocket(ctx: CanvasRenderingContext2D) {
  const [B, H, P, F, Y] = ['#7c3aed', '#4c1d95', '#3730a3', '#f97316', '#fbbf24']
  f(ctx, 5, 0, 2, 1, Y)        // flame tip yellow
  f(ctx, 4, 1, 4, 1, F)        // flame orange
  f(ctx, 3, 1, 1, 1, H);  f(ctx, 8, 1, 1, 1, H)
  f(ctx, 3, 2, 6, 3, SK)
  f(ctx, 4, 3, 1, 1, DK);  f(ctx, 7, 3, 1, 1, DK)
  f(ctx, 2, 5, 8, 3, B)
  f(ctx, 5, 6, 2, 1, F)        // rocket icon on body
  f(ctx, 3, 8, 6, 1, P);  f(ctx, 3, 9, 2, 3, P);  f(ctx, 7, 9, 2, 3, P)
}

// PHANTOM — purple, scattered aura particles, ghostly eyes
function drawPhantom(ctx: CanvasRenderingContext2D) {
  const [B, H, P, A] = ['#6d28d9', '#4c1d95', '#3730a3', '#c4b5fd']
  // Aura particles
  f(ctx, 1, 0, 1, 1, A);  f(ctx, 10, 0, 1, 1, A)
  f(ctx, 0, 5, 1, 1, A);  f(ctx, 11, 5, 1, 1, A)
  f(ctx, 1, 10, 1, 1, A); f(ctx, 10, 10, 1, 1, A)
  f(ctx, 3, 0, 6, 2, H)
  f(ctx, 3, 2, 6, 3, SK)
  f(ctx, 4, 3, 1, 1, A);  f(ctx, 7, 3, 1, 1, A)   // ghostly eyes
  f(ctx, 2, 5, 8, 3, B)
  f(ctx, 3, 6, 6, 1, A)    // aura stripe on body
  f(ctx, 3, 8, 6, 1, P);  f(ctx, 3, 9, 2, 3, P);  f(ctx, 7, 9, 2, 3, P)
}

// VIPER — purple body, cyan eyes + hair streak + neon stripe
function drawViper(ctx: CanvasRenderingContext2D) {
  const [B, H, P, C] = ['#6d28d9', '#4c1d95', '#3730a3', '#06b6d4']
  f(ctx, 3, 0, 6, 2, H)
  f(ctx, 5, 0, 2, 1, C)     // cyan streak in hair
  f(ctx, 3, 2, 6, 3, SK)
  f(ctx, 4, 3, 1, 1, C);  f(ctx, 7, 3, 1, 1, C)   // cyan eyes
  f(ctx, 2, 5, 8, 3, B)
  f(ctx, 2, 6, 8, 1, C)     // neon stripe
  f(ctx, 3, 8, 6, 1, P);  f(ctx, 3, 9, 2, 3, P);  f(ctx, 7, 9, 2, 3, P)
  f(ctx, 3, 11, 1, 1, C);  f(ctx, 7, 11, 1, 1, C) // neon ankles
}

// CROWN — gold crown with red jewel, brown body
function drawCrown(ctx: CanvasRenderingContext2D) {
  const [B, H, P, G, J] = ['#92400e', '#78350f', '#451a03', '#fbbf24', '#ef4444']
  f(ctx, 3, 1, 6, 1, G)      // crown base
  f(ctx, 3, 0, 1, 1, G);  f(ctx, 5, 0, 2, 1, G);  f(ctx, 8, 0, 1, 1, G)  // teeth
  f(ctx, 5, 0, 2, 1, J)      // red jewel center
  f(ctx, 3, 2, 6, 3, SK)
  f(ctx, 4, 3, 1, 1, '#d97706');  f(ctx, 7, 3, 1, 1, '#d97706')
  f(ctx, 2, 5, 8, 3, B)
  f(ctx, 3, 5, 6, 1, G)      // gold shoulder trim
  f(ctx, 3, 8, 6, 1, P);  f(ctx, 3, 9, 2, 3, P);  f(ctx, 7, 9, 2, 3, P)
}

// PHOENIX — red-orange flaming hair, fire wings, fire eyes
function drawPhoenix(ctx: CanvasRenderingContext2D) {
  const [B, H, P, F, O] = ['#9a3412', '#7c2d12', '#431407', '#ef4444', '#f97316']
  f(ctx, 3, 0, 6, 1, O)
  f(ctx, 5, 0, 2, 1, '#fbbf24')   // yellow center flame
  f(ctx, 3, 0, 1, 1, F);  f(ctx, 8, 0, 1, 1, F)
  f(ctx, 3, 1, 6, 1, F)
  f(ctx, 0, 5, 2, 2, O)            // left wing
  f(ctx, 10, 5, 2, 2, O)           // right wing
  f(ctx, 3, 2, 6, 3, SK)
  f(ctx, 4, 3, 1, 1, F);  f(ctx, 7, 3, 1, 1, F)   // fire eyes
  f(ctx, 2, 5, 8, 3, B)
  f(ctx, 3, 8, 6, 1, P);  f(ctx, 3, 9, 2, 3, P);  f(ctx, 7, 9, 2, 3, P)
}

// LEGEND — gold halo, star diamond, radiant glow corners
function drawLegend(ctx: CanvasRenderingContext2D) {
  const [B, H, P, G, S] = ['#b45309', '#92400e', '#451a03', '#fbbf24', '#ffffff']
  // Corner glow
  f(ctx, 0, 0, 1, 1, G);  f(ctx, 11, 0, 1, 1, G)
  f(ctx, 0, 11, 1, 1, G); f(ctx, 11, 11, 1, 1, G)
  f(ctx, 3, 0, 6, 1, G)     // halo row
  f(ctx, 5, 0, 2, 1, S)     // bright star at center
  f(ctx, 3, 1, 6, 1, G)     // halo inner
  f(ctx, 3, 2, 6, 3, SK)
  f(ctx, 5, 2, 2, 1, S)     // diamond sparkle on forehead
  f(ctx, 4, 3, 1, 1, '#d97706');  f(ctx, 7, 3, 1, 1, '#d97706')
  f(ctx, 2, 5, 8, 3, B)
  f(ctx, 3, 5, 6, 1, G)     // gold trim
  f(ctx, 5, 6, 2, 1, S)     // star on chest
  f(ctx, 3, 8, 6, 1, P);  f(ctx, 3, 9, 2, 3, P);  f(ctx, 7, 9, 2, 3, P)
  f(ctx, 4, 11, 1, 1, G);  f(ctx, 8, 11, 1, 1, G) // gold boots
}

// ── Draw map ───────────────────────────────────────────────────────────────

const DRAW_FNS: Record<AvatarId, (ctx: CanvasRenderingContext2D) => void> = {
  scout: drawScout, dreamer: drawDreamer, spark: drawSpark,
  hacker: drawHacker, forger: drawForger, ninja: drawNinja,
  rocket: drawRocket, phantom: drawPhantom, viper: drawViper,
  crown: drawCrown, phoenix: drawPhoenix, legend: drawLegend,
}

// ── Component ──────────────────────────────────────────────────────────────

interface PixelAvatarProps {
  id: AvatarId
  size?: number
  className?: string
}

export function PixelAvatar({ id, size = 48, className }: PixelAvatarProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, 12, 12)
    ctx.imageSmoothingEnabled = false
    DRAW_FNS[id]?.(ctx)
  }, [id])

  return (
    <canvas
      ref={ref}
      width={12}
      height={12}
      style={{ width: size, height: size, imageRendering: 'pixelated' }}
      className={className}
    />
  )
}

// ── Avatar Picker (for SettingsPage) ───────────────────────────────────────

interface AvatarPickerProps {
  userXp: number
  selectedId: AvatarId | null
  onSelect: (id: AvatarId) => void
}

export function AvatarPicker({ userXp, selectedId, onSelect }: AvatarPickerProps) {
  const userLevel = getLevelFromXP(userXp)
  const userLevelIdx = LEVEL_ORDER.indexOf(userLevel)

  return (
    <div className="flex flex-col gap-5">
      {LEVELS.map((levelDef, idx) => {
        const avatars = AVATAR_BY_LEVEL[levelDef.key]
        const unlocked = idx <= userLevelIdx
        return (
          <div key={levelDef.key}>
            <div className="flex items-center gap-2 mb-2.5">
              <span
                className="text-[9px] font-bold uppercase tracking-[0.09em]"
                style={{ color: unlocked ? levelDef.color : 'hsl(var(--muted-foreground) / 0.4)' }}
              >
                {levelDef.label}
              </span>
              <span className="text-[9px] text-muted-foreground/40">{levelDef.minXP} XP</span>
              {!unlocked && (
                <span className="text-[8px] text-muted-foreground/40 ml-auto">Verrouillé</span>
              )}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {avatars.map(avatarId => {
                const active = selectedId === avatarId
                return (
                  <button
                    key={avatarId}
                    onClick={() => unlocked && onSelect(avatarId)}
                    disabled={!unlocked}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-150"
                    style={{
                      opacity: unlocked ? 1 : 0.25,
                      cursor: unlocked ? 'pointer' : 'not-allowed',
                      outline: active ? `2px solid ${getLevelInfo(levelDef.key).color}` : 'none',
                      outlineOffset: '2px',
                      background: active ? `${getLevelInfo(levelDef.key).color}12` : 'transparent',
                    }}
                  >
                    <PixelAvatar id={avatarId} size={40} />
                    <span
                      className="text-[9px] font-medium"
                      style={{ color: active ? levelDef.color : 'hsl(var(--muted-foreground))' }}
                    >
                      {AVATAR_LABEL[avatarId]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
