import type { PriceGuideSeoPage } from '@/types/seo-pages'
import { getPricingCatalog, formatThb, findPrice, type PricingCatalog } from '@/lib/pricing'
import {
  getBayRatesData,
  getMonthlyPackagesData,
  getLessonPricingData,
  getEventPackagesData,
} from '@/data/pricing'

const now = new Date().toISOString()

// ── Dynamic price tokens ──
// Flat map of the key price strings used across all price guide pages.
// Consumed by page components to replace hardcoded values in structured fields.

export interface PriceGuideTokens {
  // Bay rates
  bayMorningWD: string   // weekday before 14:00
  bayMorningWE: string   // weekend before 14:00
  bayAfternoonWD: string // weekday 14:00–23:00
  bayAfternoonWE: string // weekend 14:00–23:00
  // Per-person at morning weekday rate, group of 5
  bayPerPersonGroup5: string
  // Monthly packages
  pkgBronze: string
  pkgSilver: string
  pkgGold: string
  pkgDiamond: string
  pkgDiamondPlus: string
  pkgEarlyBird: string
  pkgEarlyBirdPlus: string
  // Lessons (1 golfer)
  lesson1hr: string
  lesson5hr: string
  lesson10hr: string
  lessonStarter: string
  lessonSimToFairway: string
  // Event packages
  eventSmall: string
  eventMedium: string
  // Derived per-person event costs
  eventSmallPerPerson15: string  // small / 15 guests
  eventMediumPerPerson25: string // medium / 25 guests
}

// Hardcoded fallback values (mirrors data/pricing.ts static arrays)
const FALLBACK: PriceGuideTokens = {
  bayMorningWD: '550 THB/hr',
  bayMorningWE: '750 THB/hr',
  bayAfternoonWD: '750 THB/hr',
  bayAfternoonWE: '950 THB/hr',
  bayPerPersonGroup5: '100 THB',
  pkgBronze: '3,000 THB',
  pkgSilver: '8,000 THB',
  pkgGold: '14,000 THB',
  pkgDiamond: '8,000 THB',
  pkgDiamondPlus: '18,000 THB',
  pkgEarlyBird: '4,800 THB',
  pkgEarlyBirdPlus: '5,000 THB',
  lesson1hr: '1,800 THB',
  lesson5hr: '8,500 THB',
  lesson10hr: '16,000 THB',
  lessonStarter: '11,000 THB',
  lessonSimToFairway: '13,499 THB',
  eventSmall: '9,999 THB',
  eventMedium: '21,999 THB',
  eventSmallPerPerson15: '~667 THB',
  eventMediumPerPerson25: '~880 THB',
}

export async function getPriceGuideTokens(catalog?: PricingCatalog | null): Promise<PriceGuideTokens> {
  catalog = catalog ?? await getPricingCatalog()
  if (!catalog) return FALLBACK

  const [{ bayRates }, { monthlyPackages }, { lessonPricing }, { eventPackages }] = await Promise.all([
    getBayRatesData(catalog),
    getMonthlyPackagesData(catalog),
    getLessonPricingData(catalog),
    getEventPackagesData(catalog),
  ])

  const findPkg = (name: string) => monthlyPackages.find(p => p.name === name)?.price ?? FALLBACK[name as keyof PriceGuideTokens] as string
  const findLesson = (name: string) => lessonPricing.find(p => p.name === name)?.oneGolfer ?? FALLBACK[name as keyof PriceGuideTokens] as string
  const findEvent = (name: string) => eventPackages.find(p => p.name === name)?.price ?? FALLBACK[name as keyof PriceGuideTokens] as string

  const morningWDPrice = bayRates[0]?.weekday ?? FALLBACK.bayMorningWD
  const morningWDNum = parseInt(morningWDPrice.replace(/[^0-9]/g, ''), 10)
  const perPerson = isNaN(morningWDNum) ? FALLBACK.bayPerPersonGroup5 : `${formatThb(Math.round(morningWDNum / 5))}`

  const eventSmallPrice = findEvent('Small Package')
  const eventMediumPrice = findEvent('Medium Package')
  const eventSmallNum = parseInt(eventSmallPrice.replace(/[^0-9]/g, ''), 10)
  const eventMediumNum = parseInt(eventMediumPrice.replace(/[^0-9]/g, ''), 10)
  const eventSmallPP = isNaN(eventSmallNum) ? FALLBACK.eventSmallPerPerson15 : `~${formatThb(Math.round(eventSmallNum / 15))}`
  const eventMediumPP = isNaN(eventMediumNum) ? FALLBACK.eventMediumPerPerson25 : `~${formatThb(Math.round(eventMediumNum / 25))}`

  return {
    bayMorningWD: bayRates[0]?.weekday ? `${bayRates[0].weekday}/hr` : FALLBACK.bayMorningWD,
    bayMorningWE: bayRates[0]?.weekend ? `${bayRates[0].weekend}/hr` : FALLBACK.bayMorningWE,
    bayAfternoonWD: bayRates[1]?.weekday ? `${bayRates[1].weekday}/hr` : FALLBACK.bayAfternoonWD,
    bayAfternoonWE: bayRates[1]?.weekend ? `${bayRates[1].weekend}/hr` : FALLBACK.bayAfternoonWE,
    bayPerPersonGroup5: perPerson,
    pkgBronze: findPkg('Bronze'),
    pkgSilver: findPkg('Silver'),
    pkgGold: findPkg('Gold'),
    pkgDiamond: findPkg('Diamond'),
    pkgDiamondPlus: findPkg('Diamond+'),
    pkgEarlyBird: findPkg('Early Bird*'),
    pkgEarlyBirdPlus: findPkg('Early Bird+*'),
    lesson1hr: findLesson('1 Hour'),
    lesson5hr: findLesson('5 Hour'),
    lesson10hr: findLesson('10 Hour'),
    lessonStarter: findLesson('Starter Package*'),
    lessonSimToFairway: findLesson('Sim to Fairway*'),
    eventSmall: eventSmallPrice,
    eventMedium: eventMediumPrice,
    eventSmallPerPerson15: eventSmallPP,
    eventMediumPerPerson25: eventMediumPP,
  }
}

// Curated Google Reviews about value (all 5-star, English)
const VALUE_REVIEWS = {
  nathan_marina: {
    reviewer_name: 'Suuaap',
    text: 'It was our first time holding a golf club and Nate took his time to teach us the basics and more. Price was totally worth it and fair. We know we\'ll come back!',
  },
  chidbhan: {
    reviewer_name: 'Chidbhan T.',
    text: 'Lengolf is a hidden gem right in the heart of Bangkok — super convenient location! The simulator is modern, high-quality, and incredibly accurate. Prices are very reasonable for the top-notch experience you get.',
  },
  b_screen_golf: {
    reviewer_name: 'B',
    text: 'Happy to have found a great screen golf spot in BKK! The staff were super kind and spoke good English. The machines are new, and the rates are really reasonable especially if you go for the unlimited morning plan.',
  },
  jack: {
    reviewer_name: 'Jack S.',
    text: 'Me and 2 friends came here for some golf after not playing for a while. The technology was fantastic and the staff were very helpful and friendly. For a very reasonable price I would definitely recommend!',
  },
  ray: {
    reviewer_name: 'Ray S.',
    text: 'Had a lesson with Pro Min and he was very kind and helpful. Left me with a few tips to work on at the range. The facility is very nice and they\'re very friendly. Prices are very affordable compared to other similar places in the area.',
  },
  fritz: {
    reviewer_name: 'Fritz P.',
    text: 'So much fun!! Great price, great service, amazing experience.',
  },
  tttnatorn: {
    reviewer_name: 'tttnatorn',
    text: 'Great spot for a golf sim! Accurate tracking, good vibes, and helpful staff. Fair prices too. Perfect for practice or a fun round.',
  },
}

// Shared venue comparison data
// All competitor rates re-verified 2026-07-26 against each venue's own
// published rate card + Google Maps open status. RAK Screen Golf (Asoke)
// is deliberately not included: Google Maps marks it permanently closed.
const SIMULATOR_VENUES = {
  lengolf: {
    name: 'LENGOLF',
    location: 'Mercury Ville, BTS Chidlom',
    tech: 'Bravo',
    players_per_bay: 5,
    cheapest_rate: '550 THB/hr',
    peak_rate: '950 THB/hr',
    price_includes_tax: true,
    notes: 'Free standard club rental included. Open daily 9:00–23:00.',
  },
  front9: {
    name: 'Front 9',
    location: 'Sukhumvit 47 (Rainhill)',
    tech: 'Trackman',
    players_per_bay: 4,
    cheapest_rate: '600 THB/hr',
    peak_rate: '900 THB/hr (promo)',
    price_includes_tax: true,
    notes: '+200 THB/hr for private bay. +100 THB/hr per person from 5th player. Open 10:00–22:00 (from 9:00 weekends).',
  },
  fairway: {
    name: 'Fairway Golf & City Club',
    location: 'Sukhumvit 24, BTS Phrom Phong',
    tech: 'Trackman',
    players_per_bay: 8,
    cheapest_rate: '1,000 THB/hr',
    peak_rate: '1,200 THB/hr',
    price_includes_tax: false,
    notes: 'Flat rates: 1,000 THB/hr Mon–Thu, 1,200 THB/hr Fri–Sun & holidays. Excludes VAT. Open 8:00–02:00.',
  },
  grooveGrit: {
    name: 'Groove & Grit',
    location: 'Supalai Icon Sathorn, MRT Lumphini',
    tech: 'Foresight Falcon',
    players_per_bay: null,
    cheapest_rate: '~1,000 THB/hr',
    peak_rate: 'Not published',
    price_includes_tax: null,
    notes: 'New golf-and-bar venue in Sathorn. Off-peak morning slots around 1,000 THB/hr via booking apps; full rate card not published. Open 7:00–22:00.',
  },
  golfzonBangna: {
    name: 'Golfzon Bangna',
    location: 'Bangna-Trad Soi 23 (car access)',
    tech: 'Golfzon TwoVision',
    players_per_bay: 4,
    cheapest_rate: '400 THB/hr',
    peak_rate: '600 THB/hr',
    price_includes_tax: null,
    notes: 'Korean screen golf. Practice mode 400 THB/hr before 14:00, 600 THB/hr after. 18-hole rounds priced per round (600–800 THB/room). Open until late.',
  },
  phothalai: {
    name: 'Phothalai Golf Park',
    location: 'Pradit Manutham Rd (car access)',
    tech: 'Trackman 4',
    players_per_bay: null,
    cheapest_rate: '1,000 THB/hr',
    peak_rate: '1,000 THB/hr (flat)',
    price_includes_tax: null,
    notes: 'Trackman bays at a large driving-range and wellness complex. Unlimited balls. VIP rooms 1,500–2,000 THB/hr.',
  },
  topgolf: {
    name: 'Topgolf Megacity',
    location: 'Mega Bangna (Bang Phli)',
    tech: 'Topgolf',
    players_per_bay: 6,
    cheapest_rate: '550 THB/hr',
    peak_rate: '1,250 THB/hr',
    price_includes_tax: false,
    notes: 'Prices exclude service charge + VAT (~17%). No joining fee. Solo weekday practice rate 350 THB/hr. Located 30–45 min from central Bangkok.',
  },
}

