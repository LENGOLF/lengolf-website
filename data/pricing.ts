import { storageUrl } from '@/lib/constants'
import { getPricingCatalog, formatThb, findPrice, type PricingCatalog } from '@/lib/pricing'

/**
 * Structured kind for a lesson-package remark. Drives translation in the
 * page layer — replaces fragile regex matching on the English `remark` text.
 * - `dash`         → plain em-dash placeholder
 * - `validity`     → "Valid for {remarkMonths} months"
 * - `starter`      → Starter Package remark (6 months + free glove)
 * - `simToFairway` → Sim to Fairway remark (on-course fee disclosure)
 */
export type LessonRemarkKind = 'dash' | 'validity' | 'starter' | 'simToFairway'

/**
 * Structured kind for a lesson-package `name` column. Drives translation in
 * the page layer so the hour-count and branded package names localize.
 * - `hour`         → "{n} Hour" (uses `nameHours`)
 * - `starter`      → "Starter Package*"
 * - `simToFairway` → "Sim to Fairway*"
 */
export type LessonNameKind = 'hour' | 'starter' | 'simToFairway'

/** Identifier for a featured row's badge — independent of the row's `name`
 *  so marketing can rename packages without breaking badge wiring. */
export type FeaturedKind = 'bestValue' | 'trending' | 'promo'

export interface LessonPackage {
  /** Raw English name — retained for JSON-LD / pricing-match logic. */
  name: string
  nameKind?: LessonNameKind
  /** Hour count for `nameKind === 'hour'`. */
  nameHours?: number
  oneGolfer: string
  twoGolfers: string
  threeToFiveGolfers: string
  /** Raw English remark — retained for fallback / JSON-LD / non-i18n callers. */
  remark: string
  remarkKind?: LessonRemarkKind
  /** Months value for `remarkKind === 'validity'`. */
  remarkMonths?: number
  featured?: FeaturedKind
}

export const lessonPricing: LessonPackage[] = [
  { name: '1 Hour',           nameKind: 'hour', nameHours: 1,  oneGolfer: '1,800 THB',  twoGolfers: '2,400 THB',  threeToFiveGolfers: '2,900 THB',  remark: '-',                                                                  remarkKind: 'dash' },
  { name: '5 Hour',           nameKind: 'hour', nameHours: 5,  oneGolfer: '8,500 THB',  twoGolfers: '11,000 THB', threeToFiveGolfers: '13,650 THB', remark: 'Valid for 6 months',                                                  remarkKind: 'validity',     remarkMonths: 6 },
  { name: '10 Hour',          nameKind: 'hour', nameHours: 10, oneGolfer: '16,000 THB', twoGolfers: '20,500 THB', threeToFiveGolfers: '25,500 THB', remark: 'Valid for 12 months',                                                 remarkKind: 'validity',     remarkMonths: 12, featured: 'bestValue' },
  { name: '20 Hour',          nameKind: 'hour', nameHours: 20, oneGolfer: '31,000 THB', twoGolfers: '39,000 THB', threeToFiveGolfers: '49,000 THB', remark: 'Valid for 24 months',                                                 remarkKind: 'validity',     remarkMonths: 24 },
  { name: '30 Hour',          nameKind: 'hour', nameHours: 30, oneGolfer: '45,000 THB', twoGolfers: '57,000 THB', threeToFiveGolfers: '72,000 THB', remark: 'Valid for 24 months',                                                 remarkKind: 'validity',     remarkMonths: 24 },
  { name: '50 Hour',          nameKind: 'hour', nameHours: 50, oneGolfer: '72,000 THB', twoGolfers: '92,500 THB', threeToFiveGolfers: '117,500 THB', remark: 'Valid for 24 months',                                                remarkKind: 'validity',     remarkMonths: 24 },
  { name: 'Starter Package*', nameKind: 'starter',             oneGolfer: '11,000 THB', twoGolfers: '13,500 THB', threeToFiveGolfers: '-',           remark: 'Valid for 6 months & Free 1 golf glove/golfer',                      remarkKind: 'starter' },
  { name: 'Sim to Fairway*',  nameKind: 'simToFairway',        oneGolfer: '13,499 THB', twoGolfers: '-',          threeToFiveGolfers: '-',           remark: 'On courses fee for both student and coach must be covered by the customer', remarkKind: 'simToFairway' },
]

