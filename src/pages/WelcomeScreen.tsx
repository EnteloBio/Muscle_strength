import { motion } from 'framer-motion'
import { useGameStore } from '../hooks/useGameStore'

export function WelcomeScreen() {
  const setScreen = useGameStore((state) => state.setScreen)

  return (
    <section className="mx-auto flex h-full w-full max-w-4xl items-center justify-center px-4 py-6">
      <div className="glass-panel w-full max-w-3xl p-8 text-center md:p-12">
        <p className="mb-4 text-sm tracking-[0.4em] text-entelo-white/75">ENTELO BIO</p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-4 bg-gradient-to-r from-entelo-blue to-entelo-teal bg-clip-text text-4xl font-bold text-transparent md:text-6xl"
        >
          DECODE YOUR STRENGTH
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mb-8 max-w-2xl text-sm text-entelo-white/90 md:text-lg"
        >
          How does your grip compare? Find out your muscle age, celebrity match, and cell
          identity.
        </motion.p>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          animate={{ boxShadow: ['0 0 0px #00B4D8AA', '0 0 28px #00B4D8AA', '0 0 0px #00B4D8AA'] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="tap-btn min-h-12 rounded-full bg-gradient-to-r from-entelo-blue to-entelo-teal px-8 py-4 text-base font-semibold text-entelo-dark"
          onClick={() => setScreen('profile')}
        >
          START THE TEST →
        </motion.button>

        <p className="mt-8 text-xs text-entelo-white/60">Powered by science. Fuelled by curiosity.</p>
      </div>
    </section>
  )
}
