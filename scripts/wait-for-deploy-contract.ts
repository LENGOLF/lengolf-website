/**
 * Contract suite for scripts/wait-for-deploy.ts, the post-merge deploy poller
 * behind .github/workflows/deploy-check.yml.
 *
 * The poller only ever runs on main, AFTER a merge, so the day a bug in it
 * matters is the day it silently reports a stranded commit as deployed. Its
 * one job is to never exit 0 unless production serves the pushed commit or a
 * descendant, and the only way to check a job like that is from OUTSIDE: this
 * suite spawns the real script as a child process against a local stub of the
 * three things it talks to (the site's /api/build-info/ marker, the GitHub
 * compare + combined-status API, and a Vercel deploy hook) and asserts the
 * exit code, the GITHUB_OUTPUT values the workflow keys on, and how often the
 * hook was fired. Same argument as validate:open-graph:contract and
 * validate:pricing-revalidate:contract: a verdict that is right paired with an
 * exit code that is wrong is invisible to any in-process check.
 *
 * The stub REJECTS a compare call whose base is not the pushed SHA. That pins
 * the argument order, which matters more than it looks: with base and head
 * swapped, the real API calls an OLD deployment "ahead", and the poller would
 * read a stale site as live.
 *
 * Then DISARM_MUTANTS: deliberately broken copies of the poller, each run
 * against the one case its break should turn red, behind an unmutated control
 * over the same cases. When you add a verdict to the poller, add its disarm
 * here in the same commit; "the mutants I thought of are caught" is not
 * coverage, which is the lesson validate-pricing-revalidate-contract.ts
 * recorded the hard way.
 *
 * Anti-vacuity: an EXACT case count and an exact mutant count (a floor let a
 * whole category vanish while printing OK in the pricing suite), `judged++`
 * AFTER each verdict with `judged !== casesRun` checked at the end, and a
 * judge self-check before anything runs, because a judge pinned to "pass" is
 * the one failure no counter can see.
 *
 * No network: everything is 127.0.0.1. Runs cases four at a time; timing
 * cases key on the stub's own hit counts or elapsed time, never on sleeps.
 */

import { spawn } from 'child_process'
import { createServer } from 'http'
import type { AddressInfo } from 'net'
import { mkdtempSync, readFileSync, writeFileSync, rmSync, existsSync } from 'fs'
import { tmpdir } from 'os'
import { join, resolve } from 'path'

const REPO = resolve('.')
const POLLER = join(REPO, 'scripts', 'wait-for-deploy.ts')

const PUSHED = '1111111111111111111111111111111111111111'
const OLD = '2222222222222222222222222222222222222222'
const NEWER = '3333333333333333333333333333333333333333'
const OTHER = '4444444444444444444444444444444444444444'
const TOKEN = 't0ken'

const TIMEOUT_MS = 1200
const POLL_MS = 50
const GRACE_MS = 800
const KILL_AFTER_MS = 20_000
const CONCURRENCY = 4

const EXPECTED_CASES = 20
const EXPECTED_MUTANTS = 12

// ── Stub ───────────────────────────────────────────────────────────

type Rel = 'identical' | 'ahead' | 'behind' | 'diverged'
interface MarkerReply { status: number; body: string; type?: string }
interface VercelStatus { state: string; target_url: string }

interface Stub {
  /** hit is 1-based; elapsedMs counts from the FIRST marker hit. */
  marker: (hit: number, elapsedMs: number, hookHits: number) => MarkerReply
  /** Keyed by the compare HEAD (the live SHA). Missing key -> 404. */
  relation?: Record<string, Rel>
  vercel?: VercelStatus | null
}

const json = (o: unknown): MarkerReply => ({ status: 200, body: JSON.stringify(o) })
const serves = (sha: string | null) => () => json({ sha })

// The two target_url shapes Vercel actually posted, from the commit statuses
// on 9a3c0d7 (#131, blocked by the author gate) and fe1c5c4 (#132, deployed).
const DOCS_URL = 'https://vercel.com/docs/accounts/team-members-and-roles'
const DPL_URL = 'https://vercel.com/david2928s-projects/lengolf-website/AbCdEf123'
const AUTHOR_GATE: VercelStatus = { state: 'failure', target_url: DOCS_URL }
const BUILD_FAILED: VercelStatus = { state: 'failure', target_url: DPL_URL }
const BUILDING: VercelStatus = { state: 'pending', target_url: DPL_URL }

interface Running {
  url: string
  hits: { marker: number; hook: number }
  close: () => Promise<void>
}

