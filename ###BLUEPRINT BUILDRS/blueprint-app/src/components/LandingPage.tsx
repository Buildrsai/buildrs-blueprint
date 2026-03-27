import { useState, useEffect } from "react"
import { Clock, Banknote, Layers, Bot, Zap, Check, Flame, Globe, TrendingUp, Copy, ArrowLeftRight, BookOpen, Lightbulb, CheckSquare, Wrench } from "lucide-react"
import { StackedCircularFooter } from "./ui/stacked-circular-footer"
import { BuildrsIcon, BrandIcons } from "./ui/icons"

import { DashboardPreview } from "./ui/dashboard-preview"
import { OrbitalClaude } from "./ui/orbital-claude"
import { WordRotate } from "./ui/word-rotate"
import { SaasMarquee } from "./ui/saas-marquee"
import { DottedSurface } from "./ui/dotted-surface"
import { BGPattern } from "./ui/bg-pattern"

// ── Countdown to launch end ───────────────────────────────────────────────────
const LAUNCH_END = new Date('2026-04-01T23:59:59')

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

function ScarcityCountdown({ className }: { className?: string }) {
  const { d, h, m, s } = useCountdown(LAUNCH_END)
  return (
    <span className={className}>
      <span className="hidden sm:inline">Offre de lancement — se termine dans </span>
      <span className="sm:hidden">Fin dans </span>
      <span className="font-bold tabular-nums">{d}j {h}h {m}m {String(s).padStart(2, '0')}s</span>
    </span>
  )
}

// ─── DATA ───────────────────────────────────────────────────────────────────

const tools: { label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { label: "Claude AI",        Icon: BrandIcons.claude },
  { label: "Mobbin",           Icon: BrandIcons.mobbin },
  { label: "Stitch",           Icon: BrandIcons.stitch },
  { label: "21st.dev",         Icon: BrandIcons.twentyOneDev },
  { label: "VS Code",          Icon: BrandIcons.vscode },
  { label: "Supabase",         Icon: BrandIcons.supabase },
  { label: "Vercel",           Icon: BrandIcons.vercel },
  { label: "Resend",           Icon: BrandIcons.resend },
  { label: "Stripe",           Icon: BrandIcons.stripe },
  { label: "Hostinger",        Icon: BrandIcons.hostinger },
  { label: "GitHub",           Icon: BrandIcons.github },
  { label: "Google AI Studio", Icon: BrandIcons.googleAIStudio },
  { label: "Kling AI",         Icon: BrandIcons.klingAI },
]

const stats = [
  { num: "6 jours", desc: "Plan d'action complet, de l'idée au premier produit live" },
  { num: "3 000€/mois", desc: "L'objectif minimum atteignable dans les 90 prochains jours en suivant la méthode" },
  { num: "+80", desc: "Builders ont déjà lancé leur produit avec Blueprint" },
]

const pains = [
  {
    Icon: Clock,
    title: "Tu scrolles depuis des mois sans rien lancer",
    desc: "Tout le monde s'improvise expert en IA. Tu vois passer 10 000 projets, tu notes, tu enregistres, tu likes. Mais tu ne lances rien. Perdu dans le trop-plein d'informations.",
  },
  {
    Icon: Banknote,
    title: "Les formations coûtent une fortune pour rien",
    desc: "997€ pour apprendre la théorie. Et dans quelques mois, avec les nouvelles IA qui sortent, tout ce que tu as appris sera déjà obsolète. Tu paies pour du périmé.",
  },
  {
    Icon: Layers,
    title: "Trop d'outils, zéro direction",
    desc: "GPT, Gemini, Bolt, Replit, Cursor, Lovable, Make... Tu ne sais plus lequel utiliser ni dans quel ordre. Résultat : paralysie.",
  },
  {
    Icon: Bot,
    title: "Pendant ce temps, d'autres lancent",
    desc: "Sans background technique, sans équipe, sans budget. Juste le vibecoding — LA compétence de 2026.",
  },
]


