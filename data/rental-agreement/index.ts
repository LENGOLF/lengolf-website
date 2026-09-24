// The Golf Course Club Rental Agreement, per locale, rendered by
// app/[locale]/golf-course-club-rental-agreement/page.tsx.
//
// WHY A DATA MODULE (not messages/*.json): the next-intl catalog is handed to
// the client on every page, so ~1,000 words of legal prose per locale there
// would weigh down every page on the site to serve one. Only the server page
// imports this module, which keeps it out of the client bundle. It is
// deliberately NOT `import 'server-only'`: validate-i18n and
// scripts/indexnow-urls.ts (which imports each changed data file) load it
// under plain tsx, where that package throws.
//
// One file per locale, so a positional edit cannot move one locale's text into
// another's field. That alone does not stop wrong-language text being pasted
// into a file, or a wrong mapping below: validate-i18n catches those (check 12
// requires the locale's own script in every string, and checkScript flags
// another locale's text), and checks each translation's structure (notice,
// sections, clauses, bold spans, numbers, date line) against EN.
import type { Locale } from '@/lib/translated-routes'
import { en } from './en'
import { ja } from './ja'
import { ko } from './ko'
import { th } from './th'
import { zh } from './zh'
import type { RentalAgreementContent } from './types'

export { RENTAL_AGREEMENT_VERSION } from './types'
export type { RentalAgreementContent, RentalAgreementSection } from './types'

export const RENTAL_AGREEMENT_PATH = '/golf-course-club-rental-agreement/'

export const RENTAL_AGREEMENT: Record<Locale, RentalAgreementContent> = { en, th, ja, ko, zh }

/** The agreement for `locale`, or undefined when that locale has none. */
export function getRentalAgreement(locale: string): RentalAgreementContent | undefined {
  return RENTAL_AGREEMENT[locale as Locale]
}
