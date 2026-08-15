import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import SectionWrapper from '@/components/shared/SectionWrapper'
import BookingCTA from '@/components/shared/BookingCTA'
import ImageLightbox from '@/components/shared/ImageLightbox'
import { storageUrl, SITE_URL, BUSINESS_INFO, BOOKING_URL } from '@/lib/constants'
import { getAlternates, getCanonical } from '@/lib/translated-routes'
import StickyBookCTA from '@/components/clubs/StickyBookCTA'
import { getClubRentalPricingJsonLd, getClubRentalServiceJsonLd, getFaqPageJsonLd, getBreadcrumbJsonLd } from '@/lib/jsonld'
import { getRentalClubPricing } from '@/lib/clubs'
import FaqSection from '@/components/shared/FaqSection'

export const revalidate = 3600

const faqLinks: Record<string, { href: string; external?: boolean }> = {
  'booking.len.golf': { href: 'https://booking.len.golf/', external: true },
  '@lengolf': { href: 'https://lin.ee/uxQpIXn', external: true },
  'Google Maps': { href: BUSINESS_INFO.googleMapsUrl, external: true },
  'bay rates page': { href: '/golf' },
  'bay rates': { href: '/golf' },
  'golf lessons': { href: '/lessons' },
  'course rental': { href: '/golf-course-club-rental' },
}

const gearIconMap: Record<string, React.ReactNode> = {
  hand: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 17"/></svg>
  ),
}

const whyChooseIconMap: Record<string, React.ReactNode> = {
  award: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
  ),
  gift: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>
  ),
  clock: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  calendar: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
  ),
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ClubRental' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: getCanonical(locale, '/golf-club-rental/'),
      languages: getAlternates('/golf-club-rental/'),
    },
    openGraph: { images: [{ url: storageUrl('venue/venue-simulator-01.jpg'), alt: 'Rent Callaway Warbird, REVA or Paradym golf clubs at LENGOLF Bangkok — free Standard set with every bay booking, Premium from 150 THB/hr' }] },
  }
}

const FAQ_COUNT = 7

