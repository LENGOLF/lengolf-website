import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { SITE_URL } from '@/lib/constants'
import { getUsedClubById, getUsedClubIds, getRelatedClubs } from '@/lib/clubs'
import { getUsedClubProductJsonLd, getBreadcrumbJsonLd } from '@/lib/jsonld'
import ClubDetailGallery from '@/components/clubs/ClubDetailGallery'
import ClubCard from '@/components/clubs/ClubCard'
import { ArrowLeft, MessageCircle, Layers, User, Shield, Tag } from 'lucide-react'
import { siteOpenGraph } from '@/lib/open-graph'

export const revalidate = 86400

// Unknown/sold club IDs 404 at the routing layer (no on-demand render). An ISR
// page that reaches notFound() on-demand returns 500 on Vercel, not 404. NOTE:
// this makes a newly-listed club appear only after a redeploy regenerates
// generateStaticParams (edits to existing listings still ISR-revalidate).
export const dynamicParams = false

// EN-only — `locale` must be emitted explicitly or this cross-products with
// all five locales from the root layout (43 ids became ~215 prerendered
// pages). See the sibling note in app/[locale]/location/[slug]/page.tsx.
export async function generateStaticParams() {
  const ids = await getUsedClubIds()
  return ids.map((id) => ({ locale: 'en', id }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params
  const club = await getUsedClubById(id)
  if (!club) return { title: 'Club Not Found' }

  const t = await getTranslations({ locale, namespace: 'SecondHandClubs' })
  const title = `${club.brand}${club.model ? ` ${club.model}` : ''} — ${club.club_type} | ${t('metaTitle')}`
  const description = club.description || `${club.condition} condition ${club.brand} ${club.club_type} for sale at LENGOLF Bangkok`

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}${locale === 'th' ? '/th' : ''}/second-hand-golf-clubs-bangkok/${id}/`,
      languages: {
        en: `${SITE_URL}/second-hand-golf-clubs-bangkok/${id}/`,
        th: `${SITE_URL}/th/second-hand-golf-clubs-bangkok/${id}/`,
      },
    },
    openGraph: siteOpenGraph({
      images: club.image_url ? [{ url: club.image_url, alt: title }] : [],
    }),
    robots: { index: false, follow: false },
  }
}

const conditionColors: Record<string, { dot: string; text: string; bg: string }> = {
  Excellent: { dot: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50' },
  Good: { dot: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-50' },
  Fair: { dot: 'bg-gray-400', text: 'text-gray-600', bg: 'bg-gray-50' },
}

export default async function ClubDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const [club, t] = await Promise.all([
    getUsedClubById(id),
    getTranslations('SecondHandClubs'),
  ])

  if (!club) notFound()

  const relatedClubs = await getRelatedClubs(club, 3)

  const clubTitle = `${club.brand}${club.model ? ` ${club.model}` : ''}`
  const clubSpec = `${club.club_type}${club.specification ? `, ${club.specification}` : ''}`
  const clubDesc = `${clubTitle} (${clubSpec})`

  const lineUrl = 'https://line.me/ti/p/@lengolf'

  const productJsonLd = getUsedClubProductJsonLd(club)
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: t('metaTitle'), url: `${SITE_URL}/second-hand-golf-clubs-bangkok/` },
    { name: clubTitle, url: `${SITE_URL}/second-hand-golf-clubs-bangkok/${id}/` },
  ])

  const colors = conditionColors[club.condition] ?? conditionColors['Fair']

  const conditionLabel =
    club.condition === 'Excellent' ? t('conditionExcellent') :
    club.condition === 'Good' ? t('conditionGood') :
    t('conditionFair')

  const cardLabels = {
    enquireButton: t('enquireButton'),
    conditionExcellent: t('conditionExcellent'),
    conditionGood: t('conditionGood'),
    conditionFair: t('conditionFair'),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="py-8 lg:py-12" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          {/* Back link */}
          <Link
            href="/second-hand-golf-clubs-bangkok"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            {t('backToInventory')}
          </Link>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            {/* Gallery */}
            <ClubDetailGallery
              imageUrl={club.image_url}
              imageUrls={club.image_urls || []}
              alt={clubDesc}
            />

            {/* Details */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-black md:text-3xl" style={{ color: '#007429' }}>
                {clubTitle}
              </h1>
              <p className="mt-1 text-base text-muted-foreground">{clubSpec}</p>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-3xl font-black" style={{ color: '#007429' }}>
                  {club.price.toLocaleString('en-US')}
                </span>
                <span className="text-lg font-semibold text-muted-foreground">THB</span>
              </div>

              {/* Specs */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Layers size={16} className="text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground w-20 shrink-0">{t('detailType')}</span>
                  <span className="font-medium">{club.club_type}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield size={16} className="text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground w-20 shrink-0">{t('detailCondition')}</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                    {conditionLabel}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User size={16} className="text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground w-20 shrink-0">{t('detailGender')}</span>
                  <span className="font-medium">{club.gender}</span>
                </div>
                {club.shaft && (
                  <div className="flex items-center gap-3 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground shrink-0"><path d="M12 22V2"/></svg>
                    <span className="text-muted-foreground w-20 shrink-0">{t('detailShaft')}</span>
                    <span className="font-medium">{club.shaft}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {club.description && (
                <div className="mt-6 rounded-lg border border-border/40 bg-white p-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{club.description}</p>
                </div>
              )}

              {/* CTA */}
              <div className="mt-8 space-y-3">
                <a
                  href={lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#00B900' }}
                >
                  <MessageCircle size={18} />
                  {t('enquireButton')}
                </a>
                <p className="text-center text-xs text-muted-foreground">{t('detailEnquireHint')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related clubs */}
      {relatedClubs.length > 0 && (
        <section className="py-12 lg:py-16">
          <div className="section-max-width section-padding">
            <h2 className="mb-6 text-xl font-bold">
              <span style={{ color: '#007429' }}>{t('relatedTitle')}</span>
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {relatedClubs.map((rc) => (
                <ClubCard key={rc.id} club={rc} labels={cardLabels} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
