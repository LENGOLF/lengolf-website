# i18n Native-QA Review Checklist

The repeatable rubric for reviewing a translation batch (JA / KO / ZH guide content, and
TH/KO/JA UI strings from the Workstream B pipeline). This codifies the review method used in
recent batches so any reviewer — human or agent — produces consistent verdicts.

**Companion files:** the machine-readable house style lives in `data/i18n-glossary/<locale>.json`
(`terminology`, `conventions`, `honesty_constraints`, `transliterations`, `seo_norms`,
`style_notes`). Read the target locale's glossary before reviewing. This doc explains the
*nuance* the JSON can't carry — especially the honesty-scoping rule.

---

## Golden rule: reviewers are READ-ONLY

Reviewers **do not edit** translations. You produce a structured report; the **orchestrator
applies fixes**. This keeps a clean audit trail and prevents two writers racing on the same
copy. Every issue you raise must be actionable enough for someone else to apply verbatim.

---

## Verdict scale

Exactly one verdict per reviewed unit (a page, or a batch of UI strings):

| Verdict | Meaning |
|---|---|
| **APPROVE** | Ships as-is. No blockers, no nits worth raising. |
| **APPROVE_WITH_NITS** | Ships after the orchestrator applies the listed NITs (style-only). No blockers present. |
| **REJECT** | At least one BLOCKER. Must be fixed and re-reviewed before shipping. |

## Severity definitions

**BLOCKER** — must fix before ship. Any of:
- **Invented fact** — a number, price, date, name, distance, or claim not traceable to the EN
  source or an already-shipped locale entry (see fact-fidelity method below).
- **Honesty violation** — claims LENGOLF offers something it does not (e.g. native-language
  coaches or native-language lessons); see the honesty section.
- **Wrong scoping of a negative claim** — a negative coach-language claim stated city-wide
  ("there are no Japanese lessons in Bangkok") instead of scoped to LENGOLF.
- **Broken placeholder** — a next-intl placeholder (`{name}`, `{year}`, `{pct}`, `{n}`,
  `{rate}`) dropped, renamed, or duplicated relative to source.
- **Broken markdown / HTML / URL** — mangled `**`, `[](…)`, heading, tag, or altered link URL.
- **Brand-immutable corruption** — LENGOLF, len.golf, BTS, MRT, PGA, Bravo Golf, booking.len.golf,
  LINE @lengolf altered (note the deliberate JA transliteration exceptions — see glossary
  `transliterations`).

**NIT** — style-only, does not block ship: register/tone drift, a terminology variant where the
glossary has a settled form, a range separator or currency form off-house-style, awkward-but-correct
phrasing, spacing (e.g. KO `드라이빙 레인지`), anti-repetition, SEO length polish.

When in doubt about invented-fact vs style, it is a BLOCKER. Facts are load-bearing; style is not.

---

## Fact-fidelity method (the core check)

Trace **every** number, price, date, proper noun, and factual claim in the translation back to a
source. A translation may only assert what the source asserts.

1. Identify the source: the EN entry of the same slug, or — for locale-specific figures — an
   already-shipped locale entry the batch is explicitly mirroring.
