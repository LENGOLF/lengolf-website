import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { RentalIntentSource } from '@/lib/analytics'
import TrackedRentalLink from '@/components/golf-courses/TrackedRentalLink'

interface Props {
  /** Override the eyebrow text (default: GolfCourseShared.rentalEyebrow). */
  eyebrow?: string
  /** Override the body line (default: GolfCourseShared.rentalBody). */
  body?: React.ReactNode
  /** rental_intent source fired when the Book CTA is clicked. */
  source?: RentalIntentSource
}

/**
 * The standard LENGOLF club-rental CTA banner reused across the
 * programmatic-SEO course pages. Mirrors the inline pattern in
 * components/golf-courses/CoursePage.tsx so the visual identity stays
 * consistent across the section.
 *
 * Default copy and button labels come from the GolfCourseShared namespace so
 * the banner localizes on translated locale routes (e.g. /th/golf-courses/
 * under/*) — the rental pitch lives in ONE message key per locale instead of
 * a hardcoded EN fallback plus per-page copies.
 */
export default function RentalCtaBanner({ eyebrow, body, source = 'seo_page' }: Props) {
  const t = useTranslations('GolfCourseShared')
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003d22] to-[#005a32] p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-6 left-1/3 h-28 w-28 rounded-full bg-accent/10" aria-hidden="true" />
      <p className="relative mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
        {eyebrow ?? t('rentalEyebrow')}
      </p>
      <p className="relative mb-5 text-base font-medium leading-snug text-white sm:text-lg">
        {body ??
          t.rich('rentalBody', {
            price: (chunks) => <strong className="text-white">{chunks}</strong>,
          })}
      </p>
      <div className="relative flex flex-wrap gap-3">
        <TrackedRentalLink
          href="https://booking.len.golf/course-rental"
          source={source}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-[#1a1a1a] transition-all hover:bg-accent/90 hover:shadow-lg"
        >
          {t('bookNow')}
        </TrackedRentalLink>
        <Link
          href="/golf-course-club-rental"
          className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          {t('learnMore')} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
