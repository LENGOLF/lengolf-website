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
 * "what did this commit range change" answer). Consumed by the `indexnow` job
 * in .github/workflows/deploy-check.yml, which hands stdout to
 * scripts/indexnow-ping.ts once the `wait-for-deploy` job has seen the push go
 * live.
 * Every changed file also gets one line on stderr saying what it mapped to or
 * why it mapped to nothing, so an empty result is legible rather than silent.
 *
 * WHY THIS EXISTS. The workflow used to map course files to their EN URL with
 * sed and everything else to a fixed key-page list. So a translated course page
 * (/ja/golf-courses/<region>/<slug>/) was never pinged, and an edit to one FAQ
 * pinged eleven key pages, eight of which do not render it, while omitting the
 * FAQ itself.
 *
 * HOW A FILE BECOMES URLS. Each changed file is matched against RULES (first
 * match wins), then:
 *   1. Code fingerprint. Both revisions are parsed and compared leaf token by
 *      leaf token, so comments, whitespace, quote style and trailing commas drop
 *      out. Equal fingerprints -> nothing to ping, and nothing is imported.
 *   2. Semantic diff. The file is imported at both revisions (the base copy via
 *      `git show`, written next to the original so its relative and `@/`
 *      imports resolve identically) and its records are compared with sig(),
 *      which serialises functions by their source so a predicate edit counts.
 *      One changed FAQ entry yields that FAQ's URLs.
 *   3. Fan-out through the registry (lib/translated-routes.ts), never through
 *      the data file's own locale tags: a locale URL that is not registered 301s
 *      to English. A record this push REMOVED is the exception: it pings every
 *      URL the BASE registry served for it, because those now redirect and the
 *      index should learn so.
 *
 * WHAT A CHANGED RECORD PINGS, and the one rule that decides it:
 *   (1) the page whose subject IS the record, in every locale it reaches;
 *   (2) the pages that ENUMERATE records of that kind (section hubs, the region
 *       roster, /llms.txt, /llms-full.txt);
 *   NOT (3) pages that merely cross-link or embed a label of it: related-guide
 *       links, the homepage region chips, a course's card on /compare/, /near/,
 *       /under/ or /best-for/, a hub label printed on its courses. Those ripples
 *       are real, and are left to the crawler's own recrawl on purpose: chasing
 *       them turns one edit into hundreds of pings.
 * A record whose set of LOCALES changed (added, removed, draft <-> published)
 * pings every locale of it, not just the one that moved, because the hreflang
 * cluster on every sibling changed with it.
 *
 * WHEN THE PRECISE ANSWER CANNOT BE TRUSTED, the file's rule falls back to its
 * COARSE set, every URL the file can feed, with a warning (a GitHub annotation
 * in Actions). That covers a module that fails to import at either revision, an
 * exported value that changed outside the records a rule diffs (a helper
 * function, a non-record export), and code that changed while no exported value
 * did (a module-private constant read by an exported function). A file no rule
 * claims falls back to the old key-page list with a warning, and the self-test
 * fails on any file under the trigger paths that would hit that today.
 *
 * KNOWN LIMITS, by design: messages/<l>.json maps to that locale's key pages,
 * not to the routes its changed namespaces render (an edit to a namespace used
 * only on course, hub or tier pages pings none of the pages that changed), and
 * rendered content living outside the trigger paths (lib/translated-routes.ts,
 * REGION_META in lib/golf-courses.ts, FAQ_L10N in lib/course-seo.ts) never
 * starts this workflow.
 */
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmdirSync, rmSync, statSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import type * as TS from 'typescript'
import { runSelfTest, type Verdict } from './self-test-harness'

export const SITE = 'https://www.len.golf'

/**
 * The pathspec this script diffs. .github/workflows/deploy-check.yml runs on
 * EVERY push to main, with no `paths:` filter (asserted by the self-test), so
 * no trigger can be narrower than this list. When this lived in its own
 * path-filtered workflow the two lists had to match exactly: a path this
 * script diffs but the workflow did not trigger on was a push that never ran.
 */
export const TRIGGER_PATHS = ['data/**', 'messages/**', 'app/llms.txt/**', 'app/llms-full.txt/**']

/** Paths whose working-tree state the head side reads. Must be clean. */
const HEAD_READ_PATHS = ['data', 'messages', 'lib', 'types', 'app/llms.txt', 'app/llms-full.txt']

/**
 * Pages that render UI-catalog strings from nearly every namespace. A messages/
 * edit maps here (in that catalog's locale only: i18n/request.ts loads exactly
 * one catalog, with no EN merge). A proxy, not a derivation: see KNOWN LIMITS.
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
  /** Raw source at a revision; null = absent, undefined = not available (treat as changed). */
  source(side: 'base' | 'head', rel: string): Promise<string | null | undefined>
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
  /** The registry as of the base revision, for records this push removed. */
  baseReg: Registry
  loader: Loader
}

// ── URL helpers ─────────────────────────────────────────────────────────────

const isFilePath = (p: string) => /\.[a-z0-9]+$/i.test(p)

/** Absolute URL for a locale-free route path in `locale`. */
export function pageUrl(locale: string, p: string): string {
  const route = p === '/' || isFilePath(p) ? p : `${p.replace(/\/+$/, '')}/`
  return `${SITE}${locale === 'en' ? '' : `/${locale}`}${route}`
}

/** EN plus every locale `reg` serves `p` in. Files are EN-only. */
function served(reg: Registry, p: string): string[] {
  if (isFilePath(p)) return [pageUrl('en', p)]
  return reg.getLocalesForPath(p).map((l) => pageUrl(l, p))
}

/** `p` in `locale` alone, or nothing when that locale does not serve it. */
function inLocale(reg: Registry, locale: string, p: string): string[] {
  if (isFilePath(p)) return locale === 'en' ? [pageUrl('en', p)] : []
  return locale === 'en' || reg.hasTranslationForLocale(locale, p) ? [pageUrl(locale, p)] : []
}

/** Every URL `p` has at head OR had at base: for records added or removed. */
function servedEither(ctx: Ctx, p: string): string[] {
  return [...served(ctx.reg, p), ...served(ctx.baseReg, p)]
}

// ── Comparison ──────────────────────────────────────────────────────────────

/**
 * Stable serialisation for "did this record change". Functions serialise by
 * their SOURCE: USE_CASE_RULES carries `predicate`/`reasonFor` functions, and
 * plain JSON.stringify drops them, so a predicate edit would read as "no
 * change". Both revisions are compiled by the same tsx/esbuild, so identical
 * source yields identical text. A value a function closes over is NOT in its
 * source; the code fingerprint below is what catches that one.
 */
export function sig(value: unknown): string {
  return (
    JSON.stringify(value, (_k, v) => (typeof v === 'function' ? `ƒ ${String(v)}` : v)) ?? 'undefined'
  )
}

/** sig() of a whole module, ignoring the exports a keyed diff covers. */
function moduleSig(mod: Loaded, omit: readonly string[] = []): string {
  if (!mod) return 'absent'
  const keys = Object.keys(mod)
    .filter((k) => !omit.includes(k) && k !== 'default' && k !== '__esModule')
    .sort()
  return sig(Object.fromEntries(keys.map((k) => [k, mod[k]])))
}

let tsModule: typeof TS | null = null
async function loadTs(): Promise<typeof TS> {
  tsModule ??= ((await import('typescript')) as unknown as { default: typeof TS }).default
  return tsModule
}

/**
 * The file's code with everything that cannot change behaviour removed: the
 * leaf tokens of the parse tree (so comments, JSDoc and whitespace are gone),
 * string and template literals by COOKED value (so 'a' and "a" match), and a
 * comma directly before a closer dropped. A parser, not a scanner: a raw
 * scanner mis-tokenises a template literal's tail and would read `//` inside it
 * as a comment.
 */
