import { SITE_URL, SITE_NAME, BUSINESS_INFO, SOCIAL_LINKS, PHONE_E164, storageUrl } from '@/lib/constants'
import { relatedQuestionPath } from '@/lib/seo-links'
import type { UsedClub } from '@/lib/clubs'
import type { BayRateRow, MonthlyPackageRow, LessonPackage, EventPackage } from '@/data/pricing'
import type { MenuGroup } from '@/data/food-menu'

/**
 * Single source of truth for the schema.org PostalAddress, reused across every
 * LocalBusiness / EntertainmentBusiness block so the NAP can never drift between
 * pages. Sourced from BUSINESS_INFO.addressParts.
 */
export function getPostalAddressJsonLd() {
  return {
    '@type': 'PostalAddress' as const,
    streetAddress: BUSINESS_INFO.addressParts.streetAddress,
    addressLocality: BUSINESS_INFO.addressParts.addressLocality,
    addressRegion: BUSINESS_INFO.addressParts.addressRegion,
    postalCode: BUSINESS_INFO.addressParts.postalCode,
    addressCountry: BUSINESS_INFO.addressParts.addressCountry,
  }
}

/**
 * Customer-service ContactPoints for the Organization publisher node below.
 * They exist so a consumer reading the structured data can find a way to
 * reach the business; /about-us/ carries the same email and the same phone
 * NUMBER in visible copy, in the local format, and /contact/ 308s there.
 *
 * TWO nodes, split by channel, because the languages genuinely differ and a
 * single node cannot state that. The previous single node carried telephone
 * AND email under availableLanguage ['en','th'] — which contradicted the
 * site's own copy on the same rendered page: CourseClubRentalFaq.a11 ships as
 * FAQPage JSON-LD and names EMAIL as a channel answering in the reader's own
 * language, in every catalog. Be precise about the shape: an earlier draft
 * said "all five promise Korean, Japanese and Chinese" and only TWO do. en and
 * th name all three languages ("email us and we'll respond in your language"
 * is the EN wording, not a shared one); ja, ko and zh each promise only their
 * OWN language. The union is identical and the conclusion is unchanged — every
 * catalog offers email in its own language, so the email channel genuinely
 * spans all five. So the structured data under-claimed email
 * support in exactly the three languages the ja/ko/zh landing pages exist to
 * attract, while sitting beside a node claiming the opposite.
 *
 * The en+th restriction is KEPT on the phone, but state the evidence
 * honestly, because an earlier draft of this note claimed "no copy anywhere
 * states telephone support in those languages" and that is FALSE. What the
 * copy actually says, in three places that do not agree with each other:
 *
 *   - CourseClubRentalFaq.a11 (all 5): staff CAN assist in ko/ja/zh, and the
 *     channels it names are LINE and EMAIL. Phone is not named.
 *   - data/faq-hub.ts ctaSubtitle (ja/ko/zh): replies come in English and
 *     Thai, with ja/ko/zh handled "on LINE @lengolf". It lists LINE, phone
 *     and booking as channels and is SILENT on email — silence, not an
 *     exclusion, which is why it does not contradict the email node below.
 *   - CourseClubRental.contactLanguageNote (ja/ko/zh only): a bare
 *     "日本語対応可" / "한국어로 답변 가능합니다" / "支持中文服务" rendered by
 *     MultiChannelContact.tsx as the LAST element, directly beneath the phone
 *     row. It is channel-agnostic, so a reader may well take it as covering
 *     the phone number immediately above it.
 *
 * So: nothing affirmatively promises PHONE support in ja/ko/zh, and the two
 * explicit statements both route those languages to LINE/email — which is why
 * en+th stays. But the third string is genuinely ambiguous, so this is a
 * best-supported reading of contradictory copy, NOT a settled fact. If the
 * business does answer the phone in Japanese, widening this node is correct
 * and the smoke assertion below must move with it. Flagged for an owner
 * decision rather than silently cemented.
 *
 * The error the split fixes is narrower and is not in doubt: applying that
 * (defensible) phone reasoning to the EMAIL channel too, where a11 names
 * email explicitly in all five catalogs.
 *
 * LINE is not a third ContactPoint, but it is no longer absent either, and an
 * earlier draft of this note was wrong about why. schema.org has no
 * contactType or ContactPoint property that identifies a messaging account —
 * true — but that note concluded LINE "could only be smuggled in as a bare
 * url", which is false: sameAs is schema.org's documented mechanism for
 * identifying an account elsewhere, and THIS NODE ALREADY USED IT for Facebook
 * and Instagram. Since a11 names LINE FIRST in all five catalogs and
 * data/faq-hub.ts routes ja/ko/zh to LINE specifically, leaving the primary
 * non-English channel out of the structured data was a real gap, not a
 * principled omission. SOCIAL_LINKS.lineProfile now sits in sameAs on both
 * business nodes, by the identical mechanism. Note it is lineProfile, not
 * line: sameAs wants a stable identity URL, and the CTA shortlink is
 * rotatable. See the note in lib/constants.ts.
 *
 * No areaServed: a single-country value reads as "out of area" for the
 * pre-arrival enquiries the ja/ko/zh landing pages exist to attract, and the
 * four existing areaServed values in this file are all Place objects
 * ({ '@type': 'City', name: 'Bangkok' }), so a bare 'TH' string would be a
 * fifth spelling of the concept. Unbounded is both truer and cheaper.
 */
export function getContactPointJsonLd() {
  return [
    {
      '@type': 'ContactPoint' as const,
      contactType: 'customer service',
      telephone: PHONE_E164,
      availableLanguage: ['en', 'th'],
    },
    {
      '@type': 'ContactPoint' as const,
      contactType: 'customer service',
      email: BUSINESS_INFO.email,
      availableLanguage: ['en', 'th', 'ja', 'ko', 'zh'],
    },
  ]
}

/**
 * The site-wide EntertainmentBusiness node's '@id'. Rendered by the locale
 * layout on every page, so a node elsewhere can point at the business with
 * `getBusinessRef()` instead of restating it. First consumer: the coaches'
 * `worksFor` on /lessons/.
 */
export const BUSINESS_ENTITY_ID = `${SITE_URL}/#organization`

/** A reference to the layout's EntertainmentBusiness node. name/url ride
 *  along so a consumer that does not resolve '@id' still reads the entity. */
export function getBusinessRef() {
  return {
    '@type': 'EntertainmentBusiness' as const,
    '@id': BUSINESS_ENTITY_ID,
    name: BUSINESS_INFO.name,
    url: SITE_URL,
  }
}

