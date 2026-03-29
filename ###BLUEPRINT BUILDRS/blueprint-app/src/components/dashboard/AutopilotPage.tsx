import { useState, useEffect } from 'react'
import {
  Zap, Check, Circle, Loader2,
  FolderOpen, ArrowRight, Terminal,
  Database, Globe, Mail, Server, CreditCard, Github, ChevronDown, ChevronUp,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { ProjectData } from './ProjectPage'
import { JarvisChat } from '../jarvis/JarvisChat'

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
    steps[0].state = 'done'; steps[1].state = 'done'; steps[2].state = 'done'; steps[3].state = 'active'
  } else if (s === 'live') {
    steps[0].state = 'done'; steps[1].state = 'done'; steps[2].state = 'done'; steps[3].state = 'done'; steps[4].state = 'active'
  }

  return steps
}

interface Props {
  navigate: (hash: string) => void
  userId: string | undefined
  userFirstName?: string
  moduleProgress: (id: string, total: number) => number
}

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

// ── Project sidebar ────────────────────────────────────────────────────────
function ProjectSidebar({
  project, stack, validatorScore, mrrEstimate,
  toggleStack, navigate,
}: {
  project: ProjectData | null
  stack: StackStatus
  validatorScore: string | null
  mrrEstimate: string | null
  toggleStack: (key: keyof StackStatus) => void
  navigate: (hash: string) => void
}) {
  const hasScore = !!validatorScore
  if (!project || !project.name) {
    return (
      <div className="flex flex-col gap-3">
        <div className="border border-border rounded-xl p-4 text-center">
          <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
            Définis ton projet pour activer le suivi de progression.
          </p>
          <button
            onClick={() => navigate('#/dashboard/project')}
            className="flex items-center gap-1.5 mx-auto text-[11px] font-semibold bg-foreground text-background px-3 py-2 rounded-lg hover:opacity-85 transition-opacity"
          >
            <FolderOpen size={11} strokeWidth={1.5} />
            Définir le projet
          </button>
        </div>
      </div>
    )
  }

  const steps = buildSteps(project, hasScore, validatorScore)
  const activeStep = steps.find(s => s.state === 'active')

  return (
    <div className="flex flex-col gap-4">
      {/* Project name */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.09em] text-muted-foreground mb-1">Projet actif</p>
        <p className="text-[14px] font-bold text-foreground tracking-[-0.02em] leading-tight">{project.name}</p>
        {project.problem && (
          <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed line-clamp-2">{project.problem}</p>
        )}
      </div>

      {/* Timeline mini */}
      <div className="border border-border rounded-xl p-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.09em] text-muted-foreground mb-3">Progression</p>
        <div className="flex flex-col gap-2">
          {steps.map(step => (
            <div key={step.n} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                style={
                  step.state === 'done'
                    ? { background: 'hsl(var(--foreground))', color: 'hsl(var(--background))' }
                    : step.state === 'active'
                      ? { background: 'hsl(var(--foreground))', color: 'hsl(var(--background))' }
                      : { background: 'transparent', border: '1px solid hsl(var(--border))' }
                }
              >
                {step.state === 'done'
                  ? <Check size={8} strokeWidth={2.5} />
                  : step.state === 'active'
                    ? <Zap size={8} strokeWidth={2} />
                    : <Circle size={6} strokeWidth={1.5} />
                }
              </div>
              <span
                className="text-[11px] truncate"
                style={{
                  color: step.state === 'pending'
                    ? 'hsl(var(--muted-foreground) / 0.4)'
                    : 'hsl(var(--foreground))',
                  fontWeight: step.state === 'active' ? 600 : 400,
                }}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
        {activeStep && (
          <button
            onClick={() => {
              if (activeStep.n === 1) navigate('#/dashboard/generator/validate')
              else if (activeStep.n === 2) navigate('#/dashboard/module/03')
              else if (activeStep.n === 3) navigate('#/dashboard/module/02')
              else if (activeStep.n === 4) navigate('#/dashboard/module/04')
              else navigate('#/dashboard/module/05')
            }}
            className="mt-3 w-full flex items-center justify-between text-[10px] font-semibold text-foreground border border-border rounded-lg px-2.5 py-2 hover:bg-secondary transition-colors"
          >
            <span>Étape suivante</span>
            <ArrowRight size={10} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Score */}
      <div className="border border-border rounded-xl p-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.09em] text-muted-foreground mb-2">Score de viabilité</p>
        {validatorScore ? (
          <>
            <p className="text-foreground tabular-nums font-extrabold" style={{ fontSize: 32, letterSpacing: '-0.04em', lineHeight: 1 }}>
              {validatorScore}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">Idée fortement validée</p>
          </>
        ) : (
          <button
            onClick={() => navigate('#/dashboard/generator/validate')}
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2 text-left"
          >
            Valider ton idée →
          </button>
        )}
      </div>

      {/* Stack */}
      <div className="border border-border rounded-xl p-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.09em] text-muted-foreground mb-3">Stack</p>
        <div className="flex flex-col gap-2">
          {STACK_ITEMS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => toggleStack(key)}
              className="flex items-center justify-between w-full group"
            >
              <div className="flex items-center gap-1.5">
                <Icon size={10} strokeWidth={1.5} className="text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
              </div>
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: stack[key] ? '#22c55e' : 'hsl(var(--border))' }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* MRR */}
      <div className="border border-border rounded-xl p-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.09em] text-muted-foreground mb-2">MRR estimé</p>
        {mrrEstimate ? (
          <>
            <p className="text-foreground font-extrabold" style={{ fontSize: 20, letterSpacing: '-0.04em' }}>{mrrEstimate}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Modèle abonnement</p>
          </>
        ) : (
          <button
            onClick={() => navigate('#/dashboard/generator/mrr')}
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2 text-left"
          >
            Calculer →
          </button>
        )}
      </div>

      {/* Edit project */}
      <button
        onClick={() => navigate('#/dashboard/project')}
        className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
      >
        <FolderOpen size={10} strokeWidth={1.5} />
        Modifier le projet
      </button>
    </div>
  )
}

// ── Component ──────────────────────────────────────────────────────────────
export function AutopilotPage({ navigate, userId, userFirstName: _userFirstName, moduleProgress: _moduleProgress }: Props) {
  const [project, setProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [stack, setStack] = useState<StackStatus>(DEFAULT_STACK)
  const [validatorScore, setValidatorScore] = useState<string | null>(null)
  const [mrrEstimate, setMrrEstimate] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  if (loading) {
    return (
      <div className="flex-1 flex items-center gap-3 text-muted-foreground px-8">
        <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
        <span className="text-sm">Chargement…</span>
      </div>
    )
  }

  return (
    <div className="flex h-full overflow-hidden">

      {/* ── Chat principal ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        <JarvisChat navigate={navigate} userId={userId} />
      </div>

      {/* ── Sidebar projet — desktop ── */}
      <div className="hidden lg:flex w-[280px] flex-shrink-0 border-l border-border flex-col overflow-y-auto">
        <div className="p-5">
          <ProjectSidebar
            project={project}
            stack={stack}
            validatorScore={validatorScore}
            mrrEstimate={mrrEstimate}
            toggleStack={toggleStack}
            navigate={navigate}
          />
        </div>
      </div>

      {/* ── Sidebar projet — mobile collapsible ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-background border-t border-border">
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="w-full flex items-center justify-between px-5 py-3 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>{project?.name ? `Projet : ${project.name}` : 'Mon projet'}</span>
          {sidebarOpen ? <ChevronDown size={14} strokeWidth={1.5} /> : <ChevronUp size={14} strokeWidth={1.5} />}
        </button>
        {sidebarOpen && (
          <div className="px-5 pb-5 max-h-[60vh] overflow-y-auto">
            <ProjectSidebar
              project={project}
              stack={stack}
              validatorScore={validatorScore}
              mrrEstimate={mrrEstimate}
              toggleStack={toggleStack}
              navigate={navigate}
            />
          </div>
        )}
      </div>

    </div>
  )
}
