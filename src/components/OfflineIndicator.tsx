import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function OfflineIndicator() {
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed left-1/2 top-3 z-50 -translate-x-1/2 rounded-full border border-amber-400/40 bg-amber-900/80 px-4 py-1.5 text-sm font-medium text-amber-200 shadow-lg backdrop-blur-sm"
        >
          Offline — results will sync when reconnected
        </motion.div>
      )}
    </AnimatePresence>
  )
}
