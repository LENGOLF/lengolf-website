import { Fragment } from 'react'
import Link from 'next/link'
import { Star, ArrowRight, Check } from 'lucide-react'
import { useLocale } from 'next-intl'
import { BOOKING_URL, BUSINESS_INFO, SOCIAL_LINKS } from '@/lib/constants'
import type { ActivityOccasionSeoPage } from '@/types/seo-pages'
import AqiWidget from '@/components/shared/AqiWidget'
import BoldText from '@/components/shared/BoldText'
import MarkdownTable, { isMarkdownTableBlock } from '@/components/shared/MarkdownTable'
import FaqSection, { type FaqLink } from '@/components/shared/FaqSection'

interface Props {
  data: ActivityOccasionSeoPage
}

// TODO Phase 1B: Add i18n support
// - Import useTranslations from 'next-intl'
// - Add translation keys to messages/en.json and messages/th.json for:
//   - Button text: "Book a Bay", "LINE Us", "Explore More"
//   - Section headers: "Why LENGOLF Is a Great Option", "Other Options to Consider", "How LENGOLF Compares", "Ready to Try It?"
//   - UI text: "Year-round", "Best:", feature chips, etc.
// Currently all UI strings are hardcoded English (Phase 1A).

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

function formatSeasonalRelevance(months: number[], locale: string): string {
  if (months.length === 12) return 'Year-round'
  if (months.length === 0) return ''
  const names = months.map((m) => getMonthName(m, locale))
  if (months.length <= 3) return names.join(', ')
  return `${names[0]}–${names[names.length - 1]}`
}

export default function ActivityPageComponent({ data }: Props) {
  const locale = useLocale()
  const { content } = data
  const season = formatSeasonalRelevance(content.seasonal_relevance, locale)

  return (
    <div className="activity-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a472a] to-[#2d6a4f] py-16 md:py-24 text-white">
        <div className="mx-auto max-w-[900px] px-5">
          <h1 className="text-3xl font-bold md:text-5xl mb-4">{data.title}</h1>
          {season && (
            <p className="text-lg text-white/80 mb-8">
              {season === 'Year-round' ? 'Year-round activity' : `Best: ${season}`}
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
              Book a Bay
            </a>
            <a
              href={SOCIAL_LINKS.line}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              LINE Us
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
            Why LENGOLF Is a Great Option
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg mb-6">
            {content.why_lengolf}
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full bg-[#e8f5e9] px-4 py-2 text-sm text-[#2d6a4f]">
              <Check className="h-4 w-4" />
              550 THB/hour for up to 5 people
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[#e8f5e9] px-4 py-2 text-sm text-[#2d6a4f]">
              <Check className="h-4 w-4" />
              Mercury Ville, BTS Chidlom (Exit 4)
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[#e8f5e9] px-4 py-2 text-sm text-[#2d6a4f]">
              <Check className="h-4 w-4" />
              Air-conditioned, rain-proof, open until late
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
              Other Options to Consider
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
              How LENGOLF Compares
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-[#2d6a4f]">
                    <th className="py-3 pr-4 text-left font-semibold text-[#1a472a]">Feature</th>
                    <th className="py-3 px-4 text-left font-semibold text-[#2d6a4f]">LENGOLF</th>
                    <th className="py-3 pl-4 text-left font-semibold text-muted-foreground">Alternatives</th>
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
          title="Frequently Asked"
          titleSuffix="Questions"
        />
      )}

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-[#1a472a] to-[#2d6a4f] text-white text-center">
        <div className="mx-auto max-w-[900px] px-5">
          <h2 className="text-2xl font-bold md:text-3xl mb-4">Ready to Try It?</h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Book a bay at LENGOLF, {BUSINESS_INFO.addressShort}. Open {BUSINESS_INFO.hours}.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#d4a843] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#c49a3a]"
            >
              Book Now
            </a>
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Call {BUSINESS_INFO.phone}
            </a>
            <a
              href={SOCIAL_LINKS.line}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              LINE Us
            </a>
          </div>
        </div>
      </section>

      {/* Related Pages */}
      {data.related_slugs && data.related_slugs.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-[900px] px-5">
            <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-6">Explore More</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {data.related_slugs.map((path) => {
                // related_slugs store full paths like "/activities/indoor-activities-bangkok" or "/events"
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
