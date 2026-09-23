/**
 * IndexNow URL derivation: turns a pushed commit range into the exact set of
 * canonical URLs whose rendered content that range changed, in every locale
 * that actually serves them.
 *
 *   npx tsx scripts/indexnow-urls.ts --base <rev>   # URLs on stdout, one per line
 *   npx tsx scripts/indexnow-urls.ts --self-test
 *
 * Run from the repo root with the tree at HEAD (it refuses a dirty tree: the
 * head side is imported from disk, so uncommitted edits would leak into a
 * "what did this commit range change" answer). Consumed by
 * .github/workflows/indexnow.yml, which hands stdout to scripts/indexnow-ping.ts.
 * Every changed file also gets one line on stderr saying what it mapped to or
 * why it mapped to nothing, so an empty result is legible rather than silent.
 *
 * WHY THIS EXISTS. The workflow used to map course files to their EN URL with
 * sed and everything else to a fixed key-page list. So a translated course page
 * (/ja/golf-courses/<region>/<slug>/) was never pinged, and an edit to one FAQ
 * pinged eleven hub pages that do not render it while omitting the FAQ itself.
 *
 * HOW A FILE BECOMES URLS. Each changed file is matched against RULES (first
 * match wins). Corpus files are diffed SEMANTICALLY, not textually: the file is
 * imported at both revisions (the base copy via `git show`, written next to the
 * original so its relative and `@/` imports resolve identically) and compared
 * record by record with sig(), which serialises functions by their source so a
 * predicate edit counts as a change. So an edit to one FAQ entry yields that
 * FAQ's URL, and a comment-only edit yields nothing. Locale fan-out always goes
 * through the HEAD registry (lib/translated-routes.ts), never through the data
 * file's own locale tags: a locale URL that is not registered 301s to English,
 * and pinging a redirect is not the point.
 *
 * WHAT A CHANGED RECORD PINGS, and the one rule that decides it:
 *   (1) the page whose subject IS the record, in every locale it reaches;
 *   (2) the pages that ENUMERATE records of that kind (section hubs, the region
 *       roster, /llms.txt, /llms-full.txt);
 *   NOT (3) pages that merely cross-link or embed a label of it: related-guide
 *       links, the homepage region chips, a course's card on /compare/, /near/,
 *       /under/ or /best-for/. Those ripples are real, and are left to the
 *       crawler's own recrawl on purpose: chasing them turns one edit into
 *       hundreds of pings. CONSUMERS below records the decision per file, and
 *       the self-test fails when a new consumer appears that nobody classified.
 *
 * A record whose set of LOCALES changed (added, removed, draft <-> published)
 * pings every locale of it, not just the one that moved, because the hreflang
 * cluster on every sibling changed with it.
 *
 * WHAT NEVER HAPPENS SILENTLY. A file matching no rule falls back to the old
 * key-page list plus a warning (a GitHub annotation in Actions), and the
 * self-test fails on any file under data/ or messages/ that would hit that
 * fallback today, so a new data file forces a mapping decision in its own PR.
 * A module that cannot be imported, or that changed somewhere no keyed diff
 * attributes, falls back to its rule's COARSE set (every URL it could feed)
 * with a warning: a superset, never a gap.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { runSelfTest, type Verdict } from './self-test-harness'

export const SITE = 'https://www.len.golf'

/**
 * Must equal `on.push.paths` in .github/workflows/indexnow.yml (asserted by the
 * self-test). A path the workflow triggers on but this script does not diff is
 * a push that runs, derives nothing, and exits green.
 */
export const TRIGGER_PATHS = ['data/**', 'messages/**', 'app/llms.txt/**', 'app/llms-full.txt/**']

/** Paths whose working-tree state the head side reads. Must be clean. */
const HEAD_READ_PATHS = ['data', 'messages', 'lib', 'types', 'app/llms.txt', 'app/llms-full.txt']

/**
 * Pages that render UI-catalog strings from nearly every namespace. A messages/
 * edit maps here (in that catalog's locale only: i18n/request.ts loads exactly
 * one catalog, with no EN merge). Deliberately NOT a namespace-to-route map:
 * every page reads several namespaces and that table would rot on first use.
 */
export const KEY_PAGES = [
  '/',
  '/golf/',
  '/lessons/',
  '/events/',
  '/menu/',
  '/faq/',
  '/golf-club-rental/',
  '/golf-course-club-rental/',
  '/golf-courses/',
]
/** The pre-derivation fallback: key pages plus both llms files. */
const FALLBACK_PAGES = [...KEY_PAGES, '/llms.txt', '/llms-full.txt']

/** Catalog locales (messages/<l>.json, getFaqHubContent). Asserted against ALL_LOCALES by the self-test. */
const LOCALES = ['en', 'th', 'ja', 'ko', 'zh']

// ── Types ───────────────────────────────────────────────────────────────────

export interface Registry {
  getLocalesForPath(pathname: string): string[]
  hasTranslationForLocale(locale: string, pathname: string): boolean
}

/** A module namespace (.ts) or a parsed JSON value (.json); null = absent. */
export type Loaded = Record<string, unknown> | null

export interface Loader {
  base(rel: string): Promise<Loaded>
  head(rel: string): Promise<Loaded>
}

export interface Change {
  status: 'A' | 'M' | 'D'
  file: string
}

export interface FileResult {
  file: string
  urls: string[]
  note: string
  warn: boolean
}

interface Ctx {
  reg: Registry
  loader: Loader
}

// ── URL helpers ─────────────────────────────────────────────────────────────

const isFilePath = (p: string) => /\.[a-z0-9]+$/i.test(p)

/** Absolute URL for a locale-free route path in `locale`. */
export function pageUrl(locale: string, p: string): string {
  const route = p === '/' || isFilePath(p) ? p : `${p.replace(/\/+$/, '')}/`
  return `${SITE}${locale === 'en' ? '' : `/${locale}`}${route}`
}

/** EN plus every locale the HEAD registry serves `p` in. Files are EN-only. */
function served(reg: Registry, p: string): string[] {
  if (isFilePath(p)) return [pageUrl('en', p)]
  return reg.getLocalesForPath(p).map((l) => pageUrl(l, p))
}

/** `p` in `locale` alone, or nothing when that locale does not serve it. */
function inLocale(reg: Registry, locale: string, p: string): string[] {
  if (isFilePath(p)) return locale === 'en' ? [pageUrl('en', p)] : []
  return locale === 'en' || reg.hasTranslationForLocale(locale, p) ? [pageUrl(locale, p)] : []
}

// ── Semantic comparison ─────────────────────────────────────────────────────

/**
 * Stable serialisation for "did this record change". Functions serialise by
 * their SOURCE: USE_CASE_RULES carries `predicate`/`reasonFor` functions, and
 * plain JSON.stringify drops them, so a predicate edit would read as "no
 * change". Both revisions are compiled by the same tsx/esbuild, so identical
 * source yields identical text.
 */
export function sig(value: unknown): string {
  return (
    JSON.stringify(value, (_k, v) => (typeof v === 'function' ? `ƒ ${String(v)}` : v)) ?? 'undefined'
  )
}

/** sig() of a whole module, optionally ignoring the exports a keyed diff covered. */
function moduleSig(mod: Loaded, omit: readonly string[] = []): string {
  if (!mod) return 'absent'
  const keys = Object.keys(mod)
    .filter((k) => !omit.includes(k) && k !== 'default' && k !== '__esModule')
    .sort()
  return sig(Object.fromEntries(keys.map((k) => [k, mod[k]])))
}

interface KeyedDiff {
  added: string[]
  removed: string[]
  modified: string[]
}

export function diffKeyed(base: Map<string, unknown>, head: Map<string, unknown>): KeyedDiff {
  const added: string[] = []
  const removed: string[] = []
  const modified: string[] = []
  for (const [k, v] of head) {
    if (!base.has(k)) added.push(k)
    else if (sig(base.get(k)) !== sig(v)) modified.push(k)
  }
  for (const k of base.keys()) if (!head.has(k)) removed.push(k)
  return { added, removed, modified }
}

const diffSize = (d: KeyedDiff) => d.added.length + d.removed.length + d.modified.length

