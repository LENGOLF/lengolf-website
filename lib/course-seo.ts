import type { GolfCourse } from '@/types/golf-courses'

/**
 * Centralized SEO text generators for the ~150 golf-course detail pages.
 *
 * Everything here is derived from the typed GolfCourse fields so a data edit
 * (fee change, caddie policy) propagates to the <title>, meta description,
 * on-page FAQ, and FAQPage JSON-LD in one place. Pure functions, safe to
 * import from both route files and server components.
 */

const thb = (n: number) => `฿${n.toLocaleString('en-US')}`

/**
 * Short, uniform title: "<Course Name> — Green Fees & Guide".
 *
 * Replaces the per-file `locales.en.title` strings, 134/149 of which shared a
 * 45-char boilerplate suffix that pushed the rendered <title> (plus the
 * " | LENGOLF" layout template) past ~80 chars and guaranteed SERP
 * truncation. Name-first keeps the entity keyword visible even when Google
 * truncates the tail.
 */
export function getCourseTitle(course: GolfCourse): string {
  return `${course.name} — Green Fees & Guide`
}

/**
 * Data-driven meta description, unique per course. Falls back to the
 * hand-written `locales.en.meta_description` if the assembled string runs
 * long (e.g. very long designer names).
 */
export function getCourseDescription(course: GolfCourse): string {
  const designer = course.designer ? `${course.designer}-designed ` : ''
  const parts = [`${course.holes}-hole ${designer}golf course in ${course.province}.`]
  if (course.green_fee_weekday_thb) {
    parts.push(`Weekday green fee ~${thb(course.green_fee_weekday_thb)}.`)
  }
  if (
    course.drive_time_from_bangkok_min &&
    course.drive_time_from_bangkok_min <= 240
  ) {
    parts.push(`${course.drive_time_from_bangkok_min} min from central Bangkok.`)
  }
  parts.push('Fees, tips, caddie info & club rental options.')
  const out = parts.join(' ')
  return out.length <= 165 ? out : course.locales.en.meta_description
}

export interface CourseFaqItem {
  question: string
  answer: string
}

/**
 * FAQ items derived from structured course data. Rendered visibly on the
 * detail page (components/golf-courses/CourseFaq.tsx) AND emitted as FAQPage
 * JSON-LD — the same array feeds both, per Google's requirement that FAQ
 * markup mirror on-page content.
 *
 * Answers deliberately hedge on prices ("around", "confirm when booking")
 * because fees in data/golf-courses/ are point-in-time snapshots. The
 * club-rental answer mentions LENGOLF without quoting a price so a Supabase
 * pricing change can't silently desync 149 static pages.
 */
export function getCourseFaqs(course: GolfCourse): CourseFaqItem[] {
  const faqs: CourseFaqItem[] = []

  if (course.green_fee_weekday_thb) {
    let answer = `The weekday green fee at ${course.name} is around ${thb(course.green_fee_weekday_thb)}`
    if (course.green_fee_weekend_thb) {
      answer += `, and the weekend rate is around ${thb(course.green_fee_weekend_thb)}`
    }
    answer += '. Rates change seasonally, so confirm with the course when booking.'
    faqs.push({
      question: `How much is the green fee at ${course.name}?`,
      answer,
    })
  }

  if (course.distance_from_bangkok_km) {
    let answer = `${course.name} is about ${course.distance_from_bangkok_km} km from central Bangkok`
    if (course.drive_time_from_bangkok_min) {
      const min = course.drive_time_from_bangkok_min
      answer +=
        min >= 120
          ? `, roughly ${Math.round(min / 60)} hours by car`
          : `, roughly ${min} minutes by car`
    }
    answer += `. The course is in ${course.province}.`
    faqs.push({
      question: `How far is ${course.name} from Bangkok?`,
      answer,
    })
  }

  {
    const fee = course.caddie_fee_thb
    const feeNote = fee ? `, with a caddie fee of about ${thb(fee)} per round` : ''
    faqs.push({
      question: `Do I need a caddie at ${course.name}?`,
      answer: course.caddie_required
        ? `Yes — caddies are mandatory at ${course.name}${feeNote}. Caddie tips (typically 300–500 THB) are customary on top.`
        : `Caddies are optional at ${course.name}${feeNote}.`,
    })
  }

  {
    const lengolf =
      'For current-generation sets, LENGOLF in central Bangkok (BTS Chidlom) rents premium Callaway clubs with hotel delivery, so you can arrange equipment before you travel.'
    let answer: string
    if (course.club_rental_available === true) {
      const fee = course.club_rental_fee_thb
      answer = `${course.name} offers rental clubs on-site${fee ? ` for about ${thb(fee)} per round` : ''}. ${lengolf}`
    } else if (course.club_rental_available === false) {
      answer = `${course.name} does not offer club rental on-site. ${lengolf}`
    } else {
      answer = `On-site club rental at ${course.name} is not confirmed. ${lengolf}`
    }
    faqs.push({
      question: `Can I rent golf clubs to play ${course.name}?`,
      answer,
    })
  }

  return faqs
}
