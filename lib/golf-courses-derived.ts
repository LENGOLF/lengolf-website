import 'server-only'
import type { GolfCourse } from '@/types/golf-courses'
import { getCoursesByRegion, REGION_META, type Region } from '@/lib/golf-courses'
import { BTS_STATIONS, type BtsStation } from '@/data/bts-stations'
import { AIRPORTS } from '@/data/airports'
import { PRICE_TIERS } from '@/data/price-tiers'
import { USE_CASE_RULES, USE_CASES, type UseCase } from '@/data/golf-courses-use-cases'
import { haversineKm } from '@/lib/geo'

/**
 * Composite popularity score used to rank courses across all derivations.
 * Deterministic — depends only on existing GolfCourse fields.
 *
 * Scaling rationale: green fee is the dominant signal (premium courses get
 * more search demand), boosted by editorial-completeness and external
 * authority signals. We deliberately do NOT use prose.overview length
 * since every course has 200-400 words of overview by data-team contract.
 *
 * Weekend fee falls back to weekday fee — a course missing weekend pricing
 * shouldn't silently rank below a low-quality course that happens to have
 * a weekend price filled in.
 */
export function popularityScore(c: GolfCourse): number {
  let score = 0
  score += c.green_fee_weekend_thb ?? c.green_fee_weekday_thb ?? 0
  if (c.prose.layout_and_experience.length > 200) score += 1000
  if (c.website) score += 500
  if (c.driving_range) score += 300
  return score
}

/**
 * Deterministic comparator: sort by score desc, then by slug asc as the
 * stable tie-break so identical scores produce a stable ordering across
 * builds regardless of source-file iteration order.
 */
function byPopularity(a: GolfCourse, b: GolfCourse): number {
  return popularityScore(b) - popularityScore(a) || a.slug.localeCompare(b.slug)
}

async function getAllPublishedCourses(): Promise<GolfCourse[]> {
  const regions = Object.keys(REGION_META) as Region[]
  const arrays = await Promise.all(regions.map((r) => getCoursesByRegion(r)))
  return arrays.flat().filter((c) => c.status === 'published')
}

/** Top N courses in a region by composite popularity score. */
export async function getTopCoursesByRegion(
  region: Region,
  n: number
): Promise<GolfCourse[]> {
  const courses = await getCoursesByRegion(region)
  return courses
    .filter((c) => c.status === 'published')
    .sort(byPopularity)
    .slice(0, n)
}

/**
 * Sibling courses for the detail page's "More in region" block: nearest by
 * straight-line distance when the course has coordinates, topped up (or fully
 * replaced) by popularity when coordinates are missing.
 *
 * Replaces the old `.slice(0, 3)` on raw index order, which sent every
 * course page's sibling links to the same three alphabetically-first courses
 * per region — 54 of Bangkok's 58 courses had zero sibling inbound links.
 * Nearest-neighbour selection spreads inbound links across the whole
 * roster (every course is *someone's* nearest neighbour) and is genuinely
 * more useful to a reader planning rounds in one area.
 */
export function getRelatedCourses(
  course: GolfCourse,
  allRegionCourses: GolfCourse[],
  n = 3
): GolfCourse[] {
  // Caller passes the region roster it already loaded — avoids a second
  // getCoursesByRegion fan-out of up to 58 dynamic imports per page build.
  const siblings = allRegionCourses.filter(
    (c) => c.slug !== course.slug && c.status === 'published'
  )
  const picked: GolfCourse[] = []

  if (course.latitude !== null && course.longitude !== null) {
    picked.push(
      ...siblings
        .filter((c) => c.latitude !== null && c.longitude !== null)
        .map((c) => ({
          c,
          km: haversineKm(
            { lat: course.latitude!, lng: course.longitude! },
            { lat: c.latitude!, lng: c.longitude! }
          ),
        }))
        .sort((a, b) => a.km - b.km || a.c.slug.localeCompare(b.c.slug))
        .slice(0, n)
        .map((x) => x.c)
    )
  }

  if (picked.length < n) {
    picked.push(
      ...siblings
        .filter((c) => !picked.includes(c))
        .sort(byPopularity)
        .slice(0, n - picked.length)
    )
  }

  return picked
}

/**
 * Comparison pair list. For each region with ≥2 courses, takes the top 3
 * by popularity and emits all C(3,2) pairs canonicalised as slugA < slugB.
 * Used by both `generateStaticParams` and the sitemap loop.
 */
export interface ComparisonPair {
  region: Region
  slugA: string
  slugB: string
}

// Pure function of static data, but called from generateStaticParams,
// generateMetadata, page bodies (course detail + region hub + compare), and
// the sitemap — memoize at module level so the 14-region top-3 sort runs
// once per server process instead of ~230+ times per build.
let comparisonPairsCache: Promise<ComparisonPair[]> | null = null

export function getComparisonPairs(): Promise<ComparisonPair[]> {
  return (comparisonPairsCache ??= computeComparisonPairs())
}

/** "A vs B" cross-link for a comparison pair — single source for the label
 *  format and URL shape used by the course detail, region hub, and compare
 *  routes. */
export function comparisonCrossLink(
  pair: ComparisonPair,
  nameBySlug: Record<string, string>
): { label: string; href: string } {
  return {
    label: `${nameBySlug[pair.slugA] ?? pair.slugA} vs ${nameBySlug[pair.slugB] ?? pair.slugB}`,
    href: `/golf-courses/compare/${pair.region}/${pairSlug(pair.slugA, pair.slugB)}`,
  }
}

