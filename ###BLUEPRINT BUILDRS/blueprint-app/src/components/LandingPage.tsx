import { useState, useEffect } from "react"
import { Clock, Banknote, Layers, Bot, Zap, Check, Flame, Globe, TrendingUp, Copy, ArrowLeftRight, BookOpen, Lightbulb, CheckSquare, Wrench, FolderOpen, Linkedin } from "lucide-react"
import { StackedCircularFooter } from "./ui/stacked-circular-footer"
import { BuildrsIcon, BrandIcons, ClaudeIcon, WhatsAppIcon } from "./ui/icons"

import { DashboardPreviewV2 as DashboardPreview } from "./ui/dashboard-preview"
import { DottedSurface } from "./ui/dotted-surface"
import { OrbitalClaude } from "./ui/orbital-claude"
import { WordRotate } from "./ui/word-rotate"
import { SaasMarquee } from "./ui/saas-marquee"
import { BGPattern } from "./ui/bg-pattern"
import { RobotJarvis, RobotValidator } from "./ui/agent-robots"

// ── Countdown to launch end ───────────────────────────────────────────────────
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
  { label: "Claude AI",   Icon: BrandIcons.claude },
  { label: "Stitch",      Icon: BrandIcons.stitch },
  { label: "21st.dev",    Icon: BrandIcons.twentyOneDev },
  { label: "VS Code",     Icon: BrandIcons.vscode },
  { label: "Supabase",    Icon: BrandIcons.supabase },
  { label: "Vercel",      Icon: BrandIcons.vercel },
  { label: "Resend",      Icon: BrandIcons.resend },
  { label: "Stripe",      Icon: BrandIcons.stripe },
  { label: "Hostinger",   Icon: BrandIcons.hostinger },
  { label: "GitHub",      Icon: BrandIcons.github },
  { label: "Perplexity",  Icon: BrandIcons.perplexity },
  { label: "NotebookLM",  Icon: BrandIcons.notebooklm },
]

const stats = [
  { num: "6 jours", desc: "De l'idée au produit live", sub: "" },
  { num: "1 SaaS", desc: "Déployé, en ligne, prêt à vendre", sub: "" },
  { num: "0 ligne", desc: "de code — Claude construit. Tu pilotes.", sub: "" },
]

const pains = [
  {
    Icon: Clock,
    title: "Tu scrolles depuis des mois sans rien lancer",
    desc: "Tout le monde s'improvise expert en IA. Tu vois passer 10 000 projets, tu notes, tu enregistres, tu likes. Mais tu ne lances rien. Perdu dans le trop-plein d'informations.",
  },
  {
    Icon: Banknote,
    title: "997€ de formations. Zéro produit en ligne.",
    desc: "Tu as suivi des cours, regardé des heures de tutos, pris des notes. Mais à la fin, rien n'est live. Parce qu'on t'a appris la théorie, pas l'exécution.",
  },
  {
    Icon: Layers,
    title: "Trop d'outils, zéro direction",
    desc: "GPT, Gemini, Bolt, Replit, Cursor, Lovable, Make... Tu ne sais plus lequel utiliser ni dans quel ordre. Résultat : paralysie.",
  },
  {
    Icon: Bot,
    title: "Pendant ce temps, d'autres lancent",
    desc: "Sans background technique, sans équipe, sans budget. Ils n'ont rien de plus que toi. Ils ont juste un système et de la direction.",
  },
]


