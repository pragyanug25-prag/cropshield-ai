import { motion } from 'framer-motion'

// ─── LoadingSpinner ────────────────────────────────────────────────────────────
// Shown while the AI analyses the uploaded image.
// Receives imageUrl (object URL) so we can show a scanning animation.

const STEPS = [
  'Preprocessing image…',
  'Identifying leaf structure…',
  'Analysing lesion patterns…',
  'Matching disease signatures…',
  'Generating treatment plan…',
]

export default function LoadingSpinner({ imageUrl, stepIndex = 0 }) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12">
      {/* Scan animation */}
      {imageUrl && (
        <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-2xl overflow-hidden border-2 border-leaf-500/40 shadow-xl shadow-leaf-900/40">
          <img
            src={imageUrl}
            alt="Analysing"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-leaf-950/30" />
          {/* Scanning line */}
          <div className="scan-line" />
          {/* Corner brackets */}
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => (
            <div
              key={pos}
              className={`absolute w-6 h-6 border-leaf-400 ${
                pos.includes('top') ? 'top-3' : 'bottom-3'
              } ${
                pos.includes('left') ? 'left-3 border-l-2 border-t-2' : 'right-3 border-r-2 border-t-2'
              } ${pos.includes('bottom') && '!border-t-0 !border-b-2'}`}
            />
          ))}
        </div>
      )}

      {/* Spinner ring */}
      <div className="relative flex items-center justify-center">
        <motion.div
          className="w-14 h-14 rounded-full border-4 border-leaf-500/20 border-t-leaf-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />
        <span className="absolute text-xl">🔬</span>
      </div>

      {/* Status text */}
      <div className="text-center">
        <motion.p
          key={stepIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="text-white/70 text-sm font-medium"
        >
          {STEPS[Math.min(stepIndex, STEPS.length - 1)]}
        </motion.p>
        <p className="text-white/30 text-xs mt-1">Please keep the page open</p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {STEPS.map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            animate={{
              backgroundColor:
                i <= stepIndex
                  ? 'rgb(74, 222, 128)'
                  : 'rgba(255,255,255,0.15)',
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  )
}
