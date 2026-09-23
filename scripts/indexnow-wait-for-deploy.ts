/**
 * Blocks until production serves a given commit, so IndexNow is pinged against
 * the deploy that CONTAINS the change instead of the one before it.
 *
 *   npx tsx scripts/indexnow-wait-for-deploy.ts --sha <40-hex>
 *       [--url https://www.len.golf/deploy-sha.txt] [--timeout 900] [--interval 15] [--repo .]
 *   npx tsx scripts/indexnow-wait-for-deploy.ts --self-test
 *
 * WHY. The IndexNow job starts ~15s after a push to main; the Vercel production
 * build takes ~2 minutes. Pinged in that window, a crawler's first fetch of a
 * NEW URL (a new translated course page, /llms-full.txt when it launched) saw a
 * 301 or 404, and an EDITED page served its previous copy.
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
 * deploy that never lands is a red run on main, which is also the only signal
 * this repo gets when Vercel silently skips a production build. Nothing is
 * pinged in that case; "Re-run jobs" once production catches up.
 */
import { execFileSync, spawn } from 'node:child_process'
import { createServer, type Server } from 'node:http'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { runSelfTest } from './self-test-harness'

const DEFAULT_URL = 'https://www.len.golf/deploy-sha.txt'
const SHA_RE = /^[0-9a-f]{40}$/

function arg(argv: string[], name: string): string | undefined {
  const i = argv.indexOf(name)
  return i === -1 ? undefined : argv[i + 1]
}

