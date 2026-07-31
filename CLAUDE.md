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
- **Validate i18n house style:** `npm run validate:i18n` — lints localized guide content (ja/ko/zh/th entries in `data/explainer-pages.ts` and `data/faq-pages.ts`, `REGION_HUB_I18N` in `data/golf-courses-i18n.ts`, `PRICE_TIER_I18N` in `data/price-tiers.ts`) against the machine-readable glossaries in `data/i18n-glossary/*.json`. ERROR-level (fails): emoji, exclamation marks, full-width digits (ja), terminology `avoid` variants, brand-immutable case corruption, unbalanced `**`/broken `{{ }}`, and a UI-message namespace entirely missing from a locale catalog (see next bullet). WARN-level (non-blocking): currency-convention drift, unscoped honesty claims, prices with no "as of" marker, individual UI-message key gaps vs `messages/en.json`. Automates the mechanical subset of `docs/i18n-review-checklist.md`; `--self-test` proves the detectors. No server needed.
- **UI-message namespace parity (part of `validate:i18n`):** when a page starts SSG-ing a new locale (e.g. adding entries to `getTranslatedPriceTierParams()`), every `useTranslations('...')` namespace it consumes must exist in that locale's `messages/<locale>.json` — next-intl logs `MISSING_MESSAGE` per render during build and silently falls back to English (no build failure), so a repeated `MISSING_MESSAGE` in the build log is a real bug, not noise. `validate:i18n` guards this for the namespaces in the `SSG_UI_NAMESPACES` allowlist (`scripts/validate-i18n.ts`: `GolfCourseShared`, `GolfCoursePriceTier`, `GolfCourseRegion`, `ExplainerPage`, `FaqPage`, `ContactInfo`): the locales that SSG those pages — derived from the registry helpers in `lib/translated-routes.ts` — must have the namespace in `messages/<locale>.json` with the same (flattened) key set as `messages/en.json`. Namespace missing entirely = ERROR; individual missing keys = WARN. Precedent: `GolfCourseShared` was missing from ja/ko/zh (~480 warnings/build) until PR #78. When a translated route starts consuming a NEW namespace, add it to `SSG_UI_NAMESPACES`; namespaces outside the allowlist are still unchecked.
- **Body markdown is `**bold**`-only:** explainer/FAQ `body` strings are rendered by `components/shared/BoldText.tsx`, which handles `**bold**` but NOT single-asterisk `*italics*` — italic markup ships as literal asterisks (one pre-existing case: the exchange-rate footnote in `gg-thailand-golf-trip-cost`). Write footnote/aside lines as plain text, e.g. the as-of markers `(ข้อมูล ณ กรกฎาคม 2026)`.
- **Validate course fee plausibility:** `npm run validate:courses` — lints `data/golf-courses/*/*.ts` green fees. ERROR (fails CI): fee outside ฿150–฿20,000, weekend cheaper than weekday, or a suspicious pattern (weekday under ฿600 — the classic scraped Thai-national/9-hole/promo rate — or weekend >2.2× weekday) on a course with no `fees_verified_at` attestation. WARN: attested-but-suspicious fees, attestations older than 18 months. When correcting a fee, also grep the course's `prose` for the old number — fees are often repeated in prose text. No server needed.
- **Smoke tests:** `npm run test:smoke` (requires a running server on localhost:3000)
- **Page inventory:** `npm run inventory [base-url]` — table of published pages per section × language (EN/TH/JA/KO/ZH), parsed from the sitemap. Needs a running server **with DB access** (real `.env.local`), else DB-driven blog/location sections read 0. Point at prod with `npm run inventory https://www.len.golf`.
- **Migrate blog posts:** `npx tsx scripts/migrate-blog-posts.ts` (one-time migration, already run)
- **Import location pages:** `npx tsx scripts/import-location-pages.ts` (one-time migration, already run)

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every PR to `main`:

- **`lint`** — `npm run lint` with ESLint flat config (`eslint.config.mjs`), then `npm run validate:links` (internal SEO cross-link validator), then `npm run validate:i18n` (i18n house-style/honesty linter — mechanical subset of the native-QA rubric), then `npm run validate:courses` (green-fee plausibility gate; a red "lint" check can be any of the four)
- **`build-and-smoke`** — builds the app, starts the production server, runs smoke tests across 11 categories (per-category test counts live in `scripts/smoke-test.ts`):
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
  - **K) Data-driven internal-link liveness** — every `related_slugs` path outside the statically-validated SEO prefixes (`/location`, `/golf-courses`, core routes) is fetched live and must not 404 (complements `npm run validate:links`)

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
- Static data: `data/pricing.ts`, `data/coaches.ts`, `data/faq-pages.ts`, `data/faq-hub.ts` (/faq/ hub page content, EN+TH), `data/hotel-pages.ts`, `data/explainer-pages.ts`, `data/price-guide-pages.ts`, `data/activity-occasions.ts`, `data/event-clients.ts`
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
