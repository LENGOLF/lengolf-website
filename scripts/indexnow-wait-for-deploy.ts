/**
 * Blocks until production serves a given commit, so IndexNow is pinged against
 * the deploy that CONTAINS the change instead of the one before it.
 *
 *   npx tsx scripts/indexnow-wait-for-deploy.ts --sha <40-hex>
 *       [--url https://www.len.golf/deploy-sha.txt] [--timeout 1200] [--interval 15] [--repo .]
 *   npx tsx scripts/indexnow-wait-for-deploy.ts --self-test
 *
 * WHY. The IndexNow job used to ping within ~20s of a merge to main, while the
 * Vercel production build takes ~2 minutes. Pinged in that window, a crawler's
 * first fetch of a NEW URL (a new translated course page, /llms-full.txt when
 * it launched) saw a 301 or 404, and an EDITED page served its previous copy.
 *
 * HOW. /deploy-sha.txt (app/deploy-sha.txt/route.ts) serves the
 * VERCEL_GIT_COMMIT_SHA the live build was made from. This exits 0 once that SHA
 * is the target OR A DESCENDANT of it, checked with `git merge-base
 * --is-ancestor` in `--repo`. Equality alone is not enough: two merges a minute
 * apart can promote the second deploy before the first one's job ever sees its
 * own SHA, and an empty redeploy commit (the documented remedy when Vercel skips
 * a build) only ever serves ITS OWN SHA. Either would otherwise time out while
 * the change is in fact live.
 *
 * Exits 1 at the timeout, naming the last SHA it saw. That is deliberate: a
 * deploy that never lands is a red run on main, which for a content push that
 * derives a URL is the alarm for a silently skipped production build. Nothing
 * is pinged in that case; "Re-run jobs" once production catches up.
 */
import { execFileSync, spawn } from 'node:child_process'
import { createServer, type Server } from 'node:http'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { runSelfTest } from './self-test-harness'

const DEFAULT_URL = 'https://www.len.golf/deploy-sha.txt'
const SHA_RE = /^[0-9a-f]{40}$/

function arg(argv: string[], name: string): string | undefined {
  const i = argv.indexOf(name)
  return i === -1 ? undefined : argv[i + 1]
}

function git(repo: string, args: string[]): { code: number; out: string } {
  try {
    // A bound on every call: an unbounded fetch could hang past the budget.
    return { code: 0, out: execFileSync('git', args, { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 60_000 }) }
  } catch (e) {
    return { code: (e as { status?: number }).status ?? -1, out: '' }
  }
}

/**
 * Does `deployed` contain `target`? 'unknown' when that cannot be decided yet.
 *
 * A shallow CI clone lacks the deployed commit whenever production serves
 * something newer than the push (an empty redeploy commit, a second merge), so
 * it is fetched by id with enough depth to reach the target. A failed fetch is
 * 'unknown', never 'no', and the caller does not cache it: a GitHub hiccup on
 * the first poll must not turn into a full-budget false timeout that reports
 * the deploy as never live.
 */
function contains(repo: string, deployed: string, target: string): 'yes' | 'no' | 'unknown' {
  if (deployed === target) return 'yes'
  if (git(repo, ['cat-file', '-e', `${deployed}^{commit}`]).code !== 0) {
    git(repo, ['fetch', '--no-tags', '--quiet', '--depth=100', 'origin', deployed])
    if (git(repo, ['cat-file', '-e', `${deployed}^{commit}`]).code !== 0) return 'unknown'
  }
  // Exit 0 = ancestor, 1 = not; anything else is not a verdict.
  const code = git(repo, ['merge-base', '--is-ancestor', target, deployed]).code
  return code === 0 ? 'yes' : code === 1 ? 'no' : 'unknown'
}

