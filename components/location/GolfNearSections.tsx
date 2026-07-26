import { getTranslations } from 'next-intl/server'
import { MapPin } from 'lucide-react'
import type { LocationPage } from '@/lib/locations'
import { parseList } from '@/lib/locations'
import CourseRentalCrossLink from '@/components/shared/CourseRentalCrossLink'

interface Props {
  data: LocationPage
}

export default async function GolfNearSections({ data }: Props) {
  const t = await getTranslations('Location')
  const landmarks = parseList(data.nearby_landmarks)
  const hotels = parseList(data.nearby_hotels)
  const offices = parseList(data.nearby_offices)

  return (
    <>
      {/* Pain Point */}
      {data.area_pain_point && (
        <section className="py-12 md:py-16 bg-[#f8f9fa]">
          <div className="mx-auto max-w-[900px] px-5">
            <blockquote className="border-l-4 border-[#d4a843] pl-6 text-lg italic text-muted-foreground">
              {data.area_pain_point}
            </blockquote>
          </div>
        </section>
      )}

      {/* LENGOLF Pitch */}
      {data.lengolf_pitch && (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-[900px] px-5">
            <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-4">
              {t('whyLengolfFor', { location: data.location_name })}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              {data.lengolf_pitch}
            </p>
          </div>
        </section>
      )}

      {/* Nearby Grid */}
      {(landmarks.length > 0 || hotels.length > 0 || offices.length > 0) && (
        <section className="py-12 md:py-16 bg-[#f8f9fa]">
          <div className="mx-auto max-w-[900px] px-5">
            <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-8">
              {t('near', { location: data.location_name })}
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {landmarks.length > 0 && (
                <div>
                  <h3 className="font-semibold text-[#1a472a] mb-3">{t('landmarks')}</h3>
                  <ul className="space-y-2">
                    {landmarks.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-[#2d6a4f]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {hotels.length > 0 && (
                <div>
                  <h3 className="font-semibold text-[#1a472a] mb-3">{t('hotels')}</h3>
                  <ul className="space-y-2">
                    {hotels.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-[#2d6a4f]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {offices.length > 0 && (
                <div>
                  <h3 className="font-semibold text-[#1a472a] mb-3">{t('officeBuildings')}</h3>
                  <ul className="space-y-2">
                    {offices.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-[#2d6a4f]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Course rental crosslink */}
      <CourseRentalCrossLink />
    </>
  )
}
