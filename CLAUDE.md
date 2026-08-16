# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LENGOLF website — a Next.js 15 (App Router) site for an indoor golf simulator facility in Bangkok (The Mercury Ville @ BTS Chidlom). Supabase-backed with static/ISR rendering, deployed on Vercel at https://len.golf. Originally migrated from WordPress.

## Commands

- **Dev server:** `npm run dev` (http://localhost:3000)
- **Build:** `npm run build`
- **Start production:** `npm run start`
- **Lint:** `npm run lint`
- **Validate internal links:** `npm run validate:links` — checks that SEO cross-links in `data/*.ts` (`related_slugs`, FAQ `related_questions`) resolve to published pages. No server needed.
- **⚠️ NO PR IS "READY" WITHOUT A `pr-rigor` PASS — and an inline `/code-review`
  with zero agents spawned is NOT a review.** Run `.claude/skills/pr-rigor/SKILL.md`
  before telling anyone (especially the user's manager) that a PR is ready, green,
  or mergeable. It spawns 3–6 independent adversarial finders on *distinct* angles
  plus role passes: **claim audit** (every assertion in the PR body, the commit
  messages and any CLAUDE.md text the PR adds, verified against code), **guard
  efficacy** (break each guard's input on purpose, confirm it goes red),
  native-QA per locale, and a release-readiness verdict. Every verdict states
  `Independent review agents spawned: N`; if N is 0 you may not report a verdict.
  This rule existed as an operator convention from PR #36 onward, was named in the
  bodies of #36/#56/#57 and in a #88 **comment** (not #86, which describes the same
  discipline without the name) and **written down nowhere**, which is precisely
  how it got lost. It has now been violated twice with the same signature: PR #88
  disclosed reporting a verdict from a zero-agent self-read, and PR #93 reported
  "no correctness bugs" from a single inline `/code-review` — an outside pass then
  found six confirmed defects — at least four live on indexed pages, one that
  rendered nowhere — with CI fully green. Later rounds found five more.
  **CI cannot read a sentence: every one of those defects had reached `main` with
  `lint`/`build-and-smoke`/`lighthouse` green.** Corollary: *treat any claim in the commit history,
  a PR description, or this file as an assertion, not evidence* — verify it or
  delete it. And never generalize from one fixed instance ("found the missed
  consumer" → "all consumers now honor it"): enumerate repo-wide, don't infer.
- **⚠️ EVERY translation batch needs NATIVE-LANGUAGE QA before it merges — the
  automated gate does not substitute for it.** `validate:i18n` catches mechanical
  violations (emoji, currency form, terminology `avoid` variants, namespace
  parity); it cannot tell you that a sentence means the opposite of the source.
  Native QA has caught a blocker in **six of seven** batches run so far, and none
  of those blockers was mechanically detectable *at the time*:
    - ja `/best`: a conclusion ending `料理教室が抜けています` — "the cooking class
      is MISSING from this list", the inverse of EN's "beats everything else",
      as the last sentence of the page.
    - ko `/best`: `Hyde & Seek이` / `Hyde & Seek과` — wrong particle allomorph
      ("Seek" transcribes to 시크, vowel-final, so both were the consonant-final
      form). A regex CANNOT catch this: the allomorph depends on the Korean
      READING, which Latin text does not carry, so a mechanical "no particle
      after Latin" check flags every correct attachment instead.
    - zh `/best`: a coined `齐隆` for Chidlom while `messages/zh.json` ships
      `奇隆` 5×, so one page rendered two spellings of the same BTS station.
    - ko/zh course details: one blocker plus ~55 fixes.
    - ko `/hotels`: `The Mercury Ville과` in the `walkableFarBody` UI string —
      an allomorphic particle (과) glued to a Latin name with no resolvable
      Korean reading (same class as the `Seek이/과` bug). The mechanical gate
      was green; the native prose read caught it. Fix: insert a Korean noun
      (`The Mercury Ville 건물과`), the pattern the hotel content entries use.
    - th `PRICE_TIER_I18N['3500-baht'].catch`: the slot held a **Simplified
      Chinese paragraph**. A commit claiming a 5-locale rewrite had touched two,
      and put the zh rendering in the `th` field; `/th/golf-courses/under/3500-baht/`
      served Chinese inside Thai chrome, while ja/ko/zh still carried the false
      claim the edit existed to delete. Every gate was green — the string is
      well-formed, emoji-free, brace-balanced, and its terminology is correct
      *for Chinese*. The one mechanical trace was a single non-blocking WARN
      among 388 (a th unit priced in `500泰铢`). This one IS now mechanically
      detectable — see the `checkScript` bullet — but only because it happened.
  **A whole-slot swap is the failure mode to watch when one person edits several
  locales in one pass.** Two independent guards: paste each locale's replacement
  in a separate edit anchored on that locale's OWN current text (never a
  positional edit), and after the batch, census the scripts per slot rather than
  re-reading the diff — a diff shows the new text is *present*, not that it is in
  the *right field*.
  **`/hotels` (48 content entries + 35 UI-chrome strings) shipped in PR #90
  WITHOUT this pass** — an account spend limit killed the reviewers — but has
  **since had its native prose read** (the batch that caught the ko particle
  blocker above, plus a few grounded nits). Debt discharged **for `/hotels`**. Do NOT read that as corpus-wide: no
  ledger records a prose read of `price-guide-pages.ts`, `activity-occasions.ts`,
  `PRICE_TIER_I18N`, `REGION_HUB_I18N` or most of `messages/*.json`. Keep the rule
  anyway — do not let a *future* batch merge on a green gate alone. (The #90
  review pass also added `/hotels` to the `validate:i18n` corpus, where it had
  been absent, so it now gets the mechanical checks too.)
- **Validate i18n house style:** `npm run validate:i18n` — lints localized guide content (ja/ko/zh/th entries in `data/explainer-pages.ts` and `data/faq-pages.ts`, `REGION_HUB_I18N` in `data/golf-courses-i18n.ts`, `PRICE_TIER_I18N` in `data/price-tiers.ts`, per-course `locales.<locale>` in `data/golf-courses/*/*.ts`, the non-EN blocks of `CONTENT` in `data/faq-hub.ts`) plus the **UI chrome strings in `messages/{ja,ko,zh,th}.json`** against the machine-readable glossaries in `data/i18n-glossary/*.json`. ERROR-level (fails): emoji, exclamation marks, full-width digits (ja), terminology `avoid` variants, brand-immutable case corruption, unbalanced `**`/unbalanced braces (see the ICU bullet below), and a UI-message namespace entirely missing from a locale catalog (see next bullet). WARN-level (non-blocking): currency-convention drift, unscoped honesty claims, prices with no "as of" marker, individual UI-message key gaps vs `messages/en.json`. Automates the mechanical subset of `docs/i18n-review-checklist.md`; `--self-test` proves the detectors. No server needed.
- **`checkScript` answers "is this string even in this language?" — and its tuning is the whole check.** Added after a zh paragraph shipped in a `th` slot on an indexed page (above). Two rules, both needed. **(a) Dominance:** foreign-script characters outnumber the locale's own by **2x**, above a floor of 8. **(b) ja-only kana requirement:** ≥30 kanji with zero kana. Rule (b) exists because dominance is *blind* to zh→ja — Han is legal in Japanese, so a Chinese paragraph in a `ja` slot scores 100% "own"; kana is the only discriminator. **Do NOT "simplify" this to "contains a script this language doesn't use".** That version flagged **eleven strings, every one correct copy**: `directions.grabTip` in ja/ko/zh deliberately prints the venue name in **Thai** so a reader can show it to a taxi driver; `스크린골프` is quoted as a term of art in the th/zh screen-golf explainer; `한국어` is the Korean entry in the language switcher; and `毎日午前9時〜午後11時営業` / `平日 = 月〜木、週末 = 金〜日` / `動画撮影 / 写真撮影` are ordinary all-kanji ja catalog strings. A gate that fires 11 times on correct code gets switched off. **The 2x margin is thin and load-bearing:** Chinese is denser than Thai, so the 25-character Thai address quoted inside the zh `grabTip` outnumbers the 22 Han around it — a plurality rule flags it, 2x clears it. That string is pinned **verbatim** as a self-test (an invented shorter version of it failed), so shortening it in `faq-hub.ts` will turn the gate red; keep the two in sync. **Known limit:** rule (b) requires kana to be *exactly* zero, so it catches a whole-slot swap but **not a partial one** — found by mutation, when replacing only a paragraph's first sentence left a Japanese tail and the check correctly stayed green. Tightening to a kana/kanji ratio would catch that and would fire on legitimately kanji-dense Japanese. Half-translated strings stay native QA's job.
- **The `messages/*.json` corpus is ERROR-checks-only** (`uiChrome` in `scripts/validate-i18n.ts`). The three WARN checks are entry-shaped prose rules that don't transfer to microcopy: `price-as-of` assumes an entry is an article that can carry a date marker in its prose, but a hero subtitle reading `1時間550バーツ〜` has nowhere to put one (the live price lives in `data/pricing.ts`); `currency` and `honesty` are calibrated for long-form text and misfire on 3-word stat badges. Running them over the catalogs would have added ~200 standing warnings, which is how a linter teaches people to ignore it. English is excluded from this corpus by design — the glossaries encode *target*-language terminology, so linting the source language against them is meaningless.
- **`checkMarkup` runs TWO brace rules, split by dialect — do not collapse them.** `checkMarkup()` in `scripts/validate-i18n.ts` used to count literal `{{` vs `}}` bigrams. That fit the `{{token}}` placeholders in `data/explainer-pages.ts` but hard-failed every ICU plural, because `{count, plural, =1 {…} other {# …}}` ends in a `}}` with no `{{` anywhere; `messages/en.json` is excluded from the corpus so EN never hit it, and the non-EN workaround was a **load-bearing space** before the final brace. Since PR #88 the check is (a) a structural brace **depth-scan** on everything, plus (b) the old bigram equality **scoped to the `{{token}}` dialect** (non-`uiChrome` units) via the `dialect` parameter. Both are needed, and **depth-scanning alone is weaker, not stronger** — this was the review finding on PR #88 after exactly that claim was made: `{{bayHourlyFrom} }` is brace-*balanced* and sails through the depth-scan, but `lib/site-facts.ts` substitutes on `/\{\{\s*(\w+)\s*\}\}/g`, so the split closer misses the anchor, `replace()` no-ops, and the raw token ships to visitors **without throwing** (the throw there only fires for well-formed tokens with unknown names). That shape is the load-bearing space itself. Conversely the depth-scan catches `}}{{`, which the bigram counter passed 1-for-1. The scoping is safe only because the dialects don't mix: `messages/*.json` has no `{{token}}`, the content data has no ICU. Known gap: ICU escapes a literal brace by quoting (`Use '{' here`), which the depth-scan reads as unclosed — nothing does this today; strip ICU-quoted spans before scanning if it ever comes up. **When adding an ICU plural to a non-EN catalog, write it normally — no spacing tricks.**
- **Pluralization is a per-language decision, not a mechanical five-locale edit.** Precedent: `GolfCourseRegion.metaDescription` rendered "all 1 golf courses" on the three single-course region hubs (`north-misc`, `khao-lak`, `krabi` — `courseCount: 1` in `REGION_META`). EN needed a real `plural` with a `=1` branch. **TH did not** — Thai has no grammatical plural and `1 แห่ง` was already correct; the awkwardness was `ครบทั้ง` ("the complete set of") applied to one item, so its `=1` branch drops that phrase and keeps the same measure word. **ja/ko/zh needed no change at all** — no plural morphology, and `{count}か所 / {count}곳 / {count}座` read correctly at 1. Don't reach for `{count, plural, …}` in a CJK catalog just because EN got one. The corollary for the `GolfCourseHub` region cards: the count must live **inside** the message (`coursesCount`) rather than being interpolated next to a bare noun key, because a noun sitting outside the message has no `count` to agree with — that is exactly how "1 courses" shipped. All five locales carry `coursesCount`; only EN inflects.
- **A text-length/word-count heuristic that assumes space-delimited English words silently breaks on ja/zh/th, and on ko for a different reason.** `getReadingTime()` (`lib/blog.ts`) computed `text.split(' ').length / 200` with no locale argument. ja/zh/th don't delimit words with spaces at all, so `split(' ')` collapsed the whole article to one "word" — every translated blog post rendered "1 min read" regardless of length, live on all 9 ja/zh translated posts (th had 0 translations, so it was latent). Fixed by branching per locale: ja/zh/th measure by **character count** (500 cpm ja/zh, 700 cpm th) instead of word count. **ko is the trap inside the trap**: Korean *is* space-delimited, so the bug looked fixed once ko fell through to the unchanged word-count branch — but Korean spaces delimit **eojeols** (particle-attached phrase units like `확정됩니다` = "will be confirmed" in one token), not English-shaped words, so the eojeol count run through the English 200-wpm divisor undercounted ko reading time by ~1.5-1.7x, live on all 9 ko translated posts. ko now uses the same char-count bucket as ja/zh (500 cpm) — character counting fits Hangul about as well as it fits Han script, since both pack roughly one morpheme per character/syllable block. Same failure shape as `firstSentence()`/`PROVINCE_L10N`-style bugs elsewhere in this doc: **any text-processing helper that takes locale content needs the locale as an argument and a branch per script family, not a single English-shaped default.** Precedent for the next occurrence: the `\s+\S*$` "back off to the last space" truncation regex on Google review excerpts (`app/[locale]/page.tsx`, `app/[locale]/about-us/page.tsx`) has the identical assumption and is confirmed live-reachable on the `th` locale (review language follows locale) — flagged, not yet fixed.
- **Adding a course-content locale is a `lib/format.ts` change, and the compiler only catches part of it.** `COURSE_CONTENT_LOCALES` there is the single-source union (`FormatLocale` = `CourseSeoLocale`) behind every localized course-detail surface. Widening it (`['en','th','ja']` → `+ ko, zh` for the ko/zh course-detail batch) makes TypeScript enumerate most of the follow-on work, because the consumers are exhaustive `Record<FormatLocale, …>` maps: `DRIVE_TIME_L10N` (`lib/format.ts`), and `PROVINCE_L10N` + `FAQ_L10N` (`lib/course-seo.ts`, the latter a full 11-method pack per locale feeding both the on-page FAQ and its JSON-LD). **`asOfMonthYear` is the exception and the trap** — it is a `switch` with a `default:` arm returning the `en-US` short month, so a new locale compiles clean and silently emits "Jul 2026" inside Korean prose. Add its `case` by hand. (`lib/currency-rates.ts` already carries ko/ja/zh cases.) `PROVINCE_L10N` is separately guarded: `validate:i18n` errors when a registered course's province has no entry for that locale.
- **ZH province names are exonyms, not transcriptions; KO transcribes.** `PROVINCE_L10N` uses `大城府` (Ayutthaya), `北榄府` (Samut Prakan), `佛统府` (Nakhon Pathom) — the names Chinese sources actually use — because a coined `阿育他亚` would be both unidiomatic and unsearchable. Korean has no exonym tradition for Thai provinces, so it transcribes per the Korean standard for Thai, with tense consonants: `푸껫`, `빠툼타니`, `사뭇쁘라깐`. Do not "regularize" one to match the other.
- **Korean templates must never attach a particle directly to an interpolated proper noun.** Korean topic/object particles alternate on the preceding syllable's final consonant (은/는, 을/를), which cannot be resolved for a Latin course name — `Alpine Golf Club은(는)` is the shipped-looking failure. The `ko` pack in `FAQ_L10N` therefore either follows `${name}` with a Korean noun that carries the particle itself (`${name} 코스는`, `${name} 그린피는`) or uses a consonant-invariant particle (`에서`/`에는`/`의`). Nothing lints this — keep the invariant by hand when editing those templates, and apply the same rule to any new Korean string that interpolates a name.
- **The per-course href invariant needs BOTH halves, and a translation batch invalidates the negative one.** `courseDetailHref()` (PR #88) prefixes a course link only where that course is translated, so the smoke test pins a positive assertion (a translated course IS prefixed) and a negative one (an untranslated course is NOT). PR #88 wrote the negative half as "ko prefixes nothing", which was only true while ko had zero course-detail translations — the ko/zh batch made all three of those assertions wrong. The fix is to re-anchor the negative to a course genuinely absent from `COURSE_DETAIL_I18N` (currently `lakewood-country-club`), **not** to delete it: dropping it leaves an always-prefix regression — the exact bug PR #88 fixed in `HubMapExplorer` — completely unguarded. Treat the slug as an invariant, not a constant: if a future batch translates it, move the assertion to another untranslated course. Related: do **not** pin an untranslated-course negative on `/golf-courses/under/<tier>/`, whose roster is a derived top 12, for the same reason the `/compare/` redirects are fragile.
- **Emoji detection is an allowlist subtraction, not a narrowed property test.** `emojiHit()` in `scripts/validate-i18n.ts` strips `© ® ™ ★ ☆` and then tests `\p{Emoji_Presentation}|\p{Extended_Pictographic}`. Adding the `messages/*.json` corpus exposed two false positives in the old bare-`Extended_Pictographic` check: the `©` in `© {year} LENGOLF CO., LTD.` (a legal mark, identical in the English source) and the `★` in `★{rating} / Googleレビュー{count}件` (a rating glyph in the trust chip). **Do not "fix" that by narrowing to `\p{Emoji_Presentation}`** — that silently disarms the check for every pictograph defaulting to text presentation (`❤ ⚠ ➡ ✔ ✈ ☀`), and browsers colour a bare `❤` anyway, so it ships as decoration with the linter silent. Two false positives aren't worth six false negatives; this was caught in review on PR #73 after exactly that narrowing was proposed. The `Emoji_Presentation` alternative is kept because it adds regional-indicator flags (🇯🇵), which aren't `Extended_Pictographic` and which the original check missed. Self-test asserts both directions, including that bare text-presentation pictographs still fail.
- **The `price-as-of` detector is plain-substring too, and its failure mode is a silent false NEGATIVE.** It looks for the locale's as-of marker token anywhere in the entry — `ข้อมูล ณ` (th), `現在` (ja), `기준` (ko), `截至` (zh). Those last two are ordinary high-frequency words: ko `기준` means "based on / as measured from", so natural golf prose like `백 티 기준 6,380야드` ("6,380 yards from the back tee") or `스팀프미터 기준 10.5` satisfies the detector and suppresses the warning for the WHOLE entry, even though no date was ever stated. ja `現在` has the same shape (pre-existing on `phuket-country-club`). Two builders hit this independently in the ko/zh course-detail batch; one rewrote `스팀프미터 기준 10.5` → `스팀프미터 10.5 이상` specifically so the entry would warn like its th/ja siblings. Consequence: a **missing** `price-as-of` warning on a ko/zh entry proves nothing — grep the entry for a real date before concluding it carries one. Do not "fix" this by making the marker match stricter without checking what it would newly flag; the warning is non-blocking, so a false negative costs less than churning 300+ existing entries.
- **A typed fee field can disagree with every locale's prose, and the FAQ generator will print both.** `phuket-country-club` carries `green_fee_weekday_thb: 2800` / `green_fee_weekend_thb: 4000`, but the EN meta and the th/ja/ko/zh prose all frame those same two numbers as **low season / high season**. `validate:courses` passes (weekend > weekday, both plausible) and nothing cross-checks prose against field semantics. Because `FAQ_L10N.feeAnswer` builds the fee FAQ from the TYPED fields, the page renders "low season / high season" in its body next to an auto-generated FAQ saying "weekday / weekend" — and the FAQ copy also ships as JSON-LD `FAQPage` structured data. **Took FOUR rounds to resolve, because each round's "all consumers now honor it" was false.** Do not trust that sentence when you read it — including here. The label decision is centralized in **`lib/course-fees.ts`** (`pricesByDayOfWeek` / `feeLabelKeys` / `feeLabelsEn` / `feeBasisNoteEn`); **route every new label site through it rather than writing another `fee_is_seasonal ?` ternary.** The real lesson: **this is a cross-cutting content decision, and duplicating it per call site guarantees a miss.** The rounds, so the shape is recognizable: (1) shipped wired into the FAQ generator only — fee table and JSON-LD `Offer` still said weekday/weekend; (2) "fixed everywhere" while the compare route emitted *"costs less on Saturday/Sunday"* on an **indexed** URL; (3) "fixed everywhere" while `under/[tier]` said *"Weekday from 2,800 THB"*, the region-hub roster tagged the higher fee `wknd`, and `SpecTable` had patched the fee **value** but left the row **label** contradicting it on the same line; (4) "fixed everywhere" while the `/golf-courses/under/<tier>/` **page chrome** (`metaDescription`, `eyebrowBadge`, `topCoursesHeading`) still asserted a weekday basis in all five locales directly above the low-season item, and `/guide/nikanti-golf-club-bangkok` still advised tipping the caddie two lines above stating the tip is included. **Fixing the cheap string and leaving the prominent one is the recurring shape of this bug.** Practical rules: grep `green_fee_weekday_thb` with **NO directory scoping** (`data/golf-courses-use-cases.ts` sits outside `lib/ components/ app/`); a **shared header or page-level chrome can only name a basis when every course beneath it agrees**, otherwise it goes basis-neutral; and a flag-shaped grep (`caddie_tip_included`) finds only the consumer that reads the flag and **cannot** find prose written before it existed — search the claim, not the field. Note `lib/course-seo.ts` **suppresses** the generated fee FAQ and the meta fee line for a seasonal course rather than relabelling them, so `phuket-country-club` ships no price FAQ at all while every sibling has one — a known content gap, not a false claim. When adding a locale to a course, still check the typed fields mean what the prose says. **Sibling pattern — `caddie_tip_included`:** Nikanti's all-inclusive green fee covers the caddie tip, but `FAQ_L10N.caddieAnswer` hard-appended "Caddie tips … are customary on top" for *every* mandatory-caddie course — contradicting the course's own copy, in `FAQPage` structured data. A `caddie_tip_included` flag (set on Nikanti, threaded through `caddieAnswer(name, required, fee, tipIncluded)`) now switches that clause to "the tip is already included — no extra tipping expected." Do NOT key seasonal-or-tip-inclusive behavior off `caddie_fee_thb: 0` or a bare fee value — seven courses carry `caddie_fee_thb: 0` without being all-inclusive (eight have the zero; Nikanti is the one that really is all-inclusive); use the explicit flag.
- **A JSON-LD builder is a localized surface, and fixing ONE of its fields is not fixing it.** PR #97 localized `getCourseDetailJsonLd`'s `description` (it had emitted `c.prose.overview` unconditionally, so 200 localized course-detail pages carried English prose inside `lang="ja"` markup). The very next pass found the *same builder* still emitting English `makesOffer[].name`, and `golfCourseItem` still emitting an English `offers.description` — both from `feeLabelsEn`, whose own docblock reserves it for the EN-pinned routes. A translated page therefore shipped a Japanese description beside an English "Weekday green fee". **The lesson is not "localize the description"; it is that a builder is enumerated field-by-field or not at all.** `golfCourseItem` reaches localized pages only through `getCourseRoundupJsonLd` on `/golf-courses/under/<tier>/` — the sole roundup route that SSGs non-EN locales; `/near/`, `/best-for/` and `/compare/` pin `locale: 'en'` in `generateStaticParams`, so the EN default keeps them byte-identical. Verify that pin rather than trusting this sentence. **`offerNames` is a FUNCTION, not a resolved label pair, and that is load-bearing** — fee basis is per-course and a tier page really does list a seasonal course beside a day-of-week one (`/under/3500-baht/` emits both bases in one `ItemList`), so a caller-resolved pair would mislabel whichever course disagrees. Labels route through `feeOfferNames` in `lib/course-fees.ts` for the reason the bullet above gives. **Still English in that builder, with the honest reason for each:** `name` (Latin proper noun; `GolfCourseLocale` has no name field). `amenityFeature[].name` (the catalog has localized labels, but routing through them would also change EN output — "Golf Cart Required" -> "Cart required" — which a localization fix has no business doing). `additionalProperty[].name` is the OPPOSITE case and was left only for scope: EN `statHoles`/`statPar` are byte-identical to the hardcoded `Holes`/`Par`, so localizing it is free. `address.addressLocality` on the DETAIL builder is **dead code** — all 149 course files carry a `schema_markup.address` object, so `legacyAddress` wins for every course; the English locality that ships comes from that blob (28 of which already disagree with the visible `course.province` badge, in English), so localizing means overriding or retiring the blob, not swapping a line. **`golfCourseItem` has no such short-circuit, so ITS `addressLocality` — and its EN-pinned `url` — are live English on localized tier pages. Still unfixed.** Guards: smoke **L2** asserts description AND both `makesOffer` slots on the fetch it was already making, **L6** asserts the tier-page `ItemList`. Each carries its own counter, because the description branch and the offer branch go vacuous independently — and an offer check written as `if (got && want && got !== want)` disarms itself the moment a catalog key is renamed.
- **`checkTerminology` is plain-substring, so an `avoid` token can false-positive inside a longer legitimate word.** Precedent (PR #73): zh `avoid: ["球场费"]` (wrong form of *green fee*) matched inside `球场费用` — which was translating "on-course fee", a deliberately broader liability covering caddie/cart/transfer. "Correcting" it to `果岭费用` narrowed a live customer-liability line on the zh `/lessons` page. Resolved by rewording to `下场费用`, which keeps the breadth and contains neither token. When this check fires, confirm the flagged phrase actually means the glossary term before rewriting it — check `messages/en.json` and the ja/ko renderings first.
- **Dead English entries in the CJK catalogs are expected, not bugs.** `Home.*`, `HomeFaq.*` and `SecondHandClubs*` are still English in `messages/{ko,zh}.json` (and `SecondHandClubs*` in `ja` too). They never render: `app/[locale]/page.tsx` returns the bespoke `JapanLandingPage`/`KoreaLandingPage`/`ChinaLandingPage` before `getTranslations('Home')` or `'HomeFaq'` is reached, and `/second-hand-golf-clubs-bangkok` is EN-only (untranslated locale routes 301 to English). Don't "fix" them by translating without first confirming a consumer exists, and don't read the `!` in them as live copy.
- **UI-message namespace parity (part of `validate:i18n`):** when a page starts SSG-ing a new locale (e.g. adding entries to `getTranslatedPriceTierParams()`), every `useTranslations('...')` namespace it consumes must exist in that locale's `messages/<locale>.json` — next-intl logs `MISSING_MESSAGE` per render during build and silently falls back to English (no build failure), so a repeated `MISSING_MESSAGE` in the build log is a real bug, not noise. `validate:i18n` guards this for the namespaces in the `SSG_UI_NAMESPACES` allowlist (`scripts/validate-i18n.ts`: `GolfCourseShared`, `GolfCoursePriceTier`, `GolfCourseRegion`, `GolfCourseHub`, `GolfCourseDetail`, `ExplainerPage`, `FaqPage`, `ContactInfo`): the locales that SSG those pages — derived from the registry helpers in `lib/translated-routes.ts` — must have the namespace in `messages/<locale>.json` with the same (flattened) key set as `messages/en.json`. Namespace missing entirely = ERROR; individual missing keys = WARN. Precedent: `GolfCourseShared` was missing from ja/ko/zh (~480 warnings/build) until PR #78. When a translated route starts consuming a NEW namespace, add it to `SSG_UI_NAMESPACES`; namespaces outside the allowlist are still unchecked.
- **The untranslated-locale intercept in `middleware.ts` must only fire on a PURE prefix-add.** The block that rewrites to `/en` keys off "does the redirect TARGET start with a locale prefix?" — but next-intl emits locale-prefixed redirects for a *second* reason: it matches the prefix case-INsensitively and 307s `/JA/x/` to `/ja/x/` to canonicalize it, while the 301 loop at the top of the file is case-SENSITIVE and skips it. Without the `pathWithoutLocale !== pathname` guard, that canonicalization got intercepted too, and every case variant of every locale (`/JA/`, `/Ja/`, `/TH/`, `/ZH/`…) served a **200 English page at the variant URL** instead of redirecting — an indexable soft-duplicate, where the pre-fix code had correctly done 307 → 301 → canonical. Same guard also sends the slash-less form (`/x` with `trailingSlash: true`) back through canonicalization instead of 200-ing at a non-canonical URL. When editing this block, re-verify with `curl -sI -H 'Accept-Language: ja' <base>/JA/golf-in-thailand-guide/` — it must NOT be 200. The root arm builds `/en${pathWithoutLocale}` (not `/en` + a stripped `''`) so the trailing slash survives; it is unreachable while `"/"` is translated in every locale, and wrong the moment it isn't.
- **A new SEO section is not linted until it is added to the `validate:i18n` corpus by hand — importing it is not enough.** `hotelConciergePages` was imported into `scripts/validate-i18n.ts` for the SSG-namespace check and *looked* wired, but it was missing from the `for (const [label, pages] of [...])` corpus tuple, so PR #90's 48 `/hotels` translations shipped with **zero** house-style checking — no emoji, exclamation, full-width-digit, terminology or brand-casing gate — on the one section that also shipped without native-language QA. A clean `validate:i18n` run proves nothing about a section that isn't in that tuple; the entry count in the success line (`763 localized entries`) is the thing to sanity-check after adding one. Prove the wiring by injection (an emoji + `！` into a ja entry must fail), not by a green run. Non-prose leaves need naming in `NON_PROSE_SEO_FIELD_RE` — URLs (`google_maps_embed`), clock times (`suggested_itinerary[].time`) — or the brand/terminology checks fire on identifiers. **The same trap is live right now, unfixed:** `lib/course-seo.ts` is imported into the linter only for `hasProvinceL10n`, so `FAQ_L10N` — eleven prose templates per locale, rendering as the on-page course FAQ *and* as JSON-LD `FAQPage` — gets **no** house-style checking, including the ko templates that carry the hand-maintained particle invariant. Linting it is not a one-line import: the units are functions, so the corpus loop would have to invoke them with representative arguments.
- **A gate that cannot fail is worse than no gate, and the empty-input path is how it happens.** Four of this repo's checks could pass vacuously before PR #90's review pass: `validate:hotels` printed "0 entries pass" and exited 0 on an empty corpus; its LENGOLF-card cross-check was `find(...) && ...`, so renaming the card disarmed the one defect it existed for; `validate:links`'s stale-probe parser did `slice(indexOf(a), indexOf(b))`, and a renamed marker makes `indexOf` return -1, which clamps to an **empty string** and examines nothing; and `verify:coordinates --write` printed its WRITE FAILED section to stdout and still exited 0. Every new gate needs (a) a minimum-input floor with a real number, not `> 0`, (b) an existence assertion before any `X && compare(X)`, and (c) `process.exit`/`exitCode` on every failure path. Verify by breaking the input on purpose and watching it go red — a green run on good data is not evidence.
- **FAQ `answer_body` renders `- ` bullets AND `N. ` ordinals; the old "convert numbered lists to bullets" workaround is dead.** `renderParagraph()` in `components/faq/FaqPage.tsx` used to treat only `- ` lines as a list. A block of `1. ` / `2. ` lines matched neither the list branch nor the mixed intro+list branch and fell through to the plain `<p>` renderer, where the single `\n` between items collapses in HTML and the whole list shipped as one run-on sentence. That was live on **36 blocks across 15 EN entries** and identically on ja/ko/zh (31 blocks each), because translators faithfully carry the source's numbering. Several batches worked around it by rewriting `N. ` → `- ` per locale, which silently discarded ordinality on sequence-bearing lists (booking steps, the caddie loop). `LIST_ITEM_RE` now matches both forms and numbered blocks render as `<ol class="list-decimal">`. **Write numbered lists normally** — do not convert them, and do not "fix" a locale to match a sibling that was converted under the old rule. The trailing `\s+` in the regex is load-bearing: it keeps a line opening `2.5 hours for a round` a paragraph rather than an ordinal.
- **Body markdown is `**bold**`-only:** explainer/FAQ `body` strings are rendered by `components/shared/BoldText.tsx`, which handles `**bold**` but NOT single-asterisk `*italics*` — italic markup ships as literal asterisks (one pre-existing case: the exchange-rate footnote in `gg-thailand-golf-trip-cost`). Write footnote/aside lines as plain text, e.g. the as-of markers `(ข้อมูล ณ กรกฎาคม 2026)`.
- **Validate course fees and region rosters:** `npm run validate:courses` — lints `data/golf-courses/*/*.ts`. Two ERROR classes (either fails CI). **Fees:** fee outside ฿150–฿20,000, weekend cheaper than weekday, malformed `fees_verified_at`, or a suspicious pattern (weekday under ฿600 — the classic scraped Thai-national/9-hole/promo rate — or weekend >2.2× weekday) on a course with no `fees_verified_at` attestation. **Region rosters** (`checkRegionCounts`): `REGION_META.courseCount` in `lib/golf-courses.ts` disagreeing with the region's `index.ts` slugs, an index slug with no file, a file with no index slug, a missing `index.ts`, or a course directory with no `REGION_META` entry. Three sources of truth — the advertised count, the `index.ts` slugs that actually render, and the files on disk — and a re-region that updates two of the three leaves the hub advertising a number it does not render *and* possibly selecting the wrong ICU plural branch. Files are keyed by DIRECTORY, not by the `region` field, because the directory builds the URL. WARN: attested-but-suspicious fees, attestations older than 18 months, coordinates rounded below 3dp, `coordinates_verified_at` over 18 months old. When correcting a fee, also grep the course's `prose` for the old number — fees are often repeated in prose text. No server needed.
- **Course edits can silently delete /compare/ pages:** `/golf-courses/compare/<region>/<pair>` URLs are DERIVED from each region's top 3 by `popularityScore()` (fee + prose>200 chars + website + driving_range) with `dynamicParams = false` and sitemap emission — so a fee correction, an added `website`, lengthened prose, or a re-region can retire an indexed pair as a hard 404 with CI green. Margins are thin (khao-yai: 50 points; kanchanaburi: a three-way tie broken alphabetically). Until a snapshot guard lands, recompute the affected regions' top 3 before/after any such edit (`lib/golf-courses-derived.ts`), and add redirects for retired pairs. Reverse trap: those redirects match BEFORE the filesystem, so if a pair re-enters its top 3, delete its redirect from `next.config.js` or the regenerated page is unreachable behind its own 308.
- **Verify course coordinates:** `npm run verify:coordinates` (report) / `npm run verify:coordinates -- --write` (apply). Batch-checks every course's lat/lng against the Google Places API and stamps `coordinates_verified_at`. Needs a **server-side** key: `GOOGLE_MAPS_SERVER_API_KEY=... npm run verify:coordinates` — do NOT reuse `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` if it is HTTP-referrer restricted (referrer-locked keys reject server calls). Costs a Places Text Search per course (~149 requests). Coordinates gate real output: `hasTrustedCoordinates()` in `lib/geo.ts` withholds the satellite map pin and schema.org `GeoCoordinates` unless the coordinates are attested or precise to ≥3dp, and `courseMapsUrl()` falls back to a name+province Google search rather than linking unverified coordinates.
- **Smoke tests:** `npm run test:smoke` (requires a running server on localhost:3000)
- **Page inventory:** `npm run inventory [base-url]` — table of published pages per section × language (EN/TH/JA/KO/ZH), parsed from the sitemap. Needs a running server **with DB access** (real `.env.local`), else DB-driven blog/location sections read 0. Point at prod with `npm run inventory https://www.len.golf`.
- **Migrate blog posts:** `npx tsx scripts/migrate-blog-posts.ts` (one-time migration, already run)
- **Import location pages:** `npx tsx scripts/import-location-pages.ts` (one-time migration, already run)

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every PR to `main`:

- **`lint`** — `npm run lint` with ESLint flat config (`eslint.config.mjs`), then `npm run validate:links` (internal SEO cross-link validator), then `npm run validate:i18n` (i18n house-style/honesty linter — mechanical subset of the native-QA rubric), then `npm run validate:courses` (green-fee plausibility **and** region-roster/`courseCount` agreement gate; a red "lint" check can be any of the four)
- **`build-and-smoke`** — builds the app, starts the production server, runs smoke tests across 19 categories (per-category test counts live in `scripts/smoke-test.ts`):
  - **A) Route tests** — pages across all locales return 200 with `<main id="main-content">`
  - **B) Redirect tests** — WordPress legacy URLs, GSC 404 fixes, and location redirects
  - **C) Link checks** — booking.len.golf, LINE, Supabase Storage assets are reachable
  - **D) SEO checks** — title, meta description, canonical (www.len.golf), JSON-LD, `lang` attribute
  - **E) Locale redirect tests** — untranslated th/ko/ja/zh routes redirect to English
  - **F) Locale cookie tests** — English pages work with a NEXT_LOCALE cookie set
  - **G) WordPress 404 tests** — legacy WordPress paths return 404 (prevent redirect regressions)
  - **H) LLM / AI discoverability** — llms.txt served as text, robots.txt names AI crawlers, opening-hours schema consistent
  - **I) Translated-guide registry consistency** — the `/guide/...` allowlist in `lib/translated-routes.ts` must match the locale-tagged entries in `data/explainer-pages.ts` (pure import check, no server)
  - **J) Translated region-hub registry consistency** — the `/golf-courses/<region>` allowlist in `lib/translated-routes.ts` must match the translations in `data/golf-courses-i18n.ts` (pure import check, no server)
  - **J2) Translated price-tier registry consistency** — the `/golf-courses/under/<tier>` allowlist in `lib/translated-routes.ts` must match the translations in `data/price-tiers.ts` (pure import check, no server)
  - **J3) Translated course-detail registry consistency** — the `/golf-courses/<region>/<slug>` allowlist in `lib/translated-routes.ts` must match `COURSE_DETAIL_I18N` in `data/golf-courses-i18n.ts` both directions (pure import check, no server); with `dynamicParams = false` on the route, a one-sided edit is a hard 404 advertised by hreflang
  - **K) Data-driven internal-link liveness** — every `related_slugs` path outside the statically-validated SEO prefixes (`/location`, `/golf-courses`, core routes) is fetched live and must not 404 (complements `npm run validate:links`)
  - **L) Blog translated-slug registry liveness** — every path registered in `data/blog-translated-slugs.ts` must serve 200 (catches the data file running ahead of the DB, which `dynamicParams = false` turns into a 404)
  - **L2) Course-detail translated registry liveness** — every registered `/golf-courses/<region>/<slug>` translation must serve 200 **with** `<main id="main-content">`; derived from the registry, so new translation batches are covered with zero routeTests edits (routeTests keeps one th + one ja canary only)
  - **L3) Region-hub translated registry liveness** — every registered `/golf-courses/<region>` translation must serve 200 with `<main id="main-content">`. L2's guard one level up the hub tree, and registry-derived like L2, so a future region batch needs zero routeTests edits (56 hub URLs covered today)
  - **L4) FAQ translated registry liveness** — every registered `/faq/<slug>` translation must serve 200 with `<main id="main-content">` **and no unresolved `{{`**. Until this landed, translated FAQ pages were the only translated section with *no liveness assertion at all*: section I proved registry ⇄ data agreement, which is not the same thing — both sides can agree on a slug whose page throws at render or serves a 200 error shell. The `{{` assertion exists because **FAQ pages are the inverse of the guide rule on fact tokens**: the FAQ route renders `answer_intro`/`answer_body` verbatim and never calls `interpolateFacts` (only `/guide/` and `llms.txt` do), so a `{{token}}` copied in from a guide entry ships raw to the reader with nothing throwing. Registry-derived like L2/L3, so future FAQ batches need zero routeTests edits (124 FAQ URLs covered).
  - **M) Wayfinding copy** — BTS Chidlom is **Exit 4** (The Mercury Ville). 14 assertions: the six DB-driven `/location/*-chidlom` pages (`location_pages.bts_route`, unreachable by any static lint), plus the repo-owned strings — `HomeJa/HomeKo/HomeZh.accessBts` in `messages/*.json` (3), the hardcoded EN line in `app/[locale]/golf-in-thailand-guide/page.tsx` (1), and `directions.steps` in `data/faq-hub.ts` on `/{th,ja,ko,zh}/faq/` (4). The faq-hub four are a **second, independent copy** of the wayfinding: the landing-page checks read `messages/*.json` and would all still pass if faq-hub regressed. Each check is a matched pair — correct string present *and* wrong-exit shape absent — so dropped copy fails rather than passing vacuously. Assertions run against rendered markup with `<script>` blocks stripped: `NextIntlClientProvider` is handed the whole locale catalog, so an un-stripped body would let a string that never renders satisfy the check.
  - **N) Region-hub course-count agreement** — three regions hold one course (`north-misc`, `khao-lak`, `krabi`), so `GolfCourseRegion.metaDescription` carries an ICU plural in EN and TH and **both branches are asserted in both languages** (`=1` on all three regions, `other` on bangkok), plus the `/golf-courses/` region cards, which render the count in **visible** copy and shipped "1 courses" until PR #88. Meta-tag checks read the `<meta name="description">` attribute; the card check strips tags first, because the count and the noun live in separate elements and the disagreement exists only in the rendered text. Counts match `\d+`, not `\d\d+` — nine of fourteen regions are single-digit.

