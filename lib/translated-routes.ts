import { SITE_URL } from "./constants";
import { BLOG_TRANSLATED_SLUGS } from "../data/blog-translated-slugs";

/**
 * Registry of routes that have translations per locale.
 * Routes NOT in this list will redirect from /<locale>/* to the English equivalent.
 */
const TRANSLATED_ROUTES: Record<
  string,
  { staticRoutes: readonly string[]; dynamicRoutePatterns: readonly string[] }
> = {
  th: {
    staticRoutes: [
      "/",
      "/golf",
      "/events",
      "/golf-club-rental",
      "/golf-course-club-rental",
      "/lessons",
      "/about-us",
      "/blog",
      "/menu",
      "/faq",
      "/guide/corporate-golf-events-bangkok",
      "/guide/best-time-play-golf-thailand",
      "/guide/nikanti-golf-club-bangkok",
      "/guide/thailand-golf-trip-cost",
      "/guide/alpine-golf-club-bangkok",
      "/guide/thai-country-club-bangkok",
      "/guide/best-golf-courses-near-bangkok",
      "/guide/banyan-golf-club-hua-hin",
      "/guide/best-airlines-fly-golf-clubs-bangkok",
      "/guide/bangkok-bts-guide-golfers",
      "/guide/bangkok-to-hua-hin-golf-transport",
      "/guide/bangkok-hotels-to-golf-courses-transport",
      "/guide/best-bangkok-hotels-golfers",
      "/guide/best-golf-courses-phuket",
      "/guide/black-mountain-golf-club-hua-hin",
      "/guide/first-time-golf-thailand",
      "/guide/don-mueang-airport-to-bangkok",
      "/guide/golf-bangkok-rainy-season",
      "/guide/golf-club-rental-bangkok-guide",
      "/guide/golf-courses-chiang-mai",
      "/guide/golf-hotels-near-bangkok",
      "/guide/golf-thailand-beginners",
      "/guide/golf-lessons-bangkok-coaches",
      "/guide/golf-tournament-packages-bangkok",
      "/guide/golf-weather-bangkok-by-month",
      "/guide/golfnow-thailand-review",
      "/guide/hotels-near-hua-hin-golf-courses",
      "/guide/how-to-pack-golf-clubs-flight-thailand",
      "/guide/is-thailand-good-for-golf",
      "/guide/suvarnabhumi-airport-to-bangkok-golf",
      "/guide/thai-golf-course-etiquette",
      "/guide/solo-golf-trip-thailand",
      "/guide/thailand-vs-bali-vs-vietnam-golf-holiday",
      "/guide/what-to-wear-golf-thailand",
      "/guide/what-is-a-golf-simulator",
      "/guide/is-indoor-golf-realistic",
      "/guide/golf-simulator-for-non-golfers-guide",
      "/guide/best-golf-simulators-bangkok",
      "/guide/golf-simulator-vs-real-course-bangkok",
      "/guide/green-fees-bangkok-golf-courses",
      "/guide/golf-club-baggage-fees-airlines-bangkok",
      "/guide/bring-golf-clubs-thailand-or-rent",
      "/guide/how-to-book-golf-tee-times-thailand",
      "/guide/renting-golf-clubs-thai-golf-courses",
      "/guide/screen-golf-bangkok",
      "/guide/round-of-golf-cost-bangkok",
      // Translated /golf-courses/ hub page (GolfCourseHub namespace) — the
      // entry point for Thai-script สนามกอล์ฟ queries. All four locales now
      // serve this hub (ko/zh gained it in the structural-parity batch).
      "/golf-courses",
      // Translated region hubs (data/golf-courses-i18n.ts) — kept in sync by the
      // smoke-test region-hub consistency check.
      "/golf-courses/bangkok",
      "/golf-courses/phuket",
      "/golf-courses/pattaya",
      "/golf-courses/hua-hin",
      "/golf-courses/chiang-mai",
      // Structural-parity batch (2026-08): the remaining 9 regions. Every
      // region in lib/golf-courses.ts REGIONS now has a hub in every locale,
      // so no region funnel dead-ends at an English hub.
      "/golf-courses/khao-yai",
      "/golf-courses/kanchanaburi",
      "/golf-courses/isan",
      "/golf-courses/southern-thailand",
      "/golf-courses/koh-samui",
      "/golf-courses/chiang-rai",
      "/golf-courses/north-misc",
      "/golf-courses/khao-lak",
      "/golf-courses/krabi",
      // Translated price-tier pages (data/price-tiers.ts PRICE_TIER_I18N) —
      // kept in sync by the smoke-test price-tier registry consistency check.
      "/golf-courses/under/1500-baht",
      "/golf-courses/under/2500-baht",
      "/golf-courses/under/3500-baht",
      "/golf-courses/under/5000-baht",
      "/golf-courses/under/7500-baht",
      // Translated course-detail pages (data/golf-courses-i18n.ts
      // COURSE_DETAIL_I18N — see that file for the current set) — kept in
      // sync by the smoke-test course-detail registry consistency check
      // (section J3); liveness of each built page is asserted by section L2.
      "/golf-courses/bangkok/sai-golf-club",
      "/golf-courses/bangkok/the-legacy-golf-club",
      "/golf-courses/chiang-mai/lanna-golf-course",
      "/golf-courses/bangkok/pinehurst-golf-country-club",
      "/golf-courses/bangkok/siam-country-club-bangkok",
      "/golf-courses/bangkok/ayutthaya-golf-club",
      "/golf-courses/bangkok/muang-ake-golf-course",
      "/golf-courses/phuket/blue-canyon-lakes-course",
      "/golf-courses/phuket/phuket-country-club",
      "/golf-courses/pattaya/wangjuntr-golf-park",
      "/golf-courses/bangkok/alpine-golf-club",
      "/golf-courses/bangkok/nikanti-golf-club",
      "/golf-courses/bangkok/royal-gems-golf-sports-club",
      "/golf-courses/pattaya/burapha-golf-club",
      "/golf-courses/pattaya/laem-chabang-international",
      // Translated FAQ pages (data/faq-pages.ts entries with locale: 'th') —
      // must stay in sync with the data file; the smoke-test registry-
      // consistency check (section I) enforces it, mirroring the guide check.
      "/faq/can-i-rent-golf-clubs-in-bangkok",
      "/faq/are-rental-golf-clubs-good-enough",
      "/faq/how-accurate-are-golf-simulators",
      "/faq/do-i-need-experience-to-play-golf-simulator",
      "/faq/can-beginners-play-golf-simulators",
      "/faq/how-long-does-simulator-golf-take",
      "/faq/best-way-to-learn-golf-in-bangkok",
      "/faq/can-kids-play-golf-simulators",
      "/faq/how-much-does-indoor-golf-cost-in-bangkok",
      "/faq/can-you-play-golf-in-bangkok-when-it-rains",
      "/faq/should-i-bring-golf-clubs-to-thailand-or-rent",
      "/faq/cost-to-fly-with-golf-clubs-to-thailand",
      "/faq/worth-taking-golf-lessons-bangkok-holiday",
      "/faq/what-golf-clubs-available-rent-bangkok",
      // TH indoor-practice cluster (สนามไดร์ฟกอล์ฟ / ตีกอล์ฟในร่ม queries).
      "/faq/practice-golf-swing-without-driving-range-bangkok",
      "/faq/what-to-wear-to-indoor-golf-bar",
      "/faq/best-time-of-day-golf-bangkok",
      // FAQ-completion batch: brings every locale to 31 of 32 FAQ pages.
      // The 32nd (where-to-play-golf-at-night-in-bangkok) is deliberately
      // untranslated — it duplicates where-play-golf-night-bangkok, which is
      // the canonical page (2 inbound internal links vs 0). Translating both
      // would have shipped 8 duplicate pages. The EN pair still wants
      // consolidating with a 301.
      "/faq/how-much-does-corporate-golf-event-cost-bangkok",
      "/faq/can-you-bring-golf-clubs-as-checked-baggage-thailand",
      "/faq/thailand-visa-guide-golf-tourists",
      "/faq/thailand-entry-requirements-golfers",
      "/faq/grab-vs-taxi-bangkok-golf",
      "/faq/how-many-golf-courses-thailand",
      "/faq/last-minute-golf-tee-times-thailand",
      "/faq/golf-shoes-thailand",
      "/faq/golf-fitness-heat-thailand",
      "/faq/do-you-need-caddie-thailand-golf",
      "/faq/how-much-tip-caddie-thailand",
      "/faq/where-play-golf-night-bangkok",
      "/faq/do-you-need-golf-travel-bag-thailand",
      "/faq/how-far-in-advance-book-golf-bangkok",
      // /cost (price_guide) and /activities (activity_occasion). These four
      // SEO sections were EN-hardcoded at the route level until the
      // locale-capable commit; /hotels and /best remain EN-only for now.
      "/activities/bachelor-party-ideas-bangkok",
      "/activities/birthday-party-venues-bangkok",
      "/activities/date-night-ideas-bangkok",
      "/activities/family-activities-bangkok",
      "/activities/golf-simulator-for-non-golfers",
      "/activities/group-activities-bangkok",
      "/activities/indoor-activities-bangkok",
      "/activities/private-party-venues-bangkok",
      "/activities/rainy-day-activities-bangkok",
      "/activities/things-to-do-bangkok-at-night",
      "/activities/weekend-activities-bangkok",
      "/cost/corporate-golf-event-cost-bangkok",
      "/cost/cost-of-renting-golf-clubs-bangkok",
      "/cost/golf-lesson-prices-bangkok",
      "/cost/golf-simulator-prices-bangkok",
      "/cost/how-much-does-golf-cost-bangkok",
      "/cost/lengolf-pricing-guide",
    ],
    dynamicRoutePatterns: [],
  },
  // KO / JA / ZH: bespoke landing pages at '/' (HomeKo/HomeJa/HomeZh namespaces),
  // plus /golf, /lessons, /events, /about-us, /golf-club-rental, and
  // /golf-course-club-rental. Expand this list only after translating the
  // target page's namespace — otherwise mixed-language content ships to
  // Google and hreflang gets flagged as mismatched.
  ko: {
    staticRoutes: [
      "/",
      "/golf",
      "/lessons",
      "/events",
      "/about-us",
      "/golf-club-rental",
      "/golf-course-club-rental",
      "/menu",
      "/blog",
      // Translated /faq/ hub (content in data/faq-hub.ts CONTENT, NOT a
      // messages namespace — see the header comment in that file). Shipped in
      // the structural-parity batch so the translated per-question FAQ pages
      // no longer sit under an English hub.
      "/faq",
      // Translated /golf-courses/ hub page. THIS LINE is what stops
      // /ko/golf-courses/ 301ing to English: middleware.ts redirects on
      // hasTranslationForLocale(), which reads staticRoutes and nothing else,
      // and origin/main's ko block simply had no "/golf-courses" entry. The
      // GolfCourseHub namespace was added to messages/ko.json in the same
      // batch, but a missing namespace never redirects — next-intl logs
      // MISSING_MESSAGE per render and silently serves the English strings
      // under a /ko/ URL, which is the worse failure this pairing avoids.
      "/golf-courses",
      // Translated guide pages (data/explainer-pages.ts entries with
      // locale: 'ko') — must stay in sync with the data file; the
      // smoke-test registry-consistency check (section I) enforces it.
      "/guide/bring-golf-clubs-thailand-or-rent",
      "/guide/golf-club-baggage-fees-airlines-bangkok",
      "/guide/golf-lessons-bangkok-coaches",
      "/guide/green-fees-bangkok-golf-courses",
      "/guide/how-to-book-golf-tee-times-thailand",
      "/guide/renting-golf-clubs-thai-golf-courses",
      "/guide/round-of-golf-cost-bangkok",
      "/guide/screen-golf-bangkok",
      // Translated region hubs (data/golf-courses-i18n.ts) — kept in sync by the
      // smoke-test region-hub consistency check.
      "/golf-courses/bangkok",
      "/golf-courses/phuket",
      "/golf-courses/pattaya",
      "/golf-courses/hua-hin",
      "/golf-courses/chiang-mai",
      // Structural-parity batch (2026-08): the remaining 9 regions. Every
      // region in lib/golf-courses.ts REGIONS now has a hub in every locale,
      // so no region funnel dead-ends at an English hub.
      "/golf-courses/khao-yai",
      "/golf-courses/kanchanaburi",
      "/golf-courses/isan",
      "/golf-courses/southern-thailand",
      "/golf-courses/koh-samui",
      "/golf-courses/chiang-rai",
      "/golf-courses/north-misc",
      "/golf-courses/khao-lak",
      "/golf-courses/krabi",
      // Translated price-tier pages (data/price-tiers.ts PRICE_TIER_I18N) —
      // kept in sync by the smoke-test price-tier registry consistency check.
      "/golf-courses/under/1500-baht",
      "/golf-courses/under/2500-baht",
      "/golf-courses/under/3500-baht",
      "/golf-courses/under/5000-baht",
      "/golf-courses/under/7500-baht",
      // Translated course-detail pages (data/golf-courses-i18n.ts
      // COURSE_DETAIL_I18N) — kept in sync by the smoke-test course-detail
      // registry consistency check (section J3); liveness of each built page
      // is asserted by section L2. Added in the ko/zh course-detail batch,
      // which closes the funnel PR #88 opened: the 14 region hubs went live
      // in ko/zh with zero translated course pages beneath them, so every
      // course link on those hubs left the locale.
      "/golf-courses/bangkok/sai-golf-club",
      "/golf-courses/bangkok/the-legacy-golf-club",
      "/golf-courses/chiang-mai/lanna-golf-course",
      "/golf-courses/bangkok/pinehurst-golf-country-club",
      "/golf-courses/bangkok/siam-country-club-bangkok",
      "/golf-courses/bangkok/ayutthaya-golf-club",
      "/golf-courses/bangkok/muang-ake-golf-course",
      "/golf-courses/phuket/blue-canyon-lakes-course",
      "/golf-courses/phuket/phuket-country-club",
      "/golf-courses/pattaya/wangjuntr-golf-park",
      "/golf-courses/bangkok/alpine-golf-club",
      "/golf-courses/bangkok/nikanti-golf-club",
      "/golf-courses/bangkok/royal-gems-golf-sports-club",
      "/golf-courses/pattaya/burapha-golf-club",
      "/golf-courses/pattaya/laem-chabang-international",
      // Translated FAQ pages (data/faq-pages.ts entries with this locale) —
      // must stay in sync with the data file; the smoke-test registry-
      // consistency check (section I) enforces it, mirroring the guide check.
      "/faq/how-much-does-indoor-golf-cost-in-bangkok",
      "/faq/can-i-rent-golf-clubs-in-bangkok",
      "/faq/are-rental-golf-clubs-good-enough",
      "/faq/best-way-to-learn-golf-in-bangkok",
      "/faq/how-accurate-are-golf-simulators",
      "/faq/can-beginners-play-golf-simulators",
      "/faq/can-you-play-golf-in-bangkok-when-it-rains",
      "/faq/do-i-need-experience-to-play-golf-simulator",
      "/faq/should-i-bring-golf-clubs-to-thailand-or-rent",
      "/faq/cost-to-fly-with-golf-clubs-to-thailand",
      "/faq/worth-taking-golf-lessons-bangkok-holiday",
      "/faq/what-golf-clubs-available-rent-bangkok",
      // FAQ-completion batch: brings every locale to 31 of 32 FAQ pages.
      // The 32nd (where-to-play-golf-at-night-in-bangkok) is deliberately
      // untranslated — it duplicates where-play-golf-night-bangkok, which is
      // the canonical page (2 inbound internal links vs 0). Translating both
      // would have shipped 8 duplicate pages. The EN pair still wants
      // consolidating with a 301.
      "/faq/how-long-does-simulator-golf-take",
      "/faq/what-to-wear-to-indoor-golf-bar",
      "/faq/can-kids-play-golf-simulators",
      "/faq/practice-golf-swing-without-driving-range-bangkok",
      "/faq/how-much-does-corporate-golf-event-cost-bangkok",
      "/faq/can-you-bring-golf-clubs-as-checked-baggage-thailand",
      "/faq/thailand-visa-guide-golf-tourists",
      "/faq/thailand-entry-requirements-golfers",
      "/faq/best-time-of-day-golf-bangkok",
      "/faq/grab-vs-taxi-bangkok-golf",
      "/faq/how-many-golf-courses-thailand",
      "/faq/last-minute-golf-tee-times-thailand",
      "/faq/golf-shoes-thailand",
      "/faq/golf-fitness-heat-thailand",
      "/faq/do-you-need-caddie-thailand-golf",
      "/faq/how-much-tip-caddie-thailand",
      "/faq/where-play-golf-night-bangkok",
      "/faq/do-you-need-golf-travel-bag-thailand",
      "/faq/how-far-in-advance-book-golf-bangkok",
      // /cost (price_guide) and /activities (activity_occasion). These four
      // SEO sections were EN-hardcoded at the route level until the
      // locale-capable commit; /hotels and /best remain EN-only for now.
      "/activities/bachelor-party-ideas-bangkok",
      "/activities/birthday-party-venues-bangkok",
      "/activities/date-night-ideas-bangkok",
      "/activities/family-activities-bangkok",
      "/activities/golf-simulator-for-non-golfers",
      "/activities/group-activities-bangkok",
      "/activities/indoor-activities-bangkok",
      "/activities/private-party-venues-bangkok",
      "/activities/rainy-day-activities-bangkok",
      "/activities/things-to-do-bangkok-at-night",
      "/activities/weekend-activities-bangkok",
      "/cost/corporate-golf-event-cost-bangkok",
      "/cost/cost-of-renting-golf-clubs-bangkok",
      "/cost/golf-lesson-prices-bangkok",
      "/cost/golf-simulator-prices-bangkok",
      "/cost/how-much-does-golf-cost-bangkok",
      "/cost/lengolf-pricing-guide",
      "/guide/corporate-golf-events-bangkok",
      "/guide/best-time-play-golf-thailand",
      "/guide/nikanti-golf-club-bangkok",
      "/guide/thailand-golf-trip-cost",
      "/guide/alpine-golf-club-bangkok",
      "/guide/thai-country-club-bangkok",
      "/guide/best-golf-courses-near-bangkok",
      "/guide/banyan-golf-club-hua-hin",
      "/guide/best-airlines-fly-golf-clubs-bangkok",
      "/guide/bangkok-bts-guide-golfers",
      "/guide/bangkok-to-hua-hin-golf-transport",
      "/guide/bangkok-hotels-to-golf-courses-transport",
      "/guide/best-bangkok-hotels-golfers",
      "/guide/best-golf-courses-phuket",
      "/guide/black-mountain-golf-club-hua-hin",
      "/guide/first-time-golf-thailand",
      "/guide/don-mueang-airport-to-bangkok",
      "/guide/golf-bangkok-rainy-season",
      "/guide/golf-club-rental-bangkok-guide",
      "/guide/golf-courses-chiang-mai",
      "/guide/golf-hotels-near-bangkok",
      "/guide/golf-thailand-beginners",
      "/guide/golf-tournament-packages-bangkok",
      "/guide/golf-weather-bangkok-by-month",
      "/guide/golfnow-thailand-review",
      "/guide/hotels-near-hua-hin-golf-courses",
      "/guide/how-to-pack-golf-clubs-flight-thailand",
      "/guide/is-thailand-good-for-golf",
      "/guide/suvarnabhumi-airport-to-bangkok-golf",
      "/guide/thai-golf-course-etiquette",
      "/guide/solo-golf-trip-thailand",
      "/guide/thailand-vs-bali-vs-vietnam-golf-holiday",
      "/guide/what-to-wear-golf-thailand",
      "/guide/what-is-a-golf-simulator",
      "/guide/is-indoor-golf-realistic",
      "/guide/golf-simulator-for-non-golfers-guide",
      "/guide/best-golf-simulators-bangkok",
      "/guide/golf-simulator-vs-real-course-bangkok",
    ],
    dynamicRoutePatterns: [],
  },
  zh: {
    staticRoutes: [
      "/",
      "/golf",
      "/lessons",
      "/events",
      "/about-us",
      "/golf-club-rental",
      "/golf-course-club-rental",
      "/menu",
      "/blog",
      // Translated /faq/ hub (content in data/faq-hub.ts CONTENT, NOT a
      // messages namespace — see the header comment in that file). Shipped in
      // the structural-parity batch so the translated per-question FAQ pages
      // no longer sit under an English hub.
      "/faq",
      // Translated /golf-courses/ hub page. THIS LINE is what stops
      // /zh/golf-courses/ 301ing to English: middleware.ts redirects on
      // hasTranslationForLocale(), which reads staticRoutes and nothing else,
      // and origin/main's zh block simply had no "/golf-courses" entry. The
      // GolfCourseHub namespace was added to messages/zh.json in the same
      // batch, but a missing namespace never redirects — next-intl logs
      // MISSING_MESSAGE per render and silently serves the English strings
      // under a /zh/ URL, which is the worse failure this pairing avoids.
      "/golf-courses",
      // Translated guide pages (data/explainer-pages.ts entries with
      // locale: 'zh') — must stay in sync with the data file; the
      // smoke-test registry-consistency check (section I) enforces it.
      "/guide/bring-golf-clubs-thailand-or-rent",
      "/guide/golf-club-baggage-fees-airlines-bangkok",
      "/guide/golf-lessons-bangkok-coaches",
      "/guide/green-fees-bangkok-golf-courses",
      "/guide/how-to-book-golf-tee-times-thailand",
      "/guide/renting-golf-clubs-thai-golf-courses",
      "/guide/round-of-golf-cost-bangkok",
      "/guide/screen-golf-bangkok",
      // Translated region hubs (data/golf-courses-i18n.ts) — kept in sync by the
      // smoke-test region-hub consistency check.
      "/golf-courses/bangkok",
      "/golf-courses/phuket",
      "/golf-courses/pattaya",
      "/golf-courses/hua-hin",
      "/golf-courses/chiang-mai",
      // Structural-parity batch (2026-08): the remaining 9 regions. Every
      // region in lib/golf-courses.ts REGIONS now has a hub in every locale,
      // so no region funnel dead-ends at an English hub.
      "/golf-courses/khao-yai",
      "/golf-courses/kanchanaburi",
      "/golf-courses/isan",
      "/golf-courses/southern-thailand",
      "/golf-courses/koh-samui",
      "/golf-courses/chiang-rai",
      "/golf-courses/north-misc",
      "/golf-courses/khao-lak",
      "/golf-courses/krabi",
      // Translated price-tier pages (data/price-tiers.ts PRICE_TIER_I18N) —
      // kept in sync by the smoke-test price-tier registry consistency check.
      "/golf-courses/under/1500-baht",
      "/golf-courses/under/2500-baht",
      "/golf-courses/under/3500-baht",
      "/golf-courses/under/5000-baht",
      "/golf-courses/under/7500-baht",
      // Translated course-detail pages (data/golf-courses-i18n.ts
      // COURSE_DETAIL_I18N) — kept in sync by the smoke-test course-detail
      // registry consistency check (section J3); liveness of each built page
      // is asserted by section L2. Added in the ko/zh course-detail batch,
      // which closes the funnel PR #88 opened: the 14 region hubs went live
      // in ko/zh with zero translated course pages beneath them, so every
      // course link on those hubs left the locale.
      "/golf-courses/bangkok/sai-golf-club",
      "/golf-courses/bangkok/the-legacy-golf-club",
      "/golf-courses/chiang-mai/lanna-golf-course",
      "/golf-courses/bangkok/pinehurst-golf-country-club",
      "/golf-courses/bangkok/siam-country-club-bangkok",
      "/golf-courses/bangkok/ayutthaya-golf-club",
      "/golf-courses/bangkok/muang-ake-golf-course",
      "/golf-courses/phuket/blue-canyon-lakes-course",
      "/golf-courses/phuket/phuket-country-club",
      "/golf-courses/pattaya/wangjuntr-golf-park",
      "/golf-courses/bangkok/alpine-golf-club",
      "/golf-courses/bangkok/nikanti-golf-club",
      "/golf-courses/bangkok/royal-gems-golf-sports-club",
      "/golf-courses/pattaya/burapha-golf-club",
      "/golf-courses/pattaya/laem-chabang-international",
      // Translated FAQ pages (data/faq-pages.ts entries with this locale) —
      // must stay in sync with the data file; the smoke-test registry-
      // consistency check (section I) enforces it, mirroring the guide check.
      "/faq/how-much-does-indoor-golf-cost-in-bangkok",
      "/faq/can-i-rent-golf-clubs-in-bangkok",
      "/faq/are-rental-golf-clubs-good-enough",
      "/faq/best-way-to-learn-golf-in-bangkok",
      "/faq/how-accurate-are-golf-simulators",
      "/faq/can-beginners-play-golf-simulators",
      "/faq/can-you-play-golf-in-bangkok-when-it-rains",
      "/faq/do-i-need-experience-to-play-golf-simulator",
      "/faq/should-i-bring-golf-clubs-to-thailand-or-rent",
      "/faq/cost-to-fly-with-golf-clubs-to-thailand",
      "/faq/worth-taking-golf-lessons-bangkok-holiday",
      "/faq/what-golf-clubs-available-rent-bangkok",
      // FAQ-completion batch: brings every locale to 31 of 32 FAQ pages.
      // The 32nd (where-to-play-golf-at-night-in-bangkok) is deliberately
      // untranslated — it duplicates where-play-golf-night-bangkok, which is
      // the canonical page (2 inbound internal links vs 0). Translating both
      // would have shipped 8 duplicate pages. The EN pair still wants
      // consolidating with a 301.
      "/faq/how-long-does-simulator-golf-take",
      "/faq/what-to-wear-to-indoor-golf-bar",
      "/faq/can-kids-play-golf-simulators",
      "/faq/practice-golf-swing-without-driving-range-bangkok",
      "/faq/how-much-does-corporate-golf-event-cost-bangkok",
      "/faq/can-you-bring-golf-clubs-as-checked-baggage-thailand",
      "/faq/thailand-visa-guide-golf-tourists",
      "/faq/thailand-entry-requirements-golfers",
      "/faq/best-time-of-day-golf-bangkok",
      "/faq/grab-vs-taxi-bangkok-golf",
      "/faq/how-many-golf-courses-thailand",
      "/faq/last-minute-golf-tee-times-thailand",
      "/faq/golf-shoes-thailand",
      "/faq/golf-fitness-heat-thailand",
      "/faq/do-you-need-caddie-thailand-golf",
      "/faq/how-much-tip-caddie-thailand",
      "/faq/where-play-golf-night-bangkok",
      "/faq/do-you-need-golf-travel-bag-thailand",
      "/faq/how-far-in-advance-book-golf-bangkok",
      // /cost (price_guide) and /activities (activity_occasion). These four
      // SEO sections were EN-hardcoded at the route level until the
      // locale-capable commit; /hotels and /best remain EN-only for now.
      "/activities/bachelor-party-ideas-bangkok",
      "/activities/birthday-party-venues-bangkok",
      "/activities/date-night-ideas-bangkok",
      "/activities/family-activities-bangkok",
      "/activities/golf-simulator-for-non-golfers",
      "/activities/group-activities-bangkok",
      "/activities/indoor-activities-bangkok",
      "/activities/private-party-venues-bangkok",
      "/activities/rainy-day-activities-bangkok",
      "/activities/things-to-do-bangkok-at-night",
      "/activities/weekend-activities-bangkok",
      "/cost/corporate-golf-event-cost-bangkok",
      "/cost/cost-of-renting-golf-clubs-bangkok",
      "/cost/golf-lesson-prices-bangkok",
      "/cost/golf-simulator-prices-bangkok",
      "/cost/how-much-does-golf-cost-bangkok",
      "/cost/lengolf-pricing-guide",
      "/guide/corporate-golf-events-bangkok",
      "/guide/best-time-play-golf-thailand",
      "/guide/nikanti-golf-club-bangkok",
      "/guide/thailand-golf-trip-cost",
      "/guide/alpine-golf-club-bangkok",
      "/guide/thai-country-club-bangkok",
      "/guide/best-golf-courses-near-bangkok",
      "/guide/banyan-golf-club-hua-hin",
      "/guide/best-airlines-fly-golf-clubs-bangkok",
      "/guide/bangkok-bts-guide-golfers",
      "/guide/bangkok-to-hua-hin-golf-transport",
      "/guide/bangkok-hotels-to-golf-courses-transport",
      "/guide/best-bangkok-hotels-golfers",
      "/guide/best-golf-courses-phuket",
      "/guide/black-mountain-golf-club-hua-hin",
      "/guide/first-time-golf-thailand",
      "/guide/don-mueang-airport-to-bangkok",
      "/guide/golf-bangkok-rainy-season",
      "/guide/golf-club-rental-bangkok-guide",
      "/guide/golf-courses-chiang-mai",
      "/guide/golf-hotels-near-bangkok",
      "/guide/golf-thailand-beginners",
      "/guide/golf-tournament-packages-bangkok",
      "/guide/golf-weather-bangkok-by-month",
      "/guide/golfnow-thailand-review",
      "/guide/hotels-near-hua-hin-golf-courses",
      "/guide/how-to-pack-golf-clubs-flight-thailand",
      "/guide/is-thailand-good-for-golf",
      "/guide/suvarnabhumi-airport-to-bangkok-golf",
      "/guide/thai-golf-course-etiquette",
      "/guide/solo-golf-trip-thailand",
      "/guide/thailand-vs-bali-vs-vietnam-golf-holiday",
      "/guide/what-to-wear-golf-thailand",
      "/guide/what-is-a-golf-simulator",
      "/guide/is-indoor-golf-realistic",
      "/guide/golf-simulator-for-non-golfers-guide",
      "/guide/best-golf-simulators-bangkok",
      "/guide/golf-simulator-vs-real-course-bangkok",
    ],
    dynamicRoutePatterns: [],
  },
  ja: {
    staticRoutes: [
      "/",
      "/golf",
      "/lessons",
      "/events",
      "/about-us",
      "/golf-club-rental",
      "/golf-course-club-rental",
      "/menu",
      "/blog",
      // Translated /faq/ hub (content in data/faq-hub.ts CONTENT, NOT a
      // messages namespace — see the header comment in that file). Shipped in
      // the structural-parity batch so the translated per-question FAQ pages
      // no longer sit under an English hub.
      "/faq",
      // Translated guide pages (data/explainer-pages.ts entries with
      // locale: 'ja'). List each translated slug explicitly — a broad
      // /guide/[slug] pattern would let untranslated guides 200 in JA.
      "/guide/bring-golf-clubs-thailand-or-rent",
      "/guide/golf-club-baggage-fees-airlines-bangkok",
      "/guide/golf-lessons-bangkok-coaches",
      "/guide/green-fees-bangkok-golf-courses",
      "/guide/how-to-book-golf-tee-times-thailand",
      "/guide/renting-golf-clubs-thai-golf-courses",
      "/guide/round-of-golf-cost-bangkok",
      "/guide/screen-golf-bangkok",
      // Translated /golf-courses/ hub page (GolfCourseHub namespace) — the
      // entry point for バンコク ゴルフ場 queries. All four locales now serve
      // this hub (ko/zh gained it in the structural-parity batch).
      "/golf-courses",
      // Translated region hubs (data/golf-courses-i18n.ts) — kept in sync by the
      // smoke-test region-hub consistency check.
      "/golf-courses/bangkok",
      "/golf-courses/phuket",
      "/golf-courses/pattaya",
      "/golf-courses/hua-hin",
      "/golf-courses/chiang-mai",
      // Structural-parity batch (2026-08): the remaining 9 regions. Every
      // region in lib/golf-courses.ts REGIONS now has a hub in every locale,
      // so no region funnel dead-ends at an English hub.
      "/golf-courses/khao-yai",
      "/golf-courses/kanchanaburi",
      "/golf-courses/isan",
      "/golf-courses/southern-thailand",
      "/golf-courses/koh-samui",
      "/golf-courses/chiang-rai",
      "/golf-courses/north-misc",
      "/golf-courses/khao-lak",
      "/golf-courses/krabi",
      // Translated price-tier pages (data/price-tiers.ts PRICE_TIER_I18N) —
      // kept in sync by the smoke-test price-tier registry consistency check.
      "/golf-courses/under/1500-baht",
      "/golf-courses/under/2500-baht",
      "/golf-courses/under/3500-baht",
      "/golf-courses/under/5000-baht",
      "/golf-courses/under/7500-baht",
      // Translated course-detail pages (data/golf-courses-i18n.ts
      // COURSE_DETAIL_I18N — see that file for the current set) — kept in
      // sync by the smoke-test course-detail registry consistency check
      // (section J3); liveness of each built page is asserted by section L2.
      "/golf-courses/bangkok/sai-golf-club",
      "/golf-courses/bangkok/the-legacy-golf-club",
      "/golf-courses/chiang-mai/lanna-golf-course",
      "/golf-courses/bangkok/pinehurst-golf-country-club",
      "/golf-courses/bangkok/siam-country-club-bangkok",
      "/golf-courses/bangkok/ayutthaya-golf-club",
      "/golf-courses/bangkok/muang-ake-golf-course",
      "/golf-courses/phuket/blue-canyon-lakes-course",
      "/golf-courses/phuket/phuket-country-club",
      "/golf-courses/pattaya/wangjuntr-golf-park",
      "/golf-courses/bangkok/alpine-golf-club",
      "/golf-courses/bangkok/nikanti-golf-club",
      "/golf-courses/bangkok/royal-gems-golf-sports-club",
      "/golf-courses/pattaya/burapha-golf-club",
      "/golf-courses/pattaya/laem-chabang-international",
      // Translated FAQ pages (data/faq-pages.ts entries with this locale) —
      // must stay in sync with the data file; the smoke-test registry-
      // consistency check (section I) enforces it, mirroring the guide check.
      "/faq/how-much-does-indoor-golf-cost-in-bangkok",
      "/faq/can-i-rent-golf-clubs-in-bangkok",
      "/faq/are-rental-golf-clubs-good-enough",
      "/faq/best-way-to-learn-golf-in-bangkok",
      "/faq/how-accurate-are-golf-simulators",
      "/faq/can-beginners-play-golf-simulators",
      "/faq/can-you-play-golf-in-bangkok-when-it-rains",
      "/faq/do-i-need-experience-to-play-golf-simulator",
      "/faq/should-i-bring-golf-clubs-to-thailand-or-rent",
      "/faq/cost-to-fly-with-golf-clubs-to-thailand",
      "/faq/worth-taking-golf-lessons-bangkok-holiday",
      "/faq/what-golf-clubs-available-rent-bangkok",
      // FAQ-completion batch: brings every locale to 31 of 32 FAQ pages.
      // The 32nd (where-to-play-golf-at-night-in-bangkok) is deliberately
      // untranslated — it duplicates where-play-golf-night-bangkok, which is
      // the canonical page (2 inbound internal links vs 0). Translating both
      // would have shipped 8 duplicate pages. The EN pair still wants
      // consolidating with a 301.
      "/faq/how-long-does-simulator-golf-take",
      "/faq/what-to-wear-to-indoor-golf-bar",
      "/faq/can-kids-play-golf-simulators",
      "/faq/practice-golf-swing-without-driving-range-bangkok",
      "/faq/how-much-does-corporate-golf-event-cost-bangkok",
      "/faq/can-you-bring-golf-clubs-as-checked-baggage-thailand",
      "/faq/thailand-visa-guide-golf-tourists",
      "/faq/thailand-entry-requirements-golfers",
      "/faq/best-time-of-day-golf-bangkok",
      "/faq/grab-vs-taxi-bangkok-golf",
      "/faq/how-many-golf-courses-thailand",
      "/faq/last-minute-golf-tee-times-thailand",
      "/faq/golf-shoes-thailand",
      "/faq/golf-fitness-heat-thailand",
      "/faq/do-you-need-caddie-thailand-golf",
      "/faq/how-much-tip-caddie-thailand",
      "/faq/where-play-golf-night-bangkok",
      "/faq/do-you-need-golf-travel-bag-thailand",
      "/faq/how-far-in-advance-book-golf-bangkok",
      // /cost (price_guide) and /activities (activity_occasion). These four
      // SEO sections were EN-hardcoded at the route level until the
      // locale-capable commit; /hotels and /best remain EN-only for now.
      "/activities/bachelor-party-ideas-bangkok",
      "/activities/birthday-party-venues-bangkok",
      "/activities/date-night-ideas-bangkok",
      "/activities/family-activities-bangkok",
      "/activities/golf-simulator-for-non-golfers",
      "/activities/group-activities-bangkok",
      "/activities/indoor-activities-bangkok",
      "/activities/private-party-venues-bangkok",
      "/activities/rainy-day-activities-bangkok",
      "/activities/things-to-do-bangkok-at-night",
      "/activities/weekend-activities-bangkok",
      "/cost/corporate-golf-event-cost-bangkok",
      "/cost/cost-of-renting-golf-clubs-bangkok",
      "/cost/golf-lesson-prices-bangkok",
      "/cost/golf-simulator-prices-bangkok",
      "/cost/how-much-does-golf-cost-bangkok",
      "/cost/lengolf-pricing-guide",
      "/guide/corporate-golf-events-bangkok",
      "/guide/best-time-play-golf-thailand",
      "/guide/nikanti-golf-club-bangkok",
      "/guide/thailand-golf-trip-cost",
      "/guide/alpine-golf-club-bangkok",
      "/guide/thai-country-club-bangkok",
      "/guide/best-golf-courses-near-bangkok",
      "/guide/banyan-golf-club-hua-hin",
      "/guide/best-airlines-fly-golf-clubs-bangkok",
      "/guide/bangkok-bts-guide-golfers",
      "/guide/bangkok-to-hua-hin-golf-transport",
      "/guide/bangkok-hotels-to-golf-courses-transport",
      "/guide/best-bangkok-hotels-golfers",
      "/guide/best-golf-courses-phuket",
      "/guide/black-mountain-golf-club-hua-hin",
      "/guide/first-time-golf-thailand",
      "/guide/don-mueang-airport-to-bangkok",
      "/guide/golf-bangkok-rainy-season",
      "/guide/golf-club-rental-bangkok-guide",
      "/guide/golf-courses-chiang-mai",
      "/guide/golf-hotels-near-bangkok",
      "/guide/golf-thailand-beginners",
      "/guide/golf-tournament-packages-bangkok",
      "/guide/golf-weather-bangkok-by-month",
      "/guide/golfnow-thailand-review",
      "/guide/hotels-near-hua-hin-golf-courses",
      "/guide/how-to-pack-golf-clubs-flight-thailand",
      "/guide/is-thailand-good-for-golf",
      "/guide/suvarnabhumi-airport-to-bangkok-golf",
      "/guide/thai-golf-course-etiquette",
      "/guide/solo-golf-trip-thailand",
      "/guide/thailand-vs-bali-vs-vietnam-golf-holiday",
      "/guide/what-to-wear-golf-thailand",
      "/guide/what-is-a-golf-simulator",
      "/guide/is-indoor-golf-realistic",
      "/guide/golf-simulator-for-non-golfers-guide",
      "/guide/best-golf-simulators-bangkok",
      "/guide/golf-simulator-vs-real-course-bangkok",
    ],
    dynamicRoutePatterns: [],
  },
};

