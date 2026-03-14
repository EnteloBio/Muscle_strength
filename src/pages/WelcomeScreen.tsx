import { motion } from 'framer-motion'
import { useGameStore } from '../hooks/useGameStore'
import enteloLogo from '../../logos/Logo Black.svg'

export function WelcomeScreen() {
  const setScreen = useGameStore((state) => state.setScreen)

  return (
    <section className="mx-auto flex h-full w-full max-w-7xl items-center justify-center px-5 py-8 md:px-10">
      <div className="glass-panel w-full max-w-5xl p-10 text-center md:p-14 lg:p-16">
        <div className="mb-10 flex justify-center">
          <div className="rounded-2xl border border-entelo-white/20 bg-entelo-navy/90 px-8 py-6 shadow-[0_0_40px_rgba(139,125,184,0.2)] md:px-12 md:py-8">
            <img
              src={enteloLogo}
              alt="Entelo Bio"
              className="entelo-logo-wordmark w-[300px] md:w-[460px] lg:w-[560px]"
            />
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-6 text-6xl font-bold leading-[0.92] text-entelo-white md:text-8xl lg:text-9xl"
        >
          DECODE YOUR STRENGTH
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mb-10 max-w-4xl text-lg text-entelo-white/90 md:text-2xl"
        >
          How does your grip compare? Find out your muscle age, celebrity match, and cell
          identity.
        </motion.p>

        <p className="mx-auto mb-8 max-w-3xl text-sm uppercase tracking-[0.16em] text-entelo-white/70 md:text-base">
          Biology unveiled - medicines redefined
        </p>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          animate={{ boxShadow: ['0 0 0px #8b7db855', '0 0 34px #8b7db899', '0 0 0px #8b7db855'] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="tap-btn btn-primary px-10 py-4 text-lg md:px-12"
          onClick={() => setScreen('profile')}
        >
          START THE TEST →
        </motion.button>

        <p className="mt-10 text-sm text-entelo-white/65">Powered by science. Fuelled by curiosity.</p>
      </div>
    </section>
  )
}
