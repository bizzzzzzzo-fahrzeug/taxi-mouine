import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMyRides, getToken } from '../lib/api'

const statusConfig = {
  completed: { label: 'Abgeschlossen', className: 'status-badge-completed' },
  cancelled: { label: 'Storniert', className: 'status-badge-cancelled' },
  pending: { label: 'Ausstehend', className: 'status-badge-pending' },
  accepted: { label: 'Unterwegs', className: 'status-badge-active' },
  in_progress: { label: 'In Fahrt', className: 'status-badge-active' },
  arrived: { label: 'Angekommen', className: 'status-badge-active' },
}

function Skeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card">
          <div className="skeleton h-4 w-3/4 mb-3" />
          <div className="skeleton h-3 w-1/2 mb-2" />
          <div className="skeleton h-3 w-1/4" />
        </div>
      ))}
    </div>
  )
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
      <div className="page-container py-8 max-w-2xl mx-auto animate-fade-in">
        <div className="skeleton h-8 w-48 mb-6" />
        <Skeleton />
      </div>
    )
  }

  return (
    <div className="page-container py-8 sm:py-12 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-8">Ihr Fahrtenverlauf</h1>

        {rides.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-6xl mb-4">🚕</div>
            <h2 className="text-lg font-bold text-text mb-2">Noch keine Fahrten</h2>
            <p className="text-text-secondary mb-6">Buchen Sie Ihre erste Fahrt mit Taxi Mouine.</p>
            <Link to="/buchen" className="btn-primary">
              Erste Fahrt buchen
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => {
              const status = statusConfig[ride.status] || { label: ride.status, className: 'status-badge-pending' }
              return (
                <div key={ride._id} className="card-hover animate-slide-up">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <span className="truncate">
                          {ride.pickup.address || `${ride.pickup.lat.toFixed(4)}, ${ride.pickup.lng.toFixed(4)}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="truncate">
                          {ride.dropoff.address || `${ride.dropoff.lat.toFixed(4)}, ${ride.dropoff.lng.toFixed(4)}`}
                        </span>
                      </div>
                    </div>
                    <span className={status.className}>{status.label}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <span className="text-sm text-text-muted">
                      {new Date(ride.bookedAt).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <div className="flex items-center gap-3">
                      {ride.estimatedFare > 0 && (
                        <span className="font-bold text-text">€{ride.estimatedFare.toFixed(2)}</span>
                      )}
                      {ride.status === 'pending' && (
                        <Link
                          to={`/tracking/${ride._id}`}
                          className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
                        >
                          Status ansehen →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