export const ALL_LOCALES = ["en", "th", "ko", "ja", "zh"] as const;
export type Locale = (typeof ALL_LOCALES)[number];

export const OG_LOCALES: Record<Locale, string> = {
  en: "en_US",
  th: "th_TH",
  ja: "ja_JP",
  ko: "ko_KR",
  zh: "zh_CN",
};

// Pre-compute normalized static routes per locale at module load time
const NORMALIZED_ROUTES = Object.fromEntries(
  Object.entries(TRANSLATED_ROUTES).map(([locale, { staticRoutes }]) => [
    locale,
    staticRoutes.map((r) => (r === "/" ? "/" : r.replace(/\/$/, ""))),
  ]),
);

function normalizePath(pathname: string): string {
  return pathname.replace(/\/$/, "") || "/";
}

/**
 * Check if a given pathname has a translation available for the given locale.
 * Expects a locale-free path (middleware strips /<locale> prefix before calling).
 */
export function hasTranslationForLocale(
  locale: string,
  pathname: string,
): boolean {
  const entry = TRANSLATED_ROUTES[locale];
  if (!entry) return false;

  const normalizedPath = normalizePath(pathname);
  const normalizedStatic = NORMALIZED_ROUTES[locale] ?? [];

  if (normalizedStatic.includes(normalizedPath)) return true;

  for (const pattern of entry.dynamicRoutePatterns) {
    const regex = new RegExp("^" + pattern.replace(/\[slug\]/g, "[^/]+") + "$");
    if (regex.test(normalizedPath)) return true;
  }

  // Blog posts are slug-accurate: a locale only "has" /blog/<slug> when that
  // exact slug is in BLOG_TRANSLATED_SLUGS[locale] (mirrors the DB). This
  // replaces the old coarse '/blog/[slug]' dynamic pattern that matched EVERY
  // slug and let untranslated posts through the middleware to a 404.
  const blogMatch = normalizedPath.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const slugs = BLOG_TRANSLATED_SLUGS[locale as keyof typeof BLOG_TRANSLATED_SLUGS];
    if (slugs?.includes(blogMatch[1])) return true;
  }

  return false;
}

