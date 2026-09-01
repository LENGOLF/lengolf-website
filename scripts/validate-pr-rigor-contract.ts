/**
 * EXTERNAL contract suite for the pr-rigor disclosure gate.
 *
 * WHY THIS EXISTS, and why `--self-test` is not enough. `--self-test` runs
 * `isDocPath` and `resolveFloor` IN PROCESS and then calls `process.exit()`
 * before the gate body ever executes. That covers the classifier and nothing
 * else — roughly two of the gate's seven decision points. Everything downstream
 * of the floor decision is invisible to it, and the review that prompted this
 * file measured three separate mutants that leave BOTH `validate:pr-rigor` and
 * `validate:pr-rigor:self-test` green while the gate is disarmed repo-wide:
 *
 *   count < decision.floor   ->  count < DOCS_FLOOR
 *        every PR relaxes to floor 1; the success line still prints
 *        "discloses 1 ... (floor 3, full)" and exits 0.
 *
 *   delete process.exit(1) on the below-floor branch
 *        prints the ❌ line AND the ✅ line and exits 0 — the exact
 *        "verdict right, exit code wrong" class validate-open-graph-contract.ts
 *        was built for.
 *
 *   remove the fence/code-span stripping
 *        a purely BACKTICKED decoy passes, re-opening the original bug the
 *        stripping exists for.
 *
 * An exit code is only observable from OUTSIDE the process, so this spawns the
 * real gate as a child and asserts what CI actually reads.
 *
 * Unlike the open-graph contract suite this needs no fixture trees: the gate
 * takes its entire input from the environment (PR_BODY, PR_CHANGED_PATHS,
 * PR_CHANGED_FILES_COUNT, GITHUB_EVENT_NAME), so a case IS an env.
 *
 * The env is built from scratch rather than spread over `process.env`, because
 * a developer running this with PR_BODY already exported would otherwise leak
 * it into every case and quietly change the answers.
 */
import { execFileSync } from 'child_process'
import { writeFileSync, rmSync, readFileSync } from 'fs'

interface Verdict {
  ok: boolean
  label: string
  detail?: string
}

const GATE = 'scripts/validate-pr-rigor.ts'
const MUTANT = 'scripts/_pr-rigor-contract-mutant.ts'

const DOCS = ['CLAUDE.md', 'docs/architecture.md']
const CODE = ['lib/course-fees.ts', 'CLAUDE.md']

interface Case {
  name: string
  body?: string
  paths?: string[]
  /** Defaults to paths.length, i.e. the agreeing case. */
  count?: number | string
  pullRequest?: boolean
  wantExit: 0 | 1
  wantOutput?: string
}

