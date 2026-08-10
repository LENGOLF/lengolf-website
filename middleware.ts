import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { hasTranslationForLocale } from './lib/translated-routes'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware(routing)

const LOCALE_PREFIXES = ['th', 'ko', 'ja', 'zh'] as const

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
          if (!hasTranslationForLocale(locale, pathWithoutLocale)) {
            const url = request.nextUrl.clone()
            url.pathname = `/en${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
            return NextResponse.rewrite(url)
          }
          break
        }
      }
    } catch {
      // Malformed location header — let original response through
    }
  }

  return response
}

export const config = {
  // Exclude static files, assets, and known-static paths from middleware
  matcher: [
    '/((?!_next/static|_next/image|_next/data|api/|favicon\\.ico|sitemap\\.xml|robots\\.txt|llms\\.txt|images/.*|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|css|js|map)$).*)',
  ],
}