function describe(d: KeyedDiff): string {
  const parts: string[] = []
  if (d.modified.length) parts.push(`${d.modified.length} modified`)
  if (d.added.length) parts.push(`${d.added.length} added`)
  if (d.removed.length) parts.push(`${d.removed.length} removed`)
  return parts.join(', ') || 'no record changed'
}

/** Record<string, T> -> Map, or an empty Map when the export is absent. */
function recordMap(mod: Loaded, exportName: string): Map<string, unknown> {
  const m = new Map<string, unknown>()
  const rec = mod?.[exportName]
  if (rec && typeof rec === 'object' && !Array.isArray(rec)) {
    for (const [k, v] of Object.entries(rec)) m.set(k, v)
  }
  return m
}

/** Record<outer, Record<locale, T>> -> Map keyed `${outer}:${locale}`. */
function nestedRecordMap(mod: Loaded, exportName: string): Map<string, unknown> {
  const m = new Map<string, unknown>()
  for (const [outer, byLocale] of recordMap(mod, exportName)) {
    if (byLocale && typeof byLocale === 'object') {
      for (const [locale, v] of Object.entries(byLocale)) m.set(`${outer}:${locale}`, v)
    }
  }
  return m
}

const splitKey = (k: string): [string, string] => {
  const i = k.indexOf(':')
  return [k.slice(0, i), k.slice(i + 1)]
}

// ── Rules ───────────────────────────────────────────────────────────────────

interface Rule {
  id: string
  match: (file: string) => RegExpMatchArray | null
  derive: (ctx: Ctx, change: Change, m: RegExpMatchArray) => Promise<Omit<FileResult, 'file'>>
}

/**
 * The six SEO sections: data file, its exported array, the page type it is
 * registered under in lib/seo-pages.ts (PAGE_DATA_MAP) and the route prefix
 * (ROUTE_PREFIX_TO_TYPE). The self-test asserts this table against both maps
 * by IDENTITY (the imported array must be the very array PAGE_DATA_MAP holds),
 * so a section added there without a row here fails CI.
 */
export const SEO_SECTIONS = [
  { file: 'data/faq-pages.ts', exportName: 'faqPages', type: 'faq', prefix: 'faq' },
  { file: 'data/explainer-pages.ts', exportName: 'explainerPages', type: 'explainer', prefix: 'guide' },
  { file: 'data/price-guide-pages.ts', exportName: 'priceGuidePages', type: 'price_guide', prefix: 'cost' },
  { file: 'data/best-of-listicle-pages.ts', exportName: 'bestOfListiclePages', type: 'best_of_listicle', prefix: 'best' },
  { file: 'data/activity-occasions.ts', exportName: 'activityOccasionPages', type: 'activity_occasion', prefix: 'activities' },
  { file: 'data/hotel-pages.ts', exportName: 'hotelConciergePages', type: 'hotel_concierge', prefix: 'hotels' },
] as const

/**
 * Pages that ENUMERATE a section's entries, and which entries each reads:
 *   'en'  -> only EN entries (the getter is called with no locale), so an EN
 *            change pings the page in every locale it is served in;
 *   'own' -> the render locale's entries, so an entry in L pings the page in L;
 *   'any' -> every locale's entries, in one EN-only file.
 * Each row names the call it was read from.
 */
const SEO_LISTINGS: { type: string; reads: 'en' | 'own' | 'any'; path: string }[] = [
  // app/[locale]/golf-in-thailand-guide/page.tsx: getSeoPagesByType('faq' | 'price_guide' | 'explainer')
  { type: 'faq', reads: 'en', path: '/golf-in-thailand-guide/' },
  { type: 'price_guide', reads: 'en', path: '/golf-in-thailand-guide/' },
  { type: 'explainer', reads: 'en', path: '/golf-in-thailand-guide/' },
  // app/[locale]/faq/page.tsx: getSeoPagesByType('faq', locale)
  { type: 'faq', reads: 'own', path: '/faq/' },
  // app/[locale]/activities/page.tsx: getSeoPagesByType('activity_occasion' | 'best_of_listicle')
  { type: 'activity_occasion', reads: 'en', path: '/activities/' },
  { type: 'best_of_listicle', reads: 'en', path: '/activities/' },
  // app/[locale]/hotels/page.tsx: getSeoPagesByType('hotel_concierge')
  { type: 'hotel_concierge', reads: 'en', path: '/hotels/' },
  // app/llms.txt/route.ts: EN faq + explainer, then LOCALE_PAGE_TYPES per locale
  { type: 'faq', reads: 'any', path: '/llms.txt' },
  { type: 'explainer', reads: 'any', path: '/llms.txt' },
  // app/llms-full.txt/route.ts: getSeoPagesByType('faq') — every EN answer verbatim
  { type: 'faq', reads: 'en', path: '/llms-full.txt' },
]

function listingUrls(reg: Registry, type: string, entryLocale: string): string[] {
  const out: string[] = []
  for (const l of SEO_LISTINGS) {
    if (l.type !== type) continue
    if (l.reads === 'en' && entryLocale === 'en') out.push(...served(reg, l.path))
    else if (l.reads === 'own') out.push(...inLocale(reg, entryLocale, l.path))
    else if (l.reads === 'any') out.push(...served(reg, l.path))
  }
  return out
}

/** Published entries keyed `${locale}:${slug}`, first wins (as getSeoPageBySlug's find() does). */
function seoEntryMap(mod: Loaded, exportName: string): Map<string, unknown> {
  const m = new Map<string, unknown>()
  if (!mod) return m
  const arr = mod[exportName]
  if (!Array.isArray(arr)) throw new Error(`export \`${exportName}\` is missing or not an array`)
  for (const e of arr as { status?: string; locale?: string; slug?: string }[]) {
    if (e.status !== 'published') continue
    const key = `${e.locale}:${e.slug}`
    if (!m.has(key)) m.set(key, e)
  }
  return m
}

function seoRule(section: (typeof SEO_SECTIONS)[number]): Rule {
  const pagePath = (slug: string) => `/${section.prefix}/${slug}/`
  return {
    id: `seo:${section.prefix}`,
    match: (f) => (f === section.file ? [f] : null),
    async derive({ reg, loader }) {
      const [base, head] = await Promise.all([loader.base(section.file), loader.head(section.file)])
      const b = seoEntryMap(base, section.exportName)
      const h = seoEntryMap(head, section.exportName)
      const d = diffKeyed(b, h)
      const urls: string[] = []
      for (const k of d.modified) {
        const [locale, slug] = splitKey(k)
        urls.push(...inLocale(reg, locale, pagePath(slug)), ...listingUrls(reg, section.type, locale))
      }
      // The locale SET of this slug moved: every sibling's hreflang changed.
      for (const k of [...d.added, ...d.removed]) {
        const [locale, slug] = splitKey(k)
        urls.push(...served(reg, pagePath(slug)), ...inLocale(reg, locale, pagePath(slug)))
        urls.push(...listingUrls(reg, section.type, locale))
      }
      const unattributed = diffSize(d) === 0 && moduleSig(base, [section.exportName]) !== moduleSig(head, [section.exportName])
      if (unattributed) {
        return { urls: coarseSeo(reg, section, h), note: 'changed outside the entry array; pinging the whole section', warn: true }
      }
      return { urls, note: `${section.exportName}: ${describe(d)}`, warn: false }
    },
  }
}

function coarseSeo(reg: Registry, section: (typeof SEO_SECTIONS)[number], entries: Map<string, unknown>): string[] {
  const urls: string[] = []
  for (const k of entries.keys()) {
    const [locale, slug] = splitKey(k)
    urls.push(...inLocale(reg, locale, `/${section.prefix}/${slug}/`), ...listingUrls(reg, section.type, locale))
  }
  return urls
}

/**
 * A rule for a small module that feeds a fixed set of pages: any semantic
 * change pings all of them, in every locale each is served in.
 */
