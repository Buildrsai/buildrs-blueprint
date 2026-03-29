import { useState, useRef, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { RefreshCw, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PHASE_NAMES } from '@/lib/utils'
import { useProjectContext } from '@/contexts/project-context'
import { supabase } from '@/lib/supabase'
import { GenerationLoader } from '@/components/lab/generation-loader'
import { ValidationResults } from '@/components/lab/validation-results'
import type { ValidationData } from '@/components/lab/validation-results'
import { Phase2Structure } from '@/components/lab/phase-2-structure'
import type { StructureData } from '@/components/lab/phase-2-structure'

const PHASE_ICONS = ['💡', '🏗️', '🎨', '🔧', '⚙️', '🔨', '🚀', '📣']

function PhasePage() {
  const { id, phase } = useParams<{ id: string; phase: string }>()
  const navigate = useNavigate()
  const phaseNumber = parseInt(phase ?? '1', 10)
  const phaseName = PHASE_NAMES[phaseNumber] ?? 'Phase inconnue'

  const { project, phases, refetch } = useProjectContext()
  const existingPhase = phases.find(p => p.phase_number === phaseNumber)

  // Extraire les données structurées si elles existent
  const existingData = existingPhase?.generated_content as ValidationData | null
  const hasStructuredData = existingData?.scores !== undefined

  const [generating, setGenerating] = useState(false)
  const [progressStep, setProgressStep] = useState<string | null>(null)
  const [validationData, setValidationData] = useState<ValidationData | null>(
    hasStructuredData ? existingData : null
  )
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Synchroniser quand le phaseNumber change (navigation entre phases)
  useEffect(() => {
    const phase = phases.find(p => p.phase_number === phaseNumber)
    const data = phase?.generated_content as ValidationData | null
    if (data?.scores) {
      setValidationData(data)
    } else {
      setValidationData(null)
    }
    setError(null)
  }, [phaseNumber, phases])

  const handleGenerate = async () => {
    if (!id) return
    setGenerating(true)
    setProgressStep(null)
    setValidationData(null)
    setError(null)

    abortRef.current = new AbortController()

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Non authentifié')

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-phase`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ projectId: id, phaseNumber }),
          signal: abortRef.current.signal,
        }
      )

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error ?? 'Erreur serveur')
      }

      // Lire le stream ligne par ligne (NDJSON)
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        // Parser les lignes complètes
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const msg = JSON.parse(line)
            if (msg.type === 'progress') {
              setProgressStep(msg.step)
            } else if (msg.type === 'result') {
              setValidationData(msg.data)
            } else if (msg.type === 'error') {
              throw new Error(msg.message)
            }
          } catch {
            // Ignorer les lignes non-JSON (keepalive etc.)
          }
        }
      }

      // Rafraîchir le context pour mettre à jour la sidebar
      refetch()
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message)
      }
    } finally {
      setGenerating(false)
      setProgressStep(null)
    }
  }

  const isCompleted = existingPhase?.status === 'completed'

  // --- PHASE 1 : Validation structurée ---
  if (phaseNumber === 1) {
    return (
      <div className="max-w-[760px] mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <span className="text-3xl">{PHASE_ICONS[0]}</span>
          <div>
            <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#B2BBC5]">
              Phase 1
            </p>
            <h1
              className="text-[#121317]"
              style={{ fontSize: '1.4rem', fontWeight: 500, letterSpacing: '-0.02em' }}
            >
              {phaseName}
            </h1>
          </div>
          {isCompleted && (
            <Badge variant="success" className="ml-auto">✓ Complété</Badge>
          )}
        </div>

        {/* État : Pas encore généré */}
        {!validationData && !generating && (
          <Card variant="white" padding="lg" className="flex flex-col items-center gap-6 py-12">
            <div className="w-16 h-16 rounded-full bg-[#3279F9]/8 flex items-center justify-center">
              <span className="text-3xl">💡</span>
            </div>
            <div className="text-center flex flex-col gap-2 max-w-[400px]">
              <h2 className="text-base font-medium text-[#121317]">
                Valide ton idée avec de vraies données
              </h2>
              <p className="text-sm text-[#45474D] leading-relaxed">
                Le Lab va rechercher des données marché réelles, identifier tes concurrents,
                et calculer un score de viabilité /100 pour ton projet.
              </p>
            </div>
            <Button variant="primary" size="md" onClick={handleGenerate} className="gap-2">
              Lancer la validation →
            </Button>
          </Card>
        )}

        {/* État : En cours de génération */}
        {generating && (
          <GenerationLoader
            currentStep={progressStep}
            onCancel={() => abortRef.current?.abort()}
          />
        )}

        {/* État : Résultats */}
        {validationData && !generating && (
          <>
            <ValidationResults data={validationData} />

            {/* Actions */}
            <Card variant="white" padding="md" className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerate}
                className="gap-1.5 text-[#45474D]"
              >
                <RefreshCw size={13} />
                Relancer la validation
              </Button>
              <Link to={`/project/${id}/phase/2`}>
                <Button variant="primary" size="md" className="gap-2">
                  Passer à la Phase 2
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </Card>
          </>
        )}

        {/* Erreur */}
        {error && (
          <Card variant="white" padding="md" className="flex flex-col gap-3">
            <p className="text-sm text-[#EF4444]">{error}</p>
            <Button variant="secondary" size="sm" onClick={handleGenerate}>
              Réessayer
            </Button>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E6EAF0]">
          <Link to={`/project/${id}`} className="text-xs text-[#B2BBC5] hover:text-[#45474D] transition-colors">
            ← Retour au projet
          </Link>
        </div>
      </div>
    )
  }

  // --- PHASE 2 : Structure Produit ---
  if (phaseNumber === 2) {
    const structureData = (project?.structure_data ?? null) as StructureData | null

    return (
      <div className="max-w-[760px] mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <span className="text-3xl">{PHASE_ICONS[1]}</span>
          <div>
            <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#B2BBC5]">
              Phase 2
            </p>
            <h1
              className="text-[#121317]"
              style={{ fontSize: '1.4rem', fontWeight: 500, letterSpacing: '-0.02em' }}
            >
              {phaseName}
            </h1>
          </div>
          {isCompleted && (
            <Badge variant="success" className="ml-auto">✓ Complété</Badge>
          )}
        </div>

        {/* Composant Phase 2 */}
        <Phase2Structure
          projectId={id!}
          structureData={structureData}
          onRefetch={refetch}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E6EAF0]">
          <Link to={`/project/${id}`} className="text-xs text-[#B2BBC5] hover:text-[#45474D] transition-colors">
            ← Retour au projet
          </Link>
          <Link to={`/project/${id}/phase/1`}>
            <Button variant="ghost" size="sm" className="text-[#45474D]">
              ← Phase 1
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // --- PHASES 3-8 : Affichage générique (à construire phase par phase) ---
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
        <Badge variant={isCompleted ? 'success' : 'accent'} className="ml-auto">
          {isCompleted ? '✓ Complété' : 'En cours'}
        </Badge>
      </div>

      {/* Placeholder — phase pas encore construite */}
      <Card variant="white" padding="lg" className="flex flex-col items-center gap-4 py-12">
        <span className="text-4xl opacity-30">🚧</span>
        <div className="text-center">
          <h2 className="text-base font-medium text-[#121317]">{phaseName}</h2>
          <p className="text-sm text-[#45474D] mt-1">
            Cette phase sera disponible prochainement.
          </p>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E6EAF0]">
        <Link to={`/project/${id}`} className="text-xs text-[#B2BBC5] hover:text-[#45474D] transition-colors">
          ← Retour au projet
        </Link>
        <div className="flex gap-3">
          {phaseNumber > 1 && (
            <Link to={`/project/${id}/phase/${phaseNumber - 1}`}>
              <Button variant="ghost" size="sm" className="text-[#45474D]">
                ← Précédente
              </Button>
            </Link>
          )}
          {phaseNumber < 8 && isCompleted && (
            <Link to={`/project/${id}/phase/${phaseNumber + 1}`}>
              <Button variant="secondary" size="sm">
                Suivante →
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export { PhasePage }
