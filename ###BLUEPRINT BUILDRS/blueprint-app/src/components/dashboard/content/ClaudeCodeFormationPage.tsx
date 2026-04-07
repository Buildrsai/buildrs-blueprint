import { useState, useCallback } from 'react'
import { ArrowLeft, Copy, Check, ExternalLink, Terminal, Zap } from 'lucide-react'

interface Props {
  navigate: (hash: string) => void
}

// ── Shared sub-components ──────────────────────────────────────────────────

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const doCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])
  return (
    <div className="relative rounded-xl overflow-hidden my-4" style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.09)' }}>
      {label && (
        <div className="px-4 py-1.5" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <span className="text-[10px] font-medium" style={{ fontFamily: 'Geist Mono, monospace', color: '#5b6078' }}>{label}</span>
        </div>
      )}
      <pre className="px-4 py-4 overflow-x-auto text-[12px] leading-relaxed" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', color: '#c9d1d9' }}>
        <code>{code}</code>
      </pre>
      <button
        onClick={doCopy}
        className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all"
        style={{ background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.12)', color: copied ? '#22c55e' : '#5b6078' }}
      >
        {copied ? <Check size={11} strokeWidth={2} /> : <Copy size={11} strokeWidth={1.5} />}
        <span className="text-[10px] font-medium">{copied ? 'Copié' : 'Copier'}</span>
      </button>
    </div>
  )
}

function Callout({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'warning' | 'success' }) {
  const s = type === 'warning'
    ? { bg: 'rgba(234,179,8,0.06)', border: 'rgba(234,179,8,0.2)', color: '#eab308', label: 'IMPORTANT' }
    : type === 'success'
    ? { bg: 'rgba(34,197,94,0.06)', border: 'rgba(34,197,94,0.2)', color: '#22c55e', label: 'BUILDRS' }
    : { bg: 'rgba(77,150,255,0.06)', border: 'rgba(77,150,255,0.2)', color: '#4d96ff', label: 'NOTE' }
  return (
    <div className="rounded-xl px-4 py-3.5 my-4" style={{ background: s.bg, border: `0.5px solid ${s.border}` }}>
      <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: s.color }}>{s.label}</p>
      <div className="text-[12.5px] leading-relaxed" style={{ color: '#9399b2' }}>{children}</div>
    </div>
  )
}

function SectionTitle({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mt-12 mb-6 pt-10" style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
      <span className="text-[10px] font-black tabular-nums px-2 py-0.5 rounded-md flex-shrink-0" style={{ background: 'rgba(77,150,255,0.1)', color: '#4d96ff', border: '0.5px solid rgba(77,150,255,0.25)', letterSpacing: '0.03em' }}>
        {num}
      </span>
      <h2 className="text-[17px] font-extrabold" style={{ color: '#f0f0f5', letterSpacing: '-0.025em' }}>{title}</h2>
    </div>
  )
}

function SubTitle({ title }: { title: string }) {
  return <h3 className="text-[13px] font-bold mb-3 mt-7" style={{ color: '#f0f0f5', letterSpacing: '-0.015em' }}>{title}</h3>
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#9399b2' }}>{children}</p>
}

// ── Stat card for Section 01 ───────────────────────────────────────────────

function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)' }}>
      <p className="text-[22px] font-extrabold mb-1" style={{ color, fontFamily: 'Geist Mono, monospace', letterSpacing: '-0.03em' }}>{value}</p>
      <p className="text-[11px]" style={{ color: '#5b6078' }}>{label}</p>
    </div>
  )
}

// ── Command table row ──────────────────────────────────────────────────────

