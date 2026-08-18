import type { GolfCourse } from '@/types/golf-courses'

export const course: GolfCourse = {
  slug: 'royal-hua-hin-golf-course',
  region: 'hua-hin',
  name: `Royal Hua Hin Golf Course`,
  province: `Prachuap Khiri Khan`,
  designer: `A. O. Robins`,
  holes: 18,
  par: 72,
  year_opened: 1924,
  green_fee_weekday_thb: 1000,
  green_fee_weekend_thb: 1350,
  caddie_fee_thb: 350,
  cart_fee_thb: 600,
  caddie_required: true,
  cart_required: false,
  driving_range: true,
  website: 'https://www.royalhuahingolfcourse.com',
  phone: '+66 32 512475',
  latitude: 12.5680,
  longitude: 99.9540,
  distance_from_bangkok_km: 225,
  drive_time_from_bangkok_min: 170,
  google_maps_url: null,
  club_rental_available: true,
  // Prose states 800 THB and calls it "one of the most affordable rates in Hua
  // Hin". That comparative holds at 800 (2nd cheapest of the 11 hua-hin
  // courses) and is false at 1500 (joint most expensive), so the prose is
  // internally consistent and the old typed value contradicted the same file.
  club_rental_fee_thb: 800,
  club_rental_brands: null,
  schema_markup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"GolfCourse\",\n  \"name\": \"Royal Hua Hin Golf Course\",\n  \"url\": \"https://len.golf/golf-courses/hua-hin/royal-hua-hin-golf-course\",\n  \"description\": null,\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"addressLocality\": \"Hua Hin\",\n    \"addressRegion\": \"Prachuap Khiri Khan\",\n    \"addressCountry\": \"TH\"\n  },\n  \"geo\": {\n    \"@type\": \"GeoCoordinates\",\n    \"latitude\": 12.5680,\n    \"longitude\": 99.9540\n  },\n  \"telephone\": \"+66 32 512475\",\n  \"priceRange\": \"฿฿\",\n  \"sameAs\": [\n    \"https://maps.google.com/?q=12.5680,99.9540\",\n    \"https://www.royalhuahingolfcourse.com\"\n  ],\n  \"amenityFeature\": [\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Driving Range\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Caddie Required\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Golf Cart\",\n      \"value\": false\n    }\n  ]\n}",
  prose: {
    overview: `Royal Hua Hin Golf Course holds a singular place in Thai sporting history as the country's oldest golf course and the first ever built in the Kingdom. The story begins in 1919, when Scottish railway engineer A. O. Robins — serving as the Phetchaburi Railway Officer — laid out the first nine holes in the grounds adjacent to what is now Hua Hin Railway Station. The full 18 holes were completed in 1924, and the course celebrated its centenary in 2024. At 6,678 yards from the white tees, par 72, it is a compact traditional layout by modern standards, but the combination of limestone cliff outcroppings, mature tropical trees, and undulating fairways gives it a character that newer, longer courses cannot replicate. Green fees are among the most accessible in the region: 1,000 THB on weekdays and 1,350 THB on weekends. The course hosts prestige amateur events including the Singha Thailand Junior World Golf Championship and the Singha-SAT Thai LPGA Masters, confirming that its historical standing is matched by genuine playing credentials.`,
    layout_and_experience: `Royal Hua Hin's layout reflects its British parkland origins in almost every detail. The fairways are tree-lined and relatively tight by contemporary standards, and the course requires accurate ball-striking rather than power. The defining features are the dramatic limestone outcrops — ancient coral reef formations — that emerge from the landscape on several holes, forcing precise lines off the tee and adding a visual character wholly unique in Thai golf. Mature flame trees, frangipani, and bougainvillea border many holes, making the course especially photogenic during the flowering season. The par-3 holes are a particular highlight, several of them requiring a precise carry to elevated or well-bunkered greens. From the red tees the course plays to 5,713 yards, making it genuinely accessible for mid-to-high handicappers. The railway line adjacent to the course adds an atmospheric backdrop — hearing the Bangkok-bound train pass during your round is a reminder of the course's century-long connection to the town. Some reviewers note that course conditioning is not to the standard of the premium resort courses in the area, but the layout and its history more than compensate for any minor inconsistencies in the surfaces.`,
    tips: `Visit Royal Hua Hin in the morning to avoid both the midday heat and the afternoon sea breezes that can complicate club selection on the exposed holes. The best conditions are from November to February, when temperatures are cooler and rainfall is minimal. Weekday rounds are noticeably quieter than weekends, when the course attracts local members and weekend golfers from Bangkok — if pace of play is a priority, book a weekday tee time early in the morning. Caddies at Royal Hua Hin are experienced with the subtleties of the old layout and their local knowledge is genuinely valuable on the trickier pin positions. A caddie tip of 400 THB is customary. The on-site driving range is useful for a warm-up, and club rental is available at 800 THB — one of the most affordable rates in Hua Hin. Wear shorts and lightweight clothing; the course has no dress code beyond smart casual.`,
    location_and_access: `Royal Hua Hin Golf Course is located in the heart of Hua Hin town, immediately adjacent to the famous Hua Hin Railway Station, approximately 225 kilometres south of Bangkok. From Bangkok, the drive takes around two hours and 50 minutes via Highway 4. The course is walkable from many hotels in central Hua Hin — a five- to ten-minute tuk-tuk or Grab ride from most town-centre accommodation. Direct trains from Hua Lamphong station in Bangkok stop at Hua Hin station, making this one of the few Thai golf courses accessible by rail.`,
    rental_cta_context: `Heading to Royal Hua Hin Golf Course? LENGOLF offers quality rental sets so you can play this historic century-old layout without the hassle of transporting clubs from Bangkok.`,
  },
  locales: {
    en: {
      title: `Royal Hua Hin Golf Course — Green Fees, Course Guide & Golf Club Rentals`,
      meta_description: `Play Royal Hua Hin Golf Course, Thailand's oldest golf course, from 1,000 THB weekday. 18 holes, par 72. Rent clubs from LENGOLF and travel light from Bangkok.`,
    },
    th: {
      title: `Royal Hua Hin Golf Course หัวหิน — ค่ากรีนฟี รีวิวสนาม และเช่าไม้กอล์ฟ`,
      meta_description: `ค่ากรีนฟี Royal Hua Hin สนามกอล์ฟที่เก่าแก่ที่สุดของไทย อยู่ที่ 1,000 บาทวันธรรมดา และ 1,350 บาทวันเสาร์อาทิตย์ 18 หลุม พาร์ 72 พร้อมบริการเช่าไม้กอล์ฟส่งถึงโรงแรมในกรุงเทพฯ`,
      prose: {
        overview: `Royal Hua Hin Golf Course มีที่ทางเฉพาะตัวในประวัติศาสตร์กีฬาของไทย ในฐานะสนามกอล์ฟที่เก่าแก่ที่สุดของประเทศ และเป็นสนามแรกที่สร้างขึ้นในราชอาณาจักร เรื่องราวเริ่มต้นในปี 1919 เมื่อ A. O. Robins วิศวกรรถไฟชาวสก็อต ซึ่งขณะนั้นดำรงตำแหน่งเจ้าหน้าที่การรถไฟประจำเพชรบุรี ได้วางผัง 9 หลุมแรกบนพื้นที่ติดกับบริเวณที่ปัจจุบันคือสถานีรถไฟหัวหิน ก่อนจะสร้างจนครบทั้ง 18 หลุมในปี 1924 และสนามได้ฉลองครบรอบ 100 ปีในปี 2024 ด้วยระยะ 6,678 หลาจากแท่นทีสีขาว พาร์ 72 ถือเป็นเลย์เอาต์ดั้งเดิมที่กะทัดรัดเมื่อเทียบกับมาตรฐานปัจจุบัน แต่การผสมผสานระหว่างแนวผาหินปูน ต้นไม้เขตร้อนที่โตเต็มวัย และแฟร์เวย์ที่เป็นลูกคลื่น ทำให้สนามมีบุคลิกที่สนามใหม่กว่าและยาวกว่าไม่อาจลอกเลียนได้ ค่ากรีนฟีอยู่ในกลุ่มที่เข้าถึงได้ง่ายที่สุดของภูมิภาค คือ 1,000 บาทในวันธรรมดา และ 1,350 บาทในวันเสาร์อาทิตย์ สนามยังเป็นเจ้าภาพจัดการแข่งขันสมัครเล่นระดับสำคัญ ทั้ง Singha Thailand Junior World Golf Championship และ Singha-SAT Thai LPGA Masters ซึ่งยืนยันว่าสถานะทางประวัติศาสตร์ของสนามมาพร้อมกับคุณภาพการเล่นที่แท้จริง`,
        layout_and_experience: `เลย์เอาต์ของ Royal Hua Hin สะท้อนต้นกำเนิดแบบพาร์คแลนด์อังกฤษแทบทุกรายละเอียด แฟร์เวย์ขนาบด้วยแนวต้นไม้และค่อนข้างแคบเมื่อเทียบกับมาตรฐานร่วมสมัย สนามจึงต้องการการตีที่แม่นยำมากกว่าพละกำลัง จุดเด่นที่สุดคือแนวหินปูนอันน่าตื่นตา ซึ่งเป็นแนวปะการังโบราณ ที่โผล่ขึ้นมาจากภูมิประเทศในหลายหลุม บังคับให้ต้องเลือกไลน์จากแท่นทีอย่างแม่นยำ และเพิ่มบุคลิกทางสายตาที่ไม่เหมือนสนามใดในวงการกอล์ฟไทย ต้นหางนกยูง ลีลาวดี และเฟื่องฟ้าที่โตเต็มวัยเรียงรายอยู่ริมหลุมจำนวนมาก ทำให้สนามถ่ายภาพออกมาสวยเป็นพิเศษในช่วงที่ดอกไม้ผลิบาน หลุมพาร์ 3 เป็นไฮไลต์ที่ชัดเจน โดยหลายหลุมต้องการช็อตข้ามที่แม่นยำสู่กรีนยกระดับหรือกรีนที่มีบังเกอร์ล้อมรอบแน่นหนา ส่วนจากแท่นทีสีแดง สนามมีระยะ 5,713 หลา จึงเข้าถึงได้จริงสำหรับผู้เล่นแฮนดิแคปกลางถึงสูง ทางรถไฟที่อยู่ติดกับสนามเพิ่มฉากหลังที่มีบรรยากาศเฉพาะตัว การได้ยินเสียงขบวนรถไฟมุ่งหน้ากรุงเทพฯ วิ่งผ่านระหว่างออกรอบเป็นเครื่องเตือนใจถึงความผูกพันยาวนานนับศตวรรษระหว่างสนามกับตัวเมือง ผู้รีวิวบางรายตั้งข้อสังเกตว่าสภาพสนามยังไม่เทียบเท่าสนามรีสอร์ตระดับพรีเมียมในพื้นที่ แต่ตัวเลย์เอาต์และประวัติศาสตร์ของสนามชดเชยความไม่สม่ำเสมอเล็กน้อยของพื้นผิวได้มากกว่าคุ้ม`,
        tips: `ควรมาเล่นที่ Royal Hua Hin ในช่วงเช้าเพื่อเลี่ยงทั้งความร้อนตอนกลางวันและลมทะเลช่วงบ่ายที่อาจทำให้การเลือกไม้ในหลุมโล่งยุ่งยากขึ้น สภาพสนามดีที่สุดในช่วงพฤศจิกายนถึงกุมภาพันธ์ ซึ่งอุณหภูมิเย็นกว่าและฝนน้อยมาก การออกรอบวันธรรมดาเงียบกว่าวันเสาร์อาทิตย์อย่างเห็นได้ชัด เพราะช่วงสุดสัปดาห์สนามจะมีทั้งสมาชิกท้องถิ่นและนักกอล์ฟจากกรุงเทพฯ เข้ามาเล่น หากให้ความสำคัญกับจังหวะการเล่น ควรจองทีไทม์วันธรรมดาช่วงเช้าตรู่ แคดดี้ของ Royal Hua Hin คุ้นเคยกับรายละเอียดปลีกย่อยของเลย์เอาต์เก่าแก่แห่งนี้เป็นอย่างดี และความรู้เชิงพื้นที่ของพวกเขามีประโยชน์จริงเมื่อเจอตำแหน่งธงที่ยาก ทิปแคดดี้ตามธรรมเนียมอยู่ที่ 400 บาท สนามไดรฟ์ภายในสนามมีประโยชน์สำหรับการวอร์มอัพ และมีบริการเช่าไม้กอล์ฟในราคา 800 บาท ซึ่งเป็นหนึ่งในอัตราที่คุ้มค่าที่สุดในหัวหิน แต่งกายด้วยกางเกงขาสั้นและเสื้อผ้าเนื้อบางเบาได้ เพราะสนามไม่มีกฎการแต่งกายเกินไปกว่าระดับสมาร์ตแคชวล`,
        location_and_access: `Royal Hua Hin Golf Course ตั้งอยู่ใจกลางเมืองหัวหิน ติดกับสถานีรถไฟหัวหินอันโด่งดัง ห่างจากกรุงเทพฯ ลงมาทางใต้ประมาณ 225 กิโลเมตร การขับรถจากกรุงเทพฯ ใช้เวลาราว 2 ชั่วโมง 50 นาทีผ่านทางหลวงหมายเลข 4 สนามอยู่ในระยะเดินถึงจากโรงแรมหลายแห่งในใจกลางหัวหิน หรือใช้เวลาเพียง 5-10 นาทีโดยตุ๊กตุ๊กหรือ Grab จากที่พักส่วนใหญ่ในตัวเมือง นอกจากนี้ยังมีรถไฟตรงจากสถานีหัวลำโพงในกรุงเทพฯ จอดที่สถานีหัวหิน ทำให้ที่นี่เป็นหนึ่งในไม่กี่สนามกอล์ฟของไทยที่เดินทางถึงได้ด้วยรถไฟ`,
        rental_cta_context: `กำลังจะไป Royal Hua Hin Golf Course อยู่ใช่ไหม LENGOLF มีชุดไม้กอล์ฟให้เช่าคุณภาพดี เพื่อให้คุณได้ลงเล่นเลย์เอาต์เก่าแก่อายุนับร้อยปีแห่งนี้โดยไม่ต้องยุ่งยากกับการขนไม้กอล์ฟมาจากกรุงเทพฯ`,
      },
    },
    ko: {
      title: `Royal Hua Hin Golf Course 그린피 — 후아힌 18홀 코스 가이드와 클럽 대여`,
      meta_description: `Royal Hua Hin Golf Course 그린피는 주중 1,000바트, 주말 1,350바트예요. 1924년에 18홀이 완성된 태국에서 가장 오래된 코스의 개요와 라운딩 팁, 방콕 호텔로 배달되는 LENGOLF 클럽 대여를 안내해요.`,
      prose: {
        overview: `Royal Hua Hin Golf Course 코스는 태국에서 가장 오래된 골프 코스이자 이 왕국에 처음 지어진 코스로, 태국 스포츠 역사에서 특별한 자리를 차지해요. 이야기는 1919년에 시작됩니다. 지금의 후아힌 기차역과 맞닿은 부지에 첫 9홀을 그려 낸 사람은, 당시 펫차부리 철도 담당관을 맡고 있던 스코틀랜드 출신 철도 기술자 A. O. Robins입니다. 18홀 전체는 1924년에 완성되었고, 코스는 2024년에 100주년을 맞았어요. 화이트 티에서 전장 6,678야드, 파 72로 요즘 잣대로 보면 아담한 전통형 레이아웃이지만, 석회암 절벽 노두와 오래 자란 열대 수목, 굽이치는 페어웨이가 어우러져 더 새롭고 더 긴 코스가 흉내 낼 수 없는 개성을 만들어 냅니다. 그린피는 이 지역에서도 손꼽히게 부담이 적어서 주중 1,000바트, 주말 1,350바트예요. Singha Thailand Junior World Golf Championship, Singha-SAT Thai LPGA Masters 등 권위 있는 아마추어 대회도 열려, 역사적 위상만큼이나 코스 자체의 경기력도 인정받고 있습니다.`,
        layout_and_experience: `Royal Hua Hin의 레이아웃은 영국식 파크랜드 코스라는 뿌리를 거의 모든 세부에서 드러내요. 페어웨이는 나무로 둘러싸여 있고 요즘 코스에 비하면 제법 좁은 편이라, 힘보다 정확한 볼 스트라이킹이 필요합니다. 가장 두드러진 특징은 극적인 석회암 노두예요. 고대 산호초가 굳어져 만들어진 이 지형이 여러 홀에서 땅 위로 솟아올라 티샷의 라인을 정교하게 제한하고, 태국 골프 어디에서도 보기 힘든 시각적 개성을 더해 줍니다. 오래 자란 플레임 트리와 프랑지파니, 부겐빌레아가 많은 홀의 경계를 이루어 꽃이 피는 시기에는 사진이 유난히 잘 나와요. 파 3 홀들은 특히 인상적인데, 여러 홀이 높게 자리한 그린이나 벙커로 단단히 둘러싸인 그린을 향해 정확한 캐리를 요구합니다. 레드 티에서는 전장이 5,713야드라서 핸디캡이 중간에서 높은 편인 골퍼도 충분히 즐길 수 있어요. 코스와 나란히 놓인 철길은 특유의 분위기를 더하는 배경이 되어 주고, 라운딩 도중 방콕행 열차가 지나가는 소리는 이 코스가 마을과 한 세기 넘게 이어 온 인연을 떠올리게 합니다. 코스 관리 상태가 인근 프리미엄 리조트 코스만큼은 아니라고 지적하는 후기도 있지만, 레이아웃과 역사가 표면의 사소한 기복을 충분히 상쇄하고도 남아요.`,
        tips: `Royal Hua Hin 코스는 아침에 찾는 편이 좋아요. 한낮의 더위는 물론, 트인 홀에서 클럽 선택을 어렵게 만드는 오후 바닷바람도 피할 수 있거든요. 컨디션이 가장 좋은 시기는 기온이 선선하고 비가 거의 오지 않는 11월부터 2월까지입니다. 주말에는 지역 회원들과 방콕에서 오는 골퍼들이 몰리기 때문에 주중 라운딩이 눈에 띄게 한산해요. 진행 속도가 중요하다면 주중 이른 아침 티타임을 잡으세요. 이곳 캐디들은 오래된 레이아웃의 미묘한 부분을 잘 알고 있어서, 까다로운 핀 위치에서는 현지 감각이 정말 도움이 됩니다. 캐디 팁은 400바트가 관례예요. 코스 안 드라이빙 레인지는 몸을 푸는 데 유용하고, 클럽 대여는 800바트로 후아힌에서도 손꼽히게 저렴한 편입니다. 복장은 반바지에 가벼운 옷차림이면 충분해요. 스마트 캐주얼을 넘어서는 드레스 코드는 없습니다.`,
        location_and_access: `Royal Hua Hin Golf Course 코스는 후아힌 시내 한복판, 유명한 후아힌 기차역 바로 옆에 자리해요. 방콕에서는 남쪽으로 약 225km 떨어져 있습니다. 방콕에서 차로 가면 4번 국도를 따라 2시간 50분 정도 걸려요. 후아힌 중심가의 많은 호텔에서 걸어갈 수 있고, 시내 숙소 대부분에서는 툭툭이나 Grab 차량으로 5~10분이면 닿습니다. 방콕 후아람퐁역에서 출발하는 직통 열차가 후아힌역에 서기 때문에, 기차로 갈 수 있는 몇 안 되는 태국 골프 코스이기도 해요.`,
        rental_cta_context: `Royal Hua Hin Golf Course 라운딩을 앞두고 있다면 LENGOLF 클럽 대여가 편리해요. 품질 좋은 대여 세트를 준비해 두었으니, 방콕에서 클럽을 들고 오는 번거로움 없이 한 세기의 역사를 지닌 이 레이아웃을 플레이할 수 있습니다.`,
      },
    },
    zh: {
      title: `Royal Hua Hin Golf Course果岭费与球场攻略 — 泰国最古老的球场`,
      meta_description: `Royal Hua Hin Golf Course果岭费平日1,000泰铢、周末1,350泰铢。这座18洞于1924年建成的泰国最古老球场，标准杆72，另附送到曼谷酒店的球杆租借。`,
      prose: {
        overview: `Royal Hua Hin Golf Course在泰国体育史上有着独一无二的位置：它是全国最古老的高尔夫球场，也是这个王国境内建成的第一座球场。故事要从1919年说起——苏格兰铁路工程师A. O. Robins时任佛丕铁路官员（Phetchaburi Railway Officer），在如今华欣火车站旁边的地块上规划出最初的9个洞。完整的18洞于1924年建成，球场在2024年迎来百年纪念。从白色发球台量起6,678码，标准杆72，以今天的尺度看是一座紧凑的传统布局；但石灰岩崖壁的露头、成材的热带树木与起伏的球道结合在一起，造就了更新、更长的球场无法复制的个性。果岭费属于这一带最亲民的一档：平日1,000泰铢，周末1,350泰铢。球场还承办Singha Thailand Junior World Golf Championship与Singha-SAT Thai LPGA Masters等高规格业余赛事，说明它的历史地位背后确实有真实的球场水准支撑。`,
        layout_and_experience: `Royal Hua Hin的布局几乎在每一处细节上都透着英式林地球场的出身。球道两侧林木夹峙，以当代标准衡量偏窄，因此考验的是击球的准确度而非力量。最鲜明的特征，是那些气势十足的石灰岩露头——它们其实是远古的珊瑚礁地层——在好几个洞里从地面拔起，逼着你在发球台上选准路线，也带来泰国高尔夫里独一份的视觉个性。成材的凤凰木、鸡蛋花与三角梅沿着许多球洞生长，花期时球场格外上镜。3杆洞是尤其亮眼的一组，其中好几个洞要求把球精准地送上抬高的果岭，或是防守严密的果岭。从红色发球台量起，球场长5,713码，中高差点球友也能真正打得下来。紧邻球场的铁路线添了一层氛围十足的背景——打球途中听见开往曼谷的列车驶过，会让人想起这座球场与小镇跨越百年的联系。也有球评指出，球场的养护水准不及本地那些高端度假村球场，但布局本身与它的历史，足以补上草面上那些细微的不匀。`,
        tips: `建议上午来打Royal Hua Hin，既避开正午的暑热，也避开午后的海风——在开阔的球洞上，海风会让选杆变得棘手。条件最好的时段是11月至次年2月，气温更凉，雨水也很少。平日下场明显比周末清静，周末球场会迎来本地会员和从曼谷过来的球友；如果你看重打球节奏，就订一个平日清晨的开球时间。这里的球童熟悉这条老布局的细微之处，遇到刁钻的旗位时，他们的本地经验真的很有用。球童小费按惯例是400泰铢。场内的练习场适合下场前热身，球杆租借为800泰铢，是华欣一带最实惠的价格之一。穿短裤和轻便衣物即可，球场除了整洁休闲（smart casual）之外没有别的着装要求。`,
        location_and_access: `Royal Hua Hin Golf Course位于华欣镇中心，紧邻著名的华欣火车站，距曼谷以南约225公里。从曼谷驾车走4号公路，约需2小时50分钟。球场从华欣市中心的许多酒店步行即可抵达，从镇上大多数住处搭嘟嘟车或Grab也只要5–10分钟。曼谷华喃峰站（Hua Lamphong）发出的直达列车会停靠华欣站，这让它成为泰国少数几座可以坐火车抵达的高尔夫球场。`,
        rental_cta_context: `要去Royal Hua Hin Golf Course打球？LENGOLF提供品质可靠的租借球杆套组，让你不必大费周章把球杆从曼谷运过来，就能打上这座有百年历史的老布局。`,
      },
    },
    ja: {
      title: `Royal Hua Hin Golf Course（ホアヒン）— グリーンフィー・コース紹介・クラブレンタル`,
      meta_description: `グリーンフィーは平日1,000THB、週末1,350THB。Royal Hua Hin Golf Courseは1924年に18ホールが完成したタイ最古のゴルフコースで、パー72の伝統的なレイアウトです。バンコクのホテルへ届くLENGOLFのクラブレンタルもご案内します。`,
      prose: {
        overview: `Royal Hua Hin Golf Courseは、タイ最古のゴルフコースであり、王国で初めて造られたコースとして、タイのスポーツ史に独自の位置を占めています。物語の始まりは1919年。当時ペッチャブリーの鉄道官を務めていたスコットランド人鉄道技師A. O. Robinsが、今のホアヒン鉄道駅に隣接する敷地に最初の9ホールをレイアウトしました。18ホールすべてが完成したのは1924年で、コースは2024年に開場100周年を迎えています。ホワイトティーから6,678ヤード、パー72。現代の基準ではコンパクトな伝統的レイアウトですが、石灰岩の崖の露出、樹齢を重ねた熱帯樹、うねりのあるフェアウェイが組み合わさり、より新しく長いコースには再現できない個性を生んでいます。グリーンフィーはこの地域でも屈指の手頃さで、平日1,000THB、週末1,350THB。Singha Thailand Junior World Golf ChampionshipやSingha-SAT Thai LPGA Mastersといった格式あるアマチュア大会も開催されており、歴史的な立ち位置に見合う競技面の実力を備えたコースであることがうかがえます。`,
        layout_and_experience: `Royal Hua Hinのレイアウトは、英国式パークランドという出自をほぼすべての細部に映し出しています。フェアウェイは樹木に縁取られ、現代の感覚ではやや狭め。飛距離よりも正確なショットが求められるコースです。最大の特徴は、迫力ある石灰岩の露頭 — 古代のサンゴ礁が形を変えたもの — がいくつものホールで地表に現れ、ティーショットのラインを厳密に制限し、タイのゴルフでは他に例のない視覚的な個性を与えている点にあります。樹齢を重ねたフレイムツリー、プルメリア、ブーゲンビリアが多くのホールを縁取り、花の季節はとりわけ写真映えします。特に見どころとなるのがパー3で、いくつかのホールでは高い位置にあるグリーンや、バンカーにしっかり守られたグリーンへ正確なキャリーが必要です。レッドティーからの全長は5,713ヤードで、ミドルからハイハンディキャップのゴルファーにも無理なく回れる設定になっています。コースに隣接する鉄道の線路も、雰囲気ある背景のひとつ。ラウンド中にバンコク行きの列車が通り過ぎる音は、このコースと町が1世紀にわたって結ばれてきたことを思い出させてくれます。エリア内のプレミアムなリゾートコースほどコースコンディションは整っていない、という声もありますが、レイアウトと歴史が芝面のわずかなむらを補って余りあります。`,
        tips: `Royal Hua Hinは午前中のプレーがおすすめです。日中の暑さに加え、開けたホールでクラブ選択を難しくする午後の海風も避けられます。コンディションが最も良いのは、気温が下がり雨も少ない11月から2月にかけて。週末は地元メンバーやバンコクから訪れるゴルファーで賑わうため、平日のラウンドは目に見えて空いています。プレー進行を重視するなら、平日の早朝ティータイムを押さえておきましょう。ここのキャディーは歴史あるレイアウトの機微をよく心得ており、難しいピンポジションではその土地勘が本当に頼りになります。キャディーへのチップは400THBが慣例です。敷地内のドライビングレンジはウォーミングアップに便利で、クラブレンタルは800THB — ホアヒンでも指折りの手頃な料金です。服装はショートパンツに軽装で十分。スマートカジュアルを超えるドレスコードはありません。`,
        location_and_access: `Royal Hua Hin Golf Courseはホアヒンの街の中心部、有名なホアヒン鉄道駅のすぐ隣に位置し、バンコクから南へおよそ225kmの距離です。バンコクからは国道4号線経由で車で約2時間50分。ホアヒン中心部の多くのホテルからは徒歩圏内で、街なかの宿泊施設からならトゥクトゥクかGrabで5〜10分ほどです。バンコクのフアランポーン駅から出る直通列車がホアヒン駅に停車するため、鉄道でアクセスできるタイでは数少ないゴルフコースのひとつでもあります。`,
        rental_cta_context: `Royal Hua Hin Golf Courseでのラウンドを予定しているなら、LENGOLFのクラブレンタルが便利です。質の高いレンタルセットをご用意しているので、バンコクからクラブを運ぶ手間をかけずに、1世紀の歴史をもつこのレイアウトをプレーできます。`,
      },
    },
  },
  status: 'published',
  published_at: '2026-04-20',
}
