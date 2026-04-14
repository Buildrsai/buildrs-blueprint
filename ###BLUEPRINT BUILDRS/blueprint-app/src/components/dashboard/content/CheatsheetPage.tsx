import { useState, useCallback } from 'react'
import { ArrowLeft, Copy, Check, Search, Terminal } from 'lucide-react'

interface Props {
  navigate: (hash: string) => void
}

const ACCENT = '#4d96ff'

interface Cmd {
  cmd: string
  desc: string
}

interface Section {
  title: string
  note?: string
  commands: Cmd[]
  extra?: React.ReactNode
}

function parseCommands(raw: string): Cmd[] {
  return raw.trim().split('\n').map(line => {
    const [cmd, ...rest] = line.split('#')
    return { cmd: cmd.trim(), desc: rest.join('#').trim() }
  }).filter(c => c.cmd)
}

const MODEL_TABLE = [
  { model: 'Opus 4.6', cmd: '/model opus', when: 'Brainstorm, architecture, décisions complexes', cost: '$$$' },
  { model: 'Sonnet 4.6', cmd: '/model sonnet', when: 'Développement standard, refactoring, debug', cost: '$$' },
  { model: 'Haiku 4.5', cmd: '/model haiku', when: 'Tâches répétitives, résumés, migrations simples', cost: '$' },
]

