import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { SITE_URL } from '@/lib/constants'
import { REGION_META, getCoursesByRegion } from '@/lib/golf-courses'
import { getAlternates, getCanonical, hasTranslationForLocale, courseDetailHref, ALL_LOCALES } from '@/lib/translated-routes'
import { getRegionHubTranslation } from '@/data/golf-courses-i18n'
import { getBreadcrumbJsonLd } from '@/lib/jsonld'
import { MapPin, ArrowRight, Flag, Scale, Train, Wallet, Target, Plane } from 'lucide-react'
import HubMapExplorer from '@/components/golf-courses/HubMapExplorer'
import { BTS_STATIONS } from '@/data/bts-stations'
import { AIRPORTS } from '@/data/airports'
import { PRICE_TIERS } from '@/data/price-tiers'
import { USE_CASES } from '@/data/golf-courses-use-cases'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  // EN always builds; every other locale builds if and only if it has a
  // published hub translation (GolfCourseHub namespace + '/golf-courses' in
  // that locale's staticRoutes) — derived from the registry so the two lists
  // cannot drift. Unregistered locales' /golf-courses/ URLs 301 to English
  // via the middleware allowlist (lib/translated-routes.ts), mirroring the
  // [region] sibling.
  return [
    { locale: 'en' },
    ...ALL_LOCALES.filter(
      (locale) => locale !== 'en' && hasTranslationForLocale(locale, '/golf-courses')
    ).map((locale) => ({ locale })),
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  const t = await getTranslations({ locale, namespace: 'GolfCourseHub' })
  const totalCourses = Object.values(REGION_META).reduce((sum, r) => sum + r.courseCount, 0)
  const title = t('metaTitle')
  // {count} is used by the TH description (149-course claim stays derived from
  // REGION_META, never a hardcoded literal); the EN string ignores it.
  const description = t('metaDescription', { count: totalCourses })
  const canonical = getCanonical(locale, '/golf-courses/')

  // Only emit hreflang when a translation actually exists — a lone
  // self-referential hreflang="en" cluster is audit noise (matches the sitemap).
  const languages = getAlternates('/golf-courses/')

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

export default async function GolfCoursesHubPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('GolfCourseHub')

  // Load all regions dynamically from REGION_META — no manual list to maintain.
  const regionSlugs = Object.keys(REGION_META) as Array<keyof typeof REGION_META>
  const courseArrays = await Promise.all(regionSlugs.map((slug) => getCoursesByRegion(slug)))

  const hubRegions = regionSlugs.map((slug, i) => ({
    region: slug,
    // Localized place name. All 14 regions are translated in th/ja/ko/zh as
    // of the structural-parity batch, so the EN-label fallback never fires
    // today; it stays for a future region added before its translations.
    label:    getRegionHubTranslation(slug, locale)?.label ?? REGION_META[slug].label,
    courses:  courseArrays[i],
    pinColor: REGION_META[slug].pinColor,
    // Resolved per course on the server: a locale prefix only where that
    // course is translated, so no map click 301s (ko/zh have none at all).
    hrefs: Object.fromEntries(
      courseArrays[i].map((c) => [c.slug, courseDetailHref(locale, slug, c.slug)]),
    ),
  }))

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: t('breadcrumbHome'), url: `${SITE_URL}/` },
    { name: t('breadcrumbGolfCourses'), url: getCanonical(locale, '/golf-courses/') },
  ])

  const totalCourses = Object.values(REGION_META).reduce((sum, r) => sum + r.courseCount, 0)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#003d22]">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#005a32]/50" />
          <div className="absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-[#007a45]/25" />
          <div className="absolute right-1/3 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-accent/10" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
              <Flag className="h-3 w-3" aria-hidden="true" />
              {t('heroEyebrow')}
            </div>
            <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t('heroHeading')}
            </h1>
            <p className="mb-6 text-base leading-relaxed text-white/75">
              {t('heroIntro', { courseCount: totalCourses, regionCount: regionSlugs.length })}
            </p>
          </div>
        </div>

        {/* Bottom wave — decorative */}
        <div className="absolute -bottom-px left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 40V0c240 26.7 480 40 720 40S1200 26.7 1440 0v40H0z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Region cards — rendered for ALL locales: they are the core directory
            of the hub. As of the structural-parity batch ALL 14 regions are
            translated in th/ja/ko/zh, so none of these links 301 any more. A
            future 15th region must be added to REGION_HUB_I18N (and to each
            locale's staticRoutes) or its card will link to the EN hub. */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {regionSlugs.map((slug) => {
            const meta = REGION_META[slug]
            const tr = getRegionHubTranslation(slug, locale)
            return (
              <Link
                key={slug}
                href={`/golf-courses/${slug}`}
                className="group flex flex-col rounded-2xl border border-border bg-white shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3 p-5">
                  <div className="min-w-0">
                    <div className="mb-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                      <MapPin className="h-2.5 w-2.5" aria-hidden="true" />
                      {tr?.province ?? meta.province}
                    </div>
                    <h3 className="mt-1 text-base font-black leading-snug text-foreground group-hover:text-primary">
                      {tr?.label ?? meta.label}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {tr?.description ?? meta.description}
                    </p>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-border/60 px-5 py-3.5">
                  <p className="text-sm font-bold text-foreground">
                    {/* One message, not `{n} + <coursesWord>`: three regions
                        hold a single course, and a count interpolated OUTSIDE
                        the message leaves the noun with nothing to agree with
                        ("1 courses"). Only EN inflects — th/ja/ko/zh carry the same
                        key with no plural, which is correct for those languages. */}
                    {t.rich('coursesCount', {
                      count: meta.courseCount,
                      muted: (chunks) => (
                        <span className="font-medium text-muted-foreground">{chunks}</span>
                      ),
                    })}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-transform group-hover:translate-x-0.5">
                    {t('viewAll')} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Hub map */}
        <div className="mb-12">
          <HubMapExplorer regions={hubRegions} />
        </div>

        {/* ── Programmatic-SEO finders (workstream A) ────────────────────── */}
        <div className="mb-12 space-y-10">
          {/* Find by BTS / district + find by playing style + compare —
              EN-only BY DESIGN (same precedent as the [region] trip-planning
              block): the /golf-courses/near/*, /golf-courses/best-for/* and
              /golf-courses/compare/* targets build no locale copies, so a
              translated hub linking them would 301 every click to English and
              the card copy below is hardcoded English. To light a section up
              for a locale, translate its target pages + copy first, then
              gate on the registry instead of locale === 'en'. */}
          {locale === 'en' && (
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <Train className="h-4 w-4 text-primary" aria-hidden="true" />
                  <h2 className="text-base font-bold uppercase tracking-widest text-primary">
                    Find courses near your hotel
                  </h2>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  Top courses ranked by straight-line distance from each Bangkok demand-magnet district.
                </p>
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
                  {Object.values(BTS_STATIONS).map((s) => (
                    <Link
                      key={s.slug}
                      href={`/golf-courses/near/${s.slug}`}
                      className="group flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-sm shadow-sm transition-all hover:-translate-y-px hover:border-primary/30 hover:shadow-md"
                    >
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        Near {s.name}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-primary/40 group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </section>
          )}

          {/* Find by arrival airport — same EN-only gate and rationale as the
              BTS block above; the /golf-courses/near/<airport> pages build no
              locale copies. */}
          {locale === 'en' && (
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <Plane className="h-4 w-4 text-primary" aria-hidden="true" />
                  <h2 className="text-base font-bold uppercase tracking-widest text-primary">
                    Find courses near your arrival airport
                  </h2>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  Landing with clubs — or renting a set on arrival? Courses ranked by distance from each Bangkok airport.
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {Object.values(AIRPORTS).map((a) => (
                    <Link
                      key={a.slug}
                      href={`/golf-courses/near/${a.slug}`}
                      className="group flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-sm shadow-sm transition-all hover:-translate-y-px hover:border-primary/30 hover:shadow-md"
                    >
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        Near {a.name} ({a.iata})
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-primary/40 group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </section>
          )}

          {/* Find by budget — rendered for ALL locales: the five
              /golf-courses/under/* tier pages are translated (PRICE_TIER_I18N),
              so these links resolve natively for th. */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" aria-hidden="true" />
              <h2 className="text-base font-bold uppercase tracking-widest text-primary">
                {t('budgetHeading')}
              </h2>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              {t('budgetIntro')}
            </p>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-5">
              {PRICE_TIERS.map((tier) => (
                <Link
                  key={tier.slug}
                  href={`/golf-courses/under/${tier.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-sm shadow-sm transition-all hover:-translate-y-px hover:border-primary/30 hover:shadow-md"
                >
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {t('underPrice', { price: tier.thb.toLocaleString('en-US') })}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-primary/40 group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </section>

          {/* Find by playing style + compare — EN-only BY DESIGN, see the
              comment on the station grid above. */}
          {locale === 'en' && (
            <>
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" aria-hidden="true" />
                  <h2 className="text-base font-bold uppercase tracking-widest text-primary">
                    Find by playing style
                  </h2>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  Courses suited to a specific kind of round — from beginners’ first 18 to championship-grade tournament venues.
                </p>
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {USE_CASES.map((u) => (
                    <Link
                      key={u}
                      href={`/golf-courses/best-for/${u}`}
                      className="group flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-sm shadow-sm transition-all hover:-translate-y-px hover:border-primary/30 hover:shadow-md"
                    >
                      <span className="font-semibold capitalize text-foreground group-hover:text-primary transition-colors">
                        Best for {u.replace('-', ' ')}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-primary/40 group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </section>

              {/* Compare top courses (per region) */}
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <Scale className="h-4 w-4 text-primary" aria-hidden="true" />
                  <h2 className="text-base font-bold uppercase tracking-widest text-primary">
                    Compare top courses
                  </h2>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  Side-by-side spec sheets and a data-driven view of which course suits which kind of round.
                </p>
                <Link
                  href="/golf-courses/bangkok"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:underline"
                >
                  Browse comparisons by region
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </section>
            </>
          )}
        </div>

        {/* LENGOLF rental CTA — rendered for ALL locales: the
            /golf-course-club-rental target is translated in every locale
            (lib/translated-routes.ts staticRoutes). */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003d22] to-[#005a32] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-6 left-1/3 h-28 w-28 rounded-full bg-accent/10" aria-hidden="true" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
                {t('rentalEyebrow')}
              </p>
              <p className="text-base font-medium text-white sm:text-lg">
                {t.rich('rentalPitch', {
                  price: (chunks) => <strong className="text-white">{chunks}</strong>,
                })}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <a
                href="https://booking.len.golf/course-rental"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-[#1a1a1a] transition-all hover:bg-accent/90 hover:shadow-lg"
              >
                {t('bookNow')}
              </a>
              <Link
                href="/golf-course-club-rental"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {t('learnMore')} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
