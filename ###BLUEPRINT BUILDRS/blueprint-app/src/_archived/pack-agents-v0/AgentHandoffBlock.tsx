import { Lock, Zap } from 'lucide-react'
import {
  RobotValidator, RobotPlanner, RobotDesigner,
  RobotArchitect, RobotBuilder, RobotLauncher,
} from '../ui/agent-robots'

// ── Module → Agent mapping ────────────────────────────────────────────────────

interface AgentRef {
  id: string
  name: string
  free?: boolean
  Robot: React.ComponentType<{ size?: number }>
}

interface ModuleMapping {
  agents: AgentRef[]
  title: string
  desc: string
  primaryCta: string
  primaryAgentId: string
  color: string
}

const MODULE_AGENT_MAP: Record<string, ModuleMapping> = {
  '01': {
    agents: [{ id: 'validator', name: 'Validator', free: true, Robot: RobotValidator }],
    title: 'Tu as la méthode. Maintenant, valide.',
    desc: "L'agent Validator analyse ton idée, scanne le marché et te donne un score /100 en quelques minutes.",
    primaryCta: 'Lancer le Validator →',
    primaryAgentId: 'validator',
    color: '#22c55e',
  },
  'valider': {
    agents: [{ id: 'validator', name: 'Validator', free: true, Robot: RobotValidator }],
    title: 'Tu as la méthode. Maintenant, valide.',
    desc: "L'agent Validator analyse ton idée, scanne le marché et te donne un score /100 en quelques minutes.",
    primaryCta: 'Lancer le Validator →',
    primaryAgentId: 'validator',
    color: '#22c55e',
  },
  '02': {
    agents: [
      { id: 'planner',  name: 'Planner',  Robot: RobotPlanner  },
      { id: 'designer', name: 'Designer', Robot: RobotDesigner },
    ],
    title: 'Tu sais quoi préparer. Les agents le font pour toi.',
    desc: 'Le Planner génère ton cahier des charges. Le Designer crée ton identité visuelle.',
    primaryCta: 'Lancer le Planner →',
    primaryAgentId: 'planner',
    color: '#3b82f6',
  },
  '03': {
    agents: [{ id: 'architect', name: 'Architect', Robot: RobotArchitect }],
    title: "Tu comprends l'architecture. L'agent la construit.",
    desc: "L'Architect conçoit ta BDD, ton auth, et produit ton CLAUDE.md en quelques minutes.",
    primaryCta: "Lancer l'Architect →",
    primaryAgentId: 'architect',
    color: '#f97316',
  },
  '04': {
    agents: [{ id: 'builder', name: 'Builder', Robot: RobotBuilder }],
    title: 'Tu as les bases. Le Builder accélère x10.',
    desc: "L'agent Builder te génère les prompts Claude Code optimaux, étape par étape.",
    primaryCta: 'Lancer le Builder →',
    primaryAgentId: 'builder',
    color: '#8b5cf6',
  },
  '05': {
    agents: [{ id: 'launcher', name: 'Launcher', Robot: RobotLauncher }],
    title: 'Ton produit est prêt. Lance-le.',
    desc: 'Le Launcher déploie ton app, rédige ta landing, crée tes emails et tes premières ads.',
    primaryCta: 'Lancer le Launcher →',
    primaryAgentId: 'launcher',
    color: '#14b8a6',
  },
  '06': {
    agents: [{ id: 'launcher', name: 'Launcher', Robot: RobotLauncher }],
    title: 'Ton produit est prêt. Lance-le.',
    desc: 'Le Launcher déploie ton app, rédige ta landing, crée tes emails et tes premières ads.',
    primaryCta: 'Lancer le Launcher →',
    primaryAgentId: 'launcher',
    color: '#14b8a6',
  },
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  moduleId: string
  hasPack: boolean
  navigate: (hash: string) => void
}

export function AgentHandoffBlock({ moduleId, hasPack, navigate }: Props) {
  const mapping = MODULE_AGENT_MAP[moduleId]
  if (!mapping) return null

  const { agents, title, desc, primaryCta, primaryAgentId, color } = mapping
  const isPrimaryFree = agents[0]?.free === true
  const isUnlocked = isPrimaryFree || hasPack

  const PrimaryRobot = agents[0].Robot

  const handleClick = () => {
    if (isUnlocked) {
      navigate(`#/dashboard/agent-chat/${primaryAgentId}`)
    } else {
      navigate('#/dashboard/offers')
    }
  }

  return (
    <div
      className="mt-6 rounded-2xl border-2 overflow-hidden"
      style={{ borderColor: isUnlocked ? `${color}40` : 'hsl(var(--border))' }}
    >
      {/* Header bar */}
      <div
        className="px-5 py-2.5 flex items-center gap-2"
        style={{ background: isUnlocked ? `${color}12` : 'hsl(var(--muted))' }}
      >
        <span
          className="text-[9px] font-bold uppercase tracking-[0.1em]"
          style={{ color: isUnlocked ? color : 'hsl(var(--muted-foreground))' }}
        >
          Passe à l'action
        </span>
        {!isUnlocked && (
          <span
            className="text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide"
            style={{ background: 'hsl(var(--foreground))', color: 'hsl(var(--background))' }}
          >
            PACK AGENTS
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5" style={{ background: 'hsl(var(--card))' }}>
        <div className="flex items-start gap-4">
          {/* Robots (greyed if locked) */}
          <div
            className="flex gap-1.5 flex-shrink-0"
            style={isUnlocked ? undefined : { filter: 'grayscale(1)', opacity: 0.35 }}
          >
            {agents.map(({ id, Robot }) => (
              <Robot key={id} size={40} />
            ))}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p
              className="font-extrabold text-foreground leading-tight mb-1"
              style={{ fontSize: 14, letterSpacing: '-0.025em' }}
            >
              {title}
            </p>
            <p className="text-[12px] text-muted-foreground leading-relaxed mb-4">
              {desc}
            </p>

            <button
              onClick={handleClick}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[12px] font-bold transition-opacity hover:opacity-90"
              style={
                isUnlocked
                  ? { background: color, color: '#fff' }
                  : { background: 'hsl(var(--foreground))', color: 'hsl(var(--background))' }
              }
            >
              {!isUnlocked && <Lock size={10} strokeWidth={2} />}
              {isUnlocked ? primaryCta : 'Débloquer les agents — 197€ →'}
            </button>

            {/* Secondary agents chips (Module 02 only) */}
            {agents.length > 1 && isUnlocked && (
              <div className="flex gap-2 mt-3">
                {agents.slice(1).map(({ id, name, Robot }) => (
                  <button
                    key={id}
                    onClick={() => navigate(`#/dashboard/agent-chat/${id}`)}
                    className="flex items-center gap-1.5 text-[10px] font-semibold transition-opacity hover:opacity-80"
                    style={{ color: 'hsl(var(--muted-foreground))' }}
                  >
                    <span style={{ filter: 'grayscale(0)' }}>
                      <Robot size={14} />
                    </span>
                    Lancer le {name} →
                  </button>
                ))}
              </div>
            )}

            {/* Unlock hint if pack locked + multiple agents */}
            {agents.length > 1 && !isUnlocked && (
              <p className="text-[10px] text-muted-foreground/60 mt-2 flex items-center gap-1">
                <Zap size={9} strokeWidth={1.5} />
                {agents.map(a => a.name).join(' + ')} inclus dans le Pack Agents
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
