import { useState } from 'react'
import { Trash2, PenLine, Tag, Clock } from 'lucide-react'
import { useJournal } from '../../hooks/useJournal'
import { useAuth } from '../../hooks/useAuth'
import { CURRICULUM } from '../../data/curriculum'

interface Props {
  navigate: (hash: string) => void
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function JournalPage({ navigate: _navigate }: Props) {
  const { user } = useAuth()
  const { entries, loading, addEntry, deleteEntry } = useJournal(user?.id)
  const [text, setText] = useState('')
  const [tag, setTag] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!text.trim()) return
    setSaving(true)
    await addEntry(text, tag || undefined)
    setText('')
    setTag('')
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await deleteEntry(id)
    setDeletingId(null)
  }

  return (
    <div className="p-7 max-w-2xl">

      {/* Header */}
      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#4d96ff' }}>
          Journal de bord
        </p>
        <h1 className="text-2xl font-extrabold text-foreground mb-1" style={{ letterSpacing: '-0.03em' }}>
          Tes notes & réflexions
        </h1>
        <p className="text-sm text-muted-foreground">
          Note ce que tu apprends, tes idées, tes blocages. Tout est sauvegardé sur Supabase.
        </p>
      </div>

      {/* New entry form */}
      <div
        className="rounded-xl p-5 mb-6 border"
        style={{ borderColor: 'rgba(77,150,255,0.25)', background: 'rgba(77,150,255,0.04)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <PenLine size={13} strokeWidth={1.5} style={{ color: '#4d96ff' }} />
          <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#4d96ff' }}>
            Nouvelle entrée
          </span>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Ce que tu as appris, une idée, une question, un blocage..."
          rows={4}
          className="w-full text-sm bg-transparent resize-none text-foreground placeholder:text-muted-foreground/60 focus:outline-none leading-relaxed"
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
          }}
        />

        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
          {/* Module tag selector */}
          <div className="flex items-center gap-1.5 flex-1">
            <Tag size={12} strokeWidth={1.5} className="text-muted-foreground flex-shrink-0" />
            <select
              value={tag}
              onChange={e => setTag(e.target.value)}
              className="text-xs bg-transparent text-muted-foreground focus:outline-none cursor-pointer flex-1"
            >
              <option value="">Sans tag</option>
              {CURRICULUM.map(m => (
                <option key={m.id} value={m.id}>
                  Module {m.id} — {m.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!text.trim() || saving}
            className="flex-shrink-0 rounded-lg px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
            style={{ background: '#4d96ff' }}
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">⌘+Entrée pour enregistrer rapidement</p>
      </div>

      {/* Entries list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 rounded-xl bg-secondary animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ background: 'rgba(77,150,255,0.1)' }}
          >
            <PenLine size={20} strokeWidth={1.5} style={{ color: '#4d96ff' }} />
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">Ton journal est vide</p>
          <p className="text-xs text-muted-foreground">
            Commence par noter ce que tu retiens du premier module.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-muted-foreground">
            {entries.length} note{entries.length > 1 ? 's' : ''}
          </p>
          {entries.map(entry => {
            const mod = entry.module_tag
              ? CURRICULUM.find(m => m.id === entry.module_tag)
              : null
            return (
              <div
                key={entry.id}
                className="group rounded-xl border border-border px-4 py-4 hover:border-foreground/20 transition-colors"
                style={{ background: 'hsl(var(--card))' }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                      {entry.content}
                    </p>

                    <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock size={9} strokeWidth={1.5} />
                        {formatDate(entry.created_at)}
                      </span>

                      {mod && (
                        <span
                          className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ color: '#4d96ff', background: 'rgba(77,150,255,0.12)' }}
                        >
                          <Tag size={8} strokeWidth={2} />
                          Module {mod.id} — {mod.title}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={deletingId === entry.id}
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/10 disabled:opacity-50"
                    title="Supprimer"
                  >
                    <Trash2 size={12} strokeWidth={1.5} style={{ color: '#ef4444' }} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
