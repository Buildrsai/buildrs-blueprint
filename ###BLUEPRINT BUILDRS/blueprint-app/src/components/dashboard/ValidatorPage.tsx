// blueprint-app/src/components/dashboard/ValidatorPage.tsx
import { useState } from 'react'
import { Loader2, TrendingUp, Shield, Zap, DollarSign, ExternalLink, RotateCcw } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const PRODUCT_TYPES = [
  { value: '',            label: 'Type de produit' },
  { value: 'micro-saas', label: 'Micro-SaaS web (app en ligne avec abonnement)' },
  { value: 'mobile-app', label: 'App mobile (iOS / Android)' },
  { value: 'ai-agent',   label: 'Agent IA (vocal, email ou chatbot)' },
  { value: 'ai-gen',     label: 'Générateur IA (contenu, devis, offres)' },
  { value: 'biz-tool',   label: 'Mini logiciel métier (outil spécialisé)' },
  { value: 'automation', label: 'Automatisation (workflow, relances, notifications)' },
  { value: 'marketplace',label: 'Marketplace / plateforme (mise en relation)' },
]

const MARKET_TYPES = [
  { value: '',      label: 'Marché cible' },
  { value: 'b2b',   label: 'B2B — tu vends à des pros / entreprises' },
  { value: 'b2c',   label: 'B2C — tu vends à des particuliers' },
  { value: 'b2b2c', label: 'B2B2C — les pros servent leurs clients' },
]

const CATEGORIES = [
  { value: '',            label: 'Choisir une catégorie' },
  { value: 'scheduling',  label: 'Booking / RDV' },
  { value: 'crm',         label: 'CRM' },
  { value: 'invoicing',   label: 'Facturation' },
  { value: 'education',   label: 'Education' },
  { value: 'productivity',label: 'Productivité' },
  { value: 'marketing',   label: 'Marketing' },
  { value: 'design',      label: 'Design' },
  { value: 'devtools',    label: 'Dev Tools' },
  { value: 'hr',          label: 'RH' },
  { value: 'pos',         label: 'POS / Commerce' },
  { value: 'other',       label: 'Autre' },
]

const PRICING_MODELS = [
  { value: '',             label: 'Modèle de prix envisagé' },
  { value: 'subscription', label: 'Abonnement mensuel / annuel' },
  { value: 'one_time',     label: 'Paiement unique' },
  { value: 'freemium',     label: 'Freemium + upgrade' },
  { value: 'usage',        label: 'À l\'usage (pay-as-you-go)' },
]

interface Competitor {
  name: string
  url: string
  note?: string
}

interface AnalysisResult {
  session_id: string | null
  demand_score: number
  competition_level: 'low' | 'medium' | 'high'
  feasibility_score: number
  revenue_score: number
  verdict: 'go' | 'caution' | 'stop'
  competitors_found: Competitor[]
  insights: {
    demand?: string | null
    competition?: string | null
    feasibility?: string | null
    revenue?: string | null
  }
}

const VERDICT_CONFIG = {
  go: {
    label: 'Lance-toi',
    sub: 'Les signaux sont au vert. Ton idée a du potentiel.',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.08)',
    border: '#10B981',
  },
  caution: {
    label: 'Affine d\'abord',
    sub: 'L\'idée est viable mais nécessite des ajustements avant de lancer.',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: '#F59E0B',
  },
  stop: {
    label: 'Pivote',
    sub: 'La demande ou la faisabilité est trop faible. Reconsidère ton angle.',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.08)',
    border: '#EF4444',
  },
}

const COMPETITION_LABELS = {
  low:    { label: 'Faible',   color: '#10B981' },
  medium: { label: 'Moderée',  color: '#F59E0B' },
  high:   { label: 'Forte',    color: '#EF4444' },
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 rounded-full bg-border overflow-hidden mt-1">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  )
}

function scoreColor(v: number): string {
  if (v >= 65) return '#10B981'
  if (v >= 40) return '#F59E0B'
  return '#EF4444'
}

interface Props {
  userId: string
  navigate: (hash: string) => void
}

