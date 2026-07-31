/**
 * Great-circle distance between two lat/lng points in kilometres.
 * Used by golf-courses-derived to rank courses by distance from a BTS station.
 */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const sa =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(sa))
}

/** Google Maps search URL for a lat/lng point. */
export function googleMapsSearchUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
}

/**
 * External Google Maps URL for a course: its own maps URL when the data has
 * one, else synthesized from coordinates. Single source for the sidebar row,
 * the satellite-map link row, and the JSON-LD hasMap so UI and schema can't
 * point at different URLs.
 */
export function courseMapsUrl(c: {
  google_maps_url: string | null
  latitude: number | null
  longitude: number | null
}): string | null {
  if (c.google_maps_url) return c.google_maps_url
  if (c.latitude !== null && c.longitude !== null) {
    return googleMapsSearchUrl(c.latitude, c.longitude)
  }
  return null
}
