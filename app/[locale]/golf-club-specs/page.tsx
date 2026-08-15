import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { storageUrl, SITE_URL, SOCIAL_LINKS, BOOKING_URL } from '@/lib/constants'
import { getAlternates, getCanonical, hasTranslationForLocale, ALL_LOCALES } from '@/lib/translated-routes'
import { getBreadcrumbJsonLd } from '@/lib/jsonld'
import { getRentalClubSetsForSpecSheet, setGallery } from '@/lib/clubs'
import { parseVariantSpec, splitSpecEntry, splitClubPart, SPEC_ROWS } from '@/lib/club-specs'
import type { RentalClubSet, SetVariantImage } from '@/lib/clubs'
import type { SpecRow } from '@/lib/club-specs'

const ImageLightbox = dynamic(() => import('@/components/shared/ImageLightbox'), { ssr: true })

export const revalidate = 3600

/**
 * Hidden-but-live sets that still earn a place on the spec sheet.
 *
 * getAllLiveRentalClubSets() returns every active row regardless of
 * website_visible, so this allow-list is what keeps the sheet deliberate: a set
 * someone hides tomorrow stays off until it is named here. The left-handed set
 * is on-request only and has no photos, but "do you have left-handed clubs?" is
 * a recurring chat question and its specs are fully authored, so it belongs.
 */
const EXTRA_SPEC_SLUGS = new Set(['premium-mens-left-handed'])

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
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: getCanonical(locale, '/golf-club-specs/'),
      languages: getAlternates('/golf-club-specs/'),
    },
  }
}

export default async function GolfClubSpecsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('ClubSpecs')

  const sets = await getRentalClubSetsForSpecSheet(EXTRA_SPEC_SLUGS)

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Club Rental', url: `${SITE_URL}/golf-club-rental/` },
    { name: t('h1'), url: `${SITE_URL}/golf-club-specs/` },
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
        <div className="section-max-width section-padding flex items-center justify-between py-4">
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
          <a
            href={`${BOOKING_URL}course-rental`}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            {t('ctaBook')}
          </a>
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
          <h2 className="mb-4 text-2xl font-bold italic">{t('compareTitle')}</h2>
          <div className="overflow-x-auto rounded-xl border border-primary/20">
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

      {/* Minimal footer — backlinks only, no site-wide nav. */}
      <footer className="border-t border-primary/15 bg-white py-8">
        <div className="section-max-width section-padding flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
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
            <div className="overflow-x-auto rounded-lg border border-primary/15">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {splitEntries.map((e, i) => (
                    <tr key={i} className="border-b border-primary/10 last:border-b-0">
                      <th scope="row" className="w-40 bg-primary/5 px-3 py-2 text-left font-semibold">{e.split!.label}</th>
                      <td className="px-3 py-2 text-muted-foreground">{e.split!.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            return (
              <div key={c.variant.key}>
                <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                  {c.variant.label ?? c.variant.key}
                </p>
                <div className="overflow-x-auto rounded-lg border border-primary/20">
                  <table className="w-auto min-w-full border-collapse text-sm">
                    <caption className="sr-only">
                      {t('fullSpecsCaption', { name: `${setShortName(set.name)} — ${c.variant.label ?? c.variant.key}` })}
                    </caption>
                    {/* Every cell is nowrap: a shaft model split across two
                        lines ("Nippon N.S. Pro / Zelos 7") is hard to scan and
                        hard to quote back to a customer. The wrapper scrolls
                        horizontally instead, which is the right trade for a
                        reference table on a phone. */}
                    <thead>
                      <tr className="bg-primary/5 text-left [&>th]:whitespace-nowrap">
                        <th scope="col" className="px-3 py-2.5 font-bold">{t('colClub')}</th>
                        <th scope="col" className="px-3 py-2.5 font-bold">{t('colSpec')}</th>
                        <th scope="col" className="px-3 py-2.5 font-bold">{t('colShaft')}</th>
                        <th scope="col" className="px-3 py-2.5 font-bold">{t('colFlex')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => {
                        const hits = c.parts.filter((p) => p.row === row).map((p) => splitClubPart(p.text))
                        const join = (vals: (string | null)[]) => {
                          const seen = [...new Set(vals.filter((v): v is string => !!v))]
                          return seen.length > 0 ? seen.join(' · ') : '—'
                        }
                        return (
                          <tr key={row} className="border-t border-primary/15 [&>*]:whitespace-nowrap">
                            <th scope="row" className="px-3 py-2.5 text-left font-semibold">{rowLabel(row)}</th>
                            <td className="px-3 py-2.5 text-muted-foreground">{join(hits.map((h) => h.spec))}</td>
                            <td className="px-3 py-2.5 text-muted-foreground">{join(hits.map((h) => h.shaft))}</td>
                            <td className="px-3 py-2.5 text-muted-foreground">{join(hits.map((h) => h.flex))}</td>
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
                {v.spec ? <> — {v.spec}</> : null}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
