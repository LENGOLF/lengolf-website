/**
 * validate:open-graph — guards the metadata-inheritance trap.
 *
 * Next merges page metadata per KEY, not per field: a route segment that
 * declares `openGraph` at all REPLACES the root layout's resolved object
 * rather than extending it (`mergeMetadata`'s `case 'openGraph'` is a
 * wholesale assignment). So a page that declared its own openGraph to get a
 * page-specific image or url dropped the layout's `siteName` — and its `type`
 * too unless it happened to restate it. No build error, no lint error, and
 * `tsc` cannot see it because both fields are optional. Measured live on
 * 2026-08-23: of 30 page-level blocks, all 30 emitted no og:site_name and 13
 * emitted no og:type.
 *
 * SCOPE: `openGraph` ONLY. `twitter` and `icons` share the same per-key
 * replacement mechanism, but guarding them from SOURCE was the wrong layer.
 * Be precise about why, because the first version of this note overstated it.
 * Next resolves `card = card || (images?.length ? 'summary_large_image' :
 * 'summary')`, so `twitter: { title, images }` lands on the layout's exact
 * value and the gate reddened on CORRECT code — that half was a false red.
 * But `twitter: { title }` with no images resolves to `summary`
 * permanently, so THAT half was a true red, and dropping the rule gives up a
 * real check. The `icons` half was a false GREEN: the layout sets TWO fields
 * (`icon` and `apple`) while the rule modelled one per key, so
 * `icons: { icon }` passed while dropping `apple`.
 *
 * Both are now asserted on the RENDERED tag in smoke section D, where the
 * resolver has already run and there is nothing to predict. The TRADE, stated
 * plainly and without the inflation an earlier version of this paragraph
 * carried: the walk yields 47 files under app/, of which 36 reach the audit
 * (measured against THIS token list — the figure was 33 under the previous
 * one, and quoting it forward after widening the filter was its own stale
 * number), and — the part that matters — NO page file
 * declares `twitter` or `icons` today, only the layout. So nothing LIVE was
 * given up; what was given up is coverage of a hypothetical future page-level
 * declaration. Section D fetches 34 URLs, and 13 of the 31 openGraph
 * declarations are unreachable from any of them; 8 of those 13 are under
 * /golf-courses/ (measured), the other 5 being activities, best, cost, hotels
 * and second-hand-club detail. Coverage of the SUPPLIER (the layout, sole
 * source of both keys) is complete; coverage of a future page-level
 * declaration is not. Do not re-add a source-level version without reading
 * Next's resolver first.
 *
 * WHY THE TYPESCRIPT AST, and not string scanning: this file previously used
 * a hand-rolled comment stripper plus brace counting. An adversarial pass
 * with an AST oracle found it had no regex-literal state, so `/a\/*b/` opened
 * a phantom block comment and blanked the rest of the file — silently hiding
 * a real violation — while a quote inside a regex desynced the machine and
 * produced a hard error pointing at a comment. It was measurably corrupting
 * source in THREE files, all under scripts/ — and zero under app/, which is
 * all this gate reads, so the argument for the AST is the future one: a regex
 * literal landing in an app/ file. Brace counting had the same class of
 * bug: a stray `{` inside a string literal made the layout's openGraph block
 * swallow its sibling, so `type`/`siteName` were satisfied by an unrelated
 * object. Comments, strings, regexes and template nesting are all a real
 * parser's job, and `typescript` is already a direct dependency. Every one of
 * those defects is structurally impossible here.
 *
 * Known limit: this still reads SOURCE, so a route that declares no metadata
 * at all is invisible — `app/not-found.tsx` renders its own <html> under a
 * metadata-less `app/layout.tsx` and ships with no og:*, no icons and no
 * <title>. That is a real, pre-existing, auto-noindex'd gap. What is NO
 * longer invisible is metadata assembled by a helper: a `generateMetadata`
 * that returns anything other than an object literal is reported, because
 * the gate cannot see inside it.
 *
 * Smoke section D asserts the rendered artifact — og:type, og:site_name,
 * twitter:card, `<link rel="icon">` and `<link rel="apple-touch-icon">` — on
 * 34 URLs. (This line listed three of the five until a claim audit caught it,
 * in the same commit whose message named that exact omission elsewhere.)
 * THIS gate runs with no server and covers every openGraph declaration in
 * app/; section D does not — see the scope note above for the 13 it misses.
 *
 * SELF-TEST COVERAGE, stated honestly. The printed total is the EXECUTED count
 * with a declared-vs-executed mismatch as a hard failure. Attribution, since
 * an earlier version of this paragraph took credit for it: THIS file already
 * had the executed counter and the mismatch failure before the branch that
 * wrote this docblock — the array-LENGTHS repair landed in its four sibling
 * validators, not here. What this file gained is the `continue` fix below.
 *
 * MIN_SELF_TEST_CASES is a FLOOR (`ran < MIN`), not an equality — unlike
 * EXPECTED_DECLARATIONS, which is two-sided. Adding a case without raising it
 * stays green; the paired `ran !== declared` check catches a broken loop, not
 * an unraised floor. Do not describe it as exact.
 *
 * Two cases used to pass for the WRONG REASON and are now pinned where the
 * covering mechanism cannot fire for them: the null-default guard (drift fires
 * when one side is null, so null-on-BOTH-sides is the discriminating input) and
 * the ternary descent (an undescended node is opaque, which looked identical to
 * a descended one — the discriminating input is two literal branches, which
 * must be GREEN).
 *
 * STILL uncovered by mutation. This list is MEASURED — 13 single-arm mutations
 * here, corroborated by an independent 58-mutation sweep — and an earlier
 * version of it was INCOMPLETE: it named three of the ten. Note what it was
 * not: the correction that replaced it claimed the old text "named two that
 * are in fact PINNED" and had `satisfies`/angle-cast "backwards". That was
 * FABRICATED. The old text named `classify`'s helper-NAME check and
 * `unwrap`'s `await` and `as` arms — all three genuinely uncovered — and
 * never mentioned `satisfies` or the angle cast at all. Inventing a defect in
 * the thing you are correcting is worse than the incompleteness it replaced.
 * Ten mutations went green in BOTH modes:
 *   - `unwrap`: the parens, `as`, non-null and `await` arms. Its `satisfies`
 *     and angle-bracket-cast arms ARE pinned — deleting either turns
 *     --self-test red.
 *   - `isMeaningfulValue`: the `null` check and the numeric check.
 *   - `classify`'s helper-NAME comparison (forcing it true stays green).
 *   - `metadataRoots`' nested-function guard.
 *   - the layout non-object-form report.
 *   - the layout `type` wrong-VALUE compare (`!typeExpr` alone stays green).
 * Plus `main()` itself, which is not a single arm: the walk, the pre-filter,
 * the layout exemption, the inventory and the exit code are exercised only by
 * the real corpus run. A green --self-test is not proof any of those work.
 *
 * The one that moved: `directProp`'s ShorthandPropertyAssignment arm was
 * uncovered when the twitter/icons rule was deleted (its only pin was an icons
 * case that went with it) and is pinned again by an explicit layout-shorthand
 * case. Deleting the arm now turns --self-test red; the corpus alone does not
 * catch it, because no file under app/ writes the field in shorthand.
 *
 * Run: npx tsx scripts/validate-open-graph.ts [--self-test]
 */
