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
// The revalidate value here caps the ISR interval of every page that calls
// this (home, /golf/, /guide/[slug], /cost/[slug], /activities/[slug],
// /hotels/[slug], /best/[slug], /llms.txt — ~420 pages): Next.js sets a
// route's effective revalidate to the *shorter* of its own declared value
// and every fetch-level revalidate used during its render — this fetch can
// only shorten a page's interval, never lengthen it. Most of the ~420 pages
// declare no revalidate of their own, so this value sets theirs outright;
// home and /llms.txt declare 86400 and still get pulled down to this value
// (known tradeoff, not a bug — raise further to relax that if daily-fresh
// pricing on those two routes matters more than the extra cost saved).
// A transient pricing-API failure at regen time can leave the fallback
// catalog (see FALLBACK in site-facts.ts) live for up to this long.
// It was 300s until 2026-08-25, which forced all ~420 pages to regenerate
// every 5 minutes and was the single largest driver of Vercel ISR-write cost.
export const getPricingCatalog = perRequest(async (): Promise<PricingCatalog | null> => {
  try {
    const res = await fetch(PRICING_API, {
      next: { revalidate: 3600 },
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
