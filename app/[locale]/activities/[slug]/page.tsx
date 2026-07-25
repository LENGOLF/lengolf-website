import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllSeoPageSlugs, getSeoPageBySlug } from '@/lib/seo-pages'
import { SITE_URL } from '@/lib/constants'
import { getActivityPageJsonLd, getFaqPageJsonLd } from '@/lib/jsonld'
import ActivityPageComponent from '@/components/activities/ActivityPage'
import type { ActivityOccasionSeoPage } from '@/types/seo-pages'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  // EN-only: these pages have no translations (not in lib/translated-routes.ts),
  // so the middleware 301s every non-EN URL to English — building locale
  // copies was dead weight.
  const slugs = await getAllSeoPageSlugs('activity_occasion')
  return slugs.map((slug) => ({ locale: 'en', slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getSeoPageBySlug(slug, 'activity_occasion')

  if (!page) {
    return { title: 'Page Not Found' }
  }

  return {
    title: page.title,
    description: page.meta_description || undefined,
    openGraph: {
      title: page.title,
      description: page.meta_description || undefined,
      url: `${SITE_URL}/activities/${slug}/`,
      type: 'website',
    },
    alternates: {
      canonical: `${SITE_URL}/activities/${slug}/`,
    },
  }
}

export default async function ActivityPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const page = await getSeoPageBySlug(slug, 'activity_occasion') as ActivityOccasionSeoPage | null

  if (!page) {
    notFound()
  }

  const jsonLd = getActivityPageJsonLd(page)
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
