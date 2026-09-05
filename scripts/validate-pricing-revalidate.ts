/**
 * validate:pricing-revalidate — the gate behind the 30-day pricing fetch.
 *
 * `getPricingCatalog()` (lib/pricing.ts) fetches with `revalidate: 30 days`.
 * Next sets a route's effective revalidate to the SHORTER of its own declared
 * value and every fetch-level revalidate used while it renders, so that fetch
 * can only shorten a caller's interval — never lengthen it. The consequence
 * runs the other way: a route that reads pricing and declares NO revalidate of
 * its own inherits 30 days outright. That is not hypothetical. Until PR #113
 * the fetch was 300s and forced ~597 pages to regenerate every five minutes;
 * the owner's 2026-09-04 ruling took it to 30 days on the explicit premise
 * that every caller which should still regenerate daily says so ITSELF
 * (`export const revalidate = 86400`).
 *
 * Nothing enforced that premise. This does.
 *
 * WHAT IT CHECKS: a route entry file under app/ that transitively references a
 * pricing symbol must declare `export const revalidate`. THIRTEEN route files
 * genuinely read pricing today and all 13 declare it, so this gate fires on
 * ZERO lines in healthy code — which is exactly why it needs the anti-vacuity
 * pins below and the contract suite beside it. A green run is not evidence.
 *
 * THIRTEEN, NOT EIGHT, and the gap is the whole reason taint has to cross
 * components/. Eight routes call a pricing getter THEMSELVES (menu, golf,
 * events, lessons, corporate-golf-packages, guide/[slug], [locale]/page and
 * llms.txt/route). The other five — activities/[slug], best/[slug],
 * cost/[slug], faq/[slug], hotels/[slug] — never name one: they render a
 * default-exported server component that calls `getSiteFacts()`, which calls
 * `getPricingCatalog()`. The prototype behind this gate reported 8 because it
 * matched named imports only, and `export default async function FaqPageComponent`
 * is reachable under `default`, not under its own name. That is a FALSE
 * NEGATIVE on five indexed route families, and it is silent: the analyzer
 * printed a healthy line. Registering a default export under BOTH names is the
 * fix, and the contract suite pins it.
 *
 * WHY SYMBOL-LEVEL TAINT AND NOT MODULE REACHABILITY. Measured on the tree as
 * it stood 2026-09-05, before the dead-code deletion in this same commit:
 *
 *   naive module reachability   35 of 38 route files "reach" lib/pricing,
 *                               9 of them wrongly — unusable as a gate.
 *   + excluding `import type`   17 reaching, 4 flagged. Type-only edges are
 *                               ERASED at build (lib/jsonld.ts:4 is one), so
 *                               they cannot carry a fetch. Those 4 were
 *                               /faq/, /hotels/, /activities/ and
 *                               golf-in-thailand-guide, all reaching pricing
 *                               through lib/seo-pages.ts -> data/faq-pages.ts,
 *                               which imported the catalog for FOUR getters
 *                               with zero callers repo-wide.
 *   symbol-level taint          0 false positives, because a module is not
 *                               the unit of the hazard — a SYMBOL is. A page
 *                               importing `faqPages` from a file that also
 *                               exports a pricing getter does not fetch.
 *
 * Be careful reading that middle row against the pinned route list, because
 * three of its four names appear there. They are not the same finding. The
 * module-reachability version flagged /faq/, /hotels/ and /activities/ for a
 * reason that WAS wrong — an import of `faqPages` from a module that also
 * exported a dead pricing getter — and it happened to be right about the
 * conclusion for an unrelated reason it could not see, the `getSiteFacts()`
 * call inside their page components. golf-in-thailand-guide is the one that
 * settles it: same wrong reason, and it genuinely does not read pricing, so it
 * is absent from the pin. Deleting the four dead getters (same commit)
 * removed that wrong reason entirely.
 *
 * WHY THE TYPESCRIPT AST, and not string scanning. `data/faq-pages.ts` names
 * its deleted pricing getters in NINE comments — a text-based prototype
 * false-flagged five files on comment text alone before the AST version was
 * written. Note the scope of that claim honestly: after this commit those
 * comments name only DELETED symbols, so the live text trap is gone and the
 * argument for the AST is the FUTURE one — comments, strings, regex literals
 * and type positions are a parser's job, and a regex literal landing in a
 * scanned file is exactly how validate-open-graph's hand-rolled scanner
 * corrupted three files under scripts/. `typescript` is already a
 * devDependency and that gate is the precedent. One consequence worth naming:
 * `isTypeNode` subtrees are skipped, so `Promise<PricingCatalog>` in a
 * signature is not a reference — which is what keeps app/[locale]/layout.tsx
 * off the list, since its only edge to pricing is a type-only one.
 *
 * WHY `revalidate = false` IS REJECTED. It is a declaration, so a
 * presence-only check would pass it — but `false` means Infinity, and Next
 * takes the MIN, so the route lands on the fetch's 30 days anyway. That is the
 * exact silent inherit this gate exists to stop. Every other initializer is
 * accepted, including a non-literal, because over-constraining the VALUE buys
 * nothing measurable (all 29 declarations in app/ today are numeric literals)
 * and risks a false red on correct code.
 *
 * ANTI-VACUITY. Three pins, because 0 flags is indistinguishable from a broken
 * analyzer. They are NOT independent oracles — an analyzer that stops
 * propagating collapses the first two together, and neither can prove the
 * revalidate comparison DISCRIMINATES (pinning it true, or `if (false && …)`,
 * stays green with a real defect live). Only the contract suite beside this
 * file catches those, by spawning the gate as a child process and asserting
 * its EXIT CODE from outside. What these three do catch:
 *   1. EXPECTED_TAINTED — the exact tainted-symbol inventory. An analyzer that
 *      stops propagating (a resolver regression, a renamed seed) collapses
 *      this set while still printing "0 problems".
 *   2. EXPECTED_PRICING_ROUTES — the exact set of route files that read
 *      pricing. Exact, not a floor: a floor passes every over-count, and
 *      over-counting is how the naive version looked healthy at 35.
 *   3. `judged` vs `routesExamined`, with `judged++` placed AFTER the
 *      revalidate comparison. A `continue` between the two would otherwise
 *      leave every floor at its true value while evaluating zero comparisons —
 *      the smoke-L6 shape this repo has now hit four times.
 *
 * KNOWN LIMIT: this reads SOURCE. A pricing read introduced through a dynamic
 * `await import()` with a computed specifier, or through a bare re-export
 * chain this resolver cannot follow, is invisible. Both are absent today.
 *
 * Env overrides (PRICING_GATE_*) exist SOLELY so the contract suite can point
 * the real binary at a fixture tree; CI runs the ordinary step with none set.
 *
 * No server needed.
 */

