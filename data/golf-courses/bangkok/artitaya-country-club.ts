import type { GolfCourse } from '@/types/golf-courses'

export const course: GolfCourse = {
  slug: 'artitaya-country-club',
  region: 'bangkok',
  name: `Artitaya Country Club`,
  province: `Nakhon Nayok`,
  designer: `Jack Tuthill`,
  holes: 18,
  par: 72,
  year_opened: 1994,
  green_fee_weekday_thb: 1200,
  green_fee_weekend_thb: 1400,
  fees_verified_at: '2026-07-30',
  // All-in package, per this file's own EN prose: "Published visitor rates are
  // package prices that already include caddie and cart - around 1,200 THB
  // weekdays and 1,400 THB weekends", which is exactly the pair typed above.
  // The rate BASIS (weekday/weekend) is unchanged; this only stops generated
  // copy calling the number a bare "green fee".
  fee_is_package: true,
  // Zero, not null: the caddie costs this golfer nothing on top of the package,
  // and SpecTable renders 0 as "Included" where null renders an em dash.
  caddie_fee_thb: 0,
  // Zero for the same reason as caddie_fee_thb above - bundled into the package.
  cart_fee_thb: 0,
  caddie_required: true,
  cart_required: false,
  driving_range: true,
  website: 'http://www.artitaya.com',
  phone: '+66 2 633 8103',
  latitude: 14.108,
  longitude: 101.038,
  distance_from_bangkok_km: 90,
  drive_time_from_bangkok_min: 75,
  google_maps_url: null,
  club_rental_available: true,
  club_rental_fee_thb: null,
  club_rental_brands: null,
  schema_markup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"GolfCourse\",\n  \"name\": \"Artitaya Country Club\",\n  \"url\": \"https://len.golf/golf-courses/bangkok/artitaya-country-club\",\n  \"description\": null,\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"addressLocality\": \"Nakhon Nayok\",\n    \"addressCountry\": \"TH\"\n  },\n  \"geo\": {\n    \"@type\": \"GeoCoordinates\",\n    \"latitude\": 14.108,\n    \"longitude\": 101.038\n  },\n  \"telephone\": \"+66 2 633 8103\",\n  \"priceRange\": \"฿\",\n  \"sameAs\": [\n    \"https://maps.google.com/?q=14.108,101.038\",\n    \"http://www.artitaya.com\"\n  ],\n  \"amenityFeature\": [\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Driving Range\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Caddie Required\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Golf Cart\",\n      \"value\": false\n    }\n  ]\n}",
  prose: {
    overview: `Artitaya Country Club — formerly Bangkok Royal Country Club — is a 36-hole resort complex in Ongkharak, Nakhon Nayok province, about 75–90 km northeast of Bangkok. Designed by Jack Tuthill (who has credits at courses including Kemper Lakes in the USA), the 18-hole championship course opened in 1994 and offers solid value for the Bangkok market: published visitor packages run around 1,200 THB on weekdays and 1,400 THB on weekends for the 7,054-yard, par-72 layout, with green fee, caddie and cart bundled together. Monday–Tuesday and sport-day promotions can bring an all-in round below 1,000 THB. The resort is Korean-owned and approximately 90% of its guests are Korean nationals, which is worth factoring into expectations around pace of play.`,
    layout_and_experience: `The championship course stretches 7,054 yards from the blue tees — considerable length by any standard — laid out across flat parkland terrain with a well-balanced mix of water hazards and bunkers on most holes. Long, wide fairways are the rule, with strategic placement of ponds and lakes requiring accurate approach shots rather than penalty-style positioning. The greens are described as fast, which combined with the length makes the course a test even for low handicappers. The resort also features an Artitaya Golf Resort 36-hole section with a similar character. On-site facilities include accommodation, spa, massage, restaurants, and night golf capability — making it viable as a multi-day golf destination outside the city.`,
    tips: `Published visitor rates are package prices that already include caddie and cart — around 1,200 THB weekdays and 1,400 THB weekends, with Monday–Tuesday and sport-day promotions often under 1,000 THB all-in. Confirm the current rate when booking. The course is predominantly patronised by Korean golfers; if slow pace of play is a concern, aim for mid-week mornings. The resort is about 75 minutes by road from central Bangkok — plan an early departure. Night golf is available, which is a useful escape from midday heat. Club rental is available on-site, though specific brands and fees are best confirmed directly with the resort.`,
    location_and_access: `Artitaya Country Club is located at 16 Moo 10, Rangsit-Ongkarak Road (Klong 14, Km. 9), Ongkharak, Nakhon Nayok 26120. Nakhon Nayok is northeast of Bangkok, accessible via Highway 305 (Rangsit–Nakhon Nayok Road). The drive from central Bangkok is approximately 90 km and 75 minutes by car in reasonable traffic. There is no public transport serving the course; a private car, rental, or taxi is the only practical option. The scenic countryside setting near the foothills of Nakhon Nayok makes the drive pleasant.`,
    rental_cta_context: `Artitaya's value-priced all-in packages leave room in the budget for better equipment — pair the round with LENGOLF's premium rental clubs from Bangkok, delivered to your hotel the night before you drive out to Nakhon Nayok.`,
  },
  locales: {
    en: {
      title: `Artitaya Country Club — Green Fees, Course Guide & Golf Club Rentals`,
      meta_description: `Artitaya Country Club green fees, course overview, tips, and how to arrange golf club rentals delivered to your Bangkok hotel.`,
    },
    th: {
      title: `Artitaya Country Club นครนายก — ค่าแพ็กเกจออกรอบ รีวิวสนาม และเช่าไม้กอล์ฟ`,
      meta_description: `แพ็กเกจผู้มาเยือน Artitaya Country Club ประมาณ 1,200 บาทวันธรรมดา และ 1,400 บาทวันเสาร์อาทิตย์ รวมค่ากรีนฟี แคดดี้ และรถกอล์ฟ สนามแชมเปียนชิพ 7,054 หลา พาร์ 72 ที่องครักษ์ นครนายก พร้อมบริการเช่าไม้กอล์ฟส่งถึงโรงแรมในกรุงเทพฯ`,
      prose: {
        overview: `Artitaya Country Club หรือชื่อเดิมคือ Bangkok Royal Country Club เป็นคอมเพล็กซ์รีสอร์ตกอล์ฟ 36 หลุมในอำเภอองครักษ์ จังหวัดนครนายก ห่างจากกรุงเทพฯ ไปทางตะวันออกเฉียงเหนือประมาณ 75-90 กิโลเมตร สนามแชมเปียนชิพ 18 หลุมออกแบบโดย Jack Tuthill (ผู้มีผลงานในสนามต่าง ๆ รวมถึง Kemper Lakes ในสหรัฐอเมริกา) เปิดให้บริการเมื่อปี 1994 และให้ความคุ้มค่าที่ดีสำหรับตลาดกรุงเทพฯ แพ็กเกจสำหรับผู้มาเยือนที่ประกาศไว้อยู่ที่ประมาณ 1,200 บาทในวันธรรมดา และ 1,400 บาทในวันเสาร์อาทิตย์ สำหรับเลย์เอาต์ระยะ 7,054 หลา พาร์ 72 โดยรวมค่ากรีนฟี แคดดี้ และรถกอล์ฟไว้ด้วยกันแล้ว โปรโมชันวันจันทร์-อังคารและสปอร์ตเดย์อาจทำให้การออกรอบแบบรวมทุกอย่างลงมาต่ำกว่า 1,000 บาท รีสอร์ตแห่งนี้มีเจ้าของเป็นชาวเกาหลี และผู้ใช้บริการประมาณ 90% เป็นชาวเกาหลี ซึ่งเป็นสิ่งที่ควรนำมาพิจารณาในการตั้งความคาดหวังเรื่องจังหวะการเล่น`,
        layout_and_experience: `สนามแชมเปียนชิพมีระยะ 7,054 หลาจากแท่นทีสีน้ำเงิน ซึ่งถือว่ายาวไม่ว่าจะวัดด้วยมาตรฐานใด วางตัวอยู่บนภูมิประเทศแบบพาร์กแลนด์ที่ราบเรียบ พร้อมส่วนผสมที่สมดุลของอุปสรรคน้ำและบังเกอร์ในเกือบทุกหลุม แฟร์เวย์ยาวและกว้างเป็นลักษณะเด่นของสนาม โดยมีการวางตำแหน่งบ่อน้ำและทะเลสาบอย่างมีชั้นเชิง ซึ่งเรียกร้องช็อตเข้ากรีนที่แม่นยำมากกว่าจะเป็นการวางอุปสรรคเพื่อลงโทษผู้เล่น มีผู้บรรยายว่ากรีนที่นี่เร็ว ซึ่งเมื่อรวมกับระยะสนามที่ยาวแล้วทำให้สนามนี้เป็นบททดสอบแม้สำหรับผู้เล่นแฮนดิแคปต่ำ ภายในรีสอร์ตยังมีส่วนของ Artitaya Golf Resort ขนาด 36 หลุมที่มีบุคลิกใกล้เคียงกัน สิ่งอำนวยความสะดวกภายในพื้นที่ประกอบด้วยที่พัก สปา นวด ร้านอาหาร และไฟส่องสว่างสำหรับเล่นกอล์ฟกลางคืน ทำให้เป็นจุดหมายปลายทางกอล์ฟหลายวันนอกเมืองได้จริง`,
        tips: `อัตราสำหรับผู้มาเยือนที่ประกาศไว้เป็นราคาแพ็กเกจที่รวมค่าแคดดี้และรถกอล์ฟไว้แล้ว อยู่ที่ประมาณ 1,200 บาทในวันธรรมดา และ 1,400 บาทในวันเสาร์อาทิตย์ ส่วนโปรโมชันวันจันทร์-อังคารและสปอร์ตเดย์มักต่ำกว่า 1,000 บาทแบบรวมทุกอย่าง ควรยืนยันอัตราปัจจุบันเมื่อทำการจอง ผู้เล่นส่วนใหญ่ของสนามเป็นนักกอล์ฟชาวเกาหลี หากกังวลเรื่องจังหวะการเล่นที่ช้า ควรเลือกช่วงเช้าของกลางสัปดาห์ รีสอร์ตอยู่ห่างจากใจกลางกรุงเทพฯ โดยรถยนต์ใช้เวลาประมาณ 75 นาที จึงควรวางแผนออกเดินทางแต่เช้า มีบริการกอล์ฟกลางคืน ซึ่งเป็นทางหนีความร้อนช่วงกลางวันที่ใช้ได้ผลดี มีบริการเช่าไม้กอล์ฟภายในสนาม แต่ควรสอบถามยี่ห้อและค่าบริการที่แน่นอนกับทางรีสอร์ตโดยตรง`,
        location_and_access: `Artitaya Country Club ตั้งอยู่เลขที่ 16 หมู่ 10 ถนนรังสิต-องครักษ์ (คลอง 14 กม. 9) อำเภอองครักษ์ จังหวัดนครนายก 26120 จังหวัดนครนายกอยู่ทางตะวันออกเฉียงเหนือของกรุงเทพฯ เข้าถึงได้ผ่านทางหลวงหมายเลข 305 (ถนนรังสิต-นครนายก) การขับรถจากใจกลางกรุงเทพฯ มีระยะทางประมาณ 90 กิโลเมตร และใช้เวลาประมาณ 75 นาทีในสภาพการจราจรที่ไม่ติดขัดนัก ไม่มีระบบขนส่งสาธารณะที่ไปถึงสนาม รถส่วนตัว รถเช่า หรือแท็กซี่จึงเป็นทางเลือกเดียวที่ใช้ได้จริง บรรยากาศชนบทอันงดงามใกล้เชิงเขาของนครนายกทำให้การขับรถไปเป็นเรื่องน่าเพลิดเพลิน`,
        rental_cta_context: `แพ็กเกจรวมทุกอย่างในราคาคุ้มค่าของ Artitaya ทำให้ยังเหลืองบประมาณสำหรับอุปกรณ์ที่ดีกว่า จับคู่การออกรอบของคุณกับไม้กอล์ฟให้เช่าระดับพรีเมียมของ LENGOLF จากกรุงเทพฯ ที่จัดส่งถึงโรงแรมของคุณในคืนก่อนวันที่คุณจะขับรถออกไปยังนครนายก`,
      },
    },
    ko: {
      title: `Artitaya Country Club 패키지 요금 — 나콘나욕 챔피언십 코스 가이드`,
      meta_description: `Artitaya Country Club 패키지 요금은 평일 약 1,200바트, 주말 약 1,400바트로 그린피와 캐디, 카트가 모두 포함돼 있습니다. 방콕 북동쪽 나콘나욕주 Ongkharak 지구에 자리한 7,054야드 파 72 챔피언십 코스 안내와, 방콕 호텔로 배달되는 LENGOLF 클럽 대여를 함께 정리했습니다.`,
      prose: {
        overview: `Artitaya Country Club은 방콕에서 북동쪽으로 약 75~90km 떨어진 나콘나욕주 Ongkharak 지구에 자리한 36홀 리조트 복합 단지로, 예전 이름은 Bangkok Royal Country Club입니다. 18홀 챔피언십 코스는 Jack Tuthill의 설계로 1994년에 문을 열었으며, 그는 미국 Kemper Lakes를 비롯한 코스에 이름을 올린 설계가입니다. 방콕 시장에서 보면 가격 대비 만족도가 탄탄한 편입니다. 공개된 방문객 패키지 요금은 7,054야드 파 72 레이아웃에 평일 약 1,200바트, 주말 약 1,400바트이며, 그린피와 캐디, 카트가 한데 묶인 가격입니다. 월요일~화요일과 스포츠 데이 프로모션을 이용하면 모든 비용을 합친 한 라운드가 1,000바트 아래로 내려가기도 합니다. 이 리조트는 한국계 소유이고 이용객의 약 90%가 한국 국적이어서, 진행 속도에 대한 기대치를 잡을 때 함께 고려할 만합니다.`,
        layout_and_experience: `챔피언십 코스는 블루 티에서 7,054야드에 이르는데, 어떤 잣대로 보아도 상당한 길이입니다. 평탄한 파크랜드 지형 위에 펼쳐지고, 대부분의 홀에 워터 해저드와 벙커가 균형 있게 배치돼 있습니다. 길고 넓은 페어웨이가 기본이며, 연못과 호수를 전략적으로 배치해 벌타를 노린 배치라기보다 정확한 어프로치 샷을 요구하는 쪽입니다. 그린은 빠르다고 알려져 있어, 긴 거리와 맞물리면 로우 핸디캐퍼에게도 만만치 않은 시험대가 됩니다. 리조트에는 성격이 비슷한 Artitaya Golf Resort 36홀 구역도 있습니다. 부지 안에는 숙소와 스파, 마사지, 레스토랑이 갖춰져 있고 야간 골프도 가능해, 도시를 벗어나 여러 날 머무는 골프 목적지로도 충분히 성립합니다.`,
        tips: `공개된 방문객 요금은 캐디와 카트가 이미 포함된 패키지 가격으로, 평일 약 1,200바트, 주말 약 1,400바트입니다. 월요일~화요일과 스포츠 데이 프로모션은 모든 비용을 합쳐 1,000바트 아래인 경우가 많습니다. 예약할 때 현재 요금을 확인해 두세요. 이 코스는 한국 골퍼가 주로 찾는 곳이라, 느린 진행 속도가 걱정된다면 주중 오전을 노리는 편이 좋습니다. 리조트는 방콕 도심에서 차로 약 75분 거리이니 이른 출발을 계획해 두세요. 야간 골프를 운영해 한낮의 더위를 피하는 방법으로도 쓸모가 있습니다. 클럽 대여는 현장에서 가능하지만, 구체적인 브랜드와 요금은 리조트에 직접 확인하는 편이 가장 확실합니다.`,
        location_and_access: `Artitaya Country Club 주소는 16 Moo 10, Rangsit-Ongkarak Road (Klong 14, Km. 9), Ongkharak, Nakhon Nayok 26120입니다. 나콘나욕주는 방콕 북동쪽에 있으며, 305번 국도(Rangsit–Nakhon Nayok Road)로 연결됩니다. 방콕 도심에서 약 90km 거리이고, 교통이 무난할 때 차로 약 75분 걸립니다. 코스까지 가는 대중교통은 없어서 자가용이나 렌터카, 택시가 유일하게 현실적인 방법입니다. 나콘나욕 산기슭과 가까운 시골 풍경 덕분에 가는 길 자체도 기분 좋습니다.`,
        rental_cta_context: `Artitaya 코스의 가격 대비 알찬 올인클루시브 패키지는 장비에 조금 더 투자할 여유를 남겨 줍니다. 라운딩에 맞춰 LENGOLF의 프리미엄 대여 클럽을 방콕에서 함께 준비해 보세요. 나콘나욕으로 차를 몰고 나가기 전날 밤, 호텔로 배달해 드립니다.`,
      },
    },
    zh: {
      title: `Artitaya Country Club套餐价 — 那空那育18洞锦标赛球场攻略与球杆租借`,
      meta_description: `Artitaya Country Club访客套餐价平日约1,200泰铢、周末约1,400泰铢，果岭费、球童与球车全包。球场位于那空那育府Ongkharak，7,054码、标准杆72，另有送抵曼谷酒店的LENGOLF球杆租借。`,
      prose: {
        overview: `Artitaya Country Club前身为Bangkok Royal Country Club，是一座位于那空那育府Ongkharak的36洞度假村综合体，在曼谷东北方向约75–90公里处。18洞锦标赛球场由Jack Tuthill设计（他的作品还包括美国的Kemper Lakes等球场），1994年启用，放在曼谷一带的行情里算得上物有所值：公布的访客套餐价约为平日1,200泰铢、周末1,400泰铢，对应这座7,054码、标准杆72的球场，果岭费、球童和球车全部打包在内。周一至周二以及运动日的促销，有时能让一场全包的球降到1,000泰铢以下。这家度假村为韩资所有，约90%的客人是韩国籍，这一点在预估打球节奏时值得一并考虑。`,
        layout_and_experience: `锦标赛球场自蓝色发球台起量为7,054码，无论以什么标准衡量都相当有长度，铺展在平坦的林荫公园式地形上，大部分球洞都以水障碍和沙坑做出均衡的搭配。球道普遍又长又宽，池塘与湖泊的位置经过战略性安排，要求的是精准的攻果岭球，而不是以罚杆为导向的布置。果岭据称速度很快，配上这样的长度，即便是低差点球手也会觉得是一场考验。度假村内还有一片风格相近的Artitaya Golf Resort 36洞区域。场内设施包括住宿、水疗、按摩、餐厅，并具备夜间打球的条件，因此把它当作城外的多日高尔夫目的地也行得通。`,
        tips: `公布的访客价格是已经含球童和球车的套餐价——平日约1,200泰铢、周末约1,400泰铢，周一至周二和运动日的促销往往全包不到1,000泰铢。订场时请确认当前的价格。这座球场的客人以韩国球手为主，如果你在意打球节奏偏慢，可以尽量安排在周中的上午。度假村距曼谷市中心车程约75分钟，出发时间要往早里安排。这里提供夜间打球，是避开正午暑热的实用办法。场内可以租借球杆，不过具体的品牌和费用最好直接向度假村确认。`,
        location_and_access: `Artitaya Country Club地址为16 Moo 10, Rangsit-Ongkarak Road (Klong 14, Km. 9), Ongkharak, Nakhon Nayok 26120。那空那育府在曼谷东北方，可经305号公路（Rangsit–Nakhon Nayok Road）前往。自曼谷市中心驾车约90公里，路况正常时约75分钟。没有公共交通可以直达球场，自驾、租车或出租车是唯一实际可行的方式。球场靠近那空那育的山麓，沿途乡野风光宜人，开车过去本身也算享受。`,
        rental_cta_context: `Artitaya高性价比的全包套餐，让你的预算还留得下更好的装备。不妨为这场球配上LENGOLF在曼谷提供的高级租借球杆——在你驱车前往那空那育的前一晚送到你的酒店。`,
      },
    },
    ja: {
      title: `Artitaya Country Club（ナコンナヨック）— パッケージ料金・コース紹介・クラブレンタル`,
      meta_description: `ビジター向けパッケージ料金は平日約1,200THB、週末約1,400THBで、グリーンフィー・キャディー・カート込み。Artitaya Country Clubはバンコク北東のナコンナヨック県オンカラックにある7,054ヤード、パー72のチャンピオンシップコースです。バンコクのホテルへ届くLENGOLFのクラブレンタルもご案内します。`,
      prose: {
        overview: `Artitaya Country Clubは、旧称をBangkok Royal Country Clubといい、バンコクの北東約75〜90kmに位置するナコンナヨック県オンカラックの36ホールのリゾートコンプレックスです。18ホールのチャンピオンシップコースはJack Tuthill（米国のKemper Lakesなどを手がけた設計家）の設計により1994年に開場し、バンコク圏の相場のなかでは確かな値ごろ感があります。公表されているビジター向けパッケージ料金は、7,054ヤード、パー72のレイアウトに対して平日約1,200THB、週末約1,400THB。グリーンフィー、キャディー、カートが一括りになった価格です。月曜〜火曜やスポーツデーのプロモーションを使えば、すべて込みのラウンドが1,000THBを下回ることもあります。このリゾートは韓国資本の経営で、利用客の約90%が韓国籍。プレー進行のペースについて期待値を考えるうえで、頭に入れておく価値があります。`,
        layout_and_experience: `チャンピオンシップコースはブルーティーから7,054ヤードあり、どの基準で見てもかなりの距離です。平坦なパークランドの地形に広がり、ほとんどのホールでウォーターハザードとバンカーがバランスよく配されています。長く幅のあるフェアウェイが基本で、池や湖は戦略的に配置されており、罰打を狙わせる置き方というよりは正確なアプローチショットを求めるつくり。グリーンは速いとされ、距離の長さと相まって、ローハンディキャッパーにとっても試されるコースになっています。リゾート内には性格の近いArtitaya Golf Resortの36ホールのセクションもあります。敷地内には宿泊施設、スパ、マッサージ、レストランがあり、ナイトゴルフにも対応。郊外で数日を過ごすゴルフ目的地としても成立します。`,
        tips: `公表されているビジター料金は、キャディーとカートがすでに含まれたパッケージ価格で、平日約1,200THB、週末約1,400THB。月曜〜火曜やスポーツデーのプロモーションでは、すべて込みで1,000THBを下回ることもよくあります。予約の際に最新の料金をご確認ください。このコースは韓国人ゴルファーの利用が中心のため、進行の遅さが気になる場合は平日の午前を狙うのがおすすめです。リゾートはバンコク中心部から車でおよそ75分。早めの出発を計画してください。ナイトゴルフが利用でき、日中の暑さを避ける手立てとして有効です。クラブレンタルは現地で利用できますが、具体的なブランドと料金はリゾートに直接ご確認いただくのが確実です。`,
        location_and_access: `Artitaya Country Clubの所在地は16 Moo 10, Rangsit-Ongkarak Road (Klong 14, Km. 9), Ongkharak, Nakhon Nayok 26120です。ナコンナヨック県はバンコクの北東にあり、国道305号線（ランシット〜ナコンナヨック道路）でアクセスします。バンコク中心部からの道のりは約90km、交通量が落ち着いていれば車で約75分です。コースまでの公共交通機関はなく、自家用車、レンタカー、タクシーが現実的な唯一の手段となります。ナコンナヨックの山裾に近い田園の風景が広がり、ドライブそのものも気持ちのよいものです。`,
        rental_cta_context: `Artitayaの値ごろなオールインクルーシブのパッケージなら、道具にもう少し予算を回す余裕が生まれます。ラウンドにはバンコクのLENGOLFのプレミアムレンタルクラブを合わせてみてください。ナコンナヨックへ車で向かう前夜に、ホテルまでお届けします。`,
      },
    },
  },
  status: 'published',
  published_at: '2026-04-20',
}
