import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import AddressInput from '../components/AddressInput'
import { getToken, estimateFare, createRide } from '../lib/api'
import { reverseGeocode, fetchRoute } from '../lib/geo'

const defaultCenter = [51.1947, 6.4354]

function LocMarker({ position, label, color = 'oklch(0.84 0.17 88)' }) {
  if (!position) return null
  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={L.divIcon({
        className: '',
        html: `<div style="background:${color};color:black;padding:3px 10px;border-radius:16px;font-weight:600;font-size:12px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.15)">${label}</div>`,
        iconSize: [0, 0],
      })}
    />
  )
}

function MapEvents({ onMapClick }) {
  useMapEvents({ click(e) { onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng }) } })
  return null
}

function MapCenter({ center }) {
  const map = useMap()
  if (center) map.setView(center, 14, { animate: true })
  return null
}

export default function Booking() {
  const navigate = useNavigate()
  const isLoggedIn = !!getToken()

  const [pickup, setPickup] = useState(null)
  const [dropoff, setDropoff] = useState(null)
  const [fare, setFare] = useState(null)
  const [routeCoords, setRouteCoords] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [when, setWhen] = useState('now')
  const [scheduledFor, setScheduledFor] = useState('')
  const [notes, setNotes] = useState('')

  const handleMapClick = useCallback(async (pos) => {
    if (!pickup) {
      const label = await reverseGeocode(pos.lat, pos.lng)
      setPickup({ ...pos, label: label || `${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}` })
    } else if (!dropoff) {
      const label = await reverseGeocode(pos.lat, pos.lng)
      setDropoff({ ...pos, label: label || `${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}` })
    }
  }, [pickup, dropoff])

  useEffect(() => { setFare(null) }, [pickup, dropoff])

  async function handleEstimate() {
    if (!pickup || !dropoff) return
    setLoading(true)
    setError('')
    try {
      const [res, route] = await Promise.all([
        estimateFare(pickup, dropoff),
        fetchRoute(pickup, dropoff),
      ])
      setFare(res.estimate)
      setRouteCoords(route)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleBook() {
    if (!isLoggedIn) { navigate('/anmelden'); return }
    setLoading(true)
    setError('')
    try {
      let scheduledAt = null
      if (when === 'later' && scheduledFor) scheduledAt = new Date(scheduledFor).toISOString()
      const res = await createRide(pickup, dropoff, scheduledAt)
      navigate(`/tracking/${res.ride._id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setPickup(null); setDropoff(null); setFare(null); setError('')
    setWhen('now'); setScheduledFor(''); setNotes('')
  }

  return (
    <div className="page-container py-10 fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">Taxi buchen</h1>
          <p className="mt-2 text-muted-foreground">Adresse eingeben oder auf Karte klicken — Preis sehen, buchen.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-5 card">
            <AddressInput
              label="Abholort"
              placeholder="z. B. Hauptbahnhof Mönchengladbach"
              value={pickup}
              onChange={(v) => { setPickup(v); setFare(null) }}
            />
            <AddressInput
              label="Zielort"
              placeholder="z. B. Flughafen Düsseldorf"
              value={dropoff}
              onChange={(v) => { setDropoff(v); setFare(null) }}
            />

            <div>
              <label className="label">Wann?</label>
              <div className="flex rounded-md border border-border p-1">
                {['now', 'later'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setWhen(opt)}
                    className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition ${
                      when === opt ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {opt === 'now' ? 'Jetzt' : 'Für später'}
                  </button>
                ))}
              </div>
              {when === 'later' && (
                <input
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  className="input mt-2"
                  min={new Date().toISOString().slice(0, 16)}
                />
              )}
            </div>

            <div>
              <label className="label">Notiz (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input min-h-[80px] resize-none py-2"
                placeholder="z. B. Anzahl Personen, Gepäck, Eingang Seitenstraße…"
              />
            </div>

            <button
              type="button"
              className="btn btn-secondary w-full"
              disabled={!pickup || !dropoff || loading}
              onClick={handleEstimate}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Berechne...
                </span>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Festpreis berechnen
                </>
              )}
            </button>

            {fare && (
              <div className="rounded-xl border p-4" style={{ borderColor: 'color-mix(in oklab, var(--color-primary) 30%, transparent)', backgroundColor: 'color-mix(in oklab, var(--color-primary) 5%, transparent)' }}>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Geschätzter Preis</span>
                  <span className="text-3xl font-bold">{fare.fareFormatted}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    {fare.distance} km
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ca. {fare.duration} Min.
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Barzahlung
                  </span>
                </div>
              </div>
            )}

            <button
              type="button"
              className="btn btn-primary w-full btn-lg"
              disabled={!fare || loading || (when === 'later' && !scheduledFor)}
              onClick={handleBook}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Wird gebucht...
                </span>
              ) : (
                isLoggedIn ? 'Fahrt verbindlich buchen' : 'Anmelden & buchen'
              )}
            </button>

            {(pickup || dropoff) && (
              <button onClick={handleReset} className="btn btn-ghost w-full text-sm">
                Zurücksetzen
              </button>
            )}

            <p className="text-xs text-center text-muted-foreground">
              👆 Sie können auch direkt auf die Karte klicken, um Orte auszuwählen
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card" style={{ boxShadow: 'var(--shadow-card)' }}>
            <MapContainer
              center={pickup ? [pickup.lat, pickup.lng] : defaultCenter}
              zoom={13}
              className="h-full w-full"
              style={{ minHeight: 400 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapEvents onMapClick={handleMapClick} />
              {pickup && <LocMarker position={pickup} label="Abholung" />}
              {dropoff && <LocMarker position={dropoff} label="Ziel" color="#EF4444" />}
              {pickup && <MapCenter center={[pickup.lat, pickup.lng]} />}
              {routeCoords && (
                <Polyline
                  positions={routeCoords}
                  pathOptions={{ color: '#2563EB', weight: 5, opacity: 0.7 }}
                />
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