const faqs = [
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
  { title: 'Le système complet', desc: "Plan guidé en 7 étapes — de l'idée au produit IA monétisé. Checklist de progression intégrée." },
  { title: 'Générateurs IA', desc: "Marketplace de projets validés + Générateur d'idées + Validateur avec score de viabilité + Calculateur de revenus." },
  { title: 'Le cockpit', desc: "Dashboard de pilotage — ton projet, ta progression, tes métriques, tout au même endroit." },
  { title: 'Les ressources Claude', desc: "50+ prompts testés, configs prêtes à l'emploi, le kit complet pour construire avec Claude." },
  { title: 'La communauté', desc: "Accès aux autres builders + mises à jour à vie." },
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
        <div className="flex items-center gap-1">
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
    <section className="relative overflow-hidden px-6 sm:px-10 pb-20 pt-[120px] sm:pt-[140px]">
      {/* Stars */}
      <StarField />

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

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28'%3E%3Crect x='0' y='0' width='3' height='3' fill='rgba(0%2C0%2C0%2C0.13)'/%3E%3C/svg%3E")`,
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 30%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 30%, black 40%, transparent 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-[600px]"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(170,170,255,0.08) 0%, transparent 65%)" }}
      />

      <div className="relative mx-auto max-w-[700px] flex flex-col items-center text-center">

        {/* Text */}
        <div className="flex flex-col items-center text-center">

          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-[12px] sm:text-[13px] text-muted-foreground">
            <svg width="13" height="13" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-foreground">
              <rect x="7" y="0" width="2" height="3" fill="currentColor"/>
              <rect x="15" y="0" width="2" height="3" fill="currentColor"/>
              <rect x="5" y="2" width="2" height="2" fill="currentColor"/>
              <rect x="17" y="2" width="2" height="2" fill="currentColor"/>
              <rect x="3" y="4" width="18" height="12" rx="2" fill="currentColor"/>
              <rect x="6" y="7" width="4" height="4" rx="1" fill="#09090b"/>
              <rect x="14" y="7" width="4" height="4" rx="1" fill="#09090b"/>
              <rect x="7" y="8" width="2" height="2" fill="currentColor"/>
              <rect x="15" y="8" width="2" height="2" fill="currentColor"/>
              <rect x="9" y="13" width="6" height="2" rx="1" fill="rgba(255,255,255,0.45)"/>
              <rect x="5" y="17" width="4" height="4" rx="1" fill="currentColor"/>
              <rect x="15" y="17" width="4" height="4" rx="1" fill="currentColor"/>
              <rect x="4" y="20" width="3" height="2" rx="1" fill="rgba(255,255,255,0.45)"/>
              <rect x="17" y="20" width="3" height="2" rx="1" fill="rgba(255,255,255,0.45)"/>
            </svg>
            <span>Rejoins les 110+ builders qui ont déjà lancé</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted-foreground/50"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>

          {/* H1 */}
          <h1
            className="mb-7 text-foreground mx-auto max-w-[900px]"
            style={{ fontSize: "clamp(32px, 3.8vw, 52px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.06 }}
          >
            Ton premier produit IA qui te rapporte pendant que tu dors. En 6 jours. Avec l'IA.
          </h1>

          {/* Sub */}
          <p className="mb-8 max-w-[520px] text-[16px] leading-[1.65] text-muted-foreground">
            Un système guidé, de l'idée au premier euro.{" "}
            <strong className="font-semibold text-foreground">Zéro compétence technique. Claude Code fait le travail.</strong>
          </p>

          {/* Typing idea */}
          <TypingIdea />

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <a href="#tarif" onClick={onCTA} className="cta-rainbow flex items-center gap-2 rounded-[10px] bg-foreground px-7 py-3.5 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 no-underline">
              Accéder au Blueprint — 27€ →
            </a>
          </div>

        </div>

      </div>
    </section>
  )
}

// ─── MARQUEE ──────────────────────────────────────────────────────────────────

