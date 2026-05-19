import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { navLinks } from '../../data/mockData';
import { useSiteConfig } from '../../context/SiteConfigContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { config } = useSiteConfig();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 shadow-md bg-white border-b-4 border-amber-500">
      {/* Top bar */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs py-1.5 opacity-90">
          <span>República Bolivariana de Venezuela — Estado Mérida</span>
          <span className="hidden sm:inline font-medium">Gobierno en línea</span>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0" onClick={() => setMobileOpen(false)}>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden p-1">
              {config.logoBase64 ? (
                <img src={config.logoBase64} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="22" fill="#1e3a5f" />
                  <path d="M24 8L14 18v12l10 10 10-10V18L24 8z" fill="#c9a84c" stroke="#fff" strokeWidth="0.5" />
                  <text x="24" y="28" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold" fontFamily="serif">CEM</text>
                </svg>
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-blue-900 font-extrabold text-sm md:text-base leading-tight uppercase tracking-tight">{config.titulo}</p>
              <p className="text-gray-500 text-xs md:text-sm leading-tight font-medium">{config.subtitulo}</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 xl:px-4 py-2 rounded-md text-sm font-bold transition-all duration-200 uppercase tracking-wide ${
                  isActive(link.path)
                    ? 'text-blue-900 bg-slate-100 shadow-sm'
                    : 'text-gray-600 hover:text-red-700 hover:bg-slate-50'
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
            className="lg:hidden p-2 rounded-md text-blue-900 hover:bg-slate-100 transition-colors"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 bg-white ${
          mobileOpen ? 'max-h-96 border-t border-gray-100 shadow-inner' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-md text-sm font-bold uppercase transition-colors ${
                isActive(link.path)
                  ? 'text-blue-900 bg-slate-100'
                  : 'text-gray-600 hover:text-red-700 hover:bg-slate-50'
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
