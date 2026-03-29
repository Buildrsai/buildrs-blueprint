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
  "Accès au Dashboard interactif Buildrs",
  "Autopilot IA — ton copilote pour piloter tes projets SaaS en direct",
  "7 modules de l'idée au lancement : process clairs, quiz et actions concrètes étape par étape",
  "Checklist interactive — tu sais toujours exactement où tu en es",
  "Les instructions exactes à donner à Claude à chaque étape du build",
  "Pack de prompts prêts à copier-coller pour chaque situation",
  "Le stack complet d'outils avec guides de configuration pas à pas",
  "3 stratégies de départ (copier, résoudre, découvrir)",
  "3 modèles de monétisation (revenus récurrents, revente, commande client)",
  "Accès à vie + mises à jour",
]

const bonuses = [
  "Générateur d'idées de SaaS — explore des centaines d'opportunités rentables en quelques clics",
  "Validateur de marché — analyse ta niche et tes concurrents avant d'écrire la première ligne",
  "Calculateur MRR & revenus — projette ta rentabilité avant de lancer",
  "Accès au WhatsApp privé de Buildrs",
  "Boîte à outils IA — les meilleurs outils pour créer des revenus en ligne avec guide de config inclus",
  "Templates prêts à l'emploi — landing page, fiche produit, séquence emails d'activation",
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
      className="mb-8 inline-flex items-center gap-2.5 rounded-full px-5 py-3"
      style={{
        background: '#09090b',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 8px 24px rgba(0,0,0,0.25)',
      }}
    >
      <span className="text-[14px] whitespace-nowrap font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Ton idée :
      </span>
      <span className="text-[14px] font-semibold text-white min-w-0 max-w-[280px] truncate">{text}</span>
      <span
        className="text-white font-light text-[16px] leading-none"
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
                <span className="text-[7.5px] font-extrabold text-white">97%</span>
              </div>
              <div className="h-[2px] rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full bg-white" style={{ width: '97%' }} />
              </div>
            </div>
            <div className="px-2 pt-2.5 flex-1 overflow-hidden">
              <p className="text-[6px] font-bold uppercase tracking-[0.08em] px-1 mb-1" style={{ color: 'rgba(255,255,255,0.22)' }}>Construire</p>
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md mb-0.5" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <Zap size={8} strokeWidth={1.5} className="text-white flex-shrink-0" />
                <span className="text-[7.5px] font-semibold text-white flex-1 truncate">Autopilot IA</span>
                <span className="text-[5.5px] font-bold px-1 py-0.5 rounded flex-shrink-0" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>ACTIF</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md mb-0.5">
                <BookOpen size={8} strokeWidth={1.5} className="flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }} />
                <span className="text-[7.5px] font-medium flex-1 truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>Mon Parcours</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md mb-2">
                <Lightbulb size={8} strokeWidth={1.5} className="flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }} />
                <span className="text-[7.5px] font-medium flex-1 truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>Mes Idées</span>
              </div>
              <p className="text-[6px] font-bold uppercase tracking-[0.08em] px-1 mb-1" style={{ color: 'rgba(255,255,255,0.22)' }}>Outils IA</p>
              {["Idées de SaaS", "Validateur d'idée", "Calc. MRR & Revente"].map(l => (
                <div key={l} className="flex items-center gap-1.5 px-2 py-1 rounded-md mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ border: '1px solid rgba(255,255,255,0.2)' }} />
                  <span className="text-[7px] truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>{l}</span>
                </div>
              ))}
              <p className="text-[6px] font-bold uppercase tracking-[0.08em] px-1 mb-1 mt-1.5" style={{ color: 'rgba(255,255,255,0.22)' }}>Ressources</p>
              {["Mes Projets", "Bibliothèque", "Checklist", "Boîte à outils"].map(l => (
                <div key={l} className="flex items-center gap-1.5 px-2 py-1 rounded-md mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ border: '1px solid rgba(255,255,255,0.2)' }} />
                  <span className="text-[7px] truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>{l}</span>
                </div>
              ))}
            </div>
            <div className="p-2">
              <div className="rounded-lg p-2" style={{ border: '1px solid rgba(234,179,8,0.25)', background: 'rgba(234,179,8,0.05)' }}>
                <p className="text-[5.5px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'rgba(234,179,8,0.6)' }}>Envie d'aller + vite ?</p>
                <p className="text-[7.5px] font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>Accélérer mon projet →</p>
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

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Modules', value: '4/6',   sub: '+1 cette semaine' },
                { label: 'Tâches',  value: '24',    sub: '8 restantes'      },
                { label: 'Score',   value: '72%',   sub: 'Progression'      },
              ].map(({ label, value, sub }) => (
                <div key={label} className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-[6px] uppercase tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</p>
                  <p className="text-[13px] font-extrabold text-white leading-none" style={{ letterSpacing: '-0.03em' }}>{value}</p>
                  <p className="text-[6px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>{sub}</p>
                </div>
              ))}
            </div>

            {/* Module list */}
            <div>
              <p className="text-[6.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.28)' }}>Étapes récentes</p>
              <div className="flex flex-col gap-1">
                {[
                  { label: 'Trouver & Valider',     sub: 'Idée validée · Score 72/100',     badge: 'Fait',     green: false, done: true  },
                  { label: 'Préparer & Designer',   sub: 'Branding · UI · Stack configuré', badge: 'Fait',     green: false, done: true  },
                  { label: 'L\'Architecture',       sub: 'Supabase · Auth · Sécurité',      badge: 'Fait',     green: false, done: true  },
                  { label: 'Construire',            sub: 'Feature core · Pages essentielles',badge: 'En cours', green: true,  done: false },
                  { label: 'Déployer & Monétiser',  sub: 'Vercel · Stripe · Emails',        badge: 'À faire',  green: false, done: false },
                ].map(({ label, sub, badge, green, done }) => (
                  <div key={label} className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: green ? 'rgba(255,255,255,0.04)' : 'transparent', border: green ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent' }}>
                    <div className="w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: done ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.05)', border: done ? 'none' : '1px solid rgba(255,255,255,0.12)' }}>
                      {done && <Check size={6} strokeWidth={3.5} className="text-[#09090b]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] font-semibold truncate" style={{ color: done ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.9)', textDecoration: done ? 'line-through' : 'none' }}>{label}</p>
                      <p className="text-[6.5px] truncate" style={{ color: 'rgba(255,255,255,0.22)' }}>{sub}</p>
                    </div>
                    <span className="text-[6px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: green ? 'rgba(234,179,8,0.15)' : done ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.04)', color: green ? '#eab308' : done ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)', border: `1px solid ${green ? 'rgba(234,179,8,0.25)' : 'rgba(255,255,255,0.08)'}` }}>{badge}</span>
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
      <DottedSurface className="absolute inset-0 w-full h-full opacity-40" />
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-[600px]"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(170,170,255,0.10) 0%, transparent 65%)" }}
      />

      <div className="relative mx-auto max-w-[1150px] flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-14">

        {/* Left — text */}
        <div className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left">

          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-[12px] sm:text-[13px] text-muted-foreground">
            <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-muted">
              <BrandIcons.supabase className="h-3 w-3 text-foreground" />
            </span>
            <span>Transforme l'IA en vrai levier business</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted-foreground/50"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>

          {/* H1 */}
          <h1
            className="mb-7 text-foreground"
            style={{ fontSize: "clamp(42px, 6vw, 80px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.03 }}
          >
            Crée ton{" "}
            <WordRotate
              words={["saas", "app"]}
              duration={2200}
              className="text-foreground"
              style={{ fontSize: "clamp(42px, 6vw, 80px)", fontWeight: 800, letterSpacing: "-0.04em" }}
            />
            <br />avec l'IA. En 6 jours.
          </h1>

          {/* Sub */}
          <p className="mb-6 max-w-[500px] text-[16px] leading-[1.65] text-muted-foreground">
            Le système guidé pour créer et monétiser ton premier produit digital grâce à l'IA et générer tes premiers revenus en autopilote —{" "}
            <strong className="font-semibold text-foreground">même si tu n'as jamais ouvert un éditeur de code de ta vie.</strong>
          </p>

          {/* Typing idea */}
          <TypingIdea />

          {/* Badges */}
          <div className="mb-10 flex flex-wrap items-center justify-center lg:justify-start gap-2">
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
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <a href="#tarif" onClick={onCTA} className="cta-rainbow flex items-center gap-2 rounded-[10px] bg-foreground px-7 py-3.5 text-[15px] font-semibold text-background transition-opacity hover:opacity-85 no-underline">
              Accéder au Blueprint — 27€ →
            </a>
          </div>

          {/* Countdown */}
          <p className="mt-5 flex items-center justify-center lg:justify-start gap-1.5 text-[13px] text-muted-foreground/60">
            <Flame size={13} strokeWidth={1.5} className="text-foreground/50" />
            <ScarcityCountdown />
            {" · Ensuite 297€"}
          </p>
        </div>

        {/* Right — dashboard mockup */}
        <div className="w-full lg:w-[510px] flex-shrink-0">
          <HeroDashboardMockup />
        </div>

      </div>
    </section>
  )
}

// ─── MARQUEE ──────────────────────────────────────────────────────────────────

function Marquee() {
  const doubled = [...tools, ...tools]
  return (
    <section className="overflow-hidden border-y border-border bg-background py-10">
      <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.11em] text-muted-foreground/60 px-6 sm:px-0">
        Nous construisons avec les meilleurs outils du marché — pas besoin de choisir
      </p>
      <div className="overflow-hidden">
        <div
          className="flex items-center gap-8"
          style={{ width: "max-content", animation: "marquee-scroll 32s linear infinite" }}
        >
          {doubled.map(({ label, Icon }, i) => (
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

// ─── STATS ────────────────────────────────────────────────────────────────────

function Stats() {
  return (
    <section className="mx-auto max-w-[1100px] px-6 py-20">
      <div
        className="mt-0 grid grid-cols-1 sm:grid-cols-3 overflow-hidden rounded-2xl border border-border"
        style={{ background: "hsl(var(--border))", gap: "1px" }}
      >
        {stats.map(({ num, desc }) => (
          <div key={num} className="bg-background px-6 py-10 text-center">
            <div
              className="mb-2 leading-none text-foreground whitespace-nowrap"
              style={{ fontSize: "clamp(24px, 3.2vw, 40px)", fontWeight: 800, letterSpacing: "-0.04em" }}
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
            Tu n'as pas besoin<br />de coder. Tu as besoin<br />d'avoir des idées.
          </h2>
          <p className="mx-auto max-w-[540px] text-[17px] leading-[1.65] text-muted-foreground">
            Le code, c'est le problème de l'IA. Ton job : avoir la vision, donner la direction. Tu décris ce que tu veux — l'IA et Claude construisent. Bienvenue en 2026.
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
    desc: 'Ton espace projet intelligent. Progression, fiche produit, outils configurés et revenus estimés — tout centralisé.',
  },
  {
    Icon: BookOpen,
    title: 'Mon Parcours',
    desc: '7 modules et +30 leçons interactives. Un plan structuré de l\'idée aux premiers revenus, à suivre à ton rythme.',
  },
  {
    Icon: Lightbulb,
    title: 'Générateurs IA',
    desc: '3 outils IA intégrés : générateur d\'idées, validateur de concept avec score, calculateur de revenus.',
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
            Tu accèdes à un dashboard complet : ton espace projet, tes modules interactifs, tes générateurs IA, ta bibliothèque d'instructions, ta checklist et tes outils — tout en un.
          </p>
        </div>

        <DashboardPreview />
      </div>
    </section>
  )
}

// ─── BUILT WITH US ────────────────────────────────────────────────────────────

interface SaasBuiltItem {
  productName: string
  handle: string
  founderName: string
  founderAvatar: string
  quote: string
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
    handle: "@thomas_brd",
    founderName: "Thomas B.",
    founderAvatar: "/Mec1.webp",
    quote: "PriceFlow est un outil que je vends aux e-commerçants — il ajuste leurs prix en temps réel selon la concurrence et les stocks. Mes clients gagnaient des heures chaque semaine sur une tâche qu'ils faisaient à la main. J'ai sorti la v1 en 5 jours avec Blueprint.",
    thumbnail: "/DASH1.webp",
  },
  {
    productName: "Brew App",
    handle: "@julie_brew",
    founderName: "Julie D.",
    founderAvatar: "/F3.webp",
    quote: "Brew App c'est un carnet de dégustation pour amateurs de café — noter les origines, les profils, les méthodes d'extraction. Je cherchais cet outil depuis longtemps sans le trouver. Blueprint m'a donné le cadre pour passer de l'idée au produit live.",
    thumbnail: "/D3.webp",
  },
  {
    productName: "StayTrack",
    handle: "@marina_host",
    founderName: "Pierre L.",
    founderAvatar: "/F2.webp",
    quote: "StayTrack centralise la gestion de mes locations — loyers, charges, taux d'occupation, alertes. Avec 8 biens, les tablettes Excel ça ne tenait plus. Je l'ai construit en une semaine via Blueprint, sans avoir à embaucher un dev.",
    thumbnail: "/Dash2.webp",
  },
]

function SaasBuiltCard({ item }: { item: SaasBuiltItem }) {
  return (
    <div className="break-inside-avoid mb-4 rounded-3xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      {(item.preview || item.thumbnail) && (
        <div
          className="mb-4 overflow-hidden rounded-xl border border-border"
          style={{ aspectRatio: "16/9" }}
        >
          {item.preview
            ? item.preview
            : (
              <img
                src={item.thumbnail}
                alt={item.productName}
                className="h-full w-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
              />
            )
          }
        </div>
      )}

      <div className="mb-3 inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-foreground">
        {item.productName}
      </div>

      <p className="mb-4 text-[15px] leading-relaxed text-muted-foreground">
        "{item.quote}"
      </p>

      <hr className="mb-4 border-border" />

      <div className="flex items-center gap-3">
        <img
          src={item.founderAvatar}
          alt={item.handle}
          className="h-9 w-9 shrink-0 rounded-full object-cover"
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement
            el.style.display = "none"
          }}
        />
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-foreground">Founder</p>
          <p className="text-[12px] text-muted-foreground">@{item.productName.toLowerCase().replace(/\s/g, '')}</p>
        </div>
        <div className="ml-auto flex shrink-0 gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-foreground">
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
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
            Built with us
          </p>
          <h2
            style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.06 }}
            className="text-foreground"
          >
            De l'idée au produit live.
          </h2>
          <p className="mx-auto mt-4 max-w-[480px] text-[17px] leading-[1.65] text-muted-foreground">
            Voilà ce que nos membres ont construit avec Blueprint — en moins d'une semaine.
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
    day: "01", label: "Jour 1", title: "Fondations",
    deliverable: "Ta stratégie de lancement définie",
    items: ["Comprendre le vibecoding et pourquoi ça change tout", "Choisir entre créer une app, un SaaS ou un logiciel", "Définir ta stratégie (copier, résoudre, découvrir)", "Fixer ton objectif financier (revenus récurrents, revente, commande)"],
    accent: "#4d96ff",
  },
  {
    day: "02", label: "Jour 2", title: "Ton espace de travail",
    deliverable: "Un environnement complet, configuré, prêt à builder",
    items: ["Installer et configurer tous tes outils en suivant le guide pas à pas", "Préparer ton environnement pour construire vite", "Tout est prêt — tu ne touches plus jamais à la config"],
    accent: "#6bcb77",
  },
  {
    day: "03", label: "Jour 3", title: "Trouver & Valider",
    deliverable: "Ton idée validée et ta fiche produit prête à exécuter",
    items: ["Repérer les SaaS et apps qui génèrent déjà de gros revenus — et s'en inspirer", "Trouver 5 idées de produits rentables avec le générateur IA", "Tester si ton idée a un vrai marché — en 30 minutes", "Créer la fiche de ton produit : nom, cible, fonctionnalité star, prix"],
    accent: "#cc5de8",
  },
  {
    day: "04", label: "Jour 4", title: "Design & Architecture",
    deliverable: "Le design et la structure de ton produit validés — prêt à construire",
    items: ["S'inspirer des meilleures apps du marché pour créer ton identité visuelle", "Définir le parcours utilisateur page par page", "Poser la structure technique de ton produit — l'IA s'en occupe, tu valides"],
    accent: "#eab308",
  },
  {
    day: "05", label: "Jour 5", title: "Construire",
    deliverable: "Un produit fonctionnel qui tourne",
    items: ["L'IA génère la base de ton produit — tu décris ce que tu veux", "Créer la fonctionnalité principale — celle qui justifie le paiement", "Ajouter l'inscription utilisateur et le parcours d'accueil"],
    accent: "#ff6b6b",
  },
  {
    day: "06", label: "Jour 6", title: "Déployer",
    deliverable: "Ton produit en ligne, accessible au monde entier",
    items: ["Mettre ton produit en ligne — accessible au monde entier", "Connecter ton nom de domaine personnalisé", "Brancher les paiements et les emails automatiques"],
    accent: "#22c55e",
  },
  {
    day: "07", label: "Jour 7", title: "Monétiser & Lancer",
    deliverable: "Ta page de vente live, ta communication lancée, tes premiers euros en vue",
    items: ["Définir ta stratégie de prix (abonnement, paiement unique, freemium)", "Créer ta page de vente qui convertit", "Mettre en place ta stratégie de communication (contenus, réseaux, pubs)", "5 contenus de lancement prêts à poster", "Lancer ta première campagne pour amener du trafic", "Premiers clients et premiers revenus"],
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
          7 modules.<br />1 produit monétisé.
        </h2>
        <p className="mb-12 md:mb-20 max-w-[500px] text-[15px] md:text-[17px] leading-[1.65] text-muted-foreground">
          7 modules pour passer de l'idée au produit monétisé. Les IA qu'on utilise sont les meilleurs du marché — et presque tous gratuits. Moins de 50€ pour tout démarrer.
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
