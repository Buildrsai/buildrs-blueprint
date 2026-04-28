import { useState } from 'react'
import { ListChecks, BookOpen, HelpCircle, Check, CheckCircle2, ChevronRight, Lock, X, RotateCcw } from 'lucide-react'
import confetti from 'canvas-confetti'
import { getModule } from '../../data/curriculum'
import { VideoPlayer } from '../ui/video-player'

// Legacy 6-agents sidebar (Validator/Planner/Designer/Architect/Builder/Launcher
// + local RobotJarvis + ALL_AGENTS/MODULE_AGENT_MAP + agent-chat hashes) was
// archived 2026-04-17 during Phase 0 cleanup. A new per-module agent CTA will
// be rebuilt in Phase 4 from `AGENTS_CONFIG`. The original code lives at
// `src/_archived/pack-agents-v0/AgentsPage.legacy.tsx` for reference.

// ── Video URLs per module (add URL when ready) ──────────────────────────────
const MODULE_VIDEOS: Record<string, { src?: string; poster?: string }> = {
  '00':      {},
  'setup':   {},
  '01':      {},
  'valider': {},
  'offre':   {},
  '02':      {},
  '03':      {},
  '04':      {},
  '05':      {},
  '06':      {},
  'scaler':  {},
}

// ── Module display numbers ────────────────────────────────────────────────────
export const MODULE_NUM: Record<string, string> = {
  '00': '00', 'setup': '01', '01': '02', 'valider': '03', 'offre': '04',
  '02': '05', '03': '06', '04': '07', '05': '08', '06': '09', 'scaler': '10',
}

// ── Tab types ─────────────────────────────────────────────────────────────────
type ModuleTabId = 'checklist' | 'formation' | 'quiz'

const MODULE_TABS: { id: ModuleTabId; label: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { id: 'checklist', label: 'Checklist',  Icon: ListChecks },
  { id: 'formation', label: 'Formation',  Icon: BookOpen },
  { id: 'quiz',      label: 'Quiz',       Icon: HelpCircle },
]

// ── Checklist data ────────────────────────────────────────────────────────────
export interface CheckStep { n: number; title: string; desc: string }