Both jobs are **required checks** via branch protection — PRs cannot merge if either fails.

**Manual trigger:** `gh workflow run ci.yml --ref main`

**GitHub Secrets required:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (already configured)

**Key files:**
- `.github/workflows/ci.yml` — workflow definition
- `scripts/smoke-test.ts` — smoke test script (zero deps beyond tsx + Node.js fetch)
- `eslint.config.mjs` — ESLint flat config (next/core-web-vitals)

**Adding new routes:** When adding a new page, add it to `routeTests` in `scripts/smoke-test.ts` to ensure CI validates it.

## Migration Notes

Migrated from WordPress (Elementor + 24 plugins). All migration artifacts live in `_migration/` (gitignored). Migration scripts in `scripts/` are one-time utilities that have already been run. The site has 16 pages, 24 blog posts, and 101 location pages (7 template types across ~15 Bangkok neighborhoods).

## Architecture

### Routing (App Router)

- `app/[locale]/` — Next.js App Router pages with i18n support (EN/TH)
- Core pages: `/golf`, `/events`, `/lessons`, `/about-us`, `/privacy-policy`, `/terms-of-service`
- Content pages: `/golf-club-rental`, `/golf-course-club-rental`, `/activities`, `/cost`, `/faq`, `/guide`, `/hotels`, `/second-hand-golf-clubs-bangkok`
- Dynamic routes: `/blog/[slug]`, `/location/[slug]` — use `generateStaticParams` + ISR (revalidate: 3600s)
- API routes: `app/api/contact/route.ts` (POST — contact form), `app/api/aqi/route.ts` (air quality)

