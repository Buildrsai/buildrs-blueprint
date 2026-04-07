import { useState, useEffect } from "react"
import { Clock, Banknote, Layers, Bot, Zap, Check, Flame, Globe, TrendingUp, Copy, ArrowLeftRight, BookOpen, Lightbulb, CheckSquare, Wrench, FolderOpen } from "lucide-react"
import { StackedCircularFooter } from "./ui/stacked-circular-footer"
import { BuildrsIcon, BrandIcons, ClaudeIcon, WhatsAppIcon } from "./ui/icons"

import { DashboardPreview } from "./ui/dashboard-preview"
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
  { num: "6 jours", desc: "De l'idée au produit live avec Claude", sub: "" },
  { num: "3 000€/mois", desc: "Objectif de revenus récurrents", sub: "sous 60 jours" },
  { num: "+110", desc: "Micro-SaaS IA lancés avec Buildrs", sub: "" },
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

const features: { text: string; value: string }[] = [
  { text: "Le système en 7 étapes — de l'idée au Micro-SaaS IA monétisé", value: "valeur 497€" },
  { text: "3 stratégies de départ : copier une fonctionnalité d'un Micro-SaaS IA existant, résoudre un problème que tu as identifié, ou explorer les opportunités", value: "valeur 97€" },
  { text: "Le Générateur d'Idées — trouve des Micro-SaaS IA rentables prêts à lancer avec fiches produit prêtes (niche, cible, fonctionnalité, MRR potentiel)", value: "valeur 197€" },
  { text: "Le Validateur — score ton idée de Micro-SaaS IA avant de la builder. Rentabilité, concurrence, faisabilité — tu sais si ça vaut le coup avant de démarrer", value: "valeur 147€" },
  { text: "50+ prompts testés à copier-coller — les instructions exactes à donner à Claude", value: "valeur 147€" },
  { text: "3 modèles de monétisation avec guide : revenus récurrents, revente du Micro-SaaS IA, ou prestation client", value: "valeur 97€" },
  { text: "Checklist de progression — tu ne seras jamais perdu, tu sais exactement quoi faire ensuite", value: "valeur 47€" },
  { text: "Le Dashboard Buildrs — ton espace projet, tes outils et ta progression au même endroit", value: "valeur 197€" },
  { text: "Accès à la communauté Buildrs — pose tes questions, avance avec les autres builders, partage tes victoires", value: "valeur 97€" },
  { text: "Accès à vie + toutes les mises à jour futures", value: "valeur 57€" },
]

