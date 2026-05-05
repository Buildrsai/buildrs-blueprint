import { useState, useEffect, useRef, type ComponentType, type SVGProps } from "react"
import { Clock, Banknote, Layers, Bot, Zap, Check, X, Flame, Globe, TrendingUp, Copy, ArrowLeftRight, BookOpen, Lightbulb, CheckSquare, Wrench, FolderOpen, Linkedin, ArrowRight, Shield, Database, Users, Search, BarChart2, Receipt, LayoutDashboard, Coffee, Home, Mic, HeartPulse, FileText, Circle, Gift, type LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import { StackedCircularFooter } from "./ui/stacked-circular-footer"
import { FeatureCard } from "./ui/grid-feature-cards"
import { HoverBrandLogo } from "./ui/hover-brand-logo"
import { BuildrsIcon, BrandIcons, ClaudeIcon, WhatsAppIcon } from "./ui/icons"
import { CardStack } from "./ui/card-stack"
import { Folder } from "./ui/folder-components"
import { BLUEPRINT_PRICE, STRIKETHROUGH_PRICE, getCurrentTier } from "../lib/pricing"
import { BuilderTierBadge } from "./ui/builder-tier-badge"

import { DashboardPreviewV2 as DashboardPreview } from "./ui/dashboard-preview"
import { XCard } from "./ui/x-gradient-card"
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

const brands = [
  { id: "claude",     name: "Claude",      utility: "Pensée",          Icon: BrandIcons.claude },
  { id: "claudeCode", name: "Claude Code", utility: "Développement",   Icon: BrandIcons.claudeCode },
  { id: "chatgpt",    name: "ChatGPT",     utility: "Designer",        Icon: BrandIcons.openai },
  { id: "supabase",   name: "Supabase",    utility: "Base de données", Icon: BrandIcons.supabase },
  { id: "vercel",     name: "Vercel",      utility: "Déploiements",    Icon: BrandIcons.vercel },
  { id: "github",     name: "GitHub",      utility: "Versioning",      Icon: BrandIcons.github },
  { id: "stripe",     name: "Stripe",      utility: "Paiement",        Icon: BrandIcons.stripe },
  { id: "resend",     name: "Resend",      utility: "Emailing",        Icon: BrandIcons.resend },
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
    a: "C'est les deux. Un dashboard interactif que tu utilises pour avancer étape par étape — et 9 vidéos démo live où on construit un vrai SaaS IA de A à Z en même temps que toi. Tu vois exactement ce qu'on fait, sur quel écran, avec quels prompts. Pas de la théorie : du live.",
  },
  {
    q: "Et si j'ai déjà une idée en tête ?",
    a: "Parfait. Le Jour 1 t'aide à la valider en 30 minutes avant de construire — pour ne pas perdre 3 jours sur la mauvaise cible ou la mauvaise feature. Ensuite tu passes directement à l'exécution.",
  },
  {
    q: "Combien de temps ça prend vraiment ?",
    a: "7 jours si tu bloques du temps et tu suis le plan. Certains avancent plus vite, d'autres prennent deux semaines en combinant avec le boulot. Le dashboard est à vie — tu avances à ton rythme.",
  },
  {
    q: "Ça coûte combien en outils ?",
    a: "Moins de 100€/mois pour démarrer : Claude Pro (20€/mois) et Claude Code. Supabase, Vercel et GitHub sont gratuits pour les premiers mois. Pas besoin de budget massif pour avoir un produit pro-grade.",
  },
  {
    q: "C'est quoi la différence avec un bootcamp à 900€ ?",
    a: `Le prix (${BLUEPRINT_PRICE}€ vs 900€), la vitesse (7 jours vs 2-4 semaines), l'autonomie totale (tu n'attends pas un coach), et l'outil (Claude, pas GPT). Même résultat — un produit live. Dix fois moins cher. Dix fois plus rapide.`,
  },
  {
    q: "C'est quoi un SaaS IA exactement ?",
    a: "Un logiciel en ligne alimenté par l'IA, focalisé sur un problème précis dans une niche étroite. Exemple : un générateur de contrats pour avocats, une app de pricing pour e-commerçants. Tu le lances seul avec Claude, en quelques jours — et tu le monétises par abonnement ou tu le revends.",
  },
  {
    q: "Pourquoi Claude et pas ChatGPT / Cursor / Bolt ?",
    a: "Claude Code est le seul outil qui lit ton projet en entier, écrit le code dans les bons fichiers, exécute les tests et déploie — tout depuis une conversation. Les autres te donnent du code à copier-coller. Claude agit. C'est la différence entre un assistant et un builder.",
  },
  {
    q: "Quelle IA vous utilisez et pourquoi ?",
    a: "On teste toutes les IAs — chacune a ses forces. Gemini pour la recherche, GPT-4o pour certaines tâches rapides. Mais pour construire un SaaS de A à Z, Claude Code est imbattable : il comprend le projet en entier, génère du code propre et cohérent, et agit directement dans les fichiers. C'est pour ça qu'on a construit le Blueprint autour.",
  },
  {
    q: "Comment ça se passe après le paiement ?",
    a: "Accès immédiat au dashboard. Un onboarding rapide (2 minutes) personnalise ton parcours selon ta stratégie et ton niveau. Tu attaques le Jour 1 dans la foulée.",
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
        <a href="#" className="flex items-center no-underline">
          <img src="/LogoBuildrsBlanc.png" alt="Buildrs" className="h-10 w-auto" />
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
          <a href="https://app.buildrs.fr" className="hidden md:flex items-center gap-2 rounded-[8px] px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground no-underline" style={{ border: "1px solid transparent" }}>
            Mon dashboard
          </a>
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
                <img src="/LogoBuildrsBlanc.png" alt="Buildrs" style={{ height: 12, width: 'auto' }} />
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


      <div className="relative mx-auto max-w-[700px] w-full flex flex-col items-center text-center">

          {/* Badge */}
          <Reveal>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-[11px] sm:text-[13px] text-muted-foreground whitespace-nowrap">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="font-semibold text-foreground">+250 Buildrs accompagnés</span>
              <span className="text-muted-foreground/40" aria-hidden>·</span>
              <span>Résultats dès la 1ère semaine</span>
            </div>
          </Reveal>

          {/* H1 */}
          <Reveal delay={0.1}>
            <h1
              className="mb-7 text-foreground mx-auto max-w-[860px]"
              style={{ fontSize: "clamp(40px, 8vw, 84px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0 }}
            >
              Ton premier SaaS IA, live en 7 jours.
            </h1>
          </Reveal>

          {/* Sub */}
          <Reveal delay={0.18}>
            <p className="mb-8 max-w-[560px] text-[16px] leading-[1.65] text-muted-foreground">
              De l'idée au premier client payant — guidé par{' '}
              <span className="inline-flex items-center gap-1 align-middle">
                <BrandIcons.claudeCode className="inline-block w-4 h-4 text-foreground" />
                <span className="font-medium text-foreground">Claude Code</span>
              </span>
              . Génère tes premiers revenus en autopilote. Sans savoir coder.{' '}
              <strong className="font-semibold text-foreground">En suivant la création from scratch de notre nouveau SaaS IA.</strong>
            </p>
          </Reveal>

          {/* Typing idea */}
          <Reveal delay={0.24}>
            <TypingIdea />
          </Reveal>

          {/* CTA */}
          <Reveal delay={0.3}>
            <div className="flex flex-col items-center gap-3 mb-8">
              <div style={{ padding: '1.5px', borderRadius: '50px', background: 'conic-gradient(from 0deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #cc5de8, #ff6b6b)', animation: 'hero-rainbow-border 3s linear infinite' }}>
                <a
                  href="#tarif"
                  onClick={onCTA}
                  className="flex items-center justify-center no-underline hover:opacity-90 transition-opacity"
                  style={{ background: '#09090b', borderRadius: '50px', padding: '16px 44px', fontSize: '16px', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap' }}
                >
                  Rejoindre le système — {BLUEPRINT_PRICE}€
                </a>
              </div>
              <p className="text-[12px] text-muted-foreground/50">
                Garantie 14 jours · Paiement unique · Updates à vie
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
    <section className="border-y border-border bg-background">
      <HoverBrandLogo brands={brands} label="Nos outils IA (qui seront bientôt les vôtres)" defaultId="claudeCode" />
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

const painTestimonials = [
  { image: '/F2.jpeg', name: 'Sarah', role: 'Coach yoga, ex-RH', text: "Je voulais un Vinted pour le sport — fitness, yoga, running. Tout le monde me disait 'tu sais pas coder, oublie'. 6 jours après le Blueprint le MVP était en ligne. 3 semaines plus tard : 80 vendeuses inscrites, 14 ventes, 3,40€ de commission par transaction. Tu commences petit, tu ajustes, ça marche." },
  { image: '/F5.webp', name: 'Camille', role: 'Growth Marketer freelance', text: "Je facturais 600€ par brief Meta Ads à mes clients. J'ai construit un générateur qui sort le brief en 4 minutes au lieu de 4h. 12 agences le payent 49€/mois. 588€ de MRR récurrent au bout de 5 semaines, sans toucher une ligne de code à la main." },
  { image: '/F4.jpeg', name: 'Maxime', role: 'Coach business, ex-banquier', text: "Coach depuis 3 ans, jamais touché à la tech. J'ai shippé un outil qui transforme l'audio de mes calls en plan d'action PDF pour mes clients. Je facture 30% plus cher depuis. Le truc qui m'a débloqué : Claude écrit le code, moi je dirige. Pas de dev à payer, pas d'agence." },
  { image: '/F3.jpeg', name: 'Erwan', role: 'Créateur de contenu (43k IG)', text: "Je perdais 4h par semaine à planifier mes posts. Mon générateur de calendrier IG est sorti en 5 jours. 200 créateurs payent 19€/mois. 3 800€ de MRR. Le marché est saturé qu'ils disent — non, le marché est mal servi. Tu vises niche, tu sers mieux, ça paye." },
  { image: '/F6.webp', name: 'Thomas', role: 'Solopreneur, ex-comptable', text: "3 SaaS abandonnés avant celui-là — toujours bloqué sur la technique, j'attendais le 'bon moment'. Avec le Blueprint : idée validée jour 1, MVP shipé jour 6, premier client à 29€/mois jour 8. Le système t'oblige à shipper, pas à perfectionner." },
  { image: '/Mec1.webp', name: 'Antoine', role: 'Ex-consultant stratégie', text: "J'ai quitté le conseil. Construit un outil de reporting auto pour PME en 7 jours. 14 clients à 89€/mois aujourd'hui — 1 246€ de MRR en 2 mois. J'ai zéro réseau dans la tech, zéro background dev. Si tu sais expliquer un problème en français, tu peux construire la solution." },
]

function PainTestimonialsColumn({ items, duration, className }: { items: typeof painTestimonials; duration: number; className?: string }) {
  return (
    <div className={`overflow-hidden ${className ?? ''}`} style={{ flex: '0 0 auto', width: 320 }}>
      <motion.div
        animate={{ translateY: '-50%' }}
        transition={{ duration, repeat: Infinity, ease: 'linear', repeatType: 'loop' as const }}
        className="flex flex-col gap-4"
      >
        {[...items, ...items].map((t, i) => (
          <div key={i} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px' }}>
            <p style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(255,255,255,0.7)', marginBottom: 14 }}>{t.text}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={t.image} alt={t.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#fafafa', lineHeight: 1.3, margin: 0 }}>{t.name}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.3, margin: 0 }}>{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function Pain() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-[1100px] px-6">
        <Reveal><p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Le constat</p></Reveal>
        <Reveal delay={0.08}><h2 style={{ fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.1 }} className="mb-4 text-foreground">
          Tout le monde te parle d'IA. De Claude.<br />Mais personne ne te montre comment en vivre.
        </h2></Reveal>
        <Reveal delay={0.16}><p className="max-w-[560px] text-[16px] leading-[1.65] text-muted-foreground">
          Pendant ce temps, des gens sans background technique lancent des SaaS IA, des micros-saas, des apps, ou des logiciels à +5 000€/mois. Ce n'est pas un manque de talent. C'est un manque de système et de direction.
        </p></Reveal>

        <motion.div
          initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
          whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.24, duration: 0.8 }}
          className="mt-11 grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed border-border sm:grid-cols-2"
        >
          {constatCards.map(({ Icon, title, desc }) => (
            <FeatureCard
              key={title}
              feature={{ icon: Icon as ComponentType<SVGProps<SVGSVGElement>>, title, description: desc }}
            />
          ))}
        </motion.div>

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
            Aujourd'hui : 6 jours et {BLUEPRINT_PRICE}€. Le code n'est plus un problème.
            Ton job : avoir la vision, l'IA construit.
          </p>
        </Reveal>

      </div>
    </section>
  )
}

// ─── WINDOW IA ───────────────────────────────────────────────────────────────

const windowIAQuotes = [
  {
    authorName: "Dario Amodei",
    authorHandle: "DarioAmodei",
    authorImage: "/Amodei.webp",
    content: ["Une entreprise pilotée par une seule personne valant un milliard de dollars va émerger en 2026.", "C'est certain."],
    timestamp: "Code with Claude · Mai 2025",
    highlight: true,
  },
  {
    authorName: "Jensen Huang",
    authorHandle: "jensenhuang",
    authorImage: "/Huang.webp",
    content: ["L'IA va créer plus de millionnaires en 5 ans", "qu'internet n'en a créés en 20 ans."],
    timestamp: "All-In Podcast · 2025",
    highlight: false,
  },
  {
    authorName: "Sam Altman",
    authorHandle: "sama",
    authorImage: "/Altman.jpeg",
    content: ["La première entreprise à 1 milliard de dollars pilotée par une seule personne est imminente.", "C'était impensable sans l'IA."],
    timestamp: "Entretien Alexis Ohanian · Sept. 2024",
    highlight: false,
  },
]

function WindowIA() {
  return (
    <section className="bg-background py-6 sm:py-10">
      <div className="mx-auto max-w-[680px] px-6 text-center flex flex-col items-center">
        <Reveal>
          <h2
            className="mb-6 text-foreground"
            style={{ fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.08 }}
          >
            On vit une fenêtre unique avec l'IA.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mb-4 max-w-[560px] text-[15px] sm:text-[17px] leading-[1.65] text-muted-foreground">
            Ce qui demandait une équipe technique et des mois de développement il y a 2 ans est aujourd'hui à portée d'une seule personne — en quelques jours.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="mb-10 max-w-[560px] text-[15px] sm:text-[17px] leading-[1.65] text-muted-foreground">
            Cette fenêtre ne sera pas ouverte éternellement dans les mêmes conditions. Ceux qui agissent maintenant prendront une avance structurelle.
          </p>
        </Reveal>

      </div>

      <div className="flex justify-center gap-5 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[620px] overflow-hidden">
        <PainTestimonialsColumn items={painTestimonials} duration={32} className="md:hidden" />
        <PainTestimonialsColumn items={painTestimonials.slice(0, 3)} duration={22} className="hidden md:block" />
        <PainTestimonialsColumn items={painTestimonials.slice(3, 6)} duration={26} className="hidden md:block" />
      </div>

      <div className="mx-auto max-w-[680px] px-6 text-center flex flex-col items-center mt-10">
        <Reveal delay={0.1}>
          <p
            className="text-foreground"
            style={{ fontSize: "clamp(20px, 2.8vw, 30px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2 }}
          >
            Prêt à exploiter toute la{" "}
            <span className="rounded-md px-2 py-0.5" style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.18)', color: '#fafafa' }}>puissance de l'IA, et de Claude Code</span>
            {" "}?
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
          <span className="font-bold text-white">{BLUEPRINT_PRICE}€</span>
          {" "}— paiement unique, accès à vie.
        </p>

      </div>
    </section>
  )
}

// ─── SYMBIOSE ─────────────────────────────────────────────────────────────────

const symbioseRows = [
  {
    sans: "Tu construis — sans savoir si ça se vend",
    avec: "Tu construis ce que des gens paient déjà ailleurs",
  },
  {
    sans: "Tu as 10 idées et tu tournes en rond",
    avec: "Tu repars avec une idée validée, scorée, prête à exécuter",
  },
  {
    sans: "Tu perds des journées sur la config technique",
    avec: "Tu déploies sur une stack éprouvée, sans t'y brûler",
  },
  {
    sans: "Tu as un produit live — mais personne n'achète",
    avec: "Tu as une stratégie de prix, un message, un canal — avant de coder",
  },
  {
    sans: "Tu jonglles entre 3 projets sans en finir un",
    avec: "Tu vas de l'idée au premier euro en 6 jours, focus total",
  },
]

// ─── BEFORE / AFTER ──────────────────────────────────────────────────────────

const comparisonRows = [
  {
    before: "Tu as 10 idées dans Notion, tu en lances aucune vraiment",
    after:  "Tu pars avec une idée validée, scorée, alignée sur toi",
  },
  {
    before: "Tu testes chaque nouvelle IA qui sort, tu te perds dans le bruit",
    after:  "Tu suis une stack claire, mise à jour pour toi, zéro distraction",
  },
  {
    before: "Tu vois passer des lancements tous les jours sans être dedans",
    after:  "Tu rejoins une tribu de Buildrs qui shippent, encaissent, partagent",
  },
  {
    before: "Tu lances seul, tu bloques seul, tu repousses seul",
    after:  "Tu avances avec des Buildrs qui débloquent tes points morts en live",
  },
  {
    before: "Tu accumules les projets abandonnés à mi-chemin",
    after:  "Tu vas de l'idée aux premiers euros encaissés, focus total",
  },
  {
    before: "Tu builds seul, tu doutes seul, tu cales seul",
    after:  "Tu builds avec une équipe d'Anthropic Business Partners",
  },
]

function BeforeAfter() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-[1100px] px-6">

        <div className="mb-14 text-center">
          <Reveal>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/50">Avant / Après</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              style={{ fontSize: "clamp(30px, 4.5vw, 54px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.08 }}
              className="mb-5 text-foreground"
            >
              Avant, tu regardais les autres lancer.<br />Après, c'est toi qui shippes.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto max-w-[580px] text-[16px] leading-[1.65] text-muted-foreground">
              Pendant que tu hésites entre 10 idées, des Buildrs comme toi atteignent leurs premiers revenus en quelques jours. Ils n'avaient pas plus de skills que toi au départ. Ils ont juste arrêté d'avancer seuls — et ont rejoint une tribu qui pousse à finir.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.18}>
          <div className="w-full rounded-2xl overflow-hidden border border-border">
            {/* Header */}
            <div className="grid grid-cols-2 border-b border-border">
              <div className="flex items-center gap-2 px-6 py-4 border-r border-border bg-card">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-red-500"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">Avant Buildrs</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-4 bg-foreground/[0.03]">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/15">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-green-400"><path d="M20 6L9 17l-5-5"/></svg>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-green-400/70">Après Buildrs</span>
              </div>
            </div>

            {/* Rows */}
            {comparisonRows.map(({ before, after }, i) => (
              <div key={i} className={`grid grid-cols-2 ${i < comparisonRows.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="flex items-start gap-3 px-6 py-5 border-r border-border bg-card">
                  <span className="mt-[3px] shrink-0 text-red-500/50">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </span>
                  <span className="text-[13px] leading-[1.6] text-muted-foreground/70">{before}</span>
                </div>
                <div className="flex items-start gap-3 px-6 py-5 bg-foreground/[0.03]">
                  <span className="mt-[3px] shrink-0 text-green-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </span>
                  <span className="text-[13px] leading-[1.6] text-foreground/80">{after}</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── WHAT YOU GET ─────────────────────────────────────────────────────────────

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
    photo: "/Chris_Buildrs.png",
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

// ─── ProjectExamplesSection ───────────────────────────────────────────────────

type SaasProject = {
  id: number
  title: string
  description: string
  mrr: string
  sector: string
  gradient: string
  imageSrc?: string
  tag?: string
}

const saasProjects: SaasProject[] = [
  {
    id: 1,
    title: "PriceFlow",
    description: "Pricing dynamique pour e-commerce multi-marchés",
    mrr: "~1 500 €/mois",
    sector: "E-commerce · B2B",
    gradient: "linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)",
    imageSrc: "/projects/PriceFlow.png",
    tag: "E-commerce · B2B",
  },
  {
    id: 2,
    title: "Swarm X",
    description: "Agents IA qui font grossir et monétisent un compte X en autonomie",
    mrr: "~2 200 €/mois",
    sector: "Creator economy · B2C",
    gradient: "linear-gradient(160deg, #09090b 0%, #1a0a2e 50%, #09090b 100%)",
    imageSrc: "/projects/XAI Forge.png",
    tag: "Creator economy · B2C",
  },
  {
    id: 3,
    title: "Hostora",
    description: "Gestion locative auto pour conciergeries et propriétaires",
    mrr: "Revente : 8 500€",
    sector: "Immobilier · B2B",
    gradient: "linear-gradient(160deg, #1a0c08 0%, #7c2d12 50%, #9a3412 100%)",
    imageSrc: "/projects/Hostora.png",
    tag: "Immobilier · B2B",
  },
  {
    id: 4,
    title: "Rankr",
    description: "Optimise la visibilité de ton app ou SaaS dans les moteurs de recherche IA et LLM",
    mrr: "~2 400 €/mois",
    sector: "GEO · B2B",
    gradient: "linear-gradient(160deg, #0c1220 0%, #0f2845 50%, #1a3a6e 100%)",
    imageSrc: "/projects/Rankr.png",
    tag: "GEO · B2B",
  },
  {
    id: 5,
    title: "BatiConseil",
    description: "Diagnostic IA et devis instantanés pour artisans du bâtiment",
    mrr: "Revente : 13 000€",
    sector: "Artisans · B2B",
    gradient: "linear-gradient(160deg, #080e1a 0%, #0f1e3d 50%, #1a2e5a 100%)",
    imageSrc: "/projects/BatiConseil.png",
    tag: "Artisans · B2B",
  },
  {
    id: 6,
    title: "Vocali",
    description: "CRM vocal qui transforme tes notes en clients, offres et landings",
    mrr: "~1 800 €/mois",
    sector: "Coachs & solopreneurs · B2B",
    gradient: "linear-gradient(160deg, #13002a 0%, #4c1d95 50%, #2e1065 100%)",
    imageSrc: "/projects/Vocalia.png",
    tag: "Coachs & solopreneurs · B2B",
  },
]

function useCardSize() {
  const [dims, setDims] = useState({ w: 520, h: 320 })
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth
      setDims({ w: Math.min(520, vw - 56), h: vw < 640 ? 270 : 320 })
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
  return dims
}

function renderSaasCard(item: SaasProject, _state: { active: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: item.gradient }}>
      {/* Dashboard screenshot — top 65% of card */}
      {item.imageSrc && (
        <div className="absolute inset-x-0 top-0" style={{ height: "65%" }}>
          <img
            src={item.imageSrc}
            alt={item.title}
            className="h-full w-full object-cover object-top"
            draggable={false}
            loading="eager"
            onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = "none" }}
          />
          {/* Fade screenshot into card gradient */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.92) 100%)" }}
          />
        </div>
      )}

      {/* Bottom info panel — sits over gradient */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-5" style={{ height: "42%" }}>
        <div className="mb-2">
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em]"
            style={{ background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            {item.sector}
          </span>
        </div>
        <div className="text-[20px] font-bold leading-tight text-white">{item.title}</div>
        <div className="mt-1 text-[12px] leading-snug" style={{ color: "rgba(255,255,255,0.65)" }}>
          {item.description}
        </div>
        <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.10)" }}>
          <span className="font-mono text-[16px] font-bold" style={{ color: "#22c55e" }}>
            {item.mrr}
          </span>
        </div>
      </div>
    </div>
  )
}

function ProjectExamplesSection() {
  const { w, h } = useCardSize()

  return (
    <section className="py-24 overflow-hidden" style={{ background: "#0a0a0a" }}>
      <div className="mx-auto max-w-[1100px] px-6">

        {/* Header */}
        <div className="mb-16 text-center">
          <Reveal>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.35)" }}>
              Exemples de projets
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              className="mb-4 text-white"
              style={{ fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1 }}
            >
              Voilà ce que les Buildrs shippent en 7 jours.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto max-w-[580px] text-[15px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.45)" }}>
              Des SaaS réels, lancés par nos Buildrs ou réalisables avec Blueprint.
              Clique sur une card pour explorer ce que tu pourrais shipper la semaine prochaine.
            </p>
          </Reveal>
        </div>

        {/* Carousel */}
        <Reveal delay={0.12}>
          <CardStack
            items={saasProjects}
            cardWidth={w}
            cardHeight={h}
            autoAdvance
            intervalMs={5000}
            pauseOnHover
            showDots
            loop
            renderCard={renderSaasCard}
          />
        </Reveal>

        {/* Footer note + CTA */}
        <div className="mt-16 flex flex-col items-center gap-8">
          <p className="max-w-[680px] text-center text-[13px] italic leading-relaxed" style={{ color: "rgba(255,255,255,0.25)" }}>
            Ces projets sont des SaaS réels lancés par les Buildrs Blueprint.
            Ton idée n'est pas dans la liste&nbsp;? Le système fonctionne pour 90% des cas d'usage SaaS et IA. Et on est là pour t'aider à valider la tienne le Jour 1.
          </p>
          <a href="#/checkout">
            <div className="hero-rainbow-border relative cursor-pointer">
              <div
                className="relative rounded-xl px-8 py-3.5 text-[15px] font-semibold"
                style={{ background: "hsl(var(--foreground))", color: "hsl(var(--background))" }}
              >
                Rejoindre le Système Blueprint →
              </div>
            </div>
          </a>
        </div>

      </div>
    </section>
  )
}

function WhatYouGet() {
  const sidebarItems = [
    { label: 'Accueil', Icon: LayoutDashboard, active: false },
    { label: 'Formation', Icon: BookOpen, active: true },
    { label: 'Claude OS', Icon: Bot, active: false },
    { label: 'Agents IA', Icon: Layers, active: false, badge: 'NEW' },
    { label: 'Ressources', Icon: FolderOpen, active: false },
    { label: 'Outils IA', Icon: Wrench, active: false },
    { label: 'Communauté', Icon: Users, active: false },
  ]

  const lessons = [
    { done: true, label: "Configurer son environnement" },
    { done: true, label: "S'inspirer avec Mobbin" },
    { done: true, label: "Branding express" },
    { done: false, label: "Parcours utilisateur avec Claude", current: true },
    { done: false, label: "Scaffolding Claude Code" },
  ]

  return (
    <section className="relative overflow-hidden py-28" style={{ background: "#0a0a0a" }}>
      <div className="relative mx-auto max-w-[1100px] px-6">

        {/* Header */}
        <div className="mb-12 text-center">
          <Reveal>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-white/35">
              Ce que tu vas recevoir
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{ fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1 }}
              className="mb-4 text-white"
            >
              Pas un PDF. Pas une vidéo perdue.<br />Une mission qu'on exécute ensemble.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto max-w-[480px] text-[15px] leading-[1.6] text-white/45">
              Trouve ton idée. Valide-la. Construis-la. Monétise-la. Grâce au système Blueprint.
            </p>
          </Reveal>
        </div>

        {/* Dashboard mockup */}
        <Reveal delay={0.24}>
          <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 580, border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, overflow: 'hidden', background: '#111113', boxShadow: '0 40px 120px rgba(0,0,0,0.6)' }}>

            {/* Browser chrome */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, background: '#0d0d0f' }}>
              <div style={{ display: 'flex', gap: 5 }}>
                {['#ff5f57','#ffbd2e','#28c840'].map(c => (
                  <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.65 }} />
                ))}
              </div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '3px 14px', fontSize: 10, color: 'rgba(255,255,255,0.2)', fontFamily: 'Geist Mono, monospace' }}>
                  buildrs.fr/dashboard
                </div>
              </div>
            </div>

            {/* App shell */}
            <div style={{ display: 'flex', height: 500 }}>

              {/* Sidebar */}
              <div style={{ width: 188, borderRight: '1px solid rgba(255,255,255,0.06)', padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 1, flexShrink: 0, background: '#0d0d0f' }}>
                <div style={{ padding: '4px 8px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <img src="/LogoBuildrsBlanc.png" alt="Buildrs" style={{ height: 18, width: 'auto' }} />
                </div>
                {sidebarItems.map(({ label, Icon, active, badge }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, cursor: 'default', background: active ? 'rgba(255,255,255,0.07)' : 'transparent' }}>
                    <Icon size={13} strokeWidth={1.5} style={{ color: active ? '#fff' : 'rgba(255,255,255,0.28)', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? '#fff' : 'rgba(255,255,255,0.3)' }}>{label}</span>
                    {badge && <span style={{ marginLeft: 'auto', fontSize: 8, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.12)', padding: '1px 5px', borderRadius: 99 }}>{badge}</span>}
                  </div>
                ))}
              </div>

              {/* Main */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* Top bar */}
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '11px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Formation</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Module 2 — Préparer & Designer</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>7 / 11 étapes</div>
                    <div style={{ width: 72, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{ width: '63%', height: '100%', background: '#22c55e', borderRadius: 99 }} />
                    </div>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                      <img src="/Alfred_Buildrs_V2.png" alt="Alfred" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </div>
                </div>

                {/* Content grid */}
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr auto', gap: 12, padding: 14, overflow: 'hidden' }}>

                  {/* Video — blurred */}
                  <div style={{ borderRadius: 12, overflow: 'hidden', position: 'relative', background: '#16161a', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(77,150,255,0.14), rgba(204,93,232,0.08))', filter: 'blur(20px)', transform: 'scale(1.3)' }} />
                    <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(8px)', background: 'rgba(10,10,12,0.45)' }} />
                    <div style={{ position: 'relative', width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="white" style={{ marginLeft: 2 }}><path d="M4 2l10 6-10 6V2z"/></svg>
                    </div>
                    <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.55)', borderRadius: 4, padding: '2px 6px', fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: 'Geist Mono, monospace' }}>12:34</div>
                    <div style={{ position: 'absolute', top: 10, left: 10, fontSize: 9, color: 'rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.45)', borderRadius: 5, padding: '2px 7px' }}>Leçon 7 · Design Express</div>
                  </div>

                  {/* Claude Code terminal */}
                  <div style={{ borderRadius: 12, overflow: 'hidden', background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '7px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {['#ff5f57','#ffbd2e','#28c840'].map(c => <div key={c} style={{ width: 6, height: 6, borderRadius: '50%', background: c, opacity: 0.55 }} />)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 4 }}>
                        <BrandIcons.claudeCode style={{ width: 10, height: 10, color: 'rgba(255,255,255,0.4)' }} />
                        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)' }}>Claude Code — Mon Projet</span>
                      </div>
                    </div>
                    <div style={{ padding: '10px 12px', flex: 1, fontFamily: 'Geist Mono, monospace', fontSize: 9.5, lineHeight: 1.9 }}>
                      <div><span style={{ color: 'rgba(255,255,255,0.2)' }}>$ </span><span style={{ color: 'rgba(255,255,255,0.5)' }}>npx vite build</span></div>
                      <div style={{ color: '#22c55e' }}>✓ 2 353 modules transformed</div>
                      <div style={{ color: '#22c55e' }}>✓ built in 1.17s</div>
                      <div style={{ marginTop: 4 }}><span style={{ color: 'rgba(255,255,255,0.2)' }}>$ </span><span style={{ color: 'rgba(255,255,255,0.5)' }}>vercel --prod</span></div>
                      <div style={{ color: '#22c55e' }}>✓ Deployed to production</div>
                      <div style={{ color: 'rgba(77,150,255,0.75)' }}>→ https://monapp.vercel.app</div>
                      <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9 }}>En attente de ta prochaine commande</span>
                      </div>
                    </div>
                  </div>

                  {/* Lessons row */}
                  <div style={{ gridColumn: '1 / -1', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '10px 12px' }}>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Étapes du module</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {lessons.map(({ done, label, current }) => (
                        <div key={label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5, padding: '5px 8px', borderRadius: 7, background: current ? 'rgba(255,255,255,0.04)' : 'transparent', border: current ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent' }}>
                          <div style={{ width: 13, height: 13, borderRadius: '50%', flexShrink: 0, background: done ? '#22c55e' : 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {done && <svg width="7" height="7" viewBox="0 0 8 8"><path d="M1 4l2 2 4-4" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
                          </div>
                          <span style={{ fontSize: 9.5, color: done ? 'rgba(255,255,255,0.22)' : current ? '#fff' : 'rgba(255,255,255,0.38)', textDecoration: done ? 'line-through' : 'none', lineHeight: 1.3 }}>{label}</span>
                          {current && <span style={{ marginLeft: 'auto', flexShrink: 0, fontSize: 8, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '1px 5px', borderRadius: 99 }}>→</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          </div>
        </Reveal>

        {/* Scrolling ticker */}
        <div className="mt-14 overflow-hidden border-y border-white/[0.07] py-4">
          <div className="flex gap-10 whitespace-nowrap" style={{ animation: "marquee-scroll 28s linear infinite", width: "max-content" }}>
            {[
              "6 modules de formation", "50+ prompts copiables", "Marketplace d'idées IA",
              "Agents IA spécialisés", "Claude OS inclus", "Générateur & Validateur",
              "Communauté Buildrs", "Templates clonables", "Mises à jour à vie",
              "6 modules de formation", "50+ prompts copiables", "Marketplace d'idées IA",
              "Agents IA spécialisés", "Claude OS inclus", "Générateur & Validateur",
              "Communauté Buildrs", "Templates clonables", "Mises à jour à vie",
            ].map((label, i) => (
              <span key={i} className="inline-flex items-center gap-2.5 text-[13px] font-medium text-white/40">
                <span className="h-1 w-1 rounded-full bg-white/20 shrink-0" />
                {label}
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

// ─── TRI SECTION ─────────────────────────────────────────────────────────────

const notForYou = [
  "Tu collectionnes les formations sans jamais lancer.",
  "Tu cherches une méthode \"100% passive, 0% effort\".",
  "Tu refuses d'utiliser l'IA par principe ou tu préfères tout faire à la main.",
  "Tu n'as jamais touché un outil no-code, un LLM ou un dashboard d'automatisation.",
]

const forYou = [
  "Tu sais que l'IA change la donne et tu veux prendre position avant tout le monde.",
  "Tu as un job, des clients ou une activité, et tu veux lancer ton propre side-project rentable en parallèle.",
  "Tu veux exécuter, pas juste apprendre. Lancer un produit qui facture, pas accumuler des notes Notion.",
  "Tu cherches un système qui rapporte dans les 30-60 jours, pas dans 2 ans.",
]

function TriSection() {
  return (
    <section className="relative py-28 overflow-hidden" style={{ background: "#080909" }}>
      {/* Subtle dot pattern */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-[1000px] px-6">

        {/* Header */}
        <Reveal>
          <div className="mb-16 text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.3)" }}>
              Ce système trie
            </p>
            <h2
              className="mb-5 text-white"
              style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1 }}
            >
              On ne builds pas avec tout le monde.
            </h2>
            <p className="mx-auto max-w-[520px] text-[15px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.4)" }}>
              Buildrs Blueprint est une mission collective — pas une formation en solo.
              Si tu te reconnais dans la mauvaise colonne, n'achète pas. Tu nous ralentirais.
            </p>
          </div>
        </Reveal>

        {/* Two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* NOT for you */}
          <Reveal delay={0.06}>
            <div
              className="rounded-2xl p-8 h-full"
              style={{
                background: "rgba(239,68,68,0.03)",
                border: "1px solid rgba(239,68,68,0.12)",
              }}
            >
              <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "rgba(239,68,68,0.5)" }}>
                Pas pour toi si
              </p>
              <ul className="flex flex-col gap-4">
                {notForYou.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                    >
                      <X size={11} strokeWidth={2.5} style={{ color: "rgba(239,68,68,0.7)" }} />
                    </span>
                    <span className="text-[14px] leading-[1.6]" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* FOR you */}
          <Reveal delay={0.12}>
            <div
              className="rounded-2xl p-8 h-full"
              style={{
                background: "rgba(34,197,94,0.03)",
                border: "1px solid rgba(34,197,94,0.14)",
              }}
            >
              <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "rgba(34,197,94,0.6)" }}>
                Pour toi si
              </p>
              <ul className="flex flex-col gap-4">
                {forYou.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                      style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}
                    >
                      <Check size={11} strokeWidth={2.5} style={{ color: "rgba(34,197,94,0.8)" }} />
                    </span>
                    <span className="text-[14px] leading-[1.6]" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Closing line */}
        <Reveal delay={0.2}>
          <p
            className="mt-12 text-center text-[13px] italic leading-relaxed"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            Si tu coches au moins 3 cases dans la bonne colonne, tu es exactement au bon endroit.
            Si tu hésites, c'est probablement pas pour toi.
          </p>
        </Reveal>

      </div>
    </section>
  )
}

function Pricing({ onCTA }: { onCTA?: (e: React.MouseEvent) => void }) {
  const tier = getCurrentTier()
  const overallPct = Math.min(Math.round((tier.builderCount / tier.tierEnd) * 100), 100)

  const ALL_TIERS = [
    { label: "0 → 100 builders", price: 27 },
    { label: "100 → 200 builders", price: 37 },
    { label: "200 → 300 builders", price: 47 },
    { label: "300 → 400 builders", price: 57 },
    { label: "400 → 500 builders", price: 67 },
  ].map((t, i) => ({
    ...t,
    state: i < tier.tierIndex ? "done" : i === tier.tierIndex ? "current" : "upcoming",
  }))

  const outcomes: { title: string; desc: string; badge?: string }[] = [
    { title: "Le parcours 7 jours", desc: "De l'idée à ton SaaS en live, jour par jour. Chaque jour a son objectif, ses livrables, ses checkpoints. On l'a déjà exécuté pour toi, vidéo par vidéo." },
    { title: "Installation & paramétrage complet de Claude", desc: "Claude Pro, Claude Code, Claude Design, Claude Cowork · installés, configurés, opérationnels en 1h. Tu démarres le parcours sans friction technique.", badge: "NOUVEAU" },
    { title: "9 vidéos démo live (15-25 min chacune)", desc: "1 intro + 7 démos par jour + 1 outro. On a buildé notre SaaS en filmant chaque étape. Tu suis, tu adaptes, tu exécutes." },
    { title: "7 templates projet clonables", desc: "Le squelette de ton SaaS prêt · auth, paiement, dashboard, email. Tu clones, tu personnalises, tu déploies." },
    { title: "7 prompts système prêts à l'emploi", desc: "Le bon prompt Claude Code au bon moment du parcours. Testés en prod sur les 25+ SaaS actifs chez Buildrs Lab." },
    { title: "La stack d'outils IA préconfigurée", desc: "Supabase, Vercel, Stripe, Resend · les guides d'installation et de connexion sans perdre 3h sur la config." },
    { title: "Accès à vie + mises à jour", desc: "Anthropic sort un nouveau modèle ? Une nouvelle stack ? Tu reçois la mise à jour automatique. Pour toujours." },
  ]

  const bonuses = [
    { title: "Bonus 1 · La Marketplace Buildrs", desc: "10 idées de SaaS validées avec marché, concurrence, stack et prompts de démarrage.", value: 197 },
    { title: "Bonus 2 · Les 10 prompts de lancement", desc: "Les prompts qu'on utilise chez Buildrs pour lancer un nouveau SaaS de zéro.", value: 47 },
    { title: "Bonus 3 · La Bibliothèque Buildrs", desc: "50 prompts système classés par phase + le guide d'utilisation de chaque outil.", value: 297 },
    { title: "Bonus 4 · Communauté Buildrs", desc: "Accès à la communauté avec les autres Builders pour échanger — Ressources · Communauté · Classement · Co-build sur des projets Buildrs.", value: 97 },
  ]

  const valueItems = [
    { label: "Le parcours Buildrs Blueprint", value: 297 },
    { label: "Bonus 1 · Marketplace", value: 197 },
    { label: "Bonus 2 · 10 prompts de lancement", value: 47 },
    { label: "Bonus 3 · Bibliothèque Buildrs", value: 297 },
    { label: "Bonus 4 · Communauté Buildrs", value: 97 },
  ]

  return (
    <section id="tarif" className="py-24" style={{ backgroundColor: "hsl(var(--background))" }}>
      <div className="mx-auto max-w-[720px] px-6">

        <Reveal>
          <p className="mb-3 text-center text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Tarif</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mb-4 text-center text-foreground" style={{ fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.1 }}>
            7 jours pour lancer ton SaaS IA.
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mx-auto mb-12 max-w-[480px] text-center text-[16px] leading-[1.65] text-muted-foreground">
            Le prix monte tous les 100 builders. Tu paies le prix du palier où tu t'inscris — et tu le gardes à vie.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="bump-neon relative mx-auto" style={{ borderRadius: 22 }}>
            <div className="bump-inner p-8 text-left" style={{ borderRadius: 20 }}>

              {/* ── PRICE BLOCK ── */}
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Buildrs Blueprint</p>
                  <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold" style={{ background: "hsl(var(--foreground))", color: "hsl(var(--background))" }}>
                    <Flame size={12} strokeWidth={1.5} />
                    Offre de lancement
                  </span>
                </div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <span className="text-[16px] font-medium text-muted-foreground/50 line-through">{STRIKETHROUGH_PRICE}€</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[22px] font-semibold text-muted-foreground">€</span>
                      <span className="text-foreground" style={{ fontSize: 72, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>{tier.currentPrice}</span>
                    </div>
                    <p className="mt-1 text-[13px] text-muted-foreground">Paiement unique · Accès à vie</p>
                  </div>
                  <div className="min-w-[180px] shrink-0">
                    <div className="mb-1.5 flex items-center justify-between text-[12px]">
                      <span className="font-medium text-muted-foreground">Place {tier.builderCount}/{tier.tierEnd}</span>
                      <span className="font-semibold text-foreground">{overallPct}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: "hsl(var(--border))" }}>
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500" style={{ width: `${overallPct}%` }} />
                    </div>
                    <p className="mt-1.5 text-[11px] text-muted-foreground">
                      {tier.placesLeft} places à <span className="font-semibold text-foreground">{tier.currentPrice}€</span> avant {tier.nextPrice}€
                    </p>
                  </div>
                </div>
              </div>

              <hr className="mb-6 border-border" />

              {/* ── TIER TABLE ── */}
              <div className="mb-6">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Évolution des paliers</p>
                <div className="flex flex-col gap-1.5">
                  {ALL_TIERS.map((t) => (
                    <div key={t.price} className="flex items-center justify-between rounded-lg px-3 py-2" style={{
                      backgroundColor: t.state === "current" ? "hsl(var(--foreground) / 0.06)" : "transparent",
                      border: t.state === "current" ? "1px solid hsl(var(--foreground) / 0.12)" : "1px solid transparent",
                    }}>
                      <div className="flex items-center gap-2.5">
                        {t.state === "done" ? (
                          <Check size={12} strokeWidth={2} className="text-muted-foreground/40" />
                        ) : t.state === "current" ? (
                          <Circle size={10} strokeWidth={2.5} className="fill-foreground text-foreground" />
                        ) : (
                          <Circle size={10} strokeWidth={1.5} className="text-muted-foreground/30" />
                        )}
                        <span className={`text-[13px] ${t.state === "done" ? "text-muted-foreground/40 line-through" : t.state === "current" ? "font-semibold text-foreground" : "text-muted-foreground/50"}`}>
                          {t.label}
                        </span>
                      </div>
                      <span className={`font-mono text-[13px] font-semibold ${t.state === "done" ? "text-muted-foreground/40 line-through" : t.state === "current" ? "text-foreground" : "text-muted-foreground/40"}`}>
                        {t.price}€
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="mb-6 border-border" />

              {/* ── 6 OUTCOMES ── */}
              <div className="mb-6">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Ce que tu reçois</p>
                <ul className="flex flex-col gap-3">
                  {outcomes.map((o) => (
                    <li key={o.title} className="flex items-start gap-3">
                      <Check size={14} strokeWidth={2} className="mt-[3px] shrink-0 text-foreground" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[13px] font-semibold uppercase tracking-[0.04em] text-foreground">{o.title}</p>
                          {o.badge && (
                            <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' }}>{o.badge}</span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[13px] leading-[1.55] text-muted-foreground">{o.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <hr className="mb-6 border-border" />

              {/* ── 3 BONUSES ── */}
              <div className="mb-6">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Bonuses inclus</p>
                <div className="flex flex-col gap-2.5">
                  {bonuses.map((b) => (
                    <div key={b.title} className="flex items-start gap-3 rounded-xl border border-dashed border-border px-4 py-3" style={{ backgroundColor: "hsl(var(--muted))" }}>
                      <Gift size={14} strokeWidth={1.5} className="mt-[2px] shrink-0 text-foreground" />
                      <p className="min-w-0 flex-1 text-[13px]">
                        <span className="font-semibold text-foreground">{b.title}</span>
                        <span className="text-muted-foreground"> — {b.desc}</span>
                      </p>
                      <span className="shrink-0 font-mono text-[12px] font-semibold text-muted-foreground/60 line-through">{b.value}€</span>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="mb-6 border-border" />

              {/* ── VALUE RECAP ── */}
              <div className="mb-6 rounded-xl border border-border p-4" style={{ backgroundColor: "hsl(var(--muted))" }}>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Récapitulatif de valeur</p>
                <div className="flex flex-col gap-1.5">
                  {valueItems.map((v) => (
                    <div key={v.label} className="flex items-center justify-between">
                      <span className="text-[13px] text-muted-foreground">{v.label}</span>
                      <span className="font-mono text-[13px] font-medium text-muted-foreground/60">{v.value}€</span>
                    </div>
                  ))}
                  <hr className="my-2 border-border" />
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-foreground">Valeur totale</span>
                    <span className="font-mono text-[15px] font-bold text-muted-foreground line-through">935€</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-foreground">Ton investissement aujourd'hui</span>
                    <span className="font-mono text-[20px] font-extrabold text-foreground">{tier.currentPrice}€</span>
                  </div>
                </div>
              </div>

              {/* ── CTA ── */}
              <a
                href="#"
                onClick={onCTA}
                className="cta-rainbow relative flex w-full items-center justify-center gap-2 rounded-[10px] bg-foreground py-4 text-[16px] font-bold text-background no-underline transition-opacity hover:opacity-85"
              >
                Rejoindre la mission · {tier.currentPrice}€ →
              </a>

              {/* ── GUARANTEE ── */}
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3" style={{ backgroundColor: "hsl(var(--muted))" }}>
                <Shield size={14} strokeWidth={1.5} className="shrink-0 text-foreground/60" />
                <p className="text-[13px] font-medium text-muted-foreground">
                  <span className="font-semibold text-foreground">Satisfait ou remboursé — 14 jours.</span> Sans condition. Sans question.
                </p>
              </div>

              {/* ── TRUST STRIP ── */}
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
  { uid: "alfred", variant: "a", name: "Alfred",  role: "CEO & Founder",             bio: "Développement produit, vision et architecture du groupe.", photo: "/Alfred_Buildrs_V2.png" },
  { uid: "chris",  variant: "b", name: "Chris",   role: "CCO & Développeur Full Stack", bio: "Agents IA, automatisation avancée, infrastructures backend.", photo: "/Chris_Buildrs.png" },
  { uid: "tim",    variant: "c", name: "Tim",     role: "CMO & Vibe Coder Front",       bio: "Direction artistique, conception produit et front-end.", photo: "/Tim_Buildrs.png" },
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
                  <RobotJarvis size={160} />
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
                <p className="text-[12px] text-white/55 leading-relaxed whitespace-pre-line">{bio}</p>
              </div>
            </div>
          ))}
        </div>
        </Reveal>

        {/* Credibility block */}
        <div
          className="rounded-2xl px-8 py-8 mb-4"
          style={{ background: "#111113", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-8">
            {/* Stats */}
            <div className="flex gap-8 shrink-0">
              <div className="text-center">
                <p className="text-[36px] font-extrabold text-white leading-none" style={{ letterSpacing: "-0.04em" }}>+25</p>
                <p className="text-[11px] text-white/35 mt-1 uppercase tracking-wider">SaaS IA lancés</p>
              </div>
              <div className="text-center">
                <p className="text-[36px] font-extrabold text-white leading-none" style={{ letterSpacing: "-0.04em" }}>+250</p>
                <p className="text-[11px] text-white/35 mt-1 uppercase tracking-wider">Builders accompagnés</p>
              </div>
            </div>
            {/* Divider */}
            <div className="hidden sm:block w-px self-stretch" style={{ background: "rgba(255,255,255,0.08)" }} />
            {/* Copy */}
            <div>
              <p className="text-[15px] font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
                Pas des coachs. Des entrepreneurs, experts en produit et en IA.
              </p>
              <p className="text-[13px] leading-[1.7] text-white/45">
                On utilise l'intelligence artificielle comme levier d'enrichissement — pas pour en parler, pour en vivre. +25 SaaS lancés, déployés sur le marché, pour des entreprises et pour nous. 3 revendus à 5 chiffres. On a décidé, il y a quelques mois, de rendre ce système accessible. Buildrs, c'est un mouvement. Pas une formation.
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
        Ton premier SaaS IA est à 6 jours d'ici.
      </h2>
      <p className="mx-auto mb-9 max-w-[440px] text-[17px] leading-[1.65] text-muted-foreground">
        Pas dans 6 mois. Pas quand tu auras appris à coder. Pas quand tu auras trouvé le bon moment. En 6 jours.
      </p>
      <div className="hero-rainbow-border relative inline-flex cursor-pointer" onClick={onCTA}>
        <div className="relative rounded-xl bg-foreground px-8 py-4 text-[15px] font-semibold text-background">
          Commencer maintenant — {BLUEPRINT_PRICE}€ (au lieu de {STRIKETHROUGH_PRICE}€) →
        </div>
      </div>
      <div className="mt-4 w-full max-w-[480px] mx-auto">
        <BuilderTierBadge variant="full" />
      </div>
      <p className="mt-4 text-[13px] text-muted-foreground/50">
        Garantie 14 jours · Paiement unique · Accès à vie · Mises à jour incluses
      </p>
    </section>
  )
}

// ─── PROGRAMME ───────────────────────────────────────────────────────────────

const programmeModules = [
  {
    num: "01", title: "Fondations",
    highlight: "Ta stratégie de lancement définie",
    color: "#4d96ff", bg: "rgba(77,150,255,0.07)", border: "rgba(77,150,255,0.20)",
    folderColor: "blue" as const,
    bullets: [
      "Tu comprends pourquoi l'IA fait 80% du travail à ta place",
      "Découverte de Claude, Claude Code, Claude Co-Work et Claude Design",
      "Tu choisis le format adapté à ton profil : micro SaaS IA, SaaS IA ou logiciel",
      "Tu choisis ta stratégie : copier, résoudre ou découvrir",
      "Tu poses ton objectif financier : revenu récurrent, revente ou commande client",
    ],
  },
  {
    num: "02", title: "Ton espace de travail",
    highlight: "Un environnement complet, configuré, prêt à builder",
    color: "#cc5de8", bg: "rgba(204,93,232,0.07)", border: "rgba(204,93,232,0.20)",
    folderColor: "black" as const,
    bullets: [
      "Découverte des meilleurs outils du marché (on t'offre les licences)",
      "Ton environnement complet est prêt en une session",
      "Zéro configuration à refaire — c'est en place pour de bon",
      "Outils · Authentification · Base de données · Back-end · Front-end · Paiement · Feature IA",
    ],
  },
  {
    num: "03", title: "Trouver & Valider",
    highlight: "Ton idée validée et ta fiche produit prête à exécuter",
    color: "#f06595", bg: "rgba(240,101,149,0.07)", border: "rgba(240,101,149,0.20)",
    folderColor: "pink" as const,
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
    color: "#eab308", bg: "rgba(234,179,8,0.07)", border: "rgba(234,179,8,0.20)",
    folderColor: "yellow" as const,
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
    folderColor: "red" as const,
    bullets: [
      "Tu décris ce que tu veux — l'IA génère ton produit",
      "Ta fonctionnalité principale est construite et fonctionnelle",
      "L'inscription utilisateur et l'onboarding sont en place",
      "Création du front-end et du back-end, de l'authentification, de la sécurité, des paiements et des automatisations",
    ],
  },
  {
    num: "06", title: "Déployer",
    highlight: "Ton produit en ligne, accessible au monde entier",
    color: "#a1a1aa", bg: "rgba(161,161,170,0.07)", border: "rgba(161,161,170,0.20)",
    folderColor: "grey" as const,
    bullets: [
      "Ton produit est mis en ligne en un clic — Vercel s'occupe de tout",
      "Ton domaine personnalisé est connecté",
      "Paiements et emails automatiques sont branchés et testés",
    ],
  },
  {
    num: "07", title: "Monétiser & Lancer",
    highlight: "Ta page de vente live, ta communication lancée, tes premiers euros en vue",
    color: "#f97316", bg: "rgba(249,115,22,0.07)", border: "rgba(249,115,22,0.20)",
    folderColor: "orange" as const,
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
  const sectionRef = useRef<HTMLDivElement>(null)
  const [lineProgress, setLineProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const windowH = window.innerHeight
      const progress = Math.min(1, Math.max(0, (windowH - rect.top) / (rect.height + windowH * 0.3)))
      setLineProgress(progress)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section id="modules" className="relative py-20 sm:py-28" style={{ background: '#0a0a0a' }}>
      <div className="mx-auto max-w-[1060px] px-6">

        {/* Header */}
        <div className="mb-16 text-center">
          <Reveal>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Le programme
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2
              style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.08 }}
              className="mb-5 text-white"
            >
              7 jours. 7 modules.<br />1 SaaS IA en live.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto max-w-[520px] text-[15px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Chaque jour, une étape claire. Chaque étape, un livrable. On l'exécute en parallèle de toi pour t'illustrer chaque module, et te montrer le système exact.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-6 flex justify-center">
              <div
                className="inline-flex items-center gap-3 rounded-2xl px-5 py-3"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <svg fill="currentColor" fillRule="evenodd" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgba(255,255,255,0.7)', flexShrink: 0 }}>
                  <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z" />
                </svg>
                <div className="h-3.5 w-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] font-semibold" style={{ color: 'rgba(255,255,255,0.65)', letterSpacing: '0.02em' }}>
                    Buildrs Group · Anthropic Certified Partner
                  </span>
                  <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Plus de 25 SaaS IA propulsés, dont trois revendus
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Timeline */}
        <div className="relative" ref={sectionRef}>

          {/* Ligne verticale desktop */}
          <div className="absolute pointer-events-none hidden md:block"
            style={{ left: '50%', top: 16, bottom: 16, width: 1, transform: 'translateX(-50%)',
              background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.08) 4%, rgba(255,255,255,0.08) 96%, transparent)' }}
          />
          {/* Fill animé desktop */}
          <div className="absolute pointer-events-none hidden md:block overflow-hidden"
            style={{ left: '50%', top: 16, bottom: 16, width: 1, transform: 'translateX(-50%)' }}
          >
            <div style={{ width: '100%', height: `${lineProgress * 100}%`,
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.35) 60%, rgba(255,255,255,0.08))',
              transition: 'height 0.15s ease-out' }} />
          </div>

          {/* Ligne mobile */}
          <div className="absolute pointer-events-none md:hidden"
            style={{ left: 19, top: 16, bottom: 16, width: 1, background: 'rgba(255,255,255,0.08)' }} />
          <div className="absolute pointer-events-none md:hidden overflow-hidden"
            style={{ left: 19, top: 16, bottom: 16, width: 1 }}
          >
            <div style={{ width: '100%', height: `${lineProgress * 100}%`,
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.35) 60%, rgba(255,255,255,0.08))',
              transition: 'height 0.15s ease-out' }} />
          </div>

          <div className="flex flex-col" style={{ gap: 0 }}>
            {programmeModules.map((mod, i) => {
              const isLeft = i % 2 === 0

              const Card = (
                <div
                  className="flex flex-col rounded-2xl p-5 transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255,255,255,0.07)'
                    el.style.borderColor = mod.border
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255,255,255,0.04)'
                    el.style.borderColor = 'rgba(255,255,255,0.08)'
                  }}
                >
                  <div className="mb-3 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold"
                      style={{ background: mod.bg, color: mod.color, border: `1px solid ${mod.border}` }}>
                      {mod.num}
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em]"
                      style={{ color: 'rgba(255,255,255,0.30)' }}>
                      Module {mod.num}
                    </span>
                  </div>
                  <h3 className="mb-3 font-bold leading-tight text-white"
                    style={{ fontSize: 'clamp(15px, 1.8vw, 18px)', letterSpacing: '-0.02em' }}>
                    {mod.title}
                  </h3>
                  <div className="mb-3">
                    <Folder color={mod.folderColor} size="sm" />
                  </div>
                  <p className="mb-3 text-[12px] font-semibold leading-snug" style={{ color: mod.color }}>
                    {mod.highlight}
                  </p>
                  <div className="mb-3" style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
                  <ul className="flex flex-col gap-1.5">
                    {mod.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2 text-[12px] leading-[1.55]"
                        style={{ color: 'rgba(255,255,255,0.45)' }}>
                        <span className="mt-[6px] shrink-0 h-[3px] w-[3px] rounded-full"
                          style={{ background: mod.color, opacity: 0.7 }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )

              return (
                <Reveal key={mod.num} delay={0.05 + i * 0.05}>
                  {/* Desktop — alternance gauche/droite */}
                  <div className="hidden md:grid items-center pb-10"
                    style={{ gridTemplateColumns: '1fr 80px 1fr', minHeight: 80 }}>

                    {/* Colonne gauche */}
                    <div className="pr-10">
                      {isLeft ? Card : null}
                    </div>

                    {/* Dot central */}
                    <div className="flex justify-center relative z-10">
                      <div className="flex items-center justify-center rounded-full text-[11px] font-bold"
                        style={{
                          width: 36, height: 36,
                          background: mod.color,
                          color: '#09090b',
                          boxShadow: `0 0 0 4px #0a0a0a, 0 0 0 5px ${mod.border}, 0 4px 16px rgba(0,0,0,0.4)`,
                          letterSpacing: '-0.01em', flexShrink: 0,
                        }}>
                        {mod.num}
                      </div>
                    </div>

                    {/* Colonne droite */}
                    <div className="pl-10">
                      {!isLeft ? Card : null}
                    </div>
                  </div>

                  {/* Mobile — dot gauche + card droite */}
                  <div className="flex md:hidden gap-5 pb-8 items-start">
                    <div className="shrink-0 flex items-center justify-center rounded-full z-10 text-[11px] font-bold"
                      style={{ width: 36, height: 36, background: mod.color, color: '#09090b',
                        boxShadow: `0 0 0 4px #0a0a0a, 0 0 0 5px ${mod.border}`,
                        marginTop: 2, letterSpacing: '-0.01em', flexShrink: 0 }}>
                      {mod.num}
                    </div>
                    <div className="flex-1">{Card}</div>
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
        <Pain />
        <WindowIA />
        <SaasVehicle />
        <BeforeAfter />
        <Programme />
        <ProjectExamplesSection />
        <Pricing onCTA={go} />
        <div className="mx-auto px-4" style={{ maxWidth: 640, marginTop: '-8px', marginBottom: 0 }}>
          <div style={{
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.09)',
            background: '#09090b',
            padding: '28px 32px',
          }}>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Attention · Ce n'est pas une formation
            </p>
            <p className="text-[15px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.60)' }}>
              Pour Blueprint, on a buildé un vrai SaaS IA de A à Z, en 7 jours, en filmant chaque étape. Tu suis exactement la même méthode avec ton idée — vidéos, checklists, prompts, outils. Tout le système qu'on a utilisé est dans le pack.
            </p>
            <p className="mt-5 text-[17px] font-bold" style={{ color: '#fafafa', letterSpacing: '-0.02em' }}>
              Tu n'apprends pas à builder un SaaS.<br />Tu builds ton SaaS.
            </p>
          </div>
        </div>
        <WhatYouGet />
        <TriSection />
        <TeamSection />
        <UniqueTestimonialSection />
        <FAQ />
        <FinalCTA onCTA={go} />
      </main>
      <StackedCircularFooter />
    </>
  )
}