/**
 * @deprecated Use hasTranslationForLocale('th', pathname) instead.
 */
export function hasThaiTranslation(pathname: string): boolean {
  return hasTranslationForLocale("th", pathname);
}

/**
 * Guide paths registered as translated for `locale` (the '/guide/...' entries
 * in staticRoutes). This registry cannot import data/explainer-pages.ts (it is
 * bundled into the edge middleware), so the smoke tests assert this list stays
 * in sync with the locale-tagged entries in the data file — see
 * scripts/smoke-test.ts registry-consistency check.
 */
export function getRegisteredGuidePaths(locale: string): string[] {
  return (TRANSLATED_ROUTES[locale]?.staticRoutes ?? []).filter((r) =>
    r.startsWith("/guide/"),
  );
}

/**
 * FAQ paths registered as translated for `locale` (the '/faq/...' entries in
 * staticRoutes). Mirrors getRegisteredGuidePaths — this registry cannot
 * import data/faq-pages.ts (it is bundled into the edge middleware, and
 * data/faq-pages.ts runtime-imports lib/pricing), so the smoke tests assert
 * this list stays in sync with the locale-tagged entries in the data file —
 * see scripts/smoke-test.ts registry-consistency check.
 */
export function getRegisteredFaqPaths(locale: string): string[] {
  return (TRANSLATED_ROUTES[locale]?.staticRoutes ?? []).filter((r) =>
    r.startsWith("/faq/"),
  );
}