export function ValidatorPage({ userId, navigate }: Props) {
  const [ideaDescription, setIdeaDescription] = useState('')
  const [productType, setProductType] = useState('')
  const [category, setCategory] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [marketType, setMarketType] = useState('')
  const [pricingModel, setPricingModel] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const handleAnalyze = async () => {
    if (!ideaDescription.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const { data, error: fnError } = await supabase.functions.invoke('validator-analyze', {
        body: {
          idea_description:  ideaDescription.trim(),
          product_type:      productType || null,
          category:          category || null,
          target_audience:   targetAudience.trim() || null,
          market_type:       marketType || null,
          pricing_model:     pricingModel || null,
        },
      })

      if (fnError) throw new Error(fnError.message)
      if (data?.error) throw new Error(data.error)
      setResult(data as AnalysisResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue')
    } finally {
      setLoading(false)
    }
  }

  const handleLaunch = () => {
    sessionStorage.setItem('validator_context', JSON.stringify({
      idea_description: ideaDescription,
      product_type: productType,
      market_type: marketType,
      verdict: result?.verdict,
      session_id: result?.session_id,
    }))
    navigate('#/dashboard/claude-os/generer')
  }

  const verdict = result ? VERDICT_CONFIG[result.verdict] : null
  const compLabel = result ? COMPETITION_LABELS[result.competition_level] : null

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-foreground" style={{ letterSpacing: '-0.04em' }}>
          Valider mon idée
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Décris ton idée. Buildrs analyse le marché et te dit si ça vaut le coup de lancer.
        </p>
      </div>

      <div className="flex gap-6 items-start">
        {/* LEFT — Form (40%) */}
        <div className="w-[40%] shrink-0 space-y-4">
          <div className="border border-border rounded-xl p-5 bg-card space-y-4">
            {/* Idea textarea */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 block mb-1.5">
                Ton idée
              </label>
              <textarea
                rows={4}
                placeholder="Ex : Un SaaS de gestion de rendez-vous pour les coachs sportifs indépendants, avec rappels automatiques et paiement intégré."
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none text-foreground placeholder:text-muted-foreground/40"
                value={ideaDescription}
                onChange={e => setIdeaDescription(e.target.value)}
              />
            </div>

            {/* Product type */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 block mb-1.5">
                Type de produit
              </label>
              <select
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 text-foreground"
                value={productType}
                onChange={e => setProductType(e.target.value)}
              >
                {PRODUCT_TYPES.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 block mb-1.5">
                Catégorie
              </label>
              <select
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 text-foreground"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Target audience */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 block mb-1.5">
                Cible
              </label>
              <input
                type="text"
                placeholder="Ex : Coachs sportifs indépendants en France"
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 text-foreground placeholder:text-muted-foreground/40"
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value)}
              />
            </div>

            {/* Market type */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 block mb-1.5">
                Marché
              </label>
              <select
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 text-foreground"
                value={marketType}
                onChange={e => setMarketType(e.target.value)}
              >
                {MARKET_TYPES.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            {/* Pricing model */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 block mb-1.5">
                Modèle de prix
              </label>
              <select
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 text-foreground"
                value={pricingModel}
                onChange={e => setPricingModel(e.target.value)}
              >
                {PRICING_MODELS.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !ideaDescription.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-50"
              style={{ background: '#7C3AED' }}
            >
              {loading ? (
                <>
                  <Loader2 size={14} strokeWidth={1.5} className="animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                'Analyser l\'idée →'
              )}
            </button>

            {error && (
              <p className="text-xs text-destructive text-center">{error}</p>
            )}
          </div>

          {/* Reset (si résultat) */}
          {result && (
            <button
              onClick={() => { setResult(null); setError(null) }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto"
            >
              <RotateCcw size={11} strokeWidth={1.5} />
              Nouvelle analyse
            </button>
          )}
        </div>

        {/* RIGHT — Scorecard (60%) */}
        <div className="flex-1 min-h-[400px]">

          {/* Empty state */}
          {!loading && !result && (
            <div className="border border-dashed border-border rounded-xl p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                <Shield size={20} strokeWidth={1.5} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">Entre ton idée et lance l'analyse</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
                Buildrs scanne le marché et te donne un verdict en quelques secondes.
              </p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="border border-border rounded-xl p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px] bg-card">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                  <Loader2 size={12} strokeWidth={1.5} className="animate-spin" style={{ color: '#7C3AED' }} />
                  Analyse de la demande marché...
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground/60 justify-center">
                  <Loader2 size={12} strokeWidth={1.5} className="animate-spin opacity-60" />
                  Identification des concurrents...
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground/40 justify-center">
                  <Loader2 size={12} strokeWidth={1.5} className="animate-spin opacity-40" />
                  Calcul du score de faisabilité...
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground/40 mt-6">Ça prend 10-15 secondes</p>
            </div>
          )}

          {/* Result state */}
          {result && verdict && compLabel && (
            <div className="space-y-4">

              {/* Verdict banner */}
              <div
                className="rounded-xl p-5"
                style={{ background: verdict.bg, border: `1.5px solid ${verdict.border}` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: verdict.color }}>
                        VERDICT
                      </span>
                    </div>
                    <p className="text-lg font-black tracking-tight" style={{ color: verdict.color, letterSpacing: '-0.03em' }}>
                      {verdict.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{verdict.sub}</p>
                  </div>
                  <div
                    className="text-4xl font-black font-mono shrink-0"
                    style={{ color: verdict.color, letterSpacing: '-0.04em' }}
                  >
                    {Math.round((result.demand_score + result.feasibility_score + result.revenue_score) / 3)}
                  </div>
                </div>
              </div>

              {/* 4 score cards */}
              <div className="grid grid-cols-2 gap-3">

                {/* Demande */}
                <div className="border border-border rounded-xl p-4 bg-card space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={13} strokeWidth={1.5} className="text-muted-foreground" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Demande</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-black font-mono" style={{ color: scoreColor(result.demand_score), letterSpacing: '-0.03em' }}>
                      {result.demand_score}
                    </span>
                    <span className="text-xs text-muted-foreground mb-0.5">/100</span>
                  </div>
                  <ScoreBar value={result.demand_score} color={scoreColor(result.demand_score)} />
                  {result.insights.demand && (
                    <p className="text-[10px] text-muted-foreground/70 leading-relaxed line-clamp-3">{result.insights.demand}</p>
                  )}
                </div>

                {/* Concurrence */}
                <div className="border border-border rounded-xl p-4 bg-card space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield size={13} strokeWidth={1.5} className="text-muted-foreground" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Concurrence</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-sm font-bold px-2 py-0.5 rounded-full"
                      style={{
                        color: compLabel.color,
                        background: `${compLabel.color}18`,
                        border: `1px solid ${compLabel.color}40`,
                      }}
                    >
                      {compLabel.label}
                    </span>
                  </div>
                  {result.insights.competition && (
                    <p className="text-[10px] text-muted-foreground/70 leading-relaxed line-clamp-3 mt-1">{result.insights.competition}</p>
                  )}
                </div>

                {/* Faisabilité */}
                <div className="border border-border rounded-xl p-4 bg-card space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap size={13} strokeWidth={1.5} className="text-muted-foreground" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Faisabilité</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-black font-mono" style={{ color: scoreColor(result.feasibility_score), letterSpacing: '-0.03em' }}>
                      {result.feasibility_score}
                    </span>
                    <span className="text-xs text-muted-foreground mb-0.5">/100</span>
                  </div>
                  <ScoreBar value={result.feasibility_score} color={scoreColor(result.feasibility_score)} />
                  {result.insights.feasibility && (
                    <p className="text-[10px] text-muted-foreground/70 leading-relaxed line-clamp-3">{result.insights.feasibility}</p>
                  )}
                </div>

                {/* Monétisation */}
                <div className="border border-border rounded-xl p-4 bg-card space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign size={13} strokeWidth={1.5} className="text-muted-foreground" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Monétisation</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-black font-mono" style={{ color: scoreColor(result.revenue_score), letterSpacing: '-0.03em' }}>
                      {result.revenue_score}
                    </span>
                    <span className="text-xs text-muted-foreground mb-0.5">/100</span>
                  </div>
                  <ScoreBar value={result.revenue_score} color={scoreColor(result.revenue_score)} />
                  {result.insights.revenue && (
                    <p className="text-[10px] text-muted-foreground/70 leading-relaxed line-clamp-3">{result.insights.revenue}</p>
                  )}
                </div>
              </div>

              {/* Competitors */}
              {result.competitors_found.length > 0 && (
                <div className="border border-border rounded-xl p-4 bg-card space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Concurrents identifiés</span>
                  <div className="space-y-2">
                    {result.competitors_found.map((c, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground">{c.name}</span>
                            {c.url && (
                              <a
                                href={`https://${c.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <ExternalLink size={10} strokeWidth={1.5} />
                              </a>
                            )}
                          </div>
                          {c.note && <p className="text-[10px] text-muted-foreground/60 mt-0.5 leading-relaxed">{c.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleLaunch}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: '#7C3AED' }}
                >
                  Lancer ce projet →
                </button>
                <button
                  onClick={() => navigate('#/dashboard/marketplace')}
                  className="flex-1 py-3 rounded-xl text-sm font-medium border border-border hover:bg-secondary transition-colors text-foreground"
                >
                  Explorer des modèles
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