import ts from 'typescript'
import { readFileSync, readdirSync } from 'fs'
import { join, sep } from 'path'

const APP_DIR = 'app'
const LAYOUT = 'app/[locale]/layout.tsx'
const HELPER_FILE = 'lib/open-graph.ts'
const HELPER_NAME = 'siteOpenGraph'
const HELPER_MODULE = '@/lib/open-graph'

/**
 * EXACT expected count, deliberately not a floor with slack. An earlier
 * version used a floor of 25 against a true count of 31 and argued the floor
 * would catch a page bypassing the wrap check; 31 − 25 left SIX free
 * bypasses. Verified against an independent `ts` AST count: 31 openGraph
 * property assignments across 30 files, `golf-courses/near/[station]` holding
 * two. On mismatch the failure prints the per-file inventory, because "bump
 * the number" is the right advice only when you added a page.
 */
const EXPECTED_DECLARATIONS = 31

/**
 * Anti-vacuity floor for --self-test: the number of cases that must EXECUTE.
 * A FLOOR (`ran < MIN`), NOT an equality — unlike EXPECTED_DECLARATIONS
 * above, which is two-sided. This comment used to say "the EXACT number ...
 * exactly like EXPECTED_DECLARATIONS", contradicting the docblock sixty lines
 * up; the docblock was right. Consequence worth knowing: adding a case without
 * raising this stays green, so raise it in the same commit that adds one.
 */
const MIN_SELF_TEST_CASES = 75

interface Problem {
  file: string
  line: number
  message: string
}

/** The two site-wide defaults, as written in one of the two places. */
export interface OgDefaults {
  type: string | null
  siteName: string | null
}

/**
 * ScriptKind follows the extension. It matters: in TSX, `<Foo>x` is JSX, not
 * a type assertion, so forcing TSX would misparse an angle-bracket cast in
 * one of the plain `.ts` files the walk covers (app/sitemap.ts, app/robots.ts,
 * app/llms.txt/route.ts). Conversely an angle-bracket cast is ILLEGAL in .tsx,
 * which is why every page file can only use `as` or `satisfies`.
 */
function parse(rel: string, src: string): ts.SourceFile {
  const kind = rel.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  return ts.createSourceFile(rel, src, ts.ScriptTarget.Latest, true, kind)
}

function lineOf(sf: ts.SourceFile, node: ts.Node): number {
  return sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1
}

function propName(p: ts.ObjectLiteralElementLike): string | null {
  if (!p.name) return null
  if (ts.isIdentifier(p.name)) return p.name.text
  if (ts.isStringLiteralLike(p.name)) return p.name.text
  // A computed key holding a string literal IS a string key. `{ ['openGraph']:
  // ... }` was invisible and UNCOUNTED, so the exact-count guard stayed green
  // for a new page — the same free bypass the shorthand arm was fixed for.
  // A computed key this cannot resolve is handled in `metadataRoots`: it could
  // BE openGraph, so the root is reported rather than silently accepted.
  if (ts.isComputedPropertyName(p.name)) {
    const e = unwrap(p.name.expression)
    if (ts.isStringLiteralLike(e)) return e.text
  }
  return null
}

/**
 * Direct (non-nested) property of an object literal, or null.
 *
 * Returns the LAST match, matching JS semantics — a duplicate key means the
 * later one wins at runtime, and taking the first was the same "first match
 * wins" shape that produced a silent wrong read in an earlier version of the
 * helper-default extractor. `{ present: true }` is returned for a shorthand
 * (`{ icon }`), because the field IS supplied even though there is no
 * initializer to inspect.
 */
function directProp(obj: ts.ObjectLiteralExpression, name: string): ts.Expression | null {
  let found: ts.Expression | null = null
  for (const p of obj.properties) {
    if (ts.isPropertyAssignment(p) && propName(p) === name) found = p.initializer
    else if (ts.isShorthandPropertyAssignment(p) && p.name.text === name) found = p.name
  }
  return found
}

/**
 * The first SpreadAssignment appearing AFTER the last direct property named
 * `name`, or null. That ordering is the whole point: a later key wins in JS,
 * so a spread BEFORE the property is harmless and one AFTER it silently
 * replaces the value the gate just verified.
 *
 * The first version of this check asked only "does the object declare the
 * property at all?", justified in a comment reading "an explicit key wins over
 * a spread at runtime". That is true only when the spread comes FIRST, and the
 * comment was written without checking:
 *   { openGraph: siteOpenGraph({...}), ...evil }  ->  evil.openGraph wins
 * so an unwrapped openGraph reached the page — the exact defect this gate
 * exists for — while the success line printed. Measured with node, not
 * reasoned. Passing `name` also covers the layout's own object, where a
 * trailing spread overrode `type`/`siteName` at their sole SUPPLIER.
 */
function spreadAfterLast(
  obj: ts.ObjectLiteralExpression,
  name: string
): ts.SpreadAssignment | null {
  let lastIdx = -1
  obj.properties.forEach((p, i) => {
    if (propName(p) === name) lastIdx = i
  })
  for (let i = lastIdx + 1; i < obj.properties.length; i++) {
    const p = obj.properties[i]
    if (ts.isSpreadAssignment(p)) return p
  }
  return null
}

/**
 * True if the expression can actually carry a rendered value. Rejects the
 * literals that look present and emit nothing: `undefined`, `null`, and a
 * blank or whitespace-only string. An identifier or property access is
 * accepted — a static reader cannot resolve it, and refusing them would fail
 * the real layout, which writes `siteName: SITE_NAME`.
 */
function isMeaningfulValue(e: ts.Expression): boolean {
  const n = unwrap(e)
  if (n.kind === ts.SyntaxKind.NullKeyword) return false
  if (ts.isIdentifier(n) && n.text === 'undefined') return false
  if (ts.isStringLiteralLike(n)) return n.text.trim().length > 0
  if (ts.isNumericLiteral(n)) return false
  return true
}

/**
 * Normalised, comparable rendering of a value expression. A string literal
 * collapses to its TEXT, so `"LENGOLF"` and `'LENGOLF'` compare equal — an
 * earlier version compared raw source and would have gone red on a Prettier
 * quote-style change alone.
 */
function normalise(e: ts.Expression): string {
  let node: ts.Expression = e
  while (ts.isParenthesizedExpression(node) || ts.isAsExpression(node)) node = node.expression
  if (ts.isStringLiteralLike(node)) return `str:${node.text}`
  return `expr:${node.getText().trim()}`
}

/**
 * Unwrap the wrappers that do not change the value: parens, `as X`,
 * `satisfies X`, an angle-bracket cast, a non-null `!`, and `await`.
 *
 * `satisfies` matters most: it is the idiomatic Next spelling
 * (`export const metadata = {...} satisfies Metadata`), and omitting it made
 * the gate report "generateMetadata returns a non-literal expression" on a
 * file with no generateMetadata in it — a hard CI failure on correct code,
 * with a diagnostic pointing at the wrong construct. `as Metadata`, the
 * identical intent, passed. Keep this list ahead of the AST, not behind it.
 */
function unwrap(e: ts.Expression): ts.Expression {
  let node: ts.Expression = e
  for (;;) {
    if (
      ts.isParenthesizedExpression(node) ||
      ts.isAsExpression(node) ||
      ts.isSatisfiesExpression(node) ||
      ts.isTypeAssertionExpression(node) ||
      ts.isNonNullExpression(node) ||
      ts.isAwaitExpression(node)
    ) {
      node = node.expression
    } else return node
  }
}