export const priceGuidePages: PriceGuideSeoPage[] = [
  // ─── Page 1: How Much Does Golf Cost in Bangkok? ───
  {
    id: 'price-1',
    page_type: 'price_guide',
    slug: 'how-much-does-golf-cost-bangkok',
    title: 'How Much Does Golf Cost in Bangkok? (2026 Complete Guide)',
    meta_description:
      'Golf in Bangkok costs 400–4,000 THB depending on format. Compare indoor simulator rates (from 550 THB/hr for 5 people in central Bangkok) vs outdoor green fees, ranges, and lessons.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'en',
    related_slugs: ['/cost/golf-simulator-prices-bangkok', '/cost/lengolf-pricing-guide', '/cost/golf-lesson-prices-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        'Golf in Bangkok typically costs between 400 and 4,000 THB, depending on whether you play indoors on a simulator or outdoors on a course. Indoor golf simulators in central Bangkok start at 550 THB per hour for up to 5 people — just 110 THB per person — while suburban screen-golf venues start around 400 THB. Outdoor courses range from 1,500 to 4,000 THB per round, plus caddie fees and transport.',
      price_breakdown: [
        { item: 'Indoor golf simulator (LENGOLF)', price: '550–950 THB/hr', notes: 'Per bay, up to 5 players. Free club rental included. BTS Chidlom.' },
        { item: 'Indoor golf simulator (other venues)', price: '400–1,400 THB/hr', notes: 'Varies by venue, time, and day. Some exclude tax; the cheapest rates are at car-access venues outside the centre.' },
        { item: 'Outdoor course green fee (weekday)', price: '1,500–3,000 THB', notes: 'Per round. Courses like Alpine, Lakewood, Bangkok Golf Club.' },
        { item: 'Outdoor course green fee (weekend)', price: '2,500–4,000 THB', notes: 'Premium rates on Sat–Sun and public holidays.' },
        { item: 'Caddie fee (outdoor courses)', price: '300–400 THB', notes: 'Required at most Thai courses. Tip of 300–500 THB is customary.' },
        { item: 'Golf cart (outdoor courses)', price: '600–800 THB', notes: 'Optional at most courses. Shared between 2 players.' },
        { item: 'Driving range', price: '100–300 THB', notes: 'Per bucket of balls (50–100 balls). No club rental usually.' },
        { item: 'Golf lessons (indoor)', price: '1,800 THB/hr', notes: 'Private lesson with a pro. LENGOLF offers a free 1-hour trial.' },
        { item: 'Golf club rental (outdoor courses)', price: '1,000–2,500 THB', notes: 'Per round. Quality varies significantly.' },
      ],
      comparison_with_alternatives:
        'The cost difference between indoor and outdoor golf in Bangkok is significant. An outdoor round at a mid-range course costs approximately 2,500 THB (green fee) + 400 THB (caddie) + 700 THB (cart) + 1,500 THB (club rental if needed) = 5,100 THB minimum per person, plus 1–2 hours of transport each way. At LENGOLF, a group of 5 can play for 550 THB total per hour — 110 THB per person — in air-conditioned comfort at BTS Chidlom. For practice, social outings, or anyone who wants to experience golf without the full-day commitment, indoor simulators are dramatically more accessible.',
      value_proposition:
        'At 110 THB per person per hour (group of 5), LENGOLF is the most affordable way to play golf in Bangkok. No caddie fees, no transport costs, no dress code. Just show up at BTS Chidlom and play.',
      last_verified: '2026-02-19',
      venue_comparison: {
        venues: [
          SIMULATOR_VENUES.lengolf,
          SIMULATOR_VENUES.front9,
          SIMULATOR_VENUES.fairway,
          SIMULATOR_VENUES.topgolf,
        ],
        summary:
          'LENGOLF offers the lowest per-person cost of any simulator venue in central Bangkok. For a group of 5 at off-peak rates, that\'s 110 THB per person per hour — less than a driving range bucket. Topgolf\'s headline rates look competitive but exclude service charge and VAT (adding ~17%), and the venue is 30–45 minutes from central Bangkok. Fairway Golf & City Club uses premium Trackman technology but at nearly double the base rate. Front 9 is closest in pricing to LENGOLF but caps at 4 players per bay.',
      },
      sections: [
        {
          heading: 'Outdoor Golf: Full Cost Breakdown',
          body: 'A typical outdoor golf day in Bangkok includes: green fees (1,500–4,000 THB), caddie fee (300–400 THB + 300–500 THB tip), golf cart (600–800 THB, often shared), club rental if you don\'t have your own (1,000–2,500 THB), and transport (taxi to most courses is 400–800 THB each way, or join a van service for 200–400 THB). The total for a solo player renting clubs comes to 4,500–8,000 THB for a single round. Outdoor courses are generally 45–90 minutes from central Bangkok, which means a full golf day is a 6–8 hour commitment.',
        },
        {
          heading: 'Indoor Simulator Golf: What You Get',
          body: 'Indoor golf simulators let you play famous courses like Pebble Beach, St Andrews, and TPC Sawgrass in air-conditioned comfort. Modern simulators track ball speed, launch angle, spin, and carry distance with high accuracy. At LENGOLF, each bay accommodates up to 5 players, and the price covers the bay — not per person. A 2-hour session for 4 friends costs 1,100 THB weekday morning (275 THB each). Free standard club rental is included, so you don\'t need to bring or rent equipment.',
        },
        {
          heading: 'Which Option Is Best for You?',
          body: 'Choose outdoor courses if you want the full golf experience — fresh air, manicured fairways, and 4–5 hours of walking or riding. Choose indoor simulators if you want convenience (central Bangkok location, no travel), affordability (fraction of the cost), flexibility (play 1 hour or 4), and weather-proof golf any time of day. For beginners, tourists, and social groups, indoor simulators are usually the better value.',
        },
      ],
      curated_reviews: [
        VALUE_REVIEWS.chidbhan,
        VALUE_REVIEWS.jack,
        VALUE_REVIEWS.fritz,
      ],
    },
  },

  // ─── TH: how-much-does-golf-cost-bangkok ───
  // Title/meta rebuilt around how a Thai reader searches a price question
  // (เล่นกอล์ฟ...ราคาเท่าไหร่) rather than translating the EN explainer framing.
  // Every figure traces to the EN price-1 entry; currency spelled บาท, ranges
  // with ASCII '-', as-of marker set to กุมภาพันธ์ 2026 = this entry's own
  // last_verified (2026-02-19), not invented. price_breakdown item labels carry
  // NO ' — ' because the EN entry has none: PriceGuidePage.groupPriceRows()
  // splits on that exact em dash, so introducing one would restructure the table.
  // Simulator = ซิมูเลเตอร์ per glossary preferred (the guide corpus form);
  // BTS Chidlom kept Latin per brand_immutable.
  {
    id: 'price-1-th',
    page_type: 'price_guide',
    slug: 'how-much-does-golf-cost-bangkok',
    title: 'เล่นกอล์ฟในกรุงเทพฯ ราคาเท่าไหร่ (คู่มือราคาฉบับเต็ม 2026)',
    meta_description:
      'เล่นกอล์ฟในกรุงเทพฯ ราคา 400-4,000 บาท ขึ้นอยู่กับรูปแบบที่เลือก เทียบราคากอล์ฟซิมูเลเตอร์ในร่มใจกลางเมือง (เริ่ม 550 บาท/ชั่วโมง สำหรับ 5 คน) กับค่ากรีนฟีสนามกลางแจ้ง สนามไดรฟ์ และคอร์สเรียน',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'th',
    related_slugs: ['/cost/golf-simulator-prices-bangkok', '/cost/lengolf-pricing-guide', '/cost/golf-lesson-prices-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        'การเล่นกอล์ฟในกรุงเทพฯ โดยทั่วไปมีค่าใช้จ่ายอยู่ระหว่าง 400 ถึง 4,000 บาท ขึ้นอยู่กับว่าคุณเล่นในร่มบนกอล์ฟซิมูเลเตอร์หรือออกรอบในสนามกลางแจ้ง กอล์ฟซิมูเลเตอร์ในร่มใจกลางกรุงเทพฯ เริ่มต้นที่ 550 บาทต่อชั่วโมงสำหรับผู้เล่นสูงสุด 5 คน หรือเพียง 110 บาทต่อคน ขณะที่สถานที่สกรีนกอล์ฟย่านชานเมืองเริ่มต้นราว 400 บาท ส่วนสนามกลางแจ้งอยู่ที่ 1,500 ถึง 4,000 บาทต่อรอบ บวกค่าแคดดี้และค่าเดินทาง (ข้อมูล ณ กุมภาพันธ์ 2026)',
      price_breakdown: [
        { item: 'กอล์ฟซิมูเลเตอร์ในร่ม (LENGOLF)', price: '550-950 บาท/ชม.', notes: 'คิดต่อเบย์ ผู้เล่นสูงสุด 5 คน รวมบริการเช่าไม้กอล์ฟฟรี BTS Chidlom' },
        { item: 'กอล์ฟซิมูเลเตอร์ในร่ม (สถานที่อื่น)', price: '400-1,400 บาท/ชม.', notes: 'แตกต่างกันตามสถานที่ ช่วงเวลา และวัน บางแห่งยังไม่รวมภาษี ส่วนราคาถูกที่สุดอยู่ที่สถานที่นอกใจกลางเมืองซึ่งต้องเดินทางด้วยรถยนต์' },
        { item: 'ค่ากรีนฟีสนามกลางแจ้ง (วันธรรมดา)', price: '1,500-3,000 บาท', notes: 'ต่อรอบ สนามอย่าง Alpine, Lakewood, Bangkok Golf Club' },
        { item: 'ค่ากรีนฟีสนามกลางแจ้ง (วันหยุด)', price: '2,500-4,000 บาท', notes: 'ราคาช่วงพีคในวันเสาร์-อาทิตย์ และวันนักขัตฤกษ์' },
        { item: 'ค่าแคดดี้ (สนามกลางแจ้ง)', price: '300-400 บาท', notes: 'สนามส่วนใหญ่ในไทยกำหนดให้ใช้แคดดี้ ทิปตามธรรมเนียมอยู่ที่ 300-500 บาท' },
        { item: 'รถกอล์ฟ (สนามกลางแจ้ง)', price: '600-800 บาท', notes: 'เลือกใช้หรือไม่ก็ได้ในสนามส่วนใหญ่ ใช้ร่วมกัน 2 คน' },
        { item: 'สนามไดรฟ์', price: '100-300 บาท', notes: 'ต่อถังลูกกอล์ฟ (50-100 ลูก) โดยทั่วไปไม่มีบริการเช่าไม้กอล์ฟ' },
        { item: 'คอร์สเรียนกอล์ฟ (ในร่ม)', price: '1,800 บาท/ชม.', notes: 'เรียนส่วนตัวกับโปร LENGOLF มีคอร์สเรียนทดลองฟรี 1 ชั่วโมง' },
        { item: 'เช่าไม้กอล์ฟ (สนามกลางแจ้ง)', price: '1,000-2,500 บาท', notes: 'ต่อรอบ คุณภาพแตกต่างกันมาก' },
      ],
      comparison_with_alternatives:
        'ส่วนต่างของค่าใช้จ่ายระหว่างกอล์ฟในร่มกับกอล์ฟกลางแจ้งในกรุงเทพฯ นั้นชัดเจนมาก การออกรอบที่สนามระดับกลางมีค่าใช้จ่ายประมาณ 2,500 บาท (ค่ากรีนฟี) บวก 400 บาท (ค่าแคดดี้) บวก 700 บาท (รถกอล์ฟ) บวก 1,500 บาท (ค่าเช่าไม้กอล์ฟหากจำเป็น) รวมเป็นอย่างน้อย 5,100 บาทต่อคน และยังต้องใช้เวลาเดินทาง 1-2 ชั่วโมงต่อเที่ยว ส่วนที่ LENGOLF กลุ่ม 5 คนเล่นได้ในราคารวม 550 บาทต่อชั่วโมง หรือ 110 บาทต่อคน ในห้องปรับอากาศที่ BTS Chidlom สำหรับการซ้อม การมาสังสรรค์กับเพื่อน หรือใครก็ตามที่อยากลองเล่นกอล์ฟโดยไม่ต้องทุ่มเวลาทั้งวัน กอล์ฟซิมูเลเตอร์ในร่มเข้าถึงได้ง่ายกว่าอย่างเทียบกันไม่ติด',
      value_proposition:
        'ที่ 110 บาทต่อคนต่อชั่วโมง (กลุ่ม 5 คน) LENGOLF คือวิธีเล่นกอล์ฟที่คุ้มค่าที่สุดในกรุงเทพฯ ไม่มีค่าแคดดี้ ไม่มีค่าเดินทาง ไม่มีกฎการแต่งกาย แค่มาที่ BTS Chidlom แล้วเล่นได้เลย',
      last_verified: '2026-02-19',
      venue_comparison: {
        venues: [
          {
            name: 'LENGOLF',
            location: 'Mercury Ville, BTS Chidlom',
            tech: 'Bravo',
            players_per_bay: 5,
            cheapest_rate: '550 บาท/ชม.',
            peak_rate: '950 บาท/ชม.',
            price_includes_tax: true,
            notes: 'รวมบริการเช่าไม้กอล์ฟมาตรฐานฟรี เปิดทุกวัน 9:00-23:00 น.',
          },
          {
            name: 'Front 9',
            location: 'Sukhumvit 47 (Rainhill)',
            tech: 'Trackman',
            players_per_bay: 4,
            cheapest_rate: '600 บาท/ชม.',
            peak_rate: '900 บาท/ชม. (ราคาโปรโมชัน)',
            price_includes_tax: true,
            notes: 'เบย์ส่วนตัวเพิ่ม 200 บาท/ชม. ผู้เล่นคนที่ 5 เป็นต้นไปเพิ่มคนละ 100 บาท/ชม. เปิด 10:00-22:00 น. (วันหยุดสุดสัปดาห์เปิด 9:00 น.)',
          },
          {
            name: 'Fairway Golf & City Club',
            location: 'Sukhumvit 24, BTS Phrom Phong',
            tech: 'Trackman',
            players_per_bay: 8,
            cheapest_rate: '1,000 บาท/ชม.',
            peak_rate: '1,200 บาท/ชม.',
            price_includes_tax: false,
            notes: 'ราคาเดียวตลอดวัน 1,000 บาท/ชม. วันจันทร์-พฤหัสบดี และ 1,200 บาท/ชม. วันศุกร์-อาทิตย์ และวันนักขัตฤกษ์ ยังไม่รวมภาษีมูลค่าเพิ่ม เปิด 8:00-02:00 น.',
          },
          {
            name: 'Topgolf Megacity',
            location: 'Mega Bangna (Bang Phli)',
            tech: 'Topgolf',
            players_per_bay: 6,
            cheapest_rate: '550 บาท/ชม.',
            peak_rate: '1,250 บาท/ชม.',
            price_includes_tax: false,
            notes: 'ราคายังไม่รวมค่าบริการและภาษีมูลค่าเพิ่ม (ประมาณ 17 เปอร์เซ็นต์) ไม่มีค่าสมัครสมาชิก อัตราซ้อมคนเดียววันธรรมดา 350 บาท/ชม. ห่างจากใจกลางกรุงเทพฯ ประมาณ 30-45 นาที',
          },
        ],
        summary:
          'LENGOLF มีค่าใช้จ่ายต่อคนต่ำที่สุดในบรรดาสถานที่กอล์ฟซิมูเลเตอร์ใจกลางกรุงเทพฯ สำหรับกลุ่ม 5 คนในช่วงราคาต่ำสุด เท่ากับ 110 บาทต่อคนต่อชั่วโมง ซึ่งน้อยกว่าค่าลูกกอล์ฟหนึ่งถังที่สนามไดรฟ์ ราคาที่ Topgolf ประกาศไว้ดูแข่งขันได้ แต่ยังไม่รวมค่าบริการและภาษีมูลค่าเพิ่ม (เพิ่มอีกประมาณ 17 เปอร์เซ็นต์) และตัวสถานที่อยู่ห่างจากใจกลางกรุงเทพฯ ราว 30-45 นาที ส่วน Fairway Golf & City Club ใช้เทคโนโลยี Trackman ระดับพรีเมียม แต่ราคาเริ่มต้นสูงเกือบสองเท่า ขณะที่ Front 9 มีราคาใกล้เคียง LENGOLF ที่สุด แต่รองรับได้สูงสุด 4 คนต่อเบย์',
      },
      sections: [
        {
          heading: 'กอล์ฟกลางแจ้ง: แจกแจงค่าใช้จ่ายทั้งหมด',
          body: 'วันเล่นกอล์ฟกลางแจ้งในกรุงเทพฯ โดยทั่วไปประกอบด้วย ค่ากรีนฟี (1,500-4,000 บาท) ค่าแคดดี้ (300-400 บาท บวกทิป 300-500 บาท) รถกอล์ฟ (600-800 บาท ส่วนใหญ่แชร์กัน) ค่าเช่าไม้กอล์ฟหากคุณไม่มีของตัวเอง (1,000-2,500 บาท) และค่าเดินทาง (แท็กซี่ไปสนามส่วนใหญ่อยู่ที่ 400-800 บาทต่อเที่ยว หรือใช้บริการรถตู้ร่วม 200-400 บาท) รวมแล้วผู้เล่นคนเดียวที่ต้องเช่าไม้กอล์ฟด้วยจะมีค่าใช้จ่าย 4,500-8,000 บาทต่อการออกรอบหนึ่งครั้ง สนามกลางแจ้งโดยทั่วไปอยู่ห่างจากใจกลางกรุงเทพฯ ราว 45-90 นาที นั่นหมายความว่าการเล่นกอล์ฟหนึ่งวันกินเวลาไปทั้งสิ้น 6-8 ชั่วโมง',
        },
        {
          heading: 'กอล์ฟซิมูเลเตอร์ในร่ม: ได้อะไรบ้าง',
          body: 'กอล์ฟซิมูเลเตอร์ในร่มให้คุณเล่นสนามระดับโลกอย่าง Pebble Beach, St Andrews และ TPC Sawgrass ได้ในห้องปรับอากาศ ซิมูเลเตอร์รุ่นใหม่วัดความเร็วลูก มุมออกตัว สปิน และระยะแคร์รีได้อย่างแม่นยำ ที่ LENGOLF แต่ละเบย์รองรับผู้เล่นได้สูงสุด 5 คน และราคาคิดต่อเบย์ ไม่ใช่ต่อคน การเล่น 2 ชั่วโมงสำหรับเพื่อน 4 คนในช่วงเช้าวันธรรมดาจึงอยู่ที่ 1,100 บาท หรือคนละ 275 บาท พร้อมบริการเช่าไม้กอล์ฟมาตรฐานฟรี คุณจึงไม่ต้องพกหรือเช่าอุปกรณ์มาเอง',
        },
        {
          heading: 'แบบไหนเหมาะกับคุณ',
          body: 'เลือกสนามกลางแจ้งหากคุณต้องการประสบการณ์กอล์ฟเต็มรูปแบบ ทั้งอากาศโปร่ง แฟร์เวย์ที่ดูแลอย่างดี และการเดินหรือขับรถกอล์ฟ 4-5 ชั่วโมง เลือกกอล์ฟซิมูเลเตอร์ในร่มหากคุณให้ความสำคัญกับความสะดวก (อยู่ใจกลางกรุงเทพฯ ไม่ต้องเดินทางไกล) ความคุ้มค่า (ราคาเป็นเพียงเศษเสี้ยว) ความยืดหยุ่น (เล่น 1 ชั่วโมงหรือ 4 ชั่วโมงก็ได้) และการเล่นได้ทุกเวลาโดยไม่ต้องกังวลเรื่องสภาพอากาศ สำหรับผู้เริ่มต้น นักท่องเที่ยว และกลุ่มเพื่อน กอล์ฟซิมูเลเตอร์ในร่มมักคุ้มค่ากว่า',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'Chidbhan T.',
          text: 'Lengolf is a hidden gem right in the heart of Bangkok — super convenient location! The simulator is modern, high-quality, and incredibly accurate. Prices are very reasonable for the top-notch experience you get.',
        },
        {
          reviewer_name: 'Jack S.',
          text: 'Me and 2 friends came here for some golf after not playing for a while. The technology was fantastic and the staff were very helpful and friendly. For a very reasonable price I would definitely recommend!',
        },
        {
          reviewer_name: 'Fritz P.',
          text: 'So much fun!! Great price, great service, amazing experience.',
        },
      ],
    },
  },

  // ─── JA: how-much-does-golf-cost-bangkok ───
  // Title/meta front-load the JA cost query (バンコク ゴルフ 料金). Every figure
  // traces to the EN price-1 entry (400〜4,000 / 550 / 110 / 1,500〜4,000 /
  // 5,100 / 1,100 …) and is rendered per the JA ruling: half-width digits,
  // THB with no space, 〜 ranges, "1時間550THB" for "550 THB/hr". As-of marker
  // uses the entry's OWN last_verified month (（2026年2月現在）), not a blanket
  // July. venue_comparison: names/tech verbatim Latin, locations verbatim
  // except the "(car access)" connective; every rate numeral and the (promo)
  // qualifier preserved. related_slugs unchanged — all four are JA-translated.
  {
    id: 'price-1-ja',
    page_type: 'price_guide',
    slug: 'how-much-does-golf-cost-bangkok',
    title: 'バンコクのゴルフ料金はいくら？ — 2026年の費用まるごとガイド',
    meta_description:
      'バンコクのゴルフ料金はプレースタイル次第で400〜4,000THB。市内中心部のインドアゴルフシミュレーターは最大5名で1時間550THBから。屋外コースのグリーンフィー、ドライビングレンジ、レッスンの相場とあわせて比較します（2026年2月現在）。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'ja',
    related_slugs: ['/cost/golf-simulator-prices-bangkok', '/cost/lengolf-pricing-guide', '/cost/golf-lesson-prices-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        'バンコクのゴルフ料金は、インドアのシミュレーターでプレーするか屋外コースに出るかによって、おおむね400〜4,000THBの幅に収まります。市内中心部のインドアゴルフシミュレーターは最大5名で1時間550THBから——1人あたりにすると110THBです。郊外のスクリーンゴルフ施設なら400THB前後から。屋外コースは1ラウンド1,500〜4,000THBが目安で、これにキャディーフィーと移動費が加わります（2026年2月現在）。',
      price_breakdown: [
        { item: 'インドアゴルフシミュレーター（LENGOLF）', price: '1時間550〜950THB', notes: 'ベイ単位の料金で最大5名。クラブレンタル無料。BTSチットロム。' },
        { item: 'インドアゴルフシミュレーター（その他の施設）', price: '1時間400〜1,400THB', notes: '施設・時間帯・曜日によって変動します。税別表示の施設もあり、最も安いのは中心部を離れた車でのアクセスとなる施設です。' },
        { item: '屋外コースのグリーンフィー（平日）', price: '1,500〜3,000THB', notes: '1ラウンドあたり。Alpine、Lakewood、Bangkok Golf Clubといったコースの場合。' },
        { item: '屋外コースのグリーンフィー（週末）', price: '2,500〜4,000THB', notes: '土日と祝日は割高なレートになります。' },
        { item: 'キャディーフィー（屋外コース）', price: '300〜400THB', notes: 'タイのコースではほぼ必須です。300〜500THB程度のチップが慣例。' },
        { item: 'ゴルフカート（屋外コース）', price: '600〜800THB', notes: '多くのコースで任意。2名で1台をシェアします。' },
        { item: 'ドライビングレンジ', price: '100〜300THB', notes: 'ボール1カゴ（50〜100球）あたり。クラブレンタルは通常ありません。' },
        { item: 'ゴルフレッスン（インドア）', price: '1時間1,800THB', notes: 'プロによるプライベートレッスン。LENGOLFでは1時間の無料体験をご用意しています。' },
        { item: 'クラブレンタル（屋外コース）', price: '1,000〜2,500THB', notes: '1ラウンドあたり。品質の差は小さくありません。' },
      ],
      comparison_with_alternatives:
        'バンコクではインドアと屋外の費用差がかなり大きくなります。中級クラスのコースを1ラウンド回る場合、グリーンフィーが約2,500THB、キャディーフィーが400THB、カートが700THB、クラブが必要ならレンタルが1,500THBで、1人あたり最低5,100THB。これに片道1〜2時間の移動が加わります。LENGOLFなら5名のグループで1時間合計550THB——1人あたり110THB——を、BTSチットロムの空調の効いた空間で楽しめます。練習にも、仲間との集まりにも、丸一日を空けずにゴルフを体験してみたい方にも、インドアシミュレーターのほうが格段に手の届きやすい選択肢です。',
      value_proposition:
        '5名で利用した場合、1人1時間あたり110THB。LENGOLFはバンコクで最も手頃にゴルフを楽しめる場所です。キャディーフィーも移動費もドレスコードもありません。BTSチットロムまでお越しいただければ、そのままプレーできます。',
      last_verified: '2026-02-19',
      venue_comparison: {
        venues: [
          {
            name: 'LENGOLF',
            location: 'Mercury Ville, BTS Chidlom',
            tech: 'Bravo',
            players_per_bay: 5,
            cheapest_rate: '1時間550THB',
            peak_rate: '1時間950THB',
            price_includes_tax: true,
            notes: '標準クラブのレンタルが無料で付属。毎日9:00〜23:00営業。',
          },
          {
            name: 'Front 9',
            location: 'Sukhumvit 47 (Rainhill)',
            tech: 'Trackman',
            players_per_bay: 4,
            cheapest_rate: '1時間600THB',
            peak_rate: '1時間900THB（プロモ）',
            price_includes_tax: true,
            notes: 'プライベートベイは1時間あたり200THB増し。5人目からは1名につき1時間あたり100THB増し。営業時間10:00〜22:00（週末は9:00から）。',
          },
          {
            name: 'Fairway Golf & City Club',
            location: 'Sukhumvit 24, BTS Phrom Phong',
            tech: 'Trackman',
            players_per_bay: 8,
            cheapest_rate: '1時間1,000THB',
            peak_rate: '1時間1,200THB',
            price_includes_tax: false,
            notes: '一律料金で、月〜木は1時間1,000THB、金〜日と祝日は1時間1,200THB。VAT別。営業時間8:00〜翌2:00。',
          },
          {
            name: 'Topgolf Megacity',
            location: 'Mega Bangna (Bang Phli)',
            tech: 'Topgolf',
            players_per_bay: 6,
            cheapest_rate: '1時間550THB',
            peak_rate: '1時間1,250THB',
            price_includes_tax: false,
            notes: 'サービスチャージとVAT（合わせて約17%）は別途。入会金なし。平日ソロ練習は1時間350THB。バンコク中心部からは30〜45分の距離です。',
          },
        ],
        summary:
          'バンコク中心部のシミュレーター施設のなかで、1人あたりのコストが最も低いのがLENGOLFです。5名・オフピーク料金なら1人1時間あたり110THB——ドライビングレンジのボール1カゴより安く済みます。Topgolfは表示レートだけ見れば競争力がありますが、サービスチャージとVAT（約17%）が別途で、しかも中心部から30〜45分の場所にあります。Fairway Golf & City ClubはTrackmanの上位機材を使っているものの、基本レートはほぼ倍。Front 9は価格面でLENGOLFに最も近い一方、1ベイ4名までとなります。',
      },
      sections: [
        {
          heading: '屋外ゴルフ — 費用の全内訳',
          body: 'バンコクで屋外ゴルフに出る1日には、グリーンフィー（1,500〜4,000THB）、キャディーフィー（300〜400THB、これに300〜500THBのチップ）、ゴルフカート（600〜800THB、シェアすることが多い）、自前のクラブがない場合のレンタル（1,000〜2,500THB）、そして移動費（多くのコースへはタクシーで片道400〜800THB、乗合バンなら200〜400THB）がかかります。クラブを借りて1人で回る場合、1ラウンドの合計は4,500〜8,000THBほど。屋外コースは中心部からおおむね45〜90分の距離にあるため、ゴルフの日は6〜8時間がかりの予定になります。',
        },
        {
          heading: 'インドアシミュレーターゴルフ — 何ができるのか',
          body: 'インドアゴルフシミュレーターなら、Pebble BeachやSt Andrews、TPC Sawgrassといった名コースを空調の効いた室内でプレーできます。最近のシミュレーターはボールスピード、打ち出し角、スピン量、キャリーを高い精度で計測します。LENGOLFでは1ベイに最大5名まで入れ、料金は人数ではなくベイ単位。平日午前なら4人で2時間利用しても1,100THB（1人あたり275THB）です。標準クラブのレンタルが無料で含まれるので、道具を持ち込む必要も、別に借りに行く必要もありません。',
        },
        {
          heading: 'どちらを選ぶべきか',
          body: 'フルサイズのゴルフ体験——外の空気、手入れされたフェアウェイ、4〜5時間歩くか乗るか——を求めるなら屋外コース。利便性（バンコク中心部にあり移動が不要）、手頃さ（費用はごく一部）、柔軟さ（1時間でも4時間でも）、そして時間帯や天候に左右されないプレーを求めるならインドアシミュレーターです。初心者の方、旅行者の方、仲間との集まりには、インドアシミュレーターのほうが割に合うことがほとんどです。',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'Chidbhan T.',
          text: 'Lengolf is a hidden gem right in the heart of Bangkok — super convenient location! The simulator is modern, high-quality, and incredibly accurate. Prices are very reasonable for the top-notch experience you get.',
        },
        {
          reviewer_name: 'Jack S.',
          text: 'Me and 2 friends came here for some golf after not playing for a while. The technology was fantastic and the staff were very helpful and friendly. For a very reasonable price I would definitely recommend!',
        },
        {
          reviewer_name: 'Fritz P.',
          text: 'So much fun!! Great price, great service, amazing experience.',
        },
      ],
    },
  },

  // ─── KO: how-much-does-golf-cost-bangkok ───
  // Title/meta front-load the KO cost query (방콕 골프 비용). Every figure traces to
  // the EN entry (400~4,000바트 spread, 550바트/시간, 110바트 1인당, 1,500~4,000바트
  // green fees, 5,100바트 outdoor total); hedges carried as 보통/안팎/약/최소. Currency
  // follows the KO ruling (바트 attached, ASCII ~ ranges); as-of marker uses this
  // entry's OWN last_verified month — (2026년 2월 기준), not the July of price-2.
  // venue_comparison: venue names, tech and figures verbatim Latin/numeric; only the
  // currency word, the /hr unit and the prose notes localized. Front 9's "(promo)"
  // and Groove & Grit-style approximations preserved. related_slugs unchanged — all
  // four EN targets are KO-translated after this batch.
  {
    id: 'price-1-ko',
    page_type: 'price_guide',
    slug: 'how-much-does-golf-cost-bangkok',
    title: '방콕 골프 비용은 얼마일까 — 2026년 실내·실외 요금 총정리',
    meta_description:
      '방콕에서 골프를 치는 비용은 형식에 따라 400~4,000바트예요. 도심 실내 골프 시뮬레이터는 5명까지 시간당 550바트부터, 실외 코스는 그린피에 캐디피와 이동 비용이 더해져요 (2026년 2월 기준).',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'ko',
    related_slugs: ['/cost/golf-simulator-prices-bangkok', '/cost/lengolf-pricing-guide', '/cost/golf-lesson-prices-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        '방콕에서 골프를 치는 비용은 실내 시뮬레이터냐 실외 코스냐에 따라 보통 400~4,000바트예요. 도심의 실내 골프 시뮬레이터는 5명까지 시간당 550바트부터 시작해서 1인당 110바트 수준이고, 외곽의 스크린골프 매장은 400바트 안팎부터예요. 실외 코스는 1라운드에 1,500~4,000바트에 캐디피와 이동 비용이 더 붙어요 (2026년 2월 기준).',
      price_breakdown: [
        { item: '실내 골프 시뮬레이터 (LENGOLF)', price: '550~950바트/시간', notes: '베이 단위, 최대 5명. 기본 클럽 대여 무료 포함. BTS 칫롬역.' },
        { item: '실내 골프 시뮬레이터 (그 외 매장)', price: '400~1,400바트/시간', notes: '매장과 시간대, 요일에 따라 달라요. 세금이 빠진 곳도 있고, 가장 저렴한 요금은 도심 밖 차량 접근 매장이에요.' },
        { item: '실외 코스 그린피 (평일)', price: '1,500~3,000바트', notes: '1라운드당. Alpine, Lakewood, Bangkok Golf Club 같은 코스.' },
        { item: '실외 코스 그린피 (주말)', price: '2,500~4,000바트', notes: '토·일요일과 공휴일 프리미엄 요금.' },
        { item: '캐디피 (실외 코스)', price: '300~400바트', notes: '태국 대부분의 코스에서 필수예요. 300~500바트 팁이 관례예요.' },
        { item: '골프 카트 (실외 코스)', price: '600~800바트', notes: '대부분의 코스에서 선택 사항이고, 2명이 함께 써요.' },
        { item: '드라이빙 레인지', price: '100~300바트', notes: '볼 한 바구니(50~100개)당. 보통 클럽 대여는 없어요.' },
        { item: '골프 레슨 (실내)', price: '1,800바트/시간', notes: '프로와 1대1 개인 레슨. LENGOLF는 1시간 무료 체험 레슨을 제공해요.' },
        { item: '골프 클럽 대여 (실외 코스)', price: '1,000~2,500바트', notes: '1라운드당. 품질 편차가 커요.' },
      ],
      comparison_with_alternatives:
        '실내와 실외 골프의 비용 차이는 꽤 커요. 중급 코스에서 실외 라운딩을 하면 그린피 약 2,500바트에 캐디피 400바트, 카트 700바트, 클럽이 없다면 대여 1,500바트를 더해 1인당 최소 5,100바트가 들고, 편도 1~2시간의 이동 시간도 필요해요. LENGOLF에서는 5명이 함께 시간당 550바트, 1인당 110바트로 BTS 칫롬역의 에어컨이 나오는 공간에서 치실 수 있어요. 연습이나 모임, 또는 하루를 통째로 비우지 않고 골프를 경험해 보고 싶은 분에게는 실내 시뮬레이터가 훨씬 접근하기 쉬워요.',
      value_proposition:
        '5명이 함께라면 1인당 시간당 110바트로, LENGOLF는 방콕에서 골프를 가장 저렴하게 즐기는 방법이에요. 캐디피도, 이동 비용도, 복장 규정도 없어요. BTS 칫롬역으로 오셔서 바로 치시면 돼요.',
      last_verified: '2026-02-19',
      venue_comparison: {
        venues: [
          {
            name: 'LENGOLF',
            location: 'Mercury Ville, BTS 칫롬역',
            tech: 'Bravo',
            players_per_bay: 5,
            cheapest_rate: '550바트/시간',
            peak_rate: '950바트/시간',
            price_includes_tax: true,
            notes: '기본 클럽 대여 무료 포함. 매일 9:00~23:00 영업.',
          },
          {
            name: 'Front 9',
            location: 'Sukhumvit 47 (Rainhill)',
            tech: 'Trackman',
            players_per_bay: 4,
            cheapest_rate: '600바트/시간',
            peak_rate: '900바트/시간 (프로모션)',
            price_includes_tax: true,
            notes: '프라이빗 베이는 시간당 200바트 추가. 5번째 인원부터 1인당 시간당 100바트 추가. 10:00~22:00 영업 (주말은 9:00부터).',
          },
          {
            name: 'Fairway Golf & City Club',
            location: 'Sukhumvit 24, BTS Phrom Phong',
            tech: 'Trackman',
            players_per_bay: 8,
            cheapest_rate: '1,000바트/시간',
            peak_rate: '1,200바트/시간',
            price_includes_tax: false,
            notes: '균일 요금으로 월~목요일 시간당 1,000바트, 금~일요일과 공휴일 시간당 1,200바트예요. VAT 별도. 8:00~02:00 영업.',
          },
          {
            name: 'Topgolf Megacity',
            location: 'Mega Bangna (Bang Phli)',
            tech: 'Topgolf',
            players_per_bay: 6,
            cheapest_rate: '550바트/시간',
            peak_rate: '1,250바트/시간',
            price_includes_tax: false,
            notes: '표시 요금에 서비스 차지와 VAT(약 17%)는 빠져 있어요. 가입비는 없어요. 평일 1인 연습 요금은 시간당 350바트. 방콕 도심에서 30~45분 거리예요.',
          },
        ],
        summary:
          '방콕 도심의 시뮬레이터 매장 중에서 LENGOLF의 1인당 비용이 가장 낮아요. 5명이 비혼잡 시간대에 이용하면 1인당 시간당 110바트로, 드라이빙 레인지 볼 한 바구니보다도 저렴해요. Topgolf는 표시 요금만 보면 경쟁력이 있어 보이지만 서비스 차지와 VAT(약 17%)가 빠져 있고, 매장도 방콕 도심에서 30~45분 거리예요. Fairway Golf & City Club은 프리미엄 Trackman 장비를 쓰지만 기본 요금이 거의 두 배예요. Front 9은 요금대가 LENGOLF와 가장 가깝지만 베이당 4명까지만 이용할 수 있어요.',
      },
      sections: [
        {
          heading: '실외 골프: 전체 비용 뜯어보기',
          body: '방콕에서 실외 골프를 하루 치면 보통 이런 항목이 들어가요. 그린피 1,500~4,000바트, 캐디피 300~400바트에 팁 300~500바트, 골프 카트 600~800바트(보통 2명이 나눠 부담), 클럽이 없다면 대여 1,000~2,500바트, 그리고 이동 비용이 붙어요. 대부분의 코스는 택시로 편도 400~800바트, 밴 셰어 서비스를 이용하면 200~400바트예요. 클럽까지 빌리는 혼자 오신 분이라면 1라운드에 4,500~8,000바트가 들어요. 실외 코스는 대체로 방콕 도심에서 45~90분 거리라, 골프에 하루를 쓴다면 6~8시간을 잡아야 해요.',
        },
        {
          heading: '실내 시뮬레이터 골프: 무엇이 포함될까',
          body: '실내 골프 시뮬레이터에서는 Pebble Beach, St Andrews, TPC Sawgrass 같은 유명 코스를 에어컨이 나오는 실내에서 돌아볼 수 있어요. 요즘 시뮬레이터는 볼 스피드, 발사각, 스핀, 캐리 거리를 높은 정확도로 측정해요. LENGOLF는 베이 한 곳에 최대 5명까지 들어갈 수 있고, 요금은 인원이 아니라 베이 단위로 매겨져요. 친구 4명이 평일 오전에 2시간을 이용하면 1,100바트, 1인당 275바트예요. 기본 클럽 대여가 무료로 포함돼 있어서 장비를 따로 가져오거나 빌리지 않아도 돼요.',
        },
        {
          heading: '어느 쪽이 나에게 맞을까요',
          body: '탁 트인 야외, 잘 관리된 페어웨이, 4~5시간을 걷거나 카트로 도는 골프 본연의 경험을 원하신다면 실외 코스가 맞아요. 도심에서 이동 없이, 훨씬 낮은 비용으로, 1시간이든 4시간이든 원하는 만큼, 날씨와 상관없이 아무 때나 치고 싶다면 실내 시뮬레이터가 맞고요. 입문자나 여행자, 여럿이 모이는 자리라면 대체로 실내 시뮬레이터가 더 나은 선택이에요.',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'Chidbhan T.',
          text: 'Lengolf is a hidden gem right in the heart of Bangkok — super convenient location! The simulator is modern, high-quality, and incredibly accurate. Prices are very reasonable for the top-notch experience you get.',
        },
        {
          reviewer_name: 'Jack S.',
          text: 'Me and 2 friends came here for some golf after not playing for a while. The technology was fantastic and the staff were very helpful and friendly. For a very reasonable price I would definitely recommend!',
        },
        {
          reviewer_name: 'Fritz P.',
          text: 'So much fun!! Great price, great service, amazing experience.',
        },
      ],
    },
  },

  // ─── ZH: how-much-does-golf-cost-bangkok ───
  // Every figure traces to EN price-1 (400–4,000泰铢; 550泰铢/小时最多5人=110泰铢/人;
  // 市郊约400泰铢起; 室外1,500–4,000泰铢; 2,500+400+700+1,500=5,100泰铢; 4,500–8,000泰铢;
  // 1,100泰铢/275泰铢; 100+世界名场是price-2的说法故未引入). Currency 泰铢, ranges –,
  // as-of 截至2026年2月 = this entry's own last_verified (2026-02-19), NOT price-2's
  // July date — harmonizing them would assert a re-verification that did not happen.
  // price_breakdown items deliberately contain NO ' — ' separator: groupPriceRows()
  // in components/prices/PriceGuidePage.tsx splits on that exact string to build
  // venue groups, and the EN entry is a flat table. venue_comparison names/tech/
  // figures verbatim; 未公布 is only used where EN says so. related_slugs unchanged
  // — all four EN targets are ZH-translated.
  {
    id: 'price-1-zh',
    page_type: 'price_guide',
    slug: 'how-much-does-golf-cost-bangkok',
    title: '在曼谷打高尔夫要多少钱 — 2026年室内与室外费用全解析',
    meta_description:
      '在曼谷打高尔夫，400–4,000泰铢就能玩，差别在于形式。市中心室内模拟器每小时550泰铢起、最多5人同用，本文对比室外果岭费、练习场与课程收费，截至2026年2月。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'zh',
    related_slugs: ['/cost/golf-simulator-prices-bangkok', '/cost/lengolf-pricing-guide', '/cost/golf-lesson-prices-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        '在曼谷打一场高尔夫，通常要花400–4,000泰铢，差别在于你是在室内用模拟器打，还是到室外球场下场。市中心的室内高尔夫模拟器每小时550泰铢起，最多可5人同用——平摊下来一个人只要110泰铢；市郊的屏幕高尔夫场馆则从约400泰铢起。室外球场一轮1,500–4,000泰铢，另外还得算上球童费和往返交通，截至2026年2月。',
      price_breakdown: [
        { item: '室内高尔夫模拟器（LENGOLF）', price: '550–950泰铢/小时', notes: '按球位计费，最多5人。含免费球杆租借。BTS Chidlom。' },
        { item: '室内高尔夫模拟器（其他场馆）', price: '400–1,400泰铢/小时', notes: '因场馆、时段与星期而异。部分场馆标价不含税；最便宜的价格出现在市区外需自驾的场馆。' },
        { item: '室外球场果岭费（平日）', price: '1,500–3,000泰铢', notes: '每轮。Alpine、Lakewood、Bangkok Golf Club一类的球场。' },
        { item: '室外球场果岭费（周末）', price: '2,500–4,000泰铢', notes: '周六日与公众假期的高价时段。' },
        { item: '球童费（室外球场）', price: '300–400泰铢', notes: '泰国多数球场都必须请球童。另给300–500泰铢小费是惯例。' },
        { item: '高尔夫球车（室外球场）', price: '600–800泰铢', notes: '多数球场可选。2人共用一辆。' },
        { item: '练习场', price: '100–300泰铢', notes: '每桶球（50–100颗）。通常不含球杆租借。' },
        { item: '高尔夫课程（室内）', price: '1,800泰铢/小时', notes: '教练一对一。LENGOLF提供1小时免费试上课。' },
        { item: '球杆租借（室外球场）', price: '1,000–2,500泰铢', notes: '每轮。品质差异很大。' },
      ],
      comparison_with_alternatives:
        '在曼谷，室内和室外高尔夫的花费差得很远。去一家中档球场下一场，大致是果岭费2,500泰铢、球童费400泰铢、球车费700泰铢，如果还得租球杆再加1,500泰铢——一个人最少5,100泰铢，来回车程各还要1–2小时。在LENGOLF，5人一组每小时总共550泰铢，也就是每人110泰铢，就在BTS Chidlom的空调环境里打。对于想练球、想约朋友聚一聚，或者只是想体验一下高尔夫又不愿意搭进一整天的人，室内模拟器要好上手得多。',
      value_proposition:
        '5人一组时每人每小时只要110泰铢，LENGOLF是在曼谷打高尔夫最省钱的方式。没有球童费，没有交通开销，也没有着装规定。到BTS Chidlom直接来打就行。',
      last_verified: '2026-02-19',
      venue_comparison: {
        venues: [
          {
            name: 'LENGOLF',
            location: 'Mercury Ville，BTS Chidlom',
            tech: 'Bravo',
            players_per_bay: 5,
            cheapest_rate: '550泰铢/小时',
            peak_rate: '950泰铢/小时',
            price_includes_tax: true,
            notes: '含免费标准球杆租借。每日9:00–23:00营业。',
          },
          {
            name: 'Front 9',
            location: 'Sukhumvit 47（Rainhill）',
            tech: 'Trackman',
            players_per_bay: 4,
            cheapest_rate: '600泰铢/小时',
            peak_rate: '900泰铢/小时（促销价）',
            price_includes_tax: true,
            notes: '独立球位另加200泰铢/小时。第5人起每人另加100泰铢/小时。10:00–22:00营业，周末9:00起。',
          },
          {
            name: 'Fairway Golf & City Club',
            location: 'Sukhumvit 24，BTS Phrom Phong',
            tech: 'Trackman',
            players_per_bay: 8,
            cheapest_rate: '1,000泰铢/小时',
            peak_rate: '1,200泰铢/小时',
            price_includes_tax: false,
            notes: '统一价：周一至周四1,000泰铢/小时，周五至周日及节假日1,200泰铢/小时。不含增值税。8:00–02:00营业。',
          },
          {
            name: 'Topgolf Megacity',
            location: 'Mega Bangna（Bang Phli）',
            tech: 'Topgolf',
            players_per_bay: 6,
            cheapest_rate: '550泰铢/小时',
            peak_rate: '1,250泰铢/小时',
            price_includes_tax: false,
            notes: '标价不含服务费与增值税（约17%）。无入会费。平日单人练习价350泰铢/小时。距曼谷市中心30–45分钟。',
          },
        ],
        summary:
          '在曼谷市中心的模拟器场馆里，LENGOLF的人均成本最低：5人一组、非高峰时段每人每小时110泰铢，比一桶练习球还便宜。Topgolf的标价看着有竞争力，但不含服务费和增值税（要再加约17%），而且场馆离曼谷市中心有30–45分钟车程。Fairway Golf & City Club用的是高阶的Trackman设备，但基础价格接近前者的两倍。Front 9的定价与LENGOLF最接近，不过每个球位最多只能4人。',
      },
      sections: [
        {
          heading: '室外高尔夫：完整费用拆解',
          body: '在曼谷打一天室外高尔夫，通常包括：果岭费（1,500–4,000泰铢）、球童费（300–400泰铢，另加300–500泰铢小费）、球车（600–800泰铢，常由两人分摊）、球杆租借（自己没带的话1,000–2,500泰铢），以及交通（打车去大多数球场单程400–800泰铢，拼商务车服务则是200–400泰铢）。一个人单独去、还要租球杆的话，一轮下来合计4,500–8,000泰铢。室外球场一般距曼谷市中心45–90分钟车程，也就是说，一整天高尔夫要占掉6–8小时。',
        },
        {
          heading: '室内模拟器高尔夫：你能得到什么',
          body: '室内高尔夫模拟器让你在空调房里打Pebble Beach、St Andrews、TPC Sawgrass这些名场。现在的模拟器对球速、发射角、旋转和飞行距离的追踪都相当准确。在LENGOLF，每个球位最多可容纳5人，收费是按球位算的，不是按人头。4个朋友在平日上午打2小时，总共1,100泰铢，一人275泰铢。标准球杆免费租借已包含在内，所以你不用自带装备，也不必另外去租。',
        },
        {
          heading: '哪一种更适合你',
          body: '如果你想要完整的高尔夫体验——新鲜空气、修剪整齐的球道，加上4–5小时的步行或乘车——那就选室外球场。如果你看重的是方便（就在曼谷市中心，不用跑远）、便宜（只是室外的一个零头）、灵活（打1小时还是4小时都行），以及一年到头随时不受天气影响，那就选室内模拟器。对新手、游客和朋友聚会来说，室内模拟器通常更划算。',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'Chidbhan T.',
          text: 'Lengolf is a hidden gem right in the heart of Bangkok — super convenient location! The simulator is modern, high-quality, and incredibly accurate. Prices are very reasonable for the top-notch experience you get.',
        },
        {
          reviewer_name: 'Jack S.',
          text: 'Me and 2 friends came here for some golf after not playing for a while. The technology was fantastic and the staff were very helpful and friendly. For a very reasonable price I would definitely recommend!',
        },
        {
          reviewer_name: 'Fritz P.',
          text: 'So much fun!! Great price, great service, amazing experience.',
        },
      ],
    },
  },

  // ─── Page 2: Golf Simulator Prices Bangkok Compared ───
  {
    id: 'price-2',
    page_type: 'price_guide',
    slug: 'golf-simulator-prices-bangkok',
    title: 'Golf Simulator Prices in Bangkok Compared (2026)',
    meta_description:
      'Compare golf simulator prices in Bangkok, verified July 2026: LENGOLF from 550 THB/hr vs Front 9, Fairway, Groove & Grit, Golfzon, Phothalai & Topgolf.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'en',
    related_slugs: ['/cost/how-much-does-golf-cost-bangkok', '/cost/lengolf-pricing-guide', '/faq/how-much-does-indoor-golf-cost-in-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        'Golf simulator prices in Bangkok range from about 400 to 1,400 THB per hour per bay, depending on the venue, time of day, and day of week. In central Bangkok, expect 550–1,200 THB per bay-hour; LENGOLF starts at 550 THB/hour for up to 5 players. Here\'s an honest comparison of every major simulator venue in Bangkok — every rate below was re-verified in July 2026 against each venue\'s own published prices.',
      price_breakdown: [
        { item: 'LENGOLF — Weekday before 14:00', price: '550 THB/hr', notes: 'Up to 5 players. Free standard clubs. BTS Chidlom. VAT included.' },
        { item: 'LENGOLF — Weekday 14:00–23:00', price: '750 THB/hr', notes: 'Up to 5 players. Free standard clubs. VAT included.' },
        { item: 'LENGOLF — Weekend / Holiday', price: '750–950 THB/hr', notes: 'Fri–Sun & PH. Up to 5 players. VAT included.' },
        { item: 'Front 9 — Weekday before 12:00', price: '600 THB/hr', notes: 'Up to 4 players. Trackman. Sukhumvit 47. VAT included.' },
        { item: 'Front 9 — Weekday 12:00–17:00', price: '700 THB/hr', notes: 'Up to 4 players. VAT included.' },
        { item: 'Front 9 — Weekday 17:00–22:00 (promo)', price: '800 THB/hr', notes: 'Promo rate (regular: 1,200 THB). VAT included.' },
        { item: 'Front 9 — Weekend', price: '800–900 THB/hr', notes: 'Evening slot is a promo rate (regular: 1,400 THB). +200 THB/hr private bay. VAT included.' },
        { item: 'Fairway Golf — Mon–Thu (all day)', price: '1,000 THB/hr', notes: 'Up to 8 players. Trackman. Sukhumvit 24. Excludes VAT. Open until 2 AM.' },
        { item: 'Fairway Golf — Fri–Sun & holidays', price: '1,200 THB/hr', notes: 'Up to 8 players. Excludes VAT.' },
        { item: 'Groove & Grit — Sathorn', price: '~1,000 THB/hr', notes: 'Foresight Falcon. Supalai Icon Sathorn. Full rate card not published — book via LINE or apps.' },
        { item: 'Golfzon Bangna — Practice mode', price: '400–600 THB/hr', notes: 'Up to 4 players. 400 THB/hr before 14:00, 600 after. Bangna-Trad 23, car access.' },
        { item: 'Golfzon Bangna — 18-hole round', price: '600–800 THB', notes: 'Per round per room, not hourly. Korean screen-golf format.' },
        { item: 'Phothalai Golf Park — Trackman bay', price: '1,000 THB/hr', notes: 'Flat rate, unlimited balls. VIP rooms 1,500–2,000 THB/hr. Pradit Manutham, car access.' },
        { item: 'Topgolf — Mon–Tue', price: '550–650 THB/hr', notes: 'Up to 6 players. Mega Bangna. Excludes SC + VAT (~17%).' },
        { item: 'Topgolf — Fri–Sat peak', price: '1,150–1,250 THB/hr', notes: 'Up to 6 players. Excludes SC + VAT.' },
        { item: 'Topgolf — Solo weekday practice', price: '350 THB/hr', notes: '1 player, Mon–Fri 9:00–17:00, unlimited balls. Excludes SC + VAT.' },
      ],
      comparison_with_alternatives:
        'When comparing prices, always check whether tax is included. LENGOLF and Front 9 quote VAT-inclusive prices. Fairway Golf & City Club excludes VAT (add ~7%), and Topgolf Megacity excludes both service charge and VAT (add ~17%), which makes their posted rates 17% lower than the actual cost you\'ll pay. Location matters too: LENGOLF, Front 9, Fairway, and Groove & Grit are all on the BTS/MRT network in central Bangkok, while Golfzon Bangna, Phothalai, and Topgolf Megacity are car-access venues 30–45 minutes out. Finally, note that many lesson-focused studios don\'t publish bay rates at all — you have to call or LINE for a quote.',
      value_proposition:
        'LENGOLF offers the lowest bay rate in central Bangkok at 550 THB/hour, and the lowest per-person rate at 110 THB (group of 5). With free standard club rental, no joining fees, and prices inclusive of tax, what you see is what you pay.',
      last_verified: '2026-07-26',
      venue_comparison: {
        venues: [
          SIMULATOR_VENUES.lengolf,
          SIMULATOR_VENUES.front9,
          SIMULATOR_VENUES.fairway,
          SIMULATOR_VENUES.grooveGrit,
          SIMULATOR_VENUES.golfzonBangna,
          SIMULATOR_VENUES.phothalai,
          SIMULATOR_VENUES.topgolf,
        ],
        summary:
          'For per-person value in central Bangkok, LENGOLF is the clear winner at 110 THB per person (5 players, weekday off-peak). Front 9 is the closest competitor at 150 THB per person (4 players). Fairway Golf simplified its pricing in 2026 to a flat 1,000 THB/hr Mon–Thu and 1,200 THB/hr Fri–Sun (still excluding VAT) — its 8-player rooms help per-person cost, but the base rate is nearly double LENGOLF\'s. Golfzon Bangna has the cheapest posted practice rate in greater Bangkok (400 THB/hr) but is a car-access venue on Bangna-Trad with 4-player rooms. Topgolf\'s true cost after service charge and VAT is roughly 645–1,465 THB/hr, and the Bangna location adds transport time and cost from central Bangkok.',
      },
      sections: [
        {
          heading: 'LENGOLF: Full Rate Card',
          body: 'LENGOLF is at Mercury Ville, directly connected to BTS Chidlom (Exit 4). Weekday rates: 550 THB/hr before 14:00, 750 THB/hr from 14:00–23:00. Weekend/holiday rates: 750 THB/hr before 14:00, 950 THB/hr from 14:00–23:00. All prices per bay (up to 5 players), inclusive of VAT. Free standard club rental is included with every booking. Premium club rental (Callaway, Majesty) is available from 150 THB/hr. Monthly packages: Bronze (5 hrs, 3,000 THB), Silver (15 hrs, 8,000 THB), Gold (30 hrs, 14,000 THB), Diamond Unlimited (8,000 THB/month), Diamond+ Unlimited (18,000 THB/3 months). Early Bird packages (before 14:00 only): 10 hrs for 4,800 THB, or unlimited for 5,000 THB/month.',
        },
        {
          heading: 'Front 9: Full Rate Card',
          body: 'Front 9 is at Rainhill on Sukhumvit 47, between BTS Phrom Phong and Thong Lo. Weekday rates: 600 THB/hr before 12:00, 700 THB/hr from 12:00–17:00, 800 THB/hr from 17:00–22:00 (promo, regular 1,200 THB). Weekend rates: 800 THB/hr before 12:00, 900 THB/hr from 12:00 onward (the evening slot is a promo rate — regular 1,400 THB). All prices per bay (up to 4 players), inclusive of VAT. Private bay is +200 THB/hr. 5th player onwards is +100 THB/hr per person. Practice packages: Early Rise 10x1hr (mornings only, 5,490 THB), Anytime 10x1hr (6,990 THB), 20x1hr (12,900 THB), 50x1hr (29,900 THB). Memberships run from 14,000 THB (3-month solo) to 30,000 THB (6-month, up to 4 players). Open 10:00–22:00 weekdays, from 9:00 weekends. Powered by Trackman.',
        },
        {
          heading: 'Fairway Golf & City Club: Full Rate Card',
          body: 'Fairway Golf & City Club is on Sukhumvit 24, near BTS Phrom Phong. In 2026 they simplified to flat rates: 1,000 THB/hr all day Mon–Thu, and 1,200 THB/hr on Fri–Sun and public holidays. All prices per room (up to 8 players), excluding VAT. Open 8:00 AM to 2 AM daily — the latest closing time of any central Bangkok simulator. Hour-bundle packages (currently promoted at 30% off): 5 hrs 4,500 THB, 10 hrs 7,700 THB, 25 hrs 16,450 THB, 50 hrs 28,700 THB, with validity from 2 to 12 months. Powered by Trackman. Fairway also has a cocktail bar, DJs on weekends, and rooms that convert to karaoke.',
        },
        {
          heading: 'Groove & Grit: New Sim-and-Bar in Sathorn',
          body: 'Groove & Grit Golf and Bar opened at Supalai Icon Sathorn (near MRT Lumphini) and is the newest simulator-plus-bar concept in central Bangkok — the closest in spirit to LENGOLF, but on the Sathorn side of town. Bays run Foresight Falcon launch monitors with Swing Catalyst and high-speed cameras, and there\'s a wine and premium-spirits lounge with PGA-pro lessons available. Off-peak morning sessions show up around 1,000 THB/hr on booking platforms, but the venue doesn\'t publish a full rate card — contact them for peak pricing. Open 7:00–22:00 daily.',
        },
        {
          heading: 'Golfzon, Kakao Friends & Korean Screen Golf',
          body: 'Bangkok has a growing Korean screen-golf scene, typically priced per 18-hole round rather than per hour. Golfzon Bangna (Bangna-Trad Soi 23) runs Golfzon TwoVision simulators: practice mode is 400 THB/hr before 14:00 and 600 THB/hr after, while 18-hole rounds cost 600–800 THB per room (up to 4 players), with a Korean kitchen on site. Golfzon Park Sooho at Market Place Ekkamai is open 9:00 AM to 3 AM — the latest hours of any sim venue in Bangkok — but only shares rates by phone. Kakao Friends Screen Golf at Suanplern Market (Rama IV) brings Kakao VX\'s Friends Screen technology and is open until 2 AM; rates are published on-site only. These venues suit golfers who want the authentic Korean screen-golf round format; for hourly social play in the city centre, the BTS-line venues are more convenient.',
        },
        {
          heading: 'Phothalai Golf Park: Trackman at a Driving Range',
          body: 'Phothalai Golf Park on Pradit Manutham Road (Ekkamai–Ramindra corridor, car access) is a large outdoor driving-range and wellness complex whose indoor Trackman 4 bays rent at a flat 1,000 THB per hour with unlimited balls, any day or time. Small and large VIP rooms go for 1,500 and 2,000 THB/hr. It\'s a strong option if you live on the east side and want Trackman data without central-Bangkok traffic — but there\'s no BTS access, and the vibe is practice-facility rather than social night out.',
        },
        {
          heading: 'Topgolf Megacity: Full Rate Card',
          body: 'Topgolf Megacity is in Bang Phli near Mega Bangna — approximately 30–45 minutes from central Bangkok by car. It\'s a very different experience from the simulator bars above: it\'s an outdoor multi-story driving range with target-based games, not a traditional enclosed golf simulator. Standard bay rates: Mon–Tue 550–650 THB/hr, Wed–Thu 550–850 THB/hr, Fri 550–1,150 THB/hr, Sat 850–1,250 THB/hr, Sun 850–1,150 THB/hr. Solo players can practice for 350 THB/hr on weekdays before 17:00. VIP bays (up to 12 players) run 1,700–3,200 THB/hr. All prices exclude 10% service charge and 7% VAT — add approximately 17% to posted rates. There\'s no longer a joining fee, and students (23 and under, with ID) get 50% off gameplay, food, and drinks on weekdays. Open 9:00–23:00 Sun–Thu, until midnight Fri–Sat.',
        },
        {
          heading: 'Lesson Studios That Don\'t Publish Bay Rates',
          body: 'Several well-equipped indoor golf studios in Bangkok are academy- or fitting-led and don\'t publish hourly bay rates — you\'ll need to call or LINE for a quote. These include PING Indoor Golf Centre (Sukhumvit 24, Foresight GCQuad/GC3), Golf Swing Academy Bangkok (Sukhumvit 26, Japanese-run, Foresight bays), Home of Golf (Sukhumvit 26 and Rama 2, Trackman), Swing Kings Golf BKK (Asoke, Trackman + Foresight), and Bangkok Golf Centre (Wireless Road, 15 bays). They\'re excellent for structured coaching and club fitting, but for walk-in social play their pricing is opaque — which is exactly why this comparison focuses on venues with published rates.',
        },
        {
          heading: 'Which Venue Is Right for You?',
          body: 'Choose LENGOLF if you want the best value in central Bangkok — lowest per-person cost, free clubs, BTS access, and a social bar atmosphere. Choose Front 9 if you\'re a serious golfer who values Trackman data and lives near Sukhumvit 47. Choose Fairway Golf & City Club for late-night sessions (open to 2 AM) with a larger group of up to 8, if you don\'t mind paying more. Choose Groove & Grit if you\'re on the Sathorn side and want a premium Foresight setup with a wine bar. Choose Golfzon Bangna or Kakao Friends for the authentic Korean screen-golf round format. Choose Phothalai if you\'re east-side with a car and want flat-rate Trackman practice. And choose Topgolf Megacity if you want the Topgolf experience — an outdoor driving range with games, food, and a party atmosphere — and don\'t mind traveling to Bangna.',
        },
      ],
      curated_reviews: [
        VALUE_REVIEWS.b_screen_golf,
        VALUE_REVIEWS.tttnatorn,
        VALUE_REVIEWS.chidbhan,
      ],
    },
  },

  // ─── TH: golf-simulator-prices-bangkok ───
  // Largest entry in the batch (16 price rows, 7 venues, 9 sections). Venue
  // names, tech names, road/station names and every numeral copied verbatim;
  // only currency word, the /hr unit, and prose were localized. The three
  // non-numeric rate qualifiers were translated rather than left in English —
  // '(promo)' → '(ราคาโปรโมชัน)', 'Not published' → 'ไม่ประกาศราคา',
  // '(flat)' → '(ราคาเดียว)' — see the report: leaving them Latin would ship
  // English fragments inside a Thai table. price_includes_tax nulls are left
  // null and never described as "tax not included" in prose. As-of = กรกฎาคม
  // 2026, which the EN intro itself states ("re-verified in July 2026").
  {
    id: 'price-2-th',
    page_type: 'price_guide',
    slug: 'golf-simulator-prices-bangkok',
    title: 'ราคากอล์ฟซิมูเลเตอร์ในกรุงเทพฯ เทียบทุกที่ (2026)',
    meta_description:
      'เทียบราคากอล์ฟซิมูเลเตอร์ในกรุงเทพฯ ตรวจสอบล่าสุดกรกฎาคม 2026 LENGOLF เริ่มต้น 550 บาท/ชั่วโมง เทียบกับ Front 9, Fairway, Groove & Grit, Golfzon, Phothalai และ Topgolf',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'th',
    related_slugs: ['/cost/how-much-does-golf-cost-bangkok', '/cost/lengolf-pricing-guide', '/faq/how-much-does-indoor-golf-cost-in-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        'ราคากอล์ฟซิมูเลเตอร์ในกรุงเทพฯ อยู่ที่ราว 400 ถึง 1,400 บาทต่อชั่วโมงต่อเบย์ ขึ้นอยู่กับสถานที่ ช่วงเวลาของวัน และวันในสัปดาห์ ใจกลางกรุงเทพฯ คาดหวังได้ที่ 550-1,200 บาทต่อเบย์ต่อชั่วโมง ส่วน LENGOLF เริ่มต้นที่ 550 บาทต่อชั่วโมงสำหรับผู้เล่นสูงสุด 5 คน ด้านล่างนี้คือการเทียบราคาอย่างตรงไปตรงมาของสถานที่กอล์ฟซิมูเลเตอร์รายใหญ่ทุกแห่งในกรุงเทพฯ ทุกอัตราได้รับการตรวจสอบซ้ำกับราคาที่แต่ละแห่งประกาศไว้เอง (ข้อมูล ณ กรกฎาคม 2026)',
      price_breakdown: [
        { item: 'LENGOLF — วันธรรมดา ก่อน 14:00 น.', price: '550 บาท/ชม.', notes: 'ผู้เล่นสูงสุด 5 คน ไม้กอล์ฟมาตรฐานฟรี BTS Chidlom รวมภาษีมูลค่าเพิ่มแล้ว' },
        { item: 'LENGOLF — วันธรรมดา 14:00-23:00 น.', price: '750 บาท/ชม.', notes: 'ผู้เล่นสูงสุด 5 คน ไม้กอล์ฟมาตรฐานฟรี รวมภาษีมูลค่าเพิ่มแล้ว' },
        { item: 'LENGOLF — วันหยุดสุดสัปดาห์ / วันนักขัตฤกษ์', price: '750-950 บาท/ชม.', notes: 'ศุกร์-อาทิตย์ และวันนักขัตฤกษ์ ผู้เล่นสูงสุด 5 คน รวมภาษีมูลค่าเพิ่มแล้ว' },
        { item: 'Front 9 — วันธรรมดา ก่อน 12:00 น.', price: '600 บาท/ชม.', notes: 'ผู้เล่นสูงสุด 4 คน Trackman Sukhumvit 47 รวมภาษีมูลค่าเพิ่มแล้ว' },
        { item: 'Front 9 — วันธรรมดา 12:00-17:00 น.', price: '700 บาท/ชม.', notes: 'ผู้เล่นสูงสุด 4 คน รวมภาษีมูลค่าเพิ่มแล้ว' },
        { item: 'Front 9 — วันธรรมดา 17:00-22:00 น. (โปรโมชัน)', price: '800 บาท/ชม.', notes: 'ราคาโปรโมชัน (ราคาปกติ 1,200 บาท) รวมภาษีมูลค่าเพิ่มแล้ว' },
        { item: 'Front 9 — วันหยุดสุดสัปดาห์', price: '800-900 บาท/ชม.', notes: 'ช่วงเย็นเป็นราคาโปรโมชัน (ราคาปกติ 1,400 บาท) เบย์ส่วนตัวเพิ่ม 200 บาท/ชม. รวมภาษีมูลค่าเพิ่มแล้ว' },
        { item: 'Fairway Golf — จันทร์-พฤหัสบดี (ตลอดวัน)', price: '1,000 บาท/ชม.', notes: 'ผู้เล่นสูงสุด 8 คน Trackman Sukhumvit 24 ยังไม่รวมภาษีมูลค่าเพิ่ม เปิดถึงตี 2' },
        { item: 'Fairway Golf — ศุกร์-อาทิตย์ และวันนักขัตฤกษ์', price: '1,200 บาท/ชม.', notes: 'ผู้เล่นสูงสุด 8 คน ยังไม่รวมภาษีมูลค่าเพิ่ม' },
        { item: 'Groove & Grit — สาทร', price: 'ประมาณ 1,000 บาท/ชม.', notes: 'Foresight Falcon ที่ Supalai Icon Sathorn ไม่ได้ประกาศอัตราค่าบริการทั้งหมด ต้องจองผ่าน LINE หรือแอปพลิเคชัน' },
        { item: 'Golfzon Bangna — โหมดซ้อม', price: '400-600 บาท/ชม.', notes: 'ผู้เล่นสูงสุด 4 คน 400 บาท/ชม. ก่อน 14:00 น. และ 600 บาท/ชม. หลังจากนั้น Bangna-Trad 23 เดินทางด้วยรถยนต์' },
        { item: 'Golfzon Bangna — ออกรอบ 18 หลุม', price: '600-800 บาท', notes: 'คิดต่อรอบต่อห้อง ไม่ใช่ต่อชั่วโมง เป็นรูปแบบสกรีนกอล์ฟสไตล์เกาหลี' },
        { item: 'Phothalai Golf Park — เบย์ Trackman', price: '1,000 บาท/ชม.', notes: 'ราคาเดียวตลอด ตีลูกไม่จำกัด ห้อง VIP 1,500-2,000 บาท/ชม. Pradit Manutham เดินทางด้วยรถยนต์' },
        { item: 'Topgolf — จันทร์-อังคาร', price: '550-650 บาท/ชม.', notes: 'ผู้เล่นสูงสุด 6 คน Mega Bangna ยังไม่รวมค่าบริการและภาษีมูลค่าเพิ่ม (ประมาณ 17 เปอร์เซ็นต์)' },
        { item: 'Topgolf — ศุกร์-เสาร์ ช่วงพีค', price: '1,150-1,250 บาท/ชม.', notes: 'ผู้เล่นสูงสุด 6 คน ยังไม่รวมค่าบริการและภาษีมูลค่าเพิ่ม' },
        { item: 'Topgolf — ซ้อมคนเดียววันธรรมดา', price: '350 บาท/ชม.', notes: 'ผู้เล่น 1 คน จันทร์-ศุกร์ 9:00-17:00 น. ตีลูกไม่จำกัด ยังไม่รวมค่าบริการและภาษีมูลค่าเพิ่ม' },
      ],
      comparison_with_alternatives:
        'เวลาเทียบราคา ให้ดูเสมอว่ารวมภาษีแล้วหรือยัง LENGOLF และ Front 9 แจ้งราคาที่รวมภาษีมูลค่าเพิ่มแล้ว ส่วน Fairway Golf & City Club ยังไม่รวมภาษีมูลค่าเพิ่ม (บวกเพิ่มประมาณ 7 เปอร์เซ็นต์) และ Topgolf Megacity ยังไม่รวมทั้งค่าบริการและภาษีมูลค่าเพิ่ม (บวกเพิ่มประมาณ 17 เปอร์เซ็นต์) ราคาที่ประกาศไว้จึงต่ำกว่าที่คุณจ่ายจริงอยู่ 17 เปอร์เซ็นต์ ทำเลก็สำคัญเช่นกัน LENGOLF, Front 9, Fairway และ Groove & Grit อยู่บนเส้นทาง BTS และ MRT ใจกลางกรุงเทพฯ ขณะที่ Golfzon Bangna, Phothalai และ Topgolf Megacity ต้องเดินทางด้วยรถยนต์ราว 30-45 นาที สุดท้าย สตูดิโอที่เน้นการสอนหลายแห่งไม่ประกาศค่าเช่าเบย์เลย คุณต้องโทรหรือทัก LINE ไปสอบถามราคา',
      value_proposition:
        'LENGOLF มีค่าเช่าเบย์ต่ำที่สุดในใจกลางกรุงเทพฯ ที่ 550 บาทต่อชั่วโมง และมีราคาต่อคนต่ำที่สุดที่ 110 บาท (กลุ่ม 5 คน) พร้อมบริการเช่าไม้กอล์ฟมาตรฐานฟรี ไม่มีค่าสมัครสมาชิก และราคารวมภาษีแล้ว เห็นราคาเท่าไรก็จ่ายเท่านั้น',
      last_verified: '2026-07-26',
      venue_comparison: {
        venues: [
          {
            name: 'LENGOLF',
            location: 'Mercury Ville, BTS Chidlom',
            tech: 'Bravo',
            players_per_bay: 5,
            cheapest_rate: '550 บาท/ชม.',
            peak_rate: '950 บาท/ชม.',
            price_includes_tax: true,
            notes: 'รวมบริการเช่าไม้กอล์ฟมาตรฐานฟรี เปิดทุกวัน 9:00-23:00 น.',
          },
          {
            name: 'Front 9',
            location: 'Sukhumvit 47 (Rainhill)',
            tech: 'Trackman',
            players_per_bay: 4,
            cheapest_rate: '600 บาท/ชม.',
            peak_rate: '900 บาท/ชม. (ราคาโปรโมชัน)',
            price_includes_tax: true,
            notes: 'เบย์ส่วนตัวเพิ่ม 200 บาท/ชม. ผู้เล่นคนที่ 5 เป็นต้นไปเพิ่มคนละ 100 บาท/ชม. เปิด 10:00-22:00 น. (วันหยุดสุดสัปดาห์เปิด 9:00 น.)',
          },
          {
            name: 'Fairway Golf & City Club',
            location: 'Sukhumvit 24, BTS Phrom Phong',
            tech: 'Trackman',
            players_per_bay: 8,
            cheapest_rate: '1,000 บาท/ชม.',
            peak_rate: '1,200 บาท/ชม.',
            price_includes_tax: false,
            notes: 'ราคาเดียวตลอดวัน 1,000 บาท/ชม. วันจันทร์-พฤหัสบดี และ 1,200 บาท/ชม. วันศุกร์-อาทิตย์ และวันนักขัตฤกษ์ ยังไม่รวมภาษีมูลค่าเพิ่ม เปิด 8:00-02:00 น.',
          },
          {
            name: 'Groove & Grit',
            location: 'Supalai Icon Sathorn, MRT Lumphini',
            tech: 'Foresight Falcon',
            players_per_bay: null,
            cheapest_rate: 'ประมาณ 1,000 บาท/ชม.',
            peak_rate: 'ไม่ประกาศราคา',
            price_includes_tax: null,
            notes: 'สถานที่กอล์ฟและบาร์แห่งใหม่ย่านสาทร ช่วงเช้านอกเวลาพีคอยู่ที่ราว 1,000 บาท/ชม. เมื่อจองผ่านแอปพลิเคชัน แต่ยังไม่ได้ประกาศอัตราค่าบริการทั้งหมด เปิด 7:00-22:00 น.',
          },
          {
            name: 'Golfzon Bangna',
            location: 'Bangna-Trad Soi 23 (car access)',
            tech: 'Golfzon TwoVision',
            players_per_bay: 4,
            cheapest_rate: '400 บาท/ชม.',
            peak_rate: '600 บาท/ชม.',
            price_includes_tax: null,
            notes: 'สกรีนกอล์ฟสไตล์เกาหลี โหมดซ้อม 400 บาท/ชม. ก่อน 14:00 น. และ 600 บาท/ชม. หลังจากนั้น การออกรอบ 18 หลุมคิดเป็นรอบ (600-800 บาทต่อห้อง) เปิดถึงดึก',
          },
          {
            name: 'Phothalai Golf Park',
            location: 'Pradit Manutham Rd (car access)',
            tech: 'Trackman 4',
            players_per_bay: null,
            cheapest_rate: '1,000 บาท/ชม.',
            peak_rate: '1,000 บาท/ชม. (ราคาเดียว)',
            price_includes_tax: null,
            notes: 'เบย์ Trackman ในคอมเพล็กซ์สนามไดรฟ์และเวลเนสขนาดใหญ่ ตีลูกไม่จำกัด ห้อง VIP 1,500-2,000 บาท/ชม.',
          },
          {
            name: 'Topgolf Megacity',
            location: 'Mega Bangna (Bang Phli)',
            tech: 'Topgolf',
            players_per_bay: 6,
            cheapest_rate: '550 บาท/ชม.',
            peak_rate: '1,250 บาท/ชม.',
            price_includes_tax: false,
            notes: 'ราคายังไม่รวมค่าบริการและภาษีมูลค่าเพิ่ม (ประมาณ 17 เปอร์เซ็นต์) ไม่มีค่าสมัครสมาชิก อัตราซ้อมคนเดียววันธรรมดา 350 บาท/ชม. ห่างจากใจกลางกรุงเทพฯ ประมาณ 30-45 นาที',
          },
        ],
        summary:
          'ในแง่ความคุ้มค่าต่อคนในใจกลางกรุงเทพฯ LENGOLF ชนะขาดที่ 110 บาทต่อคน (ผู้เล่น 5 คน ช่วงนอกเวลาพีควันธรรมดา) คู่แข่งที่ใกล้เคียงที่สุดคือ Front 9 ที่ 150 บาทต่อคน (ผู้เล่น 4 คน) ส่วน Fairway Golf ปรับโครงสร้างราคาในปี 2026 ให้เหลือราคาเดียวคือ 1,000 บาท/ชม. วันจันทร์-พฤหัสบดี และ 1,200 บาท/ชม. วันศุกร์-อาทิตย์ (ยังไม่รวมภาษีมูลค่าเพิ่ม) ห้องที่รองรับได้ 8 คนช่วยให้ราคาต่อคนดีขึ้น แต่ราคาเริ่มต้นยังสูงเกือบสองเท่าของ LENGOLF ด้าน Golfzon Bangna มีอัตราซ้อมที่ประกาศไว้ถูกที่สุดในกรุงเทพฯ และปริมณฑล (400 บาท/ชม.) แต่ต้องเดินทางด้วยรถยนต์ไปย่านบางนา-ตราด และห้องรองรับได้ 4 คน ขณะที่ต้นทุนจริงของ Topgolf หลังบวกค่าบริการและภาษีมูลค่าเพิ่มอยู่ที่ราว 645-1,465 บาท/ชม. อีกทั้งทำเลย่านบางนายังเพิ่มทั้งเวลาและค่าเดินทางจากใจกลางกรุงเทพฯ',
      },
      sections: [
        {
          heading: 'LENGOLF: อัตราค่าบริการทั้งหมด',
          body: 'LENGOLF อยู่ที่ Mercury Ville เชื่อมต่อโดยตรงกับ BTS Chidlom (ทางออก 4) อัตราวันธรรมดา 550 บาท/ชั่วโมง ก่อน 14:00 น. และ 750 บาท/ชั่วโมง ตั้งแต่ 14:00-23:00 น. อัตราวันหยุดสุดสัปดาห์และวันนักขัตฤกษ์ 750 บาท/ชั่วโมง ก่อน 14:00 น. และ 950 บาท/ชั่วโมง ตั้งแต่ 14:00-23:00 น. ทุกราคาคิดต่อเบย์ (ผู้เล่นสูงสุด 5 คน) และรวมภาษีมูลค่าเพิ่มแล้ว ทุกการจองรวมบริการเช่าไม้กอล์ฟมาตรฐานฟรี ส่วนไม้กอล์ฟระดับพรีเมียม (Callaway, Majesty) เช่าได้เริ่มต้น 150 บาท/ชั่วโมง แพ็กเกจรายเดือนมี Bronze (5 ชั่วโมง 3,000 บาท) Silver (15 ชั่วโมง 8,000 บาท) Gold (30 ชั่วโมง 14,000 บาท) Diamond Unlimited (8,000 บาท/เดือน) และ Diamond+ Unlimited (18,000 บาท/3 เดือน) ส่วนแพ็กเกจ Early Bird (ใช้ได้ก่อน 14:00 น. เท่านั้น) อยู่ที่ 10 ชั่วโมง 4,800 บาท หรือไม่จำกัดชั่วโมง 5,000 บาท/เดือน',
        },
        {
          heading: 'Front 9: อัตราค่าบริการทั้งหมด',
          body: 'Front 9 อยู่ที่ Rainhill บนถนน Sukhumvit 47 ระหว่าง BTS Phrom Phong กับ Thong Lo อัตราวันธรรมดา 600 บาท/ชั่วโมง ก่อน 12:00 น. 700 บาท/ชั่วโมง ตั้งแต่ 12:00-17:00 น. และ 800 บาท/ชั่วโมง ตั้งแต่ 17:00-22:00 น. (ราคาโปรโมชัน ราคาปกติ 1,200 บาท) อัตราวันหยุดสุดสัปดาห์ 800 บาท/ชั่วโมง ก่อน 12:00 น. และ 900 บาท/ชั่วโมง ตั้งแต่ 12:00 น. เป็นต้นไป (ช่วงเย็นเป็นราคาโปรโมชัน ราคาปกติ 1,400 บาท) ทุกราคาคิดต่อเบย์ (ผู้เล่นสูงสุด 4 คน) และรวมภาษีมูลค่าเพิ่มแล้ว เบย์ส่วนตัวเพิ่ม 200 บาท/ชั่วโมง ผู้เล่นคนที่ 5 เป็นต้นไปเพิ่มคนละ 100 บาท/ชั่วโมง แพ็กเกจซ้อมมี Early Rise 10 ครั้ง ครั้งละ 1 ชั่วโมง (เฉพาะช่วงเช้า 5,490 บาท) Anytime 10 ครั้ง ครั้งละ 1 ชั่วโมง (6,990 บาท) 20 ครั้ง (12,900 บาท) และ 50 ครั้ง (29,900 บาท) ส่วนสมาชิกเริ่มต้นที่ 14,000 บาท (3 เดือน คนเดียว) ไปจนถึง 30,000 บาท (6 เดือน สูงสุด 4 คน) เปิด 10:00-22:00 น. วันธรรมดา และเปิด 9:00 น. ในวันหยุดสุดสัปดาห์ ใช้ระบบ Trackman',
        },
        {
          heading: 'Fairway Golf & City Club: อัตราค่าบริการทั้งหมด',
          body: 'Fairway Golf & City Club อยู่บนถนน Sukhumvit 24 ใกล้ BTS Phrom Phong ในปี 2026 ทางร้านปรับมาใช้ราคาเดียวคือ 1,000 บาท/ชั่วโมง ตลอดวันจันทร์-พฤหัสบดี และ 1,200 บาท/ชั่วโมง ในวันศุกร์-อาทิตย์ และวันนักขัตฤกษ์ ทุกราคาคิดต่อห้อง (ผู้เล่นสูงสุด 8 คน) และยังไม่รวมภาษีมูลค่าเพิ่ม เปิด 8:00 น. ถึงตี 2 ทุกวัน ซึ่งเป็นเวลาปิดที่ดึกที่สุดในบรรดาสถานที่กอล์ฟซิมูเลเตอร์ใจกลางกรุงเทพฯ แพ็กเกจแบบเหมาชั่วโมง (ปัจจุบันจัดโปรโมชันลด 30 เปอร์เซ็นต์) มี 5 ชั่วโมง 4,500 บาท 10 ชั่วโมง 7,700 บาท 25 ชั่วโมง 16,450 บาท และ 50 ชั่วโมง 28,700 บาท โดยมีอายุการใช้งาน 2 ถึง 12 เดือน ใช้ระบบ Trackman นอกจากนี้ Fairway ยังมีค็อกเทลบาร์ ดีเจในวันหยุดสุดสัปดาห์ และห้องที่ปรับเป็นห้องคาราโอเกะได้',
        },
        {
          heading: 'Groove & Grit: ซิมูเลเตอร์และบาร์แห่งใหม่ย่านสาทร',
          body: 'Groove & Grit Golf and Bar เปิดที่ Supalai Icon Sathorn (ใกล้ MRT Lumphini) และเป็นคอนเซ็ปต์ซิมูเลเตอร์ผสมบาร์ที่ใหม่ที่สุดในใจกลางกรุงเทพฯ ถือว่าใกล้เคียงกับ LENGOLF ที่สุดในแง่บรรยากาศ เพียงแต่อยู่ฝั่งสาทร เบย์ใช้เครื่องวัดวิถีลูก Foresight Falcon ร่วมกับ Swing Catalyst และกล้องความเร็วสูง พร้อมเลานจ์ไวน์และสุราระดับพรีเมียม และมีคอร์สเรียนกับโปร PGA ให้บริการ ช่วงเช้านอกเวลาพีคปรากฏราคาราว 1,000 บาท/ชั่วโมง บนแพลตฟอร์มจอง แต่ทางร้านไม่ได้ประกาศอัตราค่าบริการทั้งหมด จึงต้องติดต่อสอบถามราคาช่วงพีคโดยตรง เปิด 7:00-22:00 น. ทุกวัน',
        },
        {
          heading: 'Golfzon, Kakao Friends และสกรีนกอล์ฟสไตล์เกาหลี',
          body: 'กรุงเทพฯ มีสกรีนกอล์ฟสไตล์เกาหลีเพิ่มขึ้นเรื่อย ๆ โดยทั่วไปคิดราคาต่อการออกรอบ 18 หลุม แทนที่จะคิดเป็นรายชั่วโมง Golfzon Bangna (Bangna-Trad ซอย 23) ใช้ซิมูเลเตอร์ Golfzon TwoVision โหมดซ้อมอยู่ที่ 400 บาท/ชั่วโมง ก่อน 14:00 น. และ 600 บาท/ชั่วโมง หลังจากนั้น ส่วนการออกรอบ 18 หลุมอยู่ที่ 600-800 บาทต่อห้อง (ผู้เล่นสูงสุด 4 คน) และมีครัวเกาหลีในสถานที่ ด้าน Golfzon Park Sooho ที่ Market Place Ekkamai เปิด 9:00 น. ถึงตี 3 ซึ่งเป็นเวลาที่ดึกที่สุดในบรรดาสถานที่ซิมูเลเตอร์ในกรุงเทพฯ แต่แจ้งราคาทางโทรศัพท์เท่านั้น ขณะที่ Kakao Friends Screen Golf ที่ Suanplern Market (พระราม 4) นำเทคโนโลยี Friends Screen ของ Kakao VX มาใช้ และเปิดถึงตี 2 โดยประกาศราคาเฉพาะที่หน้าร้าน สถานที่เหล่านี้เหมาะกับนักกอล์ฟที่อยากได้รูปแบบการออกรอบสกรีนกอล์ฟเกาหลีแท้ ๆ แต่สำหรับการเล่นเป็นรายชั่วโมงกับกลุ่มเพื่อนในตัวเมือง สถานที่ที่อยู่ติดแนว BTS สะดวกกว่า',
        },
        {
          heading: 'Phothalai Golf Park: Trackman ในสนามไดรฟ์',
          body: 'Phothalai Golf Park บนถนน Pradit Manutham (แนวเอกมัย-รามอินทรา เดินทางด้วยรถยนต์) เป็นคอมเพล็กซ์สนามไดรฟ์กลางแจ้งและเวลเนสขนาดใหญ่ ซึ่งเบย์ Trackman 4 ในร่มให้เช่าในราคาเดียวคือ 1,000 บาทต่อชั่วโมง พร้อมตีลูกไม่จำกัด ไม่ว่าวันไหนหรือเวลาใด ส่วนห้อง VIP ขนาดเล็กและใหญ่อยู่ที่ 1,500 และ 2,000 บาท/ชั่วโมง เป็นตัวเลือกที่ดีหากคุณอยู่ฝั่งตะวันออกของเมืองและอยากได้ข้อมูลจาก Trackman โดยไม่ต้องฝ่ารถติดเข้าใจกลางกรุงเทพฯ แต่ไม่มี BTS เข้าถึง และบรรยากาศเป็นสถานที่ซ้อมมากกว่าที่เที่ยวยามค่ำคืน',
        },
        {
          heading: 'Topgolf Megacity: อัตราค่าบริการทั้งหมด',
          body: 'Topgolf Megacity อยู่ที่บางพลี ใกล้ Mega Bangna ห่างจากใจกลางกรุงเทพฯ ราว 30-45 นาทีโดยรถยนต์ ประสบการณ์ที่นี่ต่างจากบาร์ซิมูเลเตอร์ข้างต้นมาก เพราะเป็นสนามไดรฟ์กลางแจ้งหลายชั้นพร้อมเกมยิงเป้า ไม่ใช่กอล์ฟซิมูเลเตอร์ในห้องปิดแบบดั้งเดิม อัตราเบย์มาตรฐาน จันทร์-อังคาร 550-650 บาท/ชั่วโมง พุธ-พฤหัสบดี 550-850 บาท/ชั่วโมง ศุกร์ 550-1,150 บาท/ชั่วโมง เสาร์ 850-1,250 บาท/ชั่วโมง และอาทิตย์ 850-1,150 บาท/ชั่วโมง ผู้เล่นคนเดียวซ้อมได้ในราคา 350 บาท/ชั่วโมง ในวันธรรมดาก่อน 17:00 น. ส่วนเบย์ VIP (สูงสุด 12 คน) อยู่ที่ 1,700-3,200 บาท/ชั่วโมง ทุกราคายังไม่รวมค่าบริการ 10 เปอร์เซ็นต์ และภาษีมูลค่าเพิ่ม 7 เปอร์เซ็นต์ จึงต้องบวกเพิ่มจากราคาที่ประกาศไว้ราว 17 เปอร์เซ็นต์ ปัจจุบันไม่มีค่าสมัครสมาชิกแล้ว และนักเรียนนักศึกษา (อายุไม่เกิน 23 ปี พร้อมบัตรประจำตัว) ได้ส่วนลด 50 เปอร์เซ็นต์ ทั้งค่าเล่น อาหาร และเครื่องดื่มในวันธรรมดา เปิด 9:00-23:00 น. วันอาทิตย์ถึงพฤหัสบดี และเปิดถึงเที่ยงคืนในวันศุกร์และเสาร์',
        },
        {
          heading: 'สตูดิโอสอนกอล์ฟที่ไม่ประกาศค่าเช่าเบย์',
          body: 'สตูดิโอกอล์ฟในร่มหลายแห่งในกรุงเทพฯ ที่มีอุปกรณ์ครบครันเน้นงานสอนหรือฟิตติ้งไม้กอล์ฟ และไม่ประกาศค่าเช่าเบย์รายชั่วโมง คุณจึงต้องโทรหรือทัก LINE ไปขอราคา สถานที่เหล่านี้ได้แก่ PING Indoor Golf Centre (Sukhumvit 24 ใช้ Foresight GCQuad และ GC3) Golf Swing Academy Bangkok (Sukhumvit 26 บริหารโดยชาวญี่ปุ่น ใช้เบย์ Foresight) Home of Golf (Sukhumvit 26 และพระราม 2 ใช้ Trackman) Swing Kings Golf BKK (อโศก ใช้ Trackman ร่วมกับ Foresight) และ Bangkok Golf Centre (ถนนวิทยุ 15 เบย์) ทั้งหมดยอดเยี่ยมสำหรับการเรียนอย่างเป็นระบบและการฟิตติ้งไม้ แต่สำหรับคนที่อยากเดินเข้าไปเล่นกับเพื่อน ราคาของพวกเขาไม่โปร่งใส ซึ่งเป็นเหตุผลที่การเทียบราคาครั้งนี้เน้นเฉพาะสถานที่ที่ประกาศราคาไว้ชัดเจน',
        },
        {
          heading: 'ที่ไหนเหมาะกับคุณที่สุด',
          body: 'เลือก LENGOLF หากคุณต้องการความคุ้มค่าที่สุดในใจกลางกรุงเทพฯ ทั้งราคาต่อคนต่ำสุด ไม้กอล์ฟฟรี เดินทางด้วย BTS ได้ และมีบรรยากาศบาร์ให้สังสรรค์ เลือก Front 9 หากคุณเป็นนักกอล์ฟจริงจังที่ให้ความสำคัญกับข้อมูลจาก Trackman และอยู่ใกล้ Sukhumvit 47 เลือก Fairway Golf & City Club สำหรับการเล่นดึก (เปิดถึงตี 2) กับกลุ่มใหญ่สูงสุด 8 คน หากไม่ติดที่ราคาสูงกว่า เลือก Groove & Grit หากคุณอยู่ฝั่งสาทรและอยากได้ระบบ Foresight ระดับพรีเมียมพร้อมไวน์บาร์ เลือก Golfzon Bangna หรือ Kakao Friends หากอยากได้รูปแบบการออกรอบสกรีนกอล์ฟเกาหลีแท้ ๆ เลือก Phothalai หากคุณอยู่ฝั่งตะวันออก มีรถยนต์ และอยากซ้อมกับ Trackman ในราคาเดียวตลอด และเลือก Topgolf Megacity หากคุณอยากได้ประสบการณ์แบบ Topgolf ซึ่งเป็นสนามไดรฟ์กลางแจ้งพร้อมเกม อาหาร และบรรยากาศปาร์ตี้ โดยไม่ติดขัดเรื่องการเดินทางไปบางนา',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'B',
          text: 'Happy to have found a great screen golf spot in BKK! The staff were super kind and spoke good English. The machines are new, and the rates are really reasonable especially if you go for the unlimited morning plan.',
        },
        {
          reviewer_name: 'tttnatorn',
          text: 'Great spot for a golf sim! Accurate tracking, good vibes, and helpful staff. Fair prices too. Perfect for practice or a fun round.',
        },
        {
          reviewer_name: 'Chidbhan T.',
          text: 'Lengolf is a hidden gem right in the heart of Bangkok — super convenient location! The simulator is modern, high-quality, and incredibly accurate. Prices are very reasonable for the top-notch experience you get.',
        },
      ],
    },
  },

  // ─── JA: golf-simulator-prices-bangkok ───
  // The batch's largest entry (9 sections, 16 price rows, 7 venues). The
  // ' — ' separator in price_breakdown[].item is LOAD-BEARING: groupPriceRows()
  // in components/prices/PriceGuidePage.tsx splits on it and tints the LENGOLF
  // group, so every venue prefix stays verbatim Latin and only the text after
  // the em dash is translated. venue names/tech verbatim; 'Not published' →
  // 非公表, '(flat)' → （一律）, '(promo)' → （プロモ）— numerals untouched.
  // price_includes_tax null (Groove & Grit / Golfzon / Phothalai) is carried as
  // null and never described as "tax excluded" in the notes. This entry's own
  // last_verified is 2026-07-26, so its as-of marker is （2026年7月現在）.
  {
    id: 'price-2-ja',
    page_type: 'price_guide',
    slug: 'golf-simulator-prices-bangkok',
    title: 'バンコクのゴルフシミュレーター料金を比較（2026年）',
    meta_description:
      'バンコクのゴルフシミュレーター料金を比較（2026年7月現在）。LENGOLFは1時間550THBから。Front 9、Fairway、Groove & Grit、Golfzon、Phothalai、Topgolfの公表レートを再確認してまとめました。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'ja',
    related_slugs: ['/cost/how-much-does-golf-cost-bangkok', '/cost/lengolf-pricing-guide', '/faq/how-much-does-indoor-golf-cost-in-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        'バンコクのゴルフシミュレーター料金は、施設・時間帯・曜日によって1ベイ1時間あたりおよそ400〜1,400THBです。市内中心部では1ベイ1時間550〜1,200THBが目安で、LENGOLFは最大5名で1時間550THBから。以下はバンコクの主要なシミュレーター施設を正直に比較したもので、掲載しているレートはすべて2026年7月に各施設の公表価格をもとに再確認しています（2026年7月現在）。',
      price_breakdown: [
        { item: 'LENGOLF — 平日14:00まで', price: '1時間550THB', notes: '最大5名。標準クラブ無料。BTSチットロム。VAT込み。' },
        { item: 'LENGOLF — 平日14:00〜23:00', price: '1時間750THB', notes: '最大5名。標準クラブ無料。VAT込み。' },
        { item: 'LENGOLF — 週末・祝日', price: '1時間750〜950THB', notes: '金〜日と祝日。最大5名。VAT込み。' },
        { item: 'Front 9 — 平日12:00まで', price: '1時間600THB', notes: '最大4名。Trackman。Sukhumvit 47。VAT込み。' },
        { item: 'Front 9 — 平日12:00〜17:00', price: '1時間700THB', notes: '最大4名。VAT込み。' },
        { item: 'Front 9 — 平日17:00〜22:00（プロモ）', price: '1時間800THB', notes: 'プロモ料金（通常は1,200THB）。VAT込み。' },
        { item: 'Front 9 — 週末', price: '1時間800〜900THB', notes: '夜の枠はプロモ料金（通常は1,400THB）。プライベートベイは1時間あたり200THB増し。VAT込み。' },
        { item: 'Fairway Golf — 月〜木（終日）', price: '1時間1,000THB', notes: '最大8名。Trackman。Sukhumvit 24。VAT別。営業は翌2:00まで。' },
        { item: 'Fairway Golf — 金〜日と祝日', price: '1時間1,200THB', notes: '最大8名。VAT別。' },
        { item: 'Groove & Grit — Sathorn', price: '1時間約1,000THB', notes: 'Foresight Falcon。Supalai Icon Sathorn。料金表の全体は公表されていないため、LINEや予約アプリから確認してください。' },
        { item: 'Golfzon Bangna — 練習モード', price: '1時間400〜600THB', notes: '最大4名。14:00までは1時間400THB、以降は600THB。Bangna-Trad 23、車でのアクセス。' },
        { item: 'Golfzon Bangna — 18ホールラウンド', price: '600〜800THB', notes: '時間制ではなく1ルーム1ラウンドあたり。韓国式スクリーンゴルフの形式です。' },
        { item: 'Phothalai Golf Park — Trackmanベイ', price: '1時間1,000THB', notes: '一律料金でボール無制限。VIPルームは1時間1,500〜2,000THB。Pradit Manutham、車でのアクセス。' },
        { item: 'Topgolf — 月〜火', price: '1時間550〜650THB', notes: '最大6名。Mega Bangna。サービスチャージとVAT（約17%）は別途。' },
        { item: 'Topgolf — 金〜土のピーク時', price: '1時間1,150〜1,250THB', notes: '最大6名。サービスチャージとVATは別途。' },
        { item: 'Topgolf — 平日のソロ練習', price: '1時間350THB', notes: '1名、月〜金9:00〜17:00、ボール無制限。サービスチャージとVATは別途。' },
      ],
      comparison_with_alternatives:
        '料金を比べるときは、税込みかどうかを必ず確認してください。LENGOLFとFront 9はVAT込みの価格を表示しています。Fairway Golf & City ClubはVAT別（約7%を加算）、Topgolf MegacityはサービスチャージとVATの両方が別途（約17%を加算）で、表示レートは実際に支払う額より17%ほど低く見えます。立地も判断材料になります。LENGOLF、Front 9、Fairway、Groove & Gritはいずれもバンコク中心部のBTS・MRT沿線ですが、Golfzon Bangna、Phothalai、Topgolf Megacityは車で30〜45分の郊外にあります。なお、レッスン主体のスタジオではベイ料金を公表していないところも多く、見積もりは電話やLINEでの問い合わせが必要です。',
      value_proposition:
        'LENGOLFはバンコク中心部で最も低いベイ料金（1時間550THB）と、最も低い1人あたり料金（5名利用で110THB）でご利用いただけます。標準クラブのレンタルは無料、入会金もなく、価格は税込み。表示どおりの金額でお支払いいただけます。',
      last_verified: '2026-07-26',
      venue_comparison: {
        venues: [
          {
            name: 'LENGOLF',
            location: 'Mercury Ville, BTS Chidlom',
            tech: 'Bravo',
            players_per_bay: 5,
            cheapest_rate: '1時間550THB',
            peak_rate: '1時間950THB',
            price_includes_tax: true,
            notes: '標準クラブのレンタルが無料で付属。毎日9:00〜23:00営業。',
          },
          {
            name: 'Front 9',
            location: 'Sukhumvit 47 (Rainhill)',
            tech: 'Trackman',
            players_per_bay: 4,
            cheapest_rate: '1時間600THB',
            peak_rate: '1時間900THB（プロモ）',
            price_includes_tax: true,
            notes: 'プライベートベイは1時間あたり200THB増し。5人目からは1名につき1時間あたり100THB増し。営業時間10:00〜22:00（週末は9:00から）。',
          },
          {
            name: 'Fairway Golf & City Club',
            location: 'Sukhumvit 24, BTS Phrom Phong',
            tech: 'Trackman',
            players_per_bay: 8,
            cheapest_rate: '1時間1,000THB',
            peak_rate: '1時間1,200THB',
            price_includes_tax: false,
            notes: '一律料金で、月〜木は1時間1,000THB、金〜日と祝日は1時間1,200THB。VAT別。営業時間8:00〜翌2:00。',
          },
          {
            name: 'Groove & Grit',
            location: 'Supalai Icon Sathorn, MRT Lumphini',
            tech: 'Foresight Falcon',
            players_per_bay: null,
            cheapest_rate: '1時間約1,000THB',
            peak_rate: '非公表',
            price_includes_tax: null,
            notes: 'サトーンに開業した、ゴルフとバーを兼ねた新しい施設。予約アプリ経由のオフピークの午前枠が1時間1,000THB前後で出ていますが、料金表の全体は公表されていません。営業時間7:00〜22:00。',
          },
          {
            name: 'Golfzon Bangna',
            location: 'Bangna-Trad Soi 23（車でのアクセス）',
            tech: 'Golfzon TwoVision',
            players_per_bay: 4,
            cheapest_rate: '1時間400THB',
            peak_rate: '1時間600THB',
            price_includes_tax: null,
            notes: '韓国式スクリーンゴルフ。練習モードは14:00までが1時間400THB、以降は1時間600THB。18ホールラウンドはラウンド単位の料金（1ルーム600〜800THB）。夜遅くまで営業しています。',
          },
          {
            name: 'Phothalai Golf Park',
            location: 'Pradit Manutham Rd（車でのアクセス）',
            tech: 'Trackman 4',
            players_per_bay: null,
            cheapest_rate: '1時間1,000THB',
            peak_rate: '1時間1,000THB（一律）',
            price_includes_tax: null,
            notes: '大型のドライビングレンジとウェルネス複合施設のなかにあるTrackmanベイ。ボール無制限。VIPルームは1時間1,500〜2,000THB。',
          },
          {
            name: 'Topgolf Megacity',
            location: 'Mega Bangna (Bang Phli)',
            tech: 'Topgolf',
            players_per_bay: 6,
            cheapest_rate: '1時間550THB',
            peak_rate: '1時間1,250THB',
            price_includes_tax: false,
            notes: 'サービスチャージとVAT（合わせて約17%）は別途。入会金なし。平日ソロ練習は1時間350THB。バンコク中心部からは30〜45分の距離です。',
          },
        ],
        summary:
          'バンコク中心部で1人あたりの価値を見るなら、LENGOLFが明確に有利です（5名・平日オフピークで1人110THB）。最も近い競合はFront 9で、1人150THB（4名）。Fairway Golfは2026年に料金を整理し、月〜木は一律1時間1,000THB、金〜日は1時間1,200THB（いずれもVAT別）になりました。8名まで入れる部屋は1人あたりのコストを下げますが、基本レートはLENGOLFのほぼ倍です。Golfzon Bangnaはバンコク近郊で最も安い練習レート（1時間400THB）を公表しているものの、Bangna-Tradにある車でのアクセスとなる施設で、部屋は4名まで。Topgolfの実質コストはサービスチャージとVATを加えるとおよそ1時間645〜1,465THBで、Bangnaという立地から中心部との往復にかかる時間と費用も加わります。',
      },
      sections: [
        {
          heading: 'LENGOLF — 料金表のすべて',
          body: 'LENGOLFはザ・マーキュリービル内にあり、BTSチットロム駅（4番出口）から直結しています。平日は14:00までが1時間550THB、14:00〜23:00が1時間750THB。週末と祝日は14:00までが1時間750THB、14:00〜23:00が1時間950THB。すべて1ベイあたり（最大5名）の料金で、VAT込みです。標準クラブのレンタルはご予約ごとに無料で付属します。プレミアムクラブのレンタル（Callaway、Majesty（マジェスティ））は1時間150THBから。月額パッケージはBronze（5時間・3,000THB）、Silver（15時間・8,000THB）、Gold（30時間・14,000THB）、Diamond Unlimited（月額8,000THB）、Diamond+ Unlimited（3か月18,000THB）。Early Birdパッケージ（14:00までの利用限定）は10時間4,800THB、または月額5,000THBの無制限プランです。',
        },
        {
          heading: 'Front 9 — 料金表のすべて',
          body: 'Front 9はSukhumvit 47のRainhill内、BTSプロンポン駅とトンロー駅の間にあります。平日は12:00までが1時間600THB、12:00〜17:00が1時間700THB、17:00〜22:00が1時間800THB（プロモ料金で、通常は1,200THB）。週末は12:00までが1時間800THB、12:00以降が1時間900THB（夜の枠はプロモ料金で、通常は1,400THB）。すべて1ベイあたり（最大4名）の料金で、VAT込みです。プライベートベイは1時間あたり200THB増し、5人目からは1名につき1時間あたり100THB増しになります。練習パッケージはEarly Rise 10回1時間（午前限定、5,490THB）、Anytime 10回1時間（6,990THB）、20回1時間（12,900THB）、50回1時間（29,900THB）。メンバーシップは14,000THB（3か月・1名）から30,000THB（6か月・最大4名）まで。営業時間は平日10:00〜22:00、週末は9:00から。Trackmanを採用しています。',
        },
        {
          heading: 'Fairway Golf & City Club — 料金表のすべて',
          body: 'Fairway Golf & City ClubはSukhumvit 24、BTSプロンポン駅の近くにあります。2026年に料金を一律制へ整理し、月〜木は終日1時間1,000THB、金〜日と祝日は1時間1,200THB。すべて1ルームあたり（最大8名）の料金で、VAT別です。営業は毎日8:00から翌2:00まで——バンコク中心部のシミュレーター施設では最も遅い閉店時刻です。時間バンドルのパッケージ（現在30%オフで販売中）は5時間4,500THB、10時間7,700THB、25時間16,450THB、50時間28,700THBで、有効期限は2か月から12か月。Trackmanを採用しています。カクテルバーがあり、週末はDJが入るほか、カラオケに切り替えられる部屋もあります。',
        },
        {
          heading: 'Groove & Grit — サトーンに開業した新しいシミュレーターバー',
          body: 'Groove & Grit Golf and BarはSupalai Icon Sathorn（MRTルンピニー駅近く）に開業した、バンコク中心部では最も新しいシミュレーター併設バーです。コンセプトとしてはLENGOLFに最も近く、ただし場所はサトーン側。ベイにはForesight Falconの弾道計測器とSwing Catalyst、ハイスピードカメラが入り、ワインとプレミアムスピリッツのラウンジ、PGAプロによるレッスンも用意されています。予約プラットフォーム上ではオフピークの午前枠が1時間1,000THB前後で出ていますが、料金表の全体は公表されていないため、ピーク時の価格は直接問い合わせが必要です。営業時間は毎日7:00〜22:00。',
        },
        {
          heading: 'Golfzon、Kakao Friendsと韓国式スクリーンゴルフ',
          body: 'バンコクでは韓国式スクリーンゴルフが広がりつつあり、料金は時間制ではなく18ホール1ラウンド単位が一般的です。Golfzon Bangna（Bangna-Trad Soi 23）はGolfzon TwoVisionを導入しており、練習モードは14:00までが1時間400THB、以降は1時間600THB。18ホールラウンドは1ルーム（最大4名）600〜800THBで、韓国料理のキッチンも併設しています。Market Place Ekkamai内のGolfzon Park Soohoは9:00から翌3:00まで営業——バンコクのシミュレーター施設では最も遅い時間帯までですが、料金は電話でのみ案内しています。Suanplern Market（Rama IV）のKakao Friends Screen GolfはKakao VXのFriends Screenを導入し、翌2:00まで営業。料金は店頭のみの掲示です。これらは韓国式のラウンド形式をそのまま楽しみたい方に向いた施設で、市内中心部で時間単位に気軽に遊ぶなら、BTS沿線の施設のほうが便利です。',
        },
        {
          heading: 'Phothalai Golf Park — ドライビングレンジで使うTrackman',
          body: 'Pradit Manutham Road沿い（エカマイからラムイントラに抜ける道路沿いで、車でのアクセス）のPhothalai Golf Parkは、大型の屋外ドライビングレンジとウェルネスの複合施設です。屋内のTrackman 4ベイは曜日や時間を問わず一律1時間1,000THB、ボール無制限で利用できます。VIPルームは小が1時間1,500THB、大が1時間2,000THB。バンコク東側にお住まいで、中心部の渋滞を避けながらTrackmanのデータを取りたい方には有力な選択肢です。ただしBTSでのアクセスはなく、雰囲気は夜の遊び場というより練習施設寄りになります。',
        },
        {
          heading: 'Topgolf Megacity — 料金表のすべて',
          body: 'Topgolf MegacityはMega Bangna近くのBang Phliにあり、バンコク中心部から車でおよそ30〜45分です。ここまでに挙げたシミュレーターバーとはかなり性格が異なり、的当てゲームを備えた屋外の多層式ドライビングレンジで、囲われた従来型のゴルフシミュレーターではありません。標準ベイの料金は月〜火が1時間550〜650THB、水〜木が1時間550〜850THB、金が1時間550〜1,150THB、土が1時間850〜1,250THB、日が1時間850〜1,150THB。1名での練習は平日17:00までなら1時間350THB。VIPベイ（最大12名）は1時間1,700〜3,200THB。表示価格はいずれも10%のサービスチャージと7%のVATが別で、実際には約17%を上乗せして考えてください。入会金は現在ありません。23歳以下の学生は身分証の提示で、平日のプレーとフード、ドリンクが50%オフになります。営業時間は日〜木9:00〜23:00、金土は翌0:00まで。',
        },
        {
          heading: 'ベイ料金を公表していないレッスンスタジオ',
          body: 'バンコクには設備の整ったインドアゴルフスタジオがいくつもありますが、アカデミー主体・フィッティング主体の施設は時間あたりのベイ料金を公表しておらず、見積もりは電話やLINEでの問い合わせになります。PING Indoor Golf Centre（Sukhumvit 24、Foresight GCQuad/GC3）、Golf Swing Academy Bangkok（Sukhumvit 26、日本人経営、Foresightのベイ）、Home of Golf（Sukhumvit 26およびRama 2、Trackman）、Swing Kings Golf BKK（アソーク、TrackmanとForesight）、Bangkok Golf Centre（Wireless Road、15ベイ）などが該当します。体系的なコーチングやクラブフィッティングには適していますが、ふらりと立ち寄って遊ぶ用途では価格が読めません。この比較で公表レートのある施設を中心に扱っているのは、まさにそのためです。',
        },
        {
          heading: 'どの施設が合っているか',
          body: 'バンコク中心部でいちばん割に合う選択をしたいならLENGOLF——1人あたりのコストが最も低く、クラブは無料、BTSでアクセスでき、バーの雰囲気もあります。Trackmanのデータを重視する本格派で、Sukhumvit 47の近くにお住まいならFront 9。最大8名で深夜まで（翌2:00まで営業）遊びたく、料金が上がっても構わないならFairway Golf & City Club。サトーン側にいてForesightの上位環境とワインバーを求めるならGroove & Grit。韓国式のラウンド形式を味わいたいならGolfzon BangnaやKakao Friends。東側にお住まいで車があり、一律料金でTrackmanの練習をしたいならPhothalai。そしてTopgolfならではの体験——ゲーム性のある屋外レンジ、フード、にぎやかな雰囲気——を求めていて、Bangnaまでの移動が苦にならないならTopgolf Megacityです。',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'B',
          text: 'Happy to have found a great screen golf spot in BKK! The staff were super kind and spoke good English. The machines are new, and the rates are really reasonable especially if you go for the unlimited morning plan.',
        },
        {
          reviewer_name: 'tttnatorn',
          text: 'Great spot for a golf sim! Accurate tracking, good vibes, and helpful staff. Fair prices too. Perfect for practice or a fun round.',
        },
        {
          reviewer_name: 'Chidbhan T.',
          text: 'Lengolf is a hidden gem right in the heart of Bangkok — super convenient location! The simulator is modern, high-quality, and incredibly accurate. Prices are very reasonable for the top-notch experience you get.',
        },
      ],
    },
  },

  // ─── KO: golf-simulator-prices-bangkok ───
  // The batch's largest entry (9 sections, 16 price rows, 7-venue comparison). Every
  // rate, package, opening hour and venue name carried verbatim from the EN entry;
  // this page's own as-of is July 2026 (last_verified 2026-07-26), so the marker
  // reads (2026년 7월 기준) — unlike its five siblings, which are February.
  // price_breakdown items keep the EN ' — ' venue prefix byte-identical (LENGOLF /
  // Front 9 / Fairway Golf / Groove & Grit / Golfzon Bangna / Phothalai Golf Park /
  // Topgolf), because components/prices/PriceGuidePage.tsx groups rows on that exact
  // separator and tints the LENGOLF block by string equality. Korean particles after
  // Latin venue names follow the KO reading (Front 9은, Topgolf는, ...Club은).
  // related_slugs unchanged — all four EN targets are KO-translated after this batch.
  {
    id: 'price-2-ko',
    page_type: 'price_guide',
    slug: 'golf-simulator-prices-bangkok',
    title: '방콕 골프 시뮬레이터 요금 비교 (2026년)',
    meta_description:
      '방콕 골프 시뮬레이터 요금 비교 (2026년 7월 기준). LENGOLF 시간당 550바트부터, Front 9, Fairway, Groove & Grit, Golfzon, Phothalai, Topgolf 요금을 한자리에 정리했어요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'ko',
    related_slugs: ['/cost/how-much-does-golf-cost-bangkok', '/cost/lengolf-pricing-guide', '/faq/how-much-does-indoor-golf-cost-in-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        '방콕의 골프 시뮬레이터 요금은 매장과 시간대, 요일에 따라 베이당 시간당 약 400~1,400바트예요. 도심이라면 베이당 시간당 550~1,200바트 정도를 생각하시면 되고, LENGOLF는 최대 5명까지 시간당 550바트부터예요. 아래는 방콕의 주요 시뮬레이터 매장을 있는 그대로 비교한 내용이고, 모든 요금은 각 매장이 공개한 요금표로 2026년 7월에 다시 확인했어요.',
      price_breakdown: [
        { item: 'LENGOLF — 평일 14:00 이전', price: '550바트/시간', notes: '최대 5명. 기본 클럽 무료. BTS 칫롬역. VAT 포함.' },
        { item: 'LENGOLF — 평일 14:00~23:00', price: '750바트/시간', notes: '최대 5명. 기본 클럽 무료. VAT 포함.' },
        { item: 'LENGOLF — 주말·공휴일', price: '750~950바트/시간', notes: '금~일요일과 공휴일. 최대 5명. VAT 포함.' },
        { item: 'Front 9 — 평일 12:00 이전', price: '600바트/시간', notes: '최대 4명. Trackman. Sukhumvit 47. VAT 포함.' },
        { item: 'Front 9 — 평일 12:00~17:00', price: '700바트/시간', notes: '최대 4명. VAT 포함.' },
        { item: 'Front 9 — 평일 17:00~22:00 (프로모션)', price: '800바트/시간', notes: '프로모션 요금 (정상가 1,200바트). VAT 포함.' },
        { item: 'Front 9 — 주말', price: '800~900바트/시간', notes: '저녁 시간대는 프로모션 요금 (정상가 1,400바트). 프라이빗 베이는 시간당 200바트 추가. VAT 포함.' },
        { item: 'Fairway Golf — 월~목요일 (종일)', price: '1,000바트/시간', notes: '최대 8명. Trackman. Sukhumvit 24. VAT 별도. 새벽 2시까지 영업.' },
        { item: 'Fairway Golf — 금~일요일·공휴일', price: '1,200바트/시간', notes: '최대 8명. VAT 별도.' },
        { item: 'Groove & Grit — 사톤', price: '약 1,000바트/시간', notes: 'Foresight Falcon. Supalai Icon Sathorn. 전체 요금표는 공개돼 있지 않아서 LINE이나 예약 앱으로 문의해야 해요.' },
        { item: 'Golfzon Bangna — 연습 모드', price: '400~600바트/시간', notes: '최대 4명. 14:00 이전 시간당 400바트, 이후 600바트. Bangna-Trad 23, 차량 이용.' },
        { item: 'Golfzon Bangna — 18홀 라운드', price: '600~800바트', notes: '시간당이 아니라 룸당 1라운드 요금이에요. 한국식 스크린골프 방식.' },
        { item: 'Phothalai Golf Park — Trackman 베이', price: '1,000바트/시간', notes: '균일 요금, 볼 무제한. VIP 룸은 시간당 1,500~2,000바트. Pradit Manutham, 차량 이용.' },
        { item: 'Topgolf — 월~화요일', price: '550~650바트/시간', notes: '최대 6명. Mega Bangna. 서비스 차지와 VAT(약 17%) 별도.' },
        { item: 'Topgolf — 금~토요일 피크', price: '1,150~1,250바트/시간', notes: '최대 6명. 서비스 차지와 VAT 별도.' },
        { item: 'Topgolf — 평일 1인 연습', price: '350바트/시간', notes: '1명, 월~금요일 9:00~17:00, 볼 무제한. 서비스 차지와 VAT 별도.' },
      ],
      comparison_with_alternatives:
        '요금을 비교할 때는 세금이 포함됐는지부터 확인하세요. LENGOLF와 Front 9은 VAT가 포함된 금액을 안내해요. Fairway Golf & City Club은 VAT가 별도라 약 7%를 더해야 하고, Topgolf Megacity는 서비스 차지와 VAT가 모두 별도라 약 17%를 더해야 해요. 그래서 Topgolf의 표시 요금은 실제로 내는 금액보다 17% 낮아요. 위치도 중요해요. LENGOLF, Front 9, Fairway, Groove & Grit은 모두 도심 BTS·MRT 노선 위에 있고, Golfzon Bangna와 Phothalai, Topgolf Megacity는 30~45분 떨어진 차량 접근 매장이에요. 마지막으로, 레슨 중심 스튜디오 중에는 베이 요금을 아예 공개하지 않는 곳이 많아서 전화나 LINE으로 문의해야 견적을 받을 수 있어요.',
      value_proposition:
        'LENGOLF는 방콕 도심에서 베이 요금이 시간당 550바트로 가장 낮고, 1인당 요금도 5명이 이용하면 110바트로 가장 저렴해요. 기본 클럽 대여가 무료고 가입비도 없으며 세금이 포함된 금액이라, 보이는 금액이 곧 내는 금액이에요.',
      last_verified: '2026-07-26',
      venue_comparison: {
        venues: [
          {
            name: 'LENGOLF',
            location: 'Mercury Ville, BTS 칫롬역',
            tech: 'Bravo',
            players_per_bay: 5,
            cheapest_rate: '550바트/시간',
            peak_rate: '950바트/시간',
            price_includes_tax: true,
            notes: '기본 클럽 대여 무료 포함. 매일 9:00~23:00 영업.',
          },
          {
            name: 'Front 9',
            location: 'Sukhumvit 47 (Rainhill)',
            tech: 'Trackman',
            players_per_bay: 4,
            cheapest_rate: '600바트/시간',
            peak_rate: '900바트/시간 (프로모션)',
            price_includes_tax: true,
            notes: '프라이빗 베이는 시간당 200바트 추가. 5번째 인원부터 1인당 시간당 100바트 추가. 10:00~22:00 영업 (주말은 9:00부터).',
          },
          {
            name: 'Fairway Golf & City Club',
            location: 'Sukhumvit 24, BTS Phrom Phong',
            tech: 'Trackman',
            players_per_bay: 8,
            cheapest_rate: '1,000바트/시간',
            peak_rate: '1,200바트/시간',
            price_includes_tax: false,
            notes: '균일 요금으로 월~목요일 시간당 1,000바트, 금~일요일과 공휴일 시간당 1,200바트예요. VAT 별도. 8:00~02:00 영업.',
          },
          {
            name: 'Groove & Grit',
            location: 'Supalai Icon Sathorn, MRT Lumphini',
            tech: 'Foresight Falcon',
            players_per_bay: null,
            cheapest_rate: '약 1,000바트/시간',
            peak_rate: '미공개',
            price_includes_tax: null,
            notes: '사톤에 새로 생긴 골프 앤드 바. 예약 앱에서 오전 비혼잡 시간대가 시간당 1,000바트 안팎으로 나오고, 전체 요금표는 공개돼 있지 않아요. 7:00~22:00 영업.',
          },
          {
            name: 'Golfzon Bangna',
            location: 'Bangna-Trad Soi 23 (차량 이용)',
            tech: 'Golfzon TwoVision',
            players_per_bay: 4,
            cheapest_rate: '400바트/시간',
            peak_rate: '600바트/시간',
            price_includes_tax: null,
            notes: '한국식 스크린골프. 연습 모드는 14:00 이전 시간당 400바트, 이후 600바트. 18홀 라운드는 룸당 600~800바트로 라운드 단위 요금이에요. 늦게까지 영업해요.',
          },
          {
            name: 'Phothalai Golf Park',
            location: 'Pradit Manutham Rd (차량 이용)',
            tech: 'Trackman 4',
            players_per_bay: null,
            cheapest_rate: '1,000바트/시간',
            peak_rate: '1,000바트/시간 (균일)',
            price_includes_tax: null,
            notes: '대형 드라이빙 레인지와 웰니스 복합시설 안의 Trackman 베이예요. 볼 무제한. VIP 룸은 시간당 1,500~2,000바트.',
          },
          {
            name: 'Topgolf Megacity',
            location: 'Mega Bangna (Bang Phli)',
            tech: 'Topgolf',
            players_per_bay: 6,
            cheapest_rate: '550바트/시간',
            peak_rate: '1,250바트/시간',
            price_includes_tax: false,
            notes: '표시 요금에 서비스 차지와 VAT(약 17%)는 빠져 있어요. 가입비는 없어요. 평일 1인 연습 요금은 시간당 350바트. 방콕 도심에서 30~45분 거리예요.',
          },
        ],
        summary:
          '방콕 도심에서 1인당 가치로 보면 LENGOLF가 확실히 앞서요. 평일 비혼잡 시간대에 5명이 이용하면 1인당 110바트예요. 가장 가까운 경쟁자는 4명이 이용할 때 1인당 150바트인 Front 9이에요. Fairway Golf는 2026년에 요금 체계를 월~목요일 시간당 1,000바트, 금~일요일 1,200바트 균일가로 단순화했고(여전히 VAT 별도), 8명까지 들어가는 룸 덕분에 1인당 비용은 내려가지만 기본 요금은 LENGOLF의 거의 두 배예요. Golfzon Bangna는 방콕 광역권에서 공개된 연습 요금이 시간당 400바트로 가장 저렴하지만, Bangna-Trad에 있는 차량 접근 매장이고 룸당 4명까지예요. Topgolf는 서비스 차지와 VAT까지 더한 실제 비용이 시간당 약 645~1,465바트고, Bangna라는 위치 때문에 도심에서 오가는 시간과 비용이 더 들어요.',
      },
      sections: [
        {
          heading: 'LENGOLF: 전체 요금표',
          body: 'LENGOLF는 BTS 칫롬역(4번 출구)과 바로 연결되는 Mercury Ville에 있어요. 평일 요금은 14:00 이전 시간당 550바트, 14:00~23:00 시간당 750바트예요. 주말과 공휴일은 14:00 이전 시간당 750바트, 14:00~23:00 시간당 950바트고요. 모든 요금은 베이 단위(최대 5명)에 VAT가 포함된 금액이에요. 예약할 때마다 기본 클럽 대여가 무료로 포함되고, 프리미엄 클럽(Callaway, Majesty) 대여는 시간당 150바트부터예요. 월 패키지는 Bronze(5시간, 3,000바트), Silver(15시간, 8,000바트), Gold(30시간, 14,000바트), Diamond 무제한(월 8,000바트), Diamond+ 무제한(3개월 18,000바트)이 있어요. Early Bird 패키지(14:00 이전 전용)는 10시간 4,800바트, 무제한은 월 5,000바트예요.',
        },
        {
          heading: 'Front 9: 전체 요금표',
          body: 'Front 9은 BTS Phrom Phong과 Thong Lo 사이 Sukhumvit 47의 Rainhill에 있어요. 평일 요금은 12:00 이전 시간당 600바트, 12:00~17:00 시간당 700바트, 17:00~22:00 시간당 800바트(프로모션 요금, 정상가 1,200바트)예요. 주말은 12:00 이전 800바트, 12:00부터 900바트고, 저녁 시간대는 프로모션 요금이에요(정상가 1,400바트). 모든 요금은 베이 단위(최대 4명)에 VAT가 포함된 금액이에요. 프라이빗 베이는 시간당 200바트 추가, 5번째 인원부터는 1인당 시간당 100바트가 붙어요. 연습 패키지는 Early Rise 1시간 10회(오전 전용, 5,490바트), Anytime 1시간 10회(6,990바트), 20회(12,900바트), 50회(29,900바트)가 있어요. 멤버십은 14,000바트(3개월 1인)부터 30,000바트(6개월, 최대 4명)까지고요. 평일 10:00~22:00, 주말은 9:00부터 영업하고 Trackman을 씁니다.',
        },
        {
          heading: 'Fairway Golf & City Club: 전체 요금표',
          body: 'Fairway Golf & City Club은 BTS Phrom Phong 근처 Sukhumvit 24에 있어요. 2026년에 요금을 균일가로 단순화해서 월~목요일은 종일 시간당 1,000바트, 금~일요일과 공휴일은 시간당 1,200바트예요. 모든 요금은 룸 단위(최대 8명)에 VAT는 별도고요. 매일 오전 8시부터 새벽 2시까지 영업하는데, 방콕 도심 시뮬레이터 중 가장 늦게까지 열어요. 시간 묶음 패키지도 있어요(현재 30% 할인 프로모션 중). 5시간 4,500바트, 10시간 7,700바트, 25시간 16,450바트, 50시간 28,700바트고 유효 기간은 2~12개월이에요. Trackman을 쓰고, 칵테일 바와 주말 DJ, 노래방으로 바뀌는 룸도 있어요.',
        },
        {
          heading: 'Groove & Grit: 사톤에 새로 생긴 시뮬레이터 겸 바',
          body: 'Groove & Grit Golf and Bar는 MRT Lumphini 근처 Supalai Icon Sathorn에 문을 연, 방콕 도심에서 가장 새로운 시뮬레이터 겸 바 콘셉트예요. 성격으로 보면 LENGOLF와 가장 비슷하고, 다만 사톤 쪽에 있어요. 베이에는 Foresight Falcon 발사 모니터와 Swing Catalyst, 고속 카메라가 들어가 있고, 와인과 프리미엄 주류 라운지, PGA 프로 레슨도 운영해요. 예약 플랫폼에는 오전 비혼잡 시간대가 시간당 1,000바트 안팎으로 올라오지만 전체 요금표는 공개하지 않아서, 피크 요금은 직접 문의하셔야 해요. 매일 7:00~22:00 영업해요.',
        },
        {
          heading: 'Golfzon, Kakao Friends 등 한국식 스크린골프',
          body: '방콕에는 한국식 스크린골프 매장이 늘고 있는데, 대체로 시간당이 아니라 18홀 라운드 단위로 요금을 매겨요. Golfzon Bangna(Bangna-Trad Soi 23)는 Golfzon TwoVision 시뮬레이터를 쓰고, 연습 모드는 14:00 이전 시간당 400바트, 이후 600바트예요. 18홀 라운드는 룸당 600~800바트(최대 4명)고 한식 주방도 있어요. Market Place Ekkamai의 Golfzon Park Sooho는 오전 9시부터 새벽 3시까지, 방콕 시뮬레이터 매장 중 가장 늦게까지 영업하지만 요금은 전화로만 알려줘요. Suanplern Market(Rama IV)의 Kakao Friends Screen Golf는 Kakao VX의 Friends Screen 기술을 쓰고 새벽 2시까지 영업하는데, 요금은 현장에서만 공개해요. 한국식 라운드 방식 그대로를 원하신다면 이런 매장이 잘 맞고, 도심에서 시간 단위로 가볍게 즐기려면 BTS 노선 위의 매장이 더 편해요.',
        },
        {
          heading: 'Phothalai Golf Park: 드라이빙 레인지 안의 Trackman',
          body: 'Pradit Manutham Road(Ekkamai~Ramindra 축, 차량 이용)에 있는 Phothalai Golf Park는 큰 야외 드라이빙 레인지와 웰니스 복합시설이고, 실내 Trackman 4 베이는 요일과 시간에 상관없이 시간당 균일 1,000바트에 볼 무제한이에요. 소형과 대형 VIP 룸은 각각 시간당 1,500바트와 2,000바트고요. 동쪽에 살면서 도심 교통 체증 없이 Trackman 데이터를 보고 싶은 분에게는 좋은 선택이지만, BTS로는 갈 수 없고 분위기도 밤에 놀러 가는 곳이라기보다 연습 시설에 가까워요.',
        },
        {
          heading: 'Topgolf Megacity: 전체 요금표',
          body: 'Topgolf Megacity는 Mega Bangna 근처 Bang Phli에 있고, 방콕 도심에서 차로 30~45분 정도 걸려요. 위에 나온 시뮬레이터 바들과는 성격이 꽤 다른데, 실내에 갇힌 형태의 골프 시뮬레이터가 아니라 표적 게임을 하는 야외 복층 드라이빙 레인지예요. 일반 베이 요금은 월~화요일 시간당 550~650바트, 수~목요일 550~850바트, 금요일 550~1,150바트, 토요일 850~1,250바트, 일요일 850~1,150바트예요. 혼자 오시면 평일 17:00 이전에 시간당 350바트로 연습하실 수 있어요. VIP 베이(최대 12명)는 시간당 1,700~3,200바트고요. 모든 요금에 서비스 차지 10%와 VAT 7%가 빠져 있어서, 표시 요금에 약 17%를 더해야 해요. 가입비는 더 이상 없고, 학생(23세 이하, 신분증 지참)은 평일에 게임과 식음료를 50% 할인받아요. 일~목요일 9:00~23:00, 금~토요일은 자정까지 영업해요.',
        },
        {
          heading: '베이 요금을 공개하지 않는 레슨 스튜디오',
          body: '방콕에는 장비가 잘 갖춰져 있으면서도 아카데미나 피팅 중심이라 시간당 베이 요금을 공개하지 않는 실내 골프 스튜디오가 여럿 있어요. 견적을 받으려면 전화나 LINE으로 문의하셔야 해요. PING Indoor Golf Centre(Sukhumvit 24, Foresight GCQuad/GC3), Golf Swing Academy Bangkok(Sukhumvit 26, 일본계 운영, Foresight 베이), Home of Golf(Sukhumvit 26과 Rama 2, Trackman), Swing Kings Golf BKK(Asoke, Trackman과 Foresight), Bangkok Golf Centre(Wireless Road, 베이 15개) 같은 곳이에요. 체계적인 코칭이나 클럽 피팅에는 훌륭하지만, 가볍게 들러서 치기에는 요금이 불투명해요. 이 비교가 요금을 공개한 매장 위주인 이유이기도 하고요.',
        },
        {
          heading: '어느 매장이 나에게 맞을까요',
          body: '도심에서 가장 좋은 가성비, 그러니까 가장 낮은 1인당 비용과 무료 클럽, BTS 접근성, 바 분위기를 원하신다면 LENGOLF가 맞아요. Trackman 데이터를 중요하게 보고 Sukhumvit 47 근처에 사는 진지한 골퍼라면 Front 9이 맞고요. 최대 8명이 새벽 2시까지 늦게 즐기고 싶고 비용을 조금 더 써도 괜찮다면 Fairway Golf & City Club을 고르시면 돼요. 사톤 쪽에 계시면서 프리미엄 Foresight 장비와 와인 바를 원하신다면 Groove & Grit이, 한국식 스크린골프 라운드 방식 그대로를 원하신다면 Golfzon Bangna나 Kakao Friends가 맞아요. 동쪽에서 차로 움직이며 균일 요금으로 Trackman 연습을 하고 싶다면 Phothalai가 좋고요. 야외 드라이빙 레인지에서 게임과 음식, 파티 같은 분위기를 즐기는 Topgolf만의 경험을 원하고 Bangna까지 가는 것이 괜찮다면 Topgolf Megacity를 고르시면 돼요.',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'B',
          text: 'Happy to have found a great screen golf spot in BKK! The staff were super kind and spoke good English. The machines are new, and the rates are really reasonable especially if you go for the unlimited morning plan.',
        },
        {
          reviewer_name: 'tttnatorn',
          text: 'Great spot for a golf sim! Accurate tracking, good vibes, and helpful staff. Fair prices too. Perfect for practice or a fun round.',
        },
        {
          reviewer_name: 'Chidbhan T.',
          text: 'Lengolf is a hidden gem right in the heart of Bangkok — super convenient location! The simulator is modern, high-quality, and incredibly accurate. Prices are very reasonable for the top-notch experience you get.',
        },
      ],
    },
  },

  // ─── ZH: golf-simulator-prices-bangkok ───
  // Largest entry in the batch; every rate traces to EN price-2 and nothing is
  // reconciled across pages. as-of 截至2026年7月 matches this entry's own
  // last_verified (2026-07-26) and its EN intro ("re-verified in July 2026").
  // price_breakdown keeps the EN venue prefixes byte-identical ('LENGOLF — ',
  // 'Front 9 — ', 'Fairway Golf — ', 'Groove & Grit — ', 'Golfzon Bangna — ',
  // 'Phothalai Golf Park — ', 'Topgolf — '): groupPriceRows() splits on that
  // exact ' — ' string and PriceGuidePage tints the group whose venue === 'LENGOLF',
  // so translating or re-punctuating the prefix would silently flatten the table
  // and drop the highlight. venue_comparison: names/tech verbatim Latin, numerals
  // and the (promo)/(flat) qualifiers preserved, 未公布 only where EN says
  // "Not published"; price_includes_tax null is left null and never rendered as a
  // no-tax claim. related_slugs unchanged — all four EN targets are ZH-translated.
  {
    id: 'price-2-zh',
    page_type: 'price_guide',
    slug: 'golf-simulator-prices-bangkok',
    title: '曼谷高尔夫模拟器价格对比 — 7家场馆每小时收费全公开（2026）',
    meta_description:
      '曼谷高尔夫模拟器价格对比，截至2026年7月：LENGOLF每小时550泰铢起，与Front 9、Fairway、Groove & Grit、Golfzon、Phothalai、Topgolf逐家比价。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'zh',
    related_slugs: ['/cost/how-much-does-golf-cost-bangkok', '/cost/lengolf-pricing-guide', '/faq/how-much-does-indoor-golf-cost-in-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        '曼谷的高尔夫模拟器收费按球位计算，大约在每小时400–1,400泰铢之间，具体看场馆、时段和星期几。市中心一般是每球位每小时550–1,200泰铢；LENGOLF从每小时550泰铢起，最多5人同用。下面是曼谷各家主要模拟器场馆的一次实话实说的对比——所有价格都已对照各场馆自己公布的价目表重新核对，截至2026年7月。',
      price_breakdown: [
        { item: 'LENGOLF — 平日14:00前', price: '550泰铢/小时', notes: '最多5人。含免费标准球杆。BTS Chidlom。含增值税。' },
        { item: 'LENGOLF — 平日14:00–23:00', price: '750泰铢/小时', notes: '最多5人。含免费标准球杆。含增值税。' },
        { item: 'LENGOLF — 周末与节假日', price: '750–950泰铢/小时', notes: '周五至周日及公众假期。最多5人。含增值税。' },
        { item: 'Front 9 — 平日12:00前', price: '600泰铢/小时', notes: '最多4人。Trackman。Sukhumvit 47。含增值税。' },
        { item: 'Front 9 — 平日12:00–17:00', price: '700泰铢/小时', notes: '最多4人。含增值税。' },
        { item: 'Front 9 — 平日17:00–22:00（促销）', price: '800泰铢/小时', notes: '促销价（原价1,200泰铢）。含增值税。' },
        { item: 'Front 9 — 周末', price: '800–900泰铢/小时', notes: '晚间时段为促销价（原价1,400泰铢）。独立球位另加200泰铢/小时。含增值税。' },
        { item: 'Fairway Golf — 周一至周四（全天）', price: '1,000泰铢/小时', notes: '最多8人。Trackman。Sukhumvit 24。不含增值税。营业到凌晨2点。' },
        { item: 'Fairway Golf — 周五至周日及节假日', price: '1,200泰铢/小时', notes: '最多8人。不含增值税。' },
        { item: 'Groove & Grit — Sathorn', price: '约1,000泰铢/小时', notes: 'Foresight Falcon。Supalai Icon Sathorn。未公布完整价目表——请通过LINE或预订平台询价。' },
        { item: 'Golfzon Bangna — 练习模式', price: '400–600泰铢/小时', notes: '最多4人。14:00前400泰铢/小时，之后600泰铢/小时。Bangna-Trad 23，需自驾。' },
        { item: 'Golfzon Bangna — 18洞一轮', price: '600–800泰铢', notes: '按每间房每轮计费，不按小时。韩式屏幕高尔夫形式。' },
        { item: 'Phothalai Golf Park — Trackman球位', price: '1,000泰铢/小时', notes: '统一价，不限球数。VIP房1,500–2,000泰铢/小时。Pradit Manutham，需自驾。' },
        { item: 'Topgolf — 周一至周二', price: '550–650泰铢/小时', notes: '最多6人。Mega Bangna。不含服务费与增值税（约17%）。' },
        { item: 'Topgolf — 周五至周六高峰', price: '1,150–1,250泰铢/小时', notes: '最多6人。不含服务费与增值税。' },
        { item: 'Topgolf — 平日单人练习', price: '350泰铢/小时', notes: '1人，周一至周五9:00–17:00，不限球数。不含服务费与增值税。' },
      ],
      comparison_with_alternatives:
        '比价的时候，一定要先看标价含不含税。LENGOLF和Front 9报的是含增值税价。Fairway Golf & City Club不含增值税（要再加约7%），Topgolf Megacity则服务费和增值税都不含（要再加约17%），也就是说它挂出来的价格比你实际要付的低17%。位置也很关键：LENGOLF、Front 9、Fairway和Groove & Grit都在曼谷市中心的BTS／MRT沿线，而Golfzon Bangna、Phothalai和Topgolf Megacity都要开车，距市中心30–45分钟。最后还有一点：不少以教学为主的工作室根本不公布球位价格，得打电话或用LINE问了才知道。',
      value_proposition:
        'LENGOLF是曼谷市中心球位价格最低的场馆，每小时550泰铢起；按人头算也最低，5人一组时每人110泰铢。标准球杆免费租借，没有入会费，标价已经含税——看到多少就是付多少，截至2026年7月。',
      last_verified: '2026-07-26',
      venue_comparison: {
        venues: [
          {
            name: 'LENGOLF',
            location: 'Mercury Ville，BTS Chidlom',
            tech: 'Bravo',
            players_per_bay: 5,
            cheapest_rate: '550泰铢/小时',
            peak_rate: '950泰铢/小时',
            price_includes_tax: true,
            notes: '含免费标准球杆租借。每日9:00–23:00营业。',
          },
          {
            name: 'Front 9',
            location: 'Sukhumvit 47（Rainhill）',
            tech: 'Trackman',
            players_per_bay: 4,
            cheapest_rate: '600泰铢/小时',
            peak_rate: '900泰铢/小时（促销价）',
            price_includes_tax: true,
            notes: '独立球位另加200泰铢/小时。第5人起每人另加100泰铢/小时。10:00–22:00营业，周末9:00起。',
          },
          {
            name: 'Fairway Golf & City Club',
            location: 'Sukhumvit 24，BTS Phrom Phong',
            tech: 'Trackman',
            players_per_bay: 8,
            cheapest_rate: '1,000泰铢/小时',
            peak_rate: '1,200泰铢/小时',
            price_includes_tax: false,
            notes: '统一价：周一至周四1,000泰铢/小时，周五至周日及节假日1,200泰铢/小时。不含增值税。8:00–02:00营业。',
          },
          {
            name: 'Groove & Grit',
            location: 'Supalai Icon Sathorn，MRT Lumphini',
            tech: 'Foresight Falcon',
            players_per_bay: null,
            cheapest_rate: '约1,000泰铢/小时',
            peak_rate: '未公布',
            price_includes_tax: null,
            notes: 'Sathorn一带新开的高尔夫兼酒吧场馆。非高峰的上午时段在预订平台上约1,000泰铢/小时，完整价目表未公布。7:00–22:00营业。',
          },
          {
            name: 'Golfzon Bangna',
            location: 'Bangna-Trad Soi 23（需自驾）',
            tech: 'Golfzon TwoVision',
            players_per_bay: 4,
            cheapest_rate: '400泰铢/小时',
            peak_rate: '600泰铢/小时',
            price_includes_tax: null,
            notes: '韩式屏幕高尔夫。练习模式14:00前400泰铢/小时，之后600泰铢/小时。18洞一轮按轮计价（600–800泰铢/间）。营业到很晚。',
          },
          {
            name: 'Phothalai Golf Park',
            location: 'Pradit Manutham路（需自驾）',
            tech: 'Trackman 4',
            players_per_bay: null,
            cheapest_rate: '1,000泰铢/小时',
            peak_rate: '1,000泰铢/小时（统一价）',
            price_includes_tax: null,
            notes: '大型练习场与休闲综合体内的Trackman球位。不限球数。VIP房1,500–2,000泰铢/小时。',
          },
          {
            name: 'Topgolf Megacity',
            location: 'Mega Bangna（Bang Phli）',
            tech: 'Topgolf',
            players_per_bay: 6,
            cheapest_rate: '550泰铢/小时',
            peak_rate: '1,250泰铢/小时',
            price_includes_tax: false,
            notes: '标价不含服务费与增值税（约17%）。无入会费。平日单人练习价350泰铢/小时。距曼谷市中心30–45分钟。',
          },
        ],
        summary:
          '论曼谷市中心的人均性价比，LENGOLF明显胜出：5人、平日非高峰时段，每人110泰铢。最接近的竞争者是Front 9，4人时每人150泰铢。Fairway Golf在2026年把定价简化成统一价，周一至周四1,000泰铢/小时、周五至周日1,200泰铢/小时（仍然不含增值税）——8人房让人均成本好看一些，但基础价格接近LENGOLF的两倍。Golfzon Bangna挂出的练习价格是大曼谷地区最便宜的（400泰铢/小时），但它在Bangna-Trad，要开车过去，房间也是4人制。Topgolf加上服务费和增值税之后的实际价格大约在645–1,465泰铢/小时，而且从曼谷市中心过去，Bangna这个位置还要再算上时间和交通开销。',
      },
      sections: [
        {
          heading: 'LENGOLF：完整价目表',
          body: 'LENGOLF位于Mercury Ville，与BTS Chidlom站（4号出口）直接相连。平日价格：14:00前550泰铢/小时，14:00–23:00为750泰铢/小时。周末与节假日：14:00前750泰铢/小时，14:00–23:00为950泰铢/小时。所有价格按球位计（最多5人），已含增值税。每次预订都免费包含标准球杆租借。高级球杆租借（Callaway、Majesty）每小时150泰铢起。月卡套餐：Bronze（5小时，3,000泰铢）、Silver（15小时，8,000泰铢）、Gold（30小时，14,000泰铢）、Diamond不限时（8,000泰铢/月）、Diamond+不限时（18,000泰铢/3个月）。Early Bird套餐仅限14:00前使用：10小时4,800泰铢，或不限时5,000泰铢/月。',
        },
        {
          heading: 'Front 9：完整价目表',
          body: 'Front 9在Sukhumvit 47的Rainhill内，位于BTS Phrom Phong与Thong Lo之间。平日价格：12:00前600泰铢/小时，12:00–17:00为700泰铢/小时，17:00–22:00为800泰铢/小时（促销价，原价1,200泰铢）。周末价格：12:00前800泰铢/小时，12:00之后900泰铢/小时（晚间时段为促销价，原价1,400泰铢）。所有价格按球位计（最多4人），已含增值税。独立球位另加200泰铢/小时，第5人起每人另加100泰铢/小时。练习套餐：Early Rise 10次×1小时（仅限上午，5,490泰铢）、Anytime 10次×1小时（6,990泰铢）、20次×1小时（12,900泰铢）、50次×1小时（29,900泰铢）。会籍从14,000泰铢（3个月单人）到30,000泰铢（6个月，最多4人）不等。平日10:00–22:00营业，周末9:00起。设备为Trackman。',
        },
        {
          heading: 'Fairway Golf & City Club：完整价目表',
          body: 'Fairway Golf & City Club在Sukhumvit 24，靠近BTS Phrom Phong。2026年他们把价格简化成了统一价：周一至周四全天1,000泰铢/小时，周五至周日及公众假期1,200泰铢/小时。所有价格按房间计（最多8人），不含增值税。每天早上8点营业到凌晨2点——曼谷市中心所有模拟器场馆里关门最晚的一家。小时数套餐（目前打七折促销）：5小时4,500泰铢、10小时7,700泰铢、25小时16,450泰铢、50小时28,700泰铢，有效期2–12个月不等。设备为Trackman。Fairway还有一个鸡尾酒吧，周末有DJ，房间也能改成KTV。',
        },
        {
          heading: 'Groove & Grit：Sathorn新开的模拟器酒吧',
          body: 'Groove & Grit Golf and Bar开在Supalai Icon Sathorn（靠近MRT Lumphini），是曼谷市中心最新的模拟器加酒吧概念店——气质上与LENGOLF最接近，只是开在Sathorn这一侧。球位使用Foresight Falcon弹道监测仪，配Swing Catalyst和高速摄影机，还有一个葡萄酒与高端烈酒吧，可预约PGA职业教练授课。非高峰的上午时段在预订平台上大约1,000泰铢/小时，但场馆没有公布完整价目表，高峰价格要直接联系他们。每日7:00–22:00营业。',
        },
        {
          heading: 'Golfzon、Kakao Friends与韩式屏幕高尔夫',
          body: '曼谷的韩式屏幕高尔夫正在变多，这类场馆通常按18洞一轮计价，而不是按小时。Golfzon Bangna（Bangna-Trad Soi 23）用的是Golfzon TwoVision模拟器：练习模式14:00前400泰铢/小时、之后600泰铢/小时，18洞一轮则是每间房600–800泰铢（最多4人），店里还有韩式厨房。Market Place Ekkamai的Golfzon Park Sooho从上午9点开到凌晨3点，是曼谷所有模拟器场馆里营业时间最长的，但价格只在电话里告知。Suanplern Market（Rama IV）的Kakao Friends Screen Golf用的是Kakao VX的Friends Screen技术，营业到凌晨2点，价格只在店内公布。这几家适合想体验正宗韩式屏幕高尔夫一轮制的球友；若只是想在市区里按小时轻松打一打，BTS沿线的场馆更方便。',
        },
        {
          heading: 'Phothalai Golf Park：练习场里的Trackman',
          body: 'Phothalai Golf Park在Pradit Manutham路上（Ekkamai至Ramindra一线，需自驾），是一处大型室外练习场兼休闲综合体，其室内的Trackman 4球位不分日期和时段，统一1,000泰铢/小时，且不限球数。大小VIP房分别为1,500和2,000泰铢/小时。如果你住在城东，又想拿到Trackman的数据而不想堵在曼谷市中心，这是个不错的选择——但这里没有BTS，气质上也更像练习设施，而不是晚上出来玩的社交场所。',
        },
        {
          heading: 'Topgolf Megacity：完整价目表',
          body: 'Topgolf Megacity位于Bang Phli的Mega Bangna附近，开车距曼谷市中心约30–45分钟。它和上面几家模拟器酒吧是完全不同的体验：这是一座带target游戏的室外多层练习场，不是传统的封闭式高尔夫模拟器。标准球位价格：周一至周二550–650泰铢/小时，周三至周四550–850泰铢/小时，周五550–1,150泰铢/小时，周六850–1,250泰铢/小时，周日850–1,150泰铢/小时。单人在平日17:00前练习为350泰铢/小时。VIP球位（最多12人）为1,700–3,200泰铢/小时。所有价格都不含10%服务费和7%增值税——请在标价上再加约17%。现在已经不收入会费，23岁及以下的学生凭证件平日玩球、餐饮均可享5折。周日至周四9:00–23:00营业，周五至周六到午夜。',
        },
        {
          heading: '不公布球位价格的教学工作室',
          body: '曼谷还有几家设备很好的室内高尔夫工作室，主打学院教学或球杆定制，不公布按小时的球位价格——你得打电话或用LINE去问。这几家包括PING Indoor Golf Centre（Sukhumvit 24，Foresight GCQuad／GC3）、Golf Swing Academy Bangkok（Sukhumvit 26，日本人经营，Foresight球位）、Home of Golf（Sukhumvit 26与Rama 2，Trackman）、Swing Kings Golf BKK（Asoke，Trackman加Foresight），以及Bangkok Golf Centre（Wireless Road，15个球位）。它们做系统性教学和球杆定制都很出色，但对想临时来打一场的人来说价格并不透明——这也正是本篇比较只收录公布价格的场馆的原因。',
        },
        {
          heading: '哪一家最适合你',
          body: '想在曼谷市中心找最划算的，选LENGOLF——人均成本最低、球杆免费、BTS直达，还有酒吧式的社交气氛。如果你是认真练球的人，看重Trackman数据，又住在Sukhumvit 47附近，选Front 9。想深夜开局（开到凌晨2点）、人多到8个人，又不介意多花钱，选Fairway Golf & City Club。人在Sathorn一侧、想要高阶Foresight设备配葡萄酒吧，选Groove & Grit。想体验正宗韩式屏幕高尔夫一轮制，选Golfzon Bangna或Kakao Friends。住城东、有车，想要统一价的Trackman练习，选Phothalai。而如果你想要的是Topgolf那种体验——带游戏、有吃有喝、气氛热闹的室外练习场——又不介意跑一趟Bangna，那就选Topgolf Megacity。',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'B',
          text: 'Happy to have found a great screen golf spot in BKK! The staff were super kind and spoke good English. The machines are new, and the rates are really reasonable especially if you go for the unlimited morning plan.',
        },
        {
          reviewer_name: 'tttnatorn',
          text: 'Great spot for a golf sim! Accurate tracking, good vibes, and helpful staff. Fair prices too. Perfect for practice or a fun round.',
        },
        {
          reviewer_name: 'Chidbhan T.',
          text: 'Lengolf is a hidden gem right in the heart of Bangkok — super convenient location! The simulator is modern, high-quality, and incredibly accurate. Prices are very reasonable for the top-notch experience you get.',
        },
      ],
    },
  },

  // ─── Page 3: LENGOLF Pricing Guide ───
  {
    id: 'price-3',
    page_type: 'price_guide',
    slug: 'lengolf-pricing-guide',
    title: 'LENGOLF Pricing Guide: Bay Rates, Packages & Lessons (2026)',
    meta_description:
      'Complete LENGOLF pricing: bay rental from 550 THB/hr (up to 5 people), monthly packages from 3,000 THB, lessons from 1,800 THB/hr, event packages from 9,999 THB. All rates for 2026.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'en',
    related_slugs: ['/golf', '/lessons', '/events', '/golf-club-rental', '/cost/golf-simulator-prices-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        'LENGOLF bay rental starts at 550 THB per hour for up to 5 people — that\'s 110 THB per person. We also offer monthly packages, golf lessons, event packages, and premium club rental. Here\'s our complete 2026 pricing.',
      price_breakdown: [
        { item: 'Bay rental — Weekday before 14:00', price: '550 THB/hr', notes: 'Mon–Thu. Per bay, up to 5 players.' },
        { item: 'Bay rental — Weekday 14:00–23:00', price: '750 THB/hr', notes: 'Mon–Thu. Per bay, up to 5 players.' },
        { item: 'Bay rental — Weekend before 14:00', price: '750 THB/hr', notes: 'Fri–Sun. Per bay, up to 5 players.' },
        { item: 'Bay rental — Weekend 14:00–23:00', price: '950 THB/hr', notes: 'Fri–Sun. Per bay, up to 5 players.' },
        { item: 'Bronze Package (5 hrs / 1 month)', price: '3,000 THB', notes: '600 THB/hr effective rate. Good for occasional visitors.' },
        { item: 'Silver Package (15 hrs / 3 months)', price: '8,000 THB', notes: '533 THB/hr effective rate. 5% off food & drinks.' },
        { item: 'Gold Package (30 hrs / 6 months)', price: '14,000 THB', notes: '467 THB/hr effective rate. 10% off food & drinks.' },
        { item: 'Diamond Unlimited (1 month)', price: '8,000 THB', notes: 'Unlimited hours. 5% off food & drinks.' },
        { item: 'Diamond+ Unlimited (3 months)', price: '18,000 THB', notes: 'Unlimited hours. 10% off food & drinks. Best value for regulars.' },
        { item: 'Early Bird (10 hrs / 6 months)', price: '4,800 THB', notes: 'Before 14:00 only. 480 THB/hr effective rate.' },
        { item: 'Early Bird+ Unlimited (1 month)', price: '5,000 THB', notes: 'Before 14:00 only. Unlimited hours. 5% off food & drinks.' },
        { item: 'Private lesson (1 golfer, 1 hr)', price: '1,800 THB', notes: 'With a PGA-qualified pro.' },
        { item: 'Starter Package (5 coaching + 5 practice hrs)', price: '11,000 THB', notes: 'Best for beginners. Includes free golf glove. 6-month validity.' },
        { item: 'Free trial lesson', price: '0 THB', notes: '1 hour with a pro. No obligation. Book via LINE or website.' },
        { item: 'Small Event Package (10–15 guests)', price: '9,999 THB', notes: '2 bays, 3 hours. Includes 10 beers, 5 cocktails, unlimited soft drinks, food.' },
        { item: 'Medium Event Package (15–25 guests)', price: '21,999 THB', notes: '4 bays (exclusive), 3 hours. Includes 20 beers, 10 cocktails, unlimited soft drinks, food.' },
        { item: 'Standard club rental', price: 'Free', notes: 'Included with every bay booking. Men\'s and ladies\' sets available.' },
        { item: 'Premium club rental (Callaway / Majesty)', price: '150 THB/hr', notes: '250 THB/2hr, 400 THB/4hr, 1,200 THB/day. Can be taken off-site.' },
      ],
      comparison_with_alternatives:
        'All LENGOLF prices are inclusive of VAT. What you see is what you pay — no hidden fees, no joining fees, no minimum spend requirements. Standard club rental is free with every bay booking, which is unique among Bangkok simulator venues. Our monthly packages provide the best per-hour rates in the city: the Diamond+ Unlimited package at 18,000 THB for 3 months of unlimited play is unmatched for regular golfers.',
      value_proposition:
        'LENGOLF is designed to make golf accessible. At 110 THB per person (group of 5, weekday morning), it\'s less than a movie ticket. Free standard clubs mean you can walk in with nothing and play immediately. And with a free 1-hour trial lesson, there\'s zero risk to try.',
      last_verified: '2026-02-19',
      sections: [
        {
          heading: 'Best Value: Which Package Is Right for You?',
          body: 'If you visit once or twice a month, the Bronze package (5 hrs, 3,000 THB) saves you over walk-in rates. If you\'re building a regular habit, the Silver (15 hrs, 8,000 THB) drops your effective rate to 533 THB/hr with a 5% food & drink discount. For serious golfers, the Diamond Unlimited at 8,000 THB/month is extraordinary value — if you play just 12 hours in a month, you\'re paying 667 THB/hr. Play 20+ hours and it drops below 400 THB/hr. The Early Bird+ Unlimited (5,000 THB/month, before 14:00) is the best deal for anyone with a flexible schedule.',
        },
        {
          heading: 'Food, Drinks & On-Site Dining',
          body: 'LENGOLF shares Mercury Ville with Smith & Co. (Western cafe) and Pizza Mania (Italian). Both deliver directly to your bay. Our own bar serves craft beer, cocktails, wine, soft drinks, and snacks. Silver, Gold, Diamond, and Diamond+ package holders get 5–10% off all food and beverage purchases.',
        },
      ],
      curated_reviews: [
        VALUE_REVIEWS.nathan_marina,
        VALUE_REVIEWS.ray,
        VALUE_REVIEWS.b_screen_golf,
      ],
    },
  },

  // ─── TH: lengolf-pricing-guide ───
  // Brand-first title (ราคา LENGOLF) since this is the own-brand rate card, not
  // a comparison. Package names (Bronze/Silver/Gold/Diamond/Diamond+/Early Bird)
  // kept Latin — they are product SKUs the booking flow and staff use. The four
  // 'Bay rental — ' rows keep a single shared Thai prefix ('ค่าเช่าเบย์ — ') so
  // groupPriceRows() still collapses them into one titled group as in EN.
  // Every effective-rate figure (600/533/467/480 บาท/ชม.) carried unchanged.
  {
    id: 'price-3-th',
    page_type: 'price_guide',
    slug: 'lengolf-pricing-guide',
    title: 'ราคา LENGOLF ทั้งหมด: ค่าเช่าเบย์ แพ็กเกจ และคอร์สเรียน (2026)',
    meta_description:
      'ราคา LENGOLF ครบทุกรายการ ค่าเช่าเบย์เริ่มต้น 550 บาท/ชั่วโมง (สูงสุด 5 คน) แพ็กเกจรายเดือนเริ่ม 3,000 บาท คอร์สเรียนเริ่ม 1,800 บาท/ชั่วโมง และแพ็กเกจจัดงานเริ่ม 9,999 บาท อัตราปี 2026',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'th',
    related_slugs: ['/golf', '/lessons', '/events', '/golf-club-rental', '/cost/golf-simulator-prices-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        'ค่าเช่าเบย์ของ LENGOLF เริ่มต้นที่ 550 บาทต่อชั่วโมงสำหรับผู้เล่นสูงสุด 5 คน หรือเท่ากับ 110 บาทต่อคน นอกจากนี้เรายังมีแพ็กเกจรายเดือน คอร์สเรียนกอล์ฟ แพ็กเกจจัดงาน และบริการเช่าไม้กอล์ฟระดับพรีเมียม ด้านล่างนี้คือราคาทั้งหมดของเราสำหรับปี 2026 (ข้อมูล ณ กุมภาพันธ์ 2026)',
      price_breakdown: [
        { item: 'ค่าเช่าเบย์ — วันธรรมดา ก่อน 14:00 น.', price: '550 บาท/ชม.', notes: 'จันทร์-พฤหัสบดี คิดต่อเบย์ ผู้เล่นสูงสุด 5 คน' },
        { item: 'ค่าเช่าเบย์ — วันธรรมดา 14:00-23:00 น.', price: '750 บาท/ชม.', notes: 'จันทร์-พฤหัสบดี คิดต่อเบย์ ผู้เล่นสูงสุด 5 คน' },
        { item: 'ค่าเช่าเบย์ — วันหยุด ก่อน 14:00 น.', price: '750 บาท/ชม.', notes: 'ศุกร์-อาทิตย์ คิดต่อเบย์ ผู้เล่นสูงสุด 5 คน' },
        { item: 'ค่าเช่าเบย์ — วันหยุด 14:00-23:00 น.', price: '950 บาท/ชม.', notes: 'ศุกร์-อาทิตย์ คิดต่อเบย์ ผู้เล่นสูงสุด 5 คน' },
        { item: 'แพ็กเกจ Bronze (5 ชั่วโมง / 1 เดือน)', price: '3,000 บาท', notes: 'เท่ากับ 600 บาท/ชม. เหมาะกับคนที่มาเป็นครั้งคราว' },
        { item: 'แพ็กเกจ Silver (15 ชั่วโมง / 3 เดือน)', price: '8,000 บาท', notes: 'เท่ากับ 533 บาท/ชม. ลดอาหารและเครื่องดื่ม 5 เปอร์เซ็นต์' },
        { item: 'แพ็กเกจ Gold (30 ชั่วโมง / 6 เดือน)', price: '14,000 บาท', notes: 'เท่ากับ 467 บาท/ชม. ลดอาหารและเครื่องดื่ม 10 เปอร์เซ็นต์' },
        { item: 'Diamond Unlimited (1 เดือน)', price: '8,000 บาท', notes: 'เล่นไม่จำกัดชั่วโมง ลดอาหารและเครื่องดื่ม 5 เปอร์เซ็นต์' },
        { item: 'Diamond+ Unlimited (3 เดือน)', price: '18,000 บาท', notes: 'เล่นไม่จำกัดชั่วโมง ลดอาหารและเครื่องดื่ม 10 เปอร์เซ็นต์ คุ้มที่สุดสำหรับคนที่มาประจำ' },
        { item: 'Early Bird (10 ชั่วโมง / 6 เดือน)', price: '4,800 บาท', notes: 'ใช้ได้ก่อน 14:00 น. เท่านั้น เท่ากับ 480 บาท/ชม.' },
        { item: 'Early Bird+ Unlimited (1 เดือน)', price: '5,000 บาท', notes: 'ใช้ได้ก่อน 14:00 น. เท่านั้น เล่นไม่จำกัดชั่วโมง ลดอาหารและเครื่องดื่ม 5 เปอร์เซ็นต์' },
        { item: 'คอร์สเรียนส่วนตัว (1 คน 1 ชั่วโมง)', price: '1,800 บาท', notes: 'สอนโดยโปรที่ผ่านการรับรองจาก PGA' },
        { item: 'แพ็กเกจ Starter (เรียน 5 ชั่วโมง + ซ้อม 5 ชั่วโมง)', price: '11,000 บาท', notes: 'เหมาะที่สุดสำหรับผู้เริ่มต้น แถมถุงมือกอล์ฟฟรี ใช้ได้ภายใน 6 เดือน' },
        { item: 'คอร์สเรียนทดลองฟรี', price: '0 บาท', notes: 'เรียนกับโปร 1 ชั่วโมง ไม่มีข้อผูกมัด จองผ่าน LINE หรือเว็บไซต์' },
        { item: 'แพ็กเกจจัดงานขนาดเล็ก (10-15 คน)', price: '9,999 บาท', notes: '2 เบย์ 3 ชั่วโมง รวมเบียร์ 10 แก้ว ค็อกเทล 5 แก้ว น้ำอัดลมไม่จำกัด และอาหาร' },
        { item: 'แพ็กเกจจัดงานขนาดกลาง (15-25 คน)', price: '21,999 บาท', notes: '4 เบย์ (เหมาทั้งร้าน) 3 ชั่วโมง รวมเบียร์ 20 แก้ว ค็อกเทล 10 แก้ว น้ำอัดลมไม่จำกัด และอาหาร' },
        { item: 'เช่าไม้กอล์ฟชุดมาตรฐาน', price: 'ฟรี', notes: 'รวมอยู่ในทุกการจองเบย์ มีทั้งชุดผู้ชายและผู้หญิง' },
        { item: 'เช่าไม้กอล์ฟชุดพรีเมียม (Callaway / Majesty)', price: '150 บาท/ชม.', notes: '250 บาท/2 ชม. 400 บาท/4 ชม. 1,200 บาท/วัน นำออกไปใช้นอกสถานที่ได้' },
      ],
      comparison_with_alternatives:
        'ราคาทั้งหมดของ LENGOLF รวมภาษีมูลค่าเพิ่มแล้ว เห็นราคาเท่าไรก็จ่ายเท่านั้น ไม่มีค่าใช้จ่ายแอบแฝง ไม่มีค่าสมัครสมาชิก และไม่มียอดใช้จ่ายขั้นต่ำ บริการเช่าไม้กอล์ฟชุดมาตรฐานฟรีในทุกการจองเบย์ ซึ่งเป็นสิ่งที่ไม่มีที่อื่นในบรรดาสถานที่กอล์ฟซิมูเลเตอร์ในกรุงเทพฯ ส่วนแพ็กเกจรายเดือนของเราให้ราคาต่อชั่วโมงที่ดีที่สุดในเมือง โดยเฉพาะแพ็กเกจ Diamond+ Unlimited ที่ 18,000 บาท สำหรับเล่นไม่จำกัด 3 เดือน ซึ่งหาที่เทียบได้ยากสำหรับนักกอล์ฟที่มาเป็นประจำ',
      value_proposition:
        'LENGOLF ออกแบบมาเพื่อให้กอล์ฟเป็นเรื่องเข้าถึงได้ ที่ 110 บาทต่อคน (กลุ่ม 5 คน ช่วงเช้าวันธรรมดา) ถูกกว่าตั๋วหนังหนึ่งใบ ไม้กอล์ฟมาตรฐานฟรีทำให้คุณเดินตัวเปล่าเข้ามาแล้วเล่นได้ทันที และด้วยคอร์สเรียนทดลองฟรี 1 ชั่วโมง คุณจึงได้ลองโดยไม่มีความเสี่ยงใด ๆ',
      last_verified: '2026-02-19',
      sections: [
        {
          heading: 'คุ้มที่สุด: แพ็กเกจไหนเหมาะกับคุณ',
          body: 'หากคุณมาเดือนละหนึ่งถึงสองครั้ง แพ็กเกจ Bronze (5 ชั่วโมง 3,000 บาท) คุ้มกว่าการจ่ายแบบรายครั้ง หากคุณกำลังสร้างนิสัยเล่นประจำ แพ็กเกจ Silver (15 ชั่วโมง 8,000 บาท) จะลดราคาต่อชั่วโมงลงเหลือ 533 บาท พร้อมส่วนลดอาหารและเครื่องดื่ม 5 เปอร์เซ็นต์ สำหรับนักกอล์ฟจริงจัง Diamond Unlimited ที่ 8,000 บาทต่อเดือนคุ้มค่ามาก เพราะหากคุณเล่นเพียง 12 ชั่วโมงในหนึ่งเดือน เท่ากับจ่าย 667 บาทต่อชั่วโมง และหากเล่นตั้งแต่ 20 ชั่วโมงขึ้นไป ราคาจะลดลงต่ำกว่า 400 บาทต่อชั่วโมง ส่วน Early Bird+ Unlimited (5,000 บาทต่อเดือน ใช้ได้ก่อน 14:00 น.) เป็นดีลที่ดีที่สุดสำหรับคนที่จัดเวลาได้ยืดหยุ่น',
        },
        {
          heading: 'อาหาร เครื่องดื่ม และร้านในอาคาร',
          body: 'LENGOLF อยู่ใน Mercury Ville ร่วมกับ Smith & Co. (คาเฟ่อาหารตะวันตก) และ Pizza Mania (อาหารอิตาเลียน) ทั้งสองร้านส่งอาหารถึงเบย์ของคุณโดยตรง ส่วนบาร์ของเราเองมีคราฟต์เบียร์ ค็อกเทล ไวน์ น้ำอัดลม และของว่าง ผู้ถือแพ็กเกจ Silver, Gold, Diamond และ Diamond+ ได้ส่วนลด 5-10 เปอร์เซ็นต์ สำหรับอาหารและเครื่องดื่มทุกรายการ',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'Suuaap',
          text: 'It was our first time holding a golf club and Nate took his time to teach us the basics and more. Price was totally worth it and fair. We know we\'ll come back!',
        },
        {
          reviewer_name: 'Ray S.',
          text: 'Had a lesson with Pro Min and he was very kind and helpful. Left me with a few tips to work on at the range. The facility is very nice and they\'re very friendly. Prices are very affordable compared to other similar places in the area.',
        },
        {
          reviewer_name: 'B',
          text: 'Happy to have found a great screen golf spot in BKK! The staff were super kind and spoke good English. The machines are new, and the rates are really reasonable especially if you go for the unlimited morning plan.',
        },
      ],
    },
  },

  // ─── JA: lengolf-pricing-guide ───
  // LENGOLF's own rate card — every one of the 18 price rows traces to the EN
  // price-3 entry. Package names (Bronze/Silver/Gold/Diamond/Diamond+/Early
  // Bird/Starter/Sim to Fairway) stay Latin as product names. The 'Bay rental'
  // group prefix is translated to ベイ利用料 but the ' — ' separator is kept so
  // groupPriceRows() still renders the four bay rows as one titled block.
  // related_slugs unchanged — all five are JA-translated.
  {
    id: 'price-3-ja',
    page_type: 'price_guide',
    slug: 'lengolf-pricing-guide',
    title: 'LENGOLF料金ガイド — ベイ利用料・パッケージ・レッスン（2026年）',
    meta_description:
      'LENGOLFの料金をまとめて掲載。ベイ利用料は最大5名で1時間550THBから、月額パッケージは3,000THBから、レッスンは1時間1,800THBから、イベントパッケージは9,999THBから。2026年の全レートです（2026年2月現在）。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'ja',
    related_slugs: ['/golf', '/lessons', '/events', '/golf-club-rental', '/cost/golf-simulator-prices-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        'LENGOLFのベイ利用料は最大5名で1時間550THBから——1人あたりにすると110THBです。このほかに月額パッケージ、ゴルフレッスン、イベントパッケージ、プレミアムクラブのレンタルもご用意しています。2026年の料金をすべてご案内します（2026年2月現在）。',
      price_breakdown: [
        { item: 'ベイ利用料 — 平日14:00まで', price: '1時間550THB', notes: '月〜木。1ベイあたり、最大5名。' },
        { item: 'ベイ利用料 — 平日14:00〜23:00', price: '1時間750THB', notes: '月〜木。1ベイあたり、最大5名。' },
        { item: 'ベイ利用料 — 週末14:00まで', price: '1時間750THB', notes: '金〜日。1ベイあたり、最大5名。' },
        { item: 'ベイ利用料 — 週末14:00〜23:00', price: '1時間950THB', notes: '金〜日。1ベイあたり、最大5名。' },
        { item: 'Bronzeパッケージ（5時間・1か月）', price: '3,000THB', notes: '実質1時間600THB。たまにご利用になる方向け。' },
        { item: 'Silverパッケージ（15時間・3か月）', price: '8,000THB', notes: '実質1時間533THB。フードとドリンクが5%オフ。' },
        { item: 'Goldパッケージ（30時間・6か月）', price: '14,000THB', notes: '実質1時間467THB。フードとドリンクが10%オフ。' },
        { item: 'Diamond Unlimited（1か月）', price: '8,000THB', notes: '時間無制限。フードとドリンクが5%オフ。' },
        { item: 'Diamond+ Unlimited（3か月）', price: '18,000THB', notes: '時間無制限。フードとドリンクが10%オフ。常連の方に最も割のよいプランです。' },
        { item: 'Early Bird（10時間・6か月）', price: '4,800THB', notes: '14:00までの利用限定。実質1時間480THB。' },
        { item: 'Early Bird+ Unlimited（1か月）', price: '5,000THB', notes: '14:00までの利用限定。時間無制限。フードとドリンクが5%オフ。' },
        { item: 'プライベートレッスン（1名・1時間）', price: '1,800THB', notes: 'PGA資格を持つプロが担当します。' },
        { item: 'Starterパッケージ（コーチング5時間と練習5時間）', price: '11,000THB', notes: '初心者の方に最適。ゴルフグローブが無料で付きます。有効期限6か月。' },
        { item: '無料体験レッスン', price: '0THB', notes: 'プロと1時間。その後の勧誘はありません。LINEまたはウェブサイトからご予約ください。' },
        { item: 'スモールイベントパッケージ（10〜15名）', price: '9,999THB', notes: '2ベイ・3時間。ビール10杯、カクテル5杯、ソフトドリンク飲み放題、フード付き。' },
        { item: 'ミディアムイベントパッケージ（15〜25名）', price: '21,999THB', notes: '4ベイ貸切・3時間。ビール20杯、カクテル10杯、ソフトドリンク飲み放題、フード付き。' },
        { item: '標準クラブレンタル', price: '無料', notes: 'ベイのご予約すべてに含まれます。メンズ・レディースのセットをご用意しています。' },
        { item: 'プレミアムクラブレンタル（Callaway / Majesty）', price: '1時間150THB', notes: '2時間250THB、4時間400THB、1日1,200THB。館外への持ち出しも可能です。' },
      ],
      comparison_with_alternatives:
        'LENGOLFの料金はすべてVAT込みです。表示どおりの金額でご利用いただけます——隠れた費用も、入会金も、最低利用金額もありません。標準クラブのレンタルがベイのご予約に無料で付く点は、バンコクのシミュレーター施設のなかでも独自のものです。月額パッケージは市内で最も良い1時間あたりの単価になり、なかでも3か月18,000THBのDiamond+ Unlimitedは、定期的にプレーされる方にとって比べるもののない内容です。',
      value_proposition:
        'LENGOLFは、ゴルフをもっと身近なものにするために設計されています。5名・平日午前なら1人あたり110THB——映画のチケットより安い金額です。標準クラブが無料なので、手ぶらでお越しいただいてそのままプレーできます。さらに1時間の無料体験レッスンがあるので、試してみるのにリスクはありません。',
      last_verified: '2026-02-19',
      sections: [
        {
          heading: 'いちばん得なのはどれか — パッケージの選び方',
          body: '月に1〜2回のご利用なら、Bronzeパッケージ（5時間・3,000THB）でウォークイン料金より安くなります。習慣として通い始めるならSilver（15時間・8,000THB）で、実質1時間533THB、フードとドリンクが5%オフ。本格的に取り組む方には月額8,000THBのDiamond Unlimitedが際立った価値で、月に12時間プレーすれば1時間あたり667THB、20時間を超えれば400THBを下回ります。スケジュールに融通が利く方には、Early Bird+ Unlimited（月額5,000THB、14:00まで）が最もお得な選択です。',
        },
        {
          heading: 'フード、ドリンク、館内の食事',
          body: 'LENGOLFはザ・マーキュリービル内にあり、同じ建物にSmith & Co.（欧風カフェ）とPizza Mania（イタリアン）が入っています。どちらもベイまで直接お届けします。当店のバーではクラフトビール、カクテル、ワイン、ソフトドリンク、スナックをご用意。Silver、Gold、Diamond、Diamond+のパッケージをお持ちの方は、フードとドリンクのお会計が5〜10%オフになります。',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'Suuaap',
          text: 'It was our first time holding a golf club and Nate took his time to teach us the basics and more. Price was totally worth it and fair. We know we\'ll come back!',
        },
        {
          reviewer_name: 'Ray S.',
          text: 'Had a lesson with Pro Min and he was very kind and helpful. Left me with a few tips to work on at the range. The facility is very nice and they\'re very friendly. Prices are very affordable compared to other similar places in the area.',
        },
        {
          reviewer_name: 'B',
          text: 'Happy to have found a great screen golf spot in BKK! The staff were super kind and spoke good English. The machines are new, and the rates are really reasonable especially if you go for the unlimited morning plan.',
        },
      ],
    },
  },

  // ─── KO: lengolf-pricing-guide ───
  // LENGOLF's own rate card: all 18 price rows, both effective-rate figures
  // (533/467/480바트) and the package names (Bronze, Silver, Gold, Diamond,
  // Diamond+, Early Bird, Starter) carried verbatim from the EN entry. The four bay
  // rows keep an EN-shaped ' — ' prefix ('베이 대여 — …') so the renderer still groups
  // them under one header. As-of marker matches this entry's last_verified month
  // (2026년 2월 기준). related_slugs unchanged — /golf, /lessons, /events,
  // /golf-club-rental and the sibling /cost page are all KO-translated.
  {
    id: 'price-3-ko',
    page_type: 'price_guide',
    slug: 'lengolf-pricing-guide',
    title: 'LENGOLF 요금 안내 — 베이 요금, 패키지, 레슨 (2026년)',
    meta_description:
      'LENGOLF 전체 요금 안내. 베이 대여는 최대 5명 시간당 550바트부터, 월 패키지 3,000바트부터, 레슨 시간당 1,800바트부터, 이벤트 패키지 9,999바트부터예요 (2026년 2월 기준).',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'ko',
    related_slugs: ['/golf', '/lessons', '/events', '/golf-club-rental', '/cost/golf-simulator-prices-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        'LENGOLF 베이 대여는 최대 5명까지 시간당 550바트부터, 1인당 110바트예요. 월 패키지와 골프 레슨, 이벤트 패키지, 프리미엄 클럽 대여도 준비돼 있어요. 아래가 2026년 전체 요금이에요.',
      price_breakdown: [
        { item: '베이 대여 — 평일 14:00 이전', price: '550바트/시간', notes: '월~목요일. 베이 단위, 최대 5명.' },
        { item: '베이 대여 — 평일 14:00~23:00', price: '750바트/시간', notes: '월~목요일. 베이 단위, 최대 5명.' },
        { item: '베이 대여 — 주말 14:00 이전', price: '750바트/시간', notes: '금~일요일. 베이 단위, 최대 5명.' },
        { item: '베이 대여 — 주말 14:00~23:00', price: '950바트/시간', notes: '금~일요일. 베이 단위, 최대 5명.' },
        { item: 'Bronze 패키지 (5시간 / 1개월)', price: '3,000바트', notes: '실질 시간당 600바트. 가끔 오시는 분께 좋아요.' },
        { item: 'Silver 패키지 (15시간 / 3개월)', price: '8,000바트', notes: '실질 시간당 533바트. 식음료 5% 할인.' },
        { item: 'Gold 패키지 (30시간 / 6개월)', price: '14,000바트', notes: '실질 시간당 467바트. 식음료 10% 할인.' },
        { item: 'Diamond 무제한 (1개월)', price: '8,000바트', notes: '시간 무제한. 식음료 5% 할인.' },
        { item: 'Diamond+ 무제한 (3개월)', price: '18,000바트', notes: '시간 무제한. 식음료 10% 할인. 자주 오시는 분께 가장 좋아요.' },
        { item: 'Early Bird (10시간 / 6개월)', price: '4,800바트', notes: '14:00 이전 전용. 실질 시간당 480바트.' },
        { item: 'Early Bird+ 무제한 (1개월)', price: '5,000바트', notes: '14:00 이전 전용. 시간 무제한. 식음료 5% 할인.' },
        { item: '개인 레슨 (1명, 1시간)', price: '1,800바트', notes: 'PGA 자격을 갖춘 프로와 함께해요.' },
        { item: 'Starter 패키지 (코칭 5시간 + 연습 5시간)', price: '11,000바트', notes: '입문자에게 가장 좋아요. 골프 장갑을 함께 드려요. 유효 기간 6개월.' },
        { item: '무료 체험 레슨', price: '0바트', notes: '프로와 1시간. 부담 없이 받아보세요. LINE이나 웹사이트로 예약하시면 돼요.' },
        { item: '소규모 이벤트 패키지 (10~15명)', price: '9,999바트', notes: '베이 2개, 3시간. 맥주 10잔, 칵테일 5잔, 소프트드링크 무제한, 음식 포함.' },
        { item: '중규모 이벤트 패키지 (15~25명)', price: '21,999바트', notes: '베이 4개(전관), 3시간. 맥주 20잔, 칵테일 10잔, 소프트드링크 무제한, 음식 포함.' },
        { item: '기본 클럽 대여', price: '무료', notes: '모든 베이 예약에 포함돼요. 남성용과 여성용 세트가 있어요.' },
        { item: '프리미엄 클럽 대여 (Callaway / Majesty)', price: '150바트/시간', notes: '2시간 250바트, 4시간 400바트, 하루 1,200바트. 외부로 가져가실 수 있어요.' },
      ],
      comparison_with_alternatives:
        'LENGOLF 요금은 모두 VAT가 포함된 금액이에요. 보이는 금액이 곧 내는 금액이라 숨은 비용도, 가입비도, 최소 결제 금액도 없어요. 기본 클럽 대여는 모든 베이 예약에 무료로 포함되는데, 방콕 시뮬레이터 매장 중에서는 드문 조건이에요. 월 패키지는 시내에서 시간당 단가가 가장 좋고, 특히 3개월 무제한 Diamond+ 18,000바트는 자주 치시는 분에게 견줄 곳이 없어요.',
      value_proposition:
        'LENGOLF는 골프의 문턱을 낮추려고 만든 공간이에요. 평일 오전에 5명이 모이면 1인당 110바트로, 영화표 한 장보다 저렴해요. 기본 클럽이 무료라 빈손으로 오셔서 바로 치실 수 있고, 1시간 무료 체험 레슨이 있어서 부담 없이 시작해 보실 수 있어요.',
      last_verified: '2026-02-19',
      sections: [
        {
          heading: '어떤 패키지가 나에게 맞을까요',
          body: '한 달에 한두 번 오신다면 Bronze 패키지(5시간, 3,000바트)가 워크인 요금보다 이득이에요. 규칙적으로 치는 습관을 들이고 계시다면 Silver(15시간, 8,000바트)로 실질 단가가 시간당 533바트까지 내려가고 식음료 5% 할인도 붙어요. 진지하게 치시는 분이라면 월 8,000바트 Diamond 무제한이 대단한 가치인데, 한 달에 12시간만 쳐도 시간당 667바트고 20시간을 넘기면 시간당 400바트 아래로 떨어져요. 시간을 유연하게 쓸 수 있는 분께는 Early Bird+ 무제한(월 5,000바트, 14:00 이전)이 가장 좋은 조건이에요.',
        },
        {
          heading: '식음료와 매장 안 식사',
          body: 'LENGOLF는 Mercury Ville 안에서 Smith & Co.(서양식 카페), Pizza Mania(이탈리안)와 같은 건물을 써요. 두 곳 모두 베이까지 바로 배달해 줘요. 저희 바에서는 크래프트 맥주, 칵테일, 와인, 소프트드링크, 스낵을 판매해요. Silver, Gold, Diamond, Diamond+ 패키지 회원은 모든 식음료를 5~10% 할인받아요.',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'Suuaap',
          text: 'It was our first time holding a golf club and Nate took his time to teach us the basics and more. Price was totally worth it and fair. We know we\'ll come back!',
        },
        {
          reviewer_name: 'Ray S.',
          text: 'Had a lesson with Pro Min and he was very kind and helpful. Left me with a few tips to work on at the range. The facility is very nice and they\'re very friendly. Prices are very affordable compared to other similar places in the area.',
        },
        {
          reviewer_name: 'B',
          text: 'Happy to have found a great screen golf spot in BKK! The staff were super kind and spoke good English. The machines are new, and the rates are really reasonable especially if you go for the unlimited morning plan.',
        },
      ],
    },
  },

  // ─── ZH: lengolf-pricing-guide ───
  // Every figure traces to EN price-3 (550/750/950泰铢; 3,000/8,000/14,000/8,000/
  // 18,000/4,800/5,000泰铢; 600/533/467/480泰铢每小时折合价; 1,800/11,000泰铢;
  // 9,999/21,999泰铢; 150/250/400/1,200泰铢高级球杆; 667泰铢与低于400泰铢的月卡换算).
  // as-of 截至2026年2月 = this entry's own last_verified. The first four rows keep
  // the ' — ' separator so groupPriceRows() still renders them as one titled block
  // (EN groups them under "Bay rental", not under 'LENGOLF', so the green LENGOLF
  // tint is correctly absent here too — the ZH label 球位租用 preserves that).
  // 免费 is used for the EN 'Free' price cell. related_slugs unchanged — all five
  // EN targets are ZH-translated.
  {
    id: 'price-3-zh',
    page_type: 'price_guide',
    slug: 'lengolf-pricing-guide',
    title: 'LENGOLF价格指南 — 球位、月卡套餐与课程收费（2026）',
    meta_description:
      'LENGOLF完整价格：球位每小时550泰铢起、最多5人，月卡套餐3,000泰铢起，课程每小时1,800泰铢起，活动套餐9,999泰铢起，截至2026年2月。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'zh',
    related_slugs: ['/golf', '/lessons', '/events', '/golf-club-rental', '/cost/golf-simulator-prices-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        'LENGOLF的球位租用每小时550泰铢起，最多可5人同用——平摊下来每人110泰铢。我们同时提供月卡套餐、高尔夫课程、活动套餐和高级球杆租借。以下是2026年的完整价格，截至2026年2月。',
      price_breakdown: [
        { item: '球位租用 — 平日14:00前', price: '550泰铢/小时', notes: '周一至周四。按球位计，最多5人。' },
        { item: '球位租用 — 平日14:00–23:00', price: '750泰铢/小时', notes: '周一至周四。按球位计，最多5人。' },
        { item: '球位租用 — 周末14:00前', price: '750泰铢/小时', notes: '周五至周日。按球位计，最多5人。' },
        { item: '球位租用 — 周末14:00–23:00', price: '950泰铢/小时', notes: '周五至周日。按球位计，最多5人。' },
        { item: 'Bronze套餐（5小时／1个月）', price: '3,000泰铢', notes: '折合600泰铢/小时。适合偶尔来打的人。' },
        { item: 'Silver套餐（15小时／3个月）', price: '8,000泰铢', notes: '折合533泰铢/小时。餐饮95折。' },
        { item: 'Gold套餐（30小时／6个月）', price: '14,000泰铢', notes: '折合467泰铢/小时。餐饮9折。' },
        { item: 'Diamond不限时（1个月）', price: '8,000泰铢', notes: '时数不限。餐饮95折。' },
        { item: 'Diamond+不限时（3个月）', price: '18,000泰铢', notes: '时数不限。餐饮9折。常客最划算的一档。' },
        { item: 'Early Bird（10小时／6个月）', price: '4,800泰铢', notes: '仅限14:00前使用。折合480泰铢/小时。' },
        { item: 'Early Bird+不限时（1个月）', price: '5,000泰铢', notes: '仅限14:00前使用。时数不限。餐饮95折。' },
        { item: '一对一课程（1人，1小时）', price: '1,800泰铢', notes: '由具PGA资格的教练授课。' },
        { item: 'Starter入门套餐（5小时教学＋5小时练习）', price: '11,000泰铢', notes: '最适合新手。赠高尔夫手套一副。有效期6个月。' },
        { item: '免费试上课', price: '0泰铢', notes: '与教练上1小时，无任何附带条件。可通过LINE或网站预约。' },
        { item: '小型活动套餐（10–15人）', price: '9,999泰铢', notes: '2个球位，3小时。含啤酒10份、鸡尾酒5杯、软饮无限畅饮及餐点。' },
        { item: '中型活动套餐（15–25人）', price: '21,999泰铢', notes: '4个球位（包场），3小时。含啤酒20份、鸡尾酒10杯、软饮无限畅饮及餐点。' },
        { item: '标准球杆租借', price: '免费', notes: '每次球位预订都包含。男士与女士套装皆有。' },
        { item: '高级球杆租借（Callaway／Majesty）', price: '150泰铢/小时', notes: '2小时250泰铢，4小时400泰铢，全日1,200泰铢。可带出店外使用。' },
      ],
      comparison_with_alternatives:
        'LENGOLF所有价格都已含增值税。看到多少就是付多少——没有隐藏费用，没有入会费，也没有最低消费。每次球位预订都免费提供标准球杆，这一点在曼谷的模拟器场馆里是独一份。我们的月卡套餐是全城折合单价最低的：Diamond+不限时套餐3个月18,000泰铢随便打，对常来的球友来说无人能比。',
      value_proposition:
        'LENGOLF想做的就是让高尔夫变得人人可及。5人一组、平日上午来打，每人110泰铢，比一张电影票还便宜。标准球杆免费，意味着你两手空空走进来就能打。再加上1小时免费试上课，试一试完全没有风险。',
      last_verified: '2026-02-19',
      sections: [
        {
          heading: '哪个套餐最划算',
          body: '一个月来一两次的话，Bronze套餐（5小时，3,000泰铢）就已经比按次付费便宜。如果你打算养成固定习惯，Silver（15小时，8,000泰铢）能把折合单价压到533泰铢/小时，还有餐饮95折。对认真打球的人来说，Diamond不限时8,000泰铢/月是极高的性价比——一个月只打12小时，折合下来是667泰铢/小时；打满20小时以上，就降到400泰铢/小时以下了。时间安排灵活的人，最划算的其实是Early Bird+不限时（5,000泰铢/月，仅限14:00前）。',
        },
        {
          heading: '餐饮与现场用餐',
          body: 'LENGOLF与Smith & Co.（西式咖啡馆）和Pizza Mania（意式餐厅）同在Mercury Ville内，两家都可以直接送到你的球位。我们自己的吧台供应精酿啤酒、鸡尾酒、葡萄酒、软饮和小食。持Silver、Gold、Diamond与Diamond+套餐的会员，所有餐饮消费可享95折至9折。',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'Suuaap',
          text: 'It was our first time holding a golf club and Nate took his time to teach us the basics and more. Price was totally worth it and fair. We know we\'ll come back!',
        },
        {
          reviewer_name: 'Ray S.',
          text: 'Had a lesson with Pro Min and he was very kind and helpful. Left me with a few tips to work on at the range. The facility is very nice and they\'re very friendly. Prices are very affordable compared to other similar places in the area.',
        },
        {
          reviewer_name: 'B',
          text: 'Happy to have found a great screen golf spot in BKK! The staff were super kind and spoke good English. The machines are new, and the rates are really reasonable especially if you go for the unlimited morning plan.',
        },
      ],
    },
  },

  // ─── Page 4: Cost of Renting Golf Clubs Bangkok ───
  {
    id: 'price-4',
    page_type: 'price_guide',
    slug: 'cost-of-renting-golf-clubs-bangkok',
    title: 'Cost of Renting Golf Clubs in Bangkok (2026 Guide)',
    meta_description:
      'Golf club rental in Bangkok costs 150–1,500 THB depending on where you rent. Compare LENGOLF (free standard, 150 THB/hr premium), course rentals, and standalone services.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'en',
    related_slugs: ['/golf-club-rental', '/cost/how-much-does-golf-cost-bangkok', '/faq/should-i-bring-golf-clubs-to-thailand-or-rent', '/faq/cost-to-fly-with-golf-clubs-to-thailand'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        'Golf club rental in Bangkok ranges from free (at LENGOLF, included with every bay booking) to 1,500 THB per round at outdoor courses. If you\'re a tourist deciding whether to bring your own clubs or rent, this guide breaks down every option and cost.',
      price_breakdown: [
        { item: 'LENGOLF — Standard set (in-house)', price: 'Free', notes: 'Included with every bay booking. Men\'s and ladies\' sets. In-house use only.' },
        { item: 'LENGOLF — Premium set (Callaway / Majesty)', price: '150 THB/hr', notes: '250 THB/2hr, 400 THB/4hr, 1,200 THB/day. Can be taken to any Bangkok course.' },
        { item: 'Outdoor course rental', price: '1,000–1,500 THB/round', notes: 'Sets available at most courses. Quality varies.' },
        { item: 'Standalone rental service', price: '800–1,500 THB/day', notes: 'Delivered to your hotel or course. Higher quality, more selection.' },
        { item: 'Flying clubs to Thailand (airline fees)', price: '2,000–6,000+ THB each way', notes: 'Varies by airline. AirAsia: ~4,200–6,300 THB each way. Even full-service airlines do not include golf bags in checked luggage for free.' },
        { item: 'Hard travel case for clubs', price: '5,000–15,000 THB', notes: 'One-time purchase. Essential for protecting clubs in transit.' },
        { item: 'Golf gloves (LENGOLF)', price: '600 THB', notes: 'Available for purchase at LENGOLF.' },
        { item: 'Golf balls (LENGOLF)', price: '400 THB / 6 balls', notes: 'Srixon quality. Available at LENGOLF.' },
      ],
      comparison_with_alternatives:
        'For tourists visiting Bangkok, the math is clear: flying with golf clubs costs 4,000–12,000 THB round-trip in airline fees alone, plus the hassle and risk of damage. LENGOLF\'s free standard club rental eliminates this entirely for simulator golf. If you want to play outdoor courses too, our premium rental at 1,200 THB/day for Callaway or Majesty sets is competitive with standalone rental services and significantly cheaper than most course pro shop rentals.',
      value_proposition:
        'LENGOLF is the only simulator venue in Bangkok that includes free standard club rental with every bay booking. Walk in empty-handed, play immediately. For outdoor courses, our premium club delivery service (1,200 THB/day + 500 THB delivery within Bangkok) is the most convenient option — we bring the clubs to your hotel or the course.',
      last_verified: '2026-02-19',
      sections: [
        {
          heading: 'Should You Bring Your Clubs or Rent?',
          body: 'If you\'re playing 3+ outdoor rounds during your trip and have your own clubs, it may be worth flying with them — though even full-service airlines charge extra for golf bags, so factor those fees in. For everyone else, renting in Bangkok is cheaper and easier. Our recommendation: use LENGOLF\'s free standard clubs for simulator sessions, and rent premium clubs for any outdoor course days.',
        },
        {
          heading: 'LENGOLF Club Delivery Service',
          body: 'Our premium club sets (Callaway Warbird for men, Majesty Shuttle for women) can be rented for the full day at 1,200 THB and delivered anywhere in Bangkok for a flat 500 THB fee. Same-day delivery is available if booked before noon. This means you can rent from LENGOLF, have clubs delivered to your hotel, play an outdoor course, and return them — no need to visit a separate rental shop.',
        },
      ],
      curated_reviews: [
        VALUE_REVIEWS.ray,
        VALUE_REVIEWS.chidbhan,
        VALUE_REVIEWS.jack,
      ],
    },
  },

  // ─── TH: cost-of-renting-golf-clubs-bangkok ───
  // Title/meta front-load ค่าเช่าไม้กอล์ฟ, the phrase a Thai reader searches.
  // The airline row keeps both EN hedges intact ('2,000-6,000+ บาทต่อเที่ยว',
  // 'AirAsia ประมาณ 4,200-6,300 บาท') and the EN's careful negative about
  // full-service carriers is carried, not softened. The two 'LENGOLF — ' rows
  // keep the em-dash prefix so the venue group renders as in EN.
  {
    id: 'price-4-th',
    page_type: 'price_guide',
    slug: 'cost-of-renting-golf-clubs-bangkok',
    title: 'ค่าเช่าไม้กอล์ฟในกรุงเทพฯ ราคาเท่าไหร่ (คู่มือปี 2026)',
    meta_description:
      'ค่าเช่าไม้กอล์ฟในกรุงเทพฯ อยู่ที่ 150-1,500 บาท ขึ้นอยู่กับว่าเช่าจากที่ไหน เทียบ LENGOLF (ชุดมาตรฐานฟรี ชุดพรีเมียม 150 บาท/ชั่วโมง) กับการเช่าที่สนามและบริการเช่าแบบส่งถึงที่',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'th',
    related_slugs: ['/golf-club-rental', '/cost/how-much-does-golf-cost-bangkok', '/faq/should-i-bring-golf-clubs-to-thailand-or-rent', '/faq/cost-to-fly-with-golf-clubs-to-thailand'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        'ค่าเช่าไม้กอล์ฟในกรุงเทพฯ มีตั้งแต่ฟรี (ที่ LENGOLF รวมอยู่ในทุกการจองเบย์) ไปจนถึง 1,500 บาทต่อรอบที่สนามกลางแจ้ง หากคุณกำลังตัดสินใจว่าจะพกไม้กอล์ฟของตัวเองมาหรือเช่าเอาที่นี่ คู่มือนี้แจกแจงทุกตัวเลือกและค่าใช้จ่ายให้ครบ (ข้อมูล ณ กุมภาพันธ์ 2026)',
      price_breakdown: [
        { item: 'LENGOLF — ชุดมาตรฐาน (ใช้ในร้าน)', price: 'ฟรี', notes: 'รวมอยู่ในทุกการจองเบย์ มีทั้งชุดผู้ชายและผู้หญิง ใช้ได้เฉพาะในร้าน' },
        { item: 'LENGOLF — ชุดพรีเมียม (Callaway / Majesty)', price: '150 บาท/ชม.', notes: '250 บาท/2 ชม. 400 บาท/4 ชม. 1,200 บาท/วัน นำไปใช้ที่สนามใดก็ได้ในกรุงเทพฯ' },
        { item: 'เช่าที่สนามกลางแจ้ง', price: '1,000-1,500 บาท/รอบ', notes: 'สนามส่วนใหญ่มีชุดไม้ให้เช่า คุณภาพแตกต่างกันไป' },
        { item: 'บริการเช่าไม้กอล์ฟเฉพาะทาง', price: '800-1,500 บาท/วัน', notes: 'ส่งถึงที่พักหรือสนามกอล์ฟ คุณภาพสูงกว่าและมีให้เลือกมากกว่า' },
        { item: 'ค่าโหลดไม้กอล์ฟมาไทย (ค่าธรรมเนียมสายการบิน)', price: '2,000-6,000+ บาทต่อเที่ยว', notes: 'แตกต่างกันตามสายการบิน AirAsia ประมาณ 4,200-6,300 บาทต่อเที่ยว แม้แต่สายการบินฟูลเซอร์วิสก็ไม่ได้รวมถุงกอล์ฟไว้ในน้ำหนักสัมภาระใต้ท้องเครื่องแบบไม่มีค่าใช้จ่าย' },
        { item: 'กระเป๋าเดินทางแบบแข็งสำหรับไม้กอล์ฟ', price: '5,000-15,000 บาท', notes: 'ซื้อครั้งเดียว จำเป็นสำหรับปกป้องไม้กอล์ฟระหว่างการขนส่ง' },
        { item: 'ถุงมือกอล์ฟ (LENGOLF)', price: '600 บาท', notes: 'มีจำหน่ายที่ LENGOLF' },
        { item: 'ลูกกอล์ฟ (LENGOLF)', price: '400 บาท / 6 ลูก', notes: 'คุณภาพระดับ Srixon มีจำหน่ายที่ LENGOLF' },
      ],
      comparison_with_alternatives:
        'สำหรับนักท่องเที่ยวที่มากรุงเทพฯ การคำนวณค่อนข้างชัดเจน การขนไม้กอล์ฟขึ้นเครื่องมีค่าธรรมเนียมสายการบินไป-กลับ 4,000-12,000 บาท ยังไม่นับความยุ่งยากและความเสี่ยงที่ไม้จะเสียหาย บริการเช่าไม้กอล์ฟชุดมาตรฐานฟรีของ LENGOLF ตัดค่าใช้จ่ายส่วนนี้ออกไปทั้งหมดสำหรับการเล่นกอล์ฟซิมูเลเตอร์ และหากคุณอยากออกรอบสนามกลางแจ้งด้วย ชุดพรีเมียมของเราที่ 1,200 บาทต่อวันสำหรับ Callaway หรือ Majesty ก็สู้ราคาบริการเช่าเฉพาะทางได้ และถูกกว่าการเช่าที่โปรช็อปของสนามส่วนใหญ่อย่างมาก',
      value_proposition:
        'LENGOLF เป็นสถานที่กอล์ฟซิมูเลเตอร์แห่งเดียวในกรุงเทพฯ ที่รวมบริการเช่าไม้กอล์ฟชุดมาตรฐานฟรีไว้ในทุกการจองเบย์ เดินตัวเปล่าเข้ามาแล้วเล่นได้ทันที ส่วนการออกรอบสนามกลางแจ้ง บริการส่งไม้กอล์ฟชุดพรีเมียมของเรา (1,200 บาทต่อวัน บวกค่าจัดส่ง 500 บาทภายในกรุงเทพฯ) เป็นตัวเลือกที่สะดวกที่สุด เพราะเรานำไม้ไปส่งถึงที่พักหรือถึงสนามให้เลย',
      last_verified: '2026-02-19',
      sections: [
        {
          heading: 'ควรพกไม้กอล์ฟมาเองหรือเช่าเอาที่นี่',
          body: 'หากคุณจะออกรอบสนามกลางแจ้งตั้งแต่ 3 รอบขึ้นไปในทริปนี้ และมีไม้กอล์ฟของตัวเองอยู่แล้ว การขนมาด้วยอาจคุ้มค่า แต่ต้องเผื่อค่าธรรมเนียมไว้ด้วย เพราะแม้แต่สายการบินฟูลเซอร์วิสก็คิดค่าใช้จ่ายเพิ่มสำหรับถุงกอล์ฟ ส่วนกรณีอื่น ๆ การเช่าในกรุงเทพฯ ถูกกว่าและสะดวกกว่า คำแนะนำของเราคือใช้ไม้กอล์ฟชุดมาตรฐานฟรีของ LENGOLF สำหรับการเล่นซิมูเลเตอร์ และเช่าชุดพรีเมียมเฉพาะวันที่จะออกรอบสนามกลางแจ้ง',
        },
        {
          heading: 'บริการส่งไม้กอล์ฟของ LENGOLF',
          body: 'ชุดไม้กอล์ฟระดับพรีเมียมของเรา (Callaway Warbird สำหรับผู้ชาย และ Majesty Shuttle สำหรับผู้หญิง) เช่าแบบเต็มวันได้ในราคา 1,200 บาท และจัดส่งได้ทุกที่ในกรุงเทพฯ ในอัตราคงที่ 500 บาท มีบริการจัดส่งภายในวันเดียวกันหากจองก่อนเที่ยง นั่นหมายความว่าคุณเช่าจาก LENGOLF ให้ส่งไม้ไปที่ที่พัก ออกรอบสนามกลางแจ้ง แล้วส่งคืนได้เลย โดยไม่ต้องแวะร้านเช่าไม้กอล์ฟที่อื่น',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'Ray S.',
          text: 'Had a lesson with Pro Min and he was very kind and helpful. Left me with a few tips to work on at the range. The facility is very nice and they\'re very friendly. Prices are very affordable compared to other similar places in the area.',
        },
        {
          reviewer_name: 'Chidbhan T.',
          text: 'Lengolf is a hidden gem right in the heart of Bangkok — super convenient location! The simulator is modern, high-quality, and incredibly accurate. Prices are very reasonable for the top-notch experience you get.',
        },
        {
          reviewer_name: 'Jack S.',
          text: 'Me and 2 friends came here for some golf after not playing for a while. The technology was fantastic and the staff were very helpful and friendly. For a very reasonable price I would definitely recommend!',
        },
      ],
    },
  },

  // ─── JA: cost-of-renting-golf-clubs-bangkok ───
  // Rental-cost cluster. Figures traced to the EN price-4 entry (無料 / 150 /
  // 1,000〜1,500 / 800〜1,500 / 2,000〜6,000以上 / AirAsia 4,200〜6,300 /
  // 5,000〜15,000 / 600 / 6球400). The EN airline hedge ("Even full-service
  // airlines do not include golf bags…") is carried intact, as is the 3+ round
  // conditional. The two 'LENGOLF — ' prefixed rows keep the em-dash separator
  // so the LENGOLF group keeps its tint. related_slugs unchanged — all four
  // are JA-translated.
  {
    id: 'price-4-ja',
    page_type: 'price_guide',
    slug: 'cost-of-renting-golf-clubs-bangkok',
    title: 'バンコクのゴルフクラブレンタル料金は？ — 2026年ガイド',
    meta_description:
      'バンコクのゴルフクラブレンタルは、借りる場所によって150〜1,500THB。LENGOLF（標準セット無料、プレミアムは1時間150THB）、ゴルフ場でのレンタル、レンタル専門サービスを比較します（2026年2月現在）。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'ja',
    related_slugs: ['/golf-club-rental', '/cost/how-much-does-golf-cost-bangkok', '/faq/should-i-bring-golf-clubs-to-thailand-or-rent', '/faq/cost-to-fly-with-golf-clubs-to-thailand'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        'バンコクでのゴルフクラブレンタルは、LENGOLFのようにベイのご予約に無料で付く場合から、屋外コースで1ラウンド1,500THBかかる場合まで幅があります。旅行でお越しの方がご自身のクラブを持ち込むか現地で借りるかを判断できるよう、選択肢と費用を一つずつ整理します（2026年2月現在）。',
      price_breakdown: [
        { item: 'LENGOLF — 標準セット（館内利用）', price: '無料', notes: 'ベイのご予約すべてに含まれます。メンズ・レディースのセット。館内でのご利用のみ。' },
        { item: 'LENGOLF — プレミアムセット（Callaway / Majesty）', price: '1時間150THB', notes: '2時間250THB、4時間400THB、1日1,200THB。バンコクのどのゴルフ場へも持ち出せます。' },
        { item: '屋外コースでのレンタル', price: '1ラウンド1,000〜1,500THB', notes: '多くのコースにセットが用意されています。品質はまちまちです。' },
        { item: 'レンタル専門サービス', price: '1日800〜1,500THB', notes: 'ホテルやゴルフ場までお届け。品質が高く、選択肢も豊富です。' },
        { item: 'クラブの空輸（航空会社の手数料）', price: '片道2,000〜6,000THB以上', notes: '航空会社によって異なります。AirAsiaは片道およそ4,200〜6,300THB。フルサービスの航空会社でも、ゴルフバッグが受託手荷物に無料で含まれることはありません。' },
        { item: 'クラブ用ハードケース', price: '5,000〜15,000THB', notes: '一度きりの購入。移動中にクラブを守るには欠かせません。' },
        { item: 'ゴルフグローブ（LENGOLF）', price: '600THB', notes: 'LENGOLFで販売しています。' },
        { item: 'ゴルフボール（LENGOLF）', price: '6球400THB', notes: 'Srixon品質。LENGOLFでお求めいただけます。' },
      ],
      comparison_with_alternatives:
        'バンコクを訪れる旅行者にとって、計算ははっきりしています。ゴルフクラブを空輸すると航空会社の手数料だけで往復4,000〜12,000THB、これに手間と破損のリスクが加わります。LENGOLFの標準クラブレンタルは無料なので、シミュレーターゴルフに関してはこの費用がまるごと不要です。屋外コースにも出たい場合は、CallawayやMajesty（マジェスティ）のセットを1日1,200THBで借りられるプレミアムレンタルが、レンタル専門サービスと比べても競争力があり、コースのプロショップでのレンタルより大幅に安く済みます。',
      value_proposition:
        'バンコクのシミュレーター施設のなかで、ベイのご予約すべてに標準クラブレンタルが無料で付くのはLENGOLFだけです。手ぶらでお越しいただき、そのままプレーできます。屋外コースに出る日には、プレミアムクラブの配送サービス（1日1,200THBと、バンコク市内への配送500THB）が最も便利です——ホテルでもゴルフ場でも、クラブをお届けします。',
      last_verified: '2026-02-19',
      sections: [
        {
          heading: 'クラブを持ち込むか、現地で借りるか',
          body: '旅行中に屋外コースを3ラウンド以上回る予定があり、ご自身のクラブをお持ちなら、空輸する価値はあるかもしれません。ただしフルサービスの航空会社でもゴルフバッグには追加料金がかかるため、その分を織り込んでお考えください。それ以外の方にとっては、バンコクで借りるほうが安く、手間もかかりません。おすすめの組み合わせは、シミュレーターのセッションではLENGOLFの無料標準クラブを使い、屋外コースに出る日だけプレミアムクラブを借りる形です。',
        },
        {
          heading: 'LENGOLFのクラブ配送サービス',
          body: 'プレミアムセット（メンズはCallaway Warbird、レディースはMajesty（マジェスティ）Shuttle）は1日1,200THBで終日レンタルでき、バンコク市内であれば一律500THBでどこへでもお届けします。正午までにご予約いただければ当日配送も可能です。つまりLENGOLFで借りて、ホテルにクラブを届けてもらい、屋外コースを回って返却する——別のレンタルショップに立ち寄る必要はありません。',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'Ray S.',
          text: 'Had a lesson with Pro Min and he was very kind and helpful. Left me with a few tips to work on at the range. The facility is very nice and they\'re very friendly. Prices are very affordable compared to other similar places in the area.',
        },
        {
          reviewer_name: 'Chidbhan T.',
          text: 'Lengolf is a hidden gem right in the heart of Bangkok — super convenient location! The simulator is modern, high-quality, and incredibly accurate. Prices are very reasonable for the top-notch experience you get.',
        },
        {
          reviewer_name: 'Jack S.',
          text: 'Me and 2 friends came here for some golf after not playing for a while. The technology was fantastic and the staff were very helpful and friendly. For a very reasonable price I would definitely recommend!',
        },
      ],
    },
  },

  // ─── KO: cost-of-renting-golf-clubs-bangkok ───
  // Rental-cost page. All figures carried from the EN entry (무료 / 150바트/시간 /
  // 1,200바트 하루 / 1,000~1,500바트 라운드 / 800~1,500바트 하루 / 항공 2,000~6,000바트
  // 이상 편도 / 왕복 4,000~12,000바트 / 하드케이스 5,000~15,000바트 / 장갑 600바트 /
  // 볼 6개 400바트). The EN hedge on airlines ('even full-service airlines do not
  // include golf bags for free') kept intact — it is a negative claim about a third
  // party, so it is stated exactly as EN states it, not sharpened. related_slugs
  // unchanged; both FAQ targets are KO-translated after this batch.
  {
    id: 'price-4-ko',
    page_type: 'price_guide',
    slug: 'cost-of-renting-golf-clubs-bangkok',
    title: '방콕 골프 클럽 대여 비용 — 2026년 요금 정리',
    meta_description:
      '방콕에서 골프 클럽 대여 비용은 어디서 빌리느냐에 따라 150~1,500바트예요. LENGOLF(기본 무료, 프리미엄 시간당 150바트)와 골프장 대여, 전문 대여 서비스를 비교했어요 (2026년 2월 기준).',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'ko',
    related_slugs: ['/golf-club-rental', '/cost/how-much-does-golf-cost-bangkok', '/faq/should-i-bring-golf-clubs-to-thailand-or-rent', '/faq/cost-to-fly-with-golf-clubs-to-thailand'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        '방콕의 골프 클럽 대여 비용은 무료(LENGOLF에서는 베이 예약마다 기본 세트가 포함돼요)부터 실외 코스 1라운드 1,500바트까지예요. 클럽을 가져올지 빌릴지 고민하시는 여행자라면, 이 글에서 선택지와 비용을 하나씩 짚어 드릴게요.',
      price_breakdown: [
        { item: 'LENGOLF — 기본 세트 (매장 내 이용)', price: '무료', notes: '모든 베이 예약에 포함돼요. 남성용과 여성용 세트. 매장 안에서만 사용해요.' },
        { item: 'LENGOLF — 프리미엄 세트 (Callaway / Majesty)', price: '150바트/시간', notes: '2시간 250바트, 4시간 400바트, 하루 1,200바트. 방콕 어느 골프장으로든 가져가실 수 있어요.' },
        { item: '실외 골프장 대여', price: '1라운드 1,000~1,500바트', notes: '대부분의 골프장에 세트가 있어요. 품질 편차가 커요.' },
        { item: '전문 대여 서비스', price: '1일 800~1,500바트', notes: '호텔이나 골프장으로 배송해 줘요. 품질이 좋고 선택 폭도 넓어요.' },
        { item: '클럽 항공 운송 (항공사 요금)', price: '편도 2,000~6,000바트 이상', notes: '항공사마다 달라요. AirAsia는 편도 약 4,200~6,300바트. 풀서비스 항공사도 골프백을 무료 위탁 수하물로 포함해 주지는 않아요.' },
        { item: '클럽용 하드 케이스', price: '5,000~15,000바트', notes: '한 번 사면 계속 써요. 운송 중 클럽을 보호하려면 꼭 필요해요.' },
        { item: '골프 장갑 (LENGOLF)', price: '600바트', notes: 'LENGOLF에서 구입하실 수 있어요.' },
        { item: '골프공 (LENGOLF)', price: '6개 400바트', notes: 'Srixon 품질. LENGOLF에서 판매해요.' },
      ],
      comparison_with_alternatives:
        '방콕에 오시는 여행자라면 계산은 분명해요. 클럽을 비행기로 가져오면 항공사 요금만 왕복 4,000~12,000바트가 들고, 번거로움과 파손 위험도 감수해야 해요. 시뮬레이터 골프라면 LENGOLF의 무료 기본 클럽 대여로 이 비용이 전부 사라져요. 실외 코스도 함께 도실 계획이라면 Callaway나 Majesty 세트를 하루 1,200바트에 빌리는 프리미엄 대여가 전문 대여 서비스와 견줄 만하고, 대부분의 골프장 프로샵 대여보다는 훨씬 저렴해요.',
      value_proposition:
        '방콕에서 베이 예약마다 기본 클럽 대여를 무료로 포함하는 시뮬레이터 매장은 LENGOLF뿐이에요. 빈손으로 오셔서 바로 치시면 돼요. 실외 코스에 나가신다면 프리미엄 클럽 배송 서비스(하루 1,200바트에 방콕 시내 배송 500바트)가 가장 편해요. 호텔이든 골프장이든 저희가 클럽을 가져다 드려요.',
      last_verified: '2026-02-19',
      sections: [
        {
          heading: '클럽을 가져올까, 빌릴까',
          body: '이번 여행에서 실외 라운딩을 3번 이상 하시고 본인 클럽이 있다면 비행기로 가져올 만해요. 다만 풀서비스 항공사도 골프백에는 추가 요금을 받으니 그 비용까지 계산에 넣으세요. 그 외의 경우라면 방콕에서 빌리는 편이 저렴하고 편해요. 저희가 추천하는 방법은 시뮬레이터 이용에는 LENGOLF의 무료 기본 클럽을, 실외 코스에 나가는 날에는 프리미엄 클럽을 빌리는 조합이에요.',
        },
        {
          heading: 'LENGOLF 클럽 배송 서비스',
          body: '프리미엄 세트(남성용 Callaway Warbird, 여성용 Majesty Shuttle)는 하루 1,200바트에 빌리실 수 있고, 방콕 시내 어디든 균일 500바트로 배송해 드려요. 정오 이전에 예약하시면 당일 배송도 가능해요. LENGOLF에서 빌려 호텔로 받고, 실외 코스에서 치고, 그대로 반납하시면 되니까 대여점을 따로 찾아갈 필요가 없어요.',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'Ray S.',
          text: 'Had a lesson with Pro Min and he was very kind and helpful. Left me with a few tips to work on at the range. The facility is very nice and they\'re very friendly. Prices are very affordable compared to other similar places in the area.',
        },
        {
          reviewer_name: 'Chidbhan T.',
          text: 'Lengolf is a hidden gem right in the heart of Bangkok — super convenient location! The simulator is modern, high-quality, and incredibly accurate. Prices are very reasonable for the top-notch experience you get.',
        },
        {
          reviewer_name: 'Jack S.',
          text: 'Me and 2 friends came here for some golf after not playing for a while. The technology was fantastic and the staff were very helpful and friendly. For a very reasonable price I would definitely recommend!',
        },
      ],
    },
  },

  // ─── ZH: cost-of-renting-golf-clubs-bangkok ───
  // Every figure traces to EN price-4 (免费/150/250/400/1,200泰铢; 1,000–1,500泰铢一轮;
  // 800–1,500泰铢一日; 2,000–6,000泰铢以上单程与4,000–12,000泰铢往返; AirAsia约
  // 4,200–6,300泰铢; 5,000–15,000泰铢球包箱; 600泰铢手套; 400泰铢6颗球; 500泰铢配送).
  // The EN airline line hedges "Even full-service airlines do not include golf bags
  // in checked luggage for free" — carried as a general statement, no carrier-specific
  // fee invented. as-of 截至2026年2月 = this entry's own last_verified. The two LENGOLF
  // rows keep the ' — ' prefix so the green LENGOLF group tint survives.
  // related_slugs unchanged — all four EN targets are ZH-translated.
  {
    id: 'price-4-zh',
    page_type: 'price_guide',
    slug: 'cost-of-renting-golf-clubs-bangkok',
    title: '在曼谷租高尔夫球杆多少钱 — 场馆、球场与配送服务比价（2026）',
    meta_description:
      '在曼谷租高尔夫球杆，价格视租的地方而定，150–1,500泰铢不等。对比LENGOLF（标准套装免费、高级套装150泰铢/小时）、球场租借与专门配送服务，截至2026年2月。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'zh',
    related_slugs: ['/golf-club-rental', '/cost/how-much-does-golf-cost-bangkok', '/faq/should-i-bring-golf-clubs-to-thailand-or-rent', '/faq/cost-to-fly-with-golf-clubs-to-thailand'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        '在曼谷租高尔夫球杆，价格从免费（LENGOLF每次球位预订都包含）到室外球场一轮1,500泰铢都有。如果你是游客，正在纠结要不要把自己的球杆带过来，这篇会把每一种选择和费用都拆开讲清楚，截至2026年2月。',
      price_breakdown: [
        { item: 'LENGOLF — 标准套装（店内使用）', price: '免费', notes: '每次球位预订都包含。男士与女士套装皆有。仅限店内使用。' },
        { item: 'LENGOLF — 高级套装（Callaway／Majesty）', price: '150泰铢/小时', notes: '2小时250泰铢，4小时400泰铢，全日1,200泰铢。可带到曼谷任何一家球场。' },
        { item: '室外球场租借', price: '1,000–1,500泰铢/轮', notes: '多数球场都有整套可租。品质差异较大。' },
        { item: '专门的租借服务', price: '800–1,500泰铢/日', notes: '送到你的酒店或球场。品质更好，可选范围也更广。' },
        { item: '把球杆托运到泰国（航空公司收费）', price: '2,000–6,000泰铢以上／单程', notes: '各航空公司不同。AirAsia约4,200–6,300泰铢／单程。即便是全服务航空，托运行李额度也不会免费包含高尔夫球包。' },
        { item: '球杆硬壳托运箱', price: '5,000–15,000泰铢', notes: '一次性支出。要保护运输途中的球杆，这是必需品。' },
        { item: '高尔夫手套（LENGOLF）', price: '600泰铢', notes: 'LENGOLF店内有售。' },
        { item: '高尔夫球（LENGOLF）', price: '400泰铢／6颗', notes: 'Srixon品质。LENGOLF店内有售。' },
      ],
      comparison_with_alternatives:
        '对来曼谷旅行的球友来说，这笔账很清楚：把球杆托运过来，光航空公司的费用来回就是4,000–12,000泰铢，还要加上麻烦和被磕碰的风险。打模拟器的话，LENGOLF免费的标准球杆租借直接把这一项归零。如果你也想去室外球场打，我们的高级套装每日1,200泰铢，租一整套Callaway或Majesty，和专门的租借服务比价格相当，也比多数球场专卖店的租借便宜不少。',
      value_proposition:
        'LENGOLF是曼谷唯一一家每次球位预订都免费附带标准球杆的模拟器场馆。两手空空走进来，立刻就能打。要去室外球场的话，我们的高级球杆配送服务（每日1,200泰铢，曼谷市内配送统一500泰铢）是最省事的选择——球杆直接送到你的酒店或球场。',
      last_verified: '2026-02-19',
      sections: [
        {
          heading: '该带自己的球杆，还是租',
          body: '如果这趟行程你要下场3轮以上、手上又有自己的球杆，托运过来可能是值得的——不过即便是全服务航空，高尔夫球包也要另外收费，这笔钱得算进去。除此之外的情况，在曼谷租都更便宜也更省事。我们的建议是：打模拟器就用LENGOLF免费的标准球杆，安排了室外下场的那几天再租高级套装。',
        },
        {
          heading: 'LENGOLF球杆配送服务',
          body: '我们的高级球杆套装（男士Callaway Warbird、女士Majesty Shuttle）可以按全日1,200泰铢租用，并以统一500泰铢的费用送到曼谷任何地方。中午前下单可当日送达。也就是说，你可以在LENGOLF租，让球杆送到酒店，去室外球场打完一轮再还回来——不必再专门跑一趟租借店。',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'Ray S.',
          text: 'Had a lesson with Pro Min and he was very kind and helpful. Left me with a few tips to work on at the range. The facility is very nice and they\'re very friendly. Prices are very affordable compared to other similar places in the area.',
        },
        {
          reviewer_name: 'Chidbhan T.',
          text: 'Lengolf is a hidden gem right in the heart of Bangkok — super convenient location! The simulator is modern, high-quality, and incredibly accurate. Prices are very reasonable for the top-notch experience you get.',
        },
        {
          reviewer_name: 'Jack S.',
          text: 'Me and 2 friends came here for some golf after not playing for a while. The technology was fantastic and the staff were very helpful and friendly. For a very reasonable price I would definitely recommend!',
        },
      ],
    },
  },

  // ─── Page 5: Corporate Golf Event Cost Bangkok ───
  {
    id: 'price-5',
    page_type: 'price_guide',
    slug: 'corporate-golf-event-cost-bangkok',
    title: 'How Much Does a Corporate Golf Event Cost in Bangkok? (2026)',
    meta_description:
      'Corporate golf events in Bangkok cost 9,999–21,999 THB at LENGOLF (all-inclusive for 10–25 guests) vs 3,000–7,000 THB per person at outdoor courses. Full cost comparison inside.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'en',
    related_slugs: ['/corporate-golf-packages', '/events', '/cost/lengolf-pricing-guide', '/cost/how-much-does-golf-cost-bangkok', '/activities/group-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        'A corporate golf event in Bangkok costs between 9,999 THB (all-inclusive for 10–15 guests at LENGOLF) and 100,000+ THB for an outdoor course outing. At LENGOLF, the per-person cost is 667–1,000 THB including food, drinks, and 3 hours of golf — a fraction of outdoor alternatives.',
      price_breakdown: [
        { item: 'LENGOLF Small Package (10–15 guests)', price: '9,999 THB total', notes: '2 bays, 3 hours. Includes 10 beers, 5 cocktails, unlimited soft drinks, food from Smith & Co.' },
        { item: 'LENGOLF Medium Package (15–25 guests)', price: '21,999 THB total', notes: '4 bays (full venue), 3 hours. Includes 20 beers, 10 cocktails, unlimited soft drinks, food from Smith & Co. & Pizza Mania.' },
        { item: 'LENGOLF per-person cost (Small, 15 guests)', price: '~667 THB', notes: 'All-inclusive. No hidden fees.' },
        { item: 'LENGOLF per-person cost (Medium, 25 guests)', price: '~880 THB', notes: 'All-inclusive. No hidden fees.' },
        { item: 'Outdoor course — per person (budget)', price: '3,000–4,000 THB', notes: 'Green fee + caddie + cart. Food and transport separate.' },
        { item: 'Outdoor course — per person (premium)', price: '5,000–7,000 THB', notes: 'Top courses. Still excludes event catering and prizes.' },
        { item: 'Outdoor course — full event (20 people)', price: '80,000–150,000+ THB', notes: 'Includes green fees, caddies, transport van, lunch, prizes.' },
        { item: 'Hotel event space + catering (no golf)', price: '50,000–200,000 THB', notes: 'Conference hotels. Passive event format.' },
      ],
      comparison_with_alternatives:
        'An outdoor corporate golf day for 20 people typically costs 80,000–150,000 THB when you add up green fees (40,000–80,000 THB), caddie fees (8,000 THB), transport (10,000–15,000 THB for a chartered van), lunch (15,000–25,000 THB), and prizes. It also requires 6–8 hours including travel. At LENGOLF, the Medium Package at 21,999 THB covers everything for up to 25 people in a 3-hour format, right at BTS Chidlom. That\'s approximately 85% cheaper and half the time commitment.',
      value_proposition:
        'LENGOLF event packages are all-inclusive: golf, food, drinks, and venue — one price, no surprises. At 667–880 THB per person, it\'s the most affordable corporate golf experience in Bangkok. Book a bay or the full venue for a team building session that everyone can enjoy — golfers and non-golfers alike.',
      last_verified: '2026-02-19',
      sections: [
        {
          heading: 'What\'s Included in LENGOLF Event Packages',
          body: 'Both packages include: exclusive bay access, golf simulator play on 100+ world-famous courses, a tournament format with scoring and leaderboards, beer (Singha and Asahi), cocktails, unlimited soft drinks, and food platters from Smith & Co. (and Pizza Mania for Medium packages). The venue handles all setup — tournament formatting, scoring, music — so the organizer just shows up with their team. Customization options include: decorations, custom trophies, branded scorecards, and tailored food menus.',
        },
        {
          heading: 'Why Non-Golfers Love It Too',
          body: 'The biggest advantage of LENGOLF over outdoor corporate golf is inclusivity. At an outdoor course, non-golfers have nothing to do. At LENGOLF, the simulator makes golf accessible and fun for complete beginners — the technology tracks shots and provides a game-like experience regardless of skill level. Add cocktails, competitive leaderboards, and a party atmosphere, and you have a team activity that actually engages everyone.',
        },
        {
          heading: 'How to Book a Corporate Event',
          body: 'Contact us via LINE (@lengolf) or call 096-668-2335 to discuss your event. We recommend booking at least 2 weeks in advance for Medium packages (full venue). Small packages can often be arranged within a few days. Custom packages are available for groups larger than 25 or with specific requirements.',
        },
      ],
      curated_reviews: [
        VALUE_REVIEWS.fritz,
        VALUE_REVIEWS.nathan_marina,
        VALUE_REVIEWS.tttnatorn,
      ],
    },
  },

  // ─── TH: corporate-golf-event-cost-bangkok ───
  // related_slugs: '/corporate-golf-packages' is translated in NO locale, so the
  // TH entry substitutes '/guide/corporate-golf-events-bangkok' — the closest
  // in-locale target (TH-translated corporate-event guide) and the only
  // allowlisted path covering the same intent. All other EN targets kept.
  // The EN phone literal 02-658-6633 is carried unchanged (see report: it
  // disagrees with BUSINESS_INFO.phone rendered by the same page's CTA).
  {
    id: 'price-5-th',
    page_type: 'price_guide',
    slug: 'corporate-golf-event-cost-bangkok',
    title: 'จัดกิจกรรมกอล์ฟบริษัทในกรุงเทพฯ ราคาเท่าไหร่ (2026)',
    meta_description:
      'จัดกิจกรรมกอล์ฟบริษัทในกรุงเทพฯ ที่ LENGOLF ราคา 9,999-21,999 บาท (เหมารวมสำหรับ 10-25 คน) เทียบกับสนามกลางแจ้งที่ 3,000-7,000 บาทต่อคน พร้อมเทียบค่าใช้จ่ายแบบละเอียด',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'th',
    related_slugs: ['/guide/corporate-golf-events-bangkok', '/events', '/cost/lengolf-pricing-guide', '/cost/how-much-does-golf-cost-bangkok', '/activities/group-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        'การจัดกิจกรรมกอล์ฟบริษัทในกรุงเทพฯ มีค่าใช้จ่ายตั้งแต่ 9,999 บาท (เหมารวมสำหรับ 10-15 คนที่ LENGOLF) ไปจนถึงกว่า 100,000 บาท สำหรับการออกรอบที่สนามกลางแจ้ง ที่ LENGOLF ค่าใช้จ่ายต่อคนอยู่ที่ 667-1,000 บาท ซึ่งรวมอาหาร เครื่องดื่ม และการเล่นกอล์ฟ 3 ชั่วโมงแล้ว หรือเป็นเพียงเศษเสี้ยวของทางเลือกกลางแจ้ง (ข้อมูล ณ กุมภาพันธ์ 2026)',
      price_breakdown: [
        { item: 'แพ็กเกจขนาดเล็กของ LENGOLF (10-15 คน)', price: '9,999 บาทเหมารวม', notes: '2 เบย์ 3 ชั่วโมง รวมเบียร์ 10 แก้ว ค็อกเทล 5 แก้ว น้ำอัดลมไม่จำกัด และอาหารจาก Smith & Co.' },
        { item: 'แพ็กเกจขนาดกลางของ LENGOLF (15-25 คน)', price: '21,999 บาทเหมารวม', notes: '4 เบย์ (เหมาทั้งร้าน) 3 ชั่วโมง รวมเบียร์ 20 แก้ว ค็อกเทล 10 แก้ว น้ำอัดลมไม่จำกัด และอาหารจาก Smith & Co. และ Pizza Mania' },
        { item: 'ค่าใช้จ่ายต่อคนที่ LENGOLF (ขนาดเล็ก 15 คน)', price: 'ประมาณ 667 บาท', notes: 'เหมารวมทุกอย่าง ไม่มีค่าใช้จ่ายแอบแฝง' },
        { item: 'ค่าใช้จ่ายต่อคนที่ LENGOLF (ขนาดกลาง 25 คน)', price: 'ประมาณ 880 บาท', notes: 'เหมารวมทุกอย่าง ไม่มีค่าใช้จ่ายแอบแฝง' },
        { item: 'สนามกลางแจ้ง — ต่อคน (ระดับประหยัด)', price: '3,000-4,000 บาท', notes: 'ค่ากรีนฟี บวกค่าแคดดี้ บวกรถกอล์ฟ ยังไม่รวมอาหารและค่าเดินทาง' },
        { item: 'สนามกลางแจ้ง — ต่อคน (ระดับพรีเมียม)', price: '5,000-7,000 บาท', notes: 'สนามชั้นนำ ยังไม่รวมค่าจัดเลี้ยงและของรางวัล' },
        { item: 'สนามกลางแจ้ง — จัดงานเต็มรูปแบบ (20 คน)', price: '80,000-150,000+ บาท', notes: 'รวมค่ากรีนฟี ค่าแคดดี้ รถตู้รับส่ง อาหารกลางวัน และของรางวัล' },
        { item: 'ห้องจัดงานในโรงแรมพร้อมจัดเลี้ยง (ไม่มีกอล์ฟ)', price: '50,000-200,000 บาท', notes: 'โรงแรมที่รับจัดประชุม รูปแบบงานที่ผู้ร่วมงานเป็นฝ่ายนั่งฟัง' },
      ],
      comparison_with_alternatives:
        'การจัดกิจกรรมกอล์ฟบริษัทกลางแจ้งสำหรับ 20 คน โดยทั่วไปมีค่าใช้จ่าย 80,000-150,000 บาท เมื่อรวมค่ากรีนฟี (40,000-80,000 บาท) ค่าแคดดี้ (8,000 บาท) ค่าเดินทาง (10,000-15,000 บาท สำหรับรถตู้เหมา) อาหารกลางวัน (15,000-25,000 บาท) และของรางวัล อีกทั้งยังใช้เวลา 6-8 ชั่วโมงรวมการเดินทาง ส่วนที่ LENGOLF แพ็กเกจขนาดกลางที่ 21,999 บาท ครอบคลุมทุกอย่างสำหรับผู้ร่วมงานสูงสุด 25 คน ในรูปแบบ 3 ชั่วโมง ที่ BTS Chidlom พอดี นั่นคือประหยัดกว่าราว 85 เปอร์เซ็นต์ และใช้เวลาเพียงครึ่งเดียว',
      value_proposition:
        'แพ็กเกจจัดงานของ LENGOLF เป็นแบบเหมารวมทั้งกอล์ฟ อาหาร เครื่องดื่ม และสถานที่ จ่ายราคาเดียว ไม่มีอะไรมาเซอร์ไพรส์ทีหลัง ที่ 667-880 บาทต่อคน นี่คือประสบการณ์กอล์ฟสำหรับองค์กรที่คุ้มค่าที่สุดในกรุงเทพฯ จองเบย์เดียวหรือเหมาทั้งร้านก็ได้ สำหรับกิจกรรมสร้างทีมที่ทุกคนสนุกไปด้วยกัน ทั้งคนที่เล่นกอล์ฟและคนที่ไม่เคยเล่น',
      last_verified: '2026-02-19',
      sections: [
        {
          heading: 'แพ็กเกจจัดงานของ LENGOLF รวมอะไรบ้าง',
          body: 'ทั้งสองแพ็กเกจรวม การใช้เบย์แบบเอ็กซ์คลูซีฟ การเล่นกอล์ฟซิมูเลเตอร์บนสนามระดับโลกกว่า 100 สนาม รูปแบบการแข่งขันพร้อมระบบนับคะแนนและกระดานผู้นำ เบียร์ (Singha และ Asahi) ค็อกเทล น้ำอัดลมไม่จำกัด และอาหารจัดชุดจาก Smith & Co. (และ Pizza Mania สำหรับแพ็กเกจขนาดกลาง) ทางร้านจัดการเตรียมงานให้ทั้งหมด ทั้งการวางรูปแบบการแข่งขัน การนับคะแนน และเพลง ผู้จัดงานจึงแค่พาทีมมาถึงก็พอ ส่วนตัวเลือกปรับแต่งเพิ่มเติมมีทั้งการตกแต่งสถานที่ ถ้วยรางวัลตามสั่ง สกอร์การ์ดติดโลโก้บริษัท และเมนูอาหารที่ออกแบบเฉพาะ',
        },
        {
          heading: 'ทำไมคนที่ไม่เล่นกอล์ฟก็ชอบ',
          body: 'ข้อได้เปรียบที่ใหญ่ที่สุดของ LENGOLF เหนือการจัดกอล์ฟบริษัทกลางแจ้งคือทุกคนมีส่วนร่วมได้ ที่สนามกลางแจ้ง คนที่ไม่เล่นกอล์ฟแทบไม่มีอะไรทำ แต่ที่ LENGOLF ซิมูเลเตอร์ทำให้กอล์ฟเป็นเรื่องเข้าถึงได้และสนุกแม้สำหรับคนที่ไม่เคยเล่นมาก่อน เพราะเทคโนโลยีจะจับข้อมูลการตีและให้ประสบการณ์เหมือนเล่นเกม ไม่ว่าจะฝีมือระดับไหน เมื่อบวกกับค็อกเทล กระดานผู้นำที่ชวนแข่งขัน และบรรยากาศแบบปาร์ตี้ ก็ได้กิจกรรมทีมที่ทุกคนอินไปด้วยกันจริง ๆ',
        },
        {
          heading: 'จองกิจกรรมองค์กรได้อย่างไร',
          body: 'ติดต่อเราทาง LINE (@lengolf) หรือโทร 096-668-2335 เพื่อพูดคุยรายละเอียดงานของคุณ เราแนะนำให้จองล่วงหน้าอย่างน้อย 2 สัปดาห์สำหรับแพ็กเกจขนาดกลาง (เหมาทั้งร้าน) ส่วนแพ็กเกจขนาดเล็กมักจัดได้ภายในไม่กี่วัน และมีแพ็กเกจแบบปรับตามความต้องการสำหรับกลุ่มที่ใหญ่กว่า 25 คน หรือมีข้อกำหนดเฉพาะ',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'Fritz P.',
          text: 'So much fun!! Great price, great service, amazing experience.',
        },
        {
          reviewer_name: 'Suuaap',
          text: 'It was our first time holding a golf club and Nate took his time to teach us the basics and more. Price was totally worth it and fair. We know we\'ll come back!',
        },
        {
          reviewer_name: 'tttnatorn',
          text: 'Great spot for a golf sim! Accurate tracking, good vibes, and helpful staff. Fair prices too. Perfect for practice or a fun round.',
        },
      ],
    },
  },

  // ─── JA: corporate-golf-event-cost-bangkok ───
  // Figures traced to the EN price-5 entry (9,999 / 21,999 / 約667 / 約880 /
  // 3,000〜4,000 / 5,000〜7,000 / 80,000〜150,000以上 / 50,000〜200,000 / 約85%),
  // including the phone number 02-658-6633 verbatim. The three
  // 'Outdoor course — ' rows keep the em-dash separator under one 屋外コース
  // group, mirroring the EN table's own shape. related_slugs SUBSTITUTION:
  // /corporate-golf-packages is translated in no locale, so it is replaced with
  // /guide/corporate-golf-events-bangkok — the JA-translated corporate-golf
  // guide, the closest in-locale equivalent. The other four are unchanged.
  {
    id: 'price-5-ja',
    page_type: 'price_guide',
    slug: 'corporate-golf-event-cost-bangkok',
    title: 'バンコクの企業ゴルフイベント費用はいくら？（2026年）',
    meta_description:
      'バンコクの企業ゴルフイベントは、LENGOLFなら9,999〜21,999THB（10〜25名の全込み料金）。屋外コースは1人あたり3,000〜7,000THBが目安です。費用をまるごと比較します（2026年2月現在）。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'ja',
    related_slugs: ['/guide/corporate-golf-events-bangkok', '/events', '/cost/lengolf-pricing-guide', '/cost/how-much-does-golf-cost-bangkok', '/activities/group-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        'バンコクでの企業ゴルフイベントの費用は、LENGOLFの10〜15名向け全込みプラン9,999THBから、屋外コースを使った100,000THB超の催しまで幅があります。LENGOLFの場合、1人あたり667〜1,000THBで、フードもドリンクも3時間のゴルフもすべて含まれます——屋外の選択肢と比べれば、ごく一部の費用に収まります（2026年2月現在）。',
      price_breakdown: [
        { item: 'LENGOLFスモールパッケージ（10〜15名）', price: '合計9,999THB', notes: '2ベイ・3時間。ビール10杯、カクテル5杯、ソフトドリンク飲み放題、Smith & Co.のフード付き。' },
        { item: 'LENGOLFミディアムパッケージ（15〜25名）', price: '合計21,999THB', notes: '4ベイ（全館貸切）・3時間。ビール20杯、カクテル10杯、ソフトドリンク飲み放題、Smith & Co.とPizza Maniaのフード付き。' },
        { item: 'LENGOLFの1人あたり費用（スモール・15名）', price: '約667THB', notes: 'すべて込み。追加費用はありません。' },
        { item: 'LENGOLFの1人あたり費用（ミディアム・25名）', price: '約880THB', notes: 'すべて込み。追加費用はありません。' },
        { item: '屋外コース — 1人あたり（標準クラス）', price: '3,000〜4,000THB', notes: 'グリーンフィー、キャディー、カート込み。食事と移動は別途。' },
        { item: '屋外コース — 1人あたり（プレミアム）', price: '5,000〜7,000THB', notes: '上位コースの場合。イベントのケータリングや賞品は含みません。' },
        { item: '屋外コース — イベント全体（20名）', price: '80,000〜150,000THB以上', notes: 'グリーンフィー、キャディー、送迎バン、昼食、賞品を含む場合。' },
        { item: 'ホテルの会場費とケータリング（ゴルフなし）', price: '50,000〜200,000THB', notes: 'カンファレンス向けホテル。受け身になりやすい形式です。' },
      ],
      comparison_with_alternatives:
        '20名規模の屋外企業ゴルフは、グリーンフィー（40,000〜80,000THB）、キャディーフィー（8,000THB）、送迎（チャーターバンで10,000〜15,000THB）、昼食（15,000〜25,000THB）、賞品を合算すると、通常80,000〜150,000THBかかります。移動を含めて6〜8時間も必要です。LENGOLFなら、ミディアムパッケージ21,999THBで最大25名分がすべて含まれ、形式は3時間、場所はBTSチットロム。費用はおよそ85%抑えられ、拘束時間も半分で済みます。',
      value_proposition:
        'LENGOLFのイベントパッケージはすべて込みです——ゴルフ、フード、ドリンク、会場が一つの価格に収まり、あとから増えるものはありません。1人あたり667〜880THBで、バンコクで最も手頃な企業ゴルフ体験になります。ベイ単位でも全館貸切でも、ゴルフをする人もしない人も一緒に楽しめるチームビルディングの場としてご利用いただけます。',
      last_verified: '2026-02-19',
      sections: [
        {
          heading: 'LENGOLFのイベントパッケージに含まれるもの',
          body: 'どちらのパッケージにも、ベイの貸切利用、世界の名コース100以上でのシミュレータープレー、スコアとリーダーボードを使ったトーナメント形式、ビール（SinghaとAsahi）、カクテル、ソフトドリンク飲み放題、Smith & Co.のフードプラッター（ミディアムパッケージではPizza Maniaも）が含まれます。トーナメントの進行、スコアリング、音楽まで会場側で準備しますので、幹事の方はチームと一緒にお越しいただくだけです。装飾、オリジナルトロフィー、ロゴ入りスコアカード、フードメニューの調整といったカスタマイズにも対応しています。',
        },
        {
          heading: 'ゴルフをしない人にも好評な理由',
          body: '屋外の企業ゴルフに対するLENGOLFのいちばんの強みは、誰も置き去りにしないことです。屋外コースでは、ゴルフをしない人にやることがありません。LENGOLFではシミュレーターがゴルフを扱いやすい遊びに変えてくれます——ショットを計測してゲームのように楽しめるので、技量に関係なく参加できます。そこにカクテルとリーダーボードの競争、パーティらしい雰囲気が加われば、全員が本当に参加できるチーム企画になります。',
        },
        {
          heading: '企業イベントのご予約方法',
          body: 'ご相談はLINE（@lengolf）または096-668-2335までお電話ください。ミディアムパッケージ（全館貸切）は2週間以上前のご予約をおすすめしています。スモールパッケージは数日前でも手配できることが多いです。25名を超えるグループや、特別なご要望がある場合には、カスタムパッケージもご用意します。',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'Fritz P.',
          text: 'So much fun!! Great price, great service, amazing experience.',
        },
        {
          reviewer_name: 'Suuaap',
          text: 'It was our first time holding a golf club and Nate took his time to teach us the basics and more. Price was totally worth it and fair. We know we\'ll come back!',
        },
        {
          reviewer_name: 'tttnatorn',
          text: 'Great spot for a golf sim! Accurate tracking, good vibes, and helpful staff. Fair prices too. Perfect for practice or a fun round.',
        },
      ],
    },
  },

  // ─── KO: corporate-golf-event-cost-bangkok ───
  // Corporate-event pricing. All figures from the EN entry (9,999 / 21,999바트,
  // 1인당 약 667 / 880바트, 실외 3,000~7,000바트, 전체 80,000~150,000바트 이상,
  // 약 85% 절감), and the phone number 02-658-6633 copied verbatim. 올인클루시브 is
  // written closed per the glossary. related_slugs SUBSTITUTION: EN opens with
  // /corporate-golf-packages, which is translated in no locale and would 301 a KO
  // reader to English — replaced with /guide/corporate-golf-events-bangkok, the
  // KO-translated guide on the same topic (the closest in-locale equivalent).
  {
    id: 'price-5-ko',
    page_type: 'price_guide',
    slug: 'corporate-golf-event-cost-bangkok',
    title: '방콕 기업 골프 행사 비용은 얼마일까 (2026년)',
    meta_description:
      '방콕 기업 골프 행사 비용은 LENGOLF 올인클루시브 9,999~21,999바트(10~25명), 실외 코스는 1인당 3,000~7,000바트예요. 전체 비용을 항목별로 비교해 드릴게요 (2026년 2월 기준).',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'ko',
    related_slugs: ['/guide/corporate-golf-events-bangkok', '/events', '/cost/lengolf-pricing-guide', '/cost/how-much-does-golf-cost-bangkok', '/activities/group-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        '방콕에서 기업 골프 행사를 열면 비용은 LENGOLF 올인클루시브 9,999바트(10~15명)부터 실외 코스 아웃팅 100,000바트 이상까지예요. LENGOLF에서는 음식과 음료, 3시간 골프까지 포함해 1인당 667~1,000바트로, 실외 행사와 비교하면 아주 일부예요.',
      price_breakdown: [
        { item: 'LENGOLF 소규모 패키지 (10~15명)', price: '총 9,999바트', notes: '베이 2개, 3시간. 맥주 10잔, 칵테일 5잔, 소프트드링크 무제한, Smith & Co.의 음식 포함.' },
        { item: 'LENGOLF 중규모 패키지 (15~25명)', price: '총 21,999바트', notes: '베이 4개(전관), 3시간. 맥주 20잔, 칵테일 10잔, 소프트드링크 무제한, Smith & Co.와 Pizza Mania의 음식 포함.' },
        { item: 'LENGOLF 1인당 비용 (소규모, 15명)', price: '약 667바트', notes: '올인클루시브. 숨은 비용이 없어요.' },
        { item: 'LENGOLF 1인당 비용 (중규모, 25명)', price: '약 880바트', notes: '올인클루시브. 숨은 비용이 없어요.' },
        { item: '실외 코스 — 1인당 (보급형)', price: '3,000~4,000바트', notes: '그린피에 캐디피와 카트. 음식과 이동은 별도예요.' },
        { item: '실외 코스 — 1인당 (프리미엄)', price: '5,000~7,000바트', notes: '최상급 코스. 행사 케이터링과 상품은 여전히 별도예요.' },
        { item: '실외 코스 — 전체 행사 (20명)', price: '80,000~150,000바트 이상', notes: '그린피, 캐디피, 이동 밴, 점심, 상품 포함.' },
        { item: '호텔 행사장과 케이터링 (골프 없음)', price: '50,000~200,000바트', notes: '컨벤션 호텔. 참여형이 아닌 관람형 행사 형식이에요.' },
      ],
      comparison_with_alternatives:
        '20명이 실외에서 기업 골프 행사를 하면 그린피 40,000~80,000바트, 캐디피 8,000바트, 전세 밴 이동 10,000~15,000바트, 점심 15,000~25,000바트에 상품까지 더해 보통 80,000~150,000바트가 들어요. 이동을 포함해 6~8시간도 필요하고요. LENGOLF에서는 중규모 패키지 21,999바트로 최대 25명까지 3시간 동안 필요한 것이 모두 해결되고, 장소도 BTS 칫롬역 바로 앞이에요. 비용은 약 85% 저렴하고 시간은 절반이면 돼요.',
      value_proposition:
        'LENGOLF 이벤트 패키지는 골프와 음식, 음료, 공간까지 하나의 가격에 모두 포함하는 올인클루시브예요. 1인당 667~880바트로 방콕에서 가장 부담 없는 기업 골프 행사예요. 베이 하나만 잡으셔도, 전관을 빌리셔도 좋아요. 골프를 치는 분도 치지 않는 분도 모두 즐길 수 있는 팀 빌딩 자리가 돼요.',
      last_verified: '2026-02-19',
      sections: [
        {
          heading: 'LENGOLF 이벤트 패키지에 포함되는 것',
          body: '두 패키지 모두 베이 단독 이용, 세계적으로 유명한 100개 이상 코스의 골프 시뮬레이터 플레이, 스코어와 리더보드가 있는 토너먼트 형식, 맥주(Singha와 Asahi), 칵테일, 소프트드링크 무제한, Smith & Co.의 음식 플래터(중규모 패키지에는 Pizza Mania도 함께)를 제공해요. 토너먼트 구성과 채점, 음악까지 매장에서 모두 준비하니 주최자는 팀만 데리고 오시면 돼요. 장식과 맞춤 트로피, 브랜드 스코어카드, 메뉴 구성처럼 원하시는 대로 맞춰 드릴 수 있는 부분도 있어요.',
        },
        {
          heading: '골프를 치지 않는 분도 즐거운 이유',
          body: '실외 기업 골프와 비교했을 때 LENGOLF의 가장 큰 장점은 누구나 함께할 수 있다는 점이에요. 실외 코스에서는 골프를 치지 않는 분이 할 일이 없지만, LENGOLF에서는 시뮬레이터 덕분에 클럽을 처음 잡아 보는 분도 재미있게 참여할 수 있어요. 실력과 상관없이 샷을 추적해 주고 게임처럼 즐길 수 있으니까요. 여기에 칵테일과 순위 경쟁, 파티 같은 분위기까지 더해지면 모두가 실제로 참여하는 팀 활동이 돼요.',
        },
        {
          heading: '기업 행사 예약 방법',
          body: 'LINE(@lengolf)이나 전화 096-668-2335으로 연락 주시면 행사 내용을 함께 상의해 드려요. 중규모 패키지(전관)는 최소 2주 전 예약을 권해 드리고, 소규모 패키지는 며칠 전에도 준비되는 경우가 많아요. 25명이 넘거나 특별한 요청이 있으시면 맞춤 패키지도 가능해요.',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'Fritz P.',
          text: 'So much fun!! Great price, great service, amazing experience.',
        },
        {
          reviewer_name: 'Suuaap',
          text: 'It was our first time holding a golf club and Nate took his time to teach us the basics and more. Price was totally worth it and fair. We know we\'ll come back!',
        },
        {
          reviewer_name: 'tttnatorn',
          text: 'Great spot for a golf sim! Accurate tracking, good vibes, and helpful staff. Fair prices too. Perfect for practice or a fun round.',
        },
      ],
    },
  },

  // ─── ZH: corporate-golf-event-cost-bangkok ───
  // Every figure traces to EN price-5, including two internally inconsistent ones
  // carried verbatim rather than reconciled: the intro says 667–1,000泰铢/人 (Small
  // package only) while value_proposition says 667–880泰铢/人 (both packages at max
  // headcount) — flagged in the batch report, not silently harmonized. The phone
  // number 02-658-6633 is likewise carried exactly as the EN entry states it even
  // though it disagrees with BUSINESS_INFO.phone (096-668-2335) rendered in this
  // page's own CTA — also flagged. The three 室外球场 rows keep the ' — ' separator
  // (EN groups them; the four LENGOLF rows have no separator in EN and none here).
  // EN related_slug /corporate-golf-packages is translated in NO locale and would
  // 301 a ZH reader to English, so it is replaced with the ZH corporate-events
  // guide /guide/corporate-golf-events-bangkok, the nearest in-locale equivalent.
  {
    id: 'price-5-zh',
    page_type: 'price_guide',
    slug: 'corporate-golf-event-cost-bangkok',
    title: '在曼谷办企业高尔夫活动要多少钱 — 9,999–21,999泰铢套餐全解析',
    meta_description:
      '在曼谷办企业高尔夫活动，LENGOLF全包套餐9,999–21,999泰铢，可容纳10–25人；室外球场则要每人3,000–7,000泰铢。完整费用对比在此，截至2026年2月。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'zh',
    related_slugs: ['/guide/corporate-golf-events-bangkok', '/events', '/cost/lengolf-pricing-guide', '/cost/how-much-does-golf-cost-bangkok', '/activities/group-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        '在曼谷办一场企业高尔夫活动，费用从9,999泰铢（LENGOLF全包套餐，10–15人）到100,000泰铢以上（室外球场包场）都有。在LENGOLF，每人667–1,000泰铢就包含餐点、酒水和3小时高尔夫，只是室外方案的一个零头，截至2026年2月。',
      price_breakdown: [
        { item: 'LENGOLF小型套餐（10–15人）', price: '9,999泰铢（总价）', notes: '2个球位，3小时。含啤酒10份、鸡尾酒5杯、软饮无限畅饮，以及Smith & Co.的餐点。' },
        { item: 'LENGOLF中型套餐（15–25人）', price: '21,999泰铢（总价）', notes: '4个球位（整场包下），3小时。含啤酒20份、鸡尾酒10杯、软饮无限畅饮，以及Smith & Co.与Pizza Mania的餐点。' },
        { item: 'LENGOLF人均费用（小型，15人）', price: '约667泰铢', notes: '全包价。没有隐藏费用。' },
        { item: 'LENGOLF人均费用（中型，25人）', price: '约880泰铢', notes: '全包价。没有隐藏费用。' },
        { item: '室外球场 — 人均（经济型）', price: '3,000–4,000泰铢', notes: '果岭费加球童费加球车费。餐饮与交通另计。' },
        { item: '室外球场 — 人均（高端型）', price: '5,000–7,000泰铢', notes: '顶级球场。仍不含活动餐饮与奖品。' },
        { item: '室外球场 — 整场活动（20人）', price: '80,000–150,000泰铢以上', notes: '含果岭费、球童费、包车、午餐与奖品。' },
        { item: '酒店活动场地加餐饮（不含高尔夫）', price: '50,000–200,000泰铢', notes: '会议型酒店。属于被动式的活动形式。' },
      ],
      comparison_with_alternatives:
        '20人的室外企业高尔夫日，把果岭费（40,000–80,000泰铢）、球童费（8,000泰铢）、交通（包一辆商务车10,000–15,000泰铢）、午餐（15,000–25,000泰铢）和奖品加起来，通常是80,000–150,000泰铢，而且连交通在内要占掉6–8小时。在LENGOLF，中型套餐21,999泰铢，最多25人的一切开销都包含在内，3小时的形式，地点就在BTS Chidlom。算下来大约便宜85%，时间也只要一半。',
      value_proposition:
        'LENGOLF的活动套餐是全包的：高尔夫、餐点、酒水和场地，一个价格，没有意外。每人667–880泰铢，是曼谷最实惠的企业高尔夫方案。订一个球位或整场包下，做一次团建——会打球的和不会打球的都能玩得起来。',
      last_verified: '2026-02-19',
      sections: [
        {
          heading: 'LENGOLF活动套餐包含什么',
          body: '两种套餐都包含：专属球位使用、100多座世界名场的模拟器体验、带计分与排行榜的比赛形式、啤酒（Singha与Asahi）、鸡尾酒、软饮无限畅饮，以及Smith & Co.的餐点拼盘（中型套餐还加上Pizza Mania）。场地方会把一切都布置好——赛制、计分、音乐——组织者带着团队来就行。可定制的部分包括：现场布置、定制奖杯、印制记分卡，以及按需求调整的餐单。',
        },
        {
          heading: '为什么不打高尔夫的人也喜欢',
          body: 'LENGOLF相较室外企业高尔夫最大的优势，是没有人会被晾在一边。在室外球场，不打球的同事无事可做。在LENGOLF，模拟器让完全零基础的人也能上手、也觉得好玩——不管水平如何，设备都会追踪每一杆，把它变成一场游戏。再加上鸡尾酒、你追我赶的排行榜和热闹的气氛，这才是一个真正能把所有人卷进来的团队活动。',
        },
        {
          heading: '如何预订企业活动',
          body: '请通过LINE（@lengolf）或致电096-668-2335与我们联系，聊聊你的活动安排。中型套餐（整场包下）建议至少提前2周预订，小型套餐通常几天内就能安排好。25人以上的团队或有特殊需求的，我们也可以做定制套餐。',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'Fritz P.',
          text: 'So much fun!! Great price, great service, amazing experience.',
        },
        {
          reviewer_name: 'Suuaap',
          text: 'It was our first time holding a golf club and Nate took his time to teach us the basics and more. Price was totally worth it and fair. We know we\'ll come back!',
        },
        {
          reviewer_name: 'tttnatorn',
          text: 'Great spot for a golf sim! Accurate tracking, good vibes, and helpful staff. Fair prices too. Perfect for practice or a fun round.',
        },
      ],
    },
  },

  // ─── Page 6: Golf Lesson Prices Bangkok ───
  {
    id: 'price-6',
    page_type: 'price_guide',
    slug: 'golf-lesson-prices-bangkok',
    title: 'Bangkok Golf Lesson Prices (2026): Indoor & Outdoor Compared',
    meta_description:
      'Golf lesson prices in Bangkok: LENGOLF from 1,800 THB/hr (free 1-hour trial), outdoor pros from 2,000–5,000 THB/hr. Compare indoor simulator coaching vs driving range lessons.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'en',
    related_slugs: ['/lessons', '/cost/lengolf-pricing-guide', '/cost/how-much-does-golf-cost-bangkok', '/faq/best-way-to-learn-golf-in-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        'Golf lessons in Bangkok cost between 1,800 and 5,000 THB per hour, depending on the instructor, venue, and format. LENGOLF offers private lessons from 1,800 THB/hour with a PGA-qualified pro — and your first hour is free as a trial lesson.',
      price_breakdown: [
        { item: 'LENGOLF — Private lesson (1 golfer)', price: '1,800 THB/hr', notes: 'With a PGA-qualified pro. Simulator provides detailed swing data.' },
        { item: 'LENGOLF — Semi-private (2 golfers)', price: '2,400 THB/hr', notes: '1,200 THB per person. Same pro, shared session.' },
        { item: 'LENGOLF — Group lesson (3–5 golfers)', price: '2,900 THB/hr', notes: '580–967 THB per person. Great for friends learning together.' },
        { item: 'LENGOLF — 5-hour package (1 golfer)', price: '8,500 THB', notes: '1,700 THB/hr effective. 6-month validity.' },
        { item: 'LENGOLF — 10-hour package (1 golfer)', price: '16,000 THB', notes: '1,600 THB/hr effective. 12-month validity.' },
        { item: 'LENGOLF — Starter Package', price: '11,000 THB', notes: '5 hrs coaching + 5 hrs practice. Free golf glove. Best for complete beginners. 6-month validity.' },
        { item: 'LENGOLF — Sim to Fairway Package', price: '13,499 THB', notes: '5 hrs indoor coaching + 1 on-course lesson. On-course fees extra.' },
        { item: 'LENGOLF — Free trial lesson', price: '0 THB', notes: '1 hour with a pro. No obligation. Book via LINE or website.' },
        { item: 'Outdoor driving range lesson', price: '2,000–3,500 THB/hr', notes: 'Varies by instructor and range. Range balls usually extra.' },
        { item: 'Premium outdoor coaching (top pros)', price: '3,500–5,000 THB/hr', notes: 'PGA-certified coaches at top facilities. Often require course membership.' },
        { item: 'Group clinic at outdoor range', price: '1,000–2,000 THB/person', notes: 'Groups of 4–8. Less individual attention.' },
      ],
      comparison_with_alternatives:
        'Indoor simulator lessons have a significant advantage over outdoor driving range coaching: real-time swing data. LENGOLF\'s Bravo simulators measure ball speed, launch angle, spin rate, carry distance, and club path on every shot. This data-driven feedback accelerates learning in a way that outdoor range lessons — where you watch the ball fly and guess — simply cannot match. The air-conditioned indoor environment also means comfortable, focused practice regardless of Bangkok\'s heat, rain, or pollution.',
      value_proposition:
        'LENGOLF\'s free 1-hour trial lesson removes all risk. Try a lesson, see the swing data, and decide if it\'s right for you — at zero cost. For ongoing coaching, our Starter Package (11,000 THB for 5 hours of coaching plus 5 hours of practice time plus a free golf glove) is the best-value beginner package in Bangkok.',
      last_verified: '2026-02-19',
      sections: [
        {
          heading: 'What Makes Simulator Lessons Different',
          body: 'A simulator lesson at LENGOLF gives you instant, precise feedback after every swing: ball speed, launch angle, backspin, sidespin, carry distance, total distance, and club path. Your coach uses this data to diagnose issues and track improvement over time. In outdoor range lessons, you\'re essentially guessing at these numbers by watching ball flight. For beginners, this data-driven approach dramatically speeds up the learning process. For experienced golfers, it helps fine-tune specific aspects of your swing with clinical precision.',
        },
        {
          heading: 'LENGOLF Coaching Team',
          body: 'LENGOLF\'s coaches are PGA-qualified professionals with experience teaching all skill levels, from complete beginners to single-digit handicappers. Lessons are conducted in English and Thai. Each lesson includes a digital summary of your session data that you can review at home. The coaching bay is identical to the regular bays — same simulator, same club selection — so you can immediately practice what you\'ve learned in a subsequent self-practice session.',
        },
        {
          heading: 'Best Path for Beginners',
          body: 'If you\'ve never played golf: start with the free trial lesson. If you enjoy it, the Starter Package (11,000 THB) is the most structured path — 5 hours of coaching to build fundamentals, plus 5 hours of practice to reinforce them, with a free golf glove to get you started. The 6-month validity means no pressure to rush. After completing the Starter Package, most students move to the 5-hour or 10-hour coaching packages for continued improvement.',
        },
      ],
      curated_reviews: [
        VALUE_REVIEWS.ray,
        VALUE_REVIEWS.nathan_marina,
        VALUE_REVIEWS.fritz,
      ],
    },
  },

  // ─── TH: golf-lesson-prices-bangkok ───
  // lesson = คอร์สเรียน per glossary; the free trial is คอร์สเรียนทดลองฟรี.
  // The EN's language line ('Lessons are conducted in English and Thai') is a
  // POSITIVE, LENGOLF-scoped claim in the source and is carried as-is — no
  // language claim was added, removed or widened. Per-person derived figures
  // (1,200 / 580-967 บาท) and effective rates (1,700 / 1,600 บาท/ชม.) all come
  // from the EN price-6 notes fields.
  {
    id: 'price-6-th',
    page_type: 'price_guide',
    slug: 'golf-lesson-prices-bangkok',
    title: 'ราคาคอร์สเรียนกอล์ฟในกรุงเทพฯ ปี 2026 เทียบในร่มกับกลางแจ้ง',
    meta_description:
      'ราคาคอร์สเรียนกอล์ฟในกรุงเทพฯ ที่ LENGOLF เริ่มต้น 1,800 บาท/ชั่วโมง (ทดลองเรียนฟรี 1 ชั่วโมง) ส่วนโปรสอนกลางแจ้งอยู่ที่ 2,000-5,000 บาท/ชั่วโมง เทียบการเรียนบนซิมูเลเตอร์กับที่สนามไดรฟ์',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'th',
    related_slugs: ['/lessons', '/cost/lengolf-pricing-guide', '/cost/how-much-does-golf-cost-bangkok', '/faq/best-way-to-learn-golf-in-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        'คอร์สเรียนกอล์ฟในกรุงเทพฯ มีราคาอยู่ระหว่าง 1,800 ถึง 5,000 บาทต่อชั่วโมง ขึ้นอยู่กับผู้สอน สถานที่ และรูปแบบการเรียน ที่ LENGOLF คอร์สเรียนส่วนตัวเริ่มต้นที่ 1,800 บาทต่อชั่วโมง กับโปรที่ผ่านการรับรองจาก PGA และชั่วโมงแรกของคุณเรียนฟรีในรูปแบบคอร์สเรียนทดลอง (ข้อมูล ณ กุมภาพันธ์ 2026)',
      price_breakdown: [
        { item: 'LENGOLF — คอร์สเรียนส่วนตัว (1 คน)', price: '1,800 บาท/ชม.', notes: 'สอนโดยโปรที่ผ่านการรับรองจาก PGA ซิมูเลเตอร์ให้ข้อมูลวงสวิงอย่างละเอียด' },
        { item: 'LENGOLF — เรียนกึ่งส่วนตัว (2 คน)', price: '2,400 บาท/ชม.', notes: 'เท่ากับคนละ 1,200 บาท โปรคนเดียวกัน เรียนร่วมกัน' },
        { item: 'LENGOLF — เรียนแบบกลุ่ม (3-5 คน)', price: '2,900 บาท/ชม.', notes: 'เท่ากับคนละ 580-967 บาท เหมาะสำหรับกลุ่มเพื่อนที่อยากเรียนไปด้วยกัน' },
        { item: 'LENGOLF — แพ็กเกจ 5 ชั่วโมง (1 คน)', price: '8,500 บาท', notes: 'เท่ากับ 1,700 บาท/ชม. ใช้ได้ภายใน 6 เดือน' },
        { item: 'LENGOLF — แพ็กเกจ 10 ชั่วโมง (1 คน)', price: '16,000 บาท', notes: 'เท่ากับ 1,600 บาท/ชม. ใช้ได้ภายใน 12 เดือน' },
        { item: 'LENGOLF — แพ็กเกจ Starter', price: '11,000 บาท', notes: 'เรียน 5 ชั่วโมง บวกซ้อม 5 ชั่วโมง แถมถุงมือกอล์ฟฟรี เหมาะที่สุดสำหรับผู้เริ่มต้นจากศูนย์ ใช้ได้ภายใน 6 เดือน' },
        { item: 'LENGOLF — แพ็กเกจ Sim to Fairway', price: '13,499 บาท', notes: 'เรียนในร่ม 5 ชั่วโมง บวกเรียนในสนามจริง 1 ครั้ง ค่าใช้จ่ายที่สนามคิดแยกต่างหาก' },
        { item: 'LENGOLF — คอร์สเรียนทดลองฟรี', price: '0 บาท', notes: 'เรียนกับโปร 1 ชั่วโมง ไม่มีข้อผูกมัด จองผ่าน LINE หรือเว็บไซต์' },
        { item: 'เรียนที่สนามไดรฟ์กลางแจ้ง', price: '2,000-3,500 บาท/ชม.', notes: 'แตกต่างกันตามผู้สอนและสนาม ค่าลูกกอล์ฟมักคิดแยก' },
        { item: 'เรียนกลางแจ้งระดับพรีเมียม (โปรชั้นนำ)', price: '3,500-5,000 บาท/ชม.', notes: 'โค้ชที่ได้รับการรับรองจาก PGA ในสถานที่ชั้นนำ หลายแห่งต้องเป็นสมาชิกสนามก่อน' },
        { item: 'คลินิกกลุ่มที่สนามไดรฟ์กลางแจ้ง', price: '1,000-2,000 บาท/คน', notes: 'กลุ่มละ 4-8 คน ได้รับความสนใจเฉพาะบุคคลน้อยกว่า' },
      ],
      comparison_with_alternatives:
        'การเรียนบนกอล์ฟซิมูเลเตอร์ในร่มได้เปรียบการเรียนที่สนามไดรฟ์กลางแจ้งอย่างชัดเจนในเรื่องหนึ่ง นั่นคือข้อมูลวงสวิงแบบเรียลไทม์ ซิมูเลเตอร์ Bravo ของ LENGOLF วัดความเร็วลูก มุมออกตัว อัตราสปิน ระยะแคร์รี และแนวการเหวี่ยงไม้ในทุกลูกที่ตี ฟีดแบ็กที่อิงข้อมูลแบบนี้ช่วยเร่งการเรียนรู้ในแบบที่การเรียนที่สนามไดรฟ์กลางแจ้ง ซึ่งคุณได้แค่มองลูกลอยไปแล้วเดาเอา ทำไม่ได้ นอกจากนี้ห้องปรับอากาศยังทำให้ซ้อมได้อย่างสบายและมีสมาธิ ไม่ว่ากรุงเทพฯ จะร้อน ฝนตก หรือฝุ่นเยอะแค่ไหน',
      value_proposition:
        'คอร์สเรียนทดลองฟรี 1 ชั่วโมงของ LENGOLF ตัดความเสี่ยงออกไปทั้งหมด ลองเรียน ดูข้อมูลวงสวิงของตัวเอง แล้วค่อยตัดสินใจว่าเหมาะกับคุณไหม โดยไม่เสียค่าใช้จ่ายเลย ส่วนการเรียนต่อเนื่อง แพ็กเกจ Starter ของเรา (11,000 บาท สำหรับเรียน 5 ชั่วโมง บวกเวลาซ้อมอีก 5 ชั่วโมง พร้อมถุงมือกอล์ฟฟรี) เป็นแพ็กเกจสำหรับผู้เริ่มต้นที่คุ้มค่าที่สุดในกรุงเทพฯ',
      last_verified: '2026-02-19',
      sections: [
        {
          heading: 'เรียนบนซิมูเลเตอร์ต่างจากที่อื่นอย่างไร',
          body: 'การเรียนบนซิมูเลเตอร์ที่ LENGOLF ให้ฟีดแบ็กที่แม่นยำทันทีหลังทุกวงสวิง ทั้งความเร็วลูก มุมออกตัว แบ็กสปิน ไซด์สปิน ระยะแคร์รี ระยะรวม และแนวการเหวี่ยงไม้ โค้ชของคุณใช้ข้อมูลเหล่านี้วิเคราะห์ปัญหาและติดตามพัฒนาการเมื่อเวลาผ่านไป ส่วนการเรียนที่สนามไดรฟ์กลางแจ้ง คุณแทบต้องเดาตัวเลขเหล่านี้จากการมองวิถีลูก สำหรับผู้เริ่มต้น วิธีที่อิงข้อมูลแบบนี้ช่วยร่นระยะเวลาการเรียนรู้ได้มาก ส่วนนักกอล์ฟที่มีประสบการณ์แล้ว ก็ช่วยปรับจูนรายละเอียดเฉพาะจุดของวงสวิงได้อย่างแม่นยำ',
        },
        {
          heading: 'ทีมโค้ชของ LENGOLF',
          body: 'โค้ชของ LENGOLF เป็นมืออาชีพที่ผ่านการรับรองจาก PGA และมีประสบการณ์สอนทุกระดับฝีมือ ตั้งแต่ผู้เริ่มต้นจากศูนย์ไปจนถึงนักกอล์ฟแฮนดิแคปหลักหน่วย การเรียนดำเนินการเป็นภาษาอังกฤษและภาษาไทย ทุกคาบเรียนมีสรุปข้อมูลของคุณในรูปแบบดิจิทัลให้กลับไปทบทวนที่บ้าน และเบย์ที่ใช้สอนก็เหมือนกับเบย์ปกติทุกประการ ทั้งซิมูเลเตอร์และไม้กอล์ฟที่มีให้เลือก คุณจึงนำสิ่งที่เพิ่งเรียนไปซ้อมต่อได้ทันทีในรอบซ้อมของตัวเอง',
        },
        {
          heading: 'เส้นทางที่ดีที่สุดสำหรับผู้เริ่มต้น',
          body: 'หากคุณไม่เคยเล่นกอล์ฟมาก่อน ให้เริ่มจากคอร์สเรียนทดลองฟรี หากชอบ แพ็กเกจ Starter (11,000 บาท) คือเส้นทางที่เป็นระบบที่สุด ทั้งการเรียน 5 ชั่วโมงเพื่อวางพื้นฐาน บวกเวลาซ้อมอีก 5 ชั่วโมงเพื่อตอกย้ำสิ่งที่เรียนมา พร้อมถุงมือกอล์ฟฟรีให้เริ่มต้นได้เลย อายุการใช้งาน 6 เดือนทำให้ไม่ต้องเร่งรีบ หลังจากเรียนแพ็กเกจ Starter จบ ผู้เรียนส่วนใหญ่จะขยับไปใช้แพ็กเกจเรียน 5 ชั่วโมงหรือ 10 ชั่วโมงเพื่อพัฒนาต่อ',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'Ray S.',
          text: 'Had a lesson with Pro Min and he was very kind and helpful. Left me with a few tips to work on at the range. The facility is very nice and they\'re very friendly. Prices are very affordable compared to other similar places in the area.',
        },
        {
          reviewer_name: 'Suuaap',
          text: 'It was our first time holding a golf club and Nate took his time to teach us the basics and more. Price was totally worth it and fair. We know we\'ll come back!',
        },
        {
          reviewer_name: 'Fritz P.',
          text: 'So much fun!! Great price, great service, amazing experience.',
        },
      ],
    },
  },

  // ─── JA: golf-lesson-prices-bangkok ───
  // Lesson-price cluster; all 11 rows trace to the EN price-6 entry (1,800 /
  // 2,400 / 2,900 / 8,500 / 16,000 / 11,000 / 13,499 / 0 / 2,000〜3,500 /
  // 3,500〜5,000 / 1,000〜2,000). HONESTY: the EN entry itself makes a coach-
  // language claim ("Lessons are conducted in English and Thai"), so the JA
  // rendering carries it and adds the settled LENGOLF-scoped negation plus the
  // LINE @lengolf allowance — no Japanese-language lesson or Japanese coach is
  // claimed anywhere. related_slugs unchanged — all four are JA-translated.
  {
    id: 'price-6-ja',
    page_type: 'price_guide',
    slug: 'golf-lesson-prices-bangkok',
    title: 'バンコクのゴルフレッスン料金（2026年） — インドアと屋外を比較',
    meta_description:
      'バンコクのゴルフレッスン料金は、LENGOLFが1時間1,800THBから（1時間の無料体験あり）、屋外のプロは1時間2,000〜5,000THB。インドアシミュレーターでのコーチングとドライビングレンジのレッスンを比較します（2026年2月現在）。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'ja',
    related_slugs: ['/lessons', '/cost/lengolf-pricing-guide', '/cost/how-much-does-golf-cost-bangkok', '/faq/best-way-to-learn-golf-in-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        'バンコクのゴルフレッスンは、指導者・施設・形式によって1時間1,800〜5,000THBです。LENGOLFではPGA資格を持つプロによるプライベートレッスンを1時間1,800THBからご提供しており、最初の1時間は体験レッスンとして無料でお受けいただけます（2026年2月現在）。',
      price_breakdown: [
        { item: 'LENGOLF — プライベートレッスン（1名）', price: '1時間1,800THB', notes: 'PGA資格を持つプロが担当。シミュレーターが詳細なスイングデータを表示します。' },
        { item: 'LENGOLF — セミプライベート（2名）', price: '1時間2,400THB', notes: '1人あたり1,200THB。同じプロによる合同セッションです。' },
        { item: 'LENGOLF — グループレッスン（3〜5名）', price: '1時間2,900THB', notes: '1人あたり580〜967THB。友人同士で学ぶのに向いています。' },
        { item: 'LENGOLF — 5時間パッケージ（1名）', price: '8,500THB', notes: '実質1時間1,700THB。有効期限6か月。' },
        { item: 'LENGOLF — 10時間パッケージ（1名）', price: '16,000THB', notes: '実質1時間1,600THB。有効期限12か月。' },
        { item: 'LENGOLF — Starterパッケージ', price: '11,000THB', notes: 'コーチング5時間と練習5時間。ゴルフグローブが無料。まったくの初心者に最適です。有効期限6か月。' },
        { item: 'LENGOLF — Sim to Fairwayパッケージ', price: '13,499THB', notes: '屋内コーチング5時間とオンコースレッスン1回。コースでかかる費用は別途。' },
        { item: 'LENGOLF — 無料体験レッスン', price: '0THB', notes: 'プロと1時間。その後の勧誘はありません。LINEまたはウェブサイトからご予約ください。' },
        { item: '屋外ドライビングレンジのレッスン', price: '1時間2,000〜3,500THB', notes: '指導者と施設によって異なります。レンジボールは通常別料金です。' },
        { item: 'プレミアムな屋外コーチング（トッププロ）', price: '1時間3,500〜5,000THB', notes: '上位施設のPGA認定コーチ。コースの会員資格が必要な場合もあります。' },
        { item: '屋外レンジのグループクリニック', price: '1人あたり1,000〜2,000THB', notes: '4〜8名のグループ。個別に見てもらえる時間は少なくなります。' },
      ],
      comparison_with_alternatives:
        'インドアのシミュレーターレッスンには、屋外ドライビングレンジでの指導に対して大きな利点があります——リアルタイムのスイングデータです。LENGOLFのBravoシミュレーターは、1球ごとにボールスピード、打ち出し角、スピン量、キャリー、クラブパスを計測します。数字にもとづくこのフィードバックは、ボールの行方を見て推測するしかない屋外レンジのレッスンでは得られない速さで、上達を後押しします。空調の効いた屋内という環境も、バンコクの暑さや雨、大気の状態に左右されずに集中して練習できることを意味します。',
      value_proposition:
        'LENGOLFの1時間無料体験レッスンなら、リスクはありません。レッスンを受け、スイングデータを見て、ご自身に合うかどうかを判断していただけます——費用はゼロです。継続的なコーチングでは、Starterパッケージ（11,000THBでコーチング5時間、練習5時間、ゴルフグローブ付き）がバンコクで最も割のよい初心者向けパッケージです。',
      last_verified: '2026-02-19',
      sections: [
        {
          heading: 'シミュレーターレッスンはどこが違うのか',
          body: 'LENGOLFのシミュレーターレッスンでは、1球打つごとにボールスピード、打ち出し角、バックスピン、サイドスピン、キャリー、トータル飛距離、クラブパスが即座に、しかも正確に表示されます。コーチはこのデータをもとに課題を切り分け、上達の推移を追っていきます。屋外レンジのレッスンでは、これらの数値をボールの飛び方から推し量るしかありません。初心者にとって、データにもとづくこの進め方は学習のスピードを大きく引き上げてくれます。経験のあるゴルファーにとっても、スイングの特定の部分を精密に詰めていくのに役立ちます。',
        },
        {
          heading: 'LENGOLFのコーチ陣',
          body: 'LENGOLFのコーチはPGA資格を持つプロフェッショナルで、まったくの初心者からシングルハンディキャップの方まで、あらゆるレベルの指導経験があります。レッスンは英語とタイ語で行っています。LENGOLFには日本人コーチや日本語でのレッスンはありませんが、ご予約や事前のご相談はLINE @lengolf にて日本語で承ります。また、シミュレーターの画面に表示されるヘッドスピードや打ち出し角といった数値は、言葉の壁を越えて理解を助けてくれます。レッスンごとに、その日のセッションデータをまとめたデジタルサマリーをお渡ししますので、ご自宅でも振り返っていただけます。コーチング用のベイは通常のベイと同じ設備——同じシミュレーター、同じクラブ——ですので、学んだ内容をそのまま次の自主練習で試せます。',
        },
        {
          heading: '初心者におすすめの進め方',
          body: 'ゴルフがまったく初めての方は、無料体験レッスンから始めてください。気に入っていただけたら、Starterパッケージ（11,000THB）が最も筋道のはっきりした道のりです——基礎をつくるコーチング5時間に、それを定着させる練習5時間、さらにゴルフグローブが付きます。有効期限が6か月あるので、急いで消化する必要もありません。Starterパッケージを終えた方の多くは、5時間または10時間のコーチングパッケージに進んで上達を続けています。',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'Ray S.',
          text: 'Had a lesson with Pro Min and he was very kind and helpful. Left me with a few tips to work on at the range. The facility is very nice and they\'re very friendly. Prices are very affordable compared to other similar places in the area.',
        },
        {
          reviewer_name: 'Suuaap',
          text: 'It was our first time holding a golf club and Nate took his time to teach us the basics and more. Price was totally worth it and fair. We know we\'ll come back!',
        },
        {
          reviewer_name: 'Fritz P.',
          text: 'So much fun!! Great price, great service, amazing experience.',
        },
      ],
    },
  },

  // ─── KO: golf-lesson-prices-bangkok ───
  // Lesson pricing. All figures from the EN entry (1,800 / 2,400 / 2,900바트 시간당,
  // 1인당 1,200 및 580~967바트, 8,500 / 16,000 / 11,000 / 13,499바트 패키지, 실외
  // 2,000~5,000바트, 클리닉 1,000~2,000바트). Language claim carried exactly as EN
  // states it and LENGOLF-scoped ('레슨은 영어와 태국어로 진행돼요') — no Korean-language
  // or Korean-coach claim added, and no city-wide negative claim about Bangkok.
  // The eight LENGOLF rows keep the ' — ' prefix for renderer grouping and the
  // LENGOLF tint. related_slugs unchanged — all four targets are KO-translated.
  {
    id: 'price-6-ko',
    page_type: 'price_guide',
    slug: 'golf-lesson-prices-bangkok',
    title: '방콕 골프 레슨 비용 (2026년) — 실내와 실외 비교',
    meta_description:
      '방콕 골프 레슨 비용은 LENGOLF 시간당 1,800바트부터(1시간 무료 체험 레슨 제공), 실외 프로 레슨은 시간당 2,000~5,000바트예요. 실내 시뮬레이터 코칭과 드라이빙 레인지 레슨을 비교했어요 (2026년 2월 기준).',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'ko',
    related_slugs: ['/lessons', '/cost/lengolf-pricing-guide', '/cost/how-much-does-golf-cost-bangkok', '/faq/best-way-to-learn-golf-in-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        '방콕의 골프 레슨 비용은 강사와 장소, 형식에 따라 시간당 1,800~5,000바트예요. LENGOLF에서는 PGA 자격을 갖춘 프로의 개인 레슨을 시간당 1,800바트부터 받으실 수 있고, 첫 1시간은 체험 레슨으로 무료예요.',
      price_breakdown: [
        { item: 'LENGOLF — 개인 레슨 (1명)', price: '1,800바트/시간', notes: 'PGA 자격을 갖춘 프로와 함께해요. 시뮬레이터가 상세한 스윙 데이터를 보여줘요.' },
        { item: 'LENGOLF — 세미프라이빗 (2명)', price: '2,400바트/시간', notes: '1인당 1,200바트. 같은 프로에게 함께 배워요.' },
        { item: 'LENGOLF — 그룹 레슨 (3~5명)', price: '2,900바트/시간', notes: '1인당 580~967바트. 친구들과 함께 배우기 좋아요.' },
        { item: 'LENGOLF — 5시간 패키지 (1명)', price: '8,500바트', notes: '실질 시간당 1,700바트. 유효 기간 6개월.' },
        { item: 'LENGOLF — 10시간 패키지 (1명)', price: '16,000바트', notes: '실질 시간당 1,600바트. 유효 기간 12개월.' },
        { item: 'LENGOLF — Starter 패키지', price: '11,000바트', notes: '코칭 5시간에 연습 5시간. 골프 장갑을 함께 드려요. 완전 초보자에게 가장 좋아요. 유효 기간 6개월.' },
        { item: 'LENGOLF — Sim to Fairway 패키지', price: '13,499바트', notes: '실내 코칭 5시간에 온코스 레슨 1회. 코스에서 발생하는 비용은 별도예요.' },
        { item: 'LENGOLF — 무료 체험 레슨', price: '0바트', notes: '프로와 1시간. 부담 없이 받아보세요. LINE이나 웹사이트로 예약하시면 돼요.' },
        { item: '실외 드라이빙 레인지 레슨', price: '2,000~3,500바트/시간', notes: '강사와 연습장에 따라 달라요. 연습 볼은 보통 별도예요.' },
        { item: '프리미엄 실외 코칭 (톱 프로)', price: '3,500~5,000바트/시간', notes: '최상급 시설의 PGA 자격 코치. 코스 멤버십이 필요한 경우도 많아요.' },
        { item: '실외 연습장 그룹 클리닉', price: '1인당 1,000~2,000바트', notes: '4~8명 그룹. 개인별 지도는 적어요.' },
      ],
      comparison_with_alternatives:
        '실내 시뮬레이터 레슨에는 실외 드라이빙 레인지 코칭에 없는 큰 장점이 하나 있어요. 실시간 스윙 데이터예요. LENGOLF의 Bravo 시뮬레이터는 모든 샷에서 볼 스피드, 발사각, 스핀량, 캐리 거리, 클럽 패스를 측정해요. 공이 날아가는 모습을 보고 짐작해야 하는 실외 연습장 레슨과 달리, 데이터에 기반한 피드백은 배우는 속도를 크게 끌어올려요. 에어컨이 나오는 실내라 방콕의 더위나 비, 대기 오염과 상관없이 편안하게 집중해서 연습할 수 있고요.',
      value_proposition:
        'LENGOLF의 1시간 무료 체험 레슨은 부담을 완전히 없애 줘요. 레슨을 한 번 받아 보고 스윙 데이터를 확인한 다음, 나에게 맞는지 아닌지 결정하시면 돼요. 비용은 들지 않아요. 계속 배우실 생각이라면 Starter 패키지(11,000바트, 코칭 5시간에 연습 5시간과 골프 장갑까지)가 방콕에서 가장 가치 있는 입문자 패키지예요.',
      last_verified: '2026-02-19',
      sections: [
        {
          heading: '시뮬레이터 레슨이 다른 점',
          body: 'LENGOLF에서 레슨을 받으시면 스윙 한 번마다 볼 스피드, 발사각, 백스핀, 사이드스핀, 캐리 거리, 총 거리, 클럽 패스가 곧바로 정확하게 나와요. 코치는 이 데이터로 문제를 짚어내고 시간이 지나며 얼마나 좋아졌는지 추적해요. 실외 연습장 레슨에서는 공이 날아가는 모습만 보고 이 숫자들을 짐작할 수밖에 없어요. 입문자에게는 이런 데이터 기반 접근이 배우는 속도를 크게 앞당겨 주고, 경험이 있는 골퍼에게는 스윙의 특정 부분을 정밀하게 다듬는 데 도움이 돼요.',
        },
        {
          heading: 'LENGOLF 코칭 팀',
          body: 'LENGOLF의 코치진은 PGA 자격을 갖춘 프로로, 완전 초보자부터 한 자릿수 핸디캡 골퍼까지 모든 수준을 가르쳐 왔어요. 레슨은 영어와 태국어로 진행돼요. 레슨마다 그날의 데이터 요약을 디지털로 받아 집에서 다시 보실 수 있어요. 코칭 베이는 일반 베이와 똑같은 시뮬레이터에 똑같은 클럽 구성이라, 배운 내용을 곧바로 혼자 연습하는 시간에 이어서 쳐 보실 수 있어요.',
        },
        {
          heading: '입문자에게 좋은 순서',
          body: '골프를 한 번도 해 보지 않으셨다면 무료 체험 레슨부터 시작해 보세요. 재미있으셨다면 Starter 패키지(11,000바트)가 가장 짜임새 있는 길이에요. 기본기를 잡는 코칭 5시간에 그것을 몸에 붙이는 연습 5시간, 그리고 처음 시작할 때 쓸 골프 장갑까지 함께 드려요. 유효 기간이 6개월이라 서두르실 필요도 없고요. Starter 패키지를 마친 분들은 대부분 5시간이나 10시간 코칭 패키지로 넘어가서 계속 다듬어 나가요.',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'Ray S.',
          text: 'Had a lesson with Pro Min and he was very kind and helpful. Left me with a few tips to work on at the range. The facility is very nice and they\'re very friendly. Prices are very affordable compared to other similar places in the area.',
        },
        {
          reviewer_name: 'Suuaap',
          text: 'It was our first time holding a golf club and Nate took his time to teach us the basics and more. Price was totally worth it and fair. We know we\'ll come back!',
        },
        {
          reviewer_name: 'Fritz P.',
          text: 'So much fun!! Great price, great service, amazing experience.',
        },
      ],
    },
  },

  // ─── ZH: golf-lesson-prices-bangkok ───
  // Every figure traces to EN price-6 (1,800–5,000泰铢/小时区间; 1,800/2,400/2,900/
  // 8,500/16,000/11,000/13,499/0泰铢; 1,200泰铢与580–967泰铢人均; 1,700与1,600泰铢
  // 折合价; 室外2,000–3,500、3,500–5,000、1,000–2,000泰铢). "On-course fees extra"
  // is rendered 下场费用另计 — the glossary avoid token 球场费 fires as a plain
  // substring inside 球场费用, which is the natural rendering of on-course costs
  // (documented precedent from the zh /lessons page). as-of 截至2026年2月 = this
  // entry's own last_verified. The EN language claim "Lessons are conducted in
  // English and Thai" is carried unchanged and NOT supplemented with a Chinese-
  // language allowance the EN source does not make. related_slugs unchanged —
  // all four EN targets are ZH-translated.
  {
    id: 'price-6-zh',
    page_type: 'price_guide',
    slug: 'golf-lesson-prices-bangkok',
    title: '曼谷高尔夫课程价格（2026） — 室内与室外收费对比',
    meta_description:
      '曼谷高尔夫课程价格：LENGOLF每小时1,800泰铢起，含1小时免费试上课；室外教练每小时2,000–5,000泰铢。室内模拟器教学与练习场课程全对比，截至2026年2月。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'pricing',
    locale: 'zh',
    related_slugs: ['/lessons', '/cost/lengolf-pricing-guide', '/cost/how-much-does-golf-cost-bangkok', '/faq/best-way-to-learn-golf-in-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      intro:
        '在曼谷上高尔夫课，每小时大约1,800–5,000泰铢，看教练、场地和形式而定。LENGOLF的一对一课程由具PGA资格的教练授课，每小时1,800泰铢起——而且第一个小时是免费试上课，截至2026年2月。',
      price_breakdown: [
        { item: 'LENGOLF — 一对一课程（1人）', price: '1,800泰铢/小时', notes: '由具PGA资格的教练授课。模拟器提供详细的挥杆数据。' },
        { item: 'LENGOLF — 半私教（2人）', price: '2,400泰铢/小时', notes: '每人1,200泰铢。同一位教练，两人共上。' },
        { item: 'LENGOLF — 团体课（3–5人）', price: '2,900泰铢/小时', notes: '每人580–967泰铢。适合一群朋友一起学。' },
        { item: 'LENGOLF — 5小时套餐（1人）', price: '8,500泰铢', notes: '折合1,700泰铢/小时。有效期6个月。' },
        { item: 'LENGOLF — 10小时套餐（1人）', price: '16,000泰铢', notes: '折合1,600泰铢/小时。有效期12个月。' },
        { item: 'LENGOLF — Starter入门套餐', price: '11,000泰铢', notes: '5小时教学加5小时练习。赠高尔夫手套一副。最适合零基础。有效期6个月。' },
        { item: 'LENGOLF — Sim to Fairway套餐', price: '13,499泰铢', notes: '5小时室内教学加1次实地下场课。下场费用另计。' },
        { item: 'LENGOLF — 免费试上课', price: '0泰铢', notes: '与教练上1小时，无任何附带条件。可通过LINE或网站预约。' },
        { item: '室外练习场课程', price: '2,000–3,500泰铢/小时', notes: '因教练与练习场而异。练习球通常另计。' },
        { item: '高端室外教学（顶尖教练）', price: '3,500–5,000泰铢/小时', notes: '顶级设施内的PGA认证教练。往往需要球场会籍。' },
        { item: '室外练习场团体课', price: '1,000–2,000泰铢/人', notes: '4–8人一组。个别指导会少一些。' },
      ],
      comparison_with_alternatives:
        '室内模拟器课程相比室外练习场教学有一个明显优势：实时的挥杆数据。LENGOLF的Bravo模拟器会记录每一杆的球速、发射角、旋转速率、飞行距离和挥杆路径。这种以数据为依据的反馈能加快进步，而室外练习场那种看着球飞出去再靠猜的方式做不到这一点。室内空调环境也意味着，不管曼谷是热、是下雨还是空气不好，你都能安安稳稳地专心练。',
      value_proposition:
        'LENGOLF的1小时免费试上课，把风险降到了零。先上一次，看看挥杆数据，再决定这条路适不适合你——一分钱都不用花。想继续系统学下去的话，我们的Starter入门套餐（11,000泰铢，含5小时教学、5小时练习时间和一副高尔夫手套）是曼谷最超值的新手套餐。',
      last_verified: '2026-02-19',
      sections: [
        {
          heading: '模拟器课程有什么不一样',
          body: '在LENGOLF上一节模拟器课，每挥完一杆你立刻就能拿到精确反馈：球速、发射角、后旋、侧旋、飞行距离、总距离和挥杆路径。教练用这些数据来判断问题出在哪里，也用它来跟踪你一段时间里的进步。在室外练习场上课，这些数字基本靠盯着球的飞行轨迹猜。对新手来说，这种以数据为依据的方式能大幅缩短学习过程；对有经验的球友来说，它能把挥杆里某个具体环节调得非常精细。',
        },
        {
          heading: 'LENGOLF教练团队',
          body: 'LENGOLF的教练都是具PGA资格的职业教练，从完全零基础到差点在个位数的球友都教过。课程以英语和泰语进行。每节课都会附上一份本次训练数据的电子摘要，你可以回家再看。教学用的球位和普通球位完全一样——同样的模拟器、同样的球杆选择——所以你学完之后，接着自己练的那一节就能马上把学到的东西用上。',
        },
        {
          heading: '零基础的最佳路径',
          body: '如果你从来没打过高尔夫：先从免费试上课开始。要是觉得喜欢，那么Starter入门套餐（11,000泰铢）是最有体系的一条路——5小时教学打基础，再加5小时练习把它巩固下来，还送一副高尔夫手套让你上手。6个月的有效期意味着不用赶。上完Starter入门套餐之后，多数学员会转到5小时或10小时的教学套餐继续提升。',
        },
      ],
      curated_reviews: [
        {
          reviewer_name: 'Ray S.',
          text: 'Had a lesson with Pro Min and he was very kind and helpful. Left me with a few tips to work on at the range. The facility is very nice and they\'re very friendly. Prices are very affordable compared to other similar places in the area.',
        },
        {
          reviewer_name: 'Suuaap',
          text: 'It was our first time holding a golf club and Nate took his time to teach us the basics and more. Price was totally worth it and fair. We know we\'ll come back!',
        },
        {
          reviewer_name: 'Fritz P.',
          text: 'So much fun!! Great price, great service, amazing experience.',
        },
      ],
    },
  },
]
