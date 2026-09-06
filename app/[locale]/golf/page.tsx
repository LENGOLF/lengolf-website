import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import SectionWrapper from '@/components/shared/SectionWrapper'
import BookingCTA from '@/components/shared/BookingCTA'
import AqiWidget from '@/components/shared/AqiWidget'
import { storageUrl, SITE_URL, BUSINESS_INFO } from '@/lib/constants'
import { getAlternates, getCanonical, OG_LOCALES, type Locale } from '@/lib/translated-routes'
import { getWebsitePromotions } from '@/lib/promotions'
import { getBayRatesData, getMonthlyPackagesData, type BayRateRow, type MonthlyPackageRow } from '@/data/pricing'
import { getPricingCatalog } from '@/lib/pricing'
import { getGolfPricingJsonLd, getFaqPageJsonLd, getBreadcrumbJsonLd } from '@/lib/jsonld'
import FaqSection from '@/components/shared/FaqSection'
import ClickableImage from '@/components/shared/ClickableImage'
import PricingTable from '@/components/shared/PricingTable'
import CourseRentalCrossLink from '@/components/shared/CourseRentalCrossLink'
import { siteOpenGraph } from '@/lib/open-graph'

const faqLinks: Record<string, { href: string; external?: boolean }> = {
  'booking.len.golf': { href: 'https://booking.len.golf/', external: true },
  '@lengolf': { href: 'https://lin.ee/uxQpIXn', external: true },
  'Google Maps': { href: BUSINESS_INFO.googleMapsUrl, external: true },
  'lessons page': { href: '/lessons' },
  'club rental page': { href: '/golf-club-rental' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Golf' })

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: getCanonical(locale, '/golf/'),
      languages: getAlternates('/golf/'),
    },
    openGraph: siteOpenGraph({
      images: [{ url: storageUrl('golf/driving-range.png'), alt: 'LENGOLF indoor golf simulator bay' }],
      locale: OG_LOCALES[locale as Locale] ?? OG_LOCALES.en,
    }),
  }
}

// Revalidate every hour so promotion changes propagate from DB.
//
// The hour buys PROMOTIONS, not prices, and since 2026-09-04 that distinction
// matters: getWebsitePromotions is a Supabase call outside Next's Data Cache,
// so it really is re-read hourly — but the bay rates and packages this page
// also renders come from lib/pricing.ts, whose fetch is cached for 30 days.
// So this page regenerates 24x more often than its siblings while serving
// prices of exactly the same age, and can show a promo added an hour ago
// beside a rate from four weeks ago. Deliberate: promo freshness is worth the
// writes on five pages. Do not "fix" it by shortening the pricing fetch.
export const revalidate = 3600

const locationLinks = [
  { name: 'Sathorn', href: '/location/indoor-golf-sathorn' },
  { name: 'Phaya Thai', href: '/location/indoor-golf-phaya-thai' },
  { name: 'Ari', href: '/location/indoor-golf-ari' },
  { name: 'Ekkamai', href: '/location/indoor-golf-ekkamai' },
  { name: 'Thong Lo', href: '/location/indoor-golf-thong-lo' },
  { name: 'Phrom Phong', href: '/location/indoor-golf-phrom-phong' },
  { name: 'Nana', href: '/location/indoor-golf-nana' },
  { name: 'Asok', href: '/location/indoor-golf-asok' },
  { name: 'Silom', href: '/location/indoor-golf-silom' },
  { name: 'Sukhumvit', href: '/location/indoor-golf-sukhumvit' },
  { name: 'Ratchadamri', href: '/location/indoor-golf-ratchadamri' },
  { name: 'Siam', href: '/location/indoor-golf-siam' },
  { name: 'Ploenchit', href: '/location/indoor-golf-ploenchit' },
  { name: 'Chidlom', href: '/location/indoor-golf-chidlom' },
]

