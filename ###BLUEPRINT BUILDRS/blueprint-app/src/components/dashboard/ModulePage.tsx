import { Check, ChevronRight, HelpCircle, Lock } from 'lucide-react'
import { getModule } from '../../data/curriculum'
import { VideoPlayer } from '../ui/video-player'
import { RobotValidator, RobotPlanner, RobotDesigner, RobotArchitect, RobotBuilder, RobotLauncher } from '../ui/agent-robots'

// ── Video URLs per module (add URL when ready) ──────────────────────────────
const MODULE_VIDEOS: Record<string, { src?: string; poster?: string }> = {
  '00':      {},
  'setup':   {},
  '01':      {},
  'valider': {},
  'offre':   {},
  '02':      {},
  '03':      {},
  '04':      {},
  '05':      {},
  '06':      {},
  'scaler':  {},
}

// ── Jarvis robot (inline — not exported from agent-robots) ───────────────────
function RobotJarvis({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="0" width="2" height="3" fill="#818cf8"/>
      <rect x="15" y="0" width="2" height="3" fill="#818cf8"/>
      <rect x="5" y="2" width="2" height="2" fill="#818cf8"/>
      <rect x="17" y="2" width="2" height="2" fill="#818cf8"/>
      <rect x="3" y="4" width="18" height="12" rx="2" fill="#6366f1"/>
      <rect x="6" y="7" width="4" height="4" rx="1" fill="#c7d2fe"/>
      <rect x="14" y="7" width="4" height="4" rx="1" fill="#c7d2fe"/>
      <rect x="7" y="8" width="2" height="2" fill="#312e81"/>
      <rect x="15" y="8" width="2" height="2" fill="#312e81"/>
      <rect x="9" y="13" width="6" height="2" rx="1" fill="#4338ca"/>
      <rect x="5" y="17" width="4" height="4" rx="1" fill="#4338ca"/>
      <rect x="15" y="17" width="4" height="4" rx="1" fill="#4338ca"/>
      <rect x="4" y="20" width="3" height="2" rx="1" fill="#4338ca"/>
      <rect x="17" y="20" width="3" height="2" rx="1" fill="#4338ca"/>
    </svg>
  )
}

// ── Real agents ──────────────────────────────────────────────────────────────
interface AgentDef {
  id: string
  name: string
  role: string
  color: string
  free: boolean
  Robot: React.ComponentType<{ size?: number }>
  hash: string
}
const ALL_AGENTS: AgentDef[] = [
  { id: 'jarvis',    name: 'Jarvis',    role: 'COO IA · Orchestrateur',       color: '#6366f1', free: true,  Robot: RobotJarvis,    hash: '#/dashboard/autopilot' },
  { id: 'validator', name: 'Validator', role: 'Trouver & Valider',            color: '#22c55e', free: true,  Robot: RobotValidator, hash: '#/dashboard/agent-chat/validator' },
  { id: 'planner',   name: 'Planner',   role: 'Préparer & Structurer',        color: '#3b82f6', free: false, Robot: RobotPlanner,   hash: '#/dashboard/agent-chat/planner' },
  { id: 'designer',  name: 'Designer',  role: 'Branding & Identité',          color: '#f43f5e', free: false, Robot: RobotDesigner,  hash: '#/dashboard/agent-chat/designer' },
  { id: 'architect', name: 'Architect', role: 'Architecture technique',       color: '#f97316', free: false, Robot: RobotArchitect, hash: '#/dashboard/agent-chat/architect' },
  { id: 'builder',   name: 'Builder',   role: 'Construire ton produit',       color: '#8b5cf6', free: false, Robot: RobotBuilder,   hash: '#/dashboard/agent-chat/builder' },
  { id: 'launcher',  name: 'Launcher',  role: 'Déployer & Lancer',            color: '#14b8a6', free: false, Robot: RobotLauncher,  hash: '#/dashboard/agent-chat/launcher' },
]
const MODULE_AGENT_MAP: Record<string, string[]> = {
  '00':      ['jarvis'],
  'setup':   ['jarvis'],
  '01':      ['validator', 'jarvis'],
  'valider': ['validator', 'jarvis'],
  'offre':   ['designer', 'planner'],
  '02':      ['designer', 'planner'],
  '03':      ['architect'],
  '04':      ['builder', 'architect'],
  '05':      ['launcher', 'builder'],
  '06':      ['launcher', 'jarvis'],
  'scaler':  ['jarvis'],
}

// ── Module display numbers ──────────────────────────────────────────────────
const MODULE_NUM: Record<string, string> = {
  '00': '00', 'setup': '01', '01': '02', 'valider': '03', 'offre': '04',
  '02': '05', '03': '06', '04': '07', '05': '08', '06': '09', 'scaler': '10',
}

interface Props {
  moduleId: string
  navigate: (hash: string) => void
  isCompleted: (moduleId: string, lessonId: string) => boolean
  hasPack?: boolean
}

