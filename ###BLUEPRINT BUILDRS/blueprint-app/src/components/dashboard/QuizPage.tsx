import { useState } from 'react'
import { Check, X, ChevronRight, RotateCcw, ArrowLeft } from 'lucide-react'
import { getModule } from '../../data/curriculum'

interface Props {
  moduleId: string
  navigate: (hash: string) => void
  /** Kept in Props so DashboardSection keeps passing it; legacy AgentHandoffBlock
   *  was removed (archived 2026-04-17). Reusable once a new upsell block ships. */
  hasPack?: boolean
  module01Complete?: boolean
}

type Phase = 'intro' | 'quiz' | 'results'

export function QuizPage({ moduleId, navigate, hasPack: _hasPack = false, module01Complete: _module01Complete = false }: Props) {
  const mod = getModule(moduleId)
  const [phase, setPhase] = useState<Phase>('intro')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  if (!mod || !mod.quizQuestions || mod.quizQuestions.length === 0) {
    return (
      <div className="p-7 text-sm text-muted-foreground">
        Pas de quiz pour ce module.
      </div>
    )
  }

  const questions = mod.quizQuestions
  const total = questions.length
  const q = questions[current]

  const handleSelect = (idx: number) => {
    if (confirmed) return
    setSelected(idx)
  }

  const handleConfirm = () => {
    if (selected === null) return
    setConfirmed(true)
  }

  const handleNext = () => {
    const newAnswers = [...answers, selected]
    setAnswers(newAnswers)
    if (current + 1 < total) {
      setCurrent(current + 1)
      setSelected(null)
      setConfirmed(false)
    } else {
      setPhase('results')
    }
  }

  const handleRetry = () => {
    setPhase('quiz')
    setCurrent(0)
    setAnswers([])
    setSelected(null)
    setConfirmed(false)
  }

  const score = answers.filter((a, i) => a === questions[i]?.correctIndex).length

  // Intro screen
  if (phase === 'intro') {
    return (
      <div className="p-7 max-w-xl">
        <button
          onClick={() => navigate(`#/dashboard/module/${moduleId}`)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft size={12} strokeWidth={1.5} /> Retour au module
        </button>

        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#cc5de8' }}>
            Quiz — Module {moduleId}
          </p>
          <h1 className="text-2xl font-extrabold text-foreground mb-2" style={{ letterSpacing: '-0.03em' }}>
            Valide tes connaissances
          </h1>
          <p className="text-sm text-muted-foreground">
            {total} question{total > 1 ? 's' : ''} pour confirmer que tu as bien assimilé {mod.title}.
          </p>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-3 gap-3 mb-7">
          {[
            { label: 'Questions', value: String(total) },
            { label: 'Format', value: 'QCM' },
            { label: 'Durée', value: `~${total * 1} min` },
          ].map(item => (
            <div
              key={item.label}
              className="rounded-xl p-3 text-center border border-border"
              style={{ background: 'hsl(var(--secondary))' }}
            >
              <p className="text-lg font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
                {item.value}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setPhase('quiz')}
          className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: '#cc5de8' }}
        >
          Commencer le quiz →
        </button>
      </div>
    )
  }

  // Results screen
  if (phase === 'results') {
    const pct = Math.round((score / total) * 100)
    const passed = pct >= 70

    return (
      <div className="p-7 max-w-xl">
        <div className="mb-6">
          {/* Score circle */}
          <div className="flex items-center gap-5 mb-5">
            <div
              className="w-20 h-20 rounded-full flex flex-col items-center justify-center flex-shrink-0 border-2"
              style={{
                borderColor: passed ? '#22c55e' : '#ef4444',
                background: passed ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
              }}
            >
              <span
                className="text-2xl font-extrabold"
                style={{ color: passed ? '#22c55e' : '#ef4444', letterSpacing: '-0.04em' }}
              >
                {pct}%
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                {score}/{total}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-foreground mb-1" style={{ letterSpacing: '-0.03em' }}>
                {passed ? 'Bien joué !' : 'Presque !'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {passed
                  ? `Tu maîtrises ${mod.title}. Continue sur ta lancée.`
                  : 'Relis le module et retente le quiz — tu vas y arriver.'}
              </p>
            </div>
          </div>

          {/* Answer review */}
          <div className="flex flex-col gap-2 mb-6">
            {questions.map((question, i) => {
              const correct = answers[i] === question.correctIndex
              return (
                <div
                  key={question.id}
                  className="rounded-xl p-3.5 border"
                  style={{
                    borderColor: correct ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
                    background: correct ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)',
                  }}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: correct ? '#22c55e' : '#ef4444' }}
                    >
                      {correct
                        ? <Check size={10} strokeWidth={3} color="white" />
                        : <X size={10} strokeWidth={3} color="white" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground mb-1">{question.question}</p>
                      {!correct && (
                        <p className="text-[11px] text-muted-foreground">
                          Bonne réponse : <span className="font-semibold text-foreground">
                            {question.options[question.correctIndex]}
                          </span>
                        </p>
                      )}
                      <p className="text-[11px] mt-1" style={{ color: '#cc5de8' }}>
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleRetry}
              className="flex items-center gap-1.5 border border-border rounded-xl px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              <RotateCcw size={12} strokeWidth={1.5} /> Réessayer
            </button>
            <button
              onClick={() => navigate(`#/dashboard/module/${moduleId}`)}
              className="flex-1 bg-foreground text-background rounded-xl py-2.5 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Retour au module →
            </button>
          </div>

          {/* Legacy AgentHandoffBlock removed 2026-04-17 (Phase 0 cleanup — archived
              with the 6-agents system). A new upsell block will be plugged here
              in Phase 4 once the refactored Pack Agents (7 agents) ships. */}
        </div>
      </div>
    )
  }

  // Quiz screen
  const isCorrect = selected === q.correctIndex
  const progress = ((current) / total) * 100

  return (
    <div className="p-7 max-w-xl">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-1 rounded-full" style={{ background: 'hsl(var(--border))' }}>
          <div
            className="h-1 rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: '#cc5de8' }}
          />
        </div>
        <span className="text-[11px] font-bold text-muted-foreground">
          {current + 1}/{total}
        </span>
      </div>

      {/* Question */}
      <h2 className="text-lg font-extrabold text-foreground mb-5" style={{ letterSpacing: '-0.03em' }}>
        {q.question}
      </h2>

      {/* Options */}
      <div className="flex flex-col gap-2.5 mb-5">
        {q.options.map((option, idx) => {
          let borderColor = 'hsl(var(--border))'
          let bg = 'transparent'
          let textColor = 'hsl(var(--foreground))'

          if (confirmed) {
            if (idx === q.correctIndex) {
              borderColor = '#22c55e'
              bg = 'rgba(34,197,94,0.08)'
              textColor = '#22c55e'
            } else if (idx === selected && idx !== q.correctIndex) {
              borderColor = '#ef4444'
              bg = 'rgba(239,68,68,0.08)'
              textColor = '#ef4444'
            }
          } else if (idx === selected) {
            borderColor = '#cc5de8'
            bg = 'rgba(204,93,232,0.08)'
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className="flex items-center gap-3 w-full text-left rounded-xl border px-4 py-3 text-sm transition-all duration-150"
              style={{
                borderColor,
                background: bg,
                color: textColor,
                cursor: confirmed ? 'default' : 'pointer',
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold border"
                style={{
                  borderColor,
                  color: confirmed && idx === q.correctIndex ? '#22c55e'
                    : confirmed && idx === selected && idx !== q.correctIndex ? '#ef4444'
                    : idx === selected ? '#cc5de8'
                    : 'hsl(var(--muted-foreground))',
                }}
              >
                {String.fromCharCode(65 + idx)}
              </div>
              {option}
              {confirmed && idx === q.correctIndex && (
                <Check size={13} strokeWidth={2.5} className="ml-auto flex-shrink-0" style={{ color: '#22c55e' }} />
              )}
              {confirmed && idx === selected && idx !== q.correctIndex && (
                <X size={13} strokeWidth={2.5} className="ml-auto flex-shrink-0" style={{ color: '#ef4444' }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {confirmed && (
        <div
          className="rounded-xl p-3.5 mb-5 text-xs"
          style={{
            background: isCorrect ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
            borderLeft: `3px solid ${isCorrect ? '#22c55e' : '#ef4444'}`,
          }}
        >
          <p className="font-semibold mb-0.5" style={{ color: isCorrect ? '#22c55e' : '#ef4444' }}>
            {isCorrect ? 'Correct !' : 'Pas tout à fait.'}
          </p>
          <p className="text-muted-foreground leading-relaxed">{q.explanation}</p>
        </div>
      )}

      {/* Action button */}
      {!confirmed ? (
        <button
          onClick={handleConfirm}
          disabled={selected === null}
          className="w-full bg-foreground text-background rounded-xl py-2.5 text-xs font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          Valider ma réponse
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="w-full rounded-xl py-2.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
          style={{ background: '#cc5de8' }}
        >
          {current + 1 < total ? (
            <>Question suivante <ChevronRight size={13} strokeWidth={2} /></>
          ) : (
            <>Voir mes résultats <ChevronRight size={13} strokeWidth={2} /></>
          )}
        </button>
      )}
    </div>
  )
}
