import { Fragment } from 'react'
// Locale-aware Link: a bare next/link emits an un-prefixed href, so every
// related-page card on a translated page exited the reader's locale back to
// English. Every related_slugs target IS translated in every locale that
// ships these pages, so this was a pure locale exit, not a missing page.
// BestOfListiclePage already imports from here.
import { Link } from '@/i18n/navigation'
import { ArrowRight, Check, Calendar } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import { buildRelatedLabels } from '@/lib/seo-links'
import { getSiteFacts, getFactTokens } from '@/lib/site-facts'
import { BOOKING_URL, BUSINESS_INFO, SOCIAL_LINKS } from '@/lib/constants'
import { StarIcon } from '@/components/shared/StarRating'
import { truncateReviewText } from '@/lib/google-reviews'
import type { PriceGuideSeoPage } from '@/types/seo-pages'
import { comparisonThb } from '@/data/coaching-providers'

interface Props {
  data: PriceGuideSeoPage
}

interface PriceGroup {
  venue: string | null
  rows: { label: string; price: string; notes: string }[]
}

// Rows named "Venue — Item" collapse into venue-titled groups so the table
// reads as one block per venue instead of repeating the venue in every row.
// Consecutive rows sharing the same prefix join the same group; rows without
// the separator stay ungrouped. Pages where no row carries a venue prefix
// render as a flat table.
function groupPriceRows(rows: { item: string; price: string; notes: string }[]): PriceGroup[] {
  const groups: PriceGroup[] = []
  for (const row of rows) {
    const sep = row.item.indexOf(' — ')
    const venue = sep > 0 ? row.item.slice(0, sep) : null
    const label = sep > 0 ? row.item.slice(sep + 3) : row.item
    const prev = groups[groups.length - 1]
    if (prev && venue !== null && prev.venue === venue) {
      prev.rows.push({ label, price: row.price, notes: row.notes })
    } else {
      groups.push({ venue, rows: [{ label, price: row.price, notes: row.notes }] })
    }
  }
  return groups
}

