import { useState, useEffect, useRef } from 'react'
import {
  Lightbulb, Search, Package, Sprout, Compass, Rocket,
  TrendingUp, RefreshCw, Briefcase,
  Terminal, Database, Globe,
  type LucideIcon,
} from 'lucide-react'
import type { OnboardingData } from '../../hooks/useOnboarding'
import { BuildrsIcon } from '../ui/icons'
import { supabase } from '../../lib/supabase'
import { DEFAULT_MILESTONES } from '../../data/milestones-defaults'

// ── Jarvis avatar ─────────────────────────────────────────────────────────────
function JarvisAvatar({ size = 32 }: { size?: number }) {
  const inner = Math.round(size * 0.45)
  return (
    <div style={{
      width: size, height: size,
      borderRadius: Math.round(size * 0.28),
      background: '#09090b',
      border: '1px solid rgba(255,255,255,0.18)',
      boxShadow: '0 0 10px rgba(255,255,255,0.06), inset 0 0 6px rgba(255,255,255,0.03)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <BuildrsIcon color="#fafafa" size={inner} />
    </div>
  )
}

// ── Text helpers ──────────────────────────────────────────────────────────────
function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} style={{ fontWeight: 600, color: '#fafafa' }}>{part.slice(2, -2)}</strong>
      : part
  )
}

function renderBubbleText(text: string): React.ReactNode {
  return text.split('\n').map((line, i, arr) => (
    <span key={i}>{renderInline(line)}{i < arr.length - 1 && <br />}</span>
  ))
}

// ── Jarvis bubble ─────────────────────────────────────────────────────────────
function JarvisBubble({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 24 }}>
      <div style={{ marginTop: 2 }}><JarvisAvatar size={34} /></div>
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '2px 14px 14px 14px',
        padding: '12px 16px', flex: 1,
      }}>
        <p style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.75, margin: 0 }}>
          {renderBubbleText(text)}
        </p>
      </div>
    </div>
  )
}

// ── Choice option ─────────────────────────────────────────────────────────────
interface ChoiceOption { value: string; label: string; desc: string; icon: LucideIcon }

interface ChoiceStepDef {
  id: number
  type: 'welcome' | 'choice'
  title?: string
  key?: keyof V2Selections
  options?: ChoiceOption[]
}

// ── V2 local state ────────────────────────────────────────────────────────────
interface V2Selections {
  project_status: 'has_idea' | 'searching' | 'has_product' | null
  experience:     'beginner' | 'explored' | 'launched' | null
  goal:           'mrr' | 'flip' | 'client' | null
  tech_level:     'zero' | 'basic' | 'advanced' | null
}

const STEPS: ChoiceStepDef[] = [
  { id: 0, type: 'welcome' },
  {
    id: 1, type: 'choice', title: 'Ton statut projet',
    key: 'project_status',
    options: [
      { value: 'has_idea',    label: "J'ai une idée précise",     desc: "Je sais ce que je veux construire — j'ai le problème",   icon: Lightbulb },
      { value: 'searching',   label: "J'en cherche une",          desc: "Je veux explorer les opportunités et trouver mon idée",  icon: Search    },
      { value: 'has_product', label: "J'ai déjà un produit",      desc: "J'ai commencé ou lancé quelque chose, je veux aller plus loin", icon: Package },
    ],
  },
  {
    id: 2, type: 'choice', title: 'Ton stage actuel',
    key: 'experience',
    options: [
      { value: 'beginner',  label: "Débutant complet",        desc: "Je n'ai jamais construit de produit digital",           icon: Sprout  },
      { value: 'explored',  label: "J'ai déjà exploré",       desc: "J'ai touché à des outils IA, du no-code, ou Claude",   icon: Compass },
      { value: 'launched',  label: "J'ai déjà lancé",         desc: "J'ai sorti quelque chose — même si ça n'a pas marché", icon: Rocket  },
    ],
  },
  {
    id: 3, type: 'choice', title: 'Ton objectif',
    key: 'goal',
    options: [
      { value: 'mrr',    label: "MRR — Revenus récurrents",  desc: "Je garde le produit et construis une rente mensuelle",       icon: TrendingUp },
      { value: 'flip',   label: "Flip — Construire et vendre", desc: "Je construis rapidement et je revends sur Flippa/Acquire", icon: RefreshCw  },
      { value: 'client', label: "Commande client",           desc: "Je construis des apps pour des clients (2 000–10 000€/projet)", icon: Briefcase },
    ],
  },
  {
    id: 4, type: 'choice', title: 'Ton niveau technique',
    key: 'tech_level',
    options: [
      { value: 'zero',     label: "Zéro code",           desc: "Je n'ai jamais touché à du code — juste du texte et de la logique", icon: Terminal },
      { value: 'basic',    label: "Quelques bases",       desc: "J'ai bidouillé un peu — HTML, Python, ou des configs",             icon: Database },
      { value: 'advanced', label: "Dev ou presque",       desc: "Je suis à l'aise avec le code — je veux aller plus loin avec l'IA", icon: Globe   },
    ],
  },
]

