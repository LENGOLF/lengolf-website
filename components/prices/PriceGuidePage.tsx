import { Fragment } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Calendar } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import { getSiteFacts, getFactTokens } from '@/lib/site-facts'
import { BOOKING_URL, BUSINESS_INFO, SOCIAL_LINKS } from '@/lib/constants'
import { StarIcon } from '@/components/shared/StarRating'
import type { PriceGuideSeoPage } from '@/types/seo-pages'

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
  const [t, tContact, facts, tokens] = await Promise.all([
    getTranslations('PriceGuidePage'),
    getTranslations('ContactInfo'),
    getSiteFacts(),
    getFactTokens(locale),
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

      {/* Price Breakdown Table */}
      <section className="py-12 md:py-16 bg-[#f8f9fa]">
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
                const maxLen = 150
                const truncated = review.text.length > maxLen
                  ? review.text.slice(0, maxLen).replace(/\s+\S*$/, '') + '...'
                  : review.text
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
                const label = path
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