export function getLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EntertainmentBusiness',
    '@id': BUSINESS_ENTITY_ID,
    name: BUSINESS_INFO.name,
    legalName: BUSINESS_INFO.legalName,
    url: SITE_URL,
    // E.164, matching the Organization contactPoint below. Was the Thai
    // local format ("096-668-2335") — fine for a human reading the page, but
    // undiallable from abroad, and a second spelling of one number once
    // contactPoint landed. Visible copy still uses BUSINESS_INFO.phone.
    telephone: PHONE_E164,
    email: BUSINESS_INFO.email,
    address: getPostalAddressJsonLd(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_INFO.coordinates.lat,
      longitude: BUSINESS_INFO.coordinates.lng,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '23:00',
    },
    sameAs: [SOCIAL_LINKS.facebook, SOCIAL_LINKS.instagram, SOCIAL_LINKS.lineProfile],
    image: storageUrl('branding/logo.png'),
    priceRange: '$$',
  }
}

export function getWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    // The publisher Organization is a node consumers read for entity
    // resolution. It carried name/url/logo/sameAs — so it already had the
    // canonical reconciliation property, but nothing to verify the business
    // against or contact it by. address + contactPoint add that, and both
    // reuse the shared NAP helpers so they cannot drift from the
    // EntertainmentBusiness node above.
    //
    // '@id' BUSINESS_ENTITY_ID makes this the SAME entity as the layout's
    // EntertainmentBusiness, so a consumer that resolves '@id' merges the two
    // instead of reading two unlinked LENGOLF nodes. Safe because each value
    // the two nodes share (name, legalName, url, address, telephone, email,
    // sameAs) comes from the same constant or helper on both, and the rest
    // (logo, contactPoint here; image, geo, hours there) only adds. The
    // /location/* pages no longer add a third node (getLocationWebPageJsonLd
    // below replaced the DB blob).
    //
    // Known gap, named rather than fixed: other id-less LENGOLF nodes still
    // ship. The thin publisher Organizations on /guide/, /blog/ and
    // /blog/[slug] (plus the blog post's author Organization); the
    // aggregate-rating EntertainmentBusiness on / and /about-us/
    // (getAggregateRatingJsonLd); the LENGOLF item on the /best/ listicle; and
    // getHotelConciergePageJsonLd's LocalBusiness on every /hotels/<slug>/,
    // which carries a per-page url, the exact pattern removed from /location/.
    // Pointing them at BUSINESS_ENTITY_ID is the fix that scales; check each
    // one's values agree with this node first, because sharing the id merges
    // them, and a per-page url or description must move off the business.
    //
    // Deliberately NO `description`: SITE_DESCRIPTION is English-only and
    // this node renders on every ja/ko/zh/th page, so adding it would put an
    // English blurb inside localized structured data — the defect class this
    // repo keeps re-learning. Localizing it needs 4 translated strings with
    // native QA, i.e. a translation batch, not a line here.
    publisher: {
      '@type': 'Organization',
      '@id': BUSINESS_ENTITY_ID,
      // BUSINESS_INFO.name, not SITE_NAME: this node now merges into the
      // business entity, whose name comes from BUSINESS_INFO.name. Both are
      // 'LENGOLF' today, but two literals can drift and the merge must not.
      name: BUSINESS_INFO.name,
      legalName: BUSINESS_INFO.legalName,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: storageUrl('branding/logo.png'),
      },
      address: getPostalAddressJsonLd(),
      // Scalar telephone/email in ADDITION to contactPoint. Google's guidance
      // points this way, but do NOT quote it as if it covered this node: the
      // sentence ("specify a primary phone number at the LocalBusiness level
      // before using contactPoint") is scoped to LocalBusiness and to PHONE.
      // This is an Organization. What actually licenses these two lines is
      // schema.org: telephone and email are DIRECT properties of Organization,
      // not inherited, so stating them here is well-formed regardless.
      //
      // This is not redundancy: contactPoint became an ARRAY when it split by
      // channel, so `publisher.contactPoint.telephone` — a scalar read that
      // worked before — now yields undefined. Conformant JSON-LD/RDF parsers
      // are unaffected, but hand-rolled scrapers and LLM extractors reading
      // the raw JSON are, and they do not get patched. This repo's own smoke
      // test made exactly that mistake in the same commit. These two lines
      // restore the scalar read with no loss, and the language nuance stays
      // where only contactPoint can express it.
      telephone: PHONE_E164,
      email: BUSINESS_INFO.email,
      contactPoint: getContactPointJsonLd(),
      sameAs: [SOCIAL_LINKS.facebook, SOCIAL_LINKS.instagram, SOCIAL_LINKS.lineProfile],
    },
  }
}

/**
 * The JSON-LD for a /location/<slug>/ page: a WebPage ABOUT the business, not
 * a second copy of it. The business itself is described once, by the
 * layout's EntertainmentBusiness (BUSINESS_ENTITY_ID), on every page.
 *
 * Replaces location_pages.schema_markup, which these pages used to print
 * verbatim. Measured 2026-10-07, all 85 blobs said openingHours
 * "Mo-Su 10:00-23:00" (the venue opens 09:00), carried geo 13.7437,100.5436
 * (canonical: BUSINESS_INFO.coordinates), used a second address spelling,
 * and 84 of 85 had a `url` without the /location/ prefix (about 70 of those
 * 404; 14 hit rootLocationRedirects in next.config.js and redirect). Those
 * values were copied once at import and nothing kept them in step with
 * BUSINESS_INFO. Building the node here means there is no copy to drift.
 *
 * Why not a LocalBusiness with the shared '@id': a consumer merges every node
 * that shares an '@id', so per-page values (this page's description and URL)
 * would land on the one business entity, 85 times over. They belong to the
 * page, which `about` links to the business.
 */
export function getLocationWebPageJsonLd(page: { slug: string; title: string; description: string | null }) {
  const url = `${SITE_URL}/location/${page.slug}/`
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    url,
    name: page.title,
    ...(page.description ? { description: page.description } : {}),
    // The route is EN-only (generateStaticParams emits locale 'en').
    inLanguage: 'en',
    about: getBusinessRef(),
  }
}

/** Parse "X,XXX THB" → "XXXX" (string for JSON-LD price field) */
function parseThbToString(thb: string): string {
  return thb.replace(/[^0-9]/g, '')
}

