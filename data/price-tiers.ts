/**
 * Price tiers for the /golf-courses/under-[price]-baht/ pages.
 *
 * Tier values are weekday green fee ceilings in THB. The "framing" copy is
 * shown as the page intro — kept honest and specific so each tier reads
 * as a different page (not just five copies of the same template).
 */
export interface PriceTier {
  thb: number
  slug: string
  title: string
  framing: string
  catch: string
}

export const PRICE_TIERS: readonly PriceTier[] = [
  {
    thb: 1500,
    slug: '1500-baht',
    title: 'Best Bangkok-Area Golf Courses Under ฿1,500',
    framing:
      'At the very low end of the Thai green-fee market. These rounds are typically at older municipal or government layouts (EGAT power-plant courses, military clubs) where a foreign visitor can play 18 holes for the price of a buffet brunch.',
    catch:
      'Expect basic clubhouse facilities, no driving range at most venues, and conditioning that varies sharply with rainfall. Golf carts may not be available; many of these courses are walking-only.',
  },
  {
    thb: 2500,
    slug: '2500-baht',
    title: 'Best Bangkok-Area Golf Courses Under ฿2,500',
    framing:
      'Honest mid-budget golf within 90 minutes of central Bangkok. Most courses in this band are 15+ years old and run by the same ownership group that built them, with weekday rates aimed at the Thai retail golfer rather than the inbound tourist.',
    catch:
      'Booking is often phone-only, with limited English on the line. Conditioning is solid in the dry season but green speeds vary. Caddies and carts are usually mandatory and bundled in.',
  },
  {
    thb: 3500,
    slug: '3500-baht',
    title: 'Best Bangkok-Area Golf Courses Under ฿3,500',
    framing:
      'The sweet spot for the budget-conscious visiting golfer — modern layouts within an hour of Bangkok at a price most international markets would consider impossibly low for an 18-hole round with caddie and cart.',
    catch:
      'Weekend rates often jump 30–40%, so this tier is most useful for weekday play. Some venues at the top of the band introduce caddie tipping conventions that quietly add 300–500 THB to the published green fee.',
  },
  {
    thb: 5000,
    slug: '5000-baht',
    title: 'Best Bangkok-Area Golf Courses Under ฿5,000',
    framing:
      'Premium daily-fee golf without crossing into trophy-course territory. This band covers the better Bangkok-region courses that international tour groups regularly use — well-conditioned, tournament-ready, and book-able online in English.',
    catch:
      'Several courses in this range are popular enough that weekday tee times need 3–7 days’ advance booking. Caddie etiquette is more formal; expect uniformed caddies and structured tipping at the end of the round.',
  },
  {
    thb: 7500,
    slug: '7500-baht',
    title: 'Best Bangkok-Area Golf Courses Under ฿7,500',
    framing:
      'The top end of the visiting-tourist market. Trophy courses here include all-inclusive premium experiences (Nikanti), former Asian Tour venues, and the marquee Schmidt-Curley and Nicklaus designs that put Thailand on the world golf map.',
    catch:
      'Weekend rates frequently exceed the headline tier on these courses; if your trip dates are flexible, weekday play is dramatically better value. Dress codes are enforced and online booking through the course’s own site is usually cheapest.',
  },
] as const

export const PRICE_TIER_SLUGS = PRICE_TIERS.map((t) => t.slug)

