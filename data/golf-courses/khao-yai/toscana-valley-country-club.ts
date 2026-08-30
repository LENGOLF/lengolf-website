import type { GolfCourse } from '@/types/golf-courses'

export const course: GolfCourse = {
  slug: 'toscana-valley-country-club',
  region: 'khao-yai',
  name: `Toscana Valley Country Club`,
  province: `Nakhon Ratchasima`,
  designer: `Bob McFarland`,
  holes: 18,
  par: 72,
  year_opened: 2009,
  green_fee_weekday_thb: 5000,
  green_fee_weekend_thb: 6000,
  // All-in package per this file's own EN prose: the posted rate bundles the
  // caddie (and cart where the course has one). Stops generated copy calling
  // the number a bare "green fee", which would tell a reader they pay extra.
  fee_is_package: true,
  // Zero, not null: EN prose states "The all-inclusive rate (green fee, caddie,
  // cart) is approximately 5,000 THB weekday and 6,000 THB weekend".
  caddie_fee_thb: 0,
  cart_fee_thb: 0,
  caddie_required: true,
  cart_required: true,
  driving_range: true,
  website: 'https://toscanavalley.com/',
  phone: '+66 87 549 7222',
  latitude: 14.5071,
  longitude: 101.5034,
  distance_from_bangkok_km: 150,
  drive_time_from_bangkok_min: 120,
  google_maps_url: null,
  club_rental_available: true,
  club_rental_fee_thb: null,
  club_rental_brands: null,
  schema_markup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"GolfCourse\",\n  \"name\": \"Toscana Valley Country Club\",\n  \"url\": \"https://len.golf/golf-courses/khao-yai/toscana-valley-country-club\",\n  \"description\": null,\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"addressLocality\": \"Nakhon Ratchasima\",\n    \"addressCountry\": \"TH\"\n  },\n  \"geo\": {\n    \"@type\": \"GeoCoordinates\",\n    \"latitude\": 14.5071,\n    \"longitude\": 101.5034\n  },\n  \"telephone\": \"+66 87 549 7222\",\n  \"priceRange\": \"฿฿฿\",\n  \"sameAs\": [\n    \"https://maps.google.com/?q=14.5071,101.5034\",\n    \"https://toscanavalley.com/\"\n  ],\n  \"amenityFeature\": [\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Driving Range\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Caddie Required\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Golf Cart\",\n      \"value\": true\n    }\n  ]\n}",
  prose: {
    overview: `Toscana Valley Country Club is widely considered one of the most dramatic and challenging golf experiences accessible from Bangkok, situated within the rolling hills surrounding Khao Yai National Park — a UNESCO World Heritage Site — approximately two hours north of the capital. Opened in 2009 and designed by American architect Bob McFarland, the course evokes the Tuscan landscape its name suggests: deep valleys, elevated tees, steep terrain changes, and sweeping vistas. It is part of the larger Toscana Valley resort complex, which includes residential villas, a hotel, and extensive leisure facilities. The course is reserved primarily for weekday play by the public (the resort's membership model influences weekend availability), making it a genuine escape-from-the-city proposition. Premium conditioning and a PGA-standard layout put this among the most prestigious courses in the Bangkok day-trip category.`,
    layout_and_experience: `McFarland's design exploits the Khao Yai terrain to its maximum, with tee boxes positioned on high ground offering panoramic views and fairways that plunge, rise, and bend through dense tropical forest. The deep valley setting means many holes play longer or shorter than the yardage suggests, and reading wind direction requires local knowledge. Raised greens with steep fall-offs punish anything short, while deep greenside bunkers catch errant approaches. The course measures 7,007 yards from the tips and is designated as one of the most challenging courses in Thailand — scores routinely run 10 or more strokes over a player's normal performance. Signature holes include dramatic par-3s requiring full carries over ravines and long par-4s where the dogleg angle cannot be cut. The par-5 holes offer tantalising risk/reward options but water and jungle punish the overambitious. Greens are fast and true. Carts are mandatory given the terrain, and caddies are extremely helpful for reading the complex topography.`,
    tips: `Toscana Valley is a destination round, not a quick weekday-morning spin — plan a full day and ideally combine with an overnight at the resort. The all-inclusive rate (green fee, caddie, cart) is approximately 5,000 THB weekday and 6,000 THB weekend, which represents genuine value for a PGA-standard mountain course. Play in the cool season (November to February) for the best conditions and most dramatic scenery. The journey is approximately 2 hours from Bangkok — start early to avoid midday heat on uphill holes. Correct club selection is critical given the elevation changes; your caddie's advice on yardage adjustments is essential. Tee times should be booked directly via the resort website or phone: +66 87 549 7222.`,
    location_and_access: `Toscana Valley Country Club is located at 2 Moo 11, Ban Nenthong, Pong Ta Long, Pak Chong, Nakhon Ratchasima 30450 — approximately 150 km north of Bangkok in the Khao Yai highlands. The drive from central Bangkok takes around 2 hours via Highway 2 (Mittraphap Road) to Pak Chong. The nearest town, Pak Chong, offers hotels and restaurants. The resort itself has on-site accommodation, making an overnight stay practical. The closest major city is Nakhon Ratchasima (Korat), about 45 minutes further north.`,
    rental_cta_context: `Making the two-hour drive to Toscana Valley is far more enjoyable without luggage; LENGOLF delivers tour-quality rental clubs to your Bangkok hotel before you depart, so you can travel light and arrive ready.`,
  },
  locales: {
    en: {
      title: `Toscana Valley Country Club — Green Fees, Course Guide & Golf Club Rentals`,
      meta_description: `Toscana Valley Country Club Khao Yai green fees, course overview, Bob McFarland design, tips for visiting, and golf club rentals delivered to your Bangkok hotel.`,
    },
    ko: null,
    zh: null,
    ja: null,
  },
  status: 'published',
  published_at: '2026-04-20',
}
