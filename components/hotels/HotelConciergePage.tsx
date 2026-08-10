// Locale-aware Link: a bare next/link drops the locale prefix, so every
// "Explore More" card on the 48 translated pages exited to English.
import { Link } from '@/i18n/navigation'
import { ArrowRight, Check, MapPin, Clock, Star, Utensils, Navigation, Calendar } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { buildRelatedLabels } from '@/lib/seo-links'
import { getSiteFacts, money } from '@/lib/site-facts'
import { BOOKING_URL, BUSINESS_INFO, SOCIAL_LINKS } from '@/lib/constants'
import type { HotelConciergeSeoPage } from '@/types/seo-pages'

interface Props {
  data: HotelConciergeSeoPage
}

function renderStars(count: number) {
  return Array.from({ length: count }, (_, i) => (
    <Star key={i} className="h-4 w-4 fill-[#d4a843] text-[#d4a843]" />
  ))
}

export default async function HotelConciergePage({ data }: Props) {
  const { content } = data
  const locale = data.locale

  const [t, facts, relatedLabels] = await Promise.all([
    getTranslations('HotelConciergePage'),
    getSiteFacts(),
    buildRelatedLabels(data.related_slugs, data.locale),
  ])

  // Bay rate and bay capacity come from the POS-backed facts, not from the
  // catalogs — a price baked into five message files is five places to drift.
  const bayFrom = money(locale, facts.bayHourlyMin)
  // Premium club rental has no SiteFacts field yet (only courseRentalDay), so
  // it stays a literal here — one place, not five. Corroborated across
  // data/pricing.ts ("from 150 THB per hour").
  const premiumClubFrom = money(locale, 150)

  return (
    <div className="hotel-concierge-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a472a] to-[#2d6a4f] py-16 md:py-24 text-white">
        <div className="mx-auto max-w-[900px] px-5">
          <p className="text-sm font-medium uppercase tracking-wider text-[#d4a843] mb-4">
            {t('eyebrow')}
          </p>
          <h1 className="text-3xl font-bold md:text-5xl mb-4">{data.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-8 text-white/80">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{t('distanceFromLengolf', { distance: content.hotel_distance_m })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{t('minWalk', { mins: content.walking_time_mins })}</span>
            </div>
            <div className="flex items-center gap-1">
              {renderStars(content.hotel_star_rating)}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#d4a843] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#c49a3a]"
            >
              {t('bookABay')}
            </a>
            <a
              href={SOCIAL_LINKS.line}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t('lineUs')}
            </a>
          </div>
        </div>
      </section>

      {/* Walking Directions */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[900px] px-5">
          <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-4">
            <Navigation className="inline h-6 w-6 mr-2 text-[#2d6a4f]" />
            {t('walkHeading')}
          </h2>
          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f5e9] text-[#2d6a4f] font-bold text-xs">
                {t('minsBadge', { mins: content.walking_time_mins })}
              </div>
              <div>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {content.walking_directions}
                </p>
                <p className="mt-3 text-sm font-medium text-[#2d6a4f]">
                  {t('distanceLine', { distance: content.hotel_distance_m, mins: content.walking_time_mins })}
                </p>
              </div>
            </div>
          </div>

          {/* Google Maps Embed */}
          {content.google_maps_embed && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-[#1a472a] mb-4">{t('mapHeading')}</h3>
              <div className="rounded-xl overflow-hidden border">
                <iframe
                  src={content.google_maps_embed}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t('mapTitle', { hotel: content.hotel_name })}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why LENGOLF Section */}
      <section className="py-12 md:py-16 bg-[#f8f9fa]">
        <div className="mx-auto max-w-[900px] px-5">
          <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-4">
            {t('whyHeading')}
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg mb-6">
            {t('whyBody', {
              mins: content.walking_time_mins,
              hotel: content.hotel_name,
              rate: bayFrom,
              n: facts.maxPlayersPerBay,
            })}
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full bg-[#e8f5e9] px-4 py-2 text-sm text-[#2d6a4f]">
              <Check className="h-4 w-4" />
              {t('pillRate', { rate: bayFrom, n: facts.maxPlayersPerBay })}
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[#e8f5e9] px-4 py-2 text-sm text-[#2d6a4f]">
              <Check className="h-4 w-4" />
              {t('pillLocation')}
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[#e8f5e9] px-4 py-2 text-sm text-[#2d6a4f]">
              <Check className="h-4 w-4" />
              {t('pillComfort')}
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[#e8f5e9] px-4 py-2 text-sm text-[#2d6a4f]">
              <Check className="h-4 w-4" />
              {t('pillClubs', { rate: premiumClubFrom })}
            </div>
          </div>
        </div>
      </section>

      {/* Is This Walkable? */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-[900px] px-5">
          <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-4">
            {t('walkableHeading', { hotel: content.hotel_name })}
          </h2>
          <div className="rounded-xl border bg-white p-6">
            {content.hotel_distance_m <= 500 ? (
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-[#1a472a]">{t('walkableNearLead')}</strong>{' '}
                {t('walkableNearBody', {
                  distance: content.hotel_distance_m,
                  mins: content.walking_time_mins,
                  hotel: content.hotel_name,
                })}
              </p>
            ) : content.hotel_distance_m <= 800 ? (
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-[#1a472a]">{t('walkableMidLead')}</strong>{' '}
                {t('walkableMidBody', {
                  distance: content.hotel_distance_m,
                  mins: content.walking_time_mins,
                  hotel: content.hotel_name,
                })}
              </p>
            ) : (
              <p className="text-base leading-relaxed text-muted-foreground">
                <strong className="text-[#1a472a]">{t('walkableFarLead')}</strong>{' '}
                {t('walkableFarBody', {
                  distance: content.hotel_distance_m,
                  mins: content.walking_time_mins,
                })}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Area Guide — unique per hotel */}
      {content.area_guide && (
        <section className="py-12 md:py-16 bg-[#f8f9fa]">
          <div className="mx-auto max-w-[900px] px-5">
            <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-4">
              <MapPin className="inline h-6 w-6 mr-2 text-[#2d6a4f]" />
              {t('areaHeading', { hotel: content.hotel_name })}
            </h2>
            <div className="rounded-xl border bg-white p-6 md:p-8">
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                {content.area_guide}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Suggested Itinerary — unique per hotel */}
      {content.suggested_itinerary && content.suggested_itinerary.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-[900px] px-5">
            <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-6">
              <Calendar className="inline h-6 w-6 mr-2 text-[#2d6a4f]" />
              {t('itineraryHeading', { hotel: content.hotel_name })}
            </h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[19px] top-5 bottom-5 w-0.5 bg-[#d4a843]/30 hidden sm:block" />
              <div className="space-y-4">
                {content.suggested_itinerary.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="mt-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1a472a] text-white text-xs font-bold relative z-10">
                      {idx + 1}
                    </div>
                    <div className="rounded-xl border bg-white p-4 flex-1">
                      <p className="text-sm font-semibold text-[#d4a843] mb-1">{item.time}</p>
                      <p className="text-base text-[#1a472a]">{item.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Nearby Restaurants */}
      {content.nearby_restaurants.length > 0 && (
        <section className="py-12 md:py-16 bg-[#f8f9fa]">
          <div className="mx-auto max-w-[900px] px-5">
            <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-6">
              <Utensils className="inline h-6 w-6 mr-2 text-[#2d6a4f]" />
              {t('eatHeading', { hotel: content.hotel_name })}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {content.nearby_restaurants.map((restaurant) => (
                <div
                  key={restaurant.name}
                  className="rounded-xl border bg-white p-5"
                >
                  <h3 className="font-semibold text-[#1a472a] mb-1">{restaurant.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{restaurant.cuisine}</p>
                  <p className="text-xs text-[#2d6a4f] font-medium">
                    {restaurant.distance_m === 0
                      ? t('inHotel')
                      : t('distanceAway', { distance: restaurant.distance_m })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nearby Activities */}
      {content.nearby_activities.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-[900px] px-5">
            <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-6">
              {t('activitiesHeading', { hotel: content.hotel_name })}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {content.nearby_activities.map((activity) => (
                <div
                  key={activity.name}
                  className="rounded-xl border bg-white p-5"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-0.5 shrink-0 text-[#d4a843]" />
                    <div>
                      <h3 className="font-semibold text-[#1a472a] mb-1">{activity.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{activity.type}</p>
                      <p className="text-xs text-[#2d6a4f] font-medium mt-1">
                        {t('distanceFromHotel', { distance: activity.distance_m })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-[#1a472a] to-[#2d6a4f] text-white text-center">
        <div className="mx-auto max-w-[900px] px-5">
          <h2 className="text-2xl font-bold md:text-3xl mb-4">
            {t('ctaTitle')}
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            {t('ctaText', {
              mins: content.walking_time_mins,
              hotel: content.hotel_name,
              address: BUSINESS_INFO.addressShort,
              hours: BUSINESS_INFO.hours,
            })}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#d4a843] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#c49a3a]"
            >
              {t('bookNow')}
            </a>
            <a
              href={`tel:${BUSINESS_INFO.phoneRaw}`}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t('call', { phone: BUSINESS_INFO.phone })}
            </a>
            <a
              href={SOCIAL_LINKS.line}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t('lineUs')}
            </a>
          </div>
        </div>
      </section>

      {/* Related Pages */}
      {data.related_slugs && data.related_slugs.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-[900px] px-5">
            <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-6">{t('exploreMore')}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {data.related_slugs.map((path) => {
                // Localized target title, falling back to the slug only when
                // the target has no entry in this locale (or is not an SEO
                // page). The slug fallback alone rendered English card titles
                // under a localized heading on every translated page.
                const label =
                  relatedLabels[path] ??
                  path
                    .split('/')
                    .filter(Boolean)
                    .pop()!
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase())
                return (
                  <Link
                    key={path}
                    href={path}
                    className="group flex items-center justify-between rounded-lg border p-4 transition-colors hover:border-[#2d6a4f] hover:bg-[#e8f5e9]"
                  >
                    <span className="text-sm font-medium text-[#1a472a] group-hover:text-[#2d6a4f]">
                      {label}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[#2d6a4f]" />
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
