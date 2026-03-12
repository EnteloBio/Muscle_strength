import { cellTypes } from '../data/cellTypes'
import { celebrityTiers } from '../data/celebrityTiers'
import { gripNorms, type GripNormRow } from '../data/gripNorms'
import type { CellType, CelebrityTier, GripResult, Sex } from '../types'

const PERCENTILE_POINTS = [5, 25, 50, 75, 95]

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const getAgeBand = (age: number, sex: Sex): GripNormRow => {
  const bands = gripNorms[sex]
  const match = bands.find((band) => age >= band.ageMin && age <= band.ageMax)
  return match ?? bands[bands.length - 1]
}

const interpolate = (x: number, x0: number, y0: number, x1: number, y1: number): number => {
  if (x1 === x0) return y0
  return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0)
}

/**
 * Estimates population percentile from grip using piecewise linear interpolation
 * between published p5/p25/p50/p75/p95 grip points for the selected age/sex band.
 */
export const getPercentile = (grip: number, age: number, sex: Sex): number => {
  const band = getAgeBand(age, sex)
  const xPoints = [band.p5, band.p25, band.p50, band.p75, band.p95]

  if (grip <= xPoints[0]) {
    const low = interpolate(grip, xPoints[0] - 10, 1, xPoints[0], PERCENTILE_POINTS[0])
    return clamp(low, 1, 99)
  }

  if (grip >= xPoints[4]) {
    const high = interpolate(grip, xPoints[4], PERCENTILE_POINTS[4], xPoints[4] + 10, 99)
    return clamp(high, 1, 99)
  }

  for (let i = 0; i < xPoints.length - 1; i += 1) {
    const x0 = xPoints[i]
    const x1 = xPoints[i + 1]
    if (grip >= x0 && grip <= x1) {
      const p0 = PERCENTILE_POINTS[i]
      const p1 = PERCENTILE_POINTS[i + 1]
      return clamp(interpolate(grip, x0, p0, x1, p1), 1, 99)
    }
  }

  return 50
}

/**
 * Finds muscle age by matching grip to interpolated age-band medians (p50).
 * Lower age means stronger expected median grip.
 */
export const getMuscleAge = (grip: number, sex: Sex): number => {
  const bands = gripNorms[sex]
  const ageMedianPairs = bands.map((band) => ({
    ageMid: (band.ageMin + band.ageMax) / 2,
    median: band.p50,
  }))

  for (let i = 0; i < ageMedianPairs.length - 1; i += 1) {
    const current = ageMedianPairs[i]
    const next = ageMedianPairs[i + 1]

    const upper = Math.max(current.median, next.median)
    const lower = Math.min(current.median, next.median)

    if (grip <= upper && grip >= lower) {
      return clamp(
        interpolate(grip, current.median, current.ageMid, next.median, next.ageMid),
        18,
        85,
      )
    }
  }

  if (grip > ageMedianPairs[0].median) return 18
  return 85
}

export const getCelebrityTier = (percentile: number, sex: Sex): CelebrityTier => {
  const tier = celebrityTiers[sex].find((item) => percentile >= item.minPercentile)
  return tier ?? celebrityTiers[sex][celebrityTiers[sex].length - 1]
}

export const getCellType = (percentile: number): CellType => {
  const cell = cellTypes.find((item) => percentile >= item.minPercentile)
  return cell ?? cellTypes[cellTypes.length - 1]
}

export const calculateResult = (grip: number, age: number, sex: Sex): GripResult => {
  const bestGrip = clamp(grip, 1, 150)
  const percentile = getPercentile(bestGrip, age, sex)
  const muscleAge = getMuscleAge(bestGrip, sex)
  const celebrityTier = getCelebrityTier(percentile, sex)
  const cellType = getCellType(percentile)

  return {
    bestGrip,
    percentile,
    muscleAge,
    celebrityTier,
    cellType,
  }
}
