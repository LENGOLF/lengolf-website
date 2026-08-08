# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LENGOLF website — a Next.js 15 (App Router) site for an indoor golf simulator facility in Bangkok (The Mercury Ville @ BTS Chidlom). Supabase-backed with static/ISR rendering, deployed on Vercel at https://len.golf. Originally migrated from WordPress.

## Commands

- **Dev server:** `npm run dev` (http://localhost:3000)
- **Build:** `npm run build`
- **Start production:** `npm run start`
- **Lint:** `npm run lint`
- **Validate internal links:** `npm run validate:links` — checks that SEO cross-links in `data/*.ts` (`related_slugs`, FAQ `related_questions`) resolve to published pages. No server needed.
- **Validate i18n house style:** `npm run validate:i18n` — lints localized guide content (ja/ko/zh/th entries in `data/explainer-pages.ts` and `data/faq-pages.ts`, `REGION_HUB_I18N` in `data/golf-courses-i18n.ts`, `PRICE_TIER_I18N` in `data/price-tiers.ts`, per-course `locales.<locale>` in `data/golf-courses/*/*.ts`, the non-EN blocks of `CONTENT` in `data/faq-hub.ts`) plus the **UI chrome strings in `messages/{ja,ko,zh,th}.json`** against the machine-readable glossaries in `data/i18n-glossary/*.json`. ERROR-level (fails): emoji, exclamation marks, full-width digits (ja), terminology `avoid` variants, brand-immutable case corruption, unbalanced `**`/unbalanced braces (see the ICU bullet below), and a UI-message namespace entirely missing from a locale catalog (see next bullet). WARN-level (non-blocking): currency-convention drift, unscoped honesty claims, prices with no "as of" marker, individual UI-message key gaps vs `messages/en.json`. Automates the mechanical subset of `docs/i18n-review-checklist.md`; `--self-test` proves the detectors. No server needed.
- **The `messages/*.json` corpus is ERROR-checks-only** (`uiChrome` in `scripts/validate-i18n.ts`). The three WARN checks are entry-shaped prose rules that don't transfer to microcopy: `price-as-of` assumes an entry is an article that can carry a date marker in its prose, but a hero subtitle reading `1時間550バーツ〜` has nowhere to put one (the live price lives in `data/pricing.ts`); `currency` and `honesty` are calibrated for long-form text and misfire on 3-word stat badges. Running them over the catalogs would have added ~200 standing warnings, which is how a linter teaches people to ignore it. English is excluded from this corpus by design — the glossaries encode *target*-language terminology, so linting the source language against them is meaningless.
- **`checkMarkup` runs TWO brace rules, split by dialect — do not collapse them.** `checkMarkup()` in `scripts/validate-i18n.ts` used to count literal `{{` vs `}}` bigrams. That fit the `{{token}}` placeholders in `data/explainer-pages.ts` but hard-failed every ICU plural, because `{count, plural, =1 {…} other {# …}}` ends in a `}}` with no `{{` anywhere; `messages/en.json` is excluded from the corpus so EN never hit it, and the non-EN workaround was a **load-bearing space** before the final brace. Since PR #88 the check is (a) a structural brace **depth-scan** on everything, plus (b) the old bigram equality **scoped to the `{{token}}` dialect** (non-`uiChrome` units) via the `dialect` parameter. Both are needed, and **depth-scanning alone is weaker, not stronger** — this was the review finding on PR #88 after exactly that claim was made: `{{bayHourlyFrom} }` is brace-*balanced* and sails through the depth-scan, but `lib/site-facts.ts` substitutes on `/\{\{\s*(\w+)\s*\}\}/g`, so the split closer misses the anchor, `replace()` no-ops, and the raw token ships to visitors **without throwing** (the throw there only fires for well-formed tokens with unknown names). That shape is the load-bearing space itself. Conversely the depth-scan catches `}}{{`, which the bigram counter passed 1-for-1. The scoping is safe only because the dialects don't mix: `messages/*.json` has no `{{token}}`, the content data has no ICU. Known gap: ICU escapes a literal brace by quoting (`Use '{' here`), which the depth-scan reads as unclosed — nothing does this today; strip ICU-quoted spans before scanning if it ever comes up. **When adding an ICU plural to a non-EN catalog, write it normally — no spacing tricks.**
- **Pluralization is a per-language decision, not a mechanical five-locale edit.** Precedent: `GolfCourseRegion.metaDescription` rendered "all 1 golf courses" on the three single-course region hubs (`north-misc`, `khao-lak`, `krabi` — `courseCount: 1` in `REGION_META`). EN needed a real `plural` with a `=1` branch. **TH did not** — Thai has no grammatical plural and `1 แห่ง` was already correct; the awkwardness was `ครบทั้ง` ("the complete set of") applied to one item, so its `=1` branch drops that phrase and keeps the same measure word. **ja/ko/zh needed no change at all** — no plural morphology, and `{count}か所 / {count}곳 / {count}座` read correctly at 1. Don't reach for `{count, plural, …}` in a CJK catalog just because EN got one. The corollary for the `GolfCourseHub` region cards: the count must live **inside** the message (`coursesCount`) rather than being interpolated next to a bare noun key, because a noun sitting outside the message has no `count` to agree with — that is exactly how "1 courses" shipped. All five locales carry `coursesCount`; only EN inflects.
- **Emoji detection is an allowlist subtraction, not a narrowed property test.** `emojiHit()` in `scripts/validate-i18n.ts` strips `© ® ™ ★ ☆` and then tests `\p{Emoji_Presentation}|\p{Extended_Pictographic}`. Adding the `messages/*.json` corpus exposed two false positives in the old bare-`Extended_Pictographic` check: the `©` in `© {year} LENGOLF CO., LTD.` (a legal mark, identical in the English source) and the `★` in `★{rating} / Googleレビュー{count}件` (a rating glyph in the trust chip). **Do not "fix" that by narrowing to `\p{Emoji_Presentation}`** — that silently disarms the check for every pictograph defaulting to text presentation (`❤ ⚠ ➡ ✔ ✈ ☀`), and browsers colour a bare `❤` anyway, so it ships as decoration with the linter silent. Two false positives aren't worth six false negatives; this was caught in review on PR #73 after exactly that narrowing was proposed. The `Emoji_Presentation` alternative is kept because it adds regional-indicator flags (🇯🇵), which aren't `Extended_Pictographic` and which the original check missed. Self-test asserts both directions, including that bare text-presentation pictographs still fail.
- **`checkTerminology` is plain-substring, so an `avoid` token can false-positive inside a longer legitimate word.** Precedent (PR #73): zh `avoid: ["球场费"]` (wrong form of *green fee*) matched inside `球场费用` — which was translating "on-course fee", a deliberately broader liability covering caddie/cart/transfer. "Correcting" it to `果岭费用` narrowed a live customer-liability line on the zh `/lessons` page. Resolved by rewording to `下场费用`, which keeps the breadth and contains neither token. When this check fires, confirm the flagged phrase actually means the glossary term before rewriting it — check `messages/en.json` and the ja/ko renderings first.
- **Dead English entries in the CJK catalogs are expected, not bugs.** `Home.*`, `HomeFaq.*` and `SecondHandClubs*` are still English in `messages/{ko,zh}.json` (and `SecondHandClubs*` in `ja` too). They never render: `app/[locale]/page.tsx` returns the bespoke `JapanLandingPage`/`KoreaLandingPage`/`ChinaLandingPage` before `getTranslations('Home')` or `'HomeFaq'` is reached, and `/second-hand-golf-clubs-bangkok` is EN-only (untranslated locale routes 301 to English). Don't "fix" them by translating without first confirming a consumer exists, and don't read the `!` in them as live copy.
- **UI-message namespace parity (part of `validate:i18n`):** when a page starts SSG-ing a new locale (e.g. adding entries to `getTranslatedPriceTierParams()`), every `useTranslations('...')` namespace it consumes must exist in that locale's `messages/<locale>.json` — next-intl logs `MISSING_MESSAGE` per render during build and silently falls back to English (no build failure), so a repeated `MISSING_MESSAGE` in the build log is a real bug, not noise. `validate:i18n` guards this for the namespaces in the `SSG_UI_NAMESPACES` allowlist (`scripts/validate-i18n.ts`: `GolfCourseShared`, `GolfCoursePriceTier`, `GolfCourseRegion`, `GolfCourseHub`, `GolfCourseDetail`, `ExplainerPage`, `FaqPage`, `ContactInfo`): the locales that SSG those pages — derived from the registry helpers in `lib/translated-routes.ts` — must have the namespace in `messages/<locale>.json` with the same (flattened) key set as `messages/en.json`. Namespace missing entirely = ERROR; individual missing keys = WARN. Precedent: `GolfCourseShared` was missing from ja/ko/zh (~480 warnings/build) until PR #78. When a translated route starts consuming a NEW namespace, add it to `SSG_UI_NAMESPACES`; namespaces outside the allowlist are still unchecked.
- **Body markdown is `**bold**`-only:** explainer/FAQ `body` strings are rendered by `components/shared/BoldText.tsx`, which handles `**bold**` but NOT single-asterisk `*italics*` — italic markup ships as literal asterisks (one pre-existing case: the exchange-rate footnote in `gg-thailand-golf-trip-cost`). Write footnote/aside lines as plain text, e.g. the as-of markers `(ข้อมูล ณ กรกฎาคม 2026)`.
- **Validate course fees and region rosters:** `npm run validate:courses` — lints `data/golf-courses/*/*.ts`. Two ERROR classes (either fails CI). **Fees:** fee outside ฿150–฿20,000, weekend cheaper than weekday, malformed `fees_verified_at`, or a suspicious pattern (weekday under ฿600 — the classic scraped Thai-national/9-hole/promo rate — or weekend >2.2× weekday) on a course with no `fees_verified_at` attestation. **Region rosters** (`checkRegionCounts`): `REGION_META.courseCount` in `lib/golf-courses.ts` disagreeing with the region's `index.ts` slugs, an index slug with no file, a file with no index slug, a missing `index.ts`, or a course directory with no `REGION_META` entry. Three sources of truth — the advertised count, the `index.ts` slugs that actually render, and the files on disk — and a re-region that updates two of the three leaves the hub advertising a number it does not render *and* possibly selecting the wrong ICU plural branch. Files are keyed by DIRECTORY, not by the `region` field, because the directory builds the URL. WARN: attested-but-suspicious fees, attestations older than 18 months, coordinates rounded below 3dp, `coordinates_verified_at` over 18 months old. When correcting a fee, also grep the course's `prose` for the old number — fees are often repeated in prose text. No server needed.
- **Verify course coordinates:** `npm run verify:coordinates` (report) / `npm run verify:coordinates -- --write` (apply). Batch-checks every course's lat/lng against the Google Places API and stamps `coordinates_verified_at`. Needs a **server-side** key: `GOOGLE_MAPS_SERVER_API_KEY=... npm run verify:coordinates` — do NOT reuse `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` if it is HTTP-referrer restricted (referrer-locked keys reject server calls). Costs a Places Text Search per course (~149 requests). Coordinates gate real output: `hasTrustedCoordinates()` in `lib/geo.ts` withholds the satellite map pin and schema.org `GeoCoordinates` unless the coordinates are attested or precise to ≥3dp, and `courseMapsUrl()` falls back to a name+province Google search rather than linking unverified coordinates.
- **Smoke tests:** `npm run test:smoke` (requires a running server on localhost:3000)
- **Page inventory:** `npm run inventory [base-url]` — table of published pages per section × language (EN/TH/JA/KO/ZH), parsed from the sitemap. Needs a running server **with DB access** (real `.env.local`), else DB-driven blog/location sections read 0. Point at prod with `npm run inventory https://www.len.golf`.
- **Migrate blog posts:** `npx tsx scripts/migrate-blog-posts.ts` (one-time migration, already run)
- **Import location pages:** `npx tsx scripts/import-location-pages.ts` (one-time migration, already run)

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every PR to `main`:

- **`lint`** — `npm run lint` with ESLint flat config (`eslint.config.mjs`), then `npm run validate:links` (internal SEO cross-link validator), then `npm run validate:i18n` (i18n house-style/honesty linter — mechanical subset of the native-QA rubric), then `npm run validate:courses` (green-fee plausibility **and** region-roster/`courseCount` agreement gate; a red "lint" check can be any of the four)
- **`build-and-smoke`** — builds the app, starts the production server, runs smoke tests across 18 categories (per-category test counts live in `scripts/smoke-test.ts`):
  - **A) Route tests** — pages across all locales return 200 with `<main id="main-content">`
  - **B) Redirect tests** — WordPress legacy URLs, GSC 404 fixes, and location redirects
  - **C) Link checks** — booking.len.golf, LINE, Supabase Storage assets are reachable
  - **D) SEO checks** — title, meta description, canonical (www.len.golf), JSON-LD, `lang` attribute
  - **E) Locale redirect tests** — untranslated th/ko/ja/zh routes redirect to English
  - **F) Locale cookie tests** — English pages work with a NEXT_LOCALE cookie set
  - **G) WordPress 404 tests** — legacy WordPress paths return 404 (prevent redirect regressions)
  - **H) LLM / AI discoverability** — llms.txt served as text, robots.txt names AI crawlers, opening-hours schema consistent
  - **I) Translated-guide registry consistency** — the `/guide/...` allowlist in `lib/translated-routes.ts` must match the locale-tagged entries in `data/explainer-pages.ts` (pure import check, no server)
  - **J) Translated region-hub registry consistency** — the `/golf-courses/<region>` allowlist in `lib/translated-routes.ts` must match the translations in `data/golf-courses-i18n.ts` (pure import check, no server)
  - **J2) Translated price-tier registry consistency** — the `/golf-courses/under/<tier>` allowlist in `lib/translated-routes.ts` must match the translations in `data/price-tiers.ts` (pure import check, no server)
  - **J3) Translated course-detail registry consistency** — the `/golf-courses/<region>/<slug>` allowlist in `lib/translated-routes.ts` must match `COURSE_DETAIL_I18N` in `data/golf-courses-i18n.ts` both directions (pure import check, no server); with `dynamicParams = false` on the route, a one-sided edit is a hard 404 advertised by hreflang
  - **K) Data-driven internal-link liveness** — every `related_slugs` path outside the statically-validated SEO prefixes (`/location`, `/golf-courses`, core routes) is fetched live and must not 404 (complements `npm run validate:links`)
  - **L) Blog translated-slug registry liveness** — every path registered in `data/blog-translated-slugs.ts` must serve 200 (catches the data file running ahead of the DB, which `dynamicParams = false` turns into a 404)
  - **L2) Course-detail translated registry liveness** — every registered `/golf-courses/<region>/<slug>` translation must serve 200 **with** `<main id="main-content">`; derived from the registry, so new translation batches are covered with zero routeTests edits (routeTests keeps one th + one ja canary only)
  - **L3) Region-hub translated registry liveness** — every registered `/golf-courses/<region>` translation must serve 200 with `<main id="main-content">`. L2's guard one level up the hub tree, and registry-derived like L2, so a future region batch needs zero routeTests edits (56 hub URLs covered today)
  - **M) Wayfinding copy** — BTS Chidlom is **Exit 4** (The Mercury Ville). 14 assertions: the six DB-driven `/location/*-chidlom` pages (`location_pages.bts_route`, unreachable by any static lint), plus the repo-owned strings — `HomeJa/HomeKo/HomeZh.accessBts` in `messages/*.json` (3), the hardcoded EN line in `app/[locale]/golf-in-thailand-guide/page.tsx` (1), and `directions.steps` in `data/faq-hub.ts` on `/{th,ja,ko,zh}/faq/` (4). The faq-hub four are a **second, independent copy** of the wayfinding: the landing-page checks read `messages/*.json` and would all still pass if faq-hub regressed. Each check is a matched pair — correct string present *and* wrong-exit shape absent — so dropped copy fails rather than passing vacuously. Assertions run against rendered markup with `<script>` blocks stripped: `NextIntlClientProvider` is handed the whole locale catalog, so an un-stripped body would let a string that never renders satisfy the check.
  - **N) Region-hub course-count agreement** — three regions hold one course (`north-misc`, `khao-lak`, `krabi`), so `GolfCourseRegion.metaDescription` carries an ICU plural in EN and TH and **both branches are asserted in both languages** (`=1` on all three regions, `other` on bangkok), plus the `/golf-courses/` region cards, which render the count in **visible** copy and shipped "1 courses" until PR #88. Meta-tag checks read the `<meta name="description">` attribute; the card check strips tags first, because the count and the noun live in separate elements and the disagreement exists only in the rendered text. Counts match `\d+`, not `\d\d+` — nine of fourteen regions are single-digit.

