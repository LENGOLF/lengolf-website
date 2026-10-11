import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'th', 'ko', 'ja', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  // next-intl's middleware otherwise emits an HTTP `Link: rel="alternate";
  // hreflang=...` header for ALL five locales plus x-default on every page,
  // blind to lib/translated-routes.ts, so /privacy-policy/ advertised
  // ja/ko/zh URLs that 301 back to English. The HTML <link rel="alternate">
  // tags (getAlternates() in generateMetadata) and app/sitemap.ts already list
  // only the locales a route is translated into; two conflicting hreflang
  // clusters on one URL is worse than one. middleware.ts still appends the
  // llms.txt Link header itself (withLlmsLink), so nothing else rides on this.
  alternateLinks: false,
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    // Share across len.golf subdomains (booking.len.golf, www.len.golf)
    // so language selection persists between the marketing site and booking.
    domain: process.env.NODE_ENV === 'production' ? '.len.golf' : undefined,
  },
})
