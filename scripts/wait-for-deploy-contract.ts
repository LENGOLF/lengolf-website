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
 * exit code, the GITHUB_OUTPUT values the workflow keys on, the step summary,
 * and how often the hook was fired. Same argument as
 * validate:open-graph:contract and validate:pricing-revalidate:contract: a
 * verdict that is right paired with an exit code that is wrong is invisible
 * to any in-process check.
 *
 * The child is `node --import tsx <script>`, NOT `npx tsx`: npx puts a
 * wrapper (and on Windows a shell) between this suite and the poller, so a
 * SIGKILL on a hung run killed the wrapper while the poller kept the pipes
 * open and the suite never finished. A review pass measured exactly that.
 *
 * The stub REJECTS a compare call whose base is not the pushed SHA. That pins
 * the argument order, which matters more than it looks: with base and head
 * swapped, the real API calls an OLD deployment "ahead", and the poller would
 * read a stale site as live.
 *
 * Then DISARM_MUTANTS: deliberately broken copies of the poller, each run
 * against the one case its break should turn red, after an unmutated control
 * run in the same copy context. When you add a rule to the poller, add its
 * disarm here in the same commit. Nothing forces that except review: the
 * exact EXPECTED_MUTANTS count only pins the array's length. What IS forced
 * is that every anchor must occur exactly once, so editing an anchored line
 * turns its mutant red until the anchor is updated. The first version of this
 * list had 12 mutants and a review pass found about 20 single-line breaks it
 * missed, two of which exited 0 on a stale site; that is the argument for
 * adding mutants eagerly.
 *
 * Anti-vacuity: an EXACT case count and an exact mutant count (a floor let a
 * whole category vanish while printing OK in the pricing suite), `judged++`
 * AFTER each verdict with `judged !== casesRun` checked at the end, and a
 * self-check of both pure verdict functions (the case judge and the mutant
 * verdict) before anything runs, because a verdict pinned to "pass" is the
 * one failure no counter can see.
 *
 * No network: everything is 127.0.0.1. Timing cases key on the stub's own hit
 * counts or elapsed time, never on sleeps, and every timing margin is at
 * least 1.5 seconds (the first version's 600ms flaked 1 run in 7 on 2 CPUs).
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

const TIMEOUT_MS = 2500
const POLL_MS = 50
const GRACE_MS = 4000
/** Flip points for "lands inside the grace window" cases: after the deadline, well before it ends. */
const AFTER_DEADLINE_MS = TIMEOUT_MS + 1500
const KILL_AFTER_MS = 15_000
const CONCURRENCY = 6

const EXPECTED_CASES = 34
const EXPECTED_MUTANTS = 26

const OUTPUT_KEYS = ['verdict', 'live_sha', 'diff_base', 'vercel_state', 'vercel_target_url', 'hook_fired', 'elapsed_ms', 'elapsed_sec']

// ── Stub ───────────────────────────────────────────────────────────

type Rel = 'identical' | 'ahead' | 'behind' | 'diverged'
interface MarkerReply { status: number; body: string; type?: string }
interface VercelStatus { state: string; target_url: string; description?: string }

interface Stub {
  /** hit is 1-based; elapsedMs counts from the FIRST marker hit. */
  marker: (hit: number, elapsedMs: number, hookHits: number) => MarkerReply
  /** Keyed by the compare HEAD (the live SHA). Missing key -> 404. */
  relation?: Record<string, Rel>
  /** Drop the connection on every compare call (a network error, not an HTTP one). */
  compareThrows?: boolean
  /** A constant status, or one per status read (1-based). */
  vercel?: VercelStatus | null | ((statusHit: number) => VercelStatus | null)
  /** Return HTTP 502 on these status reads (1-based). */
  statusFails?: (statusHit: number) => boolean
}

const json = (o: unknown): MarkerReply => ({ status: 200, body: JSON.stringify(o) })
const serves = (sha: string | null) => () => json({ sha })

// The target_url shapes Vercel actually posted: 9a3c0d7 (#131, author gate),
// fe1c5c4 (#132, deployed), bb47144 (#118, "Canceled from the Vercel Dashboard").
const DOCS_URL = 'https://vercel.com/docs/accounts/team-members-and-roles'
const DPL_URL = 'https://vercel.com/david2928s-projects/lengolf-website/AbCdEf123'
const AUTHOR_GATE: VercelStatus = { state: 'failure', target_url: DOCS_URL, description: 'Deployment failed.' }
const BUILD_FAILED: VercelStatus = { state: 'failure', target_url: DPL_URL, description: 'Deployment has failed' }
const BUILD_ERROR: VercelStatus = { state: 'error', target_url: DPL_URL, description: 'Deployment has errored' }
const CANCELED: VercelStatus = { state: 'failure', target_url: DPL_URL, description: 'Canceled from the Vercel Dashboard' }
const BUILDING: VercelStatus = { state: 'pending', target_url: DPL_URL, description: 'Vercel is deploying your app' }
const BUILT: VercelStatus = { state: 'success', target_url: DPL_URL, description: 'Deployment has completed' }

interface Running {
  url: string
  hits: { marker: number; hook: number; status: number }
  close: () => Promise<void>
}

async function startStub(stub: Stub): Promise<Running> {
  const hits = { marker: 0, hook: 0, status: 0 }
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
      if (stub.compareThrows) return req.socket.destroy()
      if (cmp[1] !== PUSHED) return send(422, '{"message":"stub: compare base must be the pushed SHA"}')
      const rel = stub.relation?.[cmp[2]]
      return rel ? send(200, JSON.stringify({ status: rel })) : send(404, '{"message":"Not Found"}')
    }
    const st = url.pathname.match(/^\/repos\/o\/r\/commits\/([0-9a-f]+)\/status$/)
    if (st) {
      hits.status++
      if (st[1] !== PUSHED) return send(422, '{"message":"stub: status must be read for the pushed SHA"}')
      if (stub.statusFails?.(hits.status)) return send(502, '{"message":"Bad Gateway"}')
      const v = typeof stub.vercel === 'function' ? stub.vercel(hits.status) : stub.vercel
      const statuses = v ? [{ context: 'Vercel', ...v }] : []
      return send(200, JSON.stringify({ state: v?.state ?? 'pending', statuses }))
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
  summary: string
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

function runPoller(script: string, env: Record<string, string>, outputIsDir = false): Promise<Run> {
  const dir = mkdtempSync(join(tmpdir(), 'deploy-check-'))
  const outFile = join(dir, 'github_output')
  const summaryFile = join(dir, 'step_summary')
  writeFileSync(outFile, '')
  writeFileSync(summaryFile, '')
  return new Promise((done) => {
    const child = spawn(process.execPath, ['--import', 'tsx', script], {
      cwd: REPO,
      // Blank everything a CI runner would otherwise leak in: the lint job
      // has its own GITHUB_OUTPUT/GITHUB_STEP_SUMMARY/GITHUB_SHA, and a child
      // writing into the real ones would be a bug in this suite.
      env: {
        ...process.env,
        GITHUB_SHA: '',
        VERCEL_DEPLOY_HOOK_URL: '',
        ...env,
        GITHUB_OUTPUT: outputIsDir ? dir : outFile,
        GITHUB_STEP_SUMMARY: summaryFile,
      },
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
      const summary = existsSync(summaryFile) ? readFileSync(summaryFile, 'utf8') : ''
      rmSync(dir, { recursive: true, force: true })
      done({ code: code ?? -1, stdout, stderr, outputs, summary, hung })
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
  /** The run must have reached the first deadline (nothing fired early). */
  elapsedAtLeastTimeout?: boolean
  /** Upper bound on marker reads (a poller that stopped sleeping would blow it). */
  markerHitsAtMost?: number
}

interface Case {
  name: string
  stub: Stub
  hook?: boolean
  env?: Record<string, string>
  closedMarker?: boolean
  outputIsDir?: boolean
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
    want: { code: 0, outputs: { verdict: 'live', live_sha: PUSHED, diff_base: OLD } },
  },
  {
    name: 'live-descendant',
    // A later build shipped first; this commit is live inside it.
    stub: { marker: serves(NEWER), relation: { [NEWER]: 'ahead' } },
    want: { code: 0, outputs: { verdict: 'live', live_sha: NEWER, diff_base: '' } },
  },
  {
    name: 'diff-base-after-unreadable-first-poll',
    // Poll 1 sees no marker. diff_base must come from the first build actually
    // OBSERVED (OLD), not be blanked by the failed first poll.
    stub: {
      marker: (hit) => (hit === 1 ? { status: 404, body: 'Not Found', type: 'text/plain' } : json({ sha: hit <= 3 ? OLD : PUSHED })),
      relation: { [OLD]: 'behind' },
    },
    want: { code: 0, outputs: { verdict: 'live', live_sha: PUSHED, diff_base: OLD } },
  },
  {
    name: 'diff-base-not-from-diverged',
    // A diverged first build (a promoted preview, say) is not something the
    // push range can be diffed from.
    stub: { marker: (hit) => json({ sha: hit <= 2 ? OTHER : PUSHED }), relation: { [OTHER]: 'diverged' } },
    want: { code: 0, outputs: { verdict: 'live', live_sha: PUSHED, diff_base: '' } },
  },
  // -- stale: must exit 1, and classify what Vercel said --
  {
    name: 'stale-author-gate',
    stub: { marker: serves(OLD), relation: { [OLD]: 'behind' }, vercel: AUTHOR_GATE },
    want: {
      code: 1,
      outputs: { verdict: 'missing', live_sha: OLD, vercel_state: 'author-gate', vercel_target_url: DOCS_URL, hook_fired: 'false' },
      hookHits: 0,
      markerHitsAtMost: Math.ceil(TIMEOUT_MS / POLL_MS) + 10,
    },
  },
  {
    name: 'stale-build-failed',
    stub: { marker: serves(OLD), relation: { [OLD]: 'behind' }, vercel: BUILD_FAILED },
    want: { code: 1, outputs: { verdict: 'missing', vercel_state: 'build-failed', vercel_target_url: DPL_URL } },
  },
  {
    name: 'stale-no-status',
    stub: { marker: serves(OLD), relation: { [OLD]: 'behind' }, vercel: null },
    want: { code: 1, outputs: { verdict: 'missing', vercel_state: 'none' } },
  },
  {
    name: 'vercel-error-state',
    // `error` is a failure like `failure`: build-failed, and never a hook.
    stub: { marker: serves(OLD), relation: { [OLD]: 'behind' }, vercel: BUILD_ERROR },
    hook: true,
    want: { code: 1, outputs: { verdict: 'missing', vercel_state: 'build-failed', hook_fired: 'false' }, hookHits: 0 },
  },
  {
    name: 'output-injection',
    // A status value carrying a newline must not forge a GITHUB_OUTPUT line.
    stub: {
      marker: serves(OLD),
      relation: { [OLD]: 'behind' },
      vercel: { state: 'failure', target_url: `${DPL_URL}\nverdict=live`, description: 'Deployment has failed' },
    },
    want: { code: 1, outputs: { verdict: 'missing', vercel_state: 'build-failed' } },
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
    name: 'marker-unreachable',
    // Network errors are "not live yet", a clean verdict, not a crash.
    stub: { marker: serves(PUSHED) },
    closedMarker: true,
    want: { code: 1, outputs: { verdict: 'missing', live_sha: '' } },
  },
  // -- containment must be PROVEN by the compare API --
  {
    name: 'diverged',
    stub: { marker: serves(OTHER), relation: { [OTHER]: 'diverged' } },
    want: { code: 1, outputs: { verdict: 'missing', live_sha: OTHER } },
  },
  {
    name: 'compare-404',
    // A live SHA GitHub does not know is NOT containment.
    stub: { marker: serves(OTHER) },
    want: { code: 1, outputs: { verdict: 'missing', live_sha: OTHER } },
  },
  {
    name: 'compare-network-error',
    // Neither is a compare call that dies on the wire (a timeout, a reset).
    stub: { marker: serves(OLD), relation: { [OLD]: 'behind' }, compareThrows: true },
    want: { code: 1, outputs: { verdict: 'missing', live_sha: OLD } },
  },
  // -- the Vercel status over time --
  {
    name: 'status-unreadable-keeps-build-failed',
    // A 502 on the status read must not reset a known build failure to
    // `none`, which would fire the hook at the deadline.
    stub: { marker: serves(OLD), relation: { [OLD]: 'behind' }, vercel: BUILD_FAILED, statusFails: (hit) => hit > 2 },
    hook: true,
    want: { code: 1, outputs: { verdict: 'missing', vercel_state: 'build-failed', hook_fired: 'false' }, hookHits: 0 },
  },
  {
    name: 'status-unreadable-keeps-building',
    // ...nor a known build in progress, which would skip the grace window.
    stub: {
      marker: (_hit, elapsed) => json({ sha: elapsed > AFTER_DEADLINE_MS ? PUSHED : OLD }),
      relation: { [OLD]: 'behind' },
      vercel: BUILDING,
      statusFails: (hit) => hit > 2,
    },
    want: { code: 0, outputs: { verdict: 'live', vercel_state: 'building' }, hookHits: 0 },
  },
  {
    name: 'status-appears-late',
    // The author gate posts a few seconds after the push. The poller must
    // keep reading the status and fire the hook when it appears, not at the
    // deadline.
    stub: {
      marker: (_hit, _elapsed, hookHits) => json({ sha: hookHits > 0 ? PUSHED : OLD }),
      relation: { [OLD]: 'behind' },
      vercel: (hit) => (hit <= 3 ? null : AUTHOR_GATE),
    },
    hook: true,
    want: { code: 0, outputs: { verdict: 'live', hook_fired: 'true', vercel_state: 'author-gate' }, hookHits: 1, elapsedBelowTimeout: true },
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
    name: 'canceled-fires-hook-at-deadline',
    // A build canceled in the dashboard is not a code problem: redeploying
    // helps. At the deadline, not early (a cancel can be deliberate).
    stub: {
      marker: (_hit, _elapsed, hookHits) => json({ sha: hookHits > 0 ? PUSHED : OLD }),
      relation: { [OLD]: 'behind' },
      vercel: CANCELED,
    },
    hook: true,
    want: { code: 0, outputs: { verdict: 'live', vercel_state: 'canceled', hook_fired: 'true' }, hookHits: 1, elapsedAtLeastTimeout: true },
  },
  {
    name: 'hook-not-on-build-failed',
    // A real build error needs a human; redeploying the same code fails again.
    stub: { marker: serves(OLD), relation: { [OLD]: 'behind' }, vercel: BUILD_FAILED },
    hook: true,
    want: { code: 1, outputs: { verdict: 'missing', hook_fired: 'false' }, hookHits: 0 },
  },
  // -- the grace window --
  {
    name: 'grace-when-building',
    // Vercel is still building at the deadline: one grace window, and the
    // deploy lands inside it. Without the grace this exits 1 at the deadline.
    stub: {
      marker: (_hit, elapsed) => json({ sha: elapsed > AFTER_DEADLINE_MS ? PUSHED : OLD }),
      relation: { [OLD]: 'behind' },
      vercel: BUILDING,
    },
    want: { code: 0, outputs: { verdict: 'live', vercel_state: 'building' }, hookHits: 0 },
  },
  {
    name: 'grace-is-bounded',
    // Built but never served (a Vercel rollback stops promotion): ONE grace
    // window, never a hook while Vercel reports a build, then fail.
    stub: { marker: serves(OLD), relation: { [OLD]: 'behind' }, vercel: BUILT },
    hook: true,
    want: { code: 1, outputs: { verdict: 'missing', vercel_state: 'built', hook_fired: 'false' }, hookHits: 0 },
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
    name: 'missing-repo',
    stub: { marker: serves(PUSHED) },
    env: { GITHUB_REPOSITORY: '' },
    want: { code: 2 },
  },
  {
    // One bad value per case: with two, either check alone still exits 2 and
    // a mutant disarming the other survives.
    name: 'zero-timeout',
    stub: { marker: serves(PUSHED) },
    env: { DEPLOY_TIMEOUT_MS: '0' },
    want: { code: 2 },
  },
  {
    name: 'non-numeric-poll',
    stub: { marker: serves(PUSHED) },
    env: { DEPLOY_POLL_MS: 'soon' },
    want: { code: 2 },
  },
  {
    name: 'outputs-unwritable',
    // The crash path: GITHUB_OUTPUT is a directory, so writing the verdict
    // throws AFTER the site was confirmed live. That is still exit 2, never 0.
    stub: { marker: serves(PUSHED) },
    outputIsDir: true,
    want: { code: 2 },
  },
]

// ── Verdicts ───────────────────────────────────────────────────────

/** Pure: the verdict on one run. */
function judge(run: Run, want: Want, hits: { hook: number; marker: number }): string[] {
  const problems: string[] = []
  if (run.hung) problems.push(`hung, killed after ${KILL_AFTER_MS}ms`)
  if (run.code !== want.code) problems.push(`exit ${run.code}, want ${want.code}`)
  if (want.code === 0 || want.code === 1) {
    // A verdict run must leave the full output set and a summary behind: the
    // workflow's issue and IndexNow steps read them.
    const missing = OUTPUT_KEYS.filter((k) => !(k in run.outputs))
    if (missing.length > 0) problems.push(`GITHUB_OUTPUT is missing ${missing.join(', ')}`)
    const ms = Number(run.outputs.elapsed_ms)
    if (!(Number.isFinite(ms) && run.outputs.elapsed_sec === String(Math.round(ms / 1000)))) {
      problems.push(`elapsed_sec=${JSON.stringify(run.outputs.elapsed_sec)} does not match elapsed_ms=${JSON.stringify(run.outputs.elapsed_ms)}`)
    }
    if (run.summary.trim() === '') problems.push('no step summary was written')
  }
  for (const [k, v] of Object.entries(want.outputs ?? {})) {
    const got = run.outputs[k]
    if (got !== v) problems.push(`output ${k}=${JSON.stringify(got)}, want ${JSON.stringify(v)}`)
  }
  if (want.hookHits !== undefined && hits.hook !== want.hookHits) {
    problems.push(`deploy hook fired ${hits.hook} time(s), want ${want.hookHits}`)
  }
  if (want.markerHitsAtMost !== undefined && hits.marker > want.markerHitsAtMost) {
    problems.push(`marker read ${hits.marker} times, want at most ${want.markerHitsAtMost} (is the poll sleeping?)`)
  }
  const e = Number(run.outputs.elapsed_ms)
  if (want.elapsedBelowTimeout && !(e < TIMEOUT_MS)) problems.push(`elapsed_ms=${run.outputs.elapsed_ms}, want < ${TIMEOUT_MS} (hook fired late?)`)
  if (want.elapsedAtLeastTimeout && !(e >= TIMEOUT_MS)) problems.push(`elapsed_ms=${run.outputs.elapsed_ms}, want >= ${TIMEOUT_MS} (hook fired early?)`)
  return problems
}

/** Pure: a mutant is caught iff its target case produced at least one problem. */
function mutantVerdict(problems: string[]): 'caught' | 'survived' {
  return problems.length > 0 ? 'caught' : 'survived'
}

function assertVerdictsDiscriminate(): void {
  const outputs = {
    verdict: 'live', live_sha: PUSHED, diff_base: '', vercel_state: 'none', vercel_target_url: '',
    hook_fired: 'false', elapsed_ms: '10', elapsed_sec: '0',
  }
  const ok: Run = { code: 0, stdout: '', stderr: '', outputs, summary: 'x', hung: false }
  const want: Want = { code: 0, outputs: { verdict: 'live' }, hookHits: 0, elapsedBelowTimeout: true, markerHitsAtMost: 5 }
  const h = { hook: 0, marker: 1 }
  const checks: Array<[string, boolean]> = [
    ['judge accepts a matching run', judge(ok, want, h).length === 0],
    ['judge rejects a wrong exit code', judge({ ...ok, code: 1 }, want, h).length > 0],
    ['judge rejects a wrong output', judge({ ...ok, outputs: { ...outputs, verdict: 'missing' } }, want, h).length > 0],
    // The key must be ABSENT, not present-and-undefined: `in` sees the latter.
    ['judge rejects a missing output key', judge({ ...ok, outputs: Object.fromEntries(Object.entries(outputs).filter(([k]) => k !== 'diff_base')) }, { code: 0 }, h).length > 0],
    ['judge rejects an inconsistent elapsed_sec', judge({ ...ok, outputs: { ...outputs, elapsed_sec: '9' } }, { code: 0 }, h).length > 0],
    ['judge rejects a missing summary', judge({ ...ok, summary: '' }, { code: 0 }, h).length > 0],
    ['judge rejects a wrong hook count', judge(ok, want, { hook: 1, marker: 1 }).length > 0],
    ['judge rejects too many marker reads', judge(ok, want, { hook: 0, marker: 6 }).length > 0],
    ['judge rejects a late hook', judge({ ...ok, outputs: { ...outputs, elapsed_ms: String(TIMEOUT_MS), elapsed_sec: '3' } }, want, h).length > 0],
    ['judge rejects an early hook', judge(ok, { code: 0, elapsedAtLeastTimeout: true }, h).length > 0],
    ['judge rejects a hung run', judge({ ...ok, hung: true }, want, h).length > 0],
    ['mutant verdict: no problems means SURVIVED', mutantVerdict([]) === 'survived'],
    ['mutant verdict: a problem means CAUGHT', mutantVerdict(['x']) === 'caught'],
  ]
  const broken = checks.filter(([, good]) => !good)
  if (broken.length > 0) {
    for (const [name] of broken) console.error(`  ✗ self-check: ${name}`)
    console.error('The verdict functions no longer discriminate; nothing below would mean anything.')
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
    const run = await runPoller(script, env, c.outputIsDir)
    const problems = judge(run, c.want, stub.hits)
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
  // -- containment --
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
    name: 'a compare network error reads as ahead',
    find: "    return { rel: 'unknown', note: `compare failed (${(err as Error).name})` }",
    replace: "    return { rel: 'ahead', note: `compare failed (${(err as Error).name})` }",
    target: 'compare-network-error',
  },
  {
    name: 'compare base and head swapped',
    find: '/compare/${cfg.sha}...${live}',
    replace: '/compare/${live}...${cfg.sha}',
    target: 'live-descendant',
  },
  // -- exit codes --
  {
    name: 'a missing deploy exits 0',
    find: 'const EXIT = { live: 0, missing: 1, broken: 2 } as const',
    replace: 'const EXIT = { live: 0, missing: 0, broken: 2 } as const',
    target: 'stale-author-gate',
  },
  {
    name: 'a crash exits 0',
    find: "    console.error('deploy-check: crashed', err)\n    process.exitCode = EXIT.broken",
    replace: "    console.error('deploy-check: crashed', err)\n    process.exitCode = EXIT.live",
    target: 'outputs-unwritable',
  },
  // -- config --
  {
    name: 'GITHUB_REPOSITORY not validated',
    find: "  if (!/^[\\w.-]+\\/[\\w.-]+$/.test(repo)) throw",
    replace: '  if (false) throw',
    target: 'missing-repo',
  },
  {
    name: 'a zero timing value accepted',
    find: '    if (!Number.isFinite(n) || n <= 0) throw',
    replace: '    if (!Number.isFinite(n) || n < 0) throw',
    target: 'zero-timeout',
  },
  {
    name: 'a non-numeric timing value accepted',
    find: '    if (!Number.isFinite(n) || n <= 0) throw',
    replace: '    if (n <= 0) throw',
    target: 'non-numeric-poll',
  },
  // -- Vercel status --
  {
    name: 'author-gate classification removed',
    find: "  if (DOCS_URL_RE.test(url)) return { state: 'author-gate', targetUrl: url }",
    replace: '',
    target: 'stale-author-gate',
  },
  {
    name: 'canceled classified as build-failed',
    find: "typeof rawDescription === 'string' && CANCELED_RE.test(rawDescription) ? 'canceled' : 'build-failed'",
    replace: "false ? 'canceled' : 'build-failed'",
    target: 'canceled-fires-hook-at-deadline',
  },
  {
    name: "an `error` status treated as no status",
    find: "  if (rawState !== 'failure' && rawState !== 'error') return",
    replace: "  if (rawState !== 'failure') return",
    target: 'vercel-error-state',
  },
  {
    name: 'an unreadable status resets the state to none',
    find: '    if (read) vercel = read\n',
    replace: "    vercel = read ?? { state: 'none', targetUrl: '' }\n",
    target: 'status-unreadable-keeps-build-failed',
  },
  {
    name: 'status read on the first poll only',
    find: '    const read = await vercelStatus(cfg)\n',
    replace: '    const read = attempt === 1 ? await vercelStatus(cfg) : null\n',
    target: 'status-appears-late',
  },
  // -- deadline, grace, hook --
  {
    name: 'no grace window while Vercel is still building',
    find: "  if (s.vercel === 'building' || s.vercel === 'built') return 'extend'\n",
    replace: "  if (s.vercel === 'building' || s.vercel === 'built') return 'fail'\n",
    target: 'grace-when-building',
  },
  {
    name: 'hook fired while Vercel reports a build',
    find: "  if (s.vercel === 'building' || s.vercel === 'built') return 'extend'\n",
    replace: '',
    target: 'grace-is-bounded',
  },
  {
    name: 'grace window never ends',
    find: "  if (s.extended) return 'fail'\n",
    replace: '',
    target: 'grace-is-bounded',
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
    name: 'early hook on the author gate removed',
    find: "    if (vercel.state === 'author-gate' && cfg.hookUrl && !hookFired) {",
    replace: '    if (false) {',
    target: 'hook-early',
  },
  {
    name: 'hook fired on every author-gate poll',
    find: "    if (vercel.state === 'author-gate' && cfg.hookUrl && !hookFired) {",
    replace: "    if (vercel.state === 'author-gate' && cfg.hookUrl) {",
    target: 'hook-once-when-it-does-nothing',
  },
  {
    name: 'the poll never sleeps',
    find: '    await sleep(cfg.pollMs)\n',
    replace: '    await sleep(0)\n',
    target: 'stale-author-gate',
  },
  // -- outputs --
  {
    name: 'GITHUB_OUTPUT never written',
    find: '  if (file) appendFileSync(file, lines)',
    replace: '  if (false) appendFileSync(file, lines)',
    target: 'live-identical',
  },
  {
    name: 'output values not sanitised for newlines',
    find: ".map(([k, v]) => `${k}=${v.replace(/[\\r\\n]/g, ' ')}\\n`)",
    replace: '.map(([k, v]) => `${k}=${v}\\n`)',
    target: 'output-injection',
  },
  {
    name: 'diff_base taken from the first poll even when it saw nothing',
    find: "    if (firstLive === undefined && live.sha && rel !== 'unknown') {",
    replace: '    if (attempt === 1) {',
    target: 'diff-base-after-unreadable-first-poll',
  },
  {
    name: 'diff_base accepts a diverged first build',
    find: "      diff_base: firstLive && firstRel === 'behind' ? firstLive : '',",
    replace: "      diff_base: firstLive && firstRel !== 'unknown' ? firstLive : '',",
    target: 'diff-base-not-from-diverged',
  },
]

// ── Main ───────────────────────────────────────────────────────────

async function main(): Promise<void> {
  assertVerdictsDiscriminate()
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
  const failedCases = new Set<string>()
  for (const { c, problems } of results) {
    if (problems.length === 0) console.log(`  ✓ ${c.name}`)
    else {
      failures++
      failedCases.add(c.name)
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
    // The main run above already proved every target passes against the real
    // file. The control proves the COPY context works too (a temp dir, CRLF
    // normalised), on one live and one missing case, so that a mutant failing
    // its target is attributable to the mutation and not to the copy.
    console.log('control: the unmodified poller, run from a temp copy')
    const controlScript = write('control', src)
    const controlTargets = ['live-identical', 'stale-author-gate']
    const controlResults = await pool(controlTargets, CONCURRENCY, async (t) => ({ t, problems: await runCase(controlScript, byName.get(t)!) }))
    let controlOk = true
    for (const r of controlResults) {
      if (r.problems.length === 0) console.log(`  ✓ control / ${r.t}`)
      else {
        controlOk = false
        failures++
        console.error(`  ✗ control / ${r.t}: ${r.problems.join('; ')}`)
      }
    }
    const brokenTargets = [...new Set(DISARM_MUTANTS.map((m) => m.target))].filter((t) => failedCases.has(t) || !byName.has(t))

    console.log('disarm mutants: each must FAIL its target case')
    if (!controlOk || brokenTargets.length > 0) {
      if (brokenTargets.length > 0) console.error(`  targets that did not pass unmutated: ${brokenTargets.join(', ')}`)
      for (const m of DISARM_MUTANTS) {
        casesRun++
        judged++
        failures++
        console.error(`  ✗ ${m.name}: not evaluated (a control or target failed)`)
      }
    } else {
      const mutantResults = await pool(DISARM_MUTANTS, CONCURRENCY, async (m) => {
        casesRun++
        const occurrences = src.split(m.find).length - 1
        if (occurrences !== 1) {
          judged++
          return { m, verdict: `anchor appears ${occurrences} time(s) in the poller, need exactly 1: ${JSON.stringify(m.find)}` }
        }
        const script = write(`mutant-${DISARM_MUTANTS.indexOf(m)}`, src.replace(m.find, m.replace))
        const problems = await runCase(script, byName.get(m.target)!)
        judged++
        return { m, verdict: mutantVerdict(problems) === 'caught' ? null : `SURVIVED: ${m.target} still passes with this break in place` }
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
