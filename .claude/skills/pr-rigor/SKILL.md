---
name: pr-rigor
description: The pre-merge review gate for this repo. Run BEFORE telling anyone a PR is ready, before requesting review, and before any "this is green / ready to merge" claim. Spawns independent adversarial review agents on distinct angles plus role passes (claim audit, guard efficacy, native-QA, release-readiness), then posts a disclosed verdict. Use when finishing a PR, when asked "is this ready?", or when about to declare work done.
---

# pr-rigor

The gate that decides whether a PR may be called ready. Reconstructed from its
only surviving record — the PR bodies and comments of #36, #56, #57, #86 and #88
— after it was lost by never having been written down.

## The rule that this exists to enforce

> **An inline `/code-review` with zero agents spawned is NOT a review.**
> A verdict reported from one is invalid.

This is quoted from PR #88, which disclosed exactly that failure. It has now
happened at least twice (PR #88, and PR #93 where a clean inline `/code-review`
was reported as "no correctness bugs" and an outside pass then found six
confirmed defects, three of them live on indexed pages).

**Corollary maxim, from #88:** *treat any claim in the commit history, the PR
description, or CLAUDE.md as an assertion, not evidence.* Verify it or delete it.

## When to run

- Before saying a PR is "ready", "green", "good to merge", or ready for anyone
  to review — including the user's manager.
- Before writing a PR description that makes coverage claims.
- After any push that changes behaviour, if a prior pr-rigor verdict is stale.

CI passing is **not** a substitute. Every defect found on PR #93 shipped with
`lint`, `build-and-smoke` and `lighthouse` all green.

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

**Verify by rendering, not by reasoning.** For data-driven output, execute the
actual code path and print what a reader would see. On PR #93 the final check was
a script that rendered every affected surface for the seasonal course and
asserted no day-of-week claim survived — that is evidence; "I checked the
consumers" is not.

## Required disclosure

Every pr-rigor verdict — in the PR comment and in any statement to the user —
carries this line, filled in honestly:

```
Independent review agents spawned: N
```

plus an explicit statement of whether it was a real multi-agent pass or an
inline self-read. If N is 0, you may not report a verdict at all.

## Report format

Post as a PR comment, in this order:

1. **Disclosure** — agent count, angles, and whether anything was a self-read.
2. **The ones that mattered** — defects that would have shipped, with impact.
3. **Also fixed** — lower-severity findings applied.
4. **Confirmed clean** — what was checked and held, so the reader knows the
   coverage, not just the failures.
5. **Known gaps, not fixed here** — with the reason. Latent-but-unreachable
   issues belong here, named, rather than omitted.
6. **Gate** — `lint · typecheck · validate:links · validate:i18n · validate:courses
   · validate:hotels` + smoke count + CI conclusion.

## Anti-patterns this gate exists to stop

- Reporting a verdict from a single inline `/code-review`.
- Generalizing from one fixed instance ("found the missed consumer" → "all
  consumers now honor it"). Enumerate, don't infer.
- Treating CI green as proof of correctness. CI cannot read a sentence.
- Writing a coverage claim into CLAUDE.md or a PR body before the audit that
  would substantiate it.
- Declaring ready while any check is still in progress.
