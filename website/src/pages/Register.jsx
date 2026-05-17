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
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-8">Registrieren</h1>
      <form onSubmit={handleSubmit} className="card space-y-4">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-xl text-sm">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="Ihr Name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefonnummer</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field"
            placeholder="+49 163 3315888"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="Mindestens 6 Zeichen"
            minLength={6}
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Wird geladen...' : 'Registrieren'}
        </button>
        <p className="text-center text-sm text-gray-500">
          Bereits registriert?{' '}
          <Link to="/anmelden" className="text-yellow-600 hover:underline">
            Anmelden
          </Link>
        </p>
      </form>
    </div>
  )
}
