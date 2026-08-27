import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import RawLink from 'next/link'
import { storageUrl, SITE_URL, SOCIAL_LINKS, BOOKING_URL, BUSINESS_INFO } from '@/lib/constants'
import {
  getAlternates,
  getCanonical,
  getResolvedCanonical,
  hasTranslationForLocale,
  ALL_LOCALES,
} from '@/lib/translated-routes'
import { getBreadcrumbJsonLd } from '@/lib/jsonld'
import { getRentalClubSetsForSpecSheet, setGallery } from '@/lib/clubs'
import { parseVariantSpec, splitSpecEntry, splitClubPart, SPEC_ROWS } from '@/lib/club-specs'
import type { RentalClubSet, SetVariantImage } from '@/lib/clubs'
import type { SpecRow } from '@/lib/club-specs'
import { siteOpenGraph } from '@/lib/open-graph'

const ImageLightbox = dynamic(() => import('@/components/shared/ImageLightbox'), { ssr: true })

export const revalidate = 3600

/**
 * Hidden-but-live sets that still earn a place on the spec sheet.
 *
 * Passed to getRentalClubSetsForSpecSheet(), which returns publicly-visible
 * sets PLUS the slugs named here. The allow-list is what keeps the sheet
 * deliberate: a set someone hides tomorrow stays off until it is named. The
 * left-handed set is on-request only and has no photos, but "do you have
 * left-handed clubs?" is a recurring chat question and its specs are fully
 * authored, so it belongs.
 */
const EXTRA_SPEC_SLUGS = new Set(['premium-mens-left-handed'])

/**
 * Locales this sheet is published in — derived from the route registry, not
 * hand-listed, so it cannot drift from generateStaticParams or the hreflang
 * alternates. Drives the in-page language switcher.
 */
const SHEET_LOCALES = ALL_LOCALES.filter(
  (locale) => locale === 'en' || hasTranslationForLocale(locale, '/golf-club-specs')
)

/** Endonyms, so a Thai reader sees "ไทย" rather than "Thai". */
const LOCALE_SWITCH_LABEL: Record<string, string> = { en: 'EN', th: 'ไทย', ja: '日本語', ko: '한국어', zh: '中文' }

/**
 * Filler for a spec cell the owner's sheet records no value for.
 *
 * Defined once because it is written in the table AND compared against when the
 * mobile card drops empty facts — two literals that must agree, and silently
 * produce a card full of blank rows if they ever drift.
 */
const NO_VALUE = '-'

/** Legal links the stripped site footer would otherwise have carried. */
const LEGAL_LINKS = [
  { href: '/privacy-policy', key: 'privacy' },
  { href: '/terms-of-service', key: 'terms' },
] as const

/**
 * EN always builds; every other locale builds only if it has a published
 * translation, mirroring app/[locale]/golf-courses/page.tsx.
 *
 * Without this the layout's five locales would each prerender this page, and
 * JA/KO/ZH have no ClubSpecs namespace — that is ~30 MISSING_MESSAGE warnings
 * per locale per build plus a self-canonical pointing at a URL that 301s. No
 * user ever sees those routes (the middleware redirects them), but a warning
 * that fires in a tight loop during SSG is a defect, not noise.
 */
export function generateStaticParams() {
  return [
    { locale: 'en' },
    ...ALL_LOCALES.filter(
      (locale) => locale !== 'en' && hasTranslationForLocale(locale, '/golf-club-specs')
    ).map((locale) => ({ locale })),
  ]
}

/** "Premium Men's - Callaway Warbird" -> "Callaway Warbird". */
function setShortName(name: string): string {
  return name.includes(' - ') ? name.split(' - ').slice(1).join(' - ') : name
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'ClubSpecs' })
  const canonical = getCanonical(locale, '/golf-club-specs/')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical,
      languages: getAlternates('/golf-club-specs/'),
    },
    // Declared explicitly, not inherited. Next merges metadata per KEY, so a
    // segment that omits `openGraph` keeps the ROOT layout's resolved object —
    // which meant this page advertised og:url = the homepage and og:image = a
    // photo of the bar interior. This sheet exists to be pasted into a LINE
    // chat, where that preview card is the entire first impression, so it
    // needs its own URL, its own locale, and a picture of actual clubs.
    openGraph: siteOpenGraph({
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: canonical,
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      images: [
        {
          url: storageUrl('clubs/premium-plus/2.png'),
          alt: 'Callaway Paradym Forged Carbon rental set, full bag',
        },
      ],
    }),
  }
}

