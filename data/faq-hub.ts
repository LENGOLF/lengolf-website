// Content for the /faq/ hub page (app/[locale]/faq/page.tsx) in EN, TH, JA,
// KO and ZH.
//
// WHY A DATA FILE (not messages/*.json): the [locale] layout statically builds
// every locale, so a messages-driven page translated to only en+th would emit
// MISSING_MESSAGE errors for ja/ko/zh during SSG. This module instead falls
// back to English for locales without content — those URLs are unreachable
// anyway (the middleware 301s unregistered locale routes to English; see
// lib/translated-routes.ts).
//
// The quick-answer FAQs below are the plain-language answers Google's AI
// surfaces (AI Overviews, Gemini "Ask Maps") read now that GBP Q&A is gone —
// keep answers self-contained, number-rich, and in sync with data/pricing.ts.
//
// House style (PR #39/#61): no em dashes in the user-facing strings.

export interface FaqHubQa {
  question: string
  answer: string
}

export interface FaqHubDirections {
  title: string
  titleSuffix: string
  intro: string
  faqQuestion: string
  /** Full sentences — rendered as numbered steps AND joined into the FAQ answer. */
  steps: string[]
  grabTip: string
  parkingTip: string
  mapCta: string
}

export interface FaqHubBucket {
  label: string
  categories: string[]
  /** Pages whose category matches no bucket land in the catchAll bucket. */
  catchAll?: boolean
}

export interface FaqHubContent {
  metaTitle: string
  metaDescription: string
  heroBadge: string
  heroTitle: string
  heroSubtitle: string
  /** Entity statement for AI grounding — keep the first sentence verbatim. */
  entityStatement: string
  stats: { stat: string; label: string }[]
  faqTitle: string
  faqTitleSuffix: string
  quickFaqs: FaqHubQa[]
  /** Phrases in quickFaqs answers rendered as links (see FaqSection). */
  faqLinks: Record<string, { href: string; external?: boolean }>
  directions: FaqHubDirections
  browseTitle: string
  browseTitleSuffix: string
  browseSubtitle: string
  browseBuckets: FaqHubBucket[]
  ctaTitle: string
  ctaSubtitle: string
}

const en: FaqHubContent = {
  metaTitle: 'FAQ: Prices, Booking & Directions',
  metaDescription:
    'Prices, booking, club rental, group events, and step-by-step directions from BTS Chidlom: quick answers about LENGOLF, the indoor golf simulator venue at The Mercury Ville, Bangkok.',
  heroBadge: 'Frequently Asked Questions',
  heroTitle: 'Everything You Need to Know',
  heroSubtitle:
    'Prices, booking, what to bring, and how to find us. The questions guests ask most, answered in one place.',
  entityStatement:
    'LENGOLF is an indoor golf simulator venue at The Mercury Ville @ BTS Chidlom, Bangkok, on the 4th floor at Unit 407, directly connected to the BTS station. We combine four Korean Bravo Golf simulator bays with a full bar and kitchen, free club rental, and Thailand PGA-certified coaching, open 9am to 11pm every day of the week.',
  stats: [
    { stat: '550 THB', label: 'per bay-hour, from' },
    { stat: '5 players', label: 'share one bay' },
    { stat: '9am–11pm', label: 'open every day' },
    { stat: 'Unit 407', label: '4th floor, Mercury Ville' },
  ],
  faqTitle: 'Quick',
  faqTitleSuffix: 'Answers',
  quickFaqs: [
    {
      question: 'How much does a golf simulator bay cost at LENGOLF?',
      answer:
        'Bay rental is 550–950 THB per hour for the whole bay (not per person), and up to 5 players can share one bay. Weekdays (Mon–Thu) are 550 THB/hour before 2pm and 750 THB/hour after 2pm; Fridays, weekends, and public holidays are 750 THB/hour before 2pm and 950 THB/hour after 2pm. Free standard golf clubs are always included. See the bay rates page for details and monthly packages.',
    },
    {
      question: 'How much do golf lessons cost?',
      answer:
        'Private lessons with our Thailand PGA-certified coaches start at 1,800 THB per hour, with simulator time and clubs included. Multi-hour packages lower the rate (for example 10 hours for 16,000 THB), and new students can book a free trial lesson. See the lessons page or message us on LINE @lengolf.',
    },
    {
      question: 'Do I need to bring my own golf clubs or equipment?',
      answer:
        'No. Free standard club sets for men and ladies are included with every bay booking, so most guests arrive empty-handed. If you want better equipment, premium Callaway and Majesty sets rent from 150 THB per hour; see the golf club rental page.',
    },
    {
      question: 'What should I wear? Do I need golf shoes or a glove?',
      answer:
        "Wear anything comfortable you can swing in: a t-shirt, jeans, and sneakers are perfectly fine. There is no dress code, and you don't need golf shoes or a glove. Golf gloves are available to buy on-site if you'd like one.",
    },
    {
      question: 'Can I walk in, or do I need to book?',
      answer:
        'Walk-ins are welcome whenever a bay is free. Evenings and weekends often sell out, though, so booking ahead at booking.len.golf or on LINE @lengolf is the safest way to guarantee your bay. It takes under a minute.',
    },
    {
      question: "What are LENGOLF's opening hours?",
      answer:
        'We are open 9am to 11pm every day of the week, including weekends and public holidays; there is no weekly closing day. Evenings after 5pm are the busiest, so book ahead for those slots.',
    },
    {
      question: 'How many people can play together? Do you host parties and corporate events?',
      answer:
        'Up to 5 players share one bay at no extra per-person cost, and we have 4 bays in total. For bigger occasions the whole venue hosts private and corporate events for 50+ guests (tournaments, team building, birthdays) with food and drink packages. See the events page for details.',
    },
    {
      question: 'Do you serve food and drinks?',
      answer:
        'Yes. LENGOLF has a full bar with cocktails, beer, and wine, plus a food menu with Smith & Co burgers, pizza, and snacks, all served directly to your bay while you play. See the menu page for dishes and prices.',
    },
    {
      question: 'Are lessons available in English or Thai?',
      answer:
        'Both. Our Thailand PGA-certified coaches teach in English and Thai, including PRO Boss, who studied and competed in the United States. Just tell us your preferred language when you book and we will match you with the right coach.',
    },
    // The directions question is appended at render time from directions.steps
    // (single source for the visible step list and the FAQ/JSON-LD answer).
    {
      question: 'Is there parking at LENGOLF?',
      answer:
        'Yes. Park at The Mercury Ville and you get 3 hours of free parking. The car park entrance is off Ploenchit Road; take the lift or escalators up to the 4th floor and look for Unit 407.',
    },
    {
      question: 'Do I need golf experience to play?',
      answer:
        'Not at all. Around half of our guests are complete beginners. The simulator tracks every shot automatically and our staff will have you hitting balls within a couple of minutes. If you would like structured help, book a free trial lesson with one of our coaches.',
    },
  ],
  faqLinks: {
    'bay rates page': { href: '/golf' },
    'lessons page': { href: '/lessons' },
    'golf club rental page': { href: '/golf-club-rental' },
    'events page': { href: '/events' },
    'menu page': { href: '/menu' },
    'booking.len.golf': { href: 'https://booking.len.golf/', external: true },
    '@lengolf': { href: 'https://lin.ee/uxQpIXn', external: true },
  },
  directions: {
    title: 'How to',
    titleSuffix: 'Find Us',
    intro:
      'LENGOLF is inside The Mercury Ville, the mall attached to BTS Chidlom, about 3 minutes from the train platform and entirely under cover.',
    faqQuestion: 'How do I get to LENGOLF from BTS Chidlom?',
    steps: [
      'Ride the BTS to Chidlom station (Sukhumvit Line, one stop east of Siam).',
      'Follow the signs for Exit 4. The skywalk connects the station directly to The Mercury Ville, so you never need to cross the street.',
      'Enter The Mercury Ville and take the escalators or the lift to the 4th floor.',
      'LENGOLF is at Unit 407; look for the green LENGOLF sign. The walk from the platform takes about 3 minutes.',
    ],
    grabTip:
      'Coming by Grab or taxi? Tell the driver "The Mercury Ville, Chidlom" (เดอะ เมอร์คิวรี่ วิลล์ ชิดลม). The drop-off is on Ploenchit Road at the mall entrance.',
    parkingTip:
      'Driving? Park at The Mercury Ville (3 hours free) and take the lift straight up to the 4th floor.',
    mapCta: 'Open in Google Maps',
  },
  browseTitle: 'Browse All',
  browseTitleSuffix: 'Questions',
  browseSubtitle:
    'Deeper answers on renting clubs, learning golf, and planning a golf trip to Thailand.',
  browseBuckets: [
    { label: 'Playing at LENGOLF', categories: ['general', 'pricing', 'events'] },
    { label: 'Golf Club Rental', categories: ['rental', 'clubs-rental'] },
    { label: 'Lessons & Coaching', categories: ['lessons', 'golf-lessons'] },
    {
      label: 'Golf Travel in Thailand',
      categories: [
        'airlines-baggage',
        'packing-preparation',
        'visa-entry',
        'on-the-ground',
        'getting-around',
        'golf-courses',
        'tee-time-booking',
        'golf-in-thailand',
      ],
      catchAll: true,
    },
  ],
  ctaTitle: 'Still have a question?',
  ctaSubtitle:
    'Message us on LINE, give us a call, or just book a bay. We reply fast, in English and Thai.',
}

