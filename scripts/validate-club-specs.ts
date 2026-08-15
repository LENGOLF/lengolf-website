/**
 * Validate the club spec-sheet parsers (lib/club-specs.ts).
 *
 * These turn free-text, staff-authored `rental_club_sets.variants[].spec`
 * strings into the table on /golf-club-specs. Nobody edits this file when they
 * re-word a spec in the DB, so the failure mode is silent: a club quietly moves
 * to the wrong row, or the whole matrix collapses into a note. The cases below
 * pin the CURRENT live strings plus the near-miss phrasings that already broke
 * the classifier once during review.
 *
 * Run: npm run validate:club-specs
 */
import {
  classifySpecPart,
  parseVariantSpec,
  splitClubPart,
  splitSpecEntry,
  stripRowNoun,
} from '../lib/club-specs'
import type { SpecRow } from '../lib/club-specs'

let failures = 0

function check(label: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  if (a !== e) {
    console.error(`  FAIL  ${label}\n        got      ${a}\n        expected ${e}`)
    failures++
  }
}

// ── classifySpecPart ──────────────────────────────────────────────────────
// Live strings first: these are the exact values in the DB today.
const LIVE: [string, SpecRow][] = [
  ['Ai Smoke 10.5° R-flex (Mitsubishi Chemical)', 'driver'],
  ['Paradym 10.5° R-flex (Fujikura Ventus)', 'driver'],
  ['Paradym 3W 15° + 5W 18° SR-flex (Fujikura Ventus)', 'wood'],
  ['Paradym 5W 18° R-flex', 'wood'],
  ['irons 6-P steel S-flex (Nippon N.S. Pro Zelos 7)', 'irons'],
  ['irons 6-P graphite R-flex (Fujikura Ventus)', 'irons'],
  ['Jaws Forged 52°/56° Dynamic Gold S200', 'wedges'],
  ['Jaws Raw 54°/58° Dynamic Gold S200', 'wedges'],
  ['Odyssey Tri-Beam Stroke Lab putter', 'putter'],
  ['Odyssey White Hot Black Series Five Stroke Lab putter', 'putter'],
]

// Phrasings that are one DB edit away. Each of these misclassified before the
// rule order was fixed — they are regressions, not hypotheticals.
const NEAR_MISS: [string, SpecRow][] = [
  // `\biron` used to outrank the wedge test, so a wedge naming its iron bag
  // was filed under Irons and the Wedges row rendered "—".
  ['Jaws Raw 54°/58° matched to the iron shafts', 'wedges'],
  ['50° gap wedge', 'wedges'],
  // `hybrid` used to outrank `wood`, blanking the Fairway woods row on a
  // combined part. Combined parts are this DB's authoring style already.
  ['4W + 5H graphite', 'wood'],
  ['Big Bertha 5-wood 18° + 5 hybrid 24°', 'wood'],
  ['5-Hybrid 24° graphite', 'hybrid'],
  // Driver detection used to hardcode 10.5°/12.5°, so any re-specced driver
  // fell silently into "Other".
  ['Stealth 2 9° X-flex', 'driver'],
  ['Ai Smoke Max 10,5 °', 'driver'],
  ['Callaway tour bag', 'bag'],
  // Genuinely unrecognisable text must survive in `other`, never disappear.
  ['Grip: Golf Pride MCC', 'other'],
]

for (const [input, expected] of [...LIVE, ...NEAR_MISS]) {
  check(`classify ${JSON.stringify(input)}`, classifySpecPart(input), expected)
}

// ── parseVariantSpec ──────────────────────────────────────────────────────
// A `·`-separated string is a club list and becomes matrix rows.
const paradymSteel =
  'Ai Smoke 10.5° R-flex (Mitsubishi Chemical) · Paradym 3W 15° + 5W 18° SR-flex (Fujikura Ventus) · irons 6-P steel S-flex (Nippon N.S. Pro Zelos 7) · Jaws Forged 52°/56° Dynamic Gold S200 · Odyssey Tri-Beam Stroke Lab putter'
const parsed = parseVariantSpec(paradymSteel)
check('paradym steel row order', parsed?.map((p) => p.row), ['driver', 'wood', 'irons', 'wedges', 'putter'])
check(
  'paradym steel strips the redundant Irons noun',
  parsed?.find((p) => p.row === 'irons')?.text,
  '6-P steel S-flex (Nippon N.S. Pro Zelos 7)'
)

// A string with NO separator is a free-text note, not a club list. Parsing the
// Warbird note into rows would file it under Driver and lose the rest.
check(
  'warbird graphite note stays a note',
  parseVariantSpec('Graphite shafts, R-flex throughout (driver, 5-wood and irons)'),
  null
)
check('warbird steel note stays a note', parseVariantSpec('Steel shafts, Uniflex throughout'), null)
check('empty spec is a note', parseVariantSpec(null), null)
check('single separated part is not a matrix', parseVariantSpec('Driver 10.5° · '), null)

