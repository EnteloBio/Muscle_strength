import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../hooks/useGameStore'

const clamp = (value: number): number => Math.min(150, Math.max(1, value))

export function GripScreen() {
  const setScreen = useGameStore((state) => state.setScreen)
  const gripReadings = useGameStore((state) => state.gripReadings)
  const addGripReading = useGameStore((state) => state.addGripReading)
  const calculateAndSetResult = useGameStore((state) => state.calculateAndSetResult)

  const [value, setValue] = useState(35)

  const attempt = gripReadings.length + 1
  const best = useMemo(() => Math.max(0, ...gripReadings.map((item) => item.value)), [gripReadings])
  const meterPercent = Math.round((clamp(value) / 150) * 100)

  const recordAttempt = () => {
    addGripReading(value)
    setValue(35)
  }

  const onCalculate = () => {
    calculateAndSetResult()
    setScreen('loading')
  }

  return (
    <section className="mx-auto flex h-full w-full max-w-4xl items-center justify-center px-4 py-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-panel w-full max-w-3xl p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">Enter your grip strength</h2>
            <p className="mt-2 text-sm text-entelo-white/70">
              Squeeze the dynamometer with your dominant hand, then enter the value in kg.
            </p>
          </div>
          <button
            type="button"
            className="tap-btn shrink-0 rounded-full border border-entelo-white/20 bg-entelo-navy/50 px-4 py-2 text-sm text-entelo-white/80"
            onClick={() => setScreen('profile')}
          >
            ← Edit Details
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            className="tap-btn icon-btn"
            aria-label="Decrease grip"
            onClick={() => setValue((current) => Math.round(clamp(current - 0.5) * 10) / 10)}
          >
            -
          </button>
          <div className="flex items-end gap-2">
            <input
              aria-label="Grip strength in kilograms"
              type="number"
              min={1}
              max={150}
              step={0.1}
              value={value}
              onChange={(event) => {
                const raw = Number(event.target.value)
                setValue(Number.isNaN(raw) ? 1 : Math.round(clamp(raw) * 10) / 10)
              }}
              className="input-base w-44 text-center text-5xl font-bold md:w-56 md:text-6xl"
            />
            <span className="pb-3 text-xl text-entelo-white/80">kg</span>
          </div>
          <button
            type="button"
            className="tap-btn icon-btn"
            aria-label="Increase grip"
            onClick={() => setValue((current) => Math.round(clamp(current + 0.5) * 10) / 10)}
          >
            +
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-entelo-white/10 bg-entelo-navy/40 p-4">
          <p className="mb-2 text-sm text-entelo-white/70">Power meter</p>
          <div className="h-4 w-full overflow-hidden rounded-full bg-entelo-white/10">
            <div
              style={{ width: `${meterPercent}%` }}
              className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 via-50% to-entelo-blue transition-all duration-300"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 text-sm text-entelo-white/80">
          <span>Attempt {Math.min(attempt, 3)} of 3</span>
          <div className="flex gap-2">
            {[1, 2, 3].map((dot) => (
              <span
                key={dot}
                className={`h-3 w-3 rounded-full ${dot <= gripReadings.length ? 'bg-entelo-blue' : 'bg-entelo-white/20'}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {gripReadings.map((reading) => (
            <span key={reading.attempt} className="rounded-full border border-entelo-white/15 px-3 py-1 text-xs text-entelo-white/80">
              Attempt {reading.attempt}: {reading.value}kg ✓
            </span>
          ))}
        </div>

        {gripReadings.length >= 2 ? (
          <p className="mt-4 text-sm font-semibold text-entelo-blue">Best so far: {best.toFixed(1)} kg</p>
        ) : null}

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <button
            type="button"
            className="tap-btn min-h-12 rounded-full border border-entelo-blue/40 bg-entelo-blue/15 px-4 py-3 font-semibold"
            onClick={recordAttempt}
            disabled={gripReadings.length >= 3}
          >
            RECORD ATTEMPT
          </button>

          <button
            type="button"
            className="tap-btn btn-primary px-4 py-3 disabled:opacity-40"
            onClick={onCalculate}
            disabled={gripReadings.length === 0}
          >
            CALCULATE RESULTS →
          </button>
        </div>
      </motion.div>
    </section>
  )
}
