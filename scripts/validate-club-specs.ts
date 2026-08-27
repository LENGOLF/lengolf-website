/**
 * Validate the club spec-sheet parsers (lib/club-specs.ts).
 *
 * These turn free-text, staff-authored `rental_club_sets.variants[].spec`
 * strings into the table on /golf-club-specs. Nobody edits this file when they
 * re-word a spec in the DB, so the failure mode is silent: a club quietly moves
 * to the wrong row, or the whole matrix collapses into a note. The cases below
 * pin the live strings plus the near-miss phrasings that already broke the
 * classifier once during review.
 *
 * KNOW WHAT THIS DOES NOT DO. These are FIXTURES — copies of the DB strings,
 * with no database access. Nothing here notices when production diverges from
 * them, and it has: the two Warbird cases sat asserting a prose shape for weeks
 * after that set was rewritten to club lists, while this script stayed green.
 * A fixture that has drifted still passes and quietly describes a product that
 * no longer exists, so re-copy them when you re-word a spec.
 *
 * Run: npm run validate:club-specs
 */
import { readFileSync } from 'node:fs'
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
  ['Ai Smoke 10.5° 50g R-flex (Mitsubishi Chemical)', 'driver'],
  ['Paradym 10.5° 50g R-flex (Fujikura Ventus)', 'driver'],
  ['Paradym 3W 15° + 5W 18° 50g SR-flex (Fujikura Ventus)', 'wood'],
  ['Paradym 5W 18° 50g R-flex (Fujikura Ventus)', 'wood'],
  ['irons 6-P steel S-flex ~78g (Nippon N.S. Pro Zelos 7)', 'irons'],
  ['irons 6-P graphite 50g R-flex (Fujikura Ventus)', 'irons'],
  ['Jaws Forged 52°/56° Dynamic Gold S200', 'wedges'],
  ['Jaws Raw 54°/58° Dynamic Gold S200', 'wedges'],
  ['Odyssey Tri-Beam 70g (Stroke Lab)', 'putter'],
  ['Odyssey White Hot Black Series Five 70g (Stroke Lab)', 'putter'],
]

