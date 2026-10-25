import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import SectionWrapper from '@/components/shared/SectionWrapper'
import ImageGallery from '@/components/shared/ImageGallery'
import { storageUrl, SITE_URL, BUSINESS_INFO } from '@/lib/constants'
import { getAlternates, getCanonical, hasTranslationForLocale } from '@/lib/translated-routes'
import { getJuniorAcademyContent, JUNIOR_ACADEMY_PATH } from '@/data/junior-academy'
import { coaches } from '@/data/coaches'
import { getLessonPricingData, getLessonPriceFacts, lessonRowThb, type LessonPackage } from '@/data/pricing'
import { getLessonsPricingJsonLd, getLessonsServiceJsonLd, getFaqPageJsonLd, getBreadcrumbJsonLd, getCoachesJsonLd } from '@/lib/jsonld'
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
  // LessonsFaq.a7 in en/th; the phrase does not occur in ja/ko/zh.
  'Junior Academy page': { href: '/junior-golf-academy' },
  'หน้า Junior Academy': { href: '/junior-golf-academy' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Lessons' })
  const { lessonPricing } = await getLessonPricingData()
  const priceFacts = getLessonPriceFacts(lessonPricing)
  return {
    title: t('metaTitle'),
    description: t('metaDescription', priceFacts),
    alternates: {
      canonical: getCanonical(locale, '/lessons/'),
      languages: getAlternates('/lessons/'),
    },
    openGraph: siteOpenGraph({ images: [{ url: storageUrl('lessons/promo-free-trial.jpg'), alt: 'Golf lessons with PGA Pro at LENGOLF' }] }),
  }
}

// Each alt says what its printed card says, prices included, so it must change
// whenever the image file does.
const promoImages = [
  { src: storageUrl('lessons/promo-free-trial.jpg'), alt: 'Free 1-hour trial with our PGA Pro: simple and effective techniques, solid fundamentals, get course-ready fast. Book now on LINE' },
  { src: storageUrl('lessons/starter-package-2026-10.jpg'), alt: 'LENGOLF Starter Package: 5 coaching lesson hours and 5 hours of practice, plus 1 golf glove per golfer. 11,000 THB for 1 golfer, 13,500 THB for 2 golfers, valid for 6 months, VAT included' },
  { src: storageUrl('lessons/promo-coaching-package.jpg'), alt: 'LENGOLF 10 Hour Golf Lesson Package, 16,000 THB, simulator usage included, with expert guidance from PRO Boss (Thailand PGA certified). Master swing, short game and putting fundamentals, improve strength and conditioning, enhance lateral rotation, learn warm-up exercises, play courses with more confidence and hit precise shots consistently. Book on LINE' },
  { src: storageUrl('lessons/promo-lesson.jpg'), alt: 'LENGOLF From Sim to Fairway Package: 5 hours of indoor coaching plus 1 on-course lesson, 13,499 THB. Course fees, tips and carts (if required) for both the student and the coach are paid by the customer' },
]

// width/height are each file's real pixel size (measured 2026-10-13). ImageGallery
// sizes the desktop tiles from them, so a guessed value crops the photo. The
// gallery's `rows` must add up to this list's length: a leftover photo gets a
// full-width row of its own.
const studentImages = [
  { src: storageUrl('lessons/student-01.jpg'), alt: 'Student practicing iron shots with PRO Boss on golf simulator', width: 2560, height: 1440 },
  { src: storageUrl('lessons/student-02.jpg'), alt: 'Adult student working on swing technique during a coaching session', width: 2560, height: 1440 },
  { src: storageUrl('lessons/student-03.jpg'), alt: 'Coach analyzing student swing data on simulator screen', width: 1440, height: 2560 },
  { src: storageUrl('lessons/student-04.jpg'), alt: 'Student and coach reviewing shot trajectory after a drive', width: 1920, height: 3413 },
  { src: storageUrl('lessons/student-05.jpg'), alt: 'Beginner golfer learning proper grip and stance fundamentals', width: 1920, height: 3413 },
  { src: storageUrl('lessons/student-06.jpg'), alt: 'Junior golfer learning swing fundamentals with coach guidance', width: 1920, height: 2560 },
  { src: storageUrl('lessons/student-07.jpg'), alt: 'Young golfer practicing on simulator during junior development program', width: 1920, height: 2560 },
  { src: storageUrl('lessons/student-08.jpg'), alt: 'Student improving driving distance with simulator feedback', width: 1920, height: 2560 },
  { src: storageUrl('lessons/student-09.jpg'), alt: 'Student working on short game technique with coach', width: 1920, height: 2009 },
  { src: storageUrl('lessons/student-10.jpg'), alt: 'Advanced player refining shot shaping skills on simulator', width: 1920, height: 2560 },
  { src: storageUrl('lessons/student-11.jpg'), alt: 'Student receiving real-time swing feedback during lesson', width: 1920, height: 2560 },
  { src: storageUrl('lessons/student-kids-01.jpg'), alt: 'Coach showing a young boy how to hold the club in front of the simulator screen', width: 1440, height: 2560 },
  { src: storageUrl('lessons/student-kids-02.jpg'), alt: 'Coach crouching beside a boy, guiding his putter on the indoor putting green', width: 1440, height: 2560 },
  { src: storageUrl('lessons/student-kids-03.jpg'), alt: 'Boy swinging in a simulator bay while the coach watches from behind', width: 1440, height: 2560 },
]

