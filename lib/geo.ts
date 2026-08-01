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

/** Google Maps search URL for a free-text place query. */
export function googleMapsQueryUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

/**
 * Minimum decimal places before a stored coordinate is precise enough to drop
 * a pin on. 3dp is ~110 m — inside the boundary of a golf course, which is
 * typically 1–2 km across. 2dp is ~1.1 km, i.e. off the property entirely:
 * that is the signature of a district centroid, not a surveyed location.
 */
export const MIN_COORD_DECIMALS = 3

// Exported so scripts/validate-courses.ts warns on exactly the rule this
// module enforces at render time, instead of keeping a private copy.
export function decimalPlaces(n: number): number {
  const s = String(n)
  const dot = s.indexOf('.')
  return dot === -1 ? 0 : s.length - dot - 1
}

export interface CourseGeoFields {
  name: string
  province: string
  google_maps_url: string | null
  latitude: number | null
  longitude: number | null
  coordinates_verified_at?: string | null
}

/**
 * A stored `google_maps_url` that is just `?q=<lat>,<lng>` carries no more
 * information than the coordinates themselves — 75 of the 149 course files
 * hold exactly that, synthesized from the same (sometimes wrong) numbers. It
 * must not be treated as an independently-sourced place link.
 */
function isCoordinateQueryUrl(url: string): boolean {
  return /[?&]q=-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(url)
}

/**
 * Are the coordinates good enough to pin on a zoom-15 satellite map and to
 * publish as schema.org GeoCoordinates?
 *
 * An explicit `coordinates_verified_at` attestation always wins. Otherwise we
 * fall back to a precision heuristic, which catches systematic rounding
 * (district centroids) but NOT a precise-looking coordinate that is simply
 * wrong — Alpine shipped 4dp coordinates pointing at urban blocks several km
 * from the course. Only verification catches that, which is what
 * `scripts/verify-course-coordinates.ts` is for.
 */
export function hasTrustedCoordinates(c: CourseGeoFields): boolean {
  if (c.latitude === null || c.longitude === null) return false
  if (c.coordinates_verified_at) return true
  return (
    decimalPlaces(c.latitude) >= MIN_COORD_DECIMALS &&
    decimalPlaces(c.longitude) >= MIN_COORD_DECIMALS
  )
}

/**
 * External Google Maps URL for a course. Single source for the sidebar row,
 * the satellite-map link row, and the JSON-LD hasMap so UI and schema can't
 * point at different URLs.
 *
 * Order of preference:
 *  1. A genuine place URL from the data (not a synthesized `?q=lat,lng`).
 *  2. Coordinates, but ONLY once verified — an unverified coordinate link
 *     sends the reader confidently to the wrong field.
 *  3. A name + province text search. Google's own geocoding of
 *     "Alpine Golf & Sports Club Pathum Thani" beats our scraped numbers,
 *     and when it is unsure it shows results rather than a false pin.
 */
export function courseMapsUrl(c: CourseGeoFields): string {
  if (c.google_maps_url && !isCoordinateQueryUrl(c.google_maps_url)) {
    return c.google_maps_url
  }
  if (c.latitude !== null && c.longitude !== null && c.coordinates_verified_at) {
    return googleMapsSearchUrl(c.latitude, c.longitude)
  }
  return googleMapsQueryUrl(`${c.name} ${c.province}`)
}
