import { ChevronRight, Check, HelpCircle } from 'lucide-react'
import { getModule } from '../../data/curriculum'

interface Props {
  moduleId: string
  navigate: (hash: string) => void
  isCompleted: (moduleId: string, lessonId: string) => boolean
}

export function ModulePage({ moduleId, navigate, isCompleted }: Props) {
  const mod = getModule(moduleId)
  if (!mod) return <div className="p-7 text-muted-foreground text-sm">Module introuvable.</div>

  const completedCount = mod.lessons.filter(l => isCompleted(moduleId, l.id)).length
  const pct = Math.round((completedCount / mod.lessons.length) * 100)

  return (
    <div className="p-7 max-w-2xl">

      {/* Module header */}
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Module {moduleId} · {mod.lessons.length} leçons
        </p>
        <h1 className="text-3xl font-extrabold text-foreground mb-2" style={{ letterSpacing: '-0.03em' }}>{mod.title}</h1>
        <p className="text-sm text-muted-foreground mb-4">{mod.description}</p>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full" style={{ background: 'hsl(var(--border))' }}>
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(pct, pct > 0 ? 2 : 0)}%`, background: 'linear-gradient(90deg, #4d96ff, #22c55e)' }}
            />
          </div>
          <span className="text-xs font-bold text-muted-foreground">{completedCount}/{mod.lessons.length}</span>
        </div>
      </div>

      {/* Lesson list */}
      <div className="flex flex-col gap-2">
        {mod.lessons.map((lesson, i) => {
          const done = isCompleted(moduleId, lesson.id)
          const prevDone = i === 0 || isCompleted(moduleId, mod.lessons[i - 1].id)
          const locked = !prevDone && !done && i > 0

          return (
            <button
              key={lesson.id}
              onClick={() => !locked && navigate(`#/dashboard/module/${moduleId}/lesson/${lesson.id}`)}
              className={`group flex items-center gap-3.5 w-full text-left rounded-xl border px-4 py-3.5 transition-all duration-150 ${
                done
                  ? 'bg-foreground border-foreground'
                  : locked
                    ? 'border-border opacity-40 cursor-not-allowed'
                    : 'bg-background border-border hover:border-foreground/30 hover:bg-secondary/30'
              }`}
            >
              {/* Number badge */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[11px] flex-shrink-0 ${
                done ? 'bg-white/15 text-background' : 'bg-secondary text-foreground border border-border'
              }`}>
                {lesson.id}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${done ? 'text-background' : 'text-foreground'}`}>
                  {lesson.title}
                </p>
                <p className={`text-xs mt-0.5 ${done ? 'text-background/50' : 'text-muted-foreground'}`}>
                  {lesson.duration}
                  {lesson.prompts && lesson.prompts.length > 0 && ` · ${lesson.prompts.length} prompt${lesson.prompts.length > 1 ? 's' : ''}`}
                </p>
              </div>

              {done ? (
                <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full" style={{ color: '#22c55e', background: 'rgba(34,197,94,0.18)' }}>
                  <Check size={9} strokeWidth={3} /> Fait
                </span>
              ) : (
                <ChevronRight size={14} strokeWidth={1.5} className="text-muted-foreground flex-shrink-0" />
              )}
            </button>
          )
        })}

        {/* Quiz */}
        {mod.quizQuestions && mod.quizQuestions.length > 0 && (
          <button
            onClick={() => navigate(`#/dashboard/quiz/${moduleId}`)}
            className="flex items-center gap-3.5 w-full text-left rounded-xl border-2 border-dashed px-4 py-3.5 hover:bg-secondary/20 transition-colors mt-1"
            style={{ borderColor: 'rgba(204,93,232,0.35)' }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(204,93,232,0.1)' }}>
              <HelpCircle size={15} strokeWidth={1.5} style={{ color: '#cc5de8' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Quiz de fin de module</p>
              <p className="text-xs text-muted-foreground mt-0.5">{mod.quizQuestions.length} questions · Valider le module</p>
            </div>
            <ChevronRight size={14} strokeWidth={1.5} className="text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  )
}