async function startStub(stub: Stub): Promise<Running> {
  const hits = { marker: 0, hook: 0 }
  let firstMarkerAt = 0
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://stub')
    const send = (status: number, body: string, type = 'application/json') => {
      res.writeHead(status, { 'content-type': type })
      res.end(body)
    }
    if (req.method === 'POST' && url.pathname === '/hook') {
      hits.hook++
      return send(201, '{"job":{"state":"PENDING"}}')
    }
    if (url.pathname === '/api/build-info/') {
      hits.marker++
      if (!firstMarkerAt) firstMarkerAt = Date.now()
      const m = stub.marker(hits.marker, Date.now() - firstMarkerAt, hits.hook)
      return send(m.status, m.body, m.type)
    }
    const isApi = url.pathname.startsWith('/repos/')
    if (isApi && req.headers.authorization !== `Bearer ${TOKEN}`) return send(401, '{"message":"Bad credentials"}')
    const cmp = url.pathname.match(/^\/repos\/o\/r\/compare\/([0-9a-f]+)\.\.\.([0-9a-f]+)$/)
    if (cmp) {
      if (cmp[1] !== PUSHED) return send(422, '{"message":"stub: compare base must be the pushed SHA"}')
      const rel = stub.relation?.[cmp[2]]
      return rel ? send(200, JSON.stringify({ status: rel })) : send(404, '{"message":"Not Found"}')
    }
    const st = url.pathname.match(/^\/repos\/o\/r\/commits\/([0-9a-f]+)\/status$/)
    if (st) {
      if (st[1] !== PUSHED) return send(422, '{"message":"stub: status must be read for the pushed SHA"}')
      const statuses = stub.vercel ? [{ context: 'Vercel', ...stub.vercel }] : []
      return send(200, JSON.stringify({ state: stub.vercel?.state ?? 'pending', statuses }))
    }
    send(404, '{"message":"stub: no such route"}')
  })
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r))
  const port = (server.address() as AddressInfo).port
  return {
    url: `http://127.0.0.1:${port}`,
    hits,
    close: () =>
      new Promise<void>((r) => {
        server.closeAllConnections()
        server.close(() => r())
      }),
  }
}

async function closedPortUrl(): Promise<string> {
  const s = await startStub({ marker: serves(null) })
  const url = s.url
  await s.close()
  return `${url}/api/build-info/`
}

// ── Running the poller ─────────────────────────────────────────────

interface Run {
  code: number
  stdout: string
  stderr: string
  outputs: Record<string, string>
  hung: boolean
}

function parseOutputs(text: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const line of text.split(/\r?\n/)) {
    const i = line.indexOf('=')
    if (i > 0) out[line.slice(0, i)] = line.slice(i + 1)
  }
  return out
}

function runPoller(script: string, env: Record<string, string>): Promise<Run> {
  const dir = mkdtempSync(join(tmpdir(), 'deploy-check-'))
  const outFile = join(dir, 'github_output')
  writeFileSync(outFile, '')
  return new Promise((done) => {
    const child = spawn('npx', ['tsx', script], {
      cwd: REPO,
      // Blank everything a CI runner would otherwise leak in: the lint job
      // has its own GITHUB_OUTPUT/GITHUB_STEP_SUMMARY/GITHUB_SHA, and a child
      // writing into the real step summary would be a bug in this suite.
      env: {
        ...process.env,
        GITHUB_SHA: '',
        GITHUB_STEP_SUMMARY: '',
        VERCEL_DEPLOY_HOOK_URL: '',
        ...env,
        GITHUB_OUTPUT: outFile,
      },
      shell: process.platform === 'win32',
    })
    let stdout = ''
    let stderr = ''
    let hung = false
    child.stdout.on('data', (d) => (stdout += d))
    child.stderr.on('data', (d) => (stderr += d))
    const timer = setTimeout(() => {
      hung = true
      child.kill('SIGKILL')
    }, KILL_AFTER_MS)
    child.on('close', (code) => {
      clearTimeout(timer)
      const outputs = parseOutputs(existsSync(outFile) ? readFileSync(outFile, 'utf8') : '')
      rmSync(dir, { recursive: true, force: true })
      done({ code: code ?? -1, stdout, stderr, outputs, hung })
    })
  })
}

// ── Cases ──────────────────────────────────────────────────────────

interface Want {
  code: number
  outputs?: Record<string, string>
  hookHits?: number
  /** The hook must have landed the deploy BEFORE the first deadline. */
  elapsedBelowTimeout?: boolean
}

