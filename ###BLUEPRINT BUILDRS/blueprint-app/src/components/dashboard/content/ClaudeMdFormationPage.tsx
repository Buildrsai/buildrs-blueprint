import { useState, useCallback } from 'react'
import { ArrowLeft, Copy, Check, ExternalLink, Sparkles, FileCode, X } from 'lucide-react'

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
    <div className="relative rounded-xl overflow-hidden my-4" style={{ background: '#0d1117', border: '1px solid #30363d' }}>
      {label && (
        <div className="px-4 py-1.5" style={{ borderBottom: '1px solid #30363d', background: '#161b22' }}>
          <span className="text-[10px] font-medium" style={{ fontFamily: 'Geist Mono, monospace', color: 'hsl(var(--muted-foreground))' }}>{label}</span>
        </div>
      )}
      <pre className="px-4 py-4 overflow-x-auto text-[12px] leading-relaxed" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', color: '#c9d1d9' }}>
        <code>{code}</code>
      </pre>
      <button
        onClick={doCopy}
        className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all"
        style={{ background: 'hsl(var(--secondary))', border: '0.5px solid hsl(var(--border))', color: copied ? '#22c55e' : 'hsl(var(--muted-foreground))' }}
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
      <div className="text-[12.5px] leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>{children}</div>
    </div>
  )
}

function SectionTitle({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mt-12 mb-6 pt-10" style={{ borderTop: '0.5px solid hsl(var(--border))' }}>
      <span className="text-[10px] font-black tabular-nums px-2 py-0.5 rounded-md flex-shrink-0" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: '0.5px solid rgba(139,92,246,0.25)', letterSpacing: '0.03em' }}>
        {num}
      </span>
      <h2 className="text-[17px] font-extrabold" style={{ color: 'hsl(var(--foreground))', letterSpacing: '-0.025em' }}>{title}</h2>
    </div>
  )
}

function SubTitle({ title }: { title: string }) {
  return <h3 className="text-[13px] font-bold mb-3 mt-7" style={{ color: 'hsl(var(--foreground))', letterSpacing: '-0.015em' }}>{title}</h3>
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>{children}</p>
}

// ── Level card (section 02) ────────────────────────────────────────────────

function LevelCard({ num, title, path, desc, tip }: { num: string; title: string; path: string; desc: string; tip?: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-xl" style={{ background: 'hsl(var(--secondary))', border: '0.5px solid hsl(var(--border))' }}>
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <span className="text-[11px] font-black" style={{ color: '#8b5cf6', fontFamily: 'Geist Mono, monospace' }}>{num}</span>
        <div className="w-px flex-1" style={{ background: 'hsl(var(--secondary))' }} />
      </div>
      <div className="flex-1 pb-1">
        <p className="text-[13px] font-bold mb-0.5" style={{ color: 'hsl(var(--foreground))', letterSpacing: '-0.01em' }}>{title}</p>
        <code className="text-[11px]" style={{ fontFamily: 'Geist Mono, monospace', color: '#8b5cf6' }}>{path}</code>
        <p className="text-[12px] mt-1.5 leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>{desc}</p>
        {tip && <p className="text-[11px] mt-2 italic" style={{ color: '#4d96ff' }}>{tip}</p>}
      </div>
    </div>
  )
}

// ── Comparison table row ───────────────────────────────────────────────────

function CompareRow({ bad, good }: { bad: string; good: string }) {
  return (
    <div className="grid grid-cols-2 gap-2 py-2" style={{ borderBottom: '0.5px solid hsl(var(--border))' }}>
      <div className="flex items-start gap-1.5">
        <X size={10} strokeWidth={2} style={{ color: '#ef4444', flexShrink: 0, marginTop: 2 }} />
        <p className="text-[11px]" style={{ color: 'hsl(var(--muted-foreground))' }}>{bad}</p>
      </div>
      <div className="flex items-start gap-1.5">
        <Check size={10} strokeWidth={2} style={{ color: '#22c55e', flexShrink: 0, marginTop: 2 }} />
        <p className="text-[11px]" style={{ color: 'hsl(var(--muted-foreground))' }}>{good}</p>
      </div>
    </div>
  )
}

