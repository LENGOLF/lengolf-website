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
 * `openGraph` is not the only key with that shape. The layout also sets
 * `twitter` (whose object holds only `card`, and X silently degrades a
 * missing card to a small preview) and `icons`. Both are guarded here, in
 * BOTH directions: a page must restate the field, and the layout must supply
 * it. `robots` is deliberately not guarded — the two second-hand-club pages
 * legitimately declare it and the layout's object holds only index/follow, so
 * nothing drops.
 *
 * WHY THE TYPESCRIPT AST, and not string scanning: this file previously used
 * a hand-rolled comment stripper plus brace counting. An adversarial pass
 * with an AST oracle found it had no regex-literal state, so `/a\/*b/` opened
 * a phantom block comment and blanked the rest of the file — silently hiding
 * a real violation — while a quote inside a regex desynced the machine and
 * produced a hard error pointing at a comment. It was measurably corrupting
 * source in four files under scripts/. Brace counting had the same class of
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
 * Smoke section D asserts the rendered artifact on 33 URLs. This runs with no
 * server and covers every declaration in app/.
 *
 * SELF-TEST COVERAGE, stated honestly. A mutation pass (delete one rule, re-run
 * --self-test) found eight rules that could be removed while every case stayed
 * green, including two whose OWN named case passed for the wrong reason — with
 * one side null the drift comparison fires, so the null-guard and the
 * error-propagation were both dead weight. Those are now pinned by cases where
 * drift cannot cover for them, plus `returned.length !== 1`, the message TEXT
 * of three rules (a wrong diagnostic once went unnoticed for exactly this
 * reason), the ternary descent, and the string-literal key arm. STILL
 * uncovered by mutation, deliberately: `classify`'s helper-NAME identity check
 * (the builder-call case is satisfied by the import check instead), `unwrap`'s
 * `await` and `as` arms, and `main()` itself — its walk, pre-filter, layout
 * exemption, inventory and exit code are exercised only by the real corpus.
 * Do not read a green --self-test as proof those work.
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

/** Layout key -> the single field it supplies that a page must restate. */
const SIBLING_KEYS: Record<string, string> = { twitter: 'card', icons: 'icon' }

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

