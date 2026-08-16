import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import SectionWrapper from '@/components/shared/SectionWrapper'
import BookingCTA from '@/components/shared/BookingCTA'
import ImageGallery from '@/components/shared/ImageGallery'
import ServicesCarousel from '@/components/home/ServicesCarousel'
import HeroVideo from '@/components/home/HeroVideo'
import { services } from '@/data/pricing'
import { BUSINESS_INFO, SITE_URL, SOCIAL_LINKS, storageUrl, storageImageUrl } from '@/lib/constants'
import { getSiteFacts } from '@/lib/site-facts'
import { getAlternates, getCanonical, OG_LOCALES, type Locale } from '@/lib/translated-routes'
import { getFaqPageJsonLd, getAggregateRatingJsonLd, getBreadcrumbJsonLd, getHomePricingJsonLd } from '@/lib/jsonld'
import { getGoogleReviews, truncateReviewText } from '@/lib/google-reviews'
import FaqSection from '@/components/shared/FaqSection'
import { StarIcon } from '@/components/shared/StarRating'
import JapanLandingPage from '@/components/home/JapanLandingPage'
import KoreaLandingPage from '@/components/home/KoreaLandingPage'
import ChinaLandingPage from '@/components/home/ChinaLandingPage'

const BESPOKE_HOME_NAMESPACE: Record<string, string> = {
  ja: 'HomeJa',
  ko: 'HomeKo',
  zh: 'HomeZh',
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  // JA / KO / ZH each ship a bespoke tourist-landing page with its own meta
  // targeting that market's search intent. See BESPOKE_HOME_NAMESPACE.
  const namespace = BESPOKE_HOME_NAMESPACE[locale] ?? 'Home'
  const t = await getTranslations({ locale, namespace })

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: getCanonical(locale, '/'),
      languages: getAlternates('/'),
    },
    openGraph: {
      images: [{ url: storageUrl('venue/venue-simulator-01.jpg'), alt: 'LENGOLF indoor golf simulator in Bangkok' }],
      locale: OG_LOCALES[locale as Locale] ?? OG_LOCALES.en,
    },
  }
}

const faqLinks: Record<string, { href: string; external?: boolean }> = {
  'booking.len.golf': { href: 'https://booking.len.golf/', external: true },
  '@lengolf': { href: 'https://lin.ee/uxQpIXn', external: true },
  'Google Maps': { href: BUSINESS_INFO.googleMapsUrl, external: true },
  'bay rates page': { href: '/golf' },
  'club rental page': { href: '/golf-club-rental' },
  'lessons page': { href: '/lessons' },
  'events page': { href: '/events' },
}

const galleryImages = [
  { src: storageUrl('venue/venue-simulator-01.jpg'), alt: 'Golf simulator bay with Korean Bravo Golf technology and auto tee system at LENGOLF', width: 1024, height: 683 },
  { src: storageUrl('venue/venue-interior-01.jpg'), alt: 'LENGOLF bar and lounge area with full drinks menu', width: 1024, height: 1024 },
  { src: storageUrl('venue/venue-interior-02.jpg'), alt: 'Interior view of LENGOLF showing multiple simulator bays and seating', width: 1024, height: 1024 },
  { src: storageUrl('venue/venue-interior-03.jpg'), alt: 'LENGOLF welcome area and lobby on the 4th floor of The Mercury Ville', width: 1024, height: 1024 },
  { src: storageUrl('venue/venue-bay-01.jpg'), alt: 'Close-up of a LENGOLF simulator bay with hitting mat and projection screen', width: 1024, height: 683 },
  { src: storageUrl('venue/venue-bar-01.jpg'), alt: 'LENGOLF bar counter serving craft cocktails and imported beers', width: 683, height: 1024 },
  { src: storageUrl('venue/venue-event-space.jpg'), alt: 'LENGOLF private event space configured for corporate team building', width: 1024, height: 683 },
  { src: storageUrl('venue/venue-simulator-02.jpg'), alt: 'Guests playing a virtual golf course on the Bravo Golf simulator at LENGOLF', width: 1024, height: 683 },
]

