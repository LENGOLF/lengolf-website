#!/usr/bin/env tsx

/**
 * i18n house-style / honesty consistency linter for localized guide content.
 *
 * Automates the MECHANICAL subset of the native-QA rubric in
 * docs/i18n-review-checklist.md — the lexical, typographic and honesty-scoping
 * checks that don't need a human reviewer's judgment. Fluency, register and
 * fact-fidelity still require the human/agent review in that checklist; this
 * script only guards the objectively-decidable rules encoded in the
 * machine-readable glossaries at data/i18n-glossary/<locale>.json
 * (terminology / conventions / honesty_constraints / transliterations).
 *
 * Corpus (server-free, imported directly like validate-internal-links.ts):
 *   - data/explainer-pages.ts   — every entry with locale ja/ko/zh/th
 *   - data/golf-courses-i18n.ts — REGION_HUB_I18N (ja/ko/zh hub strings)
 *   - data/faq-pages.ts         — faqPages entries with locale ja/ko/zh/th
 *   - data/price-tiers.ts       — PRICE_TIER_I18N (th/ja/ko/zh tier strings)
 *   - data/faq-hub.ts           — the /faq/ hub content per locale
 *   - data/price-guide-pages.ts — /cost entries with locale ja/ko/zh/th
 *   - data/activity-occasions.ts — /activities entries, same locales
 *   - data/best-of-listicle-pages.ts — /best entries, same locales
 * data/faq-pages.ts imports lib/pricing at module level, but that module is
 * tsx-safe by design: its React `cache` call falls back to identity outside
 * the RSC runtime (see the comment in lib/pricing.ts), and the live pricing
 * fetch only runs inside the exported async helpers, never at import time.
 * The other three are plain data modules.
 *
 * ERROR-level (exit 1) — a hard defect that must never ship:
 *   1. Emoji in ja/ko/zh content.
 *   2. Exclamation marks (! or ！) in ja/ko/zh content (glossary tone forbids).
 *   3. Full-width digits ０-９ in ja content (glossary: half-width Arabic only).
 *   4. A terminology `avoid` variant used instead of the settled `use` form.
 *   5. Brand-immutable corruption (case-mangled LENGOLF / len.golf / BTS / ...).
 *   6. Unbalanced markdown bold (**), or unbalanced braces — a broken
 *      '{{token}}' placeholder or a malformed ICU argument. Braces are
 *      depth-scanned, so an ICU plural's '}}' tail is valid (see checkMarkup).
 *  10. UI-message namespace parity: a next-intl namespace consumed by
 *      translated SSG routes (SSG_UI_NAMESPACES below) is entirely missing
 *      from a locale's messages/<locale>.json. next-intl does NOT fail the
 *      build on this — it logs MISSING_MESSAGE per render and silently falls
 *      back to English (precedent: GolfCourseShared absent from ja/ko/zh,
 *      ~480 warnings/build, fixed in PR #78). The locales each namespace must
 *      cover are derived from the translated-route registry
 *      (lib/translated-routes.ts) — a mirror of the generateStaticParams
 *      data sources, kept in sync by smoke-test sections I/J.
 *
 * WARN-level (reported, exit 0) — expected to fire on legacy entries:
 *   7. Currency-convention drift vs conventions.currency.primary.
 *   8. honesty_constraints.forbidden_claims used WITHOUT LENGOLF-scoping
 *      (flag_mode: 'review' → printed as '⚠ review', a human confirms scoping).
 *   9. Price figures in an entry that carries no 'as of' marker anywhere.
 *  11. UI-message key gaps: the namespace exists in the locale catalog but
 *      individual keys present in messages/en.json are missing (each one is a
 *      MISSING_MESSAGE + English fallback at render time).
 *
 * Usage: npx tsx scripts/validate-i18n.ts
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { explainerPages } from '@/data/explainer-pages'
import { COURSE_DETAIL_I18N, REGION_HUB_I18N } from '@/data/golf-courses-i18n'
import { hasProvinceL10n } from '@/lib/course-seo'
import type { GolfCourse } from '@/types/golf-courses'
import { faqPages } from '@/data/faq-pages'
import { PRICE_TIER_I18N } from '@/data/price-tiers'
import { getFaqHubContent } from '@/data/faq-hub'
import { priceGuidePages } from '@/data/price-guide-pages'
import { activityOccasionPages } from '@/data/activity-occasions'
import { bestOfListiclePages } from '@/data/best-of-listicle-pages'
import { hotelConciergePages } from '@/data/hotel-pages'
import {
  getRegisteredGuidePaths,
  getRegisteredFaqPaths,
  getRegisteredRegionHubPaths,
  getRegisteredPriceTierPaths,
  getRegisteredCourseDetailPaths,
  hasTranslationForLocale,
} from '@/lib/translated-routes'
import type { ExplainerContent, FaqContent } from '@/types/seo-pages'

type Locale = 'ja' | 'ko' | 'zh' | 'th'
const LOCALES: Locale[] = ['ja', 'ko', 'zh', 'th']

// ── Glossary schema (only the fields this linter reads) ─────────────────────
interface Terminology {
  term: string
  use: string
  avoid: string[]
  note?: string
}
interface Glossary {
  locale: string
  brand_immutable: string[]
  tone: string
  terminology: Terminology[]
  conventions: {
    currency: { primary: string }
    as_of_format: string
  }
  honesty_constraints: { flag_mode: string; forbidden_claims: string[] }
  transliterations: Record<string, string>
  style_notes?: string[]
}

const glossaries: Record<Locale, Glossary> = Object.fromEntries(
  LOCALES.map((l) => [
    l,
    JSON.parse(
      readFileSync(
        fileURLToPath(new URL(`../data/i18n-glossary/${l}.json`, import.meta.url)),
        'utf8'
      )
    ) as Glossary,
  ])
) as Record<Locale, Glossary>

// 'As of' marker that satisfies conventions.as_of_format, per locale. Derived
// from each glossary's as_of_format example (JA 現在 majority form + 時点; KO
// 기준; ZH 截至; TH ข้อมูล ณ). Presence of any of these ANYWHERE in an entry
// means the entry is date-scoped, so its price figures are not flagged by
// check 9.
//
// TH must match the full 'ข้อมูล ณ' phrase, not bare 'ณ ': the letter ณ ends
// the everyday word ประมาณ ("approximately", which precedes prices constantly)
// and also stands alone as the preposition "at" (ณ จังหวะปะทะลูก) — a bare-ณ
// marker silently shielded 7 of the 8 TH FAQ entries from this check.
const AS_OF_MARKERS: Record<Locale, string[]> = {
  ja: ['現在', '時点'],
  ko: ['기준'],
  zh: ['截至'],
  th: ['ข้อมูล ณ'],
}

// Locales whose tone forbids emoji + exclamation marks. Derived from the
// glossary tone string (all of ja/ko/zh state "No exclamation marks. No emoji.";
// verified by reading each glossary's `tone`). Scoped to ja/ko/zh per the task.
const NO_EMOJI_EXCL: Locale[] = (['ja', 'ko', 'zh'] as Locale[]).filter((l) =>
  /no exclamation/i.test(glossaries[l].tone)
)

// ── Issue collection ────────────────────────────────────────────────────────
interface Issue {
  level: 'error' | 'warn'
  locale: Locale
  entryId: string
  field: string
  check: string
  detail: string
}
const issues: Issue[] = []
function add(
  level: Issue['level'],
  locale: Locale,
  entryId: string,
  field: string,
  check: string,
  detail: string
) {
  issues.push({ level, locale, entryId, field, check, detail })
}

// A single lintable string with its provenance.
interface Unit {
  locale: Locale
  entryId: string
  field: string
  value: string
}

/** Flatten an ExplainerContent into its lintable strings. */
function explainerUnits(locale: Locale, entryId: string, title: string, meta: string | null, c: ExplainerContent): Unit[] {
  const u: Unit[] = []
  const push = (field: string, value: string | null | undefined) => {
    if (typeof value === 'string' && value.length > 0) u.push({ locale, entryId, field, value })
  }
  push('title', title)
  push('meta_description', meta)
  push('intro', c.intro)
  c.sections?.forEach((s, i) => {
    push(`sections[${i}].heading`, s.heading)
    push(`sections[${i}].body`, s.body)
  })
  c.key_takeaways?.forEach((k, i) => push(`key_takeaways[${i}]`, k))
  push('table_heading', c.table_heading)
  push('col_a_label', c.col_a_label)
  push('col_b_label', c.col_b_label)
  c.comparison_table?.forEach((row, i) => {
    push(`comparison_table[${i}].feature`, row.feature)
    push(`comparison_table[${i}].simulator`, row.simulator)
    push(`comparison_table[${i}].real_golf`, row.real_golf)
  })
  return u
}

