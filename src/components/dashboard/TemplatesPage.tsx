import { useState } from 'react'
import { Copy, Check, FileText } from 'lucide-react'

interface Template {
  id: string
  category: 'claude-config' | 'claude-code' | 'prompts' | 'system-prompts' | 'business' | 'landing-page'
  title: string
  description: string
  content: string
}

const CATEGORIES: { key: Template['category']; label: string }[] = [
  { key: 'claude-config',   label: 'Claude Config' },
  { key: 'claude-code',     label: 'Claude Code' },
  { key: 'prompts',         label: 'Prompts' },
  { key: 'system-prompts',  label: 'System Prompts' },
  { key: 'business',        label: 'Business' },
  { key: 'landing-page',    label: 'Landing Page' },
]

const TEMPLATES: Template[] = [
  {
    id: 'claude-md-saas',
    category: 'claude-config',
    title: 'CLAUDE.md SaaS Template',
    description: 'Configuration Claude Code pour un projet SaaS React + Supabase + Stripe',
    content: `# CLAUDE.md — [TON_PROJET]

## Contexte du projet
- **Nom** : [NOM_PROJET]
- **Stack** : React + TypeScript + Vite + Tailwind + Supabase + Stripe + Vercel
- **Objectif** : [DESCRIPTION_COURTE]

## Regles absolues
- Ne jamais exposer les cles API cote client
- RLS activee sur toutes les tables Supabase
- Mobile-first (375px minimum)
- Build : npx vite build (jamais npm run dev)

## DA
- Fond : blanc (#ffffff)
- Typo : Geist
- Icones : Lucide strokeWidth 1.5
- Zero emoji dans le code

## Stack
- Auth : Supabase Auth
- DB : Supabase PostgreSQL
- Paiements : Stripe Checkout
- Hosting : Vercel`,
  },
  {
    id: 'mcp-json',
    category: 'claude-config',
    title: '.mcp.json Buildrs Stack',
    description: 'Configuration MCP avec Context7, Supabase, Stripe et GitHub',
    content: `{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--supabase-url", "https://[TON_ID].supabase.co",
        "--service-role-key", "[TON_SERVICE_ROLE_KEY]"
      ]
    }
  }
}`,
  },
  {
    id: 'init-project',
    category: 'claude-code',
    title: 'Prompt Init Projet',
    description: 'Demarre un nouveau projet React + Supabase depuis zero',
    content: `Cree un projet React + TypeScript + Vite avec Tailwind CSS.

Structure :
- src/components/ (composants React)
- src/hooks/ (hooks personnalises)
- src/lib/supabase.ts (client Supabase)
- src/data/ (donnees statiques)

Configuration :
- Tailwind v3 avec PostCSS (pas @tailwindcss/vite)
- Variables CSS HSL dans index.css
- Geist font via CDN dans index.html

Pas de npm run dev — utilise npx vite build + npx serve dist.`,
  },
  {
    id: 'supabase-auth',
    category: 'claude-code',
    title: 'Prompt Auth Supabase',
    description: 'Implemente auth email + Google OAuth avec Supabase',
    content: `Implemente l'authentification Supabase avec :
- Email + mot de passe (signup/signin)
- Google OAuth
- Hook useAuth() qui expose { user, loading, signIn, signUp, signOut }
- Redirection post-auth vers /dashboard
- Gestion des erreurs en francais
- Pas de librairie externe - uniquement @supabase/supabase-js

Variables d'environnement :
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY`,
  },
  {
    id: 'validate-idea',
    category: 'prompts',
    title: 'Validation d\'idee SaaS',
    description: 'Demande a Claude de valider ton idee avant de coder',
    content: `Analyse cette idee de micro-SaaS et dis-moi si elle vaut la peine d'etre construite.

Idee : [TON_IDEE]
Cible : [TA_CIBLE]
Prix envisage : [PRIX]/mois

Evalua sur ces criteres (note /10 pour chacun) :
1. Taille du marche
2. Douleur reelle (des gens paient deja pour resoudre ce probleme ?)
3. Concurrence (facilite de differentiation)
4. Faisabilite technique en solo en moins de 2 semaines
5. Potentiel MRR a 6 mois

Conclus avec : GO / PIVOT / STOP et explique pourquoi en 3 phrases.`,
  },
  {
    id: 'debug-prompt',
    category: 'prompts',
    title: 'Prompt Debug',
    description: 'Identifie et corrige un bug rapidement',
    content: `J'ai une erreur dans mon code. Identifie la cause et propose une correction.

Erreur :
\`\`\`
[COLLE_TON_ERREUR_ICI]
\`\`\`

Code concerne :
\`\`\`
[COLLE_TON_CODE_ICI]
\`\`\`

Contexte : [DECRIS_CE_QUE_TU_ESSAYAIS_DE_FAIRE]

Reponds en :
1. Cause probable (1 phrase)
2. Correction (code corrige complet)
3. Comment eviter ca a l'avenir (1 phrase)`,
  },
  {
    id: 'jarvis-system',
    category: 'system-prompts',
    title: 'System Prompt Jarvis',
    description: 'System prompt pour un assistant IA de type copilote projet',
    content: `Tu es Jarvis, le copilote IA de [TON_NOM]. Tu es direct, expert, et oriente resultats.

Ton role : m'aider a construire mon micro-SaaS [NOM_PROJET] qui [DESCRIPTION].

Contexte projet :
- Stack : React + Supabase + Stripe + Vercel
- Stade actuel : [STADE]
- Prochaine etape : [ETAPE]

Regles :
- Reponses courtes et actionnables
- Si tu ne sais pas, dis-le
- Toujours proposer une prochaine action concrete
- Pas de bla-bla inutile
- Tutoiement obligatoire`,
  },
  {
    id: 'product-brief',
    category: 'business',
    title: 'Brief Produit',
    description: 'Template de brief pour definir ton produit avant de coder',
    content: `# Brief Produit — [NOM_PROJET]

## Le probleme
[Decris le probleme en 2-3 phrases. Qui le vit ? Quand ? Pourquoi c'est douloureux ?]

## La solution
[Ton produit en 1 phrase : "[NOM] aide [CIBLE] a [BENEFICE] en [COMMENT]"]

## MVP (feature principale)
[La 1 seule fonctionnalite qui justifie le paiement]

## Cible
- Qui : [profil exact]
- Ou les trouver : [LinkedIn / Reddit / Twitter / etc]
- Budget : [combien ils paient deja pour des outils similaires]

## Monetisation
- [ ] Freemium + Pro [PRIX]EUR/mois
- [ ] One-shot [PRIX]EUR
- [ ] Commande client

## Stack
- Frontend : React + TypeScript + Vite + Tailwind
- Backend : Supabase
- Paiements : Stripe
- Hosting : Vercel

## Timeline
- J1-J2 : Structure + Auth + DB
- J3-J4 : Feature principale
- J5 : Deploiement + Stripe
- J6 : Landing page
- J7 : Lancement`,
  },
  {
    id: 'lp-structure',
    category: 'landing-page',
    title: 'Structure Landing Page',
    description: 'Plan complet d\'une landing page qui convertit',
    content: `# Landing Page — [NOM_PROJET]

## 1. Hero
- Titre : [Benefice principal en moins de 8 mots]
- Sous-titre : [Qui c'est pour + comment ca marche en 1 phrase]
- CTA : [Action claire — "Commencer gratuitement" / "Voir la demo"]
- Proof : [Nombre d'utilisateurs / temoignage / logo clients]

## 2. Probleme
- "Tu connais ce sentiment quand..."
- 3 points de douleur specifiques
- Transition : "Il devrait exister un outil qui..."

## 3. Solution
- Presentation du produit (screenshot ou demo)
- 3 benefices cles (pas des features — des benefices)

## 4. Comment ca marche
- Etape 1 : [Action simple]
- Etape 2 : [Resultat immediate]
- Etape 3 : [Benefice final]

## 5. Preuves sociales
- Temoignages (vrais ou beta testeurs)
- Logos clients si B2B
- Statistiques si disponibles

## 6. Pricing
- Plan gratuit (si applicable)
- Plan principal avec CTA
- Garantie remboursement 30j

## 7. FAQ
- 5-7 questions cles qui bloquent l'achat

## 8. CTA final
- Repete le titre hero
- CTA identique au hero`,
  },
]

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-secondary/60 transition-colors text-muted-foreground hover:text-foreground"
      >
        {copied ? <Check size={12} strokeWidth={1.5} style={{ color: '#22c55e' }} /> : <Copy size={12} strokeWidth={1.5} />}
        {copied ? 'Copie !' : 'Copier'}
      </button>
      {copied && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background text-xs font-semibold shadow-lg"
          style={{ animation: 'fadeInUp 0.2s ease' }}
        >
          <Check size={13} strokeWidth={2.5} style={{ color: '#22c55e' }} />
          Copie dans le presse-papier
        </div>
      )}
    </>
  )
}

