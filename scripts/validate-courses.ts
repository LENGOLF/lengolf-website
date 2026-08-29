/**
 * Golf-course data plausibility validator — `npm run validate:courses`.
 *
 * Born from a real incident: Artitaya Country Club shipped with a ฿400
 * weekday green fee — a scraped Thai-national/promo rate presented as the
 * standard visitor rate. Fees are the single most-read fact on the 149
 * course pages (hero, sidebar, FAQ, JSON-LD offers), so implausible values
 * must not ship silently.
 *
 * ERROR (exit 1):
 *  - weekday or weekend green fee below the absolute floor (฿150) or absurd
 *    ceiling (฿20,000)
 *  - weekend fee LOWER than weekday (does not happen in the Thai market;
 *    flat rates are fine)
 *  - suspicious-pattern fees (see WARN rules) on a course with NO
 *    `fees_verified_at` attestation — unverified suspicious data fails CI
 *  - malformed `fees_verified_at` (not YYYY-MM-DD)
 *  - REGION_META.courseCount disagreeing with the region's index.ts slugs
 *    (what actually renders), or an index slug with no file / a file with
 *    no index slug. courseCount is hand-maintained and now selects an ICU
 *    plural branch as well as printing a number — see checkRegionCounts
 *
 * WARN (non-blocking) when `fees_verified_at` IS present:
 *  - weekday fee under ฿600 (genuinely possible: EGAT dam courses, army
 *    9-holers — but every one must be human-verified)
 *  - weekend more than 2.2× weekday
 *  - `fees_verified_at` older than 18 months (rates drift; re-check)
 *
 * Coordinates, after a course page shipped a satellite pin several km from
 * the course:
 *  - ERROR: coordinates outside Thailand's bounding box, only one of
 *    lat/lng set, or a malformed `coordinates_verified_at`
 *  - WARN: rounded to <3 decimal places (~1.1 km — a district centroid).
 *    Only a warning because `hasTrustedCoordinates` (lib/geo.ts) already
 *    withholds those from the map pin and from schema GeoCoordinates, so the
 *    bad number never reaches a reader; it stays usable for proximity
 *    ranking. Clear the debt with `npm run verify:coordinates`.
 *
 * No server needed. Zero deps beyond tsx.
 */

import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import type { GolfCourse } from '../types/golf-courses'
import { decimalPlaces, MIN_COORD_DECIMALS } from '../lib/geo'
import { runSelfTest } from './self-test-harness'
import { loadCourseFiles } from './course-files'
import { getCourseTitle, type CourseSeoLocale } from '../lib/course-seo'

const LOW_FEE_THRESHOLD = 600
const ABS_FLOOR = 150
const ABS_CEILING = 20000
const WEEKEND_JUMP_RATIO = 2.2
const STALE_MONTHS = 18
const COORD_STALE_MONTHS = 36
// Thailand's bounding box, generously padded.
const TH_BOUNDS = { latMin: 5.5, latMax: 20.6, lngMin: 97.2, lngMax: 105.7 }

const errors: string[] = []
const warnings: string[] = []


function monthsSince(iso: string): number {
  const then = new Date(`${iso}T00:00:00Z`).getTime()
  return (Date.now() - then) / (1000 * 60 * 60 * 24 * 30.44)
}