### Components

- `components/layout/` — Header, Footer, LineChatWidget
- `components/home/`, `components/about/`, `components/events/`, `components/location/` — core page components
- `components/activities/`, `components/blog/`, `components/clubs/`, `components/faq/`, `components/guides/`, `components/hotels/`, `components/prices/` — content page components
- `components/shared/` — reusable components (BookingCTA, ContactInfo, ImageGallery, SectionWrapper, SocialIcons)
- `components/ui/` — shadcn/ui primitives (Radix UI + Tailwind)

### Data Layer

- **Supabase** is the sole database (PostgreSQL). Client initialized in `lib/supabase/client.ts` with anonymous key (no auth, `persistSession: false`).
- **Supabase Storage** hosts all static assets (images, videos) in the `website-assets` public bucket. Assets are organized into folders: `branding/`, `venue/`, `golf/`, `events/`, `lessons/`, `tournaments/`, `menus/`, `icons/`, `promotions/`, `videos/`. Use `storageUrl('folder/file.ext')` from `lib/constants.ts` to generate URLs. Only `favicon.png` remains in `public/images/`.
- Three tables: `blog_posts`, `contact_submissions`, `location_pages` (types in `types/supabase.ts`)
- Data fetching helpers: `lib/blog.ts`, `lib/locations.ts`
- Static data: `data/pricing.ts`, `data/coaches.ts`, `data/faq-pages.ts`, `data/faq-hub.ts` (/faq/ hub page content, EN+TH+JA+KO+ZH — the `CONTENT` record at the foot of the file is the launch gate for a locale), `data/hotel-pages.ts`, `data/explainer-pages.ts`, `data/price-guide-pages.ts`, `data/activity-occasions.ts`, `data/event-clients.ts`
- Location pages have rich schema: template_type, distance/transit metrics, area descriptions, SEO content, JSON-LD schema_markup

