import { useState, useEffect, useRef } from "react"
import { Clock, Banknote, Layers, Bot, Zap, Check, Flame, Globe, TrendingUp, Copy, ArrowLeftRight, BookOpen, Lightbulb, CheckSquare, Wrench, FolderOpen, Linkedin, ArrowRight, Shield, Database, Users, Search, BarChart2, Receipt, LayoutDashboard } from "lucide-react"
import { motion } from "framer-motion"
import { StackedCircularFooter } from "./ui/stacked-circular-footer"
import { BuildrsIcon, BrandIcons, ClaudeIcon, WhatsAppIcon } from "./ui/icons"

import { DashboardPreviewV2 as DashboardPreview } from "./ui/dashboard-preview"
import { OrbitalClaude, OrbitalStack } from "./ui/orbital-claude"
import { WordRotate } from "./ui/word-rotate"
import { SaasMarquee } from "./ui/saas-marquee"
import { RobotJarvis, RobotValidator } from "./ui/agent-robots"

// ─── REVEAL ANIMATION ────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── DATA ───────────────────────────────────────────────────────────────────

const tools: { label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { label: "Claude AI",      Icon: BrandIcons.claude },
  { label: "Supabase",       Icon: BrandIcons.supabase },
  { label: "Vercel",         Icon: BrandIcons.vercel },
  { label: "Stripe",         Icon: BrandIcons.stripe },
  { label: "GitHub",         Icon: BrandIcons.github },
  { label: "Resend",         Icon: BrandIcons.resend },
  { label: "Product Hunt",   Icon: BrandIcons.producthunt },
  { label: "Reddit",         Icon: BrandIcons.reddit },
  { label: "Flippa",         Icon: BrandIcons.flippa },
  { label: "Indie Hackers",  Icon: BrandIcons.indiehackers },
  { label: "Hostinger",      Icon: BrandIcons.hostinger },
  { label: "Perplexity",     Icon: BrandIcons.perplexity },
]

const stats: { target: number; prefix: string; suffix: string; desc: string; sub?: string }[] = [
  { target: 6,    prefix: "",  suffix: " jours", desc: "Plan d'action complet, de l'idée au premier produit live" },
  { target: 5000, prefix: "",  suffix: "€/mois",  desc: "L'objectif visé par nos builders", sub: "SOUS 60 JOURS" },
  { target: 140,  prefix: "+", suffix: "",        desc: "Builders ont déjà lancé leur produit avec Blueprint" },
]

function useCountUp(target: number, duration: number, trigger: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!trigger) return
    setValue(0)
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(eased * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [trigger, target, duration])
  return value
}

const pains = [
  {
    Icon: Layers,
    title: "Un nouvel outil par jour. Zéro action.",
    desc: "Des prompts magiques, des outils révolutionnaires, des influenceurs qui font 10k€/mois. Résultat : tu consommes, tu ne construis pas.",
  },
  {
    Icon: Bot,
    title: "L'IA peut tout coder. Mais quoi ?",
    desc: "Claude est exceptionnel. Sans idée claire, sans projet qui résout un vrai problème, tu génères du code parfait pour rien.",
  },
  {
    Icon: Lightbulb,
    title: "Tu ne sais pas par où commencer. Ni par quoi.",
    desc: "Quel produit ? Quel marché ? Quelle stack ? Chaque décision bloque la suivante. Et pendant ce temps, tu attends.",
  },
  {
    Icon: Flame,
    title: "Tu regardes les autres lancer. Et toi, t'attends.",
    desc: "Sur LinkedIn, X, partout — des gens sortent leur produit chaque semaine avec Claude. Toi tu doutes encore du bon moment.",
  },
  {
    Icon: Banknote,
    title: "Tu crois qu'il faut du budget. Il n'en faut pas.",
    desc: "20€/mois d'abonnement Claude. Les meilleurs outils démarrent gratuitement. Tes premiers revenus couvrent tout le reste.",
  },
  {
    Icon: Shield,
    title: "Et si ça ne marche pas pour moi ?",
    desc: "La peur de l'échec paralyse plus que l'échec lui-même. Ici, tu suis un système éprouvé — pas une intuition à l'aveugle.",
  },
]


const faqs = [
  {
    q: "Pourquoi pas juste utiliser Claude tout seul ?",
    a: "Claude est exceptionnel pour générer du code. Mais il ne sait pas quelle idée est rentable, quels prompts fonctionnent vraiment pour créer un SaaS, ni quelle stack utiliser. Sans direction, tu vas passer des semaines à chercher, tester des outils, faire des erreurs de sécurité et te retrouver avec un projet qui ne se vend pas. Buildrs, c'est tout ce qu'on a appris sur 35+ SaaS lancés — condensé dans un système qui donne à Claude la direction dont il a besoin. L'un sans l'autre, ça marche à moitié.",
  },
  {
    q: "Est-ce que j'ai besoin de savoir coder ?",
    a: "Non. Zéro. Le Blueprint est conçu pour les non-techniques. Tu copies les prompts, Claude fait le reste. Ton rôle : donner les instructions en français et valider. C'est tout.",
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
    q: "Combien de temps ça prend vraiment ?",
    a: "6 jours si tu bloques du temps et tu suis le plan. Certains avancent plus vite, d'autres prennent deux semaines en combinant avec le boulot. Le dashboard est à vie — tu avances à ton rythme.",
  },
  {
    q: "Ça coûte combien en outils ?",
    a: "Moins de 100€/mois pour démarrer : Claude Pro (20€/mois) et Claude Code. Supabase, Vercel et GitHub sont gratuits pour les premiers mois. Pas besoin de budget massif pour avoir un produit pro-grade.",
  },
  {
    q: "C'est quoi la différence avec un bootcamp à 900€ ?",
    a: "Le prix (27€ vs 900€), la vitesse (6 jours vs 2-4 semaines), l'autonomie totale (tu n'attends pas un coach), et l'outil (Claude, pas GPT). Même résultat — un produit live. Dix fois moins cher. Dix fois plus rapide.",
  },
  {
    q: "C'est quoi un Micro-SaaS IA exactement ?",
    a: "Un outil propulsé par l'IA, focalisé sur un problème précis dans une niche étroite. Exemple : un générateur de contrats pour avocats, une app de pricing pour e-commerçants. Tu le lances seul avec Claude, en quelques jours, et il génère des revenus récurrents.",
  },
  {
    q: "Pourquoi Claude et pas ChatGPT / Cursor / Bolt ?",
    a: "Claude Code est le seul outil qui lit ton projet, écrit le code dans les bons fichiers, exécute les tests et déploie — tout depuis une conversation. Les autres te donnent du code à copier-coller. Claude agit. C'est la différence entre un assistant et un builder.",
  },
  {
    q: "Quelle IA vous utilisez et pourquoi ?",
    a: "Claude excelle dans la génération de code propre et cohérent, la compréhension de contexte long, et la logique produit. Après des tests approfondis, c'est le meilleur outil pour construire des micro-SaaS en vibecoding. Il y a une vraie différence.",
  },
  {
    q: "Comment ça se passe après le paiement ?",
    a: "Accès immédiat au dashboard. Un onboarding rapide (2 minutes) personnalise ton parcours selon ta stratégie et ton niveau. Tu attaques le Module 0 dans la foulée.",
  },
  {
    q: "Et si ça marche pas pour moi ?",
    a: "Tu as 30 jours pour tester. Si Blueprint ne te convient pas, on te rembourse intégralement, sans condition et sans question. Le risque est pour nous, pas pour toi.",
  },
]

const features: { title: string; desc: string }[] = [
  { title: 'Le système en 7 modules', desc: "De l'idée au SaaS IA monétisé — checklist interactive, progression en temps réel." },
  { title: 'Marketplace d\'idées', desc: "Des centaines d'idées analysées par nos agents sur PH, Reddit, Flippa, IH. De la vraie data, pas du ChatGPT." },
  { title: 'Générateur d\'idées', desc: "Si tu n'as pas d'idée, nos agents en trouvent basées sur les tendances marché actuelles." },
  { title: 'Validateur d\'idées', desc: "Score de viabilité sur 100, estimation MRR potentiel, scénario de revente — avant de coder une ligne." },
  { title: 'Le cockpit Jarvis', desc: "Dashboard de pilotage — ton projet, ta progression, tes métriques, tout centralisé avec ton IA copilote." },
  { title: '50+ prompts testés', desc: "Copiables en un clic à chaque étape. Testés sur 35+ SaaS réels lancés par notre équipe." },
  { title: 'Stack configurée', desc: "Claude Code, Supabase, Vercel, Stripe, Resend — guides pas à pas, zéro temps perdu sur la conf." },
  { title: 'Sécurité & bonnes pratiques', desc: "Auth, RLS, variables d'environnement, HTTPS — tout ce qu'on a appris à nos dépens, condensé." },
  { title: 'Accès à vie + mises à jour', desc: "Les nouvelles fonctionnalités Claude, les nouveaux prompts, les nouvelles ressources — automatiquement." },
  { title: 'Communauté Buildrs', desc: "Partage ton idée, ton projet, tes réussites — directement depuis le dashboard. Les builders qui gagnent s'entraident." },
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
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
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
          <a href="#tarif" onClick={onCTA} className="flex items-center gap-2 rounded-[8px] px-4 py-2 text-[13px] font-semibold text-white transition-all hover:border-white/40 no-underline" style={{ background: "#09090b", border: "1px solid rgba(255,255,255,0.18)" }}>
            Accéder au Blueprint →
          </a>
        </div>
      </div>
    </nav>
  )
}

// ─── TYPING IDEA BAR ──────────────────────────────────────────────────────────

const TYPING_IDEAS = [
  "Un CRM vocal pour coachs",
  "Une app qui résume tes réunions Zoom",
  "Un coach nutrition IA à 9,99€/mois",
  "Un générateur de devis pour artisans",
  "Un SaaS de scraping e-commerce",
]

