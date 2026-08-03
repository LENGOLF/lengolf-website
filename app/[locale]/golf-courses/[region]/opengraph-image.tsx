import { notFound } from 'next/navigation'
import { REGION_META } from '@/lib/golf-courses'
import type { Region } from '@/lib/golf-courses'
import { ogCard, OG_SIZE } from '@/lib/og-card'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'Regional golf course directory — green fees and course guides'

// Mirror the page family's config — unknown regions must 404, not render a
// fallback PNG on demand (see the [slug] sibling for rationale).
export const revalidate = 86400
export const dynamicParams = false

export function generateStaticParams() {
  // EN-only, matching the middleware reality: the translated-routes allowlist
  // covers the hub PAGES but not this /opengraph-image child, so a locale-
  // prefixed og:image URL (e.g. /ja/golf-courses/bangkok/opengraph-image/)
  // 301s to the English card regardless of what we prerender here. Crawlers
  // follow the redirect; emitting translated params was dead build output.
  return Object.keys(REGION_META).map((region) => ({ locale: 'en', region }))
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