export const lessonNotes = [
  '*Starter Package: 5 Hrs Coaching + 5 Hrs Practice',
  '*Sim to Fairway: 5 Hrs Coaching + 1 On-course Lesson',
  '*Golf Simulator Usage included in all Lesson Packages',
]

export const services = [
  { title: 'Golf', image: storageUrl('venue/venue-simulator-01.jpg'), href: '/golf' },
  { title: 'Food & Drinks', image: storageUrl('menus/food-drinks-cover.jpg'), href: '/menu' },
  { title: 'Lessons', image: storageUrl('lessons/lessons-cover.jpg'), href: '/lessons' },
  { title: 'Events', image: storageUrl('events/events-cover.jpg'), href: '/events' },
]

export const amenities = [
  'Full site rental',
  '50+ Pack event space',
  'Full bar',
  'Customizable catering packages',
  '4 simulator bays',
  'Free club usage',
  'Large putting green',
  'Contact our events team to learn more',
]

export const eventTypes = [
  { title: 'Corporate events', icon: storageUrl('icons/icon-corporate.png') },
  { title: 'Company parties', icon: storageUrl('icons/icon-party.png') },
  { title: 'Team building', icon: storageUrl('icons/icon-team-building.png') },
  { title: 'Meet & Greets', icon: storageUrl('icons/icon-meet-greet.png') },
  { title: 'Birthdays or Special celebrations', icon: storageUrl('icons/icon-birthday.png') },
  { title: 'Filming & Photoshoots', icon: storageUrl('icons/icon-filming.png') },
]

// ── Event Packages ──

export interface EventPackage {
  name: string
  guests: string
  bays: string
  duration: string
  beers: string
  cocktails: string
  softDrinks: string
  food: string[]
  caterer: string
  price: string
  exclusive: boolean
}

export const eventPackages: EventPackage[] = [
  {
    name: 'Small Package',
    guests: '10–15 people',
    bays: '2 Golf Bays',
    duration: '3 Hours',
    beers: '10 Beers (Singha or Asahi)',
    cocktails: '5 Cocktails',
    softDrinks: 'Unlimited Soft Drinks',
    food: ['1 Calamari', '1 French Fries', '3 Burgers', '2 Toast', 'Crab or Shrimp Ebiko', '2 Sliders', 'Crispy Chicken & BBQ Brisket', '1 Salad'],
    caterer: 'Smith & Co.',
    price: '9,999 THB',
    exclusive: false,
  },
  {
    name: 'Medium Package',
    guests: '15–25 people',
    bays: '4 Golf Bays',
    duration: '3 Hours',
    beers: '20 Beers (Singha or Asahi)',
    cocktails: '10 Cocktails',
    softDrinks: 'Unlimited Soft Drinks',
    food: ['2 Calamari', '2 French Fries', '3 Large Pizzas', '4 Toast', 'Crab or Shrimp Ebiko', '4 Sliders', 'Crispy Chicken & BBQ Brisket', '2 Salads'],
    caterer: 'Smith & Co. & Pizza Mania',
    price: '21,999 THB',
    exclusive: true,
  },
]

export const eventPackageNotes = [
  'Food options can be fully customized to suit your preferences and event needs',
  'Medium Package includes exclusive full-location rental',
]

// ── Events FAQs ──