/**
 * Blog-post paths registered as translated for `locale` (the '/blog/<slug>'
 * URLs whose slug has a published translation). Mirrors getRegisteredGuidePaths
 * — this registry cannot import the DB (it is bundled into the edge
 * middleware), so it reads the committed BLOG_TRANSLATED_SLUGS mirror of
 * public.blog_post_translations. The CI check `npm run validate:blog-slugs`
 * (scripts/sync-blog-translated-slugs.ts --check) asserts that mirror matches
 * the DB, keeping this in sync the same way the smoke tests keep the guide/FAQ
 * lists in sync.
 */
export function getRegisteredBlogPaths(locale: string): string[] {
  const slugs =
    BLOG_TRANSLATED_SLUGS[locale as keyof typeof BLOG_TRANSLATED_SLUGS] ?? [];
  return slugs.map((slug) => `/blog/${slug}`);
}

/**
 * Region-hub paths registered as translated for `locale` (the two-segment
 * '/golf-courses/<region>' entries in staticRoutes). Like getRegisteredGuidePaths,
 * this registry cannot import data/golf-courses-i18n.ts (it is bundled into the
 * edge middleware), so the smoke tests assert this list stays in sync with the
 * translations in the data file — see scripts/smoke-test.ts region-hub
 * consistency check. The length===2 filter excludes deeper course-detail paths.
 */
