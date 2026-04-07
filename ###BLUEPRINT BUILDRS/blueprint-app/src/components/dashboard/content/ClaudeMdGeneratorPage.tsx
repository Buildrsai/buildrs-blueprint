import { useState, useCallback } from 'react'
import { ArrowLeft, Copy, Check, ChevronRight, ChevronLeft, FileCode, Download, RotateCcw } from 'lucide-react'

interface Props {
  navigate: (hash: string) => void
}

// ── Types ──────────────────────────────────────────────────────────────────

interface WizardValues {
  // Step 1
  projectName: string
  projectDescription: string
  targetAudience: string
  businessObjective: string
  // Step 2
  features: string
  projectExists: boolean
  folderStructure: string
  // Step 3
  authMethods: string[]
  tables: string
  rlsEnabled: boolean
  storageEnabled: boolean
  // Step 4
  monetizationType: string
  plans: string
  trialPeriod: string
  stripeWebhook: boolean
  // Step 5
  commentLanguage: string
  uiLanguage: string
  // Step 6
  filesToNeverModify: string
  businessRules: string
  otherProhibitions: string
}

const DEFAULT: WizardValues = {
  projectName: '',
  projectDescription: '',
  targetAudience: '',
  businessObjective: 'mrr',
  features: '',
  projectExists: false,
  folderStructure: '',
  authMethods: ['email'],
  tables: '',
  rlsEnabled: true,
  storageEnabled: false,
  monetizationType: 'abonnement',
  plans: '',
  trialPeriod: '14 jours',
  stripeWebhook: true,
  commentLanguage: 'fr',
  uiLanguage: 'fr',
  filesToNeverModify: 'src/components/ui/ (shadcn)\nfichiers .env',
  businessRules: '',
  otherProhibitions: '',
}

// ── Generator function ─────────────────────────────────────────────────────

