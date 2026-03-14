import { useEffect, useMemo } from 'react'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { useGameStore } from '../hooks/useGameStore'

const cellNames = ['Satellite Cell', 'Type IIx Fibre', 'Fibroblast', 'Osteocyte', 'Motor Neuron']

export function LoadingScreen() {
  const result = useGameStore((state) => state.result)
  const setScreen = useGameStore((state) => state.setScreen)
  const addToLeaderboard = useGameStore((state) => state.addToLeaderboard)

  const ticker = useMemo(() => Math.round((Date.now() / 75) % 80) + 18, [])

  useEffect(() => {
    const t = window.setTimeout(() => {
      addToLeaderboard()
      setScreen('results')
    }, 3000)

    if ((result?.percentile ?? 0) >= 75) {
      confetti({ particleCount: 140, spread: 90, colors: ['#8b7db8', '#a594d0', '#6b5d98'] })
    }

    return () => window.clearTimeout(t)
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
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-entelo-blue to-entelo-teal bg-clip-text text-7xl font-bold text-transparent"
        >
          {ticker}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-4 text-sm text-entelo-white/70"
        >
          {cellNames[Math.floor(Date.now() / 250) % cellNames.length]}
        </motion.p>
      </div>
    </section>
  )
}