export default async function ClubRentalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('ClubRental')
  const tFaq = await getTranslations('ClubRentalFaq')
  const tCommon = await getTranslations('Common')

  const faqItems = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    question: tFaq(`q${i + 1}`),
    answer: tFaq(`a${i + 1}`),
  }))

  const { indoor: indoorPricing } = await getRentalClubPricing()
  const pricingJsonLd = getClubRentalPricingJsonLd()
  const serviceJsonLd = getClubRentalServiceJsonLd()
  const faqJsonLd = getFaqPageJsonLd(faqItems)
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: t('metaTitle'), url: `${SITE_URL}/golf-club-rental/` },
  ])

  return (
    <>
      {/* JSON-LD Pricing Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      {/* JSON-LD Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {/* JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── Sticky mobile CTA ── */}
      <StickyBookCTA label={t('ctaTitle')} href={BOOKING_URL} />

      {/* ── Hero ── */}
      <section className="relative flex h-[50vh] min-h-[400px] max-h-[550px] items-center text-white overflow-hidden">
        <Image
          src={storageUrl('golf/hero-golf.jpg')}
          alt="Rent premium Callaway golf clubs at LENGOLF Bangkok indoor simulator — free Standard set included, Premium from 150 THB/hr"
          fill
          className="object-cover object-center"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(0,90,50,0.55) 0%, rgba(0,122,69,0.45) 40%, rgba(0,90,50,0.3) 100%)',
          }}
        />
        <div className="relative z-10 w-full text-left" style={{ paddingLeft: '4%', paddingRight: '4%' }}>
          <span
            className="inline-block rounded px-6 py-2 text-lg font-bold uppercase tracking-widest text-white mb-5 md:text-xl"
            style={{ backgroundColor: '#7CB342' }}
          >
            {t('heroBadge')}
          </span>
          <h1 className="mb-4 text-5xl font-black uppercase leading-none md:text-6xl lg:text-7xl">
            {t('heroTitle')}
          </h1>
          <p className="text-base font-semibold italic tracking-wide text-white/90 md:text-lg">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* ── Intro + Stat Chips ── */}
      <SectionWrapper>
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            {t('introText')}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-4">
                <div className="text-2xl font-bold" style={{ color: '#007429' }}>{t(`stat${i}Value`)}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t(`stat${i}Label`)}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <BookingCTA />
            <a
              href="#pricing"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-8 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
              {t('pricing')}
            </a>
          </div>
        </div>
      </SectionWrapper>

      {/* ── Course rental crosslink banner ──
          Disambiguation: this page is free in-venue club use; searchers who
          want clubs for a real course should route to /golf-course-club-rental/
          without scrolling to the footer cross-links. */}
      <SectionWrapper className="!py-0">
        <Link
          href="/golf-course-club-rental"
          className="group mx-auto flex max-w-4xl flex-col items-start gap-3 rounded-xl border-2 border-primary/30 bg-primary/5 px-6 py-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-bold text-foreground" style={{ color: '#007429' }}>{t('courseBannerTitle')}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t('courseBannerText')}</p>
          </div>
          <span className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-white transition-colors group-hover:bg-primary-light">
            {t('courseBannerCta')}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </span>
        </Link>
      </SectionWrapper>

      {/* ── Club Rental Tiers ── */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('tiersTitle')}</span>{' '}
            <span className="text-foreground">{t('tiersTitleSuffix')}</span>
          </h2>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 md:items-stretch">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`rounded-xl border p-6 transition-shadow hover:shadow-md flex flex-col ${
                  i === 3
                    ? 'border-2 border-primary bg-[#003d1f] text-white shadow-lg'
                    : i === 2
                    ? 'border-primary/30 bg-white shadow-sm'
                    : 'border-border/60 bg-white'
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                      i === 1
                        ? 'bg-primary/10 text-primary'
                        : i === 3
                        ? 'bg-[#c8a96e] text-[#003d1f]'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {t(`tier${i}Tag`)}
                  </span>
                </div>

                <h3 className={`mb-1 text-xl font-bold ${i === 3 ? 'text-[#c8a96e]' : ''}`} style={i !== 3 ? { color: '#007429' } : undefined}>{t(`tier${i}Name`)}</h3>
                <p className={`mb-1 text-sm font-semibold ${i === 3 ? 'text-white' : 'text-foreground'}`}>{t(`tier${i}Brand`)}</p>
                <p className={`mb-3 text-xs ${i === 3 ? 'text-white/60' : 'text-muted-foreground'}`}>{t(`tier${i}Type`)}</p>

                {/* Premium photo strip — clickable lightbox */}
                {i === 2 && (
                  <div className="mb-4 -mx-1 h-[200px]">
                    <ImageLightbox
                      thumbnailCount={3}
                      images={[
                        { src: storageUrl('clubs/premium/2.png'), alt: 'Callaway Warbird full set in golf bag' },
                        { src: storageUrl('clubs/premium/4.png'), alt: 'Callaway Warbird driver 10.5°' },
                        { src: storageUrl('clubs/premium/11.png'), alt: 'Callaway Warbird irons set' },
                        { src: storageUrl('clubs/premium/9.png'), alt: 'Callaway Warbird 5-wood fairway wood' },
                        { src: storageUrl('clubs/premium/13.png'), alt: 'Odyssey putter' },
                        { src: storageUrl('clubs/premium/1.png'), alt: 'Callaway Warbird golf bag' },
                      ]}
                      gridClassName="grid grid-cols-3 gap-1.5 h-full"
                      aspectClassName=""
                      sizes="(max-width: 768px) 33vw, 10vw"
                    />
                  </div>
                )}

                {/* Premium+ photo strip — clickable lightbox (3 thumbnails, 6 in lightbox) */}
                {i === 3 && (
                  <div className="mb-4 -mx-1 h-[200px]">
                    <ImageLightbox
                      thumbnailCount={3}
                      images={[
                        { src: storageUrl('clubs/premium-plus/2.png'), alt: 'Callaway Paradym Forged Carbon full set in bag' },
                        { src: storageUrl('clubs/premium-plus/4.png'), alt: 'Callaway Paradym Forged Carbon driver 10.5 degree with Ventus TR shaft' },
                        { src: storageUrl('clubs/premium-plus/11.png'), alt: 'Callaway Paradym irons set 5-PW' },
                        { src: storageUrl('clubs/premium-plus/13.png'), alt: 'Callaway Jaws Raw wedges 52 and 56 degree' },
                        { src: storageUrl('clubs/premium-plus/15.png'), alt: 'Odyssey White Hot Black Series Five putter' },
                        { src: storageUrl('clubs/premium-plus/1.png'), alt: 'Callaway camo golf bag included with Premium+ rental' },
                      ]}
                      gridClassName="grid grid-cols-3 gap-1.5 h-full"
                      aspectClassName=""
                      sizes="(max-width: 768px) 30vw, 10vw"
                    />
                  </div>
                )}
                <ul className="mb-5 space-y-2 flex-1">
                  {[1, 2, 3].map((j) => (
                    <li key={j} className={`flex items-start gap-2 text-sm ${i === 3 ? 'text-white/80' : 'text-muted-foreground'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={i === 3 ? '#c8a96e' : '#007429'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
                      {t(`tier${i}Spec${j}`)}
                    </li>
                  ))}
                </ul>
                <div className={`border-t pt-4 mt-auto ${i === 3 ? 'border-white/20' : 'border-border/40'}`}>
                  <p className={`text-lg font-bold ${i === 3 ? 'text-[#c8a96e]' : ''}`} style={i !== 3 ? { color: '#007429' } : undefined}>{t(`tier${i}Price`)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Handedness note */}
          <div className="mx-auto mt-8 max-w-3xl rounded-lg border border-primary/20 bg-white px-5 py-4 text-sm text-foreground">
            <p className="font-semibold" style={{ color: '#007429' }}>{t('handednessNoteTitle')}</p>
            <p className="mt-1 text-muted-foreground">{t('handednessNote')}</p>
          </div>

          {/* These cards stay a teaser — lofts, shaft models and flex live on
              the spec sheet, which is also the link staff paste into LINE. */}
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm">
            <Link href="/golf-club-specs" className="font-semibold text-primary hover:underline">
              {t('seeFullSpecs')}
            </Link>
          </p>

          {/* sr-only table for crawlers */}
          <div className="sr-only">
            <table>
              <caption>LENGOLF Golf Club Rental Options</caption>
              <thead>
                <tr>
                  <th>Set</th>
                  <th>Brand</th>
                  <th>Type</th>
                  <th>Includes</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td>{t(`tier${i}Name`)}</td>
                    <td>{t(`tier${i}Brand`)}</td>
                    <td>{t(`tier${i}Type`)}</td>
                    <td>{[1, 2, 3].map(j => t(`tier${i}Spec${j}`)).join('; ')}</td>
                    <td>{t(`tier${i}Price`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Club Upgrade Pricing ── */}
      <section id="pricing" className="py-16 lg:py-24">
        <div className="section-max-width section-padding">
          <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('premiumPricingTitle')}</span>{' '}
            <span className="text-foreground">{t('premiumPricingTitleSuffix')}</span>
          </h2>
          <div className="mx-auto max-w-lg">
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
                  {indoorPricing.map((row, i) => (
                    <tr key={row.duration} className={i % 2 === 0 ? 'bg-white' : 'bg-muted/30'}>
                      <td className="px-5 py-4 text-sm font-medium text-foreground">{row.duration}</td>
                      <td className="px-5 py-4 text-sm font-bold text-center" style={{ color: '#007429' }}>{row.premium}</td>
                      <td className="px-5 py-4 text-sm font-bold text-center" style={{ color: '#007429' }}>{row.premiumPlus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {t('premiumPricingNote')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Gear-Up Add-Ons ── */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('gearUpTitle')}</span>{' '}
            <span className="text-foreground">{t('gearUpTitleSuffix')}</span>
          </h2>
          <div className="mx-auto max-w-sm">
            <div className="rounded-lg border border-primary/15 bg-white px-5 py-6 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10" style={{ color: '#007429' }}>
                {gearIconMap['hand']}
              </div>
              <h3 className="mb-1 text-base font-bold text-foreground">{t('gear1Name')}</h3>
              <p className="mb-2 text-lg font-bold" style={{ color: '#007429' }}>{t('gear1Price')}</p>
              <p className="text-xs text-muted-foreground">{t('gear1Description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose LENGOLF ── */}
      <section className="py-16 lg:py-24">
        <div className="section-max-width section-padding">
          <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('whyChooseTitle')}</span>{' '}
            <span className="text-foreground">{t('whyChooseTitleSuffix')}</span>
          </h2>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
            {([
              { key: 1, icon: 'award' },
              { key: 2, icon: 'gift' },
              { key: 3, icon: 'clock' },
              { key: 4, icon: 'calendar' },
            ] as const).map((item) => (
              <div key={item.key} className="rounded-xl border border-border/60 bg-white p-6">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10" style={{ color: '#007429' }}>
                  {whyChooseIconMap[item.icon]}
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{t(`why${item.key}Title`)}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(`why${item.key}Description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Band ── */}
      <section className="py-12 lg:py-16 bg-primary">
        <div className="section-max-width section-padding text-center">
          <h2 className="mb-3 text-2xl font-bold text-white lg:text-3xl">{t('ctaTitle')}</h2>
          <p className="mb-6 text-white/80">{t('ctaSubtitle')}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <BookingCTA text={tCommon('bookNow')} className="bg-white text-primary hover:bg-white/90" />
            <a
              href="https://lin.ee/uxQpIXn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-md border-2 border-white px-8 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {tCommon('lineAtLengolf')}
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FaqSection items={faqItems} links={faqLinks} title={t('faqTitle')} titleSuffix={t('faqTitleSuffix')} bgColor="#F6FFFA" />

      {/* ── Also Need Clubs? Cross-links ── */}
      <SectionWrapper>
        <h2 className="mb-3 text-center text-3xl font-bold italic lg:text-4xl">
          <span style={{ color: '#007429' }}>{t('exploreTitle')}</span>{' '}
          <span className="text-foreground">{t('exploreTitleSuffix')}</span>
        </h2>
        <p className="mb-8 text-center text-sm text-muted-foreground">{t('exploreSubtitle')}</p>
        <div className="mx-auto max-w-md">
          <Link
            href="/golf-course-club-rental"
            className="group rounded-xl border border-primary/15 bg-white p-6 transition-shadow hover:shadow-md block"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10" style={{ color: '#007429' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
            </div>
            <h3 className="mb-1 font-bold text-foreground group-hover:text-primary transition-colors">{t('crossLinkCourseLabel')}</h3>
            <p className="text-sm text-muted-foreground">{t('crossLinkCourseDesc')}</p>
          </Link>
        </div>
      </SectionWrapper>

      {/* ── Find a course to play (English only) ── */}
      {locale === 'en' && (
        <SectionWrapper className="bg-[#F6FFFA]">
          <h2 className="mb-6 text-center text-2xl font-bold italic lg:text-3xl">
            <span style={{ color: '#007429' }}>Plan</span>{' '}
            <span className="text-foreground">your round in Thailand</span>
          </h2>
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
            <Link
              href="/golf-courses/under/2500-baht"
              className="group rounded-xl border border-primary/15 bg-white px-4 py-3 text-center text-sm transition-shadow hover:shadow-md"
            >
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Courses under ฿2,500</p>
            </Link>
            <Link
              href="/golf-courses/best-for/beginners"
              className="group rounded-xl border border-primary/15 bg-white px-4 py-3 text-center text-sm transition-shadow hover:shadow-md"
            >
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Best for beginners</p>
            </Link>
            <Link
              href="/golf-courses/best-for/weekday-play"
              className="group rounded-xl border border-primary/15 bg-white px-4 py-3 text-center text-sm transition-shadow hover:shadow-md"
            >
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Weekday savings</p>
            </Link>
            <Link
              href="/golf-courses"
              className="group rounded-xl border border-primary/15 bg-white px-4 py-3 text-center text-sm transition-shadow hover:shadow-md"
            >
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">All Thailand courses</p>
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
          </div>
        </SectionWrapper>
      )}
    </>
  )
}
