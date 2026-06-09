
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import {
  Zap,
  FlaskConical,
  Leaf,
  Camera,
  BarChart2,
  Map
} from 'lucide-react'

import { useContext } from 'react'

import { LanguageContext }
from '../context/LanguageContext'

import { translations }
from '../translations/translations'

import Hero from '../components/Hero'

// ─── Feature card ─────────────────────────────────────────
function FeatureCard({
  icon: Icon,
  title,
  body,
  delay
}) {

  return (

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay,
        duration: 0.5
      }}
      className="glass-card p-6 hover:bg-white/[0.14] transition-colors duration-200"
    >

      <div className="w-11 h-11 rounded-xl bg-leaf-500/20 flex items-center justify-center mb-4">

        <Icon
          size={20}
          className="text-leaf-400"
        />

      </div>

      <h3 className="font-semibold text-white text-lg mb-2">
        {title}
      </h3>

      <p className="text-white/50 text-sm leading-relaxed">
        {body}
      </p>

    </motion.div>
  )
}

// ─── How-it-works step ───────────────────────────────────
function Step({
  number,
  icon,
  title,
  description
}) {

  return (

    <div className="flex flex-col items-center text-center gap-3">

      <div className="relative">

        <div className="w-14 h-14 rounded-2xl bg-leaf-500/20 border border-leaf-500/30 flex items-center justify-center text-2xl">

          {icon}

        </div>

        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-leaf-500 text-white text-[10px] font-bold flex items-center justify-center">

          {number}

        </span>

      </div>

      <h4 className="font-semibold text-white">
        {title}
      </h4>

      <p className="text-white/50 text-sm max-w-[180px]">
        {description}
      </p>

    </div>
  )
}

// ─── Page transition ─────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export default function Home() {

  const { language } =
    useContext(LanguageContext)

  const t = translations[language]

  // FEATURES INSIDE COMPONENT
  const FEATURES = [

    {
      icon: Zap,
      title: t.instantDetection,
      body: t.instantDetectionBody,
    },

    {
      icon: FlaskConical,
      title: t.treatmentPlans,
      body: t.treatmentPlansBody,
    },

    {
      icon: Leaf,
      title: t.preventionTips,
      body: t.preventionTipsBody,
    },

    {
      icon: Camera,
      title: t.anyPhone,
      body: t.anyPhoneBody,
    },

    {
      icon: BarChart2,
      title: t.confidenceScoring,
      body: t.confidenceScoringBody,
    },

    {
      icon: Map,
      title: t.multipleCrops,
      body: t.multipleCropsBody,
    },
  ]

  return (

    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >

      {/* Hero */}
      <Hero />

      {/* Features */}
      <section
        id="features"
        className="py-20 px-4 sm:px-6 max-w-6xl mx-auto"
      >

        <div className="text-center mb-12">

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="eyebrow mb-3"
          >

            {t.featuresBadge}

          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl sm:text-6xl font-bold text-white leading-tight"
          >

            {t.featuresTitle1}

            <br />

            <span className="text-leaf-400">

              {t.featuresTitle2}

            </span>

          </motion.h2>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">

          {FEATURES.map((f, i) => (

            <FeatureCard
              key={f.title}
              {...f}
              delay={i * 0.07}
            />

          ))}

        </div>

      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-transparent via-leaf-900/20 to-transparent">

        <div className="max-w-4xl mx-auto text-center mb-12">

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="eyebrow mb-3"
          >

            {t.threeSteps}

          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl font-bold text-white"
          >

            {t.photoToTreatment}

          </motion.h2>

        </div>

        <div className="max-w-3xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-4 sm:gap-8"
          >

            <Step
              number={1}
              icon="📸"
              title={t.step1Title}
              description={t.step1Desc}
            />

            <Step
              number={2}
              icon="🤖"
              title={t.step2Title}
              description={t.step2Desc}
            />

            <Step
              number={3}
              icon="💊"
              title={t.step3Title}
              description={t.step3Desc}
            />

          </motion.div>

        </div>

      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto">

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-10 sm:p-14 text-center"
          style={{
            background:
              'linear-gradient(135deg, rgba(22,101,52,0.3) 0%, rgba(5,46,22,0.5) 100%)'
          }}
        >

          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">

            {t.cropWaiting}

          </h2>

          <p className="text-white/60 mb-8 max-w-md mx-auto">

            {t.cropWaitingDesc}

          </p>

          <Link
            to="/upload"
            className="btn-primary text-base inline-flex"
          >

            {t.scanNowFree}

          </Link>

        </motion.div>

      </section>

    </motion.div>
  )
}

