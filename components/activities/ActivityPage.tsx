import { Fragment } from 'react'
// Locale-aware Link: a bare next/link emits an un-prefixed href, so every
// related-page card on a translated page exited the reader's locale back to
// English. Every related_slugs target IS translated in every locale that
// ships these pages, so this was a pure locale exit, not a missing page.
// BestOfListiclePage already imports from here.
import { Link } from '@/i18n/navigation'
import { Star, ArrowRight, Check } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import { buildRelatedLabels } from '@/lib/seo-links'
import { getSiteFacts, getFactTokens } from '@/lib/site-facts'
import { BOOKING_URL, BUSINESS_INFO, SOCIAL_LINKS } from '@/lib/constants'
import type { ActivityOccasionSeoPage } from '@/types/seo-pages'
import AqiWidget from '@/components/shared/AqiWidget'
import BoldText from '@/components/shared/BoldText'
import MarkdownTable, { isMarkdownTableBlock } from '@/components/shared/MarkdownTable'
import FaqSection, { type FaqLink } from '@/components/shared/FaqSection'

interface Props {
  data: ActivityOccasionSeoPage
}

// Phrases inside content.faqs answers that become links. Kept generic so any
// activity page opting into FAQs picks them up; JSON-LD still gets the plain
// answer string (getFaqPageJsonLd reads content.faqs directly).
const faqLinks: Record<string, FaqLink> = {
  'event packages': { href: '/events' },
  'food and drinks menu': { href: '/menu' },
  'booking.len.golf': { href: BOOKING_URL, external: true },
}

function getMonthName(month: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: 'short' }).format(new Date(2024, month - 1))
}

/**
 * Seasonality of an activity, as a TAGGED shape rather than a display string.
 *
 * This used to be a plain `string` where the 12-month case returned the literal
 * 'Year-round' and the caller branched on `season === 'Year-round'`. That
 * comparison is a trap the moment the copy is localized: the helper would
 * return a translated string, the equality check would never match, and every
 * translated page would silently render the "Best: …" branch with the
 * year-round label inside it. The 12-month case is now a tag the component
 * tests structurally, so the branch no longer depends on any user-visible text.
 * Month names still localize through Intl.DateTimeFormat(locale).
 */
type Seasonality =
  | { kind: 'year-round' }
  | { kind: 'months'; label: string }
  | { kind: 'none' }

function getSeasonality(months: number[], locale: string): Seasonality {
  if (months.length === 12) return { kind: 'year-round' }
  if (months.length === 0) return { kind: 'none' }
  const names = months.map((m) => getMonthName(m, locale))
  if (months.length <= 3) return { kind: 'months', label: names.join(', ') }
  return { kind: 'months', label: `${names[0]}–${names[names.length - 1]}` }
}

