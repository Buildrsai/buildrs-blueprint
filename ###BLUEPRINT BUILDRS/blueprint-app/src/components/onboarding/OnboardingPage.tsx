import { useState, useEffect, useRef } from 'react'
import { Lightbulb, Copy, Compass, TrendingUp, RefreshCw, Briefcase, Sprout, Wrench, Rocket, type LucideIcon } from 'lucide-react'
import type { OnboardingData } from '../../hooks/useOnboarding'
import { BuildrsIcon } from '../ui/icons'

interface ChoiceOption {
  value: string
  label: string
  desc: string
  accent: string
  icon: LucideIcon
}

interface Step {
  id: number
  type: 'welcome' | 'choice'
  title?: string
  subtitle?: string
  field?: keyof OnboardingData
  options?: ChoiceOption[]
}

const STEPS: Step[] = [
  { id: 1, type: 'welcome' },
  {
    id: 2,
    type: 'choice',
    title: 'Ta stratégie de départ',
    subtitle: 'Comment veux-tu trouver ton idée ?',
    field: 'strategie',
    options: [
      { value: 'problem', label: "J'ai un problème à résoudre", desc: "Je crée ma propre solution à partir d'un problème que je connais bien", accent: '#4d96ff', icon: Lightbulb },
      { value: 'copy', label: 'Je veux copier un SaaS qui marche', desc: "J'adapte un SaaS existant au marché français", accent: '#cc5de8', icon: Copy },
      { value: 'discover', label: "Je n'ai aucune idée", desc: 'Je veux découvrir les opportunités avec les outils du Module 1', accent: '#22c55e', icon: Compass },
    ],
  },
  {
    id: 3,
    type: 'choice',
    title: 'Ton objectif de monétisation',
    subtitle: 'Que veux-tu faire avec ton produit ?',
    field: 'objectif',
    options: [
      { value: 'mrr', label: 'MRR — Revenus récurrents', desc: 'Je garde le produit et construis une rente mensuelle', accent: '#22c55e', icon: TrendingUp },
      { value: 'flip', label: 'Flip — Construire et revendre', desc: 'Je construis rapidement et je revends sur Flippa / Acquire.com', accent: '#eab308', icon: RefreshCw },
      { value: 'client', label: 'Commande client', desc: 'Je construis des apps pour des clients (2 000–10 000€/projet)', accent: '#4d96ff', icon: Briefcase },
    ],
  },
  {
    id: 4,
    type: 'choice',
    title: 'Ton niveau actuel',
    subtitle: 'Pour adapter tes recommandations.',
    field: 'niveau',
    options: [
      { value: 'beginner', label: 'Complet débutant', desc: "Je n'ai jamais utilisé d'outils IA pour construire quoi que ce soit", accent: '#cc5de8', icon: Sprout },
      { value: 'tools', label: "J'ai déjà touché à des outils IA", desc: 'ChatGPT, Midjourney, ou des outils no-code', accent: '#4d96ff', icon: Wrench },
      { value: 'launched', label: "J'ai déjà lancé un projet", desc: "J'ai déjà sorti quelque chose, même si ça n'a pas marché", accent: '#22c55e', icon: Rocket },
    ],
  },
]

interface Props {
  userId: string
  onComplete: () => void
  onSignOut: () => void
  save: (updates: Partial<OnboardingData>) => Promise<void>
  complete: () => Promise<void>
}

