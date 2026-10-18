import { SOCIAL_LINKS } from '@/lib/constants'

/**
 * /line/: LENGOLF's own page for the LINE Official Account (@lengolf).
 *
 * Until 2026-10-18 /line/ was a 307 to the lin.ee shortlink in next.config.js,
 * made so Google Ads sitelinks could carry a len.golf URL. Google then
 * disapproved both LINE sitelinks for "Insufficient original content" and
 * "Destination mismatch": its crawler followed the redirect and landed on
 * LINE's own page. So this is a real page, and it must stay one. Do NOT add a
 * redirect, a meta refresh or a script that jumps to LINE: Google treats any
 * of them as a redirect, and the sitelinks go back to disapproved. Posters,
 * QR codes and LINE messages also point at /line/, so the URL must keep
 * serving 200.
 *
 * Published in EN and TH only, so the copy lives here rather than in
 * messages/*.json (same reasoning as data/junior-academy.ts): ja/ko/zh are
 * not registered in lib/translated-routes.ts and the middleware 301s them to
 * the EN page. The Thai was written with the natural-thai skill from the
 * facts below, not translated line by line, so a TH string will not map
 * one-to-one onto its EN sibling.
 *
 * Facts used, all from the site's own copy: LINE ID @lengolf, the
 * SOCIAL_LINKS.line shortlink, booking.len.golf, BUSINESS_INFO's address,
 * BTS Chidlom Exit 4 and the skywalk (data/faq-hub.ts directions), open
 * every day 9am to 11pm (if BUSINESS_INFO.hours changes, change both
 * locales here too). No reply-time promise and no prices: neither belongs on
 * a page that has to stay true without edits.
 */

export const LINE_PAGE_PATH = '/line/'

/** The add-friend link every button and the QR code on the page point at. */
export const LINE_PAGE_URL = SOCIAL_LINKS.line

/** Shown on the page. The OA's ID, as the rest of the site writes it. */
export const LINE_ID = '@lengolf'

/** Last real edit to this page's content. Sitemap <lastmod>; bump on copy edits. */
export const LINE_PAGE_UPDATED_AT = '2026-10-18'

export interface LinePageContent {
  metaTitle: string
  metaDescription: string
  breadcrumb: { home: string; self: string }
  hero: {
    eyebrow: string
    title: string
    intro: string
    cta: string
    lineIdLabel: string
    qrCaption: string
    qrLabel: string
  }
  help: {
    /** Split heading: `primary` in brand green, `suffix` in black. Either may be empty. */
    title: { primary: string; suffix: string }
    items: { key: 'book' | 'ask' | 'events' | 'clubs'; title: string; body: string }[]
  }
  visit: {
    title: { primary: string; suffix: string }
    addressLabel: string
    address: string
    transitLabel: string
    transit: string
    hoursLabel: string
    hours: string
  }
  book: { title: string; body: string; cta: string }
}