function fixedRule(file: string, pages: string[]): Rule {
  return {
    id: `fixed:${file}`,
    match: (f) => (f === file ? [f] : null),
    async derive({ reg, loader }) {
      const [base, head] = await Promise.all([loader.base(file), loader.head(file)])
      if (moduleSig(base) === moduleSig(head)) return { urls: [], note: 'no semantic change', warn: false }
      return { urls: pages.flatMap((p) => served(reg, p)), note: `changed -> ${pages.join(' ')}`, warn: false }
    },
  }
}

/**
 * A rule for a Record<slug, T> module where each slug owns one page: a changed
 * slug pings its page, and any change also pings the listing pages.
 */
function recordRule(file: string, exportName: string, pageFor: (slug: string) => string, listings: string[]): Rule {
  return {
    id: `record:${file}`,
    match: (f) => (f === file ? [f] : null),
    async derive({ reg, loader }) {
      const [base, head] = await Promise.all([loader.base(file), loader.head(file)])
      const d = diffKeyed(recordMap(base, exportName), recordMap(head, exportName))
      const touched = [...d.modified, ...d.added, ...d.removed]
      if (touched.length === 0) {
        if (moduleSig(base, [exportName]) === moduleSig(head, [exportName])) {
          return { urls: [], note: 'no semantic change', warn: false }
        }
        const all = [...recordMap(head, exportName).keys()]
        return {
          urls: [...all.flatMap((s) => served(reg, pageFor(s))), ...listings.flatMap((p) => served(reg, p))],
          note: `changed outside \`${exportName}\`; pinging every page it feeds`,
          warn: true,
        }
      }
      return {
        urls: [...touched.flatMap((s) => served(reg, pageFor(s))), ...listings.flatMap((p) => served(reg, p))],
        note: `${exportName}: ${describe(d)}`,
        warn: false,
      }
    },
  }
}

const COURSE_RE = /^data\/golf-courses\/([a-z0-9-]+)\/([a-z0-9-]+)\.ts$/
const hubPath = (region: string) => `/golf-courses/${region}/`
const coursePath = (region: string, slug: string) => `/golf-courses/${region}/${slug}/`

