import { notFound } from 'next/navigation'
import { BTS_STATIONS } from '@/data/bts-stations'
import { AIRPORTS } from '@/data/airports'
import {
  getCoursesNearStation,
  getCoursesNearAirport,
  getStationSlugs,
  getAirportSlugs,
} from '@/lib/golf-courses-derived'
import { feeNounEn } from '@/lib/course-fees'
import { ogCard, OG_SIZE } from '@/lib/og-card'

export const size = OG_SIZE
export const contentType = 'image/png'
// Module-level, so it cannot follow the roster's fee noun: noun-neutral.
export const alt = 'Golf courses ranked by distance: course roundup'

// Mirror the page's segment config. This is a route handler, so the
// dynamicParams = false on app/[locale]/layout.tsx does not reach it.
export const revalidate = 86400
export const dynamicParams = false

export function generateStaticParams() {
  // The page's own list: station and airport slugs share this route, EN-only.
  return [...getStationSlugs(), ...getAirportSlugs()].map((station) => ({
    locale: 'en',
    station,
  }))
}

interface Props {
  params: Promise<{ locale: string; station: string }>
}

export default async function Image({ params }: Props) {
  const { station } = await params

  // The same roster calls the page makes (8 nearest), so the count and the
  // distance match the first row it lists.
  const airport = AIRPORTS[station]
  if (airport) {
    const items = await getCoursesNearAirport(station, 8)
    if (items.length === 0) notFound()
    return ogCard({
      // The page's hero badge.
      eyebrow: `${airport.iata} · Bangkok`,
      // The page's H1, shortened to fit the card.
      title: `Golf Courses Near ${airport.name}`,
      chips: [`${items.length} nearest courses`, `Closest ~${items[0].km.toFixed(1)} km, straight line`],
      // The airport page's H1 and title take the same noun from the same roster.
      footer: `${feeNounEn(items.map(({ course }) => course))}s · Course Guides · Golf Club Rental`,
    })
  }

  const meta = BTS_STATIONS[station]
  if (!meta) notFound()
  const items = await getCoursesNearStation(station, 8)
  if (items.length === 0) notFound()

  return ogCard({
    // The page's hero badge. Not "<name> BTS": Silom and Sathorn are areas,
    // served by BTS Sala Daeng and Chong Nonsi (data/bts-stations.ts).
    eyebrow: `${meta.name} · Bangkok`,
    // The page's H1.
    title: `Best Golf Courses Near ${meta.name}`,
    chips: [`${items.length} nearest courses`, `Closest ~${items[0].km.toFixed(1)} km, straight line`],
    // No fee noun. The station page's <title>, which a link preview shows
    // beside this card, hardcodes "Green Fees", while its roster's noun is
    // "Rate" on every station today; naming either here would contradict the
    // page or the roster.
    footer: 'Course Guides · Golf Club Rental',
  })
}
