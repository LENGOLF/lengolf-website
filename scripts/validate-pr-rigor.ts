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
import { runSelfTest } from './self-test-harness'

const FULL_FLOOR = 3
const DOCS_FLOOR = 1
const DISCLOSURE_RE = /Independent review agents spawned:\s*(\d+)/gi

/**
 * Is this path documentation and nothing else?
 *
 * ALLOWLIST, not a denylist, and that direction is the whole safety property:
 * anything this function does not recognise takes the FULL floor. A new file
 * type, a new directory, a binary asset — all default to strict. The inverse
 * (deny known-code, allow the rest) would silently relax the gate every time
 * the repo grows a surface nobody thought about.
 *
 * `.github/` is excluded even for `.md`, because that tree is executable
 * configuration: a PR editing `ci.yml` is editing the gates themselves, which
 * is the last thing that should ride a reduced floor.
 */
export function isDocPath(raw: string): boolean {
  const path = raw.trim().replace(/\\/g, '/').replace(/^\.\//, '')
  if (!path) return false
  if (path.startsWith('.github/')) return false
  return /\.md$/i.test(path)
}

export type FloorMode = 'full' | 'docs-only'
export interface FloorDecision {
  floor: number
  mode: FloorMode
  why: string
}

/**
 * Pick the agent floor from the PR's changed paths.
 *
 * WHY PATHS AND NOT SIZE. The obvious relaxation is "small diff -> small floor",
 * and it is wrong in this repo, measured over the last 40 merged PRs: a
 * 50-line threshold would have exempted #119 (43 lines, 4 files), whose review
 * pass is what caught `rancho-charnvee` being flagged in error, plus #101 (32)
 * and #103 (37), both subtle locale defects live on translated pages. Small
 * diff does not mean low risk here. What does correlate is whether the PR can
 * change rendered output or gate behaviour at all — a path property.
 *
 * The floor is derived from data the PR AUTHOR CANNOT WRITE IN THE BODY, which
 * is the same constraint the docblock above states for the count itself. An
 * author-declared "this one is small" line would collapse the gate to
 * "state any number", which is the failure it exists to prevent.
 *
 * EVERY unknown resolves to the full floor. Missing list, missing count, or a
 * list that disagrees with the payload's own count (a truncated first page of
 * an all-`.md` listing would otherwise read as docs-only on a 132-file PR) —
 * all strict. A gate that relaxes when its input is missing is the vacuous-gate
 * failure this repo keeps re-learning.
 */
export function resolveFloor(
  paths: readonly string[],
  payloadCount: number | null
): FloorDecision {
  const full = (why: string): FloorDecision => ({ floor: FULL_FLOOR, mode: 'full', why })

  if (paths.length === 0) return full('no changed-file list available')
  if (payloadCount === null) {
    return full('no changed-file count in the event payload to cross-check against')
  }
  if (payloadCount !== paths.length) {
    return full(
      `changed-file list has ${paths.length} path(s) but the payload counts ${payloadCount} ` +
        '— possible truncated pagination, so not trusted'
    )
  }

  const code = paths.filter((p) => !isDocPath(p))
  if (code.length > 0) {
    const sample = code.slice(0, 3).join(', ')
    const more = code.length > 3 ? `, +${code.length - 3} more` : ''
    return full(`${code.length} non-documentation file(s) changed: ${sample}${more}`)
  }

  return {
    floor: DOCS_FLOOR,
    mode: 'docs-only',
    why: `all ${paths.length} changed file(s) are documentation`,
  }
}

// ---------------------------------------------------------------------------
// Self-test
// ---------------------------------------------------------------------------

interface PathCase {
  kind: 'path'
  name: string
  path: string
  want: boolean
}
interface FloorCase {
  kind: 'floor'
  name: string
  paths: string[]
  count: number | null
  want: number
  /**
   * Which guard must produce the verdict, matched as a substring of `why`.
   *
   * NOT decoration. Asserting the floor ALONE lets a case pass for the wrong
   * reason: deleting the `payloadCount === null` guard was measured green,
   * because a null count then falls through to the count-mismatch branch
   * (`null !== paths.length` is true for every non-empty list) and returns the
   * same strict floor by a different route. Several branches converge on 3, so
   * the number cannot identify which one ran.
   */
  wantWhy: string
}
type Case = PathCase | FloorCase

const SELF_TESTS: readonly Case[] = [
  // --- isDocPath -----------------------------------------------------------
  { kind: 'path', name: 'root markdown', path: 'CLAUDE.md', want: true },
  { kind: 'path', name: 'readme', path: 'README.md', want: true },
  { kind: 'path', name: 'docs tree', path: 'docs/architecture.md', want: true },
  { kind: 'path', name: 'skill file', path: '.claude/skills/pr-rigor/SKILL.md', want: true },
  { kind: 'path', name: 'uppercase extension', path: 'docs/README.MD', want: true },
  { kind: 'path', name: 'windows separators', path: 'docs\\i18n-review-checklist.md', want: true },
  { kind: 'path', name: 'leading ./', path: './CLAUDE.md', want: true },
  { kind: 'path', name: 'a gate script', path: 'scripts/validate-pr-rigor.ts', want: false },
  { kind: 'path', name: 'a page', path: 'app/[locale]/page.tsx', want: false },
  { kind: 'path', name: 'course data', path: 'data/golf-courses/bangkok/thana-city.ts', want: false },
  { kind: 'path', name: 'a locale catalog', path: 'messages/ja.json', want: false },
  { kind: 'path', name: 'package manifest', path: 'package.json', want: false },
  { kind: 'path', name: 'an image', path: 'public/images/favicon.png', want: false },
  // The gates themselves are never docs, even as markdown.
  { kind: 'path', name: 'workflow yaml', path: '.github/workflows/ci.yml', want: false },
  {
    kind: 'path',
    name: 'markdown UNDER .github',
    path: '.github/PULL_REQUEST_TEMPLATE.md',
    want: false,
  },
  { kind: 'path', name: 'empty path', path: '   ', want: false },
  { kind: 'path', name: 'markdown-ish but not markdown', path: 'docs/notes.markdown', want: false },

  // --- resolveFloor --------------------------------------------------------
  {
    kind: 'floor',
    name: 'all docs -> relaxed',
    paths: ['CLAUDE.md', '.claude/skills/pr-rigor/SKILL.md'],
    count: 2,
    want: DOCS_FLOOR,
    wantWhy: 'are documentation',
  },
  {
    kind: 'floor',
    name: 'single doc -> relaxed',
    paths: ['docs/development.md'],
    count: 1,
    want: DOCS_FLOOR,
    wantWhy: 'are documentation',
  },
  {
    kind: 'floor',
    name: 'one code file among docs -> strict',
    paths: ['CLAUDE.md', 'lib/course-fees.ts'],
    count: 2,
    want: FULL_FLOOR,
    wantWhy: 'non-documentation file(s) changed',
  },
  {
    kind: 'floor',
    name: 'workflow edit is never docs-only -> strict',
    paths: ['CLAUDE.md', '.github/workflows/ci.yml'],
    count: 2,
    want: FULL_FLOOR,
    wantWhy: 'non-documentation file(s) changed',
  },
  {
    kind: 'floor',
    name: 'empty list -> strict',
    paths: [],
    count: 0,
    want: FULL_FLOOR,
    wantWhy: 'no changed-file list available',
  },
  {
    kind: 'floor',
    name: 'no payload count -> strict',
    paths: ['CLAUDE.md'],
    count: null,
    want: FULL_FLOOR,
    wantWhy: 'no changed-file count',
  },
  {
    kind: 'floor',
    name: 'truncated list (count disagrees) -> strict',
    paths: ['CLAUDE.md', 'README.md'],
    count: 132,
    want: FULL_FLOOR,
    wantWhy: 'truncated pagination',
  },
  {
    kind: 'floor',
    name: 'all code -> strict',
    paths: ['app/layout.tsx', 'lib/jsonld.ts'],
    count: 2,
    want: FULL_FLOOR,
    wantWhy: 'non-documentation file(s) changed',
  },
]

function selfTest(): never {
  // map() via runSelfTest: one verdict per case by construction, so there is no
  // counter to place correctly and no declared-vs-executed check to maintain.
  const result = runSelfTest('pr-rigor', SELF_TESTS, (c) => {
    if (c.kind === 'path') {
      const got = isDocPath(c.path)
      return {
        ok: got === c.want,
        label: `[path] ${c.name} — expected ${c.want ? 'doc' : 'code'}, got ${got ? 'doc' : 'code'}`,
      }
    }
    const got = resolveFloor(c.paths, c.count)
    return {
      ok: got.floor === c.want && got.why.includes(c.wantWhy),
      label: `[floor] ${c.name} — expected ${c.want}, got ${got.floor} (${got.mode}: ${got.why})`,
    }
  })

  const ran = result.examined
  const pathCases = SELF_TESTS.filter((c) => c.kind === 'path').length
  const floorCases = SELF_TESTS.filter((c) => c.kind === 'floor').length
  // Cases that must NOT relax. A classifier stuck at "everything is docs" is the
  // failure mode with a live cost, so the suite pins how many cases prove the
  // strict path is still reachable — and the relaxing count pins the inverse, a
  // classifier stuck at "nothing is docs", which would go green on a suite that
  // only ever asserted strictness.
  const strictCases = SELF_TESTS.filter(
    (c) => (c.kind === 'path' && !c.want) || (c.kind === 'floor' && c.want === FULL_FLOOR)
  ).length
  const relaxCases = SELF_TESTS.filter(
    (c) => (c.kind === 'path' && c.want) || (c.kind === 'floor' && c.want === DOCS_FLOOR)
  ).length

  console.log(
    `\n${ran} self-tests ran (${pathCases} path, ${floorCases} floor; ` +
      `${strictCases} must stay strict, ${relaxCases} must relax) · ${result.failures} failed`
  )
  if (ran !== SELF_TESTS.length) {
    console.log(`FAIL: HARNESS BROKEN — ${SELF_TESTS.length} cases declared, ${ran} executed`)
    process.exit(1)
  }
  // Floors at their true values, so deleting cases cannot hollow the suite out.
  if (pathCases < 17 || floorCases < 8 || strictCases < 16 || relaxCases < 9) {
    console.log(
      'FAIL: self-test suite has lost cases ' +
        '(need >= 17 path, >= 8 floor, >= 16 strict, >= 9 relaxing)'
    )
    process.exit(1)
  }
  if (result.failures > 0) process.exit(1)
  console.log(
    'OK — documentation relaxes the floor, every other surface and every unknown does not'
  )
  process.exit(0)
}

if (process.argv.includes('--self-test')) selfTest()

// ---------------------------------------------------------------------------
// Gate
// ---------------------------------------------------------------------------

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
      '   Every PR must state how it was reviewed, in PROSE — not in a fenced\n' +
      '   block, backticks or a blockquote, all of which this gate strips:\n' +
      '     Independent review agents spawned: N\n\n' +
      '   See .claude/skills/pr-rigor/SKILL.md\n'
  )
  process.exit(1)
}

