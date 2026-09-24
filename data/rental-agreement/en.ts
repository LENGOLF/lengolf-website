import { BUSINESS_INFO } from '@/lib/constants'
import type { RentalAgreementContent } from './types'

// The governing text (§12: the English version prevails). Any change to this
// file's WORDING is a new agreement version: bump RENTAL_AGREEMENT_VERSION in
// ./types.ts, the date in `lastUpdated`, the mirror in lengolf-booking-new,
// and every translation's `sourceVersion` (typecheck enforces the last one).
export const en: RentalAgreementContent = {
  sourceVersion: '2026-08-07',
  title: 'Golf Course Club Rental Agreement',
  metaTitle: 'Golf Course Club Rental Agreement',
  metaDescription:
    'LENGOLF Golf Course Club Rental Agreement - the terms that apply to every off-site (course) golf club rental.',
  lastUpdated: 'Last updated: 7 August 2026',
  intro: [
    'This Agreement governs the rental of golf club sets and related equipment (the "Equipment") by LENGOLF CO., LTD. ("LENGOLF", "we", "us") to you ("you", the "Renter") for off-site use at golf courses. It applies to every off-site (course) rental you make with us, whether booked at booking.len.golf, by LINE, phone, email, or in person. Indoor and in-store simulator club rentals are not covered by this Agreement.',
    'By confirming a course rental booking with us, you agree to this Agreement.',
  ],
  sections: [
    {
      heading: '1. The Rental',
      items: [
        'We rent you the club set(s) and any add-on items shown in your booking confirmation, for the rental period stated there (from the start date and time to the return date and time).',
        'The Equipment remains the property of LENGOLF at all times.',
        'You may collect the Equipment from LENGOLF (The Mercury Ville @ BTS Chidlom) or request delivery (see Section 7).',
      ],
    },
    {
      heading: '2. Fees and Payment',
      items: [
        'Rental fees, delivery fees, and add-on prices are those shown at booking, in Thai Baht (THB) and inclusive of VAT. Payment is made online at booking time using one of the payment methods offered at checkout. Delivery orders require online prepayment; pickup orders may alternatively pay cash on collection.',
        'No security deposit is required.',
        'Your reservation is held for up to 2 hours while you complete payment. If payment is not completed within that time, the reservation is automatically cancelled and the Equipment released.',
      ],
    },
    {
      heading: '3. Condition at Handover',
      items: [
        `Please inspect the Equipment when you collect or receive it. If anything is missing, damaged, or not as expected, tell us before you use it (LINE @lengolf, ${BUSINESS_INFO.phone}, or ${BUSINESS_INFO.email}).`,
        'If you do not report an issue before use, the Equipment is treated as received complete and in good condition.',
      ],
    },
    {
      heading: '4. Your Responsibilities',
      items: [
        'Use the Equipment only for playing golf, in the normal way, and keep it in your possession and control during the rental period.',
        'Take reasonable care of the Equipment and protect it from loss, theft, and avoidable damage.',
        'Do not sell, sub-rent, lend, or give the Equipment to anyone else.',
        'Return the complete set, including the bag and every club and add-on item, by the agreed return time.',
      ],
    },
    {
      heading: '5. Normal Wear and Tear',
      paragraphs: [
        'Normal wear and tear from ordinary golf use, such as minor scuffs, grip wear, and surface marks, is expected and is covered by LENGOLF. You will not be charged for it.',
      ],
    },
    {
      heading: '6. Loss, Theft, or Damage',
      items: [
        'You are responsible for loss, theft, or damage to the Equipment beyond normal wear and tear (Section 5) that occurs while it is in your care.',
        'Where Equipment is damaged, you agree to pay the reasonable cost of repair. Where an item is lost, stolen, or damaged beyond economical repair, you agree to pay its fair replacement value. We assess repair cost and fair replacement value case by case and will explain any charge to you before applying it.',
        'Please tell us as soon as possible if any Equipment is lost, stolen, or damaged.',
      ],
    },
    {
      heading: '7. Delivery and Pickup',
      items: [
        'We deliver within Bangkok and surrounding areas by arrangement. Delivery and return-pickup times and locations are agreed at booking. Locations beyond Greater Bangkok are handled case by case, so please contact us.',
        'Someone must be available at the agreed location and time to receive the Equipment at delivery and to hand it back at return pickup.',
        'If we cannot complete delivery or pickup because no one is available or the details were incorrect, additional charges or delays may apply.',
      ],
    },
    {
      heading: '8. Late Return',
      items: [
        'The Equipment is due back at the agreed return date and time. If you keep it longer, additional rental is charged at the standard daily rate for each additional day (or part-day) until it is returned.',
        'If the Equipment is not returned and we cannot reach you, we may treat it as lost under Section 6.',
      ],
    },
    {
      heading: '9. Cancellation and Refunds',
      items: [
        `**Free cancellation up to 24 hours before your rental starts.** Cancel at least 24 hours before the start of your rental period and we refund the full amount you paid, with no cancellation fee. To cancel, contact us on LINE @lengolf, by phone on ${BUSINESS_INFO.phone}, or by email at ${BUSINESS_INFO.email}.`,
        'Cancellations made less than 24 hours before the start of the rental period are assessed case by case. We will tell you what, if anything, will be refunded before we process it.',
        'If you do not collect, or are not available to receive the Equipment (no-show), the booking may be treated as cancelled; refunds are handled case by case.',
        'Refunds are returned to the original payment method used at booking. Card refunds are typically credited by your bank within 5 to 10 business days of us processing them.',
        'If we cannot supply the Equipment you booked, you may choose an available alternative or a full refund.',
      ],
    },
    {
      heading: '10. Use at Your Own Risk; Limitation of Liability',
      items: [
        'Golf involves physical activity and inherent risk. You use the Equipment at your own risk and are responsible for using it safely and appropriately for your ability.',
        'The Equipment is provided on an "as is" basis for recreational golf. To the extent permitted by law, LENGOLF is not liable for any injury, loss, or damage arising from your use of the Equipment, or for any indirect or consequential loss.',
        'Nothing in this Agreement limits any rights you have that cannot be excluded under Thai law.',
      ],
    },
    {
      heading: '11. Personal Data',
      paragraphs: [
        'We handle the personal details you provide to fulfil your rental in line with our Privacy Policy (len.golf/privacy-policy).',
      ],
    },
    {
      heading: '12. Governing Law and Language',
      items: [
        'This Agreement is governed by the laws of Thailand, and any dispute is subject to the jurisdiction of the Thai courts.',
        'This Agreement is written in English. Any translation is provided for convenience only; if there is any conflict, the English version prevails.',
      ],
    },
    {
      heading: '13. Contact',
      items: [
        `LINE: @lengolf · Phone: ${BUSINESS_INFO.phone} · Email: ${BUSINESS_INFO.email}`,
        `${BUSINESS_INFO.legalName} (Tax ID ${BUSINESS_INFO.taxId}), ${BUSINESS_INFO.registeredAddress}.`,
      ],
    },
    {
      heading: '14. Acceptance',
      paragraphs: [
        'By confirming a course rental booking with LENGOLF, whether online, by LINE, phone, email, or in person, you confirm that you have read, understood, and agree to this Agreement.',
      ],
    },
  ],
  closing: [
    'We may update this Agreement from time to time; the version in effect when you book applies to that rental.',
  ],
}
