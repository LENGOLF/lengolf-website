/**
 * wait-for-deploy: did this push to main actually reach production?
 *
 * Run by .github/workflows/deploy-check.yml on every push to main. It polls
 * the live site's build marker (/api/build-info/, which serves the
 * VERCEL_GIT_COMMIT_SHA baked in at build time) until production serves a
 * build that CONTAINS the pushed commit, or a deadline passes.
 *
 * Why this exists: Vercel's GitHub integration has skipped production builds
 * on main at least a dozen times without failing anything a merge would
 * notice (#81, #82, #86, #88, #108, #110, #113, #115, #116, #120, #129, #131).
 * Usually the squash commit's author is not a Vercel team member; once the
 * integration itself was disconnected. #131 sat undeployed for 12 days.
 *
 * Why the live site and not an API: the GitHub deployments API gives false
 * negatives for this project (it showed Preview-only rows while two real
 * Production builds ran, PR #97). What production serves is the one signal
 * that cannot be wrong, which is also why the answer is read from the site
 * rather than from Vercel.
 *
 * "Contains", not "equals": two merges 44s apart get ONE build, of the later
 * commit (#114 and #112). The earlier run must still pass, so containment is
 * asked of the GitHub compare API: compare(pushed...live) is `identical` or
 * `ahead`. Anything else, including an API error or a SHA GitHub does not
 * know, is "not yet".
 *
 * The commit's `Vercel` status is read on every poll, for two reasons. It
 * names the failure in the report: a failure linking to Vercel's DOCS is the
 * author gate (no deployment was ever created, e.g. 9a3c0d7 for #131), and a
 * failure linking to a deployment is a real build error. And the author gate
 * shows up within seconds, so a configured deploy hook fires right away
 * instead of after the full timeout.
 *
 * Deploy hook (VERCEL_DEPLOY_HOOK_URL, optional, dormant until the secret
 * exists): fired at most ONCE per run, early on the author gate, otherwise at
 * the deadline when Vercel reported nothing at all. Never on a real build
 * failure, where redeploying the same code fails the same way. Whether a
 * deploy hook gets past the author gate is UNVERIFIED as of 2026-09-24; the
 * one-time test is in the workflow's header comment.
 *
 * At the deadline: if Vercel says it is still building (or built but not yet
 * serving), one grace window. Otherwise fail.
 *
 * Exit codes, which the workflow keys on:
 *   0  live     production serves the pushed commit or a descendant
 *   1  missing  the deadline passed and it still does not
 *   2  broken   the check itself could not run (bad config, crash).
 *               Never reads as live.
 *
 * Env:
 *   DEPLOY_SHA              pushed commit, full 40-hex (default GITHUB_SHA)
 *   GITHUB_REPOSITORY       owner/name
 *   GITHUB_TOKEN            for the compare + status API (60/h unauthenticated
 *                           is shared per runner IP, so it is required)
 *   GITHUB_API_URL          default https://api.github.com
 *   MARKER_URL              default https://www.len.golf/api/build-info/
 *   DEPLOY_TIMEOUT_MS       default 720000 (12 min; a build takes ~2)
 *   DEPLOY_POLL_MS          default 30000
 *   DEPLOY_GRACE_MS         default 480000 (8 min)
 *   VERCEL_DEPLOY_HOOK_URL  optional; never printed
 *   GITHUB_OUTPUT           verdict, live_sha, diff_base, vercel_state,
 *                           vercel_target_url, hook_fired, elapsed_ms, elapsed_sec
 *   GITHUB_STEP_SUMMARY     one-line summary (empty = skip)
 *
 * `diff_base` is the FIRST live SHA observed, and only when it was an
 * ancestor of the pushed commit. The workflow's IndexNow job diffs from it, so
 * when a stranded commit finally goes live via a later redeploy, its URLs are
 * pinged then instead of never.
 *
 * scripts/wait-for-deploy-contract.ts spawns this file against a local stub
 * and holds every rule above to its exit code. When you add a rule, add its
 * disarm to DISARM_MUTANTS there.
 */

