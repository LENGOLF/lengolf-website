/**
 * Golf lesson prices published by other Bangkok coaching providers.
 *
 * Read by the /cost/golf-lesson-prices-bangkok/ comparison table and its
 * JSON-LD (data/price-guide-pages.ts, lib/jsonld.ts) and by /llms-full.txt, so
 * the page, its structured data and the AI-assistant file cannot disagree.
 *
 * Rules for this file:
 * - Only prices a provider PUBLISHES (its own website, booking page or printed
 *   price card). Never an estimate, never a figure remembered from elsewhere.
 *   A provider with no published price stays in the table with
 *   `singleLessonThb: null`, so the page can answer "how much does X charge"
 *   honestly instead of omitting the name people search for.
 * - Every row carries the date its figures were last read (`checkedOn`).
 *   When you re-check a row, update that date and the page's `updated_at`.
 * - LENGOLF is NOT in this file. Its prices are POS-backed {{lesson…}} fact
 *   tokens on the page itself (lib/site-facts.ts), so they follow the catalog.
 * - English only. The th/ja/ko/zh entries of the page do not render this
 *   table yet; adding it there needs native-language QA (CLAUDE.md).
 */

export interface CoachingProvider {
  /** Stable key, also the JSON-LD @id fragment. */
  id: string
  name: string
  /** Business or coach type, e.g. "Indoor simulator academy (TrackMan)". */
  kind: string
  /** Where lessons happen, as the provider states it. */
  area: string
  /** Lowest published price for one private lesson, THB; null = not published. */
  singleLessonThb: number | null
  /** Display text for the single-lesson cell (duration, tiers, tax). */
  singleLesson: string
  /** Display text for the best published package rate, or '—'. */
  packageRate: string
  /** At-a-glance table: lowest published rate per hour (or per lesson, see
   *  rateNote) on any package or program, THB; null = none published. */
  lowestRateThb: number | null
  /** Short qualifier under the single-lesson figure, e.g. "promo". */
  singleNote?: string
  /** Short qualifier under the lowest-rate figure, e.g. "per lesson". */
  rateNote?: string
  /** A free first lesson or trial is published. */
  freeTrial: boolean
  /** One- to three-word "what the price includes" for the glance table. */
  includesShort: string
  /** What the price includes, as stated by the provider. */
  includes: string
  /** Where the figures come from. */
  sourceLabel: string
  sourceUrl: string | null
  /** ISO date the figures were last read from the source. */
  checkedOn: string
}

