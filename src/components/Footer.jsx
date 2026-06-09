import { Leaf, Github } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-leaf-950/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-leaf-400 to-leaf-600 flex items-center justify-center">
              <Leaf size={13} className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-sm">
              CropShield <span className="text-leaf-400">AI</span>
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-xs text-white/40">
            <Link to="/" className="hover:text-white/70 transition">Home</Link>
            <Link to="/upload" className="hover:text-white/70 transition">Scan</Link>
            <a href="#" className="hover:text-white/70 transition">Privacy</a>
            <a href="#" className="hover:text-white/70 transition">Terms</a>
          </nav>

          {/* Note */}
          <p className="text-xs text-white/25 text-center sm:text-right">
            
          </p>
        </div>
      </div>
    </footer>
  )
}
