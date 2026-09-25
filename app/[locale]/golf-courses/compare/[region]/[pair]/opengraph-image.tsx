import { notFound } from 'next/navigation'
import { REGION_META, getCourseBySlug, type Region } from '@/lib/golf-courses'
import { getComparisonPairs, parsePairSlug, pairSlug } from '@/lib/golf-courses-derived'
import { feeNounEn } from '@/lib/course-fees'
import { ogCard, OG_SIZE } from '@/lib/og-card'

export const size = OG_SIZE
export const contentType = 'image/png'
// Module-level, so it cannot follow the pair's fee noun: noun-neutral.
export const alt = 'Side-by-side golf course comparison'

// Mirror the page's segment config. This is a route handler, so the
// dynamicParams = false on app/[locale]/layout.tsx does not reach it.
export const revalidate = 86400
export const dynamicParams = false

export async function generateStaticParams() {
  // The page's own list, EN-only: the pairs are derived, so a card can only
  // exist for a comparison the page also builds.
  const pairs = await getComparisonPairs()
  return pairs.map((p) => ({ locale: 'en', region: p.region, pair: pairSlug(p.slugA, p.slugB) }))
}

interface Props {
  params: Promise<{ locale: string; region: string; pair: string }>
}

export default async function Image({ params }: Props) {
  const { region, pair } = await params
  if (!REGION_META[region as Region]) notFound()
  const parsed = parsePairSlug(region as Region, pair, await getComparisonPairs())
  if (!parsed) notFound()

  const [a, b] = await Promise.all([
    getCourseBySlug(region, parsed.slugA),
    getCourseBySlug(region, parsed.slugB),
  ])
  if (!a || !b) notFound()

  return ogCard({
    // The page's hero badge.
    eyebrow: `${REGION_META[region as Region].label} Golf Course Comparison`,
    // The page's H1.
    title: `${a.name} vs ${b.name}`,
    chips: ['Side by side', 'Par, designer & drive time'],
    // Both courses are in scope, so the noun follows them, as the page's does.
    footer: `${feeNounEn([a, b])}s · Course Guides · Golf Club Rental`,
  })
}