const th: FaqHubContent = {
  metaTitle: 'คำถามที่พบบ่อย: ราคา การจอง และวิธีเดินทาง',
  metaDescription:
    'รวมคำตอบเรื่องราคา การจอง เช่าไม้กอล์ฟ จัดปาร์ตี้ และวิธีเดินทางจาก BTS ชิดลมทีละขั้นตอน จาก LENGOLF สถานที่กอล์ฟซิมมูเลเตอร์ในร่มที่ The Mercury Ville ชั้น 4 กรุงเทพฯ',
  heroBadge: 'คำถามที่พบบ่อย',
  heroTitle: 'ทุกเรื่องที่อยากรู้ ก่อนมา LENGOLF',
  heroSubtitle:
    'ราคา การจอง ต้องเตรียมอะไรมาบ้าง และเดินทางมาอย่างไร รวมคำถามที่ลูกค้าถามบ่อยที่สุด พร้อมคำตอบครบในหน้าเดียว',
  entityStatement:
    'LENGOLF คือสถานที่กอล์ฟซิมมูเลเตอร์ในร่มที่ The Mercury Ville @ BTS ชิดลม กรุงเทพฯ ตั้งอยู่ที่ชั้น 4 ยูนิต 407 เชื่อมต่อกับสถานีรถไฟฟ้าโดยตรง ภายในมีเบย์ซิมมูเลเตอร์ Bravo Golf จากเกาหลี 4 เบย์ พร้อมบาร์และครัวเต็มรูปแบบ ไม้กอล์ฟให้ยืมฟรี และโค้ชมืออาชีพที่ได้รับการรับรองจาก Thailand PGA เปิดทุกวัน 9:00-23:00 น.',
  stats: [
    { stat: '550 บาท', label: 'ต่อชั่วโมง เริ่มต้น' },
    { stat: '5 คน', label: 'ต่อ 1 เบย์' },
    { stat: '9:00-23:00', label: 'เปิดทุกวัน' },
    { stat: 'ยูนิต 407', label: 'ชั้น 4 Mercury Ville' },
  ],
  faqTitle: 'คำตอบ',
  faqTitleSuffix: 'แบบรวดเร็ว',
  quickFaqs: [
    {
      question: 'ค่าเช่าเบย์กอล์ฟซิมมูเลเตอร์ที่ LENGOLF ราคาเท่าไหร่',
      answer:
        'ค่าเช่าเบย์อยู่ที่ 550-950 บาทต่อชั่วโมง คิดต่อเบย์ ไม่ใช่ต่อคน และเล่นร่วมกันได้สูงสุด 5 คนต่อเบย์ วันจันทร์-พฤหัสฯ ราคา 550 บาท/ชม. ก่อน 14:00 น. และ 750 บาท/ชม. หลัง 14:00 น. ส่วนวันศุกร์-อาทิตย์และวันหยุดนักขัตฤกษ์ ราคา 750 บาท/ชม. ก่อน 14:00 น. และ 950 บาท/ชม. หลัง 14:00 น. มีไม้กอล์ฟมาตรฐานให้ใช้ฟรีทุกการจอง ดูรายละเอียดและแพ็กเกจรายเดือนได้ที่หน้าอัตราค่าบริการเบย์',
    },
    {
      question: 'เรียนกอล์ฟที่ LENGOLF ราคาเท่าไหร่',
      answer:
        'คอร์สเรียนส่วนตัวกับโค้ชที่ได้รับการรับรองจาก Thailand PGA เริ่มต้นที่ 1,800 บาทต่อชั่วโมง รวมค่าเบย์ซิมมูเลเตอร์และไม้กอล์ฟแล้ว แพ็กเกจหลายชั่วโมงคุ้มกว่า เช่น 10 ชั่วโมง 16,000 บาท และนักเรียนใหม่จองทดลองเรียนฟรี 1 ชั่วโมงได้ ดูรายละเอียดที่หน้าคอร์สเรียนกอล์ฟ หรือทักไลน์ @lengolf',
    },
    {
      question: 'ต้องนำไม้กอล์ฟหรืออุปกรณ์มาเองไหม',
      answer:
        'ไม่ต้องนำมาเอง ทุกการจองเบย์มีชุดไม้มาตรฐานทั้งของผู้ชายและผู้หญิงให้ใช้ฟรี ลูกค้าส่วนใหญ่มาตัวเปล่าได้เลย หากต้องการอุปกรณ์ที่ดีขึ้น มีชุดพรีเมียม Callaway และ Majesty ให้เช่าเริ่มต้น 150 บาทต่อชั่วโมง ดูรายละเอียดที่หน้าเช่าไม้กอล์ฟ',
    },
    {
      question: 'ต้องแต่งตัวอย่างไร ต้องมีรองเท้ากอล์ฟหรือถุงมือไหม',
      answer:
        'ใส่ชุดอะไรก็ได้ที่สบายและสวิงได้สะดวก เสื้อยืด กางเกงยีนส์ รองเท้าผ้าใบ ได้ทั้งหมด ไม่มีกฎการแต่งกาย ไม่ต้องใช้รองเท้ากอล์ฟหรือถุงมือ หากต้องการถุงมือ มีจำหน่ายที่ร้าน',
    },
    {
      question: 'เดินเข้ามาเล่นเลยได้ไหม หรือต้องจองล่วงหน้า',
      answer:
        'Walk-in ได้เสมอเมื่อมีเบย์ว่าง แต่ช่วงเย็นและวันหยุดสุดสัปดาห์มักเต็ม การจองล่วงหน้าที่ booking.len.golf หรือทางไลน์ @lengolf จึงเป็นวิธีที่ชัวร์ที่สุด ใช้เวลาจองไม่ถึงนาที',
    },
    {
      question: 'LENGOLF เปิดกี่โมง',
      answer:
        'เปิดทุกวัน 9:00-23:00 น. รวมวันหยุดสุดสัปดาห์และวันหยุดนักขัตฤกษ์ ไม่มีวันหยุดประจำสัปดาห์ ช่วงหลัง 17:00 น. คนเยอะที่สุด แนะนำให้จองล่วงหน้า',
    },
    {
      question: 'มากันหลายคนได้ไหม รับจัดปาร์ตี้หรืออีเวนต์บริษัทหรือเปล่า',
      answer:
        'เล่นร่วมกันได้สูงสุด 5 คนต่อเบย์โดยไม่มีค่าใช้จ่ายเพิ่มต่อคน และเรามีทั้งหมด 4 เบย์ สำหรับงานใหญ่ เรารับจัดอีเวนต์ส่วนตัวและงานบริษัทรองรับ 50+ คน ทั้งทัวร์นาเมนต์ ทีมบิลดิ้ง วันเกิด พร้อมแพ็กเกจอาหารและเครื่องดื่ม ดูรายละเอียดที่หน้าอีเวนต์',
    },
    {
      question: 'มีอาหารและเครื่องดื่มไหม',
      answer:
        'มีครบ LENGOLF มีบาร์เต็มรูปแบบทั้งค็อกเทล เบียร์ ไวน์ พร้อมเมนูอาหารอย่างเบอร์เกอร์ Smith & Co พิซซ่า และของทานเล่น เสิร์ฟถึงเบย์ระหว่างเล่นได้เลย ดูเมนูและราคาที่หน้าเมนูอาหาร',
    },
    {
      question: 'มีสอนกอล์ฟเป็นภาษาอังกฤษหรือภาษาไทยไหม',
      answer:
        'มีทั้งสองภาษา โค้ชของเราทุกคนได้รับการรับรองจาก Thailand PGA สอนได้ทั้งภาษาไทยและภาษาอังกฤษ รวมถึงโปรบอส (PRO Boss) ที่เคยเรียนและแข่งขันที่สหรัฐอเมริกา แจ้งภาษาที่สะดวกตอนจองได้เลย เราจะจัดโค้ชที่เหมาะสมให้',
    },
    {
      question: 'ที่ LENGOLF มีที่จอดรถไหม',
      answer:
        'มี จอดรถที่ The Mercury Ville ได้ฟรี 3 ชั่วโมง ทางเข้าลานจอดรถอยู่ฝั่งถนนเพลินจิต จากนั้นขึ้นลิฟต์หรือบันไดเลื่อนมาที่ชั้น 4 มองหายูนิต 407',
    },
    {
      question: 'ไม่เคยเล่นกอล์ฟมาก่อน เล่นได้ไหม',
      answer:
        'เล่นได้แน่นอน ลูกค้าประมาณครึ่งหนึ่งของเราเป็นมือใหม่ที่ไม่เคยจับไม้กอล์ฟมาก่อน ระบบซิมมูเลเตอร์บันทึกทุกช็อตให้อัตโนมัติ และทีมงานจะช่วยให้เริ่มตีได้ภายในไม่กี่นาที หากอยากเรียนแบบจริงจัง จองทดลองเรียนฟรีกับโค้ชของเราได้',
    },
  ],
  faqLinks: {
    'หน้าอัตราค่าบริการเบย์': { href: '/golf' },
    'หน้าคอร์สเรียนกอล์ฟ': { href: '/lessons' },
    'หน้าเช่าไม้กอล์ฟ': { href: '/golf-club-rental' },
    'หน้าอีเวนต์': { href: '/events' },
    'หน้าเมนูอาหาร': { href: '/menu' },
    'booking.len.golf': { href: 'https://booking.len.golf/', external: true },
    '@lengolf': { href: 'https://lin.ee/uxQpIXn', external: true },
  },
  directions: {
    title: 'วิธีเดินทาง',
    titleSuffix: 'มาหาเรา',
    intro:
      'LENGOLF อยู่ใน The Mercury Ville ห้างที่เชื่อมต่อกับ BTS ชิดลมโดยตรง เดินจากชานชาลาประมาณ 3 นาที มีหลังคาตลอดทาง',
    faqQuestion: 'เดินทางมา LENGOLF จาก BTS ชิดลมอย่างไร',
    steps: [
      'นั่ง BTS สายสุขุมวิทมาลงสถานีชิดลม (ถัดจากสยาม 1 สถานี)',
      'เดินตามป้ายทางออก 4 สกายวอล์กเชื่อมจากสถานีเข้าสู่ The Mercury Ville โดยตรง ไม่ต้องข้ามถนน',
      'เข้าห้าง The Mercury Ville แล้วขึ้นบันไดเลื่อนหรือลิฟต์มาที่ชั้น 4',
      'LENGOLF อยู่ที่ยูนิต 407 มองหาป้าย LENGOLF สีเขียว เดินจากชานชาลาประมาณ 3 นาที',
    ],
    grabTip:
      'หากมาด้วย Grab หรือแท็กซี่ บอกคนขับว่า "เดอะ เมอร์คิวรี่ วิลล์ ชิดลม" จุดจอดรับ-ส่งอยู่บนถนนเพลินจิตหน้าทางเข้าห้าง',
    parkingTip: 'หากขับรถมา จอดที่ The Mercury Ville ได้ฟรี 3 ชั่วโมง แล้วขึ้นลิฟต์มาที่ชั้น 4 ได้เลย',
    mapCta: 'เปิดใน Google Maps',
  },
  browseTitle: 'ดูคำถาม',
  browseTitleSuffix: 'ทั้งหมด',
  browseSubtitle: 'คำตอบเชิงลึกเรื่องการเช่าไม้กอล์ฟ การเรียนกอล์ฟ และการวางแผนทริปกอล์ฟในประเทศไทย',
  browseBuckets: [
    { label: 'เล่นกอล์ฟที่ LENGOLF', categories: ['general', 'pricing', 'events'] },
    { label: 'เช่าไม้กอล์ฟ', categories: ['rental', 'clubs-rental'] },
    { label: 'เรียนกอล์ฟ', categories: ['lessons', 'golf-lessons'] },
    {
      label: 'ทริปกอล์ฟในประเทศไทย',
      categories: [
        'airlines-baggage',
        'packing-preparation',
        'visa-entry',
        'on-the-ground',
        'getting-around',
        'golf-courses',
        'tee-time-booking',
        'golf-in-thailand',
      ],
      catchAll: true,
    },
  ],
  ctaTitle: 'ยังมีคำถามอื่นอีกไหม',
  ctaSubtitle: 'ทักไลน์ โทรหาเรา หรือจองเบย์ได้เลย เราตอบเร็วทั้งภาษาไทยและภาษาอังกฤษ',
}

