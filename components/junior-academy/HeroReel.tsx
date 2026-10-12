'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { JA } from './Collage'

interface HeroReelProps {
  src: string
  /** Optimized poster URL, used only when the reel does not autoplay. */
  posterSrc: string
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

/**
 * The Junior Academy reel, laid over its poster image in the hero (owner
 * decision, 2026-10-13: autoplay, muted, the light 540p cut).
 *
 * The poster is a priority next/image the page renders underneath, so the
 * page's first paint and its LCP element are an optimized image, never this
 * video. The video stays transparent until it is actually playing, and loads
 * nothing before then (preload="none", no autoPlay attribute: playback starts
 * from the effect below, which also avoids React's long-standing gap of not
 * writing `muted` into server HTML, which iOS needs before it will autoplay).
 *
 * It plays muted only while at least a quarter of it is on screen, and pauses
 * when scrolled away. Visitors who ask for reduced motion or data saving get
 * a still poster with native controls instead. Otherwise a pause button
 * (WCAG 2.2.2: moving content over 5 s must be pausable) and a sound button
 * sit on the video; the first unmute restarts the reel so the voiceover is
 * heard from its first line.
 */
export default function HeroReel({
  src,
  posterSrc,
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
  const [mode, setMode] = useState<'auto' | 'still'>('auto')
  const [started, setStarted] = useState(false)
  const [paused, setPaused] = useState(true)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true
    if (reduceMotion || saveData) {
      setMode('still')
      return
    }
    video.muted = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!userPaused.current) video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.25 }
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
    if (!nextMuted && !heard.current) {
      video.currentTime = 0
      heard.current = true
    }
    userPaused.current = false
    video.play().catch(() => {})
    setMuted(nextMuted)
  }

  const still = mode === 'still'
  const buttonClass =
    'grid h-11 w-11 place-items-center rounded-full transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2'
  const buttonStyle = { backgroundColor: 'rgba(38,80,32,.88)', color: JA.paper, outlineColor: JA.sun }

  return (
    <>
      <video
        ref={ref}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-200',
          still || started ? 'opacity-100' : 'opacity-0'
        )}
        width={width}
        height={height}
        muted
        loop
        playsInline
        preload="none"
        poster={still ? posterSrc : undefined}
        controls={still}
        aria-label={label}
        aria-describedby={describedBy}
        onPlaying={() => {
          setStarted(true)
          setPaused(false)
        }}
        onPause={() => setPaused(true)}
      >
        <source src={src} type="video/mp4" />
      </video>
      {!still && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button type="button" onClick={togglePlay} aria-label={paused ? play : pause} className={buttonClass} style={buttonStyle}>
            {paused ? <Play className="h-5 w-5" aria-hidden="true" /> : <Pause className="h-5 w-5" aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={toggleSound}
            aria-label={muted ? soundOn : soundOff}
            className={buttonClass}
            style={buttonStyle}
          >
            {muted ? <VolumeX className="h-5 w-5" aria-hidden="true" /> : <Volume2 className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      )}
    </>
  )
}
