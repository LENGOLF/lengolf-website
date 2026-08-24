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
const DISCLOSURE_RE = /Independent review agents spawned:\s*(\d+)/i

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

const match = body.match(DISCLOSURE_RE)

if (!match) {
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

const count = Number(match[1])

if (!Number.isFinite(count) || count < MIN_AGENTS) {
  console.error(
    `\n❌ validate-pr-rigor: disclosure says "${match[0]}" — below the ${MIN_AGENTS}-agent floor.\n\n` +
      '   pr-rigor expects 3-6 finders on deliberately distinct angles, plus the\n' +
      '   role passes (claim audit, guard efficacy, native-QA, release-readiness).\n' +
      '   If the review genuinely was smaller, say so in the PR and raise the count\n' +
      '   by actually running the pass — do not edit the number.\n'
  )
  process.exit(1)
}

/**
 * SELF-REFUTATION check.
 *
 * The floor above is a grep for a number, and a number can pass it while the
 * same body explains that the number is wrong. Observed on PR #110: the body
 * said "Independent review agents spawned: 4" and, four lines later, "Two
 * produced the original two commits". Authoring agents are not independent
 * reviewers, so the honest count was 2 — below the floor — yet CI passed
 * because it only ever read the digit.
 *
 * So: if the body admits that some of the counted agents WROTE the code, the
 * disclosure has refuted itself and the number has to be restated.
 *
 * The pattern is derived from the sentence that actually slipped through —
 * "Two produced the original two commits" — NOT from a guess at the phrasing.
 * The first draft of this check required "<n> of them <verb>" and did not
 * match that line at all: the subject is a bare quantity. Three anchors keep
 * it from firing on ordinary prose: the quantity must be the clause SUBJECT,
 * the verb is authorship-only (not "fixed" or "found"), and a code noun must
 * follow. Verified against both real bodies — #110's fails, #109's passes.
 */
const SELF_REFUTATION_RE =
  /(?:^|[.!?]\s+|\n)\s*(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten)\b[^.\n]{0,45}?\b(?:authored|produced|wrote|created)\b[^.\n]{0,70}?\b(?:commits?|code|changes?|fix|fixes|diff)\b/i

const refutation = body.match(SELF_REFUTATION_RE)

if (refutation) {
  console.error(
    `\n❌ validate-pr-rigor: the disclosure refutes itself.\n\n` +
      `   It claims ${count} independent review agents, but the body also says:\n` +
      `     "${refutation[0].trim()}"\n\n` +
      '   An agent that AUTHORED the code is not an independent reviewer of it —\n' +
      '   that is the whole mechanism the count exists to report. Restate the\n' +
      '   number counting reviewers ONLY, and if that drops it below the floor,\n' +
      `   raise it by running the missing pass rather than by editing the digit.\n`
  )
  process.exit(1)
}

console.log(
  `✅ validate-pr-rigor: PR discloses ${count} independent review agents (floor ${MIN_AGENTS}), ` +
    `with no self-refutation in the body.`
)
