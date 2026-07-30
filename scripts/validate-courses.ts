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
 * No server needed. Zero deps beyond tsx.
 */

import * as fs from 'fs'
import * as path from 'path'
import type { GolfCourse } from '../types/golf-courses'

const ROOT = path.join(__dirname, '..', 'data', 'golf-courses')

const LOW_FEE_THRESHOLD = 600
const ABS_FLOOR = 150
const ABS_CEILING = 20000
const WEEKEND_JUMP_RATIO = 2.2
const STALE_MONTHS = 18

const errors: string[] = []
const warnings: string[] = []

async function loadCourses(): Promise<{ file: string; course: GolfCourse }[]> {
  const out: { file: string; course: GolfCourse }[] = []
  for (const region of fs.readdirSync(ROOT)) {
    const dir = path.join(ROOT, region)
    if (!fs.statSync(dir).isDirectory()) continue
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.ts') || f === 'index.ts') continue
      const mod = await import(path.join(dir, f))
      if (mod.course) out.push({ file: `${region}/${f}`, course: mod.course as GolfCourse })
    }
  }
  return out
}

function monthsSince(iso: string): number {
  const then = new Date(`${iso}T00:00:00Z`).getTime()
  return (Date.now() - then) / (1000 * 60 * 60 * 24 * 30.44)
}

async function main() {
  const courses = await loadCourses()

  for (const { file, course: c } of courses) {
    const wd = c.green_fee_weekday_thb
    const we = c.green_fee_weekend_thb
    const verified = c.fees_verified_at ?? null

    if (verified !== null && !/^\d{4}-\d{2}-\d{2}$/.test(verified)) {
      errors.push(`${file}: fees_verified_at "${verified}" is not YYYY-MM-DD`)
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
