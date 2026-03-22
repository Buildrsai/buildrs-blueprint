import { useState } from "react"
import { Clock, Banknote, Layers, Bot, TrendingUp, Copy, Repeat2, Building2, Zap, Check, Flame } from "lucide-react"
import { TestimonialsSection } from "./ui/testimonials-section"
import { StackedCircularFooter } from "./ui/stacked-circular-footer"
import { BuildrsIcon, BrandIcons } from "./ui/icons"

import { AnimatedBeamStack } from "./ui/animated-beam-stack"
import { DashboardPreview } from "./ui/dashboard-preview"
import { WordRotate } from "./ui/word-rotate"

// ─── DATA ───────────────────────────────────────────────────────────────────

const tools: { label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { label: "Claude AI",    Icon: BrandIcons.claude },
  { label: "Supabase",    Icon: BrandIcons.supabase },
  { label: "Stripe",      Icon: BrandIcons.stripe },
  { label: "Vercel",      Icon: BrandIcons.vercel },
  { label: "GitHub",      Icon: BrandIcons.github },
  { label: "Tailwind CSS",Icon: BrandIcons.tailwind },
  { label: "Resend",      Icon: BrandIcons.resend },
  { label: "Cloudflare",  Icon: BrandIcons.cloudflare },
]

const stats = [
  { num: "6 jours", desc: "De l'idée au produit live et monétisé" },
  { num: "27€", desc: "Prix de lancement — 82/100 places prises" },
  { num: "6", desc: "Modules actionnables pour lancer ton produit" },
]