interface Case {
  name: string
  stub: Stub
  hook?: boolean
  env?: Record<string, string>
  closedMarker?: boolean
  want: Want
}

const CASES: Case[] = [
  // -- live: must exit 0 --
  {
    name: 'live-identical',
    stub: { marker: serves(PUSHED) },
    want: { code: 0, outputs: { verdict: 'live', live_sha: PUSHED, diff_base: '' } },
  },
  {
    name: 'live-after-old',
    stub: { marker: (hit) => json({ sha: hit <= 2 ? OLD : PUSHED }), relation: { [OLD]: 'behind' } },
    // The first observation was an older deploy, so IndexNow diffs from it.
    want: { code: 0, outputs: { verdict: 'live', diff_base: OLD } },
  },
  {
    name: 'live-descendant',
    // Two merges inside one build window: Vercel built only the later one.
    stub: { marker: serves(NEWER), relation: { [NEWER]: 'ahead' } },
    want: { code: 0, outputs: { verdict: 'live', live_sha: NEWER, diff_base: '' } },
  },
  // -- stale: must exit 1, and classify what Vercel said --
  {
    name: 'stale-author-gate',
    stub: { marker: serves(OLD), relation: { [OLD]: 'behind' }, vercel: AUTHOR_GATE },
    want: { code: 1, outputs: { verdict: 'missing', live_sha: OLD, vercel_state: 'author-gate', hook_fired: 'false' }, hookHits: 0 },
  },
  {
    name: 'stale-build-failed',
    stub: { marker: serves(OLD), relation: { [OLD]: 'behind' }, vercel: BUILD_FAILED },
    want: { code: 1, outputs: { verdict: 'missing', vercel_state: 'build-failed' } },
  },
  {
    name: 'stale-no-status',
    stub: { marker: serves(OLD), relation: { [OLD]: 'behind' }, vercel: null },
    want: { code: 1, outputs: { verdict: 'missing', vercel_state: 'none' } },
  },
  // -- a marker that is not a full SHA must never read as live --
  {
    name: 'marker-404',
    stub: { marker: () => ({ status: 404, body: 'Not Found', type: 'text/plain' }) },
    want: { code: 1, outputs: { verdict: 'missing', live_sha: '' } },
  },
  {
    name: 'marker-null-sha',
    stub: { marker: serves(null) },
    want: { code: 1, outputs: { verdict: 'missing', live_sha: '' } },
  },
  {
    name: 'marker-html',
    stub: { marker: () => ({ status: 200, body: `<!DOCTYPE html><html><body>${PUSHED}</body></html>`, type: 'text/html' }) },
    want: { code: 1, outputs: { verdict: 'missing', live_sha: '' } },
  },
  {
    name: 'marker-short-sha',
    stub: { marker: serves(PUSHED.slice(0, 7)) },
    want: { code: 1, outputs: { verdict: 'missing', live_sha: '' } },
  },
  {
    name: 'diverged',
    stub: { marker: serves(OTHER), relation: { [OTHER]: 'diverged' } },
    want: { code: 1, outputs: { verdict: 'missing', live_sha: OTHER } },
  },
  {
    name: 'compare-404',
    // A live SHA GitHub does not know (or an API error) is NOT containment.
    stub: { marker: serves(OTHER) },
    want: { code: 1, outputs: { verdict: 'missing', live_sha: OTHER } },
  },
  // -- the deploy hook --
  {
    name: 'hook-early',
    stub: {
      marker: (_hit, _elapsed, hookHits) => json({ sha: hookHits > 0 ? PUSHED : OLD }),
      relation: { [OLD]: 'behind' },
      vercel: AUTHOR_GATE,
    },
    hook: true,
    want: { code: 0, outputs: { verdict: 'live', hook_fired: 'true' }, hookHits: 1, elapsedBelowTimeout: true },
  },
  {
    name: 'hook-once-when-it-does-nothing',
    // The hook fires early on the author gate and changes nothing (the case
    // to fear if hooks turn out NOT to bypass the gate). Exactly one call,
    // never one per poll and never a second at the deadline.
    stub: { marker: serves(OLD), relation: { [OLD]: 'behind' }, vercel: AUTHOR_GATE },
    hook: true,
    want: { code: 1, outputs: { verdict: 'missing', vercel_state: 'author-gate', hook_fired: 'true' }, hookHits: 1 },
  },
  {
    name: 'hook-at-deadline',
    // No status at all (integration not firing): hook once at the deadline,
    // one grace window, then give up. Never a second hook.
    stub: { marker: serves(OLD), relation: { [OLD]: 'behind' }, vercel: null },
    hook: true,
    want: { code: 1, outputs: { verdict: 'missing', hook_fired: 'true' }, hookHits: 1 },
  },
  {
    name: 'hook-not-on-build-failed',
    // A real build error needs a human; redeploying the same code fails again.
    stub: { marker: serves(OLD), relation: { [OLD]: 'behind' }, vercel: BUILD_FAILED },
    hook: true,
    want: { code: 1, outputs: { verdict: 'missing', hook_fired: 'false' }, hookHits: 0 },
  },
  {
    name: 'grace-when-building',
    // Vercel is still building at the deadline: one grace window, and the
    // deploy lands inside it. Without the grace this exits 1 at the deadline.
    stub: {
      marker: (_hit, elapsed) => json({ sha: elapsed > TIMEOUT_MS + 200 ? PUSHED : OLD }),
      relation: { [OLD]: 'behind' },
      vercel: BUILDING,
    },
    want: { code: 0, outputs: { verdict: 'live' }, hookHits: 0 },
  },
  // -- the check itself cannot run: exit 2, never 0 --
  {
    name: 'bad-sha',
    stub: { marker: serves(PUSHED) },
    env: { DEPLOY_SHA: 'abc' },
    want: { code: 2 },
  },
  {
    name: 'missing-token',
    stub: { marker: serves(PUSHED) },
    env: { GITHUB_TOKEN: '' },
    want: { code: 2 },
  },
  {
    name: 'marker-unreachable',
    // Network errors are "not live yet", a clean verdict, not a crash.
    stub: { marker: serves(PUSHED) },
    closedMarker: true,
    want: { code: 1, outputs: { verdict: 'missing', live_sha: '' } },
  },
]

