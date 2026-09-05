/**
 * Does getPricingCatalog() refuse a 200 whose BODY is unusable?
 *
 * WHY THIS EXISTS. Next's Data Cache store gate is `res.status === 200`
 * (node_modules/next/dist/server/lib/patch-fetch.js:437), evaluated before
 * anything reads the body. So a 200 carrying an HTML login page, `{}`, or valid
 * JSON of the wrong shape IS written to the cache under the fetch's revalidate.
 * Since 2026-09-04 that revalidate is 30 days, so a poisoned entry is replayed
 * for a month; at the previous 3600 it self-healed within the hour.
 *
 * That would be survivable if consumers were defensive, and they are not.
 * `catalog.bayRates.morning` (lib/site-facts.ts) and `catalog.coaching` /
 * `.packages` / `.mixedPackages` / `.events` (data/pricing.ts) are dereferenced
 * with NO optional chaining, and a truthy-but-wrong object sails past every
 * `if (!catalog) return FALLBACK` guard. The result is a render-time TypeError
 * on all ~597 pricing-rendering pages, served from a 30-day cache entry.
 *
 * Measured, not theorised: with isPricingCatalog() stubbed to `return true`,
 * 7 of the 17 cases below throw, six of them
 * "Cannot read properties of undefined (reading 'find')" and the seventh
 * "products.find is not a function".
 *
 * WHAT THIS ASSERTS is deliberately not "the type guard returns false". It is
 * the property that actually matters: run each payload through the REAL
 * consumers and require that none throws, AND that the right FIGURE renders.
 * A guard that returned false while a consumer still crashed would fail here,
 * and so would one that got stricter than the consumers need.
 *
 * THE FIXTURE PRICE IS DELIBERATELY NOT THE FALLBACK PRICE. An earlier version
 * priced the fixture at 550, which is exactly the pinned fallback, so both the
 * live path and the fallback path produced 550 and the figure assertion proved
 * nothing for the two accept cases -- while a docblock claimed it verified "the
 * pinned fallback renders". Mutation-tested: changing the fixture price alone
 * used to leave the suite green. The fixture now prices weekday-morning at 610
 * so `expectBayMin` distinguishes the two paths by construction.
 *
 * KNOWN GAP, stated rather than implied. Four mutations disarm this gate while
 * it prints a healthy line: replacing the `problems.length` check with
 * `if (false)`, deleting `process.exitCode = 1`, wrapping a verdict in
 * `if (false && ...)`, and swallowing the "consumer THREW" push. They are the
 * "verdict right, exit code wrong" class, which NO in-process assertion can
 * see. `validate-open-graph` and `validate-pr-rigor` each ship a contract suite
 * that spawns the gate as a child process and reads the exit code from
 * outside; this gate has none, and neither do `validate-i18n`,
 * `validate-courses`, `validate-course-slots` or `validate-fee-labels`. That is
 * a named gap consistent with repo precedent, not a solved problem.
 *
 * ALSO NOT COVERED: nothing pins the per-route `export const revalidate` that
 * keeps the 30-day fetch from setting a PAGE's interval. See the CLAUDE.md
 * bullet for the measured reason the obvious check was rejected and the shape a
 * correct one would take.
 */
import { createServer, type Server } from 'node:http'

/**
 * A payload carrying every field the unguarded consumers dereference.
 * Weekday-morning is 610 on purpose -- see the docblock. It must NEVER equal
 * FALLBACK_BAY_MIN, or the accept cases stop discriminating.
 */
