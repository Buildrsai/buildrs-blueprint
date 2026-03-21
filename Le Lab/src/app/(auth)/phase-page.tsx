import { useState, useRef } from 'react'
import { useParams, Link } from 'react-router'
import { RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PHASE_NAMES } from '@/lib/utils'
import { useProjectContext } from '@/contexts/project-context'
import { supabase } from '@/lib/supabase'

const PHASE_ICONS = ['💡', '🏗️', '🎨', '🔧', '⚙️', '🔨', '🚀', '📣']

function PhasePage() {
  const { id, phase } = useParams<{ id: string; phase: string }>()
  const phaseNumber = parseInt(phase ?? '1', 10)
  const phaseName = PHASE_NAMES[phaseNumber] ?? 'Phase inconnue'

  const { phases, refetch } = useProjectContext()
  const existingPhase = phases.find(p => p.phase_number === phaseNumber)
  const existingText = (existingPhase?.generated_content?.text as string) ?? null

  const [streaming, setStreaming] = useState(false)
  const [content, setContent] = useState<string | null>(existingText)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const handleGenerate = async () => {
    if (!id) return
    setStreaming(true)
    setContent('')
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

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setContent(accumulated)
      }

      // Rafraîchir le context pour mettre à jour les phases dans la sidebar
      refetch()
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message)
      }
    } finally {
      setStreaming(false)
    }
  }

  const isCompleted = existingPhase?.status === 'completed'

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

      {/* Zone contenu */}
      <Card variant="white" padding="lg" className="flex flex-col gap-5">
        {!content && !streaming && (
          <div className="flex flex-col gap-1.5">
            <h2 className="text-sm font-medium text-[#121317]">Prêt à commencer ?</h2>
            <p className="text-sm text-[#45474D] leading-relaxed">
              Le Lab va analyser ton projet avec de vraies données marché et générer
              un rapport de validation complet avec un score /100.
              La génération prend environ 30 secondes.
            </p>
          </div>
        )}

        {/* Contenu streamé ou existant */}
        {(content !== null || streaming) && (
          <div
            className="rounded-xl border border-[#E6EAF0] bg-[#F8F9FC] p-6 min-h-[200px]
              text-sm text-[#121317] leading-relaxed whitespace-pre-wrap"
            style={{ fontFamily: 'var(--font-mono, monospace)' }}
          >
            {content || ''}
            {streaming && (
              <span className="inline-block w-1.5 h-4 bg-[#3279F9] ml-0.5 animate-pulse align-middle" />
            )}
          </div>
        )}

        {error && (
          <p className="text-sm text-[#EF4444]">{error}</p>
        )}

        <div className="flex items-center gap-3">
          {!content && !streaming && (
            <Button variant="primary" size="md" onClick={handleGenerate} className="gap-2">
              Générer avec le Lab →
            </Button>
          )}
          {content && !streaming && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGenerate}
              className="gap-1.5"
            >
              <RefreshCw size={13} />
              Regénérer
            </Button>
          )}
          {streaming && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => abortRef.current?.abort()}
              className="text-[#EF4444]"
            >
              Arrêter
            </Button>
          )}
        </div>
      </Card>

      {/* Navigation phases */}
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
