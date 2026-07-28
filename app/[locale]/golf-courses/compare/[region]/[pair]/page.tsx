import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { SITE_URL } from '@/lib/constants'
import { REGION_META, getCourseBySlug, type Region } from '@/lib/golf-courses'
import { getBreadcrumbJsonLd } from '@/lib/jsonld'
import { getCourseComparisonJsonLd } from '@/lib/jsonld-courses'
import {
  comparisonCrossLink,
  getComparisonPairs,
  parsePairSlug,
  pairSlug,
  getTopCoursesByRegion,
} from '@/lib/golf-courses-derived'
import SpecTable from '@/components/golf-courses/SpecTable'
import CrossLinkBlock from '@/components/golf-courses/CrossLinkBlock'
import RentalCtaBanner from '@/components/golf-courses/RentalCtaBanner'
import { Flag } from 'lucide-react'
import type { GolfCourse } from '@/types/golf-courses'

interface Props {
  params: Promise<{ locale: string; region: string; pair: string }>
}

export const revalidate = 86400

// Unknown region/pair combos 404 at the routing layer (no on-demand render). An
// ISR page that reaches notFound() on-demand returns 500 on Vercel, not 404.
export const dynamicParams = false

export async function generateStaticParams() {
  // EN-only: omitting `locale` would cross-product with every locale from the
  // root layout, statically rendering ja/ko/zh copies that the middleware 301s
  // to English anyway.
  const pairs = await getComparisonPairs()
  return pairs.map((p) => ({ locale: 'en', region: p.region, pair: pairSlug(p.slugA, p.slugB) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region, pair } = await params
  const pairs = await getComparisonPairs()
  const parsed = parsePairSlug(region as Region, pair, pairs)
  if (!parsed) return { title: 'Comparison Not Found' }

  const [a, b] = await Promise.all([
    getCourseBySlug(region, parsed.slugA),
    getCourseBySlug(region, parsed.slugB),
  ])
  if (!a || !b) return { title: 'Comparison Not Found' }

  const regionLabel = REGION_META[region as Region].label
  const title = `${a.name} vs ${b.name} — ${regionLabel} Golf Course Comparison`
  const description = `Compare ${a.name} and ${b.name}: green fees, par, designer, drive time, and which course suits which kind of round. ${regionLabel}, Thailand.`
  const canonicalUrl = `${SITE_URL}/golf-courses/compare/${region}/${pair}/`

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl, type: 'website' },
  }
}

/**
 * Programmatic "When to choose A / B" — derives recommendations purely from
 * numeric/boolean differences between the two courses. No LLM-style prose,
 * no editorial judgement — every line is a data lookup.
 */
function whenToChoose(a: GolfCourse, b: GolfCourse): { forA: string[]; forB: string[] } {
  const forA: string[] = []
  const forB: string[] = []

  // Weekday fee
  if (a.green_fee_weekday_thb !== null && b.green_fee_weekday_thb !== null) {
    const diff = a.green_fee_weekday_thb - b.green_fee_weekday_thb
    if (Math.abs(diff) >= 500) {
      const cheaper = diff < 0 ? a : b
      const pricier = diff < 0 ? b : a
      const list = diff < 0 ? forA : forB
      list.push(
        `Weekday budget — ${cheaper.name} is ${Math.abs(diff).toLocaleString('en-US')} THB cheaper than ${pricier.name}.`
      )
    }
  }

  // Weekend premium
  if (a.green_fee_weekend_thb !== null && b.green_fee_weekend_thb !== null) {
    const diff = a.green_fee_weekend_thb - b.green_fee_weekend_thb
    if (Math.abs(diff) >= 500) {
      const cheaper = diff < 0 ? a : b
      const list = diff < 0 ? forA : forB
      list.push(`Weekend value — ${cheaper.name} costs less on Saturday/Sunday.`)
    }
  }

  // Drive time
  if (a.drive_time_from_bangkok_min !== null && b.drive_time_from_bangkok_min !== null) {
    const diff = a.drive_time_from_bangkok_min - b.drive_time_from_bangkok_min
    if (Math.abs(diff) >= 15) {
      const closer = diff < 0 ? a : b
      const list = diff < 0 ? forA : forB
      list.push(
        `Closer to Bangkok — ${closer.name} is about ${Math.abs(diff)} minutes shorter on the drive.`
      )
    }
  }

  // Driving range
  if (a.driving_range === true && b.driving_range !== true) {
    forA.push(`Warm-up range — ${a.name} has an on-site driving range.`)
  }
  if (b.driving_range === true && a.driving_range !== true) {
    forB.push(`Warm-up range — ${b.name} has an on-site driving range.`)
  }

  // Designer name
  if (a.designer && !b.designer) {
    forA.push(`Designer pedigree — ${a.name} is by ${a.designer}.`)
  } else if (b.designer && !a.designer) {
    forB.push(`Designer pedigree — ${b.name} is by ${b.designer}.`)
  }

  // Walking permitted (cart not required)
  if (a.cart_required === false && b.cart_required === true) {
    forA.push(`Walking option — ${a.name} doesn’t require a cart.`)
  }
  if (b.cart_required === false && a.cart_required === true) {
    forB.push(`Walking option — ${b.name} doesn’t require a cart.`)
  }

  // Holes / par if different
  if (a.holes !== b.holes) {
    const more = a.holes > b.holes ? a : b
    const list = a.holes > b.holes ? forA : forB
    list.push(`More golf — ${more.name} has ${more.holes} holes.`)
  }

  // On-site rental
  if (a.club_rental_available === true && b.club_rental_available !== true) {
    forA.push(`Rentals on site — ${a.name} offers club rental at the course.`)
  } else if (b.club_rental_available === true && a.club_rental_available !== true) {
    forB.push(`Rentals on site — ${b.name} offers club rental at the course.`)
  }

  return { forA, forB }
}

