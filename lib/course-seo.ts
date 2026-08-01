import type { GolfCourse } from '@/types/golf-courses'
import {
  asOfMonthYear,
  COURSE_CONTENT_LOCALES,
  formatBaht,
  formatHours,
  type FormatLocale,
} from '@/lib/format'

/**
 * Centralized SEO text generators for the ~150 golf-course detail pages.
 *
 * Everything here is derived from the typed GolfCourse fields so a data edit
 * (fee change, caddie policy) propagates to the <title>, meta description,
 * on-page FAQ, and FAQPage JSON-LD in one place. Pure functions, safe to
 * import from both route files and server components.
 *
 * Locale support: every generator takes a `CourseSeoLocale` (default 'en').
 * All EN outputs are byte-identical to the pre-locale version — a non-EN
 * locale either reads the course's hand-written `locales.<locale>` strings or
 * renders that locale's template set mirroring the EN fragments, and falls
 * back to the EN behavior when no localized data exists.
 */

/**
 * Locales the course-detail SEO generators carry templates for — aliases of
 * the single-source union in lib/format.ts.
 */
export const COURSE_SEO_LOCALES = COURSE_CONTENT_LOCALES
export type CourseSeoLocale = FormatLocale

/** Narrow an arbitrary locale string to a supported CourseSeoLocale ('en' fallback). */
export function toCourseSeoLocale(l: string): CourseSeoLocale {
  return (COURSE_SEO_LOCALES as readonly string[]).includes(l) ? (l as CourseSeoLocale) : 'en'
}

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
  // Non-EN titles are hand-written per course (no boilerplate corpus exists to
  // strip); fall through to the EN logic when the pilot course hasn't had its
  // locales.<locale> filled in yet.
  if (locale !== 'en' && course.locales[locale]?.title) return course.locales[locale]!.title
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
  // Non-EN descriptions are hand-written data, not generated — so the 165-char
  // degradation ladder below is deliberately skipped for them. That threshold
  // is calibrated for Latin-script SERP pixel widths; Thai/CJK glyph metrics
  // differ enough that clamping a native-written description to it would cut
  // good copy for no ranking benefit. Untranslated courses fall through to
  // the generated EN description.
  if (locale !== 'en' && course.locales[locale]?.meta_description) {
    return course.locales[locale]!.meta_description
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
 * Both the visible block and the FAQPage JSON-LD receive the SAME array from
 * the route, so they cannot diverge across locales either.
 *
 * One skeleton, three string packs: the question set, ordering, presence
 * conditions, and numeric thresholds (the 120-min hours cutoff, the
 * closed-course early return) live ONCE in `getCourseFaqs`; each locale
 * contributes only a pack of string templates. Adding a locale means adding
 * a pack — the data logic cannot drift per locale. EN strings are
 * byte-identical to the pre-consolidation generator.
 *
 * `operational_note` is EN-authored free text, so only the EN pack reads it;
 * the localized closure answers use their derived fallbacks rather than
 * mixing languages.
 */
interface CourseFaqL10n {
  /**
   * Localized province name, or undefined to DROP the locality clause.
   * course.province is stored in English: interpolating it raw into th/ja
   * sentences ships mixed-script text ("ตั้งอยู่ใน Bangkok"), so non-EN packs
   * look up PROVINCE_L10N and omit the clause for unmapped provinces.
   */
  province(raw: string): string | undefined
  closedQuestion(name: string): string
  closedAnswer(name: string, permanent: boolean, note: string | null): string
  whereWasQuestion(name: string): string
  whereWasAnswer(name: string, km: number, province: string | undefined): string
  feeQuestion(name: string): string
  feeAnswer(name: string, weekday: number, weekend: number | null, verifiedAt: string | null): string
  distanceQuestion(name: string): string
  distanceAnswer(
    name: string,
    km: number,
    drive: { hours: boolean; text: string } | null,
    province: string | undefined
  ): string
  caddieQuestion(name: string): string
  caddieAnswer(name: string, required: boolean, fee: number | null): string
  rentalQuestion(name: string): string
  rentalAnswer(name: string, availability: boolean | null, fee: number | null): string
}

// Localized province names, both locales side by side so a new province
// cannot be mapped for one locale and silently dropped in the other. Extend
// this map as courses join the registries — validate-i18n errors when a
// registered course's province is missing here.
const PROVINCE_L10N: Record<string, Record<Exclude<CourseSeoLocale, 'en'>, string>> = {
  Bangkok: { th: 'กรุงเทพฯ', ja: 'バンコク' },
  'Chiang Mai': { th: 'จังหวัดเชียงใหม่', ja: 'チェンマイ県' },
  'Phra Nakhon Si Ayutthaya': { th: 'จังหวัดพระนครศรีอยุธยา', ja: 'アユタヤ県' },
  // Some course files use the short form of the same province.
  Ayutthaya: { th: 'จังหวัดพระนครศรีอยุธยา', ja: 'アユタヤ県' },
  'Pathum Thani': { th: 'จังหวัดปทุมธานี', ja: 'パトゥムターニー県' },
  'Samut Prakan': { th: 'จังหวัดสมุทรปราการ', ja: 'サムットプラーカーン県' },
  Phuket: { th: 'จังหวัดภูเก็ต', ja: 'プーケット県' },
  Rayong: { th: 'จังหวัดระยอง', ja: 'ラヨーン県' },
}

/** Whether a course's (English) province has localized names for the non-EN packs. */
export function hasProvinceL10n(province: string): boolean {
  return province in PROVINCE_L10N
}

const n = (v: number) => v.toLocaleString('en-US')

const FAQ_L10N: Record<CourseSeoLocale, CourseFaqL10n> = {
  en: {
    province: (raw) => raw,
    closedQuestion: (name) => `Is ${name} still open?`,
    closedAnswer: (name, permanent, note) =>
      note ??
      (permanent
        ? `No — ${name} is permanently closed.`
        : `${name} has been reported temporarily closed. Call ahead before planning a round.`),
    whereWasQuestion: (name) => `Where was ${name} located?`,
    whereWasAnswer: (name, km, province) =>
      `${name} was in ${province}, about ${km} km from central Bangkok.`,
    feeQuestion: (name) => `How much is the green fee at ${name}?`,
    feeAnswer: (name, weekday, weekend, verifiedAt) => {
      let answer = `The weekday green fee at ${name} is around ${thb(weekday)}`
      if (weekend) answer += `, and the weekend rate is around ${thb(weekend)}`
      if (verifiedAt) {
        // Long month ("July 2026"), unlike asOfMonthYear's short form — the
        // FAQ sentence reads better spelled out and predates the helper.
        const asOf = new Date(`${verifiedAt}T00:00:00Z`).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
          timeZone: 'UTC',
        })
        answer += ` (as of ${asOf})`
      }
      return answer + '. Rates change seasonally, so confirm with the course when booking.'
    },
    distanceQuestion: (name) => `How far is ${name} from Bangkok?`,
    distanceAnswer: (name, km, drive, province) => {
      let answer = `${name} is about ${km} km from central Bangkok`
      if (drive) {
        answer += drive.hours
          ? `, roughly ${drive.text} hours by car`
          : `, roughly ${drive.text} minutes by car`
      }
      return answer + `. The course is in ${province}.`
    },
    caddieQuestion: (name) => `Do I need a caddie at ${name}?`,
    caddieAnswer: (name, required, fee) => {
      const feeNote = fee ? `, with a caddie fee of about ${thb(fee)} per round` : ''
      return required
        ? `Yes — caddies are mandatory at ${name}${feeNote}. Caddie tips (typically 300–500 THB) are customary on top.`
        : `Caddies are optional at ${name}${feeNote}.`
    },
    rentalQuestion: (name) => `Can I rent golf clubs to play ${name}?`,
    rentalAnswer: (name, availability, fee) => {
      const lengolf =
        'For current-generation sets, LENGOLF in central Bangkok (BTS Chidlom) rents premium Callaway clubs with hotel delivery, so you can arrange equipment before you travel.'
      if (availability === true) {
        return `${name} offers rental clubs on-site${fee ? ` for about ${thb(fee)} per round` : ''}. ${lengolf}`
      }
      if (availability === false) return `${name} does not offer club rental on-site. ${lengolf}`
      return `On-site club rental at ${name} is not confirmed. ${lengolf}`
    },
  },

  // Thai pack, written to the TH glossary rules (บาท spelled out, Arabic
  // digits, no exclamation marks, polite register, ค่ากรีนฟี/แคดดี้ loanword
  // forms, "(ข้อมูล ณ <เดือน> <ปี ค.ศ.>)" as-of). Prices hedge with ประมาณ.
  th: {
    province: (raw) => PROVINCE_L10N[raw]?.th,
    closedQuestion: (name) => `${name} ยังเปิดให้บริการอยู่หรือไม่`,
    closedAnswer: (name, permanent) =>
      permanent
        ? `ไม่ — ${name} ปิดให้บริการถาวรแล้ว`
        : `มีรายงานว่า ${name} ปิดให้บริการชั่วคราว ควรโทรสอบถามกับทางสนามก่อนวางแผนออกรอบ`,
    whereWasQuestion: (name) => `${name} เคยตั้งอยู่ที่ไหน`,
    whereWasAnswer: (name, km, province) =>
      province
        ? `${name} เคยตั้งอยู่ใน${province} ห่างจากใจกลางกรุงเทพฯ ประมาณ ${km} กม.`
        : `${name} เคยตั้งอยู่ห่างจากใจกลางกรุงเทพฯ ประมาณ ${km} กม.`,
    feeQuestion: (name) => `ค่ากรีนฟีที่ ${name} ราคาเท่าไร`,
    feeAnswer: (name, weekday, weekend, verifiedAt) => {
      let answer = `ค่ากรีนฟีวันธรรมดาที่ ${name} อยู่ที่ประมาณ ${n(weekday)} บาท`
      if (weekend) answer += ` ส่วนวันหยุดสุดสัปดาห์อยู่ที่ประมาณ ${n(weekend)} บาท`
      if (verifiedAt) answer += ` (ข้อมูล ณ ${asOfMonthYear(verifiedAt, 'th')})`
      return answer + ' อัตราค่าบริการเปลี่ยนแปลงตามฤดูกาล ควรยืนยันกับทางสนามอีกครั้งเมื่อจอง'
    },
    distanceQuestion: (name) => `${name} อยู่ห่างจากกรุงเทพฯ แค่ไหน`,
    distanceAnswer: (name, km, drive, province) => {
      let answer = `${name} อยู่ห่างจากใจกลางกรุงเทพฯ ประมาณ ${km} กม.`
      if (drive) {
        answer += drive.hours
          ? ` ใช้เวลาขับรถราว ${drive.text} ชั่วโมง`
          : ` ใช้เวลาขับรถราว ${drive.text} นาที`
      }
      if (province) answer += ` โดยสนามตั้งอยู่ใน${province}`
      return answer
    },
    caddieQuestion: (name) => `ต้องใช้แคดดี้ที่ ${name} หรือไม่`,
    caddieAnswer: (name, required, fee) => {
      const feeNote = fee ? ` โดยมีค่าแคดดี้ประมาณ ${n(fee)} บาทต่อรอบ` : ''
      return required
        ? `จำเป็น — ${name} กำหนดให้ใช้แคดดี้${feeNote} และตามธรรมเนียมจะมีทิปแคดดี้เพิ่มอีกประมาณ 300-500 บาท`
        : `แคดดี้เป็นทางเลือกที่ ${name}${feeNote}`
    },
    rentalQuestion: (name) => `เช่าไม้กอล์ฟเพื่อออกรอบที่ ${name} ได้หรือไม่`,
    rentalAnswer: (name, availability, fee) => {
      const lengolf =
        'หากต้องการชุดไม้กอล์ฟรุ่นปัจจุบัน LENGOLF ในใจกลางกรุงเทพฯ (BTS ชิดลม) มีบริการเช่าไม้กอล์ฟ Callaway ระดับพรีเมียมพร้อมส่งถึงโรงแรม จึงจัดเตรียมอุปกรณ์ได้ตั้งแต่ก่อนเดินทาง'
      if (availability === true) {
        return `${name} มีบริการเช่าไม้กอล์ฟภายในสนาม${fee ? ` ค่าบริการประมาณ ${n(fee)} บาทต่อรอบ` : ''} ${lengolf}`
      }
      if (availability === false) return `${name} ไม่มีบริการเช่าไม้กอล์ฟภายในสนาม ${lengolf}`
      return `ยังไม่มีข้อมูลยืนยันว่า ${name} มีบริการเช่าไม้กอล์ฟภายในสนามหรือไม่ ${lengolf}`
    },
  },

  // Japanese pack, written to the JA glossary rules (丁寧語 です/ます, prices
  // as digits+THB with no space and never バーツ, 〜 (U+301C) for ranges,
  // half-width digits, no exclamation marks, キャディー/グリーンフィー
  // spellings, （<年>年<月>月現在） as-of). Prices hedge with 約.
  ja: {
    province: (raw) => PROVINCE_L10N[raw]?.ja,
    closedQuestion: (name) => `${name}は現在も営業していますか？`,
    closedAnswer: (name, permanent) =>
      permanent
        ? `いいえ — ${name}はすでに閉業しています。`
        : `${name}は一時休業中と報告されています。ラウンドを計画する前に、コースへ電話でご確認ください。`,
    whereWasQuestion: (name) => `${name}はどこにありましたか？`,
    whereWasAnswer: (name, km, province) =>
      province
        ? `${name}は${province}の、バンコク中心部から約${km}kmの場所にありました。`
        : `${name}はバンコク中心部から約${km}kmの場所にありました。`,
    feeQuestion: (name) => `${name}のグリーンフィーはいくらですか？`,
    feeAnswer: (name, weekday, weekend, verifiedAt) => {
      let answer = `${name}の平日グリーンフィーは約${n(weekday)}THB`
      if (weekend) answer += `、週末は約${n(weekend)}THB`
      answer += 'です'
      if (verifiedAt) answer += `（${asOfMonthYear(verifiedAt, 'ja')}現在）`
      return answer + '。料金は季節によって変動するため、ご予約の際にコースへ直接ご確認ください。'
    },
    distanceQuestion: (name) => `${name}はバンコクからどのくらいの距離ですか？`,
    distanceAnswer: (name, km, drive, province) => {
      let answer = `${name}はバンコク中心部から約${km}kmの距離にあります。`
      if (drive) {
        answer += drive.hours
          ? `車での所要時間は約${drive.text}時間です。`
          : `車での所要時間は約${drive.text}分です。`
      }
      if (province) answer += `コースは${province}にあります。`
      return answer
    },
    caddieQuestion: (name) => `${name}ではキャディーは必要ですか？`,
    caddieAnswer: (name, required, fee) => {
      const feeNote = fee ? `（キャディーフィーは1ラウンド約${n(fee)}THB）` : ''
      return required
        ? `はい — ${name}ではキャディーの同伴が必須です${feeNote}。慣習として、これとは別にキャディーへのチップ（通常300〜500THB）を渡します。`
        : `${name}ではキャディーの利用は任意です${feeNote}。`
    },
    rentalQuestion: (name) => `${name}でプレーする際にゴルフクラブをレンタルできますか？`,
    rentalAnswer: (name, availability, fee) => {
      const lengolf =
        '現行モデルのセットをご希望なら、バンコク中心部（BTSチットロム駅）のLENGOLFがプレミアムなCallawayクラブをホテル配送付きでレンタルしているので、旅行前に道具を手配できます。'
      if (availability === true) {
        return `${name}ではコース内でレンタルクラブを利用できます${fee ? `（1ラウンド約${n(fee)}THB）` : ''}。${lengolf}`
      }
      if (availability === false) return `${name}にはコース内のクラブレンタルがありません。${lengolf}`
      return `${name}でコース内のクラブレンタルが利用できるかは確認できていません。${lengolf}`
    },
  },
}

