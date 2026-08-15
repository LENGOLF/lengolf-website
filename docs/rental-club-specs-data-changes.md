# Rental club spec — production data changes

`rental_club_sets.variants[].spec` is **staff-authored free text held only in the
production Supabase database**. This repo has no `supabase/` directory and no
migrations, so a change to those strings is not captured anywhere in git.

That matters more than it looks: the spec sheet at `/golf-club-specs/` parses
these strings into its table (`lib/club-specs.ts`), so re-wording one silently
changes a live customer-facing page — and there is no `git revert` for it.

**Record every change here, with the previous value verbatim, before writing.**
The previous value is the only rollback path short of Supabase point-in-time
recovery.

---

## 2026-08-15 — Paradym: shaft weights added, graphite 5-wood shaft restored

Transcribed from the owner's two handwritten spec sheets ("LG Golf Bag" = steel,
"Callaway Golf Bag" = graphite), photographed 2026-08-15.

Two things changed:

1. **Shaft weights were added.** The sheets record 50g on every driver/wood and
   on the graphite irons, and "70 class" on both putters. None of it had ever
   been entered.
2. **The graphite 5-wood's shaft was restored.** The sheet reads "5 wood
   Paradym 18° 50g R-flex Fujikura Ventus", but the DB entry was
   `Paradym 5W 18° R-flex` — the shaft had been dropped when the sheet was
   first transcribed, which is why the Shaft column rendered an em dash for
   that row.

The steel irons carry the shaft maker's published figure marked `~78g` (Nippon's
S-flex spec, measured before cutting). The leading `~` is load-bearing: it marks
a catalogue figure rather than one the owner measured, and the page renders it
with a footnote saying so. Both wedge sets have neither a measured nor a
published figure and are deliberately left blank — a catalogue number and a
measured number are different claims and must not be blended. (The cost of
blending them was demonstrated during this change: the aftermarket Ventus TR
Blue+ 5 R is published at 60g, while the sheet and the `5-R` stamped on the
shaft band both say 50g. Ours is a "for Callaway" OEM build.)

### `premium-plus-mens-paradym` — variant `steel`

**Before:**

```
Ai Smoke 10.5° R-flex (Mitsubishi Chemical) · Paradym 3W 15° + 5W 18° SR-flex (Fujikura Ventus) · irons 6-P steel S-flex (Nippon N.S. Pro Zelos 7) · Jaws Forged 52°/56° Dynamic Gold S200 · Odyssey Tri-Beam Stroke Lab putter
```

**After:**

```
Ai Smoke 10.5° 50g R-flex (Mitsubishi Chemical) · Paradym 3W 15° + 5W 18° 50g SR-flex (Fujikura Ventus) · irons 6-P steel S-flex ~78g (Nippon N.S. Pro Zelos 7) · Jaws Forged 52°/56° Dynamic Gold S200 · Odyssey Tri-Beam 70g (Stroke Lab)
```

### `premium-plus-mens-paradym` — variant `graphite`

**Before:**

```
Paradym 10.5° R-flex (Fujikura Ventus) · Paradym 5W 18° R-flex · irons 6-P graphite R-flex (Fujikura Ventus) · Jaws Raw 54°/58° Dynamic Gold S200 · Odyssey White Hot Black Series Five Stroke Lab putter
```

**After:**

```
Paradym 10.5° 50g R-flex (Fujikura Ventus) · Paradym 5W 18° 50g R-flex (Fujikura Ventus) · irons 6-P graphite 50g R-flex (Fujikura Ventus) · Jaws Raw 54°/58° Dynamic Gold S200 · Odyssey White Hot Black Series Five 70g (Stroke Lab)
```

---

## Authoring conventions the parser relies on

Changing a string without honouring these will move a club to the wrong row or
blank a column. `npm run validate:club-specs` pins the current values, so run it
after any edit — it is the only thing standing between a re-word and a silently
wrong public page.

- **`·` separates clubs.** A string with no `·` is treated as a free-text note,
  not a club list, and renders as a note instead of a table. This is deliberate:
  the Warbird's "Graphite shafts, R-flex throughout (driver, 5-wood and irons)"
  would otherwise be filed under Driver with the rest discarded.
- **Shaft in trailing parentheses**: `... R-flex (Fujikura Ventus)`. A handful of
  shafts are written inline instead (`Dynamic Gold S200`, `Stroke Lab`) and are
  named explicitly in `INLINE_SHAFTS`. An unlisted inline shaft is not lost — it
  simply stays in the spec column.
- **Flex last**, before the parenthetical: `S-flex`, `SR-flex`, `Uniflex`. A flex
  written mid-sentence is treated as prose and left alone.
- **Weight as `50g`**, or `~78g` for a published figure. May appear on either
  side of the flex.
- **Name the club type** where it is not obvious. Putters are matched on maker
  and model as well as the word "putter", but a brand outside that list falls
  into an "Other" row rather than vanishing.

## Known unresolved

- A photograph of a Warbird shaft band reads **`WARBIRD · Callaway · S FLEX`**,
  while the owner's sheet and the DB both say the graphite Warbird is **R-flex**.
  The sheet is treated as authoritative and the site says R. The photo is
  unexplained — recheck when the steel set is returned.
- `used_clubs_inventory` set 6 is stale (it implies a for-sale Warbird that does
  not exist). Unrelated to rentals, but it will mislead anyone reading that table.
