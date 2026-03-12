import { create } from 'zustand'
import { calculateResult } from '../utils/calculations'
import type { GripReading, GripResult, LeaderboardEntry, Screen, UserProfile } from '../types'

type GameState = {
  currentScreen: Screen
  userProfile: UserProfile | null
  gripReadings: GripReading[]
  result: GripResult | null
  leaderboard: LeaderboardEntry[]
  setScreen: (screen: Screen) => void
  setProfile: (profile: UserProfile) => void
  addGripReading: (value: number) => void
  calculateAndSetResult: () => void
  addToLeaderboard: () => void
  clearLeaderboard: () => void
  resetGame: () => void
}

const STORAGE_KEY = 'decode-strength-leaderboard'

const readLeaderboard = (): LeaderboardEntry[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as LeaderboardEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeLeaderboard = (leaderboard: LeaderboardEntry[]): void => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leaderboard))
}

export const useGameStore = create<GameState>((set, get) => ({
  currentScreen: 'welcome',
  userProfile: null,
  gripReadings: [],
  result: null,
  leaderboard: readLeaderboard(),

  setScreen: (screen) => set({ currentScreen: screen }),
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
      grip: result.bestGrip,
      percentile: Math.round(result.percentile),
      timestamp: Date.now(),
    }

    const next = [...leaderboard, entry]
      .sort((a, b) => b.grip - a.grip || b.percentile - a.percentile)
      .slice(0, 500)

    writeLeaderboard(next)
    set({ leaderboard: next })
  },

  clearLeaderboard: () => {
    writeLeaderboard([])
    set({ leaderboard: [] })
  },

  resetGame: () =>
    set({
      currentScreen: 'welcome',
      userProfile: null,
      gripReadings: [],
      result: null,
    }),
}))
