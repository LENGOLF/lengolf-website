import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCourseBySlug, getAllCourseParams, getCoursesByRegion, REGION_META } from '@/lib/golf-courses'
import type { Region } from '@/lib/golf-courses'
import { SITE_URL } from '@/lib/constants'
import { getAlternates, getCanonical, getResolvedCanonical } from '@/lib/translated-routes'
import { getRegionHubTranslation, getTranslatedCourseDetailParams } from '@/data/golf-courses-i18n'
import { getBreadcrumbJsonLd, getFaqPageJsonLd } from '@/lib/jsonld'
import { getCourseDetailJsonLd } from '@/lib/jsonld-courses'
import { feeHeadings } from '@/lib/course-fees'
import { getCourseTitle, getCourseDescription, getCourseFaqs, toCourseSeoLocale } from '@/lib/course-seo'
import CoursePage from '@/components/golf-courses/CoursePage'
import {
  comparisonCrossLink,
  getComparisonPairs,
  getCoursesUnderPrice,
  getRelatedCourses,
  getUseCasesByRarity,
} from '@/lib/golf-courses-derived'
import { BTS_STATIONS } from '@/data/bts-stations'
import { USE_CASE_RULES } from '@/data/golf-courses-use-cases'
import { PRICE_TIERS } from '@/data/price-tiers'
import { haversineKm } from '@/lib/geo'
import { formatBaht } from '@/lib/format'
import type { CrossLink } from '@/components/golf-courses/CrossLinkBlock'
import { siteOpenGraph } from '@/lib/open-graph'

interface Props {
  params: Promise<{ locale: string; region: string; slug: string }>
}

// Match the sibling programmatic routes (near/compare/under/best-for):
// unknown slugs 404 at the routing layer instead of rendering on demand,
// and pages revalidate daily.
export const revalidate = 86400
export const dynamicParams = false

export async function generateStaticParams() {
  // EN builds every course; other locales build ONLY the (locale, region,
  // slug) triples registered in COURSE_DETAIL_I18N (th/ja/ko/zh; see that file
  // for the current set). Untranslated locale URLs 301 to English via the middleware — and
  // because dynamicParams=false, a lib/translated-routes.ts allowlist entry
  // with no matching triple here would be a hard 404, so the two lists MUST
  // move together (smoke-test course-detail registry consistency + liveness
  // checks enforce it).
  return [
    ...(await getAllCourseParams()).map((p) => ({ locale: 'en', ...p })),
    ...getTranslatedCourseDetailParams(),
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, region, slug } = await params
  const course = await getCourseBySlug(region, slug)

  if (!course) return { title: 'Course Not Found' }

  const seoLocale = toCourseSeoLocale(locale)

  // Titles/descriptions are generated from structured fields (lib/course-seo)
  // instead of the per-file locales.en strings: 144/148 of those shared one
  // boilerplate suffix long enough to guarantee SERP truncation, and 59/148
  // descriptions were verbatim identical modulo the course name. For non-EN
  // locales the generators prefer the hand-written course.locales.<locale>
  // strings and fall back to the EN behavior while translation is in flight.
  const title = getCourseTitle(course, seoLocale)
  const description = getCourseDescription(course, seoLocale)
  const path = `/golf-courses/${region}/${slug}/`
  const canonicalUrl = getCanonical(locale, path)

  // Only emit hreflang when a translation actually exists — a lone
  // self-referential hreflang="en" cluster is audit noise (matches the
  // sitemap). The 146 untranslated courses keep a bare EN canonical.
  const languages = getAlternates(path)

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      ...(Object.keys(languages).length > 1 ? { languages } : {}),
    },
    openGraph: siteOpenGraph({
      title,
      description,
      url: canonicalUrl,
      type: 'website',
    }),
  }
}

