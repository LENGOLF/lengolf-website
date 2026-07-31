'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { MapPinOff } from 'lucide-react'
import type { GolfCourse } from '@/types/golf-courses'
import { loadMapsApi, BASE_MAP_OPTIONS } from '@/lib/maps-loader'
import { pushMapUnavailable } from '@/lib/analytics'

interface RegionCourses {
  region: string
  label: string
  courses: GolfCourse[]
  /** Pin colours sourced from REGION_META on the server — no client-side dictionary needed. */
  pinColor: { bg: string; text: string }
}

interface Props {
  regions: RegionCourses[]
  locale?: string
}

/** Minimal HTML entity escaping for course names inside template literals. */
function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}


export default function HubMapExplorer({ regions, locale = 'en' }: Props) {
  // GolfCourseHub only exists in the locales that SSG the hub (en/th) — the
  // same pattern as CourseMapExplorer's GolfCourseRegion usage.
  const t = useTranslations('GolfCourseHub')
  const mapDivRef = useRef<HTMLDivElement>(null)
  const [mapsUnavailable, setMapsUnavailable] = useState(false)
  const viewGuideLabel = t('viewGuide')

  useEffect(() => {
    const fail = (reason: 'no_key' | 'load_failed') => {
      setMapsUnavailable(true)
      pushMapUnavailable('hub_explorer', reason)
    }
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY
    if (!apiKey) { fail('no_key'); return }
    if (!mapDivRef.current) return
    let cancelled = false

    // EN has no locale prefix (as-needed strategy); other locales get /th, /ko etc.
    const localePrefix = locale === 'en' ? '' : `/${locale}`

    loadMapsApi(apiKey).then(() => {
      if (cancelled || !mapDivRef.current) return
      const gmaps = (window as any).google.maps

      const map = new gmaps.Map(mapDivRef.current, {
        ...BASE_MAP_OPTIONS,
        zoom:   9,
        center: { lat: 13.2, lng: 100.7 },
      })

      const infoWindow = new gmaps.InfoWindow()
      const bounds = new gmaps.LatLngBounds()

      for (const { region, label, courses, pinColor } of regions) {
        const { bg, text } = pinColor
        const href = `${localePrefix}/golf-courses/${region}/`

        for (const course of courses) {
          if (!course.latitude || !course.longitude) continue

          const position = { lat: course.latitude, lng: course.longitude }
          bounds.extend(position)

          const pin = document.createElement('div')
          pin.setAttribute('role', 'button')
          pin.setAttribute('aria-label', `${course.name} — ${label}`)
          pin.setAttribute('tabindex', '0')
          pin.style.cssText = [
            `background:${bg};color:${text};`,
            'width:12px;height:12px;border-radius:50%;',
            'border:2px solid #fff;',
            'box-shadow:0 1px 4px rgba(0,0,0,.4);',
            'cursor:pointer;transition:transform .15s;',
          ].join('')
          pin.addEventListener('mouseenter', () => { pin.style.transform = 'scale(1.6)' })
          pin.addEventListener('mouseleave', () => { pin.style.transform = 'scale(1)' })

          const marker = new gmaps.marker.AdvancedMarkerElement({
            map,
            position,
            content: pin,
            title:   course.name,
          })

          const courseHref = `${localePrefix}/golf-courses/${region}/${course.slug}`
          const openInfo = () => {
            infoWindow.setContent(`
              <div style="font-family:sans-serif;padding:2px 0;min-width:160px">
                <p style="margin:0 0 2px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:${bg}">${escHtml(label)}</p>
                <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#1a1a1a;line-height:1.3">${escHtml(course.name)}</p>
                <a href="${courseHref}" style="display:inline-block;background:${bg};color:${text};padding:4px 12px;border-radius:6px;font-size:11px;font-weight:700;text-decoration:none">
                  ${escHtml(viewGuideLabel)}
                </a>
              </div>
            `)
            infoWindow.open({ map, anchor: marker })
          }
          marker.addListener('gmp-click', openInfo)
          pin.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openInfo() }
          })
        }
      }

      if (!bounds.isEmpty()) map.fitBounds(bounds, 40)
    // Log the real error for diagnosis (key restriction vs CSP vs network),
    // then degrade visibly — console.error alone left a blank map box.
    }).catch((err) => { console.error(err); fail('load_failed') })

    return () => { cancelled = true }
  }, [regions, locale, viewGuideLabel])

  return (
    <div className="overflow-hidden rounded-2xl border border-[#003d22]/15 shadow-sm">
      {/* Legend — dots are decorative; label text carries the meaning */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-[#003d22]/10 bg-white px-4 py-2.5">
        {regions.map(({ region, label, courses, pinColor }) => (
          <span key={region} className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-full border-2 border-white shadow-sm"
              style={{ background: pinColor.bg }}
            />
            {label} <span className="font-normal text-muted-foreground">({courses.length})</span>
          </span>
        ))}
      </div>

      {/* Map */}
      {mapsUnavailable ? (
        <div
          className="flex flex-col items-center justify-center gap-3 bg-[#f8faf9] text-[#003d22]/40"
          style={{ height: 'clamp(260px, 40vw, 420px)' }}
        >
          <MapPinOff className="h-8 w-8" aria-hidden="true" />
          <span className="text-sm font-medium">{t('mapUnavailable')}</span>
        </div>
      ) : (
        <div
          ref={mapDivRef}
          role="application"
          aria-label={t('mapAriaLabel')}
          style={{ width: '100%', height: 'clamp(260px, 40vw, 420px)', display: 'block' }}
        />
      )}
    </div>
  )
}