export const RULES: Rule[] = [
  {
    // Lint-only input to validate:i18n. Renders nowhere.
    id: 'none:i18n-glossary',
    match: (f) => f.match(/^data\/i18n-glossary\//),
    derive: async () => ({ urls: [], note: 'glossary is a validate:i18n input; renders nowhere', warn: false }),
  },
  {
    // A region's slug list: the roster on its hub, and the counts on /golf-courses/.
    id: 'region-index',
    match: (f) => f.match(/^data\/golf-courses\/([a-z0-9-]+)\/index\.ts$/),
    async derive({ reg, loader }, change, m) {
      const [base, head] = await Promise.all([loader.base(change.file), loader.head(change.file)])
      if (sig(base?.default) === sig(head?.default) && moduleSig(base) === moduleSig(head)) {
        return { urls: [], note: 'no semantic change', warn: false }
      }
      return {
        urls: [...served(reg, hubPath(m[1])), ...served(reg, '/golf-courses/')],
        note: `roster changed -> ${hubPath(m[1])} + /golf-courses/`,
        warn: false,
      }
    },
  },
  {
    // One course file: its page in every served locale, plus its region roster.
    id: 'course',
    match: (f) => f.match(COURSE_RE),
    async derive({ reg, loader }, change, m) {
      const [region, slug] = [m[1], m[2]]
      const [base, head] = await Promise.all([loader.base(change.file), loader.head(change.file)])
      if (sig(base?.course) === sig(head?.course) && moduleSig(base) === moduleSig(head)) {
        return { urls: [], note: 'no semantic change', warn: false }
      }
      const verb = !base ? 'added' : !head ? 'removed' : 'changed'
      return {
        urls: [...served(reg, coursePath(region, slug)), ...served(reg, hubPath(region))],
        note: `course ${verb}`,
        warn: false,
      }
    },
  },
  ...SEO_SECTIONS.map(seoRule),
  {
    // REGION_HUB_I18N is per (region, locale) hub copy; COURSE_DETAIL_I18N is
    // the list of which courses build which locales.
    id: 'golf-courses-i18n',
    match: (f) => (f === 'data/golf-courses-i18n.ts' ? [f] : null),
    async derive({ reg, loader }, change) {
      const [base, head] = await Promise.all([loader.base(change.file), loader.head(change.file)])
      const hubs = diffKeyed(nestedRecordMap(base, 'REGION_HUB_I18N'), nestedRecordMap(head, 'REGION_HUB_I18N'))
      const courseMap = (mod: Loaded) => {
        const map = new Map<string, unknown>()
        const arr = mod?.COURSE_DETAIL_I18N
        if (Array.isArray(arr)) {
          for (const e of arr as { region: string; slug: string; locales: unknown }[]) {
            map.set(`${e.region}/${e.slug}`, e.locales)
          }
        }
        return map
      }
      const courses = diffKeyed(courseMap(base), courseMap(head))
      const urls: string[] = []
      for (const k of hubs.modified) {
        const [region, locale] = splitKey(k)
        urls.push(...inLocale(reg, locale, hubPath(region)), ...inLocale(reg, locale, '/golf-courses/'))
      }
      for (const k of [...hubs.added, ...hubs.removed]) {
        const [region, locale] = splitKey(k)
        urls.push(...served(reg, hubPath(region)), ...inLocale(reg, locale, '/golf-courses/'))
      }
      // llms.txt prints each translated hub under its localized label.
      if (diffSize(hubs) > 0) urls.push(pageUrl('en', '/llms.txt'))
      for (const k of [...courses.modified, ...courses.added, ...courses.removed]) {
        const [region, slug] = k.split('/')
        // The hub roster links a course with or without a locale prefix
        // (courseDetailHref), so the roster moves with the registration.
        urls.push(...served(reg, coursePath(region, slug)), ...served(reg, hubPath(region)))
      }
      const omit = ['REGION_HUB_I18N', 'COURSE_DETAIL_I18N']
      if (diffSize(hubs) + diffSize(courses) === 0) {
        if (moduleSig(base, omit) === moduleSig(head, omit)) return { urls: [], note: 'no semantic change', warn: false }
        const regions = new Set([...nestedRecordMap(head, 'REGION_HUB_I18N').keys()].map((k) => splitKey(k)[0]))
        return {
          urls: [...[...regions].flatMap((r) => served(reg, hubPath(r))), ...served(reg, '/golf-courses/')],
          note: 'changed outside both registries (a helper?); pinging every translated hub',
          warn: true,
        }
      }
      return { urls, note: `region hubs: ${describe(hubs)}; course registrations: ${describe(courses)}`, warn: false }
    },
  },
  {
    // PRICE_TIERS carries the EN copy and the tier set; PRICE_TIER_I18N the rest.
    id: 'price-tiers',
    match: (f) => (f === 'data/price-tiers.ts' ? [f] : null),
    async derive({ reg, loader }, change) {
      const [base, head] = await Promise.all([loader.base(change.file), loader.head(change.file)])
      const tierMap = (mod: Loaded) => {
        const map = new Map<string, unknown>()
        const arr = mod?.PRICE_TIERS
        if (Array.isArray(arr)) for (const t of arr as { slug: string }[]) map.set(t.slug, t)
        return map
      }
      const tierPath = (slug: string) => `/golf-courses/under/${slug}/`
      const tiers = diffKeyed(tierMap(base), tierMap(head))
      const i18n = diffKeyed(nestedRecordMap(base, 'PRICE_TIER_I18N'), nestedRecordMap(head, 'PRICE_TIER_I18N'))
      const urls: string[] = []
      for (const slug of [...tiers.modified, ...tiers.added, ...tiers.removed]) urls.push(...served(reg, tierPath(slug)))
      // The EN tier set is listed on /golf-courses/ in every locale.
      if (diffSize(tiers) > 0) urls.push(...served(reg, '/golf-courses/'))
      for (const k of i18n.modified) {
        const [slug, locale] = splitKey(k)
        urls.push(...inLocale(reg, locale, tierPath(slug)), ...inLocale(reg, locale, '/golf-courses/'))
      }
      for (const k of [...i18n.added, ...i18n.removed]) {
        const [slug, locale] = splitKey(k)
        urls.push(...served(reg, tierPath(slug)), ...inLocale(reg, locale, '/golf-courses/'))
      }
      const omit = ['PRICE_TIERS', 'PRICE_TIER_SLUGS', 'PRICE_TIER_I18N']
      if (diffSize(tiers) + diffSize(i18n) === 0) {
        if (moduleSig(base, omit) === moduleSig(head, omit)) return { urls: [], note: 'no semantic change', warn: false }
        return {
          urls: [...[...tierMap(head).keys()].flatMap((s) => served(reg, tierPath(s))), ...served(reg, '/golf-courses/')],
          note: 'changed outside the tier records; pinging every tier page',
          warn: true,
        }
      }
      return { urls, note: `tiers: ${describe(tiers)}; translations: ${describe(i18n)}`, warn: false }
    },
  },
  {
    // The /faq/ hub, one content block per locale via getFaqHubContent().
    id: 'faq-hub',
    match: (f) => (f === 'data/faq-hub.ts' ? [f] : null),
    async derive({ reg, loader }, change) {
      const [base, head] = await Promise.all([loader.base(change.file), loader.head(change.file)])
      const perLocale = (mod: Loaded) => {
        const map = new Map<string, unknown>()
        const get = mod?.getFaqHubContent
        if (typeof get === 'function') for (const l of LOCALES) map.set(l, (get as (l: string) => unknown)(l))
        return map
      }
      const d = diffKeyed(perLocale(base), perLocale(head))
      const locales = [...d.modified, ...d.added, ...d.removed]
      if (locales.length === 0) {
        if (moduleSig(base) === moduleSig(head)) return { urls: [], note: 'no semantic change', warn: false }
        return { urls: [...served(reg, '/faq/'), pageUrl('en', '/llms-full.txt')], note: 'changed outside the rendered content; pinging every /faq/ hub', warn: true }
      }
      const urls = locales.flatMap((l) => inLocale(reg, l, '/faq/'))
      // llms-full.txt prints the EN hub's directions (getFaqHubContent('en')).
      if (locales.includes('en')) urls.push(pageUrl('en', '/llms-full.txt'))
      return { urls, note: `hub content changed for ${locales.join(', ')}`, warn: false }
    },
  },
  {
    // Mirror of the DB's translated blog slugs: a slug entering or leaving a
    // locale changes that post's hreflang cluster and that locale's blog index.
    id: 'blog-translated-slugs',
    match: (f) => (f === 'data/blog-translated-slugs.ts' ? [f] : null),
    async derive({ reg, loader }, change) {
      const [base, head] = await Promise.all([loader.base(change.file), loader.head(change.file)])
      const pairs = (mod: Loaded) => {
        const map = new Map<string, unknown>()
        for (const [locale, slugs] of recordMap(mod, 'BLOG_TRANSLATED_SLUGS')) {
          if (Array.isArray(slugs)) for (const s of slugs) map.set(`${locale}:${s}`, true)
        }
        return map
      }
      const d = diffKeyed(pairs(base), pairs(head))
      const urls: string[] = []
      for (const k of [...d.added, ...d.removed]) {
        const [locale, slug] = splitKey(k)
        urls.push(pageUrl('en', `/blog/${slug}/`), ...inLocale(reg, locale, `/blog/${slug}/`), ...inLocale(reg, locale, '/blog/'))
      }
      if (diffSize(d) === 0 && moduleSig(base, ['BLOG_TRANSLATED_SLUGS']) !== moduleSig(head, ['BLOG_TRANSLATED_SLUGS'])) {
        return { urls: served(reg, '/blog/'), note: 'changed outside BLOG_TRANSLATED_SLUGS; pinging the blog index', warn: true }
      }
      return { urls, note: `translated slugs: ${describe(d)}`, warn: false }
    },
  },
  recordRule('data/airports.ts', 'AIRPORTS', (s) => `/golf-courses/near/${s}/`, ['/golf-courses/']),
  recordRule('data/bts-stations.ts', 'BTS_STATIONS', (s) => `/golf-courses/near/${s}/`, ['/golf-courses/']),
  recordRule('data/golf-courses-use-cases.ts', 'USE_CASE_RULES', (s) => `/golf-courses/best-for/${s}/`, ['/golf-courses/']),
  fixedRule('data/coaches.ts', ['/lessons/']),
  fixedRule('data/event-clients.ts', ['/events/']),
  fixedRule('data/food-menu.ts', ['/menu/']),
  fixedRule('data/pricing.ts', ['/', '/golf/', '/lessons/', '/events/', '/corporate-golf-packages/', '/llms-full.txt']),
  {
    // One UI catalog: the key pages, in that catalog's locale only.
    id: 'messages',
    match: (f) => f.match(/^messages\/([a-z]{2})\.json$/),
    async derive({ reg, loader }, change, m) {
      const locale = m[1]
      if (!LOCALES.includes(locale)) {
        return { urls: FALLBACK_PAGES.flatMap((p) => served(reg, p)), note: `unknown locale catalog "${locale}"; key pages`, warn: true }
      }
      const [base, head] = await Promise.all([loader.base(change.file), loader.head(change.file)])
      const d = diffKeyed(new Map(Object.entries(base ?? {})), new Map(Object.entries(head ?? {})))
      if (diffSize(d) === 0) return { urls: [], note: 'no message changed', warn: false }
      const namespaces = [...d.modified, ...d.added, ...d.removed]
      return {
        urls: KEY_PAGES.flatMap((p) => inLocale(reg, locale, p)),
        note: `namespaces ${namespaces.slice(0, 6).join(', ')}${namespaces.length > 6 ? ` +${namespaces.length - 6}` : ''} -> ${locale} key pages`,
        warn: false,
      }
    },
  },
  {
    id: 'llms-route',
    match: (f) => f.match(/^app\/(llms(?:-full)?\.txt)\//),
    derive: async (_ctx, _change, m) => ({ urls: [pageUrl('en', `/${m[1]}`)], note: `route source -> /${m[1]}`, warn: false }),
  },
]

/** Any trigger-path file no rule claims. Never silent: key pages + a warning. */
async function fallback(ctx: Ctx): Promise<Omit<FileResult, 'file'>> {
  return {
    urls: FALLBACK_PAGES.flatMap((p) => served(ctx.reg, p)),
    note: 'NO MAPPING RULE; pinging the key pages. Add a rule to scripts/indexnow-urls.ts',
    warn: true,
  }
}

export function ruleFor(file: string): { rule: Rule; m: RegExpMatchArray } | null {
  for (const rule of RULES) {
    const m = rule.match(file)
    if (m) return { rule, m }
  }
  return null
}

export async function deriveAll(changes: Change[], ctx: Ctx): Promise<FileResult[]> {
  const results: FileResult[] = []
  for (const change of changes) {
    const hit = ruleFor(change.file)
    let r: Omit<FileResult, 'file'>
    try {
      r = hit ? await hit.rule.derive(ctx, change, hit.m) : await fallback(ctx)
    } catch (err) {
      // An import or shape failure on one file must not cost every other
      // file its pings, and must not ping nothing for this one either.
      const fb = await fallback(ctx)
      r = { urls: fb.urls, note: `could not diff (${(err as Error).message}); pinging the key pages`, warn: true }
    }
    results.push({ file: change.file, urls: [...new Set(r.urls)].sort(), note: r.note, warn: r.warn })
  }
  return results
}

// ── Git plumbing ────────────────────────────────────────────────────────────

function git(root: string, args: string[]): string {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })
}

