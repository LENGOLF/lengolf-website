import type { GolfCourse } from '@/types/golf-courses'
import { SITE_URL } from '@/lib/constants'
import { courseMapsUrl, hasTrustedCoordinates } from '@/lib/geo'

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
    description: c.prose.overview,
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
