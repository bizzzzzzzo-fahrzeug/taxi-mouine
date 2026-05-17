import { Link } from 'react-router-dom'
import { getToken } from '../lib/api'

export default function Navbar() {
  const isLoggedIn = !!getToken()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🚕</span>
          <span className="text-xl font-bold text-gray-800">Taxi Mouine</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/buchen" className="text-gray-600 hover:text-yellow-500 font-medium">
            Buchen
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/verlauf" className="text-gray-600 hover:text-yellow-500 font-medium">
                Verlauf
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  window.location.href = '/'
                }}
                className="text-gray-600 hover:text-red-500 font-medium"
              >
                Abmelden
              </button>
            </>
          ) : (
            <>
              <Link to="/anmelden" className="text-gray-600 hover:text-yellow-500 font-medium">
                Anmelden
              </Link>
              <Link
                to="/registrieren"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-full transition-colors"
              >
                Registrieren
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
