import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, Image, X, Check } from 'lucide-react'


import { useContext } from 'react'

import { LanguageContext }
from '../context/LanguageContext'

import { translations }
from '../translations/translations'



// ─── UploadBox ─────────────────────────────────────────────────────────────────
// Handles drag-and-drop, click-to-browse, and camera capture.
// Calls onFileSelect(File) when a valid image is chosen.

export default function UploadBox({ onFileSelect, selectedFile, onClear }) {

  
  const { language } =
    useContext(LanguageContext)

  const t = translations[language]


  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const cameraRef = useRef(null)

  // Validate and forward accepted files
  const processFile = useCallback((file) => {
    setError('')
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WEBP, HEIC).')
      return
    }
    if (file.size > 15 * 1024 * 1024) {
      setError('Image must be smaller than 15 MB.')
      return
    }
    onFileSelect(file)
  }, [onFileSelect])

  // ── Drag events ──
  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)
  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    processFile(e.dataTransfer.files[0])
  }

  // Preview URL from File object
  const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : null

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {/* ── Image preview ── */}
        {selectedFile ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="relative rounded-2xl overflow-hidden border-2 border-leaf-500/50 shadow-xl shadow-leaf-900/30"
          >
            <img
              src={previewUrl}
              alt="Selected leaf"
              className="w-full h-72 sm:h-96 object-cover"
            />
            {/* Overlay controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
              <div className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2 glass-card px-3 py-1.5 flex-1 min-w-0">
                  <Check size={14} className="text-leaf-400 shrink-0" />
                  <span className="text-sm text-white/80 truncate">{selectedFile.name}</span>
                </div>
                <button
                  onClick={onClear}
                  className="p-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition"
                  aria-label="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── Drop zone ── */
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`
              cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200
              flex flex-col items-center justify-center gap-4 p-10 sm:p-16 text-center
              ${dragging
                ? 'border-leaf-400 bg-leaf-500/10 scale-[1.01]'
                : 'border-white/20 hover:border-leaf-500/50 hover:bg-white/5'}
            `}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${dragging ? 'bg-leaf-500/30' : 'bg-white/5'}`}>
              <UploadCloud size={28} className={dragging ? 'text-leaf-300' : 'text-white/40'} />
            </div>

            <div>
              <p className="text-white font-semibold text-lg">
                
                  {
                    dragging
                      ? t.dropHere
                      : t.dragDrop
                  }


              </p>
              <p className="text-white/50 text-sm mt-1">
                {t.browseText}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Gallery / Camera buttons ── */}
      {!selectedFile && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => inputRef.current?.click()}
            className="flex items-center justify-center gap-2 glass-card px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/10 transition rounded-xl"
          >
            <Image size={16} className="text-leaf-400" />
            {t.gallery}
          </button>
          <button
            onClick={() => cameraRef.current?.click()}
            className="flex items-center justify-center gap-2 glass-card px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/10 transition rounded-xl"
          >
            <span className="text-leaf-400 text-base leading-none">📷</span>
            {t.camera}
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm text-red-400 text-center"
        >
          {error}
        </motion.p>
      )}

      {/* Hidden file inputs */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => processFile(e.target.files[0])}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => processFile(e.target.files[0])}
      />
    </div>
  )
}
