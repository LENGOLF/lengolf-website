'use client'

import { pushRentalIntent, type RentalIntentSource } from '@/lib/analytics'

interface Props {
  href: string
  source: RentalIntentSource
  className?: string
  children: React.ReactNode
}

/**
 * Outbound rental CTA anchor that fires `rental_intent` on click. Same GTM
 * signal as components/clubs/BookRentalLink but without that component's
 * fixed icon/label markup, so server components (RentalCtaBanner, the
 * course-page sidebar) can wrap arbitrary children.
 */
export default function TrackedRentalLink({ href, source, className, children }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => pushRentalIntent(source)}
    >
      {children}
    </a>
  )
}
