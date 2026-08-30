/**
 * Airports used as anchors for the /golf-courses/near/[airport]/ proximity
 * pages. Mirrors the BTS-station registry (data/bts-stations.ts) but carries
 * richer, booking-intent copy because airport searchers arrive with a clear
 * "book golf near the airport" intent rather than a hotel-district context.
 *
 * Coordinates are the official terminal coordinates for each airport, and are
 * the anchor for the haversine roster on each proximity page.
 *
 * This docblock used to cite bangkok/suvarnabhumi-golf-country-club.ts as
 * corroboration ("east of Suvarnabhumi Airport ... 13.816, 100.865"). That
 * file no longer exists — it was merged into
 * bangkok/phoenix-gold-golf-country-club.ts on 2026-08-30 as a duplicate of
 * the same Nong Chok course — and the coordinates it quoted were themselves
 * 4.37 km of drift. Do not treat course prose as a check on these values:
 * verified against Google Places, that course sits 18.66 km from the BKK
 * terminal and does not make this airport's nearest eight.
 *
 * `guideHref` links to the matching arrival-transfer guide in
 * data/explainer-pages.ts (both slugs are published English guides).
 */
export interface Airport {
  slug: string
  /** Full display name, e.g. "Suvarnabhumi Airport". */
  name: string
  /** Short name for chips and inline copy, e.g. "Suvarnabhumi". */
  shortName: string
  /** IATA code, e.g. "BKK". */
  iata: string
  lat: number
  lng: number
  /** Hero intro paragraph (2–3 sentences) describing the airport's location relative to Bangkok golf. */
  intro: string
  /** Honest transit / access context — which side of the city, expressway links, no invented drive times. */
  transitNotes: string
  /** Arrival-transfer guide cross-link target (a published /guide/ page). */
  guideHref: string
  /** Label for the guide cross-link card. */
  guideLabel: string
  /** Description shown under the guide cross-link label. */
  guideDescription: string
}

export const AIRPORTS: Record<string, Airport> = {
  'suvarnabhumi-airport': {
    slug: 'suvarnabhumi-airport',
    name: 'Suvarnabhumi Airport',
    shortName: 'Suvarnabhumi',
    iata: 'BKK',
    lat: 13.6900,
    lng: 100.7501,
    intro:
      'Suvarnabhumi (BKK) is Bangkok’s main international gateway, on the eastern edge of the metropolis in Samut Prakan. Its position east of the city puts several of Bangkok’s established courses (and the Chonburi / Eastern Seaboard cluster on the way to Pattaya) within easy reach without ever driving into central Bangkok traffic.',
    transitNotes:
      'BKK sits on the Bang Na–Trat / Motorway 7 corridor that runs east toward Chonburi and Pattaya, so courses on that side of the city are reached without crossing the centre. The Airport Rail Link connects the terminal to the BTS network at Phaya Thai for onward travel into town.',
    guideHref: '/guide/suvarnabhumi-airport-to-bangkok-golf',
    guideLabel: 'Suvarnabhumi Airport to Bangkok golf: transfer guide',
    guideDescription:
      'How to get from BKK arrivals to your tee time: transfers, timing, and what to arrange before you land.',
  },
  'don-mueang-airport': {
    slug: 'don-mueang-airport',
    name: 'Don Mueang Airport',
    shortName: 'Don Mueang',
    iata: 'DMK',
    lat: 13.9126,
    lng: 100.6068,
    intro:
      'Don Mueang (DMK) is Bangkok’s original airport and its low-cost hub, on the northern side of the city. Its northern position favours the dense band of courses in Pathum Thani and the northern suburbs. Many of Bangkok’s best-known layouts sit within the arc between DMK and Rangsit / Lam Luk Ka.',
    transitNotes:
      'DMK sits beside the Don Mueang Tollway and Vibhavadi Rangsit Road, feeding directly into the northern golf belt around Pathum Thani, Rangsit and Lam Luk Ka. It also connects onward to central Bangkok by tollway and, via nearby stations, the SRT Dark Red commuter line.',
    guideHref: '/guide/don-mueang-airport-to-bangkok',
    guideLabel: 'Don Mueang Airport to Bangkok: transfer guide',
    guideDescription:
      'Getting from DMK arrivals into the city and out to the northern courses: transfer options and timing.',
  },
}

export const AIRPORT_SLUGS = Object.keys(AIRPORTS)
