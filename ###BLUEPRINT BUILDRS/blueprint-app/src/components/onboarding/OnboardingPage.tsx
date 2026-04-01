import { useState, useEffect, useRef } from 'react'
import { Lightbulb, Copy, Compass, TrendingUp, RefreshCw, Briefcase, Sprout, Wrench, Rocket, type LucideIcon } from 'lucide-react'
import type { OnboardingData } from '../../hooks/useOnboarding'
import { BuildrsIcon } from '../ui/icons'

// ── RobotJarvis pixel-art SVG ────────────────────────────────────────────────
function RobotJarvis({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <rect x="7" y="0" width="2" height="3" fill="#818cf8"/>
      <rect x="15" y="0" width="2" height="3" fill="#818cf8"/>
      <rect x="5" y="2" width="2" height="2" fill="#818cf8"/>
      <rect x="17" y="2" width="2" height="2" fill="#818cf8"/>
      <rect x="3" y="4" width="18" height="12" rx="2" fill="#6366f1"/>
      <rect x="6" y="7" width="4" height="4" rx="1" fill="#c7d2fe"/>
      <rect x="14" y="7" width="4" height="4" rx="1" fill="#c7d2fe"/>
      <rect x="7" y="8" width="2" height="2" fill="#312e81"/>
      <rect x="15" y="8" width="2" height="2" fill="#312e81"/>
      <rect x="9" y="13" width="6" height="2" rx="1" fill="#4338ca"/>
      <rect x="5" y="17" width="4" height="4" rx="1" fill="#4338ca"/>
      <rect x="15" y="17" width="4" height="4" rx="1" fill="#4338ca"/>
      <rect x="4" y="20" width="3" height="2" rx="1" fill="#4338ca"/>
      <rect x="17" y="20" width="3" height="2" rx="1" fill="#4338ca"/>
    </svg>
  )
}

// ── Inline text renderer (supports **bold**) ─────────────────────────────────
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ fontWeight: 600, color: '#f0f0f5' }}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

function renderBubbleText(text: string): React.ReactNode {
  return text.split('\n').map((line, i, arr) => (
    <span key={i}>
      {renderInline(line)}
      {i < arr.length - 1 && <br />}
    </span>
  ))
}

// ── Jarvis message bubble ────────────────────────────────────────────────────
function JarvisBubble({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 24 }}>
      <div style={{ marginTop: 3 }}>
        <RobotJarvis size={32} />
      </div>
      <div style={{
        background: '#15161d',
        border: '1px solid #1e2030',
        borderRadius: '2px 14px 14px 14px',
        padding: '12px 16px',
        flex: 1,
      }}>
        <p style={{ fontSize: 13, color: '#9399b2', lineHeight: 1.75, margin: 0 }}>
          {renderBubbleText(text)}
        </p>
      </div>
    </div>
  )
}

// ── Choice options data ──────────────────────────────────────────────────────
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
  field?: keyof OnboardingData
  options?: ChoiceOption[]
}

const STEPS: Step[] = [
  { id: 1, type: 'welcome' },
  {
    id: 2,
    type: 'choice',
    title: 'Ta stratégie de départ',
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
    field: 'niveau',
    options: [
      { value: 'beginner', label: 'Complet débutant', desc: "Je n'ai jamais utilisé d'outils IA pour construire quoi que ce soit", accent: '#cc5de8', icon: Sprout },
      { value: 'tools', label: "J'ai déjà touché à des outils IA", desc: 'ChatGPT, Midjourney, ou des outils no-code', accent: '#4d96ff', icon: Wrench },
      { value: 'launched', label: "J'ai déjà lancé un projet", desc: "J'ai déjà sorti quelque chose, même si ça n'a pas marché", accent: '#22c55e', icon: Rocket },
    ],
  },
]

// ── Jarvis messages per step ─────────────────────────────────────────────────
function getJarvisMessage(step: number, firstName?: string): string {
  const name = firstName ? `${firstName}, ` : ''
  const msgs: Record<number, string> = {
    0: `${name}bienvenue en 2026. Je suis **Jarvis**, ton COO IA.\n\nMon job : m'assurer que tu lances ton premier produit. Pas dans 6 mois. Dans 6 jours. Réponds à ces 3 questions pour que j'adapte ton parcours.`,
    1: 'Comment tu veux trouver ton idée de produit ?',
    2: 'Bien. Maintenant, que comptes-tu faire avec ton produit une fois qu\'il est live ?',
    3: 'Dernière question. Où tu en es aujourd\'hui ?',
  }
  return msgs[step] ?? ''
}