/** Flatten a FaqContent into its lintable strings (slugs are not linted). */
function faqUnits(locale: Locale, entryId: string, title: string, meta: string | null, c: FaqContent): Unit[] {
  const u: Unit[] = []
  const push = (field: string, value: string | null | undefined) => {
    if (typeof value === 'string' && value.length > 0) u.push({ locale, entryId, field, value })
  }
  push('title', title)
  push('meta_description', meta)
  push('answer_intro', c.answer_intro)
  push('answer_body', c.answer_body)
  c.related_questions?.forEach((q, i) => push(`related_questions[${i}].question`, q.question))
  return u
}

// The next-intl UI string catalogues. Loaded here rather than next to the
// parity checks further down because BOTH halves of this linter need them: the
// content corpus below lints what the strings say, checks 10/11 lint which
// keys exist.
type MessageCatalog = Record<string, unknown>

const uiCatalogs = Object.fromEntries(
  (['en', ...LOCALES] as const).map((l) => [
    l,
    JSON.parse(
      readFileSync(fileURLToPath(new URL(`../messages/${l}.json`, import.meta.url)), 'utf8')
    ) as MessageCatalog,
  ])
) as Record<'en' | Locale, MessageCatalog>

// Build the corpus, grouped by entry (as-of scoping is an entry-level fact).
//
// `uiChrome` marks the messages/*.json corpus. Those entries run the ERROR
// checks (1-6) but NOT the WARN checks (7/8/9) — see the corpus block below for
// why date-scoping and currency-convention rules don't transfer to microcopy.
const entries: { entryId: string; locale: Locale; units: Unit[]; uiChrome?: true }[] = []

for (const page of explainerPages) {
  if (!LOCALES.includes(page.locale as Locale)) continue
  const locale = page.locale as Locale
  entries.push({
    entryId: page.id,
    locale,
    units: explainerUnits(locale, page.id, page.title, page.meta_description, page.content),
  })
}

for (const page of faqPages) {
  if (!LOCALES.includes(page.locale as Locale)) continue
  const locale = page.locale as Locale
  entries.push({
    entryId: page.id,
    locale,
    units: faqUnits(locale, page.id, page.title, page.meta_description, page.content),
  })
}

for (const [tier, byLocale] of Object.entries(PRICE_TIER_I18N)) {
  if (!byLocale) continue
  for (const [loc, t] of Object.entries(byLocale)) {
    if (!t || !LOCALES.includes(loc as Locale)) continue
    const locale = loc as Locale
    const entryId = `tier:${tier}:${locale}`
    entries.push({
      entryId,
      locale,
      units: [
        { locale, entryId, field: 'title', value: t.title },
        { locale, entryId, field: 'framing', value: t.framing },
        { locale, entryId, field: 'catch', value: t.catch },
      ],
    })
  }
}

// data/faq-hub.ts — the /faq/ hub. Registered as a translated route in all
// four locales by the structural-parity batch, so ~420 lines of ja/ko/zh
// prose (including the LENGOLF-scoped honesty sentences) reach readers; it
// was outside this corpus and shipped unlinted. Flattened generically so a
// new FaqHubContent field is covered without touching this loop.
for (const locale of LOCALES) {
  const entryId = `faqhub:${locale}`
  const leaves: Array<[string, string]> = []
  flattenMessages(getFaqHubContent(locale), '', leaves)
  // browseBuckets[].categories are machine slugs matched against FAQ page
  // data, and faqLinks hrefs are URLs — neither is prose, so linting them
  // would fire the brand-immutable and terminology checks on identifiers.
  // NOTE: nothing asserts they stay byte-identical to en. They are today,
  // but a translated category slug would silently resolve to an empty
  // bucket that the page filters out, and the /faq smoke test (200 +
  // <main>) would still pass. Worth a real parity assertion.
  const units = leaves
    .filter(([field]) => !/\.categories\[|^faqLinks\./.test(field))
    .map(([field, value]) => ({ locale, entryId, field, value }))
  if (units.length > 0) entries.push({ entryId, locale, units })
}

// data/price-guide-pages.ts (/cost) and data/activity-occasions.ts
// (/activities). Both were outside this corpus, so the moment those routes
// became locale-capable a translated entry would have shipped with NO
// house-style, terminology or honesty checking at all — the same gap
// data/faq-hub.ts had before PR #88. Wired up BEFORE any translation lands so
// the first batch is linted, not the second.
//
// Flattened generically (flattenMessages yields only non-empty strings, so
// numeric/boolean fields — seasonal_relevance, show_aqi_widget,
// players_per_bay, price_includes_tax — are excluded automatically).
// Non-prose STRING fields still have to be named:
//   - occasion_type is a machine key ('rainy-day', 'date-night'), not copy.
//   - last_verified is an ISO date.
//   - curated_reviews are VERBATIM third-party quotes from named customers
//     ("Chidbhan T.", "Jack S."). They are deliberately NOT translated —
//     rewording a named person's quoted words misrepresents them — so they
//     stay English on every locale page, which also means they must not be
//     linted: one of them legitimately contains "!!", and the exclamation
//     check would fail an entry for faithfully reproducing a real review.
// `list_items[].address` is a street address and `.website` a URL — neither is
// prose, and linting them fires the brand and terminology checks on
// identifiers. `rank`, `year` and `is_lengolf` are numeric/boolean and drop
// out of flattenMessages on their own.
// `google_maps_embed` is a URL for the same reason, and
// `suggested_itinerary[].time` is a clock reading ("2:00 PM") that the /hotels
// batch deliberately keeps as the same instant in every locale.
const NON_PROSE_SEO_FIELD_RE =
  /^occasion_type$|^last_verified$|^curated_reviews\[|^list_items\[\d+\]\.(address|website)$|^google_maps_embed$|^suggested_itinerary\[\d+\]\.time$/
// `hotel` was imported for the SSG-namespace check but never added here, so the
// 48 /hotels translations shipped in PR #90 got ZERO house-style checking — no
// emoji, exclamation, full-width-digit, terminology or brand-casing gate — on
// the one section that also shipped without native-language QA. Verified by
// injection: an emoji + `！` in a ja hotel `area_guide` passed clean before this
// line and fails after it.
for (const [label, pages] of [
  ['cost', priceGuidePages],
  ['activity', activityOccasionPages],
  ['best', bestOfListiclePages],
  ['hotel', hotelConciergePages],
] as const) {
  for (const page of pages) {
    if (!LOCALES.includes(page.locale as Locale)) continue
    const locale = page.locale as Locale
    const entryId = `${label}:${page.id}`
    const leaves: Array<[string, string]> = []
    flattenMessages(page.content, '', leaves)
    const units = [
      { locale, entryId, field: 'title', value: page.title },
      ...(page.meta_description
        ? [{ locale, entryId, field: 'meta_description', value: page.meta_description }]
        : []),
      ...leaves
        .filter(([field]) => !NON_PROSE_SEO_FIELD_RE.test(field))
        .map(([field, value]) => ({ locale, entryId, field, value })),
    ]
    if (units.length > 0) entries.push({ entryId, locale, units })
  }
}

for (const [region, byLocale] of Object.entries(REGION_HUB_I18N)) {
  if (!byLocale) continue
  for (const [loc, t] of Object.entries(byLocale)) {
    if (!t) continue
    const locale = loc as Locale
    const entryId = `hub:${region}:${locale}`
    entries.push({
      entryId,
      locale,
      units: [
        { locale, entryId, field: 'label', value: t.label },
        { locale, entryId, field: 'province', value: t.province },
        { locale, entryId, field: 'description', value: t.description },
      ],
    })
  }
}

// ── Course-detail locale content (course.locales.<locale> on data/golf-courses/) ──
// Unlike the corpora above, the localized strings live on each course's own
// data file, not in one importable module — so the files are loaded here via
// require() (tsx patches the CJS loader to handle .ts). Three things happen:
//   a) every registered (course, locale) tuple's strings join `entries`, so
//      the newest localized surface goes through the same house-style/honesty
//      checks as guides/FAQs/hubs/tiers;
//   b) a tuple whose course file lacks locales.<locale> (or misses
//      title/meta) is an ERROR — without this, the page builds and serves an
//      almost-entirely-English 200 under the locale URL while hreflang and
//      the sitemap advertise it as translated (smoke J3 only ties the route
//      registry to COURSE_DETAIL_I18N, not to the course files);
//   c) the inverse drift — a course file carrying locales.th/ja content with
//      no COURSE_DETAIL_I18N tuple — is an ERROR too (the translation exists
//      but never builds).
// Also errors when a registered course's (English) province is missing from
// the PROVINCE_L10N map in lib/course-seo.ts: an unmapped province silently
// drops the locality clause from the localized FAQ answers and JSON-LD.
function courseUnits(locale: Locale, entryId: string, l: NonNullable<GolfCourse['locales']['th']>): Unit[] {
  const u: Unit[] = []
  const push = (field: string, value: string | null | undefined) => {
    if (typeof value === 'string' && value.length > 0) u.push({ locale, entryId, field, value })
  }
  push('title', l.title)
  push('meta_description', l.meta_description)
  if (l.prose) for (const [k, v] of Object.entries(l.prose)) push(`prose.${k}`, v)
  return u
}

const COURSES_ROOT = fileURLToPath(new URL('../data/golf-courses', import.meta.url))
const registeredCourseLocales = new Map<string, readonly string[]>(
  COURSE_DETAIL_I18N.map((e) => [`${e.region}/${e.slug}`, e.locales])
)
for (const region of readdirSync(COURSES_ROOT)) {
  const dir = join(COURSES_ROOT, region)
  if (!statSync(dir).isDirectory()) continue
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.ts') || f === 'index.ts') continue
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const course = (require(join(dir, f)) as { course?: GolfCourse }).course
    if (!course) continue
    const key = `${region}/${f.replace(/\.ts$/, '')}`
    const registered = registeredCourseLocales.get(key) ?? []

    for (const locale of LOCALES) {
      const l = course.locales[locale as keyof GolfCourse['locales']]
      const hasContent = !!l && (locale as string) !== 'en'
      const isRegistered = registered.includes(locale)
      const entryId = `course:${key}:${locale}`
      if (isRegistered && (!l || !l.title || !l.meta_description)) {
        add('error', locale, entryId, 'locales', 'course-registry',
          `COURSE_DETAIL_I18N registers '${locale}' but the course file has no locales.${locale} title/meta_description — the page would serve English content on the ${locale} URL while hreflang advertises a translation`)
        continue
      }
      if (!isRegistered && hasContent) {
        add('error', locale, entryId, 'locales', 'course-registry',
          `course file carries locales.${locale} content but COURSE_DETAIL_I18N has no ('${locale}') tuple — the translation exists but never builds`)
      }
      if (isRegistered && l) entries.push({ entryId, locale, units: courseUnits(locale, entryId, l) })
    }

    if (registered.length > 0 && !hasProvinceL10n(course.province)) {
      add('error', 'th', `course:${key}`, 'province', 'province-l10n',
        `province "${course.province}" is missing from PROVINCE_L10N in lib/course-seo.ts — the localized FAQ answers silently drop their locality clause`)
    }
  }
}

// ── UI chrome content (messages/<locale>.json) ──────────────────────────────
// Until this block, the corpus was page CONTENT only — guides, FAQs, hubs,
// tiers, course details. The next-intl catalogue went unlinted, so the strings
// a visitor actually reads on most pages (nav, headings, hero copy, CTAs, stat
// badges, metadata) were certified by nothing. A green run said less than it
// looked like it said.
//
// English is deliberately excluded: the glossaries encode target-language
// terminology and tone, so linting the source language against them is
// meaningless. LOCALES is already ja/ko/zh/th, which gives that for free.
//
// Entry granularity is one per namespace, so a failure names something a human
// can find (`messages:ja:HomeJa`) rather than a bare key path.
//
// Scoped to the ERROR checks via `uiChrome`. The three WARN checks are
// entry-shaped rules that don't transfer to microcopy:
//   - price-as-of (9) assumes an entry is an article that can carry a date
//     marker somewhere in its prose. A hero subtitle reading "1時間550バーツ〜"
//     has nowhere to put "as of July 2026" without wrecking the layout, and the
//     live price lives in data/pricing.ts anyway.
//   - currency (7) and honesty (8) are calibrated against long-form prose; on
//     3-word stat badges they fire on fragments with no room for the scoping
//     clause they demand.
// Running them here would have added ~200 standing warnings to every CI run,
// which is how a linter teaches people to ignore it.
/** Recursively flatten a namespace object into dotted-path leaf strings. */
function flattenMessages(node: unknown, prefix: string, out: Array<[string, string]>): void {
  if (typeof node === 'string') {
    if (node.length > 0) out.push([prefix, node])
    return
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => flattenMessages(v, `${prefix}[${i}]`, out))
    return
  }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      flattenMessages(v, prefix ? `${prefix}.${k}` : k, out)
    }
  }
}

