import { useState, useRef } from 'react'
import { Link } from 'react-router'
import { ArrowRight, RefreshCw, Layout, Database, DollarSign, CheckCircle, ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GenerationLoader } from './generation-loader'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

// Types
interface PageItem {
  name: string
  route: string
  role: string
  priority: string
  key_elements: string[]
}

interface FeatureItem {
  name: string
  description: string
  priority: string
  page: string
}

interface EntityField {
  name: string
  type: string
  required: boolean
  description?: string
}

interface Entity {
  name: string
  description: string
  fields: EntityField[]
  relations: string[]
}

interface Tier {
  name: string
  price: string
  billing: string
  features: string[]
  target: string
  is_recommended: boolean
}

interface StructureData {
  pages?: PageItem[]
  features?: FeatureItem[]
  user_journey?: string
  mvp_scope?: string
  post_mvp?: string[]
  data_model?: Entity[]
  data_model_summary?: string
  monetization?: {
    recommended_model: string
    why: string
    tiers: Tier[]
    conversion_strategy: string
    revenue_estimate: {
      month_1: string
      month_6: string
      assumptions: string
    }
    pricing_tips: string[]
  }
}

interface Phase2StructureProps {
  projectId: string
  structureData: StructureData | null
  onRefetch: () => void
}

// Sous-étapes de la Phase 2
const SUB_STEPS = [
  { key: 'pages_features', label: 'Pages & Features', icon: Layout, description: 'Structure les pages et features MVP' },
  { key: 'data_model', label: 'Modèle de données', icon: Database, description: 'Définis les données de ton app' },
  { key: 'monetization', label: 'Monétisation', icon: DollarSign, description: 'Choisis ton modèle de pricing' },
  { key: 'summary', label: 'Résumé produit', icon: CheckCircle, description: 'Valide et passe au branding' },
]

// Étapes de progression par sous-étape
const PROGRESS_STEPS: Record<string, Array<{ key: string; icon: string; label: string }>> = {
  pages_features: [
    { key: 'analyzing_idea', icon: '🔍', label: 'Analyse de ton idée...' },
    { key: 'defining_pages', icon: '📄', label: 'Définition des pages...' },
    { key: 'selecting_features', icon: '⚡', label: 'Sélection des features MVP...' },
    { key: 'mapping_journey', icon: '🗺️', label: 'Mapping du parcours utilisateur...' },
  ],
  data_model: [
    { key: 'analyzing_structure', icon: '🏗️', label: 'Analyse de la structure...' },
    { key: 'defining_entities', icon: '📦', label: 'Définition des entités...' },
    { key: 'mapping_relations', icon: '🔗', label: 'Mapping des relations...' },
  ],
  monetization: [
    { key: 'analyzing_market', icon: '📊', label: 'Analyse des prix du marché...' },
    { key: 'defining_tiers', icon: '💰', label: 'Définition des tiers...' },
    { key: 'estimating_revenue', icon: '📈', label: 'Estimation du revenu...' },
  ],
}

// Section dépliable
function Collapsible({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 w-full text-left py-2">
        <ChevronDown size={14} className={cn('text-[#B2BBC5] transition-transform', open && 'rotate-180')} />
        <span className="text-xs font-medium uppercase tracking-wide text-[#B2BBC5]">{title}</span>
      </button>
      {open && <div className="pt-1">{children}</div>}
    </div>
  )
}

