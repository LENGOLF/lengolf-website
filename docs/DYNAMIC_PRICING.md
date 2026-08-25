# Dynamic Pricing — Website Implementation

The website fetches live prices from the forms app's shared pricing API instead of using hardcoded values. Prices update automatically via ISR (1-hour revalidation as of 2026-08-25; was 5 minutes, which forced ~420 pages that call this fetch to regenerate every 5 minutes regardless of their own longer declared interval — see the comment in `lib/pricing.ts`). If the API is unreachable, hardcoded fallback values are used and a console warning is logged.

## Architecture

```
Forms App (POS product catalog)
  └─ GET /api/pricing (public, cached 5 min)
       └─ Website (Next.js ISR, revalidate: 3600s)
            ├─ lib/pricing.ts          → fetch helper + types
            ├─ data/pricing.ts         → async getters with fallback
            ├─ lib/jsonld.ts           → parameterized JSON-LD generators
            ├─ app/[locale]/golf/      → bay rates + monthly packages
            ├─ app/[locale]/lessons/   → lesson pricing
            └─ app/[locale]/events/    → event packages
```

## API Endpoint

```
GET https://lengolf-forms.vercel.app/api/pricing
```

- **No auth required** — prices are public
- **Cached 5 min** server-side (`Cache-Control: public, max-age=300`)
- **Optional filter**: `?category=bayRates,packages` (comma-separated)

Override URL via `NEXT_PUBLIC_PRICING_API_URL` env var (defaults to the above).

## How It Works

### 1. Fetch Helper (`lib/pricing.ts`)

```typescript
getPricingCatalog(): Promise<PricingCatalog | null>
```

- Fetches from the API with `next: { revalidate: 3600 }` (ISR 1-hour)
- 5-second timeout via `AbortSignal.timeout(5000)` to prevent blocking renders
- Returns `null` on failure (network error, timeout, non-200, malformed JSON)
- Logs `console.warn('[pricing] Failed to fetch...')` on failure

Also exports:
- `formatThb(price: number)` — formats as `"X,XXX THB"`
- `findPrice(products, regex)` — finds a product price by name pattern

### 2. Async Getters (`data/pricing.ts`)

Each getter fetches from the API, maps API product names to the website's data structures, and falls back to the hardcoded arrays if the API is unavailable.

| Function | Returns | API Source | Fallback |
|----------|---------|------------|----------|
| `getBayRatesData(catalog?)` | `{ bayRates, bayRateNotes }` | `bayRates.morning/afternoon/evening` | Static `bayRates` array |
| `getMonthlyPackagesData(catalog?)` | `{ monthlyPackages, monthlyPackageNotes }` | `packages` | Static `monthlyPackages` array |
| `getLessonPricingData(catalog?)` | `{ lessonPricing, lessonNotes }` | `coaching` + `mixedPackages` | Static `lessonPricing` array |
| `getEventPackagesData(catalog?)` | `{ eventPackages, eventPackageNotes }` | `events` | Static `eventPackages` array |

**Optional `catalog` parameter:** To avoid redundant API calls, page components can fetch the catalog once and pass it to multiple getters. If omitted, each getter fetches independently (Next.js deduplicates same-URL fetches within a render).

**Only prices are dynamic.** Non-price data (FAQ items, notes, amenities, services, event food/drink details, hours, validity, perks) stays hardcoded — the API doesn't serve these.

### 3. JSON-LD Schema Generators (`lib/jsonld.ts`)

These functions now accept optional dynamic pricing data:

| Function | Optional Params |
|----------|----------------|
| `getGolfPricingJsonLd(bayRates?, monthlyPackages?)` | Bay rate rows + package rows |
| `getLessonsPricingJsonLd(lessonPricing?)` | Lesson package array |
| `getLessonsServiceJsonLd(startingPrice?)` | Starting price string (e.g. `"1,800 THB"`) |
| `getEventsPricingJsonLd(eventPackages?)` | Event package array |

When params are provided, JSON-LD offers are built from dynamic data. When omitted, hardcoded values are used (backwards compatible).

### 4. Page Components

All three pages are async server components — no structural changes needed.

**Golf page** (`app/[locale]/golf/page.tsx`):
```typescript
const catalog = await getPricingCatalog()
const [promos, { bayRates, bayRateNotes }, { monthlyPackages, monthlyPackageNotes }] = await Promise.all([
  getWebsitePromotions(),
  getBayRatesData(catalog),
  getMonthlyPackagesData(catalog),
])
const pricingJsonLd = getGolfPricingJsonLd(bayRates, monthlyPackages)
```

**Lessons page** (`app/[locale]/lessons/page.tsx`):
```typescript
const { lessonPricing, lessonNotes } = await getLessonPricingData()
const pricingJsonLd = getLessonsPricingJsonLd(lessonPricing)
const serviceJsonLd = getLessonsServiceJsonLd(lessonPricing[0]?.oneGolfer)
```

