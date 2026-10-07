import { storageUrl } from '@/lib/constants'

/**
 * Structural coach data — photo, identity, gallery. Bilingual bullet lists
 * (expertise / achievements / education) live in `messages/*.json` under
 * `Lessons.coaches.<i18nKey>.<field>` and are rendered with `t.raw()` in
 * `app/[locale]/lessons/page.tsx` so they translate per locale.
 *
 * The language-neutral fields below feed the Person JSON-LD on /lessons/
 * (`getCoachesJsonLd` in lib/jsonld.ts).
 */

/** BCP 47 codes. Lessons are taught in Thai and English only (David,
 *  2026-10-01, confirmed for every coach 2026-10-07). There are NO
 *  Japanese/Korean/Chinese-language lessons; LINE booking help in those
 *  languages is a separate, channel-level claim. */
export type TeachingLanguage = 'th' | 'en'

export interface Coach {
  name: string
  fullName: string
  nickname: string
  /** Lowercase identifier used to look up the translation sub-namespace. */
  i18nKey: 'boss' | 'ratchavin' | 'min'
  photo: string
  gallery: string[]
  teachingLanguages: TeachingLanguage[]
  /**
   * Positions in this coach's localized `education` list that are credentials
   * (licences, certifications, degrees) rather than schools. The lists are
   * parallel across all five catalogs, so one index set serves every locale.
   */
  credentialIndices: number[]
  /** Schools attended, as proper names (identical in every locale). */
  alumniOf: string[]
}

export const coaches: Coach[] = [
  {
    name: 'PRO Boss',
    fullName: 'Parin Phokan',
    nickname: 'Boss',
    i18nKey: 'boss',
    photo: storageUrl('lessons/coach-boss.png'),
    gallery: [
      storageUrl('lessons/coach-boss-gallery-01.jpg'),
      storageUrl('lessons/coach-boss-gallery-02.jpg'),
      storageUrl('lessons/coach-boss-gallery-03.jpg'),
      storageUrl('lessons/coach-boss-gallery-04.jpg'),
    ],
    teachingLanguages: ['th', 'en'],
    // education: [NMMI, TAMIU, Thailand PGA licence GI 1416]
    credentialIndices: [2],
    alumniOf: ['New Mexico Military Institute', 'Texas A&M International University'],
  },
  {
    name: 'PRO Ratchavin',
    fullName: 'Ratchavin Tanakasempipat',
    nickname: 'Ratchavin',
    i18nKey: 'ratchavin',
    photo: storageUrl('lessons/coach-ratchavin.png'),
    gallery: [
      storageUrl('lessons/coach-ratchavin-gallery-01.jpg'),
      storageUrl('lessons/coach-ratchavin-gallery-02.jpg'),
      storageUrl('lessons/coach-ratchavin-gallery-03.jpg'),
      storageUrl('lessons/coach-ratchavin-gallery-04.jpg'),
    ],
    teachingLanguages: ['th', 'en'],
    // education: five coaching certifications (TrackMan, Scott Cowx, ...)
    credentialIndices: [0, 1, 2, 3, 4],
    alumniOf: [],
  },
  {
    name: 'PRO Min',
    fullName: 'Varuth Kjonkittiskul',
    nickname: 'Min',
    i18nKey: 'min',
    photo: storageUrl('lessons/coach-min.png'),
    gallery: [
      storageUrl('lessons/coach-min-gallery-01.jpg'),
      storageUrl('lessons/coach-min-gallery-02.jpg'),
      storageUrl('lessons/coach-min-gallery-03.jpg'),
      storageUrl('lessons/coach-min-gallery-04.jpg'),
    ],
    teachingLanguages: ['th', 'en'],
    // education: [Bachelor of Sport Science, PGA Thailand licence TP0944]
    credentialIndices: [0, 1],
    alumniOf: [],
  },
]
