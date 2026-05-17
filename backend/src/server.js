import express from 'express'
import cors from 'cors'
import http from 'http'
import { connectDatabase } from './config/database.js'
import config from './config/index.js'
import authRoutes from './routes/auth.js'
import fareRoutes from './routes/fare.js'
import rideRoutes from './routes/rides.js'
import driverRoutes from './routes/driver.js'
import { setupSocket } from './socket/index.js'

const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/fare', fareRoutes)
app.use('/api/rides', rideRoutes)
app.use('/api/driver', driverRoutes)

async function start() {
  await connectDatabase()

  const io = setupSocket(server)

  const PORT = config.port
  server.listen(PORT, () => {
    console.log(`Taxi Mouine backend running on port ${PORT}`)
  })
}

start()

export { app, server }
