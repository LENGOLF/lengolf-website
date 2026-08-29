import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { getAlternates, getCanonical, getResolvedCanonical } from '@/lib/translated-routes'
import { getBreadcrumbJsonLd } from '@/lib/jsonld'
import { getCourseRoundupJsonLd } from '@/lib/jsonld-courses'
import { PRICE_TIERS, getPriceTierTranslation, getTranslatedPriceTierParams } from '@/data/price-tiers'
import { getCoursesUnderPrice, getPriceTierSlugs } from '@/lib/golf-courses-derived'
import { pricesByDayOfWeek, feeHeadings, tierChromeKeys } from '@/lib/course-fees'
import RoundupList from '@/components/golf-courses/RoundupList'
import CrossLinkBlock from '@/components/golf-courses/CrossLinkBlock'
import RentalCtaBanner from '@/components/golf-courses/RentalCtaBanner'
import { siteOpenGraph } from '@/lib/open-graph'

interface Props {
  params: Promise<{ locale: string; tier: string }>
}

export const revalidate = 86400

// Unknown tiers 404 at the routing layer (no on-demand render). An ISR page
// that reaches notFound() on-demand returns 500 on Vercel, not 404.
export const dynamicParams = false

export async function generateStaticParams() {
  // EN builds every tier; other locales build only tiers with a published
  // translation (untranslated locale URLs 301 to English via the middleware).
  return [
    ...getPriceTierSlugs().map((tier) => ({ locale: 'en', tier })),
    ...getTranslatedPriceTierParams(),
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, tier } = await params
  const meta = PRICE_TIERS.find((t) => t.slug === tier)
  if (!meta) return { title: 'Price Tier Not Found' }

  const tr = getPriceTierTranslation(tier, locale)
  const title = tr?.title ?? meta.title
  const amount = meta.thb.toLocaleString('en-US')
  const t = await getTranslations({ locale, namespace: 'GolfCoursePriceTier' })
  // Same roster the page renders, so the meta noun cannot disagree with the H2.
  const description = t(tierChromeKeys(await getCoursesUnderPrice(meta.thb, 12)).meta, { amount })
  const path = `/golf-courses/under/${tier}/`
  const canonical = getCanonical(locale, path)

  // Only emit hreflang when a translation actually exists — a lone
  // self-referential hreflang="en" cluster is audit noise (matches the sitemap).
  const languages = getAlternates(path)

  return {
    title,
    description,
    alternates: {
      canonical,
      ...(Object.keys(languages).length > 1 ? { languages } : {}),
    },
    openGraph: siteOpenGraph({ title, description, url: canonical, type: 'website' }),
  }
}

export default async function CoursesUnderPricePage({ params }: Props) {
  const { locale, tier } = await params
  setRequestLocale(locale)

  const meta = PRICE_TIERS.find((t) => t.slug === tier)
  if (!meta) notFound()

  const courses = await getCoursesUnderPrice(meta.thb, 12)
  if (courses.length === 0) notFound()

  const t = await getTranslations('GolfCoursePriceTier')
  const chrome = tierChromeKeys(courses)
  const tr = getPriceTierTranslation(tier, locale)
  const title = tr?.title ?? meta.title
  const framing = tr?.framing ?? meta.framing
  const catchText = tr?.catch ?? meta.catch
  const amount = meta.thb.toLocaleString('en-US')

  const canonicalUrl = getCanonical(locale, `/golf-courses/under/${tier}/`)
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    // Locale-aware, mirroring the [region] and [region]/[slug] hubs. '/' is
    // registered for every locale, so the home crumb can always take the
    // locale's own URL; the /golf-courses/ hub is translated for only some, so
    // it goes through getResolvedCanonical (an untranslated locale hub URL
    // 301s, and redirecting URLs don't belong in structured data). Emitting
    // the bare EN URLs here contradicted this page's own localized canonical.
    { name: 'Home', url: getCanonical(locale, '/') },
    { name: t('breadcrumbGolfCourses'), url: getResolvedCanonical(locale, '/golf-courses/') },
    { name: title, url: canonicalUrl },
  ])
  // This is the only roundup route that SSGs non-EN locales, so it was the only
  // one emitting an English `Offer.description` ("Weekday green fee") on
  // ja/ko/zh/th pages. The fee-basis labels live in GolfCourseDetail, hence a
  // second translator alongside this page's own GolfCoursePriceTier one.
  const tDetail = await getTranslations('GolfCourseDetail')
  const listJsonLd = getCourseRoundupJsonLd(courses, canonicalUrl, title, (c) =>
    feeHeadings(c, tDetail)
  )

  const otherTiers = PRICE_TIERS.filter((pt) => pt.slug !== tier)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#003d22]">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#005a32]/50" />
          <div className="absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-[#007a45]/25" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/50">
            <Link href="/golf-courses" className="transition-colors hover:text-white/80">{t('breadcrumbGolfCourses')}</Link>
            <span>/</span>
            <span className="text-white/70">{t('breadcrumbCurrent', { amount })}</span>
          </nav>
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
            {t(chrome.eyebrow, { amount })}
          </div>
          <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/75">
            {framing}
          </p>
        </div>
        <div className="absolute -bottom-px left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 40V0c240 26.7 480 40 720 40S1200 26.7 1440 0v40H0z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
        {/* What's the catch */}
        <section className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: '#b8892e' }}>
            {t('catchHeading')}
          </h2>
          <p className="text-sm leading-relaxed text-foreground/85">{catchText}</p>
        </section>

        <section>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">
            {t(chrome.heading, { count: courses.length, amount })}
          </h2>
          <RoundupList
            items={courses.map((c) => ({
              course: c,
              reason:
                c.green_fee_weekday_thb !== null
                  ? t(
                      // A seasonal course's lower fee is its low-season rate, not a
                      // weekday one — the tier roster is indexed, so the basis has
                      // to match the course. See lib/course-fees.ts.
                      pricesByDayOfWeek(c) ? 'roundupReason' : 'roundupReasonSeasonal',
                      { price: c.green_fee_weekday_thb.toLocaleString('en-US') }
                    )
                  : '',
            }))}
          />
        </section>

        {/* Default copy comes from GolfCourseShared (localized inside the
            component) — no per-page override needed. */}
        <RentalCtaBanner />

        <CrossLinkBlock
          heading={t('otherPriceBands')}
          items={otherTiers.map((ot) => ({
            label: t('breadcrumbCurrent', { amount: ot.thb.toLocaleString('en-US') }),
            href: `/golf-courses/under/${ot.slug}`,
          }))}
        />
      </div>
    </>
  )
}
