import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllSeoPageParams, getSeoPageBySlug } from '@/lib/seo-pages'
import { getAlternates, getCanonical } from '@/lib/translated-routes'
import { getBestOfListiclePageJsonLd } from '@/lib/jsonld'
import BestOfListiclePageComponent from '@/components/best/BestOfListiclePage'
import type { BestOfListicleSeoPage } from '@/types/seo-pages'
import { siteOpenGraph } from '@/lib/open-graph'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

// Daily. This section's content lives in local data/*.ts, so it only changes on
// deploy; the interval is a safety net, not a freshness requirement. Declared
// explicitly because lib/pricing.ts's fetch would otherwise set it — that fetch
// is now 30 days, and inheriting it would leave a content edit unpublished for
// a month.
export const revalidate = 86400

// An unknown slug must 404 at the ROUTING layer, not render on demand.
//
// Without this, Next renders the not-found path for any slug a crawler invents
// and stores the result as a permanent ISR entry — measured on prod 2026-09-04:
// a bogus /guide/ URL returned 404 carrying `X-Nextjs-Prerender: 1` and
// `X-Nextjs-Stale-Time: 4294967294` (2^32-2, i.e. never revalidate), 124 KB,
// MISS then HIT forever. Every unique junk URL therefore cost one invocation,
// one permanent cache write and 124 KB of egress, unbounded by crawler volume
// — against ~523K firewall-evaluated requests per cycle on this project.
//
// Safe because the middleware resolves locale BEFORE this route: an
// unregistered locale x slug pair 301s to English. Verified 2026-09-04 on all
// four non-EN locales of the only EN-only slug in these six sections
// (where-to-play-golf-at-night-in-bangkok), so nothing serving 200 today
// becomes a 404. Section E of the smoke suite guards that mechanism.
export const dynamicParams = false

export async function generateStaticParams() {
  // Only build locale x slug combos that have published content — untranslated
  // locale URLs 301 to English via the middleware (lib/translated-routes.ts).
  // Was EN-only while this section had no translations; mirrors the /faq/ and
  // /guide/ routes now that it does.
  return getAllSeoPageParams('best_of_listicle')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const page = await getSeoPageBySlug(slug, 'best_of_listicle', locale)

  if (!page) {
    return { title: 'Page Not Found' }
  }

  const languages = getAlternates(`/best/${slug}/`)
  return {
    title: page.title,
    description: page.meta_description || undefined,
    openGraph: siteOpenGraph({
      title: page.title,
      description: page.meta_description || undefined,
      url: getCanonical(locale, `/best/${slug}/`),
      type: 'website',
    }),
    alternates: {
      canonical: getCanonical(locale, `/best/${slug}/`),
      // Only emit hreflang once a translation actually exists — a lone
      // self-referential en cluster is audit noise and would contradict the
      // sitemap, which applies the same guard.
      ...(Object.keys(languages).length > 1 ? { languages } : {}),
    },
  }
}

export default async function BestOfListiclePage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const page = await getSeoPageBySlug(slug, 'best_of_listicle', locale) as BestOfListicleSeoPage | null

  if (!page) {
    notFound()
  }

  const jsonLd = getBestOfListiclePageJsonLd(page, locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BestOfListiclePageComponent data={page} />
    </>
  )
}
