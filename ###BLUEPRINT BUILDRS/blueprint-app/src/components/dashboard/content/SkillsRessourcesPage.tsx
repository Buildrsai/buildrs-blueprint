import { useState, useCallback } from 'react'
import { ArrowLeft, Copy, Check, ExternalLink, ChevronDown } from 'lucide-react'

interface Props {
  navigate: (hash: string) => void
}

function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const doCopy = useCallback(() => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }, [text])
  return (
    <button onClick={doCopy}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all flex-shrink-0"
      style={{ background: copied ? 'rgba(34,197,94,0.1)' : 'hsl(var(--secondary))', border: `0.5px solid ${copied ? 'rgba(34,197,94,0.3)' : 'hsl(var(--border))'}`, color: copied ? '#22c55e' : 'hsl(var(--muted-foreground))' }}>
      {copied ? <Check size={9} strokeWidth={2.5} /> : <Copy size={9} strokeWidth={1.5} />}
      {copied ? 'OK' : (label ?? 'Copier')}
    </button>
  )
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const doCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])
  return (
    <div className="relative rounded-xl overflow-hidden my-3" style={{ background: '#0d1117', border: '1px solid #30363d' }}>
      {label && (
        <div className="px-4 py-1.5" style={{ borderBottom: '1px solid #30363d', background: '#161b22' }}>
          <span className="text-[10px] font-medium" style={{ fontFamily: 'Geist Mono, monospace', color: 'hsl(var(--muted-foreground))' }}>{label}</span>
        </div>
      )}
      <pre className="px-4 py-3.5 overflow-x-auto text-[12px] leading-relaxed" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', color: '#c9d1d9' }}>
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

interface SkillItem { cmd: string; why: string }
interface SkillCat { title: string; color: string; accent: string; install?: string; github?: string; githubLabel?: string; items: SkillItem[] }

const CATEGORIES: SkillCat[] = [
  {
    title: 'Design — 12 skills',
    color: 'rgba(139,92,246,0.08)', accent: '#8b5cf6',
    install: '/install-plugin frontend-design@claude-plugins-official',
    github: 'https://github.com/nextlevelbuilder/ui-ux-pro-max-skill',
    githubLabel: 'UI/UX Pro Max — GitHub',
    items: [
      { cmd: '/ui-ux-pro-max', why: 'QA design final. Vérifie hiérarchie visuelle, accessibilité, états (loading/empty/error), mobile-first. Avant chaque livraison.' },
      { cmd: '/design', why: 'Design system + composants. Usage général pour tout ce qui est design.' },
      { cmd: '/design-html', why: 'HTML/CSS/Tailwind de qualité premium. Maquettes rapides.' },
      { cmd: '/design-shotgun', why: '3-5 directions visuelles en parallèle. Quand tu explores une nouvelle section.' },
      { cmd: '/design-consultation', why: 'Claude pose des questions ciblées avant de proposer quoi que ce soit.' },
      { cmd: '/design-review', why: 'Critique structurée d\'un design existant + améliorations spécifiques.' },
      { cmd: '/design-system', why: 'Crée ou améliore un design system complet (tokens, typo, spacing, composants).' },
      { cmd: '/ui-styling', why: 'Polish CSS/Tailwind — spacing précis, typographie, couleurs, ombres. Le "dernière mile".' },
      { cmd: '/banner-design', why: 'Bannières marketing (OG images, headers, ads). Production-ready.' },
      { cmd: '/brand', why: 'Réflexion brand et identité visuelle. Positionnement, guidelines.' },
      { cmd: '/slides', why: 'Présentations structurées (pitch deck, onboarding, formation).' },
      { cmd: '/video-to-website', why: 'Transforme un script vidéo en landing page web.' },
    ],
  },
  {
    title: 'Plan & Architecture — 7 skills',
    color: 'rgba(77,150,255,0.08)', accent: '#4d96ff',
    items: [
      { cmd: '/autoplan', why: 'Claude crée automatiquement un plan avant de coder. Analyse, risques, approche structurée.' },
      { cmd: '/superpowers:brainstorm', why: 'Exploration structurée d\'une idée. Questions → 2-3 approches → design → validation → plan.' },
      { cmd: '/superpowers:write-plan', why: 'Plan d\'implémentation détaillé avec tâches concrètes. Output : docs/superpowers/plans/' },
      { cmd: '/superpowers:execute-plan', why: 'Exécute le plan task par task. Claude ne saute aucune étape.' },
      { cmd: '/plan-ceo-review', why: 'Review du plan angle CEO : ROI, priorités, direction.' },
      { cmd: '/plan-eng-review', why: 'Review du plan angle ingénierie : faisabilité, risques, dette technique.' },
      { cmd: '/plan-design-review', why: 'Review du plan angle UX/UI : aspects design couverts avant implémentation.' },
    ],
  },
  {
    title: 'Qualité & Review — 14 skills',
    color: 'rgba(234,179,8,0.06)', accent: '#eab308',
    items: [
      { cmd: '/qa', why: 'Tests et quality assurance complets. Génère des tests, vérifie la couverture, cas limites.' },
      { cmd: '/qa-only', why: 'Audit qualité sans toucher au code. Évalue et liste les problèmes.' },
      { cmd: '/code-review:code-review', why: 'Review approfondie : bugs, performance, anti-patterns, vulnérabilités sécurité.' },
      { cmd: '/web-quality-audit', why: 'Audit complet d\'une page web : performance, accessibilité, SEO, sécurité HTTP.' },
      { cmd: '/accessibility', why: 'Audit accessibilité WCAG. Contraste, clavier, lecteurs d\'écran, ARIA.' },
      { cmd: '/performance', why: 'Audit performance web. Bundle size, lazy loading, images, fonts, critical CSS.' },
      { cmd: '/core-web-vitals', why: 'Focus Core Web Vitals Google (LCP, CLS, INP). Directement lié au ranking Google.' },
      { cmd: '/best-practices', why: 'Checklist bonnes pratiques (React, TypeScript, sécurité, accessibilité).' },
      { cmd: '/simplify', why: 'Review + simplification du code. Identifie duplications, abstractions inutiles, complexité.' },
      { cmd: '/superpowers:systematic-debugging', why: 'Debug scientifique : hypothèse → test → conclusion. Pas de devinette.' },
      { cmd: '/superpowers:test-driven-development', why: 'TDD strict. Tests écrits AVANT le code.' },
      { cmd: '/health', why: 'Check de santé : dépendances obsolètes, vulnérabilités, config manquante.' },
      { cmd: '/investigate', why: 'Investigation structurée d\'un bug ou problème inconnu.' },
      { cmd: '/superpowers:verification-before-completion', why: 'Vérifie tout avant de livrer. Tests cas limites + régressions.' },
    ],
  },
  {
    title: 'Deployment — 8 skills',
    color: 'rgba(34,197,94,0.06)', accent: '#22c55e',
    items: [
      { cmd: '/ship', why: 'Pipeline complet : lint → build → résolution erreurs → commit → push. Tout en une commande.' },
      { cmd: '/land-and-deploy', why: 'Pipeline tests → merge → deploy. Livraison production complète.' },
      { cmd: '/setup-deploy', why: 'Configure le pipeline de déploiement depuis zéro (Vercel, CI/CD, env vars, domaine).' },
      { cmd: '/vercel:deploy', why: 'Deploy Vercel avec vérifications (build log, erreurs, URL preview).' },
      { cmd: '/vercel:bootstrap', why: 'Initialise un nouveau projet Vercel (domaine, env vars, équipe).' },
      { cmd: '/vercel:env', why: 'Gestion des variables d\'environnement Vercel.' },
      { cmd: '/vercel:status', why: 'Statut des deployments, derniers builds, erreurs production.' },
      { cmd: '/commit-push-pr', why: 'Commit + push + création de PR GitHub en une seule commande.' },
    ],
  },
  {
    title: 'Modes spéciaux — 10 skills',
    color: 'rgba(6,182,212,0.06)', accent: '#06b6d4',
    items: [
      { cmd: '/careful', why: 'Mode ultra-prudent. Confirmation avant chaque action destructive. Migrations DB, configs prod.' },
      { cmd: '/canary', why: 'Déploiement canary. Feature sur un petit % d\'utilisateurs avant rollout complet.' },
      { cmd: '/freeze [fichier]', why: 'Gèle des fichiers. Claude refuse de les modifier. Pour stabilisation avant release.' },
      { cmd: '/unfreeze', why: 'Dégèle les fichiers gelés.' },
      { cmd: '/checkpoint', why: 'Crée un commit de sauvegarde avant une opération risquée. TOUJOURS avant migration DB.' },
      { cmd: '/guard', why: 'Mode protection. Vérifie que les fonctionnalités existantes continuent de fonctionner.' },
      { cmd: '/retro', why: 'Rétrospective structurée d\'un sprint ou d\'une feature.' },
      { cmd: '/office-hours', why: 'Mode consultation. Répond à des questions techniques sans coder.' },
      { cmd: '/learn', why: 'Mode apprentissage. Explique le code en détail, adapte le niveau à ton profil.' },
      { cmd: '/browse [URL]', why: 'Ouvre un navigateur via Playwright pour explorer une URL et produire un rapport.' },
    ],
  },
  {
    title: 'Marketing & SEO — 30+ skills',
    color: 'rgba(245,158,11,0.06)', accent: '#f59e0b',
    install: `/add-marketplace https://github.com/coreyhaines31/marketingskills
/install-plugin marketing-skills@marketingskills`,
    github: 'https://github.com/coreyhaines31/marketingskills',
    githubLabel: 'marketingskills — GitHub',
    items: [
      { cmd: '/marketing-skills:copywriting', why: 'Écriture persuasive — headlines, body copy, CTAs.' },
      { cmd: '/marketing-skills:copy-editing', why: 'Améliore un texte existant (clarté, impact, flow).' },
      { cmd: '/marketing-skills:content-strategy', why: 'Plan de contenu (blog, social, email).' },
      { cmd: '/marketing-skills:social-content', why: 'Posts pour Twitter/X, LinkedIn, Instagram.' },
      { cmd: '/marketing-skills:cold-email', why: 'Séquences cold email B2B.' },
      { cmd: '/marketing-skills:email-sequence', why: 'Nurture, onboarding, réactivation.' },
      { cmd: '/marketing-skills:page-cro', why: 'Optimiser une landing page pour convertir.' },
      { cmd: '/marketing-skills:signup-flow-cro', why: 'Optimiser le flow d\'inscription.' },
      { cmd: '/marketing-skills:onboarding-cro', why: 'Améliorer l\'onboarding, réduire le churn early.' },
      { cmd: '/marketing-skills:paywall-upgrade-cro', why: 'Optimiser la page upgrade/pricing.' },
      { cmd: '/marketing-skills:paid-ads', why: 'Stratégie Meta Ads, Google Ads, copy.' },
      { cmd: '/marketing-skills:ad-creative', why: 'Créatifs ads (concepts + textes).' },
      { cmd: '/marketing-skills:launch-strategy', why: 'Plan de lancement produit ou feature.' },
      { cmd: '/marketing-skills:churn-prevention', why: 'Identifier et réduire le churn.' },
      { cmd: '/marketing-skills:pricing-strategy', why: 'Stratégie de pricing (freemium, tiers, annual).' },
      { cmd: '/marketing-skills:competitor-alternatives', why: 'Pages "Meilleure alternative à X".' },
      { cmd: '/marketing-skills:seo-audit', why: 'Audit SEO structuré avec priorités.' },
      { cmd: '/marketing-skills:ai-seo', why: 'SEO IA (contenus optimisés, clusters thématiques).' },
      { cmd: '/marketing-skills:programmatic-seo', why: 'Pages SEO générées programmatiquement.' },
      { cmd: '/marketing-skills:schema-markup', why: 'JSON-LD, rich snippets, structured data.' },
    ],
  },
  {
    title: 'Analytics & Monitoring — 15 skills PostHog',
    color: 'rgba(239,68,68,0.06)', accent: '#ef4444',
    install: '/install-plugin posthog@claude-plugins-official',
    items: [
      { cmd: '/posthog:instrument-product-analytics', why: 'Configurer le tracking d\'events.' },
      { cmd: '/posthog:instrument-feature-flags', why: 'Configurer les feature flags.' },
      { cmd: '/posthog:instrument-llm-analytics', why: 'Tracker les coûts et usage IA.' },
      { cmd: '/posthog:instrument-error-tracking', why: 'Configurer le tracking d\'erreurs.' },
      { cmd: '/posthog:insights', why: 'Créer des insights et dashboards.' },
      { cmd: '/posthog:experiments', why: 'A/B tests et expérimentations.' },
      { cmd: '/posthog:errors', why: 'Analyser les erreurs et leur impact.' },
      { cmd: '/posthog:llm-analytics', why: 'Analytics IA (coûts, usage, latence).' },
      { cmd: '/posthog:surveys', why: 'Surveys in-app.' },
      { cmd: '/posthog:query', why: 'Requêtes HogQL personnalisées.' },
      { cmd: '/posthog:dashboards', why: 'Créer et gérer des dashboards.' },
      { cmd: '/posthog:cleaning-up-stale-feature-flags', why: 'Nettoyer les feature flags obsolètes.' },
      { cmd: '/posthog:auditing-experiments-flags', why: 'Audit des expérimentations actives.' },
    ],
  },
]

function CategorySection({ cat }: { cat: SkillCat }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: cat.color, border: `0.5px solid ${cat.accent}33` }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-all hover:opacity-80">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.accent }} />
          <p className="text-[13px] font-bold" style={{ color: 'hsl(var(--foreground))', letterSpacing: '-0.01em' }}>{cat.title}</p>
        </div>
        <ChevronDown size={14} strokeWidth={1.5} style={{ color: 'hsl(var(--muted-foreground))', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }} />
      </button>
      {open && (
        <div style={{ borderTop: `0.5px solid ${cat.accent}22` }}>
          {(cat.install || cat.github) && (
            <div className="px-4 py-3 space-y-2" style={{ borderBottom: `0.5px solid ${cat.accent}22` }}>
              {cat.install && <CodeBlock code={cat.install} label="Installation" />}
              {cat.github && (
                <a href={cat.github} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[11px] transition-opacity hover:opacity-70" style={{ color: '#4d96ff' }}>
                  <ExternalLink size={10} strokeWidth={1.5} />{cat.githubLabel ?? cat.github}
                </a>
              )}
            </div>
          )}
          <div className="px-4 py-2">
            {cat.items.map(item => (
              <div key={item.cmd} className="flex items-start gap-3 py-2.5" style={{ borderBottom: `0.5px solid ${cat.accent}15` }}>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <code className="text-[11px]" style={{ fontFamily: 'Geist Mono, monospace', color: cat.accent }}>{item.cmd}</code>
                  <CopyBtn text={item.cmd} />
                </div>
                <p className="text-[12px] leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>{item.why}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function SkillsRessourcesPage({ navigate }: Props) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">

        <button onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70" style={{ color: 'hsl(var(--muted-foreground))' }}>
          <ArrowLeft size={14} strokeWidth={1.5} />
          <span>Retour à Skills</span>
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-md"
              style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '0.5px solid rgba(34,197,94,0.25)' }}>Ressources</span>
          </div>
          <h1 className="text-[26px] font-extrabold mb-3" style={{ color: 'hsl(var(--foreground))', letterSpacing: '-0.035em' }}>Bibliothèque Skills Buildrs</h1>
          <p className="text-[13px] leading-relaxed mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Tous les skills qu'on utilise en interne chez Buildrs. Pour chaque skill : ce que ça fait et pourquoi on l'utilise.
          </p>
          <p className="text-[12px]" style={{ color: 'hsl(var(--muted-foreground))' }}>Clique sur une catégorie pour voir les commandes. Clique sur une commande pour la copier.</p>
        </div>

        {/* Ordre d'installation recommandé */}
        <div className="rounded-xl p-5 mb-8" style={{ background: 'rgba(34,197,94,0.05)', border: '0.5px solid rgba(34,197,94,0.2)' }}>
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: '#22c55e' }}>Ordre d'installation recommandé Buildrs</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { prio: 'Priorité 1 — Indispensables', items: ['Superpowers', 'Frontend Design', 'Vercel plugin', 'Supabase plugin', 'Stripe plugin'] },
              { prio: 'Priorité 2 — Qualité', items: ['Code Review', 'Security Guidance', 'Commit Commands'] },
              { prio: 'Priorité 3 — Growth', items: ['Marketing Skills', 'GStack (méthodo YC)'] },
              { prio: 'Priorité 4 — Avancé', items: ['PostHog analytics', 'Playwright tests E2E', 'Figma design-to-code', 'Skill Creator'] },
            ].map(g => (
              <div key={g.prio}>
                <p className="text-[10px] font-bold mb-1.5" style={{ color: 'hsl(var(--foreground))' }}>{g.prio}</p>
                {g.items.map(i => (
                  <p key={i} className="text-[11px] flex items-center gap-1.5" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    <span style={{ color: '#22c55e' }}>+</span> {i}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          {CATEGORIES.map(cat => <CategorySection key={cat.title} cat={cat} />)}
        </div>

        {/* GStack */}
        <div className="mt-8 rounded-xl p-5" style={{ background: 'rgba(77,150,255,0.05)', border: '0.5px solid rgba(77,150,255,0.2)' }}>
          <p className="text-[13px] font-bold mb-1.5" style={{ color: 'hsl(var(--foreground))' }}>GStack (Garry Tan / YC) — 34 skills</p>
          <p className="text-[12px] mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>La méthodologie Y Combinator traduite en skills. Product, Engineering, Growth, Pitch, Décisions, Leadership.</p>
          <CodeBlock label="Installation" code={`git clone https://github.com/garrytan/gstack.git /tmp/gstack
cd /tmp/gstack && npm install && node scripts/build-skills.mjs
mkdir -p ~/.claude/skills/gstack
cp -r dist/skills/* ~/.claude/skills/gstack/`} />
          <a href="https://github.com/garrytan/gstack" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] transition-opacity hover:opacity-70" style={{ color: '#4d96ff' }}>
            <ExternalLink size={10} strokeWidth={1.5} />github.com/garrytan/gstack
          </a>
        </div>

        {/* Superpowers pipeline */}
        <div className="mt-4 rounded-xl p-5" style={{ background: 'rgba(139,92,246,0.05)', border: '0.5px solid rgba(139,92,246,0.2)' }}>
          <p className="text-[13px] font-bold mb-1.5" style={{ color: 'hsl(var(--foreground))' }}>Superpowers — Le pipeline complet</p>
          <p className="text-[12px] mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>Ce n'est pas juste un plugin — c'est un système qui fonctionne en pipeline séquentiel.</p>
          <CodeBlock label="Pipeline de développement Buildrs" code={`ÉTAPE 1 : /superpowers:brainstorm
  → Explore l'idée → 2-3 approches → Spec dans docs/superpowers/specs/

ÉTAPE 2 : /superpowers:write-plan
  → Plan d'implémentation détaillé → docs/superpowers/plans/

ÉTAPE 3 : /superpowers:execute-plan
  → Exécute task par task → Coche chaque étape

ÉTAPE 4 : /superpowers:verification-before-completion
  → Vérifie tout avant de livrer → Tests cas limites + régressions

ÉTAPE 5 : /superpowers:finishing-a-development-branch
  → Clean up → Commit → PR → Documentation`} />
          <CodeBlock label="Installation" code={`/install-plugin superpowers@claude-plugins-official`} />
        </div>

        {/* Autres repos */}
        <div className="mt-8">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>Autres repos utiles</p>
          <div className="space-y-2">
            {[
              { label: 'Claude Skills Official (Anthropic)', url: 'https://github.com/anthropics/skills' },
              { label: 'Awesome Claude Code — Compilation communautaire', url: 'https://github.com/hesreallyhim/awesome-claude-code' },
              { label: 'Awesome Claude Skills', url: 'https://github.com/travisvn/awesome-claude-skills' },
              { label: 'Supabase Agent Skills', url: 'https://github.com/supabase/agent-skills' },
              { label: 'Composio — Hub de connecteurs 150+ outils', url: 'https://github.com/ComposioHQ/composio' },
            ].map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-[12px] transition-opacity hover:opacity-70" style={{ color: '#4d96ff' }}>
                <ExternalLink size={11} strokeWidth={1.5} />{s.label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
