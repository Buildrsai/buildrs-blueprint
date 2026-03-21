import { Link } from 'react-router'
import { Plus, ArrowRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ProgressPhases } from '@/components/ui/progress-phases'
import { ScoreBadge } from '@/components/ui/score-badge'
import { PHASE_NAMES } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

const DEMO_PROJECTS = [
  {
    id: '1',
    name: 'TaskFlow Pro',
    description: 'Outil de gestion de tâches pour freelances',
    current_phase: 3,
    completed_phases: [1, 2],
    score: 82,
    updated_at: 'Il y a 2 heures',
  },
  {
    id: '2',
    name: 'MediSync',
    description: 'Agenda intelligent pour para-médicaux',
    current_phase: 1,
    completed_phases: [],
    score: 71,
    updated_at: 'Hier',
  },
]

function DashboardPage() {
  const { user } = useAuth()
  const rawName = user?.email?.split('@')[0] ?? 'toi'
  const firstName = rawName.charAt(0).toUpperCase() + rawName.slice(1)

  return (
    <div className="max-w-[960px] mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-[#121317]"
            style={{ fontSize: '1.4rem', fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            Bonjour, {firstName} 👋
          </h1>
          <p className="text-sm text-[#45474D] mt-1">
            {DEMO_PROJECTS.length} projet{DEMO_PROJECTS.length > 1 ? 's' : ''} en cours
          </p>
        </div>
        <Link to="/project/new">
          <Button variant="primary" size="sm" className="gap-1.5">
            <Plus size={14} />
            Nouveau
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {DEMO_PROJECTS.map((project) => (
          <Link key={project.id} to={`/project/${project.id}`}>
            <Card variant="white" padding="lg" hover className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h2
                      className="text-[#121317] truncate"
                      style={{ fontSize: '0.95rem', fontWeight: 500, letterSpacing: '-0.01em' }}
                    >
                      {project.name}
                    </h2>
                    {project.score > 0 && <ScoreBadge score={project.score} size="sm" />}
                  </div>
                  <p className="text-sm text-[#45474D] truncate">{project.description}</p>
                </div>
                <ArrowRight size={15} className="text-[#B2BBC5] flex-shrink-0 mt-0.5" />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#B2BBC5]">
                    Phase {project.current_phase} — {PHASE_NAMES[project.current_phase]}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#B2BBC5]">
                    <Clock size={11} />
                    {project.updated_at}
                  </div>
                </div>
                <ProgressPhases
                  currentPhase={project.current_phase}
                  completedPhases={project.completed_phases}
                />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {DEMO_PROJECTS.length === 0 && (
        <Card variant="white" padding="lg" className="flex flex-col items-center gap-4 text-center py-16">
          <p className="text-4xl">💡</p>
          <div>
            <h2
              className="text-[#121317]"
              style={{ fontWeight: 500, letterSpacing: '-0.01em' }}
            >
              Aucun projet pour l'instant
            </h2>
            <p className="text-sm text-[#45474D] mt-1">
              Crée ton premier projet et commence le Lab.
            </p>
          </div>
          <Link to="/project/new">
            <Button variant="primary">Créer mon premier projet →</Button>
          </Link>
        </Card>
      )}
    </div>
  )
}

export { DashboardPage }
