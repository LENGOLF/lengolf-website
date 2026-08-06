import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import SectionWrapper from '@/components/shared/SectionWrapper'
import ImageGallery from '@/components/shared/ImageGallery'
import { storageUrl, SITE_URL, BUSINESS_INFO } from '@/lib/constants'
import { getAlternates, getCanonical } from '@/lib/translated-routes'
import { eventTypes, getEventPackagesData } from '@/data/pricing'
import { eventClients, instagramPosts } from '@/data/event-clients'
import InstagramEmbed from '@/components/events/InstagramEmbed'
import { getEventsPricingJsonLd, getEventsServiceJsonLd, getFaqPageJsonLd, getBreadcrumbJsonLd } from '@/lib/jsonld'
import EventInquiryForm from '@/components/events/EventInquiryForm'
import FloorPlanDialog from '@/components/events/FloorPlanDialog'
import FaqSection from '@/components/shared/FaqSection'

const faqLinks: Record<string, { href: string; external?: boolean }> = {
  'booking.len.golf': { href: 'https://booking.len.golf/', external: true },
  '@lengolf': { href: 'https://lin.ee/uxQpIXn', external: true },
  'Google Maps': { href: BUSINESS_INFO.googleMapsUrl, external: true },
  'lessons page': { href: '/lessons' },
  'club rental page': { href: '/golf-club-rental' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Events' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: getCanonical(locale, '/events/'),
      languages: getAlternates('/events/'),
    },
    openGraph: { images: [{ url: storageUrl('events/event-01.jpg'), alt: 'Corporate event at LENGOLF indoor golf' }] },
  }
}

const eventGallery = [
  { src: storageUrl('events/event-01.jpg'), alt: 'Corporate team building event with golf simulators at LENGOLF', width: 1200, height: 800 },
  { src: storageUrl('events/event-02.jpg'), alt: 'Birthday celebration at LENGOLF bar area', width: 1200, height: 800 },
  { src: storageUrl('events/event-03.jpg'), alt: 'Corporate networking event with colleagues playing golf simulators', width: 1200, height: 800 },
  { src: storageUrl('events/event-04.jpg'), alt: 'Team building group enjoying indoor golf competition', width: 1200, height: 800 },
  { src: storageUrl('events/event-05.jpg'), alt: 'LENGOLF event space set up for a private party', width: 1200, height: 800 },
  { src: storageUrl('events/event-06.jpg'), alt: 'Friends gathering around the simulator for a golf challenge', width: 1200, height: 800 },
  { src: storageUrl('events/event-07.jpg'), alt: 'Guests playing golf simulators during a company event', width: 1200, height: 800 },
  { src: storageUrl('events/event-08.jpg'), alt: 'Group photo at a LENGOLF private event', width: 1200, height: 800 },
  { src: storageUrl('events/event-09.jpg'), alt: 'Party guests enjoying drinks and golf at LENGOLF', width: 1200, height: 800 },
  { src: storageUrl('events/event-10.jpg'), alt: 'Celebration event with cocktails and golf games', width: 1200, height: 800 },
  { src: storageUrl('events/event-11.jpg'), alt: 'Guests mingling during an indoor golf party', width: 1200, height: 800 },
  { src: storageUrl('events/event-12.jpg'), alt: 'Large group event with multiple simulator bays in use', width: 1200, height: 800 },
  { src: storageUrl('events/event-13.jpg'), alt: 'LENGOLF venue interior with bar and simulator bays', width: 1200, height: 800 },
  { src: storageUrl('events/event-14.jpg'), alt: 'Catered food spread at a LENGOLF event including burgers and appetizers', width: 1200, height: 800 },
  { src: storageUrl('events/event-15.jpg'), alt: 'Guests enjoying catered dining during a private event', width: 1200, height: 800 },
  { src: storageUrl('events/event-16.jpg'), alt: 'Evening event with ambient lighting at LENGOLF', width: 1200, height: 800 },
  { src: storageUrl('events/event-17.jpg'), alt: 'Aerial view of LENGOLF venue during a full-location rental event', width: 1200, height: 800 },
  { src: storageUrl('events/event-18.jpg'), alt: 'Lively party atmosphere with guests enjoying golf and drinks', width: 1200, height: 800 },
  { src: storageUrl('events/event-19.jpg'), alt: 'Guests having fun with golf games at a birthday party', width: 1200, height: 800 },
  { src: storageUrl('events/event-20.jpg'), alt: 'Friends playing a simulator golf tournament at a private party', width: 1200, height: 800 },
  { src: storageUrl('events/event-21.jpg'), alt: 'Catered cocktails and appetizers served at LENGOLF event', width: 1200, height: 800 },
  { src: storageUrl('events/event-22.jpg'), alt: 'Panoramic view of LENGOLF event space with all bays and bar', width: 1200, height: 800 },
]

