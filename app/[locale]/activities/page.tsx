import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { setRequestLocale } from 'next-intl/server'
import SectionWrapper from '@/components/shared/SectionWrapper'
import BookingCTA from '@/components/shared/BookingCTA'
import CategoryPill from '@/components/shared/CategoryPill'
import { getSeoPagesByType } from '@/lib/seo-pages'
import { SITE_URL } from '@/lib/constants'
import { getBreadcrumbJsonLd } from '@/lib/jsonld'
import type { SeoPage } from '@/types/seo-pages'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const prefix = locale === 'en' ? '' : `/${locale}`
  return {
    title: 'Things To Do in Bangkok | Indoor Activities & Entertainment',
    description:
      'Discover the best things to do in Bangkok — from rainy day activities and date night ideas to group outings, indoor entertainment, and team building. Updated 2026.',
    alternates: {
      canonical: `${SITE_URL}${prefix}/activities/`,
    },
  }
}

// Category label map — converts slug-style category to readable label
const CATEGORY_LABELS: Record<string, string> = {
  weather: 'Weather & Seasons',
  couples: 'Date Night',
  celebrations: 'Celebrations',
  groups: 'Groups',
  nightlife: 'Nightlife',
  family: 'Family',
  general: 'General',
  'team-building': 'Team Building',
  bars: 'Bars & Nightlife',
  'corporate-events': 'Corporate',
  'indoor-entertainment': 'Indoor Fun',
  golf: 'Golf',
  'local-guide': 'Local Guide',
}

// URL prefix per page_type
function pageHref(page: SeoPage): string {
  if (page.page_type === 'best_of_listicle') return `/best/${page.slug}`
  return `/activities/${page.slug}`
}

function PageCard({ page }: { page: SeoPage }) {
  return (
    <Link
      href={pageHref(page) as Parameters<typeof Link>[0]['href']}
      className="group flex flex-col rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-3">
        <CategoryPill category={page.category} labelMap={CATEGORY_LABELS} />
      </div>
      <h2 className="mb-2 text-base font-semibold leading-snug group-hover:text-[#005a32] transition-colors">
        {page.title}
      </h2>
      {page.meta_description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mt-auto pt-2">
          {page.meta_description}
        </p>
      )}
    </Link>
  )
}

export default async function ActivitiesHubPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [activityPages, bestOfPages] = await Promise.all([
    getSeoPagesByType('activity_occasion'),
    getSeoPagesByType('best_of_listicle'),
  ])

  // Merge into one flat list: activities first, then best-of
  const allPages: SeoPage[] = [...activityPages, ...bestOfPages]

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Things To Do in Bangkok', url: `${SITE_URL}/activities/` },
  ])

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Things To Do in Bangkok',
    description:
      'Guides to the best activities, entertainment, and things to do in Bangkok — from rainy day ideas to group outings and team building.',
    url: `${SITE_URL}/activities/`,
    numberOfItems: allPages.length,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />

      {/* Hero */}
      <section
        className="flex items-center text-white"
        style={{
          background: 'linear-gradient(135deg, #003d1f 0%, #005a32 50%, #007429 100%)',
          minHeight: '280px',
          padding: '60px 6% 50px',
        }}
      >
        <div className="w-full">
          <span
            className="inline-block rounded px-5 py-1.5 text-sm font-bold uppercase tracking-widest text-white mb-4"
            style={{ backgroundColor: '#7CB342' }}
          >
            Bangkok Activities
          </span>
          <h1 className="text-4xl font-black uppercase leading-tight md:text-5xl lg:text-6xl mb-4">
            Things To Do<br />
            <span style={{ color: '#7CB342' }}>in Bangkok</span>
          </h1>
          <p className="text-base text-white/80 max-w-xl">
            {allPages.length} guides covering the best activities, entertainment, and group experiences in Bangkok — whether you&apos;re planning a date night, corporate outing, or rainy day escape.
          </p>
        </div>
      </section>

      {/* Card grid */}
      <SectionWrapper>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {allPages.map((page) => (
            <PageCard key={page.id} page={page} />
          ))}
        </div>
      </SectionWrapper>

      {/* CTA band */}
      <section className="py-12 lg:py-16 bg-primary">
        <div className="section-max-width section-padding text-center">
          <h2 className="mb-3 text-2xl font-bold text-white lg:text-3xl">
            Ready to Experience Bangkok&apos;s Best Indoor Golf?
          </h2>
          <p className="mb-6 text-white/80">
            LENGOLF at Mercury Ville (BTS Chidlom) — open daily 9am–11pm, no experience needed.
          </p>
          <BookingCTA text="Book a Bay" className="bg-white text-primary hover:bg-white/90" />
        </div>
      </section>

      {/* Cross-links */}
      <section className="py-12 lg:py-16" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding text-center">
          <h2 className="mb-6 text-xl font-semibold" style={{ color: '#005a32' }}>
            Planning your visit?
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { label: 'Pricing & Costs', href: '/faq/' },
              { label: 'Near Your Hotel', href: '/hotels/' },
              { label: 'Bay Rates', href: '/golf' },
              { label: 'Events & Packages', href: '/events' },
              { label: 'Golf Lessons', href: '/lessons' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href as Parameters<typeof Link>[0]['href']}
                className="rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm font-medium text-[#007429] transition-colors hover:bg-primary hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
