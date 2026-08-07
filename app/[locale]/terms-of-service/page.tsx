import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import SectionWrapper from '@/components/shared/SectionWrapper'
import { BUSINESS_INFO, SITE_URL } from '@/lib/constants'
import { getBreadcrumbJsonLd } from '@/lib/jsonld'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'LENGOLF Terms of Service - Read the terms and conditions for using our service.',
  alternates: { canonical: `${SITE_URL}/terms-of-service/` },
}

export default async function TermsOfServicePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Terms of Service', url: `${SITE_URL}/terms-of-service/` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    <SectionWrapper>
      <div className="mx-auto max-w-3xl prose prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
        <h1>Terms of Service</h1>
        <p>Last updated: 7 August 2026</p>
        <p>
          Welcome to LENGOLF Booking System (&quot;the Service&quot;). These Terms of Service (&quot;Terms&quot;) govern your use of our website and services. By using our Service, you agree to these Terms. If you do not agree, please do not use our Service.
        </p>

        <hr />

        <h3>1. Acceptance of Terms</h3>
        <p>
          By accessing or using our Service, you agree to comply with and be bound by these Terms. If you are using the Service on behalf of an organization, you represent that you have the authority to bind the organization to these Terms.
        </p>

        <h3>2. Changes to the Terms</h3>
        <p>
          We may update these Terms from time to time. Any changes will be posted on this page, and your continued use of the Service constitutes your acceptance of the updated Terms.
        </p>

        <h3>3. Use of the Service</h3>
        <ul>
          <li>You must be at least 13 years old to use our Service.</li>
          <li>You agree not to use the Service for any illegal or unauthorized purpose.</li>
          <li>You must not attempt to gain unauthorized access to our systems or interfere with the security of our Service.</li>
        </ul>

        <h3>4. User Accounts</h3>
        <ul>
          <li>You may be required to create an account to use certain features of the Service.</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>We are not liable for any unauthorized access to your account resulting from your failure to secure your credentials.</li>
        </ul>

        <h3>5. Bookings, Prices and Payment</h3>
        <ul>
          <li>
            All prices are shown in Thai Baht (THB) and are inclusive of VAT. The price shown at the time you book is
            the price you pay.
          </li>
          <li>
            Payment is taken online at the time of booking using one of the payment methods offered at checkout, or in
            person at LENGOLF where that option is offered for your booking type.
          </li>
          <li>
            Bookings that require online payment, including golf course club rentals, are confirmed once payment is
            completed and we have sent you a confirmation. If payment is not completed within the time shown at
            checkout, the reservation is released automatically.
          </li>
          <li>
            Simulator bay bookings, lessons and events are confirmed when we send you a booking confirmation. Payment
            is taken at LENGOLF unless we tell you otherwise when you book.
          </li>
          <li>We do not store your full card details. Card payments are processed by our payment provider.</li>
        </ul>

        <h3>6. Cancellations and Refunds</h3>
        <ul>
          <li>
            <strong>Golf course club rental (off-site).</strong> You may cancel free of charge up to 24 hours before
            your rental period starts, and we refund the full amount paid. Cancellations made less than 24 hours
            before the start, and no-shows, are assessed case by case. The full terms are in our{' '}
            <a href={`${SITE_URL}/golf-course-club-rental-agreement/`}>Golf Course Club Rental Agreement</a>.
          </li>
          <li>
            <strong>Simulator bay bookings, lessons and events.</strong> These are paid at LENGOLF rather than online,
            so in the normal case there is nothing to refund. To change or cancel, contact us on LINE @lengolf, by
            phone on {BUSINESS_INFO.phone}, or by email at {BUSINESS_INFO.email}, and we will do our best to move your
            booking to another time. Where we have taken a payment in advance, we will agree with you how that payment
            is treated before you cancel.
          </li>
          <li>
            Refunds are returned to the original payment method used at booking. Card refunds are typically credited
            by your bank within 5 to 10 business days of us processing them.
          </li>
          <li>
            If we cannot provide a service you have booked and paid for, you may choose an alternative where one is
            available, or a full refund.
          </li>
        </ul>

        <h3>7. Privacy Policy</h3>
        <p>
          Our Privacy Policy explains how we collect, use, and share your information. By using the Service, you consent to our data practices as described in our Privacy Policy.
        </p>

        <h3>8. Intellectual Property</h3>
        <ul>
          <li>All content, trademarks, logos, and other intellectual property in the Service belong to LENGOLF or our licensors.</li>
          <li>You may not copy, modify, distribute, or use any content from the Service without our express permission.</li>
        </ul>

        <h3>9. Termination</h3>
        <p>
          We may suspend or terminate your access to the Service at any time for any reason, including violation of these Terms. Upon termination, your rights to use the Service will cease immediately.
        </p>

        <h3>10. Disclaimer of Warranties</h3>
        <ul>
          <li>The Service is provided &quot;as is&quot; and &quot;as available.&quot;</li>
          <li>We do not guarantee that the Service will be uninterrupted or error-free.</li>
          <li>We are not responsible for any loss or damage resulting from your use of the Service.</li>
        </ul>

        <h3>11. Limitation of Liability</h3>
        <p>
          To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.
        </p>

        <h3>12. Governing Law</h3>
        <p>
          These Terms are governed by the laws of Thailand. Any disputes arising under these Terms shall be resolved in the courts of Thailand.
        </p>

        <h3>13. Contact Information</h3>
        <p>
          If you have any questions about these Terms, please contact us:
        </p>
        <ul>
          <li>{BUSINESS_INFO.legalName} (Tax ID {BUSINESS_INFO.taxId})</li>
          <li>{BUSINESS_INFO.registeredAddress}</li>
          <li>Phone: {BUSINESS_INFO.phone}</li>
          <li>Email: {BUSINESS_INFO.email}</li>
        </ul>

        <hr />

        <p>
          By using our Service, you acknowledge that you have read, understood, and agreed to these Terms of Service.
        </p>
      </div>
    </SectionWrapper>
    </>
  )
}
