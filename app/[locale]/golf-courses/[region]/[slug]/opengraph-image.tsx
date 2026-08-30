import { notFound } from 'next/navigation'
import { getCourseBySlug, getAllCourseParams, REGION_META } from '@/lib/golf-courses'
import type { Region } from '@/lib/golf-courses'
import { driveTimeLabel } from '@/lib/format'
import { feeNounEn } from '@/lib/course-fees'
import { ogCard, OG_SIZE } from '@/lib/og-card'

export const size = OG_SIZE
export const contentType = 'image/png'
// A module-level const shared by all 148 courses, so it cannot name a
// course-specific noun — the same rule as a shared column header. It said
// "green fees" and shipped as the social card's alt text on the two package
// courses; un-exempting this file from NUMERIC_ONLY is what surfaced it.
export const alt = 'Golf course guide — rates, tips and club rental'

// Mirror the page's segment config: without these, the image route renders
// on demand for ANY probed slug — an unbounded space of billable satori
// renders returning soft-200 PNGs where the page itself 404s.
export const revalidate = 86400
export const dynamicParams = false

export async function generateStaticParams() {
  return (await getAllCourseParams()).map((p) => ({ locale: 'en', ...p }))
}

interface Props {
  params: Promise<{ locale: string; region: string; slug: string }>
}

export default async function Image({ params }: Props) {
  const { region, slug } = await params
  const course = await getCourseBySlug(region, slug)
  if (!course) notFound()

  const regionLabel = REGION_META[region as Region]?.label ?? region

  const chips = [
    `${course.holes} holes · Par ${course.par}`,
    // "THB", not "฿" — the bundled next/og font has no U+0E3F glyph (renders tofu)
    course.green_fee_weekday_thb
      ? `From ${course.green_fee_weekday_thb.toLocaleString('en-US')} THB`
      : null,
    driveTimeLabel(course.drive_time_from_bangkok_min),
  ].filter(Boolean) as string[]

  return ogCard({
    eyebrow: `${course.province} · ${regionLabel}`,
    title: course.name,
    chips,
    // ogCard's default footer opens with "Green Fees", and this route passed no
    // footer — so a package course's social card said "Green Fees" directly
    // under an all-in price chip, in the `alt` text too. The price chip itself
    // is noun-free (`From 1,199 THB`), which is why nothing else caught it.
    footer: `${feeNounEn([course])}s · Course Guide · Golf Club Rental`,
  })
}
