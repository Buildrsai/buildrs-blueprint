import { useState, useRef, useEffect, useMemo } from 'react'
import {
  CheckCircle2, ChevronRight, ChevronLeft,
  ArrowRight, BookOpen, Zap, TrendingUp, Target,
} from 'lucide-react'
import { getModule } from '../../data/curriculum'
import { MODULE_CHECKLISTS, MODULE_NUM, type CheckStep } from './ModulePage'

// ── Pipeline phases order (display order, not CURRICULUM array order) ─────────
const PIPELINE_MODULE_ORDER = [
  '00', 'setup', '01', 'valider', 'offre', '02', '03', '04', '05', '06', 'scaler',
] as const
type PhaseModuleId = typeof PIPELINE_MODULE_ORDER[number]

// ── Generator links for specific phases ─────────────────────────────────────
const PHASE_GENERATOR: Record<string, { label: string; hash: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }> = {
  '01':      { label: 'NicheFinder',    hash: '#/dashboard/generator/ideas',    Icon: Target },
  'valider': { label: 'MarketPulse',    hash: '#/dashboard/generator/validate', Icon: TrendingUp },
  '06':      { label: 'FlipCalc',       hash: '#/dashboard/generator/mrr',      Icon: Zap },
}

// ── LocalStorage helpers ──────────────────────────────────────────────────────
function readChecked(moduleId: string): Set<number> {
  try {
    const saved = localStorage.getItem(`buildrs_module_checklist_${moduleId}`)
    return saved ? new Set(JSON.parse(saved) as number[]) : new Set()
  } catch { return new Set() }
}

function writeChecked(moduleId: string, set: Set<number>): void {
  localStorage.setItem(`buildrs_module_checklist_${moduleId}`, JSON.stringify([...set]))
}

// ── Pipeline Strip ────────────────────────────────────────────────────────────
interface PipelineStripProps {
  selectedIdx: number
  onSelect: (idx: number) => void
  checkedMap: Record<string, Set<number>>
}

