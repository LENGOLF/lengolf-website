import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllSeoPageParams, getSeoPageBySlug } from '@/lib/seo-pages'
import { buildRelatedLabels } from '@/lib/seo-links'
import { getAlternates, getCanonical } from '@/lib/translated-routes'
import { getExplainerPageJsonLd } from '@/lib/jsonld'
import { getFactTokens, interpolateFacts } from '@/lib/site-facts'
import ExplainerPageComponent from '@/components/guides/ExplainerPage'
import type { ExplainerSeoPage, ExplainerContent } from '@/types/seo-pages'

// Replace {{token}} placeholders (POS-backed price facts) throughout an
// explainer page's user-visible strings. Applied at render + generateMetadata
// time; unknown tokens throw at build (see lib/site-facts.ts).
function interpolateExplainerPage(
  page: ExplainerSeoPage,
  tokens: Record<string, string>
): ExplainerSeoPage {
  const c = page.content
  const content: ExplainerContent = {
    ...c,
    intro: interpolateFacts(c.intro, tokens),
    sections: c.sections.map((s) => ({
      heading: interpolateFacts(s.heading, tokens),
      body: interpolateFacts(s.body, tokens),
    })),
    key_takeaways: c.key_takeaways.map((k) => interpolateFacts(k, tokens)),
    comparison_table: c.comparison_table.map((r) => ({
      feature: interpolateFacts(r.feature, tokens),
      simulator: interpolateFacts(r.simulator, tokens),
      real_golf: interpolateFacts(r.real_golf, tokens),
    })),
    table_heading: c.table_heading
      ? interpolateFacts(c.table_heading, tokens)
      : c.table_heading,
    col_a_label: c.col_a_label
      ? interpolateFacts(c.col_a_label, tokens)
      : c.col_a_label,
    col_b_label: c.col_b_label
      ? interpolateFacts(c.col_b_label, tokens)
      : c.col_b_label,
  }
  return {
    ...page,
    title: interpolateFacts(page.title, tokens),
    meta_description: page.meta_description
      ? interpolateFacts(page.meta_description, tokens)
      : page.meta_description,
    content,
  }
}

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

// Related-link paths that point at other SEO pages resolve their label from
// the target page's (localized) title instead of title-casing the URL slug.
// Uses the canonical section map — a local copy here previously drifted
// (omitted activities/hotels), leaving those links with fallback labels.

export async function generateStaticParams() {
  // Only build locale×slug combos that have published content — untranslated
  // locale URLs 301 to English via the middleware (lib/translated-routes.ts).
  return getAllSeoPageParams('explainer')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const page = await getSeoPageBySlug(slug, 'explainer', locale)

  if (!page) {
    return { title: 'Page Not Found' }
  }

  // Resolve POS-backed price tokens in the title/meta before emitting metadata.
  const tokens = await getFactTokens(locale)
  const title = interpolateFacts(page.title, tokens)
  const description = page.meta_description
    ? interpolateFacts(page.meta_description, tokens)
    : undefined

  // Only emit hreflang when a translation actually exists — a lone
  // self-referential hreflang="en" cluster is audit noise and would
  // contradict the sitemap, which applies the same guard.
  const languages = getAlternates(`/guide/${slug}/`)
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: getCanonical(locale, `/guide/${slug}/`),
      type: 'article',
    },
    alternates: {
      canonical: getCanonical(locale, `/guide/${slug}/`),
      ...(Object.keys(languages).length > 1 ? { languages } : {}),
    },
  }
}

export default async function ExplainerPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const rawPage = await getSeoPageBySlug(slug, 'explainer', locale) as ExplainerSeoPage | null

  if (!rawPage) {
    notFound()
  }

  // Resolve POS-backed price tokens ({{lessonHourly}}, {{bayRateRange}}, …) so
  // both the JSON-LD and the rendered page reflect live pricing (or the pinned
  // fallbacks when the POS API is unreachable).
  const tokens = await getFactTokens(locale)
  const page = interpolateExplainerPage(rawPage, tokens)

  const jsonLd = getExplainerPageJsonLd({
    title: page.title,
    slug: page.slug,
    meta_description: page.meta_description,
    created_at: page.created_at,
    updated_at: page.updated_at,
    content: page.content,
  }, locale)

  const relatedLabels = await buildRelatedLabels(page.related_slugs, locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ExplainerPageComponent data={page} relatedLabels={relatedLabels} />
    </>
  )
}
