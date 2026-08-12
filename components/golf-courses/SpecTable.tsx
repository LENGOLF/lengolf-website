import { Check, X } from 'lucide-react'
import type { GolfCourse } from '@/types/golf-courses'
import { driveTimeLabel } from '@/lib/format'

interface Props {
  a: GolfCourse
  b: GolfCourse
}

interface Row {
  label: string
  /** Cell renderer per course — returns either a string or a React node. */
  cell: (c: GolfCourse) => React.ReactNode
}

const ROWS: Row[] = [
  { label: 'Holes / Par', cell: (c) => `${c.holes} · Par ${c.par}` },
  { label: 'Designer', cell: (c) => c.designer ?? '—' },
  { label: 'Year opened', cell: (c) => (c.year_opened ? String(c.year_opened) : '—') },
  {
    label: 'Drive time',
    cell: (c) => driveTimeLabel(c.drive_time_from_bangkok_min, false) ?? '—',
  },
  {
    label: 'Distance from Bangkok',
    cell: (c) =>
      c.distance_from_bangkok_km !== null ? `${c.distance_from_bangkok_km} km` : '—',
  },
  {
    label: 'Weekday green fee',
    cell: (c) =>
      c.green_fee_weekday_thb !== null
        ? `${c.green_fee_weekday_thb.toLocaleString('en-US')} THB${c.fee_is_seasonal ? ' (low season)' : ''}`
        : '—',
  },
  {
    label: 'Weekend green fee',
    cell: (c) =>
      c.green_fee_weekend_thb !== null
        ? `${c.green_fee_weekend_thb.toLocaleString('en-US')} THB${c.fee_is_seasonal ? ' (high season)' : ''}`
        : '—',
  },
  {
    label: 'Caddie fee',
    cell: (c) =>
      c.caddie_fee_thb !== null && c.caddie_fee_thb > 0
        ? `${c.caddie_fee_thb.toLocaleString('en-US')} THB`
        : c.caddie_fee_thb === 0
          ? 'Included'
          : '—',
  },
  {
    label: 'Cart fee',
    cell: (c) =>
      c.cart_fee_thb !== null && c.cart_fee_thb > 0
        ? `${c.cart_fee_thb.toLocaleString('en-US')} THB`
        : c.cart_fee_thb === 0
          ? 'Included'
          : '—',
  },
  { label: 'Caddie required', cell: (c) => <BoolBadge value={c.caddie_required} /> },
  { label: 'Cart required', cell: (c) => <BoolBadge value={c.cart_required} /> },
  { label: 'Driving range', cell: (c) => <BoolBadge value={c.driving_range} /> },
  {
    label: 'On-site club rental',
    cell: (c) => (
      <BoolBadge value={c.club_rental_available ?? null} />
    ),
  },
]

function BoolBadge({ value }: { value: boolean | null }) {
  if (value === true)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
        <Check className="h-3 w-3" /> Yes
      </span>
    )
  if (value === false)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
        <X className="h-3 w-3" /> No
      </span>
    )
  return <span className="text-xs text-muted-foreground">—</span>
}

export default function SpecTable({ a, b }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      {/* Header row */}
      <div className="grid grid-cols-[1fr_1fr] gap-px bg-border md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="hidden bg-[#f6fffa] px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-primary md:block">
          Spec
        </div>
        <div className="bg-[#f6fffa] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            {a.region}
          </p>
          <p className="mt-0.5 text-sm font-bold leading-tight text-foreground">{a.name}</p>
        </div>
        <div className="bg-[#f6fffa] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            {b.region}
          </p>
          <p className="mt-0.5 text-sm font-bold leading-tight text-foreground">{b.name}</p>
        </div>
      </div>

      {/* Body rows */}
      <div className="divide-y divide-border bg-white">
        {ROWS.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[1fr_1fr] gap-px md:grid-cols-[1.2fr_1fr_1fr]"
          >
            {/* Label — hidden on mobile (it's set as a row header above each cell instead) */}
            <div className="hidden bg-[#fbfbfb] px-4 py-3 text-xs font-semibold text-muted-foreground md:block">
              {row.label}
            </div>
            <div className="px-4 py-3 text-sm text-foreground">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:hidden">
                {row.label}
              </p>
              {row.cell(a)}
            </div>
            <div className="px-4 py-3 text-sm text-foreground">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:hidden">
                {row.label}
              </p>
              {row.cell(b)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
