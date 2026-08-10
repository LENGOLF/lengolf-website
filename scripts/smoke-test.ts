#!/usr/bin/env tsx

/**
 * Smoke tests for lengolf-website CI pipeline.
 * Hits key routes on a running Next.js server and verifies:
 *   A) Pages return 200 with correct layout (catches middleware/routing breaks)
 *      Covered routes: core pages, best-of listicles, rent-golf-clubs (5 locales),
 *      golf-in-thailand-guide, activities hub, hotels hub, /guide/[slug] (explainer),
 *      /faq/[slug], /hotels/[slug] (hotel concierge), /activities/[slug]
 *   B) WordPress redirects return 301 with correct Location (protects SEO)
 *   C) Critical external links resolve (booking system, LINE, storage assets)
 *   D) SEO elements are present (title, meta description, canonical, JSON-LD, lang)
 *      Includes golf-in-thailand-guide, /guide/[slug], /faq/[slug]
 *   E) Untranslated Thai routes redirect to English (301)
 *   F) English pages work with NEXT_LOCALE=th cookie (no redirect loop / no 404)
 *      Includes golf-in-thailand-guide, /guide/, /faq/, /hotels/, /activities/
 *   G) WordPress admin paths return 404 (not redirect)
 *   H) LLM / AI discoverability (llms.txt is served as text, robots.txt names AI
 *      crawlers, and the LocalBusiness opening-hours schema is consistent)
 *   I) Translated-guide/FAQ registry consistency: the '/guide/...' and
 *      '/faq/...' allowlists in lib/translated-routes.ts must exactly match
 *      the locale-tagged entries in data/explainer-pages.ts and
 *      data/faq-pages.ts respectively (drift ships unreachable translations
 *      or hreflang links to 404s) — pure import check, no server needed
 *   J) Translated region-hub registry consistency (same idea, for
 *      '/golf-courses/<region>' vs data/golf-courses-i18n.ts)
 *  J2) Translated price-tier registry consistency
 *  J3) Translated course-detail registry consistency (same idea, for
 *      '/golf-courses/<region>/<slug>' vs COURSE_DETAIL_I18N in
 *      data/golf-courses-i18n.ts)
 *   K) Data-driven internal-link liveness: every related_slugs path outside
 *      the statically-validated SEO prefixes is fetched and must not 404
 *   L) Blog translated-slug registry liveness: every path registered in
 *      data/blog-translated-slugs.ts must serve 200 (catches the data file
 *      running ahead of the DB, which dynamicParams=false turns into a 404)
 *  L2) Course-detail translated registry liveness: every registered
 *      '/golf-courses/<region>/<slug>' translation must serve 200 (the
 *      dynamicParams=false hard-404 guard, like L)
 *  L3) Region-hub translated registry liveness: every registered
 *      '/golf-courses/<region>' translation must serve 200 with
 *      <main id="main-content"> (L2's guard, one level up the hub tree)
 *  L4) FAQ translated registry liveness: every registered '/faq/<slug>'
 *      translation must serve 200 with <main id="main-content"> and no
 *      unresolved {{token}} (the FAQ route never interpolates facts)
 *   M) Wayfinding copy: BTS Chidlom is Exit 4, across both the DB-driven
 *      /location/* pages and the repo's JA/KO/ZH + EN wayfinding strings
 *   N) Region-hub course-count agreement: both ICU plural branches of
 *      GolfCourseRegion.metaDescription render with the noun agreeing
 *
 * Usage: tsx scripts/smoke-test.ts [base-url]
 * Default: http://localhost:3000
 *
 * Zero dependencies beyond tsx (already a devDep) + Node.js built-in fetch.
 */

// Mark as a module so top-level declarations don't collide with other
// scripts under tsconfig.scripts.json (a file with no static imports is
// otherwise a global script to the compiler).
export {};

const BASE = process.argv[2] || "http://localhost:3000";

// ── Test definitions ────────────────────────────────────────────────

interface RouteTest {
  path: string;
  expectedStatus: number[];
  contentMarker?: string; // must appear in body
  contentAbsent?: string; // must NOT appear in body
}

interface RedirectTest {
  path: string;
  expectedStatus: number;
  expectedLocation: string;
}

interface LinkTest {
  url: string;
  label: string;
}

interface SeoTest {
  path: string;
  locale: "en" | "th" | "ja" | "ko" | "zh";
}

interface NotFoundTest {
  path: string;
  label: string;
}

