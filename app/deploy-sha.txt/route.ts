/**
 * /deploy-sha.txt — the git commit this deployment was built from, and nothing
 * else. Read by scripts/indexnow-wait-for-deploy.ts, which holds the IndexNow
 * ping until production serves the pushed commit (or a descendant): pinging
 * during the ~2 minute build handed crawlers the previous deploy.
 *
 * `force-static` bakes the value in at BUILD time, so each deployment answers
 * with its own commit from its own cache and a stale answer across deploys is
 * impossible. VERCEL_GIT_COMMIT_SHA is a Vercel system env var; anything that
 * is not a full SHA (a local or CI build without it) renders `unknown`, which
 * the waiter treats as "not live yet" and reports by name rather than
 * mistaking for a commit.
 *
 * Outside app/[locale], and `.txt` is in the middleware matcher's extension
 * exclusion, so no locale rewrite or Link header touches it. The repo is
 * public, so the SHA discloses nothing.
 */
export const dynamic = 'force-static'

export function GET() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA ?? ''
  return new Response(`${/^[0-9a-f]{40}$/.test(sha) ? sha : 'unknown'}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex',
    },
  })
}
