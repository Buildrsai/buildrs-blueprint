import { useEffect, useState } from 'react'
import {
  ArrowLeft, Heart, TrendingUp, DollarSign, Clock, Users,
  Lock, Rocket, ChevronRight, BarChart2, Zap,
} from 'lucide-react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { supabase } from '../../lib/supabase'
import type { SaasIdea } from '../../hooks/useMarketplaceIdeas'
import { DEFAULT_MILESTONES } from '../../data/milestones-defaults'

// ── Helpers ───────────────────────────────────────────────────────────────────

const LOGO_COLORS = [
  '#f97316','#3b82f6','#8b5cf6','#ec4899','#14b8a6',
  '#22c55e','#eab308','#ef4444','#06b6d4','#a78bfa',
]

const DIFF_LABEL: Record<number, string> = { 1:'Facile', 2:'Facile', 3:'Moyen', 4:'Avancé', 5:'Expert' }

function buildTime(d: number)   { return ['~1j','~2j','~3-4j','~5-7j','~2sem'][d-1] ?? '~2j' }
function competitors(d: number) { return [3, 5, 8, 12, 20][d-1] ?? 5 }
function daysToFirst(d: number) { return ['7j','14j','21j','30j','45j'][d-1] ?? '14j' }
function marketSize(max: number) {
  if (max >= 50000) return '$5B+'
  if (max >= 20000) return '$2B+'
  if (max >= 10000) return '$1.5B+'
  if (max >=  5000) return '$500M+'
  return '$100M+'
}
function formatMRR(max: number) {
  return max >= 1000 ? `€${Math.round(max / 1000)}k+` : `€${max}`
}
function logoColor(slug: string) {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) % LOGO_COLORS.length
  return LOGO_COLORS[h]
}

function renderMd(md: string): string {
  return DOMPurify.sanitize(marked.parse(md) as string)
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatChip({ value, label, color }: { value: string; label: string; color?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[17px] font-extrabold tabular-nums" style={{ color: color ?? 'hsl(var(--foreground))', letterSpacing: '-0.03em' }}>
        {value}
      </span>
      <span className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.06em]">{label}</span>
    </div>
  )
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-muted-foreground/50 mb-3">
      {label}
    </p>
  )
}