const faqs = [
  {
    q: "Est-ce que j'ai besoin de savoir coder ?",
    a: "Non. Zéro. Le Blueprint est conçu pour les non-techniques. Tu copies les prompts, Claude fait le reste. Ton rôle : donner les instructions en français et valider. C'est tout.",
  },
  {
    q: "Combien de temps ça prend vraiment ?",
    a: "6 jours si tu bloques du temps et tu suis le plan. Certains avancent plus vite, d'autres prennent deux semaines en combinant avec le boulot. Le dashboard est à vie — tu avances à ton rythme.",
  },
  {
    q: "C'est quoi la différence avec un bootcamp à 900€ ?",
    a: "Le prix (27€ vs 900€), la vitesse (6 jours vs 2-4 semaines), l'autonomie totale (tu n'attends pas un coach), et l'outil (Claude, pas GPT). Même résultat — un produit live. Dix fois moins cher. Dix fois plus rapide.",
  },
  {
    q: "Pourquoi Claude et pas ChatGPT ?",
    a: "Claude excelle dans la génération de code propre et cohérent, la compréhension de contexte long, et la logique produit. Après des tests approfondis, c'est le meilleur outil pour construire des micro-SaaS en vibecoding. Il y a une vraie différence.",
  },
  {
    q: "C'est une formation vidéo ?",
    a: "Non. C'est un dashboard interactif — un outil que tu utilises, pas du contenu que tu regardes. Chaque prompt est copiable en un clic. Chaque outil est lié directement. Tu ouvres, tu suis, tu construis.",
  },
  {
    q: "Et si j'ai déjà une idée en tête ?",
    a: "Parfait. Le Module 1 t'aide à la valider en 30 minutes avant de construire — pour ne pas perdre 3 jours sur la mauvaise cible ou la mauvaise feature. Ensuite tu passes directement à l'exécution.",
  },
  {
    q: "Ça coûte combien en outils ?",
    a: "Moins de 100€/mois pour démarrer : Claude Pro (20€/mois) et Claude Code. Supabase, Vercel et GitHub sont gratuits pour les premiers mois. Pas besoin de budget massif pour avoir un produit pro-grade.",
  },
  {
    q: "Comment ça se passe après le paiement ?",
    a: "Accès immédiat au dashboard. Un onboarding rapide (2 minutes) personnalise ton parcours selon ta stratégie et ton niveau. Tu attaques le Module 0 dans la foulée.",
  },
]

const features = [
  "Accès au dashboard interactif Buildrs",
  "6 modules complets (de l'idée au lancement)",
  "Les prompts exacts à copier-coller à chaque étape",
  "Le stack complet d'outils avec guides de configuration",
  "Générateur d'idées intégré",
  "Checklist interactive de progression",
  "Templates prêts à l'emploi (brief, emails, landing page)",
  "Les fondations du vibecoding et du product building",
  "3 stratégies de départ (copier, résoudre, découvrir)",
  "3 modèles de monétisation (MRR, revente, commande)",
  "Accès à vie + mises à jour",
]