export function getRegisteredRegionHubPaths(locale: string): string[] {
  return (TRANSLATED_ROUTES[locale]?.staticRoutes ?? []).filter(
    (r) =>
      r.startsWith("/golf-courses/") &&
      r.split("/").filter(Boolean).length === 2,
  );
}

/**
 * Price-tier paths registered as translated for `locale` (the three-segment
 * '/golf-courses/under/<tier>' entries in staticRoutes). Like
 * getRegisteredRegionHubPaths, this registry cannot import data/price-tiers.ts
 * for the tier prefix check (kept consistent with the sibling helpers even
 * though price-tiers.ts itself has no server-only guard), so the smoke tests
 * assert this list stays in sync with PRICE_TIER_I18N — see scripts/smoke-test.ts
 * price-tier registry consistency check. The prefix + length===3 filter
 * excludes the two-segment region-hub paths above.
 */
export function getRegisteredPriceTierPaths(locale: string): string[] {
  return (TRANSLATED_ROUTES[locale]?.staticRoutes ?? []).filter(
    (r) =>
      r.startsWith("/golf-courses/under/") &&
      r.split("/").filter(Boolean).length === 3,
  );
}

/**
 * Course-detail paths registered as translated for `locale` (the
 * '/golf-courses/<region>/<slug>' entries in staticRoutes). Like the sibling
 * helpers, this registry cannot import data/golf-courses-i18n.ts (it is
 * bundled into the edge middleware), so the smoke tests assert this list
 * stays in sync with COURSE_DETAIL_I18N — see scripts/smoke-test.ts
 * course-detail registry consistency check (section J3). A naive
 * three-segment filter would also swallow the programmatic
 * near/under/best-for/compare families (e.g. '/golf-courses/under/1500-baht'
 * is three segments), so those sub-prefixes are excluded explicitly.
 */
