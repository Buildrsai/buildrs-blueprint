import { useState, useCallback } from 'react'
import { ArrowLeft, Copy, Check, ExternalLink, Users, ChevronRight } from 'lucide-react'

interface Props {
  navigate: (hash: string) => void
}

const ACCENT = '#4d96ff'

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const doCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])
  return (
    <div className="relative rounded-xl overflow-hidden my-4" style={{ background: '#0d1117', border: '1px solid #30363d' }}>
      {label && (
        <div className="px-4 py-1.5" style={{ borderBottom: '1px solid #30363d', background: '#161b22' }}>
          <span className="text-[10px] font-medium" style={{ fontFamily: 'Geist Mono, monospace', color: 'hsl(var(--muted-foreground))' }}>{label}</span>
        </div>
      )}
      <pre className="px-4 py-4 overflow-x-auto text-[12px] leading-relaxed" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', color: '#c9d1d9' }}>
        <code>{code}</code>
      </pre>
      <button onClick={doCopy} className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all"
        style={{ background: 'hsl(var(--secondary))', border: '0.5px solid hsl(var(--border))', color: copied ? '#22c55e' : 'hsl(var(--muted-foreground))' }}>
        {copied ? <Check size={11} strokeWidth={2} /> : <Copy size={11} strokeWidth={1.5} />}
        <span className="text-[10px] font-medium">{copied ? 'Copié' : 'Copier'}</span>
      </button>
    </div>
  )
}

function SectionNum({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-bold mr-3 shrink-0"
      style={{ background: 'rgba(77,150,255,0.15)', color: ACCENT, border: '0.5px solid rgba(77,150,255,0.25)' }}>
      {n}
    </span>
  )
}

function RuleCard({ num, title, desc, color = '#22c55e' }: { num: number; title: string; desc: string; color?: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'hsl(var(--secondary))', border: '0.5px solid hsl(var(--border))' }}>
      <div className="flex items-start gap-3">
        <span className="text-[11px] font-bold shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ color, background: `${color}18`, border: `0.5px solid ${color}40` }}>{num}</span>
        <div>
          <p className="text-[13px] font-semibold mb-1" style={{ color: 'hsl(var(--foreground))' }}>{title}</p>
          <p className="text-[12px] leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>{desc}</p>
        </div>
      </div>
    </div>
  )
}

function UseCaseCard({ num, title, badge, children }: { num: number; title: string; badge: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '0.5px solid hsl(var(--border))', background: 'hsl(var(--secondary))' }}>
      <button className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
        onClick={() => setOpen(o => !o)}
        style={{ background: open ? 'hsl(var(--secondary))' : undefined }}>
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: 'rgba(77,150,255,0.15)', color: ACCENT }}>{num}</span>
          <span className="text-[13px] font-semibold" style={{ color: 'hsl(var(--foreground))' }}>{title}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: ACCENT, background: 'rgba(77,150,255,0.1)', border: '0.5px solid rgba(77,150,255,0.2)' }}>{badge}</span>
        </div>
        <ChevronRight size={13} strokeWidth={1.5} style={{ color: 'hsl(var(--muted-foreground))', transform: open ? 'rotate(90deg)' : undefined, transition: 'transform 200ms' }} />
      </button>
      {open && (
        <div className="px-4 pb-4" style={{ borderTop: '0.5px solid hsl(var(--border))' }}>
          {children}
        </div>
      )}
    </div>
  )
}

function TableRow({ cells, header }: { cells: string[]; header?: boolean }) {
  const cols = cells.length
  return (
    <div className={`grid gap-0 ${cols === 3 ? 'grid-cols-3' : cols === 4 ? 'grid-cols-4' : 'grid-cols-2'}`}>
      {cells.map((c, i) => (
        <div key={i} className="px-4 py-2.5 text-[12px]"
          style={{
            borderBottom: '0.5px solid hsl(var(--border))',
            borderRight: i < cells.length - 1 ? '0.5px solid hsl(var(--border))' : undefined,
            color: header ? '#e2e8f0' : i === 0 ? '#e2e8f0' : '#94a3b8',
            fontWeight: header ? 600 : 400,
            background: header ? 'rgba(77,150,255,0.06)' : undefined,
          }}>
          {c}
        </div>
      ))}
    </div>
  )
}

