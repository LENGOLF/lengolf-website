import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import SectionWrapper from '@/components/shared/SectionWrapper'
import BookingCTA from '@/components/shared/BookingCTA'
import FaqSection from '@/components/shared/FaqSection'
import MenuImageCard from '@/components/shared/MenuImageCard'
import { storageUrl, SITE_URL, BUSINESS_INFO } from '@/lib/constants'
import { getSiteFacts } from '@/lib/site-facts'
import { getAlternates, getCanonical, OG_LOCALES, type Locale } from '@/lib/translated-routes'
import { getFoodMenuJsonLd, getFaqPageJsonLd, getBreadcrumbJsonLd } from '@/lib/jsonld'
import { menuGroups, menuImages, type MenuSection } from '@/data/food-menu'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Menu' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: getCanonical(locale, '/menu/'),
      languages: getAlternates('/menu/'),
    },
    openGraph: {
      images: [{ url: storageUrl('menus/food-drinks-cover.jpg'), alt: 'Food and drinks at LENGOLF Bangkok' }],
      locale: OG_LOCALES[locale as Locale] ?? OG_LOCALES.en,
    },
  }
}

const faqLinks = {
  'booking.len.golf': { href: 'https://booking.len.golf/', external: true },
  '@lengolf': { href: 'https://lin.ee/uxQpIXn', external: true },
  'events page': { href: '/events' },
  'bay rates page': { href: '/golf' },
}

// ── Row-level i18n key maps (English data in data/food-menu.ts → translated display) ──
const groupChipKeys: Record<string, string> = { food: 'chipFood', pizza: 'chipPizza', drinks: 'chipDrinks' }
const groupSubtitleKeys: Record<string, string> = {
  food: 'groupFoodSubtitle',
  pizza: 'groupPizzaSubtitle',
  drinks: 'groupDrinksSubtitle',
}
const sectionTitleKeys: Record<string, string> = {
  burgers: 'sectionBurgers',
  'butter-rolls': 'sectionButterRolls',
  appetizers: 'sectionAppetizers',
  toast: 'sectionToast',
  sliders: 'sectionSliders',
  salad: 'sectionSalad',
  pizzas: 'sectionPizzas',
  cocktails: 'sectionCocktails',
  highballs: 'sectionHighballs',
  beer: 'sectionBeer',
  wine: 'sectionWine',
  'non-alcoholic': 'sectionNonAlcoholic',
  snacks: 'sectionSnacks',
}
const sectionNoteKeys: Record<string, string> = {
  burgers: 'noteBurgers',
  sliders: 'noteSliders',
  'non-alcoholic': 'noteNonAlcoholic',
}
const printedMenuTitleKeys = ['printedFoodTitle', 'printedPizzaTitle', 'printedDrinksTitle']

