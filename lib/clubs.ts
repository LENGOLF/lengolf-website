import { createClient } from '@/lib/supabase/client'

export interface UsedClub {
  id: string
  brand: string
  model: string | null
  club_type: string
  specification: string | null
  shaft: string | null
  gender: string
  condition: string
  price: number
  description: string | null
  image_url: string | null
  image_urls: string[]
  purchased_at: string | null
  available_for_sale: boolean
  available_for_rental: boolean
  set_id: string | null
  created_at: string
  updated_at: string
}

/** Explicit column list — never use select('*') to avoid leaking internal fields like cost */
const CLUB_COLUMNS =
  'id, brand, model, club_type, specification, shaft, gender, condition, price, description, image_url, image_urls, purchased_at, available_for_sale, available_for_rental, set_id, created_at, updated_at'

export async function getAvailableUsedClubs(): Promise<UsedClub[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('used_clubs_inventory')
    .select(CLUB_COLUMNS)
    .eq('available_for_sale', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching used clubs:', error)
    return []
  }

  return data || []
}

export async function getUsedClubById(id: string): Promise<UsedClub | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('used_clubs_inventory')
    .select(CLUB_COLUMNS)
    .eq('id', id)
    .eq('available_for_sale', true)
    .single()

  if (error || !data) return null
  return data
}

export async function getUsedClubIds(): Promise<string[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('used_clubs_inventory')
    .select('id')
    .eq('available_for_sale', true)

  if (error || !data) return []
  return data.map((c) => c.id)
}

// ── Rental Club Set Pricing (from DB) ──

export interface RentalPricingRow {
  duration: string
  premium: string
  premiumPlus: string
  note?: string
}

function formatThb(value: number | null): string {
  if (value == null) return '—'
  return value >= 1000 ? `${value.toLocaleString('en-US')} THB` : `${value} THB`
}

