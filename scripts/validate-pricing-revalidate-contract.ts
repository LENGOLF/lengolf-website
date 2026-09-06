/**
 * validate:pricing-revalidate:contract — proves the gate EXITS non-zero.
 *
 * The ordinary step cannot. It runs against a healthy tree, so it exits 0
 * whether the checks fire or not: dropping `process.exit(1)`, wrapping a
 * verdict in `if (false && …)`, or pinning the revalidate comparison true all
 * leave `npm run validate:pricing-revalidate` printing a byte-identical
 * success line. That is the "verdict right, exit code wrong" class this repo
 * has now hit in validate-open-graph and validate-pr-rigor, and the only thing
 * that sees it is a suite that spawns the real binary as a CHILD PROCESS and
 * reads the exit code from outside.
 *
 * Two corpora, deliberately:
 *
 *   SYNTHETIC fixtures exercise the ANALYZER — that taint crosses a
 *   default-exported server component, that `import type` does not carry it,
 *   that `revalidate = false` is rejected. Small enough to read.
 *
 *   REAL-TREE mutations exercise the GATE against this repo. A copy of the
 *   scanned directories is made once, then each case applies one mutation,
 *   runs the gate, and reverts it. These are the four regressions the task
 *   named: strip `revalidate` from menu/page.tsx; add a route importing
 *   getSiteFacts with none; add a route reading pricing only through a server
 *   component; and put a getSiteFacts() call in app/[locale]/layout.tsx, whose
 *   revalidate would govern its whole subtree.
 *
 * A synthetic fixture alone would not do: it proves the analyzer's logic on
 * code nobody ships. A real-tree mutation alone would not either: it cannot
 * isolate WHY a case went red. Both, and each case pins the expected exit code
 * AND a substring of the failure, so a gate that reddens for the wrong reason
 * is a failure here.
 */

import ts from 'typescript'
import { spawnSync } from 'child_process'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, cpSync, existsSync, unlinkSync } from 'fs'
import { tmpdir } from 'os'
import { join, dirname, resolve } from 'path'

const REPO = resolve('.')
const GATE = join(REPO, 'scripts', 'validate-pricing-revalidate.ts')

interface Run { code: number; stdout: string; stderr: string }

function runGate(env: Record<string, string>): Run {
  const r = spawnSync('npx', ['tsx', GATE], {
    cwd: REPO,
    env: { ...process.env, ...env },
    encoding: 'utf8',
    shell: process.platform === 'win32',
  })
  return { code: r.status ?? -1, stdout: r.stdout ?? '', stderr: r.stderr ?? '' }
}

let failures = 0
let judged = 0
let casesRun = 0

/**
 * The verdict, as a PURE function of the run — deliberately separated from
 * `expect()` so it can be exercised on synthetic inputs before the suite runs.
 * Review neutered `expect()` to print ✓ and return before `failures++`, and
 * the whole suite reported `20 case(s) · 20 judged · 0 failure(s) · OK` with
 * the gate fully disarmed: `judged !== casesRun` is powerless there, because
 * both counters still increment identically. The corruption was in what the
 * function CONCLUDED, which no counter can see. `assertJudgeDiscriminates()`
 * below is what sees it.
 */
function judgeRun(run: Run, wantCode: number, wantText?: string): boolean {
  const codeOk = run.code === wantCode
  const textOk = wantText === undefined || (run.stdout + run.stderr).includes(wantText)
  return codeOk && textOk
}

/**
 * Proves the verdict function still DISCRIMINATES, in both directions, before
 * a single case runs. A judge pinned true, pinned false, or ignoring either of
 * its two conditions fails here. This is the harness's own control — the same
 * argument the disarmed-gate section makes about the gate.
 */
function assertJudgeDiscriminates(): void {
  const ok: Run = { code: 1, stdout: 'the needle is here', stderr: '' }
  const wrongCode: Run = { code: 0, stdout: 'the needle is here', stderr: '' }
  const wrongText: Run = { code: 1, stdout: 'nothing relevant', stderr: '' }
  const checks: Array<[string, boolean]> = [
    ['a matching run is accepted', judgeRun(ok, 1, 'needle') === true],
    ['a wrong exit code is rejected', judgeRun(wrongCode, 1, 'needle') === false],
    ['a missing needle is rejected', judgeRun(wrongText, 1, 'needle') === false],
    ['code-only mode still discriminates', judgeRun(wrongCode, 1) === false],
  ]
  const broken = checks.filter(([, held]) => !held).map(([label]) => label)
  if (broken.length > 0) {
    console.error('✗ the contract suite\'s own verdict function does not discriminate:')
    for (const b of broken) console.error(`    ${b}`)
    console.error('  Every ✓ below would be meaningless. Refusing to run.')
    process.exit(1)
  }
}