function TypingIdea() {
  const [idx, setIdx] = useState(0)
  const [text, setText] = useState("")
  const [phase, setPhase] = useState<'typing' | 'waiting' | 'deleting'>('typing')

  useEffect(() => {
    const full = TYPING_IDEAS[idx]
    let timer: ReturnType<typeof setTimeout>

    if (phase === 'typing') {
      if (text.length < full.length) {
        timer = setTimeout(() => setText(full.slice(0, text.length + 1)), 55)
      } else {
        timer = setTimeout(() => setPhase('deleting'), 2200)
      }
    } else if (phase === 'deleting') {
      if (text.length > 0) {
        timer = setTimeout(() => setText(text.slice(0, -1)), 25)
      } else {
        setIdx(i => (i + 1) % TYPING_IDEAS.length)
        setPhase('typing')
      }
    }

    return () => clearTimeout(timer)
  }, [text, phase, idx])

  return (
    <div
      className="mb-8 flex items-center justify-between gap-3 rounded-2xl px-5"
      style={{
        width: 'min(480px, calc(100vw - 48px))',
        height: 72,
        flexShrink: 0,
        overflow: 'hidden',
        background: '#111113',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      <div className="flex flex-col justify-center" style={{ flex: '1 1 0', minWidth: 0, overflow: 'hidden' }}>
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Ton idée :
        </span>
        <div className="flex items-center gap-1" style={{ height: 21, overflow: 'hidden' }}>
          <span className="text-[14px] font-medium text-white/80" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', maxWidth: '100%' }}>{text}</span>
          <span
            className="text-white/70 font-light text-[15px] leading-none shrink-0"
            style={{ animation: 'cursor-blink 0.9s step-end infinite' }}
          >|</span>
        </div>
      </div>
      <div
        className="shrink-0 flex items-center justify-center rounded-full"
        style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
      </div>
    </div>
  )
}

// ─── HERO DASHBOARD MOCKUP ────────────────────────────────────────────────────

function HeroDashboardMockup() {
  return (
    <div className="relative w-full select-none pointer-events-none overflow-hidden max-h-[220px] sm:max-h-none">
      <div className="absolute -inset-6 rounded-3xl blur-3xl opacity-20" style={{ background: 'radial-gradient(ellipse, rgba(150,120,255,0.5) 0%, transparent 70%)' }} />
      <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 80px -20px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04)' }}>
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-3 h-8 bg-[#0f0f12]" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <div className="flex-1 flex justify-center">
            <div className="px-3 h-[18px] rounded flex items-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-[8px]" style={{ color: 'rgba(255,255,255,0.25)' }}>buildrs.fr/dashboard</span>
            </div>
          </div>
          <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
        </div>

        {/* Dashboard body */}
        <div className="flex bg-[#09090b]" style={{ height: '370px' }}>

          {/* Sidebar */}
          <div className="flex flex-col overflow-hidden bg-[#09090b]" style={{ width: '130px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between px-3 h-9" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-1.5">
                <BuildrsIcon color="#ffffff" size={11} />
                <span className="text-[9px] font-extrabold text-white" style={{ letterSpacing: '-0.04em' }}>Buildrs</span>
              </div>
              <div className="h-3.5 rounded-full flex items-center justify-end px-0.5" style={{ width: '26px', background: 'rgba(255,255,255,0.15)' }}>
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              </div>
            </div>
            <div className="px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex justify-between mb-1">
                <span className="text-[6px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>Progression</span>
                <span className="text-[7.5px] font-extrabold text-white">42%</span>
              </div>
              <div className="h-[2px] rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full bg-white" style={{ width: '42%' }} />
              </div>
            </div>
            <div className="px-2 pt-2.5 flex-1 overflow-hidden">
              <p className="text-[6px] font-bold uppercase tracking-[0.08em] px-1 mb-1" style={{ color: 'rgba(255,255,255,0.22)' }}>Construire</p>
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md mb-0.5" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <Zap size={8} strokeWidth={1.5} className="text-white flex-shrink-0" />
                <span className="text-[7.5px] font-semibold text-white flex-1 truncate">Jarvis IA</span>
                <span className="text-[5.5px] font-bold px-1 py-0.5 rounded flex-shrink-0" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>ACTIF</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md mb-0.5">
                <BookOpen size={8} strokeWidth={1.5} className="flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }} />
                <span className="text-[7.5px] font-medium flex-1 truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>Mon Parcours</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md mb-2">
                <Bot size={8} strokeWidth={1.5} className="flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }} />
                <span className="text-[7.5px] font-medium flex-1 truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>Mes agents IA</span>
                <span className="text-[5px] font-bold px-1 py-0.5 rounded flex-shrink-0" style={{ background: 'rgba(77,150,255,0.2)', color: '#4d96ff', border: '1px solid rgba(77,150,255,0.35)' }}>NEW</span>
              </div>
              <p className="text-[6px] font-bold uppercase tracking-[0.08em] px-1 mb-1" style={{ color: 'rgba(255,255,255,0.22)' }}>Outils IA</p>
              {[
                { icon: <Lightbulb size={7} strokeWidth={1.5} />, label: 'NicheFinder' },
                { icon: <CheckSquare size={7} strokeWidth={1.5} />, label: 'MarketPulse' },
                { icon: <TrendingUp size={7} strokeWidth={1.5} />, label: 'FlipCalc' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 px-2 py-1 rounded-md mb-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <span className="flex-shrink-0">{icon}</span>
                  <span className="text-[7px] truncate">{label}</span>
                </div>
              ))}
              <p className="text-[6px] font-bold uppercase tracking-[0.08em] px-1 mb-1 mt-1.5" style={{ color: 'rgba(255,255,255,0.22)' }}>Ressources</p>
              {[
                { icon: <FolderOpen size={7} strokeWidth={1.5} />, label: 'Mes Projets' },
                { icon: <BookOpen size={7} strokeWidth={1.5} />, label: 'Bibliothèque' },
                { icon: <CheckSquare size={7} strokeWidth={1.5} />, label: 'Checklist' },
                { icon: <Wrench size={7} strokeWidth={1.5} />, label: 'Boîte à outils' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 px-2 py-1 rounded-md mb-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <span className="flex-shrink-0">{icon}</span>
                  <span className="text-[7px] truncate">{label}</span>
                </div>
              ))}
              <p className="text-[6px] font-bold uppercase tracking-[0.08em] px-1 mb-1 mt-1.5" style={{ color: 'rgba(255,255,255,0.22)' }}>Bonus</p>
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md mb-0.5" style={{ background: 'rgba(204,93,232,0.08)', color: '#cc5de8' }}>
                <ClaudeIcon size={7} className="flex-shrink-0" />
                <span className="text-[7px] font-medium flex-1 truncate">Claude 360°</span>
                <span className="text-[5px] font-bold px-1 py-0.5 rounded flex-shrink-0" style={{ background: 'rgba(204,93,232,0.15)', color: '#cc5de8', border: '1px solid rgba(204,93,232,0.3)' }}>BONUS</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md mb-0.5" style={{ background: 'rgba(37,211,102,0.08)', color: '#25D366' }}>
                <WhatsAppIcon size={7} className="flex-shrink-0" />
                <span className="text-[7px] font-medium flex-1 truncate">WhatsApp Buildrs</span>
                <span className="text-[5px] font-bold px-1 py-0.5 rounded flex-shrink-0" style={{ background: 'rgba(37,211,102,0.15)', color: '#25D366', border: '1px solid rgba(37,211,102,0.3)' }}>BONUS</span>
              </div>
            </div>
            <div className="p-2">
              <div className="rounded-lg bg-white p-2">
                <p className="text-[5.5px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(9,9,11,0.45)' }}>Envie d'aller + vite ?</p>
                <p className="text-[7.5px] font-semibold text-[#09090b]">Rejoindre la Cohorte →</p>
              </div>
            </div>
          </div>

          {/* Main content — Dashboard style */}
          <div className="flex-1 p-3 overflow-hidden flex flex-col gap-2.5">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-extrabold text-white" style={{ letterSpacing: '-0.02em' }}>Mon Parcours</p>
                <p className="text-[6.5px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Voici ta progression Blueprint</p>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ animation: 'autopilot-pulse 2s ease-in-out infinite' }} />
                <span className="text-[6.5px] font-semibold" style={{ color: '#22c55e' }}>CLAUDE ACTIF</span>
              </div>
            </div>

            {/* Stat bar */}
            <div className="flex items-center rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {[
                { label: 'Modules', value: '4/6'  },
                { label: 'Tâches',  value: '24'   },
                { label: 'Score',   value: '72%'  },
              ].map(({ label, value }, i) => (
                <div key={label} className="flex-1 flex flex-col items-center" style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                  <p className="text-[13px] font-extrabold text-white leading-none" style={{ letterSpacing: '-0.03em' }}>{value}</p>
                  <p className="text-[6px] uppercase tracking-wider mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Jarvis greeting bubble */}
            <div className="flex items-start gap-1.5">
              <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #cc5de8, #4d96ff)', boxShadow: '0 0 8px rgba(204,93,232,0.4)' }}>
                <Zap size={9} strokeWidth={2} className="text-white" />
              </div>
              <div className="rounded-xl rounded-tl-sm px-2.5 py-1.5 flex-1" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>
                <p className="text-[7px] font-bold mb-0.5" style={{ background: 'linear-gradient(90deg, #cc5de8, #4d96ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Jarvis</p>
                <p className="text-[8px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>Bonjour ! Je suis Jarvis, ton copilote IA. Dis-moi où tu en es — je te guide pour la prochaine étape.</p>
              </div>
            </div>

            {/* Chat input */}
            <div className="rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-[8px] mb-2" style={{ color: 'rgba(255,255,255,0.2)' }}>Parle à Jarvis...</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {[
                    <svg key="attach" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>,
                    <svg key="globe" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>,
                    <svg key="code" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
                  ].map((icon, i) => (
                    <div key={i} className="w-5 h-5 rounded-full flex items-center justify-center" style={{ color: 'rgba(255,255,255,0.3)' }}>{icon}</div>
                  ))}
                </div>
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.9)' }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="2.5"><path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v3M8 22h8"/></svg>
                </div>
              </div>
            </div>

            {/* Étapes */}
            <div>
              <p className="text-[6.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.28)' }}>Checklist en cours</p>
              <div className="flex flex-col gap-1">
                {[
                  { label: 'Trouver & Valider',    done: true  },
                  { label: 'Préparer & Designer',  done: true  },
                  { label: 'Construire',           done: false, active: true },
                  { label: 'Déployer & Monétiser', done: false, active: false },
                ].map(({ label, done, active }) => (
                  <div key={label} className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: active ? 'rgba(255,255,255,0.04)' : 'transparent', border: active ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent' }}>
                    <div className="w-3 h-3 rounded flex items-center justify-center flex-shrink-0" style={{ background: done ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.05)', border: done ? 'none' : '1px solid rgba(255,255,255,0.12)' }}>
                      {done && <Check size={5} strokeWidth={3.5} className="text-[#09090b]" />}
                    </div>
                    <span className="text-[7.5px] flex-1 truncate" style={{ color: done ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.85)', textDecoration: done ? 'line-through' : 'none' }}>{label}</span>
                    {active && <span className="text-[5.5px] font-bold px-1 py-0.5 rounded-full" style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308', border: '1px solid rgba(234,179,8,0.25)' }}>EN COURS</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-3 p-3 overflow-hidden" style={{ width: '115px', flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <p className="text-[6.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.28)' }}>Score de viabilité</p>
              <div className="rounded-lg py-2.5 text-center" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                <span className="font-extrabold text-white leading-none" style={{ fontSize: '26px', letterSpacing: '-0.04em' }}>50</span>
                <p className="text-[6.5px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Idée fortement validée</p>
              </div>
            </div>
            <div>
              <p className="text-[6.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.28)' }}>Stack</p>
              <div className="flex flex-col gap-1">
                {[
                  { Icon: BrandIcons.anthropic, label: 'Claude Code' },
                  { Icon: BrandIcons.supabase,  label: 'Supabase'    },
                  { Icon: BrandIcons.vercel,    label: 'Vercel'      },
                  { Icon: BrandIcons.resend,    label: 'Resend'      },
                  { Icon: BrandIcons.hostinger, label: 'Hostinger'   },
                  { Icon: BrandIcons.stripe,    label: 'Stripe'      },
                  { Icon: BrandIcons.github,    label: 'GitHub'      },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex items-center justify-between px-1.5 py-1 rounded" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-1">
                      <Icon className="w-2.5 h-2.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.6)' }} />
                      <span className="text-[7px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(74,222,128,0.8)' }} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[6.5px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.28)' }}>MRR estimé</p>
              <div className="h-px w-8 mb-1.5" style={{ background: 'rgba(255,255,255,0.12)' }} />
              <span className="text-[7px]" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'underline' }}>Calculer →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

// ─── STAR FIELD ───────────────────────────────────────────────────────────────
// Hardcoded star positions [cx%, cy%, r, opacity]
const STARS: [number, number, number, number][] = [
  [5,8,1,0.7],[12,3,0.8,0.45],[18,15,1.2,0.8],[25,5,0.6,0.35],[32,12,1,0.6],
  [38,7,1.5,0.85],[45,2,0.8,0.5],[52,18,1,0.65],[60,6,1.2,0.8],[68,11,0.7,0.4],
  [75,4,1,0.6],[82,16,1.3,0.9],[88,8,0.8,0.5],[94,13,1,0.7],[8,22,1.5,0.55],
  [20,28,0.8,0.35],[35,25,1,0.65],[48,30,1.2,0.5],[62,20,0.9,0.75],[78,32,1,0.6],
  [90,24,1.4,0.7],[15,40,0.7,0.4],[28,45,1,0.6],[42,38,1.3,0.8],[55,42,0.8,0.45],
  [70,35,1,0.65],[85,48,1.2,0.55],[3,55,0.9,0.35],[18,60,1.5,0.7],[33,52,0.7,0.45],
  [47,65,1,0.6],[60,58,1.2,0.75],[73,62,0.8,0.4],[87,55,1,0.65],[10,72,1.3,0.5],
  [25,68,0.8,0.6],[40,75,1,0.7],[55,70,1.5,0.4],[70,78,0.9,0.75],[85,72,1,0.6],
  [2,82,1.2,0.45],[15,88,0.7,0.65],[30,85,1,0.4],[45,92,1.3,0.6],[58,80,0.8,0.75],
  [72,90,1,0.5],[88,85,1.2,0.65],[95,78,0.9,0.35],[22,95,1,0.55],[50,95,0.8,0.45],
  [65,90,1.1,0.5],[80,95,0.7,0.6],[7,50,0.9,0.4],[93,50,1,0.5],[50,50,0.6,0.3],
]

function StarField() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        {STARS.map(([cx, cy, r, op], i) => (
          <circle key={i} cx={`${cx}%`} cy={`${cy}%`} r={r} fill="white" opacity={op} />
        ))}
      </svg>
    </div>
  )
}

function Hero({ onCTA }: { onCTA?: (e: React.MouseEvent) => void }) {
  return (
    <section className="relative overflow-hidden px-6 sm:px-10 pb-20 pt-[120px] sm:pt-[140px]">

      {/* Moon glow — top right */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: -80,
          right: -80,
          width: 420,
          height: 420,
          background: 'radial-gradient(circle, rgba(200,220,255,0.50) 0%, rgba(140,170,255,0.18) 30%, rgba(80,120,255,0.06) 55%, transparent 72%)',
          filter: 'blur(32px)',
          zIndex: 0,
        }}
      />

      <div className="relative mx-auto max-w-[700px] w-full flex flex-col items-center text-center">

          {/* Badge */}
          <Reveal>
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-border bg-background px-3 py-1.5 text-[12px] sm:text-[13px] text-muted-foreground">
              <div className="flex -space-x-1.5 shrink-0">
                {["/F2.webp", "/F4.webp", "/F5.webp", "/F6.webp"].map((src, i) => (
                  <img key={i} src={src} alt="" style={{ width: 22, height: 22, minWidth: 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, outline: '2px solid hsl(var(--background))' }} />
                ))}
              </div>
              <span>Rejoins les <strong className="font-semibold text-foreground">140+</strong> builders qui ont déjà lancé</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted-foreground/50"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </Reveal>

          {/* H1 */}
          <Reveal delay={0.1}>
            <h1
              className="mb-7 text-foreground mx-auto max-w-[860px]"
              style={{ fontSize: "clamp(42px, 6.5vw, 84px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05 }}
            >
              Ton premier SaaS IA rentable.<br />En 6 jours.
            </h1>
          </Reveal>

          {/* Sub */}
          <Reveal delay={0.18}>
            <p className="mb-8 max-w-[520px] text-[16px] leading-[1.65] text-muted-foreground">
              De l'idée au premier client payant — guidé par l'IA, étape par étape. Génère tes premiers revenus en autopilote. <strong className="font-semibold text-foreground">Même sans savoir coder.</strong>
            </p>
          </Reveal>

          {/* Typing idea */}
          <Reveal delay={0.24}>
            <TypingIdea />
          </Reveal>

          {/* CTA */}
          <Reveal delay={0.3}>
            <div className="flex flex-col items-center gap-2 mb-5">
              <a href="#tarif" onClick={onCTA} className="cta-rainbow flex items-center gap-2 rounded-[10px] bg-foreground px-7 py-3.5 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 no-underline">
                Accéder au Blueprint — 27€ →
              </a>
              <p className="text-[12px] text-muted-foreground/50">
                Paiement unique · Accès à vie
              </p>
            </div>
          </Reveal>

          {/* Progress bar scarcity */}
          <Reveal delay={0.36}>
            <div className="mb-5" style={{ width: 'min(520px, calc(100vw - 48px))' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] text-muted-foreground/60">140/200 places réclamées</span>
                <span className="text-[12px] font-semibold text-foreground/70">30% restant</span>
              </div>
              <div className="h-2 w-full rounded-full bg-border overflow-hidden">
                <div className="h-full rounded-full bg-foreground" style={{ width: "70%" }} />
              </div>
            </div>
          </Reveal>

          {/* Bullets */}
          <Reveal delay={0.42}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {["Sans expertise en IA", "Débutant ou confirmé"].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-[13px] text-muted-foreground/70">
                  <Check size={13} strokeWidth={2.5} className="shrink-0 text-foreground/50" />
                  {item}
                </span>
              ))}
            </div>
          </Reveal>

      </div>
    </section>
  )
}

// ─── MARQUEE ──────────────────────────────────────────────────────────────────

function Marquee() {
  return (
    <section className="overflow-hidden border-y border-border bg-background py-10">
      <div className="mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 px-6 sm:px-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-muted-foreground/50 text-center">
          <span>Les outils utilisés — tous gratuits ou presque</span>
        </p>
      </div>
      <div className="overflow-hidden">
        <div
          className="flex items-center gap-10"
          style={{ width: "max-content", animation: "marquee-scroll 40s linear infinite" }}
        >
          {[...tools, ...tools, ...tools, ...tools].map(({ label, Icon }, i) => (
            <Icon
              key={i}
              aria-label={label}
              className="h-6 w-6 shrink-0 text-foreground/30 transition-colors hover:text-foreground/60"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── STATS ────────────────────────────────────────────────────────────────────

function StatCard({ target, prefix, suffix, desc, sub, trigger }: { target: number; prefix: string; suffix: string; desc: string; sub?: string; trigger: boolean }) {
  const value = useCountUp(target, target >= 100 ? 1600 : 1200, trigger)
  return (
    <div className="bg-background px-6 py-10 text-center">
      <div
        className="mb-2 leading-none text-foreground whitespace-nowrap tabular-nums"
        style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 800, letterSpacing: "-0.04em" }}
      >
        {prefix}{value}{suffix}
      </div>
      <p className="text-[14px] leading-relaxed text-muted-foreground">{desc}</p>
      {sub && (
        <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.09em] text-foreground/40">{sub}</p>
      )}
    </div>
  )
}

function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTriggered(true) },
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="bg-background">
      {/* Stats grid */}
      <div ref={ref} className="mx-auto max-w-[1100px] px-6 pt-20 pb-0">
        <div
          className="grid grid-cols-1 sm:grid-cols-3 overflow-hidden rounded-2xl border border-border"
          style={{ background: "hsl(var(--border))", gap: "1px" }}
        >
          {stats.map((s) => (
            <StatCard key={s.suffix + s.target} {...s} sub={s.sub} trigger={triggered} />
          ))}
        </div>
      </div>

      {/* Bridge → Pain */}
      <div
        className="mt-10 w-full h-10"
        style={{ background: "#09090b", borderRadius: "0 0 32px 32px" }}
      />
    </section>
  )
}

// ─── WHY SAAS ────────────────────────────────────────────────────────────────


// ─── PAIN ─────────────────────────────────────────────────────────────────────

const constatCards = [
  {
    Icon: Clock,
    title: "Tu scrolles depuis des mois sans rien lancer",
    desc: "Tout le monde s'improvise expert en IA. Tu vois passer 10 000 projets, tu notes, tu enregistres, tu likes. Mais tu ne lances rien. Perdu dans le trop-plein d'informations.",
  },
  {
    Icon: BookOpen,
    title: "997€ de formations. Zéro produit en ligne.",
    desc: "Tu as suivi des cours, regardé des heures de tutos, pris des notes. Mais à la fin, rien n'est live. Parce qu'on t'a appris la théorie, pas l'exécution.",
  },
  {
    Icon: Layers,
    title: "Trop d'outils, zéro direction",
    desc: "GPT, Gemini, Bolt, Replit, Cursor, Lovable, Make… Tu ne sais plus lequel utiliser ni dans quel ordre. Résultat : paralysie.",
  },
  {
    Icon: Zap,
    title: "Pendant ce temps, d'autres lancent",
    desc: "Sans background technique, sans équipe, sans budget. Ils n'ont rien de plus que toi. Ils ont juste un système et de la direction.",
  },
]

function Pain() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-[1100px] px-6">
        <Reveal><p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Le constat</p></Reveal>
        <Reveal delay={0.08}><h2 style={{ fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.1 }} className="mb-4 text-foreground">
          Tout le monde te parle d'IA.<br />Personne ne te montre comment en vivre.
        </h2></Reveal>
        <Reveal delay={0.16}><p className="max-w-[560px] text-[16px] leading-[1.65] text-muted-foreground">
          Pendant ce temps, des gens sans background technique lancent des micro-SaaS, des apps et des logiciels à +5 000€/mois. Ce n'est pas un manque de talent. C'est un manque de système et de direction.
        </p></Reveal>

        <Reveal delay={0.24}>
          <div className="mt-11 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {constatCards.map(({ Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-border bg-[#09090b] p-7 transition-colors hover:border-white/20">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Icon size={17} strokeWidth={1.5} className="text-white/80" />
                </div>
                <h3 className="mb-2 text-[15px] font-bold tracking-tight text-white">{title}</h3>
                <p className="text-[14px] leading-relaxed text-white/50">{desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-center text-[18px] sm:text-[20px] font-semibold text-foreground" style={{ letterSpacing: '-0.02em' }}>
            Et pourtant, d'autres y arrivent avec le bon système.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

// ─── WHY NOW ──────────────────────────────────────────────────────────────────

function RealProblemSection() {
  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-[900px] px-6 text-center">

        <Reveal>
          <p className="text-xs font-medium uppercase tracking-widest text-white/50">
            Le vrai problème
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="mt-4 font-bold text-foreground" style={{ fontSize: "clamp(36px, 6vw, 72px)", letterSpacing: "-0.04em", lineHeight: 1.05 }}>
            Le problème, c'est pas toi. C'est ta méthode.
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-8 max-w-[680px] text-base sm:text-lg leading-relaxed text-white/70">
            Il y a 1 an, créer un SaaS demandait 6 mois et 10 000€.
            Aujourd'hui : 6 jours et 27€. Le code n'est plus un problème.
            Ton job : avoir la vision, l'IA construit.
          </p>
        </Reveal>

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
    description: "Tu crées une fois. Ça se vend à l'infini. Sans stock, sans logistique.",
    icon: <Globe strokeWidth={1.5} size={20} />,
  },
  {
    id: "mrr",
    title: "Revenus récurrents",
    stat: "50 clients × 29€ = 1 450€/mois",
    description: "Chaque mois, le MRR s'accumule. Tu ne repars pas de zéro à chaque vente.",
    icon: <TrendingUp strokeWidth={1.5} size={20} />,
  },
  {
    id: "stack",
    title: "Dupliquer et automatiser",
    stat: "SaaS 1 → SaaS 2 → SaaS 3",
    description: "Tes agents IA gèrent tout. Toi, tu lances le suivant pendant qu'ils tournent.",
    icon: <Copy strokeWidth={1.5} size={20} />,
  },
  {
    id: "exit",
    title: "Revendre ou conserver",
    stat: "1 000€/mois → 20 000 à 40 000€",
    description: "Tu gardes le MRR, ou tu revends 20x à 40x. C'est toi qui décides.",
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
    <section className="relative py-20 bg-background overflow-hidden">
      <div className="mx-auto max-w-[1100px] px-6">

        {/* Header */}
        <div className="mb-12">
          <Reveal><p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
            Pourquoi un SaaS IA
          </p></Reveal>

          <Reveal delay={0.08}><h2
            style={{ fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.1 }}
            className="text-foreground max-w-[580px]"
          >
            Pourquoi le SaaS IA change tout en 2026.
          </h2></Reveal>
          <Reveal delay={0.16}><p className="mt-5 max-w-[520px] text-[15px] leading-[1.65] text-muted-foreground">
            Contrairement au e-commerce, aux agences IA, au freelance ou au coaching, un SaaS IA ne dépend ni de ton temps, ni de ton stock, ni de ta localisation.
          </p></Reveal>
        </div>

        {/* Two columns */}
        <Reveal delay={0.24}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left — Orbital */}
          <div className="flex justify-center">
            <OrbitalStack />
          </div>

          {/* Right — 4 cards 2×2 (full width on mobile) */}
          <div className="grid grid-cols-2 gap-3 items-stretch">
            {saasCardItems.map(({ id, title, stat, description, icon }) => (
              <div
                key={id}
                className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3 h-full"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground shrink-0">
                  <span className="[&>svg]:h-[18px] [&>svg]:w-[18px] [&>svg]:stroke-[1.5]">{icon}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-[14px] font-bold leading-snug text-foreground">{title}</h3>
                  <p className="text-[12px] leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── SAVINGS CHOC ─────────────────────────────────────────────────────────────

const savingsRows = [
  {
    label: "Trouver une idée rentable",
    Icon: Search,
    alone: "80h",
    withUs: "30 min",
    badge: "Marketplace incluse",
  },
  {
    label: "Créer et designer l'interface de ton SaaS",
    Icon: Layers,
    alone: "120h",
    withUs: "inclus",
    badge: "Templates prêts",
  },
  {
    label: "Construire le dashboard utilisateur",
    Icon: LayoutDashboard,
    alone: "60h",
    withUs: "inclus",
    badge: "Modules Blueprint",
  },
  {
    label: "Créer des workflows IA",
    Icon: Zap,
    alone: "40h+",
    withUs: "1 prompt",
    badge: "Agents intégrés",
  },
  {
    label: "Connecter tes utilisateurs",
    Icon: Users,
    alone: "40h",
    withUs: "1 prompt",
    badge: "Supabase Auth",
  },
  {
    label: "Gérer et protéger les données",
    Icon: Database,
    alone: "50h + failles",
    withUs: "configurée",
    badge: "RLS + schéma prêts",
  },
  {
    label: "Brancher les paiements",
    Icon: Banknote,
    alone: "15h",
    withUs: "15 min",
    badge: "Checkout + webhooks",
  },
  {
    label: "Paramétrer l'authentification",
    Icon: Shield,
    alone: "20h",
    withUs: "1 prompt",
    badge: "OAuth + Email",
  },
  {
    label: "Déployer en ligne",
    Icon: Globe,
    alone: "8h",
    withUs: "5 min",
    badge: "Vercel auto-deploy",
  },
  {
    label: "Stratégie de monétisation",
    Icon: TrendingUp,
    alone: "30h",
    withUs: "inclus",
    badge: "3 modèles inclus",
  },
  {
    label: "Budget outils",
    Icon: Receipt,
    alone: "300–500€",
    withUs: "0€",
    badge: "Stack validée au départ",
  },
  {
    label: "Bugs critiques & erreurs bloquantes",
    Icon: Wrench,
    alone: "inévitables",
    withUs: "zéro surprise",
    badge: "35+ SaaS testés",
  },
]

function SavingsChoc() {
  return (
    <section className="relative overflow-hidden py-28" style={{ background: "#0a0a0a" }}>

      {/* Subtle radial glow center */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: 700,
          height: 400,
          background: "radial-gradient(ellipse, rgba(255,255,255,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[1100px] px-6">

        {/* Header */}
        <div className="mb-14 text-center">
          <Reveal><p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-white/35">
            Ce que ça coûte vraiment
          </p></Reveal>
          <Reveal delay={0.08}><h2
            style={{ fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1 }}
            className="mb-4 text-white"
          >
            Seul, tu perds.<br />Avec Buildrs, tu gagnes.
          </h2></Reveal>
          <Reveal delay={0.16}><p className="mx-auto max-w-[420px] text-[15px] leading-[1.6] text-white/45">
            On a fait toutes les erreurs — pour que tu n'en fasses aucune.
          </p></Reveal>
        </div>

        {/* Comparison table — desktop (md+) */}
        <Reveal delay={0.24}>
        <div className="mx-auto max-w-[880px] hidden md:block overflow-hidden rounded-2xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          {/* Column headers */}
          <div className="grid" style={{ gridTemplateColumns: "1fr 130px 180px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="px-6 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/20" />
            <div className="flex items-center justify-center px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35" style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", background: "rgba(239,68,68,0.04)" }}>Seul</div>
            <div className="flex items-center justify-center px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", background: "rgba(34,197,94,0.05)", color: "#22c55e" }}>Avec Buildrs</div>
          </div>
          {savingsRows.map(({ label, Icon, alone, withUs, badge }, i) => (
            <div key={label} className="grid" style={{ gridTemplateColumns: "1fr 130px 180px", borderBottom: i < savingsRows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div className="flex items-center gap-3.5 px-6 py-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <Icon size={14} strokeWidth={1.5} className="text-white/35" />
                </div>
                <span className="text-[13px] font-medium leading-snug text-white/60">{label}</span>
              </div>
              <div className="flex items-center justify-center px-4 py-4" style={{ borderLeft: "1px solid rgba(255,255,255,0.05)", background: "rgba(239,68,68,0.025)" }}>
                <span className="text-[14px] font-bold tabular-nums text-center" style={{ color: "rgba(239,68,68,0.70)" }}>{alone}</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 px-4 py-4" style={{ borderLeft: "1px solid rgba(255,255,255,0.05)", background: "rgba(34,197,94,0.03)" }}>
                <span className="text-[14px] font-bold tabular-nums text-green-400">{withUs}</span>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-white/20">{badge}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison — mobile cards (< md) */}
        <div className="md:hidden flex flex-col gap-2.5">
          {/* Header row */}
          <div className="grid grid-cols-2 gap-2 px-1 mb-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/25 text-center">Seul</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-center" style={{ color: "#22c55e" }}>Avec Buildrs</p>
          </div>
          {savingsRows.map(({ label, alone, withUs }) => (
            <div key={label} className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              {/* Label */}
              <div className="px-4 py-2.5" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[12px] font-medium text-white/55 leading-snug">{label}</p>
              </div>
              {/* Values */}
              <div className="grid grid-cols-2">
                <div className="flex items-center justify-center py-3.5 px-3" style={{ background: "rgba(239,68,68,0.05)", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="text-[17px] font-extrabold tabular-nums text-center leading-tight" style={{ color: "rgba(239,68,68,0.85)", letterSpacing: "-0.02em" }}>{alone}</span>
                </div>
                <div className="flex items-center justify-center py-3.5 px-3" style={{ background: "rgba(34,197,94,0.06)" }}>
                  <span className="text-[17px] font-extrabold tabular-nums text-center leading-tight text-green-400" style={{ letterSpacing: "-0.02em" }}>{withUs}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        </Reveal>

        {/* Bottom stat */}
        <p className="mt-10 text-center text-[15px] text-white/30">
          Tout ça pour{" "}
          <span className="font-bold text-white">27€</span>
          {" "}— paiement unique, accès à vie.
        </p>

      </div>
    </section>
  )
}

// ─── SYMBIOSE ─────────────────────────────────────────────────────────────────

const claudeCapabilities = [
  "Génère du code propre en quelques secondes",
  "Lit, modifie et organise tes fichiers directement",
  "Construit n'importe quelle feature que tu décris",
]

const claudeMissing = [
  "Ne sait pas quelle idée est rentable sur le marché",
  "N'a pas les prompts optimisés pour créer un SaaS",
  "Ne te dit pas si ton projet se vendra ou se revendera",
]

const buildrsAdds = [
  "Marketplace d'idées + validateur — score de viabilité sur 100",
  "Générateur de SaaS IA selon les tendances marché actuelles",
  "Match SaaS — le projet qui te correspond selon ton profil",
  "Système complet + bibliothèque de prompts pour Claude",
]

function Symbiose() {
  return (
    <section className="relative overflow-hidden py-24 bg-background">
      <div className="mx-auto max-w-[1100px] px-6">

        {/* Header — centré */}
        <div className="mb-12 text-center">
          <Reveal><p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
            La combinaison gagnante
          </p></Reveal>
          <Reveal delay={0.08}><h2
            style={{ fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1 }}
            className="mb-4 text-foreground"
          >
            Claude est ton bras armé.<br />Buildrs est ton cerveau augmenté.
          </h2></Reveal>
          <Reveal delay={0.16}><p className="mx-auto max-w-[540px] text-[17px] leading-[1.65] text-muted-foreground">
            Seul avec Claude, t'as le moteur. Avec Buildrs, t'as le GPS, le carburant et le mécanicien. L'un ne va pas sans l'autre.
          </p></Reveal>
        </div>

        {/* 2 cartes côte à côte */}
        <Reveal delay={0.24}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Claude seul */}
          <div className="rounded-2xl border border-border bg-card p-7">
            <div className="mb-5 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background">
                <ClaudeIcon size={16} />
              </div>
              <span className="text-[14px] font-bold text-foreground">Claude seul</span>
            </div>

            <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/50">
              Ce qu'il fait parfaitement
            </p>
            <ul className="mb-6 flex flex-col gap-2">
              {claudeCapabilities.map((c) => (
                <li key={c} className="flex items-start gap-2.5">
                  <Check size={13} strokeWidth={2.5} className="mt-[2px] shrink-0 text-foreground" />
                  <span className="text-[13px] leading-snug text-foreground">{c}</span>
                </li>
              ))}
            </ul>

            <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "rgba(239,68,68,0.55)" }}>
              Ce qui manque sans le système
            </p>
            <ul className="flex flex-col gap-2">
              {claudeMissing.map((c) => (
                <li key={c} className="flex items-start gap-2.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="mt-[2px] shrink-0" style={{ color: "rgba(239,68,68,0.5)" }}>
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                  <span className="text-[13px] leading-snug text-muted-foreground">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Buildrs + Claude */}
          <div className="rounded-2xl bg-foreground p-7">
            <div className="mb-5 flex items-center gap-2.5">
              <BuildrsIcon color="hsl(var(--background))" size={18} />
              <span className="text-[14px] font-bold text-background">Buildrs + Claude</span>
            </div>

            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-background/50">
              Ce qu'on apporte en plus
            </p>
            <ul className="flex flex-col gap-3">
              {buildrsAdds.map((c) => (
                <li key={c} className="flex items-start gap-2.5">
                  <Check size={13} strokeWidth={2.5} className="mt-[2px] shrink-0 text-background" />
                  <span className="text-[13px] leading-snug text-background/75">{c}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
        </Reveal>


      </div>
    </section>
  )
}

// ─── BEFORE / AFTER ──────────────────────────────────────────────────────────

const beforeItems = [
  { text: "40–80h perdues à chercher une idée rentable sur Reddit, PH, Flippa", metric: "40–80h" },
  { text: "300–500€ dépensés en outils testés, abandonnés ou mal configurés", metric: "300–500€" },
  { text: "3–6 mois avant d'être en ligne — si tu arrives au bout", metric: "3–6 mois" },
  { text: "Bugs de sécurité, paiements cassés, auth qui ne tient pas — projet abandonné", metric: "Bugs critiques" },
  { text: "Claude sans le bon système : du code, mais pas le bon projet", metric: "Direction perdue" },
]

const afterItems = [
  { text: "Idée validée en 30 minutes par nos agents sur données réelles", metric: "30 min" },
  { text: "Stack pro configurée dès le départ — zéro outil inutile, zéro budget gaspillé", metric: "0€ gaspillé" },
  { text: "Produit live, paiements branchés, emails automatiques — en 6 jours", metric: "6 jours" },
  { text: "Sécurité, auth, base de données : tout validé sur 35+ SaaS lancés avant toi", metric: "Zéro surprise" },
  { text: "Buildrs comme cerveau, Claude comme bras armé — toi tu pilotes", metric: "Tu encaisses" },
]

function BeforeAfter() {
  return (
    <section className="bg-muted py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">La transformation</p>
        <h2
          style={{ fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }}
          className="mb-4 text-foreground"
        >
          Sans Buildrs, tu tâtonnes.<br />Avec Buildrs, tu avances.
        </h2>
        <p className="mb-14 max-w-[520px] text-[17px] leading-[1.65] text-muted-foreground">
          La différence entre les deux, c'est des semaines de travail, des centaines d'euros, et un projet qui tient — ou pas.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* SANS BUILDRS */}
          <div className="rounded-2xl border border-border bg-card p-8">
            <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">Sans Buildrs</p>
            <ul className="flex flex-col gap-4">
              {beforeItems.map(({ text, metric }) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-muted-foreground/40"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </span>
                  <div className="flex-1">
                    <span className="text-[13px] font-bold tabular-nums" style={{ color: "rgba(239,68,68,0.65)" }}>{metric} — </span>
                    <span className="text-[13px] leading-[1.6] text-muted-foreground">{text}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* AVEC BUILDRS */}
          <div className="rounded-2xl border border-foreground/10 bg-foreground p-8">
            <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.12em] text-background/40">Avec Buildrs</p>
            <ul className="flex flex-col gap-4">
              {afterItems.map(({ text, metric }) => (
                <li key={text} className="flex items-start gap-3">
                  <span className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-background/10">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-background"><path d="M20 6L9 17l-5-5"/></svg>
                  </span>
                  <div className="flex-1">
                    <span className="text-[13px] font-bold text-background">{metric} — </span>
                    <span className="text-[13px] leading-[1.6] text-background/70">{text}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── WHAT YOU GET ─────────────────────────────────────────────────────────────

const dashTabs = [
  {
    id: "cockpit",
    label: "Cockpit",
    Icon: Zap,
    title: "Ton cockpit de pilotage",
    desc: "La checklist interactive étape par étape. Tu sais toujours exactement où tu en es — de l'idée au SaaS déployé.",
    bullets: [
      "Progression en temps réel sur les 4 phases",
      "50+ prompts testés, copiables en 1 clic",
      "Stack complète configurée et documentée",
    ],
    img: "/Dash-Accueil.webp",
    color: "#22c55e",
  },
  {
    id: "parcours",
    label: "Parcours",
    Icon: BookOpen,
    title: "Le parcours étape par étape",
    desc: "6 modules complets. Chaque leçon = une action concrète. Vidéos, exercices, prompts — de l'idée au produit monétisé.",
    bullets: [
      "6 modules avec contenu vidéo + texte",
      "Exercices pratiques à chaque étape",
      "Progression débloquée automatiquement",
    ],
    img: "/dash-parcours.jpg",
    color: "#4d96ff",
  },
  {
    id: "marketplace",
    label: "Marketplace",
    Icon: Search,
    title: "Marketplace d'idées SaaS IA",
    desc: "Des centaines d'idées analysées par nos agents depuis les vraies sources. Pas du ChatGPT — de la vraie data sur ce qui se vend.",
    bullets: [
      "Idées triées par rentabilité et viabilité",
      "Analyse concurrentielle incluse",
      "Modèle de prix suggéré pour chaque idée",
    ],
    img: "/dash-marketplace.webp",
    color: "#4d96ff",
  },
  {
    id: "validator",
    label: "Générateur & Validateur",
    Icon: BarChart2,
    title: "Génère et valide ton idée",
    desc: "Score de viabilité sur 100. MRR estimé. Scénario de revente. Tout basé sur des données réelles — avant de coder une ligne.",
    bullets: [
      "Score de viabilité sur 100",
      "Estimation MRR potentiel",
      "Scénario de revente inclus",
    ],
    img: "/Dash-Valider.webp",
    color: "#cc5de8",
  },
  {
    id: "community",
    label: "Communauté",
    Icon: Users,
    title: "Le canal privé Buildrs",
    desc: "Tu rejoins une communauté de builders actifs. Questions, retours, partages — Alfred et Chris répondent directement.",
    bullets: [
      "Canal WhatsApp privé Buildrs",
      "Accès direct à Alfred et Chris",
      "Retours sur ton projet en temps réel",
    ],
    img: "/dash-community.png",
    color: "#f59e0b",
  },
  {
    id: "tools",
    label: "Boîte à outils",
    Icon: Wrench,
    title: "Boîte à outils complète",
    desc: "Tous les outils de la stack avec guides de configuration pas à pas. Supabase, Stripe, Vercel, Resend — tout est documenté.",
    bullets: [
      "Guides de configuration pour chaque outil",
      "Templates prêts à copier-coller",
      "Mises à jour permanentes sur Claude",
    ],
    img: "/dash-outils.jpg",
    color: "#f97316",
  },
]

// ─── SAAS EXAMPLES ───────────────────────────────────────────────────────────

const saasExamples = [
  {
    badge: "PriceFlow",
    image: "/dash-marketplace.png",
    desc: "Ajuste les prix des e-commerçants Shopify en temps réel selon la concurrence et les stocks.",
    cible: "E-commerçants Shopify",
    mrr: "50 clients × 29€ = 1 450€/mois",
    temps: "5 jours",
    author: "Thomas",
    initials: "T",
    stars: 4,
  },
  {
    badge: "BrewApp",
    image: "/dash-generator.png",
    desc: "Carnet de dégustation pour amateurs de café — origines, profils, méthodes d'extraction.",
    cible: "Coffee lovers & baristas",
    mrr: "100 users × 9€ = 900€/mois",
    temps: "4 jours",
    author: "Chris",
    photo: "/Chris_opt.jpg",
    stars: 5,
  },
  {
    badge: "StayTrack",
    image: "/dash-cockpit.png",
    desc: "Gestion de locations : loyers, charges, taux d'occupation, alertes automatiques.",
    cible: "Propriétaires multi-biens",
    mrr: "30 clients × 49€ = 1 470€/mois",
    temps: "6 jours",
    author: "Julie",
    initials: "J",
    stars: 4,
  },
]

function SaasExamples() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-[1100px] px-6">

        <Reveal><p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Exemples</p></Reveal>
        <Reveal delay={0.08}>
          <h2
            style={{ fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }}
            className="mb-4 text-foreground"
          >
            De l'idée au produit live.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mb-14 max-w-[560px] text-[15px] md:text-[17px] leading-[1.65] text-muted-foreground">
            Des exemples concrets de SaaS réalisables avec Blueprint — en moins d'une semaine.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {saasExamples.map((ex, i) => (
            <Reveal key={ex.badge} delay={0.1 + i * 0.08}>
              <div
                className="flex flex-col rounded-2xl overflow-hidden"
                style={{ border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
              >
                {/* Screenshot */}
                <div className="relative overflow-hidden" style={{ height: 200, background: 'hsl(var(--muted))' }}>
                  <img
                    src={ex.image}
                    alt={ex.badge}
                    className="w-full h-full object-cover object-top"
                    style={{ opacity: 0.9 }}
                  />
                  {/* Badge overlay */}
                  <span
                    className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-[0.14em] px-2.5 py-1 rounded-full"
                    style={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                  >
                    {ex.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 gap-4">
                  <p className="text-[14px] leading-[1.6] text-muted-foreground">{ex.desc}</p>

                  {/* Metadata */}
                  <div className="flex flex-col gap-2 text-[12px]">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold uppercase tracking-[0.08em] text-muted-foreground/60" style={{ minWidth: 90 }}>Cible</span>
                      <span className="text-foreground font-medium">{ex.cible}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold uppercase tracking-[0.08em] text-muted-foreground/60" style={{ minWidth: 90 }}>MRR potentiel</span>
                      <span className="text-foreground font-medium">{ex.mrr}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold uppercase tracking-[0.08em] text-muted-foreground/60" style={{ minWidth: 90 }}>Temps</span>
                      <span className="text-foreground font-medium">{ex.temps}</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <hr className="border-border" />

                  {/* Avatar + stars */}
                  <div className="flex items-center gap-3">
                    {ex.photo ? (
                      <img src={ex.photo} alt={ex.author} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded-full flex items-center justify-center text-[12px] font-bold text-foreground" style={{ background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}>
                        {ex.initials}
                      </div>
                    )}
                    <span className="text-[13px] font-medium text-foreground">{ex.author}</span>
                    <span className="ml-auto text-[13px]" style={{ letterSpacing: '0.05em' }}>
                      {'★'.repeat(ex.stars)}{'☆'.repeat(5 - ex.stars)}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  )
}

function WhatYouGet() {
  const [activeTab, setActiveTab] = useState(0)
  const [direction, setDirection] = useState(1)

  const handleTab = (i: number) => {
    setDirection(i >= activeTab ? 1 : -1)
    setActiveTab(i)
  }

  const tab = dashTabs[activeTab]

  return (
    <section className="relative overflow-hidden py-28" style={{ background: "#0a0a0a" }}>
      <div className="relative mx-auto max-w-[1100px] px-6">

        {/* Header */}
        <div className="mb-12 text-center">
          <Reveal><p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-white/35">
            Ce que tu vas recevoir
          </p></Reveal>
          <Reveal delay={0.08}><h2
            style={{ fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1 }}
            className="mb-4 text-white"
          >
            Pas un PDF. Pas une vidéo.<br />Un système complet piloté par l'IA.
          </h2></Reveal>
          <Reveal delay={0.16}><p className="mx-auto max-w-[480px] text-[15px] leading-[1.6] text-white/45">
            Trouve ton idée. Valide-la. Construis-la. Monétise-la. Tout dans un seul cockpit.
          </p></Reveal>
        </div>

        {/* Tab nav */}
        <Reveal delay={0.2}>
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {dashTabs.map((t, i) => {
              const active = i === activeTab
              return (
                <button
                  key={t.id}
                  onClick={() => handleTab(i)}
                  className="flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-200"
                  style={{
                    background: active ? "#ffffff" : "rgba(255,255,255,0.06)",
                    color: active ? "#09090b" : "rgba(255,255,255,0.45)",
                    border: active ? "1px solid rgba(255,255,255,0.9)" : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <t.Icon size={14} strokeWidth={1.5} />
                  {t.label}
                </button>
              )
            })}
          </div>
        </Reveal>

        {/* Content panel */}
        <Reveal delay={0.28}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "#111113", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-2"
            >
              {/* Left — text */}
              <div className="flex flex-col justify-center gap-6 p-8 lg:p-10">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: `${tab.color}18`, border: `1px solid ${tab.color}35` }}
                >
                  <tab.Icon size={18} strokeWidth={1.5} style={{ color: tab.color }} />
                </div>
                <div>
                  <h3 className="mb-3 text-[20px] font-bold text-white leading-snug">{tab.title}</h3>
                  <p className="text-[14px] leading-[1.7] text-white/50">{tab.desc}</p>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {tab.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5">
                      <div className="mt-[6px] h-[5px] w-[5px] shrink-0 rounded-full" style={{ background: tab.color }} />
                      <span className="text-[13px] text-white/60">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — screenshot */}
              <div
                className="relative overflow-hidden flex items-center justify-center"
                style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", minHeight: 220 }}
              >
                <img
                  src={tab.img}
                  alt={tab.title}
                  loading="lazy"
                  className="w-full object-contain object-top lg:h-full lg:object-cover"
                  style={{ maxHeight: 380 }}
                />
              </div>
            </motion.div>
          </div>
        </Reveal>

        {/* Tab dots indicator */}
        <div className="mt-5 flex justify-center gap-1.5">
          {dashTabs.map((_, i) => (
            <button
              key={i}
              onClick={() => handleTab(i)}
              className="rounded-full transition-all duration-200"
              style={{
                width: i === activeTab ? 20 : 6,
                height: 6,
                background: i === activeTab ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>

        {/* Axes de mise à jour — marquee */}
        <div className="mt-14 overflow-hidden border-y border-white/[0.07] py-4">
          <div
            className="flex gap-10 whitespace-nowrap"
            style={{ animation: "marquee-scroll 28s linear infinite", width: "max-content" }}
          >
            {[
              "Nouveaux skills", "Mises à jour Claude", "Nouveaux prompts",
              "Nouveaux plugins", "Nouvelles vidéos", "Nouvelles stratégies IA",
              "Retours terrain Buildrs Lab", "Nouvelles intégrations",
              "Nouveaux skills", "Mises à jour Claude", "Nouveaux prompts",
              "Nouveaux plugins", "Nouvelles vidéos", "Nouvelles stratégies IA",
              "Retours terrain Buildrs Lab", "Nouvelles intégrations",
            ].map((label, i) => (
              <span key={i} className="inline-flex items-center gap-2.5 text-[13px] font-medium text-white/40">
                <span className="h-1 w-1 rounded-full bg-white/20 shrink-0" />
                Mise à jour — {label}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}


const whatsappTestimonials = [
  { img: "/Temoignages/IMG_8889.jpeg", label: "Abonnement 99€/mois lancé", sub: "SaaS live + deals entreprise en cours" },
  { img: "/Temoignages/IMG_8890.jpeg", label: "Martin — stratégie validée en 20 min", sub: "Scraping pro avec Apify + Claude Code" },
  { img: "/Temoignages/IMG_8891.jpeg", label: "10 bêta testeurs — 3 white-labels signés", sub: "Objectif 10-12K€/mois sur mars" },
  { img: "/Temoignages/IMG_8892.jpeg", label: "Stan — \"ça change des vendeurs de tapis\"", sub: "MVP en cours, accompagnement actif" },
]

function UniqueTestimonialSection() {
  const doubled = [...whatsappTestimonials, ...whatsappTestimonials]
  return (
    <section id="resultats" className="py-24 overflow-hidden" style={{ background: "#0a0a0a" }}>
      <div className="mb-14 text-center px-6">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-white/40">
          Ils l'ont fait
        </p>
        <h2
          style={{ fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }}
          className="text-white"
        >
          Les messages de notre WhatsApp.
        </h2>
        <p className="mx-auto mt-4 max-w-[520px] text-[17px] leading-[1.65] text-white/50">
          Sans background technique. Sans équipe. Avec Claude et le système Blueprint.
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10" style={{ background: "linear-gradient(to right, #0a0a0a, transparent)" }} />
        <div
          className="flex"
          style={{ width: "max-content", animation: "marquee-scroll 28s linear infinite" }}
        >
          {doubled.map((item, i) => (
            <div
              key={i}
              className="mx-3 w-80 shrink-0 rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#141414" }}
            >
              <img
                src={item.img}
                alt={item.label}
                loading="lazy"
                className="w-full h-auto block"
              />
              <div className="px-4 py-3">
                <p className="text-[13px] font-semibold text-white leading-snug">{item.label}</p>
                <p className="mt-0.5 text-[11px] text-white/40">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10" style={{ background: "linear-gradient(to left, #0a0a0a, transparent)" }} />
      </div>

      <p className="mt-10 text-center text-[13px] text-white/25 px-6">
        Messages réels — Canal WhatsApp Buildrs
      </p>
    </section>
  )
}

// ─── PRICING ─────────────────────────────────────────────────────────────────────────────

function Pricing({ onCTA }: { onCTA?: (e: React.MouseEvent) => void }) {
  return (
    <section id="tarif" className="bg-muted py-24 text-center">
      <div className="mx-auto max-w-[1100px] px-6">
        <Reveal><p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Tarif</p></Reveal>
        <Reveal delay={0.08}><h2 style={{ fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.1 }} className="mb-4 text-foreground">
          Tout ce qu'il te faut pour lancer ton SaaS IA.
        </h2></Reveal>
        <Reveal delay={0.16}><p className="mx-auto max-w-[480px] text-[17px] leading-[1.65] text-muted-foreground">
          Un seul paiement. Accès à vie. Zéro risque.
        </p></Reveal>

        {/* Shine border wrapper */}
        <Reveal delay={0.24}>
        <div className="bump-neon relative mx-auto mt-12 max-w-[560px]" style={{ borderRadius: 22 }}>
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
            <ul className="mb-7 flex flex-col gap-3 text-[14px]">
              {features.map((f) => (
                <li key={f.title} className="flex items-start gap-2.5">
                  <Check size={15} strokeWidth={2} className="mt-[2px] shrink-0 text-foreground" />
                  <span className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{f.title}</span>
                    {' '}— {f.desc}
                  </span>
                </li>
              ))}
            </ul>

            {/* Bonus — single line */}
            <div className="mb-7 flex items-start gap-2.5 rounded-xl border border-dashed border-border bg-muted px-4 py-3.5">
              <Zap size={14} strokeWidth={1.5} className="mt-[2px] shrink-0 text-foreground" />
              <p className="text-[13px] text-muted-foreground">
                <span className="font-semibold text-foreground">Bonus pour les 200 premiers</span>
                {' '}— Jarvis IA + Toolbox Pro + accès WhatsApp privé Buildrs.
              </p>
            </div>

            {/* CTA */}
            <a
              href="#"
              onClick={onCTA}
              className="cta-rainbow relative flex w-full items-center justify-center gap-2 rounded-[10px] bg-foreground py-3.5 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 no-underline"
            >
              Accéder au Blueprint — 27€ →
            </a>
            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-border bg-muted px-4 py-3">
              <Shield size={14} strokeWidth={1.5} className="shrink-0 text-foreground/60" />
              <p className="text-[13px] font-medium text-muted-foreground">
                <span className="font-semibold text-foreground">Satisfait ou remboursé — 30 jours.</span> Sans condition. Sans question.
              </p>
            </div>
            <p className="mt-3 text-center text-[12px] text-muted-foreground/60">
              Paiement sécurisé par Stripe · Accès immédiat · Aucun abonnement
            </p>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── TEAM ─────────────────────────────────────────────────────────────────────

// ── Pixel-art robot monochrome pour les cards team ──────────────────────────
function TeamRobot({ isAI }: { isAI?: boolean }) {
  const body = isAI ? "#a78bfa" : "rgba(255,255,255,0.88)"
  const dark = "#111113"
  const mid  = isAI ? "#7c3aed" : "rgba(255,255,255,0.45)"
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 96, height: 96 }}>
      {/* antennae */}
      <rect x="7"  y="0" width="2" height="3" fill={body}/>
      <rect x="15" y="0" width="2" height="3" fill={body}/>
      <rect x="5"  y="2" width="2" height="2" fill={body}/>
      <rect x="17" y="2" width="2" height="2" fill={body}/>
      {/* body */}
      <rect x="3" y="4" width="18" height="12" rx="2" fill={body}/>
      {/* eye sockets */}
      <rect x="6"  y="7" width="4" height="4" rx="1" fill={dark}/>
      <rect x="14" y="7" width="4" height="4" rx="1" fill={dark}/>
      {/* pupils */}
      <rect x="7"  y="8" width="2" height="2" fill={body}/>
      <rect x="15" y="8" width="2" height="2" fill={body}/>
      {/* mouth */}
      <rect x="9" y="13" width="6" height="2" rx="1" fill={mid}/>
      {/* legs */}
      <rect x="5"  y="17" width="4" height="4" rx="1" fill={body}/>
      <rect x="15" y="17" width="4" height="4" rx="1" fill={body}/>
      <rect x="4"  y="20" width="3" height="2" rx="1" fill={mid}/>
      <rect x="17" y="20" width="3" height="2" rx="1" fill={mid}/>
    </svg>
  )
}

type HologramVariant = 'a' | 'b' | 'c' | 'd'

const teamData: { uid: string; variant: HologramVariant; name: string; role: string; bio: string; photo?: string; isAI?: boolean }[] = [
  { uid: "alfred", variant: "a", name: "Alfred",  role: "CEO & Co-Founder",  bio: "Développement produit, vision et architecture du groupe.", photo: "/Alfred_opt.jpg" },
  { uid: "chris",  variant: "b", name: "Chris",   role: "CCO & Vibe Coder",  bio: "Marketing, acquisition et développement commercial.", photo: "/Chris_opt.jpg" },
  { uid: "tim",    variant: "c", name: "Tim",     role: "CTO & Vibe Coder",  bio: "Implémentation IA et accompagnement des membres du Lab.", photo: "/Tim_opt.jpg" },
  { uid: "jarvis", variant: "d", name: "Jarvis",  role: "Chief AI Officer",  bio: "Intelligence Artificielle Autonome. Pilote 40 agents IA chez Buildrs.", isAI: true },
]

function TeamSection() {
  return (
    <section className="relative py-24 overflow-hidden" style={{ background: "#0a0a0a" }}>
      <div className="mx-auto max-w-[1100px] px-6">

        {/* Header */}
        <div className="mb-14 text-center">
          <Reveal><div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5" style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">Qui sommes-nous</span>
          </div></Reveal>
          <Reveal delay={0.08}><h2
            style={{ fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.06 }}
            className="text-white"
          >
            Des entrepreneurs IA qui construisent pour vous.
          </h2></Reveal>
        </div>

        {/* Cards */}
        <Reveal delay={0.24}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {teamData.map(({ uid, variant, name, role, bio, photo, isAI }) => (
            <div
              key={uid}
              className="rounded-2xl overflow-hidden"
              style={{ background: "#111113", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="h-52 flex items-center justify-center overflow-hidden" style={{ background: isAI ? "rgba(139,92,246,0.07)" : "rgba(255,255,255,0.025)" }}>
                {photo ? (
                  <img src={photo} alt={name} loading="lazy" className="w-full h-full object-cover object-top" />
                ) : (
                  <TeamRobot isAI={isAI} />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-[14px] font-bold text-white">{name}</p>
                  {isAI && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ background: "rgba(168,85,247,0.15)", color: "rgba(168,85,247,0.9)", border: "1px solid rgba(168,85,247,0.2)" }}>AI</span>
                  )}
                </div>
                <p className="text-[11px] text-white/40 mb-2">{role}</p>
                <p className="text-[12px] text-white/55 leading-relaxed">{bio}</p>
              </div>
            </div>
          ))}
        </div>
        </Reveal>

        {/* Credibility block */}
        <div
          className="rounded-2xl px-8 py-8"
          style={{ background: "#111113", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-8">
            {/* Stats */}
            <div className="flex gap-8 shrink-0">
              <div className="text-center">
                <p className="text-[36px] font-extrabold text-white leading-none" style={{ letterSpacing: "-0.04em" }}>+35</p>
                <p className="text-[11px] text-white/35 mt-1 uppercase tracking-wider">SaaS créés</p>
              </div>
              <div className="text-center">
                <p className="text-[36px] font-extrabold text-white leading-none" style={{ letterSpacing: "-0.04em" }}>3</p>
                <p className="text-[11px] text-white/35 mt-1 uppercase tracking-wider">Revendus 5 chiffres</p>
              </div>
            </div>
            {/* Divider */}
            <div className="hidden sm:block w-px self-stretch" style={{ background: "rgba(255,255,255,0.08)" }} />
            {/* Copy */}
            <div>
              <p className="text-[15px] font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
                Pas des coachs. Des geeks, experts en produit et en IA.
              </p>
              <p className="text-[13px] leading-[1.7] text-white/45">
                On utilise l'intelligence artificielle comme levier d'enrichissement — pas pour en parler, pour en vivre. +35 SaaS créés, déployés et mis sur le marché, pour des entreprises et pour nous. 3 revendus à 5 chiffres. On a décidé, il y a quelques mois, de rendre ce système accessible. Buildrs, c'est un mouvement. Pas une formation.
              </p>
            </div>
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
    <section id="faq" className="relative py-24 overflow-hidden">
      <div className="mx-auto max-w-[1100px] px-6">
        <Reveal><p className="mb-3 text-center text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">FAQ</p></Reveal>
        <Reveal delay={0.08}><h2 style={{ fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }} className="mb-12 text-center text-foreground">
          Tes questions.<br />Nos réponses.
        </h2></Reveal>

        <Reveal delay={0.24}>
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
        </Reveal>
      </div>
    </section>
  )
}

// ─── FINAL CTA ────────────────────────────────────────────────────────────────

function FinalCTA({ onCTA }: { onCTA?: (e: React.MouseEvent) => void }) {
  return (
    <section className="relative overflow-hidden px-6 py-[120px] text-center">
      <StarField />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(160,160,255,0.07) 0%, transparent 70%)" }}
      />
      <h2
        className="mx-auto mb-[18px] max-w-[680px] text-foreground"
        style={{ fontSize: "clamp(40px, 6vw, 70px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05 }}
      >
        Ton premier produit IA est à 6 jours d'ici.
      </h2>
      <p className="mx-auto mb-9 max-w-[440px] text-[17px] leading-[1.65] text-muted-foreground">
        Pas dans 6 mois. Pas quand tu auras appris à coder. Pas quand tu auras trouvé le bon moment. En 6 jours.
      </p>
      <a href="#tarif" onClick={onCTA} className="cta-rainbow inline-flex items-center gap-2 rounded-[10px] bg-foreground px-8 py-4 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 no-underline">
        Commencer maintenant — 27€ (au lieu de 297€) →
      </a>
      <div className="mt-5 w-full max-w-[340px] mx-auto">
        <div className="flex items-center justify-between mb-1.5 text-[11px] text-muted-foreground/60">
          <span>110/200 places réclamées</span>
          <span>Ensuite 297€</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
          <div className="h-full rounded-full bg-foreground/70" style={{ width: "55%" }} />
        </div>
      </div>
    </section>
  )
}

// ─── PROGRAMME ───────────────────────────────────────────────────────────────

const programmeModules = [
  {
    num: "01", title: "Fondations",
    highlight: "Ta stratégie de lancement définie",
    color: "#4d96ff", bg: "rgba(77,150,255,0.07)", border: "rgba(77,150,255,0.20)",
    bullets: [
      "Tu comprends pourquoi l'IA fait 90% du travail à ta place",
      "Tu choisis le format adapté à ton profil : app, SaaS IA ou logiciel",
      "Tu choisis ta stratégie : copier, résoudre ou découvrir",
      "Tu poses ton objectif financier — le système s'adapte",
    ],
  },
  {
    num: "02", title: "Ton espace de travail",
    highlight: "Un environnement complet, configuré, prêt à builder",
    color: "#cc5de8", bg: "rgba(204,93,232,0.07)", border: "rgba(204,93,232,0.20)",
    bullets: [
      "Tu installes tout — un outil à la fois, guidé",
      "Ton environnement complet est prêt en une session",
      "Zéro configuration à refaire — c'est en place pour de bon",
    ],
  },
  {
    num: "03", title: "Trouver & Valider",
    highlight: "Ton idée validée et ta fiche produit prête à exécuter",
    color: "#f06595", bg: "rgba(240,101,149,0.07)", border: "rgba(240,101,149,0.20)",
    bullets: [
      "Tu trouves les SaaS IA rentables et tu t'en inspires",
      "Tu génères 5 idées rentables en un clic — tu choisis",
      "Tu valides ton marché en 30 minutes — tu décides",
      "Tu repars avec ta fiche produit : nom, cible, fonctionnalité star, prix",
    ],
  },
  {
    num: "04", title: "Design & Architecture",
    highlight: "Le design et l'architecture de ton produit validés — prêt à construire",
    color: "#f97316", bg: "rgba(249,115,22,0.07)", border: "rgba(249,115,22,0.20)",
    bullets: [
      "Tu crées ton identité visuelle en t'inspirant des meilleurs SaaS IA du marché",
      "Tu génères ton parcours utilisateur page par page",
      "Tu obtiens la structure technique de ton produit — prête à construire",
    ],
  },
  {
    num: "05", title: "Construire",
    highlight: "Un produit fonctionnel qui tourne",
    color: "#ef4444", bg: "rgba(239,68,68,0.07)", border: "rgba(239,68,68,0.20)",
    bullets: [
      "Tu décris ce que tu veux — l'IA génère ton produit",
      "Ta fonctionnalité principale est construite et fonctionnelle",
      "L'inscription utilisateur et l'onboarding sont en place",
    ],
  },
  {
    num: "06", title: "Déployer",
    highlight: "Ton produit en ligne, accessible au monde entier",
    color: "#22c55e", bg: "rgba(34,197,94,0.07)", border: "rgba(34,197,94,0.20)",
    bullets: [
      "Ton produit est mis en ligne en un clic — Vercel s'occupe de tout",
      "Ton domaine personnalisé est connecté",
      "Paiements et emails automatiques sont branchés et testés",
    ],
  },
  {
    num: "07", title: "Monétiser & Lancer",
    highlight: "Ta page de vente live, ta communication lancée, tes premiers euros en vue",
    color: "#f59f00", bg: "rgba(245,159,0,0.07)", border: "rgba(245,159,0,0.20)",
    bullets: [
      "Tu valides ta stratégie de prix : abonnement, unique, freemium",
      "Ta page de vente est créée par l'IA — tu ajustes, tu publies",
      "Ta stratégie de communication est posée — contenus, réseaux, pubs",
      "5 contenus de lancement générés — prêts à poster",
      "Ta première campagne configurée — le trafic arrive",
      "Premiers clients, premiers revenus",
    ],
  },
]

function Programme() {
  return (
    <section id="modules" className="relative overflow-hidden py-24 bg-background">
      <div className="mx-auto max-w-[1100px] px-6">

        {/* Header */}
        <Reveal><p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Le programme</p></Reveal>
        <Reveal delay={0.08}><h2
          style={{ fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }}
          className="mb-4 text-foreground"
        >
          1 Système rentable.<br />1 produit monétisé.
        </h2></Reveal>
        <Reveal delay={0.16}><p className="mb-16 max-w-[600px] text-[15px] md:text-[17px] leading-[1.65] text-muted-foreground">
          7 modules pour passer de l'idée au produit monétisé. Les IA qu'on utilise sont les meilleures du marché — et presque tous gratuits.
        </p></Reveal>

        {/* ── Timeline alternée ── */}
        <div className="relative">

          {/* Ligne verticale centrale — desktop uniquement */}
          <div
            className="absolute hidden md:block pointer-events-none"
            style={{
              left: '50%', top: 0, bottom: 0, width: 1,
              transform: 'translateX(-50%)',
              background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.08) 8%, rgba(255,255,255,0.08) 92%, transparent)',
            }}
          />

          {/* Mobile : colonne unique */}
          <div className="flex flex-col gap-5 md:hidden">
            {programmeModules.map((mod) => (
              <Reveal key={mod.num}>
                <div
                  className="rounded-2xl p-5"
                  style={{ background: mod.bg, border: `1px solid ${mod.border}` }}
                >
                  <span
                    className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.16em] mb-3 px-2.5 py-1 rounded-full"
                    style={{ color: mod.color, border: `1px solid ${mod.border}` }}
                  >
                    Module {mod.num}
                  </span>
                  <h3 className="text-[17px] font-bold text-foreground mb-1.5 leading-snug">{mod.title}</h3>
                  <p className="text-[12px] font-semibold mb-3" style={{ color: mod.color }}>{mod.highlight}</p>
                  <ul className="flex flex-col gap-2">
                    {mod.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2 text-[12px] leading-[1.55] text-muted-foreground">
                        <span className="mt-[5px] shrink-0 h-[4px] w-[4px] rounded-full" style={{ background: mod.color }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Desktop : alternance gauche / droite */}
          <div className="hidden md:flex flex-col gap-10">
            {programmeModules.map((mod, i) => {
              const isLeft = i % 2 === 0
              return (
                <Reveal key={mod.num} delay={0.08 + i * 0.06}>
                  <div
                    className="grid items-center"
                    style={{ gridTemplateColumns: '1fr 80px 1fr', gap: 0 }}
                  >
                    {/* Côté gauche */}
                    <div className={isLeft ? 'pr-8' : ''}>
                      {isLeft && (
                        <div
                          className="rounded-2xl p-6 transition-shadow duration-200 hover:shadow-lg"
                          style={{
                            background: mod.bg,
                            border: `1px solid ${mod.border}`,
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${mod.color}18` }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '' }}
                        >
                          <span
                            className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.16em] mb-3 px-2.5 py-1 rounded-full"
                            style={{ color: mod.color, border: `1px solid ${mod.border}` }}
                          >
                            Module {mod.num}
                          </span>
                          <h3 className="text-[18px] font-bold text-foreground mb-2 leading-snug">{mod.title}</h3>
                          <p className="text-[13px] font-semibold mb-4" style={{ color: mod.color }}>{mod.highlight}</p>
                          <ul className="flex flex-col gap-2">
                            {mod.bullets.map((b, j) => (
                              <li key={j} className="flex items-start gap-2.5 text-[13px] leading-[1.55] text-muted-foreground">
                                <span className="mt-[5px] shrink-0 h-[5px] w-[5px] rounded-full" style={{ background: mod.color }} />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Nœud central */}
                    <div className="flex justify-center relative z-10">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center text-[11px] font-bold"
                        style={{
                          background: 'hsl(var(--background))',
                          border: `2px solid ${mod.color}`,
                          color: mod.color,
                          boxShadow: `0 0 0 4px hsl(var(--background)), 0 0 16px ${mod.color}30`,
                        }}
                      >
                        {mod.num}
                      </div>
                    </div>

                    {/* Côté droit */}
                    <div className={!isLeft ? 'pl-8' : ''}>
                      {!isLeft && (
                        <div
                          className="rounded-2xl p-6 transition-shadow duration-200"
                          style={{
                            background: mod.bg,
                            border: `1px solid ${mod.border}`,
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${mod.color}18` }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '' }}
                        >
                          <span
                            className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.16em] mb-3 px-2.5 py-1 rounded-full"
                            style={{ color: mod.color, border: `1px solid ${mod.border}` }}
                          >
                            Module {mod.num}
                          </span>
                          <h3 className="text-[18px] font-bold text-foreground mb-2 leading-snug">{mod.title}</h3>
                          <p className="text-[13px] font-semibold mb-4" style={{ color: mod.color }}>{mod.highlight}</p>
                          <ul className="flex flex-col gap-2">
                            {mod.bullets.map((b, j) => (
                              <li key={j} className="flex items-start gap-2.5 text-[13px] leading-[1.55] text-muted-foreground">
                                <span className="mt-[5px] shrink-0 h-[5px] w-[5px] rounded-full" style={{ background: mod.color }} />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
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
        <SaasVehicle />
        <Symbiose />
        <Programme />
        <SavingsChoc />
        <WhatYouGet />
        <UniqueTestimonialSection />
        <Pricing onCTA={go} />
        <TeamSection />
        <FAQ />
        <FinalCTA onCTA={go} />
      </main>
      <StackedCircularFooter />
    </>
  )
}
