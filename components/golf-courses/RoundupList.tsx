import { ArrowRight, MapPin } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
// next/link, NOT the i18n Link: the i18n Link prefixes the locale
// automatically, which is precisely the blanket behaviour that 301s every
// link to an untranslated course. courseDetailHref decides per course, so
// its output must be used verbatim.
import Link from 'next/link'
import type { GolfCourse } from '@/types/golf-courses'
import { driveTimeLabel, toFormatLocale } from '@/lib/format'
import { localizedCourseProse } from '@/lib/course-seo'
import { courseDetailHref } from '@/lib/translated-routes'

export interface RoundupItem {
  course: GolfCourse
  /** 1-line reason composed by the parent page (use-case fit, distance km, etc.). */
  reason: string
}

interface Props {
  items: RoundupItem[]
}

/** ASCII and CJK full-width sentence terminators. */
const TERMINATORS = new Set(['.', '!', '?', '。', '！', '？'])

/**
 * First sentence of the (localized) `prose.overview` — used as the pull quote.
 *
 * A scan rather than one regex, because the two rules below cannot both be
 * expressed in a single match without backtracking defeating them: a regex that
 * exempts a decimal point silently falls BACK to cutting at that same point
 * when no later terminator exists, which is precisely the case this has to fix.
 *
 * Rule 1 — the CJK full-width terminators must be recognized. ja/zh prose ends
 * sentences with 。, so an ASCII-only class matched nothing and returned the
 * whole paragraph where a one-line quote was intended. Measured: ja/ko/zh
 * first sentences are 71–92 chars at the median, so this is the difference
 * between a pull quote and a wall of text.
 *
 * Rule 2 — an ASCII '.' glued to a digit on BOTH sides is a decimal or a clock
 * time, not a sentence end. Thai writes times as 06.00 and durations as 2.5,
 * and Thai has no sentence-terminating punctuation of its own, so the first
 * stray '.' in a Thai overview falls deep inside the paragraph: 11 of the 50
 * Thai overviews were being cut MID-NUMBER ("…ทีไทม์ช่วง 06.", "…ราว 2."). The
 * clamp hides that from a sighted reader; a screen reader and a crawler get the
 * truncated figure. Requiring whitespace-or-end after an ASCII terminator
 * covers the same class from the other side.
 *
 * Thai therefore still returns the WHOLE overview in most cases (39 of 50 did
 * already, and the mid-number ones now join them) — there is genuinely nothing
 * to split on, and a character cut would break mid-word since Thai does not
 * space between words. Be honest about what that costs: the Thai `<p>` carries
 * the entire overview, ~763 chars at the median, visually clamped to two lines.
 * Correct, but not free — a real Thai pull quote needs an authored summary
 * field, not a smarter split.
 */
function firstSentence(text: string): string {
  const t = text.trim()
  for (let i = 0; i < t.length; i++) {
    const ch = t[i]
    if (!TERMINATORS.has(ch)) continue
    // Full-width terminators are unambiguous sentence ends; they are not used
    // as decimal separators or in abbreviations.
    if (ch !== '.' && ch !== '!' && ch !== '?') return t.slice(0, i + 1)
    const next = t[i + 1]
    if (ch === '.' && /\d/.test(t[i - 1] ?? '') && /\d/.test(next ?? '')) continue
    if (next === undefined || /\s/.test(next)) return t.slice(0, i + 1)
  }
  return t
}

export default function RoundupList({ items }: Props) {
  // Localized UI labels — this component renders on translated locale routes
  // (e.g. /th/golf-courses/under/*), so chip text must not be hardcoded EN.
  const t = useTranslations('GolfCourseShared')
  // Per-course href resolution: /under/<tier> SSGs th/ja/ko/zh, but only
  // some courses have translated detail pages — a blanket locale prefix
  // would 301 most of the links in this list.
  const rawLocale = useLocale()
  // Content locale, narrowed the same way CoursePage does it. This list renders
  // on the translated /under/<tier> pages, so the pull quote and the drive-time
  // chip must follow the page language, not the EN defaults. courseDetailHref
  // still takes the RAW locale — it decides the URL prefix, which is a routing
  // question and must not be collapsed to the content-locale union.
  const locale = toFormatLocale(rawLocale)
  return (
    <ol className="space-y-4">
      {items.map((item, idx) => {
        const c = item.course
        return (
          <li key={c.slug}>
            <Link
              href={courseDetailHref(rawLocale, c.region, c.slug)}
              className="group flex gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm transition-all hover:-translate-y-px hover:border-primary/30 hover:shadow-md sm:p-5"
            >
              {/* Rank */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-black text-primary">
                {idx + 1}
              </div>

              {/* Body */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h3 className="text-base font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                    {c.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    <MapPin className="h-2.5 w-2.5" />
                    {c.province}
                  </span>
                </div>

                <p className="mt-1.5 text-sm leading-relaxed text-foreground/80 line-clamp-2">
                  {firstSentence(localizedCourseProse(c, locale).overview)}
                </p>

                {/* Chips: fee + drive time + reason */}
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  {c.green_fee_weekday_thb !== null && (
                    <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                      {t('feeFrom', { price: c.green_fee_weekday_thb.toLocaleString('en-US') })}
                    </span>
                  )}
                  {c.drive_time_from_bangkok_min !== null && (
                    <span className="rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-[11px] text-muted-foreground">
                      {driveTimeLabel(c.drive_time_from_bangkok_min, false, locale)}
                    </span>
                  )}
                </div>

                {item.reason && (
                  <p className="mt-2 text-xs italic text-muted-foreground">
                    {item.reason}
                  </p>
                )}
              </div>

              {/* Arrow */}
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>
          </li>
        )
      })}
    </ol>
  )
}
