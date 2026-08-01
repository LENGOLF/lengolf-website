import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { getCoursesByRegion, REGION_META } from '@/lib/golf-courses'
import type { Region } from '@/lib/golf-courses'
import { SITE_URL } from '@/lib/constants'
import { getAlternates, getCanonical, getResolvedCanonical } from '@/lib/translated-routes'
import { getRegionHubTranslation, getTranslatedRegionHubParams } from '@/data/golf-courses-i18n'
import { getBreadcrumbJsonLd } from '@/lib/jsonld'
import { ArrowRight } from 'lucide-react'
import CourseMapExplorer from '@/components/golf-courses/CourseMapExplorer'
import CrossLinkBlock from '@/components/golf-courses/CrossLinkBlock'
import { comparisonCrossLink, getComparisonPairs } from '@/lib/golf-courses-derived'

interface Props {
  params: Promise<{ locale: string; region: string }>
}

// Regions that also have an editorial "best courses" shortlist guide. The hub
// is the complete directory; the guide is the curated pick. Cross-linking the
// two (hub → guide here, guide → hub via related_slugs) splits search intent so
// they stop competing for the same "<region> golf courses" queries. The slug
// isn't derivable from the region key (note bangkok's is `…-near-bangkok`), so
// it's an explicit map; add a row when a new region gains a shortlist guide.
const GUIDE_BY_REGION: Record<string, string> = {
  bangkok: 'best-golf-courses-near-bangkok',
  phuket: 'best-golf-courses-phuket',
}

// The shortlist cross-link renders EN-only BY DESIGN: the CTA copy below is
// hardcoded English, and these best-of guides have no ja/ko/zh/th translations
// (a translated hub linking an EN guide would 301 and mix languages). To light
// it up for a locale L you must do all three together: (1) translate the guide
// entry (data/explainer-pages.ts, locale L), (2) allowlist it in L.staticRoutes
// (lib/translated-routes.ts), and (3) localize the CTA copy into messages
// (GolfCourseRegion namespace) with native-QA review — then gate on
// hasTranslationForLocale(L, `/guide/${slug}`) here instead of locale === 'en'.
function shortlistGuideForRegion(locale: string, region: string): string | null {
  if (locale !== 'en') return null
  return GUIDE_BY_REGION[region] ?? null
}

export async function generateStaticParams() {
  // EN builds every region; other locales build only regions with a published
  // translation (untranslated locale URLs 301 to English via the middleware).
  return [
    ...Object.keys(REGION_META).map((region) => ({ locale: 'en', region })),
    ...getTranslatedRegionHubParams(),
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, region } = await params
  const meta = REGION_META[region as Region]
  if (!meta) return { title: 'Region Not Found' }

  const t = await getTranslations({ locale, namespace: 'GolfCourseRegion' })
  const label = getRegionHubTranslation(region, locale)?.label ?? meta.label
  const path = `/golf-courses/${region}/`
  const title = t('metaTitle', { label })
  const description = t('metaDescription', { count: meta.courseCount, label })
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
    openGraph: { title, description, url: canonical, type: 'website' },
  }
}

