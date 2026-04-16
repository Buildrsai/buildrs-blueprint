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

// ── Countdown to launch end ───────────────────────────────────────────────────
const LAUNCH_END = new Date('2026-04-18T23:59:59')

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

const stats = [
  { target: 400, prefix: "+", suffix: "h",  desc: "économisées — de zéro à ton premier SaaS en ligne et monétisé" },
  { target: 500, prefix: "",  suffix: "€",  desc: "d'outils inutiles évités grâce à la stack validée dès le départ" },
  { target: 6,   prefix: "",  suffix: "j",  desc: "pour être en ligne, paiements branchés et premiers revenus" },
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
  { title: 'Le système en 4 phases', desc: "De l'idée au SaaS IA monétisé — checklist interactive, progression en temps réel." },
  { title: 'Marketplace d\'idées', desc: "Des centaines d'idées analysées par nos agents sur PH, Reddit, Flippa, IH. De la vraie data, pas du ChatGPT." },
  { title: 'Générateur d\'idées', desc: "Si tu n'as pas d'idée, nos agents en trouvent basées sur les tendances marché actuelles." },
  { title: 'Validateur d\'idées', desc: "Score de viabilité sur 100, estimation MRR potentiel, scénario de revente — avant de coder une ligne." },
  { title: 'Le cockpit Jarvis', desc: "Dashboard de pilotage — ton projet, ta progression, tes métriques, tout centralisé avec ton IA copilote." },
  { title: '50+ prompts testés', desc: "Copiables en un clic à chaque étape. Testés sur 35+ SaaS réels lancés par notre équipe." },
  { title: 'Stack configurée', desc: "Claude Code, Supabase, Vercel, Stripe, Resend — guides pas à pas, zéro temps perdu sur la conf." },
  { title: 'Sécurité & bonnes pratiques', desc: "Auth, RLS, variables d'environnement, HTTPS — tout ce qu'on a appris à nos dépens, condensé." },
  { title: 'Boîte à outils complète', desc: "Tous les outils avec leur guide de configuration, liens directs et alternatives testées." },
  { title: 'Accès à vie + mises à jour', desc: "Les nouvelles fonctionnalités Claude, les nouveaux prompts, les nouvelles ressources — automatiquement." },
  { title: 'Canal WhatsApp Buildrs', desc: "Accès au canal privé pour ne jamais être seul. Les builders qui réussissent s'entraident." },
]

// ─── ANNOUNCEMENT BAR ────────────────────────────────────────────────────────

