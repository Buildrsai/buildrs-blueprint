import { useState, useCallback } from 'react'
import { ArrowLeft, Copy, Check, ChevronLeft, ChevronRight, Sparkles, RotateCcw, Plus, X, Download, Wrench, Layers, Bug, Zap } from 'lucide-react'

interface Props {
  navigate: (hash: string) => void
}

const ACCENT = '#8b5cf6'

// ── Types ─────────────────────────────────────────────────────────────────────

type TaskType = 'build' | 'feature' | 'refactor' | 'debug'

interface Agent {
  id: string
  role: string
  description: string
}

interface WizardValues {
  taskType: TaskType | ''
  projectName: string
  taskDescription: string
  agents: Agent[]
  claudeMd: string
  skills: string
  usePlan: boolean
  constraints: string
}

const TASK_CARDS: { id: TaskType; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; label: string; desc: string }[] = [
  { id: 'build',    Icon: Wrench,  label: 'Construire un SaaS complet', desc: 'Créer un produit from scratch avec frontend, backend et paiement' },
  { id: 'feature',  Icon: Zap,     label: 'Ajouter une feature',         desc: 'Ajouter une fonctionnalité à un projet existant' },
  { id: 'refactor', Icon: Layers,  label: 'Refactorer / Migrer',          desc: 'Restructurer ou migrer du code existant' },
  { id: 'debug',    Icon: Bug,     label: 'Résoudre un bug',              desc: 'Investiguer et corriger un problème' },
]

const TASK_PLACEHOLDERS: Record<TaskType, string> = {
  build:    "Ex: Un SaaS de gestion de factures pour freelances, avec dashboard, création de factures, suivi des paiements, et export PDF.",
  feature:  "Ex: Ajouter un dashboard analytics avec un graphique de revenus par mois, le nombre d'utilisateurs actifs, et le taux de churn.",
  refactor: "Ex: Migrer tout le code JavaScript vers TypeScript et restructurer les dossiers par fonctionnalité.",
  debug:    "Ex: Les webhooks Stripe ne se déclenchent pas en production mais fonctionnent en local avec le Stripe CLI.",
}

const AGENT_PRESETS: Record<TaskType, Agent[]> = {
  build: [
    { id: 'a1', role: 'Backend', description: "Crée les API routes, configure Supabase (tables, auth, RLS) et intègre Stripe" },
    { id: 'a2', role: 'Frontend', description: "Construit les pages, composants React, navigation et le design avec Tailwind + shadcn/ui" },
    { id: 'a3', role: 'Tests & Review', description: "Écrit les tests, vérifie la qualité du code et remonte les problèmes en temps réel" },
  ],
  feature: [
    { id: 'a1', role: 'Backend', description: "Crée les endpoints API et les tables Supabase nécessaires pour la feature" },
    { id: 'a2', role: 'Frontend', description: "Construit les composants et pages liés à la feature" },
  ],
  refactor: [
    { id: 'a1', role: 'Module A', description: "Refactore la première partie du code (à préciser)" },
    { id: 'a2', role: 'Module B', description: "Refactore la deuxième partie du code (à préciser)" },
    { id: 'a3', role: 'Tests', description: "Met à jour les tests pour s'assurer que rien ne casse" },
  ],
  debug: [
    { id: 'a1', role: 'Piste 1', description: "Explore la première hypothèse (à préciser)" },
    { id: 'a2', role: 'Piste 2', description: "Explore la deuxième hypothèse (à préciser)" },
    { id: 'a3', role: 'Piste 3', description: "Explore la troisième hypothèse (à préciser)" },
  ],
}

