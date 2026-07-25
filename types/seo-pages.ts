// Types for the seo_pages table (future Supabase migration)
// Currently used with static data files; will match DB schema when migrated

export type SeoPageType =
  | 'faq'
  | 'activity_occasion'
  | 'hotel_concierge'
  | 'best_of_listicle'
  | 'comparison'
  | 'seasonal_event'
  | 'price_guide'
  | 'explainer'

export type SeoPageStatus = 'draft' | 'published' | 'archived'

export interface SeoPageBase {
  id: string
  page_type: SeoPageType
  slug: string
  title: string
  meta_description: string | null
  featured_image: string | null
  schema_markup: Record<string, unknown> | null
  status: SeoPageStatus
  category: string | null
  locale: string
  related_slugs: string[] | null
  created_at: string
  updated_at: string
}

// --- Content types per page_type ---

export interface ActivityOccasionContent {
  occasion_type: string
  intro: string
  why_lengolf: string
  other_activities: { name: string; description: string; type?: string }[]
  seasonal_relevance: number[] // months (1-12)
  target_audience: string
  show_aqi_widget: boolean
  comparison_table: { feature: string; lengolf: string; alternative: string }[]
  /**
   * Optional long-form depth blocks, rendered between "Why LENGOLF" and
   * "Other Options to Consider". Same body syntax as ExplainerContent:
   * `\n\n` between paragraphs, single `\n` for line breaks, inline
   * `**bold**`, and all-pipe paragraphs render as markdown tables.
   */
  sections?: { heading: string; body: string }[]
  /**
   * Optional FAQ block. Renders via components/shared/FaqSection and emits
   * FAQPage JSON-LD from the activity route.
   */
  faqs?: { question: string; answer: string }[]
}

export interface FaqContent {
  answer_intro: string
  answer_body: string
  related_questions: { slug: string; question: string }[]
}

export interface HotelConciergeContent {
  hotel_name: string
  hotel_neighbourhood: string
  hotel_distance_m: number
  walking_time_mins: number
  walking_directions: string
  hotel_star_rating: number
  nearby_restaurants: { name: string; cuisine: string; distance_m: number }[]
  nearby_activities: { name: string; type: string; distance_m: number }[]
  google_maps_embed: string
  area_guide: string
  suggested_itinerary: { time: string; activity: string }[]
}

export interface BestOfListicleContent {
  year: number
  intro: string
  list_items: {
    rank: number
    name: string
    description: string
    pros: string[]
    cons: string[]
    is_lengolf: boolean
    address?: string
    website?: string
  }[]
  conclusion: string
}

export interface ComparisonContent {
  option_a: { name: string; description: string; pros: string[]; cons: string[] }
  option_b: { name: string; description: string; pros: string[]; cons: string[] }
  verdict: string
  comparison_table: { feature: string; option_a: string; option_b: string }[]
}

export interface SeasonalEventContent {
  season_months: number[]
  event_type: string
  intro: string
  why_lengolf: string
  packages_relevant: string[]
  booking_deadline_note: string
}

export interface PriceGuideContent {
  intro: string
  price_breakdown: { item: string; price: string; notes: string }[]
  comparison_with_alternatives: string
  value_proposition: string
  last_verified: string
  venue_comparison?: {
    venues: {
      name: string
      location: string
      tech: string
      players_per_bay: number
      cheapest_rate: string
      peak_rate: string
      price_includes_tax: boolean
      notes: string
    }[]
    summary: string
  }
  sections?: { heading: string; body: string }[]
  curated_reviews?: { reviewer_name: string; text: string }[]
}

export interface ExplainerContent {
  intro: string
  sections: { heading: string; body: string }[]
  key_takeaways: string[]
  comparison_table: { feature: string; simulator: string; real_golf: string }[]
  table_heading?: string
  col_a_label?: string
  col_b_label?: string
}

// --- Discriminated union ---

export type ActivityOccasionSeoPage = SeoPageBase & {
  page_type: 'activity_occasion'
  content: ActivityOccasionContent
}

export type FaqSeoPage = SeoPageBase & {
  page_type: 'faq'
  content: FaqContent
}

export type HotelConciergeSeoPage = SeoPageBase & {
  page_type: 'hotel_concierge'
  content: HotelConciergeContent
}

export type BestOfListicleSeoPage = SeoPageBase & {
  page_type: 'best_of_listicle'
  content: BestOfListicleContent
}

export type ComparisonSeoPage = SeoPageBase & {
  page_type: 'comparison'
  content: ComparisonContent
}

export type SeasonalEventSeoPage = SeoPageBase & {
  page_type: 'seasonal_event'
  content: SeasonalEventContent
}

export type PriceGuideSeoPage = SeoPageBase & {
  page_type: 'price_guide'
  content: PriceGuideContent
}

export type ExplainerSeoPage = SeoPageBase & {
  page_type: 'explainer'
  content: ExplainerContent
}

export type SeoPage =
  | ActivityOccasionSeoPage
  | FaqSeoPage
  | HotelConciergeSeoPage
  | BestOfListicleSeoPage
  | ComparisonSeoPage
  | SeasonalEventSeoPage
  | PriceGuideSeoPage
  | ExplainerSeoPage

// --- Type guards ---

export function isActivityOccasionPage(page: SeoPage): page is ActivityOccasionSeoPage {
  return page.page_type === 'activity_occasion'
}

export function isFaqPage(page: SeoPage): page is FaqSeoPage {
  return page.page_type === 'faq'
}

export function isHotelConciergePage(page: SeoPage): page is HotelConciergeSeoPage {
  return page.page_type === 'hotel_concierge'
}

export function isBestOfListiclePage(page: SeoPage): page is BestOfListicleSeoPage {
  return page.page_type === 'best_of_listicle'
}

export function isComparisonPage(page: SeoPage): page is ComparisonSeoPage {
  return page.page_type === 'comparison'
}

export function isSeasonalEventPage(page: SeoPage): page is SeasonalEventSeoPage {
  return page.page_type === 'seasonal_event'
}

export function isPriceGuidePage(page: SeoPage): page is PriceGuideSeoPage {
  return page.page_type === 'price_guide'
}

export function isExplainerPage(page: SeoPage): page is ExplainerSeoPage {
  return page.page_type === 'explainer'
}
