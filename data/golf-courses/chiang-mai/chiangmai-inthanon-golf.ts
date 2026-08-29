import type { GolfCourse } from '@/types/golf-courses'

export const course: GolfCourse = {
  slug: 'chiangmai-inthanon-golf',
  region: 'chiang-mai',
  name: `Chiangmai Inthanon Golf & Natural Resort`,
  province: `Chiang Mai`,
  designer: `Supachai Silamom`,
  holes: 18,
  par: 72,
  year_opened: 2009,
  green_fee_weekday_thb: 1400,
  green_fee_weekend_thb: 1400,
  // All-in package, per this file's own EN prose: 1,400 THB all-in (green fee, caddie, and cart). The rate
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
  website: null,
  phone: '+66 52 001 645',
  latitude: 18.4704,
  longitude: 98.7415,
  coordinates_verified_at: '2026-07-31',
  distance_from_bangkok_km: 700,
  drive_time_from_bangkok_min: null,
  google_maps_url: null,
  club_rental_available: true,
  club_rental_fee_thb: null,
  club_rental_brands: null,
  schema_markup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"GolfCourse\",\n  \"name\": \"Chiangmai Inthanon Golf & Natural Resort\",\n  \"url\": \"https://len.golf/golf-courses/chiang-mai/chiangmai-inthanon-golf\",\n  \"description\": null,\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"addressLocality\": \"Chiang Mai\",\n    \"addressCountry\": \"TH\"\n  },\n  \"geo\": {\n    \"@type\": \"GeoCoordinates\",\n    \"latitude\": 18.42,\n    \"longitude\": 98.67\n  },\n  \"telephone\": \"+66 52 001 645\",\n  \"priceRange\": \"฿฿฿\",\n  \"amenityFeature\": [\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Driving Range\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Caddie Required\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Golf Cart\",\n      \"value\": true\n    }\n  ]\n}",
  prose: {
    overview: `Chiangmai Inthanon Golf & Natural Resort is an 18-hole, par-72 course opened in 2009 in the Chom Thong area, approximately 40 kilometres south of Chiang Mai city on the road toward Doi Inthanon — Thailand's highest mountain. Designed by Thai architect Supachai Silamom, the course stretches to 7,268 yards, making it the longest layout in the Chiang Mai region at the time of its opening. The course is positioned to offer views of Doi Inthanon's forested slopes from several fairways — a setting that gives rounds here a distinctly remote, nature-immersed character. At 1,400 THB all-in (green fee, caddie, and cart), this is one of the most affordable championship layouts in Northern Thailand.`,
    layout_and_experience: `The routing uses the gently undulating terrain of the Chom Thong valley, with Doi Inthanon's ridgeline providing the scenic backdrop. The design incorporates natural water features and preserves existing tree cover. The 7,268-yard total is challenging from the back tees and demands both length and accuracy. The Chom Thong location means the course sees less traffic than the Mae Rim or city-adjacent options, resulting in quieter rounds and better pace of play year-round.`,
    tips: `The all-in morning green fee is 1,400 THB (including caddie and cart) — afternoon rounds after 1 PM are 1,300 THB. This represents exceptional value for an 18-hole championship round. Combine with a visit to Doi Inthanon National Park on the same day — the park entrance is nearby. The Chom Thong valley can be slightly cooler than Chiang Mai city in cool season (November–February), so bring a light layer for early holes.`,
    location_and_access: `Chiangmai Inthanon Golf & Natural Resort is located in Chom Thong, approximately 40 kilometres south of Chiang Mai city on Highway 108 (Hod Road). Visitors from Bangkok fly to Chiang Mai International Airport (CNX), approximately 1 hour 10 minutes from Suvarnabhumi or Don Mueang — driving the 700 kilometres from Bangkok is not practical. From CNX or central Chiang Mai, the drive takes approximately 40 minutes by private car or Grab taxi via Route 108 south.`,
    rental_cta_context: `Playing Chiangmai Inthanon Golf & Natural Resort near Doi Inthanon on your Chiang Mai trip? Rent premium clubs in Bangkok — delivered to your hotel before you fly — so you can make the most of this scenic course without airline baggage complications.`,
  },
  locales: {
    en: {
      title: `Chiangmai Inthanon Golf & Natural Resort — Green Fees, Course Guide & Golf Club Rentals`,
      meta_description: `Chiangmai Inthanon Golf & Natural Resort green fees, course overview, tips, and how to arrange golf club rentals delivered to your Bangkok hotel.`,
    },
    th: {
      title: `Chiangmai Inthanon Golf & Natural Resort — แพ็กเกจรวมทุกอย่าง รีวิวสนาม และเช่าไม้กอล์ฟ`,
      meta_description: `Chiangmai Inthanon Golf & Natural Resort จอมทอง เชียงใหม่: สนาม 18 หลุม พาร์ 72 ยาว 7,268 หลา แพ็กเกจรวมทุกอย่าง 1,400 บาท รวมค่ากรีนฟี ค่าแคดดี้ และรถกอล์ฟ พร้อมบริการเช่าไม้กอล์ฟส่งถึงโรงแรมในกรุงเทพฯ`,
      prose: {
        overview: `Chiangmai Inthanon Golf & Natural Resort เป็นสนามกอล์ฟ 18 หลุม พาร์ 72 ที่เปิดให้บริการในปี 2009 ในพื้นที่อำเภอจอมทอง ห่างจากตัวเมืองเชียงใหม่ไปทางใต้ประมาณ 40 กิโลเมตร บนเส้นทางที่มุ่งสู่ดอยอินทนนท์ ยอดเขาที่สูงที่สุดของประเทศไทย สนามออกแบบโดย Supachai Silamom สถาปนิกสนามกอล์ฟชาวไทย มีความยาวรวมถึง 7,268 หลา จึงเป็นสนามที่ยาวที่สุดในเขตเชียงใหม่ ณ ช่วงเวลาที่เปิดให้บริการ ผังสนามวางไว้ให้มองเห็นแนวป่าบนไหล่เขาดอยอินทนนท์ได้จากหลายแฟร์เวย์ การออกรอบที่นี่จึงให้ความรู้สึกห่างไกลผู้คนและแนบชิดธรรมชาติอย่างชัดเจน ด้วยแพ็กเกจรวมทุกอย่าง 1,400 บาท (รวมค่ากรีนฟี ค่าแคดดี้ และรถกอล์ฟ) สนามแห่งนี้จึงเป็นหนึ่งในสนามระดับแชมเปียนชิพที่ราคาย่อมเยาที่สุดในภาคเหนือของไทย`,
        layout_and_experience: `ผังสนามใช้ประโยชน์จากภูมิประเทศลอนลาดของหุบเขาจอมทอง โดยมีแนวสันเขาดอยอินทนนท์เป็นฉากหลัง การออกแบบผสานแหล่งน้ำธรรมชาติเข้ามาเป็นส่วนหนึ่งของสนาม และรักษาแนวต้นไม้เดิมเอาไว้ ความยาวรวม 7,268 หลาถือว่าท้าทายเมื่อเล่นจากแท่นทีหลัง และต้องการทั้งระยะและความแม่นยำ ทำเลที่จอมทองทำให้สนามมีผู้เล่นน้อยกว่าสนามแถบแม่ริมหรือสนามที่อยู่ติดตัวเมือง การออกรอบจึงเงียบสงบกว่าและจังหวะการเล่นลื่นไหลกว่าตลอดทั้งปี`,
        tips: `ค่าออกรอบช่วงเช้าแบบแพ็กเกจรวมทุกอย่างอยู่ที่ 1,400 บาท (รวมค่าแคดดี้และรถกอล์ฟ) ส่วนรอบบ่ายหลัง 13.00 น. อยู่ที่ 1,300 บาท นับว่าคุ้มค่าอย่างยิ่งสำหรับการออกรอบ 18 หลุมระดับแชมเปียนชิพ สามารถจัดโปรแกรมเที่ยวอุทยานแห่งชาติดอยอินทนนท์ต่อในวันเดียวกันได้ เพราะทางเข้าอุทยานอยู่ไม่ไกล หุบเขาจอมทองอาจเย็นกว่าตัวเมืองเชียงใหม่เล็กน้อยในช่วงฤดูหนาว (พฤศจิกายน-กุมภาพันธ์) จึงควรเตรียมเสื้อบางติดตัวไว้สำหรับหลุมแรก ๆ`,
        location_and_access: `Chiangmai Inthanon Golf & Natural Resort ตั้งอยู่ในอำเภอจอมทอง ห่างจากตัวเมืองเชียงใหม่ไปทางใต้ประมาณ 40 กิโลเมตร บนทางหลวงหมายเลข 108 (ถนนสายฮอด) ผู้ที่เดินทางจากกรุงเทพฯ ใช้วิธีบินไปท่าอากาศยานนานาชาติเชียงใหม่ (CNX) ซึ่งใช้เวลาประมาณ 1 ชั่วโมง 10 นาทีจากสนามบินสุวรรณภูมิหรือสนามบินดอนเมือง เพราะการขับรถระยะทาง 700 กิโลเมตรจากกรุงเทพฯ ไม่สะดวกในทางปฏิบัติ จาก CNX หรือใจกลางเมืองเชียงใหม่ ใช้เวลาขับรถประมาณ 40 นาทีด้วยรถส่วนตัวหรือ Grab ไปตามทางหลวงหมายเลข 108 มุ่งลงทางใต้`,
        rental_cta_context: `วางแผนออกรอบที่ Chiangmai Inthanon Golf & Natural Resort ใกล้ดอยอินทนนท์ในทริปเชียงใหม่ของคุณอยู่ใช่ไหม เช่าไม้กอล์ฟคุณภาพพรีเมียมที่กรุงเทพฯ พร้อมบริการส่งถึงโรงแรมก่อนคุณขึ้นเครื่อง ให้คุณเก็บเกี่ยวสนามวิวสวยแห่งนี้ได้อย่างเต็มที่โดยไม่ต้องยุ่งยากกับการโหลดกระเป๋ากอล์ฟกับสายการบิน`,
      },
    },
    ko: {
      title: `Chiangmai Inthanon Golf & Natural Resort 올인클루시브 패키지 — 치앙마이 18홀 코스 가이드와 클럽 대여`,
      meta_description: `Chiangmai Inthanon Golf & Natural Resort 코스 정보를 정리했어요. 치앙마이 시내에서 남쪽으로 약 40km, Doi Inthanon으로 향하는 길목의 18홀 파 72, 7,268야드 코스이고 그린피와 캐디피, 카트가 모두 포함된 1,400바트 올인클루시브 패키지예요. 방콕 호텔로 배달되는 클럽 대여도 함께 안내합니다.`,
      prose: {
        overview: `Chiangmai Inthanon Golf & Natural Resort 코스는 2009년에 문을 연 18홀 파 72 레이아웃이에요. 치앙마이 시내에서 남쪽으로 약 40km 떨어진 Chom Thong 일대, 태국에서 가장 높은 산인 Doi Inthanon으로 향하는 길목에 자리합니다. 코스를 설계한 사람은 태국인 코스 설계가 Supachai Silamom이며, 전장은 7,268야드에 이르러 개장 당시 치앙마이 지역에서 가장 긴 레이아웃이었어요. 여러 홀의 페어웨이에서 Doi Inthanon의 숲으로 덮인 산자락을 바라볼 수 있도록 배치해, 이곳의 라운딩에는 인적이 드문 곳에서 자연에 파묻히는 듯한 분위기가 뚜렷합니다. 그린피와 캐디피, 카트가 모두 포함된 1,400바트 올인클루시브 요금이라, 태국 북부에서 가장 저렴한 챔피언십 레이아웃으로 손꼽히는 곳이기도 해요.`,
        layout_and_experience: `루팅은 Chom Thong 계곡의 완만하게 굽이치는 지형을 그대로 활용하고, Doi Inthanon 능선이 배경을 이룹니다. 설계는 자연 그대로의 수공간을 끌어들이면서 원래 있던 나무들도 그대로 남겨 두었어요. 총 7,268야드라는 전장은 백 티에서 치면 만만치 않아, 거리와 정확도를 함께 요구합니다. Chom Thong이라는 위치 덕분에 Mae Rim이나 시내에 인접한 코스들보다 방문객이 적어, 연중 내내 라운딩이 한산하고 진행 속도도 더 좋은 편이에요.`,
        tips: `올인클루시브 오전 라운딩 요금은 캐디와 카트를 포함해 1,400바트이고, 오후 1시 이후 라운딩은 1,300바트예요. 18홀 챔피언십 라운딩치고는 대단히 좋은 값입니다. 같은 날 일정에 Doi Inthanon 국립공원 방문을 붙여도 좋아요. 공원 입구가 가깝습니다. Chom Thong 계곡은 서늘한 시즌(11~2월)에 치앙마이 시내보다 조금 더 선선할 수 있으니, 초반 홀을 위해 얇은 겉옷을 하나 챙겨 가세요.`,
        location_and_access: `Chiangmai Inthanon Golf & Natural Resort 코스는 치앙마이 시내에서 남쪽으로 약 40km 떨어진 Chom Thong에 있고, 108번 국도(Hod Road) 변에 자리합니다. 방콕에서 오는 분은 치앙마이 국제공항(CNX)행 항공편이 기본이며, 수완나품 공항이나 돈므앙 공항에서 약 1시간 10분 걸려요. 방콕에서 700km를 차로 달리는 건 현실적이지 않습니다. CNX나 치앙마이 시내 중심부에서는 자가용이나 Grab 택시로 108번 국도를 따라 남쪽으로 약 40분이면 닿습니다.`,
        rental_cta_context: `치앙마이 여행 중 Doi Inthanon 자락의 Chiangmai Inthanon Golf & Natural Resort 라운딩을 계획하고 있다면, 방콕에서 프리미엄 클럽을 빌리는 방법이 편해요. 비행기를 타기 전 방콕 호텔까지 배달해 드리니, 항공사 수하물 문제로 번거로워질 일 없이 이 경치 좋은 코스를 제대로 즐길 수 있습니다.`,
      },
    },
    zh: {
      title: `Chiangmai Inthanon Golf & Natural Resort全包套餐与球场攻略 — 清迈18洞`,
      meta_description: `Chiangmai Inthanon Golf & Natural Resort位于清迈以南约40公里的Chom Thong，是一座18洞、标准杆72、全长7,268码的球场。1,400泰铢的全包套餐已含果岭费、球童与球车，另附登机前送抵曼谷酒店的球杆租借。`,
      prose: {
        overview: `Chiangmai Inthanon Golf & Natural Resort是一座18洞、标准杆72的球场，2009年开业，位于Chom Thong一带，距清迈市区以南约40公里，就在通往泰国最高峰Doi Inthanon的路上。球场由泰国球场设计师Supachai Silamom设计，全长达7,268码，在开业当时是清迈地区最长的一座球场。它的布局刻意让多条球道都能望见Doi Inthanon满覆林木的山坡，因此在这里打球会有一种明显的远离尘嚣、置身自然的感觉。1,400泰铢的全包价（含果岭费、球童与球车）也让它成为泰国北部最实惠的锦标赛级球场之一。`,
        layout_and_experience: `球场的路线顺着Chom Thong河谷起伏平缓的地势展开，Doi Inthanon的山脊线则构成远景。设计把天然的水景纳入其中，也保留了原有的林木。7,268码的总长度从后发球台打相当有挑战性，对距离和准度都有要求。位于Chom Thong意味着这里的人流比Mae Rim一带或紧邻市区的球场要少，所以全年打起球来都更清静，节奏也更顺畅。`,
        tips: `上午的全包价是1,400泰铢（含球童与球车），下午1点以后开球则为1,300泰铢。对一场18洞锦标赛级的球来说，这个价格相当划算。你可以把同一天的行程接上Doi Inthanon国家公园——公园入口就在附近。凉季（11–2月）的Chom Thong河谷会比清迈市区略凉一些，开头几洞不妨备一件薄外套。`,
        location_and_access: `Chiangmai Inthanon Golf & Natural Resort位于Chom Thong，距清迈市区以南约40公里，就在108号公路（Hod Road）旁。从曼谷前来通常是飞往清迈国际机场（CNX），自素万那普机场或廊曼机场出发约1小时10分钟；从曼谷开车700公里并不现实。从CNX或清迈市中心出发，自驾或叫Grab沿108号公路南行约40分钟即可抵达。`,
        rental_cta_context: `打算在清迈行程中到Doi Inthanon附近的Chiangmai Inthanon Golf & Natural Resort打一场吗？可以在曼谷租借高级球杆——登机前送到你在曼谷的酒店——这样就不必被航空公司的球包托运问题绊住，也能尽情享受这座景色出众的球场。`,
      },
    },
    ja: {
      title: `Chiangmai Inthanon Golf & Natural Resort（チェンマイ）— パッケージ料金・コース紹介・クラブレンタル`,
      meta_description: `Chiangmai Inthanon Golf & Natural Resortは、チェンマイ市街から南へ約40km、ドイ・インタノンへ向かう道沿いにある18ホール・パー72、7,268ヤードのコースです。1,400THBのオールインクルーシブにはグリーンフィー、キャディーフィー、カートが含まれます。搭乗前にバンコクのホテルへ届くクラブレンタルもご案内します。`,
      prose: {
        overview: `Chiangmai Inthanon Golf & Natural Resortは、2009年に開場した18ホール・パー72のコースです。チェンマイ市街から南へ約40km、タイ最高峰ドイ・インタノンへ向かう道沿いのチョムトン一帯に位置します。設計はタイ人コース設計家のSupachai Silamom。全長は7,268ヤードに達し、開場当時はチェンマイ地域で最も長いレイアウトでした。複数のホールのフェアウェイからドイ・インタノンの森に覆われた山肌を望めるよう配置されており、ここでのラウンドには人里から離れて自然に包まれるような趣があります。グリーンフィー、キャディーフィー、カートを含めて1,400THBというオールインの料金で、タイ北部でも屈指の手頃さを誇るチャンピオンシップコースといえます。`,
        layout_and_experience: `ルーティングはチョムトンの谷が見せる緩やかな起伏の地形を活かし、ドイ・インタノンの稜線が背景を成します。設計は自然のままの水辺を取り込み、もとからある樹木も残しています。7,268ヤードという総距離はバックティーからだと手強く、飛距離と正確性の両方が求められます。チョムトンという立地のため、メーリムや市街地に近いコースより来場者が少なく、一年を通してラウンドは静かで、進行もスムーズです。`,
        tips: `午前のオールインクルーシブ料金は1,400THB（キャディーとカート込み）、13時以降の午後のラウンドは1,300THBです。18ホールのチャンピオンシップラウンドとしては、際立ったコストパフォーマンスといえるでしょう。同じ日にドイ・インタノン国立公園の観光を組み合わせるのもおすすめで、公園の入口はすぐ近くにあります。チョムトンの谷は涼しい時期（11〜2月）にチェンマイ市街よりやや冷え込むことがあるため、序盤のホール用に薄手の羽織るものを一枚お持ちください。`,
        location_and_access: `Chiangmai Inthanon Golf & Natural Resortはチョムトンにあり、チェンマイ市街から南へ約40km、国道108号線（ホード通り）沿いに位置します。バンコクからはチェンマイ国際空港（CNX）への空路が基本で、スワンナプーム空港またはドンムアン空港から約1時間10分。バンコクから700kmを車で走るのは現実的ではありません。CNXまたはチェンマイ中心部からは、自家用車またはGrabタクシーで国道108号線を南下し、約40分で到着します。`,
        rental_cta_context: `チェンマイ旅行でドイ・インタノン近くのChiangmai Inthanon Golf & Natural Resortでのラウンドを予定しているなら、バンコクでのプレミアムクラブレンタルが便利です。搭乗前にバンコクのホテルまでお届けするので、航空会社の手荷物の手間をかけずに、この景観に優れたコースを存分に楽しめます。`,
      },
    },
  },
  status: 'published',
  published_at: '2026-04-21',
}
