---
name: seo-translation-batch
description: Run a data-driven SEO translation/expansion batch for JA/KO/ZH/TH content (new guide translations, per-locale CTR passes, region hubs) — covers picking targets from GSC data, orchestrating builder + native-QA reviewer agents, keeping the route registries in sync, and running the verification gate before commit.
---

# SEO Translation Batch Runbook

Invoke when the user says "do the next JA/KO SEO batch", "translate more guides",
"CTR pass on <locale>", or "add a region hub". You are the **orchestrator**: you
pick targets, spawn agents, fact-check their output, apply fixes yourself, run the
gate, and commit. Builders/reviewers write/review; you own quality and the repo.

Read `docs/i18n-review-checklist.md` and the target `data/i18n-glossary/<locale>.json`
before doing anything — they are the law this runbook points at, not restates.

---

## 1. Pick targets from data, not intuition

Query the LENGOLF Supabase (`marketing.gsc_query_daily` / `gsc_page_daily`) via the
Supabase MCP. Project id is discoverable with `list_projects` (name **LENGOLF**).
The opportunity signal: **native-script queries with impressions but ~0 clicks at
position 8–50** over the last 90 days — Google is testing an EN page for a query
the user typed in JA/KO/ZH and it isn't converting.

```sql
-- native-script demand with no clicks, last 90d (JA example; swap the char class)
select query, page, sum(impressions) imp, sum(clicks) clk, round(avg(position),1) pos
from marketing.gsc_query_daily
where date >= current_date - 90
  and query ~ '[ぁ-んァ-ヶ一-龠]'          -- JA: hiragana/katakana/kanji
group by query, page having sum(impressions) >= 3
order by imp desc limit 50;
```

Keep the impression threshold LOW (≥3) and do **not** hard-filter `clicks = 0` —
this site's native-script volumes are small (winning batches were built on
13–69-impression queries, some with clicks). Judge the imp/clk/pos triple by eye:
zero-or-low clicks at pos 8–50 on meaningful impressions is the signal.

- KO char class: `[가-힣]`  ·  ZH: `[一-龥]`  ·  TH: `[฀-๿]`
- Also slice by `country` (e.g. `country='jpn'`, `'kor'`, `'twn'/'hkg'/'chn'`) —
  intent concentrates by geo.
- Check **which page serves each query** (the `page` column) so you translate the
  page that already ranks, not a guess.
- Pick a **coherent funnel cluster of 3–5 translations** (e.g. book → total cost →
  green fees), not scattered pages. Past batches: commits `8baa67a` (JA booking
  funnel), `4074817` (KO field-golf funnel) document the reasoning shape.

---

## 2. Orchestration structure (the proven pattern)

- **Builder agents (Opus, one per locale)** write the translated entries. Run them
  **SEQUENTIALLY when they share a file** — every builder edits `data/explainer-pages.ts`
  and parallel edits collide. Give each builder: the target slugs, the EN source,
  the glossary path, `docs/i18n-review-checklist.md`, and a sibling entry to copy
  the shape from.
- **Reviewer agents (read-only, one per locale)** run in **PARALLEL after** builders.
  Reviewers are `general-purpose`/`Explore` agents told to be READ-ONLY (checklist
  "Golden rule") and to emit a verdict per `docs/i18n-review-checklist.md`:
  `APPROVE` / `APPROVE_WITH_NITS` / `REJECT`, then numbered issues each tagged
  `[BLOCKER]` or `[NIT]` with exact current-text → replacement → rationale.
- **You (orchestrator)** are the quality gate: fact-check every BLOCKER against the
  EN source, apply fixes yourself (reviewers never edit), run section 5, commit.

Builders AND reviewers must read: the locale glossary, the checklist, and 1–2
already-shipped sibling entries of the same slug (for tone + field shape).

---

## 3. Content rules (pointers — do not duplicate)

- **Glossary is law.** `data/i18n-glossary/<locale>.json` keys `terminology`,
  `conventions`, `honesty_constraints`, `transliterations`, `seo_norms`. The
  honesty-scoping nuance lives in `docs/i18n-review-checklist.md` §"Honesty & scoping".