export default async function ActivityPageComponent({ data }: Props) {
  const { content } = data

  const locale = await getLocale()
  const [t, tContact, facts, tokens, relatedLabels] = await Promise.all([
    getTranslations('ActivityPage'),
    getTranslations('ContactInfo'),
    getSiteFacts(),
    getFactTokens(locale),
    buildRelatedLabels(data.related_slugs, locale),
  ])
  const seasonality = getSeasonality(content.seasonal_relevance, locale)

  return (
    <div className="activity-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a472a] to-[#2d6a4f] py-16 md:py-24 text-white">
        <div className="mx-auto max-w-[900px] px-5">
          <h1 className="text-3xl font-bold md:text-5xl mb-4">{data.title}</h1>
          {seasonality.kind !== 'none' && (
            <p className="text-lg text-white/80 mb-8">
              {seasonality.kind === 'year-round'
                ? t('yearRoundActivity')
                : t('bestSeason', { season: seasonality.label })}
              {' · '}
              {content.target_audience}
            </p>
          )}
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

      {/* AQI Widget (for indoor-related pages) */}
      {content.show_aqi_widget && (
        <section className="pb-8 md:pb-12">
          <div className="mx-auto max-w-[900px] px-5">
            <AqiWidget className="max-w-none" />
          </div>
        </section>
      )}

      {/* Why LENGOLF Section */}
      <section className="py-12 md:py-16 bg-[#f8f9fa]">
        <div className="mx-auto max-w-[900px] px-5">
          <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-4">
            {t('whyHeading')}
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg mb-6">
            {content.why_lengolf}
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full bg-[#e8f5e9] px-4 py-2 text-sm text-[#2d6a4f]">
              <Check className="h-4 w-4" />
              {/* Rate + group size come from the POS-backed catalog, like the
                  identical pills on /faq/ — a hardcoded "550 THB" here would go
                  stale five times over once this ships in five languages. */}
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
      </section>

      {/* Depth Sections (optional). The "Why LENGOLF" block above is
          bg-[#f8f9fa], so these start white and alternate from there. */}
      {content.sections?.map((section, index) => (
        <section
          key={section.heading}
          className={`py-12 md:py-16 ${index % 2 === 0 ? '' : 'bg-[#f8f9fa]'}`}
        >
          <div className="mx-auto max-w-[900px] px-5">
            <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-4">
              {section.heading}
            </h2>
            <div className="text-base leading-relaxed text-muted-foreground md:text-lg space-y-4">
              {section.body.split('\n\n').map((paragraph, pIdx) => {
                const lines = paragraph.split('\n')
                if (isMarkdownTableBlock(lines)) {
                  return <MarkdownTable key={pIdx} lines={lines} />
                }
                return (
                  <p key={pIdx}>
                    {lines.map((line, lIdx) => (
                      <Fragment key={lIdx}>
                        {lIdx > 0 && <br />}
                        <BoldText text={line} />
                      </Fragment>
                    ))}
                  </p>
                )
              })}
            </div>
          </div>
        </section>
      ))}

      {/* Other Activities Section */}
      {content.other_activities.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-[900px] px-5">
            <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-6">
              {t('otherOptionsHeading')}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {content.other_activities.map((activity) => (
                <div
                  key={activity.name}
                  className="rounded-xl border bg-white p-5"
                >
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 mt-0.5 shrink-0 text-[#d4a843]" />
                    <div>
                      <h3 className="font-semibold text-[#1a472a] mb-1">{activity.name}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Comparison Table */}
      {content.comparison_table.length > 0 && (
        <section className="py-12 md:py-16 bg-[#f8f9fa]">
          <div className="mx-auto max-w-[900px] px-5">
            <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-6">
              {t('comparisonHeading')}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-[#2d6a4f]">
                    <th className="py-3 pr-4 text-left font-semibold text-[#1a472a]">{t('colFeature')}</th>
                    {/* colLengolf is the brand name — a key only so the column
                        header is not an English literal in the markup; every
                        locale holds it verbatim as "LENGOLF". */}
                    <th className="py-3 px-4 text-left font-semibold text-[#2d6a4f]">{t('colLengolf')}</th>
                    <th className="py-3 pl-4 text-left font-semibold text-muted-foreground">{t('colAlternatives')}</th>
                  </tr>
                </thead>
                <tbody>
                  {content.comparison_table.map((row) => (
                    <tr key={row.feature} className="border-b border-border">
                      <td className="py-3 pr-4 font-medium text-[#1a472a]">{row.feature}</td>
                      <td className="py-3 px-4 text-[#2d6a4f]">{row.lengolf}</td>
                      <td className="py-3 pl-4 text-muted-foreground">{row.alternative}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section (optional). FAQPage JSON-LD is emitted by the route. */}
      {content.faqs && content.faqs.length > 0 && (
        <FaqSection
          items={content.faqs}
          links={faqLinks}
          title={t('faqTitle')}
          titleSuffix={t('faqTitleSuffix')}
        />
      )}

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-[#1a472a] to-[#2d6a4f] text-white text-center">
        <div className="mx-auto max-w-[900px] px-5">
          <h2 className="text-2xl font-bold md:text-3xl mb-4">{t('ctaTitle')}</h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            {t('ctaText', {
              // Same substitution the /faq/ CTA makes: ContactInfo.address is
              // the localized form of BUSINESS_INFO.addressShort, and
              // facts.openingHours ("09:00–23:00") is locale-neutral, where
              // BUSINESS_INFO.hours is the English "9am – 11pm, Monday –
              // Sunday". Either constant would strand an English fragment
              // inside an otherwise translated sentence.
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
                // related_slugs store full paths like "/activities/indoor-activities-bangkok" or "/events"
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
