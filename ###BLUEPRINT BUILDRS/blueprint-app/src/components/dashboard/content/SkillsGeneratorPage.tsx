import { useState, useCallback } from 'react'
import { ArrowLeft, Copy, Check, ChevronRight, ChevronLeft, Wrench, Download, RotateCcw, Loader2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

interface Props {
  navigate: (hash: string) => void
}

interface SkillValues {
  // Step 1
  skillName: string
  description: string
  instructions: string
  // Step 2
  disableModelInvocation: boolean
  hasArguments: boolean
  argumentHint: string
  scope: 'personal' | 'project'
  fork: boolean
  // Step 3
  conventions: string
  exampleOutput: string
}

const DEFAULT: SkillValues = {
  skillName: '',
  description: '',
  instructions: '',
  disableModelInvocation: true,
  hasArguments: false,
  argumentHint: '',
  scope: 'personal',
  fork: false,
  conventions: '',
  exampleOutput: '',
}

// ── Generator ──────────────────────────────────────────────────────────────

function generateSkill(v: SkillValues): string {
  let out = '---\n'
  out += `name: ${v.skillName}\n`
  out += `description: ${v.description}\n`
  if (v.disableModelInvocation) out += `disable-model-invocation: true\n`
  if (v.hasArguments && v.argumentHint.trim()) out += `argument-hint: [${v.argumentHint}]\n`
  if (v.fork) out += `context: fork\n`
  out += `allowed-tools: Read, Write, Edit, Bash, Grep, Glob\n`
  out += `---\n\n`

  if (v.instructions.trim()) {
    out += `${v.instructions.trim()}\n\n`
  }

  if (v.hasArguments) {
    out += `## Arguments\n`
    out += `Si un argument est fourni ($ARGUMENTS), utilise-le comme contexte.\n\n`
  }

  if (v.conventions.trim()) {
    out += `## Conventions du projet\n`
    out += `${v.conventions.trim()}\n\n`
  }

  if (v.exampleOutput.trim()) {
    out += `## Exemple de résultat attendu\n`
    out += `${v.exampleOutput.trim()}\n\n`
  }

  out += `## Règles\n`
  out += `- Affiche chaque étape avant de l'exécuter\n`
  out += `- En cas d'erreur, arrête et explique le problème\n`
  out += `- Demande confirmation avant toute action destructive\n`

  return out
}

function generateInstallPrompt(v: SkillValues, content: string): string {
  const path = v.scope === 'personal'
    ? `~/.claude/skills/${v.skillName}`
    : `.claude/skills/${v.skillName}`
  return `Crée-moi le fichier ${path}/SKILL.md avec le contenu suivant :\n\n${content}`
}

// ── Shared UI ──────────────────────────────────────────────────────────────

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-2">
      <p className="text-[12px] font-semibold" style={{ color: 'hsl(var(--foreground))' }}>{children}</p>
      {hint && <p className="text-[11px] mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>{hint}</p>}
    </div>
  )
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full rounded-xl px-4 py-2.5 text-[13px] outline-none transition-all"
      style={{ background: 'hsl(var(--secondary))', border: '0.5px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
  )
}

function Textarea({ value, onChange, placeholder, rows = 5 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full rounded-xl px-4 py-3 text-[12px] outline-none resize-none transition-all"
      style={{ background: 'hsl(var(--secondary))', border: '0.5px solid hsl(var(--border))', color: 'hsl(var(--foreground))', lineHeight: 1.7 }} />
  )
}

function Toggle({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <button onClick={() => onChange(!checked)}
      className="flex items-start gap-3 w-full text-left p-3.5 rounded-xl transition-all"
      style={{ background: checked ? 'rgba(34,197,94,0.08)' : 'hsl(var(--secondary))', border: `0.5px solid ${checked ? 'rgba(34,197,94,0.3)' : 'hsl(var(--secondary))'}` }}>
      <div className="flex-shrink-0 mt-0.5 w-9 h-5 rounded-full relative transition-all" style={{ background: checked ? '#22c55e' : 'hsl(var(--border))' }}>
        <div className="absolute top-0.5 w-4 h-4 rounded-full transition-all" style={{ background: '#fff', left: checked ? '18px' : '2px' }} />
      </div>
      <div>
        <p className="text-[12px] font-semibold" style={{ color: 'hsl(var(--foreground))' }}>{label}</p>
        {desc && <p className="text-[11px] mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>{desc}</p>}
      </div>
    </button>
  )
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'hsl(var(--secondary))' }}>
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(step / total) * 100}%`, background: '#22c55e' }} />
      </div>
      <span className="text-[10px] font-bold tabular-nums flex-shrink-0"
        style={{ color: 'hsl(var(--muted-foreground))', fontFamily: 'Geist Mono, monospace' }}>{step}/{total}</span>
    </div>
  )
}

// ── Steps ──────────────────────────────────────────────────────────────────

function Step1({ v, set }: { v: SkillValues; set: (k: keyof SkillValues, val: unknown) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <Label>Nom de la commande <span style={{ color: '#ef4444' }}>*</span>
          <span className="font-normal text-[11px] ml-1" style={{ color: 'hsl(var(--muted-foreground))' }}>→ sera invoqué avec /nom</span>
        </Label>
        <Input value={v.skillName} onChange={val => set('skillName', val.toLowerCase().replace(/\s+/g, '-'))} placeholder="deploy, review, landing-check, generate-invoice..." />
      </div>
      <div>
        <Label hint="Max 250 caractères — Claude utilise ça pour décider quand charger le skill automatiquement.">Description courte <span style={{ color: '#ef4444' }}>*</span></Label>
        <Input value={v.description} onChange={val => set('description', val)} placeholder="Déployer l'app en production avec vérifications de sécurité" />
        {v.description && (
          <p className="text-[10px] mt-1 tabular-nums" style={{ color: v.description.length > 250 ? '#ef4444' : 'hsl(var(--muted-foreground))' }}>
            {v.description.length}/250 caractères
          </p>
        )}
      </div>
      <div>
        <Label hint="Décris les étapes que Claude doit suivre, dans l'ordre. Un skill = une seule chose bien.">Que doit faire le skill ? <span style={{ color: '#ef4444' }}>*</span></Label>
        <Textarea value={v.instructions} onChange={val => set('instructions', val)} rows={7}
          placeholder={`Exemple pour un skill /deploy :

