import { useContext } from 'react'

import { LanguageContext }
from '../context/LanguageContext'

import { translations }
from '../translations/translations'
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, Menu, X, Scan } from 'lucide-react'





export default function Navbar() {

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const location = useLocation()

  const { language, setLanguage } =
    useContext(LanguageContext)

  const t = translations[language]

  // Detect scroll
  useEffect(() => {

    const onScroll = () =>
      setScrolled(window.scrollY > 20)

    window.addEventListener(
      'scroll',
      onScroll,
      { passive: true }
    )

    return () =>
      window.removeEventListener('scroll', onScroll)

  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const navLinks = [
    { to: '/', label: t.home },
    { to: '/upload', label: t.upload },
    { to: '/history', label: t.history },
  ]

  return (

    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? 'bg-leaf-950/90 backdrop-blur-md border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      }`}
    >

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
        >

          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-leaf-400 to-leaf-600 flex items-center justify-center shadow-md shadow-leaf-900/50 group-hover:scale-110 transition-transform">

            <Leaf size={16} className="text-white" />

          </div>

          <span className="font-display font-bold text-lg tracking-tight text-white">

            CropShield
            <span className="text-leaf-400">
              {' '}AI
            </span>

          </span>

        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">

          {navLinks.map(({ to, label }) => (

            <Link
              key={to}
              to={to}
              className={`text-sm font-medium transition-colors duration-150 ${
                location.pathname === to
                  ? 'text-leaf-400'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {label}
            </Link>

          ))}

          <Link
            to="/upload"
            className="btn-primary !py-2 !px-5 !text-sm"
          >

            <Scan size={15} />

            {t.analyse}

          </Link>

          {/* Language Switcher */}
          <div className="flex gap-2">

            <button
              onClick={() => setLanguage('en')}
              className="px-2 py-1 rounded bg-green-900 hover:bg-green-800 text-sm"
            >
              EN
            </button>

            <button
              onClick={() => setLanguage('hi')}
              className="px-2 py-1 rounded bg-green-900 hover:bg-green-800 text-sm"
            >
              हिन्दी
            </button>

            <button
              onClick={() => setLanguage('as')}
              className="px-2 py-1 rounded bg-green-900 hover:bg-green-800 text-sm"
            >
              অসমীয়া
            </button>

          </div>

        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen((p) => !p)}
          className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          aria-label="Toggle menu"
        >

          {menuOpen
            ? <X size={22} />
            : <Menu size={22} />
          }

        </button>

      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>

        {menuOpen && (

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/10 bg-leaf-950/95 backdrop-blur-md"
          >

            <nav className="flex flex-col gap-1 p-4">

              {navLinks.map(({ to, label }) => (

                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === to
                      ? 'bg-leaf-500/20 text-leaf-400'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {label}
                </Link>

              ))}

              <Link
                to="/upload"
                className="btn-primary mt-2 justify-center !py-3"
              >

                <Scan size={16} />

                {t.analyse}

              </Link>

              {/* Mobile Language Buttons */}
              <div className="flex gap-2 mt-4 justify-center">

                <button
                  onClick={() => setLanguage('en')}
                  className="px-3 py-1 rounded bg-green-900"
                >
                  EN
                </button>

                <button
                  onClick={() => setLanguage('hi')}
                  className="px-3 py-1 rounded bg-green-900"
                >
                  हिन्दी
                </button>

                <button
                  onClick={() => setLanguage('as')}
                  className="px-3 py-1 rounded bg-green-900"
                >
                  অসমীয়া
                </button>

              </div>

            </nav>

          </motion.div>

        )}

      </AnimatePresence>

    </header>
  )
}


