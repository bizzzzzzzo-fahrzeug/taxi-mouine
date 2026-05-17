import { Server } from 'socket.io'
import Ride from '../models/Ride.js'

const driverLocations = new Map()

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id)

    socket.on('driver:location_update', (data) => {
      const { rideId, lat, lng, heading } = data
      driverLocations.set(socket.driverId || socket.id, { lat, lng, heading, updatedAt: Date.now() })

      if (rideId) {
        io.to(`ride:${rideId}`).emit('driver:location', { lat, lng, heading })
      }
    })

    socket.on('driver:register', (data) => {
      socket.driverId = data.driverId
      socket.join('drivers')
    })

    socket.on('customer:track_ride', (data) => {
      const { rideId } = data
      if (rideId) {
        socket.join(`ride:${rideId}`)
      }
    })

    socket.on('ride:status_changed', async (data) => {
      const { rideId, status } = data
      io.to(`ride:${rideId}`).emit('ride:updated', { rideId, status })

      if (status === 'pending') {
        const ride = await Ride.findById(rideId)
          .populate('customer', 'name phone')
        if (ride) {
          io.to('drivers').emit('driver:new_booking', { ride: ride.toPublicJSON() })
        }
      }
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id)
      if (socket.driverId) {
        driverLocations.delete(socket.driverId)
      }
    })
  })

  return io
}

export { driverLocations }
