import type { GolfCourse } from '@/types/golf-courses'

export const course: GolfCourse = {
  slug: 'lam-luk-ka-country-club',
  region: 'bangkok',
  name: `Lam Luk Ka Country Club`,
  province: `Pathum Thani`,
  designer: `Roger Packard`,
  holes: 36,
  par: 72,
  year_opened: 1994,
  green_fee_weekday_thb: 2600,
  green_fee_weekend_thb: 3800,
  // All-in package per this file's own EN prose: the posted rate bundles the
  // caddie (and cart where the course has one). Stops generated copy calling
  // the number a bare "green fee", which would tell a reader they pay extra.
  fee_is_package: true,
  caddie_fee_thb: 0,
  cart_fee_thb: 0,
  caddie_required: true,
  cart_required: false,
  driving_range: true,
  club_rental_available: true,
  club_rental_fee_thb: 1000,
  club_rental_brands: null,
  website: 'https://www.lamlukkacc.com/',
  phone: null,
  latitude: 13.931,
  longitude: 100.783,
  distance_from_bangkok_km: 30,
  drive_time_from_bangkok_min: 70,
  google_maps_url: null,
  schema_markup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"GolfCourse\",\n  \"name\": \"Lam Luk Ka Country Club\",\n  \"url\": \"https://len.golf/golf-courses/bangkok/lam-luk-ka-country-club\",\n  \"description\": null,\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"addressLocality\": \"Pathum Thani\",\n    \"addressCountry\": \"TH\"\n  },\n  \"geo\": {\n    \"@type\": \"GeoCoordinates\",\n    \"latitude\": 13.931,\n    \"longitude\": 100.783\n  },\n  \"priceRange\": \"฿฿฿\",\n  \"sameAs\": [\n    \"https://www.lamlukkacc.com/\"\n  ],\n  \"amenityFeature\": [\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Driving Range\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Caddie Required\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Golf Cart\",\n      \"value\": false\n    }\n  ]\n}",
  prose: {
    overview: `Lam Luk Ka Country Club is a mature 36-hole facility north of Bangkok, established in 1994 and designed by Roger Packard. Located in Lam Luk Ka district, Pathum Thani — approximately 30km from the city centre — the club offers two distinct 18-hole experiences: the Championship East Course (A and B nines) and the Resort West Course (C and D nines). The course weaves through Bangkok's northern wetlands, where over 10,000 trees and a network of waterways provide habitat for hundreds of species of birds and wildlife. For golfers who enjoy a round that feels genuinely embedded in nature rather than a constructed resort environment, Lam Luk Ka is one of the best options near Bangkok. Green fees are all-inclusive of caddie and cart, and are among the most competitively priced at this quality level.`,
    layout_and_experience: `The Championship East Course is the more demanding of the two layouts, with longer carries over water and tighter approach corridors. The Resort West is more accommodating for higher handicappers. Both routing options take full advantage of the wetland setting — water is a constant presence and the bird life between holes is exceptional by any standard. The course conditioning has been consistently maintained since opening, with the mature tree lines and natural vegetation giving it a character that newer courses in the region cannot replicate. The 36-hole scale means the club can handle higher visitor volumes without the overcrowding that affects some single-course Bangkok facilities.`,
    tips: `Lam Luk Ka is close to Don Mueang Airport (about 30 minutes), making it a convenient option for golfers arriving via that terminal. The all-inclusive green fee (caddie, cart included) makes pricing transparent — no need to budget for extras beyond the quoted rate. Weekend afternoon rates are discounted significantly from the morning rate, offering good value for flexible golfers. Early morning tee times in cooler months (November–February) offer the best conditions in terms of both temperature and bird activity.`,
    location_and_access: `Lam Luk Ka Country Club is located approximately 30km north of central Bangkok in Lam Luk Ka District, Pathum Thani. The drive takes around 70 minutes from the city centre during normal traffic — traffic on the northern routes can be heavy in rush hours. The course is approximately 30 minutes from Don Mueang Airport. Grab is available for the route.`,
    rental_cta_context: `Playing Lam Luk Ka Country Club on your Bangkok golf trip? Rent premium clubs delivered to your hotel — no baggage, no hassle.`,
  },
  locales: {
    en: {
      title: `Lam Luk Ka Country Club — Green Fees, Course Guide & Golf Club Rentals`,
      meta_description: `Lam Luk Ka Country Club green fees, course overview, tips, and how to arrange golf club rentals delivered to your Bangkok hotel.`,
    },
    ko: null,
    zh: null,
    ja: null,
  },
  status: 'published',
  published_at: '2026-04-16',
}
