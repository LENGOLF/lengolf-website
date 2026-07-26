// Lightweight dataLayer push wrapper for GTM (container GTM-MKCHVJKW,
// loaded in app/[locale]/layout.tsx). Treats SSR safely and lazily
// initialises window.dataLayer if a tag hasn't done it yet.
//
// Used by the Club Rental funnel to fire `rental_intent` from every Book
// CTA so Smart Bidding has an intermediate signal between ad click and
// `course_rental_confirmed` (the primary conversion, which fires only
// after a successful booking on booking.len.golf).

type DataLayerEvent = { event: string } & Record<string, unknown>

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[]
  }
}

export function pushDataLayerEvent(payload: DataLayerEvent): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(payload)
}

// 'cross_link' is the CourseRentalCrossLink banner, which appears off the
// rental landing page itself (location templates, /golf, /lessons, rental-intent
// FAQs) — kept as its own source so that off-page demand is measurable
// separately from the on-page hero/section/footer CTAs.
export type RentalIntentSource =
  | 'hero'
  | 'section'
  | 'footer'
  | 'sticky_cta'
  | 'why_rent'
  | 'cross_link'

export function pushRentalIntent(source: RentalIntentSource): void {
  pushDataLayerEvent({ event: 'rental_intent', source })
}
