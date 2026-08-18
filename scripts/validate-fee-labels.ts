/**
 * Fee-label discipline gate.
 *
 * WHY THIS EXISTS: `green_fee_weekday_thb` / `green_fee_weekend_thb` hold the
 * LOWER and HIGHER of a course's two published rates, but what SPLITS them is
 * per-course — most price by day of week, a `fee_is_seasonal` course prices by
 * season. Labelling a seasonal course's rates "weekday/weekend" asserts a split
 * that does not exist, on statically generated indexed pages.
 *
 * That defect escaped THREE consecutive manual audits. It was then proved
 * uncatchable: reintroducing it (hardcoding the SpecTable row labels) left
 * `lint`, `typecheck`, `validate:i18n`, `validate:courses`, `validate:hotels`
 * and `validate:links` all green — six for six. TypeScript cannot help, because
 * these are plain string templates and next-intl's `t()` takes a bare `string`.
 *
 * TWO rules, because the first alone was not enough. Per-FILE: any file that
 * reads a green-fee field must either route the basis decision through
 * `lib/course-fees.ts`, or be declared numeric-only (it never shows a reader a
 * basis). The predicate is deliberately "imports course-fees" and NOT "mentions
 * fee_is_seasonal" — the latter is satisfied by the very inline ternaries that
 * are the bug. Per-SITE: a basis word inside a quoted string at a label-shaped
 * site must come from a course-fees helper on that line or carry an explicit
 * `fee-basis-ok:` justification. The per-file rule alone was BLIND to the exact
 * historical defect — SpecTable needs the import for feeBasisNoteEn, so
 * re-hardcoding its row label kept the import and passed. Verified by mutation
 * both ways: blind before the per-site rule, red after.
 *
 * What it CANNOT catch (documented so nobody mistakes green for safe):
 *   - a hardcoded basis in something that is not label-shaped (a `label:` key
 *     or a t() call) — e.g. free prose in a guarded template;
 *   - an English catalog string that is itself wrong (`lowSeason` = "Weekday");
 *   - a mistranslation of the season terms in ja/ko/zh/th — native QA's job;
 *   - day-of-week claims in free prose or DB-driven content.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const SCAN_DIRS = ['app', 'components', 'lib', 'data']
const FEE_FIELD_RE = /green_fee_week(day|end)_thb/
const COURSE_FEES_IMPORT_RE = /from\s+['"](@\/lib\/course-fees|\.\/course-fees|\.\.\/lib\/course-fees)['"]/
/** A day-of-week basis word written as a literal (field names stripped first). */
const BASIS_LITERAL_RE = /\b(weekday|weekend|wknd)\b/i
/** The basis came from the single source of truth on this line — fine. */
const COURSE_FEES_HELPER_RE = /feeLabelsEn|feeLabelKeys|feeBasisNoteEn|pricesByDayOfWeek|feeKeys\./
/** A rendered label: a `label:` property, or a translation key passed to t(). */
const LABEL_SHAPED_RE = /\blabel\s*:|(?:^|[^\w])t\(\s*['"`]/
/** Explicit, reviewable justification for a guarded site. */
const FEE_BASIS_OK_RE = /fee-basis-ok:/

/**
 * THIRD rule — the NOUN, which is a separate claim from the basis.
 *
 * `fee_is_package` splits them: kaeng-krachan really does charge less on a
 * weekday, so its basis labels are right, but both rates are all-in packages
 * covering caddie and cart — so "Weekday green fee" tells a reader the caddie is
 * extra. The two rules above model the basis ONLY, which is why reverting all
 * four visible package-noun sites at once left this gate printing
 * "no label-shaped site hardcodes a basis", exit 0. No other lint step reads
 * `components/`, so the only guard on those four strings was a smoke assertion
 * on `makesOffer[].name` — structured data, which no reader sees. Found by a
 * guard-efficacy pass, reproduced by mutation.
 *
 * Any t()/label site naming a green-fee noun key must route through the
 * package-aware helpers. Wider than the basis rule on purpose: it matches the
 * key as a bare identifier too (`t(feeKeys.lowerHeading)`), because that form
 * carries no quote and would slip past LABEL_SHAPED_RE.
 */
const NOUN_KEY_RE =
  /\b(greenFees|rosterGreenFee|weekdayGreenFee|weekendGreenFee|lowSeasonGreenFee|highSeasonGreenFee|lowerHeading|upperHeading)\b/
const NOUN_SITE_RE = /(?:^|[^\w])t\(|\blabel\s*:/
/** The noun decision came from the single source of truth on this line — fine. */
const NOUN_HELPER_RE = /feeHeadings|feePanelHeadingKey|feeRosterHeadingKey/
/** Explicit, reviewable justification for a guarded noun site. */
const FEE_NOUN_OK_RE = /fee-noun-ok:/

/**
 * Files that read a fee field but never render a basis to a reader: sorting,
 * bucketing, scoring, type definitions, codegen and the gate itself. Adding to
 * this list is a claim that the file shows no basis word — check before you do.
 */
const NUMERIC_ONLY = new Set([
  'lib/golf-courses-derived.ts',
  'lib/course-fees.ts',
  // NOT the course-detail route: it renders no basis word to a human, but it
  // now emits `Offer.name` basis labels into JSON-LD via feeHeadings, and
  // structured data is read by crawlers. Exempting it would keep the gate green
  // against a future hardcoded 'Weekday green fee' in that same call.
  'app/[locale]/golf-courses/[region]/[slug]/opengraph-image.tsx',
  'components/golf-courses/RoundupList.tsx',
])

/** Per-course data files are pure data — they declare fees, they never label them. */
const COURSE_DATA_RE = /^data\/golf-courses\/[^/]+\/[^/]+\.ts$/

function walk(dir: string, out: string[] = []): string[] {
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return out
  }
  for (const entry of entries) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (entry === 'node_modules' || entry === '.next') continue
      walk(full, out)
    } else if (/\.tsx?$/.test(entry)) {
      out.push(full)
    }
  }
  return out
}

