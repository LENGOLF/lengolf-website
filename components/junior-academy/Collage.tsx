import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Paper-collage pieces for /junior-golf-academy/ ONLY.
 *
 * The Junior Academy's look (cream paper, torn-paper edges, taped labels, the
 * sun-yellow age burst) belongs to that program alone, per the owner's team
 * feedback: it must not leak into shared components or other pages. Keep every
 * collage element in this folder and import it from nowhere else.
 *
 * Colors follow the poster and the lengolf-design tokens (forest #265020, lime
 * #8dc743), not the legacy site greens. All server components, no motion.
 */

export const JA = {
  paper: '#f4eee2',
  card: '#fcf9f2',
  forest: '#265020',
  forestDark: '#1a3308',
  lime: '#8dc743',
  sun: '#f2c14e',
  ink: '#22301d',
} as const

// Fractal noise tinted to look like recycled paper fibres. Inline, ~400 bytes,
// no request.
const PAPER_NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.42 0 0 0 0 0.36 0 0 0 0 0.24 0 0 0 0.13 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

export const paperStyle: CSSProperties = {
  backgroundColor: JA.paper,
  backgroundImage: PAPER_NOISE,
}

/** A full-width section on cream paper. */
export function PaperSection({
  children,
  id,
  className,
  tone = 'paper',
}: {
  children: ReactNode
  id?: string
  className?: string
  tone?: 'paper' | 'forest'
}) {
  const style: CSSProperties =
    tone === 'forest'
      ? { backgroundColor: JA.forest, backgroundImage: PAPER_NOISE, color: JA.card }
      : paperStyle
  return (
    <section id={id} className={cn('relative py-14 lg:py-20', className)} style={style}>
      <div className="section-max-width section-padding">{children}</div>
    </section>
  )
}

// Deterministic jagged edge: same markup on every render, no hydration risk.
function tornPath(seed: number, teeth = 48): string {
  let s = seed
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  const pts: string[] = ['M0,24', 'L0,10']
  for (let i = 1; i <= teeth; i++) {
    const x = (1200 / teeth) * i
    const y = 4 + rand() * 12
    pts.push(`L${x.toFixed(1)},${y.toFixed(1)}`)
  }
  pts.push('L1200,24', 'Z')
  return pts.join(' ')
}

/**
 * A torn-paper strip in `color`, with the white fibre edge real torn paper
 * shows. Place it at the top of a section of the same color (default) or flip
 * it to sit at the bottom.
 */
export function TornEdge({
  color,
  seed = 7,
  flip = false,
  className,
}: {
  color: string
  seed?: number
  flip?: boolean
  className?: string
}) {
  const d = tornPath(seed)
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
      className={cn('block h-4 w-full md:h-6', flip && 'rotate-180', className)}
    >
      <path d={d} fill="#ffffff" opacity="0.85" transform="translate(0,-3)" />
      <path d={d} fill={color} />
    </svg>
  )
}

/** A strip of semi-transparent tape, for pinning a photo or label. */
export function Tape({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('absolute h-6 w-20 rounded-[2px] bg-white/60', className)}
      style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}
    />
  )
}

/** Paper card with a soft drop shadow and an optional slight tilt. */
export function PaperCard({
  children,
  className,
  tilt = 0,
}: {
  children: ReactNode
  className?: string
  tilt?: number
}) {
  return (
    <div
      className={cn('relative rounded-[3px] p-6 md:p-7', className)}
      style={{
        backgroundColor: JA.card,
        boxShadow: '0 1px 0 rgba(0,0,0,0.05), 0 10px 24px -12px rgba(38,80,32,0.35)',
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
      }}
    >
      {children}
    </div>
  )
}

/**
 * Section heading set on two torn-paper blocks, the poster's JUNIOR / ACADEMY
 * treatment: `lead` on forest, `suffix` on lime. Renders a real <h2>.
 */
export function CollageHeading({
  lead,
  suffix,
  onForest = false,
  className,
}: {
  lead: string
  suffix: string
  onForest?: boolean
  className?: string
}) {
  return (
    <h2 className={cn('mb-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center', className)}>
      <span
        className="inline-block px-4 py-1.5 text-2xl font-extrabold uppercase italic leading-tight md:text-3xl"
        style={{
          backgroundColor: onForest ? JA.lime : JA.forest,
          color: onForest ? JA.forest : JA.card,
          transform: 'rotate(-1deg)',
        }}
      >
        {lead}
      </span>
      <span
        className="inline-block px-4 py-1.5 text-2xl font-extrabold uppercase italic leading-tight md:text-3xl"
        style={{
          backgroundColor: onForest ? JA.card : JA.lime,
          color: JA.forest,
          transform: 'rotate(0.8deg)',
        }}
      >
        {suffix}
      </span>
    </h2>
  )
}

/** The sun-yellow burst badge from the poster (ages). Text stays real text. */
export function SunBurst({ label, className }: { label: string; className?: string }) {
  const points: string[] = []
  const spikes = 16
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? 50 : 41
    const a = (Math.PI * i) / spikes - Math.PI / 2
    points.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`)
  }
  return (
    <div className={cn('relative grid h-28 w-28 place-items-center md:h-32 md:w-32', className)}>
      <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" style={{ transform: 'rotate(-8deg)' }}>
        <polygon points={points.join(' ')} fill={JA.sun} stroke="#ffffff" strokeWidth="1.5" />
      </svg>
      <span
        className="relative px-3 text-center text-sm font-extrabold uppercase leading-tight md:text-base"
        style={{ color: JA.forest, transform: 'rotate(-8deg)' }}
      >
        {label}
      </span>
    </div>
  )
}

/** Round green check, as on the poster's checklist. */
export function CheckDot() {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full"
      style={{ backgroundColor: JA.lime }}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke={JA.forest} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </span>
  )
}
