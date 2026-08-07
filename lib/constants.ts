export const SITE_NAME = 'LENGOLF'
export const SITE_URL = 'https://www.len.golf'
export const SUPABASE_STORAGE_URL = 'https://bisimqmtxjsptehhqpeg.supabase.co/storage/v1/object/public/website-assets'

export function storageUrl(path: string): string {
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${SUPABASE_STORAGE_URL}/${clean}`
}

const SUPABASE_RENDER_URL = 'https://bisimqmtxjsptehhqpeg.supabase.co/storage/v1/render/image/public/website-assets'

export function storageImageUrl(path: string, options: { width?: number; height?: number; quality?: number } = {}): string {
  const clean = path.startsWith('/') ? path.slice(1) : path
  const params = new URLSearchParams()
  if (options.width) params.set('width', String(options.width))
  if (options.height) params.set('height', String(options.height))
  params.set('quality', String(options.quality || 75))
  return `${SUPABASE_RENDER_URL}/${clean}?${params.toString()}`
}
export const SITE_DESCRIPTION = 'Premier indoor golf simulator and bar in the heart of Bangkok. Located at The Mercury Ville @ BTS Chidlom.'

export const BUSINESS_INFO = {
  name: 'LENGOLF',
  legalName: 'LENGOLF CO., LTD.',
  // Thai company registration / VAT number.
  taxId: '0105566207013',
  // REGISTERED address as recorded at the DBD and printed on our tax invoices.
  // Same physical building as `address` below, under its registered name rather
  // than the mall's trading name. Payment gateways and other KYC reviewers match
  // this string against the company affidavit, so it must stay verbatim — it is
  // mirrored from COMPANY_INFO.addressEn in the lengolf-accounting app, which is
  // eval-guarded as the single source of truth. Change both together or neither.
  registeredAddress: '540 Mercury Tower, 4 Floor, Unit 407 Ploenchit Road, Lumpini, Pathumwan, Bangkok 10330',
  // VENUE address — how a customer finds us. Marketing/SEO/JSON-LD use this.
  address: 'The Mercury Ville @ BTS Chidlom, Floor 4, 540 Ploenchit Road, Lumpini, Pathumwan, Bangkok 10330',
  addressShort: 'The Mercury Ville @ BTS Chidlom, Floor 4, Bangkok',
  phone: '096-668-2335',
  phoneRaw: '0966682335',
  email: 'info@len.golf',
  hours: '9am – 11pm, Monday – Sunday',
  googleRating: 5.0,
  googleReviewCount: 579,
  googleMapsUrl: 'https://www.google.com/maps?ll=13.743447,100.544115&z=16&t=m&hl=en-US&gl=US&mapclient=embed&q=540+Phloen+Chit+Rd+Khwaeng+Lumphini,+Pathum+Wan+Krung+Thep+Maha+Nakhon+10330',
  googleMapsEmbed: 'https://maps.google.com/maps?q=LENGOLF&t=m&z=16&output=embed&iwloc=near',
  coordinates: { lat: 13.743447, lng: 100.544115 },
  // Structured address — single source of truth for every schema.org PostalAddress
  // block (see getPostalAddressJsonLd in lib/jsonld.ts). Keep in sync with `address`.
  addressParts: {
    streetAddress: '540 Ploenchit Road, The Mercury Ville, Floor 4',
    addressLocality: 'Pathum Wan',
    addressRegion: 'Bangkok',
    postalCode: '10330',
    addressCountry: 'TH',
  },
} as const

/**
 * Manual "last reviewed" date (YYYY-MM-DD) for static / non-database pages in the
 * sitemap. Bump it when you make meaningful edits to the static marketing pages so
 * the sitemap reports a stable, honest lastModified instead of a churning build
 * timestamp. Data-backed pages (blog, SEO pages) use their own updated_at instead.
 */
export const CONTENT_LAST_UPDATED = '2026-07-11'

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/lengolf.bkk',
  instagram: 'https://www.instagram.com/lengolf.bkk/',
  line: 'https://lin.ee/uxQpIXn',
} as const

export const BOOKING_URL = 'https://booking.len.golf/'

export const NAV_ITEMS = [
  { label: 'HOME', href: '/' },
  { label: 'BAY RATES', href: '/golf' },
  { label: 'EVENTS', href: '/events' },
  { label: 'LESSONS', href: '/lessons' },
  { label: 'CLUBS', href: '/golf-club-rental' },
  { label: 'ABOUT US', href: '/about-us' },
] as const

export const FOOTER_MENU = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT US', href: '/about-us' },
  { label: 'BAY RATES', href: '/golf' },
  { label: 'EVENTS', href: '/events' },
  { label: 'LESSONS', href: '/lessons' },
  { label: 'CLUBS AT LENGOLF', href: '/golf-club-rental' },
  { label: 'RENT FOR A COURSE', href: '/golf-course-club-rental' },
  { label: 'SECOND-HAND CLUBS', href: '/second-hand-golf-clubs-bangkok' },
  { label: 'BLOG', href: '/blog' },
] as const
