import type { GolfCourse } from '@/types/golf-courses'

export const course: GolfCourse = {
  slug: 'gassan-khuntan-golf-resort',
  region: 'chiang-mai',
  name: `Gassan Khuntan Golf & Resort`,
  province: `Lamphun`,
  designer: null,
  holes: 27,
  par: 72,
  year_opened: null,
  green_fee_weekday_thb: 4200,
  green_fee_weekend_thb: 4200,
  // All-in package, per this file's own EN prose: 4,200 THB high-season all-inclusive rate. The rate
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
  website: 'https://www.gassangolf.com/gassan-khuntan/en',
  phone: '+66 53 507 006',
  latitude: 18.4521,
  longitude: 98.9876,
  distance_from_bangkok_km: 700,
  drive_time_from_bangkok_min: null,
  google_maps_url: null,
  club_rental_available: true,
  club_rental_fee_thb: null,
  club_rental_brands: null,
  schema_markup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"GolfCourse\",\n  \"name\": \"Gassan Khuntan Golf & Resort\",\n  \"url\": \"https://len.golf/golf-courses/chiang-mai/gassan-khuntan-golf-resort\",\n  \"description\": null,\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"addressLocality\": \"Lamphun\",\n    \"addressCountry\": \"TH\"\n  },\n  \"geo\": {\n    \"@type\": \"GeoCoordinates\",\n    \"latitude\": 18.4521,\n    \"longitude\": 98.9876\n  },\n  \"telephone\": \"+66 53 507 006\",\n  \"priceRange\": \"฿฿฿\",\n  \"sameAs\": [\n    \"https://www.gassangolf.com/gassan-khuntan/en\"\n  ],\n  \"amenityFeature\": [\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Driving Range\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Caddie Required\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Golf Cart\",\n      \"value\": true\n    }\n  ]\n}",
  prose: {
    overview: `Gassan Khuntan Golf & Resort is a 27-hole mountain forest course set within Lamphun province, approximately 45 minutes by road south of Chiang Mai International Airport. Operated by the Gassan Golf Group — the dominant golf brand in Northern Thailand — the course is built across three distinct nine-hole loops named White Bridge (Course A), River (Course B), and Mountain (Course C). The main 18-hole combination plays to par 72 over approximately 7,062 yards. The setting is one of the most dramatically natural in Northern Thailand: the course is ringed by the forested ridges of Doi Khuntan National Park, and several holes play with the mountain silhouette as a constant backdrop. This remote, mountainous atmosphere distinguishes Gassan Khuntan from the more accessible resort courses nearer Chiang Mai city and gives it a reputation as the wildest and most adventurous of the Gassan Group properties. Golfers seeking a change of pace from valley parkland layouts will find the rugged terrain and elevated setting a compelling alternative.`,
    layout_and_experience: `The three nine-hole loops each have a different character. The White Bridge nine features the course's most striking water feature — an island green accessed by a distinctive white footbridge — along with sharp doglegs and elevated tee boxes that expose multiple layers of mountain scenery. The River nine follows the contours of a natural waterway, with several fairways squeezed between treelines and the stream corridor; accuracy is at a premium, as wayward shots find either the water or thick rough. The Mountain nine is the most demanding of the three, playing through steeper terrain with blind tee shots and dramatic elevation changes that force players to adjust their club selection on almost every hole.

Throughout, the course uses the natural topography rather than heavy earthmoving, so fairways roll and bend with the land. Grass bunkers and steep-edged hazards are the primary defense — traditional sand bunkers are less prominent than at the lower-elevation resort courses. The greens are firm and true, with subtle breaks that reward local caddie advice. The caddie corps at Gassan Khuntan is well-regarded for their knowledge of a layout that demands experience to score well on.

Pace of play can be slower in peak season (November–March) when the course is busiest. Morning tee times from 7:00–8:00am are strongly recommended to secure comfortable pacing and the coolest temperatures before midday heat builds through the mountain clearings.`,
    tips: `Book an early morning tee time (7:00–8:00am) to enjoy the mountain mist views and avoid the hottest part of the day. The 4,200 THB all-inclusive rate covers the high season (November–March); confirm low-season pricing (April–October) directly with the resort as rates may be lower. Caddie tips of 300–500 THB per round are customary and much appreciated — caddies at this course are essential guides given the terrain. The Mountain nine is best left for the final loop if energy permits, as it is the most physically demanding. Bring sunscreen and a rain jacket: afternoon cloud cover over the Khuntan ridge can bring brief showers even in the dry season. The resort has a restaurant at the clubhouse — the terrace view is one of the best at any Chiang Mai-area course.`,
    location_and_access: `Gassan Khuntan Golf & Resort is located in Mae Tha, Lamphun province, approximately 45 minutes south of Chiang Mai International Airport (CNX) and roughly one hour from central Chiang Mai. Visitors from Bangkok fly to CNX (approximately 1 hour 10 minutes from Suvarnabhumi or Don Mueang) — driving the 700 kilometres from Bangkok is not practical for a golf trip. The resort is accessible by private car or Grab taxi from Chiang Mai city; the drive follows Route 11 (the old Chiang Mai–Lamphun road) south through Lamphun town before turning toward the mountains.`,
    rental_cta_context: `Heading to Gassan Khuntan Golf & Resort for a round in the mountains of Northern Thailand? Rent premium clubs in Bangkok — delivered to your hotel before you fly — so you can travel light and skip the airline baggage fees.`,
  },
  locales: {
    en: {
      title: `Gassan Khuntan Golf & Resort — Green Fees, Course Guide & Golf Club Rentals`,
      meta_description: `Gassan Khuntan Golf & Resort green fees, course overview, tips, and how to arrange golf club rentals delivered to your Bangkok hotel.`,
    },
    th: {
      title: `Gassan Khuntan Golf & Resort ลำพูน — แพ็กเกจรวมทุกอย่าง รีวิวสนาม และเช่าไม้กอล์ฟ`,
      meta_description: `แพ็กเกจรวมทุกอย่างที่ Gassan Khuntan Golf & Resort อยู่ที่ 4,200 บาทในช่วงไฮซีซัน (พฤศจิกายน-มีนาคม) สนามภูเขา 27 หลุมในจังหวัดลำพูน ห่างจากท่าอากาศยานเชียงใหม่ราว 45 นาที พร้อมบริการเช่าไม้กอล์ฟส่งถึงโรงแรมในกรุงเทพฯ`,
      prose: {
        overview: `Gassan Khuntan Golf & Resort เป็นสนามกอล์ฟ 27 หลุมกลางป่าเขาในจังหวัดลำพูน ห่างจากท่าอากาศยานนานาชาติเชียงใหม่ลงมาทางใต้ประมาณ 45 นาทีโดยรถยนต์ สนามดำเนินการโดย Gassan Golf Group ซึ่งเป็นแบรนด์กอล์ฟที่ครองตลาดภาคเหนือของไทย และวางผังเป็นสามคอร์ส คอร์สละ 9 หลุมที่มีบุคลิกต่างกัน ได้แก่ White Bridge (คอร์ส A), River (คอร์ส B) และ Mountain (คอร์ส C) การจับคู่ 18 หลุมหลักเล่นที่พาร์ 72 ระยะประมาณ 7,062 หลา ทำเลของสนามจัดเป็นหนึ่งในทำเลที่เป็นธรรมชาติอย่างน่าตื่นตาที่สุดในภาคเหนือ เพราะถูกโอบล้อมด้วยสันเขาที่ปกคลุมด้วยป่าของอุทยานแห่งชาติดอยขุนตาล และหลายหลุมมีเงาทิวเขาเป็นฉากหลังตลอดการเล่น บรรยากาศห่างไกลกลางภูเขาแบบนี้ทำให้ Gassan Khuntan ต่างจากสนามรีสอร์ตที่เข้าถึงง่ายกว่าใกล้ตัวเมืองเชียงใหม่ และทำให้สนามได้ชื่อว่าดิบและผจญภัยที่สุดในบรรดาสนามของ Gassan Group นักกอล์ฟที่อยากเปลี่ยนบรรยากาศจากสนามพาร์กแลนด์ในหุบเขาจะพบว่าภูมิประเทศขรุขระและทำเลบนที่สูงแห่งนี้เป็นทางเลือกที่น่าสนใจ`,
        layout_and_experience: `คอร์ส 9 หลุมทั้งสามมีบุคลิกต่างกัน คอร์ส White Bridge มีอุปสรรคน้ำที่โดดเด่นที่สุดของสนาม คือกรีนเกาะกลางน้ำที่เข้าถึงได้ด้วยสะพานเดินเท้าสีขาวอันเป็นเอกลักษณ์ พร้อมด้วยหลุมด็อกเลกที่หักมุมคมและแท่นทีที่ยกสูงซึ่งเปิดให้เห็นทิวเขาซ้อนกันหลายชั้น คอร์ส River ทอดตัวไปตามแนวลำน้ำธรรมชาติ มีแฟร์เวย์หลายหลุมถูกบีบอยู่ระหว่างแนวต้นไม้กับแนวลำธาร ความแม่นยำจึงสำคัญมาก เพราะลูกที่ออกนอกทางไม่ลงน้ำก็ไปอยู่ในรัฟหนา ส่วนคอร์ส Mountain เป็นคอร์สที่ท้าทายที่สุดในสามคอร์ส เพราะเล่นผ่านภูมิประเทศที่ชันกว่า มีทีช็อตแบบมองไม่เห็นจุดตกและความต่างระดับที่ชัดเจน จนผู้เล่นต้องปรับการเลือกไม้แทบทุกหลุม

ตลอดทั้งสนามใช้ภูมิประเทศตามธรรมชาติมากกว่าการปรับหน้าดินขนานใหญ่ แฟร์เวย์จึงลาดเอียงและคดเคี้ยวไปตามผืนดิน อุปสรรคหลักคือบังเกอร์หญ้าและแฮซาร์ดขอบชัน ส่วนบังเกอร์ทรายแบบดั้งเดิมมีให้เห็นน้อยกว่าสนามรีสอร์ตที่อยู่ระดับความสูงต่ำกว่า กรีนแน่นและลูกวิ่งสม่ำเสมอ มีเบรกละเอียดอ่อนที่ตอบแทนผู้ที่ฟังคำแนะนำของแคดดี้ประจำสนาม ทีมแคดดี้ของ Gassan Khuntan ได้รับคำชมเรื่องความรู้ความเข้าใจในเลย์เอาต์ที่ต้องอาศัยประสบการณ์จึงจะทำสกอร์ได้ดี

จังหวะการเล่นอาจช้าลงในช่วงไฮซีซัน (พฤศจิกายน-มีนาคม) ที่สนามคึกคักที่สุด แนะนำอย่างยิ่งให้จองทีไทม์ช่วงเช้า 07.00-08.00 น. เพื่อให้ได้จังหวะการเล่นที่สบายและอากาศที่เย็นที่สุด ก่อนที่ความร้อนช่วงกลางวันจะสะสมขึ้นตามที่โล่งกลางภูเขา`,
        tips: `จองทีไทม์ช่วงเช้าตรู่ (07.00-08.00 น.) เพื่อชมวิวหมอกบนภูเขาและเลี่ยงช่วงที่ร้อนที่สุดของวัน อัตรา 4,200 บาทเป็นราคาแบบรวมทุกอย่างของช่วงไฮซีซัน (พฤศจิกายน-มีนาคม) หากเดินทางช่วงโลว์ซีซัน (เมษายน-ตุลาคม) ควรสอบถามราคากับทางรีสอร์ตโดยตรง เพราะอัตราอาจถูกกว่า ทิปแคดดี้ 300-500 บาทต่อรอบเป็นธรรมเนียมปฏิบัติและเป็นที่ชื่นชมอย่างมาก เพราะแคดดี้ของสนามนี้เป็นผู้นำทางที่ขาดไม่ได้เมื่อดูจากสภาพภูมิประเทศ ควรเก็บคอร์ส Mountain ไว้เป็นลูปสุดท้ายหากยังมีแรงพอ เพราะเป็นคอร์สที่ใช้กำลังกายมากที่สุด อย่าลืมครีมกันแดดและเสื้อกันฝน เพราะเมฆที่ปกคลุมสันเขาขุนตาลในช่วงบ่ายอาจทำให้มีฝนตกสั้น ๆ ได้แม้ในหน้าแล้ง ที่คลับเฮาส์ของรีสอร์ตมีร้านอาหาร และวิวจากระเบียงจัดเป็นหนึ่งในวิวที่ดีที่สุดในบรรดาสนามย่านเชียงใหม่`,
        location_and_access: `Gassan Khuntan Golf & Resort ตั้งอยู่ที่แม่ทา จังหวัดลำพูน ห่างจากท่าอากาศยานนานาชาติเชียงใหม่ (CNX) ลงมาทางใต้ประมาณ 45 นาที และห่างจากใจกลางเมืองเชียงใหม่ราวหนึ่งชั่วโมง ผู้ที่เดินทางจากกรุงเทพฯ ใช้วิธีบินไป CNX (ประมาณ 1 ชั่วโมง 10 นาทีจากสนามบินสุวรรณภูมิหรือสนามบินดอนเมือง) เพราะการขับรถระยะทาง 700 กิโลเมตรจากกรุงเทพฯ ไม่สะดวกในทางปฏิบัติสำหรับทริปกอล์ฟ จากตัวเมืองเชียงใหม่สามารถเดินทางด้วยรถส่วนตัวหรือ Grab ได้ โดยเส้นทางใช้ทางหลวงหมายเลข 11 (ถนนเชียงใหม่-ลำพูนสายเก่า) ลงใต้ผ่านตัวเมืองลำพูน ก่อนเลี้ยวเข้าสู่แนวเขา`,
        rental_cta_context: `กำลังจะไปออกรอบท่ามกลางขุนเขาภาคเหนือที่ Gassan Khuntan Golf & Resort อยู่ใช่ไหม เช่าไม้กอล์ฟคุณภาพพรีเมียมที่กรุงเทพฯ พร้อมบริการส่งถึงโรงแรมก่อนคุณขึ้นเครื่อง ให้คุณเดินทางแบบเบาสบายและไม่ต้องเสียค่าธรรมเนียมโหลดกระเป๋ากอล์ฟกับสายการบิน`,
      },
    },
    ko: {
      title: `Gassan Khuntan Golf & Resort 올인클루시브 패키지 — 27홀 산악 코스 가이드`,
      meta_description: `Gassan Khuntan Golf & Resort 올인클루시브 패키지는 성수기(11~3월)에 4,200바트예요. 람푼주 산속에 자리한 27홀 코스로 치앙마이 국제공항에서 남쪽으로 약 45분 거리이고, 비행기를 타기 전 방콕 호텔로 배달되는 LENGOLF 클럽 대여도 함께 안내해요.`,
      prose: {
        overview: `Gassan Khuntan Golf & Resort 코스는 람푼주 산악 삼림 지대에 자리한 27홀 코스로, 치앙마이 국제공항에서 남쪽으로 차로 약 45분 거리예요. 태국 북부를 주름잡는 골프 브랜드인 Gassan Golf Group이 운영하며, 코스는 White Bridge(A 코스), River(B 코스), Mountain(C 코스) 세 개의 개성 뚜렷한 9홀 루프로 짜여 있습니다. 주력이 되는 18홀 조합은 파 72에 길이는 약 7,062야드예요. 이곳의 입지는 태국 북부에서도 가장 극적으로 자연 그대로인 곳 가운데 하나입니다. Doi Khuntan 국립공원의 숲으로 덮인 능선이 코스를 둘러싸고 있고, 여러 홀에서 산의 실루엣이 내내 배경으로 따라옵니다. 이렇게 외지고 산악다운 분위기 덕분에 Gassan Khuntan 코스는 치앙마이 시내에 더 가깝고 접근성도 좋은 리조트 코스들과 구분되고, Gassan Group의 여러 코스 가운데 가장 거칠고 모험적이라는 평을 얻고 있어요. 계곡 파크랜드 레이아웃에서 벗어나 분위기를 바꾸고 싶은 골퍼라면 이 험한 지형과 높은 곳에 앉은 입지가 매력적인 대안이 될 겁니다.`,
        layout_and_experience: `세 개의 9홀 루프는 각각 성격이 달라요. White Bridge 나인에는 이 코스에서 가장 인상적인 워터 해저드가 있습니다. 독특한 하얀 보도교를 건너 들어가는 아일랜드 그린이에요. 여기에 날카롭게 꺾이는 도그레그와, 산 능선이 여러 겹으로 펼쳐지는 높은 티박스가 더해집니다. River 나인은 자연 수로의 굴곡을 따라가는데, 여러 페어웨이가 나무 라인과 개울 사이에 좁게 끼어 있어요. 빗나간 샷은 물에 빠지거나 두꺼운 러프로 들어가니 정확도가 무엇보다 중요합니다. Mountain 나인은 셋 중 가장 까다로워요. 더 가파른 지형을 지나며 블라인드 티샷과 큰 고저 차가 이어져, 거의 매 홀 클럽 선택을 다시 계산하게 만듭니다.

코스 전체가 대규모 토목 공사 대신 자연 지형을 그대로 살린 구성이라, 페어웨이가 땅의 결을 따라 굽이치고 흘러갑니다. 주된 방어 장치는 잔디 벙커와 가장자리가 가파른 해저드이고, 전통적인 모래 벙커는 고도가 낮은 리조트 코스들보다 덜 두드러져요. 그린은 단단하고 볼이 고르게 구르며, 미묘한 브레이크가 있어 현지 캐디의 조언이 큰 힘이 됩니다. Gassan Khuntan 코스의 캐디진은 좋은 스코어를 내려면 경험이 필요한 이 레이아웃을 잘 안다는 평가를 받아요.

성수기인 11~3월에는 코스가 가장 붐벼 경기 진행이 느려질 수 있어요. 오전 7~8시 티타임을 강력히 추천합니다. 여유로운 진행과 가장 시원한 기온을 확보할 수 있고, 산속 공터에 한낮의 열기가 쌓이기 전이기도 하니까요.`,
        tips: `이른 아침 티타임(오전 7~8시)을 잡으면 산안개가 깔린 풍경을 볼 수 있고 하루 중 가장 더운 시간대도 피할 수 있어요. 4,200바트라는 요금은 성수기(11~3월)의 올인클루시브 요금이고, 비수기(4~10월)에는 더 낮을 수 있으니 리조트에 직접 확인해 보세요. 라운드당 300~500바트의 캐디 팁은 관례이고 무척 고맙게 받아들여집니다. 이 지형에서는 캐디가 없어서는 안 될 길잡이거든요. 체력이 허락한다면 Mountain 나인은 마지막 루프로 남겨 두는 편이 좋아요. 세 루프 중 체력 소모가 가장 큽니다. 자외선 차단제와 비옷도 챙기세요. Khuntan 능선을 덮는 오후 구름은 건기에도 짧은 소나기를 뿌릴 수 있습니다. 리조트 클럽하우스에는 레스토랑이 있는데, 테라스에서 보이는 풍경은 치앙마이 일대 코스를 통틀어 손꼽히는 수준이에요.`,
        location_and_access: `Gassan Khuntan Golf & Resort는 람푼주 Mae Tha에 있고, 치앙마이 국제공항(CNX)에서 남쪽으로 약 45분, 치앙마이 도심에서는 한 시간쯤 걸려요. 방콕에서 오는 분은 CNX행 항공편을 이용하면 되고, 수완나품 공항이나 돈므앙 공항에서 약 1시간 10분 걸립니다. 방콕에서 700km를 차로 달리는 건 골프 여행으로는 현실적이지 않아요. 치앙마이 시내에서는 개인 차량이나 Grab 택시로 갈 수 있는데, 경로는 11번 국도(옛 치앙마이–람푼 도로)를 타고 남쪽으로 람푼 시내를 지난 뒤 산 쪽으로 꺾어 들어갑니다.`,
        rental_cta_context: `태국 북부의 산속에서 Gassan Khuntan Golf & Resort 라운딩을 계획하고 있다면, 방콕에서 프리미엄 클럽을 빌리는 방법이 편해요. 비행기를 타기 전 방콕 호텔까지 배달해 드리니, 짐을 가볍게 하고 항공사 수하물 요금도 아낄 수 있습니다.`,
      },
    },
    zh: {
      title: `Gassan Khuntan Golf & Resort全包套餐 — 南奔27洞山地球场攻略与球杆租借`,
      meta_description: `Gassan Khuntan Golf & Resort全包套餐在旺季（11月–3月）为4,200泰铢。这是一座位于南奔府山林间的27洞球场，距清迈国际机场以南约45分钟车程，另附登机前送抵曼谷酒店的LENGOLF球杆租借。`,
      prose: {
        overview: `Gassan Khuntan Golf & Resort是一座坐落在南奔府山地森林中的27洞球场，从清迈国际机场往南开车约45分钟即到。球场由泰国北部最具主导地位的高尔夫品牌Gassan Golf Group运营，由三组风格迥异的九洞环线组成：White Bridge（A场）、River（B场）与Mountain（C场）。主要的18洞组合为标准杆72杆，长度约7,062码。这里的环境是泰国北部最富自然野趣的场地之一——球场被Doi Khuntan国家公园覆满森林的山脊环抱，好几个球洞打起来都以山的轮廓为持续的背景。这种偏远的山地氛围让Gassan Khuntan有别于更靠近清迈市区、也更容易抵达的度假村球场，也为它赢得了Gassan Group旗下最野性、最富冒险感的名声。如果你想从谷地园林式布局换换口味，这片崎岖地形与高处的位置会是很有吸引力的另一种选择。`,
        layout_and_experience: `三组九洞环线各有各的性格。White Bridge那一组有全场最抢眼的水障碍——一座由别具特色的白色人行桥通往的岛型果岭——再加上急转的狗腿洞和抬高的发球台，把层层叠叠的山景一并铺开。River那一组顺着一条天然水道的走向延伸，好几条球道被树线与溪流走廊夹在中间，准度至关重要，打偏的球不是落水就是钻进厚草区。Mountain那一组是三者中最难的，穿行于更陡的地形，盲发球和剧烈的高低落差逼着球手几乎每一洞都要重新斟酌用杆。

整座球场依循天然地貌，而非大动土方，所以球道随着地势起伏蜿蜒。主要的防守来自草坑与边缘陡峭的障碍区，传统沙坑则不像海拔较低的度假村球场那样显眼。果岭坚实、滚动均匀，细微的坡度会回报那些听取本地球童建议的人。Gassan Khuntan的球童团队在这条需要经验才打得出好成绩的布局上，向来以熟悉地形著称。

旺季（11月–3月）球场最忙，打球节奏可能变慢。强烈建议订上午7:00–8:00的开球时间，既能确保从容的节奏和一天中最凉爽的气温，也能赶在正午热气从山间空地积聚之前开球。`,
        tips: `订一个清晨的开球时间（上午7:00–8:00），既能看到山间晨雾，也能避开一天里最热的时候。4,200泰铢是旺季（11月–3月）的全包价；若在淡季（4月–10月）前往，请直接向度假村确认价格，届时可能更低。每场球给球童300–500泰铢小费是惯例，也很受欢迎——在这样的地形里，球童是不可或缺的向导。若体力允许，Mountain那一组最好留到最后再打，它对体能的消耗最大。记得带防晒霜和雨衣：午后笼罩Khuntan山脊的云层，即使在旱季也可能带来短暂阵雨。度假村的会所设有餐厅，露台的视野在清迈一带的球场中数一数二。`,
        location_and_access: `Gassan Khuntan Golf & Resort位于南奔府的Mae Tha，在清迈国际机场（CNX）以南约45分钟车程，距清迈市中心约一小时。从曼谷前来通常是飞往CNX，自素万那普机场或廊曼机场出发约1小时10分钟；对一趟高尔夫行程来说，从曼谷开车走700公里并不现实。从清迈市区可以自驾或叫Grab前往，路线走11号公路（旧清迈–南奔公路）南下，穿过南奔市区后再转向山区。`,
        rental_cta_context: `打算去Gassan Khuntan Golf & Resort，在泰国北部的群山间打一场球吗？可以在曼谷租借高级球杆——登机前送到你在曼谷的酒店——这样就能轻装上路，也省下航空公司的球包托运费。`,
      },
    },
    ja: {
      title: `Gassan Khuntan Golf & Resort（ランプーン）— パッケージ料金・コース紹介・クラブレンタル`,
      meta_description: `オールインクルーシブのパッケージ料金はハイシーズン（11月〜3月）で4,200THB。Gassan Khuntan Golf & Resortはランプーン県の山あいに広がる27ホールで、チェンマイ国際空港から南へ車で約45分です。搭乗前にバンコクのホテルへ届くLENGOLFのクラブレンタルもご案内します。`,
      prose: {
        overview: `Gassan Khuntan Golf & Resortは、ランプーン県の山岳森林地帯に広がる27ホールのコース。チェンマイ国際空港から南へ車で約45分の位置にあります。運営はタイ北部で圧倒的な存在感を持つゴルフブランド、Gassan Golf Group。コースはWhite Bridge（Aコース）、River（Bコース）、Mountain（Cコース）という個性の異なる3つの9ホールループで構成されています。主軸となる18ホールの組み合わせはパー72、距離は約7,062ヤードです。ロケーションはタイ北部でも屈指の、自然そのままの劇的な佇まい。ドイ・クンターン国立公園の森に覆われた稜線に囲まれ、いくつものホールで山のシルエットが背景として付いてきます。この人里離れた山岳の空気が、チェンマイ市街に近く行きやすいリゾートコースとGassan Khuntanを分けており、Gassan Groupの各コースの中で最もワイルドで冒険的という評判をもたらしています。谷あいのパークランドレイアウトから趣を変えたいゴルファーには、この起伏の激しい地形と高所のロケーションが魅力的な選択肢になるはずです。`,
        layout_and_experience: `3つの9ホールループは、それぞれ性格が異なります。White Bridgeのナインには、コース随一の水景である島グリーンがあり、特徴的な白い歩道橋を渡ってアプローチします。加えて鋭いドッグレッグと高く構えたティーボックスが、幾重にも重なる山の景色を見せてくれます。Riverのナインは自然の水路の輪郭に沿って延び、いくつものフェアウェイが樹林帯と流れの回廊の間に挟まれています。曲げれば水か深いラフが待つため、正確性が何より重要です。Mountainのナインは3つの中で最も手ごわく、より急峻な地形を進みます。ブラインドのティーショットと大きな高低差が続き、ほぼ全ホールでクラブ選択の修正を迫られます。

全体を通じて、大規模な造成ではなく自然の地形を活かしているため、フェアウェイは土地の起伏に沿ってうねり、曲がっていきます。主な防御はグラスバンカーと縁の切り立ったハザードで、伝統的なサンドバンカーは標高の低いリゾートコースほど目立ちません。グリーンは硬くしっかりと転がり、微妙なブレークが地元キャディーの助言に報いてくれます。Gassan Khuntanのキャディー陣は、良いスコアを出すには経験を要するこのレイアウトへの理解で高く評価されています。

混雑するハイシーズン（11月〜3月）はプレー進行が遅くなることがあります。快適なペースと最も涼しい時間帯を確保するため、午前7:00〜8:00のティータイムを強くおすすめします。山あいの開けた場所に日中の暑さが溜まり始める前の時間帯です。`,
        tips: `早朝（午前7:00〜8:00）のティータイムを押さえると、山にかかる朝靄の景色を楽しめ、一日で最も暑い時間帯も避けられます。4,200THBという料金はハイシーズン（11月〜3月）のオールインクルーシブ料金です。ローシーズン（4月〜10月）はより安くなる可能性があるため、リゾートに直接ご確認ください。キャディーへのチップは1ラウンドあたり300〜500THBが慣例で、大変喜ばれます。この地形では、キャディーは欠かせない案内役だからです。体力に余裕があれば、Mountainのナインは最後のループに回すのがおすすめ。3つの中で最も体力を使います。日焼け止めとレインジャケットもお持ちください。午後にクンターンの稜線を覆う雲が、乾季でも短いにわか雨をもたらすことがあります。リゾートのクラブハウスにはレストランがあり、テラスからの眺めはチェンマイ周辺のコースの中でも屈指です。`,
        location_and_access: `Gassan Khuntan Golf & Resortはランプーン県のMae Thaに位置し、チェンマイ国際空港（CNX）から南へ約45分、チェンマイ中心部からはおよそ1時間です。バンコクからはCNXへの空路が基本で、スワンナプーム空港またはドンムアン空港から約1時間10分。バンコクから700kmを車で走るのは、ゴルフ旅行としては現実的ではありません。チェンマイ市内からは自家用車かGrabタクシーでアクセスでき、ルートは国道11号線（旧チェンマイ〜ランプーン道路）を南下し、ランプーンの町を抜けてから山へ向かって折れていきます。`,
        rental_cta_context: `タイ北部の山あいにあるGassan Khuntan Golf & Resortでのラウンドをご予定ですか。バンコクでプレミアムクラブをレンタルすれば、搭乗前にホテルまでお届けするので、身軽に移動でき、航空会社の手荷物料金も節約できます。`,
      },
    },
  },
  status: 'published',
  published_at: '2026-04-21',
}
