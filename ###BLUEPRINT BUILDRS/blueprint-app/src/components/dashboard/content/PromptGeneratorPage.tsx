import { useState, useCallback } from 'react'
import { ArrowLeft, Copy, Check, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'

interface Props {
  navigate: (hash: string) => void
}

// ── Steps definition ───────────────────────────────────────────────────────

const STEPS = [
  {
    id: 'identite',
    letter: 'C',
    label: 'Contexte — Identité',
    desc: 'Qui est Claude dans ton projet ? Quel est son rôle ?',
    placeholder: `Tu es un expert fullstack SaaS spécialisé dans Next.js + Supabase.
Tu codes comme un senior — production-ready, sécurisé, maintenable.
Tu ne proposes jamais de prototype.
Tu penses mobile-first.`,
    hint: 'Décris le rôle, le niveau d\'expertise, et le comportement attendu de Claude.',
  },
  {
    id: 'stack',
    letter: 'T',
    label: 'Tâche — Stack technique',
    desc: 'Quelles technologies et outils utilises-tu ?',
    placeholder: `Stack : Next.js App Router + Supabase + Stripe + Tailwind CSS + shadcn/ui.
Déploiement : Vercel.
Auth : Supabase Auth (email + Google OAuth).
Emails : Resend.
Paiements : Stripe Checkout.`,
    hint: 'Liste ton stack complet. Claude s\'y référera automatiquement à chaque réponse.',
  },
  {
    id: 'design',
    letter: 'A',
    label: 'Attentes — Design System',
    desc: 'Quelles sont tes règles visuelles non négociables ?',
    placeholder: `Design System :
- Fond : #080909 (dark mode uniquement)
- Fonts : Instrument Serif (titres) + Geist (UI) + Geist Mono (code)
- Icônes : Lucide (strokeWidth 1.5), jamais d'emoji
- Couleurs : zinc/slate, un seul accent par section
- Mobile-first, transitions 150ms`,
    hint: 'Définis ton identité visuelle. Claude appliquera ces règles à chaque composant généré.',
  },
  {
    id: 'securite',
    letter: 'A',
    label: 'Attentes — Sécurité',
    desc: 'Quelles règles de sécurité sont absolues dans ton projet ?',
    placeholder: `Sécurité :
- Jamais de clés API côté client (ANTHROPIC_API_KEY, STRIPE_SECRET_KEY → serveur uniquement)
- RLS activé sur toutes les tables Supabase
- Validation des inputs avec Zod
- Variables d'environnement dans .env.local uniquement
- Row-level security pour chaque table`,
    hint: 'Ces règles seront rappelées à chaque génération de code impliquant des données sensibles.',
  },
  {
    id: 'comportement',
    letter: 'R',
    label: 'Résultat — Comportement & Philosophie',
    desc: 'Comment Claude doit-il travailler et raisonner sur ton projet ?',
    placeholder: `Comportement :
- Avant de coder : analyser l'existant, identifier les composants réutilisables
- Production-ready uniquement : pas de prototype, pas de TODO
- Signaler les edge cases : empty state, loading, erreur
- Format de commit : feat/fix/refactor(scope): description
- Philosophie : simplicité, maintenabilité, performance`,
    hint: 'Décris la méthode de travail. Claude l\'appliquera à chaque session sans que tu aies à le répéter.',
  },
]

// ── Output generator ───────────────────────────────────────────────────────

function generatePrompt(values: Record<string, string>, projectName: string): string {
  const sections = [
    projectName ? `# Projet : ${projectName}\n` : '',
    `## Identité\n${values.identite || '[Non renseigné]'}`,
    `## Stack Technique\n${values.stack || '[Non renseigné]'}`,
    `## Design System\n${values.design || '[Non renseigné]'}`,
    `## Sécurité\n${values.securite || '[Non renseigné]'}`,
    `## Comportement & Philosophie\n${values.comportement || '[Non renseigné]'}`,
  ].filter(Boolean)

  return sections.join('\n\n')
}

// ── Progress bar ───────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="flex-1 h-0.5 rounded-full transition-all duration-300"
          style={{ background: i <= current ? '#4d96ff' : 'rgba(255,255,255,0.08)' }}
        />
      ))}
      <span className="text-[10px] font-medium tabular-nums flex-shrink-0" style={{ color: '#5b6078' }}>
        {current + 1}/{total}
      </span>
    </div>
  )
}

