/**
 * Pure parsers for the club spec sheet (/golf-club-specs).
 *
 * Deliberately separate from lib/clubs.ts, which imports `server-only` for its
 * Supabase client. These functions touch no DB and no request context, so
 * keeping them here lets `npm run validate:club-specs` exercise them directly —
 * they turn free-text, staff-authored DB strings into a table, which is exactly
 * the kind of logic that rots silently when someone re-words a spec.
 */

/** A canonical row in the spec matrix. Order here is the display order. */
export const SPEC_ROWS = ['driver', 'wood', 'hybrid', 'irons', 'wedges', 'putter', 'bag', 'other'] as const
export type SpecRow = (typeof SPEC_ROWS)[number]

/**
 * Classify one club description into a spec-matrix row.
 *
 * Test order is load-bearing, and each rule earns its position:
 * - A part can only ever occupy ONE row, so when a description names two clubs
 *   the more important one has to win.
 * - Anything unrecognised falls to `other` rather than being dropped — a club
 *   that silently vanishes from a spec sheet is worse than an ugly row.
 */
export function classifySpecPart(part: string): SpecRow {
  const s = part.toLowerCase()
  // Putter first: a putter line never names another club.
  //
  // Matching on the bare word "putter" alone is not enough — a spec may name
  // the model and shaft without ever saying "putter" ("Odyssey Tri-Beam 70g
  // (Stroke Lab)"), which silently dropped both putters into "Other". Hence the
  // maker/model terms. A putter from a brand not listed here still falls to
  // `other` rather than vanishing, and the row stays visible.
  if (/putter|odyssey|stroke lab|white hot|tri-?beam|scotty cameron|sightline/.test(s)) return 'putter'
  // Wedges BEFORE irons. Our wedge lines routinely name the iron bag they
  // belong to ("Jaws Raw 54°/58° matched to the iron shafts"), and `\biron` is
  // the broader pattern — testing it first swallowed the whole wedge row.
  if (/wedge|jaws|\bsw\b|\bpw\b|\blw\b|\bgw\b/.test(s)) return 'wedges'
  if (/\biron/.test(s)) return 'irons'
  // Woods BEFORE hybrids, same reasoning: a combined "4W + 5H" part occupies
  // one row, and losing the wood is worse than losing the hybrid — every set
  // has woods, not every set has a hybrid.
  if (/wood|\bfairway\b|\b\dw\b/.test(s)) return 'wood'
  if (/hybrid|\b\dh\b/.test(s)) return 'hybrid'
  // Driver last among clubs: a bare loft is the weakest signal, so it only wins
  // once every named club is ruled out. Matching ANY loft rather than the two
  // our current bags happen to use means a re-specced driver does not silently
  // fall into "Other".
  if (/driver|ai smoke|\b\d{1,2}([.,]\d)?\s*°/.test(s)) return 'driver'
  if (/\bbag\b/.test(s)) return 'bag'
  return 'other'
}

/**
 * Drop a club noun the row header already states, so the Irons row reads
 * "6-P steel S-flex (Nippon N.S. Pro Zelos 7)" instead of "irons 6-P steel...".
 * Only strips a LEADING noun, and only when something is left over — a cell
 * that is nothing but its noun keeps its text rather than going blank.
 */
const ROW_NOUN: Partial<Record<SpecRow, RegExp>> = {
  irons: /^irons?\b[:\s]\s*/i,
  wedges: /^wedges?\b[:\s]\s*/i,
  putter: /^putters?\b[:\s]\s*/i,
  driver: /^drivers?\b[:\s]\s*/i,
  hybrid: /^hybrids?\b[:\s]\s*/i,
}

export function stripRowNoun(text: string, row: SpecRow): string {
  const re = ROW_NOUN[row]
  if (!re) return text
  const out = text.replace(re, '').trim()
  return out.length > 0 ? out : text
}

/**
 * Split a variant's `spec` string into matrix parts.
 *
 * Returns null when the string is a single free-text note rather than a club
 * list. The Warbird variants read "Graphite shafts, R-flex throughout (driver,
 * 5-wood and irons)" — parsing that into rows would file one shaft note under
 * "Driver" and lose the rest, so the separator is the signal: `·` means a club
 * list, no `·` means a note.
 */
export function parseVariantSpec(spec: string | null | undefined): { row: SpecRow; text: string }[] | null {
  if (!spec) return null
  if (!spec.includes('·')) return null
  const parts = spec.split('·').map((p) => p.trim()).filter(Boolean)
  if (parts.length < 2) return null
  return parts.map((raw) => {
    const row = classifySpecPart(raw)
    return { row, text: stripRowNoun(raw, row) }
  })
}

/**
 * Shaft models that are written WITHOUT surrounding parentheses in the DB.
 *
 * The house style is "club spec FLEX-flex (Shaft Model)", and everything that
 * follows that style is parsed structurally. These few are authored inline
 * instead ("Jaws Forged 52°/56° Dynamic Gold S200"), so they need naming. If
 * the DB strings are ever normalised to always parenthesise the shaft, this
 * list can go away — until then, an unlisted inline shaft simply stays in the
 * spec column rather than being lost.
 */
