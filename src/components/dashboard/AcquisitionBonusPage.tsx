import { useState, useRef, useEffect } from 'react'
import {
  ListChecks, BookOpen, CheckCircle2, ChevronRight, ChevronLeft,
  Lock, Target, ExternalLink, Users, MessageSquare, Rocket,
  Globe, Share2, FileText, TrendingUp, ArrowRight, X, ArrowLeft,
} from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

const SUPABASE_FN = 'https://ihgbbgwhgmosfjaknvlf.supabase.co/functions/v1'

// ── Types ────────────────────────────────────────────────────────────────────
type BonusTabId = 'checklist' | 'ressources'

interface BadgeDef {
  label: string
  color: string
  bg: string
  border: string
}

interface AcquisitionStep {
  n: number
  badge: BadgeDef
  title: string
  desc: string
  href: string
  external?: boolean
}

interface ResourceSection {
  id: string
  title: string
  desc: string
  badge: BadgeDef
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  platforms: string[]
  intro: string
  steps: string[]
  tips: string[]
  mistakes: string[]
}

// ── Tabs ─────────────────────────────────────────────────────────────────────
const BONUS_TABS: { id: BonusTabId; label: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { id: 'checklist',  label: 'Checklist',  Icon: ListChecks },
  { id: 'ressources', label: 'Ressources', Icon: BookOpen },
]