export default async function CompareCoursesPage({ params }: Props) {
  const { locale, region, pair } = await params
  setRequestLocale(locale)

  if (!REGION_META[region as Region]) notFound()
  const pairs = await getComparisonPairs()
  const parsed = parsePairSlug(region as Region, pair, pairs)
  if (!parsed) notFound()

  const [a, b] = await Promise.all([
    getCourseBySlug(region, parsed.slugA),
    getCourseBySlug(region, parsed.slugB),
  ])
  if (!a || !b) notFound()

  const regionLabel = REGION_META[region as Region].label
  const canonicalUrl = `${SITE_URL}/golf-courses/compare/${region}/${pair}/`
  const recs = whenToChoose(a, b)

  // Sibling comparison pages in the same region (excluding this one)
  const regionPairs = pairs.filter(
    (p) => p.region === region && pairSlug(p.slugA, p.slugB) !== pair
  )
  const siblingTop = await getTopCoursesByRegion(region as Region, 3)
  const siblingNames: Record<string, string> = Object.fromEntries(
    siblingTop.map((c) => [c.slug, c.name])
  )

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Golf Courses', url: `${SITE_URL}/golf-courses/` },
    { name: regionLabel, url: `${SITE_URL}/golf-courses/${region}/` },
    { name: `${a.name} vs ${b.name}`, url: canonicalUrl },
  ])
  const comparisonJsonLd = getCourseComparisonJsonLd(
    a,
    b,
    canonicalUrl,
    `${a.name} vs ${b.name}`
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonJsonLd) }} />

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
            <Link href={`/golf-courses/${region}`} className="capitalize transition-colors hover:text-white/80">{regionLabel}</Link>
            <span>/</span>
            <span className="text-white/70">Compare</span>
          </nav>
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
            <Flag className="h-3 w-3" /> {regionLabel} Golf Course Comparison
          </div>
          <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {a.name} <span className="text-white/60">vs</span> {b.name}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/75">
            Side-by-side comparison of {a.name} and {b.name} — green fees, par, designer, drive time, and a
            data-driven view of which course suits which kind of round.
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
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">Specifications</h2>
          <SpecTable a={a} b={b} />
        </section>

        {/* When to choose */}
        {(recs.forA.length > 0 || recs.forB.length > 0) && (
          <section className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5">
              <h3 className="mb-3 text-sm font-bold text-primary">When to choose {a.name}</h3>
              {recs.forA.length > 0 ? (
                <ul className="space-y-2 text-sm leading-relaxed text-foreground/85">
                  {recs.forA.map((r) => <li key={r}>• {r}</li>)}
                </ul>
              ) : (
                <p className="text-sm italic text-muted-foreground">No standout numerical advantage over {b.name} on the spec sheet — choose on style, location, or availability.</p>
              )}
            </div>
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
              <h3 className="mb-3 text-sm font-bold text-foreground">When to choose {b.name}</h3>
              {recs.forB.length > 0 ? (
                <ul className="space-y-2 text-sm leading-relaxed text-foreground/85">
                  {recs.forB.map((r) => <li key={r}>• {r}</li>)}
                </ul>
              ) : (
                <p className="text-sm italic text-muted-foreground">No standout numerical advantage over {a.name} on the spec sheet — choose on style, location, or availability.</p>
              )}
            </div>
          </section>
        )}

        {/* Course overviews — straight from each course's prose.overview */}
        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <h3 className="mb-2 text-sm font-bold text-primary">{a.name}</h3>
            <p className="text-sm leading-relaxed text-foreground/80">{a.prose.overview}</p>
            <Link href={`/golf-courses/${a.region}/${a.slug}`} className="mt-3 inline-block text-xs font-semibold text-primary hover:underline">
              Full {a.name} guide →
            </Link>
          </div>
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <h3 className="mb-2 text-sm font-bold text-primary">{b.name}</h3>
            <p className="text-sm leading-relaxed text-foreground/80">{b.prose.overview}</p>
            <Link href={`/golf-courses/${b.region}/${b.slug}`} className="mt-3 inline-block text-xs font-semibold text-primary hover:underline">
              Full {b.name} guide →
            </Link>
          </div>
        </section>

        <RentalCtaBanner />

        {regionPairs.length > 0 && (
          <CrossLinkBlock
            heading={`More ${regionLabel} comparisons`}
            items={regionPairs.map((p) => comparisonCrossLink(p, siblingNames))}
          />
        )}
      </div>
    </>
  )
}
