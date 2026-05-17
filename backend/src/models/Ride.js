import mongoose from 'mongoose'

const rideSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  pickup: {
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  dropoff: {
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  status: {
    type: String,
    enum: [
      'pending',
      'accepted',
      'arrived',
      'in_progress',
      'completed',
      'cancelled',
    ],
    default: 'pending',
  },
  estimatedFare: {
    type: Number,
    default: 0,
  },
  actualFare: {
    type: Number,
    default: 0,
  },
  distance: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 0,
  },
  scheduledAt: {
    type: Date,
    default: null,
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
  acceptedAt: {
    type: Date,
    default: null,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  cancelledAt: {
    type: Date,
    default: null,
  },
  paymentMethod: {
    type: String,
    enum: ['cash'],
    default: 'cash',
  },
}, { timestamps: true })

rideSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    customer: this.customer,
    driver: this.driver,
    pickup: this.pickup,
    dropoff: this.dropoff,
    status: this.status,
    estimatedFare: this.estimatedFare,
    actualFare: this.actualFare,
    distance: this.distance,
    duration: this.duration,
    scheduledAt: this.scheduledAt,
    bookedAt: this.bookedAt,
    acceptedAt: this.acceptedAt,
    completedAt: this.completedAt,
    paymentMethod: this.paymentMethod,
  }
}

export const RIDE_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  ARRIVED: 'arrived',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

const Ride = mongoose.model('Ride', rideSchema)
export default Ride
