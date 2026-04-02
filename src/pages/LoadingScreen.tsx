import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { useGameStore } from '../hooks/useGameStore'

const cellNames = ['Satellite Cell', 'Type IIx Fibre', 'Fibroblast', 'Osteocyte', 'Motor Neuron']

export function LoadingScreen() {
  const result = useGameStore((state) => state.result)
  const setScreen = useGameStore((state) => state.setScreen)
  const addToLeaderboard = useGameStore((state) => state.addToLeaderboard)

  const [ticker, setTicker] = useState(Math.floor(Math.random() * 80) + 18)
  const [cellIdx, setCellIdx] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTicker(Math.floor(Math.random() * 80) + 18)
      setCellIdx((i) => (i + 1) % cellNames.length)
    }, 75)

    const t = window.setTimeout(() => {
      window.clearInterval(interval)
      addToLeaderboard()
      setScreen('results')
    }, 3000)

    const pct = result?.percentile ?? 0
    if (pct >= 95) {
      // Elite: big double-burst confetti with gold
      confetti({ particleCount: 200, spread: 120, colors: ['#ffd700', '#ffb300', '#8b7db8', '#a594d0'], origin: { y: 0.6 } })
      setTimeout(() => confetti({ particleCount: 120, spread: 80, colors: ['#ffd700', '#ffb300', '#fff'], origin: { y: 0.5 } }), 400)
    } else if (pct >= 75) {
      // Strong: standard confetti
      confetti({ particleCount: 140, spread: 90, colors: ['#8b7db8', '#a594d0', '#6b5d98'] })
    } else if (pct >= 50) {
      // Above average: subtle celebration
      confetti({ particleCount: 60, spread: 55, colors: ['#8b7db8', '#a594d0'], gravity: 1.2 })
    }

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(t)
    }
  }, [addToLeaderboard, result?.percentile, setScreen])

  return (
    <section className="mx-auto flex h-full w-full max-w-4xl items-center justify-center px-4 py-6">
      <div className="glass-panel w-full max-w-2xl p-10 text-center">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg tracking-[0.2em] text-entelo-white/75">
          DECODING YOUR STRENGTH...
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-8 bg-gradient-to-r from-entelo-blue to-entelo-teal bg-clip-text text-7xl font-bold tabular-nums text-transparent"
        >
          {ticker}
        </motion.div>

        <p className="mt-4 text-sm text-entelo-white/70">
          {cellNames[cellIdx]}
        </p>
      </div>
    </section>
  )
}
