# Internationalization and Translation Strategy

> Documentation of the i18n implementation, translation registry, and redirect strategy for untranslated content.

Last updated: 2026-07-11

> **2026-07 update:** the site now supports **five locales — EN (default), TH, KO, JA, ZH**.
> The Thai-only registry described below was generalized into a per-locale
> `TRANSLATED_ROUTES` map in `lib/translated-routes.ts` (`hasTranslationForLocale(locale, path)`),
> and `middleware.ts` applies the same 301-redirect policy to all four prefixed
> locales (`/th`, `/ko`, `/ja`, `/zh`). KO/JA/ZH have bespoke landing pages at `/`
> plus translations for `/golf`, `/lessons`, `/events`, `/about-us`,
> `/golf-club-rental`, and `/golf-course-club-rental`. TH additionally has `/blog`.
> Currency approximations for KO/JA/ZH come from `lib/currency-rates.ts` (update quarterly).
> Sections below describing a Thai-only setup remain accurate in *mechanism* but
> read `th` as "any prefixed locale".

---

## Table of Contents

- [Overview](#overview)
- [Translation Registry System](#translation-registry-system)
- [Middleware Redirect Logic](#middleware-redirect-logic)
- [URL Structure](#url-structure)
- [Adding New Translations](#adding-new-translations)
- [SEO Implications](#seo-implications)
- [Testing](#testing)
- [Related Documentation](#related-documentation)

---

## Overview

The site uses `next-intl` for internationalization with support for English (default) and Thai locales. As of 2026-02-23, only a subset of pages have Thai translations. To prevent serving untranslated content with a 200 status code, the middleware redirects requests for untranslated Thai pages to their English equivalents with a 301 permanent redirect.

### Key Principles

1. **No 200s for untranslated content**: If a Thai translation doesn't exist, redirect to English rather than serving English content at a `/th/*` URL
2. **301 permanent redirects**: Signal to search engines that the Thai URL is not the correct canonical version
3. **Centralized translation registry**: Single source of truth for which routes have Thai translations
4. **Future-proof**: Architecture supports adding Thai translations to more pages without code changes

---

## Translation Registry System

### File: `lib/translated-routes.ts`

This file maintains the registry of all routes that have Thai translations available.

```typescript
export const THAI_TRANSLATED_ROUTES = {
  staticRoutes: [
    '/',
    '/golf',
    '/events',
    '/golf-club-rental',
    '/lessons',
    '/about-us',
    '/blog',
  ],
  dynamicRoutePatterns: [],
}
```

### `hasThaiTranslation(pathname: string): boolean`

Checks if a given pathname has a Thai translation available.

**Parameters:**
- `pathname` (string) - The URL pathname to check (locale-free, without `/th/` prefix). Middleware strips the prefix before calling.

**Returns:**
- `true` if the route has Thai translation
- `false` if no Thai translation exists

**Logic:**
1. Normalizes the pathname by removing trailing slashes
2. Checks against `staticRoutes` array
3. Checks against `dynamicRoutePatterns` (currently empty, reserved for future use)

**Example:**
```typescript
hasThaiTranslation('/golf')             // true
hasThaiTranslation('/golf/')            // true (trailing slash normalized)
hasThaiTranslation('/location/indoor-golf-sathorn/')  // false
```

---

## Middleware Redirect Logic

### File: `middleware.ts`

The middleware intercepts all Thai locale requests and enforces the translation policy before passing requests to next-intl.

### Implementation

```typescript
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if request is for Thai locale (includes bare /th without trailing slash)
  if (pathname === '/th' || pathname.startsWith('/th/')) {
    const pathWithoutLocale = pathname.replace(/^\/th/, '') || '/'

    // Check if this route has Thai translation
    if (!hasThaiTranslation(pathWithoutLocale)) {
      // Redirect to English version with 301 permanent redirect
      const url = request.nextUrl.clone()
      url.pathname = pathWithoutLocale
      return NextResponse.redirect(url, 301)
    }
  }

  // Continue with next-intl middleware for translated routes
  return intlMiddleware(request)
}
```

### Execution Flow

1. **Request arrives** for `/th/location/indoor-golf-sathorn/`
2. **Middleware checks** if pathname starts with `/th/`
3. **Extract path**: `/location/indoor-golf-sathorn/`
4. **Check registry**: `hasThaiTranslation('/location/indoor-golf-sathorn/')` returns `false`
5. **Return 301 redirect** to `/location/indoor-golf-sathorn/`
6. **User redirected** to English version

For translated pages:

1. **Request arrives** for `/th/golf/`
2. **Middleware checks** if pathname starts with `/th/`
3. **Extract path**: `/golf/`
4. **Check registry**: `hasThaiTranslation('/golf/')` returns `true`
5. **Pass to next-intl middleware** for normal locale handling
6. **Thai page renders** normally

---

## URL Structure

### Locale Prefix Strategy

The site uses `localePrefix: 'as-needed'` in the next-intl configuration:

- **English (default)**: No prefix - `www.len.golf/golf/`
- **Thai**: `/th/` prefix - `www.len.golf/th/golf/`

### Translated Pages (as of 2026-02-23)

| Route | English URL | Thai URL | Status |
|-------|-------------|----------|--------|
| Home | `/` | `/th/` | Translated |
| Golf | `/golf/` | `/th/golf/` | Translated |
| Events | `/events/` | `/th/events/` | Translated |
| Golf Club Rental | `/golf-club-rental/` | `/th/golf-club-rental/` | Translated |
| Lessons | `/lessons/` | `/th/lessons/` | Translated |
| About Us | `/about-us/` | `/th/about-us/` | Translated |
| Blog | `/blog/` | `/th/blog/` | Translated |

### English-Only Pages

All other routes are currently English-only and will redirect from `/th/*` to their English equivalents:

- Location pages (`/location/*`)
- Activity pages (`/activities/*`)
- FAQ pages (`/faq/*`)
- Hotel pages (`/hotels/*`)
- Cost guides (`/cost/*`)
- Explainer pages (`/guide/*`)
- Privacy policy (`/privacy-policy/`)
- Terms of service (`/terms-of-service/`)

---

## Adding New Translations

To add Thai translation support to an existing page:

### 1. Update the Translation Registry

Add the route to `THAI_TRANSLATED_ROUTES.staticRoutes` in `lib/translated-routes.ts`:

```typescript
export const THAI_TRANSLATED_ROUTES = {
  staticRoutes: [
    '/',
    '/golf',
    '/events',
    '/golf-club-rental',
    '/lessons',
    '/about-us',
    '/blog',
    '/privacy-policy',  // NEW
  ],
  dynamicRoutePatterns: [],
}
```

### 2. Create Thai Content

- **Static pages**: Add Thai message keys to `messages/th.json`
- **Dynamic pages**: Add Thai rows to the relevant Supabase table with `locale = 'th'`

### 3. Update Page Metadata

Add Thai alternate URL to the page's `generateMetadata` function:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  return {
    title: 'Privacy Policy',
    description: 'LENGOLF privacy policy',
    alternates: {
      canonical: `${SITE_URL}/privacy-policy/`,
      languages: {
        en: `${SITE_URL}/privacy-policy/`,
        th: `${SITE_URL}/th/privacy-policy/`,  // ADD THIS
      },
    },
  }
}
```

### 4. Update Sitemap

If the page is already in `app/sitemap.ts`, add it to the translated pages section with hreflang alternates:

```typescript
{
  url: `${SITE_URL}/privacy-policy/`,
  lastModified: new Date(),
  changeFrequency: 'yearly',
  priority: 0.3,
  alternates: {
    languages: {
      en: `${SITE_URL}/privacy-policy/`,
      th: `${SITE_URL}/th/privacy-policy/`,
    },
  },
}
```

That's it. The middleware will automatically allow Thai requests to pass through to next-intl for rendering.

---

## SEO Implications

### Why 301 Redirects Instead of 404s

For untranslated Thai routes, we use 301 redirects rather than 404s because:

1. **Better user experience**: Users reach relevant content (in English) rather than an error page
2. **Link equity preservation**: Any backlinks to `/th/*` URLs pass authority to the English version
3. **Intent preservation**: The redirect signals "this content exists, just not in Thai yet"

This differs from the [WordPress path handling strategy](./wordpress-path-handling.md), where 404s are correct because those paths point to resources that genuinely don't exist in the Next.js application.

### Canonical URLs

- **Translated pages**: Each language version is self-canonical
  - English: `<link rel="canonical" href="https://www.len.golf/golf/" />`
  - Thai: `<link rel="canonical" href="https://www.len.golf/th/golf/" />`

- **Untranslated pages**: Only English version exists, so it's the canonical
  - Request for `/th/location/indoor-golf-sathorn/` redirects to `/location/indoor-golf-sathorn/`
  - Canonical: `<link rel="canonical" href="https://www.len.golf/location/indoor-golf-sathorn/" />`

### Hreflang Tags

Pages with translations include hreflang tags for all available language versions:

```html
<link rel="alternate" hreflang="en" href="https://www.len.golf/golf/" />
<link rel="alternate" hreflang="th" href="https://www.len.golf/th/golf/" />
```

Pages without Thai translation do **not** include a `hreflang="th"` tag, as the Thai URL doesn't exist (it redirects).

### Location Pages: No Thai Translations

Location pages explicitly do not have Thai translations. The metadata includes a comment noting this:

```typescript
// File: app/[locale]/location/[slug]/page.tsx
alternates: {
  canonical: `${SITE_URL}/location/${slug}/`,
  // No Thai translation exists for location pages
}
```

This design decision aligns with the SEO expansion strategy, which focuses Phase 1-2 content expansion on English pages before multilingual rollout in Phase 3.

---

## Testing

### Manual Testing

Test that untranslated routes redirect properly:

```bash
# Start the development server
npm run dev

# Test an untranslated Thai URL (should redirect to English)
curl -I http://localhost:3000/th/location/indoor-golf-sathorn/
# Expect: HTTP 307 (dev) or 301 (production) redirect to /location/indoor-golf-sathorn/

# Test a translated Thai URL (should render Thai content)
curl -I http://localhost:3000/th/golf/
# Expect: HTTP 200 with Thai content
```

### Production Testing

After deploying, verify redirects work correctly:

```bash
curl -I https://www.len.golf/th/location/indoor-golf-sathorn/
# Expect: HTTP 301 redirect to https://www.len.golf/location/indoor-golf-sathorn/

curl -I https://www.len.golf/th/golf/
# Expect: HTTP 200
```

### Automated Testing

The smoke test suite should include tests for translation redirects:

```typescript
// scripts/smoke-test.ts (add to test suite)
const translationRedirectTests = [
  { path: '/th/location/indoor-golf-sathorn/', label: 'Untranslated Thai location page' },
  { path: '/th/privacy-policy/', label: 'Untranslated Thai privacy policy' },
  { path: '/th/faq/how-much-does-indoor-golf-cost-in-bangkok/', label: 'Untranslated Thai FAQ' },
]

for (const test of translationRedirectTests) {
  const response = await fetch(`${BASE_URL}${test.path}`, { redirect: 'manual' })
  if (response.status !== 301 && response.status !== 308) {
    console.error(`❌ ${test.label}: Expected 301/308, got ${response.status}`)
  }
}
```

---

## Related Documentation

- [Architecture: Routing](./architecture.md#routing) - Overall routing strategy
- [Architecture: SEO Strategy](./architecture.md#seo-strategy) - Hreflang and canonical tag strategy
- [SEO Expansion Strategy: Phase 3](./seo-expansion-strategy.md#phase-3-multi-language-expansion) - Long-term multi-language roadmap
- [WordPress Path Handling](./wordpress-path-handling.md) - Comparison with 404 strategy for WordPress paths
- [Development: i18n Configuration](./development.md) - next-intl setup and message file management (if applicable)

---

## Future Considerations

### Dynamic Route Patterns

The `dynamicRoutePatterns` array in `translated-routes.ts` is currently empty but reserved for future use when Thai translations exist for dynamic routes like blog posts or SEO pages:

```typescript
export const THAI_TRANSLATED_ROUTES = {
  staticRoutes: [...],
  dynamicRoutePatterns: [
    '/blog/[slug]',           // When blog posts have Thai translations
    '/activities/[slug]',      // When activity pages have Thai translations
  ],
}
```

The `hasThaiTranslation()` function already includes logic to check these patterns using regex matching.

### Database-Driven Translation Registry

For a large number of translated dynamic pages, consider moving the translation registry to the database:

```sql
-- Example: translation_registry table
CREATE TABLE translation_registry (
  route_pattern TEXT NOT NULL,
  locale TEXT NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (route_pattern, locale)
);
```

This would allow content editors to control translation availability without code deployments.

### Additional Locales

**Done (2026):** KO, JA, and ZH shipped using the consolidated multi-locale registry
in `lib/translated-routes.ts`:

```typescript
const TRANSLATED_ROUTES = {
  th: { staticRoutes: [...], dynamicRoutePatterns: [] },
  ko: { staticRoutes: [...], dynamicRoutePatterns: [] },
  ja: { staticRoutes: [...], dynamicRoutePatterns: [] },
  zh: { staticRoutes: [...], dynamicRoutePatterns: [] },
}
```

To add a route to a locale: translate the page's namespace in `messages/<locale>.json`
first, then add the route to that locale's `staticRoutes`. Adding the route without a
complete namespace ships mixed-language content and gets hreflang flagged as mismatched.