export const LINE_PAGE_CONTENT: Record<'en' | 'th', LinePageContent> = {
  en: {
    metaTitle: 'LINE @lengolf: Book a Bay, Ask Us, Plan a Party',
    metaDescription:
      'Add LENGOLF on LINE (@lengolf) to book a golf simulator bay, ask about prices and lessons, plan a party or rent golf clubs. Scan the QR code or tap Open LINE. At BTS Chidlom, open 9am to 11pm daily.',
    breadcrumb: { home: 'Home', self: 'LINE @lengolf' },
    hero: {
      eyebrow: 'LINE Official Account',
      title: 'Chat with LENGOLF on LINE',
      intro:
        'Book a bay, ask a quick question or plan a party with our team. LINE is the easiest way to reach us.',
      cta: 'Open LINE',
      lineIdLabel: 'LINE ID',
      qrCaption: 'Scan with your phone camera or the LINE app to add us.',
      qrLabel: 'QR code to add LENGOLF on LINE (@lengolf)',
    },
    help: {
      title: { primary: 'What We', suffix: 'Can Help With' },
      items: [
        {
          key: 'book',
          title: 'Book a bay',
          body: 'Send us the day, the time and how many players, and we reserve a golf simulator bay for you.',
        },
        {
          key: 'ask',
          title: 'Ask a question',
          body: 'Prices, opening hours, parking, lessons or how to get here: send a message and our team answers.',
        },
        {
          key: 'events',
          title: 'Events and parties',
          body: 'Birthdays, team building or a company party. Tell us the date and your group size and we put a package together.',
        },
        {
          key: 'clubs',
          title: 'Golf club rental',
          body: 'Ask about premium club sets, to use in your bay or to take to a golf course.',
        },
      ],
    },
    visit: {
      title: { primary: 'Visit', suffix: 'LENGOLF' },
      addressLabel: 'Address',
      address: 'The Mercury Ville @ BTS Chidlom, Floor 4, 540 Ploenchit Road, Lumpini, Pathumwan, Bangkok 10330',
      transitLabel: 'Getting here',
      transit: 'BTS Chidlom, Exit 4. The skywalk takes you straight into The Mercury Ville, then up to Floor 4.',
      hoursLabel: 'Opening hours',
      hours: 'Open every day, 9am to 11pm',
    },
    book: {
      title: 'Prefer to book online?',
      body: 'Pick your day, bay and time yourself at booking.len.golf.',
      cta: 'Book now',
    },
  },
  th: {
    metaTitle: 'แอดไลน์ @lengolf จองห้องซิมกอล์ฟ สอบถาม จัดปาร์ตี้',
    metaDescription:
      'แอดไลน์ LENGOLF (@lengolf) จองห้องซิมกอล์ฟ ถามราคาและเรื่องเรียนกอล์ฟ จัดปาร์ตี้หรืองานบริษัท และเช่าไม้กอล์ฟ สแกน QR หรือกดเปิด LINE ได้เลย อยู่ที่ The Mercury Ville ติด BTS ชิดลม เปิดทุกวัน 9.00-23.00 น.',
    breadcrumb: { home: 'หน้าแรก', self: 'LINE @lengolf' },
    hero: {
      eyebrow: 'LINE Official Account',
      title: 'ทัก LINE หา LENGOLF ได้เลย',
      intro:
        'จองห้องซิม ถามเรื่องราคา หรือวางแผนจัดปาร์ตี้ ทักมาที่ LINE @lengolf ช่องทางนี้ติดต่อเราได้ง่ายที่สุด',
      cta: 'เปิด LINE',
      lineIdLabel: 'LINE ID',
      qrCaption: 'สแกนด้วยกล้องมือถือหรือแอป LINE เพื่อเพิ่มเพื่อน',
      qrLabel: 'QR โค้ดเพิ่มเพื่อน LENGOLF ใน LINE (@lengolf)',
    },
    help: {
      title: { primary: 'ทักมาเรื่องอะไรได้บ้าง', suffix: '' },
      items: [
        {
          key: 'book',
          title: 'จองห้องซิม',
          body: 'บอกวัน เวลา และจำนวนคน แล้วเราจองห้องซิมกอล์ฟให้',
        },
        {
          key: 'ask',
          title: 'สอบถามทั่วไป',
          body: 'ราคา เวลาเปิด ที่จอดรถ เรียนกอล์ฟ หรือวิธีเดินทาง ทักมาถามได้เลย',
        },
        {
          key: 'events',
          title: 'ปาร์ตี้และงานบริษัท',
          body: 'จัดวันเกิด ทีมบิลดิ้ง หรืองานเลี้ยงบริษัท แจ้งวันและจำนวนคน แล้วทีมงานช่วยจัดแพ็กเกจให้',
        },
        {
          key: 'clubs',
          title: 'เช่าไม้กอล์ฟ',
          body: 'ถามเรื่องไม้กอล์ฟชุดพรีเมียม จะใช้ในห้องซิมหรือเช่าไปออกรอบที่สนามก็ได้',
        },
      ],
    },
    visit: {
      title: { primary: 'ที่ตั้งและเวลาเปิด', suffix: '' },
      addressLabel: 'ที่อยู่',
      address: 'The Mercury Ville @ BTS ชิดลม ชั้น 4 ถนนเพลินจิต 540 แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ 10330',
      transitLabel: 'การเดินทาง',
      transit: 'BTS ชิดลม ทางออก 4 เดินสกายวอล์กเข้า The Mercury Ville ได้เลย ไม่ต้องข้ามถนน แล้วขึ้นมาที่ชั้น 4',
      hoursLabel: 'เวลาเปิด',
      hours: 'เปิดทุกวัน 9.00-23.00 น.',
    },
    book: {
      title: 'อยากจองออนไลน์',
      body: 'เลือกวัน ห้อง และเวลาเองได้ที่ booking.len.golf',
      cta: 'จองเลย',
    },
  },
}

/** TH gets its own block; every other locale is served the EN page (see the docblock). */
export function getLinePageContent(locale: string): LinePageContent {
  return locale === 'th' ? LINE_PAGE_CONTENT.th : LINE_PAGE_CONTENT.en
}
