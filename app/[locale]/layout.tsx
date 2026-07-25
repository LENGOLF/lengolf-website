import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { Poppins, Noto_Sans_Thai, Noto_Sans_KR, Noto_Sans_JP, Noto_Sans_SC } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { Analytics } from '@vercel/analytics/react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LineChatWidget from '@/components/layout/LineChatWidget'
import MobileStickyBar from '@/components/layout/MobileStickyBar'
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, storageUrl } from '@/lib/constants'
import { getLocalBusinessJsonLd, getWebSiteJsonLd } from '@/lib/jsonld'
import { routing } from '@/i18n/routing'
import '@/app/globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-thai',
  display: 'swap',
})

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-kr',
  display: 'swap',
})

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-jp',
  display: 'swap',
})

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-sc',
  display: 'swap',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

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
    <html lang={locale} className={`${poppins.variable} ${notoSansThai.variable} ${notoSansKR.variable} ${notoSansJP.variable} ${notoSansSC.variable}`}>
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
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
          <LineChatWidget />
          <MobileStickyBar />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