import ts from 'typescript'
import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { join, dirname, relative, sep, resolve } from 'path'

// ── Configuration ──────────────────────────────────────────────────────────

const ROOT = resolve(process.env.PRICING_GATE_ROOT ?? '.')

/** Directories walked to build the module graph. */
const SCAN_DIRS = (process.env.PRICING_GATE_DIRS ?? 'app,lib,data,components,types,i18n')
  .split(',')
  .map(d => d.trim())
  .filter(Boolean)

/** Seeds: `<repo-relative module>#<exported symbol>`, comma separated. */
const SEEDS = (process.env.PRICING_GATE_SEEDS ?? 'lib/pricing.ts#getPricingCatalog')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

/** Only files under this directory can be route entry points. */
const APP_DIR = process.env.PRICING_GATE_APP_DIR ?? 'app'

/**
 * Next route-segment files that accept `export const revalidate`. A component
 * under app/ that is not one of these is an ordinary module: it inherits the
 * segment's config and must not be asked to declare its own.
 */
const ROUTE_BASENAMES = new Set([
  'page.tsx', 'page.ts',
  'layout.tsx', 'layout.ts',
  'route.ts', 'route.tsx',
  'template.tsx', 'default.tsx',
  'sitemap.ts', 'robots.ts',
  'opengraph-image.tsx', 'twitter-image.tsx',
  'icon.tsx', 'apple-icon.tsx',
])

/**
 * Expectations. Overridable as JSON files so the contract suite can pin a
 * fixture tree's own inventory; unset in CI, where the literals below apply.
 */
function expectedFrom(envVar: string, fallback: string[]): string[] {
  const p = process.env[envVar]
  if (!p) return fallback
  return JSON.parse(readFileSync(p, 'utf8')) as string[]
}

