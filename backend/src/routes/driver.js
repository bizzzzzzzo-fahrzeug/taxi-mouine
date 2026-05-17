import { Router } from 'express'
import Ride, { RIDE_STATUS } from '../models/Ride.js'
import User from '../models/User.js'
import { authenticate, requireRole } from '../middleware/auth.js'

const router = Router()

router.get('/rides/pending', authenticate, requireRole('driver'), async (req, res) => {
  try {
    const rides = await Ride.find({
      status: RIDE_STATUS.PENDING,
      $or: [
        { scheduledAt: null },
        { scheduledAt: { $lte: new Date() } },
      ],
    })
      .populate('customer', 'name phone')
      .sort({ bookedAt: -1 })

    res.json({ success: true, rides: rides.map(r => r.toPublicJSON()) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.get('/rides/upcoming', authenticate, requireRole('driver'), async (req, res) => {
  try {
    const rides = await Ride.find({
      driver: req.userId,
      status: { $in: [RIDE_STATUS.PENDING, RIDE_STATUS.ACCEPTED, RIDE_STATUS.ARRIVED, RIDE_STATUS.IN_PROGRESS] },
    })
      .populate('customer', 'name phone')
      .sort({ scheduledAt: -1, bookedAt: -1 })

    res.json({ success: true, rides: rides.map(r => r.toPublicJSON()) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.get('/rides/history', authenticate, requireRole('driver'), async (req, res) => {
  try {
    const rides = await Ride.find({
      driver: req.userId,
      status: { $in: [RIDE_STATUS.COMPLETED, RIDE_STATUS.CANCELLED] },
    })
      .populate('customer', 'name phone')
      .sort({ bookedAt: -1 })
      .limit(50)

    res.json({ success: true, rides: rides.map(r => r.toPublicJSON()) })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.patch('/rides/:id/accept', authenticate, requireRole('driver'), async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
    if (!ride || ride.status !== RIDE_STATUS.PENDING) {
      return res.status(400).json({ success: false, error: 'Fahrt nicht verfügbar' })
    }

    ride.driver = req.userId
    ride.status = RIDE_STATUS.ACCEPTED
    ride.acceptedAt = new Date()
    await ride.save()

    const populated = await Ride.findById(ride._id)
      .populate('customer', 'name phone')

    res.json({ success: true, ride: populated.toPublicJSON() })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.post('/status', authenticate, requireRole('driver'), async (req, res) => {
  try {
    const { isOnline } = req.body
    await User.findByIdAndUpdate(req.userId, { isOnline })
    res.json({ success: true, isOnline })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
