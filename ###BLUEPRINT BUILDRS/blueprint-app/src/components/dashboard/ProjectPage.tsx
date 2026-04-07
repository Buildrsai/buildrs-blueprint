import { useState, useEffect } from 'react'
import { FolderOpen, Lightbulb, Hammer, Zap, Plus, ArrowLeft, Trash2, Check } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const ACTIVE_IDEA_KEY = 'buildrs_active_idea'
const ACTIVE_IDEA_EVENT = 'buildrs:active-idea'

function getStoredActiveId(): string | null {
  try { return JSON.parse(localStorage.getItem(ACTIVE_IDEA_KEY) ?? 'null')?.id ?? null } catch { return null }
}

function setStoredActive(id: string, name: string) {
  localStorage.setItem(ACTIVE_IDEA_KEY, JSON.stringify({ id, name }))
  window.dispatchEvent(new CustomEvent(ACTIVE_IDEA_EVENT, { detail: { id, name } }))
}

// ── Types ─────────────────────────────────────────────────────────────────

interface IdeaProject {
  id: string
  user_id: string
  name: string
  problem: string
  target: string
  price: string
  feature: string
  status: 'idea' | 'building' | 'live'
  created_at: string
}

const EMPTY_IDEA: Omit<IdeaProject, 'id' | 'user_id' | 'created_at'> = {
  name: '',
  problem: '',
  target: '',
  price: '',
  feature: '',
  status: 'idea',
}

const STATUS_OPTIONS: {
  value: IdeaProject['status']
  label: string
  color: string
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
}[] = [
  { value: 'idea',     label: 'Idée',            color: '#eab308', Icon: Lightbulb },
  { value: 'building', label: 'En construction', color: '#4d96ff', Icon: Hammer },
  { value: 'live',     label: 'Live',            color: '#22c55e', Icon: Zap },
]

// ── Editable field — auto-save on blur ────────────────────────────────────

function EditableField({
  label, value, placeholder, onSave, multiline = false,
}: {
  label: string
  value: string
  placeholder: string
  onSave: (v: string) => void
  multiline?: boolean
}) {
  const [draft, setDraft] = useState(value)
  useEffect(() => { setDraft(value) }, [value])

  const handleBlur = () => {
    if (draft.trim() !== value) onSave(draft.trim())
  }

  const cls = "w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"

  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={handleBlur}
          rows={3}
          className={`${cls} resize-none`}
          placeholder={placeholder}
        />
      ) : (
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur() }}
          className={cls}
          placeholder={placeholder}
        />
      )}
    </div>
  )
}

// ── Project card (list view) ──────────────────────────────────────────────

