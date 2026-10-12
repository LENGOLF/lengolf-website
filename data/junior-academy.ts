import { storageUrl } from '@/lib/constants'

/**
 * LENGOLF Junior Academy: the kids golf program (ages 4 to 12) sold in POS as
 * "Junior Academy (10 Lessons)" since 2026-10-10.
 *
 * One source for everything /junior-golf-academy/ says: the visible copy, the
 * FAQ (one array feeds the visible Q&A and the FAQPage JSON-LD), the video
 * transcript, the /lessons/ callout, and the llms.txt / llms-full.txt entries.
 *
 * Published in EN and TH only, so the copy lives here rather than in
 * messages/*.json: ja/ko/zh need no keys, and every page's inlined catalog does
 * not grow. ja/ko/zh are not registered in lib/translated-routes.ts, so the
 * middleware 301s them to the EN page.
 *
 * Layout and copy follow the owner's phone-first redesign (v2, 2026-10-12).
 * The Thai was written with the natural-thai skill, not translated from the
 * EN: it uses the words parents say (ขวบ, ห้องซิม, ไม้กอล์ฟเด็ก,
 * ประกาศนียบัตร, วัดผล), so a TH line will not map one-to-one onto its EN
 * sibling, and should not be "corrected" to. The no-break spaces and the word
 * joiner that Thai needs on screen are added at render time (the page's
 * thaiText()), so the strings here stay plain for JSON-LD and the llms files.
 *
 * THE FACTS ARE A CLOSED LIST (owner brief, 2026-10-11, checked against the
 * junior-academy skill): ages 4 to 12; 10 private 60-minute lessons with
 * LENGOLF's PGA coaches; each hour half movement and games,
 * half golf; assessments at lessons 5 and 10; Level 1 and Level 2 certificates
 * and a graduation; 5 hours family practice time; junior clubs fitted to
 * height; 16,900 THB, valid 1 year; enquiries on LINE @lengolf. Also stated,
 * from the junior-academy skill: one hitter at a time, soft balls for
 * beginners, a parent stays in the bay during family practice; and from the
 * v2 redesign (2026-10-12): lessons in Thai or English, matching the
 * /lessons/ coaches' knowsLanguage (th, en). The venue facts
 * (4th floor, skywalk, 9am to 11pm, indoors and air-conditioned) are the
 * site's own, written out here by hand in both locales (place.items,
 * trust.items): if BUSINESS_INFO.hours changes, change them too. The skill topics (putting, chipping, full swing, rules, scoring)
 * come from the published poster. Do NOT add: the trial-only pilot price,
 * coach names or pay (owner decision, 2026-10-11, kept for the redesign on
 * 2026-10-13), group classes, or lesson times ("arranged on LINE").
 *
 * The price is hand-maintained: it is not read from the POS catalog, which
 * would pull this page into the 30-day pricing cache and the
 * validate:pricing-revalidate route set. The price and the program facts are
 * also written out by hand in LessonsFaq.a7 (messages/en.json, th.json), in
 * the EN and TH can-kids-play-golf-simulators entries of data/faq-pages.ts
 * (faq-9, faq-9-th), in lib/jsonld.ts (typicalAgeRange, courseWorkload), in
 * the poster, share card and reel, and in the LIFF coaching card
 * (lengolf-booking-new lib/liff/coaching-data.ts). Change them together.
 */

export const JUNIOR_ACADEMY_PATH = '/junior-golf-academy/'

/** POS product "Junior Academy (10 Lessons)". */
export const JUNIOR_ACADEMY_PRICE_THB = 16900

/**
 * The owner's tracked add-friend link for the Junior Academy. Same OA
 * (@101xkory) as SOCIAL_LINKS.line; a separate link so LINE OA Manager can
 * attribute friend adds from this page and the poster QR.
 */
export const JUNIOR_ACADEMY_LINE_URL = 'https://lin.ee/9qMWZLO'

/** Last real edit to this page's content. Sitemap <lastmod>; bump on copy edits. */
export const JUNIOR_ACADEMY_UPDATED_AT = '2026-10-13'

