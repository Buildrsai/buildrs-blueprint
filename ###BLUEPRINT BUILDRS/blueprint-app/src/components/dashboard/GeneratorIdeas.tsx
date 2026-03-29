import { useState } from 'react'
import { Lightbulb, RefreshCw, Copy, Check, ChevronRight, Sparkles } from 'lucide-react'

// ── Idea bank (filtered by niche + strategy) ─────────────────────────────

interface IdeaTemplate {
  name: string
  problem: string
  target: string
  price: string
  mrr: string
  tags: string[]
}

const IDEAS_BANK: IdeaTemplate[] = [
  { name: 'FactureAI', problem: 'Créer et envoyer des factures professionnelles en 30 secondes', target: 'Freelances & consultants', price: '19€/mois', mrr: '1 500–5 000€', tags: ['finance', 'productivite', 'copy'] },
  { name: 'RecrutBot', problem: 'Automatiser le tri des CVs et la rédaction de fiches de poste avec IA', target: 'PME & startups RH', price: '49€/mois', mrr: '3 000–10 000€', tags: ['rh', 'productivite', 'copy'] },
  { name: 'ReviewSync', problem: "Centraliser et répondre aux avis Google/Trustpilot depuis un seul tableau de bord", target: 'Commerces locaux & restaurants', price: '29€/mois', mrr: '2 000–8 000€', tags: ['marketing', 'local', 'copy'] },
  { name: 'ProposalPro', problem: 'Générer des devis et propositions commerciales personnalisées avec IA', target: 'Agences & prestataires B2B', price: '39€/mois', mrr: '2 500–7 000€', tags: ['vente', 'productivite', 'problem'] },
  { name: 'OnboardMate', problem: "Automatiser l'onboarding des nouveaux employés avec des workflows personnalisés", target: "Équipes RH d'entreprises 10-200 personnes", price: '79€/mois', mrr: '5 000–15 000€', tags: ['rh', 'saas', 'copy'] },
  { name: 'SEOLocal', problem: "Optimiser automatiquement le référencement Google de commerces locaux", target: 'Gérants de commerces locaux', price: '49€/mois', mrr: '3 000–12 000€', tags: ['marketing', 'local', 'copy'] },
  { name: 'ContentPilot', problem: 'Générer et planifier du contenu LinkedIn/Instagram sur mesure avec IA', target: 'Entrepreneurs & coachs', price: '29€/mois', mrr: '2 000–6 000€', tags: ['marketing', 'contenu', 'problem'] },
  { name: 'ContratAI', problem: 'Rédiger des contrats et CGV conformes au droit français en quelques minutes', target: 'Freelances & petites entreprises', price: '19€/mois', mrr: '1 500–5 000€', tags: ['juridique', 'productivite', 'copy'] },
  { name: 'MeetingBot', problem: 'Transcrire, résumer et extraire les actions de chaque réunion automatiquement', target: 'Managers & équipes remote', price: '29€/mois', mrr: '2 000–8 000€', tags: ['productivite', 'saas', 'copy'] },
  { name: 'PricingLab', problem: 'Analyser et optimiser ses prix par rapport à la concurrence en temps réel', target: 'E-commerce & SaaS', price: '99€/mois', mrr: '5 000–20 000€', tags: ['ecommerce', 'saas', 'problem'] },
  { name: 'CourierTrack', problem: 'Centraliser le suivi de tous les colis clients sur une seule interface', target: 'E-commerçants Shopify/WooCommerce', price: '39€/mois', mrr: '2 500–10 000€', tags: ['ecommerce', 'logistique', 'copy'] },
  { name: 'AuditSite', problem: 'Analyser les performances et erreurs SEO de son site en 1 clic avec rapport PDF', target: 'Agences digitales & freelances SEO', price: '49€/mois', mrr: '3 000–10 000€', tags: ['marketing', 'agence', 'copy'] },
  { name: 'FormulAI', problem: 'Créer des formulaires intelligents qui adaptent les questions selon les réponses', target: 'PME & startups produit', price: '29€/mois', mrr: '2 000–7 000€', tags: ['saas', 'productivite', 'copy'] },
  { name: 'ChurnAlert', problem: 'Détecter les clients SaaS sur le point de partir et déclencher des relances auto', target: 'Fondateurs SaaS B2B', price: '79€/mois', mrr: '5 000–15 000€', tags: ['saas', 'retention', 'problem'] },
  { name: 'TalentScope', problem: "Qualifier et scorer automatiquement les candidats selon le poste avec IA", target: 'Recruteurs & DRH', price: '59€/mois', mrr: '4 000–12 000€', tags: ['rh', 'saas', 'copy'] },
  { name: 'MediaKit', problem: 'Créer son media kit influenceur professionnel en 5 minutes avec IA', target: 'Créateurs de contenu & influenceurs', price: '9€/mois', mrr: '1 000–4 000€', tags: ['createur', 'contenu', 'problem'] },
  { name: 'BriefBuilder', problem: 'Générer des briefs créatifs complets pour agences et graphistes en quelques clics', target: 'Directeurs artistiques & chefs de projet', price: '29€/mois', mrr: '2 000–6 000€', tags: ['agence', 'creatif', 'problem'] },
  { name: 'VisaTrack', problem: "Suivre l'avancement de son dossier de visa et recevoir des alertes personnalisées", target: 'Expatriés & voyageurs longue durée', price: '9€/mois', mrr: '800–3 000€', tags: ['niche', 'problem', 'discover'] },
  { name: 'MentionWatch', problem: "Recevoir une alerte dès que ta marque est mentionnée sur le web ou les réseaux", target: 'Marques & créateurs', price: '19€/mois', mrr: '1 500–5 000€', tags: ['marketing', 'copy'] },
  { name: 'AppStats', problem: 'Agréger et analyser les stats de ses apps mobiles dans un seul dashboard', target: 'Développeurs indie & agences mobile', price: '29€/mois', mrr: '2 000–6 000€', tags: ['tech', 'copy'] },
]

