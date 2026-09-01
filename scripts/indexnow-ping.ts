/**
 * IndexNow ping — pushes changed URLs to the Bing/IndexNow endpoint so the
 * index behind ChatGPT Search and Copilot sees edits in minutes instead of
 * waiting for an organic recrawl.
 *
 * Note on what this script can and cannot detect: the endpoint accepts a ping
 * (200/202) and only validates the ownership key asynchronously afterwards, so
 * a key that has drifted from the file in public/ produces a green run here and
 * silently indexes nothing. That drift is guarded in smoke section H, not here.
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
// Submitted per request. The spec allows 10,000; batching keeps each payload
// small without refusing large-but-legitimate pushes. This used to be a hard
// CAP of 100, which was below a batch this repo has actually shipped — the
// bangkok i18n merge changed 101 course files (111 URLs derived) and would
// have been rejected wholesale rather than pinged.
const CHUNK_SIZE = 100
// Runaway guard, far above any real batch: the corpus is 148 course files, so
// a change set larger than this is a bug in the caller's diff mapping, not a
// content pass.
const MAX_URLS = 500

async function main() {
  const urls = process.argv.slice(2)

  if (urls.length === 0) {
    console.error('indexnow-ping: no URLs given — refusing to no-op silently.')
    process.exit(1)
  }
  if (urls.length > MAX_URLS) {
    console.error(
      `indexnow-ping: ${urls.length} URLs exceeds the ${MAX_URLS} runaway guard — a change set this large is probably a bug in the caller's diff mapping.`
    )
    process.exit(1)
  }
  // Fail fast with a precise message naming the offending URLs, rather than
  // leaving it to the endpoint's 422 (which reports no per-URL detail).
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

  for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
    const batch = urls.slice(i, i + CHUNK_SIZE)
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: `https://${HOST}/${KEY}.txt`,
        urlList: batch,
      }),
    })

    // 200 = submitted, 202 = accepted pending key validation. Anything else
    // (400 bad request, 403 key mismatch, 422 URL/host mismatch, 429) is a
    // real failure the workflow must surface. Fail on the first bad batch
    // rather than continuing — a 403 means the key is wrong for all of them.
    if (res.status !== 200 && res.status !== 202) {
      console.error(
        `indexnow-ping: batch ${i / CHUNK_SIZE + 1} returned HTTP ${res.status} ${await res.text()}`
      )
      process.exit(1)
    }
    console.log(
      `indexnow-ping: submitted ${batch.length} URL(s) [${i + 1}-${i + batch.length} of ${urls.length}], HTTP ${res.status}`
    )
  }
}

main().catch((err) => {
  console.error(`indexnow-ping: ${err}`)
  process.exit(1)
})
