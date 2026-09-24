import { NextResponse } from 'next/server'

/**
 * /api/build-info/ — the git commit this deployment was built from.
 *
 * Read by `.github/workflows/deploy-check.yml` (via
 * `scripts/wait-for-deploy.ts`) after every push to main, to confirm the push
 * actually reached production. Merges to main have repeatedly got no
 * production build without anyone noticing (usually a squash commit authored
 * by a non-member of the Vercel team, once a disconnected integration). The
 * GitHub deployments API only records a Production deployment once its build
 * completes, so it cannot tell "still building" from "never started"; what
 * the live site serves can.
 *
 * `force-static` is load-bearing. The handler runs once at build time, so the
 * SHA is the build's, it is served as a static file with no function
 * invocation, and each deployment carries its own copy: when the production
 * alias moves, the answer moves with it. Smoke section R asserts both halves:
 * the CI build is given a SHA the running server does not have, and the
 * response must carry `x-nextjs-prerender: 1`.
 *
 * `/api/` is excluded from the middleware matcher, so no locale handling and
 * no edge invocation either. The repo is public, so the SHA reveals nothing.
 */
export const dynamic = 'force-static'

const SHA_RE = /^[0-9a-f]{40}$/

export function GET() {
  const raw = process.env.VERCEL_GIT_COMMIT_SHA ?? ''
  return NextResponse.json(
    // null, never a partial or placeholder value: the poller treats anything
    // that is not a full SHA as "not live yet", and a local or CLI build has
    // no commit to report.
    { sha: SHA_RE.test(raw) ? raw : null },
    { headers: { 'X-Robots-Tag': 'noindex' } },
  )
}
