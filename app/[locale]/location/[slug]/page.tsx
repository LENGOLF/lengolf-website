import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLocationBySlug, getAllLocationSlugs } from '@/lib/locations'
import { SITE_URL } from '@/lib/constants'
import LocationPageComponent from '@/components/location/LocationPage'
import { siteOpenGraph } from '@/lib/open-graph'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllLocationSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getLocationBySlug(slug)

  if (!page) {
    return { title: 'Page Not Found' }
  }

  return {
    title: page.h1_title,
    description: page.meta_description || undefined,
    openGraph: siteOpenGraph({
      title: page.h1_title,
      description: page.meta_description || undefined,
      url: `${SITE_URL}/location/${slug}/`,
      type: 'website',
    }),
    alternates: {
      canonical: `${SITE_URL}/location/${slug}/`,
      // No Thai translation exists for location pages
    },
  }
}

export const revalidate = 86400

// Unknown slugs 404 at the routing layer (no on-demand render). Required on
// Vercel: an ISR page (revalidate set) that reaches notFound() during on-demand
// rendering of a non-prebuilt param returns 500, not 404. New pages appear
// after a redeploy regenerates generateStaticParams; edits ISR-revalidate.
export const dynamicParams = false

export default async function LocationPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const page = await getLocationBySlug(slug)

  if (!page) {
    notFound()
  }

  return (
    <>
      {/* JSON-LD Schema */}
      {page.schema_markup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(page.schema_markup) }}
        />
      )}
      <LocationPageComponent data={page} />
    </>
  )
}