const CASES: readonly Case[] = [
  // --- the tier itself ------------------------------------------------------
  {
    name: 'docs-only PR disclosing 1 passes',
    body: 'Independent review agents spawned: 1',
    paths: DOCS,
    wantExit: 0,
    wantOutput: 'floor 1 (docs-only)',
  },
  {
    name: 'docs-only PR disclosing 0 fails',
    body: 'Independent review agents spawned: 0',
    paths: DOCS,
    wantExit: 1,
  },
  {
    // THE load-bearing case. `count < DOCS_FLOOR`, a deleted process.exit(1),
    // and a floor constant moved to 0 all turn this green.
    name: 'code PR disclosing 1 fails (floor 3)',
    body: 'Independent review agents spawned: 1',
    paths: CODE,
    wantExit: 1,
    wantOutput: 'below the 3-agent floor',
  },
  {
    name: 'code PR disclosing 3 passes',
    body: 'Independent review agents spawned: 3',
    paths: CODE,
    wantExit: 0,
    wantOutput: 'floor 3 (full)',
  },
  {
    name: 'the review procedure itself does not ride the reduced floor',
    body: 'Independent review agents spawned: 1',
    paths: ['.claude/skills/pr-rigor/SKILL.md'],
    wantExit: 1,
  },
  {
    name: 'a workflow edit does not ride the reduced floor',
    body: 'Independent review agents spawned: 1',
    paths: ['.github/PULL_REQUEST_TEMPLATE.md'],
    wantExit: 1,
  },

  // --- fail-safe: every unknown takes the strict floor ----------------------
  {
    name: 'no changed-path list falls back to strict',
    body: 'Independent review agents spawned: 1',
    wantExit: 1,
    wantOutput: 'no changed-file list available',
  },
  {
    name: 'a count that disagrees with the list falls back to strict',
    body: 'Independent review agents spawned: 1',
    paths: DOCS,
    count: 132,
    wantExit: 1,
  },
  {
    name: 'a non-numeric count falls back to strict',
    body: 'Independent review agents spawned: 1',
    paths: DOCS,
    count: 'not-a-number',
    wantExit: 1,
  },

  // --- the prose rule, which is the whole subject of commit 1 ---------------
  {
    name: 'a fenced disclosure does not count',
    body: '## Disclosure\n\n```\nIndependent review agents spawned: 6\n```\n',
    paths: CODE,
    wantExit: 1,
    wantOutput: 'missing the pr-rigor disclosure line',
  },
  {
    name: 'a backticked decoy does not count',
    body: 'The template requires `Independent review agents spawned: 9`.',
    paths: CODE,
    wantExit: 1,
    wantOutput: 'missing the pr-rigor disclosure line',
  },
  {
    name: 'a blockquoted disclosure does not count',
    body: '> Independent review agents spawned: 6',
    paths: CODE,
    wantExit: 1,
    wantOutput: 'missing the pr-rigor disclosure line',
  },
  {
    name: 'a real prose line beside a backticked decoy still passes',
    body:
      'The gate wants a line like `Independent review agents spawned: 0` in prose.\n\n' +
      'Independent review agents spawned: 4\n',
    paths: CODE,
    wantExit: 0,
  },
  {
    // Pins Math.min over the surviving prose matches. With Math.max this passes.
    name: 'the LOWEST of two prose numbers wins',
    body: 'Independent review agents spawned: 0\n\nIndependent review agents spawned: 5\n',
    paths: CODE,
    wantExit: 1,
  },

  // --- surrounding behaviour ------------------------------------------------
  { name: 'an empty body fails', body: '   ', paths: CODE, wantExit: 1 },
  {
    name: 'no PR context at all skips cleanly',
    pullRequest: false,
    wantExit: 0,
    wantOutput: 'no PR context',
  },
]

/** Mutations applied to a COPY of the gate; each must make --self-test exit 1. */
const DISARMS: ReadonlyArray<{ name: string; find: string; replace: string }> = [
  {
    name: 'FULL_FLOOR moved to 0',
    find: 'const FULL_FLOOR = 3',
    replace: 'const FULL_FLOOR = 0',
  },
  {
    name: 'DOCS_FLOOR moved to 0',
    find: 'const DOCS_FLOOR = 1',
    replace: 'const DOCS_FLOOR = 0',
  },
  {
    name: 'the classifier calls everything documentation',
    find: 'i.test(path)',
    replace: 'i.test(path) || true',
  },
  {
    name: 'selfTest() returns without judging anything',
    find: 'function selfTest(): never {',
    replace: 'function selfTest(): never {\n  return undefined as never',
  },
  {
    name: 'the selfTest() call site is commented out',
    find: '  selfTest()\n',
    replace: '  // selfTest()\n',
  },
]

const MIN_CASES = 16
const MIN_DISARMS = 5

