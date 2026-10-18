import { BUSINESS_INFO, SOCIAL_LINKS } from '@/lib/constants'

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
 * the URL may also be printed or shared, so it must keep serving 200.
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

/**
 * The LINE add-friend shortlink every button and the QR code on the page
 * point at. NOT this page's own URL (that is LINE_PAGE_PATH): pointing the
 * buttons or the QR code at /line/ would loop back to this page.
 */
export const LINE_ADD_FRIEND_URL = SOCIAL_LINKS.line

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
      'Add LENGOLF on LINE (@lengolf) to book a golf simulator bay, ask about prices or lessons, plan a party or rent clubs. At BTS Chidlom, open 9am to 11pm daily.',
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
          body: "Send us the day, the time and how many players, and we'll check availability and book your bay.",
        },
        {
          key: 'ask',
          title: 'Ask a question',
          body: 'Prices, opening hours, parking, lessons or how to get here: send a message and our team will answer.',
        },
        {
          key: 'events',
          title: 'Events and parties',
          body: "Birthdays, team building or a company party. Tell us the date and your group size and we'll put a package together.",
        },
        {
          key: 'clubs',
          title: 'Golf club rental',
          body: 'Standard clubs are free in every bay. Ask us about premium sets to use in your bay or to take to a golf course.',
        },
      ],
    },
    visit: {
      title: { primary: 'Visit', suffix: 'LENGOLF' },
      addressLabel: 'Address',
      address: BUSINESS_INFO.address,
      transitLabel: 'Getting here',
      transit: 'BTS Chidlom, Exit 4. Take the skywalk straight into The Mercury Ville, then go up to Floor 4.',
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
      'แอดไลน์ LENGOLF (@lengolf) ไว้จองห้องซิมกอล์ฟ ถามราคาและคอร์สเรียน จัดปาร์ตี้หรืองานบริษัท หรือเช่าไม้กอล์ฟ อยู่ที่ The Mercury Ville ติด BTS ชิดลม เปิดทุกวัน 9.00-23.00 น.',
    breadcrumb: { home: 'หน้าแรก', self: 'LINE @lengolf' },
    hero: {
      eyebrow: 'LINE Official Account',
      title: 'ทัก LINE หา LENGOLF ได้เลย',
      intro:
        'จองห้องซิม ถามราคา หรือปรึกษาเรื่องจัดปาร์ตี้ ทักมาที่ LINE @lengolf ติดต่อทางนี้สะดวกที่สุด',
      cta: 'เปิด LINE',
      lineIdLabel: 'LINE ID',
      qrCaption: 'สแกนด้วยกล้องมือถือหรือแอป LINE แล้วกดเพิ่มเพื่อน',
      qrLabel: 'QR โค้ดเพิ่มเพื่อน LENGOLF ใน LINE (@lengolf)',
    },
    help: {
      title: { primary: 'ทักมาเรื่องอะไรได้บ้าง', suffix: '' },
      items: [
        {
          key: 'book',
          title: 'จองห้องซิม',
          body: 'บอกวัน เวลา และจำนวนคน เราเช็กห้องว่างแล้วจองให้',
        },
        {
          key: 'ask',
          title: 'สอบถามทั่วไป',
          body: 'ราคา เวลาเปิด-ปิด ที่จอดรถ คอร์สเรียน หรือวิธีเดินทาง ทักมาถามได้เลย',
        },
        {
          key: 'events',
          title: 'ปาร์ตี้และงานบริษัท',
          body: 'ปาร์ตี้วันเกิด ทีมบิลดิ้ง หรืองานเลี้ยงบริษัท แจ้งวันและจำนวนคน แล้วทีมงานช่วยจัดแพ็กเกจให้',
        },
        {
          key: 'clubs',
          title: 'เช่าไม้กอล์ฟ',
          body: 'ห้องซิมมีไม้กอล์ฟมาตรฐานให้ใช้ฟรี ถ้าอยากได้ชุดไม้พรีเมียม จะใช้ในห้องซิมหรือเช่าไปออกรอบที่สนามก็ทักมาได้',
        },
      ],
    },
    visit: {
      title: { primary: 'ที่ตั้งและเวลาเปิด-ปิด', suffix: '' },
      addressLabel: 'ที่อยู่',
      address: 'The Mercury Ville @ BTS ชิดลม ชั้น 4 ถนนเพลินจิต 540 แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ 10330',
      transitLabel: 'วิธีเดินทาง',
      transit: 'ลง BTS ชิดลม ออกทางออก 4 แล้วเดินสกายวอล์กเข้า The Mercury Ville โดยตรง ไม่ต้องข้ามถนน จากนั้นขึ้นลิฟต์หรือบันไดเลื่อนมาที่ชั้น 4',
      hoursLabel: 'เวลาเปิด-ปิด',
      hours: 'เปิดทุกวัน 9.00-23.00 น.',
    },
    book: {
      title: 'หรือจะจองออนไลน์ก็ได้',
      body: 'เลือกวัน ห้อง และเวลาเองได้ที่ booking.len.golf',
      cta: 'จองเลย',
    },
  },
}

/** TH gets its own block; every other locale is served the EN page (see the docblock). */
export function getLinePageContent(locale: string): LinePageContent {
  return locale === 'th' ? LINE_PAGE_CONTENT.th : LINE_PAGE_CONTENT.en
}