/** Coordinates drive the satellite pin, schema GeoCoordinates and the maps link. */
function checkCoordinates(file: string, c: GolfCourse) {
  const { latitude: lat, longitude: lng } = c
  const attested = c.coordinates_verified_at ?? null

  if (attested !== null && !/^\d{4}-\d{2}-\d{2}$/.test(attested)) {
    errors.push(`${file}: coordinates_verified_at "${attested}" is not YYYY-MM-DD`)
    return
  }
  if (lat === null || lng === null) {
    if (lat !== null || lng !== null) {
      errors.push(`${file}: latitude/longitude must both be set or both be null`)
    }
    return
  }
  if (
    lat < TH_BOUNDS.latMin || lat > TH_BOUNDS.latMax ||
    lng < TH_BOUNDS.lngMin || lng > TH_BOUNDS.lngMax
  ) {
    errors.push(`${file}: coordinates ${lat},${lng} fall outside Thailand`)
    return
  }

  const dp = Math.min(decimalPlaces(lat), decimalPlaces(lng))
  // Same threshold hasTrustedCoordinates enforces at render time (lib/geo.ts),
  // so this warning always describes what the site actually publishes.
  if (dp < MIN_COORD_DECIMALS && attested === null) {
    // WARN, not ERROR: `hasTrustedCoordinates` already withholds these from
    // the satellite pin and from schema.org GeoCoordinates, so nothing wrong
    // reaches a reader. They remain usable for proximity ranking, where a
    // ±1 km error is immaterial across 20–60 km. This is tracked debt, and
    // `npm run verify:coordinates` clears it in one pass.
    const err = dp === 0 ? '111 km' : dp === 1 ? '11 km' : '1.1 km'
    warnings.push(
      `${file}: coordinates ${lat},${lng} rounded to ${dp}dp (±${err}) — map pin and schema geo suppressed; run \`npm run verify:coordinates\``
    )
  }
  if (attested !== null && monthsSince(attested) > COORD_STALE_MONTHS) {
    warnings.push(`${file}: coordinates_verified_at ${attested} is over ${COORD_STALE_MONTHS} months old`)
  }
}

/**
 * REGION_META.courseCount vs what the region hub actually renders.
 *
 * courseCount is hand-maintained and drives real output: the hub's meta
 * description, its hero card, the OG card chip — and, since the count/noun
 * work, WHICH ICU PLURAL BRANCH renders. A stale count no longer just prints
 * a wrong number; it commits the sentence to the wrong grammatical form
 * ("Our guide to 1 golf course in Krabi" above two cards).
 *
 * THREE sources of truth exist and they must agree:
 *   1. REGION_META.courseCount  — the advertised number.
 *   2. data/golf-courses/<region>/index.ts `slugs` — what
 *      getCoursesByRegion() maps over, i.e. what actually RENDERS as cards
 *      and what generateStaticParams builds. Note it does NOT filter by
 *      `status`, so a draft still renders.
 *   3. The .ts files on disk — what a course author edits.
 * Checking (1) against (3) alone is not enough: a re-region that moves the
 * file and updates courseCount but forgets index.ts leaves 1 and 3 agreeing
 * while the hub renders a different number of cards. That is precisely the
 * shape of the kumlung-ake move in this PR, where both index.ts files had to
 * be hand-edited. So compare 1↔2 (the user-visible claim) and 2↔3 (orphans).
 *
 * Parsed out of the source text rather than imported: lib/golf-courses.ts is
 * `import 'server-only'` and throws under plain tsx (same constraint that
 * forced the hardcoded list in the smoke test).
 */
