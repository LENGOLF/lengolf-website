import { getLocale, getTranslations } from 'next-intl/server'
import { hasTranslationForLocale } from '@/lib/translated-routes'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import BookRentalLink from '@/components/clubs/BookRentalLink'
import { BOOKING_URL } from '@/lib/constants'

/**
 * Contextual crosslink to the paid course rental service. Rendered by the Golf
 * Club Rental, Golf Near and Things To Do location templates, by /golf and
 * /lessons, and by the FAQ template for rental-intent questions (see
 * RENTAL_CTA_CATEGORIES in components/faq/FaqPage.tsx).
 *
 * Three destinations, deliberately: the primary CTA goes straight to the
 * course-rental booking flow (booking.len.golf/course-rental) so a reader who
 * has already decided does not have to transit the landing page; the secondary
 * link goes to /golf-course-club-rental for those still comparing — which also
 * keeps the internal link equity this banner was built to pass; and a third
 * link feeds the /golf-courses hub, whose 226-URL section is otherwise reached
 * only from within itself and the footer.
 *
 * That third link is gated on hasTranslationForLocale(locale, '/golf-courses')
 * rather than locale === 'en': the hub is translated for all four non-English
 * locales (th, ja, ko, zh), so an EN-only gate would withhold a
 * natively-resolving link from every one of those readers.
 *
 * The booking CTA uses the tracked BookRentalLink so it fires `rental_intent`
 * like every other funnel-entry click; without it, Smart Bidding would go blind
 * to a click that now appears on six page templates.
 *
 * Copy comes from the `Location` namespace, populated in all five locales
 * (including courseHubCta) — safe to render on any localized page without
 * MISSING_MESSAGE.
 */
export default async function CourseRentalCrossLink() {
  const t = await getTranslations('Location')
  const locale = await getLocale()
  const courseRentalUrl = `${BOOKING_URL}course-rental`

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-[900px] px-5">
        <div className="flex flex-col items-start gap-4 rounded-xl border-2 border-[#2d6a4f]/30 bg-[#e8f5e9] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-[#1a472a]">{t('courseRentalCrossTitle')}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('courseRentalCrossText')}</p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            <BookRentalLink
              href={courseRentalUrl}
              source="cross_link"
              label={t('bookNow')}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2d6a4f] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1a472a]"
              iconSize={16}
            />
            <Link
              href="/golf-course-club-rental"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#2d6a4f] underline underline-offset-2 transition-colors hover:text-[#1a472a]"
            >
              {t('courseRentalCrossCta')}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            {/* Show wherever /golf-courses resolves natively. EN is special-
                cased because TRANSLATED_ROUTES only maps the NON-English
                locales — it is a registry of translations OF English, so
                hasTranslationForLocale('en', ...) is always false and using it
                alone would hide this link on the majority locale. Same shape
                as the alternates guard in app/[locale]/golf-courses/page.tsx.
                All four locales now have hub translations, so the gate
                passes for each of them and no click 301s. */}
            {(locale === 'en' || hasTranslationForLocale(locale, '/golf-courses')) && (
              <Link
                href="/golf-courses"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#2d6a4f] underline underline-offset-2 transition-colors hover:text-[#1a472a]"
              >
                {t('courseHubCta')}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
