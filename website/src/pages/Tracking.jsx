import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getRide } from '../lib/api'
import { fetchRoute } from '../lib/geo'

const statusConfig = {
  pending: { label: 'Wartet auf Annahme', color: 'bg-amber-50 text-amber-700', ring: 'ring-amber-200', icon: '⏳' },
  accepted: { label: 'Fahrer unterwegs', color: 'bg-blue-50 text-blue-700', ring: 'ring-blue-200', icon: '🚕' },
  arrived: { label: 'Fahrer ist da', color: 'bg-green-50 text-green-700', ring: 'ring-green-200', icon: '✅' },
  in_progress: { label: 'Fahrt gestartet', color: 'bg-blue-50 text-blue-700', ring: 'ring-blue-200', icon: '🚗' },
  completed: { label: 'Abgeschlossen', color: 'bg-emerald-50 text-emerald-700', ring: 'ring-emerald-200', icon: '🎉' },
  cancelled: { label: 'Storniert', color: 'bg-red-50 text-red-700', ring: 'ring-red-200', icon: '❌' },
}

function driverIcon(color = '#2563EB') {
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};color:white;padding:6px 14px;border-radius:24px;font-weight:600;font-size:13px;white-space:nowrap;box-shadow:0 2px 12px rgba(37,99,235,0.4);display:flex;align-items:center;gap:4px"><span>🚕</span> Taxi</div>`,
    iconSize: [0, 0],
  })
}

function DriverMarker({ position }) {
  if (!position) return null
  const map = useMap()
  map.setView([position.lat, position.lng], 14, { animate: true })
  return <Marker position={[position.lat, position.lng]} icon={driverIcon()} />
}

function LoadingSkeleton() {
  return (
    <div className="page-container py-16 max-w-2xl mx-auto text-center">
      <div className="space-y-4">
        <div className="skeleton h-8 w-48 mx-auto" />
        <div className="skeleton h-4 w-64 mx-auto" />
      </div>
    </div>
  )
}

export default function Tracking() {
  const { id } = useParams()
  const [ride, setRide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [driverPos, setDriverPos] = useState(null)
  const [routeCoords, setRouteCoords] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await getRide(id)
        setRide(res.ride)
        if (res.ride.pickup && res.ride.dropoff) {
          const route = await fetchRoute(res.ride.pickup, res.ride.dropoff)
          setRouteCoords(route)
        }
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
        socket = io(wsUrl, { transports: ['websocket', 'polling'] })
        socket.emit('customer:track_ride', { rideId: id })
        socket.on('ride:updated', (data) => setRide(data))
        socket.on('driver:location', (data) => setDriverPos(data))
      } catch (err) {
        console.log('Socket connection deferred')
      }
    }
    connectSocket()

    return () => {
      if (socket) socket.close()
    }
  }, [id])

  if (loading) return <LoadingSkeleton />

  if (!ride) {
    return (
      <div className="page-container py-16 max-w-2xl mx-auto text-center animate-fade-in">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-text mb-2">Fahrt nicht gefunden</h2>
        <p className="text-text-secondary mb-6">Diese Fahrt existiert nicht oder wurde entfernt.</p>
        <Link to="/buchen" className="btn-primary">Neue Fahrt buchen</Link>
      </div>
    )
  }

  const status = statusConfig[ride.status] || statusConfig.pending
  const isActive = !['completed', 'cancelled'].includes(ride.status)

  return (
    <div className="page-container py-8 sm:py-12 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-8">Fahrt verfolgen</h1>

        <div className={`card text-center mb-6 ring-2 ${status.ring}`}>
          <div className="text-5xl mb-4 animate-bounce-in">{status.icon}</div>
          <div className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full ${status.color} mb-3`}>
            {status.label}
          </div>
          <div className="text-sm text-text-secondary space-y-1">
            <p className="font-medium text-text">
              {ride.pickup.address || `${ride.pickup.lat.toFixed(4)}, ${ride.pickup.lng.toFixed(4)}`}
            </p>
            <p className="text-text-muted">↓</p>
            <p className="font-medium text-text">
              {ride.dropoff.address || `${ride.dropoff.lat.toFixed(4)}, ${ride.dropoff.lng.toFixed(4)}`}
            </p>
          </div>
          {ride.estimatedFare > 0 && (
            <p className="text-2xl font-extrabold text-brand-600 mt-4">
              €{ride.estimatedFare.toFixed(2)}
            </p>
          )}
        </div>

        {isActive && (
          <div className="h-[300px] rounded-2xl overflow-hidden shadow-sm border border-border mb-6">
            <MapContainer
              center={[ride.pickup.lat, ride.pickup.lng]}
              zoom={14}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[ride.pickup.lat, ride.pickup.lng]}
                icon={L.divIcon({
                  className: '',
                  html: '<div style="background:#EAB308;color:white;padding:4px 10px;border-radius:16px;font-weight:600;font-size:12px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.2)">📍 Abholung</div>',
                  iconSize: [0, 0],
                })}
              />
              {ride.dropoff && (
                <Marker
                  position={[ride.dropoff.lat, ride.dropoff.lng]}
                  icon={L.divIcon({
                    className: '',
                    html: '<div style="background:#EF4444;color:white;padding:4px 10px;border-radius:16px;font-weight:600;font-size:12px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.2)">🏁 Ziel</div>',
                    iconSize: [0, 0],
                  })}
                />
              )}
              {routeCoords && (
                <Polyline
                  positions={routeCoords}
                  pathOptions={{ color: '#2563EB', weight: 5, opacity: 0.7 }}
                />
              )}
              {driverPos && <DriverMarker position={driverPos} />}
            </MapContainer>
          </div>
        )}

        {ride.scheduledAt && (
          <div className="card mb-4">
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-text-secondary">Geplant für:</span>
              <span className="font-medium text-text">
                {new Date(ride.scheduledAt).toLocaleString('de-DE')}
              </span>
            </div>
          </div>
        )}

        {ride.status === 'pending' && (
          <div className="card bg-amber-50 border border-amber-200 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-xl">⏳</span>
              <p className="text-sm text-amber-800">
                Ihr Fahrer wurde benachrichtigt. Wir benachrichtigen Sie, sobald die Fahrt bestätigt wurde.
              </p>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/buchen" className="btn-primary">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Neue Fahrt
          </Link>
        </div>
      </div>
    </div>
  )
}