const GOOD = {
  bayRates: {
    morning: [{ name: 'Weekday morning', price: 610 }],
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
/** What the live fixture above resolves to, so the two paths are separable. */
const LIVE_BAY_MIN = 610

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

  // VALUE corruption, not shape corruption. These are well-formed catalogs, so
  // a structure-only guard accepts every one of them. Added after review
  // measured that an all-zero payload rendered "0 THB" across the rate cards,
  // guide prose and Offer.price -- `findPrice` returns 0 and `0 ?? FALLBACK`
  // is 0, so nullish coalescing never fires. Under a 30-day cache that is a
  // month of plausible-looking wrong prices.
  { name: '200 + every price zero', status: 200, contentType: 'application/json', body: JSON.stringify({ ...GOOD, bayRates: { morning: [{ name: 'Weekday morning', price: 0 }], afternoon: [{ name: 'Weekend afternoon', price: 0 }], evening: [{ name: 'Weekend evening', price: 0 }] }, coaching: [{ name: '1 Golf Lesson', price: 0 }] }), expectLive: false },
  { name: '200 + morning bay rates empty', status: 200, contentType: 'application/json', body: JSON.stringify({ ...GOOD, bayRates: { ...GOOD.bayRates, morning: [] } }), expectLive: false },
  { name: '200 + a negative price', status: 200, contentType: 'application/json', body: JSON.stringify({ ...GOOD, coaching: [{ name: '1 Golf Lesson', price: -1800 }] }), expectLive: false },
  { name: '200 + price as a string', status: 200, contentType: 'application/json', body: JSON.stringify({ ...GOOD, bayRates: { ...GOOD.bayRates, morning: [{ name: 'Weekday morning', price: '610' }] } }), expectLive: false },
  // Corruption in a NON-headline array. `packages` carries no positive-price
  // requirement (it may legitimately be empty), so hasPositivePrice cannot see
  // this one and only pricesAreFinite rejects it. Without this case that check
  // is not load-bearing -- deleting it was a SURVIVING mutant until this case
  // existed, while a negative package price would still reach findPrice and
  // render.
  { name: '200 + negative price in packages', status: 200, contentType: 'application/json', body: JSON.stringify({ ...GOOD, packages: [{ name: 'Pack', price: -500 }] }), expectLive: false },
]

/**
 * Anti-vacuity. Exact equalities, not floors.
 *
 * EXPECTED_JUDGED counts work JUDGED, and `judged++` deliberately sits BELOW
 * both verdict comparisons. It was above them until mutation testing on
 * 2026-09-04 showed a `continue` one line lower left judged at its true 12 and
 * both floors at their true values while evaluating ZERO comparisons -- exit 0.
 * That is the smoke-L6 / checkPackageNoun shape applied one line too high.
 * Do not move it back up.
 *
 * Both floors are needed and they are not redundant: MIN_REJECT_CASES alone
 * still allowed `CASES.slice(2)` (dropping BOTH accept cases) to pass once
 * EXPECTED_JUDGED was adjusted to match, so the suite could go green while
 * proving nothing about over-strictness.
 */
const EXPECTED_JUDGED = 17
const MIN_REJECT_CASES = 15
const MIN_ACCEPT_CASES = 2

async function main() {
  let current: Case = CASES[0]
  /**
   * Counts requests the stub actually served. Pins the module-load-order
   * invariant below: if a future refactor hoists a static `@/lib/pricing`
   * import above the env assignment, PRICING_API binds to the REAL endpoint
   * and this counter -- not a confusing network failure -- names the cause.
   */
  let hits = 0
  const server: Server = createServer((_req, res) => {
    hits++
    res.writeHead(current.status, { 'content-type': current.contentType })
    res.end(current.body)
  })
  await new Promise<void>((resolve) => server.listen(0, resolve))
  const { port } = server.address() as { port: number }
  process.env.NEXT_PUBLIC_PRICING_API_URL = `http://127.0.0.1:${port}/`

  // Imported AFTER the env var is set: PRICING_API is a module-scope const read
  // at import time. Direct assignment beats any .env value, so a CI-set variable
  // cannot shadow it. The only static import in this file is node:http.
  const { getPricingCatalog } = await import('@/lib/pricing')
  const { getSiteFacts } = await import('@/lib/site-facts')
  const { getBayRatesData, getLessonPricingData, getEventPackagesData } = await import('@/data/pricing')

  const problems: string[] = []
  let judged = 0
  let rejectCases = 0
  let acceptCases = 0

  for (const testCase of CASES) {
    current = testCase
    const expectBayMin = testCase.expectLive ? LIVE_BAY_MIN : FALLBACK_BAY_MIN

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
      // A throwing case still RAN, so it counts toward all three floors —
      // otherwise a single throw reds the run with a confusing floor message
      // instead of the actual diagnosis.
      judged++
      if (testCase.expectLive) acceptCases++
      else rejectCases++
      problems.push(`${testCase.name}: a consumer THREW — ${(err as Error).message}`)
      console.log(`  ✗ ${testCase.name.padEnd(34)} THREW`)
      continue
    }

    if (live !== testCase.expectLive) {
      problems.push(
        `${testCase.name}: catalog was ${live ? 'ACCEPTED' : 'rejected'}, expected ${testCase.expectLive ? 'ACCEPTED' : 'rejected'}`
      )
    }
    if (bayMin !== expectBayMin) {
      problems.push(
        `${testCase.name}: bayHourlyMin ${bayMin}, expected ${expectBayMin} (${testCase.expectLive ? 'live fixture' : 'pinned fallback'})`
      )
    }

    // All three counters sit BELOW the verdicts, deliberately. See the
    // EXPECTED_JUDGED docblock: incremented at the top of the loop they count
    // iterations VISITED, and a `continue` above this point would leave every
    // floor satisfied at its true value while evaluating zero comparisons.
    judged++
    if (testCase.expectLive) acceptCases++
    else rejectCases++

    console.log(
      `  ${live === testCase.expectLive && bayMin === expectBayMin ? '✓' : '✗'} ${testCase.name.padEnd(34)} live=${String(live).padEnd(5)} bayMin=${bayMin}`
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
  if (acceptCases < MIN_ACCEPT_CASES) {
    problems.push(`ANTI-VACUITY: only ${acceptCases} accept case(s), expected at least ${MIN_ACCEPT_CASES}`)
  }
  // A FLOOR, not an equality, and the reason is worth stating because the
  // equality looks more rigorous and is simply wrong: on the reject path
  // getPricingCatalog returns null, so getSiteFacts and the three data getters
  // each re-enter it via `catalog ?? await getPricingCatalog()`. A rejected
  // case therefore costs 5 requests and an accepted one costs 1 — measured at
  // 2x1 + 14x5 = 72 against 16 cases. What this must catch is the module-load
  // -order regression, where PRICING_API binds to the real endpoint before
  // main() sets the env var; that drives hits to ZERO, which any floor catches.
  if (hits < EXPECTED_JUDGED) {
    problems.push(
      `ANTI-VACUITY: the stub server served only ${hits} request(s), expected at least ${EXPECTED_JUDGED} — ` +
        `getPricingCatalog may be pointing somewhere other than the stub (module-load order?)`
    )
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
    `✅ validate-pricing-payload: ${judged} payload(s) judged (${rejectCases} hostile, ${acceptCases} healthy, ${hits} stub request(s)) — no unusable 200 reaches a consumer, and none throws.`
  )
}

main().catch((err) => {
  console.error('❌ validate-pricing-payload crashed:', err)
  process.exit(1)
})
