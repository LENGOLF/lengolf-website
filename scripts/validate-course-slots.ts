/**
 * Per-slot script census for course-detail translations.
 *
 * Answers the question a diff CANNOT answer: is each locale's text actually in
 * that locale's language, and is every required field present and non-blank?
 *
 * Catches, by construction:
 *   - whole-slot swap (a zh paragraph landing in the `th` field)
 *   - a dead builder's partial block (th/ko written, ja absent)
 *   - whitespace-only / empty fields (which beat the EN fallback via `??`)
 *   - missing prose fields, or prose omitted entirely
 *
 * Usage: npm run validate:course-slots [-- <region> [slug ...]]
 *        (no args = every region with at least one translated course)
 */
import fs from 'node:fs'
import path from 'node:path'
import { COURSE_DETAIL_I18N } from '../data/golf-courses-i18n'

const ROOT = process.cwd()
const LOCALES = ['th', 'ko', 'zh', 'ja'] as const
const PROSE_FIELDS = [
  'overview',
  'layout_and_experience',
  'tips',
  'location_and_access',
  'rental_cta_context',
] as const

type Loc = (typeof LOCALES)[number]

const COUNTERS: Record<string, RegExp> = {
  thai: /[฀-๿]/g,
  hangul: /[가-힯ᄀ-ᇿ㄰-㆏]/g,
  kana: /[぀-ゟ゠-ヿ]/g,
  han: /[一-鿿]/g,
}

function count(s: string, re: RegExp) {
  return (s.match(new RegExp(re.source, 'g')) || []).length
}

/** Which scripts must NOT dominate a given locale's slot. */
function judge(loc: Loc, s: string): string | null {
  const thai = count(s, COUNTERS.thai)
  const hangul = count(s, COUNTERS.hangul)
  const kana = count(s, COUNTERS.kana)
  const han = count(s, COUNTERS.han)

  if (loc === 'th') {
    if (thai === 0) return `no Thai characters at all (han=${han} kana=${kana} hangul=${hangul})`
    // A quoted term of art in another script is fine; domination is not.
    if (han > thai) return `Han (${han}) outnumbers Thai (${thai}) — suspected zh text in a th slot`
    if (hangul > thai) return `Hangul (${hangul}) outnumbers Thai (${thai})`
  }
  if (loc === 'ko') {
    if (hangul === 0) return `no Hangul at all (han=${han} kana=${kana} thai=${thai})`
    if (han > hangul) return `Han (${han}) outnumbers Hangul (${hangul}) — suspected zh text in a ko slot`
    if (kana > 0 && kana > hangul) return `kana (${kana}) outnumbers Hangul (${hangul})`
  }
  if (loc === 'ja') {
    // Han is legal in Japanese, so dominance is BLIND to zh->ja. Kana is the
    // only discriminator — this mirrors checkScript's ja-only kana rule.
    if (kana === 0 && han >= 15) return `${han} kanji and ZERO kana — suspected zh text in a ja slot`
    if (kana === 0) return `no kana at all (han=${han})`
    if (hangul > 0) return `${hangul} Hangul characters in a ja slot`
    if (thai > 8 && thai > kana) return `Thai (${thai}) outnumbers kana (${kana})`
  }
  if (loc === 'zh') {
    if (han === 0) return `no Han characters at all (kana=${kana} hangul=${hangul} thai=${thai})`
    if (kana > 0) return `${kana} kana characters in a zh slot — suspected ja text`
    if (hangul > 0) return `${hangul} Hangul characters in a zh slot — suspected ko text`
    if (thai > 8 && thai > han) return `Thai (${thai}) outnumbers Han (${han})`
  }
  return null
}

const regionArg = process.argv[2]
const slugArgs = process.argv.slice(3)

/**
 * The corpus is the REGISTRY, not the filesystem. A course with no locale
 * blocks is untranslated, not broken — censusing it would fail 88 times. A
 * course that IS in COURSE_DETAIL_I18N has, by definition, promised four
 * locale blocks, and `dynamicParams = false` turns a missing one into a hard
 * 404 advertised by its own hreflang. So the registry is exactly the set where
 * a missing or wrong-script slot is a defect.
 */
const registered: Array<{ region: string; slug: string }> = COURSE_DETAIL_I18N.map((c) => ({
  region: c.region,
  slug: c.slug,
}))

const corpus = registered.filter(
  (c) =>
    (!regionArg || c.region === regionArg) && (slugArgs.length === 0 || slugArgs.includes(c.slug))
)

let problems = 0
let checked = 0
let slotsSeen = 0

async function main() {
  for (const { region, slug } of corpus) {
    const mod = await import(path.join(ROOT, 'data/golf-courses', region, `${slug}.ts`))
    const course = mod.course
    const locales = course.locales ?? {}
    const missing: string[] = []

    for (const loc of LOCALES) {
      const block = locales[loc]
      if (!block) {
        missing.push(loc)
        continue
      }
      slotsSeen++
      const fields: Array<[string, unknown]> = [
        ['title', block.title],
        ['meta_description', block.meta_description],
      ]
      if (!block.prose) {
        console.log(`  ✗ ${slug} [${loc}] prose ABSENT (title+meta only)`)
        problems++
      } else {
        for (const f of PROSE_FIELDS) fields.push([`prose.${f}`, block.prose[f]])
      }

      for (const [name, raw] of fields) {
        checked++
        if (typeof raw !== 'string') {
          console.log(`  ✗ ${slug} [${loc}] ${name}: not a string (${raw === undefined ? 'MISSING' : typeof raw})`)
          problems++
          continue
        }
        if (raw.trim() === '') {
          console.log(`  ✗ ${slug} [${loc}] ${name}: EMPTY/whitespace-only — beats the EN fallback via ??`)
          problems++
          continue
        }
        const verdict = judge(loc, raw)
        if (verdict) {
          console.log(`  ✗ ${slug} [${loc}] ${name}: ${verdict}`)
          console.log(`      ${raw.slice(0, 90)}…`)
          problems++
        }
      }
    }
    if (missing.length) {
      console.log(`  ✗ ${slug}: locale block(s) MISSING/null: ${missing.join(', ')}`)
      problems += missing.length
    }
  }

  // Anti-vacuity floors with real numbers, not `> 0` (CLAUDE.md: a gate that
  // cannot fail is worse than no gate).
  const expectedSlots = corpus.length * LOCALES.length
  console.log(
    `\n${corpus.length} course(s) · ${slotsSeen}/${expectedSlots} locale slots present · ${checked} strings script-checked · ${problems} problem(s)`
  )
  if (corpus.length === 0) {
    console.log('FAIL: empty corpus — nothing was examined')
    process.exit(1)
  }
  if (checked < corpus.length * LOCALES.length * 7) {
    console.log(
      `FAIL: expected ${corpus.length * LOCALES.length * 7} strings (7 per locale slot), examined ${checked}`
    )
    process.exit(1)
  }
  if (problems > 0) process.exit(1)
  console.log('OK — every slot is present, non-blank, and in its own script')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