**Events page** (`app/[locale]/events/page.tsx`):
```typescript
const { eventPackages, eventPackageNotes } = await getEventPackagesData()
const pricingJsonLd = getEventsPricingJsonLd(eventPackages)
```

## API → Website Mapping

### Bay Rates

| API Field | Website Row |
|-----------|-------------|
| `bayRates.morning` → Weekday | Before 14:00, weekday column |
| `bayRates.morning` → Weekend | Before 14:00, weekend column |
| `bayRates.afternoon` → Weekday | 14:00–17:00, weekday column |
| `bayRates.afternoon` → Weekend | 14:00–17:00, weekend column |
| `bayRates.evening` → Weekday | 17:00–23:00 (Promo), weekday column |
| `bayRates.evening` → Weekend | 17:00–23:00 (Promo), weekend column |

### Monthly Packages

| API Product Name | Website Package |
|-----------------|-----------------|
| `Bronze (5)` | Bronze |
| `Silver (15)` | Silver |
| `Gold (30)` | Gold |
| `Diamond (1 Month)` | Diamond |
| `Diamond+ (3 Months)` | Diamond+ |
| `Early Bird Package (10 Hours, Morning)` | Early Bird* |
| `Early Bird + (Unlimited)` | Early Bird+* |
| `Iron (8)` | **Not on website** (API-only) |

### Lesson Pricing

| API Product | Website Column |
|-------------|---------------|
| `1 Golf Lesson` | 1 Hour → 1 golfer |
| `1 Golf Lesson (2 PAX)` | 1 Hour → 2 golfers |
| `5 Golf Lessons Package` | 5 Hour → 1 golfer |
| `5 Golf Lessons Package (2 Pax)` | 5 Hour → 2 golfers |
| `10 Golf Lesson Package` | 10 Hour → 1 golfer |
| `10 Golf Lessons (2 PAX)` | 10 Hour → 2 golfers |
| `20/30/50 Golf Lessons Package` | Corresponding rows → 1 golfer |
| `20/30/50 Golf Lessons Package (2 PAX)` | Corresponding rows → 2 golfers |
| `Starter Package` (in `mixedPackages`) | Starter Package* → 1 golfer |
| `Starter Package (2 Person)` (in `mixedPackages`) | Starter Package* → 2 golfers |
| `Sim to Fairway Package (2 person)` | Sim to Fairway* → 2 golfers |
| `1 Golf Lesson (On Course)` | **Not on website** (API-only) |

**Not available from API:**
- 3-5 golfer pricing (stays hardcoded)
- Sim to Fairway single-person price (13,499 THB, stays hardcoded)
- Validity periods and remarks (stays hardcoded)

### Event Packages

| API Product | Website Package |
|-------------|-----------------|
| `Small Package (S)` | Small Package → price only |
| `Medium Package (M)` | Medium Package → price only |

Only the price field is updated. Guest counts, bays, duration, food, drinks, and caterer details stay hardcoded.

## Fallback Behavior

When the API is unreachable (network error, timeout, non-200 response, malformed JSON):

1. `getPricingCatalog()` returns `null`
2. Each getter returns the hardcoded static arrays (unchanged from before this migration)
3. JSON-LD generators use their hardcoded fallback offers
4. `console.warn('[pricing] Failed to fetch pricing catalog, using fallback defaults:', err)` is logged
5. The page renders normally with static prices

This means the website **never breaks** due to API issues — it just shows potentially stale prices.

## Environment Variables

| Variable | Required | Default |
|----------|----------|---------|
| `NEXT_PUBLIC_PRICING_API_URL` | No | `https://lengolf-forms.vercel.app/api/pricing` |

## What's NOT Migrated (Priority 2)

Prices embedded in prose strings across content files. These would need template literal interpolation:

| File | Price References |
|------|-----------------|
| `data/faq-pages.ts` | FAQ answers mention ฿500, ฿1,800, etc. |
| `data/activity-occasions.ts` | 50+ price references in activity comparisons |
| `data/explainer-pages.ts` | Comparison tables with pricing examples |
| `data/hotel-pages.ts` | Hotel concierge pricing references |
| `data/price-guide-pages.ts` | LENGOLF rates in SEO content (all 6 pages are `status: 'draft'`) |
| `components/location/*.tsx` | Location components with price references |

## Testing

**Verify API fetch works:**
```bash
curl -s https://lengolf-forms.vercel.app/api/pricing | jq '.bayRates.morning'
```

**Verify fallback (API down):**
Set `NEXT_PUBLIC_PRICING_API_URL=http://localhost:9999` in `.env.local`, run `npm run dev`, and visit `/golf` — should render with hardcoded prices and log a warning.

**Build + lint:**
```bash
npm run build && npm run lint
```

**Smoke tests:**
```bash
npm run dev &  # start server
npm run test:smoke
```
