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
  {
    path: "/th/golf-courses/",
    expectedLocation: "/golf-courses/",
    label: "Golf courses hub (untranslated Thai → EN)",
  },
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
  {
    path: "/th/guide/screen-golf-bangkok/",
    expectedLocation: "/guide/screen-golf-bangkok/",
    label: "Untranslated TH guide (only translated guide slugs may 200)",
  },
  {
    path: "/th/guide/round-of-golf-cost-bangkok/",
    expectedLocation: "/guide/round-of-golf-cost-bangkok/",
    label:
      "Untranslated TH guide — round-of-golf-cost (only translated guide slugs may 200)",
  },
  // Untranslated FAQ must still 301 to English. Only the 8 FAQ slugs in the
  // th.staticRoutes allowlist (lib/translated-routes.ts) may 200 under /th/faq/.
  // This canary is deliberately NOT one of those 8 — if it ever gains a TH
  // translation, pick another untranslated FAQ slug here instead of deleting
  // the guard (a previous batch went stale exactly this way).
  {
    path: "/th/faq/can-you-play-golf-in-bangkok-when-it-rains/",
    expectedLocation: "/faq/can-you-play-golf-in-bangkok-when-it-rains/",
    label:
      "Untranslated TH FAQ (only translated FAQ slugs may 200)",
  },
  // Untranslated region hubs must still 301 to English — only regions present in
  // data/golf-courses-i18n.ts are translated (bangkok/phuket/pattaya/hua-hin/
  // chiang-mai as of this test). Guards the region-hub allowlist with a region
  // that has NO translation; pick a new one here if koh-samui ever gets one.
  {
    path: "/ja/golf-courses/koh-samui/",
    expectedLocation: "/golf-courses/koh-samui/",
    label: "Untranslated JA region hub (only translated regions may 200)",
  },
  {
    path: "/ko/golf-courses/koh-samui/",
    expectedLocation: "/golf-courses/koh-samui/",
    label: "Untranslated KO region hub (only translated regions may 200)",
  },
  {
    path: "/zh/golf-courses/koh-samui/",
    expectedLocation: "/golf-courses/koh-samui/",
    label: "Untranslated ZH region hub (only translated regions may 200)",
  },
  {
    path: "/th/golf-courses/koh-samui/",
    expectedLocation: "/golf-courses/koh-samui/",
    label: "Untranslated TH region hub (only translated regions may 200)",
  },
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
  {
    path: "/ja/faq/what-to-wear-to-indoor-golf-bar/",
    expectedLocation: "/faq/what-to-wear-to-indoor-golf-bar/",
    label: "Untranslated JA FAQ (only translated slugs may 200)",
  },
  {
    path: "/ko/faq/how-long-does-simulator-golf-take/",
    expectedLocation: "/faq/how-long-does-simulator-golf-take/",
    label: "Untranslated KO FAQ (only translated slugs may 200)",
  },
  {
    path: "/zh/faq/can-kids-play-golf-simulators/",
    expectedLocation: "/faq/can-kids-play-golf-simulators/",
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
  // Course DETAIL pages build only EN copies (generateStaticParams emits
  // locale: 'en' only) even though their region HUB may be translated —
  // /th/golf-courses/bangkok/ 200s, but the 3-segment detail below it must
  // still 301. Canary for the [region]/[slug] locale restriction.
  {
    path: "/th/golf-courses/bangkok/alpine-golf-club/",
    expectedLocation: "/golf-courses/bangkok/alpine-golf-club/",
    label: "Untranslated TH course detail (EN-only route must 301)",
  },
  // The EN-only SEO-page families (/hotels, /cost, /activities, /best) build
  // no locale copies either; this canary covers the mechanism for all four —
  // none of their prefixes are in lib/translated-routes.ts, so every non-EN
  // URL must 301 to the English page.
  {
    path: "/th/hotels/things-to-do-near-grand-hyatt-erawan/",
    expectedLocation: "/hotels/things-to-do-near-grand-hyatt-erawan/",
    label: "Untranslated TH hotel-concierge page (EN-only route must 301)",
  },
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
  {
    // Must be a guide with NO th translation, so it stays English under a th
    // cookie (a th-translated guide correctly 307s to /th/ per next-intl cookie
    // behavior). golf-lessons-bangkok-coaches gained a th version, so use a
    // guide that was never translated to Thai.
    path: "/guide/screen-golf-bangkok/",
    label: "Guide page (th-less) with Thai cookie",
  },
  {
    // Must be an FAQ slug with NO th translation, so it stays English under a
    // th cookie (a th-translated FAQ correctly 307s to /th/ per next-intl
    // cookie behavior — same rule as the guide-page canary above).
    // can-i-rent-golf-clubs-in-bangkok gained a th version, so use one that
    // was not part of that batch.
    path: "/faq/can-you-play-golf-in-bangkok-when-it-rains/",
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
  await runDataLinkLivenessTests();
  await runBlogRegistryLivenessTests();

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