function Phase2Structure({ projectId, structureData, onRefetch }: Phase2StructureProps) {
  const [activeStep, setActiveStep] = useState<number>(() => {
    // Déterminer la sous-étape active basée sur les données existantes
    if (!structureData?.pages) return 0
    if (!structureData?.data_model) return 1
    if (!structureData?.monetization) return 2
    return 3
  })
  const [generating, setGenerating] = useState(false)
  const [progressStep, setProgressStep] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const handleGenerate = async (subStep: string) => {
    setGenerating(true)
    setProgressStep(null)
    setError(null)
    abortRef.current = new AbortController()

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Non authentifié')

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-phase`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ projectId, phaseNumber: 2, subStep }),
          signal: abortRef.current.signal,
        }
      )

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error ?? 'Erreur serveur')
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const msg = JSON.parse(line)
            if (msg.type === 'progress') setProgressStep(msg.step)
            else if (msg.type === 'error') throw new Error(msg.message)
          } catch {
            // Ignorer lignes non-JSON
          }
        }
      }

      onRefetch()
      // Avancer à la sous-étape suivante
      setActiveStep(prev => Math.min(prev + 1, 3))
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message)
      }
    } finally {
      setGenerating(false)
      setProgressStep(null)
    }
  }

  // Render du stepper horizontal
  const renderStepper = () => (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {SUB_STEPS.map((step, i) => {
        const isActive = i === activeStep
        const isDone = (i === 0 && structureData?.pages) ||
                       (i === 1 && structureData?.data_model) ||
                       (i === 2 && structureData?.monetization) ||
                       (i === 3 && structureData?.pages && structureData?.data_model && structureData?.monetization)
        const Icon = step.icon

        return (
          <button
            key={step.key}
            onClick={() => !generating && setActiveStep(i)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-full transition-all text-sm whitespace-nowrap',
              isActive && 'bg-[#3279F9] text-white',
              !isActive && isDone && 'bg-[#22C55E]/10 text-[#22C55E]',
              !isActive && !isDone && 'bg-[#EFF2F7] text-[#45474D] hover:bg-[#E6EAF0]'
            )}
          >
            {isDone && !isActive ? (
              <CheckCircle size={14} />
            ) : (
              <Icon size={14} />
            )}
            <span className="font-medium">{step.label}</span>
          </button>
        )
      })}
    </div>
  )

  // Render contenu Pages & Features
  const renderPagesFeatures = () => {
    if (!structureData?.pages) {
      return (
        <Card variant="white" padding="lg" className="flex flex-col items-center gap-6 py-12">
          <div className="w-16 h-16 rounded-full bg-[#3279F9]/8 flex items-center justify-center">
            <Layout size={28} className="text-[#3279F9]" />
          </div>
          <div className="text-center flex flex-col gap-2 max-w-[400px]">
            <h2 className="text-base font-medium text-[#121317]">Définir tes pages & features</h2>
            <p className="text-sm text-[#45474D] leading-relaxed">
              Le Lab va structurer ton produit : les pages nécessaires, les features MVP
              et le parcours de ton utilisateur.
            </p>
          </div>
          <Button variant="primary" size="md" onClick={() => handleGenerate('pages_features')} className="gap-2">
            Générer la structure →
          </Button>
        </Card>
      )
    }

    return (
      <div className="flex flex-col gap-5">
        {/* Pages */}
        <Card variant="white" padding="md">
          <Collapsible title={`Pages MVP (${structureData.pages.length})`}>
            <div className="flex flex-col gap-3 mt-2">
              {structureData.pages.map((page, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#F8F9FC] rounded-xl">
                  <span className="text-xs font-mono text-[#3279F9] bg-[#3279F9]/8 px-2 py-1 rounded-full flex-shrink-0 mt-0.5">
                    {page.route}
                  </span>
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-sm font-medium text-[#121317]">{page.name}</span>
                    <span className="text-xs text-[#45474D]">{page.role}</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {page.key_elements.map((el, j) => (
                        <span key={j} className="text-[10px] bg-[#E6EAF0] text-[#45474D] px-2 py-0.5 rounded-full">
                          {el}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Collapsible>
        </Card>

        {/* Features */}
        <Card variant="white" padding="md">
          <Collapsible title={`Features MVP (${structureData.features?.filter(f => f.priority === 'mvp').length ?? 0})`}>
            <div className="flex flex-col gap-2 mt-2">
              {structureData.features?.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 py-2">
                  <Badge variant={feature.priority === 'mvp' ? 'accent' : 'neutral'} className="flex-shrink-0 mt-0.5">
                    {feature.priority === 'mvp' ? 'MVP' : 'V2'}
                  </Badge>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-[#121317]">{feature.name}</span>
                    <span className="text-xs text-[#45474D]">{feature.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </Collapsible>
        </Card>

        {/* Parcours utilisateur */}
        {structureData.user_journey && (
          <Card variant="white" padding="md">
            <Collapsible title="Parcours utilisateur" defaultOpen={false}>
              <p className="text-sm text-[#45474D] leading-relaxed mt-2 whitespace-pre-line">
                {structureData.user_journey}
              </p>
            </Collapsible>
          </Card>
        )}

        {/* MVP Scope */}
        {structureData.mvp_scope && (
          <Card variant="light" padding="md">
            <p className="text-sm text-[#45474D] leading-relaxed">
              <span className="font-medium text-[#121317]">Scope MVP : </span>
              {structureData.mvp_scope}
            </p>
          </Card>
        )}

        <Button variant="ghost" size="sm" onClick={() => handleGenerate('pages_features')} className="self-start gap-1.5 text-[#45474D]">
          <RefreshCw size={13} />
          Regénérer
        </Button>
      </div>
    )
  }

  // Render contenu Data Model
  const renderDataModel = () => {
    if (!structureData?.data_model) {
      return (
        <Card variant="white" padding="lg" className="flex flex-col items-center gap-6 py-12">
          <div className="w-16 h-16 rounded-full bg-[#3279F9]/8 flex items-center justify-center">
            <Database size={28} className="text-[#3279F9]" />
          </div>
          <div className="text-center flex flex-col gap-2 max-w-[400px]">
            <h2 className="text-base font-medium text-[#121317]">Définir tes données</h2>
            <p className="text-sm text-[#45474D] leading-relaxed">
              Le Lab va définir les informations que ton app stocke — en langage simple, pas en SQL.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => handleGenerate('data_model')}
            disabled={!structureData?.pages}
            className="gap-2"
          >
            {structureData?.pages ? 'Générer le modèle →' : 'Complète d\'abord les pages'}
          </Button>
        </Card>
      )
    }

    return (
      <div className="flex flex-col gap-4">
        {structureData.data_model.map((entity, i) => (
          <Card key={i} variant="white" padding="md">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-base">📦</span>
                <span className="text-sm font-semibold text-[#121317]">{entity.name}</span>
              </div>
              <p className="text-xs text-[#45474D]">{entity.description}</p>
              <div className="flex flex-col gap-1.5">
                {entity.fields.map((field, j) => (
                  <div key={j} className="flex items-center gap-2 py-1 px-3 bg-[#F8F9FC] rounded-lg">
                    <span className="text-xs font-medium text-[#121317] min-w-[120px]">{field.name}</span>
                    <span className="text-[10px] font-mono text-[#3279F9] bg-[#3279F9]/8 px-2 py-0.5 rounded-full">
                      {field.type}
                    </span>
                    {field.required && (
                      <span className="text-[10px] text-[#EF4444]">requis</span>
                    )}
                  </div>
                ))}
              </div>
              {entity.relations.length > 0 && (
                <div className="flex flex-col gap-1 mt-1">
                  {entity.relations.map((rel, j) => (
                    <span key={j} className="text-xs text-[#45474D] italic">↳ {rel}</span>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}

        {structureData.data_model_summary && (
          <Card variant="light" padding="md">
            <p className="text-sm text-[#45474D] leading-relaxed">{structureData.data_model_summary}</p>
          </Card>
        )}

        <Button variant="ghost" size="sm" onClick={() => handleGenerate('data_model')} className="self-start gap-1.5 text-[#45474D]">
          <RefreshCw size={13} />
          Regénérer
        </Button>
      </div>
    )
  }

  // Render contenu Monetization
  const renderMonetization = () => {
    if (!structureData?.monetization) {
      return (
        <Card variant="white" padding="lg" className="flex flex-col items-center gap-6 py-12">
          <div className="w-16 h-16 rounded-full bg-[#3279F9]/8 flex items-center justify-center">
            <DollarSign size={28} className="text-[#3279F9]" />
          </div>
          <div className="text-center flex flex-col gap-2 max-w-[400px]">
            <h2 className="text-base font-medium text-[#121317]">Définir ta monétisation</h2>
            <p className="text-sm text-[#45474D] leading-relaxed">
              Le Lab va recommander le modèle de pricing optimal basé sur tes concurrents
              et ton type de produit.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => handleGenerate('monetization')}
            disabled={!structureData?.data_model}
            className="gap-2"
          >
            {structureData?.data_model ? 'Générer la stratégie →' : 'Complète d\'abord le modèle de données'}
          </Button>
        </Card>
      )
    }

    const mon = structureData.monetization
    return (
      <div className="flex flex-col gap-5">
        {/* Modèle recommandé */}
        <Card variant="white" padding="md" className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="accent">
              {mon.recommended_model === 'subscription' ? 'Abonnement' :
               mon.recommended_model === 'one_time' ? 'Paiement unique' : 'Freemium'}
            </Badge>
            <span className="text-xs text-[#B2BBC5]">Modèle recommandé</span>
          </div>
          <p className="text-sm text-[#45474D] leading-relaxed">{mon.why}</p>
        </Card>

        {/* Tiers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {mon.tiers.map((tier, i) => (
            <Card
              key={i}
              variant="white"
              padding="md"
              className={cn(
                'flex flex-col gap-3 relative',
                tier.is_recommended && 'border-[#3279F9] shadow-[0_0_0_1px_#3279F9]'
              )}
            >
              {tier.is_recommended && (
                <Badge variant="accent" className="absolute -top-2.5 left-4">
                  Recommandé
                </Badge>
              )}
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-sm font-semibold text-[#121317]">{tier.name}</span>
                <span className="text-xl font-bold font-mono text-[#3279F9]">{tier.price}</span>
                <span className="text-[10px] text-[#B2BBC5]">{tier.target}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {tier.features.map((feat, j) => (
                  <div key={j} className="flex items-start gap-1.5">
                    <span className="text-xs text-[#22C55E] mt-0.5">✓</span>
                    <span className="text-xs text-[#45474D]">{feat}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Estimations de revenu */}
        <Card variant="light" padding="md" className="flex flex-col gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-[#B2BBC5]">Estimations de revenu</span>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-[#45474D]">Mois 1</span>
              <p className="text-sm font-medium text-[#121317]">{mon.revenue_estimate.month_1}</p>
            </div>
            <div>
              <span className="text-xs text-[#45474D]">Mois 6</span>
              <p className="text-sm font-medium text-[#121317]">{mon.revenue_estimate.month_6}</p>
            </div>
          </div>
          <p className="text-xs text-[#B2BBC5] italic">{mon.revenue_estimate.assumptions}</p>
        </Card>

        {/* Stratégie de conversion */}
        <Card variant="white" padding="md">
          <Collapsible title="Stratégie de conversion" defaultOpen={false}>
            <p className="text-sm text-[#45474D] leading-relaxed mt-2">{mon.conversion_strategy}</p>
          </Collapsible>
        </Card>

        {/* Tips */}
        {mon.pricing_tips.length > 0 && (
          <Card variant="white" padding="md">
            <Collapsible title="Conseils pricing" defaultOpen={false}>
              <div className="flex flex-col gap-2 mt-2">
                {mon.pricing_tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs text-[#3279F9] mt-0.5">💡</span>
                    <span className="text-sm text-[#45474D]">{tip}</span>
                  </div>
                ))}
              </div>
            </Collapsible>
          </Card>
        )}

        <Button variant="ghost" size="sm" onClick={() => handleGenerate('monetization')} className="self-start gap-1.5 text-[#45474D]">
          <RefreshCw size={13} />
          Regénérer
        </Button>
      </div>
    )
  }

  // Render résumé
  const renderSummary = () => {
    const isComplete = structureData?.pages && structureData?.data_model && structureData?.monetization

    if (!isComplete) {
      return (
        <Card variant="white" padding="lg" className="flex flex-col items-center gap-4 py-12">
          <span className="text-3xl opacity-30">📋</span>
          <p className="text-sm text-[#45474D]">Complète les 3 étapes pour voir le résumé produit.</p>
        </Card>
      )
    }

    return (
      <div className="flex flex-col gap-5">
        <Card variant="white" padding="lg" className="flex flex-col gap-4">
          <h3 className="text-base font-medium text-[#121317]">Résumé produit</h3>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold font-mono text-[#3279F9]">{structureData.pages?.length}</span>
              <span className="text-xs text-[#45474D]">pages</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold font-mono text-[#3279F9]">
                {structureData.features?.filter(f => f.priority === 'mvp').length}
              </span>
              <span className="text-xs text-[#45474D]">features MVP</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold font-mono text-[#3279F9]">{structureData.data_model?.length}</span>
              <span className="text-xs text-[#45474D]">entités</span>
            </div>
          </div>

          <div className="border-t border-[#E6EAF0] pt-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-[#3279F9]" />
              <span className="text-sm font-medium text-[#121317]">
                {structureData.monetization?.recommended_model === 'subscription' ? 'Abonnement' :
                 structureData.monetization?.recommended_model === 'one_time' ? 'Paiement unique' : 'Freemium'}
              </span>
              <span className="text-xs text-[#45474D]">
                — {structureData.monetization?.tiers.find(t => t.is_recommended)?.price}
              </span>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <Card variant="white" padding="md" className="flex items-center justify-between">
          <p className="text-sm text-[#45474D]">
            Structure validée. Passons au branding.
          </p>
          <Link to={`/project/${projectId}/phase/3`}>
            <Button variant="primary" size="md" className="gap-2">
              Passer au Branding
              <ArrowRight size={14} />
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stepper */}
      {renderStepper()}

      {/* Loader */}
      {generating && (
        <GenerationLoader
          currentStep={progressStep}
          onCancel={() => abortRef.current?.abort()}
          steps={PROGRESS_STEPS[SUB_STEPS[activeStep]?.key] ?? undefined}
        />
      )}

      {/* Erreur */}
      {error && (
        <Card variant="white" padding="md" className="flex flex-col gap-3">
          <p className="text-sm text-[#EF4444]">{error}</p>
          <Button variant="secondary" size="sm" onClick={() => handleGenerate(SUB_STEPS[activeStep].key)}>
            Réessayer
          </Button>
        </Card>
      )}

      {/* Contenu de la sous-étape active */}
      {!generating && !error && (
        <>
          {activeStep === 0 && renderPagesFeatures()}
          {activeStep === 1 && renderDataModel()}
          {activeStep === 2 && renderMonetization()}
          {activeStep === 3 && renderSummary()}
        </>
      )}
    </div>
  )
}

export { Phase2Structure }
export type { StructureData }
