import { MetadataRoute } from 'next'
import { SITE_URL, CONTENT_LAST_UPDATED } from '@/lib/constants'
import { getAlternates } from '@/lib/translated-routes'
import { getPostSlugsWithDates, getPostLocalesMap } from '@/lib/blog'
import { getAllLocationSlugs } from '@/lib/locations'
import { getAllSeoPageSlugs } from '@/lib/seo-pages'
import { REGION_META, getAllCourseParams } from '@/lib/golf-courses'
import {
  getComparisonPairs,
  pairSlug,
  getStationSlugs,
  getAirportSlugs,
  getPriceTierSlugs,
} from '@/lib/golf-courses-derived'
import { USE_CASES } from '@/data/golf-courses-use-cases'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Stable "last reviewed" date for content without a real per-item edit date.
  // Using a constant (not `new Date()`) keeps <lastmod> meaningful — it changes only
  // when a human bumps CONTENT_LAST_UPDATED, not on every ISR rebuild. Blog posts are
  // the one source with a genuine DB updated_at, so they use it; SEO pages are static
  // TS data whose `updated_at` is a build-time `new Date()`, so they use the constant
  // too (trusting it would reintroduce the per-deploy churn this rewrite removes).
  const reviewed = CONTENT_LAST_UPDATED

  const [
    blogEntries,
    locationSlugs,
    activitySlugs,
    faqSlugs,
    hotelSlugs,
    costSlugs,
    explainerSlugs,
    bestOfSlugs,
    courseParams,
    comparisonPairs,
    postLocalesMap,
  ] = await Promise.all([
    getPostSlugsWithDates(),
    getAllLocationSlugs(),
    getAllSeoPageSlugs('activity_occasion'),
    getAllSeoPageSlugs('faq'),
    getAllSeoPageSlugs('hotel_concierge'),
    getAllSeoPageSlugs('price_guide'),
    getAllSeoPageSlugs('explainer'),
    getAllSeoPageSlugs('best_of_listicle'),
    getAllCourseParams(),
    getComparisonPairs(),
    getPostLocalesMap(),
  ])

  // Pages with translations — hreflang alternates sourced from translated-routes registry
  const translatedPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: reviewed, changeFrequency: 'weekly', priority: 1.0, alternates: { languages: getAlternates('/') } },
    { url: `${SITE_URL}/golf/`, lastModified: reviewed, changeFrequency: 'weekly', priority: 0.9, alternates: { languages: getAlternates('/golf/') } },
    { url: `${SITE_URL}/events/`, lastModified: reviewed, changeFrequency: 'weekly', priority: 0.9, alternates: { languages: getAlternates('/events/') } },
    { url: `${SITE_URL}/golf-club-rental/`, lastModified: reviewed, changeFrequency: 'weekly', priority: 0.8, alternates: { languages: getAlternates('/golf-club-rental/') } },
    { url: `${SITE_URL}/golf-course-club-rental/`, lastModified: reviewed, changeFrequency: 'weekly', priority: 0.8, alternates: { languages: getAlternates('/golf-course-club-rental/') } },
    { url: `${SITE_URL}/lessons/`, lastModified: reviewed, changeFrequency: 'weekly', priority: 0.9, alternates: { languages: getAlternates('/lessons/') } },
    { url: `${SITE_URL}/about-us/`, lastModified: reviewed, changeFrequency: 'monthly', priority: 0.7, alternates: { languages: getAlternates('/about-us/') } },
    { url: `${SITE_URL}/blog/`, lastModified: reviewed, changeFrequency: 'weekly', priority: 0.8, alternates: { languages: getAlternates('/blog/') } },
    { url: `${SITE_URL}/menu/`, lastModified: reviewed, changeFrequency: 'monthly', priority: 0.7, alternates: { languages: getAlternates('/menu/') } },
    { url: `${SITE_URL}/faq/`, lastModified: reviewed, changeFrequency: 'monthly', priority: 0.7, alternates: { languages: getAlternates('/faq/') } },
  ]

  // Hub / index pages for SEO section groups
  const hubPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/activities/`, lastModified: reviewed, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/golf-in-thailand-guide/`, lastModified: reviewed, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/hotels/`, lastModified: reviewed, changeFrequency: 'weekly', priority: 0.8 },
  ]

  // English-only pages (no Thai content yet)
  const englishOnlyPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/corporate-golf-packages/`, lastModified: reviewed, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/privacy-policy/`, lastModified: reviewed, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms-of-service/`, lastModified: reviewed, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/golf-course-club-rental-agreement/`, lastModified: reviewed, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Blog posts — the one source with a genuine DB edit date.
  const blogPages: MetadataRoute.Sitemap = blogEntries.map((p) => {
    const locales = postLocalesMap[p.slug] ?? ['en']
    const languages = Object.fromEntries(
      locales.map((l) => [
        l,
        l === 'en' ? `${SITE_URL}/blog/${p.slug}/` : `${SITE_URL}/${l}/blog/${p.slug}/`,
      ])
    )
    return {
      url: `${SITE_URL}/blog/${p.slug}/`,
      lastModified: p.updated_at || p.published_at || reviewed,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      alternates: { languages },
    }
  })

  const locationPages: MetadataRoute.Sitemap = locationSlugs.map((slug) => ({
    url: `${SITE_URL}/location/${slug}/`,
    lastModified: reviewed,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  const activityPages: MetadataRoute.Sitemap = activitySlugs.map((slug) => {
    // Emit hreflang alternates only for activities with translations
    // (registered in lib/translated-routes.ts) — EN-only pages stay plain.
    // Replaces a hand-maintained languages map that hardcoded a lone
    // self-referential `en` plus a commented-out `th` TODO: it advertised an
    // alternates cluster of one and could not track the registry.
    const languages = getAlternates(`/activities/${slug}/`)
    return {
      url: `${SITE_URL}/activities/${slug}/`,
      lastModified: reviewed,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      ...(Object.keys(languages).length > 1 ? { alternates: { languages } } : {}),
    }
  })

  const faqPageEntries: MetadataRoute.Sitemap = faqSlugs.map((slug) => {
    // Emit hreflang alternates only for FAQs with translations
    // (registered in lib/translated-routes.ts) — EN-only FAQs stay plain.
    const languages = getAlternates(`/faq/${slug}/`)
    return {
      url: `${SITE_URL}/faq/${slug}/`,
      lastModified: reviewed,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      ...(Object.keys(languages).length > 1 ? { alternates: { languages } } : {}),
    }
  })

  const hotelPages: MetadataRoute.Sitemap = hotelSlugs.map((slug) => {
    const languages = getAlternates(`/hotels/${slug}/`)
    return {
      url: `${SITE_URL}/hotels/${slug}/`,
      lastModified: reviewed,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      ...(Object.keys(languages).length > 1 ? { alternates: { languages } } : {}),
    }
  })

  const costPages: MetadataRoute.Sitemap = costSlugs.map((slug) => {
    const languages = getAlternates(`/cost/${slug}/`)
    return {
      url: `${SITE_URL}/cost/${slug}/`,
      lastModified: reviewed,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      ...(Object.keys(languages).length > 1 ? { alternates: { languages } } : {}),
    }
  })

  const explainerPageEntries: MetadataRoute.Sitemap = explainerSlugs.map((slug) => {
    // Emit hreflang alternates only for guides with translations
    // (registered in lib/translated-routes.ts) — EN-only guides stay plain.
    const languages = getAlternates(`/guide/${slug}/`)
    return {
      url: `${SITE_URL}/guide/${slug}/`,
      lastModified: reviewed,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      ...(Object.keys(languages).length > 1 ? { alternates: { languages } } : {}),
    }
  })

  const bestOfPageEntries: MetadataRoute.Sitemap = bestOfSlugs.map((slug) => {
    const languages = getAlternates(`/best/${slug}/`)
    return {
      url: `${SITE_URL}/best/${slug}/`,
      lastModified: reviewed,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      ...(Object.keys(languages).length > 1 ? { alternates: { languages } } : {}),
    }
  })

  // ── Golf course section ──────────────────────────────────────────────────────
  // Emit hreflang alternates only when the hub has translations
  // (registered in lib/translated-routes.ts) — mirrors the region-hub loop
  // below and the on-page getAlternates condition in
  // app/[locale]/golf-courses/page.tsx.
  const golfCoursesHubLanguages = getAlternates('/golf-courses/')
  const golfCoursesHub: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/golf-courses/`,
      lastModified: reviewed,
      changeFrequency: 'weekly',
      priority: 0.8,
      ...(Object.keys(golfCoursesHubLanguages).length > 1
        ? { alternates: { languages: golfCoursesHubLanguages } }
        : {}),
    },
  ]

  const golfRegionPages: MetadataRoute.Sitemap = Object.keys(REGION_META).map((region) => {
    // Emit hreflang alternates only for hubs with translations
    // (registered in lib/translated-routes.ts) — EN-only hubs stay plain.
    const languages = getAlternates(`/golf-courses/${region}/`)
    return {
      url: `${SITE_URL}/golf-courses/${region}/`,
      lastModified: reviewed,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      ...(Object.keys(languages).length > 1 ? { alternates: { languages } } : {}),
    }
  })

  const golfCoursePages: MetadataRoute.Sitemap = courseParams.map(({ region, slug }) => {
    // Emit hreflang alternates only for course details with translations
    // (registered in lib/translated-routes.ts — the 3-course TH pilot);
    // EN-only courses stay plain. Mirrors the region-hub loop above and the
    // on-page getAlternates condition in
    // app/[locale]/golf-courses/[region]/[slug]/page.tsx, so sitemap and
    // on-page hreflang cannot contradict each other.
    const languages = getAlternates(`/golf-courses/${region}/${slug}/`)
    return {
      url: `${SITE_URL}/golf-courses/${region}/${slug}/`,
      lastModified: reviewed,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      ...(Object.keys(languages).length > 1 ? { alternates: { languages } } : {}),
    }
  })

  // ── Programmatic-SEO course pages (workstream A) ────────────────────────────
  const golfComparisonPages: MetadataRoute.Sitemap = comparisonPairs.map((p) => ({
    url: `${SITE_URL}/golf-courses/compare/${p.region}/${pairSlug(p.slugA, p.slugB)}/`,
    lastModified: reviewed,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const golfNearStationPages: MetadataRoute.Sitemap = getStationSlugs().map((station) => ({
    url: `${SITE_URL}/golf-courses/near/${station}/`,
    lastModified: reviewed,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const golfNearAirportPages: MetadataRoute.Sitemap = getAirportSlugs().map((airport) => ({
    url: `${SITE_URL}/golf-courses/near/${airport}/`,
    lastModified: reviewed,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const golfPriceTierPages: MetadataRoute.Sitemap = getPriceTierSlugs().map((tier) => {
    // Emit hreflang alternates only for tiers with translations
    // (registered in lib/translated-routes.ts) — EN-only tiers stay plain.
    // Mirrors the region-hub and FAQ entries above; without this the tier
    // pages' on-page hreflang would contradict the sitemap.
    const languages = getAlternates(`/golf-courses/under/${tier}/`)
    return {
      url: `${SITE_URL}/golf-courses/under/${tier}/`,
      lastModified: reviewed,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      ...(Object.keys(languages).length > 1 ? { alternates: { languages } } : {}),
    }
  })

  const golfBestForPages: MetadataRoute.Sitemap = USE_CASES.map((useCase) => ({
    url: `${SITE_URL}/golf-courses/best-for/${useCase}/`,
    lastModified: reviewed,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    ...translatedPages,
    ...hubPages,
    ...englishOnlyPages,
    ...blogPages,
    ...locationPages,
    ...activityPages,
    ...faqPageEntries,
    ...hotelPages,
    ...costPages,
    ...explainerPageEntries,
    ...bestOfPageEntries,
    ...golfCoursesHub,
    ...golfRegionPages,
    ...golfCoursePages,
    ...golfComparisonPages,
    ...golfNearStationPages,
    ...golfNearAirportPages,
    ...golfPriceTierPages,
    ...golfBestForPages,
  ]
}
