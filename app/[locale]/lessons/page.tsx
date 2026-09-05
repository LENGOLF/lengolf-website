import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import SectionWrapper from '@/components/shared/SectionWrapper'
import ImageGallery from '@/components/shared/ImageGallery'
import { storageUrl, SITE_URL, BUSINESS_INFO } from '@/lib/constants'
import { getAlternates, getCanonical } from '@/lib/translated-routes'
import { coaches } from '@/data/coaches'
import { getLessonPricingData, type LessonPackage } from '@/data/pricing'
import { getLessonsPricingJsonLd, getLessonsServiceJsonLd, getFaqPageJsonLd, getBreadcrumbJsonLd } from '@/lib/jsonld'
import FaqSection from '@/components/shared/FaqSection'
import ClickableImage from '@/components/shared/ClickableImage'
import PricingTable from '@/components/shared/PricingTable'
import CourseRentalCrossLink from '@/components/shared/CourseRentalCrossLink'
import { siteOpenGraph } from '@/lib/open-graph'

// Daily. Declared explicitly so this page does not inherit its ISR interval
// from the pricing fetch in lib/pricing.ts, which is now 30 days: this page
// reads live prices via data/pricing.ts, and without this line a content or
// copy change here would stay unpublished for a month.
export const revalidate = 86400

const faqLinks: Record<string, { href: string; external?: boolean }> = {
  'booking.len.golf': { href: 'https://booking.len.golf/', external: true },
  '@lengolf': { href: 'https://lin.ee/uxQpIXn', external: true },
  'Google Maps': { href: BUSINESS_INFO.googleMapsUrl, external: true },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Lessons' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: getCanonical(locale, '/lessons/'),
      languages: getAlternates('/lessons/'),
    },
    openGraph: siteOpenGraph({ images: [{ url: storageUrl('lessons/promo-free-trial.jpg'), alt: 'Golf lessons with PGA Pro at LENGOLF' }] }),
  }
}

const promoImages = [
  { src: storageUrl('lessons/promo-free-trial.jpg'), alt: 'Free 1-hour trial lesson with a PGA Pro — simple techniques, solid fundamentals, get course-ready fast' },
  { src: storageUrl('lessons/promo-starter-package.jpg'), alt: 'Starter Package — 5 hours coaching plus 5 hours practice with free golf glove for 11,000 THB' },
  { src: storageUrl('lessons/promo-coaching-package.jpg'), alt: 'Coaching package options with hourly and multi-hour lesson bundles at LENGOLF' },
  { src: storageUrl('lessons/promo-lesson.jpg'), alt: 'Golf lesson promotion with PGA-certified coach on simulator bay' },
]

const studentImages = [
  { src: storageUrl('lessons/student-01.jpg'), alt: 'Student practicing iron shots with PRO Boss on golf simulator', width: 1200, height: 800 },
  { src: storageUrl('lessons/student-02.jpg'), alt: 'Adult student working on swing technique during a coaching session', width: 1200, height: 800 },
  { src: storageUrl('lessons/student-03.jpg'), alt: 'Coach analyzing student swing data on simulator screen', width: 1200, height: 800 },
  { src: storageUrl('lessons/student-04.jpg'), alt: 'Student and coach reviewing shot trajectory after a drive', width: 1200, height: 800 },
  { src: storageUrl('lessons/student-05.jpg'), alt: 'Beginner golfer learning proper grip and stance fundamentals', width: 1200, height: 800 },
  { src: storageUrl('lessons/student-06.jpg'), alt: 'Junior golfer learning swing fundamentals with coach guidance', width: 1200, height: 800 },
  { src: storageUrl('lessons/student-07.jpg'), alt: 'Young golfer practicing on simulator during junior development program', width: 1200, height: 800 },
  { src: storageUrl('lessons/student-08.jpg'), alt: 'Student improving driving distance with simulator feedback', width: 1200, height: 800 },
  { src: storageUrl('lessons/student-09.jpg'), alt: 'Student working on short game technique with coach', width: 1200, height: 800 },
  { src: storageUrl('lessons/student-10.jpg'), alt: 'Advanced player refining shot shaping skills on simulator', width: 1200, height: 800 },
  { src: storageUrl('lessons/student-11.jpg'), alt: 'Student receiving real-time swing feedback during lesson', width: 1200, height: 800 },
  { src: storageUrl('lessons/student-kids-01.jpg'), alt: 'Kids group lesson with age-appropriate golf instruction', width: 1200, height: 800 },
  { src: storageUrl('lessons/student-kids-02.jpg'), alt: 'Child learning to swing with junior-sized clubs on simulator', width: 1200, height: 800 },
  { src: storageUrl('lessons/student-kids-03.jpg'), alt: 'Junior coaching session focused on building proper swing mechanics', width: 1200, height: 800 },
]

const FAQ_COUNT = 14

