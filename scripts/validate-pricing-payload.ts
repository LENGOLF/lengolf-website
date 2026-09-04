/**
 * Does getPricingCatalog() refuse a 200 whose BODY is unusable?
 *
 * WHY THIS EXISTS. Next's Data Cache store gate is `res.status === 200`
 * (node_modules/next/dist/server/lib/patch-fetch.js), evaluated before anything
 * reads the body. So a 200 carrying an HTML login page, `{}`, or valid JSON of
 * the wrong shape IS written to the cache under the fetch's revalidate. Since
 * 2026-09-04 that revalidate is 30 days, so a poisoned entry is replayed for a
 * month; at the previous 3600 it self-healed within the hour.
 *
 * That would be survivable if consumers were defensive, and they are not.
 * `catalog.bayRates.morning` (lib/site-facts.ts) and `catalog.coaching` /
 * `.packages` / `.mixedPackages` / `.events` (data/pricing.ts) are dereferenced
 * with NO optional chaining, and a truthy-but-wrong object sails past every
 * `if (!catalog) return FALLBACK` guard. The result is a render-time TypeError
 * on all ~566 pricing-dependent pages, served from a 30-day cache entry.
 *
 * Measured, not theorised: with isPricingCatalog() stubbed to `return true`,
 * 7 of the 12 cases below throw, six of them
 * "Cannot read properties of undefined (reading 'find')".
 *
 * WHAT THIS ASSERTS is deliberately not "the type guard returns false". It is
 * the property that actually matters: run each payload through the REAL
 * consumers and require that none throws and that the pinned fallback figure
 * renders. A guard that returned false while a consumer still crashed would
 * fail here, and so would one that got stricter than the consumers need.
 *
 * NOT COVERED, named rather than implied: nothing pins the per-route
 * `export const revalidate` that keeps the 30-day fetch from setting a PAGE's
 * interval. That invariant is real and unguarded, but the obvious check --
 * "any route whose import graph reaches lib/pricing.ts must declare
 * revalidate" -- was measured on 2026-09-04 and flags 35 of 38 route entry
 * files, 9 of them WRONGLY: privacy-policy, terms-of-service, the /faq/,
 * /hotels/ and /activities/ hubs and four others reach the module only through
 * `lib/jsonld.ts -> data/pricing.ts`, which they import for types and for
 * getters they never call. A correct version needs symbol-level call-graph
 * analysis, not module reachability. Shipping the naive one would be a gate
 * that fires on correct code, which is how gates get switched off.
 */
import { createServer, type Server } from 'node:http'

/** A payload with every field the unguarded consumers dereference. */
const GOOD = {
  bayRates: {
    morning: [{ name: 'Weekday morning', price: 550 }],
    afternoon: [{ name: 'Weekend afternoon', price: 950 }],
    evening: [{ name: 'Weekend evening', price: 950 }],
  },
  packages: [{ name: 'Pack', price: 1 }],
  coaching: [{ name: '1 Golf Lesson', price: 1800 }],
  clubRental: { indoor: [], course: [], addons: [] },
  mixedPackages: [],
  drinksAndGolf: [],
  events: [],
  fetchedAt: '2026-09-04T00:00:00.000Z',
}

/** The pinned FALLBACK bay-rate minimum (lib/site-facts.ts). */
const FALLBACK_BAY_MIN = 550

interface Case {
  name: string
  status: number
  contentType: string
  body: string
  /** true = must be accepted as a live catalog; false = must resolve to null. */
  expectLive: boolean
}

const CASES: Case[] = [
  { name: 'healthy catalog', status: 200, contentType: 'application/json', body: JSON.stringify(GOOD), expectLive: true },
  // clubRental / drinksAndGolf / fetchedAt are guarded at every consumer, so a
  // payload omitting them must still be ACCEPTED. Over-strictness here would
  // reject data the existing code handles correctly.
  { name: '200 without clubRental/fetchedAt', status: 200, contentType: 'application/json', body: JSON.stringify({ bayRates: GOOD.bayRates, packages: [], coaching: GOOD.coaching, mixedPackages: [], events: [] }), expectLive: true },

  { name: '200 + HTML login page', status: 200, contentType: 'text/html', body: '<!doctype html><html><body>Sign in</body></html>', expectLive: false },
  { name: '200 + empty object', status: 200, contentType: 'application/json', body: '{}', expectLive: false },
  { name: '200 + error envelope', status: 200, contentType: 'application/json', body: '{"error":"unauthorized"}', expectLive: false },
  { name: '200 + bayRates missing evening', status: 200, contentType: 'application/json', body: JSON.stringify({ ...GOOD, bayRates: { morning: [], afternoon: [] } }), expectLive: false },
  { name: '200 + bayRates is a string', status: 200, contentType: 'application/json', body: JSON.stringify({ ...GOOD, bayRates: 'nope' }), expectLive: false },
  { name: '200 + coaching is an object', status: 200, contentType: 'application/json', body: JSON.stringify({ ...GOOD, coaching: {} }), expectLive: false },
  { name: '200 + events missing', status: 200, contentType: 'application/json', body: JSON.stringify({ ...GOOD, events: undefined }), expectLive: false },
  { name: '200 + null body', status: 200, contentType: 'application/json', body: 'null', expectLive: false },
  { name: '200 + JSON array', status: 200, contentType: 'application/json', body: '[]', expectLive: false },
  { name: 'non-200 from API', status: 500, contentType: 'text/plain', body: 'boom', expectLive: false },
]

