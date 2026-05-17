import { Router } from 'express'
import User, { ROLES } from '../models/User.js'
import { generateTokens, authenticate } from '../middleware/auth.js'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, Telefon und Passwort sind erforderlich',
      })
    }

    const existing = await User.findOne({ phone })
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Diese Telefonnummer ist bereits registriert',
      })
    }

    const userRole = role === ROLES.DRIVER ? ROLES.DRIVER : ROLES.CUSTOMER
    const user = new User({
      name,
      phone,
      email,
      passwordHash: password,
      role: userRole,
    })
    await user.save()

    const tokens = generateTokens(user)
    res.status(201).json({
      success: true,
      user: user.toPublicJSON(),
      ...tokens,
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        error: 'Telefonnummer und Passwort sind erforderlich',
      })
    }

    const user = await User.findOne({ phone })
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Falsche Telefonnummer oder Passwort',
      })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Falsche Telefonnummer oder Passwort',
      })
    }

    const tokens = generateTokens(user)
    res.json({
      success: true,
      user: user.toPublicJSON(),
      ...tokens,
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh-Token erforderlich',
      })
    }

    const jwt = await import('jsonwebtoken')
    const config = (await import('../config/index.js')).default
    const decoded = jwt.default.verify(refreshToken, config.jwtSecret)
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Benutzer nicht gefunden',
      })
    }

    const tokens = generateTokens(user)
    res.json({ success: true, ...tokens })
  } catch (err) {
    res.status(401).json({
      success: false,
      error: 'Ungültiger Refresh-Token',
    })
  }
})

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ success: false, error: 'Benutzer nicht gefunden' })
    }
    res.json({ success: true, user: user.toPublicJSON() })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
