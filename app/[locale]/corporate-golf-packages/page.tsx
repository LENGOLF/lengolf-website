import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import SectionWrapper from '@/components/shared/SectionWrapper'
import FaqSection from '@/components/shared/FaqSection'
import BookingCTA from '@/components/shared/BookingCTA'
import EventInquiryForm from '@/components/events/EventInquiryForm'
import { SITE_URL, BUSINESS_INFO, storageUrl } from '@/lib/constants'
import { getEventPackagesData } from '@/data/pricing'
import {
  getEventsPricingJsonLd,
  getEventsServiceJsonLd,
  getFaqPageJsonLd,
  getBreadcrumbJsonLd,
} from '@/lib/jsonld'
import { siteOpenGraph } from '@/lib/open-graph'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const prefix = locale === 'en' ? '' : `/${locale}`
  // Live catalog price so the description can't drift from the rendered package cards.
  const { eventPackages } = await getEventPackagesData()
  const startingBaht = toBaht(findPackagePrice(eventPackages, 'Small Package') ?? '9,999 THB')
  return {
    // Layout applies the "%s | LENGOLF" template, so the brand is appended automatically.
    title: 'Corporate Golf Packages Bangkok: Team Building',
    description: `Private corporate golf packages in Bangkok from ${startingBaht}: indoor simulator bays, full bar and catering for groups of 10–50+. Central at BTS Chidlom, no weather risk.`,
    alternates: {
      canonical: `${SITE_URL}${prefix}/corporate-golf-packages/`,
    },
    openGraph: siteOpenGraph({ images: [{ url: storageUrl('events/event-01.jpg'), alt: 'Corporate event at LENGOLF indoor golf' }] }),
  }
}

function findPackagePrice(packages: { name: string; price: string }[], name: string): string | undefined {
  return packages.find((p) => p.name === name)?.price
}

// "9,999 THB" → "฿9,999"
function toBaht(price: string): string {
  return `฿${price.replace(/\s*THB$/i, '').trim()}`
}

const faqLinks: Record<string, { href: string; external?: boolean }> = {
  '@lengolf': { href: 'https://lin.ee/uxQpIXn', external: true },
  'Google Maps': { href: BUSINESS_INFO.googleMapsUrl, external: true },
}

// Transactional FAQ block — every question maps to a query in the target cluster
// (cost, group size, non-golfers, lead time, catering, team building). Answers are
// sourced from data/pricing.ts (eventPackages / amenities) and the /events content.
// Prices are interpolated from the live catalog so they can't drift from the cards.
const buildFaqItems = (smallPrice: string, mediumPrice: string) => [
  {
    question: 'How much does a corporate golf package cost in Bangkok?',
    answer: `Corporate golf packages at LENGOLF start at ${smallPrice} for the Small Package (10–15 guests, 2 golf bays, 3 hours) and ${mediumPrice} for the Medium Package (15–25 guests, all 4 golf bays, 3 hours, exclusive full-location rental). Both include beer, cocktails, unlimited soft drinks, and a catered food spread. For larger groups we build fully custom quotes.`,
  },
  {
    question: 'How many people can you host for a corporate event?',
    answer:
      'Our venue comfortably hosts up to 50+ guests across 4 golf simulator bays, a full bar, and flexible seating. The Small Package suits 10–15 people, the Medium Package 15–25, and we create custom packages for larger corporate groups.',
  },
  {
    question: 'Do guests need golf experience or is this good for non-golfers?',
    answer:
      'No experience needed: the simulators are fun for complete beginners and experienced golfers alike. We run games like closest to the pin and longest drive that anyone can enjoy, and our golf pros can give mini-lessons and tips during your event, which makes it an easy team-building activity for mixed groups.',
  },
  {
    question: 'How far in advance should we book a corporate event?',
    answer:
      'The sooner the better, especially for the Medium Package with exclusive full-location rental and for peak dates. Send us your preferred date through the inquiry form on this page or message us on LINE @lengolf, and our events team will confirm availability and lock in your booking.',
  },
  {
    question: 'Can you cater food and drinks for the group?',
    answer:
      'Yes. Standard packages include curated food platters from Smith & Co. (and Pizza Mania on the Medium Package) plus beer, cocktails, and unlimited soft drinks. All food and drink options can be fully customized to suit dietary requirements and your event theme, and add-ons like a sound system and DJ are available.',
  },
  {
    question: 'What makes LENGOLF good for corporate team building?',
    answer:
      'You get a private indoor venue in central Bangkok (directly accessible from BTS Chidlom) with no weather risk, air-conditioned comfort, competitive golf games that get everyone involved, and food and drinks in one place. It works for corporate events, company parties, team building, and client meet-and-greets.',
  },
  {
    question: 'Where is LENGOLF located?',
    answer:
      "We're on the 4th floor of The Mercury Ville at BTS Chidlom, 540 Ploenchit Road, Lumpini, Pathumwan, Bangkok 10330, directly accessible from the BTS Chidlom Skytrain station. See us on Google Maps.",
  },
]