async function checkRegionCounts(courses: { file: string; course: GolfCourse }[]) {
  // Normalise CRLF first: git checks this repo out with native line endings
  // on Windows, and fs.readFileSync does not translate them, so anchors like
  // `\n}` would silently never match and the guard would report itself blind.
  const src = fs
    .readFileSync(path.join(__dirname, '..', 'lib', 'golf-courses.ts'), 'utf8')
    .replace(/\r\n/g, '\n')
  const meta = src.match(/export const REGION_META[^=]*=\s*\{([\s\S]*?)\n\}\n/)
  if (!meta) {
    errors.push('lib/golf-courses.ts: could not parse REGION_META (courseCount guard is blind)')
    return
  }

  // Two distinct things, kept apart on purpose:
  //   metaRegions — every region block REGION_META declares.
  //   declared    — those whose `courseCount` line the anchor could read.
  // They used to be one map, so a region whose count line failed the anchor
  // (re-indented, reformatted, trailing comma dropped) vanished from the guard
  // ENTIRELY and the only symptom was the final loop below announcing
  // "<region>/ has course files but no REGION_META entry" — a flatly false
  // message pointing at the wrong file. Worse, a region with an unparseable
  // count AND an empty directory produced no message at all. Keying the
  // "no REGION_META entry" check off metaRegions makes that message true
  // again, and an unreadable count is now reported as what it is.
  const metaRegions = new Set<string>()
  const declared = new Map<string, number>()
  for (const m of meta[1].matchAll(/^ {2}'?([a-z-]+)'?:\s*\{([\s\S]*?)^ {2}\},/gm)) {
    metaRegions.add(m[1])
    // Strip line comments before reading the value. REGION_META blocks carry
    // prose comments (this PR added one to `isan`), and a comment mentioning
    // `courseCount: N` would otherwise be read as the value — the guard would
    // then validate a number that does not render, and pass.
    const body = m[2].replace(/^[ \t]*\/\/.*$/gm, '')
    const count = body.match(/^ {4}courseCount:\s*(\d+),/m)
    if (count) declared.set(m[1], Number(count[1]))
    else {
      errors.push(
        `lib/golf-courses.ts: REGION_META.${m[1]} parsed, but no \`courseCount: <n>,\` line matched the /^ {4}courseCount:\\s*(\\d+),/ anchor — re-indented or reformatted? Its count is currently unchecked`
      )
    }
  }
  if (metaRegions.size === 0) {
    errors.push('lib/golf-courses.ts: REGION_META parsed to zero regions (courseCount guard is blind)')
    return
  }
  // Belt and braces over the per-region errors above: if these two ever
  // disagree, some region is going unchecked, whatever the reason.
  if (declared.size !== metaRegions.size) {
    errors.push(
      `lib/golf-courses.ts: ${metaRegions.size} REGION_META block(s) parsed but only ${declared.size} yielded a courseCount — ${metaRegions.size - declared.size} region(s) unchecked (see the per-region error(s) above)`
    )
  }
  // (2) index.ts slugs — the rendered set. Imported the same way
  // lib/golf-courses.ts imports it, so this cannot drift from the runtime.
  // Driven by metaRegions, not declared: a region with an unreadable count
  // still gets its slug↔file orphan checks.
  const rendered = new Map<string, string[]>()
  for (const region of metaRegions) {
    const abs = path.join(__dirname, '..', 'data', 'golf-courses', region, 'index.ts')
    if (!fs.existsSync(abs)) {
      errors.push(`data/golf-courses/${region}/index.ts is missing — the hub would render zero cards`)
      continue
    }
    const mod = await import(pathToFileURL(abs).href)
    const slugs: string[] = (mod.default ?? mod).slugs ?? []
    rendered.set(region, slugs)
  }

  // (3) files on disk, keyed by DIRECTORY not course.region: the directory is
  // what builds the URL, so a file in the wrong folder must not be masked by
  // a correct `region` field.
  const onDisk = new Map<string, Set<string>>()
  for (const { file } of courses) {
    const [region, base] = file.split('/')
    if (!onDisk.has(region)) onDisk.set(region, new Set())
    onDisk.get(region)!.add(base.replace(/\.ts$/, ''))
  }

  for (const region of metaRegions) {
    const slugs = rendered.get(region)
    if (!slugs) continue
    // 1 ↔ 2: the advertised number vs the cards that render. Skipped (already
    // reported above) when the count line could not be read.
    const count = declared.get(region)
    if (count !== undefined && slugs.length !== count) {
      errors.push(
        `lib/golf-courses.ts: REGION_META.${region}.courseCount is ${count} but data/golf-courses/${region}/index.ts lists ${slugs.length} slug(s) — the hub advertises a number it does not render, and may pick the wrong ICU plural branch`
      )
    }
    // 2 ↔ 3: a slug with no file renders nothing; a file with no slug is dead.
    const files = onDisk.get(region) ?? new Set<string>()
    for (const slug of slugs) {
      if (!files.has(slug)) {
        errors.push(`data/golf-courses/${region}/index.ts lists "${slug}" but no such course file exists`)
      }
    }
    for (const f of files) {
      if (!slugs.includes(f)) {
        errors.push(`data/golf-courses/${region}/${f}.ts exists but is not listed in that region's index.ts — it will never render`)
      }
    }
  }
  for (const region of onDisk.keys()) {
    if (!metaRegions.has(region)) {
      errors.push(`data/golf-courses/${region}/ has course files but no REGION_META entry`)
    }
  }
}

