import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import qrcode from 'qrcode-generator'
import { FaLine } from 'react-icons/fa'
import { CalendarCheck, CalendarDays, Clock, Flag, MapPin, MessageCircle, PartyPopper, TrainFront } from 'lucide-react'
import { BOOKING_URL, storageUrl } from '@/lib/constants'
import { getBreadcrumbJsonLd } from '@/lib/jsonld'
import { siteOpenGraph } from '@/lib/open-graph'
import {
  ALL_LOCALES,
  getAlternates,
  getCanonical,
  hasTranslationForLocale,
  OG_LOCALES,
  type Locale,
} from '@/lib/translated-routes'
import { getLinePageContent, LINE_ADD_FRIEND_URL, LINE_ID, LINE_PAGE_PATH } from '@/data/line-page'

/**
 * EN plus every locale registering '/line' (TH today), so generateStaticParams
 * and the hreflang alternates cannot drift apart.
 */
const PAGE_LOCALES = ALL_LOCALES.filter(
  (locale) => locale === 'en' || hasTranslationForLocale(locale, LINE_PAGE_PATH)
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
  const c = getLinePageContent(locale)
  const url = getCanonical(locale, LINE_PAGE_PATH)
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: url, languages: getAlternates(LINE_PAGE_PATH) },
    openGraph: siteOpenGraph({
      title: c.metaTitle,
      description: c.metaDescription,
      url,
      locale: OG_LOCALES[locale as Locale] ?? OG_LOCALES.en,
      images: [{ url: storageUrl('venue/venue-interior-01.jpg'), width: 1500, height: 1500, alt: 'LENGOLF indoor golf simulator and bar in Bangkok' }],
    }),
  }
}

/**
 * The QR code for LINE_ADD_FRIEND_URL, drawn as one SVG path at build time (the page
 * is static). No external QR service and no client JavaScript. Level M error
 * correction, and a 4-module quiet zone, which the QR spec requires for a
 * reliable scan.
 */
function LineQrCode({ label }: { label: string }) {
  const qr = qrcode(0, 'M')
  qr.addData(LINE_ADD_FRIEND_URL)
  qr.make()
  const size = qr.getModuleCount()
  let d = ''
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (qr.isDark(row, col)) d += `M${col} ${row}h1v1h-1z`
    }
  }
  const quiet = 4
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`${-quiet} ${-quiet} ${size + quiet * 2} ${size + quiet * 2}`}
      shapeRendering="crispEdges"
      className="h-auto w-full"
      data-line-qr=""
    >
      <rect x={-quiet} y={-quiet} width={size + quiet * 2} height={size + quiet * 2} fill="#ffffff" />
      <path d={d} fill="#1a1a1a" />
    </svg>
  )
}

/**
 * Thai on screen (natural-thai rendering rule): a no-break space between a
 * number and the Thai word beside it, so "ชั้น 4" or "ทางออก 4" never splits
 * across lines. Render time only; the data and the metadata keep plain text.
 * Same rule as the Junior Academy page's thaiText().
 */
function thaiText(text: string): string {
  return text
    .replace(/(\d) (?=[\u0E00-\u0E7F])/g, '$1\u00a0')
    .replace(/([\u0E00-\u0E7F]) (?=\d)/g, '$1\u00a0')
}

const HELP_ICONS = { book: CalendarCheck, ask: MessageCircle, events: PartyPopper, clubs: Flag } as const

