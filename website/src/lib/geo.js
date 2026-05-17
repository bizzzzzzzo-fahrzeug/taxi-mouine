const UA = 'TaxiMouine/1.0'

export async function geocode(query) {
  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '6')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('countrycodes', 'de')
  url.searchParams.set('accept-language', 'de')
  url.searchParams.set('viewbox', '6.20,51.30,6.60,51.05')

  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'de' } })
    if (!res.ok) return []
    const json = await res.json()
    return json.map((r) => ({
      label: r.display_name,
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
    }))
  } catch {
    return []
  }
}

export async function fetchRoute(pickup, dropoff) {
  const url = `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?geometries=geojson&overview=full`
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } })
    if (!res.ok) return null
    const json = await res.json()
    const coords = json.routes?.[0]?.geometry?.coordinates
    if (!coords) return null
    return coords.map(([lng, lat]) => [lat, lng])
  } catch {
    return null
  }
}

export async function reverseGeocode(lat, lng) {
  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.searchParams.set('lat', lat)
  url.searchParams.set('lon', lng)
  url.searchParams.set('format', 'json')
  url.searchParams.set('accept-language', 'de')

  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'de' } })
    if (!res.ok) return null
    const json = await res.json()
    return json.display_name || null
  } catch {
    return null
  }
}