// A) Route smoke tests
const routeTests: RouteTest[] = [
  // EN pages
  {
    path: "/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/lessons/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/events/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/corporate-golf-packages/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/about-us/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/blog/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-club-rental/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-course-club-rental/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/golf-club-rental/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/golf-course-club-rental/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/menu/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/privacy-policy/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/terms-of-service/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // TH pages
  {
    path: "/th/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/golf/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/lessons/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/events/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/about-us/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/blog/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/menu/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // FAQ hub page (EN + TH) — entity statement / directions must render
  {
    path: "/faq/",
    expectedStatus: [200],
    contentMarker: "Unit 407",
  },
  {
    path: "/th/faq/",
    expectedStatus: [200],
    contentMarker: "ยูนิต 407",
  },
  // Blog post detail (catches Supabase query errors on dynamic routes)
  {
    path: "/blog/golf-lessons-in-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Localized blog (pilot: rainy-season post translated into ko/ja/zh)
  {
    path: "/ko/blog/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/blog/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/blog/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/blog/bangkok-rainy-season-indoor-golf/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/blog/golf-simulator-in-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/blog/first-time-golf-simulator-beginners-guide/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/blog/golf-lessons-in-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/blog/corporate-team-building-bangkok-golf-simulator/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/blog/learn-to-golf-here-in-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/blog/couple-activities-in-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // SEO hub pages
  {
    path: "/activities/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-in-thailand-guide/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/hotels/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Best-of listicle pages
  {
    path: "/best/best-team-building-activities-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/best/best-corporate-event-venues-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // JA pages (Home/Golf/Lessons/Events/AboutUs/ClubRental/CourseClubRental translated in ja.json)
  {
    path: "/ja/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/golf/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/lessons/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/events/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/about-us/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/golf-club-rental/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/golf-course-club-rental/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/menu/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // KO pages (bespoke landing at '/', plus translated Golf/Lessons/Events/AboutUs/ClubRental/CourseClubRental)
  {
    path: "/ko/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/golf/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/lessons/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/events/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/about-us/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/golf-club-rental/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/golf-course-club-rental/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/menu/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // ZH pages (bespoke landing at '/', plus translated Golf/Lessons/Events/AboutUs/ClubRental/CourseClubRental)
  {
    path: "/zh/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/golf/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/lessons/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/events/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/about-us/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/golf-club-rental/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/golf-course-club-rental/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/menu/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Guide (explainer) pages — spot-check original + new golf-travel slugs
  {
    path: "/guide/what-is-a-golf-simulator/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/guide/best-time-play-golf-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/guide/golf-club-baggage-fees-airlines-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/guide/best-golf-simulators-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/guide/bring-golf-clubs-thailand-or-rent/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // New EN guide (screen golf — Korean-style simulator golf)
  // contentAbsent '{{' guards fact-token interpolation completeness (lib/site-facts.ts):
  // an unresolved {{token}} must never reach rendered HTML (price literals are token-resolved).
  {
    path: "/guide/screen-golf-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  // New EN guide (golf attire / dress code — fills a prior dead-link content gap)
  {
    path: "/guide/what-to-wear-golf-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Translated JA guides (data/explainer-pages.ts locale:'ja' + ja allowlist entries)
  {
    path: "/ja/guide/bring-golf-clubs-thailand-or-rent/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  // Translated KO guides (data/explainer-pages.ts locale:'ko' + ko allowlist entries)
  {
    path: "/ko/guide/bring-golf-clubs-thailand-or-rent/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/guide/golf-club-baggage-fees-airlines-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/guide/golf-lessons-bangkok-coaches/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/renting-golf-clubs-thai-golf-courses/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/guide/screen-golf-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/round-of-golf-cost-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/guide/green-fees-bangkok-golf-courses/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/guide/how-to-book-golf-tee-times-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/guide/golf-club-baggage-fees-airlines-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/guide/renting-golf-clubs-thai-golf-courses/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/golf-lessons-bangkok-coaches/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/screen-golf-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/round-of-golf-cost-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/guide/green-fees-bangkok-golf-courses/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/guide/how-to-book-golf-tee-times-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Translated ZH guides (data/explainer-pages.ts locale:'zh' + zh allowlist entries)
  {
    path: "/zh/guide/bring-golf-clubs-thailand-or-rent/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/golf-club-baggage-fees-airlines-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/guide/renting-golf-clubs-thai-golf-courses/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/screen-golf-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/golf-lessons-bangkok-coaches/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/round-of-golf-cost-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/green-fees-bangkok-golf-courses/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/how-to-book-golf-tee-times-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  // Auto-translated guide batch (ja/ko/zh/th)
  {
    path: "/ja/guide/best-golf-simulators-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/best-golf-simulators-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/best-golf-simulators-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/best-golf-simulators-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/what-is-a-golf-simulator/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/what-is-a-golf-simulator/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/what-is-a-golf-simulator/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/what-is-a-golf-simulator/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/is-indoor-golf-realistic/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/is-indoor-golf-realistic/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/is-indoor-golf-realistic/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/is-indoor-golf-realistic/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/golf-simulator-for-non-golfers-guide/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/golf-simulator-for-non-golfers-guide/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/golf-simulator-for-non-golfers-guide/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/golf-simulator-for-non-golfers-guide/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/golf-simulator-vs-real-course-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/golf-simulator-vs-real-course-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/golf-simulator-vs-real-course-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/golf-simulator-vs-real-course-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/green-fees-bangkok-golf-courses/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Auto-translated guide batch (ja/ko/zh/th)
  {
    path: "/ja/guide/corporate-golf-events-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/corporate-golf-events-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/corporate-golf-events-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/corporate-golf-events-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/best-time-play-golf-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/best-time-play-golf-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/best-time-play-golf-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/best-time-play-golf-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/nikanti-golf-club-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/nikanti-golf-club-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/nikanti-golf-club-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/nikanti-golf-club-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/thailand-golf-trip-cost/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/thailand-golf-trip-cost/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/thailand-golf-trip-cost/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/thailand-golf-trip-cost/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/alpine-golf-club-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/alpine-golf-club-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/alpine-golf-club-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/alpine-golf-club-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/thai-country-club-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/thai-country-club-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/thai-country-club-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/thai-country-club-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/best-golf-courses-near-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/best-golf-courses-near-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/best-golf-courses-near-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/best-golf-courses-near-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/banyan-golf-club-hua-hin/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/banyan-golf-club-hua-hin/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/banyan-golf-club-hua-hin/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/banyan-golf-club-hua-hin/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  // Auto-translated guide batch (ja/ko/zh/th)
  {
    path: "/ja/guide/best-airlines-fly-golf-clubs-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/best-airlines-fly-golf-clubs-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/best-airlines-fly-golf-clubs-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/best-airlines-fly-golf-clubs-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/bangkok-bts-guide-golfers/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/bangkok-bts-guide-golfers/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/bangkok-bts-guide-golfers/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/bangkok-bts-guide-golfers/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/bangkok-to-hua-hin-golf-transport/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/bangkok-to-hua-hin-golf-transport/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/bangkok-to-hua-hin-golf-transport/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/bangkok-to-hua-hin-golf-transport/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/bangkok-hotels-to-golf-courses-transport/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/bangkok-hotels-to-golf-courses-transport/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/bangkok-hotels-to-golf-courses-transport/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/bangkok-hotels-to-golf-courses-transport/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/best-bangkok-hotels-golfers/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/best-bangkok-hotels-golfers/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/best-bangkok-hotels-golfers/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/best-bangkok-hotels-golfers/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/best-golf-courses-phuket/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/best-golf-courses-phuket/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/best-golf-courses-phuket/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/best-golf-courses-phuket/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/black-mountain-golf-club-hua-hin/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/black-mountain-golf-club-hua-hin/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/black-mountain-golf-club-hua-hin/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/black-mountain-golf-club-hua-hin/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/first-time-golf-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/first-time-golf-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/first-time-golf-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/first-time-golf-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/don-mueang-airport-to-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/don-mueang-airport-to-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/don-mueang-airport-to-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/don-mueang-airport-to-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/golf-bangkok-rainy-season/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/golf-bangkok-rainy-season/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/golf-bangkok-rainy-season/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/golf-bangkok-rainy-season/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/golf-club-rental-bangkok-guide/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/golf-club-rental-bangkok-guide/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/golf-club-rental-bangkok-guide/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/golf-club-rental-bangkok-guide/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/golf-courses-chiang-mai/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/golf-courses-chiang-mai/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/golf-courses-chiang-mai/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/golf-courses-chiang-mai/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/golf-hotels-near-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/golf-hotels-near-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/golf-hotels-near-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/golf-hotels-near-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/golf-thailand-beginners/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/golf-thailand-beginners/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/golf-thailand-beginners/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/golf-thailand-beginners/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/golf-tournament-packages-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/golf-tournament-packages-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/golf-tournament-packages-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/golf-tournament-packages-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/golf-weather-bangkok-by-month/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/golf-weather-bangkok-by-month/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/golf-weather-bangkok-by-month/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/golf-weather-bangkok-by-month/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/golfnow-thailand-review/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/golfnow-thailand-review/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/golfnow-thailand-review/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/golfnow-thailand-review/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/hotels-near-hua-hin-golf-courses/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/hotels-near-hua-hin-golf-courses/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/hotels-near-hua-hin-golf-courses/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/hotels-near-hua-hin-golf-courses/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/how-to-pack-golf-clubs-flight-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/how-to-pack-golf-clubs-flight-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/how-to-pack-golf-clubs-flight-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/how-to-pack-golf-clubs-flight-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/is-thailand-good-for-golf/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/is-thailand-good-for-golf/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/is-thailand-good-for-golf/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/is-thailand-good-for-golf/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/suvarnabhumi-airport-to-bangkok-golf/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/suvarnabhumi-airport-to-bangkok-golf/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/suvarnabhumi-airport-to-bangkok-golf/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/suvarnabhumi-airport-to-bangkok-golf/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/thai-golf-course-etiquette/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/thai-golf-course-etiquette/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/thai-golf-course-etiquette/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/thai-golf-course-etiquette/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  // Auto-translated guide batch (ja/ko/zh/th)
  {
    path: "/ja/guide/solo-golf-trip-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/solo-golf-trip-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/solo-golf-trip-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/solo-golf-trip-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/thailand-vs-bali-vs-vietnam-golf-holiday/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/thailand-vs-bali-vs-vietnam-golf-holiday/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/thailand-vs-bali-vs-vietnam-golf-holiday/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/thailand-vs-bali-vs-vietnam-golf-holiday/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ja/guide/what-to-wear-golf-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/ko/guide/what-to-wear-golf-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/zh/guide/what-to-wear-golf-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/what-to-wear-golf-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  // FAQ pages — spot-check original + newly added slugs
  {
    path: "/faq/can-i-rent-golf-clubs-in-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/faq/can-you-bring-golf-clubs-as-checked-baggage-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/faq/thailand-visa-guide-golf-tourists/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/faq/how-many-golf-courses-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Translated TH FAQ pages (data/faq-pages.ts locale:'th' entries + th allowlist
  // entries in lib/translated-routes.ts). No contentAbsent '{{' guard — FAQ
  // rendering (app/[locale]/faq/[slug]/page.tsx) never runs interpolateFacts,
  // so these pages never carry fact tokens to begin with.
  {
    path: "/th/faq/can-i-rent-golf-clubs-in-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/faq/are-rental-golf-clubs-good-enough/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/faq/how-accurate-are-golf-simulators/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/faq/do-i-need-experience-to-play-golf-simulator/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/faq/can-beginners-play-golf-simulators/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/faq/how-long-does-simulator-golf-take/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/faq/best-way-to-learn-golf-in-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/faq/can-kids-play-golf-simulators/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // TH FAQ catch-up — brings TH from 8 to 14 translated FAQ pages.
  {
    path: "/th/faq/how-much-does-indoor-golf-cost-in-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/faq/can-you-play-golf-in-bangkok-when-it-rains/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/faq/should-i-bring-golf-clubs-to-thailand-or-rent/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/faq/cost-to-fly-with-golf-clubs-to-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/faq/worth-taking-golf-lessons-bangkok-holiday/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/faq/what-golf-clubs-available-rent-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // TH indoor-practice cluster (driving-range / indoor-venue query clusters)
  {
    path: "/th/faq/practice-golf-swing-without-driving-range-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/faq/what-to-wear-to-indoor-golf-bar/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/faq/best-time-of-day-golf-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Hotel concierge pages — spot-check a few slugs
  {
    path: "/hotels/things-to-do-near-grand-hyatt-erawan/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/hotels/things-to-do-near-intercontinental-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Activities detail pages — spot-check one slug
  {
    path: "/activities/rainy-day-activities-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Golf courses hub + region index pages
  {
    path: "/golf-courses/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/pattaya/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/hua-hin/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/phuket/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Translated region hubs (data/golf-courses-i18n.ts + ja/ko/zh allowlist entries)
  {
    path: "/ja/golf-courses/bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/golf-courses/bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/golf-courses/bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/golf-courses/phuket/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/golf-courses/phuket/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/golf-courses/phuket/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/golf-courses/pattaya/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/golf-courses/pattaya/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/golf-courses/pattaya/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/golf-courses/hua-hin/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/golf-courses/hua-hin/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/golf-courses/hua-hin/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/golf-courses/chiang-mai/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/golf-courses/chiang-mai/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/golf-courses/chiang-mai/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Translated TH golf-courses hub (GolfCourseHub namespace + '/golf-courses'
  // th allowlist entry in lib/translated-routes.ts) — was a 301-to-EN until
  // the hub gained a Thai translation.
  {
    path: "/th/golf-courses/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Translated JA golf-courses hub (GolfCourseHub ja namespace +
  // '/golf-courses' ja allowlist entry) — was a 301-to-EN until the hub
  // gained a Japanese translation.
  {
    path: "/ja/golf-courses/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Translated KO + ZH golf-courses hubs (structural-parity batch: the
  // GolfCourseHub namespace landed in messages/{ko,zh}.json and the hub was
  // added to both allowlists). All four locales now serve the hub, so the
  // former "ko must 301" canary in thaiRedirectTests is gone.
  {
    path: "/ko/golf-courses/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/golf-courses/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Translated JA/KO/ZH /faq/ hubs (structural-parity batch: ja/ko/zh content
  // blocks added to data/faq-hub.ts CONTENT + '/faq' added to each allowlist).
  // The per-question FAQ pages were already translated in these locales; the
  // hub above them was still English.
  {
    path: "/ja/faq/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/faq/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/faq/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Translated TH region hubs (data/golf-courses-i18n.ts + th allowlist entries)
  {
    path: "/th/golf-courses/bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/golf-courses/phuket/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/golf-courses/pattaya/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/golf-courses/hua-hin/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/golf-courses/chiang-mai/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Translated TH price-tier pages (data/price-tiers.ts PRICE_TIER_I18N + th
  // allowlist entries) — all 5 tiers are translated in this batch.
  {
    path: "/th/golf-courses/under/1500-baht/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/golf-courses/under/2500-baht/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/golf-courses/under/3500-baht/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/golf-courses/under/5000-baht/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/th/golf-courses/under/7500-baht/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Translated course-detail pages: one TH canary here; FULL coverage of
  // every registered course-detail translation (status + content marker) is
  // registry-derived in section L2, so new batches are covered with zero
  // routeTests edits. All other course details must keep 301ing (see the
  // untranslated-course canary in redirectTests, which must name a slug
  // absent from COURSE_DETAIL_I18N).
  {
    path: "/th/golf-courses/bangkok/sai-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // One JA course-detail canary (full registry-derived coverage in L2).
  {
    path: "/ja/golf-courses/bangkok/sai-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // One KO and one ZH course-detail canary (full registry-derived coverage in
  // L2). These two locales previously had ZERO course-detail translations
  // while their 14 region hubs were live, so every course link on a ko/zh hub
  // 301'd out of the locale; the batch that added them closed that funnel.
  {
    path: "/ko/golf-courses/bangkok/sai-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/golf-courses/bangkok/sai-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // TH guide catch-up batch — brings TH to parity with ja/ko/zh at 46 guides.
  // contentAbsent guards unresolved {{fact tokens}} (4 of these entries use them).
  {
    path: "/th/guide/golf-club-baggage-fees-airlines-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/bring-golf-clubs-thailand-or-rent/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/how-to-book-golf-tee-times-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/renting-golf-clubs-thai-golf-courses/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/screen-golf-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  {
    path: "/th/guide/round-of-golf-cost-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
    contentAbsent: "{{",
  },
  // Translated JA/KO/ZH price-tier pages (data/price-tiers.ts PRICE_TIER_I18N
  // + per-locale allowlist entries) — all 5 tiers per locale in this batch.
  {
    path: "/ja/golf-courses/under/1500-baht/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/golf-courses/under/2500-baht/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/golf-courses/under/3500-baht/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/golf-courses/under/5000-baht/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/golf-courses/under/7500-baht/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/golf-courses/under/1500-baht/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/golf-courses/under/2500-baht/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/golf-courses/under/3500-baht/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/golf-courses/under/5000-baht/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/golf-courses/under/7500-baht/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/golf-courses/under/1500-baht/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/golf-courses/under/2500-baht/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/golf-courses/under/3500-baht/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/golf-courses/under/5000-baht/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/golf-courses/under/7500-baht/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Translated JA/KO/ZH FAQ pages (data/faq-pages.ts entries with those
  // locales + per-locale allowlist entries) — the cost/rental/lessons/
  // simulator cluster; section I enforces registry <-> data sync.
  {
    path: "/ja/faq/how-much-does-indoor-golf-cost-in-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/faq/can-i-rent-golf-clubs-in-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/faq/are-rental-golf-clubs-good-enough/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/faq/best-way-to-learn-golf-in-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/faq/how-accurate-are-golf-simulators/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/faq/can-beginners-play-golf-simulators/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/faq/how-much-does-indoor-golf-cost-in-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/faq/can-i-rent-golf-clubs-in-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/faq/are-rental-golf-clubs-good-enough/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/faq/best-way-to-learn-golf-in-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/faq/how-accurate-are-golf-simulators/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/faq/can-beginners-play-golf-simulators/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/faq/how-much-does-indoor-golf-cost-in-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/faq/can-i-rent-golf-clubs-in-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/faq/are-rental-golf-clubs-good-enough/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/faq/best-way-to-learn-golf-in-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/faq/how-accurate-are-golf-simulators/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/faq/can-beginners-play-golf-simulators/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Batch 2: the rental/lessons FAQ cluster (JA/KO/ZH). The three rental-
  // category entries also render the course-rental CTA banner.
  {
    path: "/ja/faq/can-you-play-golf-in-bangkok-when-it-rains/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/faq/do-i-need-experience-to-play-golf-simulator/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/faq/should-i-bring-golf-clubs-to-thailand-or-rent/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/faq/cost-to-fly-with-golf-clubs-to-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/faq/worth-taking-golf-lessons-bangkok-holiday/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ja/faq/what-golf-clubs-available-rent-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/faq/can-you-play-golf-in-bangkok-when-it-rains/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/faq/do-i-need-experience-to-play-golf-simulator/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/faq/should-i-bring-golf-clubs-to-thailand-or-rent/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/faq/cost-to-fly-with-golf-clubs-to-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/faq/worth-taking-golf-lessons-bangkok-holiday/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/ko/faq/what-golf-clubs-available-rent-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/faq/can-you-play-golf-in-bangkok-when-it-rains/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/faq/do-i-need-experience-to-play-golf-simulator/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/faq/should-i-bring-golf-clubs-to-thailand-or-rent/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/faq/cost-to-fly-with-golf-clubs-to-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/faq/worth-taking-golf-lessons-bangkok-holiday/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/zh/faq/what-golf-clubs-available-rent-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // BTS_STATIONS.areaSlug targets — the near/[station] pages link
  // `/location/${areaSlug}` and nothing else validates those slugs against
  // the DB-driven location pages (validate:links excludes /location; CI
  // section K only scans data/*.ts related_slugs). A renamed or unpublished
  // location page would otherwise ship as a hard 404 from 4 station pages.
  {
    path: "/location/indoor-golf-asok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/location/indoor-golf-chidlom/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/location/indoor-golf-phrom-phong/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/location/indoor-golf-thong-lo/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Generated OG cards (lib/og-card.tsx) — the course JSON-LD references the
  // detail-page card as its schema image, so a broken OG route silently
  // breaks structured data on all 149 pages without these checks.
  {
    path: "/golf-courses/opengraph-image/",
    expectedStatus: [200],
  },
  {
    path: "/golf-courses/bangkok/opengraph-image/",
    expectedStatus: [200],
  },
  {
    path: "/golf-courses/bangkok/alpine-golf-club/opengraph-image/",
    expectedStatus: [200],
  },
  // Golf course detail pages — spot-check one Bangkok + two Pattaya + two Hua Hin + two Phuket
  {
    path: "/golf-courses/bangkok/nikanti-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/bangkok/navatanee-golf-course/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/bangkok/bangkok-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/bangkok/green-valley-country-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/bangkok/siam-country-club-bangkok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/bangkok/riverdale-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/bangkok/lotus-valley-golf-resort/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/bangkok/the-legacy-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/bangkok/royal-lakeside-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/bangkok/rachakram-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/bangkok/bangpoo-golf-sports-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/bangkok/muang-ake-golf-course/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/bangkok/northern-rangsit-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/pattaya/bangpra-international-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/pattaya/wangjuntr-golf-park/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/pattaya/kabinburi-sportclub/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/khao-yai/rancho-charnvee-country-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/isan/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/isan/dancoon-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/isan/singha-park-khon-kaen/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/isan/victory-park-golf-country-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/isan/royal-creek-golf-club-udon-thani/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/isan/ubolratana-dam-golf-course/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/southern-thailand/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/southern-thailand/southern-hills-golf-country-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/southern-thailand/hat-yai-resort-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/southern-thailand/sri-trang-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/koh-samui/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/koh-samui/santiburi-samui-country-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/koh-samui/rajjaprabha-dam-golf-course/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/chiang-rai/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/chiang-rai/santiburi-country-club-chiang-rai/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/chiang-rai/happy-city-golf-resort/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/north-misc/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/north-misc/mae-moh-golf-course/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/khao-lak/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/khao-lak/katathong-golf-resort/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/krabi/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/krabi/pakasai-country-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/pattaya/siam-country-club-old-course/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/pattaya/laem-chabang-international/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/pattaya/phoenix-gold-golf-club-pattaya/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/pattaya/eastern-star-country-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/pattaya/khao-kheow-country-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/pattaya/the-emerald-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/pattaya/siam-country-club-waterside/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/pattaya/greenwood-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/pattaya/treasure-hill-golf-country-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/pattaya/st-andrews-2000/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/hua-hin/black-mountain-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/hua-hin/pineapple-valley-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/hua-hin/royal-hua-hin-golf-course/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/hua-hin/lake-view-resort-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/hua-hin/kaeng-krachan-country-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/hua-hin/sea-pines-golf-resort/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/hua-hin/korea-golf-club-hua-hin/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/hua-hin/sawang-resort-golf-course/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/bangkok/royal-dusit-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/khao-yai/royal-hills-golf-resort/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/phuket/red-mountain-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/phuket/blue-canyon-canyon-course/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/khao-yai/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/khao-yai/kirimaya-golf-course/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/chiang-mai/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/chiang-mai/alpine-golf-resort-chiang-mai/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/chiang-mai/chiangmai-highlands-golf/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/chiang-mai/royal-chiang-mai-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/chiang-mai/gassan-khuntan-golf-resort/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/chiang-mai/north-hill-chiang-mai/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/khao-yai/khao-yai-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/khao-yai/life-privilege-country-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Re-regioned Bangkok → Isan; the old URL's 308 is asserted in redirectTests.
  {
    path: "/golf-courses/isan/kumlung-ake-golf-course/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Course-detail hrefs are resolved PER COURSE by courseDetailHref: a locale
  // prefix only where that course is translated. This shipped wrong twice, in
  // opposite directions, and both times invisibly — hence a pinned pair.
  //
  // ja HAS alpine translated, so the roster link must be prefixed. The marker
  // is a course-detail path, not the region hub (/ja/golf-courses/bangkok/ is
  // a legitimate hub link and would match either way).
  {
    path: "/ja/golf-courses/bangkok/",
    expectedStatus: [200],
    contentMarker: '/ja/golf-courses/bangkok/alpine-golf-club/',
  },
  // ko/zh now have the same 15 course-detail translations as th/ja, so the
  // NEGATIVE half of this invariant can no longer be "ko prefixes nothing" —
  // it has to name a course that is genuinely absent from COURSE_DETAIL_I18N.
  // Keeping only the positive half would leave an always-prefix regression
  // (the exact bug PR #88 fixed in HubMapExplorer) completely unguarded.
  //
  // INVARIANT, not a fixed slug: lakewood-country-club must stay OUT of
  // COURSE_DETAIL_I18N. If a future batch translates it, move these two
  // assertions to another untranslated Bangkok course rather than deleting
  // them — same rule the untranslated-course redirect canary carries.
  {
    path: "/ko/golf-courses/bangkok/",
    expectedStatus: [200],
    contentMarker: '/ko/golf-courses/bangkok/sai-golf-club/',
  },
  {
    path: "/ko/golf-courses/bangkok/",
    expectedStatus: [200],
    contentAbsent: '/ko/golf-courses/bangkok/lakewood-country-club',
  },
  {
    path: "/zh/golf-courses/bangkok/",
    expectedStatus: [200],
    contentMarker: '/zh/golf-courses/bangkok/sai-golf-club/',
  },
  {
    path: "/zh/golf-courses/bangkok/",
    expectedStatus: [200],
    contentAbsent: '/zh/golf-courses/bangkok/lakewood-country-club',
  },
  // Same invariant on the top-level hub, whose map (HubMapExplorer) links
  // every one of the 149 courses. The region-hub pair above only proves the
  // per-region roster; an always-prefix regression puts 149 wrong hrefs on
  // THIS page, and the four '/xx/golf-courses/' routeTests above assert only
  // <main id="main-content">, so they all still pass. Separate entries rather
  // than extra fields: RouteTest carries one marker each, and the <main>
  // assertion on those entries is still worth keeping.
  {
    path: "/ja/golf-courses/",
    expectedStatus: [200],
    contentMarker: '/ja/golf-courses/bangkok/alpine-golf-club/',
  },
  {
    path: "/ko/golf-courses/",
    expectedStatus: [200],
    contentMarker: '/ko/golf-courses/bangkok/alpine-golf-club/',
  },
  {
    path: "/ko/golf-courses/",
    expectedStatus: [200],
    contentAbsent: '/ko/golf-courses/bangkok/lakewood-country-club',
  },
  {
    path: "/zh/golf-courses/",
    expectedStatus: [200],
    contentMarker: '/zh/golf-courses/bangkok/alpine-golf-club/',
  },
  {
    path: "/zh/golf-courses/",
    expectedStatus: [200],
    contentAbsent: '/zh/golf-courses/bangkok/lakewood-country-club',
  },
  // Same invariant on the RoundupList surface (price tiers SSG th/ja/ko/zh).
  // The marker is a COURSE-DETAIL path, not the region-hub prefix: this tier
  // page renders no region-hub link at all today, so '/ko/golf-courses/bangkok/'
  // passed vacuously and would have kept passing under an always-prefix
  // regression that only touches course hrefs.
  // ko now has sai translated, so this flips from negative to positive and
  // becomes the mirror of the ja assertion below. No untranslated-course
  // negative is pinned on THIS surface on purpose: the tier roster is a
  // DERIVED top 12 (getCoursesUnderPrice(meta.thb, 12)), so naming a specific
  // untranslated course here would break on any green-fee correction that
  // reshuffles the ranking — the same fragility that retired four indexed
  // /compare/ URLs in PR #88. The always-prefix negative is asserted on the
  // two hub surfaces above instead, which render every course unranked.
  {
    path: "/ko/golf-courses/under/1500-baht/",
    expectedStatus: [200],
    contentMarker: '/ko/golf-courses/bangkok/sai-golf-club/',
  },
  // The positive half, which the tier surface was missing entirely: ja HAS sai
  // translated, so its link on the tier roster must be prefixed. Without this,
  // a never-prefix regression leaves every price-tier assertion green.
  {
    path: "/ja/golf-courses/under/1500-baht/",
    expectedStatus: [200],
    contentMarker: '/ja/golf-courses/bangkok/sai-golf-club/',
  },
  // /golf-courses/compare/<region>/<a>-vs-<b>/ — a whole page TYPE that had no
  // 200 assertion anywhere: the only compare paths in this file were the four
  // 308s for pairs the re-regions retired, so a render throw or a routing break
  // on every surviving compare page would have gone unnoticed. bangkok's top 3
  // is the stable one to pin (the retired pairs were all khao-yai/kanchanaburi,
  // whose top-3 moved). If a fee edit reshuffles bangkok's top 3, this pair
  // stops being generated and dynamicParams=false 404s it — which is the same
  // signal the redirect entries exist for, and worth failing loudly on.
  {
    path: "/golf-courses/compare/bangkok/alpine-golf-club-vs-royal-gems-golf-sports-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Re-regioned Bangkok → Khao Yai / Kanchanaburi (same 90-minute test).
  {
    path: "/golf-courses/khao-yai/toscana-valley-country-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/kanchanaburi/nichigo-resort-country-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/phuket/mission-hills-phuket/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/khao-yai/mountain-creek-golf-resort/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/khao-yai/bonanza-golf-country-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/khao-yai/forest-hills-country-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/khao-yai/friendship-meadows-country-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Kanchanaburi region
  {
    path: "/golf-courses/kanchanaburi/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/kanchanaburi/river-kwai-golf-country-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/kanchanaburi/grand-prix-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/kanchanaburi/dragon-hills-golf-country-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/kanchanaburi/royal-ratchaburi-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/kanchanaburi/woo-sung-castle-hill/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/kanchanaburi/evergreen-hills-golf-club/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/kanchanaburi/blue-sapphire-golf-resort/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // Programmatic-SEO course pages (workstream A). Comparison routes (~42 pages)
  // are verified by `npm run build` static generation; we spot-check the
  // three deterministic page types here.
  {
    path: "/golf-courses/near/asok/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/near/suvarnabhumi-airport/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/near/don-mueang-airport/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/under/2500-baht/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  {
    path: "/golf-courses/best-for/beginners/",
    expectedStatus: [200],
    contentMarker: '<main id="main-content">',
  },
  // API routes (no Google Maps key in CI, so 500 is acceptable — just not 404)
  { path: "/api/aqi/", expectedStatus: [200, 500, 502] },
];

// B) Redirect tests (representative sample of 60+ WordPress redirects)
const redirectTests: RedirectTest[] = [
  // Test with trailing slashes — trailingSlash:true causes a 308 hop first,
  // so we test the path that actually triggers the next.config.js redirect.
  // Next.js uses 308 for permanent: true redirects.
  // WordPress blog post → /blog/ prefix
  {
    path: "/bangkok-golf-centre-vs-lengolf/",
    expectedStatus: 308,
    expectedLocation: "/blog/bangkok-golf-centre-vs-lengolf/",
  },
  {
    path: "/topgolf-bangkok-vs-lengolf/",
    expectedStatus: 308,
    expectedLocation: "/blog/topgolf-bangkok-vs-lengolf/",
  },
  // Tag/category archives → /blog/
  { path: "/tag/bangkok/", expectedStatus: 308, expectedLocation: "/blog/" },
  { path: "/category/golf/", expectedStatus: 308, expectedLocation: "/blog/" },
  // Old pages
  { path: "/tournaments/", expectedStatus: 308, expectedLocation: "/events/" },
  // Location area taxonomy
  {
    path: "/location-area/chidlom/",
    expectedStatus: 308,
    expectedLocation: "/location/indoor-golf-chidlom/",
  },
  // Page type taxonomy
  {
    path: "/page-type/golf-lessons/",
    expectedStatus: 308,
    expectedLocation: "/lessons/",
  },
  // GSC 404 fixes
  {
    path: "/indoor-golf-ploenchit/",
    expectedStatus: 308,
    expectedLocation: "/location/indoor-golf-ploenchit/",
  },
  { path: "/lesson/", expectedStatus: 308, expectedLocation: "/lessons/" },
  {
    path: "/golf-lessons-ari/",
    expectedStatus: 308,
    expectedLocation: "/location/golf-lessons-ari/",
  },
  // GSC 404 fixes: root-level corporate-events pages -> /location/ prefix
  {
    path: "/corporate-events-thong-lo/",
    expectedStatus: 308,
    expectedLocation: "/location/corporate-events-thong-lo/",
  },
  {
    path: "/corporate-events-ratchadamri/",
    expectedStatus: 308,
    expectedLocation: "/location/corporate-events-ratchadamri/",
  },
  // GSC 404 fixes: content crawled under the wrong section prefix
  // (/faq/<guide-slug> and /guide/<faq-slug>) -> correct prefix
  {
    path: "/faq/what-to-wear-golf-thailand/",
    expectedStatus: 308,
    expectedLocation: "/guide/what-to-wear-golf-thailand/",
  },
  {
    path: "/guide/do-you-need-caddie-thailand-golf/",
    expectedStatus: 308,
    expectedLocation: "/faq/do-you-need-caddie-thailand-golf/",
  },
  // GSC 404 golf-near redirects (trailing slash required — trailingSlash:true fires 308 before middleware)
  {
    path: "/golf-near-thong-lo/",
    expectedStatus: 308,
    expectedLocation: "/location/golf-near-thong-lo/",
  },
  {
    path: "/golf-near-silom/",
    expectedStatus: 308,
    expectedLocation: "/location/golf-near-silom/",
  },
  {
    path: "/golf-near-sukhumvit/",
    expectedStatus: 308,
    expectedLocation: "/location/golf-near-sukhumvit/",
  },
  {
    path: "/golf-near-phaya-thai/",
    expectedStatus: 308,
    expectedLocation: "/location/golf-near-phaya-thai/",
  },
  {
    path: "/indoor-golf-thong-lo/",
    expectedStatus: 308,
    expectedLocation: "/location/indoor-golf-thong-lo/",
  },
  {
    path: "/corporate-events-asok/",
    expectedStatus: 308,
    expectedLocation: "/location/corporate-events-asok/",
  },
  {
    path: "/golf-near-ari/",
    expectedStatus: 308,
    expectedLocation: "/location/golf-near-ari/",
  },
  {
    path: "/golf-near-ekkamai/",
    expectedStatus: 308,
    expectedLocation: "/location/golf-near-ekkamai/",
  },
  // Re-regioned course redirect: Bangkok → Khao Yai
  {
    path: "/golf-courses/bangkok/life-privilege-country-club/",
    expectedStatus: 308,
    expectedLocation: "/golf-courses/khao-yai/life-privilege-country-club/",
  },
  // Re-regioned course redirect: Bangkok → Isan (Kumlung-Ake is in Loei).
  // The old URL was live and indexed, so this guards the SEO equity; the new
  // URL's 200 is asserted in routeTests.
  {
    path: "/golf-courses/bangkok/kumlung-ake-golf-course/",
    expectedStatus: 308,
    expectedLocation: "/golf-courses/isan/kumlung-ake-golf-course/",
  },
  {
    path: "/golf-courses/bangkok/toscana-valley-country-club/",
    expectedStatus: 308,
    expectedLocation: "/golf-courses/khao-yai/toscana-valley-country-club/",
  },
  {
    path: "/golf-courses/bangkok/nichigo-resort-country-club/",
    expectedStatus: 308,
    expectedLocation: "/golf-courses/kanchanaburi/nichigo-resort-country-club/",
  },

  // Compare pairs retired by those two re-regions. The pair set is derived
  // from each region's top 3 and the route is dynamicParams=false, so without
  // these the URLs hard-404 — and they are in the sitemap.
  {
    path: "/golf-courses/compare/khao-yai/life-privilege-country-club-vs-rancho-charnvee-country-club/",
    expectedStatus: 308,
    expectedLocation: "/golf-courses/khao-yai/",
  },
  {
    path: "/golf-courses/compare/khao-yai/khao-yai-golf-club-vs-rancho-charnvee-country-club/",
    expectedStatus: 308,
    expectedLocation: "/golf-courses/khao-yai/",
  },
  {
    path: "/golf-courses/compare/kanchanaburi/blue-sapphire-golf-resort-vs-grand-prix-golf-club/",
    expectedStatus: 308,
    expectedLocation: "/golf-courses/kanchanaburi/",
  },
  {
    path: "/golf-courses/compare/kanchanaburi/blue-sapphire-golf-resort-vs-dragon-hills-golf-country-club/",
    expectedStatus: 308,
    expectedLocation: "/golf-courses/kanchanaburi/",
  },
  // Rental-page consolidation: rent-golf-clubs-bangkok → golf-course-club-rental
  // (was a duplicate; consolidated to fix self-cannibalisation in organic search)
  {
    path: "/rent-golf-clubs-bangkok/",
    expectedStatus: 308,
    expectedLocation: "/golf-course-club-rental/",
  },
  {
    path: "/th/rent-golf-clubs-bangkok/",
    expectedStatus: 308,
    expectedLocation: "/th/golf-course-club-rental/",
  },
  {
    path: "/ko/rent-golf-clubs-bangkok/",
    expectedStatus: 308,
    expectedLocation: "/ko/golf-course-club-rental/",
  },
  {
    path: "/ja/rent-golf-clubs-bangkok/",
    expectedStatus: 308,
    expectedLocation: "/ja/golf-course-club-rental/",
  },
  {
    path: "/zh/rent-golf-clubs-bangkok/",
    expectedStatus: 308,
    expectedLocation: "/zh/golf-course-club-rental/",
  },
];

// B2) Slash-less inbound links must still land on the destination.
//
// Measured, not assumed. next.config.js registers BOTH slash variants of every
// redirect, on the stated theory that the no-slash entry avoids a 2-hop. It
// does not: with `trailingSlash: true`, Next's slash normalisation runs BEFORE
// the redirects table, so the no-slash SOURCE never matches. Probed against a
// live server:
//
//   /golf-courses/bangkok/kumlung-ake-golf-course
//     → 308 /golf-courses/bangkok/kumlung-ake-golf-course/   (normalisation)
//     → 308 /golf-courses/isan/kumlung-ake-golf-course/      (the redirect)
//
// i.e. still two hops, and the configured destination on the no-slash entry is
// never read. The trailing-slash entries are the live ones; the no-slash ones
// are dead config.
//
// These assertions deliberately test the OUTCOME (follow to the end) rather
// than either hop, so they hold whichever way the dead entries are cleaned up,
// and they fail if someone deletes the trailing-slash entry believing the
// no-slash one covers both — the exact mistake the stale comment invites.
const redirectChainTests: { path: string; finalPath: string }[] = [
  {
    path: "/golf-courses/bangkok/kumlung-ake-golf-course",
    finalPath: "/golf-courses/isan/kumlung-ake-golf-course/",
  },
  {
    path: "/golf-courses/compare/khao-yai/khao-yai-golf-club-vs-rancho-charnvee-country-club",
    finalPath: "/golf-courses/khao-yai/",
  },
];

// C) Critical external link checks
const linkTests: LinkTest[] = [
  { url: "https://booking.len.golf/", label: "Booking system" },
  { url: "https://lin.ee/uxQpIXn", label: "LINE link" },
  // Supabase Storage assets (spot-check)
  {
    url: "https://bisimqmtxjsptehhqpeg.supabase.co/storage/v1/object/public/website-assets/branding/logo.png",
    label: "Logo asset",
  },
  {
    url: "https://bisimqmtxjsptehhqpeg.supabase.co/storage/v1/object/public/website-assets/venue/venue-bar-01.jpg",
    label: "Venue image",
  },
];

// D) SEO sanity checks
const seoTests: SeoTest[] = [
  { path: "/", locale: "en" },
  { path: "/golf/", locale: "en" },
  { path: "/blog/", locale: "en" },
  { path: "/th/", locale: "th" },
  { path: "/th/golf/", locale: "th" },
  { path: "/ja/", locale: "ja" },
  { path: "/ja/golf/", locale: "ja" },
  { path: "/ja/lessons/", locale: "ja" },
  { path: "/ja/golf-course-club-rental/", locale: "ja" },
  { path: "/ko/", locale: "ko" },
  { path: "/ko/golf/", locale: "ko" },
  { path: "/ko/lessons/", locale: "ko" },
  { path: "/zh/", locale: "zh" },
  { path: "/zh/golf/", locale: "zh" },
  { path: "/zh/lessons/", locale: "zh" },
  { path: "/corporate-golf-packages/", locale: "en" },
  { path: "/golf-in-thailand-guide/", locale: "en" },
  { path: "/guide/what-is-a-golf-simulator/", locale: "en" },
  { path: "/faq/can-i-rent-golf-clubs-in-bangkok/", locale: "en" },
  { path: "/faq/", locale: "en" },
  { path: "/th/faq/", locale: "th" },
  { path: "/menu/", locale: "en" },
  { path: "/th/menu/", locale: "th" },
  { path: "/ko/menu/", locale: "ko" },
  { path: "/ja/menu/", locale: "ja" },
  { path: "/zh/menu/", locale: "zh" },
];

// E) Thai redirect tests (untranslated Thai routes → 301 to English)
interface ThaiRedirectTest {
  path: string;
  expectedLocation: string;
  label: string;
}

const thaiRedirectTests: ThaiRedirectTest[] = [
  {
    path: "/th/privacy-policy/",
    expectedLocation: "/privacy-policy/",
    label: "Untranslated privacy policy",
  },
  {
    path: "/th/terms-of-service/",
    expectedLocation: "/terms-of-service/",
    label: "Untranslated terms of service",
  },
  // NOTE: the former "untranslated KO golf-courses hub must 301" test is gone
  // on purpose — the structural-parity batch added the GolfCourseHub namespace
  // to messages/{ko,zh}.json, so all four locales now serve the hub and no
  // untranslated locale remains to probe. Same reasoning as the removed
  // price-tier and TH-guide probes below. The hub URLs' 200s are asserted in
  // routeTests instead.
  // Regression guard — non-whitelisted /ja/, /ko/, /zh/ paths must still 301 to EN so the
  // middleware allowlist (lib/translated-routes.ts) continues to work. Particularly
  // important for ko/zh where the message files have populated (but English-stub)
  // namespaces that would render as mislabelled content without the allowlist.
  {
    path: "/ja/privacy-policy/",
    expectedLocation: "/privacy-policy/",
    label: "Untranslated JA privacy policy",
  },
  // Untranslated guide must still 301 to English. ja/ko/zh now have FULL guide
  // coverage, so the only locale with untranslated guides is th (the 8 guides
  // from PR #52 were never translated to Thai). These canaries must be guides
  // translated in ja/ko/zh but NOT th — if th ever gains them, pick others.
  // (golf-lessons-bangkok-coaches gained a th version, so this now uses
  // screen-golf-bangkok, still ja/ko/zh-only.)
  // NOTE: the former "untranslated TH guide must 301" probes are gone on
  // purpose — the TH catch-up batch translated the last 6 guides, so every
  // locale now has all 46 and no untranslated guide slug exists to probe.
  // The registry-consistency section (I) still guards allowlist ⇄ data in
  // both directions. (Same reasoning as the removed JA price-tier probe.)
  // Untranslated FAQ must still 301 to English. Only the 8 FAQ slugs in the
  // th.staticRoutes allowlist (lib/translated-routes.ts) may 200 under /th/faq/.
  // This canary is deliberately NOT one of those 8 — if it ever gains a TH
  // translation, pick another untranslated FAQ slug here instead of deleting
  // the guard (a previous batch went stale exactly this way).
  {
    // when-it-rains gained a TH translation in the catch-up batch; night-golf
    // is untranslated in every locale, so this guard stays valid for all four.
    path: "/th/faq/where-to-play-golf-at-night-in-bangkok/",
    expectedLocation: "/faq/where-to-play-golf-at-night-in-bangkok/",
    label:
      "Untranslated TH FAQ (only translated FAQ slugs may 200)",
  },
  // NOTE: the four "untranslated region hub must 301" probes (they used
  // koh-samui) are gone on purpose — the structural-parity batch translated
  // the last 9 regions, so all 14 in lib/golf-courses.ts REGIONS are
  // translated in all four locales and no untranslated region remains to
  // probe. Same reasoning as the removed price-tier and TH-guide probes.
  // Coverage did not shrink: section J still guards allowlist ⇄
  // REGION_HUB_I18N in both directions, section L3 fetches every registered
  // hub, and the near/best-for/compare canary below still proves the
  // middleware 301 works for genuinely EN-only /golf-courses/ sub-routes.
  // NOTE: the former "untranslated JA price tier must 301" test is gone on
  // purpose — every locale (th/ja/ko/zh) now has PRICE_TIER_I18N rows, so no
  // untranslated locale remains to probe. The price-tier registry-consistency
  // section still guards the allowlist ⇄ data-file sync in both directions.
  // Untranslated FAQ slugs must still 301 in the CJK locales. The registry
  // sections only compare allowlist ⇄ data; nothing else exercises the
  // middleware for /faq, so without these the allowlist could widen to an
  // untranslated slug and ship English content under a locale URL unnoticed.
  // (Replaces the price-tier negative probe removed above — every locale now
  // has price tiers, so no untranslated tier remains to test.)
  //
  // THE SLUG IS AN INVARIANT, NOT A CONSTANT — same trap as the
  // courseDetailHref negative assertion. These three probes used to point at
  // what-to-wear-to-indoor-golf-bar (ja), how-long-does-simulator-golf-take
  // (ko) and can-kids-play-golf-simulators (zh); the FAQ-completion batch
  // translated all three and every probe started 200ing. The fix is to
  // RE-ANCHOR, never to delete: dropping them leaves the /faq middleware
  // 301 with no negative coverage at all, so an allowlist that widened to an
  // untranslated slug would ship English under a locale URL unnoticed.
  //
  // where-to-play-golf-at-night-in-bangkok is the one FAQ untranslated in all
  // four locales, and deliberately so — it duplicates
  // where-play-golf-night-bangkok, which is canonical (2 inbound internal
  // links vs 0). If that duplicate is ever consolidated with a 301, or
  // translated, there is no untranslated FAQ left to probe and this block has
  // to go — say so in the commit rather than letting it silently 200.
  {
    path: "/ja/faq/where-to-play-golf-at-night-in-bangkok/",
    expectedLocation: "/faq/where-to-play-golf-at-night-in-bangkok/",
    label: "Untranslated JA FAQ (only translated slugs may 200)",
  },
  {
    path: "/ko/faq/where-to-play-golf-at-night-in-bangkok/",
    expectedLocation: "/faq/where-to-play-golf-at-night-in-bangkok/",
    label: "Untranslated KO FAQ (only translated slugs may 200)",
  },
  {
    path: "/zh/faq/where-to-play-golf-at-night-in-bangkok/",
    expectedLocation: "/faq/where-to-play-golf-at-night-in-bangkok/",
    label: "Untranslated ZH FAQ (only translated slugs may 200)",
  },
  // EN-only golf-course routes (near/best-for/compare) build no locale copies
  // (generateStaticParams emits locale: 'en' only) and have dynamicParams:false,
  // so the middleware 301 is the ONLY thing keeping their locale URLs from a
  // hard 404. This canary covers the mechanism for all three routes — if it
  // fails, the allowlist gained one of them without also emitting its params.
  {
    path: "/th/golf-courses/near/asok/",
    expectedLocation: "/golf-courses/near/asok/",
    label: "Untranslated TH near-station page (EN-only route must 301)",
  },
  // Course DETAIL pages build locale copies only for the triples in
  // COURSE_DETAIL_I18N (those 200 and are covered by section L2, which is
  // registry-derived). Every OTHER course detail must still 301 —
  // /th/golf-courses/bangkok/ 200s, but an untranslated 3-segment detail
  // below it may not. Canary for the [region]/[slug] locale restriction.
  //
  // INVARIANT, not a fixed slug: the canary course must be ABSENT from
  // COURSE_DETAIL_I18N. Re-check this when adding a translation batch —
  // alpine-golf-club was the canary until batch 3 registered it for th+ja,
  // which silently turned these two assertions from "must 301" into a
  // guaranteed CI failure. Do not pick a course you are about to translate.
  {
    path: "/th/golf-courses/bangkok/lakewood-country-club/",
    expectedLocation: "/golf-courses/bangkok/lakewood-country-club/",
    label: "Untranslated TH course detail (EN-only route must 301)",
  },
  {
    path: "/ja/golf-courses/bangkok/lakewood-country-club/",
    expectedLocation: "/golf-courses/bangkok/lakewood-country-club/",
    label: "Untranslated JA course detail (EN-only route must 301)",
  },
  // NOTE: the former "untranslated TH hotel-concierge page must 301" canary is
  // gone on purpose. It covered all four flat SEO families (/hotels, /cost,
  // /activities, /best) back when none of their prefixes were in
  // lib/translated-routes.ts. All four now ship in every locale, so there is
  // no untranslated page left in ANY of them to probe — the same reason the
  // price-tier and TH-guide probes above were removed.
  //
  // Coverage did not shrink. Section L5 asserts registry ⇄ data agreement in
  // BOTH directions for all four sections plus liveness of every registered
  // path, so an allowlist that widened past the data still fails. The
  // middleware-301 mechanism itself stays covered by the /faq, course-detail,
  // near-station and blog canaries below, all of which still have genuinely
  // untranslated targets.
  // Untranslated localized blog post must 301 to the English canonical — only
  // slugs in data/blog-translated-slugs.ts[locale] may 200 under /<locale>/blog/.
  // topgolf-bangkok-vs-lengolf is an EN-only post (never translated), so it is
  // the canary. Before the slug-accurate registry, the old coarse
  // '/blog/[slug]' pattern let these through to a 404 instead of redirecting;
  // pick another untranslated slug here if this one ever gains a translation.
  {
    path: "/ko/blog/topgolf-bangkok-vs-lengolf/",
    expectedLocation: "/blog/topgolf-bangkok-vs-lengolf/",
    label: "Untranslated KO blog post (only translated slugs may 200)",
  },
  {
    path: "/ja/blog/topgolf-bangkok-vs-lengolf/",
    expectedLocation: "/blog/topgolf-bangkok-vs-lengolf/",
    label: "Untranslated JA blog post (only translated slugs may 200)",
  },
  {
    path: "/ko/hotels/",
    expectedLocation: "/hotels/",
    label: "Untranslated KO hotels hub",
  },
  {
    path: "/ko/privacy-policy/",
    expectedLocation: "/privacy-policy/",
    label: "Untranslated KO privacy policy",
  },
  {
    path: "/zh/privacy-policy/",
    expectedLocation: "/privacy-policy/",
    label: "Untranslated ZH privacy policy",
  },
];

// F) Locale-cookie tests — English pages must work even with a NEXT_LOCALE
// cookie set (defaults to th; entries may override). Catches redirect loops
// and middleware bypass issues.
interface ThaiCookieTest {
  path: string;
  label: string;
  /** NEXT_LOCALE cookie value to send; defaults to "th". */
  cookie?: string;
}

const thaiCookieTests: ThaiCookieTest[] = [
  {
    path: "/blog/golf-lessons-in-bangkok/",
    label: "Blog post with Thai cookie",
  },
  {
    // Regression guard for the prod bug where a ko/ja cookie 307'd an
    // EN-only blog post to /<locale>/blog/<slug> → 404/500. The middleware
    // intl-redirect intercept must strip the cookie and serve the EN page,
    // because the slug is not in data/blog-translated-slugs.ts for that
    // locale. Must be an EN-only post (a translated one correctly 307s to
    // its /<locale>/ version).
    path: "/blog/topgolf-bangkok-vs-lengolf/",
    label: "EN-only blog post with KO cookie (no 404/redirect loop)",
    cookie: "ko",
  },
  {
    path: "/blog/topgolf-bangkok-vs-lengolf/",
    label: "EN-only blog post with JA cookie (no 404/redirect loop)",
    cookie: "ja",
  },
  { path: "/privacy-policy/", label: "Privacy policy with Thai cookie" },
  {
    path: "/golf-in-thailand-guide/",
    label: "Golf in Thailand guide with Thai cookie",
  },
  // NOTE: the former "guide (th-less) with Thai cookie" canary is gone on
  // purpose — every guide now has a TH translation, so no guide can stay
  // English under a th cookie. The FAQ canary below exercises the same
  // middleware path with a slug that remains untranslated everywhere.
  {
    // Must be an FAQ slug with NO th translation, so it stays English under a
    // th cookie (a th-translated FAQ correctly 307s to /th/ per next-intl
    // cookie behavior). when-it-rains gained a th version in the catch-up
    // batch; night-golf is untranslated in every locale.
    path: "/faq/where-to-play-golf-at-night-in-bangkok/",
    label: "FAQ page (th-less) with Thai cookie",
  },
  { path: "/hotels/", label: "Hotels hub with Thai cookie" },
  { path: "/activities/", label: "Activities hub with Thai cookie" },
];

// G) WordPress path 404 tests (prevent redirect regressions)
const notFoundTests: NotFoundTest[] = [
  { path: "/wp-admin/", label: "WordPress admin root" },
  { path: "/wp-admin/admin-ajax.php", label: "WordPress admin AJAX" },
  { path: "/wp-login.php", label: "WordPress login" },
  { path: "/xmlrpc.php", label: "WordPress XML-RPC" },
  { path: "/wp-json/", label: "WordPress JSON API root" },
  { path: "/wp-json/wp/v2/posts", label: "WordPress REST API endpoint" },
  { path: "/wp-includes/js/jquery/jquery.js", label: "WordPress includes" },
  // Golf course routes — unknown slugs must 404, not 500
  {
    path: "/golf-courses/bangkok/not-a-real-course/",
    label: "Golf course unknown slug → 404",
  },
  {
    path: "/golf-courses/not-a-real-region/",
    label: "Golf region unknown slug → 404",
  },
  // ISR dynamic routes: unknown params must 404, not 500. These 500'd on Vercel
  // before dynamicParams=false (an ISR page reaching notFound() on-demand).
  {
    path: "/location/not-a-real-location-xyz/",
    label: "Location unknown slug → 404 (not 500)",
  },
  {
    path: "/golf-courses/under/99999-baht/",
    label: "Golf price tier unknown → 404 (not 500)",
  },
  {
    path: "/golf-courses/near/not-a-real-station/",
    label: "Golf near-station unknown → 404 (not 500)",
  },
  {
    path: "/golf-courses/best-for/not-a-real-usecase/",
    label: "Golf best-for unknown → 404 (not 500)",
  },
];

// ── Runner ──────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures: string[] = [];

function pass(label: string) {
  passed++;
  console.log(`  \x1b[32m✓\x1b[0m ${label}`);
}

function fail(label: string, reason: string) {
  failed++;
  const msg = `${label} — ${reason}`;
  failures.push(msg);
  console.log(`  \x1b[31m✗\x1b[0m ${msg}`);
}

async function runRouteTests() {
  console.log("\n\x1b[1mA) Route tests\x1b[0m");
  for (const t of routeTests) {
    const label = `GET ${t.path}`;
    try {
      const res = await fetch(`${BASE}${t.path}`, { redirect: "follow" });
      const body = await res.text();

      // A redirected route test is a failure even when the destination is a
      // healthy 200: a locale route that 301s to English would otherwise
      // false-pass on the EN page's markup (observed against a server whose
      // route manifest predated newly registered locale slugs).
      const finalPath = new URL(res.url).pathname;
      if (finalPath !== t.path) {
        fail(
          label,
          `redirected to ${finalPath} — route tests must resolve directly`,
        );
        continue;
      }

      if (!t.expectedStatus.includes(res.status)) {
        fail(
          label,
          `expected ${t.expectedStatus.join("|")}, got ${res.status}`,
        );
        continue;
      }
      if (t.contentMarker && !body.includes(t.contentMarker)) {
        fail(label, `missing content marker: ${t.contentMarker}`);
        continue;
      }
      if (t.contentAbsent && body.includes(t.contentAbsent)) {
        fail(label, `unexpected content found: ${t.contentAbsent}`);
        continue;
      }
      pass(label);
    } catch (err) {
      fail(label, `fetch error: ${(err as Error).message}`);
    }
  }
}

async function runRedirectTests() {
  console.log("\n\x1b[1mB) Redirect tests\x1b[0m");
  for (const t of redirectTests) {
    const label = `${t.path} → ${t.expectedLocation}`;
    try {
      const res = await fetch(`${BASE}${t.path}`, { redirect: "manual" });
      const location = res.headers.get("location") || "";
      // Location can be absolute or relative — normalize to path
      let locationPath: string;
      try {
        locationPath = new URL(location).pathname;
      } catch {
        locationPath = location;
      }

      if (res.status !== t.expectedStatus) {
        fail(label, `expected ${t.expectedStatus}, got ${res.status}`);
        continue;
      }
      if (locationPath !== t.expectedLocation) {
        fail(
          label,
          `location: expected ${t.expectedLocation}, got ${locationPath}`,
        );
        continue;
      }
      pass(label);
    } catch (err) {
      fail(label, `fetch error: ${(err as Error).message}`);
    }
  }

  for (const t of redirectChainTests) {
    const label = `${t.path} (no trailing slash) ↠ ${t.finalPath}`;
    try {
      const res = await fetch(`${BASE}${t.path}`, { redirect: "follow" });
      const landed = new URL(res.url).pathname;
      if (res.status !== 200) {
        fail(label, `expected 200 at the end of the chain, got ${res.status}`);
      } else if (landed !== t.finalPath) {
        fail(
          label,
          `chain ended at ${landed}, expected ${t.finalPath} — a slash-less inbound link no longer reaches the destination (the TRAILING-SLASH source in next.config.js is the live one; the no-slash twin is dead config and cannot cover for it)`,
        );
      } else {
        pass(label);
      }
    } catch (err) {
      fail(label, `fetch error: ${(err as Error).message}`);
    }
  }
}

async function runLinkTests() {
  console.log("\n\x1b[1mC) Critical link checks\x1b[0m");
  for (const t of linkTests) {
    const label = `${t.label} (${t.url})`;
    try {
      const res = await fetch(t.url, {
        redirect: "follow",
        headers: { "User-Agent": "LENGOLF-SmokeTest/1.0" },
      });
      // Accept any 2xx or 3xx as "resolves" — we just need it to not be dead
      if (res.status >= 400) {
        fail(label, `status ${res.status}`);
        continue;
      }
      pass(label);
    } catch (err) {
      fail(label, `fetch error: ${(err as Error).message}`);
    }
  }
}

async function runSeoTests() {
  console.log("\n\x1b[1mD) SEO sanity checks\x1b[0m");
  for (const t of seoTests) {
    const label = `SEO ${t.path}`;
    try {
      const res = await fetch(`${BASE}${t.path}`, { redirect: "follow" });
      const body = await res.text();
      const issues: string[] = [];

      // <html lang="..."> matches expected locale
      const langMatch = body.match(/<html[^>]*\slang="([^"]*)"/);
      if (!langMatch) {
        issues.push("missing <html lang>");
      } else if (langMatch[1] !== t.locale) {
        issues.push(`lang="${langMatch[1]}", expected "${t.locale}"`);
      }

      // <title> exists and is non-empty, no "undefined" or "404"
      const titleMatch = body.match(/<title>([^<]*)<\/title>/);
      if (!titleMatch || !titleMatch[1].trim()) {
        issues.push("missing or empty <title>");
      } else if (/undefined|404|Page Not Found/i.test(titleMatch[1])) {
        issues.push(`bad title: "${titleMatch[1]}"`);
      }

      // <meta name="description"> exists
      if (!body.includes('name="description"')) {
        issues.push("missing meta description");
      }

      // canonical link exists with www.len.golf
      const canonicalMatch = body.match(
        /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/,
      );
      if (!canonicalMatch) {
        issues.push("missing canonical link");
      } else if (!canonicalMatch[1].includes("www.len.golf")) {
        issues.push(`canonical not using www.len.golf: ${canonicalMatch[1]}`);
      }

      // JSON-LD exists
      if (!body.includes("application/ld+json")) {
        issues.push("missing JSON-LD");
      }

      if (issues.length > 0) {
        fail(label, issues.join("; "));
      } else {
        pass(label);
      }
    } catch (err) {
      fail(label, `fetch error: ${(err as Error).message}`);
    }
  }
}

async function runThaiRedirectTests() {
  console.log("\n\x1b[1mE) Thai redirect tests\x1b[0m");
  for (const t of thaiRedirectTests) {
    const label = `${t.label}: ${t.path} → ${t.expectedLocation}`;
    try {
      const res = await fetch(`${BASE}${t.path}`, { redirect: "manual" });
      const location = res.headers.get("location") || "";
      let locationPath: string;
      try {
        locationPath = new URL(location).pathname;
      } catch {
        locationPath = location;
      }

      if (res.status !== 301) {
        fail(label, `expected 301, got ${res.status}`);
        continue;
      }
      if (locationPath !== t.expectedLocation) {
        fail(
          label,
          `location: expected ${t.expectedLocation}, got ${locationPath}`,
        );
        continue;
      }
      pass(label);
    } catch (err) {
      fail(label, `fetch error: ${(err as Error).message}`);
    }
  }
}

async function runThaiCookieTests() {
  console.log(
    "\n\x1b[1mF) Thai cookie tests (no redirect loop / no 404)\x1b[0m",
  );
  for (const t of thaiCookieTests) {
    const label = t.label;
    try {
      // Send a NEXT_LOCALE cookie — simulates a user who previously picked a
      // non-English locale (defaults to th; entries may override).
      const res = await fetch(`${BASE}${t.path}`, {
        redirect: "manual",
        headers: { Cookie: `NEXT_LOCALE=${t.cookie ?? "th"}` },
      });
      // Must NOT redirect (would cause loop) and must NOT 404 (middleware bypass)
      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("location") || "";
        fail(
          label,
          `unexpected redirect ${res.status} → ${location} (potential loop)`,
        );
        continue;
      }
      if (res.status === 404) {
        fail(label, `got 404 — intlMiddleware likely bypassed`);
        continue;
      }
      if (res.status !== 200) {
        fail(label, `expected 200, got ${res.status}`);
        continue;
      }
      pass(label);
    } catch (err) {
      fail(label, `fetch error: ${(err as Error).message}`);
    }
  }
}

async function runNotFoundTests() {
  console.log("\n\x1b[1mG) WordPress path 404 tests\x1b[0m");
  for (const t of notFoundTests) {
    const label = `${t.label} (${t.path})`;
    try {
      // Use redirect: 'follow' because trailingSlash:true causes 308 hops before 404
      const res = await fetch(`${BASE}${t.path}`, { redirect: "follow" });
      if (res.status !== 404) {
        fail(label, `expected 404, got ${res.status}`);
        continue;
      }
      pass(label);
    } catch (err) {
      fail(label, `fetch error: ${(err as Error).message}`);
    }
  }
}

async function runLlmDiscoverabilityTests() {
  console.log("\n\x1b[1mH) LLM / AI discoverability\x1b[0m");

  // 1) llms.txt is served as plain text with curated content (not intercepted by i18n middleware)
  try {
    const res = await fetch(`${BASE}/llms.txt`, { redirect: "manual" });
    const body = await res.text();
    const ct = res.headers.get("content-type") || "";
    const issues: string[] = [];
    if (res.status !== 200) issues.push(`expected 200, got ${res.status}`);
    if (!ct.includes("text/plain"))
      issues.push(`content-type not text/plain: "${ct}"`);
    if (!body.includes("# LENGOLF")) issues.push('missing "# LENGOLF" heading');
    if (!body.includes("/golf-club-rental/"))
      issues.push("missing key page link");
    // Guide titles/metas may carry {{price}} tokens (lib/site-facts.ts); every
    // surface that prints entry text must interpolate them — a literal '{{'
    // here means a consumer skipped interpolateFacts (this leaked once).
    if (body.includes("{{"))
      issues.push("unresolved '{{' fact token in output");
    if (issues.length > 0) fail("GET /llms.txt", issues.join("; "));
    else pass("GET /llms.txt (served as text, curated)");
  } catch (err) {
    fail("GET /llms.txt", `fetch error: ${(err as Error).message}`);
  }

  // 2) robots.txt explicitly names AI crawlers
  try {
    const res = await fetch(`${BASE}/robots.txt`, { redirect: "follow" });
    const body = await res.text();
    const issues: string[] = [];
    if (res.status !== 200) issues.push(`expected 200, got ${res.status}`);
    for (const bot of ["GPTBot", "PerplexityBot", "ClaudeBot"]) {
      if (!body.includes(bot)) issues.push(`missing ${bot}`);
    }
    if (issues.length > 0) fail("GET /robots.txt", issues.join("; "));
    else pass("GET /robots.txt (names AI crawlers)");
  } catch (err) {
    fail("GET /robots.txt", `fetch error: ${(err as Error).message}`);
  }

  // 3) LocalBusiness schema opening hours are consistent (regression guard: 09:00, not stale 10:00)
  try {
    const res = await fetch(`${BASE}/`, { redirect: "follow" });
    const body = await res.text();
    const issues: string[] = [];
    if (!body.includes('"opens":"09:00"'))
      issues.push('LocalBusiness schema missing "opens":"09:00"');
    if (body.includes('"opens":"10:00"'))
      issues.push('stale "opens":"10:00" still present');
    if (issues.length > 0)
      fail("LocalBusiness opening hours", issues.join("; "));
    else pass("LocalBusiness opening hours (09:00, consistent with site copy)");
  } catch (err) {
    fail(
      "LocalBusiness opening hours",
      `fetch error: ${(err as Error).message}`,
    );
  }

  // 4) Visible FAQ copy must match the corrected hours (no stale "10 AM" opening on the blog FAQ)
  try {
    const res = await fetch(`${BASE}/blog/`, { redirect: "follow" });
    const body = await res.text();
    if (body.includes("from 10 AM to 11 PM")) {
      fail(
        "Blog FAQ opening-hours copy",
        'stale "from 10 AM to 11 PM" still rendered',
      );
    } else if (!body.includes("from 9 AM to 11 PM")) {
      fail(
        "Blog FAQ opening-hours copy",
        'expected "from 9 AM to 11 PM" not found in blog FAQ',
      );
    } else {
      pass("Blog FAQ opening-hours copy (9 AM, matches schema)");
    }
  } catch (err) {
    fail(
      "Blog FAQ opening-hours copy",
      `fetch error: ${(err as Error).message}`,
    );
  }

  // 5) Sitemap must have no duplicate <loc> URLs (guards against duplicate slugs in any page-data source)
  try {
    const res = await fetch(`${BASE}/sitemap.xml`, { redirect: "follow" });
    const body = await res.text();
    const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const seen = new Set<string>();
    const dupes = new Set<string>();
    for (const loc of locs) {
      if (seen.has(loc)) dupes.add(loc);
      seen.add(loc);
    }
    if (dupes.size > 0) {
      fail(
        "Sitemap unique URLs",
        `${dupes.size} duplicate <loc>: ${[...dupes].slice(0, 3).join(", ")}`,
      );
    } else {
      pass(`Sitemap unique URLs (${locs.length} entries, no duplicates)`);
    }
  } catch (err) {
    fail("Sitemap unique URLs", `fetch error: ${(err as Error).message}`);
  }
}

// ── I) Translated-guide/FAQ registry consistency ─────────────────────
// The middleware allowlist (lib/translated-routes.ts) cannot import the
// content data (it's bundled into the edge middleware), so nothing at build
// time ties the two lists together. This check makes drift fail CI in both
// directions: a locale-tagged guide/FAQ missing from the registry would be
// built but 301'd away (translation silently unreachable); a registry entry
// without data would 200 through the middleware into a notFound() while
// hreflang/sitemap advertise the 404ing URL.

async function runRegistryConsistencyTests() {
  console.log("\n\x1b[1mI) Translated-guide/FAQ registry consistency\x1b[0m");
  const { explainerPages } = await import("../data/explainer-pages");
  const { getRegisteredGuidePaths, ALL_LOCALES } =
    await import("../lib/translated-routes");

  for (const locale of ALL_LOCALES) {
    if (locale === "en") continue;
    const fromData = new Set(
      explainerPages
        .filter((p) => p.locale === locale && p.status === "published")
        .map((p) => `/guide/${p.slug}`),
    );
    const fromRegistry = new Set(getRegisteredGuidePaths(locale));
    const missingInRegistry = [...fromData].filter((p) => !fromRegistry.has(p));
    const missingInData = [...fromRegistry].filter((p) => !fromData.has(p));

    if (missingInRegistry.length === 0 && missingInData.length === 0) {
      pass(
        `Registry ⇄ data in sync for '${locale}' (${fromData.size} translated guides)`,
      );
    } else {
      if (missingInRegistry.length > 0) {
        fail(
          `Registry missing '${locale}' guide(s)`,
          `${missingInRegistry.join(", ")} — add to ${locale}.staticRoutes in lib/translated-routes.ts or the translation is unreachable (middleware 301s it)`,
        );
      }
      if (missingInData.length > 0) {
        fail(
          `Registry lists '${locale}' guide(s) with no data`,
          `${missingInData.join(", ")} — remove from lib/translated-routes.ts or add a locale:'${locale}' entry in data/explainer-pages.ts (currently 404s while advertised in hreflang)`,
        );
      }
    }
  }

  // FAQ pages — same drift guard as the guide loop above, for data/faq-pages.ts
  // locale-tagged entries vs. the '/faq/...' allowlist entries in
  // lib/translated-routes.ts (getRegisteredFaqPaths).
  const { faqPages } = await import("../data/faq-pages");
  const { getRegisteredFaqPaths } = await import("../lib/translated-routes");

  for (const locale of ALL_LOCALES) {
    if (locale === "en") continue;
    const fromData = new Set(
      faqPages
        .filter((p) => p.locale === locale && p.status === "published")
        .map((p) => `/faq/${p.slug}`),
    );
    const fromRegistry = new Set(getRegisteredFaqPaths(locale));
    const missingInRegistry = [...fromData].filter((p) => !fromRegistry.has(p));
    const missingInData = [...fromRegistry].filter((p) => !fromData.has(p));

    if (missingInRegistry.length === 0 && missingInData.length === 0) {
      pass(
        `FAQ registry ⇄ data in sync for '${locale}' (${fromData.size} translated FAQs)`,
      );
    } else {
      if (missingInRegistry.length > 0) {
        fail(
          `Registry missing '${locale}' FAQ(s)`,
          `${missingInRegistry.join(", ")} — add to ${locale}.staticRoutes in lib/translated-routes.ts or the translation is unreachable (middleware 301s it)`,
        );
      }
      if (missingInData.length > 0) {
        fail(
          `Registry lists '${locale}' FAQ(s) with no data`,
          `${missingInData.join(", ")} — remove from lib/translated-routes.ts or add a locale:'${locale}' entry in data/faq-pages.ts (currently 404s while advertised in hreflang)`,
        );
      }
    }
  }
}

// ── J) Translated region-hub registry consistency ───────────────────
// Same drift guard as section I, for golf-course REGION HUBS. The middleware
// allowlist (lib/translated-routes.ts) cannot import data/golf-courses-i18n.ts
// (edge-bundled), so nothing at build time ties the two lists together. This
// fails CI in both directions: a translated hub missing from the registry is
// built but 301'd away (translation unreachable); a registry entry without a
// translation would 200 into the EN-fallback while hreflang/sitemap advertise it.

async function runRegionHubRegistryConsistencyTests() {
  console.log("\n\x1b[1mJ) Translated region-hub registry consistency\x1b[0m");
  const { getTranslatedRegionHubParams } =
    await import("../data/golf-courses-i18n");
  const { getRegisteredRegionHubPaths, ALL_LOCALES } =
    await import("../lib/translated-routes");

  // Per-locale sets of '/golf-courses/<region>' paths from the data file.
  const dataByLocale: Record<string, Set<string>> = {};
  for (const { locale, region } of getTranslatedRegionHubParams()) {
    (dataByLocale[locale] ??= new Set<string>()).add(`/golf-courses/${region}`);
  }

  for (const locale of ALL_LOCALES) {
    if (locale === "en") continue;
    const fromData = dataByLocale[locale] ?? new Set<string>();
    const fromRegistry = new Set(getRegisteredRegionHubPaths(locale));
    const missingInRegistry = [...fromData].filter((p) => !fromRegistry.has(p));
    const missingInData = [...fromRegistry].filter((p) => !fromData.has(p));

    if (missingInRegistry.length === 0 && missingInData.length === 0) {
      pass(
        `Region-hub registry ⇄ data in sync for '${locale}' (${fromData.size} translated hubs)`,
      );
    } else {
      if (missingInRegistry.length > 0) {
        fail(
          `Registry missing '${locale}' region hub(s)`,
          `${missingInRegistry.join(", ")} — add to ${locale}.staticRoutes in lib/translated-routes.ts or the translation is unreachable (middleware 301s it)`,
        );
      }
      if (missingInData.length > 0) {
        fail(
          `Registry lists '${locale}' region hub(s) with no data`,
          `${missingInData.join(", ")} — remove from lib/translated-routes.ts or add a translation in data/golf-courses-i18n.ts (currently serves EN fallback while advertised in hreflang)`,
        );
      }
    }
  }
}

// ── J2) Translated price-tier registry consistency ──────────────────
// Same drift guard as section J, for the golf-course PRICE-TIER pages. The
// middleware allowlist (lib/translated-routes.ts) cannot import
// data/price-tiers.ts (edge-bundled), so nothing at build time ties the two
// lists together. Fails CI in both directions: a translated tier missing from
// the registry is built but 301'd away (translation unreachable); a registry
// entry without a translation would 200 into the EN-fallback while
// hreflang/sitemap advertise it.

async function runPriceTierRegistryConsistencyTests() {
  console.log("\n\x1b[1mJ2) Translated price-tier registry consistency\x1b[0m");
  const { getTranslatedPriceTierParams } = await import("../data/price-tiers");
  const { getRegisteredPriceTierPaths, ALL_LOCALES } =
    await import("../lib/translated-routes");

  // Per-locale sets of '/golf-courses/under/<tier>' paths from the data file.
  const dataByLocale: Record<string, Set<string>> = {};
  for (const { locale, tier } of getTranslatedPriceTierParams()) {
    (dataByLocale[locale] ??= new Set<string>()).add(
      `/golf-courses/under/${tier}`,
    );
  }

  for (const locale of ALL_LOCALES) {
    if (locale === "en") continue;
    const fromData = dataByLocale[locale] ?? new Set<string>();
    const fromRegistry = new Set(getRegisteredPriceTierPaths(locale));
    const missingInRegistry = [...fromData].filter((p) => !fromRegistry.has(p));
    const missingInData = [...fromRegistry].filter((p) => !fromData.has(p));

    if (missingInRegistry.length === 0 && missingInData.length === 0) {
      pass(
        `Price-tier registry ⇄ data in sync for '${locale}' (${fromData.size} translated tiers)`,
      );
    } else {
      if (missingInRegistry.length > 0) {
        fail(
          `Registry missing '${locale}' price tier(s)`,
          `${missingInRegistry.join(", ")} — add to ${locale}.staticRoutes in lib/translated-routes.ts or the translation is unreachable (middleware 301s it)`,
        );
      }
      if (missingInData.length > 0) {
        fail(
          `Registry lists '${locale}' price tier(s) with no data`,
          `${missingInData.join(", ")} — remove from lib/translated-routes.ts or add a translation in data/price-tiers.ts PRICE_TIER_I18N (currently serves EN fallback while advertised in hreflang)`,
        );
      }
    }
  }
}

// ── J3) Translated course-detail registry consistency ───────────────
// Same drift guard as sections J/J2, for the golf-course DETAIL pages
// ([region]/[slug]). The middleware allowlist (lib/translated-routes.ts)
// cannot import data/golf-courses-i18n.ts (edge-bundled), so nothing at
// build time ties the two lists together. Fails CI in both directions: a
// COURSE_DETAIL_I18N triple missing from the registry is built but 301'd
// away (translation unreachable); a registry entry without a triple never
// gets generateStaticParams output, which dynamicParams=false turns into a
// HARD 404 that hreflang/sitemap advertise (worse than the hub case's
// EN-fallback 200 — see also the liveness check in section L2).

async function runCourseDetailRegistryConsistencyTests() {
  console.log(
    "\n\x1b[1mJ3) Translated course-detail registry consistency\x1b[0m",
  );
  const { getTranslatedCourseDetailPaths } =
    await import("../data/golf-courses-i18n");
  const { getRegisteredCourseDetailPaths, ALL_LOCALES } =
    await import("../lib/translated-routes");

  for (const locale of ALL_LOCALES) {
    if (locale === "en") continue;
    const fromData = new Set(getTranslatedCourseDetailPaths(locale));
    const fromRegistry = new Set(getRegisteredCourseDetailPaths(locale));
    const missingInRegistry = [...fromData].filter((p) => !fromRegistry.has(p));
    const missingInData = [...fromRegistry].filter((p) => !fromData.has(p));

    if (missingInRegistry.length === 0 && missingInData.length === 0) {
      pass(
        `Course-detail registry ⇄ data in sync for '${locale}' (${fromData.size} translated course details)`,
      );
    } else {
      if (missingInRegistry.length > 0) {
        fail(
          `Registry missing '${locale}' course detail(s)`,
          `${missingInRegistry.join(", ")} — add to ${locale}.staticRoutes in lib/translated-routes.ts or the translation is unreachable (middleware 301s it)`,
        );
      }
      if (missingInData.length > 0) {
        fail(
          `Registry lists '${locale}' course detail(s) with no data`,
          `${missingInData.join(", ")} — remove from lib/translated-routes.ts or add the triple to COURSE_DETAIL_I18N in data/golf-courses-i18n.ts (dynamicParams=false makes this a HARD 404 while advertised in hreflang)`,
        );
      }
    }
  }
}

// ── K) Data-driven internal-link liveness ───────────────────────────
// Complement to scripts/validate-internal-links.ts: the static validator
// covers the six SEO sections (/faq, /guide, /cost, /best, /activities,
// /hotels) but deliberately skips DB-driven prefixes (/location,
// /golf-courses) and core routes — the near-chidlom slug typos shipped
// through exactly that gap. This section fetches every related_slugs path
// OUTSIDE the statically-validated prefixes against the live (DB-backed)
// server and fails on 404.

async function runDataLinkLivenessTests() {
  console.log("\n\x1b[1mK) Data-driven internal-link liveness\x1b[0m");
  // Derived from the canonical section map (lib/seo-pages.ts): paths under
  // these prefixes are validated statically by validate-internal-links.ts
  // and skipped here; everything else gets a live fetch.
  const { PAGE_DATA_MAP, ROUTE_PREFIX_TO_TYPE } =
    await import("../lib/seo-pages");
  const STATIC_PREFIXES = new Set(Object.keys(ROUTE_PREFIX_TO_TYPE));

  const paths = new Set<string>();
  for (const pages of Object.values(PAGE_DATA_MAP)) {
    for (const p of pages) {
      if (p.status !== "published") continue;
      for (const link of p.related_slugs ?? []) {
        const clean = link.split(/[?#]/)[0];
        const first = clean.split("/").filter(Boolean)[0];
        if (first && !STATIC_PREFIXES.has(first)) paths.add(clean);
      }
    }
  }

  for (const path of [...paths].sort()) {
    const target = path.endsWith("/") ? path : `${path}/`;
    try {
      const res = await fetch(`${BASE}${target}`, { redirect: "follow" });
      if (res.status !== 404) {
        pass(`${path} resolves (${res.status})`);
      } else {
        fail(
          `${path} is a 404`,
          "related_slugs entry points at a missing page — fix the slug or remove the link (prefix not covered by validate-internal-links.ts)",
        );
      }
    } catch (err) {
      fail(`${path} fetch error`, String(err));
    }
  }
}

// ── L) Blog translated-slug registry liveness ───────────────────────
// data/blog-translated-slugs.ts is a committed mirror of the DB's
// blog_post_translations (the edge middleware can't query the DB). The
// dangerous drift direction is data-file-AHEAD-of-DB: the middleware lets
// /<locale>/blog/<slug> through, but generateStaticParams (DB-driven) never
// prebuilt it, and dynamicParams=false turns that into a hard 404 that
// hreflang advertises. Fetching every registered path catches that in CI
// without DB access. (The other direction — data file BEHIND the DB — is a
// graceful 301-to-EN and is caught by `npm run validate:blog-slugs`.)
async function runBlogRegistryLivenessTests() {
  console.log("\n\x1b[1mL) Blog translated-slug registry liveness\x1b[0m");
  const { getRegisteredBlogPaths, ALL_LOCALES } =
    await import("../lib/translated-routes");

  for (const locale of ALL_LOCALES) {
    if (locale === "en") continue;
    const paths = getRegisteredBlogPaths(locale);
    if (paths.length === 0) continue; // th has no blog translations
    let ok = 0;
    for (const path of paths) {
      const target = `/${locale}${path}/`;
      try {
        const res = await fetch(`${BASE}${target}`, { redirect: "manual" });
        if (res.status === 200) {
          ok++;
        } else {
          fail(
            `Registered blog translation not live: ${target}`,
            `expected 200, got ${res.status} — data/blog-translated-slugs.ts lists a '${locale}' slug the build didn't prebuild (DB missing the translation?). Run \`npm run validate:blog-slugs\` and re-sync.`,
          );
        }
      } catch (err) {
        fail(`${target} fetch error`, String(err));
      }
    }
    if (ok === paths.length) {
      pass(`All ${ok} registered '${locale}' blog translations serve 200`);
    }
  }
}

// ── L2) Course-detail translated registry liveness ──────────────────
// Section L's shape, for the course-detail allowlist entries in
// lib/translated-routes.ts. The dangerous drift direction is
// registry-AHEAD-of-params: the middleware lets /<locale>/golf-courses/
// <region>/<slug> through, but if generateStaticParams (COURSE_DETAIL_I18N-
// driven) never prebuilt that triple, dynamicParams=false turns it into a
// hard 404 that hreflang advertises. Section J3 catches registry ⇄ data
// drift statically; this fetch additionally proves the BUILD actually
// emitted each page (e.g. a data file renaming a slug after the build, or a
// generateStaticParams regression that drops the translated spread).
async function runCourseDetailRegistryLivenessTests() {
  console.log(
    "\n\x1b[1mL2) Course-detail translated registry liveness\x1b[0m",
  );
  const { getRegisteredCourseDetailPaths, ALL_LOCALES } =
    await import("../lib/translated-routes");

  for (const locale of ALL_LOCALES) {
    if (locale === "en") continue;
    const paths = getRegisteredCourseDetailPaths(locale);
    if (paths.length === 0) continue; // ko/zh have no course-detail translations yet
    let ok = 0;
    for (const path of paths) {
      const target = `/${locale}${path}/`;
      try {
        const res = await fetch(`${BASE}${target}`, { redirect: "manual" });
        if (res.status !== 200) {
          fail(
            `Registered course-detail translation not live: ${target}`,
            `expected 200, got ${res.status} — lib/translated-routes.ts lists a '${locale}' course detail the build didn't prebuild (COURSE_DETAIL_I18N missing the triple? dynamicParams=false hard-404s it).`,
          );
          continue;
        }
        // Content check too (not just status): these registry-derived checks
        // replace per-page hardcoded routeTests, so they must assert the page
        // actually rendered — a 200 error shell would otherwise pass.
        const body = await res.text();
        if (body.includes('<main id="main-content">')) {
          ok++;
        } else {
          fail(
            `Registered course-detail translation missing main content: ${target}`,
            'served 200 without <main id="main-content">',
          );
        }
      } catch (err) {
        fail(`${target} fetch error`, String(err));
      }
    }
    if (ok === paths.length) {
      pass(
        `All ${ok} registered '${locale}' course-detail translations serve 200`,
      );
    }
  }
}

// ── L3) Region-hub translated registry liveness ─────────────────────
// L2's shape, for the '/golf-courses/<region>' allowlist entries — but NOT
// L2's failure mode. The [region] page (unlike [region]/[slug]) does not set
// dynamicParams=false, so a registry entry with no REGION_HUB_I18N row still
// renders: on-demand, silently falling back to the EN REGION_META label and
// description under a locale URL. That drift is section J's job, and J
// catches it in both directions. What this section adds is proof each hub
// actually SERVES — a render throw, a missing GolfCourseRegion namespace, or
// a 200 error shell would all pass J and fail here.
//
// Registry-derived like L2, so future region batches are covered with zero
// routeTests edits — which is why the structural-parity batch (all 14 regions
// × 4 locales = 56 hub URLs) added no per-hub routeTests entries.
async function runRegionHubRegistryLivenessTests() {
  console.log("\n\x1b[1mL3) Region-hub translated registry liveness\x1b[0m");
  const { getRegisteredRegionHubPaths, ALL_LOCALES } = await import(
    "../lib/translated-routes"
  );

  // Every assertion here is derived from the registry, so an EMPTY registry
  // produces a section header and zero assertions — a silent no-op that reads
  // exactly like a pass. A registry-helper regression (renamed prefix, changed
  // return shape) is precisely how that happens, so prove the registry fed us
  // something before trusting the run.
  let covered = 0;

  for (const locale of ALL_LOCALES) {
    if (locale === "en") continue;
    const paths = getRegisteredRegionHubPaths(locale);
    if (paths.length === 0) continue;
    covered += paths.length;
    let ok = 0;
    for (const path of paths) {
      const target = `/${locale}${path}/`;
      try {
        const res = await fetch(`${BASE}${target}`, { redirect: "manual" });
        if (res.status !== 200) {
          fail(
            `Registered region-hub translation not live: ${target}`,
            `expected 200, got ${res.status} — lib/translated-routes.ts lists a '${locale}' region hub that doesn't serve (render throw, or a middleware/allowlist regression sending it back to EN).`,
          );
          continue;
        }
        // Content check too, for the same reason as L2: a registry-derived
        // check replaces per-page routeTests, so a 200 error shell must fail.
        const body = await res.text();
        if (body.includes('<main id="main-content">')) {
          ok++;
        } else {
          fail(
            `Registered region-hub translation missing main content: ${target}`,
            'served 200 without <main id="main-content">',
          );
        }
      } catch (err) {
        fail(`${target} fetch error`, String(err));
      }
    }
    if (ok === paths.length) {
      pass(
        `All ${ok} registered '${locale}' region-hub translations serve 200`,
      );
    }
  }

  if (covered === 0) {
    fail(
      "L3 covered zero region hubs",
      "getRegisteredRegionHubPaths() returned nothing for every non-en locale — the whole section asserted nothing. Either lib/translated-routes.ts lost its region-hub entries or the helper regressed; both would otherwise show up as a silent pass.",
    );
  } else {
    pass(`L3 covered ${covered} registered region-hub path(s)`);
  }
}

// ── L4) FAQ translated registry liveness ────────────────────────────
// The /faq/<slug> counterpart of L2/L3, and until the FAQ-completion batch
// the ONLY translated section with no liveness assertion at all: section I
// proved the registry and the data agreed, but nothing ever fetched a
// translated FAQ page. Registry ⇄ data agreement is not liveness — both
// sides can agree on a slug whose page throws at render, loses its
// FaqPage namespace, or serves a 200 error shell.
//
// generateStaticParams() returns getAllSeoPageParams('faq'), i.e. only
// locale×slug combos with published content, and the route does NOT set
// dynamicParams=false — so a registry entry with no data row renders
// on demand in English under a locale URL rather than 404ing. That drift is
// section I's job in both directions; what this adds is proof each page
// actually serves in its own locale.
//
// Registry-derived, so future FAQ batches need zero routeTests edits — which
// is why the FAQ-completion batch (71 new entries across th/ja/ko/zh) added
// none.
async function runFaqRegistryLivenessTests() {
  console.log("\n\x1b[1mL4) FAQ translated registry liveness\x1b[0m");
  const { getRegisteredFaqPaths, ALL_LOCALES } = await import(
    "../lib/translated-routes"
  );

  // Same anti-vacuity guard as L2/L3: every assertion is registry-derived, so
  // an empty registry would print a header, assert nothing, and read exactly
  // like a pass.
  let covered = 0;

  for (const locale of ALL_LOCALES) {
    if (locale === "en") continue;
    const paths = getRegisteredFaqPaths(locale);
    if (paths.length === 0) continue;
    covered += paths.length;
    let ok = 0;
    for (const path of paths) {
      const target = `/${locale}${path}/`;
      try {
        const res = await fetch(`${BASE}${target}`, { redirect: "manual" });
        if (res.status !== 200) {
          fail(
            `Registered FAQ translation not live: ${target}`,
            `expected 200, got ${res.status} — lib/translated-routes.ts lists a '${locale}' FAQ page that doesn't serve (missing data row, render throw, or a middleware/allowlist regression sending it back to EN).`,
          );
          continue;
        }
        const body = await res.text();
        if (!body.includes('<main id="main-content">')) {
          fail(
            `Registered FAQ translation missing main content: ${target}`,
            'served 200 without <main id="main-content">',
          );
          continue;
        }
        // FAQ answers are rendered verbatim — the route never calls
        // interpolateFacts (only /guide/ and llms.txt do). A {{token}}
        // copied in from a guide entry would therefore ship raw to the
        // reader with nothing throwing, so assert its absence here.
        if (body.includes("{{")) {
          fail(
            `Unresolved fact token rendered on ${target}`,
            "body contains '{{' — FAQ entries must use price LITERALS; the FAQ route never interpolates.",
          );
          continue;
        }
        ok++;
      } catch (err) {
        fail(`${target} fetch error`, String(err));
      }
    }
    if (ok === paths.length) {
      pass(`All ${ok} registered '${locale}' FAQ translations serve 200`);
    }
  }

  if (covered === 0) {
    fail(
      "L4 covered zero FAQ pages",
      "getRegisteredFaqPaths() returned nothing for every non-en locale — the whole section asserted nothing. Either lib/translated-routes.ts lost its /faq/ entries or the helper regressed; both would otherwise show up as a silent pass.",
    );
  } else {
    pass(`L4 covered ${covered} registered FAQ path(s)`);
  }
}

// ── L5) Flat SEO-section registry consistency + liveness ────────────
// /cost, /activities, /best and /hotels render from data files through
// lib/seo-pages.ts. Until the /cost+/activities batch these four routes were
// EN-hardcoded, so no drift was possible and no guard existed; now that they
// build per-locale params they carry exactly the hazard sections I/J/J3 guard
// for guides, FAQs and course details, and L2/L3/L4 for liveness:
//   - data entry with no registry line → built, then 301'd to English. The
//     translation exists and is unreachable, silently.
//   - registry line with no data entry → hard 404 (the page component calls
//     notFound() when the lookup misses) while hreflang and the sitemap
//     advertise it. These four routes do NOT set dynamicParams = false; the
//     outcome is the same 404, the mechanism is not.
// Consistency and liveness live in one section here because these sections
// share a single shape; splitting them would triple the boilerplate for no
// extra coverage. /hotels is listed and simply contributes zero paths until
// that batch lands — which is why the anti-vacuity guard below counts SECTIONS
// checked, not paths found.
const SEO_SECTION_PREFIXES = ["cost", "activities", "best", "hotels"] as const;

async function runSeoSectionRegistryTests() {
  console.log(
    "\n\x1b[1mL5) Flat SEO-section registry consistency + liveness\x1b[0m",
  );
  const { getRegisteredSeoSectionPaths, ALL_LOCALES } = await import(
    "../lib/translated-routes"
  );
  const { PAGE_DATA_MAP, ROUTE_PREFIX_TO_TYPE } = await import(
    "../lib/seo-pages"
  );

  let sectionsChecked = 0;
  let livePaths = 0;

  for (const prefix of SEO_SECTION_PREFIXES) {
    const pageType = ROUTE_PREFIX_TO_TYPE[prefix];
    const pages = PAGE_DATA_MAP[pageType];
    if (!pages) {
      fail(
        `No data source for /${prefix}/`,
        `ROUTE_PREFIX_TO_TYPE maps it to '${pageType}' but PAGE_DATA_MAP has no entry — lib/seo-pages.ts lost a section.`,
      );
      continue;
    }
    sectionsChecked++;

    for (const locale of ALL_LOCALES) {
      if (locale === "en") continue;
      const fromData = new Set(
        pages
          .filter((p) => p.locale === locale && p.status === "published")
          .map((p) => `/${prefix}/${p.slug}`),
      );
      const fromRegistry = new Set(getRegisteredSeoSectionPaths(locale, prefix));
      const missingInRegistry = [...fromData].filter(
        (p) => !fromRegistry.has(p),
      );
      const missingInData = [...fromRegistry].filter((p) => !fromData.has(p));

      if (missingInRegistry.length > 0) {
        fail(
          `Registry missing '${locale}' /${prefix}/ page(s)`,
          `${missingInRegistry.join(", ")} — add to ${locale}.staticRoutes in lib/translated-routes.ts or the translation is unreachable (middleware 301s it)`,
        );
      }
      if (missingInData.length > 0) {
        fail(
          `Registry lists '${locale}' /${prefix}/ page(s) with no data`,
          `${missingInData.join(", ")} — remove from lib/translated-routes.ts or add a locale:'${locale}' entry to the ${pageType} data file (currently 404s while advertised in hreflang)`,
        );
      }
      if (missingInRegistry.length === 0 && missingInData.length === 0) {
        pass(
          `Registry ⇄ data in sync for '${locale}' /${prefix}/ (${fromData.size} translated)`,
        );
      }

      // Liveness — registry-derived like L2/L3/L4, so a future /hotels batch
      // needs zero routeTests edits.
      let ok = 0;
      const paths = [...fromRegistry];
      for (const path of paths) {
        const target = `/${locale}${path}/`;
        try {
          const res = await fetch(`${BASE}${target}`, { redirect: "manual" });
          if (res.status !== 200) {
            fail(
              `Registered /${prefix}/ translation not live: ${target}`,
              `expected 200, got ${res.status} — a registered '${locale}' page that doesn't serve (missing data row, render throw, or a middleware/allowlist regression sending it back to EN).`,
            );
            continue;
          }
          const body = await res.text();
          if (!body.includes('<main id="main-content">')) {
            fail(
              `Registered /${prefix}/ translation missing main content: ${target}`,
              'served 200 without <main id="main-content">',
            );
            continue;
          }
          // Same inverse-of-/guide/ rule as L4: none of these four routes
          // calls interpolateFacts, so a {{token}} copied in from a guide
          // entry ships raw to the reader with nothing throwing.
          if (body.includes("{{")) {
            fail(
              `Unresolved fact token rendered on ${target}`,
              `body contains '{{' — /${prefix}/ entries must use price LITERALS; the route never interpolates.`,
            );
            continue;
          }
          ok++;
        } catch (err) {
          fail(`${target} fetch error`, String(err));
        }
      }
      livePaths += ok;
      if (paths.length > 0 && ok === paths.length) {
        pass(`All ${ok} registered '${locale}' /${prefix}/ pages serve 200`);
      }
    }
  }

  // Anti-vacuity: counts SECTIONS, not paths. An untranslated section
  // legitimately contributes zero paths, so a path-count guard would have to
  // be relaxed to accommodate /hotels and would then never fire at all.
  if (sectionsChecked !== SEO_SECTION_PREFIXES.length) {
    fail(
      "L5 skipped a flat SEO section",
      `checked ${sectionsChecked} of ${SEO_SECTION_PREFIXES.length} — a section lost its PAGE_DATA_MAP wiring, which would otherwise read as a silent pass.`,
    );
  } else {
    pass(
      `L5 checked ${sectionsChecked} flat SEO section(s), ${livePaths} live translated path(s)`,
    );
  }
}

// ── M) Wayfinding copy consistency (BTS Chidlom exit number) ────────
// The correct exit for The Mercury Ville is Exit 4 — confirmed with the owner
// (2026-07-28) and by the on-screen Thai text in LENGOLF's own POV wayfinding
// video ("และออกทางออกที่ 4"). "Exit 1" shipped for a long time across the
// whole /location/* section and the JA/KO/ZH landing pages.
//
// Two sources feed this copy and only one of them lives in the repo:
//   - location_pages.bts_route (Supabase) — six template pages share
//     location_slug='chidlom'; a bad UPDATE there can never be caught by a
//     static lint, so it has to be a live fetch.
//   - messages/{ja,ko,zh}.json `HomeXx.accessBts` + hardcoded EN guide copy.
// Each check is a matched pair — the right string must be present AND the
// wrong-exit shape must be absent — so a page that silently drops the
// wayfinding line fails instead of passing vacuously.
//
// Both halves run against RENDERED markup, with <script> blocks stripped
// first. app/[locale]/layout.tsx hands NextIntlClientProvider the ENTIRE
// locale catalog, so next-intl serializes every namespace into the RSC flight
// payload verbatim. On /ja/ that payload alone carries FaqPage.pillLocation's
// "（4番出口）" — a string rendered only on /faq/* pages. Matching the raw body
// would let it satisfy `expect` even if accessBts stopped rendering, which is
// exactly the vacuous pass this pair exists to prevent.

/** Rendered markup only: drops <script> blocks so the serialized next-intl
 *  catalog in the RSC flight payload cannot satisfy a match. */
function renderedMarkup(html: string): string {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
}

const wayfindingTests: {
  path: string;
  expect: RegExp;
  forbid: RegExp;
  what: string;
}[] = [
  // DB-driven: location_pages.bts_route, rendered on all six chidlom templates.
  ...[
    "corporate-events-chidlom",
    "golf-club-rental-chidlom",
    "golf-lessons-chidlom",
    "golf-near-chidlom",
    "indoor-golf-chidlom",
    "things-to-do-chidlom",
  ].map((slug) => ({
    path: `/location/${slug}/`,
    expect: /Take Exit 4 and/,
    forbid: /Take Exit [0-35-9] and/,
    what: "bts_route exit number",
  })),
  // Repo-driven: messages/*.json HomeXx.accessBts on the locale landing pages.
  //
  // Anchored exactly like the faq-hub entries below, and for the same reason:
  // an UNANCHORED pair passes on the wrong exit number. Against "14番出口",
  // `expect: /4番出口/` matches the "4番出口" tail and `forbid: /[0-35-9]番出口/`
  // never fires, because the digit it inspects is the one directly before 番 —
  // which is still 4. The lookbehind kills the tail match; the `\d\d` alternative
  // is what actually reports it. The faq-hub half of this fix shipped; these
  // three landing-page entries were left behind.
  {
    path: "/ja/",
    expect: /(?<!\d)4番出口/,
    forbid: /(?<!\d)[0-35-9]番出口|\d\d番出口/,
    what: "HomeJa.accessBts exit number",
  },
  {
    path: "/ko/",
    expect: /(?<!\d)4번\s*출구/,
    forbid: /(?<!\d)[0-35-9]번\s*출구|\d\d번\s*출구/,
    what: "HomeKo.accessBts exit number",
  },
  {
    path: "/zh/",
    expect: /(?<!\d)4号出口/,
    forbid: /(?<!\d)[0-35-9]号出口|\d\d号出口/,
    what: "HomeZh.accessBts exit number",
  },
  // Repo-driven: hardcoded EN copy in the Thailand golf guide.
  //
  // EN puts the digit AFTER the keyword, so the leading-digit hole above cannot
  // occur ("Exit 14" fails `expect` outright). The TRAILING-digit one can:
  // "Exit 41" satisfies a bare /Exit 4/ and never trips /Exit [0-35-9]/. Hence
  // the negative lookahead on expect and the two-digit alternative on forbid.
  {
    path: "/golf-in-thailand-guide/",
    expect: /BTS Chidlom Exit 4(?!\d)/,
    forbid: /BTS Chidlom Exit (?:[0-35-9]|\d\d)/,
    what: "guide 'Getting around Bangkok' exit number",
  },
  // Repo-driven: data/faq-hub.ts `directions.steps[1]`. This is a SECOND,
  // independent copy of the wayfinding — the landing-page checks above assert
  // messages/*.json HomeXx.accessBts and would all still pass if this one
  // regressed. th shipped its hub earlier and was never guarded either; the
  // structural-parity batch added ja/ko/zh, so all four are covered here.
  // th reads left-to-right like EN (digit after the keyword), so it needs EN's
  // anchoring, not the CJK lookbehind: "ทางออก 41" satisfies a bare /ทางออก\s*4/
  // and never trips /ทางออก\s*[0-35-9]/. The ja/ko/zh anchoring pass skipped th
  // because th's shape made the LEADING-digit hole impossible — the trailing
  // one was left open.
  {
    path: "/th/faq/",
    expect: /ทางออก\s*4(?!\d)/,
    forbid: /ทางออก\s*(?:[0-35-9]|\d\d)/,
    what: "faq-hub th directions exit number",
  },
  {
    path: "/ja/faq/",
    expect: /(?<!\d)4番出口/,
    forbid: /(?<!\d)[0-35-9]番出口|\d\d番出口/,
    what: "faq-hub ja directions exit number",
  },
  {
    path: "/ko/faq/",
    expect: /(?<!\d)4번\s*출구/,
    forbid: /(?<!\d)[0-35-9]번\s*출구|\d\d번\s*출구/,
    what: "faq-hub ko directions exit number",
  },
  {
    path: "/zh/faq/",
    expect: /(?<!\d)4号出口/,
    forbid: /(?<!\d)[0-35-9]号出口|\d\d号出口/,
    what: "faq-hub zh directions exit number",
  },
];

async function runWayfindingTests() {
  console.log("\n\x1b[1mM) Wayfinding copy (BTS Chidlom = Exit 4)\x1b[0m");
  for (const t of wayfindingTests) {
    const label = `${t.path} ${t.what}`;
    try {
      const res = await fetch(`${BASE}${t.path}`, { redirect: "follow" });
      if (res.status !== 200) {
        fail(label, `expected 200, got ${res.status}`);
        continue;
      }
      const body = renderedMarkup(await res.text());
      const wrong = body.match(t.forbid);
      if (wrong) {
        fail(
          label,
          `serves the wrong BTS Chidlom exit (found "${wrong[0]}") — the correct exit is 4`,
        );
      } else if (!t.expect.test(body)) {
        fail(
          label,
          `wayfinding copy missing — expected ${t.expect} on the page. If the copy moved, update this test rather than dropping it.`,
        );
      } else {
        pass(label);
      }
    } catch (err) {
      fail(`${label} fetch error`, String(err));
    }
  }
}

// ── N) Region-hub course-count agreement (ICU plural branches) ──────
// GolfCourseRegion.metaDescription is one string serving regions with 58
// courses and regions with 1, so it carries an ICU plural. Three regions sit
// on the =1 branch (north-misc, khao-lak, krabi — courseCount: 1 in
// REGION_META); everything else takes `other`. Before PR #88 there was no
// plural and the three shipped "all 1 golf courses" to Google.
//
// The =1 set is DERIVED, not hand-listed. lib/golf-courses.ts is
// `import 'server-only'` and cannot be imported here, but REGION_META.courseCount
// is not the authority anyway: validate-courses.ts fails CI unless courseCount
// equals the region's index.ts slug count, so index.ts is the file that really
// decides the plural branch — and it is a plain data module this script can
// import. A region crossing the 1-course line now moves itself in or out of
// these cases; the `other`-branch cases below are fixed and need no edit.
//
// Assertions are matched pairs (correct form present AND broken form absent),
// like section M — so copy that silently vanishes fails instead of passing
// vacuously. Both plural branches are exercised, in EN and in TH.
//
// Counts are matched with `\d+`, NOT `\d\d+`: nine of the fourteen regions have
// a single-digit courseCount, so a two-digit-minimum pattern would fail the
// moment this list grows past bangkok. The count being ≠1 in the `other` cases
// is already guaranteed by `forbid`, which runs first.
//
// TH is asserted on BOTH branches, because the structural-parity batch in this
// same PR ships th/ja/ko/zh hubs for all three single-course regions — so
// /th/golf-courses/krabi/ is a real 200, not a 301 to English. The TH =1 cases
// are additionally intersected with the TH region-hub registry: an untranslated
// hub 301s to English, and following that redirect would fail the Thai
// assertion for a reason that has nothing to do with the plural. ja/ko/zh carry
// no plural by design (no plural morphology; か所/곳/座 read correctly at 1),
// so there is no branch of theirs to exercise here.

/** Regions whose index.ts lists exactly one slug — i.e. the ones REGION_META
 *  must declare `courseCount: 1` for (validate-courses.ts enforces that
 *  equality), and therefore the ones that render the ICU `=1` branch. */
async function singleCourseRegions(): Promise<string[]> {
  const fs = await import("node:fs");
  const nodePath = await import("node:path");
  const { pathToFileURL } = await import("node:url");
  // Resolved from this file, not process.cwd(): CI invokes the script by path
  // from the repo root, but a developer running it from anywhere else must not
  // silently get an empty list (which would drop the =1 branch from the suite).
  const root = nodePath.join(__dirname, "..", "data", "golf-courses");
  const out: string[] = [];
  for (const region of fs.readdirSync(root)) {
    const abs = nodePath.join(root, region, "index.ts");
    if (!fs.existsSync(abs)) continue;
    const mod = await import(pathToFileURL(abs).href);
    // Both index shapes in the tree: `export default { slugs }` (hand-written)
    // and `const index = { slugs: [...] }; export default index` (generated).
    const slugs: string[] = (mod.default ?? mod).slugs ?? [];
    if (slugs.length === 1) out.push(region);
  }
  return out;
}

async function buildRegionCountTests(): Promise<
  { path: string; expect: RegExp; forbid: RegExp; what: string }[]
> {
  const singles = await singleCourseRegions();
  const { getRegisteredRegionHubPaths } = await import(
    "../lib/translated-routes"
  );
  const thHubs = new Set(getRegisteredRegionHubPaths("th"));

  return [
    // =1 branch — EN. These are the whole reason the plural exists.
    ...singles.map((region) => ({
      path: `/golf-courses/${region}/`,
      expect: /Our guide to \d+ golf course in /,
      forbid: /\d+ golf courses in/,
      what: "EN meta description (=1 branch)",
    })),
    // =1 branch — TH. Thai has no plural; the =1 branch exists only to drop
    // ครบทั้ง ("the complete set of"), which reads wrong applied to one item.
    ...singles
      .filter((region) => thHubs.has(`/golf-courses/${region}`))
      .map((region) => ({
        path: `/th/golf-courses/${region}/`,
        expect: /รายชื่อสนามกอล์ฟ.* \d+ แห่ง/,
        forbid: /ครบทั้ง/,
        what: "TH meta description (=1 branch)",
      })),
    // `other` branch — EN and TH, on a region that has many courses.
    {
      path: "/golf-courses/bangkok/",
      expect: /The full directory of all \d+ golf courses in /,
      forbid: /\b1 golf courses\b/,
      what: "EN meta description (other branch)",
    },
    {
      path: "/th/golf-courses/bangkok/",
      expect: /ครบทั้ง \d+ แห่ง/,
      forbid: /ครบทั้ง 1 แห่ง/,
      what: "TH meta description (other branch)",
    },
  ];
}

/** The `content` of <meta name="description"> — the string this section is about.
 *  Safe against og:/twitter: siblings: those are `property="og:description"` and
 *  `name="twitter:description"`, neither of which contains the literal
 *  `name="description"`, and `[^>]` cannot cross a tag boundary. */
function metaDescriptionOf(html: string): string | null {
  const m = html.match(
    /<meta[^>]+name="description"[^>]*\scontent="([^"]*)"/i,
  );
  return m ? m[1] : null;
}

/** Visible text: scripts/styles dropped, then tags stripped. The hub card puts
 *  the count and the noun in SEPARATE elements ("1 <span>course</span>"), so a
 *  raw-markup regex can never see the disagreement — it only exists in the
 *  rendered text. Scripts go first because NextIntlClientProvider serializes
 *  the whole message catalog into the flight payload. */
function visibleText(html: string): string {
  return renderedMarkup(html)
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    // Tags become a SPACE, not "". Dropping them outright welds neighbouring
    // elements together — "…<span>course</span></p><span>View all" collapses to
    // "courseView all", and a trailing \b in an assertion then never matches.
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
}

async function runRegionCountTests() {
  console.log(
    "\n\x1b[1mN) Region-hub course-count agreement (ICU plural)\x1b[0m",
  );
  const regionCountTests = await buildRegionCountTests();
  // The =1 cases are the entire point of this section, and they are derived.
  // A derivation that quietly yields nothing (moved data directory, changed
  // index.ts export shape) would leave only the `other`-branch cases running
  // and the section would still print green.
  const singleBranchCases = regionCountTests.filter((t) =>
    t.what.includes("=1"),
  );
  if (singleBranchCases.length === 0) {
    fail(
      "N derived zero =1-branch regions",
      "no data/golf-courses/<region>/index.ts lists exactly one slug — either every region genuinely grew past 1 (then delete this section and the ICU =1 branch with it), or singleCourseRegions() stopped reading the data and the plural branch is now untested.",
    );
  }
  for (const t of regionCountTests) {
    const label = `${t.path} ${t.what}`;
    try {
      const res = await fetch(`${BASE}${t.path}`, { redirect: "follow" });
      if (res.status !== 200) {
        fail(label, `expected 200, got ${res.status}`);
        continue;
      }
      const desc = metaDescriptionOf(await res.text());
      if (desc === null) {
        fail(label, "no <meta name=\"description\"> on the page");
      } else if (t.forbid.test(desc)) {
        fail(
          label,
          `count/noun disagreement in the meta description: "${desc}" — the ICU plural in messages/*.json GolfCourseRegion.metaDescription is missing or bypassed`,
        );
      } else if (!t.expect.test(desc)) {
        fail(
          label,
          `expected ${t.expect} in the meta description, got "${desc}". If the copy was reworded, update this test rather than dropping it.`,
        );
      } else {
        pass(label);
      }
    } catch (err) {
      fail(`${label} fetch error`, String(err));
    }
  }

  // The /golf-courses/ directory renders one card per region with the count
  // next to the noun. Same defect class as the meta description above, but in
  // VISIBLE body copy — it shipped "1 courses" three times in EN.
  const hubLabel = "/golf-courses/ EN region-card course count";
  try {
    const res = await fetch(`${BASE}/golf-courses/`, { redirect: "follow" });
    if (res.status !== 200) {
      fail(hubLabel, `expected 200, got ${res.status}`);
    } else {
      const text = visibleText(await res.text());
      if (/\b1 courses\b/.test(text)) {
        fail(
          hubLabel,
          "region card renders '1 courses' — GolfCourseHub.coursesCount lost its ICU plural, or the count was interpolated outside the message again",
        );
      } else if (!/\b1 course\b/.test(text)) {
        fail(
          hubLabel,
          "expected a '1 course' card (north-misc / khao-lak / krabi each hold one). If every region now has 2+, drop this assertion; otherwise the card copy moved.",
        );
      } else {
        pass(hubLabel);
      }
    }
  } catch (err) {
    fail(`${hubLabel} fetch error`, String(err));
  }
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log(`\x1b[1mSmoke testing: ${BASE}\x1b[0m`);

  // Verify server is reachable before running tests
  try {
    await fetch(BASE, { signal: AbortSignal.timeout(5000) });
  } catch {
    console.error(
      `\n\x1b[31mError: Cannot reach ${BASE}. Is the server running?\x1b[0m`,
    );
    console.error("Start it with: npm run build && npm run start");
    process.exit(1);
  }

  await runRouteTests();
  await runRedirectTests();
  await runLinkTests();
  await runSeoTests();
  await runThaiRedirectTests();
  await runThaiCookieTests();
  await runNotFoundTests();
  await runLlmDiscoverabilityTests();
  await runRegistryConsistencyTests();
  await runRegionHubRegistryConsistencyTests();
  await runPriceTierRegistryConsistencyTests();
  await runCourseDetailRegistryConsistencyTests();
  await runDataLinkLivenessTests();
  await runBlogRegistryLivenessTests();
  await runCourseDetailRegistryLivenessTests();
  await runRegionHubRegistryLivenessTests();
  await runFaqRegistryLivenessTests();
  await runSeoSectionRegistryTests();
  await runWayfindingTests();
  await runRegionCountTests();

  console.log(`\n\x1b[1m${passed} passed, ${failed} failed\x1b[0m`);
  if (failures.length > 0) {
    console.log("\nFailed:");
    failures.forEach((f) => console.log(`  \x1b[31m•\x1b[0m ${f}`));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Smoke test crashed:", err);
  process.exit(1);
});