export default async function CoursePageRoute({ params }: Props) {
  const { locale, region, slug } = await params
  setRequestLocale(locale)

  const course = await getCourseBySlug(region, slug)
  if (!course) notFound()

  const t = await getTranslations('GolfCourseDetail')

  const regionLabel =
    getRegionHubTranslation(region, locale)?.label ??
    REGION_META[region as Region]?.label ??
    (region.charAt(0).toUpperCase() + region.slice(1))

  const allRegionCourses = await getCoursesByRegion(region)
  // Nearest-neighbour siblings (falls back to popularity when coords missing)
  const relatedCourses = getRelatedCourses(course, allRegionCourses, 3)
  const path = `/golf-courses/${region}/${slug}/`
  const canonicalUrl = getCanonical(locale, path)
  // Locale-independent EN URL — the schema image is pinned to it below.
  const enUrl = `${SITE_URL}${path}`

  // ── Cross-links into the workstream-A programmatic-SEO pages ─────────────
  // The near/*, best-for/* and compare/* families are EN-only BY DESIGN: those
  // routes build no locale copies (their locale URLs 301 to English), and
  // their labels/descriptions below are hardcoded English — a translated
  // course page linking them would 301 and mix languages. Only the price-tier
  // link survives on non-EN locales: the under/* pages ARE registered for th,
  // and its label is localized (tierLinkLabel).
  // 1) Comparisons featuring this course (max 2) — EN only.
  const courseComparisons =
    locale === 'en'
      ? (await getComparisonPairs())
          .filter((p) => p.region === region && (p.slugA === slug || p.slugB === slug))
          .slice(0, 2)
      : []
  const courseNamesById: Record<string, string> = Object.fromEntries(
    allRegionCourses.map((c) => [c.slug, c.name])
  )

  // 2) Nearest BTS station — Bangkok-region courses only (EN only, see above).
  // BTS_STATIONS holds Bangkok stations exclusively, so for any other region
  // the "nearest" match produced absurd copy ("688.5 km from Silom — same
  // district as …") linking to a page that doesn't even list the course.
  let nearestStationLink: CrossLink | null = null
  if (locale === 'en' && region === 'bangkok' && course.latitude !== null && course.longitude !== null) {
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

  // 3) Rarest use-case page this course belongs to (EN only, see above) —
  // ordering computed from actual member counts (self-updating; a hardcoded
  // list would silently re-starve the thinnest pages as course data evolves)
  let useCaseLink: CrossLink | null = null
  if (locale === 'en') {
    const useCasesByRarity = await getUseCasesByRarity()
    const matchedUseCase = useCasesByRarity.find((u) => USE_CASE_RULES[u].predicate(course))
    useCaseLink = matchedUseCase
      ? {
          label: USE_CASE_RULES[matchedUseCase].title.replace('Best Bangkok-Area Golf Courses ', ''),
          href: `/golf-courses/best-for/${matchedUseCase}`,
        }
      : null
  }

  // 4) The course's own price tier — linked only when the course actually
  // appears on that tier page (top 12 by popularity), so the cross-link
  // never sends users to a list that doesn't mention the course. Kept on ALL
  // locales (the under/* pages are TH-registered) with a localized label.
  let tierLink: CrossLink | null = null
  if (course.green_fee_weekday_thb !== null) {
    const tier = PRICE_TIERS.find((pt) => course.green_fee_weekday_thb! <= pt.thb)
    if (tier) {
      const listed = await getCoursesUnderPrice(tier.thb, 12)
      if (listed.some((c) => c.slug === course.slug)) {
        tierLink = {
          label: t('tierLinkLabel', { price: formatBaht(tier.thb) }),
          href: `/golf-courses/under/${tier.slug}`,
        }
      }
    }
  }

  const crossLinks: CrossLink[] = [
    ...courseComparisons.map((p) => comparisonCrossLink(p, courseNamesById)),
    ...(nearestStationLink ? [nearestStationLink] : []),
    ...(useCaseLink ? [useCaseLink] : []),
    ...(tierLink ? [tierLink] : []),
  ]

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    // The /golf-courses/ hub is translated for some locales: point the crumb
    // at the locale's own hub where a translation exists, and at the
    // canonical EN hub otherwise (untranslated hub URLs 301 to English —
    // don't emit redirecting URLs in JSON-LD). Crumb display names are
    // localized either way. Mirrors the [region] hub page. '/' is registered
    // for every locale, so the home crumb can always take the locale's own URL.
    { name: 'Home', url: getCanonical(locale, '/') },
    {
      name: t('breadcrumbGolfCourses'),
      url: getResolvedCanonical(locale, '/golf-courses/'),
    },
    { name: regionLabel, url: getCanonical(locale, `/golf-courses/${region}/`) },
    { name: course.name, url: canonicalUrl },
  ])

  // GolfCourse schema derived from typed fields (replaces the hand-serialised
  // course.schema_markup string, which needed render-time patching for its
  // null description and apex-domain URL, and drifted on any field edit).
  // `opengraph-image` is the file-convention branded card generated for this
  // route — an image we own, so it can legitimately fill the schema slot.
  // The image URL is pinned to the EN path deliberately: the OG image route's
  // generateStaticParams builds EN copies only, so a locale-prefixed image
  // URL would 301 through the middleware — don't put redirecting URLs in
  // schema.org markup.
  // The `description` follows the page language for the same reason the FAQ
  // schema below does: this route SSGs th/ja/ko/zh, and the schema should not
  // describe a Japanese page in English.
  // `offerNames` extends that to the green-fee Offer labels, which were still
  // built from feeLabelsEn — a helper its own docblock reserves for the
  // EN-pinned routes — so the description and the Offer beside it disagreed.
  const seoLocale = toCourseSeoLocale(locale)
  const courseJsonLd = getCourseDetailJsonLd(
    course,
    canonicalUrl,
    `${enUrl}opengraph-image/`,
    seoLocale,
    (c) => feeHeadings(c, t)
  )

  // FAQPage schema mirrors the visible CourseFaq block — same source array,
  // localized once here for both.
  const faqs = getCourseFaqs(course, seoLocale)
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
        faqs={faqs}
      />
    </>
  )
}
