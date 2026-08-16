import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import Image from 'next/image'
import SectionWrapper from '@/components/shared/SectionWrapper'
import ContactInfo from '@/components/shared/ContactInfo'
import ContactForm from '@/components/about/ContactForm'
import BookingCTA from '@/components/shared/BookingCTA'
import { storageUrl, SITE_URL, BUSINESS_INFO, SOCIAL_LINKS } from '@/lib/constants'
import { getAlternates, getCanonical } from '@/lib/translated-routes'
import { getFaqPageJsonLd, getAggregateRatingJsonLd, getBreadcrumbJsonLd } from '@/lib/jsonld'
import { getGoogleReviews, truncateReviewText, type GoogleReview } from '@/lib/google-reviews'
import FaqSection from '@/components/shared/FaqSection'
import { StarIcon, StarRating } from '@/components/shared/StarRating'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'AboutUs' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: getCanonical(locale, '/about-us/'),
      languages: getAlternates('/about-us/'),
    },
    openGraph: { images: [{ url: storageUrl('venue/venue-interior-01.jpg'), alt: 'LENGOLF interior' }] },
  }
}

const faqLinks: Record<string, { href: string; external?: boolean }> = {
  'booking.len.golf': { href: 'https://booking.len.golf/', external: true },
  '@lengolf': { href: 'https://lin.ee/uxQpIXn', external: true },
  'Google Maps': { href: BUSINESS_INFO.googleMapsUrl, external: true },
  'lessons page': { href: '/lessons' },
  'events page': { href: '/events' },
}

function ReviewCard({ review }: { review: GoogleReview }) {
  const initial = review.reviewer_name.charAt(0).toUpperCase()
  const truncated = truncateReviewText(review.text, 180)

  return (
    <div className="rounded-lg border border-border/60 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{review.reviewer_name}</p>
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} />
          </div>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{truncated}</p>
    </div>
  )
}

export const revalidate = 86400

const FAQ_COUNT = 6
const WHY_COUNT = 6

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('AboutUs')
  const tFaq = await getTranslations('AboutUsFaq')
  const tCommon = await getTranslations('Common')

  const faqItems = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    question: tFaq(`q${i + 1}`),
    answer: tFaq(`a${i + 1}`),
  }))

  const faqJsonLd = getFaqPageJsonLd(faqItems)
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: t('heroBadge'), url: `${SITE_URL}/about-us/` },
  ])
  const reviewsData = await getGoogleReviews(locale)

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

      {/* JSON-LD AggregateRating */}
      {reviewsData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getAggregateRatingJsonLd(reviewsData.rating, reviewsData.totalReviews)) }}
        />
      )}

      {/* ── Hero ── */}
      <section className="relative flex h-[50vh] min-h-[400px] max-h-[550px] items-center text-white overflow-hidden">
        <Image
          src={storageUrl('venue/venue-interior-01.jpg')}
          alt="LENGOLF interior"
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
        <div className="relative z-10 w-full text-left px-[4%]">
          <span className="inline-block rounded bg-[#7CB342] px-6 py-2 text-lg font-bold uppercase tracking-widest text-white mb-5 md:text-xl">
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

      {/* ── Our Story + Stat Chips ── */}
      <SectionWrapper>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('storyTitle')}</span>{' '}
            <span className="text-foreground">{t('storyTitleSuffix')}</span>
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>{t('storyParagraph1')}</p>
            <p>
              {t('storyParagraph2', { name: 'LENGOLF' })}
            </p>
          </div>

          {/* Stat Chips */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-4">
                <div className="text-2xl font-bold" style={{ color: '#007429' }}>{t(`stat${i}Value`)}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t(`stat${i}Label`)}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ── Why Choose Us ── */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('whyTitle')}</span>{' '}
            <span className="text-foreground">{t('whyTitleSuffix')}</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: WHY_COUNT }, (_, i) => (
              <div key={i} className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-lg font-semibold text-primary">{t(`why${i + 1}Title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`why${i + 1}Description`)}</p>
              </div>
            ))}
          </div>
          <div className="sr-only">
            <h3>Why Choose LENGOLF — Key Features</h3>
            <ul>
              {Array.from({ length: WHY_COUNT }, (_, i) => (
                <li key={i}>{t(`why${i + 1}Title`)}: {t(`why${i + 1}Description`)}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Google Reviews ── */}
      {reviewsData && reviewsData.reviews.length > 0 && (
        <SectionWrapper>
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-2 text-center text-3xl font-bold italic lg:text-4xl">
              <span style={{ color: '#007429' }}>{t('reviewsTitle')}</span>{' '}
              <span className="text-foreground">{t('reviewsTitleSuffix')}</span>
            </h2>

            {/* Overall rating */}
            <div className="mb-10 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} filled={star <= Math.round(reviewsData.rating)} size="md" />
                  ))}
                </div>
                <span className="text-lg font-bold text-foreground">{reviewsData.rating}</span>
                <span className="text-sm text-muted-foreground">/ 5.0</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('reviewsCount', { count: reviewsData.totalReviews.toLocaleString() })}
              </p>
            </div>

            {/* Review cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {reviewsData.reviews.map((review) => (
                <ReviewCard key={`${review.reviewer_name}-${review.review_created_at}`} review={review} />
              ))}
            </div>

            {/* Link to Google */}
            <div className="mt-8 text-center">
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

      {/* ── CTA Band ── */}
      <section className="py-12 lg:py-16 bg-primary">
        <div className="section-max-width section-padding text-center">
          <h2 className="mb-3 text-2xl font-bold text-white lg:text-3xl">{t('ctaTitle')}</h2>
          <p className="mb-6 text-white/80">{t('ctaSubtitle')}</p>
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

      {/* ── Contact (merged info + form side by side) ── */}
      <SectionWrapper>
        <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
          <span style={{ color: '#007429' }}>{t('contactTitle')}</span>{' '}
          <span className="text-foreground">{t('contactTitleSuffix')}</span>
        </h2>
        <div className="mx-auto max-w-5xl flex flex-col gap-10 lg:flex-row lg:items-start">
          <div className="w-full lg:w-5/12">
            <ContactInfo />
          </div>
          <div className="w-full lg:w-7/12">
            <ContactForm />
          </div>
        </div>
      </SectionWrapper>

      {/* ── FAQ ── */}
      <FaqSection items={faqItems} links={faqLinks} title={t('faqTitle')} titleSuffix={t('faqTitleSuffix')} bgColor="#F6FFFA" />
    </>
  )
}