/**
 * Every symbol that transitively reaches getPricingCatalog. Pinned EXACTLY.
 * Regenerate with `npm run validate:pricing-revalidate -- --print-inventory`
 * and read the diff before pasting it in: a symbol LEAVING this list means the
 * analyzer stopped seeing an edge, which is the failure mode that makes a
 * green run meaningless.
 */
const EXPECTED_TAINTED_LITERAL: string[] = [
  'app/[locale]/activities/[slug]/page.tsx#ActivityPage',
  'app/[locale]/activities/[slug]/page.tsx#default',
  'app/[locale]/best/[slug]/page.tsx#BestOfListiclePage',
  'app/[locale]/best/[slug]/page.tsx#default',
  'app/[locale]/corporate-golf-packages/page.tsx#CorporateGolfPackagesPage',
  'app/[locale]/corporate-golf-packages/page.tsx#default',
  'app/[locale]/corporate-golf-packages/page.tsx#generateMetadata',
  'app/[locale]/cost/[slug]/page.tsx#PriceGuidePage',
  'app/[locale]/cost/[slug]/page.tsx#default',
  'app/[locale]/events/page.tsx#EventsPage',
  'app/[locale]/events/page.tsx#default',
  'app/[locale]/faq/[slug]/page.tsx#FaqPage',
  'app/[locale]/faq/[slug]/page.tsx#default',
  'app/[locale]/golf/page.tsx#GolfPage',
  'app/[locale]/golf/page.tsx#default',
  'app/[locale]/guide/[slug]/page.tsx#ExplainerPage',
  'app/[locale]/guide/[slug]/page.tsx#default',
  'app/[locale]/guide/[slug]/page.tsx#generateMetadata',
  'app/[locale]/hotels/[slug]/page.tsx#HotelConciergeSeoPage',
  'app/[locale]/hotels/[slug]/page.tsx#default',
  'app/[locale]/lessons/page.tsx#LessonsPage',
  'app/[locale]/lessons/page.tsx#default',
  'app/[locale]/menu/page.tsx#MenuPage',
  'app/[locale]/menu/page.tsx#default',
  'app/[locale]/page.tsx#HomePage',
  'app/[locale]/page.tsx#default',
  'app/llms.txt/route.ts#GET',
  'components/activities/ActivityPage.tsx#ActivityPageComponent',
  'components/activities/ActivityPage.tsx#default',
  'components/best/BestOfListiclePage.tsx#BestOfListiclePage',
  'components/best/BestOfListiclePage.tsx#default',
  'components/faq/FaqPage.tsx#FaqPageComponent',
  'components/faq/FaqPage.tsx#default',
  'components/home/KoreaLandingPage.tsx#KoreaLandingPage',
  'components/home/KoreaLandingPage.tsx#default',
  'components/hotels/HotelConciergePage.tsx#HotelConciergePage',
  'components/hotels/HotelConciergePage.tsx#default',
  'components/prices/PriceGuidePage.tsx#PriceGuidePageComponent',
  'components/prices/PriceGuidePage.tsx#default',
  'data/pricing.ts#getBayRatesData',
  'data/pricing.ts#getEventPackagesData',
  'data/pricing.ts#getLessonPricingData',
  'data/pricing.ts#getMonthlyPackagesData',
  'lib/pricing.ts#getPricingCatalog',
  'lib/site-facts.ts#getFactTokens',
  'lib/site-facts.ts#getSiteFacts',
]

/**
 * Route entry files that legitimately read pricing. Pinned EXACTLY, not as a
 * floor — the naive analyzer this replaces looked healthy at 35 of 38.
 */
const EXPECTED_PRICING_ROUTES_LITERAL: string[] = [
  'app/[locale]/activities/[slug]/page.tsx',
  'app/[locale]/best/[slug]/page.tsx',
  'app/[locale]/corporate-golf-packages/page.tsx',
  'app/[locale]/cost/[slug]/page.tsx',
  'app/[locale]/events/page.tsx',
  'app/[locale]/faq/[slug]/page.tsx',
  'app/[locale]/golf/page.tsx',
  'app/[locale]/guide/[slug]/page.tsx',
  'app/[locale]/hotels/[slug]/page.tsx',
  'app/[locale]/lessons/page.tsx',
  'app/[locale]/menu/page.tsx',
  'app/[locale]/page.tsx',
  'app/llms.txt/route.ts',
]

