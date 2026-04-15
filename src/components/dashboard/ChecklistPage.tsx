import { useState, useEffect, useRef } from 'react'
import { CheckCircle2, Circle, Rocket } from 'lucide-react'
import { CURRICULUM } from '../../data/curriculum'
import { supabase } from '../../lib/supabase'

const MODULE_COLORS: Record<string, string> = {
  '00': '#4d96ff',
  'setup': '#22c55e',
  '01': '#22c55e',
  '02': '#cc5de8',
  '03': '#eab308',
  '04': '#4d96ff',
  '05': '#ff6b6b',
  '06': '#f59e0b',
}

const MODULE_LABELS: Record<string, string> = {
  '00': 'Fondations',
  'setup': 'Installer ton environnement',
  '01': 'Trouver & Valider',
  '02': 'Préparer & Designer',
  '03': 'Architecture',
  '04': 'Construire',
  '05': 'Déployer',
  '06': 'Monétiser & Lancer',
}

interface CheckItem { key: string; text: string; moduleId: string; lessonTitle: string }
interface CheckModule { moduleId: string; title: string; color: string; items: CheckItem[] }

// Extract items from both legacy lesson.checklist AND blocks of type 'checklist'
function extractItems(mod: typeof CURRICULUM[0]): CheckItem[] {
  const items: CheckItem[] = []
  for (const lesson of mod.lessons) {
    const legacy = lesson.checklist ?? []
    const fromBlocks = (lesson.blocks ?? [])
      .filter((b): b is Extract<typeof b, { type: 'checklist' }> => b.type === 'checklist')
      .flatMap(b => b.items)
    const all = [...legacy, ...fromBlocks]
    all.forEach((text, i) => {
      items.push({ key: `${mod.id}-${lesson.id}-${i}`, text, moduleId: mod.id, lessonTitle: lesson.title })
    })
  }
  return items
}

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return visible
}

function TimelineItem({
  item, done, accent, delay, onToggle,
}: {
  item: CheckItem; done: boolean; accent: string; delay: number; onToggle: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref)

  return (
    <div
      ref={ref}
      className="flex items-start gap-3 cursor-pointer group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-16px)',
        transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
      }}
      onClick={onToggle}
    >
      {/* Connector + dot */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 20, paddingTop: 2 }}>
        <div
          className="w-3 h-3 rounded-full border-2 flex-shrink-0 transition-all duration-300"
          style={{
            borderColor: done ? accent : 'hsl(var(--border))',
            background: done ? accent : 'hsl(var(--background))',
            transform: done ? 'scale(1.15)' : 'scale(1)',
            boxShadow: done ? `0 0 8px ${accent}55` : 'none',
          }}
        />
      </div>

      {/* Content */}
      <div
        className="flex-1 min-w-0 rounded-xl px-4 py-2.5 mb-1 transition-all duration-200 group-hover:border-foreground/20"
        style={{
          border: `1px solid ${done ? accent + '30' : 'hsl(var(--border))'}`,
          background: done ? `${accent}08` : 'hsl(var(--background))',
        }}
      >
        <p
          className="font-medium transition-all duration-200"
          style={{
            fontSize: 12,
            color: done ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))',
            textDecoration: done ? 'line-through' : 'none',
          }}
        >
          {item.text}
        </p>
        <p className="text-muted-foreground mt-0.5" style={{ fontSize: 10 }}>{item.lessonTitle}</p>
      </div>

      {/* Check icon */}
      <div className="flex-shrink-0 mt-2 transition-all duration-200" style={{ opacity: done ? 1 : 0, transform: done ? 'scale(1)' : 'scale(0.6)' }}>
        <CheckCircle2 size={14} strokeWidth={1.5} style={{ color: accent }} />
      </div>
    </div>
  )
}

interface Props {
  navigate: (hash: string) => void
  userId: string | undefined
}