/** True if the literal contains a `...spread`, so absent keys cannot be proven absent. */
function hasSpread(obj: ts.ObjectLiteralExpression): boolean {
  return obj.properties.some((p) => ts.isSpreadAssignment(p))
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
 * The object literals that ARE page metadata: an exported `metadata` const,
 * and every object literal returned from `generateMetadata`. Returns the
 * opaque returns separately — a `generateMetadata` that hands back a call
 * result is a structural bypass, not a pass.
 */
function metadataRoots(sf: ts.SourceFile): {
  objects: ts.ObjectLiteralExpression[]
  opaque: ts.Node[]
} {
  const objects: ts.ObjectLiteralExpression[] = []
  const opaque: ts.Node[] = []

  const collect = (e: ts.Expression): void => {
    const n = unwrap(e)
    if (ts.isObjectLiteralExpression(n)) objects.push(n)
    else if (ts.isConditionalExpression(n)) {
      collect(n.whenTrue)
      collect(n.whenFalse)
    } else opaque.push(n)
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
          collect(d.initializer)
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
        if (!ts.isBlock(body)) collect(body as ts.Expression)
        else {
          const scan = (n: ts.Node): void => {
            // Do not descend into nested functions: their returns are not
            // generateMetadata's return. (`scan` is seeded with forEachChild
            // on the body, so the body itself is never passed in here — an
            // earlier `&& n !== body.parent` clause was dead code that
            // invited a reader to "repair" it.)
            if (ts.isFunctionLike(n)) return
            if (ts.isReturnStatement(n) && n.expression) collect(n.expression)
            ts.forEachChild(n, scan)
          }
          ts.forEachChild(body, scan)
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  return { objects, opaque }
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
          (el) => (el.propertyName ?? el.name).text === HELPER_NAME
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

  // --- twitter / icons: ROOT-SCOPED, because these are generic words. An
  // unrelated `{ twitter: 'https://x.com/...' }` social-links object or a
  // `{ icons: [Star] }` config is not metadata and must not be flagged.
  const { objects, opaque } = metadataRoots(sf)
  for (const root of objects) {
    for (const [key, required] of Object.entries(SIBLING_KEYS)) {
      const init = directProp(root, key)
      if (!init) continue
      const line = lineOf(sf, init)
      const obj = unwrap(init)
      // A non-object value is LEGAL Metadata and supplies the field on its
      // own: `icons: '/images/favicon.png'` and `icons: [{ url }]` both set
      // the icon, and demanding an object literal there was a hard CI failure
      // on correct code. Nothing is dropped, so nothing to check.
      if (!ts.isObjectLiteralExpression(obj)) continue
      // A spread may supply the field from another module, so its absence
      // cannot be proven. Skipping is the honest answer; erroring here was a
      // false failure on `twitter: { ...BASE_TWITTER, title }`.
      if (hasSpread(obj)) continue
      const field = directProp(obj, required)
      // The layout is the SUPPLIER: it must provide the field. A page is the
      // CONSUMER: it must restate it. Enforcing only the page half left the
      // premise unguarded — the layout could drop `card` with the gate green.
      // `card: undefined` counts as absent for the same reason it does on the
      // layout's siteName: it looks present and emits nothing.
      if (!field || !isMeaningfulValue(field)) {
        problems.push({
          file: rel,
          line,
          message: isLayout
            ? `root layout ${key} must set \`${required}\` — every page inherits this object, ` +
              `and the page-level ${key} rule assumes the layout supplies it`
            : `page-level ${key} REPLACES the root layout's ${key} object wholesale, so it ` +
              `must restate \`${required}\` or the layout's value is silently dropped`,
        })
      }
    }
  }
  for (const node of opaque) {
    problems.push({
      file: rel,
      line: lineOf(sf, node),
      message:
        `generateMetadata returns a non-literal expression, so this gate cannot verify its ` +
        `openGraph/twitter/icons. Return an object literal, or extend this validator.`,
    })
  }

  return { declarations, layoutOpenGraphSeen, layoutDefaults, problems }
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
    { name: 'layout with DOUBLE-quoted website passes', rel: LAYOUT, src: meta('{ openGraph: { type: "website", siteName: SITE_NAME } }'), problems: false, declarations: 1 },
    { name: 'layout NESTED type does not satisfy', rel: LAYOUT, src: meta("{ openGraph: { images: [{ type: 'website' }], siteName: SITE_NAME } }"), problems: true, declarations: 1 },

    // --- twitter / icons, both directions ---
    { name: 'page twitter without card is a violation', rel: P, src: meta('{ twitter: { title: "x" } }'), problems: true, declarations: 0 },
    { name: 'page twitter restating card passes', rel: P, src: meta('{ twitter: { card: "summary_large_image", title: "x" } }'), problems: false, declarations: 0 },
    { name: 'page twitter with a NESTED card does not satisfy', rel: P, src: meta('{ twitter: { images: [{ card: 1 }] } }'), problems: true, declarations: 0 },
    { name: 'LAYOUT twitter without card is a violation too', rel: LAYOUT, src: meta("{ openGraph: { type: 'website', siteName: SITE_NAME }, twitter: { title: 'x' } }"), problems: true, declarations: 1 },
    { name: 'page icons without icon is a violation', rel: P, src: meta('{ icons: { apple: "/a.png" } }'), problems: true, declarations: 0 },
    { name: 'page robots is NOT guarded', rel: P, src: meta('{ robots: { index: false, follow: false } }'), problems: false, declarations: 0 },
    { name: 'an unrelated twitter social link is NOT metadata', rel: P, src: 'const social = { twitter: "https://x.com/lengolf", line: "x" }\n', problems: false, declarations: 0 },
    { name: 'an unrelated icons array is NOT metadata', rel: P, src: 'const cfg = { icons: [Star, Heart] }\n', problems: false, declarations: 0 },

    // --- structural bypass ---
    { name: 'generateMetadata returning a builder call is REPORTED', rel: P, src: 'export function generateMetadata() {\n  return pageMetadata("golf")\n}\n', problems: true, declarations: 0 },
    { name: 'generateMetadata returning an object literal is fine', rel: P, src: IMPORT + `export function generateMetadata() {\n  return { openGraph: ${HELPER_NAME}({ images: [1] }) }\n}\n`, problems: false, declarations: 1 },

    // --- AST surface a prior version did not enumerate ---
    { name: 'satisfies Metadata is NOT a false failure', rel: P, src: IMPORT + meta(`{ openGraph: ${HELPER_NAME}({ images: [1] }), twitter: { card: 'x' } } satisfies Metadata`), problems: false, declarations: 1 },
    // Angle-bracket casts are illegal in .tsx (there `<Foo>` is JSX), so this
    // case uses a plain .ts path — which is also what proves parse() picks
    // ScriptKind by extension rather than forcing TSX everywhere.
    { name: 'an angle-bracket cast in a .ts file is NOT a false failure', rel: 'app/sitemap.ts', src: IMPORT + meta(`<Metadata>{ openGraph: ${HELPER_NAME}({ images: [1] }) }`), problems: false, declarations: 1 },
    { name: 'icons as a STRING is legal metadata, not a failure', rel: P, src: meta("{ icons: '/images/favicon.png' }"), problems: false, declarations: 0 },
    { name: 'icons as an ARRAY is legal metadata, not a failure', rel: P, src: meta("{ icons: [{ url: '/a.png' }] }"), problems: false, declarations: 0 },
    { name: 'twitter with a SPREAD cannot be disproven, so passes', rel: P, src: meta("{ twitter: { ...BASE, title: 'x' } }"), problems: false, declarations: 0 },
    { name: 'icons shorthand { icon } satisfies the field', rel: P, src: meta('{ icons: { icon } }'), problems: false, declarations: 0 },
    { name: 'twitter card: undefined does NOT satisfy the field', rel: P, src: meta('{ twitter: { card: undefined } }'), problems: true, declarations: 0 },
    { name: 'SHORTHAND openGraph is counted AND rejected', rel: P, src: 'const openGraph = { images: [1] }\n' + meta("{ title: 'x', openGraph }"), problems: true, declarations: 1 },
    { name: 'generateMetadata as a function EXPRESSION is audited', rel: P, src: "export const generateMetadata = async function () {\n  return { twitter: { title: 'x' } }\n}\n", problems: true, declarations: 0 },
    { name: 'generateMetadata behind a wrapper call is audited', rel: P, src: "export const generateMetadata = cache(async () => ({ twitter: { title: 'x' } }))\n", problems: true, declarations: 0 },
    { name: 'generateMetadata via an aliased export is audited', rel: P, src: "async function gm() {\n  return { twitter: { title: 'x' } }\n}\nexport { gm as generateMetadata }\n", problems: true, declarations: 0 },
    { name: 'a LOCAL const metadata is not a metadata root', rel: P, src: "function Component() {\n  const metadata = { twitter: 'handle' }\n  return metadata\n}\n", problems: false, declarations: 0 },
    { name: 'layout siteName: undefined is a violation', rel: LAYOUT, src: meta("{ openGraph: { type: 'website', siteName: undefined } }"), problems: true, declarations: 1 },
    { name: 'layout siteName: whitespace is a violation', rel: LAYOUT, src: meta("{ openGraph: { type: 'website', siteName: '   ' } }"), problems: true, declarations: 1 },
    { name: 'a DUPLICATE key takes the LAST value, as JS does', rel: LAYOUT, src: meta("{ openGraph: { type: 'website', siteName: SITE_NAME, siteName: undefined } }"), problems: true, declarations: 1 },
    { name: 'an ALIASED import of another symbol does not satisfy', rel: P, src: `import { notTheHelper as ${HELPER_NAME} } from '${HELPER_MODULE}'\n` + meta(`{ openGraph: ${HELPER_NAME}({ images: [1] }) }`), problems: true, declarations: 1 },
    { name: 'a RELATIVE import of the helper is accepted', rel: P, src: `import { ${HELPER_NAME} } from '../../lib/open-graph'\n` + meta(`{ openGraph: ${HELPER_NAME}({ images: [1] }) }`), problems: false, declarations: 1 },
    // Pins two arms nothing else exercised: the ternary descent in
    // metadataRoots (only ONE branch is missing `card`), and propName's
    // string-literal key arm.
    { name: 'a ternary metadata descends into BOTH branches', rel: P, src: meta("cond ? { twitter: { card: 'x' } } : { twitter: { title: 'y' } }"), problems: true, declarations: 0 },
    { name: 'a STRING-literal openGraph key is counted', rel: P, src: meta("{ 'openGraph': { images: [1] } }"), problems: true, declarations: 1 },
  ]

  // Message text matters: a prior version reported "generateMetadata returns
  // a non-literal" on a file with no generateMetadata, and no case noticed
  // because none asserted the wording.
  const messageCases: { name: string; rel: string; src: string; expect: string }[] = [
    {
      name: 'layout twitter names the LAYOUT, not the page',
      rel: LAYOUT,
      src: meta("{ openGraph: { type: 'website', siteName: SITE_NAME }, twitter: { title: 'x' } }"),
      expect: 'root layout twitter must set',
    },
    {
      name: 'page twitter names the PAGE, not the layout',
      rel: P,
      src: meta("{ twitter: { title: 'x' } }"),
      expect: 'page-level twitter REPLACES',
    },
    {
      name: 'a bare page object names the helper',
      rel: P,
      src: meta('{ openGraph: { images: [1] } }'),
      expect: `wrapped in ${HELPER_NAME}(`,
    },
  ]

  let failures = 0
  for (const c of cases) {
    const r = auditSource(c.rel, c.src)
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
      name: 'an early-return guard is a loud error',
      src: `export function ${HELPER_NAME}(og) {\n  if (!og) return { type: 'website' }\n  return { ...og, type: og.type ?? 'website' }\n}\n`,
      want: { type: null, siteName: null, error: `expected ${HELPER_NAME} to return exactly one object literal, found 2` },
    },
  ]
  for (const c of helperCases) {
    const got = extractHelperDefaults(c.src)
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
  const base = { declarations: EXPECTED_DECLARATIONS, layoutOpenGraphSeen: true }
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
    if (got !== c.errors) {
      console.error(`  FAIL [aggregate] ${c.name}: expected errors=${c.errors}, got ${got}`)
      failures++
    } else console.log(`  ok   [aggregate] ${c.name}`)
  }

  const total = cases.length + messageCases.length + helperCases.length + aggregates.length
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
      !src.includes('openGraph') &&
      !src.includes('twitter') &&
      !src.includes('icons') &&
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
      `${HELPER_NAME}() imported from ${HELPER_MODULE}, the layout and helper defaults ` +
      `agree, and no page or layout drops twitter.card / icons.icon.`
  )
}

// Guarded: importing this module for a unit test used to run the whole scan
// and, on a failing corpus, process.exit(1) killed the importer before its
// first statement.
if (require.main === module) main()
