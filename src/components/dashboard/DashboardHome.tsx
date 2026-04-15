import {
  Layers, Search, Palette, Building2, Hammer, Rocket, DollarSign,
  Lock, ArrowRight, FolderOpen, Pencil, Lightbulb, Zap,
  CheckCircle2, Circle,
} from 'lucide-react'
import { CURRICULUM, getTotalLessons } from '../../data/curriculum'
import { loadProject } from './ProjectPage'

const STATUS_DISPLAY: Record<string, { label: string; color: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }> }> = {
  idea:     { label: 'Idée',            color: '#eab308', Icon: Lightbulb },
  building: { label: 'En construction', color: '#4d96ff', Icon: Hammer },
  live:     { label: 'Live',            color: '#22c55e', Icon: Zap },
}

const MODULE_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  '00': Layers, '01': Search, '02': Palette, '03': Building2,
  '04': Hammer, '05': Rocket, '06': DollarSign,
}

interface Props {
  navigate: (hash: string) => void
  moduleProgress: (id: string, total: number) => number
  globalPercent: number
  isCompleted: (moduleId: string, lessonId: string) => boolean
  userEmail: string | undefined
}

export function DashboardHome({ navigate, moduleProgress, globalPercent, isCompleted, userEmail }: Props) {
  const firstName = userEmail?.split('@')[0] ?? 'toi'
  const project = loadProject()
  const totalLessons = getTotalLessons()
  const completedLessons = CURRICULUM.reduce((acc, mod) =>
    acc + mod.lessons.filter(l => isCompleted(mod.id, l.id)).length, 0
  )
  const completedModules = CURRICULUM.filter(mod => moduleProgress(mod.id, mod.lessons.length) === 100).length

  // Next lesson
  let nextModuleId: string | null = null
  let nextLessonId: string | null = null
  outer: for (const mod of CURRICULUM) {
    for (const lesson of mod.lessons) {
      if (!isCompleted(mod.id, lesson.id)) {
        nextModuleId = mod.id
        nextLessonId = lesson.id
        break outer
      }
    }
  }

  return (
    <div className="px-8 py-10 max-w-[800px]">

      {/* ── Greeting ───────────────────────────────────────────────────── */}
      <div className="mb-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-2">
          Tableau de bord
        </p>
        <h1
          className="text-foreground mb-2"
          style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}
        >
          Salut {firstName}
        </h1>
        <p className="text-[14px] leading-relaxed text-muted-foreground max-w-[420px]">
          {globalPercent === 0
            ? "Ton parcours t'attend. Commence par le début."
            : globalPercent === 100
              ? "Tu as terminé le Blueprint. Félicitations !"
              : `Tu es à ${globalPercent}% — continue là où tu t'es arrêté.`
          }
        </p>
      </div>

      {/* ── Stats strip ────────────────────────────────────────────────── */}
      <div
        className="grid grid-cols-3 overflow-hidden rounded-2xl border border-border mb-10"
        style={{ background: 'hsl(var(--border))', gap: '1px' }}
      >
        {[
          { value: `${globalPercent}%`,                      label: 'Progression' },
          { value: `${completedLessons}/${totalLessons}`,    label: 'Leçons' },
          { value: `${completedModules}/${CURRICULUM.length}`, label: 'Modules' },
        ].map(stat => (
          <div key={stat.label} className="bg-background px-6 py-5 text-center">
            <p
              className="text-foreground tabular-nums mb-1"
              style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}
            >
              {stat.value}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Resume / Start CTA ─────────────────────────────────────────── */}
      {nextModuleId && nextLessonId && (
        <button
          onClick={() => navigate(`#/dashboard/module/${nextModuleId}/lesson/${nextLessonId}`)}
          className={`flex items-center justify-between w-full rounded-xl px-5 py-4 mb-10 text-left transition-all duration-150 group ${
            globalPercent === 0
              ? 'bg-foreground text-background hover:opacity-90'
              : 'border border-border hover:border-foreground/30 hover:bg-secondary/30'
          }`}
        >
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-[0.09em] mb-1 ${
              globalPercent === 0 ? 'opacity-40' : 'text-muted-foreground'
            }`}>
              {globalPercent === 0 ? 'Commencer' : 'Reprendre'}
            </p>
            <p className={`text-[13px] font-semibold tracking-[-0.01em] ${
              globalPercent === 0 ? '' : 'text-foreground'
            }`}>
              {CURRICULUM.find(m => m.id === nextModuleId)?.lessons.find(l => l.id === nextLessonId)?.title ?? `Leçon ${nextLessonId}`}
            </p>
          </div>
          <ArrowRight
            size={16}
            strokeWidth={1.5}
            className={`flex-shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 ${
              globalPercent === 0 ? 'opacity-70' : 'text-muted-foreground group-hover:text-foreground'
            }`}
          />
        </button>
      )}

      {/* ── Mon Projet ─────────────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.09em] text-muted-foreground">
            Mon Projet
          </p>
          <button
            onClick={() => navigate('#/dashboard/project')}
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil size={10} strokeWidth={1.5} />
            Modifier
          </button>
        </div>

        <button
          onClick={() => navigate('#/dashboard/project')}
          className="w-full text-left border border-border rounded-xl px-5 py-4 hover:border-foreground/20 transition-all duration-150 group"
        >
          {project.name ? (
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-secondary">
                <FolderOpen size={14} strokeWidth={1.5} className="text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[13px] font-bold text-foreground tracking-[-0.01em]">{project.name}</p>
                  {project.status && STATUS_DISPLAY[project.status] && (() => {
                    const s = STATUS_DISPLAY[project.status]
                    return (
                      <span
                        className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ color: s.color, background: `${s.color}15` }}
                      >
                        <s.Icon size={9} strokeWidth={1.5} />
                        {s.label}
                      </span>
                    )
                  })()}
                </div>
                {project.problem && (
                  <p className="text-[12px] text-muted-foreground truncate">{project.problem}</p>
                )}
              </div>
              <ArrowRight size={14} strokeWidth={1.5} className="text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 mt-1" />
            </div>
          ) : (
            <div className="flex items-center gap-3 text-muted-foreground">
              <FolderOpen size={14} strokeWidth={1.5} />
              <p className="text-[12px] italic">Définir mon projet →</p>
            </div>
          )}
        </button>
      </div>

      {/* ── Modules ────────────────────────────────────────────────────── */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.09em] text-muted-foreground mb-4">
          Tous les modules
        </p>

        <div className="flex flex-col gap-2">
          {CURRICULUM.map((mod, i) => {
            const Icon = MODULE_ICONS[mod.id] ?? Layers
            const pct = moduleProgress(mod.id, mod.lessons.length)
            const done = pct === 100
            const inProgress = pct > 0 && pct < 100
            const locked = i > 1 && moduleProgress(CURRICULUM[i - 1].id, CURRICULUM[i - 1].lessons.length) < 50

            return (
              <button
                key={mod.id}
                onClick={() => !locked && navigate(`#/dashboard/module/${mod.id}`)}
                className={`group flex items-center gap-4 w-full text-left border rounded-xl px-5 py-4 transition-all duration-150 ${
                  locked
                    ? 'border-border opacity-35 cursor-not-allowed'
                    : done
                      ? 'border-border hover:border-foreground/20'
                      : inProgress
                        ? 'border-foreground/20 bg-secondary/30 hover:border-foreground/30'
                        : 'border-border hover:border-foreground/15 hover:bg-secondary/20'
                }`}
              >
                {/* Icon */}
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-secondary">
                  {locked
                    ? <Lock size={13} strokeWidth={1.5} className="text-muted-foreground" />
                    : <Icon size={13} strokeWidth={1.5} className="text-foreground" />
                  }
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold text-muted-foreground">
                      Module {mod.id}
                    </span>
                    {done && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-[#22c55e] bg-[#22c55e15]">
                        Terminé
                      </span>
                    )}
                    {inProgress && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-foreground bg-secondary">
                        En cours
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] font-bold text-foreground tracking-[-0.01em]">
                    {mod.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {mod.description}
                  </p>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                  <div className="text-right">
                    <p className="text-[11px] font-medium text-muted-foreground tabular-nums">
                      {mod.lessons.length} leçons
                    </p>
                    {pct > 0 && (
                      <p className="text-[10px] text-muted-foreground mt-0.5 tabular-nums">{pct}%</p>
                    )}
                  </div>
                  {done
                    ? <CheckCircle2 size={15} strokeWidth={1.5} className="text-[#22c55e]" />
                    : <Circle size={15} strokeWidth={1.5} className="text-border group-hover:text-muted-foreground transition-colors" />
                  }
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