for (const locale of LOCALES) {
  for (const [namespace, body] of Object.entries(uiCatalogs[locale])) {
    const leaves: Array<[string, string]> = []
    flattenMessages(body, '', leaves)
    if (leaves.length === 0) continue
    const entryId = `messages:${locale}:${namespace}`
    entries.push({
      entryId,
      locale,
      uiChrome: true,
      units: leaves.map(([field, value]) => ({ locale, entryId, field, value })),
    })
  }
}

// ── Shared regexes / helpers ────────────────────────────────────────────────
// Emoji detection is "everything pictographic, MINUS a named allowlist", not a
// narrowed property test.
//
// Adding the messages/*.json corpus surfaced two false positives in the original
// \p{Extended_Pictographic} check: the (c) in "(c) {year} LENGOLF CO., LTD." (a
// legal mark, identical in the English source) and the star in the trust-chip
// rating string. Neither is decoration.
//
// The tempting fix, narrowing to \p{Emoji_Presentation}, silently disarms the
// check for every pictograph that defaults to TEXT presentation: heart, warning,
// arrow, check, plane and sun all stop matching. Browsers render a bare heart in
// colour anyway, so it would ship as decoration with the linter silent. Two false
// positives are not worth six false negatives.
//
// So: subtract an explicit allowlist, then test the full pictographic union.
// \p{Emoji_Presentation} is kept as an alternative because it adds regional-
// indicator flags, which are NOT Extended_Pictographic and which the original
// check missed entirely.
const EMOJI_ALLOW_RE = /[\u00A9\u00AE\u2122\u2605\u2606]/gu // (c) (r) tm star whitestar
const EMOJI_RE = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/u
/** First disallowed emoji in `value`, or null. Allowlisted marks are ignored. */
function emojiHit(value: string): string | null {
  return EMOJI_RE.exec(value.replace(EMOJI_ALLOW_RE, ''))?.[0] ?? null
}
const EXCL_RE = /[!！]/
const FULLWIDTH_DIGIT_RE = /[０-９]/
const PRICE_RE = /\d{1,3}(?:,\d{3})*\s*(?:THB|บาท|바트|泰铢|バーツ)/

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** All start indices of `needle` in `hay`. */
function indicesOf(hay: string, needle: string): number[] {
  const out: number[] = []
  let i = hay.indexOf(needle)
  while (i !== -1) {
    out.push(i)
    i = hay.indexOf(needle, i + 1)
  }
  return out
}

/** Ranges [start,end) covered by every occurrence of `form` in `value`. */
function coveredRanges(value: string, form: string): Array<[number, number]> {
  return indicesOf(value, form).map((i) => [i, i + form.length] as [number, number])
}

// ── Check 4: terminology `avoid` variants ───────────────────────────────────
// Plain-substring is correct for CJK. The subtlety: when an avoid string is a
// substring of its own `use` form (e.g. JA キャディ ⊂ キャディー, グリーンフィ ⊂
// グリーンフィー), a naive substring hit would false-flag the CORRECT form. So
// when avoid ⊂ use, we skip any avoid occurrence that falls inside an occurrence
// of the use form. Tested below in --self-test.
function checkTerminology(unit: Unit) {
  const g = glossaries[unit.locale]
  for (const t of g.terminology) {
    for (const avoid of t.avoid) {
      if (!avoid) continue
      const hits = indicesOf(unit.value, avoid)
      if (hits.length === 0) continue
      const useCovers = t.use.includes(avoid)
        ? coveredRanges(unit.value, t.use)
        : []
      for (const at of hits) {
        const end = at + avoid.length
        const shielded = useCovers.some(([s, e]) => at >= s && end <= e)
        if (shielded) continue
        add(
          'error',
          unit.locale,
          unit.entryId,
          unit.field,
          'terminology',
          `avoid variant "${avoid}" used — settled form is "${t.use}"`
        )
        break // one report per avoid-term per field is enough
      }
    }
  }
}

// ── Check 5: brand-immutable corruption ─────────────────────────────────────
// Flag a case-mangled rendering of a brand-immutable token. Two guards:
//  (a) Skip a term that has a legitimate transliteration in this locale (its
//      katakana/hangul rendering is a non-Latin form the mangle regex can't
//      match anyway, and the checklist says not to "correct" those).
//  (b) For LENGOLF specifically, the lowercase LINE handle "@lengolf" and the
//      domain "len.golf" / "booking.len.golf" are separately-correct brand
//      tokens — never treat those as a mangled LENGOLF.
function transliteratedTerms(locale: Locale): Set<string> {
  const keys = Object.keys(glossaries[locale].transliterations).filter((k) => k !== 'note')
  const out = new Set<string>()
  for (const term of glossaries[locale].brand_immutable) {
    const lc = term.toLowerCase()
    if (keys.some((k) => k.toLowerCase().includes(lc) || lc.includes(k.toLowerCase()))) {
      out.add(term)
    }
  }
  return out
}

