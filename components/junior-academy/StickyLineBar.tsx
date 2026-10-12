'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { LineButton } from './Collage'

interface StickyLineBarProps {
  href: string
  label: string
  /** The hero's LINE button: the bar appears once it has scrolled up out of view. */
  heroCtaId: string
  /** The closing call-to-action section: the bar hides while it is on screen. */
  endId: string
}

/**
 * The phone-only LINE button at the foot of the screen (owner's v2 redesign):
 * on a phone the next step stays one tap away between the hero and the closing
 * section, which carry their own buttons. The site-wide "Book your bay" bar
 * (MobileStickyBar) lists this page in HIDDEN_PATHS so the two never stack.
 */
export default function StickyLineBar({ href, label, heroCtaId, endId }: StickyLineBarProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const heroCta = document.getElementById(heroCtaId)
    const end = document.getElementById(endId)
    if (!heroCta || !end) return
    let heroGone = false
    let endSeen = false
    const update = () => setShow(heroGone && !endSeen)
    const heroObserver = new IntersectionObserver(([entry]) => {
      heroGone = !entry.isIntersecting && entry.boundingClientRect.top < 0
      update()
    })
    const endObserver = new IntersectionObserver(([entry]) => {
      endSeen = entry.isIntersecting
      update()
    })
    heroObserver.observe(heroCta)
    endObserver.observe(end)
    return () => {
      heroObserver.disconnect()
      endObserver.disconnect()
    }
  }, [heroCtaId, endId])

  return (
    <div
      // Off screen it must also leave the tab order and the a11y tree, which
      // `invisible` does; visibility flips at the end of the slide-out.
      className={cn(
        'fixed inset-x-3 bottom-3 z-30 flex justify-center transition-[transform,visibility] duration-200 md:hidden',
        show ? 'visible translate-y-0' : 'invisible translate-y-[140%]'
      )}
    >
      <LineButton href={href} label={label} className="w-full max-w-[460px]" />
    </div>
  )
}
