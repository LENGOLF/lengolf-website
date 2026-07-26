import { getTranslations } from 'next-intl/server'
import { MapPin, Star } from 'lucide-react'
import type { LocationPage } from '@/lib/locations'
import { parseList, parseAttractions } from '@/lib/locations'
import CourseRentalCrossLink from '@/components/shared/CourseRentalCrossLink'

interface Props {
  data: LocationPage
}

export default async function ThingsToDoSections({ data }: Props) {
  const t = await getTranslations('Location')
  const attractions = parseAttractions(data.other_attractions)
  const landmarks = parseList(data.nearby_landmarks)

  return (
    <>
      {/* Area Description */}
      {data.area_description && (
        <section className="py-12 md:py-16 bg-[#f8f9fa]">
          <div className="mx-auto max-w-[900px] px-5">
            <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-4">
              {t('about', { location: data.location_name })}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              {data.area_description}
            </p>
          </div>
        </section>
      )}

      {/* Pain Point */}
      {data.area_pain_point && (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-[900px] px-5">
            <blockquote className="border-l-4 border-[#d4a843] pl-6 text-lg italic text-muted-foreground">
              {data.area_pain_point}
            </blockquote>
          </div>
        </section>
      )}

      {/* LENGOLF Pitch */}
      {data.lengolf_pitch && (
        <section className="py-12 md:py-16 bg-[#f8f9fa]">
          <div className="mx-auto max-w-[900px] px-5">
            <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-4">
              {t('indoorGolfAtLengolf')}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              {data.lengolf_pitch}
            </p>
          </div>
        </section>
      )}

      {/* Attractions */}
      {attractions.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-[900px] px-5">
            <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-6">
              {t('otherThingsToDo', { location: data.location_name })}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {attractions.map((attr) => (
                <div
                  key={attr.name}
                  className="flex items-start gap-3 rounded-lg border bg-white p-4"
                >
                  <Star className="h-5 w-5 mt-0.5 shrink-0 text-[#d4a843]" />
                  <div>
                    <p className="font-medium text-[#1a472a]">{attr.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {attr.type}{attr.distance ? ` · ${attr.distance}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Landmarks */}
      {landmarks.length > 0 && (
        <section className="py-12 md:py-16 bg-[#f8f9fa]">
          <div className="mx-auto max-w-[900px] px-5">
            <h2 className="text-2xl font-bold text-[#1a472a] md:text-3xl mb-6">
              {t('nearbyLandmarks')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {landmarks.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f5e9] px-3 py-1.5 text-sm text-[#2d6a4f]"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Course rental crosslink */}
      <CourseRentalCrossLink />
    </>
  )
}
