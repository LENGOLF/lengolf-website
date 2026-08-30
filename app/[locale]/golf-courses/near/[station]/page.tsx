import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { SITE_URL } from '@/lib/constants'
import { getBreadcrumbJsonLd } from '@/lib/jsonld'
import { getCourseRoundupJsonLd } from '@/lib/jsonld-courses'
import { BTS_STATIONS } from '@/data/bts-stations'
import { AIRPORTS } from '@/data/airports'
import { pricesByDayOfWeek, feeBasisNoteEn, feeNounEn } from '@/lib/course-fees'
import {
  getCoursesNearStation,
  getCoursesNearAirport,
  getStationSlugs,
  getAirportSlugs,
} from '@/lib/golf-courses-derived'
import { formatFee } from '@/lib/format'
import RoundupList from '@/components/golf-courses/RoundupList'
import CrossLinkBlock from '@/components/golf-courses/CrossLinkBlock'
import RentalCtaBanner from '@/components/golf-courses/RentalCtaBanner'
import { MapPin, Plane } from 'lucide-react'
import { siteOpenGraph } from '@/lib/open-graph'

interface Props {
  params: Promise<{ locale: string; station: string }>
}

export const revalidate = 86400

// Unknown slugs 404 at the routing layer (no on-demand render). An ISR page
// that reaches notFound() on-demand returns 500 on Vercel, not 404.
export const dynamicParams = false