1. Vérifie qu'il n'y a pas d'erreurs TypeScript (pnpm tsc --noEmit)
2. Lance le build (pnpm build) et vérifie qu'il réussit
3. Crée un commit avec tous les changements en attente
4. Push sur la branche courante
5. Déploie sur Vercel (npx vercel --prod)
6. Affiche l'URL de production`} />
      </div>
      <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(34,197,94,0.06)', border: '0.5px solid rgba(34,197,94,0.2)' }}>
        <p className="text-[11px] leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Un bon skill fait <strong style={{ color: 'hsl(var(--foreground))' }}>UNE chose bien</strong>. Si ta description dépasse 5 étapes, envisage de créer 2 skills séparés.
        </p>
      </div>
    </div>
  )
}

function Step2({ v, set }: { v: SkillValues; set: (k: keyof SkillValues, val: unknown) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <Label>Qui peut lancer ce skill ?</Label>
        <div className="space-y-2">
          {[
            { value: true, label: 'Toi uniquement (recommandé)', desc: 'Le skill ne se lance que quand tu tapes /nom. Pour tout ce qui a un effet de bord (deploy, commit, envoi).' },
            { value: false, label: 'Toi et Claude automatiquement', desc: 'Claude peut aussi charger le skill quand il détecte que c\'est pertinent. Pour les conventions et les reviews.' },
          ].map(opt => (
            <button key={String(opt.value)} onClick={() => set('disableModelInvocation', opt.value)}
              className="w-full flex items-start gap-3 p-3.5 rounded-xl text-left transition-all"
              style={{ background: v.disableModelInvocation === opt.value ? 'rgba(34,197,94,0.08)' : 'hsl(var(--secondary))', border: `0.5px solid ${v.disableModelInvocation === opt.value ? 'rgba(34,197,94,0.3)' : 'hsl(var(--secondary))'}` }}>
              <div className="w-4 h-4 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center" style={{ border: `1.5px solid ${v.disableModelInvocation === opt.value ? '#22c55e' : 'hsl(var(--border))'}` }}>
                {v.disableModelInvocation === opt.value && <div className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />}
              </div>
              <div>
                <p className="text-[12px] font-semibold" style={{ color: 'hsl(var(--foreground))' }}>{opt.label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Toggle checked={v.hasArguments} onChange={val => set('hasArguments', val)}
        label="Le skill prend des arguments"
        desc="Ex : /deploy main, /fix-issue 42, /review src/app/page.tsx" />
      {v.hasArguments && (
        <div>
          <Label hint="Ex : [fichier], [branche], [numéro-issue]">Type d'argument attendu</Label>
          <Input value={v.argumentHint} onChange={val => set('argumentHint', val)} placeholder="[fichier], [branche], [numéro-issue]" />
        </div>
      )}

      <div>
        <Label>Portée du skill</Label>
        <div className="space-y-2">
          {[
            { value: 'personal', label: 'Tous tes projets', path: '~/.claude/skills/', desc: 'Commit, review, deploy — utilisable partout.' },
            { value: 'project', label: 'Ce projet uniquement', path: '.claude/skills/', desc: 'Conventions spécifiques, règles métier d\'un seul SaaS.' },
          ].map(opt => (
            <button key={opt.value} onClick={() => set('scope', opt.value as 'personal' | 'project')}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all"
              style={{ background: v.scope === opt.value ? 'rgba(34,197,94,0.08)' : 'hsl(var(--secondary))', border: `0.5px solid ${v.scope === opt.value ? 'rgba(34,197,94,0.3)' : 'hsl(var(--secondary))'}` }}>
              <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center" style={{ border: `1.5px solid ${v.scope === opt.value ? '#22c55e' : 'hsl(var(--border))'}` }}>
                {v.scope === opt.value && <div className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />}
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-semibold" style={{ color: 'hsl(var(--foreground))' }}>{opt.label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'hsl(var(--muted-foreground))' }}>{opt.desc}</p>
              </div>
              <code className="text-[10px] flex-shrink-0" style={{ fontFamily: 'Geist Mono, monospace', color: 'hsl(var(--muted-foreground))' }}>{opt.path}</code>
            </button>
          ))}
        </div>
      </div>

      <Toggle checked={v.fork} onChange={val => set('fork', val)}
        label="Exécution isolée (context: fork)"
        desc="Exécute le skill dans un subagent isolé. Recommandé pour les tâches lourdes qui consomment beaucoup de contexte." />
    </div>
  )
}

function Step3({ v, set }: { v: SkillValues; set: (k: keyof SkillValues, val: unknown) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold mb-3" style={{ color: 'hsl(var(--muted-foreground))', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Stack imposée par Buildrs</p>
        <div className="rounded-xl px-4 py-3" style={{ background: 'hsl(var(--secondary))', border: '0.5px solid hsl(var(--border))' }}>
          <p className="text-[11px]" style={{ fontFamily: 'Geist Mono, monospace', color: 'hsl(var(--muted-foreground))' }}>Next.js + TypeScript + Supabase + Stripe + Tailwind + shadcn/ui</p>
        </div>
      </div>
      <div>
        <Label hint="Conventional Commits, tests Vitest, RLS Supabase activé, Zod pour validation...">Conventions spécifiques à intégrer</Label>
        <Textarea value={v.conventions} onChange={val => set('conventions', val)} rows={4}
          placeholder={`- Conventional Commits (feat:, fix:, chore:...)\n- Tests Vitest obligatoires\n- RLS Supabase activé sur toutes les tables\n- Zod pour la validation`} />
      </div>
      <div>
        <Label hint="Claude suit mieux les instructions quand il a un exemple concret du résultat attendu.">Exemple de résultat attendu (optionnel)</Label>
        <Textarea value={v.exampleOutput} onChange={val => set('exampleOutput', val)} rows={5}
          placeholder={`Exemple de sortie attendue après exécution du skill :\n\n✓ TypeScript check — 0 erreurs\n✓ Build réussi — 1.2 MB\n✓ Commit créé : "feat: add invoice export feature"\n✓ Push → origin/main\n✓ Deploy Vercel — https://mon-saas.vercel.app`} />
      </div>
    </div>
  )
}

// ── Result view ────────────────────────────────────────────────────────────

function ResultView({ v, content, onReset }: { v: SkillValues; content: string; onReset: () => void }) {
  const [copiedMd, setCopiedMd] = useState(false)
  const [copiedInstall, setCopiedInstall] = useState(false)
  const installPrompt = generateInstallPrompt(v, content)

  const doCopyMd = useCallback(() => {
    navigator.clipboard.writeText(content)
    setCopiedMd(true)
    setTimeout(() => setCopiedMd(false), 2500)
  }, [content])

  const doCopyInstall = useCallback(() => {
    navigator.clipboard.writeText(installPrompt)
    setCopiedInstall(true)
    setTimeout(() => setCopiedInstall(false), 2500)
  }, [installPrompt])

  const doDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'SKILL.md'; a.click()
    URL.revokeObjectURL(url)
  }

  const path = v.scope === 'personal' ? `~/.claude/skills/${v.skillName}` : `.claude/skills/${v.skillName}`

  return (
    <div>
      <div className="rounded-xl px-5 py-4 mb-6 flex items-center gap-3"
        style={{ background: 'rgba(34,197,94,0.08)', border: '0.5px solid rgba(34,197,94,0.25)' }}>
        <Check size={18} strokeWidth={2} style={{ color: '#22c55e', flexShrink: 0 }} />
        <div>
          <p className="text-[13px] font-bold" style={{ color: '#22c55e' }}>Ton skill /{v.skillName} est prêt</p>
          <p className="text-[11px]" style={{ color: 'hsl(var(--muted-foreground))' }}>Installe-le avec la méthode ci-dessous.</p>
        </div>
      </div>

      {/* How to install */}
      <div className="rounded-xl px-4 py-3.5 mb-5" style={{ background: 'rgba(77,150,255,0.06)', border: '0.5px solid rgba(77,150,255,0.2)' }}>
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#4d96ff' }}>Comment installer</p>
        <p className="text-[12px] font-semibold mb-1" style={{ color: 'hsl(var(--foreground))' }}>Méthode 1 — La plus simple</p>
        <p className="text-[11.5px] mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>Copie le "prompt d'installation" et colle-le directement dans Claude Code. Il créera le fichier pour toi.</p>
        <p className="text-[12px] font-semibold mb-1" style={{ color: 'hsl(var(--foreground))' }}>Méthode 2 — Manuelle</p>
        <p className="text-[11.5px] mb-1" style={{ color: 'hsl(var(--muted-foreground))' }}>Télécharge le fichier et place-le dans :</p>
        <code className="text-[11px] block mb-3" style={{ fontFamily: 'Geist Mono, monospace', color: '#22c55e' }}>{path}/SKILL.md</code>
        <p className="text-[11px] italic" style={{ color: '#4d96ff' }}>
          Ensuite, tape /{v.skillName} dans Claude Code pour vérifier qu'il est détecté.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button onClick={doCopyInstall}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all"
          style={{ background: copiedInstall ? 'rgba(34,197,94,0.15)' : '#22c55e', color: copiedInstall ? '#22c55e' : '#000', border: `0.5px solid ${copiedInstall ? 'rgba(34,197,94,0.4)' : 'transparent'}` }}>
          {copiedInstall ? <Check size={13} strokeWidth={2} /> : <Copy size={13} strokeWidth={1.5} />}
          {copiedInstall ? 'Copié !' : 'Copier le prompt d\'installation'}
        </button>
        <button onClick={doCopyMd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all"
          style={{ background: copiedMd ? 'hsl(var(--border))' : 'hsl(var(--secondary))', border: '0.5px solid hsl(var(--border))', color: copiedMd ? '#22c55e' : 'hsl(var(--foreground))' }}>
          {copiedMd ? <Check size={13} strokeWidth={2} /> : <Copy size={13} strokeWidth={1.5} />}
          {copiedMd ? 'Copié !' : 'Copier le SKILL.md'}
        </button>
        <button onClick={doDownload}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all hover:opacity-80"
          style={{ background: 'hsl(var(--card))', border: '0.5px solid hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}>
          <Download size={13} strokeWidth={2} />Télécharger SKILL.md
        </button>
        <button onClick={onReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-medium transition-all hover:opacity-70 ml-auto"
          style={{ background: 'hsl(var(--card))', border: '0.5px solid hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}>
          <RotateCcw size={12} strokeWidth={1.5} />Nouveau skill
        </button>
      </div>

      {/* File preview */}
      <div className="relative rounded-xl overflow-hidden" style={{ background: '#0d1117', border: '1px solid #30363d' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ borderBottom: '1px solid #30363d', background: '#161b22' }}>
          <Wrench size={12} strokeWidth={1.5} style={{ color: '#22c55e' }} />
          <span className="text-[10px] font-medium" style={{ fontFamily: 'Geist Mono, monospace', color: 'hsl(var(--muted-foreground))' }}>SKILL.md — /{v.skillName}</span>
        </div>
        <pre className="px-5 py-4 overflow-x-auto text-[11.5px] leading-relaxed max-h-[400px] overflow-y-auto"
          style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', color: '#c9d1d9' }}>
          <code>{content}</code>
        </pre>
      </div>
    </div>
  )
}

const STEP_LABELS = [
  { num: 1, title: 'Décris ton skill', desc: 'Nom de la commande, ce qu\'elle fait, étapes à suivre.' },
  { num: 2, title: 'Configuration', desc: 'Invocation, arguments, portée, isolation.' },
  { num: 3, title: 'Contexte projet', desc: 'Conventions et exemple de résultat (optionnel).' },
]

// ── Main page ──────────────────────────────────────────────────────────────

export function SkillsGeneratorPage({ navigate }: Props) {
  const [step, setStep] = useState(1)
  const [values, setValues] = useState<SkillValues>({ ...DEFAULT })
  const [done, setDone] = useState(false)
  const [output, setOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [genError, setGenError] = useState('')

  const set = useCallback((k: keyof SkillValues, val: unknown) => {
    setValues(prev => ({ ...prev, [k]: val }))
  }, [])

  const canNext = (): boolean => {
    if (step === 1) return !!(values.skillName.trim() && values.description.trim() && values.instructions.trim())
    return true
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGenError('')
    try {
      const constraints = [
        values.conventions.trim(),
        values.hasArguments && values.argumentHint.trim() ? `Argument attendu : ${values.argumentHint}` : '',
        values.fork ? 'Exécution isolée (context: fork)' : '',
      ].filter(Boolean).join('\n')

      const { data, error } = await supabase.functions.invoke('claude-generators', {
        body: {
          type: 'skills',
          payload: {
            skillName:    values.skillName,
            description:  values.description,
            instructions: values.instructions,
            context:      'React + TypeScript + Supabase + Stripe + Vercel',
            examples:     values.exampleOutput || '',
            constraints,
          },
        },
      })
      if (error) throw error
      setOutput((data as { result: string }).result)
      setDone(true)
    } catch (e) {
      setGenError(e instanceof Error ? e.message : String(e))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setValues({ ...DEFAULT })
    setStep(1)
    setDone(false)
    setOutput('')
    setGenError('')
  }

  const current = STEP_LABELS[step - 1]

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">

        <button
          onClick={() => done ? setDone(false) : step > 1 ? setStep(s => s - 1) : window.history.back()}
          className="flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70" style={{ color: 'hsl(var(--muted-foreground))' }}>
          <ArrowLeft size={14} strokeWidth={1.5} />
          <span>{done ? 'Retour au générateur' : step > 1 ? 'Étape précédente' : 'Retour à Skills'}</span>
        </button>

        {!done && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-md"
                style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '0.5px solid rgba(34,197,94,0.25)' }}>Générateur</span>
            </div>
            <h1 className="text-[22px] font-extrabold mb-1.5" style={{ color: 'hsl(var(--foreground))', letterSpacing: '-0.03em' }}>
              Générateur de Skills
            </h1>
            <p className="text-[13px]" style={{ color: 'hsl(var(--muted-foreground))' }}>
              3 questions. Ton SKILL.md est généré automatiquement, prêt à installer.
            </p>
          </div>
        )}

        {done ? (
          <ResultView v={values} content={output} onReset={handleReset} />
        ) : (
          <>
            <ProgressBar step={step} total={3} />
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black tabular-nums px-2 py-0.5 rounded-md"
                  style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '0.5px solid rgba(34,197,94,0.25)', fontFamily: 'Geist Mono, monospace' }}>
                  {String(current.num).padStart(2, '0')}
                </span>
                <h2 className="text-[16px] font-extrabold" style={{ color: 'hsl(var(--foreground))', letterSpacing: '-0.02em' }}>{current.title}</h2>
              </div>
              <p className="text-[12px]" style={{ color: 'hsl(var(--muted-foreground))' }}>{current.desc}</p>
            </div>

            <div className="mb-8">
              {step === 1 && <Step1 v={values} set={set} />}
              {step === 2 && <Step2 v={values} set={set} />}
              {step === 3 && <Step3 v={values} set={set} />}
            </div>

            <div className="flex items-center gap-3">
              {step > 1 && (
                <button onClick={() => setStep(s => s - 1)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-medium transition-all hover:opacity-70"
                  style={{ background: 'hsl(var(--card))', border: '0.5px solid hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}>
                  <ChevronLeft size={14} strokeWidth={1.5} />Précédent
                </button>
              )}
              {step < 3 ? (
                <button onClick={() => canNext() && setStep(s => s + 1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold transition-all ml-auto"
                  style={{ background: canNext() ? '#22c55e' : 'hsl(var(--secondary))', color: canNext() ? '#000' : 'hsl(var(--muted-foreground))', cursor: canNext() ? 'pointer' : 'not-allowed', opacity: canNext() ? 1 : 0.5 }}>
                  Suivant<ChevronRight size={14} strokeWidth={2} />
                </button>
              ) : (
                <button onClick={handleGenerate} disabled={isGenerating}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold transition-all ml-auto hover:opacity-90 disabled:opacity-60"
                  style={{ background: '#22c55e', color: '#000' }}>
                  {isGenerating ? (
                    <><Loader2 size={14} strokeWidth={2} className="animate-spin" />Génération...</>
                  ) : (
                    <><Wrench size={14} strokeWidth={2} />Générer mon SKILL.md</>
                  )}
                </button>
              )}
            </div>
            {genError && (
              <p className="mt-3 text-[12px] rounded-xl px-4 py-3" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.2)' }}>
                {genError}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
