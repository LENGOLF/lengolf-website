'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Clock, Flag, X, ExternalLink, MapPinOff } from 'lucide-react'
import type { GolfCourse } from '@/types/golf-courses'
import { formatFee, driveTimeLabel } from '@/lib/format'
import { loadMapsApi } from '@/lib/maps-loader'
import { pushDataLayerEvent } from '@/lib/analytics'

interface RegionCenter {
  lat: number
  lng: number
  zoom: number
}

interface Props {
  courses: GolfCourse[]
  region: string
  /** Localized region name for display (e.g. the map aria-label); the raw
   *  `region` slug is still used for building course-detail hrefs. */
  regionLabel: string
  /** Default map centre / zoom, derived from REGION_META on the server side. */
  center: RegionCenter
}

function makePin(index: number, active: boolean, courseName: string): HTMLDivElement {
  const el = document.createElement('div')
  el.style.cssText = [
    'width:28px;height:28px;border-radius:50%;',
    `background:${active ? '#c8a96e' : '#003d22'};`,
    `color:${active ? '#1a1a1a' : '#fff'};`,
    'display:flex;align-items:center;justify-content:center;',
    'font-size:11px;font-weight:900;',
    'cursor:pointer;',
    'box-shadow:0 2px 6px rgba(0,0,0,.45);',
    'border:2px solid #fff;',
    `transform:${active ? 'scale(1.3)' : 'scale(1)'};`,
    'transition:transform .15s,background .15s;',
  ].join('')
  el.textContent = String(index + 1)
  // Accessibility: keyboard-operable marker
  el.setAttribute('role', 'button')
  el.setAttribute('aria-label', courseName)
  el.setAttribute('tabindex', '0')
  return el
}

