const API_BASE = __DEV__
  ? 'http://192.168.0.100:6868/api'
  : 'https://taxi-mouine.de/api'

let accessToken = null

export function setToken(token) {
  accessToken = token
}

export function getToken() {
  return accessToken
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Ein Fehler ist aufgetreten')
  }
  return data
}

export function register(name, phone, password, role = 'customer') {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, phone, password, role }),
  })
}

export function login(phone, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone, password }),
  })
}

export function estimateFare(pickup, dropoff) {
  return request('/fare/estimate', {
    method: 'POST',
    body: JSON.stringify({ pickup, dropoff }),
  })
}

export function createRide(pickup, dropoff, scheduledAt = null) {
  return request('/rides', {
    method: 'POST',
    body: JSON.stringify({ pickup, dropoff, scheduledAt }),
  })
}

export function getRide(id) {
  return request(`/rides/${id}`)
}

export function getMyRides() {
  return request('/rides/history')
}

export function updateRideStatus(id, status) {
  return request(`/rides/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export function updateFcmToken(token) {
  return request('/users/fcm-token', {
    method: 'POST',
    body: JSON.stringify({ fcmToken: token }),
  })
}
