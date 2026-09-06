/**
 * Shared self-test harness for the `validate:*` gates.
 *
 * ONE mechanism, in one place, because the alternative was four hand-rolled
 * copies of a mutable counter and every copy failed differently.
 *
 * THE HISTORY, because it is the argument for this file existing. Each gate's
 * `--self-test` used to be `for (const t of TESTS) { ... }` with a `ran++`
 * somewhere in the body, and a `ran !== TESTS.length` check afterwards meant to
 * prove the suite had not been silently disarmed. Three placements, three
 * escapes:
 *
 *   ran++ at the top of the body      -> `break` ran 0 cases, printed the full
 *                                        total, exited 0
 *   ran++ after the evaluation        -> `continue` one line lower did the same
 *   ran++ after the comparison        -> `continue` below THAT did the same
 *
 * Every placement leaves a skip shape, because a loop body owns its own control
 * flow. A counter answers "how many iterations began", which is not the question
 * anyone cares about.
 *
 * `Array.prototype.map` answers it structurally: exactly one element out per
 * element in, so the examined count IS the case count and cannot be overstated.
 * `continue` is not legal inside the judge (a function body is not a loop), and
 * the one remaining escape — a bare `return` — yields `undefined`, which the
 * shape check below rejects by name.
 *
 * WHAT THIS STILL CANNOT DO, stated because the previous three attempts all
 * overclaimed. A harness that LIES is out of reach from inside: hardcoding the
 * failure count, or a judge returning a fabricated `{ ok: true }`, produces
 * well-shaped output and a green run. That contract — "`--self-test` exits 1
 * when a detector is broken" — is only observable from outside the process, and
 * is covered by an external fixture suite that runs the gate as a child process
 * against a deliberately mutated copy of itself. See
 * scripts/validate-open-graph-contract.ts. Only open-graph has one today; the
 * other four gates are a named follow-up, not a solved problem.
 */

export interface Verdict {
  /** Did the case pass? */
  ok: boolean
  /** Human label, printed either way. */
  label: string
  /** Why it failed. Printed only on failure. */
  detail?: string
}

export interface SelfTestResult {
  /** Cases this function actually looked at. Use THIS for any floor. */
  examined: number
  failures: number
}

/**
 * Judge every case and print one line each.
 *
 * `examined` is what was looked at, never `cases.length`. Reading a floor off
 * the input array instead left `runSelfTest(kind, CASES.slice(0, 2), judge)`
 * green — the array was intact, so the total was intact, while the assertions
 * went unreported. That was found by mutation, on the version of this logic that
 * lived inline in validate-open-graph.ts, and it is the reason this returns a
 * count rather than exposing the array.
 */
export function runSelfTest<T>(
  kind: string,
  cases: readonly T[],
  judge: (c: T) => Verdict
): SelfTestResult {
  const verdicts = cases.map(judge)

  const bad = verdicts.findIndex(
    (v) => !v || typeof v.ok !== 'boolean' || typeof v.label !== 'string'
  )
  if (bad !== -1) {
    console.error(
      `\nself-test HARNESS BROKEN: [${kind}] verdict #${bad} is not a verdict ` +
        `(${JSON.stringify(verdicts[bad])}) — a judge returned early`
    )
    process.exit(1)
  }

  let failures = 0
  let examined = 0
  for (const v of verdicts) {
    examined++
    if (v.ok) console.log(`  ✓ [${kind}] ${v.label}`)
    else {
      console.log(`  ✗ [${kind}] ${v.label}${v.detail ? ` — ${v.detail}` : ''}`)
      failures++
    }
  }
  return { examined, failures }
}