function generatePrompt(v: WizardValues): string {
  const lines: string[] = []

  if (v.claudeMd.trim()) {
    lines.push("⚠️ Contexte projet : j'ai un fichier CLAUDE.md actif dans mon repo.")
    lines.push("Utilise-le pour comprendre l'architecture et les conventions.")
    lines.push("")
  }

  const taskLabel = TASK_CARDS.find(t => t.id === v.taskType)?.label ?? ''
  lines.push(`Projet : ${v.projectName || 'Mon SaaS'}`)
  lines.push(`Tâche : ${taskLabel}`)
  lines.push("")
  lines.push(v.taskDescription)
  lines.push("")
  lines.push(`Crée une équipe de ${v.agents.length} agents :`)
  lines.push("")

  v.agents.forEach((agent, i) => {
    lines.push(`${i + 1}. Teammate "${agent.role}" :`)
    if (agent.description.trim()) {
      agent.description.split('\n').forEach(line => {
        lines.push(`   - ${line.trim()}`)
      })
    }
    lines.push("")
  })

  if (v.skills.trim()) {
    lines.push("Skills disponibles dans le projet :")
    lines.push(v.skills.trim())
    lines.push("")
  }

  if (v.usePlan) {
    lines.push("Commence par planifier l'approche avant d'exécuter.")
    lines.push("")
  }

  lines.push("Règles :")
  lines.push("- Chaque agent ne modifie QUE ses propres fichiers (pas de chevauchement)")
  lines.push("- Communication directe entre agents quand ils partagent des interfaces")
  lines.push("- Le leader synthétise les résultats à la fin")

  if (v.constraints.trim()) {
    v.constraints.split('\n').forEach(line => {
      if (line.trim()) lines.push(`- ${line.trim()}`)
    })
  }

  lines.push("")
  lines.push("Stack : Next.js + TypeScript + Supabase + Stripe + Tailwind + shadcn/ui")

  return lines.join('\n')
}

// ── UI Components ─────────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)}
      className="relative w-10 h-5.5 rounded-full transition-colors flex items-center shrink-0"
      style={{ background: on ? ACCENT : 'rgba(255,255,255,0.1)', width: 40, height: 22, border: `0.5px solid ${on ? ACCENT : 'rgba(255,255,255,0.15)'}` }}>
      <div className="absolute rounded-full w-4 h-4 transition-all"
        style={{ background: 'white', left: on ? 20 : 3, width: 16, height: 16 }} />
    </button>
  )
}

function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const doCopy = useCallback(() => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }, [text])
  return (
    <button onClick={doCopy}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all"
      style={{ background: copied ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)', border: `0.5px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`, color: copied ? '#22c55e' : '#94a3b8' }}>
      {copied ? <Check size={12} strokeWidth={2} /> : <Copy size={12} strokeWidth={1.5} />}
      {copied ? 'Copié !' : label ?? 'Copier'}
    </button>
  )
}

// ── Steps ─────────────────────────────────────────────────────────────────────

