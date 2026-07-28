import { MapPin, Clock, Phone, Globe, Check, X, ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { GolfCourse } from '@/types/golf-courses'
import { driveTimeLabel } from '@/lib/format'
import CrossLinkBlock, { type CrossLink } from '@/components/golf-courses/CrossLinkBlock'
import CourseFaq from '@/components/golf-courses/CourseFaq'
import RentalCtaBanner from '@/components/golf-courses/RentalCtaBanner'

interface Props {
  course: GolfCourse
  regionLabel: string
  relatedCourses?: GolfCourse[]
  /** Cross-links into programmatic-SEO pages (comparisons, BTS proximity, use-cases). */
  crossLinks?: CrossLink[]
}

export default function CoursePage({ course, regionLabel, relatedCourses = [], crossLinks = [] }: Props) {
  // Quick-fact chips shown in the hero
  const chips = [
    course.holes ? `${course.holes} holes · Par ${course.par}` : null,
    course.designer ? `Designed by ${course.designer}` : null,
    course.year_opened ? `Est. ${course.year_opened}` : null,
    driveTimeLabel(course.drive_time_from_bangkok_min),
  ].filter(Boolean) as string[]

  const proseSections = [
    { label: 'Layout & playing experience', content: course.prose.layout_and_experience },
    { label: 'Tips & what to know before you go', content: course.prose.tips },
    { label: 'Location & getting there', content: course.prose.location_and_access },
  ]

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
            <Link href="/golf-courses" className="transition-colors hover:text-white/80">Golf Courses</Link>
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
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Weekday green fee</p>
                <p className="mt-0.5 text-3xl font-black text-white">
                  {course.green_fee_weekday_thb.toLocaleString('en-US')}
                  <span className="ml-1 text-base font-semibold text-white/70">THB</span>
                </p>
                {course.green_fee_weekend_thb && (
                  <p className="mt-1 text-xs text-white/50">
                    Weekend: {course.green_fee_weekend_thb.toLocaleString('en-US')} THB
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

            {/* Overview prose */}
            <p className="text-base leading-relaxed text-foreground/85">
              {course.prose.overview}
            </p>

            {/* Stat strip */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Holes', value: course.holes ? String(course.holes) : null },
                { label: 'Par', value: course.par ? String(course.par) : null },
                {
                  label: 'From Bangkok',
                  value: course.distance_from_bangkok_km
                    ? `${course.distance_from_bangkok_km} km`
                    : null,
                },
                {
                  label: 'Drive time',
                  value: driveTimeLabel(course.drive_time_from_bangkok_min, false),
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
                  <p className="text-sm leading-relaxed text-foreground/80">{s.content}</p>
                </div>
              ))}
            </div>

            {/* Rental CTA banner — shared component (tracked, localizable),
                with this course's hand-written contextual pitch as the body */}
            <RentalCtaBanner body={course.prose.rental_cta_context} source="course_page" />

            {/* More courses in this region */}
            {relatedCourses.length > 0 && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
                    More {regionLabel} courses
                  </h2>
                  <Link
                    href={`/golf-courses/${course.region}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    View all <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {relatedCourses.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/golf-courses/${c.region}/${c.slug}`}
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
                            from {c.green_fee_weekday_thb.toLocaleString('en-US')} THB
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Contact for rates</span>
                        )}
                        <ArrowRight className="h-3.5 w-3.5 text-primary/40 group-hover:text-primary transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ — visible twin of the FAQPage JSON-LD emitted by the route */}
            <CourseFaq course={course} />

            {/* Cross-links into programmatic-SEO pages */}
            {crossLinks.length > 0 && (
              <CrossLinkBlock
                heading="Also explore"
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
                    Contact & Links
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
                      <span>Official website</span>
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
                      <span>Google Maps</span>
                    </a>
                  )}
                  {course.drive_time_from_bangkok_min && (
                    <div className="flex items-center gap-3 px-5 py-3.5 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>{driveTimeLabel(course.drive_time_from_bangkok_min)}</span>
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
                    Green Fees
                  </h2>
                </div>
                <div className="divide-y bg-white">
                  {course.green_fee_weekday_thb && (
                    <div className="flex items-center justify-between px-5 py-3.5">
                      <span className="text-sm text-muted-foreground">Weekday</span>
                      <span className="font-bold text-foreground">
                        {course.green_fee_weekday_thb.toLocaleString('en-US')} THB
                      </span>
                    </div>
                  )}
                  {course.green_fee_weekend_thb && (
                    <div className="flex items-center justify-between px-5 py-3.5">
                      <span className="text-sm text-muted-foreground">Weekend</span>
                      <span className="font-bold text-foreground">
                        {course.green_fee_weekend_thb.toLocaleString('en-US')} THB
                      </span>
                    </div>
                  )}
                  {course.caddie_fee_thb !== null && course.caddie_fee_thb > 0 && (
                    <div className="flex items-center justify-between px-5 py-3.5">
                      <span className="text-sm text-muted-foreground">Caddie</span>
                      <span className="font-bold text-foreground">
                        {course.caddie_fee_thb.toLocaleString('en-US')} THB
                      </span>
                    </div>
                  )}
                  {course.cart_fee_thb !== null && course.cart_fee_thb > 0 && (
                    <div className="flex items-center justify-between px-5 py-3.5">
                      <span className="text-sm text-muted-foreground">Cart</span>
                      <span className="font-bold text-foreground">
                        {course.cart_fee_thb.toLocaleString('en-US')} THB
                      </span>
                    </div>
                  )}
                </div>
                <p className="bg-muted/50 px-5 py-2.5 text-[11px] text-muted-foreground">
                  Verify with the course before booking.
                </p>
              </div>
            )}

            {/* Facilities — club rental at the bottom, bridging to LENGOLF nudge */}
            <div className="overflow-hidden rounded-2xl border shadow-sm">
              <div className="bg-[#f6fffa] px-5 py-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
                  Facilities
                </h2>
              </div>
              <div className="divide-y bg-white">
                {[
                  { label: 'Caddie required', value: course.caddie_required },
                  { label: 'Cart required', value: course.cart_required },
                  { label: 'Driving range', value: course.driving_range },
                ]
                  .filter((f) => f.value !== null)
                  .map((f) => (
                    <div key={f.label} className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm text-muted-foreground">{f.label}</span>
                      {f.value ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          <Check className="h-3 w-3" /> Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                          <X className="h-3 w-3" /> No
                        </span>
                      )}
                    </div>
                  ))}

                {/* Club rental row — always shown, drives into LENGOLF nudge below */}
                {course.club_rental_available === true ? (
                  <div className="flex items-start justify-between px-5 py-3">
                    <span className="text-sm text-muted-foreground">Club rental</span>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        <Check className="h-3 w-3" /> Available
                      </span>
                      {course.club_rental_fee_thb && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {course.club_rental_fee_thb.toLocaleString('en-US')} THB / round
                          {course.club_rental_brands && ` · ${course.club_rental_brands}`}
                        </p>
                      )}
                    </div>
                  </div>
                ) : course.club_rental_available === false ? (
                  <div className="flex items-center justify-between px-5 py-3">
                    <span className="text-sm text-muted-foreground">Club rental</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                      <X className="h-3 w-3" /> Not offered
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Plan Your Trip — links to guide, lessons, and cost pages */}
            <div className="overflow-hidden rounded-2xl border shadow-sm">
              <div className="bg-[#f6fffa] px-5 py-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
                  Plan Your Trip
                </h2>
              </div>
              <div className="divide-y bg-white">
                <Link
                  href="/golf-in-thailand-guide"
                  className="flex items-center gap-3 px-5 py-3.5 text-sm transition-colors hover:bg-muted/40"
                >
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                  <span>Thailand golf planning guide</span>
                </Link>
                <Link
                  href="/guide/best-time-play-golf-thailand"
                  className="flex items-center gap-3 px-5 py-3.5 text-sm transition-colors hover:bg-muted/40"
                >
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                  <span>Best time of year to play golf in Thailand</span>
                </Link>
                <Link
                  href="/cost/how-much-does-golf-cost-bangkok"
                  className="flex items-center gap-3 px-5 py-3.5 text-sm transition-colors hover:bg-muted/40"
                >
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                  <span>Green fee &amp; cost guide</span>
                </Link>
                <Link
                  href="/lessons"
                  className="flex items-center gap-3 px-5 py-3.5 text-sm transition-colors hover:bg-muted/40"
                >
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                  <span>Golf lessons in Bangkok</span>
                </Link>
              </div>
            </div>

            {/* LENGOLF rental nudge — sits directly below Facilities club rental row */}
            <div className="rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/10 to-accent/5 p-5">
              <p className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: '#b8892e' }}>
                {course.club_rental_available === false
                  ? 'No rentals at this course?'
                  : 'LENGOLF Club Rental'}
              </p>
              <p className="mb-3 text-sm leading-relaxed text-foreground">
                {course.club_rental_available === false
                  ? "This course doesn't offer club rental — but LENGOLF does. Current-generation Callaway Paradym, Warbird & Majesty sets from "
                  : 'Current-generation Callaway Paradym, Warbird & Majesty sets — not house clubs. From '}
                <strong>1,200 THB/day</strong> with multi-day discounts and Bangkok hotel delivery.
              </p>
              <Link
                href="/golf-course-club-rental"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
              >
                See packages <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
