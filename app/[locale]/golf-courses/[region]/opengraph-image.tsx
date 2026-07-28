import { REGION_META } from '@/lib/golf-courses'
import type { Region } from '@/lib/golf-courses'
import { ogCard, OG_SIZE } from '@/lib/og-card'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'Regional golf course directory — green fees and course guides'

interface Props {
  params: Promise<{ locale: string; region: string }>
}

export default async function Image({ params }: Props) {
  const { region } = await params
  const meta = REGION_META[region as Region]

  if (!meta) {
    return ogCard({ eyebrow: 'Thailand Golf Courses', title: 'LENGOLF Course Guides' })
  }

  return ogCard({
    eyebrow: meta.province,
    title: `${meta.label} Golf Courses`,
    chips: [`${meta.courseCount} course guides`, 'Green fees & maps'],
    footer: 'Every course mapped · Green fees · Club rental',
  })
}
