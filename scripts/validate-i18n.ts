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
 *   6. Unbalanced markdown bold (**) or a broken '{{' placeholder.
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

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { explainerPages } from '@/data/explainer-pages'
import { REGION_HUB_I18N } from '@/data/golf-courses-i18n'
import { faqPages } from '@/data/faq-pages'
import { PRICE_TIER_I18N } from '@/data/price-tiers'
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

// Build the corpus, grouped by entry (as-of scoping is an entry-level fact).
const entries: { entryId: string; locale: Locale; units: Unit[] }[] = []

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

// ── Shared regexes / helpers ────────────────────────────────────────────────
const EMOJI_RE = /\p{Extended_Pictographic}/u
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

// ── Check 6: markdown bold balance + placeholder integrity ──────────────────
function checkMarkup(unit: Unit) {
  const boldCount = indicesOf(unit.value, '**').length
  if (boldCount % 2 !== 0) {
    add('error', unit.locale, unit.entryId, unit.field, 'markdown', `unbalanced ** (found ${boldCount})`)
  }
  const open = indicesOf(unit.value, '{{').length
  const close = indicesOf(unit.value, '}}').length
  if (open !== close) {
    add(
      'error',
      unit.locale,
      unit.entryId,
      unit.field,
      'placeholder',
      `broken {{...}} placeholder ('{{'×${open} vs '}}'×${close})`
    )
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
for (const entry of entries) {
  const markers = AS_OF_MARKERS[entry.locale]
  const hasAsOf = entry.units.some((u) => markers.some((mk) => u.value.includes(mk)))

  for (const unit of entry.units) {
    const { locale, value } = unit

    // ERROR 1 — emoji
    if (NO_EMOJI_EXCL.includes(locale) && EMOJI_RE.test(value)) {
      const ch = value.match(EMOJI_RE)?.[0] ?? ''
      add('error', locale, unit.entryId, unit.field, 'emoji', `emoji "${ch}" not allowed`)
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
    checkMarkup(unit)
    // WARN 7/8
    checkCurrency(unit)
    checkHonesty(unit)

    // WARN 9 — price with no as-of marker in the entry
    if (!hasAsOf && !value.includes('{{') && PRICE_RE.test(value)) {
      const hit = value.match(PRICE_RE)?.[0] ?? ''
      add('warn', locale, unit.entryId, unit.field, 'price-as-of', `price "${hit}" but entry has no 'as of' marker (${markers.join('/')})`)
    }
  }
}

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
type MessageCatalog = Record<string, unknown>

const uiCatalogs = Object.fromEntries(
  (['en', ...LOCALES] as const).map((l) => [
    l,
    JSON.parse(
      readFileSync(fileURLToPath(new URL(`../messages/${l}.json`, import.meta.url)), 'utf8')
    ) as MessageCatalog,
  ])
) as Record<'en' | Locale, MessageCatalog>

const localesWithPaths = (registered: (locale: string) => string[]): Locale[] =>
  LOCALES.filter((l) => registered(l).length > 0)

const SSG_UI_NAMESPACES: Record<string, Locale[]> = (() => {
  const regionHub = localesWithPaths(getRegisteredRegionHubPaths)
  const priceTier = localesWithPaths(getRegisteredPriceTierPaths)
  const courseDetail = localesWithPaths(getRegisteredCourseDetailPaths)
  const faq = localesWithPaths(getRegisteredFaqPaths)
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
    // components/faq/FaqPage.tsx also getTranslations('ContactInfo') on every FAQ page.
    ContactInfo: faq,
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
  assert('markup: lone {{ → 1', errsFrom('ja', '{{price のみ', checkMarkup) === 1)
  assert('markup: complete {{token}} → 0', errsFrom('ja', '{{price}} は有効', checkMarkup) === 0)

  // TH as-of marker must not match the tail of ประมาณ ("approximately") or a
  // bare prepositional ณ — only the glossary's dated ข้อมูล ณ form counts.
  assert('as-of th: ประมาณ 500 บาท does not shield', !AS_OF_MARKERS.th.some((m) => 'ราคาโดยทั่วไปเริ่มต้นประมาณ 500 บาท'.includes(m)))
  assert('as-of th: bare ณ จังหวะ does not shield', !AS_OF_MARKERS.th.some((m) => 'ทำอะไรบ้าง ณ จังหวะปะทะลูก'.includes(m)))
  assert('as-of th: (ข้อมูล ณ กรกฎาคม 2026) shields', AS_OF_MARKERS.th.some((m) => '(ข้อมูล ณ กรกฎาคม 2026)'.includes(m)))

  // Corpus coverage — each source file actually contributes entries, so a
  // future filter/import regression can't silently shrink the lint surface.
  // 'exp-' only: data/faq-pages.ts also carries gg-prefixed ids, which would
  // keep a gg- check green even if the explainer import/loop regressed.
  assert('corpus: explainer entries present', entries.some((e) => e.entryId.startsWith('exp-')))
  assert('corpus: region-hub entries present', entries.some((e) => e.entryId.startsWith('hub:')))
  assert('corpus: FAQ entries present', entries.some((e) => e.entryId.startsWith('faq-')))
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

  // Checks 1–3 — regex-level detectors
  assert('emoji: ⛳ matches', EMOJI_RE.test('⛳'))
  assert('emoji: ○×—〜– ignored', !EMOJI_RE.test('○×—〜–'))
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