function PipelineStrip({ selectedIdx, onSelect, checkedMap }: PipelineStripProps) {
  const stripRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const el = nodeRefs.current[selectedIdx]
    if (el && stripRef.current) {
      const container = stripRef.current
      const nodeLeft  = el.offsetLeft
      const nodeWidth = el.offsetWidth
      const contWidth = container.offsetWidth
      container.scrollTo({ left: nodeLeft - contWidth / 2 + nodeWidth / 2, behavior: 'smooth' })
    }
  }, [selectedIdx])

  return (
    <div
      ref={stripRef}
      className="overflow-x-auto flex-shrink-0 px-6 pb-4"
      style={{ scrollbarWidth: 'none' }}
    >
      <div className="flex items-start gap-0 min-w-max">
        {PIPELINE_MODULE_ORDER.map((moduleId, idx) => {
          const mod     = getModule(moduleId)
          const num     = MODULE_NUM[moduleId] ?? moduleId
          const steps   = MODULE_CHECKLISTS[moduleId] ?? []
          const checked = checkedMap[moduleId] ?? new Set<number>()
          const done    = checked.size
          const total   = steps.length
          const status  = total === 0 ? 'not_started' : done === 0 ? 'not_started' : done >= total ? 'completed' : 'in_progress'
          const isActive = selectedIdx === idx

          const nextId     = idx < PIPELINE_MODULE_ORDER.length - 1 ? PIPELINE_MODULE_ORDER[idx + 1] : null
          const nextSteps  = nextId ? (MODULE_CHECKLISTS[nextId] ?? []) : []
          const nextDone   = nextId ? (checkedMap[nextId] ?? new Set<number>()).size : 0
          const nextStatus = nextId ? (nextSteps.length === 0 ? 'not_started' : nextDone === 0 ? 'not_started' : nextDone >= nextSteps.length ? 'completed' : 'in_progress') : null

          const lineColor = status === 'completed' && nextStatus === 'completed'
            ? '#22c55e'
            : status === 'completed' || (nextStatus && nextStatus !== 'not_started')
              ? '#3b82f6'
              : 'hsl(var(--border))'

          return (
            <div key={moduleId} className="flex items-start">
              <div className="flex flex-col items-center gap-1.5" style={{ width: 72 }}>
                <button
                  ref={el => { nodeRefs.current[idx] = el }}
                  onClick={() => onSelect(idx)}
                  className="relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: status === 'completed'
                      ? '#22c55e'
                      : status === 'in_progress'
                        ? 'rgba(59,130,246,0.12)'
                        : 'hsl(var(--secondary))',
                    border: `2px solid ${
                      status === 'completed' ? '#22c55e'
                      : status === 'in_progress' ? '#3b82f6'
                      : isActive ? 'hsl(var(--foreground))'
                      : 'hsl(var(--border))'
                    }`,
                    boxShadow: isActive && status !== 'completed' ? '0 0 0 3px rgba(255,255,255,0.06)' : 'none',
                    transform: isActive ? 'scale(1.12)' : 'scale(1)',
                  }}
                >
                  {status === 'completed'
                    ? <CheckCircle2 size={16} strokeWidth={2.5} color="#fff" />
                    : <span
                        className="text-[10px] font-black tabular-nums"
                        style={{ color: status === 'in_progress' ? '#3b82f6' : isActive ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
                      >
                        {num}
                      </span>
                  }
                </button>
                <span
                  className="text-center leading-tight"
                  style={{
                    fontSize: 9,
                    fontWeight: isActive ? 700 : 500,
                    color: status === 'completed' ? '#22c55e' : status === 'in_progress' ? '#3b82f6' : isActive ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                    maxWidth: 68,
                  }}
                >
                  {mod?.title ?? moduleId}
                </span>
                {total > 0 && (
                  <span style={{ fontSize: 8, color: 'hsl(var(--muted-foreground))', opacity: 0.7 }}>
                    {done}/{total}
                  </span>
                )}
              </div>

              {idx < PIPELINE_MODULE_ORDER.length - 1 && (
                <div
                  className="flex-shrink-0 mt-[19px]"
                  style={{ width: 20, height: 2, background: lineColor, transition: 'background 0.3s' }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Phase Detail ──────────────────────────────────────────────────────────────
interface PhaseDetailProps {
  moduleId: string
  phaseIdx: number
  totalPhases: number
  checked: Set<number>
  navigate: (hash: string) => void
  onToggle: (moduleId: string, n: number) => void
  onPrev: () => void
  onNext: () => void
}

function PhaseDetail({ moduleId, phaseIdx, totalPhases, checked, navigate, onToggle, onPrev, onNext }: PhaseDetailProps) {
  const mod   = getModule(moduleId)
  const steps = MODULE_CHECKLISTS[moduleId] ?? []
  const num   = MODULE_NUM[moduleId] ?? moduleId
  const done  = checked.size
  const total = steps.length
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0
  const gen   = PHASE_GENERATOR[moduleId] ?? null

  if (!mod) return null

  return (
    <div className="flex flex-col flex-1">

      {/* Phase header card */}
      <div
        className="mx-6 mb-4 rounded-2xl p-5 flex-shrink-0"
        style={{ background: 'hsl(var(--card))', border: '0.5px solid hsl(var(--border))' }}
      >
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60 mb-0.5">
              Module {num}
            </p>
            <h2 className="text-xl font-extrabold text-foreground mb-3" style={{ letterSpacing: '-0.03em' }}>
              {mod.title}
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(var(--border))' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(pct, pct > 0 ? 2 : 0)}%`,
                    background: done === total && total > 0 ? '#22c55e' : 'linear-gradient(90deg, #4d96ff, #22c55e)',
                  }}
                />
              </div>
              <span
                className="text-[11px] font-bold tabular-nums flex-shrink-0"
                style={{ color: done === total && total > 0 ? '#22c55e' : 'hsl(var(--muted-foreground))' }}
              >
                {done}/{total}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <button
              onClick={() => navigate(`#/dashboard/module/${moduleId}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:opacity-80"
              style={{ background: 'hsl(var(--secondary))', color: 'hsl(var(--foreground))', border: '0.5px solid hsl(var(--border))' }}
            >
              <BookOpen size={11} strokeWidth={1.5} />
              Formation
              <ChevronRight size={10} strokeWidth={1.5} />
            </button>
            {gen && (
              <button
                onClick={() => navigate(gen.hash)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:opacity-80"
                style={{ background: 'rgba(77,150,255,0.1)', color: '#4d96ff', border: '0.5px solid rgba(77,150,255,0.25)' }}
              >
                <gen.Icon size={11} strokeWidth={1.5} />
                {gen.label}
                <ArrowRight size={10} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="px-6 flex-1">
        {steps.length > 0 ? (
          <div className="relative max-w-2xl">
            <div
              className="absolute left-[19px] top-4 bottom-4"
              style={{ width: '1px', background: 'hsl(var(--border))' }}
            />
            <div className="flex flex-col gap-2">
              {steps.map((step: CheckStep) => {
                const isDone = checked.has(step.n)
                return (
                  <div key={step.n} className="relative flex items-start gap-4">
                    <button
                      onClick={() => onToggle(moduleId, step.n)}
                      className="relative z-10 shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 mt-0.5"
                      style={{
                        background: isDone ? 'rgba(34,197,94,0.15)' : 'hsl(var(--secondary))',
                        border: `1px solid ${isDone ? 'rgba(34,197,94,0.4)' : 'hsl(var(--border))'}`,
                      }}
                    >
                      {isDone
                        ? <CheckCircle2 size={16} strokeWidth={2} style={{ color: '#22c55e' }} />
                        : <span className="text-[11px] font-bold text-muted-foreground">{step.n}</span>
                      }
                    </button>
                    <div
                      className="flex-1 rounded-xl px-4 py-3 transition-all duration-150 cursor-pointer"
                      onClick={() => onToggle(moduleId, step.n)}
                      style={{
                        background: isDone ? 'rgba(34,197,94,0.04)' : 'hsl(var(--card))',
                        border: `0.5px solid ${isDone ? 'rgba(34,197,94,0.2)' : 'hsl(var(--border))'}`,
                      }}
                    >
                      <p
                        className="text-[13px] font-semibold mb-0.5"
                        style={{
                          color: isDone ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))',
                          textDecoration: isDone ? 'line-through' : 'none',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {step.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-8 text-center">Checklist en cours de préparation.</p>
        )}

        {done === total && total > 0 && (
          <div
            className="mt-6 max-w-2xl rounded-2xl px-6 py-5 text-center"
            style={{ background: 'rgba(34,197,94,0.06)', border: '0.5px solid rgba(34,197,94,0.25)' }}
          >
            <p className="text-[14px] font-bold mb-1" style={{ color: '#22c55e' }}>Phase validée</p>
            <p className="text-[12px] text-muted-foreground">
              Passe à la phase suivante ou revois la formation pour consolider.
            </p>
          </div>
        )}
      </div>

      {/* Phase navigation */}
      <div className="px-6 py-6 mt-4 flex items-center justify-between flex-shrink-0">
        <button
          onClick={onPrev}
          disabled={phaseIdx === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all disabled:opacity-30"
          style={{ background: 'hsl(var(--secondary))', color: 'hsl(var(--foreground))', border: '0.5px solid hsl(var(--border))' }}
        >
          <ChevronLeft size={13} strokeWidth={1.5} />
          Phase précédente
        </button>
        <span className="text-[11px] font-bold text-muted-foreground tabular-nums">
          {phaseIdx + 1} / {totalPhases}
        </span>
        <button
          onClick={onNext}
          disabled={phaseIdx === totalPhases - 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all disabled:opacity-30"
          style={{ background: 'hsl(var(--secondary))', color: 'hsl(var(--foreground))', border: '0.5px solid hsl(var(--border))' }}
        >
          Phase suivante
          <ChevronRight size={13} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}

// ── Global Progress ───────────────────────────────────────────────────────────
function GlobalProgress({ checkedMap }: { checkedMap: Record<string, Set<number>> }) {
  const total = PIPELINE_MODULE_ORDER.reduce((acc, id) => acc + (MODULE_CHECKLISTS[id]?.length ?? 0), 0)
  const done  = PIPELINE_MODULE_ORDER.reduce((acc, id) => acc + (checkedMap[id]?.size ?? 0), 0)
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="px-6 pb-3 flex-shrink-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          Progression globale
        </span>
        <span
          className="text-[11px] font-bold tabular-nums"
          style={{ color: pct === 100 ? '#22c55e' : 'hsl(var(--muted-foreground))' }}
        >
          {done}/{total} étapes · {pct}%
        </span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'hsl(var(--border))' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: pct === 100 ? '#22c55e' : 'linear-gradient(90deg, #4d96ff, #22c55e)',
          }}
        />
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
interface Props {
  userId: string
  navigate: (hash: string) => void
  hasPack?: boolean
  onMilestoneDone?: () => void
}

export function KanbanPage({ navigate, onMilestoneDone }: Props) {
  // Read all checklists from localStorage on mount
  const [checkedMap, setCheckedMap] = useState<Record<string, Set<number>>>(() => {
    const map: Record<string, Set<number>> = {}
    for (const moduleId of PIPELINE_MODULE_ORDER) {
      map[moduleId] = readChecked(moduleId)
    }
    return map
  })

  // Auto-select first in-progress phase, else first uncompleted
  const [selectedIdx, setSelectedIdx] = useState<number>(() => {
    for (let i = 0; i < PIPELINE_MODULE_ORDER.length; i++) {
      const id    = PIPELINE_MODULE_ORDER[i]
      const steps = MODULE_CHECKLISTS[id] ?? []
      const done  = readChecked(id).size
      if (done > 0 && done < steps.length) return i
    }
    for (let i = 0; i < PIPELINE_MODULE_ORDER.length; i++) {
      const id    = PIPELINE_MODULE_ORDER[i]
      const steps = MODULE_CHECKLISTS[id] ?? []
      const done  = readChecked(id).size
      if (done < steps.length) return i
    }
    return 0
  })

  const handleToggle = (moduleId: string, n: number) => {
    setCheckedMap(prev => {
      const existing     = new Set(prev[moduleId] ?? [])
      const wasCompleted = existing.size === (MODULE_CHECKLISTS[moduleId]?.length ?? 0)
      existing.has(n) ? existing.delete(n) : existing.add(n)
      writeChecked(moduleId, existing)
      if (!wasCompleted && existing.size === (MODULE_CHECKLISTS[moduleId]?.length ?? 0) && onMilestoneDone) {
        onMilestoneDone()
      }
      return { ...prev, [moduleId]: existing }
    })
  }

  const selectedModuleId = PIPELINE_MODULE_ORDER[selectedIdx]

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* Header */}
      <div className="px-6 pt-6 pb-3 flex-shrink-0">
        <h1 className="text-2xl font-extrabold text-foreground mb-1" style={{ letterSpacing: '-0.03em' }}>
          Mon Pipeline
        </h1>
        <p className="text-sm text-muted-foreground">
          Suis l'avancement de ton SaaS étape par étape — 11 phases, de l'idée au lancement.
        </p>
      </div>

      {/* Global progress */}
      <div className="pt-2">
        <GlobalProgress checkedMap={checkedMap} />
      </div>

      {/* Pipeline strip */}
      <div
        className="mx-6 mb-5 rounded-2xl overflow-hidden flex-shrink-0"
        style={{ background: 'hsl(var(--card))', border: '0.5px solid hsl(var(--border))', paddingTop: 16, paddingBottom: 4 }}
      >
        <PipelineStrip
          selectedIdx={selectedIdx}
          onSelect={setSelectedIdx}
          checkedMap={checkedMap}
        />
      </div>

      {/* Phase detail */}
      <PhaseDetail
        moduleId={selectedModuleId}
        phaseIdx={selectedIdx}
        totalPhases={PIPELINE_MODULE_ORDER.length}
        checked={checkedMap[selectedModuleId] ?? new Set()}
        navigate={navigate}
        onToggle={handleToggle}
        onPrev={() => setSelectedIdx(i => Math.max(0, i - 1))}
        onNext={() => setSelectedIdx(i => Math.min(PIPELINE_MODULE_ORDER.length - 1, i + 1))}
      />
    </div>
  )
}
