import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import User from '../models/User.js'

export function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Nicht autorisiert' })
  }

  try {
    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, config.jwtSecret)
    req.userId = decoded.userId
    req.userRole = decoded.role
    next()
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Token ungültig oder abgelaufen' })
  }
}

export function optionalAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    req.userId = null
    req.userRole = null
    return next()
  }

  try {
    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, config.jwtSecret)
    req.userId = decoded.userId
    req.userRole = decoded.role
  } catch {
    req.userId = null
    req.userRole = null
  }
  next()
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ success: false, error: 'Keine Berechtigung' })
    }
    next()
  }
}

export function generateTokens(user) {
  const payload = { userId: user._id, role: user.role }
  const accessToken = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  })
  const refreshToken = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  })
  return { accessToken, refreshToken }
}
