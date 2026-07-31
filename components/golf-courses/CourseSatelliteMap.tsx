'use client'

import { useEffect, useRef, useState } from 'react'
import { ExternalLink, MapPin } from 'lucide-react'
import { loadMapsApi, BASE_MAP_OPTIONS } from '@/lib/maps-loader'
import { pushMapUnavailable } from '@/lib/analytics'

interface Props {
  /** Course name — marker title and aria-label. */
  name: string
  lat: number | null
  lng: number | null
  /** External Google Maps link (place URL, verified coords, or name search). */
  mapsUrl: string
  /**
   * Decided server-side from the build-time presence of
   * NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY. When false, the map frame is never
   * rendered at all — only the link row — so a missing key produces no
   * empty-box layout shift. (No runtime re-check: the client env var is
   * inlined from the same build, so it can't disagree with this flag.)
   */
  enabled?: boolean
  /**
   * Whether the coordinates are accurate enough to drop a pin on
   * (`hasTrustedCoordinates`). False suppresses the map frame but keeps the
   * link row: a pin 1 km off the property is worse than no pin, while a
   * name-search link still gets the reader to the right place.
   */
  coordinatesTrusted?: boolean
}

/**
 * Satellite-view map of the course, displayed live through the Maps JS API
 * (per Google ToS — imagery is never stored or screenshotted). Golfers get
 * an aerial look at the actual layout on all ~145 course pages with
 * coordinates, with zero photo licensing.
 *
 * Initialisation is gated on an IntersectionObserver: the map sits below the
 * fold on every course page, so the Maps script must not compete with LCP.
 * Script failure degrades to the external link only and emits a
 * `map_unavailable` dataLayer event so a broken Maps integration is visible
 * in analytics rather than silent.
 */
export default function CourseSatelliteMap({
  name,
  lat,
  lng,
  mapsUrl,
  enabled = true,
  coordinatesTrusted = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapDivRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [inView, setInView] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)

  // Pinnable only with a key, trustworthy coordinates, and no load failure.
  const canPin = lat !== null && lng !== null && coordinatesTrusted
  const showFrame = enabled && canPin && !loadFailed

  // Report the keyless case exactly once, like the two explorer maps do.
  // Without this, a dropped Maps key silently blanks the LARGEST surface
  // (~145 course pages) while the 15 hub pages fire `map_unavailable` — the
  // dashboard would read as a minor partial outage instead of a total one.
  useEffect(() => {
    if (!enabled) pushMapUnavailable('course_satellite', 'no_key')
  }, [enabled])

  // Arm the observer once; disconnect after first intersection.
  useEffect(() => {
    if (!enabled || !canPin) return
    if (!containerRef.current) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '400px' }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [enabled, canPin])

  useEffect(() => {
    if (!enabled || !canPin || !inView) return

    // Soft navigation between course pages keeps this component mounted:
    // reuse the existing Map (Google Maps has no destroy API — constructing
    // a new one per navigation would leak instances and bill extra loads).
    if (mapRef.current) {
      mapRef.current.setCenter({ lat, lng })
      if (markerRef.current) {
        markerRef.current.position = { lat, lng }
        markerRef.current.title = name
      }
      return
    }


    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY
    if (!apiKey || !mapDivRef.current) return
    let cancelled = false

    loadMapsApi(apiKey)
      .then(() => {
        if (cancelled || !mapDivRef.current) return
        const gmaps = (window as any).google.maps

        const map = new gmaps.Map(mapDivRef.current, {
          ...BASE_MAP_OPTIONS,
          center:            { lat, lng },
          zoom:              15,
          mapTypeId:         'satellite',
          fullscreenControl: true,
        })
        mapRef.current = map
        markerRef.current = new gmaps.marker.AdvancedMarkerElement({
          map,
          position: { lat, lng },
          title: name,
        })
      })
      .catch((err) => {
        if (cancelled) return
        console.error(err)
        setLoadFailed(true)
        pushMapUnavailable('course_satellite', 'load_failed')
      })

    return () => {
      cancelled = true
    }
  }, [enabled, canPin, inView, lat, lng, name])

  return (
    <div ref={containerRef} className="overflow-hidden rounded-2xl border border-border shadow-sm">
      {showFrame && (
        <div
          ref={mapDivRef}
          style={{ width: '100%', height: 380 }}
          role="application"
          aria-label={`Satellite view of ${name}`}
        />
      )}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between bg-white px-5 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-muted/40"
      >
        <span className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
          Open {name} in Google Maps
        </span>
        <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      </a>
    </div>
  )
}
