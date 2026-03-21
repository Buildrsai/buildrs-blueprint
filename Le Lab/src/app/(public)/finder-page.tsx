import { useState } from 'react'
import { Search, Lightbulb, CheckCircle, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { FinderResultCard } from '@/components/finder/finder-result-card'
import { ValidationResultDisplay } from '@/components/finder/validation-result-display'
import { CopyAnalysisDisplay } from '@/components/finder/copy-analysis-display'
import { SignupGate } from '@/components/finder/signup-gate'
import { callClaude } from '@/lib/claude'
import { useAuth } from '@/hooks/use-auth'
import type { FinderMode, FinderResult, ValidationResult, CopyResult } from '@/types/finder'

const MODES: { id: FinderMode; icon: typeof Search; label: string; description: string }[] = [
  {
    id: 'find',
    icon: Lightbulb,
    label: 'Trouve-moi une idée',
    description: 'Donne une niche et je trouve 3 opportunités de SaaS avec score de viabilité.',
  },
  {
    id: 'validate',
    icon: CheckCircle,
    label: 'Valide mon idée',
    description: "Décris ton idée en 2-3 lignes et je l'analyse avec de vraies données marché.",
  },
  {
    id: 'copy',
    icon: Copy,
    label: 'Copie intelligemment',
    description: "Donne le nom d'un SaaS et je génère 3 adaptations niche différenciées.",
  },
]

const PLACEHOLDERS: Record<FinderMode, string> = {
  find: 'Ex: outils pour freelances, productivité para-médicale, SaaS B2B RH…',
  validate: 'Ex: une app pour aider les restaurateurs à gérer leurs réservations et no-shows…',
  copy: 'Ex: Calendly, Notion, Loom, Framer…',
}

const FINDER_COUNT_KEY = 'buildrs_finder_count'

function getFinderCount(): number {
  return parseInt(localStorage.getItem(FINDER_COUNT_KEY) ?? '0', 10)
}

function incrementFinderCount(): void {
  localStorage.setItem(FINDER_COUNT_KEY, String(getFinderCount() + 1))
}

type FinderResults = FinderResult[] | ValidationResult | CopyResult | null

function FinderPage() {
  const { user } = useAuth()
  const [mode, setMode] = useState<FinderMode>('find')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<FinderResults>(null)
  const [showGate, setShowGate] = useState(false)

  const isAnonymous = !user

  const handleModeChange = (newMode: FinderMode) => {
    setMode(newMode)
    setResults(null)
    setError(null)
    setShowGate(false)
  }

  const handleSearch = async () => {
    const trimmed = query.trim()
    if (!trimmed || loading) return

    setLoading(true)
    setError(null)
    setResults(null)
    setShowGate(false)

    try {
      const payload = { input: trimmed }

      if (mode === 'find') {
        const data = await callClaude<FinderResult[]>('finder-find', payload)
        setResults(data)
      } else if (mode === 'validate') {
        const data = await callClaude<ValidationResult>('finder-validate', payload)
        setResults(data)
      } else {
        const data = await callClaude<CopyResult>('finder-copy', payload)
        setResults(data)
      }

      // Rate limiting anonyme : afficher la gate après chaque recherche
      if (isAnonymous) {
        incrementFinderCount()
        setShowGate(true)
      }

      // Scroll vers les résultats
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Réessaie.')
    } finally {
      setLoading(false)
    }
  }

  const renderResults = () => {
    if (!results) return null
    const blurred = isAnonymous

    if (mode === 'find') {
      return (
        <div className="flex flex-col gap-3">
          {(results as FinderResult[]).map((r, i) => (
            <FinderResultCard key={i} result={r} index={i} blurred={blurred} />
          ))}
        </div>
      )
    }

    if (mode === 'validate') {
      return <ValidationResultDisplay result={results as ValidationResult} blurred={blurred} />
    }

    return <CopyAnalysisDisplay result={results as CopyResult} blurred={blurred} />
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-[#F8F9FC] py-16 border-b border-[#E6EAF0]">
        <div className="max-w-[800px] mx-auto px-6 flex flex-col items-center text-center gap-5">
          <Badge variant="neutral">Gratuit · Sans inscription</Badge>
          <h1
            className="text-[#121317]"
            style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 450, letterSpacing: '-0.03em', lineHeight: 1.05 }}
          >
            Buildrs <span className="text-gradient-blue">Finder</span>
          </h1>
          <p className="text-[#45474D] text-lg max-w-lg" style={{ letterSpacing: '-0.01em' }}>
            Trouve, valide ou analyse une idée de SaaS en 30 secondes.
            Données réelles, score de viabilité, recommandations concrètes.
          </p>
        </div>
      </section>

      {/* Interface */}
      <section className="bg-white py-12 flex-1">
        <div className="max-w-[800px] mx-auto px-6 flex flex-col gap-6">
          {/* Sélection du mode */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {MODES.map(({ id, icon: Icon, label, description }) => (
              <button key={id} onClick={() => handleModeChange(id)} className="text-left">
                <Card
                  variant={mode === id ? 'white' : 'light'}
                  padding="md"
                  className={`flex flex-col gap-3 cursor-pointer transition-all duration-150 ${
                    mode === id ? 'border-[#3279F9] ring-1 ring-[#3279F9]/20' : ''
                  }`}
                >
                  <Icon
                    size={17}
                    strokeWidth={1.5}
                    className={mode === id ? 'text-[#3279F9]' : 'text-[#B2BBC5]'}
                  />
                  <div>
                    <p className={`text-sm font-medium ${mode === id ? 'text-[#121317]' : 'text-[#45474D]'}`}>
                      {label}
                    </p>
                    <p className="text-xs text-[#B2BBC5] leading-relaxed mt-1">{description}</p>
                  </div>
                </Card>
              </button>
            ))}
          </div>

          {/* Input + bouton */}
          <Card variant="white" padding="lg" className="flex flex-col gap-4">
            <Input
              mode="light"
              placeholder={PLACEHOLDERS[mode]}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              leftIcon={<Search size={15} />}
            />
            {error && (
              <p className="text-sm text-[#EF4444]">{error}</p>
            )}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onClick={handleSearch}
              disabled={!query.trim()}
            >
              {loading ? 'Analyse en cours…' : 'Analyser →'}
            </Button>
          </Card>

          {/* Résultats */}
          <div id="results">
            {renderResults()}
            {showGate && <SignupGate onClose={() => setShowGate(false)} />}
          </div>
        </div>
      </section>
    </div>
  )
}

export { FinderPage }