function generateClaudeMd(v: WizardValues): string {
  const objLabels: Record<string, string> = {
    mrr: 'MRR récurrent',
    revente: 'Revente (flip)',
    'side-project': 'Side project',
    mvp: 'MVP de test',
  }
  const authLabel = v.authMethods.map(m => ({
    email: 'Email/password',
    google: 'Google OAuth',
    github: 'GitHub OAuth',
    'magic-link': 'Magic link',
  })[m] ?? m).join(', ')

  const monLabel: Record<string, string> = {
    abonnement: 'Abonnement récurrent',
    'one-shot': 'Paiement unique',
    freemium: 'Freemium',
    'pas-defini': 'À définir',
  }
  const langLabel: Record<string, string> = { fr: 'Français', en: 'Anglais', both: 'Français + Anglais' }

  let out = `# ${v.projectName || 'Mon SaaS'} - CLAUDE.md\n\n`

  out += `## Description\n`
  out += `${v.projectDescription || 'SaaS en cours de développement'}\n`
  out += `Cible : ${v.targetAudience || 'À préciser'}\n`
  out += `Objectif : ${objLabels[v.businessObjective] ?? v.businessObjective}\n\n`

  out += `## Stack\n`
  out += `- Next.js 14 (App Router) + TypeScript strict\n`
  out += `- Supabase (auth, database${v.storageEnabled ? ', storage' : ''})\n`
  out += `- Tailwind CSS + shadcn/ui\n`
  out += `- Stripe (${monLabel[v.monetizationType] ?? v.monetizationType})\n`
  out += `- Vercel (déploiement)\n`
  out += `- pnpm\n\n`

  out += `## Commandes\n`
  out += `- pnpm dev → lance le projet (port 3000)\n`
  out += `- pnpm build → build production\n`
  out += `- pnpm test → lance les tests (Vitest)\n`
  out += `- pnpm lint → vérifie le code\n`
  out += `- pnpm supabase db push → migrations DB\n`
  if (v.stripeWebhook) out += `- pnpm stripe:webhook → tunnel webhook local\n`
  out += `\n`

  out += `## Architecture\n`
  out += `- src/app/(auth)/ → pages authentifiées\n`
  out += `- src/app/(public)/ → pages publiques\n`
  out += `- src/components/ → composants React réutilisables\n`
  out += `- src/components/ui/ → shadcn/ui (NE PAS MODIFIER)\n`
  out += `- src/lib/supabase/ → client et requêtes Supabase\n`
  out += `- src/lib/stripe/ → helpers Stripe\n`
  out += `- src/types/ → types TypeScript\n`
  if (v.projectExists && v.folderStructure.trim()) {
    out += `\nStructure existante :\n`
    v.folderStructure.trim().split('\n').forEach(l => { out += `${l}\n` })
  }
  out += `\n`

  if (v.features.trim()) {
    out += `## Fonctionnalités\n`
    v.features.trim().split('\n').forEach(l => { out += `${l}\n` })
    out += `\n`
  }

  out += `## Base de données\n`
  out += `Auth : ${authLabel}\n`
  if (v.tables.trim()) {
    out += `Tables principales :\n`
    v.tables.trim().split('\n').forEach(l => { out += `${l}\n` })
  }
  if (v.rlsEnabled) out += `RLS activé sur TOUTES les tables\n`
  if (v.storageEnabled) out += `Storage Supabase activé\n`
  out += `\n`

  out += `## Monétisation\n`
  out += `Type : ${monLabel[v.monetizationType] ?? v.monetizationType}\n`
  if ((v.monetizationType === 'abonnement' || v.monetizationType === 'freemium') && v.plans.trim()) {
    out += `Plans :\n`
    v.plans.trim().split('\n').forEach(l => { out += `${l}\n` })
  }
  if (v.monetizationType === 'abonnement' && v.trialPeriod.trim()) {
    out += `Période d'essai : ${v.trialPeriod}\n`
  }
  out += `\n`

  out += `## Conventions\n`
  out += `- Langue des commentaires : ${langLabel[v.commentLanguage] ?? v.commentLanguage}\n`
  out += `- Langue de l'interface : ${langLabel[v.uiLanguage] ?? v.uiLanguage}\n`
  out += `- Server Components par défaut, 'use client' uniquement si nécessaire\n`
  out += `- Composants : PascalCase (ex: UserProfile.tsx)\n`
  out += `- Utilitaires : camelCase (ex: formatDate.ts)\n`
  out += `- Exports nommés uniquement (pas de default export)\n`
  out += `- Zod pour toute validation de données\n`
  out += `- Pas de any en TypeScript\n\n`

  out += `## Règles importantes\n`
  out += `- NE JAMAIS modifier : ${v.filesToNeverModify.trim() || 'src/components/ui/'}\n`
  out += `- NE JAMAIS commit les fichiers .env\n`
  out += `- Toujours utiliser les variables d'environnement via process.env\n`
  out += `- Les requêtes Supabase passent TOUJOURS par src/lib/supabase/\n`
  if (v.rlsEnabled) out += `- RLS activé sur TOUTES les tables — vérifier à chaque migration\n`
  out += `- Jamais de clé API côté client\n`
  out += `- Toujours vérifier l'auth avant les mutations\n`

  if (v.businessRules.trim()) {
    out += `\n## Règles métier\n`
    v.businessRules.trim().split('\n').forEach(l => { out += `${l}\n` })
  }

  if (v.otherProhibitions.trim()) {
    out += `\n## Interdictions\n`
    v.otherProhibitions.trim().split('\n').forEach(l => { out += `${l}\n` })
  }

  return out
}

// ── Shared UI atoms ────────────────────────────────────────────────────────

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-2">
      <p className="text-[12px] font-semibold" style={{ color: '#f0f0f5' }}>{children}</p>
      {hint && <p className="text-[11px] mt-0.5" style={{ color: '#5b6078' }}>{hint}</p>}
    </div>
  )
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl px-4 py-2.5 text-[13px] outline-none transition-all"
      style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.12)', color: '#f0f0f5' }}
    />
  )
}

