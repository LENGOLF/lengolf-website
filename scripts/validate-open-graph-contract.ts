/**
 * EXTERNAL contract suite for validate:open-graph.
 *
 * WHY THIS EXISTS, and why it is not another layer of guardrail.
 *
 * Everything else about that gate is checked from INSIDE it: `--self-test`
 * exercises the detectors in-process and reports its own total. That answers
 * "does this rule fire on this shape?" It cannot answer the only question CI
 * actually asks:
 *
 *     does the binary EXIT NON-ZERO when the corpus is bad?
 *
 * A validator whose job is to block a merge has exactly one externally
 * observable contract — its exit code — and that contract had NO test. Dropping
 * `problems.length` from main()'s failure arithmetic printed every ERROR line
 * and exited 0; a `--self-test` run stayed green, because the self-test never
 * calls main(). This repo has shipped that precise failure before, in
 * `verify:coordinates --write`.
 *
 * So this suite spawns the REAL script as a CHILD PROCESS against generated
 * fixture trees and asserts the exit code and the stderr. It trusts no counter,
 * no floor, and no internal report. It is the only check here whose evidence a
 * reader can reproduce without reading the validator at all.
 *
 * It also subsumes what three revisions of a mutable case counter kept failing
 * to do. The counter tried to prove the self-test ran; every placement left a
 * skip shape (`break` at the top, then `continue` one line lower, then
 * `continue` below the comparison). The counter is GONE — the harness is
 * `map()` over pure judges, so the executed count equals the input count by
 * construction — and the guarantee that the gate still fails on bad input lives
 * here, where it is observable rather than self-reported.
 *
 * DELIBERATELY SMALL. Nine fixtures, one process each. This is not a second
 * copy of the self-test: per-rule coverage stays in-process where it is fast.
 * What lives here is the contract — the arithmetic, the aggregate path, and the
 * shape of a real bypass — because those are what a green self-test cannot
 * evidence.
 *
 * Run: npx tsx scripts/validate-open-graph-contract.ts
 */
import { execFileSync } from 'child_process'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'fs'
import { tmpdir } from 'os'
import { join, sep } from 'path'

interface Verdict {
  ok: boolean
  label: string
  detail?: string
}

const GATE = 'scripts/validate-open-graph.ts'
const HELPER_SRC =
  `export function siteOpenGraph(og) {\n` +
  `  return { ...og, type: own.type ?? 'website', siteName: own.siteName ?? SITE_NAME }\n` +
  `}\n`
const LAYOUT_OK = `export const metadata = { openGraph: { type: 'website', siteName: SITE_NAME } }\n`
const IMPORT = `import { siteOpenGraph } from '@/lib/open-graph'\n`
const wrapped = `export const metadata = { openGraph: siteOpenGraph({ images: [1] }) }\n`
const bare = `export const metadata = { openGraph: { images: [1] } }\n`

interface Fixture {
  name: string
  /** relative path -> contents, under the fixture root */
  files: Record<string, string>
  /** layout is written for you unless this overrides it */
  layout?: string | null
  /** how many openGraph declarations the fixture legitimately holds */
  declarations: number
  wantExit: 0 | 1
  /** substring that must appear in the combined output */
  wantOutput?: string
}

const PAGE = (body: string) => body