export function OnboardingPage({ onComplete, onSignOut, save, complete }: Props) {
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState<Partial<OnboardingData>>({})
  const [saving, setSaving] = useState(false)
  const [animKey, setAnimKey] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  const current = STEPS[step]
  const isDark = document.documentElement.classList.contains('dark')

  const canProceed = () => {
    if (current.type === 'welcome') return true
    return !!selections[current.field!]
  }

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setAnimKey(k => k + 1)
      setStep(s => s + 1)
    } else {
      setSaving(true)
      await save(selections)
      await complete()
      setSaving(false)
      onComplete()
    }
  }

  useEffect(() => {
    contentRef.current?.classList.remove('step-animate')
    void contentRef.current?.offsetWidth
    contentRef.current?.classList.add('step-animate')
  }, [animKey])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 relative">

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 h-14">
        <div className="flex items-center gap-2">
          <BuildrsIcon color={isDark ? '#fafafa' : '#09090b'} size={18} />
          <span className="font-extrabold text-sm text-foreground" style={{ letterSpacing: '-0.04em' }}>Buildrs</span>
        </div>
        <button onClick={onSignOut} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Se déconnecter
        </button>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1.5 mb-10">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="h-[3px] rounded-full transition-all duration-300"
            style={{
              width: i === step ? 28 : 14,
              background: i < step ? 'linear-gradient(90deg, #4d96ff, #cc5de8)' : i === step ? 'hsl(var(--foreground))' : 'hsl(var(--border))',
              opacity: i > step ? 0.4 : 1,
            }}
          />
        ))}
        <span className="text-[10px] text-muted-foreground ml-2 font-medium tabular-nums">
          {step + 1}/{STEPS.length}
        </span>
      </div>

      {/* Content */}
      <div ref={contentRef} className="w-full max-w-lg step-animate">

        {/* Welcome */}
        {current.type === 'welcome' && (
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-foreground mb-4" style={{ letterSpacing: '-0.03em' }}>
              Tu viens de faire<br />le premier pas.
            </h1>
            <p className="text-muted-foreground mb-2 text-sm">
              Voici ce qui t'attend dans les 6 prochains jours.
            </p>
            <p className="text-muted-foreground mb-8 text-sm">
              Réponds à ces quelques questions pour que l'on personnalise ton parcours.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { n: '7', label: 'modules' },
                { n: '30+', label: 'leçons' },
                { n: '6j', label: 'pour lancer' },
              ].map(item => (
                <div key={item.n} className="border border-border rounded-xl p-4 text-center">
                  <div className="text-2xl font-extrabold text-foreground mb-1" style={{ letterSpacing: '-0.03em' }}>{item.n}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Choice */}
        {current.type === 'choice' && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center mb-2">
              Étape {step} sur {STEPS.length - 1}
            </p>
            <h1 className="text-3xl font-extrabold text-foreground mb-2 text-center" style={{ letterSpacing: '-0.03em' }}>
              {current.title}
            </h1>
            <p className="text-sm text-muted-foreground text-center mb-8">{current.subtitle}</p>
            <div className="flex flex-col gap-3">
              {current.options!.map(opt => {
                const selected = selections[current.field!] === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setSelections(prev => ({ ...prev, [current.field!]: opt.value }))}
                    className="text-left w-full rounded-xl border-2 px-5 py-4 transition-all duration-150 relative overflow-hidden"
                    style={{
                      borderColor: selected ? opt.accent : 'hsl(var(--border))',
                      background: selected ? `${opt.accent}0f` : 'hsl(var(--background))',
                    }}
                  >
                    {selected && (
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl" style={{ background: opt.accent }} />
                    )}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: selected ? `${opt.accent}20` : 'hsl(var(--secondary))' }}
                      >
                        <opt.icon size={15} strokeWidth={1.5} style={{ color: selected ? opt.accent : 'hsl(var(--muted-foreground))' }} />
                      </div>
                      <div>
                        <div className="font-semibold text-sm mb-0.5" style={{ color: selected ? opt.accent : 'hsl(var(--foreground))' }}>
                          {opt.label}
                        </div>
                        <div className="text-xs text-muted-foreground">{opt.desc}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleNext}
          disabled={!canProceed() || saving}
          className="mt-8 w-full bg-foreground text-background rounded-xl py-3.5 text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          {saving ? 'Sauvegarde...' : step === STEPS.length - 1 ? 'Accéder à mon Blueprint →' : step === 0 ? 'Personnaliser mon parcours →' : 'Continuer →'}
        </button>

        {step > 0 && (
          <button
            onClick={() => { setAnimKey(k => k + 1); setStep(s => s - 1) }}
            className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            ← Retour
          </button>
        )}
      </div>
    </div>
  )
}
