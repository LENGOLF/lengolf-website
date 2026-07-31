import type { GolfCourse } from '@/types/golf-courses'
import { formatBaht, formatHours, thaiMonthYear } from '@/lib/format'

/**
 * Centralized SEO text generators for the ~150 golf-course detail pages.
 *
 * Everything here is derived from the typed GolfCourse fields so a data edit
 * (fee change, caddie policy) propagates to the <title>, meta description,
 * on-page FAQ, and FAQPage JSON-LD in one place. Pure functions, safe to
 * import from both route files and server components.
 *
 * Locale support: every generator takes `locale: 'en' | 'th' = 'en'`. All EN
 * outputs are byte-identical to the pre-locale version — 'th' either reads
 * the course's hand-written `locales.th` strings or renders a Thai template
 * set mirroring the EN fragments, and falls back to the EN behavior when no
 * Thai data exists.
 */

type CourseSeoLocale = 'en' | 'th'

const thb = formatBaht

// The two boilerplate suffixes shared by 134/149 hand-written titles.
const BOILERPLATE_TITLE = /—\s*Green Fees, Course Guide & (?:Golf )?Club Rentals\s*$/

/**
 * Short, uniform title: "<Course Name> — Green Fees & Guide".
 *
 * Replaces the boilerplate per-file `locales.en.title` strings (the 45-char
 * shared suffix pushed the rendered <title> plus " | LENGOLF" past ~80 chars
 * and guaranteed SERP truncation). Hand-tuned titles that DON'T match the
 * boilerplate pattern are kept verbatim — the per-course escape hatch, so a
 * deliberately differentiated title (e.g. one carrying "Membership") is
 * never silently overwritten by the generator.
 */
export function getCourseTitle(course: GolfCourse, locale: CourseSeoLocale = 'en'): string {
  // Thai titles are hand-written per course (no boilerplate corpus exists to
  // strip); fall through to the EN logic when the pilot course hasn't had its
  // locales.th filled in yet.
  if (locale === 'th' && course.locales.th?.title) return course.locales.th.title
  // A closed course must not advertise green fees in the SERP. Checked before
  // the hand-written escape hatch: the existing titles all carry the "Green
  // Fees, Course Guide & Club Rentals" boilerplate, so honouring them here
  // would reintroduce exactly the claim we're removing.
  if (course.operational_status === 'permanently_closed') {
    return `${course.name} — Permanently Closed`
  }
  const handWritten = course.locales.en.title
  if (handWritten && !BOILERPLATE_TITLE.test(handWritten)) return handWritten
  return `${course.name} — Green Fees & Guide`
}

/**
 * Data-driven meta description, unique per course. When the assembled string
 * runs long it degrades by dropping clauses (drive time, then designer) —
 * never by falling back to `locales.en.meta_description`, 77/149 of which
 * are the identical boilerplate this generator exists to replace.
 */
