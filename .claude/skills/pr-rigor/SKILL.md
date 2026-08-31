---
name: pr-rigor
description: The pre-merge review gate for this repo. Run BEFORE telling anyone a PR is ready, before requesting review, and before any "this is green / ready to merge" claim. Spawns independent adversarial review agents on distinct angles plus role passes (claim audit, guard efficacy, native-QA, release-readiness), then posts a disclosed verdict. Use when finishing a PR, when asked "is this ready?", or when about to declare work done.
---

# pr-rigor

The gate that decides whether a PR may be called ready. Reconstructed from its
only surviving record — the PR bodies of #36, #56 and #57 and a comment on #88 (#86 describes the same discipline without using the name)
— after it was lost by never having been written down.

## The rule that this exists to enforce

> **An inline `/code-review` with zero agents spawned is NOT a review.**
> A verdict reported from one is invalid.

This is quoted from PR #88, which disclosed exactly that failure. It has now
happened at least twice (PR #88, and PR #93 where a clean inline `/code-review`
was reported as "no correctness bugs" and an outside pass then found six
confirmed defects — at least four live on indexed pages, one that rendered
nowhere — with later rounds finding five more).

**Corollary maxim, from #88:** *treat any claim in the commit history, the PR
description, or CLAUDE.md as an assertion, not evidence.* Verify it or delete it.

## When to run

- Before saying a PR is "ready", "green", "good to merge", or ready for anyone
  to review — including the user's manager.
- Before writing a PR description that makes coverage claims.
- After any push that changes behaviour, if a prior pr-rigor verdict is stale.

CI passing is **not** a substitute. Every *pre-existing* defect PR #93 fixed had
shipped to `main` with `lint`, `build-and-smoke` and `lighthouse` green — CI was
never going to catch them, because none of them is a thing CI can read. (Do not
over-claim this: CI was legitimately red on two commits of PR #93 itself, for an
unrelated `next/font` failure.)

## Structure

### 1. Finder agents — 3–6, on deliberately DISTINCT angles

Run in **parallel**, all **read-only**. Give each the diff range, the PR's own
claims, and one angle. Do not give two agents the same angle; overlap wastes the
pass. Angles that have actually caught defects in this repo:

| Angle | Looks for |
|---|---|
| Activation surface | What newly renders/ships that did not before; which URLs are reachable and indexed |
| Cross-file invariants | Registry ⇄ data agreement, flags honored by *every* consumer, derived-set drift |
| Consumer sweep for a changed field/flag | `grep -rn <field> --include=*.ts --include=*.tsx .` with **NO directory scoping** — see below |
| Routing / SEO / structured data | Canonicals, hreflang, JSON-LD claims, redirect behaviour |
| Customer-facing strings | Claims a reader could act on and find false; prices, distances, directions |
| Removed behaviour / line-by-line | What the diff deletes or stops doing, not just what it adds |
| New script/guard logic | Whether the guard can actually fail (see role pass below) |

**The scoping trap.** A directory-scoped grep (`lib/ components/ app/`) misses
`data/`. That is exactly how `data/golf-courses-use-cases.ts` survived two
rounds of "all consumers now honor the flag". Sweeps must be repo-wide.

### 2. Role passes

Run these in addition to the finders — they catch different classes:

- **Claim audit.** Take every factual claim in the PR description, the commit
  messages, and any CLAUDE.md text the PR adds, and verify each against the
  code. On PR #88 this found 10 false / 10 stale / 5 unsupported claims; on
  PR #93 it found a CLAUDE.md line asserting complete consumer coverage that was
  false when written. **A false claim in CLAUDE.md is worse than a bug** — the
  next session reads it as fact and skips the audit.
- **Guard efficacy (mutation testing).** For each guard/validator the PR adds or
  relies on: break the input on purpose and confirm it goes red. A guard that
  cannot fail is worse than no guard (see the CLAUDE.md bullet on vacuous
  gates). #88's pass found the CI `--self-test` gap this way.
- **Native-QA per locale**, when any non-English string changed — per
  `docs/i18n-review-checklist.md`. Reviewers are read-only; the orchestrator
  applies fixes. This is separately mandatory for translation batches.
- **Release-readiness / EM pass.** One agent reads the PR as the person who has
  to approve it: are the claims supported, is the risk stated, is anything
  hidden? Verdict: APPROVE / APPROVE WITH CONDITIONS / REJECT.

### 3. Orchestrator duties

Reviewers never edit. You fact-check every finding against the source, apply the
fixes yourself, and re-run the gate. A finding you disagree with is recorded with
its reason, not silently dropped.

**Verify by rendering, not by reasoning** — but know what rendering proves. On
PR #93 a script rendered every *known* affected surface for the seasonal course
and asserted no day-of-week claim survived. That check passed and was still
wrong: two live defects sat on surfaces the script never enumerated (the
`/under/<tier>/` page chrome, and prose in a guide). **Rendering verifies the
sites you already found; it cannot tell you the set is complete.**