// ── Judge ──────────────────────────────────────────────────────────

/** Pure: the verdict on one run. Exercised on synthetic runs before any case. */
function judge(run: Run, want: Want, hookHits: number): string[] {
  const problems: string[] = []
  if (run.hung) problems.push(`hung, killed after ${KILL_AFTER_MS}ms`)
  if (run.code !== want.code) problems.push(`exit ${run.code}, want ${want.code}`)
  for (const [k, v] of Object.entries(want.outputs ?? {})) {
    const got = run.outputs[k]
    if (got !== v) problems.push(`output ${k}=${JSON.stringify(got)}, want ${JSON.stringify(v)}`)
  }
  if (want.hookHits !== undefined && hookHits !== want.hookHits) {
    problems.push(`deploy hook fired ${hookHits} time(s), want ${want.hookHits}`)
  }
  if (want.elapsedBelowTimeout) {
    const e = Number(run.outputs.elapsed_ms)
    if (!(e < TIMEOUT_MS)) problems.push(`elapsed_ms=${run.outputs.elapsed_ms}, want < ${TIMEOUT_MS} (hook fired late?)`)
  }
  return problems
}

function assertJudgeDiscriminates(): void {
  const ok: Run = { code: 0, stdout: '', stderr: '', outputs: { verdict: 'live', elapsed_ms: '10' }, hung: false }
  const want: Want = { code: 0, outputs: { verdict: 'live' }, hookHits: 0, elapsedBelowTimeout: true }
  const checks: Array<[string, boolean]> = [
    ['accepts a matching run', judge(ok, want, 0).length === 0],
    ['rejects a wrong exit code', judge({ ...ok, code: 1 }, want, 0).length > 0],
    ['rejects a wrong output', judge({ ...ok, outputs: { ...ok.outputs, verdict: 'missing' } }, want, 0).length > 0],
    ['rejects a missing output', judge({ ...ok, outputs: { elapsed_ms: '10' } }, want, 0).length > 0],
    ['rejects a wrong hook count', judge(ok, want, 1).length > 0],
    ['rejects a late hook', judge({ ...ok, outputs: { ...ok.outputs, elapsed_ms: String(TIMEOUT_MS) } }, want, 0).length > 0],
    ['rejects a hung run', judge({ ...ok, hung: true }, want, 0).length > 0],
  ]
  const broken = checks.filter(([, good]) => !good)
  if (broken.length > 0) {
    for (const [name] of broken) console.error(`  ✗ judge self-check: ${name}`)
    console.error('The judge no longer discriminates; nothing below would mean anything.')
    process.exit(1)
  }
}