export function getGolfPricingJsonLd(dynamicBayRates?: BayRateRow[], dynamicPackages?: MonthlyPackageRow[]) {
  // Bay rate offers — use dynamic data if provided
  const bayOffers = dynamicBayRates
    ? [
        ...dynamicBayRates.flatMap((row) => [
          {
            '@type': 'Offer' as const,
            name: `Simulator Bay – Weekday ${row.timeSlot}`,
            description: 'Mon–Thu, up to 5 players per bay, golf club rental included',
            price: parseThbToString(row.weekday),
            priceCurrency: 'THB',
            unitCode: 'HUR',
            eligibleDuration: { '@type': 'QuantitativeValue', value: 1, unitCode: 'HUR' },
          },
          {
            '@type': 'Offer' as const,
            name: `Simulator Bay – Weekend ${row.timeSlot}`,
            description: 'Fri–Sun, up to 5 players per bay, golf club rental included',
            price: parseThbToString(row.weekend),
            priceCurrency: 'THB',
            unitCode: 'HUR',
            eligibleDuration: { '@type': 'QuantitativeValue', value: 1, unitCode: 'HUR' },
          },
        ]),
      ]
    : [
        {
          '@type': 'Offer' as const,
          name: 'Simulator Bay – Weekday Before 14:00',
          description: 'Mon–Thu, up to 5 players per bay, golf club rental included',
          price: '550',
          priceCurrency: 'THB',
          unitCode: 'HUR',
          eligibleDuration: { '@type': 'QuantitativeValue', value: 1, unitCode: 'HUR' },
        },
        {
          '@type': 'Offer' as const,
          name: 'Simulator Bay – Weekday 14:00–23:00',
          description: 'Mon–Thu, up to 5 players per bay, golf club rental included',
          price: '750',
          priceCurrency: 'THB',
          unitCode: 'HUR',
          eligibleDuration: { '@type': 'QuantitativeValue', value: 1, unitCode: 'HUR' },
        },
        {
          '@type': 'Offer' as const,
          name: 'Simulator Bay – Weekend Before 14:00',
          description: 'Fri–Sun, up to 5 players per bay, golf club rental included',
          price: '750',
          priceCurrency: 'THB',
          unitCode: 'HUR',
          eligibleDuration: { '@type': 'QuantitativeValue', value: 1, unitCode: 'HUR' },
        },
        {
          '@type': 'Offer' as const,
          name: 'Simulator Bay – Weekend 14:00–23:00',
          description: 'Fri–Sun, up to 5 players per bay, golf club rental included',
          price: '950',
          priceCurrency: 'THB',
          unitCode: 'HUR',
          eligibleDuration: { '@type': 'QuantitativeValue', value: 1, unitCode: 'HUR' },
        },
      ]

  // Package descriptions keyed by name — used for both dynamic and static paths
  const pkgDescriptions: Record<string, string> = {
    'Early Bird*': '10 hours valid for 6 months, usable before 14:00 only',
    'Early Bird+*': 'Unlimited hours for 1 month, usable before 14:00 only, 5% off food & drinks',
    'Bronze': '5 hours valid for 1 month',
    'Silver': '15 hours valid for 3 months, 5% off food & drinks',
    'Gold': '30 hours valid for 6 months, 10% off food & drinks',
    'Diamond': 'Unlimited hours for 1 month, 5% off food & drinks',
    'Diamond+': 'Unlimited hours for 3 months, 10% off food & drinks',
  }

  const packageOffers = dynamicPackages
    ? dynamicPackages.map((pkg) => ({
        '@type': 'Offer' as const,
        name: `${pkg.name.replace(/\*$/, '')} Package – ${pkg.hours === 'Unlimited' ? 'Unlimited' : `${pkg.hours} Hours`}`,
        description: pkgDescriptions[pkg.name] || `${pkg.hours} hours, ${pkg.validity} validity`,
        price: parseThbToString(pkg.price),
        priceCurrency: 'THB',
      }))
    : [
        { '@type': 'Offer' as const, name: 'Early Bird Package – 10 Hours', description: pkgDescriptions['Early Bird*'], price: '4800', priceCurrency: 'THB' },
        { '@type': 'Offer' as const, name: 'Early Bird+ Package – Unlimited', description: pkgDescriptions['Early Bird+*'], price: '5000', priceCurrency: 'THB' },
        { '@type': 'Offer' as const, name: 'Bronze Package – 5 Hours', description: pkgDescriptions['Bronze'], price: '3000', priceCurrency: 'THB' },
        { '@type': 'Offer' as const, name: 'Silver Package – 15 Hours', description: pkgDescriptions['Silver'], price: '8000', priceCurrency: 'THB' },
        { '@type': 'Offer' as const, name: 'Gold Package – 30 Hours', description: pkgDescriptions['Gold'], price: '14000', priceCurrency: 'THB' },
        { '@type': 'Offer' as const, name: 'Diamond Package – Unlimited', description: pkgDescriptions['Diamond'], price: '8000', priceCurrency: 'THB' },
        { '@type': 'Offer' as const, name: 'Diamond+ Package – Unlimited', description: pkgDescriptions['Diamond+'], price: '18000', priceCurrency: 'THB' },
      ]

  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'LENGOLF Simulator Bay Pricing',
    description: 'Indoor golf simulator bay rates and monthly packages at LENGOLF Bangkok',
    provider: {
      '@type': 'EntertainmentBusiness',
      name: BUSINESS_INFO.name,
      url: SITE_URL,
    },
    itemListElement: [...bayOffers, ...packageOffers],
  }
}

export function getEventsPricingJsonLd(dynamicEventPackages?: EventPackage[]) {
  const eventDescriptions: Record<string, string> = {
    'Small Package': '10–15 guests, 2 golf bays, 3 hours. Includes 10 beers, 5 cocktails, unlimited soft drinks, and catered food spread from Smith & Co.',
    'Medium Package': '15–25 guests, 4 golf bays, 3 hours, exclusive full-location rental. Includes 20 beers, 10 cocktails, unlimited soft drinks, and catered food from Smith & Co. & Pizza Mania.',
  }

  const offers = dynamicEventPackages
    ? dynamicEventPackages.map((pkg) => ({
        '@type': 'Offer' as const,
        name: `${pkg.name.replace(/ Package$/, '')} Event Package`,
        description: eventDescriptions[pkg.name] || `${pkg.guests}, ${pkg.bays}, ${pkg.duration}`,
        price: parseThbToString(pkg.price),
        priceCurrency: 'THB',
      }))
    : [
        {
          '@type': 'Offer' as const,
          name: 'Small Event Package',
          description: eventDescriptions['Small Package'],
          price: '9999',
          priceCurrency: 'THB',
        },
        {
          '@type': 'Offer' as const,
          name: 'Medium Event Package',
          description: eventDescriptions['Medium Package'],
          price: '21999',
          priceCurrency: 'THB',
        },
      ]

  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'LENGOLF Event Packages',
    description: 'Event and party packages at LENGOLF Bangkok — indoor golf venue with full bar and catering',
    provider: {
      '@type': 'EntertainmentBusiness',
      name: BUSINESS_INFO.name,
      url: SITE_URL,
    },
    itemListElement: offers,
  }
}

