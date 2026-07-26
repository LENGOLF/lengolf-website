import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { SITE_URL } from '@/lib/constants'
import { getBreadcrumbJsonLd } from '@/lib/jsonld'
import { getCourseRoundupJsonLd } from '@/lib/jsonld-courses'
import {
  USE_CASE_RULES,
  USE_CASES,
  type UseCase,
} from '@/data/golf-courses-use-cases'
import { getCoursesForUseCase } from '@/lib/golf-courses-derived'
import RoundupList from '@/components/golf-courses/RoundupList'
import CrossLinkBlock from '@/components/golf-courses/CrossLinkBlock'
import RentalCtaBanner from '@/components/golf-courses/RentalCtaBanner'
import { ArrowRight } from 'lucide-react'

interface Props {
  params: Promise<{ locale: string; useCase: string }>
}

export const revalidate = 86400

// Unknown use cases 404 at the routing layer (no on-demand render). An ISR page
// that reaches notFound() on-demand returns 500 on Vercel, not 404.
export const dynamicParams = false

export async function generateStaticParams() {
  // EN-only: omitting `locale` would cross-product with every locale from the
  // root layout, statically rendering ja/ko/zh copies that the middleware 301s
  // to English anyway.
  return USE_CASES.map((useCase) => ({ locale: 'en', useCase }))
}

function isUseCase(s: string): s is UseCase {
  return (USE_CASES as readonly string[]).includes(s)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { useCase } = await params
  if (!isUseCase(useCase)) return { title: 'Use Case Not Found' }
  const meta = USE_CASE_RULES[useCase]

  const canonicalUrl = `${SITE_URL}/golf-courses/best-for/${useCase}/`
  return {
    title: meta.title,
    description: meta.framing,
    alternates: { canonical: canonicalUrl },
    openGraph: { title: meta.title, description: meta.framing, url: canonicalUrl, type: 'website' },
  }
}

export default async function CoursesBestForPage({ params }: Props) {
  const { locale, useCase } = await params
  setRequestLocale(locale)

  if (!isUseCase(useCase)) notFound()
  const meta = USE_CASE_RULES[useCase]
  const courses = await getCoursesForUseCase(useCase, 8)
  if (courses.length === 0) notFound()

  const canonicalUrl = `${SITE_URL}/golf-courses/best-for/${useCase}/`
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Golf Courses', url: `${SITE_URL}/golf-courses/` },
    { name: meta.title, url: canonicalUrl },
  ])
  const listJsonLd = getCourseRoundupJsonLd(courses, canonicalUrl, meta.title)

  const otherUseCases = USE_CASES.filter((u) => u !== useCase)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#003d22]">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#005a32]/50" />
          <div className="absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-[#007a45]/25" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-1.5 text-xs text-white/50">
            <Link href="/golf-courses" className="transition-colors hover:text-white/80">Golf Courses</Link>
            <span>/</span>
            <span className="text-white/70">Best For</span>
          </nav>
          <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {meta.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/75">
            {meta.framing}
          </p>
        </div>
        <div className="absolute -bottom-px left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 40V0c240 26.7 480 40 720 40S1200 26.7 1440 0v40H0z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
        <section>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">
            {courses.length} courses matching the {useCase.replace('-', ' ')} criteria
          </h2>
          <RoundupList
            items={courses.map((c) => ({ course: c, reason: meta.reasonFor(c) }))}
          />
        </section>

        {/* Use-case specific cross-link CTA */}
        <div className="rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/10 to-accent/5 p-6">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: '#b8892e' }}>
            Pair this with LENGOLF
          </p>
          <p className="mb-3 text-base leading-relaxed text-foreground">
            {meta.crossLink.label}
          </p>
          <Link
            href={meta.crossLink.href as `/${string}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
          >
            Learn more <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <RentalCtaBanner />

        <CrossLinkBlock
          heading="Other course shortlists"
          items={otherUseCases.map((u) => ({
            label: USE_CASE_RULES[u].title.replace('Best Bangkok-Area Golf Courses ', ''),
            href: `/golf-courses/best-for/${u}`,
          }))}
        />
      </div>
    </>
  )
}