/** Floors on the walk itself: a resolver that finds nothing prints "0 OK". */
const MIN_FILES_PARSED = Number(process.env.PRICING_GATE_MIN_FILES ?? 300)
const MIN_ROUTES_EXAMINED = Number(process.env.PRICING_GATE_MIN_ROUTES ?? 30)

// ── Module graph ───────────────────────────────────────────────────────────

interface ImportBinding {
  /** Repo-relative module path, or null when unresolvable (node_modules). */
  module: string | null
  /** Exported name in that module; '*' for a namespace import. */
  imported: string
}

interface Decl {
  name: string
  node: ts.Node
  /** Exported names this declaration is reachable under. */
  exportedAs: string[]
}

interface Mod {
  rel: string
  source: ts.SourceFile
  /** Local binding name -> import binding. Type-only specifiers excluded. */
  imports: Map<string, ImportBinding>
  /** Top-level value declarations, keyed by local name. */
  decls: Map<string, Decl>
  /** `export { x } from './m'` / `export * from './m'` re-export edges. */
  reexports: Array<{ module: string | null; imported: string; exported: string }>
  starReexports: Array<string | null>
  /** Identifiers referenced at module top level, outside any declaration. */
  topLevelRefs: Set<string>
}

function walkFiles(dir: string, out: string[]): void {
  if (!existsSync(dir)) return
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next' || entry.startsWith('.')) continue
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) walkFiles(full, out)
    else if (/\.tsx?$/.test(entry) && !entry.endsWith('.d.ts')) out.push(full)
  }
}

function toRel(abs: string): string {
  return relative(ROOT, abs).split(sep).join('/')
}

/** Resolve an import specifier to a repo-relative file, or null. */
function resolveSpecifier(spec: string, fromRel: string): string | null {
  let base: string
  if (spec.startsWith('@/')) base = join(ROOT, spec.slice(2))
  else if (spec.startsWith('.')) base = resolve(ROOT, dirname(fromRel), spec)
  else return null // node_modules / bare specifier

  for (const cand of [
    base + '.ts', base + '.tsx',
    join(base, 'index.ts'), join(base, 'index.tsx'),
  ]) {
    if (existsSync(cand) && statSync(cand).isFile()) return toRel(cand)
  }
  return null
}

function parse(abs: string): Mod {
  const rel = toRel(abs)
  const src = readFileSync(abs, 'utf8')
  const source = ts.createSourceFile(
    rel, src, ts.ScriptTarget.Latest, true,
    abs.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  )

  const mod: Mod = {
    rel, source,
    imports: new Map(),
    decls: new Map(),
    reexports: [],
    starReexports: [],
    topLevelRefs: new Set(),
  }

  for (const stmt of source.statements) {
    // ── import ... from '...' ──
    if (ts.isImportDeclaration(stmt) && ts.isStringLiteral(stmt.moduleSpecifier)) {
      const clause = stmt.importClause
      if (!clause) continue
      // `import type { X } from` — erased at build, carries no fetch.
      if (clause.isTypeOnly) continue
      const target = resolveSpecifier(stmt.moduleSpecifier.text, rel)
      if (clause.name) mod.imports.set(clause.name.text, { module: target, imported: 'default' })
      const b = clause.namedBindings
      if (b && ts.isNamespaceImport(b)) mod.imports.set(b.name.text, { module: target, imported: '*' })
      if (b && ts.isNamedImports(b)) {
        for (const el of b.elements) {
          if (el.isTypeOnly) continue // `import { type X }` — erased too
          mod.imports.set(el.name.text, {
            module: target,
            imported: (el.propertyName ?? el.name).text,
          })
        }
      }
      continue
    }

    // ── export { x } from '...' / export * from '...' ──
    if (ts.isExportDeclaration(stmt)) {
      if (stmt.isTypeOnly) continue
      const target = stmt.moduleSpecifier && ts.isStringLiteral(stmt.moduleSpecifier)
        ? resolveSpecifier(stmt.moduleSpecifier.text, rel)
        : undefined
      if (stmt.exportClause && ts.isNamedExports(stmt.exportClause)) {
        for (const el of stmt.exportClause.elements) {
          if (el.isTypeOnly) continue
          const imported = (el.propertyName ?? el.name).text
          if (target !== undefined) {
            mod.reexports.push({ module: target, imported, exported: el.name.text })
          } else {
            // `export { local as pub }` — an alias onto a local declaration.
            mod.reexports.push({ module: rel, imported, exported: el.name.text })
          }
        }
      } else if (!stmt.exportClause && target !== undefined) {
        mod.starReexports.push(target)
      }
      continue
    }

    const mods_ = ts.canHaveModifiers(stmt) ? ts.getModifiers(stmt) : undefined
    const exported = !!mods_?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
    // `export default function X` is reachable under BOTH names, and the
    // importing route almost always uses the default one. Missing this made
    // four routes that DO read pricing (via a default-exported server
    // component) invisible to the analyzer while it printed a healthy line.
    const isDefault = !!mods_?.some(m => m.kind === ts.SyntaxKind.DefaultKeyword)
    const namesFor = (local: string) =>
      exported ? (isDefault ? [local, 'default'] : [local]) : []

    // `export default <expression>` — no declaration name of its own.
    if (ts.isExportAssignment(stmt) && !stmt.isExportEquals) {
      mod.decls.set('default', { name: 'default', node: stmt, exportedAs: ['default'] })
      continue
    }

    if (ts.isFunctionDeclaration(stmt) && stmt.name) {
      mod.decls.set(stmt.name.text, { name: stmt.name.text, node: stmt, exportedAs: namesFor(stmt.name.text) })
      continue
    }
    if (ts.isClassDeclaration(stmt) && stmt.name) {
      mod.decls.set(stmt.name.text, { name: stmt.name.text, node: stmt, exportedAs: namesFor(stmt.name.text) })
      continue
    }
    if (ts.isVariableStatement(stmt)) {
      for (const d of stmt.declarationList.declarations) {
        if (!ts.isIdentifier(d.name)) continue // destructuring at top level: rare, ignored
        mod.decls.set(d.name.text, { name: d.name.text, node: d, exportedAs: namesFor(d.name.text) })
      }
      continue
    }
    // Interfaces and type aliases are erased; they cannot carry a fetch.
    if (ts.isInterfaceDeclaration(stmt) || ts.isTypeAliasDeclaration(stmt)) continue

    // Anything else at top level (a bare call, an `export default <expr>`) is
    // module-level code: its identifiers count as references from the module.
    collectRefs(stmt, mod.topLevelRefs)
  }

  return mod
}

