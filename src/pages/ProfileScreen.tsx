import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../hooks/useGameStore'
import type { Sex } from '../types'

const defaultAge = 32

export function ProfileScreen() {
  const setScreen = useGameStore((state) => state.setScreen)
  const setProfile = useGameStore((state) => state.setProfile)

  const [name, setName] = useState('')
  const [age, setAge] = useState(defaultAge)
  const [sex, setSex] = useState<Sex | ''>('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [showOptional, setShowOptional] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const errors = useMemo(
    () => ({
      name: submitted && name.trim().length === 0,
      age: submitted && (Number.isNaN(age) || age < 18 || age > 100),
      sex: submitted && sex === '',
    }),
    [age, name, sex, submitted],
  )

  const onNext = () => {
    setSubmitted(true)

    if (errors.name || errors.age || errors.sex || sex === '') return

    setProfile({
      name: name.trim(),
      age,
      sex,
      company: company.trim() || undefined,
      email: email.trim() || undefined,
    })

    setScreen('grip')
  }

  return (
    <section className="mx-auto flex h-full w-full max-w-4xl items-center justify-center px-4 py-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-3xl p-6 text-left md:p-8"
      >
        <h2 className="mb-1 text-2xl font-semibold md:text-3xl">Your Details</h2>
        <p className="mb-6 text-sm text-entelo-white/70">Quick profile before we test your grip.</p>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm text-entelo-white/90">Name *</span>
            <input
              aria-label="Name"
              className="input-base"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="First name"
            />
            {errors.name ? <span className="error-text">Name is required.</span> : null}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm text-entelo-white/90">Age: {age}</span>
            <input
              aria-label="Age"
              type="range"
              min={18}
              max={100}
              value={age}
              onChange={(event) => setAge(Number(event.target.value))}
              className="h-12 accent-entelo-blue"
            />
            {errors.age ? <span className="error-text">Age must be between 18 and 100.</span> : null}
          </label>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-sm text-entelo-white/90">Sex *</p>
          <div className="flex gap-3">
            {(['male', 'female'] as const).map((option) => (
              <button
                type="button"
                key={option}
                className={`tap-btn min-h-12 rounded-full border px-6 py-3 text-sm font-semibold uppercase tracking-wide ${
                  sex === option
                    ? 'border-entelo-blue bg-entelo-blue/20 text-entelo-white'
                    : 'border-entelo-white/20 bg-entelo-navy/40 text-entelo-white/80'
                }`}
                onClick={() => setSex(option)}
              >
                {option}
              </button>
            ))}
          </div>
          {errors.sex ? <span className="error-text mt-2 block">Please select male or female.</span> : null}
        </div>

        <div className="mt-6">
          <button
            type="button"
            className="text-sm text-entelo-blue underline-offset-4 hover:underline"
            onClick={() => setShowOptional((value) => !value)}
          >
            {showOptional ? 'Hide details' : 'Add details (optional)'}
          </button>

          {showOptional ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm text-entelo-white/90">Company</span>
                <input
                  aria-label="Company"
                  className="input-base"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm text-entelo-white/90">Email</span>
                <input
                  aria-label="Email"
                  className="input-base"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="We'll send your full results"
                />
              </label>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="tap-btn btn-primary mt-8 w-full px-6 py-3"
          onClick={onNext}
        >
          NEXT →
        </button>
      </motion.div>
    </section>
  )
}
