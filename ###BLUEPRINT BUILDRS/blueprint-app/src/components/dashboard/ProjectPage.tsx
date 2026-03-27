import { useState, useEffect, useRef } from 'react'
import { FolderOpen, Lightbulb, Copy, Compass, TrendingUp, RefreshCw, Briefcase, Sprout, Wrench, Rocket, Hammer, Zap, Upload, Palette } from 'lucide-react'
import { supabase } from '../../lib/supabase'

// ── Onboarding data ───────────────────────────────────────────────────────
interface OnboardingData {
  strategie: 'problem' | 'copy' | 'discover' | null
  objectif: 'mrr' | 'flip' | 'client' | null
  niveau: 'beginner' | 'tools' | 'launched' | null
}

const STRATEGIE_LABELS: Record<string, { label: string; desc: string; accent: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }> = {
  problem:  { label: "J'ai un problème à résoudre",         desc: 'Créer sa propre solution',          accent: '#4d96ff', Icon: Lightbulb },
  copy:     { label: 'Copier un SaaS qui marche',           desc: 'Adapter au marché français',        accent: '#cc5de8', Icon: Copy },
  discover: { label: 'Découvrir les opportunités',          desc: 'Partir de zéro avec les outils IA', accent: '#22c55e', Icon: Compass },
}

const OBJECTIF_LABELS: Record<string, { label: string; desc: string; accent: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }> = {
  mrr:    { label: 'MRR — Revenus récurrents', desc: 'Garder et développer le produit',    accent: '#22c55e', Icon: TrendingUp },
  flip:   { label: 'Flip — Construire et revendre', desc: 'Revendre sur Flippa / Acquire', accent: '#eab308', Icon: RefreshCw },
  client: { label: 'Commande client',          desc: '2 000–10 000€ par projet',           accent: '#4d96ff', Icon: Briefcase },
}

const NIVEAU_LABELS: Record<string, { label: string; desc: string; accent: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }> = {
  beginner: { label: 'Complet débutant',              desc: "Jamais utilisé d'outils IA",   accent: '#cc5de8', Icon: Sprout },
  tools:    { label: "J'ai déjà touché à des outils", desc: 'ChatGPT, no-code, etc.',       accent: '#4d96ff', Icon: Wrench },
  launched: { label: "J'ai déjà lancé un projet",     desc: "Déjà sorti quelque chose",    accent: '#22c55e', Icon: Rocket },
}

// ── Project data ──────────────────────────────────────────────────────────
export interface ProjectData {
  name: string
  problem: string
  target: string
  price: string
  feature: string
  status: 'idea' | 'building' | 'live'
  // Branding
  logo_url: string
  brand_color_1: string
  brand_color_2: string
  brand_color_3: string
  brand_color_4: string
  brand_phrase: string
}

const EMPTY_PROJECT: ProjectData = {
  name: '',
  problem: '',
  target: '',
  price: '',
  feature: '',
  status: 'idea',
  logo_url: '',
  brand_color_1: '#4d96ff',
  brand_color_2: '#cc5de8',
  brand_color_3: '#22c55e',
  brand_color_4: '#ff6b6b',
  brand_phrase: '',
}

const STATUS_OPTIONS: {
  value: ProjectData['status']
  label: string
  color: string
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
}[] = [
  { value: 'idea',     label: 'Idée',            color: '#eab308', Icon: Lightbulb },
  { value: 'building', label: 'En construction', color: '#4d96ff', Icon: Hammer },
  { value: 'live',     label: 'Live',            color: '#22c55e', Icon: Zap },
]

// ── Editable field — auto-save on blur ────────────────────────────────────
function EditableField({
  label, value, placeholder, onSave, multiline = false,
}: {
  label: string
  value: string
  placeholder: string
  onSave: (v: string) => void
  multiline?: boolean
}) {
  const [draft, setDraft] = useState(value)

  useEffect(() => { setDraft(value) }, [value])

  const handleBlur = () => {
    if (draft.trim() !== value) onSave(draft.trim())
  }

  const cls = "w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"

  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={handleBlur}
          rows={3}
          className={`${cls} resize-none`}
          placeholder={placeholder}
        />
      ) : (
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur() }}
          className={cls}
          placeholder={placeholder}
        />
      )}
    </div>
  )
}

// ── Color swatch — local state, save on blur only ─────────────────────────
function ColorSwatch({
  colorKey, value, label, onSave,
}: {
  colorKey: string
  value: string
  label: string
  onSave: (v: string) => void
}) {
  const [draft, setDraft] = useState(value)
  useEffect(() => { setDraft(value) }, [value])
  return (
    <div className="flex flex-col items-center gap-1">
      <label className="relative cursor-pointer group">
        <div
          className="w-10 h-10 rounded-xl border-2 border-border group-hover:border-foreground/30 transition-colors shadow-sm"
          style={{ background: draft }}
        />
        <input
          type="color"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={() => { if (draft !== value) onSave(draft) }}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </label>
      <span className="text-[9px] font-mono text-muted-foreground">{draft}</span>
      <span className="text-[9px] text-muted-foreground">{label}</span>
    </div>
  )
}