function ProjectCard({
  project,
  isActive,
  onClick,
  onSetActive,
}: {
  project: IdeaProject
  isActive: boolean
  onClick: () => void
  onSetActive: () => void
}) {
  const status = STATUS_OPTIONS.find(s => s.value === project.status) ?? STATUS_OPTIONS[0]
  const StatusIcon = status.Icon

  return (
    <div
      className="group w-full text-left rounded-xl p-5 transition-all duration-150"
      style={{
        border: isActive ? '1px solid #22c55e' : '1px solid hsl(var(--border))',
        background: isActive ? 'rgba(34,197,94,0.04)' : 'transparent',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <button
          onClick={onClick}
          className="flex-1 text-left min-w-0"
        >
          <h3 className="text-base font-bold text-foreground truncate hover:opacity-80 transition-opacity">
            {project.name || 'Projet sans nom'}
          </h3>
        </button>
        <div className="flex items-center gap-2 flex-shrink-0">
          {isActive && (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
              <Check size={9} strokeWidth={2.5} />
              Actif
            </span>
          )}
          <span
            className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: `${status.color}15`, color: status.color, border: `1px solid ${status.color}30` }}
          >
            <StatusIcon size={9} strokeWidth={2} />
            {status.label}
          </span>
        </div>
      </div>

      {project.problem ? (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {project.problem}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground/40 italic mb-3">
          Aucun problème défini
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground/60">
          {project.target && <span>Cible : {project.target}</span>}
          {project.price && <span>· {project.price}</span>}
        </div>
        {!isActive && (
          <button
            onClick={e => { e.stopPropagation(); onSetActive() }}
            className="text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-2.5 py-1 hover:border-foreground/30"
          >
            Rendre actif
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────

interface Props {
  navigate: (hash: string) => void
  userId: string | undefined
}

export function ProjectPage({ navigate: _navigate, userId }: Props) {
  const [projects, setProjects] = useState<IdeaProject[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activeIdeaId, setActiveIdeaId] = useState<string | null>(() => getStoredActiveId())
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const selectedProject = projects.find(p => p.id === selectedId) ?? null
  const view: 'list' | 'detail' = selectedId !== null ? 'detail' : 'list'

  // ── Load ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    supabase
      .from('ideas')
      .select('id, user_id, name, problem, target, price, feature, status, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) {
          const list = data as IdeaProject[]
          setProjects(list)
          // Auto-set active if none stored yet
          if (!getStoredActiveId() && list.length > 0) {
            setStoredActive(list[0].id, list[0].name)
            setActiveIdeaId(list[0].id)
          }
        }
        setLoading(false)
      })
  }, [userId])

  // ── Create ─────────────────────────────────────────────────────────────

  const createProject = async () => {
    if (!userId || projects.length >= 3) return
    setCreating(true)
    setCreateError(null)
    const { data, error } = await supabase
      .from('ideas')
      .insert({ user_id: userId, ...EMPTY_IDEA })
      .select('id, user_id, name, problem, target, price, feature, status, created_at')
      .single()
    if (!error && data) {
      setProjects(prev => [...prev, data as IdeaProject])
      setSelectedId(data.id)
    } else if (error) {
      console.error('[ProjectPage] create error:', error.message)
      setCreateError(error.message)
    }
    setCreating(false)
  }

  // ── Update ─────────────────────────────────────────────────────────────

  const updateField = async <K extends keyof typeof EMPTY_IDEA>(key: K, value: typeof EMPTY_IDEA[K]) => {
    if (!selectedId) return
    setProjects(prev => prev.map(p => p.id === selectedId ? { ...p, [key]: value } : p))
    const { error } = await supabase
      .from('ideas')
      .update({ [key]: value })
      .eq('id', selectedId)
    if (error) {
      console.error('[ProjectPage] update error:', error.message)
      // revert
      const { data } = await supabase.from('ideas').select('*').eq('id', selectedId).single()
      if (data) setProjects(prev => prev.map(p => p.id === selectedId ? data as IdeaProject : p))
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────

  const deleteProject = async () => {
    if (!selectedId || deleting) return
    setDeleting(true)
    const { error } = await supabase.from('ideas').delete().eq('id', selectedId)
    if (!error) {
      setProjects(prev => prev.filter(p => p.id !== selectedId))
      setSelectedId(null)
    }
    setDeleting(false)
  }

  // ── Loading ────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="p-7 max-w-3xl">
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-8 w-48 bg-secondary rounded-lg" />
          <div className="h-4 w-64 bg-secondary rounded-lg" />
          <div className="h-32 bg-secondary rounded-xl" />
        </div>
      </div>
    )
  }

  // ── Detail view ────────────────────────────────────────────────────────

  if (view === 'detail' && selectedProject) {
    return (
      <div className="p-7 max-w-3xl">

        {/* Back + Delete */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedId(null)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={13} strokeWidth={1.5} />
            Mes Projets
          </button>
          <button
            onClick={deleteProject}
            disabled={deleting}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-40"
          >
            <Trash2 size={13} strokeWidth={1.5} />
            {deleting ? 'Suppression…' : 'Supprimer'}
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1.5">
            <FolderOpen size={16} strokeWidth={1.5} className="text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Projet</p>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
            {selectedProject.name || 'Nouveau projet'}
          </h1>
          {selectedProject.problem && (
            <p className="text-sm text-muted-foreground mt-1 italic">"{selectedProject.problem}"</p>
          )}
        </div>

        {/* Statut */}
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Statut</p>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map(opt => {
              const active = selectedProject.status === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => updateField('status', opt.value)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
                  style={{
                    borderColor: active ? opt.color : 'hsl(var(--border))',
                    background: active ? `${opt.color}15` : 'transparent',
                    color: active ? opt.color : 'hsl(var(--muted-foreground))',
                  }}
                >
                  <opt.Icon size={11} strokeWidth={1.5} />
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Infos produit */}
        <div className="border border-border rounded-xl p-5 flex flex-col gap-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground -mb-1">Infos produit</p>

          <EditableField
            label="Nom du produit"
            value={selectedProject.name}
            placeholder="ex: InvoiceAI, CalTrack Pro…"
            onSave={v => updateField('name', v)}
          />

          <EditableField
            label="Problème résolu (1 phrase)"
            value={selectedProject.problem}
            placeholder="ex: Les freelances perdent du temps à facturer leurs clients"
            onSave={v => updateField('problem', v)}
            multiline
          />

          <div className="grid grid-cols-2 gap-5">
            <EditableField
              label="Cible"
              value={selectedProject.target}
              placeholder="ex: Freelances dev, PME RH…"
              onSave={v => updateField('target', v)}
            />
            <EditableField
              label="Prix mensuel"
              value={selectedProject.price}
              placeholder="ex: 29€/mois"
              onSave={v => updateField('price', v)}
            />
          </div>

          <EditableField
            label="Feature principale"
            value={selectedProject.feature}
            placeholder="ex: Génération de factures PDF en 1 clic avec IA"
            onSave={v => updateField('feature', v)}
            multiline
          />
        </div>

      </div>
    )
  }

  // ── List view ──────────────────────────────────────────────────────────

  return (
    <div className="p-7 max-w-3xl">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <FolderOpen size={16} strokeWidth={1.5} className="text-muted-foreground" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Mes Projets</p>
        </div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
              Mes Projets
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {projects.length}/3 projets actifs
            </p>
          </div>

          {/* New project CTA */}
          {projects.length < 3 && (
            <button
              onClick={createProject}
              disabled={creating}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border border-foreground bg-foreground text-background hover:opacity-80 disabled:opacity-40 flex-shrink-0"
            >
              <Plus size={14} strokeWidth={2} />
              {creating ? 'Création…' : 'Nouveau projet'}
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {createError && (
        <div className="mb-4 px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500 text-xs">
          Erreur : {createError}
        </div>
      )}

      {/* Project list */}
      {projects.length > 0 ? (
        <div className="flex flex-col gap-3">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              isActive={project.id === activeIdeaId}
              onClick={() => setSelectedId(project.id)}
              onSetActive={() => {
                setStoredActive(project.id, project.name || 'Mon SaaS')
                setActiveIdeaId(project.id)
              }}
            />
          ))}

          {/* Max reached */}
          {projects.length >= 3 && (
            <p className="text-xs text-muted-foreground text-center py-2">
              Limite de 3 projets atteinte. Supprime un projet pour en créer un nouveau.
            </p>
          )}
        </div>
      ) : (
        /* Empty state */
        <div className="border border-dashed border-border rounded-xl p-10 flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
            <FolderOpen size={20} strokeWidth={1.5} className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Aucun projet pour l'instant</p>
            <p className="text-xs text-muted-foreground">
              Crée ton premier projet pour commencer à tracker ton build.
            </p>
          </div>
          <button
            onClick={createProject}
            disabled={creating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-foreground bg-foreground text-background hover:opacity-80 transition-all disabled:opacity-40"
          >
            <Plus size={14} strokeWidth={2} />
            {creating ? 'Création…' : 'Créer mon premier projet'}
          </button>
        </div>
      )}
    </div>
  )
}
