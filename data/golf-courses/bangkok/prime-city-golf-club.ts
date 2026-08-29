import type { GolfCourse } from '@/types/golf-courses'

export const course: GolfCourse = {
  slug: 'prime-city-golf-club',
  region: 'bangkok',
  name: `Prime City Golf Club`,
  province: `Nakhon Nayok`,
  designer: null,
  holes: 18,
  par: 72,
  year_opened: 1993,
  green_fee_weekday_thb: 1050,
  green_fee_weekend_thb: 1200,
  // All-in package, per this file's own EN prose: "an all-inclusive package at
  // 1,050 THB weekday (green fee, caddie, and cart)", which is exactly the
  // weekday rate typed above. The rate BASIS (weekday/weekend) is unchanged;
  // this only stops generated copy calling the number a bare "green fee".
  fee_is_package: true,
  // Zero, not null: the caddie costs this golfer nothing on top of the package,
  // and SpecTable renders 0 as "Included" where null renders an em dash.
  caddie_fee_thb: 0,
  // Zero for the same reason as caddie_fee_thb above - bundled into the package.
  cart_fee_thb: 0,
  caddie_required: true,
  cart_required: true,
  driving_range: true,
  website: null,
  phone: '+66 98 831 6460',
  latitude: 14.074,
  longitude: 100.954,
  distance_from_bangkok_km: 80,
  drive_time_from_bangkok_min: 90,
  google_maps_url: null,
  club_rental_available: true,
  club_rental_fee_thb: 600,
  club_rental_brands: null,
  schema_markup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"GolfCourse\",\n  \"name\": \"Prime City Golf Club\",\n  \"url\": \"https://len.golf/golf-courses/bangkok/prime-city-golf-club\",\n  \"description\": null,\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"addressLocality\": \"Nakhon Nayok\",\n    \"addressCountry\": \"TH\"\n  },\n  \"geo\": {\n    \"@type\": \"GeoCoordinates\",\n    \"latitude\": 14.074,\n    \"longitude\": 100.954\n  },\n  \"telephone\": \"+66 98 831 6460\",\n  \"priceRange\": \"฿฿\",\n  \"sameAs\": [\n    \"https://maps.google.com/?q=14.074,100.954\"\n  ],\n  \"amenityFeature\": [\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Driving Range\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Caddie Required\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Golf Cart\",\n      \"value\": true\n    }\n  ]\n}",
  prose: {
    overview: `Prime City Golf Club occupies a scenic position in Ongkharak District, Nakhon Nayok province, approximately 80 kilometres northeast of Bangkok — a drive of around 90 minutes that rewards visitors with a genuinely uncrowded course and a fee structure that is among the most competitive in the outer Bangkok region. Established in 1993, the 18-hole, par-72 layout stretches to 6,782 yards and is built on flat agricultural land with wide, forgiving fairways and minimal elevation change. Its reputation is explicitly that of a beginner- and mid-handicapper-friendly course — open, navigable, and pressure-free — which makes it popular with golfing groups who want an enjoyable social round rather than a punishing test. The combination of an all-inclusive package at 1,050 THB weekday (green fee, caddie, and cart) and reliable conditioning makes Prime City one of the better-value full-length courses in provincial Bangkok.`,
    layout_and_experience: `The flat, parkland layout is characterised by wide fairways and limited rough, giving players plenty of room off the tee. Obstacles are modest — a few small water hazards and strategically positioned bunkers — with the emphasis firmly on approachability rather than difficulty. The par-fives are reachable in two for long hitters, and the par-threes are straightforward iron shots over manageable distances. Greens are well-maintained and putt at a moderate speed. Cart paths run the full course, and the mandatory cart keeps the round moving efficiently. Caddies are local and knowledgeable, though the uncomplicated routing means their club selection advice is less critical than at more technical courses. The course is rarely crowded, even on weekends, which contributes to a relaxed pace throughout.`,
    tips: `Prime City is the ideal course for first-time visitors to Thailand golf or golfers recovering from a difficult few days on more demanding courses. Book by phone (+66 98 831 6460) as the online presence is limited. The 1,050 THB weekday all-in package — including caddie and cart — is exceptional value for a course of this length. The drive from Bangkok is northeast via Highway 305 (Rangsit–Ongkarak Road); traffic is minimal outside of Bangkok rush hours. Weekend rates increase only modestly to 1,200 THB. Nakhon Nayok's waterfall parks and national forest are close by for a full day trip.`,
    location_and_access: `Prime City Golf Club is located at Bang Pla Kot, Ongkharak District, Nakhon Nayok 26120. The club is approximately 80 km northeast of central Bangkok, around 90 minutes by car via Highway 305. There is no practical public transport; private car, taxi, or Grab is required. The course is accessible from Suvarnabhumi Airport in approximately 80 minutes via Bang Na–Trat Highway and Highway 305.`,
    rental_cta_context: `At 1,050 THB all-in, Prime City is already exceptional value — and with LENGOLF clubs delivered to your Bangkok hotel, you avoid on-site rental uncertainty and play with premium equipment on a relaxed Nakhon Nayok morning.`,
  },
  locales: {
    en: {
      title: `Prime City Golf Club — Green Fees, Course Guide & Golf Club Rentals`,
      meta_description: `Prime City Golf Club green fees, course guide, visitor tips, and golf club rentals delivered to your Bangkok hotel.`,
    },
    th: {
      title: `Prime City Golf Club นครนายก — แพ็กเกจรวมทุกอย่าง รีวิวสนาม และเช่าไม้กอล์ฟ`,
      meta_description: `แพ็กเกจรวมทุกอย่างที่ Prime City Golf Club วันธรรมดา 1,050 บาท รวมกรีนฟี แคดดี้ และรถกอล์ฟ สนาม 18 หลุม พาร์ 72 ระยะ 6,782 หลา ในอำเภอองครักษ์ จังหวัดนครนายก ขับรถจากกรุงเทพฯ ราว 90 นาที พร้อมบริการเช่าไม้กอล์ฟส่งถึงโรงแรมในกรุงเทพฯ`,
      prose: {
        overview: `Prime City Golf Club ตั้งอยู่ในทำเลที่มีทัศนียภาพสวยงามในอำเภอองครักษ์ จังหวัดนครนายก ห่างจากกรุงเทพฯ ไปทางทิศตะวันออกเฉียงเหนือประมาณ 80 กิโลเมตร ใช้เวลาขับรถราว 90 นาที โดยสิ่งที่ผู้มาเยือนได้กลับไปคือสนามที่ไม่แออัดอย่างแท้จริง และโครงสร้างค่าบริการที่จัดอยู่ในกลุ่มคุ้มค่าที่สุดของพื้นที่รอบนอกกรุงเทพฯ สนามเปิดให้บริการตั้งแต่ปี 1993 เป็นเลย์เอาต์ 18 หลุม พาร์ 72 ระยะ 6,782 หลา สร้างบนพื้นที่เกษตรกรรมที่ราบเรียบ มีแฟร์เวย์กว้างและให้อภัย และมีการเปลี่ยนระดับความสูงน้อยมาก ชื่อเสียงของสนามคือความเป็นมิตรกับผู้เริ่มต้นและนักกอล์ฟแฮนดิแคปกลาง ๆ อย่างชัดเจน ทั้งเปิดโล่ง เดินเกมง่าย และไม่กดดัน จึงเป็นที่นิยมในหมู่กลุ่มนักกอล์ฟที่อยากออกรอบสังสรรค์อย่างเพลิดเพลินมากกว่าการวัดฝีมือแบบโหดหิน การผสมผสานระหว่างแพ็กเกจรวมทุกอย่างราคา 1,050 บาทในวันธรรมดา (รวมกรีนฟี แคดดี้ และรถกอล์ฟ) กับสภาพสนามที่ดูแลได้สม่ำเสมอ ทำให้ Prime City เป็นหนึ่งในสนามขนาดเต็มรูปแบบที่คุ้มค่าที่สุดกลุ่มหนึ่งในเขตต่างจังหวัดรอบกรุงเทพฯ`,
        layout_and_experience: `เลย์เอาต์แบบพาร์กแลนด์ที่ราบเรียบมีจุดเด่นอยู่ที่แฟร์เวย์กว้างและรัฟที่มีจำกัด ทำให้ผู้เล่นมีพื้นที่เหลือเฟือจากแท่นที อุปสรรคมีไม่มาก ทั้งอุปสรรคน้ำขนาดเล็กไม่กี่จุดและบังเกอร์ที่วางไว้อย่างมีชั้นเชิง โดยเน้นความเข้าถึงง่ายมากกว่าความยาก หลุมพาร์ 5 นักกอล์ฟที่ตีไกลสามารถขึ้นกรีนได้ในสองช็อต ส่วนหลุมพาร์ 3 เป็นช็อตเหล็กตรงไปตรงมาในระยะที่จัดการได้ กรีนได้รับการดูแลอย่างดีและมีความเร็วปานกลาง มีเส้นทางรถกอล์ฟตลอดทั้งสนาม และการบังคับใช้รถกอล์ฟช่วยให้จังหวะการเล่นเดินหน้าได้อย่างมีประสิทธิภาพ แคดดี้เป็นคนท้องถิ่นและมีความรู้ดี แม้ว่าเส้นทางสนามที่ไม่ซับซ้อนจะทำให้คำแนะนำเรื่องการเลือกไม้ของแคดดี้มีความสำคัญน้อยกว่าสนามที่ต้องใช้เทคนิคมากกว่านี้ สนามแทบไม่แออัดแม้ในวันเสาร์อาทิตย์ ซึ่งช่วยให้จังหวะการเล่นผ่อนคลายตลอดทั้งรอบ`,
        tips: `Prime City เป็นสนามที่เหมาะอย่างยิ่งสำหรับผู้ที่มาเล่นกอล์ฟในประเทศไทยเป็นครั้งแรก หรือนักกอล์ฟที่ต้องการฟื้นสภาพหลังเจอสนามที่ท้าทายกว่ามาหลายวัน ควรจองทางโทรศัพท์ (+66 98 831 6460) เพราะช่องทางออนไลน์ของสนามมีจำกัด แพ็กเกจรวมทุกอย่างวันธรรมดาราคา 1,050 บาท ซึ่งรวมแคดดี้และรถกอล์ฟแล้ว ถือว่าคุ้มค่าเป็นพิเศษสำหรับสนามที่มีระยะขนาดนี้ การขับรถจากกรุงเทพฯ มุ่งไปทางทิศตะวันออกเฉียงเหนือใช้ทางหลวงหมายเลข 305 (ถนนรังสิต-องครักษ์) การจราจรเบาบางหากเลี่ยงชั่วโมงเร่งด่วนของกรุงเทพฯ ส่วนอัตราค่าบริการวันเสาร์อาทิตย์เพิ่มขึ้นเพียงเล็กน้อยเป็น 1,200 บาท และยังมีอุทยานน้ำตกและป่าสงวนแห่งชาติของนครนายกอยู่ใกล้ ๆ สำหรับการเที่ยวแบบเต็มวัน`,
        location_and_access: `Prime City Golf Club ตั้งอยู่ที่ตำบลบางปลากด อำเภอองครักษ์ จังหวัดนครนายก 26120 สนามอยู่ห่างจากใจกลางกรุงเทพฯ ไปทางทิศตะวันออกเฉียงเหนือประมาณ 80 กิโลเมตร ใช้เวลาขับรถราว 90 นาทีผ่านทางหลวงหมายเลข 305 ไม่มีระบบขนส่งสาธารณะที่ใช้งานได้จริง จึงจำเป็นต้องใช้รถส่วนตัว แท็กซี่ หรือ Grab จากท่าอากาศยานสุวรรณภูมิใช้เวลาเดินทางมายังสนามประมาณ 80 นาที ผ่านทางหลวงบางนา-ตราดและทางหลวงหมายเลข 305`,
        rental_cta_context: `ด้วยราคา 1,050 บาทแบบรวมทุกอย่าง Prime City ก็คุ้มค่าเป็นพิเศษอยู่แล้ว และเมื่อใช้ไม้กอล์ฟของ LENGOLF ที่ส่งถึงโรงแรมของคุณในกรุงเทพฯ คุณก็ไม่ต้องลุ้นกับความไม่แน่นอนของการเช่าไม้ที่สนาม และได้ลงเล่นด้วยอุปกรณ์ระดับพรีเมียมในเช้าวันสบาย ๆ ที่นครนายก`,
      },
    },
    ko: {
      title: `Prime City Golf Club 올인클루시브 패키지 — 나콘나욕 18홀 코스 가이드`,
      meta_description: `Prime City Golf Club 올인클루시브 패키지는 평일 1,050바트로, 그린피에 캐디와 카트까지 포함돼요. 방콕에서 북동쪽으로 약 80km, 차로 약 90분 거리인 6,782야드 파 72 코스 안내와, 방콕 호텔로 배달되는 LENGOLF 클럽 대여를 정리했어요.`,
      prose: {
        overview: `Prime City Golf Club은 나콘나욕주 Ongkharak 지구의 경치 좋은 자리에 들어선 코스예요. 방콕에서 북동쪽으로 약 80km 떨어져 있어 차로 약 90분이 걸리는데, 그 대신 정말로 붐비지 않는 코스와 방콕 외곽 지역에서도 손꼽히게 경쟁력 있는 요금 구성을 만나게 됩니다. 1993년에 문을 연 18홀 파 72 레이아웃은 전장 6,782야드이고, 평탄한 농지 위에 조성돼 페어웨이가 넓고 관대하며 고저차도 거의 없어요. 이 코스의 평판은 명확히 초보자와 중간 핸디캡 골퍼에게 친화적이라는 것입니다. 시야가 트여 있고 풀어 가기 쉬우며 압박감이 없어서, 혹독한 시험대보다는 즐거운 사교 라운딩을 원하는 골프 모임에 인기가 많아요. 평일 1,050바트 올인클루시브 패키지(그린피, 캐디, 카트 포함)와 꾸준히 관리되는 코스 컨디션이 맞물려, Prime City 코스는 방콕 외곽 지방의 정규 길이 코스 가운데 값어치가 나은 축에 듭니다.`,
        layout_and_experience: `평탄한 파크랜드 레이아웃은 넓은 페어웨이와 많지 않은 러프가 특징이라, 티에서 칠 때 공간이 넉넉해요. 장애물은 크지 않습니다. 작은 워터 해저드 몇 개와 전략적으로 배치된 벙커 정도이고, 무게중심은 난도보다 접근성 쪽에 확실히 기울어 있어요. 파 5 홀은 장타자라면 두 번 만에 그린을 노려볼 만하고, 파 3 홀은 감당할 만한 거리의 단순한 아이언 샷입니다. 그린은 관리 상태가 좋고 중간 정도의 빠르기로 굴러갑니다. 카트 도로가 코스 전체에 깔려 있고, 의무인 카트 덕분에 라운딩이 효율적으로 흘러가요. 캐디는 현지 출신이고 아는 것도 많지만, 루팅이 복잡하지 않은 만큼 클럽 선택 조언의 비중은 더 기술적인 코스에서만큼 크지는 않습니다. 주말에도 붐비는 일이 드물어서, 라운딩 내내 여유로운 진행이 이어져요.`,
        tips: `Prime City 코스는 태국 골프가 처음인 분이나, 며칠 동안 더 까다로운 코스에서 시달린 뒤 기력을 되찾고 싶은 골퍼에게 안성맞춤이에요. 온라인 창구가 제한적이니 전화(+66 98 831 6460)로 예약하세요. 캐디와 카트가 포함된 평일 1,050바트 올인클루시브 패키지는 이 정도 길이의 코스치고 대단히 좋은 값입니다. 방콕에서는 북동쪽으로 305번 국도(Rangsit–Ongkarak Road)를 타고 가며, 방콕 러시아워만 피하면 차가 거의 막히지 않아요. 주말 요금도 1,200바트로 아주 조금만 오릅니다. 나콘나욕주의 폭포 공원과 국유림도 가까워서 하루 나들이로 묶기 좋아요.`,
        location_and_access: `Prime City Golf Club은 나콘나욕주 Ongkharak 지구의 Bang Pla Kot, 우편번호 26120에 자리합니다. 방콕 도심에서 북동쪽으로 약 80km 떨어져 있고, 305번 국도를 이용해 차로 약 90분 걸려요. 현실적인 대중교통이 없어서 자가용이나 택시, Grab이 필요합니다. 수완나품 공항에서는 Bang Na–Trat 고속도로와 305번 국도를 거쳐 약 80분이면 코스에 닿습니다.`,
        rental_cta_context: `1,050바트에 모두 포함이라 Prime City 코스는 그 자체로 이미 값이 아주 좋아요. 여기에 LENGOLF 클럽을 방콕 호텔로 배달받으면 현장 대여의 불확실함을 피하면서, 여유로운 나콘나욕의 아침을 프리미엄 장비로 플레이할 수 있습니다.`,
      },
    },
    zh: {
      title: `Prime City Golf Club全包套餐 — 那空那育18洞球场攻略与球杆租借`,
      meta_description: `Prime City Golf Club全包套餐平日1,050泰铢，果岭费、球童与球车全包。球场位于那空那育府Ongkharak县，在曼谷东北约80公里、车程约90分钟处，全长6,782码、标准杆72，另有送抵曼谷酒店的LENGOLF球杆租借。`,
      prose: {
        overview: `Prime City Golf Club坐落在那空那育府Ongkharak县风景宜人的一片土地上，距曼谷东北约80公里，开车约90分钟。这段路程换来的是一座真正不拥挤的球场，以及在曼谷外围地区属于最具竞争力之列的收费结构。球场1993年建成，18洞、标准杆72、全长6,782码，建在平坦的农田之上，球道宽阔宽容，高低起伏极小。它的口碑明确就是对初学者和中差点球手友好：开阔、好走、没有压力，因此很受那些想打一场轻松社交球、而不是硬碰硬考验的球友团体欢迎。平日1,050泰铢的全包套餐（含果岭费、球童和球车）加上稳定的养护水准，让Prime City成为曼谷外府一带全长球场里性价比较高的一座。`,
        layout_and_experience: `平坦的园林式布局以宽阔的球道和不多的长草为特点，开球后有充裕的落球空间。障碍并不算重——几处小型水障碍，以及几个位置讲究的沙坑——重心明确放在亲和力而非难度上。5杆洞对长打者而言两杆可攻，3杆洞则是距离可控、直来直去的铁杆球。果岭养护良好，速度中等。球车道贯穿全场，强制使用的球车让打球节奏推进得很有效率。球童都是本地人，也很懂行，不过路线并不复杂，他们在选杆建议上的分量不如在技术性更强的球场那么关键。即便周末，球场也很少拥挤，整轮下来节奏都很放松。`,
        tips: `对第一次来泰国打球的人，或者刚在几座要求更高的球场上熬过几天、想缓一缓的球手来说，Prime City都是理想之选。球场的线上渠道有限，建议打电话（+66 98 831 6460）预订。平日1,050泰铢的全包套餐——含球童与球车——对这个长度的球场而言是相当出色的价格。从曼谷出发向东北，走305号公路（Rangsit–Ongkarak Road）；只要避开曼谷的上下班高峰，路上车流很少。周末价格也只小幅上调到1,200泰铢。那空那育府的瀑布公园和国家林区就在附近，可以凑成一整天的行程。`,
        location_and_access: `Prime City Golf Club位于那空那育府Ongkharak县的Bang Pla Kot，邮编26120。球场距曼谷市中心东北约80公里，走305号公路开车约90分钟。这里没有可行的公共交通，需要自驾、打车或叫Grab。从素万那普机场经Bang Na–Trat公路转305号公路，约80分钟可以抵达球场。`,
        rental_cta_context: `1,050泰铢全包，Prime City本身就已经非常划算——再让LENGOLF把球杆送到你在曼谷的酒店，你就不必赌现场租借靠不靠得住，可以带着高级装备，在那空那育度过一个轻松的早晨。`,
      },
    },
    ja: {
      title: `Prime City Golf Club（ナコンナヨック）— パッケージ料金・コース紹介・クラブレンタル`,
      meta_description: `オールインクルーシブのパッケージ料金は平日1,050THBで、グリーンフィーにキャディーとカートが含まれます。Prime City Golf Clubはバンコクから北東へ約80km、車で約90分、6,782ヤード・パー72の18ホールコースです。バンコクのホテルへ届くLENGOLFのクラブレンタルもご案内します。`,
      prose: {
        overview: `Prime City Golf Clubは、ナコンナヨック県オンカラック郡の風光明媚な立地にあるコースです。バンコクから北東へ約80km、車で約90分の道のりですが、その先には本当に混み合わないコースと、バンコク郊外エリアでも屈指の競争力ある料金体系が待っています。1993年の開業で、18ホール・パー72のレイアウトは6,782ヤード。平坦な農地の上に造られており、フェアウェイは広く寛容で、高低差もほとんどありません。評判ははっきりと、初心者と中級ハンディキャップのプレーヤーに優しいコースというもの。開けていて攻略しやすく、プレッシャーがないため、厳しいテストよりも楽しい親睦ラウンドを求めるゴルフ仲間のグループに人気です。平日1,050THBのオールインクルーシブパッケージ（グリーンフィー、キャディー、カート込み）と安定したコースコンディションが組み合わさり、Prime Cityはバンコク近郊の地方にあるフルレングスコースの中でも値打ちのあるほうのひとつとなっています。`,
        layout_and_experience: `平坦なパークランドのレイアウトは、広いフェアウェイと限られたラフが特徴で、ティーショットには十分なスペースがあります。障害は控えめで、小さなウォーターハザードがいくつかと、戦略的に配置されたバンカーがある程度。重点は難易度よりも親しみやすさに、はっきりと置かれています。パー5はロングヒッターなら2打で届き、パー3は無理のない距離のシンプルなアイアンショットです。グリーンは手入れが行き届き、中程度のスピードで転がります。カートパスはコース全体に通っており、必須のカートがラウンドを効率よく進めてくれます。キャディーは地元出身で知識も豊富ですが、ルーティングが複雑でない分、クラブ選択のアドバイスの重要性はよりテクニカルなコースほどではありません。週末でも混雑することはめったになく、ラウンドを通してゆったりとしたペースが保たれます。`,
        tips: `Prime Cityは、タイでのゴルフが初めての方や、要求の厳しいコースで数日を過ごした後に立て直したいゴルファーにうってつけのコースです。オンラインでの窓口が限られているため、予約は電話（+66 98 831 6460）でどうぞ。キャディーとカートを含む平日1,050THBのオールインクルーシブパッケージは、この長さのコースとしては際立ったコストパフォーマンスです。バンコクからは北東へ、国道305号線（ランシット〜オンカラック道路）経由。バンコクのラッシュアワーを外せば交通量はごくわずかです。週末料金も1,200THBへとわずかに上がるだけ。ナコンナヨックの滝の公園や国有林も近く、1日かけての小旅行にもできます。`,
        location_and_access: `Prime City Golf Clubは、ナコンナヨック県オンカラック郡バーンプラーコット、郵便番号26120に位置しています。バンコク中心部から北東へ約80km、国道305号線経由で車で約90分です。実用的な公共交通機関はなく、自家用車、タクシー、またはGrabが必要になります。スワンナプーム空港からは、バンナー・トラート・ハイウェイと国道305号線を経由して約80分でアクセスできます。`,
        rental_cta_context: `すべて込みで1,050THBというPrime Cityは、それだけですでに際立った値打ちがあります。さらにLENGOLFのクラブをバンコクのホテルまでお届けすれば、現地レンタルの不確かさを避けて、ゆったりとしたナコンナヨックの朝をプレミアムな道具でプレーできます。`,
      },
    },
  },
  status: 'published',
  published_at: '2026-04-20',
}