function expect(name: string, run: Run, wantCode: number, wantText?: string): void {
  casesRun++
  const codeOk = run.code === wantCode
  const textOk = wantText === undefined || (run.stdout + run.stderr).includes(wantText)
  // Incremented AFTER both comparisons: a `continue` above this line would
  // leave casesRun at its true value while asserting nothing.
  judged++
  if (judgeRun(run, wantCode, wantText)) {
    console.log(`  ✓ ${name}`)
    return
  }
  failures++
  console.error(`  ✗ ${name}`)
  console.error(`      exit: got ${run.code}, want ${wantCode}`)
  if (!textOk) console.error(`      expected output to contain: ${wantText}`)
  const out = (run.stdout + run.stderr).trim().split('\n').slice(0, 12).join('\n        ')
  console.error(`      output:\n        ${out}`)
}

// ── Synthetic fixtures ─────────────────────────────────────────────────────

interface Fixture {
  name: string
  files: Record<string, string>
  wantCode: number
  wantText?: string
  /** Pins for the fixture's own inventory. */
  tainted: string[]
  routes: string[]
}

const PRICING_MODULE = `export async function getPricingCatalog() { return await fetch('x', { next: { revalidate: 2592000 } }).then(r => r.json()) }
export interface PricingCatalog { a: number }
`

const SITE_FACTS = `import { getPricingCatalog } from '@/lib/pricing'
export async function getSiteFacts() { return await getPricingCatalog() }
export function money(v: number) { return String(v) }
`

