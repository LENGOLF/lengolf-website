import type { GolfCourse } from '@/types/golf-courses'
import { pricesByDayOfWeek, feeLabelsEn } from '@/lib/course-fees'

/**
 * Use-case taxonomy for /golf-courses/best-for/[use-case]/ pages.
 *
 * Per-decision (workstream A): tags live in this derivation file and are
 * NOT added as fields on the GolfCourse type. This keeps the 148 course
 * data files untouched and makes use-case rules easy to revise.
 *
 * Each rule is deterministic and reads only from existing GolfCourse fields
 * — no LLM inference, no manual lists.
 */

export const USE_CASES = [
  'beginners',
  'weekday-play',
  'tournaments',
  'groups',
  'families',
  'high-handicappers',
] as const
export type UseCase = (typeof USE_CASES)[number]

export interface UseCaseMeta {
  slug: UseCase
  /** H1 + page title prefix. */
  title: string
  /** 1–2 sentences shown as the page intro. */
  framing: string
  /** Predicate — returns true if the course matches the use-case. */
  predicate: (c: GolfCourse) => boolean
  /** 1-line "why this course fits" line, composed from course fields. */
  reasonFor: (c: GolfCourse) => string
  /** Cross-link CTA for the bottom of the page. */
  crossLink: { href: string; label: string }
}

