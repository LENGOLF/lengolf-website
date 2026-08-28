import type { GolfCourse } from '@/types/golf-courses'

export const course: GolfCourse = {
  slug: 'royal-chiang-mai-golf-club',
  region: 'chiang-mai',
  name: `Royal Chiang Mai Golf Club & Resort`,
  province: `Chiang Mai`,
  designer: `Peter Thomson`,
  holes: 18,
  par: 72,
  year_opened: 1996,
  green_fee_weekday_thb: 4800,
  green_fee_weekend_thb: 4800,
  // All-in package, per this file's own EN prose: high-season all-in rate ~4,800 THB includes caddie and cart. The rate
  // basis above is unchanged; this only stops generated copy calling the
  // number a bare "green fee".
  fee_is_package: true,
  // Zero, not null: the caddie costs this golfer nothing on top of the package.
  caddie_fee_thb: 0,
  // Zero for the same reason as caddie_fee_thb above — bundled into the package.
  cart_fee_thb: 0,
  caddie_required: true,
  cart_required: true,
  driving_range: true,
  website: 'https://www.royalchiangmai.com/',
  phone: '+66 52 081 995',
  latitude: 19.0268,
  longitude: 98.9892,
  // Was 18.8417,99 — 20.6km off; the broken component was the LATITUDE, not the 0dp longitude. Official site DMS + Overture POI + polygon agree within 600m.
  coordinates_verified_at: '2026-07-31',
  distance_from_bangkok_km: 700,
  drive_time_from_bangkok_min: null,
  google_maps_url: null,
  club_rental_available: true,
  club_rental_fee_thb: null,
  club_rental_brands: null,
  schema_markup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"GolfCourse\",\n  \"name\": \"Royal Chiang Mai Golf Club & Resort\",\n  \"url\": \"https://len.golf/golf-courses/chiang-mai/royal-chiang-mai-golf-club\",\n  \"description\": null,\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"addressLocality\": \"Chiang Mai\",\n    \"addressCountry\": \"TH\"\n  },\n  \"geo\": {\n    \"@type\": \"GeoCoordinates\",\n    \"latitude\": 18.8417,\n    \"longitude\": 99\n  },\n  \"telephone\": \"+66 52 081 995\",\n  \"priceRange\": \"฿฿฿\",\n  \"sameAs\": [\n    \"https://www.royalchiangmai.com/\"\n  ],\n  \"amenityFeature\": [\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Driving Range\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Caddie Required\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Golf Cart\",\n      \"value\": true\n    }\n  ]\n}",
  prose: {
    overview: `Royal Chiang Mai Golf Club & Resort is one of the most storied courses in Northern Thailand: an 18-hole, par-72 design by five-time British Open champion Peter Thomson that opened in February 1996. Set within a valley approximately 40 kilometres north of Chiang Mai city in the Mae Faek area of San Sai district, the course was conceived as a British parkland layout with links-style elements, including pot bunkers, bump-and-run approaches, and undulating fairways that reward ground game strategy rather than purely aerial attacks on the pin. The site was formerly a fruit orchard, and the mature trees that remain give the layout a sense of scale and shade unusual for a course of its age. The surrounding mountain ridges frame the property and provide a scenic backdrop throughout the round.`,
    layout_and_experience: `Thomson's design at 6,969 yards is modest by modern yardage standards — there are no black tees — but the challenge comes from strategic placement rather than length. The course is heavily tree-lined, with corridors that punish anything other than a shaped tee shot. The fairways are undulating rather than flat, and Thomson incorporated the natural slope of the valley floor to create subtle ground-level hazards that affect the lie of approach shots.

Pot bunkers — deep, steep-faced, and strategically positioned to catch half-missed approaches — are the signature defense mechanism. Water hazards also appear on most holes, adding a second layer of strategic complexity. The greens are fast, well-maintained Tiff Dwarf bermuda surfaces. Peak condition is maintained in the cool dry season (November–March).`,
    tips: `Book at royalchiangmai.com or via a booking platform to confirm current rates — the high-season all-in rate of approximately 4,800 THB includes caddie and cart. Ask the caddie for yardage book guidance on the pot bunker positions before selecting a target line. The course rewards accuracy over distance — a conservative strategy off the tee will reduce double-bogey risk. Morning rounds are cooler and the valley mist in November–January adds distinctive atmosphere.`,
    location_and_access: `Royal Chiang Mai Golf Club & Resort is located in Mae Faek, San Sai District, approximately 40 kilometres north of Chiang Mai city and 40 minutes by road from Chiang Mai International Airport (CNX). Visitors from Bangkok fly to CNX (approximately 1 hour 10 minutes from Suvarnabhumi or Don Mueang) — driving the 700 kilometres from Bangkok is not practical. The course is reached by private car, Grab taxi, or the resort's transfer service via Route 1001 northward from Chiang Mai.`,
    rental_cta_context: `Playing Royal Chiang Mai Golf Club — Peter Thomson's classic Northern Thailand design? Rent premium clubs in Bangkok — delivered to your hotel before you fly — so you arrive ready to tackle those pot bunkers without the hassle of airline baggage fees.`,
  },
  locales: {
    en: {
      title: `Royal Chiang Mai Golf Club & Resort — Green Fees, Course Guide & Golf Club Rentals`,
      meta_description: `Royal Chiang Mai Golf Club & Resort green fees, course overview, tips, and how to arrange golf club rentals delivered to your Bangkok hotel.`,
    },
    th: {
      title: `Royal Chiang Mai Golf Club & Resort — แพ็กเกจรวมทุกอย่าง รีวิวสนามกอล์ฟเชียงใหม่ และเช่าไม้กอล์ฟ`,
      meta_description: `แพ็กเกจรวมทุกอย่างช่วงไฮซีซันที่ Royal Chiang Mai Golf Club & Resort อยู่ที่ประมาณ 4,800 บาท รวมแคดดี้และรถกอล์ฟ สนาม 18 หลุม พาร์ 72 ออกแบบโดย Peter Thomson ห่างจากตัวเมืองเชียงใหม่ขึ้นไปทางเหนือราว 40 กิโลเมตร พร้อมบริการเช่าไม้กอล์ฟส่งถึงโรงแรมในกรุงเทพฯ`,
      prose: {
        overview: `Royal Chiang Mai Golf Club & Resort เป็นหนึ่งในสนามที่มีเรื่องราวน่าจดจำที่สุดในภาคเหนือของประเทศไทย เป็นสนาม 18 หลุม พาร์ 72 ที่ออกแบบโดย Peter Thomson แชมป์ British Open 5 สมัย และเปิดให้บริการเมื่อเดือนกุมภาพันธ์ 1996 ตัวสนามตั้งอยู่ในหุบเขา ห่างจากตัวเมืองเชียงใหม่ขึ้นไปทางเหนือประมาณ 40 กิโลเมตร ในพื้นที่แม่แฝก อำเภอสันทราย โดยวางแนวคิดไว้เป็นเลย์เอาต์พาร์กแลนด์แบบอังกฤษที่ผสมองค์ประกอบสไตล์ลิงก์สเข้ามาด้วย ทั้งพ็อตบังเกอร์ การตีลูกวิ่งเข้ากรีน และแฟร์เวย์เป็นลอนคลื่น ซึ่งให้รางวัลกับกลยุทธ์เกมภาคพื้นมากกว่าการเข้าหาธงด้วยวิถีลอยเพียงอย่างเดียว พื้นที่แห่งนี้เคยเป็นสวนผลไม้มาก่อน ต้นไม้ใหญ่ที่ยังหลงเหลืออยู่จึงมอบทั้งมิติและร่มเงาในระดับที่ไม่ค่อยพบในสนามที่มีอายุเท่านี้ แนวสันเขาโดยรอบช่วยกำหนดกรอบภาพให้กับสนามและเป็นฉากหลังที่งดงามตลอดการออกรอบ`,
        layout_and_experience: `เลย์เอาต์ของ Thomson ที่ระยะ 6,969 หลาถือว่าไม่ยาวนักเมื่อวัดด้วยมาตรฐานระยะสนามยุคใหม่ และไม่มีแท่นทีสีดำ แต่ความท้าทายมาจากการวางตำแหน่งเชิงกลยุทธ์มากกว่าระยะทาง สนามมีแนวต้นไม้ขนาบอย่างหนาแน่น ช่องทางเล่นจึงลงโทษทุกช็อตจากแท่นทีที่ไม่ได้กำหนดวิถีลูกเอาไว้ แฟร์เวย์เป็นลอนคลื่นมากกว่าราบเรียบ และ Thomson ได้นำความลาดเอียงตามธรรมชาติของพื้นหุบเขามาสร้างอุปสรรคระดับพื้นดินแบบแนบเนียน ซึ่งส่งผลต่อลักษณะการวางตัวของลูกก่อนช็อตแอพโพรช

พ็อตบังเกอร์ที่ลึก ผนังชัน และวางตำแหน่งเชิงกลยุทธ์เพื่อดักช็อตแอพโพรชที่พลาดไปครึ่งทาง คือกลไกป้องกันสนามอันเป็นเอกลักษณ์ อุปสรรคน้ำยังปรากฏอยู่ในหลุมส่วนใหญ่ เพิ่มความซับซ้อนเชิงกลยุทธ์อีกชั้นหนึ่ง กรีนมีความเร็วสูงและได้รับการดูแลอย่างดี ปูด้วยหญ้าเบอร์มิวดาพันธุ์ Tiff Dwarf สนามอยู่ในสภาพดีที่สุดในช่วงฤดูแล้งที่อากาศเย็น (พฤศจิกายน-มีนาคม)`,
        tips: `ควรจองผ่าน royalchiangmai.com หรือแพลตฟอร์มรับจอง และยืนยันอัตราค่าบริการปัจจุบันอีกครั้ง โดยอัตราแบบรวมทุกอย่างในช่วงไฮซีซันอยู่ที่ประมาณ 4,800 บาท ซึ่งรวมแคดดี้และรถกอล์ฟไว้แล้ว ก่อนเลือกแนวเป้าหมาย ควรขอให้แคดดี้ช่วยดูข้อมูลระยะจากสมุดระยะเกี่ยวกับตำแหน่งของพ็อตบังเกอร์ สนามแห่งนี้ให้รางวัลกับความแม่นยำมากกว่าระยะทาง การเล่นแบบระมัดระวังจากแท่นทีจะช่วยลดความเสี่ยงในการเสียดับเบิลโบกี้ การออกรอบช่วงเช้าอากาศเย็นสบายกว่า และหมอกในหุบเขาช่วงพฤศจิกายน-มกราคมยังเพิ่มบรรยากาศที่มีเอกลักษณ์ให้กับการเล่น`,
        location_and_access: `Royal Chiang Mai Golf Club & Resort ตั้งอยู่ที่แม่แฝก อำเภอสันทราย ห่างจากตัวเมืองเชียงใหม่ขึ้นไปทางเหนือประมาณ 40 กิโลเมตร และห่างจากท่าอากาศยานนานาชาติเชียงใหม่ (CNX) ประมาณ 40 นาทีโดยรถยนต์ ผู้ที่เดินทางจากกรุงเทพฯ ใช้วิธีบินไป CNX (ประมาณ 1 ชั่วโมง 10 นาทีจากสนามบินสุวรรณภูมิหรือสนามบินดอนเมือง) เพราะการขับรถระยะทาง 700 กิโลเมตรจากกรุงเทพฯ ไม่สะดวกในทางปฏิบัติ การเดินทางไปยังสนามใช้รถยนต์ส่วนตัว รถ Grab หรือบริการรถรับส่งของรีสอร์ต โดยใช้ทางหลวงหมายเลข 1001 ขึ้นเหนือจากเชียงใหม่`,
        rental_cta_context: `กำลังวางแผนออกรอบที่ Royal Chiang Mai Golf Club สนามคลาสสิกในภาคเหนือของไทยที่ออกแบบโดย Peter Thomson อยู่ใช่ไหม เช่าไม้กอล์ฟคุณภาพพรีเมียมที่กรุงเทพฯ พร้อมบริการส่งถึงโรงแรมก่อนคุณขึ้นเครื่อง ให้คุณพร้อมรับมือกับพ็อตบังเกอร์เหล่านั้นโดยไม่ต้องยุ่งยากกับค่าธรรมเนียมโหลดกระเป๋ากอล์ฟกับสายการบิน`,
      },
    },
    ko: {
      title: `Royal Chiang Mai Golf Club & Resort 올인클루시브 패키지 — 치앙마이 18홀 코스 가이드와 클럽 대여`,
      meta_description: `Royal Chiang Mai Golf Club & Resort의 성수기 올인클루시브 요금은 약 4,800바트이고 캐디와 카트가 포함돼요. Peter Thomson이 설계한 18홀 파 72 코스로 치앙마이 시내에서 북쪽으로 약 40km 거리이며, 비행기를 타기 전 방콕 호텔로 배달되는 LENGOLF 클럽 대여도 함께 안내해요.`,
      prose: {
        overview: `Royal Chiang Mai Golf Club & Resort는 태국 북부에서 가장 사연이 깊은 코스 가운데 하나예요. 브리티시 오픈을 5회 제패한 Peter Thomson이 설계한 18홀 파 72 코스로, 1996년 2월에 문을 열었습니다. 치앙마이 시내에서 북쪽으로 약 40km 떨어진 San Sai 지구 Mae Faek 일대의 계곡 안에 자리해요. 설계 구상은 링크스 스타일 요소를 품은 영국식 파크랜드 레이아웃이었고, 팟 벙커와 굴려 올리는 어프로치, 그리고 기복 있는 페어웨이가 어우러져 핀을 공중으로만 공략하기보다 지면을 쓰는 전략에 보답합니다. 부지는 원래 과수원이었고, 지금도 남아 있는 오래된 나무들이 개장 연도를 생각하면 보기 드문 규모감과 그늘을 만들어 줘요. 주위를 둘러싼 산등성이가 코스를 감싸며 라운딩 내내 경치 좋은 배경이 되어 줍니다.`,
        layout_and_experience: `Thomson의 설계는 전장 6,969야드로, 요즘의 야드 기준으로 보면 길지 않은 편이고 블랙 티도 없어요. 그래도 도전 과제는 길이가 아니라 전략적인 위치 선정에서 나옵니다. 코스 전체에 나무가 빽빽하게 늘어서 있어, 구질을 만들어 치지 않은 티샷은 좁은 회랑에서 대가를 치러요. 페어웨이는 평평하다기보다 기복이 있고, Thomson은 계곡 바닥의 자연스러운 경사를 그대로 끌어와 어프로치 샷의 볼 라이에 영향을 주는 미묘한 지면 해저드를 만들어 냈습니다.

깊고 벽이 가파른 팟 벙커는 어중간하게 빗나간 어프로치를 붙잡도록 전략적으로 배치돼, 이 코스를 상징하는 방어 장치가 됩니다. 워터 해저드도 대부분의 홀에 등장해 전략적인 복잡성을 한 겹 더해요. 그린은 빠르고 관리 상태가 좋은 Tiff Dwarf 버뮤다그래스입니다. 코스 컨디션은 선선하고 건조한 시즌(11~3월)에 절정에 이릅니다.`,
        tips: `royalchiangmai.com이나 예약 플랫폼으로 예약하면서 현재 요금을 확인해 두세요. 성수기 올인클루시브 요금은 약 4,800바트이고 캐디와 카트가 포함돼 있어요. 목표 라인을 정하기 전에 캐디에게 야디지 북을 바탕으로 팟 벙커 위치를 물어보면 도움이 됩니다. 이 코스는 거리보다 정확도에 보답하니, 티샷을 보수적으로 가져가면 더블보기 위험을 줄일 수 있어요. 아침 라운딩이 더 시원하고, 11~1월에 계곡을 덮는 안개는 이곳만의 독특한 분위기를 더해 줍니다.`,
        location_and_access: `Royal Chiang Mai Golf Club & Resort는 San Sai 지구 Mae Faek에 있고, 치앙마이 시내에서 북쪽으로 약 40km, 치앙마이 국제공항(CNX)에서 차로 약 40분 거리예요. 방콕에서 오는 분은 CNX행 항공편이 기본이며, 수완나품 공항이나 돈므앙 공항에서 약 1시간 10분 걸립니다. 방콕에서 700km를 차로 달리는 건 현실적이지 않아요. 코스까지는 개인 차량이나 Grab 택시, 또는 리조트의 픽업 서비스를 이용해 치앙마이에서 1001번 국도를 타고 북쪽으로 향하면 됩니다.`,
        rental_cta_context: `Peter Thomson이 태국 북부에 남긴 클래식한 설계, Royal Chiang Mai Golf Club 라운딩을 계획하고 있다면 방콕에서 프리미엄 클럽을 빌리는 방법이 편해요. 비행기를 타기 전 방콕 호텔까지 배달해 드리니, 항공사 수하물 요금을 들이지 않고 그 팟 벙커들에 맞설 준비를 마친 채 도착할 수 있습니다.`,
      },
    },
    zh: {
      title: `Royal Chiang Mai Golf Club & Resort全包套餐与球场攻略 — 清迈18洞`,
      meta_description: `Royal Chiang Mai Golf Club & Resort的旺季全包价约4,800泰铢，已含球童与球车。这座18洞、标准杆72的球场由Peter Thomson设计，位于清迈市区以北约40公里，另附登机前送抵曼谷酒店的LENGOLF球杆租借。`,
      prose: {
        overview: `Royal Chiang Mai Golf Club & Resort是泰国北部最有故事的球场之一：18洞、标准杆72，出自曾5次夺得英国公开赛冠军的Peter Thomson之手，1996年2月开业。球场坐落在清迈市区以北约40公里、San Sai县Mae Faek一带的一处山谷之中，构思之初就是一座融入林克斯风格元素的英式林地球场，其中包括罐形沙坑（pot bunker）、滚地攻果岭的打法，以及起伏的球道——它们回报的是地面球路的经营，而不是一味用高弹道直取旗杆。这片场地从前是果园，留存下来的成熟树木赋予布局一种以它的开业年份而言并不常见的尺度感与树荫。四周的山脊为球场镶边，整场球都有秀丽的背景相伴。`,
        layout_and_experience: `Thomson的设计全长6,969码，以现代的码数标准衡量并不算长，这里也没有黑色发球台，但挑战来自战略性的落点选择，而不是距离。球场林木密布，球道走廊会惩罚任何没有刻意做出球路的开球。球道起伏而非平坦，Thomson顺着谷底的天然坡度，做出细腻的地面障碍，影响攻果岭球的球位。

罐形沙坑深、坑壁陡峭，位置经过盘算，专门捕捉那些只差一点的攻果岭球，是这座球场标志性的防守手段。大部分球洞还设有水障碍，为策略再添一层复杂度。果岭速度快、养护到位，铺的是Tiff Dwarf百慕大草。球场状态在凉爽干燥的旱季（11月–3月）达到顶峰。`,
        tips: `可以通过royalchiangmai.com或预订平台下单，并确认当前的价格——旺季的全包价约为4,800泰铢，已经含了球童与球车。选定攻击路线之前，先向球童请教码数手册上罐形沙坑的位置。这座球场回报的是准确度而非距离，开球时采取保守策略能降低吞下双柏忌的风险。清晨的球更凉快，11月–1月山谷里的薄雾还会带来别具一格的氛围。`,
        location_and_access: `Royal Chiang Mai Golf Club & Resort位于San Sai县的Mae Faek，在清迈市区以北约40公里处，距清迈国际机场（CNX）驾车约40分钟。从曼谷前来通常是飞往CNX，自素万那普机场或廊曼机场出发约1小时10分钟；从曼谷开车700公里并不现实。抵达球场可以自驾、叫Grab，或使用度假区的接送服务，从清迈沿1001号公路一路向北。`,
        rental_cta_context: `打算去打Royal Chiang Mai Golf Club，会一会Peter Thomson在泰国北部留下的这件经典设计吗？可以在曼谷租借高级球杆——登机前送到你在曼谷的酒店——这样不必操心航空公司的球包托运费，就能做好准备去对付那些罐形沙坑。`,
      },
    },
    ja: {
      title: `Royal Chiang Mai Golf Club & Resort（チェンマイ）— パッケージ料金・コース紹介・クラブレンタル`,
      meta_description: `ハイシーズンのオールインクルーシブ料金は約4,800THBで、キャディーとカート込み。Royal Chiang Mai Golf Club & ResortはPeter Thomson設計の18ホール・パー72で、チェンマイ市街地から北へ約40kmです。搭乗前にバンコクのホテルへ届くLENGOLFのクラブレンタルもご案内します。`,
      prose: {
        overview: `Royal Chiang Mai Golf Club & Resortは、タイ北部でもっとも物語性のあるコースのひとつです。全英オープンを5度制したPeter Thomsonが手がけた18ホール・パー72の設計で、1996年2月に開場しました。チェンマイ市街地から北へ約40km、チェンマイ県サンサーイ郡メーフェーク地区の谷あいに広がります。構想されたのはリンクススタイルの要素を取り込んだ英国式パークランドのレイアウト。ポットバンカー、転がして攻めるアプローチ、そしてうねりのあるフェアウェイが、ピンを空中からだけ狙う攻め方よりも地面を使った戦略に報いる造りです。敷地はかつて果樹園で、いまも残る成熟した木々が、開場年を考えると珍しいほどのスケール感と木陰をもたらしています。周囲を取り囲む山の稜線がコースを額縁のように縁取り、ラウンドを通じて美しい背景となります。`,
        layout_and_experience: `Thomsonの設計は6,969ヤード。現代のヤーデージ基準では控えめで、ブラックティーもありませんが、挑戦は距離ではなく戦略的なポジショニングから生まれます。コースは木々が密に立ち並び、球筋を作らないティーショットは狭い回廊で罰せられます。フェアウェイはフラットというよりうねりがあり、Thomsonは谷底の自然な傾斜を取り込んで、アプローチショットのライに影響する繊細な地面のハザードを造り上げました。

深く法面の急なポットバンカーは、半端に外れたアプローチを捕まえるよう戦略的に配置された、このコースを象徴する防御装置です。ウォーターハザードもほとんどのホールに現れ、戦略の複雑さをもう一層加えます。グリーンは速く、手入れの行き届いたTiff Dwarfのバミューダ芝。コンディションは涼しく乾いた乾季（11月〜3月）にピークを迎えます。`,
        tips: `royalchiangmai.comまたは予約プラットフォームから予約し、最新の料金をご確認ください。ハイシーズンのオールインクルーシブ料金は約4,800THBで、キャディーとカートが含まれます。狙うラインを決める前に、ヤーデージブックをもとにポットバンカーの位置をキャディーに聞いてみましょう。このコースは飛距離よりも正確さに報いるため、ティーショットを慎重に運べばダブルボギーのリスクを減らせます。朝のラウンドは涼しく、11月〜1月に谷を包む霧は独特の趣を添えてくれます。`,
        location_and_access: `Royal Chiang Mai Golf Club & Resortはサンサーイ郡メーフェークに位置し、チェンマイ市街地から北へ約40km、チェンマイ国際空港（CNX）から車で約40分です。バンコクからはCNXへの空路が基本で、スワンナプーム空港またはドンムアン空港から約1時間10分。バンコクから700kmを車で走るのは現実的ではありません。コースへは自家用車かGrabタクシー、あるいはリゾートの送迎サービスを利用し、チェンマイから国道1001号線を北上してアクセスします。`,
        rental_cta_context: `Peter Thomsonがタイ北部に遺したクラシックな設計、Royal Chiang Mai Golf Clubでのラウンドをお考えですか。バンコクでのプレミアムクラブレンタルなら、搭乗前にホテルまでお届けするので、航空会社の手荷物料金の心配なく、あのポットバンカーに挑む準備を整えて現地に到着できます。`,
      },
    },
  },
  status: 'published',
  published_at: '2026-04-21',
}
