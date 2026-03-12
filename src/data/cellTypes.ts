import type { CellType } from '../types'

export const cellTypes: CellType[] = [
  {
    name: 'Type IIx Fast-Twitch Fibre',
    description: 'Pure explosive power. The sprinter of cells.',
    icon: '🚀',
    minPercentile: 95,
  },
  {
    name: 'Satellite Cell',
    description: "The muscle's repair crew. You regenerate like Wolverine.",
    icon: '🧬',
    minPercentile: 75,
  },
  {
    name: 'Type I Slow-Twitch Fibre',
    description: 'Built for endurance. Marathon runner mentality.',
    icon: '🏃',
    minPercentile: 50,
  },
  {
    name: 'Fibroblast',
    description: 'The scaffolding of the body. Everywhere, essential, underrated.',
    icon: '🏗️',
    minPercentile: 25,
  },
  {
    name: 'Osteocyte',
    description: 'Quietly holding everything together from inside the bone.',
    icon: '🦴',
    minPercentile: 10,
  },
  {
    name: 'Motor Neuron',
    description: "The signal matters more than the size. You're the brain of the operation.",
    icon: '🧠',
    minPercentile: 0,
  },
]