const FIXTURES: Fixture[] = [
  {
    name: 'known-GOOD corpus exits 0',
    files: { 'a/page.tsx': PAGE(IMPORT + wrapped) },
    declarations: 2,
    wantExit: 0,
    wantOutput: 'validate:open-graph OK',
  },
  {
    name: 'ONE violation exits 1',
    files: { 'a/page.tsx': PAGE(bare) },
    declarations: 2,
    wantExit: 1,
    wantOutput: 'FAILED: 1 problem(s)',
  },
  {
    // The discriminating fixture for the arithmetic: with `problems.length`
    // dropped from the failure count, both this and the one above print every
    // ERROR line and exit 0. One violation and N violations are separate
    // fixtures because an aggregation bug can be off only in the plural.
    name: 'THREE violations exits 1 and counts all three',
    files: {
      'a/page.tsx': PAGE(bare),
      'b/page.tsx': PAGE(bare),
      'c/page.tsx': PAGE(bare),
    },
    declarations: 4,
    wantExit: 1,
    wantOutput: 'FAILED: 3 problem(s)',
  },
  {
    name: 'layout missing siteName exits 1',
    layout: `export const metadata = { openGraph: { type: 'website' } }\n`,
    files: { 'a/page.tsx': PAGE(IMPORT + wrapped) },
    declarations: 2,
    wantExit: 1,
    wantOutput: 'siteName',
  },
  {
    // Aggregate-only failure: no per-file problem exists, so this is the
    // fixture that catches `aggregateErrors.length` being dropped instead.
    name: 'layout with NO openGraph exits 1 (aggregate path only)',
    layout: `export const metadata = { title: 'x' }\n`,
    files: { 'a/page.tsx': PAGE(IMPORT + wrapped) },
    declarations: 1,
    wantExit: 1,
    wantOutput: 'layout',
  },
  {
    name: 'declaration count mismatch exits 1',
    files: { 'a/page.tsx': PAGE(IMPORT + wrapped) },
    declarations: 99,
    wantExit: 1,
    wantOutput: 'expected exactly 99',
  },
  {
    name: 'spread AFTER the openGraph key exits 1',
    files: { 'a/page.tsx': PAGE(IMPORT + `export const metadata = { openGraph: siteOpenGraph({ images: [1] }), ...evil }\n`) },
    declarations: 2,
    wantExit: 1,
    wantOutput: 'spread',
  },
  {
    name: 'opaque metadata const exits 1',
    files: { 'a/page.tsx': PAGE(`export const metadata = buildMeta('x')\n`) },
    declarations: 1,
    wantExit: 1,
    wantOutput: 'non-literal',
  },
  {
    name: 'aliased import beside a local shadow exits 1',
    files: {
      'a/page.tsx': PAGE(
        `import { siteOpenGraph as _real } from '@/lib/open-graph'\n` +
          `const siteOpenGraph = (o) => o\n` +
          wrapped
      ),
    },
    declarations: 2,
    wantExit: 1,
    wantOutput: 'import',
  },
]

/** Runs the real gate against one fixture tree. Returns exit code + output. */
function runGate(root: string, declarations: number): { code: number; out: string } {
  const env = {
    ...process.env,
    OG_APP_DIR: join(root, 'app'),
    // Forward slashes: main() normalises every walked path with
    // file.split(sep).join('/') before comparing it to LAYOUT, so a
    // Windows-separator value here silently fails to match and the layout is
    // audited as an ordinary page. Cost me four red fixtures.
    OG_LAYOUT: join(root, 'app', 'layout.tsx').split(sep).join('/'),
    OG_HELPER_FILE: join(root, 'helper.ts'),
    OG_EXPECTED_DECLARATIONS: String(declarations),
  }
  try {
    const out = execFileSync('npx', ['tsx', GATE], {
      env,
      encoding: 'utf8',
      stdio: 'pipe',
      shell: true,
    })
    return { code: 0, out }
  } catch (e: unknown) {
    const err = e as { status?: number; stdout?: string; stderr?: string }
    return { code: err.status ?? 1, out: (err.stdout ?? '') + (err.stderr ?? '') }
  }
}

function build(f: Fixture): string {
  const root = mkdtempSync(join(tmpdir(), 'og-contract-'))
  mkdirSync(join(root, 'app'), { recursive: true })
  writeFileSync(join(root, 'helper.ts'), HELPER_SRC)
  if (f.layout !== null) writeFileSync(join(root, 'app', 'layout.tsx'), f.layout ?? LAYOUT_OK)
  for (const [rel, src] of Object.entries(f.files)) {
    const abs = join(root, 'app', rel)
    mkdirSync(join(abs, '..'), { recursive: true })
    writeFileSync(abs, src)
  }
  return root
}

/**
 * The second entry point's contract: `--self-test` must exit 1 when a detector
 * is disarmed. Copies the gate into scripts/ (so its imports resolve), removes
 * one arm that a named self-test case pins, and runs it.
 *
 * This is the mutation test that was being done BY HAND, in a session, and
 * therefore not at all between sessions. It closes the last skip shape the
 * in-process harness cannot see: `failures = 0`, or a judge returning a
 * fabricated passing verdict. Both leave the mutant exiting 0, which fails here.
 *
 * The control fixture is not optional — without it, a copy that fails to run at
 * all (a bad path, a missing dep) would satisfy the mutant fixture for the
 * wrong reason and this check would be permanently vacuous.
 */
const MUTANT = 'scripts/_contract-mutant.ts'
const DISARM = {
  find: 'else if (ts.isShorthandPropertyAssignment(p) && p.name.text === name) found = p.name',
  replace: '',
  pins: 'layout siteName as a SHORTHAND satisfies the field',
}