async function main() {
  const courses = await loadCourseFiles()
  await checkRegionCounts(courses)

  for (const { file, course: c } of courses) {
    const wd = c.green_fee_weekday_thb
    const we = c.green_fee_weekend_thb
    const verified = c.fees_verified_at ?? null

    checkCoordinates(file, c)

    if (verified !== null && !/^\d{4}-\d{2}-\d{2}$/.test(verified)) {
      errors.push(`${file}: fees_verified_at "${verified}" is not YYYY-MM-DD`)
      continue
    }

    // Closed courses must not advertise green fees, and must explain
    // themselves — the banner/FAQ copy comes from operational_note.
    const status = c.operational_status ?? 'open'
    if (status !== 'open') {
      if (wd != null || we != null) {
        errors.push(`${file}: operational_status "${status}" but green fees are set — null the fees, a closed course must not advertise rates`)
      }
      if (!c.operational_note) {
        errors.push(`${file}: operational_status "${status}" requires an operational_note (closure banner + FAQ copy)`)
      }
      continue
    }

    for (const [label, fee] of [['weekday', wd], ['weekend', we]] as const) {
      if (fee !== null && fee !== undefined && (fee < ABS_FLOOR || fee > ABS_CEILING)) {
        errors.push(`${file}: ${label} green fee ฿${fee} outside sane bounds [${ABS_FLOOR}, ${ABS_CEILING}]`)
      }
    }

    if (wd != null && we != null && we < wd) {
      errors.push(`${file}: weekend fee ฿${we} < weekday ฿${wd} — weekend is never cheaper in the Thai market`)
    }

    const suspicious: string[] = []
    if (wd != null && wd < LOW_FEE_THRESHOLD) {
      suspicious.push(`weekday fee ฿${wd} < ฿${LOW_FEE_THRESHOLD} (typical scraped Thai-national/9-hole/promo rate)`)
    }
    if (wd != null && we != null && we > WEEKEND_JUMP_RATIO * wd) {
      suspicious.push(`weekend ฿${we} > ${WEEKEND_JUMP_RATIO}x weekday ฿${wd}`)
    }

    if (suspicious.length > 0) {
      if (verified === null) {
        for (const s of suspicious) {
          errors.push(`${file}: ${s} and no fees_verified_at attestation — verify against a live source, fix the fee (or null it), then set fees_verified_at`)
        }
      } else {
        for (const s of suspicious) {
          warnings.push(`${file}: ${s} (attested ${verified})`)
        }
      }
    }

    if (verified !== null && monthsSince(verified) > STALE_MONTHS) {
      warnings.push(`${file}: fees_verified_at ${verified} is over ${STALE_MONTHS} months old — re-check rates`)
    }
  }

  checkPackageNoun(courses)

  for (const w of warnings) console.log(`  ⚠ ${w}`)
  for (const e of errors) console.log(`  ✖ ${e}`)

  if (errors.length > 0) {
    console.log(`\n❌ validate-courses: ${errors.length} error(s) across ${courses.length} courses (${warnings.length} warning(s))`)
    process.exit(1)
  }
  console.log(`\n✅ validate-courses: ${courses.length} courses pass fee-plausibility checks (${warnings.length} non-blocking warning(s))`)
}

