import type { GolfCourse } from '@/types/golf-courses'
import { getCourseFaqs } from '@/lib/course-seo'

/**
 * Data-derived FAQ block for course detail pages. The same getCourseFaqs()
 * array is emitted as FAQPage JSON-LD by the route, so the visible content
 * and the structured data can never drift apart.
 */
export default function CourseFaq({ course }: { course: GolfCourse }) {
  const faqs = getCourseFaqs(course)
  if (faqs.length === 0) return null

  return (
    <div>
      <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
        Frequently asked questions
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