// ── Context pill (onboarding) ─────────────────────────────────────────────
function ContextPill({
  item,
}: {
  item: { label: string; desc: string; accent: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }
}) {
  const { label, desc, accent, Icon } = item
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3 border"
      style={{ borderColor: `${accent}30`, background: `${accent}08` }}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${accent}20` }}>
        <Icon size={14} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">{desc}</p>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────
interface Props {
  navigate: (hash: string) => void
  userId: string | undefined
}

export function ProjectPage({ navigate: _navigate, userId }: Props) {
  const [project, setProject] = useState<ProjectData>(EMPTY_PROJECT)
  const [onboarding, setOnboarding] = useState<OnboardingData>({ strategie: null, objectif: null, niveau: null })
  const [loading, setLoading] = useState(true)
  const [logoUploading, setLogoUploading] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const rowExists = useRef(false)

  useEffect(() => {
    if (!userId) { setLoading(false); return }

    Promise.all([
      supabase.from('projects').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('onboarding').select('strategie, objectif, niveau').eq('user_id', userId).maybeSingle(),
    ]).then(async ([projectRes, onboardingRes]) => {
      if (projectRes.data) {
        rowExists.current = true
        setProject({
          name: projectRes.data.name ?? '',
          problem: projectRes.data.problem ?? '',
          target: projectRes.data.target ?? '',
          price: projectRes.data.price ?? '',
          feature: projectRes.data.feature ?? '',
          status: projectRes.data.status ?? 'idea',
          logo_url: projectRes.data.logo_url ?? '',
          brand_color_1: projectRes.data.brand_color_1 ?? '#4d96ff',
          brand_color_2: projectRes.data.brand_color_2 ?? '#cc5de8',
          brand_color_3: projectRes.data.brand_color_3 ?? '#22c55e',
          brand_color_4: projectRes.data.brand_color_4 ?? '#ff6b6b',
          brand_phrase: projectRes.data.brand_phrase ?? '',
        })
      } else {
        // First visit — create the row so UPDATE always works afterwards
        await supabase.from('projects').insert({ user_id: userId, ...EMPTY_PROJECT })
        rowExists.current = true
      }
      if (onboardingRes.data) {
        setOnboarding({
          strategie: onboardingRes.data.strategie ?? null,
          objectif: onboardingRes.data.objectif ?? null,
          niveau: onboardingRes.data.niveau ?? null,
        })
      }
      setLoading(false)
    })
  }, [userId])

  const updateField = async <K extends keyof ProjectData>(key: K, value: ProjectData[K]) => {
    if (!userId) return
    const updated = { ...project, [key]: value }
    setProject(updated)
    const { error } = await supabase
      .from('projects')
      .update({ [key]: value, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
    if (error) {
      console.error('[ProjectPage] updateField error:', error.message)
      setProject(prev => ({ ...prev, [key]: project[key] }))
    }
  }

  const uploadLogo = async (file: File) => {
    if (!userId) return
    setLogoUploading(true)
    const ext = file.name.split('.').pop()
    // Use timestamp to avoid upsert/DELETE policy issues
    const path = `${userId}/logo-${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('project-assets')
      .upload(path, file)
    if (uploadError) {
      console.error('[ProjectPage] logo upload error:', uploadError.message)
      setLogoUploading(false)
      return
    }
    const { data: { publicUrl } } = supabase.storage.from('project-assets').getPublicUrl(path)
    await updateField('logo_url', publicUrl)
    setLogoUploading(false)
  }

  const hasProjectStarted = !!(project.name || project.problem || project.target)

  if (loading) {
    return (
      <div className="p-7 max-w-3xl">
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-8 w-48 bg-secondary rounded-lg" />
          <div className="h-4 w-64 bg-secondary rounded-lg" />
          <div className="h-40 bg-secondary rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-7 max-w-3xl">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <FolderOpen size={16} strokeWidth={1.5} className="text-muted-foreground" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Mes Projets</p>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
          {project.name || 'Ton projet'}
        </h1>
        {project.problem && (
          <p className="text-sm text-muted-foreground mt-1 italic">"{project.problem}"</p>
        )}
      </div>

      {/* Statut */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Statut</p>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map(opt => {
            const active = project.status === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => updateField('status', opt.value)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
                style={{
                  borderColor: active ? opt.color : 'hsl(var(--border))',
                  background: active ? `${opt.color}15` : 'transparent',
                  color: active ? opt.color : 'hsl(var(--muted-foreground))',
                }}
              >
                <opt.Icon size={11} strokeWidth={1.5} />
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Infos produit */}
      <div className="border border-border rounded-xl p-5 mb-8 flex flex-col gap-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground -mb-1">Infos produit</p>

        <EditableField
          label="Nom du produit"
          value={project.name}
          placeholder="ex: InvoiceAI, CalTrack Pro..."
          onSave={v => updateField('name', v)}
        />

        <EditableField
          label="Problème résolu (1 phrase)"
          value={project.problem}
          placeholder="ex: Les freelances perdent du temps à facturer leurs clients"
          onSave={v => updateField('problem', v)}
          multiline
        />

        <div className="grid grid-cols-2 gap-5">
          <EditableField
            label="Cible"
            value={project.target}
            placeholder="ex: Freelances dev, PME RH..."
            onSave={v => updateField('target', v)}
          />
          <EditableField
            label="Prix mensuel"
            value={project.price}
            placeholder="ex: 29€/mois"
            onSave={v => updateField('price', v)}
          />
        </div>

        <EditableField
          label="Feature principale"
          value={project.feature}
          placeholder="ex: Génération de factures PDF en 1 clic avec IA"
          onSave={v => updateField('feature', v)}
          multiline
        />
      </div>

      {/* Branding */}
      <div className="border border-border rounded-xl p-5 mb-8 flex flex-col gap-5">
        <div className="flex items-center gap-2 -mb-1">
          <Palette size={13} strokeWidth={1.5} className="text-muted-foreground" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Identité visuelle</p>
        </div>

        {/* Logo */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Logo</p>
          <div className="flex items-center gap-3">
            <div
              className="w-16 h-16 rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer hover:border-foreground/30 transition-colors"
              onClick={() => logoInputRef.current?.click()}
            >
              {project.logo_url
                ? <img src={project.logo_url} alt="Logo" className="w-full h-full object-contain p-1" />
                : (logoUploading
                    ? <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                    : <Upload size={16} strokeWidth={1.5} className="text-muted-foreground" />
                  )
              }
            </div>
            <div>
              <button
                onClick={() => logoInputRef.current?.click()}
                className="text-[11px] font-semibold border border-border rounded-lg px-3 py-1.5 hover:bg-secondary transition-colors"
                disabled={logoUploading}
              >
                {logoUploading ? 'Envoi...' : project.logo_url ? 'Changer le logo' : 'Uploader un logo'}
              </button>
              <p className="text-[10px] text-muted-foreground mt-1">PNG, SVG ou JPG — max 2 Mo</p>
            </div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) uploadLogo(f) }}
            />
          </div>
        </div>

        {/* Brand colors */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Palette de couleurs</p>
          <div className="flex items-center gap-3 flex-wrap">
            {(['brand_color_1', 'brand_color_2', 'brand_color_3', 'brand_color_4'] as const).map((key, i) => (
              <ColorSwatch
                key={key}
                colorKey={key}
                value={project[key]}
                label={`C${i + 1}`}
                onSave={v => updateField(key, v)}
              />
            ))}
            <div
              className="w-36 h-10 rounded-xl border border-border shadow-sm flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${project.brand_color_1}, ${project.brand_color_2}, ${project.brand_color_3}, ${project.brand_color_4})` }}
              title="Aperçu du dégradé"
            />
          </div>
        </div>

        {/* Brand phrase */}
        <EditableField
          label="Phrase de marque"
          value={project.brand_phrase}
          placeholder='ex: "Le raccourci des solopreneurs ambitieux"'
          onSave={v => updateField('brand_phrase', v)}
          multiline
        />
      </div>

      {/* Contexte onboarding */}
      <div className="flex flex-col gap-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ton contexte de départ</p>

        {onboarding.strategie && STRATEGIE_LABELS[onboarding.strategie] && (
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">Stratégie</p>
            <ContextPill item={STRATEGIE_LABELS[onboarding.strategie]} />
          </div>
        )}

        {onboarding.objectif && OBJECTIF_LABELS[onboarding.objectif] && (
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">Objectif</p>
            <ContextPill item={OBJECTIF_LABELS[onboarding.objectif]} />
          </div>
        )}

        {onboarding.niveau && NIVEAU_LABELS[onboarding.niveau] && (
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">Niveau</p>
            <ContextPill item={NIVEAU_LABELS[onboarding.niveau]} />
          </div>
        )}

        {!onboarding.strategie && !onboarding.objectif && !onboarding.niveau && (
          <p className="text-sm text-muted-foreground italic">Aucun contexte d'onboarding disponible.</p>
        )}
      </div>

      {/* Empty state hint */}
      {!hasProjectStarted && (
        <div className="mt-8 border border-dashed border-border rounded-xl p-5 text-center">
          <p className="text-sm font-medium text-foreground mb-1">Tu n'as pas encore défini ton projet</p>
          <p className="text-xs text-muted-foreground">
            Clique sur les champs ci-dessus pour les remplir. Commence par le nom du produit.
          </p>
        </div>
      )}
    </div>
  )
}

