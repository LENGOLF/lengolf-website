// The Golf Course Club Rental Agreement, per locale, rendered by
// app/[locale]/golf-course-club-rental-agreement/page.tsx.
//
// WHY A DATA MODULE (not messages/*.json): the next-intl catalog is handed to
// the client on every page, so ~1,000 words of legal prose per locale there
// would weigh down every page on the site to serve one. Only the server page
// imports this module, which keeps it out of the client bundle. It is
// deliberately NOT `import 'server-only'`: validate-i18n and the smoke test
// import it under plain tsx, where that package throws.
//
// One file per locale, so a translation can never land in another locale's
// slot. validate-i18n lints every non-EN locale and checks each one's
// structure (sections, clauses, bold spans, numbers) against EN.
import type { Locale } from '@/lib/translated-routes'
import { en } from './en'
import type { RentalAgreementContent } from './types'

export { RENTAL_AGREEMENT_VERSION } from './types'
export type { RentalAgreementContent, RentalAgreementSection } from './types'

export const RENTAL_AGREEMENT_PATH = '/golf-course-club-rental-agreement/'

export const RENTAL_AGREEMENT: Partial<Record<Locale, RentalAgreementContent>> = { en }

/** The agreement for `locale`, or undefined when that locale has none. */
export function getRentalAgreement(locale: string): RentalAgreementContent | undefined {
  return RENTAL_AGREEMENT[locale as Locale]
}
