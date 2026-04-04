import { useState, useEffect } from 'react'
import {
  Plus, LayoutGrid, List, CheckCircle2, Circle, Clock, Eye,
  X, ChevronDown, FolderOpen, Zap, Lock,
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useMilestones, type Milestone } from '../../hooks/useMilestones'
import { supabase } from '../../lib/supabase'

interface ProjectInfo {
  name: string
  status: string
  created_at: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const COLUMNS: { key: Milestone['kanban_status']; label: string; color: string }[] = [
  { key: 'todo',        label: 'A faire',    color: '#6b7280' },
  { key: 'in_progress', label: 'En cours',   color: '#3b82f6' },
  { key: 'review',      label: 'A verifier', color: '#f59e0b' },
  { key: 'done',        label: 'Termine',    color: '#22c55e' },
]

const STATUS_ICONS: Record<Milestone['kanban_status'], React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>> = {
  todo:        Circle,
  in_progress: Clock,
  review:      Eye,
  done:        CheckCircle2,
}

// ── Sortable item (list view) ─────────────────────────────────────────────────

function SortableListItem({
  m,
  onStatusChange,
  onOpen,
}: {
  m: Milestone
  onStatusChange: (id: string, status: Milestone['kanban_status']) => void
  onOpen: (m: Milestone) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: m.id })
  const col = COLUMNS.find(c => c.key === m.kanban_status)
  const StatusIcon = STATUS_ICONS[m.kanban_status]

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="border border-border rounded-xl p-4 bg-card hover:border-foreground/20 transition-colors"
    >
      <div className="flex items-center gap-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors cursor-grab active:cursor-grabbing flex-shrink-0 touch-none"
          aria-label="Déplacer"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="4" cy="4" r="1.2" fill="currentColor" />
            <circle cx="4" cy="7" r="1.2" fill="currentColor" />
            <circle cx="4" cy="10" r="1.2" fill="currentColor" />
            <circle cx="10" cy="4" r="1.2" fill="currentColor" />
            <circle cx="10" cy="7" r="1.2" fill="currentColor" />
            <circle cx="10" cy="10" r="1.2" fill="currentColor" />
          </svg>
        </button>

        <StatusIcon size={16} strokeWidth={1.5} style={{ color: col?.color, flexShrink: 0 }} />

