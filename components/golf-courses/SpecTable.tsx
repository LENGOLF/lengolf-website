import { Check, X } from 'lucide-react'
import type { GolfCourse } from '@/types/golf-courses'
import { driveTimeLabel } from '@/lib/format'
import { pricesByDayOfWeek, feeLabelsEn, feeBasisNoteEn } from '@/lib/course-fees'

interface Props {
  a: GolfCourse
  b: GolfCourse
}

interface Row {
  label: string
  /** Cell renderer per course — returns either a string or a React node. */
  cell: (c: GolfCourse) => React.ReactNode
}

const ROWS_HEAD: Row[] = [
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
]

/**
 * The two fee rows share ONE label across both columns, so the label can only name
 * a basis when both courses price on the same one. Comparing a day-of-week course
 * against a seasonal one, the label stays basis-neutral and each cell carries its
 * own basis — otherwise the row renders "Weekday green fee: 2,800 THB (low season)",
 * which contradicts itself on a single line.
 */
/**
 * A bare em-dash in a two-column fee row is read as "this course has no such
 * rate", not "we don't have the number". That misreads badly on the HIGHER-fee
 * row of a seasonal course: the cell sits beside a filled `4,500 THB (weekend)`
 * and implies the seasonal course charges no peak premium — the opposite of
 * what its own prose says. Name the missing basis instead, so the blank reads
 * as an unpublished figure. 23 courses carry a null upper fee, and this is the
 * one surface that puts two of them side by side.
 */
function unpublished(c: GolfCourse, which: 'lower' | 'upper'): string {
  return `— (${feeBasisNoteEn(c, which)} rate not published)`
}

function feeRows(a: GolfCourse, b: GolfCourse): Row[] {
  const mixedBasis = pricesByDayOfWeek(a) !== pricesByDayOfWeek(b)
  const shared = feeLabelsEn(a)
  const note = (c: GolfCourse, which: 'lower' | 'upper') =>
    mixedBasis ? ` (${feeBasisNoteEn(c, which)})` : ''
  return [
    {
      label: mixedBasis ? 'Lower green fee' : `${shared.lower} green fee`,
      cell: (c) =>
        c.green_fee_weekday_thb !== null
          ? `${c.green_fee_weekday_thb.toLocaleString('en-US')} THB${note(c, 'lower')}`
          : unpublished(c, 'lower'),
    },
    {
      label: mixedBasis ? 'Higher green fee' : `${shared.upper} green fee`,
      cell: (c) =>
        c.green_fee_weekend_thb !== null
          ? `${c.green_fee_weekend_thb.toLocaleString('en-US')} THB${note(c, 'upper')}`
          : unpublished(c, 'upper'),
    },
  ]
}

const ROWS_TAIL: Row[] = [
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
  const rows = [...ROWS_HEAD, ...feeRows(a, b), ...ROWS_TAIL]
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
        {rows.map((row) => (
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
