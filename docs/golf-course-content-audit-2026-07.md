# Golf Course Content System — Audit & Roadmap (July 2026)

Scope: the `/golf-courses/**` cluster — 149 course detail pages, 14 region hubs
(+20 translated), 31 compare pages, 10 near-station/airport pages, 25 price-tier
pages, 6 best-for pages (~256 URLs). Audited across four dimensions (template/data
architecture, SEO/structured data, internal linking, conversion UX) plus 90 days
of Search Console data.

## What the data said (GSC, 90 days to 2026-07-27)

- Course pages **rank well but convert impressions poorly**: Lanna (1,675
  impressions, position 5.1, 0.6% CTR), Suvarnabhumi (1,271 impr, pos 25),
  Dancoon (463 impr, pos 8.7, 3.0% CTR). Weak CTR at good positions points at
  titles/snippets/rich results, not content quality.
- **Compare pages work**: ~2,400 combined impressions at positions 7–11 despite
  being near-orphaned in the link graph.
- **Hubs underperform head terms**: "/golf-courses/" at position 29 for its own
  queries; "bangkok golf courses" position 66, "chiang mai golf courses" 28.9.
  Consistent with the hub having had zero crawlable links to its own courses.
- Rich results: essentially none showing (388 product-snippet impressions, no
  FAQ/review appearances) — structured-data headroom.
- Rental funnel: `/golf-course-club-rental` earned ~84 clicks/90d; JA/KO/ZH
  variants convert impressions to clicks 3–4× better than EN.

## Architecture summary

- **Data**: 149 static TS files in `data/golf-courses/<region>/`, one typed
  `GolfCourse` each (`types/golf-courses.ts`), aggregated by per-region
  `index.ts`. High fill rates on core fields (fees 95%, coords 97%, five prose
  sections 100%). All EN-only; `locales.ko/zh/ja` slots exist but are 100% null.
- **Templates**: one detail template (`components/golf-courses/CoursePage.tsx`),
  one hub map/roster explorer (client), and four programmatic roundup routes
  sharing `RoundupList` / `SpecTable` / `CrossLinkBlock` / `RentalCtaBanner`.
  Derivations (popularity, proximity, pairs, tiers, use-cases) are centralized
  in `lib/golf-courses-derived.ts` — this is the system's biggest strength: a
  new course file automatically joins hubs, roundups, compares, and the sitemap.
