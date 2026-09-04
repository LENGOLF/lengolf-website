// Dynamic pricing fetch helper — pulls live prices from the forms app API
// Falls back gracefully if the API is unreachable

import { cache } from 'react'

// React's `cache` dedupes a call per server request, but it only exists in the
// RSC runtime. Plain tsx/node consumers that import the data layer (smoke
// tests, the validators) resolve `react` without it, where the bare call would
// throw at module load. Fall back to identity there — those one-shot scripts
// call the catalog at most once and don't need request memoization.
const perRequest = (
  typeof cache === 'function' ? cache : (fn: (...a: never[]) => unknown) => fn
) as <F extends (...a: never[]) => unknown>(fn: F) => F

export interface PricingProduct {
  name: string
  price: number
}

export interface PricingCatalog {
  bayRates: {
    morning: PricingProduct[]
    afternoon: PricingProduct[]
    evening: PricingProduct[]
  }
  packages: PricingProduct[]
  coaching: PricingProduct[]
  clubRental: {
    indoor: Array<PricingProduct & { modifiers?: PricingProduct[] }>
    course: Array<PricingProduct & { modifiers?: PricingProduct[] }>
    addons: PricingProduct[]
  }
  mixedPackages: PricingProduct[]
  drinksAndGolf: PricingProduct[]
  events: PricingProduct[]
  fetchedAt: string
}

const PRICING_API =
  process.env.NEXT_PUBLIC_PRICING_API_URL || 'https://lengolf-forms.vercel.app/api/pricing'

// Wrapped in React `cache()` so all consumers within one server request share a
// single fetch. A guide render calls this via getFactTokens() in BOTH
// generateMetadata and the page body; the data/* getters call it again for the
// same page. The AbortSignal below opts the fetch out of Next's request-level
// dedup, so without this wrapper each of those would hit the POS API separately
// (~2× per guide page, and one extra per data getter). Cache lifetime is a
// single request/render pass, so ISR revalidation still refreshes on schedule.
//
// ---------------------------------------------------------------------------
// REVALIDATE: 30 days, and the owner's explicit choice (2026-09-04).
// ---------------------------------------------------------------------------
// Next sets a route's effective revalidate to the *shorter* of its own
// declared value and every fetch-level revalidate used while it renders. This
// fetch can therefore only SHORTEN a calling page's interval, never lengthen
// it — so any caller declaring none at all inherits this number outright.
//
// History, because the number has moved twice and the reasoning is not
// reconstructable from the value alone:
//   300s   until 2026-08-25 — forced ~566 pages to regenerate every 5 minutes
//                             and was the largest single driver of Vercel
//                             ISR-write cost (PR #113 raised it).
//   3600s  until 2026-09-04 — still set the interval for the 10 callers that
//                             declared none, so ~566 pages regenerated hourly.
//   30d    now — the owner ruled displayed prices may be a month stale. Every
//                 caller that should still regenerate daily now says so itself
//                 (`export const revalidate = 86400`), so this value no longer
//                 sets anyone's page interval; it only bounds how old the
//                 PRICE NUMBERS inside those pages may be.
//
// TWO CONSEQUENCES OF A LONG INTERVAL. Read both before shortening it back.
//
// 1. A DEPLOY MUST NOT BE RELIED ON TO REFRESH THESE PRICES, and there is no
//    on-demand purge in this repo — no revalidateTag, no revalidatePath
//    anywhere. Verified against Vercel's Data Cache docs rather than assumed:
//    "Cached data persists across deployments unless you explicitly
//    invalidate it." That is the opposite of the Full Route Cache, which a
//    deploy DOES flush — which is exactly why this is easy to get wrong.
//
//    Stated as "must not be relied on" rather than "does not", because the
//    honest answer is NON-DETERMINISTIC and an earlier draft of this comment
//    overstated it. `next build` prerenders these ~566 pages, and that build
//    reads .next/cache/fetch-cache, which Vercel restores from the BUILD
//    cache — a separate thing from the runtime Data Cache. So a build whose
//    build-cache is cold or was cleared re-fetches and re-pins prices for the
//    next 30 days, while a build that restores it does not. Never plan a price
//    change around a deploy: it might land, and you cannot tell which.
//
//    To force a refresh, either bump this value / PRICING_API (a code change,
//    so it ships like anything else), or purge manually:
//      Vercel project -> CDN -> Caches -> Purge cache -> All content
//      -> "Runtime and Data Cache".
//
//    MIND THE BLAST RADIUS ON THAT PURGE. This team is on Pro, where "all
//    projects in your team share a single cache" per environment — so purging
//    to refresh len.golf pricing also drops the Data Cache for lengolf-forms,
//    lengolf-booking-new and lengolf-accounting. It is not a per-project
//    button, and the docs warn about exactly this.
//
//    Countervailing nuance, so the 30 days is not read as a hard floor: the
//    shared cache has a fixed size and evicts least-recently-used entries, so
//    a low-traffic entry can be dropped and refetched well before its interval
//    expires. 30 days is a ceiling on staleness, not a guarantee of it.
//
//    If prices ever need to propagate on a business timescale, the right fix
//    is a revalidateTag call fired from lengolf-forms when a price changes —
//    not a shorter timer, which pays the full ISR cost every day to catch a
//    change that happens a few times a year.
//
// 2. A pricing-API failure makes this return null and the page renders the
//    pinned FALLBACK figures (site-facts.ts) — last-known-good, not wrong.
//    How LONG that lasts depends on how the API failed, and the two cases are
//    genuinely different. An earlier draft of this comment claimed "the
//    failure itself is NOT cached" for all of them, which is FALSE and is the
//    reason the shape check below exists.
//
//    NOT cached, self-heals on the next regeneration: a network error, an
//    abort from the 5s signal, or any non-200 status. Next's store gate is
//    `res.status === 200` (patch-fetch.js), so these never reach the cache and
//    exposure is bounded by the calling PAGE's revalidate (86400).
//
//    CACHED FOR THE FULL 30 DAYS: a 200 whose BODY is wrong — an HTML error or
//    login page from an upstream Vercel app, or valid JSON of the wrong shape.
//    The gate is the status code alone and is evaluated before anything reads
//    the body, so the bad response is stored, and every regeneration for the
//    next 30 days replays it. At the old 3600 this self-healed within an hour;
//    the 30-day value multiplies that window 720x, which is precisely why it
//    could not be raised without validating the payload.
const isArray = (v: unknown): v is unknown[] => Array.isArray(v)

