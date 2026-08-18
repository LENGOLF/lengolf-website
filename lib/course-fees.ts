import type { GolfCourse } from '@/types/golf-courses'

type FeeBasisSource = Pick<GolfCourse, 'fee_is_seasonal'>
type FeeCopySource = Pick<GolfCourse, 'fee_is_seasonal' | 'fee_is_package'>

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
 * May generated copy call this course's rate a "green fee"?
 *
 * Deliberately SEPARATE from `pricesByDayOfWeek`, and not an extension of it.
 * They answer different questions and a package course splits them:
 * `kaeng-krachan` charges 1,199 on weekdays and 1,399 at weekends, so its
 * weekday/weekend LABELS are correct and must keep rendering — but both numbers
 * are all-in packages including caddie and shared cart, so calling either a
 * "green fee" tells a reader the caddie and cart are extra. Overloading
 * `pricesByDayOfWeek` would have silently changed labels on six surfaces where
 * they are right.
 *
 * Used only by the two generated-copy gates in `lib/course-seo.ts` (the fee FAQ,
 * which also ships as FAQPage structured data, and the meta description's fee
 * line). Both SUPPRESS rather than relabel, which is the same thing they already
 * do for `fee_is_seasonal` — the course's own prose states the price and what it
 * covers, in every locale, so nothing is hidden from the reader.
 */
export function statesABareGreenFee(c: FeeCopySource): boolean {
  return pricesByDayOfWeek(c) && !c.fee_is_package
}

/**
 * next-intl keys for the two rates, for localized surfaces. Every field here is a
 * key that exists in all five catalogs; the caller picks the one matching its slot:
 *
 * - `lower` / `upper` — bare basis words for a two-row fee table or a map popup
 *   (`GolfCourseDetail` and `GolfCourseRegion`).
 * - `lowerHeading` / `upperHeading` — "<basis> green fee" noun phrases. `lowerHeading`
 *   is the hero chip's heading over the lower rate; `upperHeading` has no visible
 *   consumer today and exists for the schema.org `Offer.name` slot (see
 *   `feeOfferNames`), where `upperInline` would inject a price into a label.
 * - `upperInline` — the hero chip's inline "{price} THB" line for the upper rate.
 * - `upperShort` — the abbreviated tag the region-hub roster puts after the upper
 *   rate, where the non-seasonal form is `wknd` rather than `weekend`.
 *
 * Returning the whole set (rather than one pair) is deliberate: the catalogs use
 * four different key families for the same decision, and picking them inline is
 * what let three separate audits miss a site.
 */
export function feeLabelKeys(c: FeeBasisSource): {
  lower: 'weekday' | 'lowSeason'
  upper: 'weekend' | 'highSeason'
  lowerHeading: 'weekdayGreenFee' | 'lowSeasonGreenFee'
  upperHeading: 'weekendGreenFee' | 'highSeasonGreenFee'
  upperInline: 'weekendFee' | 'highSeasonFee'
  upperShort: 'wknd' | 'highSeason'
} {
  return c.fee_is_seasonal
    ? {
        lower: 'lowSeason',
        upper: 'highSeason',
        lowerHeading: 'lowSeasonGreenFee',
        upperHeading: 'highSeasonGreenFee',
        upperInline: 'highSeasonFee',
        upperShort: 'highSeason',
      }
    : {
        lower: 'weekday',
        upper: 'weekend',
        lowerHeading: 'weekdayGreenFee',
        upperHeading: 'weekendGreenFee',
        upperInline: 'weekendFee',
        upperShort: 'wknd',
      }
}

/**
 * Localized `Offer.name` pair for a course's two green-fee rates, e.g.
 * `{ lower: '平日グリーンフィー', upper: '週末グリーンフィー' }`.
 *
 * Exists because the schema.org `Offer.name` on a course-detail page and the
 * `Offer.description` on a price-tier roundup were built from `feeLabelsEn`,
 * which this module's own docblock reserves for the EN-pinned routes — so every
 * localized page shipped an English label inside `lang="ja"` structured data.
 *
 * `t` is a `GolfCourseDetail` translator (next-intl's `getTranslations`), passed
 * in rather than resolved here so `lib/jsonld-courses.ts` stays sync and
 * next-intl-free. EN composes byte-identically to the previous
 * `` `${feeLabelsEn(c).lower} green fee` `` — `weekdayGreenFee` is already
 * "Weekday green fee" — so this is a no-op for the EN-pinned surfaces.
 */
export function feeOfferNames(
  c: FeeBasisSource,
  t: (key: FeeHeadingKey) => string
): { lower: string; upper: string } {
  const keys = feeLabelKeys(c)
  return { lower: t(keys.lowerHeading), upper: t(keys.upperHeading) }
}

/**
 * The four heading keys, derived from `feeLabelKeys` so adding a basis can't
 * leave this behind. Narrower than a next-intl namespace translator's key
 * union, which is what makes a `getTranslations('GolfCourseDetail')` result
 * assignable here under `strictFunctionTypes` (parameters are contravariant:
 * a function accepting MORE keys satisfies one that will only ever pass four).
 */
type FeeHeadingKey = ReturnType<typeof feeLabelKeys>['lowerHeading' | 'upperHeading']

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
