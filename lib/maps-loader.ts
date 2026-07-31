// Shared Map constructor options for all three map components. The map ID
// enables AdvancedMarkerElement; DEMO_MAP_ID is Google's documented
// development-only placeholder. Register a Cloud Map ID in Google Cloud
// Console and set NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID in Vercel — config-only
// swap, no code change. Per-component overrides (zoom, mapTypeId,
// fullscreenControl) spread on top.
export const BASE_MAP_OPTIONS = {
  mapId:             process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID',
  zoomControl:       true,
  streetViewControl: false,
  mapTypeControl:    false,
  fullscreenControl: false,
} as const

// Client-side Google Maps JS API loader. Window-level promise so the script
// loads exactly once regardless of how many map components mount across the
// page or client-side navigations (CourseMapExplorer, HubMapExplorer,
// CourseSatelliteMap all share this).
export function loadMapsApi(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  const w = window as any
  if (w.google?.maps?.Map) return Promise.resolve()
  if (w.__mapsApiPromise) return w.__mapsApiPromise
  w.__mapsApiPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&v=weekly`
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => { delete w.__mapsApiPromise; reject(new Error('Maps JS API failed to load')) }
    document.head.appendChild(script)
  })
  return w.__mapsApiPromise
}
