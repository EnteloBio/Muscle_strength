import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../hooks/useGameStore'

export function LeaderboardScreen() {
  const leaderboard = useGameStore((state) => state.leaderboard)
  const result = useGameStore((state) => state.result)
  const userProfile = useGameStore((state) => state.userProfile)
  const clearLeaderboard = useGameStore((state) => state.clearLeaderboard)
  const setScreen = useGameStore((state) => state.setScreen)
  const resetGame = useGameStore((state) => state.resetGame)
  const [confirmReset, setConfirmReset] = useState(false)

  const ranked = useMemo(() => leaderboard.map((entry, index) => ({ ...entry, rank: index + 1 })), [leaderboard])
  const topTen = ranked.slice(0, 10)

  const currentRank = useMemo(() => {
    if (!userProfile || !result) return null
    return ranked.find((entry) => entry.name === userProfile.name && entry.grip === result.bestGrip)
  }, [ranked, result, userProfile])

  return (
    <section className="mx-auto h-full w-full max-w-5xl px-4 py-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-panel h-full overflow-y-auto p-6 md:p-8">
        <h2 className="bg-gradient-to-r from-entelo-blue via-[#74cbff] to-entelo-purple bg-clip-text text-2xl font-semibold text-transparent md:text-3xl">
          🏆 TODAY'S STRONGEST GRIPS
        </h2>
        <p className="mt-1 text-sm text-entelo-white/70">Conference Leaderboard • {leaderboard.length} participants</p>

        <div className="mt-6 space-y-2">
          {topTen.map((entry) => {
            const highlighted = userProfile?.name === entry.name && !!result && entry.grip === result.bestGrip
            return (
              <div
                key={`${entry.name}-${entry.timestamp}`}
                className={`grid grid-cols-[56px_1fr_120px_120px] items-center rounded-xl border px-3 py-3 text-sm ${
                  highlighted
                    ? 'border-entelo-blue bg-entelo-blue/10 shadow-[0_0_24px_#00B4D855]'
                    : 'border-entelo-white/10 bg-entelo-navy/35'
                }`}
              >
                <span className="font-semibold">#{entry.rank}</span>
                <span>{entry.name}{entry.company ? ` • ${entry.company}` : ''}</span>
                <span className="text-right">{entry.grip.toFixed(1)} kg</span>
                <span className="text-right">{entry.percentile}th</span>
              </div>
            )
          })}
        </div>

        {currentRank && currentRank.rank > 10 ? (
          <p className="mt-4 text-sm text-entelo-blue">Your rank: #{currentRank.rank} of {leaderboard.length} participants</p>
        ) : null}

        <div className="mt-6 grid gap-2 md:grid-cols-2">
          <button type="button" className="tap-btn btn-primary" onClick={resetGame}>🔄 PLAY AGAIN</button>
          <button type="button" className="tap-btn action-btn" onClick={() => setScreen('results')}>← BACK TO RESULTS</button>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="tap-btn text-xs text-entelo-white/70 underline"
            onClick={() => {
              if (confirmReset) {
                clearLeaderboard()
                setConfirmReset(false)
              } else {
                setConfirmReset(true)
                window.setTimeout(() => setConfirmReset(false), 3000)
              }
            }}
          >
            {confirmReset ? 'Tap again to confirm reset' : 'RESET LEADERBOARD'}
          </button>
        </div>
      </motion.div>
    </section>
  )
}