export default async function RegionIndexPage({ params }: Props) {
  const { locale, region } = await params
  setRequestLocale(locale)

  const meta = REGION_META[region as Region]
  if (!meta) notFound()

  const courses = await getCoursesByRegion(region)
  if (courses.length === 0) notFound()

  const center = meta.center

  const t = await getTranslations('GolfCourseRegion')
  const tr = getRegionHubTranslation(region, locale)
  const label = tr?.label ?? meta.label
  const province = tr?.province ?? meta.province
  const description = tr?.description ?? meta.description
  const shortlistGuide = shortlistGuideForRegion(locale, region)

  // Head-to-head comparison pages for this region. The region hub is their
  // natural parent, and without these anchors the 31 compare pages' only
  // inbound links were from the two top-3 course pages in each pair.
  // EN-only like the trip-planning block below (compare pages have no
  // translations; a localized hub linking them would 301 and mix languages).
  // Built inside the EN gate: the 20 translated hub variants render no
  // comparison block, so they shouldn't pay for the lookup map either.
  const comparisonItems =
    locale === 'en'
      ? await (async () => {
          const pairs = (await getComparisonPairs()).filter((p) => p.region === region)
          const nameBySlug: Record<string, string> = Object.fromEntries(
            courses.map((c) => [c.slug, c.name])
          )
          return pairs.map((p) => comparisonCrossLink(p, nameBySlug))
        })()
      : []

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    // The /golf-courses/ hub is translated for some locales: point the crumb
    // at the locale's own hub where a translation exists, and at the
    // canonical EN hub otherwise (untranslated hub URLs 301 to English —
    // don't emit redirecting URLs in JSON-LD). Crumb display names are
    // localized either way.
    { name: 'Home', url: `${SITE_URL}/` },
    {
      name: t('breadcrumbGolfCourses'),
      url: getResolvedCanonical(locale, '/golf-courses/'),
    },
    { name: label, url: getCanonical(locale, `/golf-courses/${region}/`) },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#003d22]">
        {/* Grain texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
          }}
        />

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#005a32]/60 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#007a45]/30 blur-2xl" />
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-[#c8a96e]/5 blur-2xl" />
        </div>

        {/* Thin diagonal rule — luxury editorial accent */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.06]"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'repeating-linear-gradient(135deg, #c8a96e 0px, #c8a96e 1px, transparent 1px, transparent 60px)',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-medium tracking-wider text-white/40">
            <Link href="/golf-courses" className="uppercase transition-colors hover:text-white/70">{t('breadcrumbGolfCourses')}</Link>
            <span className="opacity-40">/</span>
            <span className="uppercase text-white/60">{label}</span>
          </nav>

          <div className="max-w-xl">
            {/* Eyebrow */}
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#c8a96e]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c8a96e]">
                {province}
              </span>
            </div>

            <h1 className="mb-5 font-sans text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t.rich('heroHeading', {
                label,
                br: () => <br />,
                muted: (chunks) => <span className="text-white/60">{chunks}</span>,
              })}
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-white/60">{description}</p>
            {shortlistGuide && (
              <p className="mt-4 text-sm text-white/50">
                Just want the highlights?{' '}
                <Link
                  href={`/guide/${shortlistGuide}`}
                  className="font-medium text-[#c8a96e] underline-offset-4 hover:underline"
                >
                  See our picks of the best courses in {label}
                </Link>
                .
              </p>
            )}
          </div>
        </div>

      </section>

      {/* ── Map explorer + roster ── */}
      <div className="bg-[#f8faf9] pb-8 pt-0">
        {/* Map card overlaps hero — negative margin pulls it up into the dark section */}
        <div className="mx-auto -mt-12 max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/5">
            <CourseMapExplorer courses={courses} region={region} regionLabel={label} center={center} />
          </div>
        </div>

        {/* ── LENGOLF rental CTA ── */}
        <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-[#003d22] px-6 py-8 sm:px-10">
            {/* Diagonal accent lines */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: 'repeating-linear-gradient(135deg, #c8a96e 0px, #c8a96e 1px, transparent 1px, transparent 40px)',
              }}
            />
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#c8a96e]/10 blur-2xl" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-px w-5 bg-[#c8a96e]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c8a96e]">
                    {t('rentalEyebrow')}
                  </span>
                </div>
                <p className="max-w-md text-base font-medium leading-relaxed text-white/90 sm:text-lg">
                  {t.rich('rentalPitch', {
                    brands: (chunks) => <span className="font-bold text-white">{chunks}</span>,
                    price: (chunks) => <span className="font-bold text-[#c8a96e]">{chunks}</span>,
                  })}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <a
                  href="https://booking.len.golf/course-rental"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#c8a96e] px-6 py-3 text-sm font-bold text-[#1a1a1a] transition-all hover:bg-[#d4b87e] hover:shadow-lg"
                >
                  {t('bookNow')}
                </a>
                <Link
                  href="/golf-course-club-rental"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {t('learnMore')} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Head-to-head comparisons for this region ── */}
        {comparisonItems.length > 0 && (
          <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
            <CrossLinkBlock
              heading={`Compare top ${label} courses`}
              items={comparisonItems}
            />
          </div>
        )}

        {/* ── Plan your Thailand golf trip — trip-planning guide links ──
            EN-only BY DESIGN (like shortlistGuide above): the card copy is
            hardcoded English, and /golf-in-thailand-guide has no translation
            (a translated hub linking it would 301). The three /guide/… targets
            are translated, but the block ships together in one language to
            avoid a mixed-language card grid on the ja/ko/zh/th hubs. */}
        {locale === 'en' && (
          <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#c8a96e]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#005a32]">
                Plan your Thailand golf trip
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  href: '/guide/best-time-play-golf-thailand',
                  label: 'Best time of year to play golf in Thailand',
                  description: 'Month-by-month weather and when to book your rounds.',
                },
                {
                  href: '/guide/how-to-book-golf-tee-times-thailand',
                  label: 'How to book golf tee times in Thailand',
                  description: 'Booking direct, online, or through a concierge.',
                },
                {
                  href: '/guide/thailand-golf-trip-cost',
                  label: 'Thailand golf trip cost',
                  description: 'Green fees, caddies, hotels and transport, broken down.',
                },
                {
                  href: '/golf-in-thailand-guide',
                  label: 'Complete Thailand golf guide',
                  description: 'Everything you need to plan a golf holiday in Thailand.',
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-start justify-between gap-3 rounded-xl border border-black/5 bg-white p-4 shadow-sm transition-all hover:-translate-y-px hover:border-[#005a32]/30 hover:shadow-md"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-snug text-[#1a1a1a] transition-colors group-hover:text-[#005a32]">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#005a32]/40 transition-all group-hover:translate-x-0.5 group-hover:text-[#005a32]" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