export default async function GolfClubSpecsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('ClubSpecs')

  const sets = await getRentalClubSetsForSpecSheet(EXTRA_SPEC_SLUGS)

  // The reader swallows DB errors and returns [], so without this a Supabase
  // blip at build or revalidate time would DEPLOY SUCCESSFULLY as a page with a
  // headline, an empty jump nav, a comparison table of nothing, and a CTA —
  // then `revalidate` would serve that hollow sheet for an hour. This page's
  // whole job is being pasted into a LINE chat, so a plausible-looking empty
  // one is worse than an error. throw → the build fails loudly and ISR keeps
  // the last good render instead of caching the blank one.
  if (sets.length === 0) {
    throw new Error(
      'golf-club-specs: no rental club sets returned. Refusing to render an empty spec sheet — ' +
        'check the rental_club_sets query and Supabase availability.'
    )
  }

  // Locale-resolved, not hardcoded EN. On /th/ the crumbs previously pointed at
  // the EN URLs, so the terminal node was not the page it sat on — which is
  // what suppresses the breadcrumb rich result. getResolvedCanonical falls back
  // to EN only for paths that locale genuinely lacks, so no crumb ever names a
  // URL that 301s.
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: getResolvedCanonical(locale, '/') },
    { name: 'Club Rental', url: getResolvedCanonical(locale, '/golf-club-rental/') },
    { name: t('h1'), url: getResolvedCanonical(locale, '/golf-club-specs/') },
  ])

  const rowLabel = (row: SpecRow) => t(`rows.${row}`)
  const tierLabel = (tier: string) => (tier === 'premium-plus' ? t('tierPremiumPlus') : t('tierPremium'))
  const genderLabel = (gender: string) => (gender === 'womens' ? t('womensSet') : t('mensSet'))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* This route renders without the site chrome (see BareRouteGate) so the
          sheet is a clean thing to paste into a LINE chat. It carries its own
          minimal brand bar and footer instead. */}
      <header className="border-b border-primary/15 bg-white">
        <div className="section-max-width section-padding flex items-center justify-between gap-3 py-3 sm:py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src={storageUrl('branding/logo.png')}
              alt="LENGOLF"
              width={112}
              height={32}
              className="h-7 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-3">
            {/* The site header carries the ONLY locale switcher (LocaleMenu),
                and this route hides the header — so without this a Thai reader
                had no way back to the EN sheet, on a page that is deliberately
                published in both. Plain anchors: these are absolute, already
                locale-correct URLs, so next-intl's Link would prefix them
                again. */}
            {SHEET_LOCALES.filter((l) => l !== locale).map((l) => (
              <a
                key={l}
                href={`${getCanonical(l, '/golf-club-specs/').replace(SITE_URL, '')}`}
                hrefLang={l}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {LOCALE_SWITCH_LABEL[l]}
              </a>
            ))}
            <a
              href={`${BOOKING_URL}course-rental`}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              {t('ctaBook')}
            </a>
          </div>
        </div>
      </header>

      {/* ── Title ── */}
      <section className="border-b border-primary/15 bg-white py-10 lg:py-14">
        <div className="section-max-width section-padding">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {t('eyebrow')}
          </p>
          <h1 className="mb-3 text-3xl font-bold italic lg:text-4xl">{t('h1')}</h1>
          <p className="max-w-2xl text-muted-foreground">{t('intro')}</p>

          {/* Jump links — the sheet is long and usually opened to answer one
              specific question from chat. */}
          <nav aria-label={t('jumpTo')} className="mt-6 flex flex-wrap gap-2">
            {sets.map((set) => (
              <a
                key={set.slug}
                href={`#${set.slug}`}
                className="rounded-full border border-primary/25 px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-primary/5"
              >
                {setShortName(set.name)}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* ── One block per set ── */}
      <div className="section-max-width section-padding py-10 lg:py-14">
        <div className="space-y-12">
          {sets.map((set) => (
            <SetBlock
              key={set.slug}
              set={set}
              t={t}
              rowLabel={rowLabel}
              tierLabel={tierLabel}
              genderLabel={genderLabel}
            />
          ))}
        </div>

        {/* ── At-a-glance comparison ── */}
        <section className="mt-14">
          <h2 className="mb-4 text-xl font-bold italic sm:text-2xl">{t('compareTitle')}</h2>

          {/* Phones: one card per set. Five columns cannot be read on a 375px
              screen no matter how the overflow is handled. */}
          <ul className="space-y-2 sm:hidden">
            {sets.map((set) => {
              const shots = totalShots(set)
              return (
                <li key={set.slug} className="rounded-xl border border-primary/20 p-3">
                  <a href={`#${set.slug}`} className="font-semibold text-primary hover:underline">
                    {setShortName(set.name)}
                  </a>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {tierLabel(set.tier)} · {genderLabel(set.gender)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {set.variants.length > 0
                      ? set.variants.map((v) => v.label ?? v.key).join(' / ')
                      : t('noOptions')}
                    {' · '}
                    {shots > 0 ? t('photoCount', { count: shots }) : t('noPhotos')}
                  </p>
                </li>
              )
            })}
          </ul>

          <div className="hidden overflow-x-auto rounded-xl border border-primary/20 sm:block">
            <table className="w-auto min-w-full border-collapse text-sm">
              <caption className="sr-only">{t('compareTitle')}</caption>
              <thead>
                <tr className="bg-primary/5 text-left [&>th]:whitespace-nowrap">
                  <th scope="col" className="px-4 py-3 font-bold">{t('colSet')}</th>
                  <th scope="col" className="px-4 py-3 font-bold">{t('colTier')}</th>
                  <th scope="col" className="px-4 py-3 font-bold">{t('colFor')}</th>
                  <th scope="col" className="px-4 py-3 font-bold">{t('colOptions')}</th>
                  <th scope="col" className="px-4 py-3 font-bold">{t('colPhotos')}</th>
                </tr>
              </thead>
              <tbody>
                {sets.map((set) => {
                  const shots = totalShots(set)
                  return (
                    <tr key={set.slug} className="border-t border-primary/15 [&>*]:whitespace-nowrap">
                      <th scope="row" className="px-4 py-3 text-left font-semibold">
                        <a href={`#${set.slug}`} className="hover:underline">{setShortName(set.name)}</a>
                      </th>
                      <td className="px-4 py-3 text-muted-foreground">{tierLabel(set.tier)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{genderLabel(set.gender)}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {set.variants.length > 0
                          ? set.variants.map((v) => v.label ?? v.key).join(' / ')
                          : t('noOptions')}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {shots > 0 ? t('photoCount', { count: shots }) : t('noPhotos')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{t('compareNote')}</p>
        </section>

        {/* ── CTA ── */}
        <section className="mt-12 rounded-xl border border-primary/20 bg-primary/5 px-6 py-8 text-center">
          <h2 className="mb-2 text-xl font-bold">{t('ctaTitle')}</h2>
          <p className="mx-auto mb-5 max-w-xl text-sm text-muted-foreground">{t('ctaText')}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`${BOOKING_URL}course-rental`}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              {t('ctaBook')}
            </a>
            <a
              href={SOCIAL_LINKS.line}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-primary/30 px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-white"
            >
              {t('ctaLine')}
            </a>
          </div>
        </section>
      </div>

      {/* Minimal footer — backlinks plus the contact and legal links that the
          site footer would normally carry. Without these this was the only
          indexed public page with no phone, no email and no privacy/terms. */}
      <footer className="border-t border-primary/15 bg-white py-8">
        <div className="section-max-width section-padding space-y-3 text-center text-sm">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/golf-club-rental" className="font-semibold text-primary hover:underline">
              {t('backToBay')}
            </Link>
            <Link href="/golf-course-club-rental" className="font-semibold text-primary hover:underline">
              {t('backToCourse')}
            </Link>
            <Link href="/" className="font-semibold text-primary hover:underline">
              {t('backHome')}
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-muted-foreground">
            <a href={`tel:${BUSINESS_INFO.phoneRaw}`} className="hover:underline">
              {BUSINESS_INFO.phone}
            </a>
            <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:underline">
              {BUSINESS_INFO.email}
            </a>
            <a href={SOCIAL_LINKS.line} target="_blank" rel="noopener noreferrer" className="hover:underline">
              LINE @lengolf
            </a>
          </div>
          {/* /privacy-policy and /terms-of-service are deliberately EN-only, so
              the locale-aware Link would emit /th/privacy-policy/ and take a
              301 on every click. Footer.tsx applies this same ternary to these
              exact two hrefs — these links only exist here because
              BareRouteGate strips that Footer, and the remedy has to come with
              them. scripts/smoke-test.ts pins the redirect behaviour. */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            {LEGAL_LINKS.map(({ href, key }) => {
              const LinkTag = hasTranslationForLocale(locale, href) ? Link : RawLink
              return (
                <LinkTag key={href} href={`${href}/`} className="hover:underline">
                  {t(key)}
                </LinkTag>
              )
            })}
          </div>
        </div>
      </footer>
    </>
  )
}

/** Distinct photos across the base gallery and every variant that has its own. */
function totalShots(set: RentalClubSet): number {
  const paths = new Set<string>()
  for (const img of set.gallery) paths.add(img.path)
  for (const v of set.variants) for (const img of v.images ?? []) paths.add(img.path)
  return paths.size
}

type Translator = Awaited<ReturnType<typeof getTranslations<'ClubSpecs'>>>

function SetBlock({
  set,
  t,
  rowLabel,
  tierLabel,
  genderLabel,
}: {
  set: RentalClubSet
  t: Translator
  rowLabel: (row: SpecRow) => string
  tierLabel: (tier: string) => string
  genderLabel: (gender: string) => string
}) {
  // Colour variants ship their own shoots and get one captioned strip each —
  // the two-bag offering is the point. Shaft variants inherit the base gallery,
  // so they render a single uncaptioned strip.
  const imageVariants = set.variants.filter((v) => v.images && v.images.length > 0)
  const galleries: { caption: string | null; images: SetVariantImage[] }[] =
    imageVariants.length >= 2
      ? imageVariants.map((v) => ({ caption: v.label ?? v.key, images: v.images! }))
      : (() => {
          const single = setGallery(set, imageVariants[0]?.key)
          return single.length > 0 ? [{ caption: null, images: single }] : []
        })()

  // Variants whose spec is a club list (`·`-separated) become matrix columns.
  // Variants whose spec is a single free-text note render as notes instead.
  const matrixColumns = set.variants
    .map((v) => ({ variant: v, parts: parseVariantSpec(v.spec) }))
    .filter((c): c is { variant: (typeof set.variants)[number]; parts: NonNullable<ReturnType<typeof parseVariantSpec>> } => c.parts !== null)

  const noteVariants = set.variants.filter((v) => v.spec && parseVariantSpec(v.spec) === null)


  // "Driver: TaylorMade RBZ 10.5° (Stiff)" style entries become a real table.
  const splitEntries = set.specifications.map((e) => ({ raw: e, split: splitSpecEntry(e) }))
  const allSplit = splitEntries.length > 0 && splitEntries.every((e) => e.split !== null)

  return (
    <section id={set.slug} className="scroll-mt-24 rounded-xl border border-primary/20 bg-white p-6 lg:p-8">
      <header className="mb-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
            {tierLabel(set.tier)}
          </span>
          {!set.website_visible && (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-800">
              {t('onRequest')}
            </span>
          )}
        </div>
        <h2 className="text-2xl font-bold italic">{setShortName(set.name)}</h2>
        <p className="mt-1 text-sm font-semibold text-muted-foreground">
          {genderLabel(set.gender)}
          {set.brand && <> · {set.brand}{set.model ? ` ${set.model}` : ''}</>}
        </p>
        {!set.website_visible && <p className="mt-2 text-sm text-amber-800">{t('onRequestNote')}</p>}
      </header>

      {galleries.map((g, i) => (
        <div key={i} className="mb-5 -mx-1">
          {g.caption && (
            <p className="mb-1.5 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{g.caption}</p>
          )}
          <ImageLightbox
            images={g.images.map((img) => ({ src: storageUrl(img.path), alt: img.alt }))}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 12vw"
          />
        </div>
      ))}

      {/* What's in the bag */}
      {set.specifications.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">{t('inTheBag')}</h3>
          {allSplit ? (
            <>
              {/* Phones: stacked label-over-value, so a long entry like
                  "Ping i20 (Left-Handed, Regular)" wraps naturally in the
                  space it has instead of forcing the row sideways. */}
              <dl className="space-y-2 sm:hidden">
                {splitEntries.map((e, i) => (
                  <div key={i} className="rounded-lg border border-primary/15 px-3 py-2">
                    <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {e.split!.label}
                    </dt>
                    <dd className="mt-0.5 text-sm">{e.split!.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="hidden overflow-x-auto rounded-lg border border-primary/15 sm:block">
                <table className="w-auto min-w-full border-collapse text-sm">
                  <tbody>
                    {splitEntries.map((e, i) => (
                      <tr key={i} className="border-b border-primary/10 last:border-b-0 [&>*]:whitespace-nowrap">
                        <th scope="row" className="bg-primary/5 px-3 py-2 text-left font-semibold">{e.split!.label}</th>
                        <td className="px-3 py-2 text-muted-foreground">{e.split!.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <ul className="flex flex-wrap gap-x-2 gap-y-2">
              {set.specifications.map((spec, i) => (
                <li key={i} className="rounded-md border border-primary/15 bg-primary/5 px-2.5 py-1 text-sm text-foreground">
                  {spec}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Full club-by-club specs — ONE TABLE PER SHAFT OPTION, with the shaft
          and flex as their own columns. A single wide table with a column pair
          per option would not fit a phone, and the shaft is the thing people
          are actually asking about, so it gets a column rather than being
          buried at the end of a sentence. */}
      {matrixColumns.length > 0 && (
        <div className="space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t('fullSpecs')}</h3>
          {matrixColumns.map((c) => {
            const rows = SPEC_ROWS.filter((row) => c.parts.some((p) => p.row === row))
            const cells = (row: SpecRow) => {
              const hits = c.parts.filter((p) => p.row === row).map((p) => splitClubPart(p.text))
              const join = (vals: (string | null)[]) => {
                const seen = [...new Set(vals.filter((v): v is string => !!v))]
                return seen.length > 0 ? seen.join(' · ') : NO_VALUE
              }
              return {
                spec: join(hits.map((h) => h.spec)),
                shaft: join(hits.map((h) => h.shaft)),
                weight: join(hits.map((h) => h.weight)),
                flex: join(hits.map((h) => h.flex)),
              }
            }
            const label = c.variant.label ?? c.variant.key
            return (
              <div key={c.variant.key}>
                <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-primary">{label}</p>

                {/* Phones get one card per club instead of a five-column table.
                    Sideways-scrolling a table to read a spec is miserable on
                    the device this sheet is actually opened on, and the
                    previous nowrap-plus-scroll only stopped the text breaking
                    — it did not make the table readable. Values that are just
                    NO_VALUE are dropped rather than shown as empty rows. */}
                <div className="space-y-2 sm:hidden">
                  {rows.map((row) => {
                    const v = cells(row)
                    const facts: [string, string][] = [
                      [t('colShaft'), v.shaft],
                      [t('colWeight'), v.weight],
                      [t('colFlex'), v.flex],
                    ]
                    return (
                      <div key={row} className="rounded-lg border border-primary/20 p-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {rowLabel(row)}
                        </p>
                        <p className="mt-0.5 font-semibold">{v.spec}</p>
                        <dl className="mt-2 space-y-1 text-sm">
                          {facts
                            .filter(([, value]) => value !== NO_VALUE)
                            .map(([k, value]) => (
                              <div key={k} className="flex gap-2">
                                <dt className="shrink-0 text-muted-foreground">{k}</dt>
                                <dd className="font-medium">{value}</dd>
                              </div>
                            ))}
                        </dl>
                      </div>
                    )
                  })}
                </div>

                <div className="hidden overflow-x-auto rounded-lg border border-primary/20 sm:block">
                  <table className="w-auto min-w-full border-collapse text-sm">
                    <caption className="sr-only">
                      {t('fullSpecsCaption', { name: `${setShortName(set.name)}, ${label}` })}
                    </caption>
                    <thead>
                      <tr className="bg-primary/5 text-left [&>th]:whitespace-nowrap">
                        <th scope="col" className="px-3 py-2.5 font-bold">{t('colClub')}</th>
                        <th scope="col" className="px-3 py-2.5 font-bold">{t('colSpec')}</th>
                        <th scope="col" className="px-3 py-2.5 font-bold">{t('colShaft')}</th>
                        <th scope="col" className="px-3 py-2.5 font-bold">{t('colWeight')}</th>
                        <th scope="col" className="px-3 py-2.5 font-bold">{t('colFlex')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => {
                        const v = cells(row)
                        return (
                          <tr key={row} className="border-t border-primary/15 [&>*]:whitespace-nowrap">
                            <th scope="row" className="px-3 py-2.5 text-left font-semibold">{rowLabel(row)}</th>
                            <td className="px-3 py-2.5 text-muted-foreground">{v.spec}</td>
                            <td className="px-3 py-2.5 text-muted-foreground">{v.shaft}</td>
                            {/* NO_VALUE where the owner's sheet records no
                                weight (steel irons, both wedge sets). */}
                            <td className="px-3 py-2.5 text-muted-foreground">{v.weight}</td>
                            <td className="px-3 py-2.5 text-muted-foreground">{v.flex}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Shaft options that are a note rather than a club list */}
      {noteVariants.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">{t('shaftOptions')}</h3>
          <ul className="space-y-1.5">
            {noteVariants.map((v) => (
              <li key={v.key} className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{v.label ?? v.key}</span>
                {v.spec ? <>: {v.spec}</> : null}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