const bonuses: { text: string; value: string }[] = [
  { text: "Jarvis IA — ton copilote intelligent qui te guide à chaque étape en temps réel", value: "valeur 97€" },
  { text: "Toolbox Pro — les meilleurs outils IA du marché pour créer ton Micro-SaaS IA, testés, avec les prompts et configs prêts à l'emploi", value: "valeur 47€" },
  { text: "WhatsApp Buildrs — accès privé à Alfred & Jarvis via le canal WhatsApp Buildrs", value: "valeur 47€" },
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

// ─── TYPING IDEA BAR ──────────────────────────────────────────────────────────

const TYPING_IDEAS = [
  "Un coach nutrition IA à 9,99€/mois",
  "Un tracker de loyers pour propriétaires Airbnb",
  "Un générateur de contrats freelance en 30 sec",
  "Une app qui résume tes réunions Zoom auto",
  "Un CRM vocal pour commerciaux terrain",
  "Un outil de pricing dynamique pour e-commerce",
  "Un assistant juridique IA pour auto-entrepreneurs",
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
        timer = setTimeout(() => setText(full.slice(0, text.length + 1)), 60)
      } else {
        timer = setTimeout(() => setPhase('deleting'), 2000)
      }
    } else if (phase === 'deleting') {
      if (text.length > 0) {
        timer = setTimeout(() => setText(text.slice(0, -1)), 30)
      } else {
        setIdx(i => (i + 1) % TYPING_IDEAS.length)
        setPhase('typing')
      }
    }

    return () => clearTimeout(timer)
  }, [text, phase, idx])

  return (
    <div
      className="mb-8 flex items-center gap-2.5 rounded-full px-5 py-3 w-full max-w-[360px] justify-center"
      style={{
        background: '#09090b',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 8px 24px rgba(0,0,0,0.25)',
      }}
    >
      <span className="text-[14px] whitespace-nowrap font-medium shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Ton idée :
      </span>
      <span className="text-[14px] font-semibold text-white min-w-0 flex-1 truncate">{text}</span>
      <span
        className="text-white font-light text-[16px] leading-none shrink-0"
        style={{ animation: 'cursor-blink 0.9s step-end infinite' }}
      >|</span>
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

function Hero({ onCTA }: { onCTA?: (e: React.MouseEvent) => void }) {
  return (
    <section className="relative overflow-hidden px-6 sm:px-10 pb-20 pt-[120px] sm:pt-[140px]">
      <DottedSurface className="absolute inset-0 w-full h-full" />
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-[600px]"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(170,170,255,0.10) 0%, transparent 65%)" }}
      />

      <div className="relative mx-auto max-w-[700px] flex flex-col items-center text-center">

        {/* Text */}
        <div className="flex flex-col items-center text-center">

          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-[12px] sm:text-[13px] text-muted-foreground">
            <Zap size={13} strokeWidth={1.5} className="shrink-0 text-foreground" />
            <span>Rejoins les 110+ builders qui ont déjà lancé</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted-foreground/50"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>

          {/* H1 */}
          <h1
            className="mb-7 text-foreground mx-auto max-w-[900px]"
            style={{ fontSize: "clamp(38px, 4.5vw, 62px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.06 }}
          >
            Ton premier Micro-SaaS IA rentable. En 6 jours.
          </h1>

          {/* Sub */}
          <p className="mb-6 max-w-[500px] text-[16px] leading-[1.65] text-muted-foreground">
            De l'idée au premier client payant — piloté par Claude Code, étape par étape. Génère tes premiers revenus en automatique.{" "}
            <strong className="font-semibold text-foreground">Sans toucher une seule ligne de code.</strong>
          </p>

          {/* Typing idea */}
          <TypingIdea />

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <a href="#tarif" onClick={onCTA} className="cta-rainbow flex items-center gap-2 rounded-[10px] bg-foreground px-7 py-3.5 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 no-underline">
              Je lance mon Micro-SaaS IA — 27€ →
            </a>
          </div>

          {/* Social proof note */}
          <p className="mb-4 text-center text-[12px] text-muted-foreground/60">
            Valeur réelle : 1 235€ · Paiement unique · Accès à vie
          </p>

          {/* Progress bar */}
          <div className="mb-6 w-full max-w-[420px]">
            <div className="flex items-center justify-between mb-1.5 text-[11px] text-muted-foreground/60">
              <span>110/200 places réclamées</span>
              <span>54% restant</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
              <div className="h-full rounded-full bg-foreground/70" style={{ width: "55%" }} />
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {["Sans expertise en IA", "Débutant ou confirmé"].map((label) => (
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
          style={{ width: "max-content", animation: "marquee-scroll 32s linear infinite" }}
        >
          <div className="flex items-center gap-8 shrink-0">
            {tools.map(({ label, Icon }) => (
              <Icon key={label} aria-label={label} className="h-7 w-7 shrink-0 text-foreground/30 hover:text-foreground/60 transition-colors" />
            ))}
          </div>
          <div className="flex items-center gap-8 shrink-0">
            {tools.map(({ label, Icon }) => (
              <Icon key={label + '-2'} aria-label={label} className="h-7 w-7 shrink-0 text-foreground/30 hover:text-foreground/60 transition-colors" />
            ))}
          </div>
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


function WhySaaS() {
  const inner = [
    { Icon: BrandIcons.supabase, delay: '0s' },
    { Icon: BrandIcons.vercel,   delay: '-4s' },
    { Icon: BrandIcons.github,   delay: '-8s' },
  ]
  const outer = [
    { Icon: BrandIcons.stripe,      delay: '0s' },
    { Icon: BrandIcons.resend,      delay: '-7s' },
    { Icon: BrandIcons.cloudflare,  delay: '-14s' },
  ]

  return (
    <section id="resultats" className="relative py-24 bg-background overflow-hidden">
      <BGPattern variant="dots" mask="fade-edges" size={28} fill="rgba(255,255,255,0.07)" />
      <div className="mx-auto max-w-[1100px] px-6">
        {/* Header centré */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
            Pourquoi maintenant
          </p>
          <h2
            style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1 }}
            className="mb-5 text-foreground mx-auto max-w-[860px]"
          >
            Le SaaS classique est mort. Bienvenue dans l'ère du Micro-SaaS IA.
          </h2>
          <p className="mx-auto max-w-[620px] text-[17px] leading-[1.65] text-muted-foreground">
            Un Micro-SaaS IA, c'est un outil propulsé par l'IA, focalisé sur un problème précis dans une niche étroite. Pas un CRM générique — un générateur de contrats pour avocats solo. Pas une plateforme massive — une app de pricing pour e-commerçants Shopify. Tu le lances seul, avec Claude comme moteur, en quelques jours. Et il génère des revenus récurrents en autopilote.
          </p>
        </div>

        {/* Orbital animation */}
        <div className="relative mx-auto my-8 mb-14 flex items-center justify-center" style={{ width: 'min(88vw, 480px)', height: 'min(88vw, 480px)' }}>
          {/* Rings */}
          <div className="absolute rounded-full border border-dashed" style={{ width: 'min(50vw, 230px)', height: 'min(50vw, 230px)', borderColor: 'hsl(var(--border))' }} />
          <div className="absolute rounded-full border border-dashed" style={{ width: 'min(80vw, 340px)', height: 'min(80vw, 340px)', borderColor: 'hsl(var(--border) / 0.4)' }} />

          {/* Center — Claude */}
          <div
            className="absolute z-10 flex items-center justify-center rounded-2xl border border-border bg-card"
            style={{ width: 72, height: 72, boxShadow: '0 0 32px rgba(204,93,232,0.25)' }}
          >
            <ClaudeIcon size={36} />
          </div>

          {/* Inner orbit */}
          {inner.map(({ Icon, delay }, i) => (
            <div key={i} className="absolute" style={{ animation: `orbit-inner-lg 12s linear ${delay} infinite` }}>
              <div className="flex items-center justify-center rounded-xl border border-border bg-card shadow-sm" style={{ width: 44, height: 44 }}>
                <Icon width={22} height={22} />
              </div>
            </div>
          ))}

          {/* Outer orbit */}
          {outer.map(({ Icon, delay }, i) => (
            <div key={i} className="absolute" style={{ animation: `orbit-outer-lg 20s linear ${delay} infinite` }}>
              <div className="flex items-center justify-center rounded-xl border border-border bg-card shadow-sm" style={{ width: 44, height: 44 }}>
                <Icon width={22} height={22} />
              </div>
            </div>
          ))}
        </div>

        {/* Stats en bas */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { num: "0 ligne de code", label: "Tu décris, l'IA construit", sub: "" },
            { num: "100% solo", label: "Aucune équipe nécessaire", sub: "" },
            { num: "27€", label: "pour tout démarrer", sub: "Paiement unique, accès à vie" },
          ].map(({ num, label, sub }) => (
            <div key={num} className="rounded-xl border border-border bg-muted p-4 text-center">
              <p className="text-[22px] font-bold tracking-tight text-foreground" style={{ letterSpacing: "-0.03em" }}>{num}</p>
              <p className="mt-0.5 text-[13px] text-muted-foreground">{label}</p>
              {sub && <p className="text-[11px] text-muted-foreground/50 mt-0.5">{sub}</p>}
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
    stat: "Micro-SaaS 1 → Micro-SaaS 2 → Micro-SaaS 3",
    description: "Micro-SaaS 1 → Micro-SaaS 2 → Micro-SaaS 3. Claude duplique la méthode. Chaque produit tourne en autopilote pendant que tu construis le suivant.",
    icon: <Copy strokeWidth={1.5} size={20} />,
  },
  {
    id: "exit",
    title: "Revendre ou conserver",
    stat: "1 000€/mois → 20 000 à 40 000€",
    description: "Tu gardes et développes ton Micro-SaaS, ou tu le revends. Un Micro-SaaS IA à 1 000€/mois de MRR se revend entre 20x et 40x. C'est toi qui choisis.",
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
            Pourquoi le Micro-SaaS IA est le meilleur business model en 2026.
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
  "Tu crées des Micro-SaaS IA qui résolvent un vrai problème et génèrent des revenus",
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
            Le produit
          </p>
          <h2
            style={{ fontSize: 'clamp(34px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.06 }}
            className="mb-4 text-foreground"
          >
            Pas un PDF. Pas une vidéo.<br />Un vrai copilote IA.
          </h2>
          <p className="mx-auto max-w-[500px] text-[17px] leading-[1.65] text-muted-foreground">
            Propulsé par Claude — l'IA la plus avancée pour builder des produits.
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

function UniqueTestimonialSection() {
  return (
    <section className="py-24 bg-muted">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mb-14 text-center">
          <div className="mb-3 inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-[11px] font-semibold text-foreground">
            Exemples
          </div>
          <h2
            style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }}
            className="text-foreground"
          >
            De l'idée au produit live.
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[17px] leading-[1.65] text-muted-foreground">
            Des exemples concrets de SaaS réalisables avec Blueprint — en moins d'une semaine.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
          {SAAS_BUILT.map((item) => (
            <SaasBuiltCard key={item.productName} item={item} />
          ))}
        </div>
      </div>
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
          Tout ce qu'il te faut pour lancer<br />ton Micro-SaaS IA.
        </h2>
        <p className="mx-auto max-w-[480px] text-[17px] leading-[1.65] text-muted-foreground">
          Un seul paiement. Accès à vie. Si tu ne le fais pas maintenant, tu ne le feras jamais.
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
            <ul className="mb-4 flex flex-col gap-[10px] text-[14px]">
              {features.map((f) => {
                const dashIdx = f.text.indexOf(' — ')
                const colonIdx = f.text.indexOf(' : ')

                let content: React.ReactNode

                if (dashIdx !== -1) {
                  const title = f.text.slice(0, dashIdx)
                  const desc = f.text.slice(dashIdx + 3)
                  content = <span className="text-muted-foreground"><span className="font-bold text-foreground">{title}</span> — {desc}</span>
                } else if (colonIdx !== -1) {
                  const title = f.text.slice(0, colonIdx)
                  const rest = f.text.slice(colonIdx + 3)
                  content = <span className="text-muted-foreground"><span className="font-bold text-foreground">{title}</span> : {rest}</span>
                } else {
                  content = <span className="font-bold text-foreground">{f.text}</span>
                }

                return (
                  <li key={f.text} className="flex items-start gap-2.5">
                    <Check size={15} strokeWidth={2} className="mt-[1px] shrink-0 text-foreground" />
                    <div className="flex-1 min-w-0">
                      {content}
                      <span className="mt-1 block text-[11px] text-muted-foreground/40">({f.value})</span>
                    </div>
                  </li>
                )
              })}
            </ul>

            {/* Total */}
            <div className="mb-6 border-t border-border pt-4 text-right">
              <div className="text-[12px] text-muted-foreground/50 line-through">Valeur totale : 1 583€</div>
              <div className="text-[13px] font-bold text-foreground">Ton prix aujourd'hui : 27€</div>
            </div>

            {/* Bonuses */}
            <div className="mb-7 rounded-xl border border-dashed border-border bg-muted px-4 py-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">Bonus inclus pour les 200 premiers</p>
              <ul className="flex flex-col gap-[10px]">
                {bonuses.map((b) => {
                  const dashIdx = b.text.indexOf(' — ')
                  const isJarvis = b.text.startsWith('Jarvis IA')
                  const isValidator = b.text.startsWith('Agent Validator')
                  const isToolbox = b.text.startsWith('Toolbox Pro')
                  const isWhatsApp = b.text.startsWith('WhatsApp')
                  const name = dashIdx !== -1 ? b.text.slice(0, dashIdx) : b.text
                  const desc = dashIdx !== -1 ? b.text.slice(dashIdx + 3) : null

                  const iconEl = isJarvis
                    ? <RobotJarvis size={20} />
                    : isValidator
                    ? <RobotValidator size={20} />
                    : isToolbox
                    ? <ClaudeIcon size={16} className="mt-[1px] shrink-0 text-foreground" />
                    : isWhatsApp
                    ? <WhatsAppIcon size={16} className="mt-[1px] shrink-0 text-foreground" />
                    : <Zap size={14} strokeWidth={1.5} className="mt-[2px] shrink-0 text-foreground" />

                  return (
                    <li key={b.text} className="flex items-start gap-2.5 text-[14px]">
                      <span className="shrink-0 mt-[1px]">{iconEl}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-muted-foreground">
                          {isJarvis ? (
                            <span
                              className="font-bold"
                              style={{ background: 'linear-gradient(90deg, #cc5de8, #4d96ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                            >Jarvis IA</span>
                          ) : isValidator ? (
                            <span
                              className="font-bold"
                              style={{ background: 'linear-gradient(90deg, #22c55e, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                            >Agent Validator</span>
                          ) : (
                            <span className="font-bold text-foreground">{name}</span>
                          )}
                          {desc && <> — {desc}</>}
                        </span>
                        <span className="mt-1 block text-[11px] text-muted-foreground/40">({b.value})</span>
                      </div>
                    </li>
                  )
                })}
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
            <p className="mt-3 text-center text-[12px] text-muted-foreground/60">
              Satisfait ou remboursé 30 jours · zéro condition.
            </p>
            <div className="mt-4 w-full">
              <div className="flex items-center justify-between mb-1.5 text-[11px] text-muted-foreground/60">
                <span>110/200 places réclamées</span>
                <span>Ensuite 297€</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                <div className="h-full rounded-full bg-foreground/70" style={{ width: "55%" }} />
              </div>
            </div>
            <p className="mt-3.5 text-center text-[12px] text-muted-foreground/60">
              Paiement sécurisé par Stripe · Accès immédiat · Aucun abonnement
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
        Ton premier Micro-SaaS IA<br />est à 6 jours d'ici.<br />Claude est prêt. Et toi ?
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
    day: "01", label: "Module 1", title: "Fondations",
    deliverable: "Ta stratégie de lancement définie",
    items: [
      "Tu comprends pourquoi l'IA fait 90% du travail à ta place",
      "Tu choisis ton format : app, SaaS ou logiciel",
      "Tu poses ton objectif financier — le système s'adapte",
    ],
    accent: "#4d96ff",
  },
  {
    day: "02", label: "Module 2", title: "Ton espace de travail",
    deliverable: "Un environnement configuré, prêt à builder",
    items: [
      "Tu installes les outils essentiels — Claude, VS Code, les bases",
      "Tu connectes ton premier projet à Claude Code",
      "Tu es prêt à builder — l'environnement fonctionne",
    ],
    accent: "#6bcb77",
  },
  {
    day: "03", label: "Module 3", title: "Trouver & Valider",
    deliverable: "Ton idée validée et ta fiche produit prête",
    items: [
      "Tu génères 5 idées de Micro-SaaS IA rentables en 1 clic",
      "Tu valides ton marché en 30 minutes — tu décides",
      "Tu repars avec ta fiche produit : nom, cible, prix",
    ],
    accent: "#cc5de8",
  },
  {
    day: "04", label: "Module 4", title: "Design & Architecture",
    deliverable: "Le design et l'architecture prêts à construire",
    items: [
      "Tu crées ton identité visuelle en t'inspirant des meilleures apps",
      "Tu génères ton parcours utilisateur page par page",
      "Tu obtiens la structure technique — prête à builder",
    ],
    accent: "#eab308",
  },
  {
    day: "05", label: "Module 5", title: "Construire",
    deliverable: "Un produit fonctionnel qui tourne",
    items: [
      "Tu décris ce que tu veux — Claude génère ton produit",
      "Ta fonctionnalité principale est live et fonctionnelle",
      "L'inscription et l'onboarding sont en place",
    ],
    accent: "#ff6b6b",
  },
  {
    day: "06", label: "Module 6", title: "Déployer",
    deliverable: "Ton produit en ligne, accessible au monde entier",
    items: [
      "Ton produit est mis en ligne en 1 clic avec Vercel",
      "Ton domaine personnalisé est connecté",
      "Paiements et emails automatiques sont branchés",
    ],
    accent: "#22c55e",
  },
  {
    day: "07", label: "Module 7", title: "Monétiser & Lancer",
    deliverable: "Tes premiers revenus, ta communication lancée",
    items: [
      "Tu valides ta stratégie de prix : abonnement, unique, freemium",
      "Ta page de vente est créée par Claude — tu publies",
      "Ta première campagne est configurée — le trafic arrive",
    ],
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
          Un système en 7 étapes.<br />Un produit live à la fin.
        </h2>
        <p className="mb-12 md:mb-20 max-w-[560px] text-[15px] md:text-[17px] leading-[1.65] text-muted-foreground">
          Pas un cours. Un système étape par étape. Tu suis, Claude construit. À la fin, ton Micro-SaaS IA est live et génère du MRR.
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
                        Étape {day}
                      </span>
                    </div>
                    <h3 className="mb-3 text-[18px] md:text-[20px] font-bold tracking-tight text-foreground">{title}</h3>
                    <div
                      className="mb-4 rounded-lg px-3.5 py-2.5 text-[12px] font-semibold"
                      style={{ background: `${accent}18`, color: accent }}
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
