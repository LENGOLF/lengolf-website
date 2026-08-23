import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { MapPin, Car, TrainFront } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import SectionWrapper from '@/components/shared/SectionWrapper'
import BookingCTA from '@/components/shared/BookingCTA'
import { renderFaqAnswer } from '@/components/shared/FaqSection'
import { BUSINESS_INFO, SOCIAL_LINKS } from '@/lib/constants'
import { getAlternates, getCanonical, OG_LOCALES, type Locale } from '@/lib/translated-routes'
import { getFaqPageJsonLd, getBreadcrumbJsonLd } from '@/lib/jsonld'
import { getSeoPagesByType } from '@/lib/seo-pages'
import { getFaqHubContent, type FaqHubQa } from '@/data/faq-hub'
import type { FaqSeoPage } from '@/types/seo-pages'
import { siteOpenGraph } from '@/lib/open-graph'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const c = getFaqHubContent(locale)
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: {
      canonical: getCanonical(locale, '/faq/'),
      languages: getAlternates('/faq/'),
    },
    openGraph: siteOpenGraph({
      title: c.metaTitle,
      description: c.metaDescription,
      url: getCanonical(locale, '/faq/'),
      type: 'website',
      locale: OG_LOCALES[locale as Locale] ?? OG_LOCALES.en,
    }),
  }
}

/**
 * Quick-answer Q&As with the BTS-directions question spliced in before the
 * last two items (parking, experience) — one source (directions.steps) feeds
 * the visible step list, this FAQ answer, and the FAQPage JSON-LD.
 */
function buildFaqItems(c: ReturnType<typeof getFaqHubContent>): FaqHubQa[] {
  const items = [...c.quickFaqs]
  items.splice(items.length - 2, 0, {
    question: c.directions.faqQuestion,
    answer: c.directions.steps.join(' '),
  })
  return items
}