const FAQ_COUNT = 15

export default async function LessonsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Lessons')
  const tFaq = await getTranslations('LessonsFaq')
  const tCommon = await getTranslations('Common')

  const { lessonPricing, lessonNotes: _ignoredLessonNotes } = await getLessonPricingData()
  // Per-hour figures quoted in copy (LessonsFaq.a2, the stat chips), derived
  // from the same live rows the pricing table renders.
  const priceFacts = getLessonPriceFacts(lessonPricing)
  // LessonsFaq.a9 also quotes the Starter and Sim to Fairway packages for 1
  // and 2 golfers, from the same rows (as GolfFaq.a10 does on /golf/).
  const rowThb = (name: string, field: 'oneGolfer' | 'twoGolfers') =>
    lessonRowThb(lessonPricing, name, field).toLocaleString('en-US')
  const faqValues = {
    ...priceFacts,
    starterTotal: rowThb('Starter Package*', 'oneGolfer'),
    starterTwoTotal: rowThb('Starter Package*', 'twoGolfers'),
    simToFairwayTotal: rowThb('Sim to Fairway*', 'oneGolfer'),
    simToFairwayTwoTotal: rowThb('Sim to Fairway*', 'twoGolfers'),
  }

  const faqItems = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    question: tFaq(`q${i + 1}`),
    answer: tFaq(`a${i + 1}`, faqValues),
  }))

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
  const serviceJsonLd = getLessonsServiceJsonLd(priceFacts)
  const faqJsonLd = getFaqPageJsonLd(faqItems)
  const coachesJsonLd = getCoachesJsonLd(
    coaches.map((coach) => {
      const education = t.raw(`coaches.${coach.i18nKey}.education`) as string[]
      return {
        key: coach.i18nKey,
        name: coach.fullName,
        alternateName: coach.name,
        jobTitle: t('coachJobTitle'),
        image: coach.photo,
        knowsAbout: t.raw(`coaches.${coach.i18nKey}.expertise`) as string[],
        knowsLanguage: coach.teachingLanguages,
        credentials: coach.credentialIndices.map((i) => education[i]),
        alumniOf: coach.alumniOf,
      }
    }),
    getCanonical(locale, '/lessons/'),
  )
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: t('heroTitle'), url: `${SITE_URL}/lessons/` },
  ])

  // The Junior Academy page is EN + TH only, so the callout renders only where
  // it can link to the reader's own language.
  const juniorCallout =
    locale === 'en' || hasTranslationForLocale(locale, JUNIOR_ACADEMY_PATH)
      ? getJuniorAcademyContent(locale).lessonsCallout
      : null

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
      {/* JSON-LD coaches (Person, worksFor the layout's business node) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(coachesJsonLd) }}
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

      {/* ── Free trial + Intro + Stat Chips ── */}
      <SectionWrapper>
        <div className="mx-auto max-w-4xl text-center">
          {/* Free trial, first thing under the hero. Booking route is LINE:
              coaching is not bookable on booking.len.golf. */}
          <div
            id="free-trial"
            className="mb-10 flex flex-col gap-6 rounded-xl border-2 border-primary/20 p-6 text-left md:flex-row md:items-center md:p-8"
            style={{ backgroundColor: '#F6FFFA' }}
          >
            <div className="flex-1">
              <span
                className="inline-block rounded px-3 py-1 text-xs font-bold uppercase tracking-widest text-white"
                style={{ backgroundColor: '#7CB342' }}
              >
                {t('trialBadge')}
              </span>
              <h2 className="mt-3 text-2xl font-bold lg:text-3xl" style={{ color: '#007429' }}>
                {t('trialTitle')}
              </h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{t('trialText')}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 md:max-w-[18rem]">
              <a
                href="https://lin.ee/uxQpIXn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-light"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                {t('trialCta')}
              </a>
              <p className="text-xs leading-relaxed text-muted-foreground">{t('trialHowTo')}</p>
            </div>
          </div>

          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            {t('introText')}
          </p>

          {/* Stat chips */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-4">
                <div className="text-2xl font-bold" style={{ color: '#007429' }}>{t(`stat${i}Value`, priceFacts)}</div>
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

          {/* Junior Academy: kids-golf searches land on this page today.
              Outside #free-trial and #lessons-cta, and no JSON-LD (smoke H2
              pins this page's structured data). */}
          {juniorCallout && (
            <div
              id="junior-academy"
              className="mt-12 flex flex-col overflow-hidden rounded-xl border-2 border-primary/20 text-left md:flex-row"
              style={{ backgroundColor: '#F6FFFA' }}
            >
              <div className="shrink-0 md:w-2/5">
                <Image
                  src={storageUrl('lessons/student-kids-02.jpg')}
                  alt={juniorCallout.imageAlt}
                  width={1440}
                  height={2560}
                  className="h-52 w-full object-cover md:h-full"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
              <div className="flex flex-col justify-center p-6 md:p-8">
                <span
                  className="inline-block w-fit rounded px-3 py-1 text-xs font-bold uppercase tracking-widest text-white"
                  style={{ backgroundColor: '#7CB342' }}
                >
                  {juniorCallout.badge}
                </span>
                <h2 className="mt-3 text-2xl font-bold lg:text-3xl" style={{ color: '#007429' }}>
                  {juniorCallout.title}
                </h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">{juniorCallout.body}</p>
                <Link
                  href="/junior-golf-academy"
                  className="mt-5 inline-flex min-h-12 w-fit items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
                >
                  {juniorCallout.cta}
                </Link>
              </div>
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* ── Meet the Coaches ── */}
      <section id="coaches" className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <h2 className="mb-4 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('ourCoachTitle')}</span>{' '}
            <span className="text-foreground">{t('ourCoachTitleSuffix')}</span>
          </h2>
          <p className="mx-auto mb-12 max-w-3xl text-center text-base leading-relaxed text-muted-foreground">
            {t('coachesIntro')}
          </p>
          <div className="space-y-20">
            {coaches.map((coach, i) => {
              const expertise = t.raw(`coaches.${coach.i18nKey}.expertise`) as string[]
              const achievements = t.raw(`coaches.${coach.i18nKey}.achievements`) as string[]
              const education = t.raw(`coaches.${coach.i18nKey}.education`) as string[]
              return (
              <div key={coach.nickname} id={`coach-${coach.i18nKey}`} className={`scroll-mt-24 flex flex-col items-start gap-8 lg:flex-row ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
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
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white px-3 py-1 text-xs font-medium" style={{ color: '#007429' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
                    {t('coachLanguages')}
                  </p>

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
      <section id="lessons-cta" className="py-12 lg:py-16 bg-primary">
        <div className="section-max-width section-padding text-center">
          <h2 className="mb-3 text-2xl font-bold text-white lg:text-3xl">{t('ctaTitle')}</h2>
          <p className="mb-6 text-white/80">{t('ctaSubtitle')}</p>
          {/* Booking goes to LINE (coaching is not bookable on
              booking.len.golf, which books bays only); the second button
              jumps to the free-trial callout. LessonsFaq.a5 still mentions
              booking.len.golf: kept by David's call, 2026-10-07. */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://lin.ee/uxQpIXn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-white text-primary px-8 text-sm font-semibold transition-colors hover:bg-white/90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {t('bookALesson')}
            </a>
            <a
              href="#free-trial"
              className="inline-flex h-12 items-center gap-2 rounded-md border-2 border-white px-8 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t('trialBadge')}
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
            <li>Free 1-Hour Trial: book a free 1-hour trial with a PGA-certified coach on LINE. Simple and effective techniques, solid fundamentals, get course-ready fast</li>
            <li>Starter Package: 5 hours coaching plus 5 hours practice, with a free golf glove per golfer, for {faqValues.starterTotal} THB (1 golfer) or {faqValues.starterTwoTotal} THB (2 golfers), valid for 6 months</li>
            <li>10 Hour Golf Lesson Package: {priceFacts.tenHourTotal} THB for 1 golfer ({priceFacts.tenHourRate} THB per hour), simulator usage included. Other packages run from a single hour at {priceFacts.hourly} THB to 50 hours at {priceFacts.fiftyHourRate} THB per hour</li>
            <li>From Sim to Fairway Package: 5 hours of indoor coaching plus 1 on-course lesson, {faqValues.simToFairwayTotal} THB for 1 golfer or {faqValues.simToFairwayTwoTotal} THB for 2 golfers. Course fees, tips and carts (if required) for both the student and the coach are paid by the customer</li>
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
        <ImageGallery images={studentImages} rows={[2, 4, 4, 4]} />
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