function CmdRow({ cmd, desc }: { cmd: string; desc: string }) {
  const [copied, setCopied] = useState(false)
  const doCopy = useCallback(() => {
    navigator.clipboard.writeText(cmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [cmd])
  return (
    <div
      className="flex items-start gap-3 py-2.5"
      style={{ borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}
    >
      <button
        onClick={doCopy}
        className="flex-shrink-0 flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all"
        style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', fontFamily: 'Geist Mono, monospace', fontSize: '11px', color: copied ? '#22c55e' : '#c9d1d9', minWidth: 0 }}
      >
        {copied ? <Check size={9} strokeWidth={2} /> : <Copy size={9} strokeWidth={1.5} />}
        {cmd}
      </button>
      <p className="text-[12px] leading-relaxed pt-0.5" style={{ color: '#5b6078' }}>{desc}</p>
    </div>
  )
}

// ── Rule card (section 07) ─────────────────────────────────────────────────

function RuleCard({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
      <span className="text-[13px] font-black flex-shrink-0 mt-0.5" style={{ color: '#4d96ff', fontFamily: 'Geist Mono, monospace' }}>{num}</span>
      <div>
        <p className="text-[13px] font-bold mb-1" style={{ color: '#f0f0f5', letterSpacing: '-0.01em' }}>{title}</p>
        <p className="text-[12px] leading-relaxed" style={{ color: '#5b6078' }}>{desc}</p>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

export function ClaudeCodeFormationPage({ navigate }: Props) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Back */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: '#9399b2' }}
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          <span>Retour à Claude OS</span>
        </button>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-md" style={{ background: 'rgba(77,150,255,0.12)', color: '#4d96ff', border: '0.5px solid rgba(77,150,255,0.25)' }}>
              Formation
            </span>
          </div>
          <h1 className="text-[26px] font-extrabold mb-3" style={{ color: '#f0f0f5', letterSpacing: '-0.035em' }}>
            Claude Code
          </h1>
          <p className="text-[14px] leading-relaxed" style={{ color: '#9399b2' }}>
            L'outil qui transforme n'importe qui en product builder.
            Pas un chatbot — un agent qui agit directement dans ton code, ton terminal, tes fichiers.
          </p>
        </div>

        {/* ── Section 01 ─────────────────────────────────────────────────── */}
        <SectionTitle num="01" title="Pourquoi Claude Code est ton arme principale" />

        <Body>
          La plupart des gens utilisent Claude comme un chatbot : ils posent une question, ils reçoivent une réponse, ils copient-collent le code dans leur éditeur. C'est inefficace. Claude Code, c'est l'inverse : Claude vit directement dans ton terminal, il lit tes fichiers, il écrit du code, il exécute des commandes, il déploie.
        </Body>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <StatCard value="10x" label="plus rapide qu'un dev traditionnel" color="#4d96ff" />
          <StatCard value="72h" label="de l'idée au MVP live" color="#22c55e" />
          <StatCard value="0€" label="de stack dev requis" color="#8b5cf6" />
          <StatCard value="1" label="outil pour tout faire" color="#eab308" />
        </div>

        <SubTitle title="Ce que Claude Code fait concrètement" />
        <Body>
          Il lit l'intégralité de ton projet, comprend l'architecture, écrit du code dans les bons fichiers, exécute des tests, corrige les erreurs, déploie sur Vercel, gère ta base Supabase, configure Stripe. Tout ça en conversation naturelle. Tu décris ce que tu veux, il l'implémente.
        </Body>

        <Callout type="success">
          Chez Buildrs, on utilise Claude Code pour 100% du code produit. Pas d'IDE classique, pas de copier-coller. On décrit, il construit. C'est le setup qui nous permet de livrer des MVPs en 72h.
        </Callout>

        <SubTitle title="La différence fondamentale" />
        <div className="rounded-xl overflow-hidden my-4" style={{ border: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div className="grid grid-cols-2">
            <div className="p-4" style={{ background: 'rgba(239,68,68,0.04)', borderRight: '0.5px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: '#ef4444' }}>ChatGPT / Claude.ai</p>
              <ul className="space-y-2">
                {['Tu poses une question', 'Tu reçois une réponse', 'Tu copies-colles', 'Tu corriges les imports', 'Tu re-copie-colles', 'Tu perds 2h'].map(t => (
                  <li key={t} className="text-[12px]" style={{ color: '#5b6078' }}>— {t}</li>
                ))}
              </ul>
            </div>
            <div className="p-4" style={{ background: 'rgba(34,197,94,0.04)' }}>
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: '#22c55e' }}>Claude Code</p>
              <ul className="space-y-2">
                {['Tu décris ce que tu veux', 'Il lit ton projet complet', 'Il écrit directement dans les fichiers', 'Il exécute et vérifie', 'Il corrige si besoin', 'C\'est livré en 15 min'].map(t => (
                  <li key={t} className="text-[12px]" style={{ color: '#9399b2' }}>+ {t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Section 02 ─────────────────────────────────────────────────── */}
        <SectionTitle num="02" title="Installer Claude Code en 5 minutes" />

        <SubTitle title="Prérequis" />
        <Body>Un ordinateur (Mac ou Windows) et une connexion internet. C'est tout.</Body>

        <SubTitle title="Étape 1 — Installe VS Code" />
        <Body>
          VS Code est l'éditeur de code gratuit de Microsoft. C'est là que Claude Code vit.
          <br /><br />
          Télécharge-le sur{' '}
          <a href="https://code.visualstudio.com" target="_blank" rel="noopener noreferrer"
            style={{ color: '#4d96ff', textDecoration: 'none' }}>
            code.visualstudio.com
          </a>
          {' '}— installe-le, ouvre-le.
        </Body>
        <Callout>Si tu as déjà VS Code installé, passe directement à l'étape 2.</Callout>

        <SubTitle title="Étape 2 — Installe l'extension Claude Code" />
        <Body>Dans VS Code :</Body>
        <div className="my-3 space-y-2">
          {[
            { n: '1', text: 'Ouvre les extensions : Cmd+Shift+X (Mac) ou Ctrl+Shift+X (Windows)' },
            { n: '2', text: "Cherche 'Claude Code'" },
            { n: '3', text: "Clique 'Installer' sur l'extension Anthropic" },
            { n: '4', text: "C'est installé." },
          ].map(step => (
            <div key={step.n} className="flex items-start gap-3 px-4 py-2.5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
              <span className="text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: 'rgba(77,150,255,0.15)', color: '#4d96ff', border: '0.5px solid rgba(77,150,255,0.3)' }}>
                {step.n}
              </span>
              <span className="text-[12.5px] leading-relaxed" style={{ color: '#9399b2' }}>{step.text}</span>
            </div>
          ))}
        </div>

        <SubTitle title="Étape 3 — Lance Claude Code" />
        <Body>
          Cmd+Shift+P (Mac) ou Ctrl+Shift+P (Windows)
          <br />→ Tape <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', padding: '1px 5px', background: 'rgba(255,255,255,0.07)', borderRadius: 4, color: '#c9d1d9' }}>Claude Code: Open in New Tab</code>
          <br />→ Connecte-toi à ton compte Claude
          <br />→ C'est parti.
        </Body>

        <Callout type="success">
          3 clics. Pas de terminal, pas de npm, pas de ligne de commande.
          Tu ouvres VS Code, tu installes l'extension, tu parles à Claude.
          C'est comme ça qu'on fait chez Buildrs.
        </Callout>

        <Callout>
          VS Code a besoin de Node.js pour faire tourner Claude Code en arrière-plan.
          Si Claude Code ne se lance pas, installe Node.js sur{' '}
          <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer"
            style={{ color: '#4d96ff' }}>nodejs.org</a>
          {' '}(version LTS) puis relance VS Code.
          <br /><br />
          <span style={{ color: '#3d4466' }}>Utilisateurs avancés — tu peux aussi installer Claude Code en CLI via npm : <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px' }}>npm install -g @anthropic-ai/claude-code</code></span>
        </Callout>

        {/* ── Section 03 ─────────────────────────────────────────────────── */}
        <SectionTitle num="03" title="Ton premier projet avec Claude Code" />

        <Body>
          Tu as installé Claude Code. Maintenant tu lances ton premier projet. Voici le prompt exact qu'on utilise chez Buildrs pour initialiser un projet React + Supabase + Stripe en partant de zéro.
        </Body>

        <CodeBlock
          label="Prompt d'initialisation — copier-coller et adapter"
          code={`Je veux créer un micro-SaaS qui [description de ton produit].

Stack :
- React + TypeScript + Vite
- Tailwind CSS
- Supabase (auth + database)
- Stripe (paiements)
- Vercel (déploiement)

Commence par :
1. Créer la structure du projet
2. Configurer Tailwind
3. Mettre en place Supabase Auth (email + Google)
4. Créer la page d'accueil avec un CTA vers l'inscription

Ne code pas encore la feature principale — d'abord les fondations.`}
        />

        <Callout type="success">
          Ce prompt marche parce qu'il donne le contexte (stack), l'objectif (micro-SaaS), et une contrainte claire (pas tout d'un coup — les fondations d'abord). Claude Code déteste l'ambiguïté autant qu'un bon dev.
        </Callout>

        <SubTitle title="Le workflow itératif" />
        <Body>
          Une fois les fondations posées, tu construis feature par feature. Chaque message = une instruction précise. Ne mets pas 10 choses dans un seul message — Claude Code sera plus précis si tu décomposes.
        </Body>

        <CodeBlock label="Exemple workflow" code={`# Message 1 — Fondations
"Initialise le projet React + Tailwind + Supabase"

# Message 2 — Auth
"Ajoute l'authentification Supabase avec email + Google OAuth"

# Message 3 — Feature principale
"Crée le dashboard utilisateur avec [description feature]"

# Message 4 — Paiements
"Intègre Stripe Checkout avec un plan à 29€/mois"

# Message 5 — Deploy
"Configure Vercel et déploie le projet"`} />

        {/* ── Section 04 ─────────────────────────────────────────────────── */}
        <SectionTitle num="04" title="Les commandes essentielles" />

        <Body>
          Claude Code a des commandes (slash commands) qui déclenchent des comportements spécifiques. Voici les indispensables organisées par situation.
        </Body>

        <SubTitle title="Commandes de session" />
        <div className="rounded-xl overflow-hidden my-4" style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
          <div className="px-4 py-2" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: '#5b6078' }}>Session</p>
          </div>
          <div className="px-4 py-2">
            <CmdRow cmd="/clear" desc="Vide la mémoire de la session. À faire quand tu changes de sujet ou que Claude devient confus." />
            <CmdRow cmd="/compact" desc="Compresse l'historique pour libérer du contexte sans tout effacer. Utile sur les longues sessions." />
            <CmdRow cmd="/exit" desc="Ferme proprement la session Claude Code." />
            <CmdRow cmd="/cost" desc="Affiche le coût en tokens de la session courante." />
          </div>
        </div>

        <SubTitle title="Commandes de projet" />
        <div className="rounded-xl overflow-hidden my-4" style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
          <div className="px-4 py-2" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: '#5b6078' }}>Projet</p>
          </div>
          <div className="px-4 py-2">
            <CmdRow cmd="/init" desc="Analyse ton projet et génère un CLAUDE.md initial. Lance ça sur tout nouveau projet." />
            <CmdRow cmd="/add-dir [path]" desc="Ajoute un dossier supplémentaire au contexte. Utile pour les monorepos." />
            <CmdRow cmd="/status" desc="Résumé de l'état actuel du projet vu par Claude Code." />
          </div>
        </div>

        <SubTitle title="Commandes de workflow (via Superpowers)" />
        <div className="rounded-xl overflow-hidden my-4" style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
          <div className="px-4 py-2" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: '#5b6078' }}>Workflow — nécessite plugin Superpowers</p>
          </div>
          <div className="px-4 py-2">
            <CmdRow cmd="/superpowers:brainstorm" desc="Structure une idée avant de coder. Cadrage, contraintes, architecture." />
            <CmdRow cmd="/superpowers:write-plan" desc="Génère un plan d'implémentation step-by-step pour une feature complexe." />
            <CmdRow cmd="/superpowers:execute-plan" desc="Exécute un plan task par task avec vérification à chaque étape." />
            <CmdRow cmd="/superpowers:systematic-debugging" desc="Debug scientifique : Claude formule une hypothèse, teste, corrige." />
            <CmdRow cmd="/commit" desc="Commit propre avec message conventionnel. Ne commit jamais sans ça." />
          </div>
        </div>

        <Callout>
          Pour installer le plugin Superpowers :{' '}
          <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', padding: '1px 4px', background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>/install-plugin superpowers@superpowers-marketplace</code>
        </Callout>

        {/* ── Section 05 ─────────────────────────────────────────────────── */}
        <SectionTitle num="05" title="Comment Claude Code comprend ton projet — CLAUDE.md" />

        <Body>
          Par défaut, Claude Code lit tes fichiers mais n'a aucun contexte sur TES intentions, TON design system, TES conventions. Le CLAUDE.md règle ça : c'est un fichier texte à la racine de ton projet que Claude lit AVANT chaque conversation.
        </Body>

        <SubTitle title="Ce que tu mets dans un CLAUDE.md" />

        <CodeBlock
          label="Exemple — structure CLAUDE.md Buildrs"
          code={`# Mon Projet SaaS

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS (CSS variables HSL)
- Supabase (Auth + PostgreSQL + Edge Functions)
- Stripe (Checkout + Webhooks)
- Vercel (déploiement)

## Design System
- Fond : #09090b (jamais blanc)
- Font : Geist + Geist Mono
- Radius : rounded-xl (12px)
- Icônes : Lucide (strokeWidth={1.5} obligatoire)
- Zéro emoji dans le code

## Conventions
- Composants : PascalCase
- Fonctions utilitaires : camelCase
- Fichiers : kebab-case
- Variables d'environnement : SCREAMING_SNAKE_CASE

## Règles de sécurité
- ANTHROPIC_API_KEY jamais côté client
- RLS activé sur toutes les tables Supabase
- Validation côté serveur obligatoire

## Ce qu'il ne faut PAS faire
- Pas de useEffect inutile
- Pas de console.log en production
- Pas d'any TypeScript`}
        />

        <Callout type="success">
          Un bon CLAUDE.md économise 2h de corrections par projet. Claude arrête d'inventer des conventions et suit les tiennes. Lance <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', padding: '1px 4px', background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>/init</code> dans Claude Code pour en générer un automatiquement.
        </Callout>

        <SubTitle title="Hiérarchie des CLAUDE.md" />
        <Body>
          Tu peux avoir plusieurs CLAUDE.md dans ton projet. Claude les combine automatiquement. Le fichier racine définit les règles globales ; les fichiers dans des sous-dossiers précisent les règles spécifiques à ces parties du code.
        </Body>

        <CodeBlock label="Structure recommandée" code={`projet/
├── CLAUDE.md              # Règles globales (stack, conventions)
├── src/
│   ├── CLAUDE.md          # Règles front-end (composants, DA)
│   └── components/
└── supabase/
    └── CLAUDE.md          # Règles back-end (RLS, Edge Functions)`} />

        {/* ── Section 06 ─────────────────────────────────────────────────── */}
        <SectionTitle num="06" title="Connecter Claude Code à tes outils — MCP" />

        <Body>
          MCP (Model Context Protocol) est ce qui transforme Claude Code en agent qui agit dans tes outils externes. Au lieu de te donner du code Supabase à copier-coller, Claude se connecte directement à ta base et exécute les requêtes.
        </Body>

        <SubTitle title="Les connecteurs essentiels" />

        <div className="space-y-3 my-4">
          {[
            { name: 'Supabase', desc: 'Lire et modifier ta base de données, gérer les migrations, configurer le RLS — depuis Claude Code.', color: '#22c55e' },
            { name: 'Vercel', desc: 'Déployer, voir les logs, gérer les variables d\'environnement, inspecter les builds.', color: '#f0f0f5' },
            { name: 'Stripe', desc: 'Créer des produits, tester les webhooks, voir les paiements — sans aller sur le dashboard.', color: '#8b5cf6' },
            { name: 'GitHub', desc: 'Commits, PRs, issues — tout le workflow Git depuis la conversation.', color: '#9399b2' },
          ].map(item => (
            <div key={item.name} className="flex gap-3 p-3.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
              <div className="w-1.5 rounded-full flex-shrink-0 mt-1" style={{ background: item.color, minHeight: 16 }} />
              <div>
                <p className="text-[12px] font-bold mb-0.5" style={{ color: '#f0f0f5' }}>{item.name}</p>
                <p className="text-[12px]" style={{ color: '#5b6078' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <SubTitle title="Comment les installer" />
        <Body>
          Les connecteurs MCP s'installent depuis Claude.ai → Settings → Integrations, pas depuis Claude Code directement. Une fois connectés, ils sont disponibles dans toutes tes sessions.
        </Body>

        <CodeBlock label="Alternative — Installation via plugins officiels" code={`# Installe les plugins officiels (incluent les skills ET les MCP)
/install-plugin supabase@claude-plugins-official
/install-plugin vercel@claude-plugins-official
/install-plugin stripe@claude-plugins-official
/install-plugin github@claude-plugins-official`} />

        <Callout>
          Voir l'onglet <strong style={{ color: '#f0f0f5' }}>Équiper</strong> → Bibliothèque MCP pour la liste complète des connecteurs disponibles et leurs commandes d'installation.
        </Callout>

        {/* ── Section 07 ─────────────────────────────────────────────────── */}
        <SectionTitle num="07" title="Les bonnes pratiques Buildrs" />

        <Body>
          On a appris ces règles à force de faire des erreurs. Elles te font gagner des heures sur chaque projet.
        </Body>

        <div className="space-y-3 my-6">
          <RuleCard
            num="01"
            title="Un message = une instruction"
            desc="Ne mets pas 5 demandes dans un seul message. Claude sera moins précis et tu perdras le fil. Décompose en étapes séquentielles."
          />
          <RuleCard
            num="02"
            title="Toujours un CLAUDE.md dans chaque projet"
            desc="Sans ça, Claude invente des conventions à chaque session. Avec, il reste cohérent pendant des semaines de build. Lance /init au démarrage de chaque projet."
          />
          <RuleCard
            num="03"
            title="Plan Mode avant les features complexes"
            desc="Pour tout ce qui prend plus de 30 min, utilise /superpowers:write-plan d'abord. Claude réfléchit avant d'agir. Tu économises des heures de débug."
          />
          <RuleCard
            num="04"
            title="/clear entre les sujets différents"
            desc="Quand tu changes de partie du projet (front → back, feature A → feature B), fais un /clear. Claude Code devient confus si tu mélanges trop de contextes dans une session."
          />
          <RuleCard
            num="05"
            title="Lis ce que Claude code avant de valider"
            desc="Claude peut produire du code qui fonctionne mais qui introduit des patterns incorrects. Prends 30 secondes pour lire chaque diff significatif. Pose des questions si quelque chose t'échappe."
          />
        </div>

        <Callout type="warning">
          La règle la plus ignorée : ne jamais mettre de clé API dans le code client. Si Claude Code essaie de mettre ANTHROPIC_API_KEY ou SUPABASE_SERVICE_KEY dans un fichier React, c'est une erreur — dis-le-lui et fais passer la logique côté serveur (Edge Function).
        </Callout>

        {/* ── Section 08 ─────────────────────────────────────────────────── */}
        <SectionTitle num="08" title="Plans et tarifs" />

        <Body>
          Claude Code utilise ton compte Anthropic. Voici les options disponibles en 2026.
        </Body>

        <div className="rounded-xl overflow-hidden my-4" style={{ border: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div className="grid grid-cols-4 px-4 py-2" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
            {['Plan', 'Prix', 'Modèles', 'Pour qui'].map(h => (
              <p key={h} className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: '#5b6078' }}>{h}</p>
            ))}
          </div>
          {[
            { plan: 'Pro', prix: '20$/mois', modeles: 'Sonnet 4.6', pour: 'Débutants, side projects' },
            { plan: 'Max 5x', prix: '100$/mois', modeles: 'Sonnet + Opus 4.6', pour: 'Builders actifs' },
            { plan: 'Max 20x', prix: '200$/mois', modeles: 'Tous les modèles', pour: 'Buildrs professionnels' },
            { plan: 'API', prix: 'Usage', modeles: 'Tous', pour: 'Usage très intensif / équipes' },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-4 px-4 py-3" style={{ borderBottom: i < 3 ? '0.5px solid rgba(255,255,255,0.05)' : undefined }}>
              <p className="text-[12px] font-semibold" style={{ color: '#f0f0f5' }}>{row.plan}</p>
              <p className="text-[12px]" style={{ color: '#22c55e', fontFamily: 'Geist Mono, monospace' }}>{row.prix}</p>
              <p className="text-[12px]" style={{ color: '#9399b2' }}>{row.modeles}</p>
              <p className="text-[12px]" style={{ color: '#5b6078' }}>{row.pour}</p>
            </div>
          ))}
        </div>

        <Callout type="success">
          Chez Buildrs, on recommande le plan Max 5x pour tout builder sérieux. Le rapport qualité/quantité est optimal : Opus pour les plans complexes, Sonnet pour l'exécution quotidienne.
        </Callout>

        {/* ── Sources ────────────────────────────────────────────────────── */}
        <div className="mt-12 pt-8" style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: '#5b6078' }}>Sources</p>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Documentation officielle Claude Code', url: 'https://docs.anthropic.com/claude-code' },
              { label: 'claude.ai — Télécharger Claude Code', url: 'https://claude.ai/download' },
              { label: 'Anthropic — Plans et tarifs', url: 'https://anthropic.com/pricing' },
              { label: 'GitHub Superpowers Marketplace', url: 'https://github.com/obra/superpowers-marketplace' },
            ].map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[12px] transition-opacity hover:opacity-70"
                style={{ color: '#4d96ff' }}
              >
                <ExternalLink size={11} strokeWidth={1.5} />
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <div
          className="mt-10 rounded-2xl p-6 text-center"
          style={{ background: 'rgba(77,150,255,0.05)', border: '0.5px solid rgba(77,150,255,0.2)' }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Terminal size={16} strokeWidth={1.5} style={{ color: '#4d96ff' }} />
            <p className="text-[14px] font-extrabold" style={{ color: '#f0f0f5', letterSpacing: '-0.02em' }}>Et maintenant ?</p>
          </div>
          <p className="text-[12px] mb-4" style={{ color: '#5b6078' }}>
            Tu connais Claude Code. Maintenant configure ton environnement complet.
          </p>
          <button
            onClick={() => navigate('#/dashboard/claude-os/equiper/checklist-installation')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold transition-all hover:opacity-90"
            style={{ background: '#4d96ff', color: '#fff' }}
          >
            <Zap size={13} strokeWidth={2} />
            Voir la checklist d'installation
          </button>
        </div>

      </div>
    </div>
  )
}