export const JUNIOR_ACADEMY_IMAGES = {
  /** The program poster: the Course node's image (no longer shown on the page). */
  poster: { src: storageUrl('junior-academy/poster-4x5.jpg'), width: 1080, height: 1350 },
  og: { src: storageUrl('junior-academy/og-1200x630.jpg'), width: 1200, height: 630 },
  /** Real lesson photos (portrait files), also in the /lessons/ gallery. */
  photos: {
    benefits: storageUrl('lessons/student-kids-01.jpg'),
    trust: storageUrl('lessons/student-kids-03.jpg'),
    place: storageUrl('lessons/student-kids-02.jpg'),
  },
} as const

/**
 * The 24.7 s short cut, re-encoded for the hero (540x960, H.264, about 1.3 MB,
 * against 5.1 MB for the 720p version it replaced). It autoplays muted in the
 * hero while on screen (owner decision, 2026-10-13).
 */
export const JUNIOR_ACADEMY_VIDEO = {
  src: storageUrl('videos/junior-academy-reel-hero-540.mp4'),
  width: 540,
  height: 960,
  /**
   * The image under the reel, and the page's LCP element: the clip's own
   * first frame (1080x1920), so nothing jumps when playback starts.
   */
  heroPoster: storageUrl('junior-academy/reel-hero-frame0.jpg'),
  /** The designed cover, used as the VideoObject thumbnail. */
  thumbnail: storageUrl('junior-academy/reel-cover.jpg'),
  duration: 'PT25S',
  /** First published on this page. A literal (Bangkok time), never `new Date()`. */
  uploadDate: '2026-10-11T00:00:00+07:00',
} as const

export interface JuniorAcademyQa {
  question: string
  answer: string
}

export interface JuniorAcademyContent {
  metaTitle: string
  metaDescription: string
  /** Joins list items into one sentence for structured data ('. ' in EN; Thai has no full stop). */
  listSeparator: string
  breadcrumb: { home: string; lessons: string; self: string }
  hero: { title: string; subtitle: string; cta: string; ageSticker: string }
  video: {
    label: string
    soundOn: string
    soundOff: string
    pause: string
    play: string
    /** Label of the transcript toggle under the reel. */
    transcriptTitle: string
    /** What the voiceover says (EN: translated from the Thai audio). */
    transcript: string[]
    name: string
    description: string
  }
  benefits: { title: string; photoAlt: string; items: { title: string; body: string }[] }
  journey: {
    title: string
    /** Accessible name of the 10-lesson path drawing. */
    mapLabel: string
    start: string
    milestones: { badge: string; body: string }[]
    lessonTitle: string
    minutes: string
    play: { title: string; body: string }
    golf: { title: string; skills: string[] }
  }
  trust: { title: string; lead: string; photoAlt: string; items: string[] }
  price: {
    title: string
    amount: string
    unit: string
    validity: string
    includedTitle: string
    items: string[]
    cta: string
    /** Dated price line (the TH house style asks for one wherever a price appears). */
    asOf: string
  }
  place: { photoAlt: string; items: string[] }
  faq: { title: string; items: JuniorAcademyQa[] }
  /** Exact substrings of FAQ answers rendered as links (renderFaqAnswer). */
  faqLinks: Record<string, { href: string; external?: boolean }>
  start: { title: string; steps: string[]; cta: string; callLead: string }
  related: { title: string; links: { label: string; href: string }[] }
  /** Structured-data name/description for the Course node. */
  course: { name: string; description: string; credentials: string }
  /** Callout on /lessons/ (rendered only where this page is published). */
  lessonsCallout: { badge: string; title: string; body: string; cta: string; imageAlt: string }
}