function Marquee() {
  return (
    <section className="overflow-hidden border-y border-border bg-background py-10">
      <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.11em] text-muted-foreground/60 px-6 sm:px-0">
        Claude Code pilote tous tes outils — tous gratuits ou presque.
      </p>
      <div className="overflow-hidden">
        <div
          className="flex items-center gap-8"
          style={{ width: "max-content", animation: "marquee-scroll 40s linear infinite" }}
        >
          {[...tools, ...tools, ...tools, ...tools].map(({ label, Icon }, i) => (
            <Icon key={i} aria-label={label} className="h-7 w-7 shrink-0 text-foreground/30 hover:text-foreground/60 transition-colors" />
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
        {stats.map(({ num, desc, sub }) => (
          <div key={num} className="bg-background px-6 py-10 text-center">
            <div
              className="mb-2 leading-none text-foreground whitespace-nowrap"
              style={{ fontSize: "clamp(24px, 3.2vw, 40px)", fontWeight: 800, letterSpacing: "-0.04em" }}
            >
              {num}
            </div>
            <p className="text-[14px] leading-relaxed text-muted-foreground">{desc}</p>
            {sub && <p className="text-[12px] text-muted-foreground/50 mt-0.5 uppercase tracking-wide font-medium">{sub}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── WHY SAAS ────────────────────────────────────────────────────────────────


const whySaasStats = [
  { num: "0 ligne de code", desc: "Tu décris, l'IA construit" },
  { num: "100% solo", desc: "Aucune équipe nécessaire" },
  { num: "27€", desc: "pour tout démarrer", sub: "Paiement unique, accès à vie" },
]

function WhySaaS() {
  return (
    <section id="resultats" className="relative py-24 overflow-hidden" style={{ background: "#0a0a0a" }}>
      <StarField />
      <div className="mx-auto max-w-[760px] px-6 text-center">
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.09em] text-white/40">
          Pourquoi maintenant
        </p>
        <h2
          style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.08 }}
          className="mb-6 text-white"
        >
          Il y a 1 an, créer un SaaS demandait +6 mois et +20 000€. Aujourd'hui : 6 jours et 27€.
        </h2>
        <p className="mx-auto max-w-[540px] text-[17px] leading-[1.65] text-white/50">
          Le code, c'est le problème de l'IA. Ton job : avoir la vision, donner la direction. Tu décris ce que tu veux — l'IA construit. Bienvenue en 2026.
        </p>
      </div>

      {/* Orbital animation */}
      <div className="mx-auto mt-10 max-w-[460px] px-6">
        <OrbitalClaude />
      </div>

      {/* Stat badges */}
      <div className="mx-auto mt-8 max-w-[900px] px-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {whySaasStats.map(({ num, desc, sub }) => (
          <div
            key={num}
            className="rounded-2xl px-6 py-5 text-center"
            style={{ background: "#111113", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="text-[20px] font-bold text-white leading-tight">{num}</p>
            <p className="mt-1 text-[13px] text-white/50">{desc}</p>
            {sub && <p className="mt-0.5 text-[11px] text-white/30">{sub}</p>}
          </div>
        ))}
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
        Pendant ce temps, des gens sans background technique lancent des micro-SaaS, des apps et des logiciels à +5 000€/mois. Ce n'est pas un manque de talent. C'est un manque de système et de direction.
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

      {/* Transition phrase */}
      <p className="mt-12 text-center text-[18px] sm:text-[20px] font-semibold text-foreground" style={{ letterSpacing: '-0.02em' }}>
        Et si le problème, c'était pas toi — mais ta méthode ?
      </p>
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
    description: "Tu crées ton produit une fois. Il se vend à l'infini, dans tous les pays, sans stock à gérer, sans livraison, sans logistique. Claude code le produit une fois. Tu le vends à l'infini.",
    icon: <Globe strokeWidth={1.5} size={20} />,
  },
  {
    id: "mrr",
    title: "Revenus récurrents",
    stat: "50 clients × 29€ = 1 450€/mois",
    description: "50 clients × 29€ = 1 450€/mois. Sans équipe. Sans stock. Claude gère.",
    icon: <TrendingUp strokeWidth={1.5} size={20} />,
  },
  {
    id: "stack",
    title: "Dupliquer et automatiser",
    stat: "SaaS 1 → SaaS 2 → SaaS 3",
    description: "Tu configures ton écosystème IA une seule fois. Tes agents autonomes gèrent le support, l'acquisition, le contenu. Tu dupliques la méthode, tu lances un deuxième produit, un troisième. Chaque SaaS tourne en autopilote pendant que tu construis le suivant.",
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
        <div className="mb-14">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
            Pourquoi un SaaS IA
          </p>
          <h2
            style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.08 }}
            className="mb-5 text-foreground max-w-[500px]"
          >
            Pourquoi un SaaS IA est le meilleur business model en 2026.
          </h2>
          <p className="max-w-[560px] text-[17px] leading-[1.65] text-muted-foreground">
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
]

const afterItems = [
  "Tu as un produit live accessible au monde entier",
  "Tu sais construire n'importe quel produit IA avec Claude en quelques jours",
  "Tu crées des SaaS IA qui résolvent un vrai problème et génèrent des revenus",
  "Tu possèdes un actif digital qui travaille pour toi — même quand tu dors",
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
    title: 'Jarvis IA',
    desc: 'Ton espace projet intelligent. Progression, fiche produit, outils configurés et revenus estimés — tout centralisé.',
  },
  {
    Icon: BookOpen,
    title: 'Mon Parcours',
    desc: '7 modules et +30 leçons interactives. Un plan structuré de l\'idée aux premiers revenus, à suivre à ton rythme.',
  },
  {
    Icon: Lightbulb,
    title: 'Plugins IA',
    desc: 'NicheFinder™, MarketPulse™, FlipCalc™ — plus tout l\'environnement Claude AI configuré plug & play pour chaque étape.',
  },
  {
    Icon: Copy,
    title: 'Bibliothèque d\'instructions',
    desc: '100+ instructions IA copiables classées par étape. Prêtes à utiliser en un clic.',
  },
  {
    Icon: CheckSquare,
    title: 'Checklist de lancement',
    desc: 'Chaque étape cochable en temps réel. Tu sais exactement où tu en es et ce qu\'il reste à faire.',
  },
  {
    Icon: Wrench,
    title: 'Boîte à outils',
    desc: 'Tous les outils nécessaires avec guides de configuration pas à pas et liens directs.',
  },
]

function DashboardSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 w-full h-full opacity-50 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--muted-foreground) / 0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="text-center mb-14">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
            Ce que tu vas recevoir
          </p>
          <h2
            style={{ fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.06 }}
            className="mb-4 text-foreground"
          >
            Pas un PDF. Pas une vidéo.<br />Un vrai copilote IA.
          </h2>
          <p className="mx-auto max-w-[580px] text-[17px] leading-[1.65] text-muted-foreground">
            Trouve ton idée. Valide-la. Construis-la. Monétise-la.<br />
            Tout dans un seul système.
          </p>
        </div>

        {/* Label → mockup */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Voici à quoi tu auras accès
          </span>
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className="text-muted-foreground/40">
            <path d="M8 0v17M1 11l7 8 7-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <DashboardPreview />
      </div>
    </section>
  )
}

