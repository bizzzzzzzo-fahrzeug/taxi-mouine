import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMyRides, getToken } from '../lib/api'

const statusLabels = {
  completed: 'Abgeschlossen',
  cancelled: 'Storniert',
  pending: 'Ausstehend',
  accepted: 'Unterwegs',
  in_progress: 'In Fahrt',
}

export default function History() {
  const navigate = useNavigate()
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!getToken()) {
      navigate('/anmelden')
      return
    }
    async function load() {
      try {
        const res = await getMyRides()
        setRides(res.rides || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [navigate])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Lade Verlauf...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Ihr Fahrtenverlauf</h1>

      {rides.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-gray-500 mb-4">Noch keine Fahrten</p>
          <Link to="/buchen" className="btn-primary">Erste Fahrt buchen</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => (
            <div key={ride._id} className="card">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-sm">
                    {ride.pickup.address || `${ride.pickup.lat.toFixed(4)}, ${ride.pickup.lng.toFixed(4)}`}
                  </p>
                  <p className="text-gray-400 text-xs">→</p>
                  <p className="font-medium text-sm">
                    {ride.dropoff.address || `${ride.dropoff.lat.toFixed(4)}, ${ride.dropoff.lng.toFixed(4)}`}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  ride.status === 'completed' ? 'bg-green-100 text-green-700' :
                  ride.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {statusLabels[ride.status] || ride.status}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2 pt-2 border-t">
                <span>{new Date(ride.bookedAt).toLocaleDateString('de-DE')}</span>
                {ride.estimatedFare > 0 && (
                  <span className="font-bold text-gray-800">€{ride.estimatedFare.toFixed(2)}</span>
                )}
              </div>
              {ride.status === 'pending' && (
                <Link
                  to={`/tracking/${ride._id}`}
                  className="text-yellow-600 text-sm font-medium mt-2 inline-block"
                >
                  Status ansehen →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
