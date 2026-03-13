import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { factoids } from '../data/factoids'
import { useGameStore } from '../hooks/useGameStore'
import enteloQrCode from '../../logos/adobe-express-qr-code.png'

const formatDeltaLine = (actualAge: number, muscleAge: number): { text: string; tone: string } => {
  const diff = Math.round(Math.abs(actualAge - muscleAge))
  if (muscleAge < actualAge - 2) return { text: `You're ${diff} years younger!`, tone: 'text-emerald-300' }
  if (muscleAge > actualAge + 2) return { text: `Your muscles think you're ${diff} years older.`, tone: 'text-amber-300' }
  return { text: 'Right on track!', tone: 'text-entelo-blue' }
}

export function ResultsScreen() {
  const userProfile = useGameStore((state) => state.userProfile)
  const result = useGameStore((state) => state.result)
  const setScreen = useGameStore((state) => state.setScreen)
  const resetGame = useGameStore((state) => state.resetGame)

  const [factIdx, setFactIdx] = useState(() => Math.floor(Math.random() * factoids.length))
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [email, setEmail] = useState(userProfile?.email ?? '')
  const [consent, setConsent] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [sendSuccess, setSendSuccess] = useState('')

  useEffect(() => {
    const timer = window.setInterval(() => setFactIdx((idx) => (idx + 1) % factoids.length), 8000)
    return () => window.clearInterval(timer)
  }, [])

  const display = useMemo(() => {
    if (!userProfile || !result) return null
    return {
      delta: formatDeltaLine(userProfile.age, result.muscleAge),
      percentile: Math.round(result.percentile),
      muscleAge: Math.round(result.muscleAge),
    }
  }, [result, userProfile])

  if (!userProfile || !result || !display) {
    return (
      <section className="flex h-full items-center justify-center">
        <button type="button" className="tap-btn rounded-full border px-6 py-3" onClick={resetGame}>Restart</button>
      </section>
    )
  }

  const submitEmail = async () => {
    const trimmedEmail = email.trim()
    const emailApiUrl = import.meta.env.VITE_EMAIL_API_URL?.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    setSendError('')
    setSendSuccess('')

    if (!emailRegex.test(trimmedEmail)) {
      setSendError('Please enter a valid email address.')
      return
    }

    if (!emailApiUrl) {
      setSendError('Email service is not configured. Set VITE_EMAIL_API_URL in your environment.')
      return
    }

    const payload = {
      email: trimmedEmail,
      consent,
      name: userProfile.name,
      grip: result.bestGrip,
      percentile: display.percentile,
      muscleAge: display.muscleAge,
      tier: result.celebrityTier.name,
      cellType: result.cellType.name,
    }

    try {
      setIsSending(true)
      const response = await fetch(emailApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      setSendSuccess('Results sent successfully.')
      window.setTimeout(() => {
        setShowEmailModal(false)
        setSendSuccess('')
      }, 1200)
    } catch (error) {
      console.error('EMAIL_RESULTS_ERROR', error)
      setSendError('Could not send email right now. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className="h-full w-full px-3 pb-3 pt-20 md:px-6 md:pb-5 md:pt-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel h-full w-full overflow-y-auto p-6 text-left md:p-8"
      >
        <header className="mb-5 border-b border-entelo-white/10 pb-4">
          <h2 className="bg-gradient-to-r from-entelo-blue via-[#66d5ff] to-entelo-blue bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
            🧬 YOUR STRENGTH DECODED
          </h2>
          <p className="mt-2 text-lg text-entelo-white/80">{userProfile.name} • {new Date().toLocaleDateString()}</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="section-card md:col-span-2">
            <p className="section-title">Muscle Age</p>
            <p className="text-7xl font-bold text-entelo-blue md:text-8xl">{display.muscleAge}</p>
            <p className="mt-2 text-lg text-entelo-white/90">
              Your actual age: {userProfile.age} → Your muscle age: {display.muscleAge}
            </p>
            <p className={`mt-2 text-lg font-semibold ${display.delta.tone}`}>{display.delta.text}</p>
          </article>

          <article className="section-card">
            <p className="section-title">Celebrity Match</p>
            <p className="mt-1 text-2xl font-semibold">{result.celebrityTier.celebrity}</p>
            <p className="text-lg text-entelo-blue">{result.celebrityTier.name.toUpperCase()} TIER</p>
            <p className="mt-2 text-lg text-entelo-white/90">{result.celebrityTier.icon} {result.celebrityTier.flavourText}</p>
          </article>

          <article className="section-card">
            <p className="section-title">Cell Identity</p>
            <p className="mt-1 text-2xl font-semibold">{result.cellType.icon} {result.cellType.name}</p>
            <p className="mt-2 text-lg text-entelo-white/90">{result.cellType.description}</p>
            <p className="mt-2 text-base text-entelo-white/80">
              At Entelo Bio, we decode cells like these at single-cell resolution to find new precision medicines for muscle-wasting diseases.
            </p>
          </article>

          <article className="section-card">
            <p className="section-title">Stats</p>
            <p className="text-lg text-entelo-white/95">Grip: {result.bestGrip.toFixed(1)} kg</p>
            <p className="text-lg text-entelo-white/95">Percentile: {display.percentile}th</p>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-entelo-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-entelo-teal to-entelo-blue" style={{ width: `${display.percentile}%` }} />
            </div>
          </article>

          <article className="section-card">
            <p className="section-title">Did You Know?</p>
            <p className="text-lg text-entelo-white/95">{factoids[factIdx]}</p>
          </article>

          <footer className="section-card md:col-span-2">
            <div className="rounded-lg border border-entelo-white/20 bg-entelo-navy/45 p-4 text-center text-lg text-entelo-white/95">
              <p className="mb-3 text-base tracking-[0.1em] text-entelo-white/80">SCAN TO LEARN MORE</p>
              <a
                href="https://resilience.study"
                target="_blank"
                rel="noreferrer"
                className="mx-auto block w-fit"
                aria-label="Open resilience.study"
              >
                <img
                  src={enteloQrCode}
                  alt="QR code linking to resilience.study"
                  className="mx-auto h-32 w-32 rounded-md border border-entelo-white/20 bg-white p-1"
                />
              </a>
              <p className="mt-3 text-base text-entelo-white/80">resilience.study</p>
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-3">
              <button type="button" className="tap-btn action-btn text-lg" onClick={() => setScreen('leaderboard')}>🏆 LEADERBOARD</button>
              <button type="button" className="tap-btn action-btn text-lg" onClick={resetGame}>🔄 PLAY AGAIN</button>
              <button type="button" className="tap-btn btn-primary text-lg" onClick={() => setShowEmailModal(true)}>📧 EMAIL MY RESULTS</button>
            </div>
          </footer>
        </div>
      </motion.div>

      {showEmailModal ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="glass-panel w-full max-w-md p-5">
            <h3 className="text-lg font-semibold">Email your results</h3>
            <label className="mt-3 flex flex-col gap-2">
              <span className="text-sm text-entelo-white/85">Email</span>
              <input className="input-base" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" />
            </label>
            <label className="mt-3 flex items-start gap-2 text-sm text-entelo-white/80">
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1" />
              I'd like to hear about Entelo Bio's research.
            </label>
            {sendError ? <p className="mt-3 text-sm text-rose-300">{sendError}</p> : null}
            {sendSuccess ? <p className="mt-3 text-sm text-emerald-300">{sendSuccess}</p> : null}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="tap-btn action-btn"
                onClick={() => {
                  setSendError('')
                  setSendSuccess('')
                  setShowEmailModal(false)
                }}
                disabled={isSending}
              >
                Cancel
              </button>
              <button type="button" className="tap-btn btn-primary px-4" onClick={submitEmail} disabled={isSending}>
                {isSending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
