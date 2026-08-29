import type { GolfCourse } from '@/types/golf-courses'

export const course: GolfCourse = {
  slug: 'alpine-golf-resort-chiang-mai',
  region: 'chiang-mai',
  name: `Alpine Golf Resort Chiang Mai`,
  province: `Chiang Mai`,
  designer: `Ronald M. Garl (Course A+B); Pirapon Namatra (Course C)`,
  holes: 27,
  par: 72,
  year_opened: 2008,
  green_fee_weekday_thb: 3700,
  green_fee_weekend_thb: null,
  // Prices by SEASON, not day of week: 3,700 is explicitly "the low-season rate, valid April through October"; no weekend figure.
  fee_is_seasonal: true,
  // All-in package, per this file's own EN prose: 3,700 THB all-in including caddie and cart (the low-season rate). The rate
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
  website: 'https://www.alpinegolfresort.com/',
  phone: '+66 53 880 888',
  latitude: 18.6915,
  longitude: 99.1739,
  distance_from_bangkok_km: 700,
  drive_time_from_bangkok_min: null,
  google_maps_url: null,
  club_rental_available: true,
  club_rental_fee_thb: 1500,
  club_rental_brands: null,
  schema_markup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"GolfCourse\",\n  \"name\": \"Alpine Golf Resort Chiang Mai\",\n  \"url\": \"https://len.golf/golf-courses/chiang-mai/alpine-golf-resort-chiang-mai\",\n  \"description\": null,\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"addressLocality\": \"Chiang Mai\",\n    \"addressCountry\": \"TH\"\n  },\n  \"geo\": {\n    \"@type\": \"GeoCoordinates\",\n    \"latitude\": 18.6915,\n    \"longitude\": 99.1739\n  },\n  \"telephone\": \"+66 53 880 888\",\n  \"priceRange\": \"฿฿฿\",\n  \"sameAs\": [\n    \"https://www.alpinegolfresort.com/\"\n  ],\n  \"amenityFeature\": [\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Driving Range\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Caddie Required\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Golf Cart\",\n      \"value\": true\n    }\n  ]\n}",
  prose: {
    overview: `Alpine Golf Resort Chiang Mai is a 27-hole championship venue set across 450 rai of forested valley in San Kamphaeng, approximately 25 kilometres east of Chiang Mai city. The course was designed by American architect Ronald M. Garl, who shaped the original 18-hole layout (Courses A and B) that opened in 2008; a further nine holes designed by Thai architect Pirapon Namatra were added in 2017. The resort is best known for Thailand's first paddy field greens — holes played across rice paddies that flood and change appearance with the seasons, offering an experience unlike any standard parkland course in the country. Alpine has hosted regional professional tournaments and is consistently cited among the top golf experiences in Northern Thailand. On-site facilities include a 78-room resort, spa, international restaurant, swimming pool, and conference centre, making it a destination for golfers combining a round with a longer Chiang Mai stay.`,
    layout_and_experience: `The 27-hole layout is divided into three nine-hole sections, each with a distinct character. Courses A and B form the main championship 18-hole track, stretching to approximately 7,500 yards from the back tees through forested valley terrain. The routing combines parkland fairways flanked by mature trees with wetland transitions and the course's most distinctive feature: the paddy field section, where fairways and greens are built across working rice paddies. The paddy zone changes dramatically through the year — dry and golden in the hot season, lush and flooded during the monsoon months when water borders almost every shot.

The terrain is predominantly flat to gently undulating by Chiang Mai standards, making Alpine more accessible than the highland mountain courses further from the city. Elevation changes are moderate, but the tree-lined corridors require accuracy off the tee, and the paddy sections add visual and strategic complexity. Course C — the third nine, opened 2017 — adds variety with a pine tree zone and wetland passages, and can be combined with Course A or B for a full 18-hole alternative routing.

Greens are generally medium-paced and firm enough to reward precise approach play, with bunkers placed to challenge wayward approaches on the tighter par-4s. The course plays to par 72 over the 18-hole A+B combination. Afternoon rounds in the rainy season (June–October) can be interrupted by brief tropical showers; morning tee times are strongly recommended during this period. The cool dry months of November through February offer ideal conditions — temperatures in the low 20s Celsius and virtually no rain risk.`,
    tips: `The green fee shown here (3,700 THB all-in including caddie and cart) is the low-season rate, valid April through October. High-season rates (November–March) are higher — confirm current pricing directly with the resort at +66 53 880 888 or via alpinegolfresort.com before booking. Book a morning tee time to take advantage of cooler temperatures and lower humidity, particularly in the March–May hot season when afternoon temperatures can exceed 35°C. November through February is the most comfortable period to play Alpine: cool and dry, with fairways in excellent condition. The resort offers a lunch buffet at the clubhouse that is included in some green fee packages — confirm at booking whether it is part of your rate. Caddie service is mandatory and the same caddie accompanies you for the full round; tipping 400 THB upward at the end of the round is customary. Carts are compulsory with one golfer per cart. Golf clubs and shoes are available for hire at the pro shop. Grab taxis from Chiang Mai city are reliable; the resort can also arrange shuttle transfers.`,
    location_and_access: `Alpine Golf Resort Chiang Mai is located 25 kilometres east of Chiang Mai city centre in San Kamphaeng district, approximately 30–40 minutes by road from Chiang Mai International Airport. From Bangkok, virtually all visitors fly — the journey takes around 1 hour 10 minutes from Suvarnabhumi (BKK) or Don Mueang (DMK) to Chiang Mai (CNX). Driving the full 700 kilometres from Bangkok takes approximately 9 hours and is not practical for a golf trip. Once in Chiang Mai, the course is reachable by private car, Grab taxi, or the resort's shuttle; the route follows Highway 1147 eastward through San Kamphaeng district.`,
    rental_cta_context: `Heading to Alpine Golf Resort Chiang Mai for a round in Northern Thailand? Rent premium clubs in Bangkok — delivered to your hotel before you fly — so you can travel light and skip the airline baggage fees.`,
  },
  locales: {
    en: {
      title: `Alpine Golf Resort Chiang Mai — Green Fees, Course Guide & Golf Club Rentals`,
      meta_description: `Alpine Golf Resort Chiang Mai green fees, course overview, tips, and how to arrange golf club rentals delivered to your Bangkok hotel.`,
    },
    th: {
      title: `Alpine Golf Resort Chiang Mai — แพ็กเกจรวมทุกอย่าง รีวิวสนาม และเช่าไม้กอล์ฟ`,
      meta_description: `Alpine Golf Resort Chiang Mai สนาม 27 หลุมในอำเภอสันกำแพง พร้อมกรีนกลางนาข้าวแห่งแรกของประเทศไทย แพ็กเกจรวมทุกอย่าง 3,700 บาท (ค่ากรีนฟี ค่าแคดดี้ และรถกอล์ฟ) เป็นอัตราโลว์ซีซันเดือนเมษายน-ตุลาคม พร้อมบริการเช่าไม้กอล์ฟส่งถึงโรงแรมในกรุงเทพฯ`,
      prose: {
        overview: `Alpine Golf Resort Chiang Mai เป็นสนามระดับแชมเปียนชิพ 27 หลุมที่กินอาณาบริเวณ 450 ไร่ของหุบเขาซึ่งปกคลุมด้วยป่า ในอำเภอสันกำแพง ห่างจากตัวเมืองเชียงใหม่ไปทางทิศตะวันออกประมาณ 25 กิโลเมตร สนามออกแบบโดย Ronald M. Garl สถาปนิกชาวอเมริกัน ผู้วางเลย์เอาต์ 18 หลุมดั้งเดิม (คอร์ส A และ B) ที่เปิดให้บริการในปี 2008 ต่อมาในปี 2017 ได้เพิ่มอีก 9 หลุมซึ่งออกแบบโดย Pirapon Namatra สถาปนิกชาวไทย รีสอร์ตแห่งนี้เป็นที่รู้จักมากที่สุดจากกรีนกลางนาข้าวแห่งแรกของประเทศไทย ซึ่งเป็นหลุมที่เล่นข้ามผืนนาข้าวที่มีน้ำท่วมขังและเปลี่ยนโฉมไปตามฤดูกาล มอบประสบการณ์ที่ต่างจากสนามพาร์กแลนด์ทั่วไปในประเทศ Alpine เคยเป็นเจ้าภาพจัดการแข่งขันระดับภูมิภาคของนักกอล์ฟอาชีพ และได้รับการกล่าวถึงอย่างสม่ำเสมอว่าเป็นหนึ่งในประสบการณ์กอล์ฟที่ดีที่สุดของภาคเหนือ สิ่งอำนวยความสะดวกภายในพื้นที่ประกอบด้วยรีสอร์ตขนาด 78 ห้อง สปา ห้องอาหารนานาชาติ สระว่ายน้ำ และศูนย์ประชุม จึงเป็นจุดหมายสำหรับนักกอล์ฟที่ต้องการผสมผสานการออกรอบเข้ากับการพักผ่อนในเชียงใหม่ที่ยาวนานขึ้น`,
        layout_and_experience: `เลย์เอาต์ 27 หลุมแบ่งออกเป็นสามคอร์ส คอร์สละ 9 หลุม แต่ละคอร์สมีบุคลิกเฉพาะตัว คอร์ส A และ B รวมกันเป็นแทร็กแชมเปียนชิพ 18 หลุมหลัก ความยาวประมาณ 7,500 หลาจากแท่นทีหลัง ทอดผ่านภูมิประเทศแบบหุบเขาที่ปกคลุมด้วยป่า เส้นทางของสนามผสมผสานแฟร์เวย์แบบพาร์กแลนด์ที่ขนาบด้วยต้นไม้ใหญ่เข้ากับช่วงพื้นที่ชุ่มน้ำ และจุดเด่นที่สุดของสนามอย่างช่วงนาข้าว ซึ่งแฟร์เวย์และกรีนถูกสร้างขึ้นบนผืนนาที่ยังทำนาอยู่จริง โซนนาข้าวเปลี่ยนแปลงอย่างชัดเจนตลอดทั้งปี แห้งและเป็นสีทองในฤดูร้อน เขียวชอุ่มและมีน้ำท่วมขังในช่วงมรสุมที่น้ำขนาบเกือบทุกช็อต

ภูมิประเทศส่วนใหญ่ราบเรียบถึงลาดเอียงเล็กน้อยเมื่อเทียบกับมาตรฐานของเชียงใหม่ ทำให้ Alpine เข้าถึงได้ง่ายกว่าสนามบนที่สูงบนภูเขาซึ่งอยู่ไกลจากตัวเมืองออกไป การเปลี่ยนระดับความสูงอยู่ในระดับปานกลาง แต่ทางเดินของหลุมที่ขนาบด้วยแนวต้นไม้ต้องอาศัยความแม่นยำในการออกทีช็อต และช่วงนาข้าวก็เพิ่มความซับซ้อนทั้งเชิงทัศนียภาพและเชิงกลยุทธ์ คอร์ส C ซึ่งเป็นคอร์ส 9 หลุมที่สามและเปิดในปี 2017 เพิ่มความหลากหลายด้วยโซนป่าสนและช่วงพื้นที่ชุ่มน้ำ ทั้งยังจับคู่กับคอร์ส A หรือ B เป็นเส้นทาง 18 หลุมทางเลือกได้

กรีนโดยทั่วไปมีความเร็วปานกลางและแน่นพอที่จะให้รางวัลกับช็อตแอพโพรชที่แม่นยำ ส่วนบังเกอร์วางไว้เพื่อท้าทายช็อตแอพโพรชที่พลาดเป้าในหลุมพาร์ 4 ที่แคบกว่า สนามเล่นที่พาร์ 72 สำหรับการจับคู่ 18 หลุมแบบ A+B การออกรอบช่วงบ่ายในฤดูฝน (มิถุนายน-ตุลาคม) อาจถูกขัดจังหวะด้วยฝนเขตร้อนที่ตกเป็นช่วงสั้น ๆ จึงแนะนำอย่างยิ่งให้จองทีไทม์ช่วงเช้าในช่วงเวลานี้ ส่วนเดือนที่อากาศเย็นและแห้งอย่างพฤศจิกายนถึงกุมภาพันธ์ให้สภาพอากาศที่เหมาะที่สุด อุณหภูมิอยู่ที่ราว 20 องศาเซลเซียสต้น ๆ และแทบไม่มีความเสี่ยงเรื่องฝน`,
        tips: `ค่าธรรมเนียมที่แสดงไว้ที่นี่ (3,700 บาทแบบรวมทุกอย่าง ทั้งค่ากรีนฟี ค่าแคดดี้ และรถกอล์ฟ) เป็นอัตราโลว์ซีซันซึ่งใช้ได้ตั้งแต่เดือนเมษายนถึงตุลาคม อัตราไฮซีซัน (พฤศจิกายน-มีนาคม) จะสูงกว่านี้ ควรยืนยันราคาปัจจุบันกับทางรีสอร์ตโดยตรงที่ +66 53 880 888 หรือผ่าน alpinegolfresort.com ก่อนจอง แนะนำให้จองทีไทม์ช่วงเช้าเพื่อรับอากาศที่เย็นกว่าและความชื้นที่ต่ำกว่า โดยเฉพาะในฤดูร้อนเดือนมีนาคมถึงพฤษภาคมที่อุณหภูมิช่วงบ่ายอาจเกิน 35 องศาเซลเซียส เดือนพฤศจิกายนถึงกุมภาพันธ์เป็นช่วงที่เล่น Alpine ได้สบายที่สุด อากาศเย็นและแห้ง แฟร์เวย์อยู่ในสภาพยอดเยี่ยม ทางรีสอร์ตมีบุฟเฟต์กลางวันที่คลับเฮาส์ ซึ่งรวมอยู่ในแพ็กเกจค่ากรีนฟีบางแบบ ควรสอบถามตอนจองว่ารวมอยู่ในอัตราของคุณหรือไม่ การใช้แคดดี้เป็นข้อบังคับ และแคดดี้คนเดิมจะอยู่กับคุณตลอดรอบ โดยธรรมเนียมแล้วนิยมให้ทิปแคดดี้ 400 บาทขึ้นไปเมื่อจบรอบ รถกอล์ฟเป็นข้อบังคับเช่นกัน โดยใช้หนึ่งคันต่อผู้เล่นหนึ่งคน มีไม้กอล์ฟและรองเท้าให้เช่าที่โปรช็อป การเรียก Grab จากตัวเมืองเชียงใหม่ทำได้อย่างน่าเชื่อถือ และทางรีสอร์ตยังจัดรถรับส่งให้ได้ด้วย`,
        location_and_access: `Alpine Golf Resort Chiang Mai ตั้งอยู่ห่างจากใจกลางเมืองเชียงใหม่ไปทางทิศตะวันออก 25 กิโลเมตร ในอำเภอสันกำแพง ใช้เวลาเดินทางโดยรถยนต์จากท่าอากาศยานนานาชาติเชียงใหม่ประมาณ 30-40 นาที ผู้ที่มาจากกรุงเทพฯ แทบทั้งหมดเลือกเดินทางโดยเครื่องบิน ใช้เวลาราว 1 ชั่วโมง 10 นาทีจากสนามบินสุวรรณภูมิ (BKK) หรือสนามบินดอนเมือง (DMK) มายังเชียงใหม่ (CNX) ส่วนการขับรถตลอดระยะทาง 700 กิโลเมตรจากกรุงเทพฯ ใช้เวลาประมาณ 9 ชั่วโมง จึงไม่สะดวกในทางปฏิบัติสำหรับทริปกอล์ฟ เมื่อถึงเชียงใหม่แล้ว สามารถเดินทางไปสนามได้ด้วยรถส่วนตัว Grab หรือรถรับส่งของรีสอร์ต โดยเส้นทางใช้ทางหลวงหมายเลข 1147 มุ่งไปทางทิศตะวันออกผ่านอำเภอสันกำแพง`,
        rental_cta_context: `กำลังจะไปออกรอบที่ Alpine Golf Resort Chiang Mai ในภาคเหนือของไทยอยู่ใช่ไหม เช่าไม้กอล์ฟคุณภาพพรีเมียมที่กรุงเทพฯ พร้อมบริการส่งถึงโรงแรมก่อนคุณขึ้นเครื่อง ให้คุณเดินทางแบบเบาสบายและไม่ต้องเสียค่าธรรมเนียมโหลดกระเป๋ากอล์ฟกับสายการบิน`,
      },
    },
    ko: {
      title: `Alpine Golf Resort Chiang Mai 올인클루시브 패키지 — 치앙마이 27홀 코스 가이드와 클럽 대여`,
      meta_description: `Alpine Golf Resort Chiang Mai는 치앙마이 산깜팽의 27홀 코스로, 태국 최초의 논 그린으로 알려져 있어요. 3,700바트 올인클루시브 패키지(그린피·캐디·카트 포함)는 4~10월 비수기 요금이고, 방콕 호텔로 배달되는 LENGOLF 클럽 대여까지 정리했어요.`,
      prose: {
        overview: `Alpine Golf Resort Chiang Mai 코스는 숲으로 덮인 계곡 450라이(태국의 면적 단위)에 펼쳐진 27홀 챔피언십 규모의 골프장이에요. 치앙마이 시내에서 동쪽으로 약 25km 떨어진 산깜팽(San Kamphaeng)에 자리합니다. 코스를 설계한 사람은 미국인 설계가 Ronald M. Garl입니다. 2008년에 문을 연 원래의 18홀 레이아웃(코스 A와 B)을 그렸고, 2017년에는 태국인 설계가 Pirapon Namatra가 설계한 9홀이 더해졌어요. 이 리조트가 가장 잘 알려진 이유는 태국 최초의 논 그린입니다. 물이 차오르고 계절마다 표정이 달라지는 논을 가로질러 플레이하는 홀들이라, 태국의 여느 평범한 파크랜드 코스에서는 만나기 어려운 경험을 안겨 줘요. Alpine 코스는 지역 프로 대회를 개최한 적이 있고, 태국 북부에서 손꼽히는 골프 경험 가운데 하나로 꾸준히 이름이 오르내립니다. 부지 안에는 78실 규모의 리조트와 스파, 인터내셔널 레스토랑, 수영장, 컨벤션 센터가 갖춰져 있어, 라운딩에 치앙마이에서의 긴 체류를 더하고 싶은 골퍼에게 어울리는 목적지가 돼요.`,
        layout_and_experience: `27홀 레이아웃은 9홀씩 세 개의 구역으로 나뉘고, 각 구역의 성격이 뚜렷하게 다릅니다. 코스 A와 B가 합쳐져 메인 챔피언십 18홀 코스를 이루는데, 백 티 기준 약 7,500야드에 이르며 숲으로 덮인 계곡 지형을 통과해요. 루팅은 다 자란 나무가 늘어선 파크랜드 페어웨이와 습지 전환 구간, 그리고 이 코스에서 가장 개성이 뚜렷한 요소인 논 구역을 함께 엮습니다. 논 구역에서는 실제로 벼농사를 짓는 논 위에 페어웨이와 그린이 조성돼 있어요. 이 구역은 한 해 사이에도 극적으로 달라집니다. 더운 계절에는 마르고 황금빛을 띠다가, 몬순 시기에는 무성하게 자라고 물이 차올라 거의 모든 샷 옆에 물이 놓이게 돼요.

지형은 치앙마이 기준으로 보면 대체로 평탄하거나 완만하게 물결치는 정도라, Alpine 코스는 시내에서 더 멀리 떨어진 고지대 산악 코스들보다 다가가기 편한 편이에요. 고저 차는 중간 정도지만 나무가 늘어선 통로 때문에 티샷의 정확도가 필요하고, 논 구간은 시각적으로도 전략적으로도 복잡함을 더합니다. 2017년에 문을 연 세 번째 나인인 코스 C는 소나무 구역과 습지 통로로 변화를 더하고, 코스 A나 B와 묶어 또 다른 18홀 루팅으로 돌 수도 있어요.

그린은 대체로 중간 정도 빠르기에 단단한 편이라 정교한 어프로치에 보답하고, 벙커는 폭이 좁은 파 4 홀에서 빗나간 어프로치를 붙잡도록 배치돼 있습니다. A+B 18홀 조합으로 도는 코스는 파 72예요. 우기(6~10월)의 오후 라운딩은 짧게 지나가는 열대성 소나기로 끊길 수 있으니, 이 시기에는 오전 티타임을 강력히 권합니다. 서늘하고 건조한 11월부터 2월까지는 조건이 가장 좋아요. 기온이 섭씨 20도 초반에 머물고 비 걱정도 사실상 없습니다.`,
        tips: `여기 표시된 요금(그린피와 캐디, 카트를 모두 포함한 올인클루시브 3,700바트)은 4월부터 10월까지 적용되는 비수기 요금이에요. 성수기(11~3월) 요금은 이보다 높으니, 예약 전에 +66 53 880 888이나 alpinegolfresort.com으로 리조트에 현재 가격을 직접 확인해 보세요. 티타임은 오전으로 잡는 편이 시원한 기온과 낮은 습도를 누리기에 좋고, 오후 기온이 섭씨 35도를 넘길 수 있는 3~5월 더운 시기에는 특히 그렇습니다. Alpine 코스를 가장 쾌적하게 즐길 수 있는 시기는 11월부터 2월까지예요. 서늘하고 건조하며 페어웨이 상태도 훌륭합니다. 리조트는 클럽하우스에서 점심 뷔페를 운영하는데 일부 그린피 패키지에는 이 뷔페가 포함되니, 예약할 때 내 요금에 들어 있는지 확인해 두세요. 캐디 이용은 필수이고 같은 캐디가 라운딩 내내 함께합니다. 라운딩이 끝나면 400바트 이상 팁을 건네는 것이 관례예요. 카트도 필수이며 플레이어 한 명당 한 대를 씁니다. 골프 클럽과 신발은 프로샵에서 빌릴 수 있어요. 치앙마이 시내에서 부르는 Grab 택시는 믿을 만하고, 리조트에서 셔틀 이동을 준비해 주기도 합니다.`,
        location_and_access: `Alpine Golf Resort Chiang Mai 코스는 치앙마이 시내 중심에서 동쪽으로 25km 떨어진 산깜팽 지구에 있고, 치앙마이 국제공항에서 차로 약 30~40분 거리예요. 방콕에서 오는 분은 거의 모두 항공편을 이용합니다. 수완나품(BKK)이나 돈므앙(DMK)에서 치앙마이(CNX)까지 약 1시간 10분 걸려요. 방콕에서 700km를 전부 차로 달리면 약 9시간이 걸려 골프 여행에는 현실적이지 않습니다. 치앙마이에 도착한 뒤에는 개인 차량이나 Grab 택시, 리조트 셔틀로 코스까지 갈 수 있고, 경로는 1147번 국도를 따라 동쪽으로 산깜팽 지구를 지나갑니다.`,
        rental_cta_context: `태국 북부에서 라운딩하러 Alpine Golf Resort Chiang Mai로 향할 계획이라면, 방콕에서 프리미엄 클럽을 빌려 보세요. 비행기를 타기 전 호텔로 배달해 드리니 짐을 가볍게 꾸리고 항공사 수하물 요금도 아낄 수 있어요.`,
      },
    },
    zh: {
      title: `Alpine Golf Resort Chiang Mai全包套餐与球场攻略 — 清迈27洞与球杆租借`,
      meta_description: `Alpine Golf Resort Chiang Mai位于清迈San Kamphaeng县，是一座27洞球场，拥有泰国首创的稻田果岭。3,700泰铢全包套餐（含果岭费、球童与球车）是4–10月的淡季价，另附登机前送抵曼谷酒店的LENGOLF球杆租借。`,
      prose: {
        overview: `Alpine Golf Resort Chiang Mai是一座27洞的锦标赛级球场，坐落在清迈San Kamphaeng县一片450莱（泰国面积单位）的林间谷地上，距清迈市区以东约25公里。球场由美国建筑师Ronald M. Garl设计，他勾勒出2008年开放的原始18洞布局（A场与B场）；2017年又增建了由泰国设计师Pirapon Namatra操刀的9洞。这座度假村最为人熟知的，是泰国首创的稻田果岭——球洞就打在稻田之上，田里的水与景致随季节变化，带来国内任何一座常规园林式球场都给不了的体验。Alpine举办过区域性的职业赛事，也一直被列为泰国北部最出色的高尔夫体验之一。场内设施包括一座78间客房的度假村、水疗中心、国际餐厅、游泳池和会议中心，很适合想把一场球和清迈的长住行程结合起来的球手。`,
        layout_and_experience: `27洞的布局分成三组9洞，每一组的性格都不一样。A场与B场合起来构成主要的锦标赛18洞路线，从后发球台算起约7,500码，穿行于林木覆盖的谷地地形。整条路线把两侧成熟树木夹道的园林式球道、湿地过渡段，以及球场最具辨识度的一段——稻田区——串在一起；在稻田区里，球道与果岭直接筑在仍在耕作的稻田之上。这片稻田全年变化极大：热季干燥、一片金黄，季风月份则青翠而积水，几乎每一杆旁边都有水。

以清迈的标准来看，这里的地形大体平坦到略有起伏，因此Alpine比市区更远处那些高地山岳球场更容易应付。高低落差属中等，但两侧夹道的树木要求开球有准头，稻田路段则在视觉与战术上都添了一层复杂。2017年开放的第三组9洞C场，用一片松林区与几段湿地增加变化，也可以和A场或B场搭配，凑成另一套完整的18洞路线。

果岭速度整体中等，硬度足以回报精准的攻果岭球；沙坑的位置则专门对付那些较窄的4杆洞上打偏的攻果岭球。以A+B的18洞组合来算，球场标准杆为72杆。雨季（6–10月）的下午打球可能被短暂的热带阵雨打断，这段时间强烈建议约上午的开球时间。11月到2月这几个凉爽干燥的月份条件最理想——气温在摄氏20出头，几乎没有下雨的风险。`,
        tips: `这里标出的费用（3,700泰铢全包，含果岭费、球童与球车）是淡季价，适用于4月到10月。旺季（11–3月）的价格更高，动身预订前请拨打+66 53 880 888或通过alpinegolfresort.com向度假村直接确认当前价格。建议把开球时间订在上午，气温更凉、湿度更低，尤其是3–5月的热季，下午气温可能超过35摄氏度。11月到2月是打Alpine最舒服的时段：凉爽干燥，球道状态极佳。度假村在会所提供午餐自助，有些果岭费套餐已经含了这一项，预订时记得确认你的价格里包不包括。球童是强制的，同一位球童会陪你打完全程；打完一场按惯例会给400泰铢起的小费。球车同样是强制的，一人一台。球杆和球鞋可以在球具店租借。从清迈市区叫Grab很可靠，度假村也能帮忙安排接驳车。`,
        location_and_access: `Alpine Golf Resort Chiang Mai位于清迈市中心以东25公里的San Kamphaeng县，从清迈国际机场驾车约30–40分钟。从曼谷前来的人几乎都选择飞机，从素万那普（BKK）或廊曼（DMK）飞到清迈（CNX）约需1小时10分钟。若从曼谷把700公里全程开完，大约要9小时，对一趟高尔夫行程来说并不现实。到了清迈之后，可以坐私家车、Grab或度假村的接驳车前往球场，路线沿1147号公路向东穿过San Kamphaeng县。`,
        rental_cta_context: `打算到Alpine Golf Resort Chiang Mai，在泰国北部打一场球吗？可以在曼谷租借高级球杆——登机前送到你的酒店——这样就能轻装出发，也省下航空公司的球包托运费。`,
      },
    },
    ja: {
      title: `Alpine Golf Resort Chiang Mai（チェンマイ）— パッケージ料金・コース紹介・クラブレンタル`,
      meta_description: `3,700THBのオールインクルーシブ（グリーンフィー・キャディー・カート込み）は4〜10月のローシーズン料金。Alpine Golf Resort Chiang Maiはサンカンペーン郡に広がる27ホールで、タイ初の水田グリーンが名物です。バンコクのホテルへ届くLENGOLFのクラブレンタルもご案内します。`,
      prose: {
        overview: `Alpine Golf Resort Chiang Maiは、森に覆われた谷あい450ライ（タイの面積単位）に広がる27ホールのチャンピオンシップコース。チェンマイ市街から東へ約25km、サンカンペーンに位置します。設計を手がけたのはアメリカ人設計家のRonald M. Garlで、2008年に開場した当初の18ホールレイアウト（コースAとB）を描きました。2017年にはタイ人設計家Pirapon Namatraによる9ホールが加わっています。このリゾートが最もよく知られているのは、タイ初の水田グリーン。水が張られ、季節ごとに表情を変える田んぼを越えてプレーするホールが並び、国内の一般的なパークランドコースでは味わえない体験をもたらしてくれます。Alpineは地域のプロトーナメントを開催した実績があり、タイ北部屈指のゴルフ体験として繰り返し名前が挙がるコースのひとつです。敷地内には78室のリゾート、スパ、インターナショナルレストラン、プール、コンベンションセンターがそろい、ラウンドとチェンマイでの長めの滞在を組み合わせたいゴルファーの行き先となっています。`,
        layout_and_experience: `27ホールのレイアウトは9ホールずつ3つのセクションに分かれ、それぞれに異なる性格があります。コースAとBが主軸となるチャンピオンシップ18ホールを構成し、バックティーからは約7,500ヤード、森に覆われた谷あいの地形を貫きます。ルーティングは、成熟した木々に縁取られたパークランドのフェアウェイと湿地帯の移行部、そしてこのコース最大の特徴である水田セクションを組み合わせたもの。水田セクションでは、実際に稲作が行われている田んぼの上にフェアウェイとグリーンが造られています。この水田ゾーンは一年を通じて大きく表情を変え、暑い季節には乾いて黄金色に染まり、モンスーンの時期には青々と茂って水が張られ、ほぼすべてのショットの脇に水が寄り添います。

地形はチェンマイの基準では概ね平坦から緩やかな起伏どまりで、市街から遠い高地の山岳コースに比べるとAlpineは取り組みやすい部類に入ります。高低差は中程度ですが、木立に挟まれたコリドーはティーショットの正確さを求め、水田セクションが視覚的にも戦略的にも複雑さを加えます。3つ目のナインであるコースCは2017年の開場で、松林のゾーンと湿地の通路で変化を添え、コースAまたはBと組み合わせれば18ホールの別ルーティングとしても回れます。

グリーンは全体に中速で、精度の高いアプローチに報いるだけの硬さがあり、バンカーは幅の狭いパー4で外れたアプローチを咎める位置に配されています。A+Bの18ホール組み合わせでのコースはパー72。雨季（6〜10月）の午後のラウンドは短時間の熱帯性のにわか雨で中断されることがあるため、この時期は午前のティータイムを強くおすすめします。11月から2月にかけての涼しく乾いた数か月は理想的なコンディションで、気温は摂氏20度台前半、雨のリスクもほぼありません。`,
        tips: `ここに表示している料金（キャディーとカートを含むオールインクルーシブの3,700THB）は、4月から10月まで有効なローシーズンの料金です。ハイシーズン（11〜3月）の料金はこれより高くなるため、予約前に+66 53 880 888またはalpinegolfresort.comでリゾートに直接、現在の料金をご確認ください。ティータイムは午前中に取るのがおすすめで、気温が低く湿度も下がります。午後の気温が35度を超えることもある3〜5月の暑季にはなおさらです。Alpineを最も快適にプレーできるのは11月から2月まで。涼しく乾いていて、フェアウェイのコンディションも上々です。リゾートはクラブハウスでランチビュッフェを提供しており、一部のグリーンフィーパッケージには含まれています。ご自身の料金に含まれるかどうかは、予約時にご確認ください。キャディーの帯同は必須で、同じキャディーがラウンドを通して付きます。ラウンド終了時に400THB以上のチップを渡すのが慣例です。カートも必須で、プレーヤー1人につき1台を使用します。ゴルフクラブとシューズはプロショップでレンタルできます。チェンマイ市内からのGrabタクシーは頼りになり、リゾートによるシャトル送迎の手配も可能です。`,
        location_and_access: `Alpine Golf Resort Chiang Maiはチェンマイ市中心部から東へ25km、サンカンペーン郡にあり、チェンマイ国際空港からは車でおよそ30〜40分です。バンコクからはほぼ全員が空路を利用し、スワンナプーム（BKK）またはドンムアン（DMK）からチェンマイ（CNX）まで約1時間10分。バンコクから700kmすべてを車で走ると約9時間かかり、ゴルフ旅行には現実的ではありません。チェンマイに着いたあとは、自家用車やGrabタクシー、リゾートのシャトルでコースへ向かえます。ルートは国道1147号線を東へ、サンカンペーン郡を抜けていきます。`,
        rental_cta_context: `タイ北部でのラウンドにAlpine Golf Resort Chiang Maiを予定していますか。バンコクでプレミアムクラブをレンタルすれば、フライト前にホテルへお届けするので、身軽に移動でき、航空会社の手荷物料金も省けます。`,
      },
    },
  },
  status: 'published',
  published_at: '2026-04-20',
}