const pains = [
  {
    Icon: Clock,
    title: "Tu scrolles depuis des mois sans rien lancer",
    desc: "Des créateurs de contenu qui te promettent 10 000€/mois avec ChatGPT. Et toi tu watchlistes encore.",
  },
  {
    Icon: Banknote,
    title: "Les formations coûtent une fortune pour peu de résultats",
    desc: "997€ pour apprendre la théorie sans jamais passer à l'action. Et à la fin, toujours rien de live.",
  },
  {
    Icon: Layers,
    title: "Trop d'outils, zéro direction",
    desc: "GPT, Bolt, Make, Airtable… Tu ne sais plus lequel utiliser ni dans quel ordre. Résultat : paralysie.",
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
  "6 modules complets (de l'idée au lancement)",
  "Les prompts exacts à copier-coller",
  "La liste de tous les outils avec liens directs",
  "Générateur d'idées intégré",
  "Checklist interactive",
  "Bibliothèque de templates",
  "Glossaire et fondations",
  "3 stratégies de départ",
  "3 modèles de monétisation",
  "Accès à vie + mises à jour",
]

const bonuses = [
  "3 générateurs IA (idées, validation, MRR)",
  "Accès canal WhatsApp premium — 7 jours",
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
          {["Modules", "Comment", "Tarif", "FAQ"].map((l) => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`} className="rounded-md px-3 py-1.5 text-sm font-[450] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground no-underline">
                {l}
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
    <section className="relative overflow-hidden px-6 pb-20 pt-[140px] text-center">
      {/* Radial gradient top */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-[500px]"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(170,170,255,0.10) 0%, transparent 65%)" }}
      />

      {/* Badge */}
      <div className="mb-8 inline-flex max-w-[340px] sm:max-w-none items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-[12px] sm:text-[13px] text-muted-foreground">
        <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-muted">
          <BrandIcons.supabase className="h-3 w-3 text-foreground" />
        </span>
        <span className="text-center sm:text-left">Le système utilisé en interne chez Buildrs pour lancer des produits en 6 jours.</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted-foreground/50"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </div>

      {/* H1 */}
      <h1
        className="mx-auto mb-7 max-w-[900px] text-foreground"
        style={{ fontSize: "clamp(52px, 8.5vw, 96px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05 }}
      >
        Crée ton{" "}
        <WordRotate
          words={["SaaS", "app", "logiciel"]}
          duration={2200}
          className="text-foreground"
          style={{ fontSize: "clamp(52px, 8.5vw, 96px)", fontWeight: 800, letterSpacing: "-0.04em" }}
        />
        <br />avec l'IA. En 6 jours.
      </h1>

      {/* Sub */}
      <p className="mx-auto mb-10 max-w-[560px] text-[18px] leading-[1.65] text-muted-foreground">
        Le plan d'action étape par étape pour maîtriser le vibecoding, piloter Claude comme moteur de production, et lancer un produit digital qui génère des revenus —{" "}
        <strong className="font-semibold text-foreground">même si tu n'as jamais ouvert un éditeur de code de ta vie.</strong>
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a href="#tarif" onClick={onCTA} className="cta-rainbow flex items-center gap-2 rounded-[10px] bg-foreground px-7 py-3.5 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 no-underline">
          Accéder au Blueprint — 27€ →
        </a>
        <a href="#modules" className="flex items-center gap-2 rounded-[10px] border border-border px-6 py-3 text-[15px] font-medium text-foreground transition-colors hover:bg-accent no-underline">
          Voir les modules
        </a>
      </div>

      {/* Price note */}
      <p className="mt-5 flex items-center justify-center gap-1.5 text-[13px] text-muted-foreground/60">
        <Flame size={13} strokeWidth={1.5} className="text-foreground/50" />
        <span>Offre de lancement — 82/100 places prises · Ensuite 297€</span>
      </p>

    </section>
  )
}

// ─── MARQUEE ──────────────────────────────────────────────────────────────────

function Marquee() {
  const doubled = [...tools, ...tools]
  return (
    <section className="overflow-hidden border-y border-border bg-muted py-12">
      <p className="mb-5 text-center text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
        Les outils que tu vas maîtriser
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
              style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.04em" }}
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

const whyCards = [
  {
    id: "clone",
    title: "Copier un SaaS qui marche",
    description: "Repère un SaaS US qui cartonne, adapte-le au marché français. Le modèle est validé, tu exécutes.",
    icon: <Copy className="h-5 w-5" />,
  },
  {
    id: "problem",
    title: "Résoudre un vrai problème",
    description: "Tu identifies une douleur réelle dans ton secteur. Tu construis la solution exacte. Personne d'autre ne l'a encore faite.",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    id: "agents",
    title: "Orchestrer des agents IA",
    description: "Claude fait le travail. Toi tu diriges. Tu deviens le CEO d'un studio IA sans équipe ni salaires.",
    icon: <Bot className="h-5 w-5" />,
  },
  {
    id: "mrr",
    title: "Générer du MRR",
    description: "Des revenus récurrents chaque mois. Prévisibles. Scalables. Sans client à gérer, sans prestation à livrer.",
    icon: <Repeat2 className="h-5 w-5" />,
  },
  {
    id: "flip",
    title: "Construire pour revendre",
    description: "Un SaaS rentable se revend 3 à 5x son MRR annuel. Tu construis en 72h, tu revends en quelques mois.",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    id: "solo",
    title: "Zéro équipe, zéro budget",
    description: "Pas de développeur, pas d'investisseur, pas d'expérience technique requise. Juste toi, Claude, et ce Blueprint.",
    icon: <Building2 className="h-5 w-5" />,
  },
]

function WhySaaS() {
  return (
    <section className="py-24">
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
            Tu es le chef d'orchestre. Les agents IA sont ton équipe d'exécution. Claude code. Vercel déploie. Supabase gère.
          </p>
        </div>

        {/* Animation centrale */}
        <div className="mx-auto mb-14 max-w-[560px] rounded-2xl border border-border bg-card p-8 shadow-sm">
          <AnimatedBeamStack />
        </div>

        {/* Stats en bas */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { num: "20–40×", label: "Valeur de revente du MRR mensuel" },
            { num: "6 jours", label: "De l'idée au produit live" },
            { num: "<100€", label: "De budget pour démarrer" },
            { num: "100%", label: "Solo, aucune équipe nécessaire" },
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
        Pendant ce temps, des gens sans background technique lancent des micro-SaaS à 5 000€/mois. Ce n'est pas un manque de talent. C'est un manque de système. Blueprint le remplace.
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

// ─── BEFORE / AFTER ──────────────────────────────────────────────────────────

const beforeItems = [
  "Tu scrolles du contenu sur l'IA sans rien lancer",
  "Tu ne sais pas quel outil utiliser ni dans quel ordre",
  "Tu penses qu'il faut savoir coder ou avoir un gros budget",
  "Tu as des idées mais elles restent dans ta tête",
  "Tu dépends des développeurs ou des freelances",
]

const afterItems = [
  "Tu as un produit live accessible à tout le monde",
  "Tu maîtrises un stack complet d'outils IA",
  "Tu sais construire n'importe quelle app en quelques jours",
  "Ton idée est un vrai produit qui génère des revenus",
  "Tu es autonome — chef d'orchestre de tes agents IA",
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

function DashboardSection() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="text-center mb-14">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
            Le produit
          </p>
          <h2
            style={{ fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.06 }}
            className="mb-4 text-foreground"
          >
            Ton dashboard.<br />Pas un PDF. Pas une vidéo.
          </h2>
          <p className="mx-auto max-w-[480px] text-[17px] leading-[1.65] text-muted-foreground">
            Un vrai produit SaaS interactif. Prompts copiables, checklist cochable, progression en temps réel. Explore les 3 vues ci-dessous.
          </p>
        </div>
        <DashboardPreview />
      </div>
    </section>
  )
}

// ─── PRICING ─────────────────────────────────────────────────────────────────

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

        {/* Shine border wrapper — reuses .bump-neon + .bump-inner from index.css */}
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

            {/* Separator */}
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
              Offre de lancement — 82/100 places prises · Ensuite 297€
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
        Ton premier produit digital<br />est à 6 jours d'ici.
      </h2>
      <p className="mx-auto mb-9 max-w-[440px] text-[17px] leading-[1.65] text-muted-foreground">
        Pas dans 6 mois. Pas quand tu auras appris à coder. Pas quand tu auras trouvé le bon moment. En 6 jours.
      </p>
      <a href="#tarif" onClick={onCTA} className="cta-rainbow inline-flex items-center gap-2 rounded-[10px] bg-foreground px-8 py-4 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 no-underline">
        Commencer maintenant — 27€ (au lieu de 297€) →
      </a>
      <p className="mt-5 flex items-center justify-center gap-1.5 text-[13px] text-muted-foreground/60">
        <Flame size={13} strokeWidth={1.5} className="text-foreground/50" />
        82/100 places au prix de lancement
      </p>
    </section>
  )
}

// ─── SPRINT ──────────────────────────────────────────────────────────────────

const sprintDays = [
  {
    day: "01", label: "Lundi", title: "Fondations",
    deliverable: "Livrable : ta stratégie de lancement définie",
    items: ["Comprendre le vibecoding et pourquoi ça change tout", "Choisir ta stratégie de départ (copier, résoudre, découvrir)", "Définir ton objectif de monétisation"],
    accent: "#4d96ff",
  },
  {
    day: "02", label: "Mardi", title: "Trouver & Valider",
    deliverable: "Livrable : ton brief produit complet",
    items: ["Générer 5 idées avec le générateur intégré", "Valider ton idée avec Claude en 30 min", "Rédiger ton brief produit (nom, cible, feature, prix)"],
    accent: "#cc5de8",
  },
  {
    day: "03", label: "Mercredi", title: "Design & Architecture",
    deliverable: "Livrable : ton stack configuré, ton schéma DB prêt",
    items: ["Configurer ton environnement (Supabase, Vercel, Stripe)", "Branding express en 15 min avec Claude", "Schéma base de données + architecture validée"],
    accent: "#eab308",
  },
  {
    day: "04", label: "Jeudi", title: "Construire",
    deliverable: "Livrable : ton MVP fonctionnel",
    items: ["Générer la base de l'app avec Claude Code", "Implémenter la feature principale", "Auth + onboarding utilisateur"],
    accent: "#ff6b6b",
  },
  {
    day: "05", label: "Vendredi", title: "Déployer",
    deliverable: "Livrable : ton app accessible en ligne",
    items: ["Mise en ligne sur Vercel", "Domaine personnalisé connecté", "Stripe + Resend branchés et testés"],
    accent: "#22c55e",
  },
  {
    day: "06", label: "Samedi", title: "Monétiser & Lancer",
    deliverable: "Livrable : premiers euros encaissés",
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
          6 jours. 6 modules.<br />1 produit monétisé.
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
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{label}</span>
                      <span
                        className="font-mono text-[11px] font-bold"
                        style={{ color: accent }}
                      >
                        Jour {day}
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
        <BeforeAfter />
        <Sprint />
        <DashboardSection />
        <TestimonialsSection />
        <Pricing onCTA={go} />
        <FAQ />
        <FinalCTA onCTA={go} />
      </main>
      <StackedCircularFooter />
    </>
  )
}