export const MODULE_CHECKLISTS: Record<string, CheckStep[]> = {
  '00': [
    { n: 1, title: "Lire la leçon de bienvenue",                    desc: "Comprendre le parcours et les 72h à venir." },
    { n: 2, title: "Comprendre pourquoi les micro-SaaS en 2026",    desc: "MRR, scalable, automatisable, sans employé — les 5 raisons." },
    { n: 3, title: "Maîtriser le concept de vibe coding",           desc: "Tu décris, l'IA code. Comprendre pourquoi c'est l'avenir." },
    { n: 4, title: "Identifier ton profil de product builder",      desc: "La compétence la plus recherchée du marché en 2026." },
    { n: 5, title: "Lire le glossaire complet",                     desc: "MVP, MRR, API, Auth, Prompt... connaître le vocabulaire." },
    { n: 6, title: "Choisir ta stratégie de départ",                desc: "Résoudre un problème, copier/adapter, ou découvrir les opportunités." },
    { n: 7, title: "Choisir ton modèle de monétisation",            desc: "MRR récurrent, revente (flip), ou commande client." },
  ],
  'setup': [
    { n: 1, title: "Créer un compte Claude.ai (abonnement Pro)",    desc: "C'est ton moteur principal. Indispensable pour tout le parcours." },
    { n: 2, title: "Installer VS Code + extensions",                desc: "Prettier, ESLint, Tailwind CSS IntelliSense, GitLens." },
    { n: 3, title: "Créer un compte GitHub et un repo",             desc: "Versioning et sauvegarde de tout ton code." },
    { n: 4, title: "Créer un projet Supabase",                      desc: "Récupérer l'URL et la clé anon dans Settings → API." },
    { n: 5, title: "Connecter Vercel à GitHub",                     desc: "Déploiement automatique à chaque push. 2 minutes à configurer." },
    { n: 6, title: "Configurer Stripe en mode test",                desc: "Créer un produit test et récupérer les clés API Stripe." },
    { n: 7, title: "Vérifier ton domaine sur Resend",               desc: "Configurer SPF, DKIM, DMARC dans ton DNS (Cloudflare)." },
  ],
  '01': [
    { n: 1, title: "Utiliser le générateur d'idées Buildrs",        desc: "Générer 10 idées filtrées sur ton profil et tes contraintes." },
    { n: 2, title: "Explorer Product Hunt et Indie Hackers",         desc: "Repérer les SaaS qui performent. Chercher les failles à exploiter." },
    { n: 3, title: "Sauvegarder 5 idées dans Mes Idées",            desc: "Quantité d'abord. Tu filtreras ensuite." },
    { n: 4, title: "Rédiger le brief produit (1 phrase)",            desc: "Format : [Produit] aide [cible] à [résultat] grâce à [mécanisme]." },
    { n: 5, title: "Identifier 3 concurrents directs",              desc: "Prix, features, forces et faiblesses. La base du positionnement." },
    { n: 6, title: "Sélectionner l'idée finale",                    desc: "Critères : problème réel, buildable en 72h, quelqu'un paie déjà." },
  ],
  'valider': [
    { n: 1, title: "Analyser 3 concurrents (forces/faiblesses/prix)", desc: "Aller sur leurs sites, comprendre leur angle. Trouver les gaps." },
    { n: 2, title: "Vérifier que des gens paient déjà",              desc: "90% des MVP échouent sur un problème imaginaire. Vérifie d'abord." },
    { n: 3, title: "Passer le prompt de validation Claude",          desc: "Analyse concurrence, marché, risques et opportunités." },
    { n: 4, title: "Faire 5 entretiens utilisateurs (10 min)",       desc: "Vrais humains. Pas tes amis qui disent oui à tout." },
    { n: 5, title: "Collecter 3 feedbacks écrits",                   desc: "Niveau de frustration, frein principal, score recommandation /10." },
    { n: 6, title: "Décision finale : go / pivot / stop",            desc: "Sans cette étape, tout le reste est du gaspillage." },
  ],
  'offre': [
    { n: 1, title: "Chercher 3 apps similaires sur Mobbin",          desc: "Copier ce qui fonctionne. L'originalité vient de l'exécution." },
    { n: 2, title: "Définir le nom et le branding express",          desc: "Nom mémorable, palette 3 couleurs, 1 font. 15 minutes max." },
    { n: 3, title: "Rédiger la value proposition en 1 phrase",       desc: "Format : [Verbe fort] + [résultat] + [sans avoir à...]." },
    { n: 4, title: "Décrire le user flow complet",                   desc: "De l'inscription au premier paiement, chaque écran décrit." },
    { n: 5, title: "Choisir le modèle de prix",                      desc: "Freemium, monthly, one-time, per-seat. Choisir UN seul d'abord." },
    { n: 6, title: "Rédiger la landing page draft avec Claude",      desc: "Accroche, problème, solution, features, prix, CTA. 1h max." },
  ],
  '02': [
    { n: 1, title: "Créer le moodboard en 15 minutes",              desc: "Mobbin + 21st.dev + MagicUI. 3-5 inspirations visuelles." },
    { n: 2, title: "Choisir la palette (max 3 couleurs)",            desc: "Fond + accent + texte. Copier un système qui fonctionne." },
    { n: 3, title: "Choisir la typographie (max 2 fonts)",           desc: "Titre + corps. Geist, Inter, Outfit — rester classique." },
    { n: 4, title: "Prototyper les 3 écrans principaux",             desc: "Landing, auth, dashboard. Wireframe rapide avant de coder." },
    { n: 5, title: "Valider avec 2 personnes de ta cible",           desc: "Montrer le prototype. Observer les réactions sans expliquer." },
    { n: 6, title: "Exporter les specs pour le développement",       desc: "Couleurs en hex, fonts installées, assets prêts." },
  ],
  '03': [
    { n: 1, title: "Générer le schéma de base de données avec Claude", desc: "Tables, colonnes, types, relations. Le cerveau de ton app." },
    { n: 2, title: "Configurer Supabase Auth",                       desc: "Email + Google OAuth. Activer RLS sur toutes les tables." },
    { n: 3, title: "Définir les routes de l'application",             desc: "Public, protected, admin. Chaque URL et ce qu'elle fait." },
    { n: 4, title: "Planifier les Edge Functions nécessaires",        desc: "Stripe webhook, email triggers, API calls. Lister avant de coder." },
    { n: 5, title: "Créer les variables d'environnement",             desc: "Jamais de clé API dans le code. .env.local + .env.example." },
    { n: 6, title: "Valider avec le prompt Architecte Claude",        desc: "Faire auditer ton architecture avant de construire." },
  ],
  '04': [
    { n: 1, title: "Initialiser le projet (React + Vite + Tailwind)", desc: "Scaffolding avec Claude Code. Structure propre dès le départ." },
    { n: 2, title: "Créer les pages essentielles",                   desc: "Home, auth, dashboard. Un prompt par page." },
    { n: 3, title: "Intégrer Supabase Auth end-to-end",              desc: "Login, signup, session, logout. Tester chaque flow." },
    { n: 4, title: "Développer LA feature core (une seule)",          desc: "Celle qui justifie le paiement. Pas 15 features. Une." },
    { n: 5, title: "Connecter Stripe (checkout + webhook)",           desc: "Paiement test fonctionnel. Webhook qui reçoit les events." },
    { n: 6, title: "Tester le flow complet de A à Z",                desc: "Inscription → dashboard → paiement → accès premium." },
    { n: 7, title: "Corriger les 3 frictions principales",            desc: "Note chaque friction. Priorise les 3 blocantes. Fix. Repeat." },
  ],
  '05': [
    { n: 1, title: "Déployer sur Vercel (connecter GitHub)",          desc: "Build automatique à chaque push. Zero configuration." },
    { n: 2, title: "Connecter le nom de domaine",                    desc: "Acheter si besoin. Configurer les DNS dans Vercel." },
    { n: 3, title: "Configurer Cloudflare (CDN + sécurité)",          desc: "DNS géré par Cloudflare. HTTPS automatique, performances." },
    { n: 4, title: "Tester le paiement en production",               desc: "Avec une vraie carte. Vérifier que tout arrive dans Stripe." },
    { n: 5, title: "Configurer les emails Resend",                   desc: "Bienvenue, confirmation, relance. Tester la livraison." },
    { n: 6, title: "Compléter la checklist pré-lancement",            desc: "10 points : auth, paiement, emails, mobile, mentions légales." },
  ],
  '06': [
    { n: 1, title: "Rédiger la landing page de vente finale",         desc: "Accroche, problème, solution, preuves, prix, CTA." },
    { n: 2, title: "Définir la stratégie de prix définitive",         desc: "Paiement unique vs abonnement. Comparer avec la concurrence." },
    { n: 3, title: "Générer les mentions légales avec Claude",        desc: "CGV, politique de confidentialité, mentions légales. Obligatoire." },
    { n: 4, title: "Préparer les premiers contenus",                  desc: "5 posts LinkedIn, 3 posts X, 1 email de lancement." },
    { n: 5, title: "Lancer sur les premières plateformes",            desc: "Product Hunt, Reddit, Indie Hackers. Checklist 100 premiers users." },
    { n: 6, title: "Atteindre le premier paiement",                  desc: "L'objectif n'est pas 1000€. C'est 1€ de quelqu'un qui ne te connaît pas." },
  ],
  'scaler': [
    { n: 1, title: "Analyser les métriques du premier mois",          desc: "Visiteurs, inscriptions, conversions, MRR. Identifier les patterns." },
    { n: 2, title: "Identifier les 2 canaux les plus rentables",      desc: "Effort/result ratio. Garder ce qui marche, couper le reste." },
    { n: 3, title: "Mettre 80% de l'énergie sur ces 2 canaux",        desc: "La plupart échouent en saupoudrant. Concentrer = croître." },
    { n: 4, title: "Automatiser le support",                          desc: "FAQ, email auto, onboarding. Ton temps = croissance, pas support." },
    { n: 5, title: "Collecter et prioriser les feedbacks users",      desc: "Top 3 demandes récurrentes = roadmap V2." },
    { n: 6, title: "Fixer l'objectif MRR du prochain mois",           desc: "Double la mise sur le canal gagnant. Mesure. Répète." },
  ],
}

