import { Router } from 'express'
import Ride, { RIDE_STATUS } from '../models/Ride.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.post('/', authenticate, async (req, res) => {
  try {
    const { pickup, dropoff, scheduledAt } = req.body

    if (!pickup || !dropoff) {
      return res.status(400).json({
        success: false,
        error: 'Start- und Zieladresse erforderlich',
      })
    }

    const ride = new Ride({
      customer: req.userId,
      pickup,
      dropoff,
      scheduledAt: scheduledAt || null,
    })
    await ride.save()

    const populated = await Ride.findById(ride._id).populate('customer', 'name phone')

    res.status(201).json({ success: true, ride: populated.toPublicJSON() })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.get('/history', authenticate, async (req, res) => {
  try {
    const rides = await Ride.find({ customer: req.userId })
      .sort({ bookedAt: -1 })
      .limit(50)
    res.json({ success: true, rides: rides.map(r => r.toPublicJSON()) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.get('/:id', authenticate, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('customer', 'name phone')
      .populate('driver', 'name phone')

    if (!ride) {
      return res.status(404).json({ success: false, error: 'Fahrt nicht gefunden' })
    }

    if (ride.customer._id.toString() !== req.userId && ride.driver?._id?.toString() !== req.userId) {
      return res.status(403).json({ success: false, error: 'Keine Berechtigung' })
    }

    res.json({ success: true, ride: ride.toPublicJSON() })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body
    const ride = await Ride.findById(req.params.id)

    if (!ride) {
      return res.status(404).json({ success: false, error: 'Fahrt nicht gefunden' })
    }

    const validTransitions = {
      [RIDE_STATUS.PENDING]: [RIDE_STATUS.ACCEPTED, RIDE_STATUS.CANCELLED],
      [RIDE_STATUS.ACCEPTED]: [RIDE_STATUS.ARRIVED, RIDE_STATUS.CANCELLED],
      [RIDE_STATUS.ARRIVED]: [RIDE_STATUS.IN_PROGRESS, RIDE_STATUS.CANCELLED],
      [RIDE_STATUS.IN_PROGRESS]: [RIDE_STATUS.COMPLETED],
    }

    if (!validTransitions[ride.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Status-Übergang von ${ride.status} zu ${status} nicht erlaubt`,
      })
    }

    if (status === RIDE_STATUS.ACCEPTED) {
      ride.driver = req.userId
      ride.acceptedAt = new Date()
    }
    if (status === RIDE_STATUS.COMPLETED) {
      ride.completedAt = new Date()
    }
    if (status === RIDE_STATUS.CANCELLED) {
      ride.cancelledAt = new Date()
    }

    ride.status = status
    await ride.save()

    const populated = await Ride.findById(ride._id)
      .populate('customer', 'name phone')
      .populate('driver', 'name phone')

    res.json({ success: true, ride: populated.toPublicJSON() })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
