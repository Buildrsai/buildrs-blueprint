import { useState, useEffect } from 'react'
import {
  Zap, Check, Circle, Loader2,
  FolderOpen, ArrowRight, Terminal,
  Database, Globe, Mail, Server, CreditCard, Github,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { ProjectData } from './ProjectPage'

// ── Types ──────────────────────────────────────────────────────────────────
interface StackStatus {
  claude: boolean
  supabase: boolean
  vercel: boolean
  resend: boolean
  hostinger: boolean
  stripe: boolean
  github: boolean
}

const DEFAULT_STACK: StackStatus = {
  claude: false, supabase: false, vercel: false, resend: false, hostinger: false, stripe: false, github: false,
}

// ── Step logic ─────────────────────────────────────────────────────────────
interface Step {
  n: number
  title: string
  detail: string
  state: 'done' | 'active' | 'pending'
}

function buildSteps(project: ProjectData, hasScore: boolean, validatorScore: string | null): Step[] {
  const s = project.status

  const steps: Step[] = [
    {
      n: 1,
      title: 'Idée validée',
      detail: hasScore
        ? `Score ${validatorScore}/100 · Marché analysé · Concurrence identifiée`
        : 'Valide ton idée avec le Validateur · Module 1 — Trouver & Valider',
      state: 'pending',
    },
    {
      n: 2,
      title: 'Architecture définie',
      detail: project.feature
        ? 'Stack · Base de données · Auth · Brief produit complété'
        : 'Définis la feature principale · Module 3 — L\'Architecture',
      state: 'pending',
    },
    {
      n: 3,
      title: 'Design & branding validés',
      detail: (project.brand_phrase || project.logo_url)
        ? 'Identité visuelle · Moodboard · Parcours utilisateur défini'
        : 'Définis ton branding · Module 2 — Préparer & Designer',
      state: 'pending',
    },
    {
      n: 4,
      title: 'Build en cours',
      detail: 'Feature principale · Pages essentielles · Intégration IA · Module 4 — Construire',
      state: 'pending',
    },
    {
      n: 5,
      title: 'Déploiement & Monétisation',
      detail: 'Vercel · Stripe Checkout · Emails · Landing page · Modules 5 & 6',
      state: 'pending',
    },
  ]

  if (s === 'idea') {
    // Step 1 done if has score or name filled
    steps[0].state = (hasScore || project.name.trim().length > 0) ? 'done' : 'active'
    if (steps[0].state === 'done') {
      steps[1].state = project.feature ? 'done' : 'active'
      if (steps[1].state === 'done') {
        steps[2].state = (project.brand_phrase || project.logo_url) ? 'done' : 'active'
      }
    } else {
      steps[0].state = 'active'
    }
  } else if (s === 'building') {
    steps[0].state = 'done'
    steps[1].state = 'done'
    steps[2].state = 'done'
    steps[3].state = 'active'
  } else if (s === 'live') {
    steps[0].state = 'done'
    steps[1].state = 'done'
    steps[2].state = 'done'
    steps[3].state = 'done'
    steps[4].state = 'active'
  }

  return steps
}

// ── Props ──────────────────────────────────────────────────────────────────
interface Props {
  navigate: (hash: string) => void
  userId: string | undefined
  userFirstName?: string
  moduleProgress: (id: string, total: number) => number
}

// ── Stack items config ─────────────────────────────────────────────────────
const STACK_ITEMS: {
  key: keyof StackStatus
  label: string
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
}[] = [
  { key: 'claude',    label: 'Claude Code',  Icon: Terminal },
  { key: 'supabase',  label: 'Supabase',     Icon: Database },
  { key: 'vercel',    label: 'Vercel',       Icon: Globe },
  { key: 'resend',    label: 'Resend',       Icon: Mail },
  { key: 'hostinger', label: 'Hostinger',    Icon: Server },
  { key: 'stripe',    label: 'Stripe',       Icon: CreditCard },
  { key: 'github',    label: 'GitHub',       Icon: Github },
]

// ── Component ──────────────────────────────────────────────────────────────
export function AutopilotPage({ navigate, userId, userFirstName, moduleProgress: _moduleProgress }: Props) {
  const [project, setProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [stack, setStack] = useState<StackStatus>(DEFAULT_STACK)
  const [validatorScore, setValidatorScore] = useState<string | null>(null)
  const [mrrEstimate, setMrrEstimate] = useState<string | null>(null)
  const hasScore = !!validatorScore

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    Promise.all([
      supabase.from('projects').select('*').eq('user_id', userId).maybeSingle(),
      supabase.auth.getUser(),
    ]).then(([{ data: projectData }, { data: authData }]) => {
      if (projectData) {
        setProject({
          name: projectData.name ?? '',
          problem: projectData.problem ?? '',
          target: projectData.target ?? '',
          price: projectData.price ?? '',
          feature: projectData.feature ?? '',
          status: projectData.status ?? 'idea',
          logo_url: projectData.logo_url ?? '',
          brand_color_1: projectData.brand_color_1 ?? '#4d96ff',
          brand_color_2: projectData.brand_color_2 ?? '#cc5de8',
          brand_color_3: projectData.brand_color_3 ?? '#22c55e',
          brand_color_4: projectData.brand_color_4 ?? '#ff6b6b',
          brand_phrase: projectData.brand_phrase ?? '',
        })
      }
      const meta = authData.user?.user_metadata ?? {}
      if (meta.buildrs_stack) setStack(meta.buildrs_stack)
      if (meta.buildrs_validator_score != null) setValidatorScore(String(meta.buildrs_validator_score))
      if (meta.buildrs_mrr_estimate) setMrrEstimate(meta.buildrs_mrr_estimate)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [userId])

  const toggleStack = async (key: keyof StackStatus) => {
    const updated = { ...stack, [key]: !stack[key] }
    setStack(updated)
    await supabase.auth.updateUser({ data: { buildrs_stack: updated } })
  }

  const firstName = userFirstName || 'toi'

  // ── Loading ──
  if (loading) {
    return (
      <div className="px-8 py-10 flex items-center gap-3 text-muted-foreground">
        <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
        <span className="text-sm">Chargement…</span>
      </div>
    )
  }

  // ── No project yet ──
  if (!project || !project.name) {
    return (
      <div className="px-8 py-10 max-w-[700px]">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-2">
          Autopilot IA
        </p>
        <h1 className="text-foreground mb-3" style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}>
          Salut {firstName}, définis ton projet
        </h1>
        <p className="text-[14px] text-muted-foreground leading-relaxed mb-8 max-w-[420px]">
          Autopilot IA suit ta progression en temps réel. Commence par définir ton projet pour activer le suivi.
        </p>
        <button
          onClick={() => navigate('#/dashboard/project')}
          className="flex items-center gap-2 bg-foreground text-background rounded-xl px-5 py-3 text-[13px] font-semibold hover:opacity-90 transition-opacity"
        >
          <FolderOpen size={14} strokeWidth={1.5} />
          Définir mon projet
          <ArrowRight size={14} strokeWidth={1.5} />
        </button>
      </div>
    )
  }

  const steps = buildSteps(project, hasScore, validatorScore)
  const activeStep = steps.find(s => s.state === 'active')

  return (
    <div className="px-8 py-10 max-w-[900px]">

      {/* ── Header ── */}
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-2">
          Autopilot IA
        </p>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1
              className="text-foreground mb-1"
              style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}
            >
              {project.name}
            </h1>
            {project.problem && (
              <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[480px] mt-1">
                {project.problem}
              </p>
            )}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {[
                project.status === 'idea' ? 'Idée' : project.status === 'building' ? 'En construction' : 'Live',
                'MVP 72h',
              ].map(tag => (
                <span key={tag} className="text-[10px] font-medium px-2.5 py-1 rounded-full border border-border text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CLAUDE ACTIF badge — ton neutre */}
          <div
            className="flex items-center gap-2 text-[10px] font-bold tracking-[0.06em] px-3 py-2 rounded-lg flex-shrink-0 border border-border text-muted-foreground"
          >
            <span
              className="w-[6px] h-[6px] rounded-full bg-foreground flex-shrink-0"
              style={{ animation: 'autopilot-pulse 2s ease infinite' }}
            />
            CLAUDE ACTIF
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="flex gap-6 items-start">

        {/* ── Timeline ── */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.09em] text-muted-foreground mb-5">
            Progression du projet
          </p>

          <div className="flex flex-col">
            {steps.map((step, i) => {
              const isLast = i === steps.length - 1
              return (
                <div key={step.n} className="flex gap-4">
                  {/* Dot + connector line */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={
                        step.state === 'done'
                          ? { background: 'hsl(var(--foreground))', color: 'hsl(var(--background))' }
                          : step.state === 'active'
                            ? { background: 'hsl(var(--foreground))', color: 'hsl(var(--background))', boxShadow: '0 0 0 3px hsl(var(--foreground) / 0.12)' }
                            : { background: 'transparent', border: '1px solid hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }
                      }
                    >
                      {step.state === 'done'
                        ? <Check size={11} strokeWidth={2.5} />
                        : step.state === 'active'
                          ? <Zap size={11} strokeWidth={2} />
                          : <Circle size={9} strokeWidth={1.5} />
                      }
                    </div>
                    {!isLast && (
                      <div
                        className="w-px flex-1 my-1"
                        style={{
                          minHeight: 28,
                          background: step.state === 'done'
                            ? 'hsl(var(--foreground) / 0.2)'
                            : 'hsl(var(--border))',
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`${isLast ? 'pb-0' : 'pb-6'}`}>
                    <p
                      className="text-[13px] font-semibold tracking-[-0.01em] leading-tight mb-0.5"
                      style={{
                        color: step.state === 'pending'
                          ? 'hsl(var(--muted-foreground) / 0.45)'
                          : 'hsl(var(--foreground))',
                      }}
                    >
                      {step.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed"
                      style={{ opacity: step.state === 'pending' ? 0.5 : 1 }}
                    >
                      {step.detail}
                    </p>
                    {step.state === 'active' && (
                      <span
                        className="inline-flex items-center gap-1.5 mt-2 text-[10px] font-semibold px-2 py-0.5 rounded border border-border text-foreground"
                        style={{ background: 'hsl(var(--secondary))' }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-foreground"
                          style={{ animation: 'autopilot-pulse 2s ease infinite' }}
                        />
                        En cours
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Prochaine étape CTA */}
          {activeStep && (
            <button
              onClick={() => {
                if (activeStep.n === 1) navigate('#/dashboard/generator/validate')
                else if (activeStep.n === 2) navigate('#/dashboard/module/03')
                else if (activeStep.n === 3) navigate('#/dashboard/module/02')
                else if (activeStep.n === 4) navigate('#/dashboard/module/04')
                else navigate('#/dashboard/module/05')
              }}
              className="mt-6 flex items-center justify-between w-full rounded-xl px-5 py-4 border border-border hover:border-foreground/30 hover:bg-secondary/30 text-left transition-all duration-150 group"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.09em] mb-1 text-muted-foreground">
                  Prochaine étape
                </p>
                <p className="text-[13px] font-semibold text-foreground tracking-[-0.01em]">
                  {activeStep.title} →
                </p>
              </div>
              <ArrowRight size={15} strokeWidth={1.5} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
            </button>
          )}
        </div>

        {/* ── Right panel ── */}
        <div className="w-[180px] flex-shrink-0 flex flex-col gap-4">

          {/* Score de viabilité */}
          <div className="border border-border rounded-xl p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.09em] text-muted-foreground mb-2">
              Score de viabilité
            </p>
            {validatorScore ? (
              <>
                <p
                  className="text-foreground tabular-nums font-extrabold leading-none"
                  style={{ fontSize: 40, letterSpacing: '-0.04em' }}
                >
                  {validatorScore}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">Idée fortement validée</p>
              </>
            ) : (
              <>
                <p className="text-[22px] font-extrabold text-muted-foreground/25 leading-none" style={{ letterSpacing: '-0.04em' }}>
                  —
                </p>
                <button
                  onClick={() => navigate('#/dashboard/generator/validate')}
                  className="text-[10px] text-muted-foreground hover:text-foreground transition-colors mt-1 underline underline-offset-2 text-left"
                >
                  Valider ton idée →
                </button>
              </>
            )}
          </div>

          {/* Stack */}
          <div className="border border-border rounded-xl p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.09em] text-muted-foreground mb-3">
              Stack
            </p>
            <div className="flex flex-col gap-2.5">
              {STACK_ITEMS.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => toggleStack(key)}
                  className="flex items-center justify-between w-full group"
                >
                  <div className="flex items-center gap-1.5">
                    <Icon size={11} strokeWidth={1.5} className="text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
                      {label}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full transition-colors"
                      style={{ background: stack[key] ? 'hsl(var(--foreground))' : 'hsl(var(--border))' }}
                    />
                    <span
                      className="text-[9px] font-medium"
                      style={{ color: stack[key] ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground) / 0.4)' }}
                    >
                      {stack[key] ? 'OK' : '—'}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* MRR estimé */}
          <div className="border border-border rounded-xl p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.09em] text-muted-foreground mb-2">
              MRR estimé
            </p>
            {mrrEstimate ? (
              <>
                <p className="text-foreground font-extrabold leading-none" style={{ fontSize: 22, letterSpacing: '-0.04em' }}>
                  {mrrEstimate}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">Modèle abonnement</p>
              </>
            ) : (
              <>
                <p className="text-[22px] font-extrabold text-muted-foreground/25 leading-none" style={{ letterSpacing: '-0.04em' }}>
                  —
                </p>
                <button
                  onClick={() => navigate('#/dashboard/generator/mrr')}
                  className="text-[10px] text-muted-foreground hover:text-foreground transition-colors mt-1 underline underline-offset-2 text-left"
                >
                  Calculer →
                </button>
              </>
            )}
          </div>

          {/* Modifier projet */}
          <button
            onClick={() => navigate('#/dashboard/project')}
            className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <FolderOpen size={11} strokeWidth={1.5} />
            Modifier le projet
          </button>
        </div>

      </div>
    </div>
  )
}
