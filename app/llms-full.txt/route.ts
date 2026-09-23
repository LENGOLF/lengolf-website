import { NextResponse } from 'next/server'
import { SITE_URL, BUSINESS_INFO, SOCIAL_LINKS, BOOKING_URL, PHONE_E164 } from '@/lib/constants'
import { getSeoPagesByType } from '@/lib/seo-pages'
import { getSiteFacts } from '@/lib/site-facts'
import { getPricingCatalog } from '@/lib/pricing'
import { isFaqPage } from '@/types/seo-pages'
import { getFaqHubContent } from '@/data/faq-hub'
import {
  getBayRatesData,
  getEventPackagesData,
  getLessonPricingData,
  getMonthlyPackagesData,
} from '@/data/pricing'

/**
 * /llms-full.txt — the long-form companion to /llms.txt. Where llms.txt is a
 * curated MAP (titles and URLs), this file carries the ANSWERS: the venue
 * facts, every price table, the directions, and the full text of every
 * English FAQ page, so an AI assistant can answer from one fetch instead of
 * crawling ~30 pages. Generated from the same data the site renders, so it
 * cannot drift from it.
 *
 * Scope is deliberately EN-only and FAQ-shaped. Guides are left out: their
 * bodies carry {{fact}} tokens (lib/site-facts.ts) and are long-form articles,
 * not answers, and the translated corpora would multiply the size ~5x.
 *
 * Reads the POS pricing catalog through the data/pricing.ts getters, so it is
 * pinned in scripts/validate-pricing-revalidate.ts and MUST keep a numeric
 * `revalidate` — without one it inherits the catalog fetch's 30-day interval.
 *
 * Machine-readable contact surface, like llms.txt: the phone is E.164 only
 * (PHONE_E164), and smoke section H fails if the Thai local format appears
 * anywhere in the body, including inside FAQ prose printed here.
 */
export const revalidate = 86400

function table(headers: string[], rows: string[][]): string {
  const line = (cells: string[]) => `| ${cells.join(' | ')} |`
  return [line(headers), line(headers.map(() => '---')), ...rows.map(line)].join('\n')
}

// The data files use '-' / '—' as "not applicable" placeholders for the
// visual tables. Spelled out here so a reader parsing the table does not
// mistake a dash for a price or a range.
function cell(value: string, empty = 'n/a'): string {
  const v = value.trim()
  return v === '' || v === '-' || v === '—' ? empty : v
}

