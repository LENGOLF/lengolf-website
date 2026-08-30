import type { GolfCourse } from '@/types/golf-courses'

export const course: GolfCourse = {
  slug: 'krungthep-kreetha-sports-club',
  region: 'bangkok',
  name: `Krungthep Kreetha Sports Club`,
  province: `Bangkok`,
  designer: `James R. Vaughn (redesign)`,
  holes: 18,
  par: 72,
  year_opened: 1969,
  green_fee_weekday_thb: 2850,
  green_fee_weekend_thb: 3300,
  // All-in package per this file's own EN prose: the posted rate bundles the
  // caddie (and cart where the course has one). Stops generated copy calling
  // the number a bare "green fee", which would tell a reader they pay extra.
  fee_is_package: true,
  caddie_fee_thb: 0,
  cart_fee_thb: 0,
  caddie_required: true,
  cart_required: true,
  driving_range: true,
  club_rental_available: true,
  club_rental_fee_thb: 1200,
  club_rental_brands: null,
  website: null,
  phone: null,
  latitude: 13.754,
  longitude: 100.662,
  distance_from_bangkok_km: 18,
  drive_time_from_bangkok_min: 20,
  google_maps_url: null,
  schema_markup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"GolfCourse\",\n  \"name\": \"Krungthep Kreetha Sports Club\",\n  \"url\": \"https://len.golf/golf-courses/bangkok/krungthep-kreetha-sports-club\",\n  \"description\": null,\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"addressLocality\": \"Bangkok\",\n    \"addressCountry\": \"TH\"\n  },\n  \"geo\": {\n    \"@type\": \"GeoCoordinates\",\n    \"latitude\": 13.754,\n    \"longitude\": 100.662\n  },\n  \"priceRange\": \"฿฿฿\",\n  \"amenityFeature\": [\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Driving Range\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Caddie Required\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Golf Cart\",\n      \"value\": true\n    }\n  ]\n}",
  prose: {
    overview: `Krungthep Kreetha Sports Club is one of Bangkok's most historic golf venues, originally opened on 1 June 1969 and extensively redesigned by James R. Vaughn in the mid-1990s. Located in the Hua Mak district of Bangkapi — just 18km from the city centre — it is among the most accessible of all Bangkok-area courses and consistently attracts a strong local following. Green fees are all-inclusive of caddie and cart at 2,850 THB on weekdays and 3,300 THB on weekends, making it one of the more affordable 18-hole options in the city. The course sits just off the Sirat Toll Road near Motorway 7, giving it strong access from the expressway network.`,
    layout_and_experience: `The redesigned 18-hole layout has matured well since the 1990s renovation, with established tree lines and defined corridors that give the course character and strategic depth. The design is not spectacular by contemporary standards but offers a solid, well-structured round on good-quality turf. The location inside Bangkok proper means the course fits into the urban environment — not a rural retreat, but a legitimate and enjoyable city course with a long heritage. Pace of play is generally well managed. The caddie team is experienced and the all-inclusive pricing means no unexpected costs.`,
    tips: `Krungthep Kreetha is one of the most practical courses for golfers staying in central or eastern Bangkok — the short drive time makes a morning round achievable without an extremely early start. The all-inclusive green fee (caddie and cart included) is competitive for a Bangkok city course. Advance booking is recommended on weekends when the course is popular with local members and their guests.`,
    location_and_access: `Krungthep Kreetha Sports Club is located at 282 Thanon Krung Thep Kreetha in Hua Mak, Bangkapi, Bangkok — approximately 18km from central Bangkok and 20 minutes by car under normal traffic. The course sits just off the Sirat Toll Road and Motorway 7, making it convenient from the east of the city. Grab is readily available for the route.`,
    rental_cta_context: `Playing Krungthep Kreetha Sports Club in Bangkok? Get premium golf clubs delivered to your hotel — quick, easy, and ready on the day.`,
  },
  locales: {
    en: {
      title: `Krungthep Kreetha Sports Club — Green Fees, Course Guide & Golf Club Rentals`,
      meta_description: `Krungthep Kreetha Sports Club green fees, course overview, tips, and how to arrange golf club rentals delivered to your Bangkok hotel.`,
    },
    ko: null,
    zh: null,
    ja: null,
  },
  status: 'published',
  published_at: '2026-04-16',
}