/**
 * A `fee_is_package` course's TITLE must not call its rate a green fee.
 *
 * Scoped to the title ON PURPOSE, and the scoping is the whole design. These
 * courses' meta descriptions and prose legitimately contain the green-fee term,
 * because they ENUMERATE what the package covers — "800 THB all-in (green fee,
 * caddie & cart)" is true and is the most useful sentence on the page. A blanket
 * "no green-fee term on a package course" rule would fire on all ten of those
 * and get switched off. The title is different: it labels the page's price with
 * a bare noun and no room for a qualifier.
 *
 * Both package courses shipped all five titles with the noun — the ko one read
 * `그린피` and `올인클루시브` in the same string — while the fee FAQ and the meta
 * fee line were correctly suppressed. That is the "enumerated field-by-field or
 * not at all" failure, on the single most prominent field: the title is also the
 * openGraph title and the internal cross-link anchor text via lib/seo-links.
 *
 * Checks the RENDERED title (`getCourseTitle`), not the stored one, because EN
 * comes from a generator and the non-EN blocks are returned verbatim.
 */
const PACKAGE_NOUN_RE: Record<CourseSeoLocale, RegExp> = {
  // Every form must be listed, because this regex and `getCourseTitle`'s rewrite
  // branch are NOT independent layers — the branch used the same `/green fee/i`,
  // so a hand-written `Greenfee` or `Green-Fee` defeated both at once and shipped
  // verbatim. Measured by mutation, not assumed.
  en: /green[\s-]?fees?/i,
  // th: `กรีนฟี` is the bare noun and the glossary's own term; `ค่ากรีนฟี` only
  // adds the "cost of" prefix, so matching the prefixed form alone missed
  // `กรีนฟี 800 บาท` — literally "green fee 800 baht" over an all-in package.
  th: /กรีนฟี/,
  // ja: `グリーン費` is the mixed katakana+kanji form; zh: `果嶺費` is Traditional.
  ja: /グリーンフィ|グリーン費/,
  ko: /그린\s?피/,
  zh: /果岭费|果嶺費/,
}

function checkPackageNoun(courses: { file: string; course: GolfCourse }[]) {
  let checked = 0
  let packages = 0
  for (const { file, course } of courses) {
    if (!course.fee_is_package) continue
    packages++
    for (const locale of Object.keys(PACKAGE_NOUN_RE) as CourseSeoLocale[]) {
      if (locale !== 'en' && !course.locales[locale]?.title) continue
      checked++
      const title = getCourseTitle(course, locale)
      if (PACKAGE_NOUN_RE[locale].test(title)) {
        errors.push(
          `${file}: fee_is_package course's ${locale} TITLE calls the rate a green fee — ` +
            `the price already covers the caddie and cart, so the noun tells a searcher ` +
            `they are extra. Title: "${title}"`
        )
      }
    }
  }
  // Anti-vacuity, and the FIRST version got it wrong in the exact way CLAUDE.md
  // warns about: `packages > 0 && …` self-disarms. Delete `fee_is_package` from
  // every flagged course and the whole check evaluates zero titles, exits 0 — while the
  // rendered EN title silently regresses to "— Green Fees & Guide". The flag is
  // optional on the type, so the deletion compiles. Needs an ABSOLUTE floor with
  // a real number, which is the rule this guard was added to enforce.
  const MIN_PACKAGE_COURSES = 10
  if (packages < MIN_PACKAGE_COURSES) {
    errors.push(
      `package-noun check found only ${packages} fee_is_package course(s), expected at least ` +
        `${MIN_PACKAGE_COURSES} — the flag was removed, or this ratchet needs a deliberate edit`
    )
  }
  if (checked < packages * 5) {
    errors.push(
      `package-noun check examined only ${checked} title(s) across ${packages} package ` +
        `course(s) — expected ${packages * 5}. A locale block stopped being read.`
    )
  }
}

/**
 * `--self-test`. `checkPackageNoun` fires on ZERO lines in healthy data, so a
 * green corpus run is not evidence it works — deleting its call, neutering
 * PACKAGE_NOUN_RE, or reinstating the `packages > 0 &&` self-disarm all pass
 * silently. It is also the only gate catching this branch's headline defect.
 */
