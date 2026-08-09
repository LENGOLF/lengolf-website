import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllSeoPageParams, getSeoPageBySlug } from '@/lib/seo-pages'
import { getAlternates, getCanonical } from '@/lib/translated-routes'
import { getPriceGuidePageJsonLd } from '@/lib/jsonld'
import PriceGuidePageComponent from '@/components/prices/PriceGuidePage'
import type { PriceGuideSeoPage } from '@/types/seo-pages'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  // Only build locale x slug combos that have published content — untranslated
  // locale URLs 301 to English via the middleware (lib/translated-routes.ts).
  // Was EN-only while this section had no translations; mirrors the /faq/ and
  // /guide/ routes now that it does.
  return getAllSeoPageParams('price_guide')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const page = await getSeoPageBySlug(slug, 'price_guide', locale)

  if (!page) {
    return { title: 'Page Not Found' }
  }

  const languages = getAlternates(`/cost/${slug}/`)
  return {
    title: page.title,
    description: page.meta_description || undefined,
    openGraph: {
      title: page.title,
      description: page.meta_description || undefined,
      url: getCanonical(locale, `/cost/${slug}/`),
      type: 'website',
    },
    alternates: {
      canonical: getCanonical(locale, `/cost/${slug}/`),
      // Only emit hreflang once a translation actually exists — a lone
      // self-referential en cluster is audit noise and would contradict the
      // sitemap, which applies the same guard.
      ...(Object.keys(languages).length > 1 ? { languages } : {}),
    },
  }
}

export default async function PriceGuidePage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const page = await getSeoPageBySlug(slug, 'price_guide', locale) as PriceGuideSeoPage | null

  if (!page) {
    notFound()
  }

  const jsonLd = getPriceGuidePageJsonLd(page, locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PriceGuidePageComponent data={page} />
    </>
  )
}
