import type { Metadata } from 'next'
import Image from 'next/image'
import RawLink from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  CalendarCheck,
  ChevronDown,
  CircleCheck,
  Clock,
  Eye,
  Feather,
  FlagTriangleRight,
  MapPin,
  Medal,
  MessageCircleMore,
  NotebookPen,
  PersonStanding,
  PhoneOff,
  Ruler,
  ScanFace,
  Snowflake,
  Target,
  TrainFront,
  Users,
} from 'lucide-react'
import { renderFaqAnswer } from '@/components/shared/FaqSection'
import {
  AcademyLockup,
  AgeSticker,
  JA,
  JA_SHADOW,
  JourneyMap,
  LineButton,
  Surface,
  Tape,
} from '@/components/junior-academy/Collage'
import HeroReel from '@/components/junior-academy/HeroReel'
import StickyLineBar from '@/components/junior-academy/StickyLineBar'
import { BUSINESS_INFO } from '@/lib/constants'
import { cn } from '@/lib/utils'
import {
  ALL_LOCALES,
  getAlternates,
  getCanonical,
  hasTranslationForLocale,
  OG_LOCALES,
  type Locale,
} from '@/lib/translated-routes'
import {
  getBreadcrumbJsonLd,
  getFaqPageJsonLd,
  getJuniorAcademyCourseJsonLd,
  getVideoObjectJsonLd,
} from '@/lib/jsonld'
import { siteOpenGraph } from '@/lib/open-graph'
import {
  getJuniorAcademyContent,
  JUNIOR_ACADEMY_IMAGES,
  JUNIOR_ACADEMY_LINE_URL,
  JUNIOR_ACADEMY_PATH,
  JUNIOR_ACADEMY_PRICE_THB,
  JUNIOR_ACADEMY_VIDEO,
} from '@/data/junior-academy'

/**
 * Locales this page is published in, derived from the route registry (EN plus
 * every locale registering '/junior-golf-academy'), so generateStaticParams and
 * the hreflang alternates cannot drift apart. ja/ko/zh are unregistered: the
 * middleware 301s them to the EN page.
 */
const PAGE_LOCALES = ALL_LOCALES.filter(
  (locale) => locale === 'en' || hasTranslationForLocale(locale, JUNIOR_ACADEMY_PATH)
)

// The layout sets dynamicParams = false, so a locale missing here 404s.
export function generateStaticParams() {
  return PAGE_LOCALES.map((locale) => ({ locale }))
}

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const c = getJuniorAcademyContent(locale)
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: {
      canonical: getCanonical(locale, JUNIOR_ACADEMY_PATH),
      languages: getAlternates(JUNIOR_ACADEMY_PATH),
    },
    openGraph: siteOpenGraph({
      title: c.metaTitle,
      description: c.metaDescription,
      url: getCanonical(locale, JUNIOR_ACADEMY_PATH),
      locale: OG_LOCALES[locale as Locale] ?? OG_LOCALES.en,
      images: [
        {
          url: JUNIOR_ACADEMY_IMAGES.og.src,
          width: JUNIOR_ACADEMY_IMAGES.og.width,
          height: JUNIOR_ACADEMY_IMAGES.og.height,
          alt: c.course.name,
        },
      ],
    }),
  }
}

/**
 * Thai on screen (natural-thai rendering rules): a no-break space between a
 * number and the Thai word beside it, so "10 ครั้ง" or "ครั้งที่ 5" never splits
 * across lines. Applied at render time only, so the data, the JSON-LD and the
 * llms files keep plain text. (The skill's other rule, a word joiner inside
 * พัตต์, is met by whitespace-nowrap on the one place it renders, the skill
 * chips, which keeps an invisible character out of copy-paste and find.)
 */
function thaiText(text: string): string {
  return text
    .replace(/(\d) (?=[\u0E00-\u0E7F])/g, '$1\u00a0')
    .replace(/([\u0E00-\u0E7F]) (?=\d)/g, '$1\u00a0')
}

