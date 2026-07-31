/**
 * Demand-magnet BTS/MRT stations used as anchors for the
 * /golf-courses/near/[station]/ proximity pages.
 *
 * Selection rule: 8 distinct hotel/business districts where international
 * golf-tourist search demand is real. We deliberately substitute Ekkamai
 * for "Sukhumvit" (the MRT Sukhumvit interchange is the same intersection
 * as BTS Asok and would produce a literal duplicate course list).
 *
 * `areaSlug` links to an existing /location/[slug] page when one exists,
 * so the proximity page can cross-link back to the hotel-area landing page.
 */
export interface BtsStation {
  slug: string
  name: string
  lat: number
  lng: number
  /** Full `/location/[slug]/` page slug (template-prefixed, e.g.
   *  `indoor-golf-asok`), if a matching location page exists. Stored complete
   *  so consumers never need to know the location template naming scheme. */
  areaSlug?: string
  /** 1–2 sentences describing the district context (hotels, business, nightlife). */
  description: string
}

export const BTS_STATIONS: Record<string, BtsStation> = {
  asok: {
    slug: 'asok',
    name: 'Asok',
    lat: 13.7370,
    lng: 100.5602,
    areaSlug: 'indoor-golf-asok',
    description:
      'Asok is the Sukhumvit business hub — interchange between BTS Asok and MRT Sukhumvit, dense with five-star hotels (Grand Sheraton, Hyatt, Westin) and serviced apartments used by long-stay corporate travellers.',
  },
  chidlom: {
    slug: 'chidlom',
    name: 'Chidlom',
    lat: 13.7437,
    lng: 100.5430,
    areaSlug: 'indoor-golf-chidlom',
    description:
      'Chidlom sits in the upmarket Ploenchit shopping district between Central Embassy and Central Chidlom. LENGOLF is in The Mercury Ville above the BTS exit — pre-round practice on the indoor simulator is a 30-second walk from the station.',
  },
  'phrom-phong': {
    slug: 'phrom-phong',
    name: 'Phrom Phong',
    lat: 13.7300,
    lng: 100.5697,
    areaSlug: 'indoor-golf-phrom-phong',
    description:
      'Phrom Phong is the Japanese-expat heart of Bangkok, anchored by the EmQuartier and Emporium malls. A common base for golfers on multi-week stays who want a residential rather than business-hotel feel.',
  },
  'thong-lo': {
    slug: 'thong-lo',
    name: 'Thong Lo',
    lat: 13.7242,
    lng: 100.5783,
    areaSlug: 'indoor-golf-thong-lo',
    description:
      'Thong Lo is the dining-and-nightlife stretch of Sukhumvit, popular with younger international visitors and a growing pool of golf-trip itineraries that pair early tee times with late evenings on Soi 55.',
  },
  ekkamai: {
    slug: 'ekkamai',
    name: 'Ekkamai',
    lat: 13.7195,
    lng: 100.5840,
    description:
      'Ekkamai mixes boutique hotels, condo-style serviced apartments and the Eastern Bus Terminal — useful for golfers driving themselves to Pattaya-area courses on Highway 7.',
  },
  silom: {
    slug: 'silom',
    name: 'Silom',
    lat: 13.7290,
    lng: 100.5340,
    description:
      'Silom is the Bangkok financial district, served by BTS Sala Daeng and MRT Silom. Hotels here (Pullman, Le Meridien, Banyan Tree) host conference and incentive travellers who often want a single-day golf escape.',
  },
  sathorn: {
    slug: 'sathorn',
    name: 'Sathorn',
    lat: 13.7240,
    lng: 100.5292,
    description:
      'Sathorn runs along the south side of Lumpini Park and is dense with five-star hotels (Sukhothai, St. Regis, Sofitel So). The closest BTS is Chong Nonsi; many guests are on multi-day stays with one or two reserved tee times.',
  },
  siam: {
    slug: 'siam',
    name: 'Siam',
    lat: 13.7461,
    lng: 100.5340,
    description:
      'Siam is central Bangkok’s shopping core (Siam Paragon, Siam Center, MBK), and the most-walked transit interchange in the city. Tourist hotels here suit short-stay first-timers who want a half-day golf taster.',
  },
}

export const BTS_STATION_SLUGS = Object.keys(BTS_STATIONS)
