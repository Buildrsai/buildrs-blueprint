import { Bot, Zap, X } from 'lucide-react'

// ── Session key ───────────────────────────────────────────────────────────────

export const SESSION_UPSELL_KEY = 'buildrs_upsell_shown'

export function upsellShownThisSession(): boolean {
  try { return sessionStorage.getItem(SESSION_UPSELL_KEY) === '1' } catch { return false }
}
export function markUpsellShown(): void {
  try { sessionStorage.setItem(SESSION_UPSELL_KEY, '1') } catch { /* ignore */ }
}

// ── Module → Agent mapping ────────────────────────────────────────────────────

const AGENT_MAP: Record<string, {
  agentId: string
  agentName: string
  color: string
  deliverable: string
  isSoft?: boolean
}> = {
  '01': {
    agentId: 'planner', agentName: 'Planner', color: '#3b82f6',
    deliverable: 'structure ta stratégie produit et génère ton cahier des charges complet.',
    isSoft: true,
  },
  '02': {
    agentId: 'planner', agentName: 'Planner + Designer', color: '#3b82f6',
    deliverable: 'génère ta stratégie produit et ton identité visuelle complète en 15 minutes.',
  },
  '03': {
    agentId: 'architect', agentName: 'Architect', color: '#f97316',
    deliverable: 'génère ton CLAUDE.md, ton schéma BDD Supabase et toute l\'architecture de ton app.',
  },
  '04': {
    agentId: 'builder', agentName: 'Builder', color: '#8b5cf6',
    deliverable: 'génère les prompts Claude Code optimaux pour construire ton produit phase par phase.',
  },
  '05': {
    agentId: 'launcher', agentName: 'Launcher', color: '#14b8a6',
    deliverable: 'automatise ton déploiement et génère ta configuration Vercel + emails post-activation.',
  },
  '06': {
    agentId: 'launcher', agentName: 'Launcher', color: '#14b8a6',
    deliverable: 'génère ta landing page, ta séquence emails et ton plan d\'acquisition complet.',
  },
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  moduleId: string
  navigate: (hash: string) => void
  onDismiss: () => void
}

export function PackAgentsUpsellBlock({ moduleId, navigate, onDismiss }: Props) {
  const mapping = AGENT_MAP[moduleId] ?? AGENT_MAP['06']
  const { agentName, color, deliverable, isSoft } = mapping

  const handleUnlock = () => {
    markUpsellShown()
    navigate('#/dashboard/agents')
  }

  return (
    <div
      className="mt-6 rounded-2xl border p-5"
      style={{ background: `${color}08`, borderColor: `${color}25` }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18` }}
        >
          <Bot size={15} strokeWidth={1.5} style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] mb-0.5" style={{ color }}>
            {isSoft ? 'Envie d\'aller plus loin ?' : 'Passe à l\'action'}
          </p>
          <p className="text-sm font-extrabold text-foreground leading-tight" style={{ letterSpacing: '-0.02em' }}>
            {isSoft
              ? `L'agent ${agentName} peut structurer ton projet`
              : `Tu maîtrises ce module. L'agent ${agentName} produit le livrable en 15 min.`
            }
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-muted-foreground/40 hover:text-muted-foreground transition-colors flex-shrink-0 mt-0.5"
        >
          <X size={13} strokeWidth={1.5} />
        </button>
      </div>

      <p className="text-[13px] text-muted-foreground leading-relaxed mb-4 pl-11">
        L'agent {agentName} {deliverable} Débloque-le avec le Pack Agents.
      </p>

      <div className="flex items-center gap-3 pl-11">
        <button
          onClick={handleUnlock}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: color }}
        >
          <Zap size={10} strokeWidth={1.5} />
          Débloquer — 197€
        </button>
        <button
          onClick={onDismiss}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Plus tard
        </button>
      </div>
    </div>
  )
}