const SECTIONS: Section[] = [
  {
    title: 'Installation & Configuration',
    commands: parseCommands(`
/install-plugin [nom@marketplace]         # Installer un plugin
/add-marketplace [URL GitHub]             # Ajouter une source de plugins
/plugin list                              # Lister les plugins installés
/plugin update [nom]                      # Mettre à jour un plugin
/config                                   # Configurer Claude Code (modèle, system prompt)
/model opus                               # Passer en Opus (brainstorm, architecture)
/model sonnet                             # Passer en Sonnet (développement standard)
/model haiku                              # Passer en Haiku (tâches simples, économie)
/fast                                     # Toggle mode rapide (Opus accéléré)
`),
  },
  {
    title: 'Planification',
    note: 'Règle Buildrs : on ne code JAMAIS sans avoir planifié. /autoplan ou /superpowers:brainstorm avant chaque nouvelle feature.',
    commands: parseCommands(`
/autoplan                                 # Plan automatique avant de coder
/superpowers:brainstorm                   # Brainstorm structuré (questions → approches → design)
/superpowers:write-plan                   # Écrire un plan d'implémentation détaillé
/superpowers:execute-plan                 # Exécuter le plan task par task
/plan-ceo-review                          # Review du plan angle CEO (ROI, priorités)
/plan-eng-review                          # Review du plan angle ingénierie (faisabilité)
/plan-design-review                       # Review du plan angle UX/UI
`),
  },
  {
    title: 'Développement',
    commands: parseCommands(`
/feature-dev:feature-dev                  # Pipeline 3 agents : explorer → architect → reviewer
/simplify                                 # Simplifier le code modifié (3 agents en parallèle)
/superpowers:test-driven-development      # TDD strict : tests d'abord, code ensuite
/superpowers:systematic-debugging         # Debug scientifique : hypothèse → test → fix
/batch <instruction>                      # Changements massifs en parallèle (5-30 subagents)
/loop [interval] <prompt>                 # Exécuter un prompt à intervalle régulier
`),
  },
  {
    title: 'Design',
    commands: parseCommands(`
/ui-ux-pro-max                            # Review UX complète (le QA design final)
/design                                   # Design général (composants + system)
/design-html                              # Génère du HTML/CSS/Tailwind premium
/design-shotgun                           # 3-5 directions visuelles en parallèle
/design-consultation                      # Consultation design interactive
/design-review                            # Review d'un design existant
/design-system                            # Créer/améliorer un design system complet
/ui-styling                               # Polish CSS — le "dernière mile" visuel
/banner-design                            # Bannières marketing (OG, headers, ads)
/brand                                    # Réflexion brand et identité visuelle
/slides                                   # Présentations structurées
`),
  },
  {
    title: 'Marketing & SEO',
    commands: parseCommands(`
/marketing-skills:copywriting             # Écriture persuasive (headlines, CTAs)
/marketing-skills:page-cro               # Optimiser landing page pour convertir
/marketing-skills:signup-flow-cro        # Optimiser le flow d'inscription
/marketing-skills:launch-strategy        # Plan de lancement produit
/marketing-skills:free-tool-strategy     # Stratégie outil gratuit viral
/marketing-skills:pricing-strategy       # Stratégie de pricing
/marketing-skills:ai-seo                 # SEO IA (contenus optimisés, clusters)
/marketing-skills:cold-email             # Séquences cold email B2B
/marketing-skills:[nom]                  # N'importe quel skill marketing
/seo                                     # Audit SEO technique complet
`),
  },
  {
    title: 'Qualité & Review',
    commands: parseCommands(`
/qa                                       # Tests + QA complets
/qa-only                                  # QA sans modifier le code (audit only)
/code-review:code-review                  # Review approfondie (5 agents parallèles)
/web-quality-audit                        # Audit qualité web complet
/accessibility                            # Audit accessibilité WCAG
/performance                              # Audit performance (bundle, images, fonts)
/core-web-vitals                          # Core Web Vitals Google (LCP, CLS, INP)
/best-practices                           # Checklist bonnes pratiques
/health                                   # Santé du projet (dépendances, vulnérabilités)
/investigate                              # Investigation structurée d'un bug
/debug                                    # Active le logging debug + analyse
`),
  },
  {
    title: 'Déploiement & Git',
    commands: parseCommands(`
/ship                                     # Pipeline complet : lint → build → fix → commit → push
/land-and-deploy                          # Tests → merge → deploy production
/vercel:deploy                            # Deploy Vercel avec vérifications
/vercel:status                            # Statut des deployments
/vercel:bootstrap                         # Initialiser un nouveau projet Vercel
/vercel:env                               # Gérer les variables d'environnement Vercel
/commit                                   # Commit bien formaté (Conventional Commits)
/commit-push-pr                           # Commit + push + PR GitHub en une commande
/setup-deploy                             # Configurer le pipeline depuis zéro
`),
  },
  {
    title: 'Modes Spéciaux',
    commands: parseCommands(`
/careful                                  # Mode ultra-prudent (confirmation systématique)
/checkpoint                               # Checkpoint git avant opération risquée
/freeze [fichier]                         # Geler des fichiers (Claude refuse de les modifier)
/unfreeze                                 # Dégeler les fichiers
/guard                                    # Mode protection anti-régression
/canary                                   # Stratégie de déploiement canary
/retro                                    # Rétrospective structurée
/office-hours                             # Consultation technique (sans coder)
/learn                                    # Mode apprentissage
/browse [URL]                             # Ouvrir URL dans navigateur Playwright
`),
  },
  {
    title: 'Analytics — PostHog',
    commands: parseCommands(`
/posthog:instrument-product-analytics     # Configurer le tracking d'events
/posthog:instrument-feature-flags         # Configurer les feature flags
/posthog:instrument-error-tracking        # Configurer le tracking d'erreurs
/posthog:insights                         # Créer des insights et dashboards
/posthog:experiments                      # A/B tests
/posthog:query                            # Requêtes HogQL personnalisées
`),
  },
  {
    title: 'Gestion Skills & CLAUDE.md',
    commands: parseCommands(`
/skill-creator                            # Créer un skill custom guidé par Claude
/claude-md-management:revise-claude-md    # Créer ou mettre à jour CLAUDE.md
/claude-md-management:claude-md-improver  # Améliorer un CLAUDE.md existant
/gstack                                   # Charger la méthodologie YC/Garry Tan
/context                                  # Vérifier le contexte chargé (skills, taille)
`),
  },
  {
    title: 'MCP & Connexions',
    commands: parseCommands(`
claude mcp add [serveur]                  # Ajouter un MCP server
claude mcp list                           # Lister les MCP configurés
claude mcp get [nom]                      # Détails d'un MCP
claude mcp remove [nom]                   # Supprimer un MCP
/mcp                                      # Vérifier le statut des MCP dans Claude Code
claude mcp serve                          # Lancer Claude Code comme MCP server
`),
  },
  {
    title: 'Stripe',
    commands: parseCommands(`
/stripe:stripe-best-practices             # Patterns Stripe production-ready
/stripe:explain-error                     # Debug des erreurs Stripe
/stripe:test-cards                        # Cartes de test par scénario
`),
  },
  {
    title: 'Supabase',
    commands: parseCommands(`
/supabase                                 # Skills Supabase (auth, DB, storage)
/postgres-best-practices                  # Best practices Postgres + RLS
`),
  },
  {
    title: 'Gestion des modèles',
    commands: [],
  },
  {
    title: 'Commandes natives Claude Code',
    commands: parseCommands(`
/help                                     # Aide et liste des commandes
/compact                                  # Compresser le contexte (libérer de la mémoire)
/clear                                    # Effacer la conversation
/cost                                     # Voir la consommation de tokens
/doctor                                   # Diagnostic de l'installation Claude Code
/status                                   # Statut de la session
/permissions                              # Gérer les permissions
/allowed-tools                            # Voir/configurer les outils autorisés
/context                                  # Voir ce qui est chargé dans le contexte
`),
  },
]

