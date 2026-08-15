import { NextResponse } from 'next/server'
import { SITE_URL, BUSINESS_INFO, SOCIAL_LINKS, BOOKING_URL } from '@/lib/constants'
import { getAllPosts } from '@/lib/blog'
import { getSeoPagesByType } from '@/lib/seo-pages'
import { getFactTokens, interpolateFacts } from '@/lib/site-facts'
import { ALL_LOCALES, getRegisteredRegionHubPaths, type Locale } from '@/lib/translated-routes'
import { getRegionHubTranslation } from '@/data/golf-courses-i18n'
import type { SeoPageType } from '@/types/seo-pages'

/**
 * /llms.txt — a curated, markdown-formatted map of the site for AI assistants and
 * agentic tools (Cursor, Claude Code, etc.) that read it when a user references the
 * domain. Generated from the same data the site renders, so it stays in sync.
 * Regenerated daily via ISR; the long tail of URLs lives in /sitemap.xml.
 */
export const revalidate = 86400

// Human-readable label for each non-EN locale, used in section headings and
// the Languages blurb. EN has no entry — it isn't locale-prefixed.
const LOCALE_LABELS: Record<Exclude<Locale, 'en'>, string> = {
  th: 'ภาษาไทย',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
}

const NON_EN_LOCALES = ALL_LOCALES.filter(
  (l): l is Exclude<Locale, 'en'> => l !== 'en'
)

/**
 * SEO page types that get a per-locale listing section below (title + URL
 * only — see the curation note by LOCALE_PAGE_TYPES' usage). Add an entry
 * here to extend the locale loop to a new page type; each becomes
 * "## <label> (<LOCALE_LABELS[locale]>)" once that locale has published pages.
 *
 * Before adding a future page type here, confirm its published locale entries
 * in the data file are ALSO registered as '/<prefix>/<slug>' paths in that
 * locale's staticRoutes (lib/translated-routes.ts). Otherwise the middleware
 * 301s every emitted /<locale>/<prefix>/<slug>/ URL to English, and this file
 * would advertise "translated" links that redirect away. (Guides and FAQ are
 * both safe: smoke section I enforces registry ⇄ data sync for each.)
 */
const LOCALE_PAGE_TYPES: { type: SeoPageType; label: string; urlPrefix: string }[] = [
  { type: 'explainer', label: 'Guides', urlPrefix: 'guide' },
  { type: 'faq', label: 'FAQ', urlPrefix: 'faq' },
]

const KEY_PAGES: { title: string; path: string; desc: string }[] = [
  { title: 'Bay Rates & Simulators', path: '/golf/', desc: 'Indoor golf simulator bay rates, monthly packages, and how booking works.' },
  { title: 'Golf Lessons', path: '/lessons/', desc: 'One-on-one coaching with PGA-certified pros on the simulators.' },
  { title: 'Private Events & Parties', path: '/events/', desc: 'Corporate team-building, birthdays, and private parties with bays, bar, and catering.' },
  { title: 'Food & Drinks Menu', path: '/menu/', desc: 'Full menu with THB prices: Smith & Co burgers, Sexy Pizza, cocktails, beer, wine, and unlimited soft drinks.' },
  { title: 'Golf Club Rental', path: '/golf-club-rental/', desc: 'Free house sets plus premium Callaway rentals at the venue.' },
  { title: 'Golf Course Club Rental', path: '/golf-course-club-rental/', desc: 'Rent premium clubs for any Bangkok golf course, with delivery.' },
  { title: 'Rental Club Specifications', path: '/golf-club-specs/', desc: 'Club-by-club specs for every rental set: lofts, shaft models, shaft weight and flex for the Callaway Paradym (steel and graphite bags), Warbird and REVA, plus the left-handed set, with photos of the real bags.' },
  { title: 'About LENGOLF', path: '/about-us/', desc: 'About the venue, location, and contact details.' },
  { title: 'FAQ', path: '/faq/', desc: 'Quick answers: bay prices, lessons, free club rental, walk-ins, group events, food and drink, opening hours, and step-by-step directions from BTS Chidlom.' },
  { title: 'Golf Courses in Thailand', path: '/golf-courses/', desc: 'Directory of Thai golf courses by region with green fees and course guides.' },
  { title: 'Second-Hand Golf Clubs', path: '/second-hand-golf-clubs-bangkok/', desc: 'Used Callaway and TaylorMade clubs for sale, testable in our simulators.' },
]

function link(title: string, url: string, desc?: string): string {
  return desc ? `- [${title}](${url}): ${desc}` : `- [${title}](${url})`
}

