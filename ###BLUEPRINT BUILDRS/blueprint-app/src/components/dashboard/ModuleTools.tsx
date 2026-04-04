import { Bot, Lock, Zap, Wand2, Code2, Search, FileText } from 'lucide-react'

interface AgentDef {
  id: string
  label: string
  desc: string
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string; style?: React.CSSProperties }>
  color: string
  hash: string
}

const ALL_AGENTS: AgentDef[] = [
  {
    id: 'jarvis',
    label: 'Jarvis IA',
    desc: 'Brainstorm, analyse et stratégie',
    Icon: Zap,
    color: '#22c55e',
    hash: '#/dashboard/autopilot',
  },
  {
    id: 'idea',
    label: 'Agent Idées',
    desc: 'Trouver et valider tes idées SaaS',
    Icon: Search,
    color: '#4d96ff',
    hash: '#/dashboard/agents',
  },
  {
    id: 'copy',
    label: 'Agent Copywriting',
    desc: 'Offre, landing page, emails',
    Icon: FileText,
    color: '#f97316',
    hash: '#/dashboard/agents',
  },
  {
    id: 'architect',
    label: 'Agent Architecte',
    desc: 'Architecture, base de données, API',
    Icon: Code2,
    color: '#cc5de8',
    hash: '#/dashboard/agents',
  },
  {
    id: 'builder',
    label: 'Agent Builder',
    desc: 'Build MVP, intégrations, debug',
    Icon: Wand2,
    color: '#eab308',
    hash: '#/dashboard/agents',
  },
]

const MODULE_AGENT_MAP: Record<string, string[]> = {
  '00':      ['jarvis'],
  'setup':   ['jarvis'],
  '01':      ['idea', 'jarvis'],
  'valider': ['idea', 'jarvis'],
  'offre':   ['copy', 'jarvis'],
  '02':      ['copy'],
  '03':      ['architect'],
  '04':      ['builder', 'architect'],
  '05':      ['builder', 'jarvis'],
  '06':      ['copy', 'jarvis'],
  'scaler':  ['jarvis'],
}

interface Props {
  moduleId: string
  hasPack: boolean
  navigate: (hash: string) => void
}

export function ModuleTools({ moduleId, hasPack, navigate }: Props) {
  const agentIds = MODULE_AGENT_MAP[moduleId] ?? ['jarvis']
  const agents = agentIds.map(id => ALL_AGENTS.find(a => a.id === id)).filter(Boolean) as AgentDef[]

  if (agents.length === 0) return null

  return (
    <div className="mt-8 border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(77,150,255,0.1)', border: '1px solid rgba(77,150,255,0.2)' }}
        >
          <Bot size={12} strokeWidth={1.5} style={{ color: '#4d96ff' }} />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground/70">
          Agents IA disponibles
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {agents.map(agent => {
          const locked = !hasPack && agent.id !== 'jarvis'
          return (
            <button
              key={agent.id}
              onClick={() => navigate(locked ? '#/dashboard/agents' : agent.hash)}
              className="flex items-center gap-3 w-full text-left rounded-lg border border-border px-3.5 py-3 hover:bg-secondary/40 transition-all duration-150"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${agent.color}15`, border: `1px solid ${agent.color}25` }}
              >
                <agent.Icon size={13} strokeWidth={1.5} style={{ color: agent.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-foreground">{agent.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{agent.desc}</p>
              </div>
              {locked ? (
                <Lock size={11} strokeWidth={1.5} className="text-muted-foreground/40 flex-shrink-0" />
              ) : (
                <span
                  className="text-[8px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{ background: `${agent.color}15`, color: agent.color, border: `1px solid ${agent.color}30` }}
                >
                  OPEN
                </span>
              )}
            </button>
          )
        })}
      </div>

      {!hasPack && agents.some(a => a.id !== 'jarvis') && (
        <button
          onClick={() => navigate('#/dashboard/agents')}
          className="mt-3 w-full text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors text-center py-1"
        >
          Debloquer les Agents IA — 197EUR →
        </button>
      )}
    </div>
  )
}
