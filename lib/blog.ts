import { createClient } from '@/lib/supabase/client'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image: string | null
  meta_title: string | null
  meta_description: string | null
  published_at: string | null
  status: string
  created_at: string
  updated_at: string
}

interface BlogPostTranslation {
  post_id: string
  locale: string
  title: string
  excerpt: string | null
  content: string
  meta_title: string | null
  meta_description: string | null
}

/**
 * Locales that can carry a blog translation. 'en' is the source of truth
 * (the `blog_posts` table); the rest live in `blog_post_translations`.
 */
export type BlogLocale = 'en' | 'th' | 'ko' | 'ja' | 'zh'

// Reading-speed constants. `en` is space-delimited (a raw `split(' ')` word
// count is meaningful); ja/zh/ko/th are not — a raw `split(' ')` on unspaced
// CJK/Thai text collapses the whole article to a single "word", so every
// translated post rendered "1 min read" regardless of length. Those four are
// measured by character count instead, at conventional per-language reading
// speeds (chars/min, not words/min). ko included: Korean IS space-delimited,
// but only into eojeols (particle-attached phrase units, not English-shaped
// words) — an eojeol count run through the English 200-words/min divisor
// underestimates reading time by ~1.5-1.7x (measured against ko strings in
// this repo), and a char count fits Hangul about as well as it fits Han
// script, since both pack roughly one morpheme per character/syllable block.
const WORDS_PER_MINUTE = 200
const CHARS_PER_MINUTE: Partial<Record<BlogLocale, number>> = {
  ja: 500,
  zh: 500,
  ko: 500,
  th: 700,
}

export function getReadingTime(html: string, locale: BlogLocale = 'en'): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const charsPerMinute = CHARS_PER_MINUTE[locale]
  if (charsPerMinute) {
    const chars = text.replace(/\s+/g, '').length
    return Math.max(1, Math.ceil(chars / charsPerMinute))
  }
  const words = text.split(' ').filter(Boolean).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

/** Overlay a translation's fields onto the English base row. */
function mergeTranslation(base: BlogPost, tr: BlogPostTranslation | null): BlogPost {
  if (!tr) return base
  return {
    ...base,
    title: tr.title,
    excerpt: tr.excerpt ?? base.excerpt,
    content: tr.content,
    meta_title: tr.meta_title ?? base.meta_title,
    meta_description: tr.meta_description ?? base.meta_description,
  }
}

/**
 * Published posts for a locale.
 * - 'en': every published post (English source), newest first.
 * - other: only posts that have a translation in that locale, merged over the
 *   English base — the localized index never shows mixed-language cards.
 */
export async function getAllPosts(locale: BlogLocale = 'en'): Promise<BlogPost[]> {
  const supabase = createClient()

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error || !posts) {
    if (error) console.error('Error fetching blog posts:', error)
    return []
  }

  if (locale === 'en') return posts

  const { data: translations } = await supabase
    .from('blog_post_translations')
    .select('*')
    .eq('locale', locale)

  // No translations for this locale yet: fall back to the English list rather
  // than render an empty blog. (Keeps /th/blog — registered but untranslated —
  // showing posts as before.)
  if (!translations || translations.length === 0) return posts

  const byId = new Map(translations.map((t) => [t.post_id, t as BlogPostTranslation]))

  return posts
    .filter((p) => byId.has(p.id))
    .map((p) => mergeTranslation(p, byId.get(p.id) ?? null))
}

/**
 * A single post for a locale.
 * - Returns null when the slug does not exist at all (a true 404).
 * - `isFallback` is true when the slug exists in English but has no translation
 *   for the requested (non-English) locale; callers should redirect to the
 *   English canonical rather than serve mixed-language content.
 */
export async function getLocalizedPost(
  slug: string,
  locale: BlogLocale = 'en'
): Promise<{ post: BlogPost; isFallback: boolean } | null> {
  const supabase = createClient()

  const { data: base, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !base) return null
  if (locale === 'en') return { post: base, isFallback: false }

  const { data: tr } = await supabase
    .from('blog_post_translations')
    .select('*')
    .eq('post_id', base.id)
    .eq('locale', locale)
    .maybeSingle()

  if (!tr) return { post: base, isFallback: true }
  return { post: mergeTranslation(base, tr as BlogPostTranslation), isFallback: false }
}

/** English-only single post. Kept for callers where locale is irrelevant. */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const result = await getLocalizedPost(slug, 'en')
  return result ? result.post : null
}

/**
 * Related posts in the same locale as the current post. For non-English
 * locales this only returns other posts translated into that locale, so a
 * localized article never links out to English cards.
 */
export async function getRelatedPosts(
  currentSlug: string,
  locale: BlogLocale = 'en',
  limit = 3
): Promise<BlogPost[]> {
  const posts = await getAllPosts(locale)
  return posts.filter((p) => p.slug !== currentSlug).slice(0, limit)
}

/** All published English slugs — for the English generateStaticParams. */
export async function getPostSlugs(): Promise<string[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('status', 'published')

  if (error) return []
  return (data || []).map((p) => p.slug)
}

/**
 * Every (locale, slug) pair that has a published translation — for the
 * non-English generateStaticParams. Only combos returned here are prebuilt;
 * everything else falls back to English at request time.
 */
export async function getTranslatedPostParams(): Promise<{ locale: string; slug: string }[]> {
  const supabase = createClient()

  const [{ data: translations }, { data: posts }] = await Promise.all([
    supabase.from('blog_post_translations').select('locale, post_id'),
    supabase.from('blog_posts').select('id, slug').eq('status', 'published'),
  ])

  const slugById = new Map((posts ?? []).map((p) => [p.id, p.slug]))

  return (translations ?? [])
    .filter((t) => slugById.has(t.post_id))
    .map((t) => ({ locale: t.locale as string, slug: slugById.get(t.post_id) as string }))
}

/**
 * slug -> the locales that have content for it ('en' is always present, plus
 * any published translations). Used for hreflang alternates on the blog index,
 * post pages, and the sitemap.
 */
export async function getPostLocalesMap(): Promise<Record<string, string[]>> {
  const supabase = createClient()

  const [{ data: posts }, { data: translations }] = await Promise.all([
    supabase.from('blog_posts').select('id, slug').eq('status', 'published'),
    supabase.from('blog_post_translations').select('post_id, locale'),
  ])

  const slugById = new Map((posts ?? []).map((p) => [p.id, p.slug]))
  const map: Record<string, string[]> = {}
  for (const p of posts ?? []) map[p.slug] = ['en']
  for (const t of translations ?? []) {
    const slug = slugById.get(t.post_id)
    if (slug && map[slug] && !map[slug].includes(t.locale)) map[slug].push(t.locale)
  }
  return map
}

export async function getPostSlugsWithDates(): Promise<
  { slug: string; updated_at: string | null; published_at: string | null }[]
> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug, updated_at, published_at')
    .eq('status', 'published')

  if (error) {
    return []
  }

  return (data || []) as { slug: string; updated_at: string | null; published_at: string | null }[]
}