const errors: string[] = []
let scanned = 0
let matched = 0
let checked = 0

for (const dir of SCAN_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    scanned++
    const rel = relative(ROOT, file).split('\\').join('/')
    const src = readFileSync(file, 'utf8')
    if (!FEE_FIELD_RE.test(src)) continue
    matched++
    if (COURSE_DATA_RE.test(rel) || NUMERIC_ONLY.has(rel)) continue
    // Counted AFTER the skips: this is the population the rules below actually
    // run against, and therefore the only number an anti-vacuity floor may use.
    checked++
    if (!COURSE_FEES_IMPORT_RE.test(src)) {
      errors.push(
        `${rel}: reads a green-fee field but does not import '@/lib/course-fees'.\n` +
          `    A course's two fees are weekday/weekend OR low/high season depending on\n` +
          `    fee_is_seasonal. Route the label through lib/course-fees.ts\n` +
          `    (pricesByDayOfWeek / feeLabelKeys / feeLabelsEn / feeBasisNoteEn), or add\n` +
          `    the file to NUMERIC_ONLY in scripts/validate-fee-labels.ts if it never\n` +
          `    shows a reader a basis.`
      )
    }

    // Per-SITE check. The per-FILE import rule above is necessary but not
    // sufficient: SpecTable.tsx legitimately imports course-fees for
    // feeBasisNoteEn, so re-hardcoding its row label to 'Weekday green fee' —
    // the exact historical defect — kept the import and sailed straight
    // through. Verified by mutation. So every basis word written as a literal
    // in a fee-reading file must either be produced by a course-fees helper on
    // that line, or carry an explicit `fee-basis-ok:` justification a reviewer
    // can challenge. Silence is what let this class survive three audits.
    src.split('\n').forEach((line, i) => {
      // The field NAMES contain "weekday"/"weekend" — strip them, or every line
      // that reads a fee matches itself.
      const bare = line.replace(/green_fee_week(day|end)_thb/g, '')
      // Only LABEL-shaped sites: a `label:` property or a translation key. That
      // is the shape the historical defect took (a row label hardcoded next to
      // a correctly-derived value). Deliberately NOT every basis word: variable
      // and parameter names (`const weekday =`, `feeAnswer(name, weekday, …)`)
      // and guarded prose templates are legitimate, and a gate that fires ~30
      // times on correct code gets switched off, which protects nothing.
      if (!LABEL_SHAPED_RE.test(bare)) return
      // Only basis words written INSIDE a quoted string count. `weekday` as a
      // local variable holding a number (`{weekday.toLocaleString()}`) is not a
      // label — matching identifiers here produced a false positive on
      // CourseMapExplorer's roster line.
      const quoted = bare.match(/'[^']*'|"[^"]*"|`[^`]*`/g) ?? []
      const offender = quoted.find((q) => BASIS_LITERAL_RE.test(q))
      if (!offender) return
      if (COURSE_FEES_HELPER_RE.test(bare)) return // basis came from the helper
      if (FEE_BASIS_OK_RE.test(line)) return // explicitly justified
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return // comment prose
      errors.push(
        `${rel}:${i + 1}: hardcoded fee basis in ${offender} in a\n` +
          `    fee-reading file. For a fee_is_seasonal course this asserts a day-of-week\n` +
          `    split that does not exist. Derive it (feeLabelsEn / feeLabelKeys), or if\n` +
          `    this site is genuinely guarded, append a justification comment:\n` +
          `        // fee-basis-ok: <why this is safe>\n` +
          `    Line: ${line.trim().slice(0, 110)}`
      )
    })

    // Per-SITE NOUN check. Same population, different claim — see NOUN_KEY_RE.
    src.split('\n').forEach((line, i) => {
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return // comment prose
      if (!NOUN_SITE_RE.test(line)) return
      const hit = line.match(NOUN_KEY_RE)
      if (!hit) return
      if (NOUN_HELPER_RE.test(line)) return // noun came from the helper
      if (FEE_NOUN_OK_RE.test(line)) return // explicitly justified
      errors.push(
        `${rel}:${i + 1}: green-fee NOUN key '${hit[0]}' rendered without the\n` +
          `    package decision. For a fee_is_package course the rate already includes the\n` +
          `    caddie and cart, so calling it a green fee tells a reader they are extra.\n` +
          `    Route it through lib/course-fees.ts (feeHeadings / feePanelHeadingKey /\n` +
          `    feeRosterHeadingKey), or if this site genuinely cannot reach a package\n` +
          `    course, append a justification comment:\n` +
          `        // fee-noun-ok: <why this is safe>\n` +
          `    Line: ${line.trim().slice(0, 110)}`
      )
    })
  }
}