export const revalidate = 86400

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  // JA / KO / ZH each get a bespoke tourist-landing layout tailored to that market
  // (market-specific hero/framing, approximate local-currency pricing,
  // tourist-specific FAQ). See components/home/*LandingPage.tsx.
  if (locale === 'ja') return <JapanLandingPage />
  if (locale === 'ko') return <KoreaLandingPage />
  if (locale === 'zh') return <ChinaLandingPage />

  const t = await getTranslations('Home')
  const facts = await getSiteFacts()
  const tCommon = await getTranslations('Common')
  const tFaq = await getTranslations('HomeFaq')

  // Build FAQ items from translations
  const faqItems = Array.from({ length: 8 }, (_, i) => ({
    question: tFaq(`q${i + 1}`),
    answer: tFaq(`a${i + 1}`),
  }))

  const faqJsonLd = getFaqPageJsonLd(faqItems)
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
  ])
  const homePricingJsonLd = getHomePricingJsonLd()
  const reviewsData = await getGoogleReviews(locale)

  const stats = [
    { stat: t('stat1Value'), label: t('stat1Label') },
    { stat: t('stat2Value'), label: t('stat2Label') },
    { stat: t('stat3Value'), label: t('stat3Label') },
    { stat: t('stat4Value'), label: t('stat4Label') },
  ]

  const whyLengolf = [
    {
      title: t('why1Title'),
      subtitle: t('why1Subtitle'),
      description: t('why1Description'),
      image: storageUrl('venue/venue-simulator-01.jpg'),
    },
    {
      title: t('why2Title'),
      subtitle: t('why2Subtitle'),
      description: t('why2Description'),
      image: storageUrl('venue/venue-bar-01.jpg'),
    },
    {
      title: t('why3Title'),
      subtitle: t('why3Subtitle'),
      description: t('why3Description'),
      image: storageUrl('lessons/lessons-cover.jpg'),
    },
  ]

  const serviceLinks = [
    {
      title: t('service1Title'),
      description: t('service1Description'),
      image: storageUrl('golf/hero-golf.jpg'),
      href: '/golf' as const,
    },
    {
      title: t('service2Title'),
      description: t('service2Description'),
      image: storageUrl('lessons/lessons-cover.jpg'),
      href: '/lessons' as const,
    },
    {
      title: t('service3Title'),
      description: t('service3Description'),
      image: storageUrl('events/events-cover.jpg'),
      href: '/events' as const,
    },
    {
      title: t('service4Title'),
      description: t('service4Description'),
      image: storageUrl('venue/venue-simulator-01.jpg'),
      href: '/golf-club-rental' as const,
    },
  ]

  return (
    <>
      {/* JSON-LD Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* JSON-LD OfferCatalog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePricingJsonLd) }}
      />

      {/* JSON-LD AggregateRating */}
      {reviewsData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getAggregateRatingJsonLd(reviewsData.rating, reviewsData.totalReviews)) }}
        />
      )}

      {/* ── 1. Video Hero ── */}
      <section className="relative flex min-h-[560px] items-center justify-center overflow-hidden bg-[#30884E] text-white md:min-h-[620px]">
        {/* Hero background image (LCP element) */}
        <Image
          src={storageUrl('venue/venue-simulator-01.jpg')}
          alt="LENGOLF indoor golf simulator facility in Bangkok"
          width={1280}
          height={720}
          priority
          fetchPriority="high"
          quality={75}
          className="absolute inset-0 h-full w-full object-cover"
          sizes="100vw"
        />
        {/* Autoplaying loop, fetched after the load event so it never becomes the
            LCP candidate. 720p30 desktop / 480p mobile, audio stripped, faststart.
            Source was 1080p150 with an unused audio track: 29.6 MB, vs 4.1 MB and
            2.0 MB here. Single mp4 per breakpoint on purpose - a webm/mp4 pair made
            Chrome fetch the mp4 the instant the webm finished, for 7.6 MB total. */}
        <HeroVideo
          srcDesktop={storageUrl('videos/hero-loop-720p.mp4')}
          srcMobile={storageUrl('videos/hero-loop-480p.mp4')}
          poster={storageImageUrl('venue/venue-simulator-01.jpg', { width: 1280, quality: 60 })}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-[#005a32]/60" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <Image
            src={storageUrl('branding/logo-typo.png')}
            alt="LENGOLF"
            width={400}
            height={100}
            className="mx-auto mb-6 h-auto w-48 sm:w-56 lg:w-64"
          />
          <h1 className="mb-4 text-3xl font-black uppercase leading-tight sm:text-4xl md:text-5xl">
            {t('heroTitle')}
          </h1>
          <p className="mb-8 text-base font-medium text-white/85 sm:text-lg">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <BookingCTA text={tCommon('bookYourBay')} className="bg-white text-primary hover:bg-white/90" />
            <a
              href={SOCIAL_LINKS.line}
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

      {/* ── 2. Intro + Stat Chips ── */}
      <SectionWrapper>
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            <strong className="text-foreground">LENGOLF</strong> {t('introText', { name: '' }).trim()}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-4">
                <div className="text-2xl font-bold" style={{ color: '#005a32' }}>{item.stat}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-foreground/70">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <BookingCTA />
            <a
              href={SOCIAL_LINKS.line}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-md border-2 border-primary px-8 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {tCommon('lineAtLengolf')}
            </a>
          </div>
        </div>
      </SectionWrapper>

      {/* ── 3. Services Carousel ── */}
      <div className="mt-[-2rem] pb-16 lg:pb-24">
        <ServicesCarousel services={services.map(s => ({
          ...s,
          displayTitle: s.title === 'Golf' ? t('carouselGolf')
            : s.title === 'Food & Drinks' ? t('carouselFoodDrinks')
            : s.title === 'Lessons' ? t('carouselLessons')
            : s.title === 'Events' ? t('carouselEvents')
            : s.title,
        }))} />
      </div>

      {/* ── 4. Why LENGOLF ── */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <h2 className="mb-14 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#005a32' }}>{t('whyLengolfTitle')}</span>{' '}
            <span className="text-foreground">{t('whyLengolfTitleSuffix')}</span>
          </h2>
          <div className="mx-auto max-w-4xl space-y-8">
            {whyLengolf.map((item, i) => (
              <div
                key={item.title}
                className={`flex flex-col overflow-hidden rounded-xl bg-white shadow-sm md:flex-row md:items-stretch ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="md:w-2/5 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={480}
                    height={320}
                    quality={70}
                    className="h-52 w-full object-cover md:h-full"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
                <div className="flex flex-col justify-center p-6 md:p-8">
                  <h3 className="mb-1 text-xl font-bold" style={{ color: '#005a32' }}>
                    {item.title}
                  </h3>
                  <p className="mb-3 text-sm font-medium text-foreground/60">{item.subtitle}</p>
                  <p className="text-sm leading-relaxed text-foreground/70">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Google Reviews (compact) ── */}
      {reviewsData && reviewsData.reviews.length > 0 && (
        <SectionWrapper>
          <div className="mx-auto max-w-4xl">
            {/* Rating header */}
            <div className="mb-8 flex flex-col items-center gap-2">
              <h2 className="text-3xl font-bold italic lg:text-4xl">
                <span style={{ color: '#005a32' }}>{t('reviewsTitle')}</span>{' '}
                <span className="text-foreground">{t('reviewsTitleSuffix')}</span>
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} filled={star <= Math.round(reviewsData.rating)} />
                  ))}
                </div>
                <span className="text-sm font-bold text-foreground">{reviewsData.rating} / 5.0</span>
                <span className="text-sm text-muted-foreground">
                  · {t('reviewsCount', { count: reviewsData.totalReviews.toLocaleString() })}
                </span>
              </div>
            </div>

            {/* 3 review cards */}
            <div className="grid gap-5 sm:grid-cols-3">
              {reviewsData.reviews.slice(0, 3).map((review) => {
                const truncated = truncateReviewText(review.text, 150)
                return (
                  <div key={`${review.reviewer_name}-${review.review_created_at}`} className="rounded-lg border border-border/60 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {review.reviewer_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{review.reviewer_name}</p>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon key={star} filled={star <= review.rating} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{truncated}</p>
                  </div>
                )
              })}
            </div>

            {/* Link */}
            <div className="mt-6 text-center">
              <a
                href="https://maps.app.goo.gl/4eCe3XNUWEf7QPcL7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                {t('reviewsAllReviews')}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* ── 6. CTA Band ── */}
      <section className="py-12 lg:py-16 bg-primary">
        <div className="section-max-width section-padding text-center">
          <h2 className="mb-3 text-2xl font-bold text-white lg:text-3xl">{tCommon('readyToPlay')}</h2>
          <p className="mb-6 text-white/80">{tCommon('readyToPlaySubtitle')}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <BookingCTA text={tCommon('bookYourBay')} className="bg-white text-primary hover:bg-white/90" />
            <a
              href={SOCIAL_LINKS.line}
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

      {/* ── 6. Gallery ── */}
      <SectionWrapper>
        <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
          <span style={{ color: '#005a32' }}>{t('galleryTitle')}</span>{' '}
          <span className="text-foreground">{t('galleryTitleSuffix')}</span>
        </h2>
        <ImageGallery images={galleryImages} rows={[5, 3]} />
      </SectionWrapper>

      {/* ── 7. Explore Our Services ── */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#005a32' }}>{t('servicesTitle')}</span>{' '}
            <span className="text-foreground">{t('servicesTitleSuffix')}</span>
          </h2>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
            {serviceLinks.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={400}
                    quality={70}
                    className="aspect-[3/2] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="mb-2 text-lg font-bold" style={{ color: '#005a32' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold transition-colors" style={{ color: '#005a32' }}>
                    {tCommon('learnMore')}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Find Us ── */}
      <SectionWrapper>
        <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
          <span style={{ color: '#005a32' }}>{t('findUsTitle')}</span>{' '}
          <span className="text-foreground">{t('findUsTitleSuffix')}</span>
        </h2>
        <div className="mx-auto max-w-5xl flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="w-full overflow-hidden rounded-lg lg:w-3/5">
            <iframe
              src={BUSINESS_INFO.googleMapsEmbed}
              title="LENGOLF Location"
              aria-label="LENGOLF"
              className="h-[350px] w-full border-0 lg:h-[400px]"
              loading="lazy"
              allowFullScreen
            />
          </div>
          <div className="flex flex-col gap-5 lg:w-2/5">
            <div>
              <p className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">{t('addressLabel')}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{BUSINESS_INFO.address}</p>
            </div>
            <div>
              <p className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">{t('openingHoursLabel')}</p>
              <p className="text-sm text-muted-foreground">{facts.openingHours}</p>
            </div>
            <div>
              <p className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">{t('phoneLabel')}</p>
              <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="text-sm font-medium text-primary hover:underline">{BUSINESS_INFO.phone}</a>
            </div>
            <div>
              <p className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground">{t('emailLabel')}</p>
              <a href={`mailto:${BUSINESS_INFO.email}`} className="text-sm font-medium text-primary hover:underline">{BUSINESS_INFO.email}</a>
            </div>
            <a
              href={BUSINESS_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:underline"
              style={{ color: '#005a32' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              {t('getDirections')}
            </a>
          </div>
        </div>
      </SectionWrapper>

      {/* ── 9. FAQ ── */}
      <FaqSection items={faqItems} links={faqLinks} title={t('faqTitle')} titleSuffix={t('faqTitleSuffix')} bgColor="#F6FFFA" />
    </>
  )
}