/**
 * Per-locale translations for the price-tier pages
 * (app/[locale]/golf-courses/under/[tier]/page.tsx).
 *
 * Unlike `data/golf-courses-i18n.ts` (deliberately split from `lib/golf-courses.ts`
 * because that file is `import 'server-only'`), this map lives right alongside
 * `PRICE_TIERS` above: this file has never carried a `server-only` guard, so a
 * plain-data sibling file isn't needed for the smoke test to import it safely.
 *
 * GSC context (2026-07): Thai searchers type the literal ฿X,XXX price form
 * (e.g. ฿3,500, ฿7,500) and land on the EN page with ~0 clicks at pos 4.5-7.6.
 * `title` therefore keeps the ฿X,XXX form verbatim (it's the query Thais type),
 * while `framing`/`catch` prose spells out บาท per the TH glossary currency
 * ruling (data/i18n-glossary/th.json conventions.currency).
 *
 * Honesty note: `framing`/`catch` carry deliberately honest caveats (walking-only
 * courses, phone-only booking, conditioning variance) translated from the EN
 * source without softening. One EN caveat — "limited English on the line" — is
 * viewpoint-dependent (a non-issue for a Thai-speaking caller) and was reframed
 * to drop the English-specific clause while preserving the underlying fact
 * (booking is phone-only, no online option). Two similar reframes (dropping
 * "visiting golfer" framing on the 3500 tier, and "book-able ... in English" on
 * the 5000 tier) are documented in the batch commit/PR notes — the reframed
 * clause is always a viewpoint, never a fact, and the fact itself survives.
 *
 * Only `th` is populated for now; add `ja`/`ko`/`zh` rows the same way once a
 * batch translates them (mirrors `RegionHubTranslation` in golf-courses-i18n.ts).
 */
export interface PriceTierTranslation {
  title: string
  framing: string
  catch: string
}

type PriceTierLocale = 'th' | 'ja' | 'ko' | 'zh'

export const PRICE_TIER_I18N: Partial<
  Record<string, Partial<Record<PriceTierLocale, PriceTierTranslation>>>
