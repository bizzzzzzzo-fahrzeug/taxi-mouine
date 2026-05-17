import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getToken } from '../lib/api'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isLoggedIn = !!getToken()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const linkClass = (path) =>
    `text-sm font-medium transition-colors duration-200 ${
      location.pathname === path
        ? 'text-brand-600'
        : 'text-text-secondary hover:text-text'
    }`

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-border'
          : 'bg-white border-b border-transparent'
      }`}
    >
      <nav className="page-container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="text-2xl">🚕</span>
          <span className="text-lg font-bold text-text tracking-tight">
            Taxi <span className="text-brand-500">Mouine</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/buchen" className={linkClass('/buchen')}>
            Buchen
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/verlauf" className={linkClass('/verlauf')}>
                Verlauf
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  window.location.href = '/'
                }}
                className="btn-ghost text-sm text-red-600 hover:text-red-700"
              >
                Abmelden
              </button>
            </>
          ) : (
            <>
              <Link to="/anmelden" className={linkClass('/anmelden')}>
                Anmelden
              </Link>
              <Link to="/registrieren" className="btn-primary text-sm !py-2 !px-5">
                Registrieren
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
          aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
          aria-expanded={open}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border bg-white animate-slide-down">
          <div className="page-container py-4 space-y-2">
            <Link
              to="/buchen"
              className="block px-4 py-2.5 rounded-lg hover:bg-brand-50 font-medium transition-colors"
            >
              Buchen
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  to="/verlauf"
                  className="block px-4 py-2.5 rounded-lg hover:bg-brand-50 font-medium transition-colors"
                >
                  Verlauf
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('token')
                    window.location.href = '/'
                  }}
                  className="block w-full text-left px-4 py-2.5 rounded-lg hover:bg-red-50 font-medium text-red-600 transition-colors"
                >
                  Abmelden
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/anmelden"
                  className="block px-4 py-2.5 rounded-lg hover:bg-brand-50 font-medium transition-colors"
                >
                  Anmelden
                </Link>
                <Link
                  to="/registrieren"
                  className="block px-4 py-2.5 rounded-lg bg-brand-400 hover:bg-brand-500 font-semibold text-center transition-colors"
                >
                  Registrieren
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
