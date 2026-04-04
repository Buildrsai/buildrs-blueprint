import { useState, useRef, useEffect } from 'react'
import { Settings, User, Lock, Camera, Check, AlertCircle, ArrowLeft } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface Props {
  user: SupabaseUser | null
  navigate?: (hash: string) => void
}

export function SettingsPage({ user, navigate }: Props) {
  const [firstName, setFirstName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const avatarInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user) return
    setFirstName(user.user_metadata?.first_name ?? '')
    setAvatarUrl(user.user_metadata?.avatar_url ?? '')
  }, [user?.id])

  const uploadAvatar = async (file: File) => {
    if (!user) return
    setAvatarUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      setAvatarUrl(publicUrl)
    }
    setAvatarUploading(false)
  }

  const saveProfile = async () => {
    if (!user) return
    setSavingProfile(true)
    setProfileMsg(null)
    const { error } = await supabase.auth.updateUser({
      data: { first_name: firstName.trim(), avatar_url: avatarUrl },
    })
    setSavingProfile(false)
    if (error) {
      setProfileMsg({ type: 'error', text: error.message })
    } else {
      setProfileMsg({ type: 'success', text: 'Profil mis à jour. Retour à l\'accueil...' })
      if (navigate) {
        setTimeout(() => navigate('#/dashboard/home'), 1500)
      } else {
        setTimeout(() => setProfileMsg(null), 3000)
      }
    }
  }

  const savePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
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
      setConfirmPassword('')
      setTimeout(() => setPasswordMsg(null), 3000)
    }
  }

  const initial = (firstName || user?.email || 'U')[0].toUpperCase()

  if (!user) {
    return (
      <div className="p-7 max-w-lg">
        <p className="text-sm text-muted-foreground">Connecte-toi pour accéder aux paramètres.</p>
      </div>
    )
  }

  return (
    <div className="p-7 max-w-lg">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <Settings size={16} strokeWidth={1.5} className="text-muted-foreground" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Paramètres</p>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground" style={{ letterSpacing: '-0.03em' }}>
          Mon compte
        </h1>
      </div>

      {/* Profile section */}
      <div className="border border-border rounded-xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <User size={13} strokeWidth={1.5} className="text-muted-foreground" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Profil</p>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-5">
          <div
            className="relative w-16 h-16 rounded-full bg-foreground flex items-center justify-center overflow-hidden cursor-pointer flex-shrink-0 group"
            onClick={() => avatarInputRef.current?.click()}
          >
            {avatarUrl
              ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              : <span className="text-xl font-bold text-background">{initial}</span>
            }
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
              {avatarUploading
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Camera size={16} strokeWidth={1.5} style={{ color: '#fff' }} />
              }
            </div>
          </div>
          <div>
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="text-[11px] font-semibold border border-border rounded-lg px-3 py-1.5 hover:bg-secondary transition-colors block mb-1"
              disabled={avatarUploading}
            >
              {avatarUploading ? 'Envoi...' : 'Changer la photo'}
            </button>
            <p className="text-[10px] text-muted-foreground">PNG, JPG — max 2 Mo</p>
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadAvatar(f) }}
          />
        </div>

        {/* First name */}
        <div className="mb-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
            Prénom
          </label>
          <input
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            placeholder="Ton prénom"
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

        {profileMsg && (
          <div
            className="flex items-center gap-2 text-xs rounded-lg px-3 py-2 mb-3"
            style={{
              background: profileMsg.type === 'success' ? '#22c55e15' : '#ef444415',
              color: profileMsg.type === 'success' ? '#22c55e' : '#ef4444',
              border: `1px solid ${profileMsg.type === 'success' ? '#22c55e30' : '#ef444430'}`,
            }}
          >
            {profileMsg.type === 'success' ? <Check size={12} strokeWidth={2} /> : <AlertCircle size={12} strokeWidth={1.5} />}
            {profileMsg.text}
          </div>
        )}

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

      {/* Password section */}
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
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Répète le mot de passe"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>
        </div>

        {passwordMsg && (
          <div
            className="flex items-center gap-2 text-xs rounded-lg px-3 py-2 mb-3"
            style={{
              background: passwordMsg.type === 'success' ? '#22c55e15' : '#ef444415',
              color: passwordMsg.type === 'success' ? '#22c55e' : '#ef4444',
              border: `1px solid ${passwordMsg.type === 'success' ? '#22c55e30' : '#ef444430'}`,
            }}
          >
            {passwordMsg.type === 'success' ? <Check size={12} strokeWidth={2} /> : <AlertCircle size={12} strokeWidth={1.5} />}
            {passwordMsg.text}
          </div>
        )}

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