// ── Badges ───────────────────────────────────────────────────────────────────
const BADGE_BETA:        BadgeDef = { label: 'BETA TESTING',    color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.25)'   }
const BADGE_COMMUNITIES: BadgeDef = { label: 'COMMUNAUTES',     color: '#4d96ff', bg: 'rgba(77,150,255,0.12)',  border: 'rgba(77,150,255,0.25)'  }
const BADGE_LAUNCH:      BadgeDef = { label: 'LANCEMENT',       color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)'  }
const BADGE_DIRECTORIES: BadgeDef = { label: 'ANNUAIRES',       color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)',  border: 'rgba(139,92,246,0.25)'  }
const BADGE_SOCIAL:      BadgeDef = { label: 'RESEAUX SOCIAUX', color: '#ec4899', bg: 'rgba(236,72,153,0.12)',  border: 'rgba(236,72,153,0.25)'  }
const BADGE_CONTENT:     BadgeDef = { label: 'CONTENU',         color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',   border: 'rgba(6,182,212,0.25)'   }

// ── Checklist Steps (18, 4 phases) ───────────────────────────────────────────
const ACQUISITION_STEPS: AcquisitionStep[] = [
  // Phase 1 — Beta Testing (Users 1-10)
  { n: 1,  badge: BADGE_BETA,        title: "Teste ton produit toi-même",            desc: "Utilise ton SaaS comme un vrai user pendant 48h. Note chaque friction.",             href: '#/dashboard/acquisition-bonus/beta-testing' },
  { n: 2,  badge: BADGE_BETA,        title: "Envoie à 10 personnes de ton réseau",   desc: "Amis, collègues, contacts LinkedIn. Message personnalisé, pas un copier-coller.",    href: '#/dashboard/acquisition-bonus/beta-testing' },
  { n: 3,  badge: BADGE_BETA,        title: "Corrige les 3 frictions majeures",      desc: "Tu ne lances pas tant que ces 3 points bloquants ne sont pas réglés.",               href: '#/dashboard/acquisition-bonus/beta-testing' },
  // Phase 2 — Communautés (Users 10-30)
  { n: 4,  badge: BADGE_COMMUNITIES, title: "Poste sur Reddit (3 subreddits)",       desc: "r/SideProject, r/SaaS, r/IndieBusiness. Post authentique, pas de spam.",            href: 'https://reddit.com',                          external: true },
  { n: 5,  badge: BADGE_COMMUNITIES, title: "Publie sur Indie Hackers",              desc: "Un post \"Show IH\" + un post dans le forum. Raconte ton histoire.",                 href: 'https://indiehackers.com',                    external: true },
  { n: 6,  badge: BADGE_COMMUNITIES, title: "Poste sur Hacker News (Show HN)",       desc: "Format \"Show HN:\". Court, factuel, lien direct vers le produit.",                 href: 'https://news.ycombinator.com/submit',         external: true },
  { n: 7,  badge: BADGE_COMMUNITIES, title: "Réponds à 5 questions sur Quora",       desc: "Questions liées à ton domaine. Apporte de la valeur, mentionne ton produit.",       href: 'https://quora.com',                           external: true },
  { n: 8,  badge: BADGE_COMMUNITIES, title: "Rejoins 3 groupes Facebook pertinents", desc: "Groupes de ta niche. Interagis 3 jours d'abord, propose ton produit ensuite.",      href: 'https://facebook.com/groups',                 external: true },
  // Phase 3 — Lancement (Users 30-60)
  { n: 9,  badge: BADGE_LAUNCH,      title: "Lance sur Product Hunt",                desc: "Prépare visuels, tagline, description, et ton premier commentaire.",                href: '#/dashboard/acquisition-bonus/product-hunt' },
  { n: 10, badge: BADGE_DIRECTORIES, title: "Inscris-toi sur BetaList",              desc: "Landing page + description claire. Collecte des early adopters qualifiés.",          href: 'https://betalist.com',                        external: true },
  { n: 11, badge: BADGE_DIRECTORIES, title: "Soumets sur AlternativeTo",             desc: "Compare-toi aux alternatives existantes. Trafic qualifié et intentionnel.",          href: 'https://alternativeto.net',                   external: true },
  { n: 12, badge: BADGE_DIRECTORIES, title: "Liste-toi sur 4 annuaires SaaS",        desc: "SaaSHub, Launching Next, StartupBase, Uneed. 15 minutes chacun.",                   href: '#/dashboard/acquisition-bonus/annuaires' },
  // Phase 4 — Réseaux & Contenu (Users 60-100)
  { n: 13, badge: BADGE_SOCIAL,      title: "Lance ta présence sur X (Twitter)",     desc: "Build in public. 1 post/jour pendant 30 jours. Partage les vrais chiffres.",        href: '#/dashboard/acquisition-bonus/reseaux-sociaux' },
  { n: 14, badge: BADGE_SOCIAL,      title: "Publie 3 posts LinkedIn",               desc: "Storytelling : pourquoi tu build, leçons apprises, premiers résultats.",            href: '#/dashboard/acquisition-bonus/reseaux-sociaux' },
  { n: 15, badge: BADGE_SOCIAL,      title: "Crée 5 TikToks / Reels",               desc: "Format court : démo produit, behind the scenes, pain points réels.",                href: '#/dashboard/acquisition-bonus/reseaux-sociaux' },
  { n: 16, badge: BADGE_CONTENT,     title: "Écris un article Medium",               desc: "Raconte ton parcours de 0 au premier MRR. Publie dans une publication populaire.",  href: '#/dashboard/acquisition-bonus/content-marketing' },
  { n: 17, badge: BADGE_CONTENT,     title: "Poste sur Side Project Ideas",          desc: "Communauté de makers. Présente ton projet et tes apprentissages clés.",             href: 'https://sideprojectors.com',                  external: true },
  { n: 18, badge: BADGE_CONTENT,     title: "Analyse et double les canaux qui marchent", desc: "Identifie d'où viennent tes users. Mets 80% de ton temps sur ce canal.",       href: '#/dashboard/acquisition-bonus/strategie' },
]

const PHASES = [
  { label: 'Phase 1 — Beta Testing', sublabel: 'Users 1-10',   range: [1, 3]  },
  { label: 'Phase 2 — Communautes',  sublabel: 'Users 10-30',  range: [4, 8]  },
  { label: 'Phase 3 — Lancement',    sublabel: 'Users 30-60',  range: [9, 12] },
  { label: 'Phase 4 — Growth',       sublabel: 'Users 60-100', range: [13, 18] },
]

// ── Resource Sections ────────────────────────────────────────────────────────
const RESOURCE_SECTIONS: ResourceSection[] = [
  {
    id: 'beta-testing',
    title: 'Beta Testing & Réseau',
    desc: "Tes 10 premiers users ne viennent pas d'internet. Ils viennent de toi.",
    badge: BADGE_BETA,
    Icon: Users,
    platforms: ['Réseau personnel', 'LinkedIn', 'WhatsApp'],
    intro: "Avant de penser à Reddit, Product Hunt ou LinkedIn — tes 10 premiers utilisateurs viennent de ton réseau direct. C'est la règle universelle du lancement. Pas d'exception. Cette étape est non-négociable.",
    steps: [
      "Fais une liste de 20 personnes qui pourraient avoir le problème que tu résous (amis, collègues, anciens clients)",
      "Écris un message personnalisé pour chacun — pas un copier-coller, cite quelque chose de spécifique à leur situation",
      "Propose un accès gratuit pendant 14 jours en échange d'un feedback structuré (formulaire de 5 questions)",
      "Crée un formulaire avec ces 5 questions : Niveau de frustration avant ? Qu'est-ce qui t'a bloqué ? Qu'est-ce que tu aurais supprimé ? Score de recommandation /10 ? Pourquoi ?",
      "Itère en 48h maximum sur les 2-3 frictions les plus critiques avant de chercher des users supplémentaires",
    ],
    tips: [
      "Ne demande jamais 'Tu en penses quoi ?' — demande 'Qu'est-ce qui t'a bloqué ?' ou 'Pourquoi tu ne l'utiliserais pas chaque jour ?'",
      "Un feedback négatif vaut 10x plus qu'un compliment. Cherche les non, pas les oui.",
      "Offre quelque chose en échange : accès lifetime, réduction, ou ton temps pour les aider avec leur problème.",
    ],
    mistakes: [
      "Lancer sans avoir testé toi-même pendant 48h — tu vas rater des bugs évidents",
      "Envoyer un message générique du type 'j'ai lancé un truc, tu veux tester ?' — taux de réponse proche de 0",
      "Attendre d'avoir le produit parfait avant de le montrer — montre-le même si c'est imparfait",
    ],
  },
  {
    id: 'communautes-tech',
    title: 'Communautés Tech',
    desc: "Reddit, Indie Hackers, Hacker News, Quora — comment poster sans se faire ban.",
    badge: BADGE_COMMUNITIES,
    Icon: MessageSquare,
    platforms: ['Reddit', 'Indie Hackers', 'Hacker News', 'Quora'],
    intro: "Les communautés tech sont des mines d'or pour les premiers users, à condition de ne pas spammer. La règle : donne de la valeur d'abord, mentionne ton produit ensuite. Si ton post ressemble à une pub, tu te feras ban.",
    steps: [
      "Reddit : identifie 3 subreddits pertinents pour ta niche (r/SideProject + 2 subreddits spécifiques à ton secteur)",
      "Reddit : commente et réponds à 5 posts dans ces subreddits pendant 48h avant de poster — montre que tu existes",
      "Reddit : poste un 'Show r/SideProject' authentique. Titre : ce que ça fait, pas le nom. Corps : problème + solution + lien",
      "Indie Hackers : crée ton profil complet (histoire, revenus, stack). Puis publie un post 'Show IH' avec ton histoire de lancement",
      "Hacker News : format strict 'Show HN: [nom du produit] – [une phrase]'. Corps : 3-4 lignes factuelles. Pas de marketing.",
      "Quora : cherche des questions sur ton domaine avec +1000 vues. Réponds de façon complète (300+ mots). Mentionne ton produit naturellement.",
    ],
    tips: [
      "Sur Reddit, les posts 'I built this' fonctionnent infiniment mieux que 'Check out my SaaS'",
      "Sur Indie Hackers, les posts avec des chiffres réels (même petits) ont 3x plus d'engagement",
      "Sur Hacker News, poste entre 7h et 9h EST un jour de semaine pour maximiser la visibilité",
    ],
    mistakes: [
      "Poster le même message sur tous les subreddits — chaque communauté a ses codes, adapte ton post",
      "Mentionner ton produit dans chaque commentaire que tu fais — les mods te ban rapidement",
      "Ne jamais interagir avec les commentaires après avoir posté — engager avec chaque réponse multiplie la visibilité",
    ],
  },
  {
    id: 'product-hunt',
    title: 'Product Hunt Launch',
    desc: "Guide complet pour un launch qui génère des users, pas juste des upvotes.",
    badge: BADGE_LAUNCH,
    Icon: Rocket,
    platforms: ['Product Hunt'],
    intro: "Product Hunt peut générer 200-500 users en une journée si ton launch est bien préparé. Mais c'est aussi l'endroit où la plupart se plantent en faisant un launch bâclé. La préparation est tout.",
    steps: [
      "Prépare tes visuels : logo 240x240px, gallery de 5 screenshots (1270x760px), vidéo de démo optionnelle",
      "Écris une tagline percutante : max 60 caractères, pas d'acronymes, pas de jargon. Format : [Verbe] + [bénéfice]",
      "Rédige la description (300-500 mots) : problème -> solution -> pourquoi maintenant -> pourquoi toi",
      "Prépare ton 'first comment' épinglé — c'est ton pitch. Inclus ton histoire + une offre spéciale PH (réduction ou accès étendu)",
      "Contacte un Hunter actif 2 semaines avant pour qu'il poste ton produit — ça multiplie la visibilité par 3",
      "Poste le mardi, mercredi ou jeudi à 8h00 EST précise (Product Hunt renouvelle son ranking à cette heure)",
      "Le jour du launch : mobilise tous tes canaux (newsletter, LinkedIn, Discord, WhatsApp) pour demander du soutien",
    ],
    tips: [
      "Réponds à CHAQUE commentaire dans les 6 premières heures — l'engagement booste ton ranking",
      "Ajoute une offre exclusive PH (ex: 50% de réduction pour les 100 premiers Product Hunters) — ça convertit",
      "Rejoins quelques Discord de makers pour trouver du soutien le jour du launch",
    ],
    mistakes: [
      "Lancer le lundi ou le vendredi — compétition forte le lundi, peu de trafic le vendredi",
      "Poster sans avoir de community à mobiliser — PH est viral seulement si tu as déjà une petite base",
      "Ne pas répondre aux commentaires le jour du launch — c'est la plus grosse erreur de loin",
    ],
  },
  {
    id: 'annuaires',
    title: 'Annuaires & Directories SaaS',
    desc: "Les 6 annuaires à remplir pour du trafic qualifié en 90 minutes.",
    badge: BADGE_DIRECTORIES,
    Icon: Globe,
    platforms: ['BetaList', 'AlternativeTo', 'SaaSHub', 'Launching Next', 'StartupBase', 'Uneed'],
    intro: "Les annuaires SaaS génèrent peu de trafic au départ, mais c'est un trafic ultra-qualifié et qui compound dans le temps via le SEO. 90 minutes maintenant = trafic passif pour des mois.",
    steps: [
      "BetaList (betalist.com) : soumettre ton produit, prévoir 1-4 semaines de modération. Prépare un landing page clair avec formulaire email.",
      "AlternativeTo (alternativeto.net) : liste ton produit comme alternative à des outils connus. Les gens cherchent des alternatives — sois là.",
      "SaaSHub (saashub.com) : crée ta fiche produit avec description, screenshots, pricing, catégories. Très bon référencement Google.",
      "Launching Next (launchingnext.com) : soumission gratuite, validation rapide. Bonne visibilité dans la communauté makers.",
      "StartupBase (startupbase.io) : similaire à PH mais moins compétitif. Bien pour les niches B2B.",
      "Uneed (uneed.best) : curated list de SaaS et outils. Soumets et demande aux contacts de voter.",
    ],
    tips: [
      "Utilise la même description courte (50 mots) et longue (200 mots) partout — ça te fait gagner du temps",
      "Ajoute des tags et catégories précis sur chaque plateforme — c'est ce qui te rend trouvable dans les recherches",
      "Reviens mettre à jour ta fiche tous les 3 mois avec les nouvelles features — les plateformes boostent les produits actifs",
    ],
    mistakes: [
      "Remplir les fiches à moitié — les produits avec screenshots et description complète ont 5x plus de clics",
      "Ignorer les commentaires sur ces plateformes — une réponse publique montre que tu es actif",
      "Oublier de mettre une URL de tracking pour mesurer le trafic de chaque source",
    ],
  },
  {
    id: 'reseaux-sociaux',
    title: 'Réseaux Sociaux',
    desc: "X, LinkedIn, TikTok — le build in public qui convertit vraiment.",
    badge: BADGE_SOCIAL,
    Icon: Share2,
    platforms: ['X (Twitter)', 'LinkedIn', 'TikTok'],
    intro: "Les réseaux sociaux ne fonctionnent pas comme de la pub. Ils fonctionnent sur la confiance et l'authenticité. Le build in public — partager tes vrais chiffres, tes erreurs, tes apprentissages — est la stratégie qui convertit le mieux pour un SaaS early-stage.",
    steps: [
      "X/Twitter : bio claire 'Je build [produit] pour [problème]'. Poste 1x/jour pendant 30 jours.",
      "X : format build in public : 'Semaine 1 : 0 users. Semaine 2 : 12 users. Ce qui a marché : []. Ce qui n'a pas marché : []'. Les chiffres réels sont viraux.",
      "X : engage avec les comptes de ta niche (réponds, RT, pose des questions) — 20% de ton temps doit être de l'engagement.",
      "LinkedIn : 3 posts avec le format storytelling 'Ce que j'ai appris en buildant [produit]' ou 'J'ai lancé un SaaS. Voici les 5 erreurs que j'ai faites.'",
      "TikTok/Reels : 5 vidéos de 30-60s. Formats qui marchent : démo produit, 'j'ai buildé [chose] en 72h', 'le vrai problème que résout [ton SaaS]'.",
      "Pour TikTok : parle directement à ta cible dans le titre. 'Si tu utilises [outil concurrent] pour [tâche], j'ai quelque chose pour toi.'",
    ],
    tips: [
      "Sur X, poste une thread de lancement le jour J : raconte ton histoire en 5-7 tweets. Les threads ont 3x plus de portée.",
      "Sur LinkedIn, les posts avec une question à la fin ont 2x plus de commentaires — termine toujours par une question.",
      "Sur TikTok, utilise l'audio tendance — ça booste la portée même si le contenu n'est pas viral",
    ],
    mistakes: [
      "Poster uniquement pour vendre — les posts 'achetez mon produit' ont une portée quasi nulle",
      "Abandonner après 10 jours sans résultats — les algorithmes commencent à amplifier après 30 jours minimum",
      "Ignorer les DM et commentaires — chaque personne qui commente est un potentiel user",
    ],
  },
  {
    id: 'content-marketing',
    title: 'Content Marketing',
    desc: "Medium, Side Project Ideas, Facebook Groups — le contenu qui attire.",
    badge: BADGE_CONTENT,
    Icon: FileText,
    platforms: ['Medium', 'Side Project Ideas', 'Facebook Groups'],
    intro: "Le contenu long format génère du trafic qui dure dans le temps. Un bon article Medium peut ramener des visiteurs pendant 2 ans. C'est du travail initial, mais c'est un asset permanent.",
    steps: [
      "Medium : écris un article de 800-1200 mots sur ton parcours de 0 au premier user/premier euro. Format : problème -> solution -> vrais chiffres -> leçons.",
      "Medium : soumets ton article à une publication populaire (Entrepreneur's Handbook, Startup, Better Programming) — ça multiplie ta portée par 5.",
      "Side Project Ideas : crée un profil complet. Commente les projets des autres — la réciprocité fonctionne bien dans cette communauté.",
      "Facebook Groups : rejoins 5 groupes spécifiques à ton secteur. Observe 5 jours, puis poste une ressource gratuite utile. Mentionne ton produit seulement si pertinent.",
      "Écris 3 articles de fond : '[ton problème résolu] : les meilleures solutions', 'Comment j'ai résolu [problème] en 2025', 'Comparatif des outils pour [cas d'usage]'.",
    ],
    tips: [
      "Les articles avec des chiffres dans le titre convertissent mieux : 'J'ai testé 12 outils pour X, voici le verdict' ou '0 à 50 users en 3 semaines'",
      "Ajoute un CTA simple à la fin de chaque article : 'Si tu veux tester [produit], c'est ici' avec un lien",
      "Republier tes posts LinkedIn (légèrement remaniés) en articles Medium — le contenu peut vivre sur plusieurs plateformes",
    ],
    mistakes: [
      "Écrire pour le SEO sans vraiment aider les gens — le contenu générique n'est pas lu",
      "Pas de CTA à la fin — chaque article est une opportunité de conversion, ne la rate pas",
      "Poster dans des groupes Facebook sans s'être intégré à la communauté — tu te feras signaler comme spam",
    ],
  },
  {
    id: 'strategie',
    title: 'Stratégie & Analyse',
    desc: "Identifier tes canaux qui marchent et doubler la mise sur eux.",
    badge: BADGE_CONTENT,
    Icon: TrendingUp,
    platforms: ['Analytics', 'UTM Tracking'],
    intro: "A ce stade, tu as testé plusieurs canaux. Certains ont ramené des users, d'autres non. L'erreur classique : continuer à saupoudrer partout. La bonne stratégie : identifier le canal qui convertit le mieux et y mettre 80% de ton énergie.",
    steps: [
      "Installe Plausible, Fathom, ou Google Analytics. Configure les events de conversion : inscription, activation, premier paiement.",
      "Crée des UTM parameters pour chaque canal : ?utm_source=reddit&utm_campaign=launch, ?utm_source=ph, etc.",
      "Après 30 jours : liste tes sources. Visiteurs de chaque canal ? Inscriptions ? Taux de conversion ? Temps investi ?",
      "Calcule ton 'effort to result' : si Reddit t'a pris 2h et ramené 15 users, c'est 7.5 users/heure. Compare tous tes canaux.",
      "Le canal gagnant reçoit 80% de ton temps. Les autres passent en maintenance (1 post/semaine maximum).",
      "Fixe ton prochain objectif : de 100 à 500 users, le même canal fonctionnera — mais à plus grande échelle.",
    ],
    tips: [
      "Le LTV par canal est plus important que le volume. 10 users payants valent mieux que 100 gratuits.",
      "Si aucun canal ne fonctionne, c'est rarement un problème d'acquisition — c'est probablement un problème de message ou de produit.",
      "Note TOUT dans un Google Sheet : date, canal, action, résultat. Dans 6 mois, ce doc est une mine d'or.",
    ],
    mistakes: [
      "Mesurer le trafic mais pas les conversions — 1000 visiteurs sans inscription, ca ne sert a rien",
      "Abandonner un canal après 1 essai — les canaux ont besoin de 3-5 tentatives avant de juger",
      "Comparer ton CAC à celui de startups avec des budgets pub — ton CAC en early stage doit être proche de 0",
    ],
  },
]

// ── localStorage key ─────────────────────────────────────────────────────────
const STORAGE_KEY = 'buildrs_acquisition_checklist'

// ── Checklist Tab ─────────────────────────────────────────────────────────────
function ChecklistTab({ onLocked }: { onLocked?: () => void }) {
  const [checked, setChecked] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? new Set(JSON.parse(saved) as number[]) : new Set()
    } catch { return new Set() }
  })

  const toggle = (n: number) => {
    if (onLocked) { onLocked(); return }
    setChecked(prev => {
      const next = new Set(prev)
      next.has(n) ? next.delete(n) : next.add(n)
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      return next
    })
  }

  const handleClick = (step: AcquisitionStep) => {
    if (onLocked) { onLocked(); return }
    if (step.external) window.open(step.href, '_blank', 'noopener noreferrer')
  }

  const done  = checked.size
  const total = ACQUISITION_STEPS.length
  const pct   = Math.round((done / total) * 100)

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Progression
          </span>
          <span className="text-[11px] font-bold text-foreground" style={{ color: done === total ? '#22c55e' : undefined }}>
            {done}/{total} étapes
          </span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'hsl(var(--border))' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: done === total ? '#22c55e' : 'linear-gradient(90deg, #4d96ff, #22c55e)',
            }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-[19px] top-4 bottom-4" style={{ width: '1px', background: 'hsl(var(--border))' }} />

        <div className="flex flex-col gap-1">
          {ACQUISITION_STEPS.map((step, idx) => {
            const isDone  = checked.has(step.n)
            const phase   = PHASES.find(p => step.n >= p.range[0] && step.n <= p.range[1])
            const isFirst = phase && step.n === phase.range[0]

            return (
              <div key={step.n}>
                {/* Phase separator */}
                {isFirst && (
                  <div className={`flex items-center gap-3 ${idx === 0 ? 'mb-3' : 'mt-5 mb-3'} pl-[52px]`}>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      {phase!.label}
                    </span>
                    <span
                      className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
                      style={{ background: 'hsl(var(--secondary))', color: 'hsl(var(--muted-foreground))' }}
                    >
                      {phase!.sublabel}
                    </span>
                  </div>
                )}

                <div className="relative flex items-start gap-4">
                  {/* Checkbox circle */}
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
                  <button
                    onClick={() => handleClick(step)}
                    className="group flex-1 text-left rounded-xl px-4 py-3 transition-all duration-150"
                    style={{
                      background: isDone ? 'rgba(34,197,94,0.04)' : 'hsl(var(--card))',
                      border: `0.5px solid ${isDone ? 'rgba(34,197,94,0.2)' : 'hsl(var(--border))'}`,
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <p
                            className="text-[13px] font-semibold"
                            style={{
                              color: isDone ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))',
                              letterSpacing: '-0.01em',
                              textDecoration: isDone ? 'line-through' : 'none',
                            }}
                          >
                            {step.title}
                          </p>
                          <span
                            className="text-[8px] font-bold px-1.5 py-0.5 rounded shrink-0"
                            style={{ background: step.badge.bg, color: step.badge.color, border: `0.5px solid ${step.badge.border}` }}
                          >
                            {step.badge.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{step.desc}</p>
                      </div>
                      {step.external
                        ? <ExternalLink size={13} strokeWidth={1.5} className="shrink-0 text-muted-foreground/50" />
                        : <ChevronRight size={14} strokeWidth={1.5} className="shrink-0 text-muted-foreground/50" />
                      }
                    </div>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Done banner */}
      {done === total && (
        <div
          className="mt-8 rounded-2xl px-6 py-5 text-center"
          style={{ background: 'rgba(34,197,94,0.06)', border: '0.5px solid rgba(34,197,94,0.25)' }}
        >
          <p className="text-[14px] font-bold mb-1" style={{ color: '#22c55e' }}>100 users atteints</p>
          <p className="text-[12px] text-muted-foreground">
            Maintenant : identifie tes 2 canaux les plus rentables et mets 80% de ton énergie dessus.
          </p>
        </div>
      )}
    </div>
  )
}

// ── Resources Grid ────────────────────────────────────────────────────────────
function ResourcesGrid({ navigate, onLocked }: { navigate: (hash: string) => void; onLocked?: () => void }) {
  const goTo = (id: string) => {
    if (onLocked) { onLocked(); return }
    navigate(`#/dashboard/acquisition-bonus/${id}`)
  }

  return (
    <div className="px-6 py-6">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
        Guides par stratégie
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {RESOURCE_SECTIONS.map(section => {
          const { Icon } = section
          return (
            <button
              key={section.id}
              onClick={() => goTo(section.id)}
              className="group text-left rounded-xl p-4 transition-all duration-150 hover:border-foreground/20"
              style={{ background: 'hsl(var(--card))', border: '0.5px solid hsl(var(--border))' }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150 group-hover:scale-105"
                  style={{ background: section.badge.bg, border: `0.5px solid ${section.badge.border}` }}
                >
                  <Icon size={16} strokeWidth={1.5} style={{ color: section.badge.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <p className="text-[13px] font-semibold text-foreground" style={{ letterSpacing: '-0.01em' }}>
                      {section.title}
                    </p>
                    <span
                      className="text-[8px] font-bold px-1.5 py-0.5 rounded shrink-0"
                      style={{ background: section.badge.bg, color: section.badge.color, border: `0.5px solid ${section.badge.border}` }}
                    >
                      {section.badge.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{section.desc}</p>
                  {section.platforms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {section.platforms.map(p => (
                        <span
                          key={p}
                          className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
                          style={{ background: 'hsl(var(--secondary))', color: 'hsl(var(--muted-foreground))' }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <ChevronRight
                  size={14}
                  strokeWidth={1.5}
                  className="shrink-0 text-muted-foreground/40 group-hover:translate-x-0.5 transition-transform mt-0.5"
                />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Resource Detail Page ──────────────────────────────────────────────────────
function ResourceDetailPage({ sectionId, navigate }: { sectionId: string; navigate: (hash: string) => void }) {
  const section = RESOURCE_SECTIONS.find(s => s.id === sectionId)

  if (!section) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate('#/dashboard/acquisition-bonus')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ChevronLeft size={14} strokeWidth={1.5} /> Retour
        </button>
        <p className="text-muted-foreground text-sm">Section introuvable.</p>
      </div>
    )
  }

  const { Icon } = section

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        {/* Back */}
        <button
          onClick={() => navigate('#/dashboard/acquisition-bonus')}
          className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors mb-5"
        >
          <ChevronLeft size={13} strokeWidth={1.5} /> Retour aux ressources
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: section.badge.bg, border: `0.5px solid ${section.badge.border}` }}
          >
            <Icon size={22} strokeWidth={1.5} style={{ color: section.badge.color }} />
          </div>
          <div>
            <span
              className="text-[9px] font-bold uppercase tracking-[0.1em] block mb-0.5"
              style={{ color: section.badge.color }}
            >
              {section.badge.label}
            </span>
            <h1 className="text-2xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
              {section.title}
            </h1>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">{section.desc}</p>

        {section.platforms.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {section.platforms.map(p => (
              <span
                key={p}
                className="text-[10px] font-medium px-2 py-1 rounded-full border border-border text-muted-foreground"
              >
                {p}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-6 pb-10 flex flex-col gap-6 max-w-2xl">

        {/* Intro */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'hsl(var(--secondary))', border: '0.5px solid hsl(var(--border))' }}
        >
          <p className="text-[13px] text-foreground leading-relaxed">{section.intro}</p>
        </div>

        {/* Steps */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Les étapes
          </p>
          <div className="flex flex-col gap-2">
            {section.steps.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl p-3.5"
                style={{ background: 'hsl(var(--card))', border: '0.5px solid hsl(var(--border))' }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: section.badge.bg, border: `0.5px solid ${section.badge.border}` }}
                >
                  <span className="text-[9px] font-black" style={{ color: section.badge.color }}>{i + 1}</span>
                </div>
                <p className="text-[12px] text-foreground leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Tips qui font la différence
          </p>
          <div className="flex flex-col gap-2">
            {section.tips.map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-xl p-3.5"
                style={{ background: 'rgba(34,197,94,0.04)', border: '0.5px solid rgba(34,197,94,0.2)' }}
              >
                <ArrowRight size={12} strokeWidth={2} className="mt-0.5 flex-shrink-0" style={{ color: '#22c55e' }} />
                <p className="text-[12px] text-foreground leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mistakes */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Erreurs à éviter
          </p>
          <div className="flex flex-col gap-2">
            {section.mistakes.map((mistake, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-xl p-3.5"
                style={{ background: 'rgba(239,68,68,0.04)', border: '0.5px solid rgba(239,68,68,0.2)' }}
              >
                <span className="text-[11px] font-black flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }}>X</span>
                <p className="text-[12px] text-foreground leading-relaxed">{mistake}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Unlock Modal ──────────────────────────────────────────────────────────────
function UnlockModal({ onClose, userId }: { onClose: () => void; userId: string }) {
  const [showCheckout, setShowCheckout] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const mountRef    = useRef<HTMLDivElement>(null)
  const checkoutRef = useRef<{ destroy: () => void } | null>(null)

  useEffect(() => { return () => { checkoutRef.current?.destroy() } }, [])

  const handlePay = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${SUPABASE_FN}/create-acquisition-checkout`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ user_id: userId, origin: window.location.origin }),
      })
      const data = await res.json()
      if (!res.ok || !data.clientSecret) throw new Error(data.error ?? 'Erreur Stripe')
      const stripe = await loadStripe(data.publishableKey)
      if (!stripe) throw new Error('Stripe non disponible')
      checkoutRef.current?.destroy()
      const checkout = await stripe.initEmbeddedCheckout({ clientSecret: data.clientSecret })
      setShowCheckout(true)
      setTimeout(() => {
        if (mountRef.current) {
          checkout.mount(mountRef.current)
          checkoutRef.current = checkout
        }
      }, 50)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
      onClick={!showCheckout ? onClose : undefined}
    >
      <div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          maxWidth: showCheckout ? 560 : 440,
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
          transition: 'max-width 0.3s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 transition-opacity hover:opacity-60 text-muted-foreground"
        >
          <X size={15} strokeWidth={1.5} />
        </button>

        {/* ── Info produit ── */}
        {!showCheckout && (
          <div className="p-8 flex flex-col items-center text-center">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
              style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}
            >
              <Lock size={22} strokeWidth={1.5} style={{ color: '#f59e0b' }} />
            </div>

            <span className="text-[9.5px] font-bold uppercase tracking-[0.14em] mb-2 block text-muted-foreground">
              Bonus
            </span>
            <h2 className="text-[20px] font-extrabold text-foreground mb-2" style={{ letterSpacing: '-0.03em', lineHeight: 1.2 }}>
              100 premiers utilisateurs
            </h2>
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-6 max-w-xs">
              Le guide complet pour trouver tes 100 premiers users. 17 plateformes, checklist cochable et guides détaillés.
            </p>

            <div
              className="w-full rounded-xl p-4 mb-6 text-left space-y-2.5"
              style={{ background: 'hsl(var(--secondary))', border: '0.5px solid hsl(var(--border))' }}
            >
              {[
                "18 étapes en 4 phases (Beta, Communautés, Lancement, Contenu)",
                "17 plateformes d'acquisition détaillées",
                "Checklist cochable avec progression",
                "7 guides détaillés avec étapes, tips, erreurs",
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ background: 'rgba(245,158,11,0.2)', border: '0.5px solid rgba(245,158,11,0.4)' }}
                  />
                  <span className="text-[12px] text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>

            {error && <p className="text-[12px] mb-3" style={{ color: '#ef4444' }}>{error}</p>}

            <button
              onClick={handlePay}
              disabled={loading}
              className="cta-rainbow w-full py-3.5 rounded-xl text-[14px] font-bold transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: 'hsl(var(--foreground))', color: 'hsl(var(--background))' }}
            >
              {loading ? 'Connexion...' : 'Débloquer l\'accès — 27€ →'}
            </button>

            <p className="text-[10px] text-muted-foreground mt-3">Accès à vie · Paiement sécurisé Stripe</p>
          </div>
        )}

        {/* ── Stripe embedded checkout ── */}
        {showCheckout && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => {
                  checkoutRef.current?.destroy()
                  checkoutRef.current = null
                  setShowCheckout(false)
                }}
                className="transition-opacity hover:opacity-60 text-muted-foreground"
              >
                <ArrowLeft size={14} strokeWidth={1.5} />
              </button>
              <span className="text-[13px] font-semibold text-foreground">100 premiers utilisateurs — 27€</span>
            </div>
            <div ref={mountRef} />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Lock Banner ───────────────────────────────────────────────────────────────
function LockBanner({ onUnlock }: { onUnlock: () => void }) {
  return (
    <div
      className="mx-6 mt-4 mb-2 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4"
      style={{ background: 'rgba(245,158,11,0.06)', border: '0.5px solid rgba(245,158,11,0.25)' }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(245,158,11,0.12)', border: '0.5px solid rgba(245,158,11,0.3)' }}
      >
        <Lock size={18} strokeWidth={1.5} style={{ color: '#f59e0b' }} />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <p className="text-[13px] font-bold text-foreground mb-0.5">Bonus verrouillé</p>
        <p className="text-[12px] text-muted-foreground">
          Le guide complet pour tes 100 premiers users. 17 plateformes, 4 phases, 0 budget pub.
        </p>
      </div>
      <button
        onClick={onUnlock}
        className="shrink-0 px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all hover:opacity-80 whitespace-nowrap"
        style={{ background: '#f59e0b', color: '#fff' }}
      >
        Débloquer — 27€ →
      </button>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
interface Props {
  subPath: string
  navigate: (hash: string) => void
  hasBonus: boolean
  userId: string
}

export function AcquisitionBonusPage({ subPath, navigate, hasBonus, userId }: Props) {
  const [activeTab, setActiveTab]     = useState<BonusTabId>('checklist')
  const [showModal, setShowModal]     = useState(false)

  // Detect if subPath is a resource section ID
  const knownIds = RESOURCE_SECTIONS.map(s => s.id)
  const resourceId = subPath && knownIds.includes(subPath) ? subPath : null

  const goTab = (tab: BonusTabId) => {
    setActiveTab(tab)
    navigate('#/dashboard/acquisition-bonus')
  }

  const scrollToLock = () => {
    document.getElementById('acquisition-lock-banner')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Sub-page: resource detail
  if (resourceId) {
    return (
      <div className="flex flex-col h-full">
        {showModal && <UnlockModal userId={userId} onClose={() => setShowModal(false)} />}
        {!hasBonus && (
          <div id="acquisition-lock-banner">
            <LockBanner onUnlock={() => setShowModal(true)} />
          </div>
        )}
        <ResourceDetailPage sectionId={resourceId} navigate={navigate} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <div className="flex items-start gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(245,158,11,0.12)', border: '0.5px solid rgba(245,158,11,0.25)' }}
          >
            <Target size={20} strokeWidth={1.5} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <span
              className="text-[9px] font-bold uppercase tracking-[0.1em] block mb-0.5"
              style={{ color: '#f59e0b' }}
            >
              Bonus
            </span>
            <h1 className="text-2xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
              Tes 100 premiers utilisateurs
            </h1>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
          Le guide complet pour trouver tes 100 premiers users. 17 plateformes, 4 phases, 0 budget pub requis.
        </p>
      </div>

      {/* ── Unlock Modal ───────────────────────────────────────────────────── */}
      {showModal && <UnlockModal userId={userId} onClose={() => setShowModal(false)} />}

      {/* ── Lock Banner ────────────────────────────────────────────────────── */}
      {!hasBonus && (
        <div id="acquisition-lock-banner">
          <LockBanner onUnlock={() => setShowModal(true)} />
        </div>
      )}

      {/* ── Tab Bar ────────────────────────────────────────────────────────── */}
      <div className="px-6 mb-2 flex-shrink-0">
        <div
          className="flex p-1 rounded-xl"
          style={{ background: 'hsl(var(--secondary))' }}
        >
          {BONUS_TABS.map(({ id, label, Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => goTab(id)}
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
      {activeTab === 'checklist' && (
        <ChecklistTab onLocked={!hasBonus ? scrollToLock : undefined} />
      )}
      {activeTab === 'ressources' && (
        <ResourcesGrid navigate={navigate} onLocked={!hasBonus ? scrollToLock : undefined} />
      )}

    </div>
  )
}
