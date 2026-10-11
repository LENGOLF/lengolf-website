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
 * THE FACTS ARE A CLOSED LIST (owner brief, 2026-10-11, checked against the
 * junior-academy skill): ages 4 to 12; 10 private 60-minute lessons with
 * LENGOLF's PGA coaches; each hour half movement and games, half golf;
 * assessments at lessons 5 and 10; Level 1 and Level 2 certificates and a
 * graduation; 5 hours family practice time; junior clubs fitted to height;
 * 16,900 THB, valid 1 year; enquiries on LINE @lengolf. The skill topics
 * (putting, chipping, full swing, rules, scoring) come from the published
 * poster. Do NOT add: the trial-only pilot price, coach names or pay, group
 * classes, or lesson times (the owner chose "arranged on LINE", 2026-10-11).
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
export const JUNIOR_ACADEMY_UPDATED_AT = '2026-10-11'

export const JUNIOR_ACADEMY_IMAGES = {
  poster: { src: storageUrl('junior-academy/poster-4x5.jpg'), width: 1080, height: 1350 },
  og: { src: storageUrl('junior-academy/og-1200x630.jpg'), width: 1200, height: 630 },
} as const

/** The 24.7 s short cut, re-encoded for the web (720x1280, H.264, about 5 MB). */
export const JUNIOR_ACADEMY_VIDEO = {
  src: storageUrl('videos/junior-academy-reel-short-720.mp4'),
  poster: storageUrl('junior-academy/reel-cover.jpg'),
  width: 720,
  height: 1280,
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
  hero: {
    eyebrow: string
    titleLead: string
    titleMain: string
    subtitle: string
    cta: string
    secondaryCta: string
    ageBadge: string
    posterAlt: string
  }
  stats: { value: string; label: string }[]
  included: {
    title: string
    titleSuffix: string
    intro: string
    items: string[]
    skillsTitle: string
    skills: string[]
  }
  lesson: {
    title: string
    titleSuffix: string
    intro: string
    halves: { label: string; title: string; body: string }[]
  }
  progress: {
    title: string
    titleSuffix: string
    intro: string
    steps: { label: string; title: string; body: string }[]
  }
  video: {
    title: string
    titleSuffix: string
    intro: string
    label: string
    fallback: string
    transcriptTitle: string
    transcript: string[]
    name: string
    description: string
  }
  safety: {
    title: string
    titleSuffix: string
    items: { title: string; body: string }[]
  }
  price: {
    title: string
    amount: string
    items: string[]
    validity: string
    /** Dated price line (the TH house style asks for one wherever a price appears). */
    asOf: string
    cta: string
    note: string
  }
  faq: { title: string; titleSuffix: string; items: JuniorAcademyQa[] }
  /** Exact substrings of FAQ answers rendered as links (renderFaqAnswer). */
  faqLinks: Record<string, { href: string; external?: boolean }>
  related: { title: string; links: { label: string; href: string }[] }
  /** Structured-data name/description for the Course node. */
  course: { name: string; description: string; credentials: string }
  /** Callout on /lessons/ (rendered only where this page is published). */
  lessonsCallout: { badge: string; title: string; body: string; cta: string; imageAlt: string }
}