Both jobs are **required checks** via branch protection — PRs cannot merge if either fails.

**Manual trigger:** `gh workflow run ci.yml --ref main`

**GitHub Secrets required:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (already configured)

**Key files:**
- `.github/workflows/ci.yml` — workflow definition
- `scripts/smoke-test.ts` — smoke test script (zero deps beyond tsx + Node.js fetch)
- `eslint.config.mjs` — ESLint flat config (next/core-web-vitals)

**Adding new routes:** When adding a new page, add it to `routeTests` in `scripts/smoke-test.ts` to ensure CI validates it.

## Migration Notes

Migrated from WordPress (Elementor + 24 plugins). All migration artifacts live in `_migration/` (gitignored). Migration scripts in `scripts/` are one-time utilities that have already been run. The site has 16 pages, 24 blog posts, and 101 location pages (7 template types across ~15 Bangkok neighborhoods).

## Architecture

### Routing (App Router)

- `app/[locale]/` — Next.js App Router pages with i18n support (EN/TH)
- Core pages: `/golf`, `/events`, `/lessons`, `/about-us`, `/privacy-policy`, `/terms-of-service`
- Content pages: `/golf-club-rental`, `/golf-course-club-rental`, `/activities`, `/cost`, `/faq`, `/guide`, `/hotels`, `/second-hand-golf-clubs-bangkok`
- Dynamic routes: `/blog/[slug]`, `/location/[slug]` — use `generateStaticParams` + ISR (revalidate: 3600s)
- API routes: `app/api/contact/route.ts` (POST — contact form), `app/api/aqi/route.ts` (air quality)

