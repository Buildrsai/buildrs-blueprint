import { Sparkles, CheckCircle, TrendingUp, ArrowRight, Zap, ArrowUp, Send } from 'lucide-react'

interface Props {
  navigate: (hash: string) => void
}

// ── Source logos ──────────────────────────────────────────────────────────────
function RedditIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  )
}
function ProductHuntIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M13.604 8.4h-3.405V12h3.405c.995 0 1.801-.806 1.801-1.8S14.6 8.4 13.604 8.4zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.8V6h5.804c2.319 0 4.2 1.881 4.2 4.2s-1.881 4.2-4.2 4.2z" />
    </svg>
  )
}
function AppStoreIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8.8086 14.9194l6.1107-11.0368c.0837-.1513.1682-.302.2437-.4584.0685-.142.1267-.2854.1646-.4403.0803-.3259.0588-.6656-.066-.9767-.1238-.3095-.3417-.5678-.6201-.7355a1.4175 1.4175 0 0 0-.921-.1924c-.3207.043-.6135.1935-.8443.4288-.1094.1118-.1996.2361-.2832.369-.092.1463-.175.2979-.259.4492l-.3864.6979-.3865-.6979c-.0837-.1515-.1667-.303-.2587-.4492-.0837-.1329-.1739-.2572-.2835-.369-.2305-.2353-.5233-.3857-.844-.429a1.4181 1.4181 0 0 0-.921.1926c-.2784.1677-.4964.426-.6203.7355-.1246.311-.1461.6508-.066.9767.038.155.0962.2984.1648.4403.0753.1564.1598.307.2437.4584l1.248 2.2543-4.8625 8.7825H2.0295c-.1676 0-.3351-.0007-.5026.0092-.1522.009-.3004.0284-.448.0714-.3108.0906-.5822.2798-.7783.548-.195.2665-.3006.5929-.3006.9279 0 .3352.1057.6612.3006.9277.196.2683.4675.4575.7782.548.1477.043.296.0623.4481.0715.1675.01.335.009.5026.009h13.0974c.0171-.0357.059-.1294.1-.2697.415-1.4151-.6156-2.843-2.0347-2.843zM3.113 18.5418l-.7922 1.5008c-.0818.1553-.1644.31-.2384.4705-.067.1458-.124.293-.1611.452-.0785.3346-.0576.6834.0645 1.0029.1212.3175.3346.583.607.7549.2727.172.5891.2416.9013.1975.3139-.044.6005-.1986.8263-.4402.1072-.1148.1954-.2424.2772-.3787.0902-.1503.1714-.3059.2535-.4612L6 19.4636c-.0896-.149-.9473-1.4704-2.887-.9218m20.5861-3.0056a1.4707 1.4707 0 0 0-.779-.5407c-.1476-.0425-.2961-.0616-.4483-.0705-.1678-.0099-.3352-.0091-.503-.0091H18.648l-4.3891-7.817c-.6655.7005-.9632 1.485-1.0773 2.1976-.1655 1.0333.0367 2.0934.546 3.0004l5.2741 9.3933c.084.1494.167.299.2591.4435.0837.131.1739.2537.2836.364.231.2323.5238.3809.8449.4232.3192.0424.643-.0244.9217-.1899.2784-.1653.4968-.4204.621-.7257.1246-.3072.146-.6425.0658-.9641-.0381-.1529-.0962-.2945-.165-.4346-.0753-.1543-.1598-.303-.2438-.4524l-1.216-2.1662h1.596c.1677 0 .3351.0009.5029-.009.1522-.009.3007-.028.4483-.0705a1.4707 1.4707 0 0 0 .779-.5407A1.5386 1.5386 0 0 0 24 16.452a1.539 1.539 0 0 0-.3009-.9158Z"/>
    </svg>
  )
}
function IndieHackersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M0 0h24v24H0V0Zm5.4 17.2h2.4V6.8H5.4v10.4Zm4.8 0h2.4v-4h3.6v4h2.4V6.8h-2.4v4h-3.6v-4h-2.4v10.4Z"/>
    </svg>
  )
}

