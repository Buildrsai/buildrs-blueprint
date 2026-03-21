import { useParams, Link } from 'react-router'
import { ArrowRight, Lock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScoreBadge } from '@/components/ui/score-badge'
import { ProgressPhases } from '@/components/ui/progress-phases'
import { PHASE_NAMES } from '@/lib/utils'
import { cn } from '@/lib/utils'

const PHASE_ICONS = ['💡', '🏗️', '🎨', '🔧', '⚙️', '🔨', '🚀', '📣']
const PHASE_DESCRIPTIONS = [
  'Valide ton idée avec de vraies données marché et un score /100.',
  'Structure ton produit : pages, features MVP, modèle de données, monétisation.',
  'Génère ton branding complet : nom, couleurs, typo, style visuel.',
  'Crée ton kit Claude Code : CLAUDE.md, .mcp.json, Skills, prompts.',
  "Guide d'installation pas-à-pas : Node.js, Claude Code, Skills, MCP.",
  'Séquence de prompts testés à copier dans Claude Code.',
  'Déploie sur Vercel, configure Stripe, connecte ton domaine.',
  'Checklist de lancement, templates Product Hunt, Reddit, LinkedIn.',
]

const DEMO_PROJECT = {
  id: '1',
  name: 'TaskFlow Pro',
  description: 'Outil de gestion de tâches pour freelances',
  current_phase: 3,
  completed_phases: [1, 2],
  score: 82,
}

function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const project = DEMO_PROJECT

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#45474D]">Projet introuvable.</p>
      </div>
    )
  }

  return (
    <div className="max-w-[860px] mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <h1
            className="text-[#121317]"
            style={{ fontSize: '1.4rem', fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            {project.name}
          </h1>
          {project.score > 0 && <ScoreBadge score={project.score} />}
        </div>
        <p className="text-sm text-[#45474D]">{project.description}</p>
        <ProgressPhases
          currentPhase={project.current_phase}
          completedPhases={project.completed_phases}
          showLabels
        />
      </div>

      {/* Grille 8 phases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((phase) => {
          const isCompleted = project.completed_phases.includes(phase)
          const isCurrent = phase === project.current_phase
          const isLocked = phase > project.current_phase && !isCompleted

          return (
            <Link
              key={phase}
              to={isLocked ? '#' : `/project/${id}/phase/${phase}`}
              className={cn(isLocked && 'cursor-not-allowed pointer-events-none')}
            >
              <Card
                variant="white"
                padding="md"
                hover={!isLocked}
                className={cn(
                  'flex gap-4 h-full',
                  isCurrent && 'border-[#3279F9] shadow-[0_0_0_1px_#3279F9,0_0_16px_rgba(50,121,249,0.12)]'
                )}
              >
                <span className={cn('text-xl flex-shrink-0 mt-0.5', isLocked && 'opacity-25')}>
                  {PHASE_ICONS[phase - 1]}
                </span>

                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-[#B2BBC5] font-medium">Phase {phase}</span>
                    {isCompleted && <Badge variant="success">✓</Badge>}
                    {isCurrent && <Badge variant="accent">En cours</Badge>}
                    {isLocked && <Lock size={10} className="text-[#B2BBC5]" />}
                  </div>

                  <p className={cn(
                    'text-sm font-medium leading-tight',
                    isLocked ? 'text-[#B2BBC5]' : 'text-[#121317]'
                  )}>
                    {PHASE_NAMES[phase]}
                  </p>

                  <p className={cn(
                    'text-xs leading-relaxed',
                    isLocked ? 'text-[#E6EAF0]' : 'text-[#45474D]'
                  )}>
                    {PHASE_DESCRIPTIONS[phase - 1]}
                  </p>

                  {!isLocked && (
                    <div className="flex items-center gap-1 mt-1 text-[#3279F9] text-xs">
                      {isCurrent ? 'Continuer' : 'Revoir'}
                      <ArrowRight size={11} />
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export { ProjectPage }
