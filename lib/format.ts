/**
 * Shared formatting utilities — importable from both server and client components.
 * No 'server-only' guard so client components (CourseMapExplorer etc.) can use these.
 */

/** Format a THB fee as "1,000 THB", or null if the value is not set. */
export function formatFee(n: number | null): string | null {
  if (n === null) return null
  return n.toLocaleString('en-US') + ' THB'
}

/** Symbol-style THB amount: "฿1,500". For meta/inline text; formatFee for UI rows. */
export function formatBaht(n: number): string {
  return `฿${n.toLocaleString('en-US')}`
}

/** Locales the course-page formatters below carry templates for. */
type FormatLocale = 'en' | 'th' | 'ja'

// Per-locale drive-time fragments. EN templates are byte-identical to the
// pre-i18n hardcoded strings; TH follows the glossary-settled "จากกรุงเทพฯ"
// suffix; JA uses 約 + half-width digits with the parenthesized suffix
// appended WITHOUT a space (（バンコクから） carries its own brackets).
const DRIVE_TIME_L10N: Record<
  FormatLocale,
  { minutes: (min: number) => string; hours: (h: string) => string; suffix: (val: string) => string }
> = {
  en: {
    minutes: (min) => `~${min} min`,
    hours: (h) => `~${h}h`,
    suffix: (val) => `${val} from Bangkok`,
  },
  th: {
    minutes: (min) => `~${min} นาที`,
    hours: (h) => `~${h} ชม.`,
    suffix: (val) => `${val} จากกรุงเทพฯ`,
  },
  ja: {
    minutes: (min) => `約${min}分`,
    hours: (h) => `約${h}時間`,
    suffix: (val) => `${val}（バンコクから）`,
  },
}

/**
 * Format a drive time (in minutes) from Bangkok in a human-readable way.
 * Converts ≥120 min to hours to avoid displaying "~660 min" for distant courses.
 *
 * @param min        - drive time in minutes, or null
 * @param withSuffix - append " from Bangkok" (use true for hero chips / sidebar,
 *                     false for stat cards and compact table cells)
 * @param locale     - 'en' (default — output byte-identical to the pre-i18n
 *                     version), 'th' (Thai units + "จากกรุงเทพฯ" suffix) or
 *                     'ja' (約70分 / 約2.5時間 +（バンコクから）)
 */
export function driveTimeLabel(
  min: number | null,
  withSuffix = true,
  locale: FormatLocale = 'en'
): string | null {
  if (!min) return null
  // Keep half hours exact: 150 min is "~2.5h", not "~3h" (Math.round would
  // overstate a factual figure by up to 30 minutes).
  const l10n = DRIVE_TIME_L10N[locale]
  const val = min >= 120 ? l10n.hours(formatHours(min)) : l10n.minutes(min)
  return withSuffix ? l10n.suffix(val) : val
}

/**
 * Localized "month + year" for an ISO date — the building block for each
 * locale's as-of / rates-checked wording:
 *   en → "Jul 2026"      (short en-US month, matches the sidebar rates line)
 *   th → "กรกฎาคม 2026"   (Thai month name + GREGORIAN year: th-TH's default
 *                          calendar is Buddhist era (2026 → 2569), but the TH
 *                          glossary's as-of format uses Gregorian, so only the
 *                          month name comes from the locale)
 *   ja → "2026年7月"      (half-width digits; callers wrap it per the glossary
 *                          as-of form （2026年7月現在）)
 */
export function asOfMonthYear(isoDate: string, locale: FormatLocale): string {
  const d = new Date(`${isoDate}T00:00:00Z`)
  const year = d.getUTCFullYear()
  switch (locale) {
    case 'th': {
      const month = d.toLocaleDateString('th-TH', { month: 'long', timeZone: 'UTC' })
      return `${month} ${year}`
    }
    case 'ja':
      return `${year}年${d.getUTCMonth() + 1}月`
    default:
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
  }
}

/**
 * Thai "Month YYYY" for an ISO date, with the Gregorian year.
 * @deprecated Alias for `asOfMonthYear(isoDate, 'th')` — use that directly.
 */
export function thaiMonthYear(isoDate: string): string {
  return asOfMonthYear(isoDate, 'th')
}

/** Hours from minutes, keeping .5 precision: 150 → "2.5", 180 → "3". */
export function formatHours(min: number): string {
  const h = min / 60
  return h % 1 === 0.5 ? h.toFixed(1) : String(Math.round(h))
}