function MdBlock({ md }: { md: string }) {
  return (
    <div
      className="text-[13px] leading-relaxed text-muted-foreground [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-3 [&_li]:mb-1.5 [&_strong]:text-foreground [&_strong]:font-semibold [&_h3]:text-foreground [&_h3]:font-bold [&_h3]:text-[14px] [&_h3]:mb-2 [&_h4]:text-foreground [&_h4]:font-semibold"
      // Content sanitized via DOMPurify from admin-curated saas_ideas table
      dangerouslySetInnerHTML={{ __html: renderMd(md) }}
    />
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  slug: string
  userId: string | undefined
  navigate: (hash: string) => void
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function IdeaDetailPage({ slug, userId, navigate }: Props) {
  const [idea, setIdea]   = useState<SaasIdea | null>(null)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('saas_ideas')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data }) => { setIdea(data as SaasIdea | null); setLoading(false) })
  }, [slug])

  useEffect(() => {
    if (!userId || !idea) return
    supabase
      .from('user_saved_ideas').select('id')
      .eq('user_id', userId).eq('idea_id', idea.id)
      .maybeSingle()
      .then(({ data }) => setSaved(!!data))
  }, [userId, idea])

  const toggleSave = async () => {
    if (!userId || !idea) return
    if (saved) {
      await supabase.from('user_saved_ideas').delete().eq('user_id', userId).eq('idea_id', idea.id)
      setSaved(false)
    } else {
      await supabase.from('user_saved_ideas').insert({ user_id: userId, idea_id: idea.id })
      setSaved(true)
    }
  }

  const handleLaunch = async () => {
    if (!userId || !idea) return
    await supabase
      .from('projects')
      .upsert({ user_id: userId, name: idea.title, description: `Basé sur l'idée : ${idea.title}` }, { onConflict: 'user_id' })
    const { data: existing } = await supabase
      .from('project_milestones').select('id').eq('user_id', userId).limit(1)
    if (!existing || existing.length === 0) {
      await supabase.from('project_milestones').insert(DEFAULT_MILESTONES.map(m => ({ user_id: userId, ...m })))
    }
    navigate('#/dashboard/kanban')
  }

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-5 h-5 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
    </div>
  )
  if (!idea) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground text-sm">Idée introuvable.</p>
        <button onClick={() => navigate('#/dashboard/marketplace')} className="mt-3 text-xs text-foreground hover:opacity-70 transition-opacity">
          ← Retour au marketplace
        </button>
      </div>
    </div>
  )

  const color       = logoColor(idea.slug)
  const initials    = idea.title.slice(0, 2).toUpperCase()
  const category    = (idea.tags[0] ?? 'SaaS IA').toUpperCase()
  const compCount   = competitors(idea.difficulty)
  const isTrending  = idea.difficulty <= 3

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* ── Breadcrumb ── */}
      <button
        onClick={() => navigate('#/dashboard/marketplace')}
        className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors mb-5"
      >
        <ArrowLeft size={13} strokeWidth={1.5} />
        Retour aux idées
      </button>

      {/* ── Header ── */}
      <div className="mb-6">
        {/* Category + trending */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground/50">{category}</span>
          {isTrending && (
            <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{ background:'rgba(77,150,255,0.12)', color:'#4d96ff' }}>
              <TrendingUp size={8} strokeWidth={2} /> Trending
            </span>
          )}
        </div>

        {/* Logo + title */}
        <div className="flex items-start gap-4 mb-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-[18px] font-black text-white shadow-sm"
            style={{ background: color }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[22px] font-extrabold text-foreground leading-tight mb-1" style={{ letterSpacing:'-0.03em' }}>
              {idea.title}
            </h1>
            {idea.target_audience && (
              <p className="text-[13px] text-muted-foreground leading-relaxed">{idea.target_audience}</p>
            )}
          </div>
          {/* Save */}
          <button onClick={toggleSave} className="flex-shrink-0 mt-1">
            <Heart
              size={20} strokeWidth={1.5}
              fill={saved ? '#ef4444' : 'none'}
              style={{ color: saved ? '#ef4444' : 'hsl(var(--muted-foreground))' }}
            />
          </button>
        </div>

        {/* CTA */}
        <button
          onClick={handleLaunch}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-85"
          style={{ background:'#4d96ff', color:'white' }}
        >
          <Rocket size={14} strokeWidth={1.5} />
          Construire ce SaaS →
        </button>
      </div>

      {/* ── Stats strip ── */}
      <div className="border border-border rounded-xl px-5 py-4 mb-6 grid grid-cols-3 sm:grid-cols-6 gap-4">
        <StatChip value={formatMRR(idea.mrr_max)} label="Revenu/mo" color="#22c55e" />
        <StatChip value={buildTime(idea.difficulty)} label="Build time" />
        <StatChip value={daysToFirst(idea.difficulty)} label="1er €" />
        <StatChip value={marketSize(idea.mrr_max)} label="Marché" />
        <StatChip value={DIFF_LABEL[idea.difficulty]} label="Difficulté" />
        <StatChip value={String(compCount)} label="Concurrents" />
      </div>

      {/* ── Sections ── */}
      <div className="flex flex-col gap-5">

        {/* Problème → "Qu'est-ce que c'est ?" */}
        {idea.problem_md && (
          <div className="border border-border rounded-xl p-5">
            <SectionLabel label={`Qu'est-ce que ${idea.title} ?`} />
            <MdBlock md={idea.problem_md} />
          </div>
        )}

        {/* Solution → "L'Opportunité" */}
        {idea.solution_md && (
          <div className="border border-border rounded-xl p-5">
            <SectionLabel label="L'Opportunité" />
            <MdBlock md={idea.solution_md} />
          </div>
        )}

        {/* Business model */}
        {idea.business_model_md && (
          <div className="border border-border rounded-xl p-5">
            <SectionLabel label="Le Modèle économique" />
            <MdBlock md={idea.business_model_md} />
          </div>
        )}

        {/* Competitive landscape */}
        {idea.competition_md && (
          <div className="border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <SectionLabel label="Paysage concurrentiel" />
              <div className="flex items-center gap-1.5 mb-3">
                <BarChart2 size={11} strokeWidth={1.5} className="text-muted-foreground/50" />
                <span className="text-[10px] text-muted-foreground/50">Score d'opportunité :</span>
                <span className="text-[11px] font-bold" style={{ color: '#22c55e' }}>
                  {Math.max(40, 90 - idea.difficulty * 8)}/100
                </span>
              </div>
            </div>

            {/* Fake competitor dots */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex -space-x-2">
                {Array.from({ length: Math.min(compCount, 6) }).map((_, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[9px] font-black text-white"
                    style={{ background: LOGO_COLORS[(i + 3) % LOGO_COLORS.length], borderColor:'hsl(var(--card))' }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="text-[11px] text-muted-foreground">{compCount} concurrents identifiés</span>
            </div>

            <MdBlock md={idea.competition_md} />
          </div>
        )}

        {/* Tech stack */}
        {idea.stack.length > 0 && (
          <div className="border border-border rounded-xl p-5">
            <SectionLabel label="Stack recommandé" />
            <div className="flex flex-wrap gap-2 mb-3">
              {idea.stack.map(s => (
                <span key={s} className="text-[11px] font-medium px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground">
                  {s}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground/60">Stack validé par l'équipe Buildrs pour ce type de produit.</p>
          </div>
        )}

        {/* Tags */}
        {idea.tags.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {idea.tags.map(tag => (
              <span key={tag} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-secondary border border-border text-muted-foreground capitalize">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ── Locked: Plan de construction ── */}
        <div className="border border-border rounded-xl overflow-hidden relative">
          {/* Blurred content */}
          <div className="p-5 select-none" style={{ filter:'blur(4px)', pointerEvents:'none', userSelect:'none' }}>
            <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-muted-foreground/50 mb-3">Plan de construction IA</p>
            <p className="text-[20px] font-extrabold text-foreground mb-2" style={{ letterSpacing:'-0.03em' }}>
              12 étapes pour lancer.<br />
              <span style={{ color:'#4d96ff' }}>Orchestré par les agents.</span>
            </p>
            <div className="flex flex-col gap-2 mt-4">
              {['Étape 1 · Design System & Branding','Étape 2 · Schéma base de données','Étape 3 · Onboarding utilisateur','Étape 4 · Feature principale','Étape 5 · Intégration paiements'].map((s, i) => (
                <div key={i} className="flex items-center gap-3 border border-border rounded-lg p-3">
                  <div className="w-5 h-5 rounded flex-shrink-0" style={{ background:'hsl(var(--secondary))' }} />
                  <span className="text-[12px] font-medium text-foreground">{s}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground/50">0{i+1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lock overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ background:'linear-gradient(to bottom, transparent 0%, hsl(var(--background) / 0.7) 25%, hsl(var(--background) / 0.97) 50%)' }}>
            <div className="mt-auto mb-8 flex flex-col items-center text-center px-6">
              <div className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center mb-3">
                <Lock size={16} strokeWidth={1.5} className="text-muted-foreground" />
              </div>
              <p className="text-[13px] font-bold text-foreground mb-1">Plan de construction complet</p>
              <p className="text-[11px] text-muted-foreground mb-4 max-w-[260px]">
                Obtiens le plan exact pour construire ce SaaS en 72h avec les agents Buildrs.
              </p>
              <div className="flex gap-2 flex-wrap justify-center">
                <button
                  onClick={() => navigate('#/dashboard/offers')}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-opacity hover:opacity-85"
                  style={{ background:'#4d96ff', color:'white' }}
                >
                  <Zap size={12} strokeWidth={2} />
                  Sprint 72h — 497€ →
                </button>
                <button
                  onClick={handleLaunch}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-semibold border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  <Rocket size={12} strokeWidth={1.5} />
                  Lancer seul
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom CTA strip ── */}
        <div className="flex items-center justify-between gap-4 py-3">
          <button
            onClick={() => navigate('#/dashboard/marketplace')}
            className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={13} strokeWidth={1.5} />
            Retour aux idées
          </button>
          <div className="flex gap-2">
            <button
              onClick={toggleSave}
              className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
              style={saved ? { color:'#ef4444', borderColor:'rgba(239,68,68,0.3)' } : { color:'hsl(var(--muted-foreground))' }}
            >
              <Heart size={12} strokeWidth={1.5} fill={saved ? '#ef4444' : 'none'} />
              {saved ? 'Intéressé' : 'Marquer comme intéressé'}
            </button>
            <button
              onClick={() => navigate('#/dashboard/offers')}
              className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-2 rounded-lg transition-opacity hover:opacity-85"
              style={{ background:'hsl(var(--foreground))', color:'hsl(var(--background))' }}
            >
              Voir les offres <ChevronRight size={12} strokeWidth={2} />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
