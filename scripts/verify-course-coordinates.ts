/**
 * Bulk-verify golf-course coordinates against the Google Places API —
 * `npm run verify:coordinates` (report) / `-- --write` (apply).
 *
 * Why this exists: the stored coordinates came from scraping. 25 courses were
 * rounded to 2 decimal places (a district centroid, up to 1.1 km out) and at
 * least one — Alpine — carried precise-looking 4dp coordinates several km from
 * the actual course, putting the satellite pin in urban blocks. Precision
 * heuristics catch the former; only a lookup catches the latter.
 *
 * What it does, per course: Places Text Search for "<name> <province> golf
 * course, Thailand", then compare the returned location with what we store.
 *   - within  MATCH_KM        -> agree; stamps coordinates_verified_at
 *   - beyond  MATCH_KM        -> drift; reports, and with --write replaces the
 *                                coordinates with the Places result
 *   - no result / ambiguous   -> left untouched and listed for manual work
 *
 * Requires a SERVER-side key with Places API enabled:
 *   GOOGLE_MAPS_SERVER_API_KEY=... npm run verify:coordinates
 * Do NOT reuse NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY if it is HTTP-referrer
 * restricted (it should be) — referrer-locked keys reject server calls.
 *
 * Costs money per request (Places Text Search is billed). 149 lookups is
 * cents, but --write is the only mutating mode and it is opt-in.
 */

import * as fs from 'fs'
import type { GolfCourse } from '../types/golf-courses'
import { haversineKm } from '../lib/geo'
import { loadCourseFiles } from './course-files'
const API_KEY = process.env.GOOGLE_MAPS_SERVER_API_KEY ?? ''
const WRITE = process.argv.includes('--write')
/** Courses are 1–2 km across, so a hit within 1.5 km is the same property. */
const MATCH_KM = 1.5
const TODAY = new Date().toISOString().slice(0, 10)


interface PlacesHit { lat: number; lng: number; name: string; address: string }

async function lookup(course: GolfCourse): Promise<PlacesHit | null> {
  const query = `${course.name} ${course.province} golf course, Thailand`
  const url =
    'https://maps.googleapis.com/maps/api/place/textsearch/json' +
    `?query=${encodeURIComponent(query)}&region=th&key=${API_KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Places HTTP ${res.status}`)
  const body = (await res.json()) as {
    status: string
    error_message?: string
    results?: { name: string; formatted_address: string; geometry: { location: { lat: number; lng: number } } }[]
  }
  if (body.status === 'ZERO_RESULTS') return null
  if (body.status !== 'OK') {
    throw new Error(`Places ${body.status}${body.error_message ? `: ${body.error_message}` : ''}`)
  }
  const top = body.results?.[0]
  if (!top) return null
  return {
    lat: top.geometry.location.lat,
    lng: top.geometry.location.lng,
    name: top.name,
    address: top.formatted_address,
  }
}

/**
 * Rewrites latitude/longitude and stamps coordinates_verified_at in place.
 * Anchored on the `  latitude: ` line prefix so it can't touch coordinates
 * nested inside the legacy schema_markup string.
 */
function applyToFile(abs: string, lat: number, lng: number) {
  let src = fs.readFileSync(abs, 'utf8')
  src = src.replace(/^ {2}latitude: -?[\d.]+,$/m, `  latitude: ${lat},`)
  src = src.replace(/^ {2}longitude: -?[\d.]+,$/m, `  longitude: ${lng},`)
  if (/^ {2}coordinates_verified_at:/m.test(src)) {
    src = src.replace(/^ {2}coordinates_verified_at: .*$/m, `  coordinates_verified_at: '${TODAY}',`)
  } else {
    src = src.replace(/^ {2}longitude: .*$/m, (m) => `${m}\n  coordinates_verified_at: '${TODAY}',`)
  }
  fs.writeFileSync(abs, src)
}

async function main() {
  if (!API_KEY) {
    console.error(
      'GOOGLE_MAPS_SERVER_API_KEY is not set.\n' +
      'Create a server key (Places API enabled, no HTTP-referrer restriction) and re-run:\n' +
      '  GOOGLE_MAPS_SERVER_API_KEY=xxx npm run verify:coordinates\n' +
      'Add --write to apply corrections instead of only reporting.'
    )
    process.exit(1)
  }

  const courses = await loadCourseFiles()
  const agreed: string[] = []
  const drifted: string[] = []
  const unresolved: string[] = []

  // Places lookups run through a bounded pool: ~149 serial round-trips cost
  // 1-1.5 min of wall time and a single hung response stalls the batch, while
  // 8 in flight stays far below Places QPS quotas. File writes stay in the
  // sequential loop below.
  const CONCURRENCY = 8
  const results = new Array<{ hit: PlacesHit | null; error: Error | null }>(courses.length)
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, courses.length) }, async () => {
      while (next < courses.length) {
        const i = next++
        try {
          results[i] = { hit: await lookup(courses[i].course), error: null }
        } catch (err) {
          results[i] = { hit: null, error: err as Error }
        }
      }
    })
  )

  for (const [i, { file, abs, course }] of courses.entries()) {
    const { hit, error } = results[i]
    if (error) {
      unresolved.push(`${file}: lookup failed — ${error.message}`)
      continue
    }
    if (!hit) {
      unresolved.push(`${file}: no Places result for "${course.name}"`)
      continue
    }

    if (course.latitude === null || course.longitude === null) {
      drifted.push(`${file}: had no coordinates → ${hit.lat},${hit.lng} (${hit.name})`)
      if (WRITE) applyToFile(abs, hit.lat, hit.lng)
      continue
    }

    const km = haversineKm(
      { lat: course.latitude, lng: course.longitude },
      { lat: hit.lat, lng: hit.lng }
    )
    if (km <= MATCH_KM) {
      agreed.push(`${file}: agrees within ${km.toFixed(2)} km (${hit.name})`)
      if (WRITE) applyToFile(abs, hit.lat, hit.lng)
    } else {
      drifted.push(
        `${file}: stored ${course.latitude},${course.longitude} is ${km.toFixed(1)} km from ` +
        `Places "${hit.name}" ${hit.lat},${hit.lng} — ${hit.address}`
      )
      if (WRITE) applyToFile(abs, hit.lat, hit.lng)
    }
  }

  if (drifted.length) {
    console.log('\n── Drifted (stored coordinates disagree with Places) ──')
    for (const d of drifted) console.log(`  ✖ ${d}`)
  }
  if (unresolved.length) {
    console.log('\n── Unresolved (verify by hand; left untouched) ──')
    for (const u of unresolved) console.log(`  ? ${u}`)
  }
  console.log(
    `\n${WRITE ? 'Applied' : 'Report only'}: ${agreed.length} agreed, ` +
    `${drifted.length} drifted, ${unresolved.length} unresolved, of ${courses.length} courses.`
  )
  if (!WRITE && (drifted.length || agreed.length)) {
    console.log('Re-run with `-- --write` to apply corrections and stamp coordinates_verified_at.')
  }
  // Reporting is never a failure: unresolved courses are expected and are
  // handled by the validate:courses gate, not by this script's exit code.
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