function checkBrands(unit: Unit) {
  const g = glossaries[unit.locale]
  const skip = transliteratedTerms(unit.locale)
  for (const term of g.brand_immutable) {
    if (skip.has(term)) continue
    const re = new RegExp(escapeRe(term), 'gi')
    let m: RegExpExecArray | null
    while ((m = re.exec(unit.value)) !== null) {
      const text = m[0]
      if (text === term) continue // exact, correct
      const before = unit.value[m.index - 1] ?? ''
      const after = unit.value[m.index + text.length] ?? ''
      // Skip url/handle-embedded tokens: @lengolf, len.golf, foo-lengolf-bar, slugs.
      if (/[@./\-\w]/.test(before) || /[@./\-\w]/.test(after)) continue
      add(
        'error',
        unit.locale,
        unit.entryId,
        unit.field,
        'brand',
        `brand-immutable "${term}" appears mangled as "${text}"`
      )
    }
  }
}

// ── Check 6b: the locale slot holds the locale's own language ───────────────
// WHY: a whole translated paragraph shipped in the WRONG SLOT — the Simplified
// Chinese rendering of a price-tier `catch` was written into that tier's `th`
// field, so /th/golf-courses/under/3500-baht/ served a Chinese paragraph inside
// Thai page chrome, on a statically generated indexed page. Every gate was
// green: the string is well-formed, emoji-free, brace-balanced, and its
// terminology is correct *for Chinese*. The only mechanical trace was a single
// non-blocking WARN among 388 — a th-locale unit whose price read "500泰铢" —
// which is not a signal anyone reads. Nothing checked what LANGUAGE a string
// was in, so a slot swap was invisible.
//
// Two rules, because either alone has a hole:
//
//   a) DOMINANCE — foreign-script characters outnumber the locale's own, above
//      a floor. Catches a whole paragraph in the wrong slot while tolerating a
//      deliberate quotation of another language, which this corpus genuinely
//      contains and must keep: `directions.grabTip` prints the venue name in
//      THAI inside the ja/ko/zh copy, precisely so a reader can show it to a
//      taxi driver. A bare "contains a forbidden script" rule flagged all three
//      of those, plus 스크린골프 quoted as a term of art in the th/zh
//      screen-golf explainer, plus 한국어 as the Korean entry in the language
//      switcher — 11 hits, every one correct copy. That version of this gate
//      would have been switched off within a week, which protects nothing.
//
//   b) REQUIRED script for ja — dominance alone cannot see zh→ja, the one pair
//      where the wrong language is not "foreign" at all: Chinese is pure Han,
//      and Han is legal in Japanese, so a Chinese paragraph in a `ja` slot
//      scores 100% "own". Kana is what distinguishes them. Floored high,
//      because short all-kanji Japanese is perfectly normal — 毎日午前9時〜午後11時営業
//      and 動画撮影 / 写真撮影 are both real, correct catalog strings. Only
//      paragraph-scale kanji-without-a-single-kana is a real signal.
//
// Deliberately NOT "any occurrence of a foreign script": see (a). Presence is
// not decidable; proportion is.
//
// KNOWN LIMIT, found while mutation-testing this check: rule (b) requires kana
// to be exactly ZERO, so it catches a whole-slot swap but NOT a partial one. A
// first mutation attempt replaced only the first sentence of a ja `catch` and
// left the Japanese tail in place; kana was 40, the check stayed green, and
// that is correct behaviour — the string really did still contain Japanese.
// Tightening this to a kana/kanji RATIO would catch partial swaps, at the cost
// of firing on legitimately kanji-dense Japanese (headings, spec rows, the
// all-kanji catalog strings listed above). The defect this gate exists for is
// the whole-value swap, so the floor stays at zero. A half-translated string
// remains native QA's job.
const SCRIPT_CLASS = {
  thai: /\p{Script=Thai}/gu,
  hangul: /\p{Script=Hangul}/gu,
  kana: /\p{Script=Hiragana}|\p{Script=Katakana}/gu,
  han: /\p{Script=Han}/gu,
} as const

type ScriptName = keyof typeof SCRIPT_CLASS

/**
 * Which scripts count as "this locale's own". ja claims Han (kanji) and ko
 * claims Han (hanja), which is exactly why ja needs the separate kana rule.
 */
const LOCALE_OWN_SCRIPTS: Record<string, ScriptName[]> = {
  th: ['thai'],
  ja: ['kana', 'han'],
  ko: ['hangul', 'han'],
  zh: ['han'],
}

/** Minimum foreign characters before dominance is even considered. */
const SCRIPT_MIN_FOREIGN = 8
/**
 * How far foreign must outweigh own to count as dominance. A plurality is NOT
 * enough: Chinese is far denser per character than Thai, so the 25-character
 * Thai address quoted in the zh `grabTip` outnumbers the 22 Han characters
 * around it while being entirely correct copy. Requiring 2x separates "quotes
 * a foreign phrase" from "is a foreign paragraph"; a whole-slot swap scores
 * infinite (own = 0), so the margin costs nothing against the real defect.
 */
const SCRIPT_DOMINANCE_RATIO = 2
/** Minimum kanji before an all-kanji `ja` string is treated as suspect. */
const SCRIPT_JA_MIN_KANJI = 30

function countScript(text: string, name: ScriptName): number {
  return (text.match(SCRIPT_CLASS[name]) ?? []).length
}

function checkScript(unit: Unit) {
  const own = LOCALE_OWN_SCRIPTS[unit.locale]
  if (!own) return // en has no script constraint
  // Placeholders and markup are Latin by construction — strip them so they
  // neither satisfy nor violate anything.
  const text = unit.value.replace(/\{\{[^}]*\}\}/g, '').replace(/\{[^}]*\}/g, '')

  const foreignNames = (Object.keys(SCRIPT_CLASS) as ScriptName[]).filter(
    (s) => !own.includes(s)
  )
  const ownCount = own.reduce((n, s) => n + countScript(text, s), 0)
  const foreign = foreignNames
    .map((s) => ({ name: s, n: countScript(text, s) }))
    .filter((x) => x.n > 0)
  const foreignCount = foreign.reduce((n, x) => n + x.n, 0)

  // (a) Dominance.
  if (
    foreignCount >= SCRIPT_MIN_FOREIGN &&
    foreignCount > ownCount * SCRIPT_DOMINANCE_RATIO
  ) {
    const worst = foreign.sort((x, y) => y.n - x.n)[0]
    add(
      'error',
      unit.locale,
      unit.entryId,
      unit.field,
      'script',
      `${foreignCount} ${worst.name}-family character(s) vs ${ownCount} ${unit.locale} — ` +
        `this looks like another locale's text in the ${unit.locale} slot`
    )
    return
  }

  // (b) ja-only: a long run of kanji with no kana at all is Chinese, not
  // Japanese. Japanese sentence structure cannot avoid kana at this length.
  if (unit.locale === 'ja') {
    const kanji = countScript(text, 'han')
    if (kanji >= SCRIPT_JA_MIN_KANJI && countScript(text, 'kana') === 0) {
      add(
        'error',
        unit.locale,
        unit.entryId,
        unit.field,
        'script',
        `${kanji} kanji and no kana — a string this long without kana is Chinese, ` +
          `not Japanese; check whether the zh text landed in the ja slot`
      )
    }
  }
}