export function TeamAgentsFormationPage({ navigate }: Props) {
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
          <span className="text-[12px]">Team Agents</span>
        </button>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(77,150,255,0.12)', border: '0.5px solid rgba(77,150,255,0.25)' }}>
            <Users size={18} strokeWidth={1.5} style={{ color: ACCENT }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ color: ACCENT, background: 'rgba(77,150,255,0.12)', border: '0.5px solid rgba(77,150,255,0.25)' }}>
                Formation
              </span>
              <span className="text-[10px]" style={{ color: 'hsl(var(--muted-foreground))' }}>6 sections · ~15 min</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: 'hsl(var(--foreground))' }}>Team Agents</h1>
            <p className="text-[13px] mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Plusieurs Claude qui travaillent en parallèle sur ton projet. Tu donnes la direction, ils exécutent simultanément.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-8 max-w-3xl space-y-12">

        {/* Section 1 */}
        <section>
          <h2 className="text-[15px] font-semibold mb-4 flex items-center" style={{ color: 'hsl(var(--foreground))' }}>
            <SectionNum n={1} />C'est quoi les Team Agents et pourquoi c'est un game changer
          </h2>
          <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Jusqu'ici, tu travailles avec un seul Claude Code à la fois. Tu lui donnes une tâche, il la fait, tu lui en donnes une autre. C'est séquentiel — et c'est lent.
          </p>
          <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Les Team Agents changent ça radicalement : tu lances <span style={{ color: 'hsl(var(--foreground))' }}>plusieurs sessions Claude Code en parallèle</span> qui travaillent ensemble sur ton projet. Un agent fait le frontend, un autre fait le backend, un troisième écrit les tests — en même temps. Ils communiquent entre eux, gèrent les dépendances, et te livrent le résultat final.
          </p>
          <div className="rounded-xl p-4 mb-6" style={{ background: 'rgba(77,150,255,0.08)', border: '0.5px solid rgba(77,150,255,0.2)' }}>
            <p className="text-[13px] font-semibold" style={{ color: 'hsl(var(--foreground))' }}>
              Ce qui te prenait 2 heures en séquentiel peut se faire en 30 minutes avec 3 agents en parallèle.
            </p>
          </div>

          <h3 className="text-[13px] font-semibold mb-3" style={{ color: 'hsl(var(--foreground))' }}>Comment ça fonctionne</h3>
          <div className="space-y-3 mb-6">
            {[
              { label: 'Le leader', desc: "C'est ta session principale. Il crée l'équipe, distribue les tâches, coordonne le travail et te livre la synthèse. C'est ton point de contact unique.", color: ACCENT },
              { label: 'Les teammates', desc: "Des sessions Claude Code indépendantes. Chacun a sa propre mémoire et son propre contexte. Ils exécutent les tâches assignées et communiquent entre eux directement.", color: '#22c55e' },
              { label: 'Le task board', desc: "Un tableau de tâches partagé avec gestion des dépendances. Si la tâche B dépend de la tâche A, le teammate B attend automatiquement que A soit terminée avant de commencer.", color: '#8b5cf6' },
            ].map(r => (
              <div key={r.label} className="flex items-start gap-3 rounded-xl px-4 py-3" style={{ background: 'hsl(var(--secondary))', border: '0.5px solid hsl(var(--border))' }}>
                <span className="text-[11px] font-bold shrink-0 mt-0.5" style={{ color: r.color }}>▸</span>
                <div>
                  <span className="text-[12px] font-semibold" style={{ color: 'hsl(var(--foreground))' }}>{r.label} — </span>
                  <span className="text-[12px]" style={{ color: 'hsl(var(--muted-foreground))' }}>{r.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-4" style={{ background: 'hsl(var(--secondary))', border: '0.5px solid hsl(var(--border))' }}>
            <p className="text-[12px] leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>
              <span style={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}>La vraie différence avec un seul Claude :</span> Ce n'est pas juste "3 Claude au lieu de 1". La puissance vient de la communication directe entre agents. Si le teammate API crée des types TypeScript, il prévient directement le teammate Frontend pour qu'il les utilise — sans passer par toi. C'est une coordination automatique, comme une vraie équipe de dev.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-[15px] font-semibold mb-4 flex items-center" style={{ color: 'hsl(var(--foreground))' }}>
            <SectionNum n={2} />Activer les Team Agents
          </h2>
          <p className="text-[13px] mb-5" style={{ color: 'hsl(var(--muted-foreground))' }}>C'est une fonctionnalité expérimentale. Voici comment l'activer.</p>

          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: 'rgba(77,150,255,0.15)', color: ACCENT }}>1</span>
                <h3 className="text-[13px] font-semibold" style={{ color: 'hsl(var(--foreground))' }}>Mettre à jour Claude Code</h3>
              </div>
              <CodeBlock label="bash" code={`npm update -g @anthropic-ai/claude-code`} />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: 'rgba(77,150,255,0.15)', color: ACCENT }}>2</span>
                <h3 className="text-[13px] font-semibold" style={{ color: 'hsl(var(--foreground))' }}>Activer la fonctionnalité</h3>
              </div>
              <p className="text-[12px] mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>Ouvre ou crée le fichier <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: 'hsl(var(--foreground))' }}>~/.claude/settings.json</code> et ajoute :</p>
              <CodeBlock label="~/.claude/settings.json" code={`{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}`} />
              <p className="text-[12px] mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>Ou via variable d'environnement :</p>
              <CodeBlock label="bash" code={`export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`} />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: 'rgba(77,150,255,0.15)', color: ACCENT }}>3</span>
                <h3 className="text-[13px] font-semibold" style={{ color: 'hsl(var(--foreground))' }}>Choisir l'affichage</h3>
              </div>
              <div className="space-y-3">
                <div className="rounded-xl p-4" style={{ background: 'rgba(34,197,94,0.06)', border: '0.5px solid rgba(34,197,94,0.15)' }}>
                  <p className="text-[12px] font-semibold mb-1" style={{ color: '#22c55e' }}>Mode in-process (par défaut)</p>
                  <p className="text-[12px]" style={{ color: 'hsl(var(--muted-foreground))' }}>Tous les teammates tournent dans ton terminal. Utilise <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, color: 'hsl(var(--foreground))' }}>Shift+Haut/Bas</code> pour naviguer entre eux. Aucune config supplémentaire.</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: 'hsl(var(--secondary))', border: '0.5px solid hsl(var(--border))' }}>
                  <p className="text-[12px] font-semibold mb-1" style={{ color: 'hsl(var(--foreground))' }}>Mode split-pane (tmux)</p>
                  <p className="text-[12px] mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>Chaque teammate a son propre panneau. Tu vois tout le monde travailler en temps réel :</p>
                  <CodeBlock label="bash" code={`export CLAUDE_CODE_SPAWN_BACKEND=tmux`} />
                  <div className="flex items-start gap-2 mt-2" style={{ color: '#eab308' }}>
                    <span className="text-[11px] shrink-0 mt-0.5">⚠</span>
                    <p className="text-[11px]" style={{ color: 'hsl(var(--muted-foreground))' }}>Le mode split-pane ne fonctionne pas dans le terminal intégré de VS Code ni sur Windows Terminal.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-[15px] font-semibold mb-4 flex items-center" style={{ color: 'hsl(var(--foreground))' }}>
            <SectionNum n={3} />Les 5 cas d'usage Buildrs
          </h2>
          <div className="space-y-3">
            <UseCaseCard num={1} title="Builder un SaaS complet en parallèle" badge="Cas principal">
              <p className="text-[12px] pt-3 mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>C'est LE cas d'usage principal pour un builder Buildrs. Au lieu de construire séquentiellement, tu lances une équipe :</p>
              <CodeBlock label="prompt" code={`Je veux développer un SaaS de gestion de factures pour freelances.
Crée une équipe avec :

1. Teammate "API" :
   - Crée les endpoints REST : /api/invoices, /api/clients, /api/auth
   - Configure Supabase (tables, RLS, auth)
   - Intègre Stripe pour les paiements
   - Types TypeScript partagés dans /src/shared/types

2. Teammate "Frontend" :
   - Crée les pages : Dashboard, Invoices, Clients, Settings
   - Composants React avec Tailwind + shadcn/ui
   - Utilise les types créés par le teammate API
   - Landing page avec pricing

3. Teammate "Tests" :
   - Tests unitaires pour les endpoints API
   - Tests de composants React
   - Test du flow de paiement Stripe

Le teammate Frontend dépend des types créés par le teammate API.
Le teammate Tests travaille en parallèle sur les tests API,
puis enchaîne sur les tests Frontend une fois les composants prêts.`} />
              <div className="rounded-xl px-4 py-3 mt-3" style={{ background: 'rgba(34,197,94,0.08)', border: '0.5px solid rgba(34,197,94,0.2)' }}>
                <p className="text-[12px]" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  <span style={{ color: '#22c55e', fontWeight: 600 }}>Résultat :</span> un SaaS complet avec frontend, backend, tests et paiement — construit en 30-45 minutes au lieu de 2-3 heures.
                </p>
              </div>
            </UseCaseCard>

            <UseCaseCard num={2} title="Ajouter une feature complète d'un coup" badge="Fréquent">
              <p className="text-[12px] pt-3 mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>Tu as déjà un SaaS qui tourne et tu veux ajouter un dashboard analytics :</p>
              <CodeBlock label="prompt" code={`Ajoute un dashboard analytics à mon SaaS.
Crée une équipe de 2 agents :

1. Teammate "Backend" :
   - Endpoints : GET /api/dashboard/stats, GET /api/dashboard/revenue,
     GET /api/dashboard/users
   - Requêtes Supabase optimisées avec agrégations
   - Cache des données (refresh toutes les 5 min)

2. Teammate "Frontend" :
   - Page DashboardPage avec les composants :
     StatCard, RevenueChart, UserGrowthChart, ChurnRate
   - Utilise recharts pour les graphiques
   - Responsive mobile
   - Loading states et error handling`} />
            </UseCaseCard>

            <UseCaseCard num={3} title="Refactoring massif sans casser le projet" badge="Avancé">
              <p className="text-[12px] pt-3 mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>Tu veux migrer de JavaScript à TypeScript ou restructurer ton architecture. Un seul agent, c'est long et risqué. Avec une équipe :</p>
              <CodeBlock label="prompt" code={`Refactore le projet de JavaScript vers TypeScript.
Crée une équipe de 3 agents :

1. Teammate "Core" : migre /src/lib et /src/utils
2. Teammate "Components" : migre /src/components
3. Teammate "API" : migre /src/app/api

Règle : chaque teammate ne touche QUE ses fichiers.
Personne ne modifie les fichiers d'un autre.
Quand un teammate a besoin d'un type d'un autre module,
il le déclare dans /src/shared/types.`} />
            </UseCaseCard>

            <UseCaseCard num={4} title="Debugging en mode hypothèses parallèles" badge="Puissant">
              <p className="text-[12px] pt-3 mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>Tu as un bug que tu n'arrives pas à résoudre. Au lieu de tester les hypothèses une par une :</p>
              <CodeBlock label="prompt" code={`Bug : les requêtes API timeout après 30 secondes en production
mais fonctionnent en local.

Crée une équipe de 3 agents :
- Teammate 1 : investigate côté base de données
  (requêtes lentes, pool de connexions, index manquants)
- Teammate 2 : vérifie les middlewares et la chaîne de requêtes
  (auth, rate limiting, CORS, body parsing)
- Teammate 3 : analyse la configuration Vercel/réseau
  (timeouts, cold starts, régions, DNS)

Chaque teammate partage ses découvertes avec les autres.
Le leader synthétise et identifie la cause racine.`} />
              <div className="rounded-xl px-4 py-3 mt-3" style={{ background: 'rgba(34,197,94,0.08)', border: '0.5px solid rgba(34,197,94,0.2)' }}>
                <p className="text-[12px]" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  <span style={{ color: '#22c55e', fontWeight: 600 }}>Résultat :</span> 3 pistes explorées simultanément. Le bug qui te bloquait depuis des heures est résolu en 10 minutes.
                </p>
              </div>
            </UseCaseCard>

            <UseCaseCard num={5} title="Review de code automatique pendant le développement" badge="Qualité">
              <p className="text-[12px] pt-3 mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>Tu veux un "quality check" en temps réel pendant que tu builds :</p>
              <CodeBlock label="prompt" code={`Équipe de 2 agents :
- Teammate "Dev" : implémente la fonctionnalité de paiement Stripe
  (checkout, webhooks, gestion des abonnements)
- Teammate "Review" : surveille les changements du teammate Dev,
  vérifie la sécurité (pas de clés API en dur, validation des inputs),
  les bonnes pratiques Stripe, et remonte les problèmes en temps réel`} />
              <p className="text-[12px] mt-3" style={{ color: 'hsl(var(--muted-foreground))' }}>Le reviewer détecte les problèmes <span style={{ color: 'hsl(var(--foreground))' }}>pendant</span> le développement, pas après. Plus besoin d'attendre une PR pour corriger une faille.</p>
            </UseCaseCard>
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-[15px] font-semibold mb-4 flex items-center" style={{ color: 'hsl(var(--foreground))' }}>
            <SectionNum n={4} />5 bonnes pratiques Buildrs
          </h2>
          <div className="space-y-3">
            <RuleCard num={1} title="Un fichier = un propriétaire"
              desc="C'est la règle la plus importante. Deux teammates qui éditent le même fichier = conflits garantis, écrasements, bugs. Découpe toujours le travail par modules/dossiers, pas par types de changements." color={ACCENT} />
            <div className="rounded-xl overflow-hidden" style={{ border: '0.5px solid hsl(var(--border))' }}>
              <div className="px-4 py-2.5" style={{ borderBottom: '0.5px solid hsl(var(--border))', background: 'rgba(34,197,94,0.06)' }}>
                <span className="text-[10px] font-semibold" style={{ color: '#22c55e' }}>BON — chaque teammate possède son domaine</span>
              </div>
              <div className="px-4 py-2.5" style={{ borderBottom: '0.5px solid hsl(var(--border))' }}>
                <code className="text-[11px]" style={{ fontFamily: 'Geist Mono, monospace', color: '#22c55e' }}>Teammate API      → /src/app/api/*</code>
              </div>
              <div className="px-4 py-2.5" style={{ borderBottom: '0.5px solid hsl(var(--border))' }}>
                <code className="text-[11px]" style={{ fontFamily: 'Geist Mono, monospace', color: '#22c55e' }}>Teammate Frontend → /src/components/*</code>
              </div>
              <div className="px-4 py-2.5 mb-3">
                <code className="text-[11px]" style={{ fontFamily: 'Geist Mono, monospace', color: '#22c55e' }}>Teammate Tests    → /src/__tests__/*</code>
              </div>
              <div className="px-4 py-2.5" style={{ borderTop: '0.5px solid hsl(var(--border))', background: 'rgba(239,68,68,0.06)' }}>
                <span className="text-[10px] font-semibold" style={{ color: '#ef4444' }}>MAUVAIS — plusieurs teammates sur les mêmes fichiers</span>
              </div>
              <div className="px-4 py-2.5" style={{ borderBottom: '0.5px solid hsl(var(--border))' }}>
                <code className="text-[11px]" style={{ fontFamily: 'Geist Mono, monospace', color: '#ef4444' }}>Teammate 1 → modifie /src/app/layout.tsx (routing)</code>
              </div>
              <div className="px-4 py-2.5">
                <code className="text-[11px]" style={{ fontFamily: 'Geist Mono, monospace', color: '#ef4444' }}>Teammate 2 → modifie /src/app/layout.tsx (styles)</code>
              </div>
            </div>

            <RuleCard num={2} title="Commence petit"
              desc="Ne lance pas 5 agents pour ta première fois. Commence avec 2 teammates sur une tâche simple (recherche parallèle ou frontend/backend). Monte progressivement quand tu maîtrises le système." color={ACCENT} />

            <RuleCard num={3} title="Un bon CLAUDE.md est encore plus crucial"
              desc="Chaque teammate charge le CLAUDE.md au démarrage mais n'hérite pas de l'historique de conversation du leader. Un CLAUDE.md clair avec l'architecture du projet, les conventions et les commandes réduit drastiquement le temps (et le coût) de chaque teammate." color={ACCENT} />
            <CodeBlock label="CLAUDE.md optimisé pour les agent teams" code={`## Architecture du projet
- /src/app → Pages Next.js (App Router)
- /src/components → Composants React + shadcn/ui
- /src/lib → Utilitaires, Supabase client, Stripe config
- /src/app/api → API Routes

## Stack
- Next.js 14 + TypeScript + Tailwind + shadcn/ui
- Supabase (auth, DB, storage)
- Stripe (paiements)
- Vercel (déploiement)

## Conventions
- Composants : PascalCase, un fichier par composant
- API Routes : kebab-case
- Tests : même nom que le fichier testé + .test.ts

## Commandes
- npm run dev → lance le projet
- npm run build → build production
- npm run test → lance les tests`} />

            <RuleCard num={4} title="Surveille les coûts"
              desc="Une équipe de 3 teammates consomme environ 3 à 5 fois plus de tokens qu'une session unique. Chaque teammate a sa propre fenêtre de contexte, et les tokens s'additionnent." color='#eab308' />
            <div className="rounded-xl p-4" style={{ background: 'rgba(234,179,8,0.06)', border: '0.5px solid rgba(234,179,8,0.15)' }}>
              <p className="text-[12px] font-semibold mb-2" style={{ color: '#eab308' }}>Pour optimiser :</p>
              <div className="space-y-1.5">
                {[
                  "Commence toujours par /plan — un plan coûte ~10 000 tokens. Une équipe qui part dans la mauvaise direction peut coûter 500 000+ tokens",
                  "2-3 teammates maximum pour la plupart des tâches",
                  "Un bon CLAUDE.md = moins d'exploration coûteuse par chaque teammate",
                  "Prévois 5-6 tâches par teammate pour les garder productifs",
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[11px] shrink-0 mt-0.5" style={{ color: '#eab308' }}>→</span>
                    <span className="text-[12px]" style={{ color: 'hsl(var(--muted-foreground))' }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <RuleCard num={5} title="Quand NE PAS utiliser les Team Agents"
              desc="Reste avec un seul agent quand la tâche est séquentielle par nature, quand le travail se concentre sur un seul fichier, ou quand les changements ont beaucoup de dépendances croisées." color='#ef4444' />
            <div className="rounded-xl px-4 py-3" style={{ background: 'hsl(var(--secondary))', border: '0.5px solid hsl(var(--border))' }}>
              <p className="text-[12px]" style={{ color: 'hsl(var(--muted-foreground))' }}>
                <span style={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}>Notre règle chez Buildrs :</span> si la tâche touche moins de 3 fichiers ou dure moins de 15 minutes, un seul agent suffit. Au-delà, les Team Agents font gagner du temps.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-[15px] font-semibold mb-4 flex items-center" style={{ color: 'hsl(var(--foreground))' }}>
            <SectionNum n={5} />Team Agents dans le système Buildrs
          </h2>

          <h3 className="text-[13px] font-semibold mb-3" style={{ color: 'hsl(var(--foreground))' }}>Quand les utiliser dans le framework TROUVER → BUILDER → MONÉTISER → SORTIR</h3>
          <div className="rounded-xl overflow-hidden mb-6" style={{ border: '0.5px solid hsl(var(--border))' }}>
            <TableRow cells={['Phase', 'Usage', 'Exemple']} header />
            <TableRow cells={['TROUVER', 'Rarement', "La recherche d'opportunités ne nécessite pas de parallélisme"]} />
            <TableRow cells={['BUILDER', 'Intensif', 'Frontend + Backend + Tests en parallèle. C\'est là que le gain est maximal.']} />
            <TableRow cells={['MONÉTISER', 'Parfois', 'Landing page + emails + Stripe setup en parallèle']} />
            <TableRow cells={['SORTIR', 'Parfois', 'Audit code + documentation + clean-up en parallèle avant revente']} />
          </div>

          <h3 className="text-[13px] font-semibold mb-3" style={{ color: 'hsl(var(--foreground))' }}>La combinaison gagnante</h3>
          <div className="space-y-2">
            {[
              { step: '1', label: 'Fondation', desc: 'Tu utilises un seul agent — setup projet, CLAUDE.md, architecture', color: 'hsl(var(--muted-foreground))' },
              { step: '2', label: 'Build intensif', desc: 'Tu lances les Team Agents — features, composants, API en parallèle', color: ACCENT },
              { step: '3', label: 'Polish final', desc: 'Tu reviens à un seul agent — debug, optimisation, déploiement', color: 'hsl(var(--muted-foreground))' },
            ].map(s => (
              <div key={s.step} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: 'hsl(var(--secondary))', border: '0.5px solid hsl(var(--border))' }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ color: s.step === '2' ? ACCENT : 'hsl(var(--muted-foreground))', background: s.step === '2' ? 'rgba(77,150,255,0.15)' : 'hsl(var(--secondary))', border: `0.5px solid ${s.step === '2' ? 'rgba(77,150,255,0.3)' : 'hsl(var(--border))'}` }}>{s.step}</span>
                <div>
                  <span className="text-[12px] font-semibold" style={{ color: 'hsl(var(--foreground))' }}>{s.label} — </span>
                  <span className="text-[12px]" style={{ color: 'hsl(var(--muted-foreground))' }}>{s.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[12px] mt-3" style={{ color: 'hsl(var(--muted-foreground))' }}>Comme une vraie équipe de dev : le CTO pose les bases seul, l'équipe build en parallèle, et le CTO fait la revue finale.</p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-[15px] font-semibold mb-4 flex items-center" style={{ color: 'hsl(var(--foreground))' }}>
            <SectionNum n={6} />Configuration avancée — Le SDK (pour plus tard)
          </h2>
          <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Pour les utilisateurs avancés qui veulent intégrer les Team Agents dans des workflows automatisés, le Claude Agent SDK offre un contrôle programmatique :
          </p>
          <CodeBlock label="Python — Claude Agent SDK" code={`from claude_agent_sdk import ClaudeSDKClient

client = ClaudeSDKClient()

session = client.create_session(
    prompt="Crée une équipe pour builder le module dashboard...",
    env={"CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"}
)`} />
          <p className="text-[12px]" style={{ color: 'hsl(var(--muted-foreground))' }}>
            C'est le niveau au-dessus : des pipelines de développement entièrement automatisés. On y reviendra quand tu auras maîtrisé les bases.
          </p>

          <h3 className="text-[13px] font-semibold mt-6 mb-3" style={{ color: 'hsl(var(--foreground))' }}>Sources & documentation officielle</h3>
          <div className="space-y-2">
            {[
              { label: 'Agent Teams — Documentation Claude Code', url: 'https://code.claude.com/docs/en/agent-teams' },
              { label: 'Sub-agents — Créer des sous-agents', url: 'https://code.claude.com/docs/en/sub-agents' },
              { label: 'Agent SDK — Contrôle programmatique', url: 'https://platform.claude.com/docs/en/agent-sdk/overview' },
              { label: 'Building a C compiler with parallel Claudes — Blog Anthropic', url: 'https://www.anthropic.com/engineering/building-c-compiler' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <ExternalLink size={11} strokeWidth={1.5} style={{ color: 'hsl(var(--muted-foreground))' }} />
                <a href={s.url} target="_blank" rel="noopener noreferrer"
                  className="text-[12px] transition-colors" style={{ color: 'hsl(var(--muted-foreground))' }}
                  onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
                  onMouseLeave={e => (e.currentTarget.style.color = 'hsl(var(--muted-foreground))')}>
                  {s.label}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl p-6" style={{ background: 'rgba(77,150,255,0.06)', border: '0.5px solid rgba(77,150,255,0.2)' }}>
          <h3 className="text-[14px] font-semibold mb-2" style={{ color: 'hsl(var(--foreground))' }}>Tu es prêt à lancer ton équipe</h3>
          <p className="text-[12px] mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Utilise le Générateur Team Agents — décris ce que tu veux construire en 4 étapes et obtiens le prompt parfait pour lancer ton équipe.
          </p>
          <button onClick={() => navigate('#/dashboard/claude-os/apprendre/team-agents/generateur')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-all"
            style={{ background: 'rgba(139,92,246,0.15)', border: '0.5px solid rgba(139,92,246,0.3)', color: '#8b5cf6' }}>
            <Users size={13} strokeWidth={1.5} />
            Générateur Team Agents
          </button>
        </div>
      </div>
    </div>
  )
}