async function computeComparisonPairs(): Promise<ComparisonPair[]> {
  const regions = Object.keys(REGION_META) as Region[]
  const tops = await Promise.all(regions.map((r) => getTopCoursesByRegion(r, 3)))
  const out: { region: Region; slugA: string; slugB: string }[] = []
  for (let r = 0; r < regions.length; r++) {
    const region = regions[r]
    const top = tops[r]
    for (const c of top) {
      // Build-time guard: comparison URLs are formed by `${slugA}-vs-${slugB}`,
      // so a slug containing the literal token "-vs-" would create ambiguous
      // URLs (two different inputs producing the same canonical string). Fail
      // the build immediately rather than ship colliding routes.
      if (c.slug.includes('-vs-')) {
        throw new Error(
          `[golf-courses-derived] Course slug "${c.slug}" contains reserved token "-vs-" — comparison URLs would collide`
        )
      }
    }
    // Slug ordering is the canonical alphabetisation that pairSlug relies on.
    // ASCII-only slugs make this lexicographic and meaningful; non-ASCII would
    // still be deterministic, just not human-readable order.
    for (let i = 0; i < top.length; i++) {
      for (let j = i + 1; j < top.length; j++) {
        const [slugA, slugB] =
          top[i].slug < top[j].slug ? [top[i].slug, top[j].slug] : [top[j].slug, top[i].slug]
        out.push({ region, slugA, slugB })
      }
    }
  }
  return out
}

/** Derives the pair URL slug `[a]-vs-[b]` (canonical alphabetical). */
export function pairSlug(slugA: string, slugB: string): string {
  const [a, b] = slugA < slugB ? [slugA, slugB] : [slugB, slugA]
  return `${a}-vs-${b}`
}

/** Inverts `pairSlug` against a list of known pairs in a region. Returns null if unknown. */
export function parsePairSlug(
  region: Region,
  pair: string,
  pairs: { region: Region; slugA: string; slugB: string }[]
): { slugA: string; slugB: string } | null {
  const found = pairs.find((p) => p.region === region && pairSlug(p.slugA, p.slugB) === pair)
  return found ? { slugA: found.slugA, slugB: found.slugB } : null
}

export interface CourseWithDistance {
  course: GolfCourse
  km: number
}

/**
 * Top N courses ranked by haversine (straight-line) distance from an arbitrary
 * lat/lng anchor. Courses missing latitude/longitude are excluded (no `?? 0`
 * fallback — we never want to mis-rank by treating null coords as the equator).
 *
 * This is the shared primitive behind both the BTS-station proximity pages and
 * the airport proximity pages.
 */
export async function getCoursesNearPoint(
  lat: number,
  lng: number,
  n: number
): Promise<CourseWithDistance[]> {
  const all = await getAllPublishedCourses()
  return all
    .filter((c) => c.latitude !== null && c.longitude !== null)
    .map((c) => ({
      course: c,
      km: haversineKm({ lat, lng }, { lat: c.latitude!, lng: c.longitude! }),
    }))
    .sort((a, b) => a.km - b.km)
    .slice(0, n)
}

/**
 * Top N courses ranked by haversine distance from a BTS station.
 * Delegates to getCoursesNearPoint — behaviour unchanged.
 */
export async function getCoursesNearStation(
  stationSlug: string,
  n: number
): Promise<CourseWithDistance[]> {
  const station: BtsStation | undefined = BTS_STATIONS[stationSlug]
  if (!station) return []
  return getCoursesNearPoint(station.lat, station.lng, n)
}

/**
 * Top N courses ranked by haversine distance from an airport terminal.
 * Returns [] for an unknown airport slug (mirrors getCoursesNearStation).
 */
export async function getCoursesNearAirport(
  airportSlug: string,
  n: number
): Promise<CourseWithDistance[]> {
  const airport = AIRPORTS[airportSlug]
  if (!airport) return []
  return getCoursesNearPoint(airport.lat, airport.lng, n)
}

/**
 * Top N courses with weekday green fee ≤ tier, ranked by composite score.
 * Courses without a weekday fee are excluded.
 */
export async function getCoursesUnderPrice(
  thb: number,
  n: number
): Promise<GolfCourse[]> {
  const all = await getAllPublishedCourses()
  return all
    .filter(
      (c) =>
        c.green_fee_weekday_thb !== null && c.green_fee_weekday_thb <= thb
    )
    .sort(byPopularity)
    .slice(0, n)
}

/**
 * Top N courses matching a use-case predicate, ranked by composite score.
 */
export async function getCoursesForUseCase(
  useCase: UseCase,
  n: number
): Promise<GolfCourse[]> {
  const meta = USE_CASE_RULES[useCase]
  if (!meta) return []
  const all = await getAllPublishedCourses()
  return all
    .filter(meta.predicate)
    .sort(byPopularity)
    .slice(0, n)
}

// Rarest-first use-case ordering, computed from the actual member counts so
// it can never drift from the data (a hardcoded ranking would silently revert
// to link-starving the thinnest pages as course data evolves, and wouldn't
// know about a newly added use case). Memoized: pure function of static data.
let useCaseRarityCache: Promise<UseCase[]> | null = null

export function getUseCasesByRarity(): Promise<UseCase[]> {
  return (useCaseRarityCache ??= (async () => {
    const all = await getAllPublishedCourses()
    const count = (u: UseCase) => all.filter(USE_CASE_RULES[u].predicate).length
    return [...USE_CASES].sort((a, b) => count(a) - count(b) || a.localeCompare(b))
  })())
}

/** Static-params slug list for `/golf-courses/under-[price]-baht/`. */
export function getPriceTierSlugs(): string[] {
  return PRICE_TIERS.map((t) => t.slug)
}

/** All BTS station slugs that have a proximity page generated. */
export function getStationSlugs(): string[] {
  return Object.keys(BTS_STATIONS)
}

/** All airport slugs that have a proximity page generated. */
export function getAirportSlugs(): string[] {
  return Object.keys(AIRPORTS)
}