const SOURCES = [
  { label: 'Reddit', Icon: RedditIcon },
  { label: 'Product Hunt', Icon: ProductHuntIcon },
  { label: 'App Store', Icon: AppStoreIcon },
  { label: 'Indie Hackers', Icon: IndieHackersIcon },
  { label: 'Reddit', Icon: RedditIcon },
  { label: 'Product Hunt', Icon: ProductHuntIcon },
  { label: 'App Store', Icon: AppStoreIcon },
  { label: 'Indie Hackers', Icon: IndieHackersIcon },
]

// ── Visual previews ───────────────────────────────────────────────────────────

function MatchPreview() {
  return (
    <div className="w-full rounded-xl border border-border bg-secondary/30 p-3 flex flex-col gap-2">
      {/* Question bubble */}
      <div className="flex flex-col gap-1.5">
        {['Quel est ton profil ?', 'Tes outils préférés ?', 'Ton budget de départ ?'].map((q, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 flex-shrink-0" />
            <div
              className="h-[26px] rounded-lg flex items-center px-3 border border-border"
              style={{ background: 'hsl(var(--background))', minWidth: 0, flex: 1 }}
            >
              <span className="text-[10px] text-muted-foreground truncate">{q}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Result pill */}
      <div className="mt-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-foreground/15 bg-foreground/5">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#22c55e' }} />
        <span className="text-[10px] font-semibold text-foreground">Découvre le SaaS idéal pour ton profil</span>
      </div>
    </div>
  )
}

function GeneratorPreview() {
  return (
    <div className="w-full rounded-xl border border-border bg-secondary/30 p-3">
      <div
        className="rounded-lg border border-border p-2.5 flex items-end gap-2"
        style={{ background: 'hsl(var(--background))' }}
      >
        <p
          className="flex-1 text-[10px] text-foreground leading-relaxed"
          style={{ minHeight: 40 }}
        >
          J'aime le webdesign et j'aimerais trouver une idée de SaaS pour les freelances
          <span className="inline-block w-[2px] h-[11px] ml-0.5 bg-foreground align-middle animate-pulse" />
        </p>
        <button className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center flex-shrink-0 mb-0.5">
          <ArrowUp size={10} strokeWidth={2.5} className="text-background" />
        </button>
      </div>
    </div>
  )
}

function ValidatorPreview() {
  return (
    <div className="w-full rounded-xl border border-border bg-secondary/30 p-3">
      <div
        className="rounded-lg border border-border flex items-center gap-2 px-3 py-2.5"
        style={{ background: 'hsl(var(--background))' }}
      >
        <p className="flex-1 text-[10px] text-foreground">
          Je voudrais valider mon idée d'app de coaching sportif
          <span className="inline-block w-[2px] h-[11px] ml-0.5 bg-foreground align-middle animate-pulse" />
        </p>
        <button className="flex-shrink-0 flex items-center gap-1 bg-foreground text-background rounded-lg px-2.5 py-1.5">
          <Send size={9} strokeWidth={2} />
          <span className="text-[9px] font-bold">Lancer</span>
        </button>
      </div>
    </div>
  )
}

function CalculatorPreview() {
  const bars = [28, 42, 35, 58, 52, 70, 65, 88, 80, 100]
  return (
    <div className="w-full rounded-xl border border-border bg-secondary/30 p-3">
      <div className="flex items-end gap-1.5 h-[52px]">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${h}%`,
              background: `linear-gradient(180deg, #8b5cf6 0%, #6d28d9 100%)`,
              opacity: 0.5 + (i / bars.length) * 0.5,
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[9px] text-muted-foreground/60">MRR</span>
        <span className="text-[10px] font-bold text-foreground" style={{ letterSpacing: '-0.02em' }}>+247% / 12 mois</span>
      </div>
    </div>
  )
}

// ── Cards config ──────────────────────────────────────────────────────────────
const GENERATORS = [
  {
    id: 'saas-match',
    title: 'SaaS Match',
    desc: "Réponds à 5 questions et découvre le SaaS IA le plus adapté à ton profil et tes besoins.",
    Icon: Zap,
    hash: '#/saas-match',
    badge: 'Matcher',
    Preview: MatchPreview,
  },
  {
    id: 'generator',
    title: 'Générateur de SaaS',
    desc: "Génère une idée de SaaS complète avec nom, problème cible, fonctionnalités et monétisation.",
    Icon: Sparkles,
    hash: '#/dashboard/generator',
    badge: 'Générer',
    Preview: GeneratorPreview,
  },
  {
    id: 'validator',
    title: 'Valider mon idée',
    desc: "Soumets ton idée à une analyse IA : marché, concurrence, risques et score de faisabilité.",
    Icon: CheckCircle,
    hash: '#/dashboard/validator',
    badge: 'Valider',
    Preview: ValidatorPreview,
  },
  {
    id: 'revenue-calculator',
    title: 'Calculateur MRR',
    desc: "Projette tes revenus mensuels et annuels selon ton pricing et ta croissance estimée.",
    Icon: TrendingUp,
    hash: '#/dashboard/revenue-calculator',
    badge: 'Calculer',
    Preview: CalculatorPreview,
  },
]

export function GenerateurIAPage({ navigate }: Props) {
  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">

      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground mb-1" style={{ letterSpacing: '-0.03em' }}>
          Générateurs IA
        </h1>
        <p className="text-sm text-muted-foreground">
          4 outils pour trouver, valider et projeter ton SaaS IA.
        </p>
      </div>

      {/* ── Sources banner ── */}
      <div className="mb-6 rounded-xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid #e4e4e7' }}>
        <div className="px-5 pt-4 pb-4">
          <p className="text-[13px] font-extrabold leading-snug mb-1" style={{ letterSpacing: '-0.02em', color: '#09090b' }}>
            Une IA agentique entraînée sur des milliers de vraies opportunités de marché.
          </p>
          <p className="text-[11px] leading-relaxed mb-4" style={{ color: '#09090b' }}>
            Pas de données inventées. Chaque résultat est ancré dans des recherches réelles — pour que tu valides vite, tu construises juste, et tu évites les erreurs qui coûtent cher.
          </p>
          {/* Static logos */}
          <div className="flex items-center gap-6 pt-3" style={{ borderTop: '1px solid #e4e4e7' }}>
            {[
              { label: 'Reddit', Icon: RedditIcon },
              { label: 'Product Hunt', Icon: ProductHuntIcon },
              { label: 'Indie Hackers', Icon: IndieHackersIcon },
              { label: 'App Store', Icon: AppStoreIcon },
            ].map(({ label, Icon }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon width={20} height={20} className="text-foreground flex-shrink-0" style={{ color: '#09090b' }} />
                <span className="text-[11px] font-semibold" style={{ color: '#09090b' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GENERATORS.map(({ id, title, desc, Icon, hash, badge, Preview }) => (
          <button
            key={id}
            onClick={() => navigate(hash)}
            className="group flex flex-col items-start gap-3 text-left border border-border rounded-xl p-5 hover:border-foreground/20 hover:bg-secondary/20 transition-all duration-150"
          >
            {/* Top row: icon + badge */}
            <div className="flex items-start justify-between w-full">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Icon size={16} strokeWidth={1.5} className="text-foreground" />
              </div>
              <span
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: 'hsl(var(--secondary))',
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--muted-foreground))',
                }}
              >
                {badge}
              </span>
            </div>

            {/* Title + desc */}
            <div>
              <p className="text-[13px] font-bold text-foreground mb-1" style={{ letterSpacing: '-0.02em' }}>
                {title}
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </div>

            {/* Visual preview */}
            <Preview />

            {/* CTA */}
            <div className="flex items-center gap-1 text-[11px] font-semibold text-foreground group-hover:gap-2 transition-all">
              Lancer
              <ArrowRight size={11} strokeWidth={2} />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
