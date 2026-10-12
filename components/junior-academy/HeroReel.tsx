'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { JA } from './Collage'

interface HeroReelProps {
  src: string
  width: number
  height: number
  label: string
  soundOn: string
  soundOff: string
  pause: string
  play: string
  /** Id of the element holding the transcript (aria-describedby). */
  describedBy: string
}

/** Share of the reel that must be on screen for it to play. */
const VISIBLE_RATIO = 0.25

/**
 * The Junior Academy reel, laid over its poster image in the hero (owner
 * decision, 2026-10-13: autoplay, muted, the light 540p cut).
 *
 * The poster is a priority next/image the page renders underneath (the clip's
 * first frame), so the page's first paint and its LCP element are an
 * optimized image, never this video. The video stays transparent until it is
 * actually playing, and fetches nothing until playback is requested
 * (preload="none", no autoPlay attribute: the effect below sets `muted` on
 * the element and calls play() only while the reel is on screen).
 *
 * It plays muted while at least a quarter of it is on screen and pauses
 * otherwise. The ratio is checked by hand, because WebKit and Gecko report
 * `isIntersecting` for any overlap at all, whatever the threshold. Visitors
 * who ask for reduced motion or data saving get no autoplay: the poster stays
 * up and the play button starts the reel. A pause button (WCAG 2.2.2: moving
 * content over 5 s must be pausable) and a sound button sit on the video; the
 * first unmute restarts the reel so the voiceover is heard from its first
 * line, and muting never restarts a reel the visitor paused.
 */
export default function HeroReel({
  src,
  width,
  height,
  label,
  soundOn,
  soundOff,
  pause,
  play,
  describedBy,
}: HeroReelProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const heard = useRef(false)
  const userPaused = useRef(false)
  const [started, setStarted] = useState(false)
  const [paused, setPaused] = useState(true)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    video.muted = true
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true
    if (reduceMotion || saveData) return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1]
        if (entry.intersectionRatio >= VISIBLE_RATIO) {
          if (!userPaused.current) video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: [0, VISIBLE_RATIO] }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  const togglePlay = () => {
    const video = ref.current
    if (!video) return
    if (video.paused) {
      userPaused.current = false
      video.play().catch(() => {})
    } else {
      userPaused.current = true
      video.pause()
    }
  }

  const toggleSound = () => {
    const video = ref.current
    if (!video) return
    const nextMuted = !video.muted
    video.muted = nextMuted
    setMuted(nextMuted)
    if (nextMuted) return
    if (!heard.current) {
      video.currentTime = 0
      heard.current = true
    }
    userPaused.current = false
    video.play().catch(() => {})
  }

  const buttonClass =
    'grid h-11 w-11 place-items-center rounded-full transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2'
  const buttonStyle = { backgroundColor: 'rgba(38,80,32,.88)', color: JA.paper, outlineColor: JA.sun }

  return (
    <>
      <video
        ref={ref}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-200',
          started ? 'opacity-100' : 'opacity-0'
        )}
        width={width}
        height={height}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        aria-describedby={describedBy}
        // `play` fires as soon as playback is requested; `playing` only once
        // frames arrive. The button state follows the first, the fade-in the
        // second, so a tap during loading does not undo the request.
        onPlay={() => setPaused(false)}
        onPlaying={() => setStarted(true)}
        onPause={() => setPaused(true)}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button type="button" onClick={togglePlay} aria-label={paused ? play : pause} className={buttonClass} style={buttonStyle}>
          {paused ? <Play className="h-5 w-5" aria-hidden="true" /> : <Pause className="h-5 w-5" aria-hidden="true" />}
        </button>
        <button type="button" onClick={toggleSound} aria-label={muted ? soundOn : soundOff} className={buttonClass} style={buttonStyle}>
          {muted ? <VolumeX className="h-5 w-5" aria-hidden="true" /> : <Volume2 className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>
    </>
  )
}
