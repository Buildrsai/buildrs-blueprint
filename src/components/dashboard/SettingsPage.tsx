import { useState, useEffect } from 'react'
import { Settings, Lock, Check, AlertCircle, ChevronDown } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { BuildrsProfile } from '../../hooks/useProfile'
import { BuilderAvatar, type BuilderLevel } from '../ui/BuilderAvatar'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Props {
  user: SupabaseUser | null
  profile: BuildrsProfile | null
  updateProfile?: (updates: Partial<Omit<BuildrsProfile, 'user_id' | 'created_at' | 'updated_at'>>) => Promise<void>
  navigate?: (hash: string) => void
}

// ── Select helper ─────────────────────────────────────────────────────────────
function Select<T extends string>({
  label, value, onChange, options,
}: {
  label: string
  value: T | null
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
        {label}
      </label>
      <div className="relative">
        <select
          value={value ?? ''}
          onChange={e => onChange(e.target.value as T)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-foreground/20 pr-8"
        >
          <option value="" disabled>Choisir...</option>
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={13} strokeWidth={1.5} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  )
}

// ── Msg helper ────────────────────────────────────────────────────────────────
function Msg({ msg }: { msg: { type: 'success' | 'error'; text: string } }) {
  return (
    <div
      className="flex items-center gap-2 text-xs rounded-lg px-3 py-2 mb-3"
      style={{
        background: msg.type === 'success' ? '#22c55e15' : '#ef444415',
        color:      msg.type === 'success' ? '#22c55e'   : '#ef4444',
        border:    `1px solid ${msg.type === 'success' ? '#22c55e30' : '#ef444430'}`,
      }}
    >
      {msg.type === 'success'
        ? <Check size={12} strokeWidth={2} />
        : <AlertCircle size={12} strokeWidth={1.5} />
      }
      {msg.text}
    </div>
  )
}

// ── Level labels ──────────────────────────────────────────────────────────────
const LEVEL_LABELS: Record<string, string> = {
  explorer: 'Explorer',
  builder:  'Builder',
  launcher: 'Launcher',
  scaler:   'Scaler',
}

// ── Main component ────────────────────────────────────────────────────────────
export function SettingsPage({ user, profile, updateProfile, navigate }: Props) {
  // Profile fields
  const [displayName,  setDisplayName]  = useState('')
  const [projectIdea,  setProjectIdea]  = useState('')
  const [stage,        setStage]        = useState<BuildrsProfile['stage']>(null)
  const [goal,         setGoal]         = useState<BuildrsProfile['goal']>(null)
  const [techLevel,    setTechLevel]    = useState<BuildrsProfile['tech_level']>(null)
  // Onboarding field not in profile
  const [strategie,    setStrategie]    = useState<'problem' | 'copy' | 'discover' | null>(null)

  // Password
  const [newPassword,  setNewPassword]  = useState('')
  const [confirmPwd,   setConfirmPwd]   = useState('')

  // Status
  const [savingProfile,  setSavingProfile]  = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [profileMsg,     setProfileMsg]     = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [passwordMsg,    setPasswordMsg]    = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Init from profile + load onboarding strategie
  useEffect(() => {
    if (!profile) return
    setDisplayName(profile.display_name ?? '')
    setProjectIdea(profile.project_idea ?? '')
    setStage(profile.stage ?? null)
    setGoal(profile.goal ?? null)
    setTechLevel(profile.tech_level ?? null)
  }, [profile?.user_id])

  useEffect(() => {
    if (!user) return
    supabase
      .from('onboarding')
      .select('strategie')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => { if (data?.strategie) setStrategie(data.strategie as any) })
  }, [user?.id])

  const saveProfile = async () => {
    if (!user) return
    setSavingProfile(true)
    setProfileMsg(null)

    // 1. Via hook (met à jour l'état local immédiatement → header + accueil se rafraîchissent)
    const profileUpdates = {
      display_name: displayName.trim() || null,
      project_idea: projectIdea.trim() || null,
      stage,
      goal,
      tech_level: techLevel,
    }

    let profileErr: string | null = null
    if (updateProfile) {
      try { await updateProfile(profileUpdates) }
      catch (e: any) { profileErr = e?.message ?? 'Erreur profil.' }
    } else {
      // fallback direct upsert
      const { error } = await supabase
        .from('user_profiles_buildrs')
        .upsert({ user_id: user.id, ...profileUpdates, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
      if (error) profileErr = error.message
    }

    // 2. Sync onboarding table (strategie)
    const { error: obErr } = await supabase
      .from('onboarding')
      .upsert({ user_id: user.id, strategie, objectif: goal, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })

    setSavingProfile(false)

    if (profileErr || obErr) {
      setProfileMsg({ type: 'error', text: profileErr ?? obErr?.message ?? 'Erreur de sauvegarde.' })
    } else {
      setProfileMsg({ type: 'success', text: 'Profil mis à jour.' })
      setTimeout(() => setProfileMsg(null), 3000)
    }
  }

  const savePassword = async () => {
    if (newPassword !== confirmPwd) {
      setPasswordMsg({ type: 'error', text: 'Les mots de passe ne correspondent pas.' })
      return
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'Minimum 8 caractères requis.' })
      return
    }
    setSavingPassword(true)
    setPasswordMsg(null)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setSavingPassword(false)
    if (error) {
      setPasswordMsg({ type: 'error', text: error.message })
    } else {
      setPasswordMsg({ type: 'success', text: 'Mot de passe mis à jour.' })
      setNewPassword('')
      setConfirmPwd('')
      setTimeout(() => setPasswordMsg(null), 3000)
    }
  }

  if (!user) return (
    <div className="p-7 max-w-lg">
      <p className="text-sm text-muted-foreground">Connecte-toi pour accéder aux paramètres.</p>
    </div>
  )

  const level   = (profile?.level ?? 'explorer') as BuilderLevel
  const xp      = profile?.xp_points ?? 0
  const levelLabel = LEVEL_LABELS[level] ?? level

  return (
    <div className="p-7 max-w-lg">

      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <Settings size={16} strokeWidth={1.5} className="text-muted-foreground" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Paramètres</p>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
          Mon compte
        </h1>
      </div>

      {/* ── Profil ── */}
      <div className="border border-border rounded-xl p-5 mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-5">Profil</p>

        {/* Avatar (fixed by level) */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-shrink-0">
            <BuilderAvatar level={level} size={56} />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              {displayName || user.email?.split('@')[0] || 'Builder'}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                style={{
                  background: level === 'scaler' ? '#eab30820' : level === 'launcher' ? '#cc5de820' : level === 'builder' ? '#22c55e20' : '#4d96ff20',
                  color:      level === 'scaler' ? '#eab308'   : level === 'launcher' ? '#cc5de8'   : level === 'builder' ? '#22c55e'   : '#4d96ff',
                }}
              >
                {levelLabel}
              </span>
              <span className="text-[10px] text-muted-foreground/50">{xp} XP</span>
            </div>
            <p className="text-[10px] text-muted-foreground/50 mt-1">
              Ton avatar évolue automatiquement avec ton niveau.
            </p>
          </div>
        </div>

        {/* Pseudo */}
        <div className="mb-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
            Pseudo
          </label>
          <input
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="Ton pseudo dans la communauté"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>

        {/* Email (read-only) */}
        <div className="mb-5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
            Email
          </label>
          <input
            value={user.email ?? ''}
            readOnly
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-secondary text-muted-foreground cursor-not-allowed"
          />
        </div>

        {/* Project idea */}
        <div className="mb-5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
            Mon projet / idée
          </label>
          <input
            value={projectIdea}
            onChange={e => setProjectIdea(e.target.value)}
            placeholder="Ex : Un SaaS pour automatiser les devis freelance"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>

        {profileMsg && <Msg msg={profileMsg} />}

        <button
          onClick={saveProfile}
          disabled={savingProfile}
          className="flex items-center gap-1.5 text-[11px] font-semibold bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {savingProfile
            ? <><div className="w-3 h-3 border-2 border-background border-t-transparent rounded-full animate-spin" /> Sauvegarde...</>
            : <><Check size={11} strokeWidth={2} /> Sauvegarder le profil</>
          }
        </button>
      </div>

      {/* ── Préférences onboarding ── */}
      <div className="border border-border rounded-xl p-5 mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-5">Mon parcours</p>

        <div className="flex flex-col gap-4">
          <Select
            label="Stade actuel"
            value={stage}
            onChange={v => setStage(v as BuildrsProfile['stage'])}
            options={[
              { value: 'idea',      label: "À l'idée" },
              { value: 'exploring', label: 'En exploration' },
              { value: 'building',  label: 'En construction' },
              { value: 'launched',  label: 'Lancé' },
              { value: 'scaling',   label: 'En scaling' },
            ]}
          />

          <Select
            label="Objectif de monétisation"
            value={goal}
            onChange={v => setGoal(v as BuildrsProfile['goal'])}
            options={[
              { value: 'mrr',    label: 'Revenus récurrents (MRR)' },
              { value: 'flip',   label: 'Revente (Flip)' },
              { value: 'client', label: 'Commande client' },
            ]}
          />

          <Select
            label="Stratégie de départ"
            value={strategie}
            onChange={v => setStrategie(v as any)}
            options={[
              { value: 'problem',  label: "Résoudre un problème" },
              { value: 'copy',     label: 'Copier et adapter' },
              { value: 'discover', label: "Découvrir des opportunités" },
            ]}
          />

          <Select
            label="Niveau technique"
            value={techLevel}
            onChange={v => setTechLevel(v as BuildrsProfile['tech_level'])}
            options={[
              { value: 'zero',     label: 'Complet débutant' },
              { value: 'basic',    label: "J'ai déjà touché aux outils IA" },
              { value: 'advanced', label: "J'ai déjà lancé un projet" },
            ]}
          />
        </div>

        <div className="mt-5">
          {profileMsg && <Msg msg={profileMsg} />}
          <button
            onClick={saveProfile}
            disabled={savingProfile}
            className="flex items-center gap-1.5 text-[11px] font-semibold bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {savingProfile
              ? <><div className="w-3 h-3 border-2 border-background border-t-transparent rounded-full animate-spin" /> Sauvegarde...</>
              : <><Check size={11} strokeWidth={2} /> Sauvegarder les préférences</>
            }
          </button>
        </div>
      </div>

      {/* ── Sécurité ── */}
      <div className="border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <Lock size={13} strokeWidth={1.5} className="text-muted-foreground" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mot de passe</p>
        </div>

        <div className="flex flex-col gap-3 mb-5">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Minimum 8 caractères"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirmPwd}
              onChange={e => setConfirmPwd(e.target.value)}
              placeholder="Répète le mot de passe"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>
        </div>

        {passwordMsg && <Msg msg={passwordMsg} />}

        <button
          onClick={savePassword}
          disabled={savingPassword || !newPassword}
          className="flex items-center gap-1.5 text-[11px] font-semibold bg-foreground text-background px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {savingPassword
            ? <><div className="w-3 h-3 border-2 border-background border-t-transparent rounded-full animate-spin" /> Mise à jour...</>
            : <><Check size={11} strokeWidth={2} /> Mettre à jour le mot de passe</>
          }
        </button>
      </div>

    </div>
  )
}
