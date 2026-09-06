/**
 * Legacy WordPress blog post slugs that lived at root level.
 * These are now redirected to /blog/{slug}/ via next.config.js
 * and excluded from locale handling in middleware.ts
 */
exports.LEGACY_BLOG_SLUGS = [
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
]

/**
 * Legacy blog posts RETIRED into a section page. Each slug here is 301d
 * (permanent 308 from next.config.js) to its destination from BOTH the
 * WordPress root URL (/{slug}/) and the Next.js URL (/blog/{slug}/), so the
 * root form does not chain through /blog/ first. Retired slugs stay in
 * LEGACY_BLOG_SLUGS so middleware keeps skipping locale handling for them.
 *
 * TRAP: config redirects match BEFORE the filesystem, so a post listed here is
 * unreachable even if its blog_posts row is set back to published. Delete the
 * entry here (and the redirectTests entries in scripts/smoke-test.ts) if a
 * post is ever revived.
 *
 * fun-activities-in-bangkok (+ its WordPress duplicate -2): a 2024 generic
 * listicle (floating markets, cooking classes, Muay Thai) that ranked ~p18 for
 * "activities in bangkok" with 0 mobile clicks on ~900 impressions over 90
 * days to 2026-09-04, while /activities/ is the page built for that intent.
 * Consolidated 2026-09-05.
 */
exports.RETIRED_BLOG_REDIRECTS = {
  'fun-activities-in-bangkok': '/activities/',
  'fun-activities-in-bangkok-2': '/activities/',
}