export function getEventsServiceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Private Events & Party Hosting at LENGOLF',
    description:
      'Private event, party, and corporate team-building hosting at LENGOLF Bangkok — indoor golf simulator bays with a full bar, catered food, and full-venue rental options.',
    provider: {
      '@type': 'EntertainmentBusiness',
      name: BUSINESS_INFO.name,
      url: SITE_URL,
    },
    serviceType: 'Event Venue',
    areaServed: {
      '@type': 'City',
      name: 'Bangkok',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Small Event Package',
        price: '9999',
        priceCurrency: 'THB',
        description: '10–15 guests, 2 golf bays, 3 hours, drinks and catered food included',
      },
      {
        '@type': 'Offer',
        name: 'Medium Event Package',
        price: '21999',
        priceCurrency: 'THB',
        description: '15–25 guests, 4 golf bays, 3 hours, exclusive full-venue rental with drinks and catering',
      },
    ],
  }
}

export function getLessonsPricingJsonLd(dynamicLessonPricing?: LessonPackage[]) {
  const lessonDescriptions: Record<string, { description: string; unitCode?: string; duration?: number }> = {
    '1 Hour': { description: 'One-on-one coaching with a PGA-certified professional, golf simulator usage included', unitCode: 'HUR', duration: 1 },
    '5 Hour': { description: '5 hours of coaching, valid for 6 months, golf simulator usage included' },
    '10 Hour': { description: '10 hours of coaching, valid for 12 months, golf simulator usage included' },
    '20 Hour': { description: '20 hours of coaching, valid for 24 months, golf simulator usage included' },
    '30 Hour': { description: '30 hours of coaching, valid for 24 months, golf simulator usage included' },
    '50 Hour': { description: '50 hours of coaching, valid for 24 months, golf simulator usage included' },
    'Starter Package*': { description: '5 hours coaching + 5 hours practice, valid for 6 months, free golf glove included' },
    'Sim to Fairway*': { description: '5 hours coaching + 1 on-course lesson, on-course fees covered by customer' },
  }

  const offers = dynamicLessonPricing
    ? dynamicLessonPricing.map((pkg) => {
        const meta = lessonDescriptions[pkg.name]
        const offerName = pkg.name.replace(/\*$/, '').trim()
        const offer: Record<string, unknown> = {
          '@type': 'Offer',
          name: offerName.includes('Package') ? offerName : `${offerName} Golf Lesson Package`,
          description: meta?.description || `${pkg.name} golf coaching package`,
          price: parseThbToString(pkg.oneGolfer),
          priceCurrency: 'THB',
        }
        if (meta?.unitCode) {
          offer.unitCode = meta.unitCode
          offer.eligibleDuration = { '@type': 'QuantitativeValue', value: meta.duration, unitCode: meta.unitCode }
        }
        return offer
      })
    : [
        { '@type': 'Offer', name: '1 Hour Golf Lesson', description: lessonDescriptions['1 Hour'].description, price: '1800', priceCurrency: 'THB', unitCode: 'HUR', eligibleDuration: { '@type': 'QuantitativeValue', value: 1, unitCode: 'HUR' } },
        { '@type': 'Offer', name: '5 Hour Golf Lesson Package', description: lessonDescriptions['5 Hour'].description, price: '8500', priceCurrency: 'THB' },
        { '@type': 'Offer', name: '10 Hour Golf Lesson Package', description: lessonDescriptions['10 Hour'].description, price: '16000', priceCurrency: 'THB' },
        { '@type': 'Offer', name: '20 Hour Golf Lesson Package', description: lessonDescriptions['20 Hour'].description, price: '31000', priceCurrency: 'THB' },
        { '@type': 'Offer', name: '30 Hour Golf Lesson Package', description: lessonDescriptions['30 Hour'].description, price: '45000', priceCurrency: 'THB' },
        { '@type': 'Offer', name: '50 Hour Golf Lesson Package', description: lessonDescriptions['50 Hour'].description, price: '72000', priceCurrency: 'THB' },
        { '@type': 'Offer', name: 'Starter Package', description: lessonDescriptions['Starter Package*'].description, price: '11000', priceCurrency: 'THB' },
        { '@type': 'Offer', name: 'Sim to Fairway Package', description: lessonDescriptions['Sim to Fairway*'].description, price: '13499', priceCurrency: 'THB' },
      ]

  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'LENGOLF Golf Lesson Packages',
    description: 'Golf coaching packages with Thailand PGA-certified professionals at LENGOLF Bangkok. Simulator usage included.',
    provider: getBusinessRef(),
    itemListElement: offers,
  }
}

export function getClubRentalPricingJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'LENGOLF Golf Club Rental',
    description: 'Golf club rental service at LENGOLF Bangkok — free standard sets, premium Callaway rentals, Premium+ Callaway Paradym, gear add-ons, and delivery in Bangkok',
    provider: {
      '@type': 'EntertainmentBusiness',
      name: BUSINESS_INFO.name,
      url: SITE_URL,
    },
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Standard Club Set – Free',
        description: 'House set included free with every bay booking. Men\'s and ladies\' sets available. Driver, irons (5–PW), putter.',
        price: '0',
        priceCurrency: 'THB',
      },
      {
        '@type': 'Offer',
        name: 'Premium Club Rental – 1 Hour',
        description: 'Callaway Warbird (men\'s) or Callaway REVA (women\'s) full set for 1 hour',
        price: '150',
        priceCurrency: 'THB',
        unitCode: 'HUR',
        eligibleDuration: { '@type': 'QuantitativeValue', value: 1, unitCode: 'HUR' },
      },
      {
        '@type': 'Offer',
        name: 'Premium Club Rental – 2 Hours',
        description: 'Callaway Warbird or Callaway REVA full set for 2 hours',
        price: '250',
        priceCurrency: 'THB',
      },
      {
        '@type': 'Offer',
        name: 'Premium Club Rental – 3 Hours',
        description: 'Callaway Warbird or Callaway REVA full set for 3 hours',
        price: '350',
        priceCurrency: 'THB',
      },
      {
        '@type': 'Offer',
        name: 'Premium Club Rental – 4 Hours',
        description: 'Callaway Warbird or Callaway REVA full set for 4 hours',
        price: '400',
        priceCurrency: 'THB',
      },
      {
        '@type': 'Offer',
        name: 'Premium Club Rental – 5 Hours',
        description: 'Callaway Warbird or Callaway REVA full set for 5 hours',
        price: '450',
        priceCurrency: 'THB',
      },
      {
        '@type': 'Offer',
        name: 'Premium+ Club Rental – 1 Hour',
        description: 'Callaway Paradym Forged Carbon full set for 1 hour',
        price: '250',
        priceCurrency: 'THB',
        unitCode: 'HUR',
        eligibleDuration: { '@type': 'QuantitativeValue', value: 1, unitCode: 'HUR' },
      },
      {
        '@type': 'Offer',
        name: 'Premium+ Club Rental – 2 Hours',
        description: 'Callaway Paradym Forged Carbon full set for 2 hours',
        price: '450',
        priceCurrency: 'THB',
      },
      {
        '@type': 'Offer',
        name: 'Premium+ Club Rental – 3 Hours',
        description: 'Callaway Paradym Forged Carbon full set for 3 hours',
        price: '650',
        priceCurrency: 'THB',
      },
      {
        '@type': 'Offer',
        name: 'Premium+ Club Rental – 4 Hours',
        description: 'Callaway Paradym Forged Carbon full set for 4 hours',
        price: '800',
        priceCurrency: 'THB',
      },
      {
        '@type': 'Offer',
        name: 'Premium+ Club Rental – 5 Hours',
        description: 'Callaway Paradym Forged Carbon full set for 5 hours',
        price: '950',
        priceCurrency: 'THB',
      },
      {
        '@type': 'Offer',
        name: 'Golf Gloves',
        description: 'Premium synthetic leather gloves in all sizes',
        price: '600',
        priceCurrency: 'THB',
      },
      {
        '@type': 'Offer',
        name: 'Golf Balls – 6 Pack',
        description: 'Practice-grade balls for range or course play, 6 balls per pack',
        price: '400',
        priceCurrency: 'THB',
      },
      {
        '@type': 'Offer',
        name: 'Club Delivery in Bangkok',
        description: 'Same-day delivery of premium club sets anywhere in Bangkok',
        price: '500',
        priceCurrency: 'THB',
      },
    ],
  }
}

