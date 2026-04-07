import { useState, useEffect, useRef } from "react"
import { Clock, Banknote, Layers, Bot, Zap, Check, Flame, Terminal, Monitor, ChevronRight, MessageCircle, Brain, RefreshCw, FolderX } from "lucide-react"
import { StackedCircularFooter } from "./ui/stacked-circular-footer"
import { BuildrsIcon, BrandIcons, ClaudeIcon } from "./ui/icons"
import { DashboardPreview } from "./ui/dashboard-preview"
import { DottedSurface } from "./ui/dotted-surface"
import { motion } from "framer-motion"
import { AnimatedBeam } from "./ui/animated-beam"
import { TerminalControlSectionAnimated } from "./ui/terminal-control-section-animated"

// ── Countdown ────────────────────────────────────────────────────────────────
const LAUNCH_END = new Date('2026-05-01T23:59:59')

function useCountdown(target: Date) {
  const get = (t: Date) => {
    const diff = Math.max(0, t.getTime() - Date.now())
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    }
  }
  const [t, setT] = useState(() => get(target))
  useEffect(() => {
    const id = setInterval(() => setT(get(target)), 1000)
    return () => clearInterval(id)
  }, [target])
  return t
}

function _ScarcityCountdown({ className }: { className?: string }) {
  const { d, h, m, s } = useCountdown(LAUNCH_END)
  return (
    <span className={className}>
      <span className="hidden sm:inline">Offre de lancement — se termine dans </span>
      <span className="sm:hidden">Fin dans </span>
      <span className="font-bold tabular-nums">{d}j {h}h {m}m {String(s).padStart(2, '0')}s</span>
    </span>
  )
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const tools: { label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { label: "Claude AI",   Icon: BrandIcons.claude },
  { label: "VS Code",     Icon: BrandIcons.vscode },
  { label: "Supabase",    Icon: BrandIcons.supabase },
  { label: "Vercel",      Icon: BrandIcons.vercel },
  { label: "GitHub",      Icon: BrandIcons.github },
  { label: "Stripe",      Icon: BrandIcons.stripe },
  { label: "Resend",      Icon: BrandIcons.resend },
  { label: "Stitch",      Icon: BrandIcons.stitch },
  { label: "21st.dev",    Icon: BrandIcons.twentyOneDev },
  { label: "Hostinger",   Icon: BrandIcons.hostinger },
  { label: "Perplexity",  Icon: BrandIcons.perplexity },
  { label: "NotebookLM",  Icon: BrandIcons.notebooklm },
]

const pains = [
  {
    Icon: MessageCircle,
    title: "Tu utilises Claude comme un simple chatbot.",
    desc: "Tu tapes des questions, tu obtiens des réponses génériques. Claude a des skills, des sub-agents, des connecteurs que 95% des gens n'utilisent jamais. Tu utilises 5% de son potentiel.",
  },
  {
    Icon: Brain,
    title: "Tu croules sous l'info IA. Tu ne buildes rien.",
    desc: "Chaque jour 50 posts sur les MCP, 30 vidéos sur Claude Code, 10 newsletters IA. Tu sais tout. Tu n'as rien construit. Le trop-plein d'infos te paralyse au lieu de te faire avancer.",
  },
  {
    Icon: RefreshCw,
    title: "Tu perds 30 minutes à réexpliquer ton contexte. À chaque session.",
    desc: "Zéro mémoire. Zéro cohérence. Tu recommences à zéro à chaque conversation. Pendant ce temps, d'autres ont un Claude qui sait exactement qui ils sont et ce qu'ils construisent.",
  },
  {
    Icon: FolderX,
    title: "Tes projets IA sont désorganisés, sans système.",
    desc: "Tes prompts sont éparpillés dans 20 onglets. Tu jongles entre les versions. Il te manque une architecture. Pendant ce temps, quelqu'un d'autre sort son produit.",
  },
]

const chapters = [
  {
    num: "01", title: "Claude basique vs Claude Buildrs",
    deliverable: "Tu comprends pourquoi 95% des gens utilisent Claude à 5% de son potentiel",
    items: [
      "La différence entre un usage basique et un setup professionnel",
      "Pourquoi la configuration initiale multiplie ta vélocité par 10",
      "Ce que les builders qui génèrent +5 000€/mois font différemment",
    ],
    accent: "#4d96ff",
  },
  {
    num: "02", title: "Choisir le bon modèle au bon moment",
    deliverable: "Tu sais exactement quel modèle utiliser selon la tâche",
    items: [
      "Sonnet vs Opus vs Haiku — les règles pour choisir",
      "Économiser des tokens en utilisant le bon modèle pour la bonne tâche",
      "Les shortcuts de switching sans quitter ton workflow",
    ],
    accent: "#22c55e",
  },
  {
    num: "03", title: "Les interfaces Claude",
    deliverable: "Tu maîtrises tous les points d'accès à Claude",
    items: [
      "claude.ai, API, Claude Code — les différences concrètes",
      "Piloter Claude Code depuis ton téléphone via Discord ou Telegram",
      "Créer et piloter des agents Cowork depuis l'app Claude sur mobile",
      "Les settings cachés qui changent tout",
    ],
    accent: "#cc5de8",
  },
  {
    num: "04", title: "Paramétrer ton Claude Buildrs",
    deliverable: "Ton environnement configuré une fois, opérationnel pour toujours",
    items: [
      "Les paramètres système que personne ne montre",
      "La configuration projet qui mémorise ton contexte",
      "Les defaults qui accélèrent chaque session de 50%",
    ],
    accent: "#eab308",
  },
  {
    num: "05", title: "Le CLAUDE.md",
    deliverable: "Un fichier de contexte que Claude lit à chaque session — zéro re-explication",
    items: [
      "La structure exacte d'un CLAUDE.md qui marche",
      "Le template CLAUDE.md utilisé dans tous les projets Buildrs",
      "Comment adapter pour ton domaine et tes projets",
    ],
    accent: "#f97316",
  },
  {
    num: "06", title: "Les Skills",
    deliverable: "Les meilleurs skills du marché — les plus connectés, les plus testés, validés par Anthropic. Spécialisés SaaS, apps et logiciels.",
    items: [
      "Ce que sont les Skills et pourquoi ils changent tout",
      "Les Skills Buildrs : brainstorming, planification, code review",
      "Comment créer tes propres Skills sur mesure",
    ],
    accent: "#ff6b6b",
  },
  {
    num: "07", title: "Les MCP",
    deliverable: "Les connecteurs liés aux outils qui génèrent des revenus avec ton SaaS, app ou logiciel — Supabase, Stripe, GitHub, Vercel, Figma. Configurés pas à pas.",
    items: [
      "Les 10 MCP les plus puissants pour les builders",
      "Installation et configuration guidée pour chaque MCP",
      "Automatisations avancées : Claude écrit du code ET le déploie",
    ],
    accent: "#14b8a6",
  },
  {
    num: "08", title: "Les commandes Claude Code",
    deliverable: "Tu multiplies ta vélocité de développement par 5",
    items: [
      "Les slash commands essentielles et les commandes custom",
      "Gestion des sessions longues et économie de tokens",
      "Les patterns de workflow pour des projets complexes",
    ],
    accent: "#8b5cf6",
  },
  {
    num: "09", title: "Les sub-agents parallèles",
    deliverable: "Plusieurs agents IA qui travaillent en même temps sur ton projet",
    items: [
      "Comment lancer 3 agents en parallèle et assembler les résultats",
      "La division des tâches complexes en micro-missions",
      "Le pattern orchestrateur + exécutants utilisé chez Buildrs",
    ],
    accent: "#3b82f6",
  },
  {
    num: "10", title: "Le Pack Buildrs",
    deliverable: "Ton setup final complet, connecté au dashboard Blueprint",
    items: [
      "Le bundle de configs, prompts et templates prêts à l'emploi",
      "L'intégration avec le dashboard Blueprint et les agents IA",
      "Le workflow opérationnel pour lancer ton premier SaaS avec ce setup",
    ],
    accent: "#22c55e",
  },
]

const features: { text: string; value: string }[] = [
  { text: "Setup complet Claude Buildrs — guide pas à pas de la configuration initiale (interfaces, paramètres, modèles)", value: "197€" },
  { text: "CLAUDE.md templates — les modèles exacts pour définir ton contexte projet et ta personnalité IA", value: "147€" },
  { text: "Guide des 10 meilleurs MCP — outils qui connectent Claude à ton stack tech (GitHub, Supabase, Notion...)", value: "197€" },
  { text: "Bibliothèque de Skills — les workflows prébuilt pour accélérer chaque type de tâche", value: "147€" },
  { text: "Stratégie multi-modèles — savoir quand utiliser Sonnet, Opus, Haiku selon la tâche et le budget", value: "97€" },
  { text: "Les commandes Claude Code — les raccourcis qui multiplient ta vélocité par 5", value: "147€" },
  { text: "Architecture sub-agents — comment lancer des tâches en parallèle et diviser pour mieux régner", value: "197€" },
  { text: "Accès à vie + mises à jour continues — l'environnement évolue avec l'IA, tu reçois tout automatiquement", value: "" },
]

const bonuses: { text: string; value: string }[] = [
  { text: "Guide : Piloter Claude Code depuis ton téléphone — configuration Discord + Telegram, pas à pas", value: "47€" },
  { text: "Guide : Gérer tes agents Cowork depuis l'app Claude — configuration et pilotage depuis DISPATCH", value: "97€" },
  { text: "Guide : Installer Claude Code dans VS Code — configuration locale complète sur ton ordinateur", value: "67€" },
  { text: "WhatsApp Buildrs — accès privé à Jarvis via le canal WhatsApp Buildrs", value: "47€" },
]

const faqs = [
  {
    q: "C'est quoi 'Claude Buildrs' exactement ?",
    a: "C'est le setup complet pour utiliser Claude comme un builder pro : CLAUDE.md, Skills, MCP, sub-agents, commandes avancées. Pas juste un accès — une vraie configuration optimisée pour construire des produits IA.",
  },
  {
    q: "Est-ce que ça marche si je n'ai jamais utilisé Claude avancé ?",
    a: "Oui. Le setup est conçu pour partir de zéro et arriver à un environnement pro en une journée. Chaque étape est guidée avec des copies exactes à coller. Aucune connaissance technique requise.",
  },
  {
    q: "Quelle différence avec le Buildrs Blueprint ?",
    a: "Le Blueprint couvre tout le parcours SaaS (idée → MVP → lancement). Claude Buildrs se concentre sur l'outil IA lui-même — comment le configurer, l'optimiser et l'automatiser pour maximiser ta vélocité. Les deux se complètent.",
  },
  {
    q: "Est-ce que je dois avoir Claude Code pour en profiter ?",
    a: "Non, mais Claude Code est recommandé pour les chapitres avancés (commandes, sub-agents). Les chapitres 1 à 6 fonctionnent avec claude.ai uniquement. Claude Code coûte 20€/mois.",
  },
  {
    q: "Combien de temps pour installer tout ça ?",
    a: "Environ une journée pour l'installation complète. Certains chapitres sont des lectures de 10 minutes, d'autres demandent 30-60 minutes de configuration. Le dashboard est à vie — tu avances à ton rythme.",
  },
  {
    q: "Les MCP, c'est quoi exactement ?",
    a: "Les MCP (Model Context Protocol) sont des connecteurs qui donnent à Claude l'accès à tes outils : GitHub, Supabase, Notion, Linear... Claude peut lire et écrire dans ces outils sans que tu aies à tout copier-coller manuellement.",
  },
  {
    q: "Est-ce que le setup marche avec GPT ou Gemini ?",
    a: "Le setup est optimisé pour Claude. Certains principes (CLAUDE.md, workflows) sont transférables, mais les Skills, MCP et commandes sont spécifiques à l'écosystème Claude. On ne teste pas sur GPT ou Gemini.",
  },
  {
    q: "Comment ça se passe après le paiement ?",
    a: "Accès immédiat au dashboard. Un onboarding rapide (2 minutes) te place directement sur le chapitre 1. Tu peux tout parcourir dans l'ordre ou aller directement aux chapitres avancés selon ton niveau.",
  },
  {
    q: "Et si ça marche pas pour moi ?",
    a: "Tu as 30 jours pour tester. Si le setup ne t'apporte pas de valeur concrète, on te rembourse intégralement, sans condition et sans question. Le risque est pour nous, pas pour toi.",
  },
]

const beforeItems = [
  "Tu utilises Claude comme un chatbot — questions basiques, réponses génériques",
  "Tu re-expliques ton contexte à chaque nouvelle session — zéro mémoire",
  "Tu ne sais pas quels modèles utiliser ni dans quel ordre selon la tâche",
  "On te dit que Claude est une révolution — et t'as toujours rien buildé",
]

const afterItems = [
  "Claude mémorise ton contexte, ton stack et tes projets — dès le démarrage",
  "Tu lances des agents spécialisés en parallèle pour chaque phase du build",
  "Tu sais exactement quel modèle utiliser pour maximiser qualité et budget",
  "Tu as un système IA documenté, reproductible et mis à jour en continu",
]

const OBJECTIONS = [
  {
    label: "J'ai pas le temps",
    response: "C'est installé en une journée. Pas en 6 mois. Une session et ton Claude est opérationnel. Pendant que tu 'trouves le temps', d'autres installent et buildent.",
  },
  {
    label: "C'est trop technique",
    response: "Si tu sais écrire un message, tu sais utiliser Claude Buildrs. On t'installe tout, chapitre par chapitre, sans jargon.",
  },
  {
    label: "J'ai déjà un bon setup",
    response: "Sans skills spécialisés, sans connecteurs branchés, sans sub-agents parallèles, sans mises à jour en continu ? Ton setup est à 10%. On t'amène à 100%.",
  },
  {
    label: "47€ c'est trop cher",
    response: "47€ c'est un resto. Le setup qu'on te donne génère +25 000€/mois chez nous. Un seul client sur ton futur SaaS et c'est remboursé 10 fois. Garanti 30 jours.",
  },
  {
    label: "Je vais me débrouiller seul",
    response: "Tu peux. Dans 6 mois tu auras peut-être trouvé les bons skills, les bons connecteurs, les bonnes commandes. Ou tu peux tout installer en une journée et commencer à builder demain.",
  },
]

const BONUS_COUNT = 76
const BONUS_TOTAL = 200

// ─── NAV ─────────────────────────────────────────────────────────────────────

function Nav({ onCTA }: { onCTA?: (e: React.MouseEvent) => void }) {
  const [dark, setDark] = useState(false)

  const toggleTheme = () => {
    setDark((d) => {
      const next = !d
      document.documentElement.classList.toggle("dark", next)
      return next
    })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[60px] max-w-[1100px] items-center justify-between gap-6 px-6">
        <a href="#" className="flex items-center gap-2 no-underline">
          <BuildrsIcon color="currentColor" className="h-6 w-6 text-foreground" />
          <span className="text-[15px] font-bold tracking-tight text-foreground" style={{ letterSpacing: "-0.03em" }}>Buildrs</span>
        </a>

        <ul className="hidden items-center gap-1 list-none md:flex">
          {[
            { label: "Le programme", id: "modules" },
            { label: "Ce que tu reçois", id: "contenu" },
            { label: "Tarif", id: "tarif" },
            { label: "FAQ", id: "faq" },
          ].map(({ label, id }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="rounded-md px-3 py-1.5 text-sm font-[450] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground no-underline cursor-pointer"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-transparent text-muted-foreground transition-colors hover:bg-accent cursor-pointer"
            aria-label="Changer le thème"
          >
            {dark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          <a href="#tarif" onClick={onCTA} className="cta-rainbow flex items-center gap-2 rounded-[8px] bg-foreground px-4 py-2 text-[13px] font-semibold text-background transition-opacity hover:opacity-85 no-underline">
            Accéder au setup →
          </a>
        </div>
      </div>
    </nav>
  )
}

// ─── VEHICLE TAG ─────────────────────────────────────────────────────────────

const VEHICLE_PHRASES = [
  'Lancer des SaaS IA rentables.',
  'Construire des apps IA.',
  'Monétiser des logiciels.',
  'Générer des revenus récurrents.',
  'Builder des produits qui vendent.',
]

function VehicleTag() {
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    const target = VEHICLE_PHRASES[phraseIdx]
    if (typing) {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 55)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setTyping(false), 1800)
        return () => clearTimeout(t)
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(d => d.slice(0, -1)), 28)
        return () => clearTimeout(t)
      } else {
        setPhraseIdx(i => (i + 1) % VEHICLE_PHRASES.length)
        setTyping(true)
      }
    }
  }, [displayed, typing, phraseIdx])

  return (
    <div
      className="mb-6 inline-flex items-center gap-2.5 rounded-full px-5 py-3"
      style={{
        background: '#09090b',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 8px 24px rgba(0,0,0,0.25)',
      }}
    >
      <span className="text-[14px] whitespace-nowrap font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Spécialisé
      </span>
      <span className="text-[14px] font-semibold text-white" style={{ minWidth: '180px', display: 'inline-block' }}>
        {displayed}
      </span>
      <span
        className="text-white font-light text-[16px] leading-none"
        style={{ animation: 'cursor-blink 0.9s step-end infinite' }}
      >|</span>
    </div>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero({ onCTA }: { onCTA?: (e: React.MouseEvent) => void }) {
  const bonusPct = Math.round((BONUS_COUNT / BONUS_TOTAL) * 100)
  return (
    <section className="relative overflow-hidden px-6 sm:px-10 pb-20 pt-[120px] sm:pt-[140px]">
      <DottedSurface className="absolute inset-0 w-full h-full" />
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-[600px]"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(204,93,232,0.08) 0%, transparent 65%)" }}
      />

      <div className="relative mx-auto max-w-[680px] flex flex-col items-center text-center">

        {/* Surtitre */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-[12px] sm:text-[13px] text-muted-foreground">
          <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-muted">
            <ClaudeIcon size={13} />
          </span>
          <span>Crée ton SaaS, ton app ou ton logiciel — avec Claude.</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted-foreground/50"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>

        {/* Titre */}
        <h1
          className="mb-6 text-foreground"
          style={{ fontSize: "clamp(32px, 4.8vw, 62px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05 }}
        >
          L'environnement<br />Claude qui génère<br />+25{"\u00a0"}000€/mois.
        </h1>

        {/* Vehicle */}
        <VehicleTag />

        {/* Sous-titre */}
        <p className="mb-8 max-w-[500px] text-[16px] leading-[1.65] text-muted-foreground">
          Skills, sub-agents, mémoire projet, connecteurs outils, commandes avancées — le setup complet pour passer de "j'utilise Claude" à "je construis des business avec". <strong className="font-bold text-foreground">Opérationnel en une journée.</strong>
        </p>

        {/* CTA + barre */}
        <div className="flex flex-col items-center gap-2 mb-8 w-full">
          <a href="#tarif" onClick={onCTA} className="cta-rainbow flex items-center gap-2 rounded-[10px] bg-foreground px-7 py-3.5 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 no-underline">
            Accéder au setup — 47€ →
          </a>
          <p className="text-[12px] text-muted-foreground/60">Valeur réelle : 1 235€ · Paiement unique · Accès à vie</p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {["Débutant ou avancé en IA", "Installé en une journée", "Mises à jour en continu"].map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3.5 py-1.5 text-[12px] font-medium text-muted-foreground"
            >
              <Check className="h-3 w-3 text-green-500 shrink-0" strokeWidth={2.5} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── MARQUEE ─────────────────────────────────────────────────────────────────

function Marquee() {
  // Triple the items so at least one full set is always visible during the loop
  const tripled = [...tools, ...tools, ...tools]
  return (
    <section className="overflow-hidden border-y border-border bg-background py-10">
      <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.11em] text-muted-foreground/60 px-6 sm:px-0">
        Les outils du setup — tous intégrés dans le programme
      </p>
      <div className="overflow-hidden">
        {/* Translates -33.333% = exactly one set, then snaps back seamlessly */}
        <div
          className="marquee-track flex items-center gap-10"
          style={{
            width: "max-content",
            animation: "marquee-scroll-third 28s linear infinite",
          }}
        >
          {tripled.map(({ label, Icon }, i) => (
            <Icon
              key={i}
              aria-label={label}
              className="h-7 w-7 shrink-0 text-foreground/30 hover:text-foreground/60 transition-colors"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── STATS ───────────────────────────────────────────────────────────────────

function Stats() {
  return (
    <section className="mx-auto max-w-[1100px] px-6 py-20">
      <div
        className="grid grid-cols-1 sm:grid-cols-3 overflow-hidden rounded-2xl border border-border"
        style={{ background: "hsl(var(--border))", gap: "1px" }}
      >
        {[
          { num: "+25 000€/mois", desc: "Générés par Buildrs avec ce setup", sub: undefined as string | undefined },
          { num: "1 journée", desc: "Pour installer et configurer l'environnement complet", sub: undefined },
          { num: "+80", desc: "Builders ont adopté le setup Claude Buildrs", sub: undefined },
        ].map(({ num, desc, sub }) => (
          <div key={num} className="bg-background px-6 py-10 text-center">
            <div
              className="mb-2 leading-none text-foreground whitespace-nowrap"
              style={{ fontSize: "clamp(22px, 3.2vw, 38px)", fontWeight: 800, letterSpacing: "-0.04em" }}
            >
              {num}
            </div>
            <p className="text-[14px] leading-relaxed text-muted-foreground">{desc}</p>
            {sub && <p className="mt-0.5 text-[12px] font-semibold text-muted-foreground/50 uppercase tracking-widest">{sub}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── PAIN ────────────────────────────────────────────────────────────────────

function Pain() {
  return (
    <section className="bg-muted py-20">
      <div className="mx-auto max-w-[1100px] px-6">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Le constat</p>
        <h2 style={{ fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }} className="mb-4 text-foreground">
          Tout le monde parle de Claude.<br />Personne ne sait le monétiser.
        </h2>
        <p className="max-w-[540px] text-[17px] leading-[1.65] text-muted-foreground">
          La différence entre ceux qui génèrent 5 000€/mois avec Claude et ceux qui tweetent des screenshots de chatbot : un setup. Une architecture. Un système.
        </p>

        <div className="mt-11 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {pains.map(({ Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-7 transition-colors hover:border-muted-foreground/40">
              <div className="mb-3.5 flex h-9 w-9 items-center justify-center rounded-lg bg-background">
                <Icon className="h-[18px] w-[18px] text-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="mb-1.5 text-[15px] font-bold tracking-tight text-foreground">{title}</h3>
              <p className="text-[14px] leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 mb-2 text-center">
          <p
            className="mx-auto max-w-[560px] text-foreground"
            style={{ fontSize: "clamp(15px, 1.8vw, 20px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.3 }}
          >
            Ceux qui génèrent des revenus avec Claude n'utilisent pas le même Claude que toi. Ils ont un setup. Tu as un chatbot.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── SOLUTION ────────────────────────────────────────────────────────────────

function Solution() {
  const containerRef = useRef<HTMLDivElement>(null)
  const node1Ref = useRef<HTMLDivElement>(null)
  const node2Ref = useRef<HTMLDivElement>(null)
  const node3Ref = useRef<HTMLDivElement>(null)

  const inner = [
    { Icon: BrandIcons.supabase, delay: '0s' },
    { Icon: BrandIcons.vercel,   delay: '-5s' },
    { Icon: BrandIcons.github,   delay: '-10s' },
  ]
  const outer = [
    { Icon: BrandIcons.stripe,  delay: '0s' },
    { Icon: BrandIcons.resend,  delay: '-8s' },
    { Icon: BrandIcons.cloudflare, delay: '-16s' },
  ]

  return (
    <section className="relative py-24 bg-background overflow-hidden">
      <div className="mx-auto max-w-[1100px] px-6">

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
            La solution
          </p>
          <h2
            style={{ fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }}
            className="mb-5 text-foreground"
          >
            Un setup qui tourne.<br />Pas un cours théorique.
          </h2>
          <p className="mx-auto max-w-[540px] text-[17px] leading-[1.65] text-muted-foreground">
            Claude Buildrs, c'est un environnement de travail configuré — pas une liste de conseils. Tu sors avec un système opérationnel.
          </p>
        </div>

        {/* Orbit visual — exact LP1 code, larger */}
        <div className="relative mx-auto my-8 mb-14 flex items-center justify-center overflow-hidden" style={{ width: 'min(88vw, 480px)', height: 'min(88vw, 480px)' }}>
          {/* Rings */}
          <div className="absolute rounded-full border border-dashed" style={{ width: 230, height: 230, borderColor: 'hsl(var(--border))' }} />
          <div className="absolute rounded-full border border-dashed" style={{ width: 380, height: 380, borderColor: 'hsl(var(--border) / 0.4)' }} />

          {/* Center — Claude */}
          <div
            className="absolute z-10 flex items-center justify-center rounded-2xl border border-border bg-card"
            style={{ width: 72, height: 72, boxShadow: '0 0 32px rgba(204,93,232,0.25)' }}
          >
            <ClaudeIcon size={36} />
          </div>

          {/* Inner orbit */}
          {inner.map(({ Icon, delay }, i) => (
            <div
              key={i}
              className="absolute"
              style={{ animation: `orbit-inner-lg 12s linear ${delay} infinite` }}
            >
              <div className="flex items-center justify-center rounded-xl border border-border bg-card shadow-sm" style={{ width: 44, height: 44 }}>
                <Icon width={22} height={22} />
              </div>
            </div>
          ))}

          {/* Outer orbit */}
          {outer.map(({ Icon, delay }, i) => (
            <div
              key={i}
              className="absolute"
              style={{ animation: `orbit-outer-lg 20s linear ${delay} infinite` }}
            >
              <div className="flex items-center justify-center rounded-xl border border-border bg-card shadow-sm" style={{ width: 44, height: 44 }}>
                <Icon width={22} height={22} />
              </div>
            </div>
          ))}
        </div>

        {/* 3 ecosystem nodes with animated beams */}
        <div ref={containerRef} className="relative grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AnimatedBeam
            containerRef={containerRef} fromRef={node1Ref} toRef={node2Ref}
            gradientStartColor="#4d96ff" gradientStopColor="#cc5de8"
            pathColor="rgba(255,255,255,0.04)" pathOpacity={1} duration={3}
          />
          <AnimatedBeam
            containerRef={containerRef} fromRef={node2Ref} toRef={node3Ref}
            gradientStartColor="#cc5de8" gradientStopColor="#22c55e"
            pathColor="rgba(255,255,255,0.04)" pathOpacity={1} duration={3.5} delay={1.5}
          />

          {[
            {
              ref: node1Ref,
              icon: <ClaudeIcon size={20} />,
              title: "L'environnement configuré",
              desc: "CLAUDE.md, Skills, MCP, paramètres système. Une fois installé, ton Claude Buildrs tourne en mode expert permanent — même dans 6 mois.",
            },
            {
              ref: node2Ref,
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
              title: "Les workflows qui marchent",
              desc: "Les séquences exactes de Buildrs pour générer +25 000€/mois. Chaque workflow documenté, copiable, adaptable à ton projet.",
            },
            {
              ref: node3Ref,
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>,
              title: "Mis à jour en continu",
              desc: "L'IA évolue vite. Le setup évolue avec elle. Tu reçois automatiquement les mises à jour quand Claude sort de nouvelles fonctionnalités.",
            },
          ].map(({ ref, icon, title, desc }, i) => (
            <motion.div
              key={title}
              ref={ref}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-8 text-center hover:border-foreground/20 transition-colors"
            >
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background">
                <span className="text-foreground">{icon}</span>
              </div>
              <h3 className="mb-3 text-[18px] font-bold tracking-tight text-foreground" style={{ letterSpacing: "-0.03em" }}>{title}</h3>
              <p className="text-[14px] leading-relaxed text-muted-foreground">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── NOTRE SYSTÈME ───────────────────────────────────────────────────────────

function NotreSysteme() {
  return (
    <section className="py-24" style={{ background: "#050507" }}>
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mb-14">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em]" style={{ color: "#52525b" }}>
            Comment on travaille
          </p>
          <h2
            style={{ fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06, color: "#fafafa" }}
            className="mb-4"
          >
            Claude piloté comme<br />un vrai système.
          </h2>
          <p className="max-w-[520px] text-[16px] leading-[1.65]" style={{ color: "#71717a" }}>
            3 étapes. Un environnement opérationnel.<br />Reproductible sur chaque nouveau projet.
          </p>
        </div>

        <TerminalControlSectionAnimated />
      </div>
    </section>
  )
}

// ─── BEFORE / AFTER ──────────────────────────────────────────────────────────

function BeforeAfter() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">La transformation</p>
        <h2
          style={{ fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }}
          className="mb-14 text-foreground"
        >
          Passe de spectateur à builder.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card p-8">
            <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">Avant</p>
            <ul className="flex flex-col gap-4">
              {beforeItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-muted-foreground/40"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </span>
                  <span className="text-[15px] leading-[1.6] text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-foreground/10 bg-foreground p-8">
            <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.12em] text-background/40">Après</p>
            <ul className="flex flex-col gap-4">
              {afterItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-background/10">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-background"><path d="M20 6L9 17l-5-5"/></svg>
                  </span>
                  <span className="text-[15px] leading-[1.6] text-background/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── PROGRAMME ───────────────────────────────────────────────────────────────

function Programme() {
  return (
    <section id="modules" className="overflow-hidden py-24 bg-muted">
      <div className="mx-auto max-w-[1100px] px-6">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Le programme</p>
        <h2
          style={{ fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }}
          className="mb-4 text-foreground"
        >
          10 chapitres.<br />1 environnement expert.
        </h2>
        <p className="mb-12 md:mb-20 max-w-[500px] text-[15px] md:text-[17px] leading-[1.65] text-muted-foreground">
          De l'utilisation basique à l'orchestration de sub-agents parallèles. Chaque chapitre est un module actionnable — tu lis, tu configures, tu avances.
        </p>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-border hidden md:block" />
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border md:hidden" />

          <div className="flex flex-col gap-10 md:gap-16">
            {chapters.map(({ num, title, items, deliverable, accent }, i) => {
              const isLeft = i % 2 === 0
              return (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
                  className={`relative md:grid md:grid-cols-2 md:gap-8 md:items-center pl-14 md:pl-0 ${isLeft ? "" : "md:[&>*:first-child]:order-2"}`}
                >
                  <div className="rounded-2xl border border-border bg-card p-6 md:p-7 shadow-sm">
                    <div className="mb-3 flex items-center justify-end">
                      <span className="font-mono text-[11px] font-bold" style={{ color: accent }}>
                        Chapitre {num}
                      </span>
                    </div>
                    <h3 className="mb-3 text-[18px] md:text-[20px] font-bold tracking-tight text-foreground">{title}</h3>
                    <div
                      className="mb-4 rounded-lg px-3.5 py-2.5 text-[12px] font-semibold"
                      style={{ background: `${accent}12`, color: accent }}
                    >
                      {deliverable}
                    </div>
                    <ul className="flex flex-col gap-2.5">
                      {items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[13px] md:text-[14px] text-muted-foreground">
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`hidden md:flex items-center ${isLeft ? "justify-start pl-8" : "justify-end pr-8"}`}>
                    <div
                      className="absolute left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-foreground shadow-sm"
                      style={{ zIndex: 1 }}
                    >
                      <span className="font-mono text-[11px] font-bold text-background">{num}</span>
                    </div>
                    <div
                      className="select-none font-mono leading-none text-muted-foreground/[0.06]"
                      style={{ fontSize: 120, fontWeight: 800, letterSpacing: "-0.06em" }}
                    >
                      {num}
                    </div>
                  </div>

                  <div
                    className="absolute left-0 top-6 flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted bg-foreground shadow-sm md:hidden"
                    style={{ zIndex: 1 }}
                  >
                    <span className="font-mono text-[10px] font-bold text-background">{num}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Et demain ? */}
        <div className="mt-16 md:mt-24 rounded-2xl px-8 py-10 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-3" style={{ color: '#52525b' }}>Et demain ?</p>
          <h3
            className="mb-4"
            style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800, letterSpacing: '-0.035em', color: '#fafafa', lineHeight: 1.1 }}
          >
            Ton setup ne sera jamais obsolète.
          </h3>
          <p className="mx-auto max-w-[520px] text-[15px] leading-[1.7]" style={{ color: '#71717a' }}>
            Claude évolue. Les MCP évoluent. Les Skills évoluent. Chaque mise à jour du dashboard te notifie directement — dans Buildrs, Discord ou Telegram. Tu restes à l'état de l'art sans devoir surveiller quoi que ce soit.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {["Mises à jour en continu", "Notifié à chaque évolution", "Accès à vie"].map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-medium" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#a1a1aa' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

// ─── DASHBOARD SECTION ───────────────────────────────────────────────────────

type DashTab = 'setup' | 'skills' | 'mcp' | 'workflows'

function DashboardSection() {
  const [activeTab, setActiveTab] = useState<DashTab>('setup')

  const tabs: { id: DashTab; label: string }[] = [
    { id: 'setup',     label: 'Mon Setup' },
    { id: 'skills',    label: 'Mes Skills' },
    { id: 'mcp',       label: 'MCP Servers' },
    { id: 'workflows', label: 'Workflows' },
  ]

  return (
    <section id="contenu" className="relative py-24 overflow-hidden bg-background">
      <div className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--muted-foreground) / 0.12) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="text-center mb-14">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Le produit</p>
          <h2 style={{ fontSize: 'clamp(30px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.06 }} className="mb-4 text-foreground">
            Pas un PDF. Pas un tuto.<br />Un environnement complet.
          </h2>
          <p className="mx-auto max-w-[500px] text-[17px] leading-[1.65] text-muted-foreground">
            Tout le setup, les configs, les Skills et les MCP — dans un seul endroit. Tu ouvres, tu suis, tu configures.
          </p>
        </div>

        {/* Browser mockup */}
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: '1px solid rgba(255,255,255,0.07)', background: '#08080a' }}>
          {/* Chrome bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)', background: '#060608' }}>
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full" style={{ background: '#ef4444' }} />
              <div className="h-3 w-3 rounded-full" style={{ background: '#eab308' }} />
              <div className="h-3 w-3 rounded-full" style={{ background: '#22c55e' }} />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="rounded-md px-4 py-1 text-[11px]" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}>
                app.buildrs.fr/claude
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#22c55e' }} />
              <span className="text-[9px] font-bold" style={{ color: '#22c55e' }}>CLAUDE ACTIF</span>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex border-b overflow-x-auto" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-shrink-0 px-5 py-3 text-[12px] font-semibold transition-colors whitespace-nowrap"
                style={{
                  color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.35)',
                  borderBottom: activeTab === tab.id ? '2px solid rgba(255,255,255,0.8)' : '2px solid transparent',
                  background: 'transparent',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-6" style={{ minHeight: 320 }}>

            {/* Mon Setup */}
            {activeTab === 'setup' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Configuration Claude Buildrs</p>
                  <div className="space-y-2">
                    {[
                      { label: 'CLAUDE.md créé et configuré', done: true },
                      { label: 'Mémoire projet activée', done: true },
                      { label: 'Fenêtre de contexte optimisée', done: true },
                      { label: 'Température et style calibrés', done: true },
                      { label: 'Skills Buildrs installés', done: true },
                      { label: 'MCP Context7 connecté', done: false },
                      { label: 'MCP Supabase configuré', done: false },
                    ].map(({ label, done }) => (
                      <div key={label} className="flex items-center gap-3 rounded-lg px-3 py-2.5" style={{ background: done ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${done ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)'}` }}>
                        <div className="flex-shrink-0 h-4 w-4 rounded flex items-center justify-center" style={{ background: done ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)', border: `1px solid ${done ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.1)'}` }}>
                          {done && <Check size={9} strokeWidth={2.5} style={{ color: '#22c55e' }} />}
                        </div>
                        <span className="text-[12px]" style={{ color: done ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)' }}>{label}</span>
                        {done && <span className="ml-auto text-[8px] font-bold" style={{ color: '#22c55e' }}>OK</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Statut du système</p>
                  <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <ClaudeIcon size={16} />
                      <span className="text-[11px] font-bold text-white">Claude Sonnet 4.6</span>
                      <span className="ml-auto text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>CONNECTÉ</span>
                    </div>
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Mode expert permanent activé via CLAUDE.md</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { k: 'Skills actifs', v: '12 / 12' },
                      { k: 'MCPs connectés', v: '3 / 5' },
                      { k: 'Mémoire projet', v: '48 fichiers' },
                      { k: 'Tokens contexte', v: '200K optimisé' },
                    ].map(({ k, v }) => (
                      <div key={k} className="flex justify-between items-center text-[11px] rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>{k}</span>
                        <span className="font-semibold text-white">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mes Skills */}
            {activeTab === 'skills' && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Skills installés — Claude Buildrs</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: 'brainstorming', desc: 'Idéation et exploration de marché', color: '#4d96ff' },
                    { name: 'writing-plans', desc: 'Planification technique structurée', color: '#4d96ff' },
                    { name: 'executing-plans', desc: "Exécution pas à pas d'un plan", color: '#22c55e' },
                    { name: 'code-reviewer', desc: 'Revue de code et détection de bugs', color: '#22c55e' },
                    { name: 'code-architect', desc: "Architecture d'un SaaS complet", color: '#f97316' },
                    { name: 'code-explorer', desc: 'Navigation et compréhension de codebase', color: '#f97316' },
                    { name: 'debugging', desc: 'Résolution de bugs step by step', color: '#cc5de8' },
                    { name: 'react-best-practices', desc: 'Standards React / TypeScript / UI', color: '#cc5de8' },
                  ].map(({ name, desc, color }) => (
                    <div key={name} className="flex items-start gap-3 rounded-lg px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="flex-shrink-0 mt-0.5 h-2 w-2 rounded-full" style={{ background: color }} />
                      <div>
                        <p className="text-[11px] font-mono font-bold" style={{ color: 'rgba(255,255,255,0.85)' }}>{name}</p>
                        <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{desc}</p>
                      </div>
                      <span className="ml-auto text-[8px] font-bold flex-shrink-0" style={{ color: '#22c55e' }}>ACTIF</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MCP Servers */}
            {activeTab === 'mcp' && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Connecteurs MCP — Outils branchés à Claude</p>
                <div className="space-y-3">
                  {[
                    { name: 'Context7', desc: 'Documentation en temps réel — React, Supabase, Stripe, n8n', icon: BrandIcons.vercel, status: 'Connecté', ok: true },
                    { name: 'Supabase MCP', desc: 'Accès direct à la BDD, tables, migrations, RLS', icon: BrandIcons.supabase, status: 'Connecté', ok: true },
                    { name: 'GitHub MCP', desc: 'Lecture de repos, PRs, fichiers, branches', icon: BrandIcons.github, status: 'Connecté', ok: true },
                    { name: 'Stripe MCP', desc: 'Clients, paiements, abonnements — lecture seule', icon: BrandIcons.stripe, status: 'À configurer', ok: false },
                    { name: 'Resend MCP', desc: "Gestion des emails, templates, domaines d'envoi", icon: BrandIcons.resend, status: 'À configurer', ok: false },
                  ].map(({ name, desc, icon: Icon, status, ok }) => (
                    <div key={name} className="flex items-center gap-4 rounded-xl px-4 py-3" style={{ background: ok ? 'rgba(34,197,94,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${ok ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)'}` }}>
                      <div className="flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <Icon width={16} height={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-white">{name}</p>
                        <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{desc}</p>
                      </div>
                      <span className="text-[9px] font-bold flex-shrink-0 px-2 py-0.5 rounded" style={{ background: ok ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)', color: ok ? '#22c55e' : 'rgba(255,255,255,0.3)', border: `1px solid ${ok ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}` }}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Workflows */}
            {activeTab === 'workflows' && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Workflows Buildrs — Prêts à copier</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: 'Lancer un SaaS IA', steps: '8 étapes', tag: 'Builder', color: '#4d96ff' },
                    { name: 'Débugger en production', steps: '5 étapes', tag: 'Debug', color: '#ef4444' },
                    { name: 'Rédiger une landing page', steps: '6 étapes', tag: 'Copy', color: '#f97316' },
                    { name: 'Architecture BDD Supabase', steps: '4 étapes', tag: 'Backend', color: '#22c55e' },
                    { name: 'Setup Claude Code', steps: '3 étapes', tag: 'Config', color: '#cc5de8' },
                    { name: 'Créer un agent autonome', steps: '7 étapes', tag: 'Agents', color: '#14b8a6' },
                  ].map(({ name, steps, tag, color }) => (
                    <div key={name} className="flex items-center gap-3 rounded-lg px-3 py-3 cursor-pointer hover:opacity-80 transition-opacity" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="flex-shrink-0 h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-white truncate">{name}</p>
                        <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{steps}</p>
                      </div>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  )
}

// ─── QUI EST BUILDRS ─────────────────────────────────────────────────────────

const SPECIALIST_AGENTS = [
  {
    name: 'Validator',
    role: 'Trouver & Valider',
    color: '#22c55e',
    Robot: () => (
      <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="0" width="2" height="4" fill="#4ade80"/><rect x="18" y="0" width="2" height="4" fill="#4ade80"/>
        <rect x="3" y="0" width="4" height="2" fill="#22c55e"/><rect x="17" y="0" width="4" height="2" fill="#22c55e"/>
        <rect x="3" y="4" width="18" height="12" rx="2" fill="#22c55e"/>
        <rect x="6" y="7" width="4" height="3" rx="1" fill="#dcfce7"/><rect x="14" y="7" width="4" height="3" rx="1" fill="#dcfce7"/>
        <rect x="8" y="8" width="2" height="2" fill="#14532d"/><rect x="16" y="8" width="2" height="2" fill="#14532d"/>
        <rect x="8" y="12" width="2" height="2" fill="#15803d"/><rect x="10" y="13" width="4" height="2" fill="#15803d"/><rect x="14" y="12" width="2" height="2" fill="#15803d"/>
        <rect x="5" y="17" width="4" height="5" rx="1" fill="#15803d"/><rect x="15" y="17" width="4" height="5" rx="1" fill="#15803d"/>
      </svg>
    ),
  },
  {
    name: 'Planner',
    role: 'Préparer & Structurer',
    color: '#3b82f6',
    Robot: () => (
      <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="0" width="4" height="2" fill="#93c5fd"/><rect x="11" y="1" width="2" height="4" fill="#60a5fa"/>
        <rect x="3" y="4" width="18" height="12" rx="2" fill="#3b82f6"/>
        <rect x="5" y="6" width="14" height="5" rx="1" fill="#1e3a5f"/>
        <rect x="6" y="7" width="4" height="3" fill="#bfdbfe"/><rect x="14" y="7" width="4" height="3" fill="#bfdbfe"/>
        <rect x="8" y="13" width="8" height="2" rx="1" fill="#1d4ed8"/>
        <rect x="5" y="17" width="4" height="5" rx="1" fill="#1d4ed8"/><rect x="15" y="17" width="4" height="5" rx="1" fill="#1d4ed8"/>
        <rect x="1" y="6" width="3" height="6" rx="1" fill="#1d4ed8"/><rect x="20" y="6" width="3" height="6" rx="1" fill="#1d4ed8"/>
      </svg>
    ),
  },
  {
    name: 'Designer',
    role: 'Branding & Identité',
    color: '#f43f5e',
    Robot: () => (
      <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="11" y="1" width="2" height="4" fill="#fb7185"/><rect x="9" y="0" width="2" height="2" fill="#fda4af"/><rect x="13" y="0" width="2" height="2" fill="#fda4af"/>
        <rect x="3" y="4" width="18" height="12" rx="2" fill="#f43f5e"/>
        <circle cx="9" cy="9" r="3" fill="#ffe4e6"/><circle cx="15" cy="9" r="3" fill="#ffe4e6"/>
        <circle cx="9" cy="9" r="1.5" fill="#881337"/><circle cx="15" cy="9" r="1.5" fill="#881337"/>
        <rect x="8" y="13" width="8" height="2" rx="1" fill="#9f1239"/>
        <rect x="1" y="7" width="3" height="4" rx="1" fill="#e11d48"/><rect x="20" y="7" width="3" height="4" rx="1" fill="#e11d48"/>
        <rect x="5" y="17" width="4" height="5" rx="1" fill="#be123c"/><rect x="15" y="17" width="4" height="5" rx="1" fill="#be123c"/>
      </svg>
    ),
  },
  {
    name: 'Architect',
    role: 'Architecture technique',
    color: '#f97316',
    Robot: () => (
      <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="7" y="0" width="2" height="4" fill="#fdba74"/><rect x="11" y="0" width="2" height="3" fill="#fb923c"/><rect x="15" y="0" width="2" height="4" fill="#fdba74"/>
        <rect x="3" y="4" width="18" height="12" rx="2" fill="#f97316"/>
        <rect x="5" y="7" width="5" height="4" rx="1" fill="#fff7ed"/><rect x="14" y="7" width="5" height="4" rx="1" fill="#fff7ed"/>
        <rect x="7" y="8" width="2" height="2" fill="#7c2d12"/><rect x="16" y="8" width="2" height="2" fill="#7c2d12"/>
        <rect x="7" y="13" width="10" height="2" fill="#c2410c"/>
        <rect x="1" y="5" width="3" height="8" rx="1" fill="#c2410c"/><rect x="20" y="5" width="3" height="8" rx="1" fill="#c2410c"/>
        <rect x="5" y="17" width="5" height="5" rx="1" fill="#c2410c"/><rect x="14" y="17" width="5" height="5" rx="1" fill="#c2410c"/>
      </svg>
    ),
  },
  {
    name: 'Builder',
    role: 'Construire ton produit',
    color: '#8b5cf6',
    Robot: () => (
      <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="11" y="0" width="2" height="5" fill="#a78bfa"/><rect x="9" y="1" width="6" height="2" fill="#8b5cf6"/>
        <rect x="3" y="4" width="18" height="12" rx="2" fill="#8b5cf6"/>
        <line x1="6" y1="7" x2="10" y2="11" stroke="#ede9fe" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="10" y1="7" x2="6" y2="11" stroke="#ede9fe" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="14" y1="7" x2="18" y2="11" stroke="#ede9fe" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="18" y1="7" x2="14" y2="11" stroke="#ede9fe" strokeWidth="1.8" strokeLinecap="round"/>
        <rect x="1" y="6" width="3" height="6" rx="1" fill="#7c3aed"/><rect x="20" y="6" width="3" height="6" rx="1" fill="#7c3aed"/>
        <rect x="5" y="17" width="4" height="5" rx="1" fill="#6d28d9"/><rect x="15" y="17" width="4" height="5" rx="1" fill="#6d28d9"/>
      </svg>
    ),
  },
  {
    name: 'Launcher',
    role: 'Déployer & Lancer',
    color: '#14b8a6',
    Robot: () => (
      <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <polygon points="12,0 14,3 10,3" fill="#5eead4"/><rect x="11" y="2" width="2" height="3" fill="#2dd4bf"/>
        <rect x="3" y="4" width="18" height="12" rx="2" fill="#14b8a6"/>
        <polygon points="8,9 10,7 12,9 10,11" fill="#ccfbf1"/><polygon points="12,9 14,7 16,9 14,11" fill="#ccfbf1"/>
        <circle cx="10" cy="9" r="1" fill="#134e4a"/><circle cx="14" cy="9" r="1" fill="#134e4a"/>
        <rect x="8" y="13" width="8" height="2" rx="1" fill="#0d9488"/>
        <rect x="1" y="6" width="3" height="7" rx="1" fill="#0f766e"/><rect x="20" y="6" width="3" height="7" rx="1" fill="#0f766e"/>
        <rect x="5" y="17" width="4" height="4" rx="1" fill="#0f766e"/><rect x="15" y="17" width="4" height="4" rx="1" fill="#0f766e"/>
      </svg>
    ),
  },
]

function WhoIsBuildrs() {
  return (
    <section style={{ background: '#050507', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="py-20">
      <div className="mx-auto max-w-[1100px] px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.28)' }}>Qui est Buildrs</p>
          <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 52px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.1, color: '#fff' }}>
            40+ agents IA.<br />3 humains.<br />Un seul moteur.
          </h2>
          <p className="mt-5 mx-auto max-w-[480px] text-[15px] leading-[1.75]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Buildrs fonctionne exactement comme le produit qu'on t'enseigne — des agents IA qui exécutent, des humains qui décident. Claude comme seul moteur.
          </p>
        </div>

        {/* ── AGENTS IA ── */}
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: 'rgba(255,255,255,0.22)' }}>Agents IA</p>

        {/* Jarvis — featured full width */}
        <div className="rounded-2xl mb-4 p-5" style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.22)' }}>
          <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(99,102,241,0.3)' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="7" y="0" width="2" height="3" fill="#818cf8"/><rect x="15" y="0" width="2" height="3" fill="#818cf8"/>
                <rect x="5" y="2" width="2" height="2" fill="#818cf8"/><rect x="17" y="2" width="2" height="2" fill="#818cf8"/>
                <rect x="3" y="4" width="18" height="12" rx="2" fill="#6366f1"/>
                <rect x="6" y="7" width="4" height="4" rx="1" fill="#c7d2fe"/><rect x="14" y="7" width="4" height="4" rx="1" fill="#c7d2fe"/>
                <rect x="7" y="8" width="2" height="2" fill="#312e81"/><rect x="15" y="8" width="2" height="2" fill="#312e81"/>
                <rect x="9" y="13" width="6" height="2" rx="1" fill="#4338ca"/>
                <rect x="5" y="17" width="4" height="4" rx="1" fill="#4338ca"/><rect x="15" y="17" width="4" height="4" rx="1" fill="#4338ca"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="text-[14px] font-bold" style={{ color: '#fff' }}>Jarvis</p>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.35)' }}>COO IA · BRAS DROIT DE BUILDRS</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>ACTIF 24/7</span>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Bras droit d'Alfred. Orchestre les 40+ agents spécialisés de Buildrs. Chaque tâche, chaque livrable, chaque décision technique passe par Jarvis avant d'arriver à l'équipe humaine. C'est lui qui coordonne. Les humains valident.
              </p>
            </div>
            <div className="text-right flex-shrink-0 hidden sm:block">
              <p className="font-mono font-extrabold" style={{ fontSize: 32, color: '#fff', letterSpacing: '-0.03em' }}>40+</p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.28)' }}>agents coordonnés</p>
            </div>
          </div>
        </div>

        {/* 6 specialist agents grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
          {SPECIALIST_AGENTS.map(({ name, role, color, Robot }) => (
            <div key={name} className="rounded-xl p-4 flex items-start gap-3"
              style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex-shrink-0 h-9 w-9 rounded-lg flex items-center justify-center"
                style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                <Robot />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold truncate" style={{ color: '#fff' }}>{name}</p>
                <p className="text-[10px] leading-snug" style={{ color: 'rgba(255,255,255,0.35)' }}>{role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── HUMAINS ── */}
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: 'rgba(255,255,255,0.22)' }}>L'équipe humaine</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              photo: '/Alfred_opt.jpg',
              name: 'Alfred',
              role: 'CEO · Fondateur',
              bio: "A construit +40 produits avec Claude. L'environnement que tu vas installer, c'est le sien. +25K€/mois de revenus récurrents avec ce setup exact.",
            },
            {
              photo: '/Chris_opt.jpg',
              name: 'Chris',
              role: 'Coach Projet',
              bio: "Accompagne les clients Sprint et Cohorte. A lancé ses propres SaaS avant de rejoindre Buildrs. Disponible sur WhatsApp pour t'aider à débloquer.",
            },
            {
              photo: '/Tim_opt.jpg',
              name: 'Tim',
              role: 'Vibecoder Agentic',
              bio: "Construit les MVPs clients. Passé par la Cohorte Buildrs, recruté après son premier SaaS. La preuve que la méthode fonctionne.",
            },
          ].map(({ photo, name, role, bio }) => (
            <div key={name} className="rounded-xl p-5" style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.025)' }}>
              <div className="h-10 w-10 rounded-full overflow-hidden mb-4 flex-shrink-0" style={{ border: '2px solid rgba(255,255,255,0.15)' }}>
                <img src={photo} alt={name} className="w-full h-full object-cover object-top" />
              </div>
              <p className="text-[14px] font-bold mb-0.5" style={{ color: '#fff' }}>{name}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] mb-3" style={{ color: 'rgba(255,255,255,0.28)' }}>{role}</p>
              <p className="text-[12px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.45)' }}>{bio}</p>
            </div>
          ))}
        </div>

        {/* Bottom statement */}
        <p className="text-center text-[13px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
          Ce que tu vas apprendre ici, c'est exactement comment Buildrs tourne au quotidien. Le même système. Ouvert au public.
        </p>

      </div>
    </section>
  )
}

// ─── PRICING ─────────────────────────────────────────────────────────────────

function Pricing({ onCTA }: { onCTA?: (e: React.MouseEvent) => void }) {
  return (
    <section id="tarif" className="bg-background py-24 text-center">
      <div className="mx-auto max-w-[1100px] px-6">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Tarif</p>
        <h2 style={{ fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }} className="mb-4 text-foreground">
          Ce que tu reçois
        </h2>
        <p className="mx-auto max-w-[560px] text-[17px] leading-[1.65] text-muted-foreground">
          Un seul client sur ton SaaS et le setup est rentabilisé 100 fois. Un seul paiement. Un accès à vie.
        </p>

        <div className="bump-neon relative mx-auto mt-12 max-w-[540px]" style={{ borderRadius: 22 }}>
          <div className="bump-inner p-6 sm:p-10 text-left" style={{ borderRadius: 20 }}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Claude Buildrs</p>
              <span
                className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold"
                style={{ background: "hsl(var(--foreground))", color: "hsl(var(--background))" }}
              >
                <Flame size={12} strokeWidth={1.5} />
                Offre de lancement
              </span>
            </div>

            <div className="mb-1 flex items-baseline gap-2">
              <span className="text-[18px] font-medium text-muted-foreground/50 line-through">97€</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[22px] font-semibold text-muted-foreground">€</span>
                <span style={{ fontSize: 64, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }} className="text-foreground">47</span>
              </div>
            </div>
            <p className="mb-7 text-[14px] text-muted-foreground">Paiement unique · Accès à vie · Mises à jour incluses</p>

            <hr className="mb-7 border-border" />

            <ul className="mb-4 flex flex-col gap-[10px] text-[14px]">
              {features.map(({ text, value }) => {
                const dashIdx = text.indexOf(' — ')
                let content: React.ReactNode
                if (dashIdx !== -1) {
                  const title = text.slice(0, dashIdx)
                  const desc = text.slice(dashIdx + 3)
                  content = <span className="text-muted-foreground"><span className="font-bold text-foreground">{title}</span> — {desc}</span>
                } else {
                  content = <span className="font-bold text-foreground">{text}</span>
                }
                return (
                  <li key={text} className="flex items-start justify-between gap-2.5">
                    <span className="flex items-start gap-2.5">
                      <Check size={15} strokeWidth={2} className="mt-[1px] shrink-0 text-foreground" />
                      {content}
                    </span>
                    <span className="shrink-0 text-[11px] font-medium text-muted-foreground/50 tabular-nums line-through">
                      {value}
                    </span>
                  </li>
                )
              })}
            </ul>

            <div className="mb-7 flex items-center justify-between rounded-lg bg-secondary px-3.5 py-2.5">
              <span className="text-[13px] font-bold text-foreground">Valeur totale</span>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-muted-foreground/50 line-through">1 229€</span>
                <span className="text-[13px] font-bold text-foreground">47€ aujourd'hui</span>
              </div>
            </div>

            <div className="mb-7 rounded-xl border border-dashed border-border bg-muted px-4 py-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">Bonus inclus pour les 200 premiers</p>
              <ul className="flex flex-col gap-[10px]">
                {bonuses.map(({ text, value }) => {
                  const dashIdx = text.indexOf(' — ')
                  const name = dashIdx !== -1 ? text.slice(0, dashIdx) : text
                  const desc = dashIdx !== -1 ? text.slice(dashIdx + 3) : null
                  return (
                    <li key={text} className="flex items-start justify-between gap-2.5 text-[14px]">
                      <span className="flex items-start gap-2.5">
                        <Zap size={14} strokeWidth={1.5} className="mt-[2px] shrink-0 text-foreground" />
                        <span className="text-muted-foreground">
                          <span className="font-bold text-foreground">{name}</span>
                          {desc && <> — {desc}</>}
                        </span>
                      </span>
                      <span className="shrink-0 text-[11px] font-medium text-muted-foreground/50 tabular-nums line-through">
                        {value}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>

            <a
              href="#"
              onClick={onCTA}
              className="cta-rainbow relative flex w-full items-center justify-center gap-2 rounded-[10px] bg-foreground py-3.5 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 no-underline"
            >
              Accéder au setup Claude Buildrs — 47€ →
            </a>

            <p className="mt-3 text-center text-[12px] font-medium text-muted-foreground">
              Satisfait ou remboursé 30 jours — sans condition.
            </p>

            <p className="mt-2 text-center text-[12px] text-muted-foreground/60">
              Paiement sécurisé par Stripe · Accès immédiat · Aucun abonnement
            </p>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold">
                <span className="text-muted-foreground">{BONUS_COUNT}/{BONUS_TOTAL} places réclamées</span>
                <span className="text-muted-foreground/60">Ensuite 97€</span>
              </div>
              <div className="h-[5px] w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-foreground transition-all duration-700"
                  style={{ width: `${Math.round((BONUS_COUNT / BONUS_TOTAL) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="faq" className="py-24" style={{ background: '#050507' }}>
      <div className="mx-auto max-w-[1100px] px-6">
        <p className="mb-3 text-center text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">FAQ</p>
        <h2 style={{ fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }} className="mb-12 text-center text-foreground">
          Tes questions.<br />Nos réponses.
        </h2>

        <div className="mx-auto max-w-[680px] overflow-hidden rounded-2xl border border-border">
          {faqs.map(({ q, a }, i) => (
            <div
              key={i}
              className={`cursor-pointer border-b border-border px-6 py-5 transition-colors last:border-b-0 hover:bg-accent ${open === i ? "bg-accent" : ""}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="flex items-center justify-between gap-3 select-none">
                <span className="text-[15px] font-semibold text-foreground">{q}</span>
                <span
                  className="shrink-0 text-muted-foreground transition-transform duration-200"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                </span>
              </div>
              {open === i && (
                <p className="mt-3 text-[14px] leading-[1.7] text-muted-foreground">{a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── OBJECTION KILLER ────────────────────────────────────────────────────────

function ObjectionKiller({ onCTA }: { onCTA?: (e: React.MouseEvent) => void }) {
  const [phase, setPhase] = useState<'input' | 'buttons' | 'response'>('input')
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-[680px] px-6 text-center">
        <h2
          style={{ fontSize: "clamp(26px, 4vw, 46px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.1 }}
          className="mb-10 text-foreground"
        >
          Donne-moi 1 bonne raison de ne pas installer ce setup.
        </h2>

        {phase === 'input' && (
          <div
            onClick={() => setPhase('buttons')}
            className="cursor-text mx-auto max-w-[520px] rounded-2xl border border-border bg-muted px-5 py-4 flex items-center gap-3 hover:border-foreground/30 transition-colors"
          >
            <span className="text-[14px] text-muted-foreground/50 flex-1 text-left">Tape ta raison...</span>
            <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-foreground/10">
              <ChevronRight size={14} strokeWidth={2} className="text-muted-foreground" />
            </div>
          </div>
        )}

        {phase === 'buttons' && (
          <div className="flex flex-col gap-2 mx-auto max-w-[520px]">
            {OBJECTIONS.map((obj, i) => (
              <button
                key={i}
                onClick={() => { setActiveIdx(i); setPhase('response') }}
                className="rounded-xl border border-border bg-muted px-5 py-3.5 text-[14px] font-medium text-foreground text-left hover:border-foreground/30 hover:bg-secondary transition-all"
              >
                {obj.label}
              </button>
            ))}
          </div>
        )}

        {phase === 'response' && activeIdx !== null && (
          <div className="mx-auto max-w-[520px]">
            <div className="rounded-2xl border border-border bg-muted px-6 py-5 mb-5 text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60 mb-2">
                {OBJECTIONS[activeIdx].label}
              </p>
              <p className="text-[15px] leading-[1.7] text-foreground">
                {OBJECTIONS[activeIdx].response}
              </p>
            </div>
            <a
              href="#tarif"
              onClick={onCTA}
              className="cta-rainbow mb-4 flex w-full items-center justify-center gap-2 rounded-[10px] bg-foreground py-3.5 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 no-underline"
            >
              Accéder au setup — 47€ →
            </a>
            <button
              onClick={() => { setPhase('buttons'); setActiveIdx(null) }}
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              Choisir une autre raison
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

// ─── FINAL CTA ───────────────────────────────────────────────────────────────

function FinalCTA({ onCTA }: { onCTA?: (e: React.MouseEvent) => void }) {
  return (
    <section className="relative overflow-hidden px-6 py-20 sm:py-[120px] text-center" style={{ background: '#050507' }}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(204,93,232,0.06) 0%, transparent 70%)" }}
      />
      <h2
        className="mx-auto mb-[18px] max-w-[680px] text-foreground"
        style={{ fontSize: "clamp(28px, 6vw, 70px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05 }}
      >
        Arrête de regarder Claude évoluer sans toi.
      </h2>
      <p className="mx-auto mb-9 max-w-[480px] text-[17px] leading-[1.65] text-muted-foreground">
        Chaque jour sans le bon setup, c'est un jour où quelqu'un d'autre prend ta place. Installe l'environnement. Commence à builder.
      </p>
      <a href="#tarif" onClick={onCTA} className="cta-rainbow inline-flex items-center gap-2 rounded-[10px] bg-foreground px-8 py-4 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 no-underline">
        Commencer maintenant — 47€ (au lieu de 97€) →
      </a>
      <p className="mt-3 text-[12px] text-muted-foreground/60">
        Valeur réelle : 1 235€ · Paiement unique · Accès à vie
      </p>
      <div className="mx-auto mt-5 max-w-[320px]">
        <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold">
          <span className="text-muted-foreground">{BONUS_COUNT}/{BONUS_TOTAL} places réclamées</span>
          <span className="text-muted-foreground/60">Ensuite 97€</span>
        </div>
        <div className="h-[5px] w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-foreground transition-all duration-700"
            style={{ width: `${Math.round((BONUS_COUNT / BONUS_TOTAL) * 100)}%` }}
          />
        </div>
      </div>
    </section>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export function ClaudeLandingPage({ onCTAClick }: { onCTAClick?: () => void }) {
  const go = (e: React.MouseEvent) => { e.preventDefault(); onCTAClick?.() }

  useEffect(() => {
    const title = "Buildrs — L'environnement Claude qui génère +25 000€/mois"
    const desc = "Skills, MCP, CLAUDE.md, sub-agents. Le setup complet de Buildrs. Opérationnel en une journée. 47€."
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', desc)
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title)
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', desc)
  }, [])

  return (
    <>
      <Nav onCTA={go} />
      <main>
        <Hero onCTA={go} />
        <Marquee />
        <Stats />
        <Pain />
        <Solution />
        <NotreSysteme />
        <BeforeAfter />
        <Programme />
        <DashboardSection />
        <WhoIsBuildrs />
        <Pricing onCTA={go} />
        <FAQ />
        <FinalCTA onCTA={go} />
      </main>
      <StackedCircularFooter />
    </>
  )
}
