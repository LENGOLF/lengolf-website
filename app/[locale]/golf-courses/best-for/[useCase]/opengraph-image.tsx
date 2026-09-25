import { notFound } from 'next/navigation'
import { USE_CASES, USE_CASE_RULES, type UseCase } from '@/data/golf-courses-use-cases'
import { getCoursesForUseCase } from '@/lib/golf-courses-derived'
import { feeNounEn } from '@/lib/course-fees'
import { ogCard, OG_SIZE } from '@/lib/og-card'

export const size = OG_SIZE
export const contentType = 'image/png'
// Module-level, so it cannot follow the roster's fee noun: noun-neutral.
export const alt = 'Golf courses picked for a type of round: course roundup'

// Mirror the page's segment config. This is a route handler, so the
// dynamicParams = false on app/[locale]/layout.tsx does not reach it.
export const revalidate = 86400
export const dynamicParams = false

export function generateStaticParams() {
  return USE_CASES.map((useCase) => ({ locale: 'en', useCase }))
}

interface Props {
  params: Promise<{ locale: string; useCase: string }>
}

export default async function Image({ params }: Props) {
  const { useCase } = await params
  if (!(USE_CASES as readonly string[]).includes(useCase)) notFound()
  const meta = USE_CASE_RULES[useCase as UseCase]

  // The same roster call the page makes, so the count matches its H2
  // ("N courses matching the ... criteria").
  const courses = await getCoursesForUseCase(meta.slug, 8)
  if (courses.length === 0) notFound()

  return ogCard({
    eyebrow: 'Golf course guide',
    // The page's own H1, so the two cannot disagree.
    title: meta.title,
    chips: [`${courses.length} matching courses`],
    // The page names no noun of its own; this one follows the roster.
    footer: `${feeNounEn(courses)}s · Course Guides · Golf Club Rental`,
  })
}
