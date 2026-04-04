import { useState, useEffect } from 'react'
import { X, Sparkles, Loader } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useScoring } from '../../hooks/useScoring'
import { ViabilityScore } from './ViabilityScore'

interface Project {
  id: string
  name: string
  problem: string
}

interface Props {
  userId: string | undefined
  open: boolean
  onClose: () => void
  /** Pre-select a specific project (optional) */
  preselectedProjectId?: string
}

export function ScoreModal({ userId, open, onClose, preselectedProjectId }: Props) {
  const [projects, setProjects]       = useState<Project[]>([])
  const [selectedId, setSelectedId]   = useState<string | null>(preselectedProjectId ?? null)
  const [loadingProjects, setLoadingProjects] = useState(true)
  const { score, report, loading, error, runScoring } = useScoring(userId)

  useEffect(() => {
    if (!open || !userId) return
    setLoadingProjects(true)
    supabase
      .from('projects')
      .select('id, name, problem')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const list = (data ?? []) as Project[]
        setProjects(list)
        if (!selectedId && list.length === 1) setSelectedId(list[0].id)
        setLoadingProjects(false)
      })
  }, [open, userId]) // eslint-disable-line react-hooks/exhaustive-deps

  const selected = projects.find(p => p.id === selectedId)

  const handleRun = async () => {
    if (!selected) return
    await runScoring(selected.id, selected.name, selected.problem)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative w-full sm:max-w-xl max-h-[92dvh] overflow-y-auto bg-background border border-border rounded-t-2xl sm:rounded-2xl"
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-border bg-background">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(77,150,255,0.12)', border: '1px solid rgba(77,150,255,0.2)' }}
            >
              <Sparkles size={14} strokeWidth={1.5} style={{ color: '#4d96ff' }} />
            </div>
            <p className="text-[13px] font-bold text-foreground">Score de viabilité IA</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <X size={14} strokeWidth={1.5} className="text-muted-foreground" />
          </button>
        </div>

        <div className="px-5 py-5 flex flex-col gap-5">

          {/* If already scored — show report */}
          {report ? (
            <ViabilityScore report={report} />
          ) : (
            <>
              {/* Intro */}
              {!loading && (
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  L'IA analyse ton idée, recherche les concurrents réels sur le web, et te donne un score de viabilité 0-100 avec des recommandations actionnables.
                </p>
              )}

              {/* Project selector */}
              {loadingProjects ? (
                <div className="flex items-center justify-center py-6">
                  <div className="w-5 h-5 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
                </div>
              ) : projects.length === 0 ? (
                <div className="border border-dashed border-border rounded-xl p-5 text-center">
                  <p className="text-sm text-muted-foreground">Aucun projet trouvé.</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">
                    Crée d'abord un projet dans "Mon SaaS".
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/70">
                    Choisis le projet à analyser
                  </p>
                  {projects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedId(p.id)}
                      className="w-full text-left border rounded-xl p-3.5 transition-all duration-150"
                      style={{
                        borderColor: selectedId === p.id ? '#4d96ff' : 'hsl(var(--border))',
                        background: selectedId === p.id ? 'rgba(77,150,255,0.06)' : 'transparent',
                      }}
                    >
                      <p className="text-[12px] font-bold text-foreground">{p.name}</p>
                      {p.problem && (
                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2 leading-snug">
                          {p.problem}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Error */}
              {error && (
                <p className="text-[11px] text-red-500 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              {/* Loading state */}
              {loading && (
                <div className="flex flex-col items-center gap-3 py-6">
                  <Loader size={24} strokeWidth={1.5} className="text-muted-foreground animate-spin" />
                  <p className="text-[12px] text-muted-foreground text-center">
                    Recherche en cours sur le web et analyse IA…
                    <br />
                    <span className="text-[10px] text-muted-foreground/60">Cela peut prendre 15-30 secondes.</span>
                  </p>
                </div>
              )}

              {/* CTA */}
              {!loading && projects.length > 0 && (
                <button
                  onClick={handleRun}
                  disabled={!selectedId || loading}
                  className="w-full py-3 rounded-xl text-[13px] font-bold transition-opacity hover:opacity-90 disabled:opacity-40"
                  style={{ background: '#4d96ff', color: '#fff' }}
                >
                  Analyser mon idée
                </button>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  )
}
