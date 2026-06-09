
import { useContext } from 'react'

import { LanguageContext }
  from '../context/LanguageContext'

import { translations }
  from '../translations/translations'


import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Scan, Sun, Focus, Wind } from 'lucide-react'
import UploadBox from '../components/UploadBox'
import LoadingSpinner from '../components/LoadingSpinner'
import { analyzeImage } from '../services/api'

// ─── Photography tip ──────────────────────────────────────────────────────────
function Tip({ icon: Icon, title, body }) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-lg bg-leaf-500/15 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={14} className="text-leaf-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-white/50 mt-0.5">{body}</p>
      </div>
    </div>
  )
}


const TIPS = {

  en: [
    {
      icon: Sun,
      title: 'Good lighting',
      body: 'Natural daylight or bright shade — avoid flash glare and deep shadows.'
    },

    {
      icon: Focus,
      title: 'Sharp focus',
      body: 'Tap to focus on the lesion. Blurry images reduce accuracy.'
    },

    {
      icon: Wind,
      title: 'Affected area front and centre',
      body: 'Fill the frame with the diseased leaf. Include one healthy leaf for comparison if possible.'
    },
  ],

  hi: [
    {
      icon: Sun,
      title: 'अच्छी रोशनी',
      body: 'प्राकृतिक रोशनी का उपयोग करें। तेज चमक और गहरी छाया से बचें।'
    },

    {
      icon: Focus,
      title: 'स्पष्ट फोकस',
      body: 'बीमारी वाले हिस्से पर फोकस करें। धुंधली तस्वीर सटीकता कम करती है।'
    },

    {
      icon: Wind,
      title: 'प्रभावित भाग दिखाएँ',
      body: 'बीमार पत्ते को फ्रेम में स्पष्ट रखें।'
    },
  ],

  as: [
    {
      icon: Sun,
      title: 'ভাল পোহৰ',
      body: 'প্ৰাকৃতিক পোহৰ ব্যৱহাৰ কৰক। অত্যাধিক উজ্জ্বলতা আৰু গভীৰ ছাঁ এৰক।'
    },

    {
      icon: Focus,
      title: 'স্পষ্ট ফোকাছ',
      body: 'ৰোগ থকা অংশত ফোকাছ কৰক। অস্পষ্ট ফটো সঠিকতা কমায়।'
    },

    {
      icon: Wind,
      title: 'আক্রান্ত অংশ দেখুৱাওক',
      body: 'ৰোগাক্ৰান্ত পাত স্পষ্টকৈ ফ্ৰেমত ৰাখক।'
    },
  ]
}



const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

export default function Upload() {

  const { language } =
    useContext(LanguageContext)

  const t = translations[language]


  const [file, setFile] = useState(null)
  const [analysing, setAnalysing] = useState(false)
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const stepTimer = useRef(null)

  // Advance the loading step indicator every 600 ms
  useEffect(() => {
    if (analysing) {
      stepTimer.current = setInterval(() => {
        setStep((s) => Math.min(s + 1, 4))
      }, 600)
    } else {
      clearInterval(stepTimer.current)
      setStep(0)
    }
    return () => clearInterval(stepTimer.current)
  }, [analysing])

  const handleAnalyse = async () => {
    if (!file) return
    setAnalysing(true)

    try {
      const result = await analyzeImage(file)


      // Load previous history
      const existingHistory = JSON.parse(
        localStorage.getItem('cropshield_history')
      ) || []

      // Create new history item
      const newHistoryItem = {
        disease: result.disease,
        confidence: result.confidence,
        severity: result.severity,
        image: URL.createObjectURL(file),
        date: new Date().toLocaleString(),
      }

      // Save updated history
      localStorage.setItem(
        'cropshield_history',
        JSON.stringify([
          newHistoryItem,
          ...existingHistory
        ])
      )


      // Store result in sessionStorage so Result page can read it without prop-drilling
      sessionStorage.setItem('cropshield_result', JSON.stringify(result))
      sessionStorage.setItem('cropshield_image', URL.createObjectURL(file))
      navigate('/result')
    } catch (err) {
      console.error(err)
      setAnalysing(false)
    }
  }

  const imageUrl = file ? URL.createObjectURL(file) : null

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-24 pb-16 px-4 sm:px-6"
    >
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="text-center mb-10">
          <p className="eyebrow mb-2">Step 1 of 2</p>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
            {t.uploadLeaf}
          </h1>


         
          <p className="text-white/50 mt-3 text-sm max-w-md mx-auto">
            {t.uploadDescription}
          </p>


        </div>

        {/* Upload / analysis area */}
        <div className="glass-card p-5 sm:p-7">
          {analysing ? (
            <LoadingSpinner imageUrl={imageUrl} stepIndex={step} />
          ) : (
            <>
              <UploadBox
                selectedFile={file}
                onFileSelect={setFile}
                onClear={() => setFile(null)}
              />

              {/* Analyse button */}
              <motion.button
                onClick={handleAnalyse}
                disabled={!file}
                whileHover={file ? { scale: 1.02 } : {}}
                whileTap={file ? { scale: 0.98 } : {}}
                className={`
                  mt-5 w-full flex items-center justify-center gap-2 py-4 rounded-xl
                  font-semibold text-base transition-all duration-200
                  ${file
                    ? 'bg-gradient-to-r from-leaf-500 to-leaf-600 text-white shadow-lg shadow-leaf-900/40 hover:from-leaf-400 hover:to-leaf-500'
                    : 'bg-white/10 text-white/30 cursor-not-allowed'}
                `}
              >
                <Scan size={18} />
                {file ? t.analyse : t.selectImage}
              </motion.button>
            </>
          )}
        </div>

        {/* Photography tips */}
        {!analysing && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 glass-card p-5 sm:p-6"
          >

            <p className="eyebrow mb-4">
              {t.photoTips}
            </p>


            <div className="flex flex-col gap-4">
              {TIPS[language].map((tip) => (
                <Tip key={tip.title} {...tip} />
              ))}

            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