/**
 * Anti-vacuity. An emptied or sliced CASES array iterates fewer times while
 * every other assertion below still passes, so the floor is an exact equality
 * against what was JUDGED -- not against CASES.length, which the same edit
 * would move.
 */
const EXPECTED_JUDGED = 12
/** At least this many cases must exercise the reject path, or the suite proves nothing. */
const MIN_REJECT_CASES = 10

async function main() {
  let current: Case = CASES[0]
  const server: Server = createServer((_req, res) => {
    res.writeHead(current.status, { 'content-type': current.contentType })
    res.end(current.body)
  })
  await new Promise<void>((resolve) => server.listen(0, resolve))
  const { port } = server.address() as { port: number }
  process.env.NEXT_PUBLIC_PRICING_API_URL = `http://127.0.0.1:${port}/`

  // Imported AFTER the env var is set: PRICING_API is read at module load.
  const { getPricingCatalog } = await import('@/lib/pricing')
  const { getSiteFacts } = await import('@/lib/site-facts')
  const { getBayRatesData, getLessonPricingData, getEventPackagesData } = await import('@/data/pricing')

  const problems: string[] = []
  let judged = 0
  let rejectCases = 0

  for (const testCase of CASES) {
    current = testCase
    if (!testCase.expectLive) rejectCases++

    let live: boolean
    let bayMin: number
    try {
      const catalog = await getPricingCatalog()
      live = catalog !== null

      // The real assertion: the unguarded consumers must survive this catalog.
      const facts = await getSiteFacts(catalog)
      await getBayRatesData(catalog)
      await getLessonPricingData(catalog)
      await getEventPackagesData(catalog)
      bayMin = facts.bayHourlyMin
    } catch (err) {
      judged++
      problems.push(`${testCase.name}: a consumer THREW — ${(err as Error).message}`)
      console.log(`  ✗ ${testCase.name.padEnd(34)} THREW`)
      continue
    }

    // judged++ sits AFTER the evaluation and BEFORE the verdict, so a `continue`
    // inserted anywhere above still leaves judged short of EXPECTED_JUDGED.
    judged++

    if (live !== testCase.expectLive) {
      problems.push(
        `${testCase.name}: catalog was ${live ? 'ACCEPTED' : 'rejected'}, expected ${testCase.expectLive ? 'ACCEPTED' : 'rejected'}`
      )
    }
    if (bayMin !== FALLBACK_BAY_MIN) {
      problems.push(`${testCase.name}: bayHourlyMin ${bayMin}, expected the pinned ${FALLBACK_BAY_MIN}`)
    }
    console.log(
      `  ${live === testCase.expectLive ? '✓' : '✗'} ${testCase.name.padEnd(34)} live=${String(live).padEnd(5)} bayMin=${bayMin}`
    )
  }

  // Drop keep-alive sockets before closing, then AWAIT the close. Calling
  // process.exit() with the server still tearing down aborts the process on
  // Windows with a libuv assertion (UV_HANDLE_CLOSING) and exit code 127 —
  // still non-zero, so CI would catch it, but it buries the diagnosis under a
  // native crash. Observed 2026-09-04 while mutation-testing this gate.
  server.closeAllConnections?.()
  await new Promise<void>((resolve) => server.close(() => resolve()))

  if (judged !== EXPECTED_JUDGED) {
    problems.push(`ANTI-VACUITY: judged ${judged} case(s), expected exactly ${EXPECTED_JUDGED}`)
  }
  if (rejectCases < MIN_REJECT_CASES) {
    problems.push(`ANTI-VACUITY: only ${rejectCases} reject case(s), expected at least ${MIN_REJECT_CASES}`)
  }

  console.log()
  if (problems.length) {
    console.error(`❌ validate-pricing-payload: ${problems.length} problem(s)`)
    for (const p of problems) console.error(`   - ${p}`)
    // exitCode, not exit(): the event loop is already drained by the awaited
    // close above, so the process ends on its own with the right code and
    // without racing any still-closing handle.
    process.exitCode = 1
    return
  }
  console.log(
    `✅ validate-pricing-payload: ${judged} payload(s) judged (${rejectCases} hostile) — no unusable 200 reaches a consumer, and none throws.`
  )
}

main().catch((err) => {
  console.error('❌ validate-pricing-payload crashed:', err)
  process.exit(1)
})
