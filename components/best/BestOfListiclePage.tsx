import { Link } from '@/i18n/navigation'
import { ArrowRight, Check, ExternalLink, MapPin, ThumbsDown, ThumbsUp, Trophy } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { buildRelatedLabels } from '@/lib/seo-links'
import { getSiteFacts } from '@/lib/site-facts'
import { BOOKING_URL, BUSINESS_INFO, SOCIAL_LINKS } from '@/lib/constants'
import type { BestOfListicleSeoPage } from '@/types/seo-pages'

interface Props {
  data: BestOfListicleSeoPage
}

// The card sub-components below render chrome too (the badge, the pros/cons
// labels, the per-card CTA). They take the translator as a prop rather than
// awaiting getTranslations themselves — one await per page, and the sub-trees
// stay plain sync functions.
type ListicleTranslator = Awaited<ReturnType<typeof getTranslations<'BestOfListiclePage'>>>

export default async function BestOfListiclePage({ data }: Props) {
  const { content } = data

  const [t, tContact, facts, relatedLabels] = await Promise.all([
    getTranslations('BestOfListiclePage'),
    getTranslations('ContactInfo'),
    getSiteFacts(),
    buildRelatedLabels(data.related_slugs, data.locale),
  ])

  return (
    <div className="best-of-listicle-page">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#1a472a] to-[#2d6a4f] py-16 md:py-24 text-white">
        <div className="mx-auto max-w-[900px] px-5">
          <p className="text-sm font-medium uppercase tracking-wider text-[#d4a843] mb-3">
            {/* Stringified deliberately. A BARE {year} placeholder is a string
                argument in ICU and prints 2026 unformatted, so this is not
                load-bearing today — but the moment anyone writes
                {year, number} in a catalog it becomes "2,026" in all five
                locales. Passing a string makes that edit inert. */}
            {t('eyebrow', { year: String(content.year) })}
          </p>
          <h1 className="text-3xl font-bold md:text-5xl mb-6">{data.title}</h1>
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

      {/* ── Intro ────────────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[900px] px-5">
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            {content.intro}
          </p>
        </div>
      </section>

      {/* ── Ranked List ──────────────────────────────────────────────────── */}
      <section className="pb-12 md:pb-16">
        <div className="mx-auto max-w-[900px] px-5">
          <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-8">
            {t('rankedHeading')}
          </h2>

          <div className="space-y-6">
            {content.list_items.map((item) =>
              item.is_lengolf ? (
                <LengolfCard key={item.rank} item={item} t={t} />
              ) : (
                <CompetitorCard key={item.rank} item={item} t={t} />
              )
            )}
          </div>
        </div>
      </section>

      {/* ── Verdict ──────────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-[#f8f9fa]">
        <div className="mx-auto max-w-[900px] px-5">
          <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-4">
            {t('verdictHeading')}
          </h2>
          <div className="rounded-xl border bg-white p-6 md:p-8">
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              {content.conclusion}
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-[#1a472a] to-[#2d6a4f] text-white text-center">
        <div className="mx-auto max-w-[900px] px-5">
          <h2 className="text-2xl font-bold md:text-3xl mb-4">{t('ctaTitle')}</h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            {t('ctaText', {
              // Same substitution as components/faq/FaqPage.tsx,
              // components/activities/ActivityPage.tsx and
              // components/prices/PriceGuidePage.tsx: BUSINESS_INFO.addressShort
              // and BUSINESS_INFO.hours are English-only constants that would
              // strand an English fragment inside an otherwise translated
              // sentence. ContactInfo.address is the localized address and
              // facts.openingHours ("09:00–23:00") is locale-neutral.
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

      {/* ── Related Links ────────────────────────────────────────────────── */}
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
                    href={path as Parameters<typeof Link>[0]['href']}
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

// ── Sub-components ──────────────────────────────────────────────────────────

type ListItem = BestOfListicleSeoPage['content']['list_items'][number]

function LengolfCard({ item, t }: { item: ListItem; t: ListicleTranslator }) {
  return (
    <div className="relative rounded-xl border-2 border-[#2d6a4f] bg-white p-6 shadow-md">
      {/* Editor's Pick badge */}
      <div className="absolute -top-3 left-6 flex items-center gap-1.5 rounded-full bg-[#d4a843] px-3 py-1 text-xs font-bold text-white shadow">
        <Trophy className="h-3 w-3" />
        {t('editorsPick')}
      </div>

      <div className="flex items-start gap-4 mt-2">
        <RankBadge rank={item.rank} highlighted t={t} />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h3 className="text-lg font-bold text-[#1a472a]">{item.name}</h3>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground mb-4">
            {item.description}
          </p>

          <ProsConsGrid pros={item.pros} cons={item.cons} t={t} />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border mt-4">
            {item.address && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-[#d4a843]" />
                <span>{item.address}</span>
              </div>
            )}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#d4a843] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c49a3a]"
            >
              {t('bookABay')}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function CompetitorCard({ item, t }: { item: ListItem; t: ListicleTranslator }) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex items-start gap-4">
        <RankBadge rank={item.rank} highlighted={false} t={t} />

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-[#1a472a] mb-3">{item.name}</h3>

          <p className="text-sm leading-relaxed text-muted-foreground mb-4">
            {item.description}
          </p>

          <ProsConsGrid pros={item.pros} cons={item.cons} t={t} />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border mt-4">
            {item.address && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                <span>{item.address}</span>
              </div>
            )}
            {item.website && (
              <a
                href={item.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[#2d6a4f] hover:underline"
              >
                {t('visitWebsite')} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function RankBadge({
  rank,
  highlighted,
  t,
}: {
  rank: number
  highlighted: boolean
  t: ListicleTranslator
}) {
  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-sm ${
        highlighted
          ? 'bg-[#1a472a] text-white'
          : 'bg-gray-100 text-gray-600'
      }`}
    >
      {/* '#N' is an English ordinal convention, not a bare numeral — ja/ko/zh
          write the rank with their own ordinal marker (1位 / 1위 / 第1名), so
          the whole badge is a message rather than a hardcoded '#' + number. */}
      {t('rankBadge', { rank })}
    </div>
  )
}

function ProsConsGrid({
  pros,
  cons,
  t,
}: {
  pros: string[]
  cons: string[]
  t: ListicleTranslator
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <p className="text-xs font-semibold text-[#2d6a4f] flex items-center gap-1 mb-2">
          <ThumbsUp className="h-3.5 w-3.5" /> {t('pros')}
        </p>
        <ul className="space-y-1.5">
          {pros.map((pro) => (
            <li key={pro} className="flex items-start gap-2 text-sm text-[#2d6a4f]">
              <Check className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>{pro}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 flex items-center gap-1 mb-2">
          <ThumbsDown className="h-3.5 w-3.5" /> {t('cons')}
        </p>
        <ul className="space-y-1.5">
          {cons.map((con) => (
            <li key={con} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-300 shrink-0" />
              <span>{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