// ── Props ────────────────────────────────────────────────────────────────────
interface Props {
  userId: string
  userFirstName?: string
  onComplete: () => void
  onSignOut: () => void
  save: (updates: Partial<OnboardingData>) => Promise<void>
  complete: () => Promise<void>
}

// ── Main component ───────────────────────────────────────────────────────────
export function OnboardingPage({ userFirstName, onComplete, onSignOut, save, complete }: Props) {
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState<Partial<OnboardingData>>({})
  const [saving, setSaving] = useState(false)
  const [animKey, setAnimKey] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  const current = STEPS[step]

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
    <div style={{ minHeight: '100vh', background: '#09090b', fontFamily: 'Geist, sans-serif' }}
      className="flex flex-col items-center justify-center px-4 py-12 relative">

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 h-14">
        <div className="flex items-center gap-2">
          <BuildrsIcon color="#fafafa" size={18} />
          <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: '-0.04em', color: '#fafafa' }}>Buildrs</span>
        </div>
        <button onClick={onSignOut} style={{ fontSize: 12, color: '#5b6078' }}
          className="hover:text-white transition-colors">
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
              background: i < step
                ? 'linear-gradient(90deg, #4d96ff, #cc5de8)'
                : i === step ? '#6366f1' : '#1e2030',
              opacity: i > step ? 0.5 : 1,
            }}
          />
        ))}
        <span style={{ fontSize: 10, color: '#5b6078', marginLeft: 8, fontWeight: 500 }}>
          {step + 1}/{STEPS.length}
        </span>
      </div>

      {/* Content */}
      <div ref={contentRef} className="w-full max-w-lg step-animate">

        {/* Jarvis bubble */}
        <JarvisBubble text={getJarvisMessage(step, userFirstName)} />

        {/* Welcome */}
        {current.type === 'welcome' && (
          <div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { n: '7', label: 'modules' },
                { n: '30+', label: 'leçons' },
                { n: '6j', label: 'pour lancer' },
              ].map(item => (
                <div key={item.n} style={{ border: '1px solid #1e2030', background: '#15161d', borderRadius: 12 }}
                  className="p-4 text-center">
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#f0f0f5', letterSpacing: '-0.03em', marginBottom: 2 }}>
                    {item.n}
                  </div>
                  <div style={{ fontSize: 12, color: '#5b6078' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Choice */}
        {current.type === 'choice' && (
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#5b6078', textAlign: 'center', marginBottom: 8 }}>
              Étape {step} sur {STEPS.length - 1}
            </p>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f0f0f5', letterSpacing: '-0.03em', textAlign: 'center', marginBottom: 20 }}>
              {current.title}
            </h1>
            <div className="flex flex-col gap-3">
              {current.options!.map(opt => {
                const selected = selections[current.field!] === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setSelections(prev => ({ ...prev, [current.field!]: opt.value }))}
                    className="text-left w-full rounded-xl border-2 px-5 py-4 transition-all duration-150 relative overflow-hidden"
                    style={{
                      borderColor: selected ? opt.accent : '#1e2030',
                      background: selected ? `${opt.accent}12` : '#15161d',
                    }}
                  >
                    {selected && (
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl" style={{ background: opt.accent }} />
                    )}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: selected ? `${opt.accent}20` : '#1e2030' }}
                      >
                        <opt.icon size={15} strokeWidth={1.5} style={{ color: selected ? opt.accent : '#5b6078' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, color: selected ? opt.accent : '#f0f0f5' }}>
                          {opt.label}
                        </div>
                        <div style={{ fontSize: 12, color: '#5b6078' }}>{opt.desc}</div>
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
          style={{
            marginTop: 24,
            width: '100%',
            background: canProceed() && !saving ? '#6366f1' : '#1e2030',
            color: canProceed() && !saving ? '#fff' : '#5b6078',
            borderRadius: 12,
            padding: '14px 0',
            fontSize: 14,
            fontWeight: 600,
            border: 'none',
            cursor: canProceed() && !saving ? 'pointer' : 'not-allowed',
            transition: 'all 150ms',
            fontFamily: 'Geist, sans-serif',
          }}
        >
          {saving ? 'Sauvegarde...' : step === STEPS.length - 1 ? 'Accéder au dashboard →' : step === 0 ? 'Personnaliser mon parcours →' : 'Continuer →'}
        </button>

        {step > 0 && (
          <button
            onClick={() => { setAnimKey(k => k + 1); setStep(s => s - 1) }}
            style={{ marginTop: 12, width: '100%', textAlign: 'center', fontSize: 12, color: '#5b6078', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Geist, sans-serif' }}
            className="hover:text-white transition-colors py-1"
          >
            ← Retour
          </button>
        )}
      </div>
    </div>
  )
}