// ── Check 6: markdown bold balance + placeholder / ICU brace integrity ──────
// TWO braces rules, because two templating dialects share this corpus:
//
//   a) Structural depth-scan, applied to everything. Catches a '}' that closes
//      nothing and a '{' left open. Replaces the old '{{'-vs-'}}' bigram
//      counter as the general rule, because ICU plurals legitimately END in
//      '}}' with no '{{' anywhere — '{count, plural, =1 {…} other {# …}}' —
//      and the counter hard-failed every one of them. That is why an ICU
//      plural could previously only reach a non-EN catalog via a load-bearing
//      space before the final brace, a booby trap for the next translator.
//
//   b) The bigram equality, kept but SCOPED to the '{{token}}' dialect (the
//      content data — explainer/FAQ/course entries, i.e. NOT uiChrome). The
//      depth-scan alone is *weaker* here, not stronger: '{{bayHourlyFrom} }'
//      is brace-balanced and passes it, but lib/site-facts.ts substitutes on
//      /\{\{\s*(\w+)\s*\}\}/g, so the split closer misses the anchor, replace()
//      is a no-op, and the literal token text ships to visitors WITHOUT
//      throwing (the throw at site-facts only fires for well-formed tokens
//      with unknown names). That shape is exactly the load-bearing space above.
//      The scoping is safe because the dialects don't mix: messages/*.json
//      contains no '{{token}}', and the content data contains no ICU.
//
// So neither rule alone is sufficient, and the pair is a strict superset of
// the old check: '{{price' fails (unclosed), '}}{{' fails (stray — the counter
// passed it 1-for-1), '{{a} b}' fails (bigram), ICU passes.
//
// KNOWN GAP: ICU escapes a literal brace by quoting it ("Use '{' here"). The
// depth-scan reads that as unclosed and errors. No message in any catalog does
// this today; if one ever needs to, strip ICU-quoted spans before scanning
// rather than deleting the check.
function checkMarkup(unit: Unit, dialect: 'icu' | 'token' = 'token') {
  const boldCount = indicesOf(unit.value, '**').length
  if (boldCount % 2 !== 0) {
    add('error', unit.locale, unit.entryId, unit.field, 'markdown', `unbalanced ** (found ${boldCount})`)
  }
  const err = (msg: string) =>
    add('error', unit.locale, unit.entryId, unit.field, 'placeholder', msg)

  // (a) Structural. A stray '}' resets depth and the scan continues, so a
  // second defect later in a long body reports in the same run rather than
  // costing another CI cycle. Offsets are code-point indices — enough to find
  // the spot in a multi-thousand-character explainer body.
  let depth = 0
  let strayAt: number | null = null
  let i = 0
  for (const ch of unit.value) {
    if (ch === '{') depth++
    else if (ch === '}') {
      if (depth === 0) {
        if (strayAt === null) strayAt = i
      } else depth--
    }
    i++
  }
  if (strayAt !== null) {
    err(`unbalanced braces — '}' at offset ${strayAt} closes nothing (broken {{...}} placeholder or ICU argument)`)
  }
  if (depth !== 0) {
    err(`unbalanced braces — ${depth} unclosed '{' (broken {{...}} placeholder or ICU argument)`)
  }

  // (b) Dialect-specific. ICU strings are exempt by construction.
  if (dialect === 'token') {
    const open = indicesOf(unit.value, '{{').length
    const close = indicesOf(unit.value, '}}').length
    if (open !== close) {
      err(`split '{{...}}' placeholder ('{{'×${open} vs '}}'×${close}) — lib/site-facts.ts will not substitute it and the raw token ships`)
    }
  }
}

// ── Check 7: currency-convention drift ──────────────────────────────────────
// ja  : THB primary; バーツ allowed only for physical-cash (near 現金, or タイバーツ).
// ko  : 바트 primary; flag Latin "THB" in prose (allow inside markdown table rows).
// zh  : 泰铢 primary; flag "THB" outside table rows.
function checkCurrency(unit: Unit) {
  const { locale, value } = unit
  if (locale === 'ja') {
    for (const at of indicesOf(value, 'バーツ')) {
      const win = value.slice(Math.max(0, at - 12), at + 3 + 12)
      const cashCtx = win.includes('現金')
      const taiPrefixed = value.slice(Math.max(0, at - 2), at) === 'タイ'
      if (cashCtx || taiPrefixed) continue
      add('warn', locale, unit.entryId, unit.field, 'currency', `バーツ for a price figure — house style is THB (per conventions.currency)`)
      break
    }
    return
  }
  if (locale === 'ko' || locale === 'zh') {
    const primary = glossaries[locale].conventions.currency.primary // 바트 / 泰铢
    const flaggedOnALine = value
      .split('\n')
      .some((line) => !line.includes('|') && line.includes('THB'))
    if (flaggedOnALine) {
      add('warn', locale, unit.entryId, unit.field, 'currency', `Latin "THB" in prose — house style spells the currency as ${primary}`)
    }
  }
}

// ── Check 8: honesty-scoping (forbidden coach-language claims) ───────────────
function checkHonesty(unit: Unit) {
  const g = glossaries[unit.locale]
  if (g.honesty_constraints.flag_mode !== 'review') return
  for (const claim of g.honesty_constraints.forbidden_claims) {
    if (!claim) continue
    for (const at of indicesOf(unit.value, claim)) {
      const win = unit.value.slice(Math.max(0, at - 80), at + claim.length + 80)
      if (win.includes('LENGOLF')) continue
      add(
        'warn',
        unit.locale,
        unit.entryId,
        unit.field,
        'review',
        `honesty claim "${claim}" appears without LENGOLF-scoping nearby — needs human review`
      )
      break
    }
  }
}

// ── Run per-unit checks + entry-level as-of (check 9) ────────────────────────
// A function, not a bare top-level loop, so --self-test can drive a synthetic
// entry through the REAL dispatch below. That matters for one line in
// particular: the `entry.uiChrome ? 'icu' : 'token'` choice. Self-tests that
// call checkMarkup() with a hand-bound dialect prove the two rule sets work,
// but prove NOTHING about which one the corpus actually receives — collapsing
// this call to a constant 'icu' silently drops rule (b) (the `{{token} }`
// split-closer that ships a raw token to visitors) and was invisible to both
// `npm run validate:i18n` AND the self-test until this became callable.
type Entry = (typeof entries)[number]

function runCorpusChecks(corpus: Entry[]) {
  for (const entry of corpus) {
    const markers = AS_OF_MARKERS[entry.locale]
    // Only check 9 consumes this, and uiChrome entries skip check 9 — so don't
    // scan every catalog string for a marker whose result is discarded.
    const hasAsOf =
      entry.uiChrome === true ||
      entry.units.some((u) => markers.some((mk) => u.value.includes(mk)))

    for (const unit of entry.units) {
      const { locale, value } = unit

      // ERROR 1 — emoji
      const emoji = NO_EMOJI_EXCL.includes(locale) ? emojiHit(value) : null
      if (emoji !== null) {
        add('error', locale, unit.entryId, unit.field, 'emoji', `emoji "${emoji}" not allowed`)
      }
      // ERROR 2 — exclamation marks
      if (NO_EMOJI_EXCL.includes(locale) && EXCL_RE.test(value)) {
        add('error', locale, unit.entryId, unit.field, 'exclamation', `exclamation mark not allowed (tone forbids)`)
      }
      // ERROR 3 — full-width digits (ja)
      if (locale === 'ja' && FULLWIDTH_DIGIT_RE.test(value)) {
        const ch = value.match(FULLWIDTH_DIGIT_RE)?.[0] ?? ''
        add('error', locale, unit.entryId, unit.field, 'fullwidth-digit', `full-width digit "${ch}" — use half-width Arabic`)
      }
      // ERROR 4/5/6
      checkTerminology(unit)
      checkBrands(unit)
      checkScript(unit)
      // messages/*.json is the ICU dialect; the content data is '{{token}}'.
      checkMarkup(unit, entry.uiChrome ? 'icu' : 'token')

      // WARN 7/8/9 are entry-shaped prose rules — see the uiChrome note above.
      if (entry.uiChrome) continue

      checkCurrency(unit)
      checkHonesty(unit)

      // WARN 9 — price with no as-of marker in the entry
      if (!hasAsOf && !value.includes('{{') && PRICE_RE.test(value)) {
        const hit = value.match(PRICE_RE)?.[0] ?? ''
        add('warn', locale, unit.entryId, unit.field, 'price-as-of', `price "${hit}" but entry has no 'as of' marker (${markers.join('/')})`)
      }
    }
  }
}

runCorpusChecks(entries)

// ── Checks 10/11: UI-message namespace parity (messages/<locale>.json) ───────
// Content-data parity (guides/FAQs/hubs/tiers) is covered by the corpus checks
// above; this covers the OTHER half of a translated page: the UI chrome strings
// next-intl serves from messages/*.json. A namespace absent from a locale that
// SSGs pages consuming it doesn't fail the build — every render logs
// MISSING_MESSAGE and silently falls back to English.
//
// Allowlist of namespaces consumed by translated SSG routes, each mapped to
// the registry helper whose registered paths prove a locale SSGs pages that
// consume it. New namespace/consumer pairs get added here when a translated
// route starts consuming them. Known-unchecked: the layout-chrome namespaces
// (Nav, Common, Footer, LanguageSwitcher) render on every locale page — a
// scoping decision, since they aren't tied to any one registry helper.
// `uiCatalogs` / `MessageCatalog` are defined above, next to the corpus build.
const localesWithPaths = (registered: (locale: string) => string[]): Locale[] =>
  LOCALES.filter((l) => registered(l).length > 0)

// /activities/<slug> and /cost/<slug> have NO registry helper — and shouldn't.
// Their generateStaticParams is getAllSeoPageParams(type), which enumerates the
// published entries of the data file directly, so the data file IS the list of
// locale x slug pairs that get built. Deriving from the same source therefore
// tracks what actually SSGs, and starts enforcing by itself the moment the
// first non-EN entry lands — no hand-maintained locale list to go stale, and no
// dependency on lib/translated-routes.ts, which these routes never consult for
// param generation.
const localesWithSeoPages = (
  pages: readonly { locale: string; status: string }[]
): Locale[] =>
  LOCALES.filter((l) =>
    pages.some((p) => p.locale === l && p.status === 'published')
  )

