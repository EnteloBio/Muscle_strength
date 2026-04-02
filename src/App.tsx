import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo } from 'react'
import { ParticleBackground } from './components/ParticleBackground'
import { useGameStore } from './hooks/useGameStore'
import { GripScreen } from './pages/GripScreen'
import { LeaderboardScreen } from './pages/LeaderboardScreen'
import { LoadingScreen } from './pages/LoadingScreen'
import { ProfileScreen } from './pages/ProfileScreen'
import { ResultsScreen } from './pages/ResultsScreen'
import { WelcomeScreen } from './pages/WelcomeScreen'
import enteloLogo from '../logos/Logo Black.svg'

function App() {
  const currentScreen = useGameStore((state) => state.currentScreen)
  const setScreen = useGameStore((state) => state.setScreen)
  const resetGame = useGameStore((state) => state.resetGame)

  const captureMode = useMemo(
    () => new URLSearchParams(window.location.search).get('capture') === '1',
    [],
  )

  useEffect(() => {
    if (currentScreen !== 'results') return

    let timeout = window.setTimeout(() => resetGame(), 60000)

    const poke = () => {
      window.clearTimeout(timeout)
      timeout = window.setTimeout(() => resetGame(), 60000)
    }

    window.addEventListener('pointerdown', poke)
    window.addEventListener('keydown', poke)
    return () => {
      window.clearTimeout(timeout)
      window.removeEventListener('pointerdown', poke)
      window.removeEventListener('keydown', poke)
    }
  }, [currentScreen, resetGame])

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-entelo-dark text-entelo-white">
      {!captureMode ? <ParticleBackground /> : null}

      {currentScreen !== 'welcome' ? (
        <div className="pointer-events-none absolute left-4 top-4 z-30 flex items-center rounded-full border border-entelo-white/25 bg-entelo-navy/85 px-5 py-3 shadow-[0_0_36px_rgba(139,125,184,0.18)] backdrop-blur-sm">
          <img src={enteloLogo} alt="Entelo Bio" className="entelo-logo-wordmark h-7" />
        </div>
      ) : null}

      <button
        type="button"
        className="tap-btn absolute right-4 top-4 z-30 rounded-full border border-entelo-white/20 bg-entelo-navy/60 px-3 py-2 text-xs text-entelo-white/80"
        onClick={() => {
          resetGame()
          setScreen('welcome')
        }}
      >
        Reset
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.28 }}
          className="relative z-20 h-full"
        >
          {currentScreen === 'welcome' ? <WelcomeScreen /> : null}
          {currentScreen === 'profile' ? <ProfileScreen /> : null}
          {currentScreen === 'grip' ? <GripScreen /> : null}
          {currentScreen === 'loading' ? <LoadingScreen /> : null}
          {currentScreen === 'results' ? <ResultsScreen /> : null}
          {currentScreen === 'leaderboard' ? <LeaderboardScreen /> : null}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}

export default App