/**
 * Does this payload carry the fields consumers dereference WITHOUT a guard?
 *
 * This exists because `res.json()` was previously cast straight to
 * PricingCatalog with no validation, and consumers then reached into it
 * unguarded: `catalog.bayRates.morning` (site-facts.ts), `catalog.coaching`,
 * `catalog.packages`, `catalog.mixedPackages`, `catalog.events`
 * (data/pricing.ts). A 200 carrying `{}` or `{"error":...}` is TRUTHY, so it
 * sails past every `if (!catalog) return FALLBACK` guard and then throws a
 * TypeError at render — a 500 on every one of the ~566 pricing-dependent
 * pages, served from a cache entry that now lives 30 days.
 *
 * Returning null instead routes those payloads down the same path as a network
 * failure: the pinned FALLBACK figures render. The poisoned entry still occupies
 * the Data Cache for its full interval (nothing here can evict it — see
 * consequence #1), but the pages serve real last-known-good prices instead of
 * an error.
 *
 * Deliberately NOT required: `clubRental`, `drinksAndGolf` and `fetchedAt`.
 * Every consumer of those already guards them (`catalog.clubRental?.course ??
 * []`, `catalog.fetchedAt ?? null`), and demanding them here would reject a
 * payload the existing code handles correctly. The rule is: require exactly
 * what is dereferenced unguarded, no more.
 */
function isPricingCatalog(value: unknown): value is PricingCatalog {
  if (typeof value !== 'object' || value === null) return false
  const c = value as Record<string, unknown>

  const bayRates = c.bayRates
  if (typeof bayRates !== 'object' || bayRates === null) return false
  const b = bayRates as Record<string, unknown>
  if (!isArray(b.morning) || !isArray(b.afternoon) || !isArray(b.evening)) return false

  return (
    isArray(c.coaching) &&
    isArray(c.packages) &&
    isArray(c.mixedPackages) &&
    isArray(c.events)
  )
}

export const getPricingCatalog = perRequest(async (): Promise<PricingCatalog | null> => {
  try {
    const res = await fetch(PRICING_API, {
      next: { revalidate: 2_592_000 }, // 30 days — see the block above
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) throw new Error(`Pricing API ${res.status}`)

    // Parse and shape-check separately: a 200 carrying HTML throws HERE, and
    // that throw must not be mistaken for an unreachable API. Both land in the
    // same catch, but the messages have to tell them apart in the logs.
    const payload: unknown = await res.json()
    if (!isPricingCatalog(payload)) {
      throw new Error(
        `Pricing API returned 200 with an unusable body (keys: ${
          typeof payload === 'object' && payload !== null
            ? Object.keys(payload).join(',') || '<none>'
            : typeof payload
        })`
      )
    }
    return payload
  } catch (err) {
    console.warn('[pricing] Failed to fetch pricing catalog, using fallback defaults:', err)
    return null
  }
})

/** Format a number as "X,XXX THB" */
export function formatThb(price: number): string {
  return `${price.toLocaleString('en-US')} THB`
}

/** Find a product price by regex match on name */
export function findPrice(products: PricingProduct[], pattern: RegExp): number | undefined {
  return products.find((p) => pattern.test(p.name))?.price
}