2. For each figure in the translation, find its origin in the source. If it isn't there, it's an
   **invented fact → BLOCKER** (unless it is a GENERAL, non-specific note the source itself
   licenses — e.g. "Japanese full-service carriers follow the same included-in-allowance
   approach", which mirrors the EN intro's general claim without inventing carrier-specific fees).
3. **Per-source divergences are correct, not errors.** Different EN source pages legitimately quote
   different figures for the same real-world thing. Do not "reconcile" them.
   - **Worked example — the caddie-tip divergence:** `green-fee-cost-comparison` quotes a caddie
     tip of **100–200 THB** (average-service framing); `round-of-golf-cost-bangkok` quotes
     **200–300 THB**. Both are faithful to their *own* EN source. A JA/KO/ZH translation of the
     first must say 100–200, the second 200–300. Flagging either as "inconsistent with the other
     page" is **wrong** — do not raise it.
4. Currency, units, and dates must match the source value exactly (only the *rendering* follows
   locale house style — see `conventions` in the glossary).
5. "As of" / effective dates must be preserved with the locale's `as_of_format`
   (JA `2026年7月現在`, KO `2026년 7월 기준`, ZH `截至2026年7月`, TH `ณ กรกฎาคม 2026`).

---

## Honesty & scoping check (the subtle one)

The site makes deliberately honest, LENGOLF-scoped statements about language support. The glossary
`honesty_constraints.forbidden_claims` lists the sensitive strings (JA: `日本人コーチ`,
`日本語レッスン`, `日本語でのレッスン`; KO: `한국인 코치`, `한국어 레슨`; ZH: `中国人教练`,
`中文课程`). **These are honesty rules, not lexical bans** — the strings are *required* in the
correct construction:

- **Correct (APPROVE):** the negative claim is scoped to LENGOLF and paired with the real
  allowance — e.g. JA "LENGOLFには日本人コーチや日本語でのレッスンはありませんが、予約や事前の
  ご相談はLINE @lengolfにて日本語で承っています"; KO "LENGOLF에 한국인 코치나 한국어 레슨은
  없지만, 예약과 사전 상담은 LINE @lengolf에서 한국어로 도와드려요".
- **BLOCKER (REJECT):** the claim is inflated into a positive ("Japanese lessons available",
  "한국어 레슨 진행") — an **honesty violation**.
- **BLOCKER (REJECT):** the negative is stated **city-wide** ("バンコクに日本語レッスンはない")
  instead of scoped to LENGOLF — **wrong scoping**. City-wide statements may only be POSITIVE and
  general (e.g. "バンコクでは英語での指導が一般的です").

**Linter behavior:** a forbidden_claims string appearing WITHOUT a LENGOLF-scoped negation
(`はありません` / `없지만` / `没有` …) and the `LINE @lengolf` allowance nearby is a
**review flag**, not an automatic reject — a human/agent reviewer confirms the scoping.
`flag_mode: "review"` in each glossary encodes this.

Allowed language support everywhere: **booking/consultation via LINE @lengolf** (and
booking.len.golf for online booking), plus the point that on-screen simulator numbers help across
any language barrier. Nothing beyond that.

---

## Fluency checks

- Register matches the glossary `formality`: JA です/ます調; KO 해요체 (합니다체 sparingly);
  ZH 你 in guide prose (not 您); TH สุภาพ without spoken particles.
- Terminology matches glossary `terminology` (`use` form, not an `avoid` variant): e.g. JA
  キャディー not キャディ; KO 그린피/캐디피 closed, 드라이빙 레인지 spaced; ZH 果岭费/球童.
- Reads as native-written, not translated: no calqued EN syntax, no literal idiom.
- Anti-repetition (JA especially): don't end 3+ consecutive sentences identically (です。です。です。).
- Numerals/units/ranges follow `conventions`: half-width digits; JA `〜`, KO `~`, ZH `–` range
  separators; currency rendered per the ruling (JA `THB`, KO `바트`, ZH `泰铢`, TH `บาท`).
- No exclamation marks, no emoji, no marketing-speak inflation.

## SERP / SEO checks

- Title front-loads the target query, then a descriptive tail after a colon, a comma or a
  sentence break (`seo_norms.title_display_target` in the ja/ko/zh glossaries names each
  locale's forms; `th.json` has no `seo_norms`).
  **No em dash** (`—`, or the doubled `——`) in a title or anywhere else in copy: it is the
  owner's house style. Most shipped non-EN guide and FAQ titles still carry one. That is legacy debt for a separate
  native-QA sweep: flag it in copy the batch writes or edits, not in shipped copy it leaves
  untouched, and never copy the pattern from a sibling entry.
- Title within the locale display target (glossary `seo_norms.title_display_target`).
- Meta description puts the hook + query in the first ~80 chars; no keyword stuffing; no invented
  claims (the fact-fidelity rule applies to metadata too).
- Canonical/brand rules intact.

---

## Output format

Return a verdict line, then numbered issues. **Each issue must give the exact current text, the
exact replacement, severity, and a one-line rationale** so the orchestrator can apply it blind:

```
VERDICT: APPROVE_WITH_NITS   (locale: ja, page: golf-lessons-bangkok-ja)

1. [BLOCKER] Invented fact — price not in EN source
   Current:     レッスンパッケージは1時間1,500THBから
   Replace with: レッスンパッケージは1時間1,800THBから
   Why: EN source says 1,800 THB/hour; 1,500 is not traceable to any source.

2. [NIT] Terminology — use settled form
   Current:     キャディフィー
   Replace with: キャディーフィー
   Why: glossary terminology.use = キャディー (long-vowel ー); キャディ is an avoid variant.

3. [NIT] Range separator — house style
   Current:     25~30kg
   Replace with: 25〜30kg
   Why: JA conventions.range_separator = 〜 (wave dash); ~ is the KO form.
```

If APPROVE with nothing to raise, say so in one line. Never silently edit; never invent a fix you
can't ground in source or glossary.

---

## Appendix — known corpus decisions (STOP re-flagging these)

These are settled. Do not raise them as issues; they are correct on purpose.

- **Currency rendering ruling (per locale).** Guide/explainer content: **JA → `THB`** abbreviation
  (e.g. `1,800THB`); **KO → `바트`** spelled (e.g. `1,800바트`); **ZH → `泰铢`** spelled;
  **TH → `บาท`** spelled. JA legacy entries (gg-baggage-fees-ja, exp-25-ja, exp-39-ja) use `バーツ`
  for prices — that's legacy, not the standard; do not propagate, but do not "fix" the shipped ones
  either. `バーツ` is correct only for physical **cash** references (タイバーツの現金).
  `messages/*.json` UI copy follows each catalog's own existing mix and is a separate namespace.
- **ZH pronoun split.** Guide prose uses **你** (informal, warm); `messages/zh.json` UI uses **您**.
  Both correct in their namespace. Don't harmonize.
- **Caddie-tip divergence.** `green-fee-cost-comparison` = 100–200 THB; `round-of-golf-cost-bangkok`
  = 200–300 THB. Each faithful to its own EN source. Not an inconsistency.
- **LENGOLF-scoping precedent.** Negative coach-language claims are scoped to LENGOLF and paired
  with the LINE @lengolf allowance (see honesty section). This construction is required, not a bug.
- **JA transliteration exceptions.** JA prose renders Chidlom → `チットロム`, The Mercury Ville →
  `ザ・マーキュリービル`. Intentional, diverges from the Latin-verbatim brand_immutable list (which
  governs the UI-string lexicon check). KO transliterates the station (`칫롬`) but keeps
  `The Mercury Ville` in Latin; ZH keeps both in Latin. All intentional.
- **`as of` date forms.** JA `2026年7月現在`, KO `2026년 7월 기준`, ZH `截至2026年7月`,
  TH `ณ กรกฎาคม 2026`. Per-locale, settled.