const en: JuniorAcademyContent = {
  metaTitle: 'Kids Golf Lessons Bangkok, Ages 4 to 12: Junior Academy',
  metaDescription:
    'LENGOLF Junior Academy: 10 private 60-minute golf lessons for kids aged 4 to 12 with our PGA coaches, plus 5 hours family practice. 16,900 THB at BTS Chidlom.',
  listSeparator: '. ',
  breadcrumb: { home: 'Home', lessons: 'Golf Lessons', self: 'Junior Academy' },
  hero: {
    eyebrow: 'LENGOLF Junior Academy · Ages 4 to 12',
    titleLead: 'Kids golf lessons in Bangkok',
    titleMain: 'Junior Academy',
    subtitle:
      "10 private lessons of 60 minutes with LENGOLF's PGA coaches, at our indoor golf simulator in The Mercury Ville @ BTS Chidlom. Every hour is half movement and games, half golf.",
    cta: 'Ask on LINE @lengolf',
    secondaryCta: "What's included",
    ageBadge: 'Ages 4 to 12',
    posterAlt:
      'LENGOLF Junior Academy poster. Indoor golf simulator, Mercury Ville @ BTS Chidlom. Ages 4 to 12. We make learning golf fun for your kids. Trade screen time for tee time. 10 sessions of 60 minutes, plus 5 hours practice time, games and challenges every session, clubs provided. Putting, chipping, full swing, rules and scoring, with progress checked at sessions 5 and 10. 16,900 THB, package valid for 1 year. Ask us on LINE @lengolf.',
  },
  stats: [
    { value: '4 to 12', label: 'Ages' },
    { value: '10 x 60 min', label: 'Private lessons' },
    { value: '5 hours', label: 'Family practice' },
    { value: '16,900 THB', label: 'Valid 1 year' },
  ],
  included: {
    title: "What's",
    titleSuffix: 'Included',
    intro: 'The Junior Academy is one package of 10 lessons. Here is everything in it.',
    items: [
      "10 private lessons of 60 minutes with LENGOLF's PGA coaches",
      'Every hour is half movement and games, half golf',
      'Skills assessments at lessons 5 and 10',
      'Level 1 and Level 2 certificates, and a graduation',
      '5 hours of family practice time in a simulator bay',
      "Junior clubs provided, fitted to your child's height",
      'Package valid for 1 year',
    ],
    skillsTitle: 'Skills covered',
    skills: ['Putting', 'Chipping', 'Full swing', 'Rules', 'Scoring'],
  },
  lesson: {
    title: 'How a Lesson',
    titleSuffix: 'Works',
    intro: 'Every lesson is 60 minutes, one child with one PGA coach, split into two halves.',
    halves: [
      {
        label: '30 min',
        title: 'Movement and games',
        body: 'Half of every hour is movement and games, with challenges in every session.',
      },
      {
        label: '30 min',
        title: 'Golf',
        body: 'The other half is golf on the simulator: putting, chipping, full swing, rules and scoring.',
      },
    ],
  },
  progress: {
    title: 'Progress You',
    titleSuffix: 'Can See',
    intro: 'Parents see progress at two checkpoints.',
    steps: [
      {
        label: 'Lessons 1 to 5',
        title: 'Level 1',
        body: 'A skills assessment at lesson 5, then the Level 1 certificate.',
      },
      {
        label: 'Lessons 6 to 10',
        title: 'Level 2 and graduation',
        body: 'A second assessment at lesson 10, the Level 2 certificate, and graduation.',
      },
    ],
  },
  video: {
    title: 'Watch the',
    titleSuffix: 'Junior Academy',
    intro: 'A 25-second look at the program. The voiceover is in Thai; the transcript below says it in English.',
    label: 'LENGOLF Junior Academy video, 25 seconds, Thai voiceover',
    fallback: 'Your browser cannot play this video. The transcript below covers everything it says.',
    transcriptTitle: 'Transcript (translated from Thai)',
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
  safety: {
    title: 'Safe in',
    titleSuffix: 'the Bay',
    items: [
      {
        title: 'One hitter at a time',
        body: 'Only one person swings at a time in the bay, in lessons and during family practice.',
      },
      { title: 'Soft balls for beginners', body: 'Children who are just starting out hit soft balls, not regular golf balls.' },
      {
        title: 'Parents supervise practice hours',
        body: 'During the 5 hours of family practice time, a parent stays with the child in the bay.',
      },
    ],
  },
  price: {
    title: 'One Package, One Price',
    amount: '16,900 THB',
    items: [
      '10 private lessons of 60 minutes',
      '5 hours of family practice time',
      'Junior clubs provided, fitted to height',
      'Assessments at lessons 5 and 10, Level 1 and Level 2 certificates, graduation',
    ],
    validity: 'Package valid for 1 year',
    asOf: 'Price as of October 2026.',
    cta: 'Ask on LINE @lengolf',
    note: 'Lesson times are arranged with you on LINE.',
  },
  faq: {
    title: 'Junior Academy',
    titleSuffix: 'FAQ',
    items: [
      {
        question: 'What ages is the LENGOLF Junior Academy for?',
        answer: 'Children aged 4 to 12. Every lesson is private: one child with one of our PGA coaches.',
      },
      {
        question: 'How much does the Junior Academy cost?',
        answer:
          '16,900 THB for the whole program: 10 private lessons of 60 minutes, 5 hours of family practice time, use of junior clubs, assessments at lessons 5 and 10, the Level 1 and Level 2 certificates, and graduation. The package is valid for 1 year.',
      },
      {
        question: 'What happens in a lesson?',
        answer:
          'Each lesson is 60 minutes. Half of the hour is movement and games, the other half is golf: putting, chipping, full swing, rules and scoring.',
      },
      {
        question: 'How do we see our child is making progress?',
        answer:
          'Your child is assessed at lessons 5 and 10. After lesson 5 they receive the Level 1 certificate, and after lesson 10 the Level 2 certificate and graduation.',
      },
      {
        question: 'Does my child need their own golf clubs?',
        answer: "No. Junior clubs are provided and fitted to your child's height.",
      },
      {
        question: 'What is the family practice time?',
        answer:
          'The package includes 5 hours of practice time in a simulator bay for your family. A parent supervises the child during these practice hours, and practice times are booked with our team on LINE.',
      },
      {
        question: 'How do you keep kids safe in the bay?',
        answer:
          'One hitter at a time, soft balls for beginners, and a parent supervising the child during family practice hours.',
      },
      {
        question: 'When do lessons take place?',
        answer:
          "Lesson times are arranged with you on LINE @lengolf. Message us with your child's age and the days that suit you.",
      },
      {
        question: 'Who teaches the Junior Academy?',
        answer: "Lessons are taught by LENGOLF's PGA coaches.",
      },
      {
        question: 'Where is the LENGOLF Junior Academy?',
        answer:
          'At LENGOLF, the indoor golf simulator on the 4th floor of The Mercury Ville @ BTS Chidlom, Bangkok, connected to the BTS station by skywalk.',
      },
      {
        question: 'How do I sign up?',
        answer:
          "Message us on LINE @lengolf with your child's name, age and height. Our team will answer your questions and arrange the first lesson.",
      },
    ],
  },
  faqLinks: {
    'LINE @lengolf': { href: JUNIOR_ACADEMY_LINE_URL, external: true },
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
    imageAlt: 'Child swinging a junior-sized golf club on a simulator at LENGOLF',
  },
}

const th: JuniorAcademyContent = {
  metaTitle: 'คอร์สเรียนกอล์ฟเด็ก กรุงเทพฯ อายุ 4-12 ปี: Junior Academy',
  metaDescription:
    'LENGOLF Junior Academy คอร์สเรียนกอล์ฟสำหรับเด็กอายุ 4-12 ปี โค้ช PGA สอนตัวต่อตัว 10 ครั้ง ครั้งละ 60 นาที พร้อมเวลาซ้อมสำหรับครอบครัว 5 ชั่วโมง ราคา 16,900 บาท ที่ BTS ชิดลม',
  listSeparator: ' ',
  breadcrumb: { home: 'หน้าแรก', lessons: 'เรียนกอล์ฟ', self: 'Junior Academy' },
  hero: {
    eyebrow: 'LENGOLF Junior Academy · อายุ 4-12 ปี',
    titleLead: 'เรียนกอล์ฟเด็กในกรุงเทพฯ',
    titleMain: 'Junior Academy',
    subtitle:
      'เรียนตัวต่อตัว 10 ครั้ง ครั้งละ 60 นาที กับโค้ช PGA จาก LENGOLF ที่กอล์ฟซิมูเลเตอร์ในร่ม The Mercury Ville @ BTS ชิดลม ทุกชั่วโมงแบ่งเป็นกิจกรรมเคลื่อนไหวและเกมครึ่งหนึ่ง และกอล์ฟอีกครึ่งหนึ่ง',
    cta: 'สอบถามทาง LINE @lengolf',
    secondaryCta: 'ดูว่าในแพ็กเกจมีอะไรบ้าง',
    ageBadge: 'อายุ 4-12 ปี',
    posterAlt:
      'โปสเตอร์ LENGOLF Junior Academy กอล์ฟซิมูเลเตอร์ในร่ม Mercury Ville @ BTS ชิดลม สำหรับเด็กอายุ 4-12 ปี เราทำให้การเรียนกอล์ฟสนุกสำหรับลูกของคุณ เปลี่ยนเวลาติดจอเป็นเวลาตีกอล์ฟ เรียน 10 ครั้ง ครั้งละ 60 นาที พร้อมเวลาซ้อม 5 ชั่วโมง มีเกมและภารกิจท้าทายทุกครั้ง มีไม้กอล์ฟให้ ฝึกการพัตต์ การชิพ ฟูลสวิง กติกา และการนับสกอร์ วัดผลในครั้งที่ 5 และครั้งที่ 10 ราคา 16,900 บาท แพ็กเกจใช้ได้ 1 ปี สอบถามทาง LINE @lengolf',
  },
  stats: [
    { value: '4-12 ปี', label: 'อายุ' },
    { value: '10 x 60 นาที', label: 'เรียนตัวต่อตัว' },
    { value: '5 ชั่วโมง', label: 'ซ้อมกับครอบครัว' },
    { value: '16,900 บาท', label: 'ใช้ได้ 1 ปี' },
  ],
  included: {
    title: 'ในแพ็กเกจ',
    titleSuffix: 'มีอะไรบ้าง',
    intro: 'Junior Academy คือแพ็กเกจเรียน 10 ครั้งในราคาเดียว ประกอบด้วย',
    items: [
      'เรียนตัวต่อตัว 10 ครั้ง ครั้งละ 60 นาที กับโค้ช PGA จาก LENGOLF',
      'ทุกชั่วโมงแบ่งเป็นกิจกรรมเคลื่อนไหวและเกมครึ่งหนึ่ง และกอล์ฟอีกครึ่งหนึ่ง',
      'ประเมินทักษะในครั้งที่ 5 และครั้งที่ 10',
      'ใบประกาศ Level 1 และ Level 2 พร้อมการจบหลักสูตร',
      'เวลาซ้อมสำหรับครอบครัว 5 ชั่วโมงในเบย์กอล์ฟซิมูเลเตอร์',
      'มีไม้กอล์ฟจูเนียร์ให้ เลือกขนาดให้พอดีกับส่วนสูงของลูก',
      'แพ็กเกจใช้ได้ 1 ปี',
    ],
    skillsTitle: 'ทักษะที่ได้ฝึก',
    skills: ['การพัตต์', 'การชิพ', 'ฟูลสวิง', 'กติกา', 'การนับสกอร์'],
  },
  lesson: {
    title: 'ใน 1 ชั่วโมง',
    titleSuffix: 'เรียนอะไรบ้าง',
    intro: 'ทุกครั้งเรียน 60 นาที เด็กหนึ่งคนกับโค้ช PGA หนึ่งคน แบ่งเป็นสองส่วน',
    halves: [
      {
        label: '30 นาที',
        title: 'กิจกรรมเคลื่อนไหวและเกม',
        body: 'ครึ่งหนึ่งของทุกชั่วโมงเป็นกิจกรรมเคลื่อนไหวและเกม มีภารกิจท้าทายทุกครั้ง',
      },
      {
        label: '30 นาที',
        title: 'กอล์ฟ',
        body: 'อีกครึ่งเป็นกอล์ฟบนซิมูเลเตอร์ ทั้งการพัตต์ การชิพ ฟูลสวิง กติกา และการนับสกอร์',
      },
    ],
  },
  progress: {
    title: 'พัฒนาการของลูก',
    titleSuffix: 'ที่เห็นได้จริง',
    intro: 'คุณพ่อคุณแม่จะเห็นพัฒนาการของลูกในสองช่วง',
    steps: [
      {
        label: 'ครั้งที่ 1-5',
        title: 'Level 1',
        body: 'ประเมินทักษะในครั้งที่ 5 แล้วรับใบประกาศ Level 1',
      },
      {
        label: 'ครั้งที่ 6-10',
        title: 'Level 2 และจบหลักสูตร',
        body: 'ประเมินอีกครั้งในครั้งที่ 10 รับใบประกาศ Level 2 และจบหลักสูตร',
      },
    ],
  },
  video: {
    title: 'ชมวิดีโอ',
    titleSuffix: 'Junior Academy',
    intro: 'วิดีโอสั้น 25 วินาทีแนะนำคอร์ส เสียงบรรยายเป็นภาษาไทย อ่านคำบรรยายทั้งหมดได้ด้านล่าง',
    label: 'วิดีโอ LENGOLF Junior Academy ความยาว 25 วินาที บรรยายภาษาไทย',
    fallback: 'เบราว์เซอร์ของคุณเล่นวิดีโอนี้ไม่ได้ อ่านคำบรรยายทั้งหมดได้ด้านล่าง',
    transcriptTitle: 'คำบรรยายในวิดีโอ',
    transcript: [
      'วงสวิงแรกของลูก เริ่มต้นด้วยความสนุก',
      'ที่ LENGOLF Junior Academy เราทำให้กอล์ฟสนุกโดนใจ น้อง ๆ วัย 4 ถึง 12 ปี',
      'สอนโดยโค้ช PGA จาก LENGOLF ให้คุณพ่อคุณแม่อุ่นใจ',
      'ที่ Mercury Ville BTS ชิดลม ห้องซิมกอล์ฟในร่ม',
      'บนจอ: Junior Academy 16,900 บาท เรียน 10 ครั้ง ใช้ได้ 1 ปี',
      'สอบถามทีมงานเรื่อง Junior Academy ได้เลย ที่ LINE @lengolf',
    ],
    name: 'LENGOLF Junior Academy: คอร์สเรียนกอล์ฟเด็กในกรุงเทพฯ',
    description:
      'วิดีโอแนะนำ LENGOLF Junior Academy ความยาว 25 วินาที คอร์สเรียนกอล์ฟสำหรับเด็กอายุ 4-12 ปี สอนโดยโค้ช PGA จาก LENGOLF ที่กอล์ฟซิมูเลเตอร์ในร่ม The Mercury Ville @ BTS ชิดลม ราคา 16,900 บาท เรียน 10 ครั้ง ใช้ได้ 1 ปี บรรยายภาษาไทย',
  },
  safety: {
    title: 'ความปลอดภัย',
    titleSuffix: 'ในเบย์',
    items: [
      { title: 'ตีทีละคน', body: 'ในเบย์จะสวิงหรือตีได้ทีละคนเท่านั้น ทั้งตอนเรียนและตอนซ้อมกับครอบครัว' },
      // "ลูกนิ่ม" alone can read as "soft child" (ลูก = your child on this page).
      { title: 'ลูกกอล์ฟนิ่มสำหรับมือใหม่', body: 'เด็กที่เพิ่งเริ่มเรียนจะตีลูกกอล์ฟนิ่มแทนลูกกอล์ฟปกติ' },
      {
        title: 'ผู้ปกครองดูแลช่วงซ้อม',
        body: 'ระหว่างเวลาซ้อมสำหรับครอบครัว 5 ชั่วโมง ผู้ปกครองต้องอยู่ดูแลลูกในเบย์',
      },
    ],
  },
  price: {
    title: 'แพ็กเกจเดียว ราคาเดียว',
    amount: '16,900 บาท',
    items: [
      'เรียนตัวต่อตัว 10 ครั้ง ครั้งละ 60 นาที',
      'เวลาซ้อมสำหรับครอบครัว 5 ชั่วโมง',
      'มีไม้กอล์ฟจูเนียร์ให้ใช้ เลือกขนาดตามส่วนสูง',
      'ประเมินทักษะในครั้งที่ 5 และครั้งที่ 10 รับใบประกาศ Level 1 และ Level 2 และจบหลักสูตร',
    ],
    validity: 'แพ็กเกจใช้ได้ 1 ปี',
    asOf: '(ข้อมูล ณ ตุลาคม 2026)',
    cta: 'สอบถามทาง LINE @lengolf',
    note: 'นัดวันและเวลาเรียนกับทีมงานทาง LINE ได้เลย',
  },
  faq: {
    title: 'คำถามที่พบบ่อย',
    titleSuffix: 'Junior Academy',
    items: [
      {
        question: 'LENGOLF Junior Academy เหมาะกับเด็กอายุเท่าไร?',
        answer: 'เด็กอายุ 4-12 ปี ทุกครั้งเป็นการเรียนตัวต่อตัว เด็กหนึ่งคนกับโค้ช PGA หนึ่งคน',
      },
      {
        question: 'Junior Academy ราคาเท่าไร?',
        answer:
          'ราคา 16,900 บาทสำหรับทั้งคอร์ส ได้เรียนตัวต่อตัว 10 ครั้ง ครั้งละ 60 นาที เวลาซ้อมสำหรับครอบครัว 5 ชั่วโมง มีไม้กอล์ฟจูเนียร์ให้ใช้ ประเมินทักษะในครั้งที่ 5 และครั้งที่ 10 พร้อมรับใบประกาศ Level 1 และ Level 2 และจบหลักสูตร แพ็กเกจใช้ได้ 1 ปี',
      },
      {
        question: 'แต่ละครั้งเรียนอะไรบ้าง?',
        answer:
          'เรียนครั้งละ 60 นาที ครึ่งชั่วโมงเป็นกิจกรรมเคลื่อนไหวและเกม อีกครึ่งเป็นกอล์ฟ ทั้งการพัตต์ การชิพ ฟูลสวิง กติกา และการนับสกอร์',
      },
      {
        question: 'จะรู้ได้อย่างไรว่าลูกพัฒนาขึ้น?',
        answer:
          'โค้ชจะประเมินทักษะของลูกในครั้งที่ 5 และครั้งที่ 10 หลังครั้งที่ 5 ลูกจะได้รับใบประกาศ Level 1 และหลังครั้งที่ 10 จะได้รับใบประกาศ Level 2 พร้อมจบหลักสูตร',
      },
      {
        question: 'ลูกต้องมีไม้กอล์ฟของตัวเองไหม?',
        answer: 'ไม่ต้อง เรามีไม้กอล์ฟจูเนียร์ให้ และเลือกขนาดให้พอดีกับส่วนสูงของลูก',
      },
      {
        question: 'เวลาซ้อมสำหรับครอบครัวคืออะไร?',
        answer:
          'แพ็กเกจมีเวลาซ้อมในเบย์กอล์ฟซิมูเลเตอร์ 5 ชั่วโมงสำหรับครอบครัว โดยผู้ปกครองต้องอยู่ดูแลลูกตลอดช่วงซ้อม นัดเวลาซ้อมกับทีมงานทาง LINE ได้เลย',
      },
      {
        question: 'ดูแลความปลอดภัยของเด็กในเบย์อย่างไร?',
        answer: 'ในเบย์จะสวิงหรือตีได้ทีละคน เด็กที่เพิ่งเริ่มเรียนจะใช้ลูกกอล์ฟนิ่ม และผู้ปกครองต้องอยู่ดูแลลูกระหว่างเวลาซ้อมสำหรับครอบครัว',
      },
      {
        question: 'เรียนวันและเวลาไหนได้บ้าง?',
        answer: 'นัดวันและเวลาเรียนกับทีมงานทาง LINE @lengolf ได้เลย แจ้งอายุของลูกและวันที่สะดวกมาได้เลย',
      },
      {
        question: 'ใครเป็นผู้สอน Junior Academy?',
        answer: 'สอนโดยโค้ช PGA จาก LENGOLF',
      },
      {
        question: 'LENGOLF Junior Academy อยู่ที่ไหน?',
        answer:
          'ที่ LENGOLF กอล์ฟซิมูเลเตอร์ในร่ม ชั้น 4 The Mercury Ville @ BTS ชิดลม กรุงเทพฯ มีสกายวอล์กเชื่อมจากสถานี BTS',
      },
      {
        question: 'สมัครได้อย่างไร?',
        answer: 'ส่งข้อความมาที่ LINE @lengolf แจ้งชื่อ อายุ และส่วนสูงของลูก ทีมงานจะตอบคำถามและนัดเรียนครั้งแรกให้',
      },
    ],
  },
  faqLinks: {
    'LINE @lengolf': { href: JUNIOR_ACADEMY_LINE_URL, external: true },
  },
  related: {
    title: 'อ่านเพิ่มเติม',
    links: [
      { label: 'เรียนกอล์ฟ', href: '/lessons' },
      { label: 'เด็กเล่นกอล์ฟซิมมูเลเตอร์ได้ไหม', href: '/faq/can-kids-play-golf-simulators' },
    ],
  },
  course: {
    name: 'LENGOLF Junior Academy',
    description:
      'คอร์สเรียนกอล์ฟสำหรับเด็กอายุ 4-12 ปี ที่ LENGOLF กรุงเทพฯ เรียนตัวต่อตัวกับโค้ช PGA จาก LENGOLF 10 ครั้ง ครั้งละ 60 นาที ทุกชั่วโมงแบ่งเป็นกิจกรรมเคลื่อนไหวและเกมครึ่งหนึ่ง และกอล์ฟอีกครึ่งหนึ่ง ประเมินทักษะในครั้งที่ 5 และครั้งที่ 10 รับใบประกาศ Level 1 และ Level 2 และจบหลักสูตร พร้อมเวลาซ้อมสำหรับครอบครัว 5 ชั่วโมง และมีไม้กอล์ฟจูเนียร์ให้ใช้ เลือกขนาดตามส่วนสูง',
    credentials: 'ใบประกาศนียบัตร Level 1 และ Level 2',
  },
  lessonsCallout: {
    badge: 'อายุ 4-12 ปี',
    title: 'เรียนกอล์ฟสำหรับเด็ก: LENGOLF Junior Academy',
    body: 'เรียนตัวต่อตัว 10 ครั้ง ครั้งละ 60 นาที ประเมินทักษะในครั้งที่ 5 และครั้งที่ 10 รับใบประกาศ Level 1 และ Level 2 พร้อมเวลาซ้อมสำหรับครอบครัว 5 ชั่วโมง และมีไม้กอล์ฟจูเนียร์ให้ใช้ ราคา 16,900 บาท แพ็กเกจใช้ได้ 1 ปี',
    cta: 'ดูรายละเอียด Junior Academy',
    imageAlt: 'เด็กฝึกสวิงด้วยไม้กอล์ฟจูเนียร์บนกอล์ฟซิมูเลเตอร์ที่ LENGOLF',
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
