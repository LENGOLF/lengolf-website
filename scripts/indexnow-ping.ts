/**
 * IndexNow ping — pushes changed URLs to the Bing/IndexNow endpoint so the
 * index behind ChatGPT Search and Copilot sees edits in minutes instead of
 * waiting for an organic recrawl.
 *
 *   npx tsx scripts/indexnow-ping.ts https://www.len.golf/golf/ [more URLs...]
 *
 * Invoked by .github/workflows/indexnow.yml on pushes to main that touch
 * content data; safe to run by hand after a manual content edit.
 *
 * Contract (per this repo's gate rules — a gate that cannot fail is worse
 * than no gate):
 *  - zero URLs is a hard error, not a silent success (the workflow decides
 *    whether to call at all; this script never no-ops quietly);
 *  - every URL must be on the canonical host, else exit 1 before any network
 *    call — a typo'd host would "succeed" against the API while pinging a
 *    URL that is not ours;
 *  - anything but HTTP 200/202 from the endpoint is exit 1.
 */

const HOST = 'www.len.golf'
// The key is deliberately public: IndexNow verifies ownership by fetching
// https://<host>/<key>.txt, so the value is served to anyone by design.
const KEY = '8668c95c59b519ff662434f9d61d4198'
const ENDPOINT = 'https://api.indexnow.org/indexnow'
const MAX_URLS = 100 // spec allows 10k; cap far below to catch runaway callers

async function main() {
  const urls = process.argv.slice(2)

  if (urls.length === 0) {
    console.error('indexnow-ping: no URLs given — refusing to no-op silently.')
    process.exit(1)
  }
  if (urls.length > MAX_URLS) {
    console.error(
      `indexnow-ping: ${urls.length} URLs exceeds the ${MAX_URLS} cap — a change set this large is probably a bug in the caller's diff mapping.`
    )
    process.exit(1)
  }
  const offHost = urls.filter((u) => {
    try {
      return new URL(u).host !== HOST || !u.startsWith('https://')
    } catch {
      return true
    }
  })
  if (offHost.length > 0) {
    console.error(
      `indexnow-ping: ${offHost.length} URL(s) not on https://${HOST}: ${offHost.join(', ')}`
    )
    process.exit(1)
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList: urls,
    }),
  })

  // 200 = submitted, 202 = accepted pending key validation. Anything else
  // (400 bad request, 403 key mismatch, 422 URL/host mismatch, 429) is a
  // real failure the workflow must surface.
  if (res.status === 200 || res.status === 202) {
    console.log(`indexnow-ping: submitted ${urls.length} URL(s), HTTP ${res.status}`)
    return
  }
  console.error(`indexnow-ping: endpoint returned HTTP ${res.status} ${await res.text()}`)
  process.exit(1)
}

main().catch((err) => {
  console.error(`indexnow-ping: ${err}`)
  process.exit(1)
})
