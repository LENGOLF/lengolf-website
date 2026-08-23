/**
 * validate:open-graph — guards the metadata-inheritance trap.
 *
 * Next merges page metadata per KEY, not per field: a route segment that
 * declares `openGraph` at all REPLACES the root layout's resolved object
 * rather than extending it (`mergeMetadata`'s `case 'openGraph'` is a
 * wholesale assignment). So a page that declared its own openGraph to get a
 * page-specific image or url dropped the layout's `siteName` — and, in the 13
 * cases that did not re-declare `type` themselves, `og:type` too. No build
 * error, no lint error, and `tsc` cannot see it because both fields are
 * optional. Measured live on 2026-08-23: of 30 page-level blocks, 13 emitted
 * no og:type (the homepage among them) and all 30 emitted no og:site_name.
 *
 * `openGraph` is not the only key with that shape. The root layout also sets
 * `twitter` (whose object holds only `card`) and `icons` — so ANY page
 * declaring either silently drops what the layout supplied, and `twitter` is
 * the sharpest case because X degrades a missing `card` to a small preview
 * with no error anywhere. No page declares either today, so this gate treats
 * them as a tripwire: a page-level `twitter` must restate `card`, a
 * page-level `icons` must restate `icon`. `robots` is deliberately NOT
 * guarded — the two second-hand-club pages legitimately declare it, and the
 * layout's object holds only `index`/`follow`, so nothing drops.
 *
 * Smoke section D asserts the rendered artifact on 26 URLs, which reach
 * roughly a third of the page families. This runs with no server and covers
 * every declaration in app/, so a new route cannot reintroduce the bug by
 * simply not being in seoTests.
 *
 * Known limit: this reads SOURCE, so it cannot see a route that declares no
 * metadata at all. `app/not-found.tsx` renders its own <html> under a
 * metadata-less `app/layout.tsx` and ships with no og:*, no icons and no
 * <title>. That is a real (pre-existing, auto-noindex'd) gap this gate is
 * structurally unable to flag, named here rather than left implied-covered.
 *
 * Run: npx tsx scripts/validate-open-graph.ts [--self-test]
 */
import { readFileSync, readdirSync } from 'fs'
import { join, sep } from 'path'

const APP_DIR = 'app'
const LAYOUT = 'app/[locale]/layout.tsx'
const HELPER = 'siteOpenGraph('

/**
 * The helper is read too, because the layout and the helper are TWO
 * declarations of the same two defaults and nothing else compares them.
 * Mutation-proven before this existed: changing the helper's fallback to
 * `'article'` shipped og:type=article on all 29 declaring pages while the six
 * that omit openGraph kept `'website'` — two values site-wide — and
 * validate:open-graph, its self-test, typecheck and smoke section D were all
 * green, because the gate never read this file and smoke accepts either value.
 */
const HELPER_FILE = 'lib/open-graph.ts'

/** The two site-wide defaults, as written in one of the two places. */
export interface OgDefaults {
  type: string | null
  siteName: string | null
}

/**
 * EXACT expected count, deliberately not a floor with slack.
 *
 * An earlier version of this file used `MIN_DECLARATIONS = 25` against a true
 * count of 31 and argued in prose that the floor would catch a page bypassing
 * the wrap check. That argument was arithmetically false — 31 − 25 left SIX
 * free bypasses — and it repeats the slack-guard mistake CLAUDE.md already
 * records for smoke L2 ("a floor below the true value is the slack-guard
 * failure this repo keeps re-learning"). Adding or removing a page that
 * declares openGraph is now a one-line edit here, in the same commit. That
 * friction is the feature: the number is a claim about the corpus, not a
 * cushion.
 */
const EXPECTED_DECLARATIONS = 31

interface Problem {
  file: string
  line: number
  message: string
}