export const eventsFaqItems = [
  {
    question: 'How many people can LENGOLF accommodate for events?',
    answer: 'Our venue can comfortably host events for up to 50+ guests. We have 4 golf simulator bays, a full bar area, and flexible seating arrangements that can be configured to suit your event layout.',
  },
  {
    question: 'What event packages do you offer?',
    answer: 'We offer two main packages: the Small Package (9,999 THB) for 10–15 guests with 2 golf bays, and the Medium Package (21,999 THB) for 15–25 guests with all 4 golf bays and exclusive full-location rental. Both include 3 hours, beer, cocktails, unlimited soft drinks, and a catered food spread.',
  },
  {
    question: 'Can I customize the food and drinks for my event?',
    answer: 'Absolutely! Our standard packages include curated food platters from Smith & Co. (and Pizza Mania for the Medium Package), but all food and drink options can be fully customized to suit your preferences, dietary requirements, and event theme. We also offer add-ons like sound system and DJ packages for a complete party experience.',
  },
  {
    question: 'What types of events can you host?',
    answer: 'We host corporate events, company parties, team building activities, meet & greets, birthdays, special celebrations, and filming or photoshoots. Our venue is versatile enough for both professional and social occasions.',
  },
  {
    question: 'How do I book an event at LENGOLF?',
    answer: 'Fill out the inquiry form on this page, or contact us directly on LINE @lengolf. Our events team will get back to you to discuss your requirements, customize your package, and confirm your booking.',
  },
  {
    question: 'Where is LENGOLF located?',
    answer: 'We\'re located on the 4th floor of The Mercury Ville at BTS Chidlom, 540 Ploenchit Road, Lumpini, Pathumwan, Bangkok 10330. We\'re directly accessible from the BTS Chidlom Skytrain station. See us on Google Maps.',
  },
  {
    question: 'Do guests need golf experience?',
    answer: 'Not at all! Our simulators are fun for everyone, from complete beginners to experienced golfers. We offer games like closest to the pin and longest drive that anyone can enjoy. Our golf pros can also provide mini-lessons and tips during your event.',
  },
  {
    question: 'Can I get a custom event package?',
    answer: 'Yes! Beyond our Small and Medium packages, we can create fully custom packages for larger groups, longer durations, or specific requirements. Add-ons include additional catering options, sound system and DJ setup, custom decorations, and more. Contact our events team on LINE @lengolf to discuss your needs.',
  },
]

// ── Lessons FAQs ──

export const lessonsFaqItems = [
  {
    question: 'Do you offer a free trial golf lesson?',
    answer: 'Yes! We offer a free 1-hour trial lesson with one of our PGA Pro coaches. It\'s a great way to experience our coaching approach — you\'ll learn simple and effective techniques, build solid fundamentals, and get course-ready fast. No commitment required. Contact us on LINE @lengolf to book your free trial.',
  },
  {
    question: 'How much do golf lessons cost at LENGOLF?',
    answer: 'Lesson packages start at 1,800 THB for a 1-hour session (1 golfer). Multi-hour packages offer better value — for example, 10 hours for 16,000 THB (valid 12 months) or 30 hours for 45,000 THB (valid 24 months). Group rates are available for 2 golfers or 3–5 golfers. Golf simulator usage is included in all lesson packages.',
  },
  {
    question: 'What skill levels do your coaches teach?',
    answer: 'Our coaches work with all skill levels, from complete beginners to advanced players. Whether you\'re picking up a club for the first time or fine-tuning your shot shaping, our PGA-certified professionals tailor each lesson to your goals and ability.',
  },
  {
    question: 'Who are the golf coaches at LENGOLF?',
    answer: 'We have three Thailand PGA-certified professional coaches: PRO Boss (Parin Phokan), specializing in drive training and course management; PRO Ratchavin (Ratchavin Tanakasempipat), specializing in beginner programs and short game; and PRO Min (Varuth Kjonkittiskul), specializing in course management and putting.',
  },
  {
    question: 'How do I book a golf lesson?',
    answer: 'Contact us on LINE @lengolf to schedule your lesson, or book online at booking.len.golf. Our team will match you with the right coach based on your goals and availability.',
  },
  {
    question: 'What is included in a golf lesson?',
    answer: 'Every lesson includes one-on-one instruction from a PGA-certified coach, use of our state-of-the-art golf simulators with swing analysis data, and standard golf club rental. Our coaches use video analysis to identify and correct technique, giving you actionable feedback each session.',
  },
  {
    question: 'Do you offer golf lessons for kids and juniors?',
    answer: 'Yes! All three of our coaches have junior golf development experience. We offer tailored programs for young golfers to build proper fundamentals, develop swing mechanics, and learn course etiquette in a fun, supportive environment.',
  },
  {
    question: 'Where is LENGOLF located?',
    answer: 'We\'re located on the 4th floor of The Mercury Ville at BTS Chidlom, 540 Ploenchit Road, Lumpini, Pathumwan, Bangkok 10330. We\'re directly accessible from the BTS Chidlom Skytrain station. See us on Google Maps.',
  },
  {
    question: 'What are the Starter Package and Sim to Fairway packages?',
    answer: 'The Starter Package (11,000 THB) includes 5 hours of coaching plus 5 hours of practice time and a free golf glove — ideal for beginners building a foundation. The Sim to Fairway package (13,499 THB) includes 5 hours of coaching plus 1 on-course lesson, so you can take your simulator skills to a real golf course. On-course fees for both student and coach must be covered by the customer.',
  },
]

