import { useState } from 'react'
import { Bot, Lock, X, Zap } from 'lucide-react'
import {
  RobotValidator, RobotPlanner, RobotDesigner,
  RobotArchitect, RobotBuilder, RobotLauncher,
} from '../ui/agent-robots'

// ── Pixel-art SVG robot for Jarvis (not shared — only used here) ─────────────

function RobotJarvis({ size = 56 }: { size?: number }) {
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

// ── Types ───────────────────────────────────────────────────────────────────

interface Agent {
  id: string
  name: string
  role: string
  description: string
  color: string
  free: boolean
  Robot: React.ComponentType<{ size?: number }>
}

const AGENTS: Agent[] = [
  {
    id: 'validator',
    name: 'Validator',
    role: 'Trouver & Valider',
    description: 'Analyse ton idée ou trouve les SaaS qui marchent. Scanne le marché, la concurrence, et retourne un score /100.',
    color: '#22c55e',
    free: true,
    Robot: RobotValidator,
  },
  {
    id: 'planner',
    name: 'Planner',
    role: 'Préparer & Structurer',
    description: 'Transforme ton idée validée en cahier des charges complet : features, parcours user, priorités.',
    color: '#3b82f6',
    free: false,
    Robot: RobotPlanner,
  },
  {
    id: 'designer',
    name: 'Designer',
    role: 'Branding & Identité',
    description: 'Crée ton identité visuelle : palette, typo, design system et maquettes de tes écrans clés.',
    color: '#f43f5e',
    free: false,
    Robot: RobotDesigner,
  },
  {
    id: 'architect',
    name: 'Architect',
    role: 'Architecture technique',
    description: 'Conçoit ta BDD Supabase, ton auth, tes API, ta sécurité. Produit ton CLAUDE.md prêt à builder.',
    color: '#f97316',
    free: false,
    Robot: RobotArchitect,
  },
  {
    id: 'builder',
    name: 'Builder',
    role: 'Construire ton produit',
    description: 'Te guide pour construire avec Claude Code. Génère les prompts optimaux, debug en temps réel.',
    color: '#8b5cf6',
    free: false,
    Robot: RobotBuilder,
  },
  {
    id: 'launcher',
    name: 'Launcher',
    role: 'Déployer & Lancer',
    description: 'Déploie ton app, rédige ta landing, crée tes emails et lance ta première campagne.',
    color: '#14b8a6',
    free: false,
    Robot: RobotLauncher,
  },
]

// ── Modal ───────────────────────────────────────────────────────────────────

function UnlockModal({ agent, onClose, onUnlock }: { agent: Agent; onClose: () => void; onUnlock: () => void }) {
  const { Robot } = agent
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl p-6"
        style={{ background: '#09090b', border: '1px solid rgba(255,255,255,0.08)' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={15} strokeWidth={1.5} />
        </button>

        <div className="mb-4">
          <Robot size={40} />
        </div>

        <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-1" style={{ color: agent.color }}>
          {agent.role}
        </p>
        <h3 className="text-lg font-extrabold text-white mb-2" style={{ letterSpacing: '-0.03em' }}>
          {agent.name}
        </h3>
        <p className="text-sm leading-relaxed mb-6" style={{ color: '#71717a' }}>
          {agent.description}
        </p>

        {/* CTA dark — thin silver border, subtle glow */}
        <button
          onClick={onUnlock}
          className="agents-cta-btn w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all"
          style={{
            background: '#09090b',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 0 18px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          Débloquer les 5 agents — 197€
        </button>
        <p className="text-[10px] text-center mt-2" style={{ color: '#52525b' }}>
          Accès à vie · Validator inclus gratuitement
        </p>
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

interface Props {
  navigate: (hash: string) => void
  hasPack?: boolean
}

export function AgentsPage({ navigate, hasPack = false }: Props) {
  const [lockedModal, setLockedModal] = useState<Agent | null>(null)

  const handleUnlock = () => {
    navigate('#/dashboard/offers')
    setLockedModal(null)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Bot size={20} strokeWidth={1.5} className="text-foreground" />
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              Mes agents IA
            </h1>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(77,150,255,0.15)', color: '#4d96ff', border: '1px solid rgba(77,150,255,0.3)' }}
            >
              BETA
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
            Les agents IA spécialisés de Buildrs. Chacun maîtrise un domaine précis et travaille avec ton contexte projet.
            Coordonnés par Jarvis, ton copilote principal.
          </p>
        </div>

        {/* Jarvis — featured full width */}
        <div
          className="border border-foreground/20 rounded-2xl p-5 mb-6"
          style={{ background: 'hsl(var(--secondary))' }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <RobotJarvis size={44} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="text-sm font-bold text-foreground">Jarvis</p>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}
                >
                  ACTIF
                </span>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(77,150,255,0.15)', color: '#4d96ff', border: '1px solid rgba(77,150,255,0.3)' }}
                >
                  ILLIMITÉ
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">COO IA · Orchestrateur</span>
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">
                Ton copilote principal. Coordonne les agents spécialisés, connaît tout le curriculum Blueprint et te guide étape par étape.
              </p>
              <button
                onClick={() => navigate('#/dashboard/autopilot')}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                style={{ background: 'linear-gradient(135deg, rgba(77,150,255,0.12), rgba(204,93,232,0.12))', color: '#4d96ff', border: '1px solid rgba(77,150,255,0.3)' }}
              >
                <Zap size={11} strokeWidth={1.5} />
                Parler à Jarvis
              </button>
            </div>
          </div>
        </div>

        {/* Agents grid */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground mb-4">
            Agents spécialisés
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AGENTS.map(agent => {
              const unlocked = agent.free || hasPack
              const { Robot } = agent
              return (
                <div
                  key={agent.id}
                  onClick={unlocked ? () => navigate(`#/dashboard/agent/${agent.id}`) : () => setLockedModal(agent)}
                  className={`border border-border rounded-xl p-4 transition-all duration-150 cursor-pointer ${
                    unlocked ? 'hover:border-foreground/30' : 'hover:border-foreground/20'
                  }`}
                  style={{
                    background: 'hsl(var(--card))',
                    opacity: unlocked ? 1 : 0.4,
                    filter: unlocked ? 'none' : 'grayscale(1)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 flex items-start pt-0.5">
                      <Robot size={28} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        {!unlocked && <Lock size={10} strokeWidth={1.5} className="text-muted-foreground/50 flex-shrink-0" />}
                        <p className="text-[12px] font-semibold text-foreground">{agent.name}</p>
                        {unlocked ? (
                          <span
                            className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                            style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}
                          >
                            ACTIF
                          </span>
                        ) : (
                          <span
                            className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                            style={{ background: 'hsl(var(--secondary))', color: 'hsl(var(--muted-foreground))', border: '1px solid hsl(var(--border))' }}
                          >
                            PACK AGENTS
                          </span>
                        )}
                        {agent.id === 'validator' && (
                          <span
                            className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                            style={{ background: 'rgba(77,150,255,0.15)', color: '#4d96ff', border: '1px solid rgba(77,150,255,0.3)' }}
                          >
                            ILLIMITÉ
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground/70 font-medium mb-1.5">{agent.role}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{agent.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA dark — thin silver border, subtle glow */}
        {!hasPack && (
          <div className="mt-6 rounded-2xl px-6 py-6" style={{ background: '#09090b', border: '1px solid rgba(255,255,255,0.10)' }}>
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: '#52525b' }}>
                Pack Agents
              </p>
              <h3 className="text-lg font-extrabold text-white mb-1.5" style={{ letterSpacing: '-0.03em' }}>
                Tu as appris. Maintenant, exécute.
              </h3>
              <p className="text-sm leading-relaxed mb-5 max-w-lg" style={{ color: '#71717a' }}>
                Le Blueprint t'a donné le plan. Les agents font le travail. Débloque tes 5 agents IA spécialisés.
              </p>
              <button
                onClick={handleUnlock}
                className="agents-cta-btn px-5 py-2 rounded-xl text-xs font-bold text-white transition-all"
                style={{
                  background: '#09090b',
                  border: '1px solid rgba(255,255,255,0.18)',
                  boxShadow: '0 0 18px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                Débloquer le Pack Agents — 197€
              </button>
          </div>
        )}

      </div>

      {/* Modal */}
      {lockedModal && (
        <UnlockModal
          agent={lockedModal}
          onClose={() => setLockedModal(null)}
          onUnlock={handleUnlock}
        />
      )}
    </div>
  )
}
