import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import SectionWrapper from '@/components/shared/SectionWrapper'
import FaqSection from '@/components/shared/FaqSection'
import { storageUrl, SITE_URL, SOCIAL_LINKS } from '@/lib/constants'
import { getAlternates, getCanonical } from '@/lib/translated-routes'
import { getUsedClubsListJsonLd, getFaqPageJsonLd, getBreadcrumbJsonLd } from '@/lib/jsonld'
import { getAvailableUsedClubs } from '@/lib/clubs'
import UsedClubsGrid from '@/components/clubs/UsedClubsGrid'
import type { GridLabels } from '@/components/clubs/UsedClubsGrid'
import { MessageCircle, MapPin, Camera, Search, Shield } from 'lucide-react'
import { siteOpenGraph } from '@/lib/open-graph'

export const revalidate = 86400

const faqLinks: Record<string, { href: string; external?: boolean }> = {
  '@lengolf': { href: SOCIAL_LINKS.line, external: true },
  'LINE @lengolf': { href: SOCIAL_LINKS.line, external: true },
}

const FAQ_COUNT = 5

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'SecondHandClubs' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: getCanonical(locale, '/second-hand-golf-clubs-bangkok/'),
      languages: getAlternates('/second-hand-golf-clubs-bangkok/'),
    },
    openGraph: siteOpenGraph({ images: [{ url: storageUrl('venue/venue-simulator-01.jpg'), alt: 'Second-hand golf clubs Bangkok' }] }),
    robots: { index: false, follow: false },
  }
}

export default async function SecondHandGolfClubsBangkokPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const [t, tFaq, clubs] = await Promise.all([
    getTranslations('SecondHandClubs'),
    getTranslations('SecondHandClubsFaq'),
    getAvailableUsedClubs(),
  ])

  const faqItems = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    question: tFaq(`q${i + 1}`),
    answer: tFaq(`a${i + 1}`),
  }))

  const listJsonLd = getUsedClubsListJsonLd(clubs)
  const faqJsonLd = getFaqPageJsonLd(faqItems)
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Club Rental', url: `${SITE_URL}/golf-club-rental/` },
    { name: t('metaTitle'), url: `${SITE_URL}/second-hand-golf-clubs-bangkok/` },
  ])

  const lineUrl = `https://line.me/R/oaMessage/%40lengolf/?${encodeURIComponent('Hi LENGOLF! I\'m interested in your second-hand golf clubs. What sets do you have available?')}`

  const gridLabels: GridLabels = {
    enquireButton: t('enquireButton'),
    conditionExcellent: t('conditionExcellent'),
    conditionGood: t('conditionGood'),
    conditionFair: t('conditionFair'),
    sortLabel: t('sortLabel'),
    sortNewest: t('sortNewest'),
    sortPriceLow: t('sortPriceLow'),
    sortPriceHigh: t('sortPriceHigh'),
    sortBrand: t('sortBrand'),
    filterType: t('filterType'),
    filterBrand: t('filterBrand'),
    filterGender: t('filterGender'),
    filterCondition: t('filterCondition'),
    clearAll: t('clearAll'),
    showingCount: t('showingCount'),
    filtersLabel: t('filtersLabel'),
    noResults: t('noResults'),
    emptyStateTitle: t('emptyStateTitle'),
    emptyStateText: t('emptyStateText'),
    emptyStateCta: t('emptyStateCta'),
  }

  const trustSignals = [
    { icon: Camera, label: t('trustTitle1') },
    { icon: Search, label: t('trustTitle2') },
    { icon: Shield, label: t('trustTitle3') },
    { icon: MessageCircle, label: t('trustTitle4') },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── Compact Header (no hero) ── */}
      <section className="pt-6 pb-4 lg:pt-14 lg:pb-8" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-black uppercase leading-tight sm:text-3xl lg:text-5xl">
              <span style={{ color: '#007429' }}>{t('heroTitle')}</span>
            </h1>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {trustSignals.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1 rounded-full border border-primary/15 bg-white px-2 py-1 text-[10px] sm:text-xs sm:px-3 sm:py-1.5 sm:gap-1.5 font-medium text-muted-foreground"
                >
                  <Icon size={11} className="sm:w-[13px] sm:h-[13px]" style={{ color: '#007429' }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base hidden sm:block">
            {t('introText')}
          </p>
        </div>
      </section>

      {/* ── Inventory Grid ── */}
      <section className="py-6 lg:py-14" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <UsedClubsGrid clubs={clubs} labels={gridLabels} />
        </div>
      </section>

      {/* ── Test Before You Buy ── */}
      <SectionWrapper>
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col overflow-hidden rounded-xl bg-primary/5 border border-primary/15 md:flex-row md:items-stretch">
            <div className="flex flex-col justify-center p-8 md:p-10 flex-1">
              <h2 className="mb-4 text-2xl font-bold italic lg:text-3xl">
                <span style={{ color: '#007429' }}>{t('testTitle')}</span>{' '}
                <span className="text-foreground">{t('testTitleSuffix')}</span>
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {t('testText')}
              </p>
              <div className="mt-6">
                <a
                  href={lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#00B900' }}
                >
                  <MessageCircle size={15} />
                  {t('ctaLineButton')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── FAQ ── */}
      <FaqSection items={faqItems} links={faqLinks} title={t('faqTitle')} titleSuffix={t('faqTitleSuffix')} bgColor="#F6FFFA" />

      {/* ── CTA Band ── */}
      <section className="py-12 lg:py-16 bg-primary">
        <div className="section-max-width section-padding text-center">
          <h2 className="mb-3 text-2xl font-bold text-white lg:text-3xl">{t('ctaTitle')}</h2>
          <p className="mb-6 text-white/80">{t('ctaSubtitle')}</p>
          <a
            href={lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-md bg-white px-8 text-sm font-semibold transition-colors hover:bg-white/90"
            style={{ color: '#007429' }}
          >
            <MessageCircle size={16} />
            {t('ctaLineButton')}
          </a>
        </div>
      </section>

      {/* ── Cross-links ── */}
      <SectionWrapper>
        <h2 className="mb-3 text-center text-3xl font-bold italic lg:text-4xl">
          <span style={{ color: '#007429' }}>{t('crossLinksTitle')}</span>{' '}
          <span className="text-foreground">{t('crossLinksTitleSuffix')}</span>
        </h2>
        <div className="mx-auto mt-8 max-w-3xl grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/golf-club-rental"
            className="group rounded-xl border border-primary/15 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10" style={{ color: '#007429' }}>
              <MapPin size={20} />
            </div>
            <h3 className="mb-1 font-bold text-foreground group-hover:text-primary transition-colors">{t('crossLink1Label')}</h3>
            <p className="text-sm text-muted-foreground">{t('crossLink1Desc')}</p>
          </Link>
          <Link
            href="/golf-course-club-rental"
            className="group rounded-xl border border-primary/15 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10" style={{ color: '#007429' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
            </div>
            <h3 className="mb-1 font-bold text-foreground group-hover:text-primary transition-colors">{t('crossLink2Label')}</h3>
            <p className="text-sm text-muted-foreground">{t('crossLink2Desc')}</p>
          </Link>
        </div>
      </SectionWrapper>
    </>
  )
}
