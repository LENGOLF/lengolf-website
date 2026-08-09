import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import NextLink from 'next/link'
import { ArrowRight, Check, HelpCircle } from 'lucide-react'
import { getSiteFacts, getFactTokens } from '@/lib/site-facts'
import { BOOKING_URL, BUSINESS_INFO, SOCIAL_LINKS } from '@/lib/constants'
import { relatedQuestionPath, buildRelatedLabels } from '@/lib/seo-links'
import { hasTranslationForLocale } from '@/lib/translated-routes'
import BoldText from '@/components/shared/BoldText'
import MarkdownTable, { isMarkdownTableBlock } from '@/components/shared/MarkdownTable'
import CourseRentalCrossLink from '@/components/shared/CourseRentalCrossLink'
import type { FaqSeoPage } from '@/types/seo-pages'

interface Props {
  data: FaqSeoPage
}

/**
 * FAQ categories whose readers are deciding about renting clubs — these pages
 * get the rental banner instead of relying on the generic "Book a Bay" CTA.
 * Both spellings exist in data/faq-pages.ts ('rental' and 'clubs-rental').
 */
const RENTAL_CTA_CATEGORIES = ['rental', 'clubs-rental']

const FAQ_HUB_LINK_CLASS =
  'text-sm font-semibold text-[#2d6a4f] underline underline-offset-2 hover:text-[#1a472a]'