type ValueForm = 'object' | 'helper' | 'other'

function classify(init: ts.Expression): ValueForm {
  const e = unwrap(init)
  if (ts.isObjectLiteralExpression(e)) return 'object'
  if (
    ts.isCallExpression(e) &&
    ts.isIdentifier(e.expression) &&
    e.expression.text === HELPER_NAME
  ) {
    return 'helper'
  }
  return 'other'
}

/**
 * Metadata roots this gate cannot read: a module-level `metadata` const or a
 * `generateMetadata` that resolves to something other than an object
 * literal. An object-literal root needs no reporting — the openGraph scan
 * below is file-wide and finds its keys directly — so only the opaque ones
 * are returned. The ternary descent matters for the GREEN case: without it,
 * `metadata = cond ? {...} : {...}` would be reported as opaque, a false red
 * on correct code.
 */
function metadataRoots(sf: ts.SourceFile): { opaque: { node: ts.Node; source: string }[] } {
  const opaque: { node: ts.Node; source: string }[] = []

  // `source` names the construct, so the diagnostic cannot say
  // "generateMetadata" about a file that has none.
  const collect = (e: ts.Expression, source: string): void => {
    const n = unwrap(e)
    if (ts.isObjectLiteralExpression(n)) {
      // An object literal is transparent only if every key is VISIBLE. An
      // unconditional `return` here made `return { ...buildMeta('golf') }`
      // invisible: it IS an object literal, so the openGraph could arrive
      // through the spread, unwrapped, with the declaration count unmoved.
      // `return buildMeta('golf')` was reported; adding two dots evaded it.
      //
      // The idiomatic `{ ...base, openGraph: siteOpenGraph({...}) }` is NOT
      // affected: an explicit key wins over a spread at runtime, so once the
      // root declares openGraph itself the normal rule applies and the spread
      // cannot smuggle one in.
      // A spread AFTER the last openGraph key overrides it; one before does
      // not. With no openGraph key at all, lastIdx is -1 and any spread
      // qualifies — which is the spread-only case.
      const overriding = spreadAfterLast(n, 'openGraph')
      if (overriding) {
        opaque.push({ node: overriding, source: `${source} (spread)` })
        return
      }
      // An unresolvable computed key could be openGraph.
      const opaqueKey = n.properties.find(
        (p) => p.name && ts.isComputedPropertyName(p.name) && propName(p) === null
      )
      if (opaqueKey) opaque.push({ node: opaqueKey, source: `${source} (computed key)` })
      return
    } else if (ts.isConditionalExpression(n)) {
      collect(n.whenTrue, source)
      collect(n.whenFalse, source)
    } else opaque.push({ node: n, source })
  }

  // `export { gm as generateMetadata }` means the local `gm` IS the metadata
  // factory. Collect those aliases first so the walk below recognises it.
  const factoryNames = new Set<string>(['generateMetadata'])
  for (const st of sf.statements) {
    if (ts.isExportDeclaration(st) && st.exportClause && ts.isNamedExports(st.exportClause)) {
      for (const el of st.exportClause.elements) {
        if (el.name.text === 'generateMetadata' && el.propertyName) {
          factoryNames.add(el.propertyName.text)
        }
      }
    }
  }

  /** The function bodies reachable from an initializer, including through a
   * wrapper call like `cache(async () => ({...}))`. */
  const bodiesOf = (init: ts.Expression): ts.Node[] => {
    const e = unwrap(init)
    if (ts.isArrowFunction(e) || ts.isFunctionExpression(e)) return [e.body]
    if (ts.isCallExpression(e)) {
      return e.arguments.flatMap((a) => {
        const arg = unwrap(a)
        return ts.isArrowFunction(arg) || ts.isFunctionExpression(arg) ? [arg.body] : []
      })
    }
    return []
  }

  const visit = (node: ts.Node): void => {
    // Module scope only. Any `const metadata` anywhere used to be treated as
    // page metadata, so a local `const metadata = { twitter: 'handle' }` in a
    // component body failed the gate. Scope, not export-ness, is the right
    // discriminator: `export { metadata }` declares the const separately.
    if (ts.isVariableStatement(node) && node.parent && ts.isSourceFile(node.parent)) {
      for (const d of node.declarationList.declarations) {
        if (ts.isIdentifier(d.name) && d.name.text === 'metadata' && d.initializer) {
          collect(d.initializer, 'the module-level `metadata` const')
        }
      }
    }
    const isGenerateMetadata =
      (ts.isFunctionDeclaration(node) && node.name && factoryNames.has(node.name.text)) ||
      (ts.isVariableDeclaration(node) &&
        ts.isIdentifier(node.name) &&
        factoryNames.has(node.name.text))
    if (isGenerateMetadata) {
      // A function EXPRESSION was previously invisible here, while
      // extractHelperDefaults in this same file handled both forms — an
      // internal inconsistency that made a whole metadata factory unaudited.
      const bodies = ts.isFunctionDeclaration(node)
        ? node.body
          ? [node.body]
          : []
        : (node as ts.VariableDeclaration).initializer
          ? bodiesOf((node as ts.VariableDeclaration).initializer!)
          : []
      for (const body of bodies) {
        if (!ts.isBlock(body)) collect(body as ts.Expression, 'generateMetadata')
        else {
          const scan = (n: ts.Node): void => {
            // Do not descend into nested functions: their returns are not
            // generateMetadata's return. (`scan` is seeded with forEachChild
            // on the body, so the body itself is never passed in here — an
            // earlier `&& n !== body.parent` clause was dead code that
            // invited a reader to "repair" it.)
            if (ts.isFunctionLike(n)) return
            if (ts.isReturnStatement(n) && n.expression) collect(n.expression, 'generateMetadata')
            ts.forEachChild(n, scan)
          }
          ts.forEachChild(body, scan)
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  return { opaque }
}

export interface FileAudit {
  declarations: number
  layoutOpenGraphSeen: boolean
  layoutDefaults: OgDefaults | null
  problems: Problem[]
}

export function auditSource(rel: string, src: string): FileAudit {
  const problems: Problem[] = []
  const sf = parse(rel, src)
  const isLayout = rel === LAYOUT
  let layoutOpenGraphSeen = false
  let layoutDefaults: OgDefaults | null = null
  let declarations = 0
  let usesHelper = false

  // --- openGraph: every property assignment anywhere in the file. A
  // PropertyAssignment cannot be a string, a comment or an interface member,
  // so the false positives the old substring scan had are gone by
  // construction. Not root-scoped, because an `openGraph:` key outside
  // metadata would itself be worth reporting.
  // A SHORTHAND (`{ openGraph }`) counts too. It was previously invisible:
  // zero declarations, zero problems, and because it was not counted the
  // exact-count guard stayed green — a free bypass of the primary rule, in
  // the very shape whose longhand sibling (`openGraph: og`) IS rejected.
  const ogNodes: (ts.PropertyAssignment | ts.ShorthandPropertyAssignment)[] = []
  const findOg = (node: ts.Node): void => {
    if (ts.isPropertyAssignment(node) && propName(node) === 'openGraph') ogNodes.push(node)
    else if (ts.isShorthandPropertyAssignment(node) && node.name.text === 'openGraph') {
      ogNodes.push(node)
    }
    ts.forEachChild(node, findOg)
  }
  findOg(sf)

  for (const node of ogNodes) {
    declarations++
    const line = lineOf(sf, node)
    // A shorthand hands over whatever the identifier holds, which this gate
    // cannot follow — classified as 'other' so it is rejected, not skipped.
    const form: ValueForm = ts.isShorthandPropertyAssignment(node)
      ? 'other'
      : classify(node.initializer)

    if (isLayout) {
      if (form !== 'object') {
        problems.push({
          file: rel,
          line,
          message: `root layout openGraph must be a literal object, not ${form}`,
        })
        continue
      }
      // form === 'object' implies a PropertyAssignment, so the narrow is safe.
      const obj = unwrap(
        (node as ts.PropertyAssignment).initializer
      ) as ts.ObjectLiteralExpression
      layoutOpenGraphSeen = true
      const typeExpr = directProp(obj, 'type')
      const siteNameExpr = directProp(obj, 'siteName')
      // Same class as the page-level spread hole, at the SUPPLIER. directProp
      // reads direct properties only, so a trailing spread replaced both
      // site-wide defaults with the gate green.
      const clobbered = spreadAfterLast(obj, 'type') ?? spreadAfterLast(obj, 'siteName')
      if (clobbered) {
        problems.push({
          file: rel,
          line: lineOf(sf, clobbered),
          message:
            'root layout openGraph spreads a value AFTER its own type/siteName, ' +
            'which overrides them at runtime — inline the fields instead',
        })
      }
      // Direct properties only: a stray brace inside a string used to make
      // the block swallow its sibling, so an unrelated object satisfied both.
      if (!typeExpr || normalise(typeExpr) !== 'str:website') {
        problems.push({
          file: rel,
          line,
          message: "root layout openGraph must set type: 'website' as a direct property",
        })
      }
      // Reject the values that LOOK present and emit nothing. Testing only
      // for an empty string literal let `siteName: undefined`, `null`, `0`
      // and `'   '` all pass — and `siteName: undefined` emits no
      // og:site_name at all, which is the precise defect this gate exists for.
      if (!siteNameExpr || !isMeaningfulValue(siteNameExpr)) {
        problems.push({
          file: rel,
          line,
          message: 'root layout openGraph must set a non-empty siteName as a direct property',
        })
      }
      layoutDefaults = {
        type: typeExpr ? normalise(typeExpr) : null,
        siteName: siteNameExpr ? normalise(siteNameExpr) : null,
      }
      continue
    }

    if (form === 'helper') {
      usesHelper = true
      continue
    }
    problems.push({
      file: rel,
      line,
      message:
        form === 'object'
          ? `page-level openGraph must be wrapped in ${HELPER_NAME}({ ... }) from ` +
            `${HELPER_MODULE} — a bare object REPLACES the layout object and drops ` +
            `og:site_name (and og:type unless restated)`
          : `page-level openGraph must be a literal ${HELPER_NAME}({ ... }) call — this ` +
            `gate cannot verify a variable, builder call or other expression, so the ` +
            `form is rejected rather than skipped`,
    })
  }

  // --- the helper must actually be the shared one, not a local shadow.
  if (usesHelper) {
    let imported = false
    for (const st of sf.statements) {
      if (
        ts.isImportDeclaration(st) &&
        ts.isStringLiteralLike(st.moduleSpecifier) &&
        // Accept the alias or an equivalent relative path — rejecting
        // `../../lib/open-graph` was a false failure on a legitimate style.
        (st.moduleSpecifier.text === HELPER_MODULE ||
          st.moduleSpecifier.text.replace(/^[./]+/, '') === HELPER_MODULE.replace(/^@\//, '')) &&
        st.importClause?.namedBindings &&
        ts.isNamedImports(st.importClause.namedBindings) &&
        // The EXPORTED name is what matters. Reading only the local name let
        // `import { notTheHelper as siteOpenGraph }` satisfy the check.
        st.importClause.namedBindings.elements.some(
          // BOTH names must be the helper. The EXPORTED one, so
          // `notTheHelper as siteOpenGraph` cannot satisfy it — and the LOCAL
          // binding, so `siteOpenGraph as _real` sitting beside a local
          // `const siteOpenGraph = (o) => o` cannot either. That shape passed
          // while the success line asserted every block "routes through
          // siteOpenGraph() imported from @/lib/open-graph": the import
          // existed, and nothing tied it to the call site.
          (el) =>
            (el.propertyName ?? el.name).text === HELPER_NAME && el.name.text === HELPER_NAME
        )
      ) {
        imported = true
      }
    }
    if (!imported) {
      problems.push({
        file: rel,
        line: 1,
        message:
          `calls ${HELPER_NAME}() but does not import it from ${HELPER_MODULE} — a local ` +
          `wrapper of the same name silently disables the site-wide defaults`,
      })
    }
  }

  // A metadata root whose value this gate cannot read. Names the construct it
  // actually found: the message used to say "generateMetadata returns a
  // non-literal" on files containing no generateMetadata, which is the
  // wrong-noun diagnostic this file has now produced twice.
  const { opaque } = metadataRoots(sf)
  for (const { node, source } of opaque) {
    problems.push({
      file: rel,
      line: lineOf(sf, node),
      message:
        `${source} resolves to a non-literal expression, so this gate cannot verify its ` +
        `openGraph. Return or assign an object literal, or extend this validator.`,
    })
  }

  return {
    declarations,
    layoutOpenGraphSeen,
    layoutDefaults,
    problems,
  }
}

/**
 * Read the two defaults out of the helper — SCOPED to the body of the
 * `siteOpenGraph` declaration. An earlier regex version scanned the whole
 * file and took the first match, so an unrelated `?? 'website'` above the
 * real function made it read the wrong value and pass, defeating the exact
 * mutation it exists to catch.
 */
export function extractHelperDefaults(src: string): OgDefaults & { error: string | null } {
  const sf = parse(HELPER_FILE, src)
  const bodies: ts.Node[] = []
  const visit = (node: ts.Node): void => {
    if (ts.isFunctionDeclaration(node) && node.name?.text === HELPER_NAME && node.body) {
      bodies.push(node.body)
    }
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === HELPER_NAME &&
      node.initializer &&
      (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))
    ) {
      bodies.push(node.initializer.body)
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)

  if (bodies.length !== 1) {
    return {
      type: null,
      siteName: null,
      error: `expected exactly one ${HELPER_NAME} declaration in ${HELPER_FILE}, found ${bodies.length}`,
    }
  }

  const returned: ts.ObjectLiteralExpression[] = []
  const body = bodies[0]
  if (!ts.isBlock(body)) {
    const e = unwrap(body as ts.Expression)
    if (ts.isObjectLiteralExpression(e)) returned.push(e)
  } else {
    const scan = (n: ts.Node): void => {
      if (ts.isReturnStatement(n) && n.expression) {
        const e = unwrap(n.expression)
        if (ts.isObjectLiteralExpression(e)) returned.push(e)
      }
      ts.forEachChild(n, scan)
    }
    ts.forEachChild(body, scan)
  }
  if (returned.length !== 1) {
    return {
      type: null,
      siteName: null,
      error: `expected ${HELPER_NAME} to return exactly one object literal, found ${returned.length}`,
    }
  }

  // Each default is `<expr> ?? <fallback>`; the fallback is the default.
  const read = (name: string): string | null => {
    const init = directProp(returned[0], name)
    if (!init) return null
    const e = unwrap(init)
    if (
      ts.isBinaryExpression(e) &&
      e.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken
    ) {
      return normalise(e.right)
    }
    return null
  }
  return { type: read('type'), siteName: read('siteName'), error: null }
}

/** Corpus-level checks: the two a per-file pass structurally cannot see. */
export function auditAggregate(totals: {
  declarations: number
  layoutOpenGraphSeen: boolean
  layoutDefaults?: OgDefaults | null
  helperDefaults?: (OgDefaults & { error?: string | null }) | null
  inventory?: Record<string, number>
}): string[] {
  const errors: string[] = []
  const { layoutDefaults: lay, helperDefaults: help } = totals

  if (help?.error) {
    errors.push(
      `${help.error}. The layout/helper default comparison could not run, which is a ` +
        `failure, not a pass — update extractHelperDefaults to match the current shape.`
    )
  } else if (lay && help) {
    for (const key of ['type', 'siteName'] as const) {
      if (lay[key] === null || help[key] === null) {
        errors.push(
          `could not read \`${key}\` from ${lay[key] === null ? LAYOUT : HELPER_FILE}, so the ` +
            `layout/helper default comparison could not run. That is a failure, not a pass.`
        )
      } else if (lay[key] !== help[key]) {
        errors.push(
          `openGraph default \`${key}\` disagrees: ${LAYOUT} says ${lay[key]}, ` +
            `${HELPER_FILE} says ${help[key]}. Pages that declare openGraph take the ` +
            `helper's value and the pages that omit it take the layout's, so the site ` +
            `would emit both.`
        )
      }
    }
  }

  if (!totals.layoutOpenGraphSeen) {
    errors.push(
      `${LAYOUT} declares no openGraph object. It is the base that every page omitting ` +
        `openGraph inherits, so deleting it strips og:type/og:site_name/og:url/og:image ` +
        `from all of them — and a per-file scan cannot see an absent key.`
    )
  }

  if (totals.declarations !== EXPECTED_DECLARATIONS) {
    const inv = totals.inventory
      ? '\n  current inventory:\n' +
        Object.entries(totals.inventory)
          .sort()
          .map(([f, c]) => `    ${c}  ${f}`)
          .join('\n')
      : ''
    errors.push(
      `found ${totals.declarations} openGraph declaration(s), expected exactly ` +
        `${EXPECTED_DECLARATIONS}. If you ADDED or REMOVED a page that declares openGraph, ` +
        `update EXPECTED_DECLARATIONS in this file in the same commit. If you did not, the ` +
        `count moved for another reason — a page moved to a metadata builder, or an ` +
        `openGraph assignment changed form — and bumping the number would hide it.${inv}`
    )
  }
  return errors
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) walk(p, out)
    else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) out.push(p)
  }
  return out
}

function selfTest(): void {
  const P = 'app/[locale]/x/page.tsx'
  const IMPORT = `import { ${HELPER_NAME} } from '${HELPER_MODULE}'\n`
  const meta = (body: string) => `export const metadata = ${body}\n`

  const cases: {
    name: string
    rel: string
    src: string
    problems: boolean
    declarations: number
  }[] = [
    // --- page-level openGraph value forms ---
    { name: 'bare object is a violation', rel: P, src: meta('{ openGraph: { images: [1] } }'), problems: true, declarations: 1 },
    { name: 'wrapped object passes', rel: P, src: IMPORT + meta(`{ openGraph: ${HELPER_NAME}({ images: [1] }) }`), problems: false, declarations: 1 },
    { name: 'wrapped multi-line keeps its own type', rel: P, src: IMPORT + meta(`{\n  openGraph: ${HELPER_NAME}({\n    type: 'article',\n  }),\n}`), problems: false, declarations: 1 },
    { name: 'hoisted variable is REJECTED', rel: P, src: `const og = { images: [1] }\n` + meta('{ openGraph: og }'), problems: true, declarations: 1 },
    { name: 'builder call is REJECTED', rel: P, src: meta('{ openGraph: buildOg(slug) }'), problems: true, declarations: 1 },
    { name: 'ternary mentioning the helper is REJECTED', rel: P, src: IMPORT + meta(`{ openGraph: f ? ${HELPER_NAME}({}) : { images: [1] } }`), problems: true, declarations: 1 },
    { name: 'a LOCAL helper of the same name is REJECTED', rel: P, src: `const ${HELPER_NAME} = (o) => o\n` + meta(`{ openGraph: ${HELPER_NAME}({ images: [1] }) }`), problems: true, declarations: 1 },

    // --- the parser class the old string scanner got wrong ---
    { name: 'a // mention is not a declaration', rel: P, src: '// a segment that omits openGraph: keeps the layout object\n', problems: false, declarations: 0 },
    { name: 'a block-comment mention is not a declaration', rel: P, src: '/*\n openGraph: { images: [1] },\n*/\n', problems: false, declarations: 0 },
    { name: 'a REGEX containing a comment opener does not hide a violation', rel: P, src: 'const re = /a\\/*b/\n' + meta('{ openGraph: { images: [1] } }'), problems: true, declarations: 1 },
    { name: 'a QUOTE inside a regex does not desync into a false positive', rel: P, src: 'const esc = (t) => t.replace(/"/g, "&quot;")\n// openGraph: { images: [1] },\n' + meta('{ title: "x" }'), problems: false, declarations: 0 },
    { name: 'openGraph inside a STRING is not a declaration', rel: P, src: 'const s = "openGraph: {"\n', problems: false, declarations: 0 },
    { name: 'openGraph as an INTERFACE member is not a declaration', rel: P, src: 'interface I { openGraph: OpenGraph }\n', problems: false, declarations: 0 },
    { name: 'a stray brace in a string does not break block scoping', rel: 'app/[locale]/layout.tsx', src: meta("{\n  openGraph: { type: 'website', siteName: SITE_NAME, images: [{ alt: 'a { b' }] },\n  other: { type: 'website', siteName: 'X' },\n}"), problems: false, declarations: 1 },

    // --- layout rules ---
    { name: 'layout missing type is a violation', rel: LAYOUT, src: meta('{ openGraph: { siteName: SITE_NAME } }'), problems: true, declarations: 1 },
    { name: 'layout missing siteName is a violation', rel: LAYOUT, src: meta("{ openGraph: { type: 'website' } }"), problems: true, declarations: 1 },
    { name: 'layout with an EMPTY siteName is a violation', rel: LAYOUT, src: meta("{ openGraph: { type: 'website', siteName: '' } }"), problems: true, declarations: 1 },
    { name: 'layout fields in a SIBLING object do not satisfy', rel: LAYOUT, src: meta("{ other: { type: 'website', siteName: 'x' }, openGraph: { images: [] } }"), problems: true, declarations: 1 },
    // Pins directProp's ShorthandPropertyAssignment arm. Deleting that arm
    // used to be caught by an icons case; removing the twitter/icons rule left
    // it unpinned AND unexercised by the corpus (no app/ file writes siteName
    // in shorthand). Verified: deleting the arm turns this case RED.
    { name: 'layout siteName as a SHORTHAND satisfies the field', rel: LAYOUT, src: meta("{ openGraph: { type: 'website', siteName } }"), problems: false, declarations: 1 },
    { name: 'layout with DOUBLE-quoted website passes', rel: LAYOUT, src: meta('{ openGraph: { type: "website", siteName: SITE_NAME } }'), problems: false, declarations: 1 },
    { name: 'layout NESTED type does not satisfy', rel: LAYOUT, src: meta("{ openGraph: { images: [{ type: 'website' }], siteName: SITE_NAME } }"), problems: true, declarations: 1 },


    // --- structural bypass ---
    { name: 'generateMetadata returning a builder call is REPORTED', rel: P, src: 'export function generateMetadata() {\n  return pageMetadata("golf")\n}\n', problems: true, declarations: 0 },
    { name: 'generateMetadata returning an object literal is fine', rel: P, src: IMPORT + `export function generateMetadata() {\n  return { openGraph: ${HELPER_NAME}({ images: [1] }) }\n}\n`, problems: false, declarations: 1 },

    // --- AST surface a prior version did not enumerate ---
    { name: 'satisfies Metadata is NOT a false failure', rel: P, src: IMPORT + meta(`{ openGraph: ${HELPER_NAME}({ images: [1] }), twitter: { card: 'x' } } satisfies Metadata`), problems: false, declarations: 1 },
    // Angle-bracket casts are illegal in .tsx (there `<Foo>` is JSX), so this
    // case uses a plain .ts path — which is also what proves parse() picks
    // ScriptKind by extension rather than forcing TSX everywhere.
    { name: 'an angle-bracket cast in a .ts file is NOT a false failure', rel: 'app/sitemap.ts', src: IMPORT + meta(`<Metadata>{ openGraph: ${HELPER_NAME}({ images: [1] }) }`), problems: false, declarations: 1 },
    { name: 'SHORTHAND openGraph is counted AND rejected', rel: P, src: 'const openGraph = { images: [1] }\n' + meta("{ title: 'x', openGraph }"), problems: true, declarations: 1 },
    // These three assert that the FORM is reached at all. The observable is an
    // opaque (non-literal) return, since the tripwire that used to provide one
    // is gone.
    { name: 'generateMetadata as a function EXPRESSION is audited', rel: P, src: "export const generateMetadata = async function () {\n  return buildIt()\n}\n", problems: true, declarations: 0 },
    { name: 'generateMetadata behind a wrapper call is audited', rel: P, src: "export const generateMetadata = cache(async () => buildIt())\n", problems: true, declarations: 0 },
    { name: 'generateMetadata via an aliased export is audited', rel: P, src: "async function gm() {\n  return buildIt()\n}\nexport { gm as generateMetadata }\n", problems: true, declarations: 0 },
    // Module scope, not export-ness, is the discriminator. A function-local
    // `const metadata` is not a root, so its opaque value is not reported.
    { name: 'a LOCAL const metadata is not a metadata root', rel: P, src: "function Component() {\n  const metadata = buildIt()\n  return metadata\n}\n", problems: false, declarations: 0 },
    { name: 'layout siteName: undefined is a violation', rel: LAYOUT, src: meta("{ openGraph: { type: 'website', siteName: undefined } }"), problems: true, declarations: 1 },
    { name: 'layout siteName: whitespace is a violation', rel: LAYOUT, src: meta("{ openGraph: { type: 'website', siteName: '   ' } }"), problems: true, declarations: 1 },
    { name: 'a DUPLICATE key takes the LAST value, as JS does', rel: LAYOUT, src: meta("{ openGraph: { type: 'website', siteName: SITE_NAME, siteName: undefined } }"), problems: true, declarations: 1 },
    { name: 'an ALIASED import of another symbol does not satisfy', rel: P, src: `import { notTheHelper as ${HELPER_NAME} } from '${HELPER_MODULE}'\n` + meta(`{ openGraph: ${HELPER_NAME}({ images: [1] }) }`), problems: true, declarations: 1 },
    { name: 'a RELATIVE import of the helper is accepted', rel: P, src: `import { ${HELPER_NAME} } from '../../lib/open-graph'\n` + meta(`{ openGraph: ${HELPER_NAME}({ images: [1] }) }`), problems: false, declarations: 1 },
    // Pins two arms nothing else exercised: the ternary descent in
    // metadataRoots (only ONE branch is missing `card`), and propName's
    // string-literal key arm.
    // Descent is load-bearing in the GREEN direction now: without it the whole
    // ConditionalExpression is opaque and this reds on correct code.
    // --- pins for the four holes an adversarial pass opened up ---
    { name: 'a SPREAD-only metadata root is reported', rel: P, src: meta("{ ...buildMeta('golf') }"), problems: true, declarations: 0 },
    { name: 'a spread AFTER the openGraph key is reported (it wins at runtime)', rel: P, src: IMPORT + meta(`{ openGraph: ${HELPER_NAME}({ images: [1] }), ...evil }`), problems: true, declarations: 1 },
    { name: 'a layout spread AFTER its own fields is reported', rel: LAYOUT, src: meta("{ openGraph: { type: 'website', siteName: SITE_NAME, ...override } }"), problems: true, declarations: 1 },
    { name: 'a spread BESIDE an explicit openGraph is NOT a false failure', rel: P, src: IMPORT + meta(`{ ...base, openGraph: ${HELPER_NAME}({ images: [1] }) }`), problems: false, declarations: 1 },
    { name: 'a COMPUTED string openGraph key is counted AND rejected', rel: P, src: meta("{ ['openGraph']: { images: [1] } }"), problems: true, declarations: 1 },
    { name: 'an UNRESOLVABLE computed key is reported', rel: P, src: 'const K = "openGraph"\n' + meta('{ [K]: { images: [1] } }'), problems: true, declarations: 0 },
    { name: 'an ALIASED import beside a local shadow is REJECTED', rel: P, src: `import { ${HELPER_NAME} as _real } from '${HELPER_MODULE}'\nconst ${HELPER_NAME} = (o) => o\n` + meta(`{ openGraph: ${HELPER_NAME}({ images: [1] }) }`), problems: true, declarations: 1 },
    // --- pins for mutations that survived a 58-mutation sweep. The first TWO
    // carry the IMPORT deliberately: without it the missing-import check fires
    // and covers for the rule under test, which is why the existing siblings
    // at 'builder call is REJECTED' and 'SHORTHAND ... rejected' left those
    // two free. Same trap as the null-on-both-sides aggregate cases below.
    // The rest do not need it and do not have it — a LAYOUT case takes the
    // isLayout branch and never sets usesHelper, and openGraphFoo declares
    // nothing. An earlier version of this comment said "each carries the
    // IMPORT", which was true of two of eight.
    { name: 'a shorthand is rejected even WITH the helper imported', rel: P, src: IMPORT + 'const openGraph = { images: [1] }\n' + meta('{ openGraph }'), problems: true, declarations: 1 },
    { name: 'ANOTHER builder is rejected even WITH the helper imported', rel: P, src: IMPORT + meta('{ openGraph: someOtherBuilder({ images: [1] }) }'), problems: true, declarations: 1 },
    { name: 'layout with the WRONG og type is a violation', rel: LAYOUT, src: meta("{ openGraph: { type: 'article', siteName: SITE_NAME } }"), problems: true, declarations: 1 },
    { name: 'layout openGraph as a NON-object is a violation', rel: LAYOUT, src: meta('{ openGraph: buildOg() }'), problems: true, declarations: 1 },
    { name: 'layout siteName: null is a violation', rel: LAYOUT, src: meta("{ openGraph: { type: 'website', siteName: null } }"), problems: true, declarations: 1 },
    { name: 'layout siteName: 0 is a violation', rel: LAYOUT, src: meta("{ openGraph: { type: 'website', siteName: 0 } }"), problems: true, declarations: 1 },
    { name: 'openGraphFoo is NOT an openGraph declaration', rel: P, src: meta('{ openGraphFoo: { images: [1] } }'), problems: false, declarations: 0 },
    { name: 'a ternary of two literals is NOT opaque', rel: P, src: meta("cond ? { title: 'a' } : { title: 'b' }"), problems: false, declarations: 0 },
    { name: 'a STRING-literal openGraph key is counted', rel: P, src: meta("{ 'openGraph': { images: [1] } }"), problems: true, declarations: 1 },
    // The POSITIVE ternary case above cannot pin the descent by itself: with
    // metadataRoots' ConditionalExpression arm deleted the node becomes opaque,
    // which also yields problems=true/declarations=0, so it printed ok while the
    // rule it names was gone (measured). This negative twin discriminates --
    // both branches are complete, so it passes only if the descent really ran;
    // without the descent the node is opaque and this goes red.
    { name: 'a ternary with ONE opaque branch IS reported', rel: P, src: meta("cond ? { title: 'a' } : buildIt()"), problems: true, declarations: 0 },
  ]

  // Message text matters: a prior version reported "generateMetadata returns
  // a non-literal" on a file with no generateMetadata, and no case noticed
  // because none asserted the wording.
  const messageCases: { name: string; rel: string; src: string; expect: string }[] = [
    // The wrong-noun guard. This diagnostic has twice said
    // "generateMetadata" about a file containing none.
    {
      name: 'an opaque metadata const names the CONST, not generateMetadata',
      rel: P,
      src: meta("buildMetadata('golf')"),
      expect: 'the module-level `metadata` const',
    },
    {
      name: 'an opaque generateMetadata names generateMetadata',
      rel: P,
      src: 'export function generateMetadata() {\n  return buildIt()\n}\n',
      expect: 'generateMetadata resolves',
    },
    {
      name: 'a bare page object names the helper',
      rel: P,
      src: meta('{ openGraph: { images: [1] } }'),
      expect: `wrapped in ${HELPER_NAME}(`,
    },
  ]

  let failures = 0
  // Counts cases actually EXECUTED. The printed total used to be
  // `cases.length + ...`, a literal derived from array LENGTHS -- so a `break`
  // in any loop ran ZERO cases and still printed the full count and exited 0
  // (measured). CI reads only the exit code, so nothing noticed.
  let ran = 0
  for (const c of cases) {
    // ran++ sits after the EVALUATION but before the assertions, which is a
    // narrower guarantee than the sibling validators' "after the comparison":
    // this loop `continue`s on a real failure, and `ran !== declared` is
    // checked before `failures > 0`, so counting later would misreport an
    // ordinary failing case as HARNESS BROKEN. A `continue` placed BELOW this
    // line still skips assertions silently — inherent to counting, and the
    // reason --self-test is not evidence that a check still checks anything.
    const r = auditSource(c.rel, c.src)
    ran++
    if (r.declarations !== c.declarations) {
      console.error(`  FAIL ${c.name}: expected ${c.declarations} declaration(s), parsed ${r.declarations}`)
      failures++
      continue
    }
    if (r.problems.length > 0 !== c.problems) {
      console.error(
        `  FAIL ${c.name}: expected problem=${c.problems}, got ${r.problems.length > 0}` +
          (r.problems.length ? ` (${r.problems[0].message.slice(0, 70)})` : '')
      )
      failures++
      continue
    }
    console.log(`  ok   ${c.name}`)
  }

  for (const c of messageCases) {
    const r = auditSource(c.rel, c.src)
    const hit = r.problems.some((p) => p.message.includes(c.expect))
    ran++
    if (!hit) {
      console.error(
        `  FAIL [message] ${c.name}: no problem containing "${c.expect}"` +
          (r.problems.length ? ` (got "${r.problems[0].message.slice(0, 70)}")` : ' (no problems)')
      )
      failures++
    } else console.log(`  ok   [message] ${c.name}`)
  }

  // --- helper-default extraction ---
  const helperCases: { name: string; src: string; want: OgDefaults & { error: string | null } }[] = [
    {
      name: 'reads the real fallbacks',
      src: `export function ${HELPER_NAME}(og) {\n  return { ...og, type: own.type ?? 'website', siteName: own.siteName ?? SITE_NAME }\n}\n`,
      want: { type: 'str:website', siteName: 'expr:SITE_NAME', error: null },
    },
    {
      name: 'a DECOY fallback above the helper is ignored',
      src:
        `export function ogImageMeta(o) {\n  return { type: o.type ?? 'website' }\n}\n` +
        `export function ${HELPER_NAME}(og) {\n  return { ...og, type: own.type ?? 'article', siteName: own.siteName ?? SITE_NAME }\n}\n`,
      want: { type: 'str:article', siteName: 'expr:SITE_NAME', error: null },
    },
    {
      name: 'as-const fallback still read',
      src: `export function ${HELPER_NAME}(og) {\n  return { ...og, type: own.type ?? ('website' as const), siteName: own.siteName ?? SITE_NAME }\n}\n`,
      want: { type: 'str:website', siteName: 'expr:SITE_NAME', error: null },
    },
    {
      name: 'two helper declarations is an error',
      src: `export function ${HELPER_NAME}(a) { return { type: a ?? 'website' } }\nexport function ${HELPER_NAME}(b) { return { type: b ?? 'website' } }\n`,
      want: { type: null, siteName: null, error: `expected exactly one ${HELPER_NAME} declaration in ${HELPER_FILE}, found 2` },
    },
    // These two pin `returned.length !== 1`, which nothing exercised. Both
    // shapes are legitimate code, and without the guard `returned[0]` is
    // undefined and directProp throws.
    {
      name: 'returning via an intermediate const is a loud error',
      src: `export function ${HELPER_NAME}(og) {\n  const out = { ...og, type: 'website' }\n  return out\n}\n`,
      want: { type: null, siteName: null, error: `expected ${HELPER_NAME} to return exactly one object literal, found 0` },
    },
    {
      // Pins the `??` requirement. Without it the read returns the normalised
      // EXPRESSION for a non-`??` value, so `type: own.type` would report
      // 'expr:own.type' as the site-wide default and the drift comparison
      // against the layout would fire with a nonsense message instead of the
      // honest "unreadable" null.
      name: 'a default with NO ?? fallback reads as null, not as the expression',
      src: `export function ${HELPER_NAME}(og) {\n  return { ...og, type: own.type, siteName: own.siteName ?? SITE_NAME }\n}\n`,
      want: { type: null, siteName: 'expr:SITE_NAME', error: null },
    },
    {
      name: 'an early-return guard is a loud error',
      src: `export function ${HELPER_NAME}(og) {\n  if (!og) return { type: 'website' }\n  return { ...og, type: og.type ?? 'website' }\n}\n`,
      want: { type: null, siteName: null, error: `expected ${HELPER_NAME} to return exactly one object literal, found 2` },
    },
  ]
  for (const c of helperCases) {
    const got = extractHelperDefaults(c.src)
    ran++
    const ok =
      got.type === c.want.type &&
      got.siteName === c.want.siteName &&
      (c.want.error === null ? got.error === null : got.error === c.want.error)
    if (!ok) {
      console.error(`  FAIL [helper] ${c.name}: got ${JSON.stringify(got)}`)
      failures++
    } else console.log(`  ok   [helper] ${c.name}`)
  }

  // --- corpus-level rules ---
  const agreed: OgDefaults = { type: 'str:website', siteName: 'expr:SITE_NAME' }
  const base = {
    declarations: EXPECTED_DECLARATIONS,
    layoutOpenGraphSeen: true,
  }
  const aggregates: { name: string; input: Parameters<typeof auditAggregate>[0]; errors: boolean }[] = [
    { name: 'healthy corpus passes', input: { ...base }, errors: false },
    { name: 'layout openGraph absent is an error', input: { ...base, layoutOpenGraphSeen: false }, errors: true },
    { name: 'one declaration lost is an error', input: { ...base, declarations: EXPECTED_DECLARATIONS - 1 }, errors: true },
    { name: 'one declaration gained is an error', input: { ...base, declarations: EXPECTED_DECLARATIONS + 1 }, errors: true },
    { name: 'starved walk is an error', input: { declarations: 0, layoutOpenGraphSeen: false }, errors: true },
    { name: 'agreeing defaults pass', input: { ...base, layoutDefaults: agreed, helperDefaults: { ...agreed, error: null } }, errors: false },
    { name: 'type drift is an error', input: { ...base, layoutDefaults: agreed, helperDefaults: { type: 'str:article', siteName: 'expr:SITE_NAME', error: null } }, errors: true },
    { name: 'siteName drift is an error', input: { ...base, layoutDefaults: agreed, helperDefaults: { type: 'str:website', siteName: 'str:LENGOLF Bangkok', error: null } }, errors: true },
    { name: 'quote-style difference is NOT drift', input: { ...base, layoutDefaults: { type: 'str:website', siteName: 'str:LENGOLF' }, helperDefaults: { type: 'str:website', siteName: 'str:LENGOLF', error: null } }, errors: false },
    { name: 'an unreadable default is an error, not a pass', input: { ...base, layoutDefaults: agreed, helperDefaults: { type: null, siteName: 'expr:SITE_NAME', error: null } }, errors: true },
    { name: 'a helper extraction error is an error', input: { ...base, layoutDefaults: agreed, helperDefaults: { type: null, siteName: null, error: 'boom' } }, errors: true },
    // The two above passed for the WRONG REASON: with one side null the DRIFT
    // comparison fires (null !== 'str:website'), so deleting the null-guard
    // and the error-propagation left them green. These pin each rule where
    // drift cannot cover for it — null on BOTH sides compares equal, and an
    // error alongside agreeing defaults leaves drift silent.
    { name: 'null on BOTH sides is still an error (drift cannot fire)', input: { ...base, layoutDefaults: { type: null, siteName: null }, helperDefaults: { type: null, siteName: null, error: null } }, errors: true },
    { name: 'an extraction error with AGREEING defaults is still an error', input: { ...base, layoutDefaults: agreed, helperDefaults: { ...agreed, error: 'boom' } }, errors: true },
  ]
  for (const c of aggregates) {
    const got = auditAggregate(c.input).length > 0
    ran++
    if (got !== c.errors) {
      console.error(`  FAIL [aggregate] ${c.name}: expected errors=${c.errors}, got ${got}`)
      failures++
    } else console.log(`  ok   [aggregate] ${c.name}`)
  }

  const declared = cases.length + messageCases.length + helperCases.length + aggregates.length
  const total = ran
  if (ran !== declared) {
    console.error(`
self-test HARNESS BROKEN: ${declared} case(s) declared but ${ran} executed`)
    process.exit(1)
  }
  // A real number, not `> 0`, per the anti-vacuity rule in CLAUDE.md. Deleting
  // cases must go red -- this file went 29 -> 45 -> 75 while silently dropping
  // four, which a floor would have caught.
  if (ran < MIN_SELF_TEST_CASES) {
    console.error(`
self-test SHRANK: ${ran} case(s) ran, expected at least ${MIN_SELF_TEST_CASES}`)
    process.exit(1)
  }
  if (failures > 0) {
    console.error(`\nself-test FAILED: ${failures} of ${total} case(s)`)
    process.exit(1)
  }
  console.log(`\nself-test passed: ${total} cases`)
}

function main(): void {
  if (process.argv.includes('--self-test')) {
    console.log('validate:open-graph --self-test')
    selfTest()
    return
  }

  const problems: Problem[] = []
  const inventory: Record<string, number> = {}
  let declarations = 0
  let layoutOpenGraphSeen = false
  let layoutDefaults: OgDefaults | null = null
  const helperDefaults = extractHelperDefaults(readFileSync(HELPER_FILE, 'utf8'))

  for (const file of walk(APP_DIR)) {
    const rel = file.split(sep).join('/')
    const src = readFileSync(file, 'utf8')
    // The layout is read unconditionally: its openGraph going MISSING is the
    // one defect a token pre-filter cannot see.
    if (
      rel !== LAYOUT &&
      // BOTH metadata tokens are needed, and neither subsumes the other:
      // `'generateMetadata'.includes('metadata')` is FALSE — capital M. The
      // lowercase token is what the opaque-root rule needs, because
      // `export const metadata = buildMeta('x')` carries no `openGraph` token at
      // all, so the file that rule exists for never reached it while the very
      // same source passed to auditSource directly WAS reported. The first
      // attempt at this fix dropped `generateMetadata` on the strength of that
      // false subsumption and silently re-opened the hole for every
      // generateMetadata file — measured, not reasoned: the spread exploit went
      // back to exit 0. `twitter`/`icons` went with the rule that read them.
      !src.includes('openGraph') &&
      !src.includes('metadata') &&
      !src.includes('generateMetadata')
    ) {
      continue
    }
    const res = auditSource(rel, src)
    if (res.declarations > 0) inventory[rel] = res.declarations
    if (res.layoutOpenGraphSeen) layoutOpenGraphSeen = true
    if (res.layoutDefaults) layoutDefaults = res.layoutDefaults
    declarations += res.declarations
    problems.push(...res.problems)
  }

  for (const p of problems) console.error(`ERROR ${p.file}:${p.line}  ${p.message}`)
  const aggregateErrors = auditAggregate({
    declarations,
    layoutOpenGraphSeen,
    layoutDefaults,
    helperDefaults,
    inventory,
  })
  for (const e of aggregateErrors) console.error(`ERROR ${e}`)

  const failed = problems.length + aggregateErrors.length
  if (failed > 0) {
    console.error(`\nvalidate:open-graph FAILED: ${failed} problem(s)`)
    process.exit(1)
  }

  console.log(
    `validate:open-graph OK — ${declarations} openGraph declaration(s) across ` +
      `${Object.keys(inventory).length} file(s); every page-level block routes through ` +
      `${HELPER_NAME}() imported from ${HELPER_MODULE}, and the layout and helper ` +
      `defaults agree.`
  )
}

// Guarded: importing this module for a unit test used to run the whole scan
// and, on a failing corpus, process.exit(1) killed the importer before its
// first statement.
if (require.main === module) main()