export default function CourseMapExplorer({ courses, region, regionLabel, center }: Props) {
  const t = useTranslations('GolfCourseRegion')
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const [mapsUnavailable, setMapsUnavailable] = useState(false)
  const activeCourse = courses.find((c) => c.slug === activeSlug) ?? null

  const mapDivRef  = useRef<HTMLDivElement>(null)
  const mapRef     = useRef<any>(null)
  const markersRef = useRef<{ marker: any; pin: HTMLDivElement; slug: string }[]>([])

  const handleListRow = useCallback((slug: string) => {
    setActiveSlug((prev) => (prev === slug ? null : slug))
  }, [])

  // ── Load map + place markers ──────────────────────────────────────────────
  useEffect(() => {
    const fail = (reason: 'no_key' | 'load_failed') => {
      setMapsUnavailable(true)
      pushDataLayerEvent({ event: 'map_unavailable', source: 'region_explorer', reason })
    }
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY
    if (!apiKey) {
      fail('no_key')
      return
    }
    if (!mapDivRef.current) return
    let cancelled = false

    loadMapsApi(apiKey).then(() => {
      if (cancelled || !mapDivRef.current) return
      const gmaps = (window as any).google.maps

      const map = new gmaps.Map(mapDivRef.current, {
        center:            { lat: center.lat, lng: center.lng },
        zoom:              center.zoom,
        // 'DEMO_MAP_ID' is Google's placeholder — styled maps require a real
        // cloud Map ID registered in Google Cloud Console.
        mapId:             'DEMO_MAP_ID',
        zoomControl:       true,
        streetViewControl: false,
        mapTypeControl:    false,
        fullscreenControl: false,
      })
      mapRef.current = map

      const bounds = new gmaps.LatLngBounds()

      markersRef.current = courses
        .map((course, i) => {
          if (!course.latitude || !course.longitude) return null
          const pin = makePin(i, false, course.name)
          const position = { lat: course.latitude, lng: course.longitude }
          const marker = new gmaps.marker.AdvancedMarkerElement({
            map,
            position,
            content: pin,
            title:   course.name,
          })
          const toggle = () => setActiveSlug((prev) => (prev === course.slug ? null : course.slug))
          marker.addListener('gmp-click', toggle)
          // Keyboard: fire on Enter/Space so the button role is functional
          pin.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle() }
          })
          bounds.extend(position)
          return { marker, pin, slug: course.slug }
        })
        .filter(Boolean) as { marker: any; pin: HTMLDivElement; slug: string }[]

      if (!bounds.isEmpty()) map.fitBounds(bounds, 48)
    }).catch(() => fail('load_failed'))

    return () => {
      cancelled = true
      markersRef.current.forEach(({ marker }) => { marker.map = null })
      markersRef.current = []
    }
  // courses is stable per page (SSG); only re-init if region or center changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, center])

  // ── Sync marker styles + pan map when active slug changes ─────────────────
  useEffect(() => {
    markersRef.current.forEach(({ pin, slug }) => {
      const active = slug === activeSlug
      pin.style.background = active ? '#c8a96e' : '#003d22'
      pin.style.color       = active ? '#1a1a1a' : '#fff'
      pin.style.transform   = active ? 'scale(1.3)' : 'scale(1)'
    })

    const map = mapRef.current
    if (!map) return

    if (activeSlug) {
      const course = courses.find((c) => c.slug === activeSlug)
      if (course?.latitude && course?.longitude) {
        map.panTo({ lat: course.latitude, lng: course.longitude })
        map.setZoom(13)
      }
    } else {
      map.panTo({ lat: center.lat, lng: center.lng })
      map.setZoom(center.zoom)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlug, center]) // `courses` intentionally excluded: changes are handled by the first effect; including it would cause redundant re-pans on every render

  const activeMapsUrl = activeCourse?.google_maps_url
    ?? (activeCourse?.latitude && activeCourse?.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${activeCourse.latitude},${activeCourse.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          [activeCourse?.name, activeCourse?.province].filter(Boolean).join(' ')
        )}`)

  return (
    <div className="mx-auto max-w-6xl px-4 pb-6 sm:px-6 lg:px-8">

      {/* ── Map + detail panel ── */}
      <div
        id="course-map"
        className="relative mb-0 overflow-hidden rounded-3xl border border-[#003d22]/15 shadow-xl"
      >
        <div className="flex flex-col lg:flex-row">

          {/* Google Maps JS div — or fallback when API key is missing */}
          <div className="relative flex-1" style={{ minHeight: 420 }}>
            {mapsUnavailable ? (
              <div
                className="flex h-full min-h-[420px] flex-col items-center justify-center gap-3 bg-[#f8faf9] text-muted-foreground"
                role="region"
                aria-label={t('mapUnavailable')}
              >
                <MapPinOff className="h-8 w-8 opacity-40" />
                <p className="text-sm">{t('mapUnavailable')}</p>
              </div>
            ) : (
              <div
                ref={mapDivRef}
                style={{ width: '100%', height: '100%', minHeight: 420, display: 'block' }}
                role="application"
                aria-label={t('mapAriaLabel', { region: regionLabel })}
              />
            )}
          </div>

          {/* Info panel — slides in when a course is selected */}
          <div
            className={[
              'transition-all duration-300',
              activeCourse
                ? 'w-full border-t border-[#003d22]/10 bg-white lg:w-80 lg:border-l lg:border-t-0'
                : 'w-0 overflow-hidden',
            ].join(' ')}
          >
            {activeCourse && (
              <div className="flex h-full flex-col p-6">
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div>
                    <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-[#c8a96e]">
                      {activeCourse.province}
                    </p>
                    <h3 className="text-base font-black leading-snug text-[#003d22]">
                      {activeCourse.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveSlug(null)}
                    className="mt-0.5 shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted"
                    aria-label={t('close')}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-2">
                  {activeCourse.holes && (
                    <div className="rounded-xl bg-[#f0f7f2] px-3 py-2.5">
                      <p className="text-xs font-bold text-[#003d22]">{t('holes', { count: activeCourse.holes })}</p>
                      <p className="text-[10px] text-muted-foreground">{t('par', { value: activeCourse.par })}</p>
                    </div>
                  )}
                  {activeCourse.drive_time_from_bangkok_min && (
                    <div className="rounded-xl bg-[#f0f7f2] px-3 py-2.5">
                      <p className="text-xs font-bold text-[#003d22]">
                        {driveTimeLabel(activeCourse.drive_time_from_bangkok_min, false)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{t('fromBangkok')}</p>
                    </div>
                  )}
                </div>

                {(activeCourse.green_fee_weekday_thb || activeCourse.green_fee_weekend_thb) && (
                  <div className="mb-4 space-y-2 rounded-xl border border-[#003d22]/10 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('greenFees')}</p>
                    {activeCourse.green_fee_weekday_thb && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{t('weekday')}</span>
                        <span className="text-xs font-bold text-foreground">{formatFee(activeCourse.green_fee_weekday_thb)}</span>
                      </div>
                    )}
                    {activeCourse.green_fee_weekend_thb && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{t('weekend')}</span>
                        <span className="text-xs font-bold text-foreground">{formatFee(activeCourse.green_fee_weekend_thb)}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-auto flex flex-col gap-2">
                  <Link
                    href={`/golf-courses/${region}/${activeCourse.slug}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#003d22] px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#005a32]"
                  >
                    {t('fullCourseGuide')} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <a
                    href={activeMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#003d22]/20 px-4 py-2.5 text-xs font-semibold text-[#003d22] transition-all hover:bg-[#f0f7f2]"
                  >
                    {t('openInGoogleMaps')} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Course roster ── */}
      <div className="mt-2 overflow-hidden rounded-3xl border border-[#003d22]/10 bg-white shadow-sm">
        <div className="grid grid-cols-[32px_1fr_auto] items-center gap-3 border-b border-[#003d22]/10 bg-[#003d22] px-5 py-3 sm:grid-cols-[32px_1fr_140px_100px]">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{t('rosterNum')}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{t('rosterCourse')}</span>
          <span className="hidden text-right text-[10px] font-bold uppercase tracking-widest text-white/40 sm:block">{t('rosterGreenFee')}</span>
          <span className="text-right text-[10px] font-bold uppercase tracking-widest text-white/40">{t('rosterDrive')}</span>
        </div>

        {courses.map((course, i) => {
          const isActive = activeSlug === course.slug
          const weekday  = course.green_fee_weekday_thb
          const weekend  = course.green_fee_weekend_thb

          return (
            // Anchor, not <button>: the roster is the region hub's only full
            // course listing, so these must be crawlable links to the 149
            // detail pages (buttons left the hub with zero indexable course
            // links). Plain click still toggles the map panel; modified
            // clicks (cmd/ctrl/shift/middle) fall through to real navigation.
            <Link
              key={course.slug}
              href={`/golf-courses/${region}/${course.slug}`}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
                e.preventDefault()
                handleListRow(course.slug)
              }}
              className={[
                'grid w-full grid-cols-[32px_1fr_auto] items-center gap-3 px-5 py-4 text-left transition-all',
                'sm:grid-cols-[32px_1fr_140px_100px]',
                'border-b border-[#003d22]/5 last:border-0',
                isActive ? 'bg-[#f0f7f2]' : 'hover:bg-[#f9fcfa]',
              ].join(' ')}
              aria-current={isActive ? 'true' : undefined}
            >
              <span className={[
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black transition-all',
                isActive ? 'bg-[#c8a96e] text-[#1a1a1a]' : 'bg-[#003d22]/10 text-[#003d22]',
              ].join(' ')}>
                {i + 1}
              </span>

              <div className="min-w-0">
                <p className={['truncate text-sm font-bold leading-tight transition-colors', isActive ? 'text-[#003d22]' : 'text-foreground'].join(' ')}>
                  {course.name}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">{course.province}</span>
                  {course.holes && (
                    <span className="text-[11px] text-muted-foreground/60">{t('rosterHolesPar', { holes: course.holes, par: course.par })}</span>
                  )}
                  {weekday && (
                    <span className="text-[11px] font-semibold text-[#003d22] sm:hidden">
                      {weekday.toLocaleString('en-US')} {t('thb')}
                    </span>
                  )}
                </div>
              </div>

              <div className="hidden text-right sm:block">
                {weekday ? (
                  <>
                    <p className="text-sm font-bold text-foreground">
                      {weekday.toLocaleString('en-US')}
                      <span className="ml-0.5 text-[10px] font-medium text-muted-foreground">{t('thb')}</span>
                    </p>
                    {weekend && (
                      <p className="text-[11px] text-muted-foreground">{weekend.toLocaleString('en-US')} {t('wknd')}</p>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground/50">—</span>
                )}
              </div>

              <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                {course.drive_time_from_bangkok_min ? (
                  <><Clock className="h-3 w-3 shrink-0" />{driveTimeLabel(course.drive_time_from_bangkok_min, false)}</>
                ) : (
                  <span className="text-muted-foreground/40">—</span>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {activeCourse && (
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-[#003d22]/15 bg-[#f0f7f2] px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003d22] text-white">
              <Flag className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="text-xs font-bold text-[#003d22]">{activeCourse.name}</p>
              <p className="text-[10px] text-muted-foreground">{t('viewFullGuide')}</p>
            </div>
          </div>
          <Link
            href={`/golf-courses/${region}/${activeCourse.slug}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#003d22] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#005a32]"
          >
            {t('openGuide')} <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  )
}
