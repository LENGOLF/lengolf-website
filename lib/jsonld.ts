import { SITE_URL, SITE_NAME, BUSINESS_INFO, SOCIAL_LINKS, storageUrl } from '@/lib/constants'
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

export function getLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EntertainmentBusiness',
    name: BUSINESS_INFO.name,
    legalName: BUSINESS_INFO.legalName,
    url: SITE_URL,
    telephone: BUSINESS_INFO.phone,
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
    sameAs: [SOCIAL_LINKS.facebook, SOCIAL_LINKS.instagram],
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
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: storageUrl('branding/logo.png'),
      },
      sameAs: [SOCIAL_LINKS.facebook, SOCIAL_LINKS.instagram],
    },
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
    provider: {
      '@type': 'EntertainmentBusiness',
      name: BUSINESS_INFO.name,
      url: SITE_URL,
    },
    itemListElement: offers,
  }
}

export function getClubRentalPricingJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'LENGOLF Golf Club Rental',
    description: 'Golf club rental service at LENGOLF Bangkok — free standard sets, premium Callaway & Majesty rentals, Premium+ Callaway Paradym, gear add-ons, and delivery in Bangkok',
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
        description: 'Callaway Warbird (men\'s) or Majesty Shuttle (women\'s) full set for 1 hour',
        price: '150',
        priceCurrency: 'THB',
        unitCode: 'HUR',
        eligibleDuration: { '@type': 'QuantitativeValue', value: 1, unitCode: 'HUR' },
      },
      {
        '@type': 'Offer',
        name: 'Premium Club Rental – 2 Hours',
        description: 'Callaway Warbird or Majesty Shuttle full set for 2 hours',
        price: '250',
        priceCurrency: 'THB',
      },
      {
        '@type': 'Offer',
        name: 'Premium Club Rental – 3 Hours',
        description: 'Callaway Warbird or Majesty Shuttle full set for 3 hours',
        price: '350',
        priceCurrency: 'THB',
      },
      {
        '@type': 'Offer',
        name: 'Premium Club Rental – 4 Hours',
        description: 'Callaway Warbird or Majesty Shuttle full set for 4 hours',
        price: '400',
        priceCurrency: 'THB',
      },
      {
        '@type': 'Offer',
        name: 'Premium Club Rental – 5 Hours',
        description: 'Callaway Warbird or Majesty Shuttle full set for 5 hours',
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
    provider: {
      '@type': 'EntertainmentBusiness',
      name: BUSINESS_INFO.name,
      url: SITE_URL,
    },
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

export function getClubRentalServiceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Golf Club Rental at LENGOLF',
    description: 'Golf club rental service in Bangkok — free standard house sets with every bay booking, premium Callaway Warbird and Majesty Shuttle rentals, gear add-ons, and same-day delivery anywhere in Bangkok.',
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
        description: 'Callaway Warbird or Majesty Shuttle full set, per hour',
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
    description: 'Rent premium golf clubs for any Bangkok golf course. Callaway Paradym Forged Carbon (tour-grade), Callaway Warbird, or Majesty Shuttle full sets. Full-day and multi-day packages. Delivery anywhere in Bangkok for 500 THB. Book and pay online with instant confirmation.',
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
        description: 'Full-day rental of Callaway Warbird or Majesty Shuttle set for any Bangkok golf course',
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
      { '@type': 'Offer', name: '1-Day Premium Course Rental (Warbird / Majesty)', price: '1200', priceCurrency: 'THB' },
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
