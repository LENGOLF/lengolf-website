import { NextResponse } from 'next/server'

/**
 * /api/build-info/ — the git commit this deployment was built from.
 *
 * Read by `.github/workflows/deploy-check.yml` (via
 * `scripts/wait-for-deploy.ts`) after every push to main, to confirm the push
 * actually reached production. Vercel's GitHub integration has repeatedly
 * skipped production builds without any error on main (a squash commit
 * authored by a non-team member, and once a disconnected integration), and
 * the GitHub deployments API gives false negatives for this project. What the
 * live site serves is the one signal that cannot be wrong.
 *
 * `force-static` is load-bearing. The handler runs once at build time, so the
 * SHA is the build's, it is served as a static file with no function
 * invocation, and each deployment carries its own copy: when the production
 * alias moves, the answer moves with it. Smoke section R asserts this by
 * giving the CI build a SHA that the running server does not have.
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
