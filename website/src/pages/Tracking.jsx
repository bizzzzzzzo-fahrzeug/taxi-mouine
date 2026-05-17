import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getRide } from '../lib/api'

const statusLabels = {
  pending: 'Wartet auf Annahme',
  accepted: 'Fahrer unterwegs',
  arrived: 'Fahrer ist da',
  in_progress: 'Fahrt gestartet',
  completed: 'Abgeschlossen',
  cancelled: 'Storniert',
}

const statusEmoji = {
  pending: '⏳',
  accepted: '🚕',
  arrived: '✅',
  in_progress: '🚗',
  completed: '🎉',
  cancelled: '❌',
}

function DriverMarker({ position }) {
  if (!position) return null
  const map = useMap()
  map.setView([position.lat, position.lng], 14)
  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={new L.DivIcon({
        className: 'driver-marker',
        html: '<div style="background:#2563EB;color:white;padding:4px 10px;border-radius:20px;font-weight:bold;font-size:14px">🚕 Taxi</div>',
        iconSize: [0, 0],
      })}
    />
  )
}

export default function Tracking() {
  const { id } = useParams()
  const [ride, setRide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [driverPos, setDriverPos] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await getRide(id)
        setRide(res.ride)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const wsUrl = `${protocol}://${window.location.hostname}:6868`
    let socket

    async function connectSocket() {
      try {
        const { io } = await import('socket.io-client')
        socket = io(wsUrl, {
          transports: ['websocket', 'polling'],
        })
        socket.emit('customer:track_ride', { rideId: id })
        socket.on('ride:updated', (data) => {
          setRide(data)
        })
        socket.on('driver:location', (data) => {
          setDriverPos(data)
        })
      } catch (err) {
        console.log('Socket connection deferred')
      }
    }
    connectSocket()

    return () => {
      if (socket) socket.close()
    }
  }, [id])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Lade Fahrt...</p>
      </div>
    )
  }

  if (!ride) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Fahrt nicht gefunden</p>
        <Link to="/buchen" className="btn-primary inline-block mt-4">Neue Fahrt buchen</Link>
      </div>
    )
  }

  const isActive = !['completed', 'cancelled'].includes(ride.status)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Fahrt verfolgen</h1>

      <div className="card mb-6 text-center">
        <div className="text-5xl mb-4">{statusEmoji[ride.status]}</div>
        <p className="text-xl font-bold">{statusLabels[ride.status]}</p>
        <p className="text-gray-500 mt-1">
          {ride.pickup.address || `${ride.pickup.lat.toFixed(4)}, ${ride.pickup.lng.toFixed(4)}`}
          {' → '}
          {ride.dropoff.address || `${ride.dropoff.lat.toFixed(4)}, ${ride.dropoff.lng.toFixed(4)}`}
        </p>
        {ride.estimatedFare > 0 && (
          <p className="text-lg font-bold text-yellow-600 mt-2">
            €{ride.estimatedFare.toFixed(2)}
          </p>
        )}
      </div>

      {isActive && (
        <div className="h-[300px] rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200 mb-6">
          <MapContainer
            center={[ride.pickup.lat, ride.pickup.lng]}
            zoom={14}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[ride.pickup.lat, ride.pickup.lng]} />
            {ride.dropoff && (
              <Marker position={[ride.dropoff.lat, ride.dropoff.lng]} />
            )}
            {driverPos && <DriverMarker position={driverPos} />}
          </MapContainer>
        </div>
      )}

      {ride.scheduledAt && (
        <div className="card mb-4">
          <p className="text-sm text-gray-500">
            Geplant für: {new Date(ride.scheduledAt).toLocaleString('de-DE')}
          </p>
        </div>
      )}

      {ride.status === 'pending' && (
        <div className="card bg-yellow-50 border-yellow-400">
          <p className="text-sm text-gray-600">
            Ihr Fahrer wurde benachrichtigt. Wir benachrichtigen Sie, sobald die Fahrt bestätigt wurde.
          </p>
        </div>
      )}

      <div className="text-center mt-6">
        <Link to="/buchen" className="btn-primary">Neue Fahrt</Link>
      </div>
    </div>
  )
}