function MenuSectionCard({ section }: { section: MenuSection }) {
  return (
    <div className="break-inside-avoid rounded-xl border border-primary/10 bg-white p-6 shadow-sm md:p-8">
      <h3 className="text-xl font-bold italic uppercase" style={{ color: '#007429' }}>
        {section.title}
      </h3>
      {section.note && <p className="mt-1 text-xs text-muted-foreground">{section.note}</p>}
      <ul className="mt-3 divide-y divide-border/60">
        {section.items.map((menuItem) => (
          <li key={menuItem.name} className="py-3">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-semibold text-foreground">{menuItem.name}</span>
              <span className="shrink-0 whitespace-nowrap text-sm font-bold" style={{ color: '#007429' }}>
                {menuItem.priceLabel}
              </span>
            </div>
            {menuItem.description && (
              <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{menuItem.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default async function MenuPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('Menu')
  const tContact = await getTranslations('ContactInfo')
  const facts = await getSiteFacts()
  const tFaq = await getTranslations('MenuFaq')

  // Build FAQ items from translations
  const faqItems = Array.from({ length: 8 }, (_, i) => ({
    question: tFaq(`q${i + 1}`),
    answer: tFaq(`a${i + 1}`),
  }))

  // Dish names, descriptions, and prices stay in English (they match the
  // printed menus at the bay); unit suffixes and the currency word localize.
  const translatePriceLabel = (label: string): string =>
    label
      .replace(' / bottle', t('unitPerBottle'))
      .replace(' / hour per person', t('unitPerHourPerPerson'))
      .replace(' THB', t('thbSuffix'))

  const translatedGroups = menuGroups.map((group) => ({
    ...group,
    title: t(groupChipKeys[group.id]),
    subtitle: t(groupSubtitleKeys[group.id]),
    sections: group.sections.map((section) => ({
      ...section,
      title: t(sectionTitleKeys[section.id]),
      ...(sectionNoteKeys[section.id] ? { note: t(sectionNoteKeys[section.id]) } : {}),
      items: section.items.map((menuItem) => ({ ...menuItem, priceLabel: translatePriceLabel(menuItem.priceLabel) })),
    })),
  }))

  // JSON-LD: menu offers stay sourced from the canonical English data; the
  // FAQ schema matches the on-page (translated) FAQ content.
  const menuJsonLd = getFoodMenuJsonLd(menuGroups)
  const faqJsonLd = getFaqPageJsonLd(faqItems)
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Food & Drinks Menu', url: `${SITE_URL}/menu/` },
  ])

  const stats = [
    { stat: t('stat1Value'), label: t('stat1Label') },
    { stat: t('stat2Value'), label: t('stat2Label') },
    { stat: t('stat3Value'), label: t('stat3Label') },
    { stat: t('stat4Value'), label: t('stat4Label') },
  ]

  const groupMeta: Record<string, { titlePrimary: string; titleSuffix: string; logo: string; logoAlt: string }> = {
    food: {
      titlePrimary: t('groupFoodTitle'),
      titleSuffix: t('groupFoodTitleSuffix'),
      logo: storageUrl('branding/partner-smith-co.png'),
      logoAlt: 'Smith & Co logo',
    },
    pizza: {
      titlePrimary: t('groupPizzaTitle'),
      titleSuffix: t('groupPizzaTitleSuffix'),
      logo: storageUrl('branding/partner-sexy-pizza.png'),
      logoAlt: 'Sexy Pizza logo',
    },
    drinks: {
      titlePrimary: t('groupDrinksTitle'),
      titleSuffix: t('groupDrinksTitleSuffix'),
      logo: storageUrl('branding/logo-avatar.png'),
      logoAlt: 'LENGOLF logo',
    },
  }

  const crossLinks = [
    { label: t('linkBayRates'), href: '/golf' },
    { label: t('linkEvents'), href: '/events' },
    { label: t('linkLessons'), href: '/lessons' },
    { label: t('linkActivities'), href: '/activities' },
  ]

  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* ── Hero ── */}
      <section className="relative flex h-[50vh] min-h-[400px] max-h-[550px] items-center text-white overflow-hidden">
        {/* Food photo: full-bleed on mobile, right half on desktop (source is 800px wide, so never stretch it full-bleed on desktop) */}
        <div className="absolute inset-0 md:left-1/2">
          <Image
            src={storageUrl('menus/food-drinks-cover.jpg')}
            alt="Smith & Co smash burger, katsu sandwich, and calamari served at LENGOLF Bangkok"
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        {/* Mobile: green wash over the photo */}
        <div className="absolute inset-0 md:hidden" style={{ background: 'linear-gradient(180deg, rgba(0,64,37,0.78) 0%, rgba(0,90,50,0.55) 100%)' }} />
        {/* Desktop: solid brand panel on the left, blending into the photo */}
        <div className="absolute inset-y-0 left-0 hidden w-1/2 md:block" style={{ background: 'linear-gradient(135deg, #004025 0%, #005a32 100%)' }} />
        <div className="absolute inset-y-0 left-1/2 hidden w-40 md:block" style={{ background: 'linear-gradient(90deg, #005a32 0%, rgba(0,90,50,0) 100%)' }} />
        <div className="relative z-10 w-full text-left md:w-1/2" style={{ paddingLeft: '4%', paddingRight: '4%' }}>
          <span
            className="inline-block rounded px-6 py-2 text-lg font-bold uppercase tracking-widest text-white mb-5 md:text-xl"
            style={{ backgroundColor: '#7CB342' }}
          >
            {t('heroBadge')}
          </span>
          <h1 className="mb-4 text-5xl font-black uppercase leading-none md:text-6xl lg:text-7xl">
            {t('heroTitle')}
          </h1>
          <p className="text-base font-semibold italic tracking-wide text-white/90 md:text-lg">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* ── Intro + Stats ── */}
      <SectionWrapper>
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            {t('introText', { address: tContact('address'), hours: facts.openingHours })}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-4">
                <div className="text-xl font-bold sm:text-2xl" style={{ color: '#007429' }}>{item.stat}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {translatedGroups.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm font-medium text-[#007429] transition-colors hover:bg-primary hover:text-white"
              >
                {group.title}
              </a>
            ))}
            <BookingCTA />
          </div>
        </div>
      </SectionWrapper>

      {/* ── Menu groups ── */}
      {translatedGroups.map((group, groupIndex) => (
        <section
          key={group.id}
          id={group.id}
          className="py-16 lg:py-24"
          style={groupIndex % 2 === 0 ? { backgroundColor: '#F6FFFA' } : undefined}
        >
          <div className="section-max-width section-padding">
            <div className="mb-5 flex justify-center">
              <Image
                src={groupMeta[group.id].logo}
                alt={groupMeta[group.id].logoAlt}
                width={512}
                height={512}
                className="h-16 w-16 rounded-2xl border border-border/60 object-cover shadow-sm md:h-20 md:w-20"
              />
            </div>
            <h2 className="mb-3 text-center text-3xl font-bold italic lg:text-4xl">
              <span style={{ color: '#007429' }}>{groupMeta[group.id].titlePrimary}</span>{' '}
              <span className="text-foreground">{groupMeta[group.id].titleSuffix}</span>
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-muted-foreground">{group.subtitle}</p>
            <div className={group.sections.length === 1 ? 'mx-auto max-w-2xl' : 'mx-auto max-w-5xl columns-1 gap-6 space-y-6 md:columns-2'}>
              {group.sections.map((section) => (
                <MenuSectionCard key={section.id} section={section} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── Book Now CTA ── */}
      <section className="py-12 lg:py-16 bg-primary">
        <div className="section-max-width section-padding text-center">
          <h2 className="mb-3 text-2xl font-bold text-white lg:text-3xl">{t('ctaTitle')}</h2>
          <p className="mb-6 text-white/80">
            {t('ctaSubtitle')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <BookingCTA className="bg-white text-primary hover:bg-white/90" />
            <a
              href="https://lin.ee/uxQpIXn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-md border-2 border-white px-8 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              LINE @lengolf
            </a>
          </div>
        </div>
      </section>

      {/* ── Printed menus ── */}
      <SectionWrapper>
        <h2 className="mb-3 text-center text-3xl font-bold italic lg:text-4xl">
          <span style={{ color: '#007429' }}>{t('printedTitle')}</span>{' '}
          <span className="text-foreground">{t('printedTitleSuffix')}</span>
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-muted-foreground">
          {t('printedSubtitle')}
        </p>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
          {menuImages.map((img, i) => (
            <MenuImageCard
              key={img.src}
              src={img.src}
              alt={img.alt}
              title={t(printedMenuTitleKeys[i])}
              width={img.width}
              height={img.height}
              previewPosition={img.previewPosition}
            />
          ))}
        </div>
      </SectionWrapper>

      {/* ── FAQ ── */}
      <FaqSection
        items={faqItems}
        links={faqLinks}
        title={t('faqTitle')}
        titleSuffix={t('faqTitleSuffix')}
        bgColor="#F6FFFA"
      />

      {/* ── Cross-links ── */}
      <section className="py-16 lg:py-24">
        <div className="section-max-width section-padding">
          <h2 className="mb-3 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('crossLinksTitle')}</span>{' '}
            <span className="text-foreground">{t('crossLinksTitleSuffix')}</span>
          </h2>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            {t('crossLinksSubtitle')}
          </p>
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {crossLinks.map((link) => (
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
        </div>
      </section>
    </>
  )
}
