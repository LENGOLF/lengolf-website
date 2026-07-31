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

/**
 * Format a drive time (in minutes) from Bangkok in a human-readable way.
 * Converts ≥120 min to hours to avoid displaying "~660 min" for distant courses.
 *
 * @param min        - drive time in minutes, or null
 * @param withSuffix - append " from Bangkok" (use true for hero chips / sidebar,
 *                     false for stat cards and compact table cells)
 * @param locale     - 'en' (default — output byte-identical to the pre-i18n
 *                     version) or 'th' (Thai units + the glossary-settled
 *                     "จากกรุงเทพฯ" suffix)
 */
export function driveTimeLabel(
  min: number | null,
  withSuffix = true,
  locale: 'en' | 'th' = 'en'
): string | null {
  if (!min) return null
  // Keep half hours exact: 150 min is "~2.5h", not "~3h" (Math.round would
  // overstate a factual figure by up to 30 minutes).
  if (locale === 'th') {
    const val = min >= 120 ? `~${formatHours(min)} ชม.` : `~${min} นาที`
    return withSuffix ? `${val} จากกรุงเทพฯ` : val
  }
  const val = min >= 120 ? `~${formatHours(min)}h` : `~${min} min`
  return withSuffix ? `${val} from Bangkok` : val
}

/**
 * Thai "Month YYYY" for an ISO date, with the GREGORIAN year: th-TH's default
 * calendar is Buddhist era (2026 → 2569), but the TH glossary's as-of format
 * uses Gregorian ("(ข้อมูล ณ กรกฎาคม 2026)"), so only the month name comes
 * from the locale.
 */
export function thaiMonthYear(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`)
  const month = d.toLocaleDateString('th-TH', { month: 'long', timeZone: 'UTC' })
  return `${month} ${d.getUTCFullYear()}`
}

/** Hours from minutes, keeping .5 precision: 150 → "2.5", 180 → "3". */
export function formatHours(min: number): string {
  const h = min / 60
  return h % 1 === 0.5 ? h.toFixed(1) : String(Math.round(h))
}
