import type { SeoPageType, SeoPage } from '@/types/seo-pages'
import { activityOccasionPages } from '@/data/activity-occasions'
import { faqPages } from '@/data/faq-pages'
import { hotelConciergePages } from '@/data/hotel-pages'
import { priceGuidePages } from '@/data/price-guide-pages'
import { explainerPages } from '@/data/explainer-pages'
import { bestOfListiclePages } from '@/data/best-of-listicle-pages'

// Static data lookup (no DB dependency)
// When seo_pages table is created in Supabase, swap these to DB queries

export const PAGE_DATA_MAP: Partial<Record<SeoPageType, SeoPage[]>> = {
  activity_occasion: activityOccasionPages,
  faq: faqPages,
  hotel_concierge: hotelConciergePages,
  price_guide: priceGuidePages,
  explainer: explainerPages,
  best_of_listicle: bestOfListiclePages,
}

/**
 * Canonical route-prefix → page-type map for the six SEO sections
 * (app/[locale]/{prefix}/[slug]). Single source of truth — consumers:
 * - app/[locale]/guide/[slug]/page.tsx (related-link label resolution)
 * - scripts/validate-internal-links.ts (CI cross-link guard)
 * Add new SEO sections HERE (plus PAGE_DATA_MAP above) so every consumer
 * picks them up; a section missing from this map is invisible to the
 * validator and renders fallback labels.
 */
export const ROUTE_PREFIX_TO_TYPE: Record<string, SeoPageType> = {
  faq: 'faq',
  guide: 'explainer',
  cost: 'price_guide',
  best: 'best_of_listicle',
  activities: 'activity_occasion',
  hotels: 'hotel_concierge',
}

export async function getAllSeoPageSlugs(
  pageType: SeoPageType,
  locale: string = 'en'
): Promise<string[]> {
  const pages = PAGE_DATA_MAP[pageType]
  if (!pages) return []
  return pages
    .filter((p) => p.status === 'published' && p.locale === locale)
    .map((p) => p.slug)
}

/**
 * Slug + per-entry edit date for the sitemap's <lastmod>. EN only: the
 * sitemap lists the EN canonical URL (translations ride along as hreflang
 * alternates), so the EN entry's updated_at is the one that dates the URL.
 * updated_at values are hand-maintained ISO literals in the data files —
 * NEVER a build-time new Date(), which would churn <lastmod> every deploy
 * (see the `reviewed` comment in app/sitemap.ts).
 */
export async function getAllSeoPageSlugsWithDates(
  pageType: SeoPageType
): Promise<{ slug: string; updated_at: string }[]> {
  const pages = PAGE_DATA_MAP[pageType]
  if (!pages) return []
  return pages
    .filter((p) => p.status === 'published' && p.locale === 'en')
    .map((p) => ({ slug: p.slug, updated_at: p.updated_at }))
}

export async function getSeoPageBySlug(
  slug: string,
  pageType: SeoPageType,
  locale: string = 'en'
): Promise<SeoPage | null> {
  const pages = PAGE_DATA_MAP[pageType]
  if (!pages) return null
  const page = pages.find(
    (p) => p.slug === slug && p.status === 'published' && p.locale === locale
  )
  return page || null
}

export async function getSeoPagesByType(
  pageType: SeoPageType,
  locale: string = 'en'
): Promise<SeoPage[]> {
  const pages = PAGE_DATA_MAP[pageType]
  if (!pages) return []
  return pages.filter((p) => p.status === 'published' && p.locale === locale)
}

/**
 * All (locale, slug) pairs that have published content for this page type.
 * Use in generateStaticParams so only translated locale×slug combos are built —
 * untranslated locale URLs are 301-redirected by the middleware instead.
 */
export async function getAllSeoPageParams(
  pageType: SeoPageType
): Promise<{ locale: string; slug: string }[]> {
  const pages = PAGE_DATA_MAP[pageType]
  if (!pages) return []
  return pages
    .filter((p) => p.status === 'published')
    .map((p) => ({ locale: p.locale, slug: p.slug }))
}
