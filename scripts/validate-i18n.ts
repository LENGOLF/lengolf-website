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
 *   - data/rental-agreement/    — the course club rental agreement per locale
 *   - data/junior-academy.ts    — /junior-golf-academy/ copy (th; raw per-locale map)
 * Every module in that list is a plain data module — none imports lib/pricing.
 *
 * This paragraph used to justify an import that no longer exists: it said
 * data/faq-pages.ts imports lib/pricing at module level, and argued that was
 * tsx-safe because lib/pricing's React `cache` call falls back to identity
 * outside the RSC runtime. PR #127 deleted the three dead pricing getters in
 * data/faq-pages.ts, and with them that import. The reasoning was sound and is
 * simply no longer needed here; if a future corpus member does import
 * lib/pricing, it still holds (see the comment in lib/pricing.ts).
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
 *  12. Rental agreement (data/rental-agreement/): a locale registered for
 *      the route with no text, or text for an unregistered locale; or a
 *      translation that lacks the English-prevails notice, diverges from EN
 *      in structure (paragraph, section, clause and ** counts, and the numbers
 *      in intro, closing and each section), has a date line that is not the
 *      agreement date as that locale writes it, or carries a blank string, a
 *      string with none of its own script, or an em dash. EN's date line is
 *      checked against the version too.
 *  13. Junior Academy (data/junior-academy.ts): a locale registered for the
 *      route with no block, or a block for an unregistered locale; a prose
 *      leaf that is blank (whitespace, invisible characters or combining
 *      marks only), or that carries none of the locale's own script (marks
 *      not counted) unless JUNIOR_ACADEMY_SCRIPTLESS lists its path AND its
 *      value equals EN's there (12(d)'s rule, without 12(d)'s em-dash check);
 *      an entry in that allowlist that no longer names a script-less prose
 *      leaf; a prose path the block has and EN lacks, or the reverse (a list
 *      of a different length); a bidi control or U+FFFD in any leaf; or a
 *      block the rule never judged (a skipped or deleted call). The EN block
 *      gets the blank and bidi/U+FFFD rules too, and its price.amount must
 *      equal JUNIOR_ACADEMY_PRICE_THB as en-US writes it; a locale's
 *      price.amount written in its own script must carry the same digits.
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
import type { GolfCourse, GolfCourseProse } from '@/types/golf-courses'
import { faqPages } from '@/data/faq-pages'
import { PRICE_TIER_I18N } from '@/data/price-tiers'
import { getFaqHubContent } from '@/data/faq-hub'
import { JUNIOR_ACADEMY_CONTENT, JUNIOR_ACADEMY_PATH, JUNIOR_ACADEMY_PRICE_THB } from '@/data/junior-academy'
import { priceGuidePages } from '@/data/price-guide-pages'
import { activityOccasionPages } from '@/data/activity-occasions'
import { bestOfListiclePages } from '@/data/best-of-listicle-pages'
import { hotelConciergePages } from '@/data/hotel-pages'
import { RENTAL_AGREEMENT, RENTAL_AGREEMENT_PATH, RENTAL_AGREEMENT_VERSION } from '@/data/rental-agreement'
import type { RentalAgreementContent, RentalAgreementSection } from '@/data/rental-agreement'
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
//
// th is DELIBERATELY absent, and the omission is not the tone filter's doing:
// data/i18n-glossary/th.json states "No exclamation marks. No emoji." verbatim,
// so seeding th here would admit it. Measured on PR #96: doing so turns 23
// pre-existing messages/th.json strings red — ContactForm.thankYou, Blog.ctaTitle,
// and ~20 FAQ answers — where "!" is idiomatic Thai marketing register. ZERO
// course/guide prose entries fail, so the content corpus is already compliant.
// Widening this is therefore a copy decision (should Thai UI microcopy drop its
// exclamation marks?) that needs native QA, not a linter change. Until that is
// settled, Thai emoji/exclamation is ungated — do not read a green run as proof.
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

// At least one character of the locale's own script: a string with none has
// not been translated. Check 12(d) (rental agreement) applies it to every
// string; the junior-academy leaf rule below applies it outside an allowlist of
// names and numerals.
const NATIVE_SCRIPT: Record<Locale, RegExp> = {
  th: /\p{Script=Thai}/u,
  ja: /\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Han}/u,
  ko: /\p{Script=Hangul}/u,
  zh: /\p{Script=Han}/u,
}

// data/junior-academy.ts — /junior-golf-academy/ (EN + TH). Reads the RAW
// per-locale map, never getJuniorAcademyContent(): that getter falls back to
// EN, and checkScript ignores Latin, so an EN fallback in a th slot would lint
// clean. A registered locale with no block would render EN under /th/, and a
// block for an unregistered locale is unreachable, so both are ERRORs.
// URLs (faqLinks, related hrefs) are not prose and are filtered out.
//
// Reading the raw map was not enough on its own: checkScript ignores Latin
// leaf by leaf too, so ONE English string pasted into a th leaf (answer:
// '1 year.') linted clean, and so did a whitespace-only leaf (PR #158's body
// records the English case as a follow-up; both were re-measured on main
// before this rule: exit 0 from the gate and from --self-test).
// checkJuniorAcademyLeaves() applies check 12(d)'s rule, minus its em-dash
// check, to every prose leaf: non-blank, and at least one character of the
// locale's own script, except the leaves allowlisted below. The rental
// agreement and course-detail locales (validate:course-slots) have an
// equivalent of that rule, but not of the additions below (12(d) still uses
// trim() and counts a lone Thai mark as Thai); faq-hub, messages/*.json and the
// other corpora that rely on checkScript alone have neither, so an English or
// blank string there still passes. It also ignores combining marks, holds each
// block's prose paths equal to EN's, and rejects bidi controls and U+FFFD in
// every leaf. checkJuniorAcademyEnLeaves() gives the EN block the blank and
// forbidden-character rules and ties its price.amount to
// JUNIOR_ACADEMY_PRICE_THB.
const JUNIOR_NON_PROSE_RE = /^faqLinks\.|\.href$|^listSeparator$/

/**
 * What a leaf shows on screen: the value without whitespace, format characters
 * (\p{Cf}) or combining marks (\p{M}). Format characters because trim() strips
 * a BOM but keeps a zero-width space or a word joiner. Combining marks because
 * a Thai tone mark is Script=Thai: on its own it passed as a translated leaf,
 * and appended to an English sentence it passed the own-script test (both
 * measured against the rule before this change). A Thai word always keeps its
 * consonants, so real Thai is unaffected.
 */
function juniorVisible(value: string): string {
  return value.replace(/[\s\p{Cf}\p{M}]/gu, '')
}

/**
 * Characters no junior leaf may carry, even inside real text, and the URLs,
 * faqLinks keys and listSeparator included (the separator is joined into the
 * Course node's offer description): the bidi embedding, override and isolate
 * controls (U+202A to U+202E, U+2066 to U+2069), which reorder what is
 * displayed without showing themselves, and the replacement character
 * (U+FFFD), which is encoding damage. Neither blank test can see them once a
 * leaf has visible text. The no-break spaces and word joiner Thai needs are
 * added at render time, so they are not data.
 */
const JUNIOR_FORBIDDEN_CHAR_RE = /[\u202A-\u202E\u2066-\u2069\uFFFD]/u
const JUNIOR_BLANK_MSG =
  'blank string (whitespace, invisible characters or combining marks only): the page ships it empty, or as a stray mark'
/** Names the first offending character and where it is, so an editor can find an invisible one. */
function juniorForbiddenMsg(value: string): string {
  const m = JUNIOR_FORBIDDEN_CHAR_RE.exec(value)
  const at = m ? ` (U+${m[0].codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')} at index ${m.index})` : ''
  return `carries a bidi control (U+202A to U+202E, U+2066 to U+2069) or the replacement character (U+FFFD)${at}: it reorders or garbles the text on screen. Retype the line`
}
/**
 * The price as digits: Thai digits mapped to ASCII, everything else dropped,
 * so '16,900', '16,900 บาท' and '๑๖,๙๐๐' all read 16900.
 */
function juniorPriceDigits(value: string): string {
  return value.replace(/[๐-๙]/g, (d) => String(d.charCodeAt(0) - 0x0e50)).replace(/[^0-9]/g, '')
}
const JUNIOR_PRICE_MSG = 'is not JUNIOR_ACADEMY_PRICE_THB'

/**
 * Prose leaves that are legitimately script-less in a locale, keyed by field
 * path: the program's name and its level badges, which the page prints in
 * Latin in every locale, and the price numeral. Derived on 2026-10-13 by
 * flattening the th block and listing every prose leaf with no Thai, and kept
 * that way by the rule in both directions: a script-less leaf missing from
 * this list is an ERROR, and so is an entry that no longer names a script-less
 * prose leaf (renamed, removed, or translated since), because an unused
 * exemption would let a future English paste into that leaf through.
 *
 * An exempt leaf must also EQUAL the EN block's value at the same path (all
 * five do), so the exemption covers the shared name or numeral and nothing
 * else. One consequence: changing one of these five in EN (a new price, a
 * renamed badge) turns the gate red until th is changed to match. For the
 * price that is the sync data/junior-academy.ts's docblock already asks for;
 * for the name and the badges it is a coupling this rule adds.
 */