        <div className="flex-1 min-w-0">
          <button
            onClick={() => onOpen(m)}
            className={`text-sm font-medium text-left hover:underline underline-offset-2 ${m.kanban_status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}
          >
            {m.title}
          </button>
          {m.description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{m.description}</p>
          )}
          {m.notes && (
            <p className="text-xs text-muted-foreground/60 mt-0.5 italic truncate">{m.notes}</p>
          )}
        </div>

        {/* Status selector */}
        <div className="relative flex-shrink-0">
          <select
            value={m.kanban_status}
            onChange={e => onStatusChange(m.id, e.target.value as Milestone['kanban_status'])}
            className="appearance-none text-xs bg-secondary/50 border border-border rounded-lg pl-2 pr-5 py-1 outline-none cursor-pointer"
            style={{ color: col?.color }}
          >
            {COLUMNS.map(c => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
          <ChevronDown size={10} strokeWidth={1.5} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}

// ── Milestone Drawer ──────────────────────────────────────────────────────────

function MilestoneDrawer({
  milestone,
  onClose,
  onUpdate,
  navigate,
  hasPack,
  onMilestoneDone,
}: {
  milestone: Milestone
  onClose: () => void
  onUpdate: (id: string, updates: Partial<Pick<Milestone, 'title' | 'description' | 'kanban_status' | 'notes'>>) => Promise<void>
  navigate: (hash: string) => void
  hasPack?: boolean
  onMilestoneDone?: () => void
}) {
  const [title, setTitle]       = useState(milestone.title)
  const [desc, setDesc]         = useState(milestone.description ?? '')
  const [notes, setNotes]       = useState(milestone.notes ?? '')
  const [status, setStatus]     = useState(milestone.kanban_status)
  const [saving, setSaving]     = useState(false)

  const col = COLUMNS.find(c => c.key === status)

  const handleSave = async () => {
    setSaving(true)
    const wasDone = milestone.kanban_status === 'done'
    await onUpdate(milestone.id, { title, description: desc, notes, kanban_status: status })
    setSaving(false)
    if (!wasDone && status === 'done') onMilestoneDone?.()
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm border-l border-border bg-background flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <p className="text-sm font-bold text-foreground">Detail du milestone</p>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">

          {/* Status */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 block mb-2">Statut</label>
            <div className="flex flex-wrap gap-2">
              {COLUMNS.map(c => (
                <button
                  key={c.key}
                  onClick={() => setStatus(c.key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150"
                  style={{
                    borderColor: status === c.key ? c.color + '60' : 'hsl(var(--border))',
                    background:  status === c.key ? c.color + '15' : 'transparent',
                    color:       status === c.key ? c.color : 'hsl(var(--muted-foreground))',
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 block mb-2">Titre</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-sm font-medium text-foreground bg-secondary/40 border border-border rounded-lg px-3 py-2.5 outline-none focus:border-foreground/30 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 block mb-2">Description</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={3}
              placeholder="Decris cette etape..."
              className="w-full text-sm text-foreground bg-secondary/40 border border-border rounded-lg px-3 py-2.5 outline-none focus:border-foreground/30 transition-colors resize-none placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 block mb-2">Notes personnelles</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              placeholder="Tes notes, idees, liens..."
              className="w-full text-sm text-foreground bg-secondary/40 border border-border rounded-lg px-3 py-2.5 outline-none focus:border-foreground/30 transition-colors resize-none placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Agent lié */}
          {milestone.linked_agent && (
            <div className="rounded-xl border p-4" style={{
              borderColor: hasPack ? 'rgba(77,150,255,0.3)' : 'hsl(var(--border))',
              background:  hasPack ? 'rgba(77,150,255,0.05)' : 'hsl(var(--secondary)/0.3)',
            }}>
              <div className="flex items-center gap-2 mb-1">
                <Zap size={12} strokeWidth={1.5} style={{ color: '#4d96ff', flexShrink: 0 }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">Agent recommande</p>
              </div>
              <p className="text-sm font-semibold text-foreground capitalize mb-0.5">
                {milestone.linked_agent.replace(/-/g, ' ')}
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Cet agent peut t'aider a avancer sur cette etape.
              </p>
              {hasPack ? (
                <button
                  onClick={() => { onClose(); navigate(`#/dashboard/agent-chat/${milestone.linked_agent}`) }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors"
                  style={{ background: '#4d96ff', color: '#fff' }}
                >
                  <Zap size={11} strokeWidth={2} />
                  Lancer l'agent →
                </button>
              ) : (
                <button
                  onClick={() => { onClose(); navigate('#/dashboard/offers') }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-border transition-colors hover:bg-secondary/60"
                >
                  <Lock size={11} strokeWidth={1.5} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Debloquer les agents</span>
                </button>
              )}
            </div>
          )}

          {/* Status badge */}
          <div className="flex items-center gap-2 py-2 border-t border-border">
            <div className="w-2 h-2 rounded-full" style={{ background: col?.color }} />
            <p className="text-xs text-muted-foreground">Statut actuel : <span className="font-semibold text-foreground">{col?.label}</span></p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-150"
            style={{
              background: saving ? 'hsl(var(--secondary))' : 'hsl(var(--foreground))',
              color:      saving ? 'hsl(var(--muted-foreground))' : 'hsl(var(--background))',
            }}
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

interface Props {
  userId: string
  navigate: (hash: string) => void
  hasPack?: boolean
  onMilestoneDone?: () => void
}