export default async function FaqPageComponent({ data }: Props) {
  const { content } = data
  const showRentalCta = RENTAL_CTA_CATEGORIES.includes(data.category ?? '')

  const locale = await getLocale()
  const [t, tContact, facts, tokens, relatedLabels] = await Promise.all([
    getTranslations('FaqPage'),
    getTranslations('ContactInfo'),
    getSiteFacts(),
    getFactTokens(locale),
    buildRelatedLabels(data.related_slugs, locale),
  ])

  return (
    <div className="faq-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a472a] to-[#2d6a4f] py-16 md:py-24 text-white">
        <div className="mx-auto max-w-[900px] px-5">
          <p className="text-sm font-medium uppercase tracking-wider text-[#d4a843] mb-4">
            {t('eyebrow')}
          </p>
          <h1 className="text-3xl font-bold md:text-5xl mb-8">{data.title}</h1>
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

      {/* Direct Answer (answer-first) */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[900px] px-5">
          <div className="rounded-xl border-l-4 border-[#2d6a4f] bg-[#f0f7f2] p-6 md:p-8">
            <p className="text-base font-medium leading-relaxed text-[#1a472a] md:text-lg">
              {content.answer_intro}
            </p>
          </div>
        </div>
      </section>

      {/* Expanded Content */}
      <section className="pb-12 md:pb-16">
        <div className="mx-auto max-w-[900px] px-5">
          <div className="prose prose-lg max-w-none text-muted-foreground prose-headings:text-[#1a472a] prose-strong:text-[#1a472a]">
            {content.answer_body.split('\n\n').map((paragraph, i) => {
              // Handle markdown-style bold headers (standalone **heading**)
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                const text = paragraph.replace(/\*\*/g, '')
                return (
                  <h3 key={i} className="text-xl font-bold text-[#1a472a] mt-8 mb-3">
                    {text}
                  </h3>
                )
              }
              // Handle paragraphs that start with a bold header: **heading**\nbody
              if (paragraph.startsWith('**')) {
                const match = paragraph.match(/^\*\*(.+?)\*\*\n?([\s\S]*)$/)
                if (match) {
                  return (
                    <div key={i}>
                      <h3 className="text-xl font-bold text-[#1a472a] mt-8 mb-3">{match[1]}</h3>
                      {match[2] && renderParagraph(match[2], `${i}-body`, match[1])}
                    </div>
                  )
                }
              }
              // Handle italic subheading + bullets: *Label — Price*\n- item\n- item
              if (paragraph.startsWith('*') && !paragraph.startsWith('**')) {
                const match = paragraph.match(/^\*(.+?)\*\n([\s\S]*)$/)
                if (match) {
                  const subheading = match[1]
                  const body = match[2]
                  return (
                    <div key={i} className="mt-6">
                      <p className="text-sm font-semibold uppercase tracking-wide text-[#2d6a4f] mb-2">
                        {subheading}
                      </p>
                      {renderParagraph(body, `${i}-body`, subheading)}
                    </div>
                  )
                }
              }
              // Handle "LABEL:\n- bullet\n- bullet" plain-text prefix before a list
              if (/^[A-Z][^*\n]+:\n-/.test(paragraph)) {
                const newlineIdx = paragraph.indexOf('\n')
                const label = paragraph.slice(0, newlineIdx).replace(/:$/, '').trim()
                const rest = paragraph.slice(newlineIdx + 1)
                return (
                  <div key={i}>
                    <p className="mt-6 mb-2 text-sm font-semibold uppercase tracking-wide text-[#2d6a4f]">
                      {label}
                    </p>
                    {renderParagraph(rest, `${i}-body`, label)}
                  </div>
                )
              }
              return renderParagraph(paragraph, i)
            })}
          </div>
        </div>
      </section>

      {/* Rental conversion banner — the same cross-link the location templates
          use, now also on rental-intent FAQs (the generic "Book a Bay" CTA is
          the wrong ask for a reader deciding whether to rent clubs at all). */}
      {showRentalCta && <CourseRentalCrossLink />}

      {/* LENGOLF Feature Pills */}
      <section className="py-12 md:py-16 bg-[#f8f9fa]">
        <div className="mx-auto max-w-[900px] px-5">
          <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-6">
            {t('aboutHeading')}
          </h2>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full bg-[#e8f5e9] px-4 py-2 text-sm text-[#2d6a4f]">
              <Check className="h-4 w-4" />
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

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-[#1a472a] to-[#2d6a4f] text-white text-center">
        <div className="mx-auto max-w-[900px] px-5">
          <h2 className="text-2xl font-bold md:text-3xl mb-4">{t('ctaTitle')}</h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            {t('ctaText', {
              // ContactInfo.address is the localized form of
              // BUSINESS_INFO.addressShort (ja 「…4階、バンコク」), so the CTA no
              // longer mixes an English address into translated copy.
              address: tContact('address'),
              // facts.openingHours ("09:00–23:00") is locale-neutral;
              // BUSINESS_INFO.hours is the English "9am – 11pm, Monday – Sunday"
              // and left an English fragment inside the translated sentence.
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

      {/* Related Questions */}
      {content.related_questions.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-[900px] px-5">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl">
                {t('relatedQuestions')}
              </h2>
              {/* The /faq hub is only translated for th. The locale-aware Link
                  would emit /<locale>/faq/ for the others and the middleware
                  would 301 it to the EN hub; forcing locale="en" is no better,
                  since localePrefix is 'as-needed' and /en/faq/ 307s. So use a
                  plain unprefixed link to the EN hub, and the locale-aware one
                  only where a translated hub actually exists. */}
              {hasTranslationForLocale(locale, '/faq') ? (
                <Link href="/faq/" className={FAQ_HUB_LINK_CLASS}>
                  {t('browseAllFaqs')}
                </Link>
              ) : (
                <NextLink href="/faq/" className={FAQ_HUB_LINK_CLASS}>
                  {t('browseAllFaqs')}
                </NextLink>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {content.related_questions.map((rq) => (
                <Link
                  key={rq.slug}
                  // Resolved via the shared helper (lib/seo-links.ts) so hrefs,
                  // JSON-LD URLs, and the CI validator can never drift apart.
                  href={relatedQuestionPath(rq.slug)}
                  className="group flex items-start gap-3 rounded-lg border p-4 transition-colors hover:border-[#2d6a4f] hover:bg-[#e8f5e9]"
                >
                  <HelpCircle className="h-5 w-5 mt-0.5 shrink-0 text-[#d4a843] group-hover:text-[#2d6a4f]" />
                  <span className="text-sm font-medium text-[#1a472a] group-hover:text-[#2d6a4f]">
                    {rq.question}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Pages */}
      {data.related_slugs && data.related_slugs.length > 0 && (
        <section className="py-12 md:py-16 bg-[#f8f9fa]">
          <div className="mx-auto max-w-[900px] px-5">
            <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-6">
              {t('exploreMore')}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {data.related_slugs.map((path) => {
                // Prefer the target page's own localized title; the
                // slug-derived title-case is an English-only last resort.
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
                    className="group flex items-center justify-between rounded-lg border bg-white p-4 transition-colors hover:border-[#2d6a4f] hover:bg-[#e8f5e9]"
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


const PRICING_HEADING_RE = /rates?|packages?|pricing|costs?|lesson/i

/**
 * A list item marker: a "- " bullet OR an "N. " ordinal.
 *
 * Ordered items are matched because the EN FAQ corpus writes ordered steps as
 * "1. ", "2. " … and, before this existed, such a block matched neither the
 * bullet branch nor the mixed branch below and fell all the way through to the
 * plain <p> renderer — where the single \n between items collapses in HTML and
 * the whole list ships as one run-on sentence. That was live on 36 blocks
 * across 15 EN entries, and identically on ja/ko/zh (31 blocks each), because
 * translators faithfully carry the source's numbering.
 *
 * The trailing \s+ is load-bearing: it stops a decimal from being read as an
 * ordinal, so a line opening "2.5 hours for a round" stays a paragraph.
 */
const LIST_ITEM_RE = /^\s*(?:-|\d+\.)\s+/
const isListItem = (line: string) => LIST_ITEM_RE.test(line)
const isOrdinalItem = (line: string) => /^\s*\d+\.\s+/.test(line)
/** Strip the leading "- " or "N. " so the item text can be rendered on its own. */
const stripListMarker = (item: string) => item.replace(LIST_ITEM_RE, '')

/** Parse "Label: Value" from a bullet item. Returns null if pattern not found. */
function parsePriceLine(item: string): { label: string; value: string } | null {
  // Use ": " (colon + space) to avoid splitting on times like "14:00"
  const colonIdx = item.indexOf(': ')
  if (colonIdx === -1) return null
  return {
    label: item.slice(0, colonIdx).trim(),
    value: item.slice(colonIdx + 2).trim(),
  }
}

/** Render a bullet list as a styled price table when all items are "Label: Value" pairs */
function renderPriceTable(items: string[], key: string | number) {
  const parsed = items.map((item) => parsePriceLine(stripListMarker(item)))
  const allParsed = parsed.every(Boolean)

  if (!allParsed) {
    // Fallback to standard list if not all items are key:value pairs
    return (
      <ul key={key} className="my-4 list-disc pl-6 space-y-2">
        {items.map((item, j) => (
          <li key={j} className="text-muted-foreground">
            <BoldText text={stripListMarker(item)} />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div key={key} className="my-4 overflow-hidden rounded-lg border border-[#2d6a4f]/20 bg-[#f0f7f2]">
      {(parsed as { label: string; value: string }[]).map((row, j) => (
        <div
          key={j}
          className={`flex items-center justify-between gap-4 px-4 py-3 ${
            j < parsed.length - 1 ? 'border-b border-[#2d6a4f]/10' : ''
          }`}
        >
          <span className="text-sm text-[#1a472a]">{row.label}</span>
          <span className="shrink-0 rounded-full bg-[#2d6a4f] px-3 py-0.5 text-sm font-semibold text-white">
            {row.value}
          </span>
        </div>
      ))}
    </div>
  )
}

/** Render a content paragraph, handling tables, bullet lists, and inline bold */
function renderParagraph(text: string, key: string | number, headingContext?: string) {
  const lines = text.split('\n')

  // Markdown pipe table (| Col | Col |\n|---|---|\n| ... |)
  if (isMarkdownTableBlock(lines)) {
    return <MarkdownTable key={key} lines={lines} />
  }

  // Check if it's a list (lines starting with "- " or "N. ")
  const isList = lines.every((line) => isListItem(line) || line.trim() === '')

  if (isList) {
    const items = lines.filter(isListItem)
    const isPricingContext = headingContext && PRICING_HEADING_RE.test(headingContext)

    if (isPricingContext) {
      return renderPriceTable(items, key)
    }

    // Ordered when the items are numbered — the source's numbering is
    // meaningful (ranked reasons, sequential steps), so it renders as <ol>
    // rather than being flattened into bullets.
    const ordered = items.length > 0 && isOrdinalItem(items[0])
    const ListTag = ordered ? 'ol' : 'ul'

    return (
      <ListTag
        key={key}
        className={`my-4 ${ordered ? 'list-decimal' : 'list-disc'} pl-6 space-y-2`}
      >
        {items.map((item, j) => (
          <li key={j} className="text-muted-foreground">
            <BoldText text={stripListMarker(item)} />
          </li>
        ))}
      </ListTag>
    )
  }

  // Handle mixed content: intro text followed by a bullet or numbered list
  const firstBulletIdx = lines.findIndex(isListItem)
  if (firstBulletIdx > 0) {
    const introLines = lines.slice(0, firstBulletIdx).filter((l) => l.trim() !== '')
    const bulletLines = lines.slice(firstBulletIdx).filter(isListItem)
    const orderedMixed = bulletLines.length > 0 && isOrdinalItem(bulletLines[0])
    const MixedListTag = orderedMixed ? 'ol' : 'ul'
    const isPricingContext = headingContext && PRICING_HEADING_RE.test(headingContext)

    return (
      <div key={key}>
        <p className="my-4 text-muted-foreground leading-relaxed">
          <BoldText text={introLines.join(' ')} />
        </p>
        {isPricingContext ? (
          renderPriceTable(bulletLines, `${key}-table`)
        ) : (
          <MixedListTag
            className={`my-4 ${orderedMixed ? 'list-decimal' : 'list-disc'} pl-6 space-y-2`}
          >
            {bulletLines.map((item, j) => (
              <li key={j} className="text-muted-foreground">
                <BoldText text={stripListMarker(item)} />
              </li>
            ))}
          </MixedListTag>
        )}
        {/* Render any trailing text after the list */}
        {lines.slice(firstBulletIdx).some((l) => l.trim() !== '' && !isListItem(l)) && (
          <p className="my-4 text-muted-foreground leading-relaxed">
            <BoldText
              text={lines
                .slice(firstBulletIdx)
                .filter((l) => l.trim() !== '' && !isListItem(l))
                .join(' ')}
            />
          </p>
        )}
      </div>
    )
  }

  return (
    <p key={key} className="my-4 text-muted-foreground leading-relaxed">
      <BoldText text={text} />
    </p>
  )
}