export function getHomePricingJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'LENGOLF Services & Pricing Overview',
    description: 'Indoor golf simulator bay rental, monthly packages, golf lessons, and event packages at LENGOLF Bangkok',
    provider: {
      '@type': 'EntertainmentBusiness',
      name: BUSINESS_INFO.name,
      url: SITE_URL,
    },
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Bay Rental',
        description: 'Indoor golf simulator bay rental, up to 5 players per bay, golf club rental included',
        price: '550',
        priceCurrency: 'THB',
        unitCode: 'HUR',
        eligibleDuration: { '@type': 'QuantitativeValue', value: 1, unitCode: 'HUR' },
      },
      {
        '@type': 'Offer',
        name: 'Monthly Packages',
        description: 'Monthly simulator bay packages from 5 to unlimited hours with F&B discounts',
        price: '3000',
        priceCurrency: 'THB',
      },
      {
        '@type': 'Offer',
        name: 'Golf Lessons',
        description: 'One-on-one coaching with PGA-certified professionals, simulator usage included',
        price: '1800',
        priceCurrency: 'THB',
        unitCode: 'HUR',
        eligibleDuration: { '@type': 'QuantitativeValue', value: 1, unitCode: 'HUR' },
      },
      {
        '@type': 'Offer',
        name: 'Event Packages',
        description: 'Private event packages with golf bays, drinks, catered food, and full-location rental options',
        price: '9999',
        priceCurrency: 'THB',
      },
    ],
  }
}

export function getAggregateRatingJsonLd(rating: number, reviewCount: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EntertainmentBusiness',
    name: BUSINESS_INFO.name,
    url: SITE_URL,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount: reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  }
}

export function getFaqPageJsonLd(faqItems: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function getLessonsServiceJsonLd(startingPrice?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Golf Lessons at LENGOLF',
    description: 'One-on-one and group golf coaching with Thailand PGA-certified professionals on indoor golf simulators. Lessons include real-time swing data analysis, video playback, and simulator bay usage.',
    provider: getBusinessRef(),
    serviceType: 'Golf Coaching',
    areaServed: {
      '@type': 'City',
      name: 'Bangkok',
    },
    offers: {
      '@type': 'Offer',
      price: startingPrice ? parseThbToString(startingPrice) : '1800',
      priceCurrency: 'THB',
      description: '1-hour lesson with a PGA-certified coach, simulator usage included',
    },
  }
}

/**
 * One Person node per coach, each `worksFor` the layout's business node.
 * Every string arrives already localized (the page reads it from the
 * catalog), so this builder adds no English to a ja/ko/zh/th page beyond
 * proper names. The '@id' is locale-independent: it names the person, and
 * the same coach is one entity on all five locale pages.
 */
export function getCoachesJsonLd(
  coaches: {
    key: string
    name: string
    alternateName: string
    jobTitle: string
    image: string
    knowsAbout: string[]
    knowsLanguage: string[]
    credentials: string[]
    alumniOf: string[]
  }[],
  pageUrl: string,
) {
  return {
    '@context': 'https://schema.org',
    '@graph': coaches.map((c) => ({
      '@type': 'Person',
      '@id': `${SITE_URL}/lessons/#coach-${c.key}`,
      name: c.name,
      alternateName: c.alternateName,
      jobTitle: c.jobTitle,
      image: c.image,
      url: `${pageUrl}#coach-${c.key}`,
      worksFor: getBusinessRef(),
      knowsAbout: c.knowsAbout,
      knowsLanguage: c.knowsLanguage,
      ...(c.credentials.length > 0 && {
        hasCredential: c.credentials.map((name) => ({
          '@type': 'EducationalOccupationalCredential',
          name,
        })),
      }),
      ...(c.alumniOf.length > 0 && {
        alumniOf: c.alumniOf.map((name) => ({ '@type': 'EducationalOrganization', name })),
      }),
    })),
  }
}

export function getClubRentalServiceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Golf Club Rental at LENGOLF',
    description: 'Golf club rental service in Bangkok — free standard house sets with every bay booking, premium Callaway Warbird and Callaway REVA rentals, gear add-ons, and same-day delivery anywhere in Bangkok.',
    provider: {
      '@type': 'EntertainmentBusiness',
      name: BUSINESS_INFO.name,
      url: SITE_URL,
    },
    serviceType: 'Golf Equipment Rental',
    areaServed: {
      '@type': 'City',
      name: 'Bangkok',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Standard Club Set',
        price: '0',
        priceCurrency: 'THB',
        description: 'Free house set included with every bay booking',
      },
      {
        '@type': 'Offer',
        name: 'Premium Club Rental',
        price: '150',
        priceCurrency: 'THB',
        description: 'Callaway Warbird or Callaway REVA full set, per hour',
      },
    ],
  }
}

