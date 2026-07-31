import { ImageResponse } from 'next/og'

export const OG_SIZE = { width: 1200, height: 630 }

interface OgCardProps {
  /** Small uppercase gold line above the title (e.g. province / region). */
  eyebrow: string
  /** Main heading — course or hub name. */
  title: string
  /** Fact chips rendered under the title (e.g. "18 holes · Par 72"). */
  chips?: string[]
  /** Muted footer line. */
  footer?: string
}

/**
 * Shared branded OpenGraph card for the golf-course cluster, rendered with
 * next/og from structured data — no photo assets required or licensed.
 * Used by the opengraph-image.tsx route files for the course detail pages,
 * region hubs, and the main hub, so all ~165 share cards come from one
 * implementation.
 *
 * Satori constraints: every multi-child div needs explicit display:flex,
 * and only a bundled default sans font is available (loading Poppins would
 * mean a network fetch per render).
 */
export function ogCard({ eyebrow, title, chips = [], footer }: OgCardProps) {
  const titleSize = title.length > 34 ? 56 : title.length > 24 ? 64 : 72

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          backgroundColor: '#003d22',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Decorative blobs — mirrors the hero styling on the pages */}
        <div
          style={{
            position: 'absolute',
            right: -140,
            top: -140,
            width: 480,
            height: 480,
            borderRadius: 480,
            backgroundColor: 'rgba(0,90,50,0.55)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -100,
            bottom: -160,
            width: 380,
            height: 380,
            borderRadius: 380,
            backgroundColor: 'rgba(0,122,69,0.25)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 260,
            bottom: 40,
            width: 220,
            height: 220,
            borderRadius: 220,
            backgroundColor: 'rgba(200,169,110,0.10)',
            display: 'flex',
          }}
        />

        {/* Top bar: brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: 6,
              color: '#c8a96e',
            }}
          >
            LENGOLF
          </div>
          <div style={{ display: 'flex', width: 6, height: 6, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.35)' }} />
          <div style={{ display: 'flex', fontSize: 24, color: 'rgba(255,255,255,0.55)' }}>len.golf</div>
        </div>

        {/* Middle: eyebrow + title + chips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 980 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 5,
              textTransform: 'uppercase',
              color: '#c8a96e',
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: titleSize,
              fontWeight: 800,
              lineHeight: 1.08,
              color: '#ffffff',
            }}
          >
            {title}
          </div>
          {chips.length > 0 && (
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {chips.map((chip) => (
                <div
                  key={chip}
                  style={{
                    display: 'flex',
                    padding: '10px 22px',
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.25)',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    fontSize: 24,
                    color: 'rgba(255,255,255,0.85)',
                  }}
                >
                  {chip}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', fontSize: 24, color: 'rgba(255,255,255,0.5)' }}>
          {footer ?? 'Green Fees · Course Guide · Golf Club Rental'}
        </div>
      </div>
    ),
    OG_SIZE
  )
}
