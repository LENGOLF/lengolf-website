export interface GolfCourseLocale {
  title: string
  meta_description: string
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
  caddie_fee_thb: number | null
  cart_fee_thb: number | null
  caddie_required: boolean
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
  }
  status: 'published' | 'draft'
  published_at: string
}