export function getActivityPageJsonLd(page: {
  title: string
  slug: string
  meta_description: string | null
  content: { other_activities: { name: string; description: string }[] }
}, locale: string = 'en') {
  // Locale-aware URLs: a translated page must point its structured data at
  // its OWN locale URL. Emitting the bare EN URL from a /th/ or /ja/ page
  // contradicts that page's canonical + hreflang — the same defect PR #88
  // fixed on the FAQ hub's BreadcrumbList. Mirrors getSeoFaqPageJsonLd.
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: page.title,
    description: page.meta_description || undefined,
    url: `${SITE_URL}${localePrefix}/activities/${page.slug}/`,
    numberOfItems: page.content.other_activities.length + 1,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'EntertainmentBusiness',
          name: BUSINESS_INFO.name,
          url: SITE_URL,
          address: getPostalAddressJsonLd(),
        },
      },
      ...page.content.other_activities.map((activity, index) => ({
        '@type': 'ListItem' as const,
        position: index + 2,
        item: {
          '@type': 'Thing' as const,
          name: activity.name,
          description: activity.description,
        },
      })),
    ],
  }
}

export function getSeoFaqPageJsonLd(
  page: {
    title: string
    slug: string
    updated_at: string
    content: {
      answer_intro: string
      answer_body: string
      related_questions: { slug: string; question: string }[]
    }
  },
  locale: string = 'en',
  // Formats the related-question pointer text. Injected by the caller (which
  // has next-intl available) so this module stays free of i18n plumbing; the
  // default keeps EN output byte-identical. Without it the schema declared
  // inLanguage: <locale> while its answer text stayed English.
  formatSeeFullAnswer: (url: string) => string = (url) =>
    `See our full answer at ${url}`
) {
  // url/inLanguage must match the page's canonical, and the related-question
  // pointers must stay inside the reader's locale — a /ja/ FAQ that declares
  // the EN URL (and links EN answers) sends Google contradictory language
  // signals against its own canonical + hreflang. Mirrors the locale handling
  // in getExplainerPageJsonLd below.
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  // Main question + related questions as FAQPage schema
  const mainQuestion = {
    '@type': 'Question' as const,
    name: page.title,
    acceptedAnswer: {
      '@type': 'Answer' as const,
      text: page.content.answer_intro + '\n\n' + page.content.answer_body,
    },
  }

  const relatedQuestions = page.content.related_questions.map((rq) => ({
    '@type': 'Question' as const,
    name: rq.question,
    acceptedAnswer: {
      '@type': 'Answer' as const,
      // related_questions may point at other sections (/guide/...) — resolve
      // via the shared helper so this never drifts from FaqPage's hrefs again.
      text: formatSeeFullAnswer(
        `${SITE_URL}${localePrefix}${relatedQuestionPath(rq.slug)}/`
      ),
    },
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}${localePrefix}/faq/${page.slug}/`,
    url: `${SITE_URL}${localePrefix}/faq/${page.slug}/`,
    inLanguage: locale,
    // Freshness signal for answer engines, which discount undated Q&A when the
    // question is price- or time-sensitive. Valid here: FAQPage ⊂ WebPage ⊂
    // CreativeWork. Do NOT copy this onto getPriceGuidePageJsonLd — its top
    // node is Product, which is not a CreativeWork and has no dateModified;
    // cost pages carry their date in the sitemap <lastmod> instead.
    dateModified: page.updated_at,
    mainEntity: [mainQuestion, ...relatedQuestions],
  }
}

export function getHotelConciergePageJsonLd(page: {
  title: string
  slug: string
  meta_description: string | null
  content: {
    hotel_name: string
    hotel_distance_m: number
    walking_time_mins: number
    nearby_restaurants: { name: string; cuisine: string; distance_m: number }[]
    nearby_activities: { name: string; type: string; distance_m: number }[]
  }
}, locale: string = 'en') {
  // Locale-aware URLs: a translated page must point its structured data at
  // its OWN locale URL. Emitting the bare EN URL from a /th/ or /ja/ page
  // contradicts that page's canonical + hreflang — the same defect PR #88
  // fixed on the FAQ hub's BreadcrumbList. Mirrors getSeoFaqPageJsonLd.
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BUSINESS_INFO.name,
    description: page.meta_description || `Things to do near ${page.content.hotel_name}`,
    url: `${SITE_URL}${localePrefix}/hotels/${page.slug}/`,
    address: getPostalAddressJsonLd(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_INFO.coordinates.lat,
      longitude: BUSINESS_INFO.coordinates.lng,
    },
  }
}

export function getPriceGuidePageJsonLd(page: {
  title: string
  slug: string
  meta_description: string | null
  content: {
    price_breakdown: { item: string; price: string; notes: string }[]
    last_verified: string
  }
}, locale: string = 'en') {
  // Locale-aware URLs: a translated page must point its structured data at
  // its OWN locale URL. Emitting the bare EN URL from a /th/ or /ja/ page
  // contradicts that page's canonical + hreflang — the same defect PR #88
  // fixed on the FAQ hub's BreadcrumbList. Mirrors getSeoFaqPageJsonLd.
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  // Parse price breakdown items and extract actual prices
  const parsedOffers = page.content.price_breakdown.map((item) => {
    // Anchor the figure to its CURRENCY token rather than to the start of the
    // string. The old parser anchored the range at ^ and then fell back to the
    // first digit run anywhere, which is correct only while the number leads.
    // Translated rows put a quantity first — ja "1時間550〜950THB", ko
    // "1라운드 1,000~1,500바트" — so the anchored range missed and the fallback
    // captured the quantity's "1", emitting lowPrice "1" on a LENGOLF-branded
    // Product. That is a "from ฿1" rich result. th and zh only escaped because
    // their unit happens to trail. Every locale places the currency
    // immediately after the figure, so that is the reliable anchor.
    const CURRENCY = String.raw`(?:THB|บาท|바트|泰铢|฿)`
    // U+301C 〜 (ja), U+FF5E ～, ASCII ~ (ko), – — and hyphen. Hyphen last so
    // it is a literal inside the class.
    const DASH = String.raw`[–—〜～~-]`
    const rangeMatch =
      item.price.match(
        new RegExp(String.raw`(\d[\d,]*)\s*${DASH}\s*(\d[\d,]*)\s*${CURRENCY}`)
      ) ??
      // No currency token in the row (bare "550-950"): fall back to the old
      // ^-anchored form so EN rows that never carried a unit still parse.
      item.price.match(/^(\d[\d,]*)\s*[–-]\s*(\d[\d,]*)/)
    if (rangeMatch) {
      return {
        '@type': 'Offer' as const,
        name: item.item,
        price: rangeMatch[1].replace(/,/g, ''), // "starting at" lowPrice
        priceCurrency: 'THB',
        description: item.notes,
        priceValidUntil: `${new Date().getFullYear()}-12-31`,
        availability: 'https://schema.org/InStock',
      }
    }

    // Check for single price (e.g., "1,800 THB/hr" or "150"). Currency-anchored
    // first, for the same reason as the range above — ja "1時間150THB" would
    // otherwise parse as 1.
    const singlePriceMatch =
      item.price.match(new RegExp(String.raw`(\d[\d,]*)\s*${CURRENCY}`)) ??
      item.price.match(/(\d[\d,]*)/)
    if (singlePriceMatch) {
      return {
        '@type': 'Offer' as const,
        name: item.item,
        price: singlePriceMatch[1].replace(/,/g, ''),
        priceCurrency: 'THB',
        description: item.notes,
        priceValidUntil: `${new Date().getFullYear()}-12-31`,
        availability: 'https://schema.org/InStock',
      }
    }

    // Fallback if no match
    return {
      '@type': 'Offer' as const,
      name: item.item,
      price: item.price,
      priceCurrency: 'THB',
      description: item.notes,
      priceValidUntil: `${new Date().getFullYear()}-12-31`,
      availability: 'https://schema.org/InStock',
    }
  })

  // The Product below is branded LENGOLF, so competitor rows from comparison
  // tables (Topgolf, Golfzon, ...) must not become LENGOLF offers — otherwise
  // Google can render a competitor's cheapest rate as "from ฿X" under our
  // brand. On comparison pages, LENGOLF's own rows carry the brand name; on
  // LENGOLF-only pages (e.g. the pricing guide) no row does, so keep them all.
  const lengolfOffers = parsedOffers.filter((offer) => /lengolf/i.test(offer.name))
  const brandOffers = lengolfOffers.length > 0 ? lengolfOffers : parsedOffers

  // Calculate aggregate lowPrice and highPrice from actual parsed offers.
  // Non-numeric prices (e.g. "Free") must not poison the aggregate with NaN.
  const allPrices: number[] = []
  const pushPrice = (value: unknown) => {
    const parsed = parseFloat(value as string)
    if (Number.isFinite(parsed)) allPrices.push(parsed)
  }
  brandOffers.forEach((offer) => {
    if ('price' in offer && offer.price) {
      pushPrice(offer.price)
    }
    if ('lowPrice' in offer && offer.lowPrice) {
      pushPrice(offer.lowPrice)
    }
    if ('highPrice' in offer && offer.highPrice) {
      pushPrice(offer.highPrice)
    }
  })

  const lowPrice = allPrices.length > 0 ? Math.min(...allPrices).toString() : '0'
  const highPrice = allPrices.length > 0 ? Math.max(...allPrices).toString() : '0'

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: BUSINESS_INFO.name,
    description: page.meta_description || page.title,
    url: `${SITE_URL}${localePrefix}/cost/${page.slug}/`,
    brand: {
      '@type': 'Brand',
      name: BUSINESS_INFO.name,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'THB',
      lowPrice,
      highPrice,
      offerCount: brandOffers.length,
      offers: brandOffers,
    },
  }
}

export function getExplainerPageJsonLd(page: {
  title: string
  slug: string
  meta_description: string | null
  created_at: string
  updated_at: string
  content: {
    intro: string
    sections: { heading: string; body: string }[]
    key_takeaways: string[]
  }
}, locale: string = 'en') {
  // url/inLanguage must match the page's canonical — a /ja/ guide declaring
  // the EN URL sends Google contradictory language/URL signals.
  const pageUrl = locale === 'en'
    ? `${SITE_URL}/guide/${page.slug}/`
    : `${SITE_URL}/${locale}/guide/${page.slug}/`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.title,
    description: page.meta_description || page.content.intro,
    url: pageUrl,
    datePublished: page.created_at,
    dateModified: page.updated_at,
    author: {
      '@type': 'Organization',
      name: BUSINESS_INFO.name,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: BUSINESS_INFO.name,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: storageUrl('branding/logo.png'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    articleSection: 'Golf Simulator Guide',
    inLanguage: locale,
  }
}

export function getCourseClubRentalServiceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Golf Course Club Rental Bangkok — LENGOLF',
    description: 'Rent premium golf clubs for any Bangkok golf course. Callaway Paradym Forged Carbon (tour-grade), Callaway Warbird, or Callaway REVA full sets. Full-day and multi-day packages. Delivery anywhere in Bangkok for 500 THB. Book and pay online with instant confirmation.',
    provider: {
      '@type': 'EntertainmentBusiness',
      name: BUSINESS_INFO.name,
      url: SITE_URL,
    },
    serviceType: 'Golf Equipment Rental',
    areaServed: {
      '@type': 'City',
      name: 'Bangkok',
    },
    offers: [
      {
        '@type': 'Offer',
        name: '1-Day Premium Course Club Rental',
        price: '1200',
        priceCurrency: 'THB',
        description: 'Full-day rental of Callaway Warbird or Callaway REVA set for any Bangkok golf course',
      },
      {
        '@type': 'Offer',
        name: '3-Day Premium Course Club Rental',
        price: '2400',
        priceCurrency: 'THB',
        description: '3-day Premium rental package — pay for 2 days, get 1 free',
      },
      {
        '@type': 'Offer',
        name: '7-Day Premium Course Club Rental',
        price: '4800',
        priceCurrency: 'THB',
        description: '7-day Premium rental package — pay for 4 days, get 3 free',
      },
      {
        '@type': 'Offer',
        name: '14-Day Premium Course Club Rental',
        price: '8400',
        priceCurrency: 'THB',
        description: '14-day Premium rental package — pay for 7 days, get 7 free',
      },
      {
        '@type': 'Offer',
        name: '1-Day Premium+ Course Club Rental',
        price: '1800',
        priceCurrency: 'THB',
        description: 'Full-day rental of Callaway Paradym Forged Carbon tour-grade set for any Bangkok golf course',
      },
      {
        '@type': 'Offer',
        name: '3-Day Premium+ Course Club Rental',
        price: '3600',
        priceCurrency: 'THB',
        description: '3-day Premium+ rental package — pay for 2 days, get 1 free',
      },
      {
        '@type': 'Offer',
        name: '7-Day Premium+ Course Club Rental',
        price: '7200',
        priceCurrency: 'THB',
        description: '7-day Premium+ rental package — pay for 4 days, get 3 free',
      },
      {
        '@type': 'Offer',
        name: '14-Day Premium+ Course Club Rental',
        price: '12600',
        priceCurrency: 'THB',
        description: '14-day Premium+ rental package — pay for 7 days, get 7 free',
      },
    ],
  }
}

export function getCourseClubRentalPricingJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'LENGOLF Golf Course Club Rental Pricing',
    description: 'Premium and Premium+ golf club rental packages for Bangkok golf courses with delivery and add-ons',
    provider: {
      '@type': 'EntertainmentBusiness',
      name: BUSINESS_INFO.name,
      url: SITE_URL,
    },
    itemListElement: [
      { '@type': 'Offer', name: '1-Day Premium Course Rental (Warbird / REVA)', price: '1200', priceCurrency: 'THB' },
      { '@type': 'Offer', name: '3-Day Premium Course Rental', price: '2400', priceCurrency: 'THB' },
      { '@type': 'Offer', name: '7-Day Premium Course Rental', price: '4800', priceCurrency: 'THB' },
      { '@type': 'Offer', name: '14-Day Premium Course Rental', price: '8400', priceCurrency: 'THB' },
      { '@type': 'Offer', name: '1-Day Premium+ Course Rental (Paradym Forged Carbon)', price: '1800', priceCurrency: 'THB' },
      { '@type': 'Offer', name: '3-Day Premium+ Course Rental', price: '3600', priceCurrency: 'THB' },
      { '@type': 'Offer', name: '7-Day Premium+ Course Rental', price: '7200', priceCurrency: 'THB' },
      { '@type': 'Offer', name: '14-Day Premium+ Course Rental', price: '12600', priceCurrency: 'THB' },
      { '@type': 'Offer', name: 'Club Delivery (anywhere in Bangkok)', price: '500', priceCurrency: 'THB' },
      { '@type': 'Offer', name: 'Golf Gloves Add-On', price: '600', priceCurrency: 'THB' },
      { '@type': 'Offer', name: 'Golf Balls Add-On (1 dozen)', price: '400', priceCurrency: 'THB' },
    ],
  }
}

export function getUsedClubsListJsonLd(clubs: UsedClub[]) {
  if (clubs.length === 0) {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Second-Hand Golf Clubs Bangkok — LENGOLF',
      description: 'Buy second-hand golf clubs in Bangkok at LENGOLF. Well-maintained Callaway and TaylorMade sets. Test any club in our simulators before you buy.',
      url: `${SITE_URL}/second-hand-golf-clubs-bangkok/`,
      numberOfItems: 0,
    }
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Second-Hand Golf Clubs Bangkok — LENGOLF',
    description: 'Buy second-hand golf clubs in Bangkok at LENGOLF. Well-maintained Callaway and TaylorMade sets. Test any club in our simulators before you buy.',
    url: `${SITE_URL}/second-hand-golf-clubs-bangkok/`,
    numberOfItems: clubs.length,
    itemListElement: clubs.map((club, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: `${club.brand}${club.model ? ` ${club.model}` : ''} — ${club.club_type} (${club.gender})`,
        description: club.description || `${club.condition} condition ${club.club_type.toLowerCase()} set`,
        ...(club.image_url ? { image: club.image_url } : {}),
        offers: {
          '@type': 'Offer',
          price: club.price,
          priceCurrency: 'THB',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'EntertainmentBusiness',
            name: BUSINESS_INFO.name,
            url: SITE_URL,
          },
        },
      },
    })),
  }
}

export function getUsedClubProductJsonLd(club: UsedClub) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${club.brand}${club.model ? ` ${club.model}` : ''} — ${club.club_type} (${club.gender})`,
    description: club.description || `${club.condition} condition ${club.club_type.toLowerCase()} set`,
    ...(club.image_url ? { image: club.image_url } : {}),
    url: `${SITE_URL}/second-hand-golf-clubs-bangkok/${club.id}/`,
    brand: { '@type': 'Brand', name: club.brand },
    offers: {
      '@type': 'Offer',
      price: club.price,
      priceCurrency: 'THB',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'EntertainmentBusiness',
        name: BUSINESS_INFO.name,
        url: SITE_URL,
      },
    },
  }
}

