import { useState, useCallback } from 'react'
import { ArrowLeft, Copy, Check, ChevronRight, ChevronLeft, Sparkles, Loader2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

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

// ── Progress bar ───────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="flex-1 h-0.5 rounded-full transition-all duration-300"
          style={{ background: i <= current ? '#4d96ff' : 'hsl(var(--border))' }}
        />
      ))}
      <span className="text-[10px] font-medium tabular-nums flex-shrink-0" style={{ color: 'hsl(var(--muted-foreground))' }}>
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
  isGenerating,
}: {
  step: typeof STEPS[0]
  value: string
  onChange: (v: string) => void
  onNext: () => void
  onBack: () => void
  isLast: boolean
  isFirst: boolean
  isGenerating?: boolean
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
          <p className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: 'hsl(var(--muted-foreground))' }}>{step.label}</p>
          <h2 className="text-[16px] font-extrabold" style={{ color: 'hsl(var(--foreground))', letterSpacing: '-0.02em' }}>{step.desc}</h2>
        </div>
      </div>

      {/* Hint */}
      <p className="text-[12px] leading-relaxed mb-4 mt-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
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
          background: 'hsl(var(--card))',
          border: '0.5px solid hsl(var(--border))',
          color: 'hsl(var(--foreground))',
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
          style={{ background: 'hsl(var(--card))', border: '0.5px solid hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}
        >
          <ChevronLeft size={14} strokeWidth={1.5} />
          Précédent
        </button>

        <button
          onClick={onNext}
          disabled={isLast && isGenerating}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:opacity-90 disabled:opacity-60"
          style={{ background: '#4d96ff', color: '#fff' }}
        >
          {isLast ? (
            isGenerating ? (
              <>
                <Loader2 size={14} strokeWidth={1.5} className="animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles size={14} strokeWidth={1.5} />
                Générer mon prompt
              </>
            )
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
          <h2 className="text-[16px] font-extrabold" style={{ color: 'hsl(var(--foreground))', letterSpacing: '-0.02em' }}>Prêt à coller dans Claude Code</h2>
        </div>
      </div>

      {/* Output */}
      <div className="relative rounded-xl overflow-hidden mb-4" style={{ background: '#0d1117', border: '1px solid #30363d' }}>
        <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid #30363d', background: '#161b22' }}>
          <span className="text-[10px] font-medium" style={{ fontFamily: 'Geist Mono, monospace', color: 'hsl(var(--muted-foreground))' }}>CLAUDE.md / system prompt</span>
          <button
            onClick={doCopy}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all"
            style={{ background: copied ? 'rgba(34,197,94,0.1)' : 'hsl(var(--secondary))', border: `0.5px solid ${copied ? 'rgba(34,197,94,0.3)' : 'hsl(var(--border))'}`, color: copied ? '#22c55e' : 'hsl(var(--muted-foreground))' }}
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
              <p className="text-[11.5px] leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-medium transition-all"
          style={{ background: 'hsl(var(--card))', border: '0.5px solid hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}
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
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiResult, setAiResult] = useState('')
  const [genError, setGenError] = useState('')

  const currentStep = STEPS[step]
  const currentValue = values[currentStep?.id] ?? ''

  const handleChange = (v: string) => {
    setValues(prev => ({ ...prev, [currentStep.id]: v }))
  }

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      setIsGenerating(true)
      setGenError('')
      try {
        const { data, error } = await supabase.functions.invoke('claude-generators', {
          body: {
            type: 'prompt',
            payload: {
              projectName,
              context:      values.identite      || '',
              task:         values.stack         || '',
              constraints:  [values.design, values.securite].filter(Boolean).join('\n\n'),
              outputFormat: values.comportement  || '',
            },
          },
        })
        if (error) throw error
        setAiResult((data as { result: string }).result)
        setDone(true)
      } catch (e) {
        setGenError(e instanceof Error ? e.message : String(e))
      } finally {
        setIsGenerating(false)
      }
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
    setAiResult('')
    setGenError('')
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Back */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm mb-10 transition-opacity hover:opacity-70"
          style={{ color: 'hsl(var(--muted-foreground))' }}
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          <span>Générer</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] block mb-3" style={{ color: '#8b5cf6' }}>Génération</span>
          <h1 className="text-[24px] font-extrabold mb-3" style={{ color: 'hsl(var(--foreground))', letterSpacing: '-0.03em' }}>
            Générateur de Prompt Parfait
          </h1>
          <p className="text-[13.5px] leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Réponds à 5 questions sur ton projet — on génère ton system prompt CTAR complet, prêt à coller dans CLAUDE.md.
          </p>
        </div>

        {!done && (
          <>
            {/* Project name (step 0 only) */}
            {step === 0 && (
              <div className="mb-6">
                <label className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  Nom du projet (optionnel)
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  placeholder="ex : Buildrs, MonSaaS, ..."
                  className="w-full rounded-xl px-4 py-2.5 text-[13px] focus:outline-none transition-all"
                  style={{
                    background: 'hsl(var(--card))',
                    border: '0.5px solid hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
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
              isGenerating={isGenerating}
            />
            {genError && (
              <p className="mt-3 text-[12px] rounded-xl px-4 py-3" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.2)' }}>
                {genError}
              </p>
            )}
          </>
        )}

        {done && (
          <ResultView
            prompt={aiResult}
            onRestart={handleRestart}
            navigate={navigate}
          />
        )}

        <div className="h-12" />
      </div>
    </div>
  )
}