function Step1({ values, onChange }: { values: WizardValues; onChange: (v: Partial<WizardValues>) => void }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {TASK_CARDS.map(t => {
          const active = values.taskType === t.id
          return (
            <button key={t.id} onClick={() => onChange({ taskType: t.id, agents: t.id ? AGENT_PRESETS[t.id].map(a => ({ ...a })) : [] })}
              className="text-left px-4 py-4 rounded-xl transition-all"
              style={{
                background: active ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.03)',
                border: `0.5px solid ${active ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.07)'}`,
              }}>
              <div className="flex items-center gap-2 mb-2">
                <t.Icon size={16} strokeWidth={1.5} style={{ color: active ? ACCENT : '#5b6078' }} />
                <span className="text-[12px] font-semibold" style={{ color: active ? '#e2e8f0' : '#94a3b8' }}>{t.label}</span>
              </div>
              <p className="text-[11px]" style={{ color: '#5b6078' }}>{t.desc}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Step2({ values, onChange }: { values: WizardValues; onChange: (v: Partial<WizardValues>) => void }) {
  const ph = values.taskType ? TASK_PLACEHOLDERS[values.taskType as TaskType] : "Décris ce que tu veux construire ou résoudre..."
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[12px] font-semibold mb-2" style={{ color: '#e2e8f0' }}>Nom du projet <span style={{ color: '#ef4444' }}>*</span></label>
        <input value={values.projectName} onChange={e => onChange({ projectName: e.target.value })}
          placeholder="Mon SaaS"
          className="w-full px-4 py-3 rounded-xl text-[13px] outline-none transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: `0.5px solid ${values.projectName ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`, color: '#e2e8f0' }} />
      </div>
      <div>
        <label className="block text-[12px] font-semibold mb-2" style={{ color: '#e2e8f0' }}>Description de la tâche <span style={{ color: '#ef4444' }}>*</span></label>
        <textarea value={values.taskDescription} onChange={e => onChange({ taskDescription: e.target.value })}
          placeholder={ph} rows={5}
          className="w-full px-4 py-3 rounded-xl text-[13px] outline-none transition-all resize-none"
          style={{ background: 'rgba(255,255,255,0.04)', border: `0.5px solid ${values.taskDescription ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`, color: '#e2e8f0' }} />
      </div>
      <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
        <p className="text-[12px]" style={{ color: '#94a3b8' }}>
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Conseil :</span> Sois précis sur les fonctionnalités, pas sur la technique. Dis "créer des factures avec export PDF" plutôt que "créer un endpoint API REST". Claude Code s'occupe de la technique.
        </p>
      </div>
    </div>
  )
}

function Step3({ values, onChange }: { values: WizardValues; onChange: (v: Partial<WizardValues>) => void }) {
  const updateAgent = (id: string, field: 'role' | 'description', val: string) => {
    onChange({ agents: values.agents.map(a => a.id === id ? { ...a, [field]: val } : a) })
  }
  const removeAgent = (id: string) => {
    if (values.agents.length > 2) onChange({ agents: values.agents.filter(a => a.id !== id) })
  }
  const addAgent = () => {
    if (values.agents.length < 4) {
      const newId = `a${Date.now()}`
      onChange({ agents: [...values.agents, { id: newId, role: '', description: '' }] })
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-3 mb-2" style={{ background: 'rgba(77,150,255,0.06)', border: '0.5px solid rgba(77,150,255,0.15)' }}>
        <p className="text-[12px]" style={{ color: '#94a3b8' }}>
          <span style={{ color: ACCENT, fontWeight: 600 }}>Comment ça marche :</span> Chaque agent travaille en parallèle sur sa partie du projet. Ils communiquent entre eux automatiquement. Le leader te livre le résultat final.
        </p>
      </div>

      {values.agents.map((agent, i) => (
        <div key={agent.id} className="rounded-xl p-4" style={{ border: '0.5px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{ background: `rgba(139,92,246,0.15)`, color: ACCENT, border: `0.5px solid rgba(139,92,246,0.3)` }}>
              {i + 1}
            </span>
            <input value={agent.role} onChange={e => updateAgent(agent.id, 'role', e.target.value)}
              placeholder="Nom du rôle (ex: Backend, Frontend...)"
              className="flex-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', color: '#e2e8f0' }} />
            {values.agents.length > 2 && (
              <button onClick={() => removeAgent(agent.id)}
                className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                style={{ color: '#3d4466', background: 'rgba(255,255,255,0.04)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                onMouseLeave={e => (e.currentTarget.style.color = '#3d4466')}>
                <X size={11} strokeWidth={2} />
              </button>
            )}
          </div>
          <textarea value={agent.description} onChange={e => updateAgent(agent.id, 'description', e.target.value)}
            placeholder="Décris ce que fait cet agent..."
            rows={2}
            className="w-full px-3 py-2.5 rounded-lg text-[12px] outline-none transition-all resize-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', color: '#e2e8f0' }} />
        </div>
      ))}

      {values.agents.length < 4 && (
        <button onClick={addAgent}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[12px] font-medium transition-all"
          style={{ color: '#5b6078', border: '0.5px dashed rgba(255,255,255,0.1)', background: 'transparent' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#5b6078'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}>
          <Plus size={13} strokeWidth={1.5} />
          Ajouter un agent (max 4)
        </button>
      )}
    </div>
  )
}

function Step4({ values, onChange }: { values: WizardValues; onChange: (v: Partial<WizardValues>) => void }) {
  return (
    <div className="space-y-5">
      <p className="text-[12px]" style={{ color: '#5b6078' }}>Tout est optionnel. Plus tu remplis, meilleur sera le prompt généré.</p>

      <div>
        <label className="block text-[12px] font-semibold mb-1" style={{ color: '#e2e8f0' }}>Ton CLAUDE.md</label>
        <p className="text-[11px] mb-2" style={{ color: '#5b6078' }}>Si tu as un fichier CLAUDE.md dans ton projet, colle son contenu ici. Si tu n'en as pas encore, utilise le Générateur CLAUDE.md dans Claude OS.</p>
        <textarea value={values.claudeMd} onChange={e => onChange({ claudeMd: e.target.value })}
          placeholder={`# Mon projet
## Stack
- Next.js + TypeScript + Supabase + Stripe
...`}
          rows={6}
          className="w-full px-4 py-3 rounded-xl text-[11px] outline-none transition-all resize-none"
          style={{ background: 'rgba(0,0,0,0.3)', border: `0.5px solid ${values.claudeMd ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`, color: '#e2e8f0', fontFamily: 'Geist Mono, monospace' }} />
      </div>

      <div>
        <label className="block text-[12px] font-semibold mb-1" style={{ color: '#e2e8f0' }}>Tes Skills actifs</label>
        <p className="text-[11px] mb-2" style={{ color: '#5b6078' }}>Les skills Buildrs ou custom que tu utilises dans ce projet.</p>
        <textarea value={values.skills} onChange={e => onChange({ skills: e.target.value })}
          placeholder="Ex: saas-architecture.md, monetization-patterns.md, supabase-conventions.md"
          rows={2}
          className="w-full px-4 py-3 rounded-xl text-[11px] outline-none transition-all resize-none"
          style={{ background: 'rgba(255,255,255,0.04)', border: `0.5px solid ${values.skills ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`, color: '#e2e8f0', fontFamily: 'Geist Mono, monospace' }} />
      </div>

      <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
        <div>
          <p className="text-[12px] font-semibold" style={{ color: '#e2e8f0' }}>Planifier avant d'exécuter</p>
          <p className="text-[11px]" style={{ color: '#5b6078' }}>Recommandé — Claude planifie d'abord, puis agit. Plus sûr et moins coûteux.</p>
        </div>
        <Toggle on={values.usePlan} onChange={v => onChange({ usePlan: v })} />
      </div>

      <div>
        <label className="block text-[12px] font-semibold mb-1" style={{ color: '#e2e8f0' }}>Contraintes ou précisions</label>
        <textarea value={values.constraints} onChange={e => onChange({ constraints: e.target.value })}
          placeholder={`Ex: Utiliser shadcn/ui pour tous les composants
Ne pas toucher au fichier layout.tsx
Le design doit être en dark mode`}
          rows={3}
          className="w-full px-4 py-3 rounded-xl text-[12px] outline-none transition-all resize-none"
          style={{ background: 'rgba(255,255,255,0.04)', border: `0.5px solid ${values.constraints ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`, color: '#e2e8f0' }} />
      </div>
    </div>
  )
}

function OutputPage({ values, onReset, navigate }: { values: WizardValues; onReset: () => void; navigate: (h: string) => void }) {
  const prompt = generatePrompt(values)
  const projectSlug = (values.projectName || 'mon-saas').toLowerCase().replace(/\s+/g, '-')

  const download = () => {
    const blob = new Blob([prompt], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `team-agents-${projectSlug}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(34,197,94,0.08)', border: '0.5px solid rgba(34,197,94,0.2)' }}>
        <p className="text-[12px] font-semibold" style={{ color: '#22c55e' }}>
          Ton prompt Team Agents est prêt — copie-le et colle-le dans Claude Code pour lancer ton équipe.
        </p>
      </div>

      {/* How to use */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
        <p className="text-[11px] font-semibold mb-1" style={{ color: '#e2e8f0' }}>Comment utiliser ce prompt</p>
        <p className="text-[11px]" style={{ color: '#94a3b8' }}>
          Ouvre ton terminal, navigue vers ton projet avec{' '}
          <code style={{ fontFamily: 'Geist Mono, monospace', color: '#e2e8f0' }}>cd mon-projet</code>,
          lance <code style={{ fontFamily: 'Geist Mono, monospace', color: '#e2e8f0' }}>claude</code>,
          puis colle ce prompt. Claude créera automatiquement l'équipe d'agents et commencera à travailler.
        </p>
      </div>

      {/* Prompt block */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#5b6078' }}>Prompt généré</p>
          <div className="flex items-center gap-2">
            <CopyBtn text={prompt} label="Copier" />
            <button onClick={download}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#e2e8f0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}>
              <Download size={12} strokeWidth={1.5} />
              .md
            </button>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden" style={{ border: '0.5px solid rgba(139,92,246,0.2)', background: 'rgba(139,92,246,0.04)' }}>
          <pre className="px-5 py-5 text-[11px] leading-relaxed overflow-auto"
            style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', color: '#c9d1d9', maxHeight: 420 }}>
            {prompt}
          </pre>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button onClick={onReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-medium transition-all"
          style={{ color: '#5b6078', border: '0.5px solid rgba(255,255,255,0.08)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#e2e8f0')}
          onMouseLeave={e => (e.currentTarget.style.color = '#5b6078')}>
          <RotateCcw size={12} strokeWidth={1.5} />
          Nouveau prompt
        </button>
        <button onClick={() => navigate('#/dashboard/claude-os/apprendre/team-agents/formation')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-medium transition-all"
          style={{ color: '#4d96ff', background: 'rgba(77,150,255,0.08)', border: '0.5px solid rgba(77,150,255,0.2)' }}>
          Relire la formation
        </button>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

const EMPTY_VALUES: WizardValues = {
  taskType: '', projectName: '', taskDescription: '',
  agents: [], claudeMd: '', skills: '', usePlan: true, constraints: '',
}

const TOTAL_STEPS = 4
const STEP_LABELS = ['Type de tâche', 'Décris ton projet', 'Ton équipe', 'Contexte & Options']

export function TeamAgentsGeneratorPage({ navigate }: Props) {
  const [step, setStep] = useState(1)
  const [values, setValues] = useState<WizardValues>(EMPTY_VALUES)
  const [done, setDone] = useState(false)

  const update = useCallback((v: Partial<WizardValues>) => setValues(prev => ({ ...prev, ...v })), [])

  const canNext = () => {
    if (step === 1) return values.taskType !== ''
    if (step === 2) return values.projectName.trim().length >= 2 && values.taskDescription.trim().length >= 10
    if (step === 3) return values.agents.length >= 2 && values.agents.every(a => a.role.trim().length > 0)
    return true
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(s => s + 1)
    else setDone(true)
  }

  const reset = () => {
    setValues(EMPTY_VALUES)
    setStep(1)
    setDone(false)
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: '#080909' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => window.history.back()}
          className="flex items-center gap-2 mb-5 transition-colors"
          style={{ color: '#5b6078' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#e2e8f0')}
          onMouseLeave={e => (e.currentTarget.style.color = '#5b6078')}>
          <ArrowLeft size={14} strokeWidth={1.5} />
          <span className="text-[12px]">Team Agents</span>
        </button>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `rgba(139,92,246,0.15)`, border: `0.5px solid rgba(139,92,246,0.3)` }}>
            <Sparkles size={18} strokeWidth={1.5} style={{ color: ACCENT }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ color: ACCENT, background: 'rgba(139,92,246,0.12)', border: '0.5px solid rgba(139,92,246,0.25)' }}>
                Générateur
              </span>
              <span className="text-[10px]" style={{ color: '#3d4466' }}>4 étapes · Résultat immédiat</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: '#e2e8f0' }}>Générateur Team Agents</h1>
            <p className="text-[13px] mt-1" style={{ color: '#5b6078' }}>
              Décris ce que tu veux construire — on génère le prompt parfait pour lancer ton équipe d'agents en parallèle.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-8 max-w-2xl">
        {/* Progress */}
        {!done && (
          <div className="flex items-center gap-1.5 mb-8 overflow-x-auto pb-1">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="flex items-center gap-1.5 shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-all"
                    style={{
                      background: s < step ? '#22c55e' : s === step ? ACCENT : 'rgba(255,255,255,0.06)',
                      border: `0.5px solid ${s < step ? '#22c55e' : s === step ? ACCENT : 'rgba(255,255,255,0.1)'}`,
                      color: s <= step ? 'white' : '#3d4466',
                    }}>
                    {s < step ? <Check size={10} strokeWidth={3} /> : s}
                  </div>
                  <span className="text-[11px] hidden sm:block" style={{ color: s === step ? '#e2e8f0' : '#3d4466' }}>
                    {STEP_LABELS[s - 1]}
                  </span>
                </div>
                {s < 4 && <ChevronRight size={11} strokeWidth={1.5} style={{ color: '#2a2d3e' }} />}
              </div>
            ))}
          </div>
        )}

        {/* Card */}
        <div className="rounded-2xl p-6 mb-6" style={{ border: '0.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
          {!done ? (
            <>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-[14px] font-semibold" style={{ color: '#e2e8f0' }}>Étape {step} — {STEP_LABELS[step - 1]}</h2>
                </div>
                {done && (
                  <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] transition-all"
                    style={{ color: '#5b6078', border: '0.5px solid rgba(255,255,255,0.08)' }}>
                    <RotateCcw size={11} strokeWidth={1.5} /> Reset
                  </button>
                )}
              </div>
              {step === 1 && <Step1 values={values} onChange={update} />}
              {step === 2 && <Step2 values={values} onChange={update} />}
              {step === 3 && <Step3 values={values} onChange={update} />}
              {step === 4 && <Step4 values={values} onChange={update} />}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[14px] font-semibold" style={{ color: '#e2e8f0' }}>Ton prompt Team Agents</h2>
                  <p className="text-[12px] mt-0.5" style={{ color: '#5b6078' }}>{values.agents.length} agents · {TASK_CARDS.find(t => t.id === values.taskType)?.label}</p>
                </div>
              </div>
              <OutputPage values={values} onReset={reset} navigate={navigate} />
            </>
          )}
        </div>

        {/* Navigation */}
        {!done && (
          <div className="flex items-center justify-between">
            <button onClick={() => step > 1 ? setStep(s => s - 1) : window.history.back()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-medium transition-all"
              style={{ color: '#5b6078', border: '0.5px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#e2e8f0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#5b6078')}>
              <ChevronLeft size={14} strokeWidth={1.5} />
              {step === 1 ? 'Retour' : 'Précédent'}
            </button>
            <button onClick={handleNext} disabled={!canNext()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-semibold transition-all"
              style={{
                background: canNext() ? ACCENT : 'rgba(255,255,255,0.05)',
                color: canNext() ? 'white' : '#3d4466',
                border: `0.5px solid ${canNext() ? ACCENT : 'rgba(255,255,255,0.08)'}`,
                cursor: canNext() ? 'pointer' : 'not-allowed',
              }}>
              {step === TOTAL_STEPS ? (
                <><Sparkles size={13} strokeWidth={1.5} />Générer le prompt</>
              ) : (
                <>Suivant <ChevronRight size={14} strokeWidth={1.5} /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