export function getBestOfListiclePageJsonLd(page: {
  title: string
  slug: string
  meta_description: string | null
  content: {
    list_items: {
      rank: number
      name: string
      description: string
      is_lengolf: boolean
      address?: string
      website?: string
    }[]
  }
}, locale: string = 'en') {
  // Locale-aware URLs: a translated page must point its structured data at
  // its OWN locale URL. Emitting the bare EN URL from a /th/ or /ja/ page
  // contradicts that page's canonical + hreflang — the same defect PR #88
  // fixed on the FAQ hub's BreadcrumbList. Mirrors getSeoFaqPageJsonLd.
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: page.title,
    description: page.meta_description || undefined,
    url: `${SITE_URL}${localePrefix}/best/${page.slug}/`,
    numberOfItems: page.content.list_items.length,
    itemListElement: page.content.list_items.map((item) => ({
      '@type': 'ListItem',
      position: item.rank,
      item: item.is_lengolf
        ? {
            '@type': 'EntertainmentBusiness',
            name: BUSINESS_INFO.name,
            url: SITE_URL,
            address: getPostalAddressJsonLd(),
          }
        : {
            '@type': 'LocalBusiness',
            name: item.name,
            description: item.description,
            ...(item.address ? { address: { '@type': 'PostalAddress', streetAddress: item.address, addressRegion: 'Bangkok', addressCountry: 'TH' } } : {}),
            ...(item.website ? { url: item.website } : {}),
          },
    })),
  }
}

