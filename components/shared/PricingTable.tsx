import type { ReactNode } from 'react'

export interface PricingColumn<T> {
  /** Key on the row object. */
  key: keyof T
  /** Column header shown in the table head. Also used as the <dt> in mobile cards when rendered as a labelled list. */
  label: string
  /** Align the column right (typically price / numeric columns). */
  align?: 'left' | 'right'
  /** Style as the row's primary label (first column). Rendered as strong text. */
  primary?: boolean
  /** Style as a dominant value (price). Tabular + bold + brand green. Multiple columns can be emphasized. */
  emphasis?: boolean
  /** Additional class names for the <td>. */
  tdClassName?: string
  /** Additional class names for the <th>. */
  thClassName?: string
}

export interface PricingTableBadge {
  /** Visible text. */
  label: string
  /**
   * Visual style:
   * - `gold`  — gold pill + highlights the whole row (e.g. "Best Value")
   * - `amber` — warm amber pill, no row highlight (e.g. "Promo")
   * - `green` — muted green pill, no row highlight (e.g. "Trending")
   */
  tone?: 'gold' | 'amber' | 'green'
}

export interface PricingTableProps<T> {
  /** Screen-reader-friendly caption (hidden visually, used for SEO + a11y). */
  caption: string
  columns: PricingColumn<T>[]
  rows: T[]
  /** Short notes rendered as a bullet list below the table. */
  notes?: string[]
  /** Stable key extractor for each row. */
  rowKey: (row: T) => string
  /** Returns a badge config for the row (or null). */
  badgeFor?: (row: T) => PricingTableBadge | null | undefined
}

/**
 * Responsive, translation-friendly pricing table.
 *
 * Desktop (sm+): semantic <table> with a brand-green header row. Gold-tone
 * badges highlight the whole row (gold tint + left accent bar); amber- and
 * green-tone badges render as inline chips beside the primary column.
 *
 * Mobile (<sm): one card per row.
 *   - If the table has ≥2 emphasised columns, they render as a horizontal
 *     grid at the bottom of the card (good for matrices like bay rates:
 *     weekday × weekend). Column labels stay compact, no long "(Mon–Thu)"
 *     strings cluttering the card.
 *   - Otherwise the single emphasised column sits top-right and the other
 *     non-primary columns render as a labelled <dl>.
 *
 * The <caption> is sr-only but present in the DOM for SEO + screen readers.
 */