const en: JuniorAcademyContent = {
  metaTitle: 'Kids Golf Lessons in Bangkok, Ages 4-12: Junior Academy',
  metaDescription:
    "Private golf lessons for kids aged 4 to 12 with LENGOLF's PGA coaches. 10 lessons with games every time, certificates at lessons 5 and 10, and 5 hours of family practice. 16,900 THB at BTS Chidlom.",
  listSeparator: '. ',
  breadcrumb: { home: 'Home', lessons: 'Golf Lessons', self: 'Junior Academy' },
  hero: {
    title: "Your child's first swing starts with fun",
    subtitle: 'Private golf lessons in Bangkok for kids aged 4 to 12, with PGA coaches at LENGOLF by BTS Chidlom.',
    cta: 'Ask us on LINE',
    ageSticker: 'Ages 4-12',
  },
  video: {
    label: 'LENGOLF Junior Academy intro video, 25 seconds, Thai voiceover',
    soundOn: 'Turn sound on',
    soundOff: 'Turn sound off',
    pause: 'Pause video',
    play: 'Play video',
    transcriptTitle: 'What the video says (translated from Thai)',
    transcript: [
      "Your child's first swing starts with fun.",
      'At LENGOLF Junior Academy we make golf fun for kids aged 4 to 12.',
      "Taught by LENGOLF's PGA coaches, so parents can feel at ease.",
      'At Mercury Ville, BTS Chidlom: our indoor golf simulator.',
      'On screen: Junior Academy, 16,900 THB, 10 lessons, valid for 1 year.',
      'Ask our team about the Junior Academy on LINE @lengolf.',
    ],
    name: 'LENGOLF Junior Academy: kids golf lessons in Bangkok',
    description:
      "A 25-second introduction to the LENGOLF Junior Academy for kids aged 4 to 12: lessons with LENGOLF's PGA coaches at the indoor golf simulator in The Mercury Ville @ BTS Chidlom. 16,900 THB for 10 lessons, valid for 1 year. Thai voiceover.",
  },
  benefits: {
    title: 'What your child gets out of it',
    photoAlt: 'A LENGOLF coach shows a young boy how to hold the club in front of the simulator screen',
    items: [
      {
        title: 'Off the phone and moving',
        body: 'Every lesson has games and challenges, so your child stays active while learning golf.',
      },
      {
        title: 'Focus',
        body: 'Golf asks for attention one shot at a time, and the coach works with your child alone for the full 60 minutes.',
      },
      {
        title: 'Confidence',
        body: 'The coach checks skills at lessons 5 and 10, and your child earns a certificate of their own each time.',
      },
      {
        title: 'Golf as a family',
        body: 'The package includes 5 hours of practice time, so you can play alongside your child in a simulator bay.',
      },
    ],
  },
  journey: {
    title: 'What happens over 10 lessons',
    mapLabel: 'A 10-lesson path: skills check and Level 1 at lesson 5, Level 2 and graduation at lesson 10',
    start: 'Start',
    milestones: [
      { badge: 'LEVEL 1', body: 'Lesson 5: the coach checks skills and your child gets the Level 1 certificate.' },
      { badge: 'LEVEL 2', body: 'Lesson 10: a second check, the Level 2 certificate and graduation.' },
    ],
    lessonTitle: 'Each lesson is 60 minutes',
    minutes: '30 min',
    play: { title: 'Games and movement', body: 'A new challenge every lesson.' },
    golf: { title: 'Golf on the simulator', skills: ['Putting', 'Chipping', 'Full swing', 'Rules', 'Scoring'] },
  },
  trust: {
    title: 'Who teaches, and how we keep kids safe',
    lead: "Every lesson is taught by one of LENGOLF's PGA coaches, in Thai or English.",
    photoAlt: 'A child swings in a LENGOLF simulator bay while the coach watches from behind',
    items: [
      'One hitter at a time in the bay, in lessons and in practice',
      'Soft balls for beginners',
      'A parent stays in the bay during family practice',
      "Junior clubs provided, fitted to your child's height",
      'Indoors and air-conditioned, rain or shine',
    ],
  },
  price: {
    title: 'Course fee',
    amount: '16,900',
    unit: 'THB',
    validity: 'Package valid for 1 year',
    includedTitle: 'Included in the price',
    items: [
      '10 private lessons of 60 minutes with a PGA coach',
      '5 hours of family practice time',
      "Junior clubs fitted to your child's height",
      'Two skills checks, with Level 1 and Level 2 certificates',
      'Graduation at lesson 10',
    ],
    cta: 'Ask us on LINE',
    asOf: 'Price as of October 2026',
  },
  place: {
    photoAlt: 'A coach crouches beside a boy on the putting green at LENGOLF',
    items: [
      '4th floor, The Mercury Ville @ BTS Chidlom',
      'Connected to BTS Chidlom station by skywalk',
      'LENGOLF is open daily, 9am to 11pm',
    ],
  },
  faq: {
    title: 'Questions parents ask',
    items: [
      {
        question: 'My child has never played golf. Can they join?',
        answer:
          'Yes. The course is for kids aged 4 to 12. Beginners use soft balls, and a coach works with your child one to one in every lesson.',
      },
      {
        question: 'Do we need our own clubs?',
        answer: "No. We provide junior clubs, fitted to your child's height.",
      },
      {
        question: 'When are the lessons?',
        answer: "We arrange lesson times with you on LINE @lengolf. Send us your child's age and the days that suit you.",
      },
      {
        question: 'What is the 5 hours of family practice?',
        answer:
          'Practice time in a simulator bay, included in the package. A parent stays in the bay with the child during practice.',
      },
      {
        question: 'How long is the package valid?',
        answer: '1 year.',
      },
      {
        question: 'How do we get there?',
        answer:
          'LENGOLF is on the 4th floor of The Mercury Ville @ BTS Chidlom, connected to BTS Chidlom station by skywalk.',
      },
    ],
  },
  faqLinks: {
    'LINE @lengolf': { href: JUNIOR_ACADEMY_LINE_URL, external: true },
  },
  start: {
    title: 'Want your child to join? Message us on LINE',
    steps: ['Message LINE @lengolf', "Send your child's name, age and height", 'We answer your questions and book the first lesson'],
    cta: 'Ask us on LINE',
    callLead: 'or call',
  },
  related: {
    title: 'Related',
    links: [
      { label: 'Golf lessons', href: '/lessons' },
      { label: 'Can kids play golf simulators?', href: '/faq/can-kids-play-golf-simulators' },
    ],
  },
  course: {
    name: 'LENGOLF Junior Academy',
    description:
      "Kids golf program for ages 4 to 12 at LENGOLF in Bangkok: 10 private 60-minute lessons with LENGOLF's PGA coaches, each hour half movement and games and half golf, assessments at lessons 5 and 10, Level 1 and Level 2 certificates, graduation, 5 hours of family practice time, and junior clubs provided, fitted to height.",
    credentials: 'Level 1 and Level 2 certificates',
  },
  lessonsCallout: {
    badge: 'Ages 4 to 12',
    title: 'Golf Lessons for Kids: LENGOLF Junior Academy',
    body: '10 private lessons of 60 minutes, assessments at lessons 5 and 10, Level 1 and Level 2 certificates, 5 hours of family practice time and junior clubs provided. 16,900 THB, valid for 1 year.',
    cta: 'See the Junior Academy',
    imageAlt: 'A coach crouches beside a boy on the putting green at LENGOLF',
  },
}