export function getCourseDescription(course: GolfCourse, locale: CourseSeoLocale = 'en'): string {
  // Thai descriptions are hand-written data, not generated — so the 165-char
  // degradation ladder below is deliberately skipped for them. That threshold
  // is calibrated for Latin-script SERP pixel widths; Thai glyph metrics
  // differ enough that clamping a native-written description to it would cut
  // good copy for no ranking benefit. Untranslated courses fall through to
  // the generated EN description.
  if (locale === 'th' && course.locales.th?.meta_description) {
    return course.locales.th.meta_description
  }
  // Closure leads, and is DERIVED rather than taken from
  // `locales.en.meta_description`: only some closed courses have had that
  // string rewritten (Rangsit and Star still advertise "green fees ... and
  // golf club rentals"), so trusting it would ship a bookable-sounding
  // snippet for a course nobody can play.
  const closedStatus = course.operational_status
  if (closedStatus === 'permanently_closed' || closedStatus === 'temporarily_closed') {
    const lead =
      closedStatus === 'permanently_closed'
        ? `${course.name} in ${course.province} is permanently closed.`
        : `${course.name} in ${course.province} has been reported temporarily closed.`
    const tail =
      closedStatus === 'permanently_closed'
        ? `Course history and alternatives for golf near ${course.province}.`
        : `Call ahead before planning a round, and see alternatives near ${course.province}.`
    // The editor's note is the most useful tail when it fits; otherwise the
    // generic one, which always does.
    const note = course.operational_note?.trim()
    const withNote = note ? `${lead} ${note}` : ''
    if (withNote && withNote.length <= 165) return withNote
    const withTail = `${lead} ${tail}`
    return withTail.length <= 165 ? withTail : lead
  }

  const designerLead = `${course.holes}-hole ${course.designer ? `${course.designer}-designed ` : ''}golf course in ${course.province}.`
  const plainLead = `${course.holes}-hole golf course in ${course.province}.`
  const fee = course.green_fee_weekday_thb
    ? ` Weekday green fee ~${thb(course.green_fee_weekday_thb)}.`
    : ''
  const drive =
    course.drive_time_from_bangkok_min && course.drive_time_from_bangkok_min <= 240
      ? ` ${course.drive_time_from_bangkok_min} min from central Bangkok.`
      : ''
  const tail = ' Fees, tips, caddie info & club rental options.'

  const full = designerLead + fee + drive + tail
  if (full.length <= 165) return full
  const noDrive = designerLead + fee + tail
  if (noDrive.length <= 165) return noDrive
  // Base form always fits (~120 chars worst case) and stays unique per course.
  return plainLead + fee + tail
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
 *
 * locale === 'th' renders the Thai template set below (same question order,
 * same data fragments, house style per data/i18n-glossary/th.json); 'en' is
 * byte-identical to the pre-locale version. Both the visible block and the
 * FAQPage JSON-LD receive the SAME array from the route, so they cannot
 * diverge across locales either.
 */
export function getCourseFaqs(course: GolfCourse, locale: CourseSeoLocale = 'en'): CourseFaqItem[] {
  if (locale === 'th') return getCourseFaqsTh(course)
  const faqs: CourseFaqItem[] = []

  // Closure status leads — and a permanently closed course gets ONLY the
  // closure + location answers (green-fee/caddie/rental FAQs would imply
  // bookable golf at a course that no longer exists).
  const closed =
    course.operational_status === 'permanently_closed' ||
    course.operational_status === 'temporarily_closed'
  if (closed) {
    const fallback =
      course.operational_status === 'permanently_closed'
        ? `No — ${course.name} is permanently closed.`
        : `${course.name} has been reported temporarily closed. Call ahead before planning a round.`
    faqs.push({
      question: `Is ${course.name} still open?`,
      answer: course.operational_note ?? fallback,
    })
  }
  if (course.operational_status === 'permanently_closed') {
    if (course.distance_from_bangkok_km) {
      faqs.push({
        question: `Where was ${course.name} located?`,
        answer: `${course.name} was in ${course.province}, about ${course.distance_from_bangkok_km} km from central Bangkok.`,
      })
    }
    return faqs
  }

  if (course.green_fee_weekday_thb) {
    let answer = `The weekday green fee at ${course.name} is around ${thb(course.green_fee_weekday_thb)}`
    if (course.green_fee_weekend_thb) {
      answer += `, and the weekend rate is around ${thb(course.green_fee_weekend_thb)}`
    }
    if (course.fees_verified_at) {
      const asOf = new Date(`${course.fees_verified_at}T00:00:00Z`).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      })
      answer += ` (as of ${asOf})`
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
          ? `, roughly ${formatHours(min)} hours by car`
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

/**
 * Thai twin of the EN FAQ generator: same questions in the same order,
 * derived from the same data fragments, written to the TH glossary rules
 * (บาท spelled out, Arabic digits, no exclamation marks, polite register,
 * ค่ากรีนฟี/แคดดี้ loanword forms, "(ข้อมูล ณ <เดือน> <ปี ค.ศ.>)" as-of).
 * Prices hedge with ประมาณ and point back to the course, mirroring the EN
 * honesty posture. `operational_note` is EN-authored free text, so the Thai
 * closure answers use the derived fallbacks rather than mixing languages.
 */
function getCourseFaqsTh(course: GolfCourse): CourseFaqItem[] {
  const faqs: CourseFaqItem[] = []
  const n = (v: number) => v.toLocaleString('en-US')

  const closed =
    course.operational_status === 'permanently_closed' ||
    course.operational_status === 'temporarily_closed'
  if (closed) {
    faqs.push({
      question: `${course.name} ยังเปิดให้บริการอยู่หรือไม่`,
      answer:
        course.operational_status === 'permanently_closed'
          ? `ไม่ — ${course.name} ปิดให้บริการถาวรแล้ว`
          : `มีรายงานว่า ${course.name} ปิดให้บริการชั่วคราว ควรโทรสอบถามกับทางสนามก่อนวางแผนออกรอบ`,
    })
  }
  if (course.operational_status === 'permanently_closed') {
    if (course.distance_from_bangkok_km) {
      faqs.push({
        question: `${course.name} เคยตั้งอยู่ที่ไหน`,
        answer: `${course.name} เคยตั้งอยู่ใน ${course.province} ห่างจากใจกลางกรุงเทพฯ ประมาณ ${course.distance_from_bangkok_km} กม.`,
      })
    }
    return faqs
  }

  if (course.green_fee_weekday_thb) {
    let answer = `ค่ากรีนฟีวันธรรมดาที่ ${course.name} อยู่ที่ประมาณ ${n(course.green_fee_weekday_thb)} บาท`
    if (course.green_fee_weekend_thb) {
      answer += ` ส่วนวันหยุดสุดสัปดาห์อยู่ที่ประมาณ ${n(course.green_fee_weekend_thb)} บาท`
    }
    if (course.fees_verified_at) {
      answer += ` (ข้อมูล ณ ${thaiMonthYear(course.fees_verified_at)})`
    }
    answer += ' อัตราค่าบริการเปลี่ยนแปลงตามฤดูกาล ควรยืนยันกับทางสนามอีกครั้งเมื่อจอง'
    faqs.push({
      question: `ค่ากรีนฟีที่ ${course.name} ราคาเท่าไร`,
      answer,
    })
  }

  if (course.distance_from_bangkok_km) {
    let answer = `${course.name} อยู่ห่างจากใจกลางกรุงเทพฯ ประมาณ ${course.distance_from_bangkok_km} กม.`
    if (course.drive_time_from_bangkok_min) {
      const min = course.drive_time_from_bangkok_min
      answer +=
        min >= 120
          ? ` ใช้เวลาขับรถราว ${formatHours(min)} ชั่วโมง`
          : ` ใช้เวลาขับรถราว ${min} นาที`
    }
    answer += ` โดยสนามตั้งอยู่ใน ${course.province}`
    faqs.push({
      question: `${course.name} อยู่ห่างจากกรุงเทพฯ แค่ไหน`,
      answer,
    })
  }

  {
    const fee = course.caddie_fee_thb
    const feeNote = fee ? ` โดยมีค่าแคดดี้ประมาณ ${n(fee)} บาทต่อรอบ` : ''
    faqs.push({
      question: `ต้องใช้แคดดี้ที่ ${course.name} หรือไม่`,
      answer: course.caddie_required
        ? `จำเป็น — ${course.name} กำหนดให้ใช้แคดดี้${feeNote} และตามธรรมเนียมจะมีทิปแคดดี้เพิ่มอีกประมาณ 300-500 บาท`
        : `แคดดี้เป็นทางเลือกที่ ${course.name}${feeNote}`,
    })
  }

  {
    const lengolf =
      'หากต้องการชุดไม้กอล์ฟรุ่นปัจจุบัน LENGOLF ในใจกลางกรุงเทพฯ (BTS ชิดลม) มีบริการเช่าไม้กอล์ฟ Callaway ระดับพรีเมียมพร้อมส่งถึงโรงแรม จึงจัดเตรียมอุปกรณ์ได้ตั้งแต่ก่อนเดินทาง'
    let answer: string
    if (course.club_rental_available === true) {
      const fee = course.club_rental_fee_thb
      answer = `${course.name} มีบริการเช่าไม้กอล์ฟภายในสนาม${fee ? ` ค่าบริการประมาณ ${n(fee)} บาทต่อรอบ` : ''} ${lengolf}`
    } else if (course.club_rental_available === false) {
      answer = `${course.name} ไม่มีบริการเช่าไม้กอล์ฟภายในสนาม ${lengolf}`
    } else {
      answer = `ยังไม่มีข้อมูลยืนยันว่า ${course.name} มีบริการเช่าไม้กอล์ฟภายในสนามหรือไม่ ${lengolf}`
    }
    faqs.push({
      question: `เช่าไม้กอล์ฟเพื่อออกรอบที่ ${course.name} ได้หรือไม่`,
      answer,
    })
  }

  return faqs
}