// ── Jarvis messages ───────────────────────────────────────────────────────────
function getJarvisMessage(step: number, firstName?: string): string {
  const name = firstName ? `${firstName}, ` : ''
  const msgs: Record<number, string> = {
    0: `${name}bienvenue en 2026. Je suis **Jarvis**, ton COO IA.\n\nMon job : m'assurer que tu lances ton premier produit. Pas dans 6 mois. Dans 6 jours. Réponds à ces 4 questions — 30 secondes — et j'adapte tout ton parcours.`,
    1: 'Où tu en es avec ton projet ?',
    2: 'Bien. Maintenant, ton background — honnêtement ?',
    3: "Que comptes-tu faire avec ton produit une fois qu'il est live ?",
    4: "Dernière question. Ton niveau technique aujourd'hui ?",
  }
  return msgs[step] ?? ''
}

// ── Profile stage mapping ─────────────────────────────────────────────────────
function mapToProfileStage(ps: V2Selections['project_status']): 'idea' | 'exploring' | 'building' | 'launched' {
  if (ps === 'has_idea')    return 'idea'
  if (ps === 'searching')   return 'exploring'
  if (ps === 'has_product') return 'building'
  return 'idea'
}

// ── Legacy OnboardingData mapping ────────────────────────────────────────────
function mapToLegacy(sel: V2Selections): Partial<OnboardingData> {
  const strMap: Record<string, string> = { has_idea: 'problem', searching: 'discover', has_product: 'copy' }
  const niveauMap: Record<string, string> = { zero: 'beginner', basic: 'tools', advanced: 'launched' }
  return {
    strategie: (sel.project_status ? strMap[sel.project_status] : undefined) as OnboardingData['strategie'],
    objectif:  sel.goal as OnboardingData['objectif'],
    niveau:    (sel.tech_level ? niveauMap[sel.tech_level] : undefined) as OnboardingData['niveau'],
  }
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  userId: string
  userFirstName?: string
  onComplete: () => void
  onSignOut: () => void
  save: (updates: Partial<OnboardingData>) => Promise<void>
  complete: () => Promise<void>
  navigate?: (hash: string) => void
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function OnboardingPage({ userId, userFirstName, onComplete, onSignOut, save, complete, navigate }: Props) {
  const [step, setStep]             = useState(0)
  const [sel, setSel]               = useState<V2Selections>({ project_status: null, experience: null, goal: null, tech_level: null })
  const [saving, setSaving]         = useState(false)
  const [animKey, setAnimKey]       = useState(0)
  const contentRef                  = useRef<HTMLDivElement>(null)

  const current = STEPS[step]

  const canProceed = (): boolean => {
    if (current.type === 'welcome') return true
    const key = current.key!
    return sel[key] !== null
  }

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setAnimKey(k => k + 1)
      setStep(s => s + 1)
      return
    }

    // Last step — save everything
    setSaving(true)
    try {
      // 1. Save legacy onboarding fields
      await save(mapToLegacy(sel))

      // 2. Upsert profile in user_profiles_buildrs
      const stage = mapToProfileStage(sel.project_status)
      await supabase.from('user_profiles_buildrs').upsert({
        user_id:               userId,
        stage,
        goal:                  sel.goal,
        tech_level:            sel.tech_level,
        level:                 'explorer',
        xp_points:             0,
        onboarding_completed:  true,
        updated_at:            new Date().toISOString(),
      }, { onConflict: 'user_id' })

      // 3. Seed milestones if user has an idea or product
      if (sel.project_status === 'has_idea' || sel.project_status === 'has_product') {
        const { data: existing } = await supabase
          .from('project_milestones')
          .select('id')
          .eq('user_id', userId)
          .limit(1)
          .maybeSingle()
        if (!existing) {
          const rows = DEFAULT_MILESTONES.map(m => ({ user_id: userId, ...m }))
          await supabase.from('project_milestones').insert(rows)
        }
      }

      // 4. Mark onboarding complete
      await complete()

      // 5. Navigate
      if (sel.project_status === 'searching' && navigate) {
        navigate('#/dashboard/marketplace')
      } else if (sel.project_status === 'has_idea' && navigate) {
        navigate('#/dashboard/project')
      }
      onComplete()
    } catch (e) {
      console.error('Onboarding save error', e)
      setSaving(false)
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
        <button onClick={onSignOut} style={{ fontSize: 12, color: '#52525b' }} className="hover:text-white transition-colors">
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
              background: i < step ? 'rgba(255,255,255,0.4)' : i === step ? '#fafafa' : 'rgba(255,255,255,0.08)',
            }}
          />
        ))}
        <span style={{ fontSize: 10, color: '#52525b', marginLeft: 8, fontWeight: 500 }}>
          {step + 1}/{STEPS.length}
        </span>
      </div>

      {/* Content */}
      <div ref={contentRef} className="w-full max-w-lg step-animate">

        <JarvisBubble text={getJarvisMessage(step, userFirstName)} />

        {/* Welcome screen */}
        {current.type === 'welcome' && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { n: '6', label: 'modules' },
              { n: '30+', label: 'leçons' },
              { n: '6j', label: 'pour lancer' },
            ].map(item => (
              <div key={item.n}
                style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}
                className="p-4 text-center">
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fafafa', letterSpacing: '-0.03em', marginBottom: 2 }}>{item.n}</div>
                <div style={{ fontSize: 12, color: '#52525b' }}>{item.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Choice screen */}
        {current.type === 'choice' && current.key && (
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: '#52525b', textAlign: 'center', marginBottom: 8 }}>
              Question {step} sur {STEPS.length - 1}
            </p>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fafafa', letterSpacing: '-0.03em', textAlign: 'center', marginBottom: 20 }}>
              {current.title}
            </h1>
            <div className="flex flex-col gap-3">
              {current.options!.map(opt => {
                const selected = sel[current.key!] === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setSel(prev => ({ ...prev, [current.key!]: opt.value }))}
                    className="text-left w-full rounded-xl px-5 py-4 transition-all duration-150 relative overflow-hidden"
                    style={{
                      border: selected ? '1px solid rgba(255,255,255,0.28)' : '1px solid rgba(255,255,255,0.07)',
                      background: selected ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                      boxShadow: selected ? '0 0 16px rgba(255,255,255,0.04)' : 'none',
                    }}
                  >
                    {selected && (
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-l-xl"
                        style={{ background: 'rgba(255,255,255,0.5)' }} />
                    )}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: selected ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                          border: selected ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <opt.icon size={15} strokeWidth={1.5} style={{ color: selected ? '#fafafa' : '#52525b' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, color: selected ? '#fafafa' : '#a1a1aa' }}>
                          {opt.label}
                        </div>
                        <div style={{ fontSize: 12, color: '#52525b' }}>{opt.desc}</div>
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
            marginTop: 24, width: '100%',
            background: canProceed() && !saving ? '#fafafa' : 'rgba(255,255,255,0.06)',
            color: canProceed() && !saving ? '#09090b' : '#3f3f46',
            borderRadius: 12, padding: '14px 0',
            fontSize: 14, fontWeight: 600, border: 'none',
            cursor: canProceed() && !saving ? 'pointer' : 'not-allowed',
            transition: 'all 150ms', fontFamily: 'Geist, sans-serif',
          }}
        >
          {saving
            ? 'Configuration...'
            : step === STEPS.length - 1
              ? 'Accéder au dashboard →'
              : step === 0
                ? 'Personnaliser mon parcours →'
                : 'Continuer →'}
        </button>

        {step > 0 && (
          <button
            onClick={() => { setAnimKey(k => k + 1); setStep(s => s - 1) }}
            style={{ marginTop: 12, width: '100%', textAlign: 'center', fontSize: 12, color: '#52525b', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Geist, sans-serif' }}
            className="hover:text-white transition-colors py-1"
          >
            Retour
          </button>
        )}
      </div>
    </div>
  )
}
