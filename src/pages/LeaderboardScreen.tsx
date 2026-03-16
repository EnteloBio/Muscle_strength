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
  const [showPinInput, setShowPinInput] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)

  const ranked = useMemo(() => leaderboard.map((entry, index) => ({ ...entry, rank: index + 1 })), [leaderboard])
  const maleTop = useMemo(
    () =>
      ranked
        .filter((entry) => entry.sex === 'male')
        .map((entry, index) => ({ ...entry, rank: index + 1 }))
        .slice(0, 10),
    [ranked],
  )
  const femaleTop = useMemo(
    () =>
      ranked
        .filter((entry) => entry.sex === 'female')
        .map((entry, index) => ({ ...entry, rank: index + 1 }))
        .slice(0, 10),
    [ranked],
  )
  const unspecifiedTop = useMemo(
    () =>
      ranked
        .filter((entry) => entry.sex === 'unspecified')
        .map((entry, index) => ({ ...entry, rank: index + 1 }))
        .slice(0, 10),
    [ranked],
  )

  const currentRank = useMemo(() => {
    if (!userProfile || !result) return null
    const sameSex = ranked.filter((entry) => entry.sex === userProfile.sex)
    return sameSex
      .map((entry, index) => ({ ...entry, rank: index + 1 }))
      .find((entry) => entry.name === userProfile.name && entry.grip === result.bestGrip)
  }, [ranked, result, userProfile])

  const renderTable = (
    title: string,
    entries: Array<
      (typeof maleTop)[number]
    >,
  ) => (
    <div className="section-card">
      <h3 className="text-lg font-semibold text-entelo-white">{title}</h3>
      <p className="mt-1 text-sm text-entelo-white/65">{entries.length} in top list</p>

      <div className="mt-3 space-y-2">
        {entries.length === 0 ? (
          <p className="text-sm text-entelo-white/55">No entries yet.</p>
        ) : (
          entries.map((entry) => {
            const highlighted =
              userProfile?.name === entry.name &&
              !!result &&
              entry.grip === result.bestGrip &&
              entry.sex === userProfile.sex

            return (
              <div
                key={`${title}-${entry.name}-${entry.timestamp}`}
                className={`grid grid-cols-[42px_minmax(0,1fr)_90px_74px] items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                  highlighted
                    ? 'border-entelo-blue bg-entelo-blue/10 shadow-[0_0_18px_rgba(139,125,184,0.35)]'
                    : 'border-entelo-white/10 bg-entelo-navy/35'
                }`}
              >
                <span className="font-semibold">#{entry.rank}</span>
                <span className="min-w-0 truncate whitespace-nowrap" title={`${entry.name}${entry.company ? ` • ${entry.company}` : ''}`}>
                  {entry.name}
                  {entry.company ? ` • ${entry.company}` : ''}
                </span>
                <span className="text-right whitespace-nowrap">{entry.grip.toFixed(1)} kg</span>
                <span className="text-right whitespace-nowrap">{entry.percentile}th</span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )

  return (
    <section className="mx-auto h-full w-full max-w-5xl px-4 py-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-panel h-full overflow-y-auto p-6 md:p-8">
        <h2 className="bg-gradient-to-r from-entelo-blue via-entelo-teal to-entelo-blue bg-clip-text text-2xl font-semibold text-transparent md:text-3xl">
          🏆 TODAY'S STRONGEST GRIPS
        </h2>
        <p className="mt-1 text-sm text-entelo-white/70">
          Conference Leaderboard • {leaderboard.length} participants
        </p>
        <p className="mt-1 text-xs text-entelo-white/55">
          Men: {ranked.filter((entry) => entry.sex === 'male').length} • Women:{' '}
          {ranked.filter((entry) => entry.sex === 'female').length}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {renderTable('Men (Male)', maleTop)}
          {renderTable('Women (Female)', femaleTop)}
        </div>
        {unspecifiedTop.length > 0 ? (
          <div className="mt-4">{renderTable('Unspecified', unspecifiedTop)}</div>
        ) : null}

        {currentRank && currentRank.rank > 10 ? (
          <p className="mt-4 text-sm text-entelo-blue">
            Your rank (in {userProfile?.sex}): #{currentRank.rank}
          </p>
        ) : null}

        <div className="mt-6 grid gap-2 md:grid-cols-2">
          <button type="button" className="tap-btn btn-primary" onClick={resetGame}>🔄 PLAY AGAIN</button>
          <button type="button" className="tap-btn action-btn" onClick={() => setScreen('results')}>← BACK TO RESULTS</button>
        </div>

        <div className="mt-4 flex justify-end">
          {showPinInput ? (
            <div className="flex items-center gap-2">
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="PIN"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value)
                  setPinError(false)
                }}
                className="input-base w-20 text-center text-sm"
                autoFocus
              />
              <button
                type="button"
                className="tap-btn text-xs text-entelo-white/70 underline"
                onClick={() => {
                  if (pin === '1234') {
                    clearLeaderboard()
                    setShowPinInput(false)
                    setPin('')
                    setPinError(false)
                  } else {
                    setPinError(true)
                  }
                }}
              >
                Confirm
              </button>
              <button
                type="button"
                className="tap-btn text-xs text-entelo-white/50"
                onClick={() => {
                  setShowPinInput(false)
                  setPin('')
                  setPinError(false)
                }}
              >
                Cancel
              </button>
              {pinError ? <span className="text-xs text-rose-300">Wrong PIN</span> : null}
            </div>
          ) : (
            <button
              type="button"
              className="tap-btn text-xs text-entelo-white/70 underline"
              onClick={() => setShowPinInput(true)}
            >
              RESET LEADERBOARD
            </button>
          )}
        </div>
      </motion.div>
    </section>
  )
}