const FAQ_COUNT = 8

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Events')
  const tFaq = await getTranslations('EventsFaq')
  const tCommon = await getTranslations('Common')

  const faqItems = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    question: tFaq(`q${i + 1}`),
    answer: tFaq(`a${i + 1}`),
  }))

  const { eventPackages, eventPackageNotes } = await getEventPackagesData()

  const pricingJsonLd = getEventsPricingJsonLd(eventPackages)
  const serviceJsonLd = getEventsServiceJsonLd()
  const faqJsonLd = getFaqPageJsonLd(faqItems)
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: t('metaTitle'), url: `${SITE_URL}/events/` },
  ])

  return (
    <>
      {/* JSON-LD Event Pricing Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      {/* JSON-LD Service (event hosting) Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {/* JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── Hero ── */}
      <section className="relative flex h-[50vh] min-h-[400px] max-h-[550px] items-center text-white overflow-hidden">
        <Image
          src={storageUrl('events/event-01.jpg')}
          alt="LENGOLF event party"
          fill
          className="object-cover"
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
          <p className="mt-3 inline-block rounded-full bg-white/20 backdrop-blur-sm px-5 py-1.5 text-sm font-bold tracking-wide text-white md:text-base">
            {t('heroPricing')}
          </p>
        </div>
      </section>

      {/* ── Intro + Stat Chips ── */}
      <SectionWrapper>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('introTitle')}</span>{' '}
            <span className="text-foreground">{t('introTitleSuffix')}</span>
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            {t('introText')}
          </p>

          {/* Stat chips */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-4">
                <div className="text-2xl font-bold" style={{ color: '#007429' }}>{t(`stat${i}Value`)}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t(`stat${i}Label`)}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#inquire"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-8 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              {t('inquireNow')}
            </a>
            <FloorPlanDialog />
          </div>
        </div>
      </SectionWrapper>

      {/* ── Amenities ── */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <h2 className="mb-12 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('amenitiesTitle')}</span>{' '}
            <span className="text-foreground">{t('amenitiesTitleSuffix')}</span>
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="flex items-center justify-center rounded-md px-4 py-6 text-center font-bold uppercase text-primary transition-colors hover:bg-primary/5"
                style={{ border: '2px solid #007429' }}
              >
                <p className="text-sm md:text-base">{t(`amenity${i}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Event Types ── */}
      <SectionWrapper>
        <h2 className="mb-12 text-center text-3xl font-bold italic lg:text-4xl">
          <span style={{ color: '#007429' }}>{t('eventTypesTitle')}</span>{' '}
          <span className="text-foreground">{t('eventTypesTitleSuffix')}</span>
        </h2>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {eventTypes.map((event, i) => (
            <div key={i} className="flex flex-col items-center gap-4 text-center">
              <Image
                src={event.icon}
                alt={t(`eventType${i + 1}`)}
                width={80}
                height={80}
                className="opacity-80"
                style={{ filter: 'hue-rotate(0deg) saturate(1.2)' }}
              />
              <p className="text-sm font-medium">{t(`eventType${i + 1}`)}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ── Event Packages ── */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('packagesTitle')}</span>{' '}
            <span className="text-foreground">{t('packagesTitleSuffix')}</span>
          </h2>
          <div className="mx-auto max-w-lg">
            <Image
              src={storageUrl('events/event-packages.jpg')}
              alt="LENGOLF Event Packages: Small Package 9,999 THB for 10–15 guests with 2 bays, Medium Package 21,999 THB for 15–25 guests with 4 bays and exclusive full-location rental"
              width={512}
              height={723}
              className="w-full rounded-lg shadow-sm"
              sizes="(max-width: 512px) 100vw, 512px"
            />
          </div>
          {/* Screen-reader / crawler-visible event packages table */}
          <div className="sr-only">
            <table>
              <caption>LENGOLF Event Packages Comparison</caption>
              <thead>
                <tr>
                  <th>Feature</th>
                  {eventPackages.map((pkg) => (
                    <th key={pkg.name}>{pkg.name} ({pkg.price})</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Guests</td>
                  {eventPackages.map((pkg) => <td key={pkg.name}>{pkg.guests}</td>)}
                </tr>
                <tr>
                  <td>Golf Bays</td>
                  {eventPackages.map((pkg) => <td key={pkg.name}>{pkg.bays}</td>)}
                </tr>
                <tr>
                  <td>Duration</td>
                  {eventPackages.map((pkg) => <td key={pkg.name}>{pkg.duration}</td>)}
                </tr>
                <tr>
                  <td>Beers</td>
                  {eventPackages.map((pkg) => <td key={pkg.name}>{pkg.beers}</td>)}
                </tr>
                <tr>
                  <td>Cocktails</td>
                  {eventPackages.map((pkg) => <td key={pkg.name}>{pkg.cocktails}</td>)}
                </tr>
                <tr>
                  <td>Soft Drinks</td>
                  {eventPackages.map((pkg) => <td key={pkg.name}>{pkg.softDrinks}</td>)}
                </tr>
                <tr>
                  <td>Food</td>
                  {eventPackages.map((pkg) => <td key={pkg.name}>{pkg.food.join(', ')}</td>)}
                </tr>
                <tr>
                  <td>Catered By</td>
                  {eventPackages.map((pkg) => <td key={pkg.name}>{pkg.caterer}</td>)}
                </tr>
                <tr>
                  <td>Exclusive Location</td>
                  {eventPackages.map((pkg) => <td key={pkg.name}>{pkg.exclusive ? 'Yes' : 'No'}</td>)}
                </tr>
              </tbody>
            </table>
            <ul>
              {eventPackageNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Social Proof ── */}
      <SectionWrapper>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('socialProofTitle')}</span>{' '}
            <span className="text-foreground">{t('socialProofTitleSuffix')}</span>
          </h2>
          <p className="mb-8 text-sm text-muted-foreground">{t('trustedByLabel')}</p>

          {/* Stat chips */}
          <div className="mx-auto mb-10 grid max-w-md grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-4">
                <div className="text-2xl font-bold" style={{ color: '#007429' }}>{t(`socialProofStat${i}Value`)}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t(`socialProofStat${i}Label`)}</div>
              </div>
            ))}
          </div>

          {/* Client logos */}
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {eventClients.map((client) => (
              <div key={client.name} className="flex items-center justify-center">
                <Image
                  src={storageUrl(client.logo)}
                  alt={client.name}
                  width={client.width}
                  height={client.height}
                  className={`${client.className || 'h-8 lg:h-10'} w-auto object-contain grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100`}
                />
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ── Instagram Highlights ── */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('instagramTitle')}</span>{' '}
            <span className="text-foreground">{t('instagramTitleSuffix')}</span>
          </h2>
          <InstagramEmbed shortcodes={instagramPosts} />
        </div>
      </section>

      {/* ── CTA Band ── */}
      <section className="py-12 lg:py-16 bg-primary">
        <div className="section-max-width section-padding text-center">
          <h2 className="mb-3 text-2xl font-bold text-white lg:text-3xl">{t('ctaTitle')}</h2>
          <p className="mb-6 text-white/80">{t('ctaSubtitle')}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#inquire"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-white text-primary px-8 text-sm font-semibold transition-colors hover:bg-white/90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              {t('inquireNow')}
            </a>
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

      {/* ── Inquiry Form ── */}
      <SectionWrapper id="inquire">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('formTitle')}</span>{' '}
            <span className="text-foreground">{t('formTitleSuffix')}</span>
          </h2>
          <EventInquiryForm />
        </div>
      </SectionWrapper>

      {/* ── FAQ ── */}
      <FaqSection items={faqItems} links={faqLinks} title={t('faqTitle')} titleSuffix={t('faqTitleSuffix')} bgColor="#F6FFFA" />

      {/* ── Event Gallery ── */}
      <SectionWrapper>
        <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
          <span style={{ color: '#007429' }}>{t('galleryTitle')}</span>{' '}
          <span className="text-foreground">{t('galleryTitleSuffix')}</span>
        </h2>
        <ImageGallery images={eventGallery} rows={[2, 3, 3, 2, 3, 3, 2, 2, 2]} />
      </SectionWrapper>

      {/* ── Explore More ── */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <h2 className="mb-3 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('exploreTitle')}</span>{' '}
            <span className="text-foreground">{t('exploreTitleSuffix')}</span>
          </h2>
          <p className="mb-8 text-center text-sm text-muted-foreground">{t('exploreSubtitle')}</p>
          <div className="mx-auto max-w-xl">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { label: t('exploreCorporatePackages'), href: '/corporate-golf-packages' },
                { label: t('exploreBayRates'), href: '/golf' },
                { label: t('exploreLessons'), href: '/lessons' },
                { label: t('exploreClubRental'), href: '/golf-club-rental' },
                { label: t('exploreBlog'), href: '/blog' },
                { label: t('exploreCorporateEventCostFaq'), href: '/faq/how-much-does-corporate-golf-event-cost-bangkok' },
                { label: t('exploreCorporateEventCostGuide'), href: '/cost/corporate-golf-event-cost-bangkok' },
                { label: t('exploreTeamBuilding'), href: '/best/best-team-building-activities-bangkok' },
                { label: t('exploreGroupActivities'), href: '/activities/group-activities-bangkok' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href as Parameters<typeof Link>[0]['href']}
                  className="rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm font-medium text-[#007429] transition-colors hover:bg-primary hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