const th: JuniorAcademyContent = {
  metaTitle: 'เรียนกอล์ฟเด็ก 4-12 ขวบ ตัวต่อตัวกับโค้ช PGA ชิดลม: Junior Academy',
  metaDescription:
    'คอร์สเรียนกอล์ฟสำหรับน้องๆ 4-12 ขวบ เรียนตัวต่อตัวกับโค้ช PGA 10 ครั้ง มีเกมทุกครั้ง วัดผลพร้อมประกาศนียบัตร และมีเวลาซ้อมให้ครอบครัว 5 ชั่วโมง ราคา 16,900 บาท ที่ LENGOLF ติด BTS ชิดลม',
  listSeparator: ' ',
  breadcrumb: { home: 'หน้าแรก', lessons: 'เรียนกอล์ฟ', self: 'Junior Academy' },
  hero: {
    title: 'วงสวิงแรกของลูก เริ่มต้นด้วยความสนุก',
    subtitle: 'เรียนกอล์ฟเด็ก 4-12 ขวบ ตัวต่อตัวกับโค้ช PGA ที่ LENGOLF ติด BTS ชิดลม กรุงเทพฯ',
    cta: 'ทัก LINE สอบถาม',
    ageSticker: '4-12 ขวบ',
  },
  video: {
    label: 'คลิปแนะนำ LENGOLF Junior Academy ความยาว 25 วินาที บรรยายภาษาไทย',
    soundOn: 'เปิดเสียง',
    soundOff: 'ปิดเสียง',
    pause: 'หยุดคลิป',
    play: 'เล่นคลิป',
    transcriptTitle: 'คำบรรยายในคลิป',
    // The voiceover verbatim (so "จาก LENGOLF" stays: it is what is said).
    transcript: [
      'วงสวิงแรกของลูก เริ่มต้นด้วยความสนุก',
      'ที่ LENGOLF Junior Academy เราทำให้กอล์ฟสนุกโดนใจ น้องๆ วัย 4 ถึง 12 ปี',
      'สอนโดยโค้ช PGA จาก LENGOLF ให้คุณพ่อคุณแม่อุ่นใจ',
      'ที่ Mercury Ville BTS ชิดลม ห้องซิมกอล์ฟในร่ม',
      'บนจอ: Junior Academy 16,900 บาท เรียน 10 ครั้ง ใช้ได้ 1 ปี',
      'สอบถามทีมงานเรื่อง Junior Academy ได้เลย ที่ LINE @lengolf',
    ],
    name: 'LENGOLF Junior Academy: คอร์สเรียนกอล์ฟเด็กในกรุงเทพฯ',
    description:
      'คลิปแนะนำ LENGOLF Junior Academy ความยาว 25 วินาที คอร์สเรียนกอล์ฟสำหรับน้องๆ 4-12 ขวบ สอนโดยโค้ช PGA ของ LENGOLF ในห้องซิมกอล์ฟที่ The Mercury Ville @ BTS ชิดลม ราคา 16,900 บาท เรียน 10 ครั้ง ใช้ได้ 1 ปี บรรยายภาษาไทย',
  },
  benefits: {
    title: 'ลูกจะได้อะไรจากคอร์สนี้',
    photoAlt: 'โค้ช LENGOLF สอนเด็กชายจับไม้กอล์ฟหน้าจอซิมกอล์ฟ',
    items: [
      { title: 'วางมือถือ มาขยับตัว', body: 'ทุกครั้งมีเกมและภารกิจท้าทายให้ลุ้น ลูกได้ขยับตัวไปพร้อมกับฝึกกอล์ฟ' },
      { title: 'ฝึกสมาธิ', body: 'กอล์ฟต้องตั้งใจทีละช็อต และโค้ชดูแลลูกคนเดียวตลอด 60 นาที' },
      { title: 'เสริมความมั่นใจ', body: 'โค้ชวัดผลในครั้งที่ 5 และ 10 แล้วลูกจะได้ประกาศนียบัตรเป็นของตัวเอง' },
      { title: 'เล่นด้วยกันทั้งครอบครัว', body: 'ในคอร์สมีเวลาซ้อม 5 ชั่วโมง ให้คุณพ่อคุณแม่มาซ้อมกับลูกในห้องซิม' },
    ],
  },
  journey: {
    title: 'เรียนอะไรบ้างใน 10 ครั้ง',
    mapLabel: 'เส้นทางการเรียน 10 ครั้ง วัดผลและรับ Level 1 ในครั้งที่ 5 รับ Level 2 และจบหลักสูตรในครั้งที่ 10',
    start: 'เริ่ม',
    milestones: [
      { badge: 'LEVEL 1', body: 'ครั้งที่ 5 โค้ชวัดผล ลูกได้ประกาศนียบัตร Level 1' },
      { badge: 'LEVEL 2', body: 'ครั้งที่ 10 วัดผลอีกครั้ง ได้ประกาศนียบัตร Level 2 และจบหลักสูตร' },
    ],
    lessonTitle: 'แต่ละครั้งเรียน 60 นาที',
    minutes: '30 นาที',
    play: { title: 'เล่นเกม ขยับร่างกาย', body: 'มีภารกิจท้าทายให้ลุ้นทุกครั้ง' },
    golf: { title: 'ฝึกกอล์ฟในห้องซิม', skills: ['พัตต์', 'ชิพ', 'สวิงเต็มวง', 'กติกา', 'นับสกอร์'] },
  },
  trust: {
    title: 'ใครสอน และดูแลลูกอย่างไร',
    lead: 'สอนโดยโค้ช PGA ของ LENGOLF เรียนได้ทั้งภาษาไทยและภาษาอังกฤษ',
    photoAlt: 'เด็กตีกอล์ฟในห้องซิมของ LENGOLF โดยมีโค้ชยืนดูอยู่ด้านหลัง',
    items: [
      'ในห้องตีได้ทีละคน ทั้งตอนเรียนและตอนซ้อม',
      'น้องๆ ที่เพิ่งเริ่มใช้ลูกกอล์ฟนิ่ม',
      'ช่วงซ้อมของครอบครัว ผู้ปกครองต้องอยู่ดูแลลูกในห้องด้วย',
      'มีไม้กอล์ฟเด็กให้ใช้ เลือกขนาดตามส่วนสูงของลูก',
      'ห้องแอร์ในร่ม ไม่กลัวฝน',
    ],
  },
  price: {
    title: 'ค่าเรียน',
    amount: '16,900',
    unit: 'บาท',
    validity: 'แพ็กเกจใช้ได้ 1 ปี',
    includedTitle: 'ราคานี้รวม',
    items: [
      'เรียนตัวต่อตัวกับโค้ช PGA 10 ครั้ง ครั้งละ 60 นาที',
      'เวลาซ้อมสำหรับครอบครัว 5 ชั่วโมง',
      'ไม้กอล์ฟเด็ก เลือกขนาดตามส่วนสูง',
      'วัดผล 2 ครั้ง พร้อมประกาศนียบัตร Level 1 และ Level 2',
      'จบหลักสูตรในครั้งที่ 10',
    ],
    cta: 'ทัก LINE สอบถาม',
    // Gregorian year, as on every other TH page; "ข้อมูล ณ" is the marker
    // validate:i18n looks for.
    asOf: 'ข้อมูล ณ ตุลาคม 2026',
  },
  place: {
    photoAlt: 'โค้ชนั่งสอนเด็กพัตต์บนกรีนที่ LENGOLF',
    items: ['ชั้น 4 The Mercury Ville @ BTS ชิดลม', 'มีสกายวอล์กเชื่อมกับสถานี BTS ชิดลม', 'LENGOLF เปิดทุกวัน 9.00-23.00 น.'],
  },
  faq: {
    title: 'คำถามที่พบบ่อย',
    items: [
      {
        question: 'ลูกไม่เคยเล่นกอล์ฟมาก่อน เรียนได้ไหม?',
        answer: 'ได้ คอร์สนี้รับน้องๆ อายุ 4-12 ขวบ น้องๆ ที่เพิ่งเริ่มจะใช้ลูกกอล์ฟนิ่ม และมีโค้ชดูแลตัวต่อตัวทุกครั้ง',
      },
      {
        question: 'ต้องเตรียมไม้กอล์ฟไปเองไหม?',
        answer: 'ไม่ต้อง เรามีไม้กอล์ฟเด็กให้ใช้ เลือกขนาดตามส่วนสูงของลูก',
      },
      {
        question: 'เรียนวันไหน เวลาไหนได้บ้าง?',
        answer: 'นัดกับทีมงานทาง LINE @lengolf ได้เลย บอกอายุของลูกและวันที่สะดวกมา',
      },
      {
        question: 'เวลาซ้อม 5 ชั่วโมงสำหรับครอบครัวคืออะไร?',
        answer: 'เป็นเวลาซ้อมในห้องซิมกอล์ฟที่รวมอยู่ในแพ็กเกจ ระหว่างซ้อม ผู้ปกครองต้องอยู่ดูแลลูกในห้องด้วย',
      },
      {
        question: 'แพ็กเกจใช้ได้นานแค่ไหน?',
        answer: 'แพ็กเกจใช้ได้ 1 ปี',
      },
      {
        question: 'เดินทางไปยังไง?',
        answer: 'LENGOLF อยู่ชั้น 4 The Mercury Ville @ BTS ชิดลม มีสกายวอล์กเชื่อมกับสถานี BTS ชิดลม',
      },
    ],
  },
  faqLinks: {
    'LINE @lengolf': { href: JUNIOR_ACADEMY_LINE_URL, external: true },
  },
  start: {
    title: 'สนใจให้ลูกเรียน ทัก LINE มาได้เลย',
    steps: ['ทักมาที่ LINE @lengolf', 'แจ้งชื่อ อายุ และส่วนสูงของลูก', 'ทีมงานตอบทุกคำถาม และนัดวันเรียนครั้งแรกให้'],
    cta: 'ทัก LINE สอบถาม',
    callLead: 'หรือโทร',
  },
  related: {
    title: 'อ่านเพิ่มเติม',
    links: [
      { label: 'เรียนกอล์ฟ', href: '/lessons' },
      { label: 'เด็กเล่นกอล์ฟซิมได้ไหม', href: '/faq/can-kids-play-golf-simulators' },
    ],
  },
  course: {
    name: 'LENGOLF Junior Academy',
    description:
      'คอร์สเรียนกอล์ฟสำหรับน้องๆ 4-12 ขวบ ที่ LENGOLF ชิดลม กรุงเทพฯ เรียนตัวต่อตัวกับโค้ช PGA ของ LENGOLF 10 ครั้ง ครั้งละ 60 นาที ทุกครั้งเล่นเกม ขยับร่างกายครึ่งชั่วโมง และฝึกกอล์ฟอีกครึ่งชั่วโมง โค้ชวัดผลในครั้งที่ 5 และ 10 พร้อมประกาศนียบัตร Level 1 และ Level 2 จบหลักสูตรในครั้งที่ 10 มีเวลาซ้อมสำหรับครอบครัว 5 ชั่วโมง และมีไม้กอล์ฟเด็กให้ใช้ เลือกขนาดตามส่วนสูง',
    credentials: 'ประกาศนียบัตร Level 1 และ Level 2',
  },
  lessonsCallout: {
    badge: '4-12 ขวบ',
    title: 'เรียนกอล์ฟเด็ก: LENGOLF Junior Academy',
    body: 'เรียนตัวต่อตัวกับโค้ช PGA 10 ครั้ง ครั้งละ 60 นาที โค้ชวัดผลในครั้งที่ 5 และ 10 พร้อมประกาศนียบัตร Level 1 และ Level 2 มีเวลาซ้อมสำหรับครอบครัว 5 ชั่วโมง และมีไม้กอล์ฟเด็กให้ใช้ ราคา 16,900 บาท แพ็กเกจใช้ได้ 1 ปี',
    cta: 'ดูรายละเอียด Junior Academy',
    imageAlt: 'โค้ชนั่งสอนเด็กพัตต์บนกรีนที่ LENGOLF',
  },
}

/**
 * Raw per-locale content, for validators that must lint exactly what a locale
 * ships (an EN fallback in a th slot would pass a script check silently).
 */
export const JUNIOR_ACADEMY_CONTENT: Partial<Record<string, JuniorAcademyContent>> = { en, th }

/** Content for a locale, EN for any locale without its own block. */
export function getJuniorAcademyContent(locale: string): JuniorAcademyContent {
  return JUNIOR_ACADEMY_CONTENT[locale] ?? en
}
