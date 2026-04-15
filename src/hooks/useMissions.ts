import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { AccessContext } from './useAccess'

// ── Mission definitions ────────────────────────────────────────────────────

export type MissionId =
  | 'profile'
  | 'community'
  | 'environment'
  | 'find_idea'
  | 'create_project'
  | 'validate'

export interface MissionDef {
  id: MissionId
  title: string
  description: string
  cta: string
  hash: string
  /** If true, this mission gets an LP2 variant when user has claude-buildrs */
  adaptive?: boolean
}

export interface UserMission {
  id: string
  user_id: string
  mission_id: MissionId
  completed: boolean
  completed_at: string | null
  mission_data: Record<string, unknown>
}

const BASE_MISSIONS: MissionDef[] = [
  {
    id: 'profile',
    title: 'Compléter ton profil',
    description: 'Ajoute ton prénom et ton objectif — ça prend 30 secondes.',
    cta: 'Aller dans mes paramètres',
    hash: '#/dashboard/settings',
  },
  {
    id: 'community',
    title: 'Rejoindre la communauté',
    description: 'Publie ton premier post dans le feed — win, idée ou question.',
    cta: 'Publier mon premier post',
    hash: '#/dashboard/community',
  },
  {
    id: 'environment',
    title: 'Configurer ton environnement',
    description: 'LP1: Commence le Module 0 — Fondations. LP2: Ouvre Claude By Buildrs.',
    cta: 'Accéder',
    hash: '#/dashboard/module/00',
    adaptive: true,
  },
  {
    id: 'find_idea',
    title: 'Explorer les idées SaaS',
    description: 'Parcours la marketplace et sauvegarde au moins une idée qui t\'inspire.',
    cta: 'Explorer la marketplace',
    hash: '#/dashboard/marketplace',
  },
  {
    id: 'create_project',
    title: 'Créer ton premier projet',
    description: 'Donne un nom à ton idée et crée ton premier projet Buildrs.',
    cta: 'Créer mon projet',
    hash: '#/dashboard/project',
  },
  {
    id: 'validate',
    title: 'Valider ton idée avec l\'IA',
    description: 'Lance l\'analyse IA sur ton idée pour obtenir un score de viabilité 0-100.',
    cta: 'Analyser mon idée',
    hash: '#/dashboard/project',
  },
]

function getAdaptedMissions(access: AccessContext | undefined): MissionDef[] {
  return BASE_MISSIONS.map(m => {
    if (m.id !== 'environment') return m
    if (access?.hasProduct('claude-buildrs')) {
      return {
        ...m,
        title: 'Ouvrir ton environnement Claude',
        description: 'Tu as accès à Claude By Buildrs — explore les 15 blocs de formation.',
        cta: 'Ouvrir Claude By Buildrs',
        hash: '#/dashboard/claude/ai',
      }
    }
    return {
      ...m,
      title: 'Démarrer ta formation',
      description: 'Lance le Module 0 — Fondations pour poser les bases de ton projet.',
      cta: 'Commencer le Module 0',
      hash: '#/dashboard/module/00',
    }
  })
}

// ── Auto-completion checks ─────────────────────────────────────────────────