// Anti-vacuity floor, per the repo's own rule that a gate which cannot fail is
// worse than no gate. If the walker or the pattern breaks, this goes red rather
// than printing a reassuring zero.
// The floor MUST count evaluated files, not matched ones. The first version
// gated on `matched` (163), which is dominated by the 149 per-course data files
// that are skipped on the very next line — so pruning SCAN_DIRS to ['data'],
// i.e. the walker breaking for every real code file, still cleared a floor of
// 12 and printed a success line. A gate that cannot fail is worse than no gate;
// this one could not fail for the exact breakage it was written to detect.
// Found by an EM-simulation review, reproduced by mutation.
const MIN_CHECKED = 8
if (checked < MIN_CHECKED) {
  errors.push(
    `fee-label scan evaluated only ${checked} file(s) (expected >= ${MIN_CHECKED}) — ` +
      `the walker, FEE_FIELD_RE, or the skip lists are broken, so this run proved ` +
      `nothing. ${matched} file(s) mentioned a fee field before skips.`
  )
}

if (errors.length > 0) {
  console.error('\n❌ validate-fee-labels: fee-basis discipline violated\n')
  for (const e of errors) console.error(`  ✖ ${e}\n`)
  process.exit(1)
}

console.log(
  `✅ validate-fee-labels: ${checked} file(s) evaluated (of ${matched} that read a fee ` +
    `field, across ${scanned} scanned) — all route the basis AND noun decisions ` +
    `through lib/course-fees.ts, and no label-shaped site hardcodes either`
)
