import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { OnboardingStep } from '@/components/onboarding/onboarding-step'
import { WelcomeScreen } from '@/components/onboarding/welcome-screen'
import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/use-profile'

const QUESTIONS = [
  {
    key: 'profil',
    question: 'Comment tu te définirais ?',
    options: [
      'Entrepreneur / freelance',
      'Salarié qui veut lancer un side-project',
      'Étudiant / en reconversion',
      'Créateur de contenu / coach',
    ] as const,
    hasOther: true,
  },
  {
    key: 'objectif',
    question: "Qu'est-ce que tu veux accomplir avec le Lab ?",
    options: [
      'Créer mon premier SaaS / app',
      "Transformer une idée que j'ai déjà en produit",
      'Apprendre le VibeCoding et Claude Code',
      'Générer un revenu récurrent (MRR)',
    ] as const,
  },
  {
    key: 'niveau',
    question: 'Quel est ton rapport avec le code ?',
    options: [
      "Je n'ai jamais codé de ma vie",
      "J'ai fait un peu de HTML/CSS ou WordPress",
      'Je connais les bases (un peu de JS ou Python)',
      'Je suis développeur',
    ] as const,
  },
  {
    key: 'budget',
    question: 'Quel budget mensuel tu peux consacrer aux outils ?',
    options: [
      "0-20€ (juste l'abo Claude Pro)",
      '20-50€',
      '50-100€',
      '100€+',
    ] as const,
  },
  {
    key: 'idee',
    question: 'Tu as déjà une idée de produit ?',
    options: [
      "Oui, j'ai une idée précise",
      "J'ai quelques pistes mais rien de clair",
      "Non, je pars de zéro — aide-moi à trouver",
    ] as const,
  },
  {
    key: 'revenu',
    question: 'Combien tu voudrais générer par mois avec ton SaaS ?',
    options: [
      '500-1 000€ (revenu complémentaire)',
      '1 000-3 000€ (revenu significatif)',
      '3 000-10 000€ (revenu principal)',
      '10 000€+ (business à scale)',
    ] as const,
  },
  {
    key: 'temps',
    question: "Combien d'heures par semaine tu peux consacrer au Lab ?",
    options: [
      '2-5h (side-project)',
      '5-10h (engagement sérieux)',
      '10-20h (full focus)',
      '20h+ (temps plein)',
    ] as const,
  },
]

function OnboardingPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { completeOnboarding } = useProfile()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Rediriger vers /login si non connecté
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, authLoading, navigate])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC]">
        <div className="w-5 h-5 rounded-full border-2 border-[#3279F9] border-t-transparent animate-spin" />
      </div>
    )
  }

  const isWelcome = step === QUESTIONS.length
  const currentQ = QUESTIONS[step < QUESTIONS.length ? step : 0]

  const handleAnswer = (key: string, val: string) => {
    setAnswers(prev => ({ ...prev, [key]: val }))
  }

  const handleComplete = async () => {
    setSaving(true)
    setSaveError(null)
    const { error } = await completeOnboarding(answers)
    setSaving(false)
    if (error) {
      setSaveError("Une erreur s'est produite. Réessaie.")
      return
    }
    navigate('/dashboard', { replace: true })
  }

  const progressPct = isWelcome ? 100 : ((step + 1) / QUESTIONS.length) * 100

  const header = (
    <div className="h-14 flex items-center px-6 border-b border-[#E6EAF0] bg-white flex-shrink-0">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-[#121317] flex items-center justify-center">
          <span className="text-white font-bold text-xs">B</span>
        </div>
        <span className="font-semibold text-[#121317] text-sm">Buildrs</span>
      </Link>
    </div>
  )

  if (isWelcome) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col">
        {header}
        <WelcomeScreen answers={answers} onStart={handleComplete} loading={saving} error={saveError} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col">
      {header}

      {/* Progress bar */}
      <div className="h-0.5 bg-[#E6EAF0] flex-shrink-0">
        <div
          className="h-full bg-[#3279F9] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Contenu centré */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <OnboardingStep
          step={step}
          total={QUESTIONS.length}
          question={currentQ.question}
          options={currentQ.options}
          hasOther={'hasOther' in currentQ ? currentQ.hasOther : false}
          value={answers[currentQ.key] ?? ''}
          onChange={(val) => handleAnswer(currentQ.key, val)}
          onNext={() => setStep(s => s + 1)}
          onBack={step > 0 ? () => setStep(s => s - 1) : undefined}
        />
      </div>
    </div>
  )
}

export { OnboardingPage }