export function ModulePage({ moduleId, navigate, isCompleted, hasPack = false }: Props) {
  const mod = getModule(moduleId)
  if (!mod) return <div className="p-7 text-muted-foreground text-sm">Module introuvable.</div>

  const completedCount = mod.lessons.filter(l => isCompleted(moduleId, l.id)).length
  const pct = Math.round((completedCount / mod.lessons.length) * 100)

  const video = MODULE_VIDEOS[moduleId] ?? {}
  const num   = MODULE_NUM[moduleId] ?? moduleId

  const agentIds = MODULE_AGENT_MAP[moduleId] ?? ['jarvis']
  const agents   = agentIds.map(id => ALL_AGENTS.find(a => a.id === id)).filter(Boolean) as AgentDef[]

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* ── MODULE HEADER ───────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60 mb-1">
          Module {num} · {mod.lessons.length} leçon{mod.lessons.length > 1 ? 's' : ''}
        </p>
        <h1 className="text-2xl font-extrabold text-foreground mb-1.5" style={{ letterSpacing: '-0.03em' }}>
          {mod.title}
        </h1>
        <p className="text-sm text-muted-foreground mb-4">{mod.description}</p>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.max(pct, pct > 0 ? 2 : 0)}%`,
                background: 'linear-gradient(90deg, #4d96ff, #22c55e)',
              }}
            />
          </div>
          <span className="text-xs font-bold text-muted-foreground tabular-nums">
            {completedCount}/{mod.lessons.length}
          </span>
          {pct === 100 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
              Terminé
            </span>
          )}
        </div>
      </div>

      {/* ── VIDEO + QUIZ/AGENTS SIDEBAR ─────────────────────────────────── */}
      <div className="flex gap-5 px-6 pb-5 flex-shrink-0 items-start">

        {/* VIDEO — flex-1, full available width */}
        <div className="flex-1 min-w-0">
          <VideoPlayer
            src={video.src}
            poster={video.poster}
            title={mod.title}
            className="rounded-xl"
          />
        </div>

        {/* RIGHT SIDEBAR — Quiz + Agents, fixed 250px */}
        <div className="w-[250px] flex-shrink-0 flex flex-col gap-4">

          {/* Quiz card */}
          {mod.quizQuestions && mod.quizQuestions.length > 0 && (
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 mb-2">
                Quiz
              </p>
              <button
                onClick={() => navigate(`#/dashboard/quiz/${moduleId}`)}
                className="flex items-center gap-3 w-full text-left rounded-xl border p-4 hover:bg-secondary/30 transition-all duration-150 group"
                style={{ borderColor: 'rgba(204,93,232,0.3)', background: 'rgba(204,93,232,0.04)' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(204,93,232,0.12)' }}>
                  <HelpCircle size={15} strokeWidth={1.5} style={{ color: '#cc5de8' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-foreground">Quiz de fin</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {mod.quizQuestions.length} questions
                  </p>
                </div>
                <ChevronRight size={13} strokeWidth={1.5} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* Agents card */}
          {agents.length > 0 && (
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 mb-2">
                Agents disponibles
              </p>
              <div className="flex flex-col gap-2">
                {agents.map(agent => {
                  const locked = !hasPack && !agent.free
                  const { Robot } = agent
                  return (
                    <button
                      key={agent.id}
                      onClick={() => navigate(locked ? '#/dashboard/agents' : agent.hash)}
                      className="flex items-center gap-2.5 w-full text-left rounded-xl border border-border p-3 hover:bg-secondary/40 transition-all duration-150"
                      style={locked ? { opacity: 0.6 } : {}}
                    >
                      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                        <Robot size={28} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-foreground">{agent.name}</p>
                        <p className="text-[9px] text-muted-foreground mt-0.5 leading-snug">{agent.role}</p>
                      </div>
                      {locked ? (
                        <Lock size={10} strokeWidth={1.5} className="text-muted-foreground/40 flex-shrink-0" />
                      ) : (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                          style={{ background: `${agent.color}15`, color: agent.color, border: `1px solid ${agent.color}30` }}>
                          GO
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {!hasPack && agents.some(a => !a.free) && (
                <button
                  onClick={() => navigate('#/dashboard/agents')}
                  className="mt-2.5 w-full text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors text-center py-1"
                >
                  Débloquer les Agents IA — 197€ →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── LESSONS GRID — 4 colonnes, pleine largeur ──────────────────── */}
      <div className="px-6 pb-8 flex-shrink-0">
        <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 mb-3">
          Leçons
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
          {mod.lessons.map((lesson, i) => {
            const done     = isCompleted(moduleId, lesson.id)
            const prevDone = i === 0 || isCompleted(moduleId, mod.lessons[i - 1].id)
            const locked   = !prevDone && !done && i > 0

            return (
              <button
                key={lesson.id}
                onClick={() => !locked && navigate(`#/dashboard/module/${moduleId}/lesson/${lesson.id}`)}
                className={`group flex flex-col gap-2.5 w-full text-left rounded-xl border p-4 transition-all duration-150 ${
                  done
                    ? 'bg-foreground border-foreground'
                    : locked
                      ? 'border-border opacity-40 cursor-not-allowed'
                      : 'bg-background border-border hover:border-foreground/25 hover:bg-secondary/30'
                }`}
              >
                {/* Top row: number badge + status */}
                <div className="flex items-start justify-between gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] flex-shrink-0 ${
                    done ? 'bg-white/15 text-background' : 'bg-secondary text-foreground border border-border'
                  }`}>
                    {locked
                      ? <Lock size={10} strokeWidth={1.5} />
                      : lesson.id
                    }
                  </div>
                  {done && (
                    <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ color: '#22c55e', background: 'rgba(34,197,94,0.18)' }}>
                      <Check size={8} strokeWidth={3} /> Fait
                    </span>
                  )}
                  {!done && !locked && (
                    <ChevronRight size={13} strokeWidth={1.5} className="text-muted-foreground/50 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  )}
                </div>

                {/* Title */}
                <p className={`text-[12px] font-semibold leading-snug ${done ? 'text-background' : 'text-foreground'}`}>
                  {lesson.title}
                </p>

                {/* Meta */}
                <p className={`text-[10px] mt-auto ${done ? 'text-background/50' : 'text-muted-foreground'}`}>
                  {lesson.duration}
                  {lesson.prompts && lesson.prompts.length > 0
                    ? ` · ${lesson.prompts.length} prompt${lesson.prompts.length > 1 ? 's' : ''}`
                    : ''
                  }
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