export async function codeFingerprint(src: string, fileName: string): Promise<string> {
  const ts = await loadTs()
  const sf = ts.createSourceFile(fileName, src, ts.ScriptTarget.Latest, false, fileName.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS)
  const leaves: { kind: number; text: string }[] = []
  const visit = (n: TS.Node) => {
    if (n.kind >= ts.SyntaxKind.FirstJSDocNode && n.kind <= ts.SyntaxKind.LastJSDocNode) return
    const kids = n.getChildren(sf)
    if (kids.length > 0) {
      for (const k of kids) visit(k)
      return
    }
    if (n.kind === ts.SyntaxKind.EndOfFileToken) return
    const cooked = ts.isStringLiteralLike(n) || ts.isTemplateLiteralToken(n)
    leaves.push({ kind: n.kind, text: cooked ? JSON.stringify((n as TS.LiteralLikeNode).text) : n.getText(sf) })
  }
  visit(sf)
  const closers = new Set<number>([ts.SyntaxKind.CloseBraceToken, ts.SyntaxKind.CloseBracketToken, ts.SyntaxKind.CloseParenToken])
  return leaves
    .filter((t, i) => !(t.kind === ts.SyntaxKind.CommaToken && leaves[i + 1] && closers.has(leaves[i + 1].kind)))
    .map((t) => `${t.kind}|${t.text}`)
    .join('\n')
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
const touched = (d: KeyedDiff) => [...d.modified, ...d.added, ...d.removed]

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

/** Array of records with a key field -> Map. */
function arrayMap(mod: Loaded, exportName: string, key: (e: Record<string, unknown>) => string): Map<string, unknown> {
  const m = new Map<string, unknown>()
  const arr = mod?.[exportName]
  if (Array.isArray(arr)) for (const e of arr as Record<string, unknown>[]) m.set(key(e), e)
  return m
}

const splitKey = (k: string): [string, string] => {
  const i = k.indexOf(':')
  return [k.slice(0, i), k.slice(i + 1)]
}

// ── Rules ───────────────────────────────────────────────────────────────────

/**
 * What a rule's precise diff concluded:
 *   'records'      some records changed; `urls` are theirs (possibly none)
 *   'none'         no exported value changed at all
 *   'unattributed' an export changed that no record diff covers
 * 'none' on a file whose code fingerprint changed, and 'unattributed', both
 * resolve to the rule's coarse set in deriveAll.
 */
type Verdict_ =
  | { kind: 'records'; urls: string[]; note: string }
  | { kind: 'none' }
  | { kind: 'unattributed'; note: string }

interface Rule {
  id: string
  match: (file: string) => RegExpMatchArray | null
  derive: (ctx: Ctx, base: Loaded, head: Loaded, change: Change, m: RegExpMatchArray) => Promise<Verdict_> | Verdict_
  /** Every URL this file can feed, at either revision. The superset used when derive cannot be trusted. */
  coarse: (ctx: Ctx, change: Change, m: RegExpMatchArray) => Promise<string[]> | string[]
  /** Renders nowhere: no fingerprint, no import, never pings. */
  inert?: string
  /**
   * Decided from the source fingerprint alone, never imported. For route
   * files: app/llms.txt/route.ts pulls in a server-only module, so importing it
   * throws and a real edit read as a failed diff with a false warning.
   */
  sourceOnly?: boolean
}

/** Loads the head module, and the base one too when it imports, for a coarse set. */
async function bothForCoarse(ctx: Ctx, file: string): Promise<Loaded[]> {
  const head = await ctx.loader.head(file)
  const base = await ctx.loader.base(file).catch(() => null)
  return [base, head]
}

/**
 * The six SEO sections: data file, its exported array, the page type it is
 * registered under in lib/seo-pages.ts (PAGE_DATA_MAP) and the route prefix
 * (ROUTE_PREFIX_TO_TYPE). The self-test asserts this table against both maps
 * (each row's array must equal, by content, the array PAGE_DATA_MAP holds for
 * its type), so a section added there without a row here fails CI.
 */
export const SEO_SECTIONS = [
  { file: 'data/faq-pages.ts', exportName: 'faqPages', type: 'faq', prefix: 'faq' },
  { file: 'data/explainer-pages.ts', exportName: 'explainerPages', type: 'explainer', prefix: 'guide' },
  { file: 'data/price-guide-pages.ts', exportName: 'priceGuidePages', type: 'price_guide', prefix: 'cost' },
  { file: 'data/best-of-listicle-pages.ts', exportName: 'bestOfListiclePages', type: 'best_of_listicle', prefix: 'best' },
  { file: 'data/activity-occasions.ts', exportName: 'activityOccasionPages', type: 'activity_occasion', prefix: 'activities' },
  { file: 'data/hotel-pages.ts', exportName: 'hotelConciergePages', type: 'hotel_concierge', prefix: 'hotels' },
] as const
type SeoSection = (typeof SEO_SECTIONS)[number]

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

function seoRule(section: SeoSection): Rule {
  const pagePath = (slug: string) => `/${section.prefix}/${slug}/`
  const entryUrls = (ctx: Ctx, locale: string, slug: string) => [
    ...inLocale(ctx.reg, locale, pagePath(slug)),
    ...listingUrls(ctx.reg, section.type, locale),
  ]
  return {
    id: `seo:${section.prefix}`,
    match: (f) => (f === section.file ? [f] : null),
    derive(ctx, base, head) {
      const d = diffKeyed(seoEntryMap(base, section.exportName), seoEntryMap(head, section.exportName))
      if (moduleSig(base, [section.exportName]) !== moduleSig(head, [section.exportName])) {
        return { kind: 'unattributed', note: `an export other than \`${section.exportName}\` changed` }
      }
      if (diffSize(d) === 0) return { kind: 'none' }
      const urls: string[] = []
      for (const k of d.modified) urls.push(...entryUrls(ctx, ...splitKey(k)))
      // The locale SET of this slug moved: every sibling's hreflang changed.
      for (const k of [...d.added, ...d.removed]) {
        const [locale, slug] = splitKey(k)
        urls.push(...servedEither(ctx, pagePath(slug)), ...entryUrls(ctx, locale, slug))
      }
      return { kind: 'records', urls, note: `${section.exportName}: ${describe(d)}` }
    },
    async coarse(ctx) {
      const [base, head] = await bothForCoarse(ctx, section.file)
      const urls: string[] = []
      for (const mod of [base, head]) {
        for (const k of seoEntryMap(mod, section.exportName).keys()) {
          const [locale, slug] = splitKey(k)
          urls.push(...servedEither(ctx, pagePath(slug)), ...entryUrls(ctx, locale, slug))
        }
      }
      return urls
    },
  }
}

/** A small module feeding a fixed set of pages: any change pings all of them. */
function fixedRule(file: string, pages: string[]): Rule {
  const urls = (ctx: Ctx) => pages.flatMap((p) => served(ctx.reg, p))
  return {
    id: `fixed:${file}`,
    match: (f) => (f === file ? [f] : null),
    derive: (ctx, base, head) =>
      moduleSig(base) === moduleSig(head) ? { kind: 'none' } : { kind: 'records', urls: urls(ctx), note: `changed -> ${pages.join(' ')}` },
    coarse: (ctx) => urls(ctx),
  }
}

/**
 * A Record<slug, T> module where each slug owns one page, plus listing URLs
 * pinged on any change. `listings` returns URLs, not paths, because the lists
 * on /golf-courses/ that these feed render for EN only.
 */
function recordRule(file: string, exportName: string, pageFor: (slug: string) => string, listings: (reg: Registry) => string[]): Rule {
  return {
    id: `record:${file}`,
    match: (f) => (f === file ? [f] : null),
    derive(ctx, base, head) {
      const d = diffKeyed(recordMap(base, exportName), recordMap(head, exportName))
      if (moduleSig(base, [exportName]) !== moduleSig(head, [exportName])) {
        return { kind: 'unattributed', note: `an export other than \`${exportName}\` changed` }
      }
      if (diffSize(d) === 0) return { kind: 'none' }
      return {
        kind: 'records',
        urls: [...touched(d).flatMap((s) => servedEither(ctx, pageFor(s))), ...listings(ctx.reg)],
        note: `${exportName}: ${describe(d)}`,
      }
    },
    async coarse(ctx) {
      const [base, head] = await bothForCoarse(ctx, file)
      const slugs = new Set([...recordMap(base, exportName).keys(), ...recordMap(head, exportName).keys()])
      return [...[...slugs].flatMap((s) => servedEither(ctx, pageFor(s))), ...listings(ctx.reg)]
    },
  }
}

const RENTAL_AGREEMENT_PATH = '/golf-course-club-rental-agreement/'
const COURSE_RE = /^data\/golf-courses\/([a-z0-9-]+)\/([a-z0-9-]+)\.ts$/
const hubPath = (region: string) => `/golf-courses/${region}/`
const coursePath = (region: string, slug: string) => `/golf-courses/${region}/${slug}/`
const tierPath = (slug: string) => `/golf-courses/under/${slug}/`

/**
 * A region roster change, and the pages that print course counts. The
 * homepage is en + th only: ja/ko/zh return bespoke landing pages before the
 * shared body that holds RegionHubLinks (app/[locale]/page.tsx; smoke Q).
 */
const rosterUrls = (reg: Registry, region: string) => [
  ...served(reg, hubPath(region)),
  ...served(reg, '/golf-courses/'),
  ...['en', 'th'].flatMap((l) => inLocale(reg, l, '/')),
  ...served(reg, '/golf/'),
  ...served(reg, '/golf-in-thailand-guide/'),
]

const courseRegistrations = (mod: Loaded) =>
  arrayMap(mod, 'COURSE_DETAIL_I18N', (e) => `${e.region}/${e.slug}`)
const tierRecords = (mod: Loaded) => arrayMap(mod, 'PRICE_TIERS', (e) => String(e.slug))
const blogPairs = (mod: Loaded) => {
  const map = new Map<string, unknown>()
  for (const [locale, slugs] of recordMap(mod, 'BLOG_TRANSLATED_SLUGS')) {
    if (Array.isArray(slugs)) for (const s of slugs) map.set(`${locale}:${s}`, true)
  }
  return map
}
/** Every URL a blog post has at either revision: EN plus each locale mirroring it. */
const blogPostUrls = (slug: string, maps: Map<string, unknown>[]) => {
  const urls = [pageUrl('en', `/blog/${slug}/`)]
  for (const m of maps) for (const k of m.keys()) if (splitKey(k)[1] === slug) urls.push(pageUrl(splitKey(k)[0], `/blog/${slug}/`))
  return urls
}

export const RULES: Rule[] = [
  {
    id: 'none:i18n-glossary',
    match: (f) => f.match(/^data\/i18n-glossary\//),
    inert: 'glossary is a validate:i18n input; renders nowhere',
    derive: () => ({ kind: 'none' }),
    coarse: () => [],
  },
  {
    // A region's slug list: the roster on its hub, plus every page printing
    // course COUNTS (REGION_META.courseCount, which validate:courses keeps
    // equal to this list): /golf-courses/, RegionHubLinks on / and /golf/,
    // and /golf-in-thailand-guide/.
    id: 'region-index',
    match: (f) => f.match(/^data\/golf-courses\/([a-z0-9-]+)\/index\.ts$/),
    derive: (ctx, base, head, _c, m) =>
      sig(base?.default) === sig(head?.default) && moduleSig(base) === moduleSig(head)
        ? { kind: 'none' }
        : { kind: 'records', urls: rosterUrls(ctx.reg, m[1]), note: `roster changed -> ${hubPath(m[1])} and the course counts` },
    coarse: (ctx, _c, m) => rosterUrls(ctx.reg, m[1]),
  },
  {
    // One course file: its page in every locale it reaches, plus its region roster.
    id: 'course',
    match: (f) => f.match(COURSE_RE),
    derive(ctx, base, head, _c, m) {
      if (sig(base?.course) === sig(head?.course) && moduleSig(base) === moduleSig(head)) return { kind: 'none' }
      const verb = !base ? 'added' : !head ? 'removed' : 'changed'
      return { kind: 'records', urls: [...servedEither(ctx, coursePath(m[1], m[2])), ...served(ctx.reg, hubPath(m[1]))], note: `course ${verb}` }
    },
    coarse: (ctx, _c, m) => [...servedEither(ctx, coursePath(m[1], m[2])), ...served(ctx.reg, hubPath(m[1]))],
  },
  ...SEO_SECTIONS.map(seoRule),
  {
    // REGION_HUB_I18N is per (region, locale) hub copy; COURSE_DETAIL_I18N is
    // the list of which courses build which locales.
    id: 'golf-courses-i18n',
    match: (f) => (f === 'data/golf-courses-i18n.ts' ? [f] : null),
    derive(ctx, base, head) {
      const omit = ['REGION_HUB_I18N', 'COURSE_DETAIL_I18N']
      if (moduleSig(base, omit) !== moduleSig(head, omit)) {
        return { kind: 'unattributed', note: 'changed outside both registries (a helper?)' }
      }
      const hubs = diffKeyed(nestedRecordMap(base, 'REGION_HUB_I18N'), nestedRecordMap(head, 'REGION_HUB_I18N'))
      const courses = diffKeyed(courseRegistrations(base), courseRegistrations(head))
      if (diffSize(hubs) + diffSize(courses) === 0) return { kind: 'none' }
      const urls: string[] = []
      for (const k of hubs.modified) {
        const [region, locale] = splitKey(k)
        urls.push(...inLocale(ctx.reg, locale, hubPath(region)), ...inLocale(ctx.reg, locale, '/golf-courses/'))
      }
      for (const k of [...hubs.added, ...hubs.removed]) {
        const [region, locale] = splitKey(k)
        urls.push(...servedEither(ctx, hubPath(region)), ...inLocale(ctx.reg, locale, '/golf-courses/'))
      }
      // llms.txt prints each translated hub under its localized label.
      if (diffSize(hubs) > 0) urls.push(pageUrl('en', '/llms.txt'))
      for (const k of touched(courses)) {
        const [region, slug] = k.split('/')
        // The hub roster links a course with or without a locale prefix
        // (courseDetailHref), so the roster moves with the registration.
        urls.push(...servedEither(ctx, coursePath(region, slug)), ...served(ctx.reg, hubPath(region)))
      }
      return { kind: 'records', urls, note: `region hubs: ${describe(hubs)}; course registrations: ${describe(courses)}` }
    },
    async coarse(ctx) {
      // A helper here (getRegionHubTranslation) feeds every translated hub,
      // /golf-courses/, llms.txt and the region label on every registered course.
      const [base, head] = await bothForCoarse(ctx, 'data/golf-courses-i18n.ts')
      const urls = [...served(ctx.reg, '/golf-courses/'), pageUrl('en', '/llms.txt')]
      for (const mod of [base, head]) {
        for (const k of nestedRecordMap(mod, 'REGION_HUB_I18N').keys()) urls.push(...servedEither(ctx, hubPath(splitKey(k)[0])))
        for (const k of courseRegistrations(mod).keys()) {
          const [region, slug] = k.split('/')
          urls.push(...servedEither(ctx, coursePath(region, slug)))
        }
      }
      return urls
    },
  },
  {
    // PRICE_TIERS carries the EN copy and the tier set (listed on
    // /golf-courses/ in every locale); PRICE_TIER_I18N the translated copy,
    // which only the tier pages read.
    id: 'price-tiers',
    match: (f) => (f === 'data/price-tiers.ts' ? [f] : null),
    derive(ctx, base, head) {
      const omit = ['PRICE_TIERS', 'PRICE_TIER_SLUGS', 'PRICE_TIER_I18N']
      if (moduleSig(base, omit) !== moduleSig(head, omit)) return { kind: 'unattributed', note: 'changed outside the tier records' }
      const tiers = diffKeyed(tierRecords(base), tierRecords(head))
      const i18n = diffKeyed(nestedRecordMap(base, 'PRICE_TIER_I18N'), nestedRecordMap(head, 'PRICE_TIER_I18N'))
      if (diffSize(tiers) + diffSize(i18n) === 0) return { kind: 'none' }
      const urls: string[] = []
      for (const slug of touched(tiers)) urls.push(...servedEither(ctx, tierPath(slug)))
      if (diffSize(tiers) > 0) urls.push(...served(ctx.reg, '/golf-courses/'))
      for (const k of i18n.modified) urls.push(...inLocale(ctx.reg, splitKey(k)[1], tierPath(splitKey(k)[0])))
      for (const k of [...i18n.added, ...i18n.removed]) urls.push(...servedEither(ctx, tierPath(splitKey(k)[0])))
      return { kind: 'records', urls, note: `tiers: ${describe(tiers)}; translations: ${describe(i18n)}` }
    },
    async coarse(ctx) {
      const [base, head] = await bothForCoarse(ctx, 'data/price-tiers.ts')
      const slugs = new Set([...tierRecords(base).keys(), ...tierRecords(head).keys()])
      return [...[...slugs].flatMap((s) => servedEither(ctx, tierPath(s))), ...served(ctx.reg, '/golf-courses/')]
    },
  },
  {
    // The /faq/ hub, one content block per locale via getFaqHubContent().
    id: 'faq-hub',
    match: (f) => (f === 'data/faq-hub.ts' ? [f] : null),
    derive(ctx, base, head) {
      const perLocale = (mod: Loaded) => {
        const map = new Map<string, unknown>()
        const get = mod?.getFaqHubContent
        if (typeof get === 'function') for (const l of LOCALES) map.set(l, (get as (l: string) => unknown)(l))
        return map
      }
      const d = diffKeyed(perLocale(base), perLocale(head))
      if (moduleSig(base, ['getFaqHubContent']) !== moduleSig(head, ['getFaqHubContent'])) {
        return { kind: 'unattributed', note: 'an export other than getFaqHubContent changed' }
      }
      const locales = touched(d)
      if (locales.length === 0) return { kind: 'none' }
      const urls = locales.flatMap((l) => inLocale(ctx.reg, l, '/faq/'))
      // llms-full.txt prints the EN hub's directions (getFaqHubContent('en')).
      if (locales.includes('en')) urls.push(pageUrl('en', '/llms-full.txt'))
      return { kind: 'records', urls, note: `hub content changed for ${locales.join(', ')}` }
    },
    coarse: (ctx) => [...served(ctx.reg, '/faq/'), pageUrl('en', '/llms-full.txt')],
  },
  {
    // Mirror of the DB's translated blog slugs: a slug entering or leaving a
    // locale changes the hreflang on EVERY version of that post, and that
    // locale's blog index. The mirror itself says which locales a post has, so
    // it is read directly rather than through a registry.
    id: 'blog-translated-slugs',
    match: (f) => (f === 'data/blog-translated-slugs.ts' ? [f] : null),
    derive(ctx, base, head) {
      if (moduleSig(base, ['BLOG_TRANSLATED_SLUGS']) !== moduleSig(head, ['BLOG_TRANSLATED_SLUGS'])) {
        return { kind: 'unattributed', note: 'changed outside BLOG_TRANSLATED_SLUGS' }
      }
      const [b, h] = [blogPairs(base), blogPairs(head)]
      const d = diffKeyed(b, h)
      if (diffSize(d) === 0) return { kind: 'none' }
      const urls: string[] = []
      for (const k of touched(d)) {
        const [locale, slug] = splitKey(k)
        urls.push(...blogPostUrls(slug, [b, h]), ...inLocale(ctx.reg, locale, '/blog/'), ...inLocale(ctx.baseReg, locale, '/blog/'))
      }
      return { kind: 'records', urls, note: `translated slugs: ${describe(d)}` }
    },
    async coarse(ctx) {
      const [base, head] = await bothForCoarse(ctx, 'data/blog-translated-slugs.ts')
      const maps = [blogPairs(base), blogPairs(head)]
      const slugs = new Set(maps.flatMap((m) => [...m.keys()].map((k) => splitKey(k)[1])))
      return [...[...slugs].flatMap((s) => blogPostUrls(s, maps)), ...served(ctx.reg, '/blog/')]
    },
  },
  // app/[locale]/golf-courses/page.tsx renders the station, airport and
  // use-case lists under `locale === 'en'` only.
  recordRule('data/airports.ts', 'AIRPORTS', (s) => `/golf-courses/near/${s}/`, (reg) => inLocale(reg, 'en', '/golf-courses/')),
  recordRule('data/bts-stations.ts', 'BTS_STATIONS', (s) => `/golf-courses/near/${s}/`, (reg) => inLocale(reg, 'en', '/golf-courses/')),
  recordRule('data/golf-courses-use-cases.ts', 'USE_CASE_RULES', (s) => `/golf-courses/best-for/${s}/`, (reg) => inLocale(reg, 'en', '/golf-courses/')),
  fixedRule('data/coaches.ts', ['/lessons/']),
  fixedRule('data/event-clients.ts', ['/events/']),
  fixedRule('data/food-menu.ts', ['/menu/']),
  fixedRule('data/pricing.ts', ['/', '/golf/', '/lessons/', '/events/', '/corporate-golf-packages/', '/llms-full.txt']),
  {
    // The course club rental agreement, one file per locale
    // (app/[locale]/golf-course-club-rental-agreement/page.tsx). A locale's
    // file renders that locale's page only: the translations do not import
    // en.ts, they share only BUSINESS_INFO.
    id: 'rental-agreement',
    match: (f) => f.match(/^data\/rental-agreement\/([a-z]{2})\.ts$/),
    derive: (ctx, base, head, _c, m) =>
      moduleSig(base) === moduleSig(head)
        ? { kind: 'none' }
        : { kind: 'records', urls: inLocale(ctx.reg, m[1], RENTAL_AGREEMENT_PATH), note: `${m[1]} agreement text changed` },
    coarse: (ctx, _c, m) =>
      LOCALES.includes(m[1]) ? inLocale(ctx.reg, m[1], RENTAL_AGREEMENT_PATH) : served(ctx.reg, RENTAL_AGREEMENT_PATH),
  },
  // index.ts assembles every locale's text, so a change there is every locale.
  fixedRule('data/rental-agreement/index.ts', [RENTAL_AGREEMENT_PATH]),
  {
    id: 'none:rental-agreement-types',
    match: (f) => (f === 'data/rental-agreement/types.ts' ? [f] : null),
    inert: 'types plus RENTAL_AGREEMENT_VERSION, which no page renders (the date line is prose in each locale file)',
    derive: () => ({ kind: 'none' }),
    coarse: () => [],
  },
  {
    // One UI catalog: the key pages, in that catalog's locale only.
    id: 'messages',
    match: (f) => f.match(/^messages\/([a-z]{2})\.json$/),
    derive(ctx, base, head, _c, m) {
      if (!LOCALES.includes(m[1])) return { kind: 'unattributed', note: `unknown locale catalog "${m[1]}"` }
      const d = diffKeyed(new Map(Object.entries(base ?? {})), new Map(Object.entries(head ?? {})))
      if (diffSize(d) === 0) return { kind: 'none' }
      const ns = touched(d)
      return {
        kind: 'records',
        urls: KEY_PAGES.flatMap((p) => inLocale(ctx.reg, m[1], p)),
        note: `namespaces ${ns.slice(0, 6).join(', ')}${ns.length > 6 ? ` +${ns.length - 6}` : ''} -> ${m[1]} key pages (a proxy)`,
      }
    },
    coarse: (ctx, _c, m) =>
      LOCALES.includes(m[1]) ? KEY_PAGES.flatMap((p) => inLocale(ctx.reg, m[1], p)) : FALLBACK_PAGES.flatMap((p) => served(ctx.reg, p)),
  },
  {
    id: 'llms-route',
    match: (f) => f.match(/^app\/(llms(?:-full)?\.txt)\//),
    sourceOnly: true,
    derive: (_ctx, _b, _h, _c, m) => ({ kind: 'records', urls: [pageUrl('en', `/${m[1]}`)], note: `route source -> /${m[1]}` }),
    coarse: (_ctx, _c, m) => [pageUrl('en', `/${m[1]}`)],
  },
]

/** Any trigger-path file no rule claims. Never silent: key pages + a warning. */
const fallbackUrls = (ctx: Ctx) => FALLBACK_PAGES.flatMap((p) => served(ctx.reg, p))

export function ruleFor(file: string): { rule: Rule; m: RegExpMatchArray } | null {
  for (const rule of RULES) {
    const m = rule.match(file)
    if (m) return { rule, m }
  }
  return null
}

/** Did the code change, ignoring comments and formatting? undefined = cannot tell. */
async function codeChanged(loader: Loader, file: string): Promise<boolean> {
  if (!/\.tsx?$/.test(file)) return true
  const [b, h] = await Promise.all([loader.source('base', file), loader.source('head', file)])
  if (b === undefined || h === undefined) return true
  if (b === null || h === null) return b !== h
  return (await codeFingerprint(b, file)) !== (await codeFingerprint(h, file))
}

async function deriveOne(ctx: Ctx, change: Change): Promise<Omit<FileResult, 'file'>> {
  const hit = ruleFor(change.file)
  if (!hit) {
    return { urls: fallbackUrls(ctx), note: 'NO MAPPING RULE; pinging the key pages. Add a rule to scripts/indexnow-urls.ts', warn: true }
  }
  const { rule, m } = hit
  if (rule.inert) return { urls: [], note: rule.inert, warn: false }
  const coarse = async (why: string): Promise<Omit<FileResult, 'file'>> => {
    try {
      return { urls: await rule.coarse(ctx, change, m), note: `${why}; pinging every URL this file feeds`, warn: true }
    } catch (err) {
      return { urls: fallbackUrls(ctx), note: `${why}, and the coarse set failed too (${(err as Error).message}); pinging the key pages`, warn: true }
    }
  }
  try {
    if (!(await codeChanged(ctx.loader, change.file))) {
      return { urls: [], note: 'comments/formatting only', warn: false }
    }
    const [base, head] = rule.sourceOnly
      ? [null, null]
      : await Promise.all([ctx.loader.base(change.file), ctx.loader.head(change.file)])
    const v = await rule.derive(ctx, base, head, change, m)
    if (v.kind === 'records') return { urls: v.urls, note: v.note, warn: false }
    if (v.kind === 'unattributed') return coarse(v.note)
    return coarse('code changed but no exported value did (a module-private value read by a function?)')
  } catch (err) {
    return coarse(`could not diff (${(err as Error).message})`)
  }
}

export async function deriveAll(changes: Change[], ctx: Ctx): Promise<FileResult[]> {
  const results: FileResult[] = []
  for (const change of changes) {
    const r = await deriveOne(ctx, change)
    results.push({ file: change.file, urls: [...new Set(r.urls)].sort(), note: r.note, warn: r.warn })
  }
  return results
}

// ── Git plumbing ────────────────────────────────────────────────────────────

function git(root: string, args: string[]): string {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })
}

function gitShow(root: string, rev: string, rel: string): Buffer | null {
  try {
    execFileSync('git', ['cat-file', '-e', `${rev}:${rel}`], { cwd: root, stdio: 'ignore' })
  } catch {
    return null
  }
  return execFileSync('git', ['show', `${rev}:${rel}`], { cwd: root, maxBuffer: 256 * 1024 * 1024 })
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
      const src = gitShow(root, baseRev, rel)
      if (src === null) return null
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
    async source(side, rel) {
      if (side === 'base') return gitShow(root, baseRev, rel)?.toString('utf8') ?? null
      const abs = path.join(root, rel)
      return existsSync(abs) ? readFileSync(abs, 'utf8') : null
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

  const loader = gitLoader(root, base)
  const reg = (await importFile(path.join(root, 'lib/translated-routes.ts'))) as unknown as Registry
  // The base registry resolves its own imports against HEAD (constants, the
  // blog mirror). Its TRANSLATED_ROUTES table is inline, which is the part a
  // removed record needs; the blog rule reads the mirror directly.
  const baseReg = ((await loader.base('lib/translated-routes.ts')) as unknown as Registry | null) ?? reg
  const changes = changedFiles(root, base, head)
  console.error(`indexnow-urls: ${base.slice(0, 12)}..${head.slice(0, 12)}, ${changes.length} changed file(s) under the trigger paths`)
  const results = await deriveAll(changes, { reg, baseReg, loader })

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
  const set = new Set(
    registered.map((r) => {
      const [l, p] = splitKey(r)
      return `${l}:${norm(p)}`
    })
  )
  return {
    hasTranslationForLocale: (l, p) => set.has(`${l}:${norm(p)}`),
    getLocalesForPath: (p) => ['en', ...['th', 'ko', 'ja', 'zh'].filter((l) => set.has(`${l}:${norm(p)}`))],
  }
}

/**
 * In-memory revisions. `sources` supplies raw text for the code fingerprint;
 * without it the fingerprint reports "changed" and the semantic diff decides.
 * A `throws` entry makes that side's import fail, as a broken base would.
 */
function memLoader(
  base: Record<string, Loaded>,
  head: Record<string, Loaded>,
  sources?: { base?: Record<string, string>; head?: Record<string, string> },
  throws?: { base?: string[]; head?: string[] }
): Loader {
  const load = (side: 'base' | 'head', map: Record<string, Loaded>) => async (f: string) => {
    if (throws?.[side]?.includes(f)) throw new Error(`simulated ${side} import failure`)
    return map[f] ?? null
  }
  return {
    base: load('base', base),
    head: load('head', head),
    source: async (side, f) => (sources?.[side] ? (sources[side]![f] ?? null) : undefined),
  }
}

const entry = (slug: string, locale: string, answer: string, status = 'published') => ({ slug, locale, status, answer })

interface Case {
  name: string
  changes: Change[]
  base: Record<string, Loaded>
  head: Record<string, Loaded>
  registered?: string[]
  /** Registrations at the base revision; defaults to `registered`. */
  baseRegistered?: string[]
  sources?: { base?: Record<string, string>; head?: Record<string, string> }
  throws?: { base?: string[]; head?: string[] }
  /** Exact expected URL set (paths are made absolute). */
  want: string[]
  wantWarn?: boolean
}

const U = (p: string) => (p.startsWith('http') ? p : `${SITE}${p}`)

/** A loader whose imports always fail: proves a path never reached them. */
const NEVER = ['data/faq-pages.ts']

/** The eleven fallback pages, spelled out: a `want` that reads FALLBACK_PAGES cannot catch a mutated FALLBACK_PAGES. */
const ELEVEN = ['/', '/golf/', '/lessons/', '/events/', '/menu/', '/faq/', '/golf-club-rental/', '/golf-course-club-rental/', '/golf-courses/', '/llms.txt', '/llms-full.txt']

const CASES: Case[] = [
  {
    name: 'EN FAQ edit pings the FAQ and the pages that list EN FAQs, nothing else',
    changes: [{ status: 'M', file: 'data/faq-pages.ts' }],
    base: { 'data/faq-pages.ts': { faqPages: [entry('a', 'en', 'old'), entry('b', 'en', 'same')] } },
    head: { 'data/faq-pages.ts': { faqPages: [entry('a', 'en', 'new'), entry('b', 'en', 'same')] } },
    registered: ['ja:/faq/', 'ja:/faq/a/'],
    want: ['/faq/a/', '/faq/', '/golf-in-thailand-guide/', '/llms.txt', '/llms-full.txt'],
  },
  {
    name: 'ja FAQ edit pings only the ja page and the ja hub (not EN, not llms-full)',
    changes: [{ status: 'M', file: 'data/faq-pages.ts' }],
    base: { 'data/faq-pages.ts': { faqPages: [entry('a', 'en', 'x'), entry('a', 'ja', 'old')] } },
    head: { 'data/faq-pages.ts': { faqPages: [entry('a', 'en', 'x'), entry('a', 'ja', 'new')] } },
    registered: ['ja:/faq/', 'ja:/faq/a/'],
    want: ['/ja/faq/a/', '/ja/faq/', '/llms.txt'],
  },
  {
    name: 'an edit to an UNREGISTERED locale entry pings no locale URL (it would 301)',
    changes: [{ status: 'M', file: 'data/faq-pages.ts' }],
    base: { 'data/faq-pages.ts': { faqPages: [entry('a', 'ko', 'old')] } },
    head: { 'data/faq-pages.ts': { faqPages: [entry('a', 'ko', 'new')] } },
    registered: [],
    want: ['/llms.txt'],
  },
  {
    name: 'a newly published ko entry pings every locale of that slug (hreflang moved)',
    changes: [{ status: 'M', file: 'data/explainer-pages.ts' }],
    base: { 'data/explainer-pages.ts': { explainerPages: [entry('g', 'en', 'x'), entry('g', 'ko', 'y', 'draft')] } },
    head: { 'data/explainer-pages.ts': { explainerPages: [entry('g', 'en', 'x'), entry('g', 'ko', 'y')] } },
    registered: ['ko:/guide/g/', 'th:/guide/g/'],
    want: ['/guide/g/', '/th/guide/g/', '/ko/guide/g/', '/llms.txt'],
  },
  {
    name: 'a removed EN entry pings its (now dead) URL and its listings',
    changes: [{ status: 'M', file: 'data/activity-occasions.ts' }],
    base: { 'data/activity-occasions.ts': { activityOccasionPages: [entry('old', 'en', 'x'), entry('keep', 'en', 'k')] } },
    head: { 'data/activity-occasions.ts': { activityOccasionPages: [entry('keep', 'en', 'k')] } },
    want: ['/activities/old/', '/activities/'],
  },
  {
    name: 'a removed ja entry pings the ja URL the BASE registry served (it now redirects)',
    changes: [{ status: 'M', file: 'data/best-of-listicle-pages.ts' }],
    base: { 'data/best-of-listicle-pages.ts': { bestOfListiclePages: [entry('b', 'en', 'x'), entry('b', 'ja', 'y')] } },
    head: { 'data/best-of-listicle-pages.ts': { bestOfListiclePages: [entry('b', 'en', 'x')] } },
    registered: [],
    baseRegistered: ['ja:/best/b/'],
    want: ['/best/b/', '/ja/best/b/'],
  },
  {
    name: 'without sources, identical records still go coarse: "cannot tell" is never "unchanged"',
    changes: [{ status: 'M', file: 'data/hotel-pages.ts' }],
    base: { 'data/hotel-pages.ts': { hotelConciergePages: [entry('h', 'en', 'x')] } },
    head: { 'data/hotel-pages.ts': { hotelConciergePages: [entry('h', 'en', 'x')] } },
    want: ['/hotels/h/', '/hotels/'],
    wantWarn: true,
  },
  {
    name: 'a comments/formatting/quotes-only SOURCE change stops at the fingerprint, before any import',
    changes: [{ status: 'M', file: 'data/faq-pages.ts' }],
    base: {},
    head: {},
    sources: {
      base: { 'data/faq-pages.ts': "// old note\nexport const faqPages = [ { slug: 'a', n: 1, }, ]\n" },
      head: { 'data/faq-pages.ts': '/** new note */\nexport const faqPages = [{ slug: "a", n: 1 }]\n' },
    },
    throws: { base: NEVER, head: NEVER },
    want: [],
  },
  {
    name: 'code that changed while no exported value did goes coarse, with a warning',
    changes: [{ status: 'M', file: 'data/golf-courses-use-cases.ts' }],
    base: { 'data/golf-courses-use-cases.ts': { USE_CASE_RULES: { beginners: { predicate: 'same' } } } },
    head: { 'data/golf-courses-use-cases.ts': { USE_CASE_RULES: { beginners: { predicate: 'same' } } } },
    sources: {
      base: { 'data/golf-courses-use-cases.ts': 'const MAX = 3500\nexport const USE_CASE_RULES = { beginners: { predicate: (c) => c < MAX } }\n' },
      head: { 'data/golf-courses-use-cases.ts': 'const MAX = 2500\nexport const USE_CASE_RULES = { beginners: { predicate: (c) => c < MAX } }\n' },
    },
    registered: ['th:/golf-courses/'],
    want: ['/golf-courses/best-for/beginners/', '/golf-courses/'],
    wantWarn: true,
  },
  {
    name: 'a missing SEO export at head cannot even enumerate its coarse set: key pages, loudly',
    changes: [{ status: 'M', file: 'data/faq-pages.ts' }],
    base: { 'data/faq-pages.ts': { faqPages: [entry('a', 'en', 'x')] } },
    head: { 'data/faq-pages.ts': { renamedPages: [entry('a', 'en', 'x')] } },
    want: ELEVEN,
    wantWarn: true,
  },
  {
    name: 'a BASE that fails to import pings every URL the head file feeds, not the key pages',
    changes: [{ status: 'M', file: 'data/faq-pages.ts' }],
    base: {},
    head: { 'data/faq-pages.ts': { faqPages: [entry('a', 'en', 'x'), entry('b', 'ja', 'y')] } },
    throws: { base: ['data/faq-pages.ts'] },
    registered: ['ja:/faq/', 'ja:/faq/b/'],
    want: ['/faq/a/', '/faq/', '/golf-in-thailand-guide/', '/llms.txt', '/llms-full.txt', '/ja/faq/b/', '/ja/faq/', '/faq/b/'],
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
    name: 'a course file whose edit is comments only pings nothing',
    changes: [{ status: 'M', file: 'data/golf-courses/krabi/pakasai-country-club.ts' }],
    base: {},
    head: {},
    sources: {
      base: { 'data/golf-courses/krabi/pakasai-country-club.ts': 'export const course = { fee: 1 }\n' },
      head: { 'data/golf-courses/krabi/pakasai-country-club.ts': '// verified 2026-09\nexport const course = { fee: 1 }\n' },
    },
    throws: { base: ['data/golf-courses/krabi/pakasai-country-club.ts'], head: ['data/golf-courses/krabi/pakasai-country-club.ts'] },
    want: [],
  },
  {
    name: 'a deleted course pings every URL it had at base (now redirects) and the roster',
    changes: [{ status: 'D', file: 'data/golf-courses/bangkok/gone-club.ts' }],
    base: { 'data/golf-courses/bangkok/gone-club.ts': { course: { fee: 1 } } },
    head: {},
    baseRegistered: ['th:/golf-courses/bangkok/gone-club'],
    want: ['/golf-courses/bangkok/gone-club/', '/th/golf-courses/bangkok/gone-club/', '/golf-courses/bangkok/'],
  },
  {
    name: 'a region index.ts is the roster, not a course: hub + /golf-courses/',
    changes: [{ status: 'M', file: 'data/golf-courses/krabi/index.ts' }],
    base: { 'data/golf-courses/krabi/index.ts': { default: { slugs: ['a'] } } },
    head: { 'data/golf-courses/krabi/index.ts': { default: { slugs: ['a', 'b'] } } },
    registered: ['th:/golf-courses/', 'th:/golf-courses/krabi', 'th:/', 'ja:/', 'ja:/golf'],
    want: ['/golf-courses/krabi/', '/th/golf-courses/krabi/', '/golf-courses/', '/th/golf-courses/', '/', '/th/', '/golf/', '/ja/golf/', '/golf-in-thailand-guide/'],
  },
  {
    name: 'a predicate edit counts as a change; the /golf-courses/ list it feeds is EN-only',
    changes: [{ status: 'M', file: 'data/golf-courses-use-cases.ts' }],
    base: { 'data/golf-courses-use-cases.ts': { USE_CASE_RULES: { beginners: { predicate: (c: number) => c > 1 } } } },
    head: { 'data/golf-courses-use-cases.ts': { USE_CASE_RULES: { beginners: { predicate: (c: number) => c > 2 } } } },
    registered: ['th:/golf-courses/'],
    want: ['/golf-courses/best-for/beginners/', '/golf-courses/'],
  },
  {
    name: 'a record module whose OTHER export changed goes coarse: every record page, with a warning',
    changes: [{ status: 'M', file: 'data/airports.ts' }],
    base: { 'data/airports.ts': { AIRPORTS: { bkk: { n: 1 }, dmk: { n: 2 } }, helper: 'a' } },
    head: { 'data/airports.ts': { AIRPORTS: { bkk: { n: 1 }, dmk: { n: 2 } }, helper: 'b' } },
    want: ['/golf-courses/near/bkk/', '/golf-courses/near/dmk/', '/golf-courses/'],
    wantWarn: true,
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
    name: 'a new hub translation pings the hub in every locale, that locale\'s /golf-courses/, llms.txt',
    changes: [{ status: 'M', file: 'data/golf-courses-i18n.ts' }],
    base: { 'data/golf-courses-i18n.ts': { REGION_HUB_I18N: {}, COURSE_DETAIL_I18N: [] } },
    head: { 'data/golf-courses-i18n.ts': { REGION_HUB_I18N: { krabi: { ko: { label: 'k' } } }, COURSE_DETAIL_I18N: [] } },
    registered: ['ko:/golf-courses/krabi', 'th:/golf-courses/krabi', 'ko:/golf-courses/'],
    want: ['/golf-courses/krabi/', '/th/golf-courses/krabi/', '/ko/golf-courses/krabi/', '/ko/golf-courses/', '/llms.txt'],
  },
  {
    name: 'a helper edit in the SAME push as a record edit is not swallowed: coarse, with a warning',
    changes: [{ status: 'M', file: 'data/golf-courses-i18n.ts' }],
    base: { 'data/golf-courses-i18n.ts': { REGION_HUB_I18N: { krabi: { ja: { label: 'a' } } }, COURSE_DETAIL_I18N: [{ region: 'krabi', slug: 'p', locales: ['ja'] }], getRegionHubTranslation: () => 1 } },
    head: { 'data/golf-courses-i18n.ts': { REGION_HUB_I18N: { krabi: { ja: { label: 'b' } } }, COURSE_DETAIL_I18N: [{ region: 'krabi', slug: 'p', locales: ['ja'] }], getRegionHubTranslation: () => 2 } },
    registered: ['ja:/golf-courses/krabi', 'ja:/golf-courses/krabi/p'],
    want: ['/golf-courses/', '/llms.txt', '/golf-courses/krabi/', '/ja/golf-courses/krabi/', '/golf-courses/krabi/p/', '/ja/golf-courses/krabi/p/'],
    wantWarn: true,
  },
  {
    name: 'a ja-only tier translation edit pings the ja tier page only (the hub reads PRICE_TIERS)',
    changes: [{ status: 'M', file: 'data/price-tiers.ts' }],
    base: { 'data/price-tiers.ts': { PRICE_TIERS: [{ slug: '1500-baht' }], PRICE_TIER_I18N: { '1500-baht': { ja: { title: 'a' } } } } },
    head: { 'data/price-tiers.ts': { PRICE_TIERS: [{ slug: '1500-baht' }], PRICE_TIER_I18N: { '1500-baht': { ja: { title: 'b' } } } } },
    registered: ['ja:/golf-courses/under/1500-baht', 'ja:/golf-courses/'],
    want: ['/ja/golf-courses/under/1500-baht/'],
  },
  {
    name: 'an EN tier edit pings that tier in every locale and /golf-courses/ in every locale',
    changes: [{ status: 'M', file: 'data/price-tiers.ts' }],
    base: { 'data/price-tiers.ts': { PRICE_TIERS: [{ slug: '1500-baht', title: 'a' }, { slug: '2500-baht' }], PRICE_TIER_I18N: {} } },
    head: { 'data/price-tiers.ts': { PRICE_TIERS: [{ slug: '1500-baht', title: 'b' }, { slug: '2500-baht' }], PRICE_TIER_I18N: {} } },
    registered: ['th:/golf-courses/under/1500-baht', 'th:/golf-courses/'],
    want: ['/golf-courses/under/1500-baht/', '/th/golf-courses/under/1500-baht/', '/golf-courses/', '/th/golf-courses/'],
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
    name: 'a blog slug entering ja pings EVERY version of the post, and the ja blog index',
    changes: [{ status: 'M', file: 'data/blog-translated-slugs.ts' }],
    base: { 'data/blog-translated-slugs.ts': { BLOG_TRANSLATED_SLUGS: { th: ['post'], ja: [] } } },
    head: { 'data/blog-translated-slugs.ts': { BLOG_TRANSLATED_SLUGS: { th: ['post'], ja: ['post'] } } },
    registered: ['ja:/blog'],
    want: ['/blog/post/', '/th/blog/post/', '/ja/blog/post/', '/ja/blog/'],
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
    name: 'a catalog for a locale the site does not have falls back loudly',
    changes: [{ status: 'A', file: 'messages/fr.json' }],
    base: {},
    head: { 'messages/fr.json': { Golf: { a: '1' } } },
    want: ELEVEN,
    wantWarn: true,
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
    want: ELEVEN,
    wantWarn: true,
  },
  {
    name: 'an llms route source edit pings exactly that file, without importing it',
    changes: [{ status: 'M', file: 'app/llms-full.txt/route.ts' }],
    base: {},
    head: {},
    throws: { base: ['app/llms-full.txt/route.ts'], head: ['app/llms-full.txt/route.ts'] },
    want: ['/llms-full.txt'],
  },
  {
    name: 'pricing.ts pings its six direct consumers',
    changes: [{ status: 'M', file: 'data/pricing.ts' }],
    base: { 'data/pricing.ts': { bayRates: [1] } },
    head: { 'data/pricing.ts': { bayRates: [2] } },
    want: ['/', '/golf/', '/lessons/', '/events/', '/corporate-golf-packages/', '/llms-full.txt'],
  },
  // One case per rule and per listing row, each with a LITERAL expectation.
  // A per-rule mutant (wrong path, wrong page, a listing row deleted, EN-only
  // fan-out) only goes red if some case exercises that exact configuration.
  {
    name: 'an EN guide edit pings the guide, the guide hub and llms.txt',
    changes: [{ status: 'M', file: 'data/explainer-pages.ts' }],
    base: { 'data/explainer-pages.ts': { explainerPages: [entry('g', 'en', 'old')] } },
    head: { 'data/explainer-pages.ts': { explainerPages: [entry('g', 'en', 'new')] } },
    want: ['/guide/g/', '/golf-in-thailand-guide/', '/llms.txt'],
  },
  {
    name: 'an EN cost-guide edit pings /cost/<slug>/ and the guide hub',
    changes: [{ status: 'M', file: 'data/price-guide-pages.ts' }],
    base: { 'data/price-guide-pages.ts': { priceGuidePages: [entry('c', 'en', 'old')] } },
    head: { 'data/price-guide-pages.ts': { priceGuidePages: [entry('c', 'en', 'new')] } },
    want: ['/cost/c/', '/golf-in-thailand-guide/'],
  },
  {
    name: 'an EN best-of edit pings /best/<slug>/ and /activities/',
    changes: [{ status: 'M', file: 'data/best-of-listicle-pages.ts' }],
    base: { 'data/best-of-listicle-pages.ts': { bestOfListiclePages: [entry('b', 'en', 'old')] } },
    head: { 'data/best-of-listicle-pages.ts': { bestOfListiclePages: [entry('b', 'en', 'new')] } },
    want: ['/best/b/', '/activities/'],
  },
  {
    name: 'an EN hotel edit pings the hotel page and /hotels/',
    changes: [{ status: 'M', file: 'data/hotel-pages.ts' }],
    base: { 'data/hotel-pages.ts': { hotelConciergePages: [entry('h', 'en', 'old')] } },
    head: { 'data/hotel-pages.ts': { hotelConciergePages: [entry('h', 'en', 'new')] } },
    want: ['/hotels/h/', '/hotels/'],
  },
  {
    name: 'a duplicate key resolves first-wins, as getSeoPageBySlug does',
    changes: [{ status: 'M', file: 'data/faq-pages.ts' }],
    base: { 'data/faq-pages.ts': { faqPages: [entry('a', 'en', 'x'), entry('a', 'en', 'shadowed')] } },
    head: { 'data/faq-pages.ts': { faqPages: [entry('a', 'en', 'y'), entry('a', 'en', 'shadowed')] } },
    want: ['/faq/a/', '/faq/', '/golf-in-thailand-guide/', '/llms.txt', '/llms-full.txt'],
  },
  {
    name: 'an export beside the entry array changing goes coarse: every entry, with a warning',
    changes: [{ status: 'M', file: 'data/activity-occasions.ts' }],
    base: { 'data/activity-occasions.ts': { activityOccasionPages: [entry('p', 'en', 'x'), entry('q', 'th', 'y')], helper: 1 } },
    head: { 'data/activity-occasions.ts': { activityOccasionPages: [entry('p', 'en', 'x'), entry('q', 'th', 'y')], helper: 2 } },
    registered: ['th:/activities/q'],
    want: ['/activities/p/', '/activities/', '/activities/q/', '/th/activities/q/'],
    wantWarn: true,
  },
  {
    name: 'coaches.ts pings /lessons/ in every locale that serves it',
    changes: [{ status: 'M', file: 'data/coaches.ts' }],
    base: { 'data/coaches.ts': { coaches: [1] } },
    head: { 'data/coaches.ts': { coaches: [2] } },
    registered: ['th:/lessons', 'ja:/lessons'],
    want: ['/lessons/', '/th/lessons/', '/ja/lessons/'],
  },
  {
    name: 'event-clients.ts pings /events/',
    changes: [{ status: 'M', file: 'data/event-clients.ts' }],
    base: { 'data/event-clients.ts': { eventClients: [1] } },
    head: { 'data/event-clients.ts': { eventClients: [2] } },
    want: ['/events/'],
  },
  {
    name: 'food-menu.ts pings /menu/',
    changes: [{ status: 'M', file: 'data/food-menu.ts' }],
    base: { 'data/food-menu.ts': { menuGroups: [1] } },
    head: { 'data/food-menu.ts': { menuGroups: [2] } },
    want: ['/menu/'],
  },
  {
    name: 'a ja rental-agreement edit pings the ja agreement page alone',
    changes: [{ status: 'M', file: 'data/rental-agreement/ja.ts' }],
    base: { 'data/rental-agreement/ja.ts': { ja: { title: 'a' } } },
    head: { 'data/rental-agreement/ja.ts': { ja: { title: 'b' } } },
    registered: ['ja:/golf-course-club-rental-agreement', 'ko:/golf-course-club-rental-agreement'],
    want: ['/ja/golf-course-club-rental-agreement/'],
  },
  {
    name: 'an EN rental-agreement edit pings the EN page, not the translations',
    changes: [{ status: 'M', file: 'data/rental-agreement/en.ts' }],
    base: { 'data/rental-agreement/en.ts': { en: { title: 'a' } } },
    head: { 'data/rental-agreement/en.ts': { en: { title: 'b' } } },
    registered: ['ja:/golf-course-club-rental-agreement', 'ko:/golf-course-club-rental-agreement'],
    want: ['/golf-course-club-rental-agreement/'],
  },
  {
    name: 'the rental-agreement index pings the agreement in every locale serving it',
    changes: [{ status: 'M', file: 'data/rental-agreement/index.ts' }],
    base: { 'data/rental-agreement/index.ts': { RENTAL_AGREEMENT: { en: 1 } } },
    head: { 'data/rental-agreement/index.ts': { RENTAL_AGREEMENT: { en: 2 } } },
    registered: ['th:/golf-course-club-rental-agreement', 'ja:/golf-course-club-rental-agreement'],
    want: ['/golf-course-club-rental-agreement/', '/th/golf-course-club-rental-agreement/', '/ja/golf-course-club-rental-agreement/'],
  },
  {
    name: 'the rental-agreement types file pings nothing (nothing in it renders)',
    changes: [{ status: 'M', file: 'data/rental-agreement/types.ts' }],
    base: {},
    head: {},
    want: [],
  },
  {
    name: 'a station edit pings its near page in every locale serving it; the hub list is EN-only',
    changes: [{ status: 'M', file: 'data/bts-stations.ts' }],
    base: { 'data/bts-stations.ts': { BTS_STATIONS: { siam: { n: 1 }, asok: { n: 1 } } } },
    head: { 'data/bts-stations.ts': { BTS_STATIONS: { siam: { n: 2 }, asok: { n: 1 } } } },
    registered: ['th:/golf-courses/near/siam', 'th:/golf-courses/'],
    want: ['/golf-courses/near/siam/', '/th/golf-courses/near/siam/', '/golf-courses/'],
  },
  {
    name: 'faq-hub: a ja-only edit pings /ja/faq/ alone',
    changes: [{ status: 'M', file: 'data/faq-hub.ts' }],
    base: { 'data/faq-hub.ts': { getFaqHubContent: (l: string) => (l === 'ja' ? 'ja-old' : 'en') } },
    head: { 'data/faq-hub.ts': { getFaqHubContent: (l: string) => (l === 'ja' ? 'ja-new' : 'en') } },
    registered: ['ja:/faq', 'th:/faq'],
    want: ['/ja/faq/'],
  },
  {
    name: 'faq-hub: an export beside getFaqHubContent changing goes coarse, with a warning',
    changes: [{ status: 'M', file: 'data/faq-hub.ts' }],
    base: { 'data/faq-hub.ts': { getFaqHubContent: () => 'same', extra: 1 } },
    head: { 'data/faq-hub.ts': { getFaqHubContent: () => 'same', extra: 2 } },
    registered: ['th:/faq'],
    want: ['/faq/', '/th/faq/', '/llms-full.txt'],
    wantWarn: true,
  },
  {
    name: 'a blog slug LEAVING ja pings every version it had, and the ja blog index',
    changes: [{ status: 'M', file: 'data/blog-translated-slugs.ts' }],
    base: { 'data/blog-translated-slugs.ts': { BLOG_TRANSLATED_SLUGS: { ja: ['post'], th: [] } } },
    head: { 'data/blog-translated-slugs.ts': { BLOG_TRANSLATED_SLUGS: { ja: [], th: [] } } },
    registered: ['ja:/blog'],
    want: ['/blog/post/', '/ja/blog/post/', '/ja/blog/'],
  },
  {
    name: 'blog: an export beside the mirror changing goes coarse over every mirrored post',
    changes: [{ status: 'M', file: 'data/blog-translated-slugs.ts' }],
    base: { 'data/blog-translated-slugs.ts': { BLOG_TRANSLATED_SLUGS: { ko: ['p1'] }, note: 1 } },
    head: { 'data/blog-translated-slugs.ts': { BLOG_TRANSLATED_SLUGS: { ko: ['p1'] }, note: 2 } },
    want: ['/blog/p1/', '/ko/blog/p1/', '/blog/'],
    wantWarn: true,
  },
  {
    name: 'a registration gaining a locale pings the course in every locale at either revision, and the roster',
    changes: [{ status: 'M', file: 'data/golf-courses-i18n.ts' }],
    base: { 'data/golf-courses-i18n.ts': { REGION_HUB_I18N: {}, COURSE_DETAIL_I18N: [{ region: 'krabi', slug: 'p', locales: ['ja'] }] } },
    head: { 'data/golf-courses-i18n.ts': { REGION_HUB_I18N: {}, COURSE_DETAIL_I18N: [{ region: 'krabi', slug: 'p', locales: ['ja', 'ko'] }] } },
    registered: ['ja:/golf-courses/krabi/p', 'ko:/golf-courses/krabi/p'],
    baseRegistered: ['ja:/golf-courses/krabi/p'],
    want: ['/golf-courses/krabi/p/', '/ja/golf-courses/krabi/p/', '/ko/golf-courses/krabi/p/', '/golf-courses/krabi/'],
  },
  {
    name: 'a new tier translation pings that tier in every locale serving it',
    changes: [{ status: 'M', file: 'data/price-tiers.ts' }],
    base: { 'data/price-tiers.ts': { PRICE_TIERS: [{ slug: '1500-baht' }], PRICE_TIER_I18N: {} } },
    head: { 'data/price-tiers.ts': { PRICE_TIERS: [{ slug: '1500-baht' }], PRICE_TIER_I18N: { '1500-baht': { zh: { title: 'z' } } } } },
    registered: ['zh:/golf-courses/under/1500-baht'],
    want: ['/golf-courses/under/1500-baht/', '/zh/golf-courses/under/1500-baht/'],
  },
  {
    name: 'price-tiers: a helper edit goes coarse over every tier and /golf-courses/, with a warning',
    changes: [{ status: 'M', file: 'data/price-tiers.ts' }],
    base: { 'data/price-tiers.ts': { PRICE_TIERS: [{ slug: '1500-baht' }, { slug: '2500-baht' }], PRICE_TIER_I18N: {}, getPriceTierTranslation: () => 1 } },
    head: { 'data/price-tiers.ts': { PRICE_TIERS: [{ slug: '1500-baht' }, { slug: '2500-baht' }], PRICE_TIER_I18N: {}, getPriceTierTranslation: () => 2 } },
    want: ['/golf-courses/under/1500-baht/', '/golf-courses/under/2500-baht/', '/golf-courses/'],
    wantWarn: true,
  },
  {
    name: 'messages/ko.json maps to ALL nine key pages when ko serves them',
    changes: [{ status: 'M', file: 'messages/ko.json' }],
    base: { 'messages/ko.json': { Nav: { a: '1' } } },
    head: { 'messages/ko.json': { Nav: { a: '2' } } },
    registered: ['ko:/', 'ko:/golf', 'ko:/lessons', 'ko:/events', 'ko:/menu', 'ko:/faq', 'ko:/golf-club-rental', 'ko:/golf-course-club-rental', 'ko:/golf-courses'],
    want: ['/ko/', '/ko/golf/', '/ko/lessons/', '/ko/events/', '/ko/menu/', '/ko/faq/', '/ko/golf-club-rental/', '/ko/golf-course-club-rental/', '/ko/golf-courses/'],
  },
  {
    name: 'an unmapped file falls back to the key pages in EVERY locale serving them',
    changes: [{ status: 'A', file: 'data/another-new-module.ts' }],
    base: {},
    head: {},
    registered: ['th:/', 'th:/golf'],
    want: ['/', '/th/', '/golf/', '/th/golf/', '/lessons/', '/events/', '/menu/', '/faq/', '/golf-club-rental/', '/golf-course-club-rental/', '/golf-courses/', '/llms.txt', '/llms-full.txt'],
    wantWarn: true,
  },
  {
    name: 'an llms.txt route source edit pings /llms.txt only',
    changes: [{ status: 'M', file: 'app/llms.txt/route.ts' }],
    base: {},
    head: {},
    want: ['/llms.txt'],
  },
]

/**
 * Every file under app/, components/ or lib/ with a RUNTIME dependency on a
 * data module this script maps (a value import, a re-export, a dynamic import;
 * `import type` is erased and does not count), with what the mapping does
 * about it. The self-test derives the real set from the TypeScript AST and
 * requires EXACT equality, so a new file that starts reading one fails CI
 * until someone classifies it. The classification is documentation: a
 * 'pinged' entry pings nothing by itself; the module's RULE must emit that
 * page's URL. Only DIRECT imports are seen, so a page reaching a data module
 * through another lib file is found at that lib file, not at the page. Course
 * files are loaded by a template-literal import in lib/golf-courses.ts and are
 * not enumerable this way; their derived-page ripple is category (3).
 */
const CONSUMERS: Record<string, Record<string, string>> = {
  'SEO sections (lib/seo-pages.ts and the six data files)': {
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
    'lib/seo-pages.ts': 'ignored: the section registry itself (SEO_SECTIONS is asserted against it)',
  },
  'data/pricing.ts': {
    'app/[locale]/page.tsx': 'pinged',
    'app/[locale]/golf/page.tsx': 'pinged',
    'app/[locale]/lessons/page.tsx': 'pinged',
    'app/[locale]/events/page.tsx': 'pinged',
    'app/[locale]/corporate-golf-packages/page.tsx': 'pinged',
    'app/llms-full.txt/route.ts': 'pinged',
  },
  'data/coaches.ts': { 'app/[locale]/lessons/page.tsx': 'pinged' },
  'data/event-clients.ts': { 'app/[locale]/events/page.tsx': 'pinged' },
  'data/food-menu.ts': { 'app/[locale]/menu/page.tsx': 'pinged' },
  'data/faq-hub.ts': {
    'app/[locale]/faq/page.tsx': 'pinged',
    'app/llms-full.txt/route.ts': 'pinged: EN only',
  },
  'data/golf-courses-i18n.ts': {
    'app/[locale]/golf-courses/[region]/page.tsx': 'pinged: the hub',
    'app/[locale]/golf-courses/[region]/[slug]/page.tsx': 'pinged when a registration changes; the hub label it prints is category (3)',
    'app/[locale]/golf-courses/page.tsx': 'pinged: region cards',
    'app/llms.txt/route.ts': 'pinged: localized hub labels',
    'components/golf-courses/RegionHubLinks.tsx': 'ignored: region labels on / and /golf/, category (3); its course counts ping via the region-index rule',
  },
  'data/price-tiers.ts': {
    'app/[locale]/golf-courses/under/[tier]/page.tsx': 'pinged: the tier page',
    'app/[locale]/golf-courses/page.tsx': 'pinged: tier list (PRICE_TIERS)',
    'app/[locale]/golf-courses/[region]/[slug]/page.tsx': "ignored: a course's tier cross-link, category (3)",
    'lib/golf-courses-derived.ts': 'ignored: derives the tier rosters rendered by the tier page',
  },
  'data/bts-stations.ts': {
    'app/[locale]/golf-courses/near/[station]/page.tsx': 'pinged: the station page',
    'app/[locale]/golf-courses/page.tsx': 'pinged: station list (EN only)',
    'app/[locale]/golf-courses/[region]/[slug]/page.tsx': 'ignored: nearest-station line on a course, category (3)',
    'lib/golf-courses-derived.ts': 'ignored: derives the proximity rosters rendered by the station page',
    'lib/seo-links.ts': 'ignored: related-link labels, category (3)',
  },
  'data/airports.ts': {
    'app/[locale]/golf-courses/near/[station]/page.tsx': 'pinged: the airport page',
    'app/[locale]/golf-courses/page.tsx': 'pinged: airport list (EN only)',
    'lib/golf-courses-derived.ts': 'ignored: derives the proximity rosters rendered by the airport page',
    'lib/seo-links.ts': 'ignored: related-link labels, category (3)',
  },
  'data/golf-courses-use-cases.ts': {
    'app/[locale]/golf-courses/best-for/[useCase]/page.tsx': 'pinged: the use-case page',
    'app/[locale]/golf-courses/page.tsx': 'pinged: use-case list (EN only)',
    'app/[locale]/golf-courses/[region]/[slug]/page.tsx': "ignored: a course's use-case cross-links, category (3)",
    'app/sitemap.ts': 'ignored: the sitemap is not a pinged URL',
    'lib/golf-courses-derived.ts': 'ignored: derives the rosters rendered by the use-case page',
  },
  'data/blog-translated-slugs.ts': {
    'lib/translated-routes.ts': 'ignored: the registry itself (read at HEAD for fan-out)',
  },
}

/** Which CONSUMERS group a data-module path belongs to. */
const SEO_GROUP = 'SEO sections (lib/seo-pages.ts and the six data files)'
const groupFor = (target: string): string | null => {
  if (target === 'lib/seo-pages.ts' || SEO_SECTIONS.some((s) => s.file === target)) return SEO_GROUP
  return CONSUMERS[target] ? target : null
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

/** Runtime module specifiers of one source file: value imports, re-exports, import(). */
function runtimeImports(ts: typeof TS, file: string, text: string): string[] {
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS)
  const specs: string[] = []
  const visit = (n: TS.Node) => {
    if (ts.isImportDeclaration(n) && ts.isStringLiteral(n.moduleSpecifier)) {
      const c = n.importClause
      const allTypes =
        !!c &&
        (c.isTypeOnly ||
          (!c.name && !!c.namedBindings && ts.isNamedImports(c.namedBindings) && c.namedBindings.elements.length > 0 && c.namedBindings.elements.every((e) => e.isTypeOnly)))
      if (!allTypes) specs.push(n.moduleSpecifier.text)
    } else if (ts.isExportDeclaration(n) && n.moduleSpecifier && ts.isStringLiteral(n.moduleSpecifier) && !n.isTypeOnly) {
      specs.push(n.moduleSpecifier.text)
    } else if (ts.isCallExpression(n) && n.expression.kind === ts.SyntaxKind.ImportKeyword && n.arguments[0] && ts.isStringLiteral(n.arguments[0])) {
      specs.push(n.arguments[0].text)
    }
    ts.forEachChild(n, visit)
  }
  visit(sf)
  return specs
}

async function consumerChecks(root: string): Promise<Verdict[]> {
  const ts = await loadTs()
  const sources = ['app', 'components', 'lib']
    .flatMap((d) => walk(path.join(root, d)))
    .filter((p) => /\.(ts|tsx)$/.test(p))
  const found: Record<string, Set<string>> = Object.fromEntries(Object.keys(CONSUMERS).map((k) => [k, new Set<string>()]))
  for (const abs of sources) {
    const file = rel(root, abs)
    for (const spec of runtimeImports(ts, file, readFileSync(abs, 'utf8'))) {
      // `@/data/x` and relative `../data/x` alike (lib/translated-routes.ts
      // imports the blog mirror relatively).
      const target = spec.startsWith('@/')
        ? spec.slice(2)
        : spec.startsWith('.')
          ? path.posix.normalize(path.posix.join(path.posix.dirname(file), spec))
          : null
      if (!target) continue
      const group = groupFor(`${target.replace(/\.tsx?$/, '')}.ts`)
      if (group && `${target.replace(/\.tsx?$/, '')}.ts` !== file) found[group].add(file)
    }
  }
  return Object.entries(CONSUMERS).map(([mod, declared]) => {
    const got = [...found[mod]].sort()
    const want = Object.keys(declared).sort()
    const missing = got.filter((f) => !want.includes(f))
    const stale = want.filter((f) => !got.includes(f))
    const badLabels = Object.entries(declared).filter(([, v]) => !/^(pinged|ignored: .+)/.test(v)).map(([k]) => k)
    return {
      ok: missing.length === 0 && stale.length === 0 && badLabels.length === 0 && got.length > 0,
      label: `[consumers] ${mod}: ${got.length} found, ${want.length} declared`,
      detail: [
        missing.length
          ? `unclassified consumer(s): ${missing.join(', ')}. Classify each in CONSUMERS as 'pinged…' or 'ignored: <reason>'; ` +
            "a 'pinged' entry pings nothing by itself, so if the page should be pinged, make the module's RULE emit its URL"
          : '',
        stale.length ? `declared but no longer a runtime consumer: ${stale.join(', ')}` : '',
        badLabels.length ? `labels must start 'pinged' or 'ignored: <reason>': ${badLabels.join(', ')}` : '',
        got.length === 0 ? 'found none: the scan is not reading source' : '',
      ]
        .filter(Boolean)
        .join('; '),
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

  // The fingerprint directly, both directions, on the shapes it exists for.
  const fp = (s: string) => codeFingerprint(s, 'x.ts')
  const ignores = [
    ["const a = 'x'", 'const a = "x"'],
    ['const a = [1, 2]', 'const a = [1, 2,]'],
    ['const a = 1', '// note\nconst a = 1 /* inline */'],
    ['const a = 1', '/** doc */\nconst a =\n    1'],
  ]
  const detects = [
    ['const a = 1', 'const a = 2'],
    ['const a = `x ${b} y`', 'const a = `x ${b} z`'],
    ['const a = `u ${b} http://a`', 'const a = `u ${b} http://b`'],
    ['const a = [1, 2]', 'const a = [2, 1]'],
  ]
  const ignoreOk = await Promise.all(ignores.map(async ([a, b]) => (await fp(a)) === (await fp(b))))
  const detectOk = await Promise.all(detects.map(async ([a, b]) => (await fp(a)) !== (await fp(b))))
  v.push({
    ok: ignoreOk.every(Boolean) && detectOk.every(Boolean),
    label: '[fingerprint] ignores comments, JSDoc, whitespace, quotes and trailing commas; sees values, template tails and order',
    detail: `ignores=${ignoreOk.join(',')} detects=${detectOk.join(',')}`,
  })

  // SEO_SECTIONS against lib/seo-pages.ts. By CONTENT, not identity: this
  // file imports the data module by file URL while lib/seo-pages.ts reaches
  // it through its own `@/data/...` import, and under tsx on Linux those are
  // two module instances. An `===` version passed on Windows and failed all
  // six rows in CI. No two sections hold equal arrays, so a row naming the
  // wrong export or type still fails.
  const seo = await importFile(path.join(root, 'lib/seo-pages.ts'))
  const pageDataMap = seo.PAGE_DATA_MAP as Record<string, unknown>
  const prefixMap = seo.ROUTE_PREFIX_TO_TYPE as Record<string, string>
  for (const s of SEO_SECTIONS) {
    const mod = await importFile(path.join(root, s.file))
    const arr = mod[s.exportName]
    v.push({
      ok: Array.isArray(arr) && arr.length > 0 && same(pageDataMap[s.type], arr) && prefixMap[s.prefix] === s.type,
      label: `[tables] ${s.file} \`${s.exportName}\` is PAGE_DATA_MAP.${s.type} and ROUTE_PREFIX_TO_TYPE.${s.prefix}`,
      detail: `export array=${Array.isArray(arr) ? arr.length : 'missing'}, PAGE_DATA_MAP.${s.type}=${Array.isArray(pageDataMap[s.type]) ? (pageDataMap[s.type] as unknown[]).length : 'missing'}, prefix maps to ${prefixMap[s.prefix]}`,
    })
  }
  const types = SEO_SECTIONS.map((s) => s.type as string).sort()
  v.push({
    ok: same(Object.keys(pageDataMap).sort(), types) && same(Object.values(prefixMap).sort(), types),
    label: `[tables] SEO_SECTIONS covers every PAGE_DATA_MAP / ROUTE_PREFIX_TO_TYPE entry (${types.length})`,
    detail: `PAGE_DATA_MAP=${Object.keys(pageDataMap).sort().join(',')} ROUTE_PREFIX_TO_TYPE=${Object.values(prefixMap).sort().join(',')}`,
  })

  // Every file under the trigger paths today hits a real rule, not the fallback.
  const dataFiles = [...walk(path.join(root, 'data')), ...walk(path.join(root, 'messages')), ...walk(path.join(root, 'app/llms.txt')), ...walk(path.join(root, 'app/llms-full.txt'))]
    .map((p) => rel(root, p))
    .filter((f) => !path.basename(f).startsWith('.'))
  const unmapped = dataFiles.filter((f) => !ruleFor(f))
  v.push({
    ok: unmapped.length === 0 && dataFiles.length >= 150,
    label: `[coverage] ${dataFiles.length} trigger-path file(s), ${unmapped.length} with no rule`,
    detail: unmapped.length ? `unmapped: ${unmapped.join(', ')}` : `only ${dataFiles.length} files seen: the walk is not reading data/`,
  })

  // The workflow runs on EVERY push to main. Its indexnow job diffs over
  // TRIGGER_PATHS, so any `paths:` / `paths-ignore:` filter on the trigger
  // would skip some content pushes entirely, pinging nothing and staying
  // green. (This used to assert indexnow.yml's on.push.paths == TRIGGER_PATHS,
  // back when the job lived in its own path-filtered workflow.) CRLF-normalised:
  // a Windows checkout otherwise matches nothing.
  // Comment lines are dropped first: a column-0 `#` inside `on:` would
  // otherwise end the parsed block early and hide a `paths:` line after it.
  const yml = readFileSync(path.join(root, '.github/workflows/deploy-check.yml'), 'utf8')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((l) => !/^\s*#/.test(l))
    .join('\n')
  const onAt = yml.indexOf('\non:\n')
  const afterOn = onAt >= 0 ? yml.slice(onAt + '\non:\n'.length) : ''
  const nextTop = afterOn.search(/^\S/m)
  const onBlock = nextTop >= 0 ? afterOn.slice(0, nextTop) : afterOn
  const pushesMain = /^ {2}push:\n {4}branches: \[main\]\n/m.test(onBlock)
  const filtered = /^\s+["']?paths(-ignore)?["']?\s*:/m.test(onBlock)
  v.push({
    ok: onBlock.trim() !== '' && pushesMain && !filtered,
    label: '[workflow] deploy-check.yml runs on every push to main (no paths filter)',
    detail: `on: block ${onBlock.trim() ? 'found' : 'NOT found'}; push to main: ${pushesMain}; paths filter: ${filtered}`,
  })

  // LOCALES (catalogs, faq-hub) is the registry's locale set.
  const registry = await importFile(path.join(root, 'lib/translated-routes.ts'))
  const allLocales = [...(registry.ALL_LOCALES as string[])].sort()
  v.push({
    ok: same(allLocales, [...LOCALES].sort()),
    label: '[tables] LOCALES == lib/translated-routes.ts ALL_LOCALES',
    detail: `ALL_LOCALES=${allLocales.join(',')} LOCALES=${LOCALES.join(',')}`,
  })

  // The git loader reads the BASE revision as a distinct module and cleans up.
  const loader = gitLoader(root, 'HEAD')
  const probe = 'data/faq-pages.ts'
  const [b, h] = await Promise.all([loader.base(probe), loader.head(probe)])
  const [bs, hs] = await Promise.all([loader.source('base', probe), loader.source('head', probe)])
  const leftovers = readdirSync(path.join(root, 'data')).filter((n) => n.startsWith('.indexnow-base-'))
  v.push({
    ok:
      !!b && !!h && b !== h && b.faqPages !== h.faqPages && same(b.faqPages, h.faqPages) &&
      Array.isArray(b.faqPages) && (b.faqPages as unknown[]).length > 50 &&
      typeof bs === 'string' && typeof hs === 'string' && bs.length > 1000 &&
      (await codeFingerprint(bs, probe)) === (await codeFingerprint(hs, probe)) &&
      leftovers.length === 0,
    label: `[loader] base copy of ${probe} at HEAD is a separate module equal to the working tree, same fingerprint, temp file removed`,
    detail: `base=${!!b} head=${!!h} sameObject=${b === h} sources=${typeof bs}/${typeof hs} leftovers=${leftovers.join(',')}`,
  })
  v.push({
    ok: (await loader.base('data/definitely-not-a-file.ts')) === null && (await loader.source('base', 'data/definitely-not-a-file.ts')) === null,
    label: '[loader] a path absent at the base revision loads as null (an added file)',
  })
  return v
}

/** Every rule is exercised by at least one case, so "every rule is tested" is a checked claim. */
function ruleCoverage(): Verdict {
  const hit = new Set(CASES.flatMap((c) => c.changes.map((ch) => ruleFor(ch.file)?.rule.id)).filter(Boolean))
  const missing = RULES.map((r) => r.id).filter((id) => !hit.has(id))
  return {
    ok: missing.length === 0 && RULES.length >= 20,
    label: `[coverage] every one of the ${RULES.length} rules is exercised by a case`,
    detail: missing.length ? `no case exercises: ${missing.join(', ')}` : `only ${RULES.length} rules`,
  }
}

/**
 * The workflow and CI wiring, pinned by string. The trigger check above reads
 * the `on:` block of deploy-check.yml; every step below was measured editable
 * to "ping nothing, green" (`--base HEAD`, a hardcoded count=0, the derive
 * masked with `|| true`) or "ping before live" with every gate green.
 *
 * "Before live" moved when this job moved into deploy-check.yml: it used to be
 * a wait step in this job, and is now the job-level `needs: wait-for-deploy`.
 * So the pins cover that edge from both ends. This job must need the wait job
 * under its exact `if:`. The wait job must run under its exact `if:`, and its
 * poller step must run the poller, on this push's SHA, with no `if:` of its
 * own and no `continue-on-error`. Each of those was measured as a one-line
 * edit that let this job ping a deploy that never went live (or never ping)
 * with every other gate green: `|| true` after the poller command, `if: false`
 * on the step, `DEPLOY_SHA` pointed at the previous commit, a loosened job
 * `if:`. That is why the pinned lines end in `\n`: a substring pin is
 * satisfied by the same line with `|| true` or `&& false` appended. The wait
 * job's issue-closing step legitimately carries `continue-on-error`, so that
 * one step is cut out before looking. A benign edit to these lines fails here
 * on purpose: update the pin in the same commit, having checked the edit
 * keeps its step's meaning.
 */
function wiringPins(root: string): Verdict[] {
  const strip = (s: string) => s.replace(/\r\n/g, '\n').split('\n').filter((l) => !/^\s*#/.test(l)).join('\n')
  const yml = strip(readFileSync(path.join(root, '.github/workflows/deploy-check.yml'), 'utf8'))
  const jobAt = yml.indexOf('\n  indexnow:\n')
  const waitAt = yml.indexOf('\n  wait-for-deploy:\n')
  const job = jobAt >= 0 ? yml.slice(jobAt) : ''
  const waitJob = waitAt >= 0 ? yml.slice(waitAt, jobAt > waitAt ? jobAt : undefined) : ''
  const stepOf = (text: string, name: string) => {
    const at = text.indexOf(`- name: ${name}`)
    if (at < 0) return ''
    const next = text.indexOf('- name:', at + 1)
    return text.slice(at, next >= 0 ? next : undefined)
  }
  const pollStep = stepOf(waitJob, 'Wait for production to serve this commit')
  const closeStep = stepOf(waitJob, 'Close deploy-missing issues this build resolves')
  const waitJobSansClose = closeStep ? waitJob.replace(closeStep, '') : waitJob
  const required = [
    '    needs: wait-for-deploy\n',
    "    if: github.event_name == 'push'\n",
    'DIFF_BASE: ${{ needs.wait-for-deploy.outputs.diff_base }}',
    'BEFORE: ${{ github.event.before }}',
    'BASE: ${{ steps.range.outputs.base }}',
    'npx tsx scripts/indexnow-urls.ts --base "$BASE" > urls.txt\n',
    'echo "count=$(grep -c . urls.txt || true)" >> "$GITHUB_OUTPUT"',
    'mapfile -t URLS < urls.txt',
    'npx tsx scripts/indexnow-ping.ts "${URLS[@]}"',
  ]
  const gate = "if: steps.derive.outputs.count != '0'"
  const missing = required.filter((s) => !job.includes(s))
  const gates = job.split(gate).length - 1
  const forbidden = ['continue-on-error', '--base HEAD', 'count=0'].filter((s) => job.includes(s))
  const waitHeader = waitJob.slice(0, waitJob.indexOf('\n    steps:\n'))
  const waitProblems = [
    pollStep === '' && 'the poller step is missing',
    !waitHeader.includes("\n    if: github.ref == 'refs/heads/main'\n") && "the wait job's `if:` is not exactly the main-branch guard",
    !pollStep.includes('run: npx --yes tsx@4.21.0 scripts/wait-for-deploy.ts\n') && 'the poller step does not run exactly scripts/wait-for-deploy.ts',
    !pollStep.includes('DEPLOY_SHA: ${{ github.sha }}\n') && 'the poller is not given this push (DEPLOY_SHA)',
    /^\s+if:/m.test(pollStep) && 'the poller step has an `if:` of its own',
    !waitJob.includes('diff_base: ${{ steps.wait.outputs.diff_base }}') && 'the wait job does not export diff_base',
    waitJobSansClose.includes('continue-on-error') && 'continue-on-error outside the issue-closing step',
  ].filter(Boolean)
  const ci = strip(readFileSync(path.join(root, '.github/workflows/ci.yml'), 'utf8'))
  const lint = ci.slice(ci.indexOf('\n  lint:'), ci.indexOf('\n  build-and-smoke:'))
  const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')) as { scripts: Record<string, string> }
  const steps = ['npm run validate:indexnow:self-test', 'npm run validate:deploy-check:contract'].filter((s) => !lint.includes(s))
  const scripts =
    pkg.scripts['validate:indexnow:self-test'] === 'tsx scripts/indexnow-urls.ts --self-test' &&
    pkg.scripts['validate:deploy-check:contract'] === 'tsx scripts/wait-for-deploy-contract.ts'
  return [
    {
      ok: job !== '' && missing.length === 0 && gates === 1 && forbidden.length === 0,
      label: '[workflow] deploy-check.yml indexnow job: derive/ping wired as pinned, the ping gated on the count',
      detail: `job ${job ? 'found' : 'NOT found'}; missing: ${missing.join(' | ') || 'none'}; count gates: ${gates} (want 1); forbidden present: ${forbidden.join(', ') || 'none'}`,
    },
    {
      ok: waitJob !== '' && waitProblems.length === 0,
      label: '[workflow] deploy-check.yml wait-for-deploy gates the indexnow job (poller step pinned, never continue-on-error)',
      detail: waitProblems.join('; ') || 'ok',
    },
    {
      ok: steps.length === 0 && scripts,
      label: '[ci] the derivation self-test and the deploy poller contract are their own lint-job steps, one script each',
      detail: `missing lint steps: ${steps.join(', ') || 'none'}; package.json scripts exact: ${scripts}`,
    },
  ]
}

function findUp(from: string, rel: string): string | null {
  for (let d = from; ; d = path.dirname(d)) {
    if (existsSync(path.join(d, rel))) return path.join(d, rel)
    if (path.dirname(d) === d) return null
  }
}

/**
 * The CLI end to end, as the workflow runs it: the real `main()` (rev-parse,
 * `git diff --no-renames` over the pathspecs, the git loader wired to the real
 * base, stdout vs stderr, exit codes) against synthetic BASE commits built with
 * git plumbing, in a clean detached worktree of HEAD. Nothing else reaches that
 * path: `main()` rewired to diff HEAD against itself, URLs printed to stderr, or
 * a pathspec that matches nothing each made the job derive 0 URLs and exit 0
 * with every case above green.
 *
 * The worktree runs THIS script file (so an uncommitted edit is what gets
 * tested) with cwd set to the worktree, and borrows node_modules through a
 * link, which is removed before the worktree is: a recursive delete must never
 * reach the real node_modules through it.
 */
async function cliContract(root: string, reg: Registry): Promise<Verdict[]> {
  const nm = findUp(root, 'node_modules')
  const tsxCli = nm && path.join(nm, 'tsx', 'dist', 'cli.mjs')
  if (!nm || !tsxCli || !existsSync(tsxCli)) {
    return [{ ok: false, label: '[cli] contract', detail: 'node_modules/tsx not found above the repo root' }]
  }
  const tmp = mkdtempSync(path.join(tmpdir(), 'indexnow-cli-'))
  const wt = path.join(tmp, 'wt')
  const link = path.join(wt, 'node_modules')
  const env = { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' }
  const self = path.join(root, 'scripts', 'indexnow-urls.ts')
  const run = (base: string) => spawnSync(process.execPath, [tsxCli, self, '--base', base], { cwd: wt, encoding: 'utf8', env: { ...env, GITHUB_ACTIONS: '' } })
  /** A commit whose tree is HEAD's with `edits` applied: content = replace, null = delete. */
  const base = (edits: Record<string, string | null>) => {
    const idxEnv = { ...env, GIT_INDEX_FILE: path.join(tmp, `index-${Object.keys(edits).length}-${Date.now()}`) }
    execFileSync('git', ['read-tree', 'HEAD'], { cwd: root, env: idxEnv })
    for (const [file, content] of Object.entries(edits)) {
      if (content === null) {
        execFileSync('git', ['update-index', '--force-remove', file], { cwd: root, env: idxEnv })
      } else {
        const blob = execFileSync('git', ['hash-object', '-w', '--stdin'], { cwd: root, input: content, encoding: 'utf8' }).trim()
        execFileSync('git', ['update-index', '--add', '--cacheinfo', `100644,${blob},${file}`], { cwd: root, env: idxEnv })
      }
    }
    const tree = execFileSync('git', ['write-tree'], { cwd: root, env: idxEnv, encoding: 'utf8' }).trim()
    return execFileSync('git', ['commit-tree', tree, '-m', 'indexnow CLI contract base'], { cwd: root, env, encoding: 'utf8' }).trim()
  }
  // The expectation is built from the registry directly, not through served().
  const url = (l: string, p: string) => `${SITE}${l === 'en' ? '' : `/${l}`}${p}`
  const everyLocale = (p: string) => reg.getLocalesForPath(p).map((l) => url(l, p))
  const lines = (s: string) => s.split('\n').filter(Boolean).sort()

  const v: Verdict[] = []
  try {
    execFileSync('git', ['worktree', 'add', '--detach', '--quiet', wt, 'HEAD'], { cwd: root, stdio: 'ignore' })
    symlinkSync(nm, link, process.platform === 'win32' ? 'junction' : 'dir')

    // 1. One probe FAQ entry exists at base and not at head: a removed EN entry.
    const faqRel = 'data/faq-pages.ts'
    const faqSrc = readFileSync(path.join(wt, faqRel), 'utf8')
    const anchor = 'export const faqPages: FaqSeoPage[] = ['
    const probe = 'zz-indexnow-cli-contract-probe'
    const withProbe = faqSrc.split(anchor).length === 2
      ? faqSrc.replace(anchor, `${anchor}\n  { id: 'probe', page_type: 'faq', slug: '${probe}', locale: 'en', status: 'published', title: 'probe' } as FaqSeoPage,`)
      : null
    if (!withProbe) {
      v.push({ ok: false, label: '[cli] removed FAQ entry', detail: `anchor "${anchor}" not found exactly once in ${faqRel}` })
    } else {
      const r = run(base({ [faqRel]: withProbe }))
      const want = [...new Set([url('en', `/faq/${probe}/`), ...everyLocale('/golf-in-thailand-guide/'), url('en', '/faq/'), url('en', '/llms.txt'), url('en', '/llms-full.txt')])].sort()
      v.push({
        ok: r.status === 0 && same(lines(r.stdout), want),
        label: '[cli] a base holding one extra EN FAQ entry derives exactly its URL and the EN FAQ listings, on stdout',
        detail: `exit ${r.status}; want [${want.join(' ')}]; stdout [${lines(r.stdout).join(' ')}]; stderr tail: ${r.stderr.trim().split('\n').slice(-3).join(' / ')}`,
      })
    }

    // 2. A course at a different path at base: a rename, which must split into D + A.
    const region = readdirSync(path.join(wt, 'data/golf-courses')).find((d) => existsSync(path.join(wt, 'data/golf-courses', d, 'index.ts')))!
    const slug = readdirSync(path.join(wt, 'data/golf-courses', region)).find((f) => f !== 'index.ts' && f.endsWith('.ts'))!.replace(/\.ts$/, '')
    const now = `data/golf-courses/${region}/${slug}.ts`
    const then = `data/golf-courses/${region}/zz-cli-contract-old.ts`
    const r2 = run(base({ [now]: null, [then]: readFileSync(path.join(wt, now), 'utf8') }))
    const want2 = [...new Set([url('en', `/golf-courses/${region}/zz-cli-contract-old/`), ...everyLocale(`/golf-courses/${region}/${slug}/`), ...everyLocale(`/golf-courses/${region}/`)])].sort()
    v.push({
      ok: r2.status === 0 && same(lines(r2.stdout), want2) && !r2.stderr.includes('could not diff'),
      label: '[cli] a course that moved paths pings BOTH its old URL and every locale of its new one',
      detail: `exit ${r2.status}; want [${want2.join(' ')}]; stdout [${lines(r2.stdout).join(' ')}]; stderr tail: ${r2.stderr.trim().split('\n').slice(-3).join(' / ')}`,
    })

    // 3. Nothing changed: exit 0, empty stdout.
    const r3 = run('HEAD')
    v.push({ ok: r3.status === 0 && r3.stdout.trim() === '', label: '[cli] base == HEAD derives nothing and exits 0', detail: `exit ${r3.status}; stdout "${r3.stdout.trim().slice(0, 80)}"` })

    // 4. A bad base is an error, never an empty green run.
    const r4 = run('not-a-rev')
    v.push({ ok: r4.status !== 0 && r4.stdout.trim() === '', label: '[cli] an unresolvable --base exits non-zero with nothing on stdout', detail: `exit ${r4.status}` })
  } catch (err) {
    v.push({ ok: false, label: '[cli] contract setup', detail: (err as Error).message })
  } finally {
    let linkGone = !existsSync(link)
    if (!linkGone) {
      try {
        unlinkSync(link)
      } catch {
        try {
          rmdirSync(link)
        } catch {
          /* reported below */
        }
      }
      linkGone = !existsSync(link)
    }
    if (linkGone) {
      spawnSync('git', ['worktree', 'remove', '--force', wt], { cwd: root, stdio: 'ignore' })
      rmSync(tmp, { recursive: true, force: true })
    } else {
      console.log(`  ! could not remove the node_modules link at ${link}; left ${tmp} in place rather than risk deleting through it`)
    }
  }
  // Exactly four verdicts, whatever threw: a setup failure must not shrink the count.
  while (v.length < 4) v.push({ ok: false, label: '[cli] contract', detail: 'not reached' })
  return v.slice(0, 4)
}

async function selfTest(): Promise<void> {
  const root = process.cwd()
  const results: { c: Case; got: FileResult[] }[] = []
  for (const c of CASES) {
    const reg = stubRegistry(c.registered ?? [])
    const baseReg = c.baseRegistered ? stubRegistry(c.baseRegistered) : reg
    results.push({ c, got: await deriveAll(c.changes, { reg, baseReg, loader: memLoader(c.base, c.head, c.sources, c.throws) }) })
  }
  const derived = runSelfTest('indexnow-urls', results, ({ c, got }) => {
    const urls = [...new Set(got.flatMap((r) => r.urls))].sort()
    const want = [...new Set(c.want.map(U))].sort()
    const warned = got.some((r) => r.warn)
    return {
      ok: same(urls, want) && warned === !!c.wantWarn,
      label: c.name,
      detail: `want ${want.length} [${want.join(' ')}] warn=${!!c.wantWarn}; got ${urls.length} [${urls.join(' ')}] warn=${warned} (${got.map((r) => r.note).join(' | ')})`,
    }
  })
  const realReg = (await importFile(path.join(root, 'lib/translated-routes.ts'))) as unknown as Registry
  const structural = runSelfTest(
    'indexnow-urls',
    [ruleCoverage(), ...wiringPins(root), ...(await structuralChecks(root)), ...(await consumerChecks(root)), ...(await cliContract(root, realReg))],
    (x) => x
  )

  const examined = derived.examined + structural.examined
  const failures = derived.failures + structural.failures
  // Exact, not a floor: the derivation cases; rule coverage; three wiring pins
  // (the indexnow job, the wait job that gates it, the CI steps); one table
  // verdict per SEO section plus eight more (sig, fingerprint, section union,
  // trigger-path coverage, workflow trigger, locales, two loader checks); one
  // consumer verdict per CONSUMERS key; four CLI verdicts.
  const expected = CASES.length + 1 + 3 + SEO_SECTIONS.length + 8 + Object.keys(CONSUMERS).length + 4
  if (CASES.length !== 55 || examined !== expected) {
    console.log(`FAIL: examined ${examined} verdict(s), expected ${expected} (CASES=${CASES.length}, want 55)`)
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