// ── Checklist Tab ─────────────────────────────────────────────────────────────
function ChecklistTab({ moduleId }: { moduleId: string }) {
  const steps = MODULE_CHECKLISTS[moduleId] ?? []
  const storageKey = `buildrs_module_checklist_${moduleId}`

  const [checked, setChecked] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? new Set(JSON.parse(saved) as number[]) : new Set()
    } catch { return new Set() }
  })

  const toggle = (n: number) => {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(n) ? next.delete(n) : next.add(n)
      localStorage.setItem(storageKey, JSON.stringify([...next]))
      if (moduleId === '04' && next.size === steps.length && !prev.has(n)) {
        setTimeout(() => {
          confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 }, colors: ['#4d96ff', '#22c55e', '#cc5de8', '#ffd93d', '#ff6b6b'] })
          setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0, y: 0.7 } }), 200)
          setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } }), 400)
        }, 100)
      }
      return next
    })
  }

  const done  = checked.size
  const total = steps.length
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0

  if (steps.length === 0) {
    return (
      <div className="px-6 py-8 text-center text-sm text-muted-foreground">
        Checklist en cours de préparation.
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Progression
          </span>
          <span
            className="text-[11px] font-bold"
            style={{ color: done === total && total > 0 ? '#22c55e' : 'hsl(var(--foreground))' }}
          >
            {done}/{total} étapes
          </span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'hsl(var(--border))' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: done === total && total > 0 ? '#22c55e' : 'linear-gradient(90deg, #4d96ff, #22c55e)',
            }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div
          className="absolute left-[19px] top-4 bottom-4"
          style={{ width: '1px', background: 'hsl(var(--border))' }}
        />
        <div className="flex flex-col gap-2">
          {steps.map(step => {
            const isDone = checked.has(step.n)
            return (
              <div key={step.n} className="relative flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggle(step.n)}
                  className="relative z-10 shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 mt-0.5"
                  style={{
                    background: isDone ? 'rgba(34,197,94,0.15)' : 'hsl(var(--secondary))',
                    border: `1px solid ${isDone ? 'rgba(34,197,94,0.4)' : 'hsl(var(--border))'}`,
                  }}
                >
                  {isDone
                    ? <CheckCircle2 size={16} strokeWidth={2} style={{ color: '#22c55e' }} />
                    : <span className="text-[11px] font-bold text-muted-foreground">{step.n}</span>
                  }
                </button>

                {/* Card */}
                <div
                  className="flex-1 rounded-xl px-4 py-3 transition-all duration-150"
                  style={{
                    background: isDone ? 'rgba(34,197,94,0.04)' : 'hsl(var(--card))',
                    border: `0.5px solid ${isDone ? 'rgba(34,197,94,0.2)' : 'hsl(var(--border))'}`,
                  }}
                >
                  <p
                    className="text-[13px] font-semibold mb-0.5"
                    style={{
                      color: isDone ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))',
                      textDecoration: isDone ? 'line-through' : 'none',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {step.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Done banner */}
      {done === total && total > 0 && (
        <div
          className="mt-8 rounded-2xl px-6 py-5 text-center"
          style={{ background: 'rgba(34,197,94,0.06)', border: '0.5px solid rgba(34,197,94,0.25)' }}
        >
          <p className="text-[14px] font-bold mb-1" style={{ color: '#22c55e' }}>Module validé</p>
          <p className="text-[12px] text-muted-foreground">
            Passe au module suivant ou teste tes connaissances avec le Quiz.
          </p>
        </div>
      )}
    </div>
  )
}

// ── Formation Tab ─────────────────────────────────────────────────────────────
interface FormationTabProps {
  moduleId: string
  navigate: (hash: string) => void
  isCompleted: (moduleId: string, lessonId: string) => boolean
  hasPack: boolean
}

function FormationTab({ moduleId, navigate, isCompleted, hasPack: _hasPack }: FormationTabProps) {
  const mod = getModule(moduleId)
  if (!mod) return null

  const video = MODULE_VIDEOS[moduleId] ?? {}

  // Legacy per-module agents sidebar (6 agents + chat hashes) removed 2026-04-17.
  // TODO Phase 4 : reintroduce a per-module agent CTA driven by `AGENTS_CONFIG`.

  return (
    <div className="flex flex-col">

      {/* Video — legacy agents sidebar removed (see TODO Phase 4 above) */}
      <div className="px-6 pb-5 flex-shrink-0">
        <VideoPlayer
          src={video.src}
          poster={video.poster}
          title={mod.title}
          className="rounded-xl"
        />
      </div>

      {/* Lessons grid */}
      <div className="px-6 pb-8">
        <p className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground/60 mb-3">
          Leçons
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
          {mod.lessons.map((lesson, i) => {
            const done     = isCompleted(moduleId, lesson.id)
            const prevDone = i === 0 || isCompleted(moduleId, mod.lessons[i - 1].id)
            const locked   = !prevDone && !done && i > 0

            return (
              <button
                key={lesson.id}
                onClick={() => !locked && navigate(`#/dashboard/module/${moduleId}/lesson/${lesson.id}`)}
                className={`group flex flex-col gap-2.5 w-full text-left rounded-xl border p-4 transition-all duration-150 ${
                  done
                    ? 'bg-foreground border-foreground'
                    : locked
                      ? 'border-border opacity-40 cursor-not-allowed'
                      : 'bg-background border-border hover:border-foreground/25 hover:bg-secondary/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[10px] flex-shrink-0 ${
                    done ? 'bg-white/15 text-background' : 'bg-secondary text-foreground border border-border'
                  }`}>
                    {locked
                      ? <Lock size={10} strokeWidth={1.5} />
                      : lesson.id
                    }
                  </div>
                  {done && (
                    <span
                      className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ color: '#22c55e', background: 'rgba(34,197,94,0.18)' }}
                    >
                      <Check size={8} strokeWidth={3} /> Fait
                    </span>
                  )}
                  {!done && !locked && (
                    <ChevronRight size={13} strokeWidth={1.5} className="text-muted-foreground/50 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  )}
                </div>
                <p className={`text-[12px] font-semibold leading-snug ${done ? 'text-background' : 'text-foreground'}`}>
                  {lesson.title}
                </p>
                <p className={`text-[10px] mt-auto ${done ? 'text-background/50' : 'text-muted-foreground'}`}>
                  {lesson.duration}
                  {lesson.prompts && lesson.prompts.length > 0
                    ? ` · ${lesson.prompts.length} prompt${lesson.prompts.length > 1 ? 's' : ''}`
                    : ''
                  }
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Quiz Tab ──────────────────────────────────────────────────────────────────
function QuizTab({ moduleId }: { moduleId: string }) {
  const mod = getModule(moduleId)
  const [phase,     setPhase]     = useState<'intro' | 'quiz' | 'results'>('intro')
  const [current,   setCurrent]   = useState(0)
  const [answers,   setAnswers]   = useState<(number | null)[]>([])
  const [selected,  setSelected]  = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  if (!mod || !mod.quizQuestions || mod.quizQuestions.length === 0) {
    return (
      <div className="px-6 py-12 flex flex-col items-center gap-3 text-center">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-2"
          style={{ background: 'rgba(204,93,232,0.1)', border: '0.5px solid rgba(204,93,232,0.2)' }}
        >
          <HelpCircle size={22} strokeWidth={1.5} style={{ color: '#cc5de8' }} />
        </div>
        <p className="text-[13px] font-semibold text-foreground">Quiz bientôt disponible</p>
        <p className="text-[12px] text-muted-foreground max-w-xs">
          Le quiz de ce module est en cours de préparation. Reviens dans quelques jours.
        </p>
      </div>
    )
  }

  const questions = mod.quizQuestions
  const total     = questions.length
  const q         = questions[current]

  const handleConfirm = () => { if (selected !== null) setConfirmed(true) }
  const handleNext = () => {
    const newAnswers = [...answers, selected]
    setAnswers(newAnswers)
    if (current + 1 < total) {
      setCurrent(current + 1)
      setSelected(null)
      setConfirmed(false)
    } else {
      setPhase('results')
    }
  }
  const handleRetry = () => {
    setPhase('quiz')
    setCurrent(0)
    setAnswers([])
    setSelected(null)
    setConfirmed(false)
  }

  // ── Intro
  if (phase === 'intro') {
    return (
      <div className="px-6 py-8 flex flex-col items-center text-center max-w-md mx-auto">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
          style={{ background: 'rgba(204,93,232,0.1)', border: '0.5px solid rgba(204,93,232,0.25)' }}
        >
          <HelpCircle size={26} strokeWidth={1.5} style={{ color: '#cc5de8' }} />
        </div>
        <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-2">
          Quiz de fin de module
        </p>
        <h2 className="text-xl font-extrabold text-foreground mb-2" style={{ letterSpacing: '-0.03em' }}>
          {total} question{total > 1 ? 's' : ''}
        </h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-8">
          Teste tes connaissances sur ce module. Tu peux recommencer autant de fois que tu veux.
        </p>
        <button
          onClick={() => setPhase('quiz')}
          className="px-8 py-3 rounded-xl text-[13px] font-bold transition-all hover:opacity-80"
          style={{ background: 'hsl(var(--foreground))', color: 'hsl(var(--background))' }}
        >
          Commencer le quiz →
        </button>
      </div>
    )
  }

  // ── Results
  if (phase === 'results') {
    const score   = answers.filter((a, i) => a === questions[i].correctIndex).length
    const percent = Math.round((score / total) * 100)
    const passed  = percent >= 70

    return (
      <div className="px-6 py-8 flex flex-col items-center text-center max-w-md mx-auto">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
          style={{
            background: passed ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            border: `0.5px solid ${passed ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
          }}
        >
          {passed
            ? <Check size={28} strokeWidth={2.5} style={{ color: '#22c55e' }} />
            : <X size={28} strokeWidth={2.5} style={{ color: '#ef4444' }} />
          }
        </div>
        <p className="text-[48px] font-black mb-1" style={{ color: passed ? '#22c55e' : '#ef4444', letterSpacing: '-0.04em' }}>
          {percent}%
        </p>
        <p className="text-[13px] font-semibold text-foreground mb-1">
          {score}/{total} bonnes réponses
        </p>
        <p className="text-[12px] text-muted-foreground mb-8">
          {passed ? "Excellent ! Tu maîtrises ce module." : "Continue à réviser, tu vas y arriver."}
        </p>
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-[13px] font-semibold transition-all hover:opacity-80 border border-border"
          style={{ background: 'hsl(var(--secondary))' }}
        >
          <RotateCcw size={14} strokeWidth={1.5} />
          Recommencer
        </button>
      </div>
    )
  }

  // ── Quiz
  const pct = Math.round(((current) / total) * 100)

  return (
    <div className="px-6 py-6 max-w-xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-[10px] font-semibold text-muted-foreground mb-1.5">
          <span>Question {current + 1} / {total}</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'hsl(var(--border))' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #4d96ff, #cc5de8)' }}
          />
        </div>
      </div>

      {/* Question */}
      <p className="text-[15px] font-bold text-foreground mb-5" style={{ letterSpacing: '-0.02em', lineHeight: 1.4 }}>
        {q.question}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-2 mb-5">
        {q.options.map((option, idx) => {
          const isSelected = selected === idx
          const isCorrect  = confirmed && idx === q.correctIndex
          const isWrong    = confirmed && isSelected && idx !== q.correctIndex

          return (
            <button
              key={idx}
              onClick={() => !confirmed && setSelected(idx)}
              disabled={confirmed}
              className="w-full text-left rounded-xl px-4 py-3.5 text-[13px] font-medium transition-all duration-150"
              style={{
                background: isCorrect
                  ? 'rgba(34,197,94,0.08)'
                  : isWrong
                    ? 'rgba(239,68,68,0.08)'
                    : isSelected
                      ? 'hsl(var(--secondary))'
                      : 'hsl(var(--card))',
                border: `1px solid ${
                  isCorrect ? 'rgba(34,197,94,0.4)'
                  : isWrong ? 'rgba(239,68,68,0.4)'
                  : isSelected ? 'hsl(var(--foreground))'
                  : 'hsl(var(--border))'
                }`,
                color: isCorrect ? '#22c55e' : isWrong ? '#ef4444' : 'hsl(var(--foreground))',
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0"
                  style={{
                    background: isCorrect ? 'rgba(34,197,94,0.2)' : isWrong ? 'rgba(239,68,68,0.2)' : isSelected ? 'hsl(var(--foreground))' : 'hsl(var(--secondary))',
                    color: isSelected && !confirmed ? 'hsl(var(--background))' : isCorrect ? '#22c55e' : isWrong ? '#ef4444' : 'hsl(var(--muted-foreground))',
                  }}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </div>
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {confirmed && (
        <div
          className="rounded-xl p-3.5 mb-5"
          style={{
            background: selected === q.correctIndex ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
            border: `0.5px solid ${selected === q.correctIndex ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
          }}
        >
          <p className="text-[11px] font-semibold mb-1" style={{ color: selected === q.correctIndex ? '#22c55e' : '#ef4444' }}>
            {selected === q.correctIndex ? "Bonne réponse" : "Mauvaise réponse"}
          </p>
          <p className="text-[12px] text-muted-foreground leading-relaxed">{q.explanation}</p>
        </div>
      )}

      {/* CTA */}
      {!confirmed ? (
        <button
          onClick={handleConfirm}
          disabled={selected === null}
          className="w-full py-3 rounded-xl text-[13px] font-bold transition-all disabled:opacity-40"
          style={{ background: 'hsl(var(--foreground))', color: 'hsl(var(--background))' }}
        >
          Valider
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-xl text-[13px] font-bold transition-all hover:opacity-80"
          style={{ background: 'hsl(var(--foreground))', color: 'hsl(var(--background))' }}
        >
          {current + 1 < total ? "Question suivante →" : "Voir les résultats →"}
        </button>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
interface Props {
  moduleId: string
  navigate: (hash: string) => void
  isCompleted: (moduleId: string, lessonId: string) => boolean
  hasPack?: boolean
}

export function ModulePage({ moduleId, navigate, isCompleted, hasPack = false }: Props) {
  const [activeTab, setActiveTab] = useState<ModuleTabId>('checklist')

  const mod = getModule(moduleId)
  if (!mod) return <div className="p-7 text-muted-foreground text-sm">Module introuvable.</div>

  const completedCount = mod.lessons.filter(l => isCompleted(moduleId, l.id)).length
  const pct = Math.round((completedCount / mod.lessons.length) * 100)
  const num = MODULE_NUM[moduleId] ?? moduleId

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60 mb-1">
          Module {num} · {mod.lessons.length} leçon{mod.lessons.length > 1 ? 's' : ''}
        </p>
        <h1 className="text-2xl font-extrabold text-foreground mb-1.5" style={{ letterSpacing: '-0.03em' }}>
          {mod.title}
        </h1>
        <p className="text-sm text-muted-foreground mb-4">{mod.description}</p>

        {/* Progress bar lessons */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.max(pct, pct > 0 ? 2 : 0)}%`,
                background: 'linear-gradient(90deg, #4d96ff, #22c55e)',
              }}
            />
          </div>
          <span className="text-xs font-bold text-muted-foreground tabular-nums">
            {completedCount}/{mod.lessons.length}
          </span>
          {pct === 100 && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}
            >
              Terminé
            </span>
          )}
        </div>
      </div>

      {/* ── Tab Bar ────────────────────────────────────────────────────────── */}
      <div className="px-6 mb-4 flex-shrink-0">
        <div className="flex p-1 rounded-xl" style={{ background: 'hsl(var(--secondary))' }}>
          {MODULE_TABS.map(({ id, label, Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[12px] font-semibold transition-all duration-150"
                style={{
                  background: active ? 'hsl(var(--background))' : 'transparent',
                  color: active ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                  boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  letterSpacing: '-0.01em',
                }}
              >
                <Icon size={12} strokeWidth={1.5} />
                <span>{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tab Content ────────────────────────────────────────────────────── */}
      {activeTab === 'checklist' && <ChecklistTab moduleId={moduleId} />}
      {activeTab === 'formation' && (
        <FormationTab
          moduleId={moduleId}
          navigate={navigate}
          isCompleted={isCompleted}
          hasPack={hasPack}
        />
      )}
      {activeTab === 'quiz' && <QuizTab moduleId={moduleId} />}

    </div>
  )
}
