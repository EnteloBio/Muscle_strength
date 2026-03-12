import type { Sex } from '../types'

export type GripNormRow = {
  ageMin: number
  ageMax: number
  p5: number
  p25: number
  p50: number
  p75: number
  p95: number
}

export type GripNormsBySex = Record<Sex, GripNormRow[]>

const male: GripNormRow[] = [
  { ageMin: 20, ageMax: 24, p5: 30, p25: 40, p50: 46, p75: 52, p95: 62 },
  { ageMin: 25, ageMax: 29, p5: 32, p25: 42, p50: 49.7, p75: 55, p95: 65 },
  { ageMin: 30, ageMax: 34, p5: 32, p25: 42, p50: 49, p75: 55, p95: 64 },
  { ageMin: 35, ageMax: 39, p5: 31, p25: 41, p50: 48, p75: 54, p95: 63 },
  { ageMin: 40, ageMax: 44, p5: 30, p25: 39, p50: 46, p75: 52, p95: 60 },
  { ageMin: 45, ageMax: 49, p5: 28, p25: 37, p50: 44, p75: 50, p95: 58 },
  { ageMin: 50, ageMax: 54, p5: 26, p25: 35, p50: 42, p75: 48, p95: 56 },
  { ageMin: 55, ageMax: 59, p5: 24, p25: 33, p50: 40, p75: 46, p95: 54 },
  { ageMin: 60, ageMax: 64, p5: 22, p25: 31, p50: 38, p75: 44, p95: 51 },
  { ageMin: 65, ageMax: 69, p5: 20, p25: 28, p50: 35, p75: 41, p95: 48 },
  { ageMin: 70, ageMax: 74, p5: 18, p25: 26, p50: 32, p75: 38, p95: 44 },
  { ageMin: 75, ageMax: 79, p5: 16, p25: 23, p50: 29, p75: 34, p95: 40 },
  { ageMin: 80, ageMax: 89, p5: 14, p25: 20, p50: 25, p75: 30, p95: 36 },
]

const female: GripNormRow[] = [
  { ageMin: 20, ageMax: 24, p5: 16, p25: 22, p50: 27, p75: 32, p95: 40 },
  { ageMin: 25, ageMax: 29, p5: 17, p25: 24, p50: 29, p75: 34, p95: 41 },
  { ageMin: 30, ageMax: 34, p5: 17, p25: 24, p50: 29, p75: 34, p95: 41 },
  { ageMin: 35, ageMax: 39, p5: 17, p25: 23, p50: 28, p75: 33, p95: 40 },
  { ageMin: 40, ageMax: 44, p5: 16, p25: 22, p50: 27, p75: 32, p95: 38 },
  { ageMin: 45, ageMax: 49, p5: 15, p25: 21, p50: 26, p75: 31, p95: 37 },
  { ageMin: 50, ageMax: 54, p5: 14, p25: 20, p50: 25, p75: 30, p95: 36 },
  { ageMin: 55, ageMax: 59, p5: 13, p25: 19, p50: 24, p75: 28, p95: 34 },
  { ageMin: 60, ageMax: 64, p5: 12, p25: 17, p50: 22, p75: 26, p95: 32 },
  { ageMin: 65, ageMax: 69, p5: 11, p25: 16, p50: 20, p75: 24, p95: 30 },
  { ageMin: 70, ageMax: 74, p5: 10, p25: 14, p50: 18, p75: 22, p95: 28 },
  { ageMin: 75, ageMax: 79, p5: 9, p25: 13, p50: 16.5, p75: 20, p95: 25 },
  { ageMin: 80, ageMax: 89, p5: 8, p25: 11, p50: 14, p75: 17, p95: 22 },
]

export const gripNorms: GripNormsBySex = { male, female }