function Textarea({ value, onChange, placeholder, rows = 5, mono }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; mono?: boolean }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-xl px-4 py-3 text-[12px] outline-none resize-none transition-all"
      style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.12)', color: '#f0f0f5', fontFamily: mono ? 'Geist Mono, monospace' : 'inherit', lineHeight: 1.7 }}
    />
  )
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full rounded-xl px-4 py-2.5 text-[13px] outline-none transition-all"
      style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.12)', color: '#f0f0f5' }}
    >
      {options.map(o => <option key={o.value} value={o.value} style={{ background: '#1a1b26' }}>{o.label}</option>)}
    </select>
  )
}

function Toggle({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-start gap-3 w-full text-left p-3.5 rounded-xl transition-all"
      style={{ background: checked ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.02)', border: `0.5px solid ${checked ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.07)'}` }}
    >
      <div className="flex-shrink-0 mt-0.5 w-9 h-5 rounded-full relative transition-all" style={{ background: checked ? '#8b5cf6' : 'rgba(255,255,255,0.12)' }}>
        <div className="absolute top-0.5 w-4 h-4 rounded-full transition-all" style={{ background: '#fff', left: checked ? '18px' : '2px' }} />
      </div>
      <div>
        <p className="text-[12px] font-semibold" style={{ color: '#f0f0f5' }}>{label}</p>
        {desc && <p className="text-[11px] mt-0.5" style={{ color: '#5b6078' }}>{desc}</p>}
      </div>
    </button>
  )
}

function CheckGroup({ options, selected, onChange }: { options: { value: string; label: string }[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (v: string) => {
    if (selected.includes(v)) {
      if (selected.length > 1) onChange(selected.filter(s => s !== v))
    } else {
      onChange([...selected, v])
    }
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => {
        const active = selected.includes(o.value)
        return (
          <button
            key={o.value}
            onClick={() => toggle(o.value)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
            style={{ background: active ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)', border: `0.5px solid ${active ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.1)'}`, color: active ? '#c4b5fd' : '#5b6078' }}
          >
            {active && <Check size={9} strokeWidth={2.5} />}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

function PreFilledField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
      <p className="text-[11px] w-40 flex-shrink-0" style={{ color: '#5b6078' }}>{label}</p>
      <p className="text-[11px]" style={{ color: '#9399b2', fontFamily: 'Geist Mono, monospace' }}>{value}</p>
      <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)', color: '#5b6078' }}>BUILDRS</span>
    </div>
  )
}

// ── Progress bar ───────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(step / total) * 100}%`, background: '#8b5cf6' }} />
      </div>
      <span className="text-[10px] font-bold tabular-nums flex-shrink-0" style={{ color: '#5b6078', fontFamily: 'Geist Mono, monospace' }}>{step}/{total}</span>
    </div>
  )
}

// ── Steps content ──────────────────────────────────────────────────────────

function Step1({ v, set }: { v: WizardValues; set: (k: keyof WizardValues, val: unknown) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <Label>Nom du projet <span style={{ color: '#ef4444' }}>*</span></Label>
        <Input value={v.projectName} onChange={val => set('projectName', val)} placeholder="InvoicePro, FitTracker, CoachHub..." />
      </div>
      <div>
        <Label>Description en 1 phrase <span style={{ color: '#ef4444' }}>*</span></Label>
        <Input value={v.projectDescription} onChange={val => set('projectDescription', val)} placeholder="Un SaaS de gestion de factures pour freelances" />
      </div>
      <div>
        <Label>Pour qui ? (ta cible) <span style={{ color: '#ef4444' }}>*</span></Label>
        <Input value={v.targetAudience} onChange={val => set('targetAudience', val)} placeholder="Freelances, coachs, agences, PME..." />
      </div>
      <div>
        <Label>Objectif business <span style={{ color: '#ef4444' }}>*</span></Label>
        <Select value={v.businessObjective} onChange={val => set('businessObjective', val)} options={[
          { value: 'mrr', label: 'MRR récurrent — Je garde et développe' },
          { value: 'revente', label: 'Revente (flip) — Je construis et revends' },
          { value: 'side-project', label: 'Side project — Revenus complémentaires' },
          { value: 'mvp', label: 'MVP de test — Je valide une idée' },
        ]} />
      </div>
      <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(139,92,246,0.06)', border: '0.5px solid rgba(139,92,246,0.2)' }}>
        <p className="text-[11px] leading-relaxed" style={{ color: '#9399b2' }}>
          Sois précis sur ta cible. <span style={{ color: '#f0f0f5' }}>"Un outil pour les freelances"</span> est mieux que <span style={{ color: '#f0f0f5' }}>"un outil de facturation"</span>. Claude Code adaptera son approche selon l'audience.
        </p>
      </div>
    </div>
  )
}