const JUNIOR_ACADEMY_SCRIPTLESS: Partial<Record<Locale, readonly string[]>> = {
  th: [
    'breadcrumb.self', // Junior Academy
    'journey.milestones[0].badge', // LEVEL 1
    'journey.milestones[1].badge', // LEVEL 2
    'price.amount', // 16,900
    'course.name', // LENGOLF Junior Academy
  ],
}

/**
 * Counted at the top of checkJuniorAcademyLeaves() and compared after the loop
 * against the blocks that exist, so a deleted call, a `continue` above it or a
 * narrowed loop is an ERROR rather than a silently unjudged block.
 */
let juniorLeafJudgeCalls = 0
/**
 * Check 12(d)'s rule on one JuniorAcademyContent block. Reports through add().
 * `exempt` and `en` default to the real allowlist and EN block; --self-test
 * passes its own allowlist to reach the stale-entry branch without editing
 * the data.
 */
function checkJuniorAcademyLeaves(
  locale: Locale,
  entryId: string,
  content: unknown,
  exempt: readonly string[] = JUNIOR_ACADEMY_SCRIPTLESS[locale] ?? [],
  en: unknown = JUNIOR_ACADEMY_CONTENT.en,
  priceThb: number = JUNIOR_ACADEMY_PRICE_THB
): void {
  juniorLeafJudgeCalls++
  // agreementStrings, not flattenMessages: the latter drops '' leaves, so no
  // per-leaf rule would see them.
  const leaves: Array<[string, string]> = []
  agreementStrings(content, '', leaves)
  const enLeaves: Array<[string, string]> = []
  agreementStrings(en, '', enLeaves)
  const enAt = new Map(enLeaves)
  // With no EN block there is nothing to compare paths or values against;
  // checkJuniorAcademyEnLeaves() reports the missing block once.
  const hasEn = enLeaves.length > 0
  const enProse = new Set(enLeaves.map(([field]) => field).filter((field) => !JUNIOR_NON_PROSE_RE.test(field)))
  const clip = (s: string) => (s.length > 60 ? `${s.slice(0, 57)}...` : s)
  const prose = new Set<string>()
  const native = new Set<string>()
  for (const [field, value] of leaves) {
    if (JUNIOR_NON_PROSE_RE.test(field)) {
      if (JUNIOR_FORBIDDEN_CHAR_RE.test(value)) add('error', locale, entryId, field, 'junior-academy', juniorForbiddenMsg(value))
      continue
    }
    prose.add(field)
    const visible = juniorVisible(value)
    // Independent of the script verdict below; a leaf that is blank apart from
    // a bidi control is reported once, as blank.
    if (visible !== '' && JUNIOR_FORBIDDEN_CHAR_RE.test(value)) {
      add('error', locale, entryId, field, 'junior-academy', juniorForbiddenMsg(value))
    }
    if (visible === '') {
      add('error', locale, entryId, field, 'junior-academy', JUNIOR_BLANK_MSG)
    } else if (NATIVE_SCRIPT[locale].test(visible)) {
      native.add(field)
      // A price written with the locale's own script ('16,900 บาท', Thai
      // digits) leaves the allowlist, and with it the EN-equality that held
      // it to EN's: tie it to the constant directly.
      if (field === 'price.amount' && juniorPriceDigits(value) !== String(priceThb)) {
        add('error', locale, entryId, field, 'junior-academy',
          `"${clip(value)}" ${JUNIOR_PRICE_MSG} (${priceThb}): the ${locale} price card prints price.amount, the Course node's Offer.price prints the constant. Change them together`)
      }
    } else if (!exempt.includes(field)) {
      add('error', locale, entryId, field, 'junior-academy',
        enProse.has(field) || !hasEn
          ? `no ${locale} script at all ("${clip(value)}"): untranslated? A name or numeral the page prints in every locale goes in JUNIOR_ACADEMY_SCRIPTLESS (scripts/validate-i18n.ts)`
          : `no ${locale} script at all ("${clip(value)}"), on a line EN does not have (see the path error for this field): fix the list before considering JUNIOR_ACADEMY_SCRIPTLESS`)
    } else if (hasEn && value !== enAt.get(field)) {
      // The exemption is for a name or numeral shared with EN, so the value
      // must BE EN's: otherwise any Latin text (an English sentence, "Contact
      // us" in the price, a braille blank) would pass through the five paths.
      add('error', locale, entryId, field, 'junior-academy',
        `exempt from the script rule, so it must equal EN's value at this path ("${clip(enAt.get(field) ?? '(no EN leaf)')}"), not "${clip(value)}": copy EN's value, or translate it and remove the exemption`)
    }
  }
  for (const field of exempt) {
    // An entry whose line went missing from this block while EN still has it
    // is the path error below, not a stale entry: removing the entry, as a
    // stale message would advise, turns the restored line red again.
    if (!prose.has(field)) {
      if (!enProse.has(field)) {
        add('error', locale, entryId, field, 'junior-academy',
          `listed in JUNIOR_ACADEMY_SCRIPTLESS but not a prose leaf of the ${locale} block (renamed or removed?): remove the stale entry`)
      }
    } else if (native.has(field)) {
      add('error', locale, entryId, field, 'junior-academy',
        `listed in JUNIOR_ACADEMY_SCRIPTLESS but now carries ${locale} script: remove the unused exemption` +
          (field === 'price.amount' ? ' (the price stays tied to JUNIOR_ACADEMY_PRICE_THB)' : ''))
    }
  }
  if (!hasEn) return
  // Path parity with EN. Both blocks share one interface, so their prose paths
  // can only differ where a list (items, steps, FAQ, transcript, skills) has a
  // different number of entries. A leaf COUNT cannot see that: a th block that
  // dropped the "a parent stays in the bay" safety line and duplicated another
  // list's item kept the counts equal and passed the gate (measured). The error
  // lands on the list's LAST index, which is not necessarily the line that went.
  // A line replaced by a copy of its neighbour in the SAME list, or two items
  // swapped, keeps every path and passes: that is native QA's to catch.
  for (const field of enProse) {
    if (!prose.has(field)) {
      add('error', locale, entryId, field, 'junior-academy',
        `EN has a line at this path and the ${locale} block does not: a list here is shorter than EN's, so the ${locale} page drops a line (not necessarily this last one)`)
    }
  }
  for (const field of prose) {
    if (!enProse.has(field)) {
      add('error', locale, entryId, field, 'junior-academy',
        `EN has no line at this path: a list here is longer than EN's (an extra or duplicated line, or a line EN removed)`)
    }
  }
}

/** Counted like juniorLeafJudgeCalls: the EN block must be judged exactly once. */
let juniorEnJudgeCalls = 0
/**
 * The EN block is outside the corpus (the glossaries are target-language), but
 * it renders /junior-golf-academy/, and each locale block's prose paths and its
 * allowlisted values are held to it, so its own leaves get the blank and
 * forbidden-character rules here. Before this, an EN leaf of '   ' or a lone
 * combining mark passed validate:i18n (the lone mark passed --self-test too;
 * '   ' failed it only incidentally, through #163's EN-paste sweep).
 *
 * It also ties the visible price to the constant. The price card, llms.txt and
 * llms-full.txt print price.amount; the Course node's Offer.price is
 * JUNIOR_ACADEMY_PRICE_THB. With EN and th price.amount both '17,900' against
 * a 16900 constant, validate:i18n and its --self-test passed while the card
 * and the JSON-LD disagreed (measured; smoke has no price assertion). th's
 * price.amount is held to EN's by the allowlist's EN-equality rule, and to the
 * constant directly once it carries Thai (checkJuniorAcademyLeaves). `priceThb`
 * defaults to the constant; --self-test passes another to reach the
 * constant-changed case without editing the data.
 */
function checkJuniorAcademyEnLeaves(en: unknown, priceThb: number = JUNIOR_ACADEMY_PRICE_THB): void {
  juniorEnJudgeCalls++
  if (!en || typeof en !== 'object') {
    add('error', 'en' as Locale, 'junior:en', '(block)', 'junior-academy',
      'data/junior-academy.ts has no EN block: /junior-golf-academy/ renders nothing to hold the other locales to')
    return
  }
  const leaves: Array<[string, string]> = []
  agreementStrings(en, '', leaves)
  for (const [field, value] of leaves) {
    if (JUNIOR_NON_PROSE_RE.test(field)) {
      if (JUNIOR_FORBIDDEN_CHAR_RE.test(value)) add('error', 'en' as Locale, 'junior:en', field, 'junior-academy', juniorForbiddenMsg(value))
      continue
    }
    if (juniorVisible(value) === '') {
      add('error', 'en' as Locale, 'junior:en', field, 'junior-academy', JUNIOR_BLANK_MSG)
    } else if (JUNIOR_FORBIDDEN_CHAR_RE.test(value)) {
      add('error', 'en' as Locale, 'junior:en', field, 'junior-academy', juniorForbiddenMsg(value))
    }
  }
  const want = new Intl.NumberFormat('en-US').format(priceThb)
  const amount = new Map(leaves).get('price.amount')
  if (amount !== want) {
    add('error', 'en' as Locale, 'junior:en', 'price.amount', 'junior-academy',
      `"${amount ?? '(missing)'}" ${JUNIOR_PRICE_MSG} (${priceThb}) as en-US writes it ("${want}"): the price card and the llms files print price.amount, the Course node's Offer.price prints the constant. Change them together`)
  }
}

