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