const NON_DETAIL_COURSE_SEGMENTS = new Set(["under", "near", "best-for", "compare"]);

export function getRegisteredCourseDetailPaths(locale: string): string[] {
  return (TRANSLATED_ROUTES[locale]?.staticRoutes ?? []).filter((r) => {
    if (!r.startsWith("/golf-courses/")) return false;
    const segments = r.split("/").filter(Boolean);
    return segments.length === 3 && !NON_DETAIL_COURSE_SEGMENTS.has(segments[1]);
  });
}

/**
 * Href for a course-detail page from a `locale` surface, prefixed ONLY when
 * that course actually has a translation in that locale.
 *
 * The two map components used to get this wrong in opposite directions, and
 * both were invisible until the structural-parity batch took the translated
 * hubs from 20 to 56:
 *   - the hub map prefixed every href, so on /ko/ and /zh/ — which have zero
 *     course-detail translations — every rendered link 301'd to English. That
 *     is 132 links, not 149: HubMapExplorer drops any course failing
 *     hasTrustedCoordinates() before it ever builds a marker, and 17 of the
 *     149 fail (4 with null coordinates, 13 with an axis below 3dp). 149 is the size
 *     of the `hrefs` map the server hands the component, not the link count;
 *   - the region map prefixed none, so the 15 courses that DO have th/ja
 *     pages sent a Japanese reader to the English one.
 * Resolving per course on the server fixes both and keeps TRANSLATED_ROUTES
 * out of the client bundle (these components are 'use client').
 *
 * Trailing slash included: trailingSlash is true, and the hub map injects a
 * raw <a href> into a Maps InfoWindow, which gets no framework normalization.
 */
