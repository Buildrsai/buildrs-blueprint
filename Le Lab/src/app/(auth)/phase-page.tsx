import { useParams } from 'react-router'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PHASE_NAMES } from '@/lib/utils'

const PHASE_ICONS = ['💡', '🏗️', '🎨', '🔧', '⚙️', '🔨', '🚀', '📣']

function PhasePage() {
  const { id, phase } = useParams<{ id: string; phase: string }>()
  const phaseNumber = parseInt(phase ?? '1', 10)
  const phaseName = PHASE_NAMES[phaseNumber] ?? 'Phase inconnue'

  return (
    <div className="max-w-[760px] mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <span className="text-3xl">{PHASE_ICONS[phaseNumber - 1]}</span>
        <div>
          <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#B2BBC5]">
            Phase {phaseNumber}
          </p>
          <h1
            className="text-[#121317]"
            style={{ fontSize: '1.4rem', fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            {phaseName}
          </h1>
        </div>
        <Badge variant="accent" className="ml-auto">En cours</Badge>
      </div>

      {/* Zone génération IA */}
      <Card variant="white" padding="lg" className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-sm font-medium text-[#121317]">Prêt à commencer ?</h2>
          <p className="text-sm text-[#45474D] leading-relaxed">
            Le Lab va analyser ton projet et générer un contenu personnalisé
            pour cette phase. La génération prend environ 30 secondes.
          </p>
        </div>

        {/* Placeholder zone streaming IA */}
        <div className="rounded-xl border border-[#E6EAF0] bg-[#F8F9FC] p-6 min-h-[200px]
          flex items-center justify-center">
          <p className="text-sm text-[#B2BBC5]">
            Génération IA — Phase {phaseNumber} à connecter
          </p>
        </div>

        <Button variant="primary" size="md" className="self-start gap-2">
          Générer avec le Lab →
        </Button>
      </Card>

      {/* Navigation phases */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E6EAF0]">
        <span className="text-xs text-[#B2BBC5]">Projet #{id}</span>
        <div className="flex gap-3">
          {phaseNumber > 1 && (
            <Button variant="ghost" size="sm" className="text-[#45474D]">
              ← Précédente
            </Button>
          )}
          {phaseNumber < 8 && (
            <Button variant="secondary" size="sm">
              Suivante →
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export { PhasePage }