import { appendFileSync } from 'fs'

const SHA_RE = /^[0-9a-f]{40}$/
const DOCS_URL_RE = /^https:\/\/vercel\.com\/docs\//
const EXIT = { live: 0, missing: 1, broken: 2 } as const
const REQUEST_TIMEOUT_MS = 15_000

type Relation = 'identical' | 'ahead' | 'behind' | 'diverged' | 'unknown'
type VercelState = 'none' | 'building' | 'built' | 'author-gate' | 'build-failed'
interface Vercel { state: VercelState; targetUrl: string }

interface Config {
  sha: string
  repo: string
  token: string
  apiUrl: string
  markerUrl: string
  timeoutMs: number
  pollMs: number
  graceMs: number
  hookUrl: string
}

class ConfigError extends Error {}

function readConfig(env: NodeJS.ProcessEnv): Config {
  const sha = (env.DEPLOY_SHA || env.GITHUB_SHA || '').trim().toLowerCase()
  if (!SHA_RE.test(sha)) throw new ConfigError(`DEPLOY_SHA must be a full 40-hex commit SHA, got ${JSON.stringify(sha)}`)
  const repo = env.GITHUB_REPOSITORY || ''
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) throw new ConfigError(`GITHUB_REPOSITORY must be owner/name, got ${JSON.stringify(repo)}`)
  const token = env.GITHUB_TOKEN || ''
  if (!token) throw new ConfigError('GITHUB_TOKEN is required')
  const ms = (name: string, fallback: number): number => {
    const raw = env[name]
    if (raw === undefined || raw === '') return fallback
    const n = Number(raw)
    if (!Number.isFinite(n) || n <= 0) throw new ConfigError(`${name} must be a positive number of milliseconds, got ${JSON.stringify(raw)}`)
    return n
  }
  return {
    sha,
    repo,
    token,
    apiUrl: (env.GITHUB_API_URL || 'https://api.github.com').replace(/\/+$/, ''),
    markerUrl: env.MARKER_URL || 'https://www.len.golf/api/build-info/',
    timeoutMs: ms('DEPLOY_TIMEOUT_MS', 12 * 60_000),
    pollMs: ms('DEPLOY_POLL_MS', 30_000),
    graceMs: ms('DEPLOY_GRACE_MS', 8 * 60_000),
    hookUrl: env.VERCEL_DEPLOY_HOOK_URL || '',
  }
}

// ── What production serves ─────────────────────────────────────────