export function courseDetailHref(
  locale: string,
  region: string,
  slug: string,
): string {
  const path = `/golf-courses/${region}/${slug}`;
  return hasTranslationForLocale(locale, path) ? `/${locale}${path}/` : `${path}/`;
}

/**
 * Return the set of locales (including 'en') that have a translation for this path.
 */
export function getLocalesForPath(pathname: string): Locale[] {
  const normalizedPath = normalizePath(pathname);
  // English is always available (it's the default locale, source of truth)
  const locales: Locale[] = ["en"];
  for (const locale of ["th", "ko", "ja", "zh"] as const) {
    if (hasTranslationForLocale(locale, normalizedPath)) {
      locales.push(locale);
    }
  }
  return locales;
}

function localePrefix(locale: Locale): string {
  return locale === "en" ? "" : `/${locale}`;
}

function pathSuffix(pathname: string): string {
  const normalized = normalizePath(pathname);
  return normalized === "/" ? "/" : `${normalized}/`;
}

/**
 * Build an hreflang alternates object for `Metadata.alternates.languages` and
 * `sitemap.alternates.languages`. The returned object maps each available locale
 * to its absolute URL. English is always included.
 *
 * Example: getAlternates('/golf/') →
 *   { en: 'https://www.len.golf/golf/', th: 'https://www.len.golf/th/golf/', ... }
 */
