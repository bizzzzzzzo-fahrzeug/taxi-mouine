import { Router } from 'express'
import { calculateFare, formatFare } from '../services/fare.js'

const router = Router()

router.post('/estimate', async (req, res) => {
  try {
    const { pickup, dropoff } = req.body

    if (!pickup || !dropoff) {
      return res.status(400).json({
        success: false,
        error: 'Start- und Zieladresse erforderlich',
      })
    }

    if (!pickup.lat || !pickup.lng || !dropoff.lat || !dropoff.lng) {
      return res.status(400).json({
        success: false,
        error: 'Koordinaten für Start und Ziel erforderlich',
      })
    }

    const lat1 = pickup.lat
    const lon1 = pickup.lng
    const lat2 = dropoff.lat
    const lon2 = dropoff.lng

    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distanceKm = R * c

    const avgSpeedKmh = 30
    const durationMinutes = Math.round((distanceKm / avgSpeedKmh) * 60)

    const fare = calculateFare(distanceKm)

    res.json({
      success: true,
      estimate: {
        distance: Math.round(distanceKm * 10) / 10,
        distanceUnit: 'km',
        duration: durationMinutes,
        durationUnit: 'min',
        fare: Math.round(fare * 100) / 100,
        fareFormatted: formatFare(fare),
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
