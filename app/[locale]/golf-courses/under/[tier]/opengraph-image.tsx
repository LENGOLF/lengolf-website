import { notFound } from 'next/navigation'
import { PRICE_TIERS } from '@/data/price-tiers'
import { getCoursesUnderPrice, getPriceTierSlugs } from '@/lib/golf-courses-derived'
import { feeNounEn } from '@/lib/course-fees'
import { ogCard, ogThb, OG_SIZE } from '@/lib/og-card'

export const size = OG_SIZE
export const contentType = 'image/png'
// Module-level, so it cannot follow the roster's fee noun: noun-neutral.
export const alt = 'Golf courses under a price band: course roundup'

// Mirror the page's segment config. This is a route handler, so the
// dynamicParams = false on app/[locale]/layout.tsx does not reach it: without
// this one, a junk locale beside a real tier (/images/golf-courses/under/
// 1500-baht/opengraph-image/, where the middleware matcher skips the path)
// would render a PNG on demand for every invented URL.
export const revalidate = 86400
export const dynamicParams = false

export function generateStaticParams() {
  // EN-only, although the PAGE also builds th/ja/ko/zh tiers: the translated-
  // routes allowlist lists the tier page, not this /opengraph-image child, so a
  // translated page's og:image (/ja/golf-courses/under/<tier>/opengraph-image)
  // 308s to the trailing slash and then 301s to the English card, the same as
  // the [region] sibling.
  return getPriceTierSlugs().map((tier) => ({ locale: 'en', tier }))
}

interface Props {
  params: Promise<{ locale: string; tier: string }>
}

export default async function Image({ params }: Props) {
  const { tier } = await params
  const meta = PRICE_TIERS.find((t) => t.slug === tier)
  if (!meta) notFound()

  // The same roster call the page makes, and the same empty-roster 404, so the
  // count and the noun match its H2.
  const courses = await getCoursesUnderPrice(meta.thb, 12)
  if (courses.length === 0) notFound()
  const amount = meta.thb.toLocaleString('en-US')
  const noun = feeNounEn(courses)

  return ogCard({
    // The page's hero badge, which picks the same noun from the same roster.
    eyebrow: `${noun} · Under ${amount} THB`,
    // The page's own H1, so the two cannot disagree.
    title: ogThb(meta.title),
    chips: [`Top ${courses.length} courses`],
    footer: `${noun}s · Course Guides · Golf Club Rental`,
  })
}
