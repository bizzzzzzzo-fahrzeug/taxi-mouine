import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register, setToken } from '../lib/api'

export default function Register() {
  const [name, setName] = useState('')
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
      const res = await register(name, phone, password)
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
        <h1 className="text-3xl font-bold">Registrieren</h1>
        <p className="mt-2 text-sm text-muted-foreground">Erstellen Sie ein Konto für schnelle Buchungen.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 card">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">{error}</div>
          )}
          <div>
            <label className="label" htmlFor="name">Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Ihr Name" required />
          </div>
          <div>
            <label className="label" htmlFor="phone">Telefonnummer</label>
            <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input" placeholder="+49 163 3315888" required />
          </div>
          <div>
            <label className="label" htmlFor="password">Passwort</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="Mindestens 6 Zeichen" minLength={6} required />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading && (
              <svg className="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            Registrieren
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Bereits registriert?{' '}
          <Link to="/anmelden" className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>Anmelden</Link>
        </p>
      </div>
    </div>
  )
}
