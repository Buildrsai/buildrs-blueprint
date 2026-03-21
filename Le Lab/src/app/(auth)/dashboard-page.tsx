import { Link } from 'react-router'
import { Plus, ArrowRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ProgressPhases } from '@/components/ui/progress-phases'
import { ScoreBadge } from '@/components/ui/score-badge'
import { PHASE_NAMES } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { useProjects } from '@/hooks/use-projects'
import type { PhaseInfo } from '@/hooks/use-projects'

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return "À l'instant"
  if (h < 24) return `Il y a ${h}h`
  const d = Math.floor(h / 24)
  if (d === 1) return 'Hier'
  return `Il y a ${d} jours`
}

function getScore(phases: PhaseInfo[]): number {
  const phase1 = phases.find(p => p.phase_number === 1 && p.status === 'completed')
  return (phase1?.generated_content?.score as number) ?? 0
}

function DashboardPage() {
  const { user } = useAuth()
  const { projects, loading, error } = useProjects()

  const rawName = user?.email?.split('@')[0] ?? 'toi'
  const firstName = rawName.charAt(0).toUpperCase() + rawName.slice(1)

  if (loading) {
    return (
      <div className="max-w-[960px] mx-auto flex flex-col gap-8">
        <div className="h-10 w-48 bg-[#F0F1F5] rounded-xl animate-pulse" />
        <div className="flex flex-col gap-3">
          {[1, 2].map(i => (
            <div key={i} className="h-32 bg-[#F0F1F5] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-[960px] mx-auto">
        <p className="text-sm text-[#EF4444]">Erreur : {error}</p>
      </div>
    )
  }

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
            {projects.length} projet{projects.length > 1 ? 's' : ''} en cours
          </p>
        </div>
        <Link to="/project/new">
          <Button variant="primary" size="sm" className="gap-1.5">
            <Plus size={14} />
            Nouveau
          </Button>
        </Link>
      </div>

      {projects.length > 0 && (
        <div className="flex flex-col gap-3">
          {projects.map((project) => {
            const completedPhases = project.project_phases
              .filter(p => p.status === 'completed')
              .map(p => p.phase_number)
            const score = getScore(project.project_phases)

            return (
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
                        {score > 0 && <ScoreBadge score={score} size="sm" />}
                      </div>
                      <p className="text-sm text-[#45474D] truncate">
                        {project.description ?? project.idea_data?.niche ?? '—'}
                      </p>
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
                        {relativeTime(project.updated_at)}
                      </div>
                    </div>
                    <ProgressPhases
                      currentPhase={project.current_phase}
                      completedPhases={completedPhases}
                    />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}

      {projects.length === 0 && (
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
