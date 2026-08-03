/**
 * Shared course-data file loader for the scripts layer (validate-courses,
 * verify-course-coordinates). One walker so both scripts always agree on
 * what counts as a course file: region subdirectories of
 * data/golf-courses/, .ts files only, index.ts excluded, and only modules
 * exporting `course`.
 *
 * Not importable from app code — lib/golf-courses.ts (server-only) owns the
 * runtime loading path; this walker exists for Node scripts that run
 * outside Next.js.
 */
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import type { GolfCourse } from '../types/golf-courses'

export interface CourseFileEntry {
  /** Repo-relative-ish label, e.g. "bangkok/sai-golf-club.ts". */
  file: string
  /** Absolute path on disk (verify-course-coordinates rewrites in place). */
  abs: string
  course: GolfCourse
}

export async function loadCourseFiles(): Promise<CourseFileEntry[]> {
  const root = path.join(__dirname, '..', 'data', 'golf-courses')
  const out: CourseFileEntry[] = []
  for (const region of fs.readdirSync(root)) {
    const dir = path.join(root, region)
    if (!fs.statSync(dir).isDirectory()) continue
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.ts') || f === 'index.ts') continue
      const abs = path.join(dir, f)
      // pathToFileURL, not the raw path: the ESM loader rejects a Windows
      // absolute path ("protocol 'c:'"), so a bare path.join would make the
      // consumers Linux-only and unrunnable in the pre-commit sweep on
      // Windows.
      const mod = await import(pathToFileURL(abs).href)
      if (mod.course) out.push({ file: `${region}/${f}`, abs, course: mod.course as GolfCourse })
    }
  }
  return out
}