async function checkCompletion(
  missionId: MissionId,
  userId: string,
  access: AccessContext | undefined,
): Promise<boolean> {
  switch (missionId) {
    case 'profile': {
      // Check auth metadata first_name (what SettingsPage saves)
      const { data } = await supabase.auth.getUser()
      return !!(data?.user?.user_metadata?.first_name)
    }
    case 'community': {
      const { count } = await supabase
        .from('community_posts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
      return (count ?? 0) > 0
    }
    case 'environment': {
      // LP2: any click on #/dashboard/claude is tracked via mission_data; check project progress or just return false (manual mark)
      // LP1: check if module 00 has any progress
      if (access?.hasProduct('claude-buildrs')) {
        // Completed when user has visited the claude dashboard — tracked via mission_data flag
        return false // will be set manually via completeMission
      }
      const { count } = await supabase
        .from('progress')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .like('lesson_id', '00-%')
      return (count ?? 0) > 0
    }
    case 'find_idea': {
      const { count: savedCount } = await supabase
        .from('user_saved_ideas')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
      if ((savedCount ?? 0) > 0) return true
      const { count: projectCount } = await supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
      return (projectCount ?? 0) > 0
    }
    case 'create_project': {
      const { count } = await supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
      return (count ?? 0) > 0
    }
    case 'validate': {
      const { data } = await supabase
        .from('projects')
        .select('viability_score')
        .eq('user_id', userId)
        .not('viability_score', 'is', null)
        .maybeSingle()
      return data?.viability_score != null
    }
    default:
      return false
  }
}

const MISSION_ORDER: MissionId[] = [
  'profile',
  'community',
  'environment',
  'find_idea',
  'create_project',
  'validate',
]

// ── Hook ───────────────────────────────────────────────────────────────────

export function useMissions(userId: string | undefined, access: AccessContext | undefined) {
  const [missions, setMissions]   = useState<UserMission[]>([])
  const [loading, setLoading]     = useState(true)
  const [initialized, setInitialized] = useState(false)

  const adaptedDefs = getAdaptedMissions(access)

  const fetchAndSync = useCallback(async () => {
    if (!userId) { setLoading(false); return }
    setLoading(true)

    // Load existing rows
    const { data: existing } = await supabase
      .from('user_missions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    const existingMap = new Map((existing ?? []).map((m: UserMission) => [m.mission_id, m]))

    // Init missing rows
    const missing = MISSION_ORDER.filter(id => !existingMap.has(id))
    if (missing.length > 0) {
      const { data: inserted } = await supabase
        .from('user_missions')
        .insert(missing.map(mission_id => ({ user_id: userId, mission_id, completed: false })))
        .select()
      ;(inserted ?? []).forEach((m: UserMission) => existingMap.set(m.mission_id, m))
    }

    // Auto-check completion for non-completed missions
    const allRows = MISSION_ORDER.map(id => existingMap.get(id)!).filter(Boolean)
    const updates: Promise<void>[] = []

    for (const row of allRows) {
      if (row.completed) continue
      const done = await checkCompletion(row.mission_id as MissionId, userId, access)
      if (done) {
        updates.push(
          supabase
            .from('user_missions')
            .update({ completed: true, completed_at: new Date().toISOString() })
            .eq('id', row.id)
            .then(() => {
              row.completed = true
              row.completed_at = new Date().toISOString()
            })
        )
      }
    }
    await Promise.all(updates)

    setMissions(allRows)
    setInitialized(true)
    setLoading(false)
  }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchAndSync() }, [fetchAndSync])

  const completeMission = useCallback(async (missionId: MissionId) => {
    if (!userId) return
    const { data } = await supabase
      .from('user_missions')
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('mission_id', missionId)
      .select()
      .single()
    if (data) {
      setMissions(prev => prev.map(m => m.mission_id === missionId ? data as UserMission : m))
    }
  }, [userId])

  // Derived state
  const completedIds  = new Set(missions.filter(m => m.completed).map(m => m.mission_id))
  const allCompleted  = MISSION_ORDER.every(id => completedIds.has(id))
  const currentIndex  = MISSION_ORDER.findIndex(id => !completedIds.has(id))
  const currentMissionId = currentIndex >= 0 ? MISSION_ORDER[currentIndex] : null
  const currentDef    = currentMissionId ? adaptedDefs.find(d => d.id === currentMissionId) ?? null : null
  const progress      = MISSION_ORDER.filter(id => completedIds.has(id)).length

  return {
    missions,
    loading,
    initialized,
    adaptedDefs,
    allCompleted,
    currentDef,
    currentIndex,
    progress,
    completeMission,
    refetch: fetchAndSync,
  }
}
