import { create } from 'zustand'
import { calculateResult } from '../utils/calculations'
import { getSupabase } from '../utils/supabase'
import type { GripReading, GripResult, LeaderboardEntry, Screen, Sex, UserProfile } from '../types'

type GameState = {
  currentScreen: Screen
  userProfile: UserProfile | null
  gripReadings: GripReading[]
  result: GripResult | null
  leaderboard: LeaderboardEntry[]
  leaderboardLoading: boolean
  setScreen: (screen: Screen) => void
  setProfile: (profile: UserProfile) => void
  addGripReading: (value: number) => void
  calculateAndSetResult: () => void
  addToLeaderboard: () => void
  removeFromLeaderboard: (timestamp: number, id?: number) => void
  clearLeaderboard: () => void
  fetchLeaderboard: () => Promise<void>
  resetGame: () => void
}

const STORAGE_KEY = 'decode-strength-leaderboard'

const isSex = (value: unknown): value is Sex => value === 'male' || value === 'female'

const readLocalLeaderboard = (): LeaderboardEntry[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []

    return parsed
      .filter((entry): entry is Record<string, unknown> => typeof entry === 'object' && entry !== null)
      .map((entry) => {
        const sex: LeaderboardEntry['sex'] = isSex(entry.sex) ? entry.sex : 'unspecified'
        return {
          name: String(entry.name ?? 'Anonymous'),
          company: String(entry.company ?? ''),
          sex,
          grip: Number(entry.grip ?? 0),
          percentile: Number(entry.percentile ?? 0),
          timestamp: Number(entry.timestamp ?? Date.now()),
        }
      })
      .filter((entry) => Number.isFinite(entry.grip) && Number.isFinite(entry.percentile))
  } catch {
    return []
  }
}

const writeLocalLeaderboard = (leaderboard: LeaderboardEntry[]): void => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leaderboard))
}

const sortEntries = (entries: LeaderboardEntry[]): LeaderboardEntry[] =>
  [...entries].sort((a, b) => b.grip - a.grip || b.percentile - a.percentile)

export const useGameStore = create<GameState>((set, get) => ({
  currentScreen: 'welcome',
  userProfile: null,
  gripReadings: [],
  result: null,
  leaderboard: readLocalLeaderboard(),
  leaderboardLoading: false,

  setScreen: (screen) => {
    set({ currentScreen: screen })
    if (screen === 'leaderboard' || screen === 'welcome') {
      get().fetchLeaderboard()
    }
  },

  setProfile: (profile) => set({ userProfile: profile }),

  addGripReading: (value) =>
    set((state) => {
      if (state.gripReadings.length >= 3) return state
      const normalized = Math.round(Math.min(150, Math.max(1, value)) * 10) / 10
      const nextAttempt = state.gripReadings.length + 1
      return { gripReadings: [...state.gripReadings, { attempt: nextAttempt, value: normalized }] }
    }),

  calculateAndSetResult: () => {
    const { gripReadings, userProfile } = get()
    if (!userProfile || gripReadings.length === 0) return
    const bestGrip = Math.max(...gripReadings.map((reading) => reading.value))
    set({ result: calculateResult(bestGrip, userProfile.age, userProfile.sex) })
  },

  addToLeaderboard: () => {
    const { result, userProfile, leaderboard } = get()
    if (!result || !userProfile) return

    const entry: LeaderboardEntry = {
      name: userProfile.name.trim(),
      company: userProfile.company?.trim() ?? '',
      sex: userProfile.sex,
      grip: result.bestGrip,
      percentile: Math.round(result.percentile),
      timestamp: Date.now(),
    }

    const next = sortEntries([...leaderboard, entry]).slice(0, 500)
    writeLocalLeaderboard(next)
    set({ leaderboard: next })

    const supabase = getSupabase()
    if (supabase) {
      supabase
        .from('leaderboard')
        .insert({
          name: entry.name,
          company: entry.company,
          sex: entry.sex,
          grip: entry.grip,
          percentile: entry.percentile,
        })
        .then(({ error }) => {
          if (error) console.error('SUPABASE_INSERT_ERROR', error)
          else get().fetchLeaderboard()
        })
    }
  },

  removeFromLeaderboard: (timestamp: number, id?: number) => {
    const next = get().leaderboard.filter((entry) => entry.timestamp !== timestamp)
    writeLocalLeaderboard(next)
    set({ leaderboard: next })

    const supabase = getSupabase()
    if (supabase && id != null) {
      supabase
        .from('leaderboard')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('SUPABASE_DELETE_ERROR', error)
        })
    }
  },

  clearLeaderboard: () => {
    writeLocalLeaderboard([])
    set({ leaderboard: [] })

    const supabase = getSupabase()
    if (supabase) {
      supabase
        .from('leaderboard')
        .delete()
        .neq('id', 0)
        .then(({ error }) => {
          if (error) console.error('SUPABASE_CLEAR_ERROR', error)
        })
    }
  },

  fetchLeaderboard: async () => {
    const supabase = getSupabase()
    if (!supabase) return

    set({ leaderboardLoading: true })
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('grip', { ascending: false })
        .limit(500)

      if (error) {
        console.error('SUPABASE_FETCH_ERROR', error)
        return
      }

      if (data) {
        const entries: LeaderboardEntry[] = data.map((row: Record<string, unknown>) => ({
          id: Number(row.id),
          name: String(row.name ?? 'Anonymous'),
          company: String(row.company ?? ''),
          sex: (isSex(row.sex) ? row.sex : 'unspecified') as LeaderboardEntry['sex'],
          grip: Number(row.grip ?? 0),
          percentile: Number(row.percentile ?? 0),
          timestamp: new Date(String(row.created_at ?? '')).getTime() || Date.now(),
        }))

        const sorted = sortEntries(entries)
        writeLocalLeaderboard(sorted)
        set({ leaderboard: sorted })
      }
    } finally {
      set({ leaderboardLoading: false })
    }
  },

  resetGame: () => {
    set({
      currentScreen: 'welcome',
      userProfile: null,
      gripReadings: [],
      result: null,
    })
    get().fetchLeaderboard()
  },
}))

function initRealtimeSubscription() {
  const supabase = getSupabase()
  if (!supabase) return

  supabase
    .channel('leaderboard-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'leaderboard' },
      () => {
        useGameStore.getState().fetchLeaderboard()
      },
    )
    .subscribe()
}

initRealtimeSubscription()