const fixtures: Fixture[] = [
  {
    name: 'clean tree — a pricing route that declares revalidate',
    files: {
      'lib/pricing.ts': PRICING_MODULE,
      'lib/site-facts.ts': SITE_FACTS,
      'app/p/page.tsx': `import { getSiteFacts } from '@/lib/site-facts'
export const revalidate = 86400
export default async function P() { return String(await getSiteFacts()) }
`,
    },
    wantCode: 0,
    wantText: 'OK',
    tainted: ['app/p/page.tsx#P', 'app/p/page.tsx#default', 'lib/pricing.ts#getPricingCatalog', 'lib/site-facts.ts#getSiteFacts'],
    routes: ['app/p/page.tsx'],
  },
  {
    name: 'pricing route with NO revalidate goes red',
    files: {
      'lib/pricing.ts': PRICING_MODULE,
      'lib/site-facts.ts': SITE_FACTS,
      'app/p/page.tsx': `import { getSiteFacts } from '@/lib/site-facts'
export default async function P() { return String(await getSiteFacts()) }
`,
    },
    wantCode: 1,
    wantText: 'neither it nor any ancestor layout declares',
    tainted: ['app/p/page.tsx#P', 'app/p/page.tsx#default', 'lib/pricing.ts#getPricingCatalog', 'lib/site-facts.ts#getSiteFacts'],
    routes: ['app/p/page.tsx'],
  },
  {
    name: 'taint crosses a DEFAULT-exported server component',
    files: {
      'lib/pricing.ts': PRICING_MODULE,
      'lib/site-facts.ts': SITE_FACTS,
      'components/Body.tsx': `import { getSiteFacts } from '@/lib/site-facts'
export default async function Body() { return String(await getSiteFacts()) }
`,
      'app/p/page.tsx': `import Body from '@/components/Body'
export default async function P() { return Body() }
`,
    },
    wantCode: 1,
    wantText: 'default <- components/Body.tsx',
    tainted: [
      'app/p/page.tsx#P', 'app/p/page.tsx#default',
      'components/Body.tsx#Body', 'components/Body.tsx#default',
      'lib/pricing.ts#getPricingCatalog', 'lib/site-facts.ts#getSiteFacts',
    ],
    routes: ['app/p/page.tsx'],
  },
  {
    name: '`import type` does NOT carry taint (the edge that keeps layout.tsx clean)',
    files: {
      'lib/pricing.ts': PRICING_MODULE,
      'app/layout.tsx': `import type { PricingCatalog } from '@/lib/pricing'
export default function L({ children }: { children: PricingCatalog }) { return children }
`,
    },
    wantCode: 0,
    wantText: '0 pricing-reading routes',
    tainted: ['lib/pricing.ts#getPricingCatalog'],
    routes: [],
  },
  {
    name: 'a LAYOUT that reads pricing is flagged (its revalidate governs the subtree)',
    files: {
      'lib/pricing.ts': PRICING_MODULE,
      'lib/site-facts.ts': SITE_FACTS,
      'app/layout.tsx': `import { getSiteFacts } from '@/lib/site-facts'
export default async function L() { return String(await getSiteFacts()) }
`,
    },
    wantCode: 1,
    wantText: 'app/layout.tsx',
    tainted: ['app/layout.tsx#L', 'app/layout.tsx#default', 'lib/pricing.ts#getPricingCatalog', 'lib/site-facts.ts#getSiteFacts'],
    routes: ['app/layout.tsx'],
  },
  {
    name: '`revalidate = false` is rejected — Infinity loses the MIN to 30 days',
    files: {
      'lib/pricing.ts': PRICING_MODULE,
      'lib/site-facts.ts': SITE_FACTS,
      'app/p/page.tsx': `import { getSiteFacts } from '@/lib/site-facts'
export const revalidate = false
export default async function P() { return String(await getSiteFacts()) }
`,
    },
    wantCode: 1,
    wantText: 'shortening branch never runs',
    tainted: ['app/p/page.tsx#P', 'app/p/page.tsx#default', 'lib/pricing.ts#getPricingCatalog', 'lib/site-facts.ts#getSiteFacts'],
    routes: ['app/p/page.tsx'],
  },
  {
    name: 'a NON-pricing route needs no revalidate (no false positive)',
    files: {
      'lib/pricing.ts': PRICING_MODULE,
      'data/copy.ts': `import { getPricingCatalog } from '@/lib/pricing'
export const staticCopy = 'hello'
export async function dynamicCopy() { return await getPricingCatalog() }
`,
      'app/p/page.tsx': `import { staticCopy } from '@/data/copy'
export default function P() { return staticCopy }
`,
    },
    wantCode: 0,
    wantText: '0 pricing-reading routes',
    tainted: ['data/copy.ts#dynamicCopy', 'lib/pricing.ts#getPricingCatalog'],
    routes: [],
  },
  {
    name: 'a pricing getter named only in a COMMENT is not a reference',
    files: {
      'lib/pricing.ts': PRICING_MODULE,
      'app/p/page.tsx': `// NOTE: this page once called getPricingCatalog(); it no longer does.
// See getPricingCatalog in lib/pricing.ts for the 30-day fetch.
export default function P() { return 'x' }
`,
    },
    wantCode: 0,
    wantText: '0 pricing-reading routes',
    tainted: ['lib/pricing.ts#getPricingCatalog'],
    routes: [],
  },
  {
    name: 'the tainted-symbol pin goes red when the inventory shrinks',
    files: {
      'lib/pricing.ts': PRICING_MODULE,
      'lib/site-facts.ts': SITE_FACTS,
      'app/p/page.tsx': `import { getSiteFacts } from '@/lib/site-facts'
export const revalidate = 86400
export default async function P() { return String(await getSiteFacts()) }
`,
    },
    wantCode: 1,
    wantText: 'no longer tainted',
    // Deliberately over-pinned: names a symbol the tree does not produce.
    tainted: [
      'app/p/page.tsx#P', 'app/p/page.tsx#default',
      'lib/pricing.ts#getPricingCatalog', 'lib/site-facts.ts#getSiteFacts',
      'lib/site-facts.ts#getFactTokens',
    ],
    routes: ['app/p/page.tsx'],
  },
  {
    name: 'the route pin goes red on an OVER-count (a floor would pass this)',
    files: {
      'lib/pricing.ts': PRICING_MODULE,
      'lib/site-facts.ts': SITE_FACTS,
      'app/p/page.tsx': `import { getSiteFacts } from '@/lib/site-facts'
export const revalidate = 86400
export default async function P() { return String(await getSiteFacts()) }
`,
      'app/q/page.tsx': `import { getSiteFacts } from '@/lib/site-facts'
export const revalidate = 86400
export default async function Q() { return String(await getSiteFacts()) }
`,
    },
    wantCode: 1,
    wantText: 'newly reading pricing: app/q/page.tsx',
    tainted: [
      'app/p/page.tsx#P', 'app/p/page.tsx#default',
      'app/q/page.tsx#Q', 'app/q/page.tsx#default',
      'lib/pricing.ts#getPricingCatalog', 'lib/site-facts.ts#getSiteFacts',
    ],
    routes: ['app/p/page.tsx'],
  },
  // The three holes an adversarial pass found in the analyzer. Each was a
  // SILENT false negative or false positive — the route was not merely
  // unflagged, it was absent from the inventory, so neither exact pin fired.
  {
    name: 'taint survives TOP-LEVEL DESTRUCTURING',
    files: {
      'lib/pricing.ts': PRICING_MODULE,
      'lib/destructure.ts': `import { getPricingCatalog } from '@/lib/pricing'
export const { a, b } = { a: getPricingCatalog, b: 1 }
`,
      'app/p/page.tsx': `import { a } from '@/lib/destructure'
export default async function P() { return String(await a()) }
`,
    },
    wantCode: 1,
    wantText: 'a <- lib/destructure.ts',
    tainted: [
      'app/p/page.tsx#P', 'app/p/page.tsx#default',
      'lib/destructure.ts#a', 'lib/destructure.ts#b',
      'lib/pricing.ts#getPricingCatalog',
    ],
    routes: ['app/p/page.tsx'],
  },
  {
    name: 'taint survives a module OUTSIDE the scanned directories',
    files: {
      'lib/pricing.ts': PRICING_MODULE,
      // `hooks/` is not in SCAN_DIRS. Before the closure fix, resolveSpecifier
      // resolved this file happily while the walk never parsed it, so taint
      // died here with no trace at all.
      'hooks/wrap.ts': `import { getPricingCatalog } from '@/lib/pricing'
export async function wrapped() { return await getPricingCatalog() }
`,
      'app/p/page.tsx': `import { wrapped } from '@/hooks/wrap'
export default async function P() { return String(await wrapped()) }
`,
    },
    wantCode: 1,
    wantText: 'wrapped <- hooks/wrap.ts',
    tainted: [
      'app/p/page.tsx#P', 'app/p/page.tsx#default',
      'hooks/wrap.ts#wrapped', 'lib/pricing.ts#getPricingCatalog',
    ],
    routes: ['app/p/page.tsx'],
  },
  {
    name: 'an ANCESTOR LAYOUT\'s revalidate covers the page (no false positive)',
    files: {
      'lib/pricing.ts': PRICING_MODULE,
      'app/lay/layout.tsx': `export const revalidate = 86400
export default function L({ children }: { children: unknown }) { return children }
`,
      'app/lay/sub/page.tsx': `import { getPricingCatalog } from '@/lib/pricing'
export default async function S() { return String(await getPricingCatalog()) }
`,
    },
    wantCode: 0,
    wantText: 'OK',
    tainted: [
      'app/lay/sub/page.tsx#S', 'app/lay/sub/page.tsx#default',
      'lib/pricing.ts#getPricingCatalog',
    ],
    routes: ['app/lay/sub/page.tsx'],
  },
]

