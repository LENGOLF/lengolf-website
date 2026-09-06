import { getTranslations } from 'next-intl/server'
import { MapPin, ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { REGION_META } from '@/lib/golf-courses'
import { getRegionHubTranslation } from '@/data/golf-courses-i18n'

/**
 * Localized grid of links into every regional golf-course hub
 * (`/golf-courses/<region>`). Rendered on the homepage and `/golf/` so those
 * high-authority pages feed internal-link equity into the region hubs, which
 * sit around search position 10-11 and gain more from links off strong pages
 * than from yet more course pages (the GSC read behind this batch).
 *
 * Every string reuses the already-translated, SSG-guarded `GolfCourseHub`
 * namespace and the per-region labels in `data/golf-courses-i18n.ts`, so this
 * ships correct in all five locales with NO new copy to translate. The homepage
 * body reaches only en/th (ja/ko/zh return bespoke landing pages before it),
 * while `/golf/` reaches all five — both are covered because the source strings
 * exist for all five.
 *
 * Regions are rendered ungated, mirroring the hub page's own region cards: all
 * 14 regions are translated in every locale, so no `hasTranslationForLocale`
 * gate is needed. `setRequestLocale` is called by both host pages, so the
 * request-scoped `getTranslations('GolfCourseHub')` resolves the right locale.
 */
export default async function RegionHubLinks({ locale }: { locale: string }) {
  const t = await getTranslations('GolfCourseHub')
  const regionSlugs = Object.keys(REGION_META) as Array<keyof typeof REGION_META>

  // Biggest hubs first, so a reader scanning the grid meets Bangkok/Pattaya
  // before the single-course regions. courseCount is the same field the hub
  // cards and the region-count ICU plural read.
  const ordered = [...regionSlugs].sort(
    (a, b) => REGION_META[b].courseCount - REGION_META[a].courseCount,
  )
  const totalCourses = regionSlugs.reduce(
    (sum, slug) => sum + REGION_META[slug].courseCount,
    0,
  )

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
          {t('heroEyebrow')}
        </p>
        <h2 className="text-3xl font-bold italic lg:text-4xl">
          <span style={{ color: '#005a32' }}>{t('heroHeading')}</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t('heroIntro', { courseCount: totalCourses, regionCount: regionSlugs.length })}
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {ordered.map((slug) => {
          const tr = getRegionHubTranslation(slug, locale)
          return (
            <li key={slug}>
              <Link
                href={`/golf-courses/${slug}`}
                className="group flex h-full flex-col rounded-xl border border-border bg-white px-4 py-3 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 shrink-0 text-primary" aria-hidden="true" />
                  <span className="truncate text-sm font-bold text-foreground group-hover:text-primary">
                    {tr?.label ?? REGION_META[slug].label}
                  </span>
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {t.rich('coursesCount', {
                    count: REGION_META[slug].courseCount,
                    muted: (chunks) => <span>{chunks}</span>,
                  })}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="mt-8 text-center">
        <Link
          href="/golf-courses"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          {t('viewAll')}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
