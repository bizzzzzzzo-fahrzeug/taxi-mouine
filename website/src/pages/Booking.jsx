import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getToken, estimateFare, createRide } from '../lib/api'

const defaultCenter = [51.1947, 6.4354]

function LocationMarker({ position, label, color = '#EAB308' }) {
  if (!position) return null
  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={L.divIcon({
        className: '',
        html: `<div style="background:${color};color:white;padding:4px 10px;border-radius:16px;font-weight:600;font-size:12px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.15)">${label}</div>`,
        iconSize: [0, 0],
      })}
    />
  )
}

function MapEvents({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
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
  const [pickupAddr, setPickupAddr] = useState('')
  const [dropoffAddr, setDropoffAddr] = useState('')
  const [fare, setFare] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [scheduledForLater, setScheduledForLater] = useState(false)
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [note, setNote] = useState('')

  const selecting = !pickup ? 'pickup' : !dropoff ? 'dropoff' : 'done'

  const handleMapClick = useCallback((pos) => {
    if (!pickup) {
      setPickup(pos)
    } else if (!dropoff) {
      setDropoff(pos)
    }
  }, [pickup, dropoff])

  async function handleEstimate() {
    if (!pickup || !dropoff) return
    setLoading(true)
    setError('')
    try {
      const res = await estimateFare(pickup, dropoff)
      setFare(res.estimate)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleBook() {
    if (!isLoggedIn) {
      navigate('/anmelden')
      return
    }
    setLoading(true)
    setError('')
    try {
      let scheduledAt = null
      if (scheduledForLater && scheduledDate && scheduledTime) {
        scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
      }
      const res = await createRide(pickup, dropoff, scheduledAt)
      navigate(`/tracking/${res.ride._id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setPickup(null)
    setDropoff(null)
    setPickupAddr('')
    setDropoffAddr('')
    setFare(null)
    setError('')
    setScheduledForLater(false)
    setScheduledDate('')
    setScheduledTime('')
    setNote('')
  }

  return (
    <div className="page-container py-8 sm:py-12 fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Taxi buchen</h1>
          <p className="text-stone-500 mt-1">Adresse eingeben, Preis sehen, buchen.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="card space-y-4">
              <div>
                <label className="input-label">Abholort</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Adresse oder auf Karte klicken"
                  value={pickupAddr}
                  onChange={(e) => setPickupAddr(e.target.value)}
                />
                {pickup && (
                  <p className="text-xs text-stone-400 mt-1">
                    {pickup.lat.toFixed(4)}, {pickup.lng.toFixed(4)}
                  </p>
                )}
              </div>
              <div>
                <label className="input-label">Zielort</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Adresse oder auf Karte klicken"
                  value={dropoffAddr}
                  onChange={(e) => setDropoffAddr(e.target.value)}
                />
                {dropoff && (
                  <p className="text-xs text-stone-400 mt-1">
                    {dropoff.lat.toFixed(4)}, {dropoff.lng.toFixed(4)}
                  </p>
                )}
              </div>

              <div>
                <label className="input-label">Wann?</label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setScheduledForLater(false)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      !scheduledForLater
                        ? 'bg-brand-400 text-black'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    Jetzt
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduledForLater(true)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      scheduledForLater
                        ? 'bg-brand-400 text-black'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    Für später
                  </button>
                </div>
                {scheduledForLater && (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="input-field text-sm flex-1"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="input-field text-sm flex-1"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="input-label">Notiz (optional)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="z.B. Am Hintereingang"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                {!fare ? (
                  <button
                    onClick={handleEstimate}
                    disabled={!pickup || !dropoff || loading}
                    className="btn-primary flex-1"
                  >
                    {loading ? 'Berechne...' : 'Festpreis berechnen'}
                  </button>
                ) : (
                  <button onClick={handleBook} disabled={loading} className="btn-primary flex-1">
                    {loading ? 'Wird gebucht...' : isLoggedIn ? 'Fahrt buchen' : 'Anmelden & buchen'}
                  </button>
                )}
                {(pickup || dropoff) && (
                  <button onClick={handleReset} className="btn-ghost !px-3" title="Zurücksetzen">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {fare && (
              <div className="card border-2 border-brand-400 animate-scale-in">
                <h3 className="font-semibold text-stone-900 mb-3">Fahrtübersicht</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Strecke</span>
                    <span className="font-medium">{fare.distance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Dauer</span>
                    <span className="font-medium">{fare.duration} min</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-stone-200 pt-2 mt-2">
                    <span>Festpreis</span>
                    <span className="text-brand-600">{fare.fareFormatted}</span>
                  </div>
                </div>
                <p className="text-xs text-stone-400 text-center mt-3">Nur Barzahlung. Sie zahlen direkt beim Fahrer.</p>
              </div>
            )}

            {selecting !== 'done' && (
              <p className="text-sm text-stone-500 text-center">
                {selecting === 'pickup'
                  ? '👆 Klicken Sie auf die Karte, um den Abholort zu wählen'
                  : '👆 Klicken Sie auf die Karte, um das Ziel zu wählen'}
              </p>
            )}
          </div>

          <div className="lg:col-span-3">
            <div className="h-[400px] lg:h-[500px] rounded-xl overflow-hidden border border-stone-200">
              <MapContainer
                center={pickup ? [pickup.lat, pickup.lng] : defaultCenter}
                zoom={13}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEvents onMapClick={handleMapClick} />
                {pickup && <LocationMarker position={pickup} label="Abholung" />}
                {dropoff && <LocationMarker position={dropoff} label="Ziel" color="#EF4444" />}
                {pickup && <MapCenter center={[pickup.lat, pickup.lng]} />}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