checkJuniorAcademyEnLeaves(JUNIOR_ACADEMY_CONTENT.en)
for (const locale of LOCALES) {
  const entryId = `junior:${locale}`
  const content = JUNIOR_ACADEMY_CONTENT[locale]
  const registered = hasTranslationForLocale(locale, JUNIOR_ACADEMY_PATH)
  if (registered && !content) {
    add('error', locale, entryId, '(registry)', 'junior-academy',
      `${JUNIOR_ACADEMY_PATH} is registered for ${locale} but data/junior-academy.ts has no ${locale} block (the page renders English)`)
  }
  if (!content) continue
  if (!registered) {
    add('error', locale, entryId, '(registry)', 'junior-academy',
      `data/junior-academy.ts has a ${locale} block but ${JUNIOR_ACADEMY_PATH} is not registered for ${locale} (unreachable)`)
  }
  checkJuniorAcademyLeaves(locale, entryId, content)
  const units = juniorAcademyUnits(content).map(([field, value]) => ({ locale, entryId, field, value }))
  if (units.length > 0) entries.push({ entryId, locale, units })
}
{
  const blocks = LOCALES.filter((l) => JUNIOR_ACADEMY_CONTENT[l]).length
  if (juniorLeafJudgeCalls !== blocks) {
    add('error', 'th', 'junior:*', '(coverage)', 'junior-academy',
      `${juniorLeafJudgeCalls} of ${blocks} junior-academy blocks judged by checkJuniorAcademyLeaves(): a skip, a deleted call or a narrowed loop`)
  }
  if (juniorEnJudgeCalls !== 1) {
    add('error', 'en' as Locale, 'junior:en', '(coverage)', 'junior-academy',
      `the EN junior-academy block was judged ${juniorEnJudgeCalls} time(s) by checkJuniorAcademyEnLeaves(), not once: a deleted or repeated call`)
  }
}

/** The prose leaves of one JuniorAcademyContent block (URLs and the list separator are not prose). */
function juniorAcademyUnits(content: unknown): Array<[string, string]> {
  const leaves: Array<[string, string]> = []
  flattenMessages(content, '', leaves)
  return leaves.filter(([field]) => !JUNIOR_NON_PROSE_RE.test(field))
}

// data/rental-agreement/ — the Golf Course Club Rental Agreement. Legal text,
// so on top of the ordinary content checks it gets ERROR rules of its own
// (check 12), all computed by rentalAgreementProblems() below:
//   (a) registry agreement, BOTH directions: a locale registered for the route
//       with no agreement is a hard 404 behind its own hreflang (the page calls
//       notFound()), and an agreement for an unregistered locale is dead text
//       the middleware 301s away. Unlike faq-hub's `if (units.length > 0)`,
//       nothing here is skipped silently.
//   (b) structure parity against EN: the English-prevails notice, paragraph,
//       section, clause and `**` counts, and the numbers in intro, closing and
//       each section. In a contract a dropped bullet is a dropped term, and
//       none of checks 1-9 can see it: a translation missing its late-return
//       clause is fluent, emoji-free and correctly termed.
//   (c) the date line must contain the agreement date AS THAT LOCALE WRITES IT
//       (Intl, from RENTAL_AGREEMENT_VERSION). EN is checked too, since it is
//       the text booking-new stamps the version against. A digit multiset was
//       tried first and passed a swapped day/month, a wrong month name and a
//       dropped month.
//   (d) every string is non-blank, carries at least one character of the
//       locale's own script (an untranslated English clause has none), and has
//       no em dash (house style).
// Only `sourceVersion` is non-prose; every other leaf is copy.
const AGREEMENT_DATE_TAG: Record<'en' | Locale, string> = {
  en: 'en-GB',
  th: 'th-TH-u-ca-gregory', // Gregorian: Intl's th default is Buddhist-era 2569
  ja: 'ja-JP',
  ko: 'ko-KR',
  zh: 'zh-CN',
}