// ── Bay Rates ──

export interface BayRateRow {
  timeSlot: string
  weekday: string
  weekend: string
  featured?: FeaturedKind
}

export const bayRates: BayRateRow[] = [
  { timeSlot: 'Before 14:00',  weekday: '550 THB', weekend: '750 THB' },
  { timeSlot: '14:00 – 17:00', weekday: '750 THB', weekend: '950 THB' },
  { timeSlot: '17:00 – 23:00', weekday: '750 THB', weekend: '950 THB', featured: 'promo' },
]

export const bayRateNotes = [
  'Price per hour, per bay (up to 5 players)',
  'Weekday = Mon–Thu, Weekend = Fri–Sun',
  'Open daily 9:00 – 23:00',
  'Free golf club rental included',
]

// ── Monthly Packages ──

export interface MonthlyPackageRow {
  name: string
  hours: string
  validity: string
  perks: string
  price: string
  featured?: FeaturedKind
}

export const monthlyPackages: MonthlyPackageRow[] = [
  { name: 'Early Bird*',  hours: '10',        validity: '6 months', perks: '—',           price: '4,800 THB'  },
  { name: 'Early Bird+*', hours: 'Unlimited', validity: '1 month',  perks: '5% Off F&D',  price: '5,000 THB', featured: 'trending' },
  { name: 'Bronze',       hours: '5',         validity: '1 month',  perks: '—',           price: '3,000 THB'  },
  { name: 'Iron',         hours: '8',         validity: '2 months', perks: '—',           price: '4,500 THB'  },
  { name: 'Silver',       hours: '15',        validity: '3 months', perks: '5% Off F&D',  price: '8,000 THB'  },
  { name: 'Gold',         hours: '30',        validity: '6 months', perks: '10% Off F&D', price: '14,000 THB', featured: 'bestValue' },
  { name: 'Diamond',      hours: 'Unlimited', validity: '1 month',  perks: '5% Off F&D',  price: '8,000 THB'  },
  { name: 'Diamond+',     hours: 'Unlimited', validity: '3 months', perks: '10% Off F&D', price: '18,000 THB' },
]

export const monthlyPackageNotes = [
  '*Early Bird packages can only be used before 14:00',
]

// ── Golf Page FAQs ──

export const golfFaqItems = [
  {
    question: 'How much does it cost to play at LENGOLF?',
    answer: 'Our simulator bays start at 550 THB per hour on weekdays (Mon–Thu) before 14:00, and go up to 950 THB per hour on weekends (Fri–Sun) after 14:00. Each bay holds up to 5 players, and standard golf club rental is included at no extra charge.',
  },
  {
    question: 'Do I need to bring my own golf clubs?',
    answer: 'No, standard club sets are provided free with every bay rental, including ladies\' sets. We also offer premium club rentals — Callaway Warbird (men\'s) and Callaway REVA (women\'s) — starting at 150 THB per hour. Premium clubs can be used in-house or taken to any golf course in Bangkok. See our club rental page for full details and pricing. You\'re always welcome to bring your own clubs too.',
  },
  {
    question: 'How many people can play per bay?',
    answer: 'Each simulator bay comfortably fits up to 5 players. The hourly rate is per bay, not per person, making it great value for groups.',
  },
  {
    question: 'What are your opening hours?',
    answer: 'LENGOLF is open daily from 9:00 AM to 11:00 PM, Monday through Sunday, including public holidays.',
  },
  {
    question: 'What golf courses can I play on the simulator?',
    answer: 'Our Korean Bravo Golf simulators feature over 100 championship courses, including world-famous venues like Pebble Beach and TPC Sawgrass, all rendered in high-definition graphics.',
  },
  {
    question: 'How do I book a bay?',
    answer: 'You can book online at booking.len.golf or add us on LINE @lengolf to reserve your bay. Walk-ins are also welcome, subject to availability.',
  },
  {
    question: 'Where is LENGOLF located?',
    answer: 'We\'re located on the 4th floor of The Mercury Ville at BTS Chidlom, 540 Ploenchit Road, Lumpini, Pathumwan, Bangkok 10330. We\'re directly accessible from the BTS Chidlom Skytrain station. See us on Google Maps.',
  },
  {
    question: 'What monthly packages do you offer?',
    answer: 'We offer 8 monthly packages ranging from 3,000 THB (Bronze, 5 hours) to 18,000 THB (Diamond+, unlimited hours for 3 months). Packages include perks like food & drink discounts. We also have Early Bird packages starting at 4,800 THB for use before 14:00.',
  },
  {
    question: 'Do you offer golf lessons?',
    answer: 'Yes, we have three Thailand PGA-certified professional coaches on staff — PRO Boss, PRO Ratchavin, and PRO Min. They offer personalized instruction for all skill levels, from beginners to advanced players, including junior golf development. Lessons use our simulators for swing analysis and data-driven improvement. Visit our lessons page for details.',
  },
  {
    question: 'How much do golf lessons cost?',
    answer: 'Lesson packages start at 1,800 THB for a 1-hour session (1 golfer). Multi-hour packages offer better value: 10 hours for 16,000 THB (valid 12 months) or 30 hours for 45,000 THB (valid 24 months). We also have a Starter Package at 11,000 THB which includes 5 hours of coaching plus 5 hours of practice. Golf simulator usage is included in all lesson packages.',
  },
]

