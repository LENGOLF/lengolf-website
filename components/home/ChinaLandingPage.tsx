import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { CalendarDays, MessageCircle, MapPin, Clock, Sparkles, ExternalLink } from 'lucide-react'
import FaqSection from '@/components/shared/FaqSection'
import { getFaqPageJsonLd } from '@/lib/jsonld'
import { getLessonPricingData, getLessonPriceFacts } from '@/data/pricing'
import { getApproxCurrency } from '@/lib/currency-rates'
import {
  storageUrl,
  BOOKING_URL,
  SOCIAL_LINKS,
  BUSINESS_INFO,
} from '@/lib/constants'

const FAQ_COUNT = 7

const faqLinks: Record<string, { href: string; external?: boolean }> = {
  '@lengolf': { href: SOCIAL_LINKS.line, external: true },
  'LINE @lengolf': { href: SOCIAL_LINKS.line, external: true },
  'booking.len.golf': { href: BOOKING_URL, external: true },
}

export default async function ChinaLandingPage() {
  const t = await getTranslations('HomeZh')
  // The lessons card leads with the free trial and quotes the same per-hour
  // figures as /lessons/ (getLessonPriceFacts), never a typed price.
  const { lessonPricing } = await getLessonPricingData()
  const lesson = getLessonPriceFacts(lessonPricing)
  // Digits only (e.g. "7,920"): the card's message adds its own currency
  // word, as the sibling cards write theirs.
  const hourlyLocal = (getApproxCurrency(lesson.hourlyThb, 'zh') ?? '').replace(/[^\d,]/g, '')
  const lessonValues = { ...lesson, hourlyLocal }

  const trustChips = [
    {
      text: t('trustChipRating', { rating: BUSINESS_INFO.googleRating.toFixed(1), count: BUSINESS_INFO.googleReviewCount.toString() }),
    },
    { text: t('trustChipLanguage') },
    { text: t('trustChipBts') },
    { text: t('trustChipClubs') },
  ]

  const whyCards = [
    { title: t('why1Title'), desc: t('why1Desc'), image: storageUrl('clubs/premium-plus/2.png') },
    { title: t('why2Title'), desc: t('why2Desc'), image: storageUrl('venue/venue-interior-01.jpg') },
    { title: t('why3Title'), desc: t('why3Desc'), image: storageUrl('venue/venue-bay-01.jpg') },
  ]

  const steps = [
    { label: t('step1Label'), title: t('step1Title'), desc: t('step1Desc') },
    { label: t('step2Label'), title: t('step2Title'), desc: t('step2Desc') },
    { label: t('step3Label'), title: t('step3Title'), desc: t('step3Desc') },
  ]

  const services = [
    {
      title: t('service1Title'),
      price: t('service1Price'),
      priceApprox: t('service1PriceApprox'),
      desc: t('service1Desc'),
      href: '/golf',
      image: storageUrl('venue/venue-simulator-01.jpg'),
    },
    {
      title: t('service2Title'),
      price: t('service2Price'),
      priceApprox: t('service2PriceApprox', lessonValues),
      desc: t('service2Desc', lessonValues),
      href: '/lessons',
      image: storageUrl('lessons/lessons-cover.jpg'),
    },
    {
      title: t('service3Title'),
      price: t('service3Price'),
      priceApprox: t('service3PriceApprox'),
      desc: t('service3Desc'),
      href: '/golf-course-club-rental',
      image: storageUrl('golf/hero-course-rental.webp'),
    },
    {
      title: t('service4Title'),
      price: t('service4Price'),
      priceApprox: t('service4PriceApprox'),
      desc: t('service4Desc'),
      href: '/events',
      image: storageUrl('events/event-01.jpg'),
    },
  ]

  const faqItems = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    question: t(`q${i + 1}`),
    answer: t(`a${i + 1}`),
  }))
  const faqJsonLd = getFaqPageJsonLd(faqItems)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* ── 1. Hero ── */}
      <section className="relative flex items-start pt-10 pb-10 text-white overflow-hidden md:items-center md:py-20">
        <Image
          src={storageUrl('venue/venue-simulator-01.jpg')}
          alt="LENGOLF indoor golf simulator bay in Bangkok"
          fill
          className="object-cover object-center"
          priority
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(0,90,50,0.75) 0%, rgba(0,122,69,0.55) 45%, rgba(0,90,50,0.40) 100%)' }}
        />
        <div className="relative z-10 w-full text-left" style={{ paddingLeft: '4%', paddingRight: '4%' }}>
          <div className="mx-auto max-w-5xl">
            <span className="inline-flex items-center gap-1.5 rounded bg-white/20 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm mb-5">
              <MessageCircle size={14} />
              {t('heroBadge')}
            </span>
            <h1 className="mb-4 text-4xl font-black leading-tight md:text-5xl lg:text-6xl max-w-3xl">
              {t('heroTitle')}
            </h1>
            <p className="text-base leading-relaxed text-white/90 md:text-lg mb-7 max-w-2xl">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center gap-2.5 rounded-lg bg-white px-8 text-base font-extrabold text-[#005a32] shadow-lg transition-all hover:scale-105 hover:shadow-xl md:text-lg"
              >
                <CalendarDays size={18} />
                {t('heroBookBay')}
              </a>
              <a
                href={SOCIAL_LINKS.line}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center gap-2.5 rounded-lg border-2 border-white bg-transparent px-8 text-base font-bold text-white transition-colors hover:bg-white/10 md:text-lg"
              >
                <MessageCircle size={18} />
                {t('heroLineContact')}
              </a>
            </div>
            <p className="mt-3 text-sm text-white/70">{t('heroCancellation')}</p>
          </div>
        </div>
      </section>

      {/* ── 2. Trust chip strip ── */}
      <section className="border-y border-border/60 bg-white py-6">
        <div className="section-max-width section-padding">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {trustChips.map((chip, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary"
              >
                {chip.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Why LENGOLF for CN travelers ── */}
      <section className="py-16 lg:py-24">
        <div className="section-max-width section-padding">
          <h2 className="mb-12 text-center text-3xl font-bold italic lg:text-4xl">
            <span className="text-foreground">{t('whyTitle')}</span>{' '}
            <span style={{ color: '#007429' }}>{t('whyTitleSuffix')}</span>
          </h2>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            {whyCards.map((card, i) => (
              <article
                key={i}
                className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image src={card.image} alt={card.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="flex-1 p-6">
                  <h3 className="mb-3 text-lg font-bold" style={{ color: '#007429' }}>{card.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. How to use LENGOLF during a Thailand golf trip ── */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <h2 className="mb-3 text-center text-3xl font-bold italic lg:text-4xl">
            <span className="text-foreground">{t('howTitle')}</span>{' '}
            <span style={{ color: '#007429' }}>{t('howTitleSuffix')}</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground md:text-base">
            {t('howSubtitle')}
          </p>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={i} className="relative rounded-2xl border border-primary/15 bg-white p-6 shadow-sm">
                <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide" style={{ color: '#007429' }}>
                  <Sparkles size={12} />
                  {step.label}
                </span>
                <h3 className="mb-2 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Services grid ── */}
      <section className="py-16 lg:py-24">
        <div className="section-max-width section-padding">
          <h2 className="mb-12 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('servicesTitle')}</span>{' '}
            <span className="text-foreground">{t('servicesTitleSuffix')}</span>
          </h2>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
            {services.map((s, i) => (
              <Link
                key={i}
                href={s.href}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition-all hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image src={s.image} alt={s.title} fill className="object-cover transition-transform group-hover:scale-105" sizes="(max-width: 640px) 100vw, 50vw" />
                </div>
                <div className="flex-1 p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{s.title}</h3>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      {t('serviceViewMore')}
                      <ExternalLink size={12} />
                    </span>
                  </div>
                  <div className="mb-3 flex items-baseline gap-2">
                    <span className="text-base font-bold" style={{ color: '#007429' }}>{s.price}</span>
                    <span className="text-xs text-muted-foreground">{s.priceApprox}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CN tourist FAQ ── */}
      <FaqSection
        items={faqItems}
        links={faqLinks}
        title={t('faqTitle')}
        titleSuffix={t('faqTitleSuffix')}
        bgColor="#ffffff"
      />

      {/* ── 8. Access ── */}
      <section className="py-16 lg:py-20">
        <div className="section-max-width section-padding">
          <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>{t('accessTitle')}</span>{' '}
            <span className="text-foreground">{t('accessTitleSuffix')}</span>
          </h2>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-primary/15 bg-white p-6">
              <div className="mb-3 flex items-start gap-3">
                <MapPin className="mt-0.5 shrink-0 text-primary" size={18} />
                <div>
                  <p className="text-sm font-bold text-foreground">{t('accessAddressLabel')}</p>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {t('accessAddress')}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-primary/15 bg-white p-6">
              <div className="mb-3 flex items-start gap-3">
                <Clock className="mt-0.5 shrink-0 text-primary" size={18} />
                <div>
                  <p className="text-sm font-bold text-foreground">{t('accessHoursLabel')}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t('accessHours')}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-primary/15 bg-white p-6">
              <div className="mb-3 flex items-start gap-3">
                <MapPin className="mt-0.5 shrink-0 text-primary" size={18} />
                <div>
                  <p className="text-sm font-bold text-foreground">{t('accessBtsLabel')}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t('accessBts')}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-primary/15 bg-white p-6">
              <div className="mb-3 flex items-start gap-3">
                <MapPin className="mt-0.5 shrink-0 text-primary" size={18} />
                <div>
                  <p className="text-sm font-bold text-foreground">{t('accessNearbyLabel')}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t('accessNearby')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <a
              href={BUSINESS_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <MapPin size={14} />
              {t('accessMapCta')}
            </a>
          </div>
        </div>
      </section>

      {/* ── 9. Final CTA ── */}
      <section className="py-14 lg:py-16 bg-primary">
        <div className="section-max-width section-padding text-center">
          <h2 className="mb-3 text-2xl font-bold text-white lg:text-3xl">{t('ctaTitle')}</h2>
          <p className="mb-6 text-white/85">{t('ctaSubtitle')}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-white px-8 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ color: '#005a32' }}
            >
              <CalendarDays size={16} />
              {t('ctaBook')}
            </a>
            <a
              href={SOCIAL_LINKS.line}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-md border-2 border-white px-8 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <MessageCircle size={16} />
              {t('ctaLine')}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
