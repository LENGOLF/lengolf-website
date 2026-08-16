import { feeLabelKeys } from '@/lib/course-fees'
import { MapPin, Clock, Phone, Globe, Check, X, ArrowRight } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { courseDetailHref } from '@/lib/translated-routes'
// Raw next/link for pre-resolved course-detail hrefs: the i18n Link would
// re-apply the locale prefix and undo courseDetailHref's per-course decision.
import RawLink from 'next/link'
import { Link } from '@/i18n/navigation'
import type { GolfCourse } from '@/types/golf-courses'
import { asOfMonthYear, driveTimeLabel } from '@/lib/format'
import CrossLinkBlock, { type CrossLink } from '@/components/golf-courses/CrossLinkBlock'
import CourseFaq from '@/components/golf-courses/CourseFaq'
import CourseSatelliteMap from '@/components/golf-courses/CourseSatelliteMap'
import RentalCtaBanner from '@/components/golf-courses/RentalCtaBanner'
import { courseMapsUrl, hasTrustedCoordinates } from '@/lib/geo'
import { toCourseSeoLocale, type CourseFaqItem } from '@/lib/course-seo'

interface Props {
  course: GolfCourse
  regionLabel: string
  relatedCourses?: GolfCourse[]
  /** Cross-links into programmatic-SEO pages (comparisons, BTS proximity, use-cases). */
  crossLinks?: CrossLink[]
  /** FAQ items — the route computes these once and also emits them as FAQPage JSON-LD. */
  faqs?: CourseFaqItem[]
}

/** Blank-line-delimited paragraphs, as ExplainerPage / ActivityPage / FaqPage all
 *  do. Rendering a prose field as one raw string collapses every paragraph break
 *  in HTML, so multi-paragraph prose ships as a single run-on block — 22 EN
 *  courses in the three section fields (23 counting prose.overview, whose only
 *  case is chiang-mai/hang-dong-golf-club) and, once this batch registered seven
 *  of them, 28 localized pages too. The "21" this comment first carried was an
 *  undercount; recount before quoting it forward.
 *  Same class as the 36 run-on lists PR #90 fixed in renderParagraph().
 *  The empty-segment filter is why this is a helper and not an inline split: no
 *  course carries `\n\n\n` or a trailing blank line today, but one that did would
 *  otherwise render a phantom empty <p> with a margin. */
function splitParagraphs(content: string): string[] {
  return content.split('\n\n').map((p) => p.trim()).filter(Boolean)
}