export async function getRentalClubPricing(): Promise<{
  indoor: RentalPricingRow[]
  course: RentalPricingRow[]
}> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('rental_club_sets')
    .select('tier, indoor_price_1h, indoor_price_2h, indoor_price_3h, indoor_price_4h, indoor_price_5h, course_price_1d, course_price_3d, course_price_7d, course_price_14d')
    .eq('is_active', true)
    // Exclude website-hidden sets (e.g. the staff-only left-handed set). Aggregation by
    // tier means a hidden premium set wouldn't visibly change the table, but filter for
    // correctness so the pricing only ever reflects publicly-bookable sets.
    .eq('website_visible', true)
    // Stable order so any positional read stays deterministic (pricing itself is
    // min-per-tier and order-independent).
    .order('display_order', { ascending: true })
    .order('slug', { ascending: true })

  if (error || !data) {
    console.error('Error fetching rental pricing:', error)
    return { indoor: [], course: [] }
  }

  type PriceKey = 'indoor_price_1h' | 'indoor_price_2h' | 'indoor_price_3h' | 'indoor_price_4h' | 'indoor_price_5h' | 'course_price_1d' | 'course_price_3d' | 'course_price_7d' | 'course_price_14d'

  // The public table is a "from"-price table: cheapest live row per tier per
  // duration. Deterministic regardless of row order — the old
  // `data.find(r => r.tier === 'premium')` took whichever premium row PostgREST
  // returned first, which became non-deterministic once a second premium set
  // (REVA) existed. Only looked correct because all premium rows share pricing.
  const byTier = (tier: string) => data.filter((r) => r.tier === tier)
  const minPrice = (tier: string, key: PriceKey): number | null => {
    const vals = byTier(tier)
      .map((r) => r[key])
      .filter((v): v is number => v != null)
    return vals.length > 0 ? Math.min(...vals) : null
  }

  const premiumRows = byTier('premium')
  const premiumPlusRows = byTier('premium-plus')

  if (premiumRows.length === 0 || premiumPlusRows.length === 0) {
    return { indoor: [], course: [] }
  }

  // Silent public-price drift is the real hazard: if two live rows of one tier
  // ever disagree, the table shows the cheapest — make the divergence loud.
  for (const [tier, rows] of [['premium', premiumRows], ['premium-plus', premiumPlusRows]] as const) {
    if (new Set(rows.map((r) => r.course_price_1d)).size > 1) {
      console.warn(`rental pricing: ${tier} rows disagree on course_price_1d — table shows the cheapest`)
    }
  }

  const premium = Object.fromEntries(
    (['indoor_price_1h', 'indoor_price_2h', 'indoor_price_3h', 'indoor_price_4h', 'indoor_price_5h', 'course_price_1d', 'course_price_3d', 'course_price_7d', 'course_price_14d'] as PriceKey[])
      .map((k) => [k, minPrice('premium', k)])
  ) as Record<PriceKey, number | null>
  const premiumPlus = Object.fromEntries(
    (['indoor_price_1h', 'indoor_price_2h', 'indoor_price_3h', 'indoor_price_4h', 'indoor_price_5h', 'course_price_1d', 'course_price_3d', 'course_price_7d', 'course_price_14d'] as PriceKey[])
      .map((k) => [k, minPrice('premium-plus', k)])
  ) as Record<PriceKey, number | null>

  const indoorDurations: { key: PriceKey; label: string }[] = [
    { key: 'indoor_price_1h', label: '1 Hour' },
    { key: 'indoor_price_2h', label: '2 Hours' },
    { key: 'indoor_price_3h', label: '3 Hours' },
    { key: 'indoor_price_4h', label: '4 Hours' },
    { key: 'indoor_price_5h', label: '5 Hours' },
  ]

  const indoor: RentalPricingRow[] = indoorDurations
    .filter((d) => premium[d.key] != null && premiumPlus[d.key] != null)
    .map((d) => ({
      duration: d.label,
      premium: formatThb(premium[d.key]),
      premiumPlus: formatThb(premiumPlus[d.key]),
    }))

  const courseNotes: Record<string, string> = {
    course_price_3d: 'Pay 2, get 1 free',
    course_price_7d: 'Pay 4, get 3 free',
    course_price_14d: 'Pay 7, get 7 free',
  }

  const courseDurations: { key: PriceKey; label: string }[] = [
    { key: 'course_price_1d', label: '1 Day' },
    { key: 'course_price_3d', label: '3 Days' },
    { key: 'course_price_7d', label: '7 Days' },
    { key: 'course_price_14d', label: '14 Days' },
  ]

  const course: RentalPricingRow[] = courseDurations
    .filter((d) => premium[d.key] != null && premiumPlus[d.key] != null)
    .map((d) => ({
      duration: d.label,
      premium: formatThb(premium[d.key]),
      premiumPlus: formatThb(premiumPlus[d.key]),
      note: courseNotes[d.key],
    }))

  return { indoor, course }
}

// ── Rental Club Sets (DB-driven cards + galleries) ──

export interface SetVariantImage {
  path: string
  alt: string
}

/**
 * A colour/shaft variant within ONE bookable set (soft preference, never a
 * separate row — availability stays combined). `images` present = overrides the
 * set's base gallery (colour variants); absent = inherits it (shaft variants).
 */
export interface SetVariant {
  key: string
  label: string | null
  swatch?: string | null
  thumb?: string | null
  spec?: string | null
  images?: SetVariantImage[]
}

export interface RentalClubSet {
  id: string
  slug: string
  name: string
  tier: string
  gender: string
  brand: string | null
  model: string | null
  specifications: string[]
  gallery: SetVariantImage[]
  variants: SetVariant[]
  variant_axis: string | null
  display_order: number
  /** false = live and bookable but deliberately off the public cards (e.g. the
   *  left-handed set, which is on-request only). Always true for rows returned
   *  by getRentalClubSets(); only the specs page asks for the hidden ones. */
  website_visible: boolean
}

