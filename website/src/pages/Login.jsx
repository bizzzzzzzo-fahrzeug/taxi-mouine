import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login, setToken } from '../lib/api'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await login(phone, password)
      setToken(res.accessToken)
      navigate('/buchen')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container py-16 fade-in">
      <div className="max-w-sm mx-auto">
        <div className="text-center mb-8">
          <span className="text-4xl block mb-3">🚕</span>
          <h1 className="text-2xl font-bold text-stone-900">Anmelden</h1>
          <p className="text-stone-500 text-sm mt-1">Melden Sie sich an, um Ihre Fahrten zu sehen.</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm">{error}</div>
          )}
          <div>
            <label className="input-label" htmlFor="phone">Telefonnummer</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field"
              placeholder="+49 163 3315888"
              required
            />
          </div>
          <div>
            <label className="input-label" htmlFor="password">Passwort</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Wird geladen...' : 'Anmelden'}
          </button>
          <p className="text-center text-sm text-stone-500">
            Noch kein Konto?{' '}
            <Link to="/registrieren" className="text-brand-600 hover:text-brand-700 font-medium">
              Registrieren
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