export default async function PriceGuidePageComponent({ data }: Props) {
  const { content } = data
  const priceGroups = groupPriceRows(content.price_breakdown)
  const hasVenueGroups = priceGroups.some((g) => g.venue !== null)

  const locale = await getLocale()
  const [t, tContact, facts, tokens, relatedLabels] = await Promise.all([
    getTranslations('PriceGuidePage'),
    getTranslations('ContactInfo'),
    getSiteFacts(),
    getFactTokens(locale),
    buildRelatedLabels(data.related_slugs, locale),
  ])

  return (
    <div className="price-guide-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a472a] to-[#2d6a4f] py-16 md:py-24 text-white">
        <div className="mx-auto max-w-[900px] px-5">
          <h1 className="text-3xl font-bold md:text-5xl mb-4">{data.title}</h1>
          <div className="flex items-center gap-2 text-white/70 text-sm mb-8">
            <Calendar className="h-4 w-4" />
            <span>{t('lastVerified', { date: content.last_verified })}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#d4a843] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#c49a3a]"
            >
              {t('bookABay')}
            </a>
            <a
              href={SOCIAL_LINKS.line}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t('lineUs')}
            </a>
          </div>
        </div>
      </section>

      {/* Intro Section (answer-first) */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[900px] px-5">
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            {content.intro}
          </p>
        </div>
      </section>

      {/* Provider comparison (lesson prices). Placed straight after the
          answer-first intro so the comparison is the first table a reader or
          crawler meets. One <table> at every width: below md each row stacks
          into a card and each cell carries its column name inline, so the
          figures read in context instead of duplicating the table as cards. */}
      {content.coaching_comparison && (
        <section className="py-12 md:py-16 bg-[#f8f9fa]" id="compare">
          <div className="mx-auto max-w-[1100px] px-4 md:px-5">
            {/* At a glance: numbers only, sorted by the resolved single-lesson
                price so the order stays true when LENGOLF's POS price moves. */}
            {(() => {
              const cmp = content.coaching_comparison!
              const g = cmp.glance
              const thb = comparisonThb
              const rows = [...cmp.rows].sort(
                (a, b) => (thb(a.singleLessonThb) ?? Infinity) - (thb(b.singleLessonThb) ?? Infinity)
              )
              const figure = (v: number | string | null, note?: string) => {
                const n = thb(v)
                if (n === null) return <span className="text-muted-foreground">{g.notPublished}</span>
                return (
                  <>
                    <span className="font-semibold tabular-nums">{n.toLocaleString('en-US')}</span>
                    {note && <span className="block text-[11px] leading-tight text-muted-foreground">{note}</span>}
                  </>
                )
              }
              return (
                <div className="mb-14" id="prices-at-a-glance">
                  <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-3">{g.heading}</h2>
                  <p className="mb-5 text-base leading-relaxed text-muted-foreground">{g.intro}</p>
                  <div className="overflow-x-auto rounded-lg border border-border bg-white">
                    <table className="w-full border-collapse text-sm">
                      <caption className="sr-only">{g.heading}</caption>
                      <thead>
                        <tr className="border-b-2 border-[#2d6a4f] text-left">
                          <th scope="col" className="py-3 pl-3 pr-2 font-semibold text-[#1a472a] sm:pl-4 sm:pr-3">{g.columns.provider}</th>
                          <th scope="col" className="py-3 px-2 text-right font-semibold text-[#1a472a] sm:px-3">{g.columns.single}</th>
                          <th scope="col" className="py-3 px-2 text-right font-semibold text-[#1a472a] sm:px-3">{g.columns.rate}</th>
                          <th scope="col" className="py-3 pl-2 pr-3 text-center font-semibold text-[#1a472a] sm:px-3">{g.columns.trial}</th>
                          <th scope="col" className="hidden py-3 pl-3 pr-4 font-semibold text-[#1a472a] sm:table-cell">{g.columns.includes}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row) => {
                          const isLengolf = row.id === 'lengolf'
                          return (
                            <tr key={row.id} className={`border-b border-border last:border-0 ${isLengolf ? 'bg-[#f0f7f2]' : ''}`}>
                              <th scope="row" className={`py-2.5 pl-3 pr-2 text-left font-semibold sm:pl-4 sm:pr-3 ${isLengolf ? 'text-[#2d6a4f]' : 'text-[#1a472a]'}`}>
                                <a href={`#provider-${row.id}`} className="hover:underline">{row.name}</a>
                              </th>
                              <td className={`py-2.5 px-2 text-right align-top sm:px-3 ${isLengolf ? 'text-[#2d6a4f]' : ''}`}>{figure(row.singleLessonThb, row.singleNote)}</td>
                              <td className="py-2.5 px-2 text-right align-top sm:px-3">{figure(row.lowestRateThb, row.rateNote)}</td>
                              <td className="py-2.5 pl-2 pr-3 text-center align-top sm:px-3">{row.freeTrial ? <span className="font-semibold text-[#2d6a4f]">{g.yes}</span> : <span className="text-muted-foreground">{g.no}</span>}</td>
                              <td className="hidden py-2.5 pl-3 pr-4 align-top text-muted-foreground sm:table-cell">{row.includesShort}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })()}
            <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-3">
              {content.coaching_comparison.heading}
            </h2>
            <p className="mb-6 text-base leading-relaxed text-muted-foreground">
              {content.coaching_comparison.intro}
            </p>
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">{content.coaching_comparison.heading}</caption>
              <thead className="hidden md:table-header-group">
                <tr className="border-b-2 border-[#2d6a4f]">
                  <th scope="col" className="py-3 pr-3 text-left font-semibold text-[#1a472a]">{content.coaching_comparison.columns.provider}</th>
                  <th scope="col" className="py-3 px-3 text-left font-semibold text-[#1a472a]">{content.coaching_comparison.columns.single}</th>
                  <th scope="col" className="py-3 px-3 text-left font-semibold text-[#1a472a]">{content.coaching_comparison.columns.packages}</th>
                  <th scope="col" className="py-3 px-3 text-left font-semibold text-[#1a472a]">{content.coaching_comparison.columns.includes}</th>
                  <th scope="col" className="py-3 pl-3 text-left font-semibold text-[#1a472a]">{content.coaching_comparison.columns.source}</th>
                </tr>
              </thead>
              <tbody className="block md:table-row-group">
                {content.coaching_comparison.rows.map((row) => {
                  const isLengolf = row.id === 'lengolf'
                  const cols = content.coaching_comparison!.columns
                  const cellLabel = (text: string) => (
                    <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground md:hidden">
                      {text}
                    </span>
                  )
                  return (
                    <tr
                      key={row.id}
                      id={`provider-${row.id}`}
                      className={`mb-4 block rounded-lg border border-border bg-white p-4 md:mb-0 md:table-row md:rounded-none md:border-0 md:border-b md:p-0 ${isLengolf ? 'md:bg-[#f0f7f2] border-[#2d6a4f]/40' : 'md:bg-transparent'}`}
                    >
                      <th scope="row" className="block pb-2 text-left align-top md:table-cell md:py-3 md:pr-3">
                        <span className={`block font-bold ${isLengolf ? 'text-[#2d6a4f]' : 'text-[#1a472a]'}`}>{row.name}</span>
                        <span className="mt-1 block text-xs font-normal text-muted-foreground">{row.kind}</span>
                        <span className="mt-1 block text-xs font-normal text-muted-foreground">{row.area}</span>
                      </th>
                      <td className="block py-1.5 align-top md:table-cell md:px-3 md:py-3">
                        {cellLabel(cols.single)}
                        <span className={row.singleLessonThb === null ? 'text-muted-foreground' : 'font-semibold text-[#2d6a4f]'}>{row.singleLesson}</span>
                      </td>
                      <td className="block py-1.5 align-top md:table-cell md:px-3 md:py-3">
                        {cellLabel(cols.packages)}
                        {row.packageRate}
                      </td>
                      <td className="block py-1.5 align-top text-muted-foreground md:table-cell md:px-3 md:py-3">
                        {cellLabel(cols.includes)}
                        {row.includes}
                      </td>
                      <td className="block pt-1.5 align-top text-xs text-muted-foreground md:table-cell md:py-3 md:pl-3">
                        {cellLabel(cols.source)}
                        {row.sourceUrl ? (
                          <a
                            href={row.sourceUrl}
                            target="_blank"
                            rel={isLengolf ? undefined : 'nofollow noopener noreferrer'}
                            className="underline decoration-dotted underline-offset-2 hover:text-[#2d6a4f]"
                          >
                            {row.sourceLabel}
                          </a>
                        ) : (
                          row.sourceLabel
                        )}
                        <span className="block">
                          {row.checkedOn ? (
                            <>
                              {content.coaching_comparison!.checkedLabel}{' '}
                              <time dateTime={row.checkedOn}>{row.checkedOn}</time>
                            </>
                          ) : (
                            content.coaching_comparison!.liveLabel
                          )}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {content.coaching_comparison.footnote}
            </p>
          </div>
        </section>
      )}

      {/* Price Breakdown Table */}
      <section className={`py-12 md:py-16 ${content.coaching_comparison ? '' : 'bg-[#f8f9fa]'}`}>
        <div className="mx-auto max-w-[900px] px-5">
          <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-6">
            {t('priceBreakdownHeading')}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-[#2d6a4f]">
                  <th className="py-3 pr-4 text-left font-semibold text-[#1a472a]">{t('colItem')}</th>
                  <th className="py-3 px-4 text-left font-semibold text-[#2d6a4f] whitespace-nowrap">{t('colPrice')}</th>
                  <th className="py-3 pl-4 text-left font-semibold text-muted-foreground">{t('colNotes')}</th>
                </tr>
              </thead>
              <tbody>
                {hasVenueGroups
                  ? priceGroups.map((group, gi) => {
                      const isLengolf = group.venue === 'LENGOLF'
                      const tint = isLengolf ? 'bg-[#f0f7f2]' : ''
                      return (
                        <Fragment key={`${group.venue ?? 'other'}-${gi}`}>
                          {group.venue && (
                            <tr className={tint}>
                              <td colSpan={3} className={`${gi === 0 ? 'pt-3' : 'pt-6'} pb-2 pr-4 ${isLengolf ? 'pl-4' : ''}`}>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#1a472a]">
                                  {group.venue}
                                </span>
                              </td>
                            </tr>
                          )}
                          {group.rows.map((row) => (
                            <tr key={`${group.venue ?? 'other'}-${row.label}`} className={`border-b border-border ${tint}`}>
                              <td className={`py-3 pr-4 font-medium text-[#1a472a] ${group.venue ? 'pl-4' : ''}`}>{row.label}</td>
                              <td className="py-3 px-4 text-[#2d6a4f] font-semibold whitespace-nowrap">{row.price}</td>
                              <td className="py-3 pl-4 text-muted-foreground">{row.notes}</td>
                            </tr>
                          ))}
                        </Fragment>
                      )
                    })
                  : content.price_breakdown.map((row) => (
                      <tr key={row.item} className="border-b border-border">
                        <td className="py-3 pr-4 font-medium text-[#1a472a]">{row.item}</td>
                        <td className="py-3 px-4 text-[#2d6a4f] font-semibold whitespace-nowrap">{row.price}</td>
                        <td className="py-3 pl-4 text-muted-foreground">{row.notes}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Venue Comparison Table */}
      {content.venue_comparison && (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-[900px] px-5">
            <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-6">
              {t('venueComparisonHeading')}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-[#2d6a4f]">
                    <th className="py-3 pr-3 text-left font-semibold text-[#1a472a]">{t('colVenue')}</th>
                    <th className="py-3 px-3 text-left font-semibold text-[#1a472a] whitespace-nowrap">{t('colCheapest')}</th>
                    <th className="py-3 px-3 text-left font-semibold text-[#1a472a] whitespace-nowrap">{t('colPeak')}</th>
                    <th className="py-3 px-3 text-left font-semibold text-[#1a472a]">{t('colPlayers')}</th>
                    <th className="py-3 px-3 text-left font-semibold text-[#1a472a]">{t('colTech')}</th>
                    <th className="py-3 px-3 text-left font-semibold text-[#1a472a]">{t('colTaxIncluded')}</th>
                    <th className="py-3 pl-3 text-left font-semibold text-[#1a472a]">{t('colLocation')}</th>
                  </tr>
                </thead>
                <tbody>
                  {content.venue_comparison.venues.map((venue) => {
                    const isLengolf = venue.name === 'LENGOLF'
                    return (
                      <tr
                        key={venue.name}
                        className={`border-b border-border ${isLengolf ? 'bg-[#f0f7f2]' : ''}`}
                      >
                        <td className={`py-3 pr-3 font-medium whitespace-nowrap ${isLengolf ? 'text-[#2d6a4f] font-bold' : 'text-[#1a472a]'}`}>
                          {venue.name}
                        </td>
                        <td className={`py-3 px-3 whitespace-nowrap ${isLengolf ? 'text-[#2d6a4f] font-semibold' : ''}`}>
                          {venue.cheapest_rate}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">{venue.peak_rate}</td>
                        <td className="py-3 px-3 text-center">{venue.players_per_bay ?? '—'}</td>
                        <td className="py-3 px-3">{venue.tech}</td>
                        <td className="py-3 px-3 text-center">{venue.price_includes_tax === null ? '—' : venue.price_includes_tax ? t('taxYes') : t('taxNo')}</td>
                        <td className="py-3 pl-3 text-muted-foreground">{venue.location}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {content.venue_comparison.summary}
            </p>
          </div>
        </section>
      )}

      {/* Additional Sections */}
      {content.sections && content.sections.length > 0 && (
        <>
          {content.sections.map((section, index) => (
            <section
              key={section.heading}
              className={`py-12 md:py-16 ${index % 2 === 0 ? 'bg-[#f8f9fa]' : ''}`}
            >
              <div className="mx-auto max-w-[900px] px-5">
                <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-4">
                  {section.heading}
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                  {section.body}
                </p>
              </div>
            </section>
          ))}
        </>
      )}

      {/* Comparison with Alternatives */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[900px] px-5">
          <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-4">
            {t('costsCompareHeading')}
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            {content.comparison_with_alternatives}
          </p>
        </div>
      </section>

      {/* Curated Reviews */}
      {content.curated_reviews && content.curated_reviews.length > 0 && (
        <section className="py-12 md:py-16 bg-[#f8f9fa]">
          <div className="mx-auto max-w-[900px] px-5">
            <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-6">
              {t('reviewsHeading')}
            </h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {content.curated_reviews.slice(0, 3).map((review) => {
                const truncated = truncateReviewText(review.text, 150)
                return (
                  <div key={review.reviewer_name} className="rounded-lg border border-border/60 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {review.reviewer_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{review.reviewer_name}</p>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon key={star} filled />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{truncated}</p>
                  </div>
                )
              })}
            </div>
            <div className="mt-6 text-center">
              <a
                href="https://maps.app.goo.gl/4eCe3XNUWEf7QPcL7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                {t('readAllReviews')}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Q&A. Native <details> rather than the Radix accordion: a closed
          Radix item unmounts its answer, and these answers exist to be read by
          crawlers (see the /faq/ hub). The same items ship as FAQPage JSON-LD
          from app/[locale]/cost/[slug]/page.tsx. */}
      {content.faq && content.faq.items.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-[900px] px-5">
            <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-6">
              {content.faq.heading}
            </h2>
            <div className="divide-y divide-border/60 rounded-lg border border-border/60 bg-white">
              {content.faq.items.map((item, i) => (
                <details key={item.question} className="group px-5" open={i === 0}>
                  <summary className="cursor-pointer list-none py-4 font-semibold text-[#1a472a] marker:hidden">
                    {item.question}
                  </summary>
                  <p className="pb-5 text-base leading-relaxed text-muted-foreground">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Value Proposition */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[900px] px-5">
          <div className="rounded-xl border-2 border-[#d4a843]/30 bg-[#fefbf0] p-6 md:p-8">
            <h2 className="text-xl font-bold text-[#1a472a] md:text-2xl mb-3">
              {t('bottomLineHeading')}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg mb-4">
              {content.value_proposition}
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full bg-[#e8f5e9] px-4 py-2 text-sm text-[#2d6a4f]">
                <Check className="h-4 w-4" />
                {/* POS-backed, like the identical pills on /faq/ and
                    /activities/ — a price guide quoting a stale hardcoded rate
                    next to its own live price table is the worst place for it. */}
                {t('pillRate', { rate: tokens.bayHourlyFrom, n: facts.maxPlayersPerBay })}
              </div>
              <div className="flex items-center gap-2 rounded-full bg-[#e8f5e9] px-4 py-2 text-sm text-[#2d6a4f]">
                <Check className="h-4 w-4" />
                {t('pillLocation')}
              </div>
              <div className="flex items-center gap-2 rounded-full bg-[#e8f5e9] px-4 py-2 text-sm text-[#2d6a4f]">
                <Check className="h-4 w-4" />
                {t('pillComfort')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-[#1a472a] to-[#2d6a4f] text-white text-center">
        <div className="mx-auto max-w-[900px] px-5">
          <h2 className="text-2xl font-bold md:text-3xl mb-4">{t('ctaTitle')}</h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            {t('ctaText', {
              // See the identical substitution in components/faq/FaqPage.tsx:
              // BUSINESS_INFO.addressShort / .hours are English constants that
              // would strand an English fragment inside a translated sentence.
              address: tContact('address'),
              hours: facts.openingHours,
            })}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#d4a843] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#c49a3a]"
            >
              {t('bookNow')}
            </a>
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t('call', { phone: BUSINESS_INFO.phone })}
            </a>
            <a
              href={SOCIAL_LINKS.line}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t('lineUs')}
            </a>
          </div>
        </div>
      </section>

      {/* Related Pages */}
      {data.related_slugs && data.related_slugs.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-[900px] px-5">
            <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-6">{t('exploreMore')}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {data.related_slugs.map((path) => {
                // Localized target title, falling back to the slug only when
                // the target has no entry in this locale (or is not an SEO
                // page). The slug fallback alone rendered English card titles
                // under a localized heading on every translated page.
                const label =
                  relatedLabels[path] ??
                  path
                    .split('/')
                    .filter(Boolean)
                    .pop()!
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase())
                return (
                  <Link
                    key={path}
                    href={path}
                    className="group flex items-center justify-between rounded-lg border p-4 transition-colors hover:border-[#2d6a4f] hover:bg-[#e8f5e9]"
                  >
                    <span className="text-sm font-medium text-[#1a472a] group-hover:text-[#2d6a4f]">
                      {label}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[#2d6a4f]" />
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