export const COACHING_PROVIDERS: CoachingProvider[] = [
  {
    id: 'golf-space-academy',
    name: 'Golf Space Academy',
    kind: 'Golf academy',
    area: 'Bangkok',
    singleLessonThb: 1900,
    singleLesson: '1,900 THB for 1 hour (2,500 THB with TrackMan analysis)',
    packageRate:
      '12,900 THB for 10 hours (1,290 THB/hr, 6 months); 29,900 THB for 25 hours (1,196 THB/hr, 1 year)',
    lowestRateThb: 1196,
    rateNote: '25-hour course',
    freeTrial: false,
    includesShort: 'Not stated',
    includes: 'Not stated on the price page',
    sourceLabel: 'Golf Space Academy programs page',
    sourceUrl: 'https://www.golfspaceacademy.com/programs/',
    checkedOn: '2026-10-22',
  },
  {
    id: 'topgolf-megacity',
    name: 'Topgolf Megacity Academy',
    kind: 'Driving range academy (Toptracer)',
    area: 'Megabangna, Bang Phli (Samut Prakan)',
    singleLessonThb: 1900,
    singleLesson: '1,900 THB per private lesson (lead coach 2,100 THB), before tax and service charge',
    packageRate: '10 lessons at 1,700 THB each; groups of 3+ from 650 THB per person per lesson',
    lowestRateThb: 1700,
    singleNote: '+ tax & service',
    rateNote: '10 lessons, + tax & service',
    freeTrial: false,
    includesShort: 'Bay, balls, clubs',
    includes: 'Bay, balls and clubs; swing analysis and Toptracer data',
    sourceLabel: 'Topgolf Thailand academy page and August 2026 adult brochure',
    sourceUrl: 'https://topgolfthailand.com/academy/',
    checkedOn: '2026-10-22',
  },
  {
    id: 'one-degree-center',
    name: 'One Degree Center',
    kind: 'Driving range academy',
    area: 'Driving ranges in Bang Na and Rama 3',
    singleLessonThb: 2000,
    singleLesson: '2,000 THB per hour with an instructor (6,500 THB with the Director of Instruction)',
    packageRate: 'Beginner program 1,800–2,000 THB/hr; courses valid about 3 months',
    lowestRateThb: 1800,
    rateNote: 'beginner program',
    freeTrial: false,
    includesShort: 'Not stated',
    includes: 'Not stated',
    sourceLabel: 'One Degree Center website',
    sourceUrl: 'https://onedegreecenter.com/',
    checkedOn: '2026-10-22',
  },
  {
    id: 'ben-davenport',
    name: 'Ben Davenport (Golf Lessons Bangkok)',
    kind: 'Independent coach, Class A British PGA',
    area: '42 Tee-Off Driving Range, Sukhumvit (Phra Khanong)',
    singleLessonThb: 2495,
    singleLesson: '2,495 THB for 1 hour',
    packageRate: '—',
    lowestRateThb: null,
    freeTrial: false,
    includesShort: 'Not stated',
    includes: 'Not stated',
    sourceLabel: 'Golf Lessons Bangkok booking page',
    sourceUrl: 'https://booking.page/en/company/page/golflessonsbangkok',
    checkedOn: '2026-10-22',
  },
  {
    id: 'front9',
    name: 'Front9 Indoor Golf & Academy',
    kind: 'Indoor simulator academy (TrackMan)',
    area: 'Rainhill, Sukhumvit 47',
    singleLessonThb: 2700,
    singleLesson: '2,700 THB per lesson ("Hero" tier) or 3,200 THB ("Super Star" tier); lesson length not printed',
    packageRate:
      '50 lessons for 110,000 THB (2,200 THB per lesson, 12 months) or 130,000 THB on the Super Star tier (2,600 per lesson); members pay 5% less',
    lowestRateThb: 2200,
    singleNote: 'per lesson',
    rateNote: 'per lesson, 50 lessons',
    freeTrial: false,
    includesShort: 'Range, balls',
    includes: 'Range and golf balls',
    sourceLabel: 'Front9 lesson price card at the venue',
    sourceUrl: 'https://front9golf.com/',
    checkedOn: '2026-10-22',
  },
  {
    id: 'top-golf-asia',
    name: 'Top Golf Asia (Adriaan Herman)',
    kind: 'Independent coach (not related to Topgolf)',
    area: 'Any Bangkok driving range the student chooses',
    singleLessonThb: 3000,
    singleLesson: '3,000 THB for 1 hour; free 1-hour first lesson offered',
    packageRate: '18,000 THB for 10 hours (1,800 THB/hr)',
    lowestRateThb: 1800,
    rateNote: '10 hours',
    freeTrial: true,
    includesShort: 'Not stated',
    includes: 'Not stated; held at the student’s chosen range',
    sourceLabel: 'Top Golf Asia driving range program page',
    sourceUrl: 'https://www.topgolfasia.com/driving-range-program/',
    checkedOn: '2026-10-22',
  },
  {
    // A launch promotion for one teaching pro (Pro Poon, Parathakorn Suyasri),
    // posted by the academy about March 2026 and supplied by LENGOLF on
    // 2026-10-22. Not a standard rate card: the academy publishes no prices
    // for its other coaches, so the copy says "from" and names the pro.
    id: 'tom-dingwall',
    name: 'Tom Dingwall Golf Academy',
    kind: 'Indoor simulator academy and outdoor range',
    area: 'Marriott Executive Apartments Sukhumvit Park (Sukhumvit 24), and The Bangna Driving Range',
    singleLessonThb: 2000,
    singleLesson:
      'From 2,000 THB for 1 hour (a 2026 promotion for teaching pro Pro Poon); prices for its other coaches are not published',
    packageRate: '11,400 THB for 6 hours (1,900 THB/hr); 21,600 THB for 12 hours (1,800 THB/hr), same promotion',
    lowestRateThb: 1800,
    singleNote: 'promo, one pro',
    rateNote: '12 hours, promo',
    freeTrial: false,
    includesShort: 'Not stated',
    includes: 'Not stated',
    sourceLabel: 'Tom Dingwall Golf Academy lesson promotion (posted about March 2026)',
    sourceUrl: 'https://www.tomdingwallgolf.com/golf-lessons/',
    checkedOn: '2026-10-22',
  },
  {
    id: 'bangkok-golf-centre',
    name: 'Bangkok Golf Centre',
    kind: 'Indoor simulator academy',
    area: 'All Seasons Place, CRC Tower, Wireless Road',
    singleLessonThb: null,
    singleLesson: 'Not published online; quoted on request',
    packageRate: '—',
    lowestRateThb: null,
    freeTrial: false,
    includesShort: 'Not published',
    includes: 'Not published',
    sourceLabel: 'Bangkok Golf Centre listings',
    sourceUrl: null,
    checkedOn: '2026-10-22',
  },
]

/** Providers with a published single-lesson price. */
export function pricedProviders(): (CoachingProvider & { singleLessonThb: number })[] {
  return COACHING_PROVIDERS.filter(
    (p): p is CoachingProvider & { singleLessonThb: number } => p.singleLessonThb !== null
  )
}

/** Lowest and highest published single-lesson price across other providers. */
export function singleLessonRange(): { low: number; high: number; count: number } {
  const prices = pricedProviders().map((p) => p.singleLessonThb)
  return { low: Math.min(...prices), high: Math.max(...prices), count: prices.length }
}

/** Latest checkedOn across the table, for the page's "checked" line. */
export function providersCheckedOn(): string {
  return COACHING_PROVIDERS.map((p) => p.checkedOn).sort().at(-1) ?? ''
}
