import { ArrowLeft, ChevronRight, Check, Lock, Clock } from 'lucide-react'
import { ClaudeIcon } from '../../ui/icons'
import { getClaudeModule, FRAMEWORK_STEPS } from '../../../data/claude-curriculum'

interface Props {
  modId: string
  navigate: (hash: string) => void
  isCompleted: (moduleId: string, lessonId: string) => boolean
  moduleProgress: (id: string, total: number) => number
}

export function ClaudeModulePage({ modId, navigate, isCompleted, moduleProgress }: Props) {
  const mod = getClaudeModule(modId)
  if (!mod) return <div className="p-7 text-muted-foreground text-sm">Module introuvable.</div>

  const completedCount = mod.lessons.filter(l => isCompleted(modId, l.id)).length
  const pct = moduleProgress(modId, mod.lessons.length)

  return (
    <div className="min-h-full bg-background">

      {/* Sub-header */}
      <div className="sticky top-0 z-20 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 h-12">
          <button
            onClick={() => navigate('#/dashboard/claude')}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs font-medium"
          >
            <ArrowLeft size={13} strokeWidth={1.5} />
            Claude 360°
          </button>
          <div className="flex items-center gap-1.5">
            <ClaudeIcon size={13} />
            <span className="text-xs font-bold tracking-[-0.02em] text-foreground truncate max-w-[160px]">{mod.title}</span>
          </div>
          <span className="text-[10px] font-bold tabular-nums" style={{ color: '#cc5de8' }}>
            {pct}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-[2px] bg-border">
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${Math.max(pct, pct > 0 ? 1 : 0)}%`, background: '#cc5de8' }}
          />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Module header */}
        <div className="mb-6">
          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
            {mod.etapeLabel}
          </span>
          <h1 className="text-2xl font-extrabold text-foreground mt-1 mb-2" style={{ letterSpacing: '-0.03em' }}>
            {mod.title}
          </h1>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {mod.subtitle}
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock size={11} strokeWidth={1.5} />
              {mod.duration}
            </div>
            <div className="w-px h-3 bg-border" />
            <span className="text-[11px] text-muted-foreground">
              {completedCount}/{mod.lessons.length} leçons
            </span>
            <div className="w-px h-3 bg-border" />
            <span className="text-[11px] font-bold" style={{ color: '#cc5de8' }}>
              {pct}%
            </span>
          </div>
        </div>

        {/* Framework steps covered */}
        {mod.frameworkSteps.length > 0 && (
          <div className="mb-6 rounded-xl border border-border bg-card p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-2.5">
              Étapes du framework couvertes
            </p>
            <div className="flex flex-wrap gap-1.5">
              {mod.frameworkSteps.map(stepNum => {
                const s = FRAMEWORK_STEPS[stepNum - 1]
                return (
                  <div
                    key={stepNum}
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold"
                    style={{ background: 'rgba(204,93,232,0.1)', color: '#cc5de8', border: '1px solid rgba(204,93,232,0.25)' }}
                  >
                    <span className="font-black">{stepNum}</span>
                    <span>{s?.shortLabel}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Lesson list */}
        <div className="flex flex-col gap-2">
          {mod.lessons.map((lesson, i) => {
            const done = isCompleted(modId, lesson.id)

            return (
              <button
                key={lesson.id}
                onClick={() => navigate(`#/dashboard/claude/module/${modId}/lesson/${lesson.id}`)}
                className={`group flex items-center gap-3.5 w-full text-left rounded-xl border px-4 py-3.5 transition-all duration-150 ${
                  done
                    ? 'bg-foreground border-foreground'
                    : 'bg-background border-border hover:border-foreground/30 hover:bg-secondary/30'
                }`}
              >
                {/* Number badge */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px] flex-shrink-0 ${
                  done ? 'bg-white/15 text-background' : 'bg-secondary text-foreground border border-border'
                }`}>
                  {done ? <Check size={13} strokeWidth={2.5} /> : lesson.id}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${done ? 'text-background' : 'text-foreground'}`}>
                    {lesson.title}
                  </p>
                  {lesson.duration && (
                    <p className={`text-xs mt-0.5 flex items-center gap-1 ${done ? 'text-background/50' : 'text-muted-foreground'}`}>
                      <Clock size={9} strokeWidth={1.5} />
                      {lesson.duration}
                    </p>
                  )}
                </div>

                {done ? (
                  <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full flex-shrink-0"
                    style={{ color: '#22c55e', background: 'rgba(34,197,94,0.18)' }}>
                    <Check size={9} strokeWidth={3} /> Fait
                  </span>
                ) : (
                  <ChevronRight size={14} strokeWidth={1.5} className="text-muted-foreground flex-shrink-0 group-hover:text-foreground transition-colors" />
                )}
              </button>
            )
          })}
        </div>

        {/* Completion banner */}
        {pct === 100 && (
          <div className="mt-6 rounded-xl p-4 text-center"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
            <Check size={20} strokeWidth={2.5} className="mx-auto mb-2" style={{ color: '#22c55e' }} />
            <p className="text-sm font-bold text-foreground">Module terminé !</p>
            <p className="text-xs text-muted-foreground mt-1">Passe au module suivant dans le parcours.</p>
            <button
              onClick={() => navigate('#/dashboard/claude')}
              className="mt-3 px-4 py-2 rounded-lg text-xs font-semibold text-background transition-opacity hover:opacity-90"
              style={{ background: '#22c55e' }}
            >
              Retour au parcours
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
