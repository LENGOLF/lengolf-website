/**
 * Legacy WordPress blog post slugs that lived at root level.
 * These are redirected to /blog/{slug}/ via next.config.js, which is the
 * ONLY consumer of this list (it requires the .js twin; keep both files
 * identical). middleware.ts stopped reading it in f557df7 (2026-02-22):
 * locale handling for /blog/ is now slug-accurate via BLOG_TRANSLATED_SLUGS
 * in lib/translated-routes.ts.
 */
export const LEGACY_BLOG_SLUGS = [
  'bangkok-golf-centre-vs-lengolf',
  'bangkok-rainy-season-indoor-golf',
  'corporate-team-building-bangkok-golf-simulator',
  'couple-activities-in-bangkok',
  'exploring-bangkok-with-kids',
  'exploring-golf-in-bangkok',
  'fairway-golf-city-club-vs-lengolf',
  'finding-your-perfect-bangkok-retreat',
  'first-time-golf-simulator-beginners-guide',
  'fix-your-golf-swing-bangkok',
  'fun-activities-in-bangkok',
  'fun-activities-in-bangkok-2',
  'golf-lessons-in-bangkok',
  'golf-point-center-vs-lengolf',
  'golf-simulator-in-bangkok',
  'guide-to-the-best-driving-ranges-in-bangkok',
  'learn-to-golf-here-in-bangkok',
  'lengolf-and-front9-bangkoks-premier-indoor-golf-venues',
  'mastering-the-golf-driving-range',
  'planning-the-perfect-thailand-retreat',
  'plan-your-family-trip-to-bangkok',
  'romantic-things-to-do-in-bangkok-for-couples',
  'setting-up-and-maintaining-an-indoor-golf-course',
  'skygolf-club-vs-lengolf',
  'topgolf-bangkok-vs-lengolf',
  'ultimate-guide-to-golf-courses-in-bangkok',
  'what-to-do-in-bangkok',
] as const

/**
 * Legacy blog posts RETIRED into a section page. Each slug here is
 * permanently redirected (308, `permanent: true` in next.config.js) to its
 * destination from BOTH the WordPress root URL (/{slug}/) and the Next.js URL
 * (/blog/{slug}/), so the root form does not chain through /blog/ first.
 * Retired slugs also stay listed in LEGACY_BLOG_SLUGS as the inventory of
 * every WordPress root slug; that has no runtime effect, because
 * next.config.js filters them out of the generic rule and nothing else reads
 * the list.
 *
 * TRAP: config redirects match BEFORE the filesystem, so a post listed here is
 * unreachable even if its blog_posts row is set back to published. Delete the
 * entry here (and the redirectTests entries in scripts/smoke-test.ts) if a
 * post is ever revived.
 *
 * fun-activities-in-bangkok (+ its WordPress duplicate -2): a 2024 generic
 * listicle (floating markets, cooking classes, Muay Thai) that averaged
 * position ~18 across its queries (its best-known query, "activities in
 * bangkok", sat at ~22) with 0 mobile/tablet clicks on ~900 impressions over
 * the 90 days to 2026-09-04, while /activities/ is the page built for that
 * intent.
 * Consolidated 2026-09-05.
 */
export const RETIRED_BLOG_REDIRECTS: Readonly<Record<string, string>> = {
  'fun-activities-in-bangkok': '/activities/',
  'fun-activities-in-bangkok-2': '/activities/',
}
