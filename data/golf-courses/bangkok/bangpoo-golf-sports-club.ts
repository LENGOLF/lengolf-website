import type { GolfCourse } from '@/types/golf-courses'

export const course: GolfCourse = {
  slug: 'bangpoo-golf-sports-club',
  region: 'bangkok',
  name: `Bangpoo Golf & Sports Club`,
  province: `Samut Prakan`,
  designer: `Arnold Palmer`,
  holes: 18,
  par: 72,
  year_opened: 1991,
  green_fee_weekday_thb: 1700,
  green_fee_weekend_thb: 2600,
  // The posted green fee includes the caddie (Thai booking sites list it
  // "รวมแคดดี้"; the ~400 THB paid on the day is a customary tip). Zero is
  // this repo's encoding of a genuine inclusion (SpecTable, on /compare/, would
  // render "Included"; CoursePage hides the caddie row either way, and the
  // generated caddie FAQ treats 0 like null).
  // Cart is optional and extra, so this is NOT fee_is_package.
  caddie_fee_thb: 0,
  cart_fee_thb: null,
  caddie_required: true,
  cart_required: false,
  driving_range: true,
  website: null,
  phone: null,
  // Owner-supplied pin (2026-09-23). The previous 13.574/100.854 sat ~20 km
  // east near Bang Bo, contradicting this file's own Phraek Sa Mai address,
  // which is why Batch 9 held the course back from translation.
  latitude: 13.5408,
  longitude: 100.6721,
  coordinates_verified_at: '2026-09-23',
  distance_from_bangkok_km: 40,
  drive_time_from_bangkok_min: 50,
  google_maps_url: null,
  club_rental_available: true,
  club_rental_fee_thb: 800,
  club_rental_brands: null,
  schema_markup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"GolfCourse\",\n  \"name\": \"Bangpoo Golf & Sports Club\",\n  \"url\": \"https://len.golf/golf-courses/bangkok/bangpoo-golf-sports-club\",\n  \"description\": null,\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"addressLocality\": \"Samut Prakan\",\n    \"addressCountry\": \"TH\"\n  },\n  \"geo\": {\n    \"@type\": \"GeoCoordinates\",\n    \"latitude\": 13.5408,\n    \"longitude\": 100.6721\n  },\n  \"telephone\": null,\n  \"priceRange\": \"฿฿\",\n  \"sameAs\": [\n    \"https://maps.google.com/?q=13.5408,100.6721\"\n  ],\n  \"amenityFeature\": [\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Driving Range\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Caddie Required\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Golf Cart\",\n      \"value\": false\n    }\n  ]\n}",
  prose: {
    overview: `Bangpoo Golf & Sports Club holds a unique place in Thai golf history as the only Arnold Palmer-designed course in Thailand and one of very few Palmer creations in all of Asia. Set near the Gulf of Thailand coast in Samut Prakan province, about 40 kilometres south-east of central Bangkok, the course opened in 1991 on gently rolling terrain shaded by mature trees and softened by natural wildflowers. Its seaside proximity brings a steady breeze that keeps temperatures cooler than courses deeper inland — a genuine comfort bonus during Bangkok's sweltering months. The club draws a loyal local following, particularly from Bangna-area residents, attracted by its competitive pricing and the prestige of a Palmer layout. Visiting golfers from abroad appreciate the authentic 1990s tropical parkland ambience and the relatively uncrowded weekday tee sheet. At 7,048 yards from the tips with TifEagle greens, the course plays as a proper championship test without being punishing for mid-handicap players.`,
    layout_and_experience: `The 18-hole Palmer layout is routed across rolling terrain — uncommon for the flat Bangkok region — and makes generous use of natural vegetation and water features. Mature trees frame most fairways, reducing visual width off the tee without creating unfair blind spots. The coastal breeze is a constant factor: it shifts club selection by one to two clubs on exposed holes and can make the front nine play significantly harder on windy mornings. Water hazards appear on approximately nine holes, often positioned to punish overly aggressive lines from the tee rather than to penalise well-played approaches. The greens, planted with TifEagle Bermuda, are receptive at moderate speeds and putt true after a morning roll. Pace of play is relaxed by Bangkok standards, with few pressure points from back-to-back groups. The course rating of 72.5 with a slope of 121 confirms its moderate-to-challenging character — straightforward for scratch golfers, rewarding for single-figure handicappers who manage their position off the tee.`,
    tips: `Weekday mornings offer the best conditions: fewer golfers, cooler air, and greens freshly cut. Weekend early-morning tee times (from 6 am) draw the biggest crowds and command the highest fees — afternoon slots after noon cost noticeably less. Caddie service is bundled in all packages and the caddies are experienced, so accept their local knowledge on wind-adjusted club selections. The course is in Samut Prakan, reached via the Bangna–Trat expressway; allow 50 minutes from central Bangkok and 30 minutes from Suvarnabhumi Airport. Dress code requires a collar — shorts are permitted. An Arnold Palmer devotee will want a photo at the course signage noting his rare Asian commission.`,
    location_and_access: `Bangpoo Golf & Sports Club is located at 191 Moo 3, Phraek Gasa Mai, Mueang Samut Prakan, Samut Prakan 10280. The course lies approximately 40 km south-east of central Bangkok, about 50 minutes by car via the Bangna–Trat Expressway. It is roughly 30 minutes from Suvarnabhumi International Airport. No practical public transport connects to the club; taxi, Grab, or private car is the only option.`,
    rental_cta_context: `Heading out to Bangpoo from Bangkok is much easier without a golf bag taking up half the boot. LENGOLF delivers premium Callaway rental sets to your Bangkok hotel the evening before your round, so you travel light.`,
  },
  locales: {
    en: {
      title: `Bangpoo Golf & Sports Club — Green Fees, Course Guide & Golf Club Rentals`,
      meta_description: `Bangpoo Golf & Sports Club green fees, Arnold Palmer course guide, visitor tips, and golf club rentals delivered to your Bangkok hotel.`,
    },
    th: {
      title: `Bangpoo Golf & Sports Club สมุทรปราการ · ค่ากรีนฟี รีวิวสนาม และเช่าไม้กอล์ฟ`,
      meta_description: `ค่ากรีนฟี Bangpoo Golf & Sports Club วันธรรมดา 1,700 บาท เสาร์อาทิตย์ 2,600 บาท สนามออกแบบโดย Arnold Palmer เพียงแห่งเดียวในไทย ใกล้อ่าวไทยในจังหวัดสมุทรปราการ พร้อมบริการเช่าไม้กอล์ฟส่งถึงโรงแรมในกรุงเทพฯ`,
      prose: {
        overview: `Bangpoo Golf & Sports Club มีตำแหน่งพิเศษในประวัติศาสตร์กอล์ฟไทยในฐานะสนามแห่งเดียวในประเทศไทยที่ออกแบบโดย Arnold Palmer และเป็นหนึ่งในผลงานไม่กี่แห่งของ Palmer ในทวีปเอเชียทั้งหมด ตัวสนามตั้งอยู่ใกล้ชายฝั่งอ่าวไทยในจังหวัดสมุทรปราการ ห่างจากใจกลางกรุงเทพฯ ไปทางตะวันออกเฉียงใต้ราว 40 กิโลเมตร เปิดให้บริการในปี 1991 บนภูมิประเทศที่ลาดเอียงเล็กน้อย ร่มรื่นด้วยต้นไม้ใหญ่และแซมด้วยดอกไม้ป่าตามธรรมชาติ ความใกล้ทะเลนำพาสายลมพัดสม่ำเสมอที่ช่วยให้อุณหภูมิเย็นกว่าสนามที่อยู่ลึกเข้าไปในแผ่นดิน นับเป็นโบนัสความสบายที่แท้จริงในช่วงเดือนที่ร้อนอบอ้าวของกรุงเทพฯ สนามมีกลุ่มลูกค้าท้องถิ่นที่เหนียวแน่น โดยเฉพาะผู้ที่พำนักในย่านบางนา ซึ่งดึงดูดด้วยราคาที่แข่งขันได้และเกียรติภูมิของเลย์เอาต์ฝีมือ Palmer นักกอล์ฟที่มาเยือนจากต่างประเทศชื่นชอบบรรยากาศพาร์กแลนด์เขตร้อนแบบยุค 1990 ที่แท้จริง และตารางทีไทม์วันธรรมดาที่ค่อนข้างไม่แออัด ด้วยระยะ 7,048 หลาจากแท่นทีหลังและกรีนพันธุ์ TifEagle สนามเล่นได้สมกับเป็นบททดสอบระดับแชมเปียนชิพโดยไม่โหดเกินไปสำหรับผู้เล่นแฮนดิแคปกลาง`,
        layout_and_experience: `เลย์เอาต์ 18 หลุมฝีมือ Palmer วางเส้นทางพาดผ่านภูมิประเทศที่ลาดเอียง ซึ่งไม่ค่อยพบในเขตกรุงเทพฯ ที่ราบเรียบ และใช้พืชพรรณธรรมชาติกับอุปสรรคน้ำอย่างเต็มที่ ต้นไม้ใหญ่กรอบแฟร์เวย์เกือบทุกหลุม ลดความกว้างเชิงสายตาจากแท่นทีโดยไม่สร้างจุดบอดที่ไม่เป็นธรรม สายลมชายฝั่งเป็นปัจจัยคงที่ ทำให้ต้องปรับการเลือกไม้หนึ่งถึงสองเบอร์ในหลุมที่โล่งลม และอาจทำให้เก้าหลุมแรกเล่นยากขึ้นมากในเช้าที่ลมแรง อุปสรรคน้ำปรากฏราวเก้าหลุม มักวางไว้เพื่อลงโทษไลน์ที่รุกมากเกินไปจากแท่นทีมากกว่าจะลงโทษช็อตแอพโพรชที่เล่นได้ดี กรีนที่ปลูกด้วยหญ้าเบอร์มิวดา TifEagle รับลูกได้ดีที่ความเร็วปานกลางและพัตต์นิ่งหลังการกลิ้งในตอนเช้า จังหวะการเล่นผ่อนคลายเมื่อเทียบกับมาตรฐานกรุงเทพฯ โดยมีจุดกดดันจากกลุ่มที่ต่อกันน้อย ค่าเรตติ้งสนาม 72.5 พร้อมสโลป 121 ยืนยันลักษณะระดับปานกลางถึงท้าทาย ตรงไปตรงมาสำหรับนักกอล์ฟสแครช และตอบแทนผู้เล่นแฮนดิแคปหลักเดียวที่บริหารตำแหน่งลูกจากแท่นทีได้ดี`,
        tips: `เช้าวันธรรมดาให้สภาพสนามที่ดีที่สุด ทั้งผู้เล่นน้อยกว่า อากาศเย็นกว่า และกรีนที่เพิ่งตัดใหม่ ทีไทม์เช้าตรู่ของวันหยุดสุดสัปดาห์ (ตั้งแต่ 6 โมงเช้า) ดึงดูดผู้เล่นมากที่สุดและมีค่าธรรมเนียมสูงสุด ส่วนช่วงบ่ายหลังเที่ยงราคาถูกลงอย่างเห็นได้ชัด บริการแคดดี้รวมอยู่ในทุกแพ็กเกจ และแคดดี้มีประสบการณ์ จึงควรรับฟังความรู้ท้องถิ่นของพวกเขาเรื่องการเลือกไม้ที่ปรับตามลม สนามอยู่ในจังหวัดสมุทรปราการ เข้าถึงได้ผ่านทางด่วนบางนา-ตราด เผื่อเวลา 50 นาทีจากใจกลางกรุงเทพฯ และ 30 นาทีจากสนามบินสุวรรณภูมิ กฎการแต่งกายกำหนดให้สวมเสื้อมีปก ส่วนกางเกงขาสั้นสวมได้ ผู้ที่ชื่นชอบ Arnold Palmer คงอยากถ่ายรูปคู่กับป้ายสนามที่ระบุถึงผลงานหายากในเอเชียของเขา`,
        location_and_access: `Bangpoo Golf & Sports Club ตั้งอยู่เลขที่ 191 หมู่ 3 ตำบลแพรกษาใหม่ อำเภอเมืองสมุทรปราการ จังหวัดสมุทรปราการ 10280 สนามอยู่ห่างจากใจกลางกรุงเทพฯ ไปทางตะวันออกเฉียงใต้ประมาณ 40 กิโลเมตร ใช้เวลาราว 50 นาทีทางรถยนต์ผ่านทางด่วนบางนา-ตราด และอยู่ห่างจากสนามบินนานาชาติสุวรรณภูมิราว 30 นาที ไม่มีขนส่งสาธารณะที่สะดวกเชื่อมถึงสนาม แท็กซี่ Grab หรือรถส่วนตัวจึงเป็นทางเลือกเดียว`,
        rental_cta_context: `การเดินทางไป Bangpoo จากกรุงเทพฯ ง่ายขึ้นมากเมื่อไม่มีถุงกอล์ฟกินพื้นที่ครึ่งหนึ่งของท้ายรถ LENGOLF จัดส่งชุดไม้กอล์ฟพรีเมียม Callaway ให้เช่าถึงโรงแรมของคุณในกรุงเทพฯ ตั้งแต่เย็นก่อนวันออกรอบ เพื่อให้คุณเดินทางแบบไม่ต้องแบกสัมภาระ`,
      },
    },
    ko: {
      title: `Bangpoo Golf & Sports Club 사뭇쁘라깐 그린피: 코스 가이드와 클럽 대여`,
      meta_description: `Bangpoo Golf & Sports Club 그린피는 평일 약 1,700바트, 주말 약 2,600바트예요. 태국만 해안 가까이 자리한 사뭇쁘라깐의 아널드 파머 설계 18홀 코스 안내와, 호텔로 배달되는 LENGOLF 클럽 대여를 정리했어요.`,
      prose: {
        overview: `Bangpoo Golf & Sports Club은 태국에서 유일한 아널드 파머(Arnold Palmer) 설계 코스이자, 아시아 전체에서도 몇 안 되는 파머의 작품 중 하나로 태국 골프 역사에서 독특한 자리를 차지하고 있어요. 방콕 도심에서 남동쪽으로 약 40km 떨어진 사뭇쁘라깐(Samut Prakan)의 태국만 해안 가까이에 자리하며, 1991년 완만하게 굽이치는 지형 위에 문을 열었습니다. 아름드리나무가 그늘을 드리우고 자생 야생화가 부드러운 분위기를 더해 주죠. 바다와 가까운 덕에 꾸준한 바닷바람이 불어 내륙 깊숙한 코스들보다 기온이 낮게 유지되는데, 방콕이 푹푹 찌는 시기에는 이것이 진짜 반가운 보너스예요. 클럽은 경쟁력 있는 요금과 파머 설계라는 명성에 이끌린 방나 일대 주민들을 중심으로 충성도 높은 현지 고객층을 거느리고 있습니다. 해외에서 온 골퍼들은 1990년대풍의 진짜배기 열대 파크랜드 분위기와 주중에 비교적 한산한 티 시트를 반겨요. 뒤 티 기준 7,048야드에 TifEagle 그린을 갖춘 이 코스는 중급 핸디캐퍼를 가혹하게 몰아붙이지 않으면서도 제대로 된 챔피언십의 시험대 역할을 해냅니다.`,
        layout_and_experience: `18홀 파머 레이아웃은 평탄한 방콕 지역에서는 보기 드물게 굽이치는 지형을 가로질러 뻗어 있으며, 자연 식생과 워터 해저드를 넉넉히 활용해요. 아름드리나무가 대부분의 페어웨이를 감싸 티에서 바라보는 시각적 폭을 좁히지만, 불공평한 블라인드 지점을 만들지는 않습니다. 바닷바람은 늘 변수로 작용하는데, 노출된 홀에서는 클럽 선택을 한두 클럽씩 바꿔 놓고 바람 부는 아침에는 전반 9홀을 훨씬 어렵게 만들 수 있어요. 워터 해저드는 약 9개 홀에 나타나며, 잘 친 어프로치를 벌하기보다는 티에서 지나치게 공격적인 라인을 응징하도록 배치된 경우가 많습니다. TifEagle 버뮤다로 조성된 그린은 적당한 속도에서 공을 잘 받아 주고, 아침 롤링 작업을 마친 뒤에는 정직하게 굴러가요. 플레이 속도는 방콕 기준으로는 여유로운 편이라 앞뒤 조에게 쫓기는 압박이 거의 없습니다. 코스 레이팅 72.5, 슬로프 121이라는 수치는 이 코스의 중상급 성격을 뒷받침해요. 스크래치 골퍼에게는 무난하고, 티에서 자기 위치를 잘 관리하는 싱글 핸디캐퍼에게는 보람을 주는 코스입니다.`,
        tips: `가장 좋은 컨디션은 주중 아침이에요. 골퍼가 적고 공기가 시원하며 그린도 갓 깎여 있죠. 주말 이른 아침(오전 6시부터) 티타임은 가장 붐비고 요금도 가장 높은 반면, 정오 이후 오후 슬롯은 눈에 띄게 저렴합니다. 캐디 서비스는 모든 패키지에 포함돼 있고 캐디들이 경험이 많으니, 바람을 감안한 클럽 선택에 대한 현지 조언을 받아들이세요. 코스는 사뭇쁘라깐에 있으며 방나–뜨랏 고속도로로 진입하는데, 방콕 도심에서 50분, 수완나품 공항에서 30분 정도를 잡아 두면 됩니다. 드레스 코드는 카라가 있는 상의를 요구하지만 반바지는 허용돼요. 아널드 파머 애호가라면 그의 드문 아시아 설계작임을 알리는 코스 안내판 앞에서 사진 한 장을 남기고 싶어질 겁니다.`,
        location_and_access: `Bangpoo Golf & Sports Club의 주소는 191 Moo 3, Phraek Gasa Mai, Mueang Samut Prakan, Samut Prakan 10280이에요. 코스는 방콕 도심에서 남동쪽으로 약 40km 떨어져 있고, 방나–뜨랏 고속도로로 차로 약 50분 거리입니다. 수완나품 국제공항에서는 대략 30분이에요. 클럽으로 연결되는 현실적인 대중교통은 없어서 택시나 Grab, 자가용이 유일한 선택입니다.`,
        rental_cta_context: `방콕에서 Bangpoo로 향할 때 트렁크 절반을 차지하는 골프백이 없으면 훨씬 수월해요. LENGOLF는 Callaway 프리미엄 대여 세트를 라운딩 전날 저녁 방콕 호텔로 배달해 드려서 가볍게 이동할 수 있습니다.`,
      },
    },
    zh: {
      title: `Bangpoo Golf & Sports Club果岭费与球场攻略：北榄18洞`,
      meta_description: `Bangpoo Golf & Sports Club果岭费平日1,700泰铢、周末2,600泰铢。这是泰国唯一一座Arnold Palmer设计的18洞球场，坐落于北榄府泰国湾海岸附近，另附送到酒店的球杆租借。`,
      prose: {
        overview: `Bangpoo Golf & Sports Club在泰国高尔夫史上有着独特地位：它是泰国唯一一座由阿诺德·帕尔默（Arnold Palmer）设计的球场，也是全亚洲极少数的帕尔默作品之一。球场地处曼谷市中心东南方约40公里的北榄府，紧邻泰国湾海岸，于1991年在一片缓坡地形上开放，成年树木遮荫，天然野花点缀其间。临海的位置带来稳定的海风，让气温比更深入内陆的球场更为凉爽。在曼谷闷热的月份里，这是实实在在的舒适加分。球会拥有一批忠实的本地拥趸，尤其是Bangna一带的居民，被它有竞争力的价格和帕尔默布局的声望所吸引。来自海外的访客球手则欣赏这里地道的1990年代热带公园式氛围，以及平日相对不拥挤的开球表。从后置发球台量起7,048码，配以TifEagle果岭，球场是一场货真价实的锦标赛考验，却又不会让中差点球手难以招架。`,
        layout_and_experience: `这条18洞的帕尔默布局铺展在起伏的地形上（在地势平坦的曼谷地区实属少见），并大量运用天然植被与水景。成年树木勾勒出大多数球道的轮廓，从发球台望去视觉宽度收窄，却不会制造不公平的盲区。海岸的微风是恒常的因素：在暴露的球洞上，它会让选杆增减一到两号，多风的清晨还会让前九明显更难打。水障碍大约出现在九个洞上，多半布置在惩罚发球时过于激进的路线，而非为难打得好的攻果岭球。果岭铺植TifEagle百慕达草，中等速度下接球性好，经过清晨的滚压后推感稳定。以曼谷的标准衡量，打球节奏轻松，前后组之间少有压力点。球场难度评级72.5、坡度121，印证了它中等偏挑战的性格：对零差点球手直截了当，对能管理好发球落点的个位数差点球手则回报丰厚。`,
        tips: `平日清晨的条件最佳：球手更少、空气更凉、果岭刚修剪过。周末清早的开球时段（从早上6点起）人潮最盛、收费也最高，正午之后的下午时段则明显便宜。所有套餐都含球童服务，且球童经验丰富，因此不妨采纳他们就风向调整选杆的本地经验。球场位于北榄府，经Bangna–Trat高速抵达；从曼谷市中心预留50分钟，从素万那普机场预留30分钟。着装要求有领上衣，可穿短裤。帕尔默的拥趸多半会想在标注着他这次罕见亚洲之作的球场标牌前拍张照。`,
        location_and_access: `Bangpoo Golf & Sports Club地址为191 Moo 3, Phraek Gasa Mai, Mueang Samut Prakan, Samut Prakan 10280。球场在曼谷市中心东南方约40公里，经Bangna–Trat高速车程约50分钟。距素万那普国际机场约30分钟。没有实用的公共交通连通球会；出租车、Grab或私家车是唯一的选择。`,
        rental_cta_context: `从曼谷前往Bangpoo，没了占据半个后备箱的球包会轻松许多。LENGOLF会在下场前一晚把Callaway高级租借套装送到你的曼谷酒店，让你轻装出行。`,
      },
    },
    ja: {
      title: `Bangpoo Golf & Sports Club（サムットプラーカーン県）：グリーンフィー・コース紹介・クラブレンタル`,
      meta_description: `グリーンフィーは平日1,700THB・週末2,600THB。Bangpoo Golf & Sports Clubはサムットプラーカーン県にある、タイで唯一のアーノルド・パーマー設計18ホールコースです。ホテルへ届くLENGOLFのクラブレンタルもご案内します。`,
      prose: {
        overview: `Bangpoo Golf & Sports Clubは、タイで唯一のアーノルド・パーマー設計コースであり、アジア全体でも数少ないパーマー作品のひとつとして、タイのゴルフ史に独自の位置を占めています。バンコク中心部から南東へ約40km、サムットプラーカーン県のタイランド湾沿岸近くに位置し、1991年に開業しました。緩やかに起伏する地形は成木の木陰に覆われ、自生する野花が景観をやわらげています。海に近いことから絶えず潮風が吹き、内陸のコースよりも気温が低く保たれるのは、バンコクの蒸し暑い時期には本物の快適さのボーナスです。バンナー周辺の住民を中心に地元の熱心なファンを集めており、競争力のある料金と、パーマー設計という格の高さが魅力となっています。海外から訪れるゴルファーは、1990年代らしい本格的なトロピカルパークランドの雰囲気と、平日の比較的空いたティーシートを高く評価します。バックティーからは7,048ヤード、TifEagleのグリーンを備え、中級ハンディキャップのプレーヤーを痛めつけることなく、本格的なチャンピオンシップの手ごたえを味わわせてくれます。`,
        layout_and_experience: `18ホールのパーマーレイアウトは、フラットなバンコク地域では珍しい起伏のある地形の上に配され、自然の植生とウォーターハザードをふんだんに活かしています。成木が大半のフェアウェイを縁取り、ティーからの視覚的な幅を狭めますが、不公平なブラインドスポットをつくることはありません。海からの潮風は常に影響を及ぼす要素で、風にさらされるホールではクラブ選択が1〜2番手変わり、風の強い朝にはフロントナインが格段に難しくなることもあります。ウォーターハザードはおよそ9ホールに現れ、多くはよく打ったアプローチを罰するのではなく、ティーからの攻めすぎたラインをとがめる位置に配されています。グリーンはTifEagleバミューダ芝で、ほどよいスピードでボールを受け止め、朝のローラー転圧後は素直に転がります。プレーの進行はバンコク基準ではゆったりしており、組同士のプレッシャーもほとんどありません。コースレーティング72.5、スロープ121という数値が、スクラッチゴルファーには素直で、ティーショットの位置取りを管理できるシングルハンディキャッパーには手ごたえのある、中〜上級の性格を裏づけています。`,
        tips: `最良のコンディションを求めるなら平日の午前中です。ゴルファーが少なく、空気は涼しく、グリーンは刈りたてです。週末の早朝ティータイム（6時から）は最も混み合い、料金も最も高くなりますが、正午以降の午後の枠は目に見えて安くなります。キャディーサービスは全パッケージに含まれ、キャディーは経験豊富なので、風を読んだクラブ選択についての現地の知識は素直に受け入れましょう。コースはサムットプラーカーン県にあり、バンナー・トラート高速道路経由でアクセスします。バンコク中心部から50分、スワンナプーム空港から30分を見込んでおいてください。ドレスコードは襟付きが必須で、ショートパンツは可です。アーノルド・パーマーの愛好家なら、彼のアジアでは珍しい設計であることを記したコースの看板の前で、写真を一枚撮りたくなるはずです。`,
        location_and_access: `Bangpoo Golf & Sports Clubの所在地は191 Moo 3, Phraek Gasa Mai, Mueang Samut Prakan, Samut Prakan 10280です。コースはバンコク中心部から南東へ約40km、バンナー・トラート高速道路経由で車で約50分の場所にあります。スワンナプーム国際空港からはおよそ30分です。実用的な公共交通の接続はなく、タクシー、Grab、あるいは自家用車が唯一の手段となります。`,
        rental_cta_context: `バンコクからBangpooへ向かうなら、トランクの半分を占領するゴルフバッグがないほうがずっと楽です。LENGOLFはCallawayのプレミアムレンタルセットを、ラウンド前夜にバンコクのホテルへお届けするので、身軽に移動できます。`,
      },
    },
  },
  status: 'published',
  published_at: '2026-04-20',
}