export function ChecklistPage({ navigate: _navigate, userId }: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    supabase
      .from('checklist').select('item_key, checked').eq('user_id', userId)
      .then(({ data }) => {
        const map: Record<string, boolean> = {}
        for (const row of data ?? []) map[row.item_key] = row.checked
        setChecked(map)
        setLoading(false)
      })
  }, [userId])

  const toggle = async (key: string) => {
    const newVal = !checked[key]
    setChecked(prev => ({ ...prev, [key]: newVal }))
    if (!userId) return
    await supabase.from('checklist').upsert({ user_id: userId, item_key: key, checked: newVal, updated_at: new Date().toISOString() })
  }

  const modules: CheckModule[] = CURRICULUM
    .map(mod => ({ moduleId: mod.id, title: MODULE_LABELS[mod.id] ?? mod.title, color: MODULE_COLORS[mod.id] ?? '#4d96ff', items: extractItems(mod) }))
    .filter(m => m.items.length > 0)

  const totalItems = modules.reduce((acc, m) => acc + m.items.length, 0)
  const doneItems = modules.reduce((acc, m) => acc + m.items.filter(i => checked[i.key]).length, 0)
  const globalPct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0

  if (loading) {
    return (
      <div className="p-7 max-w-2xl">
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-8 w-32 bg-secondary rounded-lg" />
          <div className="h-3 w-full bg-secondary rounded-full" />
          {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-secondary rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="p-7 max-w-2xl">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Rocket size={16} strokeWidth={1.5} className="text-muted-foreground" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Checklist — Lancer son SaaS</p>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground mb-4" style={{ letterSpacing: '-0.03em' }}>
          De l'idée au live.
        </h1>

        {/* Global progress */}
        <div className="flex items-center gap-3 mb-1">
          <div className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.max(globalPct, 1)}%`,
                background: globalPct === 100
                  ? '#22c55e'
                  : 'linear-gradient(90deg, #4d96ff, #cc5de8, #ff6b6b)',
              }}
            />
          </div>
          <span className="font-extrabold text-foreground tabular-nums flex-shrink-0" style={{ fontSize: 13, letterSpacing: '-0.02em' }}>
            {doneItems}/{totalItems}
          </span>
          <span className="font-extrabold flex-shrink-0" style={{ fontSize: 13, color: globalPct === 100 ? '#22c55e' : 'hsl(var(--muted-foreground))' }}>
            {globalPct}%
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute top-0 bottom-0"
          style={{ left: 9, width: 2, background: 'linear-gradient(to bottom, #4d96ff, #cc5de8, #22c55e, #eab308, #4d96ff, #ff6b6b, #f59e0b)', opacity: 0.2, borderRadius: 2 }}
        />

        <div className="flex flex-col gap-8 pl-2">
          {modules.map((mod, mIdx) => {
            const modDone = mod.items.filter(i => checked[i.key]).length
            const modTotal = mod.items.length
            const modPct = modTotal > 0 ? Math.round((modDone / modTotal) * 100) : 0
            const allDone = modPct === 100

            return (
              <div key={mod.moduleId}>
                {/* Module node */}
                <div className="flex items-center gap-3 mb-4" style={{ marginLeft: -1 }}>
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500"
                    style={{
                      background: allDone ? mod.color : 'hsl(var(--background))',
                      border: `2.5px solid ${mod.color}`,
                      boxShadow: allDone ? `0 0 12px ${mod.color}60` : 'none',
                      zIndex: 1,
                    }}
                  >
                    {allDone && <CheckCircle2 size={10} strokeWidth={2.5} style={{ color: '#fff' }} />}
                    {!allDone && <Circle size={7} strokeWidth={2.5} style={{ color: mod.color, fill: mod.color }} />}
                  </div>

                  <div className="flex items-center gap-2 flex-1">
                    <p className="font-extrabold text-foreground" style={{ fontSize: 13, letterSpacing: '-0.02em' }}>
                      Module {mod.moduleId} — {mod.title}
                    </p>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto flex-shrink-0"
                      style={{
                        color: allDone ? '#22c55e' : mod.color,
                        background: `${allDone ? '#22c55e' : mod.color}18`,
                      }}
                    >
                      {modDone}/{modTotal}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-1.5 pl-8">
                  {mod.items.map((item, iIdx) => (
                    <TimelineItem
                      key={item.key}
                      item={item}
                      done={!!checked[item.key]}
                      accent={mod.color}
                      delay={mIdx * 60 + iIdx * 40}
                      onToggle={() => toggle(item.key)}
                    />
                  ))}
                </div>
              </div>
            )
          })}

          {/* Final node — Launch */}
          <div className="flex items-center gap-3" style={{ marginLeft: -1 }}>
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: globalPct === 100 ? '#22c55e' : 'hsl(var(--secondary))',
                border: `2.5px solid ${globalPct === 100 ? '#22c55e' : 'hsl(var(--border))'}`,
                boxShadow: globalPct === 100 ? '0 0 16px #22c55e80' : 'none',
                transition: 'all 0.5s ease',
                zIndex: 1,
              }}
            >
              <Rocket size={9} strokeWidth={2.5} style={{ color: globalPct === 100 ? '#fff' : 'hsl(var(--muted-foreground))' }} />
            </div>
            <p
              className="font-extrabold"
              style={{
                fontSize: 13,
                letterSpacing: '-0.02em',
                color: globalPct === 100 ? '#22c55e' : 'hsl(var(--muted-foreground))',
              }}
            >
              {globalPct === 100 ? 'SaaS live — félicitations !' : 'SaaS live — termine la checklist'}
            </p>
          </div>
        </div>
      </div>

      {modules.length === 0 && (
        <div className="text-center py-16">
          <Rocket size={32} strokeWidth={1} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Aucun item disponible pour l'instant.</p>
        </div>
      )}
    </div>
  )
}