// ── Error card (section 08) ────────────────────────────────────────────────

function ErrorCard({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.03)', border: '0.5px solid rgba(239,68,68,0.12)' }}>
      <span className="text-[13px] font-black flex-shrink-0 mt-0.5" style={{ color: '#ef4444', fontFamily: 'Geist Mono, monospace' }}>{num}</span>
      <div>
        <p className="text-[13px] font-bold mb-1" style={{ color: 'hsl(var(--foreground))', letterSpacing: '-0.01em' }}>{title}</p>
        <p className="text-[12px] leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>{desc}</p>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

export function ClaudeMdFormationPage({ navigate }: Props) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Back */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: 'hsl(var(--muted-foreground))' }}
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          <span>Retour à CLAUDE.md</span>
        </button>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-md" style={{ background: 'rgba(77,150,255,0.12)', color: '#4d96ff', border: '0.5px solid rgba(77,150,255,0.25)' }}>
              Formation
            </span>
          </div>
          <h1 className="text-[26px] font-extrabold mb-3" style={{ color: 'hsl(var(--foreground))', letterSpacing: '-0.035em' }}>
            CLAUDE.md
          </h1>
          <p className="text-[14px] leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Le fichier qui transforme Claude Code d'un assistant générique en un coéquipier qui connaît ton projet par cœur.
            15 minutes de configuration = des semaines de productivité gagnées.
          </p>
        </div>

        {/* ── Section 01 ─────────────────────────────────────────────────── */}
        <SectionTitle num="01" title="C'est quoi le CLAUDE.md et pourquoi c'est essentiel" />

        <Body>
          Sans CLAUDE.md, voici ce qui se passe à <strong style={{ color: 'hsl(var(--foreground))' }}>chaque nouvelle session</strong> Claude Code :
        </Body>

        <div className="rounded-xl p-4 my-4 space-y-2" style={{ background: 'rgba(239,68,68,0.04)', border: '0.5px solid rgba(239,68,68,0.15)' }}>
          {[
            'Tu re-expliques que ton projet utilise Next.js avec Supabase',
            'Tu rappelles que tu utilises Tailwind + shadcn/ui',
            'Tu redis que la base de données est sur Supabase',
            'Tu re-précises que les paiements passent par Stripe',
          ].map(t => (
            <div key={t} className="flex items-center gap-2">
              <X size={10} strokeWidth={2} style={{ color: '#ef4444', flexShrink: 0 }} />
              <p className="text-[12px]" style={{ color: 'hsl(var(--muted-foreground))' }}>{t}</p>
            </div>
          ))}
        </div>

        <Body>
          Avec CLAUDE.md, tout ça est chargé <strong style={{ color: 'hsl(var(--foreground))' }}>automatiquement</strong>. Claude Code lit ce fichier au démarrage de chaque session. Il connaît déjà ton projet, ta stack, tes conventions, tes commandes. Il respecte tes règles dès la première ligne de code générée.
        </Body>

        <SubTitle title="C'est quoi concrètement ?" />
        <Body>
          Un fichier texte en Markdown, nommé <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', padding: '1px 4px', background: 'hsl(var(--border))', borderRadius: 4 }}>CLAUDE.md</code>, placé à la racine de ton projet. Claude Code le lit automatiquement à chaque lancement. C'est ta <strong style={{ color: 'hsl(var(--foreground))' }}>mémoire persistante</strong> — le briefing permanent que tu donnes à ton assistant.
        </Body>

        <Callout type="success">
          Chez Buildrs, le CLAUDE.md est la <strong style={{ color: 'hsl(var(--foreground))' }}>première chose qu'on crée</strong> dans chaque projet. Avant d'écrire une ligne de code. Avant de demander quoi que ce soit à Claude Code. Un bon CLAUDE.md = du code production-grade dès le premier prompt.
        </Callout>

        {/* ── Section 02 ─────────────────────────────────────────────────── */}
        <SectionTitle num="02" title="La hiérarchie des fichiers CLAUDE.md" />

        <Body>
          Claude Code ne se contente pas d'un seul fichier. Il utilise un système à plusieurs niveaux. Les instructions les plus <strong style={{ color: 'hsl(var(--foreground))' }}>spécifiques</strong> l'emportent toujours sur les plus génériques.
        </Body>

        <div className="space-y-3 my-6">
          <LevelCard
            num="1"
            title="User Memory — Tes préférences globales"
            path="~/.claude/CLAUDE.md"
            desc="Tes préférences personnelles qui s'appliquent à tous tes projets : langue de communication, style de code, outils favoris."
            tip="Conseil Buildrs : garde ce fichier très court (max 50 lignes). Il est chargé dans chaque session de chaque projet."
          />
          <LevelCard
            num="2"
            title="Project Memory — Le cœur de ta configuration"
            path="./CLAUDE.md"
            desc="Le plus important. Il contient tout ce que Claude Code doit savoir sur ton projet spécifique. Partagé avec toute l'équipe via Git. C'est ce que le Générateur CLAUDE.md Buildrs crée pour toi."
          />
          <LevelCard
            num="3"
            title="Project Rules — Règles modulaires"
            path=".claude/rules/*.md"
            desc="Pour les projets complexes, tu peux découper tes instructions en fichiers thématiques (code-style.md, testing.md, security.md). Supporte le ciblage par chemin avec frontmatter YAML."
          />
          <LevelCard
            num="4"
            title="Local Memory — Tes préférences perso sur le projet"
            path="./CLAUDE.local.md"
            desc="Automatiquement ajouté au .gitignore. Parfait pour tes URLs de sandbox, tes données de test, tes raccourcis personnels. Non partagé avec l'équipe."
          />
        </div>

        <CodeBlock
          label="Exemple — Ciblage par chemin (.claude/rules/api-design.md)"
          code={`---
paths:
  - "src/app/api/**/*.ts"
---

# Règles API
- Toujours valider les inputs avec Zod avant de toucher la DB
- Retourner des erreurs structurées : { error: string, code: string }
- Auth vérifiée en premier dans chaque route handler`}
        />

        {/* ── Section 03 ─────────────────────────────────────────────────── */}
        <SectionTitle num="03" title="Que mettre dans ton CLAUDE.md" />

        <Body>
          5 sections essentielles. Chacune a un rôle précis dans ce que Claude Code va faire (ou éviter).
        </Body>

        <SubTitle title="Section 1 — Stack technique" />
        <Body>C'est la première chose à déclarer. Claude Code doit savoir exactement avec quoi il travaille.</Body>
        <CodeBlock
          label="Exemple"
          code={`# Stack technique
- Framework : Next.js 14 (App Router) + TypeScript strict
- Styling : Tailwind CSS + shadcn/ui
- Base de données : Supabase (PostgreSQL, Auth, Storage)
- Paiements : Stripe
- Déploiement : Vercel
- Package manager : pnpm`}
        />

        <SubTitle title="Section 2 — Conventions de code" />
        <Body>Sois spécifique. Ne dis pas "écris du code propre". Dis exactement ce que tu attends.</Body>
        <CodeBlock
          label="Exemple"
          code={`# Conventions de code
- Composants React : PascalCase (ex: UserProfile.tsx)
- Fichiers utilitaires : camelCase (ex: formatDate.ts)
- Server Components par défaut
- 'use client' uniquement quand nécessaire (hooks, interactivité)
- Exports nommés (pas de default export)
- Types dans des fichiers séparés : src/types/[domaine].ts
- Zod pour toute validation de données
- Pas de any en TypeScript`}
        />

        <SubTitle title="Section 3 — Commandes de build" />
        <Body>Sans ça, Claude Code va deviner tes commandes. Et il devinera souvent mal.</Body>
        <CodeBlock
          label="Exemple"
          code={`# Commandes
- Dev : pnpm dev (port 3000)
- Build : pnpm build
- Tests : pnpm test (Vitest)
- Lint : pnpm lint
- DB migrate : pnpm supabase db push
- Stripe webhook local : pnpm stripe:webhook`}
        />

        <SubTitle title="Section 4 — Structure du projet" />
        <Body>Donne à Claude une carte mentale de ton architecture.</Body>
        <CodeBlock
          label="Exemple"
          code={`# Structure du projet
- src/app/ → Routes Next.js (App Router)
- src/app/(auth)/ → Pages authentifiées
- src/app/(public)/ → Pages publiques
- src/components/ → Composants React réutilisables
- src/components/ui/ → Composants shadcn/ui (NE PAS MODIFIER)
- src/lib/ → Utilitaires et helpers
- src/lib/supabase/ → Client et requêtes Supabase
- src/lib/stripe/ → Helpers Stripe
- src/types/ → Types TypeScript
- supabase/migrations/ → Migrations SQL`}
        />

        <SubTitle title="Section 5 — Règles et garde-fous" />
        <Body>Les instructions "ne pas faire" sont aussi importantes que les "faire".</Body>
        <CodeBlock
          label="Exemple"
          code={`# Règles importantes
- NE JAMAIS modifier les fichiers dans src/components/ui/ (générés par shadcn)
- NE JAMAIS commit les fichiers .env
- Toujours utiliser les variables d'environnement via process.env
- Les requêtes Supabase passent TOUJOURS par src/lib/supabase/
- RLS activé sur TOUTES les tables Supabase
- Jamais de clé API côté client
- Toujours vérifier l'auth avant les mutations
- Pas de console.log en production`}
        />

        {/* ── Section 04 ─────────────────────────────────────────────────── */}
        <SectionTitle num="04" title="Les imports @path — La modularité de CLAUDE.md" />

        <Body>
          Tu peux référencer d'autres fichiers directement depuis ton CLAUDE.md avec la syntaxe <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', padding: '1px 4px', background: 'hsl(var(--border))', borderRadius: 4 }}>@chemin/vers/fichier</code>. C'est ce qui évite de dupliquer la documentation.
        </Body>

        <CodeBlock
          label="Exemple"
          code={`# Documentation du projet
Voir @README.md pour la vue d'ensemble.
Voir @docs/architecture.md pour l'architecture détaillée.
Voir @package.json pour les scripts disponibles.`}
        />

        <div className="grid grid-cols-2 gap-3 my-4">
          {[
            { title: 'Réutilisation', desc: 'Ton README.md sert déjà de doc ? Importe-le plutôt que de dupliquer.', color: '#22c55e' },
            { title: 'Modularité', desc: 'Découpe tes instructions en fichiers spécialisés par domaine.', color: '#4d96ff' },
            { title: 'Fraîcheur', desc: 'Quand ta doc évolue, CLAUDE.md suit automatiquement.', color: '#8b5cf6' },
            { title: 'Source unique', desc: 'Une seule vérité pour chaque info — plus de contradictions.', color: '#eab308' },
          ].map(item => (
            <div key={item.title} className="p-3.5 rounded-xl" style={{ background: 'hsl(var(--secondary))', border: '0.5px solid hsl(var(--border))' }}>
              <p className="text-[12px] font-bold mb-1" style={{ color: item.color }}>{item.title}</p>
              <p className="text-[11px] leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <Callout>
          Les imports supportent jusqu'à <strong style={{ color: 'hsl(var(--foreground))' }}>5 niveaux de profondeur</strong> récursifs. Les imports dans les blocs de code (backticks) sont ignorés — pas de risques d'effets de bord.
        </Callout>

        {/* ── Section 05 ─────────────────────────────────────────────────── */}
        <SectionTitle num="05" title="Auto Memory — Quand Claude Code apprend tout seul" />

        <Body>
          En plus du CLAUDE.md que tu rédiges, Claude Code possède une <strong style={{ color: 'hsl(var(--foreground))' }}>auto-mémoire</strong>. Au fil de tes sessions, il note automatiquement ce qu'il apprend sur ton projet.
        </Body>

        <SubTitle title="Structure de la mémoire automatique" />
        <CodeBlock
          label="Emplacement"
          code={`~/.claude/projects/mon-projet/memory/
├── MEMORY.md           # Index principal (200 premières lignes chargées)
├── debugging.md        # Notes sur les patterns de debug
├── api-conventions.md  # Conventions API découvertes
└── ...                 # Autres fichiers thématiques`}
        />

        <SubTitle title="Ce que Claude Code retient automatiquement" />
        <div className="space-y-2 my-4">
          {[
            { label: 'Patterns du projet', desc: 'commandes de build, conventions de test' },
            { label: 'Solutions de debug', desc: 'corrections de bugs, causes d\'erreurs fréquentes' },
            { label: 'Architecture', desc: 'fichiers clés, relations entre modules' },
            { label: 'Tes préférences', desc: 'style de communication, habitudes de workflow' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3 py-2" style={{ borderBottom: '0.5px solid hsl(var(--border))' }}>
              <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#8b5cf6' }} />
              <p className="text-[12px]"><span className="font-semibold" style={{ color: 'hsl(var(--foreground))' }}>{item.label}</span> <span style={{ color: 'hsl(var(--muted-foreground))' }}>— {item.desc}</span></p>
            </div>
          ))}
        </div>

        <SubTitle title="Forcer un apprentissage" />
        <CodeBlock
          label="Exemples de commandes à dire à Claude"
          code={`"Retiens qu'on utilise pnpm, pas npm"
"Sauvegarde en mémoire que le endpoint /api/v1 est déprécié"
"Note que les tests API nécessitent un Redis local"`}
        />

        <Callout>
          Pour consulter ou modifier la mémoire automatique, tape <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', padding: '1px 4px', background: 'hsl(var(--border))', borderRadius: 4 }}>/memory</code> dans Claude Code.
        </Callout>

        {/* ── Section 06 ─────────────────────────────────────────────────── */}
        <SectionTitle num="06" title="Template CLAUDE.md Buildrs — Prêt à l'emploi" />

        <Body>
          Voici le template qu'on utilise chez Buildrs pour les projets SaaS. Copie-le, adapte le nom et les spécificités de ton projet — ou utilise le Générateur pour le faire automatiquement.
        </Body>

        <CodeBlock
          label="Template CLAUDE.md Buildrs"
          code={`# [Nom du SaaS] - CLAUDE.md

## Stack
- Next.js 14 (App Router) + TypeScript strict
- Supabase (auth, database, storage)
- Tailwind CSS + shadcn/ui
- Stripe (paiements)
- Vercel (déploiement)
- pnpm

## Commandes
- pnpm dev → lance le projet (port 3000)
- pnpm build → build production
- pnpm test → lance les tests (Vitest)
- pnpm lint → vérifie le code
- pnpm supabase db push → migrations DB

## Architecture
- src/app/(auth)/ → pages authentifiées
- src/app/(public)/ → pages publiques
- src/components/ui/ → shadcn (NE PAS MODIFIER)
- src/lib/supabase/ → client et requêtes Supabase
- src/lib/stripe/ → helpers Stripe
- src/types/ → types TypeScript

## Conventions
- Server Components par défaut
- 'use client' uniquement si nécessaire
- Zod pour toute validation
- Pas de any en TypeScript
- PascalCase composants, camelCase utils
- Exports nommés uniquement

## Règles
- RLS activé sur TOUTES les tables Supabase
- Jamais de clé API côté client
- Toujours vérifier l'auth avant les mutations
- NE PAS modifier src/components/ui/
- Pas de console.log en production`}
        />

        {/* ── Section 07 ─────────────────────────────────────────────────── */}
        <SectionTitle num="07" title="Bonnes pratiques Buildrs" />

        <div className="space-y-3 my-4">
          {[
            { num: '01', title: 'Garde le fichier court et dense', desc: 'Max 200 lignes pour le fichier projet principal. Au-delà, Claude Code commence à négliger certaines instructions. Utilise les imports @path ou .claude/rules/ pour modulariser.' },
            { num: '02', title: 'Sois spécifique, pas générique', desc: 'Voir le tableau ci-dessous. Les instructions vagues sont ignorées ou mal interprétées.' },
            { num: '03', title: 'Utilise /init pour démarrer', desc: 'La commande /init dans Claude Code analyse ton projet et génère un CLAUDE.md de base. C\'est un excellent point de départ que tu affines ensuite.' },
            { num: '04', title: 'Fais évoluer le fichier avec ton projet', desc: 'Mets-le à jour quand tu ajoutes une dépendance, changes de convention, restructures le projet, ou quand Claude Code fait une erreur récurrente.' },
            { num: '05', title: 'Versionne-le dans Git', desc: 'Le CLAUDE.md doit être dans ton dépôt Git. C\'est ce qui permet à toute l\'équipe (et à tes Team Agents) de bénéficier du même contexte. Seul CLAUDE.local.md reste hors du versioning.' },
          ].map(item => (
            <div key={item.num} className="flex gap-4 p-4 rounded-xl" style={{ background: 'hsl(var(--secondary))', border: '0.5px solid hsl(var(--border))' }}>
              <span className="text-[13px] font-black flex-shrink-0 mt-0.5" style={{ color: '#8b5cf6', fontFamily: 'Geist Mono, monospace' }}>{item.num}</span>
              <div>
                <p className="text-[13px] font-bold mb-1" style={{ color: 'hsl(var(--foreground))', letterSpacing: '-0.01em' }}>{item.title}</p>
                <p className="text-[12px] leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <SubTitle title="Spécifique vs générique" />
        <div className="rounded-xl overflow-hidden my-4" style={{ border: '0.5px solid hsl(var(--border))' }}>
          <div className="grid grid-cols-2 px-4 py-2" style={{ borderBottom: '0.5px solid hsl(var(--border))', background: 'hsl(var(--secondary))' }}>
            <p className="text-[9px] font-bold uppercase tracking-[0.1em] flex items-center gap-1.5" style={{ color: '#ef4444' }}><X size={9} strokeWidth={2} /> Générique</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.1em] flex items-center gap-1.5" style={{ color: '#22c55e' }}><Check size={9} strokeWidth={2} /> Spécifique</p>
          </div>
          <div className="px-4 py-1">
            <CompareRow bad="Écris du code propre" good="Indentation 2 espaces, guillemets simples, pas de point-virgule" />
            <CompareRow bad="Utilise les bonnes pratiques" good="Server Components par défaut, 'use client' uniquement pour les hooks" />
            <CompareRow bad="Teste le code" good="Tests unitaires avec Vitest, coverage minimum 80%" />
            <CompareRow bad="Gère les erreurs" good="Try/catch sur tous les appels Supabase, erreurs loguées via logger.error()" />
          </div>
        </div>

        {/* ── Section 08 ─────────────────────────────────────────────────── */}
        <SectionTitle num="08" title="Les 5 erreurs à éviter" />

        <div className="space-y-3 my-4">
          <ErrorCard num="01" title="Le fichier trop long" desc="Un CLAUDE.md de 300 lignes, c'est contre-productif. Claude Code charge ce fichier dans son contexte à chaque session. Plus il est long, plus il consomme de tokens et plus Claude risque d'ignorer certaines instructions." />
          <ErrorCard num="02" title="Les instructions contradictoires" desc="Si ton fichier global dit 'utilise npm' mais que ton fichier projet dit 'utilise pnpm', Claude utilisera pnpm (le plus spécifique gagne), mais ça crée de la confusion et des erreurs dans des contextes ambigus." />
          <ErrorCard num="03" title="Oublier les commandes de build" desc="C'est la section la plus utile au quotidien et pourtant souvent absente. Sans commandes de build, Claude Code devine — et il devine souvent mal." />
          <ErrorCard num="04" title="Copier-coller un template sans l'adapter" desc="Un template est un point de départ. Si tu copies un CLAUDE.md sans l'adapter, Claude Code aura des instructions qui ne correspondent pas à ta réalité." />
          <ErrorCard num="05" title="Ne pas mettre de garde-fous" desc="Les instructions 'ne pas faire' sont cruciales. Dis à Claude Code quels fichiers ne pas toucher, quelles approches éviter, quels patterns sont interdits." />
        </div>

        {/* ── Section 09 ─────────────────────────────────────────────────── */}
        <SectionTitle num="09" title="CLAUDE.md survit à tout" />

        <Body>
          Un point important que beaucoup ignorent : le CLAUDE.md <strong style={{ color: 'hsl(var(--foreground))' }}>survit au /compact</strong>. Après une compaction, Claude Code re-lit ton CLAUDE.md depuis le disque et le réinjecte dans la session.
        </Body>

        <Callout type="warning">
          Si une instruction disparaît après un <code style={{ fontFamily: 'Geist Mono, monospace', fontSize: '11px', padding: '1px 4px', background: 'hsl(var(--border))', borderRadius: 4 }}>/compact</code>, c'est qu'elle était dans la conversation, pas dans le CLAUDE.md. Morale : tout ce qui est important doit être dans le fichier, pas juste dit à l'oral.
        </Callout>

        {/* ── Sources ────────────────────────────────────────────────────── */}
        <div className="mt-12 pt-8" style={{ borderTop: '0.5px solid hsl(var(--border))' }}>
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>Sources</p>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Store instructions and memories — Documentation Anthropic', url: 'https://code.claude.com/docs/en/memory' },
              { label: 'Using CLAUDE.md files — Blog Anthropic', url: 'https://claude.com/blog/using-claude-md-files' },
              { label: 'Best Practices — Claude Code Docs', url: 'https://code.claude.com/docs/en/best-practices' },
              { label: 'How to Write a Good CLAUDE.md — Builder.io', url: 'https://www.builder.io/blog/claude-md-guide' },
            ].map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-[12px] transition-opacity hover:opacity-70"
                style={{ color: '#4d96ff' }}>
                <ExternalLink size={11} strokeWidth={1.5} />
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <div className="mt-10 rounded-2xl p-6 text-center" style={{ background: 'rgba(139,92,246,0.05)', border: '0.5px solid rgba(139,92,246,0.2)' }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <FileCode size={16} strokeWidth={1.5} style={{ color: '#8b5cf6' }} />
            <p className="text-[14px] font-extrabold" style={{ color: 'hsl(var(--foreground))', letterSpacing: '-0.02em' }}>Crée ton CLAUDE.md maintenant</p>
          </div>
          <p className="text-[12px] mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Le générateur te pose les bonnes questions et produit un fichier prêt à coller dans ton repo. Des mois d'expérience Buildrs en 5 minutes.
          </p>
          <button
            onClick={() => navigate('#/dashboard/claude-os/apprendre/claude-md/generateur')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold transition-all hover:opacity-90"
            style={{ background: '#8b5cf6', color: '#fff' }}
          >
            <Sparkles size={13} strokeWidth={2} />
            Lancer le générateur CLAUDE.md
          </button>
        </div>

      </div>
    </div>
  )
}