const NOUN_SELF_TESTS: Array<{ name: string; locale: CourseSeoLocale; title: string; fire: boolean }> = [
  { name: 'en bare noun', locale: 'en', title: 'X — Green Fees & Guide', fire: true },
  { name: 'en closed form', locale: 'en', title: 'X — Greenfee & Guide', fire: true },
  { name: 'en hyphenated', locale: 'en', title: 'X — Green-Fee & Guide', fire: true },
  { name: 'th prefixed', locale: 'th', title: 'X — ค่ากรีนฟี รีวิวสนาม', fire: true },
  { name: 'th BARE (glossary term)', locale: 'th', title: 'X — กรีนฟี 800 บาท', fire: true },
  { name: 'ja katakana', locale: 'ja', title: 'X — グリーンフィー・コース紹介', fire: true },
  { name: 'ja mixed kanji', locale: 'ja', title: 'X — グリーン費・コース紹介', fire: true },
  { name: 'ko spaced', locale: 'ko', title: 'X 그린 피 — 코스 가이드', fire: true },
  { name: 'ko closed', locale: 'ko', title: 'X 그린피 — 코스 가이드', fire: true },
  { name: 'zh simplified', locale: 'zh', title: 'X果岭费与球场攻略', fire: true },
  { name: 'zh TRADITIONAL', locale: 'zh', title: 'X果嶺費與球場攻略', fire: true },
  { name: 'en package form is fine', locale: 'en', title: 'X — All-In Rates & Guide', fire: false },
  { name: 'th package form is fine', locale: 'th', title: 'X — แพ็กเกจแบบรวมทุกอย่าง', fire: false },
  { name: 'ja package form is fine', locale: 'ja', title: 'X — パッケージ料金・コース紹介', fire: false },
  { name: 'ko package form is fine', locale: 'ko', title: 'X 올인클루시브 패키지', fire: false },
  { name: 'zh package form is fine', locale: 'zh', title: 'X全包套餐与球场攻略', fire: false },
]

function selfTest(): never {
  let failed = 0
  // Counted INSIDE the loop, so they measure cases EXECUTED. Derived from
  // NOUN_SELF_TESTS.filter(...) they measured cases DECLARED, and a break at
  // the top of this loop ran zero cases while the floors still passed and the
  // gate exited 0 (measured 2026-08-24).
  // map() via runSelfTest: one verdict per case by construction, so there is no
  // counter to place correctly and no declared-vs-executed check to maintain.
  // Three placements of the old counter each left a skip shape one line away.
  // The fire/locale/reason tallies below are derived from the case ARRAY, which
  // is honest now that execution is structural: they guard case DELETION, and
  // `examined` guards execution.
  const result = runSelfTest('noun', NOUN_SELF_TESTS, (t) => {
    const got = PACKAGE_NOUN_RE[t.locale].test(t.title)
    return {
      ok: got === t.fire,
      label: `[${t.locale}] ${t.name} — expected ${t.fire ? 'FIRE' : 'silent'}, got ${got ? 'FIRE' : 'silent'}`,
    }
  })
  const ran = result.examined
  failed = result.failures
  const firesRan = NOUN_SELF_TESTS.filter((t) => t.fire).length
  const localesRan = new Set(NOUN_SELF_TESTS.map((t) => t.locale))
  console.log(`\n${ran} package-noun self-tests ran (${firesRan} must fire, across ${localesRan.size} locales) · ${failed} failed`)
  // Declared vs EXECUTED. A harness that reports what it declared cannot see
  // itself running nothing.
  if (ran !== NOUN_SELF_TESTS.length) {
    console.log(`FAIL: HARNESS BROKEN — ${NOUN_SELF_TESTS.length} cases declared, ${ran} executed`)
    process.exit(1)
  }
  // Pinned AT the current population, not below it — the mistake this very
  // guard's own floor made and had corrected.
  if (firesRan < 11 || localesRan.size < 5) {
    console.log('FAIL: self-test suite has lost cases (need >= 11 firing across all 5 locales)')
    process.exit(1)
  }
  if (failed > 0) process.exit(1)
  console.log('OK — every locale\'s green-fee noun forms fire, and every package form stays silent')
  process.exit(0)
}

if (process.argv.includes('--self-test')) selfTest()

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
