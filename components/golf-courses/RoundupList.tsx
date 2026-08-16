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

/**
 * First sentence of the (localized) `prose.overview` — used as the pull quote.
 *
 * The terminator class carries the CJK full-width forms as well as the ASCII
 * ones: ja/zh prose ends sentences with 。, so an ASCII-only class matches
 * nothing and returns the WHOLE paragraph. That is not a crash — the <p> is
 * line-clamp-2 — but it ships a full paragraph where a one-line quote was
 * intended. Adding 。！？ cannot change EN/TH output, since neither contains
 * those characters.
 *
 * Thai still returns the whole overview by design: Thai writes sentences with
 * no terminal punctuation at all, so there is nothing to split on, and cutting
 * at a character count would break mid-word (Thai has no inter-word spaces).
 * The clamp handles it.
 */
function firstSentence(text: string): string {
  const m = text.match(/^[^.!?。！？]*[.!?。！？]/)
  return (m ? m[0] : text).trim()
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
