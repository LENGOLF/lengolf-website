import type { Metadata } from 'next'
import Image, { getImageProps } from 'next/image'
import RawLink from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { MessageCircle, Users, CircleDot, ShieldCheck } from 'lucide-react'
import { renderFaqAnswer } from '@/components/shared/FaqSection'
import {
  PaperSection,
  PaperCard,
  CollageHeading,
  SunBurst,
  TornEdge,
  Tape,
  CheckDot,
  JA,
  paperStyle,
} from '@/components/junior-academy/Collage'
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

function LineButton({ label, variant = 'forest' }: { label: string; variant?: 'forest' | 'lime' }) {
  const colors =
    variant === 'lime'
      ? { backgroundColor: JA.lime, color: JA.forest }
      : { backgroundColor: JA.forest, color: JA.card }
  return (
    <a
      href={JUNIOR_ACADEMY_LINE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-7 py-3 text-sm font-bold uppercase tracking-wide transition-opacity hover:opacity-90"
      style={colors}
    >
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      {label}
    </a>
  )
}

export default async function JuniorGolfAcademyPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const c = getJuniorAcademyContent(locale)
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
    thumbnailUrl: JUNIOR_ACADEMY_VIDEO.poster,
    contentUrl: JUNIOR_ACADEMY_VIDEO.src,
    uploadDate: JUNIOR_ACADEMY_VIDEO.uploadDate,
    duration: JUNIOR_ACADEMY_VIDEO.duration,
    inLanguage: 'th',
    transcript: c.video.transcript.join(' '),
  })
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: c.breadcrumb.home, url: getCanonical(locale, '/') },
    { name: c.breadcrumb.lessons, url: getCanonical(locale, '/lessons/') },
    { name: c.breadcrumb.self, url: pageUrl },
  ])

  // The video's poster frame goes through the image optimizer (WebP at about
  // 2x the 300 px it renders at) rather than the 720x1280 JPEG: a poster
  // downloads with the page even under preload="none".
  const { props: videoPoster } = getImageProps({
    src: JUNIOR_ACADEMY_VIDEO.poster,
    alt: '',
    width: 300,
    height: 533,
  })

  const [titleFirstWord, ...titleRest] = c.hero.titleMain.split(' ')
  // One hitter at a time · soft balls · parent supervision (data order).
  const safetyIcons = [Users, CircleDot, ShieldCheck]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }} />

      <div style={{ color: JA.ink }}>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden pb-10 pt-10 md:pb-16 md:pt-14" style={paperStyle}>
          <div className="section-max-width section-padding grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
            <div className="relative">
              {/* Decorative repeat of the age, beside the title on wide screens
                  only: the poster carries its own burst, and below lg the stat
                  chips state the ages a few lines down. */}
              <div aria-hidden="true">
                <SunBurst label={c.hero.ageBadge} className="absolute right-0 top-10 hidden lg:grid xl:right-6" />
              </div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.08em]" style={{ color: JA.forest }}>
                {c.hero.eyebrow}
              </p>
              <h1>
                <span className="mb-4 block text-2xl font-bold leading-snug md:text-3xl" style={{ color: JA.forest }}>
                  {c.hero.titleLead}
                </span>{' '}
                {/* The {' '} separators keep the H1's text content word-separated
                    for crawlers and LLM fetchers; they collapse visually. */}
                <span className="flex flex-wrap items-end gap-2">
                  <span
                    className="inline-block px-4 py-2 text-5xl font-black uppercase italic leading-none md:text-6xl lg:text-7xl"
                    style={{ backgroundColor: JA.forest, color: JA.card, transform: 'rotate(-1.5deg)' }}
                  >
                    {titleFirstWord}
                  </span>{' '}
                  {titleRest.length > 0 && (
                    <span
                      className="inline-block px-4 py-2 text-5xl font-black uppercase italic leading-none md:text-6xl lg:text-7xl"
                      style={{ backgroundColor: JA.lime, color: JA.forest, transform: 'rotate(1deg)' }}
                    >
                      {titleRest.join(' ')}
                    </span>
                  )}
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed md:text-lg">{c.hero.subtitle}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <LineButton label={c.hero.cta} />
                <a
                  href="#program"
                  className="inline-flex min-h-12 items-center justify-center rounded-md border-2 px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-white/60"
                  style={{ borderColor: JA.forest, color: JA.forest }}
                >
                  {c.hero.secondaryCta}
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[420px]">
              {/* Not rotated: Chrome left a priority <img> inside a rotated
                  parent unpainted (white) here, in two separate Chromium
                  builds, while the decoded pixels were fine. The tape carries
                  the collage look instead. */}
              <div className="relative bg-white p-2 shadow-lg">
                <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-3" />
                <Image
                  src={JUNIOR_ACADEMY_IMAGES.poster.src}
                  alt={c.hero.posterAlt}
                  width={JUNIOR_ACADEMY_IMAGES.poster.width}
                  height={JUNIOR_ACADEMY_IMAGES.poster.height}
                  sizes="(max-width: 768px) 90vw, 420px"
                  className="h-auto w-full"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Stat chips */}
          <div className="section-max-width section-padding mt-12">
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {c.stats.map((s, i) => (
                <li key={s.label}>
                  <PaperCard className="px-4 py-4 text-center md:px-4 md:py-5" tilt={i % 2 === 0 ? -0.8 : 0.8}>
                    <div className="text-xl font-extrabold md:text-2xl" style={{ color: JA.forest }}>
                      {s.value}
                    </div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-wide opacity-75">{s.label}</div>
                  </PaperCard>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── What's included ── */}
        <section id="program" className="scroll-mt-24 bg-white py-14 lg:py-20">
          <div className="section-max-width section-padding">
            <CollageHeading lead={c.included.title} suffix={c.included.titleSuffix} />
            <p className="mx-auto mb-10 max-w-2xl text-center text-base leading-relaxed md:text-lg">{c.included.intro}</p>
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1.4fr_1fr]">
              <PaperCard>
                <ul className="space-y-4">
                  {c.included.items.map((item) => (
                    <li key={item} className="flex gap-3 text-base leading-relaxed">
                      <CheckDot />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </PaperCard>
              <PaperCard tilt={1}>
                <h3 className="mb-5 text-lg font-bold uppercase tracking-wide" style={{ color: JA.forest }}>
                  {c.included.skillsTitle}
                </h3>
                <ul className="flex flex-wrap gap-3">
                  {c.included.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full px-4 py-2 text-sm font-bold"
                      style={{ backgroundColor: JA.sun, color: JA.forest }}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </PaperCard>
            </div>
          </div>
        </section>

        {/* ── How a lesson works ── */}
        <PaperSection>
          <CollageHeading lead={c.lesson.title} suffix={c.lesson.titleSuffix} />
          <p className="mx-auto mb-10 max-w-2xl text-center text-base leading-relaxed md:text-lg">{c.lesson.intro}</p>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {c.lesson.halves.map((half, i) => (
              <PaperCard key={half.title} tilt={i === 0 ? -1 : 1}>
                <span
                  className="mb-3 inline-block px-3 py-1 text-xs font-extrabold uppercase tracking-wide"
                  style={{ backgroundColor: i === 0 ? JA.sun : JA.lime, color: JA.forest }}
                >
                  {half.label}
                </span>
                <h3 className="mb-2 text-xl font-bold" style={{ color: JA.forest }}>
                  {half.title}
                </h3>
                <p className="leading-relaxed">{half.body}</p>
              </PaperCard>
            ))}
          </div>
        </PaperSection>

        {/* ── Progress ── */}
        <section className="bg-white py-14 lg:py-20">
          <div className="section-max-width section-padding">
            <CollageHeading lead={c.progress.title} suffix={c.progress.titleSuffix} />
            <p className="mx-auto mb-10 max-w-2xl text-center text-base leading-relaxed md:text-lg">{c.progress.intro}</p>
            <ol className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
              {c.progress.steps.map((step, i) => (
                <li key={step.label}>
                  <PaperCard tilt={i === 0 ? 0.6 : -0.6} className="h-full">
                    <p className="text-xs font-bold uppercase tracking-[0.08em] opacity-75">{step.label}</p>
                    <h3
                      className="my-3 inline-block px-3 py-1 text-xl font-extrabold uppercase italic"
                      style={{ backgroundColor: JA.forest, color: JA.card }}
                    >
                      {step.title}
                    </h3>
                    <p className="leading-relaxed">{step.body}</p>
                  </PaperCard>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Video (below the fold, never the LCP element) ── */}
        <TornEdge color={JA.forest} seed={11} />
        <PaperSection tone="forest">
          <CollageHeading lead={c.video.title} suffix={c.video.titleSuffix} onForest />
          <p className="mx-auto mb-10 max-w-2xl text-center text-base leading-relaxed text-white/85 md:text-lg">
            {c.video.intro}
          </p>
          <div className="mx-auto grid max-w-4xl items-start gap-8 md:grid-cols-[300px_1fr]">
            <div className="relative mx-auto w-full max-w-[300px] bg-white p-2 shadow-lg">
              <Tape className="-top-3 left-6 -rotate-6" />
              <video
                controls
                playsInline
                preload="none"
                poster={videoPoster.src}
                width={JUNIOR_ACADEMY_VIDEO.width}
                height={JUNIOR_ACADEMY_VIDEO.height}
                aria-label={c.video.label}
                aria-describedby="junior-academy-transcript"
                className="block h-auto w-full bg-black"
              >
                <source src={JUNIOR_ACADEMY_VIDEO.src} type="video/mp4" />
                {c.video.fallback}
              </video>
            </div>
            <div id="junior-academy-transcript">
              <PaperCard>
                <h3 className="mb-4 text-lg font-bold" style={{ color: JA.forest }}>
                  {c.video.transcriptTitle}
                </h3>
                <ol className="space-y-3 leading-relaxed">
                  {c.video.transcript.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ol>
              </PaperCard>
            </div>
          </div>
        </PaperSection>
        <TornEdge color={JA.forest} seed={23} flip />

        {/* ── Safety ── */}
        <section className="bg-white py-14 lg:py-20">
          <div className="section-max-width section-padding">
            <CollageHeading lead={c.safety.title} suffix={c.safety.titleSuffix} />
            <ul className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              {c.safety.items.map((item, i) => {
                const Icon = safetyIcons[i % safetyIcons.length]
                return (
                  <li key={item.title}>
                    <PaperCard className="h-full" tilt={i === 1 ? 0.8 : -0.5}>
                      <span
                        className="mb-4 grid h-12 w-12 place-items-center rounded-full"
                        style={{ backgroundColor: JA.sun }}
                        aria-hidden="true"
                      >
                        <Icon className="h-6 w-6" style={{ color: JA.forest }} />
                      </span>
                      <h3 className="mb-2 text-lg font-bold" style={{ color: JA.forest }}>
                        {item.title}
                      </h3>
                      <p className="leading-relaxed">{item.body}</p>
                    </PaperCard>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* ── Price + CTA ── */}
        <TornEdge color={JA.forest} seed={37} />
        <PaperSection tone="forest" id="price">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-extrabold uppercase italic md:text-3xl">{c.price.title}</h2>
            <p
              className="mx-auto mt-6 inline-block px-6 py-3 text-5xl font-black md:text-6xl"
              style={{ backgroundColor: JA.forestDark, color: JA.sun, transform: 'rotate(-1deg)' }}
            >
              {c.price.amount}
            </p>
            <p className="mt-4 font-semibold" style={{ color: JA.lime }}>
              {c.price.validity}
            </p>
            <p className="mt-1 text-xs text-white/70">{c.price.asOf}</p>
            <ul className="mx-auto mt-8 max-w-xl space-y-3 text-left">
              {c.price.items.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-white/90">
                  <CheckDot />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <LineButton label={c.price.cta} variant="lime" />
            </div>
            <p className="mt-4 text-sm text-white/80">{c.price.note}</p>
          </div>
        </PaperSection>
        <TornEdge color={JA.forest} seed={41} flip />

        {/* ── FAQ: always-visible Q&A (an accordion unmounts closed answers) ── */}
        <PaperSection id="faq">
          <CollageHeading lead={c.faq.title} suffix={c.faq.titleSuffix} />
          <div className="mx-auto max-w-3xl space-y-4">
            {c.faq.items.map((item) => (
              <PaperCard key={item.question}>
                <h3 className="mb-2 text-lg font-bold" style={{ color: JA.forest }}>
                  {item.question}
                </h3>
                <p className="leading-relaxed">{renderFaqAnswer(item.answer, c.faqLinks)}</p>
              </PaperCard>
            ))}
          </div>
        </PaperSection>

        {/* ── Related ── */}
        <section className="bg-white py-12 lg:py-16">
          <div className="section-max-width section-padding text-center">
            <h2 className="mb-6 text-xl font-bold uppercase tracking-wide" style={{ color: JA.forest }}>
              {c.related.title}
            </h2>
            <ul className="flex flex-wrap items-center justify-center gap-3">
              {c.related.links.map((link) => {
                const className =
                  'inline-block rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[#f4eee2]'
                const style = { borderColor: JA.forest, color: JA.forest }
                return (
                  <li key={link.href}>
                    {/* A locale-prefixed Link to a page this locale does not
                        publish would 301 back to English, so such targets get
                        a plain unprefixed link (the Footer's rule). */}
                    {hasTranslationForLocale(locale, link.href) ? (
                      <Link href={link.href as Parameters<typeof Link>[0]['href']} className={className} style={style}>
                        {link.label}
                      </Link>
                    ) : (
                      <RawLink href={`${link.href}/`} className={className} style={style}>
                        {link.label}
                      </RawLink>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      </div>
    </>
  )
}
