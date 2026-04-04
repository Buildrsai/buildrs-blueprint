import type { AccessContext } from '../hooks/useAccess'

export interface NextAction {
  label: string
  sublabel: string
  hash: string
  priority: number
}

interface NextActionContext {
  globalPercent: number
  milestonesTotal: number
  milestonesDone: number
  hasProject: boolean
  hasPack: boolean
  access: AccessContext | undefined
  claudeUnlocked: boolean
}

export function getNextAction(ctx: NextActionContext): NextAction {
  const { globalPercent, milestonesTotal, milestonesDone, hasProject, hasPack, claudeUnlocked } = ctx

  // No project yet → go create one
  if (!hasProject) {
    return {
      label: 'Definis ton projet',
      sublabel: 'Commence par nommer ton idee et definir ta cible',
      hash: '#/dashboard/project',
      priority: 1,
    }
  }

  // Milestones not started yet
  if (milestonesTotal === 0) {
    return {
      label: 'Configure ton Kanban',
      sublabel: 'Cree tes etapes de construction — 8 milestones en 2 min',
      hash: '#/dashboard/kanban',
      priority: 2,
    }
  }

  // Active milestone in progress
  if (milestonesDone < milestonesTotal) {
    const remaining = milestonesTotal - milestonesDone
    return {
      label: `Avance sur ton projet`,
      sublabel: `${remaining} etape${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''} — ouvre ton Kanban`,
      hash: '#/dashboard/kanban',
      priority: 3,
    }
  }

  // Blueprint not started
  if (globalPercent === 0) {
    return {
      label: 'Demarre ta formation',
      sublabel: 'Module 0 — Comprendre les fondations du vibecoding',
      hash: '#/dashboard/module/00',
      priority: 4,
    }
  }

  // Blueprint in progress
  if (globalPercent < 100) {
    return {
      label: 'Continue ta formation',
      sublabel: `${globalPercent}% complete — reprends là ou tu t'es arrete`,
      hash: '#/dashboard/module/00',
      priority: 5,
    }
  }

  // Claude not unlocked
  if (!claudeUnlocked) {
    return {
      label: 'Debloquer l\'environnement Claude',
      sublabel: 'Claude Code + Skills + MCPs — 47EUR une fois',
      hash: '#/dashboard/products',
      priority: 6,
    }
  }

  // Agents not unlocked
  if (!hasPack) {
    return {
      label: 'Decouvrir les Agents IA',
      sublabel: '5 agents specialises pour accelerer ton build',
      hash: '#/dashboard/agents',
      priority: 7,
    }
  }

  // Everything done — explore ideas
  return {
    label: 'Explorer les idees SaaS',
    sublabel: 'Trouve ton prochain projet dans le marketplace',
    hash: '#/dashboard/marketplace',
    priority: 8,
  }
}