> = {
  '1500-baht': {
    th: {
      title: 'สนามกอล์ฟกรุงเทพฯ ที่ดีที่สุด ราคาไม่เกิน ฿1,500',
      framing:
        'อยู่ในกลุ่มราคาต่ำสุดของตลาดค่ากรีนฟีในไทย รอบส่วนใหญ่ในระดับราคานี้เล่นที่สนามเทศบาลหรือสนามของหน่วยงานรัฐที่เปิดมานาน (สนามของการไฟฟ้าฝ่ายผลิตแห่งประเทศไทยตามโรงไฟฟ้า สนามของหน่วยทหาร) ซึ่งนักกอล์ฟต่างชาติสามารถเล่น 18 หลุมได้ในราคาเทียบเท่ามื้อบุฟเฟต์เช้าสาย',
      catch:
        'คาดหวังสิ่งอำนวยความสะดวกในคลับเฮาส์แบบพื้นฐาน สนามส่วนใหญ่ไม่มีสนามไดรฟ์ และสภาพสนามจะแปรผันตามปริมาณฝนอย่างชัดเจน รถกอล์ฟอาจไม่มีให้บริการ สนามหลายแห่งในกลุ่มนี้เป็นแบบเดินตีเท่านั้น',
    },
  },
  '2500-baht': {
    th: {
      title: 'สนามกอล์ฟกรุงเทพฯ ที่ดีที่สุด ราคาไม่เกิน ฿2,500',
      framing:
        'กอล์ฟงบปานกลางที่คุ้มค่าจริง ภายในระยะเวลาไม่เกิน 90 นาทีจากใจกลางกรุงเทพฯ สนามส่วนใหญ่ในระดับราคานี้เปิดมานานกว่า 15 ปี และบริหารโดยกลุ่มเจ้าของเดิมที่สร้างสนามขึ้นมา โดยราคาวันธรรมดาเน้นกลุ่มนักกอล์ฟไทยทั่วไปมากกว่านักท่องเที่ยวต่างชาติ',
      catch:
        'การจองมักทำได้ทางโทรศัพท์เท่านั้น ยังไม่มีระบบจองออนไลน์ สภาพสนามดีในช่วงฤดูแล้งแต่ความเร็วกรีนแตกต่างกันไปแต่ละสนาม แคดดี้และรถกอล์ฟส่วนใหญ่บังคับใช้บริการและรวมอยู่ในราคาแล้ว',
    },
  },
  '3500-baht': {
    th: {
      title: 'สนามกอล์ฟกรุงเทพฯ ที่ดีที่สุด ราคาไม่เกิน ฿3,500',
      framing:
        'จุดคุ้มค่าที่สุดสำหรับนักกอล์ฟที่ดูแลงบประมาณ — สนามสมัยใหม่ในระยะเวลาไม่เกิน 1 ชั่วโมงจากกรุงเทพฯ ในราคาที่ตลาดกอล์ฟต่างประเทศส่วนใหญ่มองว่าถูกอย่างไม่น่าเชื่อ สำหรับการเล่น 18 หลุมพร้อมแคดดี้และรถกอล์ฟ',
      catch:
        'ราคาวันหยุดสุดสัปดาห์มักปรับขึ้น 30-40% ระดับราคานี้จึงเหมาะกับการเล่นวันธรรมดามากที่สุด สนามบางแห่งในกลุ่มบนของระดับราคานี้มีธรรมเนียมทิปแคดดี้ที่จะเพิ่มค่าใช้จ่ายอีก 300-500 บาท จากค่ากรีนฟีที่ประกาศไว้',
    },
  },
  '5000-baht': {
    th: {
      title: 'สนามกอล์ฟกรุงเทพฯ ที่ดีที่สุด ราคาไม่เกิน ฿5,000',
      framing:
        'กอล์ฟระดับพรีเมียมในราคารายวัน โดยยังไม่ถึงระดับสนามชื่อดังระดับโลก กลุ่มราคานี้ครอบคลุมสนามที่ดีกว่าในเขตกรุงเทพฯ ที่กรุ๊ปทัวร์กอล์ฟต่างชาติเลือกใช้เป็นประจำ — สภาพสนามดี พร้อมสำหรับการแข่งขัน และจองออนไลน์ได้',
      catch:
        'สนามหลายแห่งในระดับราคานี้ได้รับความนิยมสูงจนทีไทม์วันธรรมดาต้องจองล่วงหน้า 3-7 วัน มารยาทแคดดี้เป็นทางการมากขึ้น คาดหวังแคดดี้ที่แต่งเครื่องแบบและระบบทิปที่มีแบบแผนเมื่อจบรอบ',
    },
  },
  '7500-baht': {
    th: {
      title: 'สนามกอล์ฟกรุงเทพฯ ที่ดีที่สุด ราคาไม่เกิน ฿7,500',
      framing:
        'ระดับบนสุดของตลาดนักท่องเที่ยวที่มาเยือน สนามระดับแชมป์ในกลุ่มนี้มีทั้งประสบการณ์พรีเมียมแบบครบวงจร (Nikanti) สนามที่เคยเป็นเจ้าภาพการแข่งขัน Asian Tour และสนามออกแบบโดย Schmidt-Curley และ Nicklaus ที่ทำให้ประเทศไทยมีชื่อเสียงในวงการกอล์ฟระดับโลก',
      catch:
        'ราคาวันหยุดสุดสัปดาห์ของสนามกลุ่มนี้มักสูงกว่าราคาหลักที่ประกาศไว้ หากวันเดินทางของคุณยืดหยุ่นได้ การเล่นวันธรรมดาคุ้มค่ากว่ามาก มีการบังคับใช้กฎการแต่งกาย และการจองออนไลน์ผ่านเว็บไซต์ของสนามเองมักมีราคาถูกที่สุด',
    },
  },
}

/**
 * Localized {title, framing, catch} for a (tier slug, locale), or null when no
 * published translation exists (caller falls back to the EN PRICE_TIERS values).
 */
export function getPriceTierTranslation(
  slug: string,
  locale: string
): PriceTierTranslation | null {
  const byLocale = PRICE_TIER_I18N[slug]
  if (!byLocale) return null
  return byLocale[locale as PriceTierLocale] ?? null
}

/**
 * Every (locale, tier) pair that has a published translation. Used by the
 * page's generateStaticParams (so only translated combos build beyond EN) AND
 * by the smoke-test price-tier registry consistency check.
 */
export function getTranslatedPriceTierParams(): { locale: string; tier: string }[] {
  const params: { locale: string; tier: string }[] = []
  for (const slug of Object.keys(PRICE_TIER_I18N)) {
    const byLocale = PRICE_TIER_I18N[slug]
    if (!byLocale) continue
    for (const locale of Object.keys(byLocale) as PriceTierLocale[]) {
      params.push({ locale, tier: slug })
    }
  }
  return params
}
