import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Link } from '@/i18n/navigation'
import SectionWrapper from '@/components/shared/SectionWrapper'
import { storageUrl, SITE_URL, BUSINESS_INFO, SOCIAL_LINKS, BOOKING_URL } from '@/lib/constants'
import { getAlternates, getCanonical } from '@/lib/translated-routes'
import { getCourseClubRentalServiceJsonLd, getCourseClubRentalPricingJsonLd, getFaqPageJsonLd, getBreadcrumbJsonLd } from '@/lib/jsonld'
import { getRentalClubPricing } from '@/lib/clubs'
import { getApproxCurrency } from '@/lib/currency-rates'
import StickyBookCTA from '@/components/clubs/StickyBookCTA'
import BookRentalLink from '@/components/clubs/BookRentalLink'
import TrustBar from '@/components/course-rental/TrustBar'
import {
  Truck,
  Phone,
  MapPin,
  CreditCard,
  ShoppingBag,
  Target,
  GraduationCap,
} from 'lucide-react'

// Below-fold client components: defer to their own chunks so they don't
// land in the initial JS bundle. `ssr: true` keeps the rendered markup
// in the SSR HTML (important for FAQ — it lives in the JSON-LD too, so
// crawlers see it either way, but the visible accordion HTML still
// helps with content paint and a11y).
const ImageLightbox = dynamic(() => import('@/components/shared/ImageLightbox'), { ssr: true })
const MultiChannelContact = dynamic(() => import('@/components/course-rental/MultiChannelContact'), { ssr: true })
const FaqSection = dynamic(() => import('@/components/shared/FaqSection'), { ssr: true })

const faqLinks: Record<string, { href: string; external?: boolean }> = {
  '@lengolf': { href: SOCIAL_LINKS.line, external: true },
  'LINE @lengolf': { href: SOCIAL_LINKS.line, external: true },
  'Google Maps': { href: BUSINESS_INFO.googleMapsUrl, external: true },
  'bay rates': { href: '/golf' },
  'golf lessons': { href: '/lessons' },
}

export const revalidate = 3600

const FAQ_COUNT = 16

// "Why rent with LENGOLF vs. at the course" comparison rows. Order matches
// the i18n keys under CourseClubRental.whyRent.rows in messages/*.json and
// mirrors the booking app's WhyRentSection for cross-surface parity.
//
// NOTE: the baht figures in those strings (฿2,900 / ~฿4,500 / ~36% / ฿500)
// are STATIC marketing copy, not DB-driven like the live pricing table above
// (getRentalClubPricing). They reflect: Premium 1-day ฿1,200, "3 days = pay 2"
// → ฿2,400 + ฿500 delivery = ฿2,900 vs ~฿4,500 at the course (~36% saved).
// Re-check all 5 locales if course_price_3d or the delivery fee changes.
const WHY_RENT_ROWS = ['trip', 'discount', 'set', 'quality', 'pick', 'delivery'] as const

