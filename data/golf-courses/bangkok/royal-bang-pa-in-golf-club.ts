import type { GolfCourse } from '@/types/golf-courses'

export const course: GolfCourse = {
  slug: 'royal-bang-pa-in-golf-club',
  region: 'bangkok',
  name: `Royal Bang Pa-In Golf Club`,
  province: `Ayutthaya`,
  designer: `Schmidt-Curley Design`,
  holes: 18,
  par: 72,
  year_opened: 2017,
  green_fee_weekday_thb: 4300,
  green_fee_weekend_thb: 5400,
  // All-in package per this file's own EN prose: the posted rate bundles the
  // caddie (and cart where the course has one). Stops generated copy calling
  // the number a bare "green fee", which would tell a reader they pay extra.
  fee_is_package: true,
  // Zero, not null: EN prose calls the 4,300/5,400 package "all-inclusive of
  // caddie and cart". The 400 THB caddie TIP is separate and stays extra.
  caddie_fee_thb: 0,
  cart_fee_thb: 0,
  caddie_required: true,
  cart_required: true,
  driving_range: true,
  website: 'https://royalbpgolf.com',
  phone: null,
  latitude: 14.261,
  longitude: 100.576,
  distance_from_bangkok_km: 75,
  drive_time_from_bangkok_min: 60,
  google_maps_url: null,
  club_rental_available: true,
  club_rental_fee_thb: 1500,
  club_rental_brands: null,
  schema_markup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"GolfCourse\",\n  \"name\": \"Royal Bang Pa-In Golf Club\",\n  \"url\": \"https://len.golf/golf-courses/bangkok/royal-bang-pa-in-golf-club\",\n  \"description\": null,\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"addressLocality\": \"Ayutthaya\",\n    \"addressCountry\": \"TH\"\n  },\n  \"geo\": {\n    \"@type\": \"GeoCoordinates\",\n    \"latitude\": 14.261,\n    \"longitude\": 100.576\n  },\n  \"telephone\": null,\n  \"priceRange\": \"฿฿฿\",\n  \"sameAs\": [\n    \"https://maps.google.com/?q=14.261,100.576\",\n    \"https://royalbpgolf.com\"\n  ],\n  \"amenityFeature\": [\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Driving Range\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Caddie Required\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Golf Cart\",\n      \"value\": true\n    }\n  ]\n}",
  prose: {
    overview: `Royal Bang Pa-In Golf Club is one of the newest and most ambitious courses near Bangkok — a 2017 Schmidt-Curley championship layout in Ayutthaya province that has quickly earned a reputation as one of the region's finest modern venues. Stretching 7,054 yards from the tips across 100 hectares, the course is built on a grand scale with what reviewers describe as some of the largest and fastest greens in all of Asia, planted with Champion ultra-dwarf Bermuda grass. Schmidt-Curley Design — the same firm behind some of Asia's most acclaimed resort courses — brought unusual sophistication to the project: fairways are grassed in Paspalum turf (exceptional for tropical conditions), and there are genuine elevation changes of up to seven metres, rare for Thailand's largely flat central plain. The ultra-modern elliptical clubhouse with 360-degree views completes a package that punches above its price point.`,
    layout_and_experience: `The 18-hole layout is parkland in style but with more variety than most Bangkok-area courses. Elevation changes affect club selection throughout, and water features prominently on several holes — the 9th and 15th each have fairways split by water requiring strategic tee shot placement. The signature par-3 14th presents a full island green that is demanding even in calm conditions, more so on windy days. Square-style bunkers add a contemporary aesthetic alongside waste areas that give the course a links-inspired edge in certain sections. Tee time intervals are deliberately generous to maintain an unhurried pace — the club prides itself on a relaxed, premium experience rather than volume throughput.`,
    tips: `Package pricing (approximately 4,300 THB weekday, 5,400 THB weekend) is all-inclusive of caddie and cart — a weekend surcharge of around 1,100 THB applies. A recommended caddie tip of 400 THB is paid separately in cash after the round. Book well in advance for weekends, as the course limits group sizes (4 maximum on weekends). The modern clubhouse serves Thai, Chinese, Japanese, and Western cuisine. Titleist and Callaway rental sets are available for approximately 1,500–1,700 THB. The course is 30 minutes from Don Mueang Airport, making it more accessible from DMK than from Suvarnabhumi.`,
    location_and_access: `Royal Bang Pa-In Golf Club is located at 19 Bang Krasan, Bang Pa-In District, Phra Nakhon Si Ayutthaya Province. It lies approximately 75 km north of central Bangkok, about 60 minutes by car via the Expressway toward Don Mueang and then north on the Asia Highway (Highway 1). From Don Muang Airport the drive is approximately 30 minutes. The course is near the historic Bang Pa-In Royal Palace, a worthwhile additional excursion. There is no practical public transport link; private car, taxi, or Grab is the only realistic option.`,
    rental_cta_context: `Travelling the 75 km from Bangkok to Royal Bang Pa-In is far more comfortable without a set of clubs in the back seat. LENGOLF delivers premium rental clubs to your Bangkok hotel so you can head north hands-free and arrive ready to play.`,
  },
  locales: {
    en: {
      title: `Royal Bang Pa-In Golf Club — Green Fees, Course Guide & Golf Club Rentals`,
      meta_description: `Royal Bang Pa-In Golf Club green fees, course overview, tips, and how to arrange golf club rentals delivered to your Bangkok hotel.`,
    },
    ko: null,
    zh: null,
    ja: null,
  },
  status: 'published',
  published_at: '2026-04-20',
}