/** Defensive parse — DB-authored jsonb, never trust the shape. */
function parseImages(raw: unknown): SetVariantImage[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter(
      (i): i is { path: string; alt?: unknown } => !!i && typeof i === 'object' && typeof (i as SetVariantImage).path === 'string'
    )
    .map((i) => ({ path: i.path, alt: typeof i.alt === 'string' ? i.alt : '' }))
}

function parseVariants(raw: unknown): SetVariant[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((v): v is Record<string, unknown> => !!v && typeof v === 'object' && typeof (v as SetVariant).key === 'string')
    .map((v) => ({
      key: v.key as string,
      label: typeof v.label === 'string' ? v.label : null,
      swatch: typeof v.swatch === 'string' ? v.swatch : null,
      thumb: typeof v.thumb === 'string' ? v.thumb : null,
      spec: typeof v.spec === 'string' ? v.spec : null,
      images: v.images !== undefined ? parseImages(v.images) : undefined,
    }))
}

/** Variant images if present, else the set's base gallery. */
export function setGallery(set: Pick<RentalClubSet, 'gallery' | 'variants'>, key?: string | null): SetVariantImage[] {
  const variant = key ? set.variants.find((v) => v.key === key) : undefined
  if (variant?.images && variant.images.length > 0) return variant.images
  return set.gallery
}

const SET_COLUMNS =
  'id, slug, name, tier, gender, brand, model, specifications, gallery, variants, variant_axis, display_order, website_visible'

type RentalSetRow = {
  id: string
  slug: string
  name: string
  tier: string
  gender: string
  brand: string | null
  model: string | null
  specifications: unknown
  gallery: unknown
  variants: unknown
  variant_axis: string | null
  display_order: number
  website_visible: boolean
}

function mapSet(row: RentalSetRow): RentalClubSet {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tier: row.tier,
    gender: row.gender,
    brand: row.brand,
    model: row.model,
    specifications: Array.isArray(row.specifications) ? (row.specifications as string[]).filter((s) => typeof s === 'string') : [],
    gallery: parseImages(row.gallery),
    variants: parseVariants(row.variants),
    variant_axis: row.variant_axis,
    display_order: row.display_order,
    website_visible: row.website_visible,
  }
}

/** Publicly-bookable sets with their DB-driven galleries, in display order. */
export async function getRentalClubSets(): Promise<RentalClubSet[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('rental_club_sets')
    .select(SET_COLUMNS)
    .eq('is_active', true)
    .eq('website_visible', true)
    .order('display_order', { ascending: true })
    .order('slug', { ascending: true })

  if (error || !data) {
    console.error('Error fetching rental club sets:', error)
    return []
  }

  return (data as RentalSetRow[]).map(mapSet)
}

/**
 * Every LIVE set, including ones hidden from the public cards.
 *
 * Only the spec sheet uses this. It deliberately does NOT filter on
 * website_visible, because a set can be genuinely rentable while being kept off
 * the marketing cards — the left-handed set is on-request only, and "do you
 * have left-handed clubs?" is one of the most common chat questions, so its
 * specs belong on the sheet.
 *
 * is_active is still enforced: a retired set (Majesty) must never appear here,
 * or the sheet would generate enquiries for clubs we cannot hand out. Callers
 * are expected to allow-list which hidden slugs they surface — see
 * EXTRA_SPEC_SLUGS on the spec page — so a newly-hidden set stays hidden until
 * someone decides otherwise.
 */
export async function getAllLiveRentalClubSets(): Promise<RentalClubSet[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('rental_club_sets')
    .select(SET_COLUMNS)
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('slug', { ascending: true })

  if (error || !data) {
    console.error('Error fetching all rental club sets:', error)
    return []
  }

  return (data as RentalSetRow[]).map(mapSet)
}

// ── Spec-sheet parsing ──

