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
 * `pricesByDayOfWeek` would have silently changed labels on eight surfaces where
 * they are right — SpecTable, /near/, /compare/, /under/<tier>/,
 * golf-courses-use-cases, the region map, AND (missing from the first count,
 * which is the same one-site-short shape this predicate exists to prevent)
 * `CoursePage`'s own fee-card rows and `enOfferNames` in jsonld-courses.
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
 * - `lowerHeading` / `upperHeading` — "<basis> green fee" noun phrases. NOTHING
 *   should read these directly any more: they are the NON-PACKAGE branch of
 *   `feeHeadings`, which is what the hero chip and the schema.org `Offer.name`
 *   slot now call. Reading `lowerHeading` at a call site is how a package course
 *   gets told its all-in rate is a green fee — `validate:fee-labels`' noun rule
 *   exists to catch exactly that, and will flag it.
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
 * Localized NOUN PHRASE pair for a course's two rates, e.g.
 * `{ lower: '平日グリーンフィー', upper: '週末グリーンフィー' }` — or, for a
 * package course, `{ lower: '平日パッケージ', upper: '週末パッケージ' }`.
 *
 * Two separate reasons this is centralized, and both were learned the hard way:
 *
 * 1. LOCALE. The schema.org `Offer.name` on a course-detail page and the
 *    `Offer.description` on a price-tier roundup were built from `feeLabelsEn`,
 *    which this module reserves for the EN-pinned routes — so every localized
 *    page shipped an English label inside `lang="ja"` structured data.
 * 2. NOUN. `feeLabelKeys` splits the BASIS (weekday/weekend vs low/high season);
 *    the `*Heading` keys additionally assert the noun "green fee". Those are two
 *    claims, and a package course splits them: kaeng-krachan really does charge
 *    less on weekdays, so its basis labels are right, but both rates are all-in
 *    packages covering caddie and cart, so "Weekday green fee" tells a reader the
 *    caddie is extra. Suppressing generated copy (`statesABareGreenFee`) fixed
 *    that for the FAQ and the meta line and left this — the hero price card, the
 *    fee panel and `makesOffer[].name` — still saying it, on 10 indexed pages.
 *    That is the exact "fix the cheap string, leave the prominent one" shape
 *    CLAUDE.md records as having taken four rounds for `fee_is_seasonal`.
 *
 * The package form composes `packageHeading` around the BARE basis word rather
 * than adding four more catalog keys, so it works for a seasonal package too
 * without anyone having to remember to write `highSeasonPackage`.
 *
 * `t` is a `GolfCourseDetail` translator (next-intl's `getTranslations`), passed
 * in rather than resolved here so `lib/jsonld-courses.ts` stays sync and
 * next-intl-free. For a non-package course EN composes byte-identically to the
 * pre-existing `` `${feeLabelsEn(c).lower} green fee` `` — `weekdayGreenFee` is
 * already "Weekday green fee" — so this is a no-op for all 147 of them.
 */
export function feeHeadings(
  c: FeeCopySource,
  t: FeeLabelT
): { lower: string; upper: string } {
  const keys = feeLabelKeys(c)
  if (!c.fee_is_package) return { lower: t(keys.lowerHeading), upper: t(keys.upperHeading) }
  return {
    lower: t('packageHeading', { basis: t(keys.lower) }),
    upper: t('packageHeading', { basis: t(keys.upper) }),
  }
}

/**
 * Which noun heads a course's fee card — "Green Fees" or the basis-neutral
 * "Rates". A package course's card lists a number that already includes the
 * caddie and the cart, so the green-fee noun is wrong above it, and its own
 * caddie/cart rows are suppressed by the `> 0` guard that renders them, leaving
 * nothing on the card to signal the inclusion.
 *
 * Both catalogs that render a fee card carry both keys (`GolfCourseDetail` for
 * the course page, `GolfCourseRegion` for the map explorer's info panel), so the
 * key is returned rather than the string.
 */
export function feePanelHeadingKey(c: FeeCopySource): 'greenFees' | 'rates' {
  return c.fee_is_package ? 'rates' : 'greenFees'
}

/**
 * The same decision for a SHARED column header over a roster of courses.
 *
 * CLAUDE.md's rule for the basis applies verbatim to the noun: a header can only
 * name one when every course beneath it agrees, otherwise it goes neutral. The
 * hua-hin roster lists 2 package courses among 11, so its column header cannot
 * say "Green fee" — the two package rows would be mislabelled by the chrome
 * above them, which is exactly how `/under/<tier>/` shipped a weekday basis over
 * a seasonal course.
 */
export function feeRosterHeadingKey(
  courses: readonly FeeCopySource[]
): 'rosterGreenFee' | 'rosterRate' {
  return courses.some((c) => c.fee_is_package) ? 'rosterRate' : 'rosterGreenFee'
}

/**
 * The heading and bare-basis keys, derived from `feeLabelKeys` so adding a basis
 * can't leave this behind, plus the package template. One signature with
 * optional values rather than overloads: a `getTranslations('GolfCourseDetail')`
 * result stays assignable under `strictFunctionTypes` because parameters are
 * contravariant — a function accepting MORE keys satisfies one that will only
 * ever pass these.
 */
type FeeHeadingKey = ReturnType<typeof feeLabelKeys>['lowerHeading' | 'upperHeading']
type FeeBasisKey = ReturnType<typeof feeLabelKeys>['lower' | 'upper']
type FeeLabelT = (
  key: FeeHeadingKey | FeeBasisKey | 'packageHeading',
  values?: { basis: string }
) => string

/**
 * The EN noun for a fee column shared across SEVERAL courses — "Green fee" when
 * every course beneath it charges one, "Rate" when any of them prices an all-in
 * package. The EN-pinned sibling of `feeRosterHeadingKey`, for `/compare/` and
 * `/near/`, which never read a catalog.
 *
 * Both of those hardcoded the noun. Neither is reachable by a package course
 * today — `/compare/` draws from each region's top 3 and `/near/` from a
 * station's top 8, and the two package courses rank 6th and 11th of 11 in
 * hua-hin — but that is a fact about current popularity scores, not a property
 * of the code, and `/compare/` membership is derived and documented as fragile.
 */
export function feeNounEn(courses: readonly FeeCopySource[]): 'Green fee' | 'Rate' {
  return courses.some((c) => c.fee_is_package) ? 'Rate' : 'Green fee'
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