export function KanbanPage({ userId, navigate, hasPack, onMilestoneDone }: Props) {
  const { milestones, loading, add, update, reorder, seedDefaults, doneCount } = useMilestones(userId)
  const [view, setView]         = useState<'list' | 'kanban'>('list')
  const [adding, setAdding]     = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [drawerMilestone, setDrawerMilestone] = useState<Milestone | null>(null)
  const [project, setProject]   = useState<ProjectInfo | null>(null)

  useEffect(() => {
    if (!userId) return
    supabase
      .from('projects')
      .select('name,status,created_at')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => { if (data) setProject(data as ProjectInfo) })
  }, [userId])

  const daysSince = project?.created_at
    ? Math.max(1, Math.ceil((Date.now() - new Date(project.created_at).getTime()) / 86400000))
    : null

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = milestones.findIndex(m => m.id === active.id)
    const newIndex = milestones.findIndex(m => m.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const reordered = arrayMove(milestones, oldIndex, newIndex)
    reorder(reordered)
  }

  const handleAdd = async () => {
    if (!newTitle.trim()) return
    await add(newTitle.trim())
    setNewTitle('')
    setAdding(false)
  }

  const percent = milestones.length > 0 ? Math.round((doneCount / milestones.length) * 100) : 0

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-5 h-5 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          {/* Projet info */}
          {project?.name ? (
            <div className="flex items-center gap-2 mb-1">
              <FolderOpen size={13} strokeWidth={1.5} className="text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground">{project.name}</span>
              {daysSince && (
                <span className="text-[10px] text-muted-foreground/50">· Jour {daysSince}</span>
              )}
            </div>
          ) : null}
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight" style={{ letterSpacing: '-0.03em' }}>
            Mon Kanban
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {milestones.length > 0
              ? `${doneCount}/${milestones.length} etapes terminees — ${percent}% complete`
              : 'Configure les etapes de construction de ton projet'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 transition-colors ${view === 'list' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <List size={14} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setView('kanban')}
              className={`px-3 py-1.5 transition-colors ${view === 'kanban' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <LayoutGrid size={14} strokeWidth={1.5} />
            </button>
          </div>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={14} strokeWidth={1.5} />
            Ajouter
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {milestones.length > 0 && (
        <div className="mb-6">
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(percent, 2)}%`, background: 'linear-gradient(90deg, #4d96ff, #22c55e)' }}
            />
          </div>
        </div>
      )}

      {/* Empty state */}
      {milestones.length === 0 && (
        <div className="border border-border rounded-xl p-8 text-center">
          <LayoutGrid size={32} strokeWidth={1} className="text-muted-foreground/40 mx-auto mb-4" />
          <p className="font-semibold text-foreground mb-1">Aucune etape configuree</p>
          <p className="text-sm text-muted-foreground mb-4">
            Cree les etapes de ton projet ou utilise les 8 milestones par defaut.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => seedDefaults()}
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-secondary/60 transition-colors"
            >
              Utiliser les 8 milestones Buildrs
            </button>
            <button
              onClick={() => setAdding(true)}
              className="px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Creer manuellement
            </button>
          </div>
        </div>
      )}

      {/* Add form */}
      {adding && (
        <div className="border border-border rounded-xl p-4 mb-4 flex items-center gap-3">
          <input
            autoFocus
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false) }}
            placeholder="Titre de l'etape..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button onClick={handleAdd} className="px-3 py-1 rounded-lg bg-foreground text-background text-xs font-medium hover:opacity-90">
            Ajouter
          </button>
          <button onClick={() => { setAdding(false); setNewTitle('') }} className="text-muted-foreground hover:text-foreground text-xs">
            Annuler
          </button>
        </div>
      )}

      {/* List view with drag-and-drop */}
      {view === 'list' && milestones.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={milestones.map(m => m.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {milestones.map(m => (
                <SortableListItem
                  key={m.id}
                  m={m}
                  onStatusChange={async (id, status) => {
                    const was = milestones.find(x => x.id === id)?.kanban_status
                    await update(id, { kanban_status: status })
                    if (was !== 'done' && status === 'done') onMilestoneDone?.()
                  }}
                  onOpen={setDrawerMilestone}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Kanban board view */}
      {view === 'kanban' && milestones.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map(col => {
            const colMilestones = milestones.filter(m => m.kanban_status === col.key)
            return (
              <div key={col.key} className="border border-border rounded-xl p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: col.color }} />
                  <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{col.label}</span>
                  <span className="text-xs text-muted-foreground/50 ml-auto">{colMilestones.length}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {colMilestones.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setDrawerMilestone(m)}
                      className="bg-secondary/40 rounded-lg p-2.5 text-left hover:bg-secondary/70 transition-colors w-full"
                    >
                      <p className={`text-xs font-medium ${m.kanban_status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {m.title}
                      </p>
                      {m.description && (
                        <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{m.description}</p>
                      )}
                      {m.linked_agent && (
                        <span className="mt-1.5 inline-block text-[9px] font-bold px-1.5 py-0.5 rounded"
                          style={{ background: 'rgba(77,150,255,0.15)', color: '#4d96ff' }}>
                          {m.linked_agent}
                        </span>
                      )}
                    </button>
                  ))}
                  {colMilestones.length === 0 && (
                    <div className="border border-dashed border-border rounded-lg p-3 text-center">
                      <p className="text-[10px] text-muted-foreground/40">Vide</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Milestone Drawer */}
      {drawerMilestone && (
        <MilestoneDrawer
          milestone={drawerMilestone}
          onClose={() => setDrawerMilestone(null)}
          onUpdate={update}
          navigate={navigate}
          hasPack={hasPack}
          onMilestoneDone={onMilestoneDone}
        />
      )}

    </div>
  )
}
