import { useState, useCallback } from 'react'
import { ArrowLeft, Copy, Check, X, ExternalLink, ChevronRight } from 'lucide-react'

interface Props {
  navigate: (hash: string) => void
}

// ── Code block with copy ───────────────────────────────────────────────────

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

// ── Good / bad comparison ──────────────────────────────────────────────────

function Comparison({ bad, good }: { bad: string; good: string }) {
  return (
    <div className="flex flex-col gap-3 my-4">
      <div className="rounded-xl overflow-hidden" style={{ borderLeft: '2.5px solid #ef4444', background: 'rgba(239,68,68,0.04)' }}>
        <div className="flex items-center gap-2 px-4 py-2" style={{ borderBottom: '0.5px solid rgba(239,68,68,0.12)' }}>
          <X size={10} strokeWidth={2} style={{ color: '#ef4444' }} />
          <span className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: '#ef4444' }}>Mauvais prompt</span>
        </div>
        <pre className="px-4 py-3 text-[12px] leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', color: '#9399b2' }}>
          <code>{bad}</code>
        </pre>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ borderLeft: '2.5px solid #22c55e', background: 'rgba(34,197,94,0.04)' }}>
        <div className="flex items-center gap-2 px-4 py-2" style={{ borderBottom: '0.5px solid rgba(34,197,94,0.12)' }}>
          <Check size={10} strokeWidth={2} style={{ color: '#22c55e' }} />
          <span className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: '#22c55e' }}>Bon prompt</span>
        </div>
        <pre className="px-4 py-3 text-[12px] leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', color: '#c9d1d9' }}>
          <code>{good}</code>
        </pre>
      </div>
    </div>
  )
}

// ── Callout ────────────────────────────────────────────────────────────────

function Callout({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'warning' }) {
  const s = type === 'warning'
    ? { bg: 'rgba(234,179,8,0.06)', border: 'rgba(234,179,8,0.2)', color: '#eab308', label: 'IMPORTANT' }
    : { bg: 'rgba(77,150,255,0.06)', border: 'rgba(77,150,255,0.2)', color: '#4d96ff', label: 'NOTE' }
  return (
    <div className="rounded-xl px-4 py-3.5 my-4" style={{ background: s.bg, border: `0.5px solid ${s.border}` }}>
      <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: s.color }}>{s.label}</p>
      <div className="text-[12.5px] leading-relaxed" style={{ color: '#9399b2' }}>{children}</div>
    </div>
  )
}

// ── Section title ──────────────────────────────────────────────────────────

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

