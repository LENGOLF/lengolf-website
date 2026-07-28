import { REGION_META } from '@/lib/golf-courses'
import { ogCard, OG_SIZE } from '@/lib/og-card'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'Thailand golf course directory — green fees and course guides'

export default async function Image() {
  const totalCourses = Object.values(REGION_META).reduce((sum, m) => sum + m.courseCount, 0)
  const regionCount = Object.keys(REGION_META).length

  return ogCard({
    eyebrow: 'Thailand',
    title: 'Golf Course Guides',
    chips: [`${totalCourses} courses`, `${regionCount} regions`, 'Green fees & maps'],
    footer: 'Every course mapped · Green fees · Club rental',
  })
}