// ── Second-Hand Club Points ──

export const secondHandClubPoints = [
  'Test any set on our simulators before you commit',
  'Well-maintained Callaway and TaylorMade sets available',
  'Significant savings over brand-new retail prices',
  'Perfect for tourists or beginners not ready to invest in new gear',
  'Ask our staff about current availability and pricing',
]

// ── Club Rental Why Choose ──

export interface ClubRentalFeature {
  title: string
  description: string
  icon: string
}

export const clubRentalWhyChoose: ClubRentalFeature[] = [
  { title: 'Premium Quality', description: 'Callaway Warbird and Callaway REVA — trusted brands used by pros and amateurs worldwide', icon: 'award' },
  { title: 'Use Anywhere + Delivery', description: 'Rent for in-house play or take clubs to any golf course in Bangkok with same-day delivery', icon: 'map-pin' },
  { title: 'Flexible Duration', description: 'Hourly, half-day, or full-day rental — pay only for the time you need', icon: 'clock' },
  { title: 'Easy Booking', description: 'Reserve clubs online at booking.len.golf or walk in — no deposit required', icon: 'calendar' },
]

// ── Club Rental FAQs ──

export const clubRentalFaqItems = [
  {
    question: 'Can tourists rent golf clubs at LENGOLF?',
    answer: 'Absolutely! We welcome tourists and visitors. Standard clubs are free with any bay booking, and premium Callaway sets start at just 150 THB per hour. No membership or deposit required — just walk in or book online at booking.len.golf.',
  },
  {
    question: 'What brands are available for premium club rental?',
    answer: 'We offer Callaway Warbird full sets for men and Callaway REVA full sets for women. Both include driver, fairway woods, irons (5–PW), and putter. These are current-generation clubs maintained to high standards.',
  },
  {
    question: 'Can I use rented clubs outside of LENGOLF?',
    answer: 'Yes! Premium club rentals can be used at LENGOLF or taken to any golf course in Bangkok. We also offer same-day club delivery for 500 THB anywhere in Bangkok — contact us on LINE @lengolf to arrange.',
  },
  {
    question: 'How much does premium club rental cost per hour?',
    answer: 'Premium clubs start at 150 THB for 1 hour, 250 THB for 2 hours, 400 THB for 4 hours, or 1,200 THB for a full day. Standard house clubs are always free with any bay booking. Check our bay rates page for simulator pricing.',
  },
  {
    question: 'Do you deliver golf clubs in Bangkok?',
    answer: 'Yes, we offer same-day delivery of premium club sets anywhere in Bangkok for 500 THB. Contact us on LINE @lengolf to book delivery. You can also find us on Google Maps at The Mercury Ville, BTS Chidlom.',
  },
  {
    question: 'Can I try clubs before buying second-hand?',
    answer: 'Yes! You can test any of our second-hand sets on the simulators before you buy. We regularly have well-maintained Callaway and TaylorMade sets available at significant savings. Ask our staff or message us on LINE @lengolf for current availability and pricing.',
  },
]

