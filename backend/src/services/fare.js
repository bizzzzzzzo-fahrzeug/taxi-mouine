import config from '../config/index.js'

export function calculateFare(distanceKm) {
  const { base, perKm, baseKm } = config.fare

  if (distanceKm <= baseKm) {
    return base
  }

  const extraKm = distanceKm - baseKm
  return base + (extraKm * perKm)
}

export function formatFare(amount) {
  return `€${amount.toFixed(2)}`
}
