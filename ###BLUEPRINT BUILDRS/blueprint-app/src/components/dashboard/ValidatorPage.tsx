// blueprint-app/src/components/dashboard/ValidatorPage.tsx
import { useState, useEffect } from 'react'
import {
  Loader2, TrendingUp, Shield, Zap, DollarSign, ExternalLink,
  RotateCcw, BookmarkPlus, Check, ChevronRight,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

// ── Data source icons (currentColor → adapte light/dark auto) ────────────────

function RedditIconMono({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z"/>
    </svg>
  )
}

function ProductHuntIconMono({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.604 8.4h-3.405V12h3.405c.995 0 1.801-.806 1.801-1.801 0-.993-.805-1.799-1.801-1.799zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.801V6h5.804c2.319 0 4.2 1.88 4.2 4.199 0 2.321-1.881 4.201-4.201 4.201z"/>
    </svg>
  )
}

function AppStoreIconMono({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.8086 14.9194l6.1107-11.0368c.0837-.1513.1682-.302.2437-.4584.0685-.142.1267-.2854.1646-.4403.0803-.3259.0588-.6656-.066-.9767-.1238-.3095-.3417-.5678-.6201-.7355a1.4175 1.4175 0 0 0-.921-.1924c-.3207.043-.6135.1935-.8443.4288-.1094.1118-.1996.2361-.2832.369-.092.1463-.175.2979-.259.4492l-.3864.6979-.3865-.6979c-.0837-.1515-.1667-.303-.2587-.4492-.0837-.1329-.1739-.2572-.2835-.369-.2305-.2353-.5233-.3857-.844-.429a1.4181 1.4181 0 0 0-.921.1926c-.2784.1677-.4964.426-.6203.7355-.1246.311-.1461.6508-.066.9767.038.155.0962.2984.1648.4403.0753.1564.1598.307.2437.4584l1.248 2.2543-4.8625 8.7825H2.0295c-.1676 0-.3351-.0007-.5026.0092-.1522.009-.3004.0284-.448.0714-.3108.0906-.5822.2798-.7783.548-.195.2665-.3006.5929-.3006.9279 0 .3352.1057.6612.3006.9277.196.2683.4675.4575.7782.548.1477.043.296.0623.4481.0715.1675.01.335.009.5026.009h13.0974c.0171-.0357.059-.1294.1-.2697.415-1.4151-.6156-2.843-2.0347-2.843zM3.113 18.5418l-.7922 1.5008c-.0818.1553-.1644.31-.2384.4705-.067.1458-.124.293-.1611.452-.0785.3346-.0576.6834.0645 1.0029.1212.3175.3346.583.607.7549.2727.172.5891.2416.9013.1975.3139-.044.6005-.1986.8263-.4402.1072-.1148.1954-.2424.2772-.3787.0902-.1503.1714-.3059.2535-.4612L6 19.4636c-.0896-.149-.9473-1.4704-2.887-.9218m20.5861-3.0056a1.4707 1.4707 0 0 0-.779-.5407c-.1476-.0425-.2961-.0616-.4483-.0705-.1678-.0099-.3352-.0091-.503-.0091H18.648l-4.3891-7.817c-.6655.7005-.9632 1.485-1.0773 2.1976-.1655 1.0333.0367 2.0934.546 3.0004l5.2741 9.3933c.084.1494.167.299.2591.4435.0837.131.1739.2537.2836.364.231.2323.5238.3809.8449.4232.3192.0424.643-.0244.9217-.1899.2784-.1653.4968-.4204.621-.7257.1246-.3072.146-.6425.0658-.9641-.0381-.1529-.0962-.2945-.165-.4346-.0753-.1543-.1598-.303-.2438-.4524l-1.216-2.1662h1.596c.1677 0 .3351.0009.5029-.009.1522-.009.3007-.028.4483-.0705a1.4707 1.4707 0 0 0 .779-.5407A1.5386 1.5386 0 0 0 24 16.452a1.539 1.539 0 0 0-.3009-.9158Z"/>
    </svg>
  )
}

function IndieHackersIconMono({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0h24v24H0V0Zm5.4 17.2h2.4V6.8H5.4v10.4Zm4.8 0h2.4v-4h3.6v4h2.4V6.8h-2.4v4h-3.6v-4h-2.4v10.4Z"/>
    </svg>
  )
}

// ── Static data ────────────────────────────────────────────────────────────────

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

// ── Types ──────────────────────────────────────────────────────────────────────

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

interface PastValidation {
  id: string
  input_data: { idea_description?: string; product_type?: string }
  output_data: AnalysisResult | null
  created_at: string
}

// ── Config ─────────────────────────────────────────────────────────────────────

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
  low:    { label: 'Faible',  color: '#10B981' },
  medium: { label: 'Moderée', color: '#F59E0B' },
  high:   { label: 'Forte',   color: '#EF4444' },
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 rounded-full bg-border overflow-hidden mt-1">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
    </div>
  )
}

