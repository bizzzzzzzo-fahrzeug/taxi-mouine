import { Link, useLocation } from 'react-router-dom'
import { getToken } from '../lib/api'

export default function Navbar() {
  const isLoggedIn = !!getToken()
  const location = useLocation()

  const linkClass = (path) =>
    `text-sm font-medium transition-colors duration-200 ${
      location.pathname === path
        ? 'text-brand-600'
        : 'text-stone-600 hover:text-stone-900'
    }`

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-stone-200">
      <nav className="page-container flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl">🚕</span>
            <span className="text-base font-bold text-stone-900">
              M<span className="text-brand-500">Taxi</span> Mouine
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={linkClass('/')}>
              Start
            </Link>
            <Link to="/buchen" className={linkClass('/buchen')}>
              Buchen
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:+491633315888"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Anrufen
          </a>
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link to="/verlauf" className="btn-ghost text-sm !py-2">
                Verlauf
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  window.location.href = '/'
                }}
                className="btn-ghost text-sm !py-2 text-red-600 hover:text-red-700"
              >
                Abmelden
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/anmelden" className="btn-ghost text-sm !py-2 hidden sm:inline-flex">
                Anmelden
              </Link>
              <Link to="/buchen" className="btn-primary text-sm !py-2 !px-4">
                Jetzt buchen
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
