import type { GolfCourse } from '@/types/golf-courses'

export const course: GolfCourse = {
  slug: 'north-hill-chiang-mai',
  region: 'chiang-mai',
  name: `North Hill Golf Club Chiang Mai`,
  province: `Chiang Mai`,
  designer: null,
  holes: 18,
  par: 72,
  year_opened: 2015,
  green_fee_weekday_thb: 3400,
  green_fee_weekend_thb: 3400,
  // All-in package, per this file's own EN prose: all-in green fee package ~3,400 THB including caddie and cart. The rate
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
  website: 'https://www.northhillchiangmai.com/',
  phone: null,
  latitude: 18.6956,
  longitude: 98.9582,
  coordinates_verified_at: '2026-07-31',
  distance_from_bangkok_km: 700,
  drive_time_from_bangkok_min: null,
  google_maps_url: null,
  club_rental_available: true,
  club_rental_fee_thb: null,
  club_rental_brands: null,
  schema_markup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"GolfCourse\",\n  \"name\": \"North Hill Golf Club Chiang Mai\",\n  \"url\": \"https://len.golf/golf-courses/chiang-mai/north-hill-chiang-mai\",\n  \"description\": null,\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"addressLocality\": \"Chiang Mai\",\n    \"addressCountry\": \"TH\"\n  },\n  \"geo\": {\n    \"@type\": \"GeoCoordinates\",\n    \"latitude\": 18.7142,\n    \"longitude\": 98.96\n  },\n  \"priceRange\": \"฿฿฿\",\n  \"sameAs\": [\n    \"https://www.northhillchiangmai.com/\"\n  ],\n  \"amenityFeature\": [\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Driving Range\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Caddie Required\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Golf Cart\",\n      \"value\": true\n    }\n  ]\n}",
  prose: {
    overview: `North Hill Golf Club Chiang Mai is the most recently developed 18-hole course in the Chiang Mai area, having expanded from 9 holes to a full 18-hole layout in November 2015. Located in Ban Waen, Hang Dong district — approximately 15 minutes south of Chiang Mai International Airport — it is one of the most conveniently positioned courses for travellers arriving at CNX. The course operates as part of the North Hill City Resort complex, which also encompasses a spa, fitness centre, deluxe driving range, bar and restaurant. At 6,789 yards and par 72, it is a mid-length layout suited to a range of handicaps.`,
    layout_and_experience: `The course was originally a 9-hole private club and the expansion to 18 holes created a parkland-style layout with water hazards and bunkering throughout. The 6,789-yard total is comfortable for most standards of player from the back tees. The Hang Dong location places the course on flat-to-gentle terrain. The driving range at North Hill stands out for its quality and range of facilities.`,
    tips: `The all-in green fee package (approximately 3,400 THB including caddie and cart) simplifies budgeting. Book through the official website (northhillchiangmai.com) for current rates. At 15 minutes from CNX airport, this is an ideal first or last round on a Chiang Mai golf trip. The deluxe driving range is a good warm-up option before the round.`,
    location_and_access: `North Hill Golf Club is located in Ban Waen, Hang Dong district, approximately 15 minutes south of Chiang Mai International Airport (CNX). Visitors from Bangkok fly to CNX (approximately 1 hour 10 minutes from Suvarnabhumi or Don Mueang) — driving the 700 kilometres from Bangkok is not practical. A Grab taxi from CNX takes approximately 15 minutes.`,
    rental_cta_context: `Stopping off at North Hill Golf Club on your Chiang Mai golf trip? Rent premium clubs in Bangkok — delivered to your hotel before you fly — so you can jump straight from the airport to the first tee without the hassle of checked baggage.`,
  },
  locales: {
    en: {
      title: `North Hill Golf Club Chiang Mai — Green Fees, Course Guide & Golf Club Rentals`,
      meta_description: `North Hill Golf Club Chiang Mai green fees, course overview, tips, and how to arrange golf club rentals delivered to your Bangkok hotel.`,
    },
    th: {
      title: `North Hill Golf Club Chiang Mai — แพ็กเกจรวมทุกอย่าง รีวิวสนาม และเช่าไม้กอล์ฟ`,
      meta_description: `แพ็กเกจรวมทุกอย่างที่ North Hill Golf Club Chiang Mai ประมาณ 3,400 บาท รวมค่ากรีนฟี แคดดี้ และรถกอล์ฟ สนาม 18 หลุม พาร์ 72 ระยะ 6,789 หลา ห่างจากท่าอากาศยานเชียงใหม่ประมาณ 15 นาที พร้อมบริการเช่าไม้กอล์ฟส่งถึงโรงแรมในกรุงเทพฯ`,
      prose: {
        overview: `North Hill Golf Club Chiang Mai เป็นสนาม 18 หลุมที่พัฒนาขึ้นใหม่ล่าสุดในพื้นที่เชียงใหม่ โดยขยายจาก 9 หลุมเป็น 18 หลุมเต็มรูปแบบเมื่อเดือนพฤศจิกายน 2015 สนามตั้งอยู่ที่บ้านแหวน อำเภอหางดง ห่างจากท่าอากาศยานนานาชาติเชียงใหม่ไปทางใต้ประมาณ 15 นาที จึงเป็นหนึ่งในสนามที่มีทำเลสะดวกที่สุดสำหรับผู้ที่เดินทางมาลงที่ CNX สนามแห่งนี้ดำเนินการเป็นส่วนหนึ่งของคอมเพล็กซ์ North Hill City Resort ซึ่งประกอบด้วยสปา ฟิตเนสเซ็นเตอร์ สนามไดรฟ์ระดับดีลักซ์ บาร์ และร้านอาหาร ด้วยระยะ 6,789 หลาและพาร์ 72 จึงจัดเป็นเลย์เอาต์ระยะกลางที่เหมาะกับผู้เล่นหลากหลายระดับแฮนดิแคป`,
        layout_and_experience: `เดิมทีสนามแห่งนี้เป็นสโมสรส่วนตัวขนาด 9 หลุม และการขยายเป็น 18 หลุมทำให้เกิดเลย์เอาต์สไตล์พาร์กแลนด์ที่มีอุปสรรคน้ำและบังเกอร์กระจายอยู่ทั่วสนาม ระยะรวม 6,789 หลาถือว่ากำลังสบายสำหรับผู้เล่นส่วนใหญ่แม้จะตีจากแท่นทีหลังสุด ทำเลในอำเภอหางดงทำให้สนามอยู่บนภูมิประเทศที่ราบเรียบไปจนถึงลาดเอียงเล็กน้อย ส่วนสนามไดรฟ์ของ North Hill นั้นโดดเด่นทั้งในด้านคุณภาพและความหลากหลายของสิ่งอำนวยความสะดวก`,
        tips: `แพ็กเกจรวมทุกอย่าง (ประมาณ 3,400 บาท รวมแคดดี้และรถกอล์ฟ) ช่วยให้วางแผนงบประมาณได้ง่าย ควรจองผ่านเว็บไซต์อย่างเป็นทางการ (northhillchiangmai.com) เพื่อดูอัตราค่าบริการล่าสุด ด้วยระยะเวลาเดินทางเพียง 15 นาทีจากสนามบิน CNX สนามนี้จึงเหมาะอย่างยิ่งกับการออกรอบวันแรกหรือวันสุดท้ายของทริปกอล์ฟเชียงใหม่ ส่วนสนามไดรฟ์ระดับดีลักซ์ก็เป็นตัวเลือกที่ดีสำหรับการวอร์มอัพก่อนออกรอบ`,
        location_and_access: `North Hill Golf Club ตั้งอยู่ที่บ้านแหวน อำเภอหางดง จังหวัดเชียงใหม่ ห่างจากท่าอากาศยานนานาชาติเชียงใหม่ (CNX) ไปทางใต้ประมาณ 15 นาที ผู้ที่เดินทางจากกรุงเทพฯ ใช้วิธีบินไป CNX (ประมาณ 1 ชั่วโมง 10 นาทีจากสนามบินสุวรรณภูมิหรือสนามบินดอนเมือง) เพราะการขับรถระยะทาง 700 กิโลเมตรจากกรุงเทพฯ ไม่สะดวกในทางปฏิบัติ การเรียก Grab จาก CNX มายังสนามใช้เวลาประมาณ 15 นาที`,
        rental_cta_context: `วางแผนแวะออกรอบที่ North Hill Golf Club ระหว่างทริปกอล์ฟเชียงใหม่ของคุณอยู่ใช่ไหม เช่าไม้กอล์ฟคุณภาพพรีเมียมที่กรุงเทพฯ พร้อมบริการส่งถึงโรงแรมก่อนคุณขึ้นเครื่อง ให้คุณเดินทางจากสนามบินไปยังแท่นทีแรกได้เลยโดยไม่ต้องยุ่งยากกับการโหลดกระเป๋าใต้ท้องเครื่อง`,
      },
    },
    ko: {
      title: `North Hill Golf Club Chiang Mai 올인클루시브 패키지 — 치앙마이 18홀 코스 가이드`,
      meta_description: `North Hill Golf Club Chiang Mai 올인클루시브 패키지는 약 3,400바트로, 그린피에 캐디와 카트까지 포함돼요. 치앙마이 국제공항에서 남쪽으로 약 15분 거리인 6,789야드 파 72 코스 안내와, 비행기를 타기 전 방콕 호텔로 배달되는 LENGOLF 클럽 대여를 정리했어요.`,
      prose: {
        overview: `North Hill Golf Club Chiang Mai는 치앙마이 일대에서 가장 최근에 조성된 18홀 코스예요. 2015년 11월에 9홀에서 온전한 18홀 레이아웃으로 확장했습니다. Hang Dong 지구의 Ban Waen에 자리하고 있고 치앙마이 국제공항에서 남쪽으로 약 15분 거리라, CNX로 들어오는 여행자에게 가장 편리한 위치의 코스 가운데 하나예요. 코스는 North Hill City Resort 복합 단지의 일부로 운영되며, 단지 안에는 스파와 피트니스 센터, 고급 드라이빙 레인지, 바와 레스토랑도 함께 있습니다. 전장 6,789야드에 파 72로, 다양한 핸디캡의 골퍼에게 두루 맞는 중거리 레이아웃입니다.`,
        layout_and_experience: `원래는 9홀 프라이빗 클럽이었고, 18홀로 확장하면서 코스 곳곳에 워터 해저드와 벙커를 배치한 파크랜드 스타일의 레이아웃이 만들어졌어요. 총 6,789야드는 백 티에서 쳐도 대부분의 실력대가 부담 없이 소화할 만한 거리입니다. Hang Dong 지구라는 입지 덕분에 코스는 평탄하거나 완만한 지형 위에 놓여 있어요. North Hill 코스의 드라이빙 레인지는 품질과 시설의 다양성 면에서 특히 눈에 띕니다.`,
        tips: `올인클루시브 패키지 요금(캐디와 카트를 포함해 약 3,400바트)이라 예산을 잡기가 간단해요. 최신 요금은 공식 웹사이트(northhillchiangmai.com)에서 확인하고 예약하세요. CNX 공항에서 15분 거리라, 치앙마이 골프 여행의 첫 라운딩이나 마지막 라운딩으로 넣기에 알맞습니다. 라운딩 전 몸을 푸는 데는 고급 드라이빙 레인지가 좋은 선택이에요.`,
        location_and_access: `North Hill Golf Club은 치앙마이주 Hang Dong 지구의 Ban Waen에 있고, 치앙마이 국제공항(CNX)에서 남쪽으로 약 15분 거리예요. 방콕에서 오는 분은 CNX행 항공편이 기본이며, 수완나품 공항이나 돈므앙 공항에서 약 1시간 10분 걸립니다. 방콕에서 700km를 차로 달리는 건 현실적이지 않아요. CNX에서 Grab 택시를 타면 약 15분 걸립니다.`,
        rental_cta_context: `치앙마이 골프 여행 중 North Hill Golf Club 라운딩을 계획하고 있다면, 방콕에서 프리미엄 클럽을 빌리는 방법이 편해요. 비행기를 타기 전 방콕 호텔까지 배달해 드리니, 수하물을 부치는 번거로움 없이 공항에서 곧장 첫 티로 향할 수 있습니다.`,
      },
    },
    zh: {
      title: `North Hill Golf Club Chiang Mai全包套餐 — 清迈18洞球场攻略与球杆租借`,
      meta_description: `North Hill Golf Club Chiang Mai全包套餐约3,400泰铢，果岭费之外还含球童与球车。球场在清迈国际机场以南约15分钟车程处，全长6,789码、标准杆72，另有登机前送抵曼谷酒店的LENGOLF球杆租借。`,
      prose: {
        overview: `North Hill Golf Club Chiang Mai是清迈一带最新开发的18洞球场，2015年11月由9洞扩建为完整的18洞布局。球场位于Hang Dong县的Ban Waen，在清迈国际机场以南约15分钟车程处，对抵达CNX的旅客来说是位置最方便的球场之一。它作为North Hill City Resort综合度假区的一部分运营，园区内还有水疗中心、健身中心、高规格练习场、酒吧与餐厅。全长6,789码、标准杆72，属于中等长度的布局，适合不同差点的球手。`,
        layout_and_experience: `球场原本是一座9洞的私人俱乐部，扩建为18洞之后形成了园林式的布局，整座球场分布着水障碍与沙坑。6,789码的总长度即便从后发球台出发，对大多数水平的球手来说也算轻松。Hang Dong的位置让球场坐落在平坦到略有起伏的地形上。North Hill的练习场在品质与设施的丰富程度上都相当出色。`,
        tips: `全包套餐（约3,400泰铢，已含球童与球车）让预算变得简单。请通过官方网站（northhillchiangmai.com）预订并查看最新报价。距CNX机场只有15分钟车程，很适合安排成清迈高尔夫行程里的第一场或最后一场球。打球前想热身的话，高规格的练习场是个不错的选择。`,
        location_and_access: `North Hill Golf Club位于清迈府Hang Dong县的Ban Waen，在清迈国际机场（CNX）以南约15分钟车程处。从曼谷前来通常是飞往CNX，自素万那普机场或廊曼机场出发约1小时10分钟；从曼谷开车700公里并不现实。从CNX叫一辆Grab约15分钟即可抵达球场。`,
        rental_cta_context: `打算在清迈高尔夫行程中到North Hill Golf Club打一场吗？可以在曼谷租借高级球杆——登机前送到你在曼谷的酒店——这样下了飞机就能直奔第一洞发球台，不必再为托运球包费心。`,
      },
    },
    ja: {
      title: `North Hill Golf Club Chiang Mai（チェンマイ）— パッケージ料金・コース紹介・クラブレンタル`,
      meta_description: `オールインクルーシブのパッケージ料金は約3,400THBで、グリーンフィーにキャディーとカートが含まれます。North Hill Golf Club Chiang Maiはチェンマイ国際空港から南へ約15分、6,789ヤード・パー72の18ホールコースです。搭乗前にバンコクのホテルへ届くLENGOLFのクラブレンタルもご案内します。`,
      prose: {
        overview: `North Hill Golf Club Chiang Maiは、チェンマイエリアで最も新しく開発された18ホールコース。2015年11月に9ホールから18ホールのフルレイアウトへ拡張されました。ハーンドン郡のバーンウェーンに位置し、チェンマイ国際空港から南へ約15分と、CNXに到着する旅行者にとって最も便利な立地のコースのひとつです。コースはNorth Hill City Resortの複合施設の一部として運営されており、敷地内にはスパ、フィットネスセンター、デラックスなドライビングレンジ、バー、レストランも揃います。6,789ヤード・パー72で、幅広いハンディキャップの層に合うミドルレングスのレイアウトとなっています。`,
        layout_and_experience: `もとは9ホールのプライベートクラブで、18ホールへの拡張によって、コース全体にウォーターハザードとバンカーを配したパークランドスタイルのレイアウトが生まれました。6,789ヤードという総距離は、バックティーからでも大半のレベルのプレーヤーにとって無理のない長さです。ハーンドンという立地から、コースは平坦からゆるやかな起伏の地形に広がります。North Hillのドライビングレンジは、その品質と施設の充実ぶりで際立っています。`,
        tips: `オールインクルーシブのパッケージ料金（キャディーとカート込みで約3,400THB）なので、予算が立てやすくなっています。最新の料金は公式サイト（northhillchiangmai.com）でご確認のうえ、そちらからご予約ください。CNX空港から15分という近さで、チェンマイのゴルフ旅行の初日または最終日のラウンドに最適です。ラウンド前のウォームアップには、デラックスなドライビングレンジが良い選択肢となります。`,
        location_and_access: `North Hill Golf Clubはチェンマイ県ハーンドン郡のバーンウェーンにあり、チェンマイ国際空港（CNX）から南へ約15分です。バンコクからはCNXへの空路が基本で、スワンナプーム空港またはドンムアン空港から約1時間10分。バンコクから700kmを車で走るのは現実的ではありません。CNXからGrabタクシーを使えば約15分で到着します。`,
        rental_cta_context: `チェンマイのゴルフ旅行でNorth Hill Golf Clubに立ち寄る予定なら、バンコクでのプレミアムクラブレンタルが便利です。搭乗前にバンコクのホテルまでお届けするので、クラブを預け入れ荷物にする手間なく、空港からそのまま1番ティーへ向かえます。`,
      },
    },
  },
  status: 'published',
  published_at: '2026-04-21',
}
