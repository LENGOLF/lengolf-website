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