- **LENGOLF prices MUST be `{{tokens}}`**, never hardcoded literals — resolved from
  the POS catalog by `lib/site-facts.ts`. Current token vocabulary (`getFactTokens`):
  currency-carrying `{{lessonHourly}}` `{{bayHourlyFrom}}` `{{courseRentalDay}}`
  `{{clubDelivery}}`; number-only `{{lessonHourlyNum}}` `{{bayHourlyMinNum}}`
  `{{bayHourlyMaxNum}}` `{{courseRentalDayNum}}` `{{clubDeliveryNum}}`; static
  `{{openingHours}}` `{{lineHandle}}`. Use `…Num` tokens inside ranges so the
  locale range separator (JA `〜`, KO `~`, ZH `–`) and JA `バーツ`-minority currency
  stay literal. An unknown token **throws at build** (`interpolateFacts`).
- **Third-party facts stay static** with an as-of marker (green fees, caddie fees,
  airline baggage) — the POS knows nothing about them.
- **Zero invented facts.** Every number/price/date/name traces to the EN source or
  an already-shipped locale entry (checklist "Fact-fidelity method").
- **Preserve per-source divergences** — do NOT harmonize (e.g. caddie tip 100–200
  vs 200–300 THB across two pages is correct; add a header comment warning editors).
- **`related_slugs` may only point at locale-translated targets.** NOT enforced by
  tooling (`validate:links` passes because the EN page resolves) — but the middleware
  301s locale readers to English, silently breaking the locale funnel. Check each
  target against `lib/translated-routes.ts` staticRoutes for the locale.

---

## 4. Mechanical checklist per new translated guide

Adding one translated slug (locale L) touches **three files**:

1. **`data/explainer-pages.ts`** — new entry. Conventions (verify against the
   `golf-lessons-bangkok-coaches` cluster, ids `exp-32` / `exp-32-ja` / …):
   - id = EN id + `-<locale>` suffix (`exp-32-ja`); `slug` identical across locales;
     `locale: '<L>'`, `status: 'published'`, same `category` as EN.
   - Sibling order **EN → JA → KO → ZH** contiguous; precede each with a header
     comment noting localization/honesty/per-source-figure decisions.
   - Price literals → `{{tokens}}`; as-of marker per glossary `as_of_format`.
2. **`lib/translated-routes.ts`** — add `'/guide/<slug>'` to `L.staticRoutes`
   (else middleware 301s the translation away — silently unreachable).
3. **`scripts/smoke-test.ts`** — add a `routeTests` entry. Add `contentAbsent: '{{'`
   **iff** the entry uses fact tokens (guards unresolved placeholders in HTML):

   ```ts
   { path: '/ja/guide/golf-lessons-bangkok-coaches/', expectedStatus: [200], contentMarker: '<main id="main-content">', contentAbsent: '{{' },
   ```