So the rule that actually held is upstream of it:

1. **Enumerate repo-wide first** — `grep -rn <field> --include=*.ts --include=*.tsx .`
   with NO directory scoping — and write down a disposition for EVERY hit
   (renders a label / makes a claim / numeric-only). The enumeration is the
   deliverable; the fix is downstream of it.
2. **Search the claim, not the field.** A grep for `caddie_tip_included` cannot
   find prose written before that flag existed. Grep the words a reader would
   see ("tip", "weekday") as well as the identifier.
3. **Then render** each enumerated site and print what a reader gets.

"I checked the consumers" is not evidence. A list of every consumer with its
disposition, plus rendered output per site, is.

## Required disclosure

Every pr-rigor verdict — in the PR body, in the PR comment, and in any statement
to the user — carries this line, filled in honestly, on a line of its own:

Independent review agents spawned: N

plus an explicit statement of whether it was a real multi-agent pass or an
inline self-read. If N is 0, you may not report a verdict at all.

**That line is written above as plain prose, and that is not a formatting
accident — it is the only form the gate accepts.** In the PR body, do not wrap it
in a fenced code block, do not put it in backticks, and do not set it behind a
`>` blockquote. `scripts/validate-pr-rigor.ts` strips fenced blocks, inline code
spans and blockquoted lines from the body *before* matching, deliberately: a body
that QUOTES the requirement in backticks was the decoy that defeated the gate's
original first-match read (see the long comment above the `prose` const in that
file). A quoted line is therefore not a disclosure — it is precisely the shape
the gate was hardened to ignore.

Measured on PR #123's real body, whose disclosure is present, correct and reads
6 — prose exits 0; the identical body with that one line fenced, backticked or
blockquoted exits 1 with *"PR body is missing the pr-rigor disclosure line"*, all
three. PR #123 lost a full CI round to the fenced form, which reads as emphasis
and is the natural instinct.

**Two traps here, and they are independent — you can hit either one alone.**

1. **Form.** Plain prose, in the PR **body**. The gate reads
   `github.event.pull_request.body`; it never sees PR comments, so a verdict
   posted only as a comment leaves the body bare and the gate red.
2. **Ordering.** It reads that body from the **event payload**, so editing the
   description does not re-trigger the check and re-running the job replays the
   stale body. Write the line into the body BEFORE the final push, or push
   another commit afterwards to re-evaluate. Editing the body and hitting re-run
   is the one thing that cannot work.

**Verify locally before you push.** This is the only step in the `lint` job that
cannot be checked by running the repo alone — it needs `PR_BODY` and
`GITHUB_EVENT_NAME` from the environment. Against an existing PR:

```bash
PR_BODY="$(gh pr view <N> --json body --jq .body)" GITHUB_EVENT_NAME=pull_request npm run validate:pr-rigor
```

Before the PR exists, run it against the draft body you are about to post:

```bash
PR_BODY="$(cat pr-body.md)" GITHUB_EVENT_NAME=pull_request npm run validate:pr-rigor
```

## Report format

Post as a PR comment, in this order:

1. **Disclosure** — agent count, angles, and whether anything was a self-read.
   The count line belongs in the PR **body** as prose as well as in this comment
   — the gate reads the body only. See Required disclosure above.
2. **The ones that mattered** — defects that would have shipped, with impact.
3. **Also fixed** — lower-severity findings applied.
4. **Confirmed clean** — what was checked and held, so the reader knows the
   coverage, not just the failures.
5. **Known gaps, not fixed here** — with the reason. Latent-but-unreachable
   issues belong here, named, rather than omitted.
6. **Gate** — `lint · typecheck · validate:links · validate:i18n · validate:courses
   · validate:hotels` + smoke count + CI conclusion.

## Enforcement

The disclosure above is self-attested by the party with the incentive to skip it,
which is why `npm run validate:pr-rigor` exists: CI fails the `lint` job when the
PR body carries no prose disclosure line with N >= 3 — prose being load-bearing,
per Required disclosure above. It cannot
prove the agents ran — it makes *silent omission* impossible, forcing an explicit
claim that a reviewer can then challenge. This gate was added because the very
first PR to carry this skill (#93) shipped without the disclosure it mandates.

## Anti-patterns this gate exists to stop

- Reporting a verdict from a single inline `/code-review`.
- Generalizing from one fixed instance ("found the missed consumer" → "all
  consumers now honor it"). Enumerate, don't infer.
- Treating CI green as proof of correctness. CI cannot read a sentence.
- Writing a coverage claim into CLAUDE.md or a PR body before the audit that
  would substantiate it.
- Declaring ready while any check is still in progress.
