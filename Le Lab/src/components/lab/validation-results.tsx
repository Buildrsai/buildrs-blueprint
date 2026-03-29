import { useState } from 'react'
import { ChevronDown, TrendingUp, Users, DollarSign, Wrench, Target, Shield, Lightbulb } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ScoreRing } from './score-ring'
import { ScoreBar } from './score-bar'
import { VerdictBanner } from './verdict-banner'
import { CompetitorCard } from './competitor-card'

// Types pour les données structurées Phase 1
interface ScoreDetail {
  score: number
  summary: string
}

interface Competitor {
  name: string
  url: string | null
  price: string
  strength: string
  weakness: string
}

interface Risk {
  risk: string
  mitigation: string
}

interface ValidationData {
  scores: {
    market_demand: ScoreDetail
    competition: ScoreDetail
    monetization: ScoreDetail
    buildability: ScoreDetail
  }
  total_score: number
  verdict: 'go' | 'refine' | 'pivot'
  verdict_text: string
  executive_summary: string
  market: {
    size: string
    growth: string
    trends: string[]
  }
  competitors: Competitor[]
  differentiation: string
  recommendations: {
    pricing: string
    mvp_features: string[]
    risks: Risk[]
  }
}

interface ValidationResultsProps {
  data: ValidationData
  className?: string
}

// Section dépliable
function Section({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Card variant="white" padding="sm" className="overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 hover:bg-[#F8F9FC] transition-colors rounded-xl"
      >
        <span className="text-[#3279F9]">{icon}</span>
        <span className="text-sm font-medium text-[#121317] flex-1 text-left">{title}</span>
        <ChevronDown
          size={16}
          className={cn(
            'text-[#B2BBC5] transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0">
          <div className="border-t border-[#E6EAF0] pt-4">
            {children}
          </div>
        </div>
      )}
    </Card>
  )
}

function ValidationResults({ data, className }: ValidationResultsProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Score principal + Verdict */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <ScoreRing score={data.total_score} />
        <div className="flex-1 w-full">
          <VerdictBanner
            verdict={data.verdict}
            text={data.verdict_text}
          />
        </div>
      </div>

      {/* Résumé exécutif */}
      <Card variant="white" padding="md">
        <p className="text-sm text-[#45474D] leading-relaxed">
          {data.executive_summary}
        </p>
      </Card>

      {/* 4 scores détaillés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card variant="white" padding="md">
          <ScoreBar
            icon="📈"
            label="Demande marché"
            score={data.scores.market_demand.score}
            summary={data.scores.market_demand.summary}
          />
        </Card>
        <Card variant="white" padding="md">
          <ScoreBar
            icon="⚔️"
            label="Concurrence"
            score={data.scores.competition.score}
            summary={data.scores.competition.summary}
          />
        </Card>
        <Card variant="white" padding="md">
          <ScoreBar
            icon="💰"
            label="Monétisabilité"
            score={data.scores.monetization.score}
            summary={data.scores.monetization.summary}
          />
        </Card>
        <Card variant="white" padding="md">
          <ScoreBar
            icon="🔧"
            label="Buildabilité"
            score={data.scores.buildability.score}
            summary={data.scores.buildability.summary}
          />
        </Card>
      </div>

      {/* Sections dépliables */}
      <Section
        title="Analyse marché"
        icon={<TrendingUp size={16} />}
        defaultOpen
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium tracking-wide uppercase text-[#B2BBC5]">
                Taille du marché
              </span>
              <span className="text-sm font-semibold text-[#121317]">{data.market.size}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium tracking-wide uppercase text-[#B2BBC5]">
                Croissance
              </span>
              <span className="text-sm font-semibold text-[#121317]">{data.market.growth}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium tracking-wide uppercase text-[#B2BBC5]">
              Tendances
            </span>
            <div className="flex flex-wrap gap-2">
              {data.market.trends.map((trend, i) => (
                <span
                  key={i}
                  className="text-xs bg-[#EFF2F7] text-[#45474D] px-3 py-1.5 rounded-full"
                >
                  {trend}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section
        title={`Concurrents identifiés (${data.competitors.length})`}
        icon={<Users size={16} />}
        defaultOpen
      >
        <div className="grid grid-cols-1 gap-3">
          {data.competitors.map((comp, i) => (
            <CompetitorCard key={i} {...comp} />
          ))}
        </div>
      </Section>

      <Section
        title="Différenciation"
        icon={<Target size={16} />}
      >
        <p className="text-sm text-[#45474D] leading-relaxed">{data.differentiation}</p>
      </Section>

      <Section
        title="Recommandations"
        icon={<Lightbulb size={16} />}
        defaultOpen
      >
        <div className="flex flex-col gap-5">
          {/* Pricing */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-[#3279F9]" />
              <span className="text-sm font-medium text-[#121317]">Positionnement prix</span>
            </div>
            <p className="text-sm text-[#45474D] leading-relaxed pl-[22px]">
              {data.recommendations.pricing}
            </p>
          </div>

          {/* MVP Features */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Wrench size={14} className="text-[#3279F9]" />
              <span className="text-sm font-medium text-[#121317]">MVP prioritaire</span>
            </div>
            <div className="flex flex-col gap-1.5 pl-[22px]">
              {data.recommendations.mvp_features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-xs text-[#3279F9] mt-0.5 font-mono">{i + 1}.</span>
                  <span className="text-sm text-[#45474D]">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risques */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-[#3279F9]" />
              <span className="text-sm font-medium text-[#121317]">Risques principaux</span>
            </div>
            <div className="flex flex-col gap-3 pl-[22px]">
              {data.recommendations.risks.map((risk, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-sm text-[#121317] font-medium">{risk.risk}</span>
                  <span className="text-xs text-[#45474D]">→ {risk.mitigation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}

export { ValidationResults }
export type { ValidationData }
