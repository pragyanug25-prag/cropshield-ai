import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// ─── ConfidenceBar ─────────────────────────────────────────────────────────────
// Animated horizontal progress bar with colour coding by confidence level.

export default function ConfidenceBar({ value }) {
  const [animated, setAnimated] = useState(0)

  // Animate on mount
  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 100)
    return () => clearTimeout(t)
  }, [value])

  // Colour thresholds
  const color =
    value >= 85
      ? 'from-emerald-400 to-leaf-500'
      : value >= 65
      ? 'from-yellow-400 to-amber-500'
      : 'from-red-400 to-rose-500'

  const label =
    value >= 85 ? 'High Confidence' : value >= 65 ? 'Moderate Confidence' : 'Low Confidence'

  return (
    <div className="w-full">
      {/* Label row */}
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-xs text-white/50 font-medium uppercase tracking-wider">
          AI Confidence
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-white">{value}</span>
          <span className="text-sm text-white/50">%</span>
        </div>
      </div>

      {/* Track */}
      <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${animated}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </div>

      <p className="mt-1.5 text-xs text-right text-white/40">{label}</p>
    </div>
  )
}
