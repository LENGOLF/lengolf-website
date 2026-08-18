import type { GolfCourse } from '@/types/golf-courses'
import { feeLabelsEn } from '@/lib/course-fees'
import { SITE_URL } from '@/lib/constants'
import { courseMapsUrl, hasTrustedCoordinates } from '@/lib/geo'
import { localizedCourseProse, type CourseSeoLocale } from '@/lib/course-seo'

/**
 * Resolves a course's two green-fee rates to `Offer` labels, e.g.
 * `{ lower: '平日グリーンフィー', upper: '週末グリーンフィー' }`.
 *
 * A FUNCTION rather than a resolved string pair because fee basis is per-course:
 * a seasonal course (low/high season) and a day-of-week course can appear in the
 * same roundup, so one pair resolved by the caller would mislabel whichever
 * disagrees with it. Localized callers build this from `feeOfferNames` in
 * lib/course-fees.ts; that indirection keeps this module sync and next-intl-free.
 */
export type CourseOfferNames = (c: GolfCourse) => { lower: string; upper: string }

/**
 * The EN default, byte-identical to the labels these builders emitted before
 * they took a locale. Used verbatim by the three EN-pinned roundup routes
 * (`/compare/`, `/near/`, `/best-for/` all pin `locale: 'en'` in
 * generateStaticParams), which therefore need no changes.
 */
const enOfferNames: CourseOfferNames = (c) => {
  const labels = feeLabelsEn(c)
  // A package course's rate covers the caddie and the cart, so the green-fee
  // noun is a false claim about what the number buys. The BASIS stays — a
  // package can still be cheaper on a weekday. See `feeHeadings`.
  const noun = c.fee_is_package ? 'package' : 'green fee'
  return { lower: `${labels.lower} ${noun}`, upper: `${labels.upper} ${noun}` }
}

/**
 * Schema.org GolfCourse representation for a course summary card on a list
 * or comparison page. Compact — full GolfCourse schema lives on the
 * detail page via course.schema_markup.
 */
function golfCourseItem(
  c: GolfCourse,
  offerNames: CourseOfferNames = enOfferNames
): Record<string, unknown> {
  const item: Record<string, unknown> = {
    '@type': 'GolfCourse',
    name: c.name,
    url: `${SITE_URL}/golf-courses/${c.region}/${c.slug}/`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: c.province,
      addressCountry: 'TH',
    },
  }
  // Same trust gate as the detail page's GolfCourse schema: an unverified
  // low-precision coordinate is worse as structured data than no geo at all.
  if (hasTrustedCoordinates(c)) {
    item.geo = {
      '@type': 'GeoCoordinates',
      latitude: c.latitude,
      longitude: c.longitude,
    }
  }
  if (c.green_fee_weekday_thb !== null) {
    // Schema.org / Google Rich Results convention is for `price` to be a
    // string ("1500"), not a number. The validator accepts both but warns
    // on the numeric form; matches the existing pattern in `lib/jsonld.ts`.
    item.offers = {
      '@type': 'Offer',
      price: String(c.green_fee_weekday_thb),
      priceCurrency: 'THB',
      description: offerNames(c).lower,
    }
  }
  return item
}

