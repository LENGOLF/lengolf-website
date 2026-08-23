import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllSeoPageParams, getSeoPageBySlug } from '@/lib/seo-pages'
import { getAlternates, getCanonical } from '@/lib/translated-routes'
import { getActivityPageJsonLd, getFaqPageJsonLd } from '@/lib/jsonld'
import ActivityPageComponent from '@/components/activities/ActivityPage'
import type { ActivityOccasionSeoPage } from '@/types/seo-pages'
import { siteOpenGraph } from '@/lib/open-graph'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  // Only build locale x slug combos that have published content — untranslated
  // locale URLs 301 to English via the middleware (lib/translated-routes.ts).
  // Was EN-only while this section had no translations; mirrors the /faq/ and
  // /guide/ routes now that it does.
  return getAllSeoPageParams('activity_occasion')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const page = await getSeoPageBySlug(slug, 'activity_occasion', locale)

  if (!page) {
    return { title: 'Page Not Found' }
  }

  const languages = getAlternates(`/activities/${slug}/`)
  return {
    title: page.title,
    description: page.meta_description || undefined,
    openGraph: siteOpenGraph({
      title: page.title,
      description: page.meta_description || undefined,
      url: getCanonical(locale, `/activities/${slug}/`),
      type: 'website',
    }),
    alternates: {
      canonical: getCanonical(locale, `/activities/${slug}/`),
      // Only emit hreflang once a translation actually exists — a lone
      // self-referential en cluster is audit noise and would contradict the
      // sitemap, which applies the same guard.
      ...(Object.keys(languages).length > 1 ? { languages } : {}),
    },
  }
}

export default async function ActivityPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const page = await getSeoPageBySlug(slug, 'activity_occasion', locale) as ActivityOccasionSeoPage | null

  if (!page) {
    notFound()
  }

  const jsonLd = getActivityPageJsonLd(page, locale)
  const faqs = page.content.faqs
  const faqJsonLd = faqs && faqs.length > 0 ? getFaqPageJsonLd(faqs) : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <ActivityPageComponent data={page} />
    </>
  )
}
