/**
 * pr-rigor disclosure gate.
 *
 * WHY: `.claude/skills/pr-rigor/SKILL.md` requires every PR to state
 * `Independent review agents spawned: N`. That disclosure is self-attested by
 * the party with the incentive to skip it — which is exactly how it failed
 * twice: PR #88 disclosed reporting a verdict from a zero-agent self-read, and
 * PR #93 (the PR that introduced the skill) shipped with no disclosure at all.
 *
 * This gate cannot prove the agents ran. It makes SILENT OMISSION impossible:
 * a PR either carries the line, or `lint` goes red. Skipping the review now
 * requires writing an explicit number a reviewer can challenge, instead of
 * saying nothing.
 *
 * SCOPE, and it is deliberately narrow: this gate proves only that a NUMBER is
 * present and >= the floor. It cannot prove the agents ran, and it does not try
 * to read the surrounding prose. A self-refutation check that did was added and
 * then REMOVED after two independent review passes measured it: it fired on 8
 * of 10 honest sentences — including "Six agents wrote no code", which asserts
 * independence, and "Two rounds produced the fixes", which is this repo's own
 * idiom — while missing 22 of 25 rephrasings that meant exactly what the body
 * it was built from meant (synonyms for the verb, passive voice, a leading
 * "- " bullet, a line break inside the clause). A body reading "I spawned zero
 * independent agents" passed it. Combined with the payload caveat below, each
 * false red costs a forced commit and a full CI round-trip, and this repo's own
 * rule is that a gate firing on correct code gets switched off. DO NOT re-add a
 * prose-reading version: judging whether a paragraph concedes authorship is not
 * a regex's job. If the count needs to be trustworthy, the mechanism has to be
 * evidence the reviewer cannot author — not a better pattern over the same
 * self-attested sentence.
 *
 * CAVEAT: `github.event.pull_request.body` is captured in the event payload, so
 * editing a PR description does NOT re-trigger this check and re-running the job
 * replays the stale body. Push a commit to re-evaluate. (Observed on PR #93: the
 * gate correctly failed a run whose payload predated the disclosure being added.)
 *
 * Runs only when a PR body is available (CI provides it via PR_BODY). Locally,
 * and on pushes that are not pull requests, it no-ops with a clear message
 * rather than failing — a gate that blocks ordinary local work gets disabled,
 * and a disabled gate protects nothing.
 */
const MIN_AGENTS = 3
const DISCLOSURE_RE = /Independent review agents spawned:\s*(\d+)/gi

const body = process.env.PR_BODY ?? ''
const isPullRequest = process.env.GITHUB_EVENT_NAME === 'pull_request'

if (!isPullRequest && !body) {
  console.log(
    'ℹ️  validate-pr-rigor: no PR context (PR_BODY unset, not a pull_request event) — skipping.\n' +
      '   This check runs on pull requests in CI.'
  )
  process.exit(0)
}

if (!body.trim()) {
  console.error(
    '\n❌ validate-pr-rigor: PR body is empty.\n\n' +
      '   Every PR must state how it was reviewed:\n' +
      '     Independent review agents spawned: N\n\n' +
      '   See .claude/skills/pr-rigor/SKILL.md\n'
  )
  process.exit(1)
}

// EVERY occurrence, and the LOWEST wins. A first-match read was satisfied by
// QUOTING the requirement — a body containing "the template requires a line of
// the form `Independent review agents spawned: 3`" above a real line reading
// 0 passed the floor while disclosing zero review. Taking the minimum is
// robust to a decoy on either side of the real line, and a body stating one
// number is unaffected.
const matches = [...body.matchAll(DISCLOSURE_RE)]

if (matches.length === 0) {
  console.error(
    '\n❌ validate-pr-rigor: PR body is missing the pr-rigor disclosure line.\n\n' +
      '   Add, verbatim and honestly:\n' +
      '     Independent review agents spawned: N\n\n' +
      `   N must be >= ${MIN_AGENTS} independent finder/role agents on DISTINCT angles.\n` +
      '   An inline /code-review with zero agents spawned is not a review, and a\n' +
      '   verdict reported from one is invalid — see .claude/skills/pr-rigor/SKILL.md\n'
  )
  process.exit(1)
}

const counts = matches.map((m) => Number(m[1])).filter((n) => Number.isFinite(n))
const count = counts.length > 0 ? Math.min(...counts) : NaN
const quoted = matches.length > 1 ? ` (lowest of ${matches.length} occurrences)` : ''

if (!Number.isFinite(count) || count < MIN_AGENTS) {
  console.error(
    `\n❌ validate-pr-rigor: disclosure says "${count}"${quoted} — below the ${MIN_AGENTS}-agent floor.\n\n` +
      '   pr-rigor expects 3-6 finders on deliberately distinct angles, plus the\n' +
      '   role passes (claim audit, guard efficacy, native-QA, release-readiness).\n' +
      '   If the review genuinely was smaller, say so in the PR and raise the count\n' +
      '   by actually running the pass — do not edit the number.\n'
  )
  process.exit(1)
}

console.log(
  `✅ validate-pr-rigor: PR discloses ${count} independent review agents (floor ${MIN_AGENTS}).`
)