export default async function GolfPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('Golf')
  const tCommon = await getTranslations('Common')
  const tFaq = await getTranslations('GolfFaq')

  // Build FAQ items from translations
  const faqItems = Array.from({ length: 10 }, (_, i) => ({
    question: tFaq(`q${i + 1}`),
    answer: tFaq(`a${i + 1}`),
  }))

  const catalog = await getPricingCatalog()
  const [{ gridPromotions }, { bayRates, bayRateNotes: _ignoredBayRateNotes }, { monthlyPackages, monthlyPackageNotes: _ignoredPackageNotes }] = await Promise.all([
    getWebsitePromotions(),
    getBayRatesData(catalog),
    getMonthlyPackagesData(catalog),
  ])

  // ── Row-level i18n helpers (English data → translated display) ──
  const translateTimeSlot = (s: string): string => {
    const before = s.match(/^Before\s+(.+)$/i)
    return before ? t('timeSlotBefore', { time: before[1] }) : s
  }
  const translateHours = (h: string): string =>
    h.toLowerCase() === 'unlimited' ? tCommon('unlimited') : h
  const translateValidity = (v: string): string => {
    if (v === '1 month') return tCommon('month')
    const m = v.match(/^(\d+)\s+months?$/i)
    return m ? tCommon('months', { n: Number(m[1]) }) : v
  }
  const translatePerks = (p: string): string => {
    const m = p.match(/^(\d+)%\s*Off\s*F&D$/i)
    return m ? tCommon('perksFbDiscount', { pct: Number(m[1]) }) : p
  }

  const translatedBayRates = bayRates.map((r) => ({ ...r, timeSlot: translateTimeSlot(r.timeSlot) }))
  const translatedMonthlyPackages = monthlyPackages.map((p) => ({
    ...p,
    hours: translateHours(p.hours),
    validity: translateValidity(p.validity),
    perks: translatePerks(p.perks),
  }))
  const bayRateNotes = [t('bayRateNote1'), t('bayRateNote2'), t('bayRateNote3'), t('bayRateNote4')]
  const monthlyPackageNotes = [t('earlyBirdNote')]

  // Featured-row predicates — driven by the `featured` field on the row
  // (set in data/pricing.ts), not by string-matching on `name` or `timeSlot`.
  // This way marketing can rename a package or retranslate a time-slot
  // without silently breaking the badge wiring.
  const packageBadge = (row: MonthlyPackageRow) => {
    if (row.featured === 'bestValue') return { label: tCommon('badgeBestValue'), tone: 'gold' as const }
    if (row.featured === 'trending') return { label: tCommon('badgeTrending'), tone: 'green' as const }
    return null
  }
  const bayRateBadge = (row: BayRateRow) =>
    row.featured === 'promo' ? { label: tCommon('badgePromo'), tone: 'amber' as const } : null

  const pricingJsonLd = getGolfPricingJsonLd(bayRates, monthlyPackages)
  const faqJsonLd = getFaqPageJsonLd(faqItems)
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Bay Rates', url: `${SITE_URL}/golf/` },
  ])

  const stats = [
    { stat: t('stat1Value'), label: t('stat1Label') },
    { stat: t('stat2Value'), label: t('stat2Label') },
    { stat: t('stat3Value'), label: t('stat3Label') },
    { stat: t('stat4Value'), label: t('stat4Label') },
  ]

  const waysToPlay = [
    { title: t('way1Title'), description: t('way1Description'), image: storageUrl('golf/driving-range.png') },
    { title: t('way2Title'), description: t('way2Description'), image: storageUrl('golf/course-play.png') },
    { title: t('way3Title'), description: t('way3Description'), image: storageUrl('golf/games-competitions.png') },
  ]

  const ourSetup = [
    { title: t('setup1Title'), subtitle: t('setup1Subtitle'), description: t('setup1Description'), image: storageUrl('golf/setup-auto-tee.png') },
    { title: t('setup2Title'), subtitle: t('setup2Subtitle'), description: t('setup2Description'), image: storageUrl('golf/setup-simulator.jpg') },
    { title: t('setup3Title'), subtitle: t('setup3Subtitle'), description: t('setup3Description'), image: storageUrl('golf/setup-putting-green.png') },
  ]

  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* ── Hero ── */}
      <section className="relative flex h-[50vh] min-h-[400px] max-h-[550px] items-center text-white overflow-hidden">
        <Image src={storageUrl('golf/hero-golf.jpg')} alt="LENGOLF simulator bay" fill className="object-cover object-center" priority />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,90,50,0.55) 0%, rgba(0,122,69,0.45) 40%, rgba(0,90,50,0.3) 100%)' }} />
        <div className="relative z-10 w-full text-left" style={{ paddingLeft: '4%', paddingRight: '4%' }}>
          <span className="inline-block rounded px-6 py-2 text-lg font-bold uppercase tracking-widest text-white mb-5 md:text-xl" style={{ backgroundColor: '#7CB342' }}>
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

      {/* ── Intro + CTA Buttons ── */}
      <SectionWrapper>
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            {t('introText', { name: 'LENGOLF' })}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-4">
                <div className="text-2xl font-bold" style={{ color: '#007429' }}>{item.stat}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <AqiWidget />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <BookingCTA />
            <a href="#bayrate" className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-8 text-sm font-semibold text-white transition-colors hover:bg-primary-light">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
              {t('ratesButton')}
            </a>
          </div>
        </div>
      </SectionWrapper>

      {/* ── Our Rates + Monthly Packages ── */}
      <section id="bayrate" className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding space-y-16 lg:space-y-24">
          {/* Bay Rates */}
          <div>
            <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
              <span style={{ color: '#007429' }}>{t('ourRatesTitle')}</span>{' '}
              <span className="text-foreground">{t('ourRatesTitleSuffix')}</span>
            </h2>
            <div className="mx-auto max-w-3xl">
              <PricingTable<BayRateRow>
                caption={t('srBayRatesCaption')}
                rowKey={(row) => row.timeSlot}
                columns={[
                  { key: 'timeSlot', label: t('srTimeSlot'), primary: true, tdClassName: 'whitespace-nowrap' },
                  { key: 'weekday', label: t('srWeekday'), align: 'right', emphasis: true },
                  { key: 'weekend', label: t('srWeekend'), align: 'right', emphasis: true },
                ]}
                rows={translatedBayRates}
                notes={bayRateNotes}
                badgeFor={bayRateBadge}
              />
            </div>
          </div>

          {/* Monthly Packages */}
          <div>
            <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
              <span style={{ color: '#007429' }}>{t('monthlyPackagesTitle')}</span>{' '}
              <span className="text-foreground">{t('monthlyPackagesTitleSuffix')}</span>
            </h2>
            <div className="mx-auto max-w-4xl">
              <PricingTable<MonthlyPackageRow>
                caption={t('srPackagesCaption')}
                rowKey={(row) => row.name}
                columns={[
                  { key: 'name', label: t('srPackage'), primary: true },
                  { key: 'hours', label: t('srHours') },
                  { key: 'validity', label: t('srValidity') },
                  { key: 'perks', label: t('srPerks') },
                  { key: 'price', label: t('srPrice'), align: 'right', emphasis: true },
                ]}
                rows={translatedMonthlyPackages}
                notes={monthlyPackageNotes}
                badgeFor={packageBadge}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Book Now CTA ── */}
      <section className="py-12 lg:py-16 bg-primary">
        <div className="section-max-width section-padding text-center">
          <h2 className="mb-3 text-2xl font-bold text-white lg:text-3xl">{tCommon('readyToPlay')}</h2>
          <p className="mb-6 text-white/80">{tCommon('readyToPlaySubtitle')}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <BookingCTA text={tCommon('bookYourBay')} className="bg-white text-primary hover:bg-white/90" />
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

      {/* ── Our Promotion ── */}
      <SectionWrapper>
        <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
          <span style={{ color: '#007429' }}>{t('promotionsTitle')}</span>{' '}
          <span className="text-foreground">{t('promotionsTitleSuffix')}</span>
        </h2>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
          {gridPromotions.map((promo) => (
            <div key={promo.id} className="overflow-hidden rounded-lg shadow-sm">
              <ClickableImage src={promo.image_url} alt={promo.title_en} width={600} height={600} className="w-full" sizes="(max-width: 640px) 100vw, 50vw" />
            </div>
          ))}
        </div>
        <div className="sr-only">
          <h3>Current Promotions at LENGOLF</h3>
          <ul>
            {gridPromotions.map((promo) => (
              <li key={promo.id}>{promo.title_en}: {promo.description_en}</li>
            ))}
          </ul>
        </div>
      </SectionWrapper>

      {/* ── Ways To Play ── */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <h2 className="mb-14 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('waysToPlayTitle')}</span>{' '}
            <span className="text-foreground">{t('waysToPlayTitleSuffix')}</span>
          </h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {waysToPlay.map((item) => (
              <div key={item.title} className="text-center">
                <div className="mb-6 overflow-hidden rounded-lg">
                  <Image src={item.image} alt={item.title} width={420} height={520} className="w-full aspect-[4/5] object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <h3 className="mb-3 text-xl font-bold italic" style={{ color: '#007429' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Setup ── */}
      <SectionWrapper>
        <h2 className="mb-14 text-center text-3xl font-bold italic lg:text-4xl">
          <span style={{ color: '#007429' }}>{t('ourSetupTitle')}</span>{' '}
          <span className="text-foreground">{t('ourSetupTitleSuffix')}</span>
        </h2>
        <div className="mx-auto max-w-4xl space-y-8">
          {ourSetup.map((item, i) => (
            <div key={item.title} className={`flex flex-col overflow-hidden rounded-xl bg-muted/40 md:flex-row md:items-stretch ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="md:w-2/5 shrink-0">
                <Image src={item.image} alt={item.title} width={480} height={320} className="h-52 w-full object-cover md:h-full" sizes="(max-width: 768px) 100vw, 40vw" />
              </div>
              <div className="flex flex-col justify-center p-6 md:p-8">
                <h3 className="mb-1 text-xl font-bold" style={{ color: '#007429' }}>{item.title}</h3>
                <p className="mb-3 text-sm font-medium text-muted-foreground/70">{item.subtitle}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ── Choose Your Bay ── */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <h2 className="mb-4 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('chooseYourBayTitle')}</span>{' '}
            <span className="text-foreground">{t('chooseYourBayTitleSuffix')}</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-sm text-muted-foreground">
            {t('chooseYourBaySubtitle')}
          </p>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Social Bays */}
            <div className="flex flex-col overflow-hidden rounded-xl border border-primary/15 bg-white shadow-sm">
              <div className="relative">
                <Image src={storageUrl('golf/bay-social.jpg')} alt="Social Bays at LENGOLF" width={600} height={400} className="aspect-[3/2] w-full object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold" style={{ color: '#007429' }}>{t('socialBaysCount')}</span>
                </div>
                <h3 className="mb-1 text-xl font-bold text-foreground">{t('socialBaysTitle')}</h3>
                <p className="mb-5 text-sm text-muted-foreground">{t('socialBaysDescription')}</p>

                <div className="mb-5">
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">{t('idealFor')}</h4>
                  <ul className="space-y-1.5">
                    {[t('socialIdeal1'), t('socialIdeal2'), t('socialIdeal3'), t('socialIdeal4')].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007429" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">{t('features')}</h4>
                  <ul className="space-y-1.5">
                    {[t('socialFeature1'), t('socialFeature2'), t('socialFeature3'), t('socialFeature4')].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#007429" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <BookingCTA className="w-full justify-center" />
                </div>
              </div>
            </div>

            {/* LENGOLF AI Lab */}
            <div className="flex flex-col overflow-hidden rounded-xl border shadow-sm" style={{ borderColor: 'rgba(124, 58, 237, 0.15)' }}>
              <div className="relative">
                <Image src={storageUrl('golf/bay-ai-lab.jpg')} alt="LENGOLF AI Lab" width={600} height={400} className="aspect-[3/2] w-full object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>

              <div className="flex items-center gap-3 border-b px-5 py-3" style={{ borderColor: 'rgba(124, 58, 237, 0.1)', backgroundColor: 'rgba(124, 58, 237, 0.03)' }}>
                <Image src={storageUrl('branding/uneekor-logo.png')} alt="Uneekor logo" width={90} height={24} className="h-6 w-auto shrink-0" />
                <div className="h-5 w-px bg-border/60 shrink-0" />
                <p className="text-[11px] leading-snug text-muted-foreground">{t('aiLabPoweredBy')}</p>
              </div>

              <div className="flex flex-1 flex-col p-6" style={{ backgroundColor: 'white' }}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED' }}>{t('aiLabCount')}</span>
                  <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: '#7C3AED' }}>{t('aiLabNew')}</span>
                </div>
                <h3 className="mb-1 text-xl font-bold text-foreground">{t('aiLabTitle')}</h3>
                <p className="mb-5 text-sm text-muted-foreground">{t('aiLabDescription')}</p>

                <div className="mb-5">
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">{t('idealFor')}</h4>
                  <ul className="space-y-1.5">
                    {[t('aiIdeal1'), t('aiIdeal2'), t('aiIdeal3'), t('aiIdeal4')].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">{t('features')}</h4>
                  <ul className="space-y-1.5">
                    {[t('aiFeature1'), t('aiFeature2'), t('aiFeature3'), t('aiFeature4')].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <a
                    href="https://booking.len.golf/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md px-8 text-sm font-semibold text-white transition-colors hover:opacity-90"
                    style={{ backgroundColor: '#7C3AED' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    {t('bookAiLab')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Club Rental Cross-Link ── */}
      <section className="py-16 lg:py-24">
        <div className="section-max-width section-padding">
          <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('clubRentalTitle')}</span>{' '}
            <span className="text-foreground">{t('clubRentalTitleSuffix')}</span>
          </h2>
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm md:flex-row md:items-stretch">
              <div className="md:w-2/5 shrink-0">
                <Image src={storageUrl('venue/venue-simulator-01.jpg')} alt="Premium golf club rental at LENGOLF" width={480} height={320} className="h-52 w-full object-cover md:h-full" sizes="(max-width: 768px) 100vw, 40vw" />
              </div>
              <div className="flex flex-col justify-center p-6 md:p-8">
                <h3 className="mb-3 text-xl font-bold" style={{ color: '#007429' }}>{t('clubRentalHeading')}</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{t('clubRentalText')}</p>
                <Link href="/golf-club-rental" className="inline-flex items-center gap-1 text-sm font-semibold transition-colors hover:underline" style={{ color: '#007429' }}>
                  {t('viewClubRental')}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FaqSection items={faqItems} links={faqLinks} title={t('faqTitle')} titleSuffix={t('faqTitleSuffix')} />

      {/* ── Course rental crosslink ──
          Routes traveler intent (esp. JA/KO/ZH searchers landing here on
          simulator/driving-range queries) into the paid course rental
          funnel. Same component the location templates render (PR #41). */}
      <CourseRentalCrossLink />

      {/* ── Indoor Golf Near You ── */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <h2 className="mb-3 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('nearYouTitle')}</span>{' '}
            <span className="text-foreground">{t('nearYouTitleSuffix')}</span>
          </h2>
          <p className="mb-8 text-center text-sm text-muted-foreground">{t('nearYouSubtitle')}</p>
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {locationLinks.map((loc) => (
                <Link
                  key={loc.name}
                  href={loc.href}
                  className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-[#007429] transition-colors hover:bg-primary hover:text-white"
                >
                  {loc.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Guides ── */}
      <section className="py-16 lg:py-24">
        <div className="section-max-width section-padding">
          <h2 className="mb-3 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>Planning</span>{' '}
            <span className="text-foreground">your visit?</span>
          </h2>
          <p className="mb-8 text-center text-sm text-muted-foreground">Guides and answers to help you get the most out of LENGOLF.</p>
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { label: 'How Much Does Indoor Golf Cost?', href: '/cost/how-much-does-golf-cost-bangkok' },
                { label: 'Golf Simulator Prices Compared', href: '/cost/golf-simulator-prices-bangkok' },
                { label: 'LENGOLF Pricing Guide', href: '/cost/lengolf-pricing-guide' },
                { label: 'Do I Need Experience?', href: '/faq/do-i-need-experience-to-play-golf-simulator' },
                { label: 'How Long Does a Round Take?', href: '/faq/how-long-does-simulator-golf-take' },
                { label: 'Food & Drinks Menu', href: '/menu/' },
                { label: 'Things To Do in Bangkok', href: '/activities/' },
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