### Components

- `components/layout/` — Header, Footer, LineChatWidget
- `components/home/`, `components/about/`, `components/events/`, `components/location/` — core page components
- `components/activities/`, `components/blog/`, `components/clubs/`, `components/faq/`, `components/guides/`, `components/hotels/`, `components/prices/` — content page components
- `components/shared/` — reusable components (BookingCTA, ContactInfo, ImageGallery, SectionWrapper, SocialIcons)
- `components/ui/` — shadcn/ui primitives (Radix UI + Tailwind)

### Data Layer

- **Supabase** is the sole database (PostgreSQL). Client initialized in `lib/supabase/client.ts` with anonymous key (no auth, `persistSession: false`).
- **Supabase Storage** hosts all static assets (images, videos) in the `website-assets` public bucket. Assets are organized into folders: `branding/`, `venue/`, `golf/`, `events/`, `lessons/`, `tournaments/`, `menus/`, `icons/`, `promotions/`, `videos/`. Use `storageUrl('folder/file.ext')` from `lib/constants.ts` to generate URLs. Only `favicon.png` remains in `public/images/`.
- Three tables: `blog_posts`, `contact_submissions`, `location_pages` (types in `types/supabase.ts`)
- Data fetching helpers: `lib/blog.ts`, `lib/locations.ts`
- Static data: `data/pricing.ts`, `data/coaches.ts`, `data/faq-pages.ts`, `data/faq-hub.ts` (/faq/ hub page content, EN+TH+JA+KO+ZH — the `CONTENT` record at the foot of the file is the launch gate for a locale), `data/hotel-pages.ts`, `data/explainer-pages.ts`, `data/price-guide-pages.ts`, `data/activity-occasions.ts`, `data/event-clients.ts`
- Location pages have rich schema: template_type, distance/transit metrics, area descriptions, SEO content, JSON-LD schema_markup

