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

function expect(name: string, run: Run, wantCode: number, wantText?: string): void {
  casesRun++
  const codeOk = run.code === wantCode
  const textOk = wantText === undefined || (run.stdout + run.stderr).includes(wantText)
  // Incremented AFTER both comparisons: a `continue` above this line would
  // leave casesRun at its true value while asserting nothing.
  judged++
  if (codeOk && textOk) {
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
    wantText: 'declares no `export const revalidate`',
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
    wantText: 'which is Infinity',
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
  const src = readFileSync(GATE, 'utf8')
  const grab = (name: string): string[] => {
    const start = src.indexOf(`const ${name}: string[] = [`)
    if (start < 0) throw new Error(`contract suite cannot find ${name} in the gate`)
    const open = src.indexOf('[', start)
    const close = src.indexOf('\n]', open)
    if (close < 0) throw new Error(`contract suite cannot delimit ${name}`)
    return [...src.slice(open, close).matchAll(/'([^']+)'/g)].map(m => m[1])
  }
  return { tainted: grab('EXPECTED_TAINTED_LITERAL'), routes: grab('EXPECTED_PRICING_ROUTES_LITERAL') }
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
const MUST_FAIL_TEXT = 'declares no `export const revalidate`'

const DISARM_MUTANTS: Array<{ name: string; find: string; replace: string }> = [
  { name: 'process.exit(1) deleted', find: '    process.exit(1)\n  }\n  console.log(\'OK\')', replace: '    // process.exit(1)\n  }\n  console.log(\'OK\')' },
  { name: 'problems.length > 0 pinned false', find: '  if (problems.length > 0) {', replace: '  if (false && problems.length > 0) {' },
  { name: 'the missing-revalidate branch disarmed', find: "    if (rv.kind === 'missing') {", replace: '    if (false) {' },
  { name: 'the pricing-route check short-circuited', find: '    if (hits.length === 0) continue', replace: '    if (true) continue' },
]

function runDisarmed(): void {
  console.log('\nDisarmed-gate fixtures (exit-code integrity):')
  const dir = mkdtempSync(join(tmpdir(), 'pricing-disarm-'))
  const mutantAbs = join(REPO, MUTANT_PATH)
  try {
    // A fixture the healthy gate MUST reject.
    const tree = join(dir, 'tree')
    mkdirSync(join(tree, 'lib'), { recursive: true })
    mkdirSync(join(tree, 'app', 'p'), { recursive: true })
    writeFileSync(join(tree, 'lib', 'pricing.ts'), PRICING_MODULE)
    writeFileSync(join(tree, 'lib', 'site-facts.ts'), SITE_FACTS)
    writeFileSync(join(tree, 'app', 'p', 'page.tsx'),
      `import { getSiteFacts } from '@/lib/site-facts'
export default async function P() { return String(await getSiteFacts()) }
`)
    const tPin = join(dir, 't.json')
    const rPin = join(dir, 'r.json')
    writeFileSync(tPin, JSON.stringify(['app/p/page.tsx#P', 'app/p/page.tsx#default', 'lib/pricing.ts#getPricingCatalog', 'lib/site-facts.ts#getSiteFacts']))
    writeFileSync(rPin, JSON.stringify(['app/p/page.tsx']))

    const env = {
      PRICING_GATE_ROOT: tree,
      PRICING_GATE_EXPECT_TAINTED: tPin,
      PRICING_GATE_EXPECT_ROUTES: rPin,
      PRICING_GATE_MIN_FILES: '1',
      PRICING_GATE_MIN_ROUTES: '1',
    }

    const src = readFileSync(GATE, 'utf8')

    const runCopy = (body: string): Run => {
      writeFileSync(mutantAbs, body)
      const r = spawnSync('npx', ['tsx', MUTANT_PATH], {
        cwd: REPO, env: { ...process.env, ...env }, encoding: 'utf8',
        shell: process.platform === 'win32',
      })
      return { code: r.status ?? -1, stdout: r.stdout ?? '', stderr: r.stderr ?? '' }
    }

    /** The suite's contract: what an ARMED gate does to a must-fail fixture. */
    const satisfiesContract = (r: Run) =>
      r.code === 1 && (r.stdout + r.stderr).includes(MUST_FAIL_TEXT)

    const control = runCopy(src)
    casesRun++
    const controlOk = satisfiesContract(control)
    judged++
    if (controlOk) {
      console.log('  ✓ control: an unmutated copy of the gate rejects the bad fixture')
    } else {
      failures++
      console.error('  ✗ control: an unmutated copy of the gate rejects the bad fixture')
      console.error(`      exit ${control.code}; every mutant below would read as caught, so they are SKIPPED`)
      console.error(`      output:\n        ${(control.stdout + control.stderr).trim().split('\n').slice(0, 8).join('\n        ')}`)
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
      const run = runCopy(src.replace(m.find, m.replace))
      // A CRASH is not a caught mutant. Exit codes outside {0,1} mean the copy
      // never reached a verdict — a module-load error, an abort — and "did not
      // satisfy the contract" is then true for a reason that says nothing about
      // the gate's logic. This is the control lesson applied per case: measured
      // once, when a mutant that exits 1 on an idle machine exited 3221226505
      // (a Windows process abort) while a `next build` was running beside it.
      const reachedAVerdict = run.code === 0 || run.code === 1
      const survived = satisfiesContract(run)
      judged++
      if (!reachedAVerdict) {
        failures++
        console.error(`  ✗ ${m.name}: the mutated copy exited ${run.code} without reaching a verdict — nothing was proved`)
        console.error(`      output:\n        ${(run.stdout + run.stderr).trim().split('\n').slice(0, 8).join('\n        ')}`)
      } else if (!survived) {
        console.log(`  ✓ ${m.name} — this suite would notice (exit ${run.code})`)
      } else {
        failures++
        console.error(`  ✗ ${m.name} SURVIVED: the disarmed gate still satisfies this suite's contract`)
      }
    }
  } finally {
    rmSync(mutantAbs, { force: true })
    rmSync(dir, { recursive: true, force: true })
  }
}

// ── Main ───────────────────────────────────────────────────────────────────

const MIN_CASES = 10

function main(): void {
  runSynthetic()
  runRealTree()
  runDisarmed()

  console.log(`\npricing-revalidate contract: ${casesRun} case(s) · ${judged} judged · ${failures} failure(s)`)

  if (judged !== casesRun) {
    console.error(`✗ ${casesRun} cases ran but only ${judged} were judged — a skip sits between the two.`)
    failures++
  }
  if (casesRun < MIN_CASES) {
    console.error(`✗ only ${casesRun} cases ran, floor is ${MIN_CASES}. An emptied case list passes every check above it.`)
    failures++
  }
  if (failures > 0) {
    console.error(`\n${failures} failure(s) — see above.`)
    process.exit(1)
  }
  console.log('OK')
}

main()
