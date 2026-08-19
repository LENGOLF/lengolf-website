import type { GolfCourse } from '@/types/golf-courses'

export const course: GolfCourse = {
  slug: 'kaeng-krachan-country-club',
  region: 'hua-hin',
  name: `Kaeng Krachan Country Club & Resort`,
  province: `Phetchaburi`,
  designer: `Cherd Bunyaratavej / Jack Nicklaus Design`,
  holes: 27,
  par: 72,
  year_opened: 1994,
  // All-in package (caddie + cart included); base green fee not separable
  green_fee_weekday_thb: 1199,
  green_fee_weekend_thb: 1399,
  // All-in package (green fee + caddie + cart), per this file's own prose in
  // every locale. The weekday/weekend split above is real and its labels stay;
  // this only stops generated copy calling the number a bare "green fee".
  fee_is_package: true,
  // Zero, not null: it asserts the truth — the caddie and shared cart cost this
  // golfer nothing on top of the package — and it agrees with korea-golf-club,
  // the other package course, which already carried 0/0.
  //
  // Do NOT justify this by "SpecTable renders 0 as Included": that branch never
  // runs for THIS course. SpecTable is imported only by /compare/, whose pairs
  // are each region's top 3, and this course ranks 6th of 11 in hua-hin.
  // CoursePage gates both rows on `> 0` and caddieAnswer uses a falsy test, so
  // 0 and null render identically everywhere it currently appears. The encoding
  // is right; that particular argument for it was not — the same overclaim an
  // earlier commit removed from korea-golf-club's twin comment. What CLAUDE.md
  // forbids is reading all-inclusiveness back OUT of a zero, which is what
  // `fee_is_package` above exists for.
  caddie_fee_thb: 0,
  cart_fee_thb: 0,
  caddie_required: true,
  cart_required: false,
  driving_range: true,
  website: 'https://www.powerninegroup.com/power-nine-kaeng-krachan/',
  phone: '+66 96 904 0811',
  latitude: 12.8831,
  longitude: 99.7564,
  distance_from_bangkok_km: 190,
  drive_time_from_bangkok_min: 120,
  google_maps_url: null,
  club_rental_available: true,
  club_rental_fee_thb: 600,
  club_rental_brands: null,
  schema_markup: `{"@context":"https://schema.org","@type":"GolfCourse","name":"Kaeng Krachan Country Club & Resort","url":"https://len.golf/golf-courses/hua-hin/kaeng-krachan-country-club/","address":{"@type":"PostalAddress","streetAddress":"19 Moo 2, Tayang-Kaengkrachan Rd","addressLocality":"Kaeng Krachan","addressRegion":"Phetchaburi","postalCode":"76130","addressCountry":"TH"},"geo":{"@type":"GeoCoordinates","latitude":12.8831,"longitude":99.7564},"telephone":"+66969040811","priceRange":"฿฿","sameAs":["https://www.powerninegroup.com/power-nine-kaeng-krachan/"],"amenityFeature":[{"@type":"LocationFeatureSpecification","name":"Driving Range","value":true},{"@type":"LocationFeatureSpecification","name":"Caddie Service","value":true},{"@type":"LocationFeatureSpecification","name":"Golf Cart Rental","value":true},{"@type":"LocationFeatureSpecification","name":"Club Rental","value":true}]}`,
  prose: {
    overview: `Kaeng Krachan Country Club & Resort is one of the most scenically dramatic golf destinations in the Hua Hin region. Located 51 kilometres inland from Hua Hin on the edge of Kaeng Krachan National Park — a UNESCO World Heritage site — the 27-hole complex combines an original 18-hole layout by Thai architect Cherd Bunyaratavej (opened 1994) with a 9-hole Jack Nicklaus Mountain Course added in 2008. Together they form a facility that ranges from open parkland to dense jungle terrain, with the Nicklaus loop in particular delivering the kind of dramatic elevation and forest framing rarely found at this price point. Since 2023, the course has been managed by the Power Nine Group, which offers all-in packages starting from 1,199 THB on weekdays and 1,399 THB on weekends — caddie and shared cart included. The combination of a genuine Nicklaus-branded nine, outstanding natural surroundings, and accessible pricing makes Kaeng Krachan a distinctive destination for golfers willing to venture inland.`,
    layout_and_experience: `The original Cherd Bunyaratavej design at Kaeng Krachan divides into two named loops — the Lake Course and the Valley Course — that together cover the more open, parkland sections of the property. These nines feature generous fairways framed by mature trees, with water hazards on the Lake loop forming the primary strategic challenge. The Valley Course weaves through denser vegetation and subtle elevation changes that reward controlled approaches. The Jack Nicklaus Mountain Course, the third and most distinctive nine, represents a step change in both terrain and drama. The Nicklaus design team used the hillside contours to create holes that rise and descend through thick jungle, with views over the national park and the reservoir below. Tee shots must carry over dense forest on several holes, and the greens are perched on elevated plateaus that make approach yardage calculation critical. Wildlife sightings — deer, monitor lizards, and various bird species — are not uncommon during rounds on the Mountain Course. The combination of all three loops gives golfers significant variety within a single day's play.`,
    tips: `Kaeng Krachan is a destination round rather than a casual drop-in — budget a full day given the 51-kilometre inland drive from Hua Hin and the sprawling 27-hole layout. Call ahead on +66 96 904 0811 before visiting; Power Nine took over management in 2023 and the course has received limited external bookings in recent years, meaning some third-party booking platforms may show it as closed to general play or carry outdated information. Confirm current availability directly with the club. Request the Jack Nicklaus Mountain Course as part of your 18-hole combination on your first visit — it is the most distinctive routing and the primary reason to make the inland drive. The proximity to Kaeng Krachan National Park means the course sits in dense jungle with higher mosquito presence during the wet season (May–October); bring repellent. Shoe rental is 200 THB and umbrella rental 100 THB if needed. The all-in package pricing means no unexpected extras at checkout.`,
    location_and_access: `Kaeng Krachan Country Club & Resort is located at 19 Moo 2, Tayang-Kaengkrachan Road, Kaeng Krachan, Phetchaburi 76130. From Bangkok, the drive covers approximately 190 kilometres and takes around two hours via Highway 4 south to Phetchaburi, then west into the national park zone. From central Hua Hin, the inland route covers 51 kilometres and takes roughly 50–60 minutes by car. There is no shuttle service; private transfer or self-drive is required. The road into Kaeng Krachan district is well-maintained but narrow in places — GPS navigation using the coordinates 12.8831, 99.7564 is recommended.`,
    rental_cta_context: `Heading to Kaeng Krachan Country Club, including the Jack Nicklaus Mountain Course? LENGOLF offers quality rental sets so you can tackle this jungle-fringed national park layout without the hassle of transporting clubs from Bangkok.`,
  },
  locales: {
    en: {
      title: `Kaeng Krachan Country Club — Green Fees, Course Guide & Golf Club Rentals`,
      meta_description: `Kaeng Krachan Country Club: 27 holes including a Jack Nicklaus Mountain Course. All-in from 1,199 THB. Rent clubs from LENGOLF for your Hua Hin inland round.`,
    },
    th: {
      title: `Kaeng Krachan Country Club เพชรบุรี — แพ็กเกจรวมทุกอย่าง รีวิวสนาม และเช่าไม้กอล์ฟ`,
      meta_description: `แพ็กเกจรวมทุกอย่างที่ Kaeng Krachan Country Club เริ่มต้น 1,199 บาทในวันธรรมดา รวมแคดดี้และรถกอล์ฟแบบใช้ร่วมกัน สนาม 27 หลุมพร้อม Jack Nicklaus Mountain Course ริมอุทยานแห่งชาติแก่งกระจาน และเช่าไม้กอล์ฟจากกรุงเทพฯ`,
      prose: {
        overview: `Kaeng Krachan Country Club & Resort เป็นหนึ่งในจุดหมายกอล์ฟที่มีทัศนียภาพน่าตื่นตาที่สุดในย่านหัวหิน ตั้งอยู่ลึกเข้าไปในแผ่นดิน 51 กิโลเมตรจากหัวหิน บนขอบอุทยานแห่งชาติแก่งกระจาน ซึ่งเป็นแหล่งมรดกโลกของยูเนสโก คอมเพล็กซ์ 27 หลุมแห่งนี้ผสมผสานเลย์เอาต์ 18 หลุมดั้งเดิมที่ออกแบบโดย Cherd Bunyaratavej สถาปนิกชาวไทย (เปิดในปี 1994) เข้ากับ Jack Nicklaus Mountain Course ขนาด 9 หลุมที่เพิ่มเข้ามาในปี 2008 ทั้งหมดรวมกันเป็นสนามที่ไล่ระดับตั้งแต่พื้นที่พาร์คแลนด์โปร่งโล่งไปจนถึงภูมิประเทศป่าดิบทึบ โดยเฉพาะลูปของ Nicklaus ที่มอบการเปลี่ยนระดับความสูงอันน่าตื่นเต้นและกรอบภาพของผืนป่าซึ่งหาได้ยากในระดับราคานี้ ตั้งแต่ปี 2023 สนามอยู่ภายใต้การบริหารของ Power Nine Group ซึ่งเสนอแพ็กเกจรวมทุกอย่างเริ่มต้นที่ 1,199 บาทในวันธรรมดา และ 1,399 บาทในวันเสาร์อาทิตย์ โดยรวมแคดดี้และรถกอล์ฟแบบใช้ร่วมกันไว้แล้ว การมีสนาม 9 หลุมที่ติดแบรนด์ Nicklaus จริง ธรรมชาติโดยรอบที่โดดเด่น และราคาที่เข้าถึงได้ ทำให้แก่งกระจานเป็นจุดหมายที่มีเอกลักษณ์สำหรับนักกอล์ฟที่พร้อมเดินทางเข้าสู่พื้นที่ตอนใน`,
        layout_and_experience: `เลย์เอาต์ดั้งเดิมที่ออกแบบโดย Cherd Bunyaratavej ที่ Kaeng Krachan แบ่งออกเป็นสองลูปที่มีชื่อเรียก ได้แก่ Lake Course และ Valley Course ซึ่งรวมกันครอบคลุมส่วนที่เปิดโล่งและเป็นพาร์คแลนด์มากกว่าของพื้นที่ ทั้งสองลูปนี้มีแฟร์เวย์กว้างขวางที่มีต้นไม้ใหญ่ขนาบข้าง โดยมีอุปสรรคน้ำในลูป Lake เป็นโจทย์เชิงกลยุทธ์หลัก ส่วน Valley Course ลัดเลาะผ่านพืชพรรณที่หนาแน่นกว่าและการเปลี่ยนระดับความสูงเล็กน้อยซึ่งให้รางวัลแก่ช็อตแอพโพรชที่ควบคุมได้ ด้าน Jack Nicklaus Mountain Course สนาม 9 หลุมที่สามและมีเอกลักษณ์ที่สุด ถือเป็นการยกระดับทั้งภูมิประเทศและความตื่นเต้น ทีมออกแบบของ Nicklaus ใช้แนวสันของเนินเขาสร้างหลุมที่ไต่ขึ้นและทิ้งตัวลงผ่านป่าทึบ พร้อมวิวมองข้ามอุทยานแห่งชาติและอ่างเก็บน้ำเบื้องล่าง ช็อตจากแท่นทีในหลายหลุมต้องข้ามผืนป่าหนาทึบ และกรีนวางตัวอยู่บนที่ราบยกสูงจนการคำนวณระยะแอพโพรชกลายเป็นเรื่องสำคัญยิ่ง การพบเห็นสัตว์ป่าทั้งกวาง ตะกวด และนกหลากหลายชนิดไม่ใช่เรื่องแปลกระหว่างออกรอบบน Mountain Course และการรวมทั้งสามลูปเข้าด้วยกันทำให้นักกอล์ฟได้ความหลากหลายอย่างมากภายในการเล่นวันเดียว`,
        tips: `Kaeng Krachan เป็นรอบกอล์ฟแบบจุดหมายปลายทางมากกว่าการแวะเล่นแบบสบาย ๆ ควรเผื่อเวลาไว้ทั้งวัน เพราะต้องขับรถเข้าสู่พื้นที่ตอนใน 51 กิโลเมตรจากหัวหิน และเลย์เอาต์ 27 หลุมก็แผ่กว้างมาก ควรโทรสอบถามล่วงหน้าที่ +66 96 904 0811 ก่อนเดินทาง เนื่องจาก Power Nine เข้ามาบริหารในปี 2023 และสนามรับการจองจากภายนอกค่อนข้างจำกัดในช่วงไม่กี่ปีที่ผ่านมา แพลตฟอร์มจองของบุคคลที่สามบางแห่งจึงอาจแสดงว่าสนามปิดสำหรับผู้เล่นทั่วไปหรือให้ข้อมูลที่ล้าสมัย ควรยืนยันสถานะการเปิดให้บริการกับทางสนามโดยตรง สำหรับการมาครั้งแรก แนะนำให้ขอเล่น Jack Nicklaus Mountain Course เป็นส่วนหนึ่งของการจับคู่ 18 หลุม เพราะเป็นเส้นทางที่มีเอกลักษณ์ที่สุดและเป็นเหตุผลหลักของการขับรถเข้ามาในแผ่นดิน ความใกล้ชิดกับอุทยานแห่งชาติแก่งกระจานหมายความว่าสนามตั้งอยู่ในป่าทึบซึ่งมียุงชุกกว่าในช่วงฤดูฝน (พฤษภาคม-ตุลาคม) จึงควรพกยากันยุงไปด้วย มีบริการเช่ารองเท้าในราคา 200 บาท และเช่าร่มในราคา 100 บาทหากจำเป็น ส่วนราคาแบบแพ็กเกจรวมทุกอย่างหมายความว่าจะไม่มีค่าใช้จ่ายที่ไม่คาดคิดตอนเช็กบิล`,
        location_and_access: `Kaeng Krachan Country Club & Resort ตั้งอยู่เลขที่ 19 หมู่ 2 ถนนท่ายาง-แก่งกระจาน อำเภอแก่งกระจาน จังหวัดเพชรบุรี 76130 จากกรุงเทพฯ ระยะทางประมาณ 190 กิโลเมตร ใช้เวลาราวสองชั่วโมงโดยใช้ทางหลวงหมายเลข 4 ลงใต้สู่เพชรบุรี แล้วเลี้ยวไปทางตะวันตกเข้าสู่เขตอุทยานแห่งชาติ จากใจกลางหัวหิน เส้นทางเข้าสู่พื้นที่ตอนในมีระยะ 51 กิโลเมตร ใช้เวลาราว 50-60 นาทีโดยรถยนต์ ไม่มีบริการรถรับส่ง จึงต้องจัดรถส่วนตัวหรือขับรถมาเอง ถนนที่เข้าสู่อำเภอแก่งกระจานอยู่ในสภาพดีแต่แคบในบางช่วง แนะนำให้ใช้ระบบนำทาง GPS ด้วยพิกัด 12.8831, 99.7564`,
        rental_cta_context: `กำลังจะไป Kaeng Krachan Country Club รวมถึง Jack Nicklaus Mountain Course อยู่ใช่ไหม LENGOLF มีชุดไม้กอล์ฟให้เช่าคุณภาพดี ให้คุณลุยสนามริมอุทยานแห่งชาติที่รายล้อมด้วยป่าแห่งนี้ได้โดยไม่ต้องยุ่งยากกับการขนไม้กอล์ฟมาจากกรุงเทพฯ`,
      },
    },
    ko: {
      title: `Kaeng Krachan Country Club 올인클루시브 패키지 — 27홀 코스 가이드와 클럽 대여`,
      meta_description: `Kaeng Krachan Country Club 올인클루시브 패키지는 평일 1,199바트부터이고 캐디와 공유 카트가 포함돼요. Jack Nicklaus Mountain Course 9홀을 더한 27홀 구성과 Kaeng Krachan 국립공원 옆 입지, 방콕에서 챙겨 가는 LENGOLF 클럽 대여를 안내해요.`,
      prose: {
        overview: `Kaeng Krachan Country Club & Resort 코스는 후아힌 일대에서 경관이 가장 극적인 골프 목적지 가운데 하나예요. 후아힌에서 내륙으로 51km 들어간 Kaeng Krachan 국립공원 가장자리에 자리하고 있고, 이 국립공원은 유네스코 세계유산이에요. 27홀 규모의 이 복합 코스는 태국인 설계가 Cherd Bunyaratavej의 원래 18홀 레이아웃(1994년 개장)과 2008년에 더해진 Jack Nicklaus Mountain Course 9홀을 함께 갖추고 있습니다. 둘을 합치면 탁 트인 파크랜드부터 빽빽한 정글 지형까지 폭넓게 아우르는 시설이 되고, 특히 니클라우스 나인은 이 가격대에서는 좀처럼 만나기 어려운 극적인 고저 차와 숲의 프레이밍을 보여 줘요. 2023년부터는 Power Nine Group에서 코스를 운영하면서 평일 1,199바트, 주말 1,399바트부터 시작하는 올인클루시브 패키지를 내놓고 있어요. 캐디와 공유 카트가 요금에 포함됩니다. 진짜 니클라우스 브랜드를 단 9홀과 빼어난 자연 환경, 그리고 부담 없는 가격이 어우러져, 내륙까지 들어갈 마음이 있는 골퍼에게 Kaeng Krachan 코스는 남다른 목적지가 돼요.`,
        layout_and_experience: `Kaeng Krachan에서 Cherd Bunyaratavej의 원래 설계는 Lake Course, Valley Course 두 나인으로 나뉘어, 부지에서 비교적 트여 있고 파크랜드에 가까운 구역을 함께 아우릅니다. 이 두 나인은 오래 자란 나무가 둘러싼 넉넉한 페어웨이가 특징이고, Lake 나인의 워터 해저드가 전략적으로 가장 큰 과제예요. Valley 코스는 더 빽빽한 식생과 미묘한 고저 차 사이를 누비며, 절제된 어프로치에 보답합니다. 세 번째이자 가장 개성이 뚜렷한 나인인 Jack Nicklaus Mountain Course는 지형과 드라마 양쪽에서 한 단계 도약을 보여 줘요. 니클라우스 설계팀은 산비탈의 등고선을 그대로 살려 울창한 정글 사이를 오르내리는 홀을 만들었고, 국립공원과 아래쪽 저수지를 굽어보는 조망이 펼쳐집니다. 여러 홀에서 티샷은 빽빽한 숲을 넘겨야 하고, 그린은 높이 솟은 대지 위에 얹혀 있어 어프로치 거리 계산이 결정적이에요. Mountain Course 라운딩 중에 사슴과 왕도마뱀, 여러 종류의 새 같은 야생동물을 마주치는 일도 드물지 않습니다. 세 나인을 조합하면 하루 플레이 안에서도 상당한 변화를 누릴 수 있어요.`,
        tips: `Kaeng Krachan 코스는 가볍게 들르는 곳이라기보다 목적지형 라운딩이에요. 후아힌에서 내륙으로 51km를 달려야 하고 27홀 레이아웃도 넓게 퍼져 있어서 하루를 통째로 잡아 두는 편이 좋습니다. 방문 전에는 +66 96 904 0811로 미리 전화해 보세요. 2023년에 Power Nine에서 운영을 넘겨받았고 최근 몇 년 동안 외부 예약을 많이 받지 않아, 일부 서드파티 예약 플랫폼에는 일반 플레이가 불가능한 곳으로 표시되거나 오래된 정보가 남아 있을 수 있어요. 현재 이용 가능 여부는 클럽에 직접 확인하세요. 처음 찾는다면 18홀 조합에 Jack Nicklaus Mountain Course 9홀을 넣어 달라고 요청해 보세요. 가장 개성 있는 루팅이자 내륙까지 차를 몰고 들어올 가장 큰 이유입니다. Kaeng Krachan 국립공원과 가깝다는 것은 코스가 빽빽한 정글 속에 있다는 뜻이라, 우기(5~10월)에는 모기가 더 많아요. 방충제를 챙기세요. 필요하다면 신발 대여는 200바트, 우산 대여는 100바트입니다. 올인클루시브 패키지 요금이라 정산할 때 예상 밖의 추가 비용은 없어요.`,
        location_and_access: `Kaeng Krachan Country Club & Resort의 주소는 19 Moo 2, Tayang-Kaengkrachan Road, Kaeng Krachan, Phetchaburi 76130입니다. 방콕에서는 약 190km 거리로, 4번 국도를 타고 남쪽 펫차부리주까지 내려간 뒤 서쪽 국립공원 권역으로 들어가는 경로로 두 시간쯤 걸려요. 후아힌 도심에서 출발하면 내륙 경로가 51km, 차로 50~60분 정도입니다. 셔틀 서비스는 없어서 사전에 준비한 개인 차량이나 직접 운전이 필요해요. 펫차부리주 Kaeng Krachan 지구로 들어가는 도로는 관리가 잘 돼 있지만 구간에 따라 좁아지니, 좌표 12.8831, 99.7564를 이용한 GPS 내비게이션을 권합니다.`,
        rental_cta_context: `Jack Nicklaus Mountain Course 9홀을 포함해 Kaeng Krachan Country Club 라운딩을 계획하고 있다면, LENGOLF의 품질 좋은 대여 세트를 이용해 보세요. 방콕에서 클럽을 챙겨 옮기는 번거로움 없이, 국립공원 곁 정글에 둘러싸인 이 레이아웃에 도전할 수 있어요.`,
      },
    },
    zh: {
      title: `Kaeng Krachan Country Club全包套餐与球场攻略 — 27洞与球杆租借`,
      meta_description: `Kaeng Krachan Country Club全包套餐平日1,199泰铢起，已含球童与共享球车。27洞球场里有一组Jack Nicklaus Mountain Course九洞，紧邻Kaeng Krachan国家公园，另附从曼谷带上路的LENGOLF球杆租借。`,
      prose: {
        overview: `Kaeng Krachan Country Club & Resort是华欣一带景致最富戏剧性的高尔夫目的地之一。它坐落在距华欣内陆51公里处、Kaeng Krachan国家公园的边缘，这座国家公园是联合国教科文组织世界遗产。这处27洞球场把泰国设计师Cherd Bunyaratavej设计、1994年开放的原始18洞布局，与2008年增建的9洞Jack Nicklaus Mountain Course结合在一起。两者合起来，让这里从开阔的园林地形一路延伸到茂密的丛林地带，尤其是杰克·尼克劳斯（Jack Nicklaus）那一组九洞，呈现出在这个价位上很少见的巨大高低落差与林木框景。自2023年起，球场由Power Nine Group接手管理，推出全包套餐，平日1,199泰铢起、周末1,399泰铢起，已经含了球童与共享球车。一组货真价实挂着尼克劳斯品牌的九洞、出众的自然环境，再加上亲民的价格，让Kaeng Krachan成为愿意往内陆走一趟的球手眼中别具一格的目的地。`,
        layout_and_experience: `Kaeng Krachan由Cherd Bunyaratavej操刀的原始布局分成两组有名字的九洞——Lake Course与Valley Course，一起覆盖了球场里较为开阔、偏园林风格的区域。这两组九洞球道宽绰，两侧是成熟的树木，Lake那一组的水障碍则是主要的战术考验。Valley Course穿行于更密的植被与细微的高低起伏之间，回报那些控制得住的攻果岭球。第三组、也是个性最鲜明的九洞Jack Nicklaus Mountain Course，在地形与戏剧性上都是一次跃升。尼克劳斯的设计团队顺着山坡的等高线，做出在浓密丛林中起落穿行的球洞，视野可以越过国家公园与下方的水库。有好几个洞的开球必须飞越茂密的林地，果岭又架在抬高的平台上，攻果岭的码数计算因此至关重要。在Mountain Course打球时，遇上鹿、巨蜥和各种鸟类并不稀奇。把三组九洞组合起来，一天之内就能打出相当丰富的变化。`,
        tips: `Kaeng Krachan更像是一趟专程前往的目的地之旅，而不是顺路打一场——从华欣往内陆开51公里，加上27洞球场铺得很开，最好留出一整天。动身前先打+66 96 904 0811确认：Power Nine在2023年接手管理，近几年球场对外接受的预订不多，所以有些第三方预订平台可能把它显示为不对一般球手开放，或是挂着过时的信息。当前是否可打，请直接向球会确认。第一次来的话，记得要求把Jack Nicklaus Mountain Course排进你的18洞组合——它是最有个性的一条路线，也是值得往内陆开这一趟的主要理由。紧邻Kaeng Krachan国家公园意味着球场身处茂密丛林，雨季（5–10月）蚊子会更多，记得带上驱蚊液。有需要的话，球鞋租借200泰铢，雨伞租借100泰铢。全包套餐的定价意味着结账时不会冒出预料之外的费用。`,
        location_and_access: `Kaeng Krachan Country Club & Resort的地址是19 Moo 2, Tayang-Kaengkrachan Road, Kaeng Krachan, Phetchaburi 76130。从曼谷出发，路程约190公里，车程约两小时：走4号公路南下至佛丕府，再往西转入国家公园一带。从华欣市区走内陆路线为51公里，驾车约50–60分钟。这里没有接驳车服务，需要自驾或自行安排私人接送。进入Kaeng Krachan县的道路养护不错，但部分路段较窄，建议用坐标12.8831, 99.7564做GPS导航。`,
        rental_cta_context: `打算去Kaeng Krachan Country Club，还想把Jack Nicklaus Mountain Course一并打下来？LENGOLF备有品质可靠的租借球杆，让你不必费劲从曼谷把球包一路运过去，就能会一会这片紧邻国家公园、被丛林环抱的布局。`,
      },
    },
    ja: {
      title: `Kaeng Krachan Country Club（ペッチャブリー）— パッケージ料金・コース紹介・クラブレンタル`,
      meta_description: `オールインクルーシブのパッケージは平日1,199THBから、キャディーと乗り合いカート込み。Kaeng Krachan Country Clubはケーンクラチャン国立公園の際に広がる27ホールで、Jack Nicklaus Mountain Courseの9ホールを備えます。バンコクから手ぶらで向かえるLENGOLFのクラブレンタルもご案内します。`,
      prose: {
        overview: `Kaeng Krachan Country Club & Resortは、ホアヒン一帯でも屈指の劇的な景観を誇るゴルフデスティネーションです。ホアヒンから内陸へ51km入ったケーンクラチャン国立公園の際に位置し、この国立公園はユネスコ世界遺産に登録されています。27ホールの複合施設は、タイ人設計家Cherd Bunyaratavejによる当初の18ホールレイアウト（1994年開場）と、2008年に加わった9ホールのJack Nicklaus Mountain Courseで構成されます。両者を合わせると、開けたパークランドから密林の地形までを含む施設となり、とりわけNicklausのループは、この価格帯ではめったに味わえない大胆な高低差と森の額縁を届けてくれます。2023年からはPower Nine Groupが運営を担い、平日1,199THB、週末1,399THBからのオールインクルーシブパッケージを用意。キャディーと乗り合いカートが料金に含まれます。本物のNicklausブランドの9ホール、傑出した自然環境、そして手の届く価格。この組み合わせが、内陸まで足を延ばす気のあるゴルファーにとってKaeng Krachanを個性的な行き先にしています。`,
        layout_and_experience: `Kaeng KrachanにおけるCherd Bunyaratavejの当初の設計は、Lake CourseとValley Courseという2つの名前付きループに分かれ、敷地のうち比較的開けたパークランド寄りの区域をカバーしています。この2つのナインは、成熟した木々に縁取られたゆったりとしたフェアウェイが特徴で、Lakeループのウォーターハザードが戦略上の主な課題となります。Valley Courseはより密な植生と微妙な高低差の間を縫って進み、抑えの効いたアプローチに報いる造りです。3つ目にして最も個性的なナイン、Jack Nicklaus Mountain Courseでは、地形もドラマも一段階上がります。Nicklausの設計チームは山腹の等高線を生かし、深いジャングルの中を上り下りするホールを造り上げました。眼下には国立公園と貯水池を望みます。いくつかのホールではティーショットで密林を越えるキャリーが必要で、グリーンは高く持ち上げられた台地の上に据えられているため、アプローチの距離計算が決定的に重要になります。Mountain Courseのラウンド中に、シカやオオトカゲ、さまざまな野鳥といった野生動物を見かけることも珍しくありません。3つのループを組み合わせれば、1日のプレーの中でも大きな変化を楽しめます。`,
        tips: `Kaeng Krachanは気軽に立ち寄るコースというより、目的地として訪れる1ラウンドです。ホアヒンから内陸へ51kmの道のりと広大な27ホールのレイアウトを考えると、丸1日を確保しておきましょう。訪問前には+66 96 904 0811へお電話を。Power Nineが2023年に運営を引き継いで以降、ここ数年は外部からの予約受け入れが限られており、サードパーティの予約サイトでは一般プレー不可と表示されていたり、古い情報が残っていたりすることがあります。最新の受け入れ状況はクラブに直接ご確認ください。初めての訪問なら、18ホールの組み合わせにJack Nicklaus Mountain Courseを入れてもらうようリクエストするのがおすすめです。最も個性的なルーティングであり、内陸までドライブする最大の理由でもあります。ケーンクラチャン国立公園に近いということは、コースが深いジャングルの中にあるということでもあり、雨季（5月〜10月）は蚊が多くなります。虫よけをお持ちください。必要ならシューズレンタルは200THB、傘のレンタルは100THBで用意されています。オールインクルーシブのパッケージ料金なので、精算時に想定外の追加費用が出ることはありません。`,
        location_and_access: `Kaeng Krachan Country Club & Resortの所在地は19 Moo 2, Tayang-Kaengkrachan Road, Kaeng Krachan, Phetchaburi 76130です。バンコクからの距離は約190km、国道4号線を南下してペッチャブリーへ向かい、そこから西へ国立公園エリアに入るルートで約2時間かかります。ホアヒン中心部からは内陸ルートで51km、車でおよそ50〜60分。シャトルサービスはないため、事前手配の送迎か自分で運転する必要があります。ケーンクラチャン郡へ入る道路は整備されていますが、場所によっては道幅が狭くなります。座標12.8831, 99.7564を使ったGPSナビゲーションのご利用をおすすめします。`,
        rental_cta_context: `Jack Nicklaus Mountain Courseを含めて、Kaeng Krachan Country Clubでのラウンドをお考えですか。LENGOLFなら品質の確かなレンタルセットをご用意できます。バンコクからクラブを運ぶ手間をかけずに、国立公園に隣接するジャングルに縁取られたこのレイアウトに挑めます。`,
      },
    },
  },
  status: 'published',
  published_at: '2026-04-20',
}
