# Course Data Overrides

Manual corrections that take priority over anything found via web search.
Add an entry here when you have confirmed a field value from a reliable direct source
(e.g. you called the course, or the official website clearly states the figure).

Claude checks this file in Stage 1 before running web searches.
If a field is listed here, its value is used directly and marked `source: knowledge-override`.

---

## Format

```
### <Course Name> — <slug>
Field: <field_name>
Value: <correct value>
Source: <where you confirmed this — e.g. "Official website", "Called course on 2026-04-16">
Date confirmed: <YYYY-MM-DD>
Note: <optional — why this override was needed>
```

---

## Overrides

### Ayutthaya Golf Club — ayutthaya-golf-club
Field: designer
Value: Attanan Yomchinda
Source: Thai-language sources (golfdd.com, thaigolfguru.com, MGR Online 9560000081059) — Thai name อรรถอนันต์ ยมจินดา
Date confirmed: 2026-08-07
Note: Contested romanisation. Read "Attanan Yomchinda" below before changing this to match any single web source.

### River Kwai Golf & Country Club — river-kwai-golf-country-club
Field: designer
Value: Attanan Yomchinda
Source: As above — same architect, standardised spelling
Date confirmed: 2026-08-07
Note: Contested romanisation. Read "Attanan Yomchinda" below before changing.

### Royal Ratchaburi Golf Club & Resort — royal-ratchaburi-golf-club
Field: designer
Value: Attanan Yomchinda
Source: As above — same architect, standardised spelling
Date confirmed: 2026-08-07
Note: Contested romanisation. Read "Attanan Yomchinda" below before changing.

### Evergreen Hills Golf Club & Resort — evergreen-hills-golf-club
Field: designer
Value: Attanan Yomchinda
Source: As above — same architect, standardised spelling
Date confirmed: 2026-08-07
Note: The club's OWN site (evergreenhillsgolfclub.com) writes "Mr. Att-anan Yomjinda". We deliberately do NOT follow it — read "Attanan Yomchinda" below.

### Blue Sapphire Golf & Resort — blue-sapphire-golf-resort
Field: designer
Value: Steven Youdan & Attanan Yomchinda
Source: As above — same architect, standardised spelling
Date confirmed: 2026-08-07
Note: Contested romanisation. Read "Attanan Yomchinda" below before changing.
### Summit Green Valley Chiangmai Country Club — summit-green-valley-chiangmai
Field: designer
Value: Denis Griffiths
Source: ASGCA architect profile (asgca.org/architect/dgriffiths/), Planet Golf, Wikipedia (Thai Country Club)
Date confirmed: 2026-08-07
Note: One "n", not two. Read "Denis Griffiths" below — he is American, not Australian.

### Phoenix Gold Golf & Country Club (Pattaya) — phoenix-gold-golf-club-pattaya
Field: designer
Value: Denis Griffiths
Source: As above. Was "Dennis Griffith" — the given name misspelled AND the surname's final "s" dropped.
Date confirmed: 2026-08-07
Note: Read "Denis Griffiths" below.

### Loch Palm Golf Club — loch-palm-golf-club
Field: designer
Value: Dr. Sukitti Klangvisai
Source: Golfasian, GolfSavers, Albrecht Golf Guide — all "Klangvisai" for this course
Date confirmed: 2026-08-07
Note: Was "Klangwisai" (w for v). Same architect as phuket-country-club, majestic-creek, rachakram.

### Chee Chan Golf Resort — chee-chan-golf-resort
Field: designer
Value: Golfplan (Dale & Ramsey Golf Course Architects)
Source: Golfasian, Where2Golf; matches the wording already used in this course's own prose
Date confirmed: 2026-08-07
Note: Was an em-dash form ("Golfplan — Dale & Ramsey Golf Course Architects") that disagreed with the parenthesised form in the same file's `prose.overview`. Purely a punctuation normalisation; the attribution itself is unchanged. See "Golfplan" in the table below for the credits this does NOT resolve.

### Hua Hin Korea Golf Club — korea-golf-club-hua-hin
Field: designer
Value: Bob McFarland
Source: His own LinkedIn ("Bob McFarland — Golf Course Architect & Planning")
Date confirmed: 2026-08-07
Note: Read "Bob McFarland" below — sources split roughly 50/50 with "Robert".