async function readMarker(url: string): Promise<{ sha?: string; seen: string }> {
  try {
    const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`, {
      headers: { 'cache-control': 'no-cache' },
      redirect: 'manual',
      signal: AbortSignal.timeout(10_000),
    })
    const body = (await res.text()).trim()
    if (res.status !== 200) return { seen: `HTTP ${res.status}` }
    return SHA_RE.test(body) ? { sha: body, seen: body } : { seen: `non-SHA body "${body.slice(0, 40)}"` }
  } catch (err) {
    return { seen: `fetch failed (${(err as Error).message})` }
  }
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2)
  if (argv.includes('--self-test')) return selfTest()

  const target = arg(argv, '--sha') ?? ''
  const url = arg(argv, '--url') ?? DEFAULT_URL
  const repo = path.resolve(arg(argv, '--repo') ?? '.')
  const timeoutSec = Number(arg(argv, '--timeout') ?? 1200)
  const intervalSec = Number(arg(argv, '--interval') ?? 15)
  if (!SHA_RE.test(target)) {
    console.error(`indexnow-wait: --sha must be a full 40-hex commit id, got "${target}"`)
    process.exit(1)
  }
  if (!(timeoutSec > 0) || !(intervalSec > 0)) {
    console.error('indexnow-wait: --timeout and --interval must be positive numbers of seconds')
    process.exit(1)
  }

  console.log(`indexnow-wait: waiting up to ${timeoutSec}s for ${url} to serve ${target.slice(0, 12)} or a descendant`)
  const started = Date.now()
  // Only DECIDED verdicts are cached; 'unknown' is asked again next poll.
  const verdicts = new Map<string, 'yes' | 'no'>()
  let last = ''
  for (;;) {
    const { sha, seen } = await readMarker(url)
    let verdict: 'yes' | 'no' | 'unknown' | undefined
    if (sha) {
      verdict = verdicts.get(sha) ?? contains(repo, sha, target)
      if (verdict !== 'unknown') verdicts.set(sha, verdict)
      if (verdict === 'yes') {
        const how = sha === target ? 'the target itself' : `a descendant (${sha.slice(0, 12)})`
        console.log(`indexnow-wait: live after ${Math.round((Date.now() - started) / 1000)}s: production serves ${how}`)
        return
      }
    }
    const state = !sha
      ? seen
      : verdict === 'unknown'
        ? `${sha.slice(0, 12)} (could not fetch it from origin to check ancestry; retrying)`
        : `${sha.slice(0, 12)} (does not contain the target yet)`
    if (state !== last) {
      console.log(`indexnow-wait: +${Math.round((Date.now() - started) / 1000)}s live=${state}`)
      last = state
    }
    if (Date.now() - started + intervalSec * 1000 > timeoutSec * 1000) {
      console.error(
        `indexnow-wait: TIMED OUT after ${timeoutSec}s; production still serves ${last}. ` +
          `The deploy of ${target.slice(0, 12)} never went live, so nothing was pinged. ` +
          'Re-run this job once production has caught up.'
      )
      process.exit(1)
    }
    await new Promise((r) => setTimeout(r, intervalSec * 1000))
  }
}

// ── Self-test ───────────────────────────────────────────────────────────────
//
// Runs the REAL CLI as a child process against a local stub server and
// throwaway git repos, and asserts the EXIT CODE from outside. An in-process
// assertion cannot see the one defect that matters most here, a correct verdict
// paired with a wrong exit code: that would let the workflow ping a deploy that
// never went live and print a success line while doing it.
//
// The repos mirror CI: a bare `origin` holding A <- B, and per case a SHALLOW
// clone of it. 'A1' is depth 1 at A, so B is NOT local and the CLI must fetch
// it, the path every empty redeploy commit takes in production. An earlier
// version ran every case against one full local repo with no origin, where B
// was always present: deleting the fetch, or fetching at --depth=1, stayed
// 8/8 green and would have failed on the first redeploy in CI.


interface WaitCase {
  name: string
  /** 'A1': depth-1 clone at A (B must be fetched). 'B2': depth-2 clone at B (both local). */
  clone: 'A1' | 'B2'
  /** Bodies served in order; the last one repeats. */
  bodies: (string | { status: number })[]
  target: 'A' | 'B' | 'bogus'
  wantCode: 0 | 1
  wantText: string
  /** Marker reads the premise needs, and a ceiling that catches a hot loop. */
  minPolls: number
  maxPolls: number
  timeout?: number
  /**
   * Origin is absent until the server is answering this poll (1-based): a
   * transient outage covering the polls before it. Driven by the POLL, not by
   * wall-clock: a timer raced the child's startup and covered zero polls on
   * one run in two.
   */
  originAtPoll?: number
}

const git0 = (args: string[], cwd?: string) =>
  execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()

function commit(repo: string, msg: string): string {
  writeFileSync(path.join(repo, 'f.txt'), msg)
  git0(['add', 'f.txt'], repo)
  git0(['-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '-m', msg], repo)
  return git0(['rev-parse', 'HEAD'], repo)
}

const fileUrl = (p: string) => pathToFileURL(p).href

function runChild(args: string[]): Promise<{ code: number; out: string; ms: number }> {
  const t0 = Date.now()
  return new Promise((resolve) => {
    const child = spawn('npx', ['tsx', path.join('scripts', 'indexnow-wait-for-deploy.ts'), ...args], {
      cwd: process.cwd(),
      shell: process.platform === 'win32',
    })
    let out = ''
    child.stdout.on('data', (d) => (out += d))
    child.stderr.on('data', (d) => (out += d))
    child.on('close', (code) => resolve({ code: code ?? -1, out, ms: Date.now() - t0 }))
  })
}

async function selfTest(): Promise<void> {
  // The workflow relies on the default; an apex or http default 301s forever.
  if (DEFAULT_URL !== 'https://www.len.golf/deploy-sha.txt') {
    console.log(`FAIL: DEFAULT_URL is ${DEFAULT_URL}, want https://www.len.golf/deploy-sha.txt`)
    process.exit(1)
  }
  const tmp = mkdtempSync(path.join(tmpdir(), 'indexnow-wait-'))
  const work = path.join(tmp, 'work')
  const origin = path.join(tmp, 'origin.git')
  mkdirSync(work)
  git0(['init', '-q'], work)
  const A = commit(work, 'a')
  git0(['tag', 'at-a', A], work)
  const B = commit(work, 'b') // B descends from A
  git0(['clone', '-q', '--bare', work, origin])
  const UNKNOWN = 'f'.repeat(40) // well-formed, and in no repo
  let n = 0
  const cloneFor = (c: WaitCase): { dir: string; lateOrigin?: string } => {
    const dir = path.join(tmp, `clone-${n++}`)
    if (c.clone === 'A1') git0(['-c', 'advice.detachedHead=false', 'clone', '-q', '--depth=1', '--branch', 'at-a', fileUrl(origin), dir])
    else git0(['clone', '-q', '--depth=2', fileUrl(origin), dir])
    if (!c.originAtPoll) return { dir }
    const lateOrigin = `${origin}-late-${n}`
    git0(['remote', 'set-url', 'origin', fileUrl(lateOrigin)], dir)
    return { dir, lateOrigin }
  }

  const resolve = (b: string) => b.replace('{A}', A).replace('{B}', B).replace('{UNKNOWN}', UNKNOWN)
  // Timeout cases run 3s at a 0.5s interval: about 6 reads. maxPolls 12 catches
  // a zeroed sleep (hundreds of reads); the elapsed ceiling catches a timeout
  // that stopped meaning seconds.
  const CASES: WaitCase[] = [
    { name: 'production serves the target itself -> 0', clone: 'A1', bodies: ['{A}'], target: 'A', wantCode: 0, wantText: 'the target itself', minPolls: 1, maxPolls: 1 },
    { name: 'a DESCENDANT the shallow clone lacks is fetched from origin -> 0', clone: 'A1', bodies: ['{B}'], target: 'A', wantCode: 0, wantText: 'a descendant', minPolls: 1, maxPolls: 1 },
    { name: 'origin unreachable for 2 polls, then back: retried, not cached as "no" -> 0', clone: 'A1', bodies: ['{B}'], target: 'A', wantCode: 0, wantText: 'a descendant', minPolls: 3, maxPolls: 3, timeout: 10, originAtPoll: 3 },
    { name: 'the deploy lands mid-wait (old SHA, then the target) -> 0', clone: 'B2', bodies: ['{A}', '{A}', '{B}'], target: 'B', wantCode: 0, wantText: 'the target itself', minPolls: 3, maxPolls: 3 },
    { name: 'production still serves the PREVIOUS deploy -> timeout, 1', clone: 'B2', bodies: ['{A}'], target: 'B', wantCode: 1, wantText: 'TIMED OUT', minPolls: 3, maxPolls: 12 },
    { name: 'a SHA origin does not have is never "live" -> timeout, 1', clone: 'A1', bodies: ['{UNKNOWN}'], target: 'A', wantCode: 1, wantText: 'could not fetch it from origin', minPolls: 3, maxPolls: 12 },
    { name: 'a marker with no SHA (env var not exposed) -> timeout, 1', clone: 'A1', bodies: ['unknown'], target: 'A', wantCode: 1, wantText: 'non-SHA body "unknown"', minPolls: 3, maxPolls: 12 },
    { name: 'a marker that 404s -> timeout, 1', clone: 'A1', bodies: [{ status: 404 }], target: 'A', wantCode: 1, wantText: 'HTTP 404', minPolls: 3, maxPolls: 12 },
    { name: 'a malformed --sha is rejected before any polling -> 1', clone: 'A1', bodies: ['{A}'], target: 'bogus', wantCode: 1, wantText: 'must be a full 40-hex', minPolls: 0, maxPolls: 0 },
  ]

  let current: { c: WaitCase; lateOrigin?: string } | null = null
  let hits = 0
  const server: Server = createServer((_req, res) => {
    hits++
    const c = current!.c
    // Bring origin back BEFORE answering this poll, so this poll's fetch is the
    // first that can succeed and every earlier one must have failed.
    if (c.originAtPoll && hits === c.originAtPoll && current!.lateOrigin) {
      git0(['clone', '-q', '--bare', origin, current!.lateOrigin])
    }
    const b = c.bodies[Math.min(hits - 1, c.bodies.length - 1)]
    if (typeof b === 'string') {
      res.writeHead(200, { 'content-type': 'text/plain' })
      res.end(`${resolve(b)}\n`)
    } else {
      res.writeHead(b.status)
      res.end('nope')
    }
  })
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', () => r()))
  const port = (server.address() as { port: number }).port

  const outcomes: { c: WaitCase; code: number; out: string; hits: number; ms: number }[] = []
  try {
    for (const c of CASES) {
      const { dir, lateOrigin } = cloneFor(c)
      current = { c, lateOrigin }
      hits = 0
      const sha = c.target === 'A' ? A : c.target === 'B' ? B : 'not-a-sha'
      const { code, out, ms } = await runChild([
        '--sha', sha, '--url', `http://127.0.0.1:${port}/deploy-sha.txt`, '--repo', dir,
        '--timeout', String(c.timeout ?? 3), '--interval', '0.5',
      ])
      outcomes.push({ c, code, out, hits, ms })
    }
  } finally {
    server.close()
    rmSync(tmp, { recursive: true, force: true })
  }

  const result = runSelfTest('indexnow-wait', outcomes, ({ c, code, out, hits, ms }) => {
    // Child startup (npx tsx) is the slack in the ceiling; a timeout that
    // stopped meaning seconds blows through it.
    const ceilingMs = ((c.timeout ?? 3) + 20) * 1000
    return {
      ok: code === c.wantCode && out.includes(c.wantText) && hits >= c.minPolls && hits <= c.maxPolls && ms < ceilingMs,
      label: c.name,
      detail: `exit ${code} (want ${c.wantCode}), ${hits} poll(s) (want ${c.minPolls}..${c.maxPolls}), ${ms}ms (< ${ceilingMs}), output: ${out.trim().split('\n').filter((l) => l.includes('indexnow-wait')).slice(-2).join(' / ')}`,
    }
  })
  if (result.examined !== CASES.length || CASES.length !== 9) {
    console.log(`FAIL: examined ${result.examined} of ${CASES.length} case(s) (want 9)`)
    process.exit(1)
  }
  if (result.failures > 0) {
    console.log(`\n${result.failures} of ${result.examined} failed`)
    process.exit(1)
  }
  console.log(`\nindexnow-wait self-test: ${result.examined} case(s), 0 failures · OK`)
}

main().catch((err) => {
  console.error(`indexnow-wait: ${(err as Error).stack ?? err}`)
  process.exit(1)
})
