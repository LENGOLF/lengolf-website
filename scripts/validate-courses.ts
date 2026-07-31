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

import * as fs from 'fs'
import * as path from 'path'
import { pathToFileURL } from 'url'
import type { GolfCourse } from '../types/golf-courses'

const ROOT = path.join(__dirname, '..', 'data', 'golf-courses')

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

async function loadCourses(): Promise<{ file: string; course: GolfCourse }[]> {
  const out: { file: string; course: GolfCourse }[] = []
  for (const region of fs.readdirSync(ROOT)) {
    const dir = path.join(ROOT, region)
    if (!fs.statSync(dir).isDirectory()) continue
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.ts') || f === 'index.ts') continue
      // pathToFileURL, not the raw path: the ESM loader rejects a Windows
      // absolute path ("protocol 'c:'"), so a bare path.join made this gate
      // Linux-only and unrunnable in the pre-commit sweep on Windows.
      const mod = await import(pathToFileURL(path.join(dir, f)).href)
      if (mod.course) out.push({ file: `${region}/${f}`, course: mod.course as GolfCourse })
    }
  }
  return out
}

function monthsSince(iso: string): number {
  const then = new Date(`${iso}T00:00:00Z`).getTime()
  return (Date.now() - then) / (1000 * 60 * 60 * 24 * 30.44)
}

function decimalPlaces(n: number): number {
  const s = String(n)
  const dot = s.indexOf('.')
  return dot === -1 ? 0 : s.length - dot - 1
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
  if (dp < 3 && attested === null) {
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

async function main() {
  const courses = await loadCourses()

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
