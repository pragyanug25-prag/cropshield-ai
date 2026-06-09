
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Scan,
  ChevronDown,
  Shield,
  Zap,
  BookOpen
} from 'lucide-react'

import { useContext } from 'react'

import { LanguageContext }
from '../context/LanguageContext'

import { translations }
from '../translations/translations'

// ─── Animated background blob ─────────────────────────────
function Blob({ className, delay = 0 }) {

  return (
    <div
      className={`blob ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  )
}

// ─── Feature chip ─────────────────────────────────────────
function FeatureChip({ icon: Icon, label }) {

  return (

    <div className="flex items-center gap-2 glass-card px-4 py-2 text-sm text-white/80">

      <Icon
        size={14}
        className="text-leaf-400"
      />

      {label}

    </div>
  )
}

export default function Hero() {

  const { language } =
    useContext(LanguageContext)

  const t = translations[language]

  return (

    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">

      {/* Animated background blobs */}
      <Blob
        className="w-96 h-96 bg-leaf-600 top-1/4 -left-32"
        delay={0}
      />

      <Blob
        className="w-80 h-80 bg-leaf-500 bottom-1/4 -right-24"
        delay={2.5}
      />

      <Blob
        className="w-64 h-64 bg-emerald-700 top-10 right-1/4"
        delay={5}
      />

      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.15),transparent)]" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: 'easeOut'
        }}
        className="relative z-10 max-w-4xl mx-auto"
      >

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.1,
            duration: 0.5
          }}
          className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8"
        >

          <span className="w-2 h-2 rounded-full bg-leaf-400 animate-pulse-slow" />

          <span className="eyebrow">
            {t.heroBadge}
          </span>

        </motion.div>

        {/* Main headline */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-tight text-shadow mb-4">

          <span className="text-white">
            {t.heroLine1}
          </span>

          <br />

          <span className="bg-gradient-to-r from-leaf-400 via-emerald-300 to-leaf-400 bg-clip-text text-transparent">

            {t.heroLine2}

          </span>

          <br />

          <span className="text-white text-4xl sm:text-5xl md:text-6xl">

            {t.heroLine3}

          </span>

        </h1>

        {/* Description */}
        <p className="mt-6 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">

          {t.heroDescription}

        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">

          <Link
            to="/upload"
            className="btn-primary text-base w-full sm:w-auto justify-center"
          >

            <Scan size={18} />

            {t.startScanning}

          </Link>

          <a
            href="#features"
            className="btn-secondary text-base w-full sm:w-auto justify-center"
          >

            {t.howItWorks}

          </a>

        </div>

        {/* Feature chips */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">

          <FeatureChip
            icon={Zap}
            label={t.fastResults}
          />

          <FeatureChip
            icon={Shield}
            label={t.highAccuracy}
          />

          <FeatureChip
            icon={BookOpen}
            label={t.treatmentIncluded}
          />

        </div>

      </motion.div>

      {/* Scroll */}
      <motion.a
        href="#features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 text-white/30 hover:text-white/60 transition-colors flex flex-col items-center gap-1"
      >

        <span className="text-xs tracking-widest uppercase">

          {t.scroll}

        </span>

        <ChevronDown
          size={18}
          className="animate-bounce"
        />

      </motion.a>

    </section>
  )
}