export async function GET() {
  // ONE catalog read, passed to every consumer. Do not rely on React cache()
  // to dedupe this: it only memoises inside a server-component render, which
  // a Route Handler is not, and Next's fetch dedupe skips requests carrying a
  // signal (getPricingCatalog sets a timeout signal). Five independent calls
  // could mix live and fallback prices in one file, and `fetchedAt` would then
  // date only one of them. Passing the same object makes the "Prices as of"
  // line date exactly the read behind the tables (not the hand-written prices
  // inside FAQ prose, nor columns the catalog does not carry, e.g. lesson
  // "3 to 5 golfers"). A null catalog makes each getter fall back (they
  // re-try the fetch once), and `fetchedAt` then prints "unavailable".
  const catalog = await getPricingCatalog()
  const [facts, bay, monthly, lessons, events, faqPages] = await Promise.all([
    getSiteFacts(catalog),
    getBayRatesData(catalog),
    getMonthlyPackagesData(catalog),
    getLessonPricingData(catalog),
    getEventPackagesData(catalog),
    getSeoPagesByType('faq'),
  ])
  const hub = getFaqHubContent('en')

  const sections: string[] = []

  sections.push('# LENGOLF: Indoor Golf Simulator & Bar in Bangkok (full reference)')
  sections.push(`> ${hub.entityStatement}`)
  sections.push(
    `This is the long-form companion to ${SITE_URL}/llms.txt: the facts, prices and answers ` +
      'published on len.golf, in one plain-text file generated from the same data the site renders. ' +
      'Prices in the tables are read from the venue\'s POS catalog where it lists them, and the "Prices as of" line in the Contact section dates that read; prices quoted inside the FAQ answers are written by hand and may lag it.'
  )

  sections.push(
    '## Venue facts\n' +
      `- Address: ${BUSINESS_INFO.address}\n` +
      `- Hours: ${BUSINESS_INFO.hours}\n` +
      `- Phone: ${PHONE_E164}\n` +
      `- Book a bay: ${BOOKING_URL}\n` +
      `- LINE: ${SOCIAL_LINKS.line}`
  )

  sections.push(
    '## Simulator bay rates (per bay, per hour)\n' +
      table(
        ['Time', 'Weekday', 'Weekend'],
        bay.bayRates.map((r) => [r.timeSlot, r.weekday, r.weekend])
      ) +
      '\n\n' +
      bay.bayRateNotes.map((n) => `- ${n}`).join('\n')
  )

  sections.push(
    '## Monthly bay packages\n' +
      table(
        ['Package', 'Hours', 'Validity', 'Perks', 'Price'],
        monthly.monthlyPackages.map((p) => [p.name, p.hours, p.validity, cell(p.perks, 'none'), p.price])
      ) +
      '\n\n' +
      monthly.monthlyPackageNotes.map((n) => `- ${n}`).join('\n')
  )

  sections.push(
    '## Golf lesson packages (price per package)\n' +
      table(
        ['Package', '1 golfer', '2 golfers', '3 to 5 golfers', 'Notes'],
        lessons.lessonPricing.map((p) => [
          p.name,
          cell(p.oneGolfer),
          cell(p.twoGolfers),
          cell(p.threeToFiveGolfers),
          cell(p.remark, ''),
        ])
      ) +
      '\n\n' +
      lessons.lessonNotes.map((n) => `- ${n}`).join('\n')
  )

  sections.push(
    '## Event and party packages\n' +
      table(
        ['Package', 'Guests', 'Bays', 'Duration', 'Drinks', 'Food', 'Price'],
        events.eventPackages.map((p) => [
          p.exclusive ? `${p.name} (exclusive venue)` : p.name,
          p.guests,
          p.bays,
          p.duration,
          `${p.beers}, ${p.cocktails}, ${p.softDrinks}`,
          `${p.food.join(', ')} (${p.caterer})`,
          p.price,
        ])
      ) +
      '\n\n' +
      events.eventPackageNotes.map((n) => `- ${n}`).join('\n')
  )

  sections.push(
    `## ${hub.directions.title} ${hub.directions.titleSuffix}\n` +
      `${hub.directions.intro}\n\n` +
      hub.directions.steps.map((s, i) => `${i + 1}. ${s}`).join('\n') +
      `\n\n- ${hub.directions.grabTip}\n- ${hub.directions.parkingTip}`
  )

  sections.push(
    '## Quick answers\n' + hub.quickFaqs.map((q) => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n')
  )

  // One block per English FAQ page. The `Source:` line is the per-entry
  // marker smoke section H counts against the published EN FAQ corpus, so
  // keep it exactly one per entry and nowhere else in this file.
  const faqs = faqPages.filter(isFaqPage)
  if (faqs.length) {
    sections.push(
      '## FAQ pages\n' +
        faqs
          .map(
            (p) =>
              `### ${p.title}\nSource: ${SITE_URL}/faq/${p.slug}/\n\n` +
              `${p.content.answer_intro}\n\n${p.content.answer_body}`
          )
          .join('\n\n')
    )
  }

  sections.push(
    '## Contact\n' +
      `- Address: ${BUSINESS_INFO.address}\n` +
      `- Phone: ${PHONE_E164}\n` +
      `- Email: ${BUSINESS_INFO.email}\n` +
      `- Hours: ${BUSINESS_INFO.hours}\n` +
      `- LINE: ${SOCIAL_LINKS.line}\n` +
      `- Book a bay: ${BOOKING_URL}\n` +
      `- Site map for AI assistants: ${SITE_URL}/llms.txt\n` +
      `- Full URL list: ${SITE_URL}/sitemap.xml\n` +
      // Same honesty rule as llms.txt: null means the catalog was unavailable
      // and the pinned fallback figures rendered, so say so instead of dating.
      `- Prices as of: ${facts.fetchedAt ?? 'unavailable (published fallback rates shown)'}`
  )

  const body = sections.join('\n\n') + '\n'

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