export default function PricingTable<T>({
  caption,
  columns,
  rows,
  notes,
  rowKey,
  badgeFor,
}: PricingTableProps<T>) {
  const renderBadge = (badge: PricingTableBadge) => {
    const tone = badge.tone ?? 'gold'
    const styles =
      tone === 'gold'
        ? { backgroundColor: '#c8a96e', color: '#ffffff' }
        : tone === 'amber'
          ? { backgroundColor: '#f59e0b', color: '#ffffff' }
          : { backgroundColor: 'rgba(0,116,41,0.12)', color: '#007429' }
    return (
      <span
        className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
        style={styles}
      >
        {badge.label}
      </span>
    )
  }

  const emphasisCols = columns.filter((c) => c.emphasis)
  const primaryCol = columns.find((c) => c.primary) ?? columns[0]

  return (
    <>
      {/* ── Desktop table (sm and up) ── */}
      {/* overflow-x-auto, not hidden: between 640 and ~700px a six-column
          table (the lessons per-hour column) is wider than its box, and hidden
          clipped the right-hand columns instead of letting them scroll. */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-primary/10 shadow-sm bg-white">
        <table className="w-full text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="text-left text-white" style={{ backgroundColor: '#005a32' }}>
              {columns.map((col, i) => (
                <th
                  key={String(col.key)}
                  scope="col"
                  className={`py-4 font-semibold ${
                    i === 0 ? 'pl-5' : i === columns.length - 1 ? 'pr-5 pl-3' : 'px-3'
                  } ${col.align === 'right' ? 'text-right' : 'text-left'} ${col.thClassName ?? ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => {
              const badge = badgeFor?.(row)
              // Only gold-tone badges highlight the whole row. Amber/green
              // badges are inline chips that add context without dominating.
              const isFeatured = Boolean(badge) && (badge?.tone ?? 'gold') === 'gold'
              return (
                <tr
                  key={rowKey(row)}
                  className={`border-t border-primary/10 transition-colors ${
                    isFeatured
                      ? ''
                      : rowIdx % 2 === 1
                        ? 'bg-primary/[0.02] hover:bg-primary/5'
                        : 'hover:bg-primary/5'
                  }`}
                  style={
                    isFeatured
                      ? {
                          backgroundColor: '#f5ecd9',
                          boxShadow: 'inset 3px 0 0 0 #c8a96e',
                        }
                      : undefined
                  }
                >
                  {columns.map((col, i) => {
                    const value = row[col.key] as ReactNode
                    const isFirst = i === 0
                    const isLast = i === columns.length - 1
                    const padding = isFirst ? 'pl-5' : isLast ? 'pr-5 pl-3' : 'px-3'
                    const alignment = col.align === 'right' ? 'text-right' : 'text-left'
                    return (
                      <td
                        key={String(col.key)}
                        className={`py-4 ${padding} ${alignment} ${col.tdClassName ?? ''} ${
                          col.primary ? 'font-medium' : ''
                        } ${col.emphasis ? 'font-semibold' : ''}`}
                        style={
                          col.emphasis
                            ? {
                                color: isFeatured ? '#003d22' : '#007429',
                                fontVariantNumeric: 'tabular-nums',
                                letterSpacing: '-0.01em',
                              }
                            : undefined
                        }
                      >
                        {col.primary && badge ? (
                          <span className="inline-flex items-center gap-2">
                            <span
                              className={isFeatured ? 'font-semibold' : ''}
                              style={isFeatured ? { color: '#003d22' } : undefined}
                            >
                              {value}
                            </span>
                            {renderBadge(badge)}
                          </span>
                        ) : col.primary && isFeatured ? (
                          <span className="font-semibold" style={{ color: '#003d22' }}>
                            {value}
                          </span>
                        ) : (
                          value
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards (below sm) ── */}
      <div className="sm:hidden space-y-3">
        <span className="sr-only">{caption}</span>
        {rows.map((row) => {
          const badge = badgeFor?.(row)
          const isFeatured = Boolean(badge) && (badge?.tone ?? 'gold') === 'gold'
          // Matrix mode: ≥2 emphasised columns render as a horizontal grid.
          // Otherwise the single emphasis column sits inline with the title.
          const isMatrix = emphasisCols.length >= 2
          const otherCols = columns.filter((c) => c !== primaryCol && !c.emphasis)
          return (
            <article
              key={rowKey(row)}
              className={`relative rounded-lg p-4 ${
                isFeatured ? 'border bg-[#f5ecd9]' : 'border border-primary/10 bg-white'
              }`}
              style={isFeatured ? { borderColor: '#c8a96e', borderTopWidth: '3px' } : undefined}
            >
              {/* Title row — primary column + inline chip if any.
                  Uses <div role="rowheader"> rather than a heading tag: the
                  row label isn't a section heading (the section <h2> above
                  already covers that), and an <h4> here would skip levels
                  since the enclosing page has no <h3>. */}
              <div className={`flex items-center justify-between gap-3 ${isMatrix ? '' : 'items-baseline'}`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <div
                    role="rowheader"
                    className="font-semibold text-base"
                    style={isFeatured ? { color: '#003d22' } : undefined}
                  >
                    {row[primaryCol.key] as ReactNode}
                  </div>
                  {badge ? renderBadge(badge) : null}
                </div>
                {/* Single-emphasis mode: price sits on the right of the title */}
                {!isMatrix && emphasisCols[0] ? (
                  <div
                    className="font-bold whitespace-nowrap"
                    style={{
                      color: isFeatured ? '#003d22' : '#007429',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {row[emphasisCols[0].key] as ReactNode}
                  </div>
                ) : null}
              </div>

              {/* Matrix mode: grid of emphasized columns at the bottom */}
              {isMatrix ? (
                <div
                  className={`mt-3 grid gap-2`}
                  style={{ gridTemplateColumns: `repeat(${emphasisCols.length}, minmax(0, 1fr))` }}
                >
                  {emphasisCols.map((col) => (
                    <div
                      key={String(col.key)}
                      className="rounded-md bg-primary/[0.04] px-3 py-2"
                    >
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {col.label}
                      </div>
                      <div
                        className="mt-0.5 font-bold text-sm"
                        style={{
                          color: isFeatured ? '#003d22' : '#007429',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {row[col.key] as ReactNode}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Remaining columns as a compact <dl> */}
              {otherCols.length > 0 ? (
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                  {otherCols.map((col) => (
                    <div key={String(col.key)} className="contents">
                      <dt className="text-muted-foreground">{col.label}</dt>
                      <dd
                        className={isFeatured ? 'font-medium' : ''}
                        style={isFeatured ? { color: '#003d22' } : undefined}
                      >
                        {(row[col.key] as ReactNode) || '—'}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </article>
          )
        })}
      </div>

      {notes && notes.length > 0 ? (
        <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
    </>
  )
}
