export type Sex = 'male' | 'female'

export type GripReading = {
  attempt: number
  value: number
}

export type UserProfile = {
  name: string
  age: number
  sex: Sex
  company?: string
  email?: string
}

export type CelebrityTier = {
  name: string
  celebrity: string
  icon: string
  flavourText: string
  minPercentile: number
}

export type CellType = {
  name: string
  description: string
  icon: string
  minPercentile: number
}

export type GripResult = {
  bestGrip: number
  percentile: number
  muscleAge: number
  celebrityTier: CelebrityTier
  cellType: CellType
}

export type LeaderboardEntry = {
  name: string
  company: string
  sex: Sex | 'unspecified'
  grip: number
  percentile: number
  timestamp: number
}

export type Screen =
  | 'welcome'
  | 'profile'
  | 'grip'
  | 'loading'
  | 'results'
  | 'leaderboard'