### Styling

- Tailwind CSS with custom theme in `tailwind.config.ts`
- Brand colors: primary green `#005a32`, accent gold `#c8a96e`, secondary dark `#1a1a1a`
- Font: Poppins (loaded via next/font)

### Key Utilities

- `lib/constants.ts` — site name, URLs, business info, navigation items, `storageUrl()` helper
- `lib/jsonld.ts` — JSON-LD structured data (LocalBusiness schema)
- `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)

### Forms

- react-hook-form + Zod for validation
- Contact form (`components/about/ContactForm.tsx`) and event inquiry form (`components/events/EventInquiryForm.tsx`)

### SEO

- Dynamic metadata via `generateMetadata` on each page
- `app/sitemap.ts` and `app/robots.ts` for search engine configuration
- Google Tag Manager via `NEXT_PUBLIC_GTM_ID`
- Location pages include per-page JSON-LD schema markup

## Environment Variables

Required in `.env.local` (see `.env.local.example`):
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase connection
- `NEXT_PUBLIC_GTM_ID` — Google Tag Manager
- `CONTACT_EMAIL_TO` — Contact form recipient

For migration scripts only:
- `SUPABASE_SERVICE_ROLE_KEY` — elevated access for data imports

## `vercel.json` pins `regions: ["sin1"]`

Supabase is in `ap-southeast-1` (Singapore). Without a pin, functions run in
Vercel's US default (`iad1`, Washington DC) and every PostgREST call crosses the
Pacific — ~230ms RTT, plus 2–3 more for a cold TLS handshake.

**This matters far less here than it sounds**, and it's worth knowing why before
anyone quotes a big number about it. This site is static/ISR: every page uses
`generateStaticParams` and `revalidate`, so the Supabase reads in `lib/blog.ts`,
`lib/clubs.ts`, `lib/promotions.ts` and friends happen at build time and during
background revalidation, not while a visitor waits. Sampled pages come back
`HIT` / `PRERENDER` / `STALE`, never a per-request render.

The one user-facing surface that pays is `POST /api/contact`, which awaits a
Supabase insert into `contact_submissions` before responding — roughly one round
trip. Its SMTP is `smtp.gmail.com` (anycast), so unlike `lengolf-booking-new`'s
Thai-hosted mail server there's no additional penalty on the email leg.

Check the execution region with the response header. The **second** segment is
where the function ran; the first is only the edge PoP that accepted the
connection:

```bash
curl -sI https://www.len.golf/ | grep -i x-vercel-id
```

`sin1::sin1::…` is correct. `::iad1::` means the pin was lost.

`preferredRegion` does NOT work for this — it's edge-runtime only and these
routes are Node. Top-level `regions` in `vercel.json` is the mechanism.

Sibling apps `lengolf-forms` and `lengolf-booking-new` pin the same region. In
booking-new the cost was severe rather than cosmetic — ~165ms of real query work
read as ~4s of wall clock — because its routes make five or six sequential
queries per request and its SMTP host is in Thailand.

## Path Alias

`@/*` maps to project root (e.g., `@/components/ui/button`).

## Migration Archive

All migration artifacts live in `_migration/` (gitignored, excluded from builds). Contains WordPress backup, markdown exports, import scripts, and SEO planning docs.

---

## 🔒 Supabase Security — Non-Negotiable Rules

The shared Lengolf Supabase was hardened after a security audit. Don't regress it.

### The single most important rule

**This project has ZERO legitimate browser-anon Supabase usage.** Every
database read (blog, clubs, locations, promotions, Google reviews, contact
form) happens server-side via `lib/supabase/client.ts`, which uses
`SUPABASE_SERVICE_ROLE_KEY` and is marked `import 'server-only'`.

**Never change the env var back to `NEXT_PUBLIC_SUPABASE_ANON_KEY`.** The
server-side anon grants the old factory depended on have been revoked
project-wide, so reverting would break every page on len.golf that shows
data from the DB.

### Type-only imports from client components are fine

```ts
import type { UsedClub } from '@/lib/clubs'  // OK — erased at build time
```
**Runtime** imports from a `'use client'` component will fail the build
via `server-only`. Keep it that way.

### If you ever think you need browser-side Supabase access

Stop and ask. The current static-marketing-site design doesn't need it.
If there's a real interactive use case, prefer a server component that
fetches at request time, or a new API route using the existing factory.

### Hard red flags — stop and reconsider

- A `'use client'` component with a runtime `import { createClient } from '@/lib/supabase/client'`
- Any inline `createClient(..., process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)`
- A new Supabase factory file missing `import 'server-only'` at the top
- Any migration in the shared Lengolf DB that does `GRANT ALL ... TO anon` on the public or backoffice schemas

### Reference

Full plan + history: `~/.claude/plans/humming-singing-candy.md`
