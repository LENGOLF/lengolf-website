import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllSeoPageParams, getSeoPageBySlug } from '@/lib/seo-pages'
import { getAlternates, getCanonical } from '@/lib/translated-routes'
import { getSeoFaqPageJsonLd } from '@/lib/jsonld'
import FaqPageComponent from '@/components/faq/FaqPage'
import type { FaqSeoPage } from '@/types/seo-pages'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  // Only build locale×slug combos that have published content — untranslated
  // locale URLs 301 to English via the middleware (lib/translated-routes.ts).
  // (Previously this built every slug × every locale, which was harmless while
  // no FAQ translations existed; with locale entries it would render the wrong
  // language. Mirrors app/[locale]/guide/[slug]/page.tsx.)
  return getAllSeoPageParams('faq')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const page = await getSeoPageBySlug(slug, 'faq', locale)

  if (!page) {
    return { title: 'Page Not Found' }
  }

  // Only emit hreflang when a translation actually exists — a lone
  // self-referential hreflang="en" cluster is audit noise and would
  // contradict the sitemap, which applies the same guard.
  const languages = getAlternates(`/faq/${slug}/`)
  return {
    title: page.title,
    description: page.meta_description || undefined,
    openGraph: {
      title: page.title,
      description: page.meta_description || undefined,
      url: getCanonical(locale, `/faq/${slug}/`),
      type: 'website',
    },
    alternates: {
      canonical: getCanonical(locale, `/faq/${slug}/`),
      ...(Object.keys(languages).length > 1 ? { languages } : {}),
    },
  }
}

export default async function FaqPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const page = await getSeoPageBySlug(slug, 'faq', locale) as FaqSeoPage | null

  if (!page) {
    notFound()
  }

  const tFaq = await getTranslations('FaqPage')
  const jsonLd = getSeoFaqPageJsonLd(page, locale, (url) =>
    tFaq('schemaSeeFullAnswer', { url })
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FaqPageComponent data={page} />
    </>
  )
}