export default async function LinePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const c = getLinePageContent(locale)
  const isThai = locale === 'th'
  const tx = (text: string) => (isThai ? thaiText(text) : text)
  const pageUrl = getCanonical(locale, LINE_PAGE_PATH)

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: c.breadcrumb.home, url: getCanonical(locale, '/') },
    { name: c.breadcrumb.self, url: pageUrl },
  ])

  const visitRows = [
    { icon: MapPin, label: c.visit.addressLabel, value: tx(c.visit.address) },
    { icon: TrainFront, label: c.visit.transitLabel, value: tx(c.visit.transit) },
    { icon: Clock, label: c.visit.hoursLabel, value: tx(c.visit.hours) },
  ]

  // Thai has no capitals and needs taller lines; the EN heading style
  // (uppercase italic, tight leading) would clip Thai vowel marks.
  const h2 = isThai
    ? 'mb-10 text-center text-3xl font-bold leading-[1.35] lg:text-4xl'
    : 'mb-10 text-center text-3xl font-bold italic uppercase lg:text-4xl'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* ── Hero: open LINE or scan ── */}
      <section className="bg-[#F6FFFA] py-16 lg:py-24">
        <div className="section-max-width section-padding grid items-center gap-10 md:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-primary">{c.hero.eyebrow}</p>
            <h1
              className={
                isThai
                  ? 'mb-5 text-4xl font-black leading-[1.3] text-foreground md:text-5xl'
                  : 'mb-5 text-4xl font-black uppercase leading-none text-foreground md:text-5xl lg:text-6xl'
              }
            >
              {c.hero.title}
            </h1>
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">{tx(c.hero.intro)}</p>
            <a
              href={LINE_ADD_FRIEND_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-3 rounded-md bg-primary px-10 text-lg font-bold uppercase text-white shadow-sm transition-colors hover:bg-primary-dark"
            >
              <FaLine className="h-7 w-7" aria-hidden="true" />
              {c.hero.cta}
            </a>
            <p className="mt-5 text-base text-foreground">
              {c.hero.lineIdLabel}: <strong className="font-bold">{LINE_ID}</strong>
            </p>
          </div>

          <div className="mx-auto w-full max-w-[280px] rounded-xl border border-border/60 bg-white p-5 text-center shadow-sm">
            <LineQrCode label={c.hero.qrLabel} />
            <p className="mt-3 text-lg font-bold text-foreground">{LINE_ID}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.hero.qrCaption}</p>
          </div>
        </div>
      </section>

      {/* ── What to message us about ── */}
      <section className="py-16 lg:py-24">
        <div className="section-max-width section-padding">
          <h2 className={h2}>
            <span className="text-primary">{c.help.title.primary}</span>
            {c.help.title.suffix && <span className="text-foreground"> {c.help.title.suffix}</span>}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {c.help.items.map((item) => {
              const Icon = HELP_ICONS[item.key]
              return (
                <div key={item.key} className="rounded-xl border border-border/60 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{tx(item.body)}</p>
                </div>
              )
            })}
          </div>
          <div className="mt-10 text-center">
            <a
              href={LINE_ADD_FRIEND_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-8 text-sm font-bold uppercase text-white transition-colors hover:bg-primary-dark"
            >
              <FaLine className="h-5 w-5" aria-hidden="true" />
              {c.hero.cta}
            </a>
          </div>
        </div>
      </section>

      {/* ── Visit + book online ── */}
      <section className="bg-[#F6FFFA] py-16 lg:py-24">
        <div className="section-max-width section-padding">
          <h2 className={h2}>
            <span className="text-primary">{c.visit.title.primary}</span>
            {c.visit.title.suffix && <span className="text-foreground"> {c.visit.title.suffix}</span>}
          </h2>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            <ul className="space-y-5 rounded-xl border border-border/60 bg-white p-6 shadow-sm">
              {visitRows.map((row) => (
                <li key={row.label} className="flex gap-4">
                  <row.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold text-foreground">{row.label}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{row.value}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-col items-start justify-center rounded-xl bg-primary p-6 text-white shadow-sm">
              <h3 className="mb-2 text-xl font-bold">{c.book.title}</h3>
              <p className="mb-6 text-white/85">{c.book.body}</p>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-white px-8 text-sm font-bold uppercase text-primary transition-colors hover:bg-white/90"
              >
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                {c.book.cta}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
