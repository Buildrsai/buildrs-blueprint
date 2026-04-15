import { Lightbulb, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react'

const GENERATORS = [
  {
    id: 'ideas',
    hash: '#/dashboard/generator/ideas',
    Icon: Lightbulb,
    title: 'NicheFinder',
    desc: 'Génère des idées de micro-SaaS rentables en quelques clics.',
    accent: '#4d96ff',
  },
  {
    id: 'validate',
    hash: '#/dashboard/generator/validate',
    Icon: ShieldCheck,
    title: 'MarketPulse',
    desc: 'Analyse ta niche et score tes concurrents avant de construire.',
    accent: '#22c55e',
  },
  {
    id: 'mrr',
    hash: '#/dashboard/generator/mrr',
    Icon: TrendingUp,
    title: 'FlipCalc',
    desc: 'Projette ton MRR (revenus mensuels) et ton prix de revente.',
    accent: '#cc5de8',
  },
]

interface Props {
  navigate: (hash: string) => void
}

export function GeneratorHubPage({ navigate }: Props) {
  return (
    <div className="p-7 max-w-2xl">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <Lightbulb size={16} strokeWidth={1.5} className="text-muted-foreground" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Plugins IA</p>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
          Plugins IA
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Choisis un outil pour démarrer.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {GENERATORS.map(({ id, hash, Icon, title, desc, accent }) => (
          <button
            key={id}
            onClick={() => navigate(hash)}
            className="group flex items-center gap-4 border border-border rounded-xl p-5 text-left hover:border-foreground/20 transition-all hover:shadow-sm bg-background"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
              style={{ background: `${accent}15` }}
            >
              <Icon size={18} strokeWidth={1.5} style={{ color: accent }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground mb-0.5">{title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="flex-shrink-0 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 transition-all"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
