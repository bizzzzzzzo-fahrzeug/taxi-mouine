import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { getToken } from '../lib/api'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const isLoggedIn = !!getToken()
  const location = useLocation()

  const linkClass = (path) =>
    `text-sm font-medium transition-colors duration-200 ${
      location.pathname === path
        ? 'text-primary'
        : 'text-foreground hover:text-primary'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
      <nav className="page-container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            M
          </span>
          <span className="font-semibold tracking-tight text-foreground">Taxi Mouine</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={linkClass('/')}>Start</Link>
          <Link to="/buchen" className={linkClass('/buchen')}>Buchen</Link>
          {isLoggedIn && (
            <Link to="/verlauf" className={linkClass('/verlauf')}>Meine Fahrten</Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <a
            href="tel:+491633315888"
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Anrufen
          </a>
          {isLoggedIn ? (
            <button
              onClick={() => {
                localStorage.removeItem('token')
                window.location.href = '/'
              }}
              className="btn btn-outline btn-sm"
            >
              Abmelden
            </button>
          ) : (
            <Link to="/anmelden" className="btn btn-secondary btn-sm">Anmelden</Link>
          )}
          <Link to="/buchen" className="btn btn-primary btn-sm">Jetzt buchen</Link>
        </div>

        <button
          className="md:hidden p-2 rounded-md hover:bg-muted"
          onClick={() => setOpen(!open)}
          aria-label="Menü"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="page-container py-4 flex flex-col gap-3">
            <Link to="/" className="text-sm font-medium" onClick={() => setOpen(false)}>Start</Link>
            <Link to="/buchen" className="text-sm font-medium" onClick={() => setOpen(false)}>Buchen</Link>
            {isLoggedIn && (
              <Link to="/verlauf" className="text-sm font-medium" onClick={() => setOpen(false)}>Meine Fahrten</Link>
            )}
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <a href="tel:+491633315888" className="inline-flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +49 163 3315888
              </a>
              {isLoggedIn ? (
                <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/' }} className="btn btn-outline btn-sm">
                  Abmelden
                </button>
              ) : (
                <Link to="/anmelden" className="btn btn-secondary btn-sm" onClick={() => setOpen(false)}>Anmelden</Link>
              )}
              <Link to="/buchen" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>Jetzt buchen</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