/** Identifiers referenced in VALUE position inside `node`. */
function collectRefs(node: ts.Node, out: Set<string>): void {
  const visit = (n: ts.Node): void => {
    // Type positions are erased at build — `Promise<PricingCatalog>` is not a
    // reference, and neither is `satisfies X` or a type argument.
    if (ts.isTypeNode(n) || ts.isTypeParameterDeclaration(n)) return
    if (ts.isPropertyAccessExpression(n)) {
      // `ns.getPricingCatalog` — the name after the dot is a property, not a
      // binding, but the object expression is.
      visit(n.expression)
      return
    }
    if (ts.isPropertyAssignment(n) && !ts.isComputedPropertyName(n.name)) {
      visit(n.initializer)
      return
    }
    if (ts.isIdentifier(n)) { out.add(n.text); return }
    n.forEachChild(visit)
  }
  node.forEachChild(visit)
}

// ── Taint fixpoint ─────────────────────────────────────────────────────────

const key = (mod: string, sym: string) => `${mod}#${sym}`

interface Analysis {
  mods: Map<string, Mod>
  /** Tainted EXPORTED symbols, as `module#exportName`. */
  taintedExports: Set<string>
  /** Tainted local declarations, as `module#localName`. */
  taintedLocals: Set<string>
  filesParsed: number
}