const NICHES = [
  { value: '', label: 'Toutes les niches' },
  { value: 'marketing', label: 'Marketing & SEO' },
  { value: 'rh', label: 'RH & Recrutement' },
  { value: 'finance', label: 'Finance & Comptabilité' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'saas', label: 'SaaS B2B' },
  { value: 'productivite', label: 'Productivité' },
  { value: 'contenu', label: 'Créateurs de contenu' },
  { value: 'agence', label: 'Agences' },
  { value: 'local', label: 'Commerce local' },
]

const STRATEGIES = [
  { value: '', label: 'Toutes les stratégies' },
  { value: 'copy', label: 'Copier un SaaS existant' },
  { value: 'problem', label: 'Résoudre mon problème' },
  { value: 'discover', label: 'Découvrir des opportunités' },
]

interface Props {
  navigate: (hash: string) => void
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export function GeneratorIdeas({ navigate: _navigate }: Props) {
  const [niche, setNiche] = useState('')
  const [strategy, setStrategy] = useState('')
  const [results, setResults] = useState<IdeaTemplate[]>([])
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const generate = () => {
    let filtered = IDEAS_BANK
    if (niche) filtered = filtered.filter(i => i.tags.includes(niche))
    if (strategy) filtered = filtered.filter(i => i.tags.includes(strategy))
    if (filtered.length === 0) filtered = IDEAS_BANK
    setResults(shuffle(filtered).slice(0, 5))
    setGenerated(true)
  }

  const handleCopy = async (name: string, content: string) => {
    await navigator.clipboard.writeText(content)
    setCopied(name)
    setTimeout(() => setCopied(null), 2000)
  }

  const claudePrompt = `Tu es un expert en micro-SaaS B2B. Génère 10 idées de micro-SaaS${niche ? ` dans la niche "${NICHES.find(n => n.value === niche)?.label}"` : ''} qui résolvent un problème réel, ont un potentiel MRR de 500-5000€/mois et sont constructibles en moins de 72h avec Lovable. Format pour chaque idée : nom du produit, problème résolu en 1 phrase, cible principale, prix mensuel suggéré, pourquoi ça marcherait en France.`

  return (
    <div className="p-7 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <Lightbulb size={16} strokeWidth={1.5} className="text-muted-foreground" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Plugin IA</p>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
          NicheFinder
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Génère des idées filtrées par niche et stratégie. Prêtes à valider.
        </p>
      </div>

      {/* Filters */}
      <div className="border border-border rounded-xl p-5 mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Paramètres</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">Niche</label>
            <select
              value={niche}
              onChange={e => setNiche(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            >
              {NICHES.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground block mb-1.5">Stratégie</label>
            <select
              value={strategy}
              onChange={e => setStrategy(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            >
              {STRATEGIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
        <button
          onClick={generate}
          className="flex items-center gap-2 bg-foreground text-background rounded-xl px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Sparkles size={14} strokeWidth={1.5} />
          Générer 5 idées
        </button>
      </div>

      {/* Results */}
      {generated && (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Résultats</p>
            <button
              onClick={generate}
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw size={11} strokeWidth={1.5} />
              Regénérer
            </button>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            {results.map((idea, i) => (
              <div key={i} className="border border-border rounded-xl px-5 py-4 hover:border-foreground/20 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-muted-foreground tabular-nums">#{i + 1}</span>
                      <span className="text-sm font-bold text-foreground">{idea.name}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ color: '#22c55e', background: '#22c55e18' }}>
                        {idea.price}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{idea.problem}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Cible : {idea.target} · MRR potentiel : <span className="font-semibold text-foreground">{idea.mrr}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => _navigate(`#/dashboard/generator/validate`)}
                    className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 mt-1"
                  >
                    Valider
                    <ChevronRight size={11} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Claude prompt */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-secondary/50 border-b border-border">
              <span className="text-[11px] font-semibold text-foreground">Prompt Claude pour aller plus loin</span>
              <button
                onClick={() => handleCopy('prompt', claudePrompt)}
                className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-secondary"
              >
                {copied === 'prompt'
                  ? <><Check size={11} strokeWidth={2} style={{ color: '#22c55e' }} /><span style={{ color: '#22c55e' }}>Copié !</span></>
                  : <><Copy size={11} strokeWidth={1.5} />Copier</>
                }
              </button>
            </div>
            <div className="px-4 py-3">
              <p className="text-xs text-muted-foreground font-mono leading-relaxed">{claudePrompt}</p>
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {!generated && (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <Lightbulb size={32} strokeWidth={1} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">Aucune idée générée</p>
          <p className="text-xs text-muted-foreground">Choisis tes filtres et clique sur "Générer 5 idées".</p>
        </div>
      )}
    </div>
  )
}
