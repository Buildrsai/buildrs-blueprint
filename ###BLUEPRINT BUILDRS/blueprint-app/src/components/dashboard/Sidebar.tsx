import { useState } from 'react'
import {
  Layers, Search, Palette, Building2, Hammer, Rocket, DollarSign,
  Lightbulb, BookOpen, CheckSquare, FolderOpen, Wrench,
  ShieldCheck, TrendingUp, Zap, ChevronRight, Brain,
} from 'lucide-react'
import { BuildrsIcon } from '../ui/icons'
import { CURRICULUM } from '../../data/curriculum'

const MODULE_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  '00': Layers, '01': Search, '02': Palette, '03': Building2,
  '04': Hammer, '05': Rocket, '06': DollarSign, 'claude': Brain,
}

interface Props {
  currentPath: string
  navigate: (hash: string) => void
  globalPercent: number
  moduleProgress: (id: string, total: number) => number
  journalCount: number
  isDark: boolean
  onToggleDark: () => void
}

export function Sidebar({
  currentPath, navigate, globalPercent, moduleProgress, isDark, onToggleDark,
}: Props) {
  const [parcoursOpen, setParcoursOpen] = useState(
    currentPath.includes('/dashboard/module/') || currentPath === '#/dashboard'
  )

  const navItem = (hash: string, label: string, Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>) => {
    const active = currentPath === hash
    return (
      <button
        key={hash}
        onClick={() => navigate(hash)}
        className={`flex items-center gap-2.5 w-full text-left px-3 py-[7px] rounded-lg transition-all duration-150 ${
          active
            ? 'bg-foreground text-background'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
        }`}
      >
        <Icon size={13} strokeWidth={1.5} />
        <span className="text-[12px] font-medium flex-1 tracking-[-0.01em]">{label}</span>
      </button>
    )
  }

  const isAutopilotActive = currentPath === '#/dashboard/autopilot' || currentPath === '#/dashboard'

  return (
    <div className="hidden lg:flex w-[220px] border-r border-border flex-col flex-shrink-0 overflow-y-auto bg-background">

      {/* Logo + theme toggle */}
      <div className="flex items-center justify-between px-4 h-[52px] border-b border-border flex-shrink-0">
        <button
          onClick={() => navigate('#/dashboard/autopilot')}
          className="flex items-center gap-2 hover:opacity-75 transition-opacity"
        >
          <BuildrsIcon color={isDark ? '#fafafa' : '#09090b'} size={18} />
          <span className="font-extrabold text-[14px] text-foreground" style={{ letterSpacing: '-0.04em' }}>
            Buildrs
          </span>
        </button>
        <button
          onClick={onToggleDark}
          aria-label="Toggle dark mode"
          className="relative rounded-full transition-colors flex-shrink-0"
          style={{ width: 30, height: 17, background: isDark ? 'hsl(var(--foreground) / 0.3)' : 'hsl(var(--border))' }}
        >
          <div
            className="absolute top-[1.5px] w-[14px] h-[14px] rounded-full bg-foreground transition-all duration-200 shadow-sm"
            style={{ left: isDark ? 14 : 2 }}
          />
        </button>
      </div>

      {/* Global progress */}
      <div className="px-4 py-3.5 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Progression
          </span>
          <span className="text-[11px] font-extrabold text-foreground tabular-nums" style={{ letterSpacing: '-0.02em' }}>
            {globalPercent}%
          </span>
        </div>
        <div className="h-[3px] rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-foreground transition-all duration-500"
            style={{ width: `${Math.max(globalPercent, 2)}%` }}
          />
        </div>
      </div>

      {/* ── CONSTRUIRE ── */}
      <div className="px-3 pt-4 pb-2">
        <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 px-1 mb-1.5">
          Construire
        </p>
        <div className="flex flex-col gap-0.5">

          {/* Autopilot IA */}
          <button
            onClick={() => navigate('#/dashboard/autopilot')}
            className={`flex items-center gap-2.5 w-full text-left px-3 py-[7px] rounded-lg transition-all duration-150 ${
              isAutopilotActive
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            }`}
          >
            <Zap size={13} strokeWidth={1.5} className="flex-shrink-0" />
            <span className="text-[12px] font-medium flex-1 tracking-[-0.01em]">Autopilot IA</span>
            <span
              className="text-[8px] font-bold px-1.5 py-0.5 rounded"
              style={{
                background: isAutopilotActive ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.15)',
                color: isAutopilotActive ? '#16a34a' : '#22c55e',
                border: '1px solid rgba(34,197,94,0.3)',
              }}
            >
              ACTIF
            </span>
          </button>

          {/* Mon Parcours — collapsible */}
          <button
            onClick={() => setParcoursOpen(o => !o)}
            className="flex items-center gap-2.5 w-full text-left px-3 py-[7px] rounded-lg transition-all duration-150 text-muted-foreground hover:text-foreground hover:bg-secondary/60"
          >
            <BookOpen size={13} strokeWidth={1.5} className="flex-shrink-0" />
            <span className="text-[12px] font-medium flex-1 tracking-[-0.01em]">Mon Parcours</span>
            <ChevronRight
              size={12}
              strokeWidth={1.5}
              className="transition-transform duration-200"
              style={{ transform: parcoursOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
            />
          </button>

          {/* Module sub-items */}
          {parcoursOpen && (
            <div className="flex flex-col gap-0.5 ml-2">
              {CURRICULUM.map(mod => {
                const Icon = MODULE_ICONS[mod.id] ?? Layers
                const active = currentPath.startsWith(`#/dashboard/module/${mod.id}`)
                const pct = moduleProgress(mod.id, mod.lessons.length)
                const done = pct === 100
                const inProgress = pct > 0 && pct < 100

                return (
                  <button
                    key={mod.id}
                    onClick={() => navigate(`#/dashboard/module/${mod.id}`)}
                    className={`flex items-center gap-2 w-full text-left px-2.5 py-[6px] rounded-lg transition-all duration-150 ${
                      active
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                    }`}
                  >
                    <Icon size={11} strokeWidth={1.5} className="flex-shrink-0" />
                    <span className="text-[11px] font-medium flex-1 truncate tracking-[-0.01em]">
                      {mod.title}
                    </span>
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        background: done
                          ? '#22c55e'
                          : inProgress
                            ? 'hsl(var(--foreground) / 0.4)'
                            : 'transparent',
                      }}
                    />
                  </button>
                )
              })}
            </div>
          )}

          {/* Mes Idées */}
          {navItem('#/dashboard/ideas', 'Mes Idées', Lightbulb)}
        </div>
      </div>

      {/* ── OUTILS IA ── */}
      <div className="px-3 pt-3 pb-2">
        <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 px-1 mb-1.5">
          Outils IA
        </p>
        <div className="flex flex-col gap-0.5">
          {navItem('#/dashboard/generator/ideas',    'Idées de SaaS',      Lightbulb)}
          {navItem('#/dashboard/generator/validate', "Validateur d'idée",  ShieldCheck)}
          {navItem('#/dashboard/generator/mrr',      'Calc. MRR & Revente', TrendingUp)}
        </div>
      </div>

      {/* ── RESSOURCES ── */}
      <div className="px-3 pt-3 pb-2">
        <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 px-1 mb-1.5">
          Ressources
        </p>
        <div className="flex flex-col gap-0.5">
          {navItem('#/dashboard/project',   'Mes Projets',   FolderOpen)}
          {navItem('#/dashboard/library',   'Bibliothèque',  BookOpen)}
          {navItem('#/dashboard/checklist', 'Checklist',     CheckSquare)}
          {navItem('#/dashboard/tools',     'Boîte à outils', Wrench)}
        </div>
      </div>

      {/* ── BONUS — Module Claude ── */}
      <div className="px-3 pt-3 pb-2">
        <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] px-1 mb-1.5" style={{ color: '#cc5de8' }}>
          Bonus
        </p>
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => navigate('#/dashboard/module/claude')}
            className={`flex items-center gap-2.5 w-full text-left px-3 py-[7px] rounded-lg transition-all duration-150 ${
              currentPath.startsWith('#/dashboard/module/claude')
                ? 'text-background'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            }`}
            style={currentPath.startsWith('#/dashboard/module/claude') ? { background: '#cc5de8' } : undefined}
          >
            <Brain size={13} strokeWidth={1.5} className="flex-shrink-0" />
            <span className="text-[12px] font-medium flex-1 tracking-[-0.01em]">Claude 360°</span>
            <span
              className="text-[8px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
              style={{ background: 'rgba(204,93,232,0.15)', color: '#cc5de8', border: '1px solid rgba(204,93,232,0.3)' }}
            >
              BONUS
            </span>
          </button>
        </div>
      </div>

      {/* CTA Cohorte */}
      <div className="mt-auto p-3">
        <div className="relative rounded-[14px] overflow-hidden" style={{ padding: 2 }}>
          <div className="absolute" style={{
            inset: -40,
            background: 'conic-gradient(#ff6b6b, #ffd93d, #6bcb77, #4d96ff, #cc5de8, #ff6b6b)',
            animation: 'cohorte-spin 4s linear infinite',
          }} />
          <button
            onClick={() => navigate('#/dashboard/offers')}
            className="relative w-full text-left rounded-xl px-3.5 py-3 transition-all duration-150 hover:opacity-90"
            style={{ background: 'hsl(var(--background))' }}
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-1" style={{ color: '#ff6b6b' }}>
              Envie d'aller plus vite ?
            </p>
            <p className="font-extrabold text-foreground tracking-tight leading-tight" style={{ fontSize: 12, letterSpacing: '-0.02em' }}>
              Accélérer mon projet →
            </p>
            <p className="text-muted-foreground mt-0.5" style={{ fontSize: 10 }}>
              On construit avec toi
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}