function scoreColor(v: number): string {
  if (v >= 65) return '#10B981'
  if (v >= 40) return '#F59E0B'
  return '#EF4444'
}

// ── Component ──────────────────────────────────────────────────────────────────

interface Props {
  userId: string
  navigate: (hash: string) => void
}

const MAX_VALIDATIONS = 3

export function ValidatorPage({ userId, navigate }: Props) {
  const [ideaDescription, setIdeaDescription] = useState('')
  const [productType, setProductType]         = useState('')
  const [category, setCategory]               = useState('')
  const [targetAudience, setTargetAudience]   = useState('')
  const [marketType, setMarketType]           = useState('')
  const [pricingModel, setPricingModel]       = useState('')
  const [loading, setLoading]                 = useState(false)
  const [error, setError]                     = useState<string | null>(null)
  const [result, setResult]                   = useState<AnalysisResult | null>(null)
  const [savedIdea, setSavedIdea]             = useState(false)
  const [savingIdea, setSavingIdea]           = useState(false)
  const [savedProject, setSavedProject]       = useState(false)
  const [savingProject, setSavingProject]     = useState(false)
  const [pastValidations, setPastValidations] = useState<PastValidation[]>([])
  const [validationsLoaded, setValidationsLoaded] = useState(false)

  // Load past validations
  useEffect(() => {
    if (!userId) { setValidationsLoaded(true); return }
    void supabase
      .from('validator_sessions')
      .select('id, input_data, output_data, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(MAX_VALIDATIONS)
      .then(({ data }) => {
        if (data) setPastValidations(data as PastValidation[])
        setValidationsLoaded(true)
      })
  }, [userId])

  const handleAnalyze = async () => {
    if (!ideaDescription.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    setSavedIdea(false)
    setSavedProject(false)

    try {
      const { data, error: fnError } = await supabase.functions.invoke('validator-analyze', {
        body: {
          idea_description: ideaDescription.trim(),
          product_type:     productType || null,
          category:         category || null,
          target_audience:  targetAudience.trim() || null,
          market_type:      marketType || null,
          pricing_model:    pricingModel || null,
        },
      })

      if (fnError) throw new Error(fnError.message)
      if (data?.error) throw new Error(data.error)
      const r = data as AnalysisResult
      setResult(r)
      // Refresh session count
      const { data: sessions } = await supabase
        .from('validator_sessions')
        .select('id, input_data, output_data, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(MAX_VALIDATIONS)
      if (sessions) setPastValidations(sessions as PastValidation[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue')
    } finally {
      setLoading(false)
    }
  }

  async function saveToIdeas(andNavigate = false, setter: (v: boolean) => void) {
    if (!result) return
    setter(true)
    const avgScore = Math.round((result.demand_score + result.feasibility_score + result.revenue_score) / 3)
    const { error: dbErr } = await supabase.from('ideas').insert({
      user_id: userId,
      name:    ideaDescription.slice(0, 60),
      problem: ideaDescription,
      target:  targetAudience || null,
      price:   pricingModel || null,
      note:    avgScore,
      feature: result.competitors_found[0]?.name ?? '',
      status:  `validated:${result.verdict}`,
    })
    if (!dbErr) {
      if (andNavigate) {
        navigate('#/dashboard/project')
      } else {
        setter(false)
        setSavedIdea(true)
      }
    } else {
      setter(false)
    }
  }

  function loadPastValidation(v: PastValidation) {
    const r = v.output_data
    if (!r) return
    setIdeaDescription(v.input_data?.idea_description ?? '')
    setResult(r)
    setSavedIdea(false)
    setSavedProject(false)
  }

  const verdict   = result ? VERDICT_CONFIG[result.verdict] : null
  const compLabel = result ? COMPETITION_LABELS[result.competition_level] : null
  const limitReached = validationsLoaded && pastValidations.length >= MAX_VALIDATIONS

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* ── Header ── */}
      <div className="mb-6">
        <h1
          className="text-3xl font-black tracking-tight text-foreground"
          style={{ letterSpacing: '-0.04em' }}
        >
          Valider mon idée
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Décris ton idée. Buildrs analyse le marché et te dit si ça vaut le coup de lancer.
        </p>

        {/* Data sources bar */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-2.5 text-foreground/50">
            <RedditIconMono size={14} />
            <ProductHuntIconMono size={14} />
            <AppStoreIconMono size={14} />
            <IndieHackersIconMono size={14} />
          </div>
          <span
            className="h-3 w-px bg-border"
            aria-hidden
          />
          <span className="text-[10px] font-medium text-muted-foreground/50">
            Validé par de vraies données du marché
          </span>
          {validationsLoaded && (
            <span
              className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={
                limitReached
                  ? { background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }
                  : { background: 'rgba(16,185,129,0.08)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }
              }
            >
              {pastValidations.length}/{MAX_VALIDATIONS} validations
            </span>
          )}
        </div>
      </div>

      {/* ── Past validations history ── */}
      {validationsLoaded && pastValidations.length > 0 && (
        <div className="mb-5 space-y-2">
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground/50 mb-2">
            Tes validations précédentes
          </p>
          <div className="flex flex-col gap-1.5">
            {pastValidations.map(v => {
              const r = v.output_data
              const avgScore = r ? Math.round((r.demand_score + r.feasibility_score + r.revenue_score) / 3) : null
              const vc = r ? VERDICT_CONFIG[r.verdict] : null
              const date = new Date(v.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
              return (
                <button
                  key={v.id}
                  onClick={() => loadPastValidation(v)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-foreground/20 bg-card transition-all text-left group"
                >
                  {/* Verdict dot */}
                  {vc && (
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: vc.color }}
                    />
                  )}
                  {/* Idea */}
                  <p className="flex-1 text-[12px] font-medium text-foreground truncate min-w-0">
                    {v.input_data?.idea_description?.slice(0, 80) ?? 'Validation sans description'}
                  </p>
                  {/* Score */}
                  {avgScore !== null && (
                    <span
                      className="text-[13px] font-black font-mono flex-shrink-0"
                      style={{ color: scoreColor(avgScore), letterSpacing: '-0.04em' }}
                    >
                      {avgScore}
                    </span>
                  )}
                  {/* Date + arrow */}
                  <span className="text-[10px] text-muted-foreground/40 flex-shrink-0">{date}</span>
                  <ChevronRight size={12} strokeWidth={2} className="text-muted-foreground/30 group-hover:text-foreground/60 transition-colors flex-shrink-0" />
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex gap-6 items-start">

        {/* ── LEFT — Form ── */}
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
                {PRODUCT_TYPES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
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
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
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
                {MARKET_TYPES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
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
                {PRICING_MODELS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            {/* Submit */}
            {limitReached && !result ? (
              <div
                className="w-full text-center py-3 rounded-xl text-[12px] font-semibold"
                style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}
              >
                Limite de {MAX_VALIDATIONS} validations atteinte
              </div>
            ) : (
              <button
                onClick={handleAnalyze}
                disabled={loading || !ideaDescription.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-50"
                style={{ background: '#7C3AED' }}
              >
                {loading ? (
                  <><Loader2 size={14} strokeWidth={1.5} className="animate-spin" />Analyse en cours...</>
                ) : (
                  'Analyser l\'idée →'
                )}
              </button>
            )}

            {error && <p className="text-xs text-destructive text-center">{error}</p>}
          </div>

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

        {/* ── RIGHT — Scorecard ── */}
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
                    <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: verdict.color }}>
                      VERDICT
                    </span>
                    <p
                      className="text-lg font-black tracking-tight mt-0.5"
                      style={{ color: verdict.color, letterSpacing: '-0.03em' }}
                    >
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

                <div className="border border-border rounded-xl p-4 bg-card space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={13} strokeWidth={1.5} className="text-muted-foreground" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Demande</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-black font-mono" style={{ color: scoreColor(result.demand_score), letterSpacing: '-0.03em' }}>{result.demand_score}</span>
                    <span className="text-xs text-muted-foreground mb-0.5">/100</span>
                  </div>
                  <ScoreBar value={result.demand_score} color={scoreColor(result.demand_score)} />
                  {result.insights.demand && <p className="text-[10px] text-muted-foreground/70 leading-relaxed line-clamp-3">{result.insights.demand}</p>}
                </div>

                <div className="border border-border rounded-xl p-4 bg-card space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield size={13} strokeWidth={1.5} className="text-muted-foreground" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Concurrence</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-sm font-bold px-2 py-0.5 rounded-full"
                      style={{ color: compLabel.color, background: `${compLabel.color}18`, border: `1px solid ${compLabel.color}40` }}
                    >
                      {compLabel.label}
                    </span>
                  </div>
                  {result.insights.competition && <p className="text-[10px] text-muted-foreground/70 leading-relaxed line-clamp-3 mt-1">{result.insights.competition}</p>}
                </div>

                <div className="border border-border rounded-xl p-4 bg-card space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap size={13} strokeWidth={1.5} className="text-muted-foreground" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Faisabilité</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-black font-mono" style={{ color: scoreColor(result.feasibility_score), letterSpacing: '-0.03em' }}>{result.feasibility_score}</span>
                    <span className="text-xs text-muted-foreground mb-0.5">/100</span>
                  </div>
                  <ScoreBar value={result.feasibility_score} color={scoreColor(result.feasibility_score)} />
                  {result.insights.feasibility && <p className="text-[10px] text-muted-foreground/70 leading-relaxed line-clamp-3">{result.insights.feasibility}</p>}
                </div>

                <div className="border border-border rounded-xl p-4 bg-card space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign size={13} strokeWidth={1.5} className="text-muted-foreground" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Monétisation</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-black font-mono" style={{ color: scoreColor(result.revenue_score), letterSpacing: '-0.03em' }}>{result.revenue_score}</span>
                    <span className="text-xs text-muted-foreground mb-0.5">/100</span>
                  </div>
                  <ScoreBar value={result.revenue_score} color={scoreColor(result.revenue_score)} />
                  {result.insights.revenue && <p className="text-[10px] text-muted-foreground/70 leading-relaxed line-clamp-3">{result.insights.revenue}</p>}
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
                              <a href={`https://${c.url}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-muted-foreground hover:text-foreground transition-colors">
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

              {/* ── Save actions ── */}
              <div className="flex flex-col gap-2">
                {/* Save validation */}
                <button
                  onClick={() => void saveToIdeas(false, setSavingIdea)}
                  disabled={savingIdea || savedIdea}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all"
                  style={
                    savedIdea
                      ? { background: 'rgba(16,185,129,0.08)', color: '#10B981', borderColor: 'rgba(16,185,129,0.3)' }
                      : { background: 'hsl(var(--secondary))', color: 'hsl(var(--foreground))', borderColor: 'hsl(var(--border))' }
                  }
                >
                  {savedIdea ? (
                    <><Check size={14} strokeWidth={2} /> Validation sauvegardée</>
                  ) : savingIdea ? (
                    <><Loader2 size={13} strokeWidth={1.5} className="animate-spin" /> Sauvegarde...</>
                  ) : (
                    <><BookmarkPlus size={14} strokeWidth={1.5} /> Sauvegarder la validation de mon idée</>
                  )}
                </button>

                {/* Save project */}
                <button
                  onClick={() => savedProject ? navigate('#/dashboard/project') : void saveToIdeas(true, setSavingProject)}
                  disabled={savingProject}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ background: '#7C3AED' }}
                >
                  {savingProject ? (
                    <><Loader2 size={13} strokeWidth={1.5} className="animate-spin" /> Sauvegarde...</>
                  ) : savedProject ? (
                    'Voir mes projets →'
                  ) : (
                    'Sauvegarder dans mes projets →'
                  )}
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}