// Standard rental sets. `key` selects the club{n}* i18n strings in
// messages/*.json; flags attach card extras by club identity instead of loop
// position. If the sets are reordered or replaced, update this descriptor —
// club1* = Callaway Warbird (has gallery images), club2* = Majesty Shuttle
// (gets the Japanese-brand callout).
const STANDARD_SETS = [
  {
    key: 1,
    isMajesty: false,
    gallery: [
      { src: 'clubs/premium/2.png', alt: 'Callaway Warbird full set in golf bag' },
      { src: 'clubs/premium/4.png', alt: 'Callaway Warbird driver 10.5°' },
      { src: 'clubs/premium/11.png', alt: 'Callaway Warbird irons set' },
      { src: 'clubs/premium/9.png', alt: 'Callaway Warbird 5W fairway wood' },
      { src: 'clubs/premium/13.png', alt: 'Odyssey putter' },
      { src: 'clubs/premium/7.png', alt: 'Callaway Warbird S-flex shaft' },
      { src: 'clubs/premium/1.png', alt: 'Callaway Warbird golf bag' },
    ],
  },
  {
    key: 2,
    isMajesty: true,
    // Same shot sequence as the men's sets, from the numbered premium-womens shoot.
    gallery: [
      { src: 'clubs/premium-womens/2.png', alt: 'Majesty Shuttle full set in bag' },
      { src: 'clubs/premium-womens/4.png', alt: 'Majesty Shuttle ladies driver' },
      { src: 'clubs/premium-womens/11.png', alt: 'Majesty Shuttle irons set' },
      { src: 'clubs/premium-womens/9.png', alt: 'Majesty Shuttle fairway wood' },
      { src: 'clubs/premium-womens/13.png', alt: 'Majesty Shuttle wedge' },
      { src: 'clubs/premium-womens/15.png', alt: 'Majesty Shuttle putter' },
      { src: 'clubs/premium-womens/1.png', alt: 'Majesty Shuttle ladies golf bag' },
    ],
  },
] as const

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'CourseClubRental' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: getCanonical(locale, '/golf-course-club-rental/'),
      languages: getAlternates('/golf-course-club-rental/'),
    },
    openGraph: { images: [{ url: storageUrl('golf/hero-course-rental.webp'), alt: 'Rent premium golf clubs for any Bangkok golf course — Callaway Paradym, Warbird, Majesty from 1,200 THB/day' }] },
  }
}