/**
 * Full GolfCourse JSON-LD for a course detail page, derived entirely from the
 * typed GolfCourse fields.
 *
 * Replaces the hand-serialised `course.schema_markup` string (which shipped
 * with a null description and an apex-domain URL that both had to be patched
 * at render time, and silently drifted whenever a typed field was edited
 * without re-serialising the JSON). Emits everything the static blobs had —
 * name, address, geo, telephone, priceRange, sameAs, amenityFeature — plus
 * what they were all missing: description, green-fee Offers, hasMap,
 * additionalProperty (holes/par), and a stable @id.
 *
 * `description` was localized by PR #97 via `localizedCourseProse`. `offerNames`
 * completes that pass: `makesOffer[].name` was still built from `feeLabelsEn`,
 * which lib/course-fees.ts reserves for the EN-pinned routes, so a translated
 * detail page carried a Japanese description beside an English "Weekday green
 * fee". Enumerating ONE field of a builder is not enumerating the builder.
 *
 * Deliberately still English on every locale, so the next reader doesn't
 * re-derive it:
 *   - `name` — the course is a Latin proper noun and `GolfCourseLocale` carries
 *     no localized name (only title / meta_description / prose).
 *   - `amenityFeature[].name` — enum-like facet keys, not prose. The
 *     GolfCourseDetail catalog does carry localized labels, but routing through
 *     them would also change EN output ("Golf Cart Required" -> "Cart
 *     required"), which a localization fix has no business doing.
 *     `additionalProperty[].name` is the OPPOSITE case and the honest reason is
 *     weaker: EN `statHoles`/`statPar` are byte-identical to the hardcoded
 *     'Holes'/'Par', so localizing it is free — it is simply out of scope here.
 *   - `address.addressLocality` — NOT because the derived branch below is hard
 *     to localize, but because it is never reached: all 149 course files carry a
 *     `schema_markup.address` object, so `legacyAddress` wins for every course
 *     and `addressLocality: c.province` is currently dead code. The English
 *     locality that actually ships comes from the legacy blob (28 of which
 *     already disagree with the visible `course.province` badge, in English).
 *     Localizing it therefore means overriding or retiring that blob — a real
 *     change, not a one-line swap. Note `golfCourseItem` above has no such
 *     short-circuit, so ITS `addressLocality` is live English on localized tier
 *     pages; see the known-gaps list in the PR.
 *   - `golfCourseItem`'s `url` — the same omission, and this list did not name
 *     it until a review pass measured it: that builder emits an EN-pinned
 *     `/golf-courses/<region>/<slug>/` while `RoundupList` links the same course
 *     via `courseDetailHref`, which prefixes the locale when the course IS
 *     translated. 100 of the 240 ItemList entries on the translated tier pages
 *     therefore name an English URL for a course whose localized page the same
 *     page advertises by hreflang. Fixing it needs the routing locale threaded
 *     into `CourseOfferNames`' sibling position — deliberately out of scope
 *     here, but a docblock that lists three of four English fields is worse
 *     than none, which is the whole point of "enumerated field-by-field or not
 *     at all".
 */