function PCard({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-5 mb-4" style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-[9px] font-black px-2 py-0.5 rounded-md" style={{ background: 'rgba(77,150,255,0.12)', color: '#4d96ff', border: '0.5px solid rgba(77,150,255,0.25)' }}>{id}</span>
        <h3 className="text-[13px] font-bold" style={{ color: '#f0f0f5', letterSpacing: '-0.015em' }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

function ECard({ id, title, desc, children }: { id: string; title: string; desc: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl p-5 mb-4" style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center gap-2.5 mb-2">
        <span className="text-[9px] font-black px-2 py-0.5 rounded-md" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '0.5px solid rgba(239,68,68,0.25)' }}>{id}</span>
        <h3 className="text-[13px] font-bold" style={{ color: '#f0f0f5', letterSpacing: '-0.015em' }}>{title}</h3>
      </div>
      <p className="text-[12.5px] leading-relaxed mb-1" style={{ color: '#9399b2' }}>{desc}</p>
      {children}
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────

export function PromptsFormationPage({ navigate }: Props) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Back */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm mb-10 transition-opacity hover:opacity-70"
          style={{ color: '#9399b2' }}
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          <span>Prompts</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] block mb-3" style={{ color: '#4d96ff' }}>Formation</span>
          <h1 className="text-[24px] font-extrabold mb-3" style={{ color: '#f0f0f5', letterSpacing: '-0.03em' }}>
            Les 5 principes et le framework CTAR
          </h1>
          <p className="text-[13.5px] leading-relaxed" style={{ color: '#9399b2' }}>
            Un bon prompt transforme Claude d'un assistant générique en expert de TON projet. Un mauvais prompt donne des résultats médiocres. La différence ? 5 principes et 10 minutes de pratique.
          </p>
        </div>

        <Callout type="warning">
          Cette formation est basée sur les best practices officielles Anthropic pour Claude 4.6 et adaptée au contexte Buildrs : builder de SaaS, non-dev, stack imposée.
        </Callout>

        {/* ── 01 ─────────────────────────────────────────────────────── */}
        <SectionTitle num="01" title="Pourquoi les prompts sont la compétence n°1" />

        <Body>
          Tu peux avoir tous les plugins, tous les MCPs, tous les skills du monde — si tu parles mal à Claude, tu auras des résultats médiocres. Le prompt, c'est ta façon de communiquer avec Claude. C'est la différence entre :
        </Body>

        <Comparison
          bad={`Fais-moi une page de pricing`}
          good={`Crée une page pricing pour mon SaaS Buildrs.

Stack : Next.js App Router + Tailwind + shadcn/ui.
Design : fond #080909, dark mode, Instrument Serif pour le titre,
Geist pour l'UI, icônes Lucide (strokeWidth 1.5), pas d'emoji.

3 plans : Free (0€), Builder (27€/mois), Pro (97€/mois).
Le plan Builder est mis en avant avec un badge "Populaire".
Chaque plan a : nom, prix, 5-6 features en liste, bouton CTA.
Toggle mensuel/annuel avec -20% sur l'annuel.

Mobile-first. Le layout passe en colonnes empilées sur mobile.
Utilise Framer Motion pour une animation fade-in au scroll.`}
        />

        <Callout>
          <strong style={{ color: '#f0f0f5' }}>La règle :</strong> Plus tu es précis, meilleur est le résultat. Claude ne devine pas — il suit tes instructions.
        </Callout>

        {/* ── 02 ─────────────────────────────────────────────────────── */}
        <SectionTitle num="02" title="Les 5 principes d'un prompt parfait" />

        <PCard id="P1" title="Sois explicite, pas implicite">
          <p className="text-[12.5px] leading-relaxed mb-3" style={{ color: '#9399b2' }}>
            Claude répond bien aux instructions claires et directes. Ne compte jamais sur l'inférence.
          </p>
          <Comparison
            bad={`"Fais un truc joli pour les users"`}
            good={`"Crée un dashboard utilisateur avec sidebar navigation,
    3 cartes métriques en haut (revenus, utilisateurs, churn),
    et un graphique d'évolution mensuelle en dessous."`}
          />
          <p className="text-[12px] leading-relaxed" style={{ color: '#9399b2' }}>
            Si tu veux un comportement "au-delà des attentes", demande-le explicitement plutôt que de compter sur le modèle pour le deviner.
          </p>
        </PCard>

        <PCard id="P2" title="Structure avec des sections claires">
          <p className="text-[12.5px] leading-relaxed mb-3" style={{ color: '#9399b2' }}>
            Organise ton prompt en blocs logiques. Claude traite mieux les instructions structurées que les paragraphes denses.
          </p>
          <CodeBlock label="Structure de base" code={`CONTEXTE :
[Ce que Claude doit savoir sur le projet]

TÂCHE :
[Ce que Claude doit faire, étape par étape]

CONTRAINTES :
[Les règles à respecter]

FORMAT DE SORTIE :
[Comment tu veux le résultat]`} />
          <p className="text-[12px] leading-relaxed mb-3" style={{ color: '#9399b2' }}>
            Pour les prompts complexes, utilise des balises XML — Claude les traite nativement :
          </p>
          <CodeBlock label="xml" code={`<context>
Tu travailles sur le SaaS Buildrs, un dashboard pour non-devs.
</context>

<task>
Crée le composant React pour la page d'onboarding.
</task>

<constraints>
- Stack : Next.js + Tailwind + shadcn/ui
- Dark mode uniquement, fond #080909
- 3 étapes : Bienvenue → Choisis ton plan → Configure ton projet
</constraints>`} />
        </PCard>

        <PCard id="P3" title="Assigne un rôle précis">
          <p className="text-[12.5px] leading-relaxed mb-3" style={{ color: '#9399b2' }}>
            Ne dis pas juste "tu es un expert". Dis QUI il est, CE QU'IL SAIT, et COMMENT il doit se comporter.
          </p>
          <Comparison
            bad={`"Tu es un développeur"`}
            good={`"Tu es un expert fullstack SaaS spécialisé dans Next.js + Supabase.
    Tu codes comme un senior — production-ready, sécurisé, maintenable.
    Tu ne proposes jamais de prototype. Tu vérifies toujours la sécurité
    (RLS, clés API côté serveur uniquement, validation des inputs).
    Tu penses mobile-first."`}
          />
        </PCard>

        <PCard id="P4" title="Montre des exemples plutôt que d'expliquer longuement">
          <p className="text-[12.5px] leading-relaxed mb-3" style={{ color: '#9399b2' }}>
            Un exemple vaut 100 lignes d'instructions. Claude apprend mieux par l'exemple que par la théorie.
          </p>
          <Comparison
            bad={`"Fais des messages de commit propres en respectant les conventions"`}
            good={`"Format de commit :
    feat(auth): ajouter la connexion Google OAuth
    fix(pricing): corriger le calcul du prix annuel
    refactor(dashboard): extraire le composant MetricCard

    Utilise ce format pour tous les commits."`}
          />
        </PCard>

        <PCard id="P5" title="Demande le raisonnement avant l'action">
          <p className="text-[12.5px] leading-relaxed mb-3" style={{ color: '#9399b2' }}>
            Pour les tâches complexes, demande à Claude de réfléchir avant de coder. C'est le "think step by step" qui fait la différence.
          </p>
          <CodeBlock code={`"Avant de coder, analyse :
1. Quels composants existants je peux réutiliser ?
2. Quelles données je dois récupérer et d'où ?
3. Quels edge cases je dois gérer (empty, loading, error) ?
4. Quels risques de sécurité existent ?

Puis implémente."`} />
          <p className="text-[12px] leading-relaxed" style={{ color: '#9399b2' }}>
            Dans Claude Code, tu peux aussi utiliser l'<strong style={{ color: '#f0f0f5' }}>extended thinking</strong> en demandant explicitement à Claude de réfléchir plus longtemps sur un problème complexe.
          </p>
        </PCard>

        {/* ── 03 ─────────────────────────────────────────────────────── */}
        <SectionTitle num="03" title="Les 4 types de prompts dans Buildrs" />

        <SubTitle title="Type 1 — Le prompt de tâche (Claude Code)" />
        <Body>Tu veux que Claude FASSE quelque chose de spécifique.</Body>
        <CodeBlock label="Structure" code={`[QUOI FAIRE]
[AVEC QUELLE STACK / QUELS OUTILS]
[LES CONTRAINTES]
[LE FORMAT DE SORTIE ATTENDU]`} />
        <CodeBlock label="Exemple" code={`Crée un webhook Stripe dans une Edge Function Supabase.

Stack : Supabase Edge Functions (Deno), Stripe API.

Le webhook doit :
1. Vérifier la signature Stripe (STRIPE_WEBHOOK_SECRET)
2. Gérer l'event checkout.session.completed
3. Créer/mettre à jour l'utilisateur dans la table "subscriptions"
4. Retourner 200 si succès, 400 si erreur de signature

Contraintes :
- STRIPE_SECRET_KEY en variable d'environnement serveur uniquement
- RLS activé sur la table subscriptions
- Log les erreurs dans la console pour le debugging`} />

        <SubTitle title="Type 2 — Le prompt de réflexion (Claude Code + Cowork)" />
        <Body>Tu veux que Claude RÉFLÉCHISSE avant d'agir.</Body>
        <CodeBlock label="Structure" code={`[CONTEXTE DU PROBLÈME]
[CE QUE TU VEUX COMPRENDRE]
"Propose 2-3 approches avec les avantages et inconvénients de chacune."`} />
        <CodeBlock label="Exemple" code={`Mon SaaS a un taux de churn de 15% au mois 2.
Les utilisateurs s'inscrivent, utilisent 1-2 fois, puis disparaissent.

Analyse ce problème et propose 2-3 solutions concrètes :
- Ce qu'on peut implémenter dans le produit
- Les métriques à tracker pour mesurer l'impact
- L'effort d'implémentation (facile/moyen/dur)`} />

        <SubTitle title="Type 3 — Le prompt de contenu (Cowork)" />
        <Body>Tu veux que Claude ÉCRIVE du contenu marketing, des emails, des docs.</Body>
        <CodeBlock label="Structure" code={`[TYPE DE CONTENU]
[POUR QUI (cible)]
[TON ET STYLE]
[STRUCTURE ATTENDUE]
[EXEMPLES SI POSSIBLE]`} />
        <CodeBlock label="Exemple" code={`Écris un email de bienvenue pour les nouveaux inscrits de Buildrs.

Cible : entrepreneurs non-techniques qui veulent créer un SaaS
Ton : direct, encourageant, pas corporate, pas de jargon technique
Longueur : max 200 mots

Structure :
1. Félicitations (1 phrase)
2. Ce qu'ils peuvent faire maintenant (3 bullet points)
3. Un CTA clair vers le dashboard
4. PS avec un lien vers le support`} />

        <SubTitle title="Type 4 — Le prompt système (System Prompt / CLAUDE.md)" />
        <Body>C'est le prompt permanent qui définit l'identité et le comportement de Claude pour tout le projet.</Body>
        <CodeBlock label="Structure" code={`[IDENTITÉ : qui est Claude dans ce projet]
[STACK : technologies imposées]
[DESIGN SYSTEM : règles visuelles]
[SÉCURITÉ : règles non négociables]
[COMPORTEMENT : comment il travaille]
[PHILOSOPHIE : principes directeurs]`} />

        {/* ── 04 ─────────────────────────────────────────────────────── */}
        <SectionTitle num="04" title="Les erreurs à éviter" />

        <ECard id="E1" title="Le prompt trop vague" desc="Claude ne sait pas ce que «améliorer» signifie pour toi. Performance ? Design ? SEO ? Conversion ?">
          <Comparison
            bad={`"Améliore mon site"`}
            good={`"Analyse la page d'accueil de buildrs.fr et identifie :
    1. Les problèmes de performance (images, scripts, CLS)
    2. Les problèmes SEO (title, meta, H1, alt)
    3. Les problèmes de conversion (CTA, hierarchy visuelle)

    Pour chaque problème, propose un fix concret avec le code."`}
          />
        </ECard>

        <ECard id="E2" title="Trop d'instructions en une seule fois" desc="Si ton prompt dépasse 30 lignes, découpe-le en étapes. Claude travaille mieux par itérations.">
          <Comparison
            bad={`"Un prompt de 50 lignes qui demande tout en même temps"`}
            good={`"Étape 1 : 'Analyse l'architecture actuelle'
   Étape 2 : 'Propose un plan de refactoring'
   Étape 3 : 'Implémente la première tâche du plan'"`}
          />
          <p className="text-[12px] mt-2" style={{ color: '#9399b2' }}>
            Ou utilise le pipeline Superpowers :{' '}
            <code style={{ color: '#4d96ff', fontFamily: 'Geist Mono, monospace' }}>/superpowers:brainstorm</code>
            {' → '}
            <code style={{ color: '#4d96ff', fontFamily: 'Geist Mono, monospace' }}>/superpowers:write-plan</code>
            {' → '}
            <code style={{ color: '#4d96ff', fontFamily: 'Geist Mono, monospace' }}>/superpowers:execute-plan</code>
          </p>
        </ECard>

        <ECard id="E3" title="Ne pas donner le contexte projet" desc="Claude ne connaît pas ton projet. Sans CLAUDE.md ni system prompt, il part de zéro à chaque session.">
          <Callout>
            <strong style={{ color: '#f0f0f5' }}>Solution :</strong> Crée ton CLAUDE.md (module CLAUDE.md) et ton prompt système. Claude les lit automatiquement au démarrage.
          </Callout>
        </ECard>

        <ECard id="E4" title="Oublier le format de sortie" desc="Si tu ne dis pas comment tu veux le résultat, Claude choisit pour toi — et ça ne sera pas forcément ce que tu veux.">
          <Comparison
            bad={`"Donne-moi des idées de features"`}
            good={`"Donne-moi 5 idées de features pour Buildrs.
    Pour chaque idée :
    - Nom de la feature (3 mots max)
    - Description (1 phrase)
    - Impact business (faible/moyen/fort)
    - Effort d'implémentation (1 jour / 1 semaine / 1 mois)

    Classe-les par ratio impact/effort, le meilleur en premier."`}
          />
        </ECard>

        <ECard id="E5" title="Ne pas itérer" desc="Le premier résultat n'est presque jamais parfait. Les meilleurs builders itèrent :">
          <CodeBlock code={`"C'est bien, mais :
- Le spacing est trop serré entre les cartes, utilise gap-6
- Le CTA devrait être plus visible, utilise un bouton primary
- Ajoute un empty state quand il n'y a pas de données"`} />
          <p className="text-[12px]" style={{ color: '#9399b2' }}>Claude s'améliore à chaque itération. C'est comme ça qu'on travaille chez Buildrs.</p>
        </ECard>

        {/* ── 05 ─────────────────────────────────────────────────────── */}
        <SectionTitle num="05" title="Prompts spécifiques pour Claude Code" />

        {[
          { title: 'Demander une feature', code: `Crée [NOM DE LA FEATURE].

Contexte : [où ça s'insère dans l'app]
Comportement : [ce que ça doit faire, étape par étape]
Données : [quelles tables/APIs sont impliquées]
Design : [comment ça doit ressembler]
Edge cases : [empty state, loading, erreur, limites]` },
          { title: 'Débugger un problème', code: `Bug : [description précise du bug]
Comportement attendu : [ce qui devrait se passer]
Comportement actuel : [ce qui se passe réellement]
Étapes pour reproduire : [1, 2, 3...]
Fichiers concernés : [src/...]

Investigate le bug et propose un fix.` },
          { title: 'Demander une code review', code: `Review les changements que je viens de faire.

Focus sur :
1. Sécurité (clés API, RLS, injections)
2. Performance (requêtes N+1, re-renders inutiles)
3. Edge cases non gérés
4. Conformité avec le CLAUDE.md du projet` },
          { title: 'Créer une migration Supabase', code: `Crée une migration pour la table [NOM].

Colonnes :
- id (uuid, PK, default gen_random_uuid())
- user_id (uuid, FK auth.users, NOT NULL)
- [autres colonnes avec types]
- created_at (timestamptz, default now())

RLS :
- SELECT : users can read their own rows
- INSERT : authenticated users can insert their own rows
- UPDATE : users can update their own rows
- DELETE : users can delete their own rows

Applique la migration via Supabase MCP.` },
        ].map(({ title, code }) => (
          <div key={title}>
            <SubTitle title={title} />
            <CodeBlock code={code} />
          </div>
        ))}

        {/* ── 06 ─────────────────────────────────────────────────────── */}
        <SectionTitle num="06" title="Prompts spécifiques pour Cowork" />

        {[
          { title: 'Analyser un marché', code: `Analyse le marché de [SECTEUR] pour valider mon idée de SaaS.

Recherche :
1. La taille du marché (TAM, SAM, SOM estimés)
2. Les 5 concurrents principaux avec pricing
3. Les lacunes du marché (ce que personne ne fait bien)
4. Le canal d'acquisition le plus pertinent

Sources : utilise la recherche web pour des données récentes.
Format : tableau comparatif des concurrents + recommandation.` },
          { title: 'Créer un pitch deck', code: `Crée un pitch deck pour [NOM DU PROJET].

Problème : [en 1 phrase]
Solution : [en 1 phrase]
Cible : [qui]
Business model : [comment on gagne de l'argent]
Traction : [chiffres si disponibles]

Structure : 10 slides max.
Pour chaque slide : titre + 3-5 bullet points + note de speaker.` },
          { title: 'Rédiger du contenu SEO', code: `Écris un article de blog optimisé SEO sur [SUJET].

Mot-clé principal : [MOT-CLÉ]
Mots-clés secondaires : [2-3 mots-clés]
Longueur : 1500-2000 mots
Structure : H1 → intro → 4-6 H2 → conclusion → CTA

Optimise :
- Le mot-clé dans le title (50-60 caractères)
- La meta description (150-160 caractères)
- Le H1 contient le mot-clé
- Le mot-clé dans les 100 premiers mots
- Densité 1-2%` },
        ].map(({ title, code }) => (
          <div key={title}>
            <SubTitle title={title} />
            <CodeBlock code={code} />
          </div>
        ))}

        {/* ── 07 — CTAR ───────────────────────────────────────────────── */}
        <SectionTitle num="07" title="Le framework CTAR — Ta structure de prompt" />

        <Body>Un framework simple pour ne jamais oublier les éléments clés :</Body>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { letter: 'C', label: 'Contexte', desc: 'Qui est Claude ? Quel est le projet ?' },
            { letter: 'T', label: 'Tâche', desc: 'Que doit-il faire ? Étape par étape.' },
            { letter: 'A', label: 'Attentes', desc: 'Quelles règles respecter ? Quel format de sortie ?' },
            { letter: 'R', label: 'Résultat', desc: 'À quoi ressemble le résultat parfait ? Exemples.' },
          ].map(({ letter, label, desc }) => (
            <div key={letter} className="rounded-xl p-4" style={{ background: 'rgba(77,150,255,0.06)', border: '0.5px solid rgba(77,150,255,0.18)' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[20px] font-black" style={{ color: '#4d96ff', letterSpacing: '-0.04em' }}>{letter}</span>
                <span className="text-[12px] font-bold" style={{ color: '#f0f0f5' }}>{label}</span>
              </div>
              <p className="text-[11.5px] leading-relaxed" style={{ color: '#9399b2' }}>{desc}</p>
            </div>
          ))}
        </div>

        <CodeBlock label="Exemple CTAR complet" code={`CONTEXTE :
Tu es un expert fullstack SaaS. Tu travailles sur Buildrs (dashboard non-dev).
Stack : Next.js + Supabase + Stripe + Tailwind.

TÂCHE :
Crée la page d'inscription avec :
1. Formulaire email + password
2. Bouton "S'inscrire avec Google"
3. Lien vers la page de connexion

ATTENTES :
- Supabase Auth (email + Google OAuth)
- Design : fond #080909, dark mode, Geist font
- Validation Zod sur les inputs
- Loading state pendant la soumission
- Redirect vers /dashboard après inscription

RÉSULTAT :
Un fichier app/(auth)/signup/page.tsx complet et fonctionnel.`} />

        {/* ── Sources ───────────────────────────────────────────────── */}
        <div className="rounded-xl px-5 py-4 mt-10 mb-6" style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-3" style={{ color: '#5b6078' }}>Documentation officielle</p>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Prompting best practices — Anthropic Docs', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices' },
              { label: 'Prompt engineering overview — Anthropic', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview' },
              { label: 'Prompt Engineering Interactive Tutorial — GitHub', url: 'https://github.com/anthropics/prompt-eng-interactive-tutorial' },
            ].map(({ label, url }) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[12px] transition-opacity hover:opacity-80" style={{ color: '#4d96ff' }}>
                <ExternalLink size={11} strokeWidth={1.5} className="flex-shrink-0" />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <button
          onClick={() => navigate('#/dashboard/claude-os/generer/generateur-prompt-parfait')}
          className="w-full text-left rounded-xl p-5 group transition-all duration-150"
          style={{ background: 'rgba(77,150,255,0.06)', border: '0.5px solid rgba(77,150,255,0.2)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: '#4d96ff' }}>Et maintenant ?</p>
              <p className="text-[14px] font-bold mb-1" style={{ color: '#f0f0f5', letterSpacing: '-0.02em' }}>Générateur de Prompt Parfait</p>
              <p className="text-[12px] leading-relaxed" style={{ color: '#9399b2' }}>
                Tu connais les 5 principes et le framework CTAR. Crée maintenant ton system prompt personnalisé — le prompt qui encode toutes tes règles pour que Claude les applique automatiquement à chaque session.
              </p>
            </div>
            <ChevronRight size={16} strokeWidth={1.5} className="flex-shrink-0 ml-4 transition-transform group-hover:translate-x-1" style={{ color: '#4d96ff' }} />
          </div>
        </button>

        <div className="h-12" />
      </div>
    </div>
  )
}