// Phrasings that are one DB edit away. Each of these misclassified before the
// rule order was fixed — they are regressions, not hypotheticals.
const NEAR_MISS: [string, SpecRow][] = [
  // `\biron` used to outrank the wedge test, so a wedge naming its iron bag
  // was filed under Irons and the Wedges row rendered as empty.
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
  'Ai Smoke 10.5° 50g R-flex (Mitsubishi Chemical) · Paradym 3W 15° + 5W 18° 50g SR-flex (Fujikura Ventus) · irons 6-P steel S-flex ~78g (Nippon N.S. Pro Zelos 7) · Jaws Forged 52°/56° Dynamic Gold S200 · Odyssey Tri-Beam 70g (Stroke Lab)'
const parsed = parseVariantSpec(paradymSteel)
check('paradym steel row order', parsed?.map((p) => p.row), ['driver', 'wood', 'irons', 'wedges', 'putter'])
check(
  'paradym steel strips the redundant Irons noun',
  parsed?.find((p) => p.row === 'irons')?.text,
  '6-P steel S-flex ~78g (Nippon N.S. Pro Zelos 7)'
)

// A string with NO separator is a free-text note, not a club list. Parsing one
// into rows would file the whole sentence under Driver and lose the rest.
//
// These two are the Warbird's RETIRED prose specs, kept as regression cases
// rather than as a description of the product: prose authoring is still a
// supported style, so the note branch must keep working. Do not read them as
// current — the Warbird was rewritten to `·`-separated club lists (below), and
// no live variant renders as a note today.
check(
  'retired prose spec stays a note (graphite)',
  parseVariantSpec('Graphite shafts, R-flex throughout (driver, 5-wood and irons)'),
  null
)
check(
  'retired prose spec stays a note (steel)',
  parseVariantSpec('Steel shafts, Uniflex throughout'),
  null
)
check('empty spec is a note', parseVariantSpec(null), null)
check('single separated part is not a matrix', parseVariantSpec('Driver 10.5° · '), null)

// The CURRENT Warbird strings. These are what the sheet actually renders, and
// they were entirely uncovered until the em-dash pass went looking: every LIVE
// fixture in this file is a Paradym part. Both variants must yield a 5-row
// matrix, and the steel one must keep its two DIFFERENT flexes — S in the
// woods, Uniflex in the irons — which is the distinction a customer books on.
const WARBIRD_STEEL =
  'driver 10.5° S-flex (Callaway Warbird) · 5-Wood S-flex (Callaway Warbird) · irons 5-9 steel Uniflex (Callaway Warbird) · PW + SW steel Uniflex (Callaway Warbird) · Odyssey White Hot Pro 1'
const WARBIRD_GRAPHITE =
  'driver 10.5° R-flex (Callaway Warbird) · 5-Wood R-flex (Callaway Warbird) · irons 5-9 graphite R-flex (Callaway Warbird) · PW + SW graphite R-flex (Callaway Warbird) · Odyssey White Hot Pro 1'

check(
  'warbird steel renders a matrix, not a note',
  parseVariantSpec(WARBIRD_STEEL)?.map((p) => p.row),
  ['driver', 'wood', 'irons', 'wedges', 'putter']
)
check(
  'warbird graphite renders a matrix, not a note',
  parseVariantSpec(WARBIRD_GRAPHITE)?.map((p) => p.row),
  ['driver', 'wood', 'irons', 'wedges', 'putter']
)
// PW/SW must land in Wedges, not Irons. `\bsw\b` inside an irons segment would
// drag the whole row across, which is why the DB string splits them out.
check(
  'warbird steel keeps woods stiff and irons uniflex',
  parseVariantSpec(WARBIRD_STEEL)?.map((p) => splitClubPart(p.text).flex),
  ['S', 'S', 'Uniflex', 'Uniflex', null]
)
check(
  'warbird graphite is R throughout',
  parseVariantSpec(WARBIRD_GRAPHITE)?.map((p) => splitClubPart(p.text).flex),
  ['R', 'R', 'R', 'R', null]
)
// The putter is the only part with no shaft, weight or flex — three empty cells
// in one row, which is what made the old em-dash filler conspicuous.
check(
  'warbird putter reports every fact as absent',
  (() => {
    const putter = parseVariantSpec(WARBIRD_STEEL)!.at(-1)!
    const { shaft, weight, flex } = splitClubPart(putter.text)
    return { shaft, weight, flex }
  })(),
  { shaft: null, weight: null, flex: null }
)

// ── stripRowNoun ──────────────────────────────────────────────────────────
check('strips leading noun', stripRowNoun('irons 6-P steel', 'irons'), '6-P steel')
check('strips colon form', stripRowNoun('Irons: 6-P steel', 'irons'), '6-P steel')
// A cell that is nothing BUT its noun must keep its text rather than go blank.
// The trailing space matters and is the whole point: 'irons' alone never
// matches the pattern (it requires a separator after the noun), so it exercises
// nothing. 'irons ' DOES match, strips to empty, and is the only input that
// reaches the `out.length > 0 ? out : text` fallback. Mutation testing caught
// this — with only the spaceless case, deleting that fallback stayed green.
check('noun-only text survives', stripRowNoun('irons', 'irons'), 'irons')
check('noun-plus-space does not blank the cell', stripRowNoun('irons ', 'irons'), 'irons ')
check('noun-plus-colon does not blank the cell', stripRowNoun('Irons: ', 'irons'), 'Irons: ')
check('wedge noun-only does not blank the cell', stripRowNoun('wedges  ', 'wedges'), 'wedges  ')
check('non-leading occurrence untouched', stripRowNoun('Jaws matched to iron shafts', 'wedges'), 'Jaws matched to iron shafts')
check('row without a noun rule is untouched', stripRowNoun('Callaway tour bag', 'bag'), 'Callaway tour bag')

// ── splitClubPart (shaft / flex columns) ──────────────────────────────────
// Every live Paradym club, decomposed the way the table renders it.
const SPLITS: [string, { spec: string; shaft: string | null; flex: string | null; weight: string | null }][] = [
  // The live strings AFTER the owner's sheets were transcribed (weights added,
  // graphite 5-wood shaft restored).
  ['Ai Smoke 10.5° 50g R-flex (Mitsubishi Chemical)', { spec: 'Ai Smoke 10.5°', shaft: 'Mitsubishi Chemical', flex: 'R', weight: '50g' }],
  ['Paradym 3W 15° + 5W 18° 50g SR-flex (Fujikura Ventus)', { spec: 'Paradym 3W 15° + 5W 18°', shaft: 'Fujikura Ventus', flex: 'SR', weight: '50g' }],
  ['Paradym 10.5° 50g R-flex (Fujikura Ventus)', { spec: 'Paradym 10.5°', shaft: 'Fujikura Ventus', flex: 'R', weight: '50g' }],
  ['Paradym 5W 18° 50g R-flex (Fujikura Ventus)', { spec: 'Paradym 5W 18°', shaft: 'Fujikura Ventus', flex: 'R', weight: '50g' }],
  ['6-P graphite 50g R-flex (Fujikura Ventus)', { spec: '6-P graphite', shaft: 'Fujikura Ventus', flex: 'R', weight: '50g' }],
  // The steel irons carry the shaft MAKER'S published figure, marked with a
  // leading ~ so it reads differently from the owner's measured 50g. The wedge
  // sets still have neither and must stay blank.
  ['6-P steel S-flex ~78g (Nippon N.S. Pro Zelos 7)', { spec: '6-P steel', shaft: 'Nippon N.S. Pro Zelos 7', flex: 'S', weight: '~78g' }],
  ['Jaws Forged 52°/56° Dynamic Gold S200', { spec: 'Jaws Forged 52°/56°', shaft: 'Dynamic Gold S200', flex: null, weight: null }],
  ['Jaws Raw 54°/58° Dynamic Gold S200', { spec: 'Jaws Raw 54°/58°', shaft: 'Dynamic Gold S200', flex: null, weight: null }],
  // Putters: weight and shaft, no flex.
  ['Odyssey Tri-Beam 70g (Stroke Lab)', { spec: 'Odyssey Tri-Beam', shaft: 'Stroke Lab', flex: null, weight: '70g' }],
  ['Odyssey White Hot Black Series Five 70g (Stroke Lab)', { spec: 'Odyssey White Hot Black Series Five', shaft: 'Stroke Lab', flex: null, weight: '70g' }],
  // Mid-sentence flex is prose and must stay put — an unanchored match left
  // the mangled 'Steel shafts, throughout'.
  ['Steel shafts, Uniflex throughout', { spec: 'Steel shafts, Uniflex throughout', shaft: null, flex: null, weight: null }],
]
for (const [input, expected] of SPLITS) {
  check(`split ${JSON.stringify(input)}`, splitClubPart(input), expected)
}
// Unrecognised text must survive intact rather than being emptied.
check('unparseable part keeps its text', splitClubPart('Grip: Golf Pride MCC'), {
  spec: 'Grip: Golf Pride MCC',
  shaft: null,
  flex: null,
  weight: null,
})

// ── splitSpecEntry ────────────────────────────────────────────────────────
check('splits the left-handed authoring style', splitSpecEntry('Driver: TaylorMade RBZ 10.5° (Stiff)'), {
  label: 'Driver',
  value: 'TaylorMade RBZ 10.5° (Stiff)',
})
check('plain entry is not split', splitSpecEntry('Driver 10.5°'), null)
check('leading colon is not a label', splitSpecEntry(': orphan'), null)

// ── no em dash in the sheet's customer-facing copy ────────────────────────
//
// U+2014 is not house style here. It lived in this page for months as the
// filler for a value-less cell and in three ClubSpecs strings, and NOTHING
// caught it: `validate-i18n` reads only ja/ko/zh/th (English is not in its
// corpus at all, and those three locales have no ClubSpecs namespace), and
// ESLint is bare `next/core-web-vitals`. So the rule lives here, next to the
// feature it governs.
//
// Deliberately scoped to ClubSpecs. Roughly 100 en / 80 th strings across 23
// other namespaces still contain em dashes; widening this before those are
// swept would just paint the build red. Treat the scope as a ratchet: add a
// namespace once it is clean, never remove one.
const EM_DASH = '—'

for (const locale of ['en', 'th'] as const) {
  const catalog = JSON.parse(
    readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), 'utf8')
  ) as Record<string, Record<string, unknown>>
  const offenders = Object.entries(catalog.ClubSpecs ?? {})
    .filter(([, v]) => typeof v === 'string' && v.includes(EM_DASH))
    .map(([k]) => k)
  check(`no em dash in ClubSpecs (${locale})`, offenders, [])
}

// The page's own literals — alt text, the sr-only caption, the cell filler.
// Comments are stripped first: this file documents its own history and says
// "em dash" in prose, which is not a copy defect. The strip is a heuristic
// (it does not parse strings containing comment markers), so treat a failure
// as real and a pass as good-but-not-proof.
const pageSource = readFileSync(
  new URL('../app/[locale]/golf-club-specs/page.tsx', import.meta.url),
  'utf8'
)
const withoutComments = pageSource
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^[ \t]*\/\/.*$/gm, '')
check('no em dash in page.tsx outside comments', withoutComments.includes(EM_DASH), false)

if (failures > 0) {
  console.error(`\n✖ ${failures} club-spec parser check(s) failed`)
  process.exit(1)
}
console.log('✔ club-spec parsers: all checks passed')