export function getFoodMenuJsonLd(groups: MenuGroup[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: 'LENGOLF Food & Drinks Menu',
    description:
      'Food and drinks menu at LENGOLF Bangkok: burgers and sharing plates by Smith & Co, wood-fired pizzas by Sexy Pizza, cocktails, highballs, beer, wine, and soft drinks, all served to your simulator bay.',
    url: `${SITE_URL}/menu/`,
    inLanguage: 'en',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/menu/` },
    provider: {
      '@type': ['EntertainmentBusiness', 'BarOrPub'],
      name: BUSINESS_INFO.name,
      url: SITE_URL,
      address: getPostalAddressJsonLd(),
      servesCuisine: ['Burgers', 'Pizza', 'Bar Food'],
    },
    hasMenuSection: groups.map((group) => ({
      '@type': 'MenuSection' as const,
      name: group.title,
      description: group.subtitle,
      hasMenuSection: group.sections.map((section) => ({
        '@type': 'MenuSection' as const,
        name: section.title,
        ...(section.note ? { description: section.note } : {}),
        hasMenuItem: section.items.map((menuItem) => ({
          '@type': 'MenuItem' as const,
          name: menuItem.name,
          ...(menuItem.description ? { description: menuItem.description } : {}),
          offers: {
            '@type': 'Offer' as const,
            price: String(menuItem.price),
            priceCurrency: 'THB',
          },
        })),
      })),
    })),
  }
}

export function getBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