- **Weaknesses found**: hand-serialized `schema_markup` strings needing
  render-time patching; boilerplate titles (134/149 same 45-char suffix,
  guaranteed SERP truncation) and descriptions (77/149 identical modulo name);
  region hub rosters rendered as `<button>`s (zero crawlable hub→course links;
  ~50 course pages had **no** crawlable internal inbound link at all); sibling
  links taken alphabetically (the first 3 courses per region absorbed every
  sibling link); Bangkok-only BTS links emitted on Phuket pages ("688 km from
  Silom — same district"); 4 hard-404 `/location/<area>` links on station pages;
  no FAQ content/schema; no rental-CTA analytics anywhere on the cluster; the
  mobile sticky bar sold simulator bays on course pages.

## Implemented in this change (all ~150 pages at once)

1. **Crawlable link graph**
   - Region-hub roster rows are now real `<a href>` links (plain click still
     drives the map; modified clicks navigate) → 149 hub→course links restored.
   - `getRelatedCourses()` (lib/golf-courses-derived.ts): nearest-neighbour
     siblings instead of `slice(0,3)` on alphabetical order — inbound links now
     spread across the entire roster, and the module is genuinely "courses near
     this one".
   - Region hubs link their compare pages (`CrossLinkBlock`, EN-only).
   - Course pages link their price-tier page (Bangkok-range courses only).
   - Use-case cross-link now picks the *rarest* matching page (was: first-match,
     which starved `families`/`high-handicappers` of links).
   - BTS cross-link gated to `region === 'bangkok'`.
   - Fixed 4 hard-404 station-page links (`/location/asok` →
     `/location/indoor-golf-asok` etc.).
   - Footer "Discover More" now links `/golf-courses/` (first sitewide entry
     point for the 250+ page cluster; all 5 locales).

2. **Metadata & structured data, centralized (`lib/course-seo.ts`,
   `lib/jsonld-courses.ts`)**
   - `getCourseTitle` / `getCourseDescription`: short name-first titles
     (~56 chars rendered vs ~82 before) and unique data-driven descriptions
     (holes/designer/province/fee/drive time) replacing the boilerplate.
   - `getCourseDetailJsonLd`: GolfCourse schema derived from typed fields —
     adds `description`, green-fee `makesOffer`, `hasMap`, holes/par
     `additionalProperty`, stable `@id`; retires the drift-prone
     `schema_markup` strings (still present in data files, now unused by the
     detail route).
   - `getCourseFaqs` + `CourseFaq` component + FAQPage JSON-LD: 3–4 Q&As per
     course (green fee, distance, caddie policy, club rental) generated from
     data — the same array renders visibly and feeds the schema, so they can't
     drift. The club-rental answer introduces LENGOLF factually, with no
     hardcoded price (avoids desync with Supabase pricing).
   - Detail route now sets `revalidate = 86400` + `dynamicParams = false`,
     matching the sibling programmatic routes.

3. **Visuals without photo licensing**
   - Generated branded OG cards (`lib/og-card.tsx` + `opengraph-image.tsx`
     routes) for course detail, region hubs, and the main hub; also fills the
     GolfCourse schema `image` slot.
   - Satellite-view course map (`CourseSatelliteMap`) on every course page
     with coordinates (145/149) — live Maps JS API display (within Google
     ToS), lazy-initialised via IntersectionObserver so it can't hurt LCP,
     degrading to an external Google Maps link. The link is synthesized from
     coords when `google_maps_url` is null (previously absent on half the
     pages). Maps script loader deduplicated into `lib/maps-loader.ts`
     (was copy-pasted in both explorers).

4. **Conversion & measurement**
   - `CoursePage` now uses the shared `RentalCtaBanner` (deleted the inline
     duplicate) with the per-course `rental_cta_context` as body.
   - `rental_intent` tracking added to the cluster: new sources `course_page`
     (banner on 149 detail pages), `course_sticky` (mobile bar), `seo_page`
     (banner on near/compare/under/best-for). New `TrackedRentalLink` client
     wrapper; the cluster's contribution to rental demand is now measurable in
     GTM/Smart Bidding.
   - Mobile sticky bar on `/golf-courses/*` now sells **club rental** (→
     `/golf-course-club-rental`) instead of simulator bays.
   - Sidebar nudge copy differentiates ("current-generation … not house
     clubs", multi-day discounts, hotel delivery) instead of competing head-on
     with the course's cheaper on-site fee shown two cards above.

## Backlog — highest ROI next (in order)

1. ~~**Per-course OG images**~~ **DONE** — `lib/og-card.tsx` + file-convention
   `opengraph-image.tsx` routes for course detail, region hubs, and the main
   hub; generated card also fills the GolfCourse schema `image` slot. Real
   photos remain a follow-up (embed official YouTube/Instagram on top pages;
   permission outreach for owned photos — see tiered plan discussed 2026-07-28).
2. **Localize course detail pages** (high impact, high effort): JA/KO/ZH rental
   pages already out-convert EN 3–4×. The `locales` slots exist and are empty;
   `CoursePage.tsx` needs `useTranslations` plumbing first. Follow the
   `seo-translation-batch` skill/registry process. Start with the top-20
   courses by impressions, not all 149.
3. **Region-hub ItemList/CollectionPage schema** (quick win): reuse
   `getCourseRoundupJsonLd` on region hubs and the main hub.
4. ~~**Fee freshness system**~~ **DONE** (2026-07-30, after the Artitaya ฿400
   incident): `fees_verified_at` + `operational_status`/`operational_note`
   fields, `validate:courses` CI gate, "rates checked" rendering, closure
   banner + closure-first FAQ. 17 suspect courses researched against live
   sources: 5 repriced (Artitaya 1,200/1,400 all-in; Royal Lakeside
   2,900/3,900; Forest Hills 1,350/1,600; Dragon Hills foreigner 1,560/1,750;
   Suvarnabhumi/Phoenix Gold 999/1,199), 3 minor corrections (Ubolratana
   520/720, Muang Ake 700 wd, Korea GC 800 all-in), 4 verified correct, 3
   marked closed (Royal Dusit permanently — site is King Rama IX Memorial
   Park; Rangsit + Star temporarily), 2 nulled as unverifiable (Seoul Siam,
   Kumlung-Ake). Remaining: feed sitemap lastModified from fees_verified_at.
5. **Popularity score** currently ≈ green fee (`popularityScore`), so "top
   courses" ≈ "most expensive" and the 7 fee-less courses never surface.
   Blend in GSC impressions (static snapshot file) or editorial rank.
6. **`x-default` hreflang** missing across all translated clusters
   (`getAlternates` in lib/translated-routes.ts).
7. **Titles of `under/*` and `best-for/*`** say "Bangkok-Area" but lists pull
   from all 14 regions — either filter by distance or retitle.
8. **Phoenix Gold / Suvarnabhumi merge** — web research (2026-07-30) confirmed
   `bangkok/suvarnabhumi-golf-country-club` and
   `bangkok/phoenix-gold-golf-country-club` are the SAME 36-hole RTJ Jr.
   course in Nong Chok (ex-President CC, renamed Phoenix Gold Golf Bangkok).
   Both pages' fees/prose are now aligned and truthful, but one slug should
   301 to the other (needs a next.config redirect + index/sitemap removal +
   GSC awareness — the suvarnabhumi slug carries the search traffic).
   `pattaya/phoenix-gold-golf-club-pattaya` is the genuine Pattaya sister.
9. **llms.txt**: list region hubs for EN (currently non-EN only) and consider
   listing course pages for AI-crawler discovery.
10. **Airport pages** (`near/suvarnabhumi-airport`, `near/don-mueang-airport`)
    are linked only from each other — add them to the main hub's station grid.

## Notes for future edits

- The `schema_markup` field in `data/golf-courses/*/*.ts` is now dead weight
  for the detail page (kept for compatibility; list pages never used it). A
  follow-up data-file sweep can delete it (~1–2 KB × 149 files).
- `club_rental_available === false` exists in code but not in data (134 true /
  15 null / 0 false) — the strongest rental pitch never renders. If research
  confirms any course genuinely lacks rentals, set it to `false`.
- When adding message keys consumed by SSG'd translated routes, remember the
  `SSG_UI_NAMESPACES` allowlist in `scripts/validate-i18n.ts` (see CLAUDE.md).