// ── Step view ──────────────────────────────────────────────────────────────

function StepView({
  step,
  value,
  onChange,
  onNext,
  onBack,
  isLast,
  isFirst,
}: {
  step: typeof STEPS[0]
  value: string
  onChange: (v: string) => void
  onNext: () => void
  onBack: () => void
  isLast: boolean
  isFirst: boolean
}) {
  return (
    <div>
      {/* Letter badge + label */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-[16px] font-black"
          style={{ background: 'rgba(77,150,255,0.1)', border: '0.5px solid rgba(77,150,255,0.25)', color: '#4d96ff' }}
        >
          {step.letter}
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: '#5b6078' }}>{step.label}</p>
          <h2 className="text-[16px] font-extrabold" style={{ color: '#f0f0f5', letterSpacing: '-0.02em' }}>{step.desc}</h2>
        </div>
      </div>

      {/* Hint */}
      <p className="text-[12px] leading-relaxed mb-4 mt-4" style={{ color: '#5b6078' }}>
        {step.hint}
      </p>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={step.placeholder}
        rows={8}
        className="w-full rounded-xl px-4 py-3 text-[12.5px] leading-relaxed resize-none focus:outline-none transition-all"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '0.5px solid rgba(255,255,255,0.1)',
          color: '#f0f0f5',
          fontFamily: 'Geist Mono, ui-monospace, monospace',
          caretColor: '#4d96ff',
        }}
        onFocus={e => { e.target.style.border = '0.5px solid rgba(77,150,255,0.4)' }}
        onBlur={e => { e.target.style.border = '0.5px solid rgba(255,255,255,0.1)' }}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={onBack}
          disabled={isFirst}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all disabled:opacity-30"
          style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', color: '#9399b2' }}
        >
          <ChevronLeft size={14} strokeWidth={1.5} />
          Précédent
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:opacity-90"
          style={{ background: '#4d96ff', color: '#fff' }}
        >
          {isLast ? (
            <>
              <Sparkles size={14} strokeWidth={1.5} />
              Générer mon prompt
            </>
          ) : (
            <>
              Suivant
              <ChevronRight size={14} strokeWidth={1.5} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// ── Result view ────────────────────────────────────────────────────────────

function ResultView({
  prompt,
  onRestart,
  navigate,
}: {
  prompt: string
  onRestart: () => void
  navigate: (hash: string) => void
}) {
  const [copied, setCopied] = useState(false)
  const doCopy = useCallback(() => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }, [prompt])

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.1)', border: '0.5px solid rgba(34,197,94,0.25)' }}>
          <Sparkles size={16} strokeWidth={1.5} style={{ color: '#22c55e' }} />
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: '#22c55e' }}>Ton system prompt</p>
          <h2 className="text-[16px] font-extrabold" style={{ color: '#f0f0f5', letterSpacing: '-0.02em' }}>Prêt à coller dans Claude Code</h2>
        </div>
      </div>

      {/* Output */}
      <div className="relative rounded-xl overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.09)' }}>
        <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <span className="text-[10px] font-medium" style={{ fontFamily: 'Geist Mono, monospace', color: '#5b6078' }}>CLAUDE.md / system prompt</span>
          <button
            onClick={doCopy}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all"
            style={{ background: copied ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.07)', border: `0.5px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.12)'}`, color: copied ? '#22c55e' : '#5b6078' }}
          >
            {copied ? <Check size={11} strokeWidth={2} /> : <Copy size={11} strokeWidth={1.5} />}
            <span className="text-[10px] font-medium">{copied ? 'Copié !' : 'Copier'}</span>
          </button>
        </div>
        <pre className="px-4 py-4 overflow-x-auto text-[12px] leading-relaxed max-h-[420px] overflow-y-auto" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', color: '#c9d1d9' }}>
          <code>{prompt}</code>
        </pre>
      </div>

      {/* Where to use */}
      <div className="rounded-xl px-4 py-3.5 mb-6" style={{ background: 'rgba(77,150,255,0.06)', border: '0.5px solid rgba(77,150,255,0.18)' }}>
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#4d96ff' }}>Où coller ce prompt ?</p>
        <div className="flex flex-col gap-2">
          {[
            { label: 'CLAUDE.md', desc: 'À la racine de ton projet — chargé automatiquement à chaque session Claude Code' },
            { label: 'System Prompt Claude.ai', desc: 'Dans les instructions système de Claude.ai pour Cowork' },
            { label: 'Claude Code settings.json', desc: 'Dans "system_prompt" pour un projet spécifique' },
          ].map(({ label, desc }) => (
            <div key={label} className="flex items-start gap-2">
              <code className="text-[10px] font-bold flex-shrink-0 mt-0.5" style={{ color: '#4d96ff', fontFamily: 'Geist Mono, monospace' }}>{label}</code>
              <p className="text-[11.5px] leading-relaxed" style={{ color: '#9399b2' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-medium transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', color: '#9399b2' }}
        >
          Recommencer
        </button>
        <button
          onClick={() => navigate('#/dashboard/claude-os/apprendre/claude-md')}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-medium transition-all"
          style={{ background: 'rgba(77,150,255,0.08)', border: '0.5px solid rgba(77,150,255,0.2)', color: '#4d96ff' }}
        >
          Voir CLAUDE.md
          <ChevronRight size={13} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────

export function PromptGeneratorPage({ navigate }: Props) {
  const [step, setStep] = useState(0)
  const [projectName, setProjectName] = useState('')
  const [values, setValues] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  const currentStep = STEPS[step]
  const currentValue = values[currentStep?.id] ?? ''

  const handleChange = (v: string) => {
    setValues(prev => ({ ...prev, [currentStep.id]: v }))
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      setDone(true)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1)
  }

  const handleRestart = () => {
    setStep(0)
    setValues({})
    setProjectName('')
    setDone(false)
  }

  const generatedPrompt = generatePrompt(values, projectName)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Back */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm mb-10 transition-opacity hover:opacity-70"
          style={{ color: '#9399b2' }}
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          <span>Générer</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] block mb-3" style={{ color: '#8b5cf6' }}>Génération</span>
          <h1 className="text-[24px] font-extrabold mb-3" style={{ color: '#f0f0f5', letterSpacing: '-0.03em' }}>
            Générateur de Prompt Parfait
          </h1>
          <p className="text-[13.5px] leading-relaxed" style={{ color: '#9399b2' }}>
            Réponds à 5 questions sur ton projet — on génère ton system prompt CTAR complet, prêt à coller dans CLAUDE.md.
          </p>
        </div>

        {!done && (
          <>
            {/* Project name (step 0 only) */}
            {step === 0 && (
              <div className="mb-6">
                <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#5b6078' }}>
                  Nom du projet (optionnel)
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  placeholder="ex : Buildrs, MonSaaS, ..."
                  className="w-full rounded-xl px-4 py-2.5 text-[13px] focus:outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '0.5px solid rgba(255,255,255,0.1)',
                    color: '#f0f0f5',
                  }}
                  onFocus={e => { e.target.style.border = '0.5px solid rgba(77,150,255,0.4)' }}
                  onBlur={e => { e.target.style.border = '0.5px solid rgba(255,255,255,0.1)' }}
                />
              </div>
            )}

            {/* Progress */}
            <ProgressBar current={step} total={STEPS.length} />

            {/* Step */}
            <StepView
              step={currentStep}
              value={currentValue}
              onChange={handleChange}
              onNext={handleNext}
              onBack={handleBack}
              isLast={step === STEPS.length - 1}
              isFirst={step === 0}
            />
          </>
        )}

        {done && (
          <ResultView
            prompt={generatedPrompt}
            onRestart={handleRestart}
            navigate={navigate}
          />
        )}

        <div className="h-12" />
      </div>
    </div>
  )
}
