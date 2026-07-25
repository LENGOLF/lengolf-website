'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  /** Full-size loop, used on tablet and desktop. */
  srcDesktop: string
  /** Lighter loop for narrow viewports. */
  srcMobile: string
  poster: string
}

/**
 * Autoplaying hero loop that stays off the critical path.
 *
 * The video is deliberately mounted without a `src`. Attaching one during the
 * initial render makes the video the LCP candidate, which measured 12.4s on
 * mobile even after the file went from 29.6 MB to 4.1 MB - the size was never
 * the whole problem. Deferring the fetch until after `load` lets the poster
 * image (rendered underneath with fetchPriority="high") settle as LCP instead,
 * while autoplay still happens a beat later.
 *
 * Autoplay behaviour is unchanged for the viewer. The only thing that moves is
 * when the bytes are requested.
 */
export default function HeroVideo({ srcDesktop, srcMobile, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    // Honour reduced-motion: the poster alone is a complete hero.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches) return

    const start = () => {
      setSrc(window.matchMedia('(max-width: 768px)').matches ? srcMobile : srcDesktop)
    }

    // Wait for the load event so the video never competes with LCP, then take
    // the first idle slot. requestIdleCallback is absent on Safari.
    const schedule = () => {
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(start, { timeout: 2000 })
      } else {
        window.setTimeout(start, 200)
      }
    }

    if (document.readyState === 'complete') {
      schedule()
      return
    }
    window.addEventListener('load', schedule, { once: true })
    return () => window.removeEventListener('load', schedule)
  }, [srcDesktop, srcMobile])

  useEffect(() => {
    if (!src || !videoRef.current) return
    const video = videoRef.current
    video.load()
    // Autoplay can still be refused (low power mode, data saver). The poster
    // stays visible underneath, so a rejection is not a broken hero.
    void video.play().catch(() => {})
  }, [src])

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
      className="absolute inset-0 h-full w-full object-cover"
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    >
      {src && <source src={src} type="video/mp4" />}
    </video>
  )
}
