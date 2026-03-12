import type { CelebrityTier, Sex } from '../types'

const sharedTiers = [
  {
    name: 'Legendary',
    minPercentile: 95,
    icon: '🏔️',
    flavourText: 'You could crack a walnut blindfolded. Absolute unit.',
  },
  {
    name: 'Elite',
    minPercentile: 75,
    icon: '⚡',
    flavourText: 'Action-hero grip. Very impressive.',
  },
  {
    name: 'Solid',
    minPercentile: 50,
    icon: '🛡️',
    flavourText: 'Solid and dependable. Thor would approve.',
  },
  {
    name: 'Average',
    minPercentile: 25,
    icon: '👌',
    flavourText: 'Right in the sweet spot. Totally respectable.',
  },
  {
    name: 'Below Average',
    minPercentile: 0,
    icon: '🐹',
    flavourText:
      "Your muscles are sending an SOS - good thing that's literally what we work on.",
  },
] as const

export const celebrityTiers: Record<Sex, CelebrityTier[]> = {
  male: [
    { ...sharedTiers[0], celebrity: 'Hafthor Bjornsson' },
    { ...sharedTiers[1], celebrity: 'Dwayne Johnson' },
    { ...sharedTiers[2], celebrity: 'Chris Hemsworth' },
    { ...sharedTiers[3], celebrity: 'Ryan Reynolds' },
    { ...sharedTiers[4], celebrity: 'Mark Zuckerberg' },
  ],
  female: [
    { ...sharedTiers[0], celebrity: 'Becca Swanson' },
    { ...sharedTiers[1], celebrity: 'Serena Williams' },
    { ...sharedTiers[2], celebrity: 'Ronda Rousey' },
    { ...sharedTiers[3], celebrity: 'Florence Pugh' },
    { ...sharedTiers[4], celebrity: 'A very determined hamster' },
  ],
}
