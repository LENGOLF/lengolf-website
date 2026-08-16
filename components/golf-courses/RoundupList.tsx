import { ArrowRight, MapPin } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
// next/link, NOT the i18n Link: the i18n Link prefixes the locale
// automatically, which is precisely the blanket behaviour that 301s every
// link to an untranslated course. courseDetailHref decides per course, so
// its output must be used verbatim.
import Link from 'next/link'
import type { GolfCourse } from '@/types/golf-courses'
import { driveTimeLabel, toFormatLocale, type FormatLocale } from '@/lib/format'
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

/** CJK full-width sentence terminators — never decimal separators or abbreviations. */
const FULL_WIDTH_TERMINATORS = new Set(['。', '！', '？'])

/**
 * First sentence of the (localized) `prose.overview` — used as the pull quote.
 *
 * Which characters end a sentence is a PER-LANGUAGE fact, so this takes the
 * locale rather than trying to be universal. Measured over all 149 courses
 * (2026-08-16); recount before quoting these forward:
 *
 *   en  ASCII '.' — 149/149 split, median 178 chars. Byte-identical to the
 *       pre-i18n implementation, verified 0/149 differences.
 *   ko  ASCII '.' — Korean genuinely ends sentences with a period. 50/50
 *       split, median 77. It was never affected by any of this.
 *   ja  。 only — 41/50 found NO ASCII terminator, so an ASCII-only rule
 *   zh  。 only   returned the whole paragraph. Medians 71 (ja) / 93 (zh).
 *   th  none at all — Thai does not punctuate sentence ends. 50/50 return the
 *       whole overview.
 *
 * Restricting ja/zh to 。 and exempting th entirely is what fixes the cut this
 * function used to make mid-token. An ASCII '.' inside th/zh prose is a
 * decimal (2.5), a clock time (06.00), a Thai abbreviation (น.) or a Latin one
 * (Dr., Jr., MBK Public Co.) — never a sentence end. It shipped quotes reading
 * "…ออกแบบโดย Dr." and "…与Japan Golf Promotion Co.", losing the name that was
 * the point of the sentence. line-clamp-2 hides that from a sighted reader —
 * the cut is hundreds of characters in — but a screen reader and a crawler get
 * the fragment.
 *
 * Do NOT try to express this as one regex. Exempting a decimal point
 * (`(?:[^.!?。！？]|(?<=\d)\.(?=\d))*[.!?。！？]`) BACKTRACKS and re-matches that
 * same '.' as the terminator whenever no later terminator exists — reproducing
 * the exact cut, while appearing to work on the one entry that has a later
 * " น." to reach.
 *
 * What Thai costs, stated honestly: the th `<p>` carries the entire overview,
 * 795 chars at the median, visually clamped to two lines but read in full by
 * screen readers and crawlers, and duplicated verbatim from that course's own
 * detail page. Worst case measured is /th/…/under/7500-baht/ at +3.6 KB
 * gzipped (+4.8% of the page). A real Thai pull quote needs an authored
 * summary field; a smarter splitter cannot produce one.
 */
function firstSentence(text: string, locale: FormatLocale): string {
  const t = text.trim()
  // Thai has no sentence-terminating punctuation. There is nothing to split on,
  // and a character cut would break mid-word (Thai does not space words).
  if (locale === 'th') return t
  const asciiTerminates = locale === 'en' || locale === 'ko'
  for (let i = 0; i < t.length; i++) {
    const ch = t[i]
    if (FULL_WIDTH_TERMINATORS.has(ch)) return t.slice(0, i + 1)
    if (!asciiTerminates) continue
    if (ch !== '.' && ch !== '!' && ch !== '?') continue
    // Require whitespace-or-end so a decimal or a version number does not end
    // the sentence. Latin abbreviations (Jr., Co.) still cut early — that is
    // pre-existing EN behaviour, unchanged here, and fixing it would move EN
    // output. Left as a known gap rather than smuggled into an i18n PR.
    const next = t[i + 1]
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
                  {firstSentence(localizedCourseProse(c, locale).overview, locale)}
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
