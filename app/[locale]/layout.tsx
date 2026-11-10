import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import localFont from 'next/font/local'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LineChatWidget from '@/components/layout/LineChatWidget'
import MobileStickyBar from '@/components/layout/MobileStickyBar'
import BareRouteGate from '@/components/layout/BareRouteGate'
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, storageUrl } from '@/lib/constants'
import { getLocalBusinessJsonLd, getWebSiteJsonLd } from '@/lib/jsonld'
import { routing } from '@/i18n/routing'
import '@/app/globals.css'

// Fonts are self-hosted from app/fonts/, so next/font makes no network call
// at build time. They were loaded through next/font/google, which fetches the
// family CSS from Google during `next build` and downloads every
// unicode-range slice it lists (367 files, about 14 MB, almost all of it
// Noto Sans KR/JP/SC). Google sometimes answers the JP and SC requests with
// extensionless `fonts.gstatic.com/l/font?kit=...` URLs, and next/font's
// `/\.(woff|woff2|eot|ttf|otf)$/.exec(url)[1]` then threw on null, failing CI
// at random. Do not move these back to next/font/google.
//
// The files are the exact slices Google serves (Poppins v24 `latin` and
// `latin-ext`, Noto Sans Thai v29 `thai`), each with Google's unicode-range.
// Licences (OFL) sit beside them. Noto Sans Thai is a variable font (wght
// 100-900), so one file covers 300-700.
//
// next/font/local names each @font-face family after the CONST it is assigned
// to, so these consts are named `Poppins` deliberately: Header.tsx and
// Footer.tsx set `fontFamily: '"Poppins", sans-serif'` inline and must match.
// Renaming the const silently drops those components to the system font.
//
// Poppins latin-ext is a second family (one localFont call carries one
// unicode-range for all its files). It is listed BEFORE Poppins in every font
// stack, because --font-poppins also carries Poppins' generated Arial fallback
// face, which has no unicode-range and would otherwise draw latin-ext letters
// first; the ext face's own unicode-range keeps it off plain Latin. It is not
// preloaded: the site's own copy has no latin-ext letters, it
// only covers names and text from the database (reviews, blog posts).
//
// CJK text uses each device's own font (see the html[lang] stacks in
// app/globals.css), not a web font: self-hosting Noto Sans KR/JP/SC would mean
// committing about 13.5 MB (349 slice files).
const Poppins = localFont({
  src: [
    { path: '../fonts/poppins-latin-300.woff2', weight: '300', style: 'normal' },
    { path: '../fonts/poppins-latin-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/poppins-latin-500.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/poppins-latin-600.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/poppins-latin-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-poppins',
  display: 'swap',
  declarations: [
    {
      prop: 'unicode-range',
      value:
        'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
    },
  ],
})

const PoppinsLatinExt = localFont({
  src: [
    { path: '../fonts/poppins-latin-ext-300.woff2', weight: '300', style: 'normal' },
    { path: '../fonts/poppins-latin-ext-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/poppins-latin-ext-500.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/poppins-latin-ext-600.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/poppins-latin-ext-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-poppins-ext',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
  declarations: [
    {
      prop: 'unicode-range',
      value:
        'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF',
    },
  ],
})

const notoSansThai = localFont({
  src: '../fonts/noto-sans-thai-thai-variable.woff2',
  weight: '300 700',
  style: 'normal',
  variable: '--font-noto-thai',
  display: 'swap',
  declarations: [
    { prop: 'unicode-range', value: 'U+02D7, U+0303, U+0331, U+0E01-0E5B, U+200C-200D, U+25CC' },
  ],
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

// A locale outside the five above must 404 at the routing layer, not render.
// The notFound() below still returns a 404, but only after Next has rendered
// the not-found path and stored it as an ISR entry that never revalidates, for
// the life of the deployment. A junk locale is reachable because the middleware
// matcher skips file extensions, the images/ and api/ prefixes, and any first
// segment that merely STARTS with favicon.ico, sitemap.xml, robots.txt or
// llms.txt (those alternatives are unanchored), so `/<junk>.txt` and
// `/images/golf/` arrive here with the junk string as the locale (measured on
// prod 2026-09-24, ~86-132 KB per unique URL, MISS then HIT).
//
// Next resolves a route's dynamicParams as "every segment !== false"
// (build/utils.js), so this one line covers every PAGE under [locale],
// including static pages with no param of their own, and no child can opt back
// in. It does NOT reach route handlers (opengraph-image and friends), which
// take config from their own file only: each needs its own flag. Two
// consequences for new pages here: a dynamic child with no generateStaticParams
// now 404s on every request, and a page whose own generateStaticParams omits a
// locale that the middleware lets through 404s for that locale. Smoke section
// G2 asserts the junk-locale case.
export const dynamicParams = false

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Premier Indoor Golf Simulator & Bar in Bangkok`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ url: storageUrl('venue/venue-interior-01.jpg'), width: 1200, height: 630, alt: 'LENGOLF indoor golf simulator and bar in Bangkok' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/favicon.png',
  },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en' | 'th' | 'ko' | 'ja' | 'zh')) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID

  return (
    <html lang={locale} className={`${Poppins.variable} ${PoppinsLatinExt.variable} ${notoSansThai.variable}`}>
      <head>
        {/* Google Ads (AW-16456389020) is loaded by GTM tag 90 "Google Tag AW-16456389020",
            which fires on All Pages and configures enhanced conversions with user_data.
            Do not add a second gtag.js/config for it here - that duplicates the Ads
            pageview hit and configures the same target without user_data. */}
        {/* Google Tag Manager.
            lazyOnload, not afterInteractive: the container pulls ~666 KB of third-party
            JavaScript (GA4, Google Ads, Meta Pixel, Clarity) and its execution was
            competing with hydration. Interior pages measured TTI 12.9s against FCP 1.7s,
            a gap that is script, not media.
            The trade: GTM now runs during idle after load, so a visitor who leaves within
            a second or two may not fire a pageview. Conversion Linker still reads the
            gclid from the URL when it runs, since these are static pages and the URL
            persists. Watch conversion volume after deploying and revert this one word if
            it drops materially. */}
        {gtmId && (
          <Script
            id="gtm-init"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
      </head>
      <body className="min-h-screen font-sans antialiased">
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getLocalBusinessJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getWebSiteJsonLd()) }}
        />
        <NextIntlClientProvider messages={messages}>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white">
            Skip to main content
          </a>
          {/* Standalone routes (the club spec sheet) render without the site
              chrome — see BareRouteGate. It fails open, so an unrecognised
              path always keeps its header and footer. */}
          <BareRouteGate>
            <Header />
          </BareRouteGate>
          <main id="main-content">{children}</main>
          <BareRouteGate>
            <Footer />
            <LineChatWidget />
            <MobileStickyBar />
          </BareRouteGate>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
