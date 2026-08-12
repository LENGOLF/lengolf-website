export interface GolfCourseLocale {
  title: string
  meta_description: string
  /**
   * Optional localized prose. A locale may ship title + meta_description only
   * (SERP presence first, body later) — the page falls back to the EN
   * `course.prose` per-field while translation is in flight.
   */
  prose?: GolfCourseProse
}

export interface GolfCourseProse {
  overview: string
  layout_and_experience: string
  tips: string
  location_and_access: string
  rental_cta_context: string
}

export interface GolfCourse {
  slug: string
  region: string
  name: string
  province: string
  designer: string | null
  holes: number
  par: number
  year_opened: number | null
  green_fee_weekday_thb: number | null
  green_fee_weekend_thb: number | null
  /**
   * When true, green_fee_weekday_thb / green_fee_weekend_thb are the
   * LOW-season / HIGH-season prices, not weekday / weekend. A handful of
   * resort courses (e.g. phuket-country-club) price by season; their prose
   * says so. Set this so the auto-generated "weekday/weekend" fee FAQ and
   * the meta fee line are suppressed rather than asserting a false
   * day-of-week split in FAQPage structured data.
   */
  fee_is_seasonal?: boolean
  caddie_fee_thb: number | null
  cart_fee_thb: number | null
  caddie_required: boolean
  /** Green fee is all-inclusive of the caddie tip (no extra tipping expected). */
  caddie_tip_included?: boolean
  cart_required: boolean
  driving_range: boolean | null
  website: string | null
  phone: string | null
  latitude: number | null
  longitude: number | null
  distance_from_bangkok_km: number | null
  drive_time_from_bangkok_min: number | null
  google_maps_url: string | null
  club_rental_available?: boolean | null
  club_rental_fee_thb?: number | null
  /**
   * ISO date (YYYY-MM-DD) when the green-fee figures were last verified
   * against a live source (official site, booking platform, or the course
   * directly). Rendered as a "rates checked" line and used by
   * `npm run validate:courses`: implausible fees (e.g. a sub-฿600 weekday
   * rate, which is usually a Thai-national/9-hole/promo rate scraped by
   * mistake) FAIL validation unless this field attests they were checked.
   */
  fees_verified_at?: string | null
  /**
   * ISO date (YYYY-MM-DD) when `latitude`/`longitude` were checked against an
   * authoritative source (official site, Google Maps place, OSM). Without it,
   * coordinates are trusted only if precise enough to be a real fix rather
   * than a district centroid (see `hasTrustedCoordinates` in lib/geo.ts):
   * the satellite map and schema.org GeoCoordinates are both gated on it.
   * `npm run verify:coordinates` batch-checks these against the Places API.
   */
  coordinates_verified_at?: string | null
  /**
   * Omit / null = open (the default). Set when research shows otherwise:
   * closed courses must have null green fees (validate:courses enforces
   * this), render a closure banner, and lead their FAQ with "Is X still
   * open?" instead of green-fee/caddie answers that imply bookable golf.
   */
  operational_status?: 'open' | 'temporarily_closed' | 'permanently_closed' | null
  /** 1-2 sentences shown in the closure banner and the "Is X still open?" FAQ. */
  operational_note?: string | null
  /** Club brands available for rental, e.g. "TaylorMade, Callaway" */
  club_rental_brands?: string | null
  /**
   * @deprecated Legacy hand-serialised JSON-LD string. The detail-page schema
   * is now derived from typed fields (lib/jsonld-courses.ts
   * getCourseDetailJsonLd); the ONLY part still read is the `address`
   * sub-object, whose street-level data has no typed equivalent yet. New
   * course files should omit this field (or provide just the address).
   */
  schema_markup?: string
  prose: GolfCourseProse
  locales: {
    en: GolfCourseLocale
    ko: GolfCourseLocale | null
    zh: GolfCourseLocale | null
    ja: GolfCourseLocale | null
    /**
     * Optional (`?`) unlike the legacy keys above so the 146 non-pilot course
     * files need no edits. A course only renders a Thai variant when it is
     * ALSO registered in COURSE_DETAIL_I18N (data/golf-courses-i18n.ts) and
     * th.staticRoutes (lib/translated-routes.ts) — this field alone changes
     * nothing.
     */
    th?: GolfCourseLocale | null
  }
  status: 'published' | 'draft'
  published_at: string
}
