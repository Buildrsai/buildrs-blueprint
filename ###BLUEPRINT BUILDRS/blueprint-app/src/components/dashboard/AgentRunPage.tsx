import { useState, useEffect, useRef, useCallback } from 'react'
import {
  ArrowLeft, Copy, Download, ChevronDown, ChevronUp,
  Plus, Loader2, RotateCcw, RefreshCw, AlertCircle
} from 'lucide-react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { supabase } from '../../lib/supabase'
import { runAgent, AgentError } from '../../lib/agents/runAgent'
import { AGENTS_CONFIG, type AgentSlug, type AgentInputField } from '../../lib/agents/config'
import { Input } from '../ui/input'

// ── Types ────────────────────────────────────────────────────────────────────

interface AgentProject {
  id: string
  name: string
  idea_description: string | null
  target_audience: string | null
  preferred_stack: string | null
  mrr_goal: string | null
  created_at: string
}

interface HistoryEntry {
  id: string
  agent_slug: string
  input_data: Record<string, string>
  output_content: string
  status: string
  input_tokens: number | null
  output_tokens: number | null
  created_at: string
}

type PageState = 'init' | 'empty' | 'idle' | 'running' | 'output'

interface OutputData {
  content: string
  format: string
  tokens: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "à l'instant"
  if (mins < 60) return `il y a ${mins}min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `il y a ${hours}h`
  return `il y a ${Math.floor(hours / 24)}j`
}

function formatTokens(input: number | null, output: number | null): string {
  if (!input && !output) return ''
  const total = (input ?? 0) + (output ?? 0)
  return total >= 1000 ? `${(total / 1000).toFixed(1)}k tokens` : `${total} tokens`
}

function truncate(s: string | undefined | null, len = 20): string {
  if (!s) return '—'
  return s.length > len ? s.slice(0, len) + '…' : s
}

function formatElapsed(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  return `${Math.floor(seconds / 60)}min ${seconds % 60}s`
}

function renderMarkdown(md: string): string {
  const raw = String(marked.parse(md))
  return DOMPurify.sanitize(raw)
}

function getAccentHex(accentColor: string): string {
  const map: Record<string, string> = {
    'text-violet-400': '#a78bfa',
    'text-sky-400': '#38bdf8',
    'text-pink-400': '#f472b6',
    'text-amber-400': '#fbbf24',
    'text-purple-400': '#c084fc',
    'text-cyan-400': '#22d3ee',
    'text-orange-400': '#fb923c',
  }
  return map[accentColor] ?? '#6b7280'
}

// ── CreateProjectModal ───────────────────────────────────────────────────────

interface CreateProjectModalProps {
  userId: string
  onClose: () => void
  onCreated: (project: AgentProject) => void
}

function CreateProjectModal({ userId, onClose, onCreated }: CreateProjectModalProps) {
  const [name, setName] = useState('')
  const [ideaDescription, setIdeaDescription] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [mrrGoal, setMrrGoal] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreate() {
    if (!name.trim() || !ideaDescription.trim() || !targetAudience.trim()) return
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('agent_projects')
      .insert({
        user_id: userId,
        name: name.trim(),
        idea_description: ideaDescription.trim(),
        target_audience: targetAudience.trim(),
        mrr_goal: mrrGoal.trim() || null,
      })
      .select()
      .single()
    setLoading(false)
    if (err || !data) { setError('Erreur lors de la création. Réessaie.'); return }
    onCreated(data as AgentProject)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <h2 className="text-lg font-bold text-foreground mb-1">Nouveau projet</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Les agents ont besoin d'un contexte pour générer des outputs pertinents.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Nom du projet <span className="text-red-400">*</span>
            </label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Mon SaaS pour coachs"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Idée en 2-3 phrases <span className="text-red-400">*</span>
            </label>
            <textarea
              value={ideaDescription}
              onChange={e => setIdeaDescription(e.target.value)}
              placeholder="Un SaaS qui aide les coachs à automatiser leurs comptes-rendus de séances..."
              rows={3}
              className="flex w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Cible <span className="text-red-400">*</span>
            </label>
            <Input
              value={targetAudience}
              onChange={e => setTargetAudience(e.target.value)}
              placeholder="Coachs indépendants francophones"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Objectif MRR{' '}
              <span className="text-muted-foreground font-normal">(optionnel)</span>
            </label>
            <Input
              value={mrrGoal}
              onChange={e => setMrrGoal(e.target.value)}
              placeholder="3 000€/mois"
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-400 mt-3">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !name.trim() || !ideaDescription.trim() || !targetAudience.trim()}
            className="flex-1 bg-foreground text-background rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {loading ? 'Création…' : 'Créer le projet'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── AgentProjectSwitcher ─────────────────────────────────────────────────────

interface AgentProjectSwitcherProps {
  projects: AgentProject[]
  selected: AgentProject | null
  onSelect: (p: AgentProject) => void
  onCreateNew: () => void
}

function AgentProjectSwitcher({ projects, selected, onSelect, onCreateNew }: AgentProjectSwitcherProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 border border-border rounded-xl px-4 py-2 text-sm font-medium bg-secondary hover:bg-secondary/80 transition-colors"
      >
        <span className="max-w-[180px] truncate">{selected?.name ?? 'Sélectionner un projet'}</span>
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          className={`transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 w-64 bg-card border border-border rounded-xl shadow-lg z-20 py-1 overflow-hidden">
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => { onSelect(p); setOpen(false) }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-secondary transition-colors ${
                selected?.id === p.id ? 'font-semibold text-foreground' : 'text-muted-foreground'
              }`}
            >
              {p.name}
            </button>
          ))}
          <div className="border-t border-border mt-1 pt-1">
            <button
              onClick={() => { onCreateNew(); setOpen(false) }}
              className="w-full text-left px-4 py-2.5 text-sm text-muted-foreground hover:bg-secondary transition-colors flex items-center gap-2"
            >
              <Plus size={13} strokeWidth={1.5} />
              Nouveau projet
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── HistoryCard ──────────────────────────────────────────────────────────────

interface HistoryCardProps {
  entry: HistoryEntry
  inputFields: AgentInputField[]
  onLoad: (entry: HistoryEntry) => void
}

function HistoryCard({ entry, inputFields, onLoad }: HistoryCardProps) {
  const [expanded, setExpanded] = useState(false)

  const requiredFields = inputFields.filter(f => f.required).slice(0, 2)
  const preview = requiredFields.map(f => ({
    label: f.label.split(' ').slice(0, 3).join(' '),
    value: truncate(entry.input_data[f.name]),
  }))
  const tokens = formatTokens(entry.input_tokens, entry.output_tokens)

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-card hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <span className="text-[11px] text-muted-foreground shrink-0">{timeAgo(entry.created_at)}</span>
          <div className="flex items-center gap-4 min-w-0">
            {preview.map(p => (
              <span key={p.label} className="text-[11px] min-w-0 truncate">
                <span className="text-muted-foreground">{p.label} :</span>{' '}
                <span className="text-foreground/80">{p.value}</span>
              </span>
            ))}
          </div>
          {tokens && (
            <span className="text-[10px] font-mono text-muted-foreground shrink-0">{tokens}</span>
          )}
        </div>
        {expanded
          ? <ChevronUp size={14} strokeWidth={1.5} className="shrink-0 text-muted-foreground" />
          : <ChevronDown size={14} strokeWidth={1.5} className="shrink-0 text-muted-foreground" />
        }
      </button>
      {expanded && (
        <div className="px-4 py-4 border-t border-border bg-secondary/20">
          <div
            className="prose prose-sm max-w-none text-foreground text-sm line-clamp-6 mb-3 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(entry.output_content) }}
          />
          <button
            onClick={() => onLoad(entry)}
            className="text-xs font-medium text-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-secondary transition-colors"
          >
            Charger ce run
          </button>
        </div>
      )}
    </div>
  )
}

// ── AgentRunForm ─────────────────────────────────────────────────────────────

interface AgentRunFormProps {
  config: NonNullable<(typeof AGENTS_CONFIG)[AgentSlug]>
  formValues: Record<string, string>
  setField: (name: string, value: string) => void
  onRun: () => void
  isRunning: boolean
  selectedProject: AgentProject | null
  elapsed: number
  error: string | null
}

function AgentRunForm({
  config, formValues, setField, onRun, isRunning, selectedProject, elapsed, error
}: AgentRunFormProps) {
  const isValid = config.inputFields.filter(f => f.required).every(f => formValues[f.name]?.trim())

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-base font-bold text-foreground mb-5">Paramètres du run</h2>
      <div className="space-y-5">
        {config.inputFields.map(field => (
          <div key={field.name}>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              {field.label}
              {field.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {field.helperText && (
              <p className="text-[11px] text-muted-foreground mb-1.5">{field.helperText}</p>
            )}
            {field.type === 'textarea' ? (
              <textarea
                value={formValues[field.name] ?? ''}
                onChange={e => setField(field.name, e.target.value)}
                placeholder={field.placeholder}
                rows={4}
                disabled={isRunning}
                className="flex w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50"
              />
            ) : field.type === 'select' ? (
              <select
                value={formValues[field.name] ?? ''}
                onChange={e => setField(field.name, e.target.value)}
                disabled={isRunning}
                className="flex h-9 w-full rounded-md border border-input bg-secondary px-3 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 cursor-pointer appearance-none"
              >
                <option value="">Sélectionner…</option>
                {field.options?.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <Input
                value={formValues[field.name] ?? ''}
                onChange={e => setField(field.name, e.target.value)}
                placeholder={field.placeholder}
                disabled={isRunning}
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
          <AlertCircle size={14} strokeWidth={1.5} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        {isRunning ? (
          <span className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
            <Loader2 size={12} strokeWidth={1.5} className="animate-spin" />
            {formatElapsed(elapsed)}
          </span>
        ) : (
          <span />
        )}
        <button
          onClick={onRun}
          disabled={isRunning || !selectedProject || !isValid}
          className="bg-foreground text-background rounded-xl px-6 py-2.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          {isRunning && <Loader2 size={14} strokeWidth={1.5} className="animate-spin" />}
          {isRunning ? 'Génération en cours…' : 'Lancer →'}
        </button>
      </div>
    </div>
  )
}

// ── AgentRunPage (main) ──────────────────────────────────────────────────────

interface Props {
  agentSlug: string
  navigate: (hash: string) => void
  hasPack: boolean
}

export function AgentRunPage({ agentSlug, navigate, hasPack }: Props) {
  const config = AGENTS_CONFIG[agentSlug as AgentSlug]

  const [pageState, setPageState] = useState<PageState>('init')
  const [userId, setUserId] = useState<string | null>(null)
  const [projects, setProjects] = useState<AgentProject[]>([])
  const [selectedProject, setSelectedProject] = useState<AgentProject | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [output, setOutput] = useState<OutputData | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('[AgentRunPage] guard check', { agentSlug, configDefined: !!config, hasPack })
    if (!config || !hasPack) {
      console.log('[AgentRunPage] REDIRECTING → reason:', !config ? 'no config' : 'no pack')
      navigate('#/dashboard/agents')
    }
  }, [config, hasPack, navigate])

  // Load user + projects
  useEffect(() => {
    if (!config) return
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('#/signin'); return }
      setUserId(user.id)
      const { data: projs } = await supabase
        .from('agent_projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      const list = (projs ?? []) as AgentProject[]
      setProjects(list)
      if (list.length === 0) {
        setPageState('empty')
      } else {
        setSelectedProject(list[0])
        setPageState('idle')
      }
    }
    init()
  }, [config, navigate])

  // Load history when project changes
  useEffect(() => {
    if (!selectedProject || !config) return
    supabase
      .from('agent_outputs')
      .select('*')
      .eq('project_id', selectedProject.id)
      .eq('agent_slug', agentSlug)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => setHistory((data ?? []) as HistoryEntry[]))
  }, [selectedProject, agentSlug, config])

  const refreshHistory = useCallback(async (projectId: string) => {
    const { data } = await supabase
      .from('agent_outputs')
      .select('*')
      .eq('project_id', projectId)
      .eq('agent_slug', agentSlug)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(10)
    setHistory((data ?? []) as HistoryEntry[])
  }, [agentSlug])

  // Pre-fill form from selected project fields
  useEffect(() => {
    if (!selectedProject || !config) return
    setFormValues(
      Object.fromEntries(
        config.inputFields.map(f => [
          f.name,
          selectedProject[f.name as keyof AgentProject] != null
            ? String(selectedProject[f.name as keyof AgentProject])
            : ''
        ])
      )
    )
  }, [selectedProject?.id])

  const handleProjectSelect = useCallback((p: AgentProject) => {
    setSelectedProject(p)
    setOutput(null)
    setError(null)
    setPageState('idle')
  }, [])

  const handleProjectCreated = useCallback((p: AgentProject) => {
    setProjects(prev => [p, ...prev])
    setSelectedProject(p)
    setShowCreateModal(false)
    setPageState('idle')
  }, [])

  function setField(name: string, value: string) {
    setFormValues(prev => ({ ...prev, [name]: value }))
  }

  async function handleRun() {
    if (!selectedProject || !userId) return
    setPageState('running')
    setError(null)
    setElapsed(0)
    elapsedRef.current = setInterval(() => setElapsed(e => e + 1), 1000)

    try {
      const result = await runAgent({
        projectId: selectedProject.id,
        agentSlug: agentSlug as AgentSlug,
        inputData: formValues,
      })
      const tokens = formatTokens(result.inputTokens, result.outputTokens)
      setOutput({ content: result.content, format: result.outputFormat, tokens })
      setPageState('output')
      await refreshHistory(selectedProject.id)
    } catch (err) {
      if (err instanceof AgentError) {
        if (err.code === 'unauthorized') { navigate('#/signin'); return }
        if (err.code === 'no_entitlement') { navigate('#/dashboard/agents'); return }
        setError(err.message)
      } else {
        setError('Une erreur est survenue. Réessaie dans quelques secondes.')
      }
      setPageState('idle')
    } finally {
      if (elapsedRef.current) clearInterval(elapsedRef.current)
    }
  }

  function handleCopy() {
    if (output) navigator.clipboard.writeText(output.content)
  }

  function handleDownload() {
    if (!output) return
    const ext = output.format === 'sql' ? 'sql' : 'md'
    const blob = new Blob([output.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${agentSlug}-output.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleModifyAndRerun() {
    setOutput(null)
    setPageState('idle')
  }

  function handleNewRun() {
    setFormValues({})
    setOutput(null)
    setPageState('idle')
  }

  function handleLoadFromHistory(entry: HistoryEntry) {
    setFormValues(entry.input_data as Record<string, string>)
    setOutput(null)
    setPageState('idle')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!config || !hasPack) return null

  const accentHex = getAccentHex(config.accentColor)
  const isRunning = pageState === 'running'
  const showSwitcher = pageState !== 'init' && pageState !== 'empty' && projects.length > 0

  const historySection = history.length > 0 && (
    <div>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
        Historique
      </h3>
      <div className="space-y-2">
        {history.map(entry => (
          <HistoryCard
            key={entry.id}
            entry={entry}
            inputFields={config.inputFields}
            onLoad={handleLoadFromHistory}
          />
        ))}
      </div>
    </div>
  )

  return (
    <div className="max-w-[800px] mx-auto px-5 py-10">
      {/* Back */}
      <button
        onClick={() => navigate('#/dashboard/agents')}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={14} strokeWidth={1.5} />
        Retour aux agents
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${config.bgAccentColor}`}
            style={{ boxShadow: `0 0 0 1px ${accentHex}33` }}
          >
            <div className={isRunning ? 'animate-pulse' : ''}>
              <img
                src={config.logoPath}
                alt={config.name}
                width={26}
                height={26}
                className="object-contain"
              />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {config.phase}
            </p>
            <h1
              className="text-2xl font-extrabold text-foreground"
              style={{ letterSpacing: '-0.04em' }}
            >
              {config.name}
            </h1>
            <p className="text-sm text-muted-foreground">{config.role}</p>
          </div>
        </div>

        {showSwitcher && (
          <AgentProjectSwitcher
            projects={projects}
            selected={selectedProject}
            onSelect={handleProjectSelect}
            onCreateNew={() => setShowCreateModal(true)}
          />
        )}
      </div>

      {/* INIT */}
      {pageState === 'init' && (
        <div className="rounded-2xl border border-border bg-card p-10 flex items-center justify-center">
          <Loader2 size={20} strokeWidth={1.5} className="animate-spin text-muted-foreground" />
        </div>
      )}

      {/* EMPTY */}
      {pageState === 'empty' && (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <Plus size={20} strokeWidth={1.5} className="text-muted-foreground" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">Crée ton premier projet</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Les agents ont besoin d'un contexte projet pour générer des outputs pertinents.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="cta-rainbow relative bg-foreground text-background rounded-xl px-6 py-3 text-sm font-semibold"
          >
            Créer un projet
          </button>
        </div>
      )}

      {/* IDLE / RUNNING */}
      {(pageState === 'idle' || pageState === 'running') && (
        <div className="space-y-8">
          <AgentRunForm
            config={config}
            formValues={formValues}
            setField={setField}
            onRun={handleRun}
            isRunning={isRunning}
            selectedProject={selectedProject}
            elapsed={elapsed}
            error={error}
          />
          {historySection}
        </div>
      )}

      {/* OUTPUT */}
      {pageState === 'output' && output && (
        <div className="space-y-6">
          {/* Sticky toolbar */}
          <div
            ref={toolbarRef}
            className="sticky top-0 z-10 -mx-5 px-5 py-3 bg-background/95 backdrop-blur border-b border-border flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-foreground">
                {config.name}
              </span>
              {output.tokens && (
                <span className="text-[10px] font-mono text-muted-foreground">{output.tokens}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 border border-border rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-secondary transition-colors"
              >
                <Copy size={12} strokeWidth={1.5} />
                Copier
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 border border-border rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-secondary transition-colors"
              >
                <Download size={12} strokeWidth={1.5} />
                {output.format === 'sql' ? '.sql' : '.md'}
              </button>
            </div>
          </div>

          {/* Rendered output */}
          <div
            className="rounded-2xl border border-border bg-card p-6 prose prose-sm max-w-none text-foreground [&_h1]:text-xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-semibold [&_code]:text-xs [&_pre]:bg-secondary [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(output.content) }}
          />

          {/* Two re-run buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleModifyAndRerun}
              className="flex-1 flex items-center justify-center gap-2 border border-border rounded-xl px-4 py-3 text-sm font-medium hover:bg-secondary transition-colors"
            >
              <RotateCcw size={14} strokeWidth={1.5} />
              Modifier et relancer
            </button>
            <button
              onClick={handleNewRun}
              className="flex-1 flex items-center justify-center gap-2 border border-border rounded-xl px-4 py-3 text-sm font-medium hover:bg-secondary transition-colors"
            >
              <RefreshCw size={14} strokeWidth={1.5} />
              Nouveau run vierge
            </button>
          </div>

          {historySection}
        </div>
      )}

      {/* Create project modal */}
      {showCreateModal && userId && (
        <CreateProjectModal
          userId={userId}
          onClose={() => setShowCreateModal(false)}
          onCreated={handleProjectCreated}
        />
      )}
    </div>
  )
}