function git(repo: string, args: string[]): { code: number; out: string } {
  try {
    return { code: 0, out: execFileSync('git', args, { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) }
  } catch (e) {
    return { code: (e as { status?: number }).status ?? -1, out: '' }
  }
}

/**
 * Does `deployed` contain `target`? A shallow CI clone may lack the deployed
 * commit, so fetch it by id (GitHub serves reachable SHAs) with enough depth to
 * reach the target. A SHA origin does not know is "no", not an error: keep
 * waiting.
 */
function contains(repo: string, deployed: string, target: string): boolean {
  if (deployed === target) return true
  if (git(repo, ['cat-file', '-e', `${deployed}^{commit}`]).code !== 0) {
    git(repo, ['fetch', '--no-tags', '--quiet', '--depth=100', 'origin', deployed])
    if (git(repo, ['cat-file', '-e', `${deployed}^{commit}`]).code !== 0) return false
  }
  // 0 = ancestor, 1 = not; anything else (e.g. a shallow graph cut) = not yet.
  return git(repo, ['merge-base', '--is-ancestor', target, deployed]).code === 0
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
  const timeoutSec = Number(arg(argv, '--timeout') ?? 900)
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
  const verdicts = new Map<string, boolean>()
  let last = ''
  for (;;) {
    const { sha, seen } = await readMarker(url)
    if (sha) {
      if (!verdicts.has(sha)) verdicts.set(sha, contains(repo, sha, target))
      if (verdicts.get(sha)) {
        const how = sha === target ? 'the target itself' : `a descendant (${sha.slice(0, 12)})`
        console.log(`indexnow-wait: live after ${Math.round((Date.now() - started) / 1000)}s: production serves ${how}`)
        return
      }
    }
    const state = sha ? `${sha.slice(0, 12)} (does not contain the target yet)` : seen
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
// Runs the REAL CLI as a child process against a local stub server and a
// throwaway git repo, and asserts the EXIT CODE from outside. An in-process
// assertion cannot see the one defect that matters most here, a correct verdict
// paired with a wrong exit code: that would let the workflow ping a deploy that
// never went live and print a success line while doing it.

interface WaitCase {
  name: string
  /** Bodies served in order; the last one repeats. */
  bodies: (string | { status: number })[]
  target: 'A' | 'B' | 'bogus'
  wantCode: 0 | 1
  wantText: string
}

function commit(repo: string, msg: string): string {
  writeFileSync(path.join(repo, 'f.txt'), msg)
  execFileSync('git', ['add', 'f.txt'], { cwd: repo })
  execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '-m', msg], { cwd: repo })
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim()
}

function runChild(args: string[]): Promise<{ code: number; out: string }> {
  return new Promise((resolve) => {
    const child = spawn('npx', ['tsx', path.join('scripts', 'indexnow-wait-for-deploy.ts'), ...args], {
      cwd: process.cwd(),
      shell: process.platform === 'win32',
    })
    let out = ''
    child.stdout.on('data', (d) => (out += d))
    child.stderr.on('data', (d) => (out += d))
    child.on('close', (code) => resolve({ code: code ?? -1, out }))
  })
}

async function selfTest(): Promise<void> {
  const repo = mkdtempSync(path.join(tmpdir(), 'indexnow-wait-'))
  execFileSync('git', ['init', '-q'], { cwd: repo })
  const A = commit(repo, 'a')
  const B = commit(repo, 'b') // B descends from A
  const UNKNOWN = 'f'.repeat(40) // a well-formed SHA this repo has never seen

  const resolve = (b: string) => b.replace('{A}', A).replace('{B}', B).replace('{UNKNOWN}', UNKNOWN)
  const CASES: WaitCase[] = [
    { name: 'production serves the target itself -> 0', bodies: ['{A}'], target: 'A', wantCode: 0, wantText: 'the target itself' },
    { name: 'production serves a DESCENDANT of the target -> 0', bodies: ['{B}'], target: 'A', wantCode: 0, wantText: 'a descendant' },
    { name: 'the deploy lands mid-wait (old SHA, then the target) -> 0', bodies: ['{A}', '{A}', '{B}'], target: 'B', wantCode: 0, wantText: 'the target itself' },
    { name: 'production still serves the PREVIOUS deploy -> timeout, 1', bodies: ['{A}'], target: 'B', wantCode: 1, wantText: 'TIMED OUT' },
    { name: 'a SHA the repo cannot resolve is not "live" -> timeout, 1', bodies: ['{UNKNOWN}'], target: 'A', wantCode: 1, wantText: 'TIMED OUT' },
    { name: 'a marker with no SHA (env var not exposed) -> timeout, 1', bodies: ['unknown'], target: 'A', wantCode: 1, wantText: 'non-SHA body "unknown"' },
    { name: 'a marker that 404s -> timeout, 1', bodies: [{ status: 404 }], target: 'A', wantCode: 1, wantText: 'HTTP 404' },
    { name: 'a malformed --sha is rejected before any polling -> 1', bodies: ['{A}'], target: 'bogus', wantCode: 1, wantText: 'must be a full 40-hex' },
  ]

  let served: (string | { status: number })[] = []
  let hits = 0
  const server: Server = createServer((_req, res) => {
    const b = served[Math.min(hits++, served.length - 1)]
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

  const outcomes: { c: WaitCase; code: number; out: string; hits: number }[] = []
  try {
    for (const c of CASES) {
      served = c.bodies
      hits = 0
      const sha = c.target === 'A' ? A : c.target === 'B' ? B : 'not-a-sha'
      const { code, out } = await runChild([
        '--sha', sha, '--url', `http://127.0.0.1:${port}/deploy-sha.txt`, '--repo', repo, '--timeout', '3', '--interval', '0.5',
      ])
      outcomes.push({ c, code, out, hits })
    }
  } finally {
    server.close()
    rmSync(repo, { recursive: true, force: true })
  }

  const result = runSelfTest('indexnow-wait', outcomes, ({ c, code, out, hits }) => ({
    // A passing case must also have POLLED: the mid-wait case needs >= 3 reads.
    ok: code === c.wantCode && out.includes(c.wantText) && (c.target === 'bogus' ? hits === 0 : hits >= Math.min(c.bodies.length, 3)),
    label: c.name,
    detail: `exit ${code} (want ${c.wantCode}), ${hits} poll(s), output: ${out.trim().split('\n').slice(-2).join(' / ')}`,
  }))
  if (result.examined !== CASES.length || CASES.length !== 8) {
    console.log(`FAIL: examined ${result.examined} of ${CASES.length} case(s) (want 8)`)
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
