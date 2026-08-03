import type { GolfCourse } from '@/types/golf-courses'

export const course: GolfCourse = {
  slug: 'royal-chiang-mai-golf-club',
  region: 'chiang-mai',
  name: `Royal Chiang Mai Golf Club & Resort`,
  province: `Chiang Mai`,
  designer: `Peter Thomson`,
  holes: 18,
  par: 72,
  year_opened: 1996,
  green_fee_weekday_thb: 4800,
  green_fee_weekend_thb: 4800,
  caddie_fee_thb: null,
  cart_fee_thb: 700,
  caddie_required: true,
  cart_required: true,
  driving_range: true,
  website: 'https://www.royalchiangmai.com/',
  phone: '+66 52 081 995',
  latitude: 19.0268,
  longitude: 98.9892,
  // Was 18.8417,99 — 20.6km off; the broken component was the LATITUDE, not the 0dp longitude. Official site DMS + Overture POI + polygon agree within 600m.
  coordinates_verified_at: '2026-07-31',
  distance_from_bangkok_km: 700,
  drive_time_from_bangkok_min: null,
  google_maps_url: null,
  club_rental_available: true,
  club_rental_fee_thb: null,
  club_rental_brands: null,
  schema_markup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"GolfCourse\",\n  \"name\": \"Royal Chiang Mai Golf Club & Resort\",\n  \"url\": \"https://len.golf/golf-courses/chiang-mai/royal-chiang-mai-golf-club\",\n  \"description\": null,\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"addressLocality\": \"Chiang Mai\",\n    \"addressCountry\": \"TH\"\n  },\n  \"geo\": {\n    \"@type\": \"GeoCoordinates\",\n    \"latitude\": 18.8417,\n    \"longitude\": 99\n  },\n  \"telephone\": \"+66 52 081 995\",\n  \"priceRange\": \"฿฿฿\",\n  \"sameAs\": [\n    \"https://www.royalchiangmai.com/\"\n  ],\n  \"amenityFeature\": [\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Driving Range\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Caddie Required\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Golf Cart\",\n      \"value\": true\n    }\n  ]\n}",
  prose: {
    overview: `Royal Chiang Mai Golf Club & Resort is one of the most storied courses in Northern Thailand: an 18-hole, par-72 design by five-time British Open champion Peter Thomson that opened in February 1996. Set within a valley approximately 40 kilometres north of Chiang Mai city in the Mae Faek area of San Sai district, the course was conceived as a British parkland layout with links-style elements, including pot bunkers, bump-and-run approaches, and undulating fairways that reward ground game strategy rather than purely aerial attacks on the pin. The site was formerly a fruit orchard, and the mature trees that remain give the layout a sense of scale and shade unusual for a course of its age. The surrounding mountain ridges frame the property and provide a scenic backdrop throughout the round.`,
    layout_and_experience: `Thomson's design at 6,969 yards is modest by modern yardage standards — there are no black tees — but the challenge comes from strategic placement rather than length. The course is heavily tree-lined, with corridors that punish anything other than a shaped tee shot. The fairways are undulating rather than flat, and Thomson incorporated the natural slope of the valley floor to create subtle ground-level hazards that affect the lie of approach shots.

Pot bunkers — deep, steep-faced, and strategically positioned to catch half-missed approaches — are the signature defense mechanism. Water hazards also appear on most holes, adding a second layer of strategic complexity. The greens are fast, well-maintained Tiff Dwarf bermuda surfaces. Peak condition is maintained in the cool dry season (November–March).`,
    tips: `Book at royalchiangmai.com or via a booking platform to confirm current rates — the high-season all-in rate of approximately 4,800 THB includes caddie and cart. Ask the caddie for yardage book guidance on the pot bunker positions before selecting a target line. The course rewards accuracy over distance — a conservative strategy off the tee will reduce double-bogey risk. Morning rounds are cooler and the valley mist in November–January adds distinctive atmosphere.`,
    location_and_access: `Royal Chiang Mai Golf Club & Resort is located in Mae Faek, San Sai District, approximately 40 kilometres north of Chiang Mai city and 40 minutes by road from Chiang Mai International Airport (CNX). Visitors from Bangkok fly to CNX (approximately 1 hour 10 minutes from Suvarnabhumi or Don Mueang) — driving the 700 kilometres from Bangkok is not practical. The course is reached by private car, Grab taxi, or the resort's transfer service via Route 1001 northward from Chiang Mai.`,
    rental_cta_context: `Playing Royal Chiang Mai Golf Club — Peter Thomson's classic Northern Thailand design? Rent premium clubs in Bangkok — delivered to your hotel before you fly — so you arrive ready to tackle those pot bunkers without the hassle of airline baggage fees.`,
  },
  locales: {
    en: {
      title: `Royal Chiang Mai Golf Club & Resort — Green Fees, Course Guide & Golf Club Rentals`,
      meta_description: `Royal Chiang Mai Golf Club & Resort green fees, course overview, tips, and how to arrange golf club rentals delivered to your Bangkok hotel.`,
    },
    ko: null,
    zh: null,
    ja: null,
  },
  status: 'published',
  published_at: '2026-04-21',
}
