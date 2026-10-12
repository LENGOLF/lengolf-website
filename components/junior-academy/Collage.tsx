import type { ReactNode } from 'react'
import { FaLine } from 'react-icons/fa'
import { cn } from '@/lib/utils'

/**
 * Paper-collage pieces for /junior-golf-academy/ ONLY.
 *
 * The Junior Academy's look (cream paper, taped labels, the sun-yellow age
 * sticker) belongs to that program alone, per the owner's team feedback: it
 * must not leak into shared components or other pages. Keep every collage
 * element in this folder and import it from nowhere else.
 *
 * Colors follow the poster and the lengolf-design tokens (forest #265020, lime
 * #8dc743), not the legacy site greens; the cream, muted and soft-yellow
 * values come from the owner's v2 redesign (2026-10-12). Everything here is a
 * server component with no motion. The two client pieces (the hero reel and
 * the phone LINE bar) live in their own files beside this one.
 */

export const JA = {
  cream: '#f0e9dc',
  paper: '#fcf9f2',
  forest: '#265020',
  forestDark: '#1a3308',
  lime: '#8dc743',
  sun: '#f2c14e',
  sunSoft: '#f8e2a6',
  ink: '#22301d',
  muted: '#56634f',
} as const

/** The card shadow from the v2 redesign. */
export const JA_SHADOW = '0 18px 40px -22px rgba(38,80,32,.45)'

/** The poster's JUNIOR / ACADEMY lockup, as two taped labels. */
export function AcademyLockup({ className }: { className?: string }) {
  return (
    <p className={cn('mb-5 flex flex-wrap gap-1.5', className)}>
      <span
        className="px-3 pb-[5px] pt-1 text-[15px] font-bold italic leading-tight tracking-[0.04em]"
        style={{ backgroundColor: JA.forest, color: JA.paper, transform: 'rotate(-2deg)' }}
      >
        JUNIOR
      </span>
      {/* Keeps the text content "JUNIOR ACADEMY", two words, for screen
          readers and crawlers; collapses visually between flex items. */}{' '}
      <span
        className="px-3 pb-[5px] pt-1 text-[15px] font-bold italic leading-tight tracking-[0.04em]"
        style={{ backgroundColor: JA.lime, color: JA.forest, transform: 'rotate(1.5deg)' }}
      >
        ACADEMY
      </span>
    </p>
  )
}

/** A strip of semi-transparent tape, for pinning a photo or label. */
export function Tape({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('absolute h-7 w-28 rounded-[2px]', className)}
      style={{ backgroundColor: 'rgba(252,249,242,.75)', boxShadow: '0 2px 6px rgba(0,0,0,.08)' }}
    />
  )
}

// The poster's star burst, as a clip path (24 points).
const BURST =
  'polygon(50% 0%,61% 12%,75% 6%,79% 21%,94% 25%,89% 39%,100% 50%,89% 61%,94% 75%,79% 79%,75% 94%,61% 88%,50% 100%,39% 88%,25% 94%,21% 79%,6% 75%,11% 61%,0% 50%,11% 39%,6% 25%,21% 21%,25% 6%,39% 12%)'

/** The sun-yellow age sticker. Decorative: the subtitle states the ages. */
export function AgeSticker({ label, className }: { label: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('absolute grid h-[118px] w-[118px] place-items-center px-1 text-center text-[19px] font-bold leading-tight', className)}
      style={{ backgroundColor: JA.sun, color: JA.forest, transform: 'rotate(-10deg)', clipPath: BURST }}
    >
      {label}
    </span>
  )
}

/**
 * The page's one call to action: a forest pill to the Junior Academy LINE
 * link. Every LINE button on the page is this component.
 */
export function LineButton({
  href,
  label,
  id,
  className,
}: {
  href: string
  label: string
  id?: string
  className?: string
}) {
  return (
    <a
      id={id}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex min-h-[52px] items-center justify-center gap-2.5 whitespace-nowrap rounded-full px-6 font-semibold transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-px',
        className
      )}
      style={{ backgroundColor: JA.forest, color: JA.paper, boxShadow: JA_SHADOW }}
    >
      <FaLine className="h-[22px] w-[22px]" aria-hidden="true" />
      <span>{label}</span>
    </a>
  )
}

/** A rounded surface in one of the v2 tones. */
export function Surface({
  children,
  tone = 'paper',
  className,
}: {
  children: ReactNode
  tone?: 'paper' | 'cream' | 'lime' | 'sun' | 'forest'
  className?: string
}) {
  const backgroundColor = {
    paper: JA.paper,
    cream: JA.cream,
    lime: JA.lime,
    sun: JA.sunSoft,
    forest: JA.forest,
  }[tone]
  return (
    <div className={cn('rounded-[18px]', className)} style={{ backgroundColor }}>
      {children}
    </div>
  )
}

/**
 * The 10-lesson path: lessons 1 to 5 along the top, Level 1 at the turn, 6 to
 * 10 back along the bottom to Level 2. The flag numbers and LEVEL labels are
 * the same in every language; `start` and `label` are localized.
 */
export function JourneyMap({ start, label }: { start: string; label: string }) {
  const top = [1, 2, 3, 4, 5].map((n, i) => ({ n, x: 150 + i * 100, y: 100 }))
  const bottom = [6, 7, 8, 9, 10].map((n, i) => ({ n, x: 550 - i * 100, y: 300 }))
  const path = 'M60 100 L560 100 C650 100 650 300 560 300 L110 300'
  return (
    <svg viewBox="0 0 700 400" role="img" aria-label={label} className="mx-auto block h-auto w-full max-w-[820px]">
      <path d={path} fill="none" stroke={JA.lime} strokeWidth="62" strokeLinecap="round" strokeLinejoin="round" />
      <path d={path} fill="none" stroke={JA.paper} strokeWidth="3" strokeDasharray="1 13" strokeLinecap="round" />
      <g transform="translate(58 100)">
        <circle r="36" fill={JA.forest} />
        <text y="8" textAnchor="middle" fontSize="21" fontWeight="700" fill={JA.paper}>
          {start}
        </text>
      </g>
      {[...top, ...bottom].map(({ n, x, y }) => (
        <g key={n} transform={`translate(${x} ${y})`}>
          <line x1="0" y1="0" x2="0" y2="-56" stroke={JA.forest} strokeWidth="3.5" />
          <path d="M0 -56 L28 -46 L0 -36 Z" fill={JA.sun} stroke={JA.forest} strokeWidth="2" strokeLinejoin="round" />
          <circle r="25" fill={JA.paper} stroke={JA.forest} strokeWidth="3" />
          <text y="9" textAnchor="middle" fontSize="27" fontWeight="700" fill={JA.forest}>
            {n}
          </text>
        </g>
      ))}
      <g transform="translate(628 200)">
        <circle r="50" fill={JA.sun} stroke={JA.forest} strokeWidth="3" />
        <text y="-8" textAnchor="middle" fontSize="16" fontWeight="700" fill={JA.forest} letterSpacing="1">
          LEVEL
        </text>
        <text y="24" textAnchor="middle" fontSize="34" fontWeight="700" fill={JA.forest}>
          1
        </text>
      </g>
      <g transform="translate(62 300)">
        <circle r="52" fill={JA.forest} stroke={JA.lime} strokeWidth="4" />
        <text y="-8" textAnchor="middle" fontSize="16" fontWeight="700" fill={JA.sun} letterSpacing="1">
          LEVEL
        </text>
        <text y="24" textAnchor="middle" fontSize="34" fontWeight="700" fill={JA.paper}>
          2
        </text>
      </g>
    </svg>
  )
}