const bonuses = [
  "3 générateurs IA (idées, validation, MRR)",
  "Accès au canal WhatsApp Buildrs",
]

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
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 no-underline">
          <BuildrsIcon color="currentColor" className="h-6 w-6 text-foreground" />
          <span className="text-[15px] font-bold tracking-tight text-foreground" style={{ letterSpacing: "-0.03em" }}>Buildrs</span>
        </a>

        {/* Links */}
        <ul className="hidden items-center gap-1 list-none md:flex">
          {[
            { label: "Le programme",  id: "modules"   },
            { label: "Résultats",    id: "resultats" },
            { label: "Tarif",        id: "tarif"     },
            { label: "FAQ",          id: "faq"       },
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

        {/* Right */}
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
            Accéder au Blueprint →
          </a>
        </div>
      </div>
    </nav>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero({ onCTA }: { onCTA?: (e: React.MouseEvent) => void }) {
  return (
    <section className="relative overflow-hidden px-6 sm:px-10 pb-24 pt-[120px] sm:pt-[150px] text-center">
      <DottedSurface className="absolute inset-0 w-full h-full opacity-40" />
      {/* Radial gradient top */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-[600px]"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(170,170,255,0.10) 0%, transparent 65%)" }}
      />

      <div className="relative mx-auto max-w-[820px] flex flex-col items-center">

        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-[12px] sm:text-[13px] text-muted-foreground">
          <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-muted">
            <BrandIcons.supabase className="h-3 w-3 text-foreground" />
          </span>
          <span>Le système utilisé en interne chez Buildrs pour lancer des SaaS IA en 6 jours.</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted-foreground/50"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>

        {/* H1 */}
        <h1
          className="mb-7 text-foreground"
          style={{ fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.03 }}
        >
          Crée ton{" "}
          <WordRotate
            words={["saas", "app"]}
            duration={2200}
            className="text-foreground"
            style={{ fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 800, letterSpacing: "-0.04em" }}
          />
          <br />avec l'IA. En 6 jours.
        </h1>

        {/* Sub */}
        <p className="mb-7 max-w-[540px] text-[17px] leading-[1.65] text-muted-foreground">
          Le système guidé étape par étape pour maîtriser le vibecoding, piloter Claude comme moteur de production, et lancer un micro SaaS IA qui génère des revenus en autopilote —{" "}
          <strong className="font-semibold text-foreground">même si tu n'as jamais ouvert un éditeur de code de ta vie.</strong>
        </p>

        {/* Badges */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {["Sans savoir coder", "Sans expertise en IA", "Sans lever de fond ni d'équipe"].map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3.5 py-1.5 text-[12px] font-medium text-muted-foreground"
            >
              <Check className="h-3 w-3 text-green-500 shrink-0" strokeWidth={2.5} />
              {label}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href="#tarif" onClick={onCTA} className="cta-rainbow flex items-center gap-2 rounded-[10px] bg-foreground px-7 py-3.5 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 no-underline">
            Accéder au Blueprint — 27€ →
          </a>
          <a href="#modules" className="flex items-center gap-2 rounded-[10px] border border-border px-6 py-3 text-[15px] font-medium text-foreground transition-colors hover:bg-accent no-underline">
            Voir les modules
          </a>
        </div>

        {/* Countdown */}
        <p className="mt-5 flex items-center justify-center gap-1.5 text-[13px] text-muted-foreground/60">
          <Flame size={13} strokeWidth={1.5} className="text-foreground/50" />
          <ScarcityCountdown />
          {" · Ensuite 297€"}
        </p>
      </div>

    </section>
  )
}

// ─── MARQUEE ──────────────────────────────────────────────────────────────────

function Marquee() {
  const doubled = [...tools, ...tools]
  return (
    <section className="overflow-hidden border-y border-border bg-muted py-12">
      <p className="mb-5 text-center text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
        Le stack IA que tu vas orchestrer
      </p>
      <div className="overflow-hidden">
        <div
          className="flex gap-3"
          style={{ width: "max-content", animation: "marquee-scroll 28s linear infinite" }}
        >
          {doubled.map(({ label, Icon }, i) => (
            <span
              key={i}
              className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-border bg-background px-4 py-2.5 text-[13px] font-medium text-muted-foreground"
            >
              <Icon className="h-4 w-4 shrink-0 text-foreground" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── STATS ────────────────────────────────────────────────────────────────────

function Stats() {
  return (
    <section className="mx-auto max-w-[1100px] px-6 py-20">
      <div
        className="mt-0 grid grid-cols-1 sm:grid-cols-3 overflow-hidden rounded-2xl border border-border"
        style={{ background: "hsl(var(--border))", gap: "1px" }}
      >
        {stats.map(({ num, desc }) => (
          <div key={num} className="bg-background px-9 py-10 text-center">
            <div
              className="mb-2 leading-none text-foreground"
              style={{ fontSize: "clamp(28px, 6vw, 52px)", fontWeight: 800, letterSpacing: "-0.04em" }}
            >
              {num}
            </div>
            <p className="text-[14px] leading-relaxed text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── WHY SAAS ────────────────────────────────────────────────────────────────


function WhySaaS() {
  return (
    <section id="resultats" className="relative py-24">
      <BGPattern variant="dots" mask="fade-edges" size={28} fill="rgba(255,255,255,0.07)" />
      <div className="mx-auto max-w-[1100px] px-6">
        {/* Header centré */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
            Pourquoi maintenant
          </p>
          <h2
            style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }}
            className="mb-5 text-foreground"
          >
            Tu n'as pas besoin<br />de coder. Tu as besoin<br />de diriger.
          </h2>
          <p className="mx-auto max-w-[540px] text-[17px] leading-[1.65] text-muted-foreground">
            Tu es le chef d'orchestre. Claude et Blueprint sont tes associés. Tu donnes l'instruction — l'IA construit. Bienvenue en 2026.
          </p>
        </div>

        {/* Orbital Claude */}
        <div className="mb-14">
          <OrbitalClaude />
        </div>

        {/* Stats en bas */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { num: "0 ligne de code", label: "Tu décris, l'IA construit" },
            { num: "100% solo", label: "Aucune équipe nécessaire" },
            { num: "< 50€", label: "De budget pour démarrer" },
          ].map(({ num, label }) => (
            <div key={num} className="rounded-xl border border-border bg-muted p-4 text-center">
              <p className="text-[22px] font-bold tracking-tight text-foreground" style={{ letterSpacing: "-0.03em" }}>{num}</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── PAIN ─────────────────────────────────────────────────────────────────────

function Pain() {
  return (
    <section className="bg-muted py-20">
      <div className="mx-auto max-w-[1100px] px-6">
      <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Le constat</p>
      <h2 style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }} className="mb-4 text-foreground">
        Tout le monde te parle d'IA.<br />Personne ne te montre<br />comment en vivre.
      </h2>
      <p className="max-w-[540px] text-[17px] leading-[1.65] text-muted-foreground">
        Pendant ce temps, des gens sans background technique lancent des micro-SaaS, des apps et des logiciels à +5 000€/mois. Ce n'est pas un manque de talent. C'est un manque de système. Blueprint le remplace.
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
      </div>
    </section>
  )
}

// ─── SAAS VEHICLE ─────────────────────────────────────────────────────────────

const saasCardItems = [
  {
    id: "global",
    title: "Vendre sans limites",
    stat: "24h/24 · Dans le monde entier",
    description: "Tu crées ton produit une fois. Il se vend à l'infini, dans tous les pays, sans stock à gérer, sans livraison, sans logistique.",
    icon: <Globe strokeWidth={1.5} size={20} />,
  },
  {
    id: "mrr",
    title: "Revenus récurrents",
    stat: "50 clients × 29€ = 1 450€/mois",
    description: "Tes clients paient chaque mois. Tu ne repars pas de zéro à chaque vente. Le MRR s'accumule automatiquement.",
    icon: <TrendingUp strokeWidth={1.5} size={20} />,
  },
  {
    id: "stack",
    title: "Dupliquer et recommencer",
    stat: "SaaS 1 → SaaS 2 → SaaS 3",
    description: "La méthode est identique à chaque fois. Tu lances un deuxième, un troisième produit. Chaque SaaS devient une source de revenus indépendante.",
    icon: <Copy strokeWidth={1.5} size={20} />,
  },
  {
    id: "exit",
    title: "Revendre ou conserver",
    stat: "1 000€/mois → 20 000 à 40 000€",
    description: "Tu gardes et développes ton SaaS, ou tu le revends entre 20x et 40x son MRR mensuel. C'est toi qui choisis.",
    icon: <ArrowLeftRight strokeWidth={1.5} size={20} />,
  },
]

function SaasCardDecorator({ children }: { children: React.ReactNode }) {
  return (
    <div
      aria-hidden
      className="relative mx-auto size-24 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:20px_20px] opacity-60" />
      <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l border-border">
        {children}
      </div>
    </div>
  )
}

function SaasVehicle() {
  return (
    <section className="relative py-24 bg-background overflow-hidden">
      <BGPattern variant="dots" mask="fade-edges" size={28} fill="rgba(255,255,255,0.06)" />
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
            Pourquoi un SaaS IA
          </p>
          <h2
            style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }}
            className="mb-5 text-foreground"
          >
            Un produit digital. Zéro stock.<br />Des clients dans le monde entier.
          </h2>
          <p className="mx-auto max-w-[560px] text-[17px] leading-[1.65] text-muted-foreground">
            Contrairement au e-commerce, au freelance ou au coaching, un SaaS ne dépend ni de ton temps, ni de ton stock, ni de ta localisation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {saasCardItems.map(({ id, title, stat, description, icon }, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.08 }}
              className="group rounded-2xl border border-border bg-card p-8 text-center hover:border-foreground/20 transition-colors"
            >
              <SaasCardDecorator>
                <span className="text-foreground [&>svg]:size-5 [&>svg]:stroke-[1.5]">{icon}</span>
              </SaasCardDecorator>

              <h3
                className="mt-5 mb-1.5 text-foreground"
                style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15 }}
              >
                {title}
              </h3>
              <p className="mb-3 text-[13px] font-bold text-muted-foreground tabular-nums tracking-tight">{stat}</p>
              <p className="text-[14px] leading-relaxed text-muted-foreground">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── BEFORE / AFTER ──────────────────────────────────────────────────────────

const beforeItems = [
  "Tu scrolles du contenu sur l'IA sans rien lancer",
  "Tu ne sais pas quel outil utiliser ni dans quel ordre",
  "Tu penses qu'il faut être développeur ou avoir une grosse équipe",
  "Tu as des idées mais elles restent dans ta tête",
  "Tu dépends des freelances et des devis à 5 000€",
  "Tu consommes des formations qui seront obsolètes dans 3 mois",
]

const afterItems = [
  "Tu as un produit live accessible à tout le monde",
  "Tu sais construire n'importe quelle app en quelques jours",
  "Tu peux vendre des logiciels à des entreprises ou des particuliers",
  "Tu crées des micro-SaaS qui résolvent un vrai problème et génèrent des revenus",
  "Tu maîtrises LA compétence la plus recherchée du marché en 2026",
  "Tu es autonome — tu bosses seul, d'où tu veux, quand tu veux",
]

function BeforeAfter() {
  return (
    <section className="bg-muted py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">La transformation</p>
        <h2
          style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }}
          className="mb-14 text-foreground"
        >
          6 jours. C'est tout ce qui sépare<br />ton idée de ton premier produit.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* AVANT */}
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

          {/* APRÈS */}
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

// ─── DASHBOARD PREVIEW ────────────────────────────────────────────────────────

const DASHBOARD_FEATURES = [
  {
    Icon: Zap,
    title: 'Autopilot IA',
    desc: 'Ton workspace projet guidé par Claude. Timeline de progression, brief produit, stack et MRR estimé — tout en un.',
  },
  {
    Icon: BookOpen,
    title: 'Mon Parcours',
    desc: '7 modules et 33 leçons interactives. Un plan structuré de l\'idée au lancement, à suivre à ton rythme.',
  },
  {
    Icon: Lightbulb,
    title: 'Générateurs IA',
    desc: '3 outils IA intégrés : idées de SaaS, validation de concept avec score, calculateur MRR & revente.',
  },
  {
    Icon: Copy,
    title: 'Bibliothèque de prompts',
    desc: '100+ prompts copiables classés par module et par usage. Prêts à coller dans Claude Code.',
  },
  {
    Icon: CheckSquare,
    title: 'Checklist de lancement',
    desc: 'Chaque étape cochable en temps réel. Tu sais exactement où tu en es et ce qu\'il reste à faire.',
  },
  {
    Icon: Wrench,
    title: 'Boîte à outils',
    desc: 'Tous les outils du stack (Supabase, Vercel, Stripe…) avec guides de configuration et liens directs.',
  },
]

function DashboardSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <DottedSurface className="absolute inset-0 w-full h-full opacity-50" />
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="text-center mb-14">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
            Le produit
          </p>
          <h2
            style={{ fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.06 }}
            className="mb-4 text-foreground"
          >
            Pas un PDF. Pas une vidéo.<br />Un vrai copilote SaaS.
          </h2>
          <p className="mx-auto max-w-[500px] text-[17px] leading-[1.65] text-muted-foreground">
            Tu accèdes à un dashboard complet avec ton workspace projet Autopilot IA, tes modules interactifs, tes générateurs, ta bibliothèque de prompts, ta checklist et tes outils — tout en un.
          </p>
        </div>

        <DashboardPreview />
      </div>
    </section>
  )
}

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────

function UniqueTestimonialSection() {
  return (
    <section className="py-24 overflow-hidden bg-muted">
      <div className="mx-auto max-w-[1100px] px-6 mb-14 text-center">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
          Ils ont construit avec Blueprint
        </p>
        <h2
          style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }}
          className="text-foreground"
        >
          Les derniers projets propulsés<br />par les membres Buildrs
        </h2>
      </div>
      <SaasMarquee />
    </section>
  )
}

// ─── PRICING ─────────────────────────────────────────────────────────────────────────────

function Pricing({ onCTA }: { onCTA?: (e: React.MouseEvent) => void }) {
  return (
    <section id="tarif" className="bg-muted py-24 text-center">
      <div className="mx-auto max-w-[1100px] px-6">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Tarif</p>
        <h2 style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }} className="mb-4 text-foreground">
          Le prix d'un restaurant<br />pour lancer ton business digital.
        </h2>
        <p className="mx-auto max-w-[440px] text-[17px] leading-[1.65] text-muted-foreground">
          Un seul paiement. Un accès à vie. Un seul client sur ton SaaS et le Blueprint est rentabilisé 10 fois.
        </p>

        {/* Shine border wrapper */}
        <div className="bump-neon relative mx-auto mt-12 max-w-[440px]" style={{ borderRadius: 22 }}>
          <div className="bump-inner p-10 text-left" style={{ borderRadius: 20 }}>
            {/* Header row */}
            <div className="mb-5 flex items-center justify-between">
              <p className="text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Buildrs Blueprint</p>
              <span
                className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold"
                style={{ background: "hsl(var(--foreground))", color: "hsl(var(--background))" }}
              >
                <Flame size={12} strokeWidth={1.5} />
                Offre de lancement
              </span>
            </div>

            {/* Price */}
            <div className="mb-1 flex items-baseline gap-2">
              <span className="text-[18px] font-medium text-muted-foreground/50 line-through">297€</span>
              <div className="flex items-baseline gap-1">
                <span className="text-[22px] font-semibold text-muted-foreground">€</span>
                <span style={{ fontSize: 64, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }} className="text-foreground">27</span>
              </div>
            </div>
            <p className="mb-7 text-[14px] text-muted-foreground">Paiement unique · Accès à vie</p>

            <hr className="mb-7 border-border" />

            {/* Features */}
            <ul className="mb-6 flex flex-col gap-[10px] text-[14px] text-muted-foreground">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check size={15} strokeWidth={2} className="mt-[1px] shrink-0 text-foreground" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Bonuses */}
            <div className="mb-7 rounded-xl border border-dashed border-border bg-muted px-4 py-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">Bonus inclus</p>
              <ul className="flex flex-col gap-[10px]">
                {bonuses.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[14px] text-foreground font-medium">
                    <Zap size={14} strokeWidth={1.5} className="mt-[2px] shrink-0 text-foreground" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <a
              href="#"
              onClick={onCTA}
              className="cta-rainbow relative flex w-full items-center justify-center gap-2 rounded-[10px] bg-foreground py-3.5 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 no-underline"
            >
              Accéder au Blueprint — 27€ →
            </a>
            <p className="mt-3.5 text-center text-[12px] text-muted-foreground/60">
              Paiement sécurisé par Stripe · Accès immédiat · Aucun abonnement
            </p>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[12px] font-semibold text-foreground/70">
              <Flame size={12} strokeWidth={1.5} />
              <ScarcityCountdown /> · Ensuite 297€
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <p className="mb-3 text-center text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">FAQ</p>
        <h2 style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }} className="mb-12 text-center text-foreground">
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

// ─── FINAL CTA ────────────────────────────────────────────────────────────────

function FinalCTA({ onCTA }: { onCTA?: (e: React.MouseEvent) => void }) {
  return (
    <section className="relative overflow-hidden px-6 py-[120px] text-center">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(160,160,255,0.07) 0%, transparent 70%)" }}
      />
      <h2
        className="mx-auto mb-[18px] max-w-[680px] text-foreground"
        style={{ fontSize: "clamp(40px, 6vw, 70px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05 }}
      >
        Ton premier SaaS IA<br />est à 6 jours d'ici.
      </h2>
      <p className="mx-auto mb-9 max-w-[440px] text-[17px] leading-[1.65] text-muted-foreground">
        Pas dans 6 mois. Pas quand tu auras appris à coder. Pas quand tu auras trouvé le bon moment. En 6 jours.
      </p>
      <a href="#tarif" onClick={onCTA} className="cta-rainbow inline-flex items-center gap-2 rounded-[10px] bg-foreground px-8 py-4 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 no-underline">
        Commencer maintenant — 27€ (au lieu de 297€) →
      </a>
      <p className="mt-5 flex items-center justify-center gap-1.5 text-[13px] text-muted-foreground/60">
        <Flame size={13} strokeWidth={1.5} className="text-foreground/50" />
        <ScarcityCountdown /> · Ensuite 297€
      </p>
    </section>
  )
}

// ─── SPRINT ──────────────────────────────────────────────────────────────────

const sprintDays = [
  {
    day: "01", label: "Lundi", title: "Fondations",
    deliverable: "Tu repars avec une direction claire : ta stratégie, ton objectif, tes bases posées",
    items: ["Comprendre le vibecoding et pourquoi ça change tout", "Choisir entre une app, un micro-SaaS ou un logiciel", "Choisir ta stratégie de départ (copier, résoudre, découvrir)", "Définir ton objectif de monétisation", "Les bases de l'IA avec Claude et le rôle des agents autonomes"],
    accent: "#4d96ff",
  },
  {
    day: "02", label: "Mardi", title: "Trouver & Valider",
    deliverable: "Tu repars avec ton idée validée et un brief produit complet prêt à exécuter",
    items: ["Générer 5 idées avec le générateur intégré", "Valider ton idée avec Buildrs Blueprint en 30 min", "Rédiger ton brief produit (nom, cible, feature, prix)"],
    accent: "#cc5de8",
  },
  {
    day: "03", label: "Mercredi", title: "Design & Architecture",
    deliverable: "Tu repars avec ton environnement configuré et l'architecture de ton produit posée",
    items: ["Configurer ton environnement (Supabase, Vercel, Stripe...)", "Créer ton branding avec Mobbin ou Pageflows et le valider dans Blueprint", "Schéma base de données + architecture validée"],
    accent: "#eab308",
  },
  {
    day: "04", label: "Jeudi", title: "Construire",
    deliverable: "Tu repars avec un MVP fonctionnel qui tourne",
    items: ["Générer la base de l'app avec Claude Code", "Implémenter la feature principale", "Auth + onboarding utilisateur + sécurité"],
    accent: "#ff6b6b",
  },
  {
    day: "05", label: "Vendredi", title: "Déployer",
    deliverable: "Tu repars avec ton produit en ligne, accessible au monde entier",
    items: ["Mise en ligne sur Vercel", "Domaine personnalisé connecté", "Stripe + Resend branchés et testés"],
    accent: "#22c55e",
  },
  {
    day: "06", label: "Samedi", title: "Monétiser & Lancer",
    deliverable: "Tu repars avec ta page de vente live et tes premiers euros en vue",
    items: ["Page de vente rédigée et publiée", "5 contenus de lancement prêts à poster", "Premiers clients et premiers revenus"],
    accent: "#f97316",
  },
]

import { motion } from "framer-motion"

function Sprint() {
  return (
    <section id="modules" className="overflow-hidden py-24 bg-muted">
      <div className="mx-auto max-w-[1100px] px-6">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Le programme</p>
        <h2
          style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }}
          className="mb-4 text-foreground"
        >
          6 modules.<br />1 SaaS IA monétisé.
        </h2>
        <p className="mb-12 md:mb-20 max-w-[500px] text-[15px] md:text-[17px] leading-[1.65] text-muted-foreground">
          Un livrable concret chaque jour. Au bout de 6 jours, ton produit est en ligne et prêt à encaisser.
        </p>

        {/* Timeline */}
        <div className="relative">
          {/* Ligne centrale — desktop uniquement */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-border hidden md:block" />
          {/* Ligne gauche — mobile uniquement */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border md:hidden" />

          <div className="flex flex-col gap-10 md:gap-16">
            {sprintDays.map(({ day, label, title, items, deliverable, accent }, i) => {
              const isLeft = i % 2 === 0
              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
                  className={`relative md:grid md:grid-cols-2 md:gap-8 md:items-center pl-14 md:pl-0 ${isLeft ? "" : "md:[&>*:first-child]:order-2"}`}
                >
                  {/* Card */}
                  <div className="rounded-2xl border border-border bg-card p-6 md:p-7 shadow-sm">
                    <div className="mb-4 flex items-center justify-end">
                      <span
                        className="font-mono text-[11px] font-bold"
                        style={{ color: accent }}
                      >
                        Module {day}
                      </span>
                    </div>
                    <h3 className="mb-4 text-[18px] md:text-[20px] font-bold tracking-tight text-foreground">{title}</h3>
                    <ul className="mb-5 flex flex-col gap-2.5">
                      {items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[13px] md:text-[14px] text-muted-foreground">
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div
                      className="rounded-lg px-3.5 py-2.5 text-[12px] font-semibold"
                      style={{ background: `${accent}12`, color: accent }}
                    >
                      {deliverable}
                    </div>
                  </div>

                  {/* Dot + ghost number — desktop uniquement */}
                  <div className={`hidden md:flex items-center ${isLeft ? "justify-start pl-8" : "justify-end pr-8"}`}>
                    <div
                      className="absolute left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-foreground shadow-sm"
                      style={{ zIndex: 1 }}
                    >
                      <span className="font-mono text-[11px] font-bold text-background">{day}</span>
                    </div>
                    <div
                      className="select-none font-mono leading-none text-muted-foreground/[0.06]"
                      style={{ fontSize: 120, fontWeight: 800, letterSpacing: "-0.06em" }}
                    >
                      {day}
                    </div>
                  </div>

                  {/* Dot mobile — absolu, après les items grid pour ne pas casser [&>*:first-child] */}
                  <div
                    className="absolute left-0 top-6 flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted bg-foreground shadow-sm md:hidden"
                    style={{ zIndex: 1 }}
                  >
                    <span className="font-mono text-[10px] font-bold text-background">{day}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export function LandingPage({ onCTAClick }: { onCTAClick?: () => void }) {
  const go = (e: React.MouseEvent) => { e.preventDefault(); onCTAClick?.() }
  return (
    <>
      <Nav onCTA={go} />
      <main>
        <Hero onCTA={go} />
        <Marquee />
        <Stats />
        <Pain />
        <WhySaaS />
        <SaasVehicle />
        <BeforeAfter />
        <Sprint />
        <DashboardSection />
        <UniqueTestimonialSection />
        <Pricing onCTA={go} />
        <FAQ />
        <FinalCTA onCTA={go} />
      </main>
      <StackedCircularFooter />
    </>
  )
}
