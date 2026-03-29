# Générateurs IA — NicheFinder + MarketPulse Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Brancher de la vraie IA (Claude via Anthropic API) sur NicheFinder et MarketPulse — formulaires enrichis → appels Edge Function → rapports détaillés avec scoring.

**Architecture:** Deux agents en parallèle. Agent A : NicheFinder (nouvelle Edge Function `generate-ideas` + refactor frontend). Agent B : MarketPulse (frontend only — l'Edge Function `validate-idea` existe déjà). Aucun fichier partagé, aucun conflit possible.

**Tech Stack:** React 18 + TypeScript, Supabase Edge Functions (Deno), Anthropic API (Claude Sonnet), `supabase.functions.invoke()` côté client.

**Spec:** `docs/superpowers/specs/2026-03-29-generators-ia-design.md`

---

## AGENT A — NicheFinder

## Chunk 1: Edge Function generate-ideas

### Task 1: Migration SQL — table idea_generations

**Files:**
- Create: `supabase/migrations/20260329_idea_generations.sql`

- [ ] **Step 1: Créer la migration**

```sql
-- supabase/migrations/20260329_idea_generations.sql
CREATE TABLE IF NOT EXISTS public.idea_generations (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  inputs      JSONB       NOT NULL DEFAULT '{}',
  ideas       JSONB       NOT NULL DEFAULT '[]',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.idea_generations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "idea_generations_select" ON public.idea_generations;
DROP POLICY IF EXISTS "idea_generations_insert" ON public.idea_generations;

CREATE POLICY "idea_generations_select" ON public.idea_generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "idea_generations_insert" ON public.idea_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

- [ ] **Step 2: Appliquer la migration**

```bash
cd "/Users/alfredorsini/CLAUDE/###BLUEPRINT BUILDRS"
npx supabase db push
```

Si `supabase` CLI non dispo localement, créer la table manuellement dans le dashboard Supabase SQL Editor en exécutant le contenu du fichier.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260329_idea_generations.sql
git commit -m "feat(db): add idea_generations table with RLS"
```

---

### Task 2: Edge Function generate-ideas

**Files:**
- Create: `supabase/functions/generate-ideas/index.ts`

Pattern de référence : `supabase/functions/validate-idea/index.ts` (même structure : CORS, auth JWT, appel Claude, retour JSON).

- [ ] **Step 1: Créer l'Edge Function**

```typescript
// supabase/functions/generate-ideas/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SYSTEM_PROMPT = `Tu es un expert en micro-SaaS B2B. Tu génères des idées de micro-SaaS rentables et buildables en 72h avec Claude Code.

On te donne le profil d'un entrepreneur :
- Secteur/expertise
- Niveau technique
- Budget disponible
- Stratégie choisie
- Contexte optionnel

Génère exactement 5 idées de micro-SaaS adaptées à ce profil et retourne UNIQUEMENT ce JSON (zéro texte avant ou après) :
{
  "ideas": [
    {
      "name": "<nom produit>",
      "tagline": "<accroche 1 phrase max>",
      "problem": "<problème précis résolu en 1 phrase>",
      "target": "<cible principale>",
      "price": "<prix mensuel ex: 19€/mois>",
      "mrr_potential": "<fourchette MRR ex: 1 500–5 000€>",
      "difficulty": "<facile|moyen|difficile>",
      "score": <number 0-100>,
      "why_now": "<pourquoi ce moment est idéal, 1-2 phrases>"
    }
  ]
}

Règles de scoring (0-100) : taille marché adressable + concurrence existante + faisabilité 72h avec Claude Code + willingness to pay prouvée + timing IA/2026.

Règles de difficulté :
- "facile" : CRUD + IA, buildable en 24-48h
- "moyen" : intégrations multiples, buildable en 48-72h
- "difficile" : architecture complexe, > 72h

Les idées doivent :
- Être en français (noms produits en anglais ok)
- Être buildables avec : Supabase + Vercel + Stripe + Resend + Claude API
- Correspondre au profil donné (secteur, niveau, budget)
- Avoir un MRR potentiel réaliste pour le marché français

Retourne UNIQUEMENT le JSON. Rien d'autre.`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const { secteur, niveau, budget, strategie, contexte } = body

    if (!secteur || !niveau || !budget || !strategie) {
      return new Response(
        JSON.stringify({ error: 'Champs requis manquants.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Auth
    const authHeader = req.headers.get('Authorization') ?? ''
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', ''),
    )

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Non authentifié.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Quota check — 5 générations max pour plan blueprint
    const { count } = await supabase
      .from('idea_generations')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)

    const plan: string = user.user_metadata?.buildrs_plan ?? 'blueprint'
    if (plan === 'blueprint' && (count ?? 0) >= 5) {
      return new Response(
        JSON.stringify({ error: 'quota_exceeded' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    // Build user message
    const userMessage = `Profil de l'entrepreneur :
- Secteur/expertise : ${secteur}
- Niveau technique : ${niveau}
- Budget disponible : ${budget}
- Stratégie : ${strategie}${contexte ? `\n- Contexte : ${contexte}` : ''}`

    // Call Claude
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')!
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!claudeRes.ok) {
      const errText = await claudeRes.text()
      console.error('Claude API error:', errText)
      return new Response(
        JSON.stringify({ error: 'Erreur IA, réessaie dans un instant.' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const claudeData = await claudeRes.json()
    const rawText: string = claudeData.content?.[0]?.text ?? ''

    // Parse JSON
    let result: { ideas: unknown[] }
    try {
      result = JSON.parse(rawText.trim())
    } catch {
      const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      try {
        result = JSON.parse(cleaned)
      } catch {
        console.error('JSON parse failed:', rawText)
        return new Response(
          JSON.stringify({ error: 'Réponse IA invalide, réessaie.' }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
    }

    // Save to idea_generations
    await supabase.from('idea_generations').insert({
      user_id: user.id,
      inputs: { secteur, niveau, budget, strategie, contexte },
      ideas: result.ideas ?? [],
    }).catch((e) => console.error('Insert error:', e))

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Erreur serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
```

- [ ] **Step 2: Déployer l'Edge Function**

```bash
cd "/Users/alfredorsini/CLAUDE/###BLUEPRINT BUILDRS"
npx supabase functions deploy generate-ideas
```

Si CLI indispo, le déploiement se fera via git push (Supabase auto-déploie les Edge Functions depuis le repo si configuré).

- [ ] **Step 3: Commit**

```bash
git add supabase/functions/generate-ideas/index.ts
git commit -m "feat(edge): add generate-ideas Edge Function with Claude + quota"
```

---

## Chunk 2: NicheFinder Frontend

### Task 3: Refactor GeneratorIdeas.tsx

**Files:**
- Modify: `blueprint-app/src/components/dashboard/GeneratorIdeas.tsx` (réécriture complète)

Remplace la banque statique + dropdowns par : formulaire enrichi → `supabase.functions.invoke('generate-ideas')` → affichage 5 ideas IA.

- [ ] **Step 1: Réécrire GeneratorIdeas.tsx**

```tsx
// blueprint-app/src/components/dashboard/GeneratorIdeas.tsx
import { useState } from 'react'
import { Lightbulb, RefreshCw, Copy, Check, ChevronRight, Sparkles, Zap } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface GeneratedIdea {
  name: string
  tagline: string
  problem: string
  target: string
  price: string
  mrr_potential: string
  difficulty: 'facile' | 'moyen' | 'difficile'
  score: number
  why_now: string
}

const DIFFICULTY_COLORS: Record<string, string> = {
  facile: '#22c55e',
  moyen: '#eab308',
  difficile: '#ff6b6b',
}

const NIVEAUX = [
  { value: 'débutant', label: 'Débutant — jamais codé' },
  { value: 'intermédiaire', label: 'Intermédiaire — quelques projets' },
  { value: 'avancé', label: 'Avancé — à l\'aise avec la tech' },
]

const BUDGETS = [
  { value: '0€', label: '0€ — gratuit uniquement' },
  { value: 'moins de 100€', label: 'Moins de 100€/mois' },
  { value: '100–500€', label: '100–500€/mois' },
]

const STRATEGIES = [
  { value: 'copier un SaaS existant', label: 'Copier un SaaS existant' },
  { value: 'résoudre mon problème', label: 'Résoudre mon problème' },
  { value: 'découvrir des opportunités', label: 'Découvrir des opportunités' },
]

interface Props {
  navigate: (hash: string) => void
}

type Step = 'form' | 'loading' | 'results'

export function GeneratorIdeas({ navigate }: Props) {
  const [step, setStep] = useState<Step>('form')
  const [secteur, setSecteur] = useState('')
  const [niveau, setNiveau] = useState('')
  const [budget, setBudget] = useState('')
  const [strategie, setStrategie] = useState('')
  const [contexte, setContexte] = useState('')
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([])
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const isFormValid = secteur.trim() && niveau && budget && strategie

  const generate = async () => {
    setError(null)
    setStep('loading')

    const { data, error: fnError } = await supabase.functions.invoke('generate-ideas', {
      body: { secteur: secteur.trim(), niveau, budget, strategie, contexte: contexte.trim() || undefined },
    })

    if (fnError || !data?.ideas) {
      const msg = data?.error === 'quota_exceeded'
        ? 'Tu as atteint ta limite de 5 générations. Passe en mode Premium pour continuer.'
        : 'Erreur IA. Vérifie ta connexion et réessaie.'
      setError(msg)
      setStep('form')
      return
    }

    setIdeas(data.ideas as GeneratedIdea[])
    setStep('results')
  }

  const reset = () => {
    setStep('form')
    setIdeas([])
    setError(null)
  }

  const claudePrompt = `Tu es un expert micro-SaaS. Génère 10 idées de micro-SaaS dans le secteur "${secteur}" pour un profil ${niveau}, budget ${budget}, stratégie : ${strategie}. Pour chaque idée : nom, problème, cible, prix mensuel, MRR potentiel, stack technique suggéré.`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(claudePrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  if (step === 'form') {
    return (
      <div className="p-7 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1.5">
            <Lightbulb size={16} strokeWidth={1.5} className="text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Plugin IA</p>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
            NicheFinder
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Décris ton profil. L'IA génère 5 idées de micro-SaaS sur mesure avec scoring.
          </p>
        </div>

        <div className="border border-border rounded-xl p-5 flex flex-col gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ton profil</p>

          {/* Secteur */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
              Ton secteur ou expertise *
            </label>
            <input
              value={secteur}
              onChange={e => setSecteur(e.target.value)}
              placeholder="ex: comptabilité, RH, e-commerce, santé, immobilier..."
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>

          {/* Niveau + Budget */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                Niveau technique *
              </label>
              <select
                value={niveau}
                onChange={e => setNiveau(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              >
                <option value="">Choisir...</option>
                {NIVEAUX.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                Budget mensuel *
              </label>
              <select
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              >
                <option value="">Choisir...</option>
                {BUDGETS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
          </div>

          {/* Stratégie */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
              Stratégie *
            </label>
            <select
              value={strategie}
              onChange={e => setStrategie(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            >
              <option value="">Choisir...</option>
              {STRATEGIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {/* Contexte */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
              Contexte (optionnel)
            </label>
            <textarea
              value={contexte}
              onChange={e => setContexte(e.target.value)}
              placeholder="Un problème que tu as observé, une niche que tu veux cibler, une contrainte particulière..."
              rows={3}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
            />
          </div>

          {error && (
            <p className="text-xs font-medium" style={{ color: '#ff6b6b' }}>{error}</p>
          )}

          <button
            onClick={generate}
            disabled={!isFormValid}
            className="flex items-center gap-2 bg-foreground text-background rounded-xl px-5 py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed self-start"
          >
            <Sparkles size={14} strokeWidth={1.5} />
            Générer 5 idées avec l'IA
          </button>
        </div>
      </div>
    )
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (step === 'loading') {
    return (
      <div className="p-7 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1.5">
            <Lightbulb size={16} strokeWidth={1.5} className="text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Plugin IA</p>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
            NicheFinder
          </h1>
        </div>
        <div className="border border-border rounded-xl p-8 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-3">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-foreground/30"
                style={{ animation: `bounce 1.2s ease infinite ${i * 0.2}s` }}
              />
            ))}
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">Jarvis génère tes idées...</p>
          <p className="text-xs text-muted-foreground">Analyse du marché en cours — 5 à 8 secondes</p>
        </div>
        <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }`}</style>
      </div>
    )
  }

  // ── Results ───────────────────────────────────────────────────────────────
  return (
    <div className="p-7 max-w-3xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <Lightbulb size={16} strokeWidth={1.5} className="text-muted-foreground" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Plugin IA</p>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
            NicheFinder
          </h1>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5"
          >
            <RefreshCw size={11} strokeWidth={1.5} />
            Recommencer
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Secteur : <span className="font-semibold text-foreground">{secteur}</span>
          {' · '}Niveau : <span className="font-semibold text-foreground">{niveau}</span>
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        {ideas.map((idea, i) => {
          const diffColor = DIFFICULTY_COLORS[idea.difficulty] ?? '#eab308'
          const scoreColor = idea.score >= 75 ? '#22c55e' : idea.score >= 55 ? '#4d96ff' : '#eab308'
          return (
            <div key={i} className="border border-border rounded-xl px-5 py-4 hover:border-foreground/20 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-bold text-muted-foreground tabular-nums">#{i + 1}</span>
                    <span className="text-sm font-bold text-foreground">{idea.name}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ color: scoreColor, background: `${scoreColor}18` }}>
                      {idea.score}/100
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize" style={{ color: diffColor, background: `${diffColor}18` }}>
                      {idea.difficulty}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-foreground/80 mb-1">{idea.tagline}</p>
                  <p className="text-[10px] text-muted-foreground mb-1">
                    Cible : {idea.target} · <span className="font-semibold" style={{ color: '#22c55e' }}>{idea.price}</span> · MRR : <span className="font-semibold text-foreground">{idea.mrr_potential}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground italic">
                    <Zap size={9} strokeWidth={1.5} className="inline mr-0.5 -mt-0.5" style={{ color: '#eab308' }} />
                    {idea.why_now}
                  </p>
                </div>
                <button
                  onClick={() => navigate('#/dashboard/generator/validate')}
                  className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 mt-1"
                >
                  Valider
                  <ChevronRight size={11} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Claude prompt */}
      <div className="border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-secondary/50 border-b border-border">
          <span className="text-[11px] font-semibold text-foreground">Prompt Claude pour aller plus loin</span>
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
        <div className="px-4 py-3">
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">{claudePrompt}</p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build de vérification**

```bash
cd "/Users/alfredorsini/CLAUDE/###BLUEPRINT BUILDRS/blueprint-app"
npx vite build 2>&1 | tail -20
```

Résultat attendu : `✓ built in` sans erreur TypeScript.

- [ ] **Step 3: Commit**

```bash
cd "/Users/alfredorsini/CLAUDE/###BLUEPRINT BUILDRS"
git add blueprint-app/src/components/dashboard/GeneratorIdeas.tsx
git commit -m "feat(nichefinder): AI-powered form with Claude integration and scored results"
```

---

## AGENT B — MarketPulse

## Chunk 3: MarketPulse Frontend

### Task 4: Refactor GeneratorValidate.tsx

**Files:**
- Modify: `blueprint-app/src/components/dashboard/GeneratorValidate.tsx` (réécriture complète)

L'Edge Function `validate-idea` est opérationnelle. Elle attend `{ answers: string[] }` (5 éléments).
Pattern d'appel : `supabase.functions.invoke('validate-idea', { body: { answers } })`.

Réponse JSON :
```json
{
  "score": 78,
  "criteria": { "marche": 16, "concurrence": 14, "faisabilite": 18, "monetisation": 15, "timing": 15 },
  "verdict": "go_reserves",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "recommendations": ["..."],
  "summary": "..."
}
```

Erreur quota : `data.error === 'quota_exceeded'` (status 403).

- [ ] **Step 1: Réécrire GeneratorValidate.tsx**

```tsx
// blueprint-app/src/components/dashboard/GeneratorValidate.tsx
import { useState } from 'react'
import { ShieldCheck, Sparkles, RefreshCw, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface ValidationReport {
  score: number
  criteria: {
    marche: number
    concurrence: number
    faisabilite: number
    monetisation: number
    timing: number
  }
  verdict: 'go' | 'go_reserves' | 'pivot'
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  summary: string
}

const VERDICTS = {
  go:         { label: 'Fonce.', color: '#22c55e', desc: "Toutes les conditions sont réunies. Lance-toi." },
  go_reserves:{ label: 'Prometteur', color: '#4d96ff', desc: 'Bonne base. Quelques points à adresser avant de coder.' },
  pivot:      { label: 'À revoir', color: '#ff6b6b', desc: 'Score faible. Reconsidère ou pivote sur les axes faibles.' },
}

const CRITERIA_LABELS: Record<string, string> = {
  marche: 'Taille de marché',
  concurrence: 'Concurrence',
  faisabilite: 'Faisabilité 72h',
  monetisation: 'Monétisation',
  timing: 'Timing IA',
}

const CRITERIA_COLORS: Record<string, string> = {
  marche: '#4d96ff',
  concurrence: '#cc5de8',
  faisabilite: '#22c55e',
  monetisation: '#eab308',
  timing: '#ff6b6b',
}

const MONETISATION_OPTIONS = [
  'Abonnement mensuel (SaaS)',
  'Paiement unique (one-shot)',
  'Freemium + upgrade payant',
  'Usage-based (à la consommation)',
]

interface Props {
  navigate: (hash: string) => void
}

type Step = 'form' | 'loading' | 'results'

export function GeneratorValidate({ navigate: _navigate }: Props) {
  const [step, setStep] = useState<Step>('form')
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [cible, setCible] = useState('')
  const [monetisation, setMonetisation] = useState('')
  const [concurrents, setConcurrents] = useState('')
  const [probleme, setProbleme] = useState('')
  const [report, setReport] = useState<ValidationReport | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isFormValid = description.trim() && cible.trim() && monetisation && probleme.trim()

  const analyze = async () => {
    setError(null)
    setStep('loading')

    const answers = [
      description.trim(),
      cible.trim(),
      monetisation,
      concurrents.trim() || 'Je ne connais pas de concurrents directs',
      probleme.trim(),
    ]

    const { data, error: fnError } = await supabase.functions.invoke('validate-idea', {
      body: { answers },
    })

    if (fnError || !data?.score) {
      const msg = data?.error === 'quota_exceeded'
        ? 'Tu as atteint ta limite de 3 analyses. Passe en mode Premium pour continuer.'
        : 'Erreur IA. Vérifie ta connexion et réessaie.'
      setError(msg)
      setStep('form')
      return
    }

    setReport(data as ValidationReport)
    setStep('results')
  }

  const reset = () => {
    setStep('form')
    setReport(null)
    setError(null)
    setNom('')
    setDescription('')
    setCible('')
    setMonetisation('')
    setConcurrents('')
    setProbleme('')
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  if (step === 'form') {
    return (
      <div className="p-7 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldCheck size={16} strokeWidth={1.5} className="text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Plugin IA</p>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
            MarketPulse
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Décris ton idée. L'IA analyse le marché et retourne un score /100 avec recommandations.
          </p>
        </div>

        <div className="border border-border rounded-xl p-5 flex flex-col gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ton idée</p>

          {/* Nom */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
              Nom de ton idée (optionnel)
            </label>
            <input
              value={nom}
              onChange={e => setNom(e.target.value)}
              placeholder="ex: FactureAI, RecrutBot..."
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
              Décris ton produit en une phrase *
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="ex: Un outil qui génère des fiches de paie automatiquement pour les TPE"
              rows={2}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
            />
          </div>

          {/* Cible + Monétisation */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                Ta cible principale *
              </label>
              <input
                value={cible}
                onChange={e => setCible(e.target.value)}
                placeholder="ex: Freelances, PME, gérants..."
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                Modèle de monétisation *
              </label>
              <select
                value={monetisation}
                onChange={e => setMonetisation(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              >
                <option value="">Choisir...</option>
                {MONETISATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Concurrents */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
              Concurrents connus (optionnel)
            </label>
            <input
              value={concurrents}
              onChange={e => setConcurrents(e.target.value)}
              placeholder="ex: Pennylane, Indy... ou laisse vide si tu ne sais pas"
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>

          {/* Problème */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
              Le problème principal résolu *
            </label>
            <textarea
              value={probleme}
              onChange={e => setProbleme(e.target.value)}
              placeholder="ex: Les TPE perdent 3h/semaine à faire leurs fiches de paie manuellement sur Excel"
              rows={3}
              className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
            />
          </div>

          {error && (
            <p className="text-xs font-medium" style={{ color: '#ff6b6b' }}>{error}</p>
          )}

          <button
            onClick={analyze}
            disabled={!isFormValid}
            className="flex items-center gap-2 bg-foreground text-background rounded-xl px-5 py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed self-start"
          >
            <Sparkles size={14} strokeWidth={1.5} />
            Analyser avec l'IA
          </button>
        </div>
      </div>
    )
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (step === 'loading') {
    return (
      <div className="p-7 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldCheck size={16} strokeWidth={1.5} className="text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Plugin IA</p>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
            MarketPulse
          </h1>
        </div>
        <div className="border border-border rounded-xl p-8 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-3">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-foreground/30"
                style={{ animation: `bounce 1.2s ease infinite ${i * 0.2}s` }}
              />
            ))}
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">Jarvis analyse ton marché...</p>
          <p className="text-xs text-muted-foreground">Évaluation des 5 critères en cours — 3 à 5 secondes</p>
        </div>
        <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }`}</style>
      </div>
    )
  }

  // ── Results ───────────────────────────────────────────────────────────────
  if (!report) return null
  const verdict = VERDICTS[report.verdict]

  return (
    <div className="p-7 max-w-3xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <ShieldCheck size={16} strokeWidth={1.5} className="text-muted-foreground" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Plugin IA</p>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
            MarketPulse{nom ? ` — ${nom}` : ''}
          </h1>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5"
          >
            <RefreshCw size={11} strokeWidth={1.5} />
            Recommencer
          </button>
        </div>
      </div>

      {/* Score + Verdict */}
      <div
        className="rounded-xl p-6 mb-5 border text-center"
        style={{ borderColor: `${verdict.color}30`, background: `${verdict.color}08` }}
      >
        <p
          className="text-6xl font-extrabold tabular-nums mb-1"
          style={{ letterSpacing: '-0.04em', color: verdict.color }}
        >
          {report.score}<span className="text-3xl opacity-40">/100</span>
        </p>
        <p className="text-base font-bold mb-1" style={{ color: verdict.color }}>{verdict.label}</p>
        <p className="text-xs text-muted-foreground">{verdict.desc}</p>
        {report.summary && (
          <p className="text-xs text-foreground/80 mt-3 max-w-lg mx-auto leading-relaxed border-t border-border/30 pt-3">
            {report.summary}
          </p>
        )}
      </div>

      {/* Criteria bars */}
      <div className="border border-border rounded-xl p-5 mb-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Analyse par critère</p>
        <div className="flex flex-col gap-3">
          {Object.entries(report.criteria).map(([key, val]) => {
            const color = CRITERIA_COLORS[key] ?? '#4d96ff'
            const pct = (val / 20) * 100
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground">{CRITERIA_LABELS[key] ?? key}</span>
                  <span className="text-xs font-bold tabular-nums" style={{ color }}>{val}/20</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Forces / Faiblesses / Recommandations */}
      <div className="grid grid-cols-1 gap-3 mb-5">
        {[
          { icon: TrendingUp, label: 'Forces', items: report.strengths, color: '#22c55e' },
          { icon: AlertTriangle, label: 'Faiblesses', items: report.weaknesses, color: '#ff6b6b' },
          { icon: Lightbulb, label: 'Recommandations', items: report.recommendations, color: '#4d96ff' },
        ].map(({ icon: Icon, label, items, color }) => items?.length > 0 && (
          <div key={label} className="border border-border rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Icon size={13} strokeWidth={1.5} style={{ color }} />
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>{label}</p>
            </div>
            <ul className="flex flex-col gap-1.5">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                  <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build de vérification**

```bash
cd "/Users/alfredorsini/CLAUDE/###BLUEPRINT BUILDRS/blueprint-app"
npx vite build 2>&1 | tail -20
```

Résultat attendu : `✓ built in` sans erreur TypeScript.

- [ ] **Step 3: Commit**

```bash
cd "/Users/alfredorsini/CLAUDE/###BLUEPRINT BUILDRS"
git add blueprint-app/src/components/dashboard/GeneratorValidate.tsx
git commit -m "feat(marketpulse): AI-powered form with Claude analysis and detailed report"
```

---

## Chunk 4: Vérification finale + merge

### Task 5: Build final + smoke test

**Files:** aucun fichier modifié — vérification uniquement.

- [ ] **Step 1: Build complet**

```bash
cd "/Users/alfredorsini/CLAUDE/###BLUEPRINT BUILDRS/blueprint-app"
npx vite build
```

Résultat attendu : build sans erreur.

- [ ] **Step 2: Lancer le serveur local**

```bash
pkill -f "serve dist" 2>/dev/null
npx serve dist --listen 4000 &
open http://localhost:4000
```

- [ ] **Step 3: Vérifications manuelles**

Naviguer vers `#/dashboard/generator/ideas` :
- [ ] Le formulaire s'affiche avec les 4 champs requis + contexte
- [ ] Le bouton est désactivé si secteur vide
- [ ] Cliquer "Générer" → état loading visible

Naviguer vers `#/dashboard/generator/validate` :
- [ ] Le formulaire s'affiche avec les 5 champs
- [ ] Le bouton est désactivé si champs requis vides
- [ ] Cliquer "Analyser" → état loading visible

- [ ] **Step 4: Commit final**

```bash
cd "/Users/alfredorsini/CLAUDE/###BLUEPRINT BUILDRS"
git add -A
git commit -m "feat(generators): NicheFinder + MarketPulse fully wired to Claude AI"
```
