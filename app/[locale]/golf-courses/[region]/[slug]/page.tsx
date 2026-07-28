import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getAllCourseParams, getCoursesByRegion, REGION_META } from '@/lib/golf-courses'
import type { Region } from '@/lib/golf-courses'
import { SITE_URL } from '@/lib/constants'
import { getBreadcrumbJsonLd, getFaqPageJsonLd } from '@/lib/jsonld'
import { getCourseDetailJsonLd } from '@/lib/jsonld-courses'
import { getCourseTitle, getCourseDescription, getCourseFaqs } from '@/lib/course-seo'
import CoursePage from '@/components/golf-courses/CoursePage'
import { getComparisonPairs, getRelatedCourses, pairSlug } from '@/lib/golf-courses-derived'
import { BTS_STATIONS } from '@/data/bts-stations'
import { USE_CASE_RULES, type UseCase } from '@/data/golf-courses-use-cases'
import { PRICE_TIERS } from '@/data/price-tiers'
import { haversineKm } from '@/lib/geo'
import type { CrossLink } from '@/components/golf-courses/CrossLinkBlock'

interface Props {
  params: Promise<{ locale: string; region: string; slug: string }>
}

// Match the sibling programmatic routes (near/compare/under/best-for):
// unknown slugs 404 at the routing layer instead of rendering on demand,
// and pages revalidate daily.
export const revalidate = 86400
export const dynamicParams = false

export async function generateStaticParams() {
  // EN-only: omitting `locale` would cross-product with every locale from the
  // root layout, statically rendering th/ja/ko/zh copies that the middleware
  // 301s to English anyway (course detail pages have no translations).
  return (await getAllCourseParams()).map((p) => ({ locale: 'en', ...p }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region, slug } = await params
  const course = await getCourseBySlug(region, slug)

  if (!course) return { title: 'Course Not Found' }

  // Titles/descriptions are generated from structured fields (lib/course-seo)
  // instead of the per-file locales.en strings: 134/149 of those shared one
  // boilerplate suffix long enough to guarantee SERP truncation, and 77/149
  // descriptions were verbatim identical modulo the course name.
  const title = getCourseTitle(course)
  const description = getCourseDescription(course)
  const canonicalUrl = `${SITE_URL}/golf-courses/${region}/${slug}/`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
    },
  }
}

// When a course matches several use-case pages, link the one whose page has
// the fewest members — rarity order, thinnest first. The old
// `USE_CASES.find(...)` array order made `beginners` (88 matches) and
// `groups` (111) absorb nearly every link while `high-handicappers`
// (7 members) and `families` got none.
const USE_CASE_LINK_PRIORITY: UseCase[] = [
  'high-handicappers',
  'tournaments',
  'weekday-play',
  'families',
  'beginners',
  'groups',
]

export default async function CoursePageRoute({ params }: Props) {
  const { locale, region, slug } = await params
  setRequestLocale(locale)

  const course = await getCourseBySlug(region, slug)
  if (!course) notFound()

  const regionLabel = REGION_META[region as Region]?.label ?? (region.charAt(0).toUpperCase() + region.slice(1))

  // Nearest-neighbour siblings (falls back to popularity when coords missing)
  const relatedCourses = await getRelatedCourses(course, 3)
  const canonicalUrl = `${SITE_URL}/golf-courses/${region}/${slug}/`

  // ── Cross-links into the workstream-A programmatic-SEO pages ─────────────
  // 1) Comparisons featuring this course (max 2)
  const allRegionCourses = await getCoursesByRegion(region)
  const comparisonPairs = await getComparisonPairs()
  const courseComparisons = comparisonPairs
    .filter((p) => p.region === region && (p.slugA === slug || p.slugB === slug))
    .slice(0, 2)
  const courseNamesById: Record<string, string> = Object.fromEntries(
    allRegionCourses.map((c) => [c.slug, c.name])
  )

  // 2) Nearest BTS station — Bangkok-region courses only. BTS_STATIONS holds
  // Bangkok stations exclusively, so for any other region the "nearest" match
  // produced absurd copy ("688.5 km from Silom — same district as …") linking
  // to a page that doesn't even list the course.
  let nearestStationLink: CrossLink | null = null
  if (region === 'bangkok' && course.latitude !== null && course.longitude !== null) {
    const stations = Object.values(BTS_STATIONS)
    const nearest = stations.reduce(
      (best, s) => {
        const km = haversineKm(
          { lat: course.latitude!, lng: course.longitude! },
          { lat: s.lat, lng: s.lng }
        )
        return km < best.km ? { km, station: s } : best
      },
      { km: Infinity, station: stations[0] }
    )
    nearestStationLink = {
      label: `Best courses near ${nearest.station.name} BTS`,
      href: `/golf-courses/near/${nearest.station.slug}`,
      description: `${nearest.km.toFixed(1)} km from ${nearest.station.name} — closest station to ${course.name}.`,
    }
  }

  // 3) Rarest use-case page this course belongs to
  const matchedUseCase = USE_CASE_LINK_PRIORITY.find((u) => USE_CASE_RULES[u].predicate(course))
  const useCaseLink: CrossLink | null = matchedUseCase
    ? {
        label: USE_CASE_RULES[matchedUseCase].title.replace('Best Bangkok-Area Golf Courses ', ''),
        href: `/golf-courses/best-for/${matchedUseCase}`,
      }
    : null

  // 4) The course's own price tier (smallest tier its weekday fee fits).
  // Tier pages are framed "Bangkok-Area", so only link from courses actually
  // within day-trip range of Bangkok.
  const tier =
    course.green_fee_weekday_thb !== null &&
    course.distance_from_bangkok_km !== null &&
    course.distance_from_bangkok_km <= 150
      ? PRICE_TIERS.find((t) => course.green_fee_weekday_thb! <= t.thb)
      : undefined
  const tierLink: CrossLink | null = tier
    ? {
        label: `Best courses under ฿${tier.thb.toLocaleString('en-US')}`,
        href: `/golf-courses/under/${tier.slug}`,
      }
    : null

  const crossLinks: CrossLink[] = [
    ...courseComparisons.map((p) => ({
      label: `${courseNamesById[p.slugA] ?? p.slugA} vs ${courseNamesById[p.slugB] ?? p.slugB}`,
      href: `/golf-courses/compare/${p.region}/${pairSlug(p.slugA, p.slugB)}`,
    })),
    ...(nearestStationLink ? [nearestStationLink] : []),
    ...(useCaseLink ? [useCaseLink] : []),
    ...(tierLink ? [tierLink] : []),
  ]

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Golf Courses', url: `${SITE_URL}/golf-courses/` },
    { name: regionLabel, url: `${SITE_URL}/golf-courses/${region}/` },
    { name: course.name, url: canonicalUrl },
  ])

  // GolfCourse schema derived from typed fields (replaces the hand-serialised
  // course.schema_markup string, which needed render-time patching for its
  // null description and apex-domain URL, and drifted on any field edit).
  const courseJsonLd = getCourseDetailJsonLd(course, canonicalUrl)

  // FAQPage schema mirrors the visible CourseFaq block — same source array.
  const faqs = getCourseFaqs(course)
  const faqJsonLd = faqs.length > 0 ? getFaqPageJsonLd(faqs) : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <CoursePage
        course={course}
        regionLabel={regionLabel}
        relatedCourses={relatedCourses}
        crossLinks={crossLinks}
      />
    </>
  )
}
