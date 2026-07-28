'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname, Link } from '@/i18n/navigation'
import { CalendarDays, Luggage } from 'lucide-react'
import { BOOKING_URL } from '@/lib/constants'
import { pushRentalIntent } from '@/lib/analytics'

// Pages that have their own CTAs — hide the generic "Book Your Bay" bar
const HIDDEN_PATHS = ['/events', '/lessons', '/second-hand-golf-clubs-bangkok', '/golf-course-club-rental']

export default function MobileStickyBar() {
  const [visible, setVisible] = useState(false)
  const t = useTranslations('Common')
  const pathname = usePathname()

  const isHidden = HIDDEN_PATHS.some((p) => pathname.startsWith(p))
  // Visitors reading about an outdoor course are planning a round, not a
  // simulator session — the persistent mobile CTA should sell club rental
  // for that round, not a bay in Chidlom.
  const isCourseContext = pathname.startsWith('/golf-courses')

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible || isHidden) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-primary/20 bg-white/95 backdrop-blur-sm px-4 py-2.5 md:hidden">
      {isCourseContext ? (
        <Link
          href="/golf-course-club-rental"
          onClick={() => pushRentalIntent('course_sticky')}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          <Luggage className="h-4 w-4" />
          {t('rentClubsCta')}
        </Link>
      ) : (
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          <CalendarDays className="h-4 w-4" />
          {t('bookYourBay')}
        </a>
      )}
    </div>
  )
}