/**
 * Blank out comment bodies, preserving every newline AND the total length so
 * offsets and reported line numbers stay exact.
 *
 * This replaces a `head.startsWith('//' | '*' | '/*')` heuristic that was
 * wrong in BOTH directions: a line beginning `*​/ openGraph: {` was read as a
 * comment and the real (unwrapped) declaration skipped entirely, while an
 * inner line of a block comment that did not begin with `*` was read as live
 * code and flagged. String- and template-aware, because blanking from a `//`
 * inside a URL literal would hide whatever followed it on that line.
 */
export function stripComments(src: string): string {
  const out: string[] = []
  let state: 'code' | 'line' | 'block' | 'single' | 'double' | 'template' = 'code'
  let i = 0

  while (i < src.length) {
    const c = src[i]
    const next = src[i + 1]

    if (state === 'code') {
      if (c === '/' && next === '/') {
        state = 'line'
        out.push('  ')
        i += 2
        continue
      }
      if (c === '/' && next === '*') {
        state = 'block'
        out.push('  ')
        i += 2
        continue
      }
      if (c === "'") state = 'single'
      else if (c === '"') state = 'double'
      else if (c === '`') state = 'template'
      out.push(c)
      i++
      continue
    }

    if (state === 'line') {
      if (c === '\n') {
        state = 'code'
        out.push(c)
      } else {
        out.push(' ')
      }
      i++
      continue
    }

    if (state === 'block') {
      if (c === '*' && next === '/') {
        state = 'code'
        out.push('  ')
        i += 2
        continue
      }
      out.push(c === '\n' ? c : ' ')
      i++
      continue
    }

    // Inside a string or template literal: copy verbatim, honour escapes.
    if (c === '\\') {
      out.push(c, next ?? '')
      i += 2
      continue
    }
    if (
      (state === 'single' && c === "'") ||
      (state === 'double' && c === '"') ||
      (state === 'template' && c === '`')
    ) {
      state = 'code'
    }
    out.push(c)
    i++
  }

  return out.join('')
}

/** Extract the balanced `{...}` starting at `open`, or null if unbalanced. */
function balancedBlock(src: string, open: number): string | null {
  let depth = 0
  for (let j = open; j < src.length; j++) {
    if (src[j] === '{') depth++
    else if (src[j] === '}') {
      depth--
      if (depth === 0) return src.slice(open, j + 1)
    }
  }
  return null
}

type ValueForm = 'object' | 'helper' | 'other'

interface Declaration {
  line: number
  form: ValueForm
  block: string | null
}

/** Find every `<key>:` declaration in already-comment-stripped source. */
function findDeclarations(stripped: string, key: string): Declaration[] {
  const found: Declaration[] = []
  let i = -1
  while ((i = stripped.indexOf(key, i + 1)) !== -1) {
    // Reject a longer identifier that merely contains the key.
    const before = i > 0 ? stripped[i - 1] : ' '
    if (/[A-Za-z0-9_$.]/.test(before)) continue

    const colon = stripped.indexOf(':', i)
    if (colon === -1) continue
    if (stripped.slice(i + key.length, colon).trim() !== '') continue

    const rest = stripped.slice(colon + 1)
    const value = rest.trimStart()
    const line = stripped.slice(0, i).split('\n').length

    if (value.startsWith('{')) {
      const open = colon + 1 + (rest.length - value.length)
      found.push({ line, form: 'object', block: balancedBlock(stripped, open) })
    } else if (value.startsWith(HELPER)) {
      found.push({ line, form: 'helper', block: null })
    } else {
      found.push({ line, form: 'other', block: null })
    }
  }
  return found
}

export interface FileAudit {
  declarations: number
  layoutOpenGraphSeen: boolean
  layoutDefaults: OgDefaults | null
  problems: Problem[]
}

/**
 * Pull the two defaults out of the helper's source. Deliberately static, like
 * everything else here: importing lib/open-graph.ts would drag the `@/` alias
 * and lib/constants into a plain tsx script for no gain.
 *
 * Brittle to a rewrite of the helper BY DESIGN — if someone restructures it,
 * this goes red with a message naming what to update, which is the outcome we
 * want over silently ceasing to compare.
 */