function selfTestContract(): Verdict[] {
  const original = readFileSync(GATE, 'utf8')
  const run = (): { code: number; out: string } => {
    try {
      const out = execFileSync('npx', ['tsx', MUTANT, '--self-test'], {
        encoding: 'utf8',
        stdio: 'pipe',
        shell: true,
      })
      return { code: 0, out }
    } catch (e: unknown) {
      const err = e as { status?: number; stdout?: string; stderr?: string }
      return { code: err.status ?? 1, out: (err.stdout ?? '') + (err.stderr ?? '') }
    }
  }
  const out: Verdict[] = []
  try {
    // Control: an UNMODIFIED copy must pass, or the mutant result means nothing.
    writeFileSync(MUTANT, original)
    const clean = run()
    out.push(
      clean.code === 0
        ? { ok: true, label: 'control: an unmodified copy of the gate self-tests green' }
        : {
            ok: false,
            label: 'control: an unmodified copy of the gate self-tests green',
            detail: `expected exit 0, got ${clean.code} — the mutant fixture below is vacuous`,
          }
    )

    if (original.split(DISARM.find).length - 1 !== 1) {
      out.push({
        ok: false,
        label: 'mutant: a disarmed detector makes --self-test exit 1',
        detail: `the disarm anchor no longer appears exactly once in ${GATE}; update DISARM`,
      })
      return out
    }
    writeFileSync(MUTANT, original.replace(DISARM.find, DISARM.replace))
    const mutant = run()
    out.push(
      mutant.code === 1 && mutant.out.includes(DISARM.pins)
        ? { ok: true, label: 'mutant: a disarmed detector makes --self-test exit 1' }
        : {
            ok: false,
            label: 'mutant: a disarmed detector makes --self-test exit 1',
            detail:
              `expected exit 1 naming "${DISARM.pins}", got exit ${mutant.code}` +
              (mutant.out.includes(DISARM.pins) ? '' : ' and the case was never named'),
          }
    )
  } finally {
    rmSync(MUTANT, { force: true })
  }
  return out
}

const MIN_FIXTURES = 9

function main(): void {
  console.log(`open-graph EXTERNAL contract: ${FIXTURES.length} fixture(s), one child process each\n`)

  const corpusVerdicts: Verdict[] = FIXTURES.map((f) => {
    let root = ''
    try {
      root = build(f)
      const { code, out } = runGate(root, f.declarations)
      if (code !== f.wantExit) {
        return { ok: false, label: f.name, detail: `expected exit ${f.wantExit}, got ${code}` }
      }
      if (f.wantOutput && !out.includes(f.wantOutput)) {
        return {
          ok: false,
          label: f.name,
          detail: `exit ${code} was right but output lacks "${f.wantOutput}"`,
        }
      }
      return { ok: true, label: f.name }
    } catch (e) {
      return { ok: false, label: f.name, detail: `harness threw: ${String(e).slice(0, 120)}` }
    } finally {
      if (root) rmSync(root, { recursive: true, force: true })
    }
  })

  const verdicts = [...corpusVerdicts, ...selfTestContract()]

  const bad = verdicts.findIndex((v) => !v || typeof v.ok !== 'boolean')
  if (bad !== -1) {
    console.error(`\nHARNESS BROKEN: verdict #${bad} is not a verdict`)
    process.exit(1)
  }

  let failures = 0
  for (const v of verdicts) {
    if (v.ok) console.log(`  ok   ${v.label}`)
    else {
      console.error(`  FAIL ${v.label}: ${v.detail}`)
      failures++
    }
  }

  // Floor against fixture deletion. map() already guarantees one process per
  // fixture, so this guards the array, not the loop.
  // 9 corpus fixtures + 2 self-test-contract fixtures.
  if (verdicts.length < MIN_FIXTURES + 2) {
    console.error(
      `\ncontract suite SHRANK: ${verdicts.length} fixture(s), expected at least ${MIN_FIXTURES + 2}`
    )
    process.exit(1)
  }
  if (failures > 0) {
    console.error(`\nopen-graph contract FAILED: ${failures} of ${verdicts.length} fixture(s)`)
    process.exit(1)
  }
  console.log(
    `\nopen-graph contract OK — the gate exits 0 on a good corpus and 1 on each of ` +
      `${FIXTURES.filter((f) => f.wantExit === 1).length} bad ones, and --self-test exits 1 ` +
      `when a detector is disarmed. All observed from outside the process.`
  )
}

if (require.main === module) main()
