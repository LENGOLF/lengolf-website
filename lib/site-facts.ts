// Shared, typed "site facts" — the single source of truth for the LENGOLF
// facts that appear across translated guide content.
//
// WHY THIS EXISTS
// LENGOLF price claims (lesson price, bay rates, premium course-rental,
// club delivery) were hardcoded per language in data/explainer-pages.ts. When
// the POS updated a price, every EN/JA/KO/ZH copy drifted out of date. This
// module resolves those figures ONCE from the POS-backed pricing catalog
// (lib/pricing.ts) and exposes them as locale-aware {{token}} strings that the
// guide pipeline interpolates at render / revalidate time.
//
// CRITICAL DESIGN RULE
// If the pricing API is unreachable, every token resolves to the pinned
// FALLBACK value below — pinned to today's shipped figures — so rendered output
// is byte-identical to the previously hardcoded text. The fallback path is the
// common case in CI/sandbox (the POS API is not reachable there).
//
// SCOPE
// Only LENGOLF figures with a confident product-name match in the POS catalog
// are tokenized. Third-party figures (green fees, caddie fees, airline baggage)
// stay as static text in the content files.

import {
  getPricingCatalog,
  findPrice,
  type PricingCatalog,
} from '@/lib/pricing'

// ── Dynamic (POS-backed) facts, as raw numbers in THB ──
export interface SiteFacts {
  /** 1-hour lesson, 1 golfer (catalog.coaching "1 Golf Lesson"). */
  lessonHourly: number
  /** Cheapest bay rate — weekday, before 14:00 (catalog.bayRates.morning). */
  bayHourlyMin: number
  /** Most expensive bay rate — weekend, afternoon/evening (catalog.bayRates). */
  bayHourlyMax: number
  /** Premium course-rental, 1 day (catalog.clubRental.course). */
  courseRentalDay: number
  /** Club delivery round-trip fee (catalog.clubRental.addons). */
  clubDelivery: number

  // ── Static facts (NOT in the POS) — held here as the single source of truth
  //    for future consumers; only a subset is surfaced as tokens today. ──
  /** Daily opening hours. */
  openingHours: string
  /** LINE handle. */
  lineHandle: string
  /** Venue location. */
  location: string
  /** Coach roster. */
  coaches: string[]
  /** Max players sharing one bay. */
  maxPlayersPerBay: number
  /** Standard club sets are free with any bay booking. */
  freeStandardClubs: boolean

  /** ISO timestamp the catalog was fetched, or null when using fallbacks. */
  fetchedAt: string | null
}

// Pinned to today's shipped figures. Changing the POS updates the live path;
// these keep the fallback path byte-identical to the previously hardcoded copy.
const FALLBACK: SiteFacts = {
  lessonHourly: 1800,
  bayHourlyMin: 550,
  bayHourlyMax: 950,
  courseRentalDay: 1200,
  clubDelivery: 500,
  openingHours: '09:00–23:00',
  lineHandle: '@lengolf',
  location: 'The Mercury Ville @ BTS Chidlom, Floor 4',
  coaches: ['PRO Boss', 'PRO Ratchavin', 'PRO Min'],
  maxPlayersPerBay: 5,
  freeStandardClubs: true,
  fetchedAt: null,
}

/**
 * Resolve the LENGOLF facts, preferring live POS prices and falling back to the
 * pinned figures above when the catalog (or an individual product match) is
 * unavailable. Product-name regexes mirror the ones already used by the
 * pricing getters in data/pricing.ts (coaching / bay rates) and best-effort
 * matches for the club-rental catalog (which has no existing getter).
 */
export async function getSiteFacts(
  catalog?: PricingCatalog | null
): Promise<SiteFacts> {
  catalog = catalog ?? (await getPricingCatalog())
  if (!catalog) return FALLBACK

  // 1-hour, 1-golfer lesson — same pattern as data/pricing.ts oneGolferMap.
  const lessonHourly =
    findPrice(catalog.coaching, /^1 golf lessons?$/i) ?? FALLBACK.lessonHourly

  // Bay rates — cheapest (weekday morning) and most expensive (weekend
  // afternoon/evening), same source columns as data/pricing.ts getBayRatesData.
  const bayHourlyMin =
    findPrice(catalog.bayRates.morning, /weekday/i) ?? FALLBACK.bayHourlyMin
  const weekendPeaks = [
    findPrice(catalog.bayRates.afternoon, /weekend/i),
    findPrice(catalog.bayRates.evening, /weekend/i),
  ].filter((p): p is number => typeof p === 'number')
  const bayHourlyMax = weekendPeaks.length
    ? Math.max(...weekendPeaks)
    : FALLBACK.bayHourlyMax

  // Premium course rental, 1 day — the catalog has no existing getter, so this
  // is a best-effort match: the cheapest (premium, not premium-plus) 1-day
  // course product. Falls back to the pinned figure if no confident match.
  //
  // `clubRental` comes straight from the untyped POS JSON (getPricingCatalog
  // casts res.json() to PricingCatalog without validating), and this module is
  // the FIRST live consumer of clubRental — the existing data/pricing.ts getters
  // only read bayRates/coaching/packages/events. So guard the sub-fields: if the
  // POS payload ever omits clubRental, resolve to the pinned fallback instead of
  // throwing a 500 on every guide page (CI can't catch this — it runs the
  // fallback path). `?? []` keeps the byte-identical-fallback contract intact.
  const courseDayPrices = (catalog.clubRental?.course ?? [])
    .filter((p) => /1[\s-]?day|full[\s-]?day/i.test(p.name))
    .map((p) => p.price)
  const courseRentalDay = courseDayPrices.length
    ? Math.min(...courseDayPrices)
    : FALLBACK.courseRentalDay

  // Club delivery fee — an addon, if the catalog exposes one.
  const clubDelivery =
    findPrice(catalog.clubRental?.addons ?? [], /deliver/i) ??
    FALLBACK.clubDelivery

  return {
    ...FALLBACK,
    lessonHourly,
    bayHourlyMin,
    bayHourlyMax,
    courseRentalDay,
    clubDelivery,
    fetchedAt: catalog.fetchedAt ?? null,
  }
}

