import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'th', 'ko', 'ja', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  // next-intl's middleware otherwise emits an HTTP `Link: rel="alternate";
  // hreflang=...` header for ALL five locales plus x-default on every
  // non-redirect page, built from `locales` and blind to
  // lib/translated-routes.ts: /privacy-policy/ (EN-only) advertised ja/ko/zh
  // URLs that 301 to English, and /golf-club-specs/ (EN+TH) advertised ko/ja/zh.
  // Where a page has HTML <link rel="alternate" hreflang> tags (getAlternates()
  // in generateMetadata) the header contradicted them; where it has none the
  // header was its only, wrong, hreflang. The HTML tags and app/sitemap.ts are
  // registry-aware, so they are the sources. Cost: x-default, which only the
  // header carried, is now advertised nowhere. middleware.ts still appends the
  // llms.txt Link header itself (withLlmsLink); nothing else rides on this.
  alternateLinks: false,
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    // Share across len.golf subdomains (booking.len.golf, www.len.golf)
    // so language selection persists between the marketing site and booking.
    domain: process.env.NODE_ENV === 'production' ? '.len.golf' : undefined,
  },
})
