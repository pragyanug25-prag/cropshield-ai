/*import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RefreshCcw, Home, AlertTriangle } from 'lucide-react'
import ResultCard from '../components/ResultCard'

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -20 },
}

export default function Result() {
  const [result, setResult] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const navigate = useNavigate()

  // Read diagnosis + image URL placed in sessionStorage by the Upload page
  useEffect(() => {
    const raw = sessionStorage.getItem('cropshield_result')
    const img = sessionStorage.getItem('cropshield_image')

    if (!raw) {
      // Nothing to show — redirect back
      navigate('/upload', { replace: true })
      return
    }

    try {
      setResult(JSON.parse(raw))
      if (img) setImageUrl(img)
    } catch {
      navigate('/upload', { replace: true })
    }
  }, [navigate])

  const handleScanAnother = () => {
    sessionStorage.removeItem('cropshield_result')
    sessionStorage.removeItem('cropshield_image')
    navigate('/upload')
  }

  if (!result) return null

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-24 pb-16 px-4 sm:px-6"
    >*/

     // <div className="max-w-2xl mx-auto">
        {/* Page header */}
        /*<div className="text-center mb-8">
          <p className="eyebrow mb-2">Diagnosis Complete</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Analysis Results
          </h1>
        </div>*/

        {/* Disclaimer banner */}
        /*<motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20"
        >
          <AlertTriangle size={16} className="text-yellow-400 mt-0.5 shrink-0" />
          <p className="text-xs text-yellow-300/80">
            AI results are indicative only. Always confirm with a certified agronomist before applying treatments.
          </p>
        </motion.div>*/

        {/* Main result card */}
        //<ResultCard result={result} imageUrl={imageUrl} />

        {/* Action buttons */}
        /*<motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row gap-3"
        >
          <button
            onClick={handleScanAnother}
            className="btn-primary flex-1 justify-center text-base"
          >
            <RefreshCcw size={17} />
            Scan Another Leaf
          </button>
          <Link to="/" className="btn-secondary flex-1 justify-center text-base">
            <Home size={17} />
            Back to Home
          </Link>
        </motion.div>*/

        {/* Scan metadata */}
        /*<p className="text-center text-white/20 text-xs mt-6">
          Analysed at {new Date(result.analysedAt).toLocaleTimeString()} ·{' '}
          File size: {result.imageSize}
        </p>
      </div>
    </motion.div>
  )
}*/



import {
  CircularProgressbar,
  buildStyles
} from 'react-circular-progressbar'

import 'react-circular-progressbar/dist/styles.css'

import { useContext } from 'react'

import { LanguageContext }
from '../context/LanguageContext'

import { translations }
from '../translations/translations'

export default function Result() {

  const { language } =
    useContext(LanguageContext)

  const t = translations[language]

  const result = JSON.parse(
    sessionStorage.getItem('cropshield_result')
  )

  const image = sessionStorage.getItem('cropshield_image')

  if (!result) {
    return (
      <div className="text-white p-10">
        No result found
      </div>
    )
  }

  return (

  
<div className="min-h-screen bg-green-950 text-white pt-24 px-4">

  <div className="max-w-3xl mx-auto">




      <h1 className="text-5xl font-bold mb-8">
        {t.detectionResult}
      </h1>

      {image && (
        <img
          src={image}
          alt="Plant"
          className="w-80 rounded-xl mb-8"
        />
      )}

      <div className="space-y-6">

        <div>

          <h2 className="text-3xl font-bold">
            {result.disease}
          </h2>

          <div className="w-40 h-40 mt-6">

            <CircularProgressbar
              value={result.confidence}
              text={`${result.confidence}%`}
              styles={buildStyles({

                textColor: '#ffffff',

                pathColor:
                  result.confidence >= 90
                    ? '#22c55e'
                    : result.confidence >= 70
                    ? '#eab308'
                    : '#ef4444',

                trailColor: '#14532d',
              })}
            />

          </div>

          <p className="mt-4">

            {t.severity}: {
              t.severityLevels?.[result.severity]
              || result.severity
            }

          </p>

        </div>

        {/* Description */}
        <div>

          <h3 className="text-2xl font-semibold mb-2">
            {t.description}
          </h3>

          <p>

            {
              t.content?.[result.description]
              || result.description
            }

          </p>

        </div>

        {/* Treatment */}
        <div>

          <h3 className="text-2xl font-semibold mb-2">
            {t.treatment}
          </h3>

          <ul className="list-disc pl-6 space-y-1">

            {result.treatment?.map((item, index) => (

              <li key={index}>

                {
                  t.content?.[item]
                  || item
                }

              </li>

            ))}

          </ul>

        </div>

        {/* Prevention */}
        <div>

          <h3 className="text-2xl font-semibold mb-2">
            {t.prevention}
          </h3>

          <ul className="list-disc pl-6 space-y-1">

            {result.prevention?.map((item, index) => (

              <li key={index}>

                {
                  t.content?.[item]
                  || item
                }

              </li>

            ))}

          </ul>

        </div>

        {/* Organic Treatment */}
        <div>

          <h3 className="text-2xl font-semibold mb-2">
            {t.organicTreatment}
          </h3>

          <ul className="list-disc pl-6 space-y-1">

            {result.organicTreatment?.map((item, index) => (

              <li key={index}>

                {
                  t.content?.[item]
                  || item
                }

              </li>

            ))}

          </ul>

        </div>

      </div>

    </div>
    </div>
  )
}





