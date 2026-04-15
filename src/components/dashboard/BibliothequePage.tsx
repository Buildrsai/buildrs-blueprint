import { useState } from 'react'
import { Copy, Check, ChevronDown, ChevronRight, BookOpen } from 'lucide-react'
import { CURRICULUM } from '../../data/curriculum'

const MODULE_COLORS: Record<string, string> = {
  '00': '#4d96ff',
  'setup': '#22c55e',
  '01': '#22c55e',
  '02': '#cc5de8',
  '03': '#eab308',
  '04': '#4d96ff',
  '05': '#22c55e',
  '06': '#ff6b6b',
}

function PromptCard({ label, content }: { label: string; content: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/50">
        <span className="text-[11px] font-semibold text-foreground">{label}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-secondary"
        >
          {copied
            ? <><Check size={11} strokeWidth={2} style={{ color: '#22c55e' }} /><span style={{ color: '#22c55e' }}>Copié !</span></>
            : <><Copy size={11} strokeWidth={1.5} />Copier</>
          }
        </button>
      </div>
      <div className="px-4 py-3 bg-background">
        <p className="text-xs text-muted-foreground leading-relaxed font-mono whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  )
}

interface Props {
  navigate: (hash: string) => void
}

export function BibliothequePage({ navigate: _navigate }: Props) {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({ '00': true })

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Extract prompts from both legacy lesson.prompts AND blocks of type 'prompt'
  const getPrompts = (lesson: typeof CURRICULUM[0]['lessons'][0]): { label: string; content: string }[] => {
    const fromLegacy = lesson.prompts ?? []
    const fromBlocks = (lesson.blocks ?? [])
      .filter((b): b is Extract<typeof b, { type: 'prompt' }> => b.type === 'prompt')
      .map(b => ({ label: b.label, content: b.content }))
    return [...fromLegacy, ...fromBlocks]
  }

  const modulesWithPrompts = CURRICULUM.map(mod => {
    const lessonsWithPrompts = mod.lessons
      .map(l => ({ ...l, allPrompts: getPrompts(l) }))
      .filter(l => l.allPrompts.length > 0)
    return {
      ...mod,
      lessonsWithPrompts,
      totalPrompts: lessonsWithPrompts.reduce((acc, l) => acc + l.allPrompts.length, 0),
    }
  }).filter(m => m.totalPrompts > 0)

  const totalPrompts = modulesWithPrompts.reduce((acc, m) => acc + m.totalPrompts, 0)

  return (
    <div className="p-7 max-w-3xl">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <BookOpen size={16} strokeWidth={1.5} className="text-muted-foreground" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Bibliothèque</p>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
          Tes prompts
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {totalPrompts} prompt{totalPrompts > 1 ? 's' : ''} prêts à copier — classés par module
        </p>
      </div>

      {/* Modules */}
      <div className="flex flex-col gap-3">
        {modulesWithPrompts.map(mod => {
          const accent = MODULE_COLORS[mod.id] ?? '#4d96ff'
          const isOpen = !!expandedModules[mod.id]

          return (
            <div key={mod.id} className="border border-border rounded-xl overflow-hidden">
              {/* Module header */}
              <button
                onClick={() => toggleModule(mod.id)}
                className="flex items-center gap-3 w-full text-left px-5 py-4 hover:bg-secondary/30 transition-colors"
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: accent }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Module {mod.id}
                    </span>
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ color: accent, background: `${accent}18` }}
                    >
                      {mod.totalPrompts} prompt{mod.totalPrompts > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground">{mod.title}</p>
                </div>
                {isOpen
                  ? <ChevronDown size={15} strokeWidth={1.5} className="text-muted-foreground flex-shrink-0" />
                  : <ChevronRight size={15} strokeWidth={1.5} className="text-muted-foreground flex-shrink-0" />
                }
              </button>

              {/* Prompts */}
              {isOpen && (
                <div className="border-t border-border px-5 py-4 flex flex-col gap-4">
                  {mod.lessonsWithPrompts.map(lesson => (
                    <div key={lesson.id}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                        {lesson.id} — {lesson.title}
                      </p>
                      <div className="flex flex-col gap-2">
                        {lesson.allPrompts.map((prompt, i) => (
                          <PromptCard key={i} label={prompt.label} content={prompt.content} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {modulesWithPrompts.length === 0 && (
        <div className="text-center py-16">
          <BookOpen size={32} strokeWidth={1} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Aucun prompt disponible pour l'instant.</p>
        </div>
      )}
    </div>
  )
}