async function readLiveSha(cfg: Config, attempt: number): Promise<{ sha: string | null; note: string }> {
  const url = new URL(cfg.markerUrl)
  url.searchParams.set('cb', `${Date.now()}-${attempt}`)
  try {
    const res = await fetch(url, {
      headers: { 'cache-control': 'no-cache' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    if (res.status !== 200) return { sha: null, note: `marker HTTP ${res.status}` }
    let body: unknown
    try {
      body = await res.json()
    } catch {
      return { sha: null, note: 'marker is not JSON' }
    }
    const sha = (body as { sha?: unknown } | null)?.sha
    // A full SHA or nothing: a prefix, a placeholder or null is "not live".
    if (typeof sha === 'string' && SHA_RE.test(sha)) return { sha, note: '' }
    return { sha: null, note: `marker sha is ${JSON.stringify(sha)}` }
  } catch (err) {
    return { sha: null, note: `marker unreachable (${(err as Error).name})` }
  }
}

// ── GitHub ─────────────────────────────────────────────────────────

async function githubJson(cfg: Config, path: string): Promise<{ status: number; body: unknown }> {
  const res = await fetch(`${cfg.apiUrl}${path}`, {
    headers: {
      authorization: `Bearer ${cfg.token}`,
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
      'user-agent': 'lengolf-deploy-check',
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  let body: unknown = null
  try {
    body = await res.json()
  } catch {
    // leave null; callers treat it as unreadable
  }
  return { status: res.status, body }
}

/** How the live build relates to the pushed commit. Base is ALWAYS the pushed SHA. */
async function relation(cfg: Config, live: string): Promise<{ rel: Relation; note: string }> {
  if (live === cfg.sha) return { rel: 'identical', note: '' }
  try {
    const r = await githubJson(cfg, `/repos/${cfg.repo}/compare/${cfg.sha}...${live}?per_page=1`)
    const status = (r.body as { status?: unknown } | null)?.status
    if (r.status === 200 && (status === 'identical' || status === 'ahead' || status === 'behind' || status === 'diverged')) {
      return { rel: status, note: '' }
    }
    return { rel: 'unknown', note: `compare HTTP ${r.status}` }
  } catch (err) {
    return { rel: 'unknown', note: `compare failed (${(err as Error).name})` }
  }
}

/** compare(pushed...live): `ahead` means live descends from pushed. */
function contains(rel: Relation): boolean {
  return rel === 'identical' || rel === 'ahead'
}

function classifyVercel(rawState: unknown, rawUrl: unknown): Vercel {
  const url = typeof rawUrl === 'string' ? rawUrl : ''
  if (rawState === 'pending') return { state: 'building', targetUrl: url }
  if (rawState === 'success') return { state: 'built', targetUrl: url }
  if (rawState !== 'failure' && rawState !== 'error') return { state: 'none', targetUrl: url }
  // A permission block links to Vercel's docs, because no deployment exists
  // to link to. A real build failure links to the deployment.
  const state: VercelState = DOCS_URL_RE.test(url) ? 'author-gate' : 'build-failed'
  return { state, targetUrl: url }
}

async function vercelStatus(cfg: Config): Promise<Vercel> {
  try {
    const r = await githubJson(cfg, `/repos/${cfg.repo}/commits/${cfg.sha}/status`)
    const statuses = (r.body as { statuses?: unknown } | null)?.statuses
    if (r.status !== 200 || !Array.isArray(statuses)) return { state: 'none', targetUrl: '' }
    const v = statuses.find((s) => (s as { context?: unknown } | null)?.context === 'Vercel') as
      | { state?: unknown; target_url?: unknown }
      | undefined
    return v ? classifyVercel(v.state, v.target_url) : { state: 'none', targetUrl: '' }
  } catch {
    return { state: 'none', targetUrl: '' }
  }
}

// ── Decisions ──────────────────────────────────────────────────────

type DeadlineAction = 'fail' | 'extend' | 'fire-and-extend'

function atDeadline(s: { vercel: VercelState; hookConfigured: boolean; hookFired: boolean; extended: boolean }): DeadlineAction {
  if (s.extended) return 'fail'
  if (s.vercel === 'building' || s.vercel === 'built') return 'extend'
  if (s.vercel === 'build-failed') return 'fail'
  if (s.hookConfigured && !s.hookFired) return 'fire-and-extend'
  return 'fail'
}

async function fireHook(cfg: Config): Promise<string> {
  try {
    const res = await fetch(cfg.hookUrl, { method: 'POST', signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })
    return `HTTP ${res.status}`
  } catch (err) {
    return `failed (${(err as Error).name})`
  }
}

// ── Reporting ──────────────────────────────────────────────────────

function writeOutputs(outputs: Record<string, string>): void {
  const file = process.env.GITHUB_OUTPUT
  const lines = Object.entries(outputs)
    .map(([k, v]) => `${k}=${v.replace(/[\r\n]/g, ' ')}\n`)
    .join('')
  if (file) appendFileSync(file, lines)
}

function writeSummary(line: string): void {
  const summary = process.env.GITHUB_STEP_SUMMARY
  if (summary) appendFileSync(summary, `${line}\n`)
}

const short = (sha: string | null) => (sha ? sha.slice(0, 7) : 'none')
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ── Main ───────────────────────────────────────────────────────────

async function main(): Promise<number> {
  let cfg: Config
  try {
    cfg = readConfig(process.env)
  } catch (err) {
    console.error(`deploy-check: ${(err as Error).message}`)
    return EXIT.broken
  }

  const started = Date.now()
  let deadline = started + cfg.timeoutMs
  let extended = false
  let hookFired = false
  let firstLive: string | null | undefined
  let firstRel: Relation = 'unknown'
  let lastLive: string | null = null
  let vercel: Vercel = { state: 'none', targetUrl: '' }

  console.log(`deploy-check: waiting for ${cfg.markerUrl} to serve ${cfg.sha} or a descendant`)

  const finish = (verdict: 'live' | 'missing'): number => {
    const elapsedMs = Date.now() - started
    const elapsedSec = Math.round(elapsedMs / 1000)
    writeOutputs({
      verdict,
      live_sha: lastLive ?? '',
      diff_base: firstLive && firstRel === 'behind' ? firstLive : '',
      vercel_state: vercel.state,
      vercel_target_url: vercel.targetUrl,
      hook_fired: String(hookFired),
      elapsed_ms: String(elapsedMs),
      elapsed_sec: String(elapsedSec),
    })
    writeSummary(
      verdict === 'live'
        ? `Production serves \`${short(lastLive)}\`, which contains \`${short(cfg.sha)}\` (after ${elapsedSec}s).`
        : `**Production deploy missing.** After ${elapsedSec}s production still serves \`${short(lastLive)}\`, which does not contain \`${short(cfg.sha)}\`. Vercel status on the commit: \`${vercel.state}\`. Deploy hook fired: ${hookFired}.`,
    )
    console.log(
      `deploy-check: verdict=${verdict} sha=${cfg.sha} live=${lastLive ?? 'none'} vercel=${vercel.state} hook_fired=${hookFired} elapsed=${elapsedSec}s`,
    )
    return verdict === 'live' ? EXIT.live : EXIT.missing
  }

  for (let attempt = 1; ; attempt++) {
    const live = await readLiveSha(cfg, attempt)
    let rel: Relation = 'unknown'
    let relNote = ''
    if (live.sha) {
      lastLive = live.sha
      const r = await relation(cfg, live.sha)
      rel = r.rel
      relNote = r.note
    }
    if (firstLive === undefined) {
      firstLive = live.sha
      firstRel = rel
    }
    vercel = await vercelStatus(cfg)

    const t = Math.round((Date.now() - started) / 1000)
    const seen = live.sha ? `${short(live.sha)} (${rel}${relNote ? `, ${relNote}` : ''})` : live.note
    console.log(`[+${t}s] live=${seen} · vercel=${vercel.state}`)

    if (live.sha && contains(rel)) return finish('live')

    if (vercel.state === 'author-gate' && cfg.hookUrl && !hookFired) {
      hookFired = true
      console.log(`Vercel blocked this commit (author gate); deploy hook fired: ${await fireHook(cfg)}`)
    }

    if (Date.now() >= deadline) {
      const action = atDeadline({ vercel: vercel.state, hookConfigured: Boolean(cfg.hookUrl), hookFired, extended })
      if (action === 'fail') return finish('missing')
      if (action === 'fire-and-extend') {
        hookFired = true
        console.log(`deadline reached, Vercel reported ${vercel.state}; deploy hook fired: ${await fireHook(cfg)}`)
      } else {
        console.log(`deadline reached while Vercel reports ${vercel.state}; one grace window`)
      }
      extended = true
      deadline = Date.now() + cfg.graceMs
    }

    await sleep(cfg.pollMs)
  }
}

// exitCode, not process.exit(): exiting while fetch's sockets are still
// closing trips a libuv assertion on Windows (exit 0xC0000409 instead of 0),
// which the contract suite caught on its first run. Nothing is left pending
// once main() settles (AbortSignal.timeout timers are unref'd, the poll sleep
// has resolved), so the process ends on its own; a regression there shows up
// as a hang, which the contract suite kills and fails.
main().then(
  (code) => {
    process.exitCode = code
  },
  (err: unknown) => {
    console.error('deploy-check: crashed', err)
    process.exitCode = EXIT.broken
  },
)
