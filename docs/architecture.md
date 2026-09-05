# Architecture

> System architecture overview for the LENGOLF Next.js 15 website.

Last updated: 2026-02-23

---

## Table of Contents

- [High-Level Overview](#high-level-overview)
- [Routing](#routing)
- [Component Architecture](#component-architecture)
- [Data Layer](#data-layer)
- [Static Asset Management](#static-asset-management)
- [Styling System](#styling-system)
- [Forms and Validation](#forms-and-validation)
- [SEO Strategy](#seo-strategy)
- [Analytics](#analytics)
- [Performance Optimizations](#performance-optimizations)

---

## High-Level Overview

```
Browser (len.golf)
    |
    v
Vercel Edge Network (CDN + SSR)
    |
    v
Next.js 15 App Router
    |
    +-- Static Pages (pre-rendered at build time)
    |       /golf, /events, /lessons, /tournaments, /about-us, etc.
    |
    +-- Dynamic Pages (ISR, revalidate every 3600s)
    |       /blog/[slug], /location/[slug]
    |
    +-- API Routes
    |       POST /api/contact
    |
    +-- Data Sources
            |
            +-- Supabase PostgreSQL
            |       Tables: blog_posts, location_pages, contact_submissions
            |
            +-- Supabase Storage
            |       Bucket: website-assets (images, videos)
            |
            +-- Static Data Files
                    data/pricing.ts, data/coaches.ts
```

The site uses a hybrid rendering strategy. Core marketing pages are statically generated at build time. Content-driven pages (blog posts, location SEO pages) use Incremental Static Regeneration (ISR) with a 1-hour revalidation window, fetching data from Supabase at request time when the cache has expired. A single API route handles contact form submissions.

---

## Routing

The project uses the Next.js 15 App Router (`app/` directory) with internationalization support via next-intl. See [i18n Translation Strategy](./i18n-translation-strategy.md) for details on locale handling and translation redirects.

### Static Pages

These pages have no dynamic data dependencies and are fully pre-rendered at build time. Routes marked with * have Thai translations available under `/th/*`:

| Route | File | Purpose | Thai? |
|-------|------|---------|-------|
| `/` | `app/[locale]/page.tsx` | Homepage with services carousel | * |
| `/golf` | `app/[locale]/golf/page.tsx` | Bay rates and simulator info | * |
| `/events` | `app/[locale]/events/page.tsx` | Event hosting and inquiry form | * |
| `/lessons` | `app/[locale]/lessons/page.tsx` | Coach profiles and lesson packages | * |
| `/tournaments` | `app/[locale]/tournaments/page.tsx` | Tournament information and FAQ | |
| `/about-us` | `app/[locale]/about-us/page.tsx` | About page with contact form | * |
| `/blog` | `app/[locale]/blog/page.tsx` | Blog listing (fetches from Supabase) | * |
| `/golf-club-rental` | `app/[locale]/golf-club-rental/page.tsx` | Golf club rental service page | * |
| `/privacy-policy` | `app/[locale]/privacy-policy/page.tsx` | Privacy policy | |
| `/terms-of-service` | `app/[locale]/terms-of-service/page.tsx` | Terms of service | |

### Dynamic Routes (ISR)

These routes use `generateStaticParams` to pre-render all known slugs at build time, with ISR to pick up new content:

| Route | File | Data Source | Revalidation | Thai? |
|-------|------|-------------|-------------|-------|
| `/blog/[slug]` | `app/[locale]/blog/[slug]/page.tsx` | `blog_posts` table | 3600s (1 hour) | No |
| `/location/[slug]` | `app/[locale]/location/[slug]/page.tsx` | `location_pages` table | 3600s (1 hour) | No |
| `/activities/[slug]` | `app/[locale]/activities/[slug]/page.tsx` | `seo_pages` table | 3600s (1 hour) | No |
| `/faq/[slug]` | `app/[locale]/faq/[slug]/page.tsx` | `seo_pages` table | 3600s (1 hour) | No |
| `/hotels/[slug]` | `app/[locale]/hotels/[slug]/page.tsx` | `seo_pages` table | 3600s (1 hour) | No |
| `/cost/[slug]` | `app/[locale]/cost/[slug]/page.tsx` | `seo_pages` table | 3600s (1 hour) | No |
| `/guide/[slug]` | `app/[locale]/guide/[slug]/page.tsx` | `seo_pages` table | 3600s (1 hour) | No |

All dynamic routes export `revalidate = 3600` and call `generateStaticParams` to enumerate all slugs at build time. New content added to Supabase will be picked up within 1 hour without a redeploy.

### API Routes

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/contact` | Accepts contact form submissions, writes to `contact_submissions` table |

The API route validates that `name`, `email`, and `message` are present, then inserts into Supabase. It accepts an optional `page_source` field to track which page the form was submitted from.

### Generated Routes

| Route | File | Purpose |
|-------|------|---------|
| `/sitemap.xml` | `app/sitemap.ts` | Dynamic sitemap including all blog and location slugs |
| `/robots.txt` | `app/robots.ts` | Allows all crawlers, disallows `/api/` |

---

## Component Architecture

Components are organized by domain and reusability:

```
components/
  layout/           # App-wide layout components
    Header.tsx        # Site header with navigation
    Footer.tsx        # Site footer with links and contact info
    LineChatWidget.tsx # LINE chat floating widget
  home/             # Homepage-specific components
    ServicesCarousel.tsx
  about/            # About page components
    ContactForm.tsx   # Contact form (react-hook-form)
  events/           # Events page components
    EventInquiryForm.tsx  # Event inquiry form
  location/         # Location page template components
    LocationPage.tsx      # Main location page wrapper
    GolfNearSections.tsx
    ThingsToDoSections.tsx
    IndoorGolfSections.tsx
    GolfLessonsSections.tsx
    CorporateEventsSections.tsx
    GolfClubRentalSections.tsx
  shared/           # Reusable components across pages
    BookingCTA.tsx
    ContactInfo.tsx
    ImageGallery.tsx
    SectionWrapper.tsx
    SocialIcons.tsx
  ui/               # shadcn/ui primitives (Radix UI + Tailwind)
    accordion.tsx
    button.tsx
    card.tsx
    input.tsx
    label.tsx
    textarea.tsx
```

### Location Page Template System

The location page system uses a single dynamic route (`/location/[slug]`) that renders different content sections based on the `template_type` field from the database. The `LocationPage` component acts as a router:

```typescript
// components/location/LocationPage.tsx
function renderTemplateSections(data: LocationPageType) {
  switch (data.template_type) {
    case 'Golf Near':          return <GolfNearSections data={data} />
    case 'Things To Do':       return <ThingsToDoSections data={data} />
    case 'Indoor Golf':        return <IndoorGolfSections data={data} />
    case 'Golf Lessons':       return <GolfLessonsSections data={data} />
    case 'Corporate Events':   return <CorporateEventsSections data={data} />
    case 'Golf Club Rental':   return <GolfClubRentalSections data={data} />
    default:                   return null
  }
}
```

Each template type has its own section component that renders fields relevant to that template. All location pages share a common hero, directions section, CTA section, and internal links footer.

---

## Data Layer

### Supabase Client

The Supabase client is a singleton initialized in `lib/supabase/client.ts`:

```typescript
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

let supabaseInstance: SupabaseClient<Database> | null = null

export function createClient(): SupabaseClient<Database> {
  if (supabaseInstance) return supabaseInstance

  supabaseInstance = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )

  return supabaseInstance
}
```

Key design decisions:
- **No authentication**: The site is public-facing with no user accounts. The anonymous key provides read access to published content.
- **`persistSession: false`**: No session storage since there are no authenticated users.
- **Singleton pattern**: A single client instance is reused across all server-side data fetches.

### Database Tables

All types are defined in `types/supabase.ts`.

#### `blog_posts`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `title` | text | Post title |
| `slug` | text | URL slug |
| `excerpt` | text | Short summary |
| `content` | text | HTML content body |
| `featured_image` | text | Image URL |
| `meta_title` | text | SEO title override |
| `meta_description` | text | SEO description override |
| `published_at` | timestamptz | Publication date |
| `status` | text | `published` or `draft` |
| `created_at` | timestamptz | Record creation time |
| `updated_at` | timestamptz | Last modification time |

#### `location_pages`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `template_type` | text | One of: Golf Near, Things To Do, Indoor Golf, Golf Lessons, Corporate Events, Golf Club Rental |
| `location_name` | text | Display name of the area (e.g., "Chidlom") |
| `location_slug` | text | Base area slug |
| `url` | text | Full URL path (e.g., `/golf-near-chidlom/`) |
| `tier` | integer | Priority tier |
| `distance_km` | numeric | Distance from LENGOLF |
| `bts_time_mins` | integer | BTS travel time |
| `taxi_time_mins` | integer | Taxi travel time |
| `walking_time_mins` | integer | Walking time |
| `taxi_fare_estimate` | text | Estimated taxi fare |
| `bts_route` | text | BTS route description |
| `walking_directions` | text | Walking directions text |
| `nearby_landmarks` | text | Comma-separated landmarks |
| `nearby_hotels` | text | Comma-separated hotels |
| `nearby_offices` | text | Comma-separated office buildings |
| `h1_title` | text | Page H1 heading |
| `meta_description` | text | SEO meta description |
| `unique_intro` | text | Introductory paragraph |
| `area_pain_point` | text | Area-specific content |
| `lengolf_pitch` | text | LENGOLF value proposition for this area |
| `schema_markup` | jsonb | JSON-LD structured data |
| `internal_links` | text | Semicolon-separated related page URLs |
| `status` | text | `published` or `draft` |
| ... | | Additional template-specific fields |

#### `contact_submissions`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `name` | text | Submitter name |
| `email` | text | Submitter email |
| `phone` | text | Phone number (optional) |
| `company` | text | Company name (optional) |
| `message` | text | Message body |
| `page_source` | text | Which page the form was on |
| `created_at` | timestamptz | Submission time |

### Data Fetching Helpers

- **`lib/blog.ts`**: `getAllPosts()`, `getPostBySlug(slug)`, `getPostSlugs()` -- all filter by `status = 'published'`
- **`lib/locations.ts`**: `getAllLocationSlugs()`, `getLocationBySlug(slug)`, `getLocationsByType(type)`, `getLocationsByArea(slug)` -- plus parsing utilities for semicolon-separated fields

### Static Data

Non-database content lives in TypeScript files under `data/`:

- **`data/pricing.ts`**: Lesson packages, pricing tiers, services list, amenities, event types, FAQ items
- **`data/coaches.ts`**: Coach profiles with photos, expertise, achievements, education, and galleries

These files import `storageUrl()` to reference images stored in Supabase Storage.

---

## Static Asset Management

All images and videos are hosted in the Supabase Storage `website-assets` public bucket. See [Supabase Storage](./supabase-storage.md) for the complete guide on bucket structure, the `storageUrl()` helper, and how to add new assets.

The only file in `public/images/` is `favicon.png`. Everything else comes from Supabase Storage.

---

## Styling System

### Tailwind CSS

Configuration lives in `tailwind.config.ts`. The theme extends the default Tailwind palette with LENGOLF brand colors:

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#005a32` | Primary green -- headers, links, accents |
| `primary-light` | `#007a45` | Hover states |
| `primary-dark` | `#004025` | Dark variant |
| `accent` | `#c8a96e` | Gold -- CTAs, highlights |
| `secondary` | `#1a1a1a` | Dark backgrounds, text |
| `muted` | `#f5f5f5` | Light backgrounds |

### Font

The site uses **Poppins** loaded via `next/font/google` with weights 300--700. The CSS variable `--font-poppins` is applied to the `<html>` element and referenced in the Tailwind font family config.

### UI Primitives

The project uses [shadcn/ui](https://ui.shadcn.com/) components built on Radix UI. These live in `components/ui/` and include: `accordion`, `button`, `card`, `input`, `label`, `textarea`.

### Utility

The `cn()` helper in `lib/utils.ts` combines `clsx` and `tailwind-merge` for conditional class composition:

```typescript
import { cn } from '@/lib/utils'
<div className={cn('base-class', isActive && 'active-class')} />
```

---

## Forms and Validation

The site has two forms, both submitting to the same `/api/contact` endpoint:

1. **Contact Form** (`components/about/ContactForm.tsx`) -- on the About Us page. Fields: name, email, phone, message.
2. **Event Inquiry Form** (`components/events/EventInquiryForm.tsx`) -- on the Events page. Fields: name, email, phone, company, message (event plans).

Both forms use client-side state management with `useState` and submit via `fetch` to `/api/contact`. The `page_source` field is set automatically to identify which form was submitted.

---

## SEO Strategy

### Metadata

Every page exports a `generateMetadata` function (or a static `metadata` object) that produces page-specific titles, descriptions, and Open Graph tags. The root layout in `app/layout.tsx` sets the base metadata template:

```typescript
title: {
  default: 'LENGOLF | Premier Indoor Golf Simulator & Bar in Bangkok',
  template: '%s | LENGOLF',
}
```

### JSON-LD Structured Data

- **Global**: A `LocalBusiness`/`EntertainmentBusiness` schema is injected in the root layout via `lib/jsonld.ts`.
- **Per-page**: Location pages include their own `schema_markup` from the database, rendered as a `<script type="application/ld+json">` tag.

### Sitemap

`app/sitemap.ts` generates a dynamic sitemap that includes all static pages, blog post slugs (from `blog_posts`), and location page slugs (from `location_pages`).

### Robots

`app/robots.ts` allows all crawlers on all paths except `/api/`.

### 404 Handling

The site returns proper 404 status codes for non-existent resources, including WordPress paths from the previous installation (`/wp-admin/`, `/wp-login.php`, `/xmlrpc.php`, `/wp-json/`, `/wp-includes/`). These paths are not redirected to avoid creating soft-404s, which is bad for SEO. Modern crawlers handle 404s correctly, and returning the proper status code is semantically correct.

### Location Pages SEO

The 101 location pages target local search queries across approximately 15 Bangkok neighborhoods using 6 template types. Each page has unique:
- H1 title
- Meta description
- Introductory content
- Area-specific pain points and value propositions
- JSON-LD schema markup
- Internal links to related location pages

---

## Analytics

- **Vercel Analytics**: REMOVED 2026-09-04. GA4 via GTM (`GTM-MKCHVJKW`) already covered the
  same pageview/visitor data, and the Vercel Web Analytics line was billing separately.
- **Google Tag Manager**: Loaded via `next/script` with `afterInteractive` strategy. The GTM container ID comes from the `NEXT_PUBLIC_GTM_ID` environment variable.

---

## Performance Optimizations

- **ISR with 1-hour revalidation**: Dynamic pages are cached and served from the CDN, only revalidated after 3600 seconds.
- **`next/image`** with remote patterns configured for Supabase Storage and the LENGOLF domain.
- **Image cache TTL**: `minimumCacheTTL` is set to 30 days in `next.config.js`.
- **Static asset caching**: Custom headers set `Cache-Control: public, max-age=31536000, immutable` for images and fonts.
- **Font optimization**: Poppins is loaded via `next/font/google` with `display: 'swap'` to prevent layout shift.
- **Singleton Supabase client**: A single client instance avoids redundant connections.