// ── About Us FAQs ──

export const aboutFaqItems = [
  {
    question: 'Where is LENGOLF located?',
    answer: 'We\'re on the 4th floor of The Mercury Ville at BTS Chidlom, 540 Ploenchit Road, Lumpini, Pathumwan, Bangkok 10330. We\'re directly connected to the BTS Chidlom Skytrain station, so you can get here without stepping outside. See us on Google Maps.',
  },
  {
    question: 'Is there parking at LENGOLF?',
    answer: 'Yes! The Mercury Ville offers 3 hours of free parking for visitors. Additional parking is available at standard mall rates. Most guests find it easiest to arrive via BTS Chidlom, which connects directly to the mall.',
  },
  {
    question: 'Do I need golf experience to visit LENGOLF?',
    answer: 'Not at all — everyone is welcome, from complete beginners to experienced golfers. Our simulators are fun and easy to use, and free standard golf club sets are provided with every bay booking. If you\'d like guidance, our PGA-certified coaches offer lessons for all skill levels. Check our lessons page for details.',
  },
  {
    question: 'What are your opening hours?',
    answer: 'LENGOLF is open daily from 9:00 AM to 11:00 PM, Monday through Sunday, including public holidays.',
  },
  {
    question: 'Can I book LENGOLF for a group or event?',
    answer: 'Absolutely! Each bay fits up to 5 players, and we host events for 50+ guests with full-location rental, catering, and drink packages starting at 9,999 THB. Visit our events page or contact us on LINE @lengolf to plan your event.',
  },
  {
    question: 'How do I contact LENGOLF?',
    answer: 'The easiest way is LINE @lengolf — you can also call us at 096-668-2335, email info@len.golf, or book directly at booking.len.golf. Our friendly team typically responds within a few hours.',
  },
]

// ── Tournament FAQs ──

export const faqItems = [
  {
    question: 'HOW DO I JOIN?',
    answer: 'Add us on LINE @lengolf and let us know when you\'d like to play your qualification round.',
  },
  {
    question: 'HOW DOES THE QUALIFICATION ROUND WORK?',
    answer: 'The qualification phase runs until 26th October. All registered pairs will play 18 holes on a course selected by LENGOLF, with their score determined by the Stableford system and the best ball format (the best score on each hole). The 8 teams with the highest scores will automatically qualify for the finals, and 4 additional teams will be randomly selected to join, playing with a handicap.',
  },
  {
    question: "WHAT'S THE STABLEFORD SYSTEM?",
    answer: 'The Stableford system is a points-based scoring method in golf. Instead of counting the total number of strokes, you earn points based on how you perform on each hole compared to par. Birdie: 3 points, Par: 2 points, Bogey: 1 point, Double bogey or worse: 0 points, Eagle: 4 points. The goal is to earn as many points as possible across all 18 holes.',
  },
  {
    question: 'HOW DOES HANDICAP SYSTEM WORK?',
    answer: "For the finals, we'll compare the scores of the randomly selected teams with the average score of the qualifying finalists. Based on this comparison, we'll assign a number of extra strokes (handicap) to the random teams to give them a fair chance in the competition.",
  },
  {
    question: 'DO I NEED TO BRING GOLF CLUBS?',
    answer: "No, we've got you covered with full sets, including ladies' sets. However, you are welcome to bring your own clubs if you prefer.",
  },
  {
    question: 'HOW DO I KEEP TRACK OF THE SCORE?',
    answer: 'Our staff will handle all scorekeeping for you.',
  },
  {
    question: 'HOW ARE THE FINALS PLAYED OUT?',
    answer: 'The finals will feature the 8 best-qualified teams and 4 randomly selected teams. Round 1: 9-hole knockout (scramble format). Round 2: 9 holes (best ball format). Final Round: 9-hole scramble to decide the winner.',
  },
]

// ── Home Page FAQs ──