/** The agreement date as `locale` writes it, e.g. "7 August 2026", "2026年8月7日". */
function agreementDate(locale: 'en' | Locale): string {
  return new Intl.DateTimeFormat(AGREEMENT_DATE_TAG[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${RENTAL_AGREEMENT_VERSION}T00:00:00Z`))
}

/** Every string leaf with its path, blanks INCLUDED (flattenMessages drops them). */
function agreementStrings(node: unknown, path: string, out: Array<[string, string]>): void {
  if (typeof node === 'string') out.push([path, node])
  else if (Array.isArray(node)) node.forEach((v, i) => agreementStrings(v, `${path}[${i}]`, out))
  else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      agreementStrings(v, path ? `${path}.${k}` : k, out)
    }
  }
}

/** Check 12(c) for EN alone: its date line against the version. */
function rentalAgreementEnProblems(en: RentalAgreementContent): string[] {
  const want = agreementDate('en')
  return en.lastUpdated.includes(want)
    ? []
    : [`lastUpdated "${en.lastUpdated}" does not contain the agreement date "${want}" (RENTAL_AGREEMENT_VERSION ${RENTAL_AGREEMENT_VERSION})`]
}

/**
 * Every check-12 problem for one translation. Pure (inputs in, strings out), so
 * --self-test drives the SAME function the corpus loop does, registry branches
 * included. The first version self-tested a parity helper while the loop around
 * it went untested, and edits to that loop (deleting the call, comparing EN
 * with itself, a `continue` before add(), `if (false)` over a registry branch)
 * passed both steps with a real defect live.
 */
let agreementJudgeCalls = 0
function rentalAgreementProblems(
  locale: Locale,
  t: RentalAgreementContent | undefined,
  registered: boolean,
  en: RentalAgreementContent
): string[] {
  agreementJudgeCalls++
  if (!t) {
    return registered
      ? [`${RENTAL_AGREEMENT_PATH} is registered for ${locale} in lib/translated-routes.ts but data/rental-agreement has no ${locale} text (the page 404s)`]
      : []
  }
  const problems: string[] = []
  if (!registered) {
    problems.push(`data/rental-agreement has ${locale} text but ${RENTAL_AGREEMENT_PATH} is not registered for ${locale} in lib/translated-routes.ts (unreachable)`)
  }
  // Digit runs as a sorted multiset. Catches 24 -> 48 and a dropped "(see
  // Section 7)" cross-reference. A translation that legitimately needs an
  // extra digit must rephrase instead; there is deliberately no allowlist.
  const digits = (parts: readonly string[]) =>
    parts
      .flatMap((s) => s.match(/\d+/g) ?? [])
      .sort()
      .join(',')
  const bold = (parts: readonly string[]) =>
    parts.reduce((n, s) => n + (s.match(/\*\*/g) ?? []).length, 0)

  if (!t.notice) problems.push('notice: missing (translations must say the English version prevails)')
  const date = agreementDate(locale)
  if (!t.lastUpdated.includes(date)) {
    problems.push(`lastUpdated "${t.lastUpdated}" does not contain the agreement date as ${locale} writes it: "${date}"`)
  }
  for (const key of ['intro', 'closing'] as const) {
    if (t[key].length !== en[key].length) {
      problems.push(`${key}: ${t[key].length} paragraph(s), EN has ${en[key].length}`)
    } else if (digits(t[key]) !== digits(en[key])) {
      problems.push(`${key}: numbers [${digits(t[key])}] differ from EN [${digits(en[key])}]`)
    }
  }
  const leaves: Array<[string, string]> = []
  agreementStrings(t, '', leaves)
  for (const [field, value] of leaves) {
    if (field === 'sourceVersion') continue
    if (value.trim() === '') problems.push(`${field}: blank`)
    else if (!NATIVE_SCRIPT[locale].test(value)) problems.push(`${field}: no ${locale} script at all (untranslated?)`)
    if (value.includes('—')) problems.push(`${field}: em dash (house style forbids them)`)
  }
  if (t.sections.length !== en.sections.length) {
    problems.push(`sections: ${t.sections.length}, EN has ${en.sections.length}`)
    return problems
  }
  en.sections.forEach((es, i) => {
    const ts = t.sections[i]
    const at = `sections[${i}] (EN "${es.heading}")`
    for (const key of ['paragraphs', 'items'] as const) {
      const got = ts[key]?.length ?? 0
      const want = es[key]?.length ?? 0
      if (got !== want) problems.push(`${at}: ${got} ${key}, EN has ${want}`)
    }
    const tParts = [ts.heading, ...(ts.paragraphs ?? []), ...(ts.items ?? [])]
    const eParts = [es.heading, ...(es.paragraphs ?? []), ...(es.items ?? [])]
    if (bold(tParts) !== bold(eParts)) {
      problems.push(`${at}: ${bold(tParts)} "**" marker(s), EN has ${bold(eParts)}`)
    }
    if (digits(tParts) !== digits(eParts)) {
      problems.push(`${at}: numbers [${digits(tParts)}] differ from EN [${digits(eParts)}]`)
    }
  })
  return problems
}

// EN's date line. `add` is typed for the four target locales; EN is reported
// under its own entry id, which the report prints verbatim.
for (const problem of rentalAgreementEnProblems(RENTAL_AGREEMENT.en)) {
  add('error', 'en' as Locale, 'rental-agreement:en', 'lastUpdated', 'rental-agreement', problem)
}

// Two coverage assertions after the loop, because either half can be skipped
// alone. RENTAL_AGREEMENT is a Record over every locale (typecheck enforces
// it), so each of the four must be JUDGED (rentalAgreementProblems called) and
// LINTED (pushed into the corpus). A counter beside the push would stay at 4
// with the push deleted, so the second one counts the entries themselves.
// Measured before this existed: deleting the call, a `continue` above it, or
// narrowing the loop passed with a dropped clause live.
for (const locale of LOCALES) {
  const entryId = `rental-agreement:${locale}`
  const agreement = RENTAL_AGREEMENT[locale]
  const registered = hasTranslationForLocale(locale, RENTAL_AGREEMENT_PATH)
  for (const problem of rentalAgreementProblems(locale, agreement, registered, RENTAL_AGREEMENT.en)) {
    add('error', locale, entryId, '(structure)', 'rental-agreement', problem)
  }
  if (!agreement) continue
  const leaves: Array<[string, string]> = []
  flattenMessages(agreement, '', leaves)
  entries.push({
    entryId,
    locale,
    units: leaves
      .filter(([field]) => field !== 'sourceVersion')
      .map(([field, value]) => ({ locale, entryId, field, value })),
  })
}
{
  const linted = entries.filter((e) => e.entryId.startsWith('rental-agreement:')).length
  if (agreementJudgeCalls !== LOCALES.length || linted !== LOCALES.length) {
    add('error', 'th', 'rental-agreement:*', '(coverage)', 'rental-agreement',
      `${agreementJudgeCalls} of ${LOCALES.length} agreement translations judged and ${linted} linted: a skip, a deleted call or a narrowed loop`)
  }
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
/** Every field of GolfCourseProse. A registered locale ships all of them or none. */
const COURSE_PROSE_FIELDS = [
  'overview',
  'layout_and_experience',
  'tips',
  'location_and_access',
  'rental_cta_context',
] as const satisfies readonly (keyof GolfCourseProse)[]

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
      // A locale may ship title + meta_description with NO prose at all — that
      // is a supported state (SERP presence first, body later; CoursePage falls
      // back to course.prose per field). What is never intentional is a PARTIAL
      // prose block: it means a writer stopped midway. That case renders English
      // body text under localized chrome while hreflang advertises a full
      // translation. An OMITTED field is already a tsc error (GolfCourseProse
      // declares all five required), but tsc does not run in CI's lint job and
      // `satisfies` below does not force exhaustiveness, so this check earns its
      // keep on the cases tsc cannot see: an empty or whitespace-only value.
      // Nothing else catches those — the missing-BLOCK case is a hard 404 that
      // dynamicParams already gates, smoke L2 only asserts 200 + <main>, and
      // courseUnits() just yields fewer units, so a 3-of-5 block lints as three
      // clean fields. Found by adversarial review after a spend limit killed 7
      // builders mid-edit and left exactly this shape on disk.
      // The .trim() is load-bearing: CoursePage falls back with `??`, not `||`,
      // so a '   ' value BEATS the English fallback and renders an empty <p>
      // under a localized <h2>. A bare truthiness test passes it silently.
      if (isRegistered && l?.prose) {
        const missing = COURSE_PROSE_FIELDS.filter((f) => !l.prose?.[f]?.trim())
        if (missing.length > 0) {
          add('error', locale, entryId, 'locales', 'course-prose-partial',
            `locales.${locale}.prose is PARTIAL — missing ${missing.join(', ')}. Ship all ${COURSE_PROSE_FIELDS.length} prose fields or none at all; a partial block renders English body text under a localized title while hreflang advertises a full translation`)
        }
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
 * Which scripts count as "this locale's own". ja claims Han (kanji), which is
 * exactly why ja needs the separate kana rule. ko does NOT claim Han: modern
 * Korean copy on this site uses no hanja, and while ko counted Han as its own a
 * Chinese paragraph in a ko slot scored 100% "own" and passed. Measured when
 * ko dropped Han: zero new errors across the whole corpus.
 */
const LOCALE_OWN_SCRIPTS: Record<string, ScriptName[]> = {
  th: ['thai'],
  ja: ['kana', 'han'],
  ko: ['hangul'],
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
  // The club spec sheet (/golf-club-specs). Like `hub` above it is a single
  // static path with no registry helper, so its SSG locales come straight from
  // the route registry — currently en + th. Registered here so the next EN-only
  // key added to ClubSpecs fails CI instead of silently English-falling-back on
  // the Thai sheet.
  const clubSpecs = LOCALES.filter((l) => hasTranslationForLocale(l, '/golf-club-specs'))
  // The /lessons FAQ accordion. Registered because raising `FAQ_COUNT` in
  // app/[locale]/lessons/page.tsx was, until this entry existed, an entirely
  // UNOBSERVED operation: `faqItems` is Array.from({ length: FAQ_COUNT }) and
  // feeds BOTH the visible accordion and getFaqPageJsonLd, while
  // i18n/request.ts loads exactly one catalog with no EN merge — so a locale
  // missing the new key does NOT fall back to English. use-intl's
  // defaultGetMessageFallback returns the dotted path, so /ko/lessons/ renders
  // the literal string "LessonsFaq.q16" as an accordion question AND inside
  // FAQPage structured data. Nothing in smoke-test.ts asserts a lessons-FAQ
  // count, and this namespace was outside the allowlist, so that shipped green.
  //
  // BE PRECISE ABOUT WHAT THIS BUYS, because the first version of this comment
  // claimed it closed that hole and MEASUREMENT SAYS IT DOES NOT. Injection-
  // tested both ways on ko: deleting the whole `LessonsFaq` namespace is an
  // ERROR (exit 1); deleting just `q15` is a non-blocking WARN (`ui-key-gap`,
  // warnings 1095 -> 1096, exit 0). So the exact scenario above — one locale
  // short one key — still does not fail CI, and a single new line among 1095
  // standing warnings is easy to miss. This entry converts total silence into a
  // warning plus a hard error on the namespace, which is an improvement, not a
  // guard. Closing it properly needs either a smoke assertion on the rendered
  // accordion or promoting ui-key-gap to ERROR for FAQ_COUNT-driven namespaces,
  // where a missing key is a visible defect rather than an untranslated string.
  // (Note the WARN's own text says "English fallback at render", which is
  // wrong for the same no-EN-merge reason — pre-existing, not fixed here.)
  //
  // The same argument applies to every other FAQ_COUNT namespace; this is the
  // one the q15 batch exercised, so it is the one registered here rather than a
  // speculative sweep.
  const lessonsFaq = LOCALES.filter((l) => hasTranslationForLocale(l, '/lessons'))
  return {
    GolfCourseHub: hub,
    ClubSpecs: clubSpecs,
    LessonsFaq: lessonsFaq,
    GolfCourseRegion: regionHub,
    GolfCoursePriceTier: priceTier,
    // Course-detail pages (CoursePage/CourseFaq + the [slug] route) AND the
    // price-tier route, which pulls this namespace for the green-fee basis
    // labels it puts in its ItemList JSON-LD. Union, not `courseDetail` alone:
    // the two registries happen to hold the same locales today, so scoping this
    // narrowly would be coincidence rather than derivation — and the first tier
    // translation for a locale with no course-detail translation would SSG with
    // MISSING_MESSAGE and English Offer labels while this gate stayed green.
    GolfCourseDetail: LOCALES.filter(
      (l) => courseDetail.includes(l) || priceTier.includes(l)
    ),
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

/**
 * Nav and Footer render on EVERY page in every locale (the header and the
 * footer), and i18n/request.ts loads one catalog with no message fallback, so a
 * key missing from a locale prints its literal dotted path ("Nav.juniorAcademy")
 * site-wide. checkNamespaceParity only WARNs on a key gap, and neither namespace
 * is in SSG_UI_NAMESPACES, so deleting the footer's Junior Academy label from
 * ja.json went through every gate green (mutation-tested on PR #155). For these
 * two namespaces a gap is an ERROR. Both were at full key parity when this
 * landed, so it fires on nothing today.
 */
const SITE_CHROME_NAMESPACES = ['Nav', 'Footer'] as const
function siteChromeGaps(catalogs: Record<'en' | Locale, MessageCatalog>): Array<[Locale | 'en', string]> {
  const gaps: Array<[Locale | 'en', string]> = []
  for (const ns of SITE_CHROME_NAMESPACES) {
    const en = catalogs.en[ns]
    if (!en || typeof en !== 'object') {
      gaps.push(['en', ns])
      continue
    }
    const enKeys = flattenKeys(en)
    for (const locale of LOCALES) {
      const have = new Set(flattenKeys(catalogs[locale]?.[ns]))
      for (const key of enKeys) if (!have.has(key)) gaps.push([locale, `${ns}.${key}`])
    }
  }
  return gaps
}
for (const [locale, key] of siteChromeGaps(uiCatalogs)) {
  add('error', locale === 'en' ? 'th' : locale, `messages/${locale}.json`, key, 'ui-chrome-key-gap',
    locale === 'en'
      ? `site-chrome namespace "${key}" missing from messages/en.json, so nothing below it is checked`
      : `${key} is missing: every ${locale} page renders the literal key in its header or footer`)
}

// ── Optional self-test: drives every ERROR check through the real functions on
// synthetic inputs, proving each detector fires (and that correct forms don't).
// Run: npx tsx scripts/validate-i18n.ts --self-test
if (process.argv.includes('--self-test')) {
  let ok = true
  // Assertions EXECUTED. This block is a flat sequence with no array behind
  // it, so there was no count and no floor at all: deleting assert() lines
  // silently reduced coverage while it still printed ALL SELF-TESTS PASS.
  // Raise MIN_ASSERTIONS in the same commit that adds one; never lower it.
  const MIN_ASSERTIONS = 126
  let asserted = 0
  const assert = (label: string, cond: boolean) => {
    asserted++
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
  // Added with the junior-academy corpus. EXACT, not a floor: a floor of 20
  // stayed green when a widened field filter dropped the whole FAQ (24 of 122
  // units in #155's shape, 12 of 104 since the 2026-10-13 redesign: the ones
  // shipped as FAQPage JSON-LD) and a Chinese answer was
  // injected into it (mutation-tested). The expectation is counted by VALUE
  // (every string leaf that is not a URL or path), independently of the
  // field-regex filter, because comparing two outputs of the same filter
  // would shrink in step with it. th must also match en, which catches a th
  // list missing an item.
  const proseLeafCount = (content: unknown) => {
    const leaves: Array<[string, string]> = []
    flattenMessages(content, '', leaves)
    return leaves.filter(([field, value]) => field !== 'listSeparator' && !/^(https?:\/\/|\/)/.test(value)).length
  }
  // Site-chrome key gaps (Nav/Footer): the real function, on the real catalogs
  // with one key removed from ja, must report exactly that key; untouched, none.
  {
    const mutated = JSON.parse(JSON.stringify(uiCatalogs)) as Record<'en' | Locale, MessageCatalog>
    delete (mutated.ja.Nav as Record<string, unknown>).juniorAcademy
    const gaps = siteChromeGaps(mutated)
    assert(
      'chrome: a Nav key missing from ja is an ERROR, and the real catalogs have none',
      gaps.length === 1 && gaps[0][0] === 'ja' && gaps[0][1] === 'Nav.juniorAcademy' && siteChromeGaps(uiCatalogs).length === 0
    )
  }
  const juniorTh = entries.find((e) => e.entryId === 'junior:th')
  assert(
    'corpus: junior-academy th lints every prose leaf, and as many as en has',
    !!juniorTh &&
      juniorTh.units.length > 0 &&
      juniorTh.units.length === proseLeafCount(JUNIOR_ACADEMY_CONTENT.th) &&
      proseLeafCount(JUNIOR_ACADEMY_CONTENT.th) === proseLeafCount(JUNIOR_ACADEMY_CONTENT.en)
  )

  // Junior-academy leaf rule (check 12(d)'s rule): drives
  // checkJuniorAcademyLeaves(), the function the corpus loop calls, on copies
  // of the real th block with one leaf changed. Every negative case expects
  // exactly one error AND checks which rule raised it: a blank leaf has no Thai
  // either, so with the blank rule deleted the no-script rule would still
  // raise one error and a count alone would stay green.
  //
  // Fixture paths are taken from the block and the allowlist, not written as
  // literals, so ordinary copy edits (a shorter FAQ, a label translated and
  // its exemption removed, as the gate asks) do not turn this red on correct
  // data. A fixture that cannot be built throws, naming the fixture.
  {
    const realTh = JUNIOR_ACADEMY_CONTENT.th
    const juniorIssues = (content: unknown, exemptPaths?: readonly string[], en?: unknown): Issue[] => {
      const before = issues.length
      checkJuniorAcademyLeaves('th', '__test__', content, exemptPaths, en)
      return issues.splice(before).filter((i) => i.level === 'error')
    }
    const juniorErrs = (content: unknown): number => juniorIssues(content).length
    // Each rule's message, so a case can require the right one.
    const BLANK = 'blank string'
    const NO_SCRIPT = 'no th script at all'
    const NOT_EN = "must equal EN's value"
    const STALE = 'not a prose leaf'
    const UNUSED = 'remove the unused exemption'
    const oneFrom = (got: Issue[], rule: string) => got.length === 1 && got[0].detail.includes(rule)
    /** A deep copy of `node` with the string leaf at `target` (agreementStrings' path form) set to `value`. */
    const withLeaf = (node: unknown, target: string, value: string, path = ''): unknown => {
      if (typeof node === 'string') return path === target ? value : node
      if (Array.isArray(node)) return node.map((v, i) => withLeaf(v, target, value, `${path}[${i}]`))
      if (node && typeof node === 'object') {
        return Object.fromEntries(
          Object.entries(node as Record<string, unknown>).map(([k, v]) => [k, withLeaf(v, target, value, path ? `${path}.${k}` : k)])
        )
      }
      return node
    }
    // The prose paths, enumerated by VALUE (not a URL or a path, not the list
    // separator) as proseLeafCount does, but keeping '' leaves, and
    // independently of JUNIOR_NON_PROSE_RE: a widened field filter would
    // otherwise shrink the sweep in step with the rule it is testing.
    const strings: Array<[string, string]> = []
    agreementStrings(realTh, '', strings)
    const prosePaths = strings
      .filter(([field, value]) => field !== 'listSeparator' && !/^(https?:\/\/|\/)/.test(value))
      .map(([field]) => field)
    /** A copy of the th block with the prose leaf at `target` set to `value`. */
    const setLeaf = (target: string, value: string): unknown => {
      if (!prosePaths.includes(target)) {
        throw new Error(`junior self-test fixture: "${target}" is not a prose leaf of the th block; update the fixture`)
      }
      return withLeaf(realTh, target, value)
    }
    /** A derived fixture path, or a thrown error that names the missing fixture. */
    const need = (fixture: string, path: string | undefined): string => {
      if (!path) throw new Error(`junior self-test fixture "${fixture}" has no path in the th block; update the fixture`)
      return path
    }
    const exemptPaths = JUNIOR_ACADEMY_SCRIPTLESS.th ?? []
    const exempt = new Set(exemptPaths)
    // The English example this rule was written for was an FAQ answer
    // ('1 year.'); any answer will do.
    const faqAnswer = need('an FAQ answer', prosePaths.find((p) => /^faq\.items\[\d+\]\.answer$/.test(p)))
    const plainLeaf = need('a prose leaf outside the allowlist', prosePaths.find((p) => !exempt.has(p)))
    // Throws if th ever needs no exemption at all; then delete the cases
    // below that use exemptLeaf or exemptPaths rather than invent a path.
    const exemptLeaf = need('an allowlisted path', exemptPaths[0])
    const enStrings: Array<[string, string]> = []
    agreementStrings(JUNIOR_ACADEMY_CONTENT.en, '', enStrings)
    const enAt = new Map(enStrings)
    const ch = (...codes: number[]) => String.fromCharCode(...codes)
    const ENGLISH = 'Untranslated English copy.'
    // Short, capitalised, symbol-only and handle-bearing strings: a rule
    // narrowed to "has a space", "has a lowercase letter", "has a letter" or
    // "is long enough" still fires on a long lowercase sentence, but not on
    // these.
    const LATIN_SHAPES = ['FAQ', 'Play', '...', '30 min', 'LINE @lengolf.', '16,900']
    // Every blank shape the rule must see as blank, not just ASCII spaces:
    // '', spaces, tab and newline, NBSP, ideographic space, BOM, zero-width
    // space plus word joiner, zero-width joiner, soft hyphen, left-to-right
    // mark. Of these first ten, the last four are\p{Cf}, so a blank regex that names a few
    // format characters instead of the class misses one. Then combining marks
    // alone: a Thai tone mark, two Thai marks (a vowel sign and a tone mark),
    // and a Latin acute, so a blank test that strips only Thai marks misses
    // one. Last, a bidi override alone, which must be reported once, as blank,
    // not also as a forbidden character.
    const BLANK_SHAPES = [
      '', '  ', '\t\n', ch(0xa0), ch(0x3000), ch(0xfeff), ch(0x200b, 0x2060), ch(0x200d), ch(0xad), ch(0x200e),
      ch(0x0e48), ch(0x0e31, 0x0e48), ch(0x0301), ch(0x202e),
    ]
    // A floor, because .every() over an emptied list is true: the sweeps
    // below would pass having checked nothing. Raise it with the list.
    const MIN_BLANK_SHAPES = 14

    assert('junior: the real th block → 0 (the allowlist is exactly its script-less leaves)', juniorErrs(realTh) === 0)
    // The two gaps this rule exists for, as re-measured on main. The English
    // case pastes EN's own answer for that slot, as '1 year.' was, so it
    // stands without the EN-paste sweep below.
    {
      const enAnswer = enAt.get(faqAnswer) ?? ''
      assert(
        `junior: EN's own FAQ answer pasted into th ("${enAnswer.slice(0, 30)}") → 1, no-script`,
        oneFrom(juniorIssues(setLeaf(faqAnswer, enAnswer)), NO_SCRIPT)
      )
    }
    assert('junior: a whitespace-only th leaf → 1, blank', oneFrom(juniorIssues(setLeaf(faqAnswer, '   ')), BLANK))
    assert("junior: an empty th leaf ('') → 1, blank", oneFrom(juniorIssues(setLeaf(plainLeaf, '')), BLANK))
    assert(
      `junior: short, symbol-only and handle strings in a th leaf → 1 no-script each (${LATIN_SHAPES.join(' | ')})`,
      LATIN_SHAPES.every((s) => oneFrom(juniorIssues(setLeaf(plainLeaf, s)), NO_SCRIPT))
    )
    // An exempt path takes EN's value and nothing else: not an English
    // sentence, and not a glyph that renders as nothing but is neither
    // whitespace nor a format character (U+2800, the braille blank).
    assert(
      'junior: an allowlisted leaf holding English that is not EN\'s value → 1, not-EN',
      oneFrom(juniorIssues(setLeaf(exemptLeaf, 'Kids golf lessons in Bangkok')), NOT_EN)
    )
    assert('junior: an allowlisted leaf holding a braille blank → 1, not-EN', oneFrom(juniorIssues(setLeaf(exemptLeaf, ch(0x2800))), NOT_EN))
    // Near misses of EN's value, at EVERY allowlisted path: each defeats one
    // way of loosening the equality (a prefix, a superset, any EN string,
    // case-insensitive, punctuation-insensitive, digits exempt). The drift
    // variant bumps the first digit, which is price drift at price.amount
    // (16,900 in EN, 26,900 in th) and LEVEL 1 -> LEVEL 2 on a badge.
    {
      const nearMisses = (v: string): string[] => {
        const d = v.search(/\d/)
        const drift = d >= 0 ? v.slice(0, d) + String((Number(v[d]) + 1) % 10) + v.slice(d + 1) : v.slice(0, -1) + (v.endsWith('9') ? '8' : '9')
        const otherEn = [...enAt.values()].find((x) => x !== v && x.trim() !== '') ?? ''
        const recased = v === v.toUpperCase() ? v.toLowerCase() : v.toUpperCase()
        return [...new Set([v.slice(0, Math.ceil(v.length / 2)), `${v} (extra)`, otherEn, recased, v.replace(/,/g, '.'), drift])].filter(
          (x) => x !== v && x.trim() !== ''
        )
      }
      const wrong = exemptPaths.filter((p) => {
        const variants = nearMisses(enAt.get(p) ?? '')
        return variants.length < 4 || variants.some((x) => !oneFrom(juniorIssues(setLeaf(p, x)), NOT_EN))
      })
      assert(
        `junior: near misses of EN's value at each of the ${exemptPaths.length} allowlisted paths → 1 not-EN each` +
          (wrong.length ? ` (wrong at ${wrong.join(', ')})` : ''),
        exemptPaths.length > 0 && wrong.length === 0
      )
    }
    // Every prose leaf, one at a time. The sweeps are what make a narrowed
    // filter or a widened allowlist go red wherever it lands.
    const wrongAt = (paths: string[]) =>
      paths.length ? ` (wrong at ${paths.length}: ${paths.slice(0, 6).join(', ')}${paths.length > 6 ? ', ...' : ''})` : ''
    const wrongEnglish = prosePaths.filter((p) => !oneFrom(juniorIssues(setLeaf(p, ENGLISH)), exempt.has(p) ? NOT_EN : NO_SCRIPT))
    assert(
      `junior: English in each of the ${prosePaths.length} th prose leaves → 1 (no-script, or not-EN where allowlisted)${wrongAt(wrongEnglish)}`,
      prosePaths.length > 0 && prosePaths.length === proseLeafCount(realTh) && wrongEnglish.length === 0
    )
    // The realistic defect: EN's own string for that slot, pasted into th.
    // Expected 0 only where EN's value carries Thai or the path is exempt.
    const wrongEnPaste = prosePaths.filter((p) => {
      const enValue = enAt.get(p)
      if (enValue === undefined) return true
      const got = juniorIssues(setLeaf(p, enValue))
      return exempt.has(p) || NATIVE_SCRIPT.th.test(enValue) ? got.length !== 0 : !oneFrom(got, NO_SCRIPT)
    })
    assert(
      `junior: EN's own value pasted into each of the ${prosePaths.length} th prose leaves → 1 no-script, or 0 where allowlisted${wrongAt(wrongEnPaste)}`,
      prosePaths.length > 0 && wrongEnPaste.length === 0
    )
    const wrongBlank = prosePaths.filter((p) => !BLANK_SHAPES.every((b) => oneFrom(juniorIssues(setLeaf(p, b)), BLANK)))
    assert(
      `junior: each of ${BLANK_SHAPES.length} blank shapes in each of the ${prosePaths.length} th prose leaves → 1 blank${wrongAt(wrongBlank)}`,
      prosePaths.length > 0 && BLANK_SHAPES.length >= MIN_BLANK_SHAPES && wrongBlank.length === 0
    )
    // The allowlist must stay exact in the other direction too.
    assert(
      `junior: each of the ${exemptPaths.length} allowlisted leaves, given Thai script → 1, unused exemption`,
      exemptPaths.length > 0 && exemptPaths.every((p) => oneFrom(juniorIssues(setLeaf(p, `${enAt.get(p) ?? ''} ภาษาไทย`)), UNUSED))
    )
    assert(
      'junior: an allowlisted path that is not a leaf of the block → 1, stale exemption',
      oneFrom(juniorIssues(realTh, [...exemptPaths, 'no.such.leaf']), STALE)
    )

    // ── Path parity, characters, EN leaves and the price ──
    // Every case pins the exact multiset of rules that fired, by message, so a
    // rule disarmed while another happens to fire on the same leaf still goes
    // red. A message matching two rules reads as both, which fails too.
    const EN_ONLY = 'EN has a line at this path'
    const TH_ONLY = 'EN has no line at this path'
    const FORBIDDEN = 'carries a bidi control'
    const PRICE = 'is not JUNIOR_ACADEMY_PRICE_THB'
    const NO_EN = 'has no EN block'
    const RULES = [BLANK, NO_SCRIPT, NOT_EN, STALE, UNUSED, EN_ONLY, TH_ONLY, FORBIDDEN, PRICE, NO_EN]
    // The lists of the th block today (10); a walk narrowed to skip nested
    // arrays would otherwise shrink both parity sweeps unnoticed.
    const MIN_LISTS = 10
    const kinds = (got: Issue[]) => got.map((i) => RULES.filter((r) => i.detail.includes(r)).join('+') || '?').sort().join(' | ')
    const exactly = (got: Issue[], ...rules: string[]) => kinds(got) === [...rules].sort().join(' | ')
    // Every character the rule forbids, one at a time. The sweeps below pin
    // its length at exactly 10, because .every() over an emptied or shortened
    // list passes having checked less (measured: emptied, it stayed green).
    const FORBIDDEN_CHARS = [0x202a, 0x202b, 0x202c, 0x202d, 0x202e, 0x2066, 0x2067, 0x2068, 0x2069, 0xfffd].map((c) => ch(c))
    const inMiddle = (v: string, c: string) => v.slice(0, Math.ceil(v.length / 2)) + c + v.slice(Math.ceil(v.length / 2))
    const under = (item: string) => (p: string) => p === item || p.startsWith(`${item}.`) || p.startsWith(`${item}[`)

    // Characters. A Thai mark makes neither a blank leaf nor an English one
    // Thai, and a bidi control or U+FFFD fails inside real Thai.
    assert(
      'junior: a lone Thai tone mark in a th leaf → 1, blank (it passed as Thai script)',
      exactly(juniorIssues(setLeaf(faqAnswer, ch(0x0e48))), BLANK)
    )
    assert(
      `junior: short and handle strings plus a Thai tone mark in a th leaf → 1 no-script each ('1 year.' and ${LATIN_SHAPES.length} more)`,
      ['1 year.', ...LATIN_SHAPES].every((s) => exactly(juniorIssues(setLeaf(plainLeaf, s + ch(0x0e48))), NO_SCRIPT))
    )
    assert(
      'junior: an allowlisted leaf holding EN\'s value plus a Thai tone mark → 1, not-EN (not an unused exemption)',
      exactly(juniorIssues(setLeaf(exemptLeaf, (enAt.get(exemptLeaf) ?? '') + ch(0x0e48))), NOT_EN)
    )
    {
      const wrong = prosePaths.filter(
        (p) => !FORBIDDEN_CHARS.every((c) => {
          const value = strings.find(([f]) => f === p)?.[1] ?? ''
          const got = juniorIssues(setLeaf(p, inMiddle(value, c)))
          return exempt.has(p) ? exactly(got, FORBIDDEN, NOT_EN) : exactly(got, FORBIDDEN)
        })
      )
      assert(
        `junior: each of the ${FORBIDDEN_CHARS.length - 1} bidi controls and U+FFFD inside each of the ${prosePaths.length} th prose leaves → 1 forbidden (plus not-EN where allowlisted)${wrongAt(wrong)}`,
        prosePaths.length > 0 && FORBIDDEN_CHARS.length === 10 && wrong.length === 0
      )
    }

    // Path parity: every list of the th block, one at a time, made one item
    // shorter and one item longer than EN's.
    const lists: Array<[string, number]> = []
    const walkLists = (node: unknown, path: string): void => {
      if (Array.isArray(node)) {
        lists.push([path, node.length])
        node.forEach((v, i) => walkLists(v, `${path}[${i}]`))
      } else if (node && typeof node === 'object') {
        for (const [k, v] of Object.entries(node as Record<string, unknown>)) walkLists(v, path ? `${path}.${k}` : k)
      }
    }
    walkLists(realTh, '')
    /** A deep copy of `node` with the array at `target` passed through `edit`. */
    const withList = (node: unknown, target: string, edit: (a: unknown[]) => unknown[], path = ''): unknown => {
      if (Array.isArray(node)) {
        const copy = node.map((v, i) => withList(v, target, edit, `${path}[${i}]`))
        return path === target ? edit(copy) : copy
      }
      if (node && typeof node === 'object') {
        return Object.fromEntries(
          Object.entries(node as Record<string, unknown>).map(([k, v]) => [k, withList(v, target, edit, path ? `${path}.${k}` : k)])
        )
      }
      return node
    }
    const enProsePaths = enStrings
      .filter(([field, value]) => field !== 'listSeparator' && !/^(https?:\/\/|\/)/.test(value))
      .map(([field]) => field)
    const fieldsOf = (got: Issue[], rule: string) => got.filter((i) => i.detail.includes(rule)).map((i) => i.field).sort().join(',')
    {
      const wrongDrop = lists.filter(([list, n]) => {
        const item = `${list}[${n - 1}]`
        const dropped = enProsePaths.filter(under(item))
        // The REAL allowlist: a dropped milestone takes an allowlisted badge
        // with it, which must read as the path error alone, not also as a
        // stale entry whose removal would turn the restored line red again.
        const got = juniorIssues(withList(realTh, list, (a) => a.slice(0, -1)))
        return dropped.length === 0 || !exactly(got, ...dropped.map(() => EN_ONLY)) || fieldsOf(got, EN_ONLY) !== [...dropped].sort().join(',')
      })
      assert(
        `junior: each of the ${lists.length} th lists one item shorter than EN's → 1 EN-only per line of the missing item, no stale entry${wrongAt(wrongDrop.map(([l]) => l))}`,
        lists.length >= MIN_LISTS && wrongDrop.length === 0
      )
      const wrongAdd = lists.filter(([list, n]) => {
        const last = `${list}[${n - 1}]`
        const added = strings.filter(([p]) => prosePaths.includes(p) && under(last)(p)).map(([p, v]) => [`${list}[${n}]` + p.slice(last.length), v] as const)
        const got = juniorIssues(withList(realTh, list, (a) => [...a, a[a.length - 1]]))
        // A copied script-less line (a LEVEL badge) also has no Thai and no
        // allowlist entry at its new path.
        const want = added.flatMap(([, v]) => (NATIVE_SCRIPT.th.test(juniorVisible(v)) ? [TH_ONLY] : [TH_ONLY, NO_SCRIPT]))
        return added.length === 0 || !exactly(got, ...want) || fieldsOf(got, TH_ONLY) !== added.map(([p]) => p).sort().join(',')
      })
      assert(
        `junior: each of the ${lists.length} th lists one item longer than EN's → 1 th-only per line of the extra item${wrongAt(wrongAdd.map(([l]) => l))}`,
        lists.length >= MIN_LISTS && wrongAdd.length === 0
      )
    }
    {
      // The measured case: th drops the "a parent stays in the bay" line and
      // duplicates another list's last item, so the leaf COUNTS stay equal.
      const stringList = (p: string, n: number) => n >= 3 && prosePaths.includes(`${p}[0]`)
      const a = need('a string list of 3+ items', (lists.find(([p, n]) => p === 'trust.items' && stringList(p, n)) ?? lists.find(([p, n]) => stringList(p, n)))?.[0])
      const [, aLen] = lists.find(([p]) => p === a)!
      const lastIsPlain = (p: string, n: number) => p !== a && n >= 1 && prosePaths.includes(`${p}[${n - 1}]`) && !exempt.has(`${p}[${n - 1}]`)
      const b = need('a second string list', (lists.find(([p, n]) => p === 'price.items' && lastIsPlain(p, n)) ?? lists.find(([p, n]) => lastIsPlain(p, n)))?.[0])
      const [, bLen] = lists.find(([p]) => p === b)!
      const shifted = withList(withList(realTh, a, (x) => x.filter((_, i) => i !== 2)), b, (x) => [...x, x[x.length - 1]])
      const got = juniorIssues(shifted)
      assert(
        `junior: th drops ${a}[2] and duplicates ${b}[${bLen - 1}] (equal leaf counts) → 2: EN-only at ${a}[${aLen - 1}], th-only at ${b}[${bLen}]`,
        exactly(got, EN_ONLY, TH_ONLY) && fieldsOf(got, EN_ONLY) === `${a}[${aLen - 1}]` && fieldsOf(got, TH_ONLY) === `${b}[${bLen}]`
      )
      const enShort = withList(JUNIOR_ACADEMY_CONTENT.en, a, (x) => x.filter((_, i) => i !== 2))
      const fromEn = juniorIssues(realTh, undefined, enShort)
      assert(
        `junior: EN drops ${a}[2] (th unchanged) → 1, th-only at ${a}[${aLen - 1}]`,
        exactly(fromEn, TH_ONLY) && fieldsOf(fromEn, TH_ONLY) === `${a}[${aLen - 1}]`
      )
    }

    // The EN block: blanks, forbidden characters and the price.
    {
      const realEn = JUNIOR_ACADEMY_CONTENT.en
      const enIssues = (content: unknown, priceThb?: number): Issue[] => {
        const before = issues.length
        checkJuniorAcademyEnLeaves(content, priceThb)
        return issues.splice(before).filter((i) => i.level === 'error')
      }
      const setEnLeaf = (target: string, value: string): unknown => {
        if (!enProsePaths.includes(target)) {
          throw new Error(`junior self-test fixture: "${target}" is not a prose leaf of the EN block; update the fixture`)
        }
        return withLeaf(realEn, target, value)
      }
      const priceLeaf = need('EN price.amount', enProsePaths.find((p) => p === 'price.amount'))
      const want = enAt.get(priceLeaf) ?? ''
      // A defect at price.amount is a price mismatch too.
      const plus = (p: string, rule: string) => (p === priceLeaf ? [rule, PRICE] : [rule])
      assert('junior: the real EN block → 0', exactly(enIssues(realEn)))
      const wrongEnBlank = enProsePaths.filter((p) => !BLANK_SHAPES.every((b) => exactly(enIssues(setEnLeaf(p, b)), ...plus(p, BLANK))))
      assert(
        `junior: each of ${BLANK_SHAPES.length} blank shapes in each of the ${enProsePaths.length} EN prose leaves → 1 blank (plus price at price.amount)${wrongAt(wrongEnBlank)}`,
        enProsePaths.length >= prosePaths.length && BLANK_SHAPES.length >= MIN_BLANK_SHAPES && wrongEnBlank.length === 0
      )
      const wrongEnForbidden = enProsePaths.filter(
        (p) => !FORBIDDEN_CHARS.every((c) => exactly(enIssues(setEnLeaf(p, inMiddle(enAt.get(p) ?? '', c))), ...plus(p, FORBIDDEN)))
      )
      assert(
        `junior: each of the ${FORBIDDEN_CHARS.length - 1} bidi controls and U+FFFD inside each of the ${enProsePaths.length} EN prose leaves → 1 forbidden (plus price at price.amount)${wrongAt(wrongEnForbidden)}`,
        enProsePaths.length >= prosePaths.length && FORBIDDEN_CHARS.length === 10 && wrongEnForbidden.length === 0
      )
      // Price: the card's value against the constant, both directions.
      const d = want.search(/\d/)
      const drifted = d >= 0 ? want.slice(0, d) + String((Number(want[d]) + 1) % 10) + want.slice(d + 1) : `${want}0`
      const PRICE_MISSES = [drifted, want.replace(/,/g, ''), want.replace(/,/g, '.'), `${want} `, `฿${want}`, `${want} THB`]
      assert(
        `junior: EN price.amount near misses of the constant (${PRICE_MISSES.join(' | ')}) → 1 price each`,
        want !== '' && PRICE_MISSES.length === 6 && PRICE_MISSES.every((v) => v !== want && exactly(enIssues(setEnLeaf(priceLeaf, v)), PRICE))
      )
      assert('junior: no EN block at all → 1 (named), and th against it raises nothing further', exactly(enIssues(undefined), NO_EN) && exactly(juniorIssues(realTh, undefined, {})))
      // Non-prose leaves (separator, hrefs, faqLinks) are judged for
      // forbidden characters too: the separator is joined into the offer
      // description, and a URL with U+FFFD is a broken link.
      {
        const thHref = need('a th href', strings.find(([f]) => /\.href$/.test(f))?.[0])
        const enHref = need('an EN faqLinks href', enStrings.find(([f]) => /^faqLinks\..*\.href$/.test(f))?.[0])
        const rlo = ch(0x202e)
        const cases: Array<[string, Issue[]]> = [
          ['th listSeparator', juniorIssues(withLeaf(realTh, 'listSeparator', ' ' + rlo))],
          [`th ${thHref}`, juniorIssues(withLeaf(realTh, thHref, (strings.find(([f]) => f === thHref)?.[1] ?? '') + ch(0xfffd)))],
          ['EN listSeparator', enIssues(withLeaf(realEn, 'listSeparator', '. ' + ch(0x2066)))],
          [`EN ${enHref}`, enIssues(withLeaf(realEn, enHref, (enAt.get(enHref) ?? '') + rlo))],
        ]
        const wrong = cases.filter(([, got]) => !exactly(got, FORBIDDEN)).map(([l]) => l)
        // The message names the character and where it is.
        const named = juniorIssues(setLeaf(faqAnswer, 'ab' + rlo))[0]?.detail.includes('U+202E at index 2') ?? false
        assert(
          `junior: a bidi control or U+FFFD in a non-prose leaf (separator, href) → 1 forbidden each, naming the code point${wrong.length ? ` (wrong at ${wrong.join(', ')})` : ''}`,
          wrong.length === 0 && named
        )
      }
      assert(
        `junior: the constant changed (${JUNIOR_ACADEMY_PRICE_THB + 1000}) and the copy not → 1, price`,
        exactly(enIssues(realEn, JUNIOR_ACADEMY_PRICE_THB + 1000), PRICE)
      )
      // Both blocks drifted together: th still equals EN, so only the EN
      // rule can see it.
      const enDrift = setEnLeaf(priceLeaf, drifted)
      assert(
        `junior: EN and th price.amount both "${drifted}" → 1 price from EN, 0 from th`,
        exactly(enIssues(enDrift), PRICE) && exactly(juniorIssues(setLeaf(priceLeaf, drifted), undefined, enDrift))
      )
      // A th price written with Thai leaves the allowlist (the gate says to
      // remove the unused entry), so it is tied to the constant directly:
      // with the entry and without it, by digits, Thai digits included.
      {
        const noPrice = exemptPaths.filter((p) => p !== priceLeaf)
        const thDigits = (s: string) => s.replace(/[0-9]/g, (x) => String.fromCharCode(0x0e50 + Number(x)))
        const okThai = [`${want} บาท`, thDigits(want)]
        const badThai = [`${drifted} บาท`, thDigits(drifted)]
        assert(
          `junior: th price.amount in Thai (${[...okThai, ...badThai].join(' | ')}) → unused exemption, plus price where the digits drift`,
          okThai.every((v) => exactly(juniorIssues(setLeaf(priceLeaf, v)), UNUSED)) &&
            badThai.every((v) => exactly(juniorIssues(setLeaf(priceLeaf, v)), UNUSED, PRICE))
        )
        assert(
          `junior: th price.amount in Thai with its allowlist entry removed → 0 at the right digits, 1 price at drifted ones`,
          noPrice.length === exemptPaths.length - 1 &&
            okThai.every((v) => exactly(juniorIssues(setLeaf(priceLeaf, v), noPrice))) &&
            badThai.every((v) => exactly(juniorIssues(setLeaf(priceLeaf, v), noPrice), PRICE))
        )
      }
    }
  }

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

  // Check 12 — rental agreement. Drives rentalAgreementProblems(), the SAME
  // function the corpus loop calls, with the real translations as the valid
  // baseline. Each mutation is a defect checks 1-9 cannot see and must raise
  // EXACTLY one problem: more would mean one edit trips several rules, which
  // hides which rule is actually live.
  {
    const en = RENTAL_AGREEMENT.en
    const real = (l: Locale) => structuredClone(RENTAL_AGREEMENT[l])
    const count = (l: Locale, t: RentalAgreementContent | undefined, registered = true) =>
      rentalAgreementProblems(l, t, registered, en).length
    // Positional section indices (headings are localized, e.g. 第7条（…）).
    const mapSection = (t: RentalAgreementContent, i: number, f: (s: RentalAgreementSection) => RentalAgreementSection) => {
      t.sections = t.sections.map((s, j) => (j === i ? f(s) : s))
      return t
    }
    assert('agreement: real ja translation → 0', count('ja', real('ja')) === 0)
    assert('agreement: every real translation → 0', LOCALES.every((l) => count(l, real(l)) === 0))
    assert('agreement: no notice → 1', count('ja', { ...real('ja'), notice: undefined }) === 1)
    assert(
      'agreement: dropped clause (§7) → 1',
      count('ja', mapSection(real('ja'), 6, (s) => ({ ...s, items: s.items!.slice(1) }))) === 1
    )
    assert(
      'agreement: 24 → 48 (§9) → 1',
      count('ja', mapSection(real('ja'), 8, (s) => ({ ...s, items: s.items!.map((x, k) => (k === 1 ? x.replace('24', '48') : x)) }))) === 1
    )
    assert(
      'agreement: bold dropped (§9) → 1',
      count('ja', mapSection(real('ja'), 8, (s) => ({ ...s, items: s.items!.map((x) => x.replaceAll('**', '')) }))) === 1
    )
    assert(
      'agreement: dropped paragraph (§5) → 1',
      count('ja', mapSection(real('ja'), 4, (s) => ({ ...s, paragraphs: [] }))) === 1
    )
    assert('agreement: dropped intro paragraph → 1', count('ja', { ...real('ja'), intro: real('ja').intro.slice(0, 1) }) === 1)
    assert('agreement: dropped section → 1', count('ja', { ...real('ja'), sections: real('ja').sections.slice(1) }) === 1)
    assert('agreement: wrong day (2026年10月7日) → 1', count('ja', { ...real('ja'), lastUpdated: '最終更新日：2026年10月7日' }) === 1)
    assert('agreement: day/month swapped (2026年6月10日) → 1', count('ja', { ...real('ja'), lastUpdated: '最終更新日：2026年6月10日' }) === 1)
    assert(
      'agreement: Buddhist-era year (th 2569) → 1',
      count('th', { ...real('th'), lastUpdated: real('th').lastUpdated.replace('2026', '2569') }) === 1
    )
    {
      // Swap whichever month the real date line names for a different one, so
      // a version bump does not break this case. It used to replace a
      // hardcoded สิงหาคม; the bump to ตุลาคม made that replace change nothing,
      // the correct line produced 0 problems, and the case went red (a false
      // failure, not a silent pass). The `!== thLine` guard keeps a missed
      // lookup red too.
      const thLine = real('th').lastUpdated
      const thMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
      const i = thMonths.findIndex((m) => thLine.includes(m))
      const wrongMonth = thLine.replace(thMonths[i] ?? '', thMonths[(i + 1) % 12])
      assert(
        'agreement: wrong month name (th, next month) → 1',
        i >= 0 && wrongMonth !== thLine && count('th', { ...real('th'), lastUpdated: wrongMonth }) === 1
      )
    }
    assert(
      'agreement: blank clause → 1',
      count('ja', mapSection(real('ja'), 0, (s) => ({ ...s, items: s.items!.map((x, k) => (k === 0 ? '' : x)) }))) === 1
    )
    assert(
      'agreement: English (untranslated) notice → 1',
      count('ja', { ...real('ja'), notice: { text: 'This translation is provided for convenience.', linkText: real('ja').notice!.linkText } }) === 1
    )
    assert(
      'agreement: em dash in a clause → 1',
      count('ja', mapSection(real('ja'), 0, (s) => ({ ...s, items: s.items!.map((x, k) => (k === 0 ? `${x}—` : x)) }))) === 1
    )
    assert('agreement: registered locale with no text → 1', count('ja', undefined, true) === 1)
    assert('agreement: unregistered locale with no text → 0', count('ja', undefined, false) === 0)
    assert('agreement: text for an unregistered locale → 1', count('ja', real('ja'), false) === 1)
    assert('agreement: EN date line matches the version → 0', rentalAgreementEnProblems(en).length === 0)
    assert(
      'agreement: EN wrong day → 1',
      rentalAgreementEnProblems({ ...en, lastUpdated: 'Last updated: 7 October 2026' }).length === 1
    )
    // checkScript: ko must not count Han as its own, or a Chinese paragraph in
    // the ko slot scores 100% "own" (the zh-in-ko swap passed every gate).
    const zhClause = RENTAL_AGREEMENT.zh.sections[5].items![1]
    const koClause = RENTAL_AGREEMENT.ko.sections[5].items![1]
    assert('script: a Chinese clause in the ko slot → 1', errsFrom('ko', zhClause, checkScript) === 1)
    assert('script: the real ko clause → 0', errsFrom('ko', koClause, checkScript) === 0)
  }

  if (asserted < MIN_ASSERTIONS) {
    console.log(
      `\nFAIL: self-test suite has lost assertions (${asserted} ran, expected >= ${MIN_ASSERTIONS})`
    )
    process.exit(1)
  }
  console.log(ok ? `\nALL ${asserted} SELF-TESTS PASS` : '\nSELF-TEST FAILURES')
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