export function extractHelperDefaults(src: string): OgDefaults {
  const stripped = stripComments(src)
  const type = stripped.match(/type\s*:\s*[A-Za-z0-9_$.]+\s*\?\?\s*\(?\s*(['"])([^'"]*)\1/)
  const siteName = stripped.match(
    /siteName\s*:\s*[A-Za-z0-9_$.]+\s*\?\?\s*([A-Za-z0-9_$.]+|(['"])[^'"]*\2)/
  )
  return { type: type ? type[2] : null, siteName: siteName ? siteName[1] : null }
}

/** Pull the same two defaults out of the root layout's openGraph block. */
function extractLayoutDefaults(block: string): OgDefaults {
  const type = block.match(/(?:^|[{,\s])type\s*:\s*(['"])([^'"]*)\1/)
  const siteName = block.match(
    /(?:^|[{,\s])siteName\s*:\s*([A-Za-z0-9_$.]+|(['"])[^'"]*\2)/
  )
  return { type: type ? type[2] : null, siteName: siteName ? siteName[1] : null }
}

/**
 * Audit one source file. Pure (path, source) so the self-test can exercise
 * every rule without touching the filesystem.
 */
export function auditSource(rel: string, src: string): FileAudit {
  const problems: Problem[] = []
  const stripped = stripComments(src)
  const isLayout = rel === LAYOUT
  let layoutOpenGraphSeen = false
  let layoutDefaults: OgDefaults | null = null

  const og = findDeclarations(stripped, 'openGraph')
  for (const d of og) {
    if (isLayout) {
      // The layout IS the base object: every page that OMITS openGraph
      // inherits exactly this, so it must spell both fields out literally.
      // Checked INSIDE the balanced block — a file-global `src.includes` was
      // satisfiable by a comment mentioning the field, or by an unrelated
      // sibling object elsewhere in the same file.
      if (d.form !== 'object' || !d.block) {
        problems.push({
          file: rel,
          line: d.line,
          message: `root layout openGraph must be a literal object, not ${d.form}`,
        })
        continue
      }
      layoutOpenGraphSeen = true
      layoutDefaults = extractLayoutDefaults(d.block)
      // Both quote styles: pinning the single-quoted spelling alone turned
      // the gate red on correct code after a formatter normalised it.
      if (!/(^|[{,\s])type\s*:\s*('website'|"website")/.test(d.block)) {
        problems.push({
          file: rel,
          line: d.line,
          message: "root layout openGraph must set type: 'website' inside the object",
        })
      }
      if (!/(^|[{,\s])siteName\s*:\s*\S/.test(d.block)) {
        problems.push({
          file: rel,
          line: d.line,
          message: 'root layout openGraph must set a non-empty siteName inside the object',
        })
      }
      continue
    }

    if (d.form === 'helper') continue

    // A bare object drops the defaults. Any OTHER form (a hoisted const, a
    // builder call, a ternary) is unverifiable here and used to be skipped
    // silently — neither counted nor flagged, i.e. a free bypass of the whole
    // gate. Rejected rather than skipped.
    problems.push({
      file: rel,
      line: d.line,
      message:
        d.form === 'object'
          ? 'page-level openGraph must be wrapped in siteOpenGraph({ ... }) from ' +
            '@/lib/open-graph — a bare object REPLACES the layout object and drops ' +
            'og:site_name (and og:type unless restated)'
          : 'page-level openGraph must be a literal siteOpenGraph({ ... }) call — this ' +
            'gate cannot verify a hoisted variable, builder call or ternary, so the ' +
            'form is rejected rather than skipped',
    })
  }

  // twitter / icons: same wholesale-replacement hazard, different key.
  if (!isLayout) {
    for (const [key, required] of [
      ['twitter', 'card'],
      ['icons', 'icon'],
    ] as const) {
      for (const d of findDeclarations(stripped, key)) {
        const restates =
          d.block && new RegExp(`(^|[{,\\s])${required}\\s*:\\s*\\S`).test(d.block)
        if (!restates) {
          problems.push({
            file: rel,
            line: d.line,
            message:
              `page-level ${key} REPLACES the root layout's ${key} object wholesale, so it ` +
              `must restate \`${required}\` (the layout's only ${key} field) or the layout's ` +
              `value is silently dropped`,
          })
        }
      }
    }
  }

  return { declarations: og.length, layoutOpenGraphSeen, layoutDefaults, problems }
}

/**
 * Corpus-level checks. Separate and pure so the self-test can prove them —
 * these are the two a per-file pass structurally cannot see.
 */
export function auditAggregate(totals: {
  declarations: number
  layoutOpenGraphSeen: boolean
  layoutDefaults?: OgDefaults | null
  helperDefaults?: OgDefaults | null
}): string[] {
  const errors: string[] = []

  // The layout and the helper declare the same two defaults independently.
  // Nothing else in the repo compares them, and the consequence of drift is
  // TWO values site-wide: the 29 declaring pages take the helper's, the six
  // that omit openGraph take the layout's.
  const { layoutDefaults: lay, helperDefaults: help } = totals
  if (lay && help) {
    for (const key of ['type', 'siteName'] as const) {
      if (lay[key] === null || help[key] === null) {
        errors.push(
          `could not read \`${key}\` from ${lay[key] === null ? LAYOUT : HELPER_FILE} — ` +
            `the layout/helper default comparison cannot run, so it must not be treated ` +
            `as passing. Update extractLayoutDefaults/extractHelperDefaults to match the ` +
            `current shape.`
        )
      } else if (lay[key] !== help[key]) {
        errors.push(
          `openGraph default \`${key}\` disagrees: ${LAYOUT} says ${lay[key]}, ` +
            `${HELPER_FILE} says ${help[key]}. Pages that declare openGraph take the ` +
            `helper's value and the six that omit it take the layout's, so the site would ` +
            `emit both.`
        )
      }
    }
  }

  if (!totals.layoutOpenGraphSeen) {
    errors.push(
      `${LAYOUT} declares no openGraph object. It is the base that every page omitting ` +
        `openGraph inherits, so deleting it strips og:type/og:site_name/og:url/og:image ` +
        `from all of them — and a per-file scan cannot see an absent key.`
    )
  }
  if (totals.declarations !== EXPECTED_DECLARATIONS) {
    errors.push(
      `found ${totals.declarations} openGraph declaration(s), expected exactly ` +
        `${EXPECTED_DECLARATIONS}. If you added or removed a page that declares openGraph, ` +
        `update EXPECTED_DECLARATIONS in this file in the same commit. If you did not, the ` +
        `scan is reading a different corpus than it should.`
    )
  }
  return errors
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) walk(p, out)
    else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) out.push(p)
  }
  return out
}

function selfTest(): void {
  const P = 'app/[locale]/x/page.tsx'
  const cases: {
    name: string
    rel: string
    src: string
    problems: boolean
    declarations: number
  }[] = [
    // --- page-level openGraph value forms ---
    { name: 'bare object is a violation', rel: P, src: 'return {\n  openGraph: { images: [1] },\n}\n', problems: true, declarations: 1 },
    { name: 'wrapped object passes', rel: P, src: 'return {\n  openGraph: siteOpenGraph({ images: [1] }),\n}\n', problems: false, declarations: 1 },
    { name: 'wrapped multi-line keeps its own type', rel: P, src: 'return {\n  openGraph: siteOpenGraph({\n    type: "article",\n  }),\n}\n', problems: false, declarations: 1 },
    { name: 'hoisted variable is REJECTED, not skipped', rel: P, src: 'const og = { images: [1] }\nreturn { openGraph: og }\n', problems: true, declarations: 1 },
    { name: 'builder call is REJECTED, not skipped', rel: P, src: 'return { openGraph: buildOg(slug) }\n', problems: true, declarations: 1 },
    { name: 'ternary mentioning the helper is REJECTED', rel: P, src: 'return { openGraph: flag ? siteOpenGraph({}) : { images: [1] } }\n', problems: true, declarations: 1 },

    // --- comment handling, both directions ---
    { name: 'a // mention is not a declaration', rel: P, src: '// a segment that omits openGraph: keeps the layout object\n', problems: false, declarations: 0 },
    { name: 'a block-comment mention is not a declaration', rel: P, src: '/*\n openGraph: { images: [1] },\n*/\n', problems: false, declarations: 0 },
    { name: 'a declaration after a closing block comment IS seen', rel: P, src: 'return {\n  /* note\n  */ openGraph: { images: [1] },\n}\n', problems: true, declarations: 1 },
    { name: 'a // inside a string does not blank the line', rel: P, src: 'const u = "https://x.dev/a"; return { openGraph: { images: [1] } }\n', problems: true, declarations: 1 },

    // --- layout rules ---
    { name: 'layout missing type is a violation', rel: LAYOUT, src: 'export const metadata = {\n  openGraph: {\n    siteName: SITE_NAME,\n  },\n}\n', problems: true, declarations: 1 },
    { name: 'layout missing siteName is a violation', rel: LAYOUT, src: "export const metadata = {\n  openGraph: {\n    type: 'website',\n  },\n}\n", problems: true, declarations: 1 },
    { name: 'layout fields in a COMMENT do not satisfy', rel: LAYOUT, src: "// type: 'website' and siteName: SITE_NAME used to be here\nexport const metadata = { openGraph: { images: [] } }\n", problems: true, declarations: 1 },
    { name: 'layout fields in a SIBLING object do not satisfy', rel: LAYOUT, src: "export const metadata = { other: { type: 'website', siteName: 'x' }, openGraph: { images: [] } }\n", problems: true, declarations: 1 },
    { name: 'layout with DOUBLE-quoted website passes', rel: LAYOUT, src: 'export const metadata = { openGraph: { type: "website", siteName: SITE_NAME } }\n', problems: false, declarations: 1 },
    { name: 'complete single-quoted layout passes', rel: LAYOUT, src: "export const metadata = {\n  openGraph: {\n    type: 'website',\n    siteName: SITE_NAME,\n  },\n}\n", problems: false, declarations: 1 },

    // --- the sibling guarded keys ---
    { name: 'page twitter without card is a violation', rel: P, src: 'return { twitter: { title: "x" } }\n', problems: true, declarations: 0 },
    { name: 'page twitter restating card passes', rel: P, src: 'return { twitter: { card: "summary_large_image", title: "x" } }\n', problems: false, declarations: 0 },
    { name: 'page icons without icon is a violation', rel: P, src: 'return { icons: { apple: "/a.png" } }\n', problems: true, declarations: 0 },
    { name: 'page robots is NOT guarded', rel: P, src: 'return { robots: { index: false, follow: false } }\n', problems: false, declarations: 0 },
  ]

  let failures = 0
  for (const c of cases) {
    const r = auditSource(c.rel, c.src)
    // Assert the parsed count too: a detector that read nothing would
    // otherwise "pass" every negative case.
    if (r.declarations !== c.declarations) {
      console.error(
        `  FAIL ${c.name}: expected ${c.declarations} declaration(s), parsed ${r.declarations}`
      )
      failures++
      continue
    }
    if (r.problems.length > 0 !== c.problems) {
      console.error(
        `  FAIL ${c.name}: expected problem=${c.problems}, got ${r.problems.length > 0}`
      )
      failures++
      continue
    }
    console.log(`  ok   ${c.name}`)
  }

  // --- corpus-level rules, unreachable from auditSource ---
  const agreed: OgDefaults = { type: 'website', siteName: 'SITE_NAME' }
  const aggregates: {
    name: string
    input: {
      declarations: number
      layoutOpenGraphSeen: boolean
      layoutDefaults?: OgDefaults | null
      helperDefaults?: OgDefaults | null
    }
    errors: boolean
  }[] = [
    { name: 'healthy corpus passes', input: { declarations: EXPECTED_DECLARATIONS, layoutOpenGraphSeen: true }, errors: false },
    { name: 'layout openGraph absent is an error', input: { declarations: EXPECTED_DECLARATIONS, layoutOpenGraphSeen: false }, errors: true },
    { name: 'one declaration lost is an error', input: { declarations: EXPECTED_DECLARATIONS - 1, layoutOpenGraphSeen: true }, errors: true },
    { name: 'one declaration gained is an error', input: { declarations: EXPECTED_DECLARATIONS + 1, layoutOpenGraphSeen: true }, errors: true },
    { name: 'starved walk is an error', input: { declarations: 0, layoutOpenGraphSeen: false }, errors: true },
    // --- layout/helper default agreement ---
    { name: 'agreeing defaults pass', input: { declarations: EXPECTED_DECLARATIONS, layoutOpenGraphSeen: true, layoutDefaults: agreed, helperDefaults: agreed }, errors: false },
    { name: 'type drift is an error', input: { declarations: EXPECTED_DECLARATIONS, layoutOpenGraphSeen: true, layoutDefaults: agreed, helperDefaults: { type: 'article', siteName: 'SITE_NAME' } }, errors: true },
    { name: 'siteName drift is an error', input: { declarations: EXPECTED_DECLARATIONS, layoutOpenGraphSeen: true, layoutDefaults: agreed, helperDefaults: { type: 'website', siteName: "'LENGOLF Bangkok'" } }, errors: true },
    { name: 'an unreadable default is an error, not a pass', input: { declarations: EXPECTED_DECLARATIONS, layoutOpenGraphSeen: true, layoutDefaults: agreed, helperDefaults: { type: null, siteName: 'SITE_NAME' } }, errors: true },
  ]
  for (const c of aggregates) {
    const got = auditAggregate(c.input).length > 0
    if (got !== c.errors) {
      console.error(`  FAIL [aggregate] ${c.name}: expected errors=${c.errors}, got ${got}`)
      failures++
      continue
    }
    console.log(`  ok   [aggregate] ${c.name}`)
  }

  const total = cases.length + aggregates.length
  if (failures > 0) {
    console.error(`\nself-test FAILED: ${failures} of ${total} case(s)`)
    process.exit(1)
  }
  console.log(`\nself-test passed: ${total} cases`)
}

function main(): void {
  if (process.argv.includes('--self-test')) {
    console.log('validate:open-graph --self-test')
    selfTest()
    return
  }

  const problems: Problem[] = []
  let declarations = 0
  let filesWithOg = 0
  let layoutOpenGraphSeen = false
  let layoutDefaults: OgDefaults | null = null
  const helperDefaults = extractHelperDefaults(readFileSync(HELPER_FILE, 'utf8'))

  for (const file of walk(APP_DIR)) {
    const rel = file.split(sep).join('/')
    const src = readFileSync(file, 'utf8')
    // The layout is read unconditionally: its openGraph going MISSING is the
    // one defect a "skip files without the token" filter cannot see.
    if (
      rel !== LAYOUT &&
      !src.includes('openGraph') &&
      !src.includes('twitter') &&
      !src.includes('icons')
    ) {
      continue
    }
    const res = auditSource(rel, src)
    if (res.declarations > 0) filesWithOg++
    if (res.layoutOpenGraphSeen) layoutOpenGraphSeen = true
    if (res.layoutDefaults) layoutDefaults = res.layoutDefaults
    declarations += res.declarations
    problems.push(...res.problems)
  }

  for (const p of problems) {
    console.error(`ERROR ${p.file}:${p.line}  ${p.message}`)
  }
  const aggregateErrors = auditAggregate({
    declarations,
    layoutOpenGraphSeen,
    layoutDefaults,
    helperDefaults,
  })
  for (const e of aggregateErrors) {
    console.error(`ERROR ${e}`)
  }

  const failed = problems.length + aggregateErrors.length
  if (failed > 0) {
    console.error(`\nvalidate:open-graph FAILED: ${failed} problem(s)`)
    process.exit(1)
  }

  console.log(
    `validate:open-graph OK — ${declarations} openGraph declaration(s) across ${filesWithOg} ` +
      `file(s); every page-level block routes through siteOpenGraph(), the layout carries ` +
      `type + siteName, and no page drops the layout's twitter/icons.`
  )
}

main()
