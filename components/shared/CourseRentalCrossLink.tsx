import { getTranslations } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'

/**
 * Contextual crosslink from location pages to the paid course rental
 * service (/golf-course-club-rental/). Rendered by the Golf Club Rental,
 * Golf Near, and Things To Do templates so every page of those templates
 * passes internal link equity to the course rental landing page.
 */
export default async function CourseRentalCrossLink() {
  const t = await getTranslations('Location')

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-[900px] px-5">
        <Link
          href="/golf-course-club-rental"
          className="group flex flex-col items-start gap-3 rounded-xl border-2 border-[#2d6a4f]/30 bg-[#e8f5e9] px-6 py-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-bold text-[#1a472a]">{t('courseRentalCrossTitle')}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('courseRentalCrossText')}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#2d6a4f] px-5 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-[#1a472a]">
            {t('courseRentalCrossCta')}
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </section>
  )
}