function Step2({ v, set }: { v: WizardValues; set: (k: keyof WizardValues, val: unknown) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <Label hint="Décris en langage simple — une feature par ligne." >Fonctionnalités principales <span style={{ color: '#ef4444' }}>*</span></Label>
        <Textarea
          value={v.features}
          onChange={val => set('features', val)}
          rows={7}
          placeholder={`- Inscription / connexion\n- Dashboard avec KPIs\n- Création et envoi de factures\n- Suivi des paiements\n- Export PDF\n- Page pricing avec 2 plans (Free et Pro)`}
        />
      </div>
      <Toggle
        checked={v.projectExists}
        onChange={val => set('projectExists', val)}
        label="Le projet existe déjà"
        desc="J'ai déjà une structure de dossiers que je veux inclure"
      />
      {v.projectExists && (
        <div>
          <Label hint="Colle ta structure de dossiers. Laisse vide pour utiliser la structure Buildrs standard.">Structure actuelle des dossiers</Label>
          <Textarea value={v.folderStructure} onChange={val => set('folderStructure', val)} rows={4} mono placeholder={`src/\n  app/\n  components/\n  lib/`} />
        </div>
      )}
    </div>
  )
}

function Step3({ v, set }: { v: WizardValues; set: (k: keyof WizardValues, val: unknown) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <Label>Méthodes d'authentification <span style={{ color: '#ef4444' }}>*</span></Label>
        <CheckGroup
          options={[
            { value: 'email', label: 'Email/password' },
            { value: 'google', label: 'Google' },
            { value: 'github', label: 'GitHub' },
            { value: 'magic-link', label: 'Magic link' },
          ]}
          selected={v.authMethods}
          onChange={val => set('authMethods', val)}
        />
      </div>
      <div>
        <Label hint="Une table par ligne. Ex: users, invoices, clients, subscriptions">Tables principales <span style={{ color: '#ef4444' }}>*</span></Label>
        <Textarea value={v.tables} onChange={val => set('tables', val)} rows={5} placeholder={`- users (profil utilisateur)\n- invoices (factures)\n- clients (clients du user)\n- subscriptions (abonnements Stripe)`} />
      </div>
      <Toggle
        checked={v.rlsEnabled}
        onChange={val => set('rlsEnabled', val)}
        label="RLS activé (recommandé)"
        desc="Chaque utilisateur ne voit que ses propres données. Toujours activé dans les projets Buildrs."
      />
      <Toggle
        checked={v.storageEnabled}
        onChange={val => set('storageEnabled', val)}
        label="Storage Supabase"
        desc="Tu stockes des fichiers ? (images, PDF, avatars...)"
      />
    </div>
  )
}

