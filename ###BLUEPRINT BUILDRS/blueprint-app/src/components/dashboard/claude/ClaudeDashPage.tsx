import { useState } from 'react'
import { ArrowLeft, Terminal, BookOpen, ChevronRight, Zap, Check, Lock } from 'lucide-react'
import { ClaudeIcon } from '../../ui/icons'
import { CLAUDE_CURRICULUM, FRAMEWORK_STEPS } from '../../../data/claude-curriculum'

interface Props {
  navigate: (hash: string) => void
  userId: string
  markComplete: (moduleId: string, lessonId: string) => void
  isCompleted: (moduleId: string, lessonId: string) => boolean
  moduleProgress: (id: string, total: number) => number
  hasClaudeCodeOb: boolean
  hasClaudeCoworkOb: boolean
}

export function ClaudeDashPage({
  navigate,
  moduleProgress,
  hasClaudeCodeOb,
  hasClaudeCoworkOb,
}: Props) {
  const [view, setView] = useState<'parcours' | 'console'>('parcours')

  // Global progress across all Claude modules
  const totalLessons = CLAUDE_CURRICULUM.reduce((acc, m) => acc + m.lessons.length, 0)
  const completedLessons = CLAUDE_CURRICULUM.reduce((acc, m) => {
    const pct = moduleProgress(m.id, m.lessons.length)
    return acc + Math.round((pct / 100) * m.lessons.length)
  }, 0)
  const globalPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return (
    <div className="min-h-full bg-background">

      {/* ── Sub-header ── */}
      <div className="sticky top-0 z-20 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 h-12">

          {/* Left: back to Blueprint */}
          <button
            onClick={() => navigate('#/dashboard')}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs font-medium"
          >
            <ArrowLeft size={13} strokeWidth={1.5} />
            Blueprint
          </button>

          {/* Center: title */}
          <div className="flex items-center gap-1.5">
            <ClaudeIcon size={14} />
            <span className="text-xs font-bold tracking-[-0.02em] text-foreground">Claude 360° by Buildrs</span>
          </div>

          {/* Right: Jarvis shortcut */}
          <button
            onClick={() => navigate('#/dashboard/autopilot')}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs font-medium"
          >
            <Zap size={13} strokeWidth={1.5} />
            Jarvis
          </button>
        </div>

        {/* Toggle + progress bar */}
        <div className="flex items-center justify-between px-4 py-2.5 gap-4">
          {/* Toggle Parcours / Console */}
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
            <button
              onClick={() => setView('parcours')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                view === 'parcours'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen size={11} strokeWidth={1.5} />
              Parcours
            </button>
            <button
              onClick={() => navigate('#/dashboard/claude/console')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                view === 'console'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Terminal size={11} strokeWidth={1.5} />
              Console
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 flex-1 max-w-[200px]">
            <div className="flex-1 h-[3px] bg-border rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(globalPct, 2)}%`, background: '#cc5de8' }}
              />
            </div>
            <span className="text-[10px] font-bold tabular-nums text-muted-foreground whitespace-nowrap">
              {globalPct}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Parcours view ── */}
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Framework banner */}
        <div className="mb-6 rounded-xl border border-border bg-card p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-3">
            La Recette Buildrs — 10 étapes
          </p>
          <div className="flex flex-wrap gap-1.5">
            {FRAMEWORK_STEPS.map((step, i) => (
              <div
                key={i}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-[10px] font-medium text-muted-foreground border border-border/50"
              >
                <span className="font-bold text-foreground/60">{i + 1}</span>
                <span>{step.shortLabel}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Module grid */}
        <div className="flex flex-col gap-3">
          {CLAUDE_CURRICULUM.map((mod, idx) => {
            const pct = moduleProgress(mod.id, mod.lessons.length)
            const isLocked = (mod.id === 'claude-5' && !hasClaudeCodeOb) || (mod.id === 'claude-6' && !hasClaudeCoworkOb)
            const done = pct === 100

            return (
              <button
                key={mod.id}
                onClick={() => !isLocked && navigate(`#/dashboard/claude/module/${mod.id}`)}
                disabled={isLocked}
                className={`group relative text-left rounded-xl border transition-all duration-150 p-4 ${
                  isLocked
                    ? 'border-border opacity-60 cursor-not-allowed'
                    : done
                      ? 'border-[#22c55e]/40 bg-[#22c55e]/5 hover:border-[#22c55e]/70'
                      : 'border-border bg-card hover:border-foreground/20 cursor-pointer'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Module number */}
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black"
                    style={{
                      background: done ? 'rgba(34,197,94,0.15)' : isLocked ? 'hsl(var(--secondary))' : 'hsl(var(--secondary))',
                      color: done ? '#22c55e' : 'hsl(var(--muted-foreground))',
                    }}
                  >
                    {done ? <Check size={14} strokeWidth={2.5} /> : isLocked ? <Lock size={12} strokeWidth={1.5} /> : `0${idx + 1}`}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[11px] font-bold uppercase tracking-[0.07em] text-muted-foreground">
                        {mod.etapeLabel}
                      </span>
                      {mod.isBonus && (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(204,93,232,0.15)', color: '#cc5de8', border: '1px solid rgba(204,93,232,0.3)' }}>
                          OB
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-foreground text-sm tracking-tight leading-tight mb-1">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {mod.subtitle}
                    </p>
                  </div>

                  <div className="flex-shrink-0 flex flex-col items-end gap-2">
                    {/* Progress ring */}
                    <div className="relative w-8 h-8">
                      <svg viewBox="0 0 32 32" className="w-8 h-8 -rotate-90">
                        <circle cx="16" cy="16" r="12" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                        <circle
                          cx="16" cy="16" r="12" fill="none"
                          stroke={done ? '#22c55e' : '#cc5de8'}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 12}`}
                          strokeDashoffset={`${2 * Math.PI * 12 * (1 - pct / 100)}`}
                          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-muted-foreground">
                        {pct}%
                      </span>
                    </div>
                    {!isLocked && (
                      <ChevronRight size={14} strokeWidth={1.5} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                  </div>
                </div>

                {/* Lesson count + duration */}
                <div className="mt-3 flex items-center gap-3 ml-11">
                  <span className="text-[10px] text-muted-foreground/70">
                    {mod.lessons.length} leçons
                  </span>
                  <span className="text-[10px] text-muted-foreground/50">·</span>
                  <span className="text-[10px] text-muted-foreground/70">
                    {mod.duration}
                  </span>
                  {isLocked && (
                    <>
                      <span className="text-[10px] text-muted-foreground/50">·</span>
                      <span className="text-[10px] font-semibold" style={{ color: '#cc5de8' }}>
                        Débloquer — 37€
                      </span>
                    </>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Bottom CTA - go to console */}
        <div className="mt-8 rounded-xl border border-border bg-secondary/30 p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-foreground mb-0.5">Ta Console Claude</p>
            <p className="text-[11px] text-muted-foreground">Skills, MCPs, templates et ressources prêts à copier.</p>
          </div>
          <button
            onClick={() => navigate('#/dashboard/claude/console')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Terminal size={12} strokeWidth={1.5} />
            Ouvrir
          </button>
        </div>
      </div>
    </div>
  )
}
