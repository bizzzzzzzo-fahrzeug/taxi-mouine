import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getToken, estimateFare, createRide } from '../lib/api'

const defaultCenter = [51.1947, 6.4354]

const steps = [
  { key: 'pickup', label: 'Abholort' },
  { key: 'dropoff', label: 'Zielort' },
  { key: 'confirm', label: 'Bestätigen' },
]

function LocationMarker({ position, label, color = '#EAB308' }) {
  if (!position) return null
  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={L.divIcon({
        className: '',
        html: `<div style="background:${color};color:white;padding:6px 12px;border-radius:20px;font-weight:600;font-size:13px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.2)">${label}</div>`,
        iconSize: [0, 0],
      })}
    />
  )
}

function MapClickHandler({ onMapClick, enabled }) {
  useMapEvents({
    click(e) {
      if (enabled) onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

function MapCenterUpdater({ center }) {
  const map = useMap()
  if (center) map.setView(center, 14, { animate: true })
  return null
}

export default function Booking() {
  const navigate = useNavigate()
  const isLoggedIn = !!getToken()

  const [pickup, setPickup] = useState(null)
  const [dropoff, setDropoff] = useState(null)
  const [pickupAddress, setPickupAddress] = useState('')
  const [dropoffAddress, setDropoffAddress] = useState('')
  const [currentStep, setCurrentStep] = useState('pickup')
  const [fare, setFare] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep)

  const handleMapClick = useCallback(
    (pos) => {
      if (currentStep === 'pickup') {
        setPickup(pos)
        setCurrentStep('dropoff')
      } else if (currentStep === 'dropoff') {
        setDropoff(pos)
        setCurrentStep('confirm')
      }
    },
    [currentStep],
  )

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
      if (scheduledDate && scheduledTime) {
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
    setPickupAddress('')
    setDropoffAddress('')
    setCurrentStep('pickup')
    setFare(null)
    setError('')
    setScheduledDate('')
    setScheduledTime('')
  }

  return (
    <div className="page-container py-8 sm:py-12 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-text">Fahrt buchen</h1>
          {(pickup || dropoff) && (
            <button onClick={handleReset} className="btn-ghost text-sm">
              Zurücksetzen
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 mb-8">
          {steps.map((step, i) => {
            const isActive = steps.findIndex((s) => s.key === currentStep) >= i
            const isDone = steps.findIndex((s) => s.key === currentStep) > i
            return (
              <div key={step.key} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      isDone
                        ? 'bg-brand-400 text-black'
                        : isActive
                          ? 'bg-brand-400 text-black ring-4 ring-brand-200'
                          : 'bg-stone-100 text-text-muted'
                    }`}
                  >
                    {isDone ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium hidden sm:inline ${
                      isActive ? 'text-text' : 'text-text-muted'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 rounded-full ${
                      isDone ? 'bg-brand-400' : 'bg-stone-200'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm mb-6 flex items-center gap-2 animate-slide-down">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className={`card ${currentStep === 'pickup' ? 'ring-2 ring-brand-400' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-brand-400" />
                <h2 className="font-semibold text-text">Abholort</h2>
              </div>
              <p className="text-xs text-text-muted mb-3">
                {currentStep === 'pickup'
                  ? 'Klicken Sie auf die Karte, um den Abholort zu setzen'
                  : pickup
                    ? 'Abholort gesetzt'
                    : 'Noch nicht gesetzt'}
              </p>
              {pickup && (
                <div className="bg-stone-50 rounded-lg px-3 py-2 text-sm text-text flex items-center gap-2">
                  <span>📍</span>
                  <span className="truncate">
                    {pickupAddress || `${pickup.lat.toFixed(4)}, ${pickup.lng.toFixed(4)}`}
                  </span>
                </div>
              )}
            </div>

            <div className={`card ${currentStep === 'dropoff' ? 'ring-2 ring-brand-400' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <h2 className="font-semibold text-text">Zielort</h2>
              </div>
              <p className="text-xs text-text-muted mb-3">
                {currentStep === 'dropoff'
                  ? 'Klicken Sie auf die Karte, um das Ziel zu setzen'
                  : dropoff
                    ? 'Zielort gesetzt'
                    : pickup
                      ? 'Warten auf Zielort'
                      : 'Setzen Sie zuerst den Abholort'}
              </p>
              {dropoff && (
                <div className="bg-stone-50 rounded-lg px-3 py-2 text-sm text-text flex items-center gap-2">
                  <span>📍</span>
                  <span className="truncate">
                    {dropoffAddress || `${dropoff.lat.toFixed(4)}, ${dropoff.lng.toFixed(4)}`}
                  </span>
                </div>
              )}
            </div>

            {pickup && dropoff && !fare && (
              <button onClick={handleEstimate} disabled={loading} className="btn-primary w-full">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Berechne...
                  </span>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Preis berechnen
                  </>
                )}
              </button>
            )}

            {fare && (
              <div className="card border-2 border-brand-400 animate-scale-in">
                <h2 className="font-semibold text-lg mb-4">Fahrtübersicht</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-stone-100">
                    <span className="text-text-secondary text-sm">Strecke</span>
                    <span className="font-semibold text-text">{fare.distance} km</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-stone-100">
                    <span className="text-text-secondary text-sm">Dauer</span>
                    <span className="font-semibold text-text">{fare.duration} min</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-text text-sm">Preis</span>
                    <span className="text-xl font-extrabold text-brand-600">{fare.fareFormatted}</span>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-brand-50 rounded-xl">
                  <label className="block text-sm font-medium text-text mb-2">
                    Für später planen (optional)
                  </label>
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
                </div>

                <button onClick={handleBook} disabled={loading} className="btn-primary w-full mt-5">
                  {loading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Wird gebucht...
                    </span>
                  ) : isLoggedIn ? (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Fahrt buchen
                    </>
                  ) : (
                    'Anmelden zum Buchen'
                  )}
                </button>

                <p className="text-xs text-text-muted text-center mt-3">
                  Nur Barzahlung. Sie zahlen direkt beim Fahrer.
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            <div className="h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-sm border border-border">
              <MapContainer
                center={pickup ? [pickup.lat, pickup.lng] : defaultCenter}
                zoom={13}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler
                  onMapClick={handleMapClick}
                  enabled={currentStep === 'pickup' || currentStep === 'dropoff'}
                />
                {pickup && <LocationMarker position={pickup} label="Abholung" color="#EAB308" />}
                {dropoff && <LocationMarker position={dropoff} label="Ziel" color="#EF4444" />}
                {pickup && <MapCenterUpdater center={[pickup.lat, pickup.lng]} />}
              </MapContainer>
            </div>
            <p className="text-xs text-text-muted mt-2 text-center">
              Klicken Sie auf die Karte, um Orte auszuwählen
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