export default async function CorporateGolfPackagesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const { eventPackages, eventPackageNotes } = await getEventPackagesData()

  const faqItems = buildFaqItems(
    findPackagePrice(eventPackages, 'Small Package') ?? '9,999 THB',
    findPackagePrice(eventPackages, 'Medium Package') ?? '21,999 THB'
  )

  const pricingJsonLd = getEventsPricingJsonLd(eventPackages)
  // Corporate-specific Service entity so this URL and /events don't publish
  // byte-identical schema for two distinct pages.
  const serviceJsonLd = {
    ...getEventsServiceJsonLd(),
    name: 'Corporate Golf Events & Team Building at LENGOLF',
    description:
      'Corporate golf packages and team-building hosting at LENGOLF Bangkok: private indoor golf simulator bays with a full bar, catered food, and full-venue rental options.',
    url: `${SITE_URL}/corporate-golf-packages/`,
  }
  const faqJsonLd = getFaqPageJsonLd(faqItems)
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Corporate Golf Packages', url: `${SITE_URL}/corporate-golf-packages/` },
  ])

  const startingPrice = findPackagePrice(eventPackages, 'Small Package') ?? '9,999 THB'
  const startingPriceBaht = toBaht(startingPrice)

  // Facts sourced from data/pricing.ts (amenities / eventPackages) and /events content.
  const includedItems = [
    'Private indoor simulator bays with golf club rental included',
    'Full bar: beer, cocktails, and unlimited soft drinks',
    'Customizable catering by Smith & Co. (and Pizza Mania on the Medium Package)',
    'Up to 4 golf bays and seating for 50+ guests',
    'Large putting green and full-venue rental option',
    'Central BTS Chidlom location: air-conditioned, no weather risk',
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* ── Hero ── */}
      <section
        className="flex items-center text-white"
        style={{
          background: 'linear-gradient(135deg, #003d1f 0%, #005a32 50%, #007429 100%)',
          minHeight: '340px',
          padding: '64px 6% 56px',
        }}
      >
        <div className="w-full max-w-4xl">
          <span
            className="inline-block rounded px-5 py-1.5 text-sm font-bold uppercase tracking-widest text-white mb-4"
            style={{ backgroundColor: '#7CB342' }}
          >
            Corporate Events
          </span>
          <h1 className="text-4xl font-black uppercase leading-tight md:text-5xl lg:text-6xl mb-4">
            Corporate Golf Packages<br />
            <span style={{ color: '#c8a96e' }}>in Bangkok</span>
          </h1>
          <p className="text-base text-white/85 max-w-2xl mb-8 md:text-lg">
            Host your team at a private indoor golf venue in the heart of Bangkok. Simulator bays,
            a full bar, and catered food under one roof at BTS Chidlom: no travel, no weather risk,
            and no golf experience required.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#inquire"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-white px-8 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
            >
              Get a Package Quote
            </a>
            <a
              href="https://lin.ee/uxQpIXn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-md border-2 border-white px-8 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Chat on LINE @lengolf
            </a>
          </div>
        </div>
      </section>

      {/* ── Stat chips ── */}
      <SectionWrapper>
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: '50+', label: 'Guests hosted' },
              { value: '4', label: 'Simulator bays' },
              { value: startingPriceBaht, label: 'Packages from' },
              { value: 'BTS Chidlom', label: 'Central location' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-primary/15 bg-primary/5 px-4 py-4 text-center">
                <div className="text-xl font-bold md:text-2xl" style={{ color: '#007429' }}>{stat.value}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ── Packages ── */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <h2 className="mb-4 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>Corporate</span>{' '}
            <span className="text-foreground">Package Options</span>
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-sm text-muted-foreground md:text-base">
            Two ready-made packages cover most team sizes. Need something bigger or longer? We build
            fully custom corporate quotes. Just ask.
          </p>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {eventPackages.map((pkg) => (
              <div
                key={pkg.name}
                className="flex flex-col rounded-xl border bg-white p-7 shadow-sm"
                style={pkg.exclusive ? { borderColor: '#c8a96e', borderWidth: '2px' } : undefined}
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <h3 className="text-xl font-bold" style={{ color: '#007429' }}>{pkg.name}</h3>
                  {pkg.exclusive && (
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
                      style={{ backgroundColor: '#c8a96e' }}
                    >
                      Full venue
                    </span>
                  )}
                </div>
                <div className="mb-5 text-3xl font-black text-foreground">{pkg.price}</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><span className="font-semibold text-foreground">{pkg.guests}</span></li>
                  <li>{pkg.bays} · {pkg.duration}</li>
                  <li>{pkg.beers}</li>
                  <li>{pkg.cocktails} · {pkg.softDrinks}</li>
                  <li>Catered food by {pkg.caterer}</li>
                  {pkg.exclusive && <li className="font-medium" style={{ color: '#007429' }}>Exclusive full-location rental</li>}
                </ul>
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Food spread</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{pkg.food.join(' · ')}</p>
                </div>
                <a
                  href="#inquire"
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
                >
                  Inquire about this package
                </a>
              </div>
            ))}
          </div>
          <ul className="mx-auto mt-8 max-w-2xl space-y-1 text-center text-xs text-muted-foreground">
            {eventPackageNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── What's included ── */}
      <SectionWrapper>
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>What&apos;s</span>{' '}
            <span className="text-foreground">Included</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {includedItems.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg border border-primary/15 bg-primary/5 px-5 py-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007429" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                <p className="text-sm text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ── Team building angle ── */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-4 text-center text-3xl font-bold italic lg:text-4xl">
              <span style={{ color: '#007429' }}>Team Building</span>{' '}
              <span className="text-foreground">Everyone Can Play</span>
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-muted-foreground md:text-base">
              A great corporate event gets the whole team involved, not just the golfers. Our simulators
              turn into an easy, competitive activity for any skill level.
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                {
                  title: 'No experience needed',
                  body: 'Beginners and pros play side by side. Games like closest to the pin and longest drive keep everyone competing and cheering.',
                },
                {
                  title: 'Golf pros on hand',
                  body: 'Our coaches can run mini-lessons and tips during your event, so first-timers feel confident within minutes.',
                },
                {
                  title: 'Food, drinks, one room',
                  body: 'A full bar and catered food keep the group together between rounds, ideal for company parties, meet-and-greets, and team socials.',
                },
              ].map((card) => (
                <div key={card.title} className="rounded-xl border border-primary/15 bg-white p-6">
                  <h3 className="mb-2 font-bold text-foreground">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FaqSection items={faqItems} links={faqLinks} title="Corporate Golf" titleSuffix="FAQs" />

      {/* ── Inquiry form ── */}
      <SectionWrapper id="inquire">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-3 text-center text-3xl font-bold italic lg:text-4xl">
            <span style={{ color: '#007429' }}>Request</span>{' '}
            <span className="text-foreground">Your Quote</span>
          </h2>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            Tell us your group size and preferred date. Our events team will reply with a tailored corporate package.
          </p>
          <EventInquiryForm pageSource="corporate-golf-packages" />
        </div>
      </SectionWrapper>

      {/* ── CTA band ── */}
      <section className="py-12 lg:py-16 bg-primary">
        <div className="section-max-width section-padding text-center">
          <h2 className="mb-3 text-2xl font-bold text-white lg:text-3xl">Plan Your Corporate Event</h2>
          <p className="mb-6 text-white/80">
            Open daily 9am–11pm · Floor 4, Mercury Ville, BTS Chidlom. Prefer to see the venue first?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#inquire"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-white px-8 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
            >
              Get a Package Quote
            </a>
            <BookingCTA text="Book a Bay" className="bg-transparent border-2 border-white text-white hover:bg-white/10" />
          </div>
        </div>
      </section>

      {/* ── Internal links ── */}
      <section className="py-12 lg:py-16" style={{ backgroundColor: '#F6FFFA' }}>
        <div className="section-max-width section-padding text-center">
          <h2 className="mb-6 text-xl font-semibold" style={{ color: '#005a32' }}>
            Explore more
          </h2>
          <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-3">
            {[
              { label: 'Events & Parties', href: '/events' },
              { label: 'Corporate Golf Events Guide', href: '/guide/corporate-golf-events-bangkok' },
              { label: 'Best Corporate Event Venues', href: '/best/best-corporate-event-venues-bangkok' },
              { label: 'Best Team Building Activities', href: '/best/best-team-building-activities-bangkok' },
              { label: 'Corporate Golf Event Cost', href: '/cost/corporate-golf-event-cost-bangkok' },
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
