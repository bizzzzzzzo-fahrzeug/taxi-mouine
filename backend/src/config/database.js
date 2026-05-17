import mongoose from 'mongoose'
import config from './index.js'

export async function connectDatabase() {
  try {
    await mongoose.connect(config.mongodbUri)
    console.log('MongoDB connected:', config.mongodbUri)
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB runtime error:', err.message)
  })
}
