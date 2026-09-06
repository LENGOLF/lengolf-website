# Content Management

> How to manage blog posts, location pages, pricing data, and coach profiles for the LENGOLF website.

Last updated: 2026-02-12

---

## Table of Contents

- [Content Overview](#content-overview)
- [Blog Posts](#blog-posts)
- [Location Pages](#location-pages)
- [Pricing and Services Data](#pricing-and-services-data)
- [Coach Profiles](#coach-profiles)
- [Static Pages](#static-pages)
- [ISR and Content Freshness](#isr-and-content-freshness)

---

## Content Overview

Content on the LENGOLF website comes from two sources:

| Source | Content Type | How to Edit |
|--------|-------------|-------------|
| Supabase database | Blog posts, location pages, contact submissions | Edit directly in Supabase Dashboard or via SQL |
| TypeScript data files | Pricing, coaches, services, amenities, FAQ | Edit the source files and redeploy |

Database-backed content (blog posts, location pages) is served via ISR with a 1-hour revalidation window, meaning changes appear on the live site within 1 hour of updating the database -- no redeploy required.

Static data files require a code change and redeployment to update.

---

## Blog Posts

### Where They Live

Blog posts are stored in the `blog_posts` table in Supabase. The data fetching helpers are in `lib/blog.ts`.

### Viewing Posts

- **Blog listing**: [https://len.golf/blog](https://len.golf/blog) -- shows all published posts, newest first.
- **Individual post**: `https://len.golf/blog/{slug}` -- renders the full post content.

### Adding a New Blog Post

1. Open the [Supabase Dashboard](https://supabase.com/dashboard) and navigate to your project.
2. Go to **Table Editor** > **blog_posts**.
3. Click **Insert row**.
4. Fill in the required fields:

| Field | Required | Notes |
|-------|----------|-------|
| `title` | Yes | The post title displayed on the page |
| `slug` | Yes | URL-friendly identifier (e.g., `best-indoor-golf-bangkok`). Must be unique. |
| `content` | Yes | HTML content body. Supports standard HTML tags. |
| `status` | Yes | Set to `published` to make it visible. Use `draft` to hide it. |
| `excerpt` | No | Short summary shown on the blog listing page |
| `featured_image` | No | Full URL to the post's header image |
| `meta_title` | No | SEO title override (falls back to `title` if empty) |
| `meta_description` | No | SEO description override (falls back to `excerpt` if empty) |
| `published_at` | No | Publication date. Controls the display order (newest first). |

5. Click **Save**.
6. The post will appear on the live site within 1 hour (ISR revalidation).

### Editing a Blog Post

1. In the Supabase Table Editor, find the post in `blog_posts`.
2. Click the row to edit.
3. Modify the desired fields.
4. Click **Save**.
5. Changes propagate within 1 hour.

### Unpublishing a Blog Post

Set the `status` field to `draft`. The post will be excluded from the listing and will return a 404 on its direct URL after the next ISR revalidation.

### Retiring a Blog Post into a Section Page (redirect, not 404)

When a post is being consolidated into a page that serves the same search intent, a 404 throws away the URL's history. Instead:

1. Add the slug to `RETIRED_BLOG_REDIRECTS` in `lib/blog-slugs.ts` **and** `lib/blog-slugs.js` (hand-synced twins; `next.config.js` reads the `.js`). Both the WordPress root form and the `/blog/` form then 308 to the destination in one hop.
2. Add matching `redirectTests` entries in `scripts/smoke-test.ts` for every generated rule (root and `/blog/` form per slug).
3. Merge and let Vercel deploy. Only then set the `blog_posts` row to `draft`, so the page never 404s in between.
4. Trigger one more deploy after the flip: `app/sitemap.ts` is a build-time artifact, so the retired URL stays in the sitemap (as a redirect) until the next build. The `/blog/` listing self-heals within 24 hours on its own.

Reviving a retired post means deleting its entry from `RETIRED_BLOG_REDIRECTS` first; config redirects match before the filesystem, so flipping the row back to `published` alone leaves the page unreachable behind its own redirect.

### Blog Post Content Format

The `content` field stores raw HTML. When writing content:

- Use standard HTML elements: `<h2>`, `<h3>`, `<p>`, `<ul>`, `<ol>`, `<li>`, `<a>`, `<strong>`, `<em>`
- The content is rendered inside a `prose` container with Tailwind Typography styles
- Images in content can use regular `<img>` tags
- Internal links should use relative paths: `<a href="/golf">Bay Rates</a>`

### Migration Script (Historical)

The original 24 blog posts were migrated from WordPress markdown exports using:

```bash
npx tsx scripts/migrate-blog-posts.ts
```

This script reads markdown files from `_migration/markdown-export/posts/`, converts them to HTML, and inserts them into the `blog_posts` table. It is a one-time migration utility and does not need to be run again unless re-importing from the WordPress export.

---

## Location Pages

### Where They Live

Location pages are stored in the `location_pages` table in Supabase. The data fetching helpers are in `lib/locations.ts`.

### Overview

There are 101 location pages targeting local search queries across approximately 15 Bangkok neighborhoods. Each page uses one of 6 template types:

| Template Type | Purpose | Example Slug |
|--------------|---------|-------------|
| Golf Near | General "golf near X" pages | `golf-near-chidlom` |
| Things To Do | Activity guides for an area | `things-to-do-chidlom` |
| Indoor Golf | Indoor golf-specific content | `indoor-golf-chidlom` |
| Golf Lessons | Lesson-focused content | `golf-lessons-chidlom` |
| Corporate Events | Corporate event content | `corporate-events-chidlom` |
| Golf Club Rental | Club rental content | `golf-club-rental-chidlom` |

### Adding a New Location Page

1. In the Supabase Table Editor, go to **location_pages**.
2. Click **Insert row**.
3. Fill in the core fields:

| Field | Required | Notes |
|-------|----------|-------|
| `template_type` | Yes | One of the 6 template types listed above |
| `location_name` | Yes | Display name (e.g., "Chidlom") |
| `location_slug` | Yes | Base area slug (e.g., "chidlom") |
| `url` | Yes | Full URL path with slashes (e.g., `/golf-near-chidlom/`) |
| `h1_title` | Yes | Page heading (e.g., "Golf Near Chidlom") |
| `status` | Yes | Set to `published` |

4. Fill in optional content fields relevant to the template type:
   - `unique_intro`, `area_pain_point`, `lengolf_pitch` -- text content sections
   - `distance_km`, `bts_time_mins`, `taxi_time_mins`, `walking_time_mins` -- transit data
   - `bts_route`, `walking_directions`, `taxi_fare_estimate` -- directions info
   - `nearby_landmarks`, `nearby_hotels`, `nearby_offices` -- comma-separated lists
   - `meta_description` -- SEO description
   - `schema_markup` -- JSON-LD structured data (JSON object)
   - `internal_links` -- semicolon-separated URLs to related location pages

5. Click **Save**. The page appears within 1 hour.

### Field Parsing Conventions

Several fields use delimiter-separated values that are parsed by helper functions in `lib/locations.ts`:

- **Comma-separated**: `nearby_landmarks`, `nearby_hotels`, `nearby_offices` -- parsed by `parseList()`
- **Semicolon-separated**: `internal_links`, `simulator_specs` -- parsed by `parseSemicolonList()` or `parseInternalLinks()`
- **Structured semicolon format**: `other_attractions` uses `Name - Type - Distance` format, parsed by `parseAttractions()`
- **Colon-keyed semicolons**: `lesson_packages` uses `Category: Details` format, parsed by `parseLessonPackages()`

Example for `internal_links`:
```
/things-to-do-chidlom/; /indoor-golf-chidlom/; /golf-lessons-chidlom/
```

Example for `other_attractions`:
```
Central Embassy - Shopping Mall - 0.5 km; Lumpini Park - Park - 1.2 km
```

### Import Script (Historical)

The initial 101 location pages were imported from a CSV file using:

```bash
npx tsx scripts/import-location-pages.ts
```

This reads `_migration/lengolf-seo-data.csv` and inserts rows into `location_pages`. It is a one-time migration utility.

---

## Pricing and Services Data

### Where It Lives

Pricing and services data is defined in `data/pricing.ts`. This is a static TypeScript file -- changes require a code commit and redeployment.

### What It Contains

The file exports several data arrays:

#### `lessonPricing` -- Lesson Package Rates

```typescript
export const lessonPricing: LessonPackage[] = [
  {
    name: '1 Hour',
    oneGolfer: '1,800 THB',
    twoGolfers: '2,400 THB',
    threeToFiveGolfers: '2,900 THB',
    remark: '-',
  },
  // ... more packages
]
```

To update lesson prices, edit the values directly in this array.

#### `lessonNotes` -- Footnotes for the pricing table

#### `services` -- Homepage service cards

```typescript
export const services = [
  { title: 'Golf', image: storageUrl('venue/venue-simulator-01.jpg'), href: '/golf' },
  { title: 'Food & Drinks', image: storageUrl('menus/food-drinks-cover.jpg'), href: '/menu' },
  { title: 'Lessons', image: storageUrl('lessons/lessons-cover.jpg'), href: '/lessons' },
  { title: 'Events', image: storageUrl('events/events-cover.jpg'), href: '/events' },
]
```

#### `amenities` -- List of venue amenities

#### `eventTypes` -- Event type cards with icons

#### `faqItems` -- Tournament FAQ questions and answers

### How to Update Pricing

1. Open `data/pricing.ts`.
2. Edit the relevant array (e.g., modify values in `lessonPricing`).
3. Commit the change and push. Vercel will redeploy automatically.

---

## Coach Profiles

### Where They Live

Coach data is defined in `data/coaches.ts`. This is a static TypeScript file.

### Structure

```typescript
export interface Coach {
  name: string        // Display name (e.g., "PRO Boss")
  fullName: string    // Legal name
  nickname: string    // Short name
  photo: string       // storageUrl() to headshot
  expertise: string[] // List of specialties
  achievements: string[] // Career highlights
  education: string[]    // Certifications and degrees
  gallery: string[]      // storageUrl() paths to gallery images
}
```

### Adding a New Coach

1. Upload the coach's headshot and gallery images to `website-assets/lessons/` in Supabase Storage (see [Supabase Storage](./supabase-storage.md)).
2. Open `data/coaches.ts`.
3. Add a new entry to the `coaches` array:

```typescript
{
  name: 'PRO NewCoach',
  fullName: 'Full Legal Name',
  nickname: 'NewCoach',
  photo: storageUrl('lessons/coach-newcoach.png'),
  expertise: [
    'Beginner Golf Programs',
    'Short Game',
  ],
  achievements: [
    'Notable achievement 1',
    'Notable achievement 2',
  ],
  education: [
    'Certification or degree',
  ],
  gallery: [
    storageUrl('lessons/coach-newcoach-gallery-01.jpg'),
    storageUrl('lessons/coach-newcoach-gallery-02.jpg'),
  ],
},
```

4. Commit and push. The change deploys automatically via Vercel.

### Updating an Existing Coach

Edit the relevant entry in the `coaches` array in `data/coaches.ts`. If updating photos, upload the new images to Supabase Storage first.

---

## Static Pages

The following pages have their content written directly in their page component files. To edit them, modify the corresponding `.tsx` file:

| Page | File |
|------|------|
| Homepage | `app/page.tsx` + `components/home/` |
| Bay Rates | `app/golf/page.tsx` |
| Events | `app/events/page.tsx` + `components/events/` |
| Lessons | `app/lessons/page.tsx` |
| Tournaments | `app/tournaments/page.tsx` |
| About Us | `app/about-us/page.tsx` + `components/about/` |
| Privacy Policy | `app/privacy-policy/page.tsx` |
| Terms of Service | `app/terms-of-service/page.tsx` |

Changes to these files require a commit and redeployment.

---

## ISR and Content Freshness

Dynamic pages (blog posts, location pages) use Incremental Static Regeneration (ISR) with `revalidate = 3600` (1 hour). This means:

1. At build time, all known slugs are pre-rendered as static HTML.
2. When a visitor requests a page, the cached version is served instantly.
3. If the cached version is older than 1 hour, Next.js serves the stale page to the current visitor while triggering a background revalidation.
4. The next visitor receives the freshly generated page.

**Practical implications:**
- New blog posts or location pages appear within 1 hour of being added to Supabase.
- Edits to existing content propagate within 1 hour.
- Setting `status` to `draft` effectively removes the page within 1 hour.
- A Vercel redeployment immediately regenerates all pages with the latest data.

If you need changes to appear immediately, trigger a redeployment from the Vercel dashboard or push any commit to the deployment branch.