function analyze(): Analysis {
  const files: string[] = []
  for (const d of SCAN_DIRS) walkFiles(join(ROOT, d), files)
  const mods = new Map<string, Mod>()
  for (const f of files) {
    const m = parse(f)
    mods.set(m.rel, m)
  }

  const taintedExports = new Set<string>(SEEDS)
  const taintedLocals = new Set<string>(SEEDS)

  /** Does a reference from `mod` named `ref` resolve to something tainted? */
  const refIsTainted = (mod: Mod, ref: string): boolean => {
    if (taintedLocals.has(key(mod.rel, ref))) return true
    const imp = mod.imports.get(ref)
    if (!imp || !imp.module) return false
    if (imp.imported === '*') {
      // `import * as p from '@/lib/pricing'` — any tainted export reaches.
      for (const t of taintedExports) if (t.startsWith(imp.module + '#')) return true
      return false
    }
    return taintedExports.has(key(imp.module, imp.imported))
  }

  let changed = true
  let rounds = 0
  while (changed) {
    changed = false
    if (++rounds > 200) throw new Error('taint fixpoint did not converge')
    for (const mod of mods.values()) {
      for (const decl of mod.decls.values()) {
        if (taintedLocals.has(key(mod.rel, decl.name))) {
          for (const e of decl.exportedAs) {
            if (!taintedExports.has(key(mod.rel, e))) { taintedExports.add(key(mod.rel, e)); changed = true }
          }
          continue
        }
        const refs = new Set<string>()
        collectRefs(decl.node, refs)
        refs.delete(decl.name) // self-reference is not taint
        let hit = false
        for (const r of refs) if (refIsTainted(mod, r)) { hit = true; break }
        if (hit) {
          taintedLocals.add(key(mod.rel, decl.name))
          for (const e of decl.exportedAs) taintedExports.add(key(mod.rel, e))
          changed = true
        }
      }
      for (const re of mod.reexports) {
        if (!re.module) continue
        if (taintedExports.has(key(re.module, re.imported)) || taintedLocals.has(key(re.module, re.imported))) {
          if (!taintedExports.has(key(mod.rel, re.exported))) {
            taintedExports.add(key(mod.rel, re.exported)); changed = true
          }
        }
      }
      for (const star of mod.starReexports) {
        if (!star) continue
        for (const t of [...taintedExports]) {
          if (!t.startsWith(star + '#')) continue
          const sym = t.slice(star.length + 1)
          if (!taintedExports.has(key(mod.rel, sym))) { taintedExports.add(key(mod.rel, sym)); changed = true }
        }
      }
    }
  }

  return { mods, taintedExports, taintedLocals, filesParsed: mods.size }
}

// ── Route inspection ───────────────────────────────────────────────────────

function isRouteFile(rel: string): boolean {
  if (!rel.startsWith(APP_DIR + '/') && rel !== APP_DIR) return false
  const base = rel.slice(rel.lastIndexOf('/') + 1)
  return ROUTE_BASENAMES.has(base)
}

type RevalidateState =
  | { kind: 'missing' }
  | { kind: 'false' }
  | { kind: 'declared'; text: string }

function revalidateOf(mod: Mod): RevalidateState {
  for (const stmt of mod.source.statements) {
    if (!ts.isVariableStatement(stmt)) continue
    if (!ts.getModifiers(stmt)?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) continue
    for (const d of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(d.name) || d.name.text !== 'revalidate') continue
      const init = d.initializer
      if (init && init.kind === ts.SyntaxKind.FalseKeyword) return { kind: 'false' }
      return { kind: 'declared', text: init ? init.getText(mod.source) : '(no initializer)' }
    }
  }
  return { kind: 'missing' }
}

/** Which tainted symbols does this module reference directly? */
function pricingRefsOf(mod: Mod, a: Analysis): string[] {
  const refs = new Set<string>(mod.topLevelRefs)
  for (const decl of mod.decls.values()) collectRefs(decl.node, refs)
  const hits: string[] = []
  for (const r of refs) {
    if (a.taintedLocals.has(key(mod.rel, r))) { hits.push(`${r} (local)`); continue }
    const imp = mod.imports.get(r)
    if (!imp || !imp.module) continue
    if (imp.imported === '*') {
      const any = [...a.taintedExports].some(t => t.startsWith(imp.module + '#'))
      if (any) hits.push(`${r} (namespace of ${imp.module})`)
      continue
    }
    if (a.taintedExports.has(key(imp.module, imp.imported))) hits.push(`${imp.imported} <- ${imp.module}`)
  }
  return hits.sort()
}

// ── Main ───────────────────────────────────────────────────────────────────