export const homeFaqItems = [
  {
    question: 'What is LENGOLF?',
    answer: 'LENGOLF is an indoor golf simulator bar in Bangkok, located on the 4th floor of The Mercury Ville at BTS Chidlom. We have 4 simulator bays with Korean Bravo Golf technology, a full-service bar with cocktails and food, and PGA-certified golf coaches on staff. It\'s a place to play golf, hang out with friends, and enjoy great drinks — all in air-conditioned comfort.',
  },
  {
    question: 'How much does it cost to play at LENGOLF?',
    answer: 'Simulator bay rates start at 550 THB per hour on weekdays before 14:00, and go up to 950 THB per hour on weekends after 14:00. Each bay holds up to 5 players and free standard golf clubs are included. We also offer monthly packages from 3,000 THB. See our bay rates page for full pricing.',
  },
  {
    question: 'Where is LENGOLF located?',
    answer: 'We\'re on the 4th floor of The Mercury Ville at BTS Chidlom, 540 Ploenchit Road, Lumpini, Pathumwan, Bangkok 10330 — directly accessible from the BTS Chidlom Skytrain station. See us on Google Maps.',
  },
  {
    question: 'What are your opening hours?',
    answer: 'LENGOLF is open daily from 9:00 AM to 11:00 PM, Monday through Sunday, including public holidays.',
  },
  {
    question: 'Do I need to bring my own golf clubs?',
    answer: 'No — standard golf club sets are provided free with every bay booking, including ladies\' sets. We also offer premium Callaway Warbird and Callaway REVA rentals from 150 THB per hour. Visit our club rental page for details.',
  },
  {
    question: 'Do you offer golf lessons?',
    answer: 'Yes! We have three Thailand PGA-certified coaches on staff — PRO Boss, PRO Ratchavin, and PRO Min. They teach all skill levels from complete beginners to advanced players. Lessons start at 1,800 THB per hour and we offer a free 1-hour trial lesson. Visit our lessons page for packages and pricing.',
  },
  {
    question: 'Can I host an event or party at LENGOLF?',
    answer: 'Absolutely! We host corporate events, team building, birthdays, and private parties for up to 50+ guests. Packages start at 9,999 THB and include golf bays, drinks, and catered food. Visit our events page or contact us on LINE @lengolf to plan your event.',
  },
  {
    question: 'How do I book a bay at LENGOLF?',
    answer: 'Book online at booking.len.golf, add us on LINE @lengolf, or just walk in. Online booking lets you choose your date, bay, and time slot in advance. Walk-ins are welcome subject to availability.',
  },
]

// ── Dynamic Pricing Getters ──
// Fetch live prices from the API, fall back to hardcoded values above if unavailable.

export async function getBayRatesData(catalog?: PricingCatalog | null): Promise<{
  bayRates: BayRateRow[]
  bayRateNotes: string[]
}> {
  catalog = catalog ?? await getPricingCatalog()
  if (!catalog) return { bayRates, bayRateNotes }

  const morningWD = findPrice(catalog.bayRates.morning, /weekday/i)
  const morningWE = findPrice(catalog.bayRates.morning, /weekend/i)
  const afternoonWD = findPrice(catalog.bayRates.afternoon, /weekday/i)
  const afternoonWE = findPrice(catalog.bayRates.afternoon, /weekend/i)
  const eveningWD = findPrice(catalog.bayRates.evening, /weekday/i)
  const eveningWE = findPrice(catalog.bayRates.evening, /weekend/i)

  return {
    bayRates: [
      { timeSlot: 'Before 14:00',  weekday: formatThb(morningWD ?? 550),   weekend: formatThb(morningWE ?? 750) },
      { timeSlot: '14:00 – 17:00', weekday: formatThb(afternoonWD ?? 750), weekend: formatThb(afternoonWE ?? 950) },
      { timeSlot: '17:00 – 23:00', weekday: formatThb(eveningWD ?? 750),   weekend: formatThb(eveningWE ?? 950),  featured: 'promo' },
    ],
    bayRateNotes,
  }
}

