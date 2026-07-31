import { notFound } from 'next/navigation'
import { REGION_META } from '@/lib/golf-courses'
import type { Region } from '@/lib/golf-courses'
import { getTranslatedRegionHubParams } from '@/data/golf-courses-i18n'
import { ogCard, OG_SIZE } from '@/lib/og-card'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'Regional golf course directory — green fees and course guides'

// Mirror the page family's config — unknown regions must 404, not render a
// fallback PNG on demand (see the [slug] sibling for rationale).
export const revalidate = 86400
export const dynamicParams = false

export function generateStaticParams() {
  // Must mirror the page's params exactly: translated hubs (ja/ko/zh/th × 5
  // regions) reference this route in their og:image meta, so those locale
  // variants must exist here too or their share cards 404.
  return [
    ...Object.keys(REGION_META).map((region) => ({ locale: 'en', region })),
    ...getTranslatedRegionHubParams(),
  ]
}

interface Props {
  params: Promise<{ locale: string; region: string }>
}

export default async function Image({ params }: Props) {
  const { region } = await params
  const meta = REGION_META[region as Region]
  if (!meta) notFound()

  return ogCard({
    eyebrow: meta.province,
    title: `${meta.label} Golf Courses`,
    chips: [`${meta.courseCount} course guides`, 'Green fees & maps'],
    footer: 'Every course mapped · Green fees · Club rental',
  })
}