function main(): void {
  const a = analyze()
  const problems: string[] = []

  const routes = [...a.mods.keys()].filter(isRouteFile).sort()
  const pricingRoutes: string[] = []

  let routesExamined = 0
  let judged = 0

  for (const rel of routes) {
    routesExamined++
    const mod = a.mods.get(rel)!
    const hits = pricingRefsOf(mod, a)
    if (hits.length === 0) continue
    pricingRoutes.push(rel)

    const rv = revalidateOf(mod)
    if (rv.kind === 'missing') {
      problems.push(
        `${rel}\n    reads pricing via: ${hits.join(', ')}\n` +
        `    but declares no \`export const revalidate\`, so Next gives it the\n` +
        `    pricing fetch's interval — 30 days — and the page stops regenerating.`,
      )
    } else if (rv.kind === 'false') {
      problems.push(
        `${rel}\n    reads pricing via: ${hits.join(', ')}\n` +
        `    declares \`export const revalidate = false\`, which is Infinity. Next\n` +
        `    takes the MIN of that and the fetch's 30 days, so the route lands on\n` +
        `    30 days anyway. Write the interval you actually want.`,
      )
    }
    // AFTER the comparison, never at the top of the loop: a `continue` placed
    // one line higher would leave every floor at its true value while
    // evaluating zero revalidate checks.
    judged++
  }

  if (process.argv.includes('--print-inventory')) {
    console.log('EXPECTED_TAINTED_LITERAL:')
    console.log(JSON.stringify([...a.taintedExports].sort(), null, 2))
    console.log('EXPECTED_PRICING_ROUTES_LITERAL:')
    console.log(JSON.stringify(pricingRoutes, null, 2))
    console.log(`files parsed: ${a.filesParsed} · routes: ${routesExamined}`)
    return
  }

  // ── Anti-vacuity ─────────────────────────────────────────────────────────
  const expectedTainted = expectedFrom('PRICING_GATE_EXPECT_TAINTED', EXPECTED_TAINTED_LITERAL)
  const expectedRoutes = expectedFrom('PRICING_GATE_EXPECT_ROUTES', EXPECTED_PRICING_ROUTES_LITERAL)

  const gotTainted = [...a.taintedExports].sort()
  const diff = (want: string[], got: string[]) => ({
    missing: want.filter(x => !got.includes(x)),
    extra: got.filter(x => !want.includes(x)),
  })

  const td = diff(expectedTainted, gotTainted)
  if (td.missing.length || td.extra.length) {
    problems.push(
      `ANTI-VACUITY: the tainted-symbol inventory moved.\n` +
      (td.missing.length ? `    no longer tainted (analyzer may have stopped propagating): ${td.missing.join(', ')}\n` : '') +
      (td.extra.length ? `    newly tainted: ${td.extra.join(', ')}\n` : '') +
      `    Re-derive with \`npm run validate:pricing-revalidate -- --print-inventory\`,\n` +
      `    READ the diff, then paste it into EXPECTED_TAINTED_LITERAL. A symbol\n` +
      `    LEAVING this list is the failure mode that makes "0 problems" a lie.`,
    )
  }

  const rd = diff(expectedRoutes, pricingRoutes)
  if (rd.missing.length || rd.extra.length) {
    problems.push(
      `ANTI-VACUITY: the set of pricing-reading routes moved.\n` +
      (rd.missing.length ? `    no longer seen as reading pricing: ${rd.missing.join(', ')}\n` : '') +
      (rd.extra.length ? `    newly reading pricing: ${rd.extra.join(', ')}\n` : '') +
      `    Pinned EXACTLY, not as a floor — a floor passes every over-count, and\n` +
      `    over-counting is how the module-reachability version looked healthy at 35 of 38.`,
    )
  }

  if (a.filesParsed < MIN_FILES_PARSED) {
    problems.push(`ANTI-VACUITY: parsed ${a.filesParsed} files, floor is ${MIN_FILES_PARSED}. The walk found almost nothing.`)
  }
  if (routesExamined < MIN_ROUTES_EXAMINED) {
    problems.push(`ANTI-VACUITY: examined ${routesExamined} route files, floor is ${MIN_ROUTES_EXAMINED}.`)
  }
  if (judged !== pricingRoutes.length) {
    problems.push(
      `ANTI-VACUITY: ${pricingRoutes.length} routes read pricing but only ${judged} revalidate ` +
      `comparisons were applied. A skip is sitting between the two.`,
    )
  }

  for (const p of problems) console.error(`✗ ${p}`)

  console.log(
    `pricing-revalidate: ${a.filesParsed} files · ${routesExamined} route files · ` +
    `${a.taintedExports.size} tainted symbols · ${pricingRoutes.length} pricing-reading routes · ` +
    `${judged} judged · ${problems.length} problem(s)`,
  )

  if (problems.length > 0) {
    console.error(`\n${problems.length} problem(s) — see above.`)
    process.exit(1)
  }
  console.log('OK')
}

main()