// ── Locale-aware token formatting ──
//
// Numeric formatting is SHARED across locales (Arabic digits + thousands
// separators). Only the currency word and its spacing differ, matching the
// shipped guide copy:
//   en → "1,800 THB" (space)   ja → "1,800THB" (no space, majority spelling)
//   ko → "1,800바트" (no space)  zh → "1,800泰铢" (no space)
//
// The JA corpus is INCONSISTENT: most JA entries (screen-golf, lessons, tee
// times) write THB, but two (exp-25-ja, exp-39-ja) write バーツ. We standardize
// the currency-carrying tokens on the majority (THB) and use the number-only
// tokens (…Num) for the バーツ occurrences so their currency word stays literal
// in the content and the fallback output remains byte-identical.
interface CurrencyStyle {
  word: string
  space: string
}

const CURRENCY_BY_LOCALE: Record<string, CurrencyStyle> = {
  en: { word: 'THB', space: ' ' },
  ja: { word: 'THB', space: '' },
  ko: { word: '바트', space: '' },
  zh: { word: '泰铢', space: '' },
  // Thai spells the currency (data/i18n-glossary/th.json conventions.currency:
  // "108 uses vs 0 'THB' in messages/th.json"), with a space before the word per
  // normal Thai spacing. This entry read 'THB' until the FAQ template started
  // consuming it — which also meant the three shipped TH guides that use
  // {{bayHourlyFrom}} (exp-1-th, exp-3-th, gg-thailand-golf-trip-cost-th) were
  // rendering "550THB ต่อชั่วโมง" in Thai prose. All TH usages are bare tokens
  // with no adjacent currency word, so carrying บาท here cannot double it.
  th: { word: 'บาท', space: ' ' },
}

/** Shared numeric format: Arabic digits with thousands separators. */
function num(value: number): string {
  return value.toLocaleString('en-US')
}

/**
 * Format a THB amount in `locale`'s currency convention (th "550 บาท",
 * ja "550THB", ko "550바트", zh "550泰铢"). Exported because UI chrome needs
 * the same convention as guide tokens — HotelConciergePage renders the bay
 * rate and premium-club rate, and duplicating the per-locale spacing/word
 * rules in a component is how the two drift apart.
 */
export function money(locale: string, value: number): string {
  const style = CURRENCY_BY_LOCALE[locale] ?? CURRENCY_BY_LOCALE.en
  return `${num(value)}${style.space}${style.word}`
}

/**
 * The interpolation token vocabulary for a locale. Every token here is either
 * consumed by guide content or intentionally exposed for future use.
 *
 * Price tokens come in two shapes:
 *  - currency-carrying (e.g. `lessonHourly` → "1,800 THB"): used where the
 *    entry's currency word matches the locale default.
 *  - number-only (e.g. `courseRentalDayNum` → "1,200"): used for ranges (so the
 *    locale-specific separator stays literal) and for the JA バーツ minority (so
 *    the currency word stays literal). Keeps output byte-identical.
 */
export async function getFactTokens(
  locale: string,
  catalog?: PricingCatalog | null
): Promise<Record<string, string>> {
  const f = await getSiteFacts(catalog)
  return {
    // Currency-carrying (locale-aware) single-value tokens
    lessonHourly: money(locale, f.lessonHourly),
    bayHourlyFrom: money(locale, f.bayHourlyMin),
    courseRentalDay: money(locale, f.courseRentalDay),
    clubDelivery: money(locale, f.clubDelivery),

    // Number-only tokens (currency + range separator stay literal in content)
    lessonHourlyNum: num(f.lessonHourly),
    bayHourlyMinNum: num(f.bayHourlyMin),
    bayHourlyMaxNum: num(f.bayHourlyMax),
    courseRentalDayNum: num(f.courseRentalDay),
    clubDeliveryNum: num(f.clubDelivery),

    // Per-person bay cost DERIVED from the hourly rate ÷ group size. These MUST
    // be tokens, not literals: a page that quotes the group rate (tokenized)
    // next to a static per-person figure goes self-contradictory the moment the
    // POS changes bay rates. Number-only (they sit inside ranges / beside a
    // literal currency word). Rounded — the copy always frames them as "~/약/程度".
    bayPerPersonMinNum: num(Math.round(f.bayHourlyMin / f.maxPlayersPerBay)),
    bayPerPersonMaxNum: num(Math.round(f.bayHourlyMax / f.maxPlayersPerBay)),

    // Static facts (available to content; not currently referenced)
    openingHours: f.openingHours,
    lineHandle: f.lineHandle,
  }
}

/**
 * Replace every `{{tokenName}}` in `text` with its resolved value. Unknown
 * tokens THROW — because all guide pages are statically generated, a typo'd
 * token fails the build instead of shipping a literal `{{…}}` to users.
 */
export function interpolateFacts(
  text: string,
  tokens: Record<string, string>
): string {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, name: string) => {
    if (!Object.prototype.hasOwnProperty.call(tokens, name)) {
      throw new Error(
        `[site-facts] Unknown fact token "{{${name}}}" — add it to getFactTokens() in lib/site-facts.ts or fix the typo in the content.`
      )
    }
    return tokens[name]
  })
}
