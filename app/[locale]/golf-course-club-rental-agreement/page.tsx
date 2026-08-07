import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import SectionWrapper from '@/components/shared/SectionWrapper'
import { BUSINESS_INFO, SITE_URL } from '@/lib/constants'
import { getBreadcrumbJsonLd } from '@/lib/jsonld'

export const metadata: Metadata = {
  title: 'Golf Course Club Rental Agreement',
  description:
    'LENGOLF Golf Course Club Rental Agreement - the terms that apply to every off-site (course) golf club rental.',
  alternates: { canonical: `${SITE_URL}/golf-course-club-rental-agreement/` },
}

export default async function CourseRentalAgreementPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Golf Course Club Rental Agreement', url: `${SITE_URL}/golf-course-club-rental-agreement/` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SectionWrapper>
        <div className="mx-auto max-w-3xl prose prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
          <h1>Golf Course Club Rental Agreement</h1>
          <p>Last updated: 7 August 2026</p>
          <p>
            This Agreement governs the rental of golf club sets and related equipment (the &quot;Equipment&quot;)
            by LENGOLF CO., LTD. (&quot;LENGOLF&quot;, &quot;we&quot;, &quot;us&quot;) to you (&quot;you&quot;, the
            &quot;Renter&quot;) for off-site use at golf courses. It applies to every off-site (course) rental you
            make with us, whether booked at booking.len.golf, by LINE, phone, email, or in person. Indoor and
            in-store simulator club rentals are not covered by this Agreement.
          </p>
          <p>By confirming a course rental booking with us, you agree to this Agreement.</p>

          <hr />

          <h3>1. The Rental</h3>
          <ul>
            <li>
              We rent you the club set(s) and any add-on items shown in your booking confirmation, for the rental
              period stated there (from the start date and time to the return date and time).
            </li>
            <li>The Equipment remains the property of LENGOLF at all times.</li>
            <li>
              You may collect the Equipment from LENGOLF (The Mercury Ville @ BTS Chidlom) or request delivery (see
              Section 7).
            </li>
          </ul>

          <h3>2. Fees and Payment</h3>
          <ul>
            <li>
              Rental fees, delivery fees, and add-on prices are those shown at booking, in Thai Baht (THB) and
              inclusive of VAT. Payment is made online at booking time using one of the payment methods offered at
              checkout. Delivery orders require online prepayment; pickup orders may alternatively pay cash on
              collection.
            </li>
            <li>No security deposit is required.</li>
            <li>
              Your reservation is held for up to 2 hours while you complete payment. If payment is not completed
              within that time, the reservation is automatically cancelled and the Equipment released.
            </li>
          </ul>

          <h3>3. Condition at Handover</h3>
          <ul>
            <li>
              Please inspect the Equipment when you collect or receive it. If anything is missing, damaged, or not
              as expected, tell us before you use it (LINE @lengolf, 096-668-2335, or info@len.golf).
            </li>
            <li>
              If you do not report an issue before use, the Equipment is treated as received complete and in good
              condition.
            </li>
          </ul>

          <h3>4. Your Responsibilities</h3>
          <ul>
            <li>
              Use the Equipment only for playing golf, in the normal way, and keep it in your possession and
              control during the rental period.
            </li>
            <li>Take reasonable care of the Equipment and protect it from loss, theft, and avoidable damage.</li>
            <li>Do not sell, sub-rent, lend, or give the Equipment to anyone else.</li>
            <li>Return the complete set, including the bag and every club and add-on item, by the agreed return time.</li>
          </ul>

          <h3>5. Normal Wear and Tear</h3>
          <p>
            Normal wear and tear from ordinary golf use, such as minor scuffs, grip wear, and surface marks, is
            expected and is covered by LENGOLF. You will not be charged for it.
          </p>

          <h3>6. Loss, Theft, or Damage</h3>
          <ul>
            <li>
              You are responsible for loss, theft, or damage to the Equipment beyond normal wear and tear (Section 5)
              that occurs while it is in your care.
            </li>
            <li>
              Where Equipment is damaged, you agree to pay the reasonable cost of repair. Where an item is lost,
              stolen, or damaged beyond economical repair, you agree to pay its fair replacement value. We assess
              repair cost and fair replacement value case by case and will explain any charge to you before applying
              it.
            </li>
            <li>Please tell us as soon as possible if any Equipment is lost, stolen, or damaged.</li>
          </ul>

          <h3>7. Delivery and Pickup</h3>
          <ul>
            <li>
              We deliver within Bangkok and surrounding areas by arrangement. Delivery and return-pickup times and
              locations are agreed at booking. Locations beyond Greater Bangkok are handled case by case, so please
              contact us.
            </li>
            <li>
              Someone must be available at the agreed location and time to receive the Equipment at delivery and to
              hand it back at return pickup.
            </li>
            <li>
              If we cannot complete delivery or pickup because no one is available or the details were incorrect,
              additional charges or delays may apply.
            </li>
          </ul>

          <h3>8. Late Return</h3>
          <ul>
            <li>
              The Equipment is due back at the agreed return date and time. If you keep it longer, additional rental
              is charged at the standard daily rate for each additional day (or part-day) until it is returned.
            </li>
            <li>
              If the Equipment is not returned and we cannot reach you, we may treat it as lost under Section 6.
            </li>
          </ul>

          <h3>9. Cancellation and Refunds</h3>
          <ul>
            <li>
              <strong>Free cancellation up to 24 hours before your rental starts.</strong> Cancel at least 24 hours
              before the start of your rental period and we refund the full amount you paid, with no cancellation
              fee. To cancel, contact us on LINE @lengolf, by phone on 096-668-2335, or by email at info@len.golf.
            </li>
            <li>
              Cancellations made less than 24 hours before the start of the rental period are assessed case by case.
              We will tell you what, if anything, will be refunded before we process it.
            </li>
            <li>
              If you do not collect, or are not available to receive the Equipment (no-show), the booking may be
              treated as cancelled; refunds are handled case by case.
            </li>
            <li>
              Refunds are returned to the original payment method used at booking. Card refunds are typically
              credited by your bank within 5 to 10 business days of us processing them.
            </li>
            <li>
              If we cannot supply the Equipment you booked, you may choose an available alternative or a full
              refund.
            </li>
          </ul>

          <h3>10. Use at Your Own Risk; Limitation of Liability</h3>
          <ul>
            <li>
              Golf involves physical activity and inherent risk. You use the Equipment at your own risk and are
              responsible for using it safely and appropriately for your ability.
            </li>
            <li>
              The Equipment is provided on an &quot;as is&quot; basis for recreational golf. To the extent permitted
              by law, LENGOLF is not liable for any injury, loss, or damage arising from your use of the Equipment,
              or for any indirect or consequential loss.
            </li>
            <li>Nothing in this Agreement limits any rights you have that cannot be excluded under Thai law.</li>
          </ul>

          <h3>11. Personal Data</h3>
          <p>
            We handle the personal details you provide to fulfil your rental in line with our Privacy Policy
            (len.golf/privacy-policy).
          </p>

          <h3>12. Governing Law and Language</h3>
          <ul>
            <li>
              This Agreement is governed by the laws of Thailand, and any dispute is subject to the jurisdiction of
              the Thai courts.
            </li>
            <li>
              This Agreement is written in English. Any translation is provided for convenience only; if there is
              any conflict, the English version prevails.
            </li>
          </ul>

          <h3>13. Contact</h3>
          <ul>
            <li>
              LINE: @lengolf &middot; Phone: {BUSINESS_INFO.phone} &middot; Email: {BUSINESS_INFO.email}
            </li>
            <li>
              {BUSINESS_INFO.legalName} (Tax ID {BUSINESS_INFO.taxId}), {BUSINESS_INFO.registeredAddress}.
            </li>
          </ul>

          <h3>14. Acceptance</h3>
          <p>
            By confirming a course rental booking with LENGOLF, whether online, by LINE, phone, email, or in person,
            you confirm that you have read, understood, and agree to this Agreement.
          </p>

          <hr />

          <p>
            We may update this Agreement from time to time; the version in effect when you book applies to that
            rental.
          </p>
        </div>
      </SectionWrapper>
    </>
  )
}
