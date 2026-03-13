import {
  calculateResult,
  getCellType,
  getCelebrityTier,
  getMuscleAge,
  getPercentile,
} from './calculations'

describe('calculations', () => {
  it('returns around the median percentile for median grip', () => {
    const percentile = getPercentile(49.7, 27, 'male')
    expect(percentile).toBeCloseTo(50, 5)
  })

  it('interpolates percentile continuously between known breakpoints', () => {
    // midpoint between male 25-29 p50 (49.7) and p75 (55) => 62.5th percentile
    const percentile = getPercentile((49.7 + 55) / 2, 27, 'male')
    expect(percentile).toBeCloseTo(62.5, 3)
  })

  it('clamps percentile at lower and upper bounds', () => {
    expect(getPercentile(-5, 45, 'female')).toBe(1)
    expect(getPercentile(220, 45, 'female')).toBe(99)
  })

  it('maps stronger grips to younger muscle age', () => {
    const strong = getMuscleAge(65, 'male')
    const weak = getMuscleAge(16, 'male')

    expect(strong).toBeLessThan(weak)
    expect(strong).toBeGreaterThanOrEqual(18)
    expect(weak).toBeLessThanOrEqual(85)
  })

  it('maps percentile to expected celebrity tier', () => {
    expect(getCelebrityTier(96, 'male').name).toBe('Legendary')
    expect(getCelebrityTier(80, 'female').name).toBe('Elite')
    expect(getCelebrityTier(22, 'female').name).toBe('Below Average')
  })

  it('maps percentile to expected cell type', () => {
    expect(getCellType(97).name).toBe('Type IIx Fast-Twitch Fibre')
    expect(getCellType(78).name).toBe('Satellite Cell')
    expect(getCellType(8).name).toBe('Motor Neuron')
  })

  it('returns a complete result and clamps grip in orchestration', () => {
    const result = calculateResult(0, 35, 'female')

    expect(result.bestGrip).toBe(1)
    expect(result.percentile).toBeGreaterThanOrEqual(1)
    expect(result.percentile).toBeLessThanOrEqual(99)
    expect(result.muscleAge).toBeGreaterThanOrEqual(18)
    expect(result.muscleAge).toBeLessThanOrEqual(85)
    expect(result.celebrityTier.name.length).toBeGreaterThan(0)
    expect(result.cellType.name.length).toBeGreaterThan(0)
  })
})