const STRATEGY = `Matin — Session planification :
  → /model opus + /superpowers:brainstorm
  → Définir les specs et le plan

Journée — Session implémentation :
  → /model sonnet (défaut)
  → /superpowers:execute-plan

Fin de journée — Session review :
  → /model sonnet ou haiku selon complexité
  → /code-review:code-review + /qa
  → /ship si tout est bon`

function CmdRow({ cmd, desc }: Cmd) {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(() => {
    navigator.clipboard.writeText(cmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }, [cmd])

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 group"
      style={{ borderBottom: '0.5px solid hsl(var(--border))' }}>
      <code className="text-[11px] shrink-0 min-w-0 max-w-[240px] truncate"
        style={{ fontFamily: 'Geist Mono, monospace', color: ACCENT }}>
        {cmd}
      </code>
      {desc && (
        <span className="flex-1 text-[11px] truncate" style={{ color: 'hsl(var(--muted-foreground))' }}>
          {desc}
        </span>
      )}
      <button onClick={copy}
        className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2 py-0.5 rounded-lg shrink-0"
        style={{ background: 'hsl(var(--secondary))', border: '0.5px solid hsl(var(--border))', color: copied ? '#22c55e' : 'hsl(var(--muted-foreground))' }}>
        {copied ? <Check size={10} strokeWidth={2} /> : <Copy size={10} strokeWidth={1.5} />}
        <span className="text-[9px] font-medium">{copied ? 'Copié' : 'Copier'}</span>
      </button>
    </div>
  )
}