const changedPaths = (process.env.PR_CHANGED_PATHS ?? '')
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter(Boolean)
const rawCount = process.env.PR_CHANGED_FILES_COUNT
const payloadCount =
  rawCount !== undefined && rawCount.trim() !== '' && Number.isFinite(Number(rawCount))
    ? Number(rawCount)
    : null

const decision = resolveFloor(changedPaths, payloadCount)

// Printed on EVERY run, pass or fail. A relaxation nobody can see in the log is
// one nobody audits, and this is the half of the gate an author does not write.
console.log(`ℹ️  validate-pr-rigor: floor ${decision.floor} (${decision.mode}) — ${decision.why}.`)

// Only occurrences in PROSE count. Code spans, fenced blocks and blockquotes
// are where a body QUOTES the requirement, and quoting is what defeated the
// first-match read: "the template requires a line of the form
// `Independent review agents spawned: 3`" above a real line reading 0 passed
// the floor while disclosing zero review.
//
// Taking the minimum of ALL occurrences was the first fix and it was wrong in
// the opposite direction: a body explaining THIS change necessarily quotes
// `... spawned: 0`, so the minimum was 0 and the gate reddened a correct,
// self-documenting description — uncleárable by editing it, per the payload
// caveat above. Prose-vs-code separates the two cases cleanly: the decoy is
// backticked and the real line is not, in both bodies.
//
// The minimum is still applied to what survives, so two PROSE numbers cannot
// be gamed by ordering.
const prose = body
  .replace(/```[\s\S]*?```/g, ' ')
  .replace(/`[^`\n]*`/g, ' ')
  .split(/\r?\n/)
  .filter((l) => !/^\s*>/.test(l))
  .join('\n')
const matches = [...prose.matchAll(DISCLOSURE_RE)]

if (matches.length === 0) {
  console.error(
    '\n❌ validate-pr-rigor: PR body is missing the pr-rigor disclosure line.\n\n' +
      '   Add, verbatim and honestly:\n' +
      '     Independent review agents spawned: N\n\n' +
      '   It must sit in PLAIN PROSE. Fenced blocks, `backticks` and > blockquotes\n' +
      '   are stripped before matching, because a body that QUOTES the requirement\n' +
      '   is the decoy this gate was hardened against — so a correct line inside a\n' +
      '   fence reads as absent. (PR #123 lost a CI round to exactly that.)\n\n' +
      `   N must be >= ${decision.floor} independent finder/role agents on DISTINCT angles\n` +
      `   (${decision.mode}: ${decision.why}).\n` +
      '   An inline /code-review with zero agents spawned is not a review, and a\n' +
      '   verdict reported from one is invalid — see .claude/skills/pr-rigor/SKILL.md\n'
  )
  process.exit(1)
}

const counts = matches.map((m) => Number(m[1])).filter((n) => Number.isFinite(n))
const count = counts.length > 0 ? Math.min(...counts) : NaN
const quoted = matches.length > 1 ? ` (lowest of ${matches.length} prose occurrences)` : ''

if (!Number.isFinite(count) || count < decision.floor) {
  console.error(
    `\n❌ validate-pr-rigor: disclosure says "${count}"${quoted} — below the ${decision.floor}-agent floor.\n\n` +
      `   Floor is ${decision.floor} because ${decision.why}.\n` +
      (decision.mode === 'full'
        ? '   pr-rigor expects 3-6 finders on deliberately distinct angles, plus the\n' +
          '   role passes (claim audit, guard efficacy, native-QA, release-readiness).\n'
        : '   A documentation-only PR runs a reduced pass, but not a zero pass: the\n' +
          '   claim audit is the one that matters most here, because a false claim in\n' +
          '   CLAUDE.md or a skill is read as fact by the next session.\n') +
      '   If the review genuinely was smaller, say so in the PR and raise the count\n' +
      '   by actually running the pass — do not edit the number.\n'
  )
  process.exit(1)
}

console.log(
  `✅ validate-pr-rigor: PR discloses ${count} independent review agents (floor ${decision.floor}, ${decision.mode}).`
)
