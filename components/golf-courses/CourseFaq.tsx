import { useTranslations } from 'next-intl'
import type { CourseFaqItem } from '@/lib/course-seo'

/**
 * Data-derived FAQ block for course detail pages. The route computes the
 * items once (lib/course-seo getCourseFaqs) and passes the same array here
 * and to the FAQPage JSON-LD, so visible content and structured data cannot
 * drift apart. The heading comes from GolfCourseDetail — a namespace present
 * in en/th only, which is safe because this server component only renders on
 * the locales that SSG course-detail pages.
 */
export default function CourseFaq({ faqs }: { faqs: CourseFaqItem[] }) {
  const t = useTranslations('GolfCourseDetail')
  if (faqs.length === 0) return null

  return (
    <div>
      <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
        {t('faqHeading')}
      </h2>
      <div className="space-y-3">
        {faqs.map((f) => (
          <div key={f.question} className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <h3 className="mb-2 text-sm font-bold text-foreground">{f.question}</h3>
            <p className="text-sm leading-relaxed text-foreground/80">{f.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
