import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllSeoPageParams, getSeoPageBySlug } from '@/lib/seo-pages'
import { getAlternates, getCanonical } from '@/lib/translated-routes'
import { getHotelConciergePageJsonLd } from '@/lib/jsonld'
import HotelConciergePage from '@/components/hotels/HotelConciergePage'
import type { HotelConciergeSeoPage } from '@/types/seo-pages'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  // Only build locale x slug combos that have published content — untranslated
  // locale URLs 301 to English via the middleware (lib/translated-routes.ts).
  // Was EN-only while this section had no translations; mirrors the /faq/ and
  // /guide/ routes now that it does.
  return getAllSeoPageParams('hotel_concierge')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const page = await getSeoPageBySlug(slug, 'hotel_concierge', locale)

  if (!page) {
    return { title: 'Page Not Found' }
  }

  const languages = getAlternates(`/hotels/${slug}/`)
  return {
    title: page.title,
    description: page.meta_description || undefined,
    openGraph: {
      title: page.title,
      description: page.meta_description || undefined,
      url: getCanonical(locale, `/hotels/${slug}/`),
      type: 'website',
    },
    alternates: {
      canonical: getCanonical(locale, `/hotels/${slug}/`),
      // Only emit hreflang once a translation actually exists — a lone
      // self-referential en cluster is audit noise and would contradict the
      // sitemap, which applies the same guard.
      ...(Object.keys(languages).length > 1 ? { languages } : {}),
    },
  }
}

export default async function HotelConciergeSeoPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const page = await getSeoPageBySlug(slug, 'hotel_concierge', locale) as HotelConciergeSeoPage | null

  if (!page) {
    notFound()
  }

  const jsonLd = getHotelConciergePageJsonLd(page, locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HotelConciergePage data={page} />
    </>
  )
}
