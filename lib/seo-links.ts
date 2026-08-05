/**
 * Single source of truth for resolving a FAQ related_questions slug to a
 * root-relative path.
 *
 * Convention: a bare slug (`how-to-pack-golf-clubs-flight-thailand`) is a
 * sibling FAQ and resolves to /faq/{slug}; a full path (`/guide/{slug}`)
 * points at another section and is used as-is.
 *
 * Every consumer of related_questions MUST resolve through this helper —
 * when the logic lived inline it drifted: FaqPage.tsx was fixed to honor
 * full paths while lib/jsonld.ts kept prepending /faq/, emitting malformed
 * /faq//guide/... URLs in FAQPage structured data (the GSC-404 bug class).
 * Consumers: components/faq/FaqPage.tsx (hrefs), lib/jsonld.ts (schema URLs),
 * scripts/validate-internal-links.ts (CI guard).
 */
export function relatedQuestionPath(slug: string): string {
  return slug.startsWith('/') ? slug : `/faq/${slug}`
}

/**
 * Core static pages referenced from related_slugs — labels come from the
 * ExplainerPage.pathLabels i18n namespace (messages/*.json).
 */
/**
 * The 3-segment /golf-courses/ families that are NOT (region, slug) course
 * details: /near/{station}, /under/{tier}, /compare/{region} and
 * /best-for/{useCase}. Kept beside the resolver so a new derived family is
 * added in one place rather than being mistaken for a course slug.
 */
const DERIVED_PREFIXES = new Set(['near', 'under', 'compare', 'best-for'])

const STATIC_LABEL_PATHS = new Set([
  'golf',
  'lessons',
  'events',
  'golf-club-rental',
  'golf-course-club-rental',
  'golf-in-thailand-guide',
  'corporate-golf-packages',
])

/**
 * Resolve related_slugs paths to display labels, preferring the target page's
 * own localized title over a title-cased URL slug.
 *
 * Lives here (rather than inline in a route file) because BOTH the guide and
 * FAQ templates need it: while it was private to the guide route, localized FAQ
 * pages fell back to slug-derived ENGLISH labels ("Are Rental Golf Clubs Good
 * Enough" on a Japanese page) even though those targets have published ja/ko/zh
 * titles. Paths with no resolvable label are omitted, so the calling component
 * keeps its slug-derived fallback.
 */
export async function buildRelatedLabels(
  paths: string[] | null,
  locale: string
): Promise<Record<string, string>> {
  if (!paths || paths.length === 0) return {}
  const { getSeoPageBySlug, ROUTE_PREFIX_TO_TYPE } = await import('@/lib/seo-pages')
  const { getTranslations } = await import('next-intl/server')
  const t = await getTranslations('ExplainerPage')
  const entries = await Promise.all(
    paths.map(async (path): Promise<[string, string] | null> => {
      const segments = path.split('/').filter(Boolean)
      // SEO pages (/guide/x, /faq/x, ...): localized title, EN fallback
      if (segments.length === 2 && ROUTE_PREFIX_TO_TYPE[segments[0]]) {
        const type = ROUTE_PREFIX_TO_TYPE[segments[0]]
        const target =
          (await getSeoPageBySlug(segments[1], type, locale)) ??
          (await getSeoPageBySlug(segments[1], type, 'en'))
        return target ? [path, target.title] : null
      }
      // Core static pages: label from the pathLabels namespace
      if (segments.length === 1 && STATIC_LABEL_PATHS.has(segments[0])) {
        return [path, t(`pathLabels.${segments[0]}`)]
      }
      // Proximity finders (/golf-courses/near/{airport|bts-station}): the
      // slug-derived fallback renders a bare place name ("Suvarnabhumi
      // Airport"), which on the airport guides is indistinguishable from the
      // guide's own title and carries no golf/course tokens. Mirror the title
      // the target page generates for itself instead.
      if (
        segments.length === 3 &&
        segments[0] === 'golf-courses' &&
        segments[1] === 'near'
      ) {
        const { AIRPORTS } = await import('@/data/airports')
        const { BTS_STATIONS } = await import('@/data/bts-stations')
        const airport = AIRPORTS[segments[2]]
        if (airport) return [path, `Golf Courses Near ${airport.name} (${airport.iata})`]
        const station = BTS_STATIONS[segments[2]]
        if (station) return [path, `Golf Courses Near ${station.name}`]
        return null
      }
      // Course-detail pages (/golf-courses/{region}/{slug}). Same trap as the
      // near/ branch above: the slug-derived fallback renders "Alpine Golf
      // Club", which on /guide/alpine-golf-club-bangkok is indistinguishable
      // from the guide's own title. Use the course's localized title, which is
      // what the target page itself puts in <title>. DERIVED_PREFIXES guards
      // the sibling 3-segment families that are not (region, slug) pairs.
      if (segments.length === 3 && segments[0] === 'golf-courses') {
        if (DERIVED_PREFIXES.has(segments[1])) return null
        const { getCourseBySlug } = await import('@/lib/golf-courses')
        const { getCourseTitle } = await import('@/lib/course-seo')
        const course = await getCourseBySlug(segments[1], segments[2])
        if (!course) return null
        const seoLocale = locale === 'th' || locale === 'ja' ? locale : 'en'
        return [path, getCourseTitle(course, seoLocale)]
      }
      return null // unknown paths keep the component's slug-derived fallback
    })
  )
  return Object.fromEntries(entries.filter((e): e is [string, string] => e !== null))
}