function run(
  file: string,
  args: readonly string[],
  extraEnv: Record<string, string>
): { code: number; out: string } {
  // Built from scratch, NOT spread over process.env: a developer with PR_BODY
  // exported would otherwise silently change every answer below.
  const env: Record<string, string> = {
    PATH: process.env.PATH ?? '',
    HOME: process.env.HOME ?? '',
    USERPROFILE: process.env.USERPROFILE ?? '',
    SystemRoot: process.env.SystemRoot ?? '',
    APPDATA: process.env.APPDATA ?? '',
    TEMP: process.env.TEMP ?? '',
    TMP: process.env.TMP ?? '',
    ...extraEnv,
  }
  try {
    const out = execFileSync('npx', ['tsx', file, ...args], {
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

function judgeCase(c: Case): Verdict {
  const env: Record<string, string> = {}
  if (c.pullRequest !== false) env.GITHUB_EVENT_NAME = 'pull_request'
  if (c.body !== undefined) env.PR_BODY = c.body
  if (c.paths) {
    env.PR_CHANGED_PATHS = c.paths.join('\n')
    env.PR_CHANGED_FILES_COUNT = String(c.count ?? c.paths.length)
  } else if (c.count !== undefined) {
    env.PR_CHANGED_FILES_COUNT = String(c.count)
  }

  const { code, out } = run(GATE, [], env)
  if (code !== c.wantExit) {
    return {
      ok: false,
      label: c.name,
      detail: `expected exit ${c.wantExit}, got ${code} — ${out.trim().split('\n').slice(-2).join(' / ')}`,
    }
  }
  if (c.wantOutput && !out.includes(c.wantOutput)) {
    return {
      ok: false,
      label: c.name,
      detail: `exit ${code} was right but output lacks "${c.wantOutput}"`,
    }
  }
  return { ok: true, label: c.name }
}

/**
 * Runs `--self-test` against a deliberately broken copy of the gate.
 *
 * This is the only check that notices a harness reporting success it did not
 * earn. The control is not optional: without it a mutant that fails for an
 * unrelated reason (a syntax error, a bad import) would look like a pass.
 */
function disarmContract(): Verdict[] {
  const original = readFileSync(GATE, 'utf8')
  const out: Verdict[] = []
  try {
    writeFileSync(MUTANT, original)
    const clean = run(MUTANT, ['--self-test'], {})
    out.push(
      clean.code === 0
        ? { ok: true, label: 'control: an unmodified copy self-tests green' }
        : {
            ok: false,
            label: 'control: an unmodified copy self-tests green',
            detail: `expected exit 0, got ${clean.code} — every mutant below is vacuous`,
          }
    )

    for (const d of DISARMS) {
      if (original.split(d.find).length - 1 < 1) {
        out.push({
          ok: false,
          label: `disarm: ${d.name}`,
          detail: `anchor "${d.find.trim()}" no longer present in the gate — mutation never applied`,
        })
        continue
      }
      writeFileSync(MUTANT, original.replace(d.find, d.replace))
      const { code } = run(MUTANT, ['--self-test'], {})
      out.push(
        code === 1
          ? { ok: true, label: `disarm: ${d.name}` }
          : {
              ok: false,
              label: `disarm: ${d.name}`,
              detail: `--self-test exited ${code} on a disarmed gate; expected 1`,
            }
      )
    }
  } finally {
    rmSync(MUTANT, { force: true })
  }
  return out
}

function main(): void {
  console.log(
    `pr-rigor EXTERNAL contract: ${CASES.length} gate case(s) + ${DISARMS.length + 1} ` +
      `self-test fixture(s), one child process each\n`
  )

  const verdicts = [...CASES.map(judgeCase), ...disarmContract()]

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

  // Floor against case deletion. map() already guarantees one child process per
  // case, so this guards the ARRAY, not the loop.
  if (verdicts.length < MIN_CASES + MIN_DISARMS + 1) {
    console.error(
      `\ncontract suite SHRANK: ${verdicts.length} verdict(s), expected at least ` +
        `${MIN_CASES + MIN_DISARMS + 1}`
    )
    process.exit(1)
  }
  if (failures > 0) {
    console.error(`\npr-rigor contract FAILED: ${failures} of ${verdicts.length} case(s)`)
    process.exit(1)
  }
  console.log(
    `\npr-rigor contract OK — the gate exits 0 on ${CASES.filter((c) => c.wantExit === 0).length} ` +
      `acceptable inputs and 1 on ${CASES.filter((c) => c.wantExit === 1).length} unacceptable ones, ` +
      `and --self-test exits 1 against ${DISARMS.length} disarmed copies. All observed from ` +
      `outside the process.`
  )
}

if (require.main === module) main()