export async function getMonthlyPackagesData(catalog?: PricingCatalog | null): Promise<{
  monthlyPackages: MonthlyPackageRow[]
  monthlyPackageNotes: string[]
}> {
  catalog = catalog ?? await getPricingCatalog()
  if (!catalog) return { monthlyPackages, monthlyPackageNotes }

  // Map API product names to package names. Only update prices; hours/validity/perks stay hardcoded.
  const priceMap: Record<string, RegExp> = {
    'Early Bird*': /early bird package/i,
    'Early Bird+*': /early bird \+/i,
    'Bronze': /^bronze/i,
    'Silver': /^silver/i,
    'Gold': /^gold/i,
    'Diamond': /^diamond \(1/i,
    'Diamond+': /^diamond\+/i,
  }

  return {
    monthlyPackages: monthlyPackages.map((pkg) => {
      const pattern = priceMap[pkg.name]
      if (!pattern) return pkg
      const price = findPrice(catalog.packages, pattern)
      return price !== undefined ? { ...pkg, price: formatThb(price) } : pkg
    }),
    monthlyPackageNotes,
  }
}

export async function getLessonPricingData(catalog?: PricingCatalog | null): Promise<{
  lessonPricing: LessonPackage[]
  lessonNotes: string[]
}> {
  catalog = catalog ?? await getPricingCatalog()
  if (!catalog) return { lessonPricing, lessonNotes }

  // Map lesson package names → API coaching product patterns (1 golfer)
  const oneGolferMap: Record<string, RegExp> = {
    '1 Hour': /^1 golf lessons?$/i,
    '5 Hour': /^5 golf lessons? package$/i,
    '10 Hour': /^10 golf lessons? package$/i,
    '20 Hour': /^20 golf lessons? package$/i,
    '30 Hour': /^30 golf lessons? package$/i,
    '50 Hour': /^50 golf lessons? package$/i,
  }
  // 2 golfer patterns
  const twoGolferMap: Record<string, RegExp> = {
    '1 Hour': /1 golf lessons? \(2 pax\)/i,
    '5 Hour': /5 golf lessons? package \(2 pax\)/i,
    '10 Hour': /10 golf lessons? \(2 pax\)/i,
    '20 Hour': /20 golf lessons? package \(2 pax\)/i,
    '30 Hour': /30 golf lessons? package \(2 pax\)/i,
    '50 Hour': /50 golf lessons? package \(2 pax\)/i,
  }

  // Starter Package comes from mixedPackages
  const starterPrice = findPrice(catalog.mixedPackages, /^starter package$/i)
  const starterTwoPrice = findPrice(catalog.mixedPackages, /starter package \(2/i)
  // Sim to Fairway 2-person is in coaching
  const simToFairwayTwoPrice = findPrice(catalog.coaching, /sim to fairway.*2/i)

  return {
    lessonPricing: lessonPricing.map((pkg) => {
      const updated = { ...pkg }

      // 1 golfer
      const onePattern = oneGolferMap[pkg.name]
      if (onePattern) {
        const price = findPrice(catalog.coaching, onePattern)
        if (price !== undefined) updated.oneGolfer = formatThb(price)
      }
      // Starter & Sim to Fairway
      if (pkg.name === 'Starter Package*' && starterPrice !== undefined) {
        updated.oneGolfer = formatThb(starterPrice)
      }
      if (pkg.name === 'Starter Package*' && starterTwoPrice !== undefined) {
        updated.twoGolfers = formatThb(starterTwoPrice)
      }

      // 2 golfers
      const twoPattern = twoGolferMap[pkg.name]
      if (twoPattern) {
        const price = findPrice(catalog.coaching, twoPattern)
        if (price !== undefined) updated.twoGolfers = formatThb(price)
      }
      if (pkg.name === 'Sim to Fairway*' && simToFairwayTwoPrice !== undefined) {
        updated.twoGolfers = formatThb(simToFairwayTwoPrice)
      }

      // 3-5 golfers: NOT available in API, keep hardcoded

      return updated
    }),
    lessonNotes,
  }
}

export async function getEventPackagesData(catalog?: PricingCatalog | null): Promise<{
  eventPackages: EventPackage[]
  eventPackageNotes: string[]
}> {
  catalog = catalog ?? await getPricingCatalog()
  if (!catalog) return { eventPackages, eventPackageNotes }

  // Only update price field — all other event details (guests, bays, food, etc.) stay hardcoded
  const priceMap: Record<string, RegExp> = {
    'Small Package': /small package/i,
    'Medium Package': /medium package/i,
  }

  return {
    eventPackages: eventPackages.map((pkg) => {
      const pattern = priceMap[pkg.name]
      if (!pattern) return pkg
      const price = findPrice(catalog.events, pattern)
      return price !== undefined ? { ...pkg, price: formatThb(price) } : pkg
    }),
    eventPackageNotes,
  }
}