export default async function GolfCourseClubRentalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('CourseClubRental')
  const tFaq = await getTranslations('CourseClubRentalFaq')

  const faqItems = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    question: tFaq(`q${i + 1}`),
    answer: tFaq(`a${i + 1}`),
  }))

  const courseRentalUrl = `${BOOKING_URL}course-rental`
  const approxCurrency = getApproxCurrency(1200, locale)
  const contactLanguageNote = locale === 'en' || locale === 'th' ? null : t('contactLanguageNote')
  const serviceJsonLd = getCourseClubRentalServiceJsonLd()
  const pricingJsonLd = getCourseClubRentalPricingJsonLd()
  const faqJsonLd = getFaqPageJsonLd(faqItems)
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Club Rental', url: `${SITE_URL}/golf-club-rental/` },
    { name: t('metaTitle'), url: `${SITE_URL}/golf-course-club-rental/` },
  ])

  const { course: pricingRows } = await getRentalClubPricing()

  return (
    <>
      {/* Pre-warm booking.len.golf so the cross-domain hop on Book CTA
          click overlaps with landing-page reading time. Next.js 15 hoists
          <link> tags from page JSX into <head> (independent of React 19's
          resource-hint API, which isn't available in React 18.3.1).
          Verified by inspecting rendered HTML: both hints land before
          </head>. */}
      <link rel="dns-prefetch" href="https://booking.len.golf" />
      <link rel="preconnect" href="https://booking.len.golf" crossOrigin="anonymous" />

      {/* ── Sticky mobile CTA ── */}
      <StickyBookCTA label={t('stickyBookCta')} href={courseRentalUrl} />

      {/* ── Hero ── */}
      {/* Mobile: padding-based natural height so 3-chip wrap doesn't get clipped by max-h.
          Desktop (md+): keep the original fixed-height (50vh, 400-550px) framed look. */}
      <section className="relative flex items-start pt-10 pb-10 text-white overflow-hidden md:items-center md:py-0 md:h-[50vh] md:min-h-[400px] md:max-h-[550px]">
        <Image
          src={storageUrl('golf/hero-course-rental.webp')}
          alt="Rent Callaway Paradym, Warbird or Majesty golf clubs for Bangkok golf courses — from 1,200 THB/day with delivery"
          fill
          className="object-cover object-[center_35%]"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(0,90,50,0.60) 0%, rgba(0,122,69,0.45) 40%, rgba(0,90,50,0.30) 100%)',
          }}
        />
        <div className="relative z-10 w-full text-left" style={{ paddingLeft: '4%', paddingRight: '4%' }}>
          <div className="flex flex-wrap gap-2 mb-5">
            {/* heroBadge ("OFF-SITE CLUB RENTAL") is the longest chip and redundant
                with the H1 — hide on mobile to keep the chip stack to 2 rows. */}
            <span
              className="hidden md:inline-block rounded px-5 py-2 text-base font-bold uppercase tracking-widest text-white md:text-lg"
              style={{ backgroundColor: '#7CB342' }}
            >
              {t('heroBadge')}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded bg-white/95 px-3 py-1.5 text-sm font-bold text-gray-800 shadow-sm">
              <span className="text-yellow-400 tracking-tight">★★★★★</span>
              <span>{BUSINESS_INFO.googleRating}</span>
              <span className="font-normal text-gray-500">· {BUSINESS_INFO.googleReviewCount} Google reviews</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              {t('heroResponseBadge')}
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-black uppercase leading-none md:text-5xl lg:text-6xl max-w-3xl">
            {t('heroTitle')}
          </h1>
          <p className="text-base font-semibold italic tracking-wide text-white/90 md:text-lg mb-6">
            {t('heroSubtitle')}
          </p>
          <BookRentalLink
            href={courseRentalUrl}
            source="hero"
            label={t('stickyBookCta')}
            className="inline-flex h-16 items-center gap-2.5 rounded-lg bg-white px-12 text-lg font-extrabold uppercase tracking-wide text-[#005a32] shadow-lg transition-all hover:scale-105 hover:shadow-xl md:text-xl"
          />
          {/* Risk-reversal at the point of action — key trust signal for
              travelers booking before their trip. NOTE: the same policy is
              also worded as Home{Ja,Ko,Zh}.heroCancellation on the bespoke
              landing pages — update both key families if the cancellation
              window ever changes. */}
          <p className="mt-4 text-sm font-medium text-white/85">{t('heroCancellationNote')}</p>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <TrustBar
        deliveryLabel={t('trustBarDeliveryLabel')}
        stat1Value={t('stat1Value')}
        stat1Label={t('stat1Label')}
        stat2Value={t('stat2Value')}
        stat2Label={t('stat2Label')}
        stat3Value={t('stat3Value')}
        stat3Label={t('stat3Label')}
        stat4Value={t('stat4Value')}
        stat4Label={t('stat4Label')}
        approxCurrency={approxCurrency}
      />

      {/* ── Intro ── */}
      <SectionWrapper>
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            {t('introText')}
          </p>
        </div>
      </SectionWrapper>

      {/* ── Clubs Available ── */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('clubsTitle')}</span>{' '}
            <span className="text-foreground">{t('clubsTitleSuffix')}</span>
          </h2>

          {/* ── Premium+ Paradym Set ── */}
          <div className="mx-auto max-w-4xl mb-10">
            <div className="rounded-2xl border-2 border-primary/30 bg-white overflow-hidden">
              <div className="bg-primary/5 px-6 py-4 flex items-center gap-3 border-b border-primary/10">
                <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  {t('premiumBadge')}
                </span>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: '#007429' }}>{t('premiumName')}</h3>
                  <p className="text-sm font-semibold text-muted-foreground">{t('premiumGender')}</p>
                </div>
              </div>

              <div className="p-6">
                <ImageLightbox
                  className="mb-6"
                  images={[
                    { src: storageUrl('clubs/premium-plus/2.png'), alt: 'Callaway Paradym full set in bag' },
                    { src: storageUrl('clubs/premium-plus/4.png'), alt: 'Callaway Paradym Forged Carbon driver' },
                    { src: storageUrl('clubs/premium-plus/11.png'), alt: 'Callaway Paradym irons set' },
                    { src: storageUrl('clubs/premium-plus/9.png'), alt: 'Callaway Paradym fairway wood' },
                    { src: storageUrl('clubs/premium-plus/13.png'), alt: 'Callaway Jaws Raw wedges' },
                    { src: storageUrl('clubs/premium-plus/15.png'), alt: 'Odyssey White Hot Black Series putter' },
                    { src: storageUrl('clubs/premium-plus/12.png'), alt: 'Ventus TR shaft by Fujikura' },
                    { src: storageUrl('clubs/premium-plus/1.png'), alt: 'Callaway camo golf bag' },
                  ]}
                />

                <ul className="space-y-2">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007429" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
                      {t(`premiumSpec${j}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Standard Sets ── */}
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 mb-8">
            {STANDARD_SETS.map(({ key: i, gallery, isMajesty }) => (
              <div key={i} className="rounded-xl border border-primary/20 bg-white p-6">
                <h3 className="mb-1 text-xl font-bold" style={{ color: '#007429' }}>{t(`club${i}Name`)}</h3>
                <p className="mb-3 text-sm font-semibold text-muted-foreground">{t(`club${i}Gender`)}</p>
                {gallery && (
                  <div className="mb-4 -mx-1">
                    <ImageLightbox
                      images={gallery.map((img) => ({ src: storageUrl(img.src), alt: img.alt }))}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12vw"
                    />
                  </div>
                )}
                <ul className="space-y-2">
                  {[1, 2, 3].map((j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007429" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
                      {t(`club${i}Spec${j}`)}
                    </li>
                  ))}
                </ul>
                {/* Majesty brand callout — differentiator for Japanese/Korean/
                    Chinese golf travelers who know the brand. */}
                {isMajesty && (
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                    <p className="mb-1 text-xs font-bold uppercase tracking-wider text-amber-800">{t('majestyCalloutTitle')}</p>
                    <p className="text-xs leading-relaxed text-amber-700">{t('majestyCalloutText')}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Handedness note */}
          <div className="mx-auto mt-2 max-w-4xl rounded-lg border border-primary/20 bg-white px-5 py-4 text-sm text-foreground">
            <p className="font-semibold" style={{ color: '#007429' }}>{t('handednessNoteTitle')}</p>
            <p className="mt-1 text-muted-foreground">{t('handednessNote')}</p>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-16 lg:py-24">
        <div className="section-max-width section-padding">
          <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('pricingTitle')}</span>{' '}
            <span className="text-foreground">{t('pricingTitleSuffix')}</span>
          </h2>
          <div className="mx-auto max-w-2xl space-y-6">
            {/* Pricing table */}
            <div className="overflow-hidden rounded-xl border border-border/60">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="px-5 py-3 text-sm font-semibold">{t('duration')}</th>
                    <th className="px-5 py-3 text-sm font-semibold text-center">{t('pricingColPremium')}</th>
                    <th className="px-5 py-3 text-sm font-semibold text-center">{t('pricingColPremiumPlus')}</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingRows.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-muted/30'}>
                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-foreground">{row.duration}</span>
                        {row.note && (
                          <span className="ml-2 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                            {row.note}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-center" style={{ color: '#007429' }}>{row.premium}</td>
                      <td className="px-5 py-4 text-sm font-bold text-center" style={{ color: '#007429' }}>{row.premiumPlus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* sr-only table for crawlers */}
            <div className="sr-only">
              <table>
                <caption>LENGOLF Golf Course Club Rental Pricing</caption>
                <thead><tr><th>Duration</th><th>Premium</th><th>Premium+</th><th>Note</th></tr></thead>
                <tbody>
                  {pricingRows.map((row, i) => (
                    <tr key={i}><td>{row.duration}</td><td>{row.premium}</td><td>{row.premiumPlus}</td><td>{row.note || ''}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>

            {approxCurrency && (
              <p className="text-xs text-muted-foreground text-center bg-muted/40 rounded-lg px-4 py-2">
                {t('pricingCurrencyNote', { price: '1,200', approx: approxCurrency })}
              </p>
            )}

            <p className="text-sm text-muted-foreground">{t('pricingNote')}</p>

            {/* Delivery + Payment info cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <div className="flex items-start gap-3">
                  <Truck className="mt-0.5 shrink-0 text-primary" size={20} />
                  <div>
                    <p className="font-semibold text-foreground">{t('deliveryTitle')} — <span style={{ color: '#007429' }}>{t('deliveryPrice')}</span></p>
                    <p className="mt-1 text-sm text-muted-foreground">{t('deliveryDesc')}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <div className="flex items-start gap-3">
                  <CreditCard className="mt-0.5 shrink-0 text-primary" size={20} />
                  <div>
                    <p className="font-semibold text-foreground">{t('paymentTitle')}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t('paymentDesc')}</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground italic">{t('prepaymentNote')}</p>
          </div>
        </div>
      </section>

      {/* ── Why rent with LENGOLF (vs. at the course) ──
          Value-proposition comparison. Placed right after pricing so the
          "save ~36%" claim ties to the ฿2,900 vs ฿4,500 the reader just saw.
          Mirrors booking.len.golf/course-rental's WhyRentSection. */}
      <section className="py-16 lg:py-24">
        <div className="section-max-width section-padding">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold italic lg:text-4xl text-foreground">
              {t('whyRent.heading')}
            </h2>
            <p className="mt-3 text-center text-base font-semibold lg:text-lg" style={{ color: '#007429' }}>
              {t('whyRent.savingsHeadline')}
            </p>

            {/* Comparison — semantic table (matches the Pricing section's
                table pattern for screen readers + crawlers). table-fixed keeps
                it readable at ≤375px: the LENGOLF column is green, the course
                column muted; cells wrap rather than overflow. */}
            <div className="mt-8 overflow-hidden rounded-2xl border-2 border-primary/30 bg-white">
              <table className="w-full table-fixed border-collapse text-left">
                <caption className="sr-only">
                  {t('whyRent.heading')} {t('whyRent.savingsHeadline')}
                </caption>
                <thead>
                  <tr>
                    <td className="w-[38%] px-3 py-3 sm:px-5" />
                    <th
                      scope="col"
                      className="px-3 py-3 text-center text-sm font-bold uppercase tracking-wide text-white sm:px-5 sm:text-base"
                      style={{ backgroundColor: '#005a32' }}
                    >
                      LENGOLF
                    </th>
                    <th
                      scope="col"
                      className="bg-muted/40 px-3 py-3 text-center text-sm font-semibold text-muted-foreground sm:px-5 sm:text-base"
                    >
                      {t('whyRent.colCourse')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {WHY_RENT_ROWS.map((key, i) => (
                    <tr key={key} className={`border-t border-border/60 ${i % 2 === 1 ? 'bg-muted/10' : ''}`}>
                      <th
                        scope="row"
                        className="px-3 py-3 text-left align-top text-xs font-semibold text-foreground sm:px-5 sm:text-sm"
                      >
                        {t(`whyRent.rows.${key}.label`)}
                      </th>
                      <td
                        className="px-3 py-3 align-top text-xs font-semibold sm:px-5 sm:text-sm"
                        style={{ backgroundColor: '#F6FFFA', color: '#005a32' }}
                      >
                        {t(`whyRent.rows.${key}.lengolf`)}
                      </td>
                      <td className="px-3 py-3 align-top text-xs text-muted-foreground sm:px-5 sm:text-sm">
                        {t(`whyRent.rows.${key}.course`)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{t('whyRent.footnote')}</p>

            <div className="mt-8 text-center">
              <BookRentalLink
                href={courseRentalUrl}
                source="why_rent"
                label={t('whyRent.cta')}
                className="inline-flex h-14 items-center gap-2.5 rounded-lg px-10 text-base font-bold text-white shadow-md transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#007429' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Book Now CTA ── */}
      <section id="book-now" className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <div className="mx-auto max-w-md">
            <h2 className="mb-3 text-center text-3xl font-bold italic lg:text-4xl">
              <span style={{ color: '#007429' }}>{t('formTitle')}</span>
            </h2>
            <p className="mb-8 text-center text-muted-foreground">{t('formSubtitle')}</p>

            <BookRentalLink
              href={courseRentalUrl}
              source="section"
              label={t('stickyBookCta')}
              className="flex w-full h-14 items-center justify-center gap-2.5 rounded-lg text-base font-bold text-white transition-opacity hover:opacity-90 shadow-md mb-6"
              style={{ backgroundColor: '#007429' }}
            />

            <MultiChannelContact
              lineLabel={t('contactLineLabel')}
              emailLabel={t('contactEmailLabel')}
              phoneLabel={t('contactPhoneLabel')}
              languageNote={contactLanguageNote}
              lineHandle="@lengolf"
              email={BUSINESS_INFO.email}
              phone={BUSINESS_INFO.phone}
              lineUrl={SOCIAL_LINKS.line}
            />
          </div>
        </div>
      </section>

      {/* ── How It Works (compact) ── */}
      <section className="py-12 lg:py-16">
        <div className="section-max-width section-padding">
          <h2 className="mb-8 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('howItWorksTitle')}</span>{' '}
            <span className="text-foreground">{t('howItWorksTitleSuffix')}</span>
          </h2>
          <div className="mx-auto max-w-2xl">
            <ol className="space-y-4">
              {[1, 2, 3].map((step) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold" style={{ color: '#007429' }}>
                    {step}
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground pt-1">{t(`howStep${step}`)}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FaqSection items={faqItems} links={faqLinks} title={t('faqTitle')} titleSuffix={t('faqTitleSuffix')} bgColor="#F6FFFA" />

      {/* ── CTA Band ── */}
      <section className="py-12 lg:py-16 bg-primary">
        <div className="section-max-width section-padding text-center">
          <h2 className="mb-3 text-2xl font-bold text-white lg:text-3xl">{t('ctaTitle')}</h2>
          <p className="mb-6 text-white/80">{t('ctaSubtitle')}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <BookRentalLink
              href={courseRentalUrl}
              source="footer"
              label={t('stickyBookCta')}
              iconSize={16}
              className="inline-flex h-12 items-center gap-2 rounded-md bg-white px-8 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ color: '#005a32' }}
            />
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="inline-flex h-12 items-center gap-2 rounded-md border-2 border-white px-8 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Phone size={16} />
              {t('ctaPhoneButton')}
            </a>
          </div>
        </div>
      </section>

      {/* ── Cross-links ── */}
      <SectionWrapper>
        <h2 className="mb-3 text-center text-3xl font-bold italic lg:text-4xl">
          <span style={{ color: '#007429' }}>{t('crossLinksTitle')}</span>{' '}
          <span className="text-foreground">{t('crossLinksTitleSuffix')}</span>
        </h2>
        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
          <Link
            href="/golf-club-rental"
            className="group rounded-xl border border-primary/15 bg-white p-6 transition-shadow hover:shadow-md block"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10" style={{ color: '#007429' }}>
              <MapPin size={20} />
            </div>
            <h3 className="mb-1 font-bold text-foreground group-hover:text-primary transition-colors">{t('crossLink1Label')}</h3>
            <p className="text-sm text-muted-foreground">{t('crossLink1Desc')}</p>
          </Link>
          <Link
            href="/second-hand-golf-clubs-bangkok"
            className="group rounded-xl border border-primary/15 bg-white p-6 transition-shadow hover:shadow-md block"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10" style={{ color: '#007429' }}>
              <ShoppingBag size={20} />
            </div>
            <h3 className="mb-1 font-bold text-foreground group-hover:text-primary transition-colors">{t('crossLink2Label')}</h3>
            <p className="text-sm text-muted-foreground">{t('crossLink2Desc')}</p>
          </Link>
          <Link
            href="/golf"
            className="group rounded-xl border border-primary/15 bg-white p-6 transition-shadow hover:shadow-md block"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10" style={{ color: '#007429' }}>
              <Target size={20} />
            </div>
            <h3 className="mb-1 font-bold text-foreground group-hover:text-primary transition-colors">{t('crossLink3Label')}</h3>
            <p className="text-sm text-muted-foreground">{t('crossLink3Desc')}</p>
          </Link>
          <Link
            href="/lessons"
            className="group rounded-xl border border-primary/15 bg-white p-6 transition-shadow hover:shadow-md block"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10" style={{ color: '#007429' }}>
              <GraduationCap size={20} />
            </div>
            <h3 className="mb-1 font-bold text-foreground group-hover:text-primary transition-colors">{t('crossLink4Label')}</h3>
            <p className="text-sm text-muted-foreground">{t('crossLink4Desc')}</p>
          </Link>
        </div>
      </SectionWrapper>

      {/* ── Find a course to play (English only — programmatic-SEO pages are EN) ── */}
      {locale === 'en' && (
        <SectionWrapper className="bg-[#F6FFFA]">
          <h2 className="mb-3 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>Find</span>{' '}
            <span className="text-foreground">a course to play</span>
          </h2>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            Browse courses by price, area, or playing style — then book your clubs above.
          </p>
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            <Link
              href="/golf-courses/under/2500-baht"
              className="group rounded-xl border border-primary/15 bg-white px-4 py-3 text-center text-sm transition-shadow hover:shadow-md"
            >
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Under ฿2,500</p>
            </Link>
            <Link
              href="/golf-courses/under/5000-baht"
              className="group rounded-xl border border-primary/15 bg-white px-4 py-3 text-center text-sm transition-shadow hover:shadow-md"
            >
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Under ฿5,000</p>
            </Link>
            <Link
              href="/golf-courses/near/asok"
              className="group rounded-xl border border-primary/15 bg-white px-4 py-3 text-center text-sm transition-shadow hover:shadow-md"
            >
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Near Asok BTS</p>
            </Link>
            <Link
              href="/golf-courses/near/chidlom"
              className="group rounded-xl border border-primary/15 bg-white px-4 py-3 text-center text-sm transition-shadow hover:shadow-md"
            >
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Near Chidlom BTS</p>
            </Link>
            <Link
              href="/golf-courses/best-for/beginners"
              className="group rounded-xl border border-primary/15 bg-white px-4 py-3 text-center text-sm transition-shadow hover:shadow-md"
            >
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Best for beginners</p>
            </Link>
            <Link
              href="/golf-courses/best-for/tournaments"
              className="group rounded-xl border border-primary/15 bg-white px-4 py-3 text-center text-sm transition-shadow hover:shadow-md"
            >
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Tournament courses</p>
            </Link>
            <Link
              href="/golf-courses"
              className="group rounded-xl border border-primary/15 bg-white px-4 py-3 text-center text-sm transition-shadow hover:shadow-md"
            >
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">All regions</p>
            </Link>
            <Link
              href="/golf-courses/best-for/weekday-play"
              className="group rounded-xl border border-primary/15 bg-white px-4 py-3 text-center text-sm transition-shadow hover:shadow-md"
            >
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Weekday savings</p>
            </Link>
            <Link
              href="/golf-courses/bangkok"
              className="group rounded-xl border border-primary/15 bg-white px-4 py-3 text-center text-sm transition-shadow hover:shadow-md"
            >
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Bangkok courses</p>
            </Link>
            <Link
              href="/golf-courses/near/suvarnabhumi-airport"
              className="group rounded-xl border border-primary/15 bg-white px-4 py-3 text-center text-sm transition-shadow hover:shadow-md"
            >
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Near Suvarnabhumi (BKK)</p>
            </Link>
            <Link
              href="/golf-courses/near/don-mueang-airport"
              className="group rounded-xl border border-primary/15 bg-white px-4 py-3 text-center text-sm transition-shadow hover:shadow-md"
            >
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Near Don Mueang (DMK)</p>
            </Link>
            <Link
              href="/golf-courses/under/7500-baht"
              className="group rounded-xl border border-primary/15 bg-white px-4 py-3 text-center text-sm transition-shadow hover:shadow-md"
            >
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Best-value green fees</p>
            </Link>
          </div>
        </SectionWrapper>
      )}

      {/* JSON-LD structured data — rendered at end of body so it doesn't
          compete with the hero/CTA paint. Position is irrelevant to
          search-engine consumption. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  )
}
