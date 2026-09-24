import { Fragment } from 'react'
import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import SectionWrapper from '@/components/shared/SectionWrapper'
import BoldText from '@/components/shared/BoldText'
import { getBreadcrumbJsonLd } from '@/lib/jsonld'
import { getAlternates, getCanonical } from '@/lib/translated-routes'
import { RENTAL_AGREEMENT_PATH, getRentalAgreement } from '@/data/rental-agreement'

// The agreement text lives in data/rental-agreement/ (one file per locale).
// EN governs (§12); the other locales are translations and say so in a notice
// at the top. Which locales are REACHABLE is decided by lib/translated-routes.ts
// (the middleware 301s an unregistered locale to EN), so a locale with no data
// entry is a hard 404 here rather than a silent English page under /<locale>/.

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const agreement = getRentalAgreement(locale)
  if (!agreement) return {}
  return {
    title: agreement.metaTitle,
    description: agreement.metaDescription,
    alternates: {
      canonical: getCanonical(locale, RENTAL_AGREEMENT_PATH),
      languages: getAlternates(RENTAL_AGREEMENT_PATH),
    },
  }
}

export default async function CourseRentalAgreementPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const agreement = getRentalAgreement(locale)
  if (!agreement) notFound()

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: getCanonical(locale, '/') },
    { name: agreement.title, url: getCanonical(locale, RENTAL_AGREEMENT_PATH) },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SectionWrapper>
        <div className="mx-auto max-w-3xl prose prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
          <h1>{agreement.title}</h1>
          <p>{agreement.lastUpdated}</p>
          {agreement.notice && (
            // locale="en" is load-bearing: once this route is translated,
            // next-intl redirects the bare EN URL to the reader's cookie or
            // Accept-Language locale, so a plain link would bounce them straight
            // back here. Pinning the locale sets the cookie on click.
            <p className="rounded-md border border-primary/15 bg-primary/5 px-4 py-3 text-sm">
              {agreement.notice.text}{' '}
              <Link href={RENTAL_AGREEMENT_PATH} locale="en" hrefLang="en" className="font-medium text-primary">
                {agreement.notice.linkText}
              </Link>
            </p>
          )}
          {agreement.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}

          <hr />

          {agreement.sections.map((section) => (
            <Fragment key={section.heading}>
              <h3>{section.heading}</h3>
              {section.paragraphs?.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {section.items && (
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>
                      <BoldText text={item} />
                    </li>
                  ))}
                </ul>
              )}
            </Fragment>
          ))}

          <hr />

          {agreement.closing.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </SectionWrapper>
    </>
  )
}
