import { createClient } from '@/lib/supabase/client'

const STAR_MAP: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
}

export interface GoogleReview {
  reviewer_name: string
  rating: number
  text: string
  review_created_at: string
}

export interface GoogleReviewsData {
  rating: number
  totalReviews: number
  reviews: GoogleReview[]
}

// Thai script has no reliable inter-word spacing, so the English word-boundary
// backoff (\s+\S*$) either cuts mid-word at an arbitrary byte offset or, when a
// stray space happens to sit mid-window, over-trims by a whole clause.
const THAI_SCRIPT_RE = /[฀-๿]/

// Detection is Thai-specific because today's callers only feed this Thai or
// English text (Google reviews keyed by locale, or curated English quotes). If
// a caller starts passing another non-spaced script (ja/ko/zh), extend
// detection rather than assuming the English branch is safe for it.
export function truncateReviewText(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  if (THAI_SCRIPT_RE.test(text)) {
    return text.slice(0, maxLen) + '...'
  }
  return text.slice(0, maxLen).replace(/\s+\S*$/, '') + '...'
}

export async function getGoogleReviews(locale: string = 'en'): Promise<GoogleReviewsData | null> {
  try {
    const supabase = createClient()

    // Aggregate stats via SECURITY DEFINER function (reads backoffice schema)
    const { data: stats, error: statsError } = await supabase.rpc('get_google_reviews_stats')
    if (statsError || !stats?.length) return null

    const { total_reviews, avg_rating } = stats[0]
    const rating = Number(avg_rating)
    if (!total_reviews || Number.isNaN(rating)) return null

    const language = locale === 'th' ? 'TH' : 'EN'

    // Fetch a larger pool of 5-star reviews with comments in the target language
    const { data: pool, error: poolError } = await supabase
      .from('google_reviews_public')
      .select('reviewer_name, star_rating, comment, review_created_at')
      .eq('star_rating', 'FIVE')
      .eq('language', language)
      .order('review_created_at', { ascending: false })
      .limit(30)

    if (poolError) return null

    const mapped: GoogleReview[] = (pool ?? [])
      .filter((r) => r.star_rating in STAR_MAP && r.comment && r.comment.length > 20)
      .map((r) => {
        let text = r.comment!
        // Strip "(Translated by Google) ... (Original)\n" prefix, keep only original text
        const originalMatch = text.match(/\(Original\)\r?\n/)
        if (originalMatch) {
          const idx = text.indexOf(originalMatch[0])
          text = text.slice(idx + originalMatch[0].length).trim()
        }
        return {
          reviewer_name: r.reviewer_name,
          rating: STAR_MAP[r.star_rating],
          text,
          review_created_at: r.review_created_at,
        }
      })

    // Randomly pick 6 from the pool using Fisher-Yates shuffle
    for (let i = mapped.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[mapped[i], mapped[j]] = [mapped[j], mapped[i]]
    }
    const reviews = mapped.slice(0, 6)

    return {
      rating,
      totalReviews: Number(total_reviews),
      reviews,
    }
  } catch {
    return null
  }
}