export function CheatsheetPage({ navigate }: Props) {
  const [search, setSearch] = useState('')
  const q = search.toLowerCase()

  const filtered = SECTIONS.map(s => ({
    ...s,
    commands: s.commands.filter(c =>
      !q || c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    ),
  })).filter(s => !q || s.commands.length > 0 || s.title.toLowerCase().includes(q))

  const total = SECTIONS.reduce((acc, s) => acc + s.commands.length, 0)

  return (
    <div className="min-h-screen pb-20" style={{ background: 'hsl(var(--background))' }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4" style={{ borderBottom: '0.5px solid hsl(var(--border))' }}>
        <button onClick={() => window.history.back()}
          className="flex items-center gap-2 mb-5 transition-colors"
          style={{ color: 'hsl(var(--muted-foreground))' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'hsl(var(--foreground))')}
          onMouseLeave={e => (e.currentTarget.style.color = 'hsl(var(--muted-foreground))')}>

          <ArrowLeft size={14} strokeWidth={1.5} />
          <span className="text-[12px]">Équiper</span>
        </button>
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(77,150,255,0.12)', border: '0.5px solid rgba(77,150,255,0.25)' }}>
            <Terminal size={18} strokeWidth={1.5} style={{ color: ACCENT }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ color: ACCENT, background: 'rgba(77,150,255,0.12)', border: '0.5px solid rgba(77,150,255,0.25)' }}>
                Référence
              </span>
              <span className="text-[10px]" style={{ color: 'hsl(var(--muted-foreground))' }}>{total} commandes · {SECTIONS.length} sections</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: 'hsl(var(--foreground))' }}>Cheatsheet Commandes</h1>
            <p className="text-[13px] mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Toutes les commandes Claude Code Buildrs. Hover → Copier.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search size={13} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'hsl(var(--muted-foreground))' }} />
          <input
            type="text"
            placeholder="Rechercher une commande…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-[12px] rounded-xl outline-none"
            style={{
              background: 'hsl(var(--secondary) / 0.3)',
              border: '0.5px solid hsl(var(--border))',
              color: 'hsl(var(--foreground))',
            }}
          />
        </div>
      </div>

      <div className="px-6 pt-8 max-w-4xl space-y-8">
        {filtered.map(section => {
          const isModels = section.title === 'Gestion des modèles'
          if (isModels && q && section.commands.length === 0) return null

          return (
            <section key={section.title}>
              <h2 className="text-[12px] font-bold uppercase tracking-widest mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {section.title}
              </h2>

              {section.note && (
                <div className="mb-3 px-4 py-3 rounded-xl text-[11px]"
                  style={{ background: 'rgba(77,150,255,0.06)', border: '0.5px solid rgba(77,150,255,0.18)', color: 'hsl(var(--muted-foreground))' }}>
                  {section.note}
                </div>
              )}

              {section.commands.length > 0 && (
                <div className="rounded-xl overflow-hidden"
                  style={{ background: 'hsl(var(--secondary) / 0.3)', border: '0.5px solid hsl(var(--border))' }}>
                  {section.commands.map((c, i) => (
                    <CmdRow key={i} cmd={c.cmd} desc={c.desc} />
                  ))}
                </div>
              )}

              {/* Modèles table */}
              {isModels && (
                <>
                  <div className="rounded-xl overflow-hidden mb-4"
                    style={{ border: '0.5px solid hsl(var(--border))' }}>
                    <div className="grid grid-cols-4 px-4 py-2.5"
                      style={{ background: 'rgba(77,150,255,0.06)', borderBottom: '0.5px solid hsl(var(--border))' }}>
                      {['Modèle', 'Commande', 'Quand l\'utiliser', 'Coût'].map(h => (
                        <span key={h} className="text-[10px] font-semibold" style={{ color: 'hsl(var(--foreground))' }}>{h}</span>
                      ))}
                    </div>
                    {MODEL_TABLE.map((row, i) => (
                      <div key={row.model} className="grid grid-cols-4 px-4 py-3 items-center"
                        style={{ borderBottom: i < MODEL_TABLE.length - 1 ? '0.5px solid hsl(var(--border))' : undefined }}>
                        <span className="text-[11px] font-semibold" style={{ color: 'hsl(var(--foreground))' }}>{row.model}</span>
                        <code className="text-[11px]" style={{ fontFamily: 'Geist Mono, monospace', color: ACCENT }}>{row.cmd}</code>
                        <span className="text-[11px]" style={{ color: 'hsl(var(--muted-foreground))' }}>{row.when}</span>
                        <span className="text-[11px] font-mono font-bold" style={{ color: '#eab308' }}>{row.cost}</span>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Stratégie token economy Buildrs
                  </h3>
                  <div className="relative rounded-xl overflow-hidden"
                    style={{ background: 'hsl(var(--secondary) / 0.3)', border: '0.5px solid hsl(var(--border))' }}>
                    <pre className="px-5 py-4 text-[11px] leading-relaxed whitespace-pre"
                      style={{ fontFamily: 'Geist Mono, monospace', color: 'hsl(var(--muted-foreground))' }}>
                      {STRATEGY}
                    </pre>
                  </div>
                </>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
