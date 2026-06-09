import { motion } from 'framer-motion'
import { AlertCircle, FlaskConical, Leaf, ShieldCheck } from 'lucide-react'
import ConfidenceBar from './ConfidenceBar'

// ─── Section wrapper used throughout the result ───────────────────────────────
function Section({ icon: Icon, title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass-card p-5 sm:p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-leaf-500/20 flex items-center justify-center">
          <Icon size={15} className="text-leaf-400" />
        </div>
        <h3 className="font-semibold text-white text-sm uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </motion.div>
  )
}

// ─── Severity badge ───────────────────────────────────────────────────────────
function SeverityBadge({ severity }) {
  const classes = {
    low: 'severity-low',
    medium: 'severity-medium',
    high: 'severity-high',
  }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${classes[severity] || 'severity-low'}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)} Severity
    </span>
  )
}

// ─── Product card ─────────────────────────────────────────────────────────────
function ProductCard({ name, type, dosage }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
      <div className="w-8 h-8 rounded-lg bg-leaf-500/15 flex items-center justify-center shrink-0">
        <FlaskConical size={14} className="text-leaf-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-white">{name}</p>
        <p className="text-xs text-white/40 mt-0.5">{type} · {dosage}</p>
      </div>
    </div>
  )
}

// ─── Main ResultCard ──────────────────────────────────────────────────────────
export default function ResultCard({ result, imageUrl }) {
  if (!result) return null

  return (
    <div className="flex flex-col gap-5">
      {/* ── Header: image + disease identity ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row gap-0">
          {/* Uploaded photo */}
          {imageUrl && (
            <div className="sm:w-48 shrink-0 h-48 sm:h-auto relative overflow-hidden">
              <img
                src={imageUrl}
                alt="Analysed leaf"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 sm:block hidden" />
            </div>
          )}
          {/* Identity info */}
          <div className="p-5 sm:p-6 flex flex-col justify-center gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <SeverityBadge severity={result.severity} />
              <span className="eyebrow">{result.host}</span>
            </div>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                {result.icon} {result.name}
              </h2>
              <p className="text-leaf-400 text-sm italic mt-0.5">{result.scientificName}</p>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">{result.description}</p>
          </div>
        </div>
      </motion.div>

      {/* ── Confidence bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-5 sm:p-6"
      >
        <ConfidenceBar value={result.confidence} />
      </motion.div>

      {/* ── Symptoms ── */}
      <Section icon={AlertCircle} title="Key Symptoms" delay={0.2}>
        <ul className="flex flex-col gap-2">
          {result.symptoms.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-white/70">
              <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-leaf-500 shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Treatment steps ── */}
      <Section icon={ShieldCheck} title="Treatment Plan" delay={0.3}>
        <ol className="flex flex-col gap-4">
          {result.treatment.map((t) => (
            <li key={t.step} className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-leaf-500/20 text-leaf-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {t.step}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{t.action}</p>
                <p className="text-xs text-white/50 mt-0.5">{t.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── Recommended products ── */}
      <Section icon={FlaskConical} title="Recommended Products" delay={0.4}>
        <div className="flex flex-col gap-2">
          {result.products.map((p, i) => (
            <ProductCard key={i} {...p} />
          ))}
        </div>
        <p className="text-xs text-white/30 mt-3">
          * Always follow label instructions. Consult your local agronomist before use.
        </p>
      </Section>

      {/* ── Prevention tips ── */}
      <Section icon={Leaf} title="Prevention Tips" delay={0.5}>
        <ul className="flex flex-col gap-2.5">
          {result.prevention.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-white/70">
              <span className="text-leaf-400 mt-0.5">✓</span>
              {tip}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}
