import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../../.env') })

export default {
  port: parseInt(process.env.PORT) || 6868,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/taxi-mouine',
  jwtSecret: process.env.JWT_SECRET || 'taxi-mouine-jwt-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  fare: {
    base: parseFloat(process.env.FARE_BASE) || 4.00,
    perKm: parseFloat(process.env.FARE_PER_KM) || 2.00,
    baseKm: parseFloat(process.env.FARE_BASE_KM) || 2,
  },
}
