import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { setRequestLocale } from 'next-intl/server'
import BookingCTA from '@/components/shared/BookingCTA'
import StageNavClient from '@/components/golf-guide/StageNavClient'
import GroundTabsClient from '@/components/golf-guide/GroundTabsClient'
import SmoothAnchor from '@/components/golf-guide/SmoothAnchor'
import { getSeoPagesByType } from '@/lib/seo-pages'
import { REGION_META } from '@/lib/golf-courses'
import { SITE_URL, BOOKING_URL } from '@/lib/constants'
import { getBreadcrumbJsonLd } from '@/lib/jsonld'
import type { SeoPage } from '@/types/seo-pages'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const prefix = locale === 'en' ? '' : `/${locale}`
  return {
    title: 'Golf in Thailand: The Complete Golf Travel Guide',
    description:
      'The complete golf guide to Thailand: best courses near Bangkok, when to go, booking tee times, club rental vs bringing your own, airport transfers, and on-the-ground travel tips. Updated 2026.',
    alternates: {
      canonical: `${SITE_URL}${prefix}/golf-in-thailand-guide/`,
    },
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StageBadge({ num, label }: { num: number; label: string }) {
  const colors = ['#C8A050', '#4A8B6F', '#E87B4A', '#005A32'] as const
  const bg = colors[num - 1] ?? colors[0]
  return (
    <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 mb-4" style={{ background: `${bg}18` }}>
      <span
        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
        style={{ background: bg }}
      >
        {num}
      </span>
      <span
        className="text-[11px] font-semibold uppercase tracking-widest"
        style={{ color: bg, fontFamily: 'var(--font-mono, monospace)' }}
      >
        Stage {num}
      </span>
    </div>
  )
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

const RESOURCE_CARD_BORDER_COLORS = {
  gold: '#C8A050',
  green: '#4A8B6F',
  orange: '#E87B4A',
} as const

function ResourceCard({ href, cat, title, desc, variant }: {
  href: string
  cat: string
  title: string
  desc: string
  variant: 'gold' | 'green' | 'orange'
}) {
  return (
    <Link
      href={href as Parameters<typeof Link>[0]['href']}
      className="group flex items-start gap-4 rounded-lg border bg-white p-5 transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-px"
      style={{ borderColor: 'rgba(0,66,37,0.12)', borderLeftWidth: '3px', borderLeftColor: RESOURCE_CARD_BORDER_COLORS[variant] }}
    >
      <div className="flex-1 min-w-0">
        <p
          className="text-[10px] uppercase tracking-widest mb-1 font-bold"
          style={{ color: '#C8A050', fontFamily: 'var(--font-mono, monospace)' }}
        >
          {cat}
        </p>
        <p className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors mb-1.5">
          {title}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
        <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          Read guide <ArrowRight />
        </span>
      </div>
      <ArrowRight className="flex-shrink-0 mt-1 text-primary/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </Link>
  )
}

function HubCard({ href, cat, title, stage }: {
  href: string
  cat: string
  title: string
  stage: 'plan' | 'book' | 'travel' | 'ground'
}) {
  const stripeColors = { plan: '#C8A050', book: '#4A8B6F', travel: '#E87B4A', ground: '#005A32' }
  const catColors = { plan: '#7A5A10', book: '#2A6B4F', travel: '#8A3A1A', ground: '#004225' }
  return (
    <Link
      href={href as Parameters<typeof Link>[0]['href']}
      className="group flex flex-col rounded-lg border bg-white p-5 relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5"
      style={{ borderColor: 'rgba(0,66,37,0.08)' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: stripeColors[stage] }}
      />
      <p
        className="text-[10px] uppercase tracking-widest mb-2 font-medium"
        style={{ color: catColors[stage], fontFamily: 'var(--font-mono, monospace)' }}
      >
        {cat}
      </p>
      <p className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors flex-1">
        {title}
      </p>
      <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-primary/70 group-hover:text-primary transition-colors">
        Read <ArrowRight />
      </div>
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function GolfInThailandGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [faqPages, costPages, guidePages] = await Promise.all([
    getSeoPagesByType('faq'),
    getSeoPagesByType('price_guide'),
    getSeoPagesByType('explainer'),
  ])

  const allPages: Array<SeoPage & { stage: 'plan' | 'book' | 'travel' | 'ground'; urlPrefix: string }> = [
    ...guidePages.map((p) => ({ ...p, stage: 'ground' as const, urlPrefix: '/guide' })),
    ...costPages.map((p) => ({ ...p, stage: 'book' as const, urlPrefix: '/cost' })),
    ...faqPages.map((p) => ({ ...p, stage: 'plan' as const, urlPrefix: '/faq' })),
  ]

  // Course counts in the directory cards below are DERIVED, never typed out:
  // the Bangkok, Pattaya and Khao Yai cards still advertised 46 / 16 / 7 after
  // the re-regioning batches took those regions to 55 / 25 / 12, and a card
  // title is crawler-visible copy, not a comment. Same source the hub itself
  // renders from (lib/golf-courses.ts REGION_META), which validate:courses
  // holds to the region index files.
  const totalCourses = Object.values(REGION_META).reduce((sum, r) => sum + r.courseCount, 0)

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Golf in Thailand Guide', url: `${SITE_URL}/golf-in-thailand-guide/` },
  ])

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Golf in Thailand — The Complete Planning Guide',
    description:
      'Plan your golf trip to Thailand — courses, booking, travel logistics, and on-the-ground tips.',
    url: `${SITE_URL}/golf-in-thailand-guide/`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      {/* ── STICKY NAV ────────────────────────────────────────────── */}
      <StageNavClient />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col lg:grid lg:grid-cols-2 min-h-[88vh]"
        aria-label="Hero"
        data-hero=""
      >
        {/* Left: outdoor course image */}
        <div className="relative min-h-[40vh] lg:min-h-0">
          <Image
            src="https://bisimqmtxjsptehhqpeg.supabase.co/storage/v1/object/public/website-assets/golf/hero-course-rental.webp"
            alt="Premium golf course in Thailand — fairway and lush surroundings"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {/* gradient bridge to right panel */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#004225] hidden lg:block pointer-events-none" />
          {/* image caption */}
          <div className="absolute bottom-4 left-4">
            <span
              className="text-[10px] uppercase tracking-widest px-3 py-1.5 rounded"
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                color: 'rgba(255,255,255,0.55)',
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(6px)',
              }}
            >
              Thailand — 250+ courses nationwide
            </span>
          </div>
        </div>

        {/* Right: editorial text on dark green */}
        <div
          className="relative flex flex-col justify-between px-8 py-12 lg:px-16 lg:py-16"
          style={{ background: '#004225' }}
        >
          {/* Glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 50% at 60% 35%, rgba(45,122,79,0.35) 0%, transparent 60%)',
            }}
          />

          {/* Eyebrow */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px" style={{ background: '#C8A050' }} />
              <span
                className="text-[11px] uppercase tracking-widest font-medium"
                style={{ color: '#C8A050', fontFamily: 'var(--font-mono, monospace)' }}
              >
                The Complete Guide — 2026
              </span>
            </div>

            <h1 className="mb-4 text-4xl font-black uppercase leading-none text-white md:text-5xl lg:text-6xl">
              Golf in Thailand —{' '}
              <span style={{ color: '#C8A050' }}>the real guide.</span>
            </h1>

            <p className="text-base lg:text-lg leading-relaxed mb-8 max-w-md" style={{ color: 'rgba(255,255,255,0.6)' }}>
              When to go, which courses to play, how to get there, and how to make every hour on the fairway count.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <SmoothAnchor
                targetId="stage-plan"
                className="inline-flex items-center gap-2.5 rounded px-7 py-3.5 text-sm font-bold uppercase tracking-wide transition-all hover:-translate-y-px"
                style={{ background: '#C8A050', color: '#1C1C1C', letterSpacing: '0.06em' }}
              >
                Start Planning
                <ArrowRight />
              </SmoothAnchor>
              <SmoothAnchor
                targetId="all-guides"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                Browse all guides
                <ArrowRight />
              </SmoothAnchor>
            </div>
          </div>

          {/* Stage strip at bottom of hero panel */}
          <div
            className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-0 mt-12 -mx-8 lg:-mx-16 -mb-12 lg:-mb-16"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            {[
              { num: 1, label: 'Plan', sub: 'When to go, which courses', color: '#C8A050', id: 'stage-plan' },
              { num: 2, label: 'Book', sub: 'Tee times, clubs, hotels', color: '#4A8B6F', id: 'stage-book' },
              { num: 3, label: 'Travel', sub: 'Flights, airports, transfers', color: '#E87B4A', id: 'stage-travel' },
              { num: 4, label: 'On the Ground', sub: 'Courses, lessons, events', color: '#005A32', id: 'stage-ground' },
            ].map((s) => (
              <SmoothAnchor
                key={s.id}
                targetId={s.id}
                className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-white/[0.03]"
                style={{ borderTop: `2px solid ${s.color}`, borderRight: '1px solid rgba(255,255,255,0.05)' }}
              >
                <span
                  className="text-[10px] font-medium mt-0.5 flex-shrink-0"
                  style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono, monospace)' }}
                >
                  0{s.num}
                </span>
                <div>
                  <div className="text-[13px] font-bold uppercase tracking-wide text-white leading-tight">{s.label}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.sub}</div>
                </div>
              </SmoothAnchor>
            ))}
          </div>
        </div>
      </section>

      {/* ── STAGE 1: PLAN ─────────────────────────────────────────── */}
      <section id="stage-plan" className="py-20 lg:py-28 bg-[#F5F0E8]" style={{ scrollMarginTop: '72px' }}>
        <div className="section-max-width section-padding">
          <StageBadge num={1} label="Plan" />
          <h2 className="text-3xl font-black uppercase leading-none text-[#004225] mb-4 lg:text-5xl">
            Plan your <span className="text-[#2D7A4F]">trip.</span>
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-xl leading-relaxed mb-14">
            When to go, what the weather means for your game, which courses to put on your list, and what to sort out before you fly.
          </p>

          <div className="grid lg:grid-cols-2 gap-12">

            {/* Left: seasons + baggage */}
            <div>
              <h3 className="text-xl font-bold text-[#004225] mb-3">When to go</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Thailand has three seasons that affect golf very differently. The dry season window is the sweet spot — but off-season has its own advantages.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  {
                    months: 'Nov – Feb',
                    title: 'Dry Season',
                    body: 'Cool mornings, low humidity. Best conditions for a full round. Book early — this is peak season.',
                    verdict: 'Best for golf',
                    rating: 5,
                    bg: 'linear-gradient(135deg, #1A4D30 0%, #2D7A4F 100%)',
                    accent: '#7ABA8C',
                  },
                  {
                    months: 'Mar – May',
                    title: 'Hot Season',
                    body: 'Intense heat by mid-morning. Early tee times essential. Quieter courses, lower green fees.',
                    verdict: 'Tee off early',
                    rating: 3,
                    bg: 'linear-gradient(135deg, #7A4A1A 0%, #C8803A 100%)',
                    accent: '#F0C080',
                  },
                  {
                    months: 'Jun – Oct',
                    title: 'Rainy Season',
                    body: 'Afternoon downpours common. Courses can close. Indoor golf becomes the smart option.',
                    verdict: 'Plan around rain',
                    readMore: true,
                    rating: 2,
                    bg: 'linear-gradient(135deg, #1A2A3A 0%, #2A4A6A 100%)',
                    accent: '#7AAAD0',
                    href: '/guide/golf-bangkok-rainy-season',
                  },
                  {
                    months: 'Any time',
                    title: 'Indoor Option',
                    body: "Bangkok's simulators run year-round, rain or shine. Great for evenings when outdoor rounds aren't possible.",
                    verdict: 'Always open',
                    rating: 4,
                    bg: 'linear-gradient(135deg, #004225 0%, #005A32 100%)',
                    accent: '#C8A050',
                    href: '/golf',
                  },
                ].map((s) => {
                  const cardInner = (
                    <>
                      {/* Coloured header bar */}
                      <div className="px-4 pt-4 pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="text-[9px] uppercase tracking-widest font-bold"
                            style={{ color: s.accent, fontFamily: 'var(--font-mono, monospace)' }}
                          >
                            {s.months}
                          </span>
                          {/* Golf-rating dots */}
                          <span className="flex gap-0.5">
                            {[1,2,3,4,5].map((n) => (
                              <span
                                key={n}
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: n <= s.rating ? s.accent : 'rgba(255,255,255,0.15)' }}
                              />
                            ))}
                          </span>
                        </div>
                        <p className="text-sm font-black uppercase leading-none text-white">{s.title}</p>
                      </div>
                      {/* Body */}
                      <div
                        className="px-4 py-3 flex-1 flex flex-col justify-between"
                        style={{ background: 'rgba(0,0,0,0.25)' }}
                      >
                        <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>{s.body}</p>
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span
                            className="inline-block self-start text-[10px] uppercase tracking-wide px-2.5 py-1 rounded font-bold"
                            style={{ background: s.accent, color: '#1C1C1C' }}
                          >
                            {s.verdict}
                          </span>
                          {'readMore' in s && s.readMore && (
                            <span
                              className="text-[10px] uppercase tracking-wide font-semibold flex items-center gap-1"
                              style={{ color: 'rgba(255,255,255,0.5)' }}
                            >
                              Read more →
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )
                  return 'href' in s && s.href ? (
                    <Link
                      key={s.title}
                      href={s.href as Parameters<typeof Link>[0]['href']}
                      className="rounded-xl overflow-hidden flex flex-col hover:opacity-90 transition-opacity"
                      style={{ background: s.bg }}
                    >
                      {cardInner}
                    </Link>
                  ) : (
                    <div
                      key={s.title}
                      className="rounded-xl overflow-hidden flex flex-col"
                      style={{ background: s.bg }}
                    >
                      {cardInner}
                    </div>
                  )
                })}
              </div>

            </div>

            {/* Right: courses */}
            <div>
              <h3 className="text-xl font-bold text-[#004225] mb-3">Courses worth putting on your list</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Thailand has over 250 courses. These are the ones that consistently come up when golfers talk about the best rounds they have played in Asia.
              </p>

              <div className="divide-y divide-[rgba(0,66,37,0.06)] rounded-lg border bg-white overflow-hidden mb-6" style={{ borderColor: 'rgba(0,66,37,0.08)' }}>
                {[
                  { name: 'Black Mountain Golf Club', meta: 'Hua Hin · 90 min from Bangkok', tag: 'Top-rated', initials: 'BM', color: '#1A4D30', href: '/golf-courses/hua-hin/black-mountain-golf-club' },
                  { name: 'Pineapple Valley Golf Club', meta: 'Hua Hin · 90 min from Bangkok', tag: 'Scenic', initials: 'PV', color: '#2A5A2A', href: '/golf-courses/hua-hin/pineapple-valley-golf-club' },
                  { name: 'Nikanti Golf Club', meta: 'Nakhon Pathom · 45 min from Bangkok', tag: 'Closest', initials: 'NK', color: '#3A4A2A', href: '/golf-courses/bangkok/nikanti-golf-club' },
                  { name: 'Alpine Golf Club', meta: 'Pathum Thani · 40 min from Bangkok', tag: 'Classic layout', initials: 'AL', color: '#2A3A4A', href: '/golf-courses/bangkok/alpine-golf-club' },
                  { name: 'Thai Country Club', meta: 'Chachoengsao · 50 min from Bangkok', tag: 'Tournament venue', initials: 'TC', color: '#4A3A1A', href: '/golf-courses/bangkok/thai-country-club' },
                ].map((course) => (
                  <Link key={course.name} href={course.href as Parameters<typeof Link>[0]['href']} className="flex items-center gap-3 p-4 group hover:bg-[rgba(0,66,37,0.02)] transition-colors">
                    {/* Stylized monogram badge */}
                    <div
                      className="w-11 h-11 rounded-lg flex-shrink-0 flex items-center justify-center relative overflow-hidden"
                      style={{ background: course.color }}
                    >
                      {/* Subtle inner highlight */}
                      <div
                        className="absolute inset-0 rounded-lg"
                        style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.2)' }}
                      />
                      {/* Corner ornament lines */}
                      <div className="absolute top-1.5 left-1.5 w-2 h-2" style={{ borderTop: '1px solid rgba(255,255,255,0.25)', borderLeft: '1px solid rgba(255,255,255,0.25)' }} />
                      <div className="absolute bottom-1.5 right-1.5 w-2 h-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.25)', borderRight: '1px solid rgba(255,255,255,0.25)' }} />
                      <span
                        className="relative z-10 text-white text-[13px] font-black"
                        style={{ letterSpacing: '0.12em', fontFamily: 'Georgia, "Times New Roman", serif', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
                      >
                        {course.initials}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{course.name}</p>
                      <p className="text-xs text-muted-foreground">{course.meta}</p>
                    </div>
                    <span
                      className="flex-shrink-0 text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-full font-semibold"
                      style={{ background: 'rgba(0,90,50,0.08)', color: '#005A32' }}
                    >
                      {course.tag}
                    </span>
                    <ArrowRight className="flex-shrink-0 ml-1 text-primary/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  href="/golf-courses/bangkok"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  Browse all Bangkok courses <ArrowRight />
                </Link>
                <Link
                  href="/golf-courses"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  All {totalCourses} Thailand courses <ArrowRight />
                </Link>
              </div>
            </div>
          </div>

          {/* ── BEFORE YOU FLY ── full-width below the 2-col grid ── */}
          <div className="mt-16 pt-12" style={{ borderTop: '1px solid rgba(0,66,37,0.08)' }}>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
              <div>
                <h3 className="text-xl font-bold text-[#004225] mb-2">Before you fly</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                  Two things to sort before you book: whether to bring your clubs (most airlines charge a sports equipment fee) and whether you need a visa.
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <ResourceCard
                href="/guide/golf-club-baggage-fees-airlines-bangkok"
                cat="Airlines & Baggage"
                title="Golf club baggage fees — every major airline to Bangkok compared"
                desc="Current fees for Thai Airways, Emirates, Qatar, Singapore Airlines, and more."
                variant="gold"
              />
              <ResourceCard
                href="/faq/can-you-bring-golf-clubs-as-checked-baggage-thailand"
                cat="FAQ"
                title="Can you bring golf clubs as checked baggage to Thailand?"
                desc="Allowances, packing rules, hard case vs soft case — everything you need to know."
                variant="gold"
              />
              <ResourceCard
                href="/faq/cost-to-fly-with-golf-clubs-to-thailand"
                cat="FAQ"
                title="How much does it cost to fly with golf clubs to Thailand?"
                desc="Actual baggage fees by airline, plus tips for keeping costs down."
                variant="gold"
              />
              <ResourceCard
                href="/guide/how-to-pack-golf-clubs-flight-thailand"
                cat="Packing Guide"
                title="How to pack golf clubs for a flight to Thailand"
                desc="Hard case vs soft case, what to protect, and how to avoid damage claims."
                variant="gold"
              />
              <ResourceCard
                href="/guide/best-time-play-golf-thailand"
                cat="Planning Guide"
                title="Best time of year to play golf in Thailand"
                desc="Month-by-month breakdown with temperature, humidity, and rainfall data."
                variant="green"
              />
              <ResourceCard
                href="/guide/golf-weather-bangkok-by-month"
                cat="Planning Guide"
                title="Golf weather in Bangkok by month"
                desc="Temperature, rainfall, and humidity data for every month of the year."
                variant="green"
              />
            </div>
            {/* Visa quick note — spans full width */}
            <div
              className="mt-3 rounded-lg border p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
              style={{ borderColor: 'rgba(0,66,37,0.08)', background: 'rgba(245,240,232,0.6)' }}
            >
              <div>
                <p
                  className="text-[10px] uppercase tracking-widest mb-1.5 font-medium"
                  style={{ color: '#C8A050', fontFamily: 'var(--font-mono, monospace)' }}
                >
                  Visa quick note
                </p>
                <p className="text-sm text-foreground leading-relaxed max-w-2xl">
                  Most nationalities receive <strong>60 days visa-free</strong> on arrival in Thailand (2026). UK, US, EU, Australian, Japanese, and Korean passports all qualify. Confirm your passport before booking.
                </p>
              </div>
              <Link
                href="/faq/thailand-visa-guide-golf-tourists"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline whitespace-nowrap flex-shrink-0 self-start sm:mt-6"
              >
                Full visa guide <ArrowRight />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── PULLQUOTE BREAK ───────────────────────────────────────── */}
      <div
        className="py-16 lg:py-20 text-center relative overflow-hidden"
        style={{ background: '#004225' }}
      >
        {/* Large decorative quote mark */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 font-black text-white pointer-events-none select-none leading-none"
          style={{ fontSize: '280px', opacity: 0.03 }}
          aria-hidden="true"
        >
          &ldquo;
        </div>
        <div className="section-max-width section-padding relative z-10">
          <blockquote className="max-w-3xl mx-auto">
            <p className="text-xl lg:text-3xl font-bold text-white/80 leading-snug mb-4">
              &ldquo;Thailand has over 250 golf courses. The challenge is not finding somewhere to play —{' '}
              <span style={{ color: '#C8A050' }}>
                it is knowing which ones are worth your limited time.
              </span>
              &rdquo;
            </p>
            <footer
              className="text-[11px] uppercase tracking-widest"
              style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono, monospace)' }}
            >
              Golf in Thailand Guide &nbsp;·&nbsp; LENGOLF
            </footer>
          </blockquote>
        </div>
      </div>

      {/* ── STAGE 2: BOOK ─────────────────────────────────────────── */}
      <section id="stage-book" className="py-20 lg:py-28 bg-white" style={{ scrollMarginTop: '72px' }}>
        <div className="section-max-width section-padding">
          <StageBadge num={2} label="Book" />
          <h2 className="text-3xl font-black uppercase leading-none text-[#004225] mb-4 lg:text-5xl">
            Book your <span className="text-[#4A8B6F]">game.</span>
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-xl leading-relaxed mb-14">
            How to secure tee times, where to get the best prices, whether to bring your clubs or rent, and how to book LENGOLF for an evening or rainy-day session.
          </p>

          <div
            className="grid lg:grid-cols-2 gap-0 mb-16 rounded-xl overflow-hidden border"
            style={{ borderColor: 'rgba(0,66,37,0.1)' }}
          >

            {/* Left: how to book tee times */}
            <div className="p-8 lg:p-10 bg-[#F9F7F2] border-b lg:border-b-0 lg:border-r" style={{ borderColor: 'rgba(0,66,37,0.08)' }}>
              <div
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-4 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(74,139,111,0.12)', color: '#2A6B4F', fontFamily: 'var(--font-mono, monospace)' }}
              >
                Step-by-step
              </div>
              <h3 className="text-xl font-bold text-[#004225] mb-3">How to book tee times</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Thai golf courses range from walk-up friendly to book-months-in-advance. Here is how the process works and where to find the best prices.
              </p>

              <ol className="flex flex-col divide-y" style={{ borderColor: 'rgba(0,66,37,0.07)' }}>
                {[
                  {
                    head: 'Choose your booking platform',
                    body: 'GolfNow and GolfAsian list most major Bangkok-area courses and often offer last-minute deals. For top courses like Black Mountain, booking direct is usually cheapest — they rarely discount through third parties.',
                    tag: 'See platform comparison below',
                    tagHref: '/guide/how-to-book-golf-tee-times-thailand',
                  },
                  {
                    head: 'Book 2–4 weeks ahead in peak season',
                    body: 'November to February is peak golf season. Black Mountain and Banyan fill up weeks in advance on weekends. For hot or rainy season (Mar–Oct), same-week booking is usually fine.',
                    tag: 'Peak: Nov–Feb',
                    tagHref: null,
                  },
                  {
                    head: 'Understand what is included in the green fee',
                    body: 'Most Thai courses include a caddie in the green fee — this is not optional. Cart hire is often extra. Budget for a caddie tip of ฿300–500 per round, which is customary and expected.',
                    tag: 'Caddie tipping is standard',
                    tagHref: '/faq/how-much-tip-caddie-thailand',
                  },
                  {
                    head: 'Consider LENGOLF for evenings and rainy days',
                    body: 'When afternoon heat or rain rules out outdoor golf, LENGOLF\'s simulator bays at BTS Chidlom are a 2-minute walk from the station.',
                    tag: 'Book online',
                    tagHref: BOOKING_URL,
                    external: true,
                  },
                ].map((step, i) => (
                  <div key={step.head} className="flex gap-4 py-5">
                    <div
                      className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-semibold"
                      style={{ border: '1.5px solid rgba(0,66,37,0.15)', background: '#F5F0E8', color: '#005A32', fontFamily: 'var(--font-mono, monospace)', marginTop: '2px' }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#004225] mb-1.5">{step.head}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-2">{step.body}</p>
                      {step.tagHref && (
                        step.external ? (
                          <a
                            href={step.tagHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-[10px] uppercase tracking-wide px-3 py-1 rounded-full font-semibold transition-colors hover:bg-[#4A8B6F]/20"
                            style={{ background: 'rgba(74,139,111,0.1)', color: '#2A6B4F', fontFamily: 'var(--font-mono, monospace)' }}
                          >
                            {step.tag} ↗
                          </a>
                        ) : (
                          <Link
                            href={step.tagHref as Parameters<typeof Link>[0]['href']}
                            className="inline-block text-[10px] uppercase tracking-wide px-3 py-1 rounded-full font-semibold transition-colors hover:bg-[#4A8B6F]/20"
                            style={{ background: 'rgba(74,139,111,0.1)', color: '#2A6B4F', fontFamily: 'var(--font-mono, monospace)' }}
                          >
                            {step.tag}
                          </Link>
                        )
                      )}
                      {!step.tagHref && (
                        <span
                          className="inline-block text-[10px] uppercase tracking-wide px-3 py-1 rounded-full font-semibold"
                          style={{ background: 'rgba(74,139,111,0.1)', color: '#2A6B4F', fontFamily: 'var(--font-mono, monospace)' }}
                        >
                          {step.tag}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </ol>
            </div>

            {/* Right: booking platforms */}
            <div className="p-8 lg:p-10 bg-white">
              <div
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold mb-4 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(200,160,80,0.12)', color: '#7A5A10', fontFamily: 'var(--font-mono, monospace)' }}
              >
                Platforms compared
              </div>
              <h3 className="text-xl font-bold text-[#004225] mb-5">Where to book</h3>
              <div className="flex flex-col gap-3">
                {[
                  {
                    name: 'GolfNow Thailand',
                    desc: 'Largest selection, last-minute deals, good for flexibility',
                    tag: 'Best selection',
                    href: 'https://www.golfnow.com',
                    abbr: 'GN',
                    bg: '#1A3D6A',
                  },
                  {
                    name: 'GolfAsian',
                    desc: 'Specialists in SE Asia golf tours, packages, and transfers',
                    tag: 'Best for packages',
                    href: 'https://www.golfasian.com',
                    abbr: 'GA',
                    bg: '#2A5A3C',
                  },
                  {
                    name: 'Black Mountain Direct',
                    desc: 'Book at blackmountaingolfclub.com for best rates',
                    tag: 'Direct booking',
                    href: 'https://www.blackmountaingolfclub.com',
                    abbr: 'BM',
                    bg: '#3A3A2A',
                  },
                  {
                    name: 'LENGOLF Online Booking',
                    desc: 'Simulator bays at Mercury Ville — book a bay in 2 minutes',
                    tag: 'Indoor option',
                    href: BOOKING_URL,
                    abbr: 'LG',
                    bg: '#005A32',
                  },
                ].map((p) => (
                  <a
                    key={p.name}
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-lg border p-4 transition-all hover:shadow-md hover:border-primary/20"
                    style={{ borderColor: 'rgba(0,66,37,0.08)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: p.bg }}
                    >
                      {p.abbr}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                    <span
                      className="flex-shrink-0 text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-full font-semibold whitespace-nowrap"
                      style={{ background: 'rgba(200,160,80,0.12)', color: '#7A5A10' }}
                    >
                      {p.tag}
                    </span>
                  </a>
                ))}
              </div>

              <ResourceCard
                href="/guide/how-to-book-golf-tee-times-thailand"
                cat="Booking Guide"
                title="How to book golf tee times in Thailand — the full guide"
                desc="Platform comparison, when to book, caddie culture, and common mistakes."
                variant="green"
              />
              <ResourceCard
                href="/cost/how-much-does-golf-cost-bangkok"
                cat="Cost Guide"
                title="How much does a round of golf cost in Bangkok?"
                desc="Green fees, caddie fees, cart hire, and total cost breakdown for Bangkok courses."
                variant="gold"
              />
            </div>
          </div>

          {/* ── CLUBS FEATURE BLOCK ─── */}
          <div
            className="rounded-xl overflow-hidden grid lg:grid-cols-2"
            style={{ background: '#004225' }}
          >
            {/* Content */}
            <div className="p-8 lg:p-12">
              <div
                className="flex items-center gap-2 mb-4 text-[10px] uppercase tracking-widest font-semibold"
                style={{ color: '#C8A050', fontFamily: 'var(--font-mono, monospace)' }}
              >
                <ArrowRight />
                The big question
              </div>
              <h3
                className="text-2xl lg:text-3xl font-bold text-white leading-snug mb-4"
                style={{ fontFamily: 'var(--font-display, serif)' }}
              >
                Bring your clubs to Thailand — or rent when you arrive?
              </h3>
              <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Most airlines treat golf clubs as sports equipment and charge an extra fee each way. For short Bangkok-focused trips it rarely makes financial or logistical sense. For longer multi-course trips, your own set has real advantages.
              </p>

              <table className="w-full text-sm mb-8">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th className="text-left pb-2 text-xs uppercase tracking-wider font-medium" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono, monospace)' }}>Your trip</th>
                    <th className="text-right pb-2 text-xs uppercase tracking-wider font-medium" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono, monospace)' }}>Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Day trip — 1 outdoor round', 'Rent at course', false],
                    ['Short stay — 2–4 nights, 1–2 rounds', 'Rent locally', false],
                    ['Golf-focused week — 5+ rounds at multiple courses', 'Bring your own', true],
                    ['Bangkok as one stop on a wider Asia trip', 'Rent locally', false],
                  ].map(([trip, verdict, bring]) => (
                    <tr key={trip as string} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td className="py-2.5 pr-4" style={{ color: 'rgba(255,255,255,0.7)' }}>{trip as string}</td>
                      <td className="py-2.5 text-right">
                        <span
                          className="text-[10px] uppercase tracking-wide font-bold"
                          style={{ color: bring ? '#7ABA8C' : '#E8A87C', fontFamily: 'var(--font-mono, monospace)' }}
                        >
                          {verdict as string}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex flex-col gap-2.5">
                {[
                  { label: 'Should you bring golf clubs to Thailand or rent?', href: '/faq/should-i-bring-golf-clubs-to-thailand-or-rent' },
                  { label: 'Can I rent golf clubs in Bangkok?', href: '/faq/can-i-rent-golf-clubs-in-bangkok' },
                  { label: 'Golf club rental in Bangkok — where to rent and what it costs', href: '/guide/golf-club-rental-bangkok-guide' },
                  { label: 'Renting clubs at Thai golf courses — what to expect', href: '/guide/renting-golf-clubs-thai-golf-courses' },
                  { label: 'Golf club baggage fees — every major airline compared', href: '/guide/golf-club-baggage-fees-airlines-bangkok' },
                  { label: 'Cost of renting golf clubs in Bangkok', href: '/cost/cost-of-renting-golf-clubs-bangkok' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href as Parameters<typeof Link>[0]['href']}
                    className="flex items-center justify-between rounded-md px-4 py-3 text-sm font-medium transition-colors"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)' }}
                  >
                    {link.label}
                    <ArrowRight className="flex-shrink-0 ml-3 text-[#C8A050]" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Image side */}
            <div className="relative min-h-[300px] flex flex-col justify-end overflow-hidden">
              <Image
                src="https://bisimqmtxjsptehhqpeg.supabase.co/storage/v1/object/public/website-assets/golf/hero-course-rental.webp"
                alt="Golf clubs ready for a round at a Thai course"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Dark gradient overlay from bottom */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(0,30,15,0.9) 0%, rgba(0,30,15,0.3) 50%, transparent 100%)' }}
              />
              <div className="relative z-10 p-6">
                <p
                  className="text-[10px] uppercase tracking-widest mb-1.5 font-semibold"
                  style={{ color: '#C8A050', fontFamily: 'var(--font-mono, monospace)' }}
                >
                  LENGOLF club rental
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Callaway Warbird (men&apos;s) and Majesty Shuttle (women&apos;s) from ฿150/hr for simulator sessions. Callaway Paradym Forged Carbon available as a premium upgrade. Course rental from ฿1,200/day.
                </p>
                <Link
                  href="/golf-course-club-rental"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-white/60 hover:text-white transition-colors"
                >
                  Rent clubs for a course <ArrowRight />
                </Link>
              </div>
            </div>
          </div>

          {/* ── HOTELS STRIP ─── */}
          <div className="mt-16">
            <h3 className="text-xl font-bold text-[#004225] mb-2">Stay in Bangkok, play everywhere</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-2xl">
              Bangkok is the best base for a Thailand golf trip. Most top courses are within 45–90 minutes by road, and the city&apos;s central hotels put you within reach of everything.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  area: 'Ratchaprasong / Chidlom',
                  name: 'Grand Hyatt, InterContinental, Renaissance',
                  desc: 'Walk directly to LENGOLF in under 8 minutes. The closest hotels to our Mercury Ville location.',
                  href: '/hotels/#ratchaprasong-chidlom',
                  gradient: 'linear-gradient(135deg, #1A4D30 0%, #005A32 100%)',
                },
                {
                  area: 'Langsuan / Wireless Road',
                  name: 'Sindhorn Midtown, Kimpton, Athenee, Okura',
                  desc: '8–12 min walk or one BTS stop to Chidlom. Quiet residential streets close to Lumpini Park.',
                  href: '/hotels/#langsuan-chidlom',
                  gradient: 'linear-gradient(135deg, #2A3A2A 0%, #3A5A3A 100%)',
                },
                {
                  area: 'Sukhumvit / Siam',
                  name: 'Novotel Ploenchit, Mercure Siam',
                  desc: 'One BTS stop to Chidlom — 10 minutes door-to-door. Great base for exploring the wider city.',
                  href: '/hotels/#sukhumvit-ploenchit',
                  gradient: 'linear-gradient(135deg, #1A3050 0%, #2A4A70 100%)',
                },
              ].map((h) => (
                <Link
                  key={h.area}
                  href={h.href as Parameters<typeof Link>[0]['href']}
                  className="group rounded-lg border overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 flex flex-col"
                  style={{ borderColor: 'rgba(0,66,37,0.08)' }}
                >
                  <div
                    className="h-28 relative flex items-end p-3"
                    style={{ background: h.gradient }}
                  >
                    {/* BTS line badge */}
                    <span
                      className="absolute top-3 right-3 text-[9px] uppercase tracking-wider px-2 py-1 rounded font-bold"
                      style={{ background: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)' }}
                    >
                      BTS accessible
                    </span>
                    <span
                      className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded"
                      style={{ background: 'rgba(0,0,0,0.5)', color: '#C8A050', backdropFilter: 'blur(4px)' }}
                    >
                      {h.area}
                    </span>
                  </div>
                  <div className="bg-white p-4 flex-1">
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-1">{h.name}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{h.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div
              className="mt-4 rounded-lg border-l-2 p-4"
              style={{ borderLeftColor: '#C8A050', background: 'rgba(200,160,80,0.05)', borderColor: 'rgba(200,160,80,0.15)' }}
            >
              <p
                className="text-[10px] uppercase tracking-widest mb-1.5 font-semibold"
                style={{ color: '#C8A050', fontFamily: 'var(--font-mono, monospace)' }}
              >
                LENGOLF tip
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                Staying near BTS Chidlom means you can warm up or wind down every evening at LENGOLF — a 2-minute walk from most Ploenchit hotels.{' '}
                <Link href="/hotels/" className="font-semibold text-primary hover:underline">
                  Browse Bangkok hotels near LENGOLF
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STAGE 3: TRAVEL ───────────────────────────────────────── */}
      <section id="stage-travel" className="py-20 lg:py-28 bg-[#F5F0E8]" style={{ scrollMarginTop: '72px' }}>
        <div className="section-max-width section-padding">
          <StageBadge num={3} label="Travel" />
          <h2 className="text-3xl font-black uppercase leading-none text-[#004225] mb-4 lg:text-5xl">
            Getting there &amp;{' '}
            <span className="text-[#E87B4A]">travelling around.</span>
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-xl leading-relaxed mb-14">
            From the moment you land to the moment you tee off — airport transfers, Bangkok navigation, and getting to courses outside the city.
          </p>

          <div className="grid lg:grid-cols-2 gap-12">

            {/* Left: airports */}
            <div>
              <h3 className="text-xl font-bold text-[#004225] mb-5">From the airport to Bangkok</h3>

              {/* Suvarnabhumi */}
              <div className="rounded-lg border overflow-hidden mb-4" style={{ borderColor: 'rgba(0,66,37,0.1)' }}>
                <div
                  className="flex items-center justify-between px-5 py-4"
                  style={{ background: '#004225' }}
                >
                  <p className="text-sm font-bold text-white">Suvarnabhumi (BKK) — Main international airport</p>
                  <span
                    className="text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ml-3"
                    style={{ background: '#C8A050', color: '#1C1C1C' }}
                  >
                    Most flights
                  </span>
                </div>
                <div className="divide-y bg-white" style={{ borderColor: 'rgba(0,66,37,0.06)' }}>
                  {[
                    { mode: 'Rail', name: 'Airport Rail Link (City Line)', desc: 'To Phaya Thai then BTS to Chidlom. Works for standard luggage — awkward with large golf bags.', time: '45 min', cost: '฿45' },
                    { mode: 'Grab', name: 'Grab / Taxi', desc: 'Best option with golf bags. Use Grab XL for bags. Metered taxi queue at arrivals — avoid touts.', time: '35–70 min', cost: '฿350–600' },
                    { mode: 'Van', name: 'Private transfer', desc: 'Pre-booked van — ideal for groups or anyone with multiple bags. Book through hotel.', time: '40–60 min', cost: '฿900–1,500' },
                  ].map((r) => (
                    <div key={r.name} className="flex items-start gap-3 px-5 py-4">
                      <span
                        className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5"
                        style={{ background: 'rgba(0,90,50,0.06)', color: '#005A32', fontFamily: 'var(--font-mono, monospace)' }}
                      >
                        {r.mode}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground mb-0.5">{r.name}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
                      </div>
                      <div className="flex flex-col items-end flex-shrink-0 ml-2">
                        <span className="text-sm font-semibold text-primary" style={{ fontFamily: 'var(--font-mono, monospace)' }}>{r.time}</span>
                        <span className="text-xs text-muted-foreground">{r.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Don Mueang */}
              <div className="rounded-lg border overflow-hidden mb-6" style={{ borderColor: 'rgba(0,66,37,0.1)' }}>
                <div className="px-5 py-4" style={{ background: '#004225' }}>
                  <p className="text-sm font-bold text-white">Don Mueang (DMK) — Budget airlines</p>
                </div>
                <div className="flex items-start gap-3 px-5 py-4 bg-white">
                  <span
                    className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5"
                    style={{ background: 'rgba(0,90,50,0.06)', color: '#005A32', fontFamily: 'var(--font-mono, monospace)' }}
                  >
                    Grab
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground mb-0.5">Grab / Taxi to Bangkok</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">No airport rail link. Budget extra time for evening arrivals — traffic can be heavy.</p>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0 ml-2">
                    <span className="text-sm font-semibold text-primary" style={{ fontFamily: 'var(--font-mono, monospace)' }}>45–90 min</span>
                    <span className="text-xs text-muted-foreground">฿300–500</span>
                  </div>
                </div>
              </div>

              <ResourceCard
                href="/guide/suvarnabhumi-airport-to-bangkok-golf"
                cat="Travel Guide"
                title="Getting from Suvarnabhumi Airport to Bangkok with golf clubs"
                desc="Full walkthrough with costs, timings, and what to do if your bags are oversized at the rail link."
                variant="orange"
              />
            </div>

            {/* Right: getting around + what to pack */}
            <div>
              <h3 className="text-xl font-bold text-[#004225] mb-5">Getting around Bangkok</h3>

              <div className="flex flex-col divide-y mb-10" style={{ borderColor: 'rgba(0,66,37,0.07)' }}>
                {[
                  {
                    head: 'BTS Skytrain for daily movement',
                    body: 'Fast, air-conditioned, no traffic. Buy a Rabbit card for faster payments. LENGOLF is at BTS Chidlom Exit 4 — Sukhumvit and Silom lines both connect here.',
                  },
                  {
                    head: 'Grab for golf course trips',
                    body: 'Grab works seamlessly in Bangkok. For courses outside the city, book a Grab Car Plus or Just Van — they fit golf bags. Most drivers accept the destination without issue.',
                  },
                  {
                    head: 'Transfers to Hua Hin courses',
                    body: 'Black Mountain and Banyan are 90 minutes south of Bangkok. Many golfers book a minivan transfer through their hotel or the course directly — around ฿2,000–3,000 each way.',
                  },
                ].map((t) => (
                  <div key={t.head} className="flex gap-3 py-5">
                    <div
                      className="w-8 h-8 rounded-lg flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(0,90,50,0.06)' }}
                    />
                    <div>
                      <p className="text-sm font-bold text-[#004225] mb-1.5">{t.head}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{t.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold text-[#004225] mb-5">What to pack</h3>
              <div className="grid grid-cols-2 gap-3">
                {/* UV sun protection */}
                <div className="rounded-lg border bg-white p-3 flex items-start gap-3" style={{ borderColor: 'rgba(0,66,37,0.08)' }}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center" style={{ background: 'rgba(200,160,80,0.12)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8A050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">UV sun protection</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Thai sun is intense even in dry season</p>
                  </div>
                </div>
                {/* Smart casual clothing */}
                <div className="rounded-lg border bg-white p-3 flex items-start gap-3" style={{ borderColor: 'rgba(0,66,37,0.08)' }}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center" style={{ background: 'rgba(0,66,37,0.07)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#004225" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Smart casual clothing</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Collared shirts required at most Thai courses</p>
                  </div>
                </div>
                {/* Golf shoes */}
                <Link href="/faq/golf-shoes-thailand" className="rounded-lg border bg-white p-3 flex items-start gap-3 hover:shadow-sm transition-shadow" style={{ borderColor: 'rgba(0,66,37,0.08)' }}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center" style={{ background: 'rgba(0,66,37,0.07)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#004225" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 11l19-9-9 19-2-8-8-2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Golf shoes</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Spikeless works fine at simulators</p>
                  </div>
                </Link>
                {/* Hydration */}
                <div className="rounded-lg border bg-white p-3 flex items-start gap-3" style={{ borderColor: 'rgba(0,66,37,0.08)' }}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center" style={{ background: 'rgba(74,139,111,0.12)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A8B6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 2a10 10 0 0 1 0 20A10 10 0 0 1 12 2z"/><path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Hydration</p>
                    <p className="text-xs text-muted-foreground mt-0.5">You will sweat more than you expect</p>
                  </div>
                </div>
                {/* Insect repellent */}
                <div className="rounded-lg border bg-white p-3 flex items-start gap-3" style={{ borderColor: 'rgba(0,66,37,0.08)' }}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center" style={{ background: 'rgba(232,123,74,0.1)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E87B4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M10.5 2.5a4 4 0 0 1 3 0"/><path d="M12 6v6"/><path d="M6 10c0 4 2 7 6 8s6-4 6-8"/><path d="M3 12l3-2M21 12l-3-2"/><path d="M4 17l2-1M20 17l-2-1"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Insect repellent</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Especially for courses in lush/jungle settings</p>
                  </div>
                </div>
                {/* Wide-brim hat */}
                <div className="rounded-lg border bg-white p-3 flex items-start gap-3" style={{ borderColor: 'rgba(0,66,37,0.08)' }}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center" style={{ background: 'rgba(200,160,80,0.12)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8A050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 2a7 7 0 0 1 7 7c0 4-3 6-7 6s-7-2-7-6a7 7 0 0 1 7-7z"/><path d="M3 15h18"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Wide-brim hat</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Essential for afternoon rounds Mar–May</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <ResourceCard
                  href="/guide/what-to-wear-golf-thailand"
                  cat="Packing Guide"
                  title="What to wear for golf in Thailand — dress codes explained"
                  desc="Collared shirts, dress codes by course, and what to wear at golf simulators vs outdoor courses."
                  variant="orange"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STAGE 4: ON THE GROUND ────────────────────────────────── */}
      <section
        id="stage-ground"
        className="py-20 lg:py-28"
        style={{ background: '#004225', scrollMarginTop: '72px' }}
      >
        <div className="section-max-width section-padding">
          <StageBadge num={4} label="On the Ground" />
          <h2 className="text-3xl font-black uppercase leading-none text-white mb-4 lg:text-5xl">
            On the ground{' '}
            <span style={{ color: '#C8A050' }}>in Thailand.</span>
          </h2>
          <p
            className="text-base lg:text-lg max-w-xl leading-relaxed mb-14"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Caddie culture, course etiquette, lessons, indoor golf, and corporate events — everything to make the most of your time on the course.
          </p>

          {/* Tab-driven article list */}
          <GroundTabsClient />
        </div>
      </section>

      {/* ── ALL GUIDES HUB ────────────────────────────────────────── */}
      <section id="all-guides" className="py-20 lg:py-28 bg-[#EDE7D6]" style={{ scrollMarginTop: '72px' }}>
        <div className="section-max-width section-padding">
          <div className="mb-12">
            <h2 className="text-3xl font-black uppercase leading-none text-[#004225] mb-3 lg:text-4xl">
              Complete guide index.
            </h2>
            <p className="text-base text-muted-foreground max-w-md leading-relaxed">
              Every article — guides, FAQs, and cost breakdowns — organised by journey stage.
            </p>
          </div>

          {/* Stage 1: Plan */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ background: '#C8A050' }}>1</span>
              <h3 className="text-base font-bold uppercase tracking-widest text-[#7A5A10]" style={{ fontFamily: 'var(--font-mono, monospace)' }}>Plan</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { href: '/guide/is-thailand-good-for-golf', cat: 'Overview', title: 'Is Thailand good for golf? — The honest guide', stage: 'plan' as const },
                { href: '/guide/best-time-play-golf-thailand', cat: 'Seasons', title: 'Best time of year to play golf in Thailand', stage: 'plan' as const },
                { href: '/guide/golf-bangkok-rainy-season', cat: 'Seasons', title: 'Golf in Bangkok during rainy season — what to expect', stage: 'plan' as const },
                { href: '/guide/golf-weather-bangkok-by-month', cat: 'Seasons', title: 'Golf weather in Bangkok by month', stage: 'plan' as const },
                { href: '/guide/golf-club-baggage-fees-airlines-bangkok', cat: 'Airlines', title: 'Golf club baggage fees — every major airline to Bangkok compared', stage: 'plan' as const },
                { href: '/faq/can-you-bring-golf-clubs-as-checked-baggage-thailand', cat: 'FAQ · Baggage', title: 'Can you bring golf clubs as checked baggage to Thailand?', stage: 'plan' as const },
                { href: '/guide/best-airlines-fly-golf-clubs-bangkok', cat: 'Airlines', title: 'Best airlines to fly with golf clubs to Bangkok', stage: 'plan' as const },
                { href: '/guide/how-to-pack-golf-clubs-flight-thailand', cat: 'Packing', title: 'How to pack golf clubs for a flight to Thailand', stage: 'plan' as const },
                { href: '/faq/thailand-visa-guide-golf-tourists', cat: 'Visa', title: 'Thailand visa guide for golf tourists', stage: 'plan' as const },
                { href: '/faq/thailand-entry-requirements-golfers', cat: 'Visa', title: 'Thailand entry requirements 2026 — quick guide for golfers', stage: 'plan' as const },
                { href: '/guide/best-golf-courses-near-bangkok', cat: 'Courses', title: 'Best golf courses near Bangkok — complete guide', stage: 'plan' as const },
                { href: '/guide/black-mountain-golf-club-hua-hin', cat: 'Course Guide', title: 'Black Mountain Golf Club Hua Hin — visitor guide', stage: 'plan' as const },
                { href: '/guide/banyan-golf-club-hua-hin', cat: 'Course Guide', title: 'Banyan Golf Club Hua Hin — what to expect', stage: 'plan' as const },
                { href: '/guide/nikanti-golf-club-bangkok', cat: 'Course Guide', title: 'Nikanti Golf Club Bangkok — review and visitor guide', stage: 'plan' as const },
                { href: '/guide/alpine-golf-club-bangkok', cat: 'Course Guide', title: 'Alpine Golf Club Bangkok — visitor guide', stage: 'plan' as const },
                { href: '/guide/thai-country-club-bangkok', cat: 'Course Guide', title: 'Thai Country Club Bangkok — visitor guide', stage: 'plan' as const },
                { href: '/guide/best-golf-courses-phuket', cat: 'Courses', title: 'Phuket golf courses — the best courses for visitors', stage: 'plan' as const },
                { href: '/guide/golf-courses-chiang-mai', cat: 'Courses', title: 'Chiang Mai golf guide — courses and tips', stage: 'plan' as const },
                { href: '/faq/how-many-golf-courses-thailand', cat: 'FAQ · Courses', title: 'How many golf courses are there in Thailand?', stage: 'plan' as const },
                { href: '/golf-courses', cat: 'Course Directory', title: `Browse all Thailand golf courses — ${totalCourses} courses across ${Object.keys(REGION_META).length} regions`, stage: 'plan' as const },
                { href: '/golf-courses/bangkok', cat: 'Bangkok', title: `Bangkok golf courses — ${REGION_META.bangkok.courseCount} courses near the capital`, stage: 'plan' as const },
                { href: '/golf-courses/pattaya', cat: 'Pattaya', title: `Pattaya & Eastern Seaboard golf courses — ${REGION_META.pattaya.courseCount} courses`, stage: 'plan' as const },
                { href: '/golf-courses/hua-hin', cat: 'Hua Hin', title: `Hua Hin & Cha-am golf courses — ${REGION_META['hua-hin'].courseCount} courses`, stage: 'plan' as const },
                { href: '/golf-courses/phuket', cat: 'Phuket', title: `Phuket golf courses — ${REGION_META.phuket.courseCount} courses on the island`, stage: 'plan' as const },
                { href: '/golf-courses/chiang-mai', cat: 'Chiang Mai', title: `Chiang Mai golf courses — ${REGION_META['chiang-mai'].courseCount} courses in the north`, stage: 'plan' as const },
                { href: '/golf-courses/khao-yai', cat: 'Khao Yai', title: `Khao Yai golf courses — ${REGION_META['khao-yai'].courseCount} courses in the highlands`, stage: 'plan' as const },
              ].map((card) => (
                <HubCard key={card.href} href={card.href} cat={card.cat} title={card.title} stage={card.stage} />
              ))}
            </div>
          </div>

          {/* Stage 2: Book */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ background: '#4A8B6F' }}>2</span>
              <h3 className="text-base font-bold uppercase tracking-widest text-[#2A6B4F]" style={{ fontFamily: 'var(--font-mono, monospace)' }}>Book</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { href: '/guide/how-to-book-golf-tee-times-thailand', cat: 'Booking', title: 'How to book golf tee times in Thailand', stage: 'book' as const },
                { href: '/guide/golfnow-thailand-review', cat: 'Platforms', title: 'GolfNow Thailand — does it work and is it the best price?', stage: 'book' as const },
                { href: '/faq/how-far-in-advance-book-golf-bangkok', cat: 'FAQ · Booking', title: 'How far in advance should you book golf in Bangkok?', stage: 'book' as const },
                { href: '/faq/last-minute-golf-tee-times-thailand', cat: 'FAQ · Booking', title: 'Is it cheaper to book golf in Thailand last minute?', stage: 'book' as const },
                { href: '/guide/round-of-golf-cost-bangkok', cat: 'Costs', title: 'How much does a round of golf cost in Bangkok?', stage: 'book' as const },
                { href: '/guide/green-fees-bangkok-golf-courses', cat: 'Costs', title: 'Green fees in Bangkok — all courses compared', stage: 'book' as const },
                { href: '/guide/bring-golf-clubs-thailand-or-rent', cat: 'Clubs', title: 'Should you bring golf clubs to Thailand or rent?', stage: 'book' as const },
                { href: '/guide/golf-club-rental-bangkok-guide', cat: 'Clubs', title: 'Golf club rental in Bangkok — where to rent and what it costs', stage: 'book' as const },
                { href: '/guide/renting-golf-clubs-thai-golf-courses', cat: 'Clubs', title: 'Renting golf clubs at Thai golf courses — what to expect', stage: 'book' as const },
                { href: '/faq/what-golf-clubs-available-rent-bangkok', cat: 'FAQ · Clubs', title: 'What golf clubs are available to rent in Bangkok?', stage: 'book' as const },
                { href: '/faq/are-rental-golf-clubs-good-enough', cat: 'FAQ · Clubs', title: 'Are rental golf clubs good enough for serious golfers?', stage: 'book' as const },
                { href: '/guide/best-bangkok-hotels-golfers', cat: 'Hotels', title: 'Best Bangkok hotels for golfers — stay central, play anywhere', stage: 'book' as const },
                { href: '/guide/golf-hotels-near-bangkok', cat: 'Hotels', title: 'Golf hotels near Bangkok — stay and play packages', stage: 'book' as const },
                { href: '/guide/hotels-near-hua-hin-golf-courses', cat: 'Hotels', title: 'Best hotels near Hua Hin golf courses', stage: 'book' as const },
              ].map((card) => (
                <HubCard key={card.href} href={card.href} cat={card.cat} title={card.title} stage={card.stage} />
              ))}
            </div>
          </div>

          {/* Stage 3: Travel */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ background: '#E87B4A' }}>3</span>
              <h3 className="text-base font-bold uppercase tracking-widest text-[#8A3A1A]" style={{ fontFamily: 'var(--font-mono, monospace)' }}>Travel</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { href: '/guide/suvarnabhumi-airport-to-bangkok-golf', cat: 'Airport', title: 'Getting from Suvarnabhumi Airport to Bangkok — golf traveller\'s guide', stage: 'travel' as const },
                { href: '/guide/don-mueang-airport-to-bangkok', cat: 'Airport', title: 'Don Mueang Airport to Bangkok — what golf travellers need to know', stage: 'travel' as const },
                { href: '/guide/bangkok-to-hua-hin-golf-transport', cat: 'Transport', title: 'Getting from Bangkok to Hua Hin for golf — all transport options', stage: 'travel' as const },
                { href: '/guide/bangkok-hotels-to-golf-courses-transport', cat: 'Transport', title: 'Getting from Bangkok hotels to golf courses', stage: 'travel' as const },
                { href: '/guide/bangkok-bts-guide-golfers', cat: 'Transport', title: 'Bangkok BTS guide for golfers — which line, which exit', stage: 'travel' as const },
                { href: '/faq/grab-vs-taxi-bangkok-golf', cat: 'FAQ · Transport', title: 'Grab vs taxi in Bangkok for golf trips — which is better?', stage: 'travel' as const },
                { href: '/guide/what-to-wear-golf-thailand', cat: 'Packing', title: 'What to wear for golf in Thailand — dress codes explained', stage: 'travel' as const },
                { href: '/faq/do-you-need-golf-travel-bag-thailand', cat: 'FAQ · Packing', title: 'Golf travel bag — do you need one for Thailand?', stage: 'travel' as const },
                { href: '/faq/golf-shoes-thailand', cat: 'FAQ · Packing', title: 'Golf shoes in Thailand — do you need to bring your own?', stage: 'travel' as const },
              ].map((card) => (
                <HubCard key={card.href} href={card.href} cat={card.cat} title={card.title} stage={card.stage} />
              ))}
            </div>
          </div>

          {/* Stage 4: On the Ground */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ background: '#005A32' }}>4</span>
              <h3 className="text-base font-bold uppercase tracking-widest text-[#004225]" style={{ fontFamily: 'var(--font-mono, monospace)' }}>On the Ground</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { href: '/guide/thai-golf-course-etiquette', cat: 'Etiquette', title: 'Thai golf course etiquette — caddies, tipping, pace of play', stage: 'ground' as const },
                { href: '/faq/do-you-need-caddie-thailand-golf', cat: 'FAQ · Caddies', title: 'Do you need a caddie at Thai golf courses?', stage: 'ground' as const },
                { href: '/faq/how-much-tip-caddie-thailand', cat: 'FAQ · Caddies', title: 'How much to tip a caddie in Thailand', stage: 'ground' as const },
                { href: '/guide/first-time-golf-thailand', cat: 'First-Timer', title: 'What to expect playing golf in Thailand for the first time', stage: 'ground' as const },
                { href: '/faq/best-time-of-day-golf-bangkok', cat: 'FAQ · Courses', title: 'Best time of day to play golf in Bangkok', stage: 'ground' as const },
                { href: '/faq/golf-fitness-heat-thailand', cat: 'FAQ · Health', title: 'How fit do you need to be to play golf in Thailand\'s heat?', stage: 'ground' as const },
                { href: '/guide/best-golf-simulators-bangkok', cat: 'Indoor', title: 'Best golf simulators in Bangkok — compared', stage: 'ground' as const },
                { href: '/guide/golf-simulator-vs-real-course-bangkok', cat: 'Indoor', title: 'Golf simulators vs real courses in Bangkok — which should you do?', stage: 'ground' as const },
                { href: '/faq/where-play-golf-night-bangkok', cat: 'FAQ · Indoor', title: 'Where to play golf in Bangkok at night', stage: 'ground' as const },
                { href: '/guide/golf-lessons-bangkok-coaches', cat: 'Lessons', title: 'Golf lessons in Bangkok — best coaches and where to find them', stage: 'ground' as const },
                { href: '/faq/worth-taking-golf-lessons-bangkok-holiday', cat: 'FAQ · Lessons', title: 'Is it worth taking golf lessons in Bangkok on holiday?', stage: 'ground' as const },
                { href: '/guide/corporate-golf-events-bangkok', cat: 'Events', title: 'Corporate golf events in Bangkok — complete planning guide', stage: 'ground' as const },
                { href: '/guide/golf-tournament-packages-bangkok', cat: 'Events', title: 'Golf tournament packages in Bangkok', stage: 'ground' as const },
              ].map((card) => (
                <HubCard key={card.href} href={card.href} cat={card.cat} title={card.title} stage={card.stage} />
              ))}
            </div>
          </div>

          {/* General / Evergreen */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ background: '#004225' }}>✦</span>
              <h3 className="text-base font-bold uppercase tracking-widest text-[#004225]" style={{ fontFamily: 'var(--font-mono, monospace)' }}>General</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { href: '/guide/thailand-golf-trip-cost', cat: 'Costs', title: 'Thailand golf trip cost — full budget breakdown', stage: 'plan' as const },
                { href: '/guide/thailand-vs-bali-vs-vietnam-golf-holiday', cat: 'Comparison', title: 'Thailand vs Bali vs Vietnam for a golf holiday', stage: 'plan' as const },
                { href: '/guide/golf-thailand-beginners', cat: 'Beginners', title: 'Golf in Thailand for beginners — everything you need to know', stage: 'plan' as const },
                { href: '/guide/solo-golf-trip-thailand', cat: 'Trip Planning', title: 'Solo golf trip to Thailand — tips and advice', stage: 'plan' as const },
              ].map((card) => (
                <HubCard key={card.href} href={card.href} cat={card.cat} title={card.title} stage={card.stage} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section
        className="py-24 lg:py-32 relative overflow-hidden text-center"
        style={{ background: '#004225' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(45,122,79,0.4) 0%, transparent 60%)',
          }}
        />
        <div className="section-max-width section-padding relative z-10">
          <p
            className="text-[11px] uppercase tracking-widest mb-5 font-semibold"
            style={{ color: '#C8A050', fontFamily: 'var(--font-mono, monospace)' }}
          >
            LENGOLF — Mercury Ville @BTS Chidlom, Bangkok
          </p>
          <h2 className="text-4xl font-black uppercase leading-none text-white mb-5 lg:text-6xl">
            {"You've planned it."}<br />
            <span style={{ color: '#C8A050' }}>Now book it.</span>
          </h2>
          <p className="text-base lg:text-lg max-w-md mx-auto mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Whether you are warming up before your outdoor round or playing late when the courses have closed — LENGOLF is open daily until 11pm.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <BookingCTA
              text="Book a Bay"
              className="bg-[#C8A050] text-[#1C1C1C] hover:bg-[#D4B060] font-bold"
            />
            <Link
              href="/golf"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              View pricing <ArrowRight />
            </Link>
          </div>
          <p className="mt-6 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            No experience needed &nbsp;·&nbsp; Walk-ins welcome &nbsp;·&nbsp; Open daily 9am–11pm
          </p>
        </div>
      </section>

      {/* ── CROSS-LINKS ───────────────────────────────────────────── */}
      <section
        className="py-12 lg:py-16"
        style={{ background: '#EDE7D6', borderTop: '1px solid rgba(0,66,37,0.1)' }}
      >
        <div className="section-max-width section-padding text-center">
          <p
            className="text-[10px] uppercase tracking-widest mb-5 font-semibold"
            style={{ color: '#8A8070', fontFamily: 'var(--font-mono, monospace)' }}
          >
            Explore more
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { label: 'Things To Do in Bangkok', href: '/activities/' },
              { label: 'Hotels Near LENGOLF', href: '/hotels/' },
              { label: 'Bay Rates', href: '/golf' },
              { label: 'Events & Packages', href: '/events' },
              { label: 'Golf Lessons', href: '/lessons' },
              { label: 'Club Rental', href: '/golf-club-rental' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href as Parameters<typeof Link>[0]['href']}
                className="rounded-full border border-[rgba(0,66,37,0.15)] bg-white px-5 py-2.5 text-sm font-medium text-[#005A32] transition-colors hover:bg-primary hover:text-white hover:border-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