// ─── BUILT WITH US ────────────────────────────────────────────────────────────

interface SaasBuiltItem {
  productName: string
  founderName: string
  founderAvatar: string
  desc: string
  cible: string
  mrr: string
  temps: string
  stars: number
  thumbnail?: string
  preview?: React.ReactNode
}

// ─── PRICEFLOW DASHBOARD MOCKUP ───────────────────────────────────────────────

function PriceFlowPreview() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', display: 'flex', height: '100%', background: '#fff', overflow: 'hidden', borderRadius: 8 }}>
      {/* Sidebar */}
      <div style={{ width: '22%', background: '#0f1117', padding: '10px 6px', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10, paddingLeft: 4 }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }} />
          <span style={{ color: 'white', fontWeight: 700, fontSize: 8 }}>PriceFlow</span>
        </div>
        {[
          { label: 'Dashboard', active: true },
          { label: 'Règles de prix' },
          { label: 'Produits' },
          { label: 'Analyse' },
          { label: 'Concurrents' },
          { label: 'Rapports' },
          { label: 'Automatisations' },
        ].map(item => (
          <div key={item.label} style={{
            padding: '4px 6px', borderRadius: 3,
            background: item.active ? '#1e293b' : 'transparent',
            color: item.active ? 'white' : '#475569',
            fontSize: 7, fontWeight: item.active ? 600 : 400,
          }}>{item.label}</div>
        ))}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 4, paddingTop: 8, borderTop: '1px solid #1e293b' }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 7, fontWeight: 600, color: 'white' }}>Jean Dupont</div>
            <div style={{ fontSize: 6, color: '#64748b' }}>Pro Plan</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, background: '#f8fafc', padding: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 10, color: '#0f172a' }}>Bonjour, Jean 👋</div>
            <div style={{ fontSize: 6, color: '#64748b' }}>Aperçu de vos performances aujourd'hui</div>
          </div>
          <div style={{ background: '#e2e8f0', borderRadius: 4, padding: '3px 7px', fontSize: 6, color: '#64748b' }}>Rechercher...</div>
        </div>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
          {[
            { label: 'Revenu total', value: '€124,580', change: '+12.5%', pos: true },
            { label: 'Produits actifs', value: '2,847', change: '+8.2%', pos: true },
            { label: 'Ajustements prix', value: '1,234', change: '+24.1%', pos: true },
            { label: 'Commandes', value: '856', change: '-3.2%', pos: false },
          ].map(kpi => (
            <div key={kpi.label} style={{ background: 'white', borderRadius: 5, padding: '5px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 5.5, color: '#64748b', marginBottom: 2 }}>{kpi.label}</div>
              <div style={{ fontSize: 9, fontWeight: 800, color: '#0f172a', marginBottom: 1 }}>{kpi.value}</div>
              <div style={{ fontSize: 5.5, color: kpi.pos ? '#22c55e' : '#ef4444', fontWeight: 500 }}>{kpi.change} vs mois dernier</div>
            </div>
          ))}
        </div>

        {/* Chart + Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 4, flex: 1, minHeight: 0 }}>
          <div style={{ background: 'white', borderRadius: 5, padding: 6, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ fontSize: 7.5, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>Revenu & Profit</div>
            <div style={{ fontSize: 5.5, color: '#94a3b8', marginBottom: 4 }}>Performance mensuelle</div>
            <svg width="100%" height="38" viewBox="0 0 200 38" preserveAspectRatio="none">
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0,35 C20,33 40,28 60,24 C80,20 100,16 120,13 C140,10 160,8 180,7 L200,6 L200,38 L0,38Z" fill="url(#blueGrad)"/>
              <polyline points="0,35 30,30 60,24 90,19 120,13 150,9 180,7 200,6" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round"/>
              <polyline points="0,37 30,36 60,35 90,33 120,31 150,29 180,28 200,27" fill="none" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 5.5, color: '#64748b' }}>
                <div style={{ width: 8, height: 2, background: '#3b82f6', borderRadius: 1 }} /> Revenu
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 5.5, color: '#64748b' }}>
                <div style={{ width: 8, height: 2, background: '#22c55e', borderRadius: 1 }} /> Profit
              </div>
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: 5, padding: 6, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ fontSize: 7.5, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>Activité récente</div>
            {[
              { label: 'Prix augmenté', sub: 'AirPods Pro 2 → €279', color: '#22c55e' },
              { label: 'Prix réduit', sub: 'Samsung 4K 55" → €489', color: '#ef4444' },
              { label: 'Règle déclenchée', sub: 'Alignement concurrent', color: '#f59e0b' },
              { label: 'Alerte stock bas', sub: 'Dyson V15 — 12 unités', color: '#64748b' },
              { label: 'Prix augmenté', sub: 'Nike Air Max 90 → €149', color: '#22c55e' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2.5px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 6, fontWeight: 500, color: '#0f172a' }}>{item.label}</div>
                  <div style={{ fontSize: 5, color: '#94a3b8' }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules table */}
        <div style={{ background: 'white', borderRadius: 5, padding: 6, border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 7.5, fontWeight: 600, color: '#0f172a', marginBottom: 3 }}>Règles de tarification <span style={{ fontSize: 5.5, color: '#94a3b8', fontWeight: 400 }}>5 règles actives</span></div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.8fr 0.8fr', gap: 2, marginBottom: 3, paddingBottom: 2, borderBottom: '1px solid #e2e8f0' }}>
            {['Règle','Catégorie','Statut','Produits','Impact'].map(h => (
              <div key={h} style={{ fontSize: 5.5, color: '#94a3b8', fontWeight: 600 }}>{h}</div>
            ))}
          </div>
          {[
            { name: 'Marge minimum 15%', cat: 'Électronique', status: 'Actif', prod: '342', impact: '+€3,240', statusColor: '#dcfce7', statusText: '#16a34a' },
            { name: 'Alignement concurrent', cat: 'Mode', status: 'Actif', prod: '128', impact: '+€1,898', statusColor: '#dcfce7', statusText: '#16a34a' },
            { name: 'Promo Black Friday', cat: 'Tous', status: 'Planifié', prod: '2847', impact: '—', statusColor: '#fef9c3', statusText: '#ca8a04' },
          ].map(rule => (
            <div key={rule.name} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.8fr 0.8fr', gap: 2, padding: '2.5px 0', borderBottom: '1px solid #f8fafc', alignItems: 'center' }}>
              <div style={{ fontSize: 6, fontWeight: 500, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rule.name}</div>
              <div style={{ fontSize: 5.5, color: '#64748b' }}>{rule.cat}</div>
              <div style={{ fontSize: 5, padding: '1px 4px', borderRadius: 20, background: rule.statusColor, color: rule.statusText, fontWeight: 600, textAlign: 'center', width: 'fit-content' }}>{rule.status}</div>
              <div style={{ fontSize: 5.5, color: '#64748b' }}>{rule.prod}</div>
              <div style={{ fontSize: 6, color: '#22c55e', fontWeight: 600 }}>{rule.impact}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const SAAS_BUILT: SaasBuiltItem[] = [
  {
    productName: "PriceFlow",
    founderName: "Thomas",
    founderAvatar: "/Mec1.webp",
    desc: "Ajuste les prix des e-commerçants en temps réel selon la concurrence et les stocks.",
    cible: "E-commerçants Shopify",
    mrr: "50 clients × 29€ = 1 450€/mois",
    temps: "5 jours",
    stars: 4,
    thumbnail: "/DASH1.webp",
  },
  {
    productName: "Brew App",
    founderName: "Chris",
    founderAvatar: "/Chris_opt.jpg",
    desc: "Carnet de dégustation pour amateurs de café — origines, profils, méthodes d'extraction.",
    cible: "Coffee lovers & baristas",
    mrr: "100 users × 9€ = 900€/mois",
    temps: "4 jours",
    stars: 5,
    thumbnail: "/D3.webp",
  },
  {
    productName: "StayTrack",
    founderName: "Julie",
    founderAvatar: "/F2.webp",
    desc: "Gestion de locations : loyers, charges, taux d'occupation, alertes automatiques.",
    cible: "Propriétaires multi-biens",
    mrr: "30 clients × 49€ = 1 470€/mois",
    temps: "6 jours",
    stars: 4,
    thumbnail: "/Dash2.webp",
  },
]

function SaasBuiltCard({ item }: { item: SaasBuiltItem }) {
  return (
    <div className="break-inside-avoid mb-4 rounded-3xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      {(item.preview || item.thumbnail) && (
        <div className="mb-4 overflow-hidden rounded-xl border border-border" style={{ aspectRatio: "16/9" }}>
          {item.preview
            ? item.preview
            : <img src={item.thumbnail} alt={item.productName} className="h-full w-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }} />
          }
        </div>
      )}

      <div className="mb-2 flex items-center gap-2 flex-wrap">
        <div className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-foreground">
          {item.productName}
        </div>
        <div className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold" style={{ background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)' }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          Construit avec Claude · {item.temps}
        </div>
      </div>

      <p className="mb-5 text-[15px] leading-relaxed text-muted-foreground">
        {item.desc}
      </p>

      <div className="mb-5 flex flex-col gap-2">
        {[
          { label: 'Cible',         value: item.cible },
          { label: 'MRR Potentiel', value: item.mrr   },
          { label: 'Temps',         value: item.temps },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-baseline gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50 w-[90px] shrink-0">{label}</span>
            <span className="text-[13px] font-semibold text-foreground">{value}</span>
          </div>
        ))}
      </div>

      <hr className="mb-4 border-border" />

      <div className="flex items-center gap-3">
        <img
          src={item.founderAvatar}
          alt={item.founderName}
          className="h-9 w-9 shrink-0 rounded-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
        />
        <p className="text-[14px] font-semibold text-foreground flex-1">{item.founderName}</p>
        <div className="flex shrink-0 gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className={i <= item.stars ? 'text-foreground' : 'text-border'}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
      </div>
    </div>
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
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Tarif</p>
        <h2 style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }} className="mb-4 text-foreground">
          Tout ce qu'il te faut pour lancer<br />ton produit avec l'IA.
        </h2>
        <p className="mx-auto max-w-[480px] text-[17px] leading-[1.65] text-muted-foreground">
          Un seul paiement. Accès à vie. Zéro risque.
        </p>

        {/* Shine border wrapper */}
        <div className="bump-neon relative mx-auto mt-12 max-w-[560px]" style={{ borderRadius: 22 }}>
          <div className="bump-inner p-10 text-left" style={{ borderRadius: 20 }}>
            {/* Header row */}
            <div className="mb-5 flex items-center justify-between">
              <p className="text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">Builders Blueprint</p>
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
            <p className="mt-3 text-center text-[12px] text-muted-foreground/60">
              Satisfait ou remboursé 30 jours · zéro condition.
            </p>
            <p className="mt-3 text-center text-[12px] text-muted-foreground/60">
              Paiement sécurisé par Stripe · Accès immédiat · Aucun abonnement
            </p>
          </div>
        </div>
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

function HologramFigure({ uid, variant }: { uid: string; variant: HologramVariant }) {
  const cfg = {
    a: { hCy: 82, hRx: 41, hRy: 50, body: "M54,140 Q100,120 146,140 L153,220 H47 Z" },
    b: { hCy: 79, hRx: 39, hRy: 52, body: "M48,142 Q100,118 152,142 L160,220 H40 Z" },
    c: { hCy: 84, hRx: 43, hRy: 48, body: "M58,137 Q100,119 142,137 L149,220 H51 Z" },
    d: { hCy: 80, hRx: 46, hRy: 46, body: "M44,140 Q100,114 156,140 L166,220 H34 Z" },
  }[variant]
  const neckY = cfg.hCy + cfg.hRy - 2
  const glowId = `glow-${uid}`
  const isJarvis = variant === 'd'
  // Blanc pour les humains, violet pour Jarvis
  const lineColor = isJarvis ? "#a78bfa" : "rgba(255,255,255,0.85)"
  const eyeCenter = isJarvis ? "#c4b5fd" : "#ffffff"

  return (
    <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id={glowId} cx="50%" cy="42%" r="50%">
          <stop offset="0%" stopColor={lineColor} stopOpacity={isJarvis ? "0.35" : "0.22"}/>
          <stop offset="100%" stopColor={lineColor} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill="#08080a"/>
      <ellipse cx="100" cy="105" rx="90" ry="115" fill={`url(#${glowId})`}/>
      {/* scan lines */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1="0" y1={i * 20 + 8} x2="200" y2={i * 20 + 8} stroke={lineColor} strokeOpacity="0.04" strokeWidth="1"/>
      ))}
      {/* head */}
      <ellipse cx="100" cy={cfg.hCy} rx={cfg.hRx} ry={cfg.hRy} stroke={lineColor} strokeWidth="1" fill="#0c0c14" fillOpacity="0.97"/>
      {/* triangulation lines */}
      <line x1={100 - cfg.hRx + 2} y1={cfg.hCy} x2={100 + cfg.hRx - 2} y2={cfg.hCy} stroke={lineColor} strokeOpacity="0.18" strokeWidth="0.7"/>
      <line x1="100" y1={cfg.hCy - cfg.hRy + 4} x2={100 - cfg.hRx + 8} y2={cfg.hCy + cfg.hRy - 8} stroke={lineColor} strokeOpacity="0.14" strokeWidth="0.7"/>
      <line x1="100" y1={cfg.hCy - cfg.hRy + 4} x2={100 + cfg.hRx - 8} y2={cfg.hCy + cfg.hRy - 8} stroke={lineColor} strokeOpacity="0.14" strokeWidth="0.7"/>
      <line x1={100 - cfg.hRx + 8} y1={cfg.hCy - 18} x2={100 + cfg.hRx - 8} y2={cfg.hCy - 18} stroke={lineColor} strokeOpacity="0.12" strokeWidth="0.6"/>
      {/* eyes */}
      <ellipse cx={isJarvis ? 86 : 87} cy={cfg.hCy - 9} rx="7" ry={isJarvis ? 5 : 3.5} fill={lineColor} fillOpacity="0.55"/>
      <ellipse cx={isJarvis ? 114 : 113} cy={cfg.hCy - 9} rx="7" ry={isJarvis ? 5 : 3.5} fill={lineColor} fillOpacity="0.55"/>
      <circle cx={isJarvis ? 86 : 87} cy={cfg.hCy - 9} r="2.5" fill={eyeCenter}/>
      <circle cx={isJarvis ? 114 : 113} cy={cfg.hCy - 9} r="2.5" fill={eyeCenter}/>
      {/* jarvis extra: brow lines */}
      {isJarvis && <><line x1="80" y1={cfg.hCy - 17} x2="93" y2={cfg.hCy - 14} stroke={eyeCenter} strokeOpacity="0.6" strokeWidth="1.2"/><line x1="120" y1={cfg.hCy - 17} x2="107" y2={cfg.hCy - 14} stroke={eyeCenter} strokeOpacity="0.6" strokeWidth="1.2"/></>}
      {/* neck */}
      <rect x="88" y={neckY} width="24" height="16" fill="#0c0c14" stroke={lineColor} strokeWidth="0.8" strokeOpacity="0.35"/>
      {/* body */}
      <path d={cfg.body} fill="#0c0c14" fillOpacity="0.97" stroke={lineColor} strokeWidth="1"/>
      <line x1="100" y1={neckY + 16} x2="100" y2="218" stroke={lineColor} strokeOpacity="0.15" strokeWidth="0.6"/>
      <line x1="62" y1="168" x2="138" y2="168" stroke={lineColor} strokeOpacity="0.11" strokeWidth="0.6"/>
      <line x1="56" y1="190" x2="144" y2="190" stroke={lineColor} strokeOpacity="0.08" strokeWidth="0.6"/>
      {/* top glow */}
      <ellipse cx="100" cy={cfg.hCy - cfg.hRy + 8} rx="18" ry="6" fill={eyeCenter} fillOpacity={isJarvis ? "0.14" : "0.10"}/>
    </svg>
  )
}

const teamData: { uid: string; variant: HologramVariant; name: string; role: string; bio: string; isAI?: boolean }[] = [
  { uid: "alfred", variant: "a", name: "Alfred",  role: "CEO & Co-Founder",  bio: "Développement produit, vision et architecture du groupe." },
  { uid: "chris",  variant: "b", name: "Chris",   role: "CCO & Vibe Coder",  bio: "Marketing, acquisition et développement commercial." },
  { uid: "tim",    variant: "c", name: "Tim",     role: "CTO & Vibe Coder",  bio: "Implémentation IA et accompagnement des membres du Lab." },
  { uid: "jarvis", variant: "d", name: "Jarvis",  role: "Chief AI Officer",  bio: "Intelligence Artificielle Autonome. Pilote 40 agents IA chez Buildrs.", isAI: true },
]

function TeamSection() {
  return (
    <section className="py-24" style={{ background: "#0a0a0a" }}>
      <div className="mx-auto max-w-[1100px] px-6">

        {/* Header */}
        <div className="mb-14 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5" style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">Qui sommes-nous</span>
          </div>
          <h2
            style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.06 }}
            className="text-white"
          >
            Des experts IA qui construisent avec vous.
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {teamData.map(({ uid, variant, name, role, bio, isAI }) => (
            <div
              key={uid}
              className="rounded-2xl overflow-hidden"
              style={{ background: "#111113", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="h-52 flex items-center justify-center" style={{ background: isAI ? "rgba(139,92,246,0.07)" : "rgba(255,255,255,0.025)" }}>
                <TeamRobot isAI={isAI} />
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
        Ton premier produit IA est à 6 jours d'ici.
      </h2>
      <p className="mx-auto mb-9 max-w-[440px] text-[17px] leading-[1.65] text-muted-foreground">
        Pas dans 6 mois. Pas quand tu auras appris à coder. Pas quand tu auras trouvé le bon moment. En 6 jours.
      </p>
      <a href="#tarif" onClick={onCTA} className="cta-rainbow inline-flex items-center gap-2 rounded-[10px] bg-foreground px-8 py-4 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 no-underline">
        Commencer maintenant — 27€ (au lieu de 297€) →
      </a>
      <p className="mt-4 text-[12px] text-muted-foreground/60">
        Valeur réelle : 1 235€ · Paiement unique · Accès à vie
      </p>
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

const sprintDays = [
  {
    day: "01", label: "Phase 1", title: "Trouver",
    deliverable: "Ton idée validée, prête à construire.",
    items: [], accent: "#4d96ff",
  },
  {
    day: "02", label: "Phase 2", title: "Construire",
    deliverable: "Ton produit fonctionnel, designé, architecturé.",
    items: [], accent: "#cc5de8",
  },
  {
    day: "03", label: "Phase 3", title: "Déployer",
    deliverable: "En ligne, accessible au monde entier.",
    items: [], accent: "#22c55e",
  },
  {
    day: "04", label: "Phase 4", title: "Monétiser",
    deliverable: "Tes premiers revenus, ta stratégie de croissance.",
    items: [], accent: "#f97316",
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
          Un système en 7 étapes.<br />Un produit live à la fin.
        </h2>
        <p className="mb-14 max-w-[560px] text-[15px] md:text-[17px] leading-[1.65] text-muted-foreground">
          <span className="font-semibold text-foreground">Toi tu décides. L'IA construit. Tu encaisses.</span>
        </p>

        {/* Timeline horizontale — desktop */}
        <div className="hidden md:block">
          {/* Ligne de connexion */}
          <div className="relative mb-6">
            <div className="absolute top-4 left-[calc(100%/14)] right-[calc(100%/14)] h-px bg-border" />
            <div className="grid grid-cols-4 gap-0">
              {sprintDays.map(({ day, accent }) => (
                <div key={day} className="flex flex-col items-center">
                  <div
                    className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted"
                    style={{ boxShadow: `0 0 0 3px hsl(var(--muted))` }}
                  >
                    <span className="font-mono text-[10px] font-bold" style={{ color: accent }}>{day}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contenu sous chaque dot */}
          <div className="grid grid-cols-4 gap-3">
            {sprintDays.map(({ day, title, deliverable, accent }) => (
              <div key={day} className="flex flex-col gap-1.5 pt-1">
                <p className="text-[13px] font-bold text-foreground leading-tight">{title}</p>
                <p className="text-[11px] leading-[1.5] text-muted-foreground">{deliverable}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline compacte — mobile */}
        <div className="flex flex-col gap-0 md:hidden">
          {sprintDays.map(({ day, title, deliverable, accent }, i) => (
            <div key={day} className="flex gap-4">
              {/* Colonne gauche — dot + ligne */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-muted"
                >
                  <span className="font-mono text-[9px] font-bold" style={{ color: accent }}>{day}</span>
                </div>
                {i < sprintDays.length - 1 && (
                  <div className="w-px flex-1 bg-border mt-1 mb-1" style={{ minHeight: 24 }} />
                )}
              </div>
              {/* Contenu */}
              <div className="pb-5 pt-0.5">
                <p className="text-[14px] font-bold text-foreground">{title}</p>
                <p className="text-[12px] leading-[1.5] text-muted-foreground mt-0.5">{deliverable}</p>
              </div>
            </div>
          ))}
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
        <TeamSection />
        <FAQ />
        <FinalCTA onCTA={go} />
      </main>
      <StackedCircularFooter />
    </>
  )
}