Smoke **section I** enforces registry ⇄ data sync **both directions** (a data
entry missing from the registry, or vice-versa, fails CI). **Region hubs** are the
same pattern via `data/golf-courses-i18n.ts` (`REGION_HUB_I18N`) + a
`'/golf-courses/<region>'` staticRoutes entry, enforced by smoke **section J** —
but unlike guides they need **no routeTests entry**: section **L3** (PR #88)
fetches every registered region-hub translation from the registry itself, so a
new region batch touches only the two data/registry files. As of PR #88 all 14
regions are translated in all four locales; a 15th region needs all four
REGION_HUB_I18N blocks + staticRoutes entries or its hub-card link falls back
to EN. If a batch changes `REGION_META.province` (e.g. a re-region adds a
province), mirror it into the four REGION_HUB_I18N translations — nothing
enforces that mirror.

Entry frontmatter shape (verbatim fields):

```ts
{
  id: 'exp-32-ja', page_type: 'explainer',
  slug: 'golf-lessons-bangkok-coaches',
  title: '…', meta_description: '…',
  featured_image: null, schema_markup: null,
  status: 'published', category: 'lessons-coaching', locale: 'ja',
  related_slugs: ['/lessons', '/guide/screen-golf-bangkok', …], // translated targets only
  created_at: now, updated_at: now,
  content: { intro, sections:[{heading,body}], key_takeaways:[…], comparison_table:[] },
}
```

---

## 5. Verification gate (you run these — not the builders' word)

Run in order; do not commit until green (minus the known sandbox caveats):

1. `npm run lint`
2. `npm run validate:links`  (internal SEO cross-links resolve)
3. `npm run validate:i18n`   (mechanical house-style/honesty linter; ERROR = exit 1,
   WARN = review flag — read `scripts/validate-i18n.ts` header for the rule list)
   - **Since PR #73 this also lints `messages/{ja,ko,zh,th}.json`**, not just the
     page-content data files. If your batch touches the next-intl catalogues, the
     ERROR checks (emoji, exclamation marks, full-width digits, terminology
     `avoid` variants, brand casing, markup balance) now apply to those strings
     and will fail the build. The three WARN checks (currency, honesty,
     price-as-of) are deliberately skipped there — microcopy has nowhere to put an
     "as of" marker. English is excluded from this corpus by design.
   - **A terminology hit is not automatically a defect.** `checkTerminology` is
     plain-substring, so an `avoid` token can match inside a longer legitimate
     word. Real case: zh `avoid: ["球场费"]` (wrong form of *green fee*) fired
     inside `球场费用`, which was translating "on-course fee" — a broader
     liability including caddie/cart. Blindly applying the `use` form narrowed a
     live customer-liability line. Before rewriting, check `messages/en.json` and
     the sibling ja/ko renderings to confirm the phrase really means the glossary
     term; if it doesn't, reword around the token instead (there: `下场费用`).
4. `npm run validate:i18n:self-test` (separate CI step since PR #88 — proves the
   detectors still fire; a corpus run alone cannot). If your batch adds an ICU
   plural to a non-EN catalogue, write it normally — the old load-bearing-space
   workaround before the final `}}` is dead (checkMarkup depth-scans by dialect).
5. `npm run validate:courses` (fees + region rosters: `REGION_META.courseCount`
   ⇄ region `index.ts` ⇄ files on disk — fails a region batch that edits two of
   the three)
6. `npm run typecheck`       (`tsc --noEmit` + scripts project)
7. `npm run build`
8. `npm run start` then `npm run test:smoke` (server on localhost:3000)

Manual curls to spot-check (locale L, slug S):
- `<html lang="ja">` present · canonical is `www.len.golf/<L>/…`
- hreflang cluster lists exactly the locales that have the translation
- untranslated-locale guard: `/<L>/<untranslated-route>/` returns **301** to EN
- **no `{{` in rendered HTML** for tokenized routes

**Sandbox caveat:** DB-backed routes (blog, locations, anything reading Supabase)
and external-link checks fail without real `.env.local` secrets and POS/network
access — a small, stable set of smoke failures is expected locally. CI
(`.github/workflows/ci.yml`, which has the secrets) is the real gate for those; the
registry-consistency sections I/J and `validate:i18n` are pure and pass locally.

---

## 6. Commit conventions

**One commit per coherent workstream** (e.g. "JA half" then "KO half"). Message
documents (mine `8baa67a` / `4074817` / `f1d3671` for the house style):

- GSC rationale **with numbers** (query, position, impressions, which page served it)
- What shipped per locale (slugs, id suffixes)
- Honesty/fact handling (LENGOLF-scoping, per-source divergences preserved)
- Registry + smoke counts; gate results (lint/typecheck/validate:* clean)

Footer per repo convention (Co-Authored-By + Claude-Session). Commit and push to
the session's designated working branch. **Do NOT open a PR unless asked.**

---

## 7. Post-batch

- Update the batch history: which slugs are now translated per locale. Source of
  truth is `getRegisteredGuidePaths('<locale>')` in `lib/translated-routes.ts`;
  `npm run inventory https://www.len.golf` prints published pages per section ×
  language (needs DB access / prod URL).
- Suggest candidate next batches from the still-uncovered GSC clusters (rerun the
  §1 query, exclude slugs now translated).