/** A canonical row in the spec matrix. Order here is the display order. */
export const SPEC_ROWS = ['driver', 'wood', 'hybrid', 'irons', 'wedges', 'putter', 'bag', 'other'] as const
export type SpecRow = (typeof SPEC_ROWS)[number]

/**
 * Classify one club description into a spec-matrix row.
 *
 * Order is load-bearing: "irons 6-P steel S-flex" must land on `irons` before
 * the loft check could claim it, and a wedge line mentioning a degree must not
 * be read as a driver. Anything unrecognised falls to `other` rather than being
 * dropped — a silently-vanishing club is worse than an ugly row.
 */
export function classifySpecPart(part: string): SpecRow {
  const s = part.toLowerCase()
  if (/\biron/.test(s)) return 'irons'
  if (/wedge|jaws|\bsw\b|\bpw\b/.test(s)) return 'wedges'
  if (/putter|odyssey/.test(s)) return 'putter'
  if (/hybrid|\b\dh\b/.test(s)) return 'hybrid'
  if (/wood|\b\dw\b|fairway/.test(s)) return 'wood'
  if (/driver|ai smoke|1[02]\.5°/.test(s)) return 'driver'
  if (/\bbag\b/.test(s)) return 'bag'
  return 'other'
}

/**
 * Drop a club noun the row header already states, so the Irons row reads
 * "6-P steel S-flex (Nippon N.S. Pro Zelos 7)" instead of "irons 6-P steel...".
 * Only strips a LEADING noun and only when something is left over — a cell that
 * is nothing but its noun keeps its text rather than going blank.
 */
const ROW_NOUN: Partial<Record<SpecRow, RegExp>> = {
  irons: /^irons?\s+/i,
  wedges: /^wedges?\s+/i,
  putter: /^putters?\s+/i,
  driver: /^drivers?\s+/i,
  hybrid: /^hybrids?\s+/i,
}

export function stripRowNoun(text: string, row: SpecRow): string {
  const re = ROW_NOUN[row]
  if (!re) return text
  const out = text.replace(re, '').trim()
  return out.length > 0 ? out : text
}

/**
 * Split a variant's `spec` string into matrix parts.
 *
 * Returns null when the string is a single free-text note rather than a club
 * list. The Warbird variants read "Graphite shafts, R-flex throughout (driver,
 * 5-wood and irons)" — parsing that into rows would file one shaft note under
 * "Driver" and lose the rest, so the separator is the signal: `·` means a club
 * list, no `·` means a note.
 */
export function parseVariantSpec(spec: string | null | undefined): { row: SpecRow; text: string }[] | null {
  if (!spec) return null
  if (!spec.includes('·')) return null
  const parts = spec.split('·').map((p) => p.trim()).filter(Boolean)
  if (parts.length < 2) return null
  return parts.map((raw) => {
    const row = classifySpecPart(raw)
    return { row, text: stripRowNoun(raw, row) }
  })
}

/**
 * Split a `specifications` entry into a label/value pair when it is authored as
 * "Driver: TaylorMade RBZ 10.5° (Stiff)" — the left-handed set is written that
 * way and renders as a real table. Entries without a colon stay plain bullets.
 */
export function splitSpecEntry(entry: string): { label: string; value: string } | null {
  const i = entry.indexOf(': ')
  if (i <= 0) return null
  return { label: entry.slice(0, i).trim(), value: entry.slice(i + 2).trim() }
}

export async function getRelatedClubs(club: UsedClub, limit = 3): Promise<UsedClub[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('used_clubs_inventory')
    .select(CLUB_COLUMNS)
    .eq('available_for_sale', true)
    .neq('id', club.id)
    .order('created_at', { ascending: false })
    .limit(limit * 3)

  if (error || !data) return []

  const scored = data.map((c) => ({
    club: c,
    score:
      (c.brand === club.brand ? 2 : 0) +
      (c.club_type === club.club_type ? 1 : 0) +
      (c.gender === club.gender ? 0.5 : 0),
  }))
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((s) => s.club)
}
