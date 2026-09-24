/**
 * The agreement version: the `Last updated` date printed on the page, as
 * `YYYY-MM-DD`.
 *
 * MIRRORED with lengolf-booking-new (`lib/club-rental/rental-agreement.ts`
 * `RENTAL_AGREEMENT_VERSION`), which stamps it onto every course rental at
 * booking time. Bump both in the same change that edits the ENGLISH prose.
 * A translation-only change is not a new version: §12 makes the English text
 * the one that governs.
 */
export const RENTAL_AGREEMENT_VERSION = '2026-08-07'

export interface RentalAgreementSection {
  /** Includes the section number, e.g. "1. The Rental". */
  heading: string
  paragraphs?: readonly string[]
  /** Bulleted clauses. `**bold**` is rendered by BoldText. */
  items?: readonly string[]
}

export interface RentalAgreementContent {
  /**
   * The EN version this text was translated from. Typed as the version's
   * literal type, so bumping RENTAL_AGREEMENT_VERSION fails typecheck until
   * every translation has been revisited against the new English. Not prose,
   * so validate-i18n skips it.
   */
  sourceVersion: typeof RENTAL_AGREEMENT_VERSION
  /** H1 and breadcrumb name. */
  title: string
  /** `<title>` (the layout appends "| LENGOLF"). */
  metaTitle: string
  metaDescription: string
  /** The full "Last updated: <date>" line. */
  lastUpdated: string
  /**
   * Translations only: "provided for convenience, the English version
   * prevails", followed by a link to the EN page. EN has none.
   */
  notice?: { text: string; linkText: string }
  intro: readonly string[]
  sections: readonly RentalAgreementSection[]
  closing: readonly string[]
}