// ja / ko / zh hub content — structural-parity batch (2026-08). The
// per-question FAQ pages were already translated in these locales; only the
// hub above them was still English. Registering "/faq" in each locale's
// staticRoutes (lib/translated-routes.ts) is what makes these reachable.
const ja: FaqHubContent = {
  metaTitle: 'よくあるご質問：料金・予約・アクセス',
  metaDescription:
    '料金、予約、クラブレンタル、グループイベント、BTSチットロム駅からの道順まで。バンコクのザ・マーキュリービルにあるインドアゴルフシミュレーター施設LENGOLFについて、よくいただくご質問にまとめてお答えします。',
  heroBadge: 'よくあるご質問',
  heroTitle: 'ご来店前に知っておきたいこと',
  heroSubtitle:
    '料金、予約、持ち物、アクセス。お客様からよくいただくご質問への回答を、このページにまとめました。',
  entityStatement:
    'LENGOLFは、バンコクのザ・マーキュリービル @ BTSチットロムの4階ユニット407にある、BTSの駅と直結したインドアゴルフシミュレーター施設です。韓国のBravo Golfシミュレーターベイ4ベイに、フルバーとキッチン、無料のクラブレンタル、タイPGA認定コーチによる指導を組み合わせ、毎日9:00〜23:00に営業しています。',
  stats: [
    { stat: '550THB〜', label: '1ベイ1時間あたり' },
    { stat: '5名', label: '1ベイで一緒にプレー' },
    { stat: '9:00〜23:00', label: '毎日営業' },
    { stat: 'ユニット407', label: 'ザ・マーキュリービル4階' },
  ],
  faqTitle: 'すぐわかる',
  faqTitleSuffix: '回答',
  quickFaqs: [
    {
      question: 'LENGOLFのゴルフシミュレーターベイの料金はいくらですか？',
      answer:
        'ベイのご利用料金は1時間550〜950THBです。お1人様ごとではなくベイ単位の料金で、1ベイ最大5名まで一緒にプレーできます。平日（月〜木）は14:00まで1時間550THB、14:00以降は1時間750THB。金曜・週末・祝日は14:00まで1時間750THB、14:00以降は1時間950THBとなります。標準のゴルフクラブは、どのご予約にも無料で付いています。詳しい料金と月額パッケージはベイ料金ページをご覧ください。',
    },
    {
      question: 'ゴルフレッスンの料金はいくらですか？',
      answer:
        'タイPGA認定コーチによるプライベートレッスンは1時間1,800THBから。シミュレーターのご利用時間とクラブ代も含まれています。複数時間のパッケージなら単価が下がり、たとえば10時間で16,000THB。初めての方は無料体験レッスンをご予約いただけます。詳しくはレッスンページをご覧いただくか、LINE @lengolfまでメッセージをお送りください。',
    },
    {
      question: 'ゴルフクラブや道具は持参する必要がありますか？',
      answer:
        'いいえ、必要ありません。ベイのご予約にはメンズ・レディースの標準クラブセットが無料で付くため、ほとんどのお客様が手ぶらでお越しになります。より良い道具をお使いになりたい方には、CallawayとMajesty（マジェスティ）のプレミアムセットを1時間150THBからご用意しています。詳しくはクラブレンタルページをご覧ください。',
    },
    {
      question: '服装はどうすればよいですか？ゴルフシューズやグローブは必要ですか？',
      answer:
        'スイングしやすい楽な服装であれば問題ありません。Tシャツにジーンズ、スニーカーでも十分です。ドレスコードはなく、ゴルフシューズやグローブも不要です。グローブをご希望の方には、店内で販売もしております。',
    },
    {
      question: '予約なしで行っても大丈夫ですか？それとも予約が必要ですか？',
      answer:
        'ベイに空きがあれば、ご予約なしのご来店も歓迎しています。ただし夕方以降と週末は満席になることが多いため、booking.len.golfまたはLINE @lengolfで事前にご予約いただくのが最も確実です。お手続きは1分もかかりません。',
    },
    {
      question: 'LENGOLFの営業時間を教えてください',
      answer:
        '毎日9:00〜23:00に営業しており、週末も祝日も休まず、定休日はありません。17:00以降の時間帯が最も混み合いますので、その時間をご希望の場合は事前のご予約をおすすめします。',
    },
    {
      question: '何名まで一緒にプレーできますか？パーティーや企業イベントにも対応していますか？',
      answer:
        '1ベイは最大5名まで、お1人様ごとの追加料金なしでご利用いただけます。ベイは全部で4ベイございます。より大人数の場合は、店内を貸し切って50名以上のプライベートイベントや企業イベント（トーナメント、チームビルディング、誕生日会）を開催でき、お食事とお飲み物のパッケージもご用意しています。詳しくはイベントページをご覧ください。',
    },
    {
      question: '食事や飲み物はありますか？',
      answer:
        'ございます。LENGOLFにはカクテル、ビール、ワインを揃えたフルバーがあり、Smith & Coのバーガーやピザ、軽食といったフードメニューもご用意しています。いずれもプレー中のベイまで直接お持ちします。料理と価格はメニューページでご確認ください。',
    },
    {
      question: 'レッスンは英語やタイ語で受けられますか？',
      answer:
        '英語とタイ語のどちらにも対応しています。タイPGA認定コーチが英語とタイ語で指導しており、アメリカで学び試合にも出場したPRO Bossも在籍しています。ご予約の際にご希望の言語をお知らせいただければ、適したコーチをご案内します。なお、LENGOLFには日本人コーチや日本語でのレッスンはありませんが、ご予約や事前のご相談はLINE @lengolfにて日本語で承っています。',
    },
    // The directions question is appended at render time from directions.steps
    // (single source for the visible step list and the FAQ/JSON-LD answer).
    {
      question: 'LENGOLFに駐車場はありますか？',
      answer:
        'ございます。ザ・マーキュリービルの駐車場をご利用いただくと、3時間まで無料です。駐車場の入口はプルンチット通り側にあります。エレベーターまたはエスカレーターで4階まで上がり、ユニット407をお探しください。',
    },
    {
      question: 'ゴルフの経験がなくてもプレーできますか？',
      answer:
        'まったく問題ありません。ご来店のお客様のおよそ半数は、ゴルフがまったくの初めてという方です。シミュレーターが1球ごとに自動で計測しますので、スタッフのご案内で数分後にはボールを打ち始められます。しっかり教わりたい方は、コーチによる無料体験レッスンをご予約ください。',
    },
  ],
  faqLinks: {
    'ベイ料金ページ': { href: '/golf' },
    'レッスンページ': { href: '/lessons' },
    'クラブレンタルページ': { href: '/golf-club-rental' },
    'イベントページ': { href: '/events' },
    'メニューページ': { href: '/menu' },
    'booking.len.golf': { href: 'https://booking.len.golf/', external: true },
    '@lengolf': { href: 'https://lin.ee/uxQpIXn', external: true },
  },
  directions: {
    title: 'アクセス',
    titleSuffix: '方法',
    intro:
      'LENGOLFは、BTSチットロム駅に直結する商業施設ザ・マーキュリービルの中にあります。駅のホームから約3分、全区間が屋根の下です。',
    faqQuestion: 'BTSチットロム駅からLENGOLFへはどう行けばよいですか？',
    steps: [
      'BTSスクンビット線でチットロム駅まで乗車します（サイアム駅から東へ1駅）。',
      '4番出口の案内表示に従って進みます。スカイウォークが駅とザ・マーキュリービルを直結しているため、道路を渡る必要はありません。',
      'ザ・マーキュリービルに入り、エスカレーターまたはエレベーターで4階へ上がります。',
      'LENGOLFはユニット407にあります。緑色のLENGOLFの看板が目印です。駅のホームからの所要時間は約3分です。',
    ],
    grabTip:
      'Grabやタクシーでお越しの場合は、ドライバーに「The Mercury Ville, Chidlom」（เดอะ เมอร์คิวรี่ วิลล์ ชิดลม）とお伝えください。乗降場所はプルンチット通り沿いの商業施設入口です。',
    parkingTip:
      'お車の場合は、ザ・マーキュリービルの駐車場（3時間無料）に停め、エレベーターでそのまま4階へお上がりください。',
    mapCta: 'Google Mapsで開く',
  },
  browseTitle: 'ご質問',
  browseTitleSuffix: '一覧',
  browseSubtitle:
    'クラブレンタル、ゴルフの始め方、タイでのゴルフ旅行の計画について、さらに詳しい回答をまとめています。',
  browseBuckets: [
    { label: 'LENGOLFでプレーする', categories: ['general', 'pricing', 'events'] },
    { label: 'ゴルフクラブレンタル', categories: ['rental', 'clubs-rental'] },
    { label: 'レッスンとコーチング', categories: ['lessons', 'golf-lessons'] },
    {
      label: 'タイでのゴルフ旅行',
      categories: [
        'airlines-baggage',
        'packing-preparation',
        'visa-entry',
        'on-the-ground',
        'getting-around',
        'golf-courses',
        'tee-time-booking',
        'golf-in-thailand',
      ],
      catchAll: true,
    },
  ],
  ctaTitle: 'ほかにご質問はありますか？',
  ctaSubtitle:
    'LINEでのメッセージ、お電話、ベイのご予約、どの方法でもお気軽にどうぞ。英語とタイ語ですぐにご返信し、LINE @lengolfでは日本語でのお問い合わせも承っています。',
}