function AnnouncementBar({ onCTA }: { onCTA?: (e: React.MouseEvent) => void }) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center gap-2 px-4"
      style={{
        height: 34,
        background: "hsl(var(--foreground))",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Flame size={12} strokeWidth={1.5} className="shrink-0 text-background/60" />
      <a
        href="#tarif"
        onClick={onCTA}
        className="text-[12px] font-medium text-background/80 no-underline hover:text-background transition-colors"
      >
        <ScarcityCountdown />
      </a>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-background/40"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </div>
  )
}

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
    <nav className="fixed left-0 right-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl" style={{ top: 34 }}>
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
  "Une application de matching pour entrepreneurs",
  "Un gestionnaire de prix pour e-commerce",
  "Un éditeur visuel d'agents IA",
  "Un assistant juridique pour auto-entrepreneurs",
  "Un CRM vocal pour commerciaux terrain",
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
      className="mb-8 flex items-center justify-between gap-3 rounded-2xl px-5 py-4 w-full max-w-[480px]"
      style={{
        background: '#111113',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Tu as une idée, l'IA lui donne vie
        </span>
        <div className="flex items-center gap-1" style={{ minHeight: '21px' }}>
          <span className="text-[14px] font-medium text-white/80 min-w-0 truncate">{text}</span>
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
    <section className="relative overflow-hidden px-6 sm:px-10 pb-20 pt-[154px] sm:pt-[174px]">

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
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-[12px] sm:text-[13px] text-muted-foreground">
              <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-foreground" fill="currentColor">
                <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/>
              </svg>
              <span>Propulsé par Claude Code</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted-foreground/50"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </Reveal>

          {/* H1 */}
          <Reveal delay={0.1}>
            <h1
              className="mb-7 text-foreground mx-auto max-w-[860px]"
              style={{ fontSize: "clamp(34px, 5vw, 62px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.06 }}
            >
              Le système exact pour créer et monétiser ton premier SaaS IA.
            </h1>
          </Reveal>

          {/* Sub */}
          <Reveal delay={0.18}>
            <p className="mb-8 max-w-[520px] text-[16px] leading-[1.65] text-muted-foreground">
              Un système guidé, de l'idée au premier euro. Zéro ligne de code. Claude Code construit. Toi tu pilotes.{" "}
              <strong className="font-semibold text-foreground">Résultat en moins de 6 jours.</strong>
            </p>
          </Reveal>

          {/* Typing idea */}
          <Reveal delay={0.24}>
            <TypingIdea />
          </Reveal>

          {/* CTAs + Trust pills */}
          <Reveal delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
              <a href="#tarif" onClick={onCTA} className="cta-rainbow flex items-center gap-2 rounded-[10px] bg-foreground px-7 py-3.5 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 no-underline">
                Accéder au Blueprint — 27€ →
              </a>
            </div>

            {/* Trust pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
              {["Paiement unique", "Accès à vie"].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-[12px] text-muted-foreground/60">
                  <Check size={11} strokeWidth={2.5} className="shrink-0 text-foreground/40" />
                  {item}
                </span>
              ))}
            </div>
          </Reveal>

          {/* Social proof avatars */}
          <Reveal delay={0.36}>
            <div className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1.5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.35)' }}>
              <div className="flex -space-x-1.5">
                {["/F2.webp", "/F4.webp", "/F5.webp", "/F6.webp"].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    style={{ width: 30, height: 30, minWidth: 30, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, outline: '2px solid hsl(var(--background))' }}
                  />
                ))}
              </div>
              <p className="pl-2.5 pr-1 text-[12px] text-muted-foreground">
                <strong className="font-semibold text-foreground">110+</strong> builders ont déjà lancé
              </p>
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
          <span>Créé avec les meilleurs outils</span>
          <span className="hidden sm:inline"> (donc tu n'as pas à les choisir)</span>
          <span className="block sm:hidden text-muted-foreground/35">donc tu n'as pas à les choisir</span>
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

function StatCard({ target, prefix, suffix, desc, trigger }: { target: number; prefix: string; suffix: string; desc: string; trigger: boolean }) {
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
            <StatCard key={s.suffix + s.target} {...s} trigger={triggered} />
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

function Pain() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-[1100px] px-6">
      <Reveal><p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Le constat</p></Reveal>
      <Reveal delay={0.08}><h2 style={{ fontSize: "clamp(26px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.1 }} className="mb-5 text-foreground">
        Tout le monde te parle d'IA, de SaaS, de Claude. Personne ne te dit comment en faire un vrai business.
      </h2></Reveal>
      <Reveal delay={0.12}>
        <div className="flex flex-wrap gap-2 mb-6">
          {["Sans savoir coder", "En ligne en moins de 6 jours", "0€ Budget de départ"].map((label) => (
            <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3.5 py-1.5 text-[12px] font-semibold text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
              {label}
            </span>
          ))}
        </div>
      </Reveal>
      <Reveal delay={0.16}><p className="max-w-[500px] text-[16px] leading-[1.6] text-muted-foreground">
        L'IA peut tout construire. Claude peut builder ton produit. Mais personne ne te dit comment en tirer vraiment parti, ni quelle stratégie adopter pour gagner réellement de l'argent en ligne.
      </p></Reveal>

      <Reveal delay={0.24}>
      <div className="mt-11 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {pains.map(({ Icon, title, desc }) => (
          <div key={title} className="rounded-2xl border border-border bg-[#09090b] p-7 transition-colors hover:border-white/20">
            <div className="mb-3.5 flex h-9 w-9 items-center justify-center rounded-lg bg-white/8" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <Icon className="h-[18px] w-[18px] text-white/70" strokeWidth={1.5} />
            </div>
            <h3 className="mb-1.5 text-[15px] font-bold tracking-tight text-white">{title}</h3>
            <p className="text-[14px] leading-relaxed text-white/55">{desc}</p>
          </div>
        ))}
      </div>

      {/* Transition phrase */}
      <p className="mt-12 text-center text-[18px] sm:text-[20px] font-semibold text-foreground" style={{ letterSpacing: '-0.02em' }}>
        L'IA est le levier. Claude est le bras armé. Le SaaS IA est le véhicule. Buildrs, c'est le système opérationnel qui répond à ces douleurs — et te fait passer de l'intention à l'action.
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
    description: "Tu crées une fois. Ça se vend à l'infini, partout, sans stock ni logistique.",
    icon: <Globe strokeWidth={1.5} size={20} />,
  },
  {
    id: "mrr",
    title: "Revenus récurrents",
    stat: "50 clients × 29€ = 1 450€/mois",
    description: "Un abonnement mensuel prévisible. Pas de chasse au client, pas de mission à facturer.",
    icon: <TrendingUp strokeWidth={1.5} size={20} />,
  },
  {
    id: "stack",
    title: "Dupliquer et automatiser",
    stat: "SaaS 1 → SaaS 2 → SaaS 3",
    description: "La méthode se copie. Tu lances un deuxième produit en deux fois moins de temps.",
    icon: <Copy strokeWidth={1.5} size={20} />,
  },
  {
    id: "exit",
    title: "Revendre ou conserver",
    stat: "1 000€/mois → 20 000 à 40 000€",
    description: "Tu gardes le MRR ou tu revends 20x à 40x le mensuel. C'est toi qui choisis.",
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
            style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.08 }}
            className="text-foreground max-w-[480px]"
          >
            Le meilleur business model en 2026.
          </h2></Reveal>
          <Reveal delay={0.16}><p className="mt-5 max-w-[520px] text-[15px] leading-[1.65] text-muted-foreground">
            Le SaaS IA, c'est la version 2.0 du SaaS classique. Tu embarques des agents IA directement dans le produit — ils agissent pour chaque utilisateur, 24h/24. Ton SaaS ne vend plus de l'accès à un outil. Il vend du travail accompli. Valeur perçue incomparable, rétention qui explose, marges identiques.
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
    label: "Trouver une idée SaaS rentable",
    Icon: Search,
    alone: "80h",
    withUs: "30 min",
    badge: "Marketplace incluse",
  },
  {
    label: "Design & interface front-end",
    Icon: Layers,
    alone: "120h",
    withUs: "inclus",
    badge: "Templates prêts",
  },
  {
    label: "Dashboard utilisateur complet",
    Icon: LayoutDashboard,
    alone: "60h",
    withUs: "inclus",
    badge: "Modules Blueprint",
  },
  {
    label: "Authentification & onboarding",
    Icon: Users,
    alone: "40h",
    withUs: "1 prompt",
    badge: "Supabase Auth",
  },
  {
    label: "Base de données & sécurité",
    Icon: Database,
    alone: "50h + failles",
    withUs: "configurée",
    badge: "RLS + schéma prêts",
  },
  {
    label: "Paiements Stripe",
    Icon: Banknote,
    alone: "15h",
    withUs: "15 min",
    badge: "Checkout + webhooks",
  },
  {
    label: "Délai avant d'être en ligne",
    Icon: Clock,
    alone: "3–6 mois",
    withUs: "6 jours",
    badge: "Sprint Blueprint",
  },
  {
    label: "Budget outils testés puis abandonnés",
    Icon: Receipt,
    alone: "300–500€",
    withUs: "0€",
    badge: "Stack validée",
  },
  {
    label: "Bugs critiques & erreurs bloquantes",
    Icon: Shield,
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
            style={{ fontSize: "clamp(24px, 4.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1 }}
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
            style={{ fontSize: "clamp(26px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1 }}
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
          style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }}
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

const dataSources: { label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { label: "Product Hunt",  Icon: BrandIcons.producthunt },
  { label: "Reddit",        Icon: BrandIcons.reddit },
  { label: "Flippa",        Icon: BrandIcons.flippa },
  { label: "Indie Hackers", Icon: BrandIcons.indiehackers },
]

const systemCards = [
  {
    id: "marketplace",
    Icon: Database,
    color: "#4d96ff",
    bg: "rgba(77,150,255,0.08)",
    border: "rgba(77,150,255,0.20)",
    title: "Marketplace d'idées",
    desc: "Des centaines d'idées de SaaS IA analysées par nos agents depuis les vraies sources de données. Pas du ChatGPT. De la data réelle sur ce qui se vend — et ce qui se revend.",
    details: [
      "Idées triées par rentabilité et viabilité",
      "Analyse concurrentielle incluse",
      "Modèle de prix suggéré pour chaque idée",
    ],
    sources: true,
  },
  {
    id: "validator",
    Icon: BarChart2,
    color: "#cc5de8",
    bg: "rgba(204,93,232,0.08)",
    border: "rgba(204,93,232,0.20)",
    title: "Générateur d'idées de SaaS",
    desc: "Tu as une idée ? Le validateur te dit si elle est rentable avant que tu codes une ligne. Basé sur des problèmes réels récupérés de Reddit, des SaaS qui marchent sur PH, des exits récents sur Flippa.",
    details: [
      "Score de viabilité sur 100",
      "Analyse des tendances marché en temps réel",
      "Estimation MRR potentiel + scénario de revente",
    ],
    sources: false,
  },
  {
    id: "cockpit",
    Icon: Zap,
    color: "#22c55e",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.20)",
    title: "Le cockpit — 4 phases",
    desc: "Le dashboard qui pilote ton projet de A à Z. Chaque phase avec ses prompts copiables, sa checklist, ses outils configurés. Tu sais toujours exactement où tu en es.",
    details: [
      "50+ prompts testés, copiables en un clic",
      "Checklist interactive de progression",
      "Stack complète configurée et documentée",
    ],
    sources: false,
  },
  {
    id: "tools",
    Icon: Users,
    color: "#f97316",
    bg: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.20)",
    title: "Boîte à outils + Communauté",
    desc: "Tous les outils de la stack avec guides pas à pas. Le canal WhatsApp Buildrs pour ne jamais être seul. Les mises à jour sur les nouvelles fonctionnalités Claude, en temps réel.",
    details: [
      "Guides de configuration pour chaque outil",
      "Canal WhatsApp privé Buildrs",
      "Mises à jour permanentes sur Claude",
    ],
    sources: false,
  },
]

function DashScreenshot({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="mt-2 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-auto block"
        style={{ maxHeight: 220, objectFit: "cover", objectPosition: "top" }}
      />
    </div>
  )
}

function MarketplaceMockup() {
  return <DashScreenshot src="/dash-marketplace.webp" alt="Marketplace Buildrs" />
}

function ValidatorMockup() {
  return <DashScreenshot src="/Dash-Valider.webp" alt="Valider mon idée Buildrs" />
}

function CockpitMockup() {
  return <DashScreenshot src="/Dash-Accueil.webp" alt="Cockpit Buildrs" />
}

function ToolsMockup() {
  return <DashScreenshot src="/dash-community.webp" alt="Communauté Buildrs" />
}

function WhatYouGet() {
  return (
    <section className="relative overflow-hidden py-28" style={{ background: "#0a0a0a" }}>

      <div className="relative mx-auto max-w-[1100px] px-6">

        {/* Header */}
        <div className="mb-16 text-center">
          <Reveal><p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-white/35">
            Ce que tu vas recevoir
          </p></Reveal>
          <Reveal delay={0.08}><h2
            style={{ fontSize: "clamp(24px, 4vw, 46px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1 }}
            className="mb-4 text-white"
          >
            Pas un PDF. Pas une vidéo.<br />Un système complet piloté par l'IA.
          </h2></Reveal>
          <Reveal delay={0.16}><p className="mx-auto max-w-[480px] text-[15px] leading-[1.6] text-white/45">
            Trouve ton idée. Valide-la. Construis-la. Monétise-la. Buildrs + Claude — tout dans un seul cockpit.
          </p></Reveal>
        </div>

        {/* 4 cards grid */}
        <Reveal delay={0.24}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {systemCards.map(({ id, Icon, color, bg, border, title, desc, details, sources }) => (
            <div
              key={id}
              className="rounded-2xl p-7 flex flex-col gap-5"
              style={{ background: "#111113", border: `1px solid ${border}` }}
            >
              {/* Card header */}
              <div className="flex items-start gap-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  <Icon size={20} strokeWidth={1.5} style={{ color }} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-white leading-snug">{title}</h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-[13px] leading-[1.7] text-white/50">{desc}</p>

              {/* Details */}
              <ul className="flex flex-col gap-2">
                {details.map((d) => (
                  <li key={d} className="flex items-start gap-2">
                    <div className="mt-[5px] h-[5px] w-[5px] shrink-0 rounded-full" style={{ background: color, opacity: 0.7 }} />
                    <span className="text-[12px] text-white/50">{d}</span>
                  </li>
                ))}
              </ul>

              {/* Card mockups */}
              {id === "marketplace" && <MarketplaceMockup />}
              {id === "validator" && <ValidatorMockup />}
              {id === "cockpit" && <CockpitMockup />}
              {id === "tools" && <ToolsMockup />}

              {/* Data sources (Marketplace card only) */}
              {sources && (
                <div className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  <p className="mb-2.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white/25">
                    Analysé depuis
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    {dataSources.map(({ label, Icon: SrcIcon }) => (
                      <div key={label} className="flex items-center gap-1.5">
                        <SrcIcon className="h-4 w-4 text-white/30" />
                        <span className="text-[10px] font-medium text-white/25">{label}</span>
                      </div>
                    ))}
                    <span className="text-[10px] font-medium text-white/20">+ TrustMRR · Acquire</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        </Reveal>


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
          style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }}
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
        <Reveal delay={0.08}><h2 style={{ fontSize: "clamp(24px, 4vw, 46px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.1 }} className="mb-4 text-foreground">
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
            style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.06 }}
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
        <Reveal delay={0.08}><h2 style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }} className="mb-12 text-center text-foreground">
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

// ─── SPRINT ──────────────────────────────────────────────────────────────────

const sprintPhases = [
  {
    num: "01", type: "PHASE 1", title: "Trouver & Valider",
    description: "Génère, filtre et valide ton idée avec Claude. Zéro temps perdu sur le mauvais projet.",
    Icon: Lightbulb,
    color: "#4d96ff",
    border: "rgba(77,150,255,0.30)",
    bg: "rgba(77,150,255,0.08)",
    items: ["Générateur d'idées intégré", "Validation marché en 30 min", "Brief produit en 1 prompt"],
    buildrsAsset: "Générateur d'idées Buildrs",
  },
  {
    num: "02", type: "PHASE 2", title: "Designer & Construire",
    description: "Claude Code architecture, code et assemble ton produit complet. Toi tu valides.",
    Icon: Wrench,
    color: "#cc5de8",
    border: "rgba(204,93,232,0.30)",
    bg: "rgba(204,93,232,0.08)",
    items: ["Architecture générée en 10 min", "UI premium sans coder", "Feature core prête au test"],
    buildrsAsset: "Agent Architecture Buildrs",
  },
  {
    num: "03", type: "PHASE 3", title: "Déployer & Connecter",
    description: "En ligne en minutes. Domaine, auth, paiements Stripe — tout branché, tout testé.",
    Icon: Globe,
    color: "#22c55e",
    border: "rgba(34,197,94,0.30)",
    bg: "rgba(34,197,94,0.08)",
    items: ["Live sur Vercel en 1 clic", "Stripe opérationnel en 15 min", "Emails automatiques Resend"],
    buildrsAsset: "Checklist Déploiement Buildrs",
  },
  {
    num: "04", type: "PHASE 4", title: "Monétiser & Lancer",
    description: "Landing générée, campagne prête. Tes premiers utilisateurs et tes premiers euros.",
    Icon: TrendingUp,
    color: "#f97316",
    border: "rgba(249,115,22,0.30)",
    bg: "rgba(249,115,22,0.08)",
    items: ["Landing page complète générée", "Campagne Meta Ads prête", "Premiers euros sous 48h"],
    buildrsAsset: "Agent Marketing Buildrs",
  },
]

function Sprint() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="modules" className="relative overflow-hidden py-24 bg-background">
      <div className="mx-auto max-w-[1100px] px-6">

        {/* Header */}
        <Reveal><p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Le programme</p></Reveal>
        <Reveal delay={0.08}><h2
          style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }}
          className="mb-4 text-foreground"
        >
          Un système en 4 phases.<br />Un produit live à la fin.
        </h2></Reveal>
        <Reveal delay={0.16}><p className="mb-16 max-w-[560px] text-[15px] md:text-[17px] leading-[1.65] text-muted-foreground">
          <span className="font-semibold text-foreground">Toi tu décides. L'IA construit. Tu encaisses.</span>
        </p></Reveal>

        {/* ── DESKTOP roadmap ── */}
        <div className="hidden md:block relative">

          {/* Timeline line */}
          <div className="absolute left-0 right-0 overflow-hidden pointer-events-none" style={{ top: 27, height: 2, zIndex: 0 }}>
            {/* Base gradient */}
            <div
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, #4d96ff 0%, #cc5de8 33%, #22c55e 66%, #f97316 100%)',
                opacity: 0.35,
                transformOrigin: 'left center',
                transform: visible ? 'scaleX(1)' : 'scaleX(0)',
                transition: 'transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
            {/* Shimmer sweep */}
            <div
              style={{
                position: 'absolute', top: 0, height: '100%', width: '25%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
                animation: visible ? 'sprint-shimmer 1.8s cubic-bezier(0.4,0,0.2,1) 1.1s forwards' : 'none',
                transform: 'translateX(-100%)',
              }}
            />
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-4 gap-5" style={{ position: 'relative', zIndex: 1 }}>
            {sprintPhases.map((phase, i) => {
              const Icon = phase.Icon
              const delay = 0.25 + i * 0.13
              return (
                <motion.div
                  key={phase.num}
                  initial={{ opacity: 0, y: 28 }}
                  animate={visible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col"
                >
                  {/* Node */}
                  <div className="flex justify-center mb-5">
                    <div
                      className="relative flex h-[54px] w-[54px] items-center justify-center rounded-full"
                      style={{
                        background: phase.bg,
                        border: `1.5px solid ${phase.border}`,
                        boxShadow: visible ? `0 0 18px ${phase.color}28, 0 0 6px ${phase.color}18` : 'none',
                        transition: `box-shadow 0.5s ease ${delay + 0.1}s`,
                      }}
                    >
                      {/* Pulse ring */}
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          border: `1px solid ${phase.color}`,
                          animation: visible ? `sprint-pulse 2.4s ease-out ${delay + 0.4}s infinite` : 'none',
                        }}
                      />
                      <Icon size={20} strokeWidth={1.5} style={{ color: phase.color }} />
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className="flex-1 rounded-xl p-5 group cursor-default"
                    style={{
                      background: 'hsl(var(--card))',
                      border: `1px solid ${phase.border}`,
                      transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.boxShadow = `0 4px 28px ${phase.color}1a`
                      el.style.borderColor = `${phase.color}55`
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.boxShadow = 'none'
                      el.style.borderColor = phase.border
                    }}
                  >
                    {/* Badge */}
                    <span
                      className="inline-flex items-center text-[9px] font-bold uppercase tracking-[0.18em] mb-3 px-2 py-[3px] rounded-full"
                      style={{ color: phase.color, background: phase.bg, border: `1px solid ${phase.border}` }}
                    >
                      {phase.type}
                    </span>
                    {/* Title */}
                    <p className="text-[14px] font-bold text-foreground mb-2 leading-snug">{phase.title}</p>
                    {/* Description */}
                    <p className="text-[11px] leading-[1.65] text-muted-foreground mb-4">{phase.description}</p>
                    {/* Items */}
                    <ul className="space-y-2 mb-4">
                      {phase.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <div className="mt-[3px] shrink-0 h-[6px] w-[6px] rounded-full" style={{ background: phase.color, opacity: 0.7 }} />
                          <span className="text-[11px] text-muted-foreground leading-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                    {/* Buildrs asset badge */}
                    <div className="pt-3 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: 'hsl(var(--muted-foreground))' }}>
                        <BuildrsIcon size={10} color="currentColor" />
                        {phase.buildrsAsset}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* ── MOBILE vertical roadmap ── */}
        <div className="flex flex-col gap-0 md:hidden">
          {sprintPhases.map((phase, i) => {
            const Icon = phase.Icon
            return (
              <motion.div
                key={phase.num}
                className="flex gap-4"
                initial={{ opacity: 0, x: -16 }}
                animate={visible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Left: node + connector */}
                <div className="flex flex-col items-center shrink-0" style={{ width: 44 }}>
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full shrink-0"
                    style={{
                      background: phase.bg,
                      border: `1.5px solid ${phase.border}`,
                      boxShadow: visible ? `0 0 12px ${phase.color}25` : 'none',
                    }}
                  >
                    <Icon size={18} strokeWidth={1.5} style={{ color: phase.color }} />
                  </div>
                  {i < sprintPhases.length - 1 && (
                    <div
                      className="my-1"
                      style={{
                        width: 1, flex: 1, minHeight: 24,
                        background: `linear-gradient(to bottom, ${phase.color}35, ${sprintPhases[i + 1].color}35)`,
                      }}
                    />
                  )}
                </div>
                {/* Content */}
                <div className="pb-6 pt-1.5 min-w-0 flex-1">
                  <span
                    className="inline-flex items-center text-[9px] font-bold uppercase tracking-[0.18em] mb-2 px-2 py-[2px] rounded-full"
                    style={{ color: phase.color, background: phase.bg, border: `1px solid ${phase.border}` }}
                  >
                    {phase.type}
                  </span>
                  <p className="text-[14px] font-bold text-foreground mb-1.5">{phase.title}</p>
                  <p className="text-[12px] leading-[1.6] text-muted-foreground mb-3">{phase.description}</p>
                  <ul className="space-y-1.5 mb-3">
                    {phase.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <div className="mt-[4px] shrink-0 h-[5px] w-[5px] rounded-full" style={{ background: phase.color, opacity: 0.7 }} />
                        <span className="text-[11px] text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2.5 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
                    <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      <BuildrsIcon size={10} color="currentColor" />
                      {phase.buildrsAsset}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes sprint-shimmer {
          from { transform: translateX(-100%); }
          to   { transform: translateX(500%); }
        }
        @keyframes sprint-pulse {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(1.9); opacity: 0; }
        }
      `}</style>
    </section>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export function LandingPage({ onCTAClick }: { onCTAClick?: () => void }) {
  const go = (e: React.MouseEvent) => { e.preventDefault(); onCTAClick?.() }
  return (
    <>
      <AnnouncementBar onCTA={go} />
      <Nav onCTA={go} />
      <main>
        <Hero onCTA={go} />
        <Marquee />
        <Stats />
        <SaasVehicle />
        <Pain />
        <SavingsChoc />
        <Symbiose />
        <Sprint />
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