function Step4({ v, set }: { v: WizardValues; set: (k: keyof WizardValues, val: unknown) => void }) {
  const showPlans = v.monetizationType === 'abonnement' || v.monetizationType === 'freemium'
  const showTrial = v.monetizationType === 'abonnement'
  return (
    <div className="space-y-5">
      <div>
        <Label>Type de monétisation <span style={{ color: '#ef4444' }}>*</span></Label>
        <Select value={v.monetizationType} onChange={val => set('monetizationType', val)} options={[
          { value: 'abonnement', label: 'Abonnement mensuel / annuel' },
          { value: 'one-shot', label: 'Paiement unique' },
          { value: 'freemium', label: 'Freemium' },
          { value: 'pas-defini', label: 'Pas encore défini' },
        ]} />
      </div>
      {showPlans && (
        <div>
          <Label hint="Un plan par ligne. Ex: Free : 0€ — 5 factures/mois">Plans tarifaires</Label>
          <Textarea value={v.plans} onChange={val => set('plans', val)} rows={4} placeholder={`- Free : 0€ — 5 factures/mois\n- Pro : 19€/mois — illimité\n- Enterprise : 49€/mois — multi-utilisateur`} />
        </div>
      )}
      {showTrial && (
        <div>
          <Label>Période d'essai</Label>
          <Input value={v.trialPeriod} onChange={val => set('trialPeriod', val)} placeholder="14 jours" />
        </div>
      )}
      <Toggle
        checked={v.stripeWebhook}
        onChange={val => set('stripeWebhook', val)}
        label="Webhook Stripe local"
        desc="Nécessaire pour gérer les abonnements automatiquement. Ajoute la commande pnpm stripe:webhook."
      />
    </div>
  )
}