export async function GET() {
  const [posts, faqs, guides, tokens] = await Promise.all([
    getAllPosts(),
    getSeoPagesByType('faq'),
    getSeoPagesByType('explainer'),
    // Guide titles/metas may carry {{price}} tokens (lib/site-facts.ts) — the
    // guide page route interpolates them, and so must every other surface that
    // prints entry text, or the literal placeholder leaks (this file is EN).
    getFactTokens('en'),
  ])

  const sections: string[] = []

  sections.push('# LENGOLF — Indoor Golf Simulator & Bar in Bangkok')
  sections.push(
    `> LENGOLF is an indoor golf simulator venue and bar at ${BUSINESS_INFO.address}. ` +
      `Open ${BUSINESS_INFO.hours}. Phone ${BUSINESS_INFO.phone}. Book a bay at ${BOOKING_URL}. ` +
      'This file points AI assistants to the most useful pages on len.golf; the full URL list is in /sitemap.xml.'
  )

  sections.push(
    `## Key pages\n${KEY_PAGES.map((p) => link(p.title, `${SITE_URL}${p.path}`, p.desc)).join('\n')}`
  )

  // Language list is generated from LOCALE_LABELS so a new locale added to
  // ALL_LOCALES (which forces a LOCALE_LABELS entry via the Record type)
  // automatically appears here too.
  const localeList = NON_EN_LOCALES.map((l) => `${LOCALE_LABELS[l]} (/${l}/)`).join(', ')
  sections.push(
    `## Languages / ${NON_EN_LOCALES.map((l) => LOCALE_LABELS[l]).join(' / ')}\n` +
      `LENGOLF content is published in English (default, unprefixed) and: ${localeList}. ` +
      `Translated pages use a locale-prefixed URL: ${SITE_URL}/<locale>/<path>/ — ` +
      `e.g. ${SITE_URL}/ja/guide/screen-golf-bangkok/. ` +
      'Not every English page has a translation in every locale yet; the complete, hreflang-tagged ' +
      `URL list is in ${SITE_URL}/sitemap.xml.`
  )

  if (faqs.length) {
    // interpolateFacts is a no-op while FAQ entries carry no {{tokens}}, but
    // wrapping now keeps EN symmetric with the locale sections below — if a
    // token ever lands in FAQ copy, it resolves here instead of leaking.
    sections.push(
      `## FAQ\n${faqs.map((p) => link(interpolateFacts(p.title, tokens), `${SITE_URL}/faq/${p.slug}/`, p.meta_description ? interpolateFacts(p.meta_description, tokens) : undefined)).join('\n')}`
    )
  }

  if (guides.length) {
    sections.push(
      `## Guides\n${guides.map((p) => link(interpolateFacts(p.title, tokens), `${SITE_URL}/guide/${p.slug}/`, p.meta_description ? interpolateFacts(p.meta_description, tokens) : undefined)).join('\n')}`
    )
  }

  // Per-locale listings for translated SEO page types (see LOCALE_PAGE_TYPES).
  // Curation choice: title + URL only, no meta descriptions — with ~4 locales
  // × up to ~46 guides each, descriptions would roughly 3x this file's size for
  // a map that's meant to stay skimmable. Fact tokens are interpolated with
  // that locale's tokens (getFactTokens(locale)) so no literal "{{" leaks.
  for (const { type, label, urlPrefix } of LOCALE_PAGE_TYPES) {
    for (const locale of NON_EN_LOCALES) {
      const [localePages, localeTokens] = await Promise.all([
        getSeoPagesByType(type, locale),
        getFactTokens(locale),
      ])
      if (!localePages.length) continue
      sections.push(
        `## ${label} (${LOCALE_LABELS[locale]})\n${localePages
          .map((p) =>
            link(
              interpolateFacts(p.title, localeTokens),
              `${SITE_URL}/${locale}/${urlPrefix}/${p.slug}/`
            )
          )
          .join('\n')}`
      )
    }
  }

  // Per-locale region-hub listings (app/[locale]/golf-courses/[region]/page.tsx).
  // Hubs are a distinct mechanism from LOCALE_PAGE_TYPES above: they aren't a
  // SeoPageType / getSeoPagesByType entry, and their localized label comes
  // from getRegionHubTranslation (data/golf-courses-i18n.ts), not fact tokens
  // — hub labels carry no {{tokens}}. getRegisteredRegionHubPaths(locale)
  // (lib/translated-routes.ts) is the source of truth for which regions are
  // actually translation-registered for that locale, so this reflects
  // whatever's registered at build time regardless of when new hubs land.
  for (const locale of NON_EN_LOCALES) {
    const hubPaths = getRegisteredRegionHubPaths(locale)
    if (!hubPaths.length) continue
    sections.push(
      `## Golf Course Regions (${LOCALE_LABELS[locale]})\n${hubPaths
        .map((path) => {
          const region = path.split('/')[2]
          const translation = getRegionHubTranslation(region, locale)
          return link(translation?.label ?? region, `${SITE_URL}/${locale}${path}/`)
        })
        .join('\n')}`
    )
  }

  if (posts.length) {
    const recent = posts.slice(0, 20)
    sections.push(
      `## Blog\n${recent.map((p) => link(p.title, `${SITE_URL}/blog/${p.slug}/`, p.excerpt || undefined)).join('\n')}`
    )
  }

  sections.push(
    '## Contact\n' +
      `- Address: ${BUSINESS_INFO.address}\n` +
      `- Phone: ${BUSINESS_INFO.phone}\n` +
      `- Email: ${BUSINESS_INFO.email}\n` +
      `- Hours: ${BUSINESS_INFO.hours}\n` +
      `- LINE: ${SOCIAL_LINKS.line}\n` +
      `- Book a bay: ${BOOKING_URL}\n` +
      `- Full URL list: ${SITE_URL}/sitemap.xml`
  )

  const body = sections.join('\n\n') + '\n'

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
