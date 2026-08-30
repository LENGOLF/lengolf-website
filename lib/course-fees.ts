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
 * already "Weekday green fee" — so this is a no-op for all 128 of them.
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
 * PAGE-LEVEL chrome keys for `/golf-courses/under/<tier>/`, by the same rule as
 * `feeRosterHeadingKey` one level up: a shared header may only name the noun when
 * EVERY course beneath it agrees.
 *
 * The tier roster is a derived top 12 spanning regions, so one package course in
 * it makes "green fee under X" false for that row — and the chrome sits directly
 * above the list. This went live with the chiang-mai batch, which flagged
 * `royal-chiang-mai-golf-club` (#8) and `gassan-khuntan-golf-resort` (#11) in
 * `/under/5000-baht/`; before it, no package course reached ANY tier roster, so
 * the hardcoded noun was latent-but-correct. Exactly the shape CLAUDE.md records
 * as round 4 of the fee_is_package saga — the cheap per-course string was fixed
 * and the prominent shared header was not.
 *
 * `validate:fee-labels` was structurally blind here — its SCAN_DIRS are
 * app/components/lib/data and these strings live in `messages/*.json`, so the
 * NOUN_LITERAL_RE half cannot see them. Closed by adding `eyebrowBadge`,
 * `topCoursesHeading` AND `metaDescription` to NOUN_KEY_RE, which matches the
 * CALL SITE instead: reverting ANY of the three t() calls back to its literal
 * key now fails the gate (each mutation-tested red, fixed form green). An
 * earlier version of this sentence said "guarded" while covering two of the
 * three — the closing review caught the meta call regressing with all CI
 * green, which is why the third key is listed by name rather than as "etc".
 *
 * `metaDescription` in NOUN_KEY_RE is a GENERIC key name, unlike the other
 * nine: a future fee-reading page with a legitimate t('metaDescription') call
 * will be flagged. That is the designed behaviour, not a false positive to
 * engineer away — the gate's own escape hatch (`// fee-noun-ok: <why>`) is
 * the documented answer, and today zero of the 11 scanned files hit it.
 *
 * STILL UNSWEPT, named so it does not read as covered: `GolfCourseHub`'s
 * budget heading AND its metaTitle name the noun on `/golf-courses/` directly
 * above the link to `/under/5000-baht/`, whose roster this very function
 * concedes is not green-fee-only. Defensible (the tier filters on
 * `green_fee_weekday_thb`) but not swept.
 */
export function tierChromeKeys(courses: readonly FeeCopySource[]): {
  eyebrow: 'eyebrowBadge' | 'eyebrowBadgeRate'
  heading: 'topCoursesHeading' | 'topCoursesHeadingRate'
  meta: 'metaDescription' | 'metaDescriptionRate'
} {
  return courses.some((c) => c.fee_is_package)
    ? { eyebrow: 'eyebrowBadgeRate', heading: 'topCoursesHeadingRate', meta: 'metaDescriptionRate' }
    : { eyebrow: 'eyebrowBadge', heading: 'topCoursesHeading', meta: 'metaDescription' }
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
 * Both of those hardcoded the noun. That was once justified by "no package course
 * reaches either set" - and the fragility warning attached to it has now cashed in
 * TWICE. The chiang-mai batch took the flag from FOUR courses to TEN and put
 * `royal-chiang-mai-golf-club` and `gassan-khuntan-golf-resort` at #1 and #2 in
 * chiang-mai, so all three of that region's `/compare/` pairs reach `feeNounEn`.
 *
 * The untranslated-package batch then took it to NINETEEN and falsified the second
 * half of the old note, which read "`/near/` is still unreached (8 stations + 2
 * airports, zero package courses)". `krungthep-kreetha-sports-club` is #8 from
 * Suvarnabhumi, so `/golf-courses/near/suvarnabhumi-airport/` now reaches this
 * function. Scope precisely, because the obvious reading is wrong: `feeNounEn` is
 * called ONLY from `AirportPage`. `StationPage` renders a `RoundupList` with no fee
 * noun, so the 8 BTS station pages are NOT affected - one airport page is.
 *
 * It returns 'Rate' for all of them, which is correct; the noun is handled. Treat
 * reachability as today's popularity scores rather than a property of the code.
 *
 * The BASIS is a separate, still-open problem: `gassan-khuntan`,
 * `royal-chiang-mai` and `summit-green-valley` price by SEASON in their prose
 * while typed as equal weekday/weekend pairs with no `fee_is_seasonal`, so
 * `pricesByDayOfWeek()` calls them day-of-week courses. It is live on TWO
 * surfaces, not one: the compare route's day-of-week bullets, AND the
 * `/under/<tier>/` roster row, which picks `roundupReason` over
 * `roundupReasonSeasonal` and renders "Weekday from 4,800 THB" in all five
 * locales under a header `tierChromeKeys` has just made noun-neutral.
 *
 * Setting the flag is NOT the fix and must not be done casually: with
 * weekday === weekend it would render "Low season 4,200", asserting a
 * low-season price all three sources explicitly decline to state ("confirm
 * low-season pricing — rates may be lower"). The two-slot model cannot express
 * "one known rate, high season only". Needs an owner ruling or a third
 * predicate, not a drive-by flag. Predates the chiang-mai batch.
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