async function runCase(script: string, c: Case): Promise<string[]> {
  const stub = await startStub(c.stub)
  try {
    const env: Record<string, string> = {
      DEPLOY_SHA: PUSHED,
      GITHUB_REPOSITORY: 'o/r',
      GITHUB_TOKEN: TOKEN,
      GITHUB_API_URL: stub.url,
      MARKER_URL: c.closedMarker ? await closedPortUrl() : `${stub.url}/api/build-info/`,
      DEPLOY_TIMEOUT_MS: String(TIMEOUT_MS),
      DEPLOY_POLL_MS: String(POLL_MS),
      DEPLOY_GRACE_MS: String(GRACE_MS),
      ...(c.hook ? { VERCEL_DEPLOY_HOOK_URL: `${stub.url}/hook` } : {}),
      ...c.env,
    }
    const run = await runPoller(script, env)
    const problems = judge(run, c.want, stub.hits.hook)
    if (problems.length > 0) {
      const tail = (run.stdout + run.stderr).trim().split('\n').slice(-6).join('\n        ')
      problems.push(`output tail:\n        ${tail}`)
    }
    return problems
  } finally {
    await stub.close()
  }
}

async function pool<T, R>(items: T[], n: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (next < items.length) {
        const i = next++
        results[i] = await fn(items[i])
      }
    }),
  )
  return results
}

// ── Disarm mutants ─────────────────────────────────────────────────

interface Mutant { name: string; find: string; replace: string; target: string }

const DISARM_MUTANTS: Mutant[] = [
  {
    name: 'contains() accepts an OLDER live build',
    find: "  return rel === 'identical' || rel === 'ahead'\n",
    replace: "  return rel === 'identical' || rel === 'ahead' || rel === 'behind'\n",
    target: 'stale-author-gate',
  },
  {
    name: 'contains() accepts an unknown relation (API error / 404)',
    find: "  return rel === 'identical' || rel === 'ahead'\n",
    replace: "  return rel === 'identical' || rel === 'ahead' || rel === 'unknown'\n",
    target: 'compare-404',
  },
  {
    name: 'compare base and head swapped',
    find: '/compare/${cfg.sha}...${live}',
    replace: '/compare/${live}...${cfg.sha}',
    target: 'live-descendant',
  },
  {
    name: 'a missing deploy exits 0',
    find: 'const EXIT = { live: 0, missing: 1, broken: 2 } as const',
    replace: 'const EXIT = { live: 0, missing: 0, broken: 2 } as const',
    target: 'stale-author-gate',
  },
  {
    name: 'early hook on the author gate removed',
    find: "    if (vercel.state === 'author-gate' && cfg.hookUrl && !hookFired) {",
    replace: '    if (false) {',
    target: 'hook-early',
  },
  {
    name: 'author-gate classification removed',
    find: "  const state: VercelState = DOCS_URL_RE.test(url) ? 'author-gate' : 'build-failed'",
    replace: "  const state: VercelState = 'build-failed'",
    target: 'stale-author-gate',
  },
  {
    name: 'GITHUB_OUTPUT never written',
    find: '  if (file) appendFileSync(file, lines)',
    replace: '  if (false) appendFileSync(file, lines)',
    target: 'live-identical',
  },
  {
    name: 'no grace window while Vercel is still building',
    find: "  if (s.vercel === 'building' || s.vercel === 'built') return 'extend'",
    replace: "  if (s.vercel === 'building' || s.vercel === 'built') return 'fail'",
    target: 'grace-when-building',
  },
  {
    name: 'hook fired on a real build failure',
    find: "  if (s.vercel === 'build-failed') return 'fail'\n",
    replace: '',
    target: 'hook-not-on-build-failed',
  },
  {
    name: 'hook fired again at the deadline',
    find: "  if (s.hookConfigured && !s.hookFired) return 'fire-and-extend'",
    replace: "  if (s.hookConfigured) return 'fire-and-extend'",
    target: 'hook-once-when-it-does-nothing',
  },
  {
    name: 'hook fired on every author-gate poll',
    find: "    if (vercel.state === 'author-gate' && cfg.hookUrl && !hookFired) {",
    replace: "    if (vercel.state === 'author-gate' && cfg.hookUrl) {",
    target: 'hook-once-when-it-does-nothing',
  },
  {
    name: 'diff_base ignores ancestry',
    find: "      diff_base: firstLive && firstRel === 'behind' ? firstLive : '',",
    replace: "      diff_base: firstLive ? firstLive : '',",
    target: 'live-descendant',
  },
]

