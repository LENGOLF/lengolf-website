#!/usr/bin/env tsx

/**
 * Hotel-concierge data validator (data/hotel-pages.ts).
 *
 * Sibling of validate-courses.ts. These pages tell a guest how far LENGOLF is
 * and how to walk there, so a wrong number is not cosmetic — someone follows
 * it on foot in 35°C heat.
 *
 * Root cause it guards against: the SAME distance is stated in two places.
 * `hotel_distance_m` drives the hero badge, the "How far is LENGOLF" band and
 * the closing CTA, while the "LENGOLF Indoor Golf" row of `nearby_activities`
 * renders its own `distance_m` in the card grid. Nothing tied them together,
 * and they disagreed on 9 of 12 entries — up to 2100m vs 1000m — so one page
 * printed two different distances to the same venue. On the InterContinental
 * entry the gap was 150m vs 600m and came with a "2 minutes / essentially
 * across the street" claim, against 450m/6min for two hotels on the same
 * junction.
 *
 * The two figures are the same quantity by definition. They are not
 * straight-line vs walking distance: across the section the card was LARGER
 * than the field on 4 entries and smaller on 3, so there is no consistent
 * relationship to preserve.
 *
 * Exit code 1 on any error so CI fails.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { hotelConciergePages } from '@/data/hotel-pages'

// A brisk walk is ~80 m/min; the section's own entries sit at 64–83. This
// band is deliberately wide — it exists to catch a transposed digit or a
// figure copied from the wrong row, not to police rounding.
const MIN_PACE = 40
const MAX_PACE = 120

const errors: string[] = []
const warnings: string[] = []

// EN is the source of truth for every typed field; a translation may not
// change a number. (verify-hotels asserted this pre-merge; this keeps it true
// afterwards, when edits land directly in the data file.)
const enBySlug = new Map(
  hotelConciergePages.filter((p) => p.locale === 'en').map((p) => [p.slug, p])
)

for (const page of hotelConciergePages) {
  const c = page.content
  const tag = `${page.slug} [${page.locale}]`

  if (!(c.hotel_distance_m > 0)) {
    errors.push(`${tag}: hotel_distance_m is ${c.hotel_distance_m}`)
  }
  if (!(c.walking_time_mins > 0)) {
    errors.push(`${tag}: walking_time_mins is ${c.walking_time_mins}`)
  }

  if (c.hotel_distance_m > 0 && c.walking_time_mins > 0) {
    const pace = c.hotel_distance_m / c.walking_time_mins
    if (pace < MIN_PACE || pace > MAX_PACE) {
      errors.push(
        `${tag}: implausible walking pace ${Math.round(pace)} m/min ` +
          `(${c.hotel_distance_m}m in ${c.walking_time_mins} min) — expected ${MIN_PACE}–${MAX_PACE}`
      )
    }
  }

  const lengolfCard = c.nearby_activities.find((a) => /lengolf/i.test(a.name))
  if (lengolfCard && lengolfCard.distance_m !== c.hotel_distance_m) {
    errors.push(
      `${tag}: nearby_activities LENGOLF card says ${lengolfCard.distance_m}m but ` +
        `hotel_distance_m is ${c.hotel_distance_m}m — same quantity, two answers on one page`
    )
  }

  if (c.hotel_star_rating < 1 || c.hotel_star_rating > 5) {
    warnings.push(`${tag}: hotel_star_rating ${c.hotel_star_rating} outside 1–5`)
  }

  if (page.locale !== 'en') {
    const en = enBySlug.get(page.slug)
    if (!en) {
      errors.push(`${tag}: no EN entry to check typed fields against`)
    } else {
      const e = en.content
      for (const f of ['hotel_distance_m', 'walking_time_mins', 'hotel_star_rating'] as const) {
        if (c[f] !== e[f]) {
          errors.push(`${tag}: ${f} is ${c[f]} but EN says ${e[f]} — numbers are locale-invariant`)
        }
      }
      if (c.hotel_name !== e.hotel_name) {
        errors.push(
          `${tag}: hotel_name '${c.hotel_name}' != EN '${e.hotel_name}' — the guest booked under the EN name`
        )
      }
    }
  }
}

// Every nearby_activities[].type is rendered through
// HotelConciergePage.activityType.<token>. The component falls back to the raw
// token when the catalog does not know it, which keeps the page from throwing
// but puts an English category word ("cultural") back on a localized page. So
// the fallback must never actually be reachable: assert every token in the data
// has a message in EVERY catalog. (validate:i18n enforces cross-locale key
// parity; this is the data -> catalog direction, which nothing else covers.)
const LOCALES = ['en', 'th', 'ja', 'ko', 'zh']
const dataTokens = new Set<string>()
for (const page of hotelConciergePages) {
  for (const a of page.content.nearby_activities) dataTokens.add(a.type)
}
for (const loc of LOCALES) {
  let catalog: Record<string, unknown>
  try {
    const raw = readFileSync(join(process.cwd(), `messages/${loc}.json`), 'utf8')
    const parsed = JSON.parse(raw) as Record<string, Record<string, unknown>>
    catalog = (parsed.HotelConciergePage?.activityType ?? {}) as Record<string, unknown>
  } catch {
    errors.push(`messages/${loc}.json: unreadable while checking activityType`)
    continue
  }
  for (const token of [...dataTokens].sort()) {
    if (typeof catalog[token] !== 'string') {
      errors.push(
        `messages/${loc}.json: HotelConciergePage.activityType.${token} missing — ` +
          `nearby_activities uses that type, so the card would render the raw English token`
      )
    }
  }
}

for (const w of warnings) console.warn(`  ⚠ ${w}`)

if (errors.length === 0) {
  console.log(
    `✅ validate-hotels: ${hotelConciergePages.length} entries pass distance/pace/consistency checks` +
      (warnings.length ? ` (${warnings.length} non-blocking warning(s))` : '')
  )
  process.exit(0)
}

console.error(`❌ validate-hotels: ${errors.length} error(s):\n`)
for (const e of errors) console.error(`  • ${e}`)
console.error(
  '\nFix: make the two figures agree, or correct whichever is wrong at source.' +
    ' hotel_distance_m is the one the hero, the walkability band and the CTA render,' +
    ' and it is corroborated by walking_time_mins.'
)
process.exit(1)