function Step5({ v, set }: { v: WizardValues; set: (k: keyof WizardValues, val: unknown) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <Label>Langue des commentaires</Label>
        <Select value={v.commentLanguage} onChange={val => set('commentLanguage', val)} options={[
          { value: 'fr', label: 'Français' },
          { value: 'en', label: 'Anglais' },
        ]} />
      </div>
      <div>
        <Label>Langue de l'interface utilisateur</Label>
        <Select value={v.uiLanguage} onChange={val => set('uiLanguage', val)} options={[
          { value: 'fr', label: 'Français' },
          { value: 'en', label: 'Anglais' },
          { value: 'both', label: 'Français + Anglais (bilangue)' },
        ]} />
      </div>
      <div>
        <p className="text-[11px] font-semibold mb-3" style={{ color: '#5b6078', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Conventions imposées par la stack Buildrs</p>
        <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
          <PreFilledField label="Framework" value="Next.js 14 (App Router)" />
          <PreFilledField label="Style CSS" value="Tailwind CSS + shadcn/ui" />
          <PreFilledField label="Composants" value="PascalCase (UserProfile.tsx)" />
          <PreFilledField label="Utilitaires" value="camelCase (formatDate.ts)" />
          <PreFilledField label="Exports" value="Nommés uniquement" />
          <PreFilledField label="Rendering" value="Server Components par défaut" />
        </div>
      </div>
    </div>
  )
}

function Step6({ v, set }: { v: WizardValues; set: (k: keyof WizardValues, val: unknown) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <Label hint="Pré-rempli avec les fichiers Buildrs. Ajoute les tiens.">Fichiers à ne jamais modifier</Label>
        <Textarea value={v.filesToNeverModify} onChange={val => set('filesToNeverModify', val)} rows={3} mono placeholder={`src/components/ui/ (shadcn)\nfichiers .env`} />
      </div>
      <div>
        <Label hint="Ex: Un user ne peut pas voir les données d'un autre. Les factures envoyées ne peuvent plus être modifiées.">Règles métier spécifiques</Label>
        <Textarea value={v.businessRules} onChange={val => set('businessRules', val)} rows={4} placeholder={`- Un user ne peut pas voir les données d'un autre user\n- Les factures envoyées ne peuvent plus être modifiées\n- Le plan Free est limité à 5 factures par mois`} />
      </div>
      <div>
        <Label hint="Patterns, approches ou raccourcis interdits dans ce projet.">Autres interdictions</Label>
        <Textarea value={v.otherProhibitions} onChange={val => set('otherProhibitions', val)} rows={3} placeholder={`- Pas de console.log en production\n- Pas de requêtes Supabase en dehors de src/lib/supabase/`} />
      </div>
    </div>
  )
}

// ── Result view ────────────────────────────────────────────────────────────

function ResultView({ content, onReset, navigate }: { content: string; onReset: () => void; navigate: (h: string) => void }) {
  const [copied, setCopied] = useState(false)

  const doCopy = useCallback(() => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }, [content])

  const doDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'CLAUDE.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Success banner */}
      <div className="rounded-xl px-5 py-4 mb-6 flex items-center gap-3" style={{ background: 'rgba(34,197,94,0.08)', border: '0.5px solid rgba(34,197,94,0.25)' }}>
        <Check size={18} strokeWidth={2} style={{ color: '#22c55e', flexShrink: 0 }} />
        <div>
          <p className="text-[13px] font-bold" style={{ color: '#22c55e' }}>Ton CLAUDE.md est prêt</p>
          <p className="text-[11px]" style={{ color: '#5b6078' }}>Copie-le et colle-le à la racine de ton projet.</p>
        </div>
      </div>

      {/* How to use */}
      <div className="rounded-xl px-4 py-3.5 mb-5" style={{ background: 'rgba(77,150,255,0.06)', border: '0.5px solid rgba(77,150,255,0.2)' }}>
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#4d96ff' }}>Comment l'utiliser</p>
        <div className="space-y-1">
          {[
            '1. Copie le contenu ou télécharge le fichier',
            '2. Place-le à la racine de ton projet (à côté de package.json)',
            '3. Lance Claude Code avec `claude` dans ton terminal',
            '4. Claude Code le lira automatiquement à chaque session',
          ].map(s => <p key={s} className="text-[11.5px]" style={{ color: '#9399b2' }}>{s}</p>)}
        </div>
        <p className="text-[11px] mt-2.5 italic" style={{ color: '#4d96ff' }}>
          Tu peux aussi taper /init dans Claude Code pour compléter ce fichier avec des détails que Claude découvrira en analysant ton code.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={doCopy}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all"
          style={{ background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.07)', border: `0.5px solid ${copied ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.12)'}`, color: copied ? '#22c55e' : '#f0f0f5' }}
        >
          {copied ? <Check size={13} strokeWidth={2} /> : <Copy size={13} strokeWidth={1.5} />}
          {copied ? 'Copié !' : 'Copier'}
        </button>
        <button
          onClick={doDownload}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all hover:opacity-80"
          style={{ background: '#8b5cf6', color: '#fff' }}
        >
          <Download size={13} strokeWidth={2} />
          Télécharger CLAUDE.md
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-medium transition-all hover:opacity-70 ml-auto"
          style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', color: '#5b6078' }}
        >
          <RotateCcw size={12} strokeWidth={1.5} />
          Recommencer
        </button>
      </div>

      {/* File content */}
      <div className="relative rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.09)' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <FileCode size={12} strokeWidth={1.5} style={{ color: '#8b5cf6' }} />
          <span className="text-[10px] font-medium" style={{ fontFamily: 'Geist Mono, monospace', color: '#5b6078' }}>CLAUDE.md</span>
        </div>
        <pre className="px-5 py-4 overflow-x-auto text-[11.5px] leading-relaxed max-h-[480px] overflow-y-auto" style={{ fontFamily: 'Geist Mono, ui-monospace, monospace', color: '#c9d1d9' }}>
          <code>{content}</code>
        </pre>
      </div>

      {/* Next CTA */}
      <button
        onClick={() => navigate('#/dashboard/claude-os/apprendre/skills')}
        className="flex items-center gap-2 mt-6 text-[12px] transition-opacity hover:opacity-70"
        style={{ color: '#8b5cf6' }}
      >
        <ChevronRight size={13} strokeWidth={2} />
        Continue avec le module Skills
      </button>
    </div>
  )
}

// ── Step config ────────────────────────────────────────────────────────────

const STEP_LABELS = [
  { num: 1, title: 'Ton projet', desc: 'Nom, description, cible et objectif business.' },
  { num: 2, title: 'Fonctionnalités', desc: 'Ce que fait ton SaaS, page par page.' },
  { num: 3, title: 'Backend', desc: 'Auth, tables Supabase, RLS, storage.' },
  { num: 4, title: 'Monétisation', desc: 'Comment tu gagnes de l\'argent.' },
  { num: 5, title: 'Conventions', desc: 'Langue et préférences de code.' },
  { num: 6, title: 'Garde-fous', desc: 'Règles à ne jamais enfreindre.' },
]

// ── Main page ──────────────────────────────────────────────────────────────

export function ClaudeMdGeneratorPage({ navigate }: Props) {
  const [step, setStep] = useState(1)
  const [values, setValues] = useState<WizardValues>({ ...DEFAULT })
  const [done, setDone] = useState(false)
  const [output, setOutput] = useState('')

  const set = useCallback((k: keyof WizardValues, val: unknown) => {
    setValues(prev => ({ ...prev, [k]: val }))
  }, [])

  const canNext = (): boolean => {
    if (step === 1) return !!(values.projectName.trim() && values.projectDescription.trim() && values.targetAudience.trim())
    if (step === 2) return !!values.features.trim()
    if (step === 3) return !!(values.authMethods.length && values.tables.trim())
    return true
  }

  const handleGenerate = () => {
    setOutput(generateClaudeMd(values))
    setDone(true)
  }

  const handleReset = () => {
    setValues({ ...DEFAULT })
    setStep(1)
    setDone(false)
    setOutput('')
  }

  const current = STEP_LABELS[step - 1]

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Back */}
        <button
          onClick={() => done ? setDone(false) : step > 1 ? setStep(s => s - 1) : window.history.back()}
          className="flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: '#9399b2' }}
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          <span>{done ? 'Retour au générateur' : step > 1 ? 'Étape précédente' : 'Retour à CLAUDE.md'}</span>
        </button>

        {/* Header */}
        {!done && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-md" style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6', border: '0.5px solid rgba(139,92,246,0.25)' }}>
                Générateur
              </span>
            </div>
            <h1 className="text-[22px] font-extrabold mb-1.5" style={{ color: '#f0f0f5', letterSpacing: '-0.03em' }}>
              Générateur CLAUDE.md
            </h1>
            <p className="text-[13px]" style={{ color: '#5b6078' }}>
              Réponds aux 6 questions. Ton CLAUDE.md est généré automatiquement.
            </p>
          </div>
        )}

        {done ? (
          <ResultView content={output} onReset={handleReset} navigate={navigate} />
        ) : (
          <>
            <ProgressBar step={step} total={6} />

            {/* Step header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black tabular-nums px-2 py-0.5 rounded-md" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: '0.5px solid rgba(139,92,246,0.25)', fontFamily: 'Geist Mono, monospace' }}>
                  {String(current.num).padStart(2, '0')}
                </span>
                <h2 className="text-[16px] font-extrabold" style={{ color: '#f0f0f5', letterSpacing: '-0.02em' }}>{current.title}</h2>
              </div>
              <p className="text-[12px]" style={{ color: '#5b6078' }}>{current.desc}</p>
            </div>

            {/* Step content */}
            <div className="mb-8">
              {step === 1 && <Step1 v={values} set={set} />}
              {step === 2 && <Step2 v={values} set={set} />}
              {step === 3 && <Step3 v={values} set={set} />}
              {step === 4 && <Step4 v={values} set={set} />}
              {step === 5 && <Step5 v={values} set={set} />}
              {step === 6 && <Step6 v={values} set={set} />}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3">
              {step > 1 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-medium transition-all hover:opacity-70"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', color: '#9399b2' }}
                >
                  <ChevronLeft size={14} strokeWidth={1.5} />
                  Précédent
                </button>
              )}
              {step < 6 ? (
                <button
                  onClick={() => canNext() && setStep(s => s + 1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold transition-all ml-auto"
                  style={{ background: canNext() ? '#8b5cf6' : 'rgba(255,255,255,0.05)', color: canNext() ? '#fff' : '#5b6078', cursor: canNext() ? 'pointer' : 'not-allowed', opacity: canNext() ? 1 : 0.5 }}
                >
                  Suivant
                  <ChevronRight size={14} strokeWidth={2} />
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold transition-all ml-auto hover:opacity-90"
                  style={{ background: '#8b5cf6', color: '#fff' }}
                >
                  <FileCode size={14} strokeWidth={2} />
                  Générer mon CLAUDE.md
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