export function getAlternates(pathname: string): Record<string, string> {
  const suffix = pathSuffix(pathname);
  const locales = getLocalesForPath(pathname);
  return Object.fromEntries(
    locales.map((l) => [l, `${SITE_URL}${localePrefix(l)}${suffix}`]),
  );
}

/**
 * Build the canonical URL for `pathname` in the given `locale`. Mirrors the
 * prefix scheme used by `getAlternates`.
 */
export function getCanonical(locale: string, pathname: string): string {
  const suffix = pathSuffix(pathname);
  const l: Locale = (ALL_LOCALES as readonly string[]).includes(locale)
    ? (locale as Locale)
    : "en";
  return `${SITE_URL}${localePrefix(l)}${suffix}`;
}

/**
 * Canonical URL for `pathname` in `locale` — but only when the locale
 * actually has that route; otherwise the EN canonical. For JSON-LD
 * (breadcrumbs etc.): an untranslated locale URL 301s through the middleware,
 * and redirecting URLs don't belong in structured data. Shared by the
 * /golf-courses hub-crumb builders on both the [region] and [region]/[slug]
 * pages.
 */
export function getResolvedCanonical(locale: string, pathname: string): string {
  return hasTranslationForLocale(locale, pathname.replace(/\/$/, ""))
    ? getCanonical(locale, pathname)
    : getCanonical("en", pathname);
}