// ── Main ───────────────────────────────────────────────────────────

async function main(): Promise<void> {
  assertJudgeDiscriminates()
  let casesRun = 0
  let judged = 0
  let failures = 0

  console.log(`wait-for-deploy contract: ${CASES.length} case(s) against the real poller`)
  const results = await pool(CASES, CONCURRENCY, async (c) => {
    casesRun++
    const problems = await runCase(POLLER, c)
    judged++
    return { c, problems }
  })
  for (const { c, problems } of results) {
    if (problems.length === 0) console.log(`  ✓ ${c.name}`)
    else {
      failures++
      console.error(`  ✗ ${c.name}: ${problems.join('; ')}`)
    }
  }

  // Mutants run as temp copies with CRLF normalised, so a Windows checkout
  // does not turn every anchor into "appears 0 times".
  const src = readFileSync(POLLER, 'utf8').replace(/\r\n/g, '\n')
  const byName = new Map(CASES.map((c) => [c.name, c]))
  const dir = mkdtempSync(join(tmpdir(), 'deploy-check-mutants-'))
  try {
    const write = (name: string, text: string) => {
      const p = join(dir, `${name}.ts`)
      writeFileSync(p, text)
      return p
    }
    console.log(`control: the unmodified poller on every mutant target`)
    const controlScript = write('control', src)
    const targets = [...new Set(DISARM_MUTANTS.map((m) => m.target))]
    const controlResults = await pool(targets, CONCURRENCY, async (t) => ({ t, problems: await runCase(controlScript, byName.get(t)!) }))
    const controlFailed = controlResults.filter((r) => r.problems.length > 0)
    for (const r of controlResults) {
      if (r.problems.length === 0) console.log(`  ✓ control / ${r.t}`)
      else console.error(`  ✗ control / ${r.t}: ${r.problems.join('; ')}`)
    }

    console.log(`disarm mutants: each must FAIL its target case`)
    if (controlFailed.length > 0) {
      failures += controlFailed.length
      for (const m of DISARM_MUTANTS) {
        casesRun++
        judged++
        failures++
        console.error(`  ✗ ${m.name}: not evaluated (a control failed)`)
      }
    } else {
      const mutantResults = await pool(DISARM_MUTANTS, CONCURRENCY, async (m) => {
        casesRun++
        const occurrences = src.split(m.find).length - 1
        if (occurrences !== 1) {
          judged++
          return { m, verdict: `anchor appears ${occurrences} time(s) in the poller, need exactly 1: ${JSON.stringify(m.find)}` }
        }
        const target = byName.get(m.target)
        if (!target) {
          judged++
          return { m, verdict: `no case named ${m.target}` }
        }
        const script = write(`mutant-${DISARM_MUTANTS.indexOf(m)}`, src.replace(m.find, m.replace))
        const problems = await runCase(script, target)
        judged++
        return { m, verdict: problems.length > 0 ? null : `SURVIVED: ${m.target} still passes with this break in place` }
      })
      for (const { m, verdict } of mutantResults) {
        if (verdict === null) console.log(`  ✓ ${m.name} (caught by ${m.target})`)
        else {
          failures++
          console.error(`  ✗ ${m.name}: ${verdict}`)
        }
      }
    }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }

  const wantRun = EXPECTED_CASES + EXPECTED_MUTANTS
  if (CASES.length !== EXPECTED_CASES) {
    failures++
    console.error(`  ✗ case inventory: ${CASES.length} case(s), EXPECTED_CASES is ${EXPECTED_CASES}. Update both together.`)
  }
  if (DISARM_MUTANTS.length !== EXPECTED_MUTANTS) {
    failures++
    console.error(`  ✗ mutant inventory: ${DISARM_MUTANTS.length} mutant(s), EXPECTED_MUTANTS is ${EXPECTED_MUTANTS}. Update both together.`)
  }
  if (casesRun !== wantRun || judged !== casesRun) {
    failures++
    console.error(`  ✗ coverage: ${casesRun} started, ${judged} judged, want ${wantRun} of each`)
  }

  console.log(`${CASES.length} case(s) · ${DISARM_MUTANTS.length} mutant(s) · ${judged} judged · ${failures} failure(s) · ${failures === 0 ? 'OK' : 'FAIL'}`)
  process.exit(failures === 0 ? 0 : 1)
}

main().catch((err) => {
  console.error('wait-for-deploy contract crashed:', err)
  process.exit(1)
})