export default async function FaqHubPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const c = getFaqHubContent(locale)
  const faqItems = buildFaqItems(c)

  // Browse index: every published per-question FAQ page in this locale,
  // grouped into the content buckets (unknown categories → catchAll bucket).
  const faqPages = (await getSeoPagesByType('faq', locale)) as FaqSeoPage[]
  const catchAll = c.browseBuckets.find((b) => b.catchAll)
  const buckets = c.browseBuckets.map((bucket) => ({
    label: bucket.label,
    pages: faqPages.filter((p) => {
      const category = p.category ?? ''
      if (bucket.categories.includes(category)) return true
      return bucket === catchAll && !c.browseBuckets.some((b) => b.categories.includes(category))
    }),
  }))

  const faqJsonLd = getFaqPageJsonLd(faqItems)
  // Locale-aware URLs. Emitting the bare EN `/faq/` URL from /ja/faq/ made the
  // BreadcrumbList's own terminal item point at a DIFFERENT page in a
  // different language than the canonical two lines above — contradictory
  // structured data. '/' and '/faq' are registered for every locale
  // (lib/translated-routes.ts), so neither crumb can emit a redirecting URL
  // and neither needs getResolvedCanonical (which the /golf-courses crumb
  // builders do need, their hub being translated for only some locales).
  // Crumb display names are still EN; localizing them needs new
  // FaqHubContent fields in all five blocks.
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: getCanonical(locale, '/') },
    { name: 'FAQ', url: getCanonical(locale, '/faq/') },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* ── Hero ── */}
      <section
        className="relative flex min-h-[320px] items-center py-16 text-white"
        style={{ background: 'linear-gradient(135deg, #004025 0%, #005a32 100%)' }}
      >
        <div className="section-max-width section-padding w-full">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-[#c8a96e]">{c.heroBadge}</p>
          <h1 className="mb-4 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">{c.heroTitle}</h1>
          <p className="max-w-2xl text-base text-white/85 md:text-lg">{c.heroSubtitle}</p>
        </div>
      </section>

      {/* ── Entity statement + stats ── */}
      <SectionWrapper>
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{c.entityStatement}</p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {c.stats.map((item) => (
              <div key={item.label} className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-4">
                <div className="text-xl font-bold sm:text-2xl" style={{ color: '#007429' }}>{item.stat}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ── Quick answers — always visible (crawlable), not an accordion ── */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{c.faqTitle}</span>{' '}
            <span className="text-foreground">{c.faqTitleSuffix}</span>
          </h2>
          <div className="mx-auto max-w-3xl space-y-4">
            {faqItems.map((item) => (
              <div key={item.question} className="rounded-xl border border-primary/10 bg-white p-6 shadow-sm md:p-7">
                <h3 className="mb-2 text-lg font-semibold" style={{ color: '#007429' }}>{item.question}</h3>
                <p className="leading-relaxed text-muted-foreground">
                  {renderFaqAnswer(item.answer, c.faqLinks)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Directions from BTS Chidlom ── */}
      <SectionWrapper>
        <h2 className="mb-3 text-center text-3xl font-bold italic lg:text-4xl">
          <span style={{ color: '#007429' }}>{c.directions.title}</span>{' '}
          <span className="text-foreground">{c.directions.titleSuffix}</span>
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-muted-foreground">{c.directions.intro}</p>

        <div className="mx-auto max-w-3xl">
          <ol className="space-y-4">
            {c.directions.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-4 rounded-xl border border-primary/10 bg-primary/5 p-5">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: '#007429' }}
                >
                  {i + 1}
                </span>
                <span className="leading-relaxed text-foreground">{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/40 p-5">
              <TrainFront className="mt-0.5 h-5 w-5 shrink-0" style={{ color: '#007429' }} />
              <p className="text-sm leading-relaxed text-muted-foreground">{c.directions.grabTip}</p>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/40 p-5">
              <Car className="mt-0.5 h-5 w-5 shrink-0" style={{ color: '#007429' }} />
              <p className="text-sm leading-relaxed text-muted-foreground">{c.directions.parkingTip}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-muted-foreground">{BUSINESS_INFO.address}</p>
            <a
              href={BUSINESS_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-8 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              <MapPin className="h-4 w-4" />
              {c.directions.mapCta}
            </a>
          </div>
        </div>
      </SectionWrapper>

      {/* ── CTA band ── */}
      <section className="bg-primary py-12 lg:py-16">
        <div className="section-max-width section-padding text-center">
          <h2 className="mb-3 text-2xl font-bold text-white lg:text-3xl">{c.ctaTitle}</h2>
          <p className="mb-6 text-white/80">{c.ctaSubtitle}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <BookingCTA className="bg-white text-primary hover:bg-white/90" />
            <a
              href={SOCIAL_LINKS.line}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-md border-2 border-white px-8 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              LINE @lengolf
            </a>
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="inline-flex h-12 items-center gap-2 rounded-md border-2 border-white px-8 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {BUSINESS_INFO.phone}
            </a>
          </div>
        </div>
      </section>

      {/* ── Browse all per-question FAQ pages ── */}
      <SectionWrapper>
        <h2 className="mb-3 text-center text-3xl font-bold italic lg:text-4xl">
          <span style={{ color: '#007429' }}>{c.browseTitle}</span>{' '}
          <span className="text-foreground">{c.browseTitleSuffix}</span>
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-muted-foreground">{c.browseSubtitle}</p>
        <div className="mx-auto max-w-5xl space-y-10">
          {buckets
            .filter((bucket) => bucket.pages.length > 0)
            .map((bucket) => (
              <div key={bucket.label}>
                <h3 className="mb-4 text-lg font-semibold text-foreground">{bucket.label}</h3>
                <div className="flex flex-wrap gap-3">
                  {bucket.pages.map((page) => (
                    <Link
                      key={page.slug}
                      href={`/faq/${page.slug}` as Parameters<typeof Link>[0]['href']}
                      className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium transition-colors hover:bg-primary hover:text-white"
                      style={{ color: '#007429' }}
                    >
                      {page.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </SectionWrapper>
    </>
  )
}