const TRANSCRIPT_ID = 'junior-academy-transcript'
const HERO_CTA_ID = 'junior-academy-hero-cta'
const START_ID = 'start'

export default async function JuniorGolfAcademyPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const c = getJuniorAcademyContent(locale)
  const isThai = locale === 'th'
  const tx = (text: string) => (isThai ? thaiText(text) : text)
  const pageUrl = getCanonical(locale, JUNIOR_ACADEMY_PATH)

  const courseJsonLd = getJuniorAcademyCourseJsonLd({
    name: c.course.name,
    description: c.course.description,
    pageUrl,
    // One program, one entity: the EN URL names it on both locale pages (the
    // coaches' Person @ids follow the same rule).
    entityId: `${getCanonical('en', JUNIOR_ACADEMY_PATH)}#course`,
    image: JUNIOR_ACADEMY_IMAGES.poster.src,
    priceThb: JUNIOR_ACADEMY_PRICE_THB,
    // Thai has no full stop, so the items are joined with the locale's own
    // separator rather than a hardcoded '. '.
    offerDescription: [...c.price.items, c.price.validity].join(c.listSeparator),
    credentials: c.course.credentials,
  })
  const faqJsonLd = getFaqPageJsonLd(c.faq.items)
  const videoJsonLd = getVideoObjectJsonLd({
    name: c.video.name,
    description: c.video.description,
    thumbnailUrl: JUNIOR_ACADEMY_VIDEO.thumbnail,
    contentUrl: JUNIOR_ACADEMY_VIDEO.src,
    uploadDate: JUNIOR_ACADEMY_VIDEO.uploadDate,
    duration: JUNIOR_ACADEMY_VIDEO.duration,
    inLanguage: 'th',
    // What the audio says, in the language it says it, on both pages: the EN
    // page's transcript is a translation, which `transcript` beside
    // `inLanguage: 'th'` would misstate.
    transcript: getJuniorAcademyContent('th').video.transcript.join(' '),
  })
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: c.breadcrumb.home, url: getCanonical(locale, '/') },
    { name: c.breadcrumb.lessons, url: getCanonical(locale, '/lessons/') },
    { name: c.breadcrumb.self, url: pageUrl },
  ])

  // FAQ link keys go through the same Thai spacing as the answers, so a key
  // with a number beside a Thai word still matches after thaiText().
  const faqLinks = Object.fromEntries(Object.entries(c.faqLinks).map(([key, link]) => [tx(key), link]))

  // In data order: off the phone · focus · confidence · family.
  const benefitIcons = [PhoneOff, Target, Medal, Users]
  const benefitTones = ['lime', 'cream', 'sun', 'forest'] as const
  // One hitter · soft balls · parent present · clubs · indoors.
  const trustIcons = [ScanFace, Feather, Eye, Ruler, Snowflake]
  const placeIcons = [MapPin, TrainFront, Clock]
  const stepIcons = [MessageCircleMore, NotebookPen, CalendarCheck]

  const sectionHeading = cn(
    'mb-7 text-[clamp(28px,5vw,42px)] font-bold [text-wrap:balance]',
    isThai ? 'leading-[1.35]' : 'leading-[1.15] tracking-[-0.015em]'
  )
  const photo = JUNIOR_ACADEMY_IMAGES.photos

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }} />

      <div
        className={cn('overflow-x-clip leading-[1.7]', isThai ? 'text-[18px]' : 'text-[17px]')}
        style={{ backgroundColor: JA.cream, color: JA.ink }}
      >
        {/* ── Hero ── */}
        <section className="pb-14 pt-7 md:pb-[72px] md:pt-11">
          <div className="mx-auto grid max-w-[1180px] gap-7 px-5 md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-12">
            <div>
              <AcademyLockup />
              <h1
                className={cn(
                  'font-bold [text-wrap:balance]',
                  isThai
                    ? 'text-[clamp(32px,7.6vw,56px)] leading-[1.35]'
                    : 'text-[clamp(32px,6.2vw,48px)] leading-[1.15] tracking-[-0.015em]'
                )}
                style={{ color: JA.forest }}
              >
                {tx(c.hero.title)}
              </h1>
              <p className="mt-3.5 max-w-[34ch] text-[clamp(17px,2.2vw,20px)]" style={{ color: JA.muted }}>
                {tx(c.hero.subtitle)}
              </p>
              <div className="mt-6">
                <LineButton id={HERO_CTA_ID} href={JUNIOR_ACADEMY_LINE_URL} label={c.hero.cta} />
              </div>
            </div>

            <figure className="relative m-0 w-full max-w-[400px] justify-self-center md:max-w-[340px]">
              <Tape className="-top-3 left-1/2 z-10 -translate-x-1/2 -rotate-[4deg]" />
              {/* Not rotated, unlike the v2 mock-up: Chrome left a priority
                  <img> inside a rotated parent unpainted here (PR #155). */}
              <div
                className="relative aspect-[9/16] overflow-hidden rounded-[18px] border-8"
                style={{ borderColor: JA.paper, backgroundColor: JA.paper, boxShadow: JA_SHADOW }}
              >
                <Image
                  src={JUNIOR_ACADEMY_VIDEO.heroPoster}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 340px, (min-width: 440px) 400px, calc(100vw - 40px)"
                  className="object-cover"
                  priority
                />
                <HeroReel
                  src={JUNIOR_ACADEMY_VIDEO.src}
                  width={JUNIOR_ACADEMY_VIDEO.width}
                  height={JUNIOR_ACADEMY_VIDEO.height}
                  label={c.video.label}
                  soundOn={c.video.soundOn}
                  soundOff={c.video.soundOff}
                  pause={c.video.pause}
                  play={c.video.play}
                  describedBy={TRANSCRIPT_ID}
                />
              </div>
              <AgeSticker label={tx(c.hero.ageSticker)} className="-left-2.5 bottom-7" />
              <figcaption className="mt-3 text-[15px]" style={{ color: JA.muted }}>
                <details className="group">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 font-semibold underline-offset-4 hover:underline [&::-webkit-details-marker]:hidden">
                    {tx(c.video.transcriptTitle)}
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <ol id={TRANSCRIPT_ID} className="mt-2 list-none space-y-1 p-0">
                    {c.video.transcript.map((line) => (
                      <li key={line}>{tx(line)}</li>
                    ))}
                  </ol>
                </details>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ── What your child gets ── */}
        <section className="py-14" style={{ backgroundColor: JA.paper }}>
          <div className="mx-auto max-w-[1180px] px-5">
            <h2 className={sectionHeading} style={{ color: JA.forest }}>
              {tx(c.benefits.title)}
            </h2>
            <div className="grid gap-3.5 md:grid-cols-[1.15fr_1fr_1fr] md:grid-rows-[auto_auto]">
              <figure className="relative m-0 aspect-[4/3] overflow-hidden rounded-[18px] md:row-span-2 md:aspect-auto md:min-h-[380px]">
                <Image
                  src={photo.benefits}
                  alt={c.benefits.photoAlt}
                  fill
                  sizes="(min-width: 768px) 420px, calc(100vw - 40px)"
                  className="object-cover object-[50%_80%] md:object-[50%_78%]"
                />
              </figure>
              {c.benefits.items.map((item, i) => {
                const Icon = benefitIcons[i % benefitIcons.length]
                const tone = benefitTones[i % benefitTones.length]
                const onForest = tone === 'forest'
                return (
                  <Surface key={item.title} tone={tone} className="px-[22px] py-6">
                    <Icon className="h-[34px] w-[34px]" style={{ color: onForest ? JA.paper : JA.forest }} aria-hidden="true" />
                    <h3 className="mb-1.5 mt-3 text-[22px] font-bold leading-snug" style={{ color: onForest ? JA.paper : JA.forest }}>
                      {tx(item.title)}
                    </h3>
                    <p style={{ color: onForest ? '#d9e4cf' : tone === 'lime' ? JA.ink : JA.muted }}>{tx(item.body)}</p>
                  </Surface>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Ten lessons ── */}
        <section className="pb-16 pt-[72px]">
          <div className="mx-auto max-w-[1180px] px-5">
            <h2 className={sectionHeading} style={{ color: JA.forest }}>
              {tx(c.journey.title)}
            </h2>
            <div className="rounded-[18px] px-3.5 pb-2 pt-[22px]" style={{ backgroundColor: JA.paper, boxShadow: JA_SHADOW }}>
              <JourneyMap start={c.journey.start} label={c.journey.mapLabel} />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {c.journey.milestones.map((m, i) => (
                <div key={m.badge} className="flex items-start gap-3.5 rounded-[18px] px-[18px] py-4" style={{ backgroundColor: JA.paper }}>
                  <span
                    className="flex-none rounded-full px-2.5 py-[5px] text-[13px] font-bold italic tracking-[0.04em]"
                    style={i === 0 ? { backgroundColor: JA.sun, color: JA.forest } : { backgroundColor: JA.forest, color: JA.paper }}
                  >
                    {m.badge}
                  </span>
                  <p>{tx(m.body)}</p>
                </div>
              ))}
            </div>

            <div className="mt-11">
              <h3 className="mb-4 text-[clamp(22px,3.4vw,28px)] font-bold" style={{ color: JA.forest }}>
                {tx(c.journey.lessonTitle)}
              </h3>
              <div className="grid gap-3.5 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <article
                  className="relative -rotate-1 rounded-[18px] border-2 border-dashed p-[22px]"
                  style={{ backgroundColor: JA.paper, borderColor: 'rgba(38,80,32,.25)' }}
                >
                  <MinutesBadge label={tx(c.journey.minutes)} />
                  <PersonStanding className="h-9 w-9" style={{ color: JA.forest }} aria-hidden="true" />
                  <h4 className="mb-1 mt-2.5 text-xl font-bold" style={{ color: JA.forest }}>
                    {tx(c.journey.play.title)}
                  </h4>
                  <p>{tx(c.journey.play.body)}</p>
                </article>
                <span className="hidden text-[40px] font-bold md:block" style={{ color: JA.forest }} aria-hidden="true">
                  +
                </span>
                <article className="relative rotate-[0.8deg] rounded-[18px] p-[22px]" style={{ backgroundColor: JA.forest, color: JA.paper }}>
                  <MinutesBadge label={tx(c.journey.minutes)} />
                  <FlagTriangleRight className="h-9 w-9" style={{ color: JA.lime }} aria-hidden="true" />
                  <h4 className="mb-1 mt-2.5 text-xl font-bold">{tx(c.journey.golf.title)}</h4>
                  <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
                    {c.journey.golf.skills.map((skill) => (
                      <li
                        key={skill}
                        className="whitespace-nowrap rounded-full border-[1.5px] px-3.5 py-[3px] text-[15px] font-semibold"
                        style={{ backgroundColor: 'rgba(141,199,67,.2)', borderColor: JA.lime }}
                      >
                        {tx(skill)}
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* ── Who teaches, and safety (no coach names: owner decision) ── */}
        <section className="py-16" style={{ backgroundColor: JA.paper }}>
          <div className="mx-auto grid max-w-[1180px] items-center gap-9 px-5 md:grid-cols-2 md:gap-14">
            <figure className="relative m-0 mx-auto w-full max-w-[420px] bg-white p-2 pb-2.5" style={{ borderRadius: 14, boxShadow: JA_SHADOW }}>
              <Tape className="-top-3 left-6 z-10 -rotate-6" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[9px]">
                <Image
                  src={photo.trust}
                  alt={c.trust.photoAlt}
                  fill
                  sizes="(min-width: 768px) 420px, calc(100vw - 56px)"
                  className="object-cover object-[50%_60%]"
                />
              </div>
            </figure>
            <div>
              <h2 className={sectionHeading} style={{ color: JA.forest }}>
                {tx(c.trust.title)}
              </h2>
              <p className="-mt-3 mb-[22px]" style={{ color: JA.muted }}>
                {tx(c.trust.lead)}
              </p>
              <ul className="grid list-none gap-2.5 p-0">
                {c.trust.items.map((item, i) => {
                  const Icon = trustIcons[i % trustIcons.length]
                  return (
                    <li key={item} className="flex items-start gap-3.5">
                      <Icon className="mt-[5px] h-6 w-6 flex-none" style={{ color: JA.lime }} aria-hidden="true" />
                      <span>{tx(item)}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Course fee and place ── */}
        <section id="price" className="py-[72px]">
          <div className="mx-auto grid max-w-[1180px] items-stretch gap-[22px] px-5 md:grid-cols-2 md:gap-7">
            <div
              className="rounded-[18px] border-t-[10px] px-6 py-[30px] md:px-[38px] md:py-10"
              style={{ backgroundColor: JA.paper, borderTopColor: JA.lime, boxShadow: JA_SHADOW }}
            >
              <h2 className={cn(sectionHeading, 'mb-0')} style={{ color: JA.forest }}>
                {tx(c.price.title)}
              </h2>
              <p className="mt-2.5 text-[clamp(48px,9vw,68px)] font-bold leading-[1.1]" style={{ color: JA.forest }}>
                {c.price.amount}
                {/* The space sits inside the small unit, so it reads as one in
                    the text content without widening the gap on screen. */}
                <span className="text-[0.42em]">{' '}{c.price.unit}</span>
              </p>
              <p className="mt-1 font-semibold" style={{ color: JA.forest }}>
                {tx(c.price.validity)}
              </p>
              <h3 className="mb-2.5 mt-[22px] text-lg font-bold" style={{ color: JA.forest }}>
                {tx(c.price.includedTitle)}
              </h3>
              <ul className="mb-[26px] grid list-none gap-2 p-0">
                {c.price.items.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <CircleCheck className="mt-1 h-[22px] w-[22px] flex-none" style={{ color: JA.lime }} aria-hidden="true" />
                    <span>{tx(item)}</span>
                  </li>
                ))}
              </ul>
              <LineButton href={JUNIOR_ACADEMY_LINE_URL} label={c.price.cta} />
              <p className="mt-3.5 text-sm" style={{ color: JA.muted }}>
                {tx(c.price.asOf)}
              </p>
            </div>
            <div className="grid gap-3.5 md:flex md:flex-col">
              <figure className="relative m-0 aspect-[4/3] overflow-hidden rounded-[18px] md:aspect-auto md:min-h-[300px] md:flex-1">
                <Image
                  src={photo.place}
                  alt={c.place.photoAlt}
                  fill
                  sizes="(min-width: 768px) 560px, calc(100vw - 40px)"
                  className="object-cover object-[50%_62%]"
                />
              </figure>
              <ul className="grid list-none gap-2 rounded-[18px] px-5 py-[18px]" style={{ backgroundColor: JA.forest, color: JA.paper }}>
                {c.place.items.map((item, i) => {
                  const Icon = placeIcons[i % placeIcons.length]
                  return (
                    <li key={item} className="flex items-start gap-3">
                      <Icon className="mt-1 h-[22px] w-[22px] flex-none" style={{ color: JA.lime }} aria-hidden="true" />
                      <span>{tx(item)}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </section>

        {/* ── FAQ: <details> keeps every answer in the HTML (unlike a Radix
            accordion, which unmounts closed answers), so crawlers and AI
            assistants read them all while parents scan the questions. ── */}
        <section id="faq" className="pb-[72px] pt-6">
          <div className="mx-auto max-w-[820px] px-5">
            <h2 className={sectionHeading} style={{ color: JA.forest }}>
              {tx(c.faq.title)}
            </h2>
            {c.faq.items.map((item) => (
              <details key={item.question} className="group mb-2.5 rounded-[14px] px-5" style={{ backgroundColor: JA.paper }}>
                <summary
                  className="flex cursor-pointer list-none items-center justify-between gap-4 py-[18px] text-lg font-semibold [&::-webkit-details-marker]:hidden"
                  style={{ color: JA.forest }}
                >
                  <span>{tx(item.question)}</span>
                  <ChevronDown className="h-5 w-5 flex-none transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="pb-[18px]" style={{ color: JA.muted }}>
                  {renderFaqAnswer(tx(item.answer), faqLinks)}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ── How to start ── */}
        <section id={START_ID} className="pb-[72px] pt-16" style={{ backgroundColor: JA.lime }}>
          <div className="mx-auto max-w-[1180px] px-5">
            <h2 className={cn(sectionHeading, 'mb-0')} style={{ color: JA.forest }}>
              {tx(c.start.title)}
            </h2>
            <ol className="my-7 grid list-none gap-3 p-0 md:grid-cols-3 md:gap-0 md:rounded-[18px] md:bg-[rgba(252,249,242,.85)] md:px-2.5 md:py-[26px]">
              {c.start.steps.map((step, i) => {
                const Icon = stepIcons[i % stepIcons.length]
                const last = i === c.start.steps.length - 1
                return (
                  <li
                    key={step}
                    className={cn(
                      'relative flex items-center gap-3.5 rounded-[18px] bg-[rgba(252,249,242,.85)] px-[18px] py-4 font-semibold md:flex-col md:items-start md:rounded-none md:bg-transparent md:px-[26px] md:py-0',
                      !last &&
                        "md:after:absolute md:after:left-[84px] md:after:right-[-6px] md:after:top-[22px] md:after:border-t-[2.5px] md:after:border-dashed md:after:border-[#265020] md:after:opacity-[.45] md:after:content-['']"
                    )}
                    style={{ color: JA.forest }}
                  >
                    <span className="grid h-[46px] w-[46px] flex-none place-items-center rounded-full" style={{ backgroundColor: JA.forest, color: JA.paper }}>
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span>{tx(step)}</span>
                  </li>
                )
              })}
            </ol>
            <div className="flex flex-wrap items-center gap-3">
              <LineButton href={JUNIOR_ACADEMY_LINE_URL} label={c.start.cta} />
              <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="font-semibold underline-offset-4 hover:underline" style={{ color: JA.forest }}>
                {tx(`${c.start.callLead} ${BUSINESS_INFO.phone}`)}
              </a>
            </div>
          </div>
        </section>

        {/* ── Related ── */}
        <nav aria-label={c.related.title} className="py-10">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-5 gap-y-2 px-5 text-[15px]">
            <span style={{ color: JA.muted }}>{c.related.title}:</span>
            {c.related.links.map((link) => {
              const className = 'font-semibold underline underline-offset-4'
              const style = { color: JA.forest }
              // A locale-prefixed Link to a page this locale does not publish
              // would 301 back to English, so such targets get a plain
              // unprefixed link (the Footer's rule).
              return hasTranslationForLocale(locale, link.href) ? (
                <Link key={link.href} href={link.href as Parameters<typeof Link>[0]['href']} className={className} style={style}>
                  {link.label}
                </Link>
              ) : (
                <RawLink key={link.href} href={`${link.href}/`} className={className} style={style}>
                  {link.label}
                </RawLink>
              )
            })}
          </div>
        </nav>
      </div>

      <StickyLineBar href={JUNIOR_ACADEMY_LINE_URL} label={c.hero.cta} heroCtaId={HERO_CTA_ID} endId={START_ID} />
    </>
  )
}

function MinutesBadge({ label }: { label: string }) {
  return (
    <span
      className="absolute right-[18px] top-[18px] rounded-full px-3 py-0.5 text-[15px] font-bold"
      style={{ backgroundColor: JA.sun, color: JA.forest }}
    >
      {label}
    </span>
  )
}