export default function CoursePage({ course, regionLabel, relatedCourses = [], crossLinks = [], faqs = [] }: Props) {
  // UI chrome comes from the GolfCourseDetail namespace, which now ships in
  // all five locales (ko/zh joined in the ko/zh course-detail batch, so this
  // component DOES SSG for them). Number
  // args are pre-stringified/pre-formatted before hitting ICU so EN output
  // stays byte-identical (ICU number formatting would group "Est. 2,021").
  const t = useTranslations('GolfCourseDetail')
  const tShared = useTranslations('GolfCourseShared')
  // Single source for which basis this course's two rates are on (lib/course-fees.ts).
  const feeKeys = feeLabelKeys(course)
  const rawLocale = useLocale()
  const locale = toCourseSeoLocale(rawLocale)

  // Localized prose with per-field EN fallback: a pilot course may ship
  // title/meta only (locales.<locale>.prose absent) — render EN prose under
  // the localized chrome rather than blanking sections.
  const L = locale === 'en' ? undefined : course.locales[locale]
  const prose = {
    overview: L?.prose?.overview ?? course.prose.overview,
    layout_and_experience: L?.prose?.layout_and_experience ?? course.prose.layout_and_experience,
    tips: L?.prose?.tips ?? course.prose.tips,
    location_and_access: L?.prose?.location_and_access ?? course.prose.location_and_access,
  }

  // Quick-fact chips shown in the hero
  const chips = [
    course.holes ? t('chipHolesPar', { holes: String(course.holes), par: String(course.par) }) : null,
    course.designer ? t('chipDesigner', { designer: course.designer }) : null,
    course.year_opened ? t('chipEst', { year: String(course.year_opened) }) : null,
    driveTimeLabel(course.drive_time_from_bangkok_min, true, locale),
  ].filter(Boolean) as string[]

  const proseSections = [
    { label: t('sectionLayout'), content: prose.layout_and_experience },
    { label: t('sectionTips'), content: prose.tips },
    { label: t('sectionLocation'), content: prose.location_and_access },
  ]

  // "Rates checked <month year>" — EN keeps the short en-US month; TH uses the
  // Thai month name with the Gregorian year, JA uses 2026年7月 (each matching
  // its locale's FAQ as-of format).
  const ratesCheckedDate = course.fees_verified_at
    ? asOfMonthYear(course.fees_verified_at, locale)
    : null

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#003d22]">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#005a32]/50" />
          <div className="absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-[#007a45]/25" />
          <div className="absolute right-1/3 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-accent/10" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/50">
            <Link href="/golf-courses" className="transition-colors hover:text-white/80">{t('breadcrumbGolfCourses')}</Link>
            <span>/</span>
            <Link href={`/golf-courses/${course.region}`} className="capitalize transition-colors hover:text-white/80">{regionLabel}</Link>
            <span>/</span>
            <span className="text-white/70">{course.name}</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              {/* Province badge */}
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
                <MapPin className="h-3 w-3" />
                {course.province}
              </div>

              <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {course.name}
              </h1>

              {/* Chip row */}
              <div className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* Green fee highlight — shown when data is available */}
            {course.green_fee_weekday_thb && (
              <div className="shrink-0 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-right backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60">{t(feeKeys.lowerHeading)}</p>
                <p className="mt-0.5 text-3xl font-black text-white">
                  {course.green_fee_weekday_thb.toLocaleString('en-US')}
                  <span className="ml-1 text-base font-semibold text-white/70">{t('thb')}</span>
                </p>
                {course.green_fee_weekend_thb && (
                  <p className="mt-1 text-xs text-white/50">
                    {t(feeKeys.upperInline, { price: course.green_fee_weekend_thb.toLocaleString('en-US') })}
                  </p>
                )}
              </div>
            )}
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
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">

          {/* ── Left column ── */}
          <div className="min-w-0 space-y-8">

            {/* Closure notice — leads the page when the course isn't open */}
            {course.operational_status && course.operational_status !== 'open' && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
                <strong>
                  {course.operational_status === 'permanently_closed'
                    ? t('closedPermanently')
                    : t('closedTemporarily')}
                </strong>{' '}
                {course.operational_note}
              </div>
            )}

            {/* Overview prose. Split for the same reason the section cards below
                are: this is the LEAD paragraph, above the fold, so leaving it on
                the raw-string path was the more visible half of the same bug. */}
            {splitParagraphs(prose.overview).map((paragraph, pIdx) => (
              <p
                key={pIdx}
                className="text-base leading-relaxed text-foreground/85 [&:not(:first-of-type)]:mt-3"
              >
                {paragraph}
              </p>
            ))}

            {/* Stat strip */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: t('statHoles'), value: course.holes ? String(course.holes) : null },
                { label: t('statPar'), value: course.par ? String(course.par) : null },
                {
                  label: t('statFromBangkok'),
                  value: course.distance_from_bangkok_km
                    ? t('kmValue', { km: String(course.distance_from_bangkok_km) })
                    : null,
                },
                {
                  label: t('statDriveTime'),
                  value: driveTimeLabel(course.drive_time_from_bangkok_min, false, locale),
                },
              ]
                .filter((s) => s.value)
                .map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-3"
                  >
                    <p className="text-xl font-black" style={{ color: '#007429' }}>
                      {s.value}
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </p>
                  </div>
                ))}
            </div>

            {/* Prose sections */}
            <div className="space-y-6">
              {proseSections.map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-white p-5 shadow-sm">
                  <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
                    {s.label}
                  </h2>
                  {/* Same helper as the lead overview above — one split rule for
                      every prose field, so the two paths cannot drift apart. */}
                  {splitParagraphs(s.content).map((paragraph, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-sm leading-relaxed text-foreground/80 [&:not(:first-of-type)]:mt-3"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* Satellite map — live Maps JS view of the actual layout
                (lazy-initialised below the fold). The frame is suppressed
                when coordinates aren't trustworthy; the Google Maps link
                always renders and falls back to a name search. The two
                user-facing strings are passed as PROPS: the component is
                'use client', and a client-side useTranslations('GolfCourseDetail')
                would let OTHER routes' client bundles request a namespace
                that ja/ko/zh catalogs deliberately don't carry. */}
            <div>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
                {t('sectionCourseLocation')}
              </h2>
              <CourseSatelliteMap
                name={course.name}
                lat={course.latitude}
                lng={course.longitude}
                mapsUrl={courseMapsUrl(course)}
                enabled={Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY)}
                coordinatesTrusted={hasTrustedCoordinates(course)}
                ariaLabel={t('mapAriaLabel', { name: course.name })}
                linkLabel={t('openInGoogleMaps', { name: course.name })}
              />
            </div>

            {/* Rental CTA banner — shared component (tracked, localizable).
                EN keeps this course's hand-written contextual pitch; other
                locales prefer the localized override in locales.<locale>.prose
                and otherwise fall back to the banner's own localized default
                copy (GolfCourseShared.rentalBody) — NOT the EN prose, which
                would ship a mixed-language banner. */}
            <RentalCtaBanner
              body={locale === 'en' ? course.prose.rental_cta_context : L?.prose?.rental_cta_context}
              source="course_page"
            />

            {/* More courses in this region */}
            {relatedCourses.length > 0 && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
                    {t('moreCoursesHeading', { region: regionLabel })}
                  </h2>
                  <Link
                    href={`/golf-courses/${course.region}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    {t('viewAll')} <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {relatedCourses.map((c) => (
                    <RawLink
                      key={c.slug}
                      // Per-course, not per-locale: most siblings are
                      // EN-only, but a th/ja reader on a translated page
                      // must reach a translated sibling, not the EN one.
                      href={courseDetailHref(rawLocale, c.region, c.slug)}
                      // RawLink: the i18n Link would re-prefix this and undo
                      // the per-course decision. Region links above keep the
                      // i18n Link, since every region hub IS translated.
                      className="group flex flex-col justify-between gap-3 rounded-xl border border-border bg-white p-4 shadow-sm transition-all hover:-translate-y-px hover:border-primary/30 hover:shadow-md"
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          {c.province}
                        </p>
                        <p className="mt-1 text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                          {c.name}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        {c.green_fee_weekday_thb ? (
                          <span className="text-xs font-semibold text-primary">
                            {tShared('feeFrom', { price: c.green_fee_weekday_thb.toLocaleString('en-US') })}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">{t('contactForRates')}</span>
                        )}
                        <ArrowRight className="h-3.5 w-3.5 text-primary/40 group-hover:text-primary transition-colors" />
                      </div>
                    </RawLink>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ — visible twin of the FAQPage JSON-LD emitted by the route
                (same array instance, so they cannot drift) */}
            <CourseFaq faqs={faqs} />

            {/* Cross-links into programmatic-SEO pages */}
            {crossLinks.length > 0 && (
              <CrossLinkBlock
                heading={t('alsoExplore')}
                items={crossLinks}
              />
            )}
          </div>

          {/* ── Right sidebar ── */}
          <aside className="space-y-5">

            {/* Contact & Links — top of sidebar */}
            {(course.phone || course.website || course.google_maps_url) && (
              <div className="overflow-hidden rounded-2xl border shadow-sm">
                <div className="bg-[#f6fffa] px-5 py-3">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
                    {t('contactLinks')}
                  </h2>
                </div>
                <div className="divide-y bg-white">
                  {course.phone && (
                    <a
                      href={`tel:${course.phone}`}
                      className="flex items-center gap-3 px-5 py-3.5 text-sm transition-colors hover:bg-muted/40"
                    >
                      <Phone className="h-4 w-4 shrink-0 text-primary" />
                      <span>{course.phone}</span>
                    </a>
                  )}
                  {course.website && (
                    <a
                      href={course.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-5 py-3.5 text-sm transition-colors hover:bg-muted/40"
                    >
                      <Globe className="h-4 w-4 shrink-0 text-primary" />
                      <span>{t('officialWebsite')}</span>
                    </a>
                  )}
                  {course.google_maps_url && (
                    <a
                      href={course.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-5 py-3.5 text-sm transition-colors hover:bg-muted/40"
                    >
                      <MapPin className="h-4 w-4 shrink-0 text-primary" />
                      <span>{t('googleMaps')}</span>
                    </a>
                  )}
                  {course.drive_time_from_bangkok_min && (
                    <div className="flex items-center gap-3 px-5 py-3.5 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>{driveTimeLabel(course.drive_time_from_bangkok_min, true, locale)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Green fees */}
            {(course.green_fee_weekday_thb || course.green_fee_weekend_thb) && (
              <div className="overflow-hidden rounded-2xl border shadow-sm">
                <div className="bg-primary px-5 py-3">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-white/80">
                    {t('greenFees')}
                  </h2>
                </div>
                <div className="divide-y bg-white">
                  {course.green_fee_weekday_thb && (
                    <div className="flex items-center justify-between px-5 py-3.5">
                      <span className="text-sm text-muted-foreground">{t(feeKeys.lower)}</span>
                      <span className="font-bold text-foreground">
                        {t('feeThb', { price: course.green_fee_weekday_thb.toLocaleString('en-US') })}
                      </span>
                    </div>
                  )}
                  {course.green_fee_weekend_thb && (
                    <div className="flex items-center justify-between px-5 py-3.5">
                      <span className="text-sm text-muted-foreground">{t(feeKeys.upper)}</span>
                      <span className="font-bold text-foreground">
                        {t('feeThb', { price: course.green_fee_weekend_thb.toLocaleString('en-US') })}
                      </span>
                    </div>
                  )}
                  {course.caddie_fee_thb !== null && course.caddie_fee_thb > 0 && (
                    <div className="flex items-center justify-between px-5 py-3.5">
                      <span className="text-sm text-muted-foreground">{t('caddie')}</span>
                      <span className="font-bold text-foreground">
                        {t('feeThb', { price: course.caddie_fee_thb.toLocaleString('en-US') })}
                      </span>
                    </div>
                  )}
                  {course.cart_fee_thb !== null && course.cart_fee_thb > 0 && (
                    <div className="flex items-center justify-between px-5 py-3.5">
                      <span className="text-sm text-muted-foreground">{t('cart')}</span>
                      <span className="font-bold text-foreground">
                        {t('feeThb', { price: course.cart_fee_thb.toLocaleString('en-US') })}
                      </span>
                    </div>
                  )}
                </div>
                <p className="bg-muted/50 px-5 py-2.5 text-[11px] text-muted-foreground">
                  {ratesCheckedDate
                    ? t('ratesChecked', { date: ratesCheckedDate })
                    : t('ratesVerify')}
                </p>
              </div>
            )}

            {/* Facilities — club rental at the bottom, bridging to LENGOLF nudge */}
            <div className="overflow-hidden rounded-2xl border shadow-sm">
              <div className="bg-[#f6fffa] px-5 py-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
                  {t('facilities')}
                </h2>
              </div>
              <div className="divide-y bg-white">
                {[
                  { label: t('caddieRequired'), value: course.caddie_required },
                  { label: t('cartRequired'), value: course.cart_required },
                  { label: t('drivingRange'), value: course.driving_range },
                ]
                  .filter((f) => f.value !== null)
                  .map((f) => (
                    <div key={f.label} className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm text-muted-foreground">{f.label}</span>
                      {f.value ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          <Check className="h-3 w-3" /> {t('yes')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                          <X className="h-3 w-3" /> {t('no')}
                        </span>
                      )}
                    </div>
                  ))}

                {/* Club rental row — always shown, drives into LENGOLF nudge below */}
                {course.club_rental_available === true ? (
                  <div className="flex items-start justify-between px-5 py-3">
                    <span className="text-sm text-muted-foreground">{t('clubRental')}</span>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        <Check className="h-3 w-3" /> {t('available')}
                      </span>
                      {course.club_rental_fee_thb && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {t('feePerRound', { price: course.club_rental_fee_thb.toLocaleString('en-US') })}
                          {course.club_rental_brands && ` · ${course.club_rental_brands}`}
                        </p>
                      )}
                    </div>
                  </div>
                ) : course.club_rental_available === false ? (
                  <div className="flex items-center justify-between px-5 py-3">
                    <span className="text-sm text-muted-foreground">{t('clubRental')}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                      <X className="h-3 w-3" /> {t('notOffered')}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Plan Your Trip — links to guide, lessons, and cost pages */}
            <div className="overflow-hidden rounded-2xl border shadow-sm">
              <div className="bg-[#f6fffa] px-5 py-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
                  {t('planYourTrip')}
                </h2>
              </div>
              <div className="divide-y bg-white">
                {/* RawLink, not the locale-aware Link: /golf-in-thailand-guide
                    is registered for NO locale, so a prefixed href would 301
                    to English from all 60 translated course pages — an extra
                    hop for the reader and for crawlers, to reach the same
                    page. Every other link in this block IS translated. Switch
                    this back to Link the moment the guide gets translated. */}
                <RawLink
                  href="/golf-in-thailand-guide"
                  className="flex items-center gap-3 px-5 py-3.5 text-sm transition-colors hover:bg-muted/40"
                >
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                  <span>{t('planGuide')}</span>
                </RawLink>
                <Link
                  href="/guide/best-time-play-golf-thailand"
                  className="flex items-center gap-3 px-5 py-3.5 text-sm transition-colors hover:bg-muted/40"
                >
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                  <span>{t('planBestTime')}</span>
                </Link>
                <Link
                  href="/cost/how-much-does-golf-cost-bangkok"
                  className="flex items-center gap-3 px-5 py-3.5 text-sm transition-colors hover:bg-muted/40"
                >
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                  <span>{t('planCost')}</span>
                </Link>
                <Link
                  href="/lessons"
                  className="flex items-center gap-3 px-5 py-3.5 text-sm transition-colors hover:bg-muted/40"
                >
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                  <span>{t('planLessons')}</span>
                </Link>
              </div>
            </div>

            {/* LENGOLF rental nudge — sits directly below Facilities club rental row */}
            <div className="rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/10 to-accent/5 p-5">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: '#b8892e' }}>
                {course.club_rental_available === false
                  ? t('nudgeEyebrowNoRental')
                  : t('nudgeEyebrow')}
              </p>
              <p className="mb-3 text-sm leading-relaxed text-foreground">
                {t.rich(
                  course.club_rental_available === false ? 'nudgeBodyNoRental' : 'nudgeBody',
                  { price: (chunks) => <strong>{chunks}</strong> }
                )}
              </p>
              <Link
                href="/golf-course-club-rental"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
              >
                {t('seePackages')} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