const ko: FaqHubContent = {
  metaTitle: '자주 묻는 질문: 요금, 예약, 오시는 길',
  metaDescription:
    '요금, 예약, 클럽 대여, 단체 행사, 그리고 BTS 칫롬역에서 오시는 길까지. 방콕 The Mercury Ville의 실내 골프 시뮬레이터 LENGOLF에 대해 자주 묻는 질문을 한곳에 모았습니다.',
  heroBadge: '자주 묻는 질문',
  heroTitle: 'LENGOLF 방문 전 알아두면 좋은 것들',
  heroSubtitle:
    '요금, 예약, 무엇을 챙겨야 하는지, 그리고 찾아오는 방법까지. 손님들이 가장 많이 묻는 질문에 대한 답을 한곳에 모았어요.',
  entityStatement:
    'LENGOLF는 방콕 The Mercury Ville @ BTS Chidlom 4층 407호에 자리한 실내 골프 시뮬레이터 시설로, BTS 역과 바로 연결되어 있습니다. 한국 Bravo Golf 시뮬레이터 베이 4개와 풀 바, 주방을 갖추고 있으며, 클럽은 무료로 대여해 드리고 태국 PGA 공인 코치의 레슨도 운영합니다. 연중무휴 매일 9:00~23:00에 문을 엽니다.',
  stats: [
    { stat: '550바트', label: '베이 시간당 최저가' },
    { stat: '5명', label: '한 베이 최대 인원' },
    { stat: '9:00~23:00', label: '연중무휴 운영' },
    { stat: '407호', label: 'Mercury Ville 4층' },
  ],
  faqTitle: '빠른',
  faqTitleSuffix: '답변',
  quickFaqs: [
    {
      question: 'LENGOLF의 골프 시뮬레이터 베이 요금은 얼마인가요?',
      answer:
        '베이 이용료는 인원이 아니라 베이 기준으로 시간당 550~950바트이고, 한 베이에서 최대 5명까지 함께 플레이할 수 있어요. 평일(월~목)은 14:00 이전 시간당 550바트, 14:00 이후 시간당 750바트예요. 금요일과 주말, 공휴일은 14:00 이전 시간당 750바트, 14:00 이후 시간당 950바트고요. 기본 골프 클럽은 언제나 무료로 포함돼요. 자세한 요금과 월 패키지는 베이 요금 안내 페이지에서 확인하세요.',
    },
    {
      question: '골프 레슨 요금은 얼마인가요?',
      answer:
        '태국 PGA 공인 코치와 함께하는 1:1 레슨은 시간당 1,800바트부터이고, 시뮬레이터 이용과 클럽이 포함돼요. 여러 시간을 묶은 패키지는 시간당 요금이 낮아지고(예: 10시간 16,000바트), 처음 오시는 분은 무료 체험 레슨을 예약하실 수 있어요. 자세한 내용은 레슨 페이지를 보시거나 LINE @lengolf로 문의해 주세요.',
    },
    {
      question: '골프 클럽이나 장비를 직접 가져와야 하나요?',
      answer:
        '아니요. 베이를 예약하시면 남성용과 여성용 기본 클럽 세트가 무료로 포함되기 때문에, 대부분의 손님은 빈손으로 오세요. 더 좋은 장비를 원하신다면 프리미엄 Callaway와 Majesty 세트를 시간당 150바트부터 대여하실 수 있어요. 자세한 내용은 클럽 대여 페이지를 확인하세요.',
    },
    {
      question: '복장은 어떻게 해야 하나요? 골프화나 장갑이 필요한가요?',
      answer:
        '스윙하기 편한 옷이면 무엇이든 괜찮아요. 티셔츠에 청바지, 운동화도 전혀 문제없어요. 드레스 코드는 따로 없고, 골프화나 장갑도 필요하지 않아요. 장갑이 필요하시면 현장에서 구입하실 수 있어요.',
    },
    {
      question: '예약 없이 방문해도 되나요, 아니면 예약이 필요한가요?',
      answer:
        '베이가 비어 있으면 예약 없이 오셔도 언제든 환영해요. 다만 저녁 시간과 주말은 자리가 차는 경우가 많아서, booking.len.golf 또는 LINE @lengolf에서 미리 예약하시는 편이 가장 확실해요. 예약은 1분도 걸리지 않아요.',
    },
    {
      question: 'LENGOLF 영업시간은 어떻게 되나요?',
      answer:
        '주말과 공휴일을 포함해 매일 9:00~23:00에 문을 열고, 정기 휴무일은 없어요. 17:00 이후 저녁 시간대가 가장 붐비니 그 시간대는 미리 예약해 주세요.',
    },
    {
      question: '몇 명까지 함께 칠 수 있나요? 파티나 기업 행사도 진행하나요?',
      answer:
        '한 베이에서 최대 5명까지 1인 추가 요금 없이 함께 플레이할 수 있고, 베이는 모두 4개예요. 규모가 큰 행사라면 매장 전체를 대관해 50명 이상 규모의 프라이빗 행사와 기업 행사(토너먼트, 팀 빌딩, 생일 파티)를 음식과 음료 패키지와 함께 진행해 드려요. 자세한 내용은 이벤트 페이지에서 확인하세요.',
    },
    {
      question: '음식과 음료도 판매하나요?',
      answer:
        '네. LENGOLF에는 칵테일과 맥주, 와인을 갖춘 바가 있고, Smith & Co 버거와 피자, 간단한 안주까지 갖춘 음식 메뉴도 있어요. 플레이하시는 동안 베이로 바로 가져다드려요. 메뉴와 가격은 메뉴 페이지에서 보실 수 있어요.',
    },
    {
      question: '레슨은 영어나 태국어로 받을 수 있나요?',
      answer:
        '두 언어 모두 가능해요. 태국 PGA 공인 코치진이 영어와 태국어로 지도하며, 미국에서 공부하고 대회에 출전한 PRO Boss도 함께해요. 예약하실 때 편한 언어를 말씀해 주시면 알맞은 코치를 배정해 드려요. LENGOLF에 한국인 코치나 한국어 레슨은 없지만, 예약과 사전 상담은 LINE @lengolf에서 한국어로 도와드려요.',
    },
    // The directions question is appended at render time from directions.steps
    // (single source for the visible step list and the FAQ/JSON-LD answer).
    {
      question: 'LENGOLF에 주차장이 있나요?',
      answer:
        '네. The Mercury Ville에 주차하시면 3시간 무료 주차를 제공해요. 주차장 입구는 Ploenchit Road 쪽에 있고, 엘리베이터나 에스컬레이터로 4층까지 올라와 407호를 찾으시면 돼요.',
    },
    {
      question: '골프를 쳐 본 적이 없어도 괜찮나요?',
      answer:
        '전혀 문제없어요. 저희를 찾아 주시는 분의 절반 정도는 골프가 처음이세요. 시뮬레이터가 모든 샷을 자동으로 기록하고, 스태프가 몇 분 안에 공을 칠 수 있도록 도와드려요. 좀 더 체계적으로 배우고 싶으시다면 코치와 함께하는 무료 체험 레슨을 예약해 보세요.',
    },
  ],
  faqLinks: {
    '베이 요금 안내 페이지': { href: '/golf' },
    '레슨 페이지': { href: '/lessons' },
    '클럽 대여 페이지': { href: '/golf-club-rental' },
    '이벤트 페이지': { href: '/events' },
    '메뉴 페이지': { href: '/menu' },
    'booking.len.golf': { href: 'https://booking.len.golf/', external: true },
    '@lengolf': { href: 'https://lin.ee/uxQpIXn', external: true },
  },
  directions: {
    title: '오시는',
    titleSuffix: '길',
    intro:
      'LENGOLF는 BTS 칫롬역과 연결된 쇼핑몰 The Mercury Ville 안에 있어요. 승강장에서 약 3분 거리이고, 전 구간이 실내로 이어져요.',
    faqQuestion: 'BTS 칫롬역에서 LENGOLF까지 어떻게 가나요?',
    steps: [
      'BTS 수쿰윗 라인을 타고 칫롬역에서 내리세요. 시암역에서 동쪽으로 한 정거장이에요.',
      '4번 출구 표지판을 따라가세요. 스카이워크가 역과 The Mercury Ville을 바로 이어 주기 때문에 길을 건널 필요가 없어요.',
      'The Mercury Ville에 들어와 에스컬레이터나 엘리베이터로 4층까지 올라오세요.',
      'LENGOLF는 407호에 있어요. 초록색 LENGOLF 간판을 찾으시면 돼요. 승강장에서 걸어서 약 3분이면 도착해요.',
    ],
    grabTip:
      'Grab이나 택시로 오시나요? 기사님께 "The Mercury Ville, Chidlom"(เดอะ เมอร์คิวรี่ วิลล์ ชิดลม)이라고 말씀해 주세요. 하차 지점은 Ploenchit Road 쪽 쇼핑몰 입구예요.',
    parkingTip:
      '직접 운전해서 오시나요? The Mercury Ville에 주차하시고(3시간 무료) 엘리베이터로 바로 4층까지 올라오세요.',
    mapCta: 'Google 지도에서 열기',
  },
  browseTitle: '전체 질문',
  browseTitleSuffix: '둘러보기',
  browseSubtitle: '클럽 대여, 골프 배우기, 태국 골프 여행 계획에 대한 더 깊이 있는 답변이에요.',
  browseBuckets: [
    { label: 'LENGOLF에서 플레이하기', categories: ['general', 'pricing', 'events'] },
    { label: '골프 클럽 대여', categories: ['rental', 'clubs-rental'] },
    { label: '레슨과 코칭', categories: ['lessons', 'golf-lessons'] },
    {
      label: '태국 골프 여행',
      categories: [
        'airlines-baggage',
        'packing-preparation',
        'visa-entry',
        'on-the-ground',
        'getting-around',
        'golf-courses',
        'tee-time-booking',
        'golf-in-thailand',
      ],
      catchAll: true,
    },
  ],
  ctaTitle: '더 궁금한 점이 있으신가요?',
  ctaSubtitle:
    'LINE으로 메시지를 보내시거나, 전화 주시거나, 바로 베이를 예약하셔도 좋아요. 영어와 태국어로 빠르게 답해 드리고, LINE @lengolf에서는 한국어 문의도 도와드려요.',
}

