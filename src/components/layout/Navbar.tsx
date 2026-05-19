import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { navLinks } from '../../data/mockData';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-blue-950 shadow-lg">
      {/* Top bar */}
      <div className="bg-blue-900/80 border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs text-blue-200 py-1.5">
          <span>República Bolivariana de Venezuela — Estado Mérida</span>
          <span className="hidden sm:inline">Gobierno en línea</span>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0" onClick={() => setMobileOpen(false)}>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
              <svg viewBox="0 0 48 48" className="w-8 h-8 md:w-10 md:h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="22" fill="#1e3a5f" />
                <path d="M24 8L14 18v12l10 10 10-10V18L24 8z" fill="#c9a84c" stroke="#fff" strokeWidth="0.5" />
                <text x="24" y="28" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold" fontFamily="serif">CEM</text>
              </svg>
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-bold text-sm md:text-base leading-tight">Contraloría del</p>
              <p className="text-blue-200 text-xs md:text-sm leading-tight">Estado Mérida</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 xl:px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:bg-blue-800/50 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-800 transition-colors"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? 'max-h-96 border-t border-blue-800' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-3 space-y-1 bg-blue-900/95">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-blue-800 text-white'
                  : 'text-blue-100 hover:bg-blue-800/50 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