const SSG_UI_NAMESPACES: Record<string, Locale[]> = (() => {
  const regionHub = localesWithPaths(getRegisteredRegionHubPaths)
  const priceTier = localesWithPaths(getRegisteredPriceTierPaths)
  const courseDetail = localesWithPaths(getRegisteredCourseDetailPaths)
  const faq = localesWithPaths(getRegisteredFaqPaths)
  const activity = localesWithSeoPages(activityOccasionPages)
  const priceGuide = localesWithSeoPages(priceGuidePages)
  const bestOf = localesWithSeoPages(bestOfListiclePages)
  const hotel = localesWithSeoPages(hotelConciergePages)
  // The /golf-courses/ hub page + HubMapExplorer. No dedicated registry
  // helper exists for a single static path, so derive its SSG locales
  // directly from the registry (currently th only).
  const hub = LOCALES.filter((l) => hasTranslationForLocale(l, '/golf-courses'))
  return {
    GolfCourseHub: hub,
    GolfCourseRegion: regionHub,
    GolfCoursePriceTier: priceTier,
    // Course-detail pages (CoursePage/CourseFaq + the [slug] route).
    GolfCourseDetail: courseDetail,
    // Shared components (RoundupList, RentalCtaBanner) render on hub, tier
    // AND course-detail pages (CoursePage reuses feeFrom + the CTA banner).
    GolfCourseShared: LOCALES.filter(
      (l) => regionHub.includes(l) || priceTier.includes(l) || courseDetail.includes(l)
    ),
    ExplainerPage: localesWithPaths(getRegisteredGuidePaths),
    FaqPage: faq,
    // /activities/<slug>, /cost/<slug> and /best/<slug>. Spread in only once
    // the locale set is non-empty: checkNamespaceParity treats a 0-locale entry
    // as a registry regression and hard-errors, and a section with no non-EN
    // entries yet resolves to [], so a bare `BestOfListiclePage: bestOf` would
    // fail CI for a namespace that is simply not translated yet. Once the
    // content batch adds the first ja/ko/zh/th entry to the data file, the
    // namespace enters the allowlist on its own and parity is enforced from
    // that commit onward — which is how ActivityPage/PriceGuidePage started
    // being checked when /activities and /cost were translated.
    ...(activity.length > 0 ? { ActivityPage: activity } : {}),
    ...(priceGuide.length > 0 ? { PriceGuidePage: priceGuide } : {}),
    ...(hotel.length > 0 ? { HotelConciergePage: hotel } : {}),
    ...(bestOf.length > 0 ? { BestOfListiclePage: bestOf } : {}),
    // components/faq/FaqPage.tsx getTranslations('ContactInfo') on every FAQ
    // page; components/activities/ActivityPage.tsx,
    // components/prices/PriceGuidePage.tsx and
    // components/best/BestOfListiclePage.tsx do the same for the localized
    // address in their CTA copy.
    ContactInfo: [...new Set([...faq, ...activity, ...priceGuide, ...bestOf])],
  }
})()

/** Leaf message keys of a namespace object as dot paths (next-intl nests). */
function flattenKeys(node: unknown, prefix = ''): string[] {
  if (node === null || typeof node !== 'object' || Array.isArray(node)) return [prefix]
  return Object.entries(node as Record<string, unknown>).flatMap(([k, v]) =>
    flattenKeys(v, prefix ? `${prefix}.${k}` : k)
  )
}

function checkNamespaceParity(
  catalogs: Record<'en' | Locale, MessageCatalog>,
  nsLocales: Record<string, Locale[]>
) {
  for (const [ns, locales] of Object.entries(nsLocales)) {
    if (locales.length === 0) {
      // A registry-helper regression (e.g. a changed path prefix) would make
      // this check silently cover nothing — fail loudly instead.
      add('error', 'th', `lib/translated-routes.ts`, ns, 'ui-namespace',
        `allowlisted namespace "${ns}" resolved 0 SSG locales — registry helper regression or stale SSG_UI_NAMESPACES entry`)
      continue
    }
    if (!(ns in catalogs.en)) {
      // Allowlist typo or a namespace renamed in en.json — surface loudly.
      add('error', locales[0] ?? 'th', `messages/en.json`, ns, 'ui-namespace',
        `allowlisted namespace "${ns}" not found in messages/en.json — fix SSG_UI_NAMESPACES or the catalog`)
      continue
    }
    const enKeys = flattenKeys(catalogs.en[ns])
    for (const locale of locales) {
      const entryId = `messages/${locale}.json`
      if (!(ns in catalogs[locale])) {
        add('error', locale, entryId, ns, 'ui-namespace',
          `namespace "${ns}" missing entirely — ${locale} SSG pages consuming it fall back to English (${enKeys.length} MISSING_MESSAGE per render)`)
        continue
      }
      const locKeys = new Set(flattenKeys(catalogs[locale][ns]))
      const gaps = enKeys.filter((k) => !locKeys.has(k))
      if (gaps.length > 0) {
        const shown = gaps.slice(0, 5).join(', ')
        add('warn', locale, entryId, ns, 'ui-key-gap',
          `${gaps.length} key(s) in en.json missing here (English fallback at render): ${shown}${gaps.length > 5 ? ', …' : ''}`)
      }
    }
  }
}

checkNamespaceParity(uiCatalogs, SSG_UI_NAMESPACES)

