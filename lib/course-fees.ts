import type { GolfCourse } from '@/types/golf-courses'

type FeeBasisSource = Pick<GolfCourse, 'fee_is_seasonal'>

/**
 * `green_fee_weekday_thb` / `green_fee_weekend_thb` hold the LOWER and HIGHER of a
 * course's two published rates. What SPLITS them differs by course: most price by
 * day of week, but a course with `fee_is_seasonal` prices by SEASON (low/high) and
 * has no weekday/weekend distinction at all.
 *
 * Every surface that puts a LABEL on those numbers — or derives a day-of-week
 * claim from them — must route through this module. Labelling a seasonal course's
 * rates "weekday/weekend" asserts a split that does not exist, and most of these
 * surfaces are statically generated and indexed (course detail, compare, best-for,
 * price-tier roundups, region map).
 *
 * Numeric-only consumers do NOT need this — popularity scoring, price-tier
 * bucketing and sorting never show the reader a basis. `lib/golf-courses-derived.ts`
 * and the tier lookup in the course-detail route are deliberately untouched.
 *
 * When adding a seasonal course, grep `green_fee_weekday_thb` across the repo
 * (including `data/`, which is easy to scope out of a search and is where
 * `golf-courses-use-cases.ts` lives). TypeScript cannot find label sites for you:
 * these are plain string templates, so a missed one compiles and ships.
 */
export function pricesByDayOfWeek(c: FeeBasisSource): boolean {
  return !c.fee_is_seasonal
}

/**
 * next-intl key pair for the two rates, for localized surfaces. Keys exist in the
 * `GolfCourseDetail` and `GolfCourseRegion` namespaces of every locale catalog.
 */
export function feeLabelKeys(c: FeeBasisSource): {
  lower: 'weekday' | 'lowSeason'
  upper: 'weekend' | 'highSeason'
} {
  return c.fee_is_seasonal
    ? { lower: 'lowSeason', upper: 'highSeason' }
    : { lower: 'weekday', upper: 'weekend' }
}

/**
 * Plain-English label pair for the EN-only surfaces (`/compare/` spec table,
 * `/near/` station table, `/best-for/` use-case reasons). Those routes pin
 * `locale: 'en'` in `generateStaticParams`, so they never read a catalog.
 */
export function feeLabelsEn(c: FeeBasisSource): { lower: string; upper: string } {
  return c.fee_is_seasonal
    ? { lower: 'Low season', upper: 'High season' }
    : { lower: 'Weekday', upper: 'Weekend' }
}

/**
 * Lowercase basis word for annotating a value inline, e.g. `2,800 THB (low season)`.
 * Use when a shared column header cannot state the basis because the courses in
 * the table disagree about it.
 */
export function feeBasisNoteEn(c: FeeBasisSource, which: 'lower' | 'upper'): string {
  const labels = feeLabelsEn(c)
  return (which === 'lower' ? labels.lower : labels.upper).toLowerCase()
}