interface Props {
  navigate: (hash: string) => void
}

export function TemplatesPage({ navigate: _navigate }: Props) {
  const [activeCategory, setActiveCategory] = useState<Template['category'] | 'all'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = activeCategory === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.category === activeCategory)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight" style={{ letterSpacing: '-0.03em' }}>
          Templates
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {TEMPLATES.length} templates prets a copier — {CATEGORIES.length} categories
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory('all')}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
            activeCategory === 'all'
              ? 'bg-foreground text-background border-foreground'
              : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/20'
          }`}
        >
          Tous
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
              activeCategory === cat.key
                ? 'bg-foreground text-background border-foreground'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/20'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Templates list */}
      <div className="flex flex-col gap-3">
        {filtered.map(t => {
          const isOpen = expanded === t.id
          const catLabel = CATEGORIES.find(c => c.key === t.category)?.label ?? t.category
          return (
            <div key={t.id} className="border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : t.id)}
                className="flex items-center gap-3 w-full text-left px-5 py-4 hover:bg-secondary/30 transition-colors"
              >
                <FileText size={14} strokeWidth={1.5} className="text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{t.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground flex-shrink-0">
                  {catLabel}
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-border px-5 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Contenu</p>
                    <CopyButton content={t.content} />
                  </div>
                  <pre className="text-xs text-muted-foreground bg-secondary/40 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                    {t.content}
                  </pre>
                </div>
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}