export default async function LessonsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Lessons')
  const tFaq = await getTranslations('LessonsFaq')
  const tCommon = await getTranslations('Common')

  const faqItems = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    question: tFaq(`q${i + 1}`),
    answer: tFaq(`a${i + 1}`),
  }))

  const { lessonPricing, lessonNotes: _ignoredLessonNotes } = await getLessonPricingData()

  // ── Row-level i18n helpers (structured → translated display) ──
  // Names and remarks are translated via their `nameKind` / `remarkKind`
  // fields (set in data/pricing.ts). Keeps the lesson page decoupled from the
  // exact English text.
  const translateName = (row: LessonPackage): string => {
    switch (row.nameKind) {
      case 'hour':         return t('hourPackage', { n: row.nameHours ?? 0 })
      case 'starter':      return t('starterPackageName')
      case 'simToFairway': return t('simToFairwayName')
      default:             return row.name
    }
  }
  const translateRemark = (row: LessonPackage): string => {
    switch (row.remarkKind) {
      case 'dash':         return t('remarkDash')
      case 'validity':     return t('validForMonths', { n: row.remarkMonths ?? 0 })
      case 'starter':      return t('starterPackageRemark')
      case 'simToFairway': return t('simToFairwayRemark')
      default:             return row.remark
    }
  }
  const translatedLessonPricing = lessonPricing.map((p) => ({
    ...p,
    name: translateName(p),
    remark: translateRemark(p),
  }))
  const lessonNotes = [t('lessonNote1'), t('lessonNote2'), t('lessonNote3')]

  const lessonBadge = (row: LessonPackage) =>
    row.featured === 'bestValue' ? { label: tCommon('badgeBestValue'), tone: 'gold' as const } : null

  const pricingJsonLd = getLessonsPricingJsonLd(lessonPricing)
  const serviceJsonLd = getLessonsServiceJsonLd(lessonPricing[0]?.oneGolfer)
  const faqJsonLd = getFaqPageJsonLd(faqItems)
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: t('metaTitle'), url: `${SITE_URL}/lessons/` },
  ])

  return (
    <>
      {/* JSON-LD Pricing Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      {/* JSON-LD Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {/* JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── Hero ── */}
      <section className="relative flex h-[50vh] min-h-[400px] max-h-[550px] items-center text-white overflow-hidden">
        <Image
          src={storageUrl('lessons/hero-lessons.jpg')}
          alt="Golf coaching at LENGOLF"
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
        <div className="relative z-10 w-full text-left" style={{ paddingLeft: '4%', paddingRight: '4%' }}>
          <span
            className="inline-block rounded px-6 py-2 text-lg font-bold uppercase tracking-widest text-white mb-5 md:text-xl"
            style={{ backgroundColor: '#7CB342' }}
          >
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

      {/* ── Intro + Stat Chips ── */}
      <SectionWrapper>
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            {t('introText')}
          </p>

          {/* Stat chips */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-4">
                <div className="text-2xl font-bold" style={{ color: '#007429' }}>{t(`stat${i}Value`)}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t(`stat${i}Label`)}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://lin.ee/uxQpIXn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-8 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {t('bookALesson')}
            </a>
            <a
              href="#pricing"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-8 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
              {t('pricing')}
            </a>
          </div>
        </div>
      </SectionWrapper>

      {/* ── Our Coach ── */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <h2 className="mb-12 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('ourCoachTitle')}</span>{' '}
            <span className="text-foreground">{t('ourCoachTitleSuffix')}</span>
          </h2>
          <div className="space-y-20">
            {coaches.map((coach, i) => {
              const expertise = t.raw(`coaches.${coach.i18nKey}.expertise`) as string[]
              const achievements = t.raw(`coaches.${coach.i18nKey}.achievements`) as string[]
              const education = t.raw(`coaches.${coach.i18nKey}.education`) as string[]
              return (
              <div key={coach.nickname} className={`flex flex-col items-start gap-8 lg:flex-row ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="w-full lg:w-1/3">
                  <Image
                    src={coach.photo}
                    alt={coach.name}
                    width={400}
                    height={600}
                    className="w-full rounded-lg object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                <div className="w-full lg:w-2/3">
                  <h3
                    className="text-2xl font-bold italic"
                    style={{ color: '#007429' }}
                  >
                    {coach.name}
                  </h3>
                  <p className="text-muted-foreground">({coach.fullName})</p>

                  <div className="mt-6 grid gap-6 sm:grid-cols-3">
                    <div>
                      <h4 className="mb-2 font-semibold" style={{ color: '#007429' }}>{t('coachingExpertise')}</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {expertise.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold" style={{ color: '#007429' }}>{t('careerAchievements')}</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {achievements.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold" style={{ color: '#007429' }}>{t('education')}</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {education.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-4 gap-2">
                    {coach.gallery.map((img, j) => (
                      <Image
                        key={j}
                        src={img}
                        alt={`${coach.name} photo ${j + 1}`}
                        width={200}
                        height={150}
                        className="rounded-lg object-cover aspect-[4/3]"
                        sizes="(max-width: 1024px) 25vw, 16vw"
                      />
                    ))}
                  </div>
                </div>
              </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Our Lessons ── */}
      <SectionWrapper>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-8 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('ourLessonsTitle')}</span>{' '}
            <span className="text-foreground">{t('ourLessonsTitleSuffix')}</span>
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            {t('ourLessonsText')}
          </p>
        </div>
      </SectionWrapper>

      {/* ── Pricing Table ── */}
      <section id="pricing" className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('lessonPricingTitle')}</span>{' '}
            <span className="text-foreground">{t('lessonPricingTitleSuffix')}</span>
          </h2>
          <div className="mx-auto max-w-4xl">
            <PricingTable<LessonPackage>
              caption={t('pkgCaption')}
              rowKey={(row) => row.name}
              columns={[
                { key: 'name', label: t('pkgCourse'), primary: true, thClassName: 'whitespace-nowrap', tdClassName: 'whitespace-nowrap' },
                { key: 'oneGolfer', label: t('pkg1Golfer'), align: 'right', emphasis: true, thClassName: 'whitespace-nowrap', tdClassName: 'whitespace-nowrap' },
                { key: 'twoGolfers', label: t('pkg2Golfers'), align: 'right', thClassName: 'whitespace-nowrap', tdClassName: 'whitespace-nowrap' },
                { key: 'threeToFiveGolfers', label: t('pkg3To5Golfers'), align: 'right', thClassName: 'whitespace-nowrap', tdClassName: 'whitespace-nowrap' },
                { key: 'remark', label: t('pkgRemark') },
              ]}
              rows={translatedLessonPricing}
              notes={lessonNotes}
              badgeFor={lessonBadge}
            />
          </div>
        </div>
      </section>

      {/* ── CTA Band ── */}
      <section className="py-12 lg:py-16 bg-primary">
        <div className="section-max-width section-padding text-center">
          <h2 className="mb-3 text-2xl font-bold text-white lg:text-3xl">{t('ctaTitle')}</h2>
          <p className="mb-6 text-white/80">{t('ctaSubtitle')}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://booking.len.golf/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-white text-primary px-8 text-sm font-semibold transition-colors hover:bg-white/90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              {t('bookALesson')}
            </a>
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

      {/* ── Our Packages & Promotions ── */}
      <SectionWrapper>
        <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
          <span style={{ color: '#007429' }}>{t('packagesTitle')}</span>{' '}
          <span className="text-foreground">{t('packagesTitleSuffix')}</span>
        </h2>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
          {promoImages.map((img) => (
            <div key={img.src} className="overflow-hidden rounded-lg shadow-sm">
              <ClickableImage
                src={img.src}
                alt={img.alt}
                width={600}
                height={600}
                className="w-full"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
        <div className="sr-only">
          <h3>Current Lesson Promotions at LENGOLF</h3>
          <ul>
            <li>Free 1-Hour Trial Lesson: Try a complimentary lesson with a PGA-certified coach — simple techniques, solid fundamentals, get course-ready fast</li>
            <li>Starter Package: 5 hours coaching plus 5 hours practice with a free golf glove for 11,000 THB — valid for 6 months</li>
            <li>Coaching Packages: Hourly and multi-hour lesson bundles from 1,800 THB/hr, with volume discounts up to 50 hours</li>
            <li>Lesson Promotion: Book multiple sessions with PGA-certified coaches on simulator bays with real-time swing data</li>
          </ul>
        </div>
      </SectionWrapper>

      {/* ── FAQ ── */}
      <FaqSection items={faqItems} links={faqLinks} title={t('faqTitle')} titleSuffix={t('faqTitleSuffix')} bgColor="#F6FFFA" />

      {/* ── Course rental crosslink ──
          Routes traveler intent (esp. JA/KO/ZH searchers landing here on
          lesson queries) into the paid course rental funnel. Same component
          the location templates render (PR #41). */}
      <CourseRentalCrossLink />

      {/* ── Our Students ── */}
      <SectionWrapper>
        <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
          <span style={{ color: '#007429' }}>{t('studentsTitle')}</span>{' '}
          <span className="text-foreground">{t('studentsTitleSuffix')}</span>
        </h2>
        <ImageGallery images={studentImages} rows={[3, 2, 2, 2, 2, 3]} />
      </SectionWrapper>

      {/* ── Explore More ── */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <h2 className="mb-3 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('exploreTitle')}</span>{' '}
            <span className="text-foreground">{t('exploreTitleSuffix')}</span>
          </h2>
          <p className="mb-8 text-center text-sm text-muted-foreground">{t('exploreSubtitle')}</p>
          <div className="mx-auto max-w-xl">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { label: t('exploreBayRates'), href: '/golf' },
                { label: t('exploreEvents'), href: '/events' },
                { label: t('exploreClubRental'), href: '/golf-club-rental' },
                { label: t('exploreBlog'), href: '/blog' },
                { label: t('exploreBestWayToLearn'), href: '/faq/best-way-to-learn-golf-in-bangkok' },
                { label: t('exploreLessonPrices'), href: '/cost/golf-lesson-prices-bangkok' },
                { label: t('exploreBeginnersFaq'), href: '/faq/can-beginners-play-golf-simulators' },
                { label: t('explorePlanTrip'), href: '/golf-in-thailand-guide/' },
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
