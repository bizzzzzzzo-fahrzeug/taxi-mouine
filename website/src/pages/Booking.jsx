import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getToken, estimateFare, createRide } from '../lib/api'

const defaultCenter = [51.1947, 6.4354] // Mönchengladbach center

function LocationMarker({ position, setPosition, label }) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })

  useMapEvents({
    dblclick(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })

  return position ? (
    <Marker
      position={[position.lat, position.lng]}
      icon={
        new L.DivIcon({
          className: 'custom-marker',
          html: `<div style="background:#EAB308;color:black;padding:4px 8px;border-radius:8px;font-weight:bold;font-size:12px;white-space:nowrap">${label}</div>`,
          iconSize: [0, 0],
        })
      }
    />
  ) : null
}

function MapUpdater({ center }) {
  const map = useMap()
  if (center) {
    map.setView(center, 13)
  }
  return null
}

export default function Booking() {
  const navigate = useNavigate()
  const isLoggedIn = !!getToken()

  const [pickup, setPickup] = useState(null)
  const [dropoff, setDropoff] = useState(null)
  const [pickupAddress, setPickupAddress] = useState('')
  const [dropoffAddress, setDropoffAddress] = useState('')
  const [step, setStep] = useState('pickup')
  const [fare, setFare] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')

  const handleMapClick = useCallback((pos) => {
    if (step === 'pickup') {
      setPickup(pos)
      setStep('dropoff')
    } else {
      setDropoff(pos)
    }
  }, [step])

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Fahrt buchen</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-xl text-sm mb-4">{error}</div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="card">
            <h2 className="font-bold text-lg mb-3">1. Abholort wählen</h2>
            <p className="text-sm text-gray-500 mb-2">
              {step === 'pickup'
                ? 'Klicken Sie auf die Karte, um den Abholort zu setzen'
                : '✅ Abholort gesetzt. Wählen Sie jetzt das Ziel.'}
            </p>
            {pickup && (
              <div className="bg-gray-50 p-2 rounded-lg text-sm mb-2">
                📍 {pickupAddress || `${pickup.lat.toFixed(4)}, ${pickup.lng.toFixed(4)}`}
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="font-bold text-lg mb-3">2. Zielort wählen</h2>
            {dropoff ? (
              <div className="bg-gray-50 p-2 rounded-lg text-sm mb-2">
                📍 {dropoffAddress || `${dropoff.lat.toFixed(4)}, ${dropoff.lng.toFixed(4)}`}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                {pickup ? 'Klicken Sie auf die Karte für das Ziel' : 'Setzen Sie zuerst den Abholort'}
              </p>
            )}
          </div>

          {pickup && dropoff && !fare && (
            <button onClick={handleEstimate} disabled={loading} className="btn-primary w-full">
              {loading ? 'Berechne...' : 'Preis berechnen'}
            </button>
          )}

          {fare && (
            <div className="card border-2 border-yellow-400">
              <h2 className="font-bold text-lg mb-3">Fahrtübersicht</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Strecke</span>
                  <span className="font-medium">{fare.distance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Dauer</span>
                  <span className="font-medium">{fare.duration} min</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Preis</span>
                  <span className="text-yellow-600">{fare.fareFormatted}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 rounded-xl">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Für später planen (optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="input-field text-sm"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <button onClick={handleBook} disabled={loading} className="btn-primary w-full mt-4">
                {loading ? 'Wird gebucht...' : isLoggedIn ? 'Fahrt buchen' : 'Anmelden zum Buchen'}
              </button>

              <p className="text-xs text-gray-400 text-center mt-2">
                Nur Barzahlung. Sie zahlen direkt beim Fahrer.
              </p>
            </div>
          )}
        </div>

        <div className="h-[500px] rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200">
          <MapContainer
            center={defaultCenter}
            zoom={13}
            className="h-full w-full"
            whenReady={() => {}}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onMapClick={handleMapClick} />
            {pickup && <LocationMarker position={pickup} setPosition={setPickup} label="Abholung" />}
            {dropoff && <LocationMarker position={dropoff} setPosition={setDropoff} label="Ziel" />}
            {pickup && <MapUpdater center={[pickup.lat, pickup.lng]} />}
          </MapContainer>
        </div>
      </div>
    </div>
  )
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}