// ── Optional self-test: drives every ERROR check through the real functions on
// synthetic inputs, proving each detector fires (and that correct forms don't).
// Run: npx tsx scripts/validate-i18n.ts --self-test
if (process.argv.includes('--self-test')) {
  let ok = true
  const assert = (label: string, cond: boolean) => {
    ok &&= cond
    console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}`)
  }
  // Count only NEW error issues added by running `fn` on a synthetic unit.
  const errsFrom = (locale: Locale, value: string, fn: (u: Unit) => void): number => {
    const before = issues.length
    fn({ locale, entryId: '__test__', field: '__test__', value })
    const added = issues.splice(before) // remove synthetic issues, keep count
    return added.filter((i) => i.level === 'error').length
  }

  // Check 4 — terminology avoid, with the substring-shield subtlety
  assert('term: キャディー (correct) → 0', errsFrom('ja', 'キャディー', checkTerminology) === 0)
  assert('term: キャディーフィー (compound) → 0', errsFrom('ja', 'キャディーフィー', checkTerminology) === 0)
  assert('term: キャディ (bare avoid) → 1', errsFrom('ja', 'キャディ', checkTerminology) === 1)
  assert('term: キャディフィー (missing ー) → 1', errsFrom('ja', 'キャディフィー', checkTerminology) === 1)
  assert('term ko: 드라이빙레인지 (closed avoid) → 1', errsFrom('ko', '드라이빙레인지', checkTerminology) === 1)
  assert('term ko: 드라이빙 레인지 (spaced use) → 0', errsFrom('ko', '드라이빙 레인지', checkTerminology) === 0)
  assert('term zh: 球僮 (avoid caddie) → 1', errsFrom('zh', '球僮费', checkTerminology) === 1)

  // Check 5 — brand mangle, plus the @lengolf / len.golf false-positive guards
  assert('brand: "Lengolf" (mangled) → 1', errsFrom('ja', 'Lengolf のベイ', checkBrands) === 1)
  assert('brand: "LENGOLF" (correct) → 0', errsFrom('ja', 'LENGOLF のベイ', checkBrands) === 0)
  assert('brand: "@lengolf" (LINE handle) → 0', errsFrom('ja', 'LINE @lengolf で予約', checkBrands) === 0)
  assert('brand: "booking.len.golf" → 0', errsFrom('ja', 'booking.len.golf から', checkBrands) === 0)
  assert('brand: "bts" (lowercase) → 1', errsFrom('ko', 'bts 칫롬역', checkBrands) === 1)

  // Check 6 — markdown bold + placeholder integrity
  assert('markup: odd ** → 1', errsFrom('ja', '**太字が閉じない', checkMarkup) === 1)
  assert('markup: balanced ** → 0', errsFrom('ja', '**太字**は正常', checkMarkup) === 0)
  // checkMarkup takes a dialect; errsFrom passes one arg, so bind each side.
  const asToken = (u: Unit) => checkMarkup(u, 'token')
  const asIcu = (u: Unit) => checkMarkup(u, 'icu')

  // '{{token}}' dialect (content data) — BOTH the depth-scan and the bigram
  // equality apply, so one malformed string can legitimately raise two errors
  // (one per rule). Counts below are exact and each label says which rules fire.
  assert('markup: complete {{token}} → 0', errsFrom('ja', '{{price}} は有効', asToken) === 0)
  assert('markup: lone {{ → 2 (unclosed + bigram)', errsFrom('ja', '{{price のみ', asToken) === 2)
  assert('markup: half-closed {{token} → 2 (unclosed + bigram)', errsFrom('ja', '{{price} は無効', asToken) === 2)
  assert('markup: stray } → 1 (depth-scan)', errsFrom('ja', '閉じ括弧 } だけ', asToken) === 1)
  // Bigram-EQUAL but structurally broken — the OLD counter passed this 1-for-1
  // (indicesOf counts overlapping bigrams). Only the depth-scan catches it,
  // and it reports both halves: the stray '}' and the unclosed '{'.
  assert('markup: }}{{ → 2 (stray + unclosed; old counter passed it)', errsFrom('ja', '}}{{', asToken) === 2)
  // Brace-BALANCED but the closer is split — the depth-scan passes these, so
  // only the bigram rule catches them. This is the load-bearing-space shape:
  // lib/site-facts.ts's /\{\{\s*(\w+)\s*\}\}/g misses it, replace() no-ops, and
  // the raw token ships to visitors without throwing. Deleting rule (b)
  // silently regresses exactly this.
  assert('markup: split closer {{token} } → 1 (bigram only)', errsFrom('ja', '{{price} } は無効', asToken) === 1)
  assert('markup: split closer {{a} b} → 1 (bigram only)', errsFrom('ja', '{{price} テキスト}', asToken) === 1)
  // Two independent defects in one string report together, not one per CI run.
  assert('markup: stray } AND unclosed {{ → 3', errsFrom('ja', '} だけ、そして {{price', asToken) === 3)

  // ICU dialect (messages/*.json) — depth-scan only. The plural's tail '}}'
  // has no matching '{{'; this is the false positive that forced the
  // load-bearing-space workaround, and it must NOT fire.
  assert(
    'markup: ICU plural → 0',
    errsFrom('ja', '{count, plural, =1 {1か所} other {# か所}}のコース', asIcu) === 0
  )
  assert(
    'markup: ICU plural with nested arg → 0',
    errsFrom('th', '{count, plural, =1 {สนาม # ใน{label}} other {ครบทั้ง # ใน{label}}}', asIcu) === 0
  )
  assert(
    'markup: ICU plural missing final brace → 1',
    errsFrom('ja', '{count, plural, =1 {1か所} other {# か所}', asIcu) === 1
  )
  // The same ICU string under the 'token' dialect WOULD trip the bigram rule —
  // proving the scoping is what makes ICU legal, not a weakened depth-scan.
  assert(
    'markup: ICU under token dialect → 1 (scoping is load-bearing)',
    errsFrom('ja', '{count, plural, =1 {1か所} other {# か所}}', asToken) === 1
  )

  // Dialect DISPATCH — the corpus loop's `entry.uiChrome ? 'icu' : 'token'`.
  //
  // The checkMarkup assertions above bind the dialect by hand (asToken/asIcu),
  // so they prove both rule sets work while proving nothing about which one a
  // real entry receives. Collapsing that ternary to a constant 'icu' drops rule
  // (b) for all 500 content entries — the `{{token} }` split-closer that ships
  // a raw token to visitors — and left BOTH `npm run validate:i18n` and this
  // self-test green until these ran through runCorpusChecks() itself.
  const corpusErrs = (entry: Entry): number => {
    const before = issues.length
    runCorpusChecks([entry])
    return issues.splice(before).filter((i) => i.level === 'error').length
  }
  const entryWith = (value: string, uiChrome?: true): Entry => ({
    entryId: '__test__',
    locale: 'ja' as Locale,
    units: [{ locale: 'ja' as Locale, entryId: '__test__', field: '__test__', value }],
    ...(uiChrome ? { uiChrome } : {}),
  })
  assert(
    'dispatch: content entry gets the token dialect ({{price} } → 1)',
    corpusErrs(entryWith('{{price} } は無効')) === 1
  )
  assert(
    'dispatch: uiChrome entry gets the ICU dialect (plural → 0)',
    corpusErrs(entryWith('{count, plural, =1 {1か所} other {# か所}}のコース', true)) === 0
  )
  // The pair is load-bearing in BOTH directions: a constant 'token' would make
  // every messages/*.json plural a false error, which is the false positive
  // the dialect split was introduced to avoid.
  assert(
    'dispatch: content entry still sees a real ICU-shaped break ({{price} → 2)',
    corpusErrs(entryWith('{{price のみ')) === 2
  )

  // TH as-of marker must not match the tail of ประมาณ ("approximately") or a
  // bare prepositional ณ — only the glossary's dated ข้อมูล ณ form counts.
  assert('as-of th: ประมาณ 500 บาท does not shield', !AS_OF_MARKERS.th.some((m) => 'ราคาโดยทั่วไปเริ่มต้นประมาณ 500 บาท'.includes(m)))
  assert('as-of th: bare ณ จังหวะ does not shield', !AS_OF_MARKERS.th.some((m) => 'ทำอะไรบ้าง ณ จังหวะปะทะลูก'.includes(m)))
  assert('as-of th: (ข้อมูล ณ กรกฎาคม 2026) shields', AS_OF_MARKERS.th.some((m) => '(ข้อมูล ณ กรกฎาคม 2026)'.includes(m)))

  // ── Check 6b: locale slot holds the locale's own language ─────────────────
  // The defect: a Simplified Chinese paragraph was written into a price tier's
  // `th` slot and served on an indexed page. Every other ERROR check passed it
  // — the string is well-formed Chinese. Both directions are asserted, because
  // the two rules cover different pairs and each is individually removable.
  const scriptErrs = (locale: Locale, value: string): number => {
    const before = issues.length
    checkScript({ locale, entryId: '__test__', field: '__test__', value })
    return issues.splice(before).filter((i) => i.level === 'error').length
  }
  const ZH_PARA =
    '价格在高峰期常上涨30–40%：多数球场是周末，按季节定价的球场则是旺季。所以在这个价位段，日期能否灵活安排，差别不小。'
  const TH_PARA =
    'ราคามักปรับขึ้น 30-40% ในช่วงพีค โดยสนามส่วนใหญ่ในกลุ่มนี้คือช่วงวันหยุดสุดสัปดาห์ ส่วนสนามที่คิดราคาตามฤดูกาลจะเป็นช่วงไฮซีซัน'
  const JA_PARA =
    'ピーク時には料金が30〜40%上がることが多く、この価格帯では多くのコースで週末が、シーズンで料金が変わるコースではハイシーズンがそれにあたります。'

  // Rule (a), dominance — the exact historical defect and its mirror.
  assert('script: zh paragraph in th slot → 1', scriptErrs('th', ZH_PARA) === 1)
  assert('script: th paragraph in zh slot → 1', scriptErrs('zh', TH_PARA) === 1)
  assert('script: ja paragraph in th slot → 1', scriptErrs('th', JA_PARA) === 1)
  assert('script: correct copy in its own slot → 0', scriptErrs('th', TH_PARA) === 0)
  assert('script: ja copy in ja slot → 0', scriptErrs('ja', JA_PARA) === 0)
  assert('script: zh copy in zh slot → 0', scriptErrs('zh', ZH_PARA) === 0)

  // Rule (b), ja kana requirement. Dominance is BLIND to this pair — Han is
  // legal in Japanese, so a Chinese paragraph in a ja slot scores 100% "own".
  // Deleting rule (b) leaves every other assertion here green.
  assert('script: zh paragraph in ja slot → 1 (kana rule, not dominance)', scriptErrs('ja', ZH_PARA) === 1)

  // The false positives that a naive "contains a foreign script" rule produced.
  // All are real, correct strings from this repo; all 11 fired before the
  // dominance ratio. If any of these starts erroring, the gate is about to be
  // switched off by whoever hits it.
  assert(
    'script: ja copy quoting a Thai address stays clean (grabTip)',
    scriptErrs(
      'ja',
      'Grabやタクシーでお越しの場合は、ドライバーに「The Mercury Ville, Chidlom」（เดอะ เมอร์คิวรี่ วิลล์ ชิดลม）とお伝えください。'
    ) === 0
  )
  // VERBATIM from data/faq-hub.ts — not a synthetic approximation. An invented
  // shorter version of this line DID fail this assertion, which is the useful
  // signal here: Chinese is dense enough that a quoted 25-character Thai
  // address can outnumber the Han around it, and the real string clears the 2x
  // ratio with a thin margin (25 thai vs 22 han). Tightening the ratio, or
  // shortening this line in faq-hub, turns correct copy red. Keep them in sync.
  assert(
    'script: zh copy quoting a Thai address stays clean (verbatim faq-hub grabTip)',
    scriptErrs(
      'zh',
      '坐Grab或出租车过来？告诉司机“The Mercury Ville, Chidlom”（เดอะ เมอร์คิวรี่ วิลล์ ชิดลม）。下车点在Ploenchit路的商场入口处。'
    ) === 0
  )
  assert(
    'script: th copy quoting the Korean term 스크린골프 stays clean',
    scriptErrs(
      'th',
      'กอล์ฟจำลองในร่มที่คนเกาหลีเรียกว่า 스크린골프 กำลังได้รับความนิยมในกรุงเทพฯ อย่างรวดเร็วในช่วงไม่กี่ปีที่ผ่านมา'
    ) === 0
  )
  assert('script: 한국어 as the ja language-switcher label stays clean', scriptErrs('ja', '한국어') === 0)
  assert('script: all-kanji ja hours line stays clean', scriptErrs('ja', '毎日午前9時〜午後11時営業') === 0)
  assert('script: all-kanji ja rate note stays clean', scriptErrs('ja', '平日 = 月〜木、週末 = 金〜日') === 0)
  assert('script: en is exempt', scriptErrs('en' as Locale, 'Weekday green fee') === 0)

  // Corpus coverage — each source file actually contributes entries, so a
  // future filter/import regression can't silently shrink the lint surface.
  // 'exp-' only: data/faq-pages.ts also carries gg-prefixed ids, which would
  // keep a gg- check green even if the explainer import/loop regressed.
  assert('corpus: explainer entries present', entries.some((e) => e.entryId.startsWith('exp-')))
  assert('corpus: region-hub entries present', entries.some((e) => e.entryId.startsWith('hub:')))
  assert('corpus: FAQ entries present', entries.some((e) => e.entryId.startsWith('faq-')))
  // Added with the faq-hub corpus: the filter above is a regex, and a
  // broadened one would drop all of its units while every other check
  // still passed. Same failure shape the sibling asserts guard.
  assert(
    'corpus: faq-hub entries present',
    LOCALES.every((l) => entries.some((e) => e.entryId === `faqhub:${l}` && e.units.length > 0))
  )
  assert('corpus: price-tier entries present', entries.some((e) => e.entryId.startsWith('tier:')))

  // Checks 10/11 — UI-message namespace parity, on synthetic catalogs
  const parityIssues = (
    cats: Record<'en' | Locale, MessageCatalog>,
    ns: Record<string, Locale[]>
  ): Issue[] => {
    const before = issues.length
    checkNamespaceParity(cats, ns)
    return issues.splice(before)
  }
  const synth = (ja: MessageCatalog): Record<'en' | Locale, MessageCatalog> => ({
    en: { NS: { a: 'x', nested: { b: 'y' } } },
    ja,
    ko: { NS: { a: 'x', nested: { b: 'y' } } },
    zh: { NS: { a: 'x', nested: { b: 'y' } } },
    th: { NS: { a: 'x', nested: { b: 'y' } } },
  })
  assert(
    'ui-ns: flattenKeys nests to dot paths',
    JSON.stringify(flattenKeys({ a: 'x', nested: { b: 'y' } })) === '["a","nested.b"]'
  )
  assert(
    'ui-ns: namespace missing entirely → 1 error',
    parityIssues(synth({}), { NS: ['ja'] }).filter((i) => i.level === 'error').length === 1
  )
  {
    const got = parityIssues(synth({ NS: { a: 'x', nested: {} } }), { NS: ['ja'] })
    assert('ui-ns: key gap → 1 warn, 0 errors',
      got.filter((i) => i.level === 'warn').length === 1 &&
      got.filter((i) => i.level === 'error').length === 0)
  }
  assert(
    'ui-ns: full parity → 0 issues',
    parityIssues(synth({ NS: { a: 'x', nested: { b: 'y' } } }), { NS: ['ja'] }).length === 0
  )
  assert(
    'ui-ns: allowlist typo (ns absent from en) → 1 error',
    parityIssues(synth({}), { Typo: ['ja'] }).filter((i) => i.level === 'error').length === 1
  )
  assert(
    'ui-ns: registry resolves 0 locales → 1 error',
    parityIssues(synth({ NS: { a: 'x', nested: { b: 'y' } } }), { NS: [] })
      .filter((i) => i.level === 'error').length === 1
  )
  // Config guards — the allowlist stays real and the registry keeps feeding it.
  assert(
    'ui-ns: every allowlisted namespace exists in messages/en.json',
    Object.keys(SSG_UI_NAMESPACES).every((ns) => ns in uiCatalogs.en)
  )
  assert(
    'ui-ns: every allowlisted namespace resolves ≥1 SSG locale',
    Object.values(SSG_UI_NAMESPACES).every((ls) => ls.length > 0)
  )
  // The PR #78 regression class: GolfCourseShared must be checked for ja/ko/zh.
  assert(
    'ui-ns: GolfCourseShared covers ja/ko/zh',
    (['ja', 'ko', 'zh'] as Locale[]).every((l) => SSG_UI_NAMESPACES.GolfCourseShared.includes(l))
  )

  // The messages/*.json corpus must actually be loaded. Without this, a bad
  // catalog path or an empty parse would silently shrink the corpus to zero and
  // the run would still go green — the failure mode this whole block exists to
  // prevent.
  assert(
    'ui-chrome: messages corpus non-empty for every locale',
    LOCALES.every((l) => entries.some((e) => e.uiChrome && e.locale === l && e.units.length > 0))
  )

  // Checks 1-3 — regex-level detectors. These run through emojiHit(), the
  // function the check actually calls, not EMOJI_RE directly — the allowlist
  // subtraction lives in the function, so asserting on the bare regex would
  // prove nothing about real behaviour.
  assert('emoji: golf pictograph matches', emojiHit('⛳') !== null)
  assert('emoji: party pictograph matches', emojiHit('🎉') !== null)
  assert('emoji: plain punctuation ignored', emojiHit('○×—〜–') === null)
  // Allowlist: a legal mark identical in the English source, and the trust-chip
  // rating glyph. Both were false-flagged before the messages corpus landed.
  assert('emoji: (c) (r) tm star allowlisted', emojiHit('© ® ™ ★') === null)
  // Negative space — the direction a narrowed property test would have broken.
  // Every one of these defaults to TEXT presentation, so \p{Emoji_Presentation}
  // alone would let them through; they are still decoration and must fail.
  assert(
    'emoji: bare text-presentation pictographs still match',
    ['❤', '⚠', '➡', '✔', '✈', '☀'].every((c) => emojiHit(c) !== null)
  )
  // Regional-indicator flags are NOT Extended_Pictographic; the pre-existing
  // check missed them entirely and the Emoji_Presentation alternative adds them.
  assert('emoji: regional-indicator flag matches', emojiHit('🇯🇵') !== null)
  assert('exclamation: ！ matches', EXCL_RE.test('すごい！'))
  assert('fullwidth digit: ５ matches', FULLWIDTH_DIGIT_RE.test('料金は５00'))
  assert('fullwidth digit: half-width ignored', !FULLWIDTH_DIGIT_RE.test('料金は500'))

  console.log(ok ? '\nALL SELF-TESTS PASS' : '\nSELF-TEST FAILURES')
  process.exit(ok ? 0 : 1)
}

// ── Report ──────────────────────────────────────────────────────────────────
const errors = issues.filter((i) => i.level === 'error')
const warns = issues.filter((i) => i.level === 'warn')

if (warns.length > 0) {
  console.log(`ℹ️  validate-i18n: ${warns.length} warning(s) (non-blocking):\n`)
  for (const w of warns) {
    const tag = w.check === 'review' ? '⚠ review' : '⚠'
    console.log(`  ${tag} [${w.locale}:${w.entryId}] ${w.field} (${w.check}): ${w.detail}`)
  }
  console.log('')
}

if (errors.length === 0) {
  console.log(
    `✅ validate-i18n: ${entries.length} localized entries pass all house-style/honesty ERROR checks, ` +
      `${Object.keys(SSG_UI_NAMESPACES).length} UI namespaces at parity` +
      (warns.length ? ` (${warns.length} warning(s) above are non-blocking)` : '')
  )
  process.exit(0)
}

console.error(`❌ validate-i18n: ${errors.length} blocking i18n issue(s):\n`)
for (const e of errors) {
  console.error(`  • [${e.locale}:${e.entryId}] ${e.field} (${e.check}): ${e.detail}`)
}
console.error(
  '\nFix: align the content with data/i18n-glossary/' +
    '<locale>.json (terminology.use forms, brand_immutable casing, no emoji/！,' +
    ' half-width digits) — see docs/i18n-review-checklist.md.' +
    ' For ui-namespace errors, translate the namespace into messages/<locale>.json' +
    ' (key set mirrors messages/en.json).'
)
process.exit(1)
