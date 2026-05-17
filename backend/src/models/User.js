import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['customer', 'driver', 'admin'],
    default: 'customer',
  },
  fcmToken: {
    type: String,
    default: null,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next()
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12)
  next()
})

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash)
}

userSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    name: this.name,
    phone: this.phone,
    email: this.email,
    role: this.role,
    isOnline: this.isOnline,
  }
}

const User = mongoose.model('User', userSchema)

export const ROLES = {
  CUSTOMER: 'customer',
  DRIVER: 'driver',
  ADMIN: 'admin',
}

export default User
