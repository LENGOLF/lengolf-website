import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/constants'

type OpenGraphMeta = NonNullable<Metadata['openGraph']>

/**
 * Site-wide Open Graph defaults, merged into a page's own openGraph object.
 *
 * WHY THIS EXISTS: Next merges metadata per KEY, not per field. A route
 * segment that declares `openGraph` at all REPLACES the root layout's
 * resolved object wholesale — it does not extend it. The layout sets `type`
 * and `siteName`, so a page that declared its own openGraph to get a
 * page-specific image or url dropped `siteName`, and dropped `type` too
 * unless it happened to restate it. Measured live on 2026-08-23: of the 30
 * page-level openGraph blocks, all 30 emitted no `og:site_name` and 13
 * emitted no `og:type` — the homepage, /golf/, /lessons/, /events/,
 * /about-us/, /menu/ and /blog/ among them. The other 17 restated
 * `type: 'website'` (or `'article'`) themselves.
 *
 * Callers spread first and the defaults are re-asserted after, so a page that
 * means `type: 'article'` (blog posts, guides) keeps it.
 *
 * WHAT THIS DELIBERATELY DOES NOT DEFAULT, and why — the layout's openGraph
 * sets five fields and this restores two:
 *   - `url`: the layout's value is SITE_URL, i.e. the homepage. Defaulting it
 *     would make every page advertise the homepage as its OG object and
 *     collapse their share counts onto one graph node. That is the live bug
 *     documented at app/[locale]/golf-club-specs/page.tsx, which is why that
 *     page declares its own openGraph rather than inheriting.
 *   - `locale`: a fixed `en_US` default would be wrong on every /th/, /ja/,
 *     /ko/ and /zh/ page. The correct value is per-request; absent is better
 *     than wrong. 24 of the 29 call sites currently pass none.
 *   - `images`: defaulting it is tempting and NOT safe here. Next's
 *     file-based merge is guarded on `!source.openGraph.hasOwnProperty
 *     ('images')`, so supplying a default would make every segment "own" an
 *     images key and would silently SUPPRESS the three colocated
 *     opengraph-image.tsx cards under /golf-courses/. Confirmed live: /faq/
 *     and /guide/<slug>/ emit NO og:image today, while /golf-courses/ and
 *     /golf-courses/<region>/ emit exactly one (from the colocated file). The
 *     families with neither an `images` argument nor a colocated file are
 *     /location/, /guide/, /faq/, /cost/, /best/, /activities/, /hotels/
 *     <slug>, and the four /golf-courses/{under,near,best-for,compare}/
 *     routes — the last four because a child openGraph discards the PARENT
 *     segment's colocated card. Fixing it needs those segments exempted or
 *     the default applied per-family, which is a separate change. (Page count
 *     not stated here: the sitemap fetch needed to derive it was blocked by
 *     bot protection, and this repo's rule is not to quote a number nobody
 *     produced.)
 */
export function siteOpenGraph<T extends OpenGraphMeta>(og: T) {
  // Spread FIRST, then re-assert, because object spread COPIES an
  // explicitly-undefined value rather than skipping it. Next gates on
  // `'type' in openGraph`, so a caller writing `type: cond ? 'article' :
  // undefined` would reach Next's `default:` arm and THROW "Invalid OpenGraph
  // type: undefined" at build time — a hard build failure, not a silent
  // degrade. `?? ` widens the literal to `string`, which is cosmetic: Next's
  // resolver switches on the runtime value and never consults the type.
  const own = og as { type?: string; siteName?: string }
  return { ...og, type: own.type ?? 'website', siteName: own.siteName ?? SITE_NAME }
}