export async function generateStaticParams() {
  // Station slugs and airport slugs share this route; both are emitted so
  // dynamicParams:false serves exactly these paths and 404s everything else.
  // EN-only: omitting `locale` would cross-product with every locale from the
  // root layout, statically rendering ja/ko/zh copies that the middleware 301s
  // to English anyway.
  return [...getStationSlugs(), ...getAirportSlugs()].map((station) => ({
    locale: 'en',
    station,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { station } = await params

  const airport = AIRPORTS[station]
  if (airport) {
    // Title/H1 agreement, by construction. This block used to hardcode "Green
    // Fees" behind a fee-noun-ok escape hatch, on the reasoning that
    // "generateMetadata does not load the roster, so the noun cannot follow it".
    // That was a description of what this function did, not a constraint - it is
    // async, and AirportPage computes the noun from the same roster call. The
    // escape hatch was harmless only while no package course reached an airport
    // roster; flagging krungthep-kreetha (#8 from Suvarnabhumi) ended that, and
    // the page would have shipped "Green Fees" in its SERP title above an H1 and
    // table headers reading "Rates". Deriving it here keeps the two in sync
    // whatever the roster does next.
    const metaItems = await getCoursesNearAirport(station, 8)
    const metaNoun = feeNounEn(metaItems.map(({ course }) => course))
    const title = `Golf Courses Near ${airport.name} (${airport.iata}): Distances & ${metaNoun}s`
    const description = `Golf courses ranked by straight-line distance from ${airport.name} (${airport.iata}), with ${metaNoun.toLowerCase()}s, club-rental availability, and how to book your round.`
    const canonicalUrl = `${SITE_URL}/golf-courses/near/${station}/`
    return {
      title,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: siteOpenGraph({ title, description, url: canonicalUrl, type: 'website' }),
    }
  }

  const meta = BTS_STATIONS[station]
  if (!meta) return { title: 'Not Found' }

  const title = `Best Golf Courses Near ${meta.name} BTS — Drive Times & Green Fees` // fee-noun-ok: page chrome, roster not in scope
  const description = `Top golf courses ranked by distance from ${meta.name} BTS station, with drive times, green fees, and on-site facilities.` // fee-noun-ok: page chrome, roster not in scope
  const canonicalUrl = `${SITE_URL}/golf-courses/near/${station}/`

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: siteOpenGraph({ title, description, url: canonicalUrl, type: 'website' }),
  }
}

export default async function CoursesNearPage({ params }: Props) {
  const { locale, station } = await params
  setRequestLocale(locale)

  // Airport slugs render the richer, booking-intent variant.
  if (AIRPORTS[station]) {
    return <AirportPage locale={locale} slug={station} />
  }

  return <StationPage station={station} />
}

/* ---------------------------------------------------------------------------
 * Airport variant — booking-intent hub for "golf near <airport>" searchers.
 * ------------------------------------------------------------------------- */
async function AirportPage({ locale, slug }: { locale: string; slug: string }) {
  const airport = AIRPORTS[slug]

  const items = await getCoursesNearAirport(slug, 8)
  if (items.length === 0) notFound()

  // True when the listed courses do not all price on the same basis (day-of-week
  // vs season), which forces the shared column headers to go basis-neutral.
  const mixedFeeBasis = items.some(({ course }) => !pricesByDayOfWeek(course))
  // Shared column header over the whole station roster, so it can only name
  // the green-fee noun when every course beneath it charges one.
  const feeNoun = feeNounEn(items.map(({ course }) => course))

  const canonicalUrl = `${SITE_URL}/golf-courses/near/${slug}/`
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Golf Courses', url: `${SITE_URL}/golf-courses/` },
    { name: `Near ${airport.name}`, url: canonicalUrl },
  ])
  const listJsonLd = getCourseRoundupJsonLd(
    items.map((i) => i.course),
    canonicalUrl,
    `Golf courses near ${airport.name} (${airport.iata})`
  )

  const otherAirports = Object.values(AIRPORTS).filter((a) => a.slug !== slug)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#003d22]">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#005a32]/50" />
          <div className="absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-[#007a45]/25" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/50">
            <Link href="/golf-courses" className="transition-colors hover:text-white/80">Golf Courses</Link>
            <span>/</span>
            <span className="text-white/70">Near {airport.shortName}</span>
          </nav>
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
            <Plane className="h-3 w-3" /> {airport.iata} · Bangkok
          </div>
          <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Golf Courses Near {airport.name} ({airport.iata}): Distances, {feeNoun}s &amp; How to Book
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/75">
            {airport.intro}
          </p>
        </div>
        <div className="absolute -bottom-px left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 40V0c240 26.7 480 40 720 40S1200 26.7 1440 0v40H0z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
        {/* Course table */}
        <section>
          <h2 className="mb-1 text-lg font-bold text-foreground">
            {items.length} golf courses near {airport.shortName}, by straight-line distance
          </h2>
          <p className="mb-4 text-xs italic text-muted-foreground">
            Distances are straight-line (as the crow flies) from the {airport.iata} terminal, not driving
            distance or drive time, which depend on the expressway route and traffic. {feeNoun}s are the
            published starting rates from each course guide and are subject to change; confirm the current
            price (and any caddie/cart charges) with the course or your booking platform before you travel.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Straight-line</th>
                  {/* Column headers are shared by every row, so they can only name
                      a basis when all listed courses price the same way. If any
                      seasonal course appears, the headers go basis-neutral and each
                      cell states its own basis. See lib/course-fees.ts. */}
                  <th className="px-4 py-3 font-semibold">{feeNoun} ({mixedFeeBasis ? 'lower' : 'weekday'})</th>
                  <th className="px-4 py-3 font-semibold">{feeNoun} ({mixedFeeBasis ? 'higher' : 'weekend'})</th>
                  <th className="px-4 py-3 font-semibold">Club rental</th>
                </tr>
              </thead>
              <tbody>
                {items.map(({ course, km }) => {
                  const basisNote = (which: 'lower' | 'upper') =>
                    mixedFeeBasis ? ` (${feeBasisNoteEn(course, which)})` : ''
                  const weekday = formatFee(course.green_fee_weekday_thb)
                  const weekend = formatFee(course.green_fee_weekend_thb)
                  const rental =
                    course.club_rental_available === true
                      ? course.club_rental_fee_thb
                        ? `Yes · from ${formatFee(course.club_rental_fee_thb)}`
                        : 'Yes'
                      : course.club_rental_available === false
                        ? 'No'
                        : 'Not listed'
                  return (
                    <tr key={course.slug} className="border-b border-border/60 last:border-0 align-top">
                      <td className="px-4 py-3">
                        <Link
                          href={`/golf-courses/${course.region}/${course.slug}`}
                          className="font-semibold text-primary hover:underline"
                        >
                          {course.name}
                        </Link>
                        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                          <MapPin className="h-2.5 w-2.5" /> {course.province}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-foreground/80">~{km.toFixed(1)} km</td>
                      <td className="px-4 py-3 whitespace-nowrap text-foreground/80">{weekday ? `${weekday}${basisNote('lower')}` : 'Not listed'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-foreground/80">{weekend ? `${weekend}${basisNote('upper')}` : 'Not listed'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-foreground/80">{rental}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* How to book */}
        <section className="rounded-2xl border border-border bg-muted/20 p-6 sm:p-8">
          <h2 className="mb-3 text-lg font-bold text-foreground">How to book golf near {airport.shortName}</h2>
          <p className="mb-3 text-sm leading-relaxed text-foreground/80">{airport.transitNotes}</p>
          <ul className="space-y-2 text-sm leading-relaxed text-foreground/80">
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <span>
                <strong className="text-foreground">Reserve ahead.</strong> Most Bangkok courses take tee-time
                bookings by phone or through a booking platform, and several ask for at least a day’s notice
                (more at weekends). Check each course’s own guide (linked above) for its booking rules.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <span>
                <strong className="text-foreground">Confirm the total, not just the green fee.</strong>{/* fee-noun-ok: advice TELLING the reader the green fee is not the total — the noun is the subject of the warning, not a label on a number */} Caddie
                fees are usually compulsory and cart hire is often extra, so the on-the-day total can be well
                above the starting {feeNoun.toLowerCase()} shown above.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <span>
                <strong className="text-foreground">Plan the transfer.</strong> Straight-line distance is not
                drive time: Bangkok traffic and expressway access change the real journey significantly. Our{' '}
                <Link href={airport.guideHref} className="text-primary hover:underline">
                  {airport.shortName} arrival guide
                </Link>{' '}
                covers getting from arrivals to your tee time.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <span>
                <strong className="text-foreground">Travelling without clubs?</strong> LENGOLF{' '}
                <Link href="/golf-course-club-rental" className="text-primary hover:underline">
                  delivers rental sets to your Bangkok hotel
                </Link>{' '}
                and picks them up after your round, useful if you’d rather not fly with a golf bag.
              </span>
            </li>
          </ul>
        </section>

        {/* Short layover pitch */}
        <section className="rounded-2xl border border-accent/30 bg-accent/5 p-6 sm:p-8">
          <h2 className="mb-2 text-lg font-bold text-foreground">Short layover or tight schedule?</h2>
          <p className="text-sm leading-relaxed text-foreground/80">
            If you don’t have the hours a full 18 near {airport.shortName} demands, the LENGOLF indoor
            simulator sits above BTS Chidlom in central Bangkok, a quick, air-conditioned way to hit balls
            between flights or before checking in. It’s a 30-second walk from the station, so a
            city-centre layover can still include golf. See the{' '}
            <Link href={airport.guideHref} className="font-semibold text-primary hover:underline">
              {airport.shortName} arrival guide
            </Link>{' '}
            for routes into town, or arrange{' '}
            <Link href="/golf-course-club-rental" className="font-semibold text-primary hover:underline">
              club rental for a course round
            </Link>
            .
          </p>
        </section>

        <RentalCtaBanner
          eyebrow={`Flying into ${airport.iata} without clubs?`}
          body={
            <>
              We deliver premium club sets to your Bangkok hotel and pick them up after your round,
              from <strong className="text-white">1,200 THB/day</strong>. Or practise at the LENGOLF
              simulator in Chidlom between flights.
            </>
          }
        />

        <CrossLinkBlock
          heading="Airport & arrival guides"
          items={[
            {
              label: airport.guideLabel,
              href: airport.guideHref,
              description: airport.guideDescription,
            },
            ...otherAirports.map((a) => ({
              label: `Golf courses near ${a.name} (${a.iata})`,
              href: `/golf-courses/near/${a.slug}`,
              description: `Courses ranked by straight-line distance from ${a.shortName}.`,
            })),
          ]}
        />
      </div>
    </>
  )
}

/* ---------------------------------------------------------------------------
 * Station variant — unchanged BTS/district proximity page.
 * ------------------------------------------------------------------------- */
async function StationPage({ station }: { station: string }) {
  const meta = BTS_STATIONS[station]
  if (!meta) notFound()

  const items = await getCoursesNearStation(station, 8)
  if (items.length === 0) notFound()

  const canonicalUrl = `${SITE_URL}/golf-courses/near/${station}/`
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Golf Courses', url: `${SITE_URL}/golf-courses/` },
    { name: `Near ${meta.name}`, url: canonicalUrl },
  ])
  const listJsonLd = getCourseRoundupJsonLd(
    items.map((i) => i.course),
    canonicalUrl,
    `Best golf courses near ${meta.name} BTS`
  )

  // Sibling station cross-links
  const siblingStations = Object.values(BTS_STATIONS).filter((s) => s.slug !== station)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#003d22]">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#005a32]/50" />
          <div className="absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-[#007a45]/25" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/50">
            <Link href="/golf-courses" className="transition-colors hover:text-white/80">Golf Courses</Link>
            <span>/</span>
            <span className="text-white/70">Near {meta.name}</span>
          </nav>
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
            <MapPin className="h-3 w-3" /> {meta.name} · Bangkok
          </div>
          <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Best Golf Courses Near {meta.name}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/75">
            {meta.description}
          </p>
        </div>
        <div className="absolute -bottom-px left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 40V0c240 26.7 480 40 720 40S1200 26.7 1440 0v40H0z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
        <section>
          <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
            Top {items.length} courses ranked by straight-line distance from {meta.name}
          </h2>
          <p className="mb-5 text-xs italic text-muted-foreground">
            Straight-line distance, not drive time. Bangkok traffic and expressway access can change actual travel
            time significantly — check Google Maps before tee-off.
          </p>
          <RoundupList
            items={items.map(({ course, km }) => ({
              course,
              reason: `${km.toFixed(1)} km from ${meta.name} BTS (straight line).`,
            }))}
          />
        </section>

        <RentalCtaBanner
          eyebrow={`No clubs in your ${meta.name} hotel?`}
          body={
            <>
              We deliver premium club sets to your hotel and pick them up after your round —
              from <strong className="text-white">1,200 THB/day</strong>. Or skip the drive entirely and
              practice at the LENGOLF simulator in Chidlom.
            </>
          }
        />

        <CrossLinkBlock
          heading="Other Bangkok BTS / district guides"
          items={siblingStations.map((s) => ({
            label: `Golf courses near ${s.name}`,
            href: `/golf-courses/near/${s.slug}`,
          }))}
        />

        {meta.areaSlug && (
          <CrossLinkBlock
            heading={`Hotels & things to do in ${meta.name}`}
            items={[
              {
                label: `${meta.name} area guide`,
                href: `/location/${meta.areaSlug}` as `/${string}`,
                description: 'Hotels, restaurants, and golf-friendly transit options in the area.',
              },
            ]}
          />
        )}
      </div>
    </>
  )
}