export function getCourseFaqs(course: GolfCourse, locale: CourseSeoLocale = 'en'): CourseFaqItem[] {
  const L = FAQ_L10N[locale]
  const faqs: CourseFaqItem[] = []
  const name = course.name

  // Closure status leads — and a permanently closed course gets ONLY the
  // closure + location answers (green-fee/caddie/rental FAQs would imply
  // bookable golf at a course that no longer exists).
  const closed =
    course.operational_status === 'permanently_closed' ||
    course.operational_status === 'temporarily_closed'
  if (closed) {
    faqs.push({
      question: L.closedQuestion(name),
      answer: L.closedAnswer(
        name,
        course.operational_status === 'permanently_closed',
        course.operational_note ?? null
      ),
    })
  }
  if (course.operational_status === 'permanently_closed') {
    if (course.distance_from_bangkok_km) {
      faqs.push({
        question: L.whereWasQuestion(name),
        answer: L.whereWasAnswer(
          name,
          course.distance_from_bangkok_km,
          L.province(course.province)
        ),
      })
    }
    return faqs
  }

  if (course.green_fee_weekday_thb) {
    faqs.push({
      question: L.feeQuestion(name),
      answer: L.feeAnswer(
        name,
        course.green_fee_weekday_thb,
        course.green_fee_weekend_thb ?? null,
        course.fees_verified_at ?? null
      ),
    })
  }

  if (course.distance_from_bangkok_km) {
    const min = course.drive_time_from_bangkok_min
    // Keep half hours exact above the 2-hour cutoff — "roughly 660 minutes"
    // would be absurd for distant courses.
    const drive = min
      ? min >= 120
        ? { hours: true, text: formatHours(min) }
        : { hours: false, text: String(min) }
      : null
    faqs.push({
      question: L.distanceQuestion(name),
      answer: L.distanceAnswer(
        name,
        course.distance_from_bangkok_km,
        drive,
        L.province(course.province)
      ),
    })
  }

  faqs.push({
    question: L.caddieQuestion(name),
    answer: L.caddieAnswer(name, course.caddie_required, course.caddie_fee_thb ?? null),
  })

  faqs.push({
    question: L.rentalQuestion(name),
    answer: L.rentalAnswer(
      name,
      course.club_rental_available ?? null,
      course.club_rental_fee_thb ?? null
    ),
  })

  return faqs
}