// The optional trailing club noun is defensive, not currently exercised. It was
// added when the putters read "Odyssey Tri-Beam Stroke Lab putter" and a strict
// end anchor found no shaft at all. Transcribing the owner's sheets later
// rewrote those to "Odyssey Tri-Beam 70g (Stroke Lab)", so the putter shaft now
// comes from the parenthetical branch instead and INLINE_SHAFTS only reaches
// the two Dynamic Gold wedge lines. Kept because the trailing-noun style is
// still valid authoring and would otherwise regress silently.
const INLINE_SHAFTS =
  /\b(Dynamic Gold\s*[A-Z]?\d*|Stroke Lab|Ventus\s*TR(?:\s*Blue)?|Ventus|N\.?S\.?\s*Pro\s*Zelos\s*\d*|Project X[\w\s]*|KBS[\w\s]*)(?:\s+(?:putter|wedges?|irons?|driver|shafts?))?\s*$/i

/**
 * Flex written as "R-flex", "SR flex", "S FLEX", or the standalone "Uniflex" —
 * but only as the LAST token, which is the house style ("... 10.5° R-flex").
 *
 * The anchor is what stops prose being mangled: the Warbird note reads "Steel
 * shafts, Uniflex throughout", and pulling the flex out of the middle of that
 * left "Steel shafts, throughout". A mid-sentence flex is description, not a
 * field, so it stays where it is.
 */
const FLEX = /\b(Uniflex|(?:R2|SR|TX|[RSXAL])[-\s]?flex)\s*$/i

/**
 * Pull the shaft and flex out of one club description so they can have their
 * own table columns, leaving the club itself in the spec column.
 *
 * Everything is optional — a part that names no shaft returns `shaft: null`
 * and the cell renders an em dash. Nothing is ever dropped: whatever is not
 * recognised as shaft or flex stays in `spec`.
 */
/**
 * Shaft weight, written on the sheets as "50g" / "70g".
 *
 * A leading "~" marks a MANUFACTURER-PUBLISHED figure rather than one the owner
 * measured (e.g. "~78g" for the Nippon Zelos 7 S). The tilde is carried through
 * to the rendered cell on purpose — the two are different kinds of claim and
 * the table says which is which rather than blending them.
 *
 * Requires digits immediately before the g so it cannot fire on a shaft NAME —
 * "Dynamic Gold S200" must not yield a weight, and neither must "S200" itself.
 */
const WEIGHT = /(~?\d{2,3}(?:\.\d)?)\s*g\b/i

export function splitClubPart(text: string): {
  spec: string
  shaft: string | null
  flex: string | null
  weight: string | null
} {
  let rest = text
  let shaft: string | null = null
  let flex: string | null = null
  let weight: string | null = null

  // Trailing parenthetical is the shaft: "... R-flex (Fujikura Ventus)".
  const paren = rest.match(/\(([^()]*)\)\s*$/)
  if (paren) {
    shaft = paren[1].trim()
    rest = rest.slice(0, paren.index).trim()
  }

  // Weight comes out BEFORE flex. The sheets write it on either side of the
  // flex ("10.5° 50g R-flex" but also "S-flex ~78g"), and since FLEX is
  // end-anchored, a trailing weight would otherwise hide the flex completely —
  // the Zelos row lost its "S" exactly that way.
  const weightMatch = rest.match(WEIGHT)
  if (weightMatch) {
    weight = `${weightMatch[1]}g`.replace(/\s+/g, '')
    rest = (rest.slice(0, weightMatch.index) + rest.slice(weightMatch.index! + weightMatch[0].length))
      .replace(/\s{2,}/g, ' ')
      .trim()
  }

  const flexMatch = rest.match(FLEX)
  if (flexMatch) {
    // Normalise "R-flex" / "S FLEX" to a bare "R" / "S"; keep "Uniflex" whole.
    const raw = flexMatch[1]
    flex = /uniflex/i.test(raw) ? 'Uniflex' : raw.replace(/[-\s]?flex$/i, '').toUpperCase()
    rest = (rest.slice(0, flexMatch.index) + rest.slice(flexMatch.index! + raw.length)).replace(/\s{2,}/g, ' ').trim()
  }

  // Only look for an inline shaft if the parenthetical did not already give us one.
  if (!shaft) {
    const inline = rest.match(INLINE_SHAFTS)
    if (inline) {
      shaft = inline[1].trim()
      rest = rest.slice(0, inline.index).trim()
    }
  }

  return { spec: rest.replace(/[,\s]+$/, '').trim() || text, shaft, flex, weight }
}

/**
 * Split a `specifications` entry into a label/value pair when it is authored as
 * "Driver: TaylorMade RBZ 10.5° (Stiff)" — the left-handed set is written that
 * way and renders as a real table. Entries without a colon stay plain bullets.
 */
export function splitSpecEntry(entry: string): { label: string; value: string } | null {
  const i = entry.indexOf(': ')
  if (i <= 0) return null
  return { label: entry.slice(0, i).trim(), value: entry.slice(i + 2).trim() }
}