### Styling

- Tailwind CSS with custom theme in `tailwind.config.ts`
- Brand colors: primary green `#005a32`, accent gold `#c8a96e`, secondary dark `#1a1a1a`
- Font: Poppins (loaded via next/font)

### Key Utilities

- `lib/constants.ts` — site name, URLs, business info, navigation items, `storageUrl()` helper
- `lib/jsonld.ts` — JSON-LD structured data (LocalBusiness schema)
- `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)

### Forms

- react-hook-form + Zod for validation
- Contact form (`components/about/ContactForm.tsx`) and event inquiry form (`components/events/EventInquiryForm.tsx`)

### SEO

- Dynamic metadata via `generateMetadata` on each page
- `app/sitemap.ts` and `app/robots.ts` for search engine configuration
- Google Tag Manager via `NEXT_PUBLIC_GTM_ID`
- Location pages include per-page JSON-LD schema markup

## Environment Variables

Required in `.env.local` (see `.env.local.example`):
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase connection
- `NEXT_PUBLIC_GTM_ID` — Google Tag Manager
- `CONTACT_EMAIL_TO` — Contact form recipient

For migration scripts only:
- `SUPABASE_SERVICE_ROLE_KEY` — elevated access for data imports

## `vercel.json` pins `regions: ["sin1"]`

Supabase is in `ap-southeast-1` (Singapore). Without a pin, functions run in
Vercel's US default (`iad1`, Washington DC) and every PostgREST call crosses the
Pacific — ~230ms RTT, plus 2–3 more for a cold TLS handshake.

**This matters far less here than it sounds**, and it's worth knowing why before
anyone quotes a big number about it. This site is static/ISR: every page uses
`generateStaticParams` and `revalidate`, so the Supabase reads in `lib/blog.ts`,
`lib/clubs.ts`, `lib/promotions.ts` and friends happen at build time and during
background revalidation, not while a visitor waits. Sampled pages come back
`HIT` / `PRERENDER` / `STALE`, never a per-request render.

The one user-facing surface that pays is `POST /api/contact`, which awaits a
Supabase insert into `contact_submissions` before responding — roughly one round
trip. Its SMTP is `smtp.gmail.com` (anycast), so unlike `lengolf-booking-new`'s
Thai-hosted mail server there's no additional penalty on the email leg.

Check the execution region with the response header. The **second** segment is
where the function ran; the first is only the edge PoP that accepted the
connection:

```bash
curl -sI https://www.len.golf/ | grep -i x-vercel-id
```

`sin1::sin1::…` is correct. `::iad1::` means the pin was lost.

`preferredRegion` does NOT work for this — it's edge-runtime only and these
routes are Node. Top-level `regions` in `vercel.json` is the mechanism.

Sibling apps `lengolf-forms` and `lengolf-booking-new` pin the same region. In
booking-new the cost was severe rather than cosmetic — ~165ms of real query work
read as ~4s of wall clock — because its routes make five or six sequential
queries per request and its SMTP host is in Thailand.

## Path Alias

`@/*` maps to project root (e.g., `@/components/ui/button`).

## Migration Archive

All migration artifacts live in `_migration/` (gitignored, excluded from builds). Contains WordPress backup, markdown exports, import scripts, and SEO planning docs.

---

## 🔒 Supabase Security — Non-Negotiable Rules

The shared Lengolf Supabase was hardened after a security audit. Don't regress it.

### The single most important rule

**This project has ZERO legitimate browser-anon Supabase usage.** Every
database read (blog, clubs, locations, promotions, Google reviews, contact
form) happens server-side via `lib/supabase/client.ts`, which uses
`SUPABASE_SERVICE_ROLE_KEY` and is marked `import 'server-only'`.

**Never change the env var back to `NEXT_PUBLIC_SUPABASE_ANON_KEY`.** The
server-side anon grants the old factory depended on have been revoked
project-wide, so reverting would break every page on len.golf that shows
data from the DB.

### Type-only imports from client components are fine

```ts
import type { UsedClub } from '@/lib/clubs'  // OK — erased at build time
```
**Runtime** imports from a `'use client'` component will fail the build
via `server-only`. Keep it that way.

### If you ever think you need browser-side Supabase access

Stop and ask. The current static-marketing-site design doesn't need it.
If there's a real interactive use case, prefer a server component that
fetches at request time, or a new API route using the existing factory.

### Hard red flags — stop and reconsider

- A `'use client'` component with a runtime `import { createClient } from '@/lib/supabase/client'`
- Any inline `createClient(..., process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)`
- A new Supabase factory file missing `import 'server-only'` at the top
- Any migration in the shared Lengolf DB that does `GRANT ALL ... TO anon` on the public or backoffice schemas

### Reference

Full plan + history: `~/.claude/plans/humming-singing-candy.md`
