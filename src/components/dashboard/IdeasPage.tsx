import { useState, useEffect } from 'react'
import { Lightbulb, Plus, Trash2, Star } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Idea {
  id: string
  name: string
  problem: string
  target: string
  price: string
  note: number
  createdAt: string
}

const EMPTY_FORM: Omit<Idea, 'id' | 'createdAt'> = {
  name: '',
  problem: '',
  target: '',
  price: '',
  note: 0,
}

interface Props {
  navigate: (hash: string) => void
  userId: string | undefined
}

export function IdeasPage({ navigate: _navigate, userId }: Props) {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    supabase
      .from('ideas')
      .select('id, name, problem, target, price, note, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setIdeas((data ?? []).map(r => ({
          id: r.id,
          name: r.name,
          problem: r.problem ?? '',
          target: r.target ?? '',
          price: r.price ?? '',
          note: r.note ?? 0,
          createdAt: r.created_at,
        })))
        setLoading(false)
      })
  }, [userId])

  const handleAdd = async () => {
    if (!form.name.trim() || !userId) return
    const optimistic: Idea = {
      ...form,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setIdeas(prev => [optimistic, ...prev])
    setForm(EMPTY_FORM)
    setShowForm(false)

    const { data, error } = await supabase
      .from('ideas')
      .insert({ user_id: userId, name: form.name.trim(), problem: form.problem, target: form.target, price: form.price, note: form.note })
      .select('id, name, problem, target, price, note, created_at')
      .single()

    if (error) {
      // Rollback on failure
      setIdeas(prev => prev.filter(i => i.id !== optimistic.id))
      return
    }

    if (data) {
      setIdeas(prev => prev.map(i => i.id === optimistic.id ? {
        id: data.id, name: data.name, problem: data.problem ?? '', target: data.target ?? '',
        price: data.price ?? '', note: data.note ?? 0, createdAt: data.created_at,
      } : i))
    }
  }

  const handleDelete = async (id: string) => {
    if (!userId) return
    setIdeas(prev => prev.filter(i => i.id !== id))
    await supabase.from('ideas').delete().eq('id', id).eq('user_id', userId)
  }

  const handleSetNote = async (id: string, note: number) => {
    if (!userId) return
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, note } : i))
    await supabase.from('ideas').update({ note }).eq('id', id).eq('user_id', userId)
  }

  if (loading) {
    return (
      <div className="p-7 max-w-3xl">
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-8 w-48 bg-secondary rounded-lg" />
          <div className="h-4 w-64 bg-secondary rounded-lg" />
          <div className="h-24 bg-secondary rounded-xl" />
          <div className="h-24 bg-secondary rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-7 max-w-3xl">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Lightbulb size={16} strokeWidth={1.5} className="text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Mes Idées</p>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
            Tes idées de SaaS
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sauvegarde, note et compare tes idées avant de choisir.
          </p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 bg-foreground text-background rounded-xl px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity flex-shrink-0 mt-1"
        >
          <Plus size={14} strokeWidth={2} />
          Ajouter
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="border border-border rounded-xl p-5 mb-6 bg-secondary/30">
          <p className="text-sm font-bold text-foreground mb-4">Nouvelle idée</p>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1">
                Nom du produit *
              </label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="ex: InvoiceAI, CalTrack Pro..."
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1">
                Problème résolu
              </label>
              <input
                value={form.problem}
                onChange={e => setForm(f => ({ ...f, problem: e.target.value }))}
                placeholder="ex: Les freelances perdent du temps à facturer"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1">
                  Cible
                </label>
                <input
                  value={form.target}
                  onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                  placeholder="ex: Freelances dev"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground block mb-1">
                  Prix mensuel
                </label>
                <input
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="ex: 29€/mois"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
              </div>
            </div>
            {/* Star rating */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground block mb-2">
                Note personnelle
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setForm(f => ({ ...f, note: n === f.note ? 0 : n }))}
                    className="p-0.5 hover:scale-110 transition-transform"
                  >
                    <Star
                      size={20}
                      strokeWidth={1.5}
                      style={{
                        color: n <= form.note ? '#eab308' : 'hsl(var(--border))',
                        fill: n <= form.note ? '#eab308' : 'transparent',
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              disabled={!form.name.trim()}
              className="bg-foreground text-background rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
            >
              Sauvegarder
            </button>
            <button
              onClick={() => { setShowForm(false); setForm(EMPTY_FORM) }}
              className="border border-border rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Ideas list */}
      {ideas.length > 0 ? (
        <div className="flex flex-col gap-3">
          {ideas.map(idea => (
            <div
              key={idea.id}
              className="group border border-border rounded-xl px-5 py-4 hover:border-foreground/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-foreground">{idea.name}</p>
                    {idea.note > 0 && (
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(n => (
                          <Star
                            key={n}
                            size={11}
                            strokeWidth={1.5}
                            style={{
                              color: n <= idea.note ? '#eab308' : 'hsl(var(--border))',
                              fill: n <= idea.note ? '#eab308' : 'transparent',
                            }}
                          />
                        ))}
                      </div>
                    )}
                    {idea.price && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-muted-foreground bg-secondary">
                        {idea.price}
                      </span>
                    )}
                  </div>
                  {idea.problem && (
                    <p className="text-xs text-muted-foreground">{idea.problem}</p>
                  )}
                  {idea.target && (
                    <p className="text-[10px] text-muted-foreground mt-1">→ {idea.target}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Star picker inline */}
                  <div className="hidden group-hover:flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        onClick={() => handleSetNote(idea.id, n === idea.note ? 0 : n)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star
                          size={13}
                          strokeWidth={1.5}
                          style={{
                            color: n <= idea.note ? '#eab308' : 'hsl(var(--muted-foreground))',
                            fill: n <= idea.note ? '#eab308' : 'transparent',
                          }}
                        />
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handleDelete(idea.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 size={13} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <Lightbulb size={32} strokeWidth={1} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">Aucune idée encore</p>
            <p className="text-xs text-muted-foreground mb-4">
              Clique sur "Ajouter" pour sauvegarder ta première idée de SaaS.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="text-xs font-semibold text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              Ajouter une idée →
            </button>
          </div>
        )
      )}
    </div>
  )
}