export const USE_CASE_RULES: Record<UseCase, UseCaseMeta> = {
  beginners: {
    slug: 'beginners',
    title: 'Best Bangkok-Area Golf Courses for Beginners',
    framing:
      'Beginner-friendly Thai courses share three things: an on-site driving range to warm up, a green fee that doesn’t make a bad first round expensive, and forgiving fairways that don’t punish a thin shot with a lost ball. These are our picks within 90 minutes of Bangkok.', // fee-noun-ok: generic page framing about what to look for, not a label on any one course's rate
    predicate: (c) =>
      c.driving_range === true &&
      c.green_fee_weekday_thb !== null &&
      c.green_fee_weekday_thb <= 3500,
    reasonFor: (c) => {
      const parts: string[] = []
      if (c.driving_range) parts.push('on-site driving range')
      if (c.green_fee_weekday_thb)
        parts.push(
          `${feeLabelsEn(c).lower.toLowerCase()} from ${c.green_fee_weekday_thb.toLocaleString('en-US')} THB`
        )
      if (c.par <= 71) parts.push(`par ${c.par}`)
      return parts.join(' · ')
    },
    crossLink: { href: '/lessons', label: 'Take a beginner-friendly lesson at LENGOLF' },
  },
  'weekday-play': {
    slug: 'weekday-play',
    title: 'Best Bangkok-Area Golf Courses for Weekday Play',
    framing:
      'These courses charge a meaningfully lower fee Mon–Fri than they do at the weekend — a structural pricing difference that rewards visitors with flexible itineraries. All entries below have at least a 500 THB weekday discount versus weekend rates.',
    // A seasonally-priced course has no weekday/weekend split at all — its two
    // fees are low/high season — so it cannot qualify for "weekday play" however
    // large the gap between them. Without this guard phuket-country-club listed
    // here with "Weekday 2,800 vs weekend 4,000 THB", a day-of-week claim it
    // does not make, on a statically generated indexed page.
    predicate: (c) =>
      pricesByDayOfWeek(c) &&
      c.green_fee_weekday_thb !== null &&
      c.green_fee_weekend_thb !== null &&
      c.green_fee_weekend_thb - c.green_fee_weekday_thb >= 500,
    reasonFor: (c) => {
      const w = c.green_fee_weekday_thb!.toLocaleString('en-US')
      const e = c.green_fee_weekend_thb!.toLocaleString('en-US')
      const save = (c.green_fee_weekend_thb! - c.green_fee_weekday_thb!).toLocaleString('en-US')
      return `Weekday ${w} vs weekend ${e} THB — saves ${save} THB`
    },
    crossLink: { href: '/golf-course-club-rental', label: 'Add LENGOLF club rental' },
  },
  tournaments: {
    slug: 'tournaments',
    title: 'Best Bangkok-Area Tournament & Championship Golf Courses',
    framing:
      'Designer-name layouts that have hosted Asian Tour, Thailand Open, or championship-level events — the Thai courses you’ll recognise from the broadcast. These rounds are not cheap, but for a once-a-trip splurge they deliver exactly what you came for.',
    predicate: (c) =>
      c.designer !== null &&
      c.green_fee_weekday_thb !== null &&
      c.green_fee_weekday_thb >= 4000,
    reasonFor: (c) => {
      const parts: string[] = []
      if (c.designer) parts.push(`Designed by ${c.designer}`)
      if (c.year_opened) parts.push(`est. ${c.year_opened}`)
      if (c.green_fee_weekday_thb)
        parts.push(`from ${c.green_fee_weekday_thb.toLocaleString('en-US')} THB`)
      return parts.join(' · ')
    },
    crossLink: { href: '/events', label: 'Plan a corporate / tournament event with LENGOLF' },
  },
  groups: {
    slug: 'groups',
    title: 'Best Bangkok-Area Golf Courses for Groups',
    framing:
      'Group golf in Thailand needs three things: a course willing to hold a 12+ player block, a driving range so the group can warm up together, and full 18 holes (groups don’t do executive layouts). These courses fit all three.',
    predicate: (c) => c.driving_range === true && c.holes >= 18,
    reasonFor: (c) => {
      const parts: string[] = [`${c.holes}-hole`, 'driving range on site']
      if (!c.cart_required) parts.push('walking permitted')
      return parts.join(' · ')
    },
    crossLink: { href: '/events', label: 'Run a group / corporate event at LENGOLF' },
  },
  families: {
    slug: 'families',
    title: 'Best Bangkok-Area Golf Courses for Families',
    framing:
      'Family-friendly Thai courses are the ones where carts aren’t mandatory (so a non-golfing partner or older child can walk along), the green fee doesn’t cross into trophy-course territory, and the layout is approachable enough for occasional golfers.', // fee-noun-ok: generic page framing about what to look for, not a label on any one course's rate
    predicate: (c) =>
      c.cart_required === false &&
      c.green_fee_weekday_thb !== null &&
      c.green_fee_weekday_thb <= 4000,
    reasonFor: (c) => {
      const parts: string[] = ['walking permitted']
      if (c.green_fee_weekday_thb)
        parts.push(
          `${feeLabelsEn(c).lower.toLowerCase()} from ${c.green_fee_weekday_thb.toLocaleString('en-US')} THB`
        )
      if (c.driving_range) parts.push('range on site')
      return parts.join(' · ')
    },
    crossLink: { href: '/lessons', label: 'Junior lessons at LENGOLF' },
  },
  'high-handicappers': {
    slug: 'high-handicappers',
    title: 'Best Bangkok-Area Golf Courses for High-Handicappers',
    framing:
      'Forgiving Thai courses where a high-handicapper can lose a few balls without losing the round. We weight toward layouts with on-site driving ranges (warm-up matters most when your swing is variable) and pars of 71 or lower (less length to grind through).',
    predicate: (c) => c.driving_range === true && c.par <= 71,
    reasonFor: (c) => {
      const parts: string[] = [`par ${c.par}`, 'driving range on site']
      if (c.green_fee_weekday_thb)
        parts.push(
          `${feeLabelsEn(c).lower.toLowerCase()} from ${c.green_fee_weekday_thb.toLocaleString('en-US')} THB`
        )
      return parts.join(' · ')
    },
    crossLink: { href: '/lessons', label: 'Improve fast at LENGOLF lessons' },
  },
}

export const USE_CASE_SLUGS = USE_CASES.map((u) => u)
