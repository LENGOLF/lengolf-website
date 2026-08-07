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
 *  - REGION_META.courseCount disagreeing with the published course files on
 *    disk for that region (it is hand-maintained, and now selects an ICU
 *    plural branch as well as printing a number — see checkRegionCounts)
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
import type { GolfCourse } from '../types/golf-courses'
import { decimalPlaces, MIN_COORD_DECIMALS } from '../lib/geo'
import { loadCourseFiles } from './course-files'

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
 * REGION_META.courseCount vs the course files actually on disk.
 *
 * courseCount is hand-maintained and drives real output: the region hub's
 * meta description, its hero card, the OG card chip — and, since the
 * count/noun work, WHICH ICU PLURAL BRANCH renders. A stale count no longer
 * just prints a wrong number; it commits the sentence to the wrong
 * grammatical form ("Our guide to 1 golf course in Krabi" above two cards).
 *
 * Nothing else guards it. The smoke suite's SINGLE_COURSE_REGIONS is a
 * hardcoded list, so it keeps asserting the =1 branch against a stale value
 * rather than catching it.
 *
 * Parsed out of the source text rather than imported: lib/golf-courses.ts is
 * `import 'server-only'` and throws under plain tsx (same constraint that
 * forced the hardcoded list in the smoke test).
 */
function checkRegionCounts(courses: { file: string; course: GolfCourse }[]) {
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

  const declared = new Map<string, number>()
  for (const m of meta[1].matchAll(/^ {2}'?([a-z-]+)'?:\s*\{([\s\S]*?)^ {2}\},/gm)) {
    const count = m[2].match(/courseCount:\s*(\d+)/)
    if (count) declared.set(m[1], Number(count[1]))
  }
  if (declared.size === 0) {
    errors.push('lib/golf-courses.ts: REGION_META parsed to zero regions (courseCount guard is blind)')
    return
  }

  // Count by DIRECTORY, not course.region: the directory index is what
  // lib/golf-courses.ts loads and what the URL is built from, so a file in
  // the wrong folder must not be masked by a correct `region` field.
  const actual = new Map<string, number>()
  for (const { file, course } of courses) {
    if (course.status !== 'published') continue
    const region = file.split('/')[0]
    actual.set(region, (actual.get(region) ?? 0) + 1)
  }

  for (const [region, count] of declared) {
    const onDisk = actual.get(region) ?? 0
    if (onDisk !== count) {
      errors.push(
        `lib/golf-courses.ts: REGION_META.${region}.courseCount is ${count} but ${onDisk} published course file(s) are in data/golf-courses/${region}/ — the hub would advertise the wrong count and may pick the wrong plural branch`
      )
    }
  }
  for (const region of actual.keys()) {
    if (!declared.has(region)) {
      errors.push(`data/golf-courses/${region}/ has course files but no REGION_META entry`)
    }
  }
}

async function main() {
  const courses = await loadCourseFiles()
  checkRegionCounts(courses)

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

  for (const w of warnings) console.log(`  ⚠ ${w}`)
  for (const e of errors) console.log(`  ✖ ${e}`)

  if (errors.length > 0) {
    console.log(`\n❌ validate-courses: ${errors.length} error(s) across ${courses.length} courses (${warnings.length} warning(s))`)
    process.exit(1)
  }
  console.log(`\n✅ validate-courses: ${courses.length} courses pass fee-plausibility checks (${warnings.length} non-blocking warning(s))`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
