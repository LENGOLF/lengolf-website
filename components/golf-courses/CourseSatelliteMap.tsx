'use client'

import { useEffect, useRef, useState } from 'react'
import { ExternalLink, MapPin } from 'lucide-react'
import { loadMapsApi } from '@/lib/maps-loader'

interface Props {
  /** Course name — marker title and aria-label. */
  name: string
  lat: number
  lng: number
  /** External Google Maps link (course's own URL or synthesized from coords). */
  mapsUrl: string
}

/**
 * Satellite-view map of the course, displayed live through the Maps JS API
 * (per Google ToS — imagery is never stored or screenshotted). Golfers get
 * an aerial look at the actual layout on all ~145 course pages with
 * coordinates, with zero photo licensing.
 *
 * Initialisation is gated on an IntersectionObserver: the map sits below the
 * fold on every course page, so the Maps script must not compete with LCP.
 * Missing API key or script failure degrades to the external link only.
 */
export default function CourseSatelliteMap({ name, lat, lng, mapsUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapDivRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [mapsUnavailable, setMapsUnavailable] = useState(false)

  // Arm the observer once; disconnect after first intersection.
  useEffect(() => {
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
  }, [])

  useEffect(() => {
    if (!inView) return
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY
    if (!apiKey) {
      setMapsUnavailable(true)
      return
    }
    if (!mapDivRef.current) return
    let cancelled = false

    loadMapsApi(apiKey)
      .then(() => {
        if (cancelled || !mapDivRef.current) return
        const gmaps = (window as any).google.maps

        const map = new gmaps.Map(mapDivRef.current, {
          center:            { lat, lng },
          zoom:              15,
          mapTypeId:         'satellite',
          // DEMO_MAP_ID enables AdvancedMarkerElement (matches the explorers)
          mapId:             'DEMO_MAP_ID',
          zoomControl:       true,
          streetViewControl: false,
          mapTypeControl:    false,
          fullscreenControl: true,
        })
        new gmaps.marker.AdvancedMarkerElement({
          map,
          position: { lat, lng },
          title: name,
        })
      })
      .catch(() => setMapsUnavailable(true))

    return () => {
      cancelled = true
    }
  }, [inView, lat, lng, name])

  return (
    <div ref={containerRef} className="overflow-hidden rounded-2xl border border-border shadow-sm">
      {!mapsUnavailable && (
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