### Hat Yai Resort & Golf Club — hat-yai-resort-golf-club
Field: designer
Value: Bob McFarland
Source: As above
Date confirmed: 2026-08-07
Note: Read "Bob McFarland" below.

### Alpine Golf Resort Chiang Mai — alpine-golf-resort-chiang-mai
Field: designer
Value: Ronald M. Garl (Course A+B); Pirapon Namatra (Course C)
Source: Golfasian (Ronald M. Garl); "Namatra" is the form used by three sibling courses (bangkok/bangsai-country-club, hua-hin/pineapple-valley-golf-club, koh-samui/santiburi-samui-country-club) and five mentions in data/explainer-pages.ts
Date confirmed: 2026-08-07
Note: Was "Pirapon Nanatra" (m→n typo) and "Ron M. Garl". Garl practises as "Ron Garl"; the repo standardises on the fuller "Ronald M. Garl" because bangkok/alpine-golf-club.ts already carries it in six places including th and ja prose.

### Kiarti Thanee Country Club — kiarti-thanee-country-club
Field: designer
Value: Yoshiharu Ihara (redesigned 2004 by Yoshikazu Kato)
Source: wenggroup.com — the club's owner group
Date confirmed: 2026-08-07
Note: The renovator was written surname-first ("Kato Yoshikazu"); four other courses use "Yoshikazu Kato". Do NOT merge Yoshiharu Ihara with Pinehurst's Yoshihara Aihara — see "Names that look wrong but are not" below.

### Khao Kheow Country Club — khao-kheow-country-club
Field: designer
Value: Perry Dye and Pete Dye
Source: Golfasian, huahintravel, thaigerline — all "Pete Dye" for this course
Date confirmed: 2026-08-07
Note: Was "Peter Dye". He practises as Pete Dye. Perry Dye is his son and a genuinely distinct credit — keep both.

---

## Notes

### Attanan Yomchinda

This architect's name has **no authoritative English romanisation**. Before "correcting"
it against a source you just found, read this — the repo previously carried four different
spellings for him, one per source the page was built from, and that drift is what this
override exists to stop.

**Thai name: อรรถอนันต์ ยมจินดา.** Attested by three independent Thai-language sources —
golfdd.com (Evergreen Hills), thaigolfguru.com (Best Ocean), and an MGR Online article on
Ayutthaya Golf Club that also identifies him as a former Thai national-team golfer. One
outlier (hotgolfclub.com) writes อรรถนันต์.

**Why "Attanan" and not "Artanan".** อรรถอนันต์ = อรรถ (*at*) + อนันต์ (*anan*). The "r" in
the widespread "Artanan"/"Art-anan" spellings is a silent orthographic artefact of the รร
cluster, not a pronounced sound. The doubled-t forms are the phonetically faithful ones.

**Why "Yomchinda" and not the club's "Yomjinda".** ยมจินดา supports either, but every
English golf publication uses "Yomchinda", so it is kept for reader recognition. This is
the one point where we knowingly diverge from a club's own site.

**Spellings seen in the wild** (all refer to this same person):