function runSynthetic(): void {
  console.log('\nSynthetic fixtures (analyzer behaviour):')
  for (const f of fixtures) {
    const dir = mkdtempSync(join(tmpdir(), 'pricing-gate-'))
    try {
      for (const [rel, body] of Object.entries(f.files)) {
        const abs = join(dir, rel)
        mkdirSync(dirname(abs), { recursive: true })
        writeFileSync(abs, body)
      }
      const tPin = join(dir, '_tainted.json')
      const rPin = join(dir, '_routes.json')
      writeFileSync(tPin, JSON.stringify(f.tainted))
      writeFileSync(rPin, JSON.stringify(f.routes))
      expect(f.name, runGate({
        PRICING_GATE_ROOT: dir,
        PRICING_GATE_EXPECT_TAINTED: tPin,
        PRICING_GATE_EXPECT_ROUTES: rPin,
        PRICING_GATE_MIN_FILES: '1',
        PRICING_GATE_MIN_ROUTES: '1',
      }), f.wantCode, f.wantText)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  }
}

// ── Real-tree mutations ────────────────────────────────────────────────────

const SCANNED = ['app', 'lib', 'data', 'components', 'types', 'i18n']

interface Mutation {
  name: string
  /** Returns a revert thunk. */
  apply: (root: string) => () => void
  wantCode: number
  wantText: string
  /** Extra route(s) this mutation is expected to add to the pricing set. */
  extraRoutes?: string[]
  extraTainted?: string[]
}

function editFile(root: string, rel: string, fn: (s: string) => string): () => void {
  const abs = join(root, rel)
  const before = readFileSync(abs, 'utf8')
  writeFileSync(abs, fn(before))
  return () => writeFileSync(abs, before)
}

function addFile(root: string, rel: string, body: string): () => void {
  const abs = join(root, rel)
  mkdirSync(dirname(abs), { recursive: true })
  writeFileSync(abs, body)
  return () => { if (existsSync(abs)) unlinkSync(abs) }
}

const mutations: Mutation[] = [
  {
    name: 'stripping `export const revalidate` from menu/page.tsx goes red',
    apply: root => editFile(root, 'app/[locale]/menu/page.tsx', s => {
      const out = s.replace(/^export const revalidate = \d+.*$/m, '')
      if (out === s) throw new Error('menu/page.tsx: no revalidate line to strip')
      return out
    }),
    wantCode: 1,
    wantText: 'app/[locale]/menu/page.tsx',
  },
  {
    name: 'a NEW route importing getSiteFacts with no revalidate goes red',
    apply: root => addFile(root, 'app/contract-probe/page.tsx',
      `import { getSiteFacts } from '@/lib/site-facts'
export default async function Probe() { return String(await getSiteFacts()) }
`),
    wantCode: 1,
    wantText: 'app/contract-probe/page.tsx',
    extraRoutes: ['app/contract-probe/page.tsx'],
    extraTainted: ['app/contract-probe/page.tsx#Probe', 'app/contract-probe/page.tsx#default'],
  },
  {
    name: 'a NEW route reading pricing only through a server component goes red',
    apply: root => {
      const a = addFile(root, 'components/contract-probe/ProbeBody.tsx',
        `import { getSiteFacts } from '@/lib/site-facts'
export default async function ProbeBody() { return String(await getSiteFacts()) }
`)
      const b = addFile(root, 'app/contract-probe/page.tsx',
        `import ProbeBody from '@/components/contract-probe/ProbeBody'
export default async function Probe() { return ProbeBody() }
`)
      return () => { b(); a() }
    },
    wantCode: 1,
    wantText: 'default <- components/contract-probe/ProbeBody.tsx',
    extraRoutes: ['app/contract-probe/page.tsx'],
    extraTainted: [
      'app/contract-probe/page.tsx#Probe', 'app/contract-probe/page.tsx#default',
      'components/contract-probe/ProbeBody.tsx#ProbeBody', 'components/contract-probe/ProbeBody.tsx#default',
    ],
  },
  {
    name: 'a getSiteFacts() call in app/[locale]/layout.tsx goes red (governs its subtree)',
    apply: root => editFile(root, 'app/[locale]/layout.tsx', s =>
      `import { getSiteFacts } from '@/lib/site-facts'\n` +
      s.replace(
        /export default async function ([A-Za-z0-9_]+)\(/,
        (m, n) => `export default async function ${n}(`,
      ) + `\nconst _probe = async () => await getSiteFacts()\nexport { _probe }\n`,
    ),
    wantCode: 1,
    wantText: 'app/[locale]/layout.tsx',
    extraRoutes: ['app/[locale]/layout.tsx'],
    extraTainted: ['app/[locale]/layout.tsx#_probe'],
  },
]

function readPinnedLiterals(): { tainted: string[]; routes: string[] } {
  // Re-derive from the gate itself so the suite cannot drift from the pins it
  // is meant to extend. Reading the source constants beats hardcoding a second
  // copy that a future edit would leave stale.
  // PARSED WITH THE AST, for the reason the gate itself gives about scanning
  // source with string search. The previous version delimited the array with
  // `indexOf('\n]', open)`, and review broke it two ways: emptying the tainted
  // array to `[]` and indenting its closing bracket by two spaces BOTH made
  // the search run past the adjacent bracket and land on the NEXT array's
  // closer, so `grab('EXPECTED_TAINTED_LITERAL')` returned the 13 route
  // strings (mislabelled) in one case and 59 concatenated entries in the
  // other. Honest note on severity, because the obvious fear did not
  // reproduce: the corrupted pin is written into the fixture and fed to the
  // real gate, whose own diff then fires — so it failed LOUD, as a red
  // control, rather than silently passing everything. Fail-loud is the safe
  // direction; it is still a wrong-reason failure and a wasted CI round, and
  // the AST removes the class rather than the instance.
  const src = readFileSync(GATE, 'utf8')
  const sf = ts.createSourceFile(GATE, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const grab = (name: string): string[] => {
    for (const stmt of sf.statements) {
      if (!ts.isVariableStatement(stmt)) continue
      for (const d of stmt.declarationList.declarations) {
        if (!ts.isIdentifier(d.name) || d.name.text !== name) continue
        const init = d.initializer
        if (!init || !ts.isArrayLiteralExpression(init)) {
          throw new Error(`contract suite: ${name} is not an array literal in the gate`)
        }
        return init.elements.map(el => {
          if (!ts.isStringLiteral(el)) {
            throw new Error(`contract suite: ${name} holds a non-literal element`)
          }
          return el.text
        })
      }
    }
    throw new Error(`contract suite cannot find ${name} in the gate`)
  }
  const tainted = grab('EXPECTED_TAINTED_LITERAL')
  const routes = grab('EXPECTED_PRICING_ROUTES_LITERAL')
  // An emptied pin would make every real-tree mutation pass for the wrong
  // reason, so refuse rather than measure nothing.
  if (tainted.length === 0 || routes.length === 0) {
    throw new Error(
      `contract suite: the gate's pins are empty (tainted=${tainted.length}, routes=${routes.length}). ` +
      `Every real-tree case below would be vacuous.`,
    )
  }
  return { tainted, routes }
}

function runRealTree(): void {
  console.log('\nReal-tree mutations (the four named regressions):')
  const base = readPinnedLiterals()
  const root = mkdtempSync(join(tmpdir(), 'pricing-tree-'))
  try {
    for (const d of SCANNED) {
      const from = join(REPO, d)
      if (existsSync(from)) cpSync(from, join(root, d), { recursive: true })
    }

    // Control: the unmutated copy must be GREEN. Without this, a copy that
    // silently lost files would make every mutation below red for the wrong
    // reason and the suite would report success it did not earn.
    const tPin = join(root, '_tainted.json')
    const rPin = join(root, '_routes.json')
    writeFileSync(tPin, JSON.stringify(base.tainted))
    writeFileSync(rPin, JSON.stringify(base.routes))
    expect('control: unmutated copy of the real tree is green',
      runGate({ PRICING_GATE_ROOT: root, PRICING_GATE_EXPECT_TAINTED: tPin, PRICING_GATE_EXPECT_ROUTES: rPin }),
      0, 'OK')

    for (const m of mutations) {
      const revert = m.apply(root)
      try {
        // Extend the pins so the mutation reddens on the REVALIDATE check, not
        // on the inventory pin. A case that reddens for the wrong reason is a
        // failure here, which is what wantText enforces.
        writeFileSync(tPin, JSON.stringify([...base.tainted, ...(m.extraTainted ?? [])].sort()))
        writeFileSync(rPin, JSON.stringify([...base.routes, ...(m.extraRoutes ?? [])].sort()))
        expect(m.name,
          runGate({ PRICING_GATE_ROOT: root, PRICING_GATE_EXPECT_TAINTED: tPin, PRICING_GATE_EXPECT_ROUTES: rPin }),
          m.wantCode, m.wantText)
      } finally {
        revert()
      }
    }
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

// ── Disarmed-gate fixtures ─────────────────────────────────────────────────

/**
 * The class no in-process assertion can see: a gate whose VERDICTS are right
 * and whose EXIT CODE is not.
 *
 * READ THE ASSERTION DIRECTION, because the obvious one is backwards. These
 * cases do NOT require a disarmed gate to exit non-zero — a disarmed gate is
 * supposed to go quiet, that is what disarmed means. What they prove is that
 * THIS SUITE'S CONTRACT discriminates: an armed gate satisfies (exit 1 AND the
 * expected failure text) on a fixture that must fail, and every mutant does
 * NOT. If a mutant still satisfies it, the mutant SURVIVED and the suite's
 * green run is worth less than it looks.
 *
 * A crash counts as "does not satisfy", so the CONTROL is load-bearing: the
 * first version of this section ran the copies from a temp directory where
 * `typescript` did not resolve, and all three mutants read as caught on a
 * module-load error. The control caught it. The copy therefore lives inside
 * scripts/ (the validate-open-graph-contract convention) and the mutant loop
 * refuses to run at all unless the control passed.
 */
const MUTANT_PATH = 'scripts/_pricing-contract-mutant.ts'
const MUST_FAIL_TEXT = 'neither it nor any ancestor layout declares'

/**
 * THIS LIST STARTED AT FOUR AND WAS MEASURABLY INADEQUATE. An adversarial pass
 * found SIX further single-edit disarms that left the gate exiting 0 on a live
 * defect while both this suite and the ordinary CI step stayed green — every
 * one of them absent from the list at the time. The four originals were all
 * caught; the point is that "the mutants I thought of are caught" is not
 * coverage. When you add a verdict or an anti-vacuity block to the gate, add
 * its disarm HERE in the same commit, or it is unguarded by construction.
 *
 * Anchors are required to appear EXACTLY ONCE (checked below), so a refactor
 * that duplicates or reformats one fails loudly rather than silently testing
 * nothing.
 */
const DISARM_MUTANTS: Array<{ name: string; find: string; replace: string; fixture: FixtureKind }> = [
  // -- the four originals --
  { name: 'process.exit(1) deleted', fixture: 'missing', find: '    process.exit(1)\n  }\n  console.log(\'OK\')', replace: '    // process.exit(1)\n  }\n  console.log(\'OK\')' },
  { name: 'problems.length > 0 pinned false', fixture: 'missing', find: '  if (problems.length > 0) {', replace: '  if (false && problems.length > 0) {' },
  { name: 'the missing-revalidate branch disarmed', fixture: 'missing', find: "    if (rv.kind === 'missing') {", replace: '    if (false) {' },
  { name: 'the pricing-route check short-circuited', fixture: 'missing', find: '    if (hits.length === 0) continue', replace: '    if (true) continue' },

  // -- the six review found surviving, in the order it reported them --
  // CRITICAL: one line silently accepts every route regardless of its real
  // state, and neither pin notices because taint and classification are intact.
  {
    name: 'revalidateOf hardcoded to "declared"', fixture: 'missing',
    find: 'function revalidateOf(mod: Mod): RevalidateState {\n  revalidateProbes++',
    replace: "function revalidateOf(mod: Mod): RevalidateState {\n  revalidateProbes++\n  return { kind: 'declared', text: 'mutant' }",
  },
  // CRITICAL: "expected" derived from "got" in the same run is immune to ANY
  // analyzer regression, not merely to one specific mutation.
  {
    name: 'the tainted pin made self-fulfilling', fixture: 'wrongTainted',
    find: "  const expectedTainted = expectedFrom('PRICING_GATE_EXPECT_TAINTED', EXPECTED_TAINTED_LITERAL)",
    replace: '  const expectedTainted = [...a.taintedExports].sort()',
  },
  {
    name: 'the route pin made self-fulfilling', fixture: 'wrongRoute',
    find: "  const expectedRoutes = expectedFrom('PRICING_GATE_EXPECT_ROUTES', EXPECTED_PRICING_ROUTES_LITERAL)",
    replace: '  const expectedRoutes = [...pricingRoutes]',
  },
  {
    name: 'the revalidate=false branch disarmed', fixture: 'false',
    find: "    } else if (rv.kind === 'false') {",
    replace: '    } else if (false) {',
  },
  {
    name: 'the tainted-pin verdict disarmed', fixture: 'wrongTainted',
    find: '  if (td.missing.length || td.extra.length) {',
    replace: '  if (false) {',
  },
  {
    name: 'the route-pin verdict disarmed', fixture: 'wrongRoute',
    find: '  if (rd.missing.length || rd.extra.length) {',
    replace: '  if (false) {',
  },
  // The compound edit that defeats `judged` by moving the counter WITH the
  // skip, so judged === pricingRoutes.length while nothing is checked. Caught
  // now only because `revalidateProbes` is incremented inside the scan itself.
  {
    name: 'judged++ moved up beside the push, with a skip below it', fixture: 'missing',
    find: '    pricingRoutes.push(rel)\n',
    replace: '    pricingRoutes.push(rel)\n    judged++\n    continue\n',
  },
]

/**
 * Each mutant is tested against a fixture ITS DISARM ACTUALLY CHANGES.
 *
 * The first version of this section ran every mutant against one
 * missing-revalidate fixture, and five of the eleven "passed" for a reason
 * that proved nothing: a fixture with no `revalidate = false` in it cannot
 * expose the false-branch disarm, and a fixture whose pins are CORRECT cannot
 * expose a pin being disarmed or made self-fulfilling. Adding those six
 * mutants made the suite honestly report 5 survivors — the list was right and
 * the fixture was wrong.
 */
type FixtureKind = 'missing' | 'false' | 'wrongTainted' | 'wrongRoute'

interface DisarmFixture {
  /** What the HEALTHY gate must say about this tree. */
  wantText: string
  /** Written into app/p/page.tsx. */
  page: string
  /** Deliberate corruption of the pins, applied on top of the true inventory. */
  corrupt?: (t: string[], r: string[]) => { t: string[]; r: string[] }
}

const DISARM_FIXTURES: Record<FixtureKind, DisarmFixture> = {
  missing: {
    wantText: MUST_FAIL_TEXT,
    page: `import { getSiteFacts } from '@/lib/site-facts'
export default async function P() { return String(await getSiteFacts()) }
`,
  },
  false: {
    wantText: 'shortening branch never runs',
    page: `import { getSiteFacts } from '@/lib/site-facts'
export const revalidate = false
export default async function P() { return String(await getSiteFacts()) }
`,
  },
  // A route that is fully compliant, so the ONLY thing the healthy gate can
  // complain about is the pin — which is what these two fixtures corrupt, one
  // side at a time. Corrupting both would let a mutant that disarms one pin
  // still be caught by the other, which is exactly the false pass being fixed.
  wrongTainted: {
    wantText: 'the tainted-symbol inventory moved',
    page: `import { getSiteFacts } from '@/lib/site-facts'
export const revalidate = 86400
export default async function P() { return String(await getSiteFacts()) }
`,
    corrupt: (t, r) => ({ t: [...t, 'lib/ghost.ts#neverTainted'], r }),
  },
  wrongRoute: {
    wantText: 'set of pricing-reading routes moved',
    page: `import { getSiteFacts } from '@/lib/site-facts'
export const revalidate = 86400
export default async function P() { return String(await getSiteFacts()) }
`,
    corrupt: (t, r) => ({ t, r: [...r, 'app/ghost/page.tsx'] }),
  },
}

function runDisarmed(): void {
  console.log('\nDisarmed-gate fixtures (exit-code integrity):')
  const dir = mkdtempSync(join(tmpdir(), 'pricing-disarm-'))
  const mutantAbs = join(REPO, MUTANT_PATH)
  const src = readFileSync(GATE, 'utf8')

  /** The true inventory of the one-route fixture tree. */
  const TRUE_TAINTED = [
    'app/p/page.tsx#P', 'app/p/page.tsx#default',
    'lib/pricing.ts#getPricingCatalog', 'lib/site-facts.ts#getSiteFacts',
  ]
  const TRUE_ROUTES = ['app/p/page.tsx']

  try {
    const buildFixture = (kind: FixtureKind) => {
      const f = DISARM_FIXTURES[kind]
      const tree = join(dir, kind)
      mkdirSync(join(tree, 'lib'), { recursive: true })
      mkdirSync(join(tree, 'app', 'p'), { recursive: true })
      writeFileSync(join(tree, 'lib', 'pricing.ts'), PRICING_MODULE)
      writeFileSync(join(tree, 'lib', 'site-facts.ts'), SITE_FACTS)
      writeFileSync(join(tree, 'app', 'p', 'page.tsx'), f.page)
      const { t, r } = f.corrupt
        ? f.corrupt([...TRUE_TAINTED], [...TRUE_ROUTES])
        : { t: TRUE_TAINTED, r: TRUE_ROUTES }
      const tPin = join(dir, `${kind}-t.json`)
      const rPin = join(dir, `${kind}-r.json`)
      writeFileSync(tPin, JSON.stringify(t))
      writeFileSync(rPin, JSON.stringify(r))
      return {
        wantText: f.wantText,
        env: {
          PRICING_GATE_ROOT: tree,
          PRICING_GATE_EXPECT_TAINTED: tPin,
          PRICING_GATE_EXPECT_ROUTES: rPin,
          PRICING_GATE_MIN_FILES: '1',
          PRICING_GATE_MIN_ROUTES: '1',
        },
      }
    }

    const runCopy = (body: string, env: Record<string, string>): Run => {
      writeFileSync(mutantAbs, body)
      const r = spawnSync('npx', ['tsx', MUTANT_PATH], {
        cwd: REPO, env: { ...process.env, ...env }, encoding: 'utf8',
        shell: process.platform === 'win32',
      })
      return { code: r.status ?? -1, stdout: r.stdout ?? '', stderr: r.stderr ?? '' }
    }

    const kinds = Object.keys(DISARM_FIXTURES) as FixtureKind[]
    const built = new Map<FixtureKind, ReturnType<typeof buildFixture>>()
    let anyControlFailed = false

    // One control per fixture kind. Without these, a mutant that "fails the
    // contract" because the fixture never provoked the healthy gate in the
    // first place reads as caught — which is precisely the bug this rewrite
    // fixes, and it was invisible until the mutant list grew.
    for (const kind of kinds) {
      const f = buildFixture(kind)
      built.set(kind, f)
      const control = runCopy(src, f.env)
      casesRun++
      const ok = judgeRun(control, 1, f.wantText)
      judged++
      if (ok) {
        console.log(`  ✓ control [${kind}]: the unmutated gate rejects this fixture`)
      } else {
        failures++
        anyControlFailed = true
        console.error(`  ✗ control [${kind}]: the unmutated gate does NOT reject this fixture`)
        console.error(`      exit ${control.code}, wanted 1 containing ${JSON.stringify(f.wantText)}`)
        console.error(`      output:\n        ${(control.stdout + control.stderr).trim().split('\n').slice(0, 8).join('\n        ')}`)
      }
    }

    if (anyControlFailed) {
      console.error('  … mutants SKIPPED: with a control failing, every one of them would read as caught.')
      // Still count them, so the exact-case check does not mask the skip.
      for (const m of DISARM_MUTANTS) {
        casesRun++; judged++; failures++
        console.error(`  ✗ ${m.name}: not evaluated (a control failed)`)
      }
      return
    }

    for (const m of DISARM_MUTANTS) {
      casesRun++
      const occurrences = src.split(m.find).length - 1
      if (occurrences !== 1) {
        judged++
        failures++
        console.error(`  ✗ ${m.name}: anchor appears ${occurrences} time(s) in the gate, need exactly 1 — nothing was proved`)
        console.error(`      anchor: ${JSON.stringify(m.find)}`)
        continue
      }
      const f = built.get(m.fixture)!
      const run = runCopy(src.replace(m.find, m.replace), f.env)
      // A CRASH is not a caught mutant — see the note on the control above.
      const reachedAVerdict = run.code === 0 || run.code === 1
      const survived = judgeRun(run, 1, f.wantText)
      judged++
      if (!reachedAVerdict) {
        failures++
        console.error(`  ✗ ${m.name}: the mutated copy exited ${run.code} without reaching a verdict — nothing was proved`)
        console.error(`      output:\n        ${(run.stdout + run.stderr).trim().split('\n').slice(0, 8).join('\n        ')}`)
      } else if (!survived) {
        console.log(`  ✓ ${m.name} [${m.fixture}] — this suite would notice (exit ${run.code})`)
      } else {
        failures++
        console.error(`  ✗ ${m.name} [${m.fixture}] SURVIVED: the disarmed gate still satisfies this suite's contract`)
      }
    }
  } finally {
    rmSync(mutantAbs, { force: true })
    rmSync(dir, { recursive: true, force: true })
  }
}
// ── Main ───────────────────────────────────────────────────────────────────

/**
 * EXACT, not a floor — and the floor it replaces was measured to be useless.
 * At `MIN_CASES = 10`, emptying the `fixtures` array deleted all ten synthetic
 * analyzer tests (including "revalidate=false is rejected" and "taint crosses
 * a default export") and left exactly 10 cases from the other two sections, so
 * `10 < 10` was FALSE and the suite printed `10 case(s) · 10 judged · 0
 * failure(s) · OK`. A whole test category vanished with no signal, sitting
 * precisely on the boundary. Derived from the three section sizes so it moves
 * when a section legitimately does, rather than being a hand-typed number that
 * rots — but it is an equality, so a section quietly shrinking is still red.
 */
const EXPECTED_CASES =
  fixtures.length +                    // synthetic (no separate control; each IS its own assertion)
  1 + mutations.length +               // real-tree: ONE shared control, then the mutations
  Object.keys(DISARM_FIXTURES).length + DISARM_MUTANTS.length  // disarmed: one control PER FIXTURE KIND, then the mutants

function main(): void {
  assertJudgeDiscriminates()
  runSynthetic()
  runRealTree()
  runDisarmed()

  console.log(`\npricing-revalidate contract: ${casesRun} case(s) · ${judged} judged · ${failures} failure(s)`)

  if (judged !== casesRun) {
    console.error(`✗ ${casesRun} cases ran but only ${judged} were judged — a skip sits between the two.`)
    failures++
  }
  if (casesRun !== EXPECTED_CASES) {
    console.error(
      `✗ ${casesRun} cases ran, expected exactly ${EXPECTED_CASES} ` +
      `(${fixtures.length} synthetic + ${1 + mutations.length} real-tree + ${1 + DISARM_MUTANTS.length} disarmed). ` +
      `A section was skipped or emptied — an inequality would pass that, which is how ` +
      `emptying all ten synthetic fixtures once sat exactly on a floor of 10 and printed OK.`,
    )
    failures++
  }
  if (failures > 0) {
    console.error(`\n${failures} failure(s) — see above.`)
    process.exit(1)
  }
  console.log('OK')
}

main()
