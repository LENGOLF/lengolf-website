import type { GolfCourse } from '@/types/golf-courses'
import { SITE_URL } from '@/lib/constants'

/**
 * Schema.org GolfCourse representation for a course summary card on a list
 * or comparison page. Compact — full GolfCourse schema lives on the
 * detail page via course.schema_markup.
 */
function golfCourseItem(c: GolfCourse): Record<string, unknown> {
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
  if (c.latitude !== null && c.longitude !== null) {
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
      description: 'Weekday green fee',
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
 */
export function getCourseDetailJsonLd(
  c: GolfCourse,
  canonicalUrl: string,
  imageUrl?: string
) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'GolfCourse',
    '@id': `${canonicalUrl}#golfcourse`,
    name: c.name,
    url: canonicalUrl,
    description: c.prose.overview,
    address: {
      '@type': 'PostalAddress',
      addressLocality: c.province,
      addressCountry: 'TH',
    },
  }
  if (imageUrl) schema.image = imageUrl

  if (c.latitude !== null && c.longitude !== null) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: c.latitude,
      longitude: c.longitude,
    }
    schema.hasMap =
      c.google_maps_url ??
      `https://www.google.com/maps/search/?api=1&query=${c.latitude},${c.longitude}`
  } else if (c.google_maps_url) {
    schema.hasMap = c.google_maps_url
  }

  if (c.phone) schema.telephone = c.phone
  if (c.website) schema.sameAs = [c.website]

  const fee = c.green_fee_weekday_thb
  if (fee !== null) {
    schema.priceRange = fee < 1500 ? '฿' : fee < 3000 ? '฿฿' : fee < 5000 ? '฿฿฿' : '฿฿฿฿'
    const offers: Record<string, unknown>[] = [
      {
        '@type': 'Offer',
        name: 'Weekday green fee',
        price: String(fee),
        priceCurrency: 'THB',
      },
    ]
    if (c.green_fee_weekend_thb !== null) {
      offers.push({
        '@type': 'Offer',
        name: 'Weekend green fee',
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
  const amenities = [
    amenity('Caddie Required', c.caddie_required),
    amenity('Golf Cart', c.cart_required),
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
 */
export function getCourseRoundupJsonLd(
  courses: GolfCourse[],
  pageUrl: string,
  listName: string
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
      item: golfCourseItem(c),
    })),
  }
}
