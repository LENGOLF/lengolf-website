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
// 1. There is NO on-demand purge in this repo — no revalidateTag, no
//    revalidatePath anywhere. Vercel's Data Cache also persists across
//    deployments (unlike the Full Route Cache), so shipping a deploy does NOT
//    refresh these prices. To force a refresh: purge the Data Cache from the
//    Vercel project settings, or change PRICING_API / this value. If prices
//    ever need to propagate on a business timescale, the right fix is a
//    revalidateTag call fired from lengolf-forms when a price changes — not a
//    shorter timer, which pays the full ISR cost every day to catch a change
//    that happens a few times a year.
//
// 2. A transient pricing-API failure at regeneration time makes this return
//    null, and the page renders the pinned FALLBACK figures (see
//    site-facts.ts). Those are last-known-good, not wrong, and the failure
//    itself is NOT cached — Next only stores successful responses, so the next
//    regeneration retries. The exposure is therefore bounded by the calling
//    PAGE's own revalidate (86400), not by this value.
export const getPricingCatalog = perRequest(async (): Promise<PricingCatalog | null> => {
  try {
    const res = await fetch(PRICING_API, {
      next: { revalidate: 2_592_000 }, // 30 days — see the block above
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) throw new Error(`Pricing API ${res.status}`)
    return await res.json()
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
