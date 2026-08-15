'use client'

import { usePathname } from 'next/navigation'
import { ALL_LOCALES } from '@/lib/translated-routes'

/**
 * Hides the global site chrome (header, footer, LINE widget, sticky bar) on a
 * small set of standalone routes.
 *
 * App Router layouts compose downward — a nested layout ADDS to its parent, it
 * cannot replace it — so the only ways to give one route a different shell are
 * this gate or moving every other route into a `(site)` group. The gate touches
 * one file; the refactor touches twenty-five.
 *
 * `usePathname` resolves during SSR in the App Router, so the chrome is absent
 * from the server-rendered HTML too — nothing flashes in and then disappears.
 *
 * Fail-open by design: any path this does not explicitly recognise keeps its
 * chrome. A bug here can leave an extra header on the spec sheet; it can never
 * strip the navigation off the rest of the site.
 */
const BARE_ROUTES = ['/golf-club-specs'] as const

/** "/th/golf-club-specs/" -> "/golf-club-specs". Locale prefix is optional. */
function normalise(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '') || '/'
  const segments = trimmed.split('/')
  if (segments.length > 1 && (ALL_LOCALES as readonly string[]).includes(segments[1])) {
    segments.splice(1, 1)
  }
  return segments.join('/') || '/'
}

export function isBareRoute(pathname: string): boolean {
  const path = normalise(pathname)
  return BARE_ROUTES.some((route) => path === route || path.startsWith(`${route}/`))
}

export default function BareRouteGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname && isBareRoute(pathname)) return null
  return <>{children}</>
}
