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
 * All four locales — `th`, `ja`, `ko` and `zh` — are populated
 * (mirrors `RegionHubTranslation` in golf-courses-i18n.ts).
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
    // JA GSC context (2026-07): Japanese searchers typed 「バンコク の ゴルフ場 安い」
    // and 「バンコク ゴルフ 安い」 and landed on the EN page at pos 58-64 with 0
    // clicks. JA titles therefore front-load バンコク近郊の安いゴルフ場 plus the
    // ฿X,XXX ceiling (kept verbatim — it matches the page's UI badges).
    // Localization decision — opposite of TH: the EN English-language-specific
    // caveats ("limited English on the line", "book-able online in English")
    // are KEPT for JA. Japanese readers ARE international visitors, so a
    // phone-only booking line with limited English is directly relevant.
    ja: {
      title: 'バンコク近郊の安いゴルフ場 ฿1,500以下 — おすすめコースと注意点',
      framing:
        'タイのグリーンフィー市場の中でも最安値帯です。この価格帯のラウンドは、開場から年数を経た市営・政府系コース（EGATの発電所併設コース、軍関係のクラブなど）が中心で、海外からのビジターでもビュッフェブランチほどの料金で18ホールをプレーできます。',
      catch:
        'クラブハウスの設備は必要最低限と考えてください。ほとんどのコースにドライビングレンジはなく、コースコンディションは降雨量によって大きく変わります。ゴルフカートがない場合もあり、歩きでのラウンドのみのコースも少なくありません。',
    },
    // KO localization decision — same as JA, opposite of TH: the EN
    // English-language-specific caveats ("limited English on the line",
    // "book-able online in English") are KEPT — Korean readers ARE
    // international visitors. Latin course/designer names (Nikanti,
    // Schmidt-Curley, Nicklaus, EGAT, Asian Tour) stay verbatim without
    // hangul glosses, matching the shipped KO guide corpus in
    // data/explainer-pages.ts ("Nikanti는 …", "Nikanti·Alpine은 …").
    ko: {
      title: '방콕 근교 저렴한 골프장 ฿1,500 이하 — 추천 코스와 주의할 점',
      framing:
        '태국 그린피 시장에서 가장 낮은 가격대예요. 이 가격대의 라운딩은 주로 오래된 시영·정부 계열 코스(EGAT 발전소 부설 코스, 군 소속 클럽 등)에서 이루어지며, 외국인 방문객도 뷔페 브런치 한 끼 가격으로 18홀을 플레이할 수 있어요.',
      catch:
        '클럽하우스 시설은 기본적인 수준이라고 생각해 두세요. 대부분의 코스에 드라이빙 레인지가 없고, 코스 상태는 강우량에 따라 크게 달라져요. 골프 카트가 없는 경우도 있으며, 걸어서만 라운딩해야 하는 코스도 많아요.',
    },
    // ZH GSC context (2026-07): a ZH searcher typed 室内高尔夫球练习场 收费 —
    // fee/price intent — so titles front-load 曼谷周边便宜高尔夫球场 plus the
    // ฿X,XXX ceiling (kept verbatim, matching the page's UI badges).
    // Localization decision — same as JA/KO, opposite of TH: the EN
    // English-language-specific caveats ("limited English on the line",
    // "book-able online in English") are KEPT — Chinese readers ARE
    // international visitors. Latin names follow the shipped ZH corpus in
    // data/explainer-pages.ts (the ZH green-fees entry is the reference):
    // course names stay Latin verbatim ("Nikanti的全包定价最透明"), Asian Tour
    // is glossed 亚洲巡回赛（Asian Tour） (ZH Phuket guide), designer person
    // names get transliteration + Latin parens (尼克劳斯（Nicklaus）, per
    // 杰克·尼克劳斯（Jack Nicklaus） in the same corpus); Schmidt-Curley has no
    // shipped transliteration and stays Latin verbatim.
    zh: {
      title: '曼谷周边便宜高尔夫球场 ฿1,500以下 — 推荐球场与注意事项',
      framing:
        '处于泰国果岭费市场的最低价位。这个价位的球局一般在开业多年的市政或政府系球场（EGAT电厂附属球场、军方俱乐部等）进行，外国访客花一顿自助早午餐的钱就能打完18洞。',
      catch:
        '会所设施请按基础水平预期：大多数球场没有练习场，场地状态也会随降雨量明显起伏。球车未必租得到，这类球场不少只能步行打球。',
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
    ja: {
      title: 'バンコク近郊の安いゴルフ場 ฿2,500以下 — おすすめコースと注意点',
      framing:
        'バンコク中心部から90分圏内で楽しめる、堅実な中価格帯のゴルフです。この価格帯のコースの多くは開場から15年以上が経ち、建設時と同じオーナーグループが今も運営しています。平日料金は訪タイ観光客よりも、タイ国内の一般ゴルファー向けに設定されています。',
      catch:
        '予約は電話のみというコースが多く、電話口では英語が通じにくいことがあります。コンディションは乾季には良好ですが、グリーンの速さはコースごとに差が出ます。キャディーとカートは原則として利用必須で、料金に含まれているのが一般的です。',
    },
    ko: {
      title: '방콕 근교 저렴한 골프장 ฿2,500 이하 — 추천 코스와 주의할 점',
      framing:
        '방콕 중심부에서 90분 이내에 즐길 수 있는, 실속 있는 중저가 골프예요. 이 가격대 코스 대부분은 개장한 지 15년이 넘었고, 처음 코스를 지은 오너 그룹이 지금도 운영하고 있어요. 평일 요금은 외국인 관광객보다는 태국 현지 일반 골퍼를 겨냥해 책정되어 있어요.',
      catch:
        '예약이 전화로만 가능한 코스가 많고, 전화 응대에서 영어가 잘 통하지 않을 수 있어요. 건기에는 코스 상태가 좋은 편이지만 그린 스피드는 코스마다 차이가 나요. 캐디와 카트는 대개 이용이 필수이며 요금에 포함되어 있어요.',
    },
    zh: {
      title: '曼谷周边便宜高尔夫球场 ฿2,500以下 — 推荐球场与注意事项',
      framing:
        '从曼谷市中心出发90分钟以内、实实在在的中等预算高尔夫。这个价位段的球场大多已开业15年以上，至今仍由当年建场的同一业主集团经营，平日价格主要面向泰国本地球友，而非入境游客。',
      catch:
        '预订往往只能打电话，而且电话里英语未必说得通。旱季场地状态扎实，但果岭速度各场不一。球童和球车通常为强制使用，费用已包含在价格里。',
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
    ja: {
      title: 'バンコク近郊の安いゴルフ場 ฿3,500以下 — おすすめコースと注意点',
      framing:
        '予算を意識しながら旅行するゴルファーにとって、最もバランスの良い価格帯です。バンコクから1時間圏内のモダンなレイアウトを、キャディーとカート付きの18ホールとしては海外のほとんどの市場では考えられない安さでプレーできます。',
      catch:
        '週末料金は30〜40%上がることが多く、この価格帯が真価を発揮するのは平日プレーです。価格帯上位の一部のコースにはキャディーへのチップの慣習があり、公表されているグリーンフィーに300〜500THBがひそかに上乗せされます。',
    },
    ko: {
      title: '방콕 근교 저렴한 골프장 ฿3,500 이하 — 추천 코스와 주의할 점',
      framing:
        '예산을 생각하며 여행하는 골퍼에게 가장 균형 잡힌 가격대예요. 방콕에서 1시간 이내의 현대적인 코스를, 캐디와 카트가 포함된 18홀 라운딩치고는 해외 대부분의 시장에서 믿기 어려울 만큼 낮은 가격에 즐길 수 있어요.',
      catch:
        '주말 요금은 30~40% 오르는 경우가 많아서, 이 가격대는 평일 플레이에 가장 유용해요. 가격대 상단의 일부 코스에는 캐디 팁 관행이 있어서, 공시된 그린피에 300~500바트가 슬그머니 더해지기도 해요.',
    },
    zh: {
      title: '曼谷周边便宜高尔夫球场 ฿3,500以下 — 推荐球场与注意事项',
      framing:
        '对精打细算的到访球友来说，这是最划算的价位段——曼谷1小时以内的现代球场，18洞含球童和球车的价格，在大多数国际市场看来低得难以置信。',
      catch:
        '周末价格常上涨30–40%，所以这个价位段最适合平日打球。价位段上端的部分球场有球童小费惯例，会在公示的果岭费之外悄悄多出300–500泰铢。',
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
    ja: {
      title: 'バンコク近郊の安いゴルフ場 ฿5,000以下 — おすすめコースと注意点',
      framing:
        '最高級の名門コースの領域には踏み込まない、プレミアムなデイリーフィーゴルフです。この価格帯には、海外のゴルフツアー団体が定期的に利用するバンコク周辺の上位コースが含まれます。コンディションが良く、トーナメント開催にも対応し、英語でのオンライン予約が可能です。',
      catch:
        'この価格帯には人気の高いコースが複数あり、そうしたコースでは平日のティータイムでも3〜7日前の事前予約が必要です。キャディーに関するマナーはより格式があり、制服姿のキャディーと、ラウンド終了時の決まった形のチップを想定しておきましょう。',
    },
    ko: {
      title: '방콕 근교 저렴한 골프장 ฿5,000 이하 — 추천 코스와 주의할 점',
      framing:
        '최고급 명문 코스 영역까지는 가지 않는, 프리미엄 데일리피 골프예요. 이 가격대에는 해외 골프 투어 그룹이 정기적으로 이용하는 방콕 지역 상위권 코스들이 들어 있어요. 코스 상태가 좋고, 토너먼트 개최가 가능한 수준이며, 영어로 온라인 예약도 할 수 있어요.',
      catch:
        '이 가격대에는 인기가 많은 코스가 여럿 있어서, 평일 티타임도 3~7일 전에 미리 예약해야 해요. 캐디 관련 에티켓은 좀 더 격식을 갖춘 편이라, 유니폼을 입은 캐디와 라운딩이 끝난 뒤의 정해진 형식의 팁 문화를 예상해 두는 게 좋아요.',
    },
    zh: {
      title: '曼谷周边便宜高尔夫球场 ฿5,000以下 — 推荐球场与注意事项',
      framing:
        '尚未跨入顶级名场领域的高端按次收费球场。这个价位段涵盖国际高尔夫旅行团常年使用的曼谷地区较好球场——场地养护到位、具备办赛水准，还能用英语在线预订。',
      catch:
        '这个价位段有好几座球场热门到平日开球时间也要提前3–7天预订。球童礼仪更为正式：球童统一着装，并在打完一轮后按既定惯例给小费。',
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
    ja: {
      title: 'バンコク近郊の安いゴルフ場 ฿7,500以下 — おすすめコースと注意点',
      framing:
        '観光で訪れるゴルファー向け市場の最上位帯です。この価格帯の名門コースには、オールインクルーシブのプレミアム体験を提供するNikanti（ニカンティ）、Asian Tourの開催実績を持つコース、そしてタイを世界のゴルフ地図に載せたSchmidt-Curley（シュミット・カーリー）やNicklaus（ニクラウス）設計の代表的コースが含まれます。',
      catch:
        'この価格帯のコースでは、週末料金が見出しの上限額を上回ることも珍しくありません。旅行日程に融通が利くなら、平日プレーのほうがはるかに割安です。ドレスコードは厳格に運用されており、コース公式サイトからのオンライン予約が最も安く済むのが一般的です。',
    },
    ko: {
      title: '방콕 근교 저렴한 골프장 ฿7,500 이하 — 추천 코스와 주의할 점',
      framing:
        '방문 관광객 시장의 최상위 가격대예요. 이 가격대의 명문 코스에는 올인클루시브 프리미엄 경험을 제공하는 Nikanti, Asian Tour 대회를 개최했던 코스, 그리고 태국을 세계 골프 지도에 올려놓은 Schmidt-Curley와 Nicklaus 설계의 대표 코스들이 포함돼요.',
      catch:
        '이 가격대 코스들은 주말 요금이 표시된 상한 금액을 넘어서는 경우가 많아요. 여행 날짜에 여유가 있다면 평일 플레이가 훨씬 더 이득이에요. 드레스 코드가 엄격히 적용되며, 코스 공식 사이트를 통한 온라인 예약이 보통 가장 저렴해요.',
    },
    zh: {
      title: '曼谷周边便宜高尔夫球场 ฿7,500以下 — 推荐球场与注意事项',
      framing:
        '到访游客市场的最高价位段。这里的名场包括全包式高端体验（Nikanti）、曾承办亚洲巡回赛（Asian Tour）赛事的球场，以及把泰国推上世界高尔夫版图的Schmidt-Curley与尼克劳斯（Nicklaus）设计名作。',
      catch:
        '这些球场的周末价格经常超出本页标示的上限；如果你的行程日期灵活，平日打球划算得多。着装要求会被严格执行，而通过球场官网在线预订通常最便宜。',
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
