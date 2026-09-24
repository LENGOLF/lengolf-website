import { REGION_META } from '@/lib/golf-courses'
import { ogCard, OG_SIZE } from '@/lib/og-card'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'Thailand golf course directory — green fees and course guides'

// Mirror the [region] and [slug] siblings: without these the card renders on
// demand for ANY locale value, and the dynamicParams = false on
// app/[locale]/layout.tsx does not help, because a route handler (metadata
// image routes included) takes segment config from its own file only. A junk
// locale reaches this file whenever the middleware matcher skips the path
// (`/images/golf-courses/opengraph-image/`, `/api/...`, a first segment
// starting `llms.txt`): measured 2026-09-24 as a 200 PNG of ~44 KB per
// invented URL, one satori render each, unbounded.
export const revalidate = 86400
export const dynamicParams = false

export function generateStaticParams() {
  // EN-only, and that serves every locale. Measured on prod 2026-09-24: all
  // five hub pages emit a locale-prefixed og:image
  // (`/<locale>/golf-courses/opengraph-image?<hash>`), and every one of them
  // ends on the unprefixed `/golf-courses/opengraph-image/`, which the
  // middleware rewrites to locale `en`: en by next-intl's as-needed 307,
  // th/ja/ko/zh by the untranslated-route 301 (the translated-routes
  // allowlist lists the hub PAGE, not this child). No page under /golf-courses/
  // hand-builds a URL to this card. If a locale's allowlist ever gains
  // '/golf-courses/opengraph-image', add that locale here in the same commit,
  // or its hub card 404s.
  return [{ locale: 'en' }]
}

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
