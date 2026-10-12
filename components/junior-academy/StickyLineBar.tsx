'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { LineButton } from './Collage'

interface StickyLineBarProps {
  href: string
  label: string
  /** The hero's LINE button: the bar appears once it has scrolled up out of view. */
  heroCtaId: string
  /** The closing call-to-action section: the bar hides once it is reached, and stays hidden below it. */
  endId: string
}

/**
 * The phone-only LINE button at the foot of the screen (owner's v2 redesign):
 * on a phone the next step stays one tap away between the hero and the closing
 * section, which carry their own buttons. The site-wide "Book your bay" bar
 * (MobileStickyBar) and the floating LINE bubble (LineChatWidget) both skip
 * this page, so it is the only fixed button here and every LINE tap goes
 * through the Junior Academy's tracked link.
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
    // The newest entry wins when several are queued.
    const heroObserver = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1]
      heroGone = !entry.isIntersecting && entry.boundingClientRect.top < 0
      update()
    })
    // On screen OR already scrolled past: below the closing section sit the
    // related links and the site footer, which the bar must not cover.
    const endObserver = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1]
      endSeen = entry.isIntersecting || entry.boundingClientRect.top < 0
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