const zh: FaqHubContent = {
  metaTitle: '常见问题：价格、预订与交通路线',
  metaDescription:
    '价格、预订、球杆租借、团体活动，以及从BTS Chidlom出发的分步路线：关于LENGOLF的快速解答。LENGOLF是位于曼谷The Mercury Ville的室内高尔夫模拟器场馆。',
  heroBadge: '常见问题',
  heroTitle: '你想知道的，都在这里',
  heroSubtitle:
    '价格、预订、需要带什么，以及怎么找到我们。把客人问得最多的问题，集中在一页回答清楚。',
  entityStatement:
    'LENGOLF是位于曼谷The Mercury Ville @ BTS Chidlom的室内高尔夫模拟器场馆，在4楼407号铺，与BTS车站直接相连。我们把4个韩国Bravo Golf模拟器球位与全套酒吧和厨房结合在一起，提供免费球杆租借和Thailand PGA认证的教练指导，每天9:00至23:00营业，全周无休。',
  stats: [
    { stat: '550泰铢', label: '每球位每小时起' },
    { stat: '5人', label: '共用一个球位' },
    { stat: '9:00–23:00', label: '每天营业' },
    { stat: '407号铺', label: '4楼 Mercury Ville' },
  ],
  faqTitle: '快速',
  faqTitleSuffix: '解答',
  quickFaqs: [
    {
      question: 'LENGOLF的高尔夫模拟器球位多少钱一小时？',
      answer:
        '球位租金为每小时550–950泰铢，按球位计费而不是按人计费，最多可5人共用一个球位。周一至周四14:00前每小时550泰铢，14:00后每小时750泰铢；周五、周末及公共假日14:00前每小时750泰铢，14:00后每小时950泰铢。每次预订都免费提供标准球杆。详情与月度套餐请见球位价格页面。',
    },
    {
      question: '高尔夫课程多少钱？',
      answer:
        '与我们Thailand PGA认证教练的一对一课程每小时1,800泰铢起，已包含模拟器使用时间和球杆。多小时套餐的单价更低，例如10小时16,000泰铢；新学员还可以预约一次免费试课。详情请见课程页面，或者通过LINE @lengolf联系我们。',
    },
    {
      question: '需要自己带球杆或装备吗？',
      answer:
        '不需要。每次预订球位都免费提供男士和女士的标准球杆套组，所以大多数客人都是空手前来。如果你想用更好的装备，Callaway和Majesty的高端套组每小时150泰铢起租；详情请见球杆租借页面。',
    },
    {
      question: '该穿什么？需要高尔夫球鞋或手套吗？',
      answer:
        '穿任何舒适、方便挥杆的衣服就好：T恤、牛仔裤配运动鞋完全没问题。这里没有着装要求，也不需要高尔夫球鞋或手套。如果你想要一副手套，店内有售。',
    },
    {
      question: '可以直接到店，还是需要提前预订？',
      answer:
        '只要有空的球位，随时欢迎直接到店。不过晚上和周末经常订满，所以通过booking.len.golf或LINE @lengolf提前预订，是确保有球位最稳妥的方式。整个过程用不了一分钟。',
    },
    {
      question: 'LENGOLF的营业时间是几点到几点？',
      answer:
        '我们每天9:00至23:00营业，周末和公共假日照常开门，没有固定的休息日。17:00之后是最忙的时段，这些时间建议提前预订。',
    },
    {
      question: '一次可以几个人一起打？可以办派对或企业活动吗？',
      answer:
        '最多5人共用一个球位，不额外收取人头费，我们一共有4个球位。规模更大的场合可以整场包下，承接50人以上的私人和企业活动，包括比赛、团队建设和生日会，并配有餐饮套餐。详情请见活动页面。',
    },
    {
      question: '有餐食和饮品吗？',
      answer:
        '有。LENGOLF设有全套酒吧，提供鸡尾酒、啤酒和葡萄酒，还有包含Smith & Co汉堡、披萨和小食的餐单，都可以在你打球时直接送到球位。菜品与价格请见菜单页面。',
    },
    {
      question: '课程有英语或泰语教学吗？',
      answer:
        '两种都有。我们的Thailand PGA认证教练用英语和泰语授课，其中包括曾在美国求学并参赛的PRO Boss。预订时告诉我们你方便的语言，我们就会安排合适的教练。LENGOLF没有中文教练或中文课程，不过预订和事先咨询可以通过LINE @lengolf用中文沟通。',
    },
    // The directions question is appended at render time from directions.steps
    // (single source for the visible step list and the FAQ/JSON-LD answer).
    {
      question: 'LENGOLF有停车位吗？',
      answer:
        '有。在The Mercury Ville停车可享3小时免费停车。停车场入口在Ploenchit路一侧；停好车后搭电梯或扶梯上到4楼，找407号铺即可。',
    },
    {
      question: '完全没打过高尔夫也能来吗？',
      answer:
        '完全可以。我们大约一半的客人都是零基础的新手。模拟器会自动记录每一杆，工作人员几分钟内就能让你开始击球。如果想要更系统的指导，可以预约与教练的一次免费试课。',
    },
  ],
  faqLinks: {
    '球位价格页面': { href: '/golf' },
    '课程页面': { href: '/lessons' },
    '球杆租借页面': { href: '/golf-club-rental' },
    '活动页面': { href: '/events' },
    '菜单页面': { href: '/menu' },
    'booking.len.golf': { href: 'https://booking.len.golf/', external: true },
    '@lengolf': { href: 'https://lin.ee/uxQpIXn', external: true },
  },
  directions: {
    title: '交通',
    titleSuffix: '路线',
    intro:
      'LENGOLF位于The Mercury Ville商场内，商场与BTS Chidlom站直接相连，从站台步行约3分钟即到，全程都在室内。',
    faqQuestion: '从BTS Chidlom站怎么去LENGOLF？',
    steps: [
      '乘BTS到Chidlom站（Sukhumvit线，Siam站往东一站）。',
      '跟着4号出口（Exit 4）的指示牌走。空中连廊把车站与The Mercury Ville直接连通，全程不用过马路。',
      '进入The Mercury Ville后，搭乘扶梯或电梯上到4楼。',
      'LENGOLF在407号铺，认准绿色的LENGOLF招牌。从站台走过来大约3分钟。',
    ],
    grabTip:
      '坐Grab或出租车过来？告诉司机“The Mercury Ville, Chidlom”（เดอะ เมอร์คิวรี่ วิลล์ ชิดลม）。下车点在Ploenchit路的商场入口处。',
    parkingTip:
      '自己开车？在The Mercury Ville停车可免费3小时，搭电梯直接上到4楼。',
    mapCta: '在Google地图中打开',
  },
  browseTitle: '浏览全部',
  browseTitleSuffix: '问题',
  browseSubtitle: '关于租借球杆、学打高尔夫，以及规划泰国高尔夫之旅的深入解答。',
  browseBuckets: [
    { label: '在LENGOLF打球', categories: ['general', 'pricing', 'events'] },
    { label: '球杆租借', categories: ['rental', 'clubs-rental'] },
    { label: '课程与教学', categories: ['lessons', 'golf-lessons'] },
    {
      label: '泰国高尔夫之旅',
      categories: [
        'airlines-baggage',
        'packing-preparation',
        'visa-entry',
        'on-the-ground',
        'getting-around',
        'golf-courses',
        'tee-time-booking',
        'golf-in-thailand',
      ],
      catchAll: true,
    },
  ],
  ctaTitle: '还有其他问题吗？',
  ctaSubtitle:
    '可以在LINE上联系我们、给我们打电话，或者直接订一个球位。我们回复很快，支持英语和泰语，LINE上也可以用中文咨询。',
}

const CONTENT: Record<string, FaqHubContent> = { en, th, ja, ko, zh }

/**
 * Content for `locale`, falling back to English.
 *
 * As of the structural-parity batch (2026-08) all five locales have a content
 * block and "/faq" is registered in every locale's staticRoutes, so the English
 * fallback is now unreachable for en/th/ja/ko/zh — it only guards a locale
 * added to next-intl before its content block lands here. (This comment
 * previously said the fallback rendered for ja/ko/zh because they were
 * unregistered; that stopped being true when this batch registered them.)
 *
 * To launch the hub in another locale: add its content block to CONTENT above
 * AND register "/faq" in that locale's staticRoutes (lib/translated-routes.ts)
 * — the registry, not this file, drives hreflang and the middleware. Shipping
 * only half of that pair is the failure this note exists to prevent: content
 * without registration 301s away unseen, registration without content silently
 * serves English under a locale URL.
 */
export function getFaqHubContent(locale: string): FaqHubContent {
  return CONTENT[locale] ?? CONTENT.en
}
