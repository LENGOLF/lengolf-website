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
 * So this gate enforces the one thing a static check CAN enforce: any file that
 * reads a green-fee field must either route the basis decision through
 * `lib/course-fees.ts`, or be declared numeric-only (it never shows a reader a
 * basis). The predicate is deliberately "imports course-fees" and NOT "mentions
 * fee_is_seasonal" — the latter is satisfied by the very inline ternaries that
 * are the bug.
 *
 * What it CANNOT catch (documented so nobody mistakes green for safe):
 *   - a file that imports course-fees and then adds a second hardcoded label
 *     alongside (the rule is per-file, the bug is per-site);
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

/**
 * Files that read a fee field but never render a basis to a reader: sorting,
 * bucketing, scoring, type definitions, codegen and the gate itself. Adding to
 * this list is a claim that the file shows no basis word — check before you do.
 */
const NUMERIC_ONLY = new Set([
  'lib/golf-courses-derived.ts',
  'lib/course-fees.ts',
  'types/golf-courses.ts',
  'app/[locale]/golf-courses/[region]/[slug]/page.tsx',
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

for (const dir of SCAN_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    scanned++
    const rel = relative(ROOT, file).split('\\').join('/')
    const src = readFileSync(file, 'utf8')
    if (!FEE_FIELD_RE.test(src)) continue
    matched++
    if (COURSE_DATA_RE.test(rel) || NUMERIC_ONLY.has(rel)) continue
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
  }
}

// Anti-vacuity floor, per the repo's own rule that a gate which cannot fail is
// worse than no gate. If the walker or the pattern breaks, this goes red rather
// than printing a reassuring zero.
const MIN_MATCHED = 12
if (matched < MIN_MATCHED) {
  errors.push(
    `fee-label scan matched only ${matched} file(s) (expected >= ${MIN_MATCHED}) — ` +
      `the directory walker or FEE_FIELD_RE is broken, so this run proved nothing.`
  )
}

if (errors.length > 0) {
  console.error('\n❌ validate-fee-labels: fee-basis discipline violated\n')
  for (const e of errors) console.error(`  ✖ ${e}\n`)
  process.exit(1)
}

console.log(
  `✅ validate-fee-labels: ${matched} fee-reading file(s) across ${scanned} scanned — ` +
    `all route the basis decision through lib/course-fees.ts or are declared numeric-only`
)
