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

/**
 * PARTIAL-swap detection: the longest CONTIGUOUS run of script-bearing
 * characters that are foreign to this locale.
 *
 * The dominance rules below catch a WHOLE-slot swap and miss a partial one — a
 * Chinese first sentence with a correct Japanese tail outvotes itself. This
 * catches that, and it works because quoted foreign terms are SHORT while a
 * swapped sentence is long. Latin, digits and punctuation are skipped as
 * neutral: they appear legitimately in every locale (addresses, brand names,
 * yardages) and would otherwise break runs at random.
 *
 * Thresholds are measured against the whole shipped corpus, not guessed. Across
 * all 1,708 strings the longest legitimate foreign run is 0 for th/ko/zh and
 * 10 for ja (`高速道路国道号線経由`, an ordinary all-kanji phrase). So these
 * floors sit far above real copy and far below a swapped sentence.
 *
 * CAVEAT if this is ever pointed at messages/*.json: that corpus DOES contain
 * deliberate cross-script strings — `directions.grabTip` prints the venue name
 * in Thai inside ja/ko/zh copy so a reader can show it to a taxi driver, and
 * `스크린골프` is quoted as a term of art in th/zh. Re-measure before reusing
 * these numbers there.
 */
const FOREIGN_RUN_MAX: Record<Loc, number> = { th: 12, ko: 12, zh: 12, ja: 25 }

const SCRIPT = {
  thai: (c: string) => /[\u0e00-\u0e7f]/.test(c),
  hangul: (c: string) => /[\uac00-\ud7af\u1100-\u11ff]/.test(c),
  kana: (c: string) => /[\u3040-\u30ff]/.test(c),
  han: (c: string) => /[\u4e00-\u9fff]/.test(c),
}
const bearing = (c: string) =>
  SCRIPT.thai(c) || SCRIPT.hangul(c) || SCRIPT.kana(c) || SCRIPT.han(c)

/** Is this character foreign to `loc`? (Han is legal in ja — handled separately.) */
const isForeign: Record<Loc, (c: string) => boolean> = {
  th: (c) => SCRIPT.han(c) || SCRIPT.hangul(c) || SCRIPT.kana(c),
  ko: (c) => SCRIPT.han(c) || SCRIPT.kana(c) || SCRIPT.thai(c),
  zh: (c) => SCRIPT.kana(c) || SCRIPT.hangul(c) || SCRIPT.thai(c),
  ja: (c) => SCRIPT.hangul(c) || SCRIPT.thai(c),
}

function longestForeignRun(loc: Loc, s: string): { len: number; text: string } {
  let best = 0, cur = 0, bestTxt = '', curTxt = ''
  const push = (ok: boolean, ch: string) => {
    if (ok) { cur++; curTxt += ch; if (cur > best) { best = cur; bestTxt = curTxt } }
    else { cur = 0; curTxt = '' }
  }
  for (const ch of s) {
    // ja's partial-swap shape is a run of Han with NO kana in it: Han is legal
    // Japanese, so only the ABSENCE of kana over a long stretch is the signal.
    if (loc === 'ja') { if (SCRIPT.kana(ch)) { cur = 0; curTxt = '' } else if (SCRIPT.han(ch)) push(true, ch) ; continue }
    if (!bearing(ch)) continue
    push(isForeign[loc](ch), ch)
  }
  return { len: best, text: bestTxt }
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
  const run = longestForeignRun(loc, s)
  if (run.len >= FOREIGN_RUN_MAX[loc]) {
    return `${run.len}-character foreign-script run — suspected PARTIAL slot swap: "${run.text.slice(0, 40)}"`
  }
  return null
}

const regionArg = process.argv[2]
const slugArgs = process.argv.slice(3)

/**
 * The corpus is the REGISTRY, not the filesystem. A course with no locale
 * blocks is untranslated, not broken — censusing it would fail 88 times. A
 * course that IS in COURSE_DETAIL_I18N has promised exactly the locales ITS
 * OWN entry lists, and `dynamicParams = false` turns a missing one into a hard
 * 404 advertised by its own hreflang. So the registry is exactly the set where
 * a missing or wrong-script slot is a defect.
 *
 * Read each entry's `locales` array rather than assuming all four. The registry
 * type is `readonly CourseDetailLocale[]` and `getTranslatedCourseDetailParams()`
 * honours it, so a course registered for a subset builds correctly and passes
 * smoke J3. Hardcoding four here would fail it twice — once per "missing" block
 * and again on the anti-vacuity floor — which would make this gate stricter
 * than the contract it exists to enforce. Every entry happens to list all four
 * today; that is a fact about the data, not a rule.
 */
const registered: Array<{ region: string; slug: string; locales: readonly string[] }> =
  COURSE_DETAIL_I18N.map((c) => ({ region: c.region, slug: c.slug, locales: c.locales }))

const corpus = registered.filter(
  (c) =>
    (!regionArg || c.region === regionArg) && (slugArgs.length === 0 || slugArgs.includes(c.slug))
)

let problems = 0
let checked = 0
let slotsSeen = 0
let serpOnly = 0

async function main() {
  for (const { region, slug, locales: promised } of corpus) {
    const mod = await import(path.join(ROOT, 'data/golf-courses', region, `${slug}.ts`))
    const course = mod.course
    const locales = course.locales ?? {}
    const missing: string[] = []

    for (const loc of promised as readonly Loc[]) {
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
        // Legal, and documented on GolfCourseLocale.prose: a locale may ship
        // title + meta_description only ("SERP presence first, body later"),
        // and CoursePage falls back to the EN prose per field. Failing this
        // would block a legitimate SERP-first batch. What is NOT legal is a
        // prose object that is PRESENT but incomplete — that is the dead-builder
        // signature this gate exists for, and it is checked below.
        serpOnly++
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

  // Anti-vacuity with real numbers, not `> 0` (CLAUDE.md: a gate that cannot
  // fail is worse than no gate). Everything here is derived from what the
  // REGISTRY promised, so it cannot be satisfied by examining less.
  const expectedSlots = corpus.reduce((a, c) => a + c.locales.length, 0)
  const proseBlocks = slotsSeen - serpOnly
  // Exact, not a floor: 2 strings per slot (title + meta) plus 5 more for every
  // slot that ships prose. A miscount here means the loop skipped something.
  const expectedStrings = slotsSeen * 2 + proseBlocks * 5
  console.log(
    `\n${corpus.length} course(s) · ${slotsSeen}/${expectedSlots} locale slots present · ` +
      `${proseBlocks} with prose, ${serpOnly} title+meta only · ` +
      `${checked} strings script-checked · ${problems} problem(s)`
  )
  if (corpus.length === 0) {
    console.log('FAIL: empty corpus — nothing was examined')
    process.exit(1)
  }
  if (checked !== expectedStrings) {
    console.log(`FAIL: expected exactly ${expectedStrings} strings, examined ${checked}`)
    process.exit(1)
  }
  if (checked < expectedSlots * 2) {
    console.log(
      `FAIL: every registered slot owes at least a title and a meta_description — ` +
        `expected >= ${expectedSlots * 2} strings, examined ${checked}`
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
