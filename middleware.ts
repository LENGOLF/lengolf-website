import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { hasTranslationForLocale } from './lib/translated-routes'
import { NextRequest, NextResponse } from 'next/server'
import { SITE_URL } from './lib/constants'

const intlMiddleware = createMiddleware(routing)

const LOCALE_PREFIXES = ['th', 'ko', 'ja', 'zh'] as const

// Advertise the curated AI-assistant site map (app/llms.txt/route.ts) on
// every PAGE response. This lives HERE, not in next.config.js headers() and
// not in metadata, because both lose: next-intl's middleware sets its own
// `link` header (hreflang alternates), which REPLACES any Link that
// next.config attached to the same response — measured, not guessed — and a
// layout-level metadata `alternates.types` would be per-key-replaced by every
// page that declares `alternates` for its canonical (the og:site_name trap,
// see validate:open-graph in CLAUDE.md). Appending on the middleware's own
// response is the one spot that composes with the hreflang header instead of
// fighting it. Absolute URL: the header names one canonical file regardless
// of which host/port served the page. SITE_URL is imported rather than
// duplicated — lib/constants.ts has no imports of its own, so it is safe in
// the edge bundle.
const LLMS_LINK_HEADER =
  `<${SITE_URL}/llms.txt>; rel="alternate"; type="text/plain"; title="LLM-friendly site map"`

function withLlmsLink(response: NextResponse): NextResponse {
  response.headers.append('link', LLMS_LINK_HEADER)
  return response
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect untranslated locale routes to English with 301
  for (const locale of LOCALE_PREFIXES) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '') || '/'

      if (!hasTranslationForLocale(locale, pathWithoutLocale)) {
        const url = request.nextUrl.clone()
        url.pathname = pathWithoutLocale
        return NextResponse.redirect(url, 301)
      }
      break
    }
  }

  // Always run intlMiddleware (it handles locale rewriting for [locale] param)
  const response = intlMiddleware(request)

  // Intercept: intlMiddleware wants to redirect to a locale route that has no
  // translation for this path. Serve English for THIS request instead.
  //
  // This used to delete the NEXT_LOCALE cookie and re-run intlMiddleware,
  // which only works when the COOKIE was the source of the locale. Locale
  // detection also reads Accept-Language (localeDetection defaults to true in
  // i18n/routing.ts), and a re-run detects the same locale from the same
  // header — so a browser sending "Accept-Language: ja" with no cookie
  // ping-ponged forever:
  //
  //   GET /golf-in-thailand-guide/  -> 307 /ja/golf-in-thailand-guide/
  //   GET /ja/golf-in-thailand-guide/ -> 301 /golf-in-thailand-guide/   (loop above)
  //
  // i.e. ERR_TOO_MANY_REDIRECTS on a page the footer links from every page in
  // the site. Rewriting (not redirecting) to the /en tree ends it in one hop
  // and returns the page the reader asked for. The cookie is deliberately NOT
  // set: this request falls back to English, the reader's language preference
  // is not overwritten for the rest of the site.
  const location = response.headers.get('location')
  if (location && response.status >= 300 && response.status < 400) {
    try {
      const redirectUrl = new URL(location, request.url)
      const redirectPath = redirectUrl.pathname

      for (const locale of LOCALE_PREFIXES) {
        if (redirectPath === `/${locale}` || redirectPath.startsWith(`/${locale}/`)) {
          const pathWithoutLocale = redirectPath.replace(new RegExp(`^/${locale}`), '') || '/'
          // Only intercept a PURE prefix-add — the detection redirect this
          // whole block exists for. next-intl issues locale-prefixed redirects
          // for a second reason: canonicalizing a case-variant prefix
          // (`/JA/x/` -> `/ja/x/`, matched case-insensitively upstream while
          // LOCALE_PREFIXES above is case-sensitive). Rewriting THAT one serves
          // a 200 English page at the non-canonical URL instead of letting it
          // redirect, so every case variant of every locale becomes an
          // indexable soft-duplicate. Let those through: the 307 lands on the
          // lower-cased path, which the 301 loop at the top then resolves.
          if (pathWithoutLocale !== pathname) break
          if (!hasTranslationForLocale(locale, pathWithoutLocale)) {
            const url = request.nextUrl.clone()
            // Keep the trailing slash (`trailingSlash: true` in next.config.js).
            // pathWithoutLocale is already '/' for the root case, so `/en/`
            // falls out — dropping it would rewrite to an unnormalized `/en`.
            url.pathname = `/en${pathWithoutLocale}`
            return withLlmsLink(NextResponse.rewrite(url))
          }
          break
        }
      }
    } catch {
      // Malformed location header — let original response through
    }
  }

  // Redirects pass through undecorated — the header belongs on the page a
  // reader/crawler lands on, not on the hop that sends them there.
  if (response.status >= 300 && response.status < 400) return response
  return withLlmsLink(response)
}

export const config = {
  // Exclude static files, assets, and known-static paths from middleware
  matcher: [
    // `txt` is in the extension list so static text files in public/ (the
    // IndexNow ownership key, any future verification file) bypass locale
    // handling. Without it the key file went INTO the locale tree and 404'd —
    // by which of two paths depends on the client: a cookie-less crawler was
    // REWRITTEN to /en/<key>.txt/, while a browser carrying a NEXT_LOCALE
    // cookie got a 307 to /<locale>/<key>.txt/ first. Either way IndexNow's
    // async key validation reads the 404 as "not the owner" while the ping API
    // has already returned 200, so nothing surfaces the failure. robots/llms
    // stay name-listed too: they are route handlers, not public files, and the
    // names document that.
    '/((?!_next/static|_next/image|_next/data|api/|favicon\\.ico|sitemap\\.xml|robots\\.txt|llms\\.txt|images/.*|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|css|js|map|txt)$).*)',
  ],
}