| Spelling | Where |
|---|---|
| `Att-anan Yomjinda` | evergreenhillsgolfclub.com (the club's own site) |
| `Artanan Yomchinda` | Where2Golf (River Kwai), GolfSavers (Royal Ratchaburi) |
| `Art-anan Yomchinda` | Where2Golf (Blue Sapphire) |
| `At-anan Yomchinda` / `At-anan Yochinda` | GolfSavers (Evergreen Hills) — both, on one page |
| `Attanan` / `Attanon Yomchinda` | GolfLux, Where2Golf (Ayutthaya) |

Publishers contradict themselves within a single page and across their own course pages, so
"the source says X" is not sufficient reason to change this. If you find a primary source
that records the architect's *own* preferred English spelling, that would supersede this
entry — update it here rather than editing the course files directly.

### How to break a tie when sources disagree

Applied in this order. State which rule you used when you add an entry — an unstated
tie-break gets re-litigated by the next person.

1. **The subject's own usage** — their site, their firm's site, their professional profile.
2. **A primary source for that specific course** — the club's own site or owner group.
3. **Incumbency in this repo** — the form already used by the most course files, especially
   if any of them carry th/ja/ko/zh prose (changing translated prose costs more than it
   gains).
4. **Weight of independent publishers**, discounting any that cite len.golf.

Worked examples: **Bob McFarland** was decided by rules 1 and 3 agreeing (his LinkedIn says
Bob, and three course files already said Bob against two saying Robert). **Ronald M. Garl**
was decided by rule 3 alone, and it is the one place where rule 1 points the other way — he
practises as "Ron Garl". Incumbency won because `bangkok/alpine-golf-club.ts` carries
"Ronald M. Garl" six times including Thai and Japanese prose, and rewriting translated
copy for a stylistic preference is not worth it. If you disagree, change both files
together — do not split them again.

### Denis Griffiths

**One "n", final "s", and he is American.** Denis Griffiths is a past President of the
American Society of Golf Course Architects, based in Atlanta, Georgia. His ASGCA profile is
at `asgca.org/architect/dgriffiths/`. He designed Thai Country Club (1996, host of the 1997
Asian Honda Classic that Tiger Woods won by ten strokes), Dynasty, Chatrium Soi Dao,
Phoenix Gold Pattaya, and Summit Green Valley Chiangmai.

Two traps here:

1. **GolfPass carries him twice** — architect 759 "Denis Griffiths" and architect 762
   "Dennis Griffiths" — so a search can "confirm" either spelling. ASGCA is the authority.
2. **The Summit Green Valley prose used to call him Australian.** He is not. That sentence
   cross-references Thai Country Club correctly, so the nationality error was the only
   factual problem alongside the spelling.

### Bob McFarland

Five course files name him, and they split three to two: "Bob" at Rancho Charnvee, Toscana
Valley and Thanont Golf View, "Robert" at Hat Yai Resort and Hua Hin Korea (the same 3–2
count cited in the tie-break worked example above). Same American architect either way — 80+ courses across Asia
and beyond. His own LinkedIn headline reads "Bob McFarland — Golf Course Architect &
Planning", so the repo standardises on **Bob**. Don't "correct" it back to Robert on the
strength of one course listing.

### Names that look wrong but are NOT — do not "fix" these

Each of these was investigated and is correct as written. They look like the same bug class
as the corrections above, so without this note they invite a wrong edit.

| Value | Where | Why it stays |
|---|---|---|
| `Yoshihara Aihara` | pinehurst-golf-country-club | **A different person from Kiarti Thanee's Yoshiharu Ihara.** Pinehurst's own site (pinehurst.co.th/en/golf-course) names "Mr. Yoshihara Aihara"; Kiarti Thanee's owner group (wenggroup.com) independently names Yoshiharu Ihara. Two Japanese architects, adjacent years, nearly identical strings — merging them would be a fabricated identity. |
| `Gasson` | pattana-golf-club-resort | Surname-only, but that is genuinely how Golfasian, GolfLux and Thai Golf Holidays credit it. Not a truncated scrape. |
| `Gray Gerry Nazch` | ekachai-golf-country-club | Reads like corruption but is the credit used by the club's own listings and golfdigg ("designed by Mr. Gray Gerry Nazch in 1982"). |
| `Perry Dye` vs `Pete Dye` | southern-hills, khao-kheow | Father and son. Both real, both correctly distinct. |
| `Bob Moore (JMP Golf Design)` | sai-golf-club | A different JMP architect from `J. Michael Poellot` at lakewood/rajpruek — not a spelling variant of the same person. |
| `Sukitti Klangvisa` | seoul-siam-resort-country-club | Deliberately NOT normalised to `Dr. Sukitti Klangvisai`. See "Seoul Siam" below — the spelling is wrong, but fixing it would make an unverified attribution look authoritative. |
| `Golfplan` credited three ways | chee-chan, mountain-shadow, panya-indra, windsor-park | `Golfplan (Dale & Ramsey…)`, `Ronald Fream / Golfplan`, `Ronald Fream & David Dale` are three DIFFERENT facts — firm alone, person + firm, two named people — not three spellings of one. Left as-is on purpose. Same for `Schmidt-Curley` (×5) and `Pacific Coast Design` (×2), where the decorations encode different project scopes (original vs renovation, firm vs lead architect). |

### Seoul Siam — a wrong spelling left in place on purpose

`seoul-siam-resort-country-club` has `designer: 'Sukitti Klangvisa'`. That is a truncation
of Dr. Sukitti Klangvisai, whose name is spelled correctly on the four sibling courses. It
was **deliberately not normalised**, and the reason is worth understanding before you
"finish the job":

The only web source that names a designer for this course is **len.golf itself**. The
attribution is circular — we cannot confirm from any independent source that this architect
designed this course at all. Normalising the string would add an honorific and complete the
surname on a claim we cannot support, and `designer` is not a cosmetic field: it feeds the
generated `<meta name="description">` via `lib/course-seo.ts`, unhedged. The prose hedges
correctly ("a design attributed to…"); the field would not.

A garbled weak claim is self-limiting. A polished weak claim reads as authority. So the
spelling stays wrong until the attribution is verified.

**To resolve**: find an independent source naming this course's designer. If it confirms
Dr. Sukitti Klangvisai, normalise the string and add a proper override entry. If no source
exists, prefer `designer: null` over a tidy guess — the prose sentence can carry the
attribution with its hedge intact.

### Jack Nicklaus — "Signature" is a product tier, not an intensifier

Nicklaus Design sells distinct tiers (Signature, Nicklaus Design, Nicklaus Legacy) that
differ in how personally involved Jack Nicklaus was. Treat "Signature" as a factual claim
requiring a source, not as decoration.

`REGION_META['khao-yai'].description` in `lib/golf-courses.ts` used to advertise "Jack
Nicklaus **Signature** designs at Kirimaya and Khao Yai Golf Club". It now says "Jack
Nicklaus designs". Reason: `khao-yai-golf-club.ts` has `designer: 'Jack Nicklaus'` and the
word "Signature" appears nowhere in that file, so the hub was asserting a tier its own
course page did not support.

**Still open** (flagged, not fixed here): `kirimaya-golf-course.ts:31,35` and
`life-privilege-country-club.ts:31` both describe themselves in prose as a "Jack Nicklaus
Signature Design", while Kirimaya's own site (kirimaya.com/experience/golf) says only
"Designed by Jack Nicklaus". Those prose claims need a source or a downgrade. They were left
alone because rewriting a course's self-description is a content decision, not a name fix —
but they are the two pages actually carrying the unsupported tier, and `lib/jsonld-courses.ts`
feeds `prose.overview` into the `GolfCourse` schema, so it ships as structured data.

### UNRESOLVED — Cherd Bunyaratavej cluster

Three romanisations across three courses, deliberately **left alone**:

1. `Cherd Bunyaratavej / Jack Nicklaus Design` — kaeng-krachan-country-club
2. `Cherd Boonyarattanavej` — star-country-club
3. `Chird Boonyarattanevet` — bangkok-golf-club

Almost certainly one Thai architect, and this is the same problem as
[Attanan Yomchinda](#attanan-yomchinda) above — but it could not be resolved to that
standard:

1. **No Thai-language source was found**, so the Thai spelling is unknown. The Yomchinda
   method depended entirely on knowing it (อรรถอนันต์ told us the "r" was silent). Without
   it there is no principled basis for choosing.
2. **No source links Bangkok Golf Club's credit to the other two.** Web sources reproduce
   each course's own spelling — "Chird Boonyarattanevet" is exactly what Bangkok Golf Club
   listings say. Collapsing the three would assert an identity that is inferred, not
   evidenced.

Web sources do lean "Cherd Bunyaratavej" for Kaeng Krachan specifically (Golfasian,
Deemples, GolfLux, Asia Golf Trail), with "Cherd Boonyaratavej" as the runner-up. To finish
this properly, find the Thai spelling of the surname — likely บุญยรัตนเวช or similar, given
the "-vej"/"-vet" ending — then apply the Yomchinda method and replace this section with
real override entries.