// ── stripRowNoun ──────────────────────────────────────────────────────────
check('strips leading noun', stripRowNoun('irons 6-P steel', 'irons'), '6-P steel')
check('strips colon form', stripRowNoun('Irons: 6-P steel', 'irons'), '6-P steel')
// A cell that is nothing BUT its noun must keep its text rather than go blank.
check('noun-only text survives', stripRowNoun('irons', 'irons'), 'irons')
check('non-leading occurrence untouched', stripRowNoun('Jaws matched to iron shafts', 'wedges'), 'Jaws matched to iron shafts')
check('row without a noun rule is untouched', stripRowNoun('Callaway tour bag', 'bag'), 'Callaway tour bag')

// ── splitClubPart (shaft / flex columns) ──────────────────────────────────
// Every live Paradym club, decomposed the way the table renders it.
const SPLITS: [string, { spec: string; shaft: string | null; flex: string | null }][] = [
  ['Ai Smoke 10.5° R-flex (Mitsubishi Chemical)', { spec: 'Ai Smoke 10.5°', shaft: 'Mitsubishi Chemical', flex: 'R' }],
  ['Paradym 10.5° R-flex (Fujikura Ventus)', { spec: 'Paradym 10.5°', shaft: 'Fujikura Ventus', flex: 'R' }],
  ['Paradym 3W 15° + 5W 18° SR-flex (Fujikura Ventus)', { spec: 'Paradym 3W 15° + 5W 18°', shaft: 'Fujikura Ventus', flex: 'SR' }],
  ['6-P steel S-flex (Nippon N.S. Pro Zelos 7)', { spec: '6-P steel', shaft: 'Nippon N.S. Pro Zelos 7', flex: 'S' }],
  ['6-P graphite R-flex (Fujikura Ventus)', { spec: '6-P graphite', shaft: 'Fujikura Ventus', flex: 'R' }],
  // No parentheses — the shaft is written inline.
  ['Jaws Forged 52°/56° Dynamic Gold S200', { spec: 'Jaws Forged 52°/56°', shaft: 'Dynamic Gold S200', flex: null }],
  ['Jaws Raw 54°/58° Dynamic Gold S200', { spec: 'Jaws Raw 54°/58°', shaft: 'Dynamic Gold S200', flex: null }],
  // No shaft named at all — must not invent one.
  ['Paradym 5W 18° R-flex', { spec: 'Paradym 5W 18°', shaft: null, flex: 'R' }],
  // A club noun trails the shaft name — anchoring strictly at end-of-string
  // meant every putter rendered an em dash in the Shaft column.
  ['Odyssey Tri-Beam Stroke Lab putter', { spec: 'Odyssey Tri-Beam', shaft: 'Stroke Lab', flex: null }],
  ['Odyssey White Hot Black Series Five Stroke Lab putter', { spec: 'Odyssey White Hot Black Series Five', shaft: 'Stroke Lab', flex: null }],
  // Flex written the way it is stamped on the Warbird shaft band.
  ['Warbird graphite S FLEX', { spec: 'Warbird graphite', shaft: null, flex: 'S' }],
  // Mid-sentence flex is prose, not a field — pulling it out left the mangled
  // "Steel shafts, throughout". It must stay put. (This string is a note and
  // never reaches the table, but the parser must not corrupt it regardless.)
  ['Steel shafts, Uniflex throughout', { spec: 'Steel shafts, Uniflex throughout', shaft: null, flex: null }],
]
for (const [input, expected] of SPLITS) {
  check(`split ${JSON.stringify(input)}`, splitClubPart(input), expected)
}
// Unrecognised text must survive intact rather than being emptied.
check('unparseable part keeps its text', splitClubPart('Grip: Golf Pride MCC'), {
  spec: 'Grip: Golf Pride MCC',
  shaft: null,
  flex: null,
})

// ── splitSpecEntry ────────────────────────────────────────────────────────
check('splits the left-handed authoring style', splitSpecEntry('Driver: TaylorMade RBZ 10.5° (Stiff)'), {
  label: 'Driver',
  value: 'TaylorMade RBZ 10.5° (Stiff)',
})
check('plain entry is not split', splitSpecEntry('Driver 10.5°'), null)
check('leading colon is not a label', splitSpecEntry(': orphan'), null)

if (failures > 0) {
  console.error(`\n✖ ${failures} club-spec parser check(s) failed`)
  process.exit(1)
}
console.log('✔ club-spec parsers: all checks passed')