export function getCourseDetailJsonLd(
  c: GolfCourse,
  canonicalUrl: string,
  imageUrl?: string,
  /**
   * Content locale of the page this schema is embedded in. The description is
   * the one field here made of prose rather than typed facts, so on a
   * translated detail page it must follow the page language — the visible body
   * and the <meta description> are both already localized, and structured data
   * that contradicts them in English is a mismatch Google reads.
   * Defaults to 'en', keeping every EN page byte-identical.
   */
  locale: CourseSeoLocale = 'en',
  offerNames: CourseOfferNames = enOfferNames
) {
  // The legacy hand-serialised schema_markup blobs are otherwise retired, but
  // ~27 of them carry street-level address data (streetAddress, addressRegion,
  // postalCode, city-level locality) that exists nowhere in the typed fields.
  // Reuse that address sub-object when present so the derived schema doesn't
  // lose local-entity signal; everything else comes from typed fields.
  let legacyAddress: Record<string, unknown> | null = null
  if (c.schema_markup) {
    try {
      const parsed = JSON.parse(c.schema_markup) as Record<string, unknown>
      if (parsed.address && typeof parsed.address === 'object') {
        legacyAddress = parsed.address as Record<string, unknown>
      }
    } catch {
      // Malformed blob — fall through to the derived address
    }
  }

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'GolfCourse',
    '@id': `${canonicalUrl}#golfcourse`,
    name: c.name,
    url: canonicalUrl,
    description: localizedCourseProse(c, locale).overview,
    address: legacyAddress ?? {
      '@type': 'PostalAddress',
      addressLocality: c.province,
      addressCountry: 'TH',
    },
  }
  if (imageUrl) schema.image = imageUrl

  // A permanently closed course is a Place, not a bookable GolfCourse. Emit
  // location facts only: no telephone (Royal Dusit's number has been dead
  // since 2018), no green-fee offers, no amenityFeature (its "Driving Range:
  // true" has been parkland for eight years), no priceRange. Google reads
  // this as a live local entity otherwise, and LLM crawlers repeat it.
  if (c.operational_status === 'permanently_closed') {
    schema['@type'] = 'Place'
    schema['@id'] = `${canonicalUrl}#place`
    if (hasTrustedCoordinates(c)) {
      schema.geo = {
        '@type': 'GeoCoordinates',
        latitude: c.latitude,
        longitude: c.longitude,
      }
    }
    const closedMapsUrl = courseMapsUrl(c)
    if (closedMapsUrl) schema.hasMap = closedMapsUrl
    return schema
  }

  // Only publish GeoCoordinates we trust: a district-centroid coordinate
  // tells Google the course is up to a kilometre from where it actually is,
  // which is worse for local matching than omitting the property.
  if (hasTrustedCoordinates(c)) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: c.latitude,
      longitude: c.longitude,
    }
  }
  schema.hasMap = courseMapsUrl(c)

  if (c.phone) schema.telephone = c.phone
  if (c.website) schema.sameAs = [c.website]

  const fee = c.green_fee_weekday_thb
  if (fee !== null) {
    schema.priceRange = fee < 1500 ? '฿' : fee < 3000 ? '฿฿' : fee < 5000 ? '฿฿฿' : '฿฿฿฿'
    const names = offerNames(c)
    const offers: Record<string, unknown>[] = [
      {
        '@type': 'Offer',
        name: names.lower,
        price: String(fee),
        priceCurrency: 'THB',
      },
    ]
    if (c.green_fee_weekend_thb !== null) {
      offers.push({
        '@type': 'Offer',
        name: names.upper,
        price: String(c.green_fee_weekend_thb),
        priceCurrency: 'THB',
      })
    }
    schema.makesOffer = offers
  }

  schema.additionalProperty = [
    { '@type': 'PropertyValue', name: 'Holes', value: c.holes },
    { '@type': 'PropertyValue', name: 'Par', value: c.par },
  ]

  const amenity = (name: string, value: boolean) => ({
    '@type': 'LocationFeatureSpecification',
    name,
    value,
  })
  // Both flags are REQUIREMENT booleans, and the names must say so: emitting
  // "Golf Cart": false would assert the course has no carts, when 61 of the
  // 96 cart-optional courses rent them (cart_fee_thb present).
  const amenities = [
    amenity('Caddie Required', c.caddie_required),
    amenity('Golf Cart Required', c.cart_required),
  ]
  if (c.driving_range !== null) amenities.push(amenity('Driving Range', c.driving_range))
  if (c.club_rental_available !== null && c.club_rental_available !== undefined) {
    amenities.push(amenity('Club Rental', c.club_rental_available))
  }
  schema.amenityFeature = amenities

  return schema
}

/**
 * ItemList JSON-LD for a comparison page (two courses).
 */
export function getCourseComparisonJsonLd(
  a: GolfCourse,
  b: GolfCourse,
  pageUrl: string,
  listName: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    url: pageUrl,
    numberOfItems: 2,
    itemListElement: [
      { '@type': 'ListItem', position: 1, item: golfCourseItem(a) },
      { '@type': 'ListItem', position: 2, item: golfCourseItem(b) },
    ],
  }
}

/**
 * ItemList JSON-LD for a roundup page (proximity, price-tier, use-case).
 *
 * `offerNames` matters for exactly one caller: `/golf-courses/under/[tier]/` is
 * the only roundup route that SSGs non-EN locales (see its generateStaticParams
 * — `/near/`, `/best-for/` and `/compare/` all pin `locale: 'en'`), so it was
 * emitting an English `Offer.description` on its ja/ko/zh/th pages. Same root
 * cause as the detail-page Offer labels, and fixed in the same pass:
 * enumerating a defect and shipping only the cheaper half of it is how the
 * fee-basis bug survived four rounds.
 *
 * The EN default is silent by design (it keeps the three EN-pinned callers
 * byte-identical), which does mean a FUTURE localized roundup route would ship
 * English with nothing red. Smoke section L6 fetches this route's ItemList for
 * that reason; a new localized roundup needs its own assertion there.
 */
export function getCourseRoundupJsonLd(
  courses: GolfCourse[],
  pageUrl: string,
  listName: string,
  offerNames: CourseOfferNames = enOfferNames
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    url: pageUrl,
    numberOfItems: courses.length,
    itemListElement: courses.map((c, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: golfCourseItem(c, offerNames),
    })),
  }
}