function gitHas(root: string, rev: string, rel: string): boolean {
  try {
    execFileSync('git', ['cat-file', '-e', `${rev}:${rel}`], { cwd: root, stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

async function importFile(abs: string): Promise<Record<string, unknown>> {
  return (await import(pathToFileURL(abs).href)) as Record<string, unknown>
}

/**
 * Head from disk, base from `git show`. The base copy is written NEXT TO the
 * original (same directory, so `./x` and `@/x` resolve exactly as the original
 * would) under a unique name, imported, and removed. A unique name per load is
 * also what keeps it out of the module cache the head import populated.
 */
export function gitLoader(root: string, baseRev: string): Loader {
  let seq = 0
  return {
    async head(rel) {
      const abs = path.join(root, rel)
      if (!existsSync(abs)) return null
      if (rel.endsWith('.json')) return JSON.parse(readFileSync(abs, 'utf8'))
      return importFile(abs)
    },
    async base(rel) {
      if (!gitHas(root, baseRev, rel)) return null
      const src = execFileSync('git', ['show', `${baseRev}:${rel}`], { cwd: root, maxBuffer: 256 * 1024 * 1024 })
      if (rel.endsWith('.json')) return JSON.parse(src.toString('utf8'))
      const abs = path.join(root, rel)
      const tmp = path.join(path.dirname(abs), `.indexnow-base-${process.pid}-${seq++}-${path.basename(abs)}`)
      writeFileSync(tmp, src)
      try {
        return await importFile(tmp)
      } finally {
        rmSync(tmp, { force: true })
      }
    },
  }
}

/** `git diff --name-status` over the trigger paths. Renames split into D + A. */
export function changedFiles(root: string, base: string, head: string): Change[] {
  const out = git(root, ['diff', '--no-renames', '--name-status', base, head, '--', ...TRIGGER_PATHS.map((p) => `:(glob)${p}`)])
  const changes: Change[] = []
  for (const line of out.split('\n')) {
    if (!line.trim()) continue
    const [status, file] = line.split('\t')
    const s = status[0] === 'A' || status[0] === 'D' ? status[0] : 'M'
    changes.push({ status: s as Change['status'], file })
  }
  return changes
}

// ── CLI ─────────────────────────────────────────────────────────────────────

const annotate = (msg: string) =>
  process.env.GITHUB_ACTIONS === 'true' ? `::warning title=IndexNow derivation::${msg}` : `WARN ${msg}`

async function main() {
  const argv = process.argv.slice(2)
  if (argv.includes('--self-test')) return selfTest()

  const baseIdx = argv.indexOf('--base')
  const baseArg = baseIdx === -1 ? undefined : argv[baseIdx + 1]
  if (!baseArg) {
    console.error('indexnow-urls: --base <rev> is required')
    process.exit(1)
  }
  const root = process.cwd()
  if (!existsSync(path.join(root, 'lib/translated-routes.ts'))) {
    console.error(`indexnow-urls: run from the repo root (no lib/translated-routes.ts under ${root})`)
    process.exit(1)
  }
  const base = git(root, ['rev-parse', '--verify', `${baseArg}^{commit}`]).trim()
  const head = git(root, ['rev-parse', '--verify', 'HEAD^{commit}']).trim()
  const dirty = git(root, ['status', '--porcelain', '--', ...HEAD_READ_PATHS]).trim()
  if (dirty) {
    console.error(`indexnow-urls: the tree differs from HEAD under ${HEAD_READ_PATHS.join(', ')}; commit or stash first:\n${dirty}`)
    process.exit(1)
  }

  const reg = (await importFile(path.join(root, 'lib/translated-routes.ts'))) as unknown as Registry
  const changes = changedFiles(root, base, head)
  console.error(`indexnow-urls: ${base.slice(0, 12)}..${head.slice(0, 12)}, ${changes.length} changed file(s) under the trigger paths`)
  const results = await deriveAll(changes, { reg, loader: gitLoader(root, base) })

  const statusOf = new Map(changes.map((c) => [c.file, c.status]))
  const all = new Set<string>()
  for (const r of results) {
    const line = `${statusOf.get(r.file)} ${r.file}: ${r.note} [${r.urls.length} URL(s)]`
    console.error(r.warn ? annotate(line) : `  ${line}`)
    for (const u of r.urls) all.add(u)
  }
  const urls = [...all].sort()
  const offSite = urls.filter((u) => !u.startsWith(`${SITE}/`))
  if (offSite.length) {
    console.error(`indexnow-urls: derived off-site URL(s), which is a bug here: ${offSite.join(', ')}`)
    process.exit(1)
  }
  console.error(`indexnow-urls: ${urls.length} unique URL(s)`)
  if (urls.length) process.stdout.write(`${urls.join('\n')}\n`)
}

// ── Self-test ───────────────────────────────────────────────────────────────

/**
 * The self-test's own equality, deliberately NOT sig(). The judges used to
 * compare through sig(), the function under test, so a sig() mutated to return
 * a constant made every judge agree with anything: 46 verdicts, 0 failures,
 * while the derivation pinged nothing for any edit. Found by mutation.
 */
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

/** A registry built from explicit (locale, path) registrations. */
function stubRegistry(registered: string[]): Registry {
  const norm = (p: string) => p.replace(/\/+$/, '') || '/'
  const set = new Set(registered.map((r) => {
    const [l, p] = splitKey(r)
    return `${l}:${norm(p)}`
  }))
  return {
    hasTranslationForLocale: (l, p) => set.has(`${l}:${norm(p)}`),
    getLocalesForPath: (p) => ['en', ...['th', 'ko', 'ja', 'zh'].filter((l) => set.has(`${l}:${norm(p)}`))],
  }
}

function memLoader(base: Record<string, Loaded>, head: Record<string, Loaded>): Loader {
  return { base: async (f) => base[f] ?? null, head: async (f) => head[f] ?? null }
}

const faq = (slug: string, locale: string, answer: string, status = 'published') => ({ slug, locale, status, answer })

interface Case {
  name: string
  changes: Change[]
  base: Record<string, Loaded>
  head: Record<string, Loaded>
  registered?: string[]
  /** Exact expected URL set (paths are made absolute). */
  want: string[]
  wantWarn?: boolean
}

const U = (p: string) => (p.startsWith('http') ? p : `${SITE}${p}`)

const CASES: Case[] = [
  {
    name: 'EN FAQ edit pings the FAQ and the pages that list EN FAQs, nothing else',
    changes: [{ status: 'M', file: 'data/faq-pages.ts' }],
    base: { 'data/faq-pages.ts': { faqPages: [faq('a', 'en', 'old'), faq('b', 'en', 'same')] } },
    head: { 'data/faq-pages.ts': { faqPages: [faq('a', 'en', 'new'), faq('b', 'en', 'same')] } },
    registered: ['ja:/faq/', 'ja:/faq/a/'],
    want: ['/faq/a/', '/faq/', '/golf-in-thailand-guide/', '/llms.txt', '/llms-full.txt'],
  },
  {
    name: 'ja FAQ edit pings only the ja page and the ja hub (not EN, not llms-full)',
    changes: [{ status: 'M', file: 'data/faq-pages.ts' }],
    base: { 'data/faq-pages.ts': { faqPages: [faq('a', 'en', 'x'), faq('a', 'ja', 'old')] } },
    head: { 'data/faq-pages.ts': { faqPages: [faq('a', 'en', 'x'), faq('a', 'ja', 'new')] } },
    registered: ['ja:/faq/', 'ja:/faq/a/'],
    want: ['/ja/faq/a/', '/ja/faq/', '/llms.txt'],
  },
  {
    name: 'an edit to an UNREGISTERED locale entry pings no locale URL (it would 301)',
    changes: [{ status: 'M', file: 'data/faq-pages.ts' }],
    base: { 'data/faq-pages.ts': { faqPages: [faq('a', 'ko', 'old')] } },
    head: { 'data/faq-pages.ts': { faqPages: [faq('a', 'ko', 'new')] } },
    registered: [],
    want: ['/llms.txt'],
  },
  {
    name: 'a newly published ko entry pings every locale of that slug (hreflang moved)',
    changes: [{ status: 'M', file: 'data/explainer-pages.ts' }],
    base: { 'data/explainer-pages.ts': { explainerPages: [faq('g', 'en', 'x'), faq('g', 'ko', 'y', 'draft')] } },
    head: { 'data/explainer-pages.ts': { explainerPages: [faq('g', 'en', 'x'), faq('g', 'ko', 'y')] } },
    registered: ['ko:/guide/g/', 'th:/guide/g/'],
    want: ['/guide/g/', '/th/guide/g/', '/ko/guide/g/', '/llms.txt'],
  },
  {
    name: 'a removed EN entry pings its (now dead) URL and its listings',
    changes: [{ status: 'M', file: 'data/activity-occasions.ts' }],
    base: { 'data/activity-occasions.ts': { activityOccasionPages: [faq('old', 'en', 'x'), faq('keep', 'en', 'k')] } },
    head: { 'data/activity-occasions.ts': { activityOccasionPages: [faq('keep', 'en', 'k')] } },
    want: ['/activities/old/', '/activities/'],
  },
  {
    name: 'a comment-only edit (identical records) pings nothing',
    changes: [{ status: 'M', file: 'data/hotel-pages.ts' }],
    base: { 'data/hotel-pages.ts': { hotelConciergePages: [faq('h', 'en', 'x')] } },
    head: { 'data/hotel-pages.ts': { hotelConciergePages: [faq('h', 'en', 'x')] } },
    want: [],
  },
  {
    name: 'a missing SEO export is an error that falls back loudly, never an empty diff',
    changes: [{ status: 'M', file: 'data/faq-pages.ts' }],
    base: { 'data/faq-pages.ts': { faqPages: [faq('a', 'en', 'x')] } },
    head: { 'data/faq-pages.ts': { renamedPages: [faq('a', 'en', 'x')] } },
    want: FALLBACK_PAGES,
    wantWarn: true,
  },
  {
    name: 'course edit pings the course in every registered locale plus its region roster',
    changes: [{ status: 'M', file: 'data/golf-courses/krabi/pakasai-country-club.ts' }],
    base: { 'data/golf-courses/krabi/pakasai-country-club.ts': { course: { fee: 1 } } },
    head: { 'data/golf-courses/krabi/pakasai-country-club.ts': { course: { fee: 2 } } },
    registered: ['ja:/golf-courses/krabi/pakasai-country-club', 'zh:/golf-courses/krabi/pakasai-country-club', 'ja:/golf-courses/krabi'],
    want: [
      '/golf-courses/krabi/pakasai-country-club/',
      '/ja/golf-courses/krabi/pakasai-country-club/',
      '/zh/golf-courses/krabi/pakasai-country-club/',
      '/golf-courses/krabi/',
      '/ja/golf-courses/krabi/',
    ],
  },
  {
    name: 'a course file with no semantic change pings nothing',
    changes: [{ status: 'M', file: 'data/golf-courses/krabi/pakasai-country-club.ts' }],
    base: { 'data/golf-courses/krabi/pakasai-country-club.ts': { course: { fee: 1 } } },
    head: { 'data/golf-courses/krabi/pakasai-country-club.ts': { course: { fee: 1 } } },
    want: [],
  },
  {
    name: 'a deleted course pings its EN URL (now a redirect) and the roster',
    changes: [{ status: 'D', file: 'data/golf-courses/bangkok/gone-club.ts' }],
    base: { 'data/golf-courses/bangkok/gone-club.ts': { course: { fee: 1 } } },
    head: {},
    want: ['/golf-courses/bangkok/gone-club/', '/golf-courses/bangkok/'],
  },
  {
    name: 'a region index.ts is the roster, not a course: hub + /golf-courses/',
    changes: [{ status: 'M', file: 'data/golf-courses/krabi/index.ts' }],
    base: { 'data/golf-courses/krabi/index.ts': { default: { slugs: ['a'] } } },
    head: { 'data/golf-courses/krabi/index.ts': { default: { slugs: ['a', 'b'] } } },
    registered: ['th:/golf-courses/', 'th:/golf-courses/krabi'],
    want: ['/golf-courses/krabi/', '/th/golf-courses/krabi/', '/golf-courses/', '/th/golf-courses/'],
  },
  {
    name: 'a predicate edit counts as a change (functions serialise by source)',
    changes: [{ status: 'M', file: 'data/golf-courses-use-cases.ts' }],
    base: { 'data/golf-courses-use-cases.ts': { USE_CASE_RULES: { beginners: { predicate: (c: number) => c > 1 } } } },
    head: { 'data/golf-courses-use-cases.ts': { USE_CASE_RULES: { beginners: { predicate: (c: number) => c > 2 } } } },
    want: ['/golf-courses/best-for/beginners/', '/golf-courses/'],
  },
  {
    name: 'a registered course translation pings the course in every locale, and the roster',
    changes: [{ status: 'M', file: 'data/golf-courses-i18n.ts' }],
    base: { 'data/golf-courses-i18n.ts': { REGION_HUB_I18N: {}, COURSE_DETAIL_I18N: [] } },
    head: { 'data/golf-courses-i18n.ts': { REGION_HUB_I18N: {}, COURSE_DETAIL_I18N: [{ region: 'krabi', slug: 'p', locales: ['ja'] }] } },
    registered: ['ja:/golf-courses/krabi/p'],
    want: ['/golf-courses/krabi/p/', '/ja/golf-courses/krabi/p/', '/golf-courses/krabi/'],
  },
  {
    name: 'a localized hub copy edit pings that hub in that locale, its /golf-courses/ and llms.txt',
    changes: [{ status: 'M', file: 'data/golf-courses-i18n.ts' }],
    base: { 'data/golf-courses-i18n.ts': { REGION_HUB_I18N: { krabi: { ja: { label: 'a' } } }, COURSE_DETAIL_I18N: [] } },
    head: { 'data/golf-courses-i18n.ts': { REGION_HUB_I18N: { krabi: { ja: { label: 'b' } } }, COURSE_DETAIL_I18N: [] } },
    registered: ['ja:/golf-courses/krabi', 'ja:/golf-courses/'],
    want: ['/ja/golf-courses/krabi/', '/ja/golf-courses/', '/llms.txt'],
  },
  {
    name: 'a ja-only tier translation edit pings the ja tier page and ja /golf-courses/',
    changes: [{ status: 'M', file: 'data/price-tiers.ts' }],
    base: { 'data/price-tiers.ts': { PRICE_TIERS: [{ slug: '1500-baht' }], PRICE_TIER_I18N: { '1500-baht': { ja: { title: 'a' } } } } },
    head: { 'data/price-tiers.ts': { PRICE_TIERS: [{ slug: '1500-baht' }], PRICE_TIER_I18N: { '1500-baht': { ja: { title: 'b' } } } } },
    registered: ['ja:/golf-courses/under/1500-baht', 'ja:/golf-courses/'],
    want: ['/ja/golf-courses/under/1500-baht/', '/ja/golf-courses/'],
  },
  {
    name: 'faq-hub: an EN edit pings /faq/ and llms-full.txt; locales falling back to EN are not served',
    changes: [{ status: 'M', file: 'data/faq-hub.ts' }],
    base: { 'data/faq-hub.ts': { getFaqHubContent: (l: string) => (l === 'th' ? 'th' : 'en-old') } },
    head: { 'data/faq-hub.ts': { getFaqHubContent: (l: string) => (l === 'th' ? 'th' : 'en-new') } },
    registered: ['th:/faq/'],
    want: ['/faq/', '/llms-full.txt'],
  },
  {
    name: 'a blog slug entering ja pings the EN post, the ja post and the ja blog index',
    changes: [{ status: 'M', file: 'data/blog-translated-slugs.ts' }],
    base: { 'data/blog-translated-slugs.ts': { BLOG_TRANSLATED_SLUGS: { ja: [] } } },
    head: { 'data/blog-translated-slugs.ts': { BLOG_TRANSLATED_SLUGS: { ja: ['post'] } } },
    registered: ['ja:/blog/post', 'ja:/blog'],
    want: ['/blog/post/', '/ja/blog/post/', '/ja/blog/'],
  },
  {
    name: 'messages/ko.json pings the key pages ko actually serves, nothing in EN',
    changes: [{ status: 'M', file: 'messages/ko.json' }],
    base: { 'messages/ko.json': { Golf: { a: '1' }, Nav: { b: '1' } } },
    head: { 'messages/ko.json': { Golf: { a: '2' }, Nav: { b: '1' } } },
    registered: ['ko:/', 'ko:/golf'],
    want: ['/ko/', '/ko/golf/'],
  },
  {
    name: 'a glossary edit pings nothing (lint-only input)',
    changes: [{ status: 'M', file: 'data/i18n-glossary/ja.json' }],
    base: {},
    head: {},
    want: [],
  },
  {
    name: 'a file no rule claims falls back to the key pages with a warning',
    changes: [{ status: 'A', file: 'data/brand-new-module.ts' }],
    base: {},
    head: {},
    want: FALLBACK_PAGES,
    wantWarn: true,
  },
  {
    name: 'an llms route source edit pings exactly that file',
    changes: [{ status: 'M', file: 'app/llms-full.txt/route.ts' }],
    base: {},
    head: {},
    want: ['/llms-full.txt'],
  },
  {
    name: 'pricing.ts pings its six direct consumers',
    changes: [{ status: 'M', file: 'data/pricing.ts' }],
    base: { 'data/pricing.ts': { bayRates: [1] } },
    head: { 'data/pricing.ts': { bayRates: [2] } },
    want: ['/', '/golf/', '/lessons/', '/events/', '/corporate-golf-packages/', '/llms-full.txt'],
  },
]

/**
 * Every file under app/, components/ or lib/ that consumes a data module this
 * script maps, and what the mapping does about it. The self-test derives the
 * real consumer set from source (the TypeScript preprocessor for imports, the
 * AST for lib/seo-pages getter calls) and requires EXACT equality, so a new
 * page that starts rendering a data module fails CI until someone decides
 * whether its URL should be pinged. Course files are loaded by a template-
 * literal import in lib/golf-courses.ts and are not enumerable this way; their
 * derived-page ripple (compare/near/under/best-for) is category (3) above.
 */
const CONSUMERS: Record<string, Record<string, string>> = {
  'lib/seo-pages getters': {
    'app/[locale]/activities/[slug]/page.tsx': 'pinged: the entry page',
    'app/[locale]/best/[slug]/page.tsx': 'pinged: the entry page',
    'app/[locale]/cost/[slug]/page.tsx': 'pinged: the entry page',
    'app/[locale]/faq/[slug]/page.tsx': 'pinged: the entry page',
    'app/[locale]/guide/[slug]/page.tsx': 'pinged: the entry page',
    'app/[locale]/hotels/[slug]/page.tsx': 'pinged: the entry page',
    'app/[locale]/activities/page.tsx': 'pinged: SEO_LISTINGS',
    'app/[locale]/faq/page.tsx': 'pinged: SEO_LISTINGS',
    'app/[locale]/golf-in-thailand-guide/page.tsx': 'pinged: SEO_LISTINGS',
    'app/[locale]/hotels/page.tsx': 'pinged: SEO_LISTINGS',
    'app/llms.txt/route.ts': 'pinged: SEO_LISTINGS',
    'app/llms-full.txt/route.ts': 'pinged: SEO_LISTINGS',
    'app/sitemap.ts': 'ignored: the sitemap is not a pinged URL',
    'components/home/KoreaLandingPage.tsx': 'ignored: four hardcoded ko guide cross-links, category (3)',
    'lib/seo-links.ts': 'ignored: related-link titles, category (3)',
  },
  'data/pricing.ts': {
    'app/[locale]/page.tsx': 'pinged',
    'app/[locale]/golf/page.tsx': 'pinged',
    'app/[locale]/lessons/page.tsx': 'pinged',
    'app/[locale]/events/page.tsx': 'pinged',
    'app/[locale]/corporate-golf-packages/page.tsx': 'pinged',
    'app/llms-full.txt/route.ts': 'pinged',
    'lib/jsonld.ts': 'ignored: JSON-LD builders called by the pages above',
  },
  'data/coaches.ts': { 'app/[locale]/lessons/page.tsx': 'pinged' },
  'data/event-clients.ts': { 'app/[locale]/events/page.tsx': 'pinged' },
  'data/food-menu.ts': {
    'app/[locale]/menu/page.tsx': 'pinged',
    'lib/jsonld.ts': 'ignored: the menu JSON-LD renders on /menu/',
  },
  'data/faq-hub.ts': {
    'app/[locale]/faq/page.tsx': 'pinged',
    'app/llms-full.txt/route.ts': 'pinged: EN only',
  },
  'data/golf-courses-i18n.ts': {
    'app/[locale]/golf-courses/[region]/page.tsx': 'pinged: the hub',
    'app/[locale]/golf-courses/[region]/[slug]/page.tsx': 'pinged: registered course pages',
    'app/[locale]/golf-courses/page.tsx': 'pinged: region cards',
    'app/llms.txt/route.ts': 'pinged: localized hub labels',
    'components/golf-courses/RegionHubLinks.tsx': 'ignored: homepage and /golf/ region chips, category (3)',
  },
  'data/price-tiers.ts': {
    'app/[locale]/golf-courses/under/[tier]/page.tsx': 'pinged: the tier page',
    'app/[locale]/golf-courses/page.tsx': 'pinged: tier list',
    'app/[locale]/golf-courses/[region]/[slug]/page.tsx': 'ignored: a course\'s tier cross-link, category (3)',
    'lib/golf-courses-derived.ts': 'ignored: derives the tier rosters rendered by the tier page',
  },
  'data/bts-stations.ts': {
    'app/[locale]/golf-courses/near/[station]/page.tsx': 'pinged: the station page',
    'app/[locale]/golf-courses/page.tsx': 'pinged: station list',
    'app/[locale]/golf-courses/[region]/[slug]/page.tsx': 'ignored: nearest-station line on a course, category (3)',
    'lib/golf-courses-derived.ts': 'ignored: derives the proximity rosters rendered by the station page',
    'lib/seo-links.ts': 'ignored: related-link labels, category (3)',
  },
  'data/airports.ts': {
    'app/[locale]/golf-courses/near/[station]/page.tsx': 'pinged: the airport page',
    'app/[locale]/golf-courses/page.tsx': 'pinged: airport list',
    'lib/golf-courses-derived.ts': 'ignored: derives the proximity rosters rendered by the airport page',
    'lib/seo-links.ts': 'ignored: related-link labels, category (3)',
  },
  'data/golf-courses-use-cases.ts': {
    'app/[locale]/golf-courses/best-for/[useCase]/page.tsx': 'pinged: the use-case page',
    'app/[locale]/golf-courses/page.tsx': 'pinged: use-case list',
    'app/[locale]/golf-courses/[region]/[slug]/page.tsx': 'ignored: a course\'s use-case cross-links, category (3)',
    'app/sitemap.ts': 'ignored: the sitemap is not a pinged URL',
    'lib/golf-courses-derived.ts': 'ignored: derives the rosters rendered by the use-case page',
  },
  'data/blog-translated-slugs.ts': {
    'lib/translated-routes.ts': 'ignored: the registry itself (read at HEAD for fan-out)',
  },
}

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

const rel = (root: string, p: string) => path.relative(root, p).split(path.sep).join('/')

async function consumerChecks(root: string): Promise<Verdict[]> {
  const ts = (await import('typescript')).default
  const sources = ['app', 'components', 'lib']
    .flatMap((d) => walk(path.join(root, d)))
    .filter((p) => /\.(ts|tsx)$/.test(p))
  const found: Record<string, Set<string>> = Object.fromEntries(Object.keys(CONSUMERS).map((k) => [k, new Set<string>()]))
  const GETTERS = new Set(['getSeoPagesByType', 'getSeoPageBySlug', 'getAllSeoPageParams', 'getAllSeoPageSlugsWithDates'])
  for (const abs of sources) {
    const file = rel(root, abs)
    const text = readFileSync(abs, 'utf8')
    for (const imp of ts.preProcessFile(text, true, true).importedFiles) {
      // `@/data/x` and relative `../data/x` alike (lib/translated-routes.ts
      // imports the blog mirror relatively).
      const spec = imp.fileName
      const target = spec.startsWith('@/')
        ? spec.slice(2)
        : spec.startsWith('.')
          ? path.posix.normalize(path.posix.join(path.posix.dirname(file), spec))
          : null
      const key = target ? `${target.replace(/\.tsx?$/, '')}.ts` : null
      if (key && found[key]) found[key].add(file)
    }
    if (file === 'lib/seo-pages.ts') continue // the getters' own definitions
    const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, false, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS)
    let calls = false
    const visit = (n: import('typescript').Node) => {
      if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && GETTERS.has(n.expression.text)) calls = true
      if (!calls) ts.forEachChild(n, visit)
    }
    visit(sf)
    if (calls) found['lib/seo-pages getters'].add(file)
  }
  return Object.entries(CONSUMERS).map(([mod, declared]) => {
    const got = [...found[mod]].sort()
    const want = Object.keys(declared).sort()
    const missing = got.filter((f) => !want.includes(f))
    const stale = want.filter((f) => !got.includes(f))
    return {
      ok: missing.length === 0 && stale.length === 0 && got.length > 0,
      label: `[consumers] ${mod}: ${got.length} found, ${want.length} declared`,
      detail: [
        missing.length ? `unclassified consumer(s): ${missing.join(', ')} (decide pinged vs ignored in CONSUMERS)` : '',
        stale.length ? `declared but no longer a consumer: ${stale.join(', ')}` : '',
        got.length === 0 ? 'found none: the scan is not reading source' : '',
      ].filter(Boolean).join('; '),
    }
  })
}

async function structuralChecks(root: string): Promise<Verdict[]> {
  const v: Verdict[] = []

  // sig() directly, both directions. The derivation cases catch a sig() that
  // stopped discriminating only because they no longer compare through it.
  v.push({
    ok:
      sig({ a: 1 }) !== sig({ a: 2 }) &&
      sig([1]) !== sig([2]) &&
      sig({ f: (c: number) => c > 1 }) !== sig({ f: (c: number) => c > 2 }) &&
      sig({ a: 1, b: [2] }) === sig({ a: 1, b: [2] }),
    label: '[sig] tells values and function sources apart, and equal values equal',
  })

  // (a) SEO_SECTIONS against lib/seo-pages.ts, by identity.
  const seo = await importFile(path.join(root, 'lib/seo-pages.ts'))
  const pageDataMap = seo.PAGE_DATA_MAP as Record<string, unknown>
  const prefixMap = seo.ROUTE_PREFIX_TO_TYPE as Record<string, string>
  for (const s of SEO_SECTIONS) {
    const mod = await importFile(path.join(root, s.file))
    v.push({
      ok: pageDataMap[s.type] === mod[s.exportName] && prefixMap[s.prefix] === s.type,
      label: `[tables] ${s.file} is PAGE_DATA_MAP.${s.type} and ROUTE_PREFIX_TO_TYPE.${s.prefix}`,
    })
  }
  const types = SEO_SECTIONS.map((s) => s.type as string).sort()
  v.push({
    ok: same(Object.keys(pageDataMap).sort(), types) && same(Object.values(prefixMap).sort(), types),
    label: `[tables] SEO_SECTIONS covers every PAGE_DATA_MAP / ROUTE_PREFIX_TO_TYPE entry (${types.length})`,
    detail: `PAGE_DATA_MAP=${Object.keys(pageDataMap).sort().join(',')} ROUTE_PREFIX_TO_TYPE=${Object.values(prefixMap).sort().join(',')}`,
  })

  // (b) Every file under the trigger paths today hits a real rule, not the fallback.
  const dataFiles = [...walk(path.join(root, 'data')), ...walk(path.join(root, 'messages')), ...walk(path.join(root, 'app/llms.txt')), ...walk(path.join(root, 'app/llms-full.txt'))]
    .map((p) => rel(root, p))
    .filter((f) => !path.basename(f).startsWith('.'))
  const unmapped = dataFiles.filter((f) => !ruleFor(f))
  v.push({
    ok: unmapped.length === 0 && dataFiles.length >= 150,
    label: `[coverage] ${dataFiles.length} trigger-path file(s), ${unmapped.length} with no rule`,
    detail: unmapped.length ? `unmapped: ${unmapped.join(', ')}` : `only ${dataFiles.length} files seen: the walk is not reading data/`,
  })

  // (c) TRIGGER_PATHS equals the workflow's on.push.paths.
  // CRLF-normalised: a Windows checkout otherwise matches nothing.
  const yml = readFileSync(path.join(root, '.github/workflows/indexnow.yml'), 'utf8').replace(/\r\n/g, '\n')
  const block = yml.match(/\n {4}paths:\n((?: {6}- .+\n)+)/)
  const wfPaths = block ? [...block[1].matchAll(/- '([^']+)'/g)].map((x) => x[1]) : []
  v.push({
    ok: same(wfPaths, TRIGGER_PATHS),
    label: `[workflow] indexnow.yml on.push.paths == TRIGGER_PATHS`,
    detail: `workflow: ${wfPaths.join(', ') || '(not found)'}; script: ${TRIGGER_PATHS.join(', ')}`,
  })

  // (d) LOCALES (catalogs, faq-hub) is the registry's locale set.
  const registry = await importFile(path.join(root, 'lib/translated-routes.ts'))
  const allLocales = [...(registry.ALL_LOCALES as string[])].sort()
  v.push({
    ok: same(allLocales, [...LOCALES].sort()),
    label: '[tables] LOCALES == lib/translated-routes.ts ALL_LOCALES',
    detail: `ALL_LOCALES=${allLocales.join(',')} LOCALES=${LOCALES.join(',')}`,
  })

  // (e) The git loader reads the BASE revision as a distinct module and cleans up.
  const loader = gitLoader(root, 'HEAD')
  const probe = 'data/faq-pages.ts'
  const [b, h] = await Promise.all([loader.base(probe), loader.head(probe)])
  const leftovers = readdirSync(path.join(root, 'data')).filter((n) => n.startsWith('.indexnow-base-'))
  v.push({
    ok: !!b && !!h && b !== h && b.faqPages !== h.faqPages && same(b.faqPages, h.faqPages) && Array.isArray(b.faqPages) && (b.faqPages as unknown[]).length > 50 && leftovers.length === 0,
    label: `[loader] base copy of ${probe} at HEAD is a separate module equal to the working tree, temp file removed`,
    detail: `base=${!!b} head=${!!h} sameObject=${b === h} leftovers=${leftovers.join(',')}`,
  })
  v.push({
    ok: (await loader.base('data/definitely-not-a-file.ts')) === null,
    label: '[loader] a path absent at the base revision loads as null (an added file)',
  })
  return v
}

async function selfTest(): Promise<void> {
  const root = process.cwd()
  const results: { c: Case; got: FileResult[] }[] = []
  for (const c of CASES) {
    results.push({ c, got: await deriveAll(c.changes, { reg: stubRegistry(c.registered ?? []), loader: memLoader(c.base, c.head) }) })
  }
  const derived = runSelfTest('indexnow-urls', results, ({ c, got }) => {
    const urls = [...new Set(got.flatMap((r) => r.urls))].sort()
    const want = [...new Set(c.want.map(U))].sort()
    const warned = got.some((r) => r.warn)
    const ok = same(urls, want) && warned === !!c.wantWarn
    return {
      ok,
      label: c.name,
      detail: `want ${want.length} [${want.join(' ')}] warn=${!!c.wantWarn}; got ${urls.length} [${urls.join(' ')}] warn=${warned} (${got.map((r) => r.note).join(' | ')})`,
    }
  })
  const structural = runSelfTest('indexnow-urls', [...(await structuralChecks(root)), ...(await consumerChecks(root))], (x) => x)

  const examined = derived.examined + structural.examined
  const failures = derived.failures + structural.failures
  // Exact, not a floor: the derivation cases; one table verdict per SEO
  // section plus seven more (sig, section union, coverage, workflow paths,
  // locales, two loader checks); one consumer verdict per CONSUMERS key.
  const expected = CASES.length + SEO_SECTIONS.length + 7 + Object.keys(CONSUMERS).length
  if (CASES.length !== 22 || examined !== expected) {
    console.log(`FAIL: examined ${examined} verdict(s), expected ${expected} (CASES=${CASES.length}, want 22)`)
    process.exit(1)
  }
  if (failures > 0) {
    console.log(`\n${failures} of ${examined} failed`)
    process.exit(1)
  }
  console.log(`\nindexnow-urls self-test: ${examined} verdict(s), 0 failures · OK`)
}

main().catch((err) => {
  console.error(`indexnow-urls: ${(err as Error).stack ?? err}`)
  process.exit(1)
})
